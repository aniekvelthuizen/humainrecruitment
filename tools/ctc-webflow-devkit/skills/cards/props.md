# Card props: folders, recipe, Designer steps

The rules (folder order, `<Thing> Visibility` toggles, slots instead of `Tag 1/2/3`, "is set" conditions) are in [componentize](../componentize/SKILL.md) §1 (owner rules, Oct 2026). This file is how they land on a card.

## The card's folders

**Variant** → **Content** → **Visual** → part folders (Meta, Badge, Button, Stat, Number …) → **Link** (Link, Screen Reader Text, Link Attributes) → **Settings** (the Lumos props: Visibility, Role, Theme, Heading Tag, Wrapper Classes, Wrapper Style — as they are, last).

Write the table per card in the plan before building:

| Card | Content | Visual | Part folders | Link |
|---|---|---|---|---|
| Insight (example) | Title · Text · Text Visibility | Image · Image Alt · Image Visibility | **Meta**: Tags (slot) · Date · Date Visibility · Meta Visibility | Link · Screen Reader Text |

## API recipe

General prop traps (creation order, "<Name> 2" clashes, one `update_prop` per call, refused prop types): [mechanics.md](../componentize/mechanics.md) "Props". On a card:

- To reorder: create the props fresh in the right order with their final names, rebind each element, remove the old prop. Lumos Settings props and the variant prop stay.
- Card Primary duplicates' hidden attributes prop `Name` is the Clickable's attributes: rename it to `Link Attributes` in the Link folder in the Designer.
- **Keep `Link` and `Screen Reader Text`** as they are: the Clickable's conditional visibility depends on them; replacing them breaks it. Only move them into the Link folder.
- Re-set page-instance values for every replaced prop.
- Read back at the end: names, folders, order, defaults, every binding, variant styles, page instances.

## Designer-only

Queue these and do them in the one Designer pass ([designer/README.md](../../references/designer/README.md) "Queue, then one pass"). To reach a component: launch the Webflow MCP Bridge app in the Designer tab (the `?app=<id>` link the Designer tool's error gives), then `designer_tool open_canvas component_id` and `select_element`.

- **Folder order** follows each folder's oldest prop, and the Lumos Settings/Link props are the oldest. Folders are native HTML5 draggables (`[data-automation-id="draggable-content_<Folder>"]`): pointer/mouse drags do nothing, but a scripted `dragstart → dragenter → dragover ×n → drop → dragend` with one shared `DataTransfer` (in the page via `eval`, drop near the bottom edge of the target) moves them. Link after the last part folder, then Settings after Link.
- **Order inside a folder** does not move that way. Via the API instead: `update_prop` the prop into a temporary folder and back — it lands last in its folder (Image before Image Alt, Button Text before Button Visibility).
- Slot prop into its folder; the slot's **Allowed components** = the item component, unless the slot also takes CMS list components ([componentize](../componentize/SKILL.md), "Slot restrictions").
- Variant prop renamed `Variant`: Properties panel › click the prop › Property settings › Name › Enter. Read back with `get_component`.
- **Native conditional visibility** (what to set: componentize §1). Path: select the element › Settings › Visibility › the small menu button next to it › **Create conditional** › Select field › pick the prop (the list opens on its own after Create) › operator (`is set` is the default for text; a toggle defaults to `is Show`) › New condition for the second one › Escape. Trap: the first radio after "Visibility" is **Visible** — clicking it replaces a prop binding with a static value. Read the summary line back ("If all are true …").

## Slots for repeated items

- One small item component per item type (group `Card`), root = the existing item element with its classes, one `Text` prop (or `First` / `Second`). No Lumos base: it is a text item, not a card.
- Slot creation, naming and filling: [mechanics.md](../componentize/mechanics.md) "Slots". Card variant styles do not reach slot items: put the difference on the card-owned parent (font-size, a variable mode) and let the item inherit (`font-size: inherit` on the item's combo).
