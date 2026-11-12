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
| Spacing | `space--1` … `space--8` and the section-space folder (`--_spacing---space--7` is the CSS form) | fluid: below |
| Column Count, Alignment | used by the utilities | generally not |

`references/variables.json` in the client repo holds this site's actual collections, names and ids. Read it before assuming a variable exists; the CSS names above are the Lumos starter's and a site may differ.

## Fluid values *(house)*

Fluid sizes (spacing, `site/gutter`, font sizes) scale between `site/viewport-min` and `site/viewport-max`. Set those two to the design's mobile and desktop frame widths in rem (375 px = 23.4375 rem). The API cannot write fluid values, so the `clamp()` goes **into the variable's own value** through the Variables panel in the Designer, as Lumos ships it on `site/gutter` — not the Fluid Builder app the Lumos docs use, not a `:root` block in custom code. Formula, route and what must never be made fluid: [build/foundations.md](../../skills/build/foundations.md) §4.

## Applying

Two ways, in this order of preference:

1. **Stack a utility** that already carries the variables: `card_title` + `u-text-style-h3`. Override specific properties on the custom class.
2. **Reference the variable on the custom class.** *(house)* In the MCP: `variable_as_value` with the full id from `variables.json`, `variable-` prefix included. Properties the Designer panel does not expose (text-transform) take the variable as a literal `var(--_typography---text-transform--uppercase)`. Custom properties (`--_theme---text`) on a class are refused by the API: use a variable mode (`set_style_variable_mode`) or the Lumos instance's Style prop ([webflow-mcp.md](../webflow-mcp.md) §2).

## Accepted literals *(house)*

Never a raw `px`, never a hex colour where a variable exists. Accepted literals, always named in the plan:

- `font-weight` without a font variable;
- gradient stops and `text-shadow` (the API takes no `var()` there, [color.md](color.md));
- `em` beside `clamp()` text;
- a type size no token equals: literal `rem`, flagged;
- a spacing size off the scale: the design's value in literal `rem`, noted in `decisions/` ([spacing.md](spacing.md)).
