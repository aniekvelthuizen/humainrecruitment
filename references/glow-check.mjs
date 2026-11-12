// Headless check of the header glow (pink end of the brand gradient rising in on load). Node 22+, Chrome, no dependencies.
//   node references/glow-check.mjs [base-url]
// Per page: which sections paint the pink end (#e5bbb7), whether they carry the glow layer, its opacity/transform
// at 0.1 s and 3 s after load, height unchanged, console errors. REDUCED=1 emulates prefers-reduced-motion.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const base = (process.argv[2] || 'https://humain-dev.webflow.io').replace(/\/$/, '');
const slugs = (process.env.PAGES || ',hire-an-expert,project-delivery-experts,consulting-services,project-controls,about,clients,how-it-works,pricing,contact,submit-resume,opportunities,careers,privacy-cookies,opportunities/planning-scheduling-engineer,example-components,styleguide').split(',');
const width = Number(process.env.WIDTH || 1512);
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hglow-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; let errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
if (process.env.REDUCED) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

const probe = `(() => {
  const out = [];
  for (const el of document.querySelectorAll('section, header, footer, div')) {
    const cs = getComputedStyle(el);
    const pinkBefore = getComputedStyle(el, '::before').backgroundImage.includes('229, 187, 183');
    if (!cs.backgroundImage.includes('229, 187, 183') && !pinkBefore) continue;
    if (el.closest('footer, .footer_wrap')) { out.push({ cls: el.className.split(' ')[0], footer: true }); continue; }
    const b = getComputedStyle(el, '::before');
    out.push({ cls: el.className.split(' ')[0], glow: pinkBefore, bg: cs.backgroundImage.slice(0, 90), op: b.opacity, tf: b.transform, h: el.offsetHeight });
  }
  return out;
})()`;

let fail = 0;
for (const slug of slugs) {
  errors = [];
  const loaded = new Promise((r) => { const h = (e) => { const m = JSON.parse(e.data); if (m.method === 'Page.domContentEventFired') { ws.removeEventListener('message', h); r(); } }; ws.addEventListener('message', h); });
  await send('Page.navigate', { url: `${base}/${slug}` });
  await loaded; await sleep(100);
  const early = await ev(probe);
  await sleep(3000);
  const late = await ev(probe);
  const rows = late.map((l, i) => ({ ...l, opEarly: early[i]?.op, tfEarly: early[i]?.tf, hEarly: early[i]?.h }));
  for (const r of rows) {
    if (r.footer) continue;
    if (!r.glow) { console.log(`--   /${slug} ${r.cls}: pink gradient, no glow layer (not a header)`); continue; }
    const still = (t) => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
    const ok = process.env.REDUCED ? (r.opEarly === '1' && still(r.tfEarly)) : (r.glow && Number(r.opEarly) < 0.5 && r.op === '1' && still(r.tf) && r.h === r.hEarly);
    if (!ok) fail++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} /${slug} ${r.cls} glow=${r.glow} op ${r.opEarly}→${r.op} tf ${r.tfEarly}→${r.tf} h ${r.hEarly}→${r.h}`);
  }
  if (!rows.filter((r) => !r.footer).length) console.log(`--   /${slug} no pink-gradient header`);
  if (errors.length) console.log(`     console: ${errors.join(' | ').slice(0, 200)}`);
}
console.log(fail ? `${fail} failing` : 'all pass');
ws.close(); chrome.kill();
