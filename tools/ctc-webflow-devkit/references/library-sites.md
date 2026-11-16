# Shared Libraries — the library site and the sites that install it

One site holds the components, classes and variables (the **library**, e.g. "Core"); brand sites **install** it and accept its updates. This page is the kit's single home for Shared Libraries: what Webflow allows, and the routine for the installing site. Learned Nov 2026, where breaking it put a live page's cards in one column twice and showed a hidden fallback block as loose text.

## What Webflow allows

- A Library needs a paid workspace plan. Updates are accepted per site, in the Designer (Help Center "Libraries", Oct 2026).
- Library components that contain a Collection list, a Locales list, a Map, reCAPTCHA or Users/Ecommerce elements are hidden from the library (background video and Search are allowed). A CMS list in a slot filled on the page does not block sharing, but has to be placed again on the other site. For a sister site that needs most of the CMS blocks, duplicate the site instead.
- Library classes get a prefix on the installing site: on the published site a library class reads `core--u-display-contents`, a local one has no prefix.
- **The Designer canvas skips an HtmlEmbed that contains a `<script>`** — also a script tag inside a comment. Its `<style>` then works live but not in the canvas (Nov 2026: CSS embeds without a script showed in the canvas, the one with a script did not). CSS the Designer needs (display fallbacks, layout fixes) goes in a CSS-only embed, scripts in an embed of their own.
- **Components in rich text from a library**: they work on the installing site, but the CMS picker (+ › Component) lists the site's own components first and then every library component by group, with no way to limit it. Give the editor a **site-own wrapper** per block in a group of its own: `div` with `u-display-contents` (and `data-display="contents"`) carrying the block's `data-*` hook, the library instance inside, its props bound to wrapper props. A library instance itself cannot become a component (API: "Target element is invalid"; the Designer only offers "Convert to site component", which cuts the library link). Scripts find the wrapper as the direct child of the rich text (Nov 2026).

## The rule behind it

**Every Accept strips library classes from elements the installing site owns itself:** page elements, elements inside site-local components (CMS list components, wrappers around library components), CMS lists (also in slots), slots. This also happens when the update does not touch that class. Elements inside library component instances keep their classes. **`data-*` attributes survive.** **Classes created on the installing site itself survive** (`page_wrap`, `page_main` and section-specific classes were untouched); only library classes go. Webflow does not document this; per the Help Center, library classes travel with library components and nothing else.

So on an installing site, **no element the site owns may depend on a library class.** In practice:

| The class does | Do this instead |
|---|---|
| `display: contents` (CMS list wrapper/list/item, slot wrappers, page slots, the root of a local list component) | `data-display="contents"` on the element |
| `display: none` (a hidden source element a script reads, a fallback block) | `data-display="none"` on the element |
| Real styling (type, spacing, layout, colour) | Put the element inside a library component, or give it a `data-*` attribute and style that in the library's global CSS |

The library carries the rules in a **CSS-only** global embed (see the script rule above):

```css
[data-display="contents"] { display: contents; }
[data-display="none"] { display: none; }
```

Keep the class too if you like (it shows in the Designer), but nothing may break when it is gone. A restore list re-applied after every Accept does not scale (10 Nov 2026: ~150 elements, several sessions accepting, and one publish before the restore put every CMS-list page live with its cards stacked in one column). Proven 11 Nov 2026: with `data-display` in place, an Accept with no restore at all left the canvas and 31 live pages right at 1440 and 375.

Scripts that look for a library class break the same way: Lumos' Accordion flattens `u-display-contents` wrappers by class, so check its flatten against `[data-display="contents"]` too ([motion.md](motion.md) §4).

## Setup (once per project)

- In `project.json`: `"library": { "source": "<library site id>", "installers": ["<brand site id>"] }`. The kit's `hooks/library-site.py` then reminds the agent of this page whenever it sets classes or creates a list, slot or page slot on an installing site.
- In the library's global embeds: the two rules above, in an embed without script.
- A list in the client repo of every element that carries `data-display` (e.g. `references/display-contents-ids.json`), so it can be audited. It is not a restore list.

## While building on the installing site

- New CMS list, slot wrapper, page slot, hidden source element: set `data-display` in the same call as the element (`set_attributes`, `scope_component_id` inside a definition; works on DynamoWrapper/List/Item) and add the id to the list.
- Never style a site-owned element with a library class alone. Typography or spacing on a page element is a sign the block should be a library component.

## Audit (when you start on an existing installing site, and after a big build)

Read-only, through the API: `get_all_elements` on every page and every **site-local** component definition (do not descend into component instances). For every `styleNames` on such an element, decide whether it is a library class (it shows with the library prefix on the published page, or exists on the library site) or local. Library class: needs `data-display`, needs to move into a library component, or is harmless (its loss changes nothing). Local class: survives, nothing to do. Also list site-owned blocks and texts with **no** class and no `data-display`: those may have lost one already (wrapper roots of local components are the usual suspects; the build notes say what they had). On a site of about 700 elements this found three footer roots and a hidden fallback block that the restore list had missed.

## Every library round

1. Before sharing on the library: on the installing site's staging, snapshot the pages that use the changed parts (and the pages with CMS lists):
   `node ${CLAUDE_PLUGIN_ROOT}/references/fixture/accept-check.mjs snapshot before.json <url> <url> …`
2. Library: publish, *Share updates* (with a description). Installing site: *Accept all updates*, reload the canvas, publish to staging.
3. `accept-check.mjs snapshot after.json …` with the same URLs, then `accept-check.mjs compare before.json after.json`. What it flags: [fixture/README.md](fixture/README.md); it also catches elements **without** `data-display` (the case a check on the known attributes misses).
4. A change you did not intend: find the element, give it `data-display` (or move it into a library component), publish, compare again. Nothing to restore by hand.
