# What a review checks

Nine areas, one column each in the report. Every line here is something that has shipped wrong before. The deeper rule behind each area is linked; read it when a line is unclear. A site's `decisions/` overrides the kit: an owner choice written there is not a finding.

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
- Everything the design means to be interactive works: tabs switch, sliders move by drag, arrows and dots, accordions open and close (smoothly, both ways, and turn around when clicked halfway), dropdowns and menus open and close the same way, toggles toggle. Every tab or state keeps the same layout — the section does not grow, stack or jump (interact.mjs flags a height change). Check the tab with the fewest items too: a slider with nothing to slide hides its arrows, and a row that collapses lets the next thing (tab bar, button) ride up into the cards.
- No frame, ring or outline after a mouse click or drag; only keyboard focus draws one. The active tab, current dot and hovered card look designed, not like the browser's or Webflow's default (a grey block is Webflow's default `w--current`). Rest, hover and active each look different: active reads stronger than hover, and hover uses the site's own hover (the button's, in `decisions/`), not just a colour change that looks like active.
- Every link goes somewhere real: no empty link, no `#`, no anchor that is not on the page, page links point to pages that exist. Buttons that should link do. After pages moved into a folder: Webflow 301s the old paths, but typed URLs in component link props keep them — grep the published HTML for the old paths.
- An anchor jump lands with its heading below the nav **and** any sticky bar under it (`scroll-margin-top` per breakpoint), at phone width too.
- Every page and CMS template has an SEO title, description and JPG/PNG share image, in every locale, following the [seo](../seo/SKILL.md) skill: run its `seo-check.mjs` over the pages touched (it flags placeholders). A template with empty SEO shows the site name as `<title>` on every item. A CMS item's SEO comes from its own SEO fields, never a content field.
- CMS: lists are bound, filtered the way the page needs (on a template: to the current item), sorted, and show the right items — not drafts, not "No items found." where content is expected. Text that exists as a CMS field is bound, not typed in.
- Optional parts hide when empty (native "is set" conditions, visibility toggles): no empty band, no lone label, no number without its logo.
- Nothing shows, then hides, then animates in on load. Nothing stays invisible when a reveal fails.
- The first state is visible without scripts (first slide, active tab), so the Designer canvas reads right ([componentize](../componentize/SKILL.md) §2).
- No console errors from the site's own code (sweep.mjs lists them).
- A list built from a slot (`role=list` on the parent): every item root carries `role=listitem` (never the link itself), or screen readers read a list with no items.

## 1b. A11y — [accessibility/criteria.md](../accessibility/criteria.md)

- Once per page in scope: `node ${CLAUDE_PLUGIN_ROOT}/skills/accessibility/a11y-check.mjs <url> --out <evidence>/a11y`, then open the focus crops of this component. Every axe violation, Tab stop without a visible ring, focus on something hidden or under the sticky nav, toggle that does not close on Escape or hand focus back, and target under 24 px inside the component is a finding.
- Through the API: tags and landmarks, heading levels, `role="listitem"` on item wrappers (never on links), `aria-label` or `u-sr-only` names on icon-only controls, alt or Decorative on images, `aria-hidden` only on decoration.
- Contrast of the component in every Theme mode (and brand mode) it is used in, not only the one the page shows (criteria.md §5).
- What a script cannot judge goes under "Not checked" with "hand check": whether alt texts and names are *good*, VoiceOver announcements.

## 1c. SEO — [seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md), [seo](../seo/SKILL.md) §7

- Once per page in scope: `node ${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs <url> [--overview <path>] --out <evidence>/seo`; per component `--block "<root>"` (`--allow-h1` for the page-heading block, `--overview-block` for an overview card grid). Every error is a finding.
- The page's only `h1` in the page-heading block; no headings in overview cards; hero image not lazy, the rest lazy; nav links in the served HTML; FAQ sections with FAQPage and article templates with Article JSON-LD that parses; no CLS above 0.05 from the component. Headings, landmarks, alt and link names themselves are §1b.

## 2. Responsive — [lumos/responsive.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/responsive.md)

- At every width: no sideways page scroll, nothing past the screen edge, no text cut off or leaving its box (sweep.mjs).
- The small-screen layout is the reflow a reader expects: 4 → 2 → 1 columns, rows wrap, columns stack. A slider or scroller only where the design draws one or the plan named it.
- Headings and card titles break into the same lines as the design at 1440 and 375; nothing wraps to an extra line by a pixel.
- Text sizes, images and spacing step down sensibly between the design widths — no jump at one breakpoint, no 80 px title on a phone.
- Tap targets on a phone are at least ~44 px; nothing overlaps.
- Phone checks also in WebKit, not only Chrome at 375: split-text line height, modal focus after opening, hover after a tap ([verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2b). Run `interact.mjs … --webkit` (Playwright WebKit as `devices['iPhone 15']`; once per machine: `npx playwright-core install webkit` in `${CLAUDE_PLUGIN_ROOT}/references/fixture`). The other scripts (sweep, hover-matrix, nav-check) run Chrome only.

## 3. Spacing — [lumos/spacing.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/spacing.md), [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2c

- **Matches the design — as a table.** Write `<evidence>/distances.md`: one row per distance the design gives (from `section-NN.md` and the PNGs) — between items, inside an item, heading to text, text to button, cards to controls, section top and bottom — with design and built value at 1440 and at 375. Spacing gets ✅ only when that table exists and every row is within 2 px or recorded in `decisions/`. Not rounded, not borrowed from a neighbour.
- **Text centred in its box:** in every bar, tab, button, chip and badge, the space above the text equals the space below (measure the text itself with a range, not the box; within 2 px). A label sitting high in its bar is the classic leftover margin of a Typography component.
- **Logical:** the same kind of distance has the same value everywhere. Same kicker → title gap in every section intro (`decisions/site.md` may name it), same section padding for sections of the same weight, same padding inside cards of the same family. A one-off value with no reason in the design or `decisions/` is a finding.
- **Built the right way:** a variable or `u-*` spacing utility where a step equals the value; a literal `rem` only when no step does, and noted in `decisions/`. Never `px`. Margin between text elements, `gap` between like items.
- **No double spacing:** the same distance made twice (padding on the parent + margin on the child + a gap) or cancelled with a negative margin. No empty divs or spacers as spacing.
- Default `h1–h6` / `p` margins reset; the text trim (`u-text-style-*`) wanted or opted out; text boxes match Figma's box height where text sits in a padded box.
- The section shell (outer spacing, rails, borders) matches the neighbouring sections on the same page.

## 4. Lumos — [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md)

- A new section is flat: `<name>_wrap` › `<name>_contain` + `u-container` › plain elements with Lumos classes and variables, no Lumos `Section` / `Layout` / `Block` / `Typography` components (existing Section build-ups stay). Closed into its own component. **No content in a slot that is filled inside the definition**: every text, link and image is found by `query_elements` and writable ([lumos/components.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/components.md), "Section build").
- Content sits in `<name>_contain` + `u-container`, also where the design bleeds to the edge.
- The component is on the Components page (`/components`): a Showcase Label with its Designer name and where it is used, the instance in its group, filled like its real page, same script versions as the source page.
- On an existing Section build-up: Section Height `true` (auto) for short sections; full-screen only where the design is full-screen.
- Every text in a section is a plain `Heading` / `Paragraph` with the Lumos text classes, bound to a prop or set in the definition; inside a card or `Button Main` a Typography instance. No font styling on custom classes, no custom header classes.
- Class names: `type_element`, underscores, describe the pattern not the copy or page; at most ~4 utilities; combos only on the component's own class; utilities applied, never created. No edits to a Lumos original's own classes (`card_primary_*`, `button_main_*`) for one use.
- Values from variables: colour from theme variables (no hex, no swatch where a theme variable fits), type, radius, border width, sizing. A colour without a variable is a question, not a hex.
- Lumos `Layout` / `Grid` / grid utilities before hand-written grids; hand-written columns are `minmax(0, 1fr)`.
- Repeated elements use the component the site already has (a card from the Cards page, `Button Main`, `Icon Set`); no new twin of something that exists. A new card starts from `Card Primary`.
- Page frame: Global Styles and `Global | Custom Code` present; sections carry `data-section` (when the site uses it).

## 5. Code — [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §0, [interactions](../interactions/SKILL.md) §1

- Custom code exists only where Lumos, Webflow styles and IX3 cannot do it — behaviour, never layout, sizing, spacing, colour or type. An API limit was never a reason for code.
- It lives where [interactions](../interactions/SKILL.md) §1 says (on a library site [references/motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §8, or where `decisions/site.md` names): no embeds inside other components or on elements, no page custom code unless it must run in `<head>`.
- It targets `data-*` attributes, never classes or ids (exceptions only as listed in `decisions/site.md`). Its attribute contract is written in `decisions/`.
- **No unneeded code:** selectors or attributes that match nothing on any page, code for a feature that was removed or rebuilt, two scripts doing the same thing, a library loaded twice, `console.log`s, CSS that repeats what a class already sets, inline `style` attributes set through the API.
- **No unneeded build:** empty or wrapper divs that do nothing, elements hidden with no purpose, classes the build created that no element uses, the original section left on the page after it became a component, test pages or test instances.
- Motion follows [references/motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md): the ladder (§3), smooth open/close that turns around halfway (§9), timings from `decisions/motion.md` or the kit tokens; IX3 and scripts find elements by attribute.

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
