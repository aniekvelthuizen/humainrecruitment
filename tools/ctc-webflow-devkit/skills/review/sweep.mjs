#!/usr/bin/env node
// Page sweep for a review: what is wrong on the published page as a whole, per width.
//
//   node sweep.mjs <url> --out <dir> [--widths 1440,1280,990,768,767,479,375] [--headed]
//
// Uses playwright-core from ../../references/fixture (run `npm install` there once).
// Output in <dir>: <width>.png (full page), <width>.json, and summary.md with
//  - page overflow and text leaving its frame, per width
//  - every section: class, data-section, top, height, padding top/bottom (spacing consistency)
//  - headings outline and H1 count, text that looks like a heading but is a <p>
//  - links with no href, "#", or an anchor that does not exist; images without alt
//  - console errors and failed requests
// It measures, it does not judge: the reviewer compares the numbers with the design and the rules.

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../references/fixture/package.json', import.meta.url));
const { chromium } = require('playwright-core');

const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--') && /^https?:/.test(a));
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
if (!url || !flag('--out')) { console.error('usage: node sweep.mjs <url> --out <dir> [--widths 1440,375] [--headed]'); process.exit(2); }
const widths = (flag('--widths') ?? '1440,1280,990,768,767,479,375').split(',').map(Number);
const out = resolve(flag('--out'));
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: !args.includes('--headed') });
const page = await (await browser.newContext({ deviceScaleFactor: 1 })).newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('%c')) errors.push(`console: ${m.text().slice(0, 200)}`); });
page.on('pageerror', e => errors.push(`script: ${String(e).slice(0, 200)}`));
page.on('requestfailed', r => errors.push(`request failed: ${r.url().slice(0, 150)} (${r.failure()?.errorText})`));

