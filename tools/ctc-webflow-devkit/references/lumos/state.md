# Trigger and state

CSS interactions without embeds or JS: a parent carries a `data-trigger` or `data-state` attribute, Lumos sets custom properties on it when the condition is met, and children style themselves from those properties. Classes and variables can be renamed without breaking custom code, every style stays visible in the panel, and component variants can override states natively.

## Attributes

State, active when a condition is met:

| `data-state` | active when the element is or contains |
|---|---|
| `checked` | a checked checkbox or radio |
| `current` | a link block to the current page, or an anchor link to the current section |
| `open` | an open menu button, open dropdown toggle or open dropdown list |
| `expanded` | a child with `aria-expanded="true"` (open dropdown toggles, custom accordions) |
| `external` | a link that opens in a new tab |
| class `is-active` | the element has the class |

Trigger, active on interaction:

| `data-trigger` | active when |
|---|---|
| `focus` | the element is or contains a focused element |
| `hover` | the element is hovered |
| `hover-if-clickable` | the element contains a Clickable component |
| `mobile` | touch devices |
| `preview` | inside the Designer, never on the live site |
| `group` | on a parent, so siblings of the hovered or focused element can react |
| `hover-other` / `focus-other` | another element inside a `group` is hovered / focused |

## Styling with the properties

**Direction *(house)*: the names are inverted.** On the Lumos starter `--_trigger---on` = 1 **at rest** and `--_trigger---off` = 1 **while hovered/focused**. So a hover effect multiplies by `--_trigger---off` (a line that grows on hover: `scaleX(calc(100% * var(--_trigger---off)))`). The doc examples below read the other way round; before writing a calc, read an existing one on the site (`card_primary_image` transform, `button_main_line`) and match it. Two build sheets shipped reversed hovers from the examples.

The docs use `--_trigger---on`, `--_trigger---off` and `--_state---false` as multipliers in the style panel:

```css
/* opacity down to 0.6 */
opacity: calc(1 - 0.4 * var(--_trigger---on));

/* switch between two colours */
color: color-mix(in srgb,
  var(--swatch--brand-500) calc(100% * var(--_trigger---on)),
  var(--swatch--dark-800) calc(100% * var(--_trigger---off))
);

/* font weight */
font-weight: calc(
	var(--_typography---font--primary-regular) * var(--_trigger---on) +
	var(--_typography---font--primary-bold) * var(--_trigger---off)
);

/* transforms */
transform: scale(calc(1 + 0.2 * var(--_trigger---on)));
transform: rotate(calc(45deg * var(--_trigger---on)));
transform: translateX(calc(2rem * var(--_trigger---on)));

/* if trigger OR state is active */
transform: translateY(calc(-1rem * min(var(--_trigger---off) + var(--_state---false), 1)));
```

## Building *(house)*

- Hover on a button: `data-trigger="hover"` on the button, the calc on its class. Prefer this over a `:hover` pseudo when the site has the properties.
- A second state on the same element: a second scoped combo, never a descendant selector.
- `hover-other` cannot sit on an element that has its own `data-trigger` hover: both write the same `--_trigger` variables. Put one of them on a wrapper.
- The API flattens `calc()` with a variable in `opacity`, `filter` and `width` to the bare variable (transforms survive). For a fade, put the bare trigger variable on a veil element and give a child the fixed strength.
- **Focus:** keyboard focus only through `:focus-visible` (the Lumos ring, `data-trigger` focus). Never a `:focus` or `:focus-within` outline on a card, group or link: it shows after every mouse click, and owners ask for it to go.
- The properties come with the Lumos starter's CSS. On a site without it they are absent: use Webflow's own hover pseudo through `update_style` with `pseudo: "hover"`, and record that in `decisions/site.md`. Parent-hover revealing a child on such a site is an embed with `@media (hover: hover)`, logged as a deviation.
