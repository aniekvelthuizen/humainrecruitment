# What a review checks

Seven areas, one column each in the report. Every line here is something that has shipped wrong before. The deeper rule behind each area is linked; read it when a line is unclear. A site's `decisions/` overrides the kit: an owner choice written there is not a finding.

Widths: the design widths plus every breakpoint — **1440, 1280, 990, 768, 767, 479, 375** (990, not 991: the ≤ 991 rule may not match at 991 exactly). Also **900** when the section uses Lumos `Layout` or `Grid`: they switch on the container's width, so a breakpoint override on top can disagree between ~830 and 991.

## How to look

| Source | Gives | How |
|---|---|---|
| The API | structure, classes and their values, props, variants, slots, CMS bindings, scripts, IX3 | `query_elements` on the instance and on the component definition, `query_styles` with `include_properties` for every class it uses, `get_component` for props, `get_variables` once (or `references/variables.json`), `data_scripts_tool` for site/page code, the `Global \| Custom Code` component's embeds |
| The published page | what a visitor gets | `node ${CLAUDE_PLUGIN_ROOT}/skills/review/sweep.mjs <url> --out <evidence>/sweep` once per page; `measure.mjs` (fixture README) for the component's boxes and gaps; a small Playwright script for clicks, drags, hover and keyboard focus (import `playwright-core` with `createRequire` from `${CLAUDE_PLUGIN_ROOT}/references/fixture/package.json`, like sweep.mjs) |
| The design | the target | `references/figma/<page>/section-NN.png` at desktop and mobile; `section-NN.md` for the values |

Staging URL: `project.json` `site.stagingDomain`, else `<shortName>.webflow.io` from `data_sites_tool`. Compare the site's `lastPublished` (`data_sites_tool`, not the HTTP `Last-Modified` header) with the page's last edit (`data_pages_tool`) and the build's date in `references/log.md`: a build after the last publish is checked through the API only (and listed under "Not checked" for everything visual), or patched into the page with the fixture when the classes and markup are known. Never publish, never ask for a publish.

Never submit a real form, click "buy", or send anything outward. Check a form by its fields, labels, validation and focus states. Webflow's bot check (Cloudflare Turnstile) keeps Submit disabled (`w-form-loading`) in headless Chrome, so a headless submit proves nothing: the hand-over gives the owner literal steps for one real test submission, and what it should produce (the submission in Webflow's Forms tab, the fields that must be filled, the e-mail or webhook).

**What the API cannot show** — mark these `?` with a Designer check (or a published test item) instead of guessing: a Collection List's sort, filter and limit; page and SEO settings; which field a native condition checks (the API only says `sourceType: conditional`); which CMS field a bound prop holds (`get_component_instance_props` leaves CMS-bound props out); whether a Block's visibility is bound (it reads `true` when it is); the source of an embed inside a component. A bound condition can be proved on staging with an item that has that field empty.

## 1. Works

