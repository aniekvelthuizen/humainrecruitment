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
`u-text-style-h1` (owner). At 1512 the 558 px column wraps it in 4 lines (Figma 3); hero 1125 high (Figma 1019).

## 2026-10-31 — Expert switcher (owner request after the first review)
Owner: the arrows from Figma must work; a selected card ends in the middle, and the photo and content above change to that expert.
- **Stage:** `hero-experts_stage` (grid, one cell, `data-hero-experts-stage`) holds 5 `hero-experts_panel`s (`data-hero-experts-panel="0…4"`, one per slider card, same order). Each panel = `hero-experts_visual` (photo) + `hero-experts_aside` (`Card Expert` Expert + quote). Panel 2 carries `data-active` in the markup, so without the script (and in the Designer) Willem Jan shows, as Figma.
- **Script** (hero embed): waits for the Lumos Swiper, sets `centeredSlides` (≥ 768 only) and `slideToClickedSlide`, starts on `data-hero-experts-start="2"` (Figma's middle card), and on every `slideChange` moves `data-active` to the matching panel (others `aria-hidden` + `inert`). The embed CSS cross-fades the panels (opacity/visibility 0.4 s).
- **Arrows:** the Lumos Slider's own controls are off (Controls prop). Two real `<button>`s (`data-hero-experts-prev|next`, aria-labels "Previous / Next expert", `Icon Set` Chevron Right, the left one mirrored by `hero-experts_arrow-icon.is-prev`) in `hero-experts_arrows.u-container`, an unmasked layer over the row: flush with the container edges (−0.625rem), 44 × 44 tap area, 30 % when disabled, focus ring on `:focus-visible`. Hidden below 768 and on touch screens (swipe).
- **Edge fade:** mask-image on `hero-experts_track` (full width), transparent 5.75 % → opaque 27.9 %–72.1 % → transparent 94.25 % (Figma mask 87 → 1425); off below 768. The first try (mask on the Swiper element with `mask-clip: no-clip`) cut the row off; not used.
- Cards a fixed **322 px** (`21.125rem` incl. the gap) at every width (embed: Lumos per-view counts made them 219 px at 991), `cursor: pointer`. Their hover (white) now means "select".
- **Content still placeholder:** panels 1 (Emery Dokidis) and 3 (Chance Dorwart) use the rectangular card photos (no cut-outs exist); all 5 panels share Google, the 3 bullets, 85 % and the lorem quote. Panels 0, 2, 4 are Willem Jan (Figma repeats him).

## 2026-10-31 — Layout per width
- **< 1280** (burger nav): stacked — text full width, then the stage (photo left, card + quote right, both shrinking). Top padding `10rem` on the wrap.
- **≥ 1280** (Webflow `large`): three columns (content 34.875rem, stage 49.656rem with flex-shrink 2 so the buttons stay on one row at 1280). Top padding `12.9375rem` (title cap at 207 as Figma).
- **< 768:** stage hidden (owner: Home B mobile order), slider not centred (first card at the edge, next one peeking), no fade, no arrows.
- Spacing literals that equal a step are linked: gaps `space/7` / `space/8` / `space/4`, text margin `space/8`; quote weight `font/primary-semibold`, line-height `line-height/heading`.

## 2026-10-31 — Expert card corners and notch
`Card Expert` (Expert) in the panels: Wrapper Classes `u-theme-light` (white card, dark text in a Brand section) + **Wrapper Style `background-color: transparent;`** — `u-theme-light` painted the wrap white, which filled the rounded corners and the notch. The notch arrow follows the section (white): embed sets `--_theme---text` to `swatch/light-100` on `.card_expert_corner` inside the stage. Expert names stay `<p>` (owner: no H3 needed).

## 2026-10-31 — Photo
Willem Jan: cut-out transparent PNG (`photo-hero-expert.png`, 645 × 807) as a plain `img.hero-experts_photo` (not Lumos `Visual Image`, whose grey placeholder would show through). Fade: mask-image 180deg, black 50 % → transparent 95 % (Figma mask).

## 2026-10-31 — Quote (owner)
Lorem ipsum stays as a placeholder. `Icon Set` Quote in `hero-experts_quote-icon` (15.24 × 11.24, at 0 / 3.5), the text indented 1.5rem.

## 2026-10-31 — Props
Hero Experts: Text (Content). Everything else (title with its two-tone span, buttons, panels, cards, logos) is edited inside the component; the panels are 5 fixed blocks, so a new expert = a new panel + a new slider card in the same position.

## 2026-10-31 — Logo Marquee
- `logo-marquee_wrap` (`data-logo-marquee`) › title p (Text Main, centred; **Title prop**) › `logo-marquee_track` (`data-logo-marquee-track`) › `logo-marquee_list` (`data-logo-marquee-list`, role list) › 8 × `Logo Tile` (Role prop off = `role="listitem"`); CSS + JS embed at the end.
- The script clones the list until the lists cover the track plus one list (3 lists at 1512 and 2560), re-runs on resize, on every logo image load and when the tab becomes visible; clones carry `data-logo-marquee-clone`, `aria-hidden`, no roles, empty alts. Each list animates `translateX(0 → -100%)` in **40 s** linear (≈ 35 px/s); after every fill the clones' animation time is set to the original's (`getAnimations()[0].currentTime`), so clones added later (slow load, resize) run in step — the re-review found 140–700 px gaps without it.
- Tiles 2.86 px apart (`0.17875rem` gap + end padding): Figma's 177.86 px tile holds a 175 px logo.
- Reduced motion: no animation, clones hidden, the logos wrap centred (all 8 visible on a phone).
- No pause control (owner, 2026-10-31). Title line height stays Text Main 150 % (Figma 130 %): a raw line-height on the class breaks the site's text trim.
- Spacing: padding-top `space/8` (phone `space/7` top and bottom), title → logos 5 px, phone title padding `site/margin`.

## 2026-10-31 — Nav is narrower than the site container above 1512 (open, other session)
Measured: up to 1512 the hero text lines up with the nav. Wider, the nav content stays 1384 px wide while the hero, the footer and every `u-container` section are 1512 px (e.g. 1920: nav from x 268, hero/footer from x 204). The nav is the odd one out, so the nav gets widened to `u-container` — in its own session (owner: nav changes in a separate chat). The hero is not narrowed.
