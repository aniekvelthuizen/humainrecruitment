// Headless check of the HumAIn nav on a published page. node humain-nav-check.mjs <url> <outdir>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const out = process.argv[3] || './nav-out';
fs.mkdirSync(out, { recursive: true });
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hnav-'));
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
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.result.data, 'base64')); };

await send('Runtime.enable'); await send('Page.enable');
const report = {};
const measure = `(() => {
  const nav = document.querySelector('[data-nav="component"]');
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  const desk = nav.querySelector('.nav_desktop_wrap'); const deskOn = getComputedStyle(desk).display !== 'none';
  const bar = deskOn ? desk : nav.querySelector('.nav_mobile_layout');
  return { y: Math.round(scrollY), deskOn, scrolled: nav.hasAttribute('data-nav-scrolled'), dir: nav.dataset.navDirection, theme: nav.dataset.navTheme,
    bar: r(bar), bg: getComputedStyle(bar).backgroundColor, text: getComputedStyle(nav).color,
    sub: deskOn ? r(desk.querySelector('.nav_sub_wrap')) : null, logo: r((deskOn ? desk : nav).querySelector(deskOn ? '.nav_desktop_logo' : '.nav_mobile_logo')),
    menuBtn: r(nav.querySelector('.nav_mobile_wrap .w-nav-button')), overflowX: document.documentElement.scrollWidth > innerWidth,
    wrapped: [...(deskOn ? desk : document).querySelectorAll('.nav_desktop_wrap .nav_links_text')].filter(t => t.getBoundingClientRect().height > 40).map(t => t.textContent) };
})()`;
const scrollTo = async (y) => { await ev(`window.scrollTo({top:${y},behavior:'instant'})`); await sleep(700); return ev(measure); };

for (const w of [1512, 1280, 1279, 991, 402]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'w=' + w + '&t=' + Date.now() });
  await sleep(3500);
  const rows = { top: await ev(measure) };
  rows.down = await scrollTo(800);
  rows.up = await scrollTo(650);
  rows.quickDownUp = (await ev(`window.scrollTo({top:900,behavior:'instant'})`), await sleep(60), await scrollTo(0));
  if (w >= 1280) {
    await ev(`(() => { const d = document.querySelectorAll('.nav_desktop_wrap .w-dropdown')[1]; const t = d.querySelector('.w-dropdown-toggle'); if (d.getAttribute('data-hover') === 'true') t.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true})); else t.click(); })()`);
    await sleep(800);
    rows.dropdown = await ev(`(() => { const l = document.querySelectorAll('.nav_desktop_wrap .w-dropdown-list')[1]; const c = l.querySelector('.nav_dropdown_main_scroll'); const b = c.getBoundingClientRect(); return { open: l.classList.contains('w--open'), card: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)], cardBg: getComputedStyle(c).backgroundColor, linkColor: getComputedStyle(c.querySelector('a')).color }; })()`);
    await shot(`desktop-${w}-dropdown.png`);
  } else {
    await ev(`document.querySelector('.nav_mobile_wrap .w-nav-button').click()`);
    await sleep(800);
    rows.panel = await ev(`(() => { const p = document.querySelector('.nav_mobile_menu_wrap'); const b = p.getBoundingClientRect(); const rows = [...p.querySelectorAll('.nav_links_item')].map(i => Math.round(i.getBoundingClientRect().height)); return { box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)], bg: getComputedStyle(p).backgroundColor, rowHeights: rows, logoColor: getComputedStyle(document.querySelector('.nav_mobile_logo')).color, overflowX: p.scrollWidth > p.clientWidth }; })()`);
    await shot(`mobile-${w}-panel.png`);
  }
  report[w] = rows;
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
