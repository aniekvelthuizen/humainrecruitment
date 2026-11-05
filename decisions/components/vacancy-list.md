# Vacancy List (`Vacancy List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 14. Figma export: `references/figma/rest-of-site/opportunity-more/` (`Dynamic / Internal vacancies`); page `14-careers/section-04`. Built by Aniek Velthuizen, via Claude. Not yet seen on staging: checked by API read-back and a local simulation.
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

## 2026-11-05 — Measured (local simulation: published CSS + these rules, cards from Example Components; nothing published yet)
At 1512: cards x 64 / 536 / 1008, y 349, 440 × 388 (Figma 385, known from `cards.md`), section 929 (Figma 926). No sideways scroll at 1512, 1100, 992, 800, 402, 320.

## 2026-11-05 — Open
- **Title and Text are not bound.** Card Opportunity's Title and Text are rich-text props, and `name` and `summary` are plain text; `get_bindable_sources` offers only the rich-text fields. Until the card changes, every card reads "Project Controls Manager" with no summary. The same recommendation as Unit 13: plain-text props on the card, as Card Expert on 2026-11-01. The card is not this unit's.
- **Card link:** Designer step, as `opportunity-list.md`.
- **Sort:** Created On is refused by the API; the Designer step gives Figma's order.
