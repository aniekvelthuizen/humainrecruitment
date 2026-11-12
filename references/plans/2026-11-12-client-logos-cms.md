# Client logos from the CMS — 2026-11-12

Owner (Aniek): «Hoe vul je nu de logo's in de marquee? Graag hier een cms collection van maken.» Planned and built by Aniek Velthuizen, via Claude.

## In short
- Today: 8 `Logo Tile` instances inside the `Logo Marquee` definition (`5f31b436-…`). One edit there changes Home, Clients and How it works, but only in the Designer.
- New collection **Client Logos** (Client Logo): Name (company, also the alt text), Logo (image), Order (number). 8 items from today's tiles, same order.
- New list component **Client Logos · all** (group CMS lists): Collection List, sort Order ascending, item › `Logo Tile` bound (Logo, Logo Alt = Name).
- The list itself (`w-dyn-items`) becomes the marquee list: class `logo-marquee_list`, `data-logo-marquee-list`. Wrapper `u-display-contents`. The marquee script and CSS stay unchanged.
- In `Logo Marquee`: old list div with 8 tiles removed, new component in the track.

## Reuse
| Part | Site has | Choice |
|---|---|---|
| Tile | Logo Tile | place inside the list, props bound |
| Marquee | Logo Marquee + embed | unchanged, list swapped |
| List | Reviews · picked, Experts lists | new: all items, by Order |

## Questions, with the answer taken
1. All logos everywhere, or a pick per page? → all, by Order: the three pages draw the same row.
2. «Show in marquee» switch? → no; Draft/Archive in the CMS hides a logo.
3. Template page `/client-logos/<slug>`: same as Reviews (API cannot draft it), noindex in the SEO pass.

## Order
1. Collection + fields + 8 items (API), publish items.
2. Clients: Collection List in `page_wrap`, source + sort in one write, Logo Tile bound (API).
3. Designer: Create component, then into Logo Marquee's track, old list removed.
4. Publish staging, `node references/marquee-check.mjs`, compare Home/Clients/How it works at 1512 and 402, review.
