# Card props: folders, order, toggles, slots, conditions

Owner rules (Forest3, 2026-10-08), for cards first and every component after:

1. Every prop sits in a relevant folder (prop `group`).
2. Folders in a logical order; props inside in the order an editor fills them in.
3. A folder never mixes kinds (content and visual are separate folders).
4. Every element an editor may want to hide gets a `<Thing> Visibility` toggle, in the folder of the thing, right after it.
5. Repeated data with the same style (tags, topics, expertise lines, meta items) becomes a **slot** holding small item components.
6. Every text shows only when filled (native condition `<Text> is set`).

## Folder order

**Variant** (automatic, top) → **Content** → **Visual** → part folders, named after the part (Meta, Badge, Button, Stat, Number …) → **Link** (Link, Screen Reader Text, Link Attributes) → **Settings** (the Lumos props: Visibility, Role, Theme, Heading Tag, Wrapper Classes, Wrapper Style — keep as they are, last).

Write the table per card in the plan before building:

| Card | Content | Visual | Part folders | Link |
|---|---|---|---|---|
| Insight (example) | Title · Text · Text Visibility | Image · Image Alt · Image Visibility | **Meta**: Tags (slot) · Date · Date Visibility · Meta Visibility | Link · Screen Reader Text |

Keep every existing default value.

## API recipe

- **Prop order = creation order.** To reorder: create the props fresh in the right order with their final names, rebind each element, then remove the old prop. Lumos Settings props and the variant prop stay.
- **Names are unique per folder.** A clash renames the new prop "<Name> 2". Card Primary duplicates carry hidden clash names (`Text`, and an attributes prop `Name` that the API does not list — it is the Clickable's attributes): remove the old prop first, then create with the final name. Rename it to `Link Attributes` in the Link folder in the Designer.
- **One `update_prop` per call**, then read back: batched renames land on the neighbouring prop, and after variant changes even single renames can hit the wrong prop.
- `update_prop` refuses variant props and slot props ("not an updatable prop type"). Slot: `set_display_name` on the slot element renames it.
- **Keep `Link` and `Screen Reader Text`** as they are: the Clickable's conditional visibility depends on them; replacing them breaks it. Only move them into the Link folder.
- Re-set page-instance values for every prop that was replaced (overrides go with the old id).
- Read back at the end: names, folders, order, defaults, every binding, variant styles, page instances.

## Designer-only (do them yourself in the browser that holds the Designer login — Claude in Chrome or `chrome-devtools` autoConnect, [webflow-mcp.md](../../references/webflow-mcp.md) §11 — one session at a time)

Queue these while building and do them in one pass ([webflow-mcp.md](../../references/webflow-mcp.md) §11 "Queue, then one pass"): check first that no other session is working in the Designer (`ListAgents`, ask it). Use one Designer tab. To reach a component: launch the Webflow MCP Bridge app in that tab (`?app=<id>` link the Designer tool's error gives), then `designer_tool open_canvas component_id` and `select_element`.

- **Folder order** follows each folder's oldest prop, and the Lumos Settings/Link props are the oldest. Folders are native HTML5 draggables (`[data-automation-id="draggable-content_<Folder>"]`): pointer/mouse drags do nothing, but a scripted `dragstart → dragenter → dragover ×n → drop → dragend` with one shared `DataTransfer` (in the page via `eval`, drop near the bottom edge of the target) moves them. Link after the last part folder, then Settings after Link.
- **Order inside a folder** does not move that way. Via the API instead: `update_prop` the prop into a temporary folder and back — it lands last in its folder (Image before Image Alt, Button Text before Button Visibility).
- Slot prop into its folder; the slot's **Allowed components** = the item component.
- Variant prop renamed `Variant`: Properties panel › click the prop › Property settings › Name › Enter. Read back with `get_component`.
- **Native conditional visibility** (the API cannot write conditions). Path: select the element › Settings › Visibility › the small menu button next to it › **Create conditional** › Select field › pick the prop (the list opens on its own after Create) › operator (`is set` is the default for text; a toggle defaults to `is Show`) › New condition for the second one › Escape. Trap: the first radio after "Visibility" is **Visible** — clicking it replaces a prop binding with a static value. Read the summary line back ("If all are true …"). What to set: every text `<Text> is set`; with a toggle `<Thing> Visibility = true AND <Text> is set`; a wrapper of optional parts (a visual row, a meta row) shows only when **any** of its parts is on, so no empty gap remains when all are off. Slot item texts too.

## Slots for repeated items

- One small item component per item type (group `Card`), root = the existing item element with its classes, one `Text` prop (or `First` / `Second`). No Lumos base needed: it is a text item, not a card.
- Create the slot with `data_element_builder` `type: "ComponentSlot"` and `scope_component_id`. Give it `u-display-contents` (a slot renders its own wrapper div that breaks the parent's flex/grid) and `set_display_name` = the items' name (that names the slot on instances).
- **Webflow has no default slot content**: new instances start with an empty slot. Fill page instances with `data_component_builder` `insert_in_slot`, `slot_name` = the slot's display name.
- Card variant styles do not reach slot items: put the per-variant difference on the card-owned parent (font-size, a variable mode) and let the item inherit (`font-size: inherit` on the item's combo).
