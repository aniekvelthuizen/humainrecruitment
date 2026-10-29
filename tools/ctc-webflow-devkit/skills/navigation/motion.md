# Motion — scroll fold, colour, panel, hover

Policy: what Webflow Interactions (IX3) can do lives there (visible and editable in the Interactions panel, targeting attributes); the rest lives in `Global | Custom Code` ([interactions](../interactions/SKILL.md)). Plan the table first:

| Element | Trigger | What moves | Duration / ease | Mechanism |
|---|---|---|---|---|
| link row | scroll past one bar height / back to top | slide out right + fade / slide back in | 1 s `.67,0,.12,1` + fade 0.6 s / 1.25 s `.4,0,.2,1` + fade 0.8 s | IX3 (2 interactions), or registered properties when hover brings the links back (§2) |
| logo clip | same | width full → mark / back | same curves | IX3 |
| Menu button (≥ link-row breakpoint) | same | opacity 0 → 1 / back | same | IX3 → `nav/scrolled` variable → style |
| bar text colour | dark section under the bar's middle | text variables → light | instant + 400 ms CSS colour transition | script measures what is under the bar → attribute → CSS (§3) |
| panel | Menu click (Webflow Navbar open/close) | slide in from the right | 0.8 s in / 0.4 s out | CSS keyframes |
| Menu ↔ Close | panel open state | label/icon roll | 0.6 s | Lumos state calc (style) |
| links, Menu button | hover/focus | line grows, letters roll, light → regular | 0.6 s | Lumos trigger (style) + letter roll script |

Take curves and durations from the Figma prototype (inventory.md §2); 1.5 s panel slides from a prototype are usually too slow on a site. A return that feels "too fast" gets its own slower, gentler curve — that is why the fold is two interactions, not one reversing timeline.

## 1. IX3 rules learned the hard way

- Read the guide once (`data_interactions_tool` → `guide`). `pageId` is required even then.
- **To-tweens only** (`[null, value]`, no `tt`): a From-To holds its from-state at rest, so a "back to top" From-To would hide the links on load.
- Two scroll interactions on the same trigger: one with `enter: "restart"` and `leaveBack: "pause"`, one with `leaveBack: "restart"` and `enter: "pause"`, everything else `"none"`. Each pauses the other on a direction change. With `"none"` instead of `"pause"`, a down-and-up within ~1 s let the 1 s scroll-down timeline finish after back-to-top and left the Menu button visible over the links at the page top (Forest3, fixed and tested headless at 100–1500 ms).
- Scroll trigger on the page: target `{extensionKey: "wf:body", value: ""}`, `start: "top -72px"` (= the bar height scrolled), `end: "bottom bottom"`.
- Targets by attribute: `{extensionKey: "wf:attribute", value: "[data-nav=\"links\"]"}`; scope `{type: "site"}` (the dark-section trigger lives outside the component).
- `autoAlpha` instead of `opacity` for the links: `visibility: hidden` also takes them out of the tab order.
- Custom curves: `ease: {type: "customEase", bezierCurve: "0.67,0,0.12,1"}`. Durations are seconds.
- **Remove CSS transitions on any property IX3 animates** (e.g. a `transition: width` on the logo clip) — they fight every GSAP frame.
- **Breakpoints**: `conditionalPlayback` only knows `main` (≥ 992) / `medium` / `small` / `tiny`. To change something only from 1280 up, IX3 animates a Number variable (`nav/scrolled` 0 → 1, `wf:variable`, `targets: []`) and a style at `large` reads it (`opacity: nav/scrolled` on the Menu button); below the breakpoint no style reads it.
- `conditionalPlayback: [{type: "prefers-reduced-motion", behavior: "skip-to-end"}]` on the scroll interactions.
- IX3 does not play on the Designer canvas — Preview or a published page only.
- **IX3 restarts a tween from the start value it recorded the first time** (scroll `restart` and the hover role form alike). After a short first hover, hovering out later jumps from 1 to ~0; a quick scroll back first jumps to the end. Anything that must reverse from where it is — a fold interrupted mid-way, a hover over a scrolled bar — is a registered property with a CSS transition (§2b), not IX3.
- `wf:scroll` with a second trigger next to it misbehaves: one interaction per target (class, attribute). The trigger element must not be the animated element itself (the timeline did not reach the published bundle).

