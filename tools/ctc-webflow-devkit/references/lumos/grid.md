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

```html
<style>
@container (width < 40em) {
	.blog_cms_list { --_column-count---value: 2 !important; }
}
@container (width < 20em) {
	.blog_cms_list { --_column-count---value: 1 !important; }
}
</style>
```

Column and row utilities on children set span, start and order.

## On a custom class (when the utilities do not fit) *(house)*

- `grid-template-columns: repeat(n, minmax(0, 1fr))`, so long content cannot blow a column open. Exception: a wide data table on mobile, where columns need a real min-width and the wrapper gets `overflow-x: auto`.
- Gap through `grid-column-gap` / `grid-row-gap` with a `space--*` or `site/gutter` variable: those are the property names the Webflow API accepts.
- Column count per screen size through the responsive variables, see [responsive.md](responsive.md).
