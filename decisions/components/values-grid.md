# Values Grid (`Values Grid`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 7. Figma export: `references/figma/rest-of-site/facts-values/` (`Content / Values`, `2444:35583`). No page frame uses it; it waits on Example Components (owner, 2026-11-05). Built by Aniek Velthuizen, via Claude.
Component **`cd9a429d-a142-7b0d-220c-8408382faee3`**.

## 2026-11-05 — Structure: plain section, like Spotlight Grid
`section.values-grid_wrap.u-theme-brand` (`data-section="dark"`, `data-values-grid`) › `values-grid_contain.u-container` (gap 48 from `u-container`) ›
- `values-grid_header.u-text-trim-off` (flex column, gap `space/3`, max 71.5rem, centred) › p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1`
- `values-grid_layout` (grid 3 × `minmax(0,1fr)`, gap `space/7`, `align-items: center`) › `values-grid_list` slot **List Start** · `values-grid_center` (flex column, gap `space/7`) › `values-grid_list` slot **List Center** + `values-grid_visual` (3 / 2, `radius/small`) › img `_image` · `values-grid_list` slot **List End**
Plain section, not the Lumos `Section` wrapper (the API cannot reach inside its slots). No embed: everything fits in classes. Title is H2 at the H1 size, as Spotlight Grid.

## 2026-11-05 — Background
The brand gradient as on footer, Hero Experts and the Spotlight panel: `gradient/brand-start | brand-middle 70.19 % | brand-end`, top to bottom. Figma's end stop here reads 229,184,180, the site's `swatch/brand-pink-500` is 229,187,183; one gradient on the site wins. Section spacing `section-space/large`, ≤ 991 `section-space/main`.

## 2026-11-05 — Cards and icons
Card Primary **Glass**, Role off (= `listitem`), Eyebrow, List and Badge Visibility off. Icons from Icon Set: Outbound, Check Circle, and Shield Alert for Figma's `shield` (`icon-set.md`: same glyph as `gpp-maybe`). Copy as Figma.

## 2026-11-05 — Below 992 (no design)
One column, in reading order: card, card, photo, card; max 40rem and centred, because full-width cards ran too wide on Spotlight Reviews (`spotlight-grid.md`).

## 2026-11-05 — Photo
Props **Image** and **Image Alt** (default set). Asset `6aec7e572ac2feb0e03dddd6` already held these exact bytes, under the name `discipline-risk-performance`, so nothing was uploaded. It has the Getty watermark and is only 509 × 339: replace it before go-live, together with the list in `decisions/cms.md`.

## 2026-11-05 — Placed
Example Components, instance `e56ca9cf-221f-d110-b971-35084b7e7c17`, end of `page_main`. Simulated locally (published CSS + these rules; nothing published yet) at 1512: header, columns and photo at Figma's x and widths; cards 230 high against Figma's 212, so the section is 1096 against 1078 (existing Glass height, `cards.md`).
