// Headless check of the Team Fan scroll turn (Node 22+, Chrome, no dependencies).
//   node references/team-fan-scroll-check.mjs [url] [outdir]
// Per case: --fan-shift and each card's left edge at five scroll positions, page width, and a screenshot at start/middle/end.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/project-controls';
const out = process.argv[3] || './team-fan-out';
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'tfan-'));
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
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable'); await send('Page.enable');

const cases = [
  { key: '1512', w: 1512 }, { key: '1200', w: 1200 }, { key: '1199', w: 1199 },
  { key: '1512-reduced', w: 1512, reduced: true }, { key: '1512-touch', w: 1512, touch: true },
];
const results = {};
for (const c of cases) {
  await send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-reduced-motion', value: c.reduced ? 'reduce' : 'no-preference' },
    { name: 'hover', value: c.touch ? 'none' : 'hover' }, { name: 'pointer', value: c.touch ? 'coarse' : 'fine' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: c.w, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'nc=' + Date.now() });
  await sleep(4000);
  const r = { samples: [] };
  for (const off of [-900, -450, 0, 450, 900]) {
    r.samples.push(await ev(`(async () => {
      const sec = document.querySelector('[data-team-fan]'), list = sec.querySelector('.team-fan_list');
      const top = sec.getBoundingClientRect().top + scrollY;
      scrollTo(0, top - (innerHeight - sec.offsetHeight) / 2 + ${off});
      await new Promise((res) => setTimeout(res, 250));
      return { off: ${off}, shift: list.style.getPropertyValue('--fan-shift'), cards: list.children.length,
        left: [...list.children].map((x) => Math.round(x.getBoundingClientRect().left)), pageW: document.documentElement.scrollWidth, secH: sec.offsetHeight };
    })()`));
    if ([-900, 0, 900].includes(off) && !c.reduced) {
      const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
      fs.writeFileSync(path.join(out, `${c.key}-${off}.jpg`), Buffer.from(s.result.data, 'base64'));
    }
  }
  results[c.key] = r;
}
console.log(JSON.stringify({ results, errors }, null, 1));
ws.close(); chrome.kill();
