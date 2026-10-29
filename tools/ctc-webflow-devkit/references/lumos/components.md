# Components

Every core element is a Webflow component: global control over structure and style, one place to change a layout, and blocks a client can drop on a page.

## Open vs closed

- **Open component**: built on slots. Editors add or remove elements inside. The default for sections; fast and flexible.
- **Closed component**: built on props that show, hide and fill elements. For content and structure that must stay identical on every page (a contact modal, a CTA with fixed copy).

Build open first. Close it by wrapping the open component in a div and turning the div into a component; surface the props that vary per instance, leave the global ones inside. To reach a slot of the inner component, nest a slot inside it with `u-display-contents`.

*(house)* Through the API a slot accepts component instances only; the "any element" freedom is the Designer's. An open component therefore always comes with an item component for what goes in its slot.

## Guide structure for an open section

```
Section
  Layout
    Column 1 Slot: Eyebrow, Heading, Paragraph, Button Wrapper > Button
    Column 2 Slot: Visual Image or Visual Video, Visual Overlay (optional)
```

## Section build-up *(house)*

Every page section (not `Nav` / `Footer`, which keep Lumos' own build), built as the Lumos *Example Components* page does it, then closed:

```
<name>_wrap  div (data-section, position/overflow only)   ← becomes the closed component
  Section    Lumos: Theme, Padding Top/Bottom, Height, Container Classes
    Background slot: Block › Block <name>_canvas › Visual Image + Media Overlay
    Container slot:  Layout Stack / Columns › Typography Tag + Heading + Paragraph, then the section's own items
```

- **Layout before Block**: pick the `Layout` variant Example Components uses for the pattern — **Auto Width** for "left | right, bottoms aligned" (a header with a filter or button beside it), **Card** for a card with a background image (a CTA banner), **Columns / Stack** for text + image. Custom classes go on its Classes / Column Classes props. `Block` only where there is no Layout pattern. Variant ids differ per site: read them from `get_component` and note them in `decisions/`.
- **Height prop: `true` = auto height** (the content decides). `false` adds `u-min-height-screen` and centres short content vertically. Page sections use `true` unless the design is a full-screen section.
- Padding props are **variant props**: the API cannot link them to a parent prop (Designer step).
- **CMS-bound content cannot live inside the Lumos slots of a definition** (nothing there is addressable by API, and transforming drops nested CMS bindings). Put a `ComponentSlot` in a plain div at the component root, outside the Lumos Section, and bind the card instances on the page ([componentize mechanics](../../skills/componentize/mechanics.md), "CMS-fed instances").

Lumos quirks that decide how it is built:

- `.u-background-slot > *` forces position, inset and size on direct children: a positioned box needs a nested `Block`.
- Lumos `Grid` puts its Classes on `u-grid-wrapper`; the items live in the inner `u-grid`, so custom `grid-column` placement breaks. Use two `Block`s with your own grid class.
- Layout columns are not flex: `u-gap-row-*` on Column Classes does nothing. Space texts with `u-margin-top-*` on their Classes. Lumos margin-trim zeroes the first child's margin-top in a column — use padding when that gap must survive.
- Typography `u-text` has `min-width: 100%` (a max-width on its class needs `min-width: 0`; in a row give each text a flex-none wrapper) and reads its font from `--_text-style---*` variables, so a wrapper's font-size or weight never reaches Typography Plain: set it on the instance's Style prop (`font: inherit`, a weight). It has no usable baseline: align bottoms instead.
- `Visual Image` paints a placeholder (`u-image-wrapper`, 10 % currentColor) behind the image: a transparent PNG shows a grey box. Flatten the image onto its background, or `color: transparent` on a parent.
- `Theme Switcher` inside a `Card Primary` duplicate did not reach the published markup: dark tiles via Wrapper Classes `u-theme-dark`.

## Rules

- Duplicate a component to start from it, and duplicate its custom classes too, or styles bleed between the two.
- Name slots after the child component that belongs in them.
- The variant prop on a base component is always named `Variant`: specific names limit reuse and change the component's data attribute that custom code targets *(house: `data-wf--…--variant`)*. *(house)* One variant axis per component; a second axis is a nested component.
- Variants over separate components: one card with a variant dropdown beats five cards in the panel.
- *(house)* Responsive lives in classes, never in a variant.
- Lumos components that write their own conditional `class` attribute drop the Classes prop when that option is on: Slider **Crop Left** is one (use Overflow Visible plus a `u-overflow-…` class instead). Lumos Form Select takes no extra attributes by API (Designer).
- `.u-heading h2 { text-wrap: inherit }` beats a class on the heading itself: set `text-wrap` on the `u-heading` wrapper.

## Prop order (identical across components)

1. Visibility
2. Variants
3. Tag
4. Content (text, link, image, alt text)
5. Role
6. Style (max width, classes, style attribute)
7. Other attributes
8. Slots

On a section component the `Section` folder comes first, then one folder per element in visual order.

The API mechanics (what transforms, what binds, what refuses) are in the componentize skill's `mechanics.md`.
