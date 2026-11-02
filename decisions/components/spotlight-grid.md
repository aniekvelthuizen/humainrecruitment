# Spotlight Grid (`Spotlight Grid`, group Sections)

Plan: `references/plans/2026-11-02-home-expertise.md`. Figma: `Content / Services` (`2323:32509`), variant `type=expertise` (`2710:56984`); Home B instance `2710:48619`. Spec and pictures in `references/figma/home-expertise/`. Check: `node references/spotlight-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`4f869313-df74-a104-5f38-525a63bf2e32`**.

## 2026-11-02 — Only the expertise variant; tabs not built
Figma's `Content / Services` set has four desktop variants. Only `type=expertise` is on a real page (1. Home B). The tabbed `type=services` is on `[figma-only] 1. Home A` only — owner (Aniek): "stond op de oude versie van de homepage, dus dat met de tabjes hoef je niet te bouwen". `variant-2` / `variant3` are used nowhere. None of them is built.

## 2026-11-02 — Name describes the pattern
Choice: **Spotlight Grid** (`spotlight-grid_*`): centred header over three columns — a list of cards, a tall feature panel (quote + cut-out photo on the brand gradient), a second list. Not «Services» or «Expertise», so the copy can change.

## 2026-11-02 — Structure
`section.spotlight-grid_wrap.u-theme-light` (`data-section="light"`, `data-spotlight-grid`) › `spotlight-grid_contain.u-container` (gap 48 from `u-container`) ›
- `spotlight-grid_header.u-text-trim-off` (flex column, gap `space/3`, max 71.5rem, centred) › p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1` › span (Title) + span " " + br + span `_muted` (Title Muted, opacity 0.5)
- `spotlight-grid_layout` (grid 3 × `minmax(0,1fr)`, gap `space/7`, `align-items: center`) ›
  - `spotlight-grid_list` (`role="list"`, flex column, gap `space/7`) › slot **List Start**
  - `spotlight-grid_panel.u-theme-brand` (min-height 47.875rem, padding 4rem / `space/6` / 0, radius `radius/small`, `overflow: hidden`, gradient `gradient/brand-start | brand-middle 70.19 % | brand-end` top → bottom, as footer and Hero Experts) › figure `_quote.u-text-trim-off` › blockquote `_quote-text.u-text-style-h3` + figcaption `_person.u-text-trim-off` › p `_name` (Text Large) · p `_role` (Text Small, opacity 0.5) · p `_company` (Text Small, uppercase, margin-top `space/2`) · `_visual` › img `_image`
  - `spotlight-grid_list` › slot **List End**
Plain section, not the Lumos `Section` wrapper (same route as the other Home sections). Texts untrimmed (`u-text-trim-off`) so every gap is Figma's number.

## 2026-11-02 — Photo
Figma's visible fill is a cut-out (transparent background), mirrored horizontally, 598 × 398, left 11, bottom 0, clipped by the panel. Uploaded already mirrored: `spotlight-expertise-lisette` (`6ae8d856812d3edb22206286`, 1200 × 800, compressed to WebP 84 KB). ≥ 992: absolute, `left: 50%` + `translateX(-35%)` so the same point of the photo stays under the panel centre at every column width; 37.375rem wide. < 992: in the flow under the person, centred, max 37.375rem, `margin-top: space/7`.

## 2026-11-02 — Responsive (no mobile design)
Owner's answer (recommended): ≥ 992 three columns as Figma (columns shrink below 1512); 768–991 the two card lists side by side, panel full width under them (`order: 1`, `grid-column: 1 / -1`); < 768 one column, the six cards then the panel. Section bottom `section-space/large` (192), below 992 `section-space/main` (96); top 0 everywhere (follows the white Split Content #1, as Figma).

## 2026-11-02 — Cards
Six Card Primary **Discipline** instances (three per slot): Variant Discipline, Title + Text from Figma, Link `/project-delivery-experts` (Figma has none; recommended answer until discipline pages exist) + Screen Reader Text «View <role> experts» (clickable = both set, `cards.md`), Button Icon Visibility on («→ View»), Icon Visibility off, Role off (= `listitem`). Titles **H3** — set in the Designer (Claude in Chrome: instance › Title › Edit Rich Text › select › H3), because the API writes rich text as `<p>`. Slots were filled through the API (`insert_in_slot` on the page instance now works; it did not on 2026-11-01).

## 2026-11-02 — Props
Content: **Eyebrow**, **Title**, **Title Muted** · Quote: **Quote**, **Name**, **Role**, **Company**, **Image** (default the Lisette photo), **Image Alt** · slots **List Start**, **List End**.

## 2026-11-02 — Measured on staging (1512)
| Part | Figma | Built |
|---|---|---|
| Section | 1190 high, padding 0 / 192 | 1190, 0 / 192 |
| Header / eyebrow / title | 184,0 1144 × 184 / h 24 / y 34 h 150 | same |
| Layout | 64,232 1384 × 766 | same |
| Panel | 536,232 440 × 766 | same |
| Quote | 560,296 392 × 135 | same |
| Cards | 440 × 194, 32 apart, lists centred (y 292) | 440 × 198, 32 apart, y 286 (Discipline card is 4 px taller, known since 2026-10-30) |
| Person | name y 463, role h 18, company y 519 | name y 463 after the figcaption fix, role h 21 (site Text Small line-height 1.5; Figma «auto») |

