# Review — all card components after the split, 2026-10-31

Phase 5 of `references/plans/2026-10-31-card-split.md`. Work by Aniek Velthuizen (via Claude). Six fresh read-only reviewers, one per component, **this time with the Webflow API** (the `846065a5-…` connector, so props, folders, defaults, tooltips and bindings were read for the first time by fresh eyes), plus the main session's real-mouse hover / keyboard / Brand test. Page: Example Components on staging (published 11:29, 11:36 and 11:56 UTC by this and the footer session; no card change after the clean-up; every reviewer's card-check matched `2026-10-31-card-split/after-cleanup/` within 1 px).

**6 components: 0 broken as a whole, 1 broken item, all need small fixes.** 18 items + 7 questions.

| Component | Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Card Primary | ⚠️ | ✅ | ⚠️ | ✅ | 🧹 | 🧹 | ⚠️ |
| Card Opportunity (+ Tags, Meta) | ✅ | ❌ | ⚠️ | ✅ | 🧹 | 🧹 | ⚠️ |
| Card Expert | ⚠️ | ✅ | ⚠️ | 🧹 | 🧹 | ⚠️ | ⚠️ |
| Card Profile | ✅ | ✅ | 🧹 | 🧹 | 🧹 | ⚠️ | ✅ |
| Logo Tile | ⚠️ | ✅ | ⚠️ | ⚠️ | 🧹 | ⚠️ | ⚠️ |
| Card Testimonial | ✅ | ✅ | ⚠️ | ✅ | 🧹 | ⚠️ | ⚠️ |

## Hover, focus and Brand (plan §8) — fine

Real mouse (Playwright, `page.mouse`), every showcase card in the four showcase sections (19 cards), at 1512 and 402 px: rest → hover → rest **3× in a row**, then **interrupted** (out after 120 ms, then a full hover again). Every computed style of every part compared with the first rest/hover.
- **All 19 cards, both widths, Light/Dark and Brand: the 3 hovers are identical, the 3 rests return exactly to the first rest, and the interrupted hover ends at rest and hovers fully again.** No stuck veil, arrow or colour.
- Only linked cards react (veil 0 → 1, arrow slides 48 px; Testimonial arrow 4 px; Match Glass turns white). Link-less cards do nothing, as decided.
- Keyboard (Tab through the showcase at 1512): 8 stops = the 8 linked cards; each shows its hover state plus a 2 px ring, 3 px outside. After a mouse click: no ring on any card. Match Glass stays white after a click (focus-within, decided 2026-10-30).
- **Brand**: checked through a theme mode, not on the site: the four showcase sections were given the Section's Brand variant class (`w-variant-514db4f8…`) in the browser only. Same hover results; surfaces, text, pills, score green, logo inversion and photo greyscale all read well on purple (`sec-brand-*.png`). Nothing was added to Example Components, so there is nothing to clean up.
- Not fine: item 13 (Match Glass focus ring invisible on dark) and items 9–10 (Pricing).

## Items

Numbers run on, so "fix 2, 11" is unambiguous. *By*: API = this session through the Data API; Designer = Claude in Chrome.

