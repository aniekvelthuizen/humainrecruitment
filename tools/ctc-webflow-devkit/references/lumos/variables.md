# Variables

Variables are how a Lumos site stays globally editable. A value that belongs to the design system is a variable; a value that describes one element's behaviour is a plain style.

## Use a variable for

1. Typography: family, size, weight, capitalisation, letter-spacing, line-height
2. Colour: text, background, border, outline, stroke
3. Page structure: page padding, container max widths, section spacing
4. Sizing: padding, margin, grid and flex gaps
5. Layout: grid column count, gap, alignment
6. Misc: border radius, border width, hover and state effects

## Use a plain style or a utility for

Display (block, flex, grid), layout utilities, width and height, opacity, overflow, anything not in the list above.

## Collections you will meet

| Collection | Holds | Edit |
|---|---|---|
| Default | swatches; max width, gutter, margin; border radius | at branding |
| Theme | the section's background, text and border colours and the primary/secondary button styles, per mode | at branding |
| Typography | raw families, weights, trims, fluid sizes, line-heights, letter-spacings | at branding |
| Text Style | one mode per heading size and paragraph size, consumed by `u-text-style-*` | new text style |
| Spacing | `space--1` … `space--8` and the section-space folder (`--_spacing---space--7` is the CSS form) | `clamp()` in the value, [build/foundations.md](../../skills/build/foundations.md) §4 *(house; Lumos docs: Fluid Builder)* |
| Column Count, Alignment | used by the utilities | generally not |

`references/variables.json` in the client repo holds this site's actual collections, names and ids. Read it before assuming a variable exists; the CSS names above are the Lumos starter's and a site may differ.

## Applying

Two ways, in this order of preference:

1. **Stack a utility** that already carries the variables: `card_title` + `u-text-style-h3`. Override specific properties on the custom class.
2. **Reference the variable on the custom class.** *(house)* In the MCP: `variable_as_value` with the full id from `variables.json`, `variable-` prefix included. Properties the Designer panel does not expose (text-transform, custom properties) take the variable as a literal `var(--_typography---text-transform--uppercase)`.

*(house)* Never a raw `px`, never a hex colour where a variable exists. Accepted literals are listed in the router.
