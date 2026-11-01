# Home "The risk" — Figma spec (read 2026-11-01 with the Plugin API in Claude in Chrome)

Read by Aniek Velthuizen (with Claude); the Figma MCP was at its tool-call limit after one call.

Component set `Content / 4 UBRS` (`2365:38273`): `device=desktop` (`2233:4245`, 1512 × 919) and `device=mobile` (`2365:38274`, 402 × 1502). Instances:
- **1. Home B** (`2710:48615`): `2710:48617` "Frame 592", desktop, y 1019 (directly under the header). **Built.**
- `[figma-only] 1. Home A` (`2041:10595`): `2233:4247`, desktop.
- Mobile `1. Home` (`2365:38349`): `2365:38370`, mobile, y 1195 — Home A content (4 cards, «What sets us apart»).

Pictures: `desktop-1512.png` (Home B instance, 1:1), `mobile-402-home-a.png` (mobile instance, Home A copy).

## Desktop 1512 × 810 (Home B instance)
- Root: white (`background-2`). Inner wrap `content-4-ubrs_group_wrap`: auto layout vertical, gap 48 (`space/8`), padding 128 / 64 / 128 / 64 (128 not bound to a variable), centred.
- Background: radial gradient `#00e5e5` alpha 0.40 at 49.5 % → alpha 0 at 100 %. Ellipse centre (50 %, 105.9 %) of the section, radii 58.28 % (881 px) × 52.94 % (429 px) — a mint glow rising from the bottom edge. Not bound to a variable; no site swatch has `#00e5e5` (`brand-accent-500` is `#00ffd5`).
- Header `content-4-ubrs_content` 1144 wide (x 184), gap 10 (`space/3`), left-aligned frame, texts centred:
  - Eyebrow «The risk» — text style **Label Large** (Onest 16 / 150 %, 10 % letter-spacing, uppercase), `text` colour.
  - Title «One wrong hire costs **more than a year of fees.**» — text style **H1** (Vend Sans Bold 60 / 125 %); first part `dark-900`, second part `dark-900-o50`. Wraps after «costs» at 1144.
  - Subtitle (Text Main 16, centred) — **hidden** on Home B (shown on the mobile frame: «Four things that set us apart from day one.»).
- Cards row `content-4-ubrs_group_wrap` 1384 wide (x 64), horizontal, gap 32 (`space/7`), three equal columns 440:
  1. top 0: `Card / Service` type=default (glass), icon `schedule…` (outline clock), «A wrong hire surfaces late.» / «By the time the schedule slips, you have lost months you cannot recover.» — 440 × 226.
  2. top 48 (`space/8`): icon `project-controls-strategy`, «The process runs through HR.» / «Your project needs someone now, and the intake takes weeks.» — 440 × **263 fixed** (others hug at 226).
  3. top 96 (`section-space/main`): icon `person-search…`, «A CV says little about behaviour.» / «Real capability shows under pressure, and paper never shows that.» — 440 × 226.
  - A fourth group (322 × 391) is hidden.
- Card (`Card / Service` default): fill `light-100-o25`, radius `radius/small` (8), padding 32 / 24 (`space/7` / `space/6`), gap 16 (`space/4`), background blur 40, 5 drop shadows (y 3/13/29/51/79, blur 7/13/17/20/22, black 2 % / 2 % / 1 % / 0 / 0), **no stroke**. Icon 48 × 48 dark-900; title Vend Sans Bold 24 / 110 % (padding-top 8); text Text Main.

## Mobile 402 × 1502 (Home A copy)
- Padding 96 / 20 (`section-space/main` / `space/5`), gap 48.
- Header centred, gap 10: eyebrow text style **Label** (12), title **H4** (30) on three lines, subtitle shown.
- Cards stacked full width (362), gap 20 (`space/5`), no stagger; heights 250 / 263 fixed / 250 / 263 fixed.
- Glow: same colour, alpha 0.40 at **10 %** → 0 at 100 %; ellipse centre (50 %, 87.3 %), radii 162.5 % × 44.8 % (653 × 673 px).
