# Motion — one basis for every project

The kit's single source for how things move. Skills (interactions, navigation, buttons, cards, review) point here and add only what is specific to them. A project's `decisions/motion.md` overrides these values; without one, these are the values, from the first version — the user tunes from a smooth start, not from a jump.

## 1. Principles

- **Smooth from v1.** Anything that opens, closes, appears or changes state animates in the first build. A FAQ that snaps open or a dropdown that pops in is unfinished work, not a later polish pass.
- **Reverses from where it is.** A click or hover halfway turns the motion around from its current position, never jumps to an end state first. That rules out anything that restarts from a recorded start value (IX3 timelines, see §3).
- **Nothing jumps.** Only `transform` and `opacity` move, except a height that opens (§4). The resting box and the active box have the same size; lines and borders that appear are out of the flow or turn transparent instead of disappearing.
- **One thing at a time.** What closes finishes before what opens starts (switching dropdowns, menu content before its panel).
- **Hover: in slower than out.** Everything else that opens and closes: same speed both ways.
- **Calm.** Short distances (0.25–0.5rem for accents, 24–32 px for reveals), no bounce, no overshoot unless the design draws it.
- **Reduced motion:** state changes happen instantly, nothing stays hidden, nothing scrolls smoothly.

## 2. Tokens (kit defaults)

| Token | Value | For |
|---|---|---|
| `fast` | 200 ms `ease` | colour, opacity of overlays, a line or arrow going **out** |
| `hover` | in 350 ms / out 200 ms, `ease` | lines, arrows, icon shifts, card image scale (1 → 1.04) |
| `hover-large` | in 450 ms / out 250 ms | a fill or accent that covers the whole button |
| `open` | 400 ms `cubic-bezier(.4, 0, .2, 1)`, both ways | accordion / FAQ, nav dropdown, mobile menu panel (= Lumos `--nav--*-open/close-duration` 400 ms) |
| `content-in` | 300 ms `ease`, starts after `open` − 100 ms, +60 ms per item, max 3 steps | links inside a menu or panel that just opened |
| `content-out` | 150 ms `ease`, no stagger | the same content when it closes, before its panel |
| `panel-large` | 600 ms in / 400 ms out, `cubic-bezier(.25, 0, .25, 1)` | a full-screen panel that slides in |
| `reveal` | 600–700 ms `cubic-bezier(.22, 1, .36, 1)` (≈ `power3.out`), 24–32 px, stagger 80–120 ms | scroll reveals |
| `scroll` | Lenis, 0.42 s, expo-out | smooth scrolling, optional (§7) |

Copy a design's cubic-beziers literally; never round them to a preset. Record every deviation in `decisions/motion.md` with who asked.

## 3. Mechanism — one ladder

Pick the first rung that can do it:

1. **CSS in Webflow styles** — hovers with Lumos trigger variables ([buttons/motion.md](../skills/buttons/motion.md) §3: per-direction timing in one `calc()`); colour hovers with native `:hover` (the agent cannot write the trigger recipe for colours, [webflow-mcp.md](webflow-mcp.md) §2).
2. **Lumos components' own behaviour** — Accordion, Nav dropdowns, Navbar menu, Modal, Slider: keep their script and tune their timing (§4, §5).
3. **CSS in the site's custom-code block** for what the style panel cannot write: `@keyframes`, `grid-template-rows` transitions on Webflow-generated elements, `@property`, `@media (prefers-reduced-motion)`. Where that block lives: §8.
4. **IX3 (Webflow Interactions)** for scroll-, load- and click-driven **sequences** the owner should edit in the Interactions panel (scroll fold, staged entrances). Not for hovers with in ≠ out, not for anything that must reverse mid-way: IX3 restarts a tween from the value it recorded first ([navigation/motion.md](../skills/navigation/motion.md) §1).
5. **A small script** on the GSAP Webflow loads (Site settings › GSAP; never our own copy), targeting `data-*` attributes — for `height: auto` on hover, letter rolls, measuring what is under the bar.

Triggers: `data-trigger="hover"` (cards: `hover-if-clickable`). **Not `focus`**: Lumos' focus trigger is "contains focus", so after a mouse click the element keeps its hover state. Keyboard users get the Lumos focus ring (`:focus-visible`). Where a hover state must also show for the keyboard, use `:has(:focus-visible)`, never `:focus-within`. Wrap style hovers in `@media (hover: hover)` where a tap would leave them on ([interactions/patterns.md](../skills/interactions/patterns.md), "A tap leaves :hover").

## 4. Open and close: accordion / FAQ

