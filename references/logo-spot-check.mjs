// Headless check of the nav logo spotlight (decisions/motion.md › Logo spotlight). Node 22+, Chrome, no dependencies.
//   node references/logo-spot-check.mjs [base-url]
// Env: PAGES (comma list of slugs, '' = Home), WIDTH (default 1512), REDUCED=1 (prefers-reduced-motion),
//      INJECT=references/embeds/nav-logo-spotlight.html (test the embed on staging before it is in Webflow),
//      SHOTS=dir (saves a crop of the logo mid-sweep and while hovered).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const base = (process.argv[2] || 'https://humain-dev.webflow.io').replace(/\/$/, '');
const slugs = (process.env.PAGES ?? ',contact,how-it-works').split(',');
const width = Number(process.env.WIDTH || 1512);
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'lspot-'));
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
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 2, mobile: width < 768 });
if (width < 768) await send('Emulation.setTouchEmulationEnabled', { enabled: true });
if (process.env.REDUCED) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (process.env.INJECT) {
  const html = fs.readFileSync(process.env.INJECT, 'utf8');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1], js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); (0, eval)(${JSON.stringify(js)}); });` });
}
const shots = process.env.SHOTS; if (shots) fs.mkdirSync(shots, { recursive: true });

const probe = `(() => {
  const spot = [...document.querySelectorAll('.nav_logo_spot')].find((s) => s.getBoundingClientRect().width > 0);
  if (!spot) return { spots: document.querySelectorAll('.nav_logo_spot').length };
  const svg = spot.parentElement.querySelector('svg'), a = spot.getBoundingClientRect(), b = svg.getBoundingClientRect(), cs = getComputedStyle(spot);
  return { spots: document.querySelectorAll('.nav_logo_spot').length, state: spot.getAttribute('data-state'), x: cs.getPropertyValue('--logo-spot-x'), r: cs.getPropertyValue('--logo-spot-r'),
    color: cs.getPropertyValue('--logo-spot-color').trim(), theme: document.querySelector('[data-nav="component"]').getAttribute('data-nav-theme'),
    box: [Math.round(a.left), Math.round(a.top), Math.round(a.width), Math.round(a.height)], svgBox: [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)],
    hostH: spot.parentElement.offsetHeight, hasMask: cs.webkitMaskImage.startsWith('url(') || cs.maskImage.startsWith('url(') };
})()`;
const shot = async (name, box) => {
  if (!shots || !box) return;
  const [x, y, w, h] = box; const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: x - 12, y: y - 12, width: w + 24, height: h + 24, scale: 1 } });
  fs.writeFileSync(path.join(shots, name), Buffer.from(r.result.data, 'base64'));
};

let fail = 0;
for (const slug of slugs) {
  errors = [];
  const loaded = new Promise((r) => { const h = (e) => { const m = JSON.parse(e.data); if (m.method === 'Page.domContentEventFired') { ws.removeEventListener('message', h); r(); } }; ws.addEventListener('message', h); });
  await send('Page.navigate', { url: `${base}/${slug}` });
  await loaded; const t0 = Date.now();
  await sleep(150); const early = await ev(probe);
  await sleep(1000 - (Date.now() - t0)); const mid = await ev(probe); await shot(`${slug || 'home'}-${width}-sweep.png`, mid.box);
  await sleep(2600 - (Date.now() - t0)); const late = await ev(probe);
  let hover = null, after = null;
  if (late.box && width >= 768) {
    const [x, y, w, h] = late.box;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + w * 0.4, y: y + h / 2 });
    await sleep(500); hover = await ev(probe); await shot(`${slug || 'home'}-${width}-hover.png`, hover.box);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 600 });
    await sleep(500); after = await ev(probe);
  }
  const checks = process.env.REDUCED
    ? [['no spot shown', !mid.box]]
    : [
        ['one spot per nav logo (2)', late.spots === 2],
        ['spot covers the svg', late.box && late.box.join() === late.svgBox.join()],
        ['logo box height unchanged by the spot', late.box && late.hostH === late.svgBox[3]],
        ['mask set', late.hasMask],
        ['not sweeping yet at 0.15 s', !early.state],
        ['sweeping at 1 s', mid.state === 'sweep' && parseFloat(mid.r) > 0],
        ['done at 2.6 s', !late.state && parseFloat(late.r) === 0],
        ...(width >= 768 ? [['hover: light at the cursor', hover?.state === 'hover' && parseFloat(hover.r) > 0 && hover.x.endsWith('px')], ['leave: light gone', !after?.state && parseFloat(after?.r) === 0]] : []),
        ['console clean', errors.length === 0],
      ];
  const bad = checks.filter((c) => !c[1]);
  fail += bad.length;
  console.log(`${bad.length ? 'FAIL' : 'ok  '} /${slug} @${width}: theme ${late.theme}, colour ${late.color}, box ${late.box}, mid x ${mid.x} r ${mid.r}${hover ? `, hover x ${hover.x} r ${hover.r}` : ''}`);
  for (const c of bad) console.log(`     ✗ ${c[0]}`);
  if (errors.length) console.log('     errors:', errors.slice(0, 3).join(' | '));
}
ws.close(); chrome.kill();
process.exit(fail ? 1 : 0);
