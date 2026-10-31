# Footer — Figma spec (read 2026-10-31 with the Plugin API in Claude in Chrome)

Component set `Footer` `2382:37420`. Used: `device=desktop-compact` `2737:48338` on all 16 desktop page frames, `device=mobile` `2382:37421` on the 3 mobile frames. `device=desktop` (852 high) is unused. Pictures: `desktop-1512.png`, `mobile-402.png` (canvas screenshots, not 1:1).

## Desktop 1512 × 550
- Background: linear gradient top → bottom: `swatch/brand-500` 0 %, `swatch/brand-secondary-500` 70.19 %, `#e5b8b4` 100 % (no variable).
- Padding 80 / 64 / 80 / 64; content row, then credits, 80 apart.
- Row (1384, gap 32): column 1 440 wide (padding-right 96): "HumAIn Recruitment" (H6, Vend Sans Bold 20/150; "HumAIn " `light-100`, "Recruitment" `light-100-o50`) + 16 + text "Your extended network in international project recruitment. Human core, AI engine." (Text Large, Onest 20/150). Then 3 columns of 283 (a 4th, "Platform", is hidden):
  - For business: Hire an Expert · Project Delivery Experts · Consulting & Services · Project Controls
  - Company: About · Clients · How it works · Pricing · Contact
  - For Talent: Oppertunities (sic) · Analyse my Resume · Careers
  - Title H6, 16 to the list; links Text Main (Onest 16/150) white, item 28 high (24 text + 4), 16 apart.
- Link hover (`Footer / Assets / Item` rest → hover, smart animate 300 ms): a 1 px line under the text grows from 0 to full width.
- Credits: border-top 1 px `light-100-o20`, padding-top 32; row space-between: left "© 2026 HumAIn Recruitment", "Privacy & Cookies", "Privacy settings", "Disclaimer" (gap 24, Text Main); right LinkedIn icon 24 (`Icon / LinkedIn` `2081:4514`).

## Mobile 402 × 766
- Padding 20 all round; blocks 80 apart: content, logo, credits.
- Content: column 1 as desktop, then 32, then 3 rows "For business", "Company", "For Talent": 64 high (16 + 32 + 16), H6 title + chevron down 24, bottom line 1 px `light-100-o25`. Rows open on click (`type=closed → open`, 300 ms); the drawn open content is a copy of the nav dropdown (labels HIRING / SERVICES, 18 px links), padding 20 / 0 / 20 / 20.
- Logo `logo` `2156:4556` full width (362 × 58): outline, no fill, 1 px white stroke. **Design error per the owner (2026-10-31): not built.**
- Credits: border-top as desktop, padding-top 32, column: © line, 16, the 3 legal links in a row (gap 16), 20, LinkedIn icon.

## Text box → trimmed distances (site trims to cap height / baseline)
Onest 16/24: baseline 17, cap 11.31 · Onest 20/30: baseline 21.5, cap 14.14 · Vend Sans 20/30: baseline 22, cap 14 (measured in the browser).
