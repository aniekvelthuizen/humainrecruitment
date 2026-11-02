# Sticky Steps (`Sticky Steps`, group Sections)

Plan: `references/plans/2026-11-01-home-method.md`. Figma: `Content scrolly telling / Glass cards` (set `2378:31868`; Home B instance `2710:48618`), pictures and tree in `references/figma/home-method/`. Checks: `node references/steps-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`73b7ce70-2af0-9890-7627-b980501bb35f`**. Cards: Card Primary variant **Process** (`602f31cd-406d-3bd0-672e-76bb8cb85dcf`, see `cards.md`).

## 2026-11-01 — Name describes the pattern
Choice: **Sticky Steps** (`sticky-steps_*`): an intro that stays in view beside a column of step cards that stack. Figma calls it "scrolly telling / Glass cards"; Home B, Hire an Expert and the mobile Home frame all use it.

## 2026-11-01 — Scroll behaviour (owner)
Owner (Aniek): "links is sticky inderdaad en kaarten stapelen over elkaar heen", with a screenshot of the cards piled up, tilted, card 3 on top.
- **Intro** (`sticky-steps_intro`): `position: sticky`, `top: calc(nav/height-total + 2rem)` (= 112 px). Static below 992 px (stacked layout).
- **Cards**: every card directly in the list (or in the slot inside it) with `role="listitem"` sticks at the same top, so the next one slides over the previous; the glass blur makes the pile read as a stack.
- **Hold** (review fix 1): `sticky-steps_list::after` is an empty 16rem block (8rem below 992) after the last card, inside the list, so the full stack stays put for a while after card 3 lands (measured: ~350 px of scroll on desktop, ~200 on phones) and the intro is still in place when card 3 lands. Without it the intro left before the stack was complete and the full stack was never held.
- **Tilt**: odd cards `rotate: -2deg`, even `+2deg` (Figma +2 / −2 / +2 counter-clockwise).
- Sticky + tilt live in a small CSS embed inside the section (`[data-sticky-steps]`, `[data-sticky-steps-list]`), not on the card, so any card an editor drops in the slot gets it. Card Primary must have **Role off** (= `role="listitem"`) in this list.

## 2026-11-01 — Structure
`section.sticky-steps_wrap.u-theme-brand` (`data-section="dark"`, `data-sticky-steps`) › `sticky-steps_contain.u-container` › `sticky-steps_layout` (grid `minmax(0, 555fr) minmax(0, 797fr)` = Figma's 555 + 797 at 1512, both shrink below that (992: 358 + 515); gap `space/7`; one column below 992, row gap 10rem) › 
- `sticky-steps_intro` › p `sticky-steps_eyebrow.u-text-style-label-large` · h2 `sticky-steps_title.u-text-style-h1` › span (Title) + span `sticky-steps_accent` (Title Accent) · p `sticky-steps_text.u-text-style-large` · `sticky-steps_actions` › Button Main Primary (chevron right)
- `sticky-steps_list` (`role="list"`, `data-sticky-steps-list`, flex column, gap 11rem, max 42.9375rem = 687 px; full width below 992) › slot **Steps** (`u-display-contents`)
- HTML embed `u-embed-css` (only the card stacking + tilt; the intro's sticky top is on its class: `calc(nav/height-total + 2rem)`, published as such although the API read-back shows only the variable).
Plain section, not the Lumos `Section` wrapper: same route as Hero Experts / Stagger Cards (site decision 2026-10-31).

## 2026-11-01 — Spacing (Figma is untrimmed, the site trims text)
| Where | Figma (box) | Built |
|---|---|---|
| Section top/bottom | 64 + 128 group padding = 192 | `section-space/large` (12rem); < 992 `section-space/main` (6rem, mobile frame 96) |
| Top → eyebrow | 192 | intro `padding-top 0.4rem` (the eyebrow's trimmed space) → cap at 198 (Figma 198.4) |
| Eyebrow → title | 10 | `2.0625rem` (10 + both trims), < 768 `1.625rem` (H1 at 36) |
| Title → text | 10 | `2.1875rem`, < 768 `1.75rem` |
| Text → button | 48 | `3.5rem` |
| Between cards | 48 gap + 128 card padding | 11rem (176) |
| Intro → first card (stacked) | 32 + 128 | row gap 10rem (160) |
Measured at 1512: eyebrow 198, title 243 (242.3), text 470 (469), button 600 (599), cards 687 × 204 / 204 / 177 (Figma 687 × 204.7 / 204.7 / 177.7), 380 between card tops. 402: eyebrow 102 (102.4), first card 160 below the button.
Section height 1321 vs Figma 1394: Figma's auto layout counts the rotated card bounds; the spacing between the visible cards is equal.

## 2026-11-01 — Title in two parts
The title is an h2 with the H1 look (the hero holds the page's h1). White part and mint part are two DOM spans bound to **Title** and **Title Accent** (plain Span elements cannot take a text prop; DOM spans can). Prop text loses its trailing space, so the space comes from `.sticky-steps_accent::before { content: " " }` — a normal, breakable space.
Mint = `swatch/brand-accent-500` on `sticky-steps_accent`. Wanted: Lumos' own `u-heading-accent` + `<strong>` (colour Theme `heading-accent`), but `heading-accent` is white in Brand mode and changing that shared variable was refused by the session's safety check. **Open for the owner:** set Theme `heading-accent` Brand mode → `swatch/brand-accent-500`, then the span can use the Theme variable.

## 2026-11-01 — Gradient
`gradient/brand-start` 0 % · `gradient/brand-middle` **80 %** · `gradient/brand-end` 100 %, 180deg (hero: 70 %). Written as a literal `linear-gradient(…var()…)`; the API read-back shows one variable, the published CSS has all three stops.

## 2026-11-01 — Props
Content: **Eyebrow**, **Title**, **Title Accent**, **Text** · Button: **Button Text**, **Button Link** (default = **page** How It Works, set in the Designer; the API only writes URL defaults; owner did not pick, recommended answer) · slot **Steps** (tooltip set in the Designer; the API cannot update slot props).
Home B: Figma overrides (our method / The top 5% found / before you need them.), the three cards without pill and checklist. Hire an Expert and the mobile Home frame use the default copy «How it works / Hiring Project Talent. / Simplified.» with pills and checklists — fill those per page when that page is built.

## 2026-11-01 — Slot cards need the Designer
The API cannot insert into an **empty** slot of a page instance (anchor must not be an instance; the slot has no addressable id) and cannot move elements into a slot inside a definition. Route used: Designer (Claude in Chrome) › select the slot in the Navigator › Components panel › one click on Card Primary › ⌘C, ⌘V, ⌘V (pastes after the selection in the same slot); then all props through the API. Card titles to H3: instance › Title › Edit Rich Text › select all › H3 (the API writes rich text as `<p>`).

## 2026-11-01 — Review fixes (owner: "Aanbevolen punten")
Review: `references/audit/2026-11-01-sticky-steps.md`. Done: 1 hold space after the last card · 2 Process with pill + checklist on Example Components (Dark showcase grid, after the Step cards) and measured · 3 embed trimmed to the cards, `u-embed-css` · 5 columns shrink · 7 Button Link default as page, slot tooltip · 8 Icon Visibility off on the three Home cards.
Accepted, not changed:
- 4 Inline `font-weight: inherit` on the eyebrow text inside Card Primary (the Typography Plain Style prop): the only way to get the ring's weight onto that text without a new Typography variant; 30 bytes per card, Stage checked unchanged.
- 6 The space between the white and mint title parts exists only in CSS (`::before`); visible and read aloud correctly, but copied text reads "foundbefore". The API cannot place a bare text node between two bound spans, and prop text loses its trailing space.
- 9 Focus ring dark on dark (site-wide, Button Main): owner's choice, not changed here.
- Note: when the nav shows its full height (scrolling up, top row Contact / Careers ≈ 118 px), it covers the top ~6 px of the stuck intro and cards; scrolling down it is 76 px and nothing is covered.

## 2026-11-01 — The pile shows one layer of glass (owner)
Owner (Aniek), with a screenshot of the site next to the design: the stacked cards were much whiter than the design and the text hard to read.
Measured: in the design the top card is one layer of white 20 % over the gradient (card mid ≈ (51,150,180) on a (≈10,120,160) background); on the site three glass cards (each `card/glass` 20 %) added up to ≈ 49 % white (card mid (153,188,206)).
Choice: as the next card slides over a card, that card's glass tint **and** its texts (pill, title, text, checklist) fade out in proportion to how much it is covered; ring and edge stay, so the pile reads as outlines under one sheet of glass (design: the "2" ring peeks out above card 3). A small script in the section embed sets `--sticky-steps-cover` (0…1) per card from the overlap on scroll (rAF-throttled, all Sticky Steps on the page, once per page); the CSS mixes `card/glass` with transparent by that value (`color-mix`), so the Theme still decides the colour. The embed targets Card Primary's own classes (`card_primary_element`, `_badge`, `_header`, `_text`, `_list`) — the one place this section reaches into the card.
Measured after publish (1512, card 3 landed): card 3 mid (56,138,173), left (57,144,176), right (56,139,173) — even, ≈ one layer, close to the design; covered cards report cover 1.000 and a transparent fill. Same on 402.
