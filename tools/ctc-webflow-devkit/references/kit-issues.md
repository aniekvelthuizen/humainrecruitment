# Feeding back into the kit

The kit improves from what goes wrong in builds. Friction is filed as a GitHub issue on the plugin repo, by the skill, at hand-over.

## Files an issue

- An MCP call refused something the references said would work, or accepted something the references said would fail.
- A rule in `references/` or `lumos/` turned out wrong or incomplete for this site.
- A reference or example was missing: you had to work something out that the next build will hit too.
- A workaround was needed (an embed, a manual Designer step, a pseudo instead of a trigger).
- A hook prompted or blocked when it should not have, or stayed silent when it should have prompted.

## Does not file an issue

- Client-specific choices (those go to `decisions/`).
- Debt left open on this build (that goes to `references/log.md`).
- Design slips in the Figma file.
- Anything already filed: search first.

## How

```
gh issue list -R Cut-the-Code-Agency/ctc-webflow-devkit --search "<key words>" --state all
gh issue create -R Cut-the-Code-Agency/ctc-webflow-devkit --label from-build \
  --title "<tool or file>: <one line>" \
  --body "Site: <client> — <site.name> (from project.json). Filed by: $(gh api user -q .login).

<what was expected, what happened, the exact call or rule, what worked instead>"
```

**Who it comes from is always visible.** GitHub shows the issue's author (the account `gh` is logged in with); the first line of the body names the client and site from `project.json`, so the kit maintainers see which site hit it without opening the client repo. Clients working with the kit file issues under their own account, the same way.

**Fallback when `gh` cannot reach the repo** (not logged in, no access, offline): do not retry and do not skip the feedback. Append the same title and body to `references/kit-issues.md` in the client repo, under a `## Unfiled` heading with the date, and say at hand-over in one line that N issues are waiting there and how to get access (`gh auth login`, or ask CTC for an invitation to the repo).

One issue per distinct thing. Title starts with the tool or file it concerns (`data_style_tool: …`, `lumos/grid.md: …`, `guard.py: …`). The body carries the payload or the sentence that was wrong, so the fix is a one-file edit.
