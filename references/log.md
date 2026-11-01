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

## 2026-10-29 — Navigation, owner review round 2 — Aniek Velthuizen with Claude
- Dropdown cards 8 px lower (button → card 2 → 10 px at the top of the page); in the sticky bar the card now hangs 8 px below the bar's edge (was ~4 px over it). Measured at 1512 and 1280 with `references/nav-check.mjs` (`cardGaps`, `scrolledCard`): all four cards 10 px under the button and stay open when the mouse moves in; sticky: bar → card 8 px. Console clean.

## 2026-10-30 — Service card (Card Primary variants) — Aniek Velthuizen with Claude
- Figma `Card / Service` (`2058:4302`) read with the MCP (`aniek@cutthecode.com`): 5 variants; real-page uses: `discipline` (Home B), `default` glass (Home B, Hire an expert), `variant4` step (How it works); `services` + hover on the Components page. Choice and structure: `decisions/components/cards.md` (2026-10-30 "Service card").
- Card Primary: variants **Service** + **Discipline**; wrappers `card_primary_icon` / `_kicker` / `_text` / `_details` / `_corner`; props Text, Icon Visibility, Button Icon Visibility; title size moved to `card_primary_header` (Typography Heading → Inherit). The element builder now works inside component definitions.
- Icon Set: 6 Figma icons added (`icon-set.md`).
- Example Components: new Light Section with 3 Card Primary (2 Service, 1 Discipline). Published to staging 2×.
- Measured on staging at 1512 (cards at 440) and 402: Service 440 × 230 (Figma 226), icon/arrow positions equal to Figma, hover veil + arrow checked; Discipline title y 32 (= Figma); Opportunity unchanged (440 × 385, meta 205/237/269, arrow 392/337; mobile 362 × 261). No horizontal scroll at 402.
- Designer (Claude in Chrome): Icon Set Variant linked to a new Card Primary prop Icon (Visual, default Timer); read back via API; staging card shows Person Shield. Published to staging 3×.
- Open: glass and step card types.

## 2026-10-30 — Glass and Step cards — Aniek Velthuizen with Claude
- Card Primary variants **Glass** and **Step** (decisions/components/cards.md "Glass and Step"); Theme `card/glass`, `card/shadow-1…4`; new parts `card_primary_top` / `_badge` / `_value` / `_number`; props Badge Text, Value (folder Step).
- Icon Set +5 (Assignment, Check Circle from Figma; List Check, Handshake, Outbound from Material Symbols — Figma MCP View-seat limit reached).
- Example Components: Dark showcase Section with 2 Glass + 2 Step. Published to staging 2×.
- Measured at 1512 and 402: Glass 440 × 230 (Figma 226), Step 251 × 202 (Figma 200), pill 26 high at y 35 (= Figma); published CSS has the 4-layer shadow and the ring mask; Service, Discipline, Opportunity unchanged.

## 2026-10-30 — Remaining cards — Aniek Velthuizen with Claude
- Figma inventory through Claude in Chrome (Figma MCP View seat hit its call limit on the first call): Expert, Expert match, Profile, Stat, Process stage, Pricing, Logo, Testimonial 1, Opportunity variant3/4; where each is used on the numbered page frames. Choice per card in `decisions/components/cards.md` ("The remaining cards"): 9 new Card Primary variants (Opportunity Text, Expert, Expert Match, Expert Match Glass, Profile Role/Person/Case — Cover and Stacked reused —, Stat, Stage, Pricing, Logo) and one own component, **Card Testimonial**; slot item **Card Bullet**.
- Card Primary: wrappers eyebrow / subtitle / logo / list (+ slot Items) / value label / button / action; props Subtitle (+ Visibility), Logo, Logo Alt, List Title, List Visibility, Value Label, Badge Visibility, Salary Visibility; Value and Badge Text moved to their own folders. Trigger reset moved from content to the button wrappers. Swatch `brand-accent-700`.
- Icon Set +4 (Check, Quote, Star, CV Submission); 5 images uploaded (Google + Agristo logos, two photos, avatar). Assets came out of Figma through a local receiver (Plugin API export → POST to 127.0.0.1 from the Figma tab).
- Example Components: Light showcase (6 cards) and Dark showcase (5 cards + testimonial). Published to staging 7×.
- Measured at 1512 and 402 (details in cards.md): Opportunity Text, Stage, Pricing, Testimonial, Expert Match Glass on Figma positions within 0–2 px for the parts with a matching text style; bigger offsets where the site has no 10 px / SemiBold style (listed as deviations). Hover checked with a real mouse on Expert (veil + arrow) and Expert Match Glass (white, dark text and logo). Opportunity, Service, Discipline, Glass, Step unchanged at both widths. No horizontal scroll at 402.
- Fixed during measuring: price pushed its suffix out of the card (`u-text` min-width 100 %) → `card_primary_number` width auto; glass hover on `element:hover` never fired under the Clickable → moved to the group; bullet text 3 px wider than the card → text holder.

