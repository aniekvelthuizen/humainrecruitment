# Changing the kit

The kit stays light: every rule lives in one place, says one thing, and is true for every client. Builds teach us a lot; this page is how a lesson gets in without the kit turning into a pile.

**Maintainer: Aniek Velthuizen** (`@aniek-velthuizen`). Every pull request goes past her (`.github/CODEOWNERS`). Nobody merges a kit change without her review.

## The flow

1. **During a build: file, don't edit.** Something in the kit was wrong, missing or contradicted by what you measured → a GitHub issue with label `from-build` ([references/kit-issues.md](references/kit-issues.md) has the command). Keep building; the issue is enough.
2. **The maintainer folds lessons in**, in batches, with the repo's `kit-lesson` skill (`.claude/skills/kit-lesson/`, available when Claude Code runs in this repo). One pull request per batch.
3. **Urgent fix** (a rule that breaks builds today): a pull request is fine, small, and it still goes past the maintainer.

## Rules for every change

- **One rule, one home.** Search first (`grep -rn "<key words>" skills references`). If the rule exists, edit it there. Elsewhere at most one sentence and a link. Never a second version in other words.
- **Where things live**
  - `references/` — the rules: what is true about Lumos, the Webflow MCP, Figma, motion, verifying, asking. `references/motion.md` for anything that moves, `references/webflow-mcp.md` for API behaviour, `references/designer/README.md` for the Designer, `references/library-sites.md` for Shared Libraries.
  - `skills/<name>/` — the steps of one job; links to the rules instead of restating them.
  - Client repos (`decisions/`, `references/log.md`) — anything that is true for one client only.
- **Newer and measured wins.** If your lesson contradicts a rule, replace the rule and say in the PR which sentence it replaces and why (the measurement).
- **Compact.** A trap is one line: *what goes wrong → what works*, with the exact tool, parameter, error text or number. No story, no "we found that".
- **No client names in rules.** Use a generic example. Provenance is a short tail: `(Oct 2026)`. Measurements that prove a rule may stay, without the client.
- **Section numbers are links.** If you renumber a file's sections, update every `file.md §N` that points at it (`node scripts/check-kit.mjs` finds them).
- **Bump the version** in `.claude-plugin/plugin.json` with every change to `skills/`, `references/`, `agents/` or `hooks/` (minor for new behaviour, patch for wording).

## Before you open the pull request

```
node scripts/check-kit.mjs
```

It fails on dead links, section references that point at nothing, and a missing version bump; it warns about client names, sentences that appear in more than one file, and how much the kit grew. Fix the failures; explain the warnings in the PR if they stay.
