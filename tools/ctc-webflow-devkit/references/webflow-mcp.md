# Webflow MCP — call shapes and gotchas

A block is two calls, not twenty. Source: Webflow MCP 2.0.1 tool schemas plus what failed in practice.

## 1. All classes of a block in one call

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

- `property_value` or `variable_as_value`, never both. `variable_as_value` takes the full id **including the `variable-` prefix**; without it the call fails with a misleading "internal error".
- Longhand property names: `padding-top` not `padding` (shorthand rejects a linked variable), `grid-column-gap`/`grid-row-gap` not `column-gap`/`row-gap`.
- One rejected property fails the whole call with "internal error". Keep batches per block, and when a batch fails, bisect it.
- Breakpoints: `main`, `large`, `xl`, `xxl` (≥), `medium`, `small`, `tiny` (≤). One `update_style` per breakpoint, in the same `actions[]`. Pseudo states (`hover` …) the same way via `pseudo`.
- **`large` / `xl` / `xxl` only work when the site has enabled them** (Designer: "Add large breakpoints"). Otherwise the write succeeds and is stored but never emitted — check before building for ≥ 1280, and ask the owner before enabling them (site-wide).
- Combo classes: `parent_style_names` lists the **full** chain (`["card", "is-bordered"]`). `set_style` with several names only works once that exact chain exists.
- `calc(var(--x) * -1)` is silently normalised to the bare positive variable, and any `calc()` with two or more variables keeps only the first (`calc(100% - (var(--a) - var(--b)) * 2)` → `var(--a)`). Read the class back after any `calc` write — and judge by the **published CSS**, not the read-back alone: the read-back can also show the bare variable for a calc that was stored and published intact (`calc(var(--_spacing---space--4) - .2em)`, Forest3). The fix is a Lumos route or the Designer UI, never custom code ([lumos-rules.md](lumos-rules.md) §0).
- The same flattening hits `calc()` with one variable in `opacity`, `filter` and `width` (→ the bare variable). `transform` calcs survive.
- `text-shadow` and gradient stops mangle `var()`; use literal values there.
- **Refused properties:** `-webkit-line-clamp`, `line-clamp`, `-webkit-box-orient` (also refused as Designer custom properties) → Lumos `u-line-clamp-N`, which forces `display: -webkit-box !important` (hide a wrapper, never the clamped element). `--flex-medium` ("Invalid style property").
- **Custom properties on a class are refused** (`--_theme---text`, `--_text-style---font-weight`: "Invalid style property"). Route: a variable **mode** (a Theme mode with the colours you need, set on the class with `set_style_variable_mode`), or the Lumos instance's Style prop (inline) for a one-off.
- `content` on `::before`/`::after` is mangled (`'"'` comes back as `'"'|`): put the character in the text or the CMS field instead.
- Accepted: `min(…, 50cqi)`, `container-type`, `mix-blend-mode`.
- `display: grid` via `data_style_tool` silently adds Webflow's default 2 × 2 template (`wf-grid`): set `grid-template-columns`/`rows` in the same write, or use flex.
- Style names keep a dot (`style2.0_wrap`), selectors and `parent_style_names` use the dash (`style2-0_wrap`). `query_styles` matches on `name_path`, not keywords.

## 2. The whole element tree in one call

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

