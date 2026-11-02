# Score Chart (`Score Chart` + `Score Item`, group Visuals)

Figma `Content / Final score` (`2444:33765`, right column), used on «3. For business / Hire Project Delivery Experts» (`2248:6373`). Plan: `references/plans/2026-11-02-split-visual-slot.md`. Check: `node references/visual-slot-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Components: **Score Chart** `9be009c9-e783-0d7a-e310-693e40e07686`, **Score Item** `d65316c1-37ec-3a06-8681-64025ba070cf`.

## 2026-11-02 — What it is
A weighted bar with a two-column legend, made to sit in Split Content's **Visual** slot. The legend rows are **Score Item** instances in the chart's **Items** slot (Label, Value), so rows can be added, removed and reordered by editors.

## 2026-11-02 — Structure
`score-chart_wrap` (`data-score-chart`, flex column, padding-top `space/8` = Figma's 48 above the bar; 0 below 992 where the chart sits under the text) ›
- `score-chart_bar` (`data-score-bar`, `aria-hidden`, flex, 3.25rem high, `radius/small`, clip) — empty in the definition, filled by the script
- `score-chart_legend` (`role="list"`, padding-top 1.625rem, margin-bottom −0.375rem, `column-count: 2` + `column-width: 15rem`, column gap 4rem: two columns only while each is at least 15rem, so labels never wrap) › slot **Items**
- HTML embed (`u-embed-css`): colours per position + the bar script.
Score Item: `score-chart_item` (`role="listitem"`, `data-score-item`, flex space-between, min-height 2rem with the text centred — no margins, see round 2 below — `break-inside: avoid`) › `_label-wrap` (dot 0.875rem round + `p._label.u-text-style-small`, gap `space/3`) + `p._value.u-text-style-small.u-weight-semibold` (`data-score-value`, padding-left `space/7`).

## 2026-11-02 — Colours follow the position
Conflict: Figma colours each row by hand; two of the seven (`#8c72a9`, `#90c9d9`) have no variable.
Choice: new swatches `swatch/chart-purple` and `swatch/chart-blue`; new Theme colours **`chart/color-1…7`** (secondary-500, brand-500, chart-purple, pink-500, accent-500, chart-blue, light-200 — Figma's order). Row *n* and bar segment *n* take `chart/color-n` through `:nth-child(7n+k)` in the embed (Webflow classes have no nth-child(7n) state), so an 8th row starts the palette again.
Why: editors only type a label and a weight; colour and bar stay in step.

## 2026-11-02 — Bar drawn by a script
Conflict: the segment widths come from the weights, and Webflow cannot turn a text prop into a width (no style binding, `attr()` for numbers is not cross-browser).
Choice: a small script in the Score Chart embed (runs once per page, all charts): per Score Item it reads the Value text (`25%` → 25) and adds a plain div with `flex-grow` = that number (the first number in the text, so «€20» → 20, «5,5%» → 5.5, «10-15%» → 10; 0 when there is none, so colours stay aligned). The segment sizing (`height 100%`, `flex-basis 0%`, `min-width 0`) sits in the embed as `[data-score-bar] > *`, not on a class: a class used only by a script would be removed by Webflow's Clean Up. The bar is `aria-hidden`; the legend carries the data for screen readers.
Why: Lumos and Webflow cannot do it; the alternative (a closed component with seven fixed widths) breaks as soon as a weight changes. On the Designer canvas the bar is empty (scripts do not run there).

## 2026-11-02 — Review fixes (fresh reviewer, `references/audit/2026-11-02-visual-slot.md`)
- Legend: from 992 to ~1270 and 480 to ~590 the labels wrapped and the columns no longer lined up → `column-width: 15rem` (one column when a column would be narrower); the ≤ 479 override removed.
- Space under the legend was 12 short at two-column widths (negative margin) → margin on every row except the last.
- Segment class only in the script → rules moved to the embed, class removed.
- Value «€20» drew no segment → non-digits stripped before reading the number.

## 2026-11-02 — Light sections only (for now)
`chart/color-1…7` are the same in every Theme mode, and `chart/color-2` (brand-500) equals the Brand section background. Score Chart is meant for light sections (Split Content is always light). A chart on a Dark or Brand section needs its own colours in those modes first.

## 2026-11-02 — No showcase on Example Components
Score Chart and Score Item only work inside Split Content's Visual slot, and section components have no showcase on this site (`decisions/site.md`, 2026-11-02). They are shown where they are used: Project Delivery Experts.

## 2026-11-02 — Review round 2 (fresh re-check)
- In Safari the right legend column started 12 px lower (WebKit keeps a row's bottom margin at the column break). Rows now have no margins at all: each row is 2rem (32) high with the 20 px text centred, so the pitch stays Figma's 32; the legend's padding-top 1.625rem (32 − 6) and margin-bottom −0.375rem take out the 6 above the first and below the last row. Same in every engine.
- «10-15%» read as 1015 → the script takes the first number only.
- Known side effect of round 1: from 992 to ~1225 px the legend is one column (each column would be < 15rem), so the chart ends lower than the text there.