**All cards**
1. 🧹 **Link defaults "#"** on Card Primary, Opportunity, Expert, Profile and Testimonial (and Opportunity's Text default is a stray "\n\n"). Harmless while Screen Reader Text is empty, but half of the "clickable" rule is always true. *Fix: clear the defaults (API).*
2. ⚠️ **An empty band stays when an optional part is off**: Card Primary eyebrow (16 px above the title, e.g. a Stage card without stage label) and Card Opportunity tags row with Tags Visibility off (title 16 px lower). The condition sits on the text inside, not on the wrapper. *Fix: same condition on `card_primary_eyebrow` and `card_opportunity_kicker` (Designer).*
3. 🧹 **Properties panel order ≠ card order**: Card Primary Eyebrow after Title/Text; Card Profile Subtitle after Text; Card Expert Score before List and Logo before Photo; Card Opportunity Tags/Meta sub-components have no folders and Experience Icon comes last. *Fix: drag into card order, folders on the sub-components (Designer + API).*
4. 🧹 **Tooltips missing or stale**: Card Primary Button Text (drives two buttons, only shows with a link); Card Expert props that only work in some variants (List/slot: Expert; Photo: Match/Glass; Score: not Glass); Testimonial Screen Reader Text still Lumos' wording; Logo Tile Logo. *Fix: write them (API).*
5. 🧹 **Leftover styles from the duplicates, no visible effect**: Opportunity (text opacity .5, element gap, empty title class), Profile (empty `card_profile_top` div on 9 cards, badge/header/text leftovers), Expert (unused `card_expert_list_title`, small-breakpoint rules equal to main), Logo Tile (4 styles on the wrap). *Fix: remove (API).*
6. 🧹 **Typed value where a variable exists**: Profile text gap 0.625rem = `space/3`; Expert Match subtitle and Glass hover use swatches directly. *Fix: gap → `space/3`; record the two swatches (fixed-theme cards) (API).*
7. ⚠️ **No Settings props on Logo Tile and Card Testimonial** (Visibility, Role = list item, Wrapper Classes/Style), which a marquee or a list needs; Logo Tile's root is also an unnamed div around `logo_tile_wrap`. *Fix: `logo_tile_wrap` as root, the four Settings props on both (Designer + API).*

**Card Primary**
8. ⚠️ **Pricing button is not a link itself**: on a Pricing card without a link it is a dead button (Link "#" unbound, no condition). *Fix: same `Screen Reader Text is set AND Link is set` condition as the Tertiary button (Designer).*
9. ⚠️ **A linked Pricing card gives no hover feedback**: pointer, but nothing moves (no veil in Pricing, the button's trigger is reset). *Fix: let the Primary button react to the card hover (API).*
10. ⚠️ **Pricing keyboard ring runs through the "Most chosen" label** (`focus-pad-c9.png`). *Fix: raise the label above the Clickable (API).*

**Card Opportunity**
11. ❌ **Location / experience / salary text runs past the card's right edge**: the text box is 18 px (desktop) to 22 px (phone) wider than the card on all 20 cards; on narrow cards long text is cut off ("Rotterdam, N…" at 768, salary under the notch). Cause: Typography Plain `min-width: 100%` next to the icon. *Fix: `min-width: 0` on the meta text (API).*

**Card Expert**
12. ⚠️ **A new Match or Match Glass card shows an empty 78 × 98 gap** where the photo goes: Photo Visibility defaults to off. *Fix: default on (API).*
13. ⚠️ **Match Glass keyboard ring is invisible**: the card turns white, but the ring is dark navy and sits 3 px outside the card, on the dark section (`focus-published-0.png`). *Fix: draw the ring inside the card in Glass (API).*
14. 🧹 **Logo Alt default "Google"** while the default logo is the placeholder and hidden. *Fix: empty default (API).*

**Logo Tile**
15. ⚠️ **A white logo disappears on a light section**: no theme recolouring (the Expert logos have it). *Fix: `brightness(0) invert(card/logo-invert)` like the Expert logos (API).*
16. 🧹 Showcase tile's alt reads "Client logo". *Fix: "Agristo" on the instance (API).*

**Card Testimonial**
17. ⚠️ **A new testimonial is a link to "#"**, read out as "Read the case": Screen Reader Text default is filled. *Fix: empty default, as on Card Primary (API).*
18. 🧹 The role text keeps two overrides set to their default values (left from removing the inline style). *Fix: reset them (Designer).*

**Your call** (recommendation after ➡️)
- ❓ **Q1** Card Opportunity without a link still shows the notch cut-out, empty (15 of 20 showcase cards). ➡️ Keep: it is the card's shape in Figma and every real vacancy has a link; record it.
- ❓ **Q2** Photos have no alt prop (Profile Image, Expert Photo): every photo publishes `alt=""`. ➡️ Add Image Alt / Photo Alt, default empty (decorative unless the editor fills it).
- ❓ **Q3** Match Glass photo zooms 10 % on hover (Lumos card image); Figma has no zoom. ➡️ Remove the zoom in Glass.
- ❓ **Q4** Logo Tile fills the whole column (418 px at 1440); Figma's tile is ~178 wide. ➡️ Tile as wide as its logo, so a marquee's gap sets the spacing.
- ❓ **Q5** Expert card 25 px taller than Figma (21 px bullet lines vs 19), Glass subtitle gets 8 px twice. ➡️ Accept and record, like the other text-style differences.
- ❓ **Q6** Testimonial role, company and arrow 2–6 px lower than Figma (line-height). ➡️ Accept and record.
- ❓ **Q7** Testimonial always shows 5 stars. ➡️ Keep (every Figma use shows 5).

**Content** (not defects): placeholder people, photos with a Getty watermark, Google/Agristo logos, €XX, "Request a shortlist" on Pricing (Figma "See details"); the With Text showcase's screen-reader text names a shorter title than the card.

**Not checked**: slot Allowed components and the Link/Card Attributes props (the API does not list them); "is set" with an empty Title/Text/Badge (no empty instance on the page); Figma values from the MCP (call limit; PNGs used); marquee behaviour (no marquee built yet).

## Evidence

Session scratchpad (not committed): `review/<component>/` per reviewer (`distances.md`, card-check runs, screenshots), `review/example-components/sweep/`, `hover/out/` (`published-1512.md`, `published-402.md`, `brand-1512.md`, rest/hover/focus/after-click shots per card, `sec-*`).

## Reviewer returns (condensed)

- **Card Primary** — Works ⚠️ Responsive ✅ Spacing ✅ Lumos ✅ Code ✅ Props 🧹 Design ⚠️. Findings: empty eyebrow band (item 2), Pricing CTA unbound (8), Pricing no hover (9), focus ring through label (10), Eyebrow order (3), Button Text tooltip (4). Verified: slot display name is **Items** (only the API's prop record says "Slot"); all bindings correct; a fresh instance is the Figma Service card. Spacing table within 2 px or recorded.
- **Card Opportunity** — Responsive ❌ (item 11), Spacing ⚠️ (item 2), Design ⚠️ (Q1), Props 🧹 (items 1, 3), Code 🧹 (item 5). Lumos sliders: interact.mjs flag "slides over intro text" was a false positive (clipped at x≈719).
- **Card Expert** — findings items 3, 4, 5, 6, 12, 14, Q2, Q3, Q5. Glass stays white after a click: decided.
- **Card Profile** — findings items 1, 3, 5, 6, Q2. All distances within 1 px except the pill (2 px).
- **Logo Tile** — findings items 4, 5, 7, 15, 16, Q4. No hover / no Tab stop: as planned.
- **Card Testimonial** — findings items 4, 7, 17, 18, Q6, Q7. Bindings correct, link /clients 200, ring white on dark, none after click.

## Outcome

Owner (Aniek) chose **fix all + recommended**. Fixed by Aniek Velthuizen (via Claude), API + Designer in Chrome, published to staging 4×. Details and the why: `decisions/components/cards.md` "Review fixes, phase 5".

| # | Status | Was → Now |
|---|---|---|
| 1 | ✅ | Link default "#" → empty on 5 cards; Testimonial SRT → empty; Opportunity Text "\n\n" → empty |
| 2 | ✅ | Eyebrow wrapper `Eyebrow Visibility AND Eyebrow is set`; Opportunity tags row bound to Tags Visibility. Staging: eyebrow wrapper only on the Stage card |
| 3 | ✅ | Panel order = card order on Card Primary, Expert, Profile, Opportunity Meta; folders on Tags/Meta |
| 4 | ✅ | Tooltips written (slot props cannot take one through the API) |
| 5 | ✅ | Leftovers removed (Profile top div + class, opacities, gaps, breakpoint copies, `card_expert_list_title`, Logo Tile wrap styles). Kept: the empty `card_*_title` hook classes |
| 6 | ✅ | Profile gap → `space/3`; the two swatches recorded as intended |
| 7 | ◐ | Logo Tile root = `logo_tile_wrap`; **Visibility + Role** added to Logo Tile and Testimonial. **Wrapper Classes / Style not added**: a Block root cannot carry `class`/`style` attributes; needs a Custom Element rebuild (new component id) |
| 8 | ✅ | Pricing button hidden unless `SRT is set AND Link is set` |
| 9 | ✅ | Pricing button lifts 2 px, icon 4 px on card hover (was: nothing) |
| 10 | ✅ | Ring now runs behind "Most chosen" (`focus-pad` shot) |
| 11 | ✅ | Meta text 392 → 350 px wide at 1512 (inside the card) on all 20 Opportunity cards, also at 402 |
| 12 | ✅ | Photo Visibility default on |
| 13 | ✅ | Match Glass ring dark navy → white on the dark section; the other 7 rings unchanged (Light, Dark, Brand) |
| 14 | ✅ | Logo Alt default "Google" → empty |
| 15 | ✅ | Logo Tile `brightness(0) invert(card/logo-invert)`: Agristo white on dark, black on light |
| 16 | ✅ | Alt "Client logo" → "Agristo" (default now empty) |
| 17 | ✅ | SRT default "Read the case" → empty |
| 18 | ✅ | Role Typography: Variant + Style overrides reset |
| Q1 | recorded | notch stays without link |
| Q2 | ✅ | Photo Alt (Expert), Image Alt (Profile), default empty |
| Q3 | ✅ | Glass photo zoom 1.1 → none |
| Q4 | ✅ | Logo Tile 440 → 175 px (as wide as its logo) |
| Q5–Q7 | recorded | accepted / kept |

Measured on staging (`2026-10-31-card-split/after-review/` vs `after-cleanup/`, 45 cards at 1512 and 402): only the differences above; no horizontal scroll, no console errors. Hover/focus re-run on the final publish (14:23 UTC; real mouse, 3× + interrupted, keyboard, after-click): **19/19 cards pass at 1512 Light/Dark, 1512 Brand and 402**; 8 keyboard stops, ring on each (Match Glass now white, the other 7 unchanged), no ring after a mouse click, no console errors. Home (Hero Experts, built the same day by another session) checked too: 8 Logo Tiles white on Brand, 175 × 100.