- Style names must exist → call 1 always first.
- `set_style` with several names = combo class (chain must exist, see above).
- Only Container, Section, DivBlock and DOM elements take children.
- Inside a component definition pass `scope_component_id`; `parent_element_id.component` is then the component id. On a page it equals `pageId`.
- Element ids from a response go back verbatim, never shortened.
- **Unknown keys are silently ignored and the call still reports success.** `set_text` is an object, not a string. After every build call, `data_element_tool > query_elements` on the new subtree and confirm tag, classes and text. Success is not proof.
- A component instance is never an anchor or parent for `data_element_builder`, `move_element` or `insert_component_instance`; use its parent with `append`/`prepend` or a non-instance sibling.
- `set_attributes` often returns "internal error"; `data_whtml_builder` is the reliable way to set `id` and `data-*` attributes.
- `page_main` is a page slot that accepts only components: a plain tree under it is refused. Build after it (parent `page_wrap`), transform, `move_element` the instance in with `append`.
- `TextBlock` ignores `set_text`; set the text on its String child with `data_element_tool > set_text`, or use Paragraph/Heading.
- **A failed build still leaves the partial tree** (often empty component instances, or the top elements of a call that answered with an error such as "`type` is a reserved attribute name"). Read the parent back after every failed call and remove the leftovers before retrying: on PMS an empty duplicate group pushed a button out of place and a script kept hanging on an empty block.
- `type` and `id` are reserved attribute names in the builder. `BY_CUSTOM_TAG` `button` yields a Webflow Button (`<a>` with default text), not a `<button>`.
- A DOM `li` appended inside a rich-text prop: after the first build address the `ul` by id **without** `prop` ("does not support text props" with it).
- **`set_link` on a nested LinkBlock is silently dropped** (the build reports success, the read-back has no link; a top-level TextLink with a URL did keep it). Read links back after every build and set missing ones with `data_element_settings_tool > set_settings` key `link`, `static_link {mode: "page", to: <pageId>}`, or `data_element_tool > set_link`. Both take **page** links on plain elements — only component link *props* refuse `page` (§10).
- The builder's `Form` type creates a complete Webflow form block (FormWrapper › FormForm with Name/Email inputs and a submit button, plus success and error messages). Remove the default fields and button, restyle the parts with the site's form classes, then insert the site's form components (`Form Input`, the button) into the FormForm. A Lumos `Button Main` submits when its Button Type prop is `false` (Submit) and its Link prop is cleared (`type: "null"`).
- **Native file upload** (paid plan only): `.w-file-upload-default` sets `color: #333` (dark text on a dark theme: style it), and the class-less `.w-file-upload-error` wrapper adds a 10 px top margin. A file input's Name set by API reads back right but publishes `name="file"` until it is retyped in the Designer: check the published HTML.
- **Bot check:** Webflow forms carry Cloudflare Turnstile. In headless Chrome Submit stays disabled and the widget adds a row to a grid form (give the form a layout that tolerates an extra child). Never fight the `w-form-loading` class with a MutationObserver on `class` — it looped and froze the page. A real test submission is the owner's.

## 3. WHTML — for text-heavy markup and attributes

`data_whtml_builder`: HTML + optional CSS, max 5 fragments per call, one root element per fragment, no `<style>`, no keyframes, only the four standard breakpoints.

Use it for: paragraphs with inline links or bold, rich text, anything needing `id`/`data-*` attributes. Use `class="…"` with names that already exist so no new classes get invented. A bare `<p>` root returns 400 → wrap in `<div class="u-display-contents">`. `<a>` inside `<p>` returns 400 → build the link as a sibling element instead. The tool leaves a literal `class` attribute next to `styleNames`; overwrite it, do not remove it.

Skip it for structure: it decides class names for you, and the CSS you pass creates classes outside the site's system.

## 4. Reading

- `get_styles` with properties is ~700 KB, `list_pages` ~70 KB, `query_elements` on a big subtree likewise. When a read is large, write the JSON to a file and grep or script over it; the payload sits at `result[0].data[0]`.
- After a context compaction the tool schemas are gone. Re-read this file before the first call.
- On a CMS template page that has never been opened in the Designer, element and style calls answer "styles not found". Style calls work with another page's `pageId` (styles are site-wide); element work waits until the page has been opened once.

## 5. Assets

`asset_tool > upload_image_by_url` takes a public URL and returns an asset id; `data_assets_tool` lists and updates what exists. Figma export URLs from `download_assets` are public but short-lived: upload in the same step. Set the id on an Image element with `set_image_asset` (`image_asset_id`, optional `alt_text`); alt text otherwise inherits from the asset.

- `upload_image_by_url` needs the Designer bridge and can time out on Figma URLs: download the file, then `data_assets_tool > create_asset` + the S3 POST (§9). Works without the Designer.
- An asset uploaded after the user's Designer tab loaded shows as a grey placeholder there until the Designer is reloaded. Not a bug.
- **Bulk uploads** (`create_asset` + S3 POST, e.g. hundreds of animation frames): batches of ~60 actions. A batch that times out still creates most records, with size 0 and no upload details — list the folder, delete the size-0 records, recreate those. Files with identical bytes get the **same asset id** (the second never has its own URL): drop duplicates from any frame or URL list. Deleting is limited to ~30 a minute. Keep a script that reads the saved tool output and POSTs every `uploadDetails` field; never copy policies by hand.
- JSON files upload fine as assets (`application/json`) and the CDN sends `access-control-allow-origin: *`, so a page script can `fetch` a data file from the asset store.
- A Figma **VIDEO fill** cannot be exported by any tool (MCP `export_video` renders keyframes, not fills; the plugin API has no bytes getter). Use the poster still and ask the designer for the MP4.