**Default: the Lumos `Accordion List`**, adapted in place (lumos-rules §10). It already does the right things: `aria-expanded` / `aria-controls`, a GSAP timeline from `height: 0` to `auto` that **reverses** when clicked halfway, CMS items flattened into the list, and marketer props (Close Previous, Close On Second Click, Open By Default: Item #, Preview Content for the Designer). It needs Site settings › GSAP on.

Tune it to the tokens: its timeline defaults are `duration: 0.3, ease: "power1.inOut"`; set `0.4` and the `open` curve (`ease: "M0,0 C0.4,0 0.2,1 1,1"` with CustomEase, or `"power2.inOut"` when CustomEase is off) in the Accordion List's script embed. Add, in the same task:

- the icon turns with the same duration and curve (`transition: transform 400ms cubic-bezier(.4,0,.2,1)` on the icon under `[aria-expanded="true"]`);
- the answer's padding sits **inside** the animated wrapper (`accordion_content_padding`), so the height animation includes it and nothing jumps at the end;
- reduced motion: `gsap.matchMedia()` or a `duration: 0` branch — open and close instantly.

Measured (Nov 2026, the starter's markup and script in Chrome, not yet on a published site): out of the box 0.28 s, reverses mid-way without a jump, ends on `height: auto`, but **ignores reduced motion** and its icon turns in 0.2 s, ahead of the panel; tuned as above: 0.38 s, the same reversal, instant with reduced motion.

Library sites: Lumos' accordion flattens `u-display-contents` wrappers by class, and an Accept strips that class on the installing site. Check the flatten against `[data-display="contents"]` too ([library-sites.md](library-sites.md)).

**When the Lumos Accordion is not the base** (a FAQ that is its own component, a "read more" panel): CSS only, no height measuring.

```css
/* wrapper animates rows 0fr → 1fr; the child clips. Reverses mid-way by itself. */
[data-collapse] { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 400ms cubic-bezier(.4,0,.2,1), visibility 0s linear 400ms; visibility: hidden; }
[data-collapse] > * { overflow: hidden; min-height: 0; }
[data-collapse-item][data-open] [data-collapse] { grid-template-rows: 1fr; visibility: visible; transition: grid-template-rows 400ms cubic-bezier(.4,0,.2,1), visibility 0s; }
html.wf-design-mode [data-collapse] { grid-template-rows: 1fr; visibility: visible; } /* Designer shows the answer */
@media (prefers-reduced-motion: reduce) { [data-collapse] { transition: none; } }
```

A few lines of script toggle `data-open` on the item and `aria-expanded` on its `<button>` (plus `aria-controls`); the button can sit inside a heading, so the state lives on the item, not on a sibling selector; `visibility` keeps a closed answer out of the tab order and away from screen readers. The Web Animations version (measure height, animate, keep the running animation to reverse from) is equivalent and fine where it already runs; do not add it next to this one.

## 5. Navigation

Two patterns; the design decides which (the [navigation](../skills/navigation/SKILL.md) skill's inventory):

**A. Dropdowns on desktop, a menu panel on mobile** (the Lumos starter `Nav`). Keep Lumos' nav CSS: dropdown lists already animate `grid-template-rows` 0fr → 1fr over `--nav--dropdown-open-duration` / `-close-duration` (400 ms). Add:

1. **Close before open when switching**: the open list closes over the close duration, the next opens after it (`transition-delay: var(--nav--dropdown-close-duration)` on the list that opens while another toggle is still `.w--open`; a capture click listener on the toggles sets a short-lived `data-nav-switch` to apply that delay).
2. **Visible until closed**: on close, `opacity` and `visibility` switch only after the height reaches 0 (`opacity 0s linear <close>, visibility 0s linear <close>`), so the panel slides shut instead of vanishing.
3. **Backdrop** fades with the same duration as the list.
4. **Bar background** that turns solid when a dropdown or the menu opens: on at once (no flash of the dark backdrop through the bar), off with `fast` **after** the close duration. A registered `@property` number with the transition only on that property, so it never lags behind scrolling.
5. **Mobile menu**: the panel opens with Lumos' `menuOpen` keyframes (400 ms), then its content with `content-in` (keyframes, not transitions: the menu comes from `display: none`); on close the content goes first with `content-out`. Focus stays inside the open menu (Tab loops between the menu button and the menu's links; Esc closes), the menu button's label in the site's language.

**B. One panel at every width** (full-screen panel, Menu ↔ Close): [navigation/motion.md](../skills/navigation/motion.md) §2–§4 — scroll fold, `panel-large`, sequencing on close.

Both: a bar that shrinks or changes colour on scroll follows the scroll position (a variable the script sets from `scrollY`, no transition) so it is in place the moment scrolling stops; never `[style*=…]` inside `:has()` (scroll lag, [interactions/patterns.md](../skills/interactions/patterns.md)).

## 6. Overlays, modals, search

Overlay `opacity` with `fast`, `visibility 0s linear 200ms` on close; the panel inside moves 0.5–1rem with the same timing. Scroll lock on `body` while open. Focus to the first field on open, back to the trigger on close, Esc closes. Lumos Modal traps: [interactions/patterns.md](../skills/interactions/patterns.md).

## 7. Smooth scrolling (optional, ask once per project)

Lenis only (sticky, IX3 scroll triggers and page transitions keep working), pinned version, only with `(hover: hover) and (pointer: fine)`, not with reduced motion, not in an iframe or the Designer (`html.wf-design-mode`). Duration 0.42 s, expo-out; it stops by itself while `body` has `overflow: hidden` (open menu); `data-lenis-prevent` on scroll areas inside the page. Expose the instance on `window` so anchor scripts can use `lenis.scrollTo`.

## 8. Where the code lives

- **A normal site:** the `Global | Custom Code` component ([interactions](../skills/interactions/SKILL.md) §1): a style-only embed (the canvas skips any embed with a `<script>`, its CSS included) and a script embed.
- **A Shared Library and the sites that install it:** CSS in the library's global-styles embed with attribute selectors (`[data-…]`, or `[class*="…"]`, which survives the library prefix); scripts that belong to one component in that component's own embed. Never class names alone ([library-sites.md](library-sites.md)).
- Head only for what must run before first paint (the reveal gate).
- Every block starts with a comment: what it does, who decided, the date, how to switch it off.

## 9. Test it the way people use it

For every element that moves, at 1440 and 375, in Chrome and once in WebKit (iPhone):

- three times in a row; once interrupted halfway (it must turn around, not jump); straight to the neighbour (dropdown A → B: A closes fully before B opens);
- the rest state comes back every time; nothing below the element shifts when it changes state (measure, < 0.5 px);
- keyboard: Tab reaches it, Enter/Space toggles, Esc closes, the focus ring shows, focus never lands behind an open menu;
- reduced motion: everything works and is visible, nothing animates;
- the Designer canvas shows a readable first state.

Report the numbers in the hand-over and tune one value per round (`Was | Now`, 20–25 % per step).