## 2026-10-30 — Card review and fixes — Aniek Velthuizen with Claude
- Review of all cards with four fresh reviewer agents (`references/audit/2026-10-30-cards.md`): 1 broken, 8 off, 7 tidy, 8 owner questions. Owner: fix 1–16; 17 keep Lumos wrapping, 18 greyscale photo yes, 19/21/23 accept, 20 no capitals, 22 smaller % yes, 24 other Subtitle default yes.
- Card Primary: Screen Reader Text default empty (cards clickable only with a link); button hidden in the nine button-less variants; Logo Visibility toggle (broken default image no longer requested); Theme `card/accent` and `card/logo-invert`; Value Unit; Subtitle default "Job title"; Pricing label room; no stretching for Expert Match/Glass/Logo; Profile Person/Case radius and surface; literals → variables; dead overrides removed. Card Testimonial: arrow aligned, role class, rating for screen readers, avatar decorative.
- Designer step for the Logo default blocked by Webflow's bot check in Chrome (not attempted to bypass); solved through the toggle instead.
- Published to staging 6×; re-measured (cards.md "Review fixes"): all fixed items confirmed, all heights unchanged.
- Fresh re-check (2 reviewers): all fixed items confirmed. Found and fixed: broken Lumos Image placeholder on Profile cards (Image Visibility, default off), % baseline, "Match score" label spill, Glass expert photo grey after a click (Theme `card/photo-grayscale`), dead corner CSS. Published 3× more; 0 broken image requests in the page HTML.
- 2026-10-30 — Aniek (via Claude, Designer in Chrome): card corner arrow and "View & apply" now hidden when the card has no Link (native conditions); published to staging, checked in the HTML (cards.md "No link, no arrow").
- 2026-10-30 — Aniek (via Claude, Designer in Chrome): native "is set" conditions on Card Primary Subtitle, Logo, List Title, Value Label and Badge; published to staging, showcase unchanged (44 cards, same parts).
- 2026-10-30 — Aniek (via Claude, Designer in Chrome): one clickable rule (Screen Reader Text AND Link set) for Clickable, arrow and button on Card Primary and Card Testimonial; testimonial "is set" conditions; Experience Icon prop (Opportunity Text row 2 = CV Submission); own placeholder images as Logo/Image defaults. Published to staging, checked in the HTML.

## 2026-10-30 — Navigation review — Aniek Velthuizen with Claude
- Review of the nav with two fresh reviewer agents, desktop ≥ 1280 and mobile < 1280 (`references/audit/2026-10-30-nav.md`): 3 broken, 9 off, 6 tidy, 5 owner questions. Broken items re-measured on staging: the mobile menu opened after scrolling down hides Contact/Careers; hover-then-click closes a desktop card; the focus ring in a desktop card is white on white. Nothing changed yet; waiting for the owner's pick.
- The `webflow` MCP in agents points to another workspace (404 for Humain); reviewers worked from the published HTML/CSS.

