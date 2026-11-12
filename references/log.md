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
- 2026-11-02: staging moved to humain-dev.webflow.io (project.json, CLAUDE.md, site.md); Split Content re-measured there, unchanged. Owner tested and approved: block done, merged to main.

## 2026-11-01 — Home «Our method» (Sticky Steps + Card Primary Process) — Aniek Velthuizen with Claude
- Figma `Content scrolly telling / Glass cards` (Home B `2710:48618`) read in Claude in Chrome with the Plugin API (Figma MCP at its call limit); tree + pictures in `references/figma/home-method/` (exported through a local receiver on port 8766; 8765 belonged to another session). Plan `references/plans/2026-11-01-home-method.md`. Owner: intro sticky, cards stack over each other; button target not answered → `/how-it-works`.
- Card Primary variant **Process** (duplicate of Glass): number ring via the Eyebrow part, pill + checklist optional, Text Medium body (`decisions/components/cards.md`).
- Section **Sticky Steps** (`73b7ce70-…`, group Sections): built in `page_wrap`, transformed, slot **Steps** + props Eyebrow / Title / Title Accent / Text / Button Text / Button Link in the definition (builder now works inside definitions), moved into `page_main` after Stagger Cards. 3 cards placed in the slot in the Designer (API cannot fill an empty instance slot), props through the API, titles H3 in the Designer. Sticky + stack + tilt in a CSS embed.
- Refused by the session's safety check: Theme `heading-accent` Brand → mint (shared variable). Accent via `swatch/brand-accent-500` on `sticky-steps_accent`; open for the owner.
- Published to staging 4×. `references/steps-check.mjs` at 1512 / 1280 / 991 / 767 / 402: intro within 1 px of Figma (trimmed), cards 687 × 204 / 177, 176 between, card insides = Figma, stack holds (cards land at the same top), no sideways scroll, 3 × h3, no console errors. Title breaks differently (site-wide `text-wrap: balance`), section 73 px shorter than the frame (Figma counts rotated bounds).
- Review (fresh agent, `references/audit/2026-11-01-sticky-steps.md`), owner chose the recommended points: hold space after the last card (full stack now held ~350 px), Process + pill + checklist on Example Components (pill 31 → 26), embed trimmed + `u-embed-css`, columns shrink 992–1512, Button Link default as page How It Works and slot tooltip (Designer), icons off on the Home cards. Accepted: inline weight on the eyebrow text, title space in CSS only. Published to staging 2× more; re-measured at 1512 / 1100 / 992 / 991 / 402, no sideways scroll.
- Sticky Steps, owner feedback (Aniek): stacked cards too white, text hard to read. Cause: three 20 % glass layers adding up (~49 % white). Fix: covered cards fade their tint and text by the overlap (script + CSS in the section embed, `--sticky-steps-cover`). Published 2×; card 3 in the held stack now (56,138,173) vs design (51,150,180), even across the card, 1512 and 402. Figma memory corrected: the MCP account is aniek@cutthecode.com on a View seat (call limit); Chrome uses aniekvelthuizen@gmail.com.

## 2026-11-02 — Home «Expertise», plan only — Aniek Velthuizen with Claude
- Figma `Content / Services` (`2323:32509`) read: one `get_metadata` through the MCP, then its View-seat limit; the rest in Claude in Chrome with the Plugin API (local receiver on port 8767). Spec, pictures and the cut-out photo in `references/figma/home-expertise/`.
- Only `type=expertise` is on Home B; the tab variant is Home A only — owner: not built. Plan `references/plans/2026-11-02-home-expertise.md`: new section **Spotlight Grid**, Card Primary Discipline ×6, `gradient/brand-*` panel.
- Not built: the local `webflow`, the claude.ai Webflow and the Studijob connectors all answer 404 for site `6ae35364a38b2d71cab8c607`. Needs a connector on the Humain workspace.

## 2026-11-02 — Home «CTA» planned, build blocked — Aniek Velthuizen with Claude
- Figma `Content / CTA` (`2323:32532`, set `2382:37326`) read in Claude in Chrome with the Plugin API (Figma MCP at its View-seat call limit); tree, instance overrides, pictures and the photo in `references/figma/home-cta/` (local receiver on 127.0.0.1:8771). 13 desktop + 2 mobile instances; Home B `2710:48623`.
- Plan `references/plans/2026-11-02-home-cta.md`, decisions `decisions/components/cta-split.md`: new section **CTA Split**, Button Main ×2, Visual Image, after Split Content #2.
- Not built: all three Webflow connectors answer 404 for site `6ae35364a38b2d71cab8c607` (local `webflow`: Core / THDV / Wayfinder; claude.ai: Buitencampus; `webflow-studijob`: Studijob).

## 2026-11-02 — Hero intro, autoplay, calmer switch (Aniek Velthuizen, via Claude)
- Staging moved to humain-dev.webflow.io (another session); the claude.ai Webflow connector was signed in to Buitencampus for a while and is back on Humain. `hero-check.mjs` now points at humain-dev.
- New component `Global | Custom Code` (top of `page_wrap` on Home) with the hero intro CSS and the panel gate. Reveal attributes on the hero parts; wrappers for card and logos.
- Hero embed: autoplay 6 s (stops on touch, pauses on hover / out of view), staggered switch, start at DOMContentLoaded.
- Tested first on a patched copy of the live page, then published 1×. Measured: no wrong panel and no row jump in any frame (1512, 402, slow); timings as planned; layout unchanged. Records: `decisions/motion.md`, hero-experts.md.
- Review (fresh agent, published Home): 3 broken on a very slow connection / reduced motion (stacked panels and uncentred row after the 3 s time-out, row blink, row missing with reduced motion + no Swiper), nav fading in dark, Tab/Space stopped autoplay, PageDown moved the slider, autoplay ran with only the logos in view. All fixed: CSS-only middle panel, release on page load, nav waits for `data-nav-theme`, ← → only, `pageUpDown` off, observer on stage + row. Re-measured on a patched copy (normal, Swiper +4 s, very slow, very slow + reduced): clean. Published with the Rich Content session's publish; re-measured on staging (same scenarios, plus Tab, PageDown, ← → and logos-only), and the hero layout again after their rich-text restore: unchanged. Owner: hero Home done (2026-11-02).

