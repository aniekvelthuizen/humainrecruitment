# Component mechanics

## Transform

- `transform_element_to_component` walks only the page tree (no `scope_component_id`), so nothing inside a component can be transformed afterwards ("Element not found", also with the component canvas open). Bottom-up, always. It takes `id` + `name`, and works when a CMS-list component instance sits inside.
- It bakes current content into the definition and renumbers every element inside. Transform an **empty** exemplar, then `get_all_elements` with `scope_component_id` to get the new ids.
- Refuses Tabs and anything holding a Collection List ("Target element is invalid"). A Code Embed cannot sit inside Tabs.
- A Collection List inside a definition cannot be set up by API (sort → "No source connected", binding → "not inside a CMS context") and then breaks the Designer ("Conflict … component map"). Route: build and bind the list on a page → **Create component** in the Designer → `insert_in_slot` where it goes.
- `page_main` is a slot that accepts only components: build a section **after** it (parent `page_wrap`), transform, then `move_element` the instance into `page_main` with `append`.
- **Changing a finished definition whose parts sit in slots**: the API cannot address slot children inside a definition (no element ids; `query_elements` with `scope_component_id` or `scope_element_id` finds nothing inside slots). Route: unlink an instance on a page (in `page_wrap`; an instance in a page slot refuses to unlink) → edit the plain elements → transform again → replace the instances → unregister the old definition. Back into `page_main` an instance can only be appended, so re-append every section that followed it, in order, and read the order back. The same route writes texts with paragraph breaks into a closed component whose items sit in slots (Oct 2026): the Designer's Rich Text editor drops Enter and multi-paragraph inserts, the API's rich text takes real paragraphs. Alternative for a small part: `create_blank_component` and rebuild its tree with the same classes (`set_style` gives the empty root its class).

## Props

- Can carry: text, rich text, visibility (boolean), image, alt, link, tag, DOM id, and one `Variant`. Cannot carry: class, combo, attributes (`role`, `aria-*`, `data-*`), CSS, Lumos `data-state`/`data-trigger`.
- Check bindability before `create_prop`: `get_bindable_sources`, then `get_settings` with `type: "query_settings"`. Paragraph binds `textContent`, Rich Text binds `richText`. Setting keys are `text` (not `textContent`) and `link` (not `href`). A `Strong` or `Span` element (every `<span>` from `data_whtml_builder` becomes one) refuses `text` ("Setting "text" is not applicable"); use a DOM element with that tag (`set_dom_config`) and set the binding in the same build call. An element with a text binding accepts no children.
- Prop type is immutable after creation. Boolean `true_label`/`false_label` do not come back from `get_component`; set them at creation.
- Default = the most common value, often empty. An `image` prop without a default renders empty; set it with `update_prop` and an asset id. `update_prop` on a default reaches every instance with `hasOverride: false`.
- Nested defaults leak through empty bound sources; pass a boolean down with `type: "bindable"`, `binding_source_type: "prop"`.
- A slot prop cannot be renamed with `update_prop`; use `set_display_name`. Variant props cannot be created, renamed or regrouped by API either (Designer).
- **Prop order = creation order**, and a folder's position follows its oldest prop. Reorder by creating fresh props in the right order, rebinding, removing the old ones; folder order itself is a Designer drag.
- **Prop names are unique per folder**: a clash silently names the new one "<Name> 2". Duplicates of Lumos components carry hidden clash names (`Text`, and an attributes prop `Name` the API does not list). Remove the old prop first, then create with the final name. Replacing a prop drops page-instance overrides (they go with the old id): re-set them.
- **One `update_prop` per call**, read back after each: batched renames land on the neighbouring prop, and one error (e.g. a variant prop in the batch) fails the whole batch. After variant changes even single renames can land on the wrong prop — so variants first, props after, all names read back at the end.
- `update_prop` refuses variant and slot props ("not an updatable prop type").
- A rich-text prop that passes through a nested instance cannot be reached by `data_element_builder` with `prop` ("Text prop not found"); `rich_text_inner_text` always writes `<p>`, so heading levels in rich-text props reached that way are a Designer step (Edit Rich Text › H1–H6). On a page instance's own rich-text prop the API can do it ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §4 "Rich text").
- An instance has no Visibility setting (Designer; the API answers "Element does not support setVisibility"): to hide it by a prop or CMS field, wrap it in a div and bind the div's visibility.
- A CMS plain-text field binds only to plain-text props (not to a Typography Heading/Paragraph rich-text prop; use Typography Heading (Plain Text), [cards/typography.md](../cards/typography.md)). A CMS Image field silently drops a bare asset id: write `{fileId, url}`.
- Lumos components with a conditional root (`Visual Video`: "URL is set") render nothing while that prop is empty — a duplicate with an empty URL is invisible on the canvas.
- Instance variant from the API: `set_component_instance_prop_values`, `type: "string"`, the variant id (`scope_component_id` inside a definition).