## 2026-10-30 — Navigation review fixes — Aniek Velthuizen with Claude
- Owner: fix all (1–18 of `references/audit/2026-10-30-nav.md`). Nav script + state CSS rewritten (fold only on desktop, hover-then-click keeps cards open, focus-out closes cards, Tab cycle in the open mobile menu, menu-open attribute held 300 ms, reduced-motion animation, colour-mix scrolled bar); Lumos nav script without the banner part; Nav Banner instance removed; styles: card Theme base + theme text, outer focus offset, hamburger 44 × 44, mobile row links 41 px, panel top space/5, desktop card gaps space/6 and 2.25rem; Icon Set variant Chevron Down replaces Icon Arrow in the toggles; `role="none"` on the dropdown lists and the mobile Nav Menu; Menu → group Global; Example Components `#main`. Published to staging 4×.
- Measured after each publish (scratchpad `fix/verify.mjs`), then a fresh reviewer re-checked: all fixed items confirmed; its 3 new small items fixed and re-measured. Open: banner / open-on-mobile rules in the Lumos CSS embed (no site plan, Designer will not save custom code). Q1–Q5 waiting for the owner.
- 2026-10-30 — Aniek (via Claude): owner answers Q1–Q5. Expertise card column gap 4rem (API); active page gets a 1 px underline on the native Current state of the nav links (Designer in Chrome, base variant); Q1 left for the homepage build, Q3 and Q4 recorded. Published to staging 1×; measured on /clients and /pricing at 1440, 1280 and 375.

## 2026-10-31 — Card props tidy-up — Aniek Velthuizen with Claude
- Last open card items done (`decisions/components/cards.md` "Props tidy-up"): props in folders and in convention order, Card Type → Variant, Clickable Attributes → Link Attributes, slot Items in List (API + Designer in Chrome); "is set" conditions on Title, tags and meta rows; Title default H3 again. Published to staging 1×; read back on Example Components: 44 cards, all parts as before, 27 `<h3>` titles (17 showcase cards with their own title stay `<p>`, same look).

## 2026-10-31 — Card Primary split, plan — Aniek Velthuizen with Claude
- Read-only inventory: Card Primary 16 variants, 37 props, 52 instances counted by Webflow; found 45 (44 on Example Components = 18 own showcase + 26 Lumos demos, 1 on Home), 7 unexplained. Element tree and slot contents read back.
- Plan `references/plans/2026-10-31-card-split.md`: Card Primary (content) + Card Opportunity + Card Expert + Card Profile + Logo Tile, own classes per component, Card Arrow shared; phases with backup, snapshot, `card-check.mjs` baseline and a pilot checkpoint; kit-issue draft in §10. Choice recorded in `decisions/components/cards.md` (proposed). Nothing on the site changed; waiting for the owner's OK and 5 answers.

