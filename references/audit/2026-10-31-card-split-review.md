# Review — card split, phase 5 (2026-10-31)

Aniek Velthuizen with Claude. Five fresh `webflow-devkit:reviewer` agents, one per component, read-only. Page: Example Components on staging. Props came from the main session's API read-back, because the reviewers' `webflow` MCP returns 404 for this site. The Figma MCP was rate-limited, so the reviewers worked from the PNGs in `references/figma/cards/`.

Before the review: `card-check.mjs` found all 45 cards identical to the phase 4 baseline at 1512 and 402. After the publishes at 11:16, 11:24 and 11:30 UTC (not from this session; 11:24 and 11:30 were the footer session's full-site publishes, 11:16 is unknown) the showcase order had changed. The reorder is the Designer cleanup recorded in commit 8ce78f7 (`log.md`: showcase order restored with ⌘X/⌘V and 13 titles H3, Designer-queue item ticked); the owner (Aniek) confirmed they did not move the cards themselves. Matched by content, every card is still identical. At 1512 only three heights changed, from the row stretch next to new neighbours.

## To the user

**Review: card split, 31 Oct.** 5 components (+ Card Arrow): 2 broken items, 0 components fully fine, Card Arrow fine.

| Component | Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Card Primary | ⚠️ | ⚠️ | 🧹 | ✅ | 🧹 | 🧹 | ✅ |
| Card Opportunity (+ Arrow) | ✅ | ❌ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ |
| Card Expert | ❌ | ⚠️ | 🧹 | ✅ | 🧹 | 🧹 | ⚠️ |
| Card Profile | ✅ | ✅ | 🧹 | ✅ | 🧹 | ⚠️ | ⚠️ |
| Logo Tile | ✅ | ✅ | ✅ | ✅ | 🧹 | 🧹 | ⚠️ |

(Card Expert Works ❌ = the focus ring, re-measured by the main session; the reviewer marked it ⚠️.)

**Broken**
1. **Card Opportunity**: on narrow cards the meta text runs past the right edge and gets cut off ("12+ years experienc…"). Re-measured: up to 18 px at 990, 12–22 px at 375. *Fix: let the text shrink next to the icon (`minmax(0,1fr)` / `min-width:0`), API.*
2. **Card Expert, Match Glass**: on a dark section the keyboard focus ring is invisible, because it is dark on dark. Re-measured: ring rgb(3,11,27) on a section of rgb(3,11,27). *Fix: a light ring colour for this card, API.*

**Off**
3. **Card Opportunity**: on a phone, a card without a link has its last row 10 px from the bottom (28 at the top). *Fix: move the −0.375rem pull to the button, API.*
4. **Card Primary, Pricing**: in a taller row the button stays up and leaves an empty band under it (95 px at 990). *Fix: push the button to the bottom, API.*
5. **Card Expert**: a new card with default settings shows "Previously worked at" without a logo, and Match/Glass show an empty photo column. *Fix: Logo Visibility and Photo Visibility on by default, API.*
6. **Card Expert, Glass**: at 990, "Previously worked at" leaves "AT" alone on its line. *Fix: balanced wrapping on the subtitle, API.*
7. **Card Profile**: photos have no alt text and editors cannot add one. The planned Image Alt prop was never built. *Fix: add Image Alt (Visual, after Image), API.*
8. **Logo Tile**: the showcase tile says "Client logo" to screen readers instead of "Agristo". *Fix: set Logo Alt on the instance, API.*

**Tidy**
9. **Card Primary classes**: 77 published rules of deleted variants (old Opportunity / Expert / Profile ids) still sit in the CSS. *Fix: clear them per old variant id, API.*
10. **All five**: styles that do nothing. Card Primary: Stage value, Step/Pricing text opacity. Card Profile: base pill look, H5 again on phone. Card Expert: phone rules repeat desktop, `0px` gap, unused class `card_expert_list_title`. Logo Tile: 3 no-op properties. Opportunity: With Text 0.5rem literal instead of `space/2`. *Fix: remove, or link the variable, API (the class delete is Designer).*
11. **Card Primary, Card Profile**: hidden leftovers in the HTML. Every Card Primary has a hidden second button, Step and Pricing carry hidden body text, and Role/Person carry an empty pill row. *Fix: "is set" conditions on the action button and `card_profile_top`, Designer.*
12. **Card Primary, Card Expert**: the bullets slot is called "Slot" (the decisions file says "Items"). *Fix: rename to "Items", Designer.*
13. **Card Primary, Card Profile**: props that only work in some variants have no tooltip saying so, and Card Profile's Screen Reader Text lacks the "fill in to make clickable" hint. *Fix: add tooltips, API.*
14. **Card Expert**: the score is filled in two ways ("85" + "%" on Expert, "85%" on Match). *Fix: show Unit in Match too, so Score is only the number, API.*
15. **Card Expert**: the Score folder comes before List, while the card shows the list first. *Fix: drag List above Score, Designer.*
16. **Card Primary, Card Profile**: a new card still starts with job text ("Project Controls Manager", "View & apply"). *Fix: neutral defaults, title stays H3, Designer.*
17. **Records**: Pricing label offset −3.375rem, Profile gap 0.625rem and the Glass subtitle's extra space/2 margin are not in `cards.md`. *Fix: record them.*

**Your call**
- ❓ **Q1, Pricing hover**: the whole Pricing card is a link, but nothing changes on hover, not even its mint button. ➡️ Let the button play its own hover inside the card.
- ❓ **Q2, Opportunity notch without link**: 15 of 20 cards have no link and keep the empty bite where the arrow would sit. ➡️ Keep it (same shape everywhere; real cards will have a link).
- ❓ **Q3, Match Glass photo zoom**: the photo zooms 10 % on hover, while Figma keeps the crop. ➡️ Remove the zoom on Match Glass.
- ❓ **Q4, Expert stretch**: next to taller cards the Expert card stretches and turns into a mostly empty mint block on hover. ➡️ Keep it (arrow in the row's corner, same as Opportunity).
- ❓ **Q5, Logo Tile in a marquee**: no own width (fills the column, Figma 178 px), logo size depends on empty space in the file, and a white logo vanishes on light sections. ➡️ Decide when the logo marquee is built; note it in cards.md now.

Content still on the page (not items): Pricing button "Request a shortlist" (design "See details") and "€XX"; Step shows "Day 1" twice; Stage text shorter than the design; the Profile stock photo is 509 px wide (real photos need ~1400 px).

Dropped in the merge: "the phase 5 run misses 2 Profile cards" (the run lists all 10).

## Reviewer returns

### Card Primary
Checked: API read-back (main session) · published CSS · rendered 11:16–11:30 UTC · widths 1440, 1280, 990, 900, 768, 767, 479, 375, 1512 · design service.png, stat.png, pricing.png, process-stage.png

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ⚠️ | ⚠️ | 🧹 | ✅ | 🧹 | 🧹 | ✅ |

- ⚠️ Works · Pricing card is a link but nothing changes on hover, including its mint button · Seen: hover = rest byte-identical at 375; `.card_primary_action` sets `--_trigger---off: 0` and Clickable covers the button · Fix: drop the trigger reset on the action for Pricing · By: owner
- ⚠️ Responsive · In a taller row the Pricing button stays up, leaving an empty band · Seen: 95 px at 990, 24 px at 1440 · Fix: `margin-top: auto` on `card_primary_action` (Pricing) · By: API
- 🧹 Spacing · Pricing "Most chosen" placed with literal `top: -3.375rem`, not recorded · Fix: record or derive · By: API
- 🧹 Code · 77 dead variant rules of deleted variants on `card_primary_*` (ids 2233ab62…, 4be18b62…, 5d8d09ee…) · Fix: `set_variant_styles` per old id · By: API
- 🧹 Code · Overrides on parts the same variant hides: Stage `card_primary_value` flex, Step/Pricing `card_primary_text` opacity · Fix: remove · By: API
- 🧹 Code · `card_primary_title` on every title has no style left · Fix: drop or note · By: API
- 🧹 Code · Hidden second button on every card; hidden body text on Step and Pricing · Fix: condition on the action button; empty Text on those instances · By: Designer
- 🧹 Props · Slot named "Slot" in the API, decisions say "Items" · Fix: rename · By: Designer
- 🧹 Props · Variant-only props without tooltips (Badge, List Title, Value, Value Label, Button Text, Button Icon Visibility) · Fix: tooltips · By: API
- 🧹 Props · New card starts with job text (Title, Button Text defaults) · Fix: service-style defaults · By: Designer

Already decided: hidden Badge/List Title/Value defaults (Phase 4); showcase titles `<p>`; line-height 1.25; checklist rows 21 px; Pricing price box 48 px; Step value bottom/white; balanced wrapping; Stat title heading-accent; Discipline hover; literal gradient stops and 2.25rem.
Not checked: Designer prop/folder order and slot Allowed components; empty-field behaviour; Glass/Step on light, Brand theme; Figma states beyond the PNGs. Outside the component: the showcase grid goes from 3 columns at 990 to 1 at 900.
Clean: no overflow at any width, no console errors, links 200 with aria-labels, focus ring 2 px / 3 px offset, Service hover veil + arrow, structure and 22 props / 7 variants as recorded.

### Card Opportunity (+ Card Arrow)
Checked: API read-back · published 11:03 UTC · widths 1512, 1440, 1280, 990, 900, 768, 767, 479, 402, 375 · design opportunity.png

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ❌ | ⚠️ | ✅ | ✅ | ? | ⚠️ |

- ❌ Responsive · Meta text runs past the right edge on narrow cards · Seen: 990 card 16 +16 px, 768 +5/+17 px; Lumos `.u-text {min-width:100%}` on the meta `<p>` after a 32 px icon · Fix: `minmax(0,1fr)` or `min-width:0` · By: API
- ⚠️ Spacing · Phone, no link: last row 10 px from the bottom vs 28 at top · Seen: meta `margin-bottom:-.375rem` eats the padding when the button is hidden · Fix: move the pull · By: API
- ⚠️ Design · Cards without a link keep the notch bite · Seen: 15 of 20 instances · Fix: keep, or drop with the arrow · By: owner
- 🧹 Spacing · With Text phone `margin-top: .5rem` literal = `space/2` · Fix: link the variable · By: API

Already decided: line-height 1.25, balanced title wrapping, 388 high, hover from card colour, pill border, no link = no button/arrow, Tag props, With Text title `<p>`, mobile title H6, dead With Text rules on Card Primary classes.
Not checked: Designer prop order, attribute props, empty fields, Dark/Brand sections. Outside: Swiper CSS linked twice in the page head.
Card Arrow: track 0 → 48 px in 400 ms on hover and keyboard focus, pixel-identical to the design at 1512, no ring after a click. Fine.

### Card Expert
Checked: API read-back · published 11:16 and 11:24 UTC (re-run on both, `card_expert_*` CSS identical) · widths 1440, 1280, 990, 900, 768, 767, 479, 375 · design expert.png, expert-match.png

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ⚠️ | ⚠️ | 🧹 | ✅ | 🧹 | 🧹 | ⚠️ |

- ⚠️ Works · New card with defaults: "Previously worked at" with no logo; Match/Glass empty photo column · Seen: defaults Logo/Photo Visibility false, Subtitle on (simulated locally) · Fix: visibilities on by default · By: API
- ⚠️ Works · Match Glass focus ring invisible on dark · Seen: outline 2px rgb(3,11,27) on rgb(3,11,27) (re-measured by the main session with real Tab presses) · Fix: inside ring or light ring colour · By: API
- ⚠️ Responsive · At 990 Glass "Previously worked at" leaves "AT" alone; names wrap on both Match cards · Seen: text column 159 px, label needs 169 · Fix: `text-wrap: balance` · By: API
- ⚠️ Design · Match Glass photo zooms 10 % on hover; Figma keeps the crop · Fix: remove or keep · By: owner
- ⚠️ Design · Expert stretches next to taller cards; mostly empty mint block on hover · Seen: natural 275, stretched 420–474 · Fix: align top or keep · By: owner
- 🧹 Props · Score entered as "85" + "%" (Expert) vs "85%" (Match) · Fix: show Unit in Match · By: API
- 🧹 Props · Score folder before List; the card shows the list first · Fix: drag · By: Designer
- 🧹 Props · Bullets slot named "Slot" · Fix: rename · By: Designer
- 🧹 Spacing · Glass name → subtitle = gap 8 + extra space/2 margin · Fix: own gap or record · By: API
- 🧹 Code · Class `card_expert_list_title` unused · Fix: delete · By: Designer
- 🧹 Code · Phone CSS repeats desktop; duplicate `min-height:auto`; `grid-column-gap:0px` · Fix: remove · By: API

Already decided: Match 145 high, Match/Glass offsets, 12 px labels, Expert name H6, subtitle −0.5rem, notch and arrow, Match surface dark-800, Glass greyscale/stays white/smaller %, hidden "%" and "Match score 85 %", no gradient stroke.
Not checked: Designer prop details, Brand theme, touch hover, real-page placements.

### Card Profile
Checked: API read-back · published 11:23 UTC · widths 1440, 1280, 990, 900, 768, 767, 479, 375, 315 · design profile.png

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ✅ | 🧹 | ✅ | 🧹 | ⚠️ | ⚠️ |

- ⚠️ Props / Design · Photos have no alt and editors cannot add one; planned Image Alt not built · Seen: all 10 `alt=""`; plan §3.4 · Fix: add altText prop Image Alt · By: API
- 🧹 Props · Screen Reader Text has no "fill in to make clickable" tooltip · Fix: copy Card Primary's · By: API
- 🧹 Spacing · `card_profile_content` row-gap 0.625rem not recorded (matches the design) · Fix: record · By: API
- 🧹 Code · 12 old Person/Case rules on Card Primary classes · Fix: clear per id · By: API
- 🧹 Code · Header phone rule repeats H5; badge base look hidden and fully overridden in Case · Fix: drop / move Case look into the base · By: API
- 🧹 Code · Role/Person ship an empty hidden `card_profile_top` · Fix: Badge condition on the top row · By: Designer

Already decided: Person job title regular, pill border Theme `border`, literal gradient colours and min-height, no zoom without link, showcase titles `<p>`, own classes.
Content: 509 × 339 stock photo, upscaled; 7 Lumos demo cards without photo.
Clean: every distance within 2 px at 315, gradient identical, no overflow at 8 widths, no hidden text of other variants, all texts Typography.

### Logo Tile
Checked: API read-back · page last-modified 11:24 UTC · widths 1440, 1280, 990, 900, 768, 767, 479, 375 · design logo.png

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ✅ | ✅ | ✅ | 🧹 | 🧹 | ⚠️ |

- ⚠️ Design · No width of its own: fills the row or shrinks to a sliver · Seen: design 178 px; build 418 px in the showcase; 29 px each in a 375 test row · Fix: fixed width + `flex: none` · By: owner
- ⚠️ Design · Logo size depends on empty space in the file · Seen: Agristo 87 × 27 ink (= design); placeholder drawn 333 × 100 · Fix: padding or max-height on the image · By: owner
- ⚠️ Design · Alt "Client logo" instead of "Agristo" · Fix: set Logo Alt on the instance · By: API
- ⚠️ Design · A white logo vanishes on a light section; no `card/logo-invert` · Fix: invert filter or per logo file · By: owner
- 🧹 Props · Default placeholder is a heavy grey slab · Fix: placeholder with logo-like empty space · By: Designer
- 🧹 Code · `align-self: flex-start`, `position: relative`, `display: flex` on the wrap do nothing · Fix: remove · By: API

Already decided: transparent, 6.25rem high, contain; own component in group Visual; placeholder defaults; literal 6.25rem.
Not checked: Designer prop order, Logo Alt binding, whether the 20 % fill in logo.png belongs to the tile, marquee behaviour (no marquee yet).

## Evidence
Scratchpad of session 7fbdca55 (not committed): `review/<unit>/` per reviewer, `review/example-components/sweep/`, `phase5/` and `phase5b/` card-check runs, `recheck/` (meta overflow and focus ring re-measurements).
