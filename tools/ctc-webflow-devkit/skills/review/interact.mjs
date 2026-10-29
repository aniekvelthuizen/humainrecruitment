#!/usr/bin/env node
// Use a section like a visitor and photograph it while things move.
//
//   node interact.mjs <url> --section <selector> --out <dir> [--widths 1440,375] [--reduced-motion] [--headed]
//
// Per width, inside the section: click every tab, hover the first card or link, drag every slider
// left, right and past both ends (mouse), press every arrow/dot button, then Tab through with the
// keyboard. After every step it takes a screenshot (also one *during* each drag) and checks:
//  - moving content over other content: a slide, card or panel overlapping text or a button that
//    sits outside the moving part (the intro next to a slider, the tab bar under it)
//  - an outline or ring after a mouse action (only keyboard focus may draw one)
//  - the section changing height or the page scrolling sideways after the step
//  - tab states: the active tab in Webflow's default grey, an active tab that looks like the rest,
//    a hover that looks the same as active (pictures <width>-tabN-hover-tabM.png)
// It never presses a submit button or a button inside a form (a form without required fields would
// really send). Tabs that move (a marquee) or sit off screen are skipped with a note: run again with
// --reduced-motion for those, it also shows the reduced-motion state.
// Output: <dir>/<width>-<nn>-<step>.png, <dir>/steps.json, <dir>/summary.md. Look at every picture:
// the checks catch the common faults, the pictures catch the rest.

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../references/fixture/package.json', import.meta.url));
const { chromium } = require('playwright-core');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const url = args.find(a => /^https?:/.test(a));
const section = flag('--section');
if (!url || !section || !flag('--out')) { console.error('usage: node interact.mjs <url> --section <selector> --out <dir> [--widths 1440,375]'); process.exit(2); }
const widths = (flag('--widths') ?? '1440,375').split(',').map(Number);
const out = resolve(flag('--out'));
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: !args.includes('--headed') });
const steps = [];
const md = [`# Interact — ${url} \`${section}\``, ''];

