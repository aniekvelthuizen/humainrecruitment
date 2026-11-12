# Reviews from the CMS — 2026-11-12

Owner (Aniek): the Reviews block sits on several pages with three hand-filled Card Testimonials each; an editor would have to check every page. Reviews become a CMS collection, and each page picks its reviews (Collection List, Items: Selected). Planned and built by Aniek Velthuizen, via Claude.

## In short
- New collection **Reviews** (Review): Name (the person), Quote (rich text), Role, Company, Avatar. Three items from today's copy.
- New list component **Reviews · picked** (group CMS lists): a curated Collection List of Card Testimonial, prop **Items** (Select items), plus **Link** and **Screen Reader Text** passed to the card.
- Spotlight Grid › Reviews keeps its three slots (List Start, List Center, List End), because the photo panel sits between them. Each slot gets one Reviews · picked with **one** review ticked. Per page: 3 ticks.
- Pages: Home, Hire an expert, Clients. Home and Hire an expert link the cards to `/clients` («More client reviews»); Clients has no link (2026-11-12).
- Old Card Testimonial instances in the slots are removed once the new ones show the same.

## Reuse
| Design part | Site has | Choice |
|---|---|---|
| Section | Spotlight Grid › Reviews | place, unchanged |
| Card | Card Testimonial | place inside the list, props bound to fields |
| List | Experts lists, Cases Grid Items (dynamic) | new: first `· picked` list on this site |

## Bindings
Quote → Quote (RichText → richText) · Name → Name · Role → Role · Company → Company · Avatar → Avatar · Avatar Alt stays empty (component tooltip: the name is next to the photo; Home already empty) · Rating Visibility on · Role (list item) per kit: the Collection List item is the list item.

## Questions, with the answer taken
1. One list of three in one slot, or one list per slot? → one per slot: the grid puts the panel between the cards, a single list would need a new layout. Cost: three ticks per page.
2. Avatar Alt as a field? → no, empty as the component says.
3. Stars as a field? → no, every review shows five stars today; Rating Visibility stays a prop.
4. The collection's template page `/reviews/<slug>` renders empty (API cannot draft a template, `cms.md` 2026-11-05) → same as Cases/Rates/FAQ/Team; noindex it in the SEO pass.

## Order
1. Collection + fields + 3 items (API), publish items.
2. Clients: Collection List in `page_wrap`, source Reviews, Card Testimonial bound (API).
3. Designer: Items: Selected, Create component, Items prop, Link + SR props, display contents.
4. `insert_in_slot` ×9, set Link/SR on Home + Hire, tick reviews (Designer), remove old cards.
5. Publish staging, compare old/new at 1512 and 402, review agents.
