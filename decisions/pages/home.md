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

## 2026-11-01 — «Content block» twice (Split Content)
Plan: `references/plans/2026-11-01-content-block.md`. Figma `Content / Content block`, Home B instances 4 («Selected by people who did the job.», after Our method) and 9 («Working in project controls?», before the CTA). Built as **Split Content** (`decisions/components/split-content.md`). Owner (Aniek): place both now; #2 stays at the end of `page_main` until Services, Testimonials, Recruitment process and «3 UBRS» are built above it.
Page now: `page_main` › Hero Experts · Stagger Cards · Sticky Steps · **Split Content** (#1) · **Split Content** (#2, Space Top none) · then Footer.
