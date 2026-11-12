// Headless check of the Stage Certified glow (decisions/motion.md, 2026-11-12) on a published page (Node 22+, Chrome, no dependencies).
//   WIDTH=1440 node references/stage-glow-check.mjs [url] [outdir]
// The mint stage card is white until it is in view; then it turns mint (once). Grid: by scrolling. Slider: by sliding to it.
// Then with reduced motion: mint at once, no attribute. Console errors listed.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/project-delivery-experts';
const out = process.argv[3] || './stage-glow-out';
const width = Number(process.env.WIDTH || 1440);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hstage-'));
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
const shot = async (file) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64')); };

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
const report = { url, width };
const STATE = `(() => [...document.querySelectorAll('[data-wf--card-primary--variant="stage-certified"] .card_primary_element')].map((e) => {
  const r = e.getBoundingClientRect(); return { inSlider: !!e.closest('[data-stage-slider]'), glow: e.dataset.stageGlow || null,
  veil: +(+getComputedStyle(e, '::before').opacity).toFixed(2), bg: getComputedStyle(e).backgroundImage.slice(0, 15), x: Math.round(r.left), y: Math.round(r.top) }; }))()`;

await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
await sleep(4000);
report.atLoad = await ev(STATE);
// Grid card: scroll to it, sample the veil while it fades.
await ev(`document.querySelector('[data-card-grid] [data-wf--card-primary--variant="stage-certified"]').scrollIntoView({ block: 'center' })`);
report.gridFade = [];
for (const t of [100, 500, 900, 1300, 1800]) { await sleep(t - (report.gridFade.at(-1)?.t || 0)); report.gridFade.push({ t, veil: (await ev(STATE)).find((s) => !s.inSlider).veil }); }
await shot(`grid-${width}.png`);
// Slider: row in view, card 9 still off screen → white.
await ev(`document.querySelector('[data-stage-slider]').scrollIntoView({ block: 'center' })`);
await sleep(1500);
report.sliderRowInView = (await ev(STATE)).find((s) => s.inSlider);
await shot(`slider-before-${width}.png`);
// Slide to the end with the own Next arrow.
for (let i = 0; i < 12; i++) { await ev(`document.querySelectorAll('[data-stage-slider] .stage-slider_arrow')[1].click()`); await sleep(350); }
await sleep(2000);
report.sliderAtEnd = (await ev(STATE)).find((s) => s.inSlider);
await shot(`slider-after-${width}.png`);

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
await sleep(3500);
report.reduced = await ev(STATE);
report.errors = errors;
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
