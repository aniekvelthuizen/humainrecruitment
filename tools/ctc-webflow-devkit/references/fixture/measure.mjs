#!/usr/bin/env node
// Measure a block on a published page, with a pending change patched in.
//
//   node measure.mjs <spec.json> [--width 1440] [--headed]
//
// The spec (kept in the client repo under references/<block>/fixture.json so it can be rerun):
// {
//   "url": "https://client.webflow.io/pricing",
//   "widths": [1440, 991, 767, 479],
//   "css": "pending.css",                       // file or inline CSS, optional
//   "html": [                                    // optional, inserted before Webflow's scripts run
//     { "selector": ".section_pricing", "position": "afterend", "file": "pending.html" }
//   ],
//   "script": "pending.js",                     // file or inline JS, optional, runs after the page's own
//   "screenshot": ".c-faq_wrap",                // element to screenshot; omit for the full page
//   "hide": [".navbar", ".w-webflow-badge"],    // removed before measuring (fixed bars over the shot)
//   "measure": [".c-faq_wrap", ".c-faq_item", ".c-faq_title"],
//   "out": "out"                                // directory, relative to the spec file
// }
// Paths in the spec are relative to the spec file. "position" follows insertAdjacentHTML
// (beforebegin | afterbegin | beforeend | afterend), default afterend.
//
// Output per width: <out>/<width>.png and <out>/<width>.json with, per measured selector, every
// match: rect, text rect (where the ink sits, catches indents the box hides), the computed
// values that decide spacing and type, and the gap to the previous match. Plus page-level
// overflow checks. <out>/summary.md holds the numbers side by side.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const specPath = args.find(a => !a.startsWith('--'));
if (!specPath) { console.error('usage: node measure.mjs <spec.json> [--width N] [--headed]'); process.exit(2); }
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

const specDir = dirname(resolve(specPath));
const spec = JSON.parse(await readFile(specPath, 'utf8'));
const rel = (p) => resolve(specDir, p);
const loadText = async (v) => {
  if (!v) return '';
  if (/[\n{};]/.test(v) || !/^[\w./-]+$/.test(v)) return v;           // inline
  try { return await readFile(rel(v), 'utf8'); } catch { return v; }  // file, else inline
};

const widths = flag('--width') ? [Number(flag('--width'))] : (spec.widths ?? [1440, 991, 767, 479]);
const css = await loadText(spec.css);
const script = await loadText(spec.script);
const html = [];
for (const h of spec.html ?? []) {
  html.push({ selector: h.selector, position: h.position ?? 'afterend', html: h.file ? await readFile(rel(h.file), 'utf8') : (h.html ?? '') });
}
const outDir = rel(spec.out ?? 'out');
await mkdir(outDir, { recursive: true });

// The patch: CSS in <head>, markup inserted by a synchronous script at the end of <body>
// (so Webflow's own scripts, which run on DOMContentLoaded, see the new nodes), user script last.
const patch = (doc) => {
  const inject = `<script data-fixture>(function(){
    var items=${JSON.stringify(html)};
    for (var i=0;i<items.length;i++){var t=document.querySelector(items[i].selector);
      if(!t){console.warn('[fixture] no match for '+items[i].selector);continue;}
      t.insertAdjacentHTML(items[i].position, items[i].html);}
  })();</script>`;
  const user = script ? `<script data-fixture-user>${script}</script>` : '';
  let out = doc;
  if (css) out = out.replace(/<\/head>/i, `<style data-fixture>${css}</style></head>`);
  out = out.replace(/<\/body>/i, `${inject}${user}</body>`);
  return out;
};

