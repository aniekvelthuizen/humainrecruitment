// Headless check of the Home "Our method" section (Sticky Steps) on a published page (Node 22+, Chrome, no dependencies).
//   node references/steps-check.mjs [url] [outdir]
// Per width: positions of the parts relative to the section top (trimmed text boxes = cap to baseline), card sizes and tilt,
// sideways overflow, the stack while scrolling (card tops when the last card arrives), screenshots, console errors.
// Figma targets at 1512 are in decisions/components/sticky-steps.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io/';
const out = process.argv[3] || './steps-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hsteps-'));
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

await send('Runtime.enable');
await send('Page.enable');

// Positions are measured with the section at the top of the page flow (no scroll), so sticky has not kicked in.
const measure = `(() => {
  const s = document.querySelector('[data-sticky-steps]');
  if (!s) return { error: 'no section' };
  const sb = s.getBoundingClientRect();
  const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return 'hidden';
    return [Math.round(b.left - sb.left), Math.round(b.top - sb.top), Math.round(b.width), Math.round(b.height)]; };
  const q = (sel) => s.querySelector(sel);
  const cards = [...s.querySelectorAll('[data-sticky-steps-list] [role="listitem"]')].filter((c) => !c.closest('.card_primary_items'));
  const font = (el) => { if (!el) return null; const c = getComputedStyle(el); return c.fontFamily.split(',')[0] + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.fontWeight + ' ' + c.color; };
  return {
    viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: Math.round(sb.height), bg: getComputedStyle(s).backgroundImage,
    eyebrow: box(q('.sticky-steps_eyebrow')), title: box(q('.sticky-steps_title')), accent: getComputedStyle(q('.sticky-steps_accent')).color,
    text: box(q('.sticky-steps_text')), actions: box(q('.sticky-steps_actions')), list: box(q('[data-sticky-steps-list]')),
    introPos: getComputedStyle(q('.sticky-steps_intro')).position + ' top ' + getComputedStyle(q('.sticky-steps_intro')).top,
    titleFont: font(q('.sticky-steps_title')), textFont: font(q('.sticky-steps_text')), eyebrowFont: font(q('.sticky-steps_eyebrow')),
    cards: cards.map((c) => { const st = getComputedStyle(c); const el = c.querySelector('.card_primary_element');
      const tilt = st.rotate; c.style.rotate = '0deg'; // measure the inside without the tilt
      const ring = c.querySelector('.card_primary_eyebrow'); const t = c.querySelector('.card_primary_title h1, .card_primary_title h2, .card_primary_title h3, .card_primary_title p'); const p = c.querySelector('.card_primary_text p');
      // unrotated geometry: offsets inside the card are measured on offsetTop/Height (not affected by rotate)
      const r = { pos: st.position + ' ' + st.top, rotate: tilt, w: c.offsetWidth, h: c.offsetHeight, top: c.offsetTop,
        bg: getComputedStyle(el).backgroundColor, blur: getComputedStyle(el).backdropFilter, pad: getComputedStyle(el).padding,
        ring: ring && [ring.offsetWidth, ring.offsetHeight, getComputedStyle(ring).borderTopWidth, getComputedStyle(ring).borderTopColor, getComputedStyle(ring).color, ring.textContent.trim()],
        ringTop: ring && ring.getBoundingClientRect().top - el.getBoundingClientRect().top,
        titleTag: t && t.tagName, titleFont: font(t), textFont: font(p), numberFont: font(ring && ring.querySelector('p')),
        ringToTitle: ring && t && Math.round(t.getBoundingClientRect().top - ring.getBoundingClientRect().bottom),
        titleToText: t && p && Math.round(p.getBoundingClientRect().top - t.getBoundingClientRect().bottom),
        textToBottom: p && Math.round(el.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom),
        ringLeft: ring && Math.round(ring.getBoundingClientRect().left - el.getBoundingClientRect().left) };
      c.style.rotate = ''; return r; }),
  };
})()`;

// Scroll until the last card reaches its sticky top: all card tops should then be (nearly) equal = a stack.
const stack = `(async () => {
  const s = document.querySelector('[data-sticky-steps]');
  const cards = [...s.querySelectorAll('[data-sticky-steps-list] [role="listitem"]')].filter((c) => !c.closest('.card_primary_items'));
  const last = cards[cards.length - 1];
  const y0 = scrollY + last.getBoundingClientRect().top - parseFloat(getComputedStyle(last).top) ;
  scrollTo(0, y0 + 2); await new Promise((r) => setTimeout(r, 400));
  const intro = s.querySelector('.sticky-steps_intro');
  return { scrolledTo: Math.round(y0), cardTops: cards.map((c) => Math.round(c.getBoundingClientRect().top)), introTop: Math.round(intro.getBoundingClientRect().top),
    sectionTop: Math.round(s.getBoundingClientRect().top) };
})()`;

const results = {};
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url });
  await sleep(4500);
  results[w] = await ev(measure);
  const top = await ev(`Math.round(document.querySelector('[data-sticky-steps]').getBoundingClientRect().top + scrollY)`);
  const hh = (results[w] && results[w].height) || 1400;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: hh, deviceScaleFactor: 1, mobile: w < 768 });
  await sleep(600);
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: top, width: w, height: hh, scale: 1 } });
  fs.writeFileSync(path.join(out, `steps-${w}.png`), Buffer.from(s.result.data, 'base64'));
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await sleep(400);
  results[w].stack = await ev(stack);
  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(out, `stack-${w}.png`), Buffer.from(s2.result.data, 'base64'));
}
console.log(JSON.stringify({ results, errors }, null, 1));
ws.close();
chrome.kill();
