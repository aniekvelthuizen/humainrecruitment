# Reviews · picked (`Reviews · picked`, group CMS lists)

Plan: `references/plans/2026-11-12-reviews-cms.md`. Built 2026-11-12 by Aniek Velthuizen, via Claude.
Component **`3db44b3c-99d5-260e-f223-9bab6fcd39a1`**. Collection **Reviews** (`6af5eab6b7bd7e385981a9f8`).

## 2026-11-12 — Reviews come from the CMS (owner)
Owner: the Reviews block is on several pages with hand-filled cards, so an editor had to check every page. Reviews became a collection; each page picks its reviews.
- **Collection Reviews** (Review): Name (the person), Quote (rich text, the card's Quote prop is rich text), Role, Company, Avatar. All required, help texts on each. Items: Chance Lipshutz, Jocelyn Westervelt, Marcus Levin (today's copy, published).
- Not added: Avatar Alt (Card Testimonial's tooltip: leave empty, the name is next to the photo), stars (all reviews show five; Rating Visibility stays on the card). Avatar Alt «Portrait of …» that Hire an expert and Clients had is gone, so all pages are the same now.
- **Component**: curated Collection List (Items: **Selected**) › Card Testimonial bound to the fields. Wrapper, list and item `u-display-contents` + `data-display="contents"`, so the card stays a direct item of the section's list. Empty state `u-display-none`. Root, list wrapper, list and item carry `data-display="contents"` too.
- Props: **Review** (Select items, folder Content; Designer-only, the API cannot set or bind it) · **Link** and **Screen Reader Text** (folder Link) passed to the card; both filled = clickable card with arrow.

## 2026-11-12 — One list per slot
Spotlight Grid › Reviews keeps its three slots (List Start, List Center, List End) because the photo panel sits between them in the grid. Each slot holds one Reviews · picked with one review ticked. A single list of three would need a new layout.
Cost: three ticks per page. New instance default = Chance Lipshutz.

| Page | Start | Center | End | Link |
|---|---|---|---|---|
| Home | Chance | Jocelyn | Marcus | `/clients`, «More client reviews» |
| Hire an expert | Chance | Jocelyn | Marcus | `/clients`, «More client reviews» |
| Clients | Chance | Jocelyn | Marcus | none (2026-11-12, not to itself) |

## Editing
- Change a review's text or photo: CMS › Reviews, publish. Every page follows.
- Another review on a page: Designer › select the card › Properties › Review › + › tick one, untick the old one.
- A new review: CMS › Reviews › new item, then tick it where it should show.

## 2026-11-12 — Review fixes
Review: `references/audit/2026-11-12-reviews-cms.md` (fresh reviewer; looks and measures as before at 11 widths, right reviews and links).
- **Lists inside lists** (axe critical): Webflow always writes `role="list"` on a Collection List and ignores a custom `role` there. So Spotlight Grid got a **List Role** prop (folder Settings, default `list`), bound to the `role` of its three slot lists. Expertise keeps `list` (its Card Primary items are list items); the three Reviews instances have `none`, so each column is one list of one review. Seen on staging: Home Expertise `list` ×3, Reviews `none` ×3 on all three pages.
- Root `data-display="contents"` added.
- No `Reviews · automatic`: every slot shows one hand-picked review, there is no page that lists reviews by a rule. Build it when an overview page comes.
- Not on Example Components: kept off, as the other CMS list components (Cases Grid Items, Team Grid Items …).

## Open
- The collection's template page: `/reviews/chance-lipshutz` answers 404 on staging, so no empty page is out; check again when the SEO pass runs (`cms.md` 2026-11-05).
- Spotlight Grid slot tooltips and Allowed components are not yet updated for this list (Designer).
