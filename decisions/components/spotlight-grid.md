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
