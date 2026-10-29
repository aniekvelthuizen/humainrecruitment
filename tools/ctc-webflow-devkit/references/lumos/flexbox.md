# Flexbox

Flexbox, like margin, goes on the custom class when possible; the utilities are for applying a layout quickly without over-stacking.

| Group | Utilities |
|---|---|
| Display | `u-flex-horizontal-wrap`, `u-flex-horizontal-nowrap`, `u-flex-vertical-wrap`, `u-flex-vertical-nowrap` |
| Align items (vertical when the flexbox is horizontal) | `u-align-items-start` / `-center` / `-end` / `-stretch` / `-variable` |
| Justify content | `u-justify-content-start` / `-center` / `-end` / `-between` / `-around` / `-variable` |
| Align self (on a child of a flexbox or grid) | `u-align-self-start` / `-center` / `-end` / `-stretch` / `-variable` |
| Basis | `u-flex-grow`, `u-flex-shrink`, `u-flex-noshrink` |

The `-variable` utilities are connected to the Alignment mode.

Rules:

- Horizontal flexboxes wrap, so the browser decides when the layout breaks.
- Text stacks (eyebrow, heading, paragraph, buttons) are **not** flex: block parent, margins between children. A flex parent cannot collapse the margins and adds them up.
- Direction per screen size: `flex-direction: var(--column-medium, row)`, see [responsive.md](responsive.md).
