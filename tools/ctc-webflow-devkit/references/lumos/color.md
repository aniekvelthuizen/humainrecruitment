# Colour

Colour is a theme, not a value. A section, card or page carries a theme; every element inside picks its colours from that theme through variables, so switching the theme recolours everything at once.

## Layers

1. **Swatches** (Default collection): the raw colours, `--swatch--brand-500`, `--swatch--dark-800`. The brand swatch has a `-text` partner (`--swatch--brand-text`): wherever `--swatch--brand-500` is a background, `--swatch--brand-text` is the text colour, so a future darker brand changes its text colour from one place. Add `brand-secondary-text` and the like when needed. `color-mix()` derives shades and opacities from a base swatch.
2. **Theme** collection, one mode per theme: the section's background, text and border colours, and the primary (solid) and secondary (outlined) button styles. Extend with folders such as `card/background`, `input/border-hover`, `input/border-focus` when the design needs them. *(house)* Webflow exposes them as `--_theme---…`; the exact names for this site are in `references/variables.json`.
3. **`u-theme-*` classes** apply a theme to a wrapper; `u-brand-*` classes do the same for a brand. Everything inside inherits.

## Building

- Text, background, border and button colours: Theme variables, never a swatch directly, never hex. *(house)*
- *(house)* A shape that visually belongs to the neighbouring section (a notch, an overlap crossing the boundary) takes that section's swatch, because the theme variable resolves to the wrong mode where the shape sits.
- *(house)* Design colours with no variable: nearest theme variable; if none fits, a swatch; the plan says so. Gradient fills and decorative rectangles are colours too.
- *(house)* Gradient stops and `text-shadow` do not take `var()` through the API; literal values there, named in the plan.

## Themed components

Component variants `Inherit`, `Light`, `Dark`, …: the base variant has the theme/text and theme/background variables applied; each variant sets its theme; `Inherit` applies none and follows the page.

## Animating between themes

Lumos ships `theme-collector.js` (GSAP): it reads the Theme collection and any `u-theme-*` / `u-brand-*` classes, and `colorThemes.getTheme("dark", "orange")` returns the variable set to tween to. Custom code, outside the build loop.
