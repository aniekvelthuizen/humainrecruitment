# CTA Split (`CTA Split`, group Sections)

Plan: `references/plans/2026-11-02-home-cta.md`. Figma: `Content / CTA` (section `2323:32532`, set `content-cta` `2382:37326`); Home B instance `2710:48623`, mobile `2382:37372`. Tree, pictures and photo in `references/figma/home-cta/`. Aniek Velthuizen with Claude.
Status 2026-11-02: planned, not built (no Webflow connector reaches the site).

## 2026-11-02 — New section, not a Split Content variant
Choice: new section component **CTA Split** (`cta-split_*`): one Brand-coloured card with a flush photo on one half and title, text and two buttons on the other.
Why: Split Content is a text column on white beside a notched photo with eyebrow, quote and checklist; the CTA shares only the two-part title. A variant would hide most of Split Content's props and add a card, a theme switch and a second image shape. The name describes the pattern, not the copy («Looking for a senior…» changes per page; the block is on 13 desktop page designs).

## 2026-11-02 — Recommended answers taken (no open questions)
- Title in two parts (Title + Title Muted, `swatch/light-100-o50`), no Title Break: on Home B the break is a natural wrap.
- H2 at every width (site rule scales 48 → 30); Figma mobile's H4 30 is the same size.
- Space Top `none` by default (10 of 13 instances follow a section with bottom space), `large` / `main` as on Split Content.
- Content padding 64 = literal `4rem` (no variable); mobile `space/5`.
- Below 992 one column, text first, photo 26.25rem high; buttons wrap, stacked below 480.
- Home buttons: «Request a shortlist» → `/hire-an-expert`, «Discuss your project» → `/contact`.
