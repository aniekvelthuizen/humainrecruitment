# Components

Every core element is a Webflow component: global control over structure and style, one place to change a layout, and blocks a client can drop on a page.

## Open vs closed

- **Open component**: built on slots. Editors add or remove elements inside. The default for sections; fast and flexible.
- **Closed component**: built on props that show, hide and fill elements. For content and structure that must stay identical on every page (a contact modal, a CTA with fixed copy).

Build open first. Close it by wrapping the open component in a div and turning the div into a component; surface the props that vary per instance, leave the global ones inside. To reach a slot of the inner component, nest a slot inside it with `u-display-contents` (installing a Shared Library: also `data-display="contents"`, [library-sites.md](../library-sites.md)).

*(house)* Through the API a slot accepts component instances only; the "any element" freedom is the Designer's. An open component therefore always comes with an item component for what goes in its slot.

## Guide structure for an open section

```
Section
  Layout
    Column 1 Slot: Eyebrow, Heading, Paragraph, Button Wrapper > Button
    Column 2 Slot: Visual Image or Visual Video, Visual Overlay (optional)
```

## Section build *(house)*: flat

Every new page section is built from plain elements with Lumos classes and variables, then closed into a **closed component** with its own name:

```
section  <name>_wrap      theme (Theme variable mode on the class, or u-theme-dark), background, position; padding from section-space variables per breakpoint
  div    <name>_contain   + u-container
    …    <name>_*         the section's own layout classes; Lumos utilities (u-grid, u-flex-*, u-gap-*) where they fit exactly
         Heading / Paragraph with u-text-style-*, links, images; Button Main, icons, cards, Slider, Accordion where they fit
```

No Lumos `Section` / `Layout` / `Block` / `Typography` components in it; responsive lives in the classes.

**Global blocks keep Lumos' own build.** `Nav` and `Footer` are not section builds: they stay on the Lumos `Nav` / `Footer` component with their own classes (`footer_wrap`, `footer_contain`, …); parts they share (legal links, contact block) become components. Say so in the plan.

**Why flat: never content in a slot filled inside a definition.** The API cannot reach it, and Lumos `Section`, `Layout` and `Block` are slot components, so every text of a Section build-up sits exactly there. Measured Oct 2026 (739 content places): 75 were neither findable nor writable in the primary locale (`set_component_instance_prop_values`: "Element with id … not found inside component"; `set_text`: "Element not found"), all in Lumos Section/Layout/Block slots or a Slider slot inside a section component. Only `data_localization_tool > get_component_content` lists them, and `update_component_content` writes them for a secondary locale only ("The provided locale must be a secondary locale"). The boundary is "slot filled in a definition", not depth: a nested instance placed directly in the definition, and slot-in-slot on a page, were both readable and writable. A slot is for what editors fill on the page. A Section build-up block therefore cannot be updated later by an agent, a support bot or a copy round through the API.

- **Closed block**: texts, links and images sit directly in the definition when they are the same everywhere, or are props with a real default when they differ per instance. **Open block**: every text, button, link and image is a prop; repeated items the editor extends go in a slot filled on the page, or in the CMS. Never editor content in an embed.
- Link props in URL mode: an instance link prop takes no page link through the API ([webflow-mcp.md](../webflow-mcp.md) §5).
- Heading levels: [typography.md](typography.md), "Heading levels".
- **Check reachability after building**: every text, link and image of the block is found by `query_elements` (with `scope_component_id` inside the definition, `component_filter` for slot items on the page) and written back once with its own value.

