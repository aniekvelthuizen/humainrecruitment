# Interaction patterns

## Attribute-driven reveal

One script, loaded once, reads attributes and builds the animations. Elements carry intent, not code.

| Attribute | Meaning |
|---|---|
| `data-reveal="up\|down\|left\|right\|fade\|scale\|blur\|clip\|line\|lines\|words\|count"` | preset, default `up` |
| `data-reveal-delay` / `data-reveal-duration` | seconds |
| `data-reveal-distance` | travel in px |
| `data-reveal-start` | ScrollTrigger start, default `top 85%` |
| `data-reveal-stagger` | on a container: children in sequence. Expand `display: contents` wrappers (Webflow slots, `u-display-contents`) to reach the real children |
| `data-reveal-css` | on a wrapper: the script skips it, CSS owns the entrance (above the fold) |

GSAP core, ScrollTrigger and SplitText are free (3.13+) and **Webflow loads them**: turn them on in Site settings › GSAP (the IX3 runtime uses the same copy) and await `window.gsap` — never load a copy of our own, which would run a second GSAP next to Webflow's. `lines` / `words` wait for `document.fonts.ready` and revert the split after playing, so later resizes are safe.

## The gate

```html
<!-- head, before any CSS that hides -->
<script>(function(){var h=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.dataset.anim='on';setTimeout(function(){if(!window.__revealReady)h.dataset.anim='off'},6000)})()</script>
<style>
html[data-anim="on"] [data-reveal]:not([data-reveal-stagger]),
html[data-anim="on"] [data-reveal-stagger] > :not(.u-display-contents),
html[data-anim="on"] [data-reveal-stagger] > .u-display-contents > * { visibility: hidden }
</style>
```

The gate lives in the **head**: a gate set from the footer arrives after the first paint and the content flashes. The time-out checks the reveal script's own ready flag (`window.__revealReady`, set once it has initialised), not `window.gsap`: GSAP can load while the script still fails. The footer script sets the flag, or sets the gate `off` on any error. Stagger children are hidden too, one level through `u-display-contents` wrappers; anything the CSS cannot reach (a `data-reveal-items` selector) will flash and is named as such. Elements inside a `data-reveal-css` scope get `visibility: visible; opacity: 0` plus a keyframe animation from the same head block.

## Above the fold: CSS, not a script

On pages with heavy bundles (code components, Rive, third-party scripts) the main thread is busy right after parse and a GSAP entrance starts late, which reads as an empty hero. A CSS keyframe (opacity + translateY) starts at first paint and runs on the compositor. Trade-off: headlines rise as a block, not line by line.

## Autoplay with a progress indicator

- One clock drives both: the indicator's fill and the advance use the same duration constant.
- Fill left → right, then the start edge follows to the end (retreat) at the same speed, then advance. One item lasts fill + retreat (4.5 s + 4.5 s by default).
- A click: cancel the running timeline, set the clicked item active, start its fill from zero.
- Initial markup: first item active in CSS, so the Designer shows it; the script takes over inline state at runtime and owns it (the reveal script leaves those elements alone).
- On mobile the tab row scrolls horizontally; scroll the active tab into view on advance.

## Scroll-scrubbed frame sequence (a "Lottie" made of photos)

A designer's Image-to-Lottie export is photo frames base64'd in one JSON (60 MB+): never a Webflow Lottie. Take the frames out and draw them on a canvas by scroll.

- Frames as Webflow assets (one folder per device), plus one frame-list JSON per device in the asset store: `{base, w, h, files[]}`. Keep the designer's bytes; a second lossy encode is visibly worse. Every 2nd–4th frame is enough. Drop identical end frames (Webflow dedupes them to one id, see [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §7).
- Component: wrap (`data-sequence`, frame-list URLs as string props → attributes) › fallback Lumos `Visual Image` (flattened onto the frame background; shown in the Designer, with reduced motion, Save-Data, or any load error) + `canvas` (`aria-hidden`).
- Script: progress over the section's scroll range → frame, eased toward the target, nearest loaded frame drawn cover-fit with `imageSmoothingQuality = 'high'`. Portrait screens use the mobile list. State on the wrap: `data-sequence-state="loading|ready|off"`.
- **Load after `window.load`** (earlier holds the load event back and every IX3 load interaction waits with it), and only a **window** around the scroll position (intro frames, then ~4 behind to ~48 ahead, coarse to fine). A visitor at the top then downloads ~2 MB, not the whole set.
- For a sharp image on retina, ask the designer for a numbered PNG/JPG/WebP render at 2× (2880 × 1800 desktop), not a Lottie.

## Hover that slides open (script on Webflow's GSAP)

For what CSS cannot do on hover — a description that slides open to `height: auto` (a card-hover script), a photo that follows the cursor (a link-preview script):

