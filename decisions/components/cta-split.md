# CTA Split (`CTA Split`, group Sections)

Plan: `references/plans/2026-11-02-home-cta.md`. Figma: `Content / CTA` (section `2323:32532`, set `content-cta` `2382:37326`); Home B instance `2710:48623`, mobile `2382:37372`. Tree, pictures and photo in `references/figma/home-cta/`. Check: `node references/cta-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`0a616993-6c18-5a74-963e-a5595d56d317`**.

## 2026-11-02 — New section, not a Split Content variant
Choice: new section component **CTA Split** (`cta-split_*`): one Brand-coloured card with a flush photo on one half and title, text and two buttons on the other.
Why: Split Content is a text column on white beside a notched photo with eyebrow, quote and checklist; the CTA shares only the two-part title. A variant would hide most of Split Content's props and add a card, a theme switch and a second image shape. The name describes the pattern, not the copy («Looking for a senior…» changes per page; the block is on 13 desktop page designs).

## 2026-11-02 — Recommended answers taken (no open questions)
- Title in two parts (Title + Title Muted, `swatch/light-100-o50`), no Title Break: on Home B the break is a natural wrap.
- H2 at every width (site rule scales 48 → 30); Figma mobile's H4 30 is the same size.
- Space Top `none` by default (10 of 13 instances follow a section with bottom space), `large` / `main` as on Split Content.
- Content padding 64 = literal `4rem` (no variable); ≤ 991 `space/7` (no design, between desktop and mobile), ≤ 767 `space/5` (Figma mobile 20).
- ~~Below 992 one column~~ → owner 2026-11-02: two columns down to 768; ≤ 767 one column, text first, photo 26.25rem high; buttons wrap, stacked ≤ 479.
- Home buttons: «Request a shortlist» → `/hire-an-expert`, «Discuss your project» → `/contact`.

## 2026-11-02 — Structure
`section.cta-split_wrap.u-theme-light` (`data-section="light"`, `data-cta-split`, `data-space-top` = prop) › `cta-split_contain.u-container` › `cta-split_card.u-theme-brand` (grid `minmax(0,1fr) minmax(0,1fr)`, gap 0, `radius/small`, `overflow: clip`; one column ≤ 767) ›
- `cta-split_visual` (relative, stretches to the card's height; ≤ 767 `order: 1`, 26.25rem) › Visual Image, variant **Cover**, Corners **on** (on = no radius class; off adds `u-radius-main`, 16 px — the card's 8 px clip does the rounding)
- `cta-split_content.u-text-trim-off` (flex column) › h2 `_title.u-text-style-h2` › span (Title) · span (space) · `wbr` · span `_muted` (Title Muted) · p `_text.u-text-style-large` (margin-top `space/4`) · `_actions` (margin-top `space/8`, gap `space/4`) › Button Main Primary + Secondary
- HTML embed (`u-embed-css`): Space Top rules (case-insensitive; `large` becomes `main` ≤ 991) and hiding an empty muted span.
Card colours come from `u-theme-brand` (Theme `background` = brand-500, text white); the Secondary button turns white by the theme (`decisions/site.md`, buttons follow the theme). Texts untrimmed, so Figma's gaps are literal (same as Split Content).

## 2026-11-02 — Space between the title parts must stay breakable
Conflict: a span holding only " " is stored by Webflow as `&nbsp;`, so the title could not break after «senior» and the browser split «project-controls» at the hyphen (3 lines at 1512, Figma 2).
Choice: a DOM `wbr` right after the space span. The text still reads «…senior project-controls…» when copied or crawled.
Note: Split Content has the same `&nbsp;` span; it only shows where Title Break is off and Title Muted is set (none on Home now).

## 2026-11-02 — Measured (staging, `references/cta-check.mjs`)
| Where | Figma | Built |
|---|---|---|
| Section at 1512 (Space Top none) | 612 high | 612 |
| Card | 64, 0, 1384 × 420 | same |
| Photo | 692 × 420 | same |
| Title / text / buttons (in card) | y 64 / 200 / 308 | same |
| Mobile 402: card | 362 × 840 | 362 × 839 |
| Mobile: title / text / buttons / photo | y 20 / 150 / 288 / 420 (420 high) | 20 / 149 / 287 / 419 (420 high) |
No sideways scroll at 1512 / 1280 / 1100 / 991 / 767 / 479 / 402, no text outside the card, no console errors.
Open (owner): below ~1280 the site's balanced heading wrap breaks «project-» / «controls» (1100: three lines «Looking for a / senior project- / controls expert?»; Figma mobile «Looking for a senior / project-controls / expert?»).

## 2026-11-02 — Props
Content: Title, Title Muted, Text · Buttons: Primary/Secondary Visibility, Text, Link · Image: Image (default the colleagues photo, asset `6ae8d89abe7ead5af35234f6`), Image Alt · Layout: Space Top.
Other pages' instances (Figma `instances.txt`): Opportunities mobile hides the second button (Secondary Visibility off); Contact, How it works and Clients have their own titles without a muted part (Title Muted empty).

## 2026-11-02 — Review (`references/audit/2026-11-02-cta-split.md`)
- Photo corners were 16 px inside the 8 px card: Visual Image's Corners prop is inverted (off = `u-radius-main`). Set to on.
- Kept like Split Content: prop folder order (Content, Buttons, Image, Layout; Visibility first), Space Top as free text, the CSS embed inside the component.
- Waiting for the owner: light focus ring on Brand/Dark sections (site-wide), tablet line length (with Split Content), the hyphen break in the title (site-wide balanced wrap).

## 2026-11-02 — Owner feedback round 1 (Aniek)
- "In Figma is het beeld links en de tekst rechts": desktop already was; owner chose to keep it side by side on tablets too. Card one column only ≤ 767 (`small`), photo `order: 1` + 26.25rem there. At 991 the card is now photo 452 | text 452 (padding `space/7`).
- Light focus ring on purple and dark sections: solved for all Button Main buttons site-wide (see `decisions/components/button.md`).
- Rest stays as built ("het blok is goed"): tablet line length and the hyphen break in the title are closed as owner choices.
