# Size and spacing

Spacing sizes are fluid: they scale between `site/viewport-min` (20rem by default) and `site/viewport-max` (90rem by default) and stop at both ends. Lumos edits them through the Fluid Builder app; *(house)* we put a `clamp()` in the variable's value instead: [variables.md](variables.md), "Fluid values".

## Core site variables

| Variable | Meaning |
|---|---|
| `site/viewport-max`, `site/viewport-min` | where fluid scaling stops |
| `site/margin` | space between the container and the screen edge |
| `site/gutter` | default gap between grid columns; static by default; can be made fluid ([variables.md](variables.md)) |
| `site/column-count` | the design's main column count, usually 12 |
| `site/column-width` | used by the breakout grid class; never adjusted |

## Spacing scale

- `space--1` … `space--8` (CSS form `--_spacing---space--n`): distances between elements inside a section. Most margin and gap utilities draw from these eight, so changing them re-spaces the site.
- The section-space folder: top and bottom space of each section; its page-top value is for a section at the top of the page, under the nav. The smallest section space is larger than `space--8`, so an in-section space never reads as a section break.
- *(house)* **Every distance the design gives is built at that value**: between cards, inside a card, heading to paragraph, paragraph to button, above and below the section. A step when it equals it (within 1 px); between steps (24 between 16 and 32) the design's literal `rem`, made responsive the way the site does it (responsive variables, or breakpoint values when it has none), and a line in `decisions/`. Never rounded to a step unless the plan names it as a deviation before building, never borrowed from a neighbouring section because it is close, never dropped because the frame reads as flush — measure it and build it.
- *(house)* The **section shell** is the exception: rails, borders, corner marks and the section's own outer spacing follow the neighbouring sections on the page. A cropped Figma frame does not draw them; their absence in one frame is a conflict to raise, not a spec to follow.

## Margin vs gap

- **Gap** for lists of like items and grid columns.
- **Margin** for stacked text elements: each element type carries its own distance without wrapper divs.
- Margins collapse (2rem bottom meets 1rem top → 2rem total), only vertically, only on block/flex/grid elements themselves, and only when the **parent is `display: block`**. Under a flex or grid parent they add up.
- `u-margin-trim` on a parent strips the outer margins of its first and last child.

## Units

`rem` for sizes. `em` for container queries (`40em`) and, *(house)*, for an icon or gap sitting beside `clamp()`-sized text so it tracks the text. Never `px`, never `vw`.
