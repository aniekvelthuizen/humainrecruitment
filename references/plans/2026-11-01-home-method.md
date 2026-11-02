# Plan — Home "Our method" (scrolly telling, glass steps) — 2026-11-01

Work by Aniek Velthuizen (with Claude). Kit `skills/build` (+ `componentize`, `interactions`). Figma read in Claude in Chrome with the Plugin API (Figma MCP at its tool-call limit); pictures in `references/figma/home-method/`. Webflow through the claude.ai Webflow connector (`846065a5-…`).

## In short

- Builds the Home B block «our method / The top 5% found before you need them.» (Figma `Content scrolly telling / Glass cards`, instance `2710:48618`): intro left (eyebrow, two-tone title, text, Primary button), three tilted glass step cards (1 · 2 · 3) on the right, brand gradient behind.
- New section component **Sticky Steps** (`sticky-steps_*`): the intro column stays in view while the cards scroll past ("scrolly telling"); below 992 px everything stacks and nothing sticks.
- Cards: new Card Primary variant **Process** (from Glass: same glass, ring, blur, shadow), number in a mint ring, optional pill and checklist (off on Home B, on for Hire an Expert / How it works). Cards sit in a slot, so other pages bring their own.
- Reuses: Button Main Primary + Chevron Right, Card Bullet, the brand gradient variables, the site text styles.
- Goes on Home after the block the other session is building («The risk», Stagger Cards), so: Hero → The risk → Our method.

Source: https://www.figma.com/design/18m34a7vzkzopkwGoojmUx/Humain--Lumos-?node-id=2710-48618
Component set: `Content scrolly telling / Glass cards` (`2378:31868`): device=desktop (`2233:4246`, 1512 × 1821), device=mobile (`2378:31869`, 402 × 2165). Used on 1. Home B (overrides, 1394 high), `[figma-only]` 1. Home A, 2. Hire an expert and the mobile frame 1. Home (default copy «How it works / Hiring Project Talent. Simplified.», pills + checklists on).
Card set: `Content / Process step` (`2292:32747`): style=glass (`2045:11371`, built now), style=plain (`2292:32748`, How it works / Analyse my resume — later, same variant family).
Page: Home (`6ae35365a38b2d71cab8c699`) — Figma page frame **1. Home B** (`2710:48615`), y 1829, between «Frame 592» (The risk, other session) and «Content / Content block».
Insertion: `page_main` (`62930284-…`), after the The-risk section (or after Hero Experts until that exists; order checked before hand-over).
Neighbours' system: Hero Experts (plain section, Theme Brand, `u-container`, own padding on the wrap, brand gradient), The risk (plain section, eyebrow = plain text `u-text-style-label-large`, h2 with the H1 look + span). Same route here.

## The design (desktop 1512)

- Section: gradient top → bottom `gradient/brand-start` 0 % · `gradient/brand-middle` **80 %** · `gradient/brand-end` 100 % (hero: 70 %). Padding 64 / 64 / 192 / 64, columns 555 + gap 32 + rest.
- Both columns start 128 below the padding (Figma pads each group and each card with 128 at the top): content top at 192.
- Intro (555, text 521): eyebrow «our method» (Label Large, caps via style, white) · 10 · title H1 60/125 Vend Sans Bold, «The top 5% found » white + «before» / «you need them.» `brand-accent-500` · 10 · text Text Large 20/150 white · 48 · Button Primary «See how we select» + chevron right.
- Cards (687 wide, card 1 drawn 676 — slip), 128 + 48 = 176 between cards, rotated: 1 = −2°, 2 = +2°, 3 = −2° (CSS sense; Figma +2/−2/+2 counter-clockwise).
- Card: white 20 % (`card/glass` Brand), 1 px white → transparent → white ring, blur 40, the 5-layer faint shadow, radius small (8), padding 24, gap 16: ring 48 (2 px `brand-accent-500`, number Onest SemiBold 16/24 mint) · 16 · [pill «Day 1 · 30 min call», Text Small, hidden] · title H5 24 · 8 · text Text Medium 18/150 · 16 · [checklist 3 × Card Bullet, hidden].
- Mobile (402): padding 96 / 20, intro on top (title 30 in Figma → site H1 mobile 36, site rule), cards full width (362) below, same tilt, same 128 + 48 between.

## Reuse

| Design part | Resolves to | Decision |
|---|---|---|
| Section | — | **new** `Sticky Steps` (group Sections); no section on the site has a sticky intro beside a card column |
| Step card (glass) | `Card Primary` | **extend**: new variant **Process** (duplicate of Glass). Number = the existing **Eyebrow** prop/part, drawn as the ring and moved first (`order`), so no new element or prop; pill = Badge (Badge Visibility), checklist = List + Card Bullet slot (List Visibility, List Title empty) |
| Checklist items | `Card Bullet` | place (Hire an Expert / How it works; none on Home B) |
| Button | `Button Main` Primary, Icon Chevron Right | place |
| Eyebrow | plain text `u-text-style-label-large` | as The risk (Lumos Typography Eyebrow adds a dash Figma lacks) |
| Title | h2 `u-text-style-h1` + accent span | as the hero / The risk; span colour Theme `heading-accent` if it is mint in Brand, else `card/accent` |
| Gradient | `gradient/brand-*` | reuse, own stop position 80 % |

## Units

| # | Unit | Type | Reuses | Creates | Touches |
|---|---|---|---|---|---|
| 1 | Card Primary **Process** | variant | Glass styles | variant only (styles per variant on `card_primary_*`) | Eyebrow tooltip |
| 2 | Sticky Steps | section component | Button Main, Card Primary Process ×3 | `sticky-steps_wrap`, `_contain`, `_layout`, `_intro`, `_eyebrow`, `_title`, `_accent`, `_text`, `_actions`, `_list`, `_item` | — |

Order: 1 → 2, in this session (the builder agents' connector cannot reach this site). Card Primary is only edited per variant, so the other session's Glass cards do not change.

Responsive:
- ≥ 992: two columns, intro sticky (`top`: nav height + `space/8`), cards in the right column, max 687 wide.
- < 992: one column, intro first, nothing sticky, cards full width; section padding and gaps as the mobile frame (96 top/bottom, 128 + 48 between cards, 32 between intro and cards).
- Tilt kept at every width (it is small: ±2°); off for `prefers-reduced-motion`? No — it is static, not motion.

Interactive: sticky intro (CSS only). Button hover/focus = Button Main's own. Cards have no link, so no hover (Figma has none).

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Card 1 | 676 wide, cards 2 and 3 are 687 | all 687 |
| 2 | Gradient | middle stop 80 % here, 70 % on the hero | as Figma (80 %) |
| 3 | Mobile title | 30 in the mobile frame | site H1 mobile size 36 (site.md rule) |
| 4 | Figma "128 top padding" inside every card | a spacer, not card padding | built as the space between cards (176) and above the columns (192) |

## Missing

- Nothing: copy is final in Figma, no images.

## Questions

Owner answers (2026-11-01, Aniek):
- Q1 scroll: "links is sticky inderdaad en kaarten stapelen over elkaar heen" + a screenshot of the cards piled up, tilted, card 3 on top. So: intro sticky, and every card sticks at the same height, the next one sliding over the previous (a tilted stack); the stack lets go when the list ends.
- Q2 button target: not answered → recommended **How It Works** (`/how-it-works`), easy to change on the instance.
