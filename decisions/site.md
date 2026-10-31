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

## 2026-10-29 — Buttons follow the theme
Conflict: Figma has separate `button-secondary-white/*` and `button-back/*` colours for buttons on dark backgrounds; the foundations copied every button colour 1:1 into all three Theme modes.
Choice: Dark and Brand modes of `button-secondary/*` link to `button-secondary-white/*`, of `button-tertiary/text|accent|text-hover|accent-hover` to `button-back/*`. The `-white` and `back` variables stay (unused by classes) as the Figma mapping. `verify-foundations.py` checks the new values.
Why: a button on a dark section must swap colours by itself (kit rule: dark version = theme, not variant).

## 2026-10-29 — Site-only theme variables for buttons
Choice: `button-primary/shadow-1…4` (#0000001a, #00000017, #0000000d, #00000003, same in every mode) for Primary's drop shadow, and `button-tertiary/background` (→ `swatch/transparent`).
Why: colours only through Theme variables; Figma has no variable for the shadow colours or a tertiary background.

## 2026-10-29 — Section attribute for the nav colour
Choice: a page section may carry `data-section="dark"` or `data-section="light"` on its wrap; the nav script reads it to decide the bar's text colour over that section. Without it the script reads the background colour (photo or video = dark). Mark a section only when the automatic reading is wrong. Contract and the other `data-nav-*` attributes: `decisions/components/nav.md`.

## 2026-10-30 — Light sections are white (Base `background` → light-100)
Conflict: in Figma all 15 page frames and 36 of ~50 top-level sections are `background-2` (white); only 7 sections use `background` (light-200), the rest are gradients. Lumos paints a Light section, `u-theme-light`, `u-section` and `body` with Theme `background`, which the foundations had set to light-200 (1:1 with the Figma variable name). Light-200 cards vanished on every default Light section.
Choice (Aniek, via Claude; owner: "kies jij maar"): Theme `background` in **Base mode** now points to `swatch/light-100` (white). Dark (`dark-900`) and Brand (`brand-500`) are unchanged. Cards keep Figma's light-200 through their own `card/background` variable (`decisions/components/cards.md`).
Why: one variable, the Lumos way; the site's light sections now match the Figma pages, and the card shows as designed.
Consequences: the Figma variable `background` (light-200) no longer equals the site's Base `background` — `verify-foundations.py` will report this one mismatch; it is intended. Figma's 7 light-200 sections need their own route when those pages are built (e.g. a fourth Theme mode "Light Grey" with `background` = light-200) — not made yet. Anything else that painted Base `background` (body, `nav_skip_wrap`, `form_range_thumb_element`, `u-background-1`, the Cover card placeholder) is white now too.
Example Components: the 4-card showcase Section (`3057630f-9ab6-4cc6-3104-ef64eb67c98a`) is set to Theme **Light** as the light card example; the rest of the page stays dark (body `u-theme-dark`).

## 2026-10-30 — Figma MCP has access now
Owner gave the Figma MCP account (`aniek@cutthecode.com`) edit access to `18m34a7vzkzopkwGoojmUx`. Use the MCP first; Claude in Chrome signed in as `aniekvelthuizen@gmail.com` (Plugin API `window.figma` works there) stays the fallback. The entry below is history.

## 2026-10-29 — Figma MCP has no access to this file; use the browser instead
Conflict: the Figma MCP server's own connected account cannot open `18m34a7vzkzopkwGoojmUx` ("Looks like you don't have edit access to this file").
Choice: view the Figma file through the built-in/Claude-in-Chrome browser instead, signed in as `aniekvelthuizen@gmail.com` (saved to memory). Reading structure (layer names, component props, icon names) this way works; nothing that needs the Figma MCP's own read/write calls (`get_design_context`, `download_assets`, …) is available until the MCP connector itself is re-shared.
Why: unblocks Figma inspection without waiting on a re-share; also means icon/asset exports that normally go through the MCP Plugin API are done another way (see `decisions/components/icon-set.md`).

## 2026-10-29 — DevKit in the repo
Choice: the Cut the Code Webflow DevKit is committed as-is in `tools/ctc-webflow-devkit/` (from `ctc-webflow-devkit-main.zip`, md5 `04ef0a7a809e1c6e792c3b425de0a0a8`). A new kit version replaces the folder in one commit.
Why: owner — every session has the kit without uploading the zip, and the repo records which kit version built the site. Its hooks are not active from there (they only run as an installed plugin).