// Runs in the page: what is wrong right now inside the section.
const inspect = ({ section, mouse }) => {
  const root = document.querySelector(section);
  if (!root) return { missing: true };
  const vis = (e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
  const label = (e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().trim().split(/\s+/).slice(0, 2).join('.')}`;
  // moving parts: slider lists and their items, tab panes
  const movers = [...root.querySelectorAll('[data-slider] *, .w-slider *, .swiper *, [class*="slider_list"] > *, [class*="slide"]')]
    .filter(e => e.parentElement && /slider_list|swiper-wrapper|w-slider-mask|slides?$/.test(e.parentElement.className) && vis(e));
  const moverZone = (e) => movers.some(m => m.contains(e) || m === e);
  const sliderRoots = [...root.querySelectorAll('[data-slider], .w-slider, .swiper, [class*="slider_list"]')];
  const insideSlider = (e) => sliderRoots.some(s => s.contains(e));
  // fixed content: leaf texts and controls outside every slider
  const fixed = [...root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,button,[class*="tag"],[class*="menu"]')]
    .filter(e => vis(e) && !insideSlider(e) && !moverZone(e) && e.textContent.trim());
  const hit = (a, b) => !(a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1);
  const overlaps = [];
  for (const m of movers) {
    const mr = m.getBoundingClientRect();
    for (const f of fixed) if (hit(mr, f.getBoundingClientRect())) overlaps.push(`${label(m)} over ${label(f)} "${f.textContent.trim().slice(0, 30)}"`);
  }
  const rings = [];
  if (mouse) for (const e of root.querySelectorAll('*')) {
    const cs = getComputedStyle(e);
    if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 && !e.matches(':focus-visible')) rings.push(`${label(e)} outline ${cs.outlineWidth} ${cs.outlineStyle}`);
  }
  const de = document.documentElement;
  const uniq = [...new Set(overlaps)];
  return { height: Math.round(root.getBoundingClientRect().height), overlaps: uniq.length > 3 ? [...uniq.slice(0, 3), `+${uniq.length - 3} more`] : uniq, rings: rings.slice(0, 5), pageOverflowX: de.scrollWidth > de.clientWidth + 1 };
};

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: args.includes('--reduced-motion') ? 'reduce' : 'no-preference' });
  // pages with a video or live embed never go network-idle: fall back to load + a pause
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 }).catch(async () => { await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(3000); });
  await page.evaluate(() => document.fonts.ready);
  const root = page.locator(section).first();
  if (!(await root.count())) { md.push(`## ${w}px`, '', `**No match for \`${section}\`.**`, ''); continue; }
  await root.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  let n = 0, baseHeight = null;
  md.push(`## ${w}px`, '', '| # | step | height | moving over fixed content | ring after mouse | sideways scroll |', '|---|---|---|---|---|---|');
  const snap = async (name, mouse = true) => {
    n++;
    const file = `${w}-${String(n).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: resolve(out, file), clip: await root.boundingBox().then(b => b && { x: 0, y: Math.max(0, b.y), width: w, height: Math.min(b.height, 4000) }) ?? undefined }).catch(() => page.screenshot({ path: resolve(out, file) }));
    const s = await page.evaluate(inspect, { section, mouse });
    baseHeight ??= s.height;
    steps.push({ width: w, step: name, file, ...s });
    md.push(`| ${n} | ${name} | ${s.height}${s.height !== baseHeight ? ` **(was ${baseHeight})**` : ''} | ${s.overlaps.length ? '**' + s.overlaps.join('; ') + '**' : '—'} | ${s.rings.length ? '**' + s.rings.join('; ') + '**' : '—'} | ${s.pageOverflowX ? '**yes**' : 'no'} |`);
  };
  await snap('rest', false);

  // tabs
  const tabs = root.locator('[role="tab"]:visible:not([aria-hidden="true"]), .w-tab-link:visible');
  const tabCount = await tabs.count();
  const tabStates = tabCount ? [...Array(tabCount).keys()] : [null];
  for (const t of tabStates) {
    if (t !== null) {
      if (!await tabs.nth(t).click({ timeout: 5000 }).then(() => true, () => false)) { md.push(`| — | tab${t + 1} | **not clickable (moving or off screen): rerun with --reduced-motion or test it by script** | | | |`); continue; }
      await page.mouse.move(0, 0); await page.waitForTimeout(700); await snap(`tab${t + 1}`);
      // tab states: rest, hover and active must each look designed, and active must read stronger than hover
      const look = (e) => { const cs = getComputedStyle(e); return { bg: cs.backgroundColor, color: cs.color, weight: cs.fontWeight }; };
      const active = await tabs.nth(t).evaluate(look);
      const other = (t + 1) % tabCount;
      const rest = await tabs.nth(other).evaluate(look);
      await tabs.nth(other).hover({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(700);
      const hover = await tabs.nth(other).evaluate(look);
      await tabs.nth(other).screenshot({ path: resolve(out, `${w}-tab${t + 1}-hover-tab${other + 1}.png` ) }).catch(() => {});
      const flags = [];
      if (/rgb\(200, 200, 200\)|rgb\(221, 221, 221\)/.test(active.bg)) flags.push('active tab has Webflow\'s default grey');
      if (active.color === rest.color && active.weight === rest.weight && active.bg === rest.bg) flags.push('active tab looks the same as the others');
      if (hover.color === active.color && hover.weight === active.weight && hover.bg === active.bg) flags.push('hover looks the same as active — check the picture for another hover sign');
      md.push(`| ${n}b | tab states | active ${JSON.stringify(active)} · rest ${JSON.stringify(rest)} · hover ${JSON.stringify(hover)} | ${flags.length ? '**' + flags.join('; ') + '**' : '—'} | | |`);
      steps.push({ width: w, step: `tab${t + 1}-states`, active, rest, hover, flags });
      await page.mouse.move(0, 0); await page.waitForTimeout(400);
    }
    // sliders in the visible pane: drag left, then past the start, then past the end
    const lists = root.locator('[class*="slider_list"]:visible, .w-slider-mask:visible, .swiper-wrapper:visible');
    for (let i = 0; i < Math.min(await lists.count(), 2); i++) {
      const box = await lists.nth(i).boundingBox(); if (!box) continue;
      const y = box.y + Math.min(box.height / 2, 250), x0 = Math.min(box.x + box.width / 2, w - 40);
      for (const [name, dx] of [['drag-left', -320], ['drag-right-past-start', 700], ['drag-left-far', -1600]]) {
        await page.mouse.move(x0, y); await page.mouse.down();
        for (let k = 1; k <= 12; k++) { await page.mouse.move(x0 + (dx * k) / 12, y); await page.waitForTimeout(25); }
        await snap(`${name}-during`);
        await page.mouse.up(); await page.waitForTimeout(1000); await snap(`${name}-after`);
      }
    }
    // arrows and dots
    const buttons = root.locator('button:visible, [aria-label*="slide" i]:visible, [aria-label*="next" i]:visible, [aria-label*="prev" i]:visible, [class*="arrow"]:visible, [class*="dot"]:visible');
    for (let i = 0; i < Math.min(await buttons.count(), 4); i++) {
      const b = buttons.nth(i);
      const lbl = ((await b.getAttribute('aria-label')) || (await b.getAttribute('class')) || 'button').split(/\s+/)[0].replace(/[^\w-]/g, '').slice(0, 20);
      if (/view|trial|card|clickable/i.test(lbl)) continue; // card links are not controls
      if (await b.evaluate(e => e.type === 'submit' || !!e.closest('form')).catch(() => true)) continue; // never send a form
      await b.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(700); await snap(`click-${lbl}`);
    }
  }
  // hover the first card or link
  const hover = root.locator('a:visible, [class*="card"]:visible').first();
  if (await hover.count() && await hover.hover({ timeout: 5000 }).then(() => true, () => false)) { await page.waitForTimeout(500); await snap('hover-first'); }
  // keyboard: Tab into the section 4 times
  await page.mouse.move(0, 0); await root.evaluate(e => e.scrollIntoView());
  await page.keyboard.press('Tab'); for (let k = 0; k < 4; k++) { await page.keyboard.press('Tab'); await page.waitForTimeout(150); }
  await snap('keyboard', false);
  md.push('');
  await page.close();
}

await writeFile(resolve(out, 'steps.json'), JSON.stringify(steps, null, 2));
await writeFile(resolve(out, 'summary.md'), md.join('\n'));
console.log(`summary → ${resolve(out, 'summary.md')}`);
await browser.close();
