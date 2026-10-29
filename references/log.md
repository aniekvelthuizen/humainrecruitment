# Log

## 2026-10-29 — Site dump + foundations (step 1)
- Linked site Humain `6ae35364a38b2d71cab8c607` (only site in the Webflow login; "Jerome" not visible/not touched). Staging `humain-d16f03.webflow.io`.
- Dump: 7 pages, 650 class names (55 combos), 55 components, 0 uploaded fonts, 0 CMS collections, 10 variable collections. No agent instructions on the site.
- Wrote via API, in order: 27 swatches (18 updated, 9 new; opacity as 8-digit hex) → Theme 45 variables × Base/Dark/Brand (20 new: button accents, secondary-white, tertiary, back) → Typography (Onest / Vend Sans, sizes in rem, new light/semibold weights, secondary weights, `line-height/heading` 1.25, `text-medium`, `text-label`, `letter-spacing/wide`) → default/Spacing (viewport 25.125–94.5, margin 4rem, gutter 2rem, radius, borders, nav 5rem, button-size/small, space/0–8, section-space) → Text Style: 3 new modes (Text Medium, Label Large, Label), all 13 modes set → classes `u-text-style-text-medium`, `u-text-style-label-large`, `u-text-style-label` (+ mode), `u-weight-semibold` → trims (Onest 0.3745/0.3325 em, Vend Sans 0.35/0.35 em; Text Style `trim-top|bottom` per mode).
- `custom_value` (clamp) still refused by the API → the six fluid variables hold their desktop value; formulas queued for the Variables panel (designer-queue.md).
- Verified: `references/verify-foundations.py` on a fresh `variables.json` → 360 passed, 0 failed (theme hex per mode, text style per mode, sizes, Lumos formulas intact, no px, only Onest/Vend Sans). Mutation test (one hex changed) → 10 failures, so the check bites.
- Open: fluid formulas, Google Fonts in Site settings, trim check in Global Styles, Heading/Paragraph variants (designer-queue.md). Nothing published.

## 2026-10-29 — Fonts + fluid retry
- Uploaded Onest (`6ae3697494487c4f8c1f87ca`) and Vend Sans (`6ae369748fd5754ba016c952`) as variable woff2 via `create_font` + S3 POST (201, MD5-checked). `list_fonts` shows both.
- Retried the clamp formula with the Designer Bridge connected: still "internal error", also for a plain clamp. The Designer tool has no variable actions; the formulas stay a manual paste (fluid-values.md).

## 2026-10-29 — Fluid formulas in
- Owner pasted the six clamp() formulas in the Variables panel. Fresh dump + `verify-foundations.py`: 360 passed, 0 failed, nothing pending. Foundations done.

## 2026-10-29 — Buttons (step 2)
- Kit `skills/buttons`. Inventory with `figma-buttons-scan.js` on every page frame (Visual design, Mobile; `[figma-only]`, Components, Design components, Nav skipped): looks Primary 45, Secondary 22 (+ 39 on dark), Tertiary 7 (+ 2 back link on dark); not buttons: round icon arrows (testimonials), nav/footer links, button groups. Plan: `references/plans/2026-10-29-buttons.md`.
- Theme: Dark/Brand of `button-secondary/*` → `secondary-white`, of `button-tertiary/*` → `back`; new `button-primary/shadow-1…4`, `button-tertiary/background`. Fresh Theme dump + `verify-foundations.py`: 375 passed, 0 failed (mutation of a tertiary dark value → 2 failures).
- `Icon Set` (SVG): masked `icon_set_wrap`, variants Chevron Right / Arrow Right / Arrow Left; SVGs exported with the Plugin API, uploaded (S3 201). Variant mask-images read back.
- `Button Main` restyled in place: colours on the wrap with `:hover` / `:focus-within`, element min-height `button-size/medium`, label Text Medium mode, starter icon slot replaced by `button_main_icon` + Icon Set (bound to new prop Icon Visibility), starter `Link` variant renamed Tertiary (16 px label, icon left, underline grows on hover). Every class and variant override read back.
- API traps hit: multi-layer `box-shadow` with variables flattened to one variable (shadow queued for the Designer); `update_prop` with three props shifted names onto the neighbours (Link → "Text", Icon Visibility → "Link") — repaired one prop per call, read back.
- Not verified yet: rendering. The Designer snapshot cannot judge buttons and publishing needs the owner's OK; the Webflow CDN is blocked from this container (CORS check pending). Nothing published.

