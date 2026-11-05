# Page Header (`Page Header`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 1. Figma export: `references/figma/rest-of-site/page-header/` (`Header default`, `Header / Opportunities`, `Header / Hire an expert`). Built by Aniek Velthuizen, via Claude.
Component **`864e1322-03c7-666b-0730-884ec48ca5f8`**. Hero Experts on Home stays its own component.

## 2026-11-05 — One section, six variants
Choice: Default (base), Light `b8b2b4b4-5b82-4110-9cfb-ecc8eb7d219a`, Vertical `68e570de-f7ac-5f62-4584-3e0fd4e2208c`, Opportunity `6784a458-dc62-204a-0872-0167e7cd1094`, Search `f7e9ecff-6956-1a07-9a3d-da348da0246f`, Split `d882de9f-fac5-8823-1f14-1b87c802037e`. Vertical-pricing is Vertical with Pricing Row in the slot.
Why: all Figma types share eyebrow, H1, text and buttons; only layout and theme differ.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.page-header_wrap` (`data-page-header`, `data-section` = Nav Colour) ›
- `page-header_top` › `page-header_contain.u-container` › `page-header_back` (Button Main Tertiary, Arrow Left) · `page-header_layout` (grid) › `page-header_content` (p eyebrow · h1 title) · `page-header_aside` (`_tags` · p `_text` · `_meta` · `_actions`) · `page-header_visual` (slot **Visual**)
- `page-header_row` (slot **Row**)
- HTML embed `u-embed-css`
Plain section, not the Lumos `Section` wrapper: same route and reason as Hero Experts, Split Content, CTA Split and Spotlight Grid (the API cannot reach anything inside a Lumos Section's slots). The plan's text says "Lumos Section build-up", so this is on the report.
Row sits outside the container so Logo Marquee can run full width. **What goes in Row brings its own container and no vertical padding of its own** (Pricing Row, filter fields).

## 2026-11-05 — Theme per variant
Theme mode on `page-header_wrap`: Brand in the base, Base mode in Light and Split (`set_style_variable_mode` + `variant_id`), so text and the Secondary button follow by themselves. No `u-theme-*` class: a variant cannot swap a class.
Gradient on the wrap; Search moves it to `page-header_top`, so the filter row hangs 3.4375rem (Figma 55) over it into white. Split: Figma's radial as `radial-gradient(ellipse 58.28% 52.94% at 50% 105.94%, …)`, computed from Figma's transform.

## 2026-11-05 — Nav colour is a prop
Prop **Nav Colour** → `data-section`, default `dark`. **Set `light` on every Light and Split instance.** Split has a background image, which the nav script reads as dark; a variant cannot change an attribute. It may not be empty: the script uses `closest('[data-section]')`, and an empty value reads as light.

## 2026-11-05 — Texts and title
Texts untrimmed (`u-text-trim-off`), so Figma's gaps are literal. H1 on every variant, `u-text-style-display`, muted part opacity 0.5. Title + Title Muted with a real space and `wbr` (CTA Split), **Title Break** for a `<br>`. Site H1 wrap is balanced: «How we qualify the Top 5%» needs Title Break on to break as Figma in the two-column variants.
Text is plain text with `white-space: pre-line`, so a CMS plain-text field can bind to it (Opportunity Intro) and Privacy keeps its blank line.
Phones (≤ 767, frames m12, m13): eyebrow Label, text Text Main, title line height `line-height/heading`.

## 2026-11-05 — Tags and meta are the header's own
Not Card Opportunity Tags / Meta: those hold 2 tags and 3 rows, the header draws 3 and 4. Empty text hides a tag or row (embed). Icons: Location, School, Euro from Icon Set. Icon Set has no language icon and is not this unit's, so the fourth is `page-header_meta-globe`, a mask on asset `6aec7fb079409e9312b27e0e` that follows the text colour.

## 2026-11-05 — Split: tilted cards
The export says `rot5`, but the picture is rotated and skewed. Measured from the PNG: `matrix(0.9962, -0.0872, -0.1736, 0.9848, 0, 0)`; with it the frame's top-left lands on Figma's 947.9 / 328.7. Cards 27.5rem, middle one 1rem to the left (embed, slot children). Shadow: Figma's layers as literal `drop-shadow`s; the API flattens variables in `filter`.
Section 61.375rem high at ≥ 992 as Figma, content centred.

## 2026-11-05 — Below 992
No tablet design; phone only for Search and Opportunity. One column below 992, top padding 10rem as Hero Experts. Split on phones (no design): text, then cards, tilt kept, 1.5rem side padding so the corners stay on screen.

## 2026-11-05 — Embed
Only what the style API has no route for: hiding empty parts (`:empty`, `:has`), slot children in Visual, and Logo Marquee at 2rem top and bottom in Row (Figma 32; the marquee's own class is 48 on top and stays for Home).

## 2026-11-05 — Empty text takes no space (unit 4a-3; Aniek Velthuizen, via Claude)
`.page-header_text:empty` joins the hide rule: 9 of 12 Opportunities have no Intro, and the empty `p` left an extra 24 px gap. Matches empty text only: every other header has text, so nothing else moves (13 pages, same height with and without the rule).

## 2026-11-05 — Motion
`data-hero-reveal`: back and content `title`; tags, text, meta `text`; actions `actions`; visual `card`; row `row`. A page with a Page Header needs `Global | Custom Code` at the top of `page_wrap`.

## 2026-11-05 — Placed on every page (unit 1b; Aniek Velthuizen, via Claude)
Page Header is first in `page_main` on all 13 pages, `Global | Custom Code` on top of `page_wrap`; starter Section `d7c64e88-…` removed, also on Privacy. Title / Title Muted split where Figma's colour changes. Title Break on only for Hire, Project Delivery Experts, About and Rates: the rest wrap at the split by themselves (to check once published). Hire's split falls inside «project-controls», so the DOM text reads «project- controls».
Opportunities template was empty: built the same shell. Its `page_main` is a plain `main` block, not the page slot: a slot refuses a tag change and renders as `div`. Unit 14 can build straight into it.

## 2026-11-05 — Review fixes (Aniek Velthuizen, via Claude; not published, measured as a local simulation on the published CSS)
- **Laptop titles:** first column `minmax(min-content, 1fr)`, title `min-width: 9.25em` at ≥ 992 (longest two-column line: Consulting, 9.24 em), 0 in Split and below 992. The floor scales with the fluid H1, and 1512 stays 668 / 668. A longer title needs a new floor or Title Break.
- **Split, phones:** the middle card now shifts with `translateX(-1rem)` in the embed, at every width, so it keeps its width. This also makes the 1rem real at 1512: the old `margin-right` did nothing there, because the card wrap has `align-self: flex-start`. At ≤ 767 the visual's horizontal lean is halved (`matrix(.9962, -.0872, -.0868, .9848, 0, 0)`), which leaves 19–26 px at the edges with full-width cards. This replaces "tilt kept" under "Below 992". No phone design exists; narrower cards were the alternative, and they wrap to 163–190 px high.
- **Card Expert Match surface:** Theme `background` (Dark mode on the element = `dark-900`, Figma's fill) instead of `card/background`. Match Glass and Expert are unchanged. On a Dark section the surface equals the section (Example Components showcase).
- **Marquee in Row:** label `text-box: normal`, line height `line-height/large` (Figma 130 %), no margin under it (Figma: logos directly under the 21 px label), in the embed because it is a nested selector. Home keeps its own values.
- **Intro text:** `text-wrap: wrap` on `page-header_text`. "project-controls" can still break at its hyphen at some widths (360, 375); that needs a non-breaking hyphen in the copy.
- **Props:** Nav Colour moved from folder Section to **Settings**; the move also placed it last in the prop order, so no drag was needed.
