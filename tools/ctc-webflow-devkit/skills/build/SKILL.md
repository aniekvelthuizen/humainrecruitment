---
name: build
description: Build or change something on a Webflow site and verify it against its source. Use when the user gives a Figma URL or frame to build, asks to change, fix or restyle something on the site (often with a screenshot), asks to put final copy from a document onto a page, or asks for a new section or page "in the style of the site" with no design, or asks to prepare a site for a Figma design (fill in Lumos, variables, themes, fonts, type scale). Requires a client repo (project.json in the cwd); otherwise run the project skill first.
---

# Build — plan, confirm, build, verify

One loop for every job: know the target, know what exists, plan, build in bulk, verify against the target, componentize the finished section, hand over; when the page is complete, one motion pass. The source decides the first step only:

| Source | First step |
|---|---|
| Figma URL or frames | [figma.md](figma.md): dump and index the design |
| A sentence, usually with a screenshot | [change.md](change.md): diagnose read-only |
| A copy document (PDF, doc, text) | [copy.md](copy.md): extract to a file first |
| A brief, no design ("a FAQ under pricing", "a page like /customers") | [brief.md](brief.md): pick the exemplar on the site |
| The Figma design system, before any section: variables, themes, fonts, type scale | [foundations.md](foundations.md): map Figma to Lumos, write, set the fluid `clamp()`s in the Variables panel, verify by script |

Plugin root: `${CLAUDE_PLUGIN_ROOT}` (pass it to subagents as-is).

