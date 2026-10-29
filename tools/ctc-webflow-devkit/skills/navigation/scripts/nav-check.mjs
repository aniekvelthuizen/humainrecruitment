#!/usr/bin/env node
// Nav check on a published page: scroll fold, quick reversal, panel, colour over dark sections, hover jump.
// Headless Chrome over CDP, no dependencies (Node 22+ for the global WebSocket). Uses the attribute
// contract from structure.md §8 ([data-nav="component|bar|logo|links|panel|menu-button"], [data-section]).
//
//   node nav-check.mjs <url> [--widths 1440,991,375] [--dark] [--hover] [--out ./nav-out]
//
//   --dark   inject <section data-section="light|dark|light"> before </main> (tests the colour switch
//            on a site that has no dark sections yet; the page's own scripts and IX3 see them at load)
//   --hover  hover every visible bar link and the Menu button; report how far neighbours move
//
// Writes <out>/report.json and a screenshot of the open panel per width. CHROME env var overrides the browser.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) { console.error('usage: node nav-check.mjs <url> [--widths 1440,991,375] [--dark] [--hover]'); process.exit(2); }
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const flag = (n) => args.includes('--' + n);
const widths = opt('widths', '1440,991,375').split(',').map(Number), out = opt('out', './nav-out');
fs.mkdirSync(out, { recursive: true });

const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'nav-check-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; const errors = []; const handlers = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  handlers.forEach((h) => h(m));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result?.value;
await send('Runtime.enable');

if (flag('dark')) {
  await send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Response', resourceType: 'Document' }] });
  handlers.push(async (m) => {
    if (m.method !== 'Fetch.requestPaused') return;
    const b = await send('Fetch.getResponseBody', { requestId: m.params.requestId });
    let html = b.result.base64Encoded ? Buffer.from(b.result.body, 'base64').toString('utf8') : b.result.body;
    const test = '<section data-section="light" style="height:1200px"></section><section id="nav-check-dark" data-section="dark" style="height:900px;background:#111"></section><section data-section="light" style="height:1600px"></section>';
    html = html.includes('</main>') ? html.replace('</main>', test + '</main>') : html.replace('</body>', test + '</body>');
    await send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }], body: Buffer.from(html).toString('base64') });
  });
}

const STATE = `(() => {
  const q = (s) => document.querySelector(s);
  const L = q('[data-nav="links"]'), B = q('[data-nav="menu-button"]'), G = q('[data-nav="logo"]'), bar = q('[data-nav="bar"]');
  const vis = (el) => el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden' && +getComputedStyle(el).opacity > 0.01;
  const labels = [...document.querySelectorAll('[data-nav="links"] [data-roll="text"]')].filter((l) => l.getBoundingClientRect().width > 0);
  const label = B && B.querySelector('[data-roll="text"], .nav_button_text');
  return {
    scrollY: Math.round(scrollY), barH: bar ? Math.round(bar.getBoundingClientRect().height) : null,
    linksVisible: vis(L), linksX: L ? Math.round(L.getBoundingClientRect().x) : null, linksOpacity: L ? +(+getComputedStyle(L).opacity).toFixed(2) : null,
    maxLabelH: labels.length ? Math.max(...labels.map((l) => Math.round(l.getBoundingClientRect().height))) : null,
    menuVisible: vis(B), menuOpacity: B ? +(+getComputedStyle(B).opacity).toFixed(2) : null, menuW: B ? Math.round(B.getBoundingClientRect().width) : null,
    logoW: G ? Math.round(G.getBoundingClientRect().width) : null,
    barTextColor: label ? getComputedStyle(label).color : null,
    overflowX: document.documentElement.scrollWidth - innerWidth,
  };
})()`;
const PANEL = `(() => {
  const q = (s) => document.querySelector(s);
  const B = q('[data-nav="menu-button"]'), P = q('[data-nav="panel"]');
  const rows = [...document.querySelectorAll('[data-nav="panel"] [role="listitem"]')].filter((r) => r.getBoundingClientRect().height > 0);
  const list = rows[0] && rows[0].parentElement;
  return {
    open: B ? B.classList.contains('w--open') : null, panel: P ? (({ x, y, width, height }) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(width), h: Math.round(height) }))(P.getBoundingClientRect()) : null,
    rows: rows.map((r) => ({ h: Math.round(r.getBoundingClientRect().height), line: getComputedStyle(r).borderBottomWidth, label: (r.querySelector('[data-roll="text"]') || r).textContent.trim().slice(0, 30) })),
    firstLine: list ? getComputedStyle(list).borderTopWidth : null,
    listTop: list ? Math.round(list.getBoundingClientRect().top) : null, listBottom: list ? Math.round(list.getBoundingClientRect().bottom) : null,
    overflowX: document.documentElement.scrollWidth - innerWidth,
  };
})()`;

