// Headless check of the photo parallax (decisions/motion.md, 2026-11-12) on a published page (Node 22+, Chrome, no dependencies).
// Spotlight Grid panels and Stage Slider photo tiles.
//   WIDTH=1440 node references/parallax-check.mjs [url] [outdir]
//   INJECT=1 also runs references/embeds/photo-parallax.html on the page (to test it before publishing).
// Per panel: mouse right of the panel -> person left (negative x), light right; mouse left -> the other way; leave -> back to 0 6px.
// Then reduced motion and touch: nothing set up. Console errors listed.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './parallax-out';
const width = Number(process.env.WIDTH || 1440);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hpar-'));
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
const shot = async (file) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, file), Buffer.from(s.result.data, 'base64')); };

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
const report = { url, width };
const SEL = `[data-photo-parallax], [data-stage-slider] .slider_list > .u-image-wrapper`;
const STATE = `(() => [...document.querySelectorAll('${SEL}')].map((p) => ({ on: p.getAttribute('data-photo-parallax-on'),
  photo: p.querySelector('[data-photo-parallax-photo]')?.style.translate || null, glow: p.querySelector('.photo-parallax_glow')?.style.translate || null })))()`;
const mouse = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, pointerType: 'mouse' });
const embed = fs.readFileSync(new URL('./embeds/photo-parallax.html', import.meta.url), 'utf8');
const injectCode = `(() => { document.querySelectorAll('.photo-parallax_glow').forEach((g) => g.remove()); const st = document.createElement('style'); st.textContent = ${JSON.stringify(embed.match(/<style>([\s\S]*?)<\/style>/)[1])}; document.head.appendChild(st); ${embed.match(/<script>([\s\S]*?)<\/script>/)[1]} })()`;
const load = async () => { await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now() }); await sleep(4000); if (process.env.INJECT) { await ev(injectCode); await sleep(300); } };
await load();
report.atLoad = await ev(STATE);
report.panels = [];
const n = report.atLoad.length;
for (let i = 0; i < n; i++) {
  const r = await ev(`(() => { const p = document.querySelectorAll('${SEL}')[${i}]; p.scrollIntoView({ block: 'center' }); const b = p.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; })()`);
  await sleep(600);
  const cy = Math.round((r.t + r.b) / 2), res = { i };
  await mouse(Math.round(r.r + 150), cy); await sleep(400); res.after400ms = (await ev(STATE))[i];
  await mouse(Math.round(r.r + 160), cy); await sleep(3000); res.right = (await ev(STATE))[i];
  await shot(`panel${i}-right-${width}.png`);
  await mouse(Math.round(r.l - 150), cy); await sleep(3500); res.left = (await ev(STATE))[i];
  await shot(`panel${i}-left-${width}.png`);
  await ev(`document.querySelectorAll('${SEL}')[${i}].closest('section').dispatchEvent(new PointerEvent('pointerleave'))`);
  await sleep(4000); res.leave = (await ev(STATE))[i];
  report.panels.push(res);
}
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await load(); report.reduced = await ev(STATE);
await send('Emulation.setEmulatedMedia', { features: [] });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await load(); report.touch = await ev(STATE);
report.errors = errors;
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
