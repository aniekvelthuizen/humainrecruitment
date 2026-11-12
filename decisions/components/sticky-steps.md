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

## 2026-11-05 — Variant Plain and item Process Step (Aniek Velthuizen, via Claude)
Plan unit 4. Figma `Content scrolly telling / Plain` (`2444:34854`), `Content / Process step` style=plain (`2292:32748`), Home `2710:57363`, Resume `2318:19165`. Variant **Plain** `90c5bea2-c226-a8d1-0a0c-f03289e440cd` (`create_variant`, own styles only). Item **Process Step** `db8037ee-dd09-a116-7480-95a2fadc37f9` (`process-step_`).
- **Plain:** Theme Base mode on the combo `sticky-steps_wrap.u-theme-brand` (a variant cannot swap a class), no gradient, muted part `swatch/dark-900-o50` on its own line (Figma breaks there on all three pages), list 42.25rem, gap `space/8`, no hold block (in the embed, see 2026-11-05 "No hold block").
- **Secondary button:** own wrapper `sticky-steps_actions-secondary`, hidden in the base, shown in Plain; the Primary wrapper the other way round. Both instances read Button Text and Button Link. A nested variant cannot differ per parent variant (same pattern as `card_primary_action_outline`).
- **New props, defaults keep Home as it was:** Nav Colour (`dark`, `data-section`; **set `light` on Plain**), Space Top (`large` 192, `medium` 176 Home, `small` 128 Resume and Project Delivery Experts), List Align (`start` How It Works, `end` Home and Resume: Figma has the steps at x 651 and x 772), Button Visibility (on; off on How It Works and Project Delivery Experts).
- **Process Step stays out of the stack:** `role="listitem"` sits on `process-step_element`, one level inside the root, so the embed's `> * > [role="listitem"]` (sticky, tilt, cover script) does not touch it. No existing rule or script line changed.
- **Title is an H3 in the definition,** bound to a plain text prop, so no title renders as `<p>`. Props: Number, Title, Text · Pill Visibility (on), Pill · List Visibility (off), slot **Items** (Card Bullet, Small).

