# Cards on the Lumos card base

## What Card Primary carries (keep all of it)

```
DOM div  card_primary_wrap      visibility: Lumos conditional (Visibility prop), tag via Role prop (div / li),
                                attributes: class ← Wrapper Classes, style ← Wrapper Style (conditional bindings the API cannot recreate)
  Block  card_primary_group     data-trigger="hover-if-clickable focus"
    Block card_primary_element
      Block card_primary_visual › Image card_primary_image          (Image prop)
      Block card_primary_content › header › Heading (tag ← Heading Tag, text ← Heading) + Rich Text (Paragraph)
                                 › Button Main instance (Text ← Button Text)
    Clickable instance (Link ← Link, Screen Reader Text ← Screen Reader Text)
  Theme Switcher instance (Theme ← Theme prop)
```

Props: Heading, Paragraph (rich text), Button Text, Screen Reader Text, Link, Image, Card Type (the variant prop), Visibility, Role, Theme, Heading Tag, Wrapper Classes, Wrapper Style. Variants: Default, Cover, Stacked. The API cannot create variant or heading-tag props, so the card is built in Card Primary itself and keeps them.

## Adapt Card Primary in place (default)

1. **Inventory.** Every Card Primary instance per page (`query_elements` with `component_filter` on each page; Lumos sites have ~26 on Example Components) with its variant and overrides, and every script or page attribute that selects a `card_primary_*` class (PMS: `data-chromite-land=".slider_list > :first-child .card_primary_visual"`). Keep those class names.
2. **Spec** from Figma: the variant sets, where they are used, their prototype reactions (SKILL.md §2).
3. **Variants first, keep the ids.** Rename Default / Cover / Stacked to the design's types in the order that suits the existing instances (a full-bleed type → Cover, a stacked image card → base), create the rest, `reorder_variants`. Then **clear every old override**: `get_variant_styles` per class × old variant and `remove_properties` what the Lumos variant set (Cover: `card_primary_text` `margin-top: auto`, which pushes text down; visual absolute + opacity; element border/background; Stacked: element padding 0, visual aspect-ratio). Lumos variant overrides on reused class names survive and bite later.
4. **Restyle** the `card_primary_*` classes (they are the card's own now) and remove the Lumos transitions you replace with IX3 (`card_primary_image` hover-scale calc, element border transition). New parts get `card_primary_<part>` classes (`_overlay`, `_tagline`, `_marker`, `_heading`, `_text_inner`).
5. **Content.** Remove `card_primary_header` with its native Heading and Rich Text; build the parts as divs and put Typography instances in them ([typography.md](typography.md)). Keep the Button Main instance (bind its Visibility to a `Button Visibility` toggle, default off, when the design has no button).
6. **Props** ([props.md](props.md)): Heading → `Title`, Paragraph → `Text` (remove first, then create rich text), new toggles, Image Alt; move Link / Screen Reader Text / Image / Button Text into their folders. Re-set overrides on existing instances (the Heading override is gone with the prop). Remove `Heading Tag` once the level lives in the rich text.
7. **Designer steps** (props.md § Designer-only): variant prop → `Variant`, folder order, Title H3, "is set" conditions.
8. **Read back** tree, props, bindings, variant styles per variant and breakpoint; publish to staging and measure every variant at 1440 and 375, rest and hover.

## A separate card on request

Only when the user asks for a separate card component. `duplicate_component` of Card Primary, name `Card <Name>`, group `Card`; give the copy's elements its own `card_<name>_*` classes (never edit a `card_primary_*` style then — they are shared with every Card Primary instance); keep the wrap (its conditional bindings), the group with `data-trigger`, the Clickable and the Theme Switcher; then steps 3–8 above. Rename an old component `Old | Card <Name>` first; delete it only after the new one is measured. Build one card at a time: duplicates share prop ids.

## Traps seen on the base

- The duplicate keeps Card Primary's prop ids; bindings in the copy already point at them. Only the variant prop gets a new id.
- The variant prop ("Card Type") cannot be renamed or regrouped by API; rename it to `Variant` in the Designer. Never batch it with other `update_prop` renames: one error fails the batch.
- Text-style switches per variant (title H6 → H5) are **variable modes on the combo**: `get_style_variable_modes` / `set_style_variable_mode` with `variant_id`. `get_variant_styles` cannot read combo classes.
- **Nested instance props are not per card variant**, and card variant styles do not reach classes inside a nested component or slot items. A nested part that differs per variant (a kicker orange in one variant, green in the other): two card-owned wrappers, one instance in each, both bound to the same card prop, and the variant swaps the wrappers' `display`.
- **Line clamp:** Lumos `u-line-clamp-N` (the API and the Designer refuse `-webkit-line-clamp`). It sets `display: -webkit-box !important`, so a variant `display: none` or a Visibility prop cannot hide the clamped element: put the text in a card-owned wrapper (`card_<name>_desc`) and hide or bind the wrapper. One clamp class cannot differ per variant. On a Lumos text with the text trim, the clamp cuts the bottoms of letters on short texts and adds "…" at exactly N lines (the trim's `::after` counts as a line): add `u-text-trim-off`, and on every wrapper between the clamp and the text too, because the trim only checks the text's direct parent.
- Figma text boxes are untrimmed, Lumos trims. Cleanest: switch the trim off — `u-text-trim-off` in the Typography Heading / Paragraph **Classes** prop, and a combo `<wrapper>.u-text-trim-off` on the holder of a Typography Plain (Lumos skips the trim on a `p` whose parent has the class). Then the boxes equal Figma's (title 1.4 × size, text 1.5 × size). Fallback: `padding-block` (≈ 0.2em body, 0.4em small text) on the wrapper.
- **Variant styles are emitted as `.class:where(.w-variant-…)`** — the same specificity as the base class. A base rule at a breakpoint (`card_primary_visual { height: 15.625rem }` at ≤767) beats the variant's desktop value there. Set the variant's value at every breakpoint where the base has one (visual `height: 100%` at `small` for the full-bleed variants).
- A theme per variant: `set_style_variable_mode` with `variant_id` on `card_primary_element` (collection Theme, mode Dark). Text on a photo: a fixed swatch (`swatch/light-100`) on the element, as for overlays.
- A gap that must collapse with the text it precedes (hover reveal): put it as `padding-top` on an inner wrapper inside the collapsing wrapper, never as `gap` on the parent.
- Instance values from the API: Image prop with `type: "string"` and the asset id; variant with `type: "string"` and the variant id (`base`); Section `Theme` = a Theme Switcher variant id (Light / Dark / Brand); Grid `Large/Medium/Small Screen` = column counts.
- A fade on hover: `opacity`/`filter` with `calc(var × n)` is flattened to the bare variable. Use the bare trigger variable on a veil and a child with the fixed strength. Read the trigger variable's rest value on the site before relying on it.
- A Figma inside stroke = `outline` with negative `outline-offset` or an inset frame, not a `border` (that adds to the box).
