# Webflow DevKit

A Claude Code plugin for building and changing Webflow sites from Figma designs, screenshots, copy documents or a brief with no design. The plugin carries the process; each client gets its own small repo that carries the site-specific context.

```
plugin (this repo)                      client repo (one per client)
├── skills/project      set up/refresh   ├── CLAUDE.md          10 lines: which site, what to read
├── skills/build        the work loop    ├── project.json       the index: ids, flags, where things are
├── skills/componentize per finished section├── references/     dumps of pages, classes, variables, components
├── skills/interactions behaviour + motion
├── skills/buttons      button + icons + hover
├── skills/navigation   nav + menu panel + scroll
├── skills/cards        cards on the Lumos card
├── skills/review       fresh agents check the work
├── skills/feedback     ClickUp tickets until "new" is empty
├── references/         Lumos, Webflow + Figma MCP, verify│                      + figma/ plans/ log.md
│   └── fixture/        measure a pending change in Chrome│
└── hooks/              guard + staleness└── decisions/         what was decided, per site/component/page
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

Answers five questions (site, Figma source, class prefix, production, branching), dumps the site, writes the client repo. Commit it and push it to the org so colleagues clone it instead of re-creating it.

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

Build always shows a plan first (units of work, class names, existing classes it will touch) and waits for your OK. Then it builds, checks its own work against the design via Designer snapshots, and hands you the result for a screenshot-and-one-sentence polish loop.

The order per section is: build it to the design's spacing → make it responsive → make its interactive parts work → turn it into a component. Then the next section. When the whole page is done, one motion pass over it.

**Buttons**: "make the buttons like Figma", "add an icon switch to the button", "a nice hover on the buttons". The `buttons` skill inventories the looks the pages actually use (not every option in the style-guide set), reuses the site's button component with one Variant per look, builds an `Icon Set` component (every Figma icon as a variant, coloured by the text), and offers hover animations as a live demo to pick from.

**Navigation**: "build the nav from Figma", "the menu overlay", "hide the links on scroll", "the nav should change colour over dark sections". The `navigation` skill reads the nav's states and the Figma prototype (what changes when), rebuilds the Lumos `Nav` in place with one link source (`Menu`) and the site's button for every link, and moves it with Webflow Interactions (scroll fold, colour per `data-section`) — links slide away instead of shrinking, and hover never moves a neighbour.

**Cards**: "build the cards", "this card needs an image", "a Cards overview page". The `cards` skill first reuses the existing card that looks closest (plus a visibility toggle for what is missing); a genuinely new card starts as a duplicate of the Lumos `Card Primary`, every text is a Lumos Typography component, and props sit in folders (Variant → Content → Visual → parts → Link → Settings) with toggles, slots for repeated items and "show when filled" conditions.

**Behaviour and motion**: the `interactions` skill covers both. Tabs, sliders and accordions are built working as part of their section — a tab row that does not switch is an unfinished section. Scroll reveals and small accents come once the page is complete, matching the system the site already uses. Brisk defaults, first state visible in the Designer, timing verified in a browser, one value tuned at a time.

**Review**: "check what the agent built", "review the Program page", "is this done right?". The `review` skill sends a fresh `reviewer` agent per component — one that did not build it. It checks in a real browser and through the API whether the component works, is responsive, has logical spacing that matches the design, is Lumos-proof, carries no unneeded code and has tidy props. You get one short list in plain words (Broken → Off → Tidy → Your call); reply "fix all" or the numbers, and only those get fixed and re-checked.

**Feedback**: "work on the feedback", "do the ClickUp tickets", "there are new tickets". The `feedback` skill checks that ClickUp is logged in as you, finds the project's Feedback list (saved in `project.json`), reads every ticket in *new* with its screenshot, fixes them with parallel fixer agents grouped by component, publishes once, and has fresh reviewers check each fix live. A ticket that passes goes to *in review* with a comment; one that waits on files or someone else goes to *forwarded* with what it needs. It re-checks *new* after every round and stops only when it is empty.

**Components**: `componentize` runs as each section is finished, not at the end. It reuses what the site already has (a near-match becomes a variant, never a twin), breaks a section into its repeating parts, holds them in slots, and gives every component properties grouped into folders — except blocks meant to be edited centrally, like the nav, the footer and the home hero.

## Guardrails (hooks)

| Hook | What it does |
|---|---|
| SessionStart | Reports the age of the site dump (`dumpedAt` in `project.json`); nudges a refresh after 7 days |
| PreToolUse | On a production site (`"production": true`, also the fallback when `project.json` cannot be read), anything that changes something **existing** prompts you with the change: editing, renaming or removing a class; updating, renaming or deleting a variable; removing a prop or variant; replacing site custom code or scripts; removing elements, unregistering components, changing prop defaults and replacing page custom code. A site that is not live yet never prompts. Creating new things never prompts. |

The guard is off while a client's `project.json` says `"production": false`; set it to `true` at launch and the guard is back on. Branching is off by default (`"branching": false`) because of a known Webflow bug; flip it when that is fixed.

## Conventions the skills enforce

- **Follow what the site has.** Greenfield builds use [Lumos](references/lumos-rules.md). Existing sites keep their own system; the prefix and system are recorded in `project.json` by `/project`.
- **Lumos first, custom code last.** Custom CSS/JS only when Lumos and Webflow cannot do the job; never for layout or sizing, and never because the API refused a value. See [lumos-rules.md](references/lumos-rules.md) §0.
- **Sections are Lumos.** Every section is the Lumos Section build-up (wrapper › Lumos Section › Layout + Typography), closed into its own component. See [lumos/components.md](references/lumos/components.md).
- **Two calls per block.** All classes of a block in one `data_style_tool` call, the whole element tree in one `data_element_builder` call. See [webflow-mcp-bulk.md](references/webflow-mcp.md).
- **Plan, confirm, build, verify.** No mutation before the plan is confirmed. Every built unit is compared to its design before moving on.
- **Decisions are written down.** A conflict between Figma and the site, a naming choice, a place where the design was impossible: it goes in `decisions/`, in the file for the page or component it concerns.
- **Questions come in rounds**, numbered, each with a recommended answer. See [asking.md](references/asking.md).
- **Friction goes back to the kit.** At hand-over the build skill files GitHub issues on this repo for anything the references got wrong or missed. What qualifies is in [kit-issues.md](references/kit-issues.md). Read the `from-build` issues weekly; each one is a one-file fix.

## Developing the plugin

```
claude --plugin-dir /path/to/webflow-devkit     # loads this checkout instead of the installed version
```

Bump `version` in `.claude-plugin/plugin.json`, push to `main`. That is a release.

Keep it lean: a skill is steps and completion criteria; everything a skill only sometimes needs lives in `references/` behind a link. Anything that mentions a specific client does not belong here.

## Codex

Codex does not load `.claude-plugin/` or hooks. This repo also works as a Codex skill set: skills are exposed through `.agents/skills`, and `AGENTS.md` carries the guard and staleness rules as instructions instead of hooks. Register the Webflow and Figma MCP servers in `~/.codex/config.toml` yourself.
