# Home

Plan: `references/plans/2026-10-31-home-hero.md`. Figma: page frame **1. Home B** (`2710:48615`); mobile frame `1. Home` (`2365:38349`). Built by Aniek Velthuizen with Claude.

## 2026-10-31 — Home B is the Home page
Conflict: Figma has `[figma-only] 1. Home A` (tabbed hero, `Header / Home v01` type=home) and **1. Home B** (type=variant3); the only mobile frame draws the Home A hero.
Choice (owner, 2026-10-31): build Home B. Its header at every width; below 768 px the mobile frame's order (text, buttons, stat line, expert cards as a swipe row, logos) without the photo, the Expert card and the quote. The "I'm looking for" tab switch is not built.
Why: Home B is the page frame not marked `[figma-only]`.

## 2026-10-31 — Page structure
`page_wrap` › Global Styles · Global Guides · **Nav** · `page_main` › **Hero Experts** · **Footer** — the same order as the other pages (nav decision Q1: the Nav goes on Home with the homepage build). The Lumos starter block (Style Guide logo, heading, buttons) was removed.

## 2026-11-01 — «The risk» under the hero
Plan: `references/plans/2026-11-01-home-risk.md`. Figma `Content / 4 UBRS` (`2710:48617`), directly under the header on 1. Home B. Built as **Stagger Cards** (`decisions/components/stagger-cards.md`), in `page_main` after Hero Experts. Home B copy at every width (the mobile frame draws Home A's «What sets us apart» with 4 cards — not built, as with the hero).
Page now: `page_wrap` › Global Styles · Global Guides · Nav · `page_main` › Hero Experts · **Stagger Cards** · … · Footer. (Another session was building `sticky-steps_wrap` and a Collection List on Home at the same time, outside `page_main`; not touched here.)

## 2026-11-01 — «Our method» (scrolly telling)
Plan: `references/plans/2026-11-01-home-method.md`. Figma `Content scrolly telling / Glass cards` (`2710:48618`), third block on 1. Home B. Built as **Sticky Steps** (`decisions/components/sticky-steps.md`), in `page_main` after Stagger Cards.
Page now: `page_wrap` › Global Styles · Global Guides · Nav · `page_main` › Hero Experts · Stagger Cards · **Sticky Steps** · (two Collection Lists from another session, outside `page_main`) · Footer.

## 2026-11-01 — «Content block» twice (Split Content)
Plan: `references/plans/2026-11-01-content-block.md`. Figma `Content / Content block`, Home B instances 4 («Selected by people who did the job.», after Our method) and 9 («Working in project controls?», before the CTA). Built as **Split Content** (`decisions/components/split-content.md`). Owner (Aniek): place both now; #2 stays at the end of `page_main` until Services, Testimonials, Recruitment process and «3 UBRS» are built above it.
Page now: `page_main` › Hero Experts · Stagger Cards · Sticky Steps · **Split Content** (#1) · **Split Content** (#2, Space Top none) · then Footer.

## 2026-11-02 — «Expertise» (Six disciplines), no tab variant
Plan: `references/plans/2026-11-02-home-expertise.md`. Figma `Content / Services` (`2323:32509`): only `type=expertise` is on 1. Home B (`2710:48619`, after Content block #1). The tabbed `type=services` sits only on `[figma-only] 1. Home A`; owner (Aniek, 2026-11-02): "stond op de oude versie van de homepage, dus dat met de tabjes hoef je niet te bouwen". `variant-2` / `variant3` are used nowhere — not built.
Built as **Spotlight Grid** (`decisions/components/spotlight-grid.md`) between Split Content #1 and #2, with Card Primary Discipline ×6 (the claude.ai Webflow connector reached the site again later that day).
Page now: `page_main` › Hero Experts · Stagger Cards · Sticky Steps · Split Content #1 · **Spotlight Grid** · Split Content #2 · CTA Split (another session, same day) · then Footer.

## 2026-11-02 — «CTA» at the end of page_main
Plan: `references/plans/2026-11-02-home-cta.md`. Figma `Content / CTA` (`2710:48623`), last block on 1. Home B before the footer. Built as **CTA Split** (`decisions/components/cta-split.md`), Space Top none.
Page now (Services session placed Spotlight Grid the same day): `page_main` › Hero Experts · Stagger Cards · Sticky Steps · Split Content #1 · Spotlight Grid · Split Content #2 · **CTA Split** · then Footer. Placed after the Services session released `page_main` ("Home vrij").

## 2026-11-02 — «Testimonials» after Expertise
Plan: `references/plans/2026-11-02-home-testimonials.md`. Figma `Content / Testimonials` (`2710:48620`), block 6 on 1. Home B. Built as **Spotlight Grid › Reviews** (`decisions/components/spotlight-grid.md`) with Card Testimonial × 3. Placed by appending to `page_main` and re-appending Split Content #2 and CTA Split; Split Content #2 Space Top none → large (it now follows a grey section).
Page now: `page_main` › Hero Experts · Stagger Cards · Sticky Steps · Split Content #1 · Spotlight Grid · **Spotlight Grid (Reviews)** · Split Content #2 · CTA Split · then Footer.

## 2026-11-05 — Last two blocks, page complete (Aniek Velthuizen, via Claude)
Plan: `references/plans/2026-11-05-rest-of-site.md`. Figma `2710:57363` and `2710:57450`. Not published yet.
Page now: `page_main` › Hero Experts · Stagger Cards · Sticky Steps · Split Content #1 · Spotlight Grid · Spotlight Grid (Reviews) · **Sticky Steps Plain** · **Stagger Cards Plain (3 UBRS)** · Split Content #2 · CTA Split · then Footer.
- **Sticky Steps Plain** (`6c7402b5-5a44-8854-9d15-ef3ed9a21649`): Nav Colour light, Space Top medium, List Align end, three Process Steps with list off. «Learn more» → `/how-it-works`. Title split where Figma's colour changes: «From requirement» / «to shortlist in days.».
- **Order:** the API refuses an instance as anchor, so 3 UBRS, Split Content #2 and CTA Split were re-appended to `page_main` in that order. Their ids and props are unchanged.
- **Button Text:** emptied on the nine Card Primary instances with no button in Figma (Glass ×3, Process ×3, Engagement ×3). Their published HTML had an empty `card_primary_button`. The six Discipline cards keep «View», as Figma draws it.
- **Placeholders kept as Figma:** the lorem text in Sticky Steps Plain, Split Content #2 and the two quotes (hero, Split Content #1).
- **Open, not changed (the approved props stay as they are):** Split Content #2 is still Space Top `large`, set when it followed the grey Reviews. It now follows white 3 UBRS, which has 192 at its bottom, so the gap is 384 and the block 835 high. Figma has 192 and 643, which is Space Top `none`.
- **Open, not changed:** «Request a shortlist» in the hero and in CTA Split goes to `/hire-an-expert` (`decisions/components/cta-split.md`); the link list of this run says `/contact`.

## 2026-11-05 — Split Content #2 Space Top none (Aniek Velthuizen, via Claude)
Back to `none`: its neighbour is now the white 3 UBRS, and the frame has 192. Block 643 at 1512, as the frame (simulated, not published).

## 2026-11-12 — Reviews from the CMS
The three Card Testimonials in Spotlight Grid (Reviews) are now three `Reviews · picked` (Chance, Jocelyn, Marcus; link `/clients`). See `decisions/components/reviews-picked.md`. Aniek Velthuizen, via Claude.
