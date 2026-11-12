#!/usr/bin/env node
// Before/after check for a shared-library Accept on a site that installs the library.
// An Accept strips library classes from elements the site owns itself (see ../library-sites.md),
// so measure the published pages before the Accept, publish after it, and compare.
//
//   node accept-check.mjs snapshot <out.json> <url> [url …] [--widths 1440,375]
//   node accept-check.mjs compare  <before.json> <after.json>
//
// A snapshot holds, per page and width: document height, horizontal overflow, the rect of every
// top-level block in <main> (or <body>), and every element whose computed display is contents
// or none (with its data-display). compare prints each page/width where a block moved or resized
// by more than 2 px, the page grew or shrank, horizontal overflow appeared, or an element changed
// between contents/none and anything else. Exit code 1 when something changed.

import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const [mode, ...rest] = process.argv.slice(2);
const flag = (n) => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : undefined; };
const positional = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && rest[i - 1].startsWith('--')));

const signature = () => {
  const root = document.querySelector('main') || document.body;
  const key = (el) => {
    const parts = [];
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const i = [...e.parentElement.children].indexOf(e);
      parts.unshift(`${e.tagName.toLowerCase()}:${i}`);
    }
    return parts.join('>');
  };
  const blocks = [];
  const take = (el, depth) => {
    for (const c of el.children) {
      const cs = getComputedStyle(c);
      if (cs.display === 'contents') { take(c, depth); continue; }
      const r = c.getBoundingClientRect();
      blocks.push({ k: key(c), cls: String(c.className).slice(0, 60), r: [r.x, r.y + scrollY, r.width, r.height].map(Math.round) });
      if (depth < 2) take(c, depth + 1);
    }
  };
  take(root, 0);
  const special = [...document.querySelectorAll('body *')]
    .filter((e) => ['contents', 'none'].includes(getComputedStyle(e).display) || e.hasAttribute('data-display'))
    .map((e) => ({ k: key(e), d: getComputedStyle(e).display, a: e.getAttribute('data-display') }));
  return { h: document.documentElement.scrollHeight, x: document.documentElement.scrollWidth - innerWidth, blocks, special };
};

if (mode === 'snapshot') {
  const [out, ...urls] = positional;
  if (!out || !urls.length) { console.error('usage: snapshot <out.json> <url> [url …] [--widths 1440,375]'); process.exit(2); }
  const widths = (flag('--widths') || '1440,375').split(',').map(Number);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const result = {};
  for (const url of urls) for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    try {
      // 'load', not 'networkidle': pages with polling or embeds never go idle.
      await page.goto(url + (url.includes('?') ? '&' : '?') + 'ac=' + Date.now(), { waitUntil: 'load', timeout: 60000 });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(2000);
      result[`${url} @${w}`] = await page.evaluate(signature);
    } catch (e) {
      console.log(`SKIPPED ${url} @${w}: ${e.message.split('\n')[0]}`);
    }
    await page.close();
  }
  await browser.close();
  await writeFile(out, JSON.stringify(result));
  console.log(`snapshot: ${Object.keys(result).length} page-widths → ${out}`);
} else if (mode === 'compare') {
  const [a, b] = await Promise.all(positional.slice(0, 2).map(async (f) => JSON.parse(await readFile(f, 'utf8'))));
  let bad = 0;
  for (const id of Object.keys(a)) {
    const x = a[id], y = b[id];
    if (!y) { console.log(`MISSING ${id}`); bad++; continue; }
    const notes = [];
    if (Math.abs(x.h - y.h) > 2) notes.push(`page height ${x.h} → ${y.h}`);
    if (y.x > x.x) notes.push(`horizontal overflow ${x.x} → ${y.x}`);
    const yb = new Map(y.blocks.map((o) => [o.k, o]));
    for (const o of x.blocks) {
      const n = yb.get(o.k);
      if (!n) { notes.push(`gone: ${o.k} ${o.cls}`); continue; }
      if (o.r.some((v, i) => Math.abs(v - n.r[i]) > 2)) notes.push(`moved: ${o.cls || o.k} ${o.r} → ${n.r}`);
    }
    const ys = new Map(y.special.map((o) => [o.k, o]));
    for (const o of x.special) {
      const n = ys.get(o.k);
      if (!n || n.d !== o.d) notes.push(`display ${o.d} → ${n ? n.d : 'gone'}: ${o.k}${o.a ? '' : ' (no data-display)'}`);
    }
    if (notes.length) { bad++; console.log(`CHANGED ${id}\n  ` + notes.slice(0, 8).join('\n  ') + (notes.length > 8 ? `\n  … ${notes.length - 8} more` : '')); }
  }
  console.log(bad ? `${bad} page-widths changed` : 'no changes');
  process.exit(bad ? 1 : 0);
} else {
  console.error('usage: accept-check.mjs snapshot <out.json> <url…> [--widths 1440,375] | compare <before.json> <after.json>');
  process.exit(2);
}
