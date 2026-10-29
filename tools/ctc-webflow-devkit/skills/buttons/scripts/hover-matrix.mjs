#!/usr/bin/env node
// Hover matrix for buttons on a published page: real mouse moves in headless Chrome over CDP.
// No dependencies (Node 22+ for the global WebSocket). Uses the Google Chrome on the machine.
//
//   node hover-matrix.mjs <url> [--scope "#buttons"] [--button ".button_main_wrap"]
//        [--moving ".button_main_text,.button_main_square,.button_main_line"] [--in 700] [--out-ms 600]
//        [--width 1440] [--trace <index>]
//
// Per button (in page order): rest state, hover state, state after leaving; then 3 hovers in a row,
// one hover cut off after 150 ms, and a move straight onto the next button. A state is the wrap's
// background and text colour plus the transform of every --moving element inside it.
// A button is OK when every hover reaches the same hover state, the colour changes on hover,
// and every leave returns to the rest state. --trace samples one button every 50 ms (in and out).
// Exit code 1 when any button deviates. CHROME env var overrides the browser path.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a));
if (!url) { console.error('usage: node hover-matrix.mjs <url> [--scope sel] [--button sel] [--trace i]'); process.exit(2); }
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const scope = opt('scope', 'body'), btnSel = opt('button', '.button_main_wrap');
const moving = opt('moving', '.button_main_text,.button_main_square,.button_main_line');
const inMs = +opt('in', 700), outMs = +opt('out-ms', 600), width = +opt('width', 1440);
const trace = opt('trace', null);

const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hover-matrix-'));
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
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;
const S = JSON.stringify;
const mouse = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'hm=' + Date.now() });
await sleep(4500);

const list = `[...document.querySelectorAll(${S(scope)} + ' ' + ${S(btnSel)})]`;
const count = await ev(`${list}.length`);
// State of button k: colours of the wrap + transform of each moving element (rounded, so sub-pixel noise does not count)
const stateExpr = (k) => `(()=>{const b=${list}[${k}]; const cs=getComputedStyle(b);
  const t=[...b.querySelectorAll(${S(moving)})].map(e=>{const m=getComputedStyle(e).transform; if(!m||m==='none') return 'none';
    return m.replace(/-?\\d+\\.?\\d*(e-?\\d+)?/g,n=>(+n).toFixed(2));});
  return {bg:cs.backgroundColor,color:cs.color,t:t.join(' ; ')}})()`;
const boxExpr = (k) => `(()=>{const b=${list}[${k}]; b.scrollIntoView({block:'center'}); const r=b.getBoundingClientRect();
  const label=(b.innerText||'').trim().split('\\n')[0]; const card=b.closest('[class*="u-theme-"]');
  return {x:r.x,y:r.y,w:r.width,h:r.height,label,theme:card?[...card.classList].find(c=>c.startsWith('u-theme-')):''}})()`;
const rectExpr = (k) => `(()=>{const r=${list}[${k}].getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}})()`;
const same = (a, b) => a.bg === b.bg && a.color === b.color && a.t === b.t;

if (trace !== null) {
  const k = +trace; const box = await ev(boxExpr(k)); await mouse(1, 1); await sleep(500);
  const sample = async (label) => {
    const rows = await ev(`(async()=>{const out=[],t0=performance.now(); while(performance.now()-t0<${Math.max(inMs, outMs)}){const s=${stateExpr(k)}; out.push([Math.round(performance.now()-t0),s.bg,s.t]); await new Promise(r=>setTimeout(r,50));} return out})()`);
    console.log(label); rows.forEach((r) => console.log('  ' + r.join('  ')));
  };
  const p1 = sample(`IN  ${box.theme} ${box.label}  (ms · background · transforms)`); await mouse(box.x + box.w / 2, box.y + box.h / 2); await p1;
  const p2 = sample('OUT'); await mouse(1, 1); await p2;
} else {
  let bad = 0;
  for (let k = 0; k < count; k++) {
    const box = await ev(boxExpr(k)); const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    await mouse(1, 1); await sleep(outMs);
    const rest = await ev(stateExpr(k));
    const issues = [];
    let hover = null;
    for (let i = 1; i <= 3; i++) {
      await mouse(cx, cy); await sleep(inMs); const h = await ev(stateExpr(k));
      if (!hover) hover = h; else if (!same(h, hover)) issues.push(`hover ${i} differs from hover 1`);
      await mouse(1, 1); await sleep(outMs); const l = await ev(stateExpr(k));
      if (!same(l, rest)) issues.push(`leave ${i} does not return to rest`);
    }
    if (same(hover, rest)) issues.push('hover changes nothing');
    else if (hover.bg === rest.bg && hover.color === rest.color) issues.push('colour does not change on hover');
    await mouse(cx, cy); await sleep(150); await mouse(1, 1); await sleep(outMs);
    if (!same(await ev(stateExpr(k)), rest)) issues.push('cut-off hover does not return to rest');
    await mouse(cx, cy); await sleep(150); await mouse(cx, cy); await sleep(inMs);
    if (!same(await ev(stateExpr(k)), hover)) issues.push('hover after a cut-off hover does not reach the hover state');
    if (k + 1 < count) {
      const b2 = await ev(boxExpr(k)); const nb = await ev(rectExpr(k + 1));
      await mouse(b2.x + b2.w / 2, b2.y + b2.h / 2); await sleep(inMs);
      await mouse(nb.x + nb.w / 2, nb.y + nb.h / 2); await sleep(outMs);
      if (!same(await ev(stateExpr(k)), rest)) issues.push('moving onto the next button leaves this one hovered');
    }
    await mouse(1, 1);
    if (issues.length) bad++;
    console.log(`${String(k).padStart(2)} ${(box.theme + ' ' + box.label).padEnd(34)} ${issues.length ? 'DEVIATES: ' + issues.join('; ') : 'OK'}`);
  }
  console.log(`\n${count - bad}/${count} OK` + (errors.length ? `\nconsole errors: ${errors.join(' | ')}` : ''));
  ws.close(); chrome.kill(); process.exit(bad ? 1 : 0);
}
ws.close(); chrome.kill();
