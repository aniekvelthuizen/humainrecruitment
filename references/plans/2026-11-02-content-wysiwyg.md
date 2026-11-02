# Plan — Content / WYSIWYG (Rich Content) — 2026-11-02

Aniek Velthuizen with Claude.

## In short

A plain long-text section: one centred text column of 912 px with headings and paragraphs, for legal pages. It becomes a new section component **Rich Content** with one rich-text prop, so editors paste the whole text in one field. Nothing on the site is changed; it reuses Lumos' `u-rich-text` and the site's text styles. Figma only uses it on the Privacy & Cookies page, which does not exist yet: the plan creates that page (nav, this block, footer). **Blocked:** none of the three Webflow connectors reaches the Humain site today (404), so nothing can be built until the connector is re-pointed to the Humain workspace.

**As built (2026-11-02):** Webflow access came back the same day. The page already existed (`6ae37d71382b5fd60a01d143`, with a Lumos placeholder hero and the footer link), so no page was created. The H2 and link rules went into a `u-embed-css` embed instead of Designer nested selectors, and `u-text-trim-off` makes the gaps literal. Details and measurements: `decisions/components/rich-content.md`.

Source: https://www.figma.com/design/18m34a7vzkzopkwGoojmUx/Humain--Lumos-?node-id=2444-35732 — section `Content / WYSIWYG` (`2444:35732`) holding component `Content / WYSIWYG` (`2444:35717`, 1512 × 1204, no component properties, no variants). Read in Claude in Chrome with the Plugin API (Figma MCP at its View-seat limit); tree and pictures in `references/figma/content-wysiwyg/`.
Page(s): **Privacy & Cookies** (new) — Figma page frame `15. Privacy & Cookies` (`2323:22238`), the only instance (`2444:35718`). No mobile frame exists for this page.
Insertion: new page: `page_wrap` › Global Styles · Global Guides · Nav · `page_main` › **Rich Content** · Footer (same order as Home, `decisions/pages/home.md`).
Neighbours' system: above it a legal page header (`Frame 676`, 1512 × 520, brand gradient, eyebrow "LEGAL", H1 "Privacy & Cookies", intro + "Last updated") — not on the site and not part of this request; below it the global Footer. Section spacing from the `section-space/*` variables on the wrap, as on Home.
Responsive: one column at every width. From about 1010 px (57rem + two `site/margin`) the column is 57rem wide and centred; below that it fills the container (`site/margin` sides). H3 shrinks fluidly 36 → 30 (site rule); paragraphs stay Text Large 20. Nothing else reflows.

## Design spec (1512)

| Part | Figma | Site |
|---|---|---|
| Section | fill `background-2` (white), padding 96 / `site/margin` / 192 | Theme Light (Base `background` = white), `section-space/main` top, `section-space/large` bottom |
| Column | 912 × hug, x = 300 (centred) | `rich-content_text` max-width 57rem (literal: between `max-width/small` 50rem and `main`), margin-inline auto |
| Block gap | 32 (`space/7`) between title+text pairs | Lumos h3 margin-top `space/7` (matches) |
| Title | H3, Vend Sans Bold 36 / 125 %, `text` | rich-text `h3` tag style (H3 mode) |
| Title → text | 10 (`space/3`) | Lumos gives 20 (`space/5`, h3 margin-bottom) → nested **All H3** inside `rich-content_text`: margin-bottom `space/3` |
| Text | Text Large, Onest Regular 20 / 150 %, `text` (100 %) | `u-text-style-large` on the rich text (p inherits), colour `text` |

## Reuse

| Design section / element | Existing component | Decision | Reason |
|---|---|---|---|
| Content / WYSIWYG | — (no long-text section; `Split Content` has a text column but with a photo and a fixed title/text/checklist structure) | **new**: Rich Content | content is free-form legal text; only a rich-text field fits |
| Rich text styling | Lumos `u-rich-text` (h1–h6, p, ul/ol, blockquote, figure margins) | reuse | Lumos already spaces rich text by text style |
| Legal page header (`Frame 676`) | — | not in this request | separate block; question 2 |
| Nav, Footer | `Nav`, `Footer` | place | global |

## Units

| # | Unit | Type | Reuses | Creates (classes) | Touches (existing classes) | Parallel with |
|---|---|---|---|---|---|---|
| 1 | Page Privacy & Cookies | page | Nav, Footer, Global Styles, Global Guides | — | — | — |
| 2 | Rich Content | section → component (group Sections) | `u-container`, `u-rich-text`, `u-text-style-large` | `rich-content_wrap`, `rich-content_contain` (+ `u-container`), `rich-content_text` (+ `u-rich-text`, `u-text-style-large` combos) | — | — |

Structure (flat build, lumos-rules §5):
`section.rich-content_wrap` › `div.rich-content_contain.u-container` › `RichText.rich-content_text.u-rich-text.u-text-style-large` (bound to prop **Content**).

Props: **Content** (Rich Text). Default = the Figma text (4 × heading + paragraph). Heading level: question 1.
Hover/focus: links inside the text use Lumos' rich-text link rule; add an underline + `text` colour and a visible focus ring on `rich-content_text a` (nested selector, Designer) — the design draws no links.
Interactive parts: none. Motion: none (page-level pass later, if any).
SEO for the new page (build §6): title "Privacy & Cookies — HumAIn Recruitment", description from the Figma header intro: "How HumAIn Recruitment handles your personal data and uses cookies. We keep it plain English — no legal maze." Share image: site default.
Footer link "Privacy & Cookies" → the new page (Designer, page link).

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Title → text | Figma 10, Lumos rich text 20 | design value: nested All H3 margin-bottom `space/3` (Designer) |
| 2 | Heading level | Figma style H3 straight under the page H1 (skips H2) | owner: H2 in the text, H3 look (nested rule, Designer) |
| 3 | Column width | 912 = 57rem, no variable | literal `57rem`, noted in `decisions/components/rich-content.md` |
| 4 | Site | `.u-rich-text li` and every text style still reference **deleted** trim variables (`trim-top<deleted|…>`) next to the live ones | not this block's to fix; noted as debt (lists in rich text get no trim correction) |
| 5 | Copy | lorem ipsum | Figma lorem as default until the real privacy text arrives (question 3) |

## Missing

- The real Privacy & Cookies copy.
- **Webflow API access** to site `6ae35364a38b2d71cab8c607`: the local `webflow` connector lists only Core / THDV / Wayfinder; the claude.ai connector and the studijob connector answer 404. Same for the two other sessions building today.

## Questions

Answered by the owner (Aniek, 2026-11-02): all three as recommended. Recorded in `decisions/components/rich-content.md`.

1. **Heading level in the text.** Figma uses the H3 style right under the page's H1. ➡️ Editors use **H2** for section titles; the component styles H2 inside it at the H3 size (one nested rule), so the outline is H1 › H2 and the look matches Figma.
2. **The legal page header** (`Frame 676`: "LEGAL", "Privacy & Cookies", intro, last updated) is not on the site. ➡️ Build it next as its own block (it is the obvious companion); this plan only places Rich Content.
3. **Copy.** ➡️ Figma's lorem as the default until you send the privacy text.

## Order

1. Webflow access restored (owner).
2. Unit 1, then unit 2 (one style call, one builder call, transform to component, prop).
3. Designer pass: nested All H3/H2 rule, link hover/focus, footer page link.
4. Publish staging, measure at 1512 / 1280 / 991 / 767 / 402 against `component-1512.png`, review, componentize check, decisions + log.
