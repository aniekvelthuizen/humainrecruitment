# Plan — Home «Expertise» (Spotlight Grid) — 2026-11-02

Work by Aniek Velthuizen (with Claude). Kit `skills/build` (+ `componentize`). Figma read in Claude in Chrome with the Plugin API (Figma MCP at its call limit after one call); spec and pictures in `references/figma/home-expertise/`.

## In short

- Build the `type=expertise` variant of Figma `Content / Services`: centred eyebrow + two-tone H1, then three columns — 3 discipline cards · a tall brand-gradient quote panel with a photo · 3 discipline cards.
- The tab variant (`type=services`) is **not built**: it only sits on the old `[figma-only] 1. Home A` (owner, 2026-11-02). `variant-2` / `variant3` are used nowhere.
- Reuses Card Primary **Discipline** (made for exactly these 6 cards on 2026-10-30) and the `gradient/brand-*` variables. New: one section component **Spotlight Grid**.
- Goes on Home between Split Content #1 and Split Content #2 (Home B order).
- **Blocked:** none of the three Webflow connectors reaches site `6ae35364a38b2d71cab8c607` (404; they list Core/THDV/Wayfinder, Buitencampus, and the Studijob site). Building starts once a connector is connected to the Humain workspace.

Source: https://www.figma.com/design/18m34a7vzkzopkwGoojmUx/Humain--Lumos-?node-id=2323-32509 (instance on Home B: `2710:48619`)
Page(s): Home — Figma page frame: 1. Home B (`2710:48615`)
Insertion: `page_main`, after Split Content #1 («Selected by people who did the job.»), before Split Content #2 («Working in project controls?»)
Neighbours' system: plain `section.<name>_wrap.u-theme-light` (`data-section="light"`) › `<name>_contain.u-container` › own classes + `u-text-style-*`; two-tone titles with a `_muted` span at opacity 0.5 (Stagger Cards, Split Content). Split Content #1 ends with 192 bottom padding, so this section starts at 0, like Figma.
Responsive:
- ≥ 992: three columns as Figma (`minmax(0,1fr)` × 3, gap `space/7`), side lists centred against the panel, panel min-height 47.875rem (766); columns shrink below 1512.
- 768–991: the two card lists side by side (two columns), panel full width under them.
- < 768: one column — 6 cards, then the panel.
- Below 992 the panel's photo moves into the flow at the bottom (centred, max 37.375rem / 598), so the panel grows with its text. H1 → mobile 36, H3 quote → 30 (site rule).

## Reuse

| Design section / element | Existing component | Decision | Reason |
|---|---|---|---|
| Section | — | **new** `Spotlight Grid` | no section with card columns around a feature panel; the tabbed Services section is not built |
| Eyebrow / two-tone H1 | plain texts with `u-text-style-label-large` / `u-text-style-h1` | as Stagger Cards / Split Content | same pattern |
| 6 role cards | Card Primary **Discipline** | **place** ×6 in two slots | built for these cards (`decisions/components/cards.md`); hover, Tertiary «→ View», 24 padding all there |
| Quote panel | Card Testimonial | **not reused** — new part inside the section (`spotlight-grid_panel`) | Card Testimonial is a white card with rating, avatar and arrow link; this is a gradient panel with a big cut-out photo, used once |
| Panel background | `gradient/brand-start | brand-middle | brand-end` | reuse | same three stops as footer and Hero Experts (Figma 0 / 70.2 / 100 %) |
| Photo | `Visual Image`? | plain `img` in `spotlight-grid_visual` | absolute, cut-out PNG, no ratio box needed |

## Units

| # | Unit | Type | Reuses | Creates (classes) | Touches | Parallel with |
|---|---|---|---|---|---|---|
| 1 | Photo upload | asset | — | `spotlight-expertise-lisette.png` (1200 × 800, mirrored, transparent) | — | — |
| 2 | Spotlight Grid | section component | Card Primary Discipline ×6 | `spotlight-grid_wrap`, `_contain`, `_header`, `_eyebrow`, `_title`, `_muted`, `_layout`, `_list`, `_panel`, `_quote`, `_person`, `_name`, `_role`, `_company`, `_visual`, `_image` | — | — |

In this session, 1 → 2. Card titles set to H3 in the Designer (as on the other Home sections).

Props: Content `Eyebrow`, `Title`, `Title Muted` · Panel `Quote`, `Name`, `Role`, `Company`, `Image`, `Image Alt` · slots `List Start`, `List End` (Card Primary).

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Mobile | no mobile drawing of `expertise` (mobile Home draws the tab variant) | the reflow above: 2 columns 768–991, 1 column below, panel after the cards |
| 2 | «→ View» links | Figma has none; no discipline pages exist | all six to `/project-delivery-experts` for now |
| 3 | Card title | Figma 24 / 110 %; Discipline uses the site's H5 (1.25) | keep the site's Discipline card (4 px taller per line, decided 2026-10-30) |
| 4 | Card title colour | Figma `#1a1c1e` unbound | Theme `text` (`#030b1b`), as on the Discipline card already |
| 5 | Company | «Ingeniva» uppercase via text-case | `text-transform: uppercase` in CSS, copy stays «Ingeniva» |
| 6 | Photo | 1.09 MB PNG cut-out; no WebP tool here | 1200 × 800 PNG (757 KB), `loading="lazy"`; smaller WebP later |

## Missing

- Webflow API access to the Humain site (all connectors 404).

## Questions

1. Mobile order (no design): cards first, then the quote panel? **Recommended: yes**, 2 columns of cards 768–991, 1 column below.
2. «View» links: all to `/project-delivery-experts` until discipline pages exist? **Recommended: yes.**
3. Connector: reconnect a Webflow connector to the workspace that holds «Humain» (claude.ai connector settings or `/mcp` in a terminal), then I build.

Owner (Aniek, 2026-11-02): "Connector staat, bouw" — the claude.ai Webflow connector (`846065a5-…`) reaches Humain again; Q1 and Q2 built with the recommended answers.
