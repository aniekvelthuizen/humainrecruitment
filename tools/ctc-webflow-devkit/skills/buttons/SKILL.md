---
name: buttons
description: Build, restyle or animate the button component on a Webflow site from a Figma design — one reusable button with variants, an icon or image you can switch per button, theme-aware colours and an optional hover animation. Use whenever the user mentions buttons, CTAs, call-to-action links, "the button component in the Styleguide", button variants or properties, arrow or icon buttons, switching icons on a button, a photo or avatar inside a button, lined/outlined/text buttons, or a hover effect on buttons — even if they do not say "skill". Also use when a build or componentize task reaches its first button. Requires a client repo (project.json); otherwise run the project skill first.
---

# Buttons — inventory, one component, icons, motion

A site has one button component that every page reuses. It carries the looks the **pages** actually use (not every option a Figma style guide offers), an icon or image an editor can switch, colours that follow the section's theme, and — when asked — one smooth hover. Getting the inventory right first is the whole game: every rebuild in the past came from building what the style-guide frame showed instead of what the pages use.

Before you start: read the latest Webflow changes (https://webflow.com/updates and https://developers.webflow.com/home/changelog — new API or Designer features can remove a workaround or a hand-over step), then `project.json`, `decisions/site.md`, `decisions/motion.md` and `decisions/components/button.md` / `icon-set.md` if they exist. Follow [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) (or the site's own system), [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) for call shapes, and [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md) for every question.

## 1. Inventory — what the pages use

Follow [inventory.md](inventory.md). In short: scan every instance of the Figma button set(s) on the **page frames** with [scripts/figma-buttons-scan.js](scripts/figma-buttons-scan.js), group them by look, screenshot one of each, and sort them into:

- **Buttons** (stand-alone calls to action, the thing this skill builds);
- **Other UI that happens to use the button component** in Figma — tabs, calendar cells, nav items, filter chips, contact links, icon-only controls. Name them; they become their own components later, not variants of the button.

Per look, note the **background it sits on** in the pages. A look that matches its background in the style-guide frame (a light-grey "subtle" button on a light-grey card) is not a colour bug: check where the pages use it before changing a colour.

Show the user the table (look, where, background, count, one screenshot each) and ask which looks are buttons and which one is the default. The owner's word beats the Figma style guide. A dark version that only swaps colours is the **theme**, not a variant (§2).

Done when the user has confirmed the list of looks, the default, and the icons or images in use.

## 2. Plan the component

Shape, naming and every style rule in [structure.md](structure.md). The decisions to show in the plan:

| Topic | Rule |
|---|---|
| Component | Reuse the site's button (Lumos `Button Main`); restyle it in place. Never a second button component. |
| Variant | One axis, named by look (`Primary` = the most used look, then e.g. `Secondary`, `Subtle`). Rename leftover starter variants (`Link` → the design's name) instead of adding twins. |
| Not variants | Hover → trigger/pseudo. Small/mobile size → fluid values. Dark/brand background → theme variables. Icon-only round buttons → their own component. |
| Options on every look | Something an editor switches on any variant (an icon, a photo/avatar) is a **prop with a visibility toggle**, not a second variant axis ([structure.md](structure.md) §7). |
| Props | Folder **Button**: Visibility, Variant, Text, Link · **Icon** or **Image**: Visibility, the asset (Alt) · **Settings**: Lumos Clickable props. |
| Icons | One `Icon Set` component, one variant per Figma icon, linked to the button's **Icon** prop ([icons.md](icons.md)). |
| Colours | Theme variables only; per-theme differences go in a theme variable, not an override per variant. A look the design has no dark version of gets a site-only theme variable (recorded in `decisions/site.md`), never two looks that disappear on dark. |
| Height | `min-height: button-size/medium` (Lumos), not padding alone: Lumos trims text to cap height, Figma measures untrimmed ([structure.md](structure.md) §4). |
| Motion | Timing from `decisions/motion.md`; hover as Lumos trigger transitions, IX3 for scroll/click/load ([motion.md](motion.md) §1). |

One OK, questions bundled. Write the plan to `references/plans/<date>-buttons.md`.

## 3. Build

1. **Icon Set** first when the design uses icons ([icons.md](icons.md)): export, clean, upload, build the masked component, verify every icon renders.
2. **Button** ([structure.md](structure.md)): restyle the base classes as the default look, then one variant at a time. Read back every class and every variant override after writing it; the API silently drops or mangles some values (listed in structure.md §6). Check the wrap's starter radius (`radius/round`) against the design.
3. **Designer-only steps** — linking the Icon Set variant to a button prop named **Icon**, moving the Variant prop into the Button folder, renaming a variant prop, a **conditional visibility** (hide the accent when the image is on): the API cannot do them. Queue them and do them yourself in one Designer pass (webflow-mcp.md §11 "Queue, then one pass") through the browser the session has (Claude in Chrome, or `chrome-devtools` autoConnect — [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §11); ask first only for something destructive. The binding dot next to a setting (purple) opens *New property / Create conditional / Connect*. If no browser is connected or the login has expired, say so in one line and give the user literal steps.
4. **Styleguide**: on the Lumos `Styleguide` page, in the section **Components**, its own group **Buttons** (`#buttons`) — not a separate page, not loose cards elsewhere. One card per theme (light, dark, brand) with every variant, and every variant again with its option (icon or image) on. Cards use the section background (`background`), so each look shows as it will on a page.

## 4. Verify

The Designer snapshot cannot judge buttons: it loads no custom fonts, runs no global CSS (a Lumos Clickable shows as a grey box), renders no CSS masks (icons show as solid squares) and plays no IX3. Use it only for layout. Measure on the published page (publishing needs the user's OK) — [scripts/hover-check.mjs](scripts/hover-check.mjs) for sizes and colours, [scripts/hover-matrix.mjs](scripts/hover-matrix.mjs) for motion — and read the **published CSS** of the button classes (a mangled `transition` is invisible in the API read-back).

Done when, at the design width and at mobile width:
- height equals the design (Figma draws strokes inside the box, CSS adds them; Lumos trims text — structure.md §4);
- the text uses the design's line height and descenders are not clipped;
- a long label wraps instead of overflowing at 140 px wide;
- each theme card shows every look **visibly** (no look the same colour as its card) with the right text, line and icon colour at rest and on hover;
- every icon variant shows its glyph (not a square);
- `hover-matrix.mjs` reports **OK for every button**: hover 3× in a row, one hover cut off halfway, a move straight onto the neighbour, and the rest state back after leaving;
- the console is clean.

Report "done" only after the full matrix. One hover on one button misses the faults users find first: an animation that plays once, a colour fade that never runs, a look that vanishes on dark.

## 5. Motion (when asked, or offered after the static button is accepted)

Follow [motion.md](motion.md) together with the [interactions](../interactions/SKILL.md) skill. Timing and easing come from `decisions/motion.md` when the project has motion guidelines; otherwise the kit defaults (motion.md §2). Webflow-native first, own code last:

- **The hover itself** — accent, label shift, line — as **Lumos trigger transitions** in Webflow styles (motion.md §3): per-direction speed and ease in one value, reverses from wherever it is, plays on keyboard focus, no code.
- **Colours** as `:hover` / `:focus-within` styles on the wrap with the same timings.
- **IX3** (Webflow's GSAP interactions) for scroll, click, load and sequences; a hover in IX3 only with equal in/out times — a longer in than out leaves the button stuck in its hover state after a quick pass (motion.md §4).
- **Code** only for what Webflow cannot do (a letter roll), in **`Global | Custom Code`** (motion.md §7), using the GSAP Webflow loads — never GSAP loaded by us, never code inside the button.

Offer two or three options as a **live local demo** when the look is open ([scripts/motion-demo.html](scripts/motion-demo.html)); motion is chosen by feel. Tune one value per round, `Was | Now`.

## 6. Record and hand over

- `decisions/components/button.md` (looks, where each is used and on which background, variant map, props, options, what is not a variant and why, motion with its mechanism and timings), `decisions/components/icon-set.md`, and in `decisions/site.md` any site-only variable (e.g. a hover line colour, a dark-theme tint) and where custom code lives.
- `references/log.md`: what was built, what was measured, what is open.
- Kit friction as issues ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)).
- Tell the user, in plain words: the looks and what each is for, how to switch the icon or image, what changes per theme, where the animation lives (button styles or Interactions panel) and its timings, and anything they still have to do in the Designer.
