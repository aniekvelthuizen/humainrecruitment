# Plan — Home «Testimonials» (Spotlight Grid › Reviews) — 2026-11-02

Work by Aniek Velthuizen (with Claude). Kit `skills/build` (+ `componentize`). Figma read in Claude in Chrome with the Plugin API (the Figma MCP's View seat hit its call limit on the first call); dump in `references/figma/home-testimonials/`.

## In short

- Figma `Content / Testimonials` (section `2323:32727`, set `content-testimonials` `2378:35367`, desktop `2236:5349`, mobile `2378:35368`). On **1. Home B** it is block 6 (`2710:48620`), right after «Expertise» (Spotlight Grid). Also on 2. Hire an expert and 7. About Us / Clients (same component).
- Same pattern as Spotlight Grid: centred eyebrow + two-tone H1 over three columns of cards around a brand-gradient photo panel. So it is **not a new section**: Spotlight Grid gets a variant **Reviews** plus three toggles (default off, Expertise unchanged).
- The three cards are the existing **Card Testimonial** (built 2026-10-30 for exactly these cards).
- Goes on Home after Spotlight Grid, before Split Content #2.

Page: Home (`6ae35365a38b2d71cab8c699`) — Figma page frame 1. Home B (`2710:48615`)
Insertion: `page_main`, after Spotlight Grid (`de7a3245-…`), before Split Content #2 (`b4a55b1b-…`).
Neighbours' system: plain `section.<name>_wrap.u-theme-light` › `_contain.u-container`; two-tone titles with a `_muted` span at opacity 0.5.

## Reuse

| Design part | Existing | Decision | Reason |
|---|---|---|---|
| Section | Spotlight Grid | **extend**: variant Reviews + toggles | same header and three-column frame around a gradient panel; owner rule «reuse as much as possible» |
| Subtitle (Text Large) | — | new `spotlight-grid_text`, toggle **Text Visibility** (off) | Stagger Cards has the same optional line |
| Rating pill «★★★★★ 4.9 / 5 · based on 3 client reviews» | Icon Set Star (as in Card Testimonial) | new `spotlight-grid_rating`, toggle **Rating Visibility** (off) | only here |
| 3 testimonial cards | **Card Testimonial** | place ×3 (List Start, new slot **List Center**, List End) | built for these cards |
| Photo panel | `spotlight-grid_panel` | reuse; Reviews hides the quote, panel 440 high, photo 277 × 394 centred at the bottom | same gradient, radius, clip |
| «See all clients» | **Button Main** Primary + chevron | new `spotlight-grid_actions`, toggle **Button Visibility** (off) | site button |

## Structure change in Spotlight Grid (base unchanged in look)

- The panel moves into a new `spotlight-grid_center` (flex column, gap `space/7`) together with `spotlight-grid_center-list` (role list, slot **List Center**, `display: none` in base, flex in Reviews). The panel's 768–991 rules (`order: 1`, full row) move to `_center`.
- `<br>` in the title gets `spotlight-grid_break` (Reviews hides it: the Figma title is one line).
- Checked with `references/spotlight-check.mjs` before/after: Expertise must measure the same.

## Variant Reviews (styles only)

| Element | Reviews |
|---|---|
| `_wrap` | background `swatch/light-200`, padding-top `section-space/large` (192) / `main` (96) below 992 |
| `_quote` | hidden |
| `_panel` | min-height 27.5rem (440) |
| `_visual` | absolute, centred (`left 50%`, `translateX(-50%)`), 17.3125rem (277) wide, bottom 0 — also below 992 |
| `_center-list` | flex column, gap `space/7` |
| `_break` | hidden |
| `_layout` < 992 | one column: card 1, card 2, photo, card 3 (= the mobile frame's order) |
| `_center` < 992 | back in the flow (no `order`, no full row) |

## Units

| # | Unit | Type | Reuses | Creates | Touches |
|---|---|---|---|---|---|
| 1 | Assets | upload | — | photo `testimonials-reviews-man.png`, avatars ×3 | — |
| 2 | Spotlight Grid › Reviews | extend component | Card Testimonial ×3, Button Main, Icon Set | classes `spotlight-grid_center`, `_center-list`, `_text`, `_rating`, `_stars`, `_star`, `_rating-text`, `_actions`, `_break`; variant Reviews; props Text, Text Visibility, Rating Visibility, Rating Text, Button Visibility, Button Text, Button Link, slot List Center | `spotlight-grid_panel` (medium rules move), Card Testimonial padding below 768 |
| 3 | Home instance | place + fill | — | — | Home `page_main` |

One session, in order 1 → 2 → 3.

## Conflicts and slips

| # | What | Recommended |
|---|---|---|
| 1 | Section background light-200: the site has no grey Light theme yet (`site.md` 2026-10-30) | Reviews sets `swatch/light-200` on the wrap; the white Card Testimonial (`background-2`) shows as in Figma |
| 2 | Card padding 20 on the mobile frame, Card Testimonial is 32 everywhere | Card Testimonial `small`: padding `space/5` (only one other instance, Example Components) |
| 3 | Home B copy has no full stop after «…international projects»; the component and mobile frame do | keep the full stop |
| 4 | Card arrows link nowhere in Figma | cards not clickable (Link empty, as the card's rule); arrow stays as drawn |
| 5 | «See all clients» has no link in Figma | `/clients` (page exists) |
| 6 | Tablet 768–991: no design | stack as the mobile frame |
| 7 | Mobile title 30 in Figma, site H1 mobile 36 | site rule (one heading system) |

## Questions

None blocking — built with the recommended answers above.