const browser = await chromium.launch({ channel: 'chrome', headless: !args.includes('--headed') });
const context = await browser.newContext({ deviceScaleFactor: 2 });
const pageUrl = new URL(spec.url);
await context.route('**/*', async (route) => {
  const req = route.request();
  if (req.resourceType() === 'document' && new URL(req.url()).pathname === pageUrl.pathname) {
    const res = await route.fetch();
    const body = patch(await res.text());
    return route.fulfill({ response: res, body, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8', 'content-length': String(Buffer.byteLength(body)) } });
  }
  return route.continue();
});

const page = await context.newPage();
page.on('console', (m) => { if (m.text().startsWith('[fixture]')) console.warn(m.text()); });

const PROPS = ['display', 'flex-direction', 'grid-template-columns', 'gap', 'row-gap', 'column-gap',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'background-color',
  'border-top-width', 'border-bottom-width', 'border-radius'];

const measureInPage = ({ selectors, props }) => {
  const r = (b) => ({ x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
  const result = {};
  for (const sel of selectors) {
    const els = [...document.querySelectorAll(sel)];
    result[sel] = els.map((el, i) => {
      const box = el.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(el);
      const text = range.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const style = Object.fromEntries(props.map(p => [p, cs.getPropertyValue(p)]));
      const prev = els[i - 1]?.getBoundingClientRect();
      const gap = prev ? { fromPrevious: +(box.top >= prev.bottom ? box.top - prev.bottom : box.left - prev.right).toFixed(2) } : {};
      return {
        rect: r(box),
        text: el.textContent.trim() ? r(text) : null,
        textSample: el.textContent.trim().slice(0, 60),
        overflow: { x: el.scrollWidth > el.clientWidth + 1, y: el.scrollHeight > el.clientHeight + 1 },
        ...gap, style,
      };
    });
  }
  const de = document.documentElement;
  const clipped = [...document.querySelectorAll('body *')].filter(e => {
    if (!e.textContent.trim() || e.children.length) return false;
    const cs = getComputedStyle(e); if (cs.overflow !== 'visible' && cs.overflow !== '') return false;
    return e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0;
  }).slice(0, 20).map(e => ({ tag: e.tagName.toLowerCase(), class: e.className, text: e.textContent.trim().slice(0, 40) }));
  return { viewport: { w: innerWidth, h: innerHeight }, pageOverflowX: de.scrollWidth > de.clientWidth, textLeavingFrame: clipped, results: result };
};

const summary = [`# Fixture — ${spec.url}`, ''];
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  // pages with third-party widgets (Calendly, Turnstile) never go network-idle
  await page.goto(spec.url, { waitUntil: 'networkidle', timeout: 20000 }).catch(async () => { await page.goto(spec.url, { waitUntil: 'load' }); await page.waitForTimeout(3000); });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((sels) => { for (const s of sels) for (const e of document.querySelectorAll(s)) e.remove(); }, ['.w-webflow-badge', ...(spec.hide ?? [])]);
  await page.waitForTimeout(300);

  const data = await page.evaluate(measureInPage, { selectors: spec.measure ?? [], props: PROPS });
  data.width = w; data.url = spec.url; data.measuredAt = new Date().toISOString();
  await writeFile(resolve(outDir, `${w}.json`), JSON.stringify(data, null, 2));

  const shot = resolve(outDir, `${w}.png`);
  if (spec.screenshot) {
    const el = page.locator(spec.screenshot).first();
    if (await el.count()) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: shot }); }
    else { console.warn(`[fixture] no match for screenshot selector ${spec.screenshot} at ${w}`); await page.screenshot({ path: shot, fullPage: true }); }
  } else await page.screenshot({ path: shot, fullPage: true });

  summary.push(`## ${w}px`, '', `Page overflow-x: ${data.pageOverflowX ? '**yes**' : 'no'}. Text leaving its frame: ${data.textLeavingFrame.length ? '**' + data.textLeavingFrame.length + '**' : 'none'}.`, '');
  for (const [sel, matches] of Object.entries(data.results)) {
    summary.push(`### \`${sel}\` (${matches.length})`, '', '| # | x | y | w | h | gap↑ | text x | pad t/r/b/l | margin t/b | gap | font | text |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
    matches.forEach((m, i) => {
      const s = m.style;
      summary.push(`| ${i + 1} | ${m.rect.x} | ${m.rect.y} | ${m.rect.w} | ${m.rect.h} | ${m.fromPrevious ?? ''} | ${m.text ? m.text.x : ''} | ${s['padding-top']}/${s['padding-right']}/${s['padding-bottom']}/${s['padding-left']} | ${s['margin-top']}/${s['margin-bottom']} | ${s.gap} | ${s['font-size']} ${s['font-weight']} ${s['line-height']} | ${m.textSample.replace(/\|/g, '\\|')} |`);
    });
    summary.push('');
  }
  console.log(`${w}px → ${shot}`);
}
await writeFile(resolve(outDir, 'summary.md'), summary.join('\n'));
console.log(`summary → ${resolve(outDir, 'summary.md')}`);
await browser.close();
