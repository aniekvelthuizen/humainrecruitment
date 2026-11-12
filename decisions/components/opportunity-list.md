# Opportunity List (`Opportunity List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 13. Figma export: `references/figma/rest-of-site/opportunity-list/` (`dynamic-opportunities`, `Search mobile`); header bar in `page-header/tree.txt` (`Header / Opportunities`); pages `12-opportunities`, `m12-opportunities`. Built by Aniek Velthuizen, via Claude. Seen on staging: audit `references/audit/2026-11-05-phase-4.md`, fixes below not published yet.
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
- `data-wf-no-turnstile`: Webflow's script otherwise appends the Turnstile widget to the form (read in the published `webflow.js`). It also means this form never gets a token.
- Search is **not** a submit button: Button Type on, empty Link, so `type="button"`. A real submit button stays disabled: `O()` in `webflow.js` runs `prop("disabled", sitekey && !token)` on `:input[type="submit"]`, and with no token it never comes back. The audit saw that from 230 ms on: no click, no Enter, Tab skipped the button.
- The script calls `apply()` on a click on Search and on Enter in the search field (`keydown`, `preventDefault`, skipped during IME composition).
- Enter never submits. A form with one text field can still submit without a button, so the `keydown` stops it, and the `submit` listener stays as a guard: `preventDefault` and `stopPropagation`; Webflow's handler is delegated on `document`, so it never sees the event.
- Without JavaScript the bar is hidden by CSS (`html:not(.w-mod-js)`): a bar that does nothing is worse than none. All cards stay visible, the count reads "Open roles · sorted by newest" with no number, and there is no Load more.

## 2026-11-05 — Filtering
Data on `_item`, bound to the CMS: `data-opportunity-list-item`, `data-name` (Name), `data-location` (Location Filter), `data-discipline`, `data-type` (Job Type). Option fields bind as text (`get_bindable_sources`: option → string), and select values are the option **names**, not the ids in `decisions/cms.md`; check on the published page that the attributes hold names.
Search: every word must occur in the card's title, tags, meta rows, `data-location` or `data-discipline`, ignoring case and accents (2026-11-05, below). The button text stays out. Selects: exact match. Selecting "All …" (the first option) matches everything. An item with an empty field drops out as soon as that select is set. Applies on select change, Enter, a click on Search, and 200 ms after typing.
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

## 2026-11-05 — Measured (staging, audit `references/audit/2026-11-05-phase-4.md`; rows marked * only in the local simulation before publishing)
| At 1512 | Figma | Built |
|---|---|---|
| Bar | 64, 609, 1384 × 111 | same, hanging 55 over the gradient at every width |
| Field / first line * | 88, 259 wide / x 371 | 88, 257 wide / x 369 (Search is 136, Figma 132) |
| Count | y 768, h 21 | same |
| Cards | y 821, 440 × 385 | same |
| Section, 9 cards * | 1624 | 1624 |
At 402: bar 362 × 168 (Figma 167). Simulation only: open 456 (Figma 451; the lines are 1 px here, 0 there), button 48 × 48, card 362 × 261 (Figma 259, known from `cards.md`).
No sideways scroll at 1512, 1280, 992, 768, 402, 320. Behaviour on staging: filter, combination, 0 results, clear, typing, accents, shared link, unknown URL value, utm kept, Back from a detail page, toggle state and label, phone opens from URL; 9 of 9 card links; order newest first. Load more ran with 12 cards in a browser-only patch, because only 9 public roles exist. Search and Enter failed there; fixed below. No form was submitted, no POST.

## 2026-11-05 — Placed
Opportunities: filter instance `722aba49-7aad-037d-32ba-0fd594ae5b98` in Row of Page Header `13bb2a16-6224-8756-e2d0-513057de3912` (Row Visibility on); section instance `4971cfab-a5d6-d355-b7af-225e97cfc532` at the end of `page_main`; list `fccb3edd-7eb8-20f0-ebe6-f408397620af` in `page_wrap`, right after `page_main`, card `80cb60d6-8d24-5c24-b09d-7a7e82ea583b`.

## 2026-11-05 — Open
- **Sort and card link:** done in the Designer (`references/designer-queue.md`); the API refuses both. Order and links checked on staging.
- **Card title is bound** since 2026-11-05: Card titles are plain text, see `cards.md`. Final list component: **Opportunity List Items**.
- **Copy not in Figma, for the owner:** "No roles match your search", "Try another keyword or clear the filters to see all open roles.", "Clear filters", "No open roles right now."
- **Search field without chevron:** Figma draws a select chevron on it, but it is a text field with no list. On the owner's list.

## 2026-11-05 — Fixes after the phase 4 audit (Aniek Velthuizen, via Claude)
Not published; checked by API read-back and a local simulation (published page + these rules) at 1512, 991, 768, 402, 320.
- **Search and Enter:** see "Real form, never submitted". Simulated: the button is `type="button"`, not disabled after 7.5 s, cursor pointer; a click and Enter both filter and write the URL, also on the phone's round button; 0 `submit` events, no POST.
- **Search text:** only `.card_opportunity_tag`, `_title` and `_meta_item`. "view" and "apply" now return 0 (were 9). Choice that follows from it: the `data-location` and `data-discipline` values are no longer searched, because they do not show on the card, so "netherlands" returns 0 and "Rotterdam" returns 3. The selects still filter on them. `data-name` on `_item` is now unused by the script; it stays on the list.
- **Empty state:** `.opportunity-list_results:has([data-opportunity-list-empty][data-active]) .opportunity-list_cms { display: none }`, so count to empty box is 32, equal to count to cards.
- **Chevron:** the 3.5 px offset exists only here: this bar gives its select `padding-top: .5rem`, so the text sits 4 lower. So the rule is here too, `.opportunity-list_form .form_select_icon { transform: translateY(.25rem) }`, and `form_select_icon` is untouched: on Contact and Resume the icon is already on the text (box centre equals text centre, at 1512 and 402). Now 0.5 from the text centre, the same as there; the rest is the icon's own drawing.
- **Show all filters, phone:** tap area 111 × 44 with the same look, ≤ 991: `min-height: 2.75rem`, `padding-block` and `margin-block` ∓ .375rem on the wrap. Label, element (32), holder (32), underline and bar height (168) did not move. Figma draws 32. Both tap edges hit the button.