## Slots

- Exist only inside a definition, carry `u-display-contents`, take component instances only. Proven by API: the class given in the `data_element_builder` call that creates the slot (below). Not proven by API: a class added to an existing slot, e.g. when it must place its items itself as a grid area; do that in the Designer. An "open" component therefore always comes with an item component.
- Fill with `data_component_builder` `insert_in_slot` + `slot_name` (+ `return_component_info: true` for the id). `move_element` and `insert_component_instance` both refuse a slot. Slots are append-only: no before/after, no reorder.
- The API can never move existing elements into a slot. Rebuild inside it, or cut and paste in the Designer ([designer/README.md](${CLAUDE_PLUGIN_ROOT}/references/designer/README.md) "Manual routes"): bindings survive, ids change.
- A variant on the parent does not reach slot content. A rich-text prop through a nested instance loses paragraphs; that is a slot.
- Create one with `data_element_builder` `type: "ComponentSlot"` + `scope_component_id`; give it `u-display-contents` in that same call (a slot renders its own wrapper div that breaks the parent's flex/grid; plus `data-display="contents"` on a site that installs a library, [library-sites.md](${CLAUDE_PLUGIN_ROOT}/references/library-sites.md)) and `set_display_name` = the items' name.
- **No default slot content**: Webflow cannot hold elements in a definition's slot (moving into it = internal error); new instances start empty. Allowed components is a Designer setting.
- **Slot names in `data_component_builder` differ from the prop names `get_component` shows**: Lumos Section "Container Slot" → `Container`, Layout "Slot" / "Slot 2" → `Column 1` / `Column 2`, Grid and Button Wrapper "Slot" → `Content`. A wrong name fails the nested build but **leaves the partial tree** (empty instances) on the page: remove it before retrying.
- Inside a definition `insert_in_slot` works into a slot of a **directly addressable** instance (a Section at the root), but the instance it creates is then not addressable (props: "not found"). Nothing inside the slots of a nested Lumos Section is (MCP 2.2 `ComponentSlot` → "Parent element not found"): link those props and make those slots in the Designer.
- `move_element` cannot move an instance into another instance's slot: rebuild it there with `insert_in_slot`. Inside slots, use a page-wide `query_elements` `component_filter` to find ids.

## Variants

- `create_variant` + `set_variant_styles` auto-creates the `Variant` prop. `set_variant_name` needs `component_id`; `set_variant_styles` rejects it (pass `variant_id`, `style_name`, properties only).
- The override target combo must be unique site-wide.
- **Nested instance props are not per variant** (one value for all variants), and variant styles do not reach classes inside a nested component or slot items. A nested part that differs per variant: two owned wrappers with one instance each, bound to the same prop, the variant swapping their `display`. A slot item that differs per variant: put the difference on the owned parent and let the item inherit. The same goes for classes that come in through a nested Lumos component's Classes / Container Classes prop (Section, Layout, Typography): they never get the `w-variant-…` class, so variant styles on them are dead CSS. Check the published HTML for `w-variant-…` on the target first; if it is missing, add a string prop bound to that Classes prop and style a combo (`intro_media_contain.is-mid-page`), as the cards' Wrapper Classes do.
- `delete_variant` can answer "MPS returned 410: Gone" once: repeat, then read the variants back. Delete/create variants before touching props (variant changes can swap prop names).
- Variant styles are emitted as `.class:where(.w-variant-<id>)`, the same specificity as the base class: a base rule at a smaller breakpoint wins over the variant's desktop value there. Repeat the variant value at each breakpoint where the base sets that property.
- Reusing a Lumos original's variants (rename instead of delete keeps instances on a sensible variant): clear every old override per class first (`get_variant_styles` per class × variant); leftovers such as Cover's `margin-top: auto` on the text resurface later.
- A Text Style per variant is a variable mode on the combo (`set_style_variable_mode` + `variant_id`); `get_variant_styles` cannot read combos.
- Responsive lives in classes, never in a variant. A page `<style>` embed never goes inside a component.

## CMS-fed instances

Instance inside a curated Collection List (one item; wrapper, list and item on `u-display-contents`; curated lists refuse limit/sort/filter). Bind props to fields; a literal on the prop wins over the binding. Reference fields bind as `<refId>:::<subId>`. Verify on the published page: `get_component_instance_props` leaves CMS-bound props out. Image size is fixed on the class, not the field.

**CMS-bound cards in a section component** (a Lumos Section build-up on a CMS template): inside a definition nothing nested in a Lumos slot is addressable (`insert_in_slot` into a nested Block, `remove_element`, `get_component_instance_props`: "not found"), and `transform_element_to_component` drops the CMS bindings of nested instances without creating props. Route: a `ComponentSlot` in a plain div at the component **root**, outside the Lumos Section; the card instances go into that slot on the page and are bound there. Content nested in the definition: build it on the page first, set every prop, then transform.

## Order of operations, per component

1. Content of the exemplar → `references/plans/<plan>-<component>-content.md` (a script, not by hand)
2. Empty the exemplar
3. Transform; `get_all_elements` scoped; map old → new ids
4. Props, slots, variants; defaults set
5. New instance next to the original (parent + `append`, never the instance as anchor); fill from the content file
6. Snapshot both; compare
7. Remove the original after the user's OK

## CMS list components (the list in the section's slot)

Proven Nov 2026 (eight components: four collections, each automatic and picked, on a dozen pages). Designer + API; the Designer steps run with the `recipes.js` helpers.

1. **Start from a working list in a slot** (page or template) whose cards are right: bindings, tags with conditions, link. Select the Collection List wrapper (canvas: select a card, then the Navigator row; lists with `display: contents` cannot be hit on the canvas) › **⌘⌥G** (Wrap in › Box) › right-click the new Div › **Create component**. Description: at most 255 characters, or Create silently fails. Group: set it afterwards with `set_component_metadata` (the dialog's group field did not stick).
2. Root Div, list wrapper, list and item (and any extra wrapper div around a card): `u-display-contents` via `set_style` **and** `data-display="contents"` via `set_attributes`, both with `scope_component_id` (= element id), so the cards stay direct grid items of the section. The attribute is what holds: with a shared library every Accept strips the class from site-local elements, and the library's CSS-only global embed keeps `[data-display="contents"]` on `display: contents` live and in the canvas ([library-sites.md](../../references/library-sites.md)). No restore list.
3. In the component: list wrapper › **Settings** tab (Style is the default) › binding dots **Filter, Sort, Limit, Offset** › New … property (props of type Filter, Sort, Number, Number). Card: select the card instance › the binding dot next to **Variant** (`binding-button_` with an empty label) › New Variant property. A second card in the same list: same dot › pick the existing prop.
4. The new props take the source list's settings as defaults (filters, sort, limit 100 …). Set general number defaults with `update_prop` (`default_number`), then re-pin the source instance's own values (`set_component_instance_prop_values`, type number): changing a default moves every instance that has no override. Variant props are not updatable through the API.
5. **Picked version:** `duplicate_component` › `set_settings` `queryMode` = `curated` on the list (`scope_component_id`) › `remove_prop` the Filter/Sort/Show/Skip props › in the Designer: Settings › binding dot **Curated** (Select items) › New Select items property ("Items"). Check the duplicate's root class: a duplicate made before step 2 lacks it.
6. **Placing:** `insert_in_slot` with the list component's name into the section's slot (works through the API, unlike a Collection List itself), then remove the old list. Number and variant props can be set through the API (`number_value`, variant id as `string_value`); Filter, Sort and Items only in the Designer.
7. **Per instance in the Designer:** a new instance inherits the default filters; remove them first (hover a filter row › the `Remove` × appears), then Add filter › field › value (reference: Toggle options › item; option: value dropdown; switch: "Is on/Is off" without a value). Sort: click the sort row › field and order. Picked: Items › + › tick in order (drafts show "[Changes in draft]").
8. **Slot restrictions:** open the section on the library site › its slot › Settings › Allowed components. A list that names only the card blocks the marketer (Webflow applies restrictions to the Marketer role only; `insert_in_slot` and Designers bypass them). Library + site-local lists: Choose components › **Allow all** › Save, then publish, Share updates and Accept on the site. Without a library: add the list components to the allowed list.
9. Verify as a marketer (`&simulateRole=marketer`, slot selected, Components panel shows the CMS list group) and live: card count, links, desktop grid and the slider/scroll row on mobile, no horizontal page scroll.

## Selected items prop (a CMS list editors pick per page)

Designer only; the API cannot bind `curatedItemIds` (`canBind: false`), cannot create a `selectedItems` prop and cannot set its value on an instance. Proven Nov 2026.

1. Build and bind the list on a page first (Collection List with the item component, bindings, `u-display-contents` plus `data-display="contents"` on wrapper, list and item where the list sits in a slot).
2. Make the component in the Designer. `transform_element_to_component` refuses anything holding a Collection List, and an **instance** (library or local) has no Create component: right-click › **Wrap in › Box**, then **Create component** on that Div. The dialog offers "Create N properties" for the inner instance's props: keep it on.
3. In the component, select the Collection List wrapper › Settings › **Items: Selected** (confirm "Remove settings": filters and sort go) › purple dot at **Select items** › **New Select items property**. Name and tooltip in that form; rename later in the Properties panel (`update_prop` refuses this prop type), and `moveProp` it into Content.
4. On each page: select the instance › FAQ items **+** › tick items (`[role=option]`, `aria-selected`) › Esc. Read back with `get_component_instance_props`: the value is the array of item ids in ticking order.
5. On a CMS template the prop has no binding dot: keep a list whose source is the item's multi-reference field there. For "records of this item" use the `· automatic` component with a current-item filter instead (next section, step 2).

## Filter, Sort and Show props (a Dynamic CMS list per page)

Proven Nov 2026, first on a component that wrapped the whole Content List, then on the list components above (the pattern to use).

1. In the component, select the Collection List wrapper, leave **Items: Dynamic**. Filters, Sort, Show (limit) and Skip (offset) each have a binding dot › **New … property** gives props of type Filter, Sort and Number. Rename them and move them into Content (`moveProp`).
2. Per instance: + › field › Equals › value. Works on reference fields (a dropdown of items) and option fields. Sort on any field; Show is a number. **On a CMS template** the value list also offers **Current <Item>** (picked by default): "Foundation = Current Foundation", and on a multi-reference field "Themes contains Current Theme". To replace a loose list: select the section's slot, add the list component (Components panel with the slot selected; with the old wrapper selected Webflow tries to drop it inside the wrapper and refuses), copy filter, sort (click a sort row to change its field and order), Show, Skip and Card, compare titles and card variant classes of old and new in the canvas, then delete the old wrapper.
3. Stored values, readable with `get_component_instance_props`: Filter `{filters:[{fieldSlug:"theme",operator:"equals",value:"<item id>"}],filterMatch:"all"}`, Sort `[{fieldSlug:"name",direction:"ascending"}]`. The API cannot create these prop types or set their values: Designer only. A current-item filter reads back as `{filters:[],filterMatch:"all"}` (with `hasOverride: true`) although it is set: check it in the Designer or live (two items must show different records), never through the API.
4. Items Dynamic/Selected itself has no binding dot, so one list is either picked or filtered.
