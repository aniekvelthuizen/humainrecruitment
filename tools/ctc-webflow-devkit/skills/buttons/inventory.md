# Inventory — which buttons the design really has

A Figma button set usually offers more than the pages use: style-guide frames keep pills, sizes and states from a UI kit that the designer never placed. Building from the set alone produces a component the owner then has to undo. Build from the **pages**.

## 1. Find the sets and the page frames

- `get_metadata` without `nodeId` lists the pages; the project's design pages are in `project.json` (`figma.pages`).
- Find the button component sets: `get_metadata` on the style-guide page, grep for `<frame … name="button…"` / component sets, or `search_design_system` scoped to the file. Typical names: `button`, `button-branded`, `cta`, `link`.
- Note the icon set too (`icon`, `icons`): its variants become the Icon Set (icons.md).

## 2. Scan the instances

Run [scripts/figma-buttons-scan.js](scripts/figma-buttons-scan.js) through `use_figma` (load the figma-use guidance first), once per design page, with the set names and the page id filled in. It is read-only and returns, per distinct look:

- the variant name and component props, the icons used, visible text examples and where they sit (frame / section);
- the **background behind each instance** (the nearest ancestor with a solid fill, and its variable): a look that is invisible on the style-guide card may sit on a darker section in every page;
- radius, padding, gap, height, fill and stroke (with which sides), text style;
- how many visible instances, excluding buttons nested inside other button instances.

A page dump of 2,000+ button instances is normal: the button component is reused for calendar cells, menu items and chips. The grouping is what makes it readable.

## 3. Sort the looks

| Kind | Signals | Becomes |
|---|---|---|
| **Button (CTA)** | Text + often an icon, stand-alone in a section, links somewhere | a variant of the button component |
| Same look on a dark/brand background | Same geometry, colours bound to theme variables (`text`, `border`) | nothing — the theme does it |
| Hover/pressed variant in Figma | `state=hover` / `variant2` | the hover rule, not a variant |
| Small size | `size=small`, same look, a few px smaller | fluid values (mobile), not a variant |
| Icon-only round/square control | no text, 32–48 px square | its own component (`Button Icon`) |
| Calendar day, time slot, table cell | numbers or times, strokes on some sides | part of that widget |
| Nav/menu item, filter chip, tab | inside navbar/menu/filters, toggles state | nav / chip / tab component |
| Tab row built from buttons | 2–4 buttons side by side above a panel: inactive ones one look (often a light "subtle"), the active one another look or its **hover** state | a tab component (interactions skill); note which looks/states it borrows, the button keeps them as variants only if CTAs use them too |
| Contact link (mail, phone, address) | icon first, text is data | a link-list item, not a button |
| Buttons only inside app-like components (forms, wizards) | appear only in multi-step / form frames | ask: often a separate form button |

Screenshot one instance of each look (`use_figma` → `node.screenshot()`; clip from the page if the node is inside a hidden parent). Check the bound variables on the default look (`boundVariables` on strokes and text fills): if they are theme variables, the dark version is free.

## 4. Confirm with the user

Show one table — look, example label, where it appears, the background it sits on, count, screenshot — and ask:

1. Which of these are buttons (the rest go to other components)?
2. Which is the default (`Primary`)?
3. Any look missing that they expect (the designer may have it only on mobile frames)?

Record the answer in `decisions/components/button.md` before planning.