## 2026-11-02 — Content / WYSIWYG as Rich Content (Privacy & Cookies) — Aniek Velthuizen with Claude
- Figma `Content / WYSIWYG` (`2444:35732`, component `2444:35717`) read in Claude in Chrome with the Plugin API (Figma MCP at its View-seat limit); tree and pictures in `references/figma/content-wysiwyg/`. Plan `references/plans/2026-11-02-content-wysiwyg.md`; owner took all three recommendations (H2 in the text at H3 size, legal header later, lorem until copy).
- Webflow through the claude.ai connector (back after a 404 earlier today; the local `webflow` and studijob connectors still 404).
- The page **Privacy & Cookies** (`6ae37d71382b5fd60a01d143`, `/privacy-cookies`) already existed with a Lumos placeholder hero; left in place for the legal header block. Footer link already pointed at it.
- New section component **Rich Content** (`6ca4bdaf-…`, group Sections): 3 classes + combos, prop Content (Rich Text), CSS embed. Placed in `page_main` after the placeholder; 4 × H2 + paragraph (H2s built into the instance's rich text through the API).
- Fixes after the first measure: Lumos trim made the section 119 px short → `u-text-trim-off`; title → text was 16 (margin collapse) → margin-top 0 after an h2.
- Published to staging 2× (announced to the Services, CTA and Hero sessions first). `references/rich-content-check.mjs` at 1512 / 1280 / 991 / 767 / 402: 1512 equals Figma (1204 tall, column 300/912, 0/45/55/205/237), no sideways scroll, no console errors. SEO description set.
- Open: page has no h1 until the legal header is built; Content default for new instances is one plain paragraph (headings in a default are a Designer edit).

## 2026-11-02 — Home «Expertise» built (Spotlight Grid) — Aniek Velthuizen with Claude
- Owner: "Connector staat, bouw". Webflow through the claude.ai connector (`846065a5-…`); the local `webflow` connector still has no Humain.
- Photo `spotlight-expertise-lisette` uploaded (create_asset + S3 POST 201, `6ae8d856812d3edb22206286`), compressed to WebP (757 → 84 KB).
- 21 classes + combos (`spotlight-grid_*`), tree built after `page_main`, transformed into **Spotlight Grid** (`4f869313-…`, group Sections), slots List Start / List End, 9 props bound, moved into `page_main` and Split Content #2 re-appended after it. Six Card Primary Discipline cards inserted through the API (`insert_in_slot` on the page instance works now), props set; titles H3 in the Designer (Claude in Chrome).
- Coordinated with the parallel sessions Content / CTA and Content / WYSIWYG (Home order, 429s, publishes). Published to staging 2×.
- `references/spotlight-check.mjs` at 1512 / 1280 / 992 / 991 / 767 / 402: at 1512 section 1190 (= Figma), header, layout, panel and quote boxes equal Figma; cards 198 (Figma 194, known Discipline height); no sideways scroll; no console errors. Fix after the first measure: Webflow's default figcaption margin (5 px).

## 2026-11-02 — Home «CTA» built (CTA Split) — Aniek Velthuizen with Claude
- Webflow through the claude.ai connector (re-pointed to the Humain workspace by the owner). Photo uploaded (create_asset + S3 POST, 201): `cta-split-colleagues.jpg` (`6ae8d89abe7ead5af35234f6`, 1536 × 1024, 311 KB, alt text on the asset).
- 9 classes + 6 empty combos; section built in `page_wrap`, closed into **CTA Split** (`0a616993-…`, group Sections), 12 props bound (texts, buttons, image, Space Top attribute), moved to the end of `page_main` after the Services session's "Home vrij". Home overrides: «Request a shortlist» / «Discuss your project».
- Fix after the first measure: the title's space span is stored as `&nbsp;` → title 3 lines at 1512; a `wbr` after it restores Figma's 2 lines.
- Published to staging 1× myself (+ two peer publishes carried the changes). `references/cta-check.mjs` at 1512 / 1280 / 1100 / 991 / 767 / 479 / 402: at 1512 every box equals Figma (section 612, card 420, photo 692 × 420), mobile within 1 px, no sideways scroll, no text outside the card, no console errors.
- Coordinated `page_main` order and publishes with the Content / Services and Rich Content sessions.
- Review (fresh agent, `references/audit/2026-11-02-spotlight-grid.md`): no defects at 1512. Fixed: quote default with non-breaking hyphens («go‑to», «high‑quality»), photo shifted `translateX(16%)` below 992 so the person sits under the panel centre (measured 201/201 at 402, 495/495 at 991). Published to staging 1× more. Open for the owner: columns out of step 992–1150, sections not on Example Components, quote person/alt text.
- CTA Split review (fresh reviewer, `references/audit/2026-11-02-cta-split.md`): photo corners were 16 px inside the 8 px card — Visual Image's Corners prop is inverted (off adds `u-radius-main`); set to on, published 1×, re-measured: image radius 0, card 8, boxes at 1512 / 402 unchanged, no console errors. Recorded: embed route and section showcases (site.md), prop folders as Split Content. Waiting for the owner: focus ring on Brand/Dark, tablet line length, hyphen break in the title.

## 2026-11-02 — Rich Content: embed rules to the Designer, global rich-text slip restored — Aniek Velthuizen with Claude
- Owner: move the embed rules to Designer styles (with the list-under-title fix and H3 at the H4 size).
- Links became a Designer nested style on the Rich Content class chain (`text-link/*` colours, underline, hover).
- The H2/H3/p/ul/ol/li edits landed on Lumos' **global** `.u-rich-text <tag>` rules (the Designer reuses the existing nested rule while showing the full chain). Published to staging for ~30 min; the other sessions were warned. Restored in the Designer and diffed against the 19:33 CSS: identical except `.u-rich-text li`, now on live trim variables instead of deleted ones. Webflow dropped 460 dead deleted-variable definitions on that save (only `li` read them).
- Heading/paragraph/list rules back in the section's `u-embed-css` embed (scoped to `.rich-content_text`); H3 now at the H4 size; paragraphs and lists margin-top 0 so a list under a title sits 10 below it (was 2).
- Published to staging 3× (announced). Measured with patched test content at 1512 / 1280 / 991 / 767 / 402: Figma pairs unchanged, title → list 10, H3 30 px, link styles as set, no sideways scroll, no console errors. Note in `references/kit-issues.md` (not filed).

## 2026-11-02 — Nav smaller on phones — Aniek Velthuizen with Claude
- Owner: logo in the mobile nav a bit smaller so the bar gets smaller, hamburger a bit smaller too.
- Small breakpoint (≤ 767) only: bar 74 → 64, panel top padding with it, logo 209 → 176 wide, hamburger 32 × 16 → 28 × 14 (tap area still 44 × 44). Gap through `--nav--hamburger-gap` in the Nav CSS embed (style API refuses custom properties). Record: `decisions/components/nav.md`.
- Published to staging 1×. Measured at 402 / 767 / 768 / 991, closed and open: phone sizes as planned, ✕ centred, tablet unchanged, no sideways scroll, no console errors.
- Owner round 2: logo 8 px less tall on phones → width 7.9375rem (127 × 20.7, was 176 × 28.7). Published to staging 1×; measured 402 / 767 / 768 / 991: phone logo as planned, tablet unchanged, no sideways scroll, no console errors.

## 2026-11-02 — CTA Split owner round 1 + button focus ring — Aniek Velthuizen with Claude
- Owner: photo left / text right also on tablet → card two columns down to 768, stacked ≤ 767 (text first). Measured: 991 photo 452 | text 452, 767 stacked, 1512 unchanged (612 / 420), no sideways scroll, no console errors.
- Owner: light focus ring on purple/dark sections → Clickable variant «Focus Ring Theme» (outline = Theme text) used by Button Main. Measured with Tab: buttons white on Brand, dark on Light, nav follows its bar; cards unchanged. Open: hero Card Expert ring navy on dark (card ring).
- Published to staging 1× (announced to the Services and Rich Content sessions; Rich Content's rich-text slip was restored before). Fresh re-check reviewer dispatched.

## 2026-11-02 — Home «Expertise» closed — Aniek Velthuizen with Claude
- Owner: columns 992–1279 stay as built, "helemaal af zo". Re-measured after the Rich Content rich-text restore (unchanged at 1512 / 991 / 402) and the CTA focus-ring publish (card ring 2 px dark, unchanged). Merged to main.

## 2026-11-02 — Rich Content: fixed H2 title — Aniek Velthuizen with Claude
- Owner: the block must always open with an H2 (SEO). New `rich-content_layout` (57rem column) › `h2.rich-content_title.u-text-style-h3.u-text-trim-off` bound to new prop **Title** › rich text. Privacy page: first title moved from Content to Title.
- Published to staging (announced). `rich-content-check.mjs` (now reads the title too) at 1512 / 1280 / 991 / 767 / 402: identical to before, 4 × h2, no sideways scroll, no console errors.

## 2026-11-02 — Rich Content closed — Aniek Velthuizen with Claude
- Owner tested and approved: block done, merged to main (8f06db4). Open for later: legal page header block (next), real privacy copy, Title above Content in the props panel (Designer drag).
- Re-check reviewer confirmed both owner-round fixes; dead variant CSS from duplicate_variant recorded in site.md.
- Owner: hero expert card focus ring too → CSS-only embed in Hero Experts (white ring for `.card_expert_wrap` links inside `[data-hero-experts]`). Published 1× (announced to the Services session; Rich Content session had closed). Measured with Tab: stage card ring white on the hero, buttons unchanged.

## 2026-11-02 — Home «Testimonials» (Spotlight Grid › Reviews) — Aniek Velthuizen with Claude
- Figma `Content / Testimonials` (`2323:32727`) read in Claude in Chrome (Plugin API; Figma MCP View seat at its limit after 1 call). Dump + exports via a local receiver in `references/figma/home-testimonials/`. Plan `references/plans/2026-11-02-home-testimonials.md`.
- Built as a variant **Reviews** of Spotlight Grid (same header + three columns around the gradient panel) instead of a new section: new center column with slot List Center (panel moved into it, tablet rules moved along), optional Text / Rating / Button (toggles off), title break class; Reviews = grey `swatch/light-200`, top 192/96, no quote, 440 panel with centred cut-out, stacked below 992, 20 gaps below 768. Card Testimonial × 3 (two new avatars, photo uploaded; S3 201), Card Testimonial padding 20 below 768.
- Placed on Home after Expertise (append + re-append Split Content #2 and CTA Split); Split Content #2 Space Top none → large.
- Published to staging 3×. `testimonials-check.mjs` (new): 1512 = Figma except the known +6 px card height; 402 order/widths/gaps = mobile frame; no sideways scroll at 1512/1280/992/991/767/402; no console errors. `spotlight-check.mjs`: Expertise identical before/after at all six widths.
- Open: Card Testimonial `role="listitem"` condition does not render (queued); slot names / Allowed components (queued); photo is a 446 KB PNG (WebP compression replaces the file in place — not done without an OK).

## 2026-11-02 — Split Content Visual slot, Score Chart, Step List — Aniek Velthuizen with Claude
- Owner: build Figma «Content / Final score» and «Content / Trust statement» (Project Delivery Experts) as a variant of Split Content with the chart / steps in a slot instead of the photo. Plan: `references/plans/2026-11-02-split-visual-slot.md`.
- Split Content: slot **Visual** (filled slot hides the photo, empty slot hides itself), prop **Glow** (Stagger Cards mint glow), empty button row hidden. Home's two instances re-measured against a baseline taken before the change: identical at 1512 / 991 / 402.
- New: **Score Chart** + **Score Item** (bar drawn from the weights by a small embed script, colours by position via Theme `chart/color-1…7`, new swatches `chart-purple`, `chart-blue`), **Step List** + **Step Item** (CSS counter numbers, Theme `badge/background`). Nested slots filled through the API (`insert_in_slot` with nested `slots`) — no Designer step needed.
- Project Delivery Experts: both blocks at the end of `page_main` (after the template placeholder Section). Published to staging 2× (announced to the CTA and Services sessions). `visual-slot-check.mjs` at 1512 / 1280 / 991 / 767 / 479 / 402: bar segments 169/101/68/34/135/101/68 and legend rows = Figma, step rows 90 / 100 apart, no sideways scroll, no console errors. Heights 658 / 808 at 1512 (Figma 668 / 773: agreed H2 48 and narrower text column).
- Review (fresh agent, published HTML only): 1512 and 402 within 2 px of Figma bar the known card height; Expertise unchanged; no overflow 320–1512. Fixed: tablet column capped at 40rem, hidden quote copy cleared. Published 1×, re-measured 402 / 767 / 900 / 991 / 1512. Owner questions in spotlight-grid.md.

## 2026-11-02 — Testimonials: owner round — Aniek Velthuizen with Claude
- Owner: block good, only the card hover too minimal. Card Testimonial now hovers like the other cards: mint veil, 0.25rem lift, quote mark turns dark (overlay), arrow nudge as before; also on keyboard focus. Measured with `testimonial-hover-check.mjs` (new) on all three cards.
- `role="listitem"`: the Home cards were on Role's default (On = None); set to List Item through the API, staging renders it. Queue item closed — no Designer change needed (the Designer was opened, only read).
- Published to staging 3× (announced to the Split Content / Slots session).

## 2026-11-02 — Testimonials closed — Aniek Velthuizen with Claude
- Owner approved; merged to main (d83971e) via `aniek/home-testimonials` (cherry-picks of the three Testimonials commits only — the Split Content / Score Chart commit 97ff294 on aniek/home-hero is not tested yet, per that session).
- Review (`references/audit/2026-11-02-visual-slot.md`): Split Content no findings; Score Chart legend columns (≥ 15rem each), space under the legend, segment rules into the embed, value parsing; Step List number dark on every theme (`badge/text`), no-op lines removed. Round 2 after the re-check: Safari legend offset (rows 2rem, no margins), «10-15%» parsing. Published to staging 3× more (announced); WebKit + Chrome measured. Not merged: waiting for Aniek's test.

## 2026-11-02 — Score Chart and glow motion — Aniek Velthuizen with Claude
- Owner request: reveal + mouse effect on the Score Chart, glow animates on scroll into view. Exception recorded in `decisions/motion.md`.
- Score Chart: segments grow left to right, rows rise, values count up; hover keeps one row + segment, dims the rest. Split Content: glow rises in (only with Glow on). Script and style in separate embeds per component; sources in `references/embeds/`.
- First publish: rows faded *out* before the reveal (transition also on the hide step) → transitions only in the `in` state. Published to staging 2×. Headless Chrome 3 runs: hidden before the reveal, bar complete at ~0.9 s, everything final at ~1.4 s with the original texts, glow complete at ~1.6 s, hover 1 / 0.35, reduced motion static, no console errors.
- Owner: glow animation off («niet te zien met blote oog, niet per se mooi») → Split Content script embed removed, style embed back to the static glow. Published to staging.
- 2026-11-03: fresh motion reviewer stopped on a server error, but its lead held: in WebKit at 402 the first block was 833 high until the reveal and 825 after (the rows' 8 px rise grew the one-column legend). Rows now only fade. WebKit 402 / 767 / 1512: height constant before, during and after; Chrome reveal, hover and reduced motion unchanged; published to staging.

## 2026-11-05 — Split Content Visual, Score Chart, Step List closed — Aniek Velthuizen with Claude
- Owner tested on staging (Project Delivery Experts) and approved; merged to main. No change on the site since the 2026-11-03 publish. Still open on that page: the Figma sections above the two blocks are not built.

## 2026-11-05 — Rest of the site built and composed — Aniek Velthuizen with Claude
- All components from Figma's `Components` section and all 15 pages are on staging (humain-dev.webflow.io), as orchestrated subagents: plan `references/plans/2026-11-05-rest-of-site.md`, rules `references/plans/2026-11-05-agent-brief.md`. Large footer and old-homepage tabs stay out (owner).
- New: Page Header, Sticky Steps Plain + Process Step, Stage Slider, Card Grid, Facts Row, Values Grid, Pricing Row, Stagger Gradient, Form Section; from the CMS Team Grid, Team Fan, Cases Grid, Fee List, FAQ List, Opportunity List, Opportunity Detail, Opportunity Row, Vacancy List. Collections Opportunities, Cases, Rates, FAQ, Team.
- Card titles on Card Primary, Profile and Opportunity are plain text with a fixed H3. Form error state moved to `Global | Custom Code`. Webflow publishes variant-scoped `::before`/`::after` as an empty `:where()`: use the embed (`decisions/site.md`).
- Designer pass done in one step (Claude in Chrome): 8 list components, conditions, file inputs, folders, Allowed components (`references/designer-queue.md`).
- Reviews: `references/audit/2026-11-05-phase-1.md`, `-phase-2.md`, `-phase-4.md`, `-phase-6.md`; regression scripts clean on Home. Not checked: Safari, real touch devices, a real form submission or upload.
- Owner list: `references/audit/2026-11-05-owner-list.md`. Not live; staging only.

## 2026-11-12 — Favicon and webclip — Aniek Velthuizen with Claude
- Owner request. Site settings › Icons (Claude in Chrome): one upload of `references/assets/icons/webclip-256.png`, applied to Favicon light, Favicon dark and Webclip. Record: `decisions/site.md`.
- Published to staging 1× (claude.ai Webflow connector; the local `webflow` MCP returns 404 for this site). Staging HTML carries icon links 32 (light + dark), 48, 192, 512 and apple-touch-icon 180.
- Owner round: dark-mode favicon replaced with the owner's lighter version (`webclip-dark-256.png`, Favicon dark slot only). Published to staging 1×; staging HTML: light 32 = original, dark 32 = new file.

## 2026-11-12 — SEO titles and descriptions, static pages — Aniek Velthuizen with Claude
- Owner request after spotting «Website Name» in the tab. 14 public static pages: title + description from the page's own copy, Open Graph "Same as SEO" (`bulk_update_pages`). Record: `decisions/site.md` › SEO.
- Published to staging 1×. `seo-check.mjs`: all 14 titles ≤ 60 and descriptions 120–160, no placeholders, no duplicates; remaining errors are only «no og:image» (not done) and the Opportunities items (no description, no suffix, duplicate titles — CMS SEO fields needed).

## 2026-11-12 — Sticky Steps: no empty space under the stack — Aniek Velthuizen with Claude
- Owner request (screenshot Home "Our method"). Hold block under the last card removed; the list ends at the last card and a script-set tail keeps the intro in place until card 3 lands, then everything moves on together. Record: `decisions/components/sticky-steps.md`.
- Published to staging 1× (claude.ai Webflow connector). Measured headless at 1512 / 1280 / 991 / 767 / 402 on Home, plus How It Works, Consulting, Project Delivery Experts, Submit Resume. Not checked: Safari, real touch devices.

## 2026-11-12 — Arrow link hover (Aniek Velthuizen, via Claude)
- Tertiary + Arrow Right: arrow swaps from left to right on hover; CSS embed added in `Global | Custom Code` (`decisions/motion.md`).
- v2 after owner feedback («rommelig»): own switch instead of the Lumos trigger, so no lift and no underline; arrows and label slide as one, 400 ms both ways. Published to staging.
- Styleguide and Example Components now carry `Global | Custom Code` at the top of `page_wrap` (owner), published to staging; the 4 example links measured OK.

## 2026-11-12 — Two-tone heading sweep (Aniek Velthuizen with Claude)
- Grey part of every two-tone heading starts black and sweeps to grey on scroll into view; third embed in `Global | Custom Code`. Tested on a patched copy of Home first (hero, Split Content), then published to staging. Record: `decisions/motion.md`.
## 2026-11-12 — Quotes reveal word by word — Aniek Velthuizen with Claude
- Owner request: GSAP word stagger on quotes only. Record: `decisions/motion.md` › Exception: quotes.
- Attribute map (revert = remove): `data-quote-reveal=""` on `spotlight-grid_quote-text` (Spotlight Grid `4f869313-…-525a63bf2e43`) and `split-content_quote-text` (Split Content `410b9fa3-…-ddee2f03adfb`).
- Script + CSS in a new, own embed of `Global | Custom Code` (`61fdba5b-e2d3-5b70-a803-be8306cc84a7`). First written into the empty second embed (`ab7c2a2d-…`), but a parallel session (arrow-link hover) wrote its CSS there at the same time and replaced it; that embed is theirs, untouched by this change. Source `references/embeds/quote-reveal-script.html`.

## 2026-11-12 — Home «The risk»: card reveal and moving icons — Aniek Velthuizen with Claude
- Owner feedback: cards rise subtly one by one; clock keeps turning, route arrow and crosses animate, loupe sways. Record: `decisions/motion.md` › 2026-11-12.
- Stagger Cards: + style embed `396ecf23-…`, + script embed `2f7ccac8-…` (sources `references/embeds/stagger-cards-motion-*.html`). Runtime attributes only (`data-stagger-motion`, `data-stagger-in`, `data-stagger-paused`, `data-icon-motion`, `data-icon-part`); no Designer attributes added. Revert: remove both embeds.
- Tested locally (patched staging HTML), then published to staging 2× (second: dash gap fix for two specks before the route draws in). `stagger-motion-check.mjs` at 1440 and 402: cards 0 → 1 in ~0.8 s each, 0.15 s apart; list height unchanged; route drawn by ~1.3 s; loops pause out of view; reduced motion = static and visible; console clean.
- Owner: the route icon's circle did not close. Circle + line now one path (Chrome's `pathLength` on `<circle>` left a gap), dash 1.02 / offset 1.03. Checked at 4× zoom locally and on staging.

## 2026-11-12 — Sticky Steps Plain: steps stick and pile up — Aniek Velthuizen with Claude
- Owner request with two screenshots (Home «From requirement to shortlist in days.»): the steps must stick and end up under each other. Section embed of Sticky Steps (`73b7ce70-…b381`) rewritten from `references/embeds/sticky-steps.html`, read back identical. Record: `decisions/components/sticky-steps.md` › 2026-11-12.
- Published to staging 2× (second: `hold()` on `resize`). Measured at 1512: Home 1930 and How It Works 4400 unchanged, heads at 112 / 209 / 306 (/ 403 / 500), pile and intro leave together; 402: static, no inline styles, How It Works 2344 as before.
- Owner round: no hold under the pile. List `min-height` removed from the section embed, read back identical, published to staging. Home 1635 (was 1930), How It Works 3599 (was 4400); the next section follows as soon as the last step lands. Record: `decisions/components/sticky-steps.md` › «No hold under the Process Step pile».

## 2026-11-12 — Two-tone headings: words one by one (Aniek Velthuizen with Claude)
- Owner: words one by one instead of the sweep, and the turquoise Sticky Steps titles too. Tested on a patched copy of Home (Sticky Steps, light and dark), published to staging, re-checked on How It Works.

## 2026-11-12 — Testimonial cards: entrance — Aniek Velthuizen with Claude
- Owner round: word reveal tried on Card Testimonial text (stagger 0.03), then replaced at the owner's request by a card entrance — quote mark pops, stars light up, text fades as one block, cards 0.15 s apart left to right. Attributes on Card Testimonial (`data-card-reveal` on `card_testimonial_element` `a9dd8c48-…`, `data-card-reveal-part` icon `07f447fb-…` / stars `af02a6ac-…` / text `4c967389-…`); `data-quote-reveal*` removed from the text again. Published to staging 2× more; `quote-reveal-check.mjs` at 1512 / 402: hidden before view, order left to right, heights unchanged, no leftover inline styles, reduced motion static, console clean.

## 2026-11-12 — Stagger Cards motion on every stair section — Aniek Velthuizen with Claude
- Owner: every stair block with these icons gets the same motion. Script runs on every `[data-stagger-cards]`; ICONS + CSS for person-shield, person-check, assignment, list-check, handshake, check-circle, outbound. Same two embeds (`396ecf23-…`, `2f7ccac8-…`); published code on staging is byte-identical to `references/embeds/stagger-cards-motion-*.html`.
- Tested on patched copies of Home, Hire an Expert and How It Works, then published to staging 1×. `SECTION=n node references/stagger-motion-check.mjs` (now takes the section index) on all four sections at 1440 / 402 and reduced motion: all pass, console clean.

## 2026-11-12 — Split Content: Step List block centred (Aniek)
- PDE «Why This Matters»: text and step rows vertically centred via one rule in the Split Content style embed (only with a Step List). Published to staging, measured at 1512. Record: `decisions/components/split-content.md`.

## 2026-11-12 — Sticky Steps glass stack: spacing, last card, flash — Aniek Velthuizen with Claude
- Owner feedback with three PDE screenshots. Section embed `73b7ce70-…b381` rewritten from `references/embeds/sticky-steps.html` (tested first on a patched copy of PDE, Home and Consulting), published to staging 1×, published copy identical. Record: `decisions/components/sticky-steps.md` › «Glass stack: room under the nav, readable last card, no flash».
- The Webflow MCP named `webflow` in this session only reaches other sites (Core, THDV, Wayfinder); the claude.ai Webflow connector reaches Humain.

## 2026-11-12 — Email error message — Aniek Velthuizen with Claude
- Email fields show «Please enter a valid email address» instead of «Please check this field» (`Global | Custom Code`, first embed). Published to staging.

## 2026-11-12 — Two-tone headings reversed: dimmed words light up — Aniek Velthuizen with Claude
- Owner: start dimmed, words light up; also on the Card Grid closing text. Embed `141a108e-…` in `Global | Custom Code` rewritten from `references/embeds/muted-heading-sweep.html` (old version read back first). Record: `decisions/motion.md`.
- Tested on patched copies of Home, How It Works and Project Delivery Experts, published to staging 1×. New `references/muted-heading-check.mjs`: PDE 7/7, Home 9/9, How It Works 4/4 at 1440, PDE at 402; reduced motion static; console clean. Not checked: Safari, real devices.

## 2026-11-12 — Stage Certified: mint on scroll into view (Aniek Velthuizen with Claude)
- Owner: the mint stage cards turn mint only when they come into view, in the slider and the overview (Project Delivery Experts). New embed `6885f746-…` in `Global | Custom Code` (source `references/embeds/stage-certified-glow.html`), published to staging 1×. `stage-glow-check.mjs` at 1440 / 402: white at load, fade on scroll (grid) and on slide (slider), reduced motion static, console clean. Record: `decisions/motion.md`.
- Same day: Card Grid closing statement («Only proven performers reach clients») lights up too (owner). Embed rewritten, published to staging 1×; PDE check at 1440 (8/8) and 402 passes, console clean. The bars moving down is another chat's work, untouched here.
- 2026-11-12 (Aniek, via Claude): Clients — Spotlight Grid Button Visibility off («See all clients» linked to the page itself).

## 2026-11-12 — Header glow rises in on page load — Aniek Velthuizen with Claude
- Owner: prototype on a local copy of Contact («erg tof»), then «integreer op alle pagina's». Record: `decisions/motion.md` › Header glow.
- New (eighth) embed in `Global | Custom Code` (`24fbbfa8-a829-ddf7-dd9c-f6a6c5629743`), source `references/embeds/header-glow-style.html`. Tested on patched copies of 16 pages first, then published to staging 1×.
- `glow-check.mjs` on staging at 1512, at 402 and with reduced motion: 13 headers pass (glow 0 → 1, header heights unchanged); Hire an Expert (Split) and Consulting (Light) untouched. Not checked: Safari, real devices.

## 2026-11-12 — Facts Row figures fly in like the quotes — Aniek Velthuizen with Claude
- Owner asked for the quote word reveal on the Facts Row figures. Record: `decisions/motion.md` › Facts Row figures.
- Quote-reveal embed (`61fdba5b-…` in `Global | Custom Code`) read first (matched the source), then extended with `[data-facts-row] .card_primary_title`; source `references/embeds/quote-reveal-script.html`. `quote-reveal-check.mjs` now includes the figures. Published to staging 1×.
- Check on Hire an Expert at 1512 and 402: figures hidden before view, words in within ~0.75 s, heights unchanged (60 / 38), no leftover inline styles, reduced motion static, console clean. About Us uses the same component, not separately checked; Safari and real devices not checked.
- 2026-11-12 (Aniek, via Claude): Clients — the three Card Testimonials no longer link (Link + Screen Reader Text emptied; they pointed to /clients itself). Staging published, checked in the HTML.
- v2 (owner: «tijdelijk een harde lijn»): slide replaced by a soft-edged mask rising from the bottom edge, plus fade. Frames checked at 0.2 / 0.5 / 1.1 s on a local copy of Contact; embed `24fbbfa8-…` rewritten from the source and published to staging.
- v3 (owner: v2 «alsof het twee keer een gradient omhoog komt», «veel smoother»): no layer or mask any more; the gradient's own last stops animate (registered properties), one ramp. Checked frame values 0–2 s on a local copy of Contact, published to staging; `glow-check.mjs` (now detects the animation on the header itself) passes at 1512, 402 and reduced motion.

## 2026-11-12 — Nav logo spotlight — Aniek Velthuizen with Claude
- Owner chose idea 4 (Spotlight) from logo prototype round 2. Record: `decisions/motion.md` › Nav logo: mint spotlight.
- New fifth embed at the end of `Nav` (`3a2f55f5-1281-c34c-3b3a-8dc3ceb1f585`), source `references/embeds/nav-logo-spotlight.html`, read back identical. Tested first by injecting it into staging pages, then published to staging 1×.
- `logo-spot-check.mjs`: Home, Contact, How It Works, Pricing, Opportunities at 1512; Home at 1024; Home, Contact at 402; reduced motion — all pass, console clean. Styleguide has no Nav. Not checked: Safari, real devices.

## 2026-11-12 — Pricing Row prices fly in like the quotes — Aniek Velthuizen with Claude
- Owner asked for the same reveal on the prices. Record: `decisions/motion.md` › Pricing Row prices.
- Quote-reveal embed re-read (unchanged since the Facts Row write), extended with `[data-pricing-row] .card_primary_number` and a 0.6 s extra wait inside `[data-hero-reveal]`. Published to staging 1×.
- `quote-reveal-check.mjs` on Hire an Expert and Rates at 1512 and 402: prices hidden before view, in within ~0.45 s, heights unchanged (48 / 36), no leftover inline styles, reduced motion static, console clean. Rates on load: row fades in to ~1.0 s, prices follow one by one, done ~1.9 s. Safari and real devices not checked.
- 2026-11-12 (Aniek, via Claude): Reviews CMS collection + component «Reviews · picked» (curated list, Review / Link / Screen Reader Text props); placed in the 3 Reviews slots on Home, Hire an expert and Clients, old cards removed, reviews ticked in the Designer. Staging checked: names and order per slot, links only on Home/Hire. Open: template noindex, slot tooltips.
- v4 (owner: v3 very smooth, but a light band above a darker one): the flat blue band is gone; the one blue stop moves 90 % → 70.19 %. Published to staging; `glow-check.mjs` 13 headers pass at 1512, 402 and reduced motion.
- 2026-11-12 (Aniek, via Claude): Opportunities filter bar — hover border lighter (brand-300) and the box 4 px lower so it sits evenly around the text. Record: `decisions/components/opportunity-list.md`. Staging published 1×, checked at 1512 and 402.
- 2026-11-12 (Aniek, via Claude): Logo Marquee, owner screenshot (How it works: logos standing still, others sliding over them). Lists had separate animations, put in step once; they drifted (measured 2–7 px, seconds when a tab loads in the background). All lists now move as one belt. Embed `5f31b436-…177c` rewritten from `references/embeds/logo-marquee.html`, read back identical; went live on staging with a parallel session's publish (own publish hit the 1/min limit twice). `marquee-check.mjs` on How it works, Home, Clients at 1512 (normal and slow network) and Home at 402: gap 0. Record: `decisions/components/hero-experts.md` › «Marquee: one moving belt». Safari and real devices not checked.

## 2026-11-12 — Upload error without focus ring — Aniek Velthuizen with Claude
- Owner screenshot: black focus box around «Upload failed. Max size for files is 10 MB.». One rule added to the first embed of `Global | Custom Code` (read first), published to staging, checked on /submit-resume. Record: `decisions/components/form-section.md`.
- 2026-11-12 (Aniek, via Claude): Opportunities filter bar — hover brand-200, focus 1 px brand-300 without the 2 px outline (owner: subtler). Staging published 1×, focus checked at 1512.
- Same day: the upload's remove ✕ turns 90° on hover and keyboard focus (owner). Same embed, published to staging, checked. Record: `decisions/motion.md`.
- 2026-11-12 (Aniek, via Claude): review fixes Reviews CMS: Spotlight Grid List Role prop (none on Reviews), root data-display; staging checked.

## 2026-11-12 — Spotlight Grid photo parallax (Aniek, with Claude)
- Owner liked prototype round 2 (`references/prototypes/photo-parallax.html`): against the mouse, slow, Depth variant. Built: attributes `data-photo-parallax` (`spotlight-grid_panel` `4f869313-…-525a63bf2e41`) and `data-photo-parallax-photo` (`spotlight-grid_visual` `…2e4c`) in the Spotlight Grid definition; ninth embed in `Global | Custom Code` (`9991f8f0-…`), read back identical to `references/embeds/photo-parallax.html`. Published to staging 1× (two tries hit the 1-per-minute limit from another session). `parallax-check.mjs` passed. Record: `decisions/motion.md`.
- 2026-11-12 — Aniek (via Claude): active page in nav and footer is semibold (600) instead of underlined; footer had no active style at all. Rules added to the Nav state CSS embed (`a4e65ea1-…`) and the Footer CSS embed (`d8c37aa8-…`), sources `references/embeds/nav-state-style.html` and `footer-style.html` (old code read first). Published to staging 1×; on /clients at 1440 the current nav and footer links are 600 with no underline, others 400. Designer cleanup of the old Current-state underline queued. Records: `decisions/components/nav.md`, `footer.md`.
- 2026-11-12 (Aniek, via Claude): /submit-resume «Why join the pool?» panel sticky — `form-section_aside` sticky ≥ 992 (also Contact's aside). Record: `decisions/components/form-section.md`.

- 2026-11-12 (Aniek): Card Bullet tick aligned to the first line (Text Style mode on the root, icon 1lh high, align top). Published to staging. See decisions/components/cards.md.
- 2026-11-12 (Aniek, via Claude): Spotlight Grid slots: Allowed components (Card Primary, Card Testimonial, Reviews · picked) + tooltips, description; marketer test passed.
- 2026-11-12 — Aniek (via Claude): owner: arrow before the active link. Arrow Right mask as `::before` (0.875em, text colour) on the current nav bar, dropdown and footer links; same two embeds rewritten from the sources, read back, published to staging 1×; checked at 1440 (bar, About us card, footer) and the mobile panel at 402.
- 2026-11-12 (Aniek, via Claude): Form Section column gap +40 px (32 → 72 at 1512), also on Contact. Staging published 1×, checked. Record: `decisions/components/form-section.md`.

## 2026-11-12 — Hire an Expert: Split cards in 3D (Aniek, via Claude)
- Owner: the tilted expert cards turn slowly in 3D and come in one by one on load. Prototyped by injecting CSS on staging, then built: `data-cards-3d` on `page-header_visual` (Page Header `864e1322-…ca626`), rules appended to the Page Header embed (`…ca628`, source `references/embeds/page-header-style.html`, earlier code kept verbatim). Published to staging 1×. Revert: remove the attribute and the «Cards 3D» block. Record: `decisions/motion.md` › «Cards 3D».
- 2026-11-12 (Aniek, via Claude): Stage Slider photo tile (Project Delivery Experts) follows the mouse like the Spotlight Grid photos. Photo-parallax embed `9991f8f0-…` read first (equal to the old source), rewritten from `references/embeds/photo-parallax.html`, read back identical, published to staging 1×. `parallax-check.mjs` (now also tiles, `INJECT=1`) passes on PDE and Home. Record: `decisions/motion.md`.
- Round 2 (owner: cards changed shape, text moved apart): the stack now turns as one rigid plane on `page-header_visual` (perspective + rotate3d before the Webflow tilt, tilt duplicated as `--cards-3d-tilt`); per-card turn and depth removed. Embed rewritten from the source, published to staging 1×.
- 2026-11-12 (Aniek, via Claude): ghost icon buttons fill on hover (Stage Slider arrows, Card Testimonial arrow), chevron nudge kept. Style API + Stage Slider CSS embed; published to staging 1×, measured. Record: `decisions/motion.md` › «Ghost icon buttons fill on hover».
- 2026-11-12 (Aniek, via Claude): Team Fan turns a little while scrolling (down = right); sixth Discipline card Project Director in the CMS; scroll script as a second embed in Team Fan; fan cap ±2.5 steps. Published to staging. Details `decisions/components/team-fan.md`.
- Round 3 (owner: one side higher, uneven space round the photo): skew replaced by a real 3D pose while moving (`--cards-3d-pose`, desktop and ≤ 767), turntable turn ±10°. Embed rewritten from the source, published to staging 1×.
- 2026-11-12 (Aniek, via Claude): Team Fan scroll turn now runs out for about a second after the scroll stops (owner). Published to staging.
- Round 4 (owner): zigzag added (`cards-3d-zig`, ±1rem / 7 s, ≤ 767 ±0.5rem). Embed rewritten from the source, published to staging 2×.
- 2026-11-12 (Aniek, via Claude): owner: turquoise two-tone headings went dimmed → white → turquoise. Now only the `sticky-steps_accent` words dim and light up; the white part stays white. Embed `141a108e-…` read first (equal to the old source), rewritten from `references/embeds/muted-heading-sweep.html`, read back identical, published to staging 1×; `muted-heading-check.mjs` on Consulting Services and How it works passes. Record: `decisions/motion.md`.
- 2026-11-12 (Aniek, via Claude): Contact email and phone clickable — Link Blocks bound to new Email Link / Phone Link props in Form Section; phone placeholder `tel:+31000000000` until the real number. Staging published. Record: `decisions/components/form-section.md`.
- 2026-11-12 (Aniek, via Claude): owner round 2 on turquoise headings: no dimming at all — the whole heading starts white, the turquoise words turn white → turquoise. Embed `141a108e-…` rewritten from the source, read back identical, published to staging 1× (first try hit the 1/min limit). Measured on Consulting Services. Record: `decisions/motion.md`.

## 2026-11-12 — Back link hover: no movement — Aniek Velthuizen with Claude
- Owner: «Back to opportunities» should not move on hover; only underline + colour. Lift and arrow nudge off for Tertiary + Arrow Left via the arrow-link embed (`ab7c2a2d-…` in `Global | Custom Code`), read back identical to `references/embeds/arrow-link-style.html`. Record: `decisions/motion.md` › Back link.
- 2026-11-12 (Aniek, via Claude): Opportunities filter bar — Search button replaced by Reset (Secondary), cross in the search field to empty it; phone bar loses its round search button. Record: `decisions/components/opportunity-list.md`. Staging published 1×, checked at 1512, 1100 and 402.
- Same day (owner): back link underline now grows right and shrinks back left like the nav/footer links (fixed left origin on `.button_main_line`), same embed, published to staging.
- 2026-11-12 (Aniek, via Claude): Contact email/phone links get the footer's growing hover line (owner); trim-off added to the links so Email/Phone match Office/Hours again. Staging published, measured. Record: `decisions/components/form-section.md`.
- 2026-11-12 (Aniek, via Claude): Contact link line ran past the text (owner); `align-self: flex-start` on `form-section_detail-link`. Staging published, measured at 1024 and 375.