const sweep = () => {
  const r = (b) => ({ x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height) });
  const label = (e) => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''}`;
  const de = document.documentElement;

  // hidden on purpose: screen-reader text, aria-hidden decoration, or cut off by a parent that clips
  const quiet = (e) => /sr-only/.test(e.className) || !!e.closest('[aria-hidden="true"]') || (() => {
    for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p); if (/hidden|clip/.test(o.overflowX + ' ' + o.overflow)) return true;
    }
    return false;
  })();
  const tooWide = [...document.querySelectorAll('body *')].filter(e => {
    const b = e.getBoundingClientRect();
    if (!(b.width > 0 && (b.right > innerWidth + 1 || b.left < -1))) return false;
    if (b.right <= 0 || getComputedStyle(e).position === 'fixed') return false; // parked off-screen on purpose (skip link)
    return !quiet(e);
  }).slice(0, 15).map(e => ({ el: label(e), rect: r(e.getBoundingClientRect()) }));

  const clipped = [...document.querySelectorAll('body *')].filter(e => {
    if (!e.textContent.trim() || e.children.length || quiet(e)) return false;
    return e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0;
  }).slice(0, 20).map(e => ({ el: label(e), text: e.textContent.trim().slice(0, 40) }));

  const sections = [...document.querySelectorAll('section, [data-section]')].filter(s => !s.parentElement.closest('section, [data-section]')).map(s => {
    const cs = getComputedStyle(s);
    const inner = s.querySelector('section') ?? s;
    const ics = getComputedStyle(inner);
    return {
      el: label(s), dataSection: s.getAttribute('data-section'), rect: r(s.getBoundingClientRect()),
      paddingTop: cs.paddingTop === '0px' ? ics.paddingTop : cs.paddingTop,
      paddingBottom: cs.paddingBottom === '0px' ? ics.paddingBottom : cs.paddingBottom,
      hasContainer: !!s.querySelector('.u-container'),
    };
  });

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent).map(h => ({ tag: h.tagName.toLowerCase(), text: h.textContent.trim().slice(0, 60) }));
  const bigParagraphs = [...document.querySelectorAll('p, div')].filter(p => {
    if (!p.offsetParent || !p.textContent.trim() || p.closest('h1,h2,h3,h4,h5,h6')) return false;
    if ([...p.children].some(c => !/^(SPAN|EM|STRONG|I|B|BR|A)$/.test(c.tagName))) return false; // innermost text box only
    return parseFloat(getComputedStyle(p).fontSize) >= 32;
  }).slice(0, 15).map(p => ({ el: label(p), size: getComputedStyle(p).fontSize, text: p.textContent.trim().slice(0, 60) }));

  const links = [...document.querySelectorAll('a')].filter(a => a.offsetParent).map(a => {
    const href = a.getAttribute('href');
    let problem = null;
    if (href === null || href === '') problem = 'no link';
    else if (href === '#') problem = 'href="#"';
    else if (href.startsWith('#') && !document.getElementById(href.slice(1))) problem = `anchor ${href} not on the page`;
    return problem && { problem, text: (a.textContent.trim() || a.getAttribute('aria-label') || label(a)).slice(0, 50) };
  }).filter(Boolean);

  const images = [...document.querySelectorAll('img')].filter(i => i.offsetParent && !i.hasAttribute('alt')).map(i => (i.getAttribute('src') || '').split('/').pop().slice(0, 60));

  return { viewport: innerWidth, pageOverflowX: de.scrollWidth > de.clientWidth + 1, scrollWidth: de.scrollWidth, tooWide, clipped, sections, headings, bigParagraphs, links, images };
};

const md = [`# Sweep — ${url}`, '', `Run ${new Date().toISOString()}`, ''];
let first = null;
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  // pages with a video or live embed never go network-idle: fall back to load + a pause
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(async () => { await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(3000); });
  await page.evaluate(() => document.fonts.ready);
  // scroll through once so scroll reveals and lazy images fire, then back to the top
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
  await page.waitForTimeout(800);
  const d = await page.evaluate(sweep);
  first ??= d;
  await writeFile(resolve(out, `${w}.json`), JSON.stringify(d, null, 2));
  await page.screenshot({ path: resolve(out, `${w}.png`), fullPage: true });

  md.push(`## ${w}px`, '');
  md.push(`- Page scrolls sideways: ${d.pageOverflowX ? `**yes** (${d.scrollWidth}px wide)` : 'no'}`);
  md.push(`- Elements past the screen edge: ${d.tooWide.length ? d.tooWide.map(t => `\`${t.el}\` x${t.rect.x} w${t.rect.w}`).join(', ') : 'none'}`);
  md.push(`- Text cut off or leaving its box: ${d.clipped.length ? d.clipped.map(c => `\`${c.el}\` "${c.text}"`).join(', ') : 'none'}`, '');
  md.push('| # | section | data-section | top | height | pad top | pad bottom | container |', '|---|---|---|---|---|---|---|---|');
  d.sections.forEach((s, i) => md.push(`| ${i + 1} | \`${s.el.slice(0, 60)}\` | ${s.dataSection ?? '—'} | ${s.rect.y} | ${s.rect.h} | ${s.paddingTop} | ${s.paddingBottom} | ${s.hasContainer ? 'yes' : '**no**'} |`));
  md.push('');
}

md.push('## Page (at the first width)', '');
md.push(`- H1 count: ${first.headings.filter(h => h.tag === 'h1').length}`);
md.push(`- Headings: ${first.headings.map(h => `${h.tag} "${h.text}"`).join(' · ') || 'none'}`);
md.push(`- Large text that is not a heading: ${first.bigParagraphs.map(p => `\`${p.el}\` ${p.size} "${p.text}"`).join(' · ') || 'none'}`);
md.push(`- Link problems: ${first.links.map(l => `${l.problem}: "${l.text}"`).join(' · ') || 'none'}`);
md.push(`- Images without alt: ${first.images.join(', ') || 'none'}`);
md.push(`- Errors: ${[...new Set(errors)].join(' · ') || 'none'}`, '');

await writeFile(resolve(out, 'summary.md'), md.join('\n'));
console.log(`summary → ${resolve(out, 'summary.md')}`);
await browser.close();
