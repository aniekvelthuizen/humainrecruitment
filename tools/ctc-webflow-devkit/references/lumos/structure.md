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

*(house)* **Default: flat**, built and closed as in [components.md](components.md), "Section build" (also: Nav/Footer, existing Section build-ups, why). Lumos gives the open-section guide `Section › Layout › Column Slots` and the naming example `hero_wrap`, `hero_contain`, `hero_title`, `hero_text`. Built as plain elements that becomes:

```
<section>  hero_wrap        theme, background, position; section spacing from the section-space folder
  div      hero_contain     u-container; (house) container-type: inline-size and nothing else
    div    hero_layout      the grid or flex that arranges the content
      …    hero_content / hero_visual / …
```

- Section top and bottom spacing come from the Spacing collection's section-space folder, on the section wrap, not the container; the page-top value is for a section directly under the nav.
- *(house)* The container class sets width and containment and nothing else. Layout goes on `_layout`, one level down.
- *(house)* **Every section's content sits in a container** (`<name>_contain` + `u-container`) unless the owner says otherwise — also when Figma bleeds media to the frame edge. Build it in the container and list the bleed as a plan question (a row that scrolls sideways: [interactions/patterns.md](../../skills/interactions/patterns.md), Sliders); never imitate it with side paddings.
- `page_main` is a slot. *(house)* Through the API a slot accepts component instances only, so plain elements built during a build go into a non-slot parent: an existing section's wrapper, or a page without the slot structure. The plan names the insertion point.
- Prefix: whatever the site uses, see [naming.md](naming.md).
