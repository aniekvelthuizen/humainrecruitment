# Opportunity List (`Opportunity List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 13. Figma export: `references/figma/rest-of-site/opportunity-list/` (`dynamic-opportunities`, `Search mobile`); header bar in `page-header/tree.txt` (`Header / Opportunities`); pages `12-opportunities`, `m12-opportunities`. Built by Aniek Velthuizen, via Claude. Not yet seen on staging: checked by API read-back and a local simulation.
Component **`7a34be19-cb70-f725-3844-f782da9d6020`**. Embed sources: `references/embeds/opportunity-list-style.html`, `opportunity-list-script.html`.

## 2026-11-05 — One component, two instances, two Visibility props
Choice: the filter bar and the list are both Opportunity List. **Filters Visibility** (default off) and **List Visibility** (default on) bind the native visibility of `_filters` and `_results`. Page Header Row: Filters on, List off. Below it: the defaults.
Why: a Row slot takes component instances only, and the plan names one component. A variant cannot change a visibility setting and would leave a hidden form or a second script in the page; a part switched off by a prop is not rendered at all (seen: Page Header Row off is absent from the published HTML). So the script runs once and there is one form.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.opportunity-list_wrap` (`data-section="light"`, `data-opportunity-list`; Theme Base mode, no `u-theme-*`, so nothing paints over the header gradient) › `_contain.u-container` ›
- `_filters` (`data-opportunity-list-filters`, state `data-open`) › FormWrapper `_form-block` › form `_form` (`role="search"`, `data-wf-no-turnstile`) › `_field` › Form Input / Form Select, `_line` between them, `_actions` › `_toggle` + `_submit` · style embed
- `_results.u-text-trim-off` › p `_count` (`data-opportunity-list-count`, `aria-live`) · slot **List** · `_empty` (`data-opportunity-list-empty`) · `_more` (`data-opportunity-list-more`) · style embed · script embed

List (Opportunity List Items, made in the Designer): `_cms` › `_list` › `_item` › Card Opportunity. Source Opportunities, filter `internal` isOff.

## 2026-11-05 — Real form, never submitted
Lumos Form Input and Form Select need a form. Field names are the query keys: `search`, `location`, `discipline`, `type`. The form is named **Opportunity List Filters**; it stays in Webflow's form list with no submissions.
- `data-wf-no-turnstile`: Webflow's script otherwise disables the submit button until Turnstile passes and appends the widget to the form (read in the published `webflow.js`).
- Search is a real submit button (Button Type off, empty Link), so Enter and the button are one `submit` event. The script calls `preventDefault` and `stopPropagation` on the form; Webflow's handler is delegated on `document`, so it never sees the event.
- Without JavaScript the bar is hidden by CSS (`html:not(.w-mod-js)`): a bar that does nothing is worse than none. All cards stay visible, the count reads "Open roles · sorted by newest" with no number, and there is no Load more.

## 2026-11-05 — Filtering
Data on `_item`, bound to the CMS: `data-opportunity-list-item`, `data-name` (Name), `data-location` (Location Filter), `data-discipline`, `data-type` (Job Type). Option fields bind as text (`get_bindable_sources`: option → string), and select values are the option **names**, not the ids in `decisions/cms.md`; check on the published page that the attributes hold names.
Search: every word must occur in the card text plus those attributes, ignoring case and accents. Selects: exact match. Selecting "All …" (the first option) matches everything. An item with an empty field drops out as soon as that select is set. Applies on select change, Enter, Search, and 200 ms after typing.
URL: `history.replaceState`, so a link can be shared and Back leaves the page. Other parameters and the hash stay. Values in the URL match case-insensitively; an unknown value counts as "All".

## 2026-11-05 — Load more, count, empty state
Figma draws 9 cards and **Load more roles**: the list renders all items, the script shows 9 and adds 9 per click, then focus moves to the first new card. Any filter change resets to 9. Before the script runs, CSS hides card 10 and up, so there is no jump. Not native pagination: that reloads the page and filters only one page.
Webflow limit: a list holds 100 items, so more than 100 roles would be neither counted nor found. To solve when Bullhorn comes.
`_empty` shows only when items exist and none match. Clear filters resets the fields and URL and puts focus in search. A collection with no items at all shows the list's own empty block, "No open roles right now." The script does not hide it.

## 2026-11-05 — Bar look
Figma: no field border at rest, vertical lines between fields (bar 111 high, padding 24, gap 24). The shared field keeps its hover and focus (`decisions/components/form-section.md`, unit 10b); only the rest border is transparent, in the embed. The field box sticks out .75rem to the left, so the text lines up with the label and the hover border does not touch it. Label margin 0, as Figma. Select text at "All …" is 50 %, as Figma. Long values end in an ellipsis.
992–1199: field text 16 and gap 16, or "All disciplines" clips. The 16 px lives in Form Section's own embed too, because Webflow has no breakpoint there.

## 2026-11-05 — Below 992
No tablet design, and four fields do not fit a row at 991 (at 768 about 90 px each). So ≤ 991 uses the phone bar (`Search mobile`): search and a round button, line, Show all filters; open: all fields with lines, Hide filters + Search. Opens by itself when the URL holds a select filter. Grid: 2 columns 768–991, 1 ≤ 767, gap `space/5`.
Round button: Button Main with its label hidden by CSS (`aria-label` stays). The magnifier is not in the export or in Icon Set; it is Material Symbols `search` (the family Figma uses, and what the PNG shows) as an inline mask in the embed. Icon Set was not this unit's.

## 2026-11-05 — Measured (local simulation: published CSS + these rules, 12 cards with titles filled in by hand; nothing published yet)
| At 1512 | Figma | Built |
|---|---|---|
| Bar | 64, 609, 1384 × 111 | same |
| Field / first line | 88, 259 wide / x 371 | 88, 257 wide / x 369 (Search is 136, Figma 132) |
| Count | y 768, h 21 | same |
| Cards | y 821, 440 × 385 | same |
| Section, 9 cards | 1624 | 1624 |
At 402: bar 362 × 168 (Figma 167), open 456 (Figma 451; the lines are 1 px here, 0 there), button 48 × 48, card 362 × 261 (Figma 259, known from `cards.md`).
No sideways scroll at 1512, 1100, 992, 800, 402, 320. Behaviour passed: filter, combination, 0 results, clear, typing, accents, Search, Enter, load more, shared link, unknown URL value, utm kept, toggle state and label, phone opens from URL. Without JavaScript: 12 of 12 cards, bar and Load more hidden. No console errors.

## 2026-11-05 — Placed
Opportunities: filter instance `722aba49-7aad-037d-32ba-0fd594ae5b98` in Row of Page Header `13bb2a16-6224-8756-e2d0-513057de3912` (Row Visibility on); section instance `4971cfab-a5d6-d355-b7af-225e97cfc532` at the end of `page_main`; list `fccb3edd-7eb8-20f0-ebe6-f408397620af` in `page_wrap`, right after `page_main`, card `80cb60d6-8d24-5c24-b09d-7a7e82ea583b`.

## 2026-11-05 — Open
- **Sort:** the API refuses Created On (`created-on`, `createdOn`, `Created On`, `created_on`: "Unknown field"). Designer step.
- **Card link:** the API refuses a Collection page on a link prop. Designer step.
- **Card title is not bound:** Card Opportunity's Title is a rich-text prop and Name is plain text, as in `team-grid.md`. Until the card changes every card reads "Project Controls Manager". Search still finds the real name through `data-name`.
- **Copy not in Figma, for the owner:** "No roles match your search", "Try another keyword or clear the filters to see all open roles.", "Clear filters", "No open roles right now."
- **Search field without chevron:** Figma draws a select chevron on it, but it is a text field with no list. On the owner's list.
