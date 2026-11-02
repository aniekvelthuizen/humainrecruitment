# Review — Split Content + Card Bullet Large, 2026-11-01

Reviewer agent (read-only) for Aniek Velthuizen. The Webflow connector could not reach site `6ae35364a38b2d71cab8c607` (get_site → 404), so everything below comes from the published HTML/CSS and headless Chrome, not from the API.

## Split Content (+ Card Bullet Large) — Home (https://humain-d16f03.webflow.io/)
Checked: API not reachable (404) · published 2026-11-01 11:35:50 UTC (after the build, log.md 2026-11-01) · widths 1512, 1440, 1280, 990, 900, 768, 767, 479, 375 (+ 402 patched checklist) · design homeb-1-credibility.png, homeb-2-candidates.png, variant-right-list.png, tree.txt
| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ⚠️ | ✅ | ✅ | ✅ | 🧹 | ? | ✅ |

### Findings
1. ⚠️ Works · A filled checklist will read as a list with no items to screen readers · Seen: split-content.md gives `split-content_list` role="list"; Card Bullet renders with no role (23 of 23: Home 9, Example Components 14) · Fix: Card Bullet `role="listitem"`, or drop role="list" on `_list` · By: API
2. 🧹 Code · The section's CSS embed zeroes quote margins that are already zero · Seen: with `.split-content_quote, .split-content_quote-text { margin-left/right: 0 }` removed, margins stay 0/0 and the quote text stays at x 98 (Webflow base `figure`/`blockquote` = margin 0 0 10px) · Fix: delete that line from the embed · By: Designer
3. 🧹 Code · The photo downloads the largest file for a 676 px slot on desktop · Seen: `sizes="100vw"`, currentSrc = original (1352w) at 1512 and 1440 · Fix: Sizes `(max-width: 991px) 100vw, 676px` if Visual Image takes it · By: API
4. 🧹 Design · With Title Break off, copied or crawled title text glues the two parts · Seen: h2 innerText with the `<br>` removed = "Selected by peoplewho did the job." (accessible name is fine) · Fix: none now; keep Title Break on or accept · By: owner
5. ❓ Your call · Props · Space Top is free text; "Main" or "None" silently gives 192 · Seen: data-space-top "main" → 96, "none" → 0, "Main" / "None" / "medium" / "" → 192 · Fix: tooltip naming the three exact values, plus case-insensitive selectors (`[data-space-top="main" i]`) · By: owner
6. ❓ Your call · Responsive · On tablets the body text runs the full width, about 95 characters per line · Seen: `split-content_text` 903 px at 990, 821 at 900, 699 at 768 (desktop 558) · Fix: max-width 34.875rem on `split-content_content` below 992, or keep · By: owner

### Already decided (not findings)
- Plain `section` + own classes instead of the Lumos Section wrapper; texts as plain p/h2/blockquote with `u-text-style-*` instead of Typography instances: decisions/components/split-content.md "Structure" and plan reuse table, 2026-11-01
- Space Top as a text prop → `data-space-top` + CSS embed; `::before` space before the muted part: split-content.md "Structure", "Title in two parts", 2026-11-01
- #2 title breaks after «in» (Figma after «project»), the site's balanced H2 wrapping: split-content.md 2026-11-01
- Image Left text starts at 890, Figma 920: split-content.md 2026-11-01
- Notch fixed at 86 px at every width (on a phone it is 86 of a 223 px photo): split-content.md "Photo notch" 2026-11-01
- No mobile design; below 992 one column, text first, then the photo (also for Image Left): split-content.md owner answers 2026-11-01
- Muted title part as `swatch/dark-900-o50` (Stagger Cards uses opacity 0.5 for the same look): split-content.md "Title in two parts"
- The List slot can only be filled in the Designer; checklist order is row by row: split-content.md 2026-11-01

### Content
- Quote «Aliquet vel mauris pellentesque…» / Floyd Latumeten is lorem (owner: keep until copy arrives)
- #2 body «Cursus eu et vestibulum…» is lorem (owner: keep)

