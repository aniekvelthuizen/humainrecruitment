# Stagger Cards (`Stagger Cards`, group Sections)

Plan: `references/plans/2026-11-01-home-risk.md`. Figma spec: `references/figma/home-risk/spec.md`. Check: `node references/stagger-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`d411ac47-9ded-6b19-b16a-c98a3c6fa631`**. Figma `Content / 4 UBRS` (`2365:38273`), Home B instance `2710:48617` («The risk»).

## 2026-11-01 — Name describes the pattern
Choice: **Stagger Cards** (`stagger-cards_*`): a centred header over a row of cards that step down. Not "risk" or "UBRS" — the same section can hold any copy and any number of cards.

## 2026-11-01 — Plain section with a card slot (owner, Q2)
Same route as Hero Experts (`hero-experts.md`), same reason: the API cannot reach anything nested in a Lumos Section's slots. Structure:
`section.stagger-cards_wrap.u-theme-light` (`data-section="light"`, `data-stagger-cards`) › `stagger-cards_contain.u-container` › `stagger-cards_header` (eyebrow p · h2 · text p) + `stagger-cards_list` (`role="list"`) › slot **Card Primary** (`u-display-contents`); then a CSS embed (`u-embed-css`).
Combo classes `stagger-cards_* + u-*` were created empty first: `set_style` with two names fails ("style not found") until the combo exists.

## 2026-11-01 — Cards = Card Primary Glass
Each card is a `Card Primary` instance, variant **Glass**, in the slot: Icon (Schedule Outline / Project Controls / Person Search), Title, Text; no link, no button; **Role off** (= `role="listitem"`). Titles are **H3** — set in the Designer (instance › Properties › Title › Edit Rich Text › select › H3 › close with the ×), because a Title set through the API becomes a `<p>`. A new card in this section needs the same three steps.
Known differences from Figma: the site's Glass card is 230 high (Figma 226) and draws a faint white gradient edge (Figma none here) — both shared with the Glass variant elsewhere, not changed.

## 2026-11-01 — Card heights: content decides (owner, Q1)
Figma fixes the middle card at 263 (others 226) — a slip. Built: every card as high as its content. Card Primary's wrap is `height: 100%`, which stretched all three to the stepped row (326); the embed sets the slot children to `height: auto`.

## 2026-11-01 — Title
`h2` with the H1 look (`u-text-style-h1`) — the hero holds the page's only `h1`. Two spans: full colour + `stagger-cards_muted` (opacity 0.5 = Figma `dark-900-o50`), each bound to a prop. Phones: H1 shrinks fluidly to 36 (site rule; Figma mobile draws H4 30). Eyebrow: plain p with `u-text-style-label-large` at every width (Lumos `Typography Eyebrow` adds a marker Figma does not have; Figma mobile uses Label 12 — kept one style).

## 2026-11-01 — Spacing (text is trimmed to cap height / baseline on this site, so Figma box gaps are converted)
Font metrics read in the browser (Onest 16/24: cap 6.19 / baseline 17.5 from the line top; Vend Sans 60/75: 16.5 / 58.5).

| Where | Figma (trimmed) | Built | Measured 1512 |
|---|---|---|---|
| Section top → eyebrow cap | 134.2 | padding-top `8.375rem` | 134 |
| Eyebrow baseline → title cap | 33 | header gap `2.0625rem` | 33 |
| Title baseline → cards | 64.5 | contain gap `4rem` | 64 |
| Cards: x / width / gap | 64 · 536 · 1008 / 440 / 32 | grid 3 × 1fr, gap `space/7` | same |
| Step of card 2 / 3 | 48 / 96 | embed: `space/8` / `section-space/main` (from 992) | 48 / 96 |
| Last card → section bottom | 128 | padding-bottom `8rem` | 128 |

128 is off the section-space scale (main 96, large 192): literal. ≤ 767 (Figma mobile frame): padding-top `6.375rem` (96 + eyebrow cap), bottom `section-space/main`, header gap `1.625rem`, title → cards `3.625rem`, cards gap `space/5` (20).

## 2026-11-01 — Layout per width
≥ 992: three columns, stepping 0 / 48 / 96 (the embed repeats it per three cards: 3n+2, 3n). < 992: one column, full width, no step (Figma mobile). Three 210 px columns at 768 would wrap the 24 px titles to 3–4 lines.

## 2026-11-01 — Glow
New Theme colour **`glow/mint`** = `#00e5e566` (Figma `#00e5e5` at 40 %; same in every mode). Background on `stagger-cards_wrap`: `radial-gradient(58.28% 52.94% at 50% 105.94%, glow/mint 49.5%, transparent 100%)`; ≤ 767 `radial-gradient(162.5% 44.8% at 50% 87.3%, glow/mint 10%, transparent 100%)` (Figma mobile). The API read-back shows only the variable id for `background-image`; the published CSS has the full gradient (checked).

