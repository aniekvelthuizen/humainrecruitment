# Reading Figma

## Getting the design out

- One call per node on the Figma MCP. Dump each section once into `references/figma/<page>/section-NN.md` (structure, text, sizes, colours, **opacity**, the **full** `characters` of every text node) plus `section-NN.png`. Builds read the dump, never Figma.
- Ask the user for one PNG per section and one full-page SVG export with text not outlined. The SVG holds exact paths, page-wide decoration lines and opacity; PNGs are for comparing renders.
- A "building blocks" or patterns page is the designer's own component inventory. Fetch it separately and read it before indexing.
- Theme (light/dark) comes from frame fills, not from variable definitions.
- Dump a section frame's **direct children** before its content tree. Decoration (corner marks, crosshairs, bleeding rules) lives there as siblings of the content and is missed by a walk of the nested structure.
- An exported vector path is the node's unrotated geometry. Confirm orientation from the render or a pixel decode of the export before building an asymmetric shape.
- Which page a section belongs to is the page frame it sits in, not the page being worked on. Walk up to it.

## Mapping to CSS

- Figma's auto-layout gap is its only spacing tool. A gap between text boxes is smaller than the CSS distance it implies (line-height). Margins on text, gap on lists.
- A "bolder" paragraph is often opacity (100% vs 80%), not weight. Check opacity before weight.
- Colours without a variable: nearest theme variable, else a raw swatch. Gradient fills and decorative rectangles are colours too.
- Measure the design's content column against the site's before assuming 1:1 pixels.
- A page-wide line Figma draws once but Webflow would draw per section as a border: decide in the plan who draws it.
- Elements bleeding outside a frame (a background at y = −150) are invisible on a dark page and a bug on a light one. Read the spec of any reused component for bleeds.

## Design slips

Report, never silently correct: a radius on an invisible box, a stray colour, a section in a different typeface, a size off the spacing scale. The plan lists them, the user decides, the decision goes to `decisions/`.