## 2. Scroll fold

Two builds. **(a) IX3, two interactions** (Forest3) when the fold is all that happens. **(b) Registered properties** (PMS) when something else drives the same values — hovering the bar brings the links back, or a quick reversal must turn from where it is: IX3 restarts from its first recorded value (§1) and jumps there.

### 2a. IX3, two interactions

```json
{ "name": "Nav | Scroll down: links out, Menu in, logo to mark",
  "scope": { "type": "site" },
  "conditionalPlayback": [{ "type": "prefers-reduced-motion", "behavior": "skip-to-end" }],
  "triggers": [{ "extensionKey": "wf:scroll", "target": { "extensionKey": "wf:body", "value": "" },
    "config": { "scrollTriggerConfig": { "start": "top -72px", "end": "bottom bottom",
      "enter": "restart", "leave": "none", "enterBack": "none", "leaveBack": "none" } } }],
  "timelines": [{ "name": "Scroll down", "actions": [
    { "id": "links-slide", "name": "Links slide out", "targets": [{ "extensionKey": "wf:attribute", "value": "[data-nav=\"links\"]" }],
      "timing": { "duration": 1, "ease": { "type": "customEase", "bezierCurve": "0.67,0,0.12,1" } },
      "properties": { "wf:transform": { "xPercent": [null, 100] } } },
    { "id": "links-fade", "name": "Links fade out", "targets": [{ "extensionKey": "wf:attribute", "value": "[data-nav=\"links\"]" }],
      "timing": { "duration": 0.6, "ease": 2 }, "properties": { "wf:transform": { "autoAlpha": [null, "0%"] } } },
    { "id": "logo-mark", "name": "Logo to mark", "targets": [{ "extensionKey": "wf:attribute", "value": "[data-nav=\"logo\"]" }],
      "timing": { "duration": 1, "ease": { "type": "customEase", "bezierCurve": "0.67,0,0.12,1" } },
      "properties": { "wf:transform": { "width": [null, "<mark width rem>"] } } },
    { "id": "menu-in", "name": "Menu button in", "targets": [],
      "timing": { "duration": 1, "ease": { "type": "customEase", "bezierCurve": "0.67,0,0.12,1" } },
      "properties": { "wf:variable": { "variable": { "variables": [{ "variableId": "<nav/scrolled id>",
        "value": { "type": "number", "value": { "value": 1, "unit": "-" } } }] } } } } ] }] }
```

"Back to top" is the same with `leaveBack: "restart"` (others `"none"`), `xPercent → 0`, `autoAlpha → "100%"`, logo width → the full width, `nav/scrolled → 0`, and the gentler curve (1.25 s `0.4,0,0.2,1`, fade 0.8 s).

### 2b. Registered properties (fold + hover)

PMS pattern (logo shrinks and links slide away after scrolling one bar height; hovering the bar brings them back): two Number variables, `nav/scrolled` and `nav/hover`, and every style computes from `S = scrolled × (1 − hover)` (`translateX(S × 100%)`, `scale()`, never `width`/`opacity` — the API flattens `calc()` with variables there, see [webflow-mcp.md](../../references/webflow-mcp.md) §9).

- Register both in head CSS: `@property --nav--scrolled { syntax: "<number>"; inherits: true; initial-value: 0; }` (same for hover), with a CSS `transition` per direction on the nav component. A transition always reverses from the current value.
- A small footer script sets `data-nav-scrolled` on the component when `scrollY` > the bar height; CSS on that attribute sets `--nav--scrolled: 1`.
- Hover: `[data-nav="bar"]:hover` sets `--nav--hover: 1`, only inside `@media (hover: hover)` so a tap on a phone does not stick.
- Keyboard: `[data-nav="bar"]:has(:focus-visible)` — **not** `:focus-within`: the menu button keeps focus after a mouse click, which kept the links out after opening and closing the menu.
- Only fold where the design's prototype does: PMS mobile has no minimised state (the owner checks the prototype per breakpoint).

