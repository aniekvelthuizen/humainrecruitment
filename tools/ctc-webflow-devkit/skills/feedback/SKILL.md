---
name: feedback
description: Work through the client's feedback tickets in ClickUp until the "new" column is empty — check that ClickUp is logged in as the user, find the project's Feedback list, read every new ticket with its screenshot, fix it on the Webflow site with fixer agents, publish, have fresh reviewers check it live, and set each ticket that passes to "in review" with a comment. Use whenever the user says "work on the feedback", "do the ClickUp tickets", "empty the new column", "the Feedback board", "Marker.io tickets", "there are new tickets", or pastes a ClickUp board link with feedback. Requires a client repo (project.json); otherwise run the project skill first.
---

# Feedback — ClickUp tickets until "new" is empty

Every ticket in the project's Feedback list that sits in **new** is fixed on the site, checked live by a reviewer that did not fix it, and moved to **in review** with a comment. A ticket that cannot be fixed now leaves **new** too, with a comment that says what it waits for. Tickets keep arriving while you work: the job ends when the column is empty, not when the first batch is done.

Read first: `project.json`, `decisions/site.md`, `references/log.md`, `references/designer-queue.md`. When `project.json` is missing, stop and point to the project skill. Fixing follows the [build](../build/SKILL.md) rules, checking follows [review](../review/SKILL.md), questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. ClickUp, as the user

- Load the ClickUp tools (`ToolSearch` "clickup"). Several servers may be connected (`clickup-local`, `claude_ai_ClickUp`, …): use the one the user signed into themselves.
- Find out who it is: `clickup_resolve_assignees` with `["me"]`, then match the id in `clickup_get_workspace_members`. Say it in one line: "ClickUp sees you as <name> (<email>)."
- Wrong person, or no ClickUp server: stop and give the steps, because comments and status changes show under that name.
  1. `claude mcp add --scope user --transport http clickup-local https://mcp.clickup.com/mcp`
  2. Type `/mcp`, pick **clickup-local**, **Authenticate**, log in with your own ClickUp account, **Allow**.
  3. Say "done"; the check runs again.

## 2. The Feedback list

- `project.json` → `clickup.feedbackListId` when it is there.
- Otherwise find it: the client's folder (`clickup_search` on the client name, or `clickup_get_workspace_hierarchy`), the list named like *Feedback*. A board link from the user carries the list id (`/li/<id>`). Read its statuses with `clickup_get_list`.
- Map three statuses: **open** (`new`), **fixed** (`in review`), **waiting on someone else** (`forwarded`). Different names: pick the closest, say them in one line, carry on.
- Write it to `project.json` so the next run asks nothing:
  `"clickup": { "folderId": "…", "feedbackListId": "…", "statuses": { "open": "new", "fixed": "in review", "waiting": "forwarded" } }`

## 3. Read the new tickets

- `clickup_filter_tasks` with `list_ids: [<list>]`, `statuses: ["new"]`. Count them and say the number.
- Per ticket: `clickup_get_task` with description, attachments and comments. Marker.io tickets carry the page URL, browser, window width and pixel ratio in the description, and the screenshot with the red marker as an attachment. A ticket that came **back** to new: read its latest comments first, it is a fix the reporter rejected.
- Many tickets: one general-purpose agent downloads every screenshot (`clickup_download_task_attachment`) into `<scratchpad>/feedback/<taskid>-<n>.<ext>`, read-only on ClickUp. Write `<scratchpad>/feedback/index-<round>.md`: per ticket the custom id (FOR-12), task id, page, reporter's width, the ask in one line, the screenshot file.
- The scratchpad is emptied when the session restarts: the plan file (§5) carries the index's content, and after a restart the same download brief refills the same paths. Resumed fixers are told that their evidence folder is gone.
- Look at every screenshot yourself before sorting. The marker shows *which* element; the text is often three words.

## 4. Sort

| Kind | What happens |
|---|---|
| Defect or change request | Fixed in this round. |
| Question | Answered in a comment with the facts (the rule, the script, the decision file), then **fixed** status. |
| Needs a file, text or decision from someone else | **waiting** status, with a comment naming exactly what is needed and from whom. |
| Needs the user's OK (risky, see asking.md) | Asked in one numbered round with a recommendation; the ticket stays in new until answered. |
| Same as another ticket | Fixed once; both get the comment. |

