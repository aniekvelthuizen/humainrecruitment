# Score Chart (`Score Chart` + `Score Item`, group Visuals)

Figma `Content / Final score` (`2444:33765`, right column), used on «3. For business / Hire Project Delivery Experts» (`2248:6373`). Plan: `references/plans/2026-11-02-split-visual-slot.md`. Check: `node references/visual-slot-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Components: **Score Chart** `9be009c9-e783-0d7a-e310-693e40e07686`, **Score Item** `d65316c1-37ec-3a06-8681-64025ba070cf`.

## 2026-11-02 — What it is
A weighted bar with a two-column legend, made to sit in Split Content's **Visual** slot. The legend rows are **Score Item** instances in the chart's **Items** slot (Label, Value), so rows can be added, removed and reordered by editors.

## 2026-11-02 — Structure
`score-chart_wrap` (`data-score-chart`, flex column, padding-top `space/8` = Figma's 48 above the bar; 0 below 992 where the chart sits under the text) ›
- `score-chart_bar` (`data-score-bar`, `aria-hidden`, flex, 3.25rem high, `radius/small`, clip) — empty in the definition, filled by the script
- `score-chart_legend` (`role="list"`, padding-top `space/7`, `column-count: 2`, column gap 4rem, 1 column ≤ 478) › slot **Items**
- HTML embed (`u-embed-css`): colours per position + the bar script.
Score Item: `score-chart_item` (`role="listitem"`, `data-score-item`, flex space-between, min-height 1.25rem, 0.75rem below each row, `break-inside: avoid`; the legend pulls the last 0.75rem back) › `_label-wrap` (dot 0.875rem round + `p._label.u-text-style-small`, gap `space/3`) + `p._value.u-text-style-small.u-weight-semibold` (`data-score-value`, padding-left `space/7`).

## 2026-11-02 — Colours follow the position
Conflict: Figma colours each row by hand; two of the seven (`#8c72a9`, `#90c9d9`) have no variable.
Choice: new swatches `swatch/chart-purple` and `swatch/chart-blue`; new Theme colours **`chart/color-1…7`** (secondary-500, brand-500, chart-purple, pink-500, accent-500, chart-blue, light-200 — Figma's order). Row *n* and bar segment *n* take `chart/color-n` through `:nth-child(7n+k)` in the embed (Webflow classes have no nth-child(7n) state), so an 8th row starts the palette again.
Why: editors only type a label and a weight; colour and bar stay in step.

## 2026-11-02 — Bar drawn by a script
Conflict: the segment widths come from the weights, and Webflow cannot turn a text prop into a width (no style binding, `attr()` for numbers is not cross-browser).
Choice: a small script in the Score Chart embed (runs once per page, all charts): per Score Item it reads the Value text (`25%` → 25) and adds a `score-chart_segment` with `flex-grow` = that number (0 when it is not a number, so colours stay aligned). The bar is `aria-hidden`; the legend carries the data for screen readers.
Why: Lumos and Webflow cannot do it; the alternative (a closed component with seven fixed widths) breaks as soon as a weight changes. On the Designer canvas the bar is empty (scripts do not run there).
