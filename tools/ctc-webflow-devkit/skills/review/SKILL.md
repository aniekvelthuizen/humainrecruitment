---
name: review
description: Check work an agent (or anyone) did on a Webflow site, component by component, with fresh reviewer agents — does it work, is it responsive, is the spacing right and logical, is it Lumos-proof, is there unneeded code, are the props tidy, does it match the design — then give a short plain-words list and fix what the user picks. Use whenever the user asks to review, check, audit, QA or "go through" built sections, components or a page; asks "is this done right", "did the agent follow the rules", "check what was built today"; before showing a page to the client; or after a build session ends. Requires a client repo (project.json); otherwise run the project skill first.
---

# Review — fresh eyes, plain list, fix on OK

The agent that built something is the worst judge of it: it remembers what it meant to do. A review sends a **new `webflow-devkit:reviewer` agent per component**, which knows only the design, the rules and what is really on the site. It finds, it does not fix. This session merges what they find into one short list, and fixes only what the user picks.

Read first: `project.json`, `decisions/site.md`, `references/log.md`, the latest file in `references/audit/`. When `project.json` is missing, stop and point to the project skill. The checks: [checks.md](checks.md). The report shapes: [report.md](report.md). Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Scope

What the user names: a page, a component, a list, or "what was built today". Nothing named: everything in `references/log.md` since the last audit.

Break it into units, one per component: every section on the page, plus every component inside them (cards, buttons, items) **once** — a card is reviewed on the Cards page, not in every section that uses it. A section placed on several pages is one unit; its reviewer gets every page URL and checks each instance at least for overflow and content. When the scope is a page or more, add one unit **Site code**: `Global | Custom Code`, site and page scripts and IX3, checked against every page that uses them.

Say the unit list in one line and start. A review changes nothing, so it needs no OK.

## 2. Prepare, once

- Staging URL (`project.json`, else `data_sites_tool`). The last publish is the site's `lastPublished` from `data_sites_tool`, and each page's last edit from `data_pages_tool` — not the web server's `Last-Modified`, which a CDN refresh moves. A page edited after the last publish is checked visually on the old publish, and the reviewer says so.
- `npm install` in `${CLAUDE_PLUGIN_ROOT}/references/fixture` if `node_modules` is missing.
- Per page in scope: `node ${CLAUDE_PLUGIN_ROOT}/skills/review/sweep.mjs <url> --out <scratchpad>/review/<page>/sweep`. Every reviewer on that page reads the same sweep instead of rerunning it.
- The design files per unit: `references/figma/<page>/section-NN.png` and `.md`, from the plan or the decisions file.

## 3. Dispatch the reviewers

One `webflow-devkit:reviewer` agent per unit, launched with the Agent tool. Brief: plugin root `${CLAUDE_PLUGIN_ROOT}`, component name and id, page, URL and a selector for the instance, the design files, its decisions files, the sweep folder, its own evidence folder `<scratchpad>/review/<unit>/`, and whether staging has the latest build.

No `webflow-devkit:reviewer` agent type in the session (the plugin not loaded, an older cache): launch a general-purpose agent whose brief starts with "read and follow `${CLAUDE_PLUGIN_ROOT}/agents/reviewer.md`, `checks.md` and `report.md`" and says read-only on Webflow. A scope of many pages: one reviewer **per page** (one Reviewer return block per section) works; a component shared by pages is still reviewed once, where it was built.

They only read, so they can run in parallel — up to four at a time (headless Chrome and the API's rate limit). Never reuse the agent that built the unit, and never review in the session's own head instead: the point is eyes that did not build it.

## 4. Merge and check the findings

- **Across units**, which no single reviewer can see: the same kind of distance has the same value on every section (the sweep's section table, kicker → title gaps, card paddings); the same thing is built the same way everywhere; no two components look alike.
- **Drop** a finding without evidence, and anything `decisions/` records as an owner choice.
- **Re-check yourself** every ❌ and any finding that contradicts another reviewer or surprises you — one quick measurement. A wrong item on the list costs more trust than a missed one.
- **Look at the pictures yourself** for every interactive unit: the `interact/` shots during and after a drag, each tab, the phone width. A reviewer whose return has no interact pictures for a slider, tabs or an accordion, or a Spacing ✅ without a `distances.md` table, did not finish: send it back with what is missing.
- **Merge** the same fault on several components into one item.

## 5. Report

The user's version from [report.md](report.md) → "To the user": one line of totals, the matrix, then numbered items grouped Broken → Off → Tidy → Your call, each with its fix in a few words. Short and plain: the thing a visitor or editor sees, not class names. Save the full report to `references/audit/<yyyy-mm-dd>-<scope>.md`.

*(house)* Then fix without waiting ([asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md), "Do what you recommend"): every Broken, Off and Tidy item, and every "Your call" item with its recommended answer. Only risky fixes wait for the user's OK — deleting or recreating props or components, changes that reach many existing instances or pages, anything outward-facing or stopped by the guard, a deviation from the design. Say in the report which items wait and why.

## 6. Fix what the user picks

- "Fix all" means every Broken, Off and Tidy item, and "Your call" items with the recommended answer unless they are risky (§5).
- Follow the build skill's rules: one change, one read-back ([verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §4), the guard's prompts, [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md). A fix is never custom code where the finding was "this should be Lumos".
- Small fixes in this session. Many fixes on several components: one `webflow-devkit:builder` agent per component with the item list as its plan, one after another (components that share prop ids never in parallel).
- Many pages at once (Forest3, Oct 2026: 12 pages, ~150 items): fixers in parallel per page group, each brief naming the components it **owns** and the ones it must not touch. Site-wide items (a legacy attribute on every section, links to moved pages, descriptions over 256) go to one fixer. A finding that arrives later for an owned component goes to that fixer by message, not to a new agent. The Designer pass touches only components no fixer is still writing.
- **Publish only when every fixer and the Designer pass are done.** A publish during a Designer pass ships its temporary steps — a rich-text element made to create a nested style went live on every CMS template page. Then the fresh re-check (§7); what it still finds is round 2, published and re-checked the same way. Two rounds were enough on Forest3.
- Designer-only fixes (heading levels, "is set" conditions, folder order, Collection List filters, nested selectors): queue them and do them in one Designer pass after the API fixes ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11 "Queue, then one pass").
- A fix moves its neighbours. As soon as a batch of fixes is live (published, or patched into the page with the fixture), rerun `interact.mjs` on that section at 1440 and 375, every tab, and look at the pictures before calling anything fixed — not only at the end. A marquee or other moving tabs: `--reduced-motion` (moving tabs are skipped with a note otherwise).
- Two failed fixes on the same item: stop and give options (verify.md §5).

## 7. Re-check and close

- A **fresh** reviewer per fixed component, told which items were fixed: it re-checks those, then compares the component with the design once more (fixes move neighbours).
- Tell the user in a few lines: fixed N, still open M (why), with `Was | Now` for anything measured.
- Update the audit file with the outcome, one line per component in `references/log.md`, lasting choices in `decisions/`.
- A fault that a builder made because the kit did not say otherwise, or a check that belongs in [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2c so builders catch it themselves: file it as a kit issue ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)).
