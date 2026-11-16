# Webflow DevKit

A Claude Code plugin for building and changing Webflow sites from Figma designs, screenshots, copy documents or a brief with no design. The plugin carries the process; each client gets its own small repo that carries the site-specific context.

```
plugin (this repo)
├── skills/project      set up/refresh
├── skills/build        the work loop
├── skills/componentize per finished section
├── skills/interactions behaviour + motion
├── skills/buttons      button + icons + hover
├── skills/navigation   nav + menu panel + scroll
├── skills/cards        cards on the Lumos card
├── skills/review       fresh agents check the work
├── skills/feedback     ClickUp tickets until "new" is empty
├── skills/seo          titles, descriptions, share images, noindex, SEO audit
├── skills/accessibility WCAG 2.2 AA: build rules + axe/keyboard check
├── references/         Lumos, Webflow + Figma MCP, verify
│   └── fixture/        measure a pending change in Chrome
└── hooks/              guard, staleness, library-site reminder

client repo (one per client)
├── CLAUDE.md           10 lines: which site, what to read
├── project.json        the index: ids, flags, where things are
├── references/         dumps of pages, classes, variables, components
│                       + figma/ plans/ log.md
└── decisions/          what was decided, per site/component/page
```

## Requirements

- Claude Code with the **Webflow MCP** and **Figma MCP** connected (`claude mcp add --transport http webflow https://mcp.webflow.com/mcp` and `claude mcp add --transport http figma https://mcp.figma.com/mcp`). The plugin does not ship them: a bundled server would get a scoped name and bypass the guard. The claude.ai Webflow connector (`claude_ai_Webflow`) is covered too.
- The **Webflow Designer open** on the site while you work. Visual checks run through the Designer bridge.
- `gh` (GitHub CLI) logged in, so `/project` can see which client repos already exist.

## Install

```
claude plugin marketplace add Cut-the-Code-Agency/ctc-webflow-devkit
claude plugin install webflow-devkit@ctc
```

Updates follow `main` and are pulled automatically at session start (SSH remote; over HTTPS run `claude plugin update webflow-devkit@ctc`). Client repos scaffolded by `/project` register the marketplace themselves via `.claude/settings.json`. Run `claude plugin validate .` before pushing.

## Daily use

**New client**

```
mkdir wf-<client> && cd wf-<client>
claude
> /webflow-devkit:project
```

Answers six questions (site, Figma source, class prefix, production, branching, shared library), dumps the site, writes the client repo. Commit it and push it to the org so colleagues clone it instead of re-creating it.

**Existing client**

```
git clone Cut-the-Code-Agency/wf-<client> && cd wf-<client>
claude
```

The session-start hook tells you how old the dumps are. Run `/webflow-devkit:project` again to refresh; it asks nothing the second time.

**Then just say what you want.** The `build` skill triggers on its own:

- "Build this page: <figma url>"
- "Build the hero and pricing sections from <figma url> on the /pricing page"
- "The CTA is too small on mobile" + a screenshot
- "Put the final copy from this PDF on the page"
- "Add a FAQ under the pricing table, in the style of the site" (no design: the closest existing section is the reference)

Build shows a plan first, waits for your OK only when something in it is risky, builds, checks its own work against the design, and hands you the result for a screenshot-and-one-sentence polish loop. Per section: build to the design's spacing → responsive → interactive parts working → component. When the page is done, one motion pass.

## The other skills