const report = { url, widths: {}, errors };
for (const w of widths) {
  const r = (report.widths[w] = {});
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: w < 768 ? 812 : 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.enable'); await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'navcheck=' + Date.now() });
  await sleep(4500);
  await ev(`document.body.style.minHeight = Math.max(document.body.scrollHeight, 3000) + 'px'`);
  r.top = await ev(STATE);
  // fold: sample every 100 ms down and back up (label height must stay one line)
  const sample = async (y) => { await ev(`scrollTo(0, ${y})`); const s = []; for (let i = 0; i < 16; i++) { await sleep(100); s.push(await ev(STATE)); } return s; };
  const down = await sample(400); r.scrolled = down.at(-1); r.maxLabelHDuringFold = Math.max(...down.map((s) => s.maxLabelH || 0));
  const up = await sample(0); r.backToTop = up.at(-1); r.maxLabelHDuringReturn = Math.max(...up.map((s) => s.maxLabelH || 0));
  await ev('scrollTo(0, 400)'); await sleep(300); await ev('scrollTo(0, 0)'); await sleep(2200); r.quickReversal = await ev(STATE);
  // panel
  await ev('scrollTo(0, 400)'); await sleep(1600);
  await ev(`document.querySelector('[data-nav="menu-button"]').click()`); await sleep(1500);
  r.panel = await ev(PANEL);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, `panel-${w}.png`), Buffer.from(shot.result.data, 'base64'));
  await ev(`document.querySelector('[data-nav="menu-button"]').click()`); await sleep(1000);
  r.panelClosed = (await ev(PANEL)).open === false;
  // colour over the injected dark section
  if (flag('dark')) {
    const dt = await ev(`(() => { const d = document.getElementById('nav-check-dark'); return d ? Math.round(d.getBoundingClientRect().top + scrollY) : null; })()`);
    if (dt != null) {
      await ev(`scrollTo(0, ${dt} + 200)`); await sleep(1500); r.overDark = await ev(STATE);
      await ev(`document.querySelector('[data-nav="menu-button"]').click()`); await sleep(1200); r.panelOpenOverDark = await ev(STATE);
      await ev(`document.querySelector('[data-nav="menu-button"]').click()`); await sleep(1000);
      await ev(`scrollTo(0, ${dt} + 1100)`); await sleep(1500); r.afterDark = await ev(STATE);
    }
  }
  // hover: neighbours must not move
  if (flag('hover')) {
    await ev('scrollTo(0, 0)'); await sleep(1800);
    const POS = `[...document.querySelectorAll('[data-nav="bar"] [data-roll="text"]')].filter((l) => l.getBoundingClientRect().width > 0).map((l) => { const b = l.getBoundingClientRect(); return [b.x, b.y, b.width]; })`;
    const before = await ev(POS); let maxShift = 0;
    for (const p of before) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0] + 4, y: p[1] + 3 }); await sleep(800);
      const during = await ev(POS);
      during.forEach((d, i) => { if (before[i] && Math.abs(before[i][1] - p[1]) < 1 && (before[i][0] !== p[0])) maxShift = Math.max(maxShift, Math.abs(d[0] - before[i][0])); });
    }
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 600 });
    r.hoverMaxNeighbourShiftPx = +maxShift.toFixed(2);
  }
  console.log(`== ${w}px`, JSON.stringify({ top: r.top, scrolled: r.scrolled, backToTop: r.backToTop, quickReversal: r.quickReversal, maxLabelH: [r.maxLabelHDuringFold, r.maxLabelHDuringReturn], panelRows: r.panel?.rows?.length, rowHeights: [...new Set((r.panel?.rows || []).map((x) => x.h))], lines: [...new Set((r.panel?.rows || []).map((x) => x.line))], panelClosed: r.panelClosed, overDark: r.overDark?.barTextColor, panelOpenOverDark: r.panelOpenOverDark?.barTextColor, afterDark: r.afterDark?.barTextColor, hoverShift: r.hoverMaxNeighbourShiftPx }));
}
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
if (errors.length) console.log('console errors:', errors);
ws.close(); chrome.kill(); process.exit(0);
