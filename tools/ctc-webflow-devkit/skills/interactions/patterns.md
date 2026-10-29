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

- Frames as Webflow assets (one folder per device), plus one frame-list JSON per device in the asset store: `{base, w, h, files[]}`. Keep the designer's bytes; a second lossy encode is visibly worse. Every 2nd–4th frame is enough. Drop identical end frames (Webflow dedupes them to one id, see [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §5).
- Component: wrap (`data-sequence`, frame-list URLs as string props → attributes) › fallback Lumos `Visual Image` (flattened onto the frame background; shown in the Designer, with reduced motion, Save-Data, or any load error) + `canvas` (`aria-hidden`).
- Script: progress over the section's scroll range → frame, eased toward the target, nearest loaded frame drawn cover-fit with `imageSmoothingQuality = 'high'`. Portrait screens use the mobile list. State on the wrap: `data-sequence-state="loading|ready|off"`.
- **Load after `window.load`** (earlier holds the load event back and every IX3 load interaction waits with it), and only a **window** around the scroll position (intro frames, then ~4 behind to ~48 ahead, coarse to fine). A visitor at the top then downloads ~2 MB, not the whole set.
- For a sharp image on retina, ask the designer for a numbered PNG/JPG/WebP render at 2× (2880 × 1800 desktop), not a Lottie.

## Hover that slides open (script on Webflow's GSAP)

For what CSS cannot do on hover — a description that slides open to `height: auto`, a photo that follows the cursor. PMS `card-hover.js` / `link-preview.js`:

- The rest state lives in the classes, so the Designer and a blocked script show the closed card.
- `gsap.to(..., { overwrite: 'auto' })` so a quick in-out-in reverses from where it is. Do not `gsap.killTweensOf` the element in a reset when a `quickTo` drives it too (it killed the cursor follow).
- Targets and options through `data-*`; a component variant is read from `data-wf--<component>--variant`.
- Only under `matchMedia('(hover: hover) and (min-width: 768px)')`; on a breakpoint change `clearProps` and rebind. Keyboard through `:focus-visible` / `focusin`.
- On touch a scroll-driven version waits for the scroll to settle (PMS: photo only after 250 ms still, 1.2 s cross-fade), or it flickers while scrolling.
- Test with the hover matrix (three in a row, cut off, neighbour), not one pass.

## Sliders, video and forms — traps

- **Lumos Slider (Swiper)** has keyboard control on: arrow keys in a control inside a slide (a range input, a video scrubber) move the slider. Stop it with `stopPropagation` on the control's `keydown`. Swiper loads once per slider embed; with several sliders on a page, guard the loader so it loads once.
- **Sound on hover** only after `navigator.userActivation.hasBeenActive`: before the visitor's first click Chrome pauses a video that unmutes. Test with the real autoplay policy — not `--autoplay-policy=no-user-gesture-required`, which hides the bug.
- **Lumos Modal:** never put `data-modal-trigger` on an element that contains its Modal — clicks inside reopen it, so Close and the backdrop fail. Keep trigger and modal siblings. A modal inside an item hidden by a filter opens at 0×0 and locks scrolling.
- **Forms with a server step** (a booking calendar, a CRM lookup): a small app on Webflow Cloud (`webflow cloud init`, Astro) mounted on the site, the secret set with `pbpaste | webflow apps env-vars set NAME --secret` so the agent never sees it. `webflow auth login` writes `.env` into the repo (gitignored), the login is per machine, and adding a site is `webflow auth login --force` with the other sites kept ticked. The mount path answers only after a site publish.

## Checking timing headlessly

Serve the live page's HTML with the new code patched in (request interception), then sample at intervals: `getComputedStyle(el).opacity`, the indicator's `getBoundingClientRect().width`, which item carries the active class. Log timestamps; compare with the plan's numbers.
