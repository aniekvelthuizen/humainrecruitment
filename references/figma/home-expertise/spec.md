# Home «Expertise» — Figma spec (read 2026-11-02 with the Plugin API in Claude in Chrome)

Read by Aniek Velthuizen (with Claude); the Figma MCP (aniek@cutthecode.com, View seat) hit its call limit after one `get_metadata`.

Section `Content / Services` (`2323:32509`) holds the set `Content / Services desktop` (`2323:32305`) and `Content / Mobile` (`2378:35037`):

| Variant | Size | Tabs | Used on |
|---|---|---|---|
| `type=services` (`2323:32203`) | 1512 × 1529 | yes (6 tab nodes) | `[figma-only] 1. Home A` only — **old homepage, not built** (owner, 2026-11-02) |
| `type=expertise` (`2710:56984`) | 1512 × 1382 | no | **1. Home B** (`2710:48619`, y 4161) — **this build** |
| `type=variant-2` (`2323:32306`) | 1512 × 989 | yes | nowhere |
| `type=variant3` (`2323:32445`) | 1512 × 989 | yes | nowhere |
| mobile `services` (`2378:35038`) | 402 × 2222 | yes | Mobile `1. Home` (Home A content) |
| mobile `variant-2` / `variant3` | 402 × 930 | yes | nowhere |

There is **no mobile drawing of `expertise`**.

Home B order: Header (0) · 4 UBRS (1019) · Scrolly telling (1829) · Content block #1 (3223) · **Services / expertise (4161, h 1190)** · Testimonials (5351) · Recruitment process (6911) · 3 UBRS (8841) · Content block #2 (9587) · CTA (10230) · Footer (10842).

Files: `tree.txt` (full node dump of the Home B instance), `homeb-1512.png` (instance 1:1), `component-expertise.png` (main component), `services-tabs-home-a.png` (tab variant, ½ scale, for reference), `mobile-services.png`, `card-service-set.png` (Card / Service set), `expertise-photo-cutout.png` (visible photo fill, 1536 × 1024 RGBA, transparent background), `spotlight-expertise-lisette.png` (same, mirrored as in Figma, 1200 × 800).

## Desktop 1512 × 1190 (Home B instance)

- Root: white (`background-2`), auto layout vertical, gap 48 (`space/8`), padding **0** top / 64 sides / **192** bottom (`section-space/large`). Top 0 because the white Content block above already ends with 192.
- Header 1144 wide, centred, gap 10 (`space/3`):
  - Eyebrow «Expertise» — **Label Large** (Onest 16, uppercase, 10 % tracking), `text`.
  - Title «Six disciplines.» / «One standard.» — **H1** (Vend Sans Bold 60 / 125 %), line 1 `dark-900`, line 2 `dark-900-o50`, hard line break. Centred.
- Grid 1384 wide (x 64), 3 columns of 440, gap 32 (`space/7`), items centred vertically:
  - **Left list** (y 60, 440 × 646) and **right list** (y 60): 3 cards each, gap 32. Lists are centred against the 766 middle panel (60 above, 60 below).
  - **Cards** = `Card / Service` `type=discipline` (`2710:56919`): 440 × 194, fill `background` (light-200 `#edf1f7`), radius `radius/small` 8, padding 24 (`space/6`), gap 16. Title Vend Sans Bold 24 / 110 % (padding-top 8) `#1a1c1e`; text Text Main 16 `dark-900-o50`; Button Tertiary «→ View» (arrow `east` 16, gap 8, Onest Medium 16, 32 high).
    1. Project Director — Leads delivery and owns the outcome of the project.
    2. Project Controls Manager — Builds the control framework and keeps the project predictable.
    3. Cost Controller — Guards the budget through accurate forecasting and variance analysis.
    4. Planner / Scheduler — Builds and maintains the integrated schedule and its dependencies.
    5. Change Manager — Manages scope change and keeps risk visible and priced.
    6. Document Control — Keeps project information accurate, traceable and available.
  - **Middle panel** (x 472, 440 × **766 fixed**), radius 8, clips, padding 64 top / 24 sides / 0 bottom, gap 32, centred:
    - Fill: linear gradient top → bottom `#250059` 0 % → `#0082a6` 70.2 % → `#e5b8b4` 100 % = the site's `gradient/brand-start | brand-middle | brand-end` (footer, Hero Experts).
    - Quote «HumAIn is my go-to source to find high-quality talent» — **H3** (Vend Sans Bold 36 / 125 %), `light-100`, centred, 392 wide (3 lines).
    - Person (gap 8): «Lisette» Text Large 20 / 150 % `light-100` · «Chief Operations Officer» Text Small 14 `light-100-o50` · «Ingeniva» Onest 14, **uppercase**, `light-100`. All centred.
    - Photo: absolute, 598 × 398, left 11, bottom 0 (top 368), mirrored horizontally (Figma transform scaleX −1), clipped by the panel. Visible fill = a cut-out PNG (transparent background, hash `c1d475f0…`); a hidden second fill holds the same photo on white.