Read first: the latest Webflow changes (https://webflow.com/updates and https://developers.webflow.com/home/changelog; `curl -sL -A "Mozilla/5.0"` when a fetcher is refused) — a new feature can replace a workaround or a hand-over step — then `project.json`, `decisions/site.md` and the `decisions/` files for the pages and components involved. No `project.json`: stop and point to the project skill. Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Plan

Write `references/plans/<yyyy-mm-dd>-<name>.md` from [plan-template.md](plan-template.md). It names:

- The **units** of work: a section, a page or a component, each buildable and checkable on its own.
- Per unit: what exists (grep `references/classes.txt` and `components.json`, confirm with `query_styles` / `query_components`), the classes it creates, the existing classes it touches, the component it reuses.
- **The Reuse table, before any unit is planned as new**: every design section and every repeated element (card, button, badge, list item) mapped to what the site has — place, extend (visibility toggle or variant) or new with the reason. The rule: [componentize](../componentize/SKILL.md) §0.
- **Every new section is built flat** and closed into its own component: [lumos/components.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/components.md), "Section build"; [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §3, §5, §10. Existing Section build-ups stay. The plan names per section its classes and the small components it reuses.
- **Every section's content inside a container** (`<name>_contain` + `u-container`) unless the owner says otherwise. Media or content that Figma bleeds to the frame edge is a plan question, not padding imitation ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §5).
- Every conflict (Figma vs site, missing content, a design slip, a size off the scale) with a recommended resolution.
- The order and which units run in parallel.
- **Accessibility is part of the unit** ([accessibility](../accessibility/SKILL.md) §1): keyboard reachable, Escape closes what opens, names on icon controls, alt or Decorative on images, closed panels take no focus.
- **SEO is part of the unit** ([seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md)): which block holds the page's `h1`, no headings in overview cards, the hero image Eager and the rest lazy, crawlable nav links, the JSON-LD a FAQ section or article template carries.
- **Hover and focus for every link, icon link and form field**, even when the design draws none, in the site's existing language: text links are `Button Main` instances (add a size variant such as `Text Small` rather than styling a plain link), icon links a matching motion ([buttons/motion.md](../buttons/motion.md) §6b), fields a designed focus instead of the browser outline. Owners otherwise ask for them in the first feedback round.
- **Blocks between the paragraphs of a rich text** (a quote, a donate or CTA card in an article) are Components in rich text the editor places, never fixed places around the text: [lumos/components.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/components.md) "Blocks between paragraphs".
- **Interactive elements the design implies (tabs, sliders, accordions, toggles) are built working in the same unit** — a tab row that does not switch is an unfinished section. Motion on top of a finished page is §5. Both: [interactions](../interactions/SKILL.md).

Show the plan with its **In short** block and the questions first, tables below. *(house)* Wait for an OK only when something is risky; otherwise carry on with the recommended answers in the same turn ([asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md), "Do what you recommend"). Naming is decided here only: class names describe the **pattern** (`split-list`, `numbered-grid`), never the copy or the page, so copy can change without a class change.

## 2. Build

Per unit, two calls (all classes, then the whole tree): [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md). Style rules: [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md), or the site's own system when `project.json` says so; Lumos still decides everything that system does not. Every size is `rem`, never `px`.

- One unit: build it in this session.
- Several units: one `webflow-devkit:builder` agent per unit (Agent tool, wait for the result), briefed with [subagent-brief.md](subagent-brief.md). It has the Data API tools plus Bash and Write (for waiting out a 429 and writing `decisions/`), not `element_snapshot_tool` or `designer_tool`; this session keeps the Designer. Run them one after another until a parallel pair has been seen to work on this site (the guard's prompts inside a background agent are the unknown); note the outcome in `decisions/site.md`.
- **Never in parallel when two units edit components that share prop ids** (duplicates of the same Lumos original, e.g. two cards from `Card Primary`): parallel rebuilds scrambled prop names (Oct 2026).
- A subagent cannot ask mid-run. One that needs a name or decision outside its plan stops and reports; this session decides, updates the plan, dispatches again.

Read back after every write. On a live site the guard prompts on every change to something existing; ask **Zeker weten?** in the chat first with what it reaches ([guard.md](${CLAUDE_PLUGIN_ROOT}/references/guard.md)); a plan that names those classes keeps it to one question.

**The design's spacing is the spec.** Every gap, padding and margin at the design's value — no rounding to the nearest scale step, no borrowing a neighbour's close value, no leaving out a distance because the frame seems to have none. Between steps: the literal `rem`, noted ([lumos/spacing.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/spacing.md)). Exception: the **section shell** (rails, borders, corner marks, outer spacing) follows the neighbouring sections on the same page, because a cropped Figma frame does not draw it.

**Responsive from the first call**, through the site's mechanism (`project.json`: Lumos responsive variables, or Webflow breakpoints), no text leaving its frame at any width. The obvious reflow first: a card row goes 2 columns, then 1; tabs wrap. A horizontal scroller, slider or carousel is a design decision (the design draws one, or nothing else fits), never the default for "too wide". When in doubt, stack.

## 3. Verify

Per unit, in this session, following [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md): `designer_tool > switch_page` when needed, snapshot, compare with the target, run the checklist, one change per correction, stop after two failed fixes on the same thing and present options. Go detail by detail (§2c, Geometry): five small misses in a section that looks right is the normal failure. Then **compare again from scratch** (§2d), because fixing changes the section.

Find defects yourself; the user's screenshot only confirms. No Designer: measure in a browser (§2b); not published yet: patch the change into the published page in headless Chrome. Never ask the user to publish so you can check. When none of that is possible, the unit is **not done**: say so in one line and do not move on.

A unit is done when:
- it matches the target in structure, spacing, colour and text at the design's width, measured;
- every gap and padding equals the design's value, not a rounded one;
- it holds at every breakpoint with no overflow, with the reflow a reader expects;
- its interactive parts work;
- it was compared a second time after the fixes (§2d);
- the verify.md checklist is clean;
- every new class reads back with the properties the plan gave it;
- the SEO block check is clean (`seo-audit.mjs <url> --block "<root>"`, [seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md) "The check per block").

## 4. Componentize the finished section

Built, detailed, responsive and verified → a component before the next section starts, not after the page. Its repeating parts become components first, held in a slot: [componentize](../componentize/SKILL.md).

## 5. When the page is done: motion

One pass over the page following [interactions](../interactions/SKILL.md): scroll reveals on sections and their children, small accents (an icon, a number, a rule, a badge). Reuse the reveal system the site already has (`decisions/site.md`), never a second one. Subtle: nothing makes the visitor wait, nothing looks empty. Tabs, sliders and accordions are not part of this pass (§1).

## 6. Hand over

- Per unit: what to look at, at which canvas width, and what you already measured. Then the polish loop: a screenshot and one sentence from the user, one change and a `Was | Now | Target` line from you.
- Append to `references/log.md`: date, what was built, the units, debt left open. Lasting choices go to `decisions/`.
- **Designer-only steps** (heading levels in rich text, "is set" conditions, variant props, folder order, slot Allowed components, page links, nested selectors, Collection List filters on the current item, making a bound Collection List a component, CMS field settings such as single line and max length): queue them while building, do them yourself in one pass at hand-over — [designer/README.md](${CLAUDE_PLUGIN_ROOT}/references/designer/README.md) "Queue, then one pass". Ask first only for something destructive or outward-facing (deleting, publishing). Chrome not connected: say so in one line.
- **A new page or CMS template gets its SEO in the same task**, and a finished page the final SEO audit ([seo](../seo/SKILL.md) §6–7).
- **Shared library** (`project.json` `library`): `data-display` on site-owned elements that need `contents`/`none`, and the before/after `accept-check` every library round ([library-sites.md](${CLAUDE_PLUGIN_ROOT}/references/library-sites.md)).
- **Run a [review](../review/SKILL.md) before reporting done** — for every task, not only whole pages: fresh agents check every component touched, findings go in the hand-over. Never review in your own head instead (owner rule, Oct 2026).
- File kit friction as issues ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)). Search before filing.
