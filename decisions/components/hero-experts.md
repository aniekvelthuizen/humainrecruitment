# Hero Experts (`Hero Experts`, group Sections) and Logo Marquee (`Logo Marquee`, group Visual)

Plan: `references/plans/2026-10-31-home-hero.md`. Figma spec: `references/figma/home-hero/spec.md`. Checks: `node references/hero-check.mjs [url] [outdir]`. Review: `references/audit/2026-10-31-home-hero.md`. Built by Aniek Velthuizen with Claude.
Hero Experts **`270bcc7c-6cbe-58e6-f99b-56e9dccd110a`** (the first build `598c44e8-…` was unlinked, rebuilt and unregistered on 2026-10-31); Logo Marquee `5f31b436-355c-d85d-b464-988f9288176f`. Figma `Header / Home v01` type=variant3 (`2710:45629`), `Content / Logo marquee`.

## 2026-10-31 — Names describe the pattern
Choice: the section is **Hero Experts** (`hero-experts_*`): a hero with an expert switcher and logos. The logo row is **Logo Marquee** (`logo-marquee_*`), its own component because Clients and How it works draw the same row.

## 2026-10-31 — Plain section, not the Lumos `Section` component (deviation from the kit)
Conflict: the kit builds every section as wrapper › Lumos `Section` › slots. The API cannot address anything inside a Lumos slot of a definition, so the Card Expert, Slider, Logo Marquee and button props could not be set after closing it into a component.
Choice: `section.hero-experts_wrap.u-theme-brand` (`data-section="dark"`, `data-hero-experts`) › `hero-experts_contain.u-container` › `hero-experts_layout` › content + **stage**; then `hero-experts_experts` › `hero-experts_track` (mask) › `hero-experts_experts-contain.u-container` › Lumos `Slider`, plus `hero-experts_arrows.u-container` › 2 buttons; then `Logo Marquee`; then a CSS + JS embed. Same route as the Footer.

## 2026-10-31 — Colours and gradient
- Theme **Brand** on the wrap: white text; `Button Main` Secondary turns white by itself.
- Background: the footer's gradient. Theme variables renamed `footer/gradient-*` → **`gradient/brand-start | brand-middle | brand-end`** (same ids; `decisions/site.md`).
- Muted text: `hero-experts_muted`, opacity 0.5. Contrast of «pre-qualified specialists…» (2.3–2.7 : 1) and «TRUSTED BY…» on the pink end: **kept as Figma (owner, 2026-10-31)**.

## 2026-10-31 — Title is the site H1 (owner)
`u-text-style-h1` (owner). At 1512 the 558 px column wrapped it in 4 lines (Figma 3); hero 1125 high (Figma 1019).

## 2026-11-01 — Wider title column (owner)
Owner: "Pre-Qualified Project" must fit on line 1. The line needs 9.45 em (567 px at 60 px), Figma's column is 558. From 1280 the content column is **36rem and does not shrink** (`flex-shrink 0`); the stage gives the room. Measured: 3 lines at 1280, 1440, 1512, 1920 (as Figma); stage 562 px at 1280, 776 at 1512.

