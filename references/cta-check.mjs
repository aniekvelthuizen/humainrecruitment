// Headless check of the CTA Split sections on a published page (Node 22+, Chrome, no dependencies).
//   node references/cta-check.mjs [url] [outdir]
// Per width: section height, card / photo / content boxes (relative to the section top), title / text / buttons
// boxes (relative to the card), fonts, colours, links, the photo's rendered size, sideways overflow,
// text running out of the card, console errors, a screenshot per section.
// Figma targets at 1512 are in decisions/components/cta-split.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './cta-out';
const widths = (process.env.WIDTHS || '1512,1280,1100,991,767,479,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hcta-'));
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

const measure = `(() => [...document.querySelectorAll('[data-cta-split]')].map((s) => {
  const sb = s.getBoundingClientRect(); const card = s.querySelector('.cta-split_card'); const cb = card.getBoundingClientRect();
  const rel = (e, o) => { if (!e) return null; const b = e.getBoundingClientRect(); if (!b.width && !b.height) return 'hidden';
    return [Math.round(b.left - o.left), Math.round(b.top - o.top), Math.round(b.width), Math.round(b.height)]; };
  const q = (sel) => s.querySelector(sel);
  const font = (sel) => { const e = q(sel); if (!e) return null; const c = getComputedStyle(e); return c.fontFamily.split(',')[0] + ' ' + c.fontWeight + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.color; };
  const outside = [...card.querySelectorAll('.cta-split_content *')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > cb.right + 0.5 || b.left < cb.left - 0.5); }).map((e) => e.className || e.tagName);
  const img = q('.cta-split_visual img');
  return { height: Math.round(sb.height), padTop: getComputedStyle(s).paddingTop, padBottom: getComputedStyle(s).paddingBottom, spaceTop: s.dataset.spaceTop,
    card: rel(card, sb), cardBg: getComputedStyle(card).backgroundColor, cardRadius: getComputedStyle(card).borderRadius,
    visual: rel(q('.cta-split_visual'), cb), content: rel(q('.cta-split_content'), cb),
    title: rel(q('.cta-split_title'), cb), text: rel(q('.cta-split_text'), cb), actions: rel(q('.cta-split_actions'), cb),
    buttons: [...s.querySelectorAll('.cta-split_actions .button_main_wrap')].map((b) => ({ box: rel(b, cb), href: b.querySelector('a')?.getAttribute('href'), text: b.innerText.trim(), color: getComputedStyle(b).color, bg: getComputedStyle(b).backgroundColor, border: getComputedStyle(b.querySelector('.button_main_element')).borderColor })),
    titleTag: q('.cta-split_title')?.tagName, titleFont: font('.cta-split_title'), titleText: q('.cta-split_title')?.textContent,
    mutedColor: q('.cta-split_muted') && getComputedStyle(q('.cta-split_muted')).color, textFont: font('.cta-split_text'),
    img: img && { file: img.currentSrc.split('/').pop(), alt: img.alt, box: rel(img, cb), fit: getComputedStyle(img).objectFit },
    outside };
}))()`;

const report = { url, widths: {} };
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
  await sleep(4500);
  await ev(`document.querySelectorAll('[data-cta-split] img').forEach((i) => (i.loading = 'eager'))`); await sleep(1500);
  report.widths[w] = { scrollWidth: await ev('document.documentElement.scrollWidth'), sections: await ev(measure) };
  const n = report.widths[w].sections.length;
  for (let i = 0; i < n; i++) await shot(`cta-${i + 1}-${w}.png`, '[data-cta-split]', i);
}

report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill();
process.exit(0);
