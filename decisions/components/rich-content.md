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
The h2's bottom margin collapses with the next block's top margin (`space/4`, 16), so the embed sets the margin-top of the block right after an h2 to 0.

## 2026-11-02 — Measured on staging (after publish)
`references/rich-content-check.mjs`: at 1512 section 1204 (Figma 1204), column x 300 w 912, h2 0–45, text 55–205, next h2 237 — equal to Figma. 1280 1198, 991 1190 (column fills the container below ~1010), 767 1424, 402 2404 (title 30 px, 2 lines). No sideways scroll, no console errors at any width.

## 2026-11-02 — CSS in the embed, not nested selectors
The embed holds three rules: `.rich-content_text h2` sets the Text Style variables to the H3 size, margin-top `space/7`, margin-bottom `space/3` (Figma title → text 10; Lumos would give 20); `.rich-content_text a` and `:hover` use the Theme `text-link/*` colours with an underline. Focus: Lumos' global `a:focus-visible` outline (`text` colour) applies, nothing extra.
Why the embed: tag selectors inside a class are Designer-only (nested selectors) and the site's other sections (Split Content, Sticky Steps, Stagger Cards) already keep their few extra rules in a `u-embed-css` embed. Variables, not literals, so it follows the theme.

## 2026-11-02 — Content prop and headings
- Default of **Content** (new instances): one lorem paragraph. The API writes rich-text prop defaults as plain paragraphs only; a default with headings is a Designer edit (Properties › Content › Edit Rich Text), not done.
- Privacy page instance: the text was set through the API as paragraphs, then the four title paragraphs were replaced by `Heading` H2 elements built next to them (webflow-mcp §6). Writing **Content** again through the API turns every block back into `<p>` — edit the text in the Designer instead.
