# Typography

Type is variables all the way down. The `Typography` collection holds the raw values (families, weights, trims, fluid sizes, line-heights, letter-spacings); the `Text Style` collection holds one mode per heading size and paragraph size; `u-text-style-*` utilities bind an element to a mode.

## Building text

- A text element is: custom class + `u-text-style-<style>`. Overrides (colour, max-width, margin) go on the custom class.
- Every `u-text-style-*` class is `display: flow-root` and carries the line-height trim, which removes the space above and below the glyphs so text aligns and spaces consistently. *(house)* It also sets family and letter-spacing, so it goes on plain text elements only, never on an element with flex, grid or its own font. Lumos also applies the trim to every text element tag through Global Styles; on a site without that, a text class you build yourself has no trim, its box is taller than the glyphs, and that is where unexplained whitespace comes from.
- *(house)* Size follows the design. Start from the text style whose size and line-height already equal the design's; when none does, override size and line-height on the custom class in `rem` so line breaks match the design, with smaller screens handled the way the site handles them (responsive variables, or breakpoint values when it has none). Measure each section's sizes: the same role (an eyebrow) can differ between two sections of one design.
- The element's tag (`h2`) is set separately from its look (`u-text-style-h3`), which is how a hero title can be an `h2` styled as `h3`.

## Figma boxes vs trimmed text *(house)*

Figma text boxes are untrimmed: a 14 px Text Main line is a 21 px box, a 12 px Text Small line an 18 px box. Under the Lumos trim the same text renders as a ~10 px box. Every distance Figma measures from a text box therefore comes out short in Webflow wherever text sits directly inside a padded or gapped container — a button 35 px tall instead of 46, a legal row 44 instead of 50, stacked links that nearly touch.

Keep the trim; give the **container** Figma's box:

- a button or a single text row: `min-height` = Figma's box height (46 px button → `2.875rem`, 50 px row → `3.125rem`), content centred;
- a list of text items: padding on the item (not the text) of `(Figma line box − trimmed height) / 2` top and bottom, e.g. `0.35rem` for 14 px / 21 px lines, `0.275rem` for 11 px / 16.5 px;
- then the gaps and paddings Figma gives between those boxes apply unchanged.

Labels, address lines and other one-line texts whose box must equal Figma's: combo `u-text-trim-off` on the text instead of padding the container. Measure **letter to letter** (text ranges), not box to box, when comparing a gap with Figma.

Measure both sides before calling it fixed: the Figma box height, and the built row's box with `getBoundingClientRect` (not the text's).

## Spacing between text elements

Lumos's Heading and Paragraph components carry a bottom margin. Margins collapse only when the parent is `display: block`, so the wrapper around an eyebrow + heading + paragraph + buttons stays block; a flex parent cannot overlap the margins and adds them up.

`u-margin-trim` on a parent removes the first child's margin-top and the last child's margin-bottom.

## Adding a size or style (in the Designer)

1. New size variable in Typography → font-size, made fluid with a `clamp()` in its value *(house; Lumos docs use the Fluid Builder app)*: [build/foundations.md](../../skills/build/foundations.md) §4.
2. New mode in Text Style; apply size, line-height, letter-spacing, transform, margin, family, weight, trim, text-wrap.
3. Duplicate a `u-text-style-*` class and connect it to the new mode.
4. In the Heading and Paragraph components, create a variant for the new size and connect it to the mode.

*(house)* In our builds this is a plan question for the user, never something a build does on its own.

## Fonts

Each family needs its own trim values (the line-height-trim tool gives them). *(house)* Or compute them from the font file (`fontkit`, hhea ascent and descent as positive numbers, cap height, units per em `u`): `trim-top = (cap − (ascent − descent) / 2) / u` and `trim-bottom = (ascent − descent) / 2 / u`, in `em`. Jost: 0.3525 / 0.3475; Neue Regrade Medium: 0.39 / 0.31. A second family gets its own `font/<name>-trim-top|bottom`, and the Text Style modes that use it point there. Fonts that render differently on Windows and Mac get run through Font Squirrel's generator first. *(house)* Missing fonts go in the plan's "Missing" list.
