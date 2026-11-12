# Step List (`Step List` + `Step Item`, group Visuals)

Figma `Content / Trust statement` (`2444:33766`, left column), used on «3. For business / Hire Project Delivery Experts» (`2248:6373`). Plan: `references/plans/2026-11-02-split-visual-slot.md`. Check: `node references/visual-slot-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Components: **Step List** `f8233319-9b9f-4a6d-cba0-1aeaecc2d9fa`, **Step Item** `148e47b1-ffa4-76c1-626a-4172a66101b7`.

## 2026-11-02 — Own component, not Card Primary Step
Conflict: the site already has a numbered card (Card Primary **Step**, glass with ring, pill and text).
Choice: a separate small pair. These rows are flat grey bars with a mint number and only a title; as a Card Primary variant every other card prop would do nothing here.
Why: kit rule — a variant that would add only dead props is its own component.

## 2026-11-02 — Structure
`step-list_wrap` (`role="list"`, `data-step-list`, flex column, gap `space/3` = 10) › slot **Items** + HTML embed (`u-embed-css`).
Step Item: `step-list_item` (`role="listitem"`, `data-step-item`, flex, centred, gap `space/5`, padding `space/5`, `card/background` = light-200, `radius/small`) › `step-list_number.u-weight-semibold` (`aria-hidden`, 3.125rem round, Theme **`badge/background`** = accent-500 mint, Theme **`badge/text`** = dark-900 in every mode) + `p.step-list_title.u-text-style-h5` (prop **Title**).
Row 90 high, 100 apart — Figma 89.6 / 99.6 (its badge is 49.6).

## 2026-11-02 — Numbers count themselves
Choice: a CSS counter in the embed (`counter-reset` on the list, `counter-increment` per item, `content: counter()` on the number's `::before`). No number prop, so reordering or adding a row never leaves a wrong number. The number is `aria-hidden`; screen readers get the list position from `role="list"`.
Why: the style API mangles `content` on `::before`, so it lives in the embed.

## 2026-11-02 — Review fixes (fresh reviewer, `references/audit/2026-11-02-visual-slot.md`)
- On a Dark or Brand section the number would have turned white on mint (1.29 : 1) → new Theme `badge/text` (dark-900 in every mode). Light: unchanged (15.2 : 1).
- Badge class: no-op margins and `flex-grow: 0` removed.
- No showcase on Example Components: same reason as Score Chart (`score-chart.md`).

## 2026-11-12 — White rows on phones (owner, Aniek Velthuizen, via Claude)
Owner (Aniek), with a phone screenshot of Project Delivery Experts «Why This Matters»: below the text the grey rows (`card/background` = light-200) sit on the light mint glow and the two colours clash.
Choice: `step-list_item` gets `swatch/light-100` (white) as background on the **small** breakpoint (≤ 767, so also ≤ 478). Tablet and desktop keep `card/background`, as Figma. A swatch, not the Theme: the Theme `card/background` is shared by every card and must not change; this is one component on one breakpoint.
