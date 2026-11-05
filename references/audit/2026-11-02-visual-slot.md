# Review — Split Content Visual slot, Score Chart, Step List — 2026-11-02

Scope: what was built on Project Delivery Experts today (plan `references/plans/2026-11-02-split-visual-slot.md`), plus Home's two Split Content instances for regression. Three fresh `webflow-devkit:reviewer` agents, one per component, read-only. Run by Aniek Velthuizen with Claude.
Staging published 19:53 UTC before the review. Reviewers could not reach the Webflow API (local connector 404); they used the published HTML/CSS. Props were read back through the claude.ai connector by the building session instead.

| Component | Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Split Content (Visual slot, Glow) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |
| Score Chart + Score Item | ✅ | ⚠️ | ⚠️ | 🧹 | ⚠️ | ✅* | ✅ |
| Step List + Step Item | ✅ | ✅ | ✅ | 🧹 | 🧹 | ✅* | ⚠️ |

\* Props read back by the building session via `get_component`; slot folders are a Designer step (queue).

## Items

Off
1. Score Chart — between 992–1270 and 480–590 px the legend labels wrapped and the two columns stopped lining up. Fix: two columns only while each is ≥ 15rem. **Fixed.**
2. Score Chart — 12 px less space under the legend at two-column widths (negative margin). Fix: margin on every row but the last. **Fixed.**
3. Score Chart — the segment class lived only in the script (Webflow's Clean Up would remove it). Fix: rules into the embed, class removed. **Fixed.**
4. Step List — on a Dark or Brand section the numbers would be white on mint (1.29 : 1). Fix: Theme `badge/text` dark-900 in every mode. **Fixed.**

Tidy
5. Score Chart — a value like «€20» drew no segment. Fix: strip non-digits first. **Fixed.**
6. Step List — badge class had no-op margins and `flex-grow: 0`. **Removed.**
7. score-chart.md said «≤ 478»; obsolete after fix 1. **Text corrected.**

Your call (recommended answer applied)
8. Chart colours are the same in every theme; `chart/color-2` equals the Brand background. → Recorded «light sections only» in score-chart.md.
9. Score Chart and Step List are not on Example Components. → Recorded as covered by the site's section-component exemption (they only live in Split Content's slot).

Not findings (already decided): agreed deviations (Image Left widths, H2 48, text gaps), bar empty on the Designer canvas / without JS, CSS in component embeds, colours by position, light-200 «References» dot (Figma's choice).

Content (outside this scope): the template placeholder Section («Lorem ipsum dolor sit amet elit») is still above the two blocks on Project Delivery Experts, and the page has no H1 yet.

## Outcome
Round 1: all 9 items fixed or recorded; published to staging. Fresh re-check reviewers:
- Step List: both fixes confirmed (number 15.24 : 1 on Light, Dark and Brand; no-op lines gone), no new findings.
- Score Chart: fixes 2–4 confirmed; fix 1 held in Chrome but **Safari** put the right legend column 12 px lower (WebKit keeps a row's bottom margin at the column break), and «10-15%» read as 1015.

Round 2 (fixed in this session, published, measured here — not by a third fresh reviewer):
- Rows now 2rem high with centred text and no margins; legend padding/negative margin take out the 6 px at top and bottom. Playwright WebKit at 1512 / 1280 / 767 / 600 / 402: both columns start at the same y. Chrome at 1512 / 1280 / 1100 / 992 / 767 / 600 / 480 / 402: rows every 32, columns level, chart ends at y 440 at 1512 (= Figma), section heights unchanged (658 / 808), no sideways scroll, no console errors.
- Script reads the first number only («10-15%» → 10).
- Not checked: Firefox (no engine here), a real Safari/iPad.

Known side effect (recorded): from 992 to ~1225 px the legend is one column, so the chart ends ~60 px below the text there.
Slot folders: the props panel shows «List» and «Visual» at the top beside Variant (as the existing List slot); left there.
