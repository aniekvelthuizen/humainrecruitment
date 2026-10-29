# Site

## 2026-10-29 — Client repo lives in the wireframes repo
Conflict: the kit expects a separate `wf-<client>` repo.
Choice: the client setup lives in the root of `humainrecruitment`, next to `wireframes/` and `docs/`.
Why: owner's choice; everything for HumAIn in one place.

## 2026-10-29 — Not production yet
Choice: `"production": false` until launch; flip to `true` when the site goes live.
Why: nothing is live, so the guard does not need to ask before changes.

## 2026-10-29 — Figma themes onto Lumos modes
Conflict: Figma Theme modes are Base / Dark / Brand; Lumos ships a light base mode and Dark.
Choice: Base = Lumos' base mode, Dark = Dark, Brand = new mode `Brand`.
Why: same meaning, keeps Lumos' `u-theme-*` classes working.

## 2026-10-29 — Text styles win over Figma's Text Style variables
Conflict: Figma's text styles (H1–H5 125 %, letter-spacing 0) disagree with its Text Style variables (1 / 1.1, tight -0.03).
Choice: follow the text styles; new `line-height/heading` = 1.25, letter-spacing 0. Confirmed by the owner.
Why: the text styles are what is applied on the pages (1,000+ uses).

## 2026-10-29 — Mobile heading sizes
Conflict: Figma's Mobile mode keeps every font size equal to desktop; on the mobile frames the designer instead picked a smaller desktop style for the same title (a desktop H1 is styled H3 on mobile).
Choice: the semantic level stays (an H1 stays an H1); its mobile size is the size of the style used for that same title on mobile. Matched titles (Home, Opportunities, Opportunities / Detail):
- Display 72 → 36 ("Project delivery roles, ready for you.", "Project Controls Manager" → H3)
- H1 60 → 36 ("Similar opportunities" → H3; the home hero → H3)
- H2 48 → 30 ("No perfect match yet?…", "Looking for a senior project-controls expert?" → H4)
- H3 36 → 30 ("About the role", "Responsibilities"… → H4)
- H4, H5, H6 unchanged (same style on mobile)
Display, H1, H2 and H3 scale fluidly between 402 and 1512 px (`references/fluid-values.md`).
Why: owner rule — read the designer's mobile choice per title, keep the level.
No exceptions: every heading of a level gets that level's mobile size, even where a mobile frame drew it differently ("Trusted by the people who hire." is H4 30 on the mobile frame, gets H1 36). Owner: the mobile headings stay in one system; deviating from the design is fine there.

## 2026-10-29 — Only Onest and Vend Sans
Conflict: IBM Plex Mono appears in the Figma file.
Choice: no third font. It only occurs in the `[figma-only]` documentation frames (Text styles, Color variables), never in a page design.
Why: owner rule — the styleguide uses Vend Sans and Onest only; no other fonts.

## 2026-10-29 — Extra text styles
Choice: Text Medium, Label and Label Large become Text Style modes with their own `u-text-style-*` class. Display Large, Text X Large, Text XX Large do not (3–7 uses; sized per section).
Why: each of the three is used 100+ times. Confirmed by the owner.