## 6. Rich text through the API

Rich text is elements, not HTML. Build `Paragraph`, `ul`/`li`, and DOM `strong` inside the `RichTextPropElement` (`parent_element_id` with the `prop` field set), then remove the default "Lorem" String node using its id **without** `prop`. `rich_text_inner_text` escapes markup. CMS rich-text fields do accept HTML.

**A heading in a rich-text prop on a page instance** (a real H1/H2 on one instance): set the prop's value first if it is still on its default (no override = no element to address), then build a `Heading` `after` the override's paragraph node, addressed **without** `prop` (with `prop`: "does not support text props"), and remove the paragraph — a leftover `<p>` doubles the text. The component default stays `<p>`. This does not work inside Lumos slots or through a nested instance ([componentize/mechanics.md](../skills/componentize/mechanics.md) Props): there it is a Designer step.

## 7. Branches (only when `project.json` says `"branching": true`)

`create_branch`, `publish_branch`, `get_branch_conflicts`, `merge_branch`, `delete_branch` — all async with a `taskId`; the branch does not exist yet when `create_branch` returns.

Known behaviour (Sept 2026, a fix is expected): styles and components created on a branch are invisible from main; at merge, edits to **pre-existing** classes are silently dropped (main wins, no conflict raised), and breakpoint rules on your own classes were lost too; colliding new names get renamed (`Button` → `Button 2`); the CMS is not branched. Until fixed, branching stays off.

## 8. Variables

`data_variable_tool`, as seen October 2026:

- **`custom_value` is refused** on create and update of size and colour variables: every expression (`clamp()`, `calc(1rem + 1vw)`, `color-mix()`) returns "internal error". `static_value` and `existing_variable_id` (alias, also across collections and inside the same collection) work. Opacity swatches are therefore 8-digit hex (`#ffffff1a`). **Fluid sizes** go into the variable's value as a `clamp()` formula, as Lumos ships it (`site/gutter`), typed into the Variables panel by the agent (§11) — not Fluid Builder, not a `:root` block in custom code. Formula and list: [build/foundations.md](../skills/build/foundations.md) §4.
- **`mode_id: "base"` is refused.** Omit `mode_id` to write the base mode; pass the `mode-…` id for every other mode.
- A new mode starts with the base mode's values; set every variable the mode should differ in.
- New variables always land at the **bottom** of their collection; the API reorders collections (`reorder_variable_collection`) but not variables inside one. Create new ones in one call in the intended order (light → dark, per group); a later sort is a Designer drag.
- `update_*_variable` sometimes answers "internal error" on an existing size variable (PMS `nav/height`): set the value on the classes that read it, or in the Variables panel.
- `get_variables` with all modes on a full Lumos site is ~100 KB: write it to `references/variables.json` and check it by script. Values come back as `{value, unit}`, `{id}` (alias) or `{type: "custom", value}`.
- On a style, `text-wrap` rejects a FontFamily variable through `variable_as_value`; pass `property_value: "var(--_text-style---text-wrap)"`. Webflow stores it back as a variable link.

## 9. Components, props and colours — traps

As seen October 2026 (Lumos starter, buttons):