**Never call a visual ticket a capture glitch, "not reproducible" or "waiting for assets" before you measured the live element against Figma at the reporter's width** — size, proportions, crop, position. Only a match after that comparison is "not reproducible", and the comment says what was compared. (Forest3, Oct 2026: two "squished image" tickets were forwarded as glitches; the images really were squished.)

## 5. Plan and fix

- Write `references/plans/<yyyy-mm-dd>-feedback.md` (add a section per later round): the rules every fixer follows, then units **by component ownership**, each naming the components it owns and its tickets (custom id, task id, page, the ask). Say the units in one line and start; fixing reported defects needs no OK, risky items wait (§4).
- One `webflow-devkit:builder` agent per unit, in parallel. Brief: plugin root, the plan file and its unit, the index and screenshots, the evidence folder `<scratchpad>/feedback/fix/<unit>/`, and:
  - touch only owned components; a fix that needs another unit's component is reported, not done;
  - a change to a shared class reaches every use: check the instance count first, prefer a variant or combo when one use should change;
  - verify with the fixture (change patched into staging) at 1440, 992, 768, 375 **and the reporter's width**, before/after crops saved;
  - Designer-only steps go to `references/designer-queue.md`, not done;
  - return per ticket: id, `fixed` / `designer` / `owner` / `blocked`, Was → Now measured, evidence file.
- **One writer for shared site code.** The global custom-code component, site scripts and IX3 are written by this session only, from the source file under `references/`, read back identical. Fixers hand over the code; they don't write it: the source file in `references/` is updated and the log line says **ready to write embed `references/<block>/<file>.html` → <embed id>**. Write all hand-overs in one pass once the fixers that touch them are done. A large write (≈ 45 KB) failed to send from a helper agent: write those from this session.
- Other sessions on the same site (`ListAgents`): tell them before you use the Designer, write shared code or publish, and wait for their "free". Their half-finished work goes live with your publish too. A message can sit unseen while the other session's user has to approve it (another permission mode): give it a fixed wait, tell the user which session has not answered, then go on with a staging-only publish.
- **Long runs on a Mac:** sleep stops every running agent ("Your computer went to sleep mid-response"). At the start of a round run `caffeinate -dims` in the background (stop it at the end), and restart each agent that dropped as its notice comes in.
- Designer-only steps: one pass after the API fixers, in the user's Chrome ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11). No Chrome on this machine: they stay on the user's list, and their tickets stay in new.

## 6. Publish, review, close

- **Publish once**, when every fixer and the Designer pass are done (a publish during a Designer pass ships its temporary steps). Staging only. Webflow allows one publish a minute.
- A **fresh** `webflow-devkit:reviewer` per unit, on the published staging: brief it with the tickets, their screenshots and the reporter's widths. It checks that each ask is met as the reporter sees it, compares with Figma, and checks the neighbours did not move. Up to four at a time.
- **Pass** → status **fixed** (`clickup_execute_operator` `task.update_many` with `status_label`, or `clickup_update_task`), plus a comment per ticket: what changed in the reporter's words, Was → Now, the widths checked, side effects ("the same card on GOP got this too"). Anything only a human can prove (a real form submission, a Mac-only render) is asked for in the same comment.
- **Fail** → back to its fixer with the reviewer's evidence; round 2 is published and reviewed the same way. Two failed fixes on the same ticket: stop and give the user options.
- A ticket moves only after a live pass — never on the fixer's word, never on a patched-in test alone.

## 7. Check new again — until it is empty

- Re-run the §3 filter **after every round, whenever an agent finishes, and before every report to the user.** Count what is in new and account for each one: being fixed, waiting on the user, waiting on someone else. A number that does not add up means you missed tickets: list them all.
- New tickets start the next round at §3 while the current round runs, as long as their components are not owned by a running fixer.
- Updates while it runs: short, one line per change of state (round N published, X tickets to in review, Y new ones found).

## 8. Stopped before new is empty

The user stops the run, or the session has to end: write `references/handoff-<topic>.md` — per ticket its state (in review, fixed and checked but not yet moved, needs more work and why), what is on the site but not published, embeds not yet written with their ids, open Designer queue items, and the next steps in order — plus a log entry. The next session starts from that file.

## 9. Done

New is empty. Then report in a few lines: moved to in review (count), moved to waiting with what each waits for, and the user's list — owner OKs, Designer steps left, real tests only they can do. Record each round in `references/log.md` ("<date> — Feedback round N"), lasting choices in `decisions/`, and kit gaps as kit issues ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)).
