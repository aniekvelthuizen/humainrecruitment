# Review — Home «Testimonials» (Spotlight Grid › Reviews), 2026-11-02

Fresh reviewer for Aniek Velthuizen (with Claude). Read-only: nothing on the site was changed. No Webflow connector reached the site in this session (local `webflow` connector: 404 on `get_site`; the claude.ai connector was not available), so everything below comes from the published HTML/CSS and headless Chrome. Evidence: `references/audit/2026-11-02-testimonials/review/` (check/ = testimonials-check at 11 widths, spotlight-now/ = Expertise re-measure, probe/ = focus, hover and narrow-phone shots, distances.md, sweep-summary.md).

## Short version

The section matches Figma at 1512 and 402 (every gap, padding and position within 2 px, apart from the known +6 px card height). No sideways scroll at any width (320–1512), no console errors, one H1, headings in order, focus rings on all four links. Expertise is really unchanged: same boxes at all six widths as before the build. What remains is two layout choices for the in-between widths, one site-wide type question, a heavy photo, and small card details.

1. **Between 992 and ~1150 px the testimonial cards get cramped.** Names and job titles squeeze into a column 88–102 px wide: «Chief / Operations / Officer» and «VP, Product / and / Technology» run over three lines, the names over two. Seen: 992 px, card 280 wide, `card_testimonial_person` 88–102 wide, role boxes 63 px high (3 lines); screenshot `review/check/testimonials-992.png`. The owner kept three columns from 992 for Expertise, but those cards have short text; these do not. Fix: let Reviews use the stacked layout up to 1279 (with the max width from item 2), or accept. By: owner.
2. **On tablets (768–991) the stacked cards are stretched across the whole width.** Text lines run to ~100 characters and the arrow sits far from the person. Seen: 900 px, cards 821 wide, quote text 757 wide (2 lines); photo panel 821 × 440 with a 277 px photo; `review/check/testimonials-900.png`. No tablet design; the plan chose «stack as the mobile frame», but not the width. Fix: on `spotlight-grid_layout` in Reviews below 992 a max width (about 28–40rem) and centred, so it reads like the phone design. By: owner.
3. **On phones the intro line is 20 px where the mobile design has 16, so it runs to 3 lines.** Seen: 402 px, `spotlight-grid_text` 20/30, 90 high (Figma 16/24, 48 high); header 224 high vs Figma 162 (the H1 36 is accepted, the eyebrow 16 vs 12 follows stagger-cards.md). The same Text Large is used unchanged on phones in CTA Split, Split Content and Sticky Steps, and no decision covers body text on phones. Fix: either a site rule «Text Large steps to 16 below 768» (one Text Style mode change, every section), or record that it stays 20. By: owner.
4. **The man's photo is a 446 KB PNG.** Seen: CDN `content-length: 446205` for `testimonials-reviews-man.png`, shown at 277 × 394; the Expertise photo is a WebP of 84 KB. Already noted as open in references/log.md. Fix: compress to WebP (as Lisette) and re-point the Image prop, after the owner's OK. By: owner (then API).
5. **The card arrows are smaller and the job title lighter than in Figma** (Card Testimonial, not part of this build; cards were closed on 2026-10-31). Seen: chevron icon 16 × 16 in the 48 px circle (Figma 24 × 24); `card_testimonial_role` opacity 0.5 (Figma 0.34); crops in the session scratchpad, `review/probe/hover-card1.png`. Neither is in cards.md. Fix: `card_testimonial_arrow` padding .875rem → .625rem (icon 24) and role opacity to 0.34, or record both as accepted. By: owner.
6. **Small leftovers in the HTML** (only the code sees it). (a) Reviews still ships the hidden base quote («HumAIn is my go‑to source…», «Lisette», «Ingeniva») inside a `display: none` figure. (b) Expertise now has an empty, hidden `role="list"` (`spotlight-grid_center-list`). Neither is read aloud or shown. Fix: none needed now; if the Quote props get cleared on the Home Reviews instance, the hidden text disappears too. By: API.

## Content (not defects)

- The rating pill says «4.9 / 5 · based on 3 client reviews», but all three cards show 5 stars (3 × 5 = 5.0). Real numbers needed, or 5.0.
- The three testimonials, names, avatars and «Google / Covestro» come from the Figma file (likely sample copy); confirm with the client before launch.

## Already decided (not findings)