## 2026-10-31 — Expert switcher (owner request after the first review)
Owner: the arrows from Figma must work; a selected card ends in the middle, and the photo and content above change to that expert.
- **Stage:** `hero-experts_stage` (grid, one cell, `data-hero-experts-stage`) holds one `hero-experts_panel` per expert, same order as the slider cards (since 2026-11-01 from the CMS, see below). Each panel = `hero-experts_visual` (photo) + `hero-experts_aside` (`Card Expert` Expert + quote).
- **Script** (hero embed): waits for the Lumos Swiper, then turns on `loop` (Swiper 8 `loopCreate`: the 5 cards are cloned once on each side, clones `aria-hidden`), `centeredSlides` at **every** width and `slideToClickedSlide`; starts on the middle card at every width (2026-11-01: computed from the number of experts), and on every `slideChange` moves `data-active` to the panel of `realIndex` (others `aria-hidden` + `inert`). The embed CSS cross-fades the panels (opacity/visibility 0.4 s).
- **Infinite and centred (owner, 2026-11-01):** the row loops both ways, so the arrows never disable; the selected card sits in the middle of the screen on phones too (the 2026-10-31 phone start on card 1 is gone: with the loop no card is hidden at the start).
- **Selected card is white (owner, 2026-11-01):** the Lumos Slider marks the active slide `is-active`; the embed gives `.card_expert_wrap.is-active .card_expert_group` the Match Glass hover values (white, dark text, colour photo, dark logo). On touch screens (`hover: none`) the hover look is reset to the glass values on every card that is not selected (owner: hover does nothing on a phone).
- **Arrows:** the Lumos Slider's own controls are off (Controls prop). Two real `<button>`s (`data-hero-experts-prev|next`, aria-labels "Previous / Next expert", `Icon Set` Chevron Right, the left one mirrored by `hero-experts_arrow-icon.is-prev`) in `hero-experts_arrows.u-container`, an unmasked layer over the row: flush with the container edges (−0.625rem), 44 × 44 tap area, focus ring on `:focus-visible`. Hidden below 768 and on touch screens (swipe).
- **Arrow hover (owner, 2026-11-01):** the buttons carry `data-trigger="hover focus"`; the icon nudges 0.25rem outward with the same Lumos trigger variable, duration and easing as `button_main_icon` (in 450 ms / out 250 ms); `is-prev` = `scaleX(-1) translateX(…)`, so it moves left. Measured: next +4 px, prev −4 px.
- **Edge fade:** mask-image on `hero-experts_track` (full width), transparent 5.75 % → opaque 27.9 %–72.1 % → transparent 94.25 % (Figma mask 87 → 1425); off below 768. The first try (mask on the Swiper element with `mask-clip: no-clip`) cut the row off; not used.
- Cards a fixed **322 px** (`21.125rem` incl. the gap) at every width (embed: Lumos per-view counts made them 219 px at 991), `cursor: pointer`. Their hover (white) now means "select".
- **Content still placeholder:** see "Experts come from the CMS" below.

## 2026-10-31 — Layout per width
- **< 1280** (burger nav): stacked — text full width, then the stage (photo left, card + quote right, both shrinking). Top padding `10rem` on the wrap.
- **≥ 1280** (Webflow `large`): three columns (content 36rem without shrinking, stage 49.656rem with flex-shrink 2). Top padding `12.9375rem` (title cap at 207 as Figma).
- **< 768:** stage hidden (owner: Home B mobile order), slider centred and looping (selected card in the middle, neighbours peeking both sides), no fade, no arrows.
- Spacing literals that equal a step are linked: gaps `space/7` / `space/8` / `space/4`, text margin `space/8`; quote weight `font/primary-semibold`, line-height `line-height/heading`.

## 2026-10-31 — Expert card corners and notch
`Card Expert` (Expert) in the panels: Wrapper Classes `u-theme-light` (white card, dark text in a Brand section) + **Wrapper Style `background-color: transparent;`** — `u-theme-light` painted the wrap white, which filled the rounded corners and the notch. The notch arrow follows the section (white): embed sets `--_theme---text` to `swatch/light-100` on `.card_expert_corner` inside the stage. Expert names stay `<p>` (owner: no H3 needed).

## 2026-10-31 — Photo
Willem Jan: cut-out transparent PNG (`photo-hero-expert.png`, 645 × 807) as a plain `img.hero-experts_photo` (not Lumos `Visual Image`, whose grey placeholder would show through). Fade: mask-image 180deg, black 50 % → transparent 95 % (Figma mask).

