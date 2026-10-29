# Designer recipes

One `evaluate_script` per Designer step instead of snapshot → click → snapshot rounds. On PMS (Oct 2026) the Designer work cost 263 snapshots and 272 clicks; the steps that went through a loaded helper took one call each (six bindings in one call, four headings in one call). Used in the Designer pass of [webflow-mcp.md](../webflow-mcp.md) §11 "Queue, then one pass".

## Use

1. Open the Designer tab (§11), wait for it, `exitPanZoom()` if needed.
2. Install: copy [recipes.js](recipes.js) to `.tmp/recipes.js` in the client repo (gitignored; `sourcePath` only reads inside the MCP's workspace root, the plugin folder is refused) and run `evaluate_script` with `sourcePath` = that file — or pass the file's text as `function`. It sets `window.wfd` and returns the helper list. Install again after every reload or navigation (opening a component through the Components panel navigates).
3. Per queue item, one call, ending with a read-back:
   ```js
   async () => { await wfd.select('.cta-banner_title'); await wfd.editComponent(); await wfd.select('.cta-banner_title');
                 return [await wfd.bindProp('Text', 'Title'), wfd.state()]; }
   ```
4. Read the result back through the API (`get_component`, `get_settings`) or on staging, and tick the queue item.

A result like `nodot:…`, `noprop:…`, `zero-size…` means the step did not happen: take one snapshot to see why, never retry blind. Fails twice: do it by hand (§11 notes) and fix the helper.

## Helpers

| Helper | Does | Status |
|---|---|---|
| `ready()` | waits until the Designer and canvas are loaded (instead of a fixed 15 s) | tested |
| `state()` | breadcrumb, open page/component, `pageId`, pan & zoom | tested |
| `panel(name)` / `tab(name)` | left panels by aria-label (`Navigator`, `Components`, `Variables`, `Properties`, …; the buttons toggle, so Navigator/Components are checked first) / right tabs (`Style`, `Settings`; an instance shows `Properties`, `Interactions`) | tested |
| `select(css, {dbl})` | selects an element on the canvas by CSS selector; `dbl` drills into an instance | tested |
| `navSelect(label, nth)` / `navFind` | selects a Navigator row (zero-size elements, hidden blocks), expanding collapsed parents | tested |
| `navDrag(src, dst)` | pointer drag in steps from one Navigator row onto another (an element into a slot) | proven by hand, helper untested |
| `editComponent()` / `exitAll()` | into the selected instance's definition / back to the page | tested |
| `dots()` / `bindProp(setting, prop)` | lists the purple binding dots / binds a setting to an existing prop (same name as a field label: check the read-back) | tested (5 bindings in one call) |
| `visibleWhenSet(field)` | native "is set" condition on visibility | proven |
| `setClasses(value, label)` | Lumos Classes chips (whole string, replaces the set) | tested |
| `setTag(value, current)` | Tag field of the selected element | tested |
| `richTextHeading(level)` | H2–H6 in a rich-text prop of the selected instance | proven |
| `moveFolder(folder, after)` / `moveProp(prop, after)` / `html5drag(src, dst)` | prop folder order / a prop (also a slot prop) after another prop, into that prop's folder / any HTML5 drag | proven (folders); tested (props, slot props into Content, 16 Oct) |
| `setVariable(collection, group, name, value)` | variable value, e.g. a `clamp()` formula | untested |
| `siteCode(index, text)` | site Head/Footer code on the dashboard Custom code page | proven |
| `undo()`, `esc()` | undo a stray insert, close a menu | proven |

Test run 16 Oct 2026 (PMS, `wfd` 1.1.0): install, `ready`, `state`, `panel`, `select` into a Layout slot of a definition, `editComponent`/`exitAll`, `navSelect` with expansion, `dots`, `setClasses` and `setTag` (same values, read back on the canvas, 2 s for both) worked; `bindProp` bound five props in one call (pms-b6). Fixed after the run (1.2.0: `select` on elements taller than the canvas aligns their start; `moveProp` added): the breadcrumb read the empty edit-mode node, `panel` toggled an open Navigator shut.

Evidence (PMS transcripts, Oct 2026): bindings and "is set" ca08ae61 16 Oct 10:02–10:31; rich text 79cfb81d 16 Oct 11:17; Classes chips 15 Oct 09:09–09:26; folders a424a66a 14 Oct 08:43; site code 4d487aa4 16 Oct 09:07; variables only through the older Orca route (bb0f4e65, 668668e7).

## Slots and their props

A `ComponentSlot` made by API gets a prop named "Slot" without a folder. The name editors see is the slot's display name: `set_display_name` on the slot element renames it (the API keeps reporting "Slot"). `update_prop` refuses slot props ("not an updatable prop type"), so the folder is a Designer step: `moveProp('<SlotName>', '<last prop of the folder>')` on the component canvas, then read back `group` through `get_component`.

## Still by hand (no recipe yet)

Slot element + Allowed components, CMS list source on a multi-reference field, current-item link, a Collection List filter on the current item (real clicks: Filters + › field › Industries; Webflow fills Contains / Current Industry), conditional attributes (≈100 calls on PMS), Create component on a CMS list. Cut/paste does not work through CDP (⌘V and a synthetic paste are ignored), but it does in a foreground Claude in Chrome tab with real key presses ([webflow-mcp.md](../webflow-mcp.md) §11). Write a recipe the second time one comes up.

## Traps the helpers avoid

- Keys typed while the canvas has focus fire Designer shortcuts (C = comment mode); `type_text` appends to a field's old value. Helpers set values with the native setter.
- A click on a Components or Add Elements row inserts an instance.
- Hard-coded panel x positions break between window widths; helpers use `innerWidth - 350`.
- `elementFromPoint` can hit the fixed nav, a Clickable link or a `display: contents` wrapper; `select` returns what it hit.
- The canvas shows API changes only after a reload: do all API writes first, reload once, install, then the pass.
- A Designer window behind other windows is throttled: no `setTimeout` waits inside a helper, rich-text edits one block at a time — the routine is in [webflow-mcp.md](../webflow-mcp.md) §11 ("A Chrome window behind the user's other windows").