## 2026-10-31 — Card Primary split, pilot Card Opportunity — Aniek Velthuizen with Claude
- Owner OK on the plan. Webflow backup "Before Card Primary split (Aniek, 2026-10-31)". Snapshot of the published CSS, HTML and all 44 instance values in `references/audit/2026-10-31-card-split/`; baseline of all 45 cards at 1512 and 402 with the new `references/card-check.mjs`.
- Duplicate test on a throwaway component (removed): variants + variant styles, prop ids, wrap bindings and conditions all survive `duplicate_component`.
- Card Opportunity Arrow → Card Arrow; arrow, tag and meta classes renamed. Card Opportunity built as a duplicate with own `card_opportunity_*` classes, variants Default / With Text, 16 props removed. Two cards placed in the Light showcase next to the old ones; published to staging 2×.
- `references/card-diff.mjs`: identical within 1 px at 402; at 1512 only the grid-row stretch differs. Elements per card 83 → 45–50.
- Designer (Claude in Chrome): condition `Text is set` added; folder order and the leftover Icon prop queued. Kit issue written to `references/kit-issues.md` (filing on GitHub was blocked by the session's permissions).

## 2026-10-31 — Card Primary split, Card Expert / Card Profile / Logo Tile — Aniek Velthuizen with Claude
- Owner: "ga door". Card Expert (Expert, Match, Match Glass) and Card Profile (Role, Person, Case) as duplicates with own classes; Logo Tile built fresh. Variant overrides read per class from the API; shadow and filter values from the published CSS. Batched prop renames on Card Expert landed on the wrong prop: repaired one prop per call, read back.
- New cards placed after the old ones in the Light and Dark showcase grids; published to staging 2×; measured at 1512 and 402: identical within 1 px apart from grid-row stretch; Logo 66 → 2 elements, Profile 66 → 19.
- Designer items queued (leftover variant props, Expert Name H3, folder order). Old Card Primary cards and variants untouched.

## 2026-10-31 — Card Primary split, phase 3 (convert) — Aniek Velthuizen with Claude
- 34 old Card Primary instances on Example Components replaced (Lumos demo grids and sliders 1:1, showcase cards by the phase 1–2 cards) and removed; stray Card Primary in Home's body (after page_wrap) removed. Showcase grid order changed (API cannot anchor on an instance in a slot).
- Published to staging; `card-check.mjs` against the baseline: 402 all identical within 1 px (Logo Tile: fewer wrappers), 1512 identical except row-height changes from the new order. 3243 → 1792 elements on the page's cards.
- Card Primary keeps 10 content cards; its 9 moved variants are now unused (Webflow still counts 7 phantom instances). Next: phase 4.

## 2026-10-31 — Card Primary split, phase 4 (slim down) — Aniek Velthuizen with Claude
- Webflow backup "Before Card Primary phase 4 (Aniek, 2026-10-31)"; fresh baseline of all 45 cards + CSS model in `references/audit/2026-10-31-card-split/before-phase4/`.
- Card Primary rebased to Service: base classes = old base ⊕ Service, each remaining variant rewritten as its difference from the new base (script from the published CSS, written with the style/variant API, title modes with `remove_style_variable_mode`). Service cards switched to `base`; checked on staging before removing anything (rebase identical, only the to-be-removed tags/meta showed).
- Removed: image, kicker/Tags, subtitle, logo, unit, details/Meta (+ 7 classes); 13 props; variants Opportunity Text, Expert, Expert Match (+ Glass), Profile Role/Person/Case, Logo, Service. Subtitle → Eyebrow (+ Visibility), same ids; Eyebrow and Value Label defaults emptied. Base renamed Service. Published to staging 2×.
- Measured: 45 of 45 cards identical within 1 px at 1512 and 402, rest and hover; 10 content cards 754 → 399 elements, no job text left in their HTML. Designer: Experience Icon variant prop queued. Record: `decisions/components/cards.md` "Phase 4".

## 2026-10-31 — Card split, Designer pass — Aniek Velthuizen with Claude
- Designer (Claude in Chrome, component canvas): leftover variant props deleted on Card Primary, Card Opportunity, Card Expert and Card Profile (trash icon on the prop row); Card Expert Name default H3; Card Expert attributes prop "Score Label" renamed back to Card Attributes in Settings; folder and prop order fixed on all four.
- Read back with `get_component`; published to staging 1×; `card-check.mjs`: 45 cards unchanged, expert names `<h3>`. Record: `decisions/components/cards.md` "Designer pass after the split".

## 2026-10-31 — Button Main Icon prop — Aniek Velthuizen with Claude
- Designer (Claude in Chrome): Button Main's Icon Set Variant → new variant prop Icon (folder Icon, default Chevron Right); Variant prop into folder Button; folder/prop order fixed. Styleguide Tertiary buttons (3) set to Arrow Right with the API.
- Published to staging 1×. Icon variants counted on all 18 pages before/after: only the 3 Styleguide Tertiary icons changed; Example Components cards unchanged (`card-check.mjs`). Record: `decisions/components/button.md` "Icon prop and folders".
- 2026-10-31 — Aniek (via Claude): owner OK for the arrow in cards. Card Primary's Tertiary button set to Icon = Arrow Right (API, inside the definition); published to staging; only the Discipline card's icon changed ("→ View" as in Figma `2710:56919`), 45 cards same geometry.

## 2026-10-31 — Card split clean-up — Aniek Velthuizen with Claude
- Dead variant CSS from `duplicate_component` removed from the `card_primary_*` classes: 55 class × variant × breakpoint × pseudo combinations read from the published CSS, props removed with `set_variant_styles` (50) and Theme/Text Style modes with `remove_style_variable_mode` (17), read back empty. Published CSS: 96 → 0 rules with those variant ids on `card_primary_*`.
- Card Primary defaults from Figma `Card / Service`: Title "Pre-Qualified Specialists" (H3, Designer in Chrome), Button Text "View" (API). No instance used the old defaults.
- Designer (Claude in Chrome; footer session asked first, it was not using the Designer): 13 showcase card titles `<p>` → H3; showcase order restored with ⌘X/⌘V (Light and Dark grids as before the split).
- Published to staging 2×. `card-check.mjs` vs `after-phase4/` (`after-cleanup/`): 402 all 45 identical within 1 px; 1512 42 identical, 3 only taller/shorter from the restored grid rows. Card `<h3>` 36 → 49. Record: `decisions/components/cards.md` "Card split clean-up".

## 2026-10-31 — Card review fixes (phase 5) — Aniek Velthuizen with Claude
- Owner (Aniek) chose "fix all + recommended" on `references/audit/2026-10-31-cards-review.md`. API: empty Link / Screen Reader Text / Opportunity Text / Logo Alt defaults, Expert Photo Visibility on, new Photo Alt / Image Alt props, tooltips, sub-component folders, Opportunity meta grid (text no longer past the card), Pricing hover + label above the ring, Match Glass no zoom + white focus ring, Logo Tile root = `logo_tile_wrap` (max-content width, theme-coloured logo), leftover styles removed, Profile gap `space/3`, Visibility + Role props on Logo Tile and Testimonial.
- Designer (Claude in Chrome; no other session in the Designer): eyebrow and Pricing-button conditions, Role attribute on Logo Tile / Testimonial, panel order on Card Primary / Expert / Profile / Opportunity Meta, Testimonial role Variant + Style overrides reset. A Card Primary instance that a double-click in the Components panel had dropped on the page root was removed before publishing.
- Match Glass ring: `.clickable_link:focus-visible` outline-color `currentColor` + white text colour on the Glass group's focus-within (Lumos' ring follows the theme text, which Glass turns dark on focus). Pricing label: z-index on `card_primary_element` (its backdrop-filter is a stacking context).
- Published to staging 4×. `card-check.mjs` (`after-review/`) vs `after-cleanup/`: 45 cards, only the intended differences (meta text 392 → 350 px, Glass photo no zoom, Pricing button lifts on hover, Logo Tile 440 → 175 px + `invert`, Profile Case without the empty top div); no overflow, no console errors. Hover/focus re-run: see the audit file. Record: `decisions/components/cards.md` "Review fixes, phase 5". Not done: Wrapper Classes / Style on Logo Tile and Testimonial (Block root, would need a rebuild).