- **Use it like a visitor, then look at the pictures.** Every section with something interactive gets `node ${CLAUDE_PLUGIN_ROOT}/skills/review/interact.mjs <url> --section <selector> --out <evidence>/interact --widths 1440,768,375`: it clicks every tab, drags every slider both ways and past both ends, presses the arrows, hovers and tabs through with the keyboard, and photographs each step, also *during* a drag. Then open every picture. "It works" is not enough — it has to look right while it moves and after it stops.
- Moving content never runs over fixed content: no slide, card or panel over the title, the text, the tab bar or the buttons next to it, during or after a drag or an arrow click (interact.mjs flags it; the pictures show what it misses). A slider that shows slides outside its column needs them hidden or faded where they meet other content.
- Everything the design means to be interactive works: tabs switch, sliders move by drag, arrows and dots, accordions open and close, toggles toggle. Every tab or state keeps the same layout — the section does not grow, stack or jump (interact.mjs flags a height change). Check the tab with the fewest items too: a slider with nothing to slide hides its arrows, and a row that collapses lets the next thing (tab bar, button) ride up into the cards.
- No frame, ring or outline after a mouse click or drag; only keyboard focus draws one. The active tab, current dot and hovered card look designed, not like the browser's or Webflow's default (a grey block is Webflow's default `w--current`). Rest, hover and active each look different: active reads stronger than hover, and hover uses the site's own hover (the button's, in `decisions/`), not just a colour change that looks like active.
- Every link goes somewhere real: no empty link, no `#`, no anchor that is not on the page, page links point to pages that exist. Buttons that should link do. After pages moved into a folder: Webflow 301s the old paths, but typed URLs in component link props keep them — grep the published HTML for the old paths.
- An anchor jump lands with its heading below the nav **and** any sticky bar under it (`scroll-margin-top` per breakpoint), at phone width too.
- Every page and CMS template has an SEO title and description: a template with empty SEO shows the site name as `<title>` on every item; Lumos ships the placeholder "Place website meta description here" on Home.
- CMS: lists are bound, filtered the way the page needs (on a template: to the current item), sorted, and show the right items — not drafts, not "No items found." where content is expected. Text that exists as a CMS field is bound, not typed in.
- Optional parts hide when empty (native "is set" conditions, visibility toggles): no empty band, no lone label, no number without its logo.
- Nothing shows, then hides, then animates in on load. Nothing stays invisible when a reveal fails.
- The first state is visible without scripts (first slide, active tab), so the Designer canvas reads right ([componentize](../componentize/SKILL.md) §2).
- No console errors from the site's own code (sweep.mjs lists them).
- A list built from a slot (`role=list` on the parent): every item root carries `role=listitem`, or screen readers read a list with no items.

## 2. Responsive — [lumos/responsive.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/responsive.md)

- At every width: no sideways page scroll, nothing past the screen edge, no text cut off or leaving its box (sweep.mjs).
- The small-screen layout is the reflow a reader expects: 4 → 2 → 1 columns, rows wrap, columns stack. A slider or scroller only where the design draws one or the plan named it.
- Headings and card titles break into the same lines as the design at 1440 and 375; nothing wraps to an extra line by a pixel.
- Text sizes, images and spacing step down sensibly between the design widths — no jump at one breakpoint, no 80 px title on a phone.
- Tap targets on a phone are at least ~44 px; nothing overlaps.

## 3. Spacing — [lumos/spacing.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/spacing.md), [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2c

- **Matches the design — as a table.** Write `<evidence>/distances.md`: one row per distance the design gives (from `section-NN.md` and the PNGs) — between items, inside an item, heading to text, text to button, cards to controls, section top and bottom — with design and built value at 1440 and at 375. Spacing gets ✅ only when that table exists and every row is within 2 px or recorded in `decisions/`. Not rounded, not borrowed from a neighbour.
- **Text centred in its box:** in every bar, tab, button, chip and badge, the space above the text equals the space below (measure the text itself with a range, not the box; within 2 px). A label sitting high in its bar is the classic leftover margin of a Typography component.
- **Logical:** the same kind of distance has the same value everywhere. Same kicker → title gap in every section intro (`decisions/site.md` may name it), same section padding for sections of the same weight, same padding inside cards of the same family. A one-off value with no reason in the design or `decisions/` is a finding.
- **Built the right way:** a variable or `u-*` spacing utility where a step equals the value; a literal `rem` only when no step does, and noted in `decisions/`. Never `px`. Margin between text elements, `gap` between like items.
- **No double spacing:** the same distance made twice (padding on the parent + margin on the child + a gap) or cancelled with a negative margin. No empty divs or spacers as spacing.
- Default `h1–h6` / `p` margins reset; the text trim (`u-text-style-*`) wanted or opted out; text boxes match Figma's box height where text sits in a padded box.
- The section shell (outer spacing, rails, borders) matches the neighbouring sections on the same page.

## 4. Lumos — [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md)

- The section is the Lumos Section build-up: `<name>_wrap` › Lumos `Section` (Theme, Padding, Height, Container Classes) › Background and Container slots with Lumos `Layout`, `Grid` and Typography. No hand-made shell. Closed into its own component.
- Content sits in `<name>_contain` + `u-container`, also where the design bleeds to the edge.
- Short sections have Section Height `true` (auto); full-screen only where the design is full-screen.
- Every text in a component is a Typography instance (Heading, Paragraph, Plain, Tag) or `Button Main` — no custom text elements, no custom header classes.
- Class names: `type_element`, underscores, describe the pattern not the copy or page; at most ~4 utilities; combos only on the component's own class; utilities applied, never created. No edits to a Lumos original's own classes (`card_primary_*`, `button_main_*`) for one use.
- Values from variables: colour from theme variables (no hex, no swatch where a theme variable fits), type, radius, border width, sizing. A colour without a variable is a question, not a hex.
- Lumos `Layout` / `Grid` / grid utilities before hand-written grids; hand-written columns are `minmax(0, 1fr)`.
- Repeated elements use the component the site already has (a card from the Cards page, `Button Main`, `Icon Set`); no new twin of something that exists. A new card starts from `Card Primary`.
- Page frame: Global Styles and `Global | Custom Code` present; sections carry `data-section` (when the site uses it).

## 5. Code — [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §0, [interactions](../interactions/SKILL.md) §1

- Custom code exists only where Lumos, Webflow styles and IX3 cannot do it — behaviour, never layout, sizing, spacing, colour or type. An API limit was never a reason for code.
- All of it lives in `Global | Custom Code` (or the place `decisions/site.md` names): no embeds inside other components or on elements, no page custom code unless it must run in `<head>`.
- It targets `data-*` attributes, never classes or ids (exceptions only as listed in `decisions/site.md`). Its attribute contract is written in `decisions/`.
- **No unneeded code:** selectors or attributes that match nothing on any page, code for a feature that was removed or rebuilt, two scripts doing the same thing, a library loaded twice, `console.log`s, CSS that repeats what a class already sets, inline `style` attributes set through the API.
- **No unneeded build:** empty or wrapper divs that do nothing, elements hidden with no purpose, classes the build created that no element uses, the original section left on the page after it became a component, test pages or test instances.
- Motion that IX3 can do is in IX3; IX3 and scripts find elements by attribute.

## 6. Props — what the editor gets — [componentize](../componentize/SKILL.md) §1, [cards/props.md](../cards/props.md)

- Every text, image, link and optional part an editor would change is a prop or a slot (except blocks meant to be edited centrally: nav, footer, home hero).
- Folders in order **Variant → Content → Visual → part folders (DOM order) → Link → Settings**; inside a folder, fill-in order; one kind of thing per folder.
- `<Thing> Visibility` right after the thing; texts show only when filled (`is set`, with a toggle `toggle AND is set`); a wrapper of optional parts hides when all are off.
- Slots named after what goes in them (never "Slot"), in a folder, with Allowed components set; repeated items are a slot of an item component, not `Tag 1/2/3`.
- Plain prop names, no leftovers (props that drive nothing), tooltips up to date.
- A fresh instance with default values looks like the most common use of the block.

## 7. Design — [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2c, §2d

- Side by side with the design at 1440 and 375: first as whole pictures (weight, density, where the eye lands), then element by element — every divider, icon, badge, decoration, colour, weight, size, line break.
- Hover and focus on every link, icon link and field in the site's own language, even where the design draws none; no outline after a mouse click (only `:focus-visible`).
- Headings: one `<h1>` per page, titles are H tags in order (the sweep lists large text that is a `<p>`).
- Images: right crop, not stretched, alt text set.
- Placeholder or dummy content is listed as **content**, not as a defect.

## Records

The component's `decisions/` file exists and matches what is built (props, open steps, deviations). A deviation from the design or a rule that is neither in the design nor in `decisions/` is a finding.
