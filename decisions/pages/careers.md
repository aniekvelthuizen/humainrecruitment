# Careers

Figma frame 14 (`2318:19447`), export `references/figma/rest-of-site/pages/14-careers/`. Composed by Aniek Velthuizen, via Claude.

## 2026-11-05 — Composition
`page_main` › Page Header (Default) · Split Content (`e5f70e12-d16c-d78a-1d60-f67a166529cf`) · Vacancy List · CTA Split (`a2dae209-d892-7c20-0643-737f3a9519a8`). `Global | Custom Code` on top of `page_wrap`.
Split Content: Space Top main (Figma 96 under the header), Title Break on, quote off, buttons off, list on with 4 Card Bullets Large. Photo `careers-team.jpg` (`6aecbeddd9243c57d0bfde04`, 1352 wide, 220 KB).
CTA: Title «Send an open», Title Muted «application.», Space Top none.

## 2026-11-05 — Links
See open positions → `#open-positions` (same page). Open application → `/submit-resume`, as `wireframes/careers.html`. Get in touch → `/contact`.

## 2026-11-05 — Open, on the owner's list
- `#open-positions` has no target yet: the API offers no section link on a prop and refuses a DOM id on an instance. `vacancy-list_wrap` in the definition needs the ID `open-positions`.
- Gap above Vacancy List is 384 at 1512, Figma 192: Split Content's bottom 192 plus Vacancy List's fixed top 192. Vacancy List has no Space Top prop.
- No phone design: reflows as the components do.