## 2026-10-31 — Footer — Aniek Velthuizen with Claude
- Figma read in Claude in Chrome with the Plugin API (Figma MCP at its tool-call limit): `Footer` set `2382:37420`, `desktop-compact` on all 16 desktop frames, `mobile` on 3. Spec + pictures in `references/figma/footer/`; plan `references/plans/2026-10-31-footer.md`; choices in `decisions/components/footer.md`.
- Lumos `Footer` adapted in place: brand title/text column, 3 link columns (12 `Footer Link`s), mobile accordions (toggle button + drawer, script + CSS embed), Logo below 768 px as outline, bottom row with © {year}, 3 legal links and LinkedIn. `Footer Link` restyled (Text Main, growing-line hover). New: Theme variables `footer/gradient-start|middle|end`, `Icon Set` variant LinkedIn, classes `footer_group_layout`, `footer_group_toggle`, `footer_group_icon`, `footer_group_drawer`, `footer_content_accent`. Removed unused Lumos footer classes (bottom item/link, social wrap/title, `u-text-style-small` combos) and the Lumos `Grid` in the footer.
- API traps: slot content inside a definition is not addressable (columns made plain elements via insert + unlink); a gradient of variables is flattened (moved to the CSS embed); link props refuse `page` mode (relative URLs); a second class on an element needs its combo created first.
- Footer already on all 17 pages with the nav (Standard Page copies); Home and Styleguide have neither.
- Published to staging 6×. Measured with `references/footer-check.mjs` at 1512 / 991 / 767 / 402: all positions within 2 px of Figma (1512: footer 551 vs 550, columns at x 536 / 851 / 1165 = Figma, divider 410; 402: rows 64, logo 459 vs 460, divider 598 = Figma, footer 767 vs 766). Accordion opens/closes, aria-expanded follows, closed links not focusable; hover line 0 → 100 %; no overflow, console clean.
- Open: targets for Privacy settings, Disclaimer, LinkedIn (`#`); owner to confirm logo only on mobile and the simplified accordion content.
- Review (fresh reviewer, `references/audit/2026-10-31-footer.md`): 7 items fixed (992–1100 brand column, phone tap areas, logo outline edges, focus offset, script on `data-footer-*`, own text classes, border variable); fresh re-check confirmed them; round 2: phone link tap areas 1rem, gradient moved from the embed to `footer_wrap` (the API read-back shows one variable, the published CSS keeps all three stops). Waiting for the owner: bottom-row contrast on the pink gradient end (as Figma), heading + button announced twice on phones.
- Final measurement after publish: 1512 footer 551 (Figma 550), 402 footer 767 (766), LinkedIn 44 × 44 on phones, no overflow, console clean.
- Not in this worktree: `decisions/components/icon-set.md` has no LinkedIn row (the newer version is on main; the variant is recorded in `footer.md`). Add the row when merging.
- Footer, owner answers (Aniek): bottom-row contrast stays as Figma; phone column title stays heading + separate toggle. Recorded in `decisions/components/footer.md`.
- Footer, owner answers 2 (Aniek Velthuizen with Claude): the mobile logo is a design error — removed at every width (logo link + `Logo` instance, class `footer_logo_wrap`, outline CSS in the embed); accordion content = desktop links confirmed; LinkedIn → `https://www.linkedin.com/company/humain-recruitment/home/` in a new tab. Privacy settings and Disclaimer stay `#` until their text pages exist. Published to staging; `footer-check.mjs` (logo check replaced by last row + LinkedIn href/target): 1512 unchanged (551), 402 footer 628, last row → divider 80, accordion works, no overflow, console clean.