- **Colour values with `color-mix()` or `var()` strings are flattened to their first variable** by `update_style` and `set_variant_styles` (raw `var(--…)` too). The Lumos trigger recipe for colours cannot be written by the agent; use the native `:hover` pseudo on the parent and let children inherit (`border-color: inherit`). Transforms with trigger calcs (`scaleX(calc(100% * @var_variable-…))`, `transform-origin: calc(100% * @var_…) 100%`) are stored fine. Read back after any calc.
- **`update_prop` with several props in one call can write each name/group onto the neighbouring prop.** One prop per call, then `get_component` to confirm names and groups.
- **Variant-type props cannot be created, renamed or regrouped through the API** ("not an updatable prop type"; `create_prop` has no variant type). Linking a nested component's variant to a parent prop, and moving `Variant` into a folder, are Designer steps (§11).
- **Instance prop values** (`set_component_instance_prop_values`): keys `string_value`, `number_value`, `boolean_value`, `rich_text_inner_text`. An image prop takes `type: "string"` with the asset id (there is no image type); a variant prop `type: "string"` with the variant id (`"base"` for the base variant). An image prop's **default** is `update_prop` with `default_text.value` = the asset id. A title set through the API renders as `<p>`: fix the level with Typography Heading (Plain Text) and its Tag ([cards/typography.md](../skills/cards/typography.md)), or in the Designer.
- `set_style_variable_mode` needs the collection id **with** its `collection-` prefix. It accepts `variant_id` and `mode_id: "base"` (unlike the variable tool) — the way to switch a Text Style per component variant. It also takes `variant_id` **and** `breakpoint_id` together: one variant can be Text Small on desktop and Text Main at `small` (set the mode on the combo, e.g. `parent_style_names: ["button_main_text"]`, `style_name: "u-text-style-main"`). Same for combos outside components: `footer_bottom_text.u-text-style-small` → XSmall mode at `small`.
- Combo chains with a utility (`footer_heading` + `u-text-style-h1`) must exist before `set_style` or the builder can apply both names; create them with `create_style` (`name: "u-text-style-h1"`, `parent_style_names: ["footer_heading"]`, empty `properties` allowed). The element still gets the global utility's CSS; the combo only holds the overrides.
- **A component instance is never an anchor** for `data_element_builder`, `insert_component_instance` or `move_element` (`before`/`after`). Append to the parent, then `move_element` the siblings (an instance can be the moved element) to order them.
- Elements that come from the page template (`page_wrap`, `page_main`) have **different ids per page**; query them per page (`component_filter` on Global Styles with `return_parent: "parent"`). Empty CMS template pages have neither.
- `download_assets` exports of a component variant include the **component set's background square and dashed outline**; strip them before using the SVG (see the buttons skill's `clean-icons.py`) or export with the Plugin API (`exportAsync({format: 'SVG_STRING'})`).
- `asset_tool > upload_image_by_url` appends the extension to `asset_name`; pass the name without `.svg`. For local files use `data_assets_tool > create_asset` (MD5 hex) + a multipart POST of the returned `uploadDetails` to S3 (HTTP 201).
- `mask-image`, `mask-size`, `mask-repeat`, `mask-position` are accepted as style properties; Webflow's asset CDN answers with `access-control-allow-origin: *`, so masks work cross-origin.
- `unlink_component_instance` refuses an instance inside a page slot ("Cannot unlink a Component inside a Page Slot"): `move_element` it to `page_wrap` first.
- `remove_prop` refuses variant props ("Variant props cannot be deleted"): Designer.
- `insert_component_instance` refuses an instance as parent; `data_component_builder > insert_in_slot` with `slot_name` works (also for Lumos Layout columns). The builder returns no ids for leaf instances in nested slots: find them with a **page-wide** `query_elements` + `component_filter` (scoped queries return 0).
- **Recreating a prop on a shared component wipes every instance's override and binding for it**, on every page. Before deleting/recreating props, list the instances on all pages and save their values (or read them from the `decisions/` files) to restore them.
- **Removing a prop that a native condition reads** ("Title is set") silently turns that condition into a static Hidden: the element disappears on every instance. Before removing a prop, find the conditions that use it (Designer) and re-point them.
- **Component descriptions: 256 characters at most.** The API takes longer ones, but the Designer's component settings then refuse to save.
- Bound boolean props publish as `True` / `False` in attributes and embeds: scripts compare case-insensitively.
- `get_component_instance_props` leaves CMS-bound props out, and conditions read back only as `sourceType: conditional`. `get_component` keeps calling a slot "Slot" after it was renamed in the Designer. Check these in the Designer or on the published page.
- The open Designer canvas does not show API prop changes until the Designer tab is reloaded.
- `set_tag` takes `static_value`; on an instance's Tag prop it answers "cannot be set via the API" (Designer, Tag field). `remove_element` / `set_style` take `id`; `move_element` takes `anchor_element_id` + `creation_position`; `update_style` with `remove_properties` (+ `breakpoint_id`) clears properties.
- Transforming, slots and what is addressable inside a definition: [componentize/mechanics.md](../skills/componentize/mechanics.md).
- A single click on a component in the Designer's Components panel already drops an instance at the bottom of the Body; remove strays.
- Lumos `Icon` has a hidden code prop "SVG Icon" (Designer › Edit code only).
- **`transition-property` with a comma list** (`"background-color, color"`) publishes as `transition: background-color .3s …, color undefined undefined` — invalid, so no transition at all, while the API read-back looks right. Use one property or `all`, and read the published CSS. Trigger `calc()`s in `transition-duration` and inside `cubic-bezier()` (one variable per calc) are stored and published correctly.
- Refused on styles: CSS custom properties on a class; a length variable on `outline-width`.
- A **conditional `class` attribute** (Lumos' Classes and Margin Bottom props both write one) only works once per element on a custom element: the last one wins. Make one apply only when the other is empty. Conditional attribute names cannot be set by API (Designer: Settings › Custom attributes › Name › purple dot › Create conditional; fill Value first or the row saves empty).
- Classes that only appear in a Classes prop are published.

- **Bare combo names are ambiguous.** `set_variant_styles` / `update_style` by a bare combo name (`is-right`) write to the first combo of that name on the site — with five `is-right` combos the value landed under another component's selector and changed nothing. Give combos unique names, or rename the other ones for the write and back; read the selector in the published CSS.
- A component **text prop** is fixed text **or** one CMS field — no "Apply for " + Job title. Put the fixed part in its own element.
- A nested instance's prop changed inside a **variant** (a Button's icon) changes it in every variant: expose it as a prop on the parent ("Button Icon") and set it per instance.
- Lumos Typography instances take no attributes through the API: wrap the text in a div that carries the `data-*` hook.
- **CMS template SEO** binds through `data_pages_tool` with the same `{{wf {"path":"<field-slug>","type":"PlainText"\} }}` (the `\}` is literal) string the Designer writes (read one back from a template that has it). An Open Graph image binding is refused (`imageUrl` must be an http URL): Designer.