Deviations kept: the quote's line breaks follow the site H3's balanced wrapping, not Figma's; card text wraps one word earlier than Figma (existing Discipline card).
Webflow's default `figcaption { margin-top: 5px }` pushed the person down 5 px: `spotlight-grid_person` margin-top 0.

## 2026-11-02 — Review fixes
Review: `references/audit/2026-11-02-spotlight-grid.md` (fresh reviewer, no API access).
- Quote broke inside «go-/to». Quote default now uses non-breaking hyphens (U+2011) in «go‑to» and «high‑quality», as the hero writes «Pre‑Qualified». Editors typing a quote with a hyphenated word can do the same.
- Below 992 the person in the photo sat left of the centred quote (she stands at 34 % of the file). `spotlight-grid_visual` at `medium`: `transform: translateX(16%)`; the empty right side of the cut-out is clipped by the panel.

## 2026-11-02 — Columns 992–1279 kept; block done (owner)
Review finding 3: between 992 and ~1150 px the three columns are narrow (280 px at 992), card texts wrap differently and the two card columns start at different heights. Options were: keep it, or use the two-column layout up to 1279. Owner (Aniek): "ik vind het goed zoals hij nu is — helemaal af zo". Kept as built; block closed. Review finding 4 (sections not on Example Components) and the quote person/alt text were not taken up.

## 2026-11-02 — Variant «Reviews» (Home «Testimonials»)
Plan: `references/plans/2026-11-02-home-testimonials.md`. Figma `Content / Testimonials` (`2323:32727`, set `2378:35367`; Home B `2710:48620`, also on Hire an expert and About Us / Clients). Dump in `references/figma/home-testimonials/`, check: `node references/testimonials-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Why a variant, not a new section: same centred header and three columns of cards around the brand-gradient photo panel (owner rule: reuse as much as possible). Variant id `b3033716-7cb7-aab2-2d79-4ee7fc33ac44`; the Variant prop (`faba4de9-…`) was created by Webflow with the first variant.

**Structure change (base looks the same):** the panel now sits in `spotlight-grid_center` (flex column, gap `space/7`; 768–991 `order: 1` + full row, moved from the panel) under `spotlight-grid_center-list` (role list, slot **List Center**, `display: none` in base). The title `<br>` has `spotlight-grid_break`. New, all off by default so Expertise is unchanged:
- **Text Visibility** + **Text** → `p.spotlight-grid_text.u-text-style-large` (last in the header).
- **Rating Visibility** + **Rating Text** → `spotlight-grid_rating.u-text-trim-off` (pill: 1 px Theme `border`, `radius/round`, padding 9 / 15 + border = Figma 4 + 6 / 12, gap `space/4`) › `spotlight-grid_stars` (aria-hidden, 5 × Icon Set Star in `spotlight-grid_star`, `swatch/stars`, as Card Testimonial) + `p.spotlight-grid_rating-text.u-text-style-small` (line-height 1.3 = Figma 18 px, so the pill is 38 high).
- **Button Visibility** + **Button Text** + **Button Link** → `spotlight-grid_actions` (centred) › Button Main Primary (chevron).
- Quote props stay; Reviews hides the quote.

**Reviews styles:** wrap `swatch/light-200` + padding-top `section-space/large` (`main` below 992); quote and break hidden; center list shown; panel min-height 27.5rem (440); photo absolute, centred, 17.3125rem (277) at every width; below 992 one column (card 1, card 2, photo, card 3 — the mobile frame's order); below 768 gaps `space/5` (Figma mobile 20).
Background: the site has no grey Light theme yet (`site.md` 2026-10-30), so the swatch is set directly on the variant; the white Card Testimonial (`background-2`) shows as in Figma.

**Home instance:** Client reviews / Trusted by the + people who hire. / text with full stop (Home B has none; component and mobile frame do) / rating on / button «See all clients» → `/clients`. Photo `testimonials-reviews-man.png` (`6ae8e75f8896a7d6a926091c`, cut-out, 554 × 788). Cards: Card Testimonial × 3 (Chance Lipshutz, Jocelyn Westervelt, Marcus Levin; avatars `6ae48f51…` (existed), `6ae8e760636…`, `6ae8e7605df…`); company «Google» not «GOOGLE» (owner kept companies out of capitals, cards.md Q20). Cards link to `/clients` with Screen Reader Text «More client reviews», so their arrow shows as drawn (the arrow only renders on a clickable card).
Split Content #2 (after this section) Space Top none → **large**: it follows the grey section now instead of the white Expertise.

**Measured on staging (1512):** header, text (y 311), rating (590,389 332 × 38), layout (y 475), side cards (y 687 / 723), photo (618, bottom of panel) = Figma. Cards and everything under them +6 px: Card Testimonial is 6 px taller than Figma (known, cards.md Q6). 402: widths 362, padding 20, photo centred, order as the mobile frame, no sideways scroll.
