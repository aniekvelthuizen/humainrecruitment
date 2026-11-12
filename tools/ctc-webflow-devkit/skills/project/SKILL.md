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

## 2. Ask the six questions

Call `data_sites_tool > list_sites` first so Q1 is a pick-list. The Webflow MCP login (OAuth) holds **one workspace**: when the site is not in the list, the client repo needs its own `.mcp.json` with a server named `webflow` (the guard expects that name) and an extra header (e.g. `X-Claude-Workspace: <client>`), so Claude Code stores a separate login for it; then `claude mcp login webflow` in that folder and the user picks the client's workspace.
Claude Code stores the login per server **name + config**, not per folder: two client folders whose `.mcp.json` has the same `webflow` name and the same URL share one login, and the last sign-in wins (a client folder was switched to another client's workspace that way, Nov 2026). Give **every** client folder a unique config, also when the account is the same: the header above, or a query on the URL (`https://mcp.webflow.com/mcp?project=<client>`). When `list_sites` shows another client's sites, check this first, not the user's login.

1. **Site** — which site from the list.
2. **Figma source** — `mcp` (a Figma URL the user can open) or `files` (exports, screenshots, specs the user drops into `references/figma/`).
3. **Class prefix** — the namespace for new classes on this site. Lumos itself has **no** prefix (`type_element` custom classes, `u-` utilities, `is-` combos; a fresh Lumos site has no `c-`), so the default is `""`. Some sites carry their own prefix — offer what the dump in step 4 will confirm.
4. **Production** — is this site live, with real visitors on its own domain? Recommend `false` while it is being built: no permission prompts. Flip it to `true` at launch; from then on the guard asks before changing anything that exists, in plain words ([guard.md](${CLAUDE_PLUGIN_ROOT}/references/guard.md)).
5. **Branching** — work on Webflow page branches? Recommend `false` (branching has a bug: reported Sept 2026; re-test before relying on branches). Keep it a one-line change in `project.json`.
6. **Shared library** — does this site install a library from another site, or is it the library for brand sites? Then fill `project.json` `library` as `{ "source": "<library site id>", "installers": ["<brand site id>", …] }` (site ids; leave it `null` when there is no library: the reminder hook then does nothing) and follow [library-sites.md](${CLAUDE_PLUGIN_ROOT}/references/library-sites.md): every Accept strips library classes from what the installing site owns. On an existing installing site, run its audit first.

## 3. Scaffold

Create, only where absent:

```
CLAUDE.md              from templates/CLAUDE.md, placeholders filled
.claude/settings.json  from templates/settings.json (registers this plugin for whoever clones the repo)
project.json           from templates/project.json
decisions/README.md    from templates/decisions-README.md
decisions/site.md      empty, with the heading
decisions/motion.md    "# Motion" and one line: "Kit defaults apply until this file says otherwise: references/motion.md in the webflow-devkit plugin."
decisions/components/  decisions/pages/
references/figma/      references/plans/  references/copy/  references/audit/
references/log.md      empty, with the heading
references/designer-queue.md  "# Designer queue" with empty "## Open" and "## Done" (format: designer/README.md "Queue, then one pass")
references/scripts/designer-chrome.sh  from templates/designer-chrome.sh, client and a free port filled in (designer/README.md "Which Chrome"); record the port in decisions/site.md ("Designer Chrome: port <n>"), where the script points
.mcp.json              add a server `chrome-<client>`: `npx -y chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:<port>`
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
