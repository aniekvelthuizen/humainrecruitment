#!/usr/bin/env node
// SEO audit on published pages in a real browser: the whole SEO checklist, per URL, ok / warning / error,
// with what to do about each finding in Webflow. Generic: no site paths in here.
//
//   node seo-audit.mjs --urls urls.txt                     one URL per line (# comments allowed)
//   node seo-audit.mjs --sitemap https://site/sitemap.xml [--limit 40] [--per-folder 3]
//   node seo-audit.mjs --base https://site.webflow.io --paths paths.txt
//   node seo-audit.mjs https://site/a https://site/b      URLs as arguments
//   node seo-audit.mjs <url> --block ".faq_wrap"           only the checks that belong to one block
//
// Options:
//   --overview <file|list>   paths (or prefixes ending in *) of overview pages (blog, news, stories): on these,
//                            cards must not carry headings. Without it, a page with 3+ CMS items that each hold
//                            a heading still gets a warning.
//   --block <selector>       block mode: headings, alt, lazy loading, link texts and the semantic wrapper inside
//                            the selector only. --allow-h1 when the block is the page's hero/heading block,
//                            --overview-block when the block is a card grid on an overview page.
//   --inject <file.html> --at <selector> [--position afterend]
//                            block mode on a block that is not published yet: insert its markup into the page
//                            first (the fixture's way, see measure.mjs), then check it.
//   --width 1440 --mobile    viewport for the fold (default 1440 × 900; --mobile = 390 × 844)
//   --out <dir>              writes seo-audit.json and seo-audit.md there
//   --headed                 show the browser
// Exit code 1 when any error is found, 2 on bad usage.
//
// What it measures, per page (areas in the order of the checklist):
//   structure  nav, the page heading, one main with sections, footer — in that order
//   robots     robots.txt per origin: the two pagination Disallow lines, and whether the page links to ?page= URLs
//   headings   one h1, no skipped level, no empty heading; on overview pages no headings in cards
//   meta       title, description, canonical, og:title/description/image/url/type, twitter:card, share image JPG/PNG,
//              the same title or description on two pages
//   media      alt on every image (decorative = alt="" and small or aria-hidden), alt that is a file name,
//              video without captions track, embedded players (check captions/transcript by hand)
//   links      link text that says nothing ("klik hier", "read more"), links with no name, nav links that only
//              exist after JavaScript (compared with the raw HTML), nav items without a real href
//   perf       the LCP image lazy-loaded, images below the fold not lazy, oversized images, no width/height,
//              font files (size, preload), layout shift (CLS) while loading and scrolling
//   schema     JSON-LD that does not parse, the types found, required fields missing, types the page suggests
//              (FAQ, Article, BreadcrumbList, Organization on home, JobPosting)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('./package.json', import.meta.url));
const { chromium } = require('playwright-core');

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const has = (n) => argv.includes(`--${n}`);
const valued = new Set(['urls', 'sitemap', 'limit', 'per-folder', 'base', 'paths', 'overview', 'block', 'inject', 'at', 'position', 'width', 'out']);
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && valued.has(argv[i - 1].slice(2))));
const readList = (v) => {
  if (!v) return [];
  let txt = v;
  try { txt = readFileSync(v, 'utf8'); } catch { txt = v.split(',').join('\n'); }
  return txt.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
};

