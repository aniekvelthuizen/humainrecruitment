# Team Grid (`Team Grid`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 11. Figma export: `references/figma/rest-of-site/team/` (`Property 1=Team`); instance `pages/06-about/section-04`. Built by Aniek Velthuizen, via Claude.
Component **`721447dd-f823-0af3-c332-90f08886d1de`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.team-grid_wrap.u-theme-light` (`data-section="light"`, `data-team-grid`, `data-space-top` = prop) › `team-grid_contain.u-container` › `team-grid_header.u-text-trim-off` (p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1` · p `_text.u-text-style-large`) · slot **List** · HTML embed `u-embed-css` (Space Top).
Props: Content Eyebrow, Title, Text · Layout Space Top. Plain section for the reason in `facts-row.md`.

## 2026-11-05 — The list
Team Grid List (to be made in the Designer): `team-grid_cms` › `team-grid_list` › `team-grid_item` › Card Profile **Person**. Source Team, filter `group` equals Team (`1cc6216c…`), sort Order ascending. An option filter with `equals` is accepted by the API and reads back; the filter, source and sort went in one write.
Bound: Subtitle = `role`, Image = `photo`, Image Alt = `photo-alt`. **Open: Title and Text are not bound.** Card Profile's Title and Text are rich-text props and the fields are plain text; the API offers no CMS source for a rich-text prop (`get_bindable_sources`: 0 matches). Changing the card was outside this unit, so it is on the unit report as a question.
List instance before the Designer pass: `1f8d6dec-3e0d-572a-c871-04c50ee1d1fa`, on About Us in `page_wrap`, right after `page_main`.

## 2026-11-05 — Cards hold their Figma width and centre
Figma: 315 wide, gap 32, hug, centred (x 78 in the 1512 frame). So `team-grid_list` is a centred wrapping flex row with items at 19.6875rem. It wraps by itself: four cards at 1512, 2 + 2 at about 1100 and below. ≤ 767 the card takes the full width and the row gap is `space/5` (no phone design). A fifth person lands centred on a new row.

## 2026-11-05 — Spacing
Header to cards in Figma is 51: `u-container` gap 48 + `team-grid_cms` margin-top 0.1875rem. Bottom `section-space/large`, `main` ≤ 991. **Space Top** default `none`: the page instance has 0 on top (851 high against the component's 1043), the same as Facts Row. `main` and `large` are the other values.

## 2026-11-05 — Measured (local simulation: published CSS + these rules; nothing published yet)
1512: section 851 (Figma 851), cards x 78 / 425 / 772 / 1119, y 200, 315 × 459; in a card title y 305, subtitle 345, text 379 (= Figma). No sideways scroll at 2560, 1512, 1100, 992, 800, 402, 320.
The simulation filled in the card's Title and Text by hand, as they are not bound yet.
