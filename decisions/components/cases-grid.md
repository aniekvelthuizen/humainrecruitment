# Cases Grid (`Cases Grid`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 11. Figma export: `references/figma/rest-of-site/cases/` (`Dynamic / Cases`, `2444:34826`); instance `pages/07-clients/section-03`. Built by Aniek Velthuizen, via Claude.
Component **`0ec52351-b3d1-3989-ec6d-372a2e57b642`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.cases-grid_wrap.u-theme-light` (`data-section="light"`, `data-cases-grid`, `data-space-top` = prop) › `cases-grid_contain.u-container` › `cases-grid_header.u-text-trim-off` (eyebrow · h2 · text) · slot **List** · HTML embed `u-embed-css`.
Props: Content Eyebrow, Title, Text · Layout Space Top.

## 2026-11-05 — The list
Cases Grid List (to be made in the Designer): `cases-grid_cms` › `cases-grid_list` › `cases-grid_item` › Card Profile **Case**. Source Cases, sort Order ascending, no filter.
Bound: Badge Text = `sector`, Image = `image`, Image Alt = `image-alt`. Title and Text are bound since 2026-11-05: Card titles are plain text, see `cards.md`. Final list component: **Cases Grid Items**. List instance before the Designer pass: `062cdea9-e356-d59d-5f3f-c9c50e63a208`, on Clients in `page_wrap`, right after `page_main`.

## 2026-11-05 — Card Profile, Case only
As the unit brief allows, set on variant Case: `card_profile_header` and `card_profile_text` `max-width: 15.6875rem` (Figma 251 in a 440 card), `card_profile_badge` border `swatch/light-100-o50` (Figma 50 %, was 20 %). Role and Person are unchanged. The Case card on Example Components follows.
Not changed: the pill is 36 high, Figma 34 (Figma's padding plus an inside stroke; ours has the border on top).

## 2026-11-05 — Grid and spacing
Three columns `minmax(0, 1fr)`, gap `space/7`. 768–991 two columns, and a lone last card takes the whole row (embed, the style API has no `:last-child:nth-child(odd)`; same as Pricing Row). ≤ 767 one column, gap `space/5` (no design).
Header to cards in Figma is 51: `u-container` gap 48 + `cases-grid_cms` **padding-top** 0.1875rem. Not margin: Lumos' trim rule sets it to 0 since the Designer pass, as in `team-grid.md`. Top `section-space/main`, bottom `section-space/large`, `main` ≤ 991, as Figma. **Space Top** default `main`, also `large`, `none`.

## 2026-11-05 — Measured (local simulation: published page + padding-top; not published yet)
1512: section 947 (Figma 947), first card y 296, 440 wide (staging before this fix, audit `references/audit/2026-11-05-phase-4.md`: section 944, y 293). Columns on staging: three at 992 and up, 2 + 1 at 991, one at 767; no sideways scroll at 1512, 1280, 992, 991, 768, 767, 402, 320. In a card, from the first simulation: pill y 215 (Figma 217), title y 261, text y 331, both 251 wide (= Figma).

## 2026-11-05 — Getty watermark
All three photos carry it (plan, conflict 4; `decisions/cms.md`). Replace before go-live.
