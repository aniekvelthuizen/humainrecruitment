# Plan — <name> — <yyyy-mm-dd>

## In short

<For the person who says OK. Five lines at most, plain words, short sentences: what gets built, what it reuses, which existing things it touches, and the choices you need from them. A class name or a number only where it decides something. Everything below this block is detail for whoever wants to check it.>

Source: <figma url | screenshot + sentence | document path | the brief, one line>
Exemplar: <brief only: page, element id, what is copied, what differs>
Page(s): <name (id)> — Figma page frame: <frame name (node id)>
Insertion: <parent element, before/after which element>
Neighbours' system: <what the sections above/below on this page use>
Responsive: <per breakpoint, how each part reflows — columns 4→2→1, rows wrap, columns stack. Name any scroller/slider and why reflow could not work>

## Reuse

Every design section (and every card, button or item in it) mapped to what the site has, before any unit is planned as new.

| Design section / element | Existing component | Decision | Reason |
|---|---|---|---|
| Hero | `Section Hero` | place | identical |
| Partners | `Section Logos` | extend: `Title Visibility` toggle | same look, no title in the design |
| Pricing | — | new | no section with a price grid |

## Units

| # | Unit | Type | Reuses | Creates (classes) | Touches (existing classes) | Parallel with |
|---|---|---|---|---|---|---|
| 1 | Hero | section | — | `c-hero_wrap`, `c-hero_title`, `c-hero_actions` | — | 2 |
| 2 | Pricing | section | component `Card` | `c-pricing_wrap`, `c-pricing_grid` | `card` (add combo `is-featured`) | 1 |

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Hero | Figma padding 24, scale has 16/32 | design value, literal `1.5rem`, noted in `decisions/` |

## Missing

- <font / image / copy / collection>

## Questions

<asking.md format, or "none">
