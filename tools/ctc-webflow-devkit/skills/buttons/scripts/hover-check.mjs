#!/usr/bin/env node
// Hover check for buttons on a published page: real mouse moves in headless Chrome over CDP.
// No dependencies (Node 22+ for the global WebSocket). Uses the Google Chrome on the machine.
//
//   node hover-check.mjs <url> [--scope "#buttons"] [--button ".button_main_wrap"]
//        [--line ".button_main_line"] [--char ".roll_char_inner|.my_char"] [--widths 1440,390] [--out ./hover-out]
//
// Per width and per button: rect, height, text line-height, rest colour vs hover colour (text and icon),
// line transform at rest / 0.3 s / end / after leave, first and last letter offset at 0.3 s and end,
// and a 2x screenshot of the hovered button. Console errors are reported. Writes <out>/report.json.
// CHROME env var overrides the browser path.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
if (!url) { console.error('usage: node hover-check.mjs <url> [--scope sel] [--widths 1440,390]'); process.exit(2); }
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const scope = opt('scope', 'body'), btnSel = opt('button', '.button_main_wrap'), lineSel = opt('line', '.button_main_line');
const charSels = opt('char', '.roll_char_inner|.button_main_char_inner|.button_main_char').split('|');
const widths = opt('widths', '1440,390').split(',').map(Number), out = opt('out', './hover-out');
fs.mkdirSync(out, { recursive: true });

const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hover-check-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; const errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value).join(' '));
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; }
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.result.value;
const shot = async (file, clip) => {
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 2 } });
  fs.writeFileSync(path.join(out, file), Buffer.from(r.result.data, 'base64'));
};
const S = JSON.stringify;

await send('Page.enable'); await send('Runtime.enable');
const report = {};
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 2, mobile: w < 600 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'hc=' + Date.now() });
  await sleep(4500);
  const count = await ev(`document.querySelectorAll(${S(scope)} + ' ' + ${S(btnSel)}).length`);
  report[w] = [];
  for (let k = 0; k < count; k++) {
    const q = `document.querySelectorAll(${S(scope)} + ' ' + ${S(btnSel)})[${k}]`;
    const box = await ev(`(()=>{const b=${q}; b.scrollIntoView({block:'center',inline:'center'}); const r=b.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,sy:scrollY,sx:scrollX}})()`);
    await sleep(250);
    const state = `(()=>{const b=${q}; const l=b.querySelector(${S(lineSel)}); const c=(${S(charSels)}.map(s=>[...b.querySelectorAll(s)]).find(a=>a.length))||[]; const ic=b.querySelector('[class*="icon"] [style*="mask"], .icon_set_wrap');
      const tx=b.querySelector('[class*="text"]');
      return {color:getComputedStyle(b).color, icon: ic? getComputedStyle(ic).backgroundColor : null,
        line: l? getComputedStyle(l).transform : null, lineColor: l? getComputedStyle(l).backgroundColor : null,
        first: c[0]? getComputedStyle(c[0]).transform : null, last: c.length? getComputedStyle(c[c.length-1]).transform : null,
        lineHeight: tx? getComputedStyle(tx).lineHeight : null, variant: [...b.attributes].filter(a=>a.name.startsWith('data-wf')).map(a=>a.value).join(' ')}})()`;
    const rest = await ev(state);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x + box.w / 2, y: box.y + box.h / 2 });
    await sleep(300); const mid = await ev(state);
    await sleep(900); const end = await ev(state);
    await shot(`${w}-${k}-hover.png`, { x: box.x + box.sx - 8, y: box.y + box.sy - 8, width: box.w + 16, height: box.h + 16 });
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
    await sleep(900); const left = await ev(state);
    report[w].push({ index: k, variant: rest.variant, width: Math.round(box.w), height: +box.h.toFixed(2), lineHeight: rest.lineHeight,
      colour: { rest: rest.color, hover: end.color, iconRest: rest.icon, iconHover: end.icon, line: rest.lineColor },
      line: { rest: rest.line, mid: mid.line, end: end.line, afterLeave: left.line },
      letters: { midFirst: mid.first, midLast: mid.last, endFirst: end.first, afterLeave: left.first } });
  }
  report[w].overflowX = await ev('document.documentElement.scrollWidth > innerWidth');
}
report.consoleErrors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
