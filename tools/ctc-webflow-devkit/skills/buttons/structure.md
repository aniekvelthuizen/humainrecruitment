# Structure — one button component

## 1. Reuse the site's button

A Lumos starter ships `Button Main` (group Button): `button_main_wrap` (`data-trigger="hover focus"`) › Clickable (link/button cover) + `button_main_element` (`data-button`) › `button_main_text` (+ `u-text-style-*`) + icon. Restyle it in place: every existing instance gets the design, and editors keep one thing to drag. Before removing anything from the definition (an empty icon slot, an underline element), check that no instance uses it (`query_elements` with `component_filter` on each page that has instances).

Final tree:

```
button_main_wrap            data-trigger="hover focus"   ← colours, width, hover pseudo
├─ Clickable                (Lumos, absolute cover; screen-reader text = Text prop)
└─ button_main_element      data-button                  ← layout: padding, gap, lines, min-height
   ├─ button_main_text      + u-text-style-<base>  [data-roll]  ← label (Text prop)
   ├─ button_main_icon      ← icon size; visibility = Icon Visibility prop
   │  └─ Icon Set           ← variant = Icon prop
   └─ button_main_line      ← optional hover line (motion.md)
```

Remove what the design does not use (the line, an empty icon slot) after checking instances (below). An option such as a photo or an accent mark is a child of `button_main_element` too (§7).

## 2. Variants and props

