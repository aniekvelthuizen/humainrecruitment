# Webflow MCP — call shapes and gotchas

A block is two calls, not twenty. Source: Webflow MCP 2.0.1 tool schemas plus what failed in practice (Sept–Nov 2026; re-test a trap when Webflow ships a change). Format: **what goes wrong → what works**.

1. [Working method and limits](#1-working-method-and-limits) — batching, read-back, 429, publishing with several sessions, context
2. [Styles](#2-styles) — call shape, refused or mangled values, breakpoints and pseudo, combos and names
3. [Variables and modes](#3-variables-and-modes)
4. [Building elements](#4-building-elements) — builder, WHTML, attributes, links, rich text, forms
5. [Components](#5-components) — props, variants, slots, instances, conditions
6. [CMS](#6-cms)
7. [Assets](#7-assets)
8. [Interactions (IX3), scripts and embeds](#8-interactions-ix3-scripts-and-embeds)
9. [Pages, localization, branches, SEO fields](#9-pages-localization-branches-seo-fields)
10. [Shared Libraries](#10-shared-libraries) — pointer to library-sites.md
11. [The Designer](#11-the-designer) — pointer to designer/README.md

## 1. Working method and limits

- **Two calls per unit**: all its classes in one `data_style_tool` call (§2), its whole element tree in one `data_element_builder` call (§4). Style names must exist before the builder uses them: styles first.
- **Success is not proof.** Unknown keys are silently ignored and the call still reports success. After every build call, `data_element_tool > query_elements` on the new subtree: confirm tag, classes, text, links.
- **One rejected style property fails the whole call** with "internal error". Keep batches per block; when one fails, bisect it.
- **A failed build still leaves the partial tree** (empty component instances, or the top elements of a call that answered with an error such as "`type` is a reserved attribute name"). Read the parent back after every failed call and remove the leftovers before retrying (an empty duplicate group shifts layout; a script can hang on an empty block).
- Element ids from a response go back verbatim, never shortened.
- **Large reads** (`get_styles` with properties ~700 KB, `list_pages` ~70 KB, `get_variables` all modes ~100 KB, `query_elements` on a big subtree): write the JSON to a file and grep or script over it; the payload sits at `result[0].data[0]`.
- After a context compaction the tool schemas are gone: re-read this file before the first call.
- **CMS template page never opened in the Designer** → element and style calls answer "styles not found". Style calls work with another page's `pageId` (styles are site-wide); element work waits until the page has been opened once.
- **Rate limit (HTTP 429)**: ~7 `insert_component_instance` (or other heavy writes) in one call, or ~12 element writes in a row, trip it; the rest of the batch fails. Batch 3–4, wait ~45–60 s after a 429 (~90 s after a run of element writes), check what landed before retrying. The limit is **per site, shared by every session**: with several sessions on one site a 429 comes every few writes — write in small groups and read back.
- **Publishing**: one publish per minute per site, and a publish ships **every session's saved work**, half-built units and placeholders included. Tell the other sessions on the site first, publish edited CMS items before the site, never publish while another session is mid-change.
- **The open Designer canvas does not show API writes until the Designer tab is reloaded**: prop changes, variant styles, new assets (grey placeholder), CMS data. Not a bug. Do all API writes first, then reload once ([designer/README.md](designer/README.md) "Reload").

## 2. Styles

### Call shape

`data_style_tool` — `actions[]` takes N actions, run in order.

```json
{
  "siteId": "…", "pageId": "…",
  "context": "…",
  "actions": [
    { "label": "wrap", "create_style": {
        "name": "c-hero_wrap",
        "properties": [
          { "property_name": "display", "property_value": "grid" },
          { "property_name": "padding-top", "variable_as_value": "<variable-id>" }
        ] } },
    { "label": "wrap-tablet", "update_style": {
        "style_name": "c-hero_wrap", "breakpoint_id": "medium",
        "properties": [ { "property_name": "display", "property_value": "flex" } ] } },
    { "label": "combo", "create_style": {
        "name": "is-dark", "parent_style_names": ["c-hero_wrap"],
        "properties": [ … ] } }
  ]
}
```

- `property_value` or `variable_as_value`, never both. `variable_as_value` takes the full id **including the `variable-` prefix**; without it: a misleading "internal error".
- Longhand names: `padding-top` not `padding` (shorthand rejects a linked variable), `grid-column-gap`/`grid-row-gap` not `column-gap`/`row-gap`.
- `update_style` with `remove_properties` (+ `breakpoint_id`) clears properties. `set_style` and `remove_element` take `id`.
- `display: grid` silently adds Webflow's default 2 × 2 template (`wf-grid`): set `grid-template-columns`/`rows` in the same write, or use flex.

### Refused or mangled values

**Judge by the published CSS, not the read-back** — the read-back is wrong in both directions. The fix for a refused value is a Lumos route or the Designer UI ([designer/README.md](designer/README.md)), never custom code ([lumos-rules.md](lumos-rules.md) §0).

- **`calc()` with variables**: `calc(var(--x) * -1)` → the bare positive variable; any `calc()` with two or more variables keeps only the first (`calc(100% - (var(--a) - var(--b)) * 2)` → `var(--a)`). A `calc()` with one variable in `opacity`, `filter` or `width` → the bare variable.
- **Survive**: `transform` calcs, also Lumos trigger calcs (`scaleX(calc(100% * @var_variable-…))`, `transform-origin: calc(100% * @var_…) 100%`); trigger calcs in `transition-duration` and inside `cubic-bezier()` (one variable per calc). Literal `max()` / `clamp()` without `var()` store and read back fine.
- **Stored but reads back wrong**: `calc(var(--_spacing---space--4) - .2em)` and `max(var(--x), calc(…))` read back as the plain variable, yet are stored and published intact.
- **Colour values with `color-mix()` or `var()` strings** (raw `var(--…)` too) are flattened to their first variable by `update_style` and `set_variant_styles` → the Lumos trigger recipe for colours cannot be written by the agent. Use the native `:hover` pseudo on the parent, children inheriting (`border-color: inherit`).
- `text-shadow` and gradient stops mangle `var()` → literal values.
- **`transition-property` with a comma list** (`"background-color, color"`) publishes as `transition: background-color .3s …, color undefined undefined` (invalid: no transition at all) while the read-back looks right → one property or `all`.
- `content` on `::before`/`::after` is mangled (`'"'` comes back as `'"'|`) → put the character in the text or the CMS field.
- **Refused** ("Invalid style property" / "internal error"):
  - `-webkit-line-clamp`, `line-clamp`, `-webkit-box-orient` (also as Designer custom properties) → Lumos `u-line-clamp-N`, which forces `display: -webkit-box !important` (hide a wrapper, never the clamped element).
  - Custom properties on a class (`--flex-medium`, `--_theme---text`, `--_text-style---font-weight`) → a variable **mode** set on the class with `set_style_variable_mode` (§3), or the Lumos instance's Style prop (inline) for a one-off.
  - A length variable on `outline-width`.
  - `text-wrap` with a FontFamily variable through `variable_as_value` → `property_value: "var(--_text-style---text-wrap)"`; Webflow stores it back as a variable link.
- **Accepted**: `min(…, 50cqi)`, `container-type`, `mix-blend-mode`, `mask-image`/`mask-size`/`mask-repeat`/`mask-position` (the asset CDN sends `access-control-allow-origin: *`, so masks work cross-origin).

### Breakpoints and pseudo states

- `main`, `large`, `xl`, `xxl` (≥), `medium`, `small`, `tiny` (≤). One `update_style` per breakpoint, in the same `actions[]`. Pseudo states (`hover` …) the same way via `pseudo`.
- **`large` / `xl` / `xxl` only work when the site has enabled them** (Designer: "Add large breakpoints"); otherwise the write is stored but never emitted. Check before building for ≥ 1280; enabling is site-wide, so ask the owner first.

### Combos and names

- `parent_style_names` lists the **full** chain (`["card", "is-bordered"]`). `set_style` with several names (= a combo) only works once that exact chain exists; otherwise the builder answers "One or more styles not found" and still creates the elements **unstyled** (remove them, create the chain, build again).
- A combo with a utility (`footer_heading` + `u-text-style-h1`) must exist before `set_style` or the builder can apply both: `create_style` with `name: "u-text-style-h1"`, `parent_style_names: ["footer_heading"]`, empty `properties` allowed. The element still gets the utility's global CSS; the combo holds only the overrides.
- **Bare combo names are ambiguous**: `set_variant_styles` / `update_style` by a bare combo name (`is-right`) write to the first combo of that name on the site — the value lands under another component's selector and changes nothing. Give combos unique names (or rename the others for the write and back); read the selector in the published CSS.
- Style names keep a dot (`style2.0_wrap`), and so does `parent_style_names` (`["style2.0_wrap"]`); only the CSS selector uses the dash (`.style2-0_wrap`). The dashed form in `parent_style_names` fails with "Parent style … not found" (Nov 2026). `query_styles` matches on `name_path`, not keywords.

## 3. Variables and modes

`data_variable_tool`:

- **`custom_value` is refused** on create and update of size and colour variables: every expression (`clamp()`, `calc(1rem + 1vw)`, `color-mix()`) → "internal error". `static_value` and `existing_variable_id` (alias, across collections and inside one) work. So opacity swatches are 8-digit hex (`#ffffff1a`).
- **Fluid sizes** go into the variable's value as a `clamp()` formula, as Lumos ships it (`site/gutter`), typed into the Variables panel by the agent ([designer/README.md](designer/README.md) "Manual routes") — not Fluid Builder, not a `:root` block in custom code. Formula and list: [build/foundations.md](../skills/build/foundations.md) §4.
- **`mode_id: "base"` is refused** here: omit `mode_id` to write the base mode; pass the `mode-…` id for every other mode.
- A new mode starts with the base mode's values: set every variable the mode should differ in.
- New variables always land at the **bottom** of their collection; `reorder_variable_collection` orders collections, not variables. Create new ones in one call in the intended order (light → dark, per group); a later sort is a Designer drag.
- `update_*_variable` sometimes answers "internal error" on an existing size variable → set the value on the classes that read it, or in the Variables panel.
- `get_variables` with all modes: write it to `references/variables.json`, check by script. Values come back as `{value, unit}`, `{id}` (alias) or `{type: "custom", value}`.
- **`set_style_variable_mode`** needs the collection id **with** its `collection-` prefix. Unlike the variable tool it accepts `mode_id: "base"`, and `variant_id` — the way to switch a Text Style per component variant. `variant_id` **and** `breakpoint_id` together work: one variant can be Text Small on desktop and Text Main at `small` (set the mode on the combo, e.g. `parent_style_names: ["button_main_text"]`, `style_name: "u-text-style-main"`). Same for combos outside components: `footer_bottom_text.u-text-style-small` → XSmall mode at `small`.

## 4. Building elements

### Builder call shape

`data_element_builder` — `element_schema.children[]` nests to any depth.

```json
{
  "siteId": "…", "pageId": "…",
  "context": "…",
  "actions": [ {
    "build_label": "hero",
    "parent_element_id": { "component": "<pageId>", "element": "<parent-el-id>" },
    "creation_position": "append",
    "return_element_info": true,
    "element_schema": {
      "type": "Section", "set_style": { "style_names": ["c-hero_wrap"] },
      "set_attributes": { "attributes": [ { "name": "id", "value": "hero" } ] },
      "children": [
        { "type": "Heading", "set_heading_level": { "heading_level": 1 },
          "set_style": { "style_names": ["c-hero_title"] },
          "set_text": { "text": "…" } },
        { "type": "DivBlock", "set_style": { "style_names": ["c-hero_actions"] },
          "children": [
            { "type": "Button", "set_style": { "style_names": ["btn", "is-primary"] },
              "set_text": { "text": "…" },
              "set_link": { "link_type": "url", "link": "/contact" } }
          ] }
      ]
    }
  } ]
}
```

- Only Container, Section, DivBlock and DOM elements take children.
- Inside a component definition pass `scope_component_id`; `parent_element_id.component` is then the component id (on a page it equals `pageId`).
- **A component instance is never an anchor or parent** for `data_element_builder`, `move_element` (`before`/`after`) or `insert_component_instance`. Append to its parent (or use a non-instance sibling), then `move_element` the siblings to order them (an instance can be the moved element). `move_element` takes `anchor_element_id` + `creation_position`.
- **Page template elements** (`page_wrap`, `page_main`) have **different ids per page**: query them per page (`component_filter` on Global Styles with `return_parent: "parent"`). Empty CMS template pages have neither. `page_main` is a page slot that accepts only components: build after it (parent `page_wrap`), transform, then `move_element` the instance in with `append`.
- Native Tabs come with 3 tabs and no way to add a 4th (WHTML `w-tabs` becomes plain divs) → Lumos Tab, or add tabs in the Designer.

### Text and tags

- `set_text` is an object, not a string.
- `TextBlock` ignores `set_text` → set the text on its String child with `data_element_tool > set_text`, or use Paragraph/Heading.
- **`set_text` does nothing on a DivBlock** (builder: silently ignored; element tool: "doesn't support text") → `data_element_settings_tool > set_settings` key `text` (`static_text.value`), or bind it to a prop with `binding`.
- `set_tag` takes `static_value`; on an instance's Tag prop it answers "cannot be set via the API" → Designer, Tag field.
- `BY_CUSTOM_TAG` `button` yields a Webflow Button (`<a>` with default text), not a `<button>`.

### Attributes

- Reserved names: `type` and `id` in the builder; `style` in API and Designer (→ a data attribute and a script).
- `set_attributes` often returns "internal error" → `data_whtml_builder` is the reliable way to set `id` and `data-*`.
- **Binding an attribute to a prop** (`data_element_settings_tool > set_settings`, key `attributes`, `value_binding: {source_type: "prop"}`) works on **DOM** elements only (`set_dom_config`); a Block answers "attributes not applicable". Passing `settings` while building the DOM element fails too: create it with static `set_attributes`, then `set_settings`, read back with `get_settings` `all_raw_settings`.
- A **conditional `class` attribute** (Lumos' Classes and Margin Bottom props both write one) works only once per element on a custom element — the last one wins. Make one apply only when the other is empty. Conditional attribute **names** cannot be set by API (Designer: Settings › Custom attributes › Name › purple dot › Create conditional; fill Value first or the row saves empty).
- Bound boolean props publish as `True` / `False` in attributes and embeds: scripts compare case-insensitively.
- Lumos Typography instances take no attributes through the API → wrap the text in a div that carries the `data-*` hook.

### WHTML

`data_whtml_builder`: HTML + optional CSS, max 5 fragments per call, one root element per fragment, no `<style>`, no keyframes, only the four standard breakpoints.

- Use it for paragraphs with inline links or bold, rich text, anything needing `id`/`data-*`. Use `class="…"` with names that already exist so no classes get invented.
- A bare `<p>` root → 400: wrap in `<div class="u-display-contents">`. `<a>` inside `<p>` → 400: build the link as a sibling element.
- It leaves a literal `class` attribute next to `styleNames`: overwrite it, do not remove it.
- `<a href>` becomes a Link that also keeps a custom `href` attribute, and `href="#"` gives no link setting at all → after the build, one `set_settings` call: `attributes` without `href` (keep any `data-*`) plus `link` with `static_link {mode: "url", to, open_in_new_tab}` (Sep 2026).
- Skip it for structure: it decides class names for you, and the CSS you pass creates classes outside the site's system.

### Links

- **`set_link` on a nested LinkBlock is silently dropped** (a top-level TextLink with a URL kept it). Read links back after every build; set missing ones with `data_element_settings_tool > set_settings` key `link`, `static_link {mode: "page", to: <pageId>}`, or `data_element_tool > set_link`. Both take **page** links on plain elements — only component link *props* refuse `page` (§5).

### Rich text

- Rich text is elements, not HTML. Build `Paragraph`, `ul`/`li` and DOM `strong` inside the `RichTextPropElement` (`parent_element_id` with the `prop` field set), then remove the default "Lorem" String node by its id **without** `prop`. `rich_text_inner_text` escapes markup. (CMS rich-text fields do accept HTML.)
- A DOM `li` inside a rich-text prop: after the first build, address the `ul` by id **without** `prop` (with it: "does not support text props").
- **Writing an existing rich-text prop in the primary locale drops its formatting** (bold, links): `rich_text_inner_text` writes plain paragraphs and the paragraph ids change. Formatted rich text is a Designer edit, or rebuild the formatting on purpose.
- **A heading in a rich-text prop on a page instance**: set the prop's value first if it is still on its default (no override = no element to address), build a `Heading` `after` the override's paragraph node, addressed **without** `prop` (with `prop`: "does not support text props"), and remove the paragraph (a leftover `<p>` doubles the text). The component default stays `<p>`. Not inside Lumos slots or through a nested instance ([componentize/mechanics.md](../skills/componentize/mechanics.md) Props): there it is a Designer step.

### Forms

- The builder's `Form` type creates a complete form block (FormWrapper › FormForm with Name/Email inputs and a submit button, plus success and error messages). Remove the default fields and button, restyle the parts with the site's form classes, insert the site's form components (`Form Input`, the button) into the FormForm. A Lumos `Button Main` submits when its Button Type prop is `false` (Submit) and its Link prop is cleared (`type: "null"`).
- **Native file upload** (paid plan only): `.w-file-upload-default` sets `color: #333` (dark on a dark theme: style it); the class-less `.w-file-upload-error` wrapper adds a 10 px top margin. A file input's Name set by API reads back right but publishes `name="file"` until retyped in the Designer: check the published HTML.
- **Bot check**: Webflow forms carry Cloudflare Turnstile. In headless Chrome Submit stays disabled, and the widget adds a row to a grid form (use a layout that tolerates an extra child). Never fight the `w-form-loading` class with a MutationObserver on `class` — it looped and froze the page. A real test submission is the owner's.

## 5. Components

Transforming, slots and what is addressable inside a definition: [componentize/mechanics.md](../skills/componentize/mechanics.md).

### Props

- **`update_prop` with several props in one call can write each name/group onto the neighbouring prop** → one prop per call, then `get_component` to confirm names and groups.
- **Variant-type props cannot be created, renamed, regrouped or removed through the API** ("not an updatable prop type"; `create_prop` has no variant type; `remove_prop`: "Variant props cannot be deleted"). Linking a nested component's variant to a parent prop and moving `Variant` into a folder are Designer steps ([designer/README.md](designer/README.md) "Queue, then one pass").
- **Instance prop values** (`set_component_instance_prop_values`): keys `string_value`, `number_value`, `boolean_value`, `rich_text_inner_text`. An image prop takes `type: "string"` with the asset id (no image type); a variant prop `type: "string"` with the variant id (`"base"` for the base variant). An image prop's **default**: `update_prop` with `default_text.value` = the asset id.
- A title set through the API renders as `<p>` → Typography Heading (Plain Text) and its Tag ([cards/typography.md](../skills/cards/typography.md)), or the Designer.
- **Link props** take `link_mode` url / email / phone / popover — **no `page`**, no `collectionPage`. Use URL paths; Webflow then neither marks the current page (`w--current`) nor localizes the link. Page links are a Designer step.
- A **text prop** is fixed text **or** one CMS field — no "Apply for " + Job title. Put the fixed part in its own element.
- **Recreating a prop on a shared component wipes every instance's override and binding for it**, on every page. Before deleting/recreating, list the instances on all pages and save their values (or read them from `decisions/`) to restore them.
- **Removing a prop that a native condition reads** ("Title is set") silently turns that condition into a static Hidden: the element disappears on every instance. Find the conditions that use it (Designer) and re-point them first.
- `get_component_instance_props` leaves CMS-bound props out, and conditions read back only as `sourceType: conditional` → check these in the Designer or on the published page.
- **Component descriptions: 256 characters at most.** The API takes longer ones, but the Designer's component settings then refuse to save.
- Lumos `Icon` has a hidden code prop "SVG Icon" (Designer › Edit code only).
- Classes that only appear in a Classes prop are published.

### Variants

- A nested instance's prop changed inside a **variant** (a Button's icon) changes it in every variant → expose it as a prop on the parent ("Button Icon") and set it per instance.
- Webflow puts `w-variant-<id>` classes only on elements that **have** variant overrides; a test rule injected into a published page must target the variant through a parent that has the class.
- Variant styles (`:where(.w-variant-…)`) override base values such as margins: after a base write, check the variants too.

### Instances and slots

- `insert_component_instance` refuses an instance as parent → `data_component_builder > insert_in_slot` with `slot_name` (also for Lumos Layout columns). The builder returns no ids for leaf instances in nested slots: find them with a **page-wide** `query_elements` + `component_filter` (scoped queries return 0).
- `unlink_component_instance` refuses an instance inside a page slot ("Cannot unlink a Component inside a Page Slot") → `move_element` it to `page_wrap` first.
- On a component that is already placed, a new element shows on every instance until its binding lands → create it hidden in its base style, show it once props and conditions are set.

### Conditions

- A component's native **"prop is set"** condition, when false, **leaves the element out of the published HTML** (no `w-condition-invisible`), so a test harness cannot un-hide it. To test the hidden state, rebuild the markup in a test route, or put temporary data on one CMS item, publish that item only, and revert it.
- CMS-bound visibility is different: see §6.

### Components in rich text

The house rule: [lumos/components.md](lumos/components.md) "Blocks between paragraphs". Source: Webflow's [help article](https://help.webflow.com/hc/en-us/articles/55024205780627-Components-in-rich-text) (updated 26 Oct 2026; `help.webflow.com` answers 403 to scripts, read it through `https://help.webflow.com/api/v2/help_center/en-us/articles/55024205780627.json`), plus what was measured (Nov 2026).

- **Where**: static rich-text elements on the canvas and CMS rich-text fields; site, Shared Library and code components, forms included. CMS fields: every Site and Platform plan except Basic.
- **Build** each block as a small, flat component in a group of its own, with plain props (text, image, boolean, visibility). The CMS editor shows a card with the component's **name and description**, no preview: write both, and the prop names and tooltips, in the editor's language. Published, the component is a plain element directly inside the `.w-richtext`, no wrapper.
- **Webflow cannot**: bind its props to CMS fields; fill its slots (they show the main component's defaults); add a component that contains a Collection List, or add a Collection List to a component once an instance sits in rich text; put a component in another component's rich-text prop; unlink it; edit the main component from inside the rich text.
- **Insert**: cursor on a new line › `/` or the **+** › Component › the component; the props panel (canvas) or modal (CMS) opens. In the CMS the `/` menu showed only text styles (Nov 2026) → use the **+** left of the line. Dragging a component in from the canvas or Navigator does not work, only the insert menu. Props later: canvas, click the instance; CMS, click it › wrench.
- **Move**: in a static rich text, drag (after Esc) or cut and paste; in a CMS-bound rich text and in a CMS field only cut (⌘X) and paste (⌘V) on a new line. Props survive both.
- **Roles**: Site manager, Designer and Marketer add, configure, copy, move and delete; a Content editor only configures props; a Reviewer nothing.
- **Locales**: instances are added in the primary locale only and inherited by secondary locales. Changing an instance's props in a secondary locale **localizes the whole rich text**: later primary edits no longer reach that locale. To drop a block in one locale, give it a visibility prop.
- **Page branches**: instances in a static rich text are editable on a branch; in a CMS-bound rich text they are read-only there.
- **A block that needs the item's CMS data** (a card bound to the item's campaign or theme) → the inserted component is an empty placeholder (`div[data-…]`, no props); the template keeps the bound block (slot or hidden holder) and a small script moves it to the placeholder. No placeholder: the block stays at its default place. One per item; the script removes extra placeholders.
- **Styling**: `.u-rich-text` gives `figure`, `blockquote` and `p` their own margins → the component overrides them, or the script splits the rich text around the block (each part keeps the same classes and attributes). Measure the gap above and below every inserted block against the design.
- **Data API** (CMS rich-text field): `<wf-component component-id="<id on that site>"><wf-prop name="<prop id>" type="text">…</wf-prop></wf-component>`; a boolean as attribute `prop-<prop id>="true"`, an image as `prop-<prop id>='{"id":"<asset id>","url":"<cdn url>"}'`. A new one needs no `data-w-id` (Webflow adds it). Fill a few examples at hand-over so editors see the pattern.
- **Publishing**: publishing one item uses the main component as of the last **full-site** publish, and a main component that was never in a full-site publish does not appear at all. After changing the main component (not the item's content, §1): full-site publish first. Webflow says that updates the instances live; measured Nov 2026, the items kept the old render until **the items themselves** were published again → republish them too, then measure.
- On a site that installs a Shared Library: [library-sites.md](library-sites.md) "What Webflow allows".

## 6. CMS

- **Everything in the CMS is English** *(house)*: collection names, field names, help texts, option values and slugs — also when the project runs in another language.
- On a fresh Collection List, set **source and sort in one write** (`source` = `{collectionId}`, `sort` = `[{fieldSlug, direction: "ascending"}]`). Source first, sort later left the list in a permanent "[Conflict] component map" state → remove it and start again.
- A filter on a reference field takes only a fixed item id ("does not support bound filter values"): "= Current <Item>" is a Designer step. A filter on a **Switch** field takes `isOn` / `isOff`, not `equals`.
- **A Collection List filtered on the current item cannot become a component** ("Create component" greyed out, in a slot and loose alike). Route: make the component from a list **without** that filter, bind Filter to a prop, and set the prop per instance on the template to **Current <Item>** (componentize [mechanics](../skills/componentize/mechanics.md) "Filter, Sort and Show props").
- A nested list on a multi-reference field cannot be made by API (the `fieldId` is ignored and the list shows every item), nor a link to "the current item" → Designer (Collection page link without an item = current item).
- A MultiImage field cannot be shown inside a component (no nested Collection Lists in components) → numbered Image fields (Gallery image 1–3) with "is set" conditions.
- Reference sub-fields bind as `<refFieldId>:::<fieldId>` with the **page's** collection id; `get_bindable_sources` shows the exact string.
- A Block's visibility cannot be bound to a CMS image field: "is set" conditions are a Designer step. A conditionally hidden element stays in the DOM with `w-condition-invisible`, so a `:empty` wrapper does not collapse.
- **Dates**: the format is a Designer setting on each binding (no API); Webflow offers `DD.MM.YYYY` and `DD/MM/YYYY`, no `DD-MM-YYYY`. An unformatted date bound to a text prop renders as `MMMM D, YYYY` ("January 1, 2026"). Dates render in the **site's time zone** (`data_sites_tool`): `2026-01-01T00:00:00Z` shows as 31/12/2025 on a site set to America/Chicago — check the time zone before writing dates, or store them at noon.
- The Designer canvas hides **draft** items in lists (and shows stale data until reloaded, §1) → check lists on staging.
- A field's type cannot change: delete and recreate it (same name, new slug `…-2`; the old slug stays reserved). Only when the collection has no items, or after saving them.
- **PlainText fields created through the API are always multi-line**, and `singleLine` can be neither set nor read; the same for max characters (readable, not writable) and a Number field's negative and decimal settings → decide them per field in the CMS plan (single line for titles, labels, button text, names, SEO title and description; multi-line only where a line break may be needed) and set them in one Designer pass per collection: Settings › field › Single line › Save Field, then Save Collection (Nov 2026).
- CMS template SEO bindings: §9.

## 7. Assets

- `asset_tool > upload_image_by_url` takes a public URL and returns an asset id; it appends the extension to `asset_name` (pass the name without `.svg`). It needs the Designer bridge and can time out on Figma URLs → download the file, then the local route below (works without the Designer).
- Figma export URLs from `download_assets` are public but short-lived: upload in the same step. A component variant's export includes the **component set's background square and dashed outline** → strip them (the buttons skill's `clean-icons.py`) or export with the Plugin API (`exportAsync({format: 'SVG_STRING'})`).
- **Local file**: `data_assets_tool > create_asset` (MD5 hex) + a multipart POST of the returned `uploadDetails` to S3 (HTTP 201). The keys come back **camelCase** (`xAmzAlgorithm`, `xAmzCredential`, `xAmzDate`, `xAmzSignature`, `successActionStatus`, `contentType`, `cacheControl`); POST them as `X-Amz-Algorithm`, `X-Amz-Credential`, `X-Amz-Date`, `X-Amz-Signature`, `success_action_status`, `Content-Type`, `Cache-Control`, or S3 answers 403 AccessDenied. Right after the upload the asset may read back with size 0 while its variants exist: fine.
- `data_assets_tool` lists and updates what exists. On an Image element: `set_image_asset` (`image_asset_id`, optional `alt_text`); alt text otherwise inherits from the asset.
- **Bulk uploads** (hundreds of frames): batches of ~60 actions. A batch that times out still creates most records, with size 0 and no upload details → list the folder, delete the size-0 records, recreate those. Files with identical bytes get the **same asset id** (the second has no URL of its own): drop duplicates from any frame or URL list. Deleting is limited to ~30 a minute. Keep a script that reads the saved tool output and POSTs every `uploadDetails` field; never copy policies by hand.
- JSON files upload fine (`application/json`) and the CDN sends `access-control-allow-origin: *`, so a page script can `fetch` a data file from the asset store.
- **A file only the user's Chrome can open** (an attachment behind a login, e.g. Marker.io): in that tab, fetch the blob, compute its MD5 in page JS, `create_asset` with that hash, then POST the blob from the page to the returned S3 URL with every `uploadDetails` field (`mode: 'no-cors'`, opaque response). Check the CDN copy's MD5 afterwards. Never lift the signed URL's credentials out of the page, and never POST from the page to a localhost receiver: Chrome's local-network prompt froze the tab and disconnected the extension.
- **No `loading` setting for images through the API**: the LCP image stays Lazy until Settings › Load → Eager in the Designer → queue it.
- A Figma **VIDEO fill** cannot be exported by any tool (MCP `export_video` renders keyframes, not fills; the Plugin API has no bytes getter) → use the poster still and ask the designer for the MP4.

## 8. Interactions (IX3), scripts and embeds

When to use IX3 at all, and timings: [motion.md](motion.md) §3 and §2. Below are only API facts.

### IX3 (`data_interactions_tool`)

- Read its `guide` once. IX3 does not run on the Designer canvas. Navbar / dropdown / focus triggers cannot be authored through the API (Designer).
- To-tweens (`[null, value]`) never apply a from-state at rest; From-Tos do.
- Scroll triggers: `scrollTriggerConfig` with `start` / `end`, and the toggles `enter`/`leave`/`enterBack`/`leaveBack` as keys inside it.
- `ease` takes a preset index or `{type: "customEase", bezierCurve: "x1,y1,x2,y2"}`.
- **Trigger = one attribute selector**; targets `wf:attribute` with a full selector. One instance that needs other timing gets its own attribute value (`data-x="late"`) and a second interaction.
- **Scope targets to the trigger**: `filterContext.relationship: "none"` animates every match on the page (every card's caption at once) → `within` → `wf:trigger-only`, not within a class.
- `conditionalPlayback` breakpoints stop at `main` (≥ 992) → for ≥ 1280 animate a Number variable (`wf:variable`) and read it in a `large` style. A variable tween on a Size variable uses type `length` (not `size`).
- Remove CSS transitions on any property IX3 animates.
- Updating a timeline re-sends every existing step unchanged: read it back.
- **Hover**: use the role form (one `wf:hover` trigger, `pluginConfig.multiTimeline: true`, timelines with `triggerMetadata.role` mouseEnter / mouseLeave). The split form (two triggers, `eventMode` enter/leave) only allows `control: "play"` with several groups and plays **once**; enter → play / leave → reverse on one timeline fails (each trigger gets its own copy). Even the role form **sticks in the hover state** when the in-timeline is longer than the out-timeline and the hover is shorter than the difference, and jumps on a quick pass (the out-timeline replays its first recorded values). For hovers prefer Lumos trigger transitions ([buttons/motion.md](../skills/buttons/motion.md) §3).
- **Reverse is not an undo**: a `wf:class` Set (addClass) is not removed on reverse, and a `wf:variable` Set writes its recorded start value back inline (beating the stylesheet). On/off state that must follow the page → a small script writing a `data-*` attribute.
- **Two scroll timelines on the same property** (scroll down / back to top): each trigger pauses the other on a direction change — `leaveBack: "pause"` on the down trigger, `enter: "pause"` on the back-to-top one. Otherwise a quick down-and-up lets the slower timeline finish last and leaves the end state wrong.
- **Testing an unpublished IX3 change**: in headless Chrome intercept `webflow.*.js`, patch the interaction config, strip the `integrity` attribute from the script tag, serve it with `Access-Control-Allow-Origin: *`. Run the unpatched file as a control that reproduces the bug.
- **A background Chrome tab never plays IX3 or GSAP** (requestAnimationFrame is paused) → test motion headless.

### Scripts and embeds

- **Page custom code on a fresh page** (`create_page` with `duplicateOf`): `set_page_freeform_code` and `add_page_script` answer 404 "Custom code block not found" until the page's custom-code box has been saved once in the Designer.
- A **registered site script** gives the same 404 until the site's custom-code block exists → use the free site footer (`set_site_freeform_code`) with a pinned jsDelivr URL and SRI.
- **Writing an embed replaces its whole content** (`set_settings` key `code`; site custom code through `set_site_freeform_code`). Other sessions write in the same embeds: read the code back right before each write and add your lines to that, never to your own earlier copy. Never write a placeholder to fill in later: any publish by another session ships it. Keep a large embed as a file in the client repo, write its full content, read it back with `get_settings`.
- **The Designer canvas skips an HtmlEmbed that contains a `<script>`**, its CSS included (works live, not in the canvas) → CSS the Designer needs in a CSS-only embed, scripts in their own ([motion.md](motion.md) §8).

### Webflow and Lumos CSS that wins

- Webflow's navbar CSS `.w-nav[data-collapse="all"] .w-nav-button { display: block }` (0,3,0) overrides `display` on the Navbar button's class → override with a more specific attribute rule in `Global | Custom Code`.
- Lumos Global Styles: `.u-icon :is(path:not([stroke]), rect, circle, ellipse, polygon, polyline) { fill: currentColor !important }` and `.u-icon path[stroke] { stroke: currentColor !important }`. A multi-colour SVG in a `u-icon` embed needs an inline `style="fill: … !important"` on the coloured paths and no `stroke` attribute (a stroke attribute only swaps one rule for the other and draws an outline).

## 9. Pages, localization, branches, SEO fields

- `create_page` with `duplicateOf` copies a template page (Nav, Footer, Global components included) — the quick way to create link targets. Its custom code needs one Designer save first (§8).
- **Moving a page into a folder** (`parentFolderId`): the publish adds a 301 from the old path, but typed URLs (component link props, embeds) keep the old path → sweep them before publishing.
- **Localization**: secondary locales and the `Locales` list element cannot be added through the API (Designer, paid add-on). `data_localization_tool` writes secondary-locale text and prop overrides once they exist. It also sees what the element tools cannot: `get_component_content` lists content in slots filled inside a definition (with node ids), and `update_component_content` writes it — secondary locale only (primary: "The provided locale must be a secondary locale"). `get_page_content` with a secondary `localeId` returns only nodes that already have an override there → take prop ids from `get_all_elements` / `query_elements` and write the secondary locale from there.
- **Branches** (only when `project.json` says `"branching": true`): `create_branch`, `publish_branch`, `get_branch_conflicts`, `merge_branch`, `delete_branch` — all async with a `taskId`; the branch does not exist yet when `create_branch` returns. Known behaviour (Sept 2026; re-test before relying on branches): styles and components created on a branch are invisible from main; at merge, edits to **pre-existing** classes are silently dropped (main wins, no conflict raised), and breakpoint rules on your own classes were lost too; colliding new names get renamed (`Button` → `Button 2`); the CMS is not branched. Until fixed, branching stays off.
- **CMS template SEO** binds through `data_pages_tool` with the same `{{wf {"path":"<field-slug>","type":"PlainText"\} }}` (the `\}` is literal) string the Designer writes (read one back from a template that has it). An Open Graph image binding is refused (`imageUrl` must be an http URL) → Designer.

## 10. Shared Libraries

Moved to [library-sites.md](library-sites.md): what Webflow allows ("What Webflow allows": hidden components, class prefix, paid plan, the canvas skipping an embed with a script), the Accept that strips library classes from site-owned elements ("The rule behind it"), setup, audit and the accept check ("Every library round").

## 11. The Designer

Moved to [designer/README.md](designer/README.md): "Which Chrome" (a Chrome of its own per client, the `--autoConnect` fallback, one Designer for several sessions), "Queue, then one pass" (with the `designer-queue.md` format), "Reload", "Background tab and a window behind others", the `wfd` recipes and the "Manual routes" (formerly "Handholds (by hand)").