### CMS through the API

- **Everything in the CMS is English** *(house)*: collection names, field names, help texts, option values and slugs — also when the project is run in another language.
- A Collection List filter on a reference field takes only a fixed item id ("does not support bound filter values"): "Trial = Current Trial" is a Designer step.
- On a fresh list, set **source and sort in one write** (`source` = `{collectionId}`, `sort` = `[{fieldSlug, direction: "ascending"}]`). Source first, sort later left the list in a permanent "[Conflict] component map" state; remove it and start again.
- A nested list on a multi-reference field cannot be made by API (the `fieldId` is ignored and the list shows every item), nor a link to "the current item": Designer (Collection page link without an item = current item).
- A MultiImage field cannot be shown inside a component (nested Collection Lists are not allowed in components): use numbered Image fields (Gallery image 1–3) with "is set" conditions.
- Reference sub-fields bind as `<refFieldId>:::<fieldId>` with the **page's** collection id; `get_bindable_sources` shows the exact string.
- Native Tabs from the API come with 3 tabs and no way to add a 4th (WHTML `w-tabs` becomes plain divs): use Lumos Tab, or add tabs in the Designer.
- A Block's visibility cannot be bound to a CMS image field; "is set" conditions are a Designer step. A conditionally hidden element stays in the DOM with `w-condition-invisible`, so a `:empty` wrapper does not collapse.
- A Collection List filter on a **Switch** field takes `isOn` / `isOff`, not `equals`.
- **Dates:** the format is a Designer setting on each binding (no API). Webflow offers `DD.MM.YYYY` and `DD/MM/YYYY`, no `DD-MM-YYYY`. Dates render in the **site's time zone** (`data_sites_tool`): a date stored as `2026-01-01T00:00:00Z` shows as 31/12/2025 on a site set to America/Chicago — check the time zone before writing CMS dates, or store them at noon.
- The Designer canvas hides **draft** CMS items in lists, and can show stale CMS data after API writes until it is reloaded. Check lists on staging.
- A field's type cannot change: delete and recreate it (same name, new slug `…-2`, old slug stays reserved). Only when the collection has no items, or after saving them.

## 10. Navigation, scripts, IX3, localization — traps

As seen October 2026 (Lumos starter, nav):

