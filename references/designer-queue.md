# Designer queue

## Open
- [ ] Button Main › Icon Set instance (in `button_main_icon`) — link its Variant to a new button prop **Icon** (folder Icon); move the **Variant** prop into folder **Button** — API: variant props cannot be created or regrouped — recipe: by hand (purple dot › New property) — then: set Tertiary instances on the Styleguide to Arrow Right — 2026-10-29
- [ ] Button Main › `button_main_wrap` — box-shadow, colours from Theme variables: rest `0 0.25rem 0.5rem 0 shadow-1, 0 0.875rem 0.875rem 0 shadow-2, 0 2rem 1.1875rem 0 shadow-3, 0 3.5rem 1.4375rem 0 shadow-4`; `:hover` and `:focus-within` `0 0.125rem 0.25rem 0 shadow-1, 0 0.4375rem 0.4375rem 0 shadow-2, 0 1rem 0.625rem 0 shadow-3, 0 1.75rem 0.6875rem 0 shadow-4` (`button-primary/shadow-N`) — API: a box-shadow with variable colours is flattened to one variable — recipe: by hand (Styles › Box shadows, colour = variable) — then: read the published CSS — 2026-10-29
- [ ] Measure on staging (published 2026-10-29; humain-d16f03.webflow.io and cdn.prod.website-files.com are blocked by this environment's network policy) — then: `hover-check.mjs` + `hover-matrix.mjs` on Styleguide › Buttons at 1512 and 402 px, CDN CORS check on the icon masks — 2026-10-29
- [ ] Global Styles component › embed — check whether the trim CSS reads `--_text-style---trim-top|bottom`; if it has its own values, point it at those variables — API: embed content not returned by `get_all_elements` — recipe: by hand — then: measure a `u-text-style-h2` box against the glyphs — 2026-10-29
- [ ] Typography Heading / Paragraph components — add variants Text Medium, Label Large, Label linked to the new Text Style modes — API: no variant-to-mode binding — recipe: by hand — 2026-10-29
- [ ] Styleguide page — visual pass of colours (Base / Dark / Brand) and type scale — 2026-10-29

## Done
- [x] Variables panel › fluid formulas — pasted by the owner — 2026-10-29, read back: fresh dump + verify-foundations.py (360 passed, no pending fluid)
- [x] Fonts — Onest and Vend Sans uploaded as variable woff2 through the API (not Google Fonts) — 2026-10-29, 0 min in the Designer, read back: `list_fonts` (2 fonts, wght axes)
