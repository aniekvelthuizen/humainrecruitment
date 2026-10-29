// Headless check of the HumAIn nav on a published page (Node 22+, Chrome, no dependencies).
//   node references/nav-check.mjs <url> [outdir]
// Measures per width: top / scrolled down / scrolled up / quick down-up, the top-row spacing, dropdown open
// (hover on desktop, tap in the mobile panel), switching between panel rows, the hover underline, and console errors.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const out = process.argv[3] || './nav-out';
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
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
const mouse = async (x, y) => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); };
const click = async (x, y) => { await mouse(x, y); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); };
const center = async (sel, i = 0) => ev(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; })()`);

await send('Runtime.enable'); await send('Page.enable');
const report = {};
const measure = `(() => {
  const nav = document.querySelector('[data-nav="component"]');
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  const desk = nav.querySelector('.nav_desktop_wrap'); const deskOn = getComputedStyle(desk).display !== 'none';
  const bar = deskOn ? desk : nav.querySelector('.nav_mobile_layout');
  const sub = desk.querySelector('.nav_sub_list');
  return { y: Math.round(scrollY), scrolled: nav.hasAttribute('data-nav-scrolled'), dir: nav.dataset.navDirection, theme: nav.dataset.navTheme,
    bar: r(bar), bg: getComputedStyle(bar).backgroundColor, blur: getComputedStyle(bar).backdropFilter, text: getComputedStyle(nav).color,
    subVisible: deskOn ? getComputedStyle(sub).visibility + ' ' + getComputedStyle(sub).opacity + ' h' + Math.round(desk.querySelector('.nav_sub_wrap').getBoundingClientRect().height) : null,
    logo: r((deskOn ? desk : nav).querySelector(deskOn ? '.nav_desktop_logo' : '.nav_mobile_logo')),
    menuBtn: r(nav.querySelector('.nav_mobile_wrap .w-nav-button')), lineH: r(nav.querySelector('.nav_button_line'))?.[3], overflowX: document.documentElement.scrollWidth > innerWidth };
})()`;
const scrollTo = async (y) => { await ev(`window.scrollTo({top:${y},behavior:'instant'})`); await sleep(700); return ev(measure); };
const openState = (wrap) => `[...document.querySelectorAll('${wrap} .w-dropdown-toggle')].map(t => t.classList.contains('w--open') ? 1 : 0).join('')`;

for (const w of [1512, 1280, 1279, 991, 402]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'w=' + w + '&t=' + Date.now() });
  await sleep(3500);
  const rows = { top: await ev(measure) };
  if (w >= 1280) {
    rows.topRowSpace = await ev(`(() => { const d = document.querySelector('.nav_desktop_wrap'); const t = d.querySelector('.nav_sub_list .nav_links_text').getBoundingClientRect(); const c = d.querySelector('.button_main_wrap').getBoundingClientRect(); return { above: +t.top.toFixed(1), below: +(c.top - t.bottom).toFixed(1) }; })()`);
    rows.hoverSetting = await ev(`[...document.querySelectorAll('.nav_desktop_wrap .w-dropdown')].map(d => d.getAttribute('data-hover')).join(',')`);
  }
  rows.down = await scrollTo(800);
  rows.up = await scrollTo(650);
  rows.quickDownUp = (await ev(`window.scrollTo({top:900,behavior:'instant'})`), await sleep(60), await scrollTo(0));
  if (w >= 1280) {
    const opened = [];
    const gaps = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = await center('.nav_desktop_wrap .w-dropdown-toggle', i); await mouse(x, y); await sleep(700); opened.push(await ev(openState('.nav_desktop_wrap')));
      const g = await ev(`(() => { const d = document.querySelectorAll('.nav_desktop_wrap .w-dropdown')[${i}]; const t = d.querySelector('.w-dropdown-toggle').getBoundingClientRect(); const c = d.querySelector('.nav_dropdown_main_scroll').getBoundingClientRect(); const b = document.querySelector('.nav_desktop_wrap .button_main_wrap').getBoundingClientRect(); return { toggleToCard: +(c.top - t.bottom).toFixed(1), buttonToCard: +(c.top - b.bottom).toFixed(1), cardMid: [c.x + 30, c.y + 30] }; })()`);
      for (let s = 1; s <= 5; s++) await mouse(x + (g.cardMid[0] - x) * s / 5, y + (g.cardMid[1] - y) * s / 5);
      await sleep(600);
      gaps.push({ toggleToCard: g.toggleToCard, buttonToCard: g.buttonToCard, staysOpenOnMoveIn: await ev(openState('.nav_desktop_wrap')) });
    }
    rows.hoverOpens = opened;
    rows.cardGaps = gaps;
    const [x0, y0] = await center('.nav_desktop_wrap .w-dropdown-toggle', 1); await mouse(x0, y0); await sleep(700);
    const linkExpr = `document.querySelectorAll('.nav_desktop_wrap .w-dropdown')[1].querySelectorAll('.nav_dropdown_link')[2]`;
    const [lx, ly] = await ev(`(() => { const b = ${linkExpr}.getBoundingClientRect(); return [b.x + 20, b.y + b.height / 2]; })()`);
    await mouse(x0, y0 + 20); await mouse(lx, ly); await sleep(900);
    rows.underline = await ev(`(() => { const a = ${linkExpr}; return { text: a.textContent, size: getComputedStyle(a).backgroundSize, open: a.closest('.w-dropdown-list').classList.contains('w--open') }; })()`);
    await shot(`desktop-${w}-dropdown.png`);
    await mouse(5, 600); await sleep(900);
    await ev(`window.scrollTo({top:800,behavior:'instant'})`); await sleep(700);
    const [sx, sy] = await center('.nav_desktop_wrap .w-dropdown-toggle', 1); await mouse(sx, sy); await sleep(800);
    rows.scrolledCard = await ev(`(() => { const d = document.querySelectorAll('.nav_desktop_wrap .w-dropdown')[1]; const c = d.querySelector('.nav_dropdown_main_scroll').getBoundingClientRect(); const bar = document.querySelector('.nav_desktop_wrap').getBoundingClientRect(); const b = document.querySelector('.nav_desktop_wrap .button_main_wrap').getBoundingClientRect(); return { barToCard: +(c.top - bar.bottom).toFixed(1), buttonToCard: +(c.top - b.bottom).toFixed(1), open: d.querySelector('.w-dropdown-list').classList.contains('w--open') }; })()`);
    await shot(`desktop-${w}-scrolled-dropdown.png`);
    await mouse(5, 600); await ev(`window.scrollTo({top:0,behavior:'instant'})`); await sleep(700);
  } else {
    const [bx, by] = await center('.nav_mobile_wrap .w-nav-button'); await click(bx, by); await sleep(800);
    rows.hoverSetting = await ev(`[...document.querySelectorAll('.nav_mobile_wrap .w-dropdown')].map(d => d.getAttribute('data-hover')).join(',')`);
    rows.panel = await ev(`(() => { const p = document.querySelector('.nav_mobile_menu_wrap'); return { bg: getComputedStyle(p).backgroundColor, rowHeights: [...p.querySelectorAll(':scope .nav_links_item')].map(i => Math.round(i.getBoundingClientRect().height)), logoColor: getComputedStyle(document.querySelector('.nav_mobile_logo')).color, overflowX: p.scrollWidth > p.clientWidth }; })()`);
    const seq = [];
    let [ex, ey] = await center('.nav_mobile_wrap .w-dropdown-toggle', 0); await click(ex, ey); await sleep(700); seq.push('expertise ' + await ev(openState('.nav_mobile_wrap')));
    rows.expertise = await ev(`(() => { const d = document.querySelectorAll('.nav_mobile_wrap .w-dropdown')[0]; const lists = [...d.querySelectorAll('.nav_dropdown_columns .nav_dropdown_list')].map(l => { const b = l.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width)]; }); const s = d.querySelector('.nav_dropdown_main_scroll'); return { lists, scrollW: s.scrollWidth, clientW: s.clientWidth }; })()`);
    await shot(`mobile-${w}-expertise.png`);
    let [fx, fy] = await center('.nav_mobile_wrap .w-dropdown-toggle', 1); await click(fx, fy); await sleep(900); seq.push('then for business ' + await ev(openState('.nav_mobile_wrap')));
    rows.spacing = await ev(`(() => { const d = document.querySelectorAll('.nav_mobile_wrap .w-dropdown')[1]; const g = (e) => e.getBoundingClientRect(); const t = g(d.querySelector('.nav_links_text')); const ls = [...d.querySelectorAll('.nav_dropdown_link, .nav_dropdown_label')]; const first = g(ls[0]); const last = g(ls[ls.length - 1]); const item = g(d.closest('.nav_links_item')); return { aboveFirst: +(first.top - t.bottom).toFixed(1), belowLast: +(item.bottom - last.bottom + 8).toFixed(1) }; })()`);
    await shot(`mobile-${w}-business.png`);
    report[w + '-switch'] = seq;
  }
  report[w] = rows;
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
