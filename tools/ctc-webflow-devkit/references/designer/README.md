# The Designer — working in it, and the recipes

What the API refuses is done in the Designer by the agent, not handed to the user. This page is the kit's home for Designer handling: which Chrome, the queue, reloads, background windows, the recipes and the manual routes.

## Which Chrome

**Default: one Chrome profile per client.** A Webflow login holds one workspace, and the user's normal Chrome is logged into whichever client they last worked on; a login switch for another client drops the Designer mid-task (Oct 2026: it went 404 halfway through a unit). So each client repo gets its own Chrome:

- `references/scripts/designer-chrome.sh` from the project skill's template: Chrome with its own profile (`~/.chrome-projecten/<client>`), its own debug port (one per client: 9340, 9341, …) and window name "<client> Webflow". It does nothing when that Chrome already runs.
- `.mcp.json` in the client repo: a server `chrome-<client>` = `npx -y chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:<port>`. For this client's Designer use only that server, never the user-scope `chrome-devtools` (the user's normal Chrome, logged into other clients). Name the server and port in the client's `CLAUDE.md` and `decisions/site.md`.
- The user logs in once in that window with the client's Webflow account; the login stays in the profile. Logged out: ask them to log in there again, once. (A separate profile is also why this works at all: Chrome refuses remote debugging on the default profile.)
- The server loads only in a new session started in the repo. In a running session, Playwright `chromium.connectOverCDP('http://127.0.0.1:<port>')` drives the same Chrome.
- Never close its last tab: without a window, `connectOverCDP` fails ("Browser context management is not supported"). Restore one with `curl -X PUT "http://127.0.0.1:<port>/json/new?about:blank"`.

**Fallback, before a client has its own profile:** Claude in Chrome (the extension), or `chrome-devtools-mcp --autoConnect` (user-scope), which attaches to the user's running Chrome so the Designer opens as a tab in their normal window with their own Webflow login. Check first that this Chrome is logged into this client's workspace. Once per machine: remote debugging on at `chrome://inspect/#remote-debugging`; Chrome may ask to allow the connection. On macOS the host app needs Full Disk Access, otherwise it reports "Could not find DevToolsActivePort" although the file exists. `--browserUrl` is no way round it there (that switch serves no `/json/version`); it is for the client's own profile above.

Work in a **new background tab** (`new_page` with `background: true`) on `https://<site>.design.webflow.com/`; never touch the user's other tabs (they show in `list_pages`, often other clients). The Webflow Bridge app's `open_canvas` can drive another Designer window than the tab you work in: navigate the tab yourself and check the URL.

**One Designer, several sessions:** all Claude sessions on a site share the one Designer tab. Data API work can run in parallel; Designer UI clicks and `designer_tool` page/canvas switches only when no other session is using it (check `ListAgents`, or message the busy one). Measure by reading the canvas iframe, not by clicking ([verify.md](../verify.md) §2b).

## Queue, then one pass

The Designer is the slowest surface: every step costs a load, snapshots and clicks, and all sessions share one tab (Oct 2026: 263 snapshots and 272 clicks for a few dozen steps). So a Designer-only step is not done the moment it comes up:

