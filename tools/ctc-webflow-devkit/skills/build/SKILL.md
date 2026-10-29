---
name: build
description: Build or change something on a Webflow site and verify it against its source. Use when the user gives a Figma URL or frame to build, asks to change, fix or restyle something on the site (often with a screenshot), asks to put final copy from a document onto a page, or asks for a new section or page "in the style of the site" with no design, or asks to prepare a site for a Figma design (fill in Lumos, variables, themes, fonts, type scale). Requires a client repo (project.json in the cwd); otherwise run the project skill first.
---

# Build — plan, confirm, build, verify

One loop for every job: know the target, know what exists, plan, get one OK, build in bulk, verify against the target, componentize the finished section, hand over — and when the page is complete, one motion pass over it. The source decides the first step only:

| Source | First step |
|---|---|
| Figma URL or frames | [figma.md](figma.md): dump and index the design |
| A sentence, usually with a screenshot | [change.md](change.md): diagnose read-only |
| A copy document (PDF, doc, text) | [copy.md](copy.md): extract to a file first |
| A brief, no design ("a FAQ under pricing", "a page like /customers") | [brief.md](brief.md): pick the exemplar on the site |
| The Figma design system, before any section: variables, themes, fonts, type scale | [foundations.md](foundations.md): map Figma to Lumos, write, set the fluid `clamp()`s in the Variables panel, verify by script |

Plugin root: `${CLAUDE_PLUGIN_ROOT}` (pass it to subagents as-is).

