# Webflow DevKit — Codex notes

Same plugin as `.claude-plugin/`; Codex loads the skills via `.agents/skills` (symlink to `skills/`).
Wherever a skill says `${CLAUDE_PLUGIN_ROOT}`, read it as this repo's root.

## MCP
Register the Webflow and Figma MCP servers in `~/.codex/config.toml` under `[mcp_servers.webflow]` / `[mcp_servers.figma]`. The plugin does not ship them.

## Guard (replaces hooks/guard.py, which Codex cannot run)
At the start of every session, before anything else, tell the user in plain words: this plugin can change their Webflow site; here there is no automatic guard, only this instruction to stop and ask before changing anything that already exists; nothing goes live until they press Publish in Webflow; Webflow keeps site backups.

When `project.json` has `"production": true` (or cannot be read), stop before any Webflow MCP call that does one of these and show the exact change; proceed only after an explicit OK:
- `update_style`, `rename_style`, `remove_style` on a style that already exists; `update_*_variable`, `rename_variable`, `delete_variable`; `remove_prop`, `delete_variant`; `set_site_freeform_code`, `set_site_scripts`, `clear_site_scripts`, `delete_registered_script`.
- `remove_element`, `unregister_component`, `update_prop`, `set_page_freeform_code`, `set_page_scripts`, `clear_page_scripts`.
A site that is not live yet (`"production": false`) needs no confirmation. Creating new styles, elements, variables, props and variants never does.

## Before building
Read the latest Webflow changes before a build or change task: https://webflow.com/updates and https://developers.webflow.com/home/changelog. New API or Designer features can remove a workaround or a hand-over step. (`webflow.com/updates` refuses some fetchers; `curl -sL -A "Mozilla/5.0"` works.)

## Staleness (replaces hooks/session-start.sh)
At session start in a client repo: if `dumpedAt` in `project.json` is older than 7 days (or missing), offer to run the `project` skill before building.