- **`set_text` does nothing on a DivBlock** (builder: silently ignored; element tool: "doesn't support text"). Write a div's text with `data_element_settings_tool > set_settings` key `text` (`static_text.value`), or bind it to a prop with `binding`.
- **Page custom code / scripts on a fresh page:** on a page just made with `create_page` (`duplicateOf`), `set_page_freeform_code` and `add_page_script` answer 404 "Custom code block not found" until the page's custom-code box has been saved once in the Designer; after that it works. A registered site script gives the same 404 until the site's custom-code block exists — then use the free site footer (`set_site_freeform_code`) with a pinned jsDelivr URL and SRI.
- `set_component_instance_prop_values` link props take `link_mode` url / email / phone / popover — **no `page`** and no `collectionPage`. Use URL paths; Webflow then neither marks the current page (`w--current`) nor localizes the link. Page links are a Designer step.
- `create_page` with `duplicateOf` copies a template page (Nav, Footer, Global components included) — the quick way to create link targets.
- **Rate limit**: ~7 `insert_component_instance` (or other heavy writes) in one call hit HTTP 429; the rest of the batch fails. Batch 3–4, wait ~45–60 s after a 429, check what landed before retrying. Around 12 element writes in a row trip it too (wait ~90 s). The limit is **per site, shared by every session**: with several sessions on one site a 429 comes every few writes — write in small groups and read back what landed. On a component that is already placed, a new element shows on every instance until its binding lands: create it hidden in its base style, show it once props and conditions are set.
- **Publishing**: one publish per minute per site, and a publish ships **every session's saved work**, half-built units included. Tell the other sessions on the site before publishing, publish edited CMS items before the site, and do not publish while another session is mid-change.
- Webflow's navbar CSS `.w-nav[data-collapse="all"] .w-nav-button { display: block }` (0,3,0) overrides `display` on the Navbar button's class; override with a more specific attribute rule in `Global | Custom Code`.
- Webflow only puts `w-variant-<id>` classes on elements that **have** variant overrides. A test rule injected into a published page must target the variant through a parent that has the class.
- Lumos Global Styles: `.u-icon :is(path:not([stroke]), rect, circle, ellipse, polygon, polyline) { fill: currentColor !important }` and `.u-icon path[stroke] { stroke: currentColor !important }`. A multi-colour SVG in a `u-icon` embed needs an inline `style="fill: … !important"` on the coloured paths and no `stroke` attribute (a stroke attribute only swaps one rule for the other and draws an outline).
- **IX3** (`data_interactions_tool`): read the `guide` once. To-tweens (`[null, value]`) never apply a from-state at rest; From-Tos do. Scroll triggers: `scrollTriggerConfig` with `start` / `end` and the toggles `enter`/`leave`/`enterBack`/`leaveBack` as keys inside it. `ease` takes a preset index or `{type: "customEase", bezierCurve: "x1,y1,x2,y2"}`. Targets `wf:attribute` with a full selector. `conditionalPlayback` breakpoints stop at `main` (≥ 992) — for ≥ 1280 animate a Number variable (`wf:variable`) and read it in a `large` style. Remove CSS transitions on any property IX3 animates. **Scope targets to the trigger**: a target with `filterContext.relationship: "none"` animates every match on the page (four cards' captions fading together); use `within` the trigger element. IX3 does not run on the Designer canvas. Navbar / dropdown / focus triggers cannot be authored through the API. A variable tween on a Size variable uses type `length` (not `size`). Updating a timeline re-sends every existing step unchanged; read it back.
- **IX3 hover:** use the role form (one `wf:hover` trigger, `pluginConfig.multiTimeline: true`, timelines with `triggerMetadata.role` mouseEnter / mouseLeave). The split form (two triggers, `eventMode` enter/leave) only allows `control: "play"` with several groups and plays **once**; enter → play / leave → reverse on one timeline fails (each trigger gets its own copy). Even the role form **sticks in the hover state** when the in-timeline is longer than the out-timeline and the hover is shorter than the difference (both run, in finishes last), and jumps on a quick pass (the out-timeline replays its first recorded values). For hovers prefer Lumos trigger transitions ([buttons/motion.md](../skills/buttons/motion.md) §3).
- **IX3 reverse is not an undo.** A `wf:class` Set (addClass) is not removed on reverse, and a `wf:variable` Set writes its recorded start value back inline (which then beats the stylesheet). For on/off state that must follow the page, use a small script that writes a `data-*` attribute.
- **Two scroll timelines on the same property** (scroll down / back to top): each trigger must pause the other on a direction change — `leaveBack: "pause"` on the down trigger, `enter: "pause"` on the back-to-top one. Without it a quick down-and-up lets the slower timeline finish after the faster one and leaves the end state wrong.
- **Testing an unpublished IX3 change:** in headless Chrome intercept `webflow.*.js`, patch the interaction config in it, strip the `integrity` attribute from the script tag, and serve it with `Access-Control-Allow-Origin: *`. Run the unpatched file as a control that reproduces the bug. A **background** Chrome tab never plays IX3 or GSAP (requestAnimationFrame is paused): test motion headless.
- **Moving a page into a folder** (`parentFolderId`): the publish adds a 301 from the old path, but typed URLs (component link props, embeds) keep the old path — sweep them before publishing.
- **IX3 trigger = one attribute selector.** One instance that needs other timing (a caption that must start later on one band) gets its own attribute value (`data-story="band-late"`) and a second interaction. Scope targets with `within` → `wf:trigger-only`, not within a class.
- **Localization**: secondary locales and the `Locales` list element cannot be added through the API (Designer, paid add-on). `data_localization_tool` writes secondary-locale text and prop overrides once they exist.

## 11. The Designer in the user's Chrome

What the API refuses is done in the Designer by the agent, not handed to the user. Two routes:

- **Claude in Chrome** (the extension), when it loads in the session.
- **`chrome-devtools-mcp --autoConnect`** (user-scope MCP server), when it does not (e.g. in Orca sessions). It attaches to the user's running Chrome, so the Designer opens as a **tab in their normal window with their own Webflow login** — no separate profile or window (owners find that awkward). Once per machine: remote debugging on at `chrome://inspect/#remote-debugging`; Chrome may ask to allow the connection. On macOS the host app needs Full Disk Access, otherwise it cannot read `DevToolsActivePort` and reports "Could not find DevToolsActivePort" although the file exists. `--browserUrl` is no way round it (Chrome's switch serves no `/json/version`).

