# Verifying a build

Verification is a comparison: the Figma render (or the user's screenshot, the copy document, or — for a build from a brief — the exemplar section on the site) against the built thing. "The call succeeded" is never the criterion. The aim is the closest possible match to the design; the user's screenshot confirms that, it should not be the first place a defect shows up.

## 1. Read back after every write

`query_elements` on the new subtree; `query_styles` with `include_properties` on new classes. Mandatory after any `calc` or geometry write. Twenty writes then one check is how a bad assumption reaches a finished page; check per group.

## 2. Snapshot yourself first

`element_snapshot_tool` on the built element, then compare with `references/figma/<page>/section-NN.png`. Fix what you can see: spacing, colour, alignment, missing pieces. Then hand over to the user.

Snapshot limits, so a mismatch here is not always a bug: it loads no custom fonts (geometry only), runs no `:hover`, renders the element in isolation (white on light is invisible), stitches tall elements with seams, runs no page-level CSS (a Lumos Clickable `<button>` shows as a grey box because the Global Styles reset is missing) and draws CSS `mask-image` as a solid square. It cannot snapshot an element that is hidden until opened (a nav panel, a modal) and plays no IX3 interaction or custom code — measure those in a browser (the navigation skill's `nav-check.mjs`). Snapshot a card, not a whole section. It needs the Designer open on the right page with the tab in front; its only error is `status: false`, and `designer_tool > get_current_page` gives the readable reason.

## 2b. No Designer: measure in a browser

When the snapshot is unavailable, the staging domain (`project.json` `site.stagingDomain`) serves the last publish. Open the page in a browser (headless Chrome is fine) and measure: `getBoundingClientRect` for boxes and gaps, `getComputedStyle` for what actually applies, and `document.createRange().selectNodeContents(el).getBoundingClientRect()` for where the **text** sits, which catches indents the element box hides. To preview a pending change, inject a `<style>` mimicking it before writing. Compare against the PNG at the design's width, then resize to each breakpoint.

**After a publish, check the CSS hash first**: the HTML can already be new while the page still loads the previous `webflow.shared.*.css`; measuring then reports old values. Compare the stylesheet URL with a fresh load before measuring.

A build since the last publish is not on staging, but it can still be checked: **patch the pending change into the published page** with the kit's fixture (`references/<block>/fixture.json` + `measure.mjs`), which renders the real page in headless Chrome with the site's own fonts and neighbours, no publish and no Designer, and writes a screenshot, measurements and a summary per width. Spec, command and pitfalls: [fixture/README.md](fixture/README.md).

**Unpublished motion or scripts:** serve the published HTML with the new embed or the patched `webflow.*.js` swapped in (request interception; [webflow-mcp.md](webflow-mcp.md) §8 for IX3) and sample in headless Chrome. Also measure the page's load event: a script that loads heavy files before `load` delays every IX3 load interaction with it.

**Unpublished, but the Designer is open in the client's Designer Chrome (`chrome-<client>`, [designer/README.md](designer/README.md) "Which Chrome"):** the canvas is a same-origin iframe, so it can be measured at exact widths without a publish. In the Designer tab, `document.getElementById('site-iframe-next')` → set its inline `width`, `min-width` and `max-width` to the width (1440, 1280, 992, 990, 767, 375), wait ~1 s, read `getBoundingClientRect` / `getComputedStyle` / text ranges from its `contentDocument`, and clear the inline style afterwards (if the canvas then stays narrow, reload the Designer tab). Breakpoint rules apply, CSS masks and fonts render (unlike `element_snapshot_tool`); scripts, IX3 and hover do not. At exactly 991 px the ≤ 991 rule may not match in the canvas — use 990. Reload the Designer tab before measuring after API writes ([designer/README.md](designer/README.md), "Reload").

**Without touching the canvas** (another session uses the Designer, or the bridge is down): clone the canvas CSS into test frames. In a Designer tab, read the canvas document's stylesheets as CSSOM rules (not `<style>` textContent), write them plus the section's markup into `srcdoc` iframes at each width, and measure there. Give the test iframes `border: 0` (a border makes 992 measure as 988); test 990, not 991. The canvas only emits CSS for enabled breakpoints. Behaviour (transitions, video, motion) is tested in headless Chrome, not in a background tab ([designer/README.md](designer/README.md), "Background").

**One Designer, several sessions** ([designer/README.md](designer/README.md) "Which Chrome"): no Designer clicks or page switches while another session is busy in it.

Do not hand the user a menu of ways to check it, and never ask for a publish to verify your own work. If the user has published anyway, measure against the live URL.

**Phone feedback is measured in WebKit too**: owners test on an iPhone (Safari). Re-measure every mobile complaint in Playwright `webkit` with `devices['iPhone 15']`, next to Chrome at 375 × 812 with touch. A difference between the two means the cause is in WebKit (Oct 2026: three complaints did not exist in Chrome — split-text line height, a modal's close button with a focus ring, a hover stuck after a tap; [interactions/patterns.md](../skills/interactions/patterns.md)).

**Page transitions (View Transitions) are judged in Safari or a clean Chrome**: while `chrome-devtools` (or any debug connection) is attached to a Chrome, a new page gets a viewport a few px taller and Chrome aborts the transition ("Viewport size changed"), so it looks broken. Headless Chrome and Chrome with DevTools do not prerender either. Open a separate Chrome without a debug port: `open -na "Google Chrome" --args --user-data-dir=/tmp/<client>-clean --no-first-run <url>`.

**Close only your own browsers.** A measuring script ends with `browser.close()`, or kills its own PID or profile path; never `pkill` or "all headless Chromes": other sessions measure at the same time (Oct 2026: a reviewer's `pkill -f headless` stopped another session's measurement). Headless Chromes left running also stop Chrome from opening via its Dock icon (macOS activates the invisible one); check `ps` for your own leftovers when that happens. Put "close only your own browsers, never pkill" literally in every brief to a subagent.

When none of these is possible the unit stays unverified and you say so; no snapshot, no browser measurement and no fixture means not done.

Published-page only: Finsweet attributes need `window.Webflow`, so test them on staging, not a bare fixture page. Media autoplay with the browser's real autoplay policy. Forms up to the bot check (Turnstile blocks a headless submit; the owner makes one real test submission).

## 2c. Pre-hand-over checklist

Run it on every unit. Each line is a defect that has shipped past a screenshot before.

**Responsive**
- [ ] Checked at the design width and at every screen size the site defines; no text overflows its frame, no horizontal page scroll.
- [ ] Every size in `rem` (or `em` beside fluid text); no `px`.
- [ ] The small-screen layout is the reflow a reader expects — cards go 4 → 2 → 1, rows wrap, columns stack. A scroller, slider or carousel appears only where the design draws one or the plan named it.

**Spacing**
- [ ] Every gap, padding and margin in the section equals the design's value: between items, inside an item, heading to text, text to button. Measured, not eyeballed, and not rounded to the nearest scale step.
- [ ] No distance silently dropped because the frame looked flush.
- [ ] The section shell — rails, top and bottom borders, corner marks, outer spacing — matches the neighbouring sections on the same page, whether or not this Figma frame draws them.

**Text boxes**
- [ ] Webflow's default `h1–h6` / `p` margins are reset on every text class, including text elements that carry only a shared site class and no combo of yours.
- [ ] The site's leading-trim rule (a global `::before`/`::after` on headings and paragraphs, often in custom code) is either wanted or opted out. Figma frames are untrimmed, so frame-to-frame gaps render tight under a trim.
- [ ] A shared "label" or "eyebrow" class that is `display: flex` with a gap: a pseudo-element becomes a flex item and the gap indents the text. Measure the text position, not the box.
- [ ] A `font-weight` is set together with a `font-family` that actually ships that weight; otherwise the browser synthesises it. Check `references/fonts.json`.
- [ ] Sizes measured per section: two sections' eyebrows or labels can differ in the same design. Do not copy a size from the previous section.

**Geometry**
- [ ] Every direct child of the Figma section frame is built: decoration (corner marks, crosshairs, rules) often sits beside the content tree, not in it.
- [ ] Vector orientation confirmed from the render or a pixel decode, never from an exported path; an export drops the node's rotation.
- [ ] Numbers in chips and icons in boxes centred on both axes; check against the render, not the maths.
- [ ] Line breaks of headlines and card titles match the design; a sub-pixel narrower column wraps a line. Check at the **narrowest** design width too (375): measure each line with `Range.getClientRects()` — a fixed-size heading that fits Figma by 1 px wraps to an extra line in the browser. Fix with one step smaller size on the `tiny` breakpoint only, named as a deviation in the hand-over.
- [ ] Component variants checked by computed style, not by name ("Blue" may be a tint, the solid one "Primary").
- [ ] Walked the design frame **element by element**, not judged as a whole: every divider, corner mark, icon, bullet, eyebrow, badge and border accounted for, every text weight and size, every line break. A section that reads right at a glance and is wrong in five small places is the normal failure.
- [ ] Anything the design means to be interactive actually works, and nothing shifts position when it changes state.
- [ ] Dragged every slider both ways and past its ends, clicked every tab and arrow, and **looked at it during and after**: nothing slides over the title, text or controls beside it, no tab makes the section grow or stack, no default grey state (`skills/review/interact.mjs` does it in one run).
- [ ] Every link, icon link and form field has a hover and a focus state in the site's own language, even where Figma draws none: text links reuse the button hover (a `Button Main` variant, not a plain link), icon links a matching motion, form fields a designed focus (not the browser's box outline).
- [ ] Text that sits directly in a padded or gapped container matches Figma's **box** height, not just its gaps (Figma boxes are untrimmed — [lumos/typography.md](lumos/typography.md)). Typical fix on the text's wrapper: `padding-block` ≈ 0.2em body, 0.35–0.4em small text.
- [ ] No outline appears after a mouse click on a card, link or button (only `:focus-visible` draws one).
- [ ] The section's content sits in its `u-container`, also where Figma bleeds to the edge ([lumos/structure.md](lumos/structure.md)).
- [ ] A new section is flat and closed into a component, no content in a slot filled inside the definition; on an existing Section build-up, Height `true` unless the design is full-screen ([lumos/components.md](lumos/components.md)).
- [ ] Every text is a plain Heading/Paragraph with Lumos text classes, heading levels fixed ([lumos/typography.md](lumos/typography.md)); in the Designer where the API wrote `<p>`.
- [ ] Repeated elements resolved to the component the site already has, or to a variant of it — no new twin of an existing component.

**Accessibility** ([accessibility](../skills/accessibility/SKILL.md) §1)
- [ ] Tabbed through the unit: every link, button and field is reached in reading order, shows a visible `:focus-visible` ring and is not hidden under the sticky nav.
- [ ] Everything that opens (menu, dropdown, modal, accordion, tab) works with Enter/Space, closes with Escape, flips `aria-expanded` and hands focus back; while closed, nothing inside takes focus.
- [ ] Every icon-only link or button has a name (`aria-label` in the definition, or `u-sr-only` text bound to a prop); no bare "Lees meer".
- [ ] Every image has alt text or is set to Decorative; decorative SVGs carry `aria-hidden="true"`.
- [ ] Section, nav, list and heading tags as the plan's A11y line says; repeated items are a list (`role="listitem"` on the item wrapper, never on the link).
- [ ] Ran `a11y-check.mjs` on the published page (or noted "unpublished: not run") and fixed what it found in this unit.

**Reach**
- [ ] Before claiming a behaviour or a fix covers the page, swept the rendered page for every element that looks the same. Say what is included **and** what is excluded. "All 12 items" was wrong once because 36 more looked identical.

## 2d. Compare against the design one last time

The comparison in §2 is the *first* pass — it finds the obvious misses and you fix them. Fixing changes the section, so **compare it against the design again, from scratch, once you believe it is finished.** This is a separate step, not a re-read of the earlier notes.

Take a fresh render of the built section (snapshot, browser screenshot or fixture) and put it beside the design frame at the design's width. Then:

- [ ] Look at the two side by side as whole pictures first. Anything that reads differently — weight, density, where the eye lands — is a real difference even when every number checked out.
- [ ] Walk the design frame element by element again and tick each one off on the built version. Not from memory, and not from the plan: from the frame.
- [ ] Re-measure the distances you changed during the fixes, and the ones next to them — a spacing fix usually moves its neighbour.
- [ ] Repeat at each breakpoint.
- [ ] **After the section becomes a component, compare once more.** Transforming re-renders the block, defaults can replace content, and slot content lands in a different order. A component that no longer matches the design is the same defect, one step later.

Only then hand over. Say in one line what you compared and at which widths, so the user knows what has already been checked.

Something that survived this and still reached the user goes into the checklist above as a new line, through a kit issue.

## 3. Read the user's screenshot

First establish canvas width and whether it is the page or a component definition view. Designer artefacts are not bugs: a grey box is an empty element, serif text is a font not loaded, an empty image is an asset not reloaded, `display: contents` renders unreliably on a narrow canvas.

When style data and the screenshot disagree, three suspects in order: canvas width/breakpoint, definition view vs page, Designer canvas vs a real browser.

Before measuring, say back in one line what you think they mean ([asking.md](asking.md)).

**When the user contradicts a measurement, go and look again before defending it.** Their eye on the rendered page beats your number, and the number is usually measured against the wrong reference. Re-measure visually, then answer.

**Pair every measurement with the picture.** A number proves the change landed, not that it looks right. A residual table on its own reads as confidence and gets contradicted next turn.

When the user points at something you missed, fix it, then add what caught you to the checklist above through a kit issue.

## 4. One change per correction

One hypothesis, one write, one read-back. Whitespace: judge against the section PNG, move towards the design's value, report `Was | Now | Figma` ([asking.md](asking.md)). Corrections are reversible: keep a running list per session of element, class, property, was → now.

## 5. Stop after two failed fixes

Count them. Every time the user repeats a complaint you have already tried to fix, that is a failed fix — a new theory about the same symptom is still the same complaint. On the second, stop mutating: present three to five structural options in a table (mechanism, dependency, failure mode, cost, which rule rejects it) with a recommendation, and wait for the user. That is the rule with the highest return in this whole kit.

## 6. Wide changes ask first

Anything touching more than ten classes, or contradicting the plan or `decisions/`, is shown as a table and confirmed before the first write. Log the was-values so it can be reversed in one pass.
