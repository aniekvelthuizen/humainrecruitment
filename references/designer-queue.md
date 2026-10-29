# Designer queue

## Open
- [ ] Button Main › Icon Set instance (in `button_main_icon`) — link its Variant to a new button prop **Icon** (folder Icon); move the **Variant** prop into folder **Button** — API: variant props cannot be created or regrouped — recipe: by hand (purple dot › New property) — then: set Tertiary instances on the Styleguide to Arrow Right — 2026-10-29
- [ ] Measure on staging (published 2026-10-29; humain-d16f03.webflow.io and cdn.prod.website-files.com are blocked by this environment's network policy) — then: `hover-check.mjs` + `hover-matrix.mjs` on Styleguide › Buttons at 1512 and 402 px, CDN CORS check on the icon masks — 2026-10-29
- [ ] Global Styles component › embed — check whether the trim CSS reads `--_text-style---trim-top|bottom`; if it has its own values, point it at those variables — API: embed content not returned by `get_all_elements` — recipe: by hand — then: measure a `u-text-style-h2` box against the glyphs — 2026-10-29
- [ ] Typography Heading / Paragraph components — add variants Text Medium, Label Large, Label linked to the new Text Style modes — API: no variant-to-mode binding — recipe: by hand — 2026-10-29
- [ ] Styleguide page — visual pass of colours (Base / Dark / Brand) and type scale — 2026-10-29

## Done
- [x] Button Main › `button_main_wrap` — box-shadow (4 layers, rest + `:hover` + `:focus-within`, colours `button-primary/shadow-1…4`) — 2026-10-29, done through the style API after all (read-back shows only `shadow-1`, published CSS is complete), read back: owner saw the shadow on staging
- [x] Variables panel › fluid formulas — pasted by the owner — 2026-10-29, read back: fresh dump + verify-foundations.py (360 passed, no pending fluid)
- [x] Fonts — Onest and Vend Sans uploaded as variable woff2 through the API (not Google Fonts) — 2026-10-29, 0 min in the Designer, read back: `list_fonts` (2 fonts, wght axes)