## 2026-10-29 — Primary hover + rules
- Owner rules saved in CLAUDE.md: staging publish always allowed; Designer work may start directly.
- Primary hover: lift 0.125rem + icon nudge 0.25rem (trigger transforms, read back). Published to the webflow.io subdomain only.
- Not measured: the staging host and the asset CDN are denied by this container's network policy (ERR_TUNNEL_CONNECTION_FAILED). No browser tool in this session, so the Designer steps (shadow, Icon prop) stay queued.
- Owner: all looks lift on hover → removed `transform: none` from Secondary and Tertiary (read back), published to staging. Owner reports a missing line on the ghost buttons: the border settings (Secondary) and underline settings (Tertiary) read back unchanged; not reproducible from here (staging blocked, Designer snapshot fails) — waiting for which line is meant.
- Owner: outline visible in the Designer, gone on the published site. Fix: border + min-height moved from `button_main_element` (colour `inherit`) to `button_main_wrap` (inline-flex); Tertiary overrides moved along. Read back; published to staging.
- Shadow retry: single-layer `box-shadow` with `@var_variable-…` and a two-layer `var(--…)` string are both stored as the bare variable (temp classes, removed). Shadow needs the Designer (no browser in this session) or custom code.
- Designer Bridge connected (owner): it only navigates/selects, it cannot edit styles. Same flattening with the bridge on. Wrote the 4-layer shadow (rest, `:hover`, `:focus-within`) to `button_main_wrap` anyway — API read-back shows only `shadow-1`; published to staging to check whether the published CSS keeps the full value (kit: read-back can differ from published CSS). Waiting for the owner's look.
- Owner confirmed on staging: the Primary shadow is visible. The API read-back (`shadow-1` only) was wrong; the published CSS kept all four layers. Queue item closed.

## 2026-10-29 — Navigation (step 3) — Aniek Velthuizen with Claude
- Figma read with the `aniekvelthuizen@gmail.com` connector (the `aniek@cutthecode.com` Figma account has only a View seat on this file and is refused by the MCP). Inventory: desktop `Navbar - Light` on all 15 page frames (not fixed, no scroll prototype, 4 click-dropdowns), mobile `Nav / Mobile` closed/open. Plan `references/plans/2026-10-29-navigation.md`; owner answers in `decisions/components/nav.md` (sticky with fold, click, mobile = desktop items, EN hidden, pages created, typos fixed).
- Pages: 13 empty pages from Standard Page (contact, careers, clients, hire-an-expert, project-delivery-experts, consulting-services, project-controls, about, pricing, how-it-works, opportunities, submit-resume, privacy-cookies).
- Logo SVG from Figma into the Lumos `Logo` (also changes the footer logo). Nav variables, bar and panel classes, Menu Desktop variant overrides, four Lumos dropdowns re-used, Contact/Careers row, CTA; state CSS + script embeds in `Nav`; Breakpoint prop 65 → 80.
- Published to staging 4×. Measured headless (`references/nav-check.mjs`, example-components page, dark hero) at 1512 / 1280 / 1279 / 991 / 402:
  - 1512 top: bar 180 (Figma 180), logo 666,93 180×29 (Figma 666,93), Expertise 64,92 103×32 (Figma 64,92 103×32), For candidates x 1040 (Figma 1043), CTA x 1213 w 235 (Figma 1217 w 231 — button component padding), top row 36 high at y 32 (Figma 36 at 32), closed dropdown 0 px.
  - Scrolled down: white, 76 px, top row folded; scrolled up: 112 px with the top row; back at top: transparent 180; quick down-up ends in the top state. Text white over the dark hero, dark on white.
  - < 1280: bar 74, logo 209×34, hamburger 32×16; panel white, rows 64 px, logo dark while open, no horizontal overflow at any width; console clean.
- Not verified: dropdown open on click (hover-open until the Designer step), hover look in the Figma prototype (only the variant swap is known), light-hero pages (no page has content yet). The built-in browser is not signed in to Webflow, so the Designer step is queued.

## 2026-10-29 — Navigation, owner review round 1 — Aniek Velthuizen with Claude
- Owner feedback (9 points): all desktop dropdowns on hover; top row spacing; folded top row still visible; white-on-white dropdown in the scrolled bar; hover line on dropdown links; mobile: thicker hamburger, Expertise roles in one column, switching rows broken, less space above row content. Changes in `decisions/components/nav.md` ("Hover on desktop, tap on mobile", "Owner review round 1"). The Designer queue item for the hover setting is closed (now set by the nav script).
- Published to staging; `references/nav-check.mjs` (extended) at 1512 / 1280 / 1279 / 991 / 402: top row 36.3 above / 36.3 below; scrolled down: top row hidden (opacity 0, visibility hidden), bar rgba(255,255,255,.8) + blur(16px), 76 px; up 118 px; quick down-up ends at the top state. Hover opens each desktop dropdown alone (1000/0100/0010/0001), panel dropdowns `data-hover=false`, Expertise → For business switches (1000 → 0100) at 1279/991/402. Underline 0 → 100 % on hover. Phone: roles in one column, row content 25 px above / 28 px below, hamburger lines 2 px, rows 64 px. Console clean.