## 2026-10-31 — Quote (owner)
Lorem ipsum stays as a placeholder. `Icon Set` Quote in `hero-experts_quote-icon` (15.24 × 11.24, at 0 / 3.5), the text indented 1.5rem.

## 2026-10-31 — Props
Hero Experts: Text (Content). Title (two-tone span), buttons and logos are edited inside the component; the experts (row cards and panels) come from the CMS collection Experts (2026-11-01).

## 2026-10-31 — Logo Marquee
- `logo-marquee_wrap` (`data-logo-marquee`) › title p (Text Main, centred; **Title prop**) › `logo-marquee_track` (`data-logo-marquee-track`) › `logo-marquee_list` (`data-logo-marquee-list`, role list) › 8 × `Logo Tile` (Role prop off = `role="listitem"`); CSS + JS embed at the end.
- The script clones the list until the lists cover the track plus one list (3 lists at 1512 and 2560), re-runs on resize, on every logo image load and when the tab becomes visible; clones carry `data-logo-marquee-clone`, `aria-hidden`, no roles, empty alts. Each list animates `translateX(0 → -100%)` in **40 s** linear (≈ 35 px/s); after every fill the clones' animation time is set to the original's (`getAnimations()[0].currentTime`), so clones added later (slow load, resize) run in step — the re-review found 140–700 px gaps without it.
- Tiles 2.86 px apart (`0.17875rem` gap + end padding): Figma's 177.86 px tile holds a 175 px logo.
- Reduced motion: no animation, clones hidden, the logos wrap centred (all 8 visible on a phone).
- No pause control (owner, 2026-10-31). Title line height stays Text Main 150 % (Figma 130 %): a raw line-height on the class breaks the site's text trim.
- Spacing: padding-top `space/8` (phone `space/7` top and bottom), title → logos 5 px, phone title padding `site/margin`.

## 2026-10-31 — Nav is narrower than the site container above 1512 (solved 2026-11-01, see nav.md)
Measured: up to 1512 the hero text lines up with the nav. Wider, the nav content stays 1384 px wide while the hero, the footer and every `u-container` section are 1512 px (e.g. 1920: nav from x 268, hero/footer from x 204). The nav is the odd one out, so the nav gets widened to `u-container` — in its own session (owner: nav changes in a separate chat). The hero is not narrowed.

## 2026-11-01 — Experts come from the CMS (owner)
Owner chose a CMS collection over editing the cards inside the component. Built by Aniek Velthuizen with Claude.
- **Collection `Experts`** (`6ae719db261aa6a726507c82`, slug `experts`, English per house rule): Name, Slug, Company (also the logo alt), Company Logo, Photo (row card), Hero Photo (cut-out, large above the row), Bullet 1–3, Match Score (plain text, number only), Quote, Order (number), Show in Hero (switch). Help texts on every field. Items (published): Emery Dokidis 1, Willem Jan Velthuizen 2, Chance Dorwart 3 — Figma's names; bullets, 85 and the lorem quote are still the same placeholder for all three; Emery/Chance have no cut-out, their Hero Photo is the card photo. Creating the collection also made an Experts template page (unused, empty).
- **Two list components** (group Sections), both Experts with filter Show in Hero = on and sort Order ascending, so they always hold the same items in the same order:
  - `Expert Row List` (`b32fc929-59bc-2285-6a38-23f5036e4faf`): item › `Card Expert` Match Glass, Name / Photo / Logo / Logo Alt bound, list off. Sits in the Lumos `Slider` slot; the Lumos slider script already lifts cards out of a `w-dyn-list`.
  - `Expert Panel List` (`1f5eb399-05d7-b7d9-1238-4a51d4a9afe1`): wrapper, list and item `u-display-contents` (panels stay grid items of `hero-experts_stage`); item › `hero-experts_panel` (`data-hero-experts-panel`) › visual (img bound to Hero Photo, alt = Name) + aside (`Card Expert` Expert: Name, Logo, Logo Alt, Score bound, 3 `Card Bullet`s bound to Bullet 1–3, Link /hire-an-expert, Screen Reader Text "Hire an expert", Wrapper Classes `u-theme-light`, Wrapper Style transparent; quote icon; quote text bound to Quote).
