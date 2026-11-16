---
name: interactions
description: Add or tune motion and interactive behaviour on a Webflow site — working tabs, sliders and accordions, scroll reveals, GSAP timelines, progress indicators, pulses, hover sequences. Use when a section contains something meant to be interactive, when a finished page needs its reveal pass, when the user asks for animations, "make it move", "reveal on scroll", autoplay, or says something is too slow, too fast, or "empty for too long".
---

# Interactions — brisk, predictable, visible in the Designer

Motion is judged by feel, and the feel we are asked for is consistent: nothing makes a visitor wait, nothing looks empty, and a thing behaves the same whether it plays by itself or is clicked. Build to that from the first version so the tuning loop is short.

Two kinds of work, at two different moments:

- **Behaviour the design implies** — tabs, sliders, accordions, toggles, anything drawn with an active state. Built **working, with its section**, in the same unit. A tab row that does not switch is an unfinished section, not a later task.
- **Motion on top of a finished page** — scroll reveals on sections and their children, and small accents on single elements. One pass **after every section on the page is built and componentized**, matching the system the site already uses (read `decisions/site.md` first; reuse it, never build a second one).

Read the latest Webflow changes first (https://webflow.com/updates, https://developers.webflow.com/home/changelog — IX3 and the API change often), then `project.json`, `decisions/site.md` (existing custom code, libraries already on the site), `decisions/motion.md` (the project's motion guidelines: easings and timings; create it from the design's motion page the first time a project has one) and the block's plan and log. Mechanics in [patterns.md](patterns.md). Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Plan

One table per interaction, shown with the build plan or on its own for one OK:

| Element | Trigger | What moves | Duration / delay | Mechanism | Where the code lives |
|---|---|---|---|---|---|

- **Mechanism and timing**: the ladder, tokens and recipes in [motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) — styles and Lumos triggers → the Lumos component's own behaviour (Accordion, Nav, Modal, Slider) → CSS in the custom-code block → IX3 for sequences the owner edits in the Interactions panel (targets by `wf:attribute`; payload rules in [navigation/motion.md](../navigation/motion.md) §1) → a script on Webflow's GSAP. Never element ids as targets: componentizing renumbers them.
- **Code is the last resort** *(house)*: what a Lumos class, a Lumos `data-trigger`/`data-state` or IX3 can do is not written as code ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §0). Layout never lives in code.
- **Custom code targets attributes, not classes.** A `data-*` attribute says what an element is *for*; a class says what it looks like. Attributes survive a restyle, a rename and a componentize, they read as intent in the Designer, and one script can serve every page that uses them. Put the behaviour's inputs in attributes too (`data-reveal-delay`, `data-autoplay="4.5"`), so tuning is an attribute edit and not a code edit. Reach for a class only when the site's own system already keys on one, and say so in the plan.
- **Where the code lives** *(house; the kit's one recipe for it)*: on a Shared Library and the sites that install it, [motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §8. Otherwise one component, **`Global | Custom Code`** (group Global, a `u-position-fixed` div with a style embed and a script embed), placed at the top of `page_wrap` on every page next to Global Styles — never an embed inside another component or on an element, and not page/site custom-code settings unless the code must run in `<head>` before first paint (a gate, see patterns.md). If the component exists, append to its embeds and keep what is there verbatim. **The Designer canvas skips any embed that contains a `<script>`** — its CSS too — so CSS lives in its own style-only embed, and canvas-only rules (show step 2 of a multi-step form, open an accordion) go under `html.wf-design-mode`. `page_wrap` ids differ per page: look each one up. CMS templates that are still empty get it when they are built. Record the placement (and the templates still without it) in `decisions/site.md`. Larger scripts can live in a client script repo served by jsDelivr with a **pinned tag and SRI** in the site footer (`set_site_freeform_code`; why not a registered script: [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §8 "Scripts and embeds"): each script an IIFE (two top-level `const`s with the same name broke a second script), a new tag per change — check the tag is not taken by another session first.
- Name what is deliberately **not** animated (diagrams with their own motion, elements whose inline state another script owns, nav, footer).

## 2. Defaults

Start from the tokens in [motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §2 (hover, open/close, menu content, reveal); the user tunes from these, not from slower ones. Specific to this skill:

| Kind | Default |
|---|---|
| Above-the-fold entrance | CSS keyframes from first paint, 0.7 s each, delays 0.05 → ~0.5 s down the column. Never wait on a script bundle for the hero |
| Scroll reveal, stagger | token `reveal` (travel is an animation distance in a script, not a layout value) |
| Autoplay with a progress line | fill ~4.5 s, then retreat ~4.5 s at the **same speed**, then advance (~9 s per item). Say the numbers when handing over |
| Autoplay without a progress line | ~4.5 s per item |
| Loops (pulse, rings) | calm: a breath ~1.4 s, expanding rings ~2.8 s. A fast loop reads as an alert |

## 3. Behaviour rules

- **Nothing jumps when state changes.** The active version of an item must occupy exactly the space the inactive one does, so switching moves nothing below it. A rule, underline or progress line that appears on the active item is positioned out of the flow; a border that disappears turns transparent instead of being removed; a weight or size that changes reserves the larger box in both states. Measure an item's height through a switch before calling it done — a 13 px difference shifts the rest of the page on every tick.
- **Manual = automatic.** Clicking a tab or slide starts the same progress, timing and transition autoplay would, from zero. Autoplay resumes from the clicked item.
- **No behaviour the design did not ask for.** Pausing on hover, a desktop-only media column, an auto-advance the design does not draw: each is a decision for the plan, with a recommendation — not a courtesy default shipped unannounced.
- **A hover that must slide something open (`height: auto`)** cannot be a Lumos trigger transition and sticks in IX3: a small script on the GSAP Webflow loads ([patterns.md](patterns.md), "Hover that slides open").
- **Symmetric motion, smooth from v1, tested the way people use it:** [motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §1, §4–§5 and §9 (every variant and theme; [buttons/scripts/hover-matrix.mjs](../buttons/scripts/hover-matrix.mjs) for hovers). Fill and retreat, enter and leave count as open and close: same speed. A hover in slower than out is built with trigger transitions, not IX3. One clean run is not a test.
- **Nothing flashes before its reveal.** Hide targets before first paint (a head script sets a gate attribute on `<html>`, CSS hides only under it). Watch shared backgrounds: hiding children of a transparent card over a parent gradient leaves the gradient visible, so reveal the parent.
- **Nothing stays hidden if the script fails.** Reduced motion, a failed CDN load or a time-out guard releases the gate and shows everything.
- **The Designer shows the first state.** The canvas runs no scripts: the first slide, the active tab, revealed content are visible from CSS alone. Only the runtime gate hides them.
- **Per-block off switch.** Removing a block's animation is removing its attributes, nothing else.
- **Motion costs no SEO** ([seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md) rules 4, 5, 7): no layout shift from load reveals, the hero image never behind a reveal gate and Eager, content a tab, accordion or slider hides stays in the served HTML. After the motion pass `seo-audit.mjs <url>` shows no `cls`, `lcp-lazy` or `nav-js` error.

## 4. Build

Attributes through the Data API: `data_whtml_builder` when creating elements; `set_attributes` on existing ones (inside a component definition with `scope_component_id`), read back with `get_attributes` because it can return "internal error". Remove with `remove_attribute`. Page code with `set_page_freeform_code` (head and footer, 10,000 characters each), read back with `get_page_freeform_code` and compare byte for byte. Log the attribute map (element, class, attributes) in `references/log.md` so it can be reverted in one batch.

## 5. Verify

The canvas cannot verify motion, so verify in a browser: staging when published, otherwise a local fixture with the same markup, or the live HTML served with the new code patched in (headless Chrome with request interception). Measure, do not eyeball:

- time to first visible element and to last, above the fold;
- nothing painted before its trigger (screenshot or computed opacity at intervals);
- autoplay advances at the planned dwell; a click restarts progress; retreat speed equals fill speed;
- reduced motion and a blocked script → everything visible;
- console clean.

State plainly what was not seen on the real page (unpublished draft).

## 6. Tuning loop

The user steers by feel ("a little faster", "less fast"). One value per correction, about 20–25 % per step, and reply with one line: `Was | Now` per value changed (for example `dwell 6 s → 4.5 s, retreat 6 s → 4.5 s`). Change the paired value too when symmetry requires it, and say so.

## 7. Hand over

What moves, the numbers it moves at, how to switch a block off, and what needs a publish to be seen.