1. **Queue it.** Do the API part, append the step to `references/designer-queue.md` in the client repo and carry on with the next unit. Work that depends on the step (measuring a binding, reviewing a heading level) goes into the same entry as `then:`, not into a separate Designer trip.
2. **One pass per task**: at hand-over ([build](../../skills/build/SKILL.md) §6, [review](../../skills/review/SKILL.md) §6) or when the user asks. Check `ListAgents`; if another session holds the Designer, message it and wait for its "Designer free". Claim it: message the other sessions on the site ("Designer: <n> queue items, until I say free") and mark the items `doing (<session name>)`.
3. **Load once, after all API writes** (see Reload). Group the items by page and component and open each component once.
4. **Per item**: the recipe below when there is one (one `evaluate_script` per item, no snapshot rounds), otherwise by hand (Manual routes). Read back through the API or on staging, then tick the item with the date, the minutes it took and what was read back (the minutes show whether recipes pay off). A recipe that fails twice: do the item by hand and fix or flag the recipe (the Designer's markup changed).
5. **Release and publish once**: message "Designer free", then publish once after the pass (where publishing is allowed), not per item. A temporary element made only to reach a style (a rich text for a nested list style) is deleted in the same step, and nothing is published until the pass is over.

Items the agent cannot do (login expired, a paid add-on, a destructive step the user has not OK'd) stay open and go into the hand-over as literal steps with the reason.

`references/designer-queue.md` (the project skill scaffolds it):

```
# Designer queue

## Open
- [ ] <page or component> › <element> — <what, with the exact value> — API: <the refusal> — recipe: <name or "by hand"> — then: <check that waits on it> — <session>, <date>

## Done
- [x] … — <date>, <minutes> min in the Designer, read back: <how>
```

## Reload

The open canvas does not follow API writes; reload the Designer tab, then install the recipes again:

- Elements, classes and **prop changes** written through the API show only after a reload: do all API writes first, reload once, then the pass.
- Style and variant writes (`set_variant_styles`): the canvas keeps showing the old computed values until reloaded, although the read-back is correct. Reload before measuring the canvas.
- An asset uploaded after the tab loaded shows as a grey placeholder until reloaded. Not a bug.
- The canvas hides **draft** CMS items in lists and can show stale CMS data after API writes until reloaded. Check lists on staging.
- After a scripted drag or after closing the rich-text editor, the rich-text editor and the Allowed-components picker stop opening until a reload (Oct 2026). A scripted click on a link on the canvas navigates the canvas (404): reload.

## Background tab and a window behind others

- A **background** tab never plays IX3 or GSAP (requestAnimationFrame is paused), CSS transitions stall (computed colours read the old value until transitions are disabled), `video.play()` can hang, and cut/paste (⌘X/⌘V) does not work. Test motion and behaviour in headless Chrome.
- **A Chrome window behind the user's other windows** (Oct 2026): the tab reports `document.visibilityState === "hidden"` and Chrome throttles timers and frames. The Rich Text Editor modal fades in and out for minutes and its backdrop blocks clicks, `setTimeout` waits in a script run into the 45 s CDP limit (the recipes' short `sleep()` too), typed keys land late or out of order (spaces dropped or doubled, Enter ignored), and a keystroke that reaches the canvas fires a Designer shortcut (a breakpoint switch). The Designer may also stay on its loading bar through reloads: then the user brings the window to the front. Bring it to the front before running recipes; where it stays behind, this worked for every prop text:
  1. Select the element with a real click on the canvas or in the Navigator. A component canvas opens through Components › hover the row › "Open component" (a plain click on the row inserts an instance).
  2. Real click on **Edit Rich Text**, then 2–3 small screenshots (each forces a frame) until the editor is opaque.
  3. Script: `range.selectNodeContents(editor.children[i])`, then **wait outside the page** (a wait plus a screenshot, not a `setTimeout`), then `document.execCommand('insertText', false, text)`. One block per step: the editor only commits edits inside a block, and drops cross-block deletes, multi-paragraph inserts and synthetic pastes. Keep the block count; text that needs a new paragraph goes through the API ([componentize/mechanics.md](../../skills/componentize/mechanics.md), unlink route).
  4. Close with the modal's `button[aria-label="Close"]`, then screenshots until `elementFromPoint` is the canvas iframe again. Never hide the leftover backdrop with CSS: Webflow reuses that node for the next editor, which then opens invisible and reverts edits.
  5. Plain text props (Tag text, Button text, link URL, email, phone): the panel input's native value setter, `input` + `change` events, blur.

## Recipes (`recipes.js`)

One `evaluate_script` per Designer step instead of snapshot → click → snapshot rounds; a step through a loaded helper took one call (six bindings in one call, four headings in one call).

1. Open the Designer tab, wait for it, `exitPanZoom()` if needed.
2. Install: copy [recipes.js](recipes.js) to `.tmp/recipes.js` in the client repo (gitignored; `sourcePath` only reads inside the MCP's workspace root, the plugin folder is refused) and run `evaluate_script` with `sourcePath` = that file — or pass the file's text as `function`. It sets `window.wfd` and returns the helper list. Install again after every reload or navigation (opening a component through the Components panel navigates).
3. Per queue item, one call, ending with a read-back:
   ```js
   async () => { await wfd.select('.cta-banner_title'); await wfd.editComponent(); await wfd.select('.cta-banner_title');
                 return [await wfd.bindProp('Text', 'Title'), wfd.state()]; }
   ```
4. Read the result back through the API (`get_component`, `get_settings`) or on staging, and tick the queue item.

A result like `nodot:…`, `noprop:…`, `zero-size…` means the step did not happen: take one snapshot to see why, never retry blind. Fails twice: do it by hand and fix the helper.

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

Test run 16 Oct 2026 (`wfd` 1.1.0): install, `ready`, `state`, `panel`, `select` into a Layout slot of a definition, `editComponent`/`exitAll`, `navSelect` with expansion, `dots`, `setClasses` and `setTag` (same values, read back on the canvas, 2 s for both) worked; `bindProp` bound five props in one call. Fixed after the run (1.2.0: `select` on elements taller than the canvas aligns their start; `moveProp` added): the breadcrumb read the empty edit-mode node, `panel` toggled an open Navigator shut. The routes behind the helpers were first done by hand in Oct 2026 (bindings, "is set", rich text, Classes chips, folders, site code); variables only through an older browser route.

Traps the helpers avoid:

- Keys typed while the canvas has focus fire Designer shortcuts (C = comment mode); `type_text` appends to a field's old value. Helpers set values with the native setter.
- A click on a Components or Add Elements row inserts an instance (at the bottom of the Body, not at the selection): `undo()` or remove the stray.
- Hard-coded panel x positions break between window widths; helpers use `innerWidth - 350`.
- `elementFromPoint` can hit the fixed nav, a Clickable link or a `display: contents` wrapper; `select` returns what it hit.

## Slots and their props

A `ComponentSlot` made by API gets a prop named "Slot" without a folder. The name editors see is the slot's display name: `set_display_name` on the slot element renames it (the API keeps reporting "Slot"). `update_prop` refuses slot props ("not an updatable prop type"), so the folder is a Designer step: `moveProp('<SlotName>', '<last prop of the folder>')` on the component canvas, then read back `group` through `get_component`.

**Variant props of nested instances** (a button's style or icon, exposed on the parent) land in automatic folders named after the instance path (`Button Main 2/Icon`), and `update_prop` refuses them the same way. Put everything of one button in one folder: text, link and boolean props with `update_prop` (`group`, `name`), the variant props with `moveProp` onto the folder's last prop (duplicate names across folders: address the rows by index). Rename: click the prop row, `setInput` on Name in Property settings, then `blur()` — no Enter. Read back through `get_component` (Nov 2026).

## Manual routes

- **Variable values** (the `clamp()` formulas the API refuses): open the panel by script on the button with `aria-label="Variables (V)"`, open collection and group, click the value cell **twice** (the first selects, the second opens an input with its own uid), `fill` that input, Enter, read back through the API. Not select-all + type (typed a literal `a`). uids shift with every snapshot.
- **Selecting on the canvas**: in `evaluate_script`, find the element in the canvas iframe, `scrollIntoView`, then dispatch `pointerdown/mousedown/pointerup/mouseup/click` on `elementFromPoint`. An element without size (empty nested list, hidden block) is selected in the Navigator: click the `navigator-expand-collapse-caret-button` at the label's y, then the label; give a hidden block no class for a moment to find it.
- **Typing**: `type_text` only after clicking into the field and checking it has focus; keys typed while focus is on the canvas (or before a picker opens) fire Designer shortcuts (Add panel, guides, C = Comment mode, a breakpoint switch).
- **Styles panel**: the style selector's dropdown options ignore mouse clicks — use Down/Up + Enter. Change no property before the selector is picked, or Webflow creates a class on the selected text instead. A nested tag selector ("All Italics" / "All Paragraphs" inside a class) only offers "Nest selector inside of" when the parent is a **Rich Text** element, not a div: add a temporary Rich Text with the class, set the selector, remove it. Rich-text **prop defaults** are edited in the Properties panel (K) › the prop › Edit Rich Text, not on the canvas.
- The canvas may sit in **pan & zoom** (four breakpoints side by side, every element four times): "Exit pan & zoom canvas" first.
- **Dragging into an empty slot of a nested instance** fails in the Navigator ("Elements can't be dragged into component instances outside of slots"); release the drag in the canvas iframe instead (pointer/mouse events in the iframe document). For the last slot row in the Navigator, move the cursor further right. An empty Layout is `w-condition-invisible` on the canvas. Props inside a folder drag the same way folders do.
- **Cut and paste works in a foreground Claude in Chrome tab** (`computer` key `cmd+x`, select the target, `cmd+v`; paste lands after the selected sibling, or inside a selected empty slot). It moves existing elements into slots — the route the API does not have — and keeps CMS bindings, prop bindings, conditions and classes; element ids change, so query them again. A Navigator drag often does not register there, and through CDP (`chrome-devtools-mcp`) ⌘V and a synthetic paste are ignored. A CMS list for a slot: build it in `page_wrap` after `page_main`, then cut and paste it in.
- **Condition field picker:** it only lists as many fields as fit the window height (about 50); fields below cannot be reached, and removing the height limit by script broke the panel until a reload. Put the "is set" condition on one of the component's own props (a short list) instead.
- Lumos **Classes props** are chips: set the native input's value through its value setter, fire `input`/`change`, Enter (`setClasses`). Prop and folder order: HTML5 drag events ([cards/props.md](../../skills/cards/props.md)).
- Linking an existing prop to an element inside a definition: edit the component › select the element › the setting's connect button › the existing prop.
- **Never the system clipboard** for text: it is shared with the user's other apps and sessions (a clipboard hook in another app pasted its own markup into a heading). A scripted `ClipboardEvent` carrying its own data is fine.

No recipe yet (write one the second time it comes up): slot element + Allowed components, CMS list source on a multi-reference field, current-item link, a Collection List filter on the current item (real clicks: Filters + › field › Industries; Webflow fills Contains / Current Industry), conditional attributes (≈100 calls on one site), Create component on a CMS list.