**One Designer, several sessions:** all Claude sessions on a site share the one Designer tab. Data API work can run in parallel; Designer UI clicks and `designer_tool` page/canvas switches only when no other session is using it (check `ListAgents`, or message the busy one). Measure by reading the canvas iframe, not by clicking.

Designer quirks (Forest3, Oct 2026): after a scripted drag or after closing the rich-text editor, the rich-text editor and the Allowed-components picker stop opening until the Designer is reloaded; props inside a folder drag the same way folders do; a scripted click on a link on the canvas navigates the canvas (404) — reload. A temporary element made only to reach a style (a rich text for a nested list style) is deleted in the same step, and nothing is published until the pass is over.

### Queue, then one pass

The Designer is the slowest surface: every step costs a load, snapshots and clicks, and all sessions share one tab (PMS, Oct 2026: 263 snapshots and 272 clicks for a few dozen steps). So a Designer-only step is not done the moment it comes up:

1. **Queue it.** Do the API part, append the step to `references/designer-queue.md` in the client repo and carry on with the next unit. Work that depends on the step (measuring a binding, reviewing a heading level) goes into the same entry as `then:`, not into a separate Designer trip.
2. **One pass per task**: at hand-over ([build](../skills/build/SKILL.md) §6, [review](../skills/review/SKILL.md) §6) or when the user asks. Check `ListAgents`; if another session holds the Designer, message it and wait for its "Designer free". Claim it: message the other sessions on the site ("Designer: <n> queue items, until I say free") and mark the items `doing (<session name>)`.
3. **Load once, after all API writes**: the canvas shows API changes only after a reload. Group the items by page and component and open each component once.
4. **Per item**: the recipe from [designer/](designer/README.md) when there is one (one `evaluate_script` per item, no snapshot rounds), otherwise by hand with the notes below. Read back through the API or on staging, then tick the item with the date, the minutes it took and what was read back (the minutes show whether recipes pay off). A recipe that fails twice: do the item by hand and fix or flag the recipe (the Designer's markup changed).
5. **Release and publish once**: message "Designer free", then publish once after the pass (where publishing is allowed), not per item.

Items the agent cannot do (login expired, a paid add-on, a destructive step the user has not OK'd) stay open and go into the hand-over as literal steps with the reason.

`references/designer-queue.md` (the project skill scaffolds it):

```
# Designer queue

## Open
- [ ] <page or component> › <element> — <what, with the exact value> — API: <the refusal> — recipe: <name or "by hand"> — then: <check that waits on it> — <session>, <date>

## Done
- [x] … — <date>, <minutes> min in the Designer, read back: <how>
```

Work in a **new background tab** (`new_page` with `background: true`) on `https://<site>.design.webflow.com/`; never touch the user's other tabs (they show in `list_pages`, often other clients). Learned on PMS (Oct 2026):

- **Variable values** (the `clamp()` formulas the API refuses): open the panel by script on the button with `aria-label="Variables (V)"`, open collection and group, click the value cell **twice** (the first selects, the second opens an input with its own uid), `fill` that input, Enter, read back through the API. Not select-all + type (typed a literal `a`). uids shift with every snapshot.
- **Selecting on the canvas**: in `evaluate_script`, find the element in the canvas iframe, `scrollIntoView`, then dispatch `pointerdown/mousedown/pointerup/mouseup/click` on `elementFromPoint`. An element without size (empty nested list, hidden block) is selected in the Navigator: click the `navigator-expand-collapse-caret-button` at the label's y, then the label; give a hidden block no class for a moment to find it.
- **Typing**: `type_text` only after clicking into the field and checking it has focus; keys typed while focus is on the canvas (or before a picker opens) fire Designer shortcuts (Add panel, guides, C = Comment mode).
- **Styles panel**: the style selector's dropdown options ignore mouse clicks — use Down/Up + Enter. Change no property before the selector is picked, or Webflow creates a class on the selected text instead. A nested tag selector ("All Italics" / "All Paragraphs" inside a class) only offers "Nest selector inside of" when the parent is a **Rich Text** element, not a div: add a temporary Rich Text with the class, set the selector, remove it. Rich-text **prop defaults** are edited in the Properties panel (K) › the prop › Edit Rich Text, not on the canvas.
- The canvas may sit in **pan & zoom** (four breakpoints side by side, every element four times): "Exit pan & zoom canvas" first.
- **Dragging into an empty slot of a nested instance** fails in the Navigator ("Elements can't be dragged into component instances outside of slots"); release the drag in the canvas iframe instead (pointer/mouse events in the iframe document). For the last slot row in the Navigator, move the cursor further right. An empty Layout is `w-condition-invisible` on the canvas.
- **Cut and paste works in a foreground Claude in Chrome tab** (`computer` key `cmd+x`, select the target, `cmd+v`; paste lands after the selected sibling, or inside a selected empty slot). It moves existing elements into slots — the route the API does not have — and keeps CMS bindings, prop bindings, conditions and classes; element ids change, so query them again. A Navigator drag often does not register there, and through CDP (`chrome-devtools-mcp`) a paste is ignored. A CMS list for a slot: build it in `page_wrap` after `page_main`, then cut and paste it in.
- **Condition field picker:** it only lists as many fields as fit the window height (about 50); fields below cannot be reached, and removing the height limit by script broke the panel until a reload. Put the "is set" condition on one of the component's own props (a short list) instead.
- The Webflow Bridge app's `open_canvas` can drive another Designer window than the Chrome tab you work in: navigate the tab yourself and check the URL.
- Lumos **Classes props** are chips: set the native input's value through its value setter, fire `input`/`change`, Enter. Prop and folder order: HTML5 drag events ([cards/props.md](../skills/cards/props.md), Designer-only).
- Cut/paste (⌘X/⌘V) does not work in a background tab, and motion does not play there (§10): test motion headless.
- Linking an existing prop to an element inside a definition: edit the component › select the element › the setting's connect button › the existing prop.
- **A Chrome window behind the user's other windows** (Forest3, 23 Oct 2026): the tab reports `document.visibilityState === "hidden"` and Chrome throttles timers and frames. The Rich Text Editor modal fades in and out for minutes and its backdrop blocks clicks, `setTimeout` waits in a script run into the 45 s CDP limit, typed keys land late or out of order (spaces dropped or doubled, Enter ignored), and a keystroke that reaches the canvas fires a Designer shortcut (a breakpoint switch). The Designer may also stay on its loading bar through reloads: then the user brings the window to the front. What worked for every prop text:
  1. Select the element with a real click on the canvas or in the Navigator. A component canvas opens through Components › hover the row › "Open component" (a plain click on the row inserts an instance).
  2. Real click on **Edit Rich Text**, then 2–3 small screenshots (each forces a frame) until the editor is opaque.
  3. Script: `range.selectNodeContents(editor.children[i])`, then **wait outside the page** (a wait plus a screenshot, not a `setTimeout`), then `document.execCommand('insertText', false, text)`. One block per step: the editor only commits edits inside a block, and drops cross-block deletes, multi-paragraph inserts and synthetic pastes. Keep the block count; text that needs a new paragraph goes through the API ([componentize/mechanics.md](../skills/componentize/mechanics.md), unlink route).
  4. Close with the modal's `button[aria-label="Close"]`, then screenshots until `elementFromPoint` is the canvas iframe again. Never hide the leftover backdrop with CSS: Webflow reuses that node for the next editor, which then opens invisible and reverts edits.
  5. Plain text props (Tag text, Button text, link URL, email, phone): the panel input's native value setter, `input` + `change` events, blur.
- **Never the system clipboard** for text: it is shared with the user's other apps and sessions (a clipboard hook in another app pasted `<!--START Clay -->` into a heading). A scripted `ClipboardEvent` carrying its own data is fine.
