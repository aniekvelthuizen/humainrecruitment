// Headless check of the HumAIn cards on a published page (Node 22+, Chrome, no dependencies).
//   node references/card-check.mjs <url> [outdir] [widths=1512,402]
// Per width and per card (every element whose class ends in `_wrap` and starts with `card_` or `logo_tile`):
// box, element count, HTML bytes, the texts in its HTML, and every visible part (class suffix, box relative
// to the card, colours, type, mask, shadow), at rest and with the mouse on the card. Writes cards-<w>.json
// and a screenshot per card. Compare two runs or two cards with card-diff.mjs.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const out = process.argv[3] || './card-out';
const widths = (process.argv[4] || '1512,402').split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hcard-'));
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
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };

// Class names normalised: card_primary_title / card_opportunity_title → title, so old and new cards compare.
const helpers = `
  const CARD = (el) => [...el.classList].some((c) => /^(card_[a-z]+|logo_tile)_wrap$/.test(c));
  const norm = (el) => [...el.classList].map((c) => c.replace(/^card_arrow/, 'arrow').replace(/^card_(primary|opportunity|expert|profile|testimonial)_?/, '').replace(/^logo_tile_?/, '') || 'root').filter((c) => !c.startsWith('w-variant')).join('.');
  const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
  const pick = (el) => { const s = getComputedStyle(el); return { c: s.color, bg: s.backgroundColor, bgi: s.backgroundImage.slice(0, 80), op: s.opacity, fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight, ff: s.fontFamily.split(',')[0], rad: s.borderRadius, bd: s.borderTopWidth + ' ' + s.borderTopColor, mask: (s.maskImage || s.webkitMaskImage || '').slice(0, 60), sh: s.boxShadow.slice(0, 60), bf: s.backdropFilter, tf: s.transform, flt: s.filter, pad: s.padding }; };
  const cards = () => [...document.querySelectorAll('[class*="_wrap"]')].filter(CARD);`;
const measure = (i) => `(() => { ${helpers}
  const card = cards()[${i}]; const cb = card.getBoundingClientRect();
  const parts = [card, ...card.querySelectorAll('*')].filter((el) => el.classList.length && vis(el)).map((el) => { const b = el.getBoundingClientRect();
    return { k: norm(el), r: [Math.round(b.x - cb.x), Math.round(b.y - cb.y), Math.round(b.width), Math.round(b.height)], s: pick(el) }; });
  return { parts, r: [Math.round(cb.x), Math.round(cb.y), Math.round(cb.width), Math.round(cb.height)] };
})()`;
const list = `(() => { ${helpers}
  return cards().map((card) => ({ cls: [...card.classList].join(' '), variant: (card.className.match(/w-variant-[0-9a-f-]+/) || [''])[0],
    section: (card.closest('section, [class*="section_wrap"], [class*="_wrap"]:not([class*="card_"])')?.className || '').slice(0, 60),
    els: card.querySelectorAll('*').length + 1, divs: card.querySelectorAll('div').length + (card.tagName === 'DIV' ? 1 : 0),
    bytes: card.outerHTML.length, text: card.textContent.replace(/\\s+/g, ' ').trim().slice(0, 300),
    link: !!card.querySelector('a[href]:not([href="#"])'), clickable: !!card.querySelector('.clickable_wrap, [class*="clickable"]') }));
})()`;

await send('Runtime.enable'); await send('Page.enable');
for (const w of widths) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'w=' + w + '&t=' + Date.now() });
  await sleep(4000);
  const cards = await ev(list);
  for (let i = 0; i < cards.length; i++) {
    await ev(`(() => { ${helpers} cards()[${i}].scrollIntoView({ block: 'center', behavior: 'instant' }); })()`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
    await sleep(700);
    const rest = await ev(measure(i));
    Object.assign(cards[i], { r: rest.r, parts: rest.parts });
    const b = rest.r;
    if (b[2] > 0 && b[3] > 0) {
      const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: b[0], y: b[1] + (await ev('scrollY')), width: b[2], height: b[3], scale: 1 }, captureBeyondViewport: true });
      if (shot.result) fs.writeFileSync(path.join(out, `w${w}-c${String(i).padStart(2, '0')}-rest.png`), Buffer.from(shot.result.data, 'base64'));
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: b[0] + b[2] / 2, y: b[1] + Math.min(b[3] / 2, 40) });
      await sleep(900);
      cards[i].hover = (await ev(measure(i))).parts;
      const hs = await send('Page.captureScreenshot', { format: 'png', clip: { x: b[0], y: b[1] + (await ev('scrollY')), width: b[2], height: b[3], scale: 1 }, captureBeyondViewport: true });
      if (hs.result) fs.writeFileSync(path.join(out, `w${w}-c${String(i).padStart(2, '0')}-hover.png`), Buffer.from(hs.result.data, 'base64'));
    }
  }
  fs.writeFileSync(path.join(out, `cards-${w}.json`), JSON.stringify({ url, w, errors, cards }, null, 1));
  console.log(`w${w}: ${cards.length} cards, overflowX ${await ev('document.documentElement.scrollWidth > innerWidth')}, errors ${errors.length}`);
}
ws.close(); chrome.kill();
