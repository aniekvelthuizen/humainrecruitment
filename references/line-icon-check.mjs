// Headless check of the line-icon motion (decisions/motion.md, 2026-11-12). Node 22+, Chrome, no dependencies.
//   node references/line-icon-check.mjs [url] [outdir]      PATCH=1 injects references/embeds/line-icon-motion.html (before it is published)
// Per page: how many card icons were built, the draw / fill / glint state sampled after the first icon scrolls into view,
// close-up screenshots of that icon over time, the same page with reduced motion (must stay mask icons), console errors.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/project-delivery-experts';
const out = process.argv[3] || './line-icon-out';
fs.mkdirSync(out, { recursive: true });
const embed = fs.readFileSync(new URL('./embeds/line-icon-motion.html', import.meta.url), 'utf8');
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hlicon-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; const errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable');
await send('Page.enable');
if (process.env.PATCH) {
  // Inject the embed's style and script as soon as the document exists, the way the Global Custom Code embed would run.
  const style = embed.match(/<style>([\s\S]*?)<\/style>/)[1];
  const script = embed.match(/<script>([\s\S]*?)<\/script>/)[1];
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('readystatechange',function f(){if(document.readyState!=='interactive')return;document.removeEventListener('readystatechange',f);if(document.documentElement.innerHTML.indexOf('lineIconMotion')>-1&&window.lineIconMotion)return;var s=document.createElement('style');s.textContent=${JSON.stringify(style)};document.head.appendChild(s);(0,eval)(${JSON.stringify(script)});});` });
}

const sample = `(() => {
  const el = document.querySelector('[data-line-icon]'); if (!el) return null;
  const n = (v) => Math.round(parseFloat(v) * 100) / 100;
  const q = (s) => el.querySelector(s);
  return { state: el.getAttribute('data-line-icon'), paused: el.hasAttribute('data-line-icon-paused'),
    draw: n(getComputedStyle(q('[data-li=draw] path')).strokeDashoffset), drawOp: n(getComputedStyle(q('[data-li=draw]')).opacity),
    fill: n(getComputedStyle(q('[data-li=fill]')).opacity), glint: n(getComputedStyle(q('[data-li=glint] path')).strokeDashoffset), glintOp: n(getComputedStyle(q('[data-li=glint] path')).opacity) };
})()`;

async function run(reduced) {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
  await send('Page.navigate', { url });
  await sleep(3500);
  const info = await ev(`(() => { const all = [...document.querySelectorAll('.card_primary_icon>.icon_set_wrap')];
    return { icons: all.length, built: document.querySelectorAll('[data-line-icon]').length, gate: document.documentElement.hasAttribute('data-line-icon-gate'),
      hiddenUnbuilt: all.filter((e) => !e.hasAttribute('data-line-icon') && getComputedStyle(e).visibility === 'hidden').length }; })()`);
  console.log(reduced ? 'reduced motion' : 'motion', JSON.stringify(info));
  if (reduced || !info.built) return;
  await ev(`(() => { const el = document.querySelector('[data-line-icon]'); const y = el.getBoundingClientRect().top + scrollY - 400; window.scrollTo(0, y); })()`);
  const t0 = Date.now();
  for (let i = 0; i < 26; i++) {
    const s = await ev(sample);
    const box = await ev(`(() => { const b = document.querySelector('[data-line-icon]').getBoundingClientRect(); return [b.x + scrollX, b.y + scrollY, b.width, b.height]; })()`);
    if ([1, 3, 5, 8, 12, 17, 18, 19, 20].includes(i)) {
      const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: box[0] - 8 + (process.env.WIDE ? -300 : 0), y: box[1] - 8 + (process.env.WIDE ? -100 : 0), width: box[2] + 16 + (process.env.WIDE ? 600 : 0), height: box[3] + 16 + (process.env.WIDE ? 300 : 0), scale: process.env.WIDE ? 1 : 4 } });
      fs.writeFileSync(path.join(out, `icon-${String(Date.now() - t0).padStart(5, '0')}.png`), Buffer.from(shot.result.data, 'base64'));
    }
    console.log(String(Date.now() - t0).padStart(5), JSON.stringify(s));
    await sleep(i < 16 ? 150 : 250);
  }
}
await run(false);
await run(true);
console.log('errors:', errors.length ? errors : 'none');
ws.close();
chrome.kill();
