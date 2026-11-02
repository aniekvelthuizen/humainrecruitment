// Headless check of the Spotlight Grid section on a published page (Node 22+, Chrome, no dependencies).
//   node references/spotlight-check.mjs [url] [outdir]
// Per width: boxes of the parts relative to the section top (header texts and quote are untrimmed, so boxes = Figma boxes),
// card boxes, fonts and colours, links, roles, sideways overflow, text outside its box, console errors, a screenshot.
// Figma targets at 1512 are in decisions/components/spotlight-grid.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './spotlight-out';
const widths = (process.env.WIDTHS || '1512,1280,992,991,767,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hspot-'));
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
const shot = async (file) => {
  const b = await ev(`(() => { const r = document.querySelector('[data-spotlight-grid]').getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');

const measure = `(() => { const s = document.querySelector('[data-spotlight-grid]'); if (!s) return null;
  const sb = s.getBoundingClientRect();
  const rel = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.left - sb.left), Math.round(b.top - sb.top), Math.round(b.width), Math.round(b.height)]; };
  const box = (sel) => { const e = s.querySelector(sel); return e ? rel(e) : null; };
  const font = (sel) => { const e = s.querySelector(sel); if (!e) return null; const c = getComputedStyle(e); return c.fontFamily.split(',')[0] + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.fontWeight + ' ' + c.color + ' op' + c.opacity + ' ' + c.textTransform; };
  const cards = [...s.querySelectorAll('.spotlight-grid_list > * > *, .spotlight-grid_list > [role="listitem"]')].filter((e) => e.getBoundingClientRect().height > 40);
  const overflow = [...s.querySelectorAll('p, h2, h3, blockquote, a')].filter((e) => e.getBoundingClientRect().width > 0).filter((e) => { const p = e.closest('.card_primary_element, .spotlight-grid_panel, .spotlight-grid_header'); if (!p) return false; const a = e.getBoundingClientRect(), b = p.getBoundingClientRect(); return a.right > b.right + 1 || a.left < b.left - 1; }).map((e) => e.textContent.trim().slice(0, 30));
  return { height: Math.round(sb.height), padTop: getComputedStyle(s).paddingTop, padBottom: getComputedStyle(s).paddingBottom,
    header: box('.spotlight-grid_header'), eyebrow: box('.spotlight-grid_eyebrow'), title: box('.spotlight-grid_title'), layout: box('.spotlight-grid_layout'),
    lists: [...s.querySelectorAll('.spotlight-grid_list')].map(rel), panel: box('.spotlight-grid_panel'), quote: box('.spotlight-grid_quote-text'),
    name: box('.spotlight-grid_name'), role: box('.spotlight-grid_role'), company: box('.spotlight-grid_company'), visual: box('.spotlight-grid_visual'),
    cards: [...s.querySelectorAll('.card_primary_wrap, [class*="card_primary_wrap"]')].map((c) => [c.querySelector('.card_primary_title, h3, [class*="title"]')?.textContent.trim(), ...rel(c)]),
    cardTitles: [...s.querySelectorAll('[role="listitem"]')].map((c) => { const t = c.querySelector('h1,h2,h3,h4,h5,h6'); return t ? t.tagName + ' ' + t.textContent.trim() : 'no heading'; }),
    links: [...s.querySelectorAll('a')].map((a) => (a.getAttribute('href') || '') + ' | ' + (a.textContent.trim().slice(0, 40))),
    roles: { lists: s.querySelectorAll('[role="list"]').length, items: s.querySelectorAll('[role="list"] > * [role="listitem"], [role="list"] > [role="listitem"]').length },
    fonts: { eyebrow: font('.spotlight-grid_eyebrow'), title: font('.spotlight-grid_title'), muted: font('.spotlight-grid_muted'), quote: font('.spotlight-grid_quote-text'),
      name: font('.spotlight-grid_name'), role: font('.spotlight-grid_role'), company: font('.spotlight-grid_company') },
    panelBg: getComputedStyle(s.querySelector('.spotlight-grid_panel')).backgroundImage,
    img: (() => { const i = s.querySelector('.spotlight-grid_visual img'); return i && [i.currentSrc.split('/').pop(), i.alt, i.complete, i.naturalWidth]; })(),
    overflow };
})()`;

const report = { url, widths: {} };
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
  await sleep(4500);
  await ev(`document.querySelectorAll('[data-spotlight-grid] img').forEach((i) => (i.loading = 'eager'))`); await sleep(1500);
  report.widths[w] = { scrollWidth: await ev('document.documentElement.scrollWidth'), order: await ev(`[...document.querySelectorAll('main > *, #main > *')].map((e) => [...e.attributes].filter((a) => a.name.startsWith('data-') && a.name !== 'data-section').map((a) => a.name)[0] || e.className.split(' ')[0])`), section: await ev(measure) };
  await shot(`spotlight-${w}.png`);
}
report.headings = await ev(`[...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 40))`);
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill();
process.exit(0);
