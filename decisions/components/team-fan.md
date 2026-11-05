# Team Fan (`Team Fan`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 11. Figma export: `references/figma/rest-of-site/team/` (`Property 1=Experts, Property 2=Team`); instance `pages/05-project-controls/section-06`. Built by Aniek Velthuizen, via Claude.
Component **`24aa03a5-72f2-9d73-9cd0-bda07cb40c8d`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.team-fan_wrap.u-theme-light` (`data-section="light"`, `data-team-fan`, `data-space-top` = prop; `overflow: clip`) › `team-fan_contain.u-container` › `team-fan_header.u-text-trim-off` (eyebrow · h2 span Title, span " ", br, span `team-fan_muted` · text) · `team-fan_row` › slot **List** · HTML embed `u-embed-css`.
The row sits outside the container on purpose: Figma's fan bleeds past both edges, and the unit brief asks for that.
Props: Content Eyebrow, Title, Title Muted, Text · Layout Space Top (default `none`: the page instance has 0 on top).

## 2026-11-05 — The list
Team Fan List (to be made in the Designer): `team-fan_cms` › `team-fan_list` › `team-fan_item` › Card Profile **Role** (base). Source Team, filter `group` equals Discipline (`db1632ef…`), sort Order ascending, **limit 9**, the most the embed positions.
Bound: Image = `photo`, Image Alt = `photo-alt`. Title and Text are bound since 2026-11-05: Card titles are plain text, see `cards.md`. Final list component: **Team Fan Items**. List instance before the Designer pass: `1dd4ecd2-f204-edd1-ff87-e4068685852d`, on Project Controls in `page_wrap`, right after `page_main`.

## 2026-11-05 — The fan is CSS, from the card's place in the list
Measured from the tree and the PNG, per step out from the centre: rotate 5°, then 10°; centre moves 366.4 then 738 sideways; 17.85 then 68.8 down. Written as one curve with `t` = steps from the centre: `translate(t × 23.0625rem, t² × 1.075rem) rotate(t × 5deg)`. Left of centre leans left (Figma's positive rotation is counter-clockwise).
All cards share one grid cell of 19.6875rem, so the row keeps its height; the 5.75rem bottom padding on the list is Figma's row height (550.7) minus the card (459).
Custom code, in the embed, because Lumos and the style API have no route: a class cannot read a card's position in a list that the client fills, nor set a custom property. `--i` and `--j` are the card's number from the start and from the end (`:nth-child`, `:nth-last-child`), which gives `t` for any count without a script.

## 2026-11-05 — 3 to 9 items
- `t` is scaled so the outermost card never goes past Figma's ±2 steps: 3 and 5 items use Figma's steps exactly; 7 and 9 sit closer and **overlap**, centre on top, a card comes forward on hover. So no card is ever fully off screen at 1512. Figma only draws 5, so this is a choice: the copy says "seven disciplines", and with 7 the cards overlap by about 69 px, with 9 by about 131 px, which cuts into the text of the side cards until hovered.
- An even number has no middle card, so the fan stays symmetric at half steps (±2.5°, ±7.5°) and no card is fully straight.
- The sideways step is `min(23.0625rem, 24.4vw)`, so narrower screens pull the cards in instead of losing the outer ones: at 1100 the outer card is still half on screen.

## 2026-11-05 — Below 992: a swipe row
No design below desktop. ≤ 991 `team-fan_list` is a flex row with `overflow-x: auto`, `scroll-snap-type: x proximity`, side padding `site/margin`, cards straight at 19.6875rem (at most `100vw - 4rem`, 256 at 320), gap `space/7`. The next card peeks in. The scrollbar is hidden on touch screens only, so a mouse can still reach the cards. Unit brief: a swipe row is fine here because the design is a fan; 768–991 got the same because the fan would hide the outer cards there.
Safari does not make a scroll area keyboard-focusable; the cards are not links, so nothing is unreachable for a screen reader.

## 2026-11-05 — Measured (local simulation: published CSS + these rules; nothing published yet)
| At 1512 | Figma | Built |
|---|---|---|
| Section | 1018 | 1018 |
| Centre card | 598 / 275, 315 × 459 | 598.5 / 275, 315 × 459 |
| Inner cards, box | 212 – 565.5, top 280 | 210.2 – 564, top 279.3 |
| Outer card, box | −178.2 – 211.7, top 320 | −176.8 – 213.1, top 319.9 |
| Card text | title 297, text 367 | same |
The inner cards are about 2 px further out than Figma, the price of one straight line through both steps.
No sideways page scroll at 1512, 1100, 992, 800, 402, 320 with 3, 4, 5, 7 and 9 items, and at 2560 with 5 items (all five fully on screen there, so no overflow on the sides above about 1900). Not measured: a card coming forward on hover. The simulation filled in the card's Title and Text by hand.

## 2026-11-05 — Getty watermark
All five photos carry it (plan, conflict 4; `decisions/cms.md`). Replace before go-live.
