# Fixture — measure a pending change in a real browser

Loads a published page in headless Chrome, patches the pending change into it before the page renders, then measures and screenshots the block at each width. No publish, no Designer. Used by verify.md §2b.

Once: `npm install` in this folder (installs `playwright-core`; it drives the Google Chrome already on the machine).

```
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/measure.mjs references/<block>/fixture.json [--width 1440] [--headed]
```

The spec lives in the client repo so the check can be rerun after the next change. Its shape is documented at the top of `measure.mjs`: the page URL, the widths, the CSS the new classes read back with, the markup and where it goes (`selector` + `position`, as `insertAdjacentHTML`), the element to screenshot, the selectors to measure, and elements to hide first (a fixed navbar over the shot).

Output, per width, in the spec's `out` directory: `<width>.png`, `<width>.json` (rect, text rect, computed spacing and type, gap to the previous match, overflow) and one `summary.md` with the numbers side by side. Compare the PNG against the design frame at the design's width; read `summary.md` for the gaps.
