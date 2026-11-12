# Review — Reviews from the CMS (Reviews · picked in Spotlight Grid › Reviews), 2026-11-12

Reviewer: fresh agent, read-only, for Aniek Velthuizen (via Claude). Pages: Home, Hire an expert, Clients on humain-dev.webflow.io.

**In short:** to a visitor the block looks and measures exactly as it did before, on all three pages and at every width. The right reviews show in the right order, links and arrows appear only on Home and Hire, and there are no console errors and no empty-state text. One real problem: screen readers now hear each column as an empty list that holds another list, because the inner Collection List still has `role="list"`. The decision file says it was set to `none`. The rest is tidying.

| Component | Works | A11y | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|---|
| Reviews · picked in Spotlight Grid › Reviews | ✅ | ❌ | ✅ | ✅ | 🧹 | ✅ | ? | ✅ |

**Broken**
1. **Lists inside lists**: each of the three columns is read as "list, 0 items" holding a second one-item list. axe reports this as critical on Home and Clients (Hire has the same markup). *Fix: set `role="none"` on the Collection List (`w-dyn-items`) in the component, or remove `role="list"` from the slot wrappers, then republish and re-run axe.*

**Tidy**
2. **Decision file is wrong about the role**: `reviews-picked.md` says the list has `role="none"`, but the published HTML shows `role="list"`. *Fix: correct the file after fix 1.*
3. **Component root lacks the `data-display` attribute**: the root Div has only `u-display-contents`. The kit puts the attribute on the root as well. *Fix: `data-display="contents"` on the root.*
4. **Not on Example Components**: the new list component does not appear on the showcase page (it has one static Card Testimonial and no Reviews list). *Fix: add it, or record why list components are left off.*
5. **Only the `· picked` version exists**: the kit builds `· automatic` next to it, and nothing explains why it is missing. *Fix: build it or record the reason (owner).*
6. **Template page record**: `cms.md` says `/reviews/<slug>` "renders empty", but `/reviews/chance-lipshutz` returns 404. The real slugs could not be read without the API. *Fix: check the template in the Designer and correct the record.*

---

## Reviews · picked — Home (https://humain-dev.webflow.io/), Hire an expert (/hire-an-expert), Clients (/clients)
Checked: API not reachable this run (the Webflow MCP here sees another workspace: Core, THDV, Wayfinder; `get_site` 404) · published 2026-11-12 16:46 UTC (after the build, the last entry in references/log.md) · widths 1512, 1440, 1280, 992, 990, 900, 768, 767, 479, 402, 375 · design references/figma/home-testimonials/component-desktop.png + Figma values in decisions/components/spotlight-grid.md
| Works | A11y | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ❌ | ✅ | ✅ | 🧹 | ✅ | ? | ✅ |

### Findings
- ❌ A11y · screen readers hear each review column as an empty list holding another list · Seen: axe `aria-required-children` critical ×3 on Home and Clients; Chrome AX tree list → list → listitem ×3 on all 3 pages; `w-dyn-items` has `role="list"` · Fix: `role="none"` on the component's Collection List (or drop `role="list"` on `spotlight-grid_list`/`_center-list`) · By: Designer
- 🧹 Records · the decision file says the list is `role="none"`; the live page says `role="list"` · Seen: published HTML on all 3 pages, 9/9 `w-dyn-items` have `role="list"` · Fix: correct reviews-picked.md after the fix · By: API
- 🧹 Lumos · the component root carries the class but not the `data-display` attribute · Seen: root `<div class="u-display-contents">` without `data-display`; wrapper, list and item do have it · Fix: `set_attributes` data-display=contents on the root · By: API
- 🧹 Lumos · the new component is not on Example Components · Seen: /example-components has 1 static `card_testimonial_wrap`, no Reviews list; /components 404 · Fix: add a filled instance, or record that list components stay off · By: owner
- 🧹 Props · there is no `Reviews · automatic` next to `· picked`, and no reason is recorded · Seen: reviews-picked.md and the plan mention only `· picked`; componentize "two per collection" · Fix: build it or record why not · By: owner
- 🧹 Records · the template page is said to "render empty", but the guessed item URL is a 404 · Seen: `/reviews/chance-lipshutz` 404 (also `/review/…`); sitemap.xml 404 · Fix: check the template slug/state in the Designer, correct cms.md · By: Designer

### Already decided (not findings)
- Avatar alt is empty on all pages; the «Portrait of …» alt on Hire and Clients is gone (the name sits next to the photo) — decisions/components/reviews-picked.md 2026-11-12
- One list per slot, so three ticks per page — reviews-picked.md 2026-11-12
- Clients cards have no link or arrow, and the Clients Spotlight Grid button is off — reviews-picked.md / log 2026-11-12
- Three identical «More client reviews» links to /clients on Home and Hire — spotlight-grid.md 2026-11-02 (cards link so their arrow shows)
- Cards 6 px taller than Figma, company not in capitals, role line at 50 % opacity (axe contrast on `.card_testimonial_role` on Clients comes from this) — spotlight-grid.md / cards.md
- Template page without a design, noindex in the SEO pass — reviews-picked.md Open
- Slot tooltips and Allowed components not yet updated for the list — reviews-picked.md Open

### Content
- Rating pill «4.9 / 5 based on 3 client reviews» next to three 5-star cards (already left for the owner on 2026-11-02).

### Not checked
- Everything that needs the API (not reachable this run): component props, folders, tooltips and description; the Review (Select items) prop value per instance; which CMS field each card prop is bound to; the empty state's `u-display-none`; the collection's fields, help texts and required flags; whether all three items are published rather than "changes in draft" (the live pages do show all three).
- The slot Allowed components and tooltips, and the marketer drop test (`&simulateRole=marketer`): Designer only, and listed as open in the decision file.
- The empty state could not be seen: every list has items, so Webflow renders no `w-dyn-empty`. Proving it would need a test instance with no ticked review.
- Safari/WebKit and real devices.
- Hire an expert was compared by numbers (identical to Home at every width). I did not open its revealed screenshots one by one.

### Evidence (session scratchpad, not committed)
`/private/tmp/claude-501/-Users-aniek--claude-spares-spare-2UW5Dy/00deb7d7-cbeb-4a88-8772-b5af3c248575/scratchpad/ev/`: `tc-<page>/` (testimonials-check at 11 widths, report.json + PNGs, captured before the scroll reveals ran), `look-home/` (rest-1512/768/402 after scrolling, hover-, focus-, clients-hover-1.png), `a11y/<page>/summary.md` + axe json, `distances.md` (before/now/design table), `sec-<page>.html` (section markup as published).

What was confirmed fine: names and order Chance → Jocelyn → Marcus in Start/Center/End on all 3 pages. On Home and Hire, 3 links `/clients` named «More client reviews» with arrows; on Clients, 0 links, 0 arrows, no hover, normal cursor. Boxes identical to the 2 Nov state at every width (1512: cards 440, centre card → panel 32, side cards at 687 / 723; 402: 362 wide, gaps 20; 768–991: cards 640). No sideways scroll at any width. No `w-dyn-empty` or «No items found». Console clean on all pages. Keyboard ring only on `:focus-visible`, none after a mouse click. Avatars load (144 px for a 48 px circle). Exactly 3 cards per page, so no old cards were left behind.
