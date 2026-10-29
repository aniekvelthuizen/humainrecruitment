# Lumos — how we build

Lumos is the house system. Every element has a role (its custom class), every value belongs to the system (a variable), every layout responds to space instead of breakpoints, and every reusable block becomes a component an editor can drop on a page. When `project.json` says `css.system: custom`, the site's own naming and variables replace sections 1 to 3; the rest still holds.

## 0. Lumos first, custom code last *(house)*

- **Webflow-native before own code** *(house)*: what Webflow itself offers (styles, Lumos `data-trigger`/`data-state`, Interactions IX3 with its built-in GSAP, native conditions, components) comes first; own scripting only for what Webflow cannot do. Motion: a hover as Lumos trigger transitions, scroll/click/load as IX3 ([buttons/motion.md](../skills/buttons/motion.md) §1). A script that animates uses the GSAP Webflow loads (Site settings › GSAP) — never a GSAP or plugin we load ourselves.
- **No custom code when Lumos can do the job.** Layout, sizing, spacing, alignment, colour, type and state are built with Lumos classes, utilities, combos, variables, `data-trigger`/`data-state` and components, in Webflow styles. Custom CSS/JS is the last resort, only for what Lumos and Webflow (styles, Interactions) cannot do: a script for behaviour, a keyframe, an override of Webflow's own CSS.
- **An API limit is not a reason for code.** When the style API cannot store a value (`calc()` with variables is flattened, see [webflow-mcp.md](webflow-mcp.md)), find the Lumos route first (a utility such as `u-container`, a combo, zeroing a padding, an existing variable) or set the value in the Designer UI. Never move a layout rule into `Global | Custom Code` because the API refused it.
- **Styling is never code.** Typography, colour, tag styles and selectors the API cannot write (a nested selector such as "All Italics inside `u-heading`") are set natively in the Designer, in the user's Chrome — not in a CSS embed. Code is for behaviour only.
- **Code and IX3 find elements through `data-*` attributes**, never classes or ids: attributes survive restyles, renames and componentizing, and read as intent. Design the attribute contract first (name + allowed values) and write it in `decisions/site.md`; states the code sets are attributes too. Exception: when the condition is a Lumos theme set by a component variant (Section Theme → `u-theme-dark`), target that Lumos class — an attribute cannot follow a variant prop.
- Custom code that does get added names, in `decisions/`, what Lumos could not do and why.

Per topic: the rules that decide a review, then the deep file. Load the deep file for the topic you are building; nothing else. Rules marked *(house)* come from our builds, not from the Lumos docs; the deep files mark them the same way.

## 1. Naming — [lumos/naming.md](lumos/naming.md)

- Custom class first on every element: `type_variation(optional)_element`, underscores, at most three, `_wrap` opens a component. *(house)* Project prefix: whatever this site uses.
- Utilities (`u-*`) stacked on a custom class, generally at most four. *(house)* Applied, never created; a missing one means a custom class.
- Combos (`is-*`) only on a custom class. *(house)* Named after the condition; a combo on a class you do not own belongs to the site.

## 2. Variables — [lumos/variables.md](lumos/variables.md)

- Type, colour, structure, sizing, layout, radius, border width: a variable from `references/variables.json`. Display, width, height, opacity, overflow: a plain style or utility.
- *(house)* Accepted literals, always named in the plan: `font-weight` without a font variable, gradient stops, `text-shadow`, `em` beside `clamp()` text, a type size no token equals (literal `rem`, flagged). A spacing size off the scale is the design's value in literal `rem`, noted in `decisions/`.

## 3. Typography — [lumos/typography.md](lumos/typography.md)

- Text = custom class + `u-text-style-*`; overrides on the custom class.
- `u-text-style-*` is `flow-root` with the line-height trim. *(house)* On plain text elements only, never on a flex/grid element or one with its own font.
- *(house)* The design's size wins: the text style that equals it, else a `rem` override on the custom class. Line breaks match the design.
- A **text-style variable mode** (Text 16, Text Large) on a wrapper also changes the `text-space/*` gaps inside it: kicker → title became 32 instead of the site's 28. Set the mode on the text element, not on the head or container that holds kicker and title.
- *(house)* Texts inside components are Lumos Typography instances (Heading, Paragraph, Plain, Tag) or `Button Main`, never custom heading/text elements ([cards/typography.md](../skills/cards/typography.md)).
- *(house)* **A heading's level is fixed in the component**, not left to the editor: a title is **Typography Heading (Plain Text)** with its Tag set (h2, h3) and a plain-text prop — no rich-text prop through which an H2 can become an H3. Rich-text Heading only where the content itself carries structure.

## 4. Colour — [lumos/color.md](lumos/color.md)

- Theme variables for text, background, border and buttons; exact names from `variables.json`. *(house)* A swatch directly only for a shape that belongs to the neighbouring section, or as fallback when no theme variable fits.
- *(house)* No hex. A design colour without a variable is a plan question.

## 5. Structure — [lumos/structure.md](lumos/structure.md)

