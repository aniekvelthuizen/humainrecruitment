# Inventory — what the nav in the design means

A nav in Figma is a component set with states (often `page-top`, `minimised`, `tiny` × `desktop`, `mobile`) plus a separate frame for the open menu. The **states say what it looks like; the prototype says when**. Read both before planning.

## 1. Find the parts

- The nav set: `get_metadata` on a design page and look for an instance on top of each page frame, or search the components page for `navbar`, `nav`, `header`. The open menu is usually its own top-level frame (`Hamburger menu`, `Menu`, `Overlay`) on the desktop and the mobile page.
- The row components inside the menu (`menu-option`, `menu-suboption`, a language `toggle`) and the button set the links use (often the site's button, type `subtle`/`text`).
- Run [scripts/figma-nav-scan.js](scripts/figma-nav-scan.js) through `use_figma` (load the figma-use guidance first), once per design page, with the page id filled in. Read-only. It returns the nav and menu sets with their variant properties, which page frame uses which state (and how many instances), and every prototype reaction on the nav variants and the menu frame.

## 2. Read the prototype

| Reaction in Figma | Meaning on the site |
|---|---|
| `AFTER_TIMEOUT` (e.g. 4 s) from `page-top` → `tiny` | scroll: the state changes once the page has scrolled (one bar height) — confirm with the owner |
| `ON_KEY_DOWN` (a letter) between states | a designer's preview shortcut — ignore |
| `ON_CLICK` → `OVERLAY` on the Menu button, `MOVE_IN` with a direction | the panel opens; direction and duration are the slide (durations of 1.5 s are prototype speed — propose ~0.8 s) |
| `ON_CLICK` → `CLOSE` on the overlay's button | Close |
| `ON_HOVER` → `CHANGE_TO` a hover variant | the hover look; on a site with a button component, the button's hover wins unless the owner says otherwise |
| `SMART_ANIMATE` with a cubic-bezier | the curve and duration of that change — reuse the numbers |
| `NAVIGATE` to a page frame | the link target (page frame name → site page) |

Width changes in a smart-animated state (links `width: 0`, Menu button `w-0` → auto, logo frame clipped from the full logo to the mark) tell what folds and what clips. Build it as a slide and a clip, never as a shrinking row (structure.md §5).

## 3. Write the state table

| State | Shows when | Logo | Links | Menu button | Background |
|---|---|---|---|---|---|
| page-top | top of a page, ≥ the width the links fit | full | inline | hidden | none |
| tiny (scrolled) | after one bar height of scroll | mark | gone | visible | none |
| minimised | pages that start without links (detail pages) | full | gone | visible | none |
| mobile | below the link-row width | full → mark on scroll | in the panel only | always | none |

Also note: which pages use which starting state (frame names), the panel content top to bottom (language switch, Close, intro, numbered links, sub-links, contact row), and anything drawn only on mobile.

## 4. Check before the plan

- **Link-row width**: add the link widths + paddings + the logo. Below that width the links do not fit; the Menu button takes over there (often a breakpoint between the desktop and tablet designs, e.g. 1280 px).
- **Link targets**: every `NAVIGATE` frame should exist as a page. Missing pages are a plan question.
- **Copy**: lorem in the panel, placeholder contact details — build as is, list as missing.
- **Backgrounds**: video fills (`type: VIDEO`) cannot be exported through the Figma API — list them as files to deliver.
- **Languages**: a language toggle in the design needs Webflow Localization (a paid add-on) — a plan question, often deferred.