- The rest state lives in the classes, so the Designer and a blocked script show the closed card.
- `gsap.to(..., { overwrite: 'auto' })` so a quick in-out-in reverses from where it is. Do not `gsap.killTweensOf` the element in a reset when a `quickTo` drives it too (it killed the cursor follow).
- Targets and options through `data-*`; a component variant is read from `data-wf--<component>--variant`.
- Only under `matchMedia('(hover: hover) and (min-width: 768px)')`; on a breakpoint change `clearProps` and rebind. Keyboard through `:focus-visible` / `focusin`.
- On touch a scroll-driven version waits for the scroll to settle (e.g. photo only after 250 ms still, 1.2 s cross-fade), or it flickers while scrolling.
- Test with the hover matrix ([references/motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §9), not one pass.
- **A tap leaves `:hover` (and `:focus-within`) on in touch browsers**, so a Webflow-style hover state sticks after a tap (seen: a card's theme switched to Dark on hover, the photo behind it did not slide in: white text on a light photo). Put style hovers inside `@media (hover: hover)`, or reset them in `@media (hover: none)` with `:not(:has(:focus-visible))` so keyboard focus keeps the state. A reset of a theme switch lists every variable the mode changes: extend it when a theme variable is added.

## Sliders, video and forms — traps

- **A row that scrolls sideways and bleeds to one screen edge bleeds to both**: the row is the scroll container, so cards scrolled out on the other side are cut off at the column edge. On the row: `margin-left/right: calc(50% - 50vw)` and `padding-left/right: calc(50vw - 50%)`, its parent `container-type: inline-size`, children `scroll-snap-align: start`. `scroll-padding` percentages resolve against the row itself, so `calc(50vw - 50%)` there is 0 and snapping parks the first card on the screen edge → `scroll-padding-left: calc((100vw - 100cqw) / 2)`. These are literal calcs (no variables): Webflow styles, set in the Designer UI if the API refuses one, never an embed. `page_wrap`'s `overflow: clip` keeps `100vw` (which counts a classic Windows scrollbar) from causing page scroll (Nov 2026).
- **Lumos Slider (Swiper)** has keyboard control on: arrow keys in a control inside a slide (a range input, a video scrubber) move the slider. Stop it with `stopPropagation` on the control's `keydown`. Swiper loads once per slider embed; with several sliders on a page, guard the loader so it loads once.
- **Sound on hover** only after `navigator.userActivation.hasBeenActive`: before the visitor's first click Chrome pauses a video that unmutes. Test with the real autoplay policy — not `--autoplay-policy=no-user-gesture-required`, which hides the bug.
- **Lumos Modal focus in WebKit:** it opens with `showModal()`, and the dialog focuses its first focusable element: in WebKit the close button with `:focus-visible` (a blue, turned cross with a ring after a tap), in Chrome the scrollable `modal_scroll`. Give `modal_scroll` `tabindex="-1"` in the Modal definition so the panel gets the focus everywhere, and take its ring off (`:focus` / `:focus-visible` on the class, plus `.modal_scroll[tabindex]:focus-visible { outline: none }` in the Modal's CSS embed, or Lumos' `[tabindex]:focus-visible` wins). Tab then goes to the close button with its ring (Oct 2026).
- **Lumos Modal:** never put `data-modal-trigger` on an element that contains its Modal — clicks inside reopen it, so Close and the backdrop fail. Keep trigger and modal siblings. A modal inside an item hidden by a filter opens at 0×0 and locks scrolling.
- **Forms with a server step** (a booking calendar, a CRM lookup): a small app on Webflow Cloud (`webflow cloud init`, Astro) mounted on the site, the secret set with `pbpaste | webflow apps env-vars set NAME --secret` so the agent never sees it. `webflow auth login` writes `.env` into the repo (gitignored), the login is per machine, and adding a site is `webflow auth login --force` with the other sites kept ticked. The mount path answers only after a site publish.

## Split text and smooth scroll — browser traps

- **IX3 split text in WebKit:** the letter masks are `inline-block` with `overflow: clip`. WebKit puts such a box's baseline on its bottom edge and adds the descender under every line (line height ~1.47 instead of 1.2); Chrome treats `clip` as `visible`. Site-wide in the head: `.gsap_split_letter-mask { vertical-align: top; }` — WebKit then equals Chrome, Chrome unchanged (Oct 2026: "the h2 line height is too big", reported from an iPhone).
- **Smooth scrolling** ([references/motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §7): Lenis lets the browser scroll itself, so sticky elements, IX3 scroll triggers, nav scripts and View Transition page changes keep working (measured). Smoothers that move the page (GSAP ScrollSmoother, Locomotive) break sticky and page transitions.
- **No `[style*=…]` inside `:has()`** (e.g. `[data-nav]:has(.w-nav-overlay[style*="block"])`). Chrome then re-runs a `:has()` invalidation walk up the tree on every inline-style write anywhere on the page; GSAP, IX3, Lenis and text scripts write styles every scroll frame, so each frame restyles the page and Lenis' `scrollTo` stalls: scrolling feels laggy on every page that has the rule. Use a class or data attribute the script sets (Nov 2026: three nav rules made the whole site scroll laggy).

## Checking timing headlessly

Serve the live page's HTML with the new code patched in (request interception), then sample at intervals: `getComputedStyle(el).opacity`, the indicator's `getBoundingClientRect().width`, which item carries the active class. Log timestamps; compare with the plan's numbers.