## 2026-10-31 — Home hero (Hero Experts + Logo Marquee) — Aniek Velthuizen with Claude
- Figma read in Claude in Chrome with the Plugin API (Figma MCP at its tool-call limit): `Header / Home v01` has 3 variants; **1. Home B** uses `type=variant3`; the mobile frame draws the Home A hero. Spec + pictures in `references/figma/home-hero/`. Plan `references/plans/2026-10-31-home-hero.md`; owner answers Q1–Q3 (Home B, mobile order; lorem quote stays; site H1).
- Assets exported through a local receiver and uploaded (create_asset + S3 POST, all 201): hero photo (transparent PNG), 2 expert photos, 7 client logos (Agristo and the Willem Jan photo already existed).
- Theme variables `footer/gradient-*` renamed `gradient/brand-*` (footer CSS checked after publish).
- Built on Home: plain section with Lumos utilities (Theme Brand, u-container, H1/Main/Large text styles), Button Main ×2, Card Expert (Expert, `u-theme-light`) + 3 Card Bullets, quote (Icon Set Quote), photo with CSS fade mask, Lumos Slider with 5 Card Expert Match Glass (fixed 322 px, edge fade, chevrons via a CSS embed), Logo Marquee (8 Logo Tiles, CSS loop + clone script). Closed into components **Hero Experts** (`598c44e8-…`, props Text, Photo, Photo Alt, Quote Visibility, Quote) and **Logo Marquee** (`5f31b436-…`).
- Home now: Nav · main › Hero Experts · Footer; Lumos starter block removed.
- Published to staging 5×. Measured with the new `references/hero-check.mjs` at 1512 / 1280 / 991 / 767 / 402: no sideways scroll, trimmed distances within 1 px of Figma, cards 322 wide and the first at x −22 on desktop, slider moves on an arrow click, marquee ≈ 35 px/s and still with reduced motion, no console errors. Open: title 4 lines at 1512 with the site H1 (Figma 3), hero 1125 high (Figma 1019).

