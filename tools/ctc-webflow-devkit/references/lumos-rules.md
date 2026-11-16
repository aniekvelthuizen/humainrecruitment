# Lumos — how we build

Lumos is the house system. Every element has a role (its custom class), every value belongs to the system (a variable), every layout responds to space instead of breakpoints, and every reusable block becomes a component an editor can drop on a page. When `project.json` says `css.system: custom`, the site's own naming and variables replace sections 1 to 3; the rest still holds.

This page is the index: the rules that decide a review, one or two lines each, then the deep file. Load the deep file for the topic you are building; nothing else. Rules marked *(house)* come from our builds, not from the Lumos docs; the deep files mark them the same way.

## 0. Lumos first, custom code last *(house)*

- **Webflow-native before own code**: Webflow styles, Lumos `data-trigger`/`data-state`, Interactions IX3 with its built-in GSAP, native conditions, components. Own scripting only for what Webflow cannot do; a script that animates uses the GSAP Webflow loads (Site settings › GSAP), never one we load ourselves. Which motion mechanism when: [motion.md](motion.md) §3.
- **No custom code when Lumos can do the job.** Layout, sizing, spacing, alignment, colour, type and state are Lumos classes, utilities, combos, variables, triggers/states and components, in Webflow styles. Custom CSS/JS only for a script for behaviour, a keyframe, an override of Webflow's own CSS.
- **An API limit is not a reason for code.** When the style API cannot store a value (`calc()` with variables is flattened, [webflow-mcp.md](webflow-mcp.md)), find the Lumos route (a utility such as `u-container`, a combo, zeroing a padding, an existing variable) or set the value in the Designer UI. Never move a layout rule into `Global | Custom Code` because the API refused it.
- **Styling is never code.** Typography, colour, tag styles and selectors the API cannot write (a nested selector such as "All Italics inside `u-heading`") are set natively in the Designer ([designer/README.md](designer/README.md)), not in a CSS embed. Deliberate exceptions, nothing else: the CSS-only `[data-display]` embed on a library site ([library-sites.md](library-sites.md)) and the override of Webflow's navbar CSS ([webflow-mcp.md](webflow-mcp.md) §8).
- **Code and IX3 find elements through `data-*` attributes**, never classes or ids: attributes survive restyles, renames and componentizing, and read as intent. Design the attribute contract first (name + allowed values) in `decisions/site.md`; states the code sets are attributes too. Exception: a Lumos theme set by a component variant (Section Theme → `u-theme-dark`) is targeted by that class — an attribute cannot follow a variant prop.
- Custom code that does get added names, in `decisions/`, what Lumos could not do and why.

## 1. Naming — [lumos/naming.md](lumos/naming.md)

Custom class first on every element (`type_variation(optional)_element`, at most three words, `_wrap` opens a component); at most about four `u-*` utilities on it, applied, never created *(house)*; `is-*` combos only on a custom class, named after the condition.

## 2. Variables — [lumos/variables.md](lumos/variables.md)

Type, colour, structure, sizing, layout, radius and border width come from a variable in `references/variables.json`; display, width, height, opacity and overflow are plain styles. *(house)* Accepted literals (named in the plan) and fluid `clamp()` values: there.

## 3. Typography — [lumos/typography.md](lumos/typography.md)

Text = custom class + `u-text-style-*` (flow-root with the trim, plain text elements only); in a section plain `Heading`/`Paragraph`, Typography instances only inside Lumos' small components. *(house)* The design's size wins, line breaks match, heading levels are fixed in the component.

## 4. Colour — [lumos/color.md](lumos/color.md)

Theme variables for text, background, border and buttons; a swatch only for a shape belonging to the neighbouring section or as fallback. *(house)* No hex; a design colour without a variable is a plan question.

## 5. Structure — [lumos/structure.md](lumos/structure.md)

`page_wrap` › Global Styles › Nav › `page_main` (slot) › Footer. *(house)* Every section's content sits in a `u-container`, also where Figma bleeds, unless the owner says otherwise. *(house)* **Every new section is built flat and closed into a component; never content in a slot filled inside a definition** ([lumos/components.md](lumos/components.md), "Section build"). Nav and Footer keep Lumos' own build; on an existing build-up, Layout before Block.

## 6. Spacing — [lumos/spacing.md](lumos/spacing.md)

Margin between text elements, gap between like items; text parents stay `display: block`. *(house)* Every distance the design gives is built at that value (`rem`, `em` beside fluid text, never `px`); the section shell follows the neighbouring sections.

## 7. Grid and flex — [lumos/grid.md](lumos/grid.md), [lumos/flexbox.md](lumos/flexbox.md)

Grid utilities or the Grid component before a hand-written grid (*(house)* `minmax(0, 1fr)`); horizontal flex wraps. Lumos Layout and Grid respond to the container width, not the breakpoint.

## 8. Responsive — [lumos/responsive.md](lumos/responsive.md)

Wrap, Lumos grids, fluid values, no `px`, responsive variables (typed in the Designer: the API refuses them), container queries. *(house)* Responsive from the first build, as the reflow a reader expects; a slider only where the design draws one or the plan says nothing else fits.

## 9. State — [lumos/state.md](lumos/state.md)

`data-trigger` / `data-state` with the `--_trigger---on|off` calcs for transform and opacity; *(house)* the names are inverted, colours go through native `:hover`, focus outlines only on `:focus-visible`.

## 10. Components — [lumos/components.md](lumos/components.md)

Open (slots) first, closed (props) when content must be identical; the variant prop is `Variant`, one axis, responsive never in a variant. *(house)* A type Lumos ships is adapted in the Lumos original; every component is shown on the Components page in the task that builds it; blocks between the paragraphs of a rich text are Components in rich text placed by the editor; icons in repeated items are an image prop; Slider with a fractional per-view needs the end-margin calc (there).