## 2026-11-01 — Props
Folders in visual order: **Eyebrow** (Text «The risk», Visibility on) · **Title** (Text «One wrong hire costs », Muted Text «more than a year of fees.») · **Text** (Text, Visibility **off** — Figma's hidden subtitle) · slot **Card Primary**. Slots start empty in new instances (Webflow cannot hold default slot content): add Card Primary instances, set Variant Glass, Role off, Title as H3.

## 2026-11-01 — Review (fresh reviewer agent, from the published page)
Passed: spacing at 1512 and 402 as the table above; no sideways scroll or text outside a card at 2560–402; one h1, then h2 and 3 × h3; list with 3 listitems; muted title part ≈ 3.7 : 1 (AA for large text), eyebrow ≈ 19 : 1; glow pixel-equal to Figma at the bottom centre; hidden Text prop not in the DOM. Not checked by the reviewer (no API access): props — bindings and defaults were read back in this session.
Owner (Aniek, 2026-11-01): all three are fine as built ("1: prima, 2: prima zo, 3: prima") — rows of three, the shared Glass look, the step in the section's CSS embed. The block is done.
1. **Card count**: the section is built for rows of three. A 4th card starts a new row under card 1 (with card 1's step band above it); 2 cards leave the right third empty. Figma Home A draws 4 cards in one row — not built.
2. **Glass look on white**: cards render white (255) where Figma shows 249 grey, and the site shadow is a little stronger (5/4/3/1 % vs Figma 2/2/1/0/0 %). Shared with every Glass card (`card/glass`, `card/shadow-*`); not changed here.
3. **Layout CSS in an embed**: the step (nth-child 3n+2 / 3n) and `height: auto` live in the section's own CSS embed, as Hero Experts does. Webflow classes have no nth-child(3n) state and cannot style slot children, so plain classes cannot do it; moving it to site-wide Custom Code is the alternative.

## 2026-11-05 — 3 UBRS and Client journey as variants (Aniek Velthuizen, via Claude)
Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 9. Figma: `references/figma/rest-of-site/stagger-extended/`. Base («The risk») has no style changes; all new props default to off, and its CSS rules are untouched.
- **Plain** (`1fbb5cd4-3a2a-cbb0-b7c5-79628b529688`), 3 UBRS: no glow (`background-image: none`, also at small, because the base writes it again there). Cards: Card Primary Engagement.
- **Gradient** (`ff6897f0-d422-dc3b-382d-e89c61bf1fc9`), Client journey: brand gradient 0 / 70 / 100 %, also at small. Theme Brand mode on the combo `stagger-cards_wrap.u-theme-light`, because a variant cannot swap a class. Column gap `site/gutter`. Cards: Card Primary Journey.
- **Both:** Text is Text Large (mode on the combo `stagger-cards_text.u-text-style-main`). Margins `0.0625rem` / `-0.5rem`, because the text is trimmed: title → text 34 (Figma 34.2), text → cards 56 (Figma 56.1). The text is removed from the DOM when off, so Home without it keeps title → cards at 64.
- **Props (Layout, Title):** Title Break (off) shows a `<br>` before Muted Text. Nav Colour (`light`) → `data-section`; **set `dark` on Gradient**, a variant cannot change an attribute. Space Top and Space Bottom (empty) → `data-space-top`, `data-space-bottom`: `large` 192 (≤ 991: 96), `main` 96, `none` 0; empty keeps 128. Space Top adds 0.375rem in the embed for the trimmed eyebrow, as the base's 8.375rem does.
- **Home's spacing:** Figma's instance is 746 high and its picture has the eyebrow at the top edge and 192 under the cards, so Space Top `none` and Space Bottom `large`. Hire and How It Works keep the default.
- **Gradient per width:** ≥ 1280 five columns (a `large` style) with steps 24 / 48 / 80 / 112 (embed, selected by `data-wf--stagger-cards--variant`). 992–1279 three columns with the base's steps, 3 + 2 cards: five columns there would be about 160 wide at 992 and the 24 px titles and 36 px values no longer fit. < 992 one column, like the base. No design exists below 1512.
- **Measured in a simulation** (published CSS and Example Components cards in headless Chrome at 1512, 1280, 1100, 992, 991, 767, 402): no sideways scroll, no text outside a card. At 1512 Hire is 778 high (Figma 775), Home 749 (746), Client journey 766 (765); the difference is the shared card height (Engagement 230 vs 226, Journey 202 vs 200). Not yet checked on the published page.
- **Placed (test pages, end of `page_main`):** Home `2dd081fd-8c82-1b13-4e70-ca63804a93c1`, Hire an Expert `de4d8808-ce16-70a2-49d3-0bc34a563244`, How It Works `8e757d1a-b01f-ae81-731c-668b3be17cda`.