## 2026-10-31 — Home hero, owner feedback and review fixes — Aniek Velthuizen with Claude
- Owner: arrows missing; a selected card must end in the middle and the photo + content above must follow it; text not aligned with the nav; Expert card misses rounded corners and the notch. Logo row needs no pause, contrast stays, expert names need no H3; fix the rest of the review.
- Hero unlinked and rebuilt: stage with 5 expert panels (photo, Card Expert + 3 bullets, quote), switched by the slider (centred on ≥ 768, click a card or the arrows); own arrow buttons (Icon Set chevrons) in an unmasked layer; fade on a full-width track; Lumos slider controls off. Old definition `598c44e8-…` unregistered (0 instances); new **Hero Experts** `270bcc7c-…` (prop Text) back in `main`.
- Layout: stacked below 1280 (burger nav), three columns from 1280; top padding on the wrap (10rem / 12.9375rem). Card Expert Wrapper Style transparent (corners + notch back), notch arrow white. Spacing literals linked to variables; `hero-experts_experts-contain` class.
- Logo Marquee: clones until covered + on resize (3 lists at 2560), tiles are list items, reduced motion wraps the logos, styles tidied, Title prop.
- Nav alignment measured: aligned up to 1512; above it the nav (1384 content) is narrower than every `u-container` section (1512). Left for a separate nav session.
- Published to staging 6×. Measured: arrow next → Chance centred and panel 3 shown; a real mouse click on a card → centred + panel; arrows visible at 1512 and 2560; no sideways scroll at 2560–402; buttons `<button>`; one h1; no console errors.
- Re-review (two fresh reviewers): fixed items confirmed. New items fixed and re-measured: track limited to `max-width/main` (arrows in the fade at 1920/2560), phones start on card 1, re-centre when crossing 768, `aria-disabled` arrows keep focus, marquee clones synced to the original's animation time (+ re-fill on logo load), small tidies. Published 2× more. Open for the owner: selected-card look, arrow hover, 1100–1279 panel spacing.

## 2026-11-01 — Nav as wide as the content — Aniek Velthuizen with Claude
- Owner: "zorg dat de nav dezelfde breedte heeft als de content" (screenshot at a wide screen). Measured at 1920: nav content 268–1652 (1384), hero/footer `u-container` 204–1716 (1512).
- `nav/max-width-outer` → alias of `max-width/full` (was `max-width/main`). `custom_value` `calc(max-width/main + 2 × nav/spacing-inner-horizontal)` was refused twice (internal error), so the cap moved to the inner layout that already had it. `variables.json` updated for this one variable.
- Published to staging 1×. Measured: nav content edges equal the hero and footer at 2560 / 1920 / 1512 / 1280, also scrolled (white bar still full width, back to transparent at the top); mobile bar unchanged at 991 / 375; no sideways scroll. Decision in `decisions/components/nav.md`.

## 2026-11-01 — Home «The risk» (Stagger Cards) — Aniek Velthuizen with Claude
- Figma `Content / 4 UBRS` (Home B `2710:48617`) read in Claude in Chrome with the Plugin API (Figma MCP at its call limit after one call); spec + pictures in `references/figma/home-risk/`. Plan `references/plans/2026-11-01-home-risk.md`; owner answers: content decides card height (Q1), plain section like the hero (Q2).
- Webflow through the claude.ai Webflow connector (the local `webflow` connector only lists Core and THDV).
- New Theme colour `glow/mint`; 8 classes + 5 empty combos; section built in `page_wrap`, closed into **Stagger Cards** (`d411ac47-…`, group Sections) with props Eyebrow / Title / Text and a Card Primary slot, moved into `page_main` after Hero Experts; 3 × Card Primary Glass in the slot (icons Schedule Outline, Project Controls, Person Search; Role off). Card titles set to H3 in the Designer (Claude in Chrome).
- Fixes after the first measure: cards stretched to the stepped row (326 → 230, `height: auto` in the embed), cards had no `listitem` role.
- Published to staging 3×. `references/stagger-check.mjs` at 1512 / 1280 / 991 / 767 / 402: header and card positions within 0.5 px of Figma (cards 230 vs 226, known Glass height), no sideways scroll, no text outside a card, 3 × `<h3>` + `listitem`, one `h1` on the page, no console errors.

