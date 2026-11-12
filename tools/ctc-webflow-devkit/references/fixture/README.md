# Fixture — measure a pending change in a real browser

Loads a published page in headless Chrome, patches the pending change into it before the page renders, then measures and screenshots the block at each width. No publish, no Designer. Used by verify.md §2b.

Once: `npm install` in this folder (installs `playwright-core`; it drives the Google Chrome already on the machine).

```
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/measure.mjs references/<block>/fixture.json [--width 1440] [--headed]
```

The spec lives in the client repo so the check can be rerun after the next change. Its shape is documented at the top of `measure.mjs`: the page URL, the widths, the CSS the new classes read back with, the markup and where it goes (`selector` + `position`, as `insertAdjacentHTML`), the element to screenshot, the selectors to measure, and elements to hide first (a fixed navbar over the shot).

Fixture CSS must use the **exact emitted variable names** (`--_spacing---section-space--small`, `--_text-space---…`): a grep for a short name matches it as a substring of the real one, and a wrong name silently resolves to nothing.

Output, per width, in the spec's `out` directory: `<width>.png`, `<width>.json` (rect, text rect, computed spacing and type, gap to the previous match, overflow) and one `summary.md` with the numbers side by side. Compare the PNG against the design frame at the design's width; read `summary.md` for the gaps.

## seo-audit.mjs

The SEO checklist in a real browser ([seo](../../skills/seo/SKILL.md) §7, [audit.md](../../skills/seo/audit.md)): per URL ok / warning / error for structure (nav › main › footer), robots.txt pagination rules, headings, meta and Open Graph, alt and video captions, link names and crawlable nav, lazy loading, the LCP image, fonts and CLS, and JSON-LD, with the Webflow fix under each finding. Input: `--sitemap <url> [--per-folder 3] [--limit N]`, `--urls file`, `--base <url> --paths file`, or URLs as arguments; `--overview "/blog,/news"` marks overview pages; `--mobile` for phone size; `--out <dir>` writes `seo-audit.md` and `.json`. Block mode for one component while it is built: `--block "<selector>"` (`--allow-h1`, `--overview-block`), and `--inject pending.html --at <selector>` for a block that is not published yet ([seo-blocks.md](../seo-blocks.md)). Exit code 1 on errors.

## accept-check.mjs

Before/after check around a shared-library Accept ([library-sites.md](../library-sites.md)): `node accept-check.mjs snapshot before.json <url…> [--widths 1440,375]`, Accept and publish, `snapshot after.json` with the same URLs, then `node accept-check.mjs compare before.json after.json`. Lists every page/width where a block moved or resized, the page height changed, horizontal overflow appeared, or an element changed between `display: contents/none` and anything else. Exit code 1 when something changed.
