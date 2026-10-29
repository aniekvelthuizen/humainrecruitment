# Designer queue

## Open
- [ ] Variables panel › fluid formulas — paste the six `clamp()` values from `references/fluid-values.md` (site/margin, site/gutter, font-size/display, h1, h2, h3) — API: `custom_value` → "internal error" (re-tested 2026-10-29) — recipe: by hand (no browser route in the cloud session; retried with the Bridge connected 2026-10-29, still "internal error", also for a plain `clamp(1.25rem, 3.964vw + 0.2539rem, 4rem)`) — then: `python3 -I references/verify-foundations.py references/variables.json` after a fresh dump must report no pending fluid values — 2026-10-29
- [ ] Global Styles component › embed — check whether the trim CSS reads `--_text-style---trim-top|bottom`; if it has its own values, point it at those variables — API: embed content not returned by `get_all_elements` — recipe: by hand — then: measure a `u-text-style-h2` box against the glyphs — 2026-10-29
- [ ] Typography Heading / Paragraph components — add variants Text Medium, Label Large, Label linked to the new Text Style modes — API: no variant-to-mode binding — recipe: by hand — 2026-10-29
- [ ] Styleguide page — visual pass of colours (Base / Dark / Brand) and type scale — 2026-10-29

## Done
- [x] Fonts — Onest and Vend Sans uploaded as variable woff2 through the API (not Google Fonts) — 2026-10-29, 0 min in the Designer, read back: `list_fonts` (2 fonts, wght axes)