## 2026-11-01 — Home hero, owner round 2 (Aniek Velthuizen, via Claude)
- Hero Experts embed: the expert row loops (Swiper 8 loop, enabled after the Lumos init), is centred at every width and starts on card 3 everywhere; the selected card is white; no card hover on touch screens.
- Arrows: Lumos trigger `hover focus`, icon nudge as Button Main.
- `hero-experts_content` ≥ 1280: 36rem, no shrink → title on 3 lines.
- Published to staging and measured (see the audit file). Open: how expert content is entered (CMS proposal).

## 2026-11-01 — Hero experts from the CMS (Aniek Velthuizen, via Claude)
- Owner chose the CMS. New collection **Experts** (11 fields, 3 published items from Figma). Two list components, `Expert Row List` (in the Slider slot) and `Expert Panel List` (in the stage), same filter (Show in Hero) and sort (Order); made into components in the Designer via Claude in Chrome, then placed in Hero Experts; the fixed cards and panels removed.
- `Card Expert`: Name and Score now plain-text Typography so CMS fields bind; Example Components' Match score override restored; header condition reset to visible.
- Script: panels by order, start on the middle expert.
- Published to staging 3×. Measured: row and panel in sync (click, arrows, swipe, loop), no sideways scroll, no console errors; Example Components expert cards unchanged. Fresh reviewer ran (audit file).
- Review fixes, published 2× more: 1/2 experts (no white clones, no loop/arrows with 1, full row with 2), panel list roles removed, hero photo eager, cms.json refreshed. Records corrected (Example Components names were `<h3>`).

## 2026-11-01 — Home «Content block» (Split Content) — Aniek Velthuizen with Claude
- Figma `Content / Content block` (`2323:33112`, set `2249:8012`) read in Claude in Chrome with the Plugin API (Figma MCP at its call limit); tree, pictures and the two photos in `references/figma/content-block/` (local receiver on 127.0.0.1). 9 instances on 7 pages; Home B has two. Plan `references/plans/2026-11-01-content-block.md`; owner took all four recommended answers.
- Two photos uploaded (create_asset + S3 POST, 201): `split-content-practitioners.jpg` (`6ae720745b895866b95df6da`), `split-content-candidates.jpg` (`6ae720745667b0fdd31c898d`), 1352 × 902, ~250 KB.
- New section component **Split Content** (`410b9fa3-…`, group Sections): 16 classes + combos, notch mask, embed, 18 props + slot List, variants Image Right / Image Left. Card Bullet got variant **Large** (base renamed Small; text size moved to the wrapper's Text Style mode).
- Home: Split Content #1 after Sticky Steps, #2 at the end of `page_main` (Space Top none).
- Fixes after the first measure: quote texts were still trimmed (`u-text-trim-off` only reaches direct children → also on `_quote`), figcaption centred by Webflow's default (→ left).
- Published to staging 3×. `references/split-check.mjs` at 1512 / 1280 / 991 / 767 / 402: at 1512 every box equals Figma (sections 938 / 643, photo 772/192 676 × 451); stacked text-first below 992, no sideways scroll, no console errors; patched previews of Image Left and a 6-item Large checklist (18/27, icon 24, rows 16 apart).
- Open: checklist slot can only be filled in the Designer; Image Left text starts 30 px left of Figma (Project controls only); «Working in project controls?» wraps after «in» (site H2 balanced wrapping).
- Review fixes (owner: "verwerk ze"): Card Bullet `listitem` + `list` on the card holders; quote-margin rule out of the embed; Space Top case-insensitive; real space between the title parts. Photo `sizes` not possible (reserved attribute; a trial Sizes prop on Visual Image was removed). Published 1×; split-check unchanged (938 / 643 at 1512, no overflow, no errors), Example Components 14 bullets in lists, still 14/21. Fresh re-check reviewer run afterwards.
- Owner: photo `sizes` stays `100vw`, no script. Re-check reviewer: fixes 1, 2, 4 and case-insensitive Space Top ✅, no new findings (audit file updated).
