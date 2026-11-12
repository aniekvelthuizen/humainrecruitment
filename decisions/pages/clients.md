# Clients

Figma frame 7 `2292:8938`, export `references/figma/rest-of-site/pages/07-clients/`. Composed 2026-11-05 by Aniek Velthuizen, via Claude. Not yet published when written.

## Order
`page_main` › Page Header (Vertical, Logo Marquee in Row) · Cases Grid · Spotlight Grid (Reviews) · CTA Split.

## Chosen
- **Spotlight Grid Reviews:** a new instance set up as on Home: same photo, rating, button and three Card Testimonials with the same quotes and avatars. Avatar Alt is filled here («Portrait of …»); on Home it is empty.
- **CTA Split:** Space Top `large` (Figma 744 = 192 + 360 + 192, it follows the grey Reviews section), Title Muted empty.
- **Cases Grid:** Space Top `main`, cards not clickable (Figma draws no button on them).
- **Page Header:** the Opportunity-only props are emptied on this instance.
- **Links:** Hire an expert → `/hire-an-expert`, Contact us → `/contact`, See all clients and the three testimonial arrows → `/clients` (both removed 2026-11-12, below).

## Open
- If HumAIn has an external review page (Google Reviews, Trustpilot), the Clients cards can link there and get their arrow back. Needs the URL from the client.

## 2026-11-12 — «See all clients» button off
Owner: the button goes, you are already on that page. Spotlight Grid instance on Clients: **Button Visibility** off (prop override, component unchanged; Home keeps its button). Done by Aniek Velthuizen, via Claude.

## 2026-11-12 — Testimonial cards not clickable
Owner: the three Card Testimonial arrows linked to `/clients` as well; there is no reviews page or case detail page to send them to (reviews are not a CMS collection, the Cases template has no design). On this page **Link** and **Screen Reader Text** are emptied on all three cards, so they are not clickable and the arrow does not render (deviates from Figma). Home and Hire an expert keep their links to `/clients`. Done by Aniek Velthuizen, via Claude.

## Deviates from Figma
- Company «Google» as on Home; Figma has «GOOGLE» here.

## Placeholders kept
Cases: three times the same Figma copy, and the photos carry a Getty watermark (`decisions/cms.md`; replace before go-live). Eyebrow «clients» in lower case as Figma.

## 2026-11-12 — Reviews from the CMS
The three Card Testimonials are now three `Reviews · picked` (Chance, Jocelyn, Marcus; no link). Avatar Alt is empty now, as on Home. See `decisions/components/reviews-picked.md`. Aniek Velthuizen, via Claude.
