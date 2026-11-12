// Headless check of the two-tone light-up (decisions/motion.md) on a page (Node 22+, Chrome, no dependencies).
//   node references/muted-heading-check.mjs [url] [outdir]
// Per block: before it is in view every lit word shows the dim colour; after scrolling to it the words light up one by one
// to their own colour, the _muted part never changes, the height stays the same and the block ends «done».
// Then with reduced motion: nothing split, colours as designed. Console errors listed.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './muted-heading-out';
const width = Number(process.env.WIDTH || 1440);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hmuted-'));
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
const shot = async (sel, file) => {
  const b = await ev(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: Math.max(0, r.left - 20), y: r.top + scrollY - 20, width: r.width + 40, height: r.height + 40 }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...b, scale: 1 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64'));
};

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
const go = async () => { await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() }); await sleep(3500); };
await go();
const report = { url, width, blocks: [], reduced: null };
const sels = await ev(`[...document.querySelectorAll('[data-muted]')].filter((q) => q.offsetHeight > 0).map((q, i) => (q.setAttribute('data-mcheck', i), '[data-mcheck="' + i + '"]'))`);
for (const sel of sels) {
  const before = await ev(`(() => { const q = document.querySelector('${sel}'), m = q.querySelector(':scope > [class*="_muted"]'), w = [...q.querySelectorAll('[data-muted-word]')];
    return { tag: q.tagName, text: q.textContent.trim().slice(0, 50), state: q.dataset.muted, words: w.length, from: q.style.getPropertyValue('--mm-from'),
      dimBefore: w.every((s) => getComputedStyle(s).color.replace(/ /g, '') === q.style.getPropertyValue('--mm-from')),
      muted: m && getComputedStyle(m).color, h: q.offsetHeight }; })()`);
  if (before.state === 'done') { report.blocks.push({ ...before, note: 'done before scroll (in view at load)' }); continue; }
  await ev(`window.scrollTo(0, document.querySelector('${sel}').getBoundingClientRect().top + scrollY - innerHeight / 2)`);
  const samples = [];
  for (let t = 0; t <= 3000; t += 250) {
    samples.push(t + 'ms ' + (await ev(`[...document.querySelector('${sel}').querySelectorAll('[data-muted-word]')].map((s) => (+getComputedStyle(s).color.match(/[\\d.]+/g)[3] || 1).toFixed(1)).join(' ')`)));
    if (t === 500) await shot(sel, `block-${sels.indexOf(sel)}-mid.png`);
    await sleep(250);
  }
  await sleep(800);
  const after = await ev(`(() => { const q = document.querySelector('${sel}'), m = q.querySelector(':scope > [class*="_muted"]');
    return { state: q.dataset.muted, h: q.offsetHeight, muted: m && getComputedStyle(m).color, styled: q.getAttribute('style') || '' }; })()`);
  await shot(sel, `block-${sels.indexOf(sel)}-end.png`);
  report.blocks.push({ ...before, samples, after, ok: before.dimBefore && after.state === 'done' && after.h === before.h && after.muted === before.muted });
}
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await go();
report.reduced = await ev(`({ split: document.querySelectorAll('[data-muted-word]').length, gate: document.documentElement.hasAttribute('data-muted-gate') })`);
report.errors = errors;
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
process.exit(0);
