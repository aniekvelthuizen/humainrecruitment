---
name: componentize
description: Turn built, verified sections into Webflow components with props, slots and variants — and reuse the ones that already exist instead of building new. Use when a section is finished and responsive, when the user asks to make blocks reusable or hand them to marketers, or when a design repeats an element that is already a component.
---

# Componentize — per finished section, bottom-up

A definition edit is live on every page instantly; a class edit is not. So structure gets settled as plain elements first, and a section becomes a component only once it is built, detailed, responsive and verified — **but that happens per section, as soon as that section is done, not after the whole page.**

Read `project.json`, the plan and log of the build, and `decisions/components/`. Mechanics and traps in [mechanics.md](mechanics.md). Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 0. Reuse first

Before proposing any new component, find out whether it already exists. Search `references/components.json` and `query_components` for the pattern the design shows — a card, a button, a badge, a label, a list row, a quote, a logo strip.

- **Identical to something on the site → use that component.** Do not rebuild it, do not make a same-looking twin.
- **Nearly identical — same content, different arrangement or look → a `Variant` of the existing component**, not a new component. One extra variant beats a second component every time.
- **Genuinely different → a new component,** and say in the proposal what it is that the existing one could not carry.

Two components that look the same are the failure this step exists to prevent: the editor cannot tell them apart, and a change has to be made twice.

- **Match by look, not by internals.** The closest existing component is the one that *looks* closest (theme, frame, corner, size), even when another one shares more inner parts. A missing element on it becomes a prop with a visibility toggle, default off, so existing uses do not change — not a new variant, and not a rename. Show the 2–3 closest candidates with a one-line look comparison.
- **A type Lumos already ships is built in the Lumos original itself** — the card in `Card Primary`, the button in `Button Main`, a form in the Lumos form, a video in `Visual Video`: adapt it in place, keep its name, make the design's types its variants. Never a blank component, and no duplicate next to it unless the owner asks (PMS owner rule, Oct 2026). Only the Lumos original keeps the props the API cannot create (variant, heading tag, conditional wrappers, theme switcher, clickable wiring). Cards: the [cards](../cards/SKILL.md) skill.

## 1. Propose

For each candidate block, one row: name (in the site's own naming convention, from `references/components.json`), what varies per instance, and how each variation is carried:

| Varies | Carrier |
|---|---|
| a text, an image, a link, a tag, visibility | prop |
| content with paragraphs, or content that differs in shape per instance | slot, with an item component |
| one axis of visual states the editor picks | the single `Variant` prop |
| a second axis | a nested component with its own variant |
| a look that stacks on another | a separate element with a boolean prop |

Judge on the editor's experience, whoever edits after us (a marketer, the client, their own AI): one draggable thing, few named states, plain-language prop names, and every text, link and image someone will want to change exposed as a prop or slot from the start. Component and prop names describe the pattern, not today's copy. Order the list bottom-up (card before section). Show it and get one OK.

**Break the section into its repeating parts first.** A card, a list item, a row, a column, a numbered step, a logo, a quote — each becomes its own small component, and the section holds them in a **slot**. That is what makes them reusable on the next page and reorderable by the editor. A section built as one big component with thirty props is the thing to avoid: the parts cannot be reused and the panel is unreadable.

### Every component gets properties

A component without props is a component nobody can edit. Expose every text, image, link, icon, tag and show/hide that differs between instances.

**Organise them into folders** so the panel reads top to bottom the way the block does: **Variant** → **Content** → **Visual** → one folder per part, in DOM order (Meta, Button, Stat …) → **Link** → **Settings** (Lumos props, last). Props inside a folder in the order an editor fills them in. A folder holds one kind of thing, never content and visual together. A flat list of fifteen props is as bad as none.

- Every part an editor may want to hide gets a `<Thing> Visibility` toggle, right after the thing.
- Repeated same-styled items (tags, topics, meta lines) are a slot of a small item component, not `Tag 1/2/3` props.
- Every text shows only when filled: native condition `<Text> is set` (with a toggle: `toggle AND is set`); a wrapper of optional parts hides when all of them are off. Conditions are Designer-only.
- Every text is a Lumos Typography instance (Heading, Paragraph, Plain, Tag) or `Button Main`; the component's own classes do layout only.

Recipes and API traps: [cards/props.md](../cards/props.md), [cards/typography.md](../cards/typography.md).

**The one exception: blocks whose content is meant to be identical everywhere and edited centrally** — the home hero, the nav, the footer, a site-wide banner. There the content belongs in the definition, so one edit changes every page. Those get no content props (variants and visibility may still apply). Say in the proposal which of the two a component is; the default is props.

Before transforming anything interactive (tabs, sliders, reveals, anything a script or attribute drives), write down in the proposal what drives it: the script, the selectors or `data-*` attributes it targets, the classes it toggles. Transform renumbers element ids, so a script or IX3 targets `data-*` attributes, never ids or classes (lumos-rules.md §0).

## 2. Build, one component at a time

Chain first, values last: dump the exemplar's content to a file, empty it, transform, re-read the ids (they renumber), create props and slots and variants, place a new instance beside the original, fill it, compare, then remove the original with the user's OK. Each of those is spelled out in [mechanics.md](mechanics.md).

Done when:
- a fresh instance with default prop values renders the most common form of the block;
- the filled instance matches the original's snapshot;
- **the instance still matches the design frame**, compared again after the transform (verify.md §2d) — transforming re-renders the block, defaults can replace content and slot children can land in a different order, so a section that matched before componentizing is not assumed to match after;
- **the instance reads correctly on the Designer canvas.** The canvas runs no scripts, so the first slide, the active tab and any revealed content must be visible from CSS alone. Hide things only under a class or attribute a script sets at runtime;
- **every interaction still works on the instance**, checked in a browser on staging or a fixture with the same markup, not assumed from the original.

## 3. Record

`decisions/components/<name>.md`: what the props mean, what the defaults are, what the API refused and the user has to do in the Designer. `references/log.md`: one line per component.