- `page_wrap` › Global Styles › Nav › `page_main` (slot) › Footer. Section › container › layout › content, section spacing from the section-space folder. *(house)* The container carries `u-container` and `container-type: inline-size` and nothing else.
- *(house)* **Every section's content sits in a container** (`<name>_contain` + combo `u-container`) unless the owner says otherwise — also when Figma bleeds media to the frame edge. Build it in the container and list the bleed as a plan question; never imitate it with side paddings. Section top/bottom spacing goes on the section wrap, not the container.
- *(house)* **Every page section is the Lumos Section build-up**, as the Lumos *Example Components* page shows it: `<name>_wrap` (div) › Lumos `Section` (Theme, Padding, Height, Container Classes) › Background slot (`Block`, `Visual Image`, `Media Overlay`) and Container slot (`Layout` Stack/Columns, Typography `Tag` / `Heading` / `Paragraph`). The header uses Lumos components and their props only, no custom classes; spacing between them with `u-margin-top-*` on the Classes props. The wrap then becomes a **closed component** with its own name. Custom classes only where Lumos has no piece (placement over a photo), and they go on the Lumos Classes props. A hand-made shell is a defect; when something cannot go into a Lumos slot through the API, find the Lumos route or ask. Quirks: [lumos/components.md](lumos/components.md).
- *(house)* **Layout before Block.** Columns, rows and "left | right" patterns are a Lumos `Layout` in the variant Example Components uses for that pattern; a `Block` only where Lumos has none. Owners spot sections built from Blocks. Which variant for which pattern: [lumos/components.md](lumos/components.md).
- *(house)* **Global blocks keep Lumos' own build.** `Nav` and `Footer` are not Section build-ups: they stay on the Lumos `Nav` / `Footer` component with their own classes (`footer_wrap`, `footer_contain`, …); parts they share (legal links, contact block) become components. Say so in the plan.

## 6. Spacing — [lumos/spacing.md](lumos/spacing.md)

- Margin between text elements, gap between like items and grid columns. Text parents stay `display: block`.
- *(house)* **Every distance the design gives is built at that value** — between cards, inside a card, heading to text, section top and bottom. A `space--n` step when it equals it, else the design's literal `rem`. Never rounded to the nearest step, never borrowed from a neighbouring section because it is close, never left out because the frame looks flush. `rem` for size, `em` beside fluid text. Never `px`.
- *(house)* Exception, the **section shell**: rails, borders, corner marks and the section's outer spacing follow the neighbouring sections on the same page. A cropped Figma frame does not draw them, and their absence in one frame is a conflict to raise, not a spec to follow.

## 7. Grid and flex — [lumos/grid.md](lumos/grid.md), [lumos/flexbox.md](lumos/flexbox.md)

- Grid utilities or the Grid component before a hand-written grid. *(house)* Hand-written columns are `minmax(0, 1fr)`, except wide tables on mobile.
- Horizontal flex wraps. Flexbox and margin go on the custom class when possible.
- *(house)* Lumos `Layout` Columns is a 12-column grid with `:where()` spans: unequal columns are span overrides on the column classes, not max-width or flex. Lumos Layout and Grid respond to the **container** width, so a breakpoint-only override on top of them switches at a different width (seen ~830–991): set the override at the width the container query flips, or let the component do it.

## 8. Responsive — [lumos/responsive.md](lumos/responsive.md)

- Wrap, Lumos grids, fluid values, no `px`, responsive variables, container queries. *(house)* Webflow breakpoints only when `variables.json` has no responsive variables, noted in `decisions/site.md`.
- *(house)* Two layouts at different widths = one responsive block. Two layouts an editor chooses = a variant.
- *(house)* Every block is responsive when first built, never on request: checked at every screen size, no overflow.
- *(house)* **Responsive is the reflow a reader expects.** A row of cards goes to two columns, then one; a row of tabs or chips wraps; text columns stack. A horizontal scroller, slider or carousel is a design decision — used when the design draws one, or when nothing else fits and the plan says so. Never the automatic answer to "this row is too wide". When in doubt, stack.

## 9. State — [lumos/state.md](lumos/state.md)

- `data-trigger` / `data-state` plus `--_trigger---on|off` calcs. *(house)* Native `:hover` only when the site lacks the properties. *(house)* The names are inverted: `--_trigger---off` = 1 while hovered. Focus outlines only on `:focus-visible`.

## 10. Components — [lumos/components.md](lumos/components.md)

- Open (slots) first, closed (props) when content must be identical everywhere. The variant prop is named `Variant`. *(house)* One variant axis; responsive never in a variant.
- *(house)* Every component is shown on the Lumos **Styleguide** page (it ships with every Lumos site), in the section **Components**, one group per component (`#buttons`, `#cards`, …) — not a separate page. Show cards sit on the section background (`background`), so each look shows as it will on a page.
- *(house)* A type Lumos ships (button, card, slider, accordion, tabs, form, video) is built **in the Lumos original itself** — adapted in place, name kept, the design's types as its variants; a duplicate only when the owner asks. *(house)* Exception: something that only **looks** like a Lumos type but has its own data and behaviour (PMS: a mineral card with two images, a formula, its own hover, always CMS-fed) becomes its own component built from Lumos parts — test: as a variant, would it add props that do nothing in the other variants? Then propose it separately. Props in folders Variant → Content → Visual → parts → Link → Settings, visibility toggles, slots for repeated items, native "is set" conditions ([componentize](../skills/componentize/SKILL.md), [cards](../skills/cards/SKILL.md)).
- **Lumos Slider with a fractional per-view** (2.1, 1.2): at the end the previous slide shows a strip at the edge. Give the last slide `margin-right: calc((var(--slide-count) - round(down, var(--slide-count), 1)) / var(--slide-count) * 100%)` on `:last-child` (it reads the slider's own per-view at every breakpoint; Lumos switches per-view at em widths that are not Webflow's breakpoints, so fixed percentages fail). A clip-path inset cuts the first slide at rest instead.
- *(house)* Icons in repeated items (list rows, feature lines) are an **image prop** with the design's icon as default, so editors can swap them; not a fixed nested icon component.