- Card Testimonial 6 px taller than Figma, person and arrow lower — cards.md Q6.
- Phone H1 36 instead of 30 — site.md 2026-10-29 (mobile heading sizes).
- Eyebrow 16 on phones (Figma 12) — stagger-cards.md («kept one style»), same in every section.
- Company not in capitals («Covestro», «Google») — cards.md Q20.
- No `role="listitem"` on the three cards (3 lists, 0 items measured) — designer-queue.md.
- Slot names and Allowed components — designer-queue.md.
- Cards link to /clients (page exists, 200) so the arrow shows; three links named «More client reviews» plus «See all clients» all go to /clients — spotlight-grid.md.
- Grey background set as `swatch/light-200` on the variant, not a theme mode — spotlight-grid.md (no grey Light theme yet; site.md 2026-10-30).
- Rating text line-height 1.3 on its own class, pill padding 9/15 rem literals (border compensation) — spotlight-grid.md.
- Old `w-variant-95904e04` rules on spotlight-grid classes in the stylesheet — site.md 2026-11-02 (duplicate_variant leftovers).
- Card text wraps one word earlier than Figma (site-wide `text-wrap: pretty`) — spotlight-grid.md (same on Expertise).
- No showcase on Example Components for section components — site.md 2026-11-02.

## Not checked

- Props (names, folders, order, defaults, tooltips of Text, Text Visibility, Rating Visibility, Rating Text, Button Visibility, Button Text, Button Link, slot List Center) and whether the Quote folder props that do nothing in Reviews are labelled as such: no Webflow connector reaches the site in this session. Needs `get_component` with includeProps on `4f869313-…` once the claude.ai connector is back.
- Variant style values through the API (read from the published CSS instead; all new rules use variables or rem, no px).
- iPhone (WebKit) rendering: only Chrome was run.
- Rating pill at 360 px wraps to two lines (56 high) and stays inside the screen; at 320 the same. Looked fine, not compared with a design (none below 402).

---

## Reviewer return

## Spotlight Grid › Reviews — Home (https://humain-dev.webflow.io/)
Checked: API none (no connector reaches the site) · published 2026-11-02 19:53 UTC (after the build commit 9ee9330, 20:53 local) · widths 1512, 1440, 1280, 992, 990, 900, 768, 767, 479, 402, 375, 360, 320 · design references/figma/home-testimonials/component-desktop.png, component-mobile.png, tree.txt
| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ⚠️ | ⚠️ | ✅ | ✅ | 🧹 | ? | ⚠️ |

### Findings
- ⚠️ Responsive · From 992 to ~1150 px names and job titles squeeze into three-line stacks in the cards · Seen: 992 px person column 88–102 wide, roles 3 lines (63 high) · Fix: Reviews stacked up to 1279, or accept · By: owner
- ⚠️ Responsive · On tablets the stacked cards span the full width, ~100-character lines · Seen: 900 px card 821 wide, text 757 wide · Fix: max width ~28–40rem, centred, on the Reviews layout below 992 · By: owner
- ⚠️ Design · Phone intro line 20 px, design 16; three lines instead of two · Seen: 402 px `spotlight-grid_text` 20/30, 90 high vs 48; same in other sections · Fix: site rule for Text Large on phones, or record 20 · By: owner
- ⚠️ Works · Photo is a heavy PNG · Seen: 446 KB for a 277 × 394 image (Expertise WebP 84 KB) · Fix: WebP, re-point Image prop · By: owner
- ⚠️ Design · Card arrow chevron smaller, job title lighter than Figma · Seen: icon 16 vs 24; role opacity 0.5 vs 0.34 · Fix: arrow padding .625rem, opacity .34, or record · By: owner
- 🧹 Code · Hidden base quote text ships in Reviews; empty hidden list in Expertise · Seen: `spotlight-grid_quote` display none with «Lisette» text; `spotlight-grid_center-list` role=list, no children · Fix: clear Quote props on the Reviews instance; leave the list · By: API

### Already decided (not findings)
- Card +6 px, person/arrow lower — decisions/components/cards.md Q6
- Phone H1 36 — decisions/site.md 2026-10-29
- Phone eyebrow 16 — decisions/components/stagger-cards.md
- Company not in capitals — cards.md Q20
- No listitem role on cards — references/designer-queue.md
- Slot names / Allowed components — designer-queue.md
- Cards link to /clients — decisions/components/spotlight-grid.md 2026-11-02
- `swatch/light-200` background, rating line-height 1.3, pill rem literals — spotlight-grid.md 2026-11-02
- `w-variant-95904e04` leftovers — decisions/site.md 2026-11-02
- Card text wraps a word early — spotlight-grid.md
- No showcase for sections — site.md 2026-11-02

### Content
- «4.9 / 5 based on 3 client reviews» while all three cards show 5 stars
- Testimonials, names, avatars and companies are the Figma sample copy

### Not checked
- Props (names, folders, defaults, tooltips, slot List Center): no Webflow connector reaches the site in this session
- iPhone WebKit: only Chrome run
