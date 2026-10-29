# Plan — Foundations (variables, themes, fonts, type scale) — 2026-10-29

## In short

The Figma file is already Lumos-named, so almost every Figma variable maps 1:1 onto a Lumos variable: update where the starter has it, create where it does not.
Colours: 27 swatches and 45 theme colours in three themes (Base → Lumos' light base mode, Dark, Brand).
Type: Onest for body text, Vend Sans for headings; ten text styles as in Lumos, plus Text Medium, Label and Label Large.
Page margin, gutter and the Display/H1/H2/H3 sizes scale with the screen; the mobile heading sizes come from the style the designer used for the same title on mobile.
Status 2026-10-29: written through the API and verified by script (log.md); fluid formulas wait for the Variables panel.

Source: https://www.figma.com/design/18m34a7vzkzopkwGoojmUx/Humain--Lumos- (collections Default, Theme, Sizes, Typography, Text Style; 16 text styles)
Frames: desktop 1512 px, mobile 402 px → `site/viewport-min` 25.125, `site/viewport-max` 94.5 (rem numbers)

## Write order (foundations.md §3)

swatches → Theme (every mode) → Typography → Spacing / sizes → Text Style modes → `u-text-style-*` classes for the new modes → trims. Fluid values afterwards in the Variables panel (§4). Then verify by script (§5) and the Styleguide page.

## 1. Swatches (Lumos `Default` collection)

Static colours. Opacity swatches as 8-digit hex (API refuses `color-mix()`). Update when the starter has the name, otherwise create in this order.

| Figma | Value |
|---|---|
| swatch/brand-100 … brand-900 | #d3ccde, #a899bd, #7c669b, #51337a, **#250059 (500)**, #1e0047, #160035, #0f0024, #070012 |
| swatch/brand-text | #ffffff |
| swatch/brand-text-o20 | #ffffff33 |
| swatch/brand-secondary-500 | #0082a6 |
| swatch/brand-accent-500 | #00ffd5 |
| swatch/brand-pink-500 | #e5bbb7 |
| swatch/light-100 | #ffffff |
| swatch/light-100-o50 / -o25 / -o20 | #ffffff80 / #ffffff40 / #ffffff33 |
| swatch/light-200 | #edf1f7 |
| swatch/dark-800 | #1c2332 |
| swatch/dark-900 | #030b1b |
| swatch/dark-900-o50 / -o25 / -o20 / -o10 | #030b1b80 / #030b1b40 / #030b1b33 / #030b1b1a |
| swatch/stars | #ffbf66 |
| swatch/transparent | #ffffff00 |

## 2. Theme (Lumos `Theme` collection)

Modes: Figma **Base** = Lumos' base (light) mode, **Dark** = Lumos `Dark`, **Brand** = new mode `Brand`. Usage in the designs: Base 85×, Brand 50×, Dark 0× (only via defaults).
All values are aliases to swatches (or to other theme variables), per mode:

| Variable | Base | Dark | Brand |
|---|---|---|---|
| background | light-200 | dark-900 | brand-500 |
| background-2 | light-100 | dark-800 | brand-400 |
| background-skeleton | dark-900-o10 | light-100-o20 | light-100-o20 |
| text | dark-900 | light-100 | brand-text |
| heading-accent | brand-600 | brand-500 | brand-text |
| border | dark-900-o20 | light-100-o20 | brand-text-o20 |
| selection/background · selection/text | brand-300 · brand-text | same | same |
| button-primary/background · -hover | brand-accent-500 | same | same |
| button-primary/border · -hover | → button-primary/background(-hover) | same | same |
| button-primary/text · -hover · accent · accent-hover | dark-900 | same | same |
| button-secondary/background | transparent | same | same |
| button-secondary/border · text · background-hover · border-hover · accent | → text | same | same |
| button-secondary/text-hover | light-100 | dark-900 | brand-500 |
| button-secondary/accent-hover | → button-secondary/text-hover | same | same |
| button-secondary-white/background | transparent | same | same |
| button-secondary-white/background-hover · border · border-hover · text · accent | light-100 | same | same |
| button-secondary-white/text-hover · accent-hover | dark-900 | same | same |
| button-tertiary/text · accent | → text | same | same |
| button-tertiary/text-hover · accent-hover | brand-500 | brand-accent-500 | brand-accent-500 |
| button-back/text · accent | light-100 | same | same |
| button-back/text-hover · accent-hover | brand-accent-500 | same | same |
| text-link/text | → text | same | same |
| text-link/border | → border | same | same |
| text-link/text-hover | brand-500 | brand-accent-500 | brand-accent-500 |
| text-link/border-hover | → text | brand-500 | → text |
| nav/background | → background-2 | → background-2 | → background |

New theme variables are created in one call per group, in the order above (they land at the bottom of the collection).

## 3. Typography (Lumos `Typography` collection)

| Variable | Value | Note |
|---|---|---|
| font/primary-family | Onest | body |
| font/secondary-family | Vend Sans | headings |
| font/primary-light · regular · medium · semibold · bold | 300 · 400 · 500 · 600 · 700 | **semibold is new**: Figma uses Onest SemiBold ~230× without a variable (house rule: every weight used gets a variable + `u-weight-*`) |
| font/secondary-semibold · bold | 600 · 700 | |
| font-size/* | see below | |
| line-height/small · medium · large · huge | 1 · 1.1 · 1.3 · 1.5 | + `line-height/heading` 1.25 (confirmed) |
| letter-spacing/tight · normal | -0.03em · 0 | headings use normal (confirmed) |
| text-transform/none · uppercase · capitalize · lowercase | as named | |
| font/primary-trim-top · bottom, font/secondary-trim-top · bottom | from the font files (typography.md "Fonts") | computed once the fonts are on the site |

Font sizes (desktop value written as static rem; fluid ones get their `clamp()` from fluid-values.md):

| Variable | px | rem |
|---|---|---|
| font-size/text-small | 14 | 0.875 |
| font-size/text-main | 16 | 1 |
| font-size/text-medium | 18 | 1.125 (new) |
| font-size/text-large | 20 | 1.25 |
| font-size/text-label | 12 | 0.75 (new, for Label) |
| font-size/h6 | 20 | 1.25 |
| font-size/h5 | 24 | 1.5 |
| font-size/h4 | 30 | 1.875 |
| font-size/h3 | 36 (mobile 30) | 2.25, fluid 1.875 → 2.25 |
| font-size/h2 | 48 (mobile 30) | 3, fluid 1.875 → 3 |
| font-size/h1 | 60 (mobile 36) | 3.75, fluid 2.25 → 3.75 |
| font-size/display | 72 (mobile 36) | 4.5, fluid 2.25 → 4.5 |

## 4. Sizes → Lumos `Default` / `Spacing`

| Variable | Desktop px | Mobile px | Webflow |
|---|---|---|---|
| site/margin | 64 | 20 | **fluid** 1.25 → 4 rem (fluid-values.md) |
| site/gutter | 32 | 20 | **fluid** 1.25 → 2 rem (fluid-values.md) |
| site/viewport-min · max | 402 · 1512 | | 25.125 · 94.5 (numbers) |
| site/column-count | 12 | 5 | 12; mobile reflows by layout, not by column count |
| max-width/small · main | 800 · 1512 | | 50 · 94.5 rem |
| max-width/full | 99999 | | keep Lumos' 100% formula, do not overwrite |
| radius/none · small · medium · main · round | 0 · 8 · 12 · 16 · 9999 | | 0 · 0.5 · 0.75 · 1 rem · keep Lumos' round value |
| border-width/main · thick | 1 · 2 | | 0.0625 · 0.125 rem |
| nav/height | 80 | | 5 rem |
| button-size/small · medium | 32 · 48 | | 2 · 3 rem |
| space/0 … 8 | 0, 4, 8, 10, 16, 20, 24, 32, 48 | same | 0, 0.25, 0.5, 0.625, 1, 1.25, 1.5, 2, 3 rem (static, as in Figma) |
| section-space/none · small · main · large | 0 · 48 · 96 · 192 | same | 0 · 3 · 6 · 12 rem |

`site/column-width`, `nav/height-total`, `focus/offset-inner` stay as Lumos ships them.

## 5. Text Style modes

Figma's text styles are what the pages use; the Text Style variables in Figma disagree with them on line-height and letter-spacing. Owner confirmed: follow the text styles.

| Mode | Size | Line-height | Letter-sp. | Family / weight | Margin top · bottom | Transform | Uses |
|---|---|---|---|---|---|---|---|
| Display | display | 1 | 0 | secondary / semibold | space/7 · space/6 | none | 22 |
| H1 | h1 | 1.25 | 0 | secondary / bold | space/7 · space/5 | none | 56 |
| H2 | h2 | 1.25 | 0 | secondary / bold | space/7 · space/5 | none | 51 |
| H3 | h3 | 1.25 | 0 | secondary / bold | space/7 · space/5 | none | 30 |
| H4 | h4 | 1.25 | 0 | secondary / bold | space/7 · space/4 | none | 51 |
| H5 | h5 | 1.25 | 0 | secondary / bold | space/7 · space/4 | none | 168 |
| H6 | h6 | 1.5 | 0 | secondary / bold | space/7 · space/4 | none | 127 |
| Text Large | text-large | 1.5 | 0 | primary / regular | space/4 · space/4 | none | 283 |
| **Text Medium** (new) | text-medium | 1.5 | 0 | primary / regular | space/4 · space/4 | none | 117 |
| Text Main | text-main | 1.5 | 0 | primary / regular | space/4 · space/4 | none | 762 |
| Text Small | text-small | 1.5 | 0 | primary / regular | space/4 · space/4 | none | 226 |
| **Label Large** (new) | text-main | 1.5 | 0.1em | primary / regular | space/4 · space/4 | uppercase | 99 |
| **Label** (new) | text-label | 1.5 | 0.1em | primary / regular | space/4 · space/4 | uppercase | 127 |

New modes get a `u-text-style-text-medium`, `u-text-style-label-large`, `u-text-style-label` class (copied from `u-text-style-main`, then the mode set). Heading/Paragraph component variants for them are a Designer step (queued).

Not made into text styles: Display Large (128 px, 3×), Text XX Large (48 px, 3×), Text X Large (36 px, 7×) — one-offs, sized on their own class when the section is built.

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Text Style line-height | Text styles: H1–H5 125 %, H6 150 %, Display 100 %. Variables: H1/H2/Display → 1, H3–H6 → 1.1 | Follow the text styles (what is applied 1,000+ times); add `line-height/heading` 1.25 |
| 2 | Text Style letter-spacing | Variables: H3–Display `tight` (-0.03). Text styles: 0 | Follow the text styles: 0 |
| 3 | Text Small | line-height "auto" in Figma | 1.5 like the other body styles |
| 4 | Font sizes | Figma's Mobile mode has the same sizes as Desktop | Resolved: mobile size per level read from the mobile frames (decisions/site.md) |
| 5 | Headings with 110 % line-height | ~150 raw text layers use Vend Sans 24/30 at 110 %, outside the text styles | Leave the scale alone; handle per section |
| 6 | Unstyled Onest sizes | 11, 13, 15, 17, 23 px used without a style (mono labels, card meta) | Per section, on the element's class |
| 8 | IBM Plex Mono | Only in the `[figma-only]` documentation frames | Not added — Onest and Vend Sans only (owner rule) |
| 7 | Effect styles "Card", "Card 2", gradients "Humain", "Gradient - Green", "Radial" | No variable type for shadows/gradients | Literal values on the card/section classes when those are built |

## Missing

- ~~Webflow site access~~ — resolved 2026-10-29 (site Humain, `6ae35364a38b2d71cab8c607`).
- Fonts on the site: Onest, Vend Sans (both Google Fonts) — checked after the site dump.

## Questions

All answered on 2026-10-29 (decisions/site.md). None open.