- **One `Variant` axis**, named by look. `Primary` (base) = the look the pages use most. Rename leftover starter variants (`Link` → the design's name) rather than adding twins; delete the ones the design does not have after the instances on the site are moved.
- **Not variants**: hover (trigger/pseudo), focus, size per breakpoint (fluid variables), theme (variables), icon (Icon Set prop), icon-only (own component).
- **Props, in folders**:
  - **Button**: Visibility, Variant, Text, Link
  - **Icon**: Icon Visibility (boolean, true), Icon (the Icon Set variant, linked in the Designer)
  - **Settings**: Lumos Clickable Visibility, Button Type
- The API cannot create, rename or regroup a **variant-type** prop (`update_prop`: "not an updatable prop type"). Linking the nested Icon Set variant to a new **Icon** prop and moving **Variant** into the Button folder are Designer steps (SKILL.md §3).

## 3. Style recipe

Values below are the shape; the numbers come from the design.

| Class | Base (default look) | Typical overrides per variant |
|---|---|---|
| `button_main_wrap` | `position: relative`; width per design (`100%` when Figma sizes it FILL, else `inline-block` auto); `background-color` + `color` = theme vars (the wrap carries the colours: the Clickable covers the element, so only the wrap gets `:hover`); `border-*-color` = theme border var (no border style here — the element draws it); `font-weight` = font weight var; radius from the design (a starter has `radius/round`); transition = the **hover-out** timing (`transition-property: all`, see §6) | width, display, colours, radius |
| `button_main_wrap:hover` and `:focus-within` | only what the design changes on hover (colour, weight) + transition = the **hover-in** timing (the state being entered decides the transition) | per variant, or removed |
| `button_main_element` | `display: flex; align-items: center`; `justify-content` (`space-between` when text and icon sit at opposite ends); padding, gap from variables (`space/*`); **`min-height: button-size/medium`** for the design height (§4); borders with `border-*-color: inherit` (none when the design has none); `border-radius: inherit` | borders off, padding, gap, min-height `0` for inline text buttons |
| `button_main_text` | `flex-grow: 1` when spaced apart; **no `line-height`** (see §5); a hover shift as a trigger transform (motion.md §3) | `flex-grow: 0` |
| `.button_main_text.u-text-style-<base>` (combo) | Text Style **mode** for the default look; `font-weight: inherit` | another Text Style mode per variant |
| `button_main_icon` | width in `rem` from the design (24 px → 1.5rem), `flex: none`, `aspect-ratio: 1` | width |

Text styles switch through the Text Style variable **mode** on the combo (`set_style_variable_mode` with `variant_id`), not by swapping utility classes, which a variant cannot do. Base mode: pass `mode_id: "base"`.

## 4. Matching the design's box

- **Text is trimmed.** Lumos text styles (`u-text-style-*`) trim the line box to cap height (the font's trim variables, e.g. 0.37em top and bottom). Figma measures the untrimmed line: 12 px padding around a 24 px line gives a 48 px Figma button but a ~36 px Webflow one. Set the height with `min-height: button-size/medium` (3rem) and keep the padding for width and for labels that wrap.
- **Strokes inside.** Figma draws strokes inside the frame; CSS borders add to the height. Padding = (design height − content height − both strokes) / 2. Example: 48 px frame, 24 px icon, 0.75 px lines → 11.25 px (`0.703125rem`). Chrome draws 0.75 px as 1 px, so expect ±0.5 px.
- **Off-scale values** (0.75 px lines, 11.25 px padding) are literal `rem`, noted in `decisions/`.
- **Full width**: a Figma button set to FILL is `width: 100%` on the wrap; text/inline variants reset to `auto`.
- **Theme**: bind colours to theme variables (`text`, `border`, `heading-accent`, `accent-secondary`…). A colour that must differ per theme in a way no existing variable does gets a new theme variable (e.g. `button-line`), recorded in `decisions/site.md` as site-only.

## 5. Traps seen on Lumos starters

- `button_main_text` ships with `line-height: inherit`, which beats the text style and collapses it to the element's `line-height: 1`. Remove it.
- The starter's `Link` variant overrides `button_main_line` and the element (padding, border styles, `text-link/*` colours). Read every variant's overrides on every class before reusing it (`get_variant_styles` per class, per pseudo).
- The Clickable `<button>` renders grey in the Designer snapshot only (the Global Styles embed resets it on the page). Not a bug.

## 6. API limits that shape the build

- **Colour values with `color-mix()` or `var()` strings are flattened to their first variable** by `update_style` and `set_variant_styles`. The Lumos trigger pattern for colour (`color-mix(… calc(100% * var(--_trigger---off)) …)`) cannot be written by the agent. Put colours on the wrap and use the native `:hover` pseudo; the element inherits (`border-color: inherit`, text colour inherits). Record the deviation in `decisions/`.
- **`transition-property` with a comma list is mangled.** `"background-color, color"` publishes as `transition: background-color .3s …, color undefined undefined` — invalid CSS, so no transition at all, while the API read-back looks fine. Use one property or `all`, and read the published CSS.
- **Transforms with trigger calcs do work**: `transform: scaleX(calc(100% * @var_variable-<off-id>))`, `transform-origin: calc(100% * @var_variable-<on-id>) 100%`. Read back after writing.
- **`update_prop` with several props in one call can shift names and groups onto the neighbouring prop.** Update one prop per call and read the component back.
- A component instance can never be the anchor of an insert or move (`before`/`after`): append to the parent, then move siblings to order them.
- `page_wrap` and other template elements have **different ids per page**; look them up per page before inserting there.
- **Instance prop values:** an **image** prop takes `type: "string"` with the asset id as `string_value`; a **variant** prop takes `type: "string"` with the variant id (or `base`). There is no image type in `set_component_instance_prop_values`.
- A conditional visibility ("show when a prop is false") is Designer-only (SKILL.md §3.3). Hidden that way, the element is **removed from the published HTML**, so an animation targeting it simply does nothing there.

## 7. An option on every look (photo, accent, icon)

When the design shows the same extra in several looks (a contact-person photo in a secondary button, and the owner wants it in all of them), it is an option, not a variant: a variant axis cannot be combined with another.

- **Props** in their own folder: `<Option> Visibility` (boolean, default off), the asset (image) and its alt text. Bind the element's visibility, asset and alt to them.
- **Keep the button height.** Give the option negative block margins so it overhangs the padding instead of growing the button: a 36 px photo in a 48 px button with 12 px padding gets `margin: -0.375rem …`; a negative start margin pulls it towards the edge the design shows (6 px instead of the 16 px text inset).
- **What must make room** (an accent square that the photo replaces) gets a native condition in the Designer: *`<Option> Visibility` is False → Visible, else Hidden*.
- Measure rest and hover positions against the design per look; a shared hover shift (the label moves the same distance in every look) may differ a pixel or two from a Figma variant that shifts less — note it in `decisions/`.
