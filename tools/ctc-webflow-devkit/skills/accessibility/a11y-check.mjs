#!/usr/bin/env node
// Accessibility check of published pages (WCAG 2.2 AA): what a machine can find, plus the
// keyboard and zoom checks that axe-core does not do. It measures; a person (or a reviewer)
// still does the checks in criteria.md that need eyes and ears.
//
//   node a11y-check.mjs <url> [<url> …] --out <dir> [--widths 1440,375] [--tabs 120] [--headed]
//
// Uses playwright-core and axe-core from ../../references/fixture (run `npm install` there once).
// Per page and width it writes to <dir>/<page>/:
//   axe-<w>.json       axe-core violations (wcag2a/aa, wcag21a/aa, wcag22aa) and "needs review" items
//   focus-<w>/NN.png   a crop around every element the Tab key reaches, in order
//   summary.md         everything below in one table per page
// Own checks, per width:
//   - Tab walk: focus order, focus on something invisible or aria-hidden, no visible focus change,
//     focus fully covered by a sticky/fixed bar (2.4.11), a possible keyboard trap
//   - skip link: the first Tab stop jumps to an element that exists
//   - target size under 24 × 24 px (2.5.8), inline text links excepted
//   - toggles: aria-expanded present, flips on click, Escape closes and returns focus
//   - vague link text ("lees meer", "read more", "klik hier") without a better accessible name
//   - running animations longer than 5 s or infinite, autoplay video (2.2.2)
// Once per page:
//   - reflow at 320 px (1.4.10), text spacing (1.4.12), root font size 200 % (1.4.4 / rem check)
// Exit code 1 when axe reports serious/critical violations or an own check fails.

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../references/fixture/package.json', import.meta.url));
const { chromium } = require('playwright-core');
const axePath = require.resolve('axe-core/axe.min.js');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const urls = args.filter((a, i) => /^https?:/.test(a) && !args[i - 1]?.startsWith('--'));
if (!urls.length || !flag('--out')) { console.error('usage: node a11y-check.mjs <url> [<url> …] --out <dir> [--widths 1440,375] [--tabs 120] [--headed]'); process.exit(2); }
const widths = (flag('--widths') ?? '1440,375').split(',').map(Number);
const maxTabs = Number(flag('--tabs') ?? 120);
const out = resolve(flag('--out'));

const browser = await chromium.launch({ channel: 'chrome', headless: !args.includes('--headed') });
let failed = false;

const slug = (u) => (new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home');
const settle = async (page) => { await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(800); };

// ---------- in-page helpers (serialised into the page) ----------
const helpers = () => {
  window.__a11y = {
    label(e) {
      if (!e || e === document.body) return 'body';
      const name = (e.getAttribute('aria-label') || e.innerText || e.getAttribute('alt') || e.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      const cls = typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : '';
      return `${e.tagName.toLowerCase()}${cls}${name ? ` "${name}"` : ''}`;
    },
    sig(e) {
      // style signature of the element, 3 ancestors and up to 20 descendants
      const nodes = [e]; let p = e.parentElement; for (let i = 0; i < 3 && p; i++, p = p.parentElement) nodes.push(p);
      nodes.push(...[...e.querySelectorAll('*')].slice(0, 20));
      return nodes.map((n) => { const s = getComputedStyle(n); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.backgroundColor, s.color, s.borderColor, s.textDecorationLine, s.transform, s.opacity].join('|'); }).join('#')
        + '#' + [...document.querySelectorAll('[data-trigger]')].filter((n) => n.contains(e)).map((n) => getComputedStyle(n).getPropertyValue('--_trigger---on')).join(',');
    },
    hiddenReason(e) {
      const r = e.getBoundingClientRect();
      if (e.closest('[aria-hidden="true"]')) return 'inside aria-hidden';
      if (e.closest('[inert]')) return 'inside inert';
      for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n); if (s.visibility === 'hidden') return 'visibility hidden'; if (Number(s.opacity) === 0) return 'opacity 0 (' + this.label(n) + ')'; }
      if (r.width < 1 || r.height < 1) return 'no size';
      const skip = r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth + 1;
      if (skip && !/skip|main|content|inhoud/i.test(e.getAttribute('href') || '')) return 'off screen';
      return '';
    },
    obscured(e) {
      const r = e.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= innerHeight) return '';
      const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2]];
      let by = null;
      for (const [x, y] of pts) {
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        const top = document.elementFromPoint(x, y);
        if (!top || e.contains(top) || top.contains(e)) return '';
        let f = top; while (f && !['fixed', 'sticky'].includes(getComputedStyle(f).position)) f = f.parentElement;
        if (!f) return '';
        by = f;
      }
      return by ? this.label(by) : '';
    },
  };
};

