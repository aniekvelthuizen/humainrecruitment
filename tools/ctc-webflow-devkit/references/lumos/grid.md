# Grid

`site/column-count` (usually 12) and `site/gutter` drive nearly every grid utility and the guides.

## The Grid component

The default way to lay out content: column count per breakpoint, gap, and variants for autofit, autofill and contained. Reach for it before writing a grid on a custom class.

## Utilities

| Utility | Behaviour |
|---|---|
| `u-grid-autofit` | columns stretch and fit into any extra space |
| `u-grid-autofill` | spare space stays empty when there are fewer cards; right for lists that get filtered |
| `u-grid-custom` | 12 columns by default, count overridable with `--_column-count---value` per container size |
| `u-grid-breakout` | adds one column on each side that expands to the screen edge; children use `grid-column-start: full \| content` and `grid-column-end: full \| content`. Never inside a `.u-container`. |
| `u-grid-subgrid` | a child spanning 8 parent columns becomes an 8-column grid itself |

Modes on the grid utilities: **Column Count** (max columns), **Gap** (both axes; override the vertical gap in the panel or with a utility), **Minimum Column Width** (custom property; when columns wrap).

The Lumos docs set `--_column-count---value` per container size in a `<style>` embed with `@container` rules. *(house)* That is styling in code ([lumos-rules.md](../lumos-rules.md) §0), and the API refuses custom properties on a class ([webflow-mcp.md](../webflow-mcp.md) §2): use the Grid component's column count, or set the value in the Designer UI.

Column and row utilities on children set span, start and order.

*(house)* Lumos `Layout` Columns is a 12-column grid with `:where()` spans: unequal columns are span overrides on the column classes, not max-width or flex. Lumos Layout and Grid respond to the **container** width, so a breakpoint-only override on top of them switches at a different width (seen ~830–991): set the override at the width the container query flips, or let the component do it.

## On a custom class (when the utilities do not fit) *(house)*

- `grid-template-columns: repeat(n, minmax(0, 1fr))`, so long content cannot blow a column open. Exception: a wide data table on mobile, where columns need a real min-width and the wrapper gets `overflow-x: auto`.
- Gap through `grid-column-gap` / `grid-row-gap` with a `space--*` or `site/gutter` variable: those are the property names the Webflow API accepts.
- Column count per screen size through the responsive variables, see [responsive.md](responsive.md).