**Distance per width.** Figma builds the white space into each step: padding 128 / 220 / 312 / 404 / 496, gap 48, list height fixed.
| Width | Steps | Under the last step |
|---|---|---|
| ≥ 992 | 0 / 13.75 / 19.5 / 25.25 / 31rem (step 1's 128 is part of Space Top), gap 3rem, intro sticky | list `min-height` by number of steps: 3 → 97.625rem, 5 → 251rem; 4 → 174.3125rem is the midpoint, no design |
| < 992 | stacked, no padding per step, gap 3rem, intro → first step 3rem, intro static | nothing; section-space/main top and bottom |
Below 992 the distance has no job (it gives the intro time beside the steps), so it goes; no design exists there, recommended answer. The embed carries only what the style API cannot: `nth-child`, `:has`, the attribute switches. All of it sits in `@media (min-width: 992px)`.
Staging (review 2026-11-05): published height 4400 and Theme Base confirmed. Simulated before publish at 1512 with the published CSS plus these rules written out by hand: How It Works 4400 (Figma 4400), Home 1930 (1930), Resume 1882 (1855: one list height per number of steps, 27 too high). Step lines Home 176 / 634 / 1211, Figma 176 / 633.7 / 1210.4. How It Works lines drift 8 px further from Figma per step (+8 / +17 / +25 / +33): known Card Bullet line height 21 vs 19. The section height stays 4400 through the list `min-height`.

**Glass check, no new variant.** Project Delivery Experts (`2263:10690`) and Consulting (`2277:7818`) use the same Process step style=glass as Home, and the same three-stop gradient at 80 %. PDE only looks purple because the section is 4780 high. Card Primary Process fits both: PDE 8 cards with pill and 4 bullets, no button, Space Top `small`; Consulting 3 cards without pill or list, as Home.

## 2026-11-05 — Review fixes on Plain and Process Step (Aniek Velthuizen, via Claude)
- **Number circle:** `process-step_number` uses Theme `badge/background` and `badge/text` (same colours as the swatches, now via the Theme).
- **Embed selector:** the Process Step root carries `data-process-step`; the embed selects that instead of `.process-step_wrap`, as `site.md` asks. Simulated on How It Works with the attribute added and the selector swapped: 4400 high at 1512, 1280 and 992, step padding 0 / 220 / 312 / 404 / 496, below 992 unchanged. Home has no Process Step, so these rules do nothing there.
- **Tooltips:** Title "First part of the title, full colour"; Title Accent "Second part of the title, in the variant's accent colour; follows the first part". No white or mint, because Plain is dark and grey.
- **Nav Colour** is in folder Layout, as Stagger Cards and Card Grid. Page Header keeps its own folder Settings: not part of this work.

## 2026-11-05 — No hold block on Process Step lists, in the embed (Aniek Velthuizen, via Claude)
The Plain variant's `::after` `display: none` published as `.sticky-steps_list:after:where()`, which matches nothing, so the 128 px block plus the 48 gap stayed: 272 under step 5 below 992 instead of 96 (audit `references/audit/2026-11-05-phase-4.md`). Webflow bug, see `cards.md`.
Now `[data-sticky-steps-list]:has([data-process-step])::after { display: none }` in the section embed, outside the 992 query; both attributes exist in the published HTML. The inert variant style is removed; base `::after` is unchanged.
Simulated, published page + this rule, not published yet. How It Works: 96 under the last step at 991, 768, 402, 320; 4400 high at 1512 and 992, as before. Home: no `data-process-step` in its list, hold block still there, unchanged. Hire an Expert and Project Delivery Experts have no Sticky Steps on the published pages, so nothing to change; recheck PDE and Resume at Compose, they get Plain: a three-step list loses about 304 px of blank at 992 and up (audit's estimate).
`.sticky-steps_accent::before` also publishes an empty `:where()` part, `.sticky-steps_accent:before, .sticky-steps_accent:before:where()`. No variant relies on it: the space is set on the base, Plain has no own `::before`, and the first selector matches. No change.

## 2026-11-12 — Process Steps stick and pile up under each other (owner, Aniek Velthuizen, via Claude)
Owner (Aniek), with two screenshots of Home's «From requirement to shortlist in days.»: the block is a scroll block, the steps are sticky and end up under each other; the end state shows the heads of steps 1 and 2 (number, title, divider) and step 3 in full. Before this, only the intro stuck; the steps scrolled past it.
- **Stick:** from 992 up every `[data-process-step]` is `position: sticky`. Step n lands one head (`--sticky-steps-pitch` = divider 1 + 24 + number 48 + 24 = 97 px) below step n-1, with step 1 level with the intro (`nav/height-total + 2rem` = 112). The step's own padding-top (Figma's growing distance, 0 / 13.75 / 19.5 / 25.25 / 31rem) stays, so `top` = 112 + (n-1) × 97 − that padding. Figma's own pitch is 92 (128 → 220 → 312); 97 is the built head, so the divider of the next step keeps 24 below the number, as in the screenshot.
- **Cover:** `process-step_element` gets Theme `background` (white in Plain), so a step covers the body of the one above; the padding area of the wrap stays transparent.
- **Leave together:** sticky boxes leave when the list's bottom reaches their own bottom, so without help the last step (the tallest stuck bottom) slid up over the heads first. The section script (`hold()`) stretches every step box and the intro with padding-bottom until all end on the same line, and pulls the layout back with the next step's negative margin-top (the intro's cell is as tall as the list). A negative margin-bottom does not work on the last step: the sticky limit uses the margin box. Re-run on ResizeObserver and on `resize` (the observer alone left the desktop stretch in place below 992 in a hidden tab).
- **Below 992:** unchanged, stacked and static; the script clears its inline styles there.
- Source: `references/embeds/sticky-steps.html` (the version before this change is that file in commit 5bb6a5c). Glass card stack (Home «Our method»): no rule or script line of it changed.
Measured on staging at 1512 × 900. Home: section 1930 (unchanged); stuck at 112 / 209 / 306, held ≈ 150 px of scroll, then steps and intro leave in the same frame. How It Works (5 steps): 4400 (unchanged); 112 / 209 / 306 / 403 / 500, full pile held ≈ 700 px (the list `min-height` from Figma), leaves together.
**Known limit:** the last step's stuck bottom on How It Works is at ≈ 802 px; on a window lower than that, the end of step 5's checklist is under the fold until the pile moves on.