| Skill | Say | What it does |
|---|---|---|
| `componentize` | runs per finished section | Reuses what exists, breaks a section into parts held in slots, props in folders. Rules: [componentize](skills/componentize/SKILL.md) |
| `cards` | "build the cards", "this card needs an image" | Cards in the Lumos `Card Primary`, reuse by look, Typography texts |
| `buttons` | "make the buttons like Figma", "a nice hover" | One button component with a Variant per look the pages use, an `Icon Set`, hover offered as a live demo |
| `navigation` | "build the nav", "the menu overlay", "hide links on scroll" | Rebuilds the Lumos `Nav` in place, moves it with Webflow Interactions |
| `interactions` | "make it move", "reveal on scroll" | Working tabs/sliders/accordions with their section; reveals once the page is complete. Motion tokens and order of mechanisms: [motion.md](references/motion.md) |
| `review` | "check what the agent built", "is this done right?" | A fresh `reviewer` agent per component; one plain list (Broken → Off → Tidy → Your call), fixed and re-checked |
| `feedback` | "work on the feedback", "do the ClickUp tickets" | Every ticket in *new* fixed, published, re-checked live, moved to *in review* or *forwarded* |
| `seo` | new page or CMS template, "SEO check" | Title, description, share image, noindex; final SEO audit of the published site (structure, robots, headings, meta, media, links, performance, structured data) |
| `accessibility` | "is this accessible", "WCAG", "check the focus states" | WCAG 2.2 AA rules for Webflow and Lumos; axe-core plus a keyboard walk on published pages, then the hand checks a tool cannot do |

## Guardrails (hooks)

| Hook | What it does |
|---|---|
| SessionStart | Reports the age of the site dump (`dumpedAt` in `project.json`); nudges a refresh after 7 days |
| PreToolUse | On a live site (`"production": true`, also the fallback when `project.json` cannot be read), anything that changes something **existing** prompts you, in plain Dutch: what changes, where you see it, that visitors see it only after Publish, how to undo it. That covers editing, renaming or removing a class; updating, renaming or deleting a variable; removing a prop or variant; replacing site custom code or scripts; removing elements, unregistering components, changing prop defaults and replacing page custom code. Claude asks **Zeker weten?** in the chat first, with what it reaches ([guard.md](references/guard.md)). A site that is still being built never prompts. Creating new things never prompts. |
| PostToolUse | On a site that installs a Shared Library (`"library"` in `project.json`), after setting classes or creating a CMS list, slot or page slot: reminds Claude that every library Accept strips library classes from the site's own elements, so hide/`contents` needs a `data-display` attribute and real styling belongs in a library component ([library-sites.md](references/library-sites.md)). Never blocks. |

A new client repo starts at `"production": false`: no prompts while the site is being built. Set it to `true` at launch and the guard is on. Branching is off by default (`"branching": false`) because of a Webflow bug (reported Sept 2026; re-test before relying on branches).

## Where the rules live

- Follow what the site has; greenfield is [Lumos](references/lumos-rules.md), custom code last (§0). Sections are flat Lumos: [lumos/components.md](references/lumos/components.md).
- Webflow API shapes and traps (two calls per block): [webflow-mcp.md](references/webflow-mcp.md). The Designer (own Chrome, queue, recipes): [designer/README.md](references/designer/README.md).
- Plan, build, verify: [build](skills/build/SKILL.md), [verify.md](references/verify.md). Questions in numbered rounds with a recommended answer: [asking.md](references/asking.md).
- Reuse, props, slots, CMS lists: [componentize](skills/componentize/SKILL.md).
- Decisions go in the client's `decisions/`, per page or component.
- **Friction goes back to the kit**: at hand-over the build skill files GitHub issues on this repo ([kit-issues.md](references/kit-issues.md)). Read the `from-build` issues weekly; each one is a one-file fix.

## Developing the plugin

```
claude --plugin-dir /path/to/webflow-devkit     # loads this checkout instead of the installed version
```

Bump `version` in `.claude-plugin/plugin.json`, push to `main`. That is a release.

Keep it lean: a skill is steps and completion criteria; everything a skill only sometimes needs lives in `references/` behind a link. One rule, one home: elsewhere one sentence and a link. Anything that mentions a specific client does not belong here.

## Codex

Codex does not load `.claude-plugin/` or hooks. This repo also works as a Codex skill set: skills are exposed through `.agents/skills`, and `AGENTS.md` carries the guard and staleness rules as instructions instead of hooks. Register the Webflow and Figma MCP servers in `~/.codex/config.toml` yourself.
