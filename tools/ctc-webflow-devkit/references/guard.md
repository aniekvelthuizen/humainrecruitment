# Guard — asking before changing a live site

`project.json` → `"production"` answers one question: **is this site live, with real visitors on its own domain?**

- **Building** (`false`, the default for a new client repo): no guard, no prompts. Every change is still read back and logged.
- **Live** (`true`, flipped at launch): the guard hook stops every call that changes something that already exists (the list is in `hooks/guard.py`) and shows a Webflow-permission window in plain Dutch.

## Why the chat comes first

The permission window alone is not a real check: owners click Allow on things they cannot judge. The window is only the confirmation; the explanation comes first, in the chat, from the session that talks to the user.

On a live site, before any change the guard stops on, ask in this shape and wait for the answer:

> **Zeker weten?** Ik wil `<what>` aanpassen (`<what changes, in plain words>`).
> Dat raakt:
> A) `<pages or components where it shows, with counts>`
> B) `<what else uses it: other pages, CMS templates, a shared library's sites>`
> C) `<what visitors notice>`
> Bezoekers zien het pas na Publish. Terugdraaien: `<how>`.

Look the impact up, do not guess: which pages and components use the class (`data_style_tool`, the element trees, `references/components.json` instance counts), which CMS templates, whether the site is a shared library whose changes reach other sites. Say when you could not find it.

Bundle: one question per plan or fix round, not per call. The changes it lists are exactly the ones the permission windows will show next; anything not in the list is not done.

## Subagents

A builder subagent cannot ask the user. On a live site, the plan names every existing style, variable, component and piece of custom code the unit changes, and the session that dispatches it asks the **Zeker weten?** question before dispatch. The windows the agent then triggers repeat what the user just approved.

## At launch

Set `"production": true` in `project.json`, note it in `decisions/site.md`, and tell the user once: from now on, changes to what exists are asked first, in plain words.
