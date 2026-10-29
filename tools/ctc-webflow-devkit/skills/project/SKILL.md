---
name: project
description: Set up or refresh a client repo for Webflow work. Use when starting on a new client site, when no project.json exists in the cwd, when the session-start message says project.json is stale, or when the user asks to "refresh the site context" or "index the site".
argument-hint: [client-name]
disable-model-invocation: true
---

# Project — set up or refresh the client repo

A client repo holds everything site-specific: `project.json` (the index), `references/` (dumps), `decisions/` (memory). The plugin holds the process. Nothing site-specific goes in the plugin; nothing procedural goes in the client repo.

Questions to the user follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Detect the mode

- `project.json` exists in the cwd → **refresh**: skip to step 4, ask nothing.
- Otherwise → **new**. Run `gh repo list Cut-the-Code-Agency --limit 200 --json name -q '.[].name | select(startswith("wf-"))'` and show any existing `wf-<client>` repos (`gh repo list` has no `--search`). If one matches this client, stop and tell the user to clone it instead of creating a second one.
  When that command fails (no `gh` login, no access to the organisation, offline), say so in one line, ask the user whether a repo for this client already exists, and continue with **new** on a no. Do not retry, do not stop the setup on it.

## 2. Ask the five questions

Call `data_sites_tool > list_sites` first so Q1 is a pick-list. The Webflow MCP login (OAuth) holds **one workspace**: when the site is not in the list, the client repo needs its own `.mcp.json` with a server named `webflow` (the guard expects that name) and an extra header (e.g. `X-Claude-Workspace: <client>`), so Claude Code stores a separate login for it; then `claude mcp login webflow` in that folder and the user picks the client's workspace.

1. **Site** — which site from the list.
2. **Figma source** — `mcp` (a Figma URL the user can open) or `files` (exports, screenshots, specs the user drops into `references/figma/`).
3. **Class prefix** — the namespace for new classes on this site. Lumos itself has **no** prefix (`type_element` custom classes, `u-` utilities, `is-` combos; a fresh Lumos site has no `c-`), so the default is `""`. Some sites carry their own prefix — offer what the dump in step 4 will confirm.
4. **Production** — does this site publish to a live domain? Recommend `true` unless the user says otherwise; it turns on the mutation guard. A site still in development can start at `false` (no prompts) and flip to `true` at launch.
5. **Branching** — work on Webflow page branches? Recommend `false` (branching has a known bug as of Sept 2026). Keep it a one-line change in `project.json`.

## 3. Scaffold

Create, only where absent:

```
CLAUDE.md              from templates/CLAUDE.md, placeholders filled
.claude/settings.json  from templates/settings.json (registers this plugin for whoever clones the repo)
project.json           from templates/project.json
decisions/README.md    from templates/decisions-README.md
decisions/site.md      empty, with the heading
decisions/components/  decisions/pages/
references/figma/      references/plans/
references/log.md      empty, with the heading
references/designer-queue.md  "# Designer queue" with empty "## Open" and "## Done" (format: webflow-mcp.md §11)
.gitignore             with `.tmp/` (scratch: the Designer recipes are copied there to load them) and `.env` / `**/.env` (`webflow auth login` writes one)
```

## 4. Dump the site

Every dump is an index, not a mirror: names and ids, so later work knows what exists and where to look. Properties and element trees are fetched live when needed.

| File | Tool | Keep |
|---|---|---|
| `references/pages.json` | `data_pages_tool > list_pages` | id, name, slug, parent folder, isDraft |
| `references/classes.txt` | `data_style_tool > get_styles` (`query: all`, no properties) | one name per line; combo classes as `parent > child` |
| `references/variables.json` | `data_variable_tool > get_variable_collections` + `get_variables` | everything (it is small) |
| `references/components.json` | `data_component_tool > get_all_components` with props, variants, instance counts | id, name, group, props, slots, variants, instanceCount |
| `references/fonts.json` | `data_fonts_tool` | everything |
| `references/cms.json` | `data_cms_tool > get_collection_list` | id, name, slug per collection |

Then fill `project.json`:

- `site.stagingDomain` from `data_sites_tool > get_site` (null when absent).
- `css.system`: `lumos` when `classes.txt` has `u-` utilities and `variables.json` has Lumos-style collections; otherwise `custom` and write the observed prefix pattern in `css.notes`. Follow what the site has; Lumos is the strong preference only on greenfield.
- `dumpedAt`: now, ISO 8601.

Also run `data_agent_instructions_tool > search_instructions` for the site. If Webflow holds instructions, summarise them into `decisions/site.md` as the starting point.

## 5. Done when

- Every file in the layout exists.
- `project.json` has no placeholder values left.
- `classes.txt`, `pages.json`, `components.json` are non-empty for an existing site.

Report the counts (pages, classes, components) and, for a new repo, suggest `git init && git add -A && git commit -m "Set up <client>"`.