### Not checked
- Everything that needs the Webflow API: the connector returns 404 for this site. Props (names, folder order, defaults, tooltips, Visibility bindings, Allowed components on the List slot), the component definition (unused classes, variant read-back), the Card Bullet Typography Plain = Inherit setting. Note: split-content.md lists the folders as Content · Quote · List · Buttons · Image · Layout; the kit wants the Visual (Image) folder straight after Content and Space Top under Settings. Check the order in the Designer.
- The List slot when really filled: whether the slot wraps the Card Bullets in an extra element. If it does, the two-column grid gets one child and stops working. The builder's preview put clones straight into `_list`; only a Designer fill shows the real markup.
- Button Main widths (+3 to +3.5 px vs Figma) and its hover: Button Main's own unit. Focus checked here: 4 buttons show a ring on keyboard focus (`:focus-visible`), none after a mouse press (focus/).
- interact.mjs's keyboard step stopped in the nav; the section's buttons were checked separately (scripts/focus.mjs).
- Site-wide, not this unit: the published CSS holds 232 broken `--_text-style---trim-*<deleted|variable-…>` custom properties across every Text Style mode, including both Card Bullet modes.

## Evidence
Session scratchpad (not committed): `/private/tmp/claude-501/-Users-aniek-Projecten-HumAIn-Recruitment/a6671a93-b9bc-4350-beb9-a3dd49cc355f/scratchpad/review/split-content/`
- `distances.md`: Figma vs built at 1512, built at 1440 / 375, checklist preview
- `splitcheck/`: split-check.mjs at 9 widths + patched Image Left / checklist (report.json, PNGs)
- `measure/measure.json`: boxes, fonts, line rects, embed test, Card Bullet Small on Home
- `interact-1/`, `interact-2/`: interact.mjs at 1440 / 768 / 375
- `focus/`: keyboard focus and mouse press on the section buttons
- `src/`: published HTML and CSS used for the review
- Home sweep (shared): `../home/sweep/summary.md`

## Re-check after fixes — 2026-11-01

Fresh reviewer agent (read-only) for Aniek Velthuizen. API still 404, so published HTML/CSS + headless Chrome. Staging published 2026-11-01 12:03:39 UTC (after the fixes in log.md).

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Card Bullet listitem + list holders | ✅ | Static HTML: Home 9/9 `card_bullet` role="listitem", 3 `card_primary_items` + 3 `card_expert_items` role="list"; Example Components 14/14 listitem, 11 + 3 holders list. Chrome AX tree on Example Components: 4 visible lists own 3 + 3 + 5 + 3 = 14 bullets; all 55 listitems on the page have a `list` as nearest non-generic ancestor (the `u-display-contents` wrappers in between are ignored). Home's 9 bullets sit in the hero stage, roles stripped at runtime (hero decision). |
| 2 | Quote-margin rule out of the embed | ✅ | Embed now holds only the two Space Top rules and `.split-content_muted:empty`; quote margin 32 0 0, quote text margin 0, quote text x 98 at 1512 (95 at 1440, 54 at 402) |
| 3 | Photo `sizes` | ❌ (not fixable as asked) | Still `sizes="100vw"`; both photos load (complete, no errors), desktop picks the 1352w original for a 676 px slot. Other route that works: setting `sizes` from script before the lazy image loads. Test with a fresh profile, no cache: `(max-width: 991px) 100vw, 676px` set on DOMContentLoaded → both photos load `-p-800.jpg` at 1512 (as published: the original). Owner's call; it would be a few lines in the section's embed. |
| 4 | Real space between title parts | ✅ | h2 markup `<span>Selected by people</span><span> </span><br/><span class="split-content_muted">…`; textContent with `<br>` removed = "Selected by people who did the job."; instance 1 = "Working in project controls? " (trailing space, harmless; innerText trims it). No `::before` rule left in the site CSS or embed. |
| – | Space Top case-insensitive | ✅ | `data-space-top` main / Main / MAIN → 96, none / None → 0, large / "" → 192 at 1512 |

Design at 1512: sections 938 / 643 (= Figma), photo 772/192 676 × 451 on #1, 772/0 on #2; side-by-side with homeb-1-credibility.png / homeb-2-candidates.png only the known points differ (quote text +2 px, Button Main +3 px, #2 title wraps after «in»). 402: scrollWidth 402 on Home, also 1280 / 991 / 767 none; no console errors.

New: nothing.

Evidence (session scratchpad, not committed): `/private/tmp/claude-501/-Users-aniek-Projecten-HumAIn-Recruitment/a6671a93-b9bc-4350-beb9-a3dd49cc355f/scratchpad/review/split-content-recheck/` — `recheck.json`, `recheck-ex.json`, `ax-ex.json`, `sizes.txt`, `built-0-1512.png`, `built-1-1512.png`, `splitcheck/` (split-check.mjs at 1512 / 1280 / 991 / 767 / 402), `src/` (published HTML/CSS), `scripts/`.
