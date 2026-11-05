# Vacancy List (`Vacancy List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 14. Figma export: `references/figma/rest-of-site/opportunity-more/` (`Dynamic / Internal vacancies`); page `14-careers/section-04`. Built by Aniek Velthuizen, via Claude. Seen on staging: audit `references/audit/2026-11-05-phase-4.md`.
Component **`74b2e9f2-cf58-953f-a7d6-1d6c0ea6bbfb`**.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.vacancy-list_wrap.u-theme-light` (`data-section="light"`, `data-vacancy-list`) › `_contain.u-container` › `_header.u-text-trim-off` (p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h1`) · slot **List**.
Props: Content Eyebrow "Open positions", Title "Join the team". No variants. The plan names this as its own component, though it looks like Opportunity Row Similar: other card variant, other list.

## 2026-11-05 — The list
Built on Careers (`6ae37d53458c9339dcb6b5da`): section instance `2d8c3791-bfa7-1a49-eeaa-b2170d878b5c` at the end of `page_main`, list `a448def3-80f3-27f5-0640-559d9040635b` in `page_wrap` right after `page_main`, card `416ffc47-85f3-d482-929e-bc93a4c80138`.
`vacancy-list_cms` › `_list` › `_item` › Card Opportunity **With Text**, Experience Icon CV Submission, Salary Visibility off. Source Opportunities, filter `internal` isOn, no limit. Empty state `_none` hidden.
Bound: Tag 1 `job-type`, Tag 2 `sector`, Location, Experience (holds the team on internal items, `decisions/cms.md`), Screen Reader Text `name`.
Opportunity List and Opportunity Row filter `internal` isOff, so an internal item shows only here.

## 2026-11-05 — Below 992
No phone frame for Careers. One column ≤ 991 as Opportunity Row, `section-space/main`, gap `space/5` ≤ 767.

## 2026-11-05 — Measured (local simulation before publishing, then staging, audit `references/audit/2026-11-05-phase-4.md`)
At 1512: cards x 64 / 536 / 1008, y 349, 440 × 388 (Figma 385, known from `cards.md`), section 929 (Figma 926). Card 388 confirmed on staging. Careers shows only the 3 internal roles, each card's Text equal to its `summary`. No sideways scroll at 1512, 1280, 992, 768, 402, 320. Not proven: Text hiding when empty, because all 3 items have a summary.

## 2026-11-05 — Open
- **Title and Text are bound** since 2026-11-05: Card titles are plain text, see `cards.md`. Final list component: **Vacancy List Items**.
- **Card link and sort:** done in the Designer (`references/designer-queue.md`); the API refuses both.

## 2026-11-05 — Anchor and Space Top (Aniek Velthuizen, via Claude; not published, local simulation)
- DOM id `open-positions` on `vacancy-list_wrap`, the target of Careers' «See open positions».
- **Space Top** (string, Layout, default empty: keeps the section's own top), attribute `data-space-top`, embed rules as Fee List. Careers: `none`, so the gap above is 192 at 1512 and 96 at 991 and 402; section 737 (frame 734, card 388 known).
- `scroll-margin-top: 7.5rem` in the embed, not in the brief: a direct link to `/careers#open-positions` then lands 120 from the top. A click does not use it: Webflow's own smooth scroll brings the section to 0 under the nav (76 high at 1512, 64 at 402). Open, on the owner's list.
