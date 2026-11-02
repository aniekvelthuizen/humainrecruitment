// Headless hover/focus check of Card Testimonial (Node 22+, Chrome, no dependencies).
//   node references/testimonial-hover-check.mjs [url] [outdir]
// Per card: veil opacity, lift and arrow nudge at rest, on mouse hover and on keyboard focus; screenshots of the first card.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './testimonial-hover-out';
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hthov-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; const errors = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; } if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1512, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: url + '?v=' + Date.now() }); await sleep(5000);
const state = (i) => `(() => { const c = document.querySelectorAll('.card_testimonial_element')[${i}]; const v = c.querySelector('.card_testimonial_visual'); const a = c.querySelector('.card_testimonial_arrow'); const q = c.querySelector('.card_testimonial_quote-hover');
  return { name: c.querySelector('.card_testimonial_name')?.textContent.trim().slice(0, 20), veil: v ? getComputedStyle(v).opacity : 'none', veilBg: v ? getComputedStyle(v).backgroundColor : '', lift: getComputedStyle(c).transform, arrow: a ? getComputedStyle(a).transform : 'none', clickable: !!c.querySelector('a, button'), quoteDark: q ? [getComputedStyle(q).opacity, getComputedStyle(q).color, ...(() => { const r = q.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })(), getComputedStyle(q.firstElementChild || q).backgroundColor, Math.round((q.firstElementChild || q).getBoundingClientRect().height)] : 'none' }; })()`;
const report = { cards: [] };
const n = await ev(`document.querySelectorAll('.card_testimonial_element').length`);
for (let i = 0; i < n; i++) {
  const b = await ev(`(() => { const c = document.querySelectorAll('.card_testimonial_element')[${i}]; c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top + scrollY, left: r.left, w: r.width, h: r.height }; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 }); await sleep(700);
  const rest = await ev(state(i));
  if (i === 0) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: b.left - 20, y: b.top - 20, width: b.w + 40, height: b.h + 40, scale: 1 } }); fs.writeFileSync(path.join(out, 'card-rest.png'), Buffer.from(s.result.data, 'base64')); }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: b.x, y: b.y }); await sleep(700);
  const hover = await ev(state(i));
  if (i === 0) { const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: b.left - 20, y: b.top - 20, width: b.w + 40, height: b.h + 40, scale: 1 } }); fs.writeFileSync(path.join(out, 'card-hover.png'), Buffer.from(s.result.data, 'base64')); }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 }); await sleep(100);
  await ev(`document.querySelectorAll('.card_testimonial_element')[${i}].querySelector('a, button')?.focus({ focusVisible: true })`); await sleep(700);
  const focus = await ev(state(i));
  await ev(`document.activeElement?.blur()`);
  report.cards.push({ rest, hover, focus });
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill(); process.exit(0);
