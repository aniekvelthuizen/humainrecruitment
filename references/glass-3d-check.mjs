// Headless check of the Glass 3D script (donut + bars) — Node 22+, Chrome, no dependencies.
//   node references/glass-3d-check.mjs [url] [outdir]
// Per width: for every glass picture, scroll it into view, wait, then report the stage box vs the picture box,
// canvas/poster opacity, sideways scroll and console errors; screenshots of each stage at a few moments.
// Then the same page with reduced motion (expect: no stage, poster visible). Built by Aniek Velthuizen with Claude.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/project-delivery-experts';
const out = process.argv[3] || './glass-3d-out';
const widths = (process.env.WIDTHS || '1440,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hglass-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; let errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
const shot = async (file, clip) => { const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: false }); fs.writeFileSync(path.join(out, file), Buffer.from(r.result.data, 'base64')); };
await send('Page.enable'); await send('Runtime.enable');

const load = async (w, reduce) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
  errors = [];
  await send('Page.navigate', { url });
  await sleep(4000);
};
const PICS = `[...document.images].filter(i => i.dataset.glass3dOn !== undefined || /6aecbf15e512f468a8790720|6aec8809a21c0ac23d61166d/.test(i.getAttribute('src')||''))`;

for (const w of widths) {
  await load(w, false);
  const n = await ev(`${PICS}.length`);
  console.log(`\n== ${w}px: ${n} glass picture(s)`);
  for (let k = 0; k < n; k++) {
    await ev(`${PICS}[${k}].scrollIntoView({ block: 'center' }), 1`);
    const times = [1500, 3500, 7000];
    let prev = 0;
    for (const t of times) {
      await sleep(t - prev); prev = t;
      const r = await ev(`(() => { const img = ${PICS}[${k}]; const ir = img.getBoundingClientRect();
        const st = [...document.querySelectorAll('[data-glass-3d-stage]')].find(s => { const b = s.getBoundingClientRect(); return Math.abs(b.top - ir.top) < 2 && Math.abs(b.left - ir.left) < 2; });
        const sr = st?.getBoundingClientRect(); const cv = st?.querySelector('canvas');
        return { kind: st?.getAttribute('data-glass-3d-stage') || null, img: [ir.left, ir.top, ir.width, ir.height].map(Math.round), stage: sr ? [sr.left, sr.top, sr.width, sr.height].map(Math.round) : null,
          text: (() => { const c = img.closest('section')?.querySelector('[class$="_content"], [class*="_content "]'); const b = c?.getBoundingClientRect(); return b ? [b.left, b.top, b.width, b.height].map(Math.round) : null; })(), canvasOpacity: cv ? getComputedStyle(cv).opacity : null, posterOpacity: getComputedStyle(img).opacity, sy: scrollY, scrollX: document.documentElement.scrollWidth - innerWidth }; })()`);
      console.log(`  pic ${k} @${t}ms`, JSON.stringify(r));
      const ir = r.img; const pad = Math.round(Math.max(ir[2], ir[3]) * 0.3);
      const x = Math.max(0, ir[0] - pad), y = Math.max(0, ir[1] - pad);
      await shot(`w${w}-pic${k}-${t}.png`, { x, y: y + r.sy, width: Math.min(w - x, ir[2] + 2 * pad), height: Math.min(900 - y, ir[3] + 2 * pad) });
    }
    // Scroll sweep: the stage must stay on the picture while the page scrolls.
    const drift = [];
    for (const dy of [-500, -250, 250, 500]) {
      await ev(`${PICS}[${k}].scrollIntoView({ block: 'center' }), scrollBy(0, ${dy}), 1`); await sleep(400);
      drift.push(await ev(`(() => { const img = ${PICS}[${k}], ir = img.getBoundingClientRect(); const st = document.querySelector('[data-glass-3d-stage="' + (/6aecbf15e512f468a8790720/.test(${PICS}[${k}].getAttribute('src')) ? 'donut' : 'bars') + '"]'); const sr = st?.getBoundingClientRect(); return sr ? Math.round(sr.top - ir.top) + '/' + Math.round(sr.left - ir.left) : 'no stage'; })()`));
    }
    console.log(`  pic ${k} stage-minus-picture (top/left) while scrolling -500,-250,+250,+500:`, drift.join('  '));
    // Shift without a resize (a transform on the picture's parent): the stage must follow within a frame or two.
    await ev(`${PICS}[${k}].scrollIntoView({ block: 'center' }), ${PICS}[${k}].parentElement.style.transform = 'translateY(120px)', 1`); await sleep(1000);
    const shift = await ev(`(() => { const ir = ${PICS}[${k}].getBoundingClientRect(), sr = document.querySelector('[data-glass-3d-stage="' + (/6aecbf15e512f468a8790720/.test(${PICS}[${k}].getAttribute('src')) ? 'donut' : 'bars') + '"]')?.getBoundingClientRect(); return sr ? Math.round(sr.top - ir.top) + '/' + Math.round(sr.left - ir.left) : 'no stage'; })()`);
    await ev(`${PICS}[${k}].parentElement.style.transform = '', 1`);
    console.log(`  pic ${k} after a 120 px transform shift (top/left):`, shift);
  }
  console.log('  errors:', errors.length ? errors : 'none');
}

await load(widths[0], true);
const rm = await ev(`({ stages: document.querySelectorAll('[data-glass-3d-stage]').length, posters: ${PICS}.map(i => getComputedStyle(i).opacity) })`);
console.log(`\n== reduced motion ${widths[0]}px`, JSON.stringify(rm), 'errors:', errors.length ? errors : 'none');

ws.close(); chrome.kill();