const ownChecks = () => {
  const L = window.__a11y.label.bind(window.__a11y);
  const res = { small: [], vague: [], toggles: [], motion: [], landmarks: {}, headings: [] };
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('[aria-hidden="true"]'); };
  const ctrls = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=checkbox], [role=switch], [tabindex]:not([tabindex="-1"])')].filter(vis);
  for (const e of ctrls) {
    const r = e.getBoundingClientRect();
    if (r.width >= 24 && r.height >= 24) continue;
    const inline = getComputedStyle(e).display === 'inline' && e.parentElement && (e.parentElement.innerText || '').trim().length > (e.innerText || '').trim().length + 5;
    if (inline) continue;
    // spacing exception: a 24 px circle around the centre does not hit another target
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const near = ctrls.some((o) => { if (o === e || o.contains(e) || e.contains(o)) return false; const q = o.getBoundingClientRect(); const dx = Math.max(q.left - cx, 0, cx - q.right), dy = Math.max(q.top - cy, 0, cy - q.bottom); return Math.hypot(dx, dy) < 12; });
    if (near) res.small.push(`${L(e)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  const vagueRe = /^(lees meer|meer|meer info|klik hier|hier|bekijk|read more|more|learn more|click here|here|ontdek|ontdek meer)$/i;
  for (const a of document.querySelectorAll('a[href], button')) {
    if (!vis(a)) continue;
    const text = (a.innerText || '').trim().replace(/\s+/g, ' ');
    const named = a.getAttribute('aria-label') || a.getAttribute('aria-labelledby') || a.getAttribute('aria-describedby') || a.querySelector('.u-sr-only, .sr-only, [class*="sr-only"]');
    if (vagueRe.test(text) && !named) res.vague.push(`${L(a)} → ${a.getAttribute('href') || ''}`.slice(0, 120));
  }
  const toggleSel = '[aria-expanded], [aria-controls], [aria-haspopup], .w-dropdown-toggle, .w-nav-button, [data-nav="menu-button"], [class*="accordion"][class*="toggle"], [class*="burger"], summary';
  for (const t of document.querySelectorAll(toggleSel)) if (vis(t) && t.getAttribute('aria-haspopup') !== 'dialog') res.toggles.push({ label: L(t), expanded: t.getAttribute('aria-expanded'), tag: t.tagName.toLowerCase(), role: t.getAttribute('role'), tabbable: t.tabIndex >= 0 });
  for (const a of document.getAnimations()) {
    const t = a.effect?.getComputedTiming?.(); if (!t) continue;
    const total = t.iterations === Infinity ? Infinity : (t.activeDuration || 0);
    if (a.playState === 'running' && total > 5000) res.motion.push(`${a.constructor.name} on ${L(a.effect.target)} ${total === Infinity ? 'infinite' : Math.round(total / 1000) + ' s'}`);
  }
  for (const v of document.querySelectorAll('video')) if (v.autoplay && !v.paused && !v.controls) res.motion.push(`autoplay video ${L(v)} without controls (${v.muted ? 'muted' : 'with sound'}${v.loop ? ', loop' : ''})`);
  const lm = (sel) => [...document.querySelectorAll(sel)].filter((e) => !e.closest('[aria-hidden="true"]'));
  res.landmarks = {
    lang: document.documentElement.lang || '(none)',
    main: lm('main, [role=main]').length,
    nav: lm('nav, [role=navigation]').filter((n) => !n.classList.contains('w-dropdown-list')).map((n) => n.getAttribute('aria-label') || n.getAttribute('aria-labelledby') || '(no label)'),
    header: lm('header, [role=banner]').filter((h) => h.getAttribute('role') === 'banner' || !h.closest('article, aside, main, nav, section')).length, footer: lm('footer, [role=contentinfo]').length,
    title: document.title,
  };
  let prev = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { if (!vis(h)) continue; const n = +h.tagName[1]; res.headings.push(`${'  '.repeat(n - 1)}H${n}${prev && n > prev + 1 ? ' ⚠ skips a level' : ''} ${h.innerText.trim().slice(0, 60)}`); prev = n; }
  return res;
};

const clipped = () => {
  const out = [];
  for (const e of document.querySelectorAll('body *')) {
    const s = getComputedStyle(e);
    if (s.display === 'none' || e.closest('[aria-hidden="true"], .swiper, [class*="slider"], [class*="marquee"], [class*="sr-only"]')) continue;
    const ox = s.overflowX, oy = s.overflowY;
    const clips = (v) => v === 'hidden' || v === 'clip';
    if (!(clips(ox) || clips(oy) || s.webkitLineClamp !== 'none')) continue;
    if (!(e.innerText || '').trim()) continue;
    if ((clips(oy) && e.scrollHeight > e.clientHeight + 2) || (clips(ox) && e.scrollWidth > e.clientWidth + 2)) out.push(window.__a11y.label(e) + (s.webkitLineClamp !== 'none' ? ' (line clamp: on purpose? the full text must be reachable)' : ''));
  }
  return out;
};
const hScroll = () => document.documentElement.scrollWidth - document.documentElement.clientWidth;

// ---------- per page ----------
for (const url of urls) {
  const dir = resolve(out, slug(url)); await mkdir(dir, { recursive: true });
  const md = [`# ${url}`, ''];
  const fails = [];
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await settle(page);
    await page.evaluate(helpers);

    // axe
    await page.addScriptTag({ path: axePath });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations', 'incomplete'] });
      const map = (v) => ({ id: v.id, impact: v.impact, help: v.help, wcag: v.tags.filter((t) => /^wcag\d{3,}$/.test(t)).join(' '), nodes: v.nodes.length, targets: v.nodes.slice(0, 6).map((n) => n.target.join(' ')) });
      return { violations: r.violations.map(map), incomplete: r.incomplete.map(map) };
    });
    await writeFile(resolve(dir, `axe-${w}.json`), JSON.stringify(axe, null, 2));
    const serious = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    if (serious.length) fails.push(`axe ${w}: ${serious.length} serious/critical`);

    const own = await page.evaluate(ownChecks);

    // Tab walk
    const fdir = resolve(dir, `focus-${w}`); await mkdir(fdir, { recursive: true });
    await page.evaluate(() => { scrollTo(0, 0); document.activeElement?.blur(); });
    const walk = []; const seen = [];
    for (let i = 1; i <= maxTabs; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(120);
      const step = await page.evaluate(async () => {
        const e = document.activeElement; const A = window.__a11y;
        if (!e || e === document.body) return null;
        const focusedSig = A.sig(e);
        const r = e.getBoundingClientRect();
        // compare with the unfocused look: blur, read, refocus without scrolling
        e.blur(); await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        const restSig = A.sig(e);
        e.focus({ preventScroll: true, focusVisible: true }); await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        return { iframe: e.tagName === 'IFRAME', label: A.label(e), path: (() => { const p = []; for (let n = e; n && n !== document.body; n = n.parentElement) p.unshift(n.tagName + (n.id ? '#' + n.id : '') + ':' + [...(n.parentElement?.children || [])].indexOf(n)); return p.join('>'); })(),
          hidden: A.hiddenReason(e), noChange: focusedSig === restSig, obscured: A.obscured(e), href: e.getAttribute('href') || '',
          box: { x: Math.max(0, r.x - 24), y: Math.max(0, r.y - 24), width: Math.min(innerWidth, r.width + 48), height: Math.min(innerHeight, r.height + 48) } };
      });
      if (!step) { if (walk.length) break; else continue; }
      if (seen.length && step.path === seen[0]) break; // wrapped round
      // Tab inside an iframe keeps the iframe as activeElement: one stop per iframe, judged on its own page
      if (step.iframe) { const last = walk[walk.length - 1]; if (last?.path === step.path) { last.inner = (last.inner || 1) + 1; continue; } step.noChange = false; }
      seen.push(step.path);
      walk.push(step);
      if (step.box.width > 4 && step.box.height > 4 && step.box.y < 900) await page.screenshot({ path: resolve(fdir, `${String(walk.length).padStart(2, '0')}.png`), clip: step.box }).catch(() => {});
      const tail = seen.slice(-30); if (seen.length > 40 && new Set(tail).size <= 3) { step.trap = true; break; }
    }
    // skip link: first stop jumps to an element that exists
    const first = walk[0];
    let skip = 'no skip link as first Tab stop';
    if (first && /^#./.test(first.href)) skip = (await page.evaluate((h) => !!document.getElementById(h.slice(1)), first.href)) ? `ok (${first.href})` : `target ${first.href} does not exist`;

    // toggles: click, Escape, focus back
    const toggleRes = [];
    const handles = await page.$$('[aria-expanded="false"]');
    for (const h of handles.slice(0, 8)) {
      if (!(await h.isVisible().catch(() => false))) continue;
      const lbl = await h.evaluate((e) => window.__a11y.label(e));
      const isLink = await h.evaluate((e) => e.tagName === 'A' && /^(https?:|\/)/.test(e.getAttribute('href') || ''));
      if (isLink) { toggleRes.push(`${lbl}: is a link to a page, skipped`); continue; }
      try {
        await h.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
        const open = await h.getAttribute('aria-expanded');
        await page.keyboard.press('Escape'); await page.waitForTimeout(500);
        const after = await h.getAttribute('aria-expanded');
        const back = await h.evaluate((e) => document.activeElement === e || e.contains(document.activeElement));
        const problems = [open !== 'true' && 'Enter does not set aria-expanded="true"', after !== 'false' && 'Escape does not close', !back && 'focus not back on the toggle after Escape'].filter(Boolean);
        toggleRes.push(`${lbl}: ${problems.length ? problems.join('; ') : 'ok'}`);
        if (after === 'true') { await h.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(400); }
      } catch (e) { toggleRes.push(`${lbl}: could not test (${e.message.split('\n')[0]})`); }
    }

    const hiddenStops = walk.filter((s) => s.hidden);
    const noRing = walk.filter((s) => !s.hidden && s.noChange);
    const covered = walk.filter((s) => s.obscured);
    const trap = walk.some((s) => s.trap);
    if (hiddenStops.length) fails.push(`${w}: ${hiddenStops.length} Tab stops on something invisible`);
    if (noRing.length) fails.push(`${w}: ${noRing.length} Tab stops without a visible change`);
    if (covered.length) fails.push(`${w}: ${covered.length} Tab stops fully under a sticky/fixed bar`);
    if (trap) fails.push(`${w}: possible keyboard trap`);
    if (own.small.length) fails.push(`${w}: ${own.small.length} targets under 24 × 24`);
    if (toggleRes.some((t) => /does not|not back/.test(t))) fails.push(`${w}: toggle problems`);

    md.push(`## ${w} px`, '',
      `- **axe**: ${axe.violations.length} violations (${serious.length} serious/critical), ${axe.incomplete.length} to check by hand → \`axe-${w}.json\``,
      ...axe.violations.map((v) => `  - ${v.impact} · ${v.id} (${v.wcag}) · ${v.help} · ${v.nodes}× · ${v.targets.slice(0, 3).join(' | ')}`),
      `- **Landmarks**: lang \`${own.landmarks.lang}\`, main ${own.landmarks.main}, nav [${own.landmarks.nav.join(', ')}]${new Set(own.landmarks.nav).size < own.landmarks.nav.length ? ' ⚠ two navs with the same name' : ''}, banner ${own.landmarks.header}, footer ${own.landmarks.footer}, title "${own.landmarks.title}"`,
      `- **Skip link**: ${skip}`,
      `- **Tab walk**: ${walk.length} stops${trap ? ', ⚠ possible keyboard trap' : ''} → \`focus-${w}/\``,
      ...hiddenStops.map((s) => `  - ❌ focus on invisible element: ${s.label} (${s.hidden}${/clickable|slide|card/.test(s.label) && s.hidden === 'off screen' ? '; a slide? focusing it must bring it into view' : ''})`),
      ...noRing.map((s) => `  - ❌ no visible focus change: ${s.label} (check the crop)`),
      ...covered.map((s) => `  - ❌ focus fully covered by ${s.obscured}: ${s.label}`),
      ...walk.filter((s) => s.iframe).map((s) => `  - iframe ${s.label}: ${s.inner || 1} Tab stops inside, reached and left by keyboard — check its focus states on the form's own page`),
      `- **Order**: ${walk.map((s, i) => `${i + 1}. ${s.label}`).join(' · ').slice(0, 1500)}`,
      `- **Targets under 24 px**: ${own.small.length ? own.small.join('; ') : 'none'}`,
      `- **Toggles**: ${own.toggles.length} found; ${own.toggles.filter((t) => t.expanded === null).map((t) => `⚠ no aria-expanded: ${t.label}`).join('; ') || 'all carry aria-expanded'}`,
      ...toggleRes.map((t) => `  - ${t}`),
      `- **Vague link text**: ${own.vague.length ? own.vague.join('; ') : 'none'}`,
      `- **Motion over 5 s / autoplay**: ${own.motion.length ? own.motion.join('; ') + ' → needs a pause/stop control or must stop within 5 s' : 'none'}`,
      '');
    if (w === widths[0]) md.push('### Headings', '```', ...own.headings, '```', '');
    await ctx.close();
  }

  // zoom and text checks, once per page
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await settle(page); await page.evaluate(helpers);
  const reflow = await page.evaluate(hScroll);
  await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(400);
  const base = new Set(await page.evaluate(clipped));
  await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }' });
  await page.waitForTimeout(300);
  const spacing = (await page.evaluate(clipped)).filter((c) => !base.has(c));
  const spacingScroll = await page.evaluate(hScroll);
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page); await page.evaluate(helpers);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' }); await page.waitForTimeout(400);
  const big = (await page.evaluate(clipped)).filter((c) => !base.has(c)).slice(0, 8);
  const bigScroll = await page.evaluate(hScroll);
  const pxFonts = await page.evaluate(() => { const s = new Set(); for (const e of document.querySelectorAll('body *')) { if (!(e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))) continue; const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 20) s.add(window.__a11y.label(e) + ` ${fs}px`); } return [...s].slice(0, 15); });
  await page.screenshot({ path: resolve(dir, 'font-200.png'), fullPage: false });
  await ctx.close();
  if (reflow > 0) fails.push(`reflow: ${reflow} px sideways scroll at 320`);
  const hardClip = spacing.filter((c) => !c.includes('line clamp'));
  if (hardClip.length || spacingScroll > 0) fails.push(`text spacing: ${hardClip.length} clipped`);
  md.push('## Zoom and text', '',
    `- **Reflow 320 px** (1.4.10): ${reflow > 0 ? `❌ ${reflow} px sideways scroll` : 'ok'}`,
    `- **Text spacing** (1.4.12): ${spacing.length || spacingScroll > 0 ? `❌ newly clipped: ${spacing.join('; ') || '—'}${spacingScroll > 0 ? `; sideways scroll ${spacingScroll} px` : ''}` : 'ok'}`,
    `- **Root font size 200 %** (rem check): ${big.length || bigScroll > 0 ? `⚠ newly clipped: ${big.join('; ') || '—'}${bigScroll > 0 ? `; sideways scroll ${bigScroll} px` : ''}` : 'ok'}; text that stayed under 20 px (does not follow the browser font size, likely px): ${pxFonts.length ? pxFonts.join('; ') : 'none'} → \`font-200.png\``,
    '', `**Result**: ${fails.length ? '❌ ' + fails.join(' · ') : '✅ no machine-found failures'} (then the hand checks in criteria.md)`, '');
  if (fails.length) failed = true;
  await writeFile(resolve(dir, 'summary.md'), md.join('\n'));
  console.log(`${url}: ${fails.length ? fails.join(' · ') : 'ok'} → ${dir}/summary.md`);
}
await browser.close();
process.exit(failed ? 1 : 0);
