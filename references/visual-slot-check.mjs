// Headless check of Split Content with a Visual slot (Score Chart, Step List) on a published page (Node 22+, Chrome, no dependencies).
//   node references/visual-slot-check.mjs [url] [outdir]
// Per width: section height, text/visual/slot boxes relative to the section, bar segments (width + colour),
// legend rows, step rows and their numbers, glow, photo vs slot visibility, sideways overflow, console errors,
// a screenshot per section. Figma targets at 1512 are in decisions/components/split-content.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/project-delivery-experts';
const out = process.argv[3] || './visual-slot-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,479,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hvis-'));
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
const shot = async (file, index) => {
  const b = await ev(`(() => { const r = document.querySelectorAll('[data-split-content]')[${index}].getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');

const measure = `(() => [...document.querySelectorAll('[data-split-content]')].map((s) => {
  const sb = s.getBoundingClientRect();
  const rel = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); if (!b.width && !b.height) return 'hidden';
    return [Math.round(b.left - sb.left), Math.round(b.top - sb.top), Math.round(b.width), Math.round(b.height)]; };
  const q = (sel) => s.querySelector(sel);
  return { height: Math.round(sb.height), glow: s.dataset.glow, bg: getComputedStyle(s).backgroundImage.slice(0, 80),
    eyebrow: rel(q('.split-content_eyebrow')), title: rel(q('.split-content_title')), text: rel(q('.split-content_text')),
    textHtml: q('.split-content_text') && q('.split-content_text').innerHTML.slice(0, 160),
    visual: rel(q('.split-content_visual')), slot: rel(q('.split-content_slot')),
    bar: rel(q('[data-score-bar]')),
    segments: [...s.querySelectorAll('[data-score-bar] > *')].map((e) => [Math.round(e.getBoundingClientRect().width), getComputedStyle(e).backgroundColor]),
    legend: [...s.querySelectorAll('[data-score-item]')].map((e) => [rel(e), e.innerText.replace(/\\n/g, ' | '), getComputedStyle(e.querySelector('.score-chart_dot')).backgroundColor]),
    steps: [...s.querySelectorAll('[data-step-item]')].map((e) => [rel(e), getComputedStyle(e.querySelector('.step-list_number'), '::before').content, rel(e.querySelector('.step-list_number')), e.innerText]),
  };
}))()`;

const report = { url, widths: {} };
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url });
  await sleep(4000);
  const sections = await ev(measure);
  const overflow = await ev('document.documentElement.scrollWidth - innerWidth');
  report.widths[w] = { overflow, sections };
  for (let i = 0; i < sections.length; i++) await shot(`w${w}-s${i}.png`, i);
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
process.exit(0);
