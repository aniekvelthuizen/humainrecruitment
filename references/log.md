# Log

## 2026-10-29 — Site dump + foundations (step 1)
- Linked site Humain `6ae35364a38b2d71cab8c607` (only site in the Webflow login; "Jerome" not visible/not touched). Staging `humain-d16f03.webflow.io`.
- Dump: 7 pages, 650 class names (55 combos), 55 components, 0 uploaded fonts, 0 CMS collections, 10 variable collections. No agent instructions on the site.
- Wrote via API, in order: 27 swatches (18 updated, 9 new; opacity as 8-digit hex) → Theme 45 variables × Base/Dark/Brand (20 new: button accents, secondary-white, tertiary, back) → Typography (Onest / Vend Sans, sizes in rem, new light/semibold weights, secondary weights, `line-height/heading` 1.25, `text-medium`, `text-label`, `letter-spacing/wide`) → default/Spacing (viewport 25.125–94.5, margin 4rem, gutter 2rem, radius, borders, nav 5rem, button-size/small, space/0–8, section-space) → Text Style: 3 new modes (Text Medium, Label Large, Label), all 13 modes set → classes `u-text-style-text-medium`, `u-text-style-label-large`, `u-text-style-label` (+ mode), `u-weight-semibold` → trims (Onest 0.3745/0.3325 em, Vend Sans 0.35/0.35 em; Text Style `trim-top|bottom` per mode).
- `custom_value` (clamp) still refused by the API → the six fluid variables hold their desktop value; formulas queued for the Variables panel (designer-queue.md).
- Verified: `references/verify-foundations.py` on a fresh `variables.json` → 360 passed, 0 failed (theme hex per mode, text style per mode, sizes, Lumos formulas intact, no px, only Onest/Vend Sans). Mutation test (one hex changed) → 10 failures, so the check bites.
- Open: fluid formulas, Google Fonts in Site settings, trim check in Global Styles, Heading/Paragraph variants (designer-queue.md). Nothing published.

## 2026-10-29 — Fonts + fluid retry
- Uploaded Onest (`6ae3697494487c4f8c1f87ca`) and Vend Sans (`6ae369748fd5754ba016c952`) as variable woff2 via `create_font` + S3 POST (201, MD5-checked). `list_fonts` shows both.
- Retried the clamp formula with the Designer Bridge connected: still "internal error", also for a plain clamp. The Designer tool has no variable actions; the formulas stay a manual paste (fluid-values.md).
