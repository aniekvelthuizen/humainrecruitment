#!/usr/bin/env node
// SEO check on published pages: <title>, meta description, Open Graph, robots, lang — per path, per locale.
// Usage: node seo-check.mjs --base https://<site>.webflow.io --paths paths.txt [--brand "Brand"] [--max-title 60]
//        [--desc-min 120] [--desc-max 160] [--internal internal.txt] [--locales /nl,/de] [--json out.json]
// paths.txt: one path per line (static pages, a sample or all CMS items, each locale prefix too: /nl/...).
// internal.txt: paths that must carry noindex at launch (styleguide, components, test pages, search).
// Exit code 1 when any error is found. Reads only; no browser needed.
import { readFileSync, writeFileSync } from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const base = (arg('base') || '').replace(/\/$/, '');
if (!base || !arg('paths')) { console.error('need --base and --paths'); process.exit(2); }
const lines = f => readFileSync(f, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
const paths = lines(arg('paths'));
const internal = new Set(arg('internal') ? lines(arg('internal')) : []);
const brand = arg('brand');
const locales = (arg('locales') || '').split(',').filter(Boolean);
const pageKey = p => { for (const l of locales) if (p === l || p.startsWith(l + '/')) return p.slice(l.length) || '/'; return p; };
const maxTitle = +arg('max-title', 60), descMin = +arg('desc-min', 120), descMax = +arg('desc-max', 160);
const PLACEHOLDERS = [/place website meta description here/i, /lorem ipsum/i, /placeholder/i, /^untitled/i];

const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1].toLowerCase(), decode(m[2])]));
function parse(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const meta = key => metas.find(m => m.name === key || m.property === key)?.content;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  return {
    title: title ? decode(title[1].trim()) : undefined,
    description: meta('description'), robots: meta('robots'),
    ogTitle: meta('og:title'), ogDescription: meta('og:description'), ogImage: meta('og:image'),
    lang: html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1],
  };
}

const results = [];
for (const p of paths) {
  const r = { path: p, errors: [], warnings: [] };
  try {
    const res = await fetch(base + p + (p.includes('?') ? '&' : '?') + 'nc=' + Date.now(), { redirect: 'follow' });
    r.status = res.status;
    if (res.status !== 200) { r.errors.push(`HTTP ${res.status}`); results.push(r); continue; }
    Object.assign(r, parse(await res.text()));
  } catch (e) { r.errors.push(`fetch failed: ${e.message}`); results.push(r); continue; }

  if (!r.title) r.errors.push('no <title>');
  else {
    if (r.title.length > maxTitle) r.warnings.push(`title ${r.title.length} > ${maxTitle}`);
    if (brand && !r.title.endsWith(`| ${brand}`) && r.title !== brand) r.warnings.push(`title does not end with "| ${brand}"`);
  }
  if (!r.description) r.errors.push('no meta description');
  else if (r.description.length < descMin || r.description.length > descMax) r.warnings.push(`description ${r.description.length} (want ${descMin}–${descMax})`);
  for (const [k, v] of [['title', r.title], ['description', r.description]])
    if (v && PLACEHOLDERS.some(re => re.test(v))) r.errors.push(`${k} is a placeholder: "${v}"`);
  const isInternal = internal.has(p);
  if (!r.ogTitle && !isInternal) r.warnings.push('no og:title');
  if (!r.ogDescription && !isInternal) r.warnings.push('no og:description');
  if (!r.ogImage) { if (!isInternal) r.errors.push('no og:image'); }
  else {
    try {
      const h = await fetch(r.ogImage, { method: 'HEAD' });
      r.ogImageType = h.headers.get('content-type');
      if (h.status !== 200) r.errors.push(`og:image HTTP ${h.status}`);
      else if (!/image\/(jpeg|png)/.test(r.ogImageType || '')) r.errors.push(`og:image is ${r.ogImageType} (social networks need JPG or PNG)`);
    } catch (e) { r.errors.push(`og:image unreachable: ${e.message}`); }
  }
  const noindex = /noindex/i.test(r.robots || '');
  if (internal.has(p) && !noindex) r.warnings.push('internal page without noindex (must have it at launch)');
  if (!internal.has(p) && noindex) r.errors.push('noindex on a public page');
  results.push(r);
}

// The same title, description or og:image on more than one page usually means a copied start value
// or an untranslated locale (/nl showing the English text).
for (const key of ['title', 'description', 'ogImage']) {
  const by = new Map();
  for (const r of results) if (r[key]) by.set(r[key], [...(by.get(r[key]) || []), r.path]);
  for (const [, ps] of by) if (ps.length > 1)
    for (const r of results.filter(r => ps.includes(r.path))) {
      const others = ps.filter(x => x !== r.path);
      const twins = others.filter(x => pageKey(x) === pageKey(r.path)), elsewhere = others.filter(x => pageKey(x) !== pageKey(r.path));
      // the same share image in every locale of one page is fine; the same text is an untranslated locale
      if (twins.length && key !== 'ogImage') r.warnings.push(`same ${key} as its other locale ${twins.join(', ')} (untranslated?)`);
      if (elsewhere.length) r.warnings.push(`same ${key} as ${elsewhere.slice(0, 3).join(', ')}${elsewhere.length > 3 ? ' …' : ''}`);
    }
}

let errors = 0;
for (const r of results) {
  errors += r.errors.length;
  const mark = r.errors.length ? 'ERR ' : r.warnings.length ? 'WARN' : 'OK  ';
  console.log(`${mark} ${r.path}  [${r.status ?? '-'}${r.lang ? ' ' + r.lang : ''}]`);
  if (r.title) console.log(`     title (${r.title.length}): ${r.title}`);
  if (r.description) console.log(`     desc  (${r.description.length}): ${r.description}`);
  if (r.ogImage) console.log(`     og:image: ${r.ogImage} (${r.ogImageType ?? '?'})`);
  for (const e of r.errors) console.log(`     ✗ ${e}`);
  for (const w of r.warnings) console.log(`     ! ${w}`);
}
console.log(`\n${results.length} paths, ${errors} errors, ${results.reduce((n, r) => n + r.warnings.length, 0)} warnings`);
if (arg('json')) writeFileSync(arg('json'), JSON.stringify(results, null, 2));
process.exit(errors ? 1 : 0);