Read before anything else: the latest Webflow changes (https://webflow.com/updates and https://developers.webflow.com/home/changelog; `curl -sL -A "Mozilla/5.0"` when a fetcher is refused) — a new feature can replace a workaround or a hand-over step — then `project.json`, then `decisions/site.md` and the `decisions/` files for the pages and components involved. When `project.json` is missing, stop and point to the project skill. Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Plan

Write `references/plans/<yyyy-mm-dd>-<name>.md` from [plan-template.md](plan-template.md). It names:

- The **units** of work: a section, a page, or a component, chosen by what can be built and checked on its own.
- Per unit: what exists already (a grep on `references/classes.txt` and `components.json` is the start, `query_styles` / `query_components` the confirmation), which classes it creates, which existing classes it touches, which component it reuses.
- **Reuse before you build.** When the design shows a card, button, badge, label or list item that already exists as a component on the site, the plan names that component and the unit uses it. A near-match is a **variant** of the existing component, not a new one (see [componentize](../componentize/SKILL.md) §1). Building a second component that looks like one already there is a defect, not a shortcut — search `references/components.json` and `query_components` before the plan is written, and name in the plan what each repeated element resolves to.
- **Sections are reused first, too.** Before any section is built — and before any build agent is dispatched — map every design section to the section components the site already has. Per section, one row in the plan's reuse table: the existing component and **place** it as is, **extend** it with a visibility toggle (default off, so existing uses do not change) or a variant, or **new** with the reason nothing fits. Often a section already exists or only needs a hide/show prop or a variant (owner rule, Forest3 Home, Oct 2026: "we reuse as much as possible, that's a rule").
- **Every page section is the Lumos Section build-up** — wrapper div › Lumos `Section` › Background / Container slots with Lumos `Layout` and Typography — closed into a component with its own name ([lumos/components.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/components.md), "Section build-up"; rules in [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §3, §5, §10: Layout before Block, titles with a fixed level, swappable icons, `Nav` and `Footer` excepted). The plan names the Lumos pieces per section and any custom class it still needs, with the reason.
- **Every section's content inside a container** (`<name>_contain` + `u-container`), unless the owner says otherwise. When Figma bleeds media or content to the frame edge, the plan lists it as a question instead of imitating it with paddings ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §5).
- Every conflict found: Figma vs site, missing content, a design slip, a size off the scale. With a recommended resolution.
- The order and, when more than one unit, which units run in parallel.
- **Hover and focus states for every link, icon link and form field are part of the unit, even when the design draws none.** Reuse the site's existing language: text links are `Button Main` instances (add a size variant such as `Text Small` rather than styling a plain link), icon links get a matching motion ([buttons/motion.md](../buttons/motion.md) §6b), fields get a designed focus instead of the browser outline. List them in the plan; owners otherwise ask for them in the first feedback round.
- **Elements the design means to be interactive — tabs, sliders, accordions, toggles — are built working, in the same unit as the section.** They are not deferred: a tab row that does not switch is an unfinished section. Motion *on top* of a finished page (scroll reveals, entrances, small looping accents) is the separate pass in §5. Both follow the [interactions](../interactions/SKILL.md) skill.

Show the plan with its **In short** block and the questions first, the tables under them for whoever wants to check. One OK, questions bundled. *(house)* Do not wait for that OK when nothing in the plan is risky: carry on with the recommended answers in the same turn and let fresh reviewers check the result ([asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md), "Do what you recommend"). Naming is decided here and nowhere else: class names describe the **pattern** (`split-list`, `numbered-grid`), never the copy or the page they first appear on, so the copy can change without a class change.

## 2. Build

Per unit, two calls: all its classes in one `data_style_tool` call, its whole element tree in one `data_element_builder` call. Shapes and traps in [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md). Style rules in [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md), or the site's own system when `project.json` says so.

- One unit: build it in this session.
- Several units: one subagent per unit, launched with the Agent tool as `webflow-devkit:builder` (wait for the result), briefed with [subagent-brief.md](subagent-brief.md). The agent has the Data API tools (with `data_component_builder` for slots) plus Bash and Write for waiting out a 429 and writing `decisions/`; `element_snapshot_tool` and `designer_tool` are not available to it. This session keeps the Designer. Run them one after another until a parallel pair has been seen to work on this site (the guard's prompts inside a background agent are the unknown); note the outcome in `decisions/site.md`. **Never in parallel when two units edit components that share prop ids** (duplicates of the same Lumos original, e.g. two cards from `Card Primary`): parallel rebuilds scrambled prop names on Forest3.
- A subagent cannot ask mid-run. One that needs a name or a decision outside its plan stops and reports; this session decides, updates the plan, and dispatches it again.

Read back after every write. On a production site the guard hook prompts the user whenever an existing class is edited; a plan that names those classes keeps the prompts rare.

Lumos decides everything the site's own system does not, so where `project.json` names a custom system, Lumos still governs the rest. Every size is `rem`; `px` never appears.

**The design's spacing is the spec.** Every gap, padding and margin the design gives is built at that value — between cards, inside a card, between a heading and its text, above and below the section. Do not round to the nearest scale step, do not inherit a neighbour's value because it is close, and do not leave a distance out because the frame looks like it has none. Where a value falls between steps, use the design's literal `rem` and note it (see [lumos/spacing.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/spacing.md)). The exception is the **section shell** — rails, borders, corner marks and the section's outer spacing follow the neighbouring sections on the same page, because a cropped Figma frame does not draw them.

Every unit is built responsive from the first call, not on request: the layout changes through the site's responsive mechanism (`project.json`: Lumos responsive variables, or Webflow breakpoints when the site has none), checked at every screen size, with no text leaving its frame at any width.

**Responsive means the obvious thing first.** A row of cards becomes two columns, then one. A row of tabs wraps. Content reflows the way a reader expects. A horizontal scroller, a slider or a carousel is a **design decision**, used when the design draws one or when nothing else fits — never as the default answer to "this row is too wide". When in doubt, stack.

## 3. Verify

Per unit, in this session, following [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md): `designer_tool > switch_page` when the unit lives on another page, snapshot the element, compare with the target, run the pre-hand-over checklist, fix what you see, one change per correction, stop after two failed fixes on the same thing and present options.

**Then compare it against the design again, from scratch** (verify.md §2d), because fixing the first misses changes the section. A section compared only once is how missing pieces ship.

**The user's screenshot confirms a unit; it is not how defects get found.** The target is the closest possible match to the design, so check it yourself at the design's width and at every breakpoint before handing over. When the Designer is not connected, measure in a browser (verify.md §2b) — and when the change is not published yet, patch it into the published page in headless Chrome and measure that. Never ask the user to publish so you can check your own work. When none of those is possible the unit is **not done**: say so in one line, and do not move on to the next unit.

**Go through the section detail by detail, not as a whole** (verify.md §2c, Geometry). A section that looks right at a glance and is wrong in five small places is the normal failure here.

A unit is done when:
- it matches the target in structure, spacing, colour and text at the design's width, measured, not eyeballed;
- every gap and padding equals the design's value, not a rounded one;
- it holds at every breakpoint with no overflow, and the small-screen layout is the reflow a reader expects;
- its interactive parts work;
- it has been compared against the design a second time, after the fixes (verify.md §2d);
- the verify.md checklist is clean;
- every new class reads back with the properties the plan gave it.

## 4. Componentize the finished section

A section that is built, detailed, responsive and verified becomes a component before the next section starts — it does not wait for the whole page to be finished or approved. Smaller repeating parts inside it (cards, list items, rows, columns, steps) become their own components first, and the section holds them in a **slot** so they can be reused and reordered. Full rules, props and slot mechanics: [componentize](../componentize/SKILL.md).

## 5. When the page is done: motion

Once every section on the page is built and componentized, add motion as one pass over the page, following [interactions](../interactions/SKILL.md): scroll reveals on the sections and their children, and small accents on individual elements (an icon, a number, a rule, a badge). It matches what the rest of the site already does — read the site's existing reveal system from `decisions/site.md` and reuse it rather than inventing a second one. Subtle is the target: nothing makes the visitor wait, nothing looks empty.

Interactive behaviour the design implies (tabs, sliders, accordions) is **not** part of this pass — it was built with its section in §2.

## 6. Hand over

- Show the user what to look at, per unit, with the canvas width to check, and what you already measured (so they are not re-checking it). Then the polish loop: the user sends a screenshot and one sentence, you answer with one change and a `Was | Now | Target` line.
- Append to `references/log.md`: date, what was built, the units, debt left open. Lasting choices go to `decisions/`.
- **Designer-only steps** (heading levels in rich text, native "is set" conditions, variant props, folder order, slot Allowed components, page links, nested selectors, Collection List filters on the current item, making a bound Collection List a component): queue them while building and do them yourself in one Designer pass at hand-over, in the user's Chrome (Claude in Chrome, or `chrome-devtools` with autoConnect), with the recipes where they exist: [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11 "Queue, then one pass". Ask first only for something destructive or outward-facing (deleting, publishing). If Chrome is not connected, say so in one line. What is still left for the user goes at the end as literal numbered steps, each with the reason the API refused it.
- **When a task is finished, run a [review](../review/SKILL.md) before reporting done** — every task the user gave, not only whole pages: fresh agents that did not build it check every component touched, and their findings go into the hand-over. Never review in your own head instead (owner rule, Forest3, Oct 2026).
- File kit friction as issues, following [kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md): what the references got wrong, what was missing, what needed a workaround. Search before filing.
