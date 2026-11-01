// Headless check of the Home hero (Hero Experts) on a published page (Node 22+, Chrome, no dependencies).
//   node references/hero-check.mjs [url] [outdir]
// Per width: positions of the hero parts relative to the hero top, sideways overflow, slider arrows, marquee running,
// a screenshot of the hero, and console errors. Figma targets at 1512 are in references/figma/home-hero/spec.md.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2] || 'https://humain-d16f03.webflow.io/';
const out = process.argv[3] || './hero-out';
const widths = (process.env.WIDTHS || '1512,1280,991,767,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hhero-'));
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

const measure = `(() => {
  const hero = document.querySelector('.hero-experts_wrap');
  if (!hero) return { error: 'no hero' };
  const h = hero.getBoundingClientRect();
  const r = (sel, root = hero) => { const el = root.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect();
    if (!b.width && !b.height) return 'hidden';
    return [Math.round(b.left - h.left), Math.round(b.top - h.top), Math.round(b.width), Math.round(b.height)]; };
  const cards = [...hero.querySelectorAll('[data-hero-experts-slider] .swiper-slide')].map((c) => { const b = c.getBoundingClientRect(); return [Math.round(b.left - h.left), Math.round(b.width), Math.round(b.height)]; });
  const list = hero.querySelector('[data-logo-marquee-list]');
  return {
    viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, heroHeight: Math.round(h.height),
    title: r('.hero-experts_title'), text: r('.hero-experts_text'), actions: r('.hero-experts_actions'), stat: r('.hero-experts_stat'),
    visual: r('.hero-experts_visual'), aside: r('.hero-experts_aside'), expertCard: r('.hero-experts_aside > *'), quote: r('.hero-experts_quote'),
    quoteIcon: r('.hero-experts_quote-icon .icon_set_wrap') || r('.hero-experts_quote-icon'),
    experts: r('[data-hero-experts-slider]'), cards,
    arrows: [...hero.querySelectorAll('[data-hero-experts-slider] .button_arrow_wrap')].map((a) => { const b = a.getBoundingClientRect(); return [Math.round(b.left - h.left), Math.round(b.top - h.top), Math.round(b.width), getComputedStyle(a).opacity]; }),
    marqueeTitle: r('.logo-marquee_title'), marqueeTrack: r('[data-logo-marquee-track]'),
    marqueeLists: hero.querySelectorAll('[data-logo-marquee-list]').length, marqueeAnim: list ? getComputedStyle(list).animationName + ' ' + getComputedStyle(list).animationDuration : null,
    titleFont: (() => { const t = hero.querySelector('.hero-experts_title'); if (!t) return null; const s = getComputedStyle(t); return s.fontFamily.split(',')[0] + ' ' + s.fontSize + '/' + s.lineHeight + ' ' + s.fontWeight; })(),
    textColor: getComputedStyle(hero).color,
  };
})()`;

const results = {};
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1100, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url });
  await sleep(4500);
  results[w] = await ev(measure);
  const hh = (results[w] && results[w].heroHeight) || 1100;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: hh, deviceScaleFactor: 1, mobile: w < 768 });
  await sleep(600);
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: hh, scale: 1 } });
  fs.writeFileSync(path.join(out, `hero-${w}.png`), Buffer.from(s.result.data, 'base64'));
}
console.log(JSON.stringify({ results, errors }, null, 1));
ws.close();
chrome.kill();
