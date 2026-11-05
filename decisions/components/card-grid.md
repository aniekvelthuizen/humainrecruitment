# Card Grid (`Card Grid`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 6. Figma export: `references/figma/rest-of-site/card-grid/` (`Content / Grid of cards`, set `2444:34379`). Built by Aniek Velthuizen, via Claude.
Component **`de2a2260-d801-c68d-4f5a-c6174744d52a`**.

## 2026-11-05 — One section, three variants
Choice: **Dark Small** (base), **Dark Large** `541cc7b8-8b25-8101-42ca-62b25f837f84`, **Light Small** `e8078db5-286a-666f-3e57-24a33cc79645`. Dark Small is the base because it has the fewest parts: the closing is `display: none` there and only Dark Large shows it.
Why: all three share the centred header and the card grid; only the theme, the padding and the closing differ.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.card-grid_wrap` (`data-card-grid`, `data-section` = Nav Colour, `data-space-top` = Space Top) ›
- `card-grid_contain.u-container` (flex column, centred, gap 3.1875rem = Figma 51)
  - `card-grid_header.u-text-trim-off` (max 57rem = Figma 912, gap `space/3`) › p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1` › span + span " " + br + span `_muted` · p `_text.u-text-style-large`
  - `card-grid_list` (`role="list"`) › slot **Cards** (`u-display-contents`)
  - `card-grid_closing.u-text-trim-off` › `card-grid_statement.u-text-trim-off` › p `_statement-text.u-text-style-display` + img `_visual` · p `_closing-text.u-text-style-main`
- HTML embed `u-embed-css`: Space Top rules and hiding empty parts (`decisions/site.md` 2026-11-02).
Plain section, not the Lumos `Section` wrapper: same route and reason as Page Header, Split Content and CTA Split. H2 at the H1 size, as Spotlight Grid. The title always breaks before the muted part, so there is no Title Break prop. The statement is a `p`, not a heading: it is a closing line, not the start of a new part.

## 2026-11-05 — Theme per variant
Theme mode on `card-grid_wrap`: Brand in the base, Base in Light Small (`set_style_variable_mode` + `variant_id`). `background-color` and `color` read Theme `background` and `text`. Light Small sets `swatch/light-200` directly, as Spotlight Reviews (plan, conflict 1). **Nav Colour** is a prop because a variant cannot change an attribute: `light` on every Light Small.

## 2026-11-05 — Spacing
Dark Small top and bottom `section-space/large` (Figma 192). Dark Large and Light Small 7.6875rem (Figma 123, no variable). All `section-space/main` below 992. **Space Top** empty keeps the variant's value; `large`, `main`, `none` overrule it. Cards gap `space/7`; `space/5` between rows ≤ 767.

## 2026-11-05 — Columns
Three, two ≤ 991, one ≤ 767. Webflow breakpoints, `minmax(0, 1fr)`. Cards in a row share their height through the grid.

## 2026-11-05 — Closing: words and bars
In Figma the picture lies on top of the text, centred on it, and is not masked. So the bars cover «proven» and the middle of «performers», and only part of the letters show through the glass.
Built that way: `_visual` is absolute inside `_statement` and comes after the text. Everything in the statement is sized in `em` from Figma's numbers at 128 px, so words and bars keep the same overlap at every width: width 3.4375em (440), top −1.2547em (160.6 above the text), `left: 50%` + `translateX(-50%)`, box max 8.96875em (1148).
Statement size `clamp(2.75rem, 0.849rem + 7.568vw, 8rem)` (44 at 402, 128 at 1512). Paragraph `clamp(1.5rem, 0.957rem + 2.162vw, 3rem)`, line height 1.5, max 71.5rem. No Text Style exists for these sizes (`decisions/site.md`, Display Large and Text XX Large are per section), so they sit on combos with the nearest style. The Display style computes to weight 600, so the combo sets `font/secondary-bold` (Figma Bold).
Gap statement to paragraph 23.75rem (Figma 380), `section-space/main` below 992. No scroll animation now.

## 2026-11-05 — Bar visual
Asset `6aec8809a21c0ac23d61166d` (`card-grid-bars.png`): the tree's `7b6008ae…png` resized to 880 wide (2 × 440), PNG for the transparency, 435 KB. Default of prop **Visual**, alt in **Visual Alt**.

## 2026-11-05 — Props
Content: Eyebrow, Title, Title Muted, Text · Closing: Statement, Statement Muted, Closing Text, Closing Text Muted · Image: Visual, Visual Alt · Layout: Space Top, Nav Colour · slot **Cards**. The four Closing texts have no default, so pages with the closing hidden carry no stale copy in their HTML; a new Dark Large must be filled.

## 2026-11-05 — Cards in the slot
Card Primary **Stage**, stage 9 of Dark Large **Stage Certified**. Role off (= `listitem`), List Visibility off. Dark Large keeps Eyebrow and Badge; Dark Small and Light Small turn both off. Icons per `icon-set.md`. The titles are `<p>` until the heading level is set: 27 titles (9 on each page).

## 2026-11-05 — Checked before publish
Local simulation with the published CSS and these rules, Dark Large at 1512: header 300, 123, 912 × 284; list 64, 458, 1384 wide; cards 440; closing 1292 high; statement 182, 1148 × 384; visual 536, 440 × 440; paragraph 184, 1144 × 432; «reach clients» 757 wide (Figma about 755). All as Figma. No sideways scroll at 1512, 1100, 800, 402, 320. To measure on staging after publish.
