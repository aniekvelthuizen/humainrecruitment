// Headless check of the Rich Content section on a published page (Node 22+, Chrome, no dependencies).
//   node references/rich-content-check.mjs [url] [outdir]
// Per width: section height and padding, the text column box, every heading and paragraph box relative to the
// column top (both the line box and the box with Lumos' trim), the gaps between them, fonts, sideways overflow,
// console errors, a screenshot of the section.
// Figma targets at 1512 are in decisions/components/rich-content.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/privacy-cookies';
const out = process.argv[3] || './rich-content-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hrich-'));
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
const shot = async (file, sel) => {
  const b = await ev(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');

// Line box = a Range around the text (what Figma draws); el = the element box (Lumos trims it).
const measure = `(() => {
  const s = document.querySelector('.rich-content_wrap'); if (!s) return null;
  const sb = s.getBoundingClientRect(); const t = s.querySelector('.rich-content_text'); const tb = t.getBoundingClientRect();
  const cs = getComputedStyle(s);
  const kids = [...t.children].map((k) => {
    const r = document.createRange(); r.selectNodeContents(k); const lb = r.getBoundingClientRect(); const eb = k.getBoundingClientRect(); const c = getComputedStyle(k);
    return { tag: k.tagName.toLowerCase(), line: [Math.round(lb.top - tb.top), Math.round(lb.height)], el: [Math.round(eb.top - tb.top), Math.round(eb.height)],
      font: c.fontFamily.split(',')[0] + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.fontWeight, color: c.color, width: Math.round(lb.width) };
  });
  const gaps = kids.slice(1).map((k, i) => k.line[0] - (kids[i].line[0] + kids[i].line[1]));
  return { section: [Math.round(sb.height), cs.paddingTop, cs.paddingBottom, cs.backgroundColor],
    column: [Math.round(tb.left), Math.round(tb.top - sb.top), Math.round(tb.width), Math.round(tb.height)],
    firstLineTop: kids[0] && Math.round(kids[0].line[0] + tb.top - sb.top), lastLineBottom: kids.length && Math.round(sb.bottom - (tb.top + kids.at(-1).line[0] + kids.at(-1).line[1])),
    kids, gaps, overflowX: document.documentElement.scrollWidth - innerWidth };
})()`;

const report = { url, widths: {} };
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url });
  await sleep(3500);
  await ev('document.fonts.ready.then(() => true)');
  // PATCH_CSS: extra CSS injected before measuring, to check a change before it is published.
  if (process.env.PATCH_CSS) await ev(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(process.env.PATCH_CSS)}; document.body.append(s); return true; })()`);
  // PATCH_HTML: extra blocks appended to the text (e.g. a list under a title, an h3, a link), to check their styles.
  if (process.env.PATCH_HTML) await ev(`(() => { document.querySelector('.rich-content_text').insertAdjacentHTML('beforeend', ${JSON.stringify(process.env.PATCH_HTML)}); return true; })()`);
  report.widths[w] = await ev(measure);
  report.widths[w].links = await ev(`[...document.querySelectorAll('.rich-content_text a')].map((a) => { const c = getComputedStyle(a); return [c.color, c.textDecorationLine, c.textDecorationColor, c.textUnderlineOffset]; })`);
  await shot(`rich-content-${w}.png`, '.rich-content_wrap');
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill();
process.exit(0);
