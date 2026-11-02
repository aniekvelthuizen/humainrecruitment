# Rich Content (`Rich Content`, group Sections)

Plan: `references/plans/2026-11-02-content-wysiwyg.md`. Figma: `Content / WYSIWYG` (section `2444:35732`, component `2444:35717`); only instance `2444:35718` on `15. Privacy & Cookies` (`2323:22238`). Tree and pictures in `references/figma/content-wysiwyg/`. Check: `node references/rich-content-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`6ca4bdaf-7a88-b652-31e1-a72a62721497`**, prop **Content** (Rich Text, `411b0f7d-7adf-2a36-637f-9ed1c6eb684c`).

## 2026-11-02 — Name describes the pattern
Choice: **Rich Content** (`rich-content_*`): one centred column of free-form rich text for long pages (privacy, cookies, terms). Figma calls it «WYSIWYG».

## 2026-11-02 — Owner answers (Aniek)
- **Heading level:** section titles in the text are **H2**, shown at the **H3** size of the design (36 → 30 fluid). Other levels keep the Lumos rich-text defaults. Why: the page has its own H1 in the header; H1 › H2 keeps the outline whole while the look matches Figma.
- **Legal page header** (`Frame 676`: «LEGAL», «Privacy & Cookies», intro, last updated) is built next, as its own block; this component does not include it.
- **Copy:** Figma's lorem (4 × heading + paragraph) on the Privacy page until the real privacy text arrives.

## 2026-11-02 — Structure
`section.rich-content_wrap.u-theme-light` (padding-top `section-space/main`, padding-bottom `section-space/large`, ≤ 991 `section-space/main` like every Home section — review 2026-11-02) › `rich-content_contain.u-container` › Rich Text `rich-content_text.u-rich-text.u-text-style-large` (bound to **Content**); then an HTML embed (`u-embed-css`) in the wrap.
- Column: `max-width: 57rem` (912, literal: between `max-width/small` 50rem and `main`), `margin-inline: auto`. Below ~1010 px it fills the container.
- Lumos `u-rich-text` spaces the text by text style: heading margin-top `space/7` (32, = Figma's gap between pairs), paragraphs `space/4`.

## 2026-11-02 — Texts untrimmed, so Figma's gaps are literal
`u-text-trim-off` on the Rich Text (it resets `text-box` trim on its direct children, which are the text blocks). Text boxes then equal Figma's boxes: title → text `space/3` (10), between pairs `space/7` (32), section padding `section-space/main` / `section-space/large` (96 / 192). Same route as Split Content. With Lumos' trim the section was 119 px shorter than Figma (1085 vs 1204).
The h2's bottom margin collapses with the next block's top margin (`space/4`, 16), so paragraphs and lists in this section have margin-top 0 (embed, see below).

## 2026-11-02 — Measured on staging (after publish)
`references/rich-content-check.mjs`: at 1512 section 1204 (Figma 1204), column x 300 w 912, h2 0–45, text 55–205, next h2 237 — equal to Figma. 1280 1198, 991 1190 (column fills the container below ~1010), 767 1424, 402 2404 (title 30 px, 2 lines). No sideways scroll, no console errors at any width.

## 2026-11-02 — Links in the Designer, heading/paragraph/list rules in the embed (supersedes "all in the embed")
Owner (Aniek) asked to move the embed rules into Designer styles after the review. Result:
- **Links: Designer nested style** «All Links» nested inside `rich-content_text u-rich-text u-text-style-large u-text-trim-off`: colour `text-link/text`, underline in `text-link/border`, offset 0.2em; Hover: `text-link/text-hover`, underline `text-link/border-hover`. No transition. Focus: Lumos' global `a:focus-visible` outline.
- **Headings, paragraphs, lists: stay in the `u-embed-css` embed**, because the Designer cannot make them. Lumos' `u-rich-text` already has nested h1–h6/p/ul/ol/li styles; when a tag inside an element with `u-rich-text` is selected, the Designer edits that existing **global** `.u-rich-text <tag>` rule, while the panel shows the element's whole class chain. Only for a tag Lumos does not style yet (`a`) does it create a rule on the chain. Tell-tale: the count under the chips says "… on other pages" (global) instead of "1 on this page". On 2026-11-02 this changed every rich text on staging for about 30 minutes (H2 at H3 size, H3 at H4, list and paragraph margins); restored the same evening, CSS diffed against the 19:33 snapshot.
- Embed rules: `h2` → Text Style variables at the H3 size, margin-top `space/7`, margin-bottom `space/3`; `h3` → H4 size, margin-bottom `space/3` (review Q1: a subheading one step below the section title); `p, ul, ol` → Text Style margin-top 0, so the 10 under a heading is not swallowed by margin collapse and a list right under a title sits 10 below it (was 2); `li` margins 0.
- Measured after publish (`PATCH_HTML` test: H2 + list, H3, link): 1512 Figma pairs unchanged (0/45/55/237), title → list 10, list → H3 32, H3 30 px, H3 → text 10, link underline 20 % `text-link/border`, offset 4 px.

## 2026-11-02 — Side effect kept: `.u-rich-text li` on live trim variables
While restoring, `.u-rich-text li` (Lumos, global) got `calc(var(--_text-style---trim-top) * -1)` / `trim-bottom` instead of the **deleted** trim variables it referenced (review debt). About 1 px difference per list item on other rich texts. Webflow also dropped all 460 dead deleted-variable definitions from the CSS on that save; only `li` read them.

## 2026-11-02 — The block always opens with a fixed H2 title (owner)
Owner (Aniek): "dit blok moet eigenlijk altijd beginnen met een H2" — for SEO the opening title must always be there and always be an H2, not left to the editor's rich text.
- Structure now: `rich-content_contain.u-container` › `rich-content_layout` (the 57rem column, `margin-inline: auto`; moved off `rich-content_text`) › `h2.rich-content_title.u-text-style-h3.u-text-trim-off` (margin-top 0, margin-bottom `space/3`) bound to prop **Title** (plain text, `1a05a25f-8c84-1d32-3ad6-1dff54c45383`, default = the Figma title, tooltip "always fill it in") › the rich text (**Content**).
- Level fixed in the component (lumos-rules §3). Further section titles inside **Content** stay H2 (embed rule, H3 look).
- Privacy page: Title = the first title; that H2 was removed from the Content override. Measured after publish: identical to before (1512: 1204 tall, column 300/912, 0/45/55/237), 4 × h2 in the section, no sideways scroll, no console errors.
- Prop order in the panel: Content, then Title (creation order). Title-first is a Designer drag; recreating Content through the API would wipe the page's text.

## 2026-11-02 — Content prop and headings
- Default of **Content** (new instances): one lorem paragraph. The API writes rich-text prop defaults as plain paragraphs only; a default with headings is a Designer edit (Properties › Content › Edit Rich Text), not done.
- Privacy page instance: the text was set through the API as paragraphs, then the four title paragraphs were replaced by `Heading` H2 elements built next to them (webflow-mcp §6). Writing **Content** again through the API turns every block back into `<p>` — edit the text in the Designer instead.