// ---------- the URL list ----------
let urls = positional.filter(a => /^https?:\/\//.test(a));
urls.push(...readList(flag('urls')));
if (flag('base') && flag('paths')) {
  const base = flag('base').replace(/\/$/, '');
  urls.push(...readList(flag('paths')).map(p => base + (p.startsWith('/') ? p : '/' + p)));
}
if (flag('sitemap')) urls.push(...await fromSitemap(flag('sitemap')));
urls = [...new Set(urls)];
if (!urls.length) {
  console.error('usage: node seo-audit.mjs (--urls file | --sitemap url | --base url --paths file | <url>…) [--block sel] [--overview list] [--out dir]');
  process.exit(2);
}
const blockSel = flag('block');
if (blockSel && urls.length > 1) console.warn(`--block: checking "${blockSel}" on ${urls.length} URLs`);
const overview = readList(flag('overview'));
const isOverview = (u) => { const p = new URL(u).pathname.replace(/\/$/, '') || '/'; return overview.some(o => o.endsWith('*') ? p.startsWith(o.slice(0, -1)) : (o.replace(/\/$/, '') || '/') === p); };

async function fromSitemap(src) {
  const xml = await (await fetch(src)).text();
  let locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
  if (/<sitemapindex/i.test(xml)) { const all = []; for (const l of locs) all.push(...await fromSitemap(l)); return all; }
  // the sitemap lists the production domain; audit the host the sitemap came from
  const host = new URL(src).origin;
  locs = locs.map(l => { const u = new URL(l); return host + u.pathname + u.search; });
  const perFolder = Number(flag('per-folder') ?? 0);
  if (perFolder) {
    const seen = new Map();
    locs = locs.filter(l => { const parts = new URL(l).pathname.split('/').filter(Boolean); const key = parts.length > 1 ? parts.slice(0, -1).join('/') : '__top'; if (key === '__top') return true; const n = (seen.get(key) ?? 0) + 1; seen.set(key, n); return n <= perFolder; });
  }
  const limit = Number(flag('limit') ?? 0);
  return limit ? locs.slice(0, limit) : locs;
}

// ---------- what to do in Webflow, per finding code ----------
const FIX = {
  'no-main': 'Page frame: one Main element (tag `main`) around the page sections, in the page template/standard page (Lumos `page_main`), not per section.',
  'many-main': 'Only the page frame is `main`; a section or component that carries tag `main` gets `section` or `div` (Element settings > Tag).',
  'no-nav': 'The Nav component holds a `nav` element (Navbar or Element settings > Tag: nav); fix it in the component, every page follows.',
  'no-footer': 'The Footer component root gets tag `footer` (Element settings > Tag); fix it in the component.',
  'order': 'Order in the page frame: Nav, then Main (page heading block first, then sections), then Footer. Move the instance in the standard page, not per page.',
  'outside-main': 'Content sits outside `main`: move the section into the Main/`page_main` slot of the page frame.',
  'h1-outside-main': 'The page heading (hero/kop block) belongs inside `main` as its first section.',
  'no-sections': 'Page sections are `section` elements (`section.<name>_wrap` in the flat build); set the wrap\'s Tag to section in the component.',
  'robots-pagination': 'Site settings > SEO > robots.txt (production): add `Disallow: /*?*page=*` and `Disallow: */*?*undefined=`. Designer/site settings, not the Data API. Staging is Disallow: / anyway; check again on the production domain.',
  'h1-count': 'One h1 per page, set in the hero/page-heading component (Heading element with fixed level h1). Every other title is h2/h3 with a fixed level in its component (`set_heading_level`), never a rich-text heading the editor can change.',
  'h-skip': 'Heading levels follow on: a section title is h2, a card or item title under it h3 (or no heading, see cards). Fix the level in the component definition so every use follows.',
  'h-empty': 'An empty heading: bind it to a prop with a native "is set" condition, or remove it from the component.',
  'card-heading': 'Overview cards: the card title is not a heading. Give the card a "Title tag" setting (default `p`/`div`, h2/h3 only on purpose) or make the title a Paragraph/Text Block with the heading text class. Fix it in the card component; only the page title is h1.',
  'no-title': 'Page settings > SEO title (`data_pages_tool update_page_settings`); on a CMS template bind it to the Page Title field (seo skill §3).',
  'no-description': 'Page settings > Meta description (`update_page_settings`); CMS template: bind to the Meta Description field.',
  'dup-title': 'Every page and item writes its own title (seo skill §1–3): a CMS template binds to the item\'s Page Title field, never a fixed text.',
  'dup-description': 'Every page and item writes its own description (seo skill §2–3).',
  'no-canonical': 'Site settings > SEO > Global canonical tag URL = the production domain (one setting, every page gets a self-canonical). A page-specific canonical goes in Page settings > Custom code <head> only where a page duplicates another.',
  'canonical-other': 'The canonical points elsewhere: on staging this is normal when the global canonical is the production domain; on production it must be the page itself unless the page duplicates another on purpose.',
  'no-og-image': 'Page settings > Open Graph image (JPG/PNG 1200 × 630, seo skill §2, `make-og.mjs`); CMS template: bind to the Open Graph Image field (Designer step).',
  'og-image-type': 'Share image as JPG or PNG; social networks do not show AVIF/WebP. Re-upload and set it again.',
  'og-tags': 'Open Graph title and description "Same as SEO" in Page settings (or the template binding); og:url follows from the canonical setting.',
  'no-alt': 'Image element > Alt text: write it, or bind it to the image prop\'s alt (component image props carry alt), CMS: bind alt to a field or "Use alt text from asset". Decorative: tick "Decorative" so it renders alt="".',
  'alt-filename': 'The alt is a file name: Assets panel > the asset > Alt text, or the Image settings alt; on CMS images a real alt field.',
  'alt-empty-content': 'Large image with empty alt: if it carries content, give it an alt (prop or CMS field); only purely decorative images stay alt="".',
  'video-captions': 'Video: add captions (a `<track kind="captions">` in a custom video embed, or the player\'s own captions for YouTube/Vimeo) or a transcript beside it. Background videos without sound are exempt.',
  'link-vague': 'Link text says where it goes ("Lees meer over vrijwilligerswerk"); in Button Main the text prop, or an aria-label custom attribute on the link when the visible text must stay short.',
  'link-no-name': 'Icon-only link or button: add an aria-label custom attribute (a prop on the component, e.g. "Link label") or visually hidden text.',
  'nav-js': 'Nav links must exist in the HTML Webflow serves: build them as link elements in the Nav/Menu component, not injected by script; a script may only show/hide them.',
  'nav-no-href': 'Nav item without a real href (`#`, button, javascript:): give it a page link; a dropdown trigger needs its own overview page link next to it.',
  'lcp-lazy': 'The hero/LCP image: Image settings > Load = Eager (and no lazy class/script). Set it in the hero component, so every page follows.',
  'not-lazy': 'Images below the fold: Image settings > Load = Lazy (Webflow default). Set it in the component, not per page.',
  'oversized': 'Image far larger than shown: upload at most 2× the shown width, let Webflow make responsive variants (do not untick "Responsive images"), WebP/AVIF via Assets > Convert.',
  'no-dimensions': 'Image without width/height attributes: give the image a fixed aspect ratio in its class (aspect-ratio / object-fit), so nothing shifts when it loads.',
  'font-preload': 'Fonts: upload subset WOFF2 files (Latin only when the site is Dutch/English), and preload the main text and heading font in Site settings > Custom code <head> (`<link rel="preload" as="font" type="font/woff2" crossorigin>`).',
  'font-size': 'Large font file: likely not subset. Subset to the languages used (e.g. glyphhanger / fonttools pyftsubset) and upload the WOFF2.',
  'cls': 'Layout shift while loading: reserve space for late content (aspect-ratio on images and embeds, min-height on CMS lists and iframes, font fallbacks with size-adjust); reveal animations use transform/opacity, not height.',
  'jsonld-parse': 'JSON-LD that does not parse: fix the embed (Page settings > Custom code or the template\'s embed with CMS fields; escape quotes in bound text).',
  'jsonld-fields': 'JSON-LD misses required fields: fill them from the CMS fields in the template\'s embed.',
  'schema-faq': 'FAQ section: the FAQ component gets a "FAQ schema" option that writes FAQPage JSON-LD from the same CMS items (Collection List with an Embed per item, or one embed on the template).',
  'schema-article': 'Article/news/story template: an Embed in the template head (Page settings > Custom code, before </head>) with Article JSON-LD bound to name, image, published date and author fields.',
  'schema-breadcrumb': 'Breadcrumb on the page: add BreadcrumbList JSON-LD in the same component or template that shows the breadcrumb.',
  'schema-organization': 'Home: Organization (or NGO) JSON-LD with name, url, logo and sameAs, once, in Home\'s Page settings > Custom code <head>.',
  'schema-job': 'Vacancy page: JobPosting JSON-LD in the vacancy template (title, description, datePosted, hiringOrganization, jobLocation).',
  'block-wrapper': 'The block\'s root should be a semantic element: `section` for a page section, `nav` for navigation, `footer` for the footer, `article` for a stand-alone item. Element settings > Tag on the component root.',
  'block-h1': 'A block that is not the page heading must not contain an h1; set the level to h2/h3 in the component.',
};

// ---------- in-page measurements ----------
function measure({ blockSel, allowH1 }) {
  const root = blockSel ? document.querySelector(blockSel) : document.body;
  if (!root) return { missingBlock: true };
  const label = (e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}`;
  const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && (e.offsetParent !== null || s.position === 'fixed'); };
  const text = (e) => (e.textContent || '').replace(/\s+/g, ' ').trim();
  const accName = (a) => {
    const lab = a.getAttribute('aria-label'); if (lab) return lab.trim();
    const by = a.getAttribute('aria-labelledby'); if (by) return by.split(/\s+/).map(id => text(document.getElementById(id) || document.createElement('i'))).join(' ').trim();
    const t = text(a); if (t) return t;
    const img = a.querySelector('img[alt]'); if (img && img.alt.trim()) return img.alt.trim();
    const svgT = a.querySelector('svg title'); if (svgT) return text(svgT);
    return (a.getAttribute('title') || '').trim();
  };

  // structure (page mode)
  const docOrder = (a, b) => a && b ? (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : 0;
  const mains = [...document.querySelectorAll('main, [role="main"]')];
  // the site navigation: nav elements outside main and footer (hidden ones count: a closed mobile menu is display:none)
  const navs = [...document.querySelectorAll('nav, [role="navigation"]')].filter(n => !n.closest('main, [role="main"], footer, [role="contentinfo"]') && !/breadcrumb/i.test(n.getAttribute('aria-label') || n.className));
  const footers = [...document.querySelectorAll('footer, [role="contentinfo"]')].filter(f => !f.closest('main, article, section'));
  const h1s = [...document.querySelectorAll('h1')].filter(visible);
  const main = mains[0];
  const outside = main ? [...document.body.querySelectorAll('section, h1, h2, h3, article')].filter(e => visible(e) && !e.closest('main, [role="main"], nav, footer, header, [role="contentinfo"], [role="navigation"], [aria-hidden="true"], dialog, .w-nav-overlay')).slice(0, 6).map(label) : [];
  const structure = {
    main: mains.length, nav: navs.length, footer: footers.length,
    sectionsInMain: main ? main.querySelectorAll('section').length : 0,
    navBeforeMain: navs[0] && main ? docOrder(navs[0], main) < 0 : null,
    mainBeforeFooter: main && footers[0] ? docOrder(main, footers[footers.length - 1]) < 0 : null,
    h1InMain: h1s[0] && main ? main.contains(h1s[0]) : null,
    outside,
    rootTag: blockSel ? root.tagName.toLowerCase() : null,
  };

  // headings
  const hs = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(h => ({ el: h, level: +h.tagName[1], text: text(h).slice(0, 70) }));
  const skips = []; let prev = blockSel ? null : 0;
  for (const h of hs) { if (prev !== null && prev > 0 && h.level > prev + 1) skips.push(`h${prev} → h${h.level} "${h.text}"`); if (prev === 0 && h.level > 1 && !blockSel) skips.push(`first heading is h${h.level} "${h.text}"`); prev = h.level; }
  const empty = hs.filter(h => !h.text).map(h => label(h.el));
  // cards with headings: repeated items (Webflow CMS items, listitems, articles) that each hold a heading
  const items = [...root.querySelectorAll('.w-dyn-item, [role="listitem"], article')].filter(visible);
  const cardHeadings = items.filter(i => i.querySelector('h1,h2,h3,h4,h5,h6')).map(i => `${label(i.querySelector('h1,h2,h3,h4,h5,h6'))} "${text(i.querySelector('h1,h2,h3,h4,h5,h6')).slice(0, 40)}"`);
  const headings = { h1: hs.filter(h => h.level === 1).length, outline: hs.map(h => `h${h.level} ${h.text}`).slice(0, 40), skips, empty, items: items.length, cardHeadings, allowH1 };

  // media
  const imgs = [...root.querySelectorAll('img')].filter(i => visible(i) || i.loading === 'lazy');
  const vh = innerHeight;
  const media = { images: imgs.length, noAlt: [], altFilename: [], emptyAltLarge: [], videosNoTrack: [], players: [] };
  for (const i of imgs) {
    const src = (i.currentSrc || i.getAttribute('src') || '').split('/').pop().split('?')[0].slice(0, 60);
    const b = i.getBoundingClientRect();
    if (!i.hasAttribute('alt')) media.noAlt.push(src);
    else if (/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(i.alt) || /^(img|image|photo|foto|afbeelding|untitled)[\s_-]*\d*$/i.test(i.alt.trim()) || /^[\w-]{20,}$/.test(i.alt.trim())) media.altFilename.push(`${src}: "${i.alt}"`);
    else if (i.alt === '' && b.width * b.height > 200 * 200 && !i.closest('[aria-hidden="true"]') && getComputedStyle(i).position !== 'absolute') media.emptyAltLarge.push(`${src} (${Math.round(b.width)}×${Math.round(b.height)})`);
  }
  for (const v of root.querySelectorAll('video')) {
    const bg = v.closest('.w-background-video') || (v.muted && v.autoplay && !v.controls);
    if (!bg && !v.querySelector('track[kind="captions"], track[kind="subtitles"]')) media.videosNoTrack.push((v.currentSrc || '').split('/').pop().slice(0, 60) || label(v));
  }
  for (const f of root.querySelectorAll('iframe')) { const s = f.src || ''; if (/youtube|youtu\.be|vimeo|wistia|vidyard|loom/.test(s)) media.players.push(s.split('?')[0].slice(0, 80)); }

  // links
  const VAGUE = /^(klik hier|hier|lees meer|meer|meer info|meer informatie|bekijk|bekijk meer|ga verder|verder|download|link|click here|here|read more|more|learn more|see more|view|view more|details|info)\.?$/i;
  const links = { vague: [], noName: [] };
  for (const a of root.querySelectorAll('a[href], button')) {
    if (!visible(a) || a.matches('.w-webflow-badge')) continue;
    const name = accName(a);
    if (!name) links.noName.push(`${label(a)}${a.getAttribute('href') ? ' → ' + a.getAttribute('href').slice(0, 50) : ''}`);
    else if (VAGUE.test(name.replace(/[›→>»↗]+/g, '').trim()) && !a.getAttribute('aria-label')) links.vague.push(`"${name}" → ${(a.getAttribute('href') || '').slice(0, 60)}`);
  }
  const navLinks = navs.flatMap(n => [...n.querySelectorAll('a')]).map(a => a.getAttribute('href') || '').filter(Boolean);
  const navNoHref = navs.flatMap(n => [...n.querySelectorAll('a, [role="button"], button')]).filter(e => visible(e) && !e.matches('.w-dropdown-toggle, [aria-haspopup], [aria-expanded], [disabled], [class*="pagination" i]') && (e.tagName !== 'A' || /^(#|javascript:)/.test(e.getAttribute('href') || '#')) && !e.closest('.w-nav-button') && !/menu|close|sluit|zoek|search|taal|lang/i.test(accName(e))).map(e => `${label(e)} "${accName(e).slice(0, 30)}"`).slice(0, 10);
  const paginationLinks = [...document.querySelectorAll('a[href*="page="]')].map(a => a.getAttribute('href')).slice(0, 3);

  // performance (images; the LCP and CLS come from observers set up before load)
  const perf = { lcpLazy: null, notLazy: [], oversized: [], noDims: [] };
  for (const i of imgs) {
    const b = i.getBoundingClientRect(); const absTop = b.top + scrollY;
    const src = (i.currentSrc || i.src || '').split('/').pop().split('?')[0].slice(0, 50);
    if (b.width < 40 || /\.svg$/i.test(src)) continue;
    if (absTop > vh * 1.2 && i.loading !== 'lazy') perf.notLazy.push(src);
    if (i.naturalWidth > b.width * Math.max(devicePixelRatio, 1) * 2.2 && i.naturalWidth > 1200) perf.oversized.push(`${src} ${i.naturalWidth}px for ${Math.round(b.width)}px`);
    if (!i.getAttribute('width') && !i.getAttribute('height') && getComputedStyle(i).aspectRatio === 'auto' && !/absolute|fixed/.test(getComputedStyle(i).position)) perf.noDims.push(src);
  }
  const lcp = window.__seoLcp;
  if (lcp && lcp.tag === 'IMG' && lcp.lazy && (!blockSel || root.contains(window.__seoLcpEl))) perf.lcpLazy = lcp.src;
  perf.lcp = lcp ? `${lcp.tag.toLowerCase()} ${lcp.src || ''} at ${Math.round(lcp.time)} ms` : null;
  perf.cls = Math.round((window.__seoCls?.value ?? 0) * 1000) / 1000;
  perf.clsSources = window.__seoCls?.sources ?? [];
  perf.fontPreloads = [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(l => l.href.split('/').pop());

  // structured data
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent);
  const faqLike = !!root.querySelector('[class*="faq" i], [data-faq], [id*="faq" i]') || [...root.querySelectorAll('summary, [role="button"], .w-dropdown-toggle, [class*="accordion" i]')].filter(e => /\?\s*$/.test(text(e))).length >= 3;
  const breadcrumb = !!document.querySelector('nav[aria-label*="breadcrumb" i], [class*="breadcrumb" i], ol[itemtype*="BreadcrumbList"]');
  const articleLike = !!document.querySelector('article time, time[datetime], [class*="article" i] h1, [class*="blog" i] h1, [class*="post" i] h1') && h1s.length === 1;
  return { structure, headings, media, links, navLinks, navNoHref, paginationLinks, perf, ld, hints: { faqLike, breadcrumb, articleLike } };
}

// LCP and CLS observers, installed before any page script
const OBSERVERS = `(() => {
  window.__seoCls = { value: 0, sources: [] };
  try {
    new PerformanceObserver(l => { for (const e of l.getEntries()) { const el = e.element; window.__seoLcpEl = el; window.__seoLcp = { tag: el ? el.tagName : '?', src: el && el.currentSrc ? el.currentSrc.split('/').pop().split('?')[0].slice(0,50) : (e.url || '').split('/').pop().slice(0,50), lazy: !!(el && el.loading === 'lazy'), time: e.startTime }; } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) { if (e.hadRecentInput) continue; window.__seoCls.value += e.value; for (const s of e.sources || []) { const n = s.node; if (n && n.nodeType === 1 && window.__seoCls.sources.length < 8) window.__seoCls.sources.push(n.tagName.toLowerCase() + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\\s+/)[0] : '') + ' ' + e.value.toFixed(3)); } } }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
})();`;

// ---------- helpers outside the page ----------
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)].map(m => [m[1].toLowerCase(), decode(m[2])]));
function headMeta(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const meta = k => metas.find(m => m.name === k || m.property === k)?.content;
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0]));
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return {
    title: t ? decode(t[1].trim()) : undefined, description: meta('description'), robots: meta('robots'),
    canonical: links.find(l => (l.rel || '').toLowerCase() === 'canonical')?.href,
    og: { title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), url: meta('og:url'), type: meta('og:type') },
    twitterCard: meta('twitter:card'),
  };
}
// every link href in the HTML as served (no JavaScript): what a crawler that does not run scripts sees.
// Compared with the nav links after rendering; Webflow's navbar script moves the menu around at mobile
// widths, so the raw side is the whole document, not only <nav>.
function rawHrefs(html) {
  const out = new Set();
  for (const a of html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)) out.add(decode(a[1]));
  return out;
}
const robotsCache = new Map();
async function robotsFor(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let r;
  try { const res = await fetch(origin + '/robots.txt'); r = { status: res.status, body: res.status === 200 ? await res.text() : '' }; } catch (e) { r = { status: 0, body: '', error: e.message }; }
  const norm = r.body.replace(/\r/g, '').split('\n').map(l => l.trim().replace(/\s+/g, ' ').toLowerCase());
  r.page = norm.includes('disallow: /*?*page=*');
  r.undef = norm.includes('disallow: */*?*undefined=');
  r.blocksAll = norm.includes('disallow: /');
  robotsCache.set(origin, r); return r;
}
const ogTypeCache = new Map();
async function imageType(url) {
  if (ogTypeCache.has(url)) return ogTypeCache.get(url);
  let t; try { const h = await fetch(url, { method: 'HEAD' }); t = h.status === 200 ? (h.headers.get('content-type') || '?') : `HTTP ${h.status}`; } catch (e) { t = `unreachable`; }
  ogTypeCache.set(url, t); return t;
}
function schemaCheck(ldTexts) {
  const errors = [], types = [], missing = [];
  const REQ = {
    Article: ['headline', 'image', 'datePublished'], NewsArticle: ['headline', 'image', 'datePublished'], BlogPosting: ['headline', 'image', 'datePublished'],
    FAQPage: ['mainEntity'], Organization: ['name', 'url', 'logo'], NGO: ['name', 'url', 'logo'], BreadcrumbList: ['itemListElement'],
    JobPosting: ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation'], Product: ['name', 'image'], Event: ['name', 'startDate', 'location'],
  };
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    if (o['@graph']) walk(o['@graph']);
    const ts = [].concat(o['@type'] || []);
    for (const t of ts) {
      types.push(t);
      for (const f of REQ[t] || []) { const v = o[f]; if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) missing.push(`${t}.${f}`); }
      if (t === 'FAQPage') for (const q of [].concat(o.mainEntity || [])) if (!q?.acceptedAnswer?.text && !q?.acceptedAnswer?.[0]?.text) { missing.push('FAQPage.mainEntity[].acceptedAnswer.text'); break; }
    }
  };
  for (const s of ldTexts) { try { walk(JSON.parse(s)); } catch (e) { errors.push(e.message.slice(0, 80)); } }
  return { types, errors, missing: [...new Set(missing)] };
}

// ---------- run ----------
const mobile = has('mobile');
const vw = mobile ? 390 : Number(flag('width') ?? 1440), vhgt = mobile ? 844 : 900;
const browser = await chromium.launch({ channel: 'chrome', headless: !has('headed') });
const ctx = await browser.newContext({ viewport: { width: vw, height: vhgt }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
await ctx.addInitScript(OBSERVERS);
let inject = null;
if (flag('inject')) inject = { html: readFileSync(flag('inject'), 'utf8'), at: flag('at'), position: flag('position') ?? 'afterend' };

const results = [];
for (const url of urls) {
  const r = { url, areas: {}, findings: [] };
  const add = (area, level, code, detail) => r.findings.push({ area, level, code, detail, fix: FIX[code] });
  console.error(`… ${url}`);
  const page = await ctx.newPage();
  const fonts = [];
  page.on('response', async res => { if (res.request().resourceType() === 'font') { const len = Number(res.headers()['content-length'] || 0) || (await res.body().catch(() => Buffer.alloc(0))).length; const file = res.url().split('/').pop().split('?')[0]; if (fonts.some(f => f.file === file)) return; fonts.push({ file: res.url().split('/').pop().split('?')[0], kb: Math.round(len / 1024) }); } });
  let raw = '';
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(async () => page.goto(url, { waitUntil: 'load', timeout: 30000 }));
    r.status = resp?.status();
    raw = await resp?.text().catch(() => '') ?? '';
    if (!raw) raw = await (await fetch(url)).text();
  } catch (e) { add('page', 'error', 'load', `could not load: ${e.message.split('\n')[0]}`); results.push(r); await page.close(); continue; }
  if (r.status && r.status >= 400) { add('page', 'error', 'load', `HTTP ${r.status}`); results.push(r); await page.close(); continue; }
  if (inject) {
    const ok = await page.evaluate(({ html, at, position }) => { const t = document.querySelector(at); if (!t) return false; t.insertAdjacentHTML(position, html); return true; }, inject);
    if (!ok) add('page', 'error', 'inject', `--at "${inject.at}" not found`);
  }
  await page.evaluate(() => document.fonts.ready);
  // scroll through like a visitor so lazy images, reveals and late content load (and shift, if they do)
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  await page.waitForTimeout(600);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  const m = await page.evaluate(measure, { blockSel, allowH1: has('allow-h1') });
  if (m.missingBlock) { add('page', 'error', 'block', `block "${blockSel}" not on the page`); results.push(r); await page.close(); continue; }
  const head = headMeta(raw);
  r.meta = head;
  const overviewPage = blockSel ? has('overview-block') : isOverview(url);

  // structure
  const s = m.structure;
  if (!blockSel) {
    if (!s.main) add('structure', 'error', 'no-main', 'no <main>');
    if (s.main > 1) add('structure', 'error', 'many-main', `${s.main} <main> elements`);
    if (!s.nav) add('structure', 'error', 'no-nav', 'no <nav> outside main (a focus page without the main menu is fine when decisions/ say so)');
    if (!s.footer) add('structure', 'warning', 'no-footer', 'no <footer> (or role=contentinfo) outside main');
    if (s.navBeforeMain === false) add('structure', 'error', 'order', 'nav comes after main');
    if (s.mainBeforeFooter === false) add('structure', 'error', 'order', 'footer comes before main');
    if (s.h1InMain === false) add('structure', 'warning', 'h1-outside-main', 'the h1 is not inside main');
    if (s.main && !s.sectionsInMain) add('structure', 'warning', 'no-sections', 'main holds no <section>');
    if (s.outside.length) add('structure', 'warning', 'outside-main', `outside main/nav/header/footer: ${s.outside.join(', ')}`);
  } else if (!/^(section|nav|footer|header|article|aside|main)$/.test(s.rootTag)) add('structure', 'warning', 'block-wrapper', `block root is <${s.rootTag}>`);

  // robots
  if (!blockSel) {
    const rb = await robotsFor(new URL(url).origin);
    r.robots = { status: rb.status, page: rb.page, undef: rb.undef, blocksAll: rb.blocksAll };
    if (rb.blocksAll) add('robots', 'warning', 'robots-pagination', 'robots.txt blocks everything (staging?): check the pagination lines again on the production domain');
    else {
      if (!rb.page) add('robots', m.paginationLinks.length ? 'error' : 'warning', 'robots-pagination', `robots.txt lacks "Disallow: /*?*page=*"${m.paginationLinks.length ? ` and this page links to ${m.paginationLinks[0]}` : ''}`);
      if (!rb.undef) add('robots', 'warning', 'robots-pagination', 'robots.txt lacks "Disallow: */*?*undefined="');
    }
    if (/noindex/i.test(head.robots || '')) add('robots', 'warning', 'noindex', `meta robots "${head.robots}" (fine for internal pages only; seo-check.mjs --internal)`);
  }

  // headings
  const h = m.headings;
  if (!blockSel) {
    if (h.h1 !== 1) add('headings', 'error', 'h1-count', `${h.h1} h1 on the page`);
  } else if (h.h1 && !has('allow-h1')) add('headings', 'error', 'block-h1', `${h.h1} h1 in the block`);
  for (const x of h.skips) add('headings', 'warning', 'h-skip', x);
  if (h.empty.length) add('headings', 'error', 'h-empty', `empty: ${h.empty.join(', ')}`);
  if (h.cardHeadings.length) {
    if (overviewPage) add('headings', 'error', 'card-heading', `${h.cardHeadings.length} cards carry a heading, e.g. ${h.cardHeadings.slice(0, 2).join('; ')}`);
    else if (h.cardHeadings.length >= 3) add('headings', 'warning', 'card-heading', `${h.cardHeadings.length} list items carry a heading (an error on overview pages; pass --overview)`);
  }

  // meta
  if (!blockSel) {
    if (!head.title) add('meta', 'error', 'no-title', 'no <title>');
    if (!head.description) add('meta', 'error', 'no-description', 'no meta description');
    else if (/place website meta description here|lorem ipsum/i.test(head.description)) add('meta', 'error', 'no-description', `placeholder: "${head.description}"`);
    if (!head.canonical) add('meta', 'warning', 'no-canonical', 'no rel=canonical');
    else { const c = new URL(head.canonical, url); const self = new URL(url); if (c.pathname.replace(/\/$/, '') !== self.pathname.replace(/\/$/, '')) add('meta', 'error', 'canonical-other', `canonical points to another page: ${head.canonical}`); else if (c.host !== self.host) add('meta', 'ok', 'canonical-other', `canonical on ${c.host} (production domain)`); }
    if (!head.og.image) add('meta', 'error', 'no-og-image', 'no og:image');
    else { const t = await imageType(new URL(head.og.image, url).href); r.ogImageType = t; if (!/image\/(jpeg|png)/.test(t)) add('meta', 'error', 'og-image-type', `og:image is ${t}`); }
    const missingOg = ['title', 'description', 'url', 'type'].filter(k => !head.og[k]).map(k => 'og:' + k);
    if (!head.twitterCard) missingOg.push('twitter:card');
    if (missingOg.length) add('meta', 'warning', 'og-tags', `missing ${missingOg.join(', ')}`);
  }

  // media
  const md = m.media;
  if (md.noAlt.length) add('media', 'error', 'no-alt', `${md.noAlt.length} without alt: ${md.noAlt.slice(0, 4).join(', ')}`);
  if (md.altFilename.length) add('media', 'warning', 'alt-filename', md.altFilename.slice(0, 4).join(', '));
  if (md.emptyAltLarge.length) add('media', 'warning', 'alt-empty-content', `large images with alt="": ${md.emptyAltLarge.slice(0, 4).join(', ')} (fine if decorative)`);
  if (md.videosNoTrack.length) add('media', 'warning', 'video-captions', `video without captions track: ${md.videosNoTrack.join(', ')}`);
  if (md.players.length) add('media', 'warning', 'video-captions', `embedded player, check captions or a transcript by hand: ${md.players.slice(0, 3).join(', ')}`);

  // links
  if (m.links.vague.length) add('links', 'warning', 'link-vague', m.links.vague.slice(0, 5).join('; '));
  if (m.links.noName.length) add('links', 'error', 'link-no-name', m.links.noName.slice(0, 5).join('; '));
  if (!blockSel) {
    const rawNav = rawHrefs(raw);
    const jsOnly = [...new Set(m.navLinks)].filter(href => !rawNav.has(href) && !/^(#|javascript:)/.test(href));
    if (jsOnly.length) add('links', 'error', 'nav-js', `${jsOnly.length} nav links only exist after JavaScript: ${jsOnly.slice(0, 4).join(', ')}`);
    if (m.navNoHref.length) add('links', 'warning', 'nav-no-href', m.navNoHref.slice(0, 5).join('; '));
  }

  // performance
  const p = m.perf;
  r.perf = { lcp: p.lcp, cls: p.cls, fonts, fontPreloads: p.fontPreloads };
  if (p.lcpLazy) add('perf', 'error', 'lcp-lazy', `the LCP image is lazy-loaded: ${p.lcpLazy}`);
  if (p.notLazy.length) add('perf', 'warning', 'not-lazy', `${p.notLazy.length} images below the fold load eagerly: ${p.notLazy.slice(0, 4).join(', ')}`);
  if (p.oversized.length) add('perf', 'warning', 'oversized', p.oversized.slice(0, 4).join('; '));
  if (p.noDims.length) add('perf', 'warning', 'no-dimensions', `${p.noDims.length} images without width/height or aspect-ratio: ${p.noDims.slice(0, 3).join(', ')}`);
  if (!blockSel) {
    if (p.cls > 0.1) add('perf', 'error', 'cls', `CLS ${p.cls}: ${p.clsSources.join(', ')}`);
    else if (p.cls > 0.05) add('perf', 'warning', 'cls', `CLS ${p.cls}: ${p.clsSources.join(', ')}`);
    const big = fonts.filter(f => f.kb > 100);
    if (big.length) add('perf', 'warning', 'font-size', big.map(f => `${f.file} ${f.kb} kB`).join(', '));
    if (fonts.length && !p.fontPreloads.length) add('perf', 'warning', 'font-preload', `${fonts.length} font files, none preloaded`);
  }

  // structured data
  if (!blockSel || m.hints.faqLike) {
    const sc = schemaCheck(m.ld);
    r.schema = sc;
    for (const e of sc.errors) add('schema', 'error', 'jsonld-parse', e);
    if (sc.missing.length) add('schema', 'warning', 'jsonld-fields', `missing: ${sc.missing.join(', ')}`);
    const t = new Set(sc.types);
    if (m.hints.faqLike && !t.has('FAQPage')) add('schema', 'warning', 'schema-faq', 'FAQ on the page, no FAQPage JSON-LD');
    if (!blockSel) {
      if (m.hints.breadcrumb && !t.has('BreadcrumbList')) add('schema', 'warning', 'schema-breadcrumb', 'breadcrumb on the page, no BreadcrumbList JSON-LD');
      if (m.hints.articleLike && !['Article', 'NewsArticle', 'BlogPosting'].some(x => t.has(x))) add('schema', 'warning', 'schema-article', 'looks like an article (date + one h1), no Article JSON-LD');
      if ((new URL(url).pathname === '/' || /^\/[a-z]{2}\/?$/.test(new URL(url).pathname)) && !['Organization', 'NGO', 'WebSite', 'LocalBusiness'].some(x => t.has(x))) add('schema', 'warning', 'schema-organization', 'home without Organization JSON-LD');
      if (/vacature|vacancy|job|careers|werken-bij/i.test(new URL(url).pathname) && new URL(url).pathname.split('/').filter(Boolean).length > 1 && !t.has('JobPosting')) add('schema', 'warning', 'schema-job', 'vacancy page without JobPosting JSON-LD');
    }
  }

  for (const area of ['structure', 'robots', 'headings', 'meta', 'media', 'links', 'perf', 'schema']) {
    const f = r.findings.filter(x => x.area === area && x.level !== 'ok');
    r.areas[area] = blockSel && ['robots', 'meta'].includes(area) ? '—' : f.some(x => x.level === 'error') ? '❌' : f.length ? '⚠️' : '✅';
  }
  results.push(r);
  await page.close();
}
await browser.close();

// the same title or description on two pages
if (!blockSel) for (const [key, code] of [['title', 'dup-title'], ['description', 'dup-description']]) {
  const by = new Map();
  for (const r of results) { const v = r.meta?.[key]; if (v) by.set(v, [...(by.get(v) || []), r]); }
  for (const [v, rs] of by) if (rs.length > 1) for (const r of rs) {
    r.findings.push({ area: 'meta', level: 'warning', code, detail: `same ${key} as ${rs.length - 1} other page(s): "${v.slice(0, 60)}"`, fix: FIX[code] });
    if (r.areas.meta === '✅') r.areas.meta = '⚠️';
  }
}

// ---------- report ----------
const AREAS = ['structure', 'robots', 'headings', 'meta', 'media', 'links', 'perf', 'schema'];
const short = u => { const x = new URL(u); return (x.pathname + x.search) || '/'; };
const lines = [`# SEO audit${blockSel ? ` — block ${blockSel}` : ''}`, '', `${new Date().toISOString()} · ${urls.length} URL(s) · viewport ${vw}×${vhgt}`, ''];
lines.push(`| page | ${AREAS.join(' | ')} |`, `|---|${AREAS.map(() => '---').join('|')}|`);
for (const r of results) lines.push(`| ${short(r.url)} | ${AREAS.map(a => r.areas[a] ?? '❌').join(' | ')} |`);
lines.push('');
const fixesUsed = new Set();
for (const r of results) {
  const f = r.findings.filter(x => x.level !== 'ok');
  lines.push(`## ${short(r.url)}`, '');
  if (r.perf) lines.push(`LCP: ${r.perf.lcp ?? '?'} · CLS: ${r.perf.cls} · fonts: ${r.perf.fonts.map(x => `${x.file} ${x.kb} kB`).join(', ') || 'none'}${r.schema ? ` · JSON-LD: ${r.schema.types.join(', ') || 'none'}` : ''}`, '');
  if (!f.length) { lines.push('All checks ok.', ''); continue; }
  for (const x of f) { lines.push(`- ${x.level === 'error' ? '❌' : '⚠️'} **${x.area}** ${x.detail} \`${x.code}\``); if (x.fix) fixesUsed.add(x.code); }
  lines.push('');
}
if (fixesUsed.size) {
  lines.push('## What to do in Webflow', '', 'Fix in the component or template so every page follows, never page by page.', '');
  for (const c of fixesUsed) lines.push(`- \`${c}\`: ${FIX[c]}`);
  lines.push('');
}
const errors = results.reduce((n, r) => n + r.findings.filter(x => x.level === 'error').length, 0);
const warnings = results.reduce((n, r) => n + r.findings.filter(x => x.level === 'warning').length, 0);
lines.push(`**${errors} errors, ${warnings} warnings.**`);
const report = lines.join('\n');
console.log(report);
if (flag('out')) {
  const out = resolve(flag('out')); mkdirSync(out, { recursive: true });
  writeFileSync(resolve(out, 'seo-audit.json'), JSON.stringify(results, null, 2));
  writeFileSync(resolve(out, 'seo-audit.md'), report);
}
process.exit(errors ? 1 : 0);
