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
- Anchor landing: Webflow's smooth scroll ignores `scroll-margin`, so with Space Top `none` the section starts higher (`padding-top` + negative `margin-top`, 120 from 992 up, 88 below), over the white of the block above. Measured on staging after a real click: eyebrow at 120 under a nav of 76 at 1512, 88 under 74 at 991, 88 under 64 at 402; gap above unchanged at 192 and 96.

## 2026-11-16 — Empty state (owner; Aniek Velthuizen, via Claude)
Was: `_none` hidden, so with no internal vacancies only "Open positions / Join the team" stayed, with nothing under it. Figma draws no empty state.
Now the list's own empty block, in **Vacancy List Items** (`d3753a98-…`), in the look of Opportunity List's no-results box (`decisions/components/opportunity-list.md`):
- `vacancy-list_none` (the `w-dyn-empty`): flex column, centred, padding `space/8` × `space/6`, gap `space/5`, `radius/small`, `swatch/light-200`, centred text. Same values as `opportunity-list_empty`, own class, because that one is `display: none` until its script turns it on.
- h3 `vacancy-list_none-title.u-text-style-h4` (h3, not h2 as on Opportunities: the section's "Join the team" is the h2) · p `vacancy-list_none-text.u-text-style-main` (max 30rem) · div › **Button Main Primary** with arrow, link to page Submit resume (`/submit-resume`). Primary, not Secondary as Clear filters: here it is the one way forward.
- Props on Vacancy List Items, folder **No Results**: Empty Title "No open positions right now", Empty Text "We're not hiring for a specific role at the moment, but we're always glad to meet good people. Send us your resume and we'll keep you in mind.", Button Text "Submit your resume". The link is fixed in the definition. The copy is a draft for the owner.
- Shows only when no Opportunity has Internal on; Webflow leaves the block out of the HTML otherwise.
- Checked: CSS read back on staging (published). The block itself cannot show on staging while 3 internal items exist, so checked by putting the published classes into the live Careers page: 935 × 264 at 1024, 335 × 326 at 375, no sideways scroll. Not seen with a real empty collection.
