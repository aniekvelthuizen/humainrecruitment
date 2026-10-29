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

## 2026-10-29 — Site linked
Choice: Webflow site "Humain" (`6ae35364a38b2d71cab8c607`), staging `humain-d16f03.webflow.io` (from the site's short name; `get_site` returns no staging field). The Theme collection already had a `Brand mode`; that is the Figma Brand theme (no new mode created).

## 2026-10-29 — Label letter-spacing as a variable
Conflict: the plan gives Label / Label Large 0.1em letter-spacing but no variable for it.
Choice: new `letter-spacing/wide` = 0.1em in Typography; both Label modes link to it.
Why: Text Style values stay links, never literals.

## 2026-10-29 — Trims on a starter without trim variables
Conflict: this Lumos starter has no trim variables and no trim on the `u-text-style-*` classes (the Global Styles embed is not readable through the API).
Choice: `font/primary-trim-top|bottom` (Onest 0.3745 / 0.3325 em) and `font/secondary-trim-top|bottom` (Vend Sans 0.35 / 0.35 em), computed from the Google Fonts files (hhea ascent/descent, OS/2 cap height, typography.md formula). Text Style gets `trim-top` / `trim-bottom`: body modes link the Onest pair, Display and H1–H6 the Vend Sans pair. Whether the Global Styles embed reads `--_text-style---trim-*` is a Designer check (designer-queue).

## 2026-10-29 — Lumos formulas kept
Choice: `max-width/main` keeps Lumos' `calc(var(--site--viewport-max) * 1rem)` (= 94.5rem with viewport-max 94.5) instead of a static 94.5rem; `max-width/full`, `site/column-width`, `nav/height-total`, `focus/offset-inner`, `radius/round` untouched. `section-space/page-top` (not in Figma) keeps its Lumos clamp.
Why: same value, and the formulas keep the system linked.

## 2026-10-29 — New text-style classes
Choice: `u-text-style-text-medium`, `u-text-style-label-large`, `u-text-style-label` (names as in the plan), copied from `u-text-style-main` (which in this starter has no `display: flow-root`, so neither do the copies), each set to its Text Style mode. `u-weight-semibold` added (Onest + `font/primary-semibold`).

## 2026-10-29 — Fonts self-hosted, not Google Fonts
Choice: Onest and Vend Sans as uploaded custom fonts, one variable woff2 per family (wght axis: Onest 100–900, Vend Sans 300–700), Latin subset from Fontsource (OFL-1.1), ~35 KB each. No italics (not in the design).
Why: owner — Google Fonts is slow. Latin covers Dutch and English; Webflow takes no unicode-range, so latin-ext is left out.
