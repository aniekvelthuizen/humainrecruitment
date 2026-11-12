# Motion

Owner rule (2026-11-02): the site stays calm. Motion only where it helps: a short intro in the hero on page load, hovers, and the Home expert switcher. No scroll reveals on other sections. Built by Aniek Velthuizen with Claude.

## 2026-11-02 — Hero intro on page load
Every part of a hero fades in once on load and rises 16 px (`translate`, not `transform`, so it never fights an element's own transform). Duration 0.7 s, easing `cubic-bezier(.22,1,.36,1)` (a soft ease-out). Order top to bottom, everything still after about 1.2 s:

| `data-hero-reveal` | Start | Note |
|---|---|---|
| nav (`[data-nav="component"]`, no attribute) | 0 s, or as soon as it knows its colour | drops 8 px, 0.6 s; only on pages that have a `data-hero-reveal` element; hidden until `data-nav-theme` is set (or the page has loaded) |
| `title` | 0.05 s | |
| `text` | 0.15 s | |
| `photo` | 0.2 s | fade + scale 1.03 → 1, 0.9 s |
| `actions` | 0.25 s | |
| `card` | 0.3 s | |
| `stat` | 0.35 s | |
| `quote` | 0.4 s | |
| `row` | 0.5 s | with `data-hero-wait`: hidden until its script sets `data-ready`, or until the page has loaded (`html[data-hero-loaded]`); the rise plays from then |
| `logos` | 0.6 s | |

- **Where:** CSS keyframes in the component **`Global | Custom Code`** (`4fa331b7-bbf3-e025-cd96-3a3fd7c45564`, group Global), at the top of `page_wrap`. CSS only, so it plays from the first paint and never waits for a script. Today only on Home: give a page this component when it gets a hero.
- **New hero:** put `data-hero-reveal="<name>"` from the table on its parts. To switch a part off, remove the attribute.
- **Off:** with `prefers-reduced-motion` and in the Designer (`.wf-design-mode`); the gate is Webflow's own `html.w-mod-js`, so nothing stays hidden without JavaScript.
- Owner (2026-11-02): calm, "geen kermis"; the nav belongs to the hero intro; the burger menu panel is not animated.

## 2026-11-02 — Home expert switcher
- **Switch:** the old panel fades out in 0.2 s; the new photo fades in with scale 1.02 → 1 (0.5 s, start 0.12 s), the card rises 8 px (start 0.17 s), the quote follows (0.24 s). Done in about 0.6 s, the same time the row takes to slide (Swiper 600 ms). Never two cards visible at once (measured).
- **Autoplay:** every **6 s** (`data-hero-experts-autoplay` on the section, in seconds). It stops for good once the visitor touches the row (click, arrow, swipe, drag, horizontal wheel, arrow keys). It pauses while the mouse is over the row or the stage (photo, card, quote), while neither the row nor the stage is in view, and while the tab is hidden. Only ← → keys count as touching it. It is off for reduced motion and with one expert. No progress line (owner: calm).
- Details and code: `decisions/components/hero-experts.md`.

## 2026-11-02 — Exception: Score Chart reveal and hover, Split Content glow (owner)
Owner (Aniek): «een leuke animatie in de score card, een inlaad-animatie, en on mouse movement; en de groene gradient onderin mag lichtelijk animeren bij scroll into view». An explicit exception to «no scroll reveals» for these two things only; everything else stays calm.
- **Score Chart reveal** (once, when ≥ 35 % in view): bar segments grow left to right (`scaleX` 0 → 1, 0.7 s, 0.08 s apart), legend rows fade in (0.6 s, start 0.15 s, 0.06 s apart; no rise — in Safari a moved row made the one-column legend 8 px taller until the reveal, so the page below jumped), the values count up from 0 (0.8 s, ease-out). Done in about 1.4 s. Easing as the hero: `cubic-bezier(.22,1,.36,1)`.
- **Score Chart hover** (pointer devices only): pointing at a legend row or a bar segment keeps that pair in full colour and dims the others to 35 %, its dot grows 1.3×; 0.25 s. Off during the reveal.
- ~~Split Content glow rising in~~ — removed the same day, owner: «niet te zien met het blote oog en niet per se mooi». The glow is static again.
- **Mechanism:** a small script per component (its own script embed; the CSS sits in a separate style-only embed so the Designer still shows colours and layout) sets `data-score-motion` ready → in → done; the CSS transitions do the rest. Transitions only in the `in` state, so hiding is instant (first version faded *out* for 0.75 s first — fixed). No GSAP needed.
- **Off:** reduced motion, no IntersectionObserver, or no JavaScript → everything static and visible. The Designer shows the finished state. Sources: `references/embeds/`.

## 2026-11-12 — Arrow links: the arrow swaps sides on hover (Aniek Velthuizen, via Claude)
Owner (Aniek): links with an arrow before the text ("→ View") animate: the left arrow goes, the text slides left, the arrow comes back on the right. Same everywhere; not on buttons.
- **Which:** Button Main **Tertiary** with Icon **Arrow Right** only (selector `[data-wf--button-main--button-variant="tertiary"]:has([data-wf--icon-set--variant="arrow-right"])`). Today that is the "→ View" in Card Primary's Discipline cards (6 on Home, 1 on Example Components, 3 on the Styleguide). Primary/Secondary buttons, the Back link (Arrow Left), "Show all filters" / "See details" (chevron) and the card notch arrows are untouched. A new Tertiary with Arrow Right gets it by itself.
- **Motion (v2, owner: the first version was «rommelig»):** left arrow, label and a second arrow (`.button_main_element::after`, same SVG as Icon Set's Arrow Right, `currentColor`) slide left together by one step (icon + gap = 1.5rem), 400 ms `cubic-bezier(.65,.05,.36,1)`, the same both ways. The left arrow fades out in the first 200 ms, the right one fades in during the last 200 ms, so two arrows never show at once. Nothing moves vertically (measured at 0/100/200/300/400 ms).
- **Own switch, not the Lumos trigger:** `--arrow-link` (0/1) is 1 while the link is hovered or has focus inside it, or while its `[data-trigger]` card is hovered (`hover`, or `hover-if-clickable` with a visible Clickable) or has keyboard focus. In a clickable card the card's link layer covers the button, so the card is what gets hovered. v1 flipped the Lumos trigger instead, which also switched on the button's hover look: the 2 px lift (text went up and down) and the growing underline. These links now have no lift and no underline, anywhere (owner: «die hover hadden we eerst niet»). Reduced motion: instant swap.
- **Where:** a second HTML embed in **`Global | Custom Code`** (`ab7c2a2d-c89b-c4a5-b14d-832caacbe802`), source `references/embeds/arrow-link-style.html`. A `::after` on a variant does not publish here (`site.md`), hence the embed. Owner (2026-11-12): the examples on Styleguide and Example Components animate too, so both pages now have `Global | Custom Code` at the top of `page_wrap` (all other embeds in it apply there as well).
- Searched all 31 published pages (incl. 13 opportunity pages) for any visible arrow next to short text: only these links. «Back to opportunities» (Arrow Left) is left out: a back link should not swap direction.
- The `::after` arrow uses the CDN URL of `icon-arrow-right.svg`; if that asset is replaced, update the URL in the embed.

## 2026-11-12 — Exception: quotes reveal word by word (owner)
Owner (Aniek): «alle quotes animeren met een stagger animation van GSAP, dat de woorden één voor één invliegen. Alleen bij quotes, niet bij alle titels.» A second explicit exception to «no scroll reveals». Built by Aniek Velthuizen with Claude.
- **What:** once, when the quote enters the view (15 % above the bottom edge), each word rises 24 px and fades in: 0.6 s per word, `power3.out`, 0.08 s between words. A ten-word quote is done in about 1.3 s.
- **Which quotes:** every element with `data-quote-reveal`. Set on the quote in **Spotlight Grid** (`spotlight-grid_quote-text`, Home «Expertise», Clients) and **Split Content** (`split-content_quote-text`, when Quote Visibility is on). Not on: the Hero Experts quote (already part of the hero intro and the expert switch, a third motion would fight it), titles. Card Testimonial gets its own entrance (below).
- **Tuning per quote:** `data-quote-reveal-stagger="0.1"` and `data-quote-reveal-duration="0.7"` (seconds) on the same element. **Off:** remove `data-quote-reveal`.
- **Mechanism:** script in its own embed of `Global | Custom Code` (`61fdba5b-e2d3-5b70-a803-be8306cc84a7`, the fourth; the second is the arrow-link hover, the third the two-tone headings), on Webflow's own GSAP 3.15; source `references/embeds/quote-reveal-script.html`. It splits the text nodes into `span[data-quote-word]` (inline-block; only real spaces split, so non-breaking hyphens like «go‑to» stay one word and lines wrap as before). A gate (`html[data-quote-gate]`) hides only the unsplit quote, so nothing flashes; it is released after 4 s, without GSAP, and never set with reduced motion, without IntersectionObserver or in the Designer — then the quote is simply static.

## 2026-11-12 — Exception: Stagger Cards (base) reveal and moving icons (owner)
Owner (Aniek), feedback on Home «The risk»: the cards rise in «heel subtiel, één voor één»; the clock keeps turning, the route icon's arrow and crosses animate in, the loupe sways as if searching. An explicit exception to «no scroll reveals», for this block only. Done by Aniek Velthuizen with Claude.
- **Cards:** when a card is ≥ 20 % in view (bottom 10 % of the screen excluded) it rises 24 px (1.5rem) and fades in, 0.8 s, easing `cubic-bezier(.22,1,.36,1)` (as the hero); cards entering together start 0.15 s apart. Opacity sits on `card_primary_element` (the glass layer itself), the rise on the card wrap, so the background blur is never inside a fading parent. List height measured unchanged (326 at 1440, 790 at 402): nothing below moves.
- **Clock** (`schedule-outline`): minute hand one turn per 8 s, hour hand per 96 s, linear, endless.
- **Route** (`project-controls`): circle and line draw in (1 s, from 0.3 s after its card), the arrowhead appears at the end (1.15 s), the crosses land (scale 0.3 → 1, 0.35 s and 1.25 s). Then every 5 s each cross does a half turn (0.7 s) and the arrow nudges 0.9 px forward.
- **Loupe** (`person-search`): sways ±10° and ±0.9 px around its own centre, 3.6 s per sweep, endless. The person stays still.
- **Mechanism:** a script embed in Stagger Cards (keys on `data-wf--stagger-cards--variant="base"` — today only Home uses base; gradient and plain stay still) swaps those three masked icons for inline SVG with `data-icon-part` pieces (redrawn as strokes from the Figma icons, same 0.7 stroke at 24) and sets `data-stagger-motion="ready"`, then `data-stagger-in` per card. CSS in its own style-only embed. Loops pause while the section is out of view (`data-stagger-paused`).
- **Off:** remove the script embed (the style embed then does nothing). Reduced motion, no IntersectionObserver or no JavaScript → static mask icons, cards visible. The Designer shows the plain cards and mask icons. Sources: `references/embeds/stagger-cards-motion-*.html`; check: `node references/stagger-motion-check.mjs`.
- A new icon in this block stays a static mask icon until it gets an entry in the script's `ICONS`.
- **Route circle closed (owner, same day):** the circle did not close after drawing in. Cause: Chrome measures a `<circle>` with `pathLength` imprecisely, so its dash ended short. Fix: circle and line are one `<path>` (two arcs, then the line), dash `1.02 2`, hidden offset `1.03` — closes fully, no specks before the draw.

## 2026-11-12 — Two-tone headings: the grey or turquoise words colour in one by one (owner)
Owner (Aniek): the grey part of the black/grey titles starts black and turns grey with an animation, «zodat we daar een beetje diepte in krijgen». Same day, after seeing a first version (a left-to-right sweep): «mooier als de woordjes één voor één grijs worden», and the turquoise titles may do it too. A third exception to «no scroll reveals», for these headings only. Done by Aniek Velthuizen with Claude.
- **What:** every `_muted` span that is a direct child of an h1–h4 (`page-header_muted`, `split-content_muted`, `stagger-cards_muted`, `spotlight-grid_muted`, `cta-split_muted`, `hero-experts_muted`, `card-grid_muted`, …) and the turquoise `sticky-steps_accent` first show in the heading's own colour. When the heading scrolls into view (bottom 15 % excluded) the words take their own colour one after another: each word 0.6 s, `cubic-bezier(.45,0,.2,1)`, 0.14 s apart, first word at 0.1 s; inside a hero (`[data-hero-reveal]`) the first word waits 0.6 s, so it follows the title's rise. Once only. A `_muted` span in a paragraph (Hero stat, Card Grid text) is left alone.
- **Mechanism:** the script splits the span's text into inline word spans (`data-muted-word`, spaces kept as text, so line breaks and kerning stay the same) and transitions their `color` from the heading colour to the span's own. It reads both colours from the live page (heading `color`; span `color` × `opacity`, since some `_muted` classes use opacity 0.5 and others a 50 % colour), so it works on light and dark sections. After the last word the span gets `data-muted="done"`: the word spans stay, but carry no colour of their own; the class colour shows again.
- **No flash:** a gate (`html[data-muted-gate]`, set by the script before the headings are parsed) keeps the spans in the heading colour until the script has set them up; a 4 s guard removes the gate if the script never gets that far.
- **Off:** reduced motion, no IntersectionObserver, no JavaScript, and the Designer → the colours as designed.
- **Where:** an embed in `Global | Custom Code` (`141a108e-8c89-7794-a75a-166d962024d9`), so it is on every page. Source: `references/embeds/muted-heading-sweep.html`.
- To exclude a heading later: give the span a class not ending in `_muted`, or add `:not(...)` to the selector in the embed. Another colour accent: add its class next to `.sticky-steps_accent` (CSS gate and `SEL` in the script).

## 2026-11-12 — Testimonial cards: entrance instead of word reveal (owner)
Owner (Aniek): first asked for the word reveal on the cards too, faster (stagger 0.03 s, cards one after another); after seeing it: «in die quote cards is deze animatie eigenlijk niet zo mooi … iets leuks met dat icoon … wel subtiel». Word reveal removed from the cards; instead, once per card when it enters the view:
- **Quote mark** pops in: opacity 0 → 1, scale 0.6 → 1, rotation −12° → 0, 0.6 s, `back.out(2)` (a small overshoot).
- **Stars** light up one by one from 0.15 s: opacity 0 → 1, scale 0.5 → 1, 0.35 s each, 0.06 s apart, `back.out(2.5)`.
- **Quote text** fades in as one block from 0.25 s: rises 12 px, 0.6 s, `power3.out`. Footer (person, arrow) static.
- Cards that come into view together start **0.15 s apart, left to right**. Measured at 1512: card 1 done after 0.6 s, card 3 after 0.9 s.
- The card itself is not moved: its hover lift and dark quote mark (`card_testimonial_quote-hover`) stay as they were; all inline styles are cleared at the end.
- **Attributes** (Card Testimonial `19e313dd-…`): `data-card-reveal` on `card_testimonial_element`; `data-card-reveal-part="icon"` on `card_testimonial_quote`, `"stars"` on `card_testimonial_stars`, `"text"` on `card_testimonial_text`. Off: remove `data-card-reveal`. Same embed, gate and fallbacks as the quote reveal.
- The quote reveal also learned `data-quote-reveal-next` (default 0.3 s): quotes entering the view together start one after another, left to right.
