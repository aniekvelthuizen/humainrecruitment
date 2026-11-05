# Team Grid (`Team Grid`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 11. Figma export: `references/figma/rest-of-site/team/` (`Property 1=Team`); instance `pages/06-about/section-04`. Built by Aniek Velthuizen, via Claude.
Component **`721447dd-f823-0af3-c332-90f08886d1de`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.team-grid_wrap.u-theme-light` (`data-section="light"`, `data-team-grid`, `data-space-top` = prop) › `team-grid_contain.u-container` › `team-grid_header.u-text-trim-off` (p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1` · p `_text.u-text-style-large`) · slot **List** · HTML embed `u-embed-css` (Space Top).
Props: Content Eyebrow, Title, Text · Layout Space Top. Plain section for the reason in `facts-row.md`.

## 2026-11-05 — The list
Team Grid List (to be made in the Designer): `team-grid_cms` › `team-grid_list` › `team-grid_item` › Card Profile **Person**. Source Team, filter `group` equals Team (`1cc6216c…`), sort Order ascending. An option filter with `equals` is accepted by the API and reads back; the filter, source and sort went in one write.
Bound: Subtitle = `role`, Image = `photo`, Image Alt = `photo-alt`. Title and Text are bound since 2026-11-05: Card titles are plain text, see `cards.md`. Final list component: **Team Grid Items**.
List instance before the Designer pass: `1f8d6dec-3e0d-572a-c871-04c50ee1d1fa`, on About Us in `page_wrap`, right after `page_main`.

## 2026-11-05 — Four columns from 1200, cards shrink below 1490 rather than wrap (Aniek Velthuizen, via Claude)
Figma: 315 wide, gap 32, hug, centred (x 78 in the 1512 frame). A wrapping flex row at that width broke into 3 + 1 at 1200–1480 (audit `references/audit/2026-11-05-phase-4.md`).
Choice: **cards shrink below 1490 rather than wrap.** `team-grid_list` is a grid: four `minmax(0, 1fr)` columns from 1200 (embed: no Webflow breakpoint there), two below, one ≤ 767 with row gap `space/5` (no phone design). `max-width: 84.75rem`, centred (4 × 315 + 3 × 32), so wide screens keep Figma's 315. The cards hold 315 down to about 1484, then shrink: 305 at 1440, 269 at 1280, 250 at 1200. Height stays 459; at 1280 only Floyd's subtitle gains a line. From 768 to 1199 two columns fill the row: 532 wide at 1199, 333 at 768.
Cost: a fifth person lands at the left of a new row, no longer centred.

## 2026-11-05 — Spacing
Header to cards in Figma is 51: `u-container` gap 48 + `team-grid_cms` **padding-top** 0.1875rem. Not margin: since the Designer pass the list sits in `.u-display-contents`, and Lumos' trim rule `[class*="u-container"] > .u-display-contents > …` sets its margin-top to 0. Bottom `section-space/large`, `main` ≤ 991. **Space Top** default `none`: the page instance has 0 on top (851 high against the component's 1043), the same as Facts Row. `main` and `large` are the other values.

## 2026-11-05 — Measured (local simulation: published page + the rules above; not published yet)
1512: section 851 (Figma 851), cards x 78 / 425 / 772 / 1119, y 200, 315 × 459 (staging before this fix, audit `references/audit/2026-11-05-phase-4.md`: section 848, y 197). 2560: same y and height, centred. Columns: 4 at 1512, 1440, 1280, 1200; 2 at 1199, 1100, 992, 991, 768; 1 at 767, 402, 320. No sideways scroll at any of these.