**Sites already built on the Section build-up** keep it for their existing blocks until their content has to be reachable. Then the block is rebuilt flat with the same class names (the wrap on tag `section` with the Theme background and text; Typography replaced by text classes that read the Text Style variables, so the parent's mode still decides the size), measured before and after. A heading tag sets its own Text Style mode in Lumos, so a flat heading inside a parent with another mode needs that mode on itself (per variant and breakpoint) or `inherit`.

### Section build-up (existing blocks)

How those existing blocks are built, as the Lumos *Example Components* page does it. There the Lumos `Section` brings its own `u-container`; `<name>_contain` goes on its Container Classes prop only when the container needs a style of its own.

```
<name>_wrap  div (data-section, position/overflow only)   ← becomes the closed component
  Section    Lumos: Theme, Padding Top/Bottom, Height, Container Classes
    Background slot: Block › Block <name>_canvas › Visual Image + Media Overlay
    Container slot:  Layout Stack / Columns › Typography Tag + Heading + Paragraph, then the section's own items
```

- **Layout before Block**: columns, rows and "left | right" patterns are a Lumos `Layout` in the variant Example Components uses — **Auto Width** for "left | right, bottoms aligned" (a header with a filter or button beside it), **Card** for a card with a background image (a CTA banner), **Columns / Stack** for text + image. Custom classes go on its Classes / Column Classes props. `Block` only where there is no Layout pattern; owners spot sections built from Blocks. Variant ids differ per site: read them from `get_component` and note them in `decisions/`.
- **Height prop: `true` = auto height** (the content decides). `false` adds `u-min-height-screen` and centres short content vertically. Page sections use `true` unless the design is a full-screen section; a section that looks right only because its content is taller than the screen is a bug waiting.
- Padding props are **variant props**: the API cannot link them to a parent prop (Designer step), and a variant cannot differ per breakpoint. Where the design's section spacing differs per breakpoint (Padding Top Large gave 64 px at 375 where the design had 48), set Padding None/None and put the spacing on the `<name>_contain` class per breakpoint with the section-space variables.
- **CMS-bound content cannot live inside the Lumos slots of a definition** (nothing there is addressable by API, and transforming drops nested CMS bindings). Put a `ComponentSlot` in a plain div at the component root, outside the Lumos Section, and bind the card instances on the page ([componentize mechanics](../../skills/componentize/mechanics.md), "CMS-fed instances").

Lumos quirks that decide how it is built:

- `.u-background-slot > *` forces position, inset and size on direct children: a positioned box needs a nested `Block`.
- Lumos `Grid` puts its Classes on `u-grid-wrapper`; the items live in the inner `u-grid`, so custom `grid-column` placement breaks. Use two `Block`s with your own grid class.
- Layout columns are not flex: `u-gap-row-*` on Column Classes does nothing. Space texts with `u-margin-top-*` on their Classes. Lumos margin-trim zeroes the first child's margin-top in a column — use padding when that gap must survive.
- Typography `u-text` has `min-width: 100%` (a max-width on its class needs `min-width: 0`; in a row give each text a flex-none wrapper) and reads its font from `--_text-style---*` variables, so a wrapper's font-size or weight never reaches Typography Plain: set it on the instance's Style prop (`font: inherit`, a weight). It has no usable baseline: align bottoms instead.
- `Visual Image` paints a placeholder (`u-image-wrapper`, 10 % currentColor) behind the image: a transparent PNG shows a grey box. Flatten the image onto its background, or `color: transparent` on a parent.
- A `Theme Switcher` inside a `Card Primary` duplicate did not reach the published markup (Oct 2026): dark tiles via Wrapper Classes `u-theme-dark`.
- Lumos `.button_main_wrap` has `transition: 0.2s` on all properties. A script that hides a button on load (opacity, transform) gets a 0.2 s fade instead, so the button flashes over the content for a moment. In that script's CSS keep only colour transitions on the parts it moves.
- Lumos `.form_field::placeholder` is 60 % theme text: on a photo or dark panel the placeholder reads as a disabled field. Give Form Input a variant (e.g. `On Image`, placeholder = theme text); a combo on `form_field` cannot reach the input inside Form Input, and an Input Switcher variant never reaches it either.

## Lumos types: adapt the original *(house)*

- A type Lumos ships (button, card, slider, accordion, tabs, form, video) is built **in the Lumos original itself** — adapted in place, name kept, the design's types as its variants; a duplicate only when the owner asks.
- Exception: something that only **looks** like a Lumos type but has its own data and behaviour (a card with two images, a formula, its own hover, always CMS-fed) becomes its own component built from Lumos parts. Test: as a variant, would it add props that do nothing in the other variants? Then propose it separately.
- Props in folders Variant → Content → Visual → parts → Link → Settings, visibility toggles, slots for repeated items, native "is set" conditions ([componentize](../../skills/componentize/SKILL.md), [cards](../../skills/cards/SKILL.md)).
- Icons in repeated items (list rows, feature lines) are an **image prop** with the design's icon as default, so editors can swap them; not a fixed nested icon component.
- **Every component is shown on the Components page** (`/components`), in the same task that builds it: a Showcase Label (its name as in the Designer + where it is used) and the instance in its group, filled like its real page. The Lumos **Styleguide** stays the place for the basics (typography, colours, utilities) and the button matrix per theme. How: [componentize](../../skills/componentize/SKILL.md) §3.

**Lumos Slider with a fractional per-view** (2.1, 1.2): at the end the previous slide shows a strip at the edge. Give the last slide `margin-right: calc((var(--slide-count) - round(down, var(--slide-count), 1)) / var(--slide-count) * 100%)` on `:last-child`, typed in the Designer UI: the API flattens a `calc()` with several variables ([webflow-mcp.md](../webflow-mcp.md) §2; [designer/README.md](../designer/README.md) "Manual routes"), and that is no reason for code. It reads the slider's own per-view at every breakpoint; Lumos switches per-view at em widths that are not Webflow's breakpoints, so fixed percentages fail. A clip-path inset cuts the first slide at rest instead.

## Blocks between paragraphs: Components in rich text *(house)*

A quote, a donate or CTA card, a video or any other block the design puts **between the paragraphs** of a text (CMS rich text or a rich-text prop) is a small component the editor inserts in the rich text with Webflow's [Components in rich text](https://help.webflow.com/hc/en-us/articles/55024205780627-Components-in-rich-text): the editor decides where and how often. Not a fixed place around the rich text, a slot before or after it, markers such as `[[quote]]` that a script swaps, or "after the second paragraph" in CSS or JS. An image is the native rich-text image (full width is an option there), not a component. Mechanics and limits: [webflow-mcp.md](../webflow-mcp.md) §5 "Components in rich text" (Nov 2026).

## Rules

- Duplicate a component to start from it, and duplicate its custom classes too, or styles bleed between the two.
- Name slots after the child component that belongs in them.
- The variant prop on a base component is always named `Variant`: specific names limit reuse and change the component's data attribute that custom code targets *(house: `data-wf--…--variant`)*. *(house)* One variant axis per component; a second axis is a nested component.
- Variants over separate components: one card with a variant dropdown beats five cards in the panel.
- *(house)* Responsive lives in classes, never in a variant ([responsive.md](responsive.md)).
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
