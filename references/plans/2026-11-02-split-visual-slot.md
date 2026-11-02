# Plan — Split Content Visual slot, Score Chart, Step List — 2026-11-02

## In short

Split Content gets a **Visual** slot next to the photo: put a component in it and the photo makes way for it (no extra toggle). Plus a **Glow** toggle (the mint glow from Stagger Cards). Two new small components to put in that slot: **Score Chart** (bar + legend, items in a slot) and **Step List** (numbered rows, items in a slot). Both Figma blocks go on Project Delivery Experts as two Split Content instances. Accepted deviations (owner, 2026-11-02): Image Left keeps Split Content's widths (steps 676 / text 558, Figma 558 / 676), titles stay H2 48 (Figma 60 on Final score). Built by Aniek Velthuizen with Claude.

Source: Figma `Content / Final score` (`2444:33765`), `Content / Trust statement` (`2444:33766`), section `Content / Specific` (`2444:33916`)
Page(s): Project Delivery Experts (`6ae37d5d3396bdf506e3fbf3`) — Figma frame «3. For business / Hire Project Delivery Experts from the Top 5%» (`2248:6373`)
Insertion: end of `page_main` (the page has only the template placeholder Section; the sections above it in Figma are not built yet)
Neighbours' system: Split Content (flat section component, Lumos utilities, embed for attribute rules)
Responsive: as Split Content — one column below 992, text first; legend 2 columns → 1 column ≤ 478; chart top padding 48 only ≥ 992

## Reuse

| Design section / element | Existing component | Decision | Reason |
|---|---|---|---|
| Final score (text + chart) | Split Content | extend: slot Visual | same grid (558 / 676 at x 64 / 772, 192 / 192) |
| Trust statement (steps + text) | Split Content, variant Image Left | extend: slot Visual + Glow | same grid mirrored; right column is the same `Assets / Content` block |
| Bar + legend | — | new **Score Chart** + **Score Item** | nothing on the site draws a chart |
| Numbered rows | Card Primary Step (glass ring) | new **Step List** + **Step Item** | Step is a glass card with ring, pill and text; these are flat grey rows with a mint number |

## Units

| # | Unit | Creates | Touches |
|---|---|---|---|
| 1 | Split Content | `split-content_slot`; slot Visual; prop Glow → `data-glow`; embed rules | Split Content embed (append) |
| 2 | Score Chart / Score Item | `score-chart_wrap`, `_bar`, `_segment`, `_legend`, `_item`, `_label-wrap`, `_dot`, `_label`, `_value`; Theme `chart/color-1…7`; swatches `swatch/chart-purple`, `swatch/chart-blue` | — |
| 3 | Step List / Step Item | `step-list_wrap`, `step-list_item`, `step-list_number`, `step-list_title`; Theme `badge/background` | — |
| 4 | Page | two Split Content instances on Project Delivery Experts, slots filled | — |

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Chart colours | `#8c72a9` and `#90c9d9` have no variable in Figma | two new swatches, used through Theme `chart/color-3` / `-6` |
| 2 | Final score text column | gaps 10 / 10 and H1 60 (ad-hoc frame) | Split Content's gaps (16 / 24) and H2 48, as Trust statement already uses |
| 3 | Bar widths | Webflow cannot turn a text value into a width | small script in the Score Chart embed reads each item's value and draws the segments (bar is `aria-hidden`; the legend carries the data) |
| 4 | Trust text | three paragraphs in one text | multiline Text with blank lines (as Figma's own text) |

## Questions

none (deviations agreed by the owner; the rest follows the recommendations above)
