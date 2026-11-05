# Pricing Row (`Pricing Row`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 8. Figma export: `references/figma/rest-of-site/pricing/` (`content-pricing`, `2378:35676`); instances `pages/02-hire-an-expert/section-06`, `pages/09-rates/section-01`. Built by Aniek Velthuizen, via Claude.
Component **`2ccae8d5-d8c4-fd3f-2e45-a06227d95d13`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.pricing-row_wrap` (`data-section="dark"`, `data-pricing-row`) › `pricing-row_contain.u-container` ›
- `pricing-row_header.u-text-trim-off` › p `_eyebrow.u-text-style-label-large` · `_intro` › h2 `_title.u-text-style-h1` (span Title · span " " · br · span `_muted`) + p `_text.u-text-style-large`
- `pricing-row_list` (`role="list"`, grid 3 × `minmax(0,1fr)`, gap `space/7`) › slot **List**
- HTML embed `u-embed-css`
Plain section, not the Lumos `Section` wrapper: the API cannot reach inside Lumos Section slots (same route as Split Content, CTA Split, Spotlight Grid).
Items: Card Primary **Pricing Outline**, **Pricing**, **Pricing Outline**, Role off (= `listitem`), Eyebrow and Icon Visibility off, Badge Visibility off on the two Outline cards; Card Bullet in slot **Items**. Button Text «See details».

## 2026-11-05 — Header follows Figma, not centred
Eyebrow and title left, text right, bottoms aligned; on phones all left. That is what `device=desktop` and `device=mobile` draw on Hire an Expert. The unit brief said «centred header»; on the owner's list as a question, not changed.

## 2026-11-05 — Variant Section (base) and In Header
`In Header` `2cd3a9a4-1706-6679-fcb7-e1baf1024deb`, for the Page Header's Row slot: no vertical padding, no background, header `display: none`. A variant, not a prop, because three things change together and an editor picks one word. The header stays in the DOM with its default copy, hidden; a nested `section` without a heading is not announced as a region, so this is harmless.
Theme: Brand mode on `pricing-row_wrap` (`set_style_variable_mode`), no `u-theme-*` class, as Page Header: a `u-theme-*` class paints a background the variant could not remove. Gradient as Spotlight Grid and Page Header (`gradient/brand-*`, 70.19 %).

## 2026-11-05 — No Space Top prop
The neighbours have one because they sit on white next to other sections. This block paints its own gradient with 128 on both sides in its only section use, and In Header sets 0. A switch would change nothing a page needs.

## 2026-11-05 — Spacing
Section 8rem top and bottom (Figma 128, no variable); ≤ 991 `section-space/main`. Header to cards in Figma is 96 to the card, with the «Most chosen» label rising 30 into that gap. Card Pricing has `margin-top: 1.875rem` to make room for the label, so: `u-container` gap 48 + list `margin-top: 1.125rem` + card 30 = 96. In Header: list `margin-top: -1.875rem`, so the card starts at the top of the slot and Page Header's own 48 above the Row is Figma's gap. ≤ 767 both margins are 0 (the label moved into the card); `u-container` gives 48, as Figma.
Title and text keep their trim (no `u-text-trim-off`): Figma's boxes here are cap height to baseline (title 117, text 104), and with the trim they measure the same. Only the eyebrow is untrimmed, through the header's `u-text-trim-off`.

## 2026-11-05 — Below 992 (no tablet design)
≤ 991 the header stacks. 768–991 two columns, the third card spans both (embed, slot children). ≤ 767 one column, gap `space/5`, as Figma mobile. Title stays at the site's H1 size (36 at 402, three lines); Figma mobile draws 30 on two lines; site rule «one mobile heading system» wins.

## 2026-11-05 — Card Primary below 768 (Pricing and Pricing Outline only)
Per Figma mobile (`type=variant-2`): group margin 0, padding `space/5`, content gap `space/4`, title H5, price literal `2.25rem` (Figma 36; the fluid H3 would be 30), label padding `space/1` / `space/2`.
Pricing: content becomes a grid `minmax(0,1fr) auto`, title in column 1 and label in column 2 of row 1, so a long title wraps instead of running under the label (absolute positioning would collide at 320). Desktop unchanged. Example Components' two test cards follow.
Price and unit may wrap: `flex-wrap: wrap` on `card_primary_value` below 768 in the variants, and at all widths inside this block through the embed, because `card_primary_number` does not shrink and three columns get narrow at 992–1279.

## 2026-11-05 — Measured (local simulation at build: published CSS + these rules; staging values below)
| Where | Figma | Built |
|---|---|---|
| Eyebrow / title / text at 1512 | 128 h24 / 184 h117 / 197 h104 | same |
| Cards | x 64 / 536 / 1008, y 397, 440 wide | same |
| Card height | 369 | 389 (known: price box 48, `cards.md`) |
| Section | 894 | 914 (the same 20) |
| In Header | first card at top of the row | 0 |
| 402: title row, label | label x 229, 113 × 32 | same |
| 402: card | 362 × 248 / 250 | 362 × 265 / 267 |
No sideways scroll at 1512, 1100, 800, 402, 320. At 320 «/ hour margin» drops under «From €XX». The 17 px on phones: price box 36 against 25 (11), Card Bullet 21 against 19 per row (6).
Staging, published 2026-11-05 before the link fix (audit): phone cards 265 / 203, because the middle card had no button. With the button in a local simulation: 265 / 267 / 265. Not yet seen published.

## 2026-11-05 — Placed
Hire an Expert: instance `667ca13b-cf34-960f-be86-3d238e6c5e21`, end of `page_main`. Rates: instance `96599d9d-42d0-53ad-8e48-9c08df05304e`, variant In Header, in the Row slot of Page Header `ea8cc4bb-3014-4799-e0a2-4fb512fb757a`, Row Visibility on. Copy as Figma, «€XX» kept as placeholder. All six buttons link to `/contact` (see below); Screen Reader Text «See details: <title>» (the button only renders with both).

## 2026-11-05 — Review fixes, phase 2 audit (Aniek Velthuizen, via Claude)
- **Links:** `#` does not count as set, so the middle card rendered no button. All six cards link to `/contact` (URL prop; a link prop refuses page mode). Button text stays «See details», Figma's.
- **Price 992–1199:** unit on its own line in all three cards, so lists and buttons line up. Fit on one line was not possible: «From €XX / hour margin» wraps up to 1181 here (the audit's 1135 was an estimate); 1199 leaves room for a 15 px scrollbar.
- **Button pinned to the card bottom** from 768 up (`margin-top: auto`, embed). Longer real prices cannot push one button out of line.
- **≤ 349:** «Most chosen» on its own row under the title, one column, embed. No Webflow breakpoint at this width.
- **Muted title:** `swatch/light-100-o50`, as Stage Slider and Figma; opacity removed.
- **Hidden default text:** nothing to do on these cards. Text and List Title are already empty in Card Primary, Badge is off on the Outline cards.
Simulated locally, both pages, 320–1512, with the middle button added by hand: lists and buttons level per row, button 24 from the bottom (20 on phones), nothing out of the card, no sideways scroll, label clear of the title. 1512 unchanged (card 389). Not yet seen published; hover and focus to test on staging.
