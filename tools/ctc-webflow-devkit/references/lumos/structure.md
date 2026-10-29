# Page and section structure

## Page

```
page_wrap        all page content; overflow clip; min-height 100svh; display flex, so the footer sits at the bottom
  Global Styles  component with the CSS used on every page
  Global Guides  optional alignment overlay, hidden in preview and on publish
  Nav            component
  page_main      page slot, tag main, id "main": editors add and reorder sections here
  Footer         component
```

New pages get this skeleton before any section. `references/pages.json` and an existing page show whether the site follows it.

## Section

*(house)* **Default: the Lumos Section build-up**, wrapped and closed (see [components.md](components.md), "Section build-up"). The Lumos `Section` brings its own `u-container`; `<name>_contain` goes on its Container Classes prop only when the container needs a style of its own.

Lumos gives the open-section guide `Section › Layout › Column Slots` and the naming example `hero_wrap`, `hero_contain`, `hero_title`, `hero_text`. Built as plain elements (only where the owner asks for it, or a CMS-bound section needs it — see components.md) that becomes:

```
<section>  hero_wrap        theme, background, position; section spacing from the section-space folder
  div      hero_contain     u-container; (house) container-type: inline-size and nothing else
    div    hero_layout      the grid or flex that arranges the content
      …    hero_content / hero_visual / …
```

- Section top and bottom spacing come from the Spacing collection's section-space folder; the page-top value is for a section directly under the nav.
- *(house)* The container class sets width and containment and nothing else. Layout goes on `_layout`, one level down.
- `page_main` is a slot. *(house)* Through the API a slot accepts component instances only, so plain elements built during a build go into a non-slot parent: an existing section's wrapper, or a page without the slot structure. The plan names the insertion point.
- Prefix: whatever the site uses, see [naming.md](naming.md).