- Route (kit: a Collection List cannot be set up inside a definition): lists built and bound on Home in `page_wrap`, **Create component** in the Designer (Claude in Chrome), then inserted into Hero Experts; the old 5 cards (in a fresh Slider: the old one's slot children have no ids) and 5 panels removed.
- API lessons: source, sort **and filter** must go in one write — a filter added later gave "[Conflict] component map" (list rebuilt). Filter shape `{"fieldSlug":"show-in-hero","operator":"isOn"}`.
- Script after the review (2026-11-01): 1 expert = no loop and no arrows; 2+ = loop with at least 5 clones per side (`loopedSlides` max(n,5), `loopAdditionalSlides` 0, `loopedSlidesLimit` false), so 2 experts fill the row too; clones no longer get Lumos' `is-active` (`slideDuplicateActiveClass` back to Swiper's), so only the selected card is white; the list roles in the stage are removed (screen readers heard a list of 1). Hero Photo loads `eager` (top image of Home). Tested by removing items in headless Chrome: 1, 2 and 3 experts stay in sync, one white card in the row.
- Script: panels are numbered by order (no index attribute), the start is the **middle** expert (`floor((n−1)/2)`, Willem Jan with 3), set before Swiper is ready so the right panel shows at once; `data-hero-experts-start` removed. Non-active panels only hide while one is active (Designer shows them stacked).
- **Editing:** CMS › Experts: add an item, fill every field, Show in Hero on, give it an Order; publish. Nothing to change in the Designer.
- Verified on staging: row and panel always show the same expert (start Willem Jan; next ×4 → Chance; prev ×7 → Willem Jan; mouse click → Chance; swipe at 402 → Chance), 9 slides (3 + clones), no sideways scroll 2560–402, no console errors; 1512 layout as before (title 3 lines, hero 1050).

## 2026-11-01 — Card Expert name and score are plain text (for the CMS)
A CMS plain-text field cannot bind to a rich-text prop. In `Card Expert` the Name (Typography Heading) and Score (Typography Paragraph) became **Typography Plain** inside holder divs with the old classes: `card_expert_title` + `u-text-trim-off`, `card_expert_number` + `u-text-trim-off` (empty combos created, as `card_bullet_text` has: the bare name was ambiguous for the API). Props Name (folder Content) and Score (folder Score) recreated as plain text with the same names and defaults; the score Plain gets Style `font-size/line-height/font-weight: inherit` (the value row sets 1.5rem). Names are now `p.u-text` on every card. In the hero they were already `<p>` (owner); on Example Components the Typography Heading rendered `<h3>` — that heading is gone (owner's call: keep `<p>`, or give the name holder a heading role).
- Recreating the props wiped overrides: Example Components' Match card score restored to "85%"; the hero instances were replaced by the CMS anyway.
- The header had a native "Name is set" condition; removing the old prop turned it into a static Hidden (kit warning) — set to always visible (Name is required).
- Measured on Example Components (card-check before/after, 1512 and 402): Expert, Match and Match Glass card sizes and every text box identical; texts identical.

## 2026-11-01 — Known limits of the CMS hero (from the review)
- Row card and panel are paired only by position in two Collection Lists with the same filter and sort. Change the filter, sort or limit of one list and the other must get the same, or the wrong panel shows. Editors only work in the CMS, so this stays as is.
- During the 0.4 s cross-fade two names and a greyish card show on top of each other (also before the CMS) — owner's call.
- With 3 experts the same people appear twice in one row at 1512 and wider (loop) — owner's call: more experts or fine as is.
- The score's inline Style (`font: inherit` parts) on the Typography Plain is needed (without it 24 px → 16 px).
