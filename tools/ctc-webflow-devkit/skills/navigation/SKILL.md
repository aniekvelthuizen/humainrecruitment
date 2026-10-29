---
name: navigation
description: Build, restyle or animate the site navigation on a Webflow site from a Figma design — the nav bar, its page links, a menu/burger button, a full-screen or drop-down menu panel, a logo that shrinks on scroll, links that hide on scroll, and a nav that changes colour over dark sections. Use whenever the user mentions the nav, navbar, navigation, header, menu, burger/hamburger, "Menu / Close", the menu overlay or panel, nav links, the logo in the nav, a sticky or shrinking header, nav colour per section, or a language switch in the nav — even if they do not say "skill". Requires a client repo (project.json); otherwise run the project skill first.
---

# Navigation — one nav, read from the pages, built on Lumos

A site has one nav component on every page. It shows what the **pages** draw (not every state a Figma component set offers), uses the site's button for every link, keeps all link content in one place, and moves the way the Figma prototype moves — scroll, open, hover — without ever making text jump.

Read `project.json`, `decisions/site.md`, `decisions/components/nav.md` and `button.md` if they exist. Follow [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) (or the site's own system), [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) for call shapes, [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md) for every question. The site's button component comes first: if it is not built yet, run the [buttons](../buttons/SKILL.md) skill before this one.

## 1. Inventory — what the design means

Follow [inventory.md](inventory.md). In short: run [scripts/figma-nav-scan.js](scripts/figma-nav-scan.js) to list the navbar and menu component sets, their states, which page frames use which state, and the **prototype reactions** — those carry the behaviour (an "after 4 s" change is a stand-in for scroll; a click with "move in" is the panel opening). Screenshot every state and the menu frame at desktop and mobile.

Write down, as a table: each state, when it shows (top of page, after scrolling, on which pages), what changes between states, and the panel's content. Done when every state has a trigger and every link has a target page.

## 2. Plan

Shape and rules in [structure.md](structure.md); the plan names:

| Topic | Rule |
|---|---|
| Component | Rebuild the Lumos `Nav` (and its `Menu`) in place; keep Lumos class names. Never a second nav. |
| Bar | One Webflow Navbar at every width when the design opens the same menu everywhere; remove the desktop/mobile split it no longer needs. |
| Links | Every link is the site's **button component** (variants for bar link, panel row, child row, contact link). Hover, roll and focus come with it. |
| Link content | One `Menu` component holds every link; its variants (`Bar`, `Panel`) show the list each place needs. |
| States | Page-top / scrolled = runtime state (scroll). Pages that start minimised = a Nav **Variant**. Never a variant for a breakpoint. |
| Sizes | Nav height and side padding in the Lumos `nav/*` variables, fluid between the mobile and desktop design values (`clamp()` in the variable, [build/foundations.md](../build/foundations.md) §4). |
| Code | Attribute contract `data-nav="…"`; motion in Webflow Interactions (IX3) where it can do it, the rest in `Global | Custom Code` ([motion.md](motion.md)). |
| Missing pages | Link targets that do not exist are created (copy of the site's standard page), or the plan asks. |

Bundle the questions (one round): hover (button hover vs the design's), missing pages, localization (needs a Webflow add-on), panel speed (Figma prototypes are often slow), how the prototype is read (scroll vs time). One OK. Plan to `references/plans/<date>-navigation.md`.

## 3. Build

In this order, each read back after writing ([structure.md](structure.md) §2–7):

1. **Variables**: `nav/height`, the side padding (desktop values; read first which classes use `nav/spacing-outer-horizontal` and `-inner-horizontal`, structure.md §2), `nav/spacing-outer-vertical` 0 when the design's bar is flush; the fluid `clamp()`s in the Variables panel.
2. **Logo**: the design's SVG in the Lumos `Logo` embed (multi-colour paths: structure.md §3).
3. **Button variants** the nav needs (+ a `Number` prop when rows are numbered).
4. **Menu**: clear the starter's demo links, build the panel list and the bar list, insert button instances, set their props.
5. **Nav**: one bar (logo clip › link row › Navbar menu › Menu/Close button), the panel layout, attributes, variant(s).
6. **Pages**: create missing link targets; SEO titles.
7. **Motion** ([motion.md](motion.md)): scroll fold, colour over dark sections, panel slide and what happens inside the open panel, Menu/Close roll, hover.

Designer-only steps (a Locales list element, a navbar-trigger interaction, switching URL links to page links): queue them and do them in one Designer pass in the user's Chrome ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11 "Queue, then one pass"); otherwise give literal steps.

## 4. Verify

The Designer snapshot only judges layout: the menu panel is hidden until opened (no snapshot), masks render as squares, and IX3 and custom code do not run on the canvas. Measure in a browser: [scripts/nav-check.mjs](scripts/nav-check.mjs) on the published staging page (publishing needs the user's OK), with `--dark` to inject a dark section when the site has none yet. Done when, at 1440, the link-row breakpoint, 991 and 375:

- top of page and scrolled states match the design; the return to the top restores everything; a quick down-and-up ends in the top state;
- no link label changes height (wraps) during any animation, and hover moves no neighbour (shift < 0.5 px);
- the Menu button is never visible next to the links at the top on desktop, and always reachable below the link-row breakpoint;
- the panel opens and closes, list rows are equal height with one equal line between them, nothing overflows horizontally;
- over a dark section the bar is light, and dark again after it; with the panel open over a dark section the bar text is dark;
- the logo's accent colour renders (structure.md §3); console clean.

## 5. Record and hand over

- `decisions/components/nav.md`: states and their triggers, structure, attribute contract, interactions (names and ids), what stays in code and why, deviations from Figma; `decisions/site.md`: the `data-section` contract, IX3 policy, languages.
- `references/log.md` with the measured numbers; kit friction as issues ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)).
- Tell the user, in plain words: when the nav changes and why, how to mark a section dark (`data-section="dark"`), how to add a link (one place: `Menu`), where each animation lives (Interactions panel vs custom code), what they still have to do (Fluid Builder, localization add-on, video or image backgrounds, copy).
