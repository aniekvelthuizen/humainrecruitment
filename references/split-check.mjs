// Headless check of the Split Content sections on a published page (Node 22+, Chrome, no dependencies).
//   node references/split-check.mjs [url] [outdir]
// Per width: boxes of the parts relative to each section top (texts are untrimmed here, so boxes = Figma boxes),
// fonts, links, sideways overflow, console errors, a screenshot per section.
// Then two patched previews of the first section: Image Left (variant class added) and a checklist
// (List shown with Card Bullet Large clones), because Home uses neither.
// Figma targets at 1512 are in decisions/components/split-content.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './split-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,402').split(',').map(Number);
const IMAGE_LEFT = 'w-variant-60a878d8-c287-2b13-3899-ef1dca2aeeaf';
const BULLET_LARGE = 'w-variant-84a7442c-960a-603c-d501-6352dacde64a';
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hsplit-'));
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
const shot = async (file, sel, index = 0) => {
  const b = await ev(`(() => { const r = document.querySelectorAll('${sel}')[${index}].getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');

const measure = `(() => [...document.querySelectorAll('[data-split-content]')].map((s) => {
  const sb = s.getBoundingClientRect();
  const box = (sel) => { const e = s.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); if (!b.width && !b.height) return 'hidden';
    return [Math.round(b.left - sb.left), Math.round(b.top - sb.top), Math.round(b.width), Math.round(b.height)]; };
  const font = (sel) => { const e = s.querySelector(sel); if (!e) return null; const c = getComputedStyle(e); return c.fontFamily.split(',')[0] + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.color; };
  return { height: Math.round(sb.height), spaceTop: s.dataset.spaceTop,
    eyebrow: box('.split-content_eyebrow'), title: box('.split-content_title'), text: box('.split-content_text'), quote: box('.split-content_quote'),
    list: box('.split-content_list'), bullets: [...s.querySelectorAll('.split-content_list .card_bullet')].map((b) => { const r = b.getBoundingClientRect(); return [Math.round(r.left - sb.left), Math.round(r.top - sb.top), Math.round(r.width), Math.round(r.height)]; }),
    actions: box('.split-content_actions'), visual: box('.split-content_visual'),
    titleFont: font('.split-content_title'), mutedColor: getComputedStyle(s.querySelector('.split-content_muted')).color, quoteRule: s.querySelector('.split-content_quote') && getComputedStyle(s.querySelector('.split-content_quote')).borderLeft,
    buttons: [...s.querySelectorAll('.split-content_actions a')].map((a) => a.getAttribute('href')),
    img: (() => { const i = s.querySelector('.split-content_visual img'); return i && [i.currentSrc.split('/').pop(), i.alt]; })() };
}))()`;

const report = { url, widths: {} };
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
  await sleep(4500);
  await ev(`document.querySelectorAll('[data-split-content] img').forEach((i) => (i.loading = 'eager'))`); await sleep(1500);
  report.widths[w] ={ scrollWidth: await ev('document.documentElement.scrollWidth'), sections: await ev(measure) };
  const n = report.widths[w].sections.length;
  for (let i = 0; i < n; i++) await shot(`split-${i + 1}-${w}.png`, '[data-split-content]', i);
}

// Patched previews at 1512 and 402: Image Left, and a checklist of 6 Card Bullet Large items.
const patch = `(() => {
  const s = document.querySelector('[data-split-content]');
  s.querySelectorAll('.split-content_layout, .split-content_visual').forEach((e) => e.classList.add('${IMAGE_LEFT}'));
  const q = s.querySelector('.split-content_quote'); const src = document.querySelector('.card_bullet');
  const list = document.createElement('div'); list.className = 'split-content_list'; list.setAttribute('role', 'list');
  ['Scoped deliverables, not open-ended engagements', 'Transparent fee', 'One point of contact', 'In pretium quis faucibus', 'Quam viverra enim', 'Magna pulvinar ac non'].forEach((t) => {
    const b = src.cloneNode(true);
    [b, ...b.querySelectorAll('.card_bullet_icon, .card_bullet_text')].forEach((e) => e.classList.add('${BULLET_LARGE}'));
    b.querySelector('.card_bullet_text').firstElementChild.textContent = t; list.appendChild(b); });
  q.replaceWith(list); return true; })()`;
for (const w of [1512, 402]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
  await sleep(4500);
  await ev(patch); await ev(`document.querySelectorAll('[data-split-content] img').forEach((i) => (i.loading = 'eager'))`); await sleep(1500);
  report[`patched${w}`] = { scrollWidth: await ev('document.documentElement.scrollWidth'), section: (await ev(measure))[0],
    bulletFont: await ev(`(() => { const t = document.querySelector('.split-content_list .card_bullet_text .u-text, .split-content_list .card_bullet_text > *'); const c = getComputedStyle(t); return c.fontSize + '/' + c.lineHeight; })()`),
    bulletIcon: await ev(`(() => { const i = document.querySelector('.split-content_list .card_bullet_icon').getBoundingClientRect(); return [Math.round(i.width), Math.round(i.height)]; })()`) };
  await shot(`split-patched-${w}.png`, '[data-split-content]', 0);
}

report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill();
process.exit(0);
