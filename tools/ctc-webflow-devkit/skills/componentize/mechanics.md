# Component mechanics

## Transform

- `transform_element_to_component` walks only the page tree (no `scope_component_id`), so nothing inside a component can be transformed afterwards ("Element not found", also with the component canvas open). Bottom-up, always. It takes `id` + `name`, and works when a CMS-list component instance sits inside.
- It bakes current content into the definition and renumbers every element inside. Transform an **empty** exemplar, then `get_all_elements` with `scope_component_id` to get the new ids.
- Refuses Tabs and anything holding a Collection List ("Target element is invalid"). A Code Embed cannot sit inside Tabs.
- A Collection List inside a definition cannot be set up by API (sort → "No source connected", binding → "not inside a CMS context") and then breaks the Designer ("Conflict … component map"). Route: build and bind the list on a page → **Create component** in the Designer → `insert_in_slot` where it goes.
- `page_main` is a slot that accepts only components: build a section **after** it (parent `page_wrap`), transform, then `move_element` the instance into `page_main` with `append`.
- **Changing a finished definition whose parts sit in slots**: the API cannot address slot children inside a definition (no element ids; `query_elements` with `scope_component_id` or `scope_element_id` finds nothing inside slots). Route: unlink an instance on a page (in `page_wrap`; an instance in a page slot refuses to unlink) → edit the plain elements → transform again → replace the instances → unregister the old definition. Back into `page_main` an instance can only be appended, so re-append every section that followed it, in order, and read the order back. The same route is the way to write texts with paragraph breaks into a closed component whose items sit in slots (Forest3 Point Map, 23 Oct 2026): the Designer's Rich Text editor drops Enter and multi-paragraph inserts, the API's rich text takes real paragraphs. Alternative for a small part: `create_blank_component` and rebuild its tree with the same classes (`set_style` gives the empty root its class).

## Props

- Can carry: text, rich text, visibility (boolean), image, alt, link, tag, DOM id, and one `Variant`. Cannot carry: class, combo, attributes (`role`, `aria-*`, `data-*`), CSS, Lumos `data-state`/`data-trigger`.
- Check bindability before `create_prop`: `get_bindable_sources`, then `get_settings` with `type: "query_settings"`. Paragraph binds `textContent`, Rich Text binds `richText`. Setting keys are `text` (not `textContent`) and `link` (not `href`). A `Strong` element refuses `text`; use a DOM element with tag `strong`. An element with a text binding accepts no children.
- Prop type is immutable after creation. Boolean `true_label`/`false_label` do not come back from `get_component`; set them at creation.
- Default = the most common value, often empty. An `image` prop without a default renders empty; set it with `update_prop` and an asset id. `update_prop` on a default reaches every instance with `hasOverride: false`.
- Nested defaults leak through empty bound sources; pass a boolean down with `type: "bindable"`, `binding_source_type: "prop"`.
- A slot prop cannot be renamed with `update_prop`; use `set_display_name`. Variant props cannot be created, renamed or regrouped by API either (Designer).
- **Prop order = creation order**, and a folder's position follows its oldest prop. Reorder by creating fresh props in the right order, rebinding, removing the old ones; folder order itself is a Designer drag.
- **Prop names are unique per folder**: a clash silently names the new one "<Name> 2". Duplicates of Lumos components carry hidden clash names (an attributes prop `Name`, `Text`). Remove the old prop first, then create with the final name.
- **One `update_prop` per call**, read back after each. After variant changes, renames can land on the wrong prop — so variants first, props after, all names read back at the end.
- A rich-text prop that passes through a nested instance cannot be reached by `data_element_builder` with `prop` ("Text prop not found"); `rich_text_inner_text` always writes `<p>`, so heading levels in rich-text props reached that way are a Designer step (Edit Rich Text › H1–H6). On a page instance's own rich-text prop the API can do it ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §6).
- An instance has no Visibility setting in the Designer: to hide it by a prop or CMS field, wrap it in a div and bind the div's visibility.
- A CMS plain-text field binds only to plain-text props (not to a Typography Heading/Paragraph rich-text prop; use Typography Heading (Plain Text), [cards/typography.md](../cards/typography.md)). A CMS Image field silently drops a bare asset id: write `{fileId, url}`.
- Lumos components with a conditional root (`Visual Video`: "URL is set") render nothing while that prop is empty — a duplicate with an empty URL is invisible on the canvas.
- Instance variant from the API: `set_component_instance_prop_values`, `type: "string"`, the variant id (`scope_component_id` inside a definition).

## Slots

- Exist only inside a definition, carry `u-display-contents`, take component instances only. A slot can get a class in the Designer (not by API) when it must place its items itself, e.g. as a grid area. An "open" component therefore always comes with an item component.
- Fill with `data_component_builder` `insert_in_slot` + `slot_name` (+ `return_component_info: true` for the id). `move_element` and `insert_component_instance` both refuse a slot. Slots are append-only: no before/after, no reorder.
- The API can never move existing elements into a slot. Rebuild inside it, or cut and paste in the Designer ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11): bindings survive, ids change.
- A variant on the parent does not reach slot content. A rich-text prop through a nested instance loses paragraphs; that is a slot.
- Create one with `data_element_builder` `type: "ComponentSlot"` + `scope_component_id`; give it `u-display-contents` and `set_display_name` = the items' name.
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
