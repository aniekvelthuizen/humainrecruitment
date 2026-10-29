# Class naming

Three kinds of class. Every element gets one custom class; utilities and combos stack on it. Rules marked *(house)* come from our builds, not from the Lumos docs.

## Custom class — the element's role

`type_variation(optional)_element`: underscores between words, never more than three, always the first class on the element, `_wrap` marks the start of a new component.

```
hero_wrap             the component's outer element
hero_contain
hero_title
hero_secondary_wrap   "secondary" is the variation when there are several heroes
footer_link_wrap      a child group inside footer_wrap; its children are footer_link_text, so two _text never collide
```

- The type prefix is unique per component; the element names (`layout`, `content`, `visual`, `title`, `text`) repeat everywhere.
- Exceptions to "every element gets a custom class": a slot carrying `u-display-contents`, and a base component of only one or two elements that lives on a utility (the Image component).
- *(house)* Some sites carry a project prefix in front of every custom class. `project.json` → `css.prefix` and `references/classes.txt` show what this site does; follow it exactly. Lumos itself has no prefix.

## Utility class — a reusable bundle of styles

`u-` plus dashes: `u-text-style-h2`, `u-grid-autofit`, `u-margin-trim`.

- Stacked on top of a custom class, never alone; generally no more than four on one element.
- Named broad to narrow so search filters: `u-text-` shows every text utility, `u-text-transform-` narrows.
- Do not over-stack: styles like margin or flexbox go on the custom class when possible.
- An override on a utility that sits on a custom class only affects that combination, and survives renaming the utility to a sibling (`u-text-style-h2` → `u-text-style-h3`).
- New utilities are created on an element with no other class, added to the styleguide page, and reordered above the custom classes in the stylesheet. *(house)* Our builds apply utilities and never create them; a missing utility means a custom class.

## Combo class — a modification of one class

`is-` plus dashes: `is-active`, `is-grid-on-light`.

- Created on top of a custom class, never on top of a utility.
- Affects only that combination.
- *(house)* Named after the condition it expresses, never after the page. A combo on a class you do not own belongs to the site: read it, reuse it, leave it.

## Webflow components

Names start with the broadest term so search filters: `Section Hero`, `Button`, `Icon`, `Form`. Groups in the panel: `Section`, `Layout`, `Card`, `Icon`, `Form`, `CMS`. *(house)* Follow the pattern this site already uses (`references/components.json`) before adding a new name.
