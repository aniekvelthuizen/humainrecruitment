// Headless check of Stagger Cards (Home "The risk") on a published page (Node 22+, Chrome, no dependencies).
//   node references/stagger-check.mjs [url] [outdir]
// Per width: positions of the header texts and cards relative to the section top (text boxes are trimmed to cap height /
// baseline), sideways overflow, text that leaves its card, the glow, and a screenshot of the section. Figma targets at 1512
// are in references/figma/home-risk/spec.md and decisions/components/stagger-cards.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-d16f03.webflow.io/';
const out = process.argv[3] || './stagger-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hstag-'));
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

const measure = `(() => {
  const sec = document.querySelector('[data-stagger-cards]');
  if (!sec) return { error: 'no section' };
  scrollTo(0, 0);
  const s = sec.getBoundingClientRect();
  const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return 'hidden';
    return [Math.round((b.left - s.left) * 10) / 10, Math.round((b.top - s.top) * 10) / 10, Math.round(b.width * 10) / 10, Math.round(b.height * 10) / 10]; };
  const q = (sel) => sec.querySelector(sel);
  const cards = [...sec.querySelectorAll('.stagger-cards_list .card_primary_wrap')];
  const overflow = [];
  sec.querySelectorAll('.stagger-cards_list *').forEach((el) => { const c = el.closest('.card_primary_wrap'); if (!c || el === c) return;
    const a = el.getBoundingClientRect(), b = c.getBoundingClientRect(); if (a.width && (a.right > b.right + 0.5 || a.left < b.left - 0.5 || a.bottom > b.bottom + 0.5)) overflow.push(el.className); });
  const t = q('.stagger-cards_title'); const ts = getComputedStyle(t);
  const titleLines = Math.round((t.getBoundingClientRect().height + (parseFloat(ts.lineHeight) - parseFloat(ts.fontSize) * 0.7)) / parseFloat(ts.lineHeight));
  return {
    viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: Math.round(s.height), top: Math.round(s.top + scrollY),
    eyebrow: box(q('.stagger-cards_eyebrow')), title: box(t), text: box(q('.stagger-cards_text')), header: box(q('.stagger-cards_header')), list: box(q('.stagger-cards_list')),
    cards: cards.map((c) => { const r = box(c); const cs = getComputedStyle(c.querySelector('.card_primary_element') || c);
      return { box: r, role: c.getAttribute('role'), h3: c.querySelectorAll('h3').length, bg: cs.backgroundColor, blur: cs.backdropFilter }; }),
    cardText: cards.map((c) => c.innerText.replace(/\\s+/g, ' ').trim()),
    overflow: [...new Set(overflow)],
    titleFont: ts.fontFamily.split(',')[0] + ' ' + ts.fontSize + '/' + ts.lineHeight + ' ' + ts.fontWeight + ' ~' + titleLines + ' lines',
    titleTag: t.tagName, muted: getComputedStyle(q('.stagger-cards_muted')).opacity,
    eyebrowFont: (() => { const e = getComputedStyle(q('.stagger-cards_eyebrow')); return e.fontSize + '/' + e.lineHeight + ' ' + e.textTransform + ' ls ' + e.letterSpacing; })(),
    bg: getComputedStyle(sec).backgroundImage, h1count: document.querySelectorAll('h1').length,
    listRole: q('.stagger-cards_list').getAttribute('role'),
  };
})()`;

const results = {};
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1100, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url });
  await sleep(4500);
  results[w] = await ev(measure);
  const r = results[w] || {};
  const hh = r.height || 1100;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: hh, deviceScaleFactor: 1, mobile: w < 768 });
  await ev(`(() => { const t = document.querySelector('[data-stagger-cards]'); scrollTo(0, t.getBoundingClientRect().top + scrollY); })()`);
  await sleep(800);
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: r.top || 0, width: w, height: hh, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(path.join(out, `stagger-${w}.png`), Buffer.from(s.result.data, 'base64'));
}
console.log(JSON.stringify({ results, errors }, null, 1));
ws.close();
chrome.kill();
