# Opportunity Row (`Opportunity Row`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 14. Figma export: `references/figma/rest-of-site/opportunity-more/` (`dynamic-opportunities-2`, `dynamic-open-roles`). Built by Aniek Velthuizen, via Claude. Not yet seen on staging: checked by API read-back and a local simulation.
Component **`aa587329-ad45-62fd-3f18-bae5c3fe5a28`**.

## 2026-11-05 — One component, two variants
**Similar** (base): centred header. **Open Roles** (`0893e151-6d36-e34e-5253-eaa92f6f30fd`): left-aligned, button on the right, muted word on its own line (without that, the site's balanced H1 broke as "New project & / controls vacancies"), stacked ≤ 767.
Structure: `section.opportunity-row_wrap.u-theme-light` (`data-section="light"`, `data-opportunity-row`) › `_contain.u-container` › `_layout` › `_header` (`_content.u-text-trim-off` › p `_eyebrow` · h2 `_title` with spans and `wbr`, `_muted` · `_action` › Button Main Secondary) · slot **List**.
`_layout` exists because a variant cannot safely style the `u-container` combo (bare combo names are ambiguous), and the gap differs per variant on phones.
Props: Content Eyebrow, Title, Title Muted · Button Button Visibility (default off, a real visibility binding, so Similar renders no button), Button Text, Button Link (`/opportunities`).

## 2026-11-05 — The lists
Both built on their page, because a list cannot be set up inside a definition: `opportunity-row_cms` › `_list` › `_item` › Card Opportunity, empty state `_none` (`display: none`). Bound: Tag 1 `job-type`, Tag 2 `sector`, Location, Experience, Salary, Screen Reader Text `name`.
- **Similar**, template `6aec7e040edff92198cfc345`: section instance `30c2437b-83f2-95ff-8f2e-652d7ef51868`, list `f86efa59-5fd9-169e-0b0d-c24162668b42` right after it in `main`, card `4b802f02-db26-d551-8c36-536c3262a246`. API: `internal` isOff, limit 3. Designer: same discipline, not the current item.
- **Open Roles**, Example Components `6ae35365a38b2d71cab8c69d`: section instance `a395eac7-5511-44e1-ce90-6e2b1e31dbe1` at the end of `page_main`, list `ccac76fb-1355-55c7-01bd-082773dbbb87` in `page_wrap` right after `page_main`, card `7d453ede-8124-0406-9ae5-2753c989e4fe`. API: `featured` isOn, `internal` isOff, limit 3. No page uses this block yet (plan, owner 2026-11-05).

## 2026-11-05 — Below 992
Spacing per the mobile frames: section `section-space/main`, one column of cards ≤ 991 as the brief asks, so at 768–991 a card is wide (728 at 800). ≤ 767: Similar header to cards `space/6`, gap between cards `space/7`; Open Roles `space/8` and `space/5` (combo `opportunity-row_list.is-open-roles`, because a variant does not reach a list in a slot). Eyebrow Label on phones.
Title stays at the site's H1 size (36 at 402); Figma's Open Roles phone frame draws 30. Site rule "one mobile heading system" wins.

## 2026-11-05 — Measured (local simulation: published CSS + these rules, cards from Example Components; nothing published yet)
At 1512 Similar: section 926, cards x 64 / 536 / 1008, y 349, 440 × 385, title 75, eyebrow 24, all equal to Figma. No sideways scroll at 1512, 1100, 992, 800, 402, 320. The simulated cards had no link, so they render without button and corner; card height on phones is not measured here (unit 13: 261 with a link). The Open Roles button was not rendered in the simulation.

## 2026-11-05 — Open
- **Card title and link:** as `opportunity-list.md`; every card reads "Project Controls Manager" until Card Opportunity changes.
- **No match:** when no other item shares the discipline, the list is empty and hidden, but the header stays above nothing. A list's count cannot drive a condition.