## 3. Colour over dark sections

**Default: measure what is under the bar.** A footer script on scroll / resize / load reads `document.elementsFromPoint` at the bar's horizontal middle, just under it: a `[data-section="dark|light"]` wins; otherwise the first background colour with ≥ 50 % alpha decides (luminance < 0.18 = dark); a photo, video or background image counts as dark. It writes `data-nav-theme="dark|light"` on `[data-nav="component"]`; CSS switches the bar's text variables. Not while the panel is open. Measured on PMS: correct over Example Components' mixed sections, About (dark) and Home (light).

A trigger on a class or attribute is unreliable on Lumos sites: `u-theme-dark` also sits on wrappers around light sections (Example Components is one dark wrapper), and editors forget `data-section`. **IX3 alternative**, only for a site where every dark section is marked and nothing nests: sections carry `data-section="dark"` (or `"light"`), one interaction, trigger on every dark section, at the bar's middle:

```json
{ "name": "Nav | Over dark section: light text", "scope": { "type": "site" },
  "triggers": [{ "extensionKey": "wf:scroll", "target": { "extensionKey": "wf:attribute", "value": "[data-section=\"dark\"]" },
    "config": { "scrollTriggerConfig": { "start": "top 36px", "end": "bottom 36px",
      "enter": "play", "leave": "reverse", "enterBack": "play", "leaveBack": "reverse" } } }],
  "timelines": [{ "name": "Light text", "actions": [{ "id": "nav-light", "name": "Bar text to light", "tt": 3,
    "targets": [{ "extensionKey": "wf:attribute", "value": "[data-nav=\"bar\"]" }], "timing": { "duration": 0 },
    "properties": { "wf:variable": { "variable": { "variables": [
      { "variableId": "<theme text id>", "value": { "type": "ref", "value": { "variableId": "<dark-theme text swatch id>" } } },
      { "variableId": "<theme text-link/text id>", "value": { "type": "ref", "value": { "variableId": "<same swatch>" } } } ] } } } }] }] }
```

Set every theme variable the bar uses that differs in the Dark theme (an alias like `text-link/text → text` is resolved where it is defined, so set both). Accents that are the same in both themes stay. A 400 ms `transition: color` on the logo and the Menu text (Webflow styles) softens the switch; button links fade with their own transition.

