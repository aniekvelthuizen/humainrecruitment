# Designer queue

## Open
- [ ] Variables panel › fluid formulas — paste the six `clamp()` values from `references/fluid-values.md` (site/margin, site/gutter, font-size/display, h1, h2, h3) — API: `custom_value` → "internal error" (re-tested 2026-10-29) — recipe: by hand (no browser route in the cloud session) — then: `python3 -I references/verify-foundations.py references/variables.json` after a fresh dump must report no pending fluid values — 2026-10-29
- [ ] Site settings › Fonts — add Google Fonts **Onest** (300–700) and **Vend Sans** (600, 700) — API: `data_fonts_tool` only lists uploaded fonts, Google Fonts are not reachable — recipe: by hand — then: Styleguide page renders both families — 2026-10-29
- [ ] Global Styles component › embed — check whether the trim CSS reads `--_text-style---trim-top|bottom`; if it has its own values, point it at those variables — API: embed content not returned by `get_all_elements` — recipe: by hand — then: measure a `u-text-style-h2` box against the glyphs — 2026-10-29
- [ ] Typography Heading / Paragraph components — add variants Text Medium, Label Large, Label linked to the new Text Style modes — API: no variant-to-mode binding — recipe: by hand — 2026-10-29
- [ ] Styleguide page — visual pass of colours (Base / Dark / Brand) and type scale — 2026-10-29

## Done
