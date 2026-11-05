# Agent brief — rest-of-site build (2026-11-05)

For every builder, composer and reviewer in `references/plans/2026-11-05-rest-of-site.md`. Your prompt names your unit. Work done for Aniek Velthuizen, with Claude.

## Read, in order, and no more than this

1. `project.json`, `decisions/site.md`, `decisions/motion.md`.
2. The plan: your unit's row, Reuse, Conflicts.
3. Builder: `tools/ctc-webflow-devkit/agents/builder.md`. Reviewer: `tools/ctc-webflow-devkit/agents/reviewer.md`, `skills/review/checks.md`, `skills/review/report.md`.
4. `tools/ctc-webflow-devkit/references/webflow-mcp.md`, `lumos-rules.md`, `lumos/components.md`.
5. Your Figma files (below) and `decisions/components/<name>.md` for the components your unit names. `decisions/components/cards.md` is 86 KB: grep it for the card you use, do not read it whole.

Plugin root: `tools/ctc-webflow-devkit`.

## Connector

Only the claude.ai Webflow connector reaches this site. Load its tools with ToolSearch: `mcp__846065a5-9856-4ca3-a702-f70371370f30__*`. The local `mcp__webflow__*` tools answer 404. Call its `webflow_guide_tool` once with `session_id: "start"` and your own `agent_id`. Its output is about 100 KB and lands in a file: take the `ses_…` id from the start of that file with grep, and read only what you need from it. Site id `6ae35364a38b2d71cab8c607`. Component and class indexes: `references/components.json`, `references/classes.txt` (refreshed 2026-11-05; confirm with a live query).

A 429: wait and repeat. A server error twice in a row on the same call: stop and report.

## Figma

Do not open Figma. Everything is exported to `references/figma/rest-of-site/`:

- `<unit>/tree.txt`: every layer with size, spacing, variables, text. `<unit>/*.png`: pictures. `<unit>/instances.txt`: where it is used.
- `pages/<nn-page>/index.txt`, `section-NN.txt` (the copy and images of that block on that page), `section-NN.png`. `m01`, `m12`, `m13` are the mobile frames.
- `assets/<hash>.png|jpg`: original images, named in the trees. `assets/icons/*.svg`: icons.

Something is not in the export: report it, do not guess.

## Images

Reuse an asset the site already has when it is the same picture (`data_assets_tool`). Photos without transparency: convert first, `sips -s format jpeg -s formatOptions 80 -Z <2× display width> in.png --out out.jpg`. Keep PNG only for transparency. Never upload a file above 500 KB without saying so in your report. Alt text is required, from the content.

## Rules that beat the kit's defaults for this run

- **Names.** The plan fixes your component name and class root. Element classes follow `<root>_<element>`, no prefix, describing the pattern. Anything beyond that: stop and report. This replaces "create only the classes your unit lists".
- **You own only what your unit names.** Edit no other component, class or page. No edits on `u-` utilities or the global `.u-rich-text` rules. Never `duplicate_variant`; use `create_variant` and set only its own styles.
- **Do not publish.** Do not open the Designer. Do not touch `references/log.md`, `decisions/site.md`, `CLAUDE.md`, `project.json`, or git.
- **Designer steps.** Anything the API refuses is listed in your report with exactly what must be clicked. No custom-code workaround.
- **Placement.** Put your block on the test page your unit names, at the end of `page_main`, nowhere else.
- **Design values are the spec,** in rem, through variables. Section shell per the rules in the build skill §2. Build responsive from the first call; no text out of its frame at any width; hover and focus on every link and field; interactive parts work.
- **Motion.** Calm. No scroll reveals. Page headers carry `data-hero-reveal` per `decisions/motion.md`. Other animation comes in a later pass.
- **Forms.** Never submit a real form.
- **Decisions.** Write what you chose and why in `decisions/components/<name>.md`, one short entry, "Aniek Velthuizen, via Claude". A deviation from the design is not yours to decide: list it in your report.
- **A decision the plan does not give, or two failed fixes on one thing:** stop and report.

## Your final report (plain text, short)

- Done: component id, name, variants, props, slots; page and element id where placed.
- Classes created. Assets uploaded.
- Read back: what you checked.
- Designer steps (exact clicks).
- Deviations and open questions.
- Not done, and why.
