# Home hero — Figma spec (read 2026-10-31 with the Plugin API in Claude in Chrome)

Read by Aniek Velthuizen (with Claude); the Figma MCP was at its tool-call limit.

Component set `Header / Home v01` `2346:26218` (section `Headers` › `Components`, page Visual design). Three variants:
- `type=home` `2323:23444` — used on `[figma-only] 1. Home A` (`2041:10595`): "I'm looking for [Hire an Expert | Consulting & Services]" tab switch, title «…Ready for Impact.».
- `type=variant-2` `2346:29217` — the Consulting & Services tab state of the same design (not used on a page).
- `type=variant3` `2710:45629` — used on **1. Home B** (`2710:48615`, instance `2710:48616`). **Built.**
Mobile: frame `1. Home` (`2365:38349`, page Mobile) starts with `[figma-only] Frame 750` (`2382:40984`), the Home A design (tabs, white `Card / Expert match` type=mobile cards as a swipe row, logo marquee). Owner (2026-10-31): build Home B at every width, mobile reflow as the mobile frame orders it (no photo / Expert card / quote below 768).

Pictures (canvas screenshots, not 1:1): `desktop-variant3-home-b.jpg` (built), `desktop-type-home-a.jpg`, `mobile-402.jpg`.

## variant3 at 1512 × 1019 (auto layout vertical, space-between, padding-top 196)
- Background: linear gradient top → bottom `#250059` 0 % · `#0082a6` 70 % · `#e5b8b4` 100 % (= footer gradient).
- Row 1 (y 196, 1512 × 457, padding 0 / 64 / 48 / 64, space-between, centred vertically):
  - Content 558 wide: title (Vend Sans SemiBold 56 / 110 %, no text style; «Pre‑Qualified Project Professionals. » white, «The top 5% of the field.» white 50 %) · 32 · text «Validated against the criteria that decide success on a capital project, by people who have run these teams themselves.» (Onest 16 / 130 %, `swatch/light-100`, padding-right 96) · 32 · buttons (gap 16): Primary «Request a shortlist» + chevron, Secondary-white «See how we select» + chevron (48 high) · 48 · «250+ » white + «pre-qualified specialists across 6 disciplines.» `swatch/light-100-o50` (Onest 16 / 130 %).
  - Photo group 322.5 × 403.1 at x 653.75 (y +2.9): image `Majoor_Image_Wonen` (cut-out, transparent background), masked by a black→transparent gradient top → bottom (opaque to 50 %, gone at 95 %).
  - Column 440 at x 1008 (y +26), gap 32, right-aligned: `Card / Expert` default (440 × 250: Willem Jan Velthuizen, «Previously worked at», Google, 3 bullets Commercial ownership · Executive stakeholder exposure · Programme delivery, Match score 85 %, arrow corner) · quote: «“» vector 15.24 × 11.24 at (0, 3.5) + text «Neque bibendum nibh duis sit non rhoncus volutpat vel. Tempor ipsum odio turpis suspendisse diam.» (Onest SemiBold 20 / 125 %, white, first line indented) — **lorem**.
- Row 2 (y 687.5, 1512 × 128): 5 × `Card / Expert match` variant5 (glass, 322 × 128, gap 16) at x −22, 316, 654, 992, 1330: Willem Jan Velthuizen, Emery Dokidis, Willem Jan Velthuizen, Chance Dorwart, Willem Jan Velthuizen; all Google. Mask rectangle x 87 → 1425: opaque from 25 % to 75 %, transparent at both ends. Chevron left (rotated) at x 64–88 and right at 1424–1448, 24 × 24, white, centred on the row.
- Row 3 (y 850): `Content / Logo marquee` desktop: padding-top 48; «TRUSTED BY GLOBAL LEADERS IN ENERGY, INDUSTRY & TECHNOLOGY» (Onest 16 / 130 %, centred, white); logos 8 × 177.86 × 100 (logo 175 × 100) in a doubled row: agristo, amsterdamumc, basf, dr_oetker, ect_rotterdam, gkn, rijkswaterstaat, total.
- Section end at 1019 = bottom of the logos.

## Trimmed distances (site trims text to cap height / baseline) — built and measured at 1512
| Where | Figma | Built |
|---|---|---|
| Section top → title cap | 207 | 207 (`12.9375rem`) |
| Title baseline → text cap | 48 | 48 (`3rem`) |
| Text baseline → buttons | 37 | 37 (`2.3125rem`) |
| Buttons → stat cap | 53 | 53 (`3.3125rem`) |
| Stat baseline → cards | 87 | 88 (`5.4375rem`) |
| Cards → marquee title cap | 87 | 87 (`2.4375rem` + 3rem) |
| Marquee title baseline → logos | 5 | 5 (`0.3125rem`) |
| First card x / card width / gap | −22 / 322 / 16 | −22 / 322 / 16 |
