# Fee List (`Fee List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 12. Figma export: `references/figma/rest-of-site/rates/` (`Dynamic / Rates`, `Content / Fee row compact`), instance `pages/09-rates/section-03`. Built by Aniek Velthuizen, via Claude.
Component **`50049e22-3b9e-36cf-7d0b-10eabb4e9df5`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.fee-list_wrap` (`data-fee-list`, `data-space-top` = Space Top) › `fee-list_contain.u-container` ›
- `fee-list_header.u-text-trim-off` › p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1` · p `_text.u-text-style-large`
- `fee-list_list` › the list component (below)
- HTML embed `u-embed-css`: Space Top rules only.
Plain section, not the Lumos `Section` wrapper: same route and reason as Card Grid and Pricing Row. No Nav Colour prop: the section is white, and the nav script reads that by itself.

## 2026-11-05 — Rows come from the CMS, in the definition, no slot
Collection List on Rates (`6aec7e0776c2f357ba063c82`), sort `order` ascending. List `fee-list_items`, item `fee-list_row.u-text-trim-off` › h3 `_name.u-text-style-h5` (`name`) · p `_description.u-text-style-main` (`description`) · p `_price.u-text-style-h5` (`price`). Empty state `fee-list_empty` (`display: none`), so Webflow's grey «No items found» can never show.
Why no slot: a slot starts empty on every new instance and an editor could leave it so. The rows are CMS content, so the list instance belongs in `fee-list_list` of the definition. Built on the page first: a Collection List cannot be set up inside a definition (`hero-experts.md`). Create component is done in the Designer (queue): **Fee List Items**.

## 2026-11-05 — Spacing
Figma 192 top and bottom on the component, 96 top on Rates. Wrap `section-space/large`, ≤ 991 `section-space/main`. **Space Top** prop as Card Grid: empty keeps the section's value, `large`, `main`, `none` overrule it. Rates: `main`. Header gap `space/3`, header to rows 48 (from `u-container`), rows gap `space/1`, row padding `space/7` / `space/6`, name column 25rem (Figma 400), gap `space/4`. Line height of name and price 1.1 (`line-height/medium`) as Figma, on the combos.

## 2026-11-05 — Colours
Row `swatch/light-200` directly (plan, conflict 1). Description `swatch/dark-900-o50`. Name and price Theme `text`: Figma has a loose `#1a1c1e` without a variable here, and the site uses no hex.

## 2026-11-05 — Below 992 (no design)
≤ 991: name and price on one row, description full width under them. ≤ 767: one column, name, description, price. Row gap `space/3`.

## 2026-11-05 — Measured (staging, audit `references/audit/2026-11-05-phase-4.md`; the first row of the table only in the local simulation)
| Where | Figma | Built |
|---|---|---|
| Eyebrow / title / text at 1512 | 96 h24 / 130 h75 / 215 h30 | same |
| First row | 64, 293, 1384 × 90 | 1384 × 90.4 (Figma rounds 26.4 to 26) |
| Name / description | x 88 / 504, y 32 in the row | same |
| Section | 951 | 953 (the same 0.4 × 5) |
5 rows in CMS Order 1–5; the layout reflows at 768 and 402. No sideways scroll or clipping at 1512, 1280, 992, 768, 402, 320.

## 2026-11-05 — Price is one style (on the owner's list)
Figma sets «€XX» bold 24 and «/ day» regular and smaller. The plan has one plain-text field `price`, and a field cannot carry two styles, so «€XX / day» is bold 24 as a whole. «from €XX» is as Figma. Styling is never code on this site, so no script splits the text. A fix would be an optional field Unit on Rates.
