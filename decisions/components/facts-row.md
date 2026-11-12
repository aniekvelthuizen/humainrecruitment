# Facts Row (`Facts Row`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 7. Figma export: `references/figma/rest-of-site/facts-values/` (`Content / Facts & Figures`, `2292:8714`); instances `pages/06-about/section-05`, `pages/02-hire-an-expert/section-05`. Built by Aniek Velthuizen, via Claude.
Component **`7f55f676-cef7-79b6-bb41-8d9c470e0804`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.facts-row_wrap.u-theme-light` (`data-section="light"`, `data-facts-row`, `data-space-top` = prop) › `facts-row_contain.u-container` › `facts-row_list` (`role="list"`, grid 4 × `minmax(0,1fr)`, column gap literal `4rem`) › slot **List** · HTML embed `u-embed-css`.
Plain section, not the Lumos `Section` wrapper: the API cannot reach inside Lumos Section slots (same route as Split Content, CTA Split, Spotlight Grid).
Items: Card Primary **Stat**, Role off (= `listitem`), Eyebrow, Icon, List and Badge Visibility off.

## 2026-11-05 — Space Top defaults to none
Prop **Space Top** (Layout, text) → `data-space-top`: `large` (192, ≤ 991 96), `main` (96), `none` (0). Figma's component is 552 high (192 on top), but both page instances are 360, so top 0. Default `none` because that is every real use (CTA Split did the same). Bottom `section-space/large`, ≤ 991 `section-space/main`.

## 2026-11-05 — Lines and card padding sit in the embed
Figma: 298 card, 32, line, 32, 298. So column gap 4rem and the line 2rem left of each card after the first. Colour `swatch/dark-900-o25` as Figma. A slot only takes instances, so the line cannot be an element between the cards: it is a `::before` on `.card_primary_wrap + .card_primary_wrap`, selected from Facts Row's own embed (`decisions/site.md` 2026-11-02).
The embed also sets the card's side padding to 0, only inside this row. Figma's Stat has 32 padding but its caption (261 wide) runs through it on one line; with the padding it would wrap in a 298 column. Card Primary itself is not edited.

## 2026-11-05 — Below 992 (no design)
768–991: two columns, line only between them. ≤ 767: one column, the lines turn horizontal between the items. 992–1279 keeps four columns; captions take two lines there (1100: 203 wide).

## 2026-11-05 — Placed
About Us instance `7c0004ad-564f-602e-1590-e4fee7d65445`, Hire an Expert instance `74aa8729-df69-abcf-e777-ca38659f2d73`, both at the end of `page_main` until the pages are composed. Copy as Figma, the same on both pages, «-25 / 30%» included.
Simulated locally (published CSS + these rules; nothing published yet) at 1512: cards at x 64 / 426 / 788 / 1150, 298 wide as Figma; 170 high against Figma's 168, so the section is 362 against 360 (Stat's known 2 px, `cards.md`).

## 2026-11-12 — Figures fly in on scroll (owner)
The figures reveal word by word like the quotes, 0.3 s apart left to right. Lives in the global quote-reveal embed, not in this component: `decisions/motion.md` › Facts Row figures. Done by Aniek Velthuizen with Claude.
