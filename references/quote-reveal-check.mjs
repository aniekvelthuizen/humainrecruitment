// Headless check of the quote word reveal (decisions/motion.md, 2026-11-12) on a published page (Node 22+, Chrome, no dependencies).
//   node references/quote-reveal-check.mjs [url] [outdir]
// Cards: testimonial card entrance (quote mark, stars, text), left to right.
// Per quote: hidden before it is in view, words fade in one by one after scrolling to it, height unchanged, ends «done».
// Then with reduced motion: no split, quote visible at once. Console errors listed.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './quote-reveal-out';
const width = Number(process.env.WIDTH || 1512);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hquote-'));
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
const shotQuote = async (sel, file) => {
  const b = await ev(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: Math.max(0, r.left - 40), y: r.top + scrollY - 40, width: r.width + 80, height: r.height + 80 }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });

const report = { url, width, cards: null, quotes: [], reduced: null };
// Cards: testimonial cards in view together start left to right; per card when the quote mark, the stars and the text
// are visible (opacity > 0.05) and settled (opacity > 0.95), height unchanged, hover veil and dark mark still work after.
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
await sleep(4000);
report.cards = await ev(`(async () => {
  const cards = [...document.querySelectorAll('[data-card-reveal]')].filter((c) => c.offsetHeight > 0);
  if (!cards.length) return null;
  const h0 = cards.map((c) => c.offsetHeight);
  const parts = (c) => ({ icon: c.querySelector('[data-card-reveal-part="icon"]'), star: c.querySelector('[data-card-reveal-part="stars"] > :last-child'), text: c.querySelector('[data-card-reveal-part="text"]') });
  const hiddenBefore = cards.map((c) => Object.values(parts(c)).filter(Boolean).every((e) => +getComputedStyle(e).opacity < 0.05));
  const top = Math.min(...cards.map((c) => c.getBoundingClientRect().top + scrollY)), bottom = Math.max(...cards.map((c) => c.getBoundingClientRect().bottom + scrollY));
  window.scrollTo(0, (top + bottom) / 2 - innerHeight / 2);
  const t0 = performance.now(), seen = cards.map(() => ({}));
  while (performance.now() - t0 < 3000) {
    const t = Math.round(performance.now() - t0);
    cards.forEach((c, i) => { for (const [k, e] of Object.entries(parts(c))) { if (!e) continue; const o = +getComputedStyle(e).opacity;
      if (o > 0.05 && seen[i][k + 'In'] == null) seen[i][k + 'In'] = t; if (o > 0.95 && seen[i][k + 'Done'] == null) seen[i][k + 'Done'] = t; } });
    await new Promise((r) => setTimeout(r, 25));
  }
  return cards.map((c, i) => ({ left: Math.round(c.getBoundingClientRect().left), hiddenBefore: hiddenBefore[i], ...seen[i], state: c.dataset.cardState,
    heightSame: c.offsetHeight === h0[i], leftover: c.querySelectorAll('[data-card-reveal-part][style*="opacity"], [data-card-reveal-part] > [style*="opacity"]').length }));
})()`);
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
await sleep(4000);
const sels = await ev(`[...document.querySelectorAll('[data-quote-reveal]')].filter((q) => q.offsetHeight > 0).map((q, i) => (q.setAttribute('data-qcheck', i), '[data-qcheck="' + i + '"]'))`);
for (const sel of sels) {
  const before = await ev(`(() => { const q = document.querySelector('${sel}'); const w = q.querySelectorAll('[data-quote-word]');
    return { text: q.textContent.trim().slice(0, 60), state: q.dataset.quoteState, words: w.length, visibleWords: [...w].filter((s) => +getComputedStyle(s).opacity > 0.01).length, h: q.offsetHeight }; })()`);
  await ev(`window.scrollTo(0, document.querySelector('${sel}').getBoundingClientRect().top + scrollY - innerHeight / 2)`);
  const samples = [];
  for (let t = 0; t <= 2700; t += 150) {
    samples.push(t + 'ms ' + (await ev(`[...document.querySelector('${sel}').querySelectorAll('[data-quote-word]')].map((s) => (+getComputedStyle(s).opacity).toFixed(1)).join(' ')`)));
    if (t === 450) await shotQuote(sel, `quote-${sels.indexOf(sel)}-mid.png`);
    await sleep(150);
  }
  await sleep(600);
  const after = await ev(`(() => { const q = document.querySelector('${sel}'); return { state: q.dataset.quoteState, h: q.offsetHeight, styled: q.querySelectorAll('[data-quote-word][style*="opacity"]').length }; })()`);
  await shotQuote(sel, `quote-${sels.indexOf(sel)}-end.png`);
  report.quotes.push({ sel, before, samples, after });
}

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() });
await sleep(4000);
report.reduced = await ev(`({ gate: document.documentElement.hasAttribute('data-quote-gate'), quotes: [...document.querySelectorAll('[data-quote-reveal]')].filter((q) => q.offsetHeight > 0).map((q) => ({ words: q.querySelectorAll('[data-quote-word]').length, visibility: getComputedStyle(q).visibility, h: q.offsetHeight })) })`);
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
chrome.kill();
process.exit(0);
