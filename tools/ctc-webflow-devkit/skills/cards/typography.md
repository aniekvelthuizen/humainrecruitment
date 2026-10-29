# Card texts → Lumos Typography components

Every text in a card is a Lumos Typography instance; card classes only do layout. Same for any component's texts.

| Text | Component | Instance settings | Card prop |
|---|---|---|---|
| Title | Typography Heading (Plain Text), Tag fixed (h2/h3) | Variant `base` (Inherit), Margin Bottom `0` | text (plain) — also for CMS titles |
| Title with structure in the copy | Typography Heading (Rich Text) | Variant `base` (Inherit), Max Width `-1`, Margin Bottom `0` | rich text |
| Body, description, quote, note | Typography Paragraph | Variant `base` (Inherit), Max Width `-1`, Margin Bottom `0` | rich text |
| Short label: name, job title, date, number, stat, status, period, badge, slot item text | Typography Plain | Variant `base` (Inherit), Margin Bottom `0` | text (plain) |
| Kicker | Typography Tag | as the site sets it | text |
| Button | Button Main | | text, link |

Images stay plain Image elements (Lumos does the same).

## Typography Heading (Plain Text)

Lumos ships `Typography Heading` with rich text only: the level lives in the content, an editor can change it, and a CMS plain-text title cannot bind to it. Add a second heading once per site (PMS, Oct 2026):

- Rename `Typography Heading` → **Typography Heading (Rich Text)** (only the `data-wf--…--variant` attribute name changes; grep custom code for it first).
- Duplicate Lumos `Typography Plain` → **Typography Heading (Plain Text)** (same `u-text` styling, same size variants). Props: Text (plain), Variant, Max Width, Margin Bottom, Visibility, **Tag** (h1–h6, p, div; default **h2**), Style, Classes, ID.
- Classes and Margin Bottom are both a conditional `class` attribute on the root, and only the last one counts on this element: make the margin one apply only when Classes is empty, and put a margin utility in Classes otherwise. Conditional attributes and the per-instance Tag are Designer steps ([webflow-mcp.md](../../references/webflow-mcp.md) §9, §11).
- This duplicate is the allowed kind: a different content type, not a second look of the same component.

## Recipe per text element

1. Measure the card first; you must end with the same geometry.
2. `data_element_builder`: a DivBlock **before** the old element, `set_style` = the old element's exact class list (e.g. `card_x_title` + `u-text-style-h6`). Layout, padding, text-style mode and variant styles stay because the class names are unchanged.
3. `insert_component_instance` into the wrapper (`scope_component_id` = the card).
4. Props. Plain: bind its Text to the existing text prop. Heading / Paragraph: `remove_prop` the old text prop **first**, then `create_prop` rich text with the same name, folder and default (`rich_text_inner_text`) so the name stays clean (no "… 2"), then bind. Set Variant, Max Width, Margin Bottom.
5. Visibility: a prop-bound visibility moves to the wrapper (`set_visibility`); a native condition is a Designer step on the wrapper.
6. `remove_element` the old element.
7. Page instances lose overrides of replaced (rich text) props: re-set them. Plain-bound props keep their ids and overrides.
8. Read back tree, bindings and props; measure again and report any px difference.

## Designer steps it leaves (queue them for the Designer pass, webflow-mcp.md §11)

- **Heading level.** The API writes rich text as `<p>`, also every instance value set with `rich_text_inner_text` (and the API cannot reach inside an instance's rich-text prop to change it). Properties › the Title prop › Default Rich Text › Edit Rich Text › select the text with a **real** mouse drag (scripted selection shows the toolbar but the buttons ignore it) › H3 (`[data-automation-id="rte-h3-bar-button"]`, real click) › Close. Then on every page instance with its own title: select it › instance props › Title › Edit Rich Text › same steps. Read back on staging that the tag is `h3`.
- Native "is set" conditions on the wrappers.
- Prop order in the folder (a fresh rich-text prop lands last).
- The Lumos Heading Tag prop drives nothing any more (the level lives in the rich text); remove it (PMS owner: yes).

## Watch

- `u-line-clamp-N` now sits on a wrapper whose child is `div.u-rich-text > p`: measure that it still cuts at N lines.
- Per-variant text-style modes on the wrapper's combo must reach the Inherit instance: measure every variant.
- A CMS **plain-text** field binds only to plain-text props, so a CMS-fed title cannot use the rich-text Heading/Paragraph: use Typography Heading (Plain Text) above, or Typography Plain.
- Typography Plain's `p.u-text` stretches to full width in a flex row, and `u-heading`/`u-text` carry `min-width: 100%`: give the piece a holder div with the width you need. `u-text` is `display: flex`, so `column-count` on a Paragraph needs `display: block` on the class.
- Lumos Tidy Text (`text-wrap: balance`) changes designed line breaks: switch it off on titles whose Figma break must hold.
- Typography Heading's Variant default is **H2**, not Inherit: set it to `base` (Inherit) explicitly, or the per-variant text-style mode on the wrapper is ignored.
- Accent words in headings (italic → accent colour) are a native nested style **All Italics inside `u-heading`**, set in the Designer — never a CSS embed (lumos-rules.md §0).
