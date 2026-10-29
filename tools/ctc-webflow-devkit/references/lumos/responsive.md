# Responsive without breakpoints

Lumos applies no styles on Webflow's tablet and mobile breakpoints. Layouts respond to available space and to the user's font size, in `rem`, so a doubled font size wraps instead of overflowing.

## What responsive means here *(house)*

The small-screen layout is the one a reader expects, reached with the techniques below in order:

1. **Reflow** — a 4-column card grid becomes 2, then 1. A horizontal flexbox wraps. Text columns stack.
2. **Resize** — fluid type and fluid spacing carry most of it with no layout change at all.
3. **Rearrange** — move or reorder a piece when the design draws it that way.
4. **Scroll or slide** — a horizontal scroller, slider or carousel. This is a **design decision**, not a fallback: use it when the design shows one, or when reflow genuinely cannot work (a wide data table, a long logo strip) and the plan says so.

Reaching for 4 first is the common mistake — a row of three cards does not become a slider, it becomes a column. When in doubt, stack.

## The six techniques

1. **Wrap horizontal flexboxes.** The browser decides when to wrap; longer translations and bigger fonts still fit.
2. **Lumos grids** (`u-grid-autofit`, `u-grid-autofill`, the `Grid` component): the column count follows the space and one minimum column width.
3. **Fluid typography**: sizes scale between the min and max viewport, so nothing has to be redone per screen.
4. **No `px`**: borders, radius, shadows and padding in `rem`, so they scale with the user's font size and never overflow a rem container.
5. **Responsive variables** when a value or display must differ per screen size: see below.
6. **Container queries** for the rest: `container-type: inline-size` on the container or any parent, `@container (width < 40em)` on the children. Reuse the same sizes as the responsive variables so a threshold change later is one edit.

## Responsive variables

Four screen sizes: `large`, `medium`, `small`, `xsmall`; the thresholds for medium, small and xsmall are set in the Global Styles component. The docs' examples multiply values by `--_responsive---<size>` and switch display or direction with `var(--flex-medium, grid)`:

```css
/* different sizes for large & medium vs small & xsmall */
padding-top: calc(
  var(--_spacing---space--7) * max(var(--_responsive---large), var(--_responsive---medium)) +
  var(--_spacing---space--5) * max(var(--_responsive---small), var(--_responsive---xsmall))
);

/* different sizes for large vs smaller screens */
padding-top: calc(
  var(--_spacing---space--7) * var(--_responsive---large) +
  var(--_spacing---space--5) * max(var(--_responsive---medium), var(--_responsive---small), var(--_responsive---xsmall))
);

display: var(--flex-medium, grid);          /* change from grid to flexbox on medium screens */
display: var(--block-small, flex);          /* change from flex to block on small screens */
flex-direction: var(--column-medium, row);  /* vertical on medium screens */
flex-direction: var(--row-medium, column);  /* horizontal on medium screens */

/* column count per screen size */
grid-template-columns: repeat(calc(6 * var(--_responsive---large) + 4 * var(--_responsive---medium) + 2 * var(--_responsive---small) + 1 * var(--_responsive---xsmall)), minmax(0,1fr));
```

Style both states on the main breakpoint first (the grid's columns and gap, the flex's direction and alignment), then paste the custom property; after that the Designer's own controls for alignment, column count and gap no longer apply. Add `flex-wrap: wrap` when the flexbox may wrap.

*(house)* Whether a `medium` switch also covers the smaller sizes is decided by the site's Global Styles CSS, not by these docs; read it once per site and record it in `decisions/site.md`.

**Precondition** *(house)*: these variables come from the Lumos Global Styles component. Check `references/variables.json` (a `Responsive` collection, `--flex-medium` and friends). Absent: `var(--flex-medium, grid)` is a dead switch that always reads `grid`. Then, and only then, use Webflow breakpoints through `update_style` with `breakpoint_id`, changing only what changes, and note it in `decisions/site.md`.

## JS with container sizes

`match-container.js` gives `element.observeContainer("(width < 40em)", match => …)` for scripts that must follow the container instead of the viewport. Custom code, outside the build loop.

## Screen heights *(house)*

A sticky full-screen stage behind scrolling content (a photo that stays while a list scrolls over it) is `100lvh`, not `100svh`: with `svh` iOS shows a strip of the next section under the photo once the toolbar collapses (PMS). `dvh` for panels that must fit the visible screen (a nav panel).