## 2026-11-05 — Search also reads location and discipline (Aniek Velthuizen, via Claude; not published, local simulation at 1512 and 402)
Replaces the choice in "Fixes after the phase 4 audit" that these values are not searched. The card shows the exact location, a visitor types the region. "netherlands" 6, "international" 3, "rotterdam" 3, "view" and "apply" 0. Source: `references/embeds/opportunity-list-script.html`.

## 2026-11-12 — Hover border lighter, box centred on the text (Aniek Velthuizen, via Claude)
Owner: the hover border sat too high around the text and could be lighter.
- Hover (not focus) border in this bar: `swatch/brand-300` instead of `brand-500`. Focus keeps `brand-500` and its outline, as Form Section.
- The field's `padding-top: .5rem` is gone (text now centred in the box) and the box moves down with `transform: translateY(.25rem)`, so the text stays where it was (as Figma) and the border sits evenly around it. Layout and bar height do not change; the chevron keeps its own `.25rem` shift and now matches the box centre (692 / 692 at 1512).
Source `references/embeds/opportunity-list-style.html`, embed `7a34be19-…605e` read first (matched), rewritten, published to staging 1×. Checked at 1512 (hover seen) and 402 (field to line 12, no sideways scroll). Safari not checked.

## 2026-11-12 — Hover and focus subtler (Aniek Velthuizen, via Claude)
Owner, after the entry above: border still too dark, and too thick once something is selected (a select keeps focus after choosing, so that was the focus state: brand-500 border plus the 2 px outline from `form_field:focus`).
Replaces the hover colour above. In this bar only: hover `swatch/brand-200`; focus 1 px `swatch/brand-300`, `outline: none`. Focus is still visible: the border goes from transparent to brand-300 (about 5:1 on white). Contact, Resume and the other forms keep the shared hover and focus.
Embed `7a34be19-…605e` rewritten from the source, published to staging 1×. Checked at 1512 with a real click: focus border 1 px, rgb(124, 102, 155), no outline.

## 2026-11-12 — Search button becomes Reset, cross in the search field (Aniek Velthuizen, via Claude)
Owner: the Search button does nothing the bar does not already do (filters apply on select change and 200 ms after typing), so it goes; a Reset takes its place, and the search field gets a cross to empty it.
Replaces the Search part of "Real form, never submitted" and the round magnifier button in "Below 992". Enter still filters at once and still never submits.
- **Reset:** the same Button Main instance in `_submit` (`…6056`), now Variant **Secondary** (outline), Text "Reset", Icon Visibility off. Secondary, not Primary: it is not the main action of the page. It empties search and all three selects, writes the URL and leaves focus on Reset (the empty state's Clear filters still puts focus in search; on a phone that would pop up the keyboard). The holder keeps the class `opportunity-list_submit`: renaming it buys nothing and the old name is in the audits.
- **Below 992, closed:** no round button any more; the search field spans the full row. Open: Hide filters + Reset. Bar height closed still 168 at 402.
- **Cross:** made by the script (the bar is hidden without JavaScript anyway): it wraps the input in `span.opportunity-list_search` and adds `button.opportunity-list_search_clear` (`type="button"`, `aria-label="Clear search"`), shown only while the field has text. Icon: Material Symbols `close` as a mask, like the earlier magnifier. 2.5rem tap area, icon 1.25rem, `dark-900-o50`, `dark-900` on hover/focus; the input gets `padding-right: 2.75rem`. Click empties the field, filters, keeps focus in the field. Escape in a filled field does the same.
Sources `references/embeds/opportunity-list-style.html` and `opportunity-list-script.html`; embeds `…605e` and `…606e` read first (matched the sources), rewritten, published to staging 1×. Checked on staging: 1512 (type "manager" + Permanent → 3, cross clears to search-only filter, Reset → 9 and clean URL, Escape clears), 1100 (bar seen with Reset), 402 closed and open, no sideways scroll. Safari not checked.

## 2026-11-12 — Reset inactive until a filter is set; the cross turns (Aniek Velthuizen, via Claude)
Owner, after the entry above: Reset dimmed and not clickable until a filter is set; the cross should turn.
- **Reset:** inactive while search is empty (after trim) and all three selects are at "All …". Inactive = `data-inactive` on `_submit` (opacity .4, no pointer events, no hover lift) and `aria-disabled="true"` on its button; the click handler also does nothing then. `aria-disabled`, not `disabled`: a real disabled button drops focus to the page the moment Reset is used. Updates on every keystroke and select change, and on load from the URL.
- **Cross:** turns 90° on hover and keyboard focus (300 ms, `cubic-bezier(.65,.05,.36,1)`, the site's motion curve) and turns in from −90° with a fade when it appears. Off under `prefers-reduced-motion`.
Embeds `…605e` and `…606e` written from the sources and read back. **Not published yet:** session "Taalswitch naar design" asked for no publish while it works in the Designer.
