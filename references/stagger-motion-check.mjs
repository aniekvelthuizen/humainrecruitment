// Headless check of the Stagger Cards motion: card reveal and icon animation (Node 22+, Chrome, no dependencies).
//   [SECTION=n] node references/stagger-motion-check.mjs [url] [outdir]   (n = which Stagger Cards section on the page, default 0)
// Per width: state before scrolling, card opacity/translate sampled after the section scrolls into view, the icons' moving
// parts over time, layout (list height) before vs after, then the same page with reduced motion. Screenshots of the section.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-dev.webflow.io';
const out = process.argv[3] || './stagger-motion-out';
const SECTION = +(process.env.SECTION || 0);
const widths = (process.env.WIDTHS || '1440,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hsmot-'));
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

const state = `(() => {
  const sec = document.querySelectorAll('[data-stagger-cards]')[${SECTION}];
  const cards = [...sec.querySelectorAll('.stagger-cards_list > * > *')];
  const r2 = (n) => Math.round(n * 100) / 100;
  const part = (p) => { const el = sec.querySelector('[data-icon-part="' + p + '"]'); if (!el) return null; const cs = getComputedStyle(el);
    return { rotate: cs.rotate, transform: cs.transform === 'none' ? '' : cs.transform.slice(0, 40), opacity: cs.opacity, scale: cs.scale, dash: cs.strokeDashoffset }; };
  return { motion: sec.getAttribute('data-stagger-motion'), paused: sec.hasAttribute('data-stagger-paused'),
    listH: r2(sec.querySelector('.stagger-cards_list').getBoundingClientRect().height),
    cards: cards.map((c) => [getComputedStyle(c).translate, r2(+getComputedStyle(c.querySelector('.card_primary_element')).opacity), c.hasAttribute('data-stagger-in')]),
    icons: [...sec.querySelectorAll('.icon_set_wrap')].map((i) => (i.getAttribute('data-icon-motion') || 'mask') + ':' + i.getBoundingClientRect().width),
    minute: part('minute'), cross: part('cross'), line: part('line'), arrow: part('arrow'), loupe: part('loupe') };
})()`;

const shot = async (name) => {
  const box = await ev(`(() => { const b = document.querySelectorAll('[data-stagger-cards]')[${SECTION}].querySelector('.stagger-cards_list').getBoundingClientRect(); return [b.left, b.top + scrollY - 40, b.width, b.height + 120]; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, box[0] - 20), y: box[1], width: box[2] + 40, height: box[3], scale: 1 }, captureBeyondViewport: false });
  fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(s.result.data, 'base64'));
};

const results = {};
for (const w of widths) {
  for (const reduced of [false, true]) {
    const key = w + (reduced ? '-reduced' : '');
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 2, mobile: w < 768 });
    await send('Page.navigate', { url });
    await sleep(4000);
    const r = { before: await ev(state), samples: {} };
    await ev(`(() => { const l = document.querySelectorAll('[data-stagger-cards]')[${SECTION}].querySelector('.stagger-cards_list'); scrollTo(0, l.getBoundingClientRect().top + scrollY - 200); })()`);
    const t0 = Date.now();
    for (const t of [150, 450, 800, 1300, 2200, 3200]) {
      await sleep(t - (Date.now() - t0));
      r.samples[t] = await ev(state);
      if (!reduced && [450, 2200].includes(t)) await shot(`${key}-${t}`);
    }
    if (reduced) await shot(key);
    // Scroll the section away and back: loops pause while out of view.
    await ev(`scrollTo(0, 0)`); await sleep(400); r.awayPaused = (await ev(state)).paused;
    results[key] = r;
  }
}
console.log(JSON.stringify({ results, errors }, null, 1));
ws.close();
chrome.kill();
