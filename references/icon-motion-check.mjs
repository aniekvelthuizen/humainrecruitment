// Headless check of the card icon motion (decisions/motion.md). Node 22+, Chrome, no dependencies.
//   node references/icon-motion-check.mjs [outdir]        PATCH=1 injects the style of references/embeds/icon-motion.html and references/embeds/icon-motion.js (before it is published)
// Per page: card icons found / converted / left to Stagger Cards, running vs paused, console errors, reduced motion = untouched;
// close-ups of every converted icon at three moments.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const out = process.argv[2] || './icon-motion-out'; fs.mkdirSync(out, { recursive: true });
const base = process.env.BASE || 'https://humain-dev.webflow.io';
const pages = (process.env.PAGES || '/,/hire-an-expert,/project-delivery-experts,/consulting-services,/project-controls,/how-it-works').split(',');
const embed = fs.readFileSync(new URL('./embeds/icon-motion.html', import.meta.url), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hicm-'));
const chrome = spawn(process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let tabs; for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; let errors = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || '').slice(0, 200));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value || a.description).join(' ')); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable'); await send('Page.enable');
if (process.env.PATCH) {
  const style = embed.match(/<style>([\s\S]*?)<\/style>/)[1], script = fs.readFileSync(new URL('./embeds/icon-motion.js', import.meta.url), 'utf8');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('readystatechange',function f(){if(document.readyState!=='interactive')return;document.removeEventListener('readystatechange',f);var s=document.createElement('style');s.textContent=${JSON.stringify(style)};document.head.appendChild(s);(0,eval)(${JSON.stringify(script)});});` });
}
const info = `(() => { const a = [...document.querySelectorAll('.card_primary_icon>.icon_set_wrap')];
  return { icons: a.length, mine: a.filter((e) => e.hasAttribute('data-icon')).length, stagger: a.filter((e) => e.hasAttribute('data-icon-motion')).length,
    plain: a.filter((e) => !e.hasAttribute('data-icon') && !e.hasAttribute('data-icon-motion')).map((e) => e.getAttribute('data-wf--icon-set--variant')),
    running: a.filter((e) => e.hasAttribute('data-icon-run')).length }; })()`;
for (const reduced of [false, true]) {
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
  for (const p of pages) {
    errors = [];
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
    await send('Page.navigate', { url: base + p }); await sleep(3500);
    const i = await ev(info);
    console.log(reduced ? 'reduced' : 'motion ', p.padEnd(26), JSON.stringify(i), errors.length ? 'ERRORS ' + JSON.stringify(errors) : '');
    if (reduced) continue;
    const ids = await ev(`[...document.querySelectorAll('[data-icon]')].map((e, n) => (e.dataset.n = n, n))`);
    for (const n of ids) {
      const v = await ev(`(() => { const e = document.querySelector('[data-icon][data-n="${n}"]'); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 400); return e.dataset.icon; })()`);
      for (const [k, wait] of [[0, 400], [1, 900], [2, 1500]]) {
        await sleep(wait);
        const b = await ev(`(() => { const r = document.querySelector('[data-icon][data-n="${n}"]').getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, document.querySelector('[data-icon][data-n="${n}"]').hasAttribute('data-icon-run')]; })()`);
        const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: b[0] - 6, y: b[1] - 6, width: b[2] + 12, height: b[2] + 12, scale: 3 } });
        fs.writeFileSync(path.join(out, `${p.replace(/\//g, '_') || '_'}-${String(n).padStart(2, '0')}-${v}-${k}${b[3] ? '' : '-PAUSED'}.png`), Buffer.from(s.result.data, 'base64'));
      }
    }
  }
}
ws.close(); chrome.kill();