**Inverted nav (owner asks for an "inverted overlap")**: `mix-blend-mode: difference` on the nav component, and the bar in a new Theme mode whose text/accent variables are *page background minus the real colour* per channel (e.g. light #f1f2f1 − dark #17241f = #daced2), so on the light page the nav shows exactly the real colours and inverts over dark content. Over dark and brand sections switch the blend off with the same measuring script (`data-nav-theme`); CSS on that attribute sets normal blend and theme colours. Also no blend while the panel is open or the skip link is focused. Do not try this with IX3 addClass: it is not removed on reverse. Recompute the two colours if the page background or the theme colours change.

**Panel cut off on pages where the bar sits lower** (a framed hero that pushes the nav wrap down with margin-top): `.w-nav-overlay` sits inside that wrap and starts with it, so the open panel leaves a strip above and loses its bottom. Pull the overlay up by the same variable in `Global | Custom Code` (`top: calc(var(--nav--spacing-outer-vertical) * -1)`, a Webflow-generated element with no class), and give the panel's padding-top the bar height *plus* that offset.

## 4. What stays in `Global | Custom Code`

```html
<style>
/* Nav | scroll fold and dark-section colour run in IX3. What stays here: */
/* Webflow's navbar CSS forces the menu button to display: block; keep the class's grid */
[data-nav="component"] .w-nav [data-nav="menu-button"].w-nav-button { display: grid; }
/* While the (light) panel is open the bar text stays dark, also over a dark section (beats the IX3 inline variables) */
[data-nav="component"]:has([data-nav="menu-button"].w--open) [data-nav="bar"] {
  --_theme---text: var(--swatch--<base text swatch>) !important; --_theme---text-link--text: var(--swatch--<base text swatch>) !important; }
/* Panel slides in from the right. Lumos pins transform: none !important on the menu, so animate `translate`.
   Open duration overrides Lumos' :root value at nav scope; close stays <= the Navbar's data-duration (400 ms). */
[data-nav="component"] { --nav--menu-open-duration: 800ms; }
@keyframes navPanelOpen { from { translate: 100% 0; } to { translate: 0 0; } }
@keyframes navPanelClose { from { translate: 0 0; } to { translate: 100% 0; } }
html [data-nav="component"]:has([data-nav="menu-button"].w--open) [data-nav="panel"] { animation-name: navPanelOpen; animation-timing-function: cubic-bezier(.25, 0, .25, 1); }
html [data-nav="component"]:has([data-nav="menu-button"]:not(.w--open)) [data-nav="panel"] { animation-name: navPanelClose; animation-timing-function: cubic-bezier(.25, 0, .25, 1); }
[data-nav="component"] .w-nav-overlay { overflow: hidden; }
@media (prefers-reduced-motion: reduce) { [data-nav="menu-roll"] { transition: none !important; } html [data-nav="component"] [data-nav="panel"] { animation-duration: 1ms !important; } }
</style>
```

The `html` prefix outranks the Lumos nav embed (same specificity, later in the page). The panel slide could move to IX3 with a Navbar trigger, but that trigger cannot be authored through the API (Designer only).

## 5. Hover

- Bar links and Menu: the site button's hover (growth line, letter roll, light → regular). Menu button: `data-trigger="hover focus"` on the Navbar button, `data-roll="text"` on both labels, weight on `nav_button_wrap` + `:hover`, label combo `font-weight: inherit`, and a `nav_button_line` (the Lumos hamburger-line class is free to reuse) absolute under the label row: `left/right: nav/spacing-outer-horizontal; top: calc(50% + <half row + gap>)`, Lumos trigger scaleX.
- **No jump**: light → regular widens a label by ~2–3 px; in a right-anchored row every link to its left moves. The letter-roll script reserves each word's regular width, unkerned like the split letters ([buttons motion](../buttons/motion.md) §7) — verify shift < 0.5 px (measured: 2.4 px without the reserve, 1.2 px with a kerned reserve, 0.2 px unkerned).
- **Underline gap**: Lumos trims text boxes to cap height, so a line at the label's bottom touches the letters. `bottom: -0.375rem` (≈ 6 px) on the line in the Text variants.
- Labels that Webflow re-renders after load (Preview after an edit, CMS) are re-split by the script's MutationObserver.

## 6. Inside the open panel

**A dropdown (region / language picker).** Webflow's Navbar closes the menu on every click outside the panel **and** on every link click inside it, and Webflow Popovers are not enabled on every site ("Popovers are not enabled"). Working: the dropdown is a block inside the menu panel; a small script stops the toggle click and the closing click (capture listener on the dropdown) and sets an attribute; CSS does the rest (open state, position). It closes on its close button, a click beside it, Esc and when the menu closes.

**Sequencing on close.** When closing the menu, an element that slides back (a language label returning behind the Contact button) and links that reappear must not run at the same time: links fade in only after the slide (e.g. slide 400 ms, links 300 ms with a 400 ms delay). Measure that both are never visible together.

## 7. Verify

[scripts/nav-check.mjs](scripts/nav-check.mjs) on the published page: top, scrolled, back to top, quick reversal, panel open and closed, per width; `--dark` injects a light/dark/light section set into the HTML so the colour switch can be tested before the site has dark sections; `--hover` measures neighbour shift while hovering each bar link and the Menu button. Report the numbers in the hand-over; tune one value per round (`Was | Now`).
