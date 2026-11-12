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

## 2026-11-12 — Facts Row figures fly in like the quotes (owner)
Owner (Aniek), on the Facts Row («-25 / 30%», «2–4 days», «Top 5%», «100%»): «mooi als die facts op dezelfde manier inanimeren als de quote titels». Same word reveal as the quotes, another explicit exception to «no scroll reveals». Done by Aniek Velthuizen with Claude.
- **What:** the figure (`card_primary_title`) of every card in a Facts Row: words rise 24 px and fade in, 0.6 s, `power3.out`, 0.08 s apart; figures entering the view together start 0.3 s apart, left to right (stacked on mobile: top to bottom). The caption below stays still.
- **Mechanism:** the quote-reveal embed (`61fdba5b-…`) selects `[data-facts-row] .card_primary_title` next to `[data-quote-reveal]` (script and gate CSS). Selected through Facts Row rather than an attribute on Card Primary, so Stat cards elsewhere keep still. Same gate, 4 s guard and fallbacks.
- **Off:** remove that selector from both places in `references/embeds/quote-reveal-script.html` and the embed. Check: `node references/quote-reveal-check.mjs <url>` (now includes the figures).

## 2026-11-12 — Pricing Row prices fly in like the quotes (owner)
Owner (Aniek), on the price cards («From €XX», «€XX», «Custom»): «maak dezelfde animatie voor de prijzen». Same word reveal as the quotes and the Facts Row figures. Done by Aniek Velthuizen with Claude.
- **What:** the price (`card_primary_number`) of every card in a Pricing Row: words rise 24 px and fade in, 0.6 s, `power3.out`, 0.08 s apart; prices entering together start 0.3 s apart, left to right. The unit label («/ hour margin», «/ scope») stays still.
- **Inside a hero** (Rates, where the row sits in the Page Header as `data-hero-reveal="row"`): the first price waits an extra 0.6 s, so it follows the row's own rise (measured: row in at ~1.0 s, prices done at ~1.9 s). This applies to any reveal target inside `[data-hero-reveal]`.
- **Mechanism:** the quote-reveal embed (`61fdba5b-…`) selects `[data-pricing-row] .card_primary_number` (script and gate CSS), next to the Facts Row figures. Off: remove that selector in both places.

## 2026-11-12 — Stagger Cards motion on every stair section (owner)
Owner (Aniek): «alle blokken die in een trappetje staan en dit soort icons hebben, mogen dezelfde animatie hebben» — looping icons, cards in one by one like a stair. Done by Aniek Velthuizen with Claude. This widens the exception above from the base variant to **every Stagger Cards section** (base, plain, gradient): Home «The risk» and «Engagement models», Hire an Expert, How It Works.
- **Cards:** unchanged (24 px rise + fade, 0.8 s, 0.15 s apart).
- **New icon loops** (all calm, same 0.7 stroke at 24, redrawn from the site's icon files):
  - `person-shield`: the shield breathes, scale 1 → 1.12 → 1, 2.8 s.
  - `person-check`, `check-circle`, `list-check`: the tick draws (0.7 s), holds, fades and redraws, 3.2 s per round.
  - `assignment`: the three clipboard rows write in one after another (0.25 s apart), hold, fade, 4 s per round.
  - `handshake`: a short shake (−6°, 5°, −3°) every 3.6 s, then still.
  - `outbound`: the arrow moves 0.8 / 24 out to the corner and back, 2.8 s.
- **Mechanism:** the script no longer filters on the variant; it runs on every `[data-stagger-cards]`. An icon without an `ICONS` entry stays a static mask; add an entry to animate it.
- Measured on staging at 1440 and 402 on all four sections: cards in at ~0.8 s each, list height unchanged, reduced motion static and visible, console clean.

## 2026-11-12 — Two-tone headings reversed: dimmed words light up (owner)
Owner (Aniek), looking at the Card Grid closing text on Project Delivery Experts: «mooier dat we die animatie in de titels andersom doen. Zodat het eerst uitgedimd is en dat dan de woorden oplichten. En dat je dat dan ook in dit blok doet.» Replaces the «grey words one by one» version above (same embed, same trigger). Done by Aniek Velthuizen with Claude.
- **What:** in every two-tone heading (h1–h4 with a direct `_muted` or `sticky-steps_accent` child) and in **`card-grid_closing-text`** (a paragraph, the only one included), all words outside the `_muted` part start dimmed and light up one by one to their own colour when the block scrolls into view (bottom 15 % excluded). The `_muted` part is never touched: it stays grey from the start. Dim colour = the `_muted` part's own colour (colour × opacity); in a heading without a `_muted` part (turquoise Sticky Steps titles) half the heading colour, and the accent words light up to turquoise.
- **Timing:** each word 0.6 s, `cubic-bezier(.45,0,.2,1)`, 0.14 s apart, first word at 0.1 s (0.6 s inside a hero). Long texts are capped: the step shrinks so the last word starts within 1.8 s (closing text: 15 words, 0.129 s apart).
- **Mechanism:** only the words outside `_muted` are split into `span[data-muted-word]`. In `ready` they carry `--mm-from`; in `in` that colour is dropped and they transition to the inherited colour, so the final colour is always the designed one. Gate (`html[data-muted-gate]`) dims the lit parts with `color-mix(currentColor 50%)` until set-up, 4 s guard. Needs `:has()`; without it, reduced motion, no IntersectionObserver, no JavaScript or in the Designer → static colours as designed.
- **Card Grid closing statement** («Only proven performers reach clients», display text over the bars) added the same day (owner: «daar moet het effect ook in»). Its grey part is `card-grid_statement-muted` (a hyphen, so `[class*="_muted"]` misses it): named explicitly in the gate, `SEL` and `MUTED`. 3 words, 0.14 s apart.
- **Not included:** other `_muted` spans in paragraphs (Hero stat). To add a paragraph: put its class next to `.card-grid_closing-text` in both the CSS gate and `SEL` (and its grey class in `MUTED` if it does not contain `_muted`).
- Same embed (`141a108e-…`), source `references/embeds/muted-heading-sweep.html`; check: `node references/muted-heading-check.mjs [url]`.

## 2026-11-12 — Stage Certified turns mint when it comes into view (owner)
Owner (Aniek): «dat deze groene kaartjes pas bij scroll in view groen worden», in the slider and in the overview. Another explicit exception to «no scroll reveals», for this card only. Done by Aniek Velthuizen with Claude.
- **Which:** every Card Primary **Stage Certified** (`7cac990b-…`). Today two, both on Project Delivery Experts: stage 9 in the Stage Slider and stage 9 in the Card Grid overview.
- **What:** the card starts white (Theme `background-2`, like the other stage cards). When ≥ 60 % of it is in view (bottom 10 % of the screen excluded) the white → mint gradient fades in: 1.4 s, `cubic-bezier(.45,0,.2,1)`, from 0.15 s. Once only. In the slider this happens when the visitor slides to it (the observer also sees horizontal movement); with the row in view but stage 9 off screen it stays white. End state is the same gradient as before (`to bottom right`, `#fff` → `#00ffd5`).
- **Mechanism:** a fifth embed in `Global | Custom Code` (`6885f746-6f1e-0e86-efc0-19318c55f896`), source `references/embeds/stage-certified-glow.html`. The script sets `data-stage-glow` ready → in on `card_primary_element`; the CSS swaps the variant's background for a `::before` layer with the same gradient (under `card_primary_content`, which has `z-index: 1`) and fades its opacity. A gate (`html[data-stage-gate]`) keeps the card white until the script has run; released after 4 s.
- **Off:** reduced motion, no IntersectionObserver, no JavaScript and the Designer → the card is mint as designed. Remove the embed to switch it off everywhere.
- Measured on staging (`node references/stage-glow-check.mjs`, 1440 and 402): both cards white at load; grid card veil 0 → 0.75 → 1 at 0.9 / 1.8 s after scrolling to it; slider card white with the row in view, mint after sliding to the end; reduced motion mint at once; console clean.

## 2026-11-12 — Nav logo: mint spotlight (owner)
Owner (Aniek) looked at two rounds of prototypes (`references/prototypes/logo-animations.html`, `logo-animations-2.html`; round 1 «nog geen 1 weggeblazen») and chose round 2 idea 4, «Spotlight»: «4 vind ik tof, doe die maar!». Built by Aniek Velthuizen with Claude.
- **Page load:** 0.4 s after the page is ready a soft mint light slides once through the letters, left to right (centre −27 % → 127 % of the logo width), 1.3 s, `cubic-bezier(.65,0,.35,1)`. Every page load, every page with the Nav.
- **Hover (mouse/trackpad only, `hover: hover` and `pointer: fine`):** the light grows in (320 ms, hero easing) where the cursor enters and follows it inside the letters; leaving shrinks it away. Touch: load sweep only.
- **Size:** light radius 120 (sweep) / 110 (hover) of the 514-wide logo: 42 / 38.5 px on the 180 px desktop logo, 29.6 px on the 127 px phone logo.
- **Colour:** `brand-accent-500` (#00ffd5) while the bar is transparent over a dark section (the same condition that makes the logo white); `brand-accent-700` (#00806b) on the white or scrolled bar. The light is gradient-only on top of the logo, so the logo itself keeps its own colour and colour transitions.
- **Mechanism:** a fifth embed at the end of `Nav` (`3a2f55f5-1281-c34c-3b3a-8dc3ceb1f585`, class `u-embed-js`, CSS + script), source `references/embeds/nav-logo-spotlight.html`. The script adds `span.nav_logo_spot` over each nav logo svg (desktop and mobile), masked by the logo's own paths, and sets `data-state="sweep" | "hover"`; CSS animates registered custom properties (`@property --logo-spot-x/-y/-r`). No `requestAnimationFrame` (nav rule). The logo markup and size are untouched.
- **Off:** reduced motion → no light. Remove the embed to switch it off. A replaced logo still works if it stays an inline svg in `.nav_desktop_logo` / `.nav_mobile_logo`.
- Check: `node references/logo-spot-check.mjs` (Home, Contact, How It Works, Pricing, Opportunities at 1512, 1024, 402, reduced motion: all pass, console clean). Not checked: Safari, real devices, the white scrolled bar by eye.

## 2026-11-12 — Header glow rises in on page load (owner)
Owner (Aniek), after a prototype on Contact: «ik vind het wel erg tof! integreer maar op alle pagina's». The pink end of the brand gradient (`gradient/brand-end`) no longer sits there from the first paint: the header starts blue and the glow rises from the bottom edge. Part of the page-load hero intro, so no exception to «no scroll reveals». Done by Aniek Velthuizen with Claude.
- **Motion (v4):** one gradient, nothing on top. The blue stop itself rises from 90 % to 70.19 % while the end colour turns from blue to pink, so the gradient has one bend at every moment, as the original. The top part shifts very slightly while the stop moves. 2 s from 0.4 s after load, easing `cubic-bezier(.4,0,.2,1)`. Driven by two registered properties (`--header-glow-mid`, `--header-glow-end`); the resting values are the original gradient, so the end state is identical and a browser without `@property` simply shows the finished header. Header heights unchanged.
- **v1 → v4, owner:** v1 slid a pink layer up — «tijdelijk een harde lijn» (its pale top sat at the header's bottom edge against the white section). v2 revealed the layer behind a feathered mask — «alsof het twee keer een gradient omhoog komt» (the layer's own ramp plus the mask's ramp). v3 animated the gradient's own end stops but kept a flat blue band between two bends — owner: a light line above a darker one («de overgang … niet helemaal smooth»). v4 moves the one blue stop, so there is no band. Owner: one more try, otherwise leave it; a single bend where blue meets pink stays (it is in the original too). Owner on v4 (2026-11-12): «dit is perfect».
- **Which headers:** Hero Experts (Home) and Page Header base, Vertical and Opportunity (`page-header_wrap`), plus Search (`page-header_top`, Opportunities). 13 pages today. Not Light (Consulting, no gradient) and not Split (Hire an Expert, mint radial). The footer and pink-ending sections lower on the page (Sticky Steps, Spotlight Grid, Pricing Row, Values Grid, Stagger Cards) stay static: they are not seen at load.
- **How:** the gradient is redeclared in the embed with the two properties as its last stops. Selectors list the Page Header variants by id: a **new Page Header variant with its own background must be added to the `:not(...)` list**, or it gets the blue base.
- **Where:** the eighth HTML embed in **`Global | Custom Code`** (`24fbbfa8-a829-ddf7-dd9c-f6a6c5629743`), CSS only; source `references/embeds/header-glow-style.html`. Pages without `Global | Custom Code` keep the static gradient.
- **Off:** reduced motion, no JavaScript (`html.w-mod-js` gate) and the Designer show the finished glow. Revert: remove the embed.
- Check: `node references/glow-check.mjs` (`WIDTH=402`, `REDUCED=1`).

## 2026-11-12 — Spotlight Grid photo follows the mouse: prototype (open)
Owner (Aniek) asked whether the person in the brand-gradient photo panels could move slightly with the mouse. Prototype by Aniek Velthuizen with Claude: `references/prototypes/photo-parallax.html` (both panels: Reviews and Expertise, the real staging photos).
- Possible without new assets: both photos are already cut-outs on top of the panel gradient (`spotlight-grid_visual` › `_image`), so only the person moves and the gradient stays.
- Variants in the prototype: **A Drift** (person moves ±strength px x, 0.6× that in y), **B Depth** (A + a faint mint light behind her moving the other way), **C Tilt** (small 3D turn). Default strength 8 px, easing 0.08 per frame.
- Rules in the prototype, meant for the build: the whole section listens (not just the photo); mouse only (`hover: hover` and `pointer: fine`), off for reduced motion; glides back to the centre on leave and when the panel leaves the view; `requestAnimationFrame` only while moving. The photo sits 16 px below the panel edge so an upward move never opens a gap (on the site: `bottom: -1rem` on `_visual`, the panel clips it).
- Not chosen yet: variant and strength. Not built on the site.

### 2026-11-12 — Prototype round 2 (owner feedback)
Owner (Aniek): «hij moet veel langzamer bewegen», «als je naar rechts beweegt met de muis, moet hij juist naar links bewegen», «Diepte effect is leuk!».
- **Direction inverted:** cursor right → person left; the mint light behind goes with the cursor (the opposite of the person, so the depth stays).
- **Slower:** easing 0.08 → **0.02** per frame (slider «Snelheid» 0.005–0.080).
- **Default variant B Depth**, strength 8 px. Still a prototype; not built on the site.

## 2026-11-12 — Upload ✕ turns on hover (Aniek Velthuizen, via Claude)
Owner: the remove ✕ on a chosen CV turns on hover. 90° (`rotate`, not `transform`), 0.3 s, the site's ease-out `cubic-bezier(.22,1,.36,1)`; back the same way. Hover only on pointer devices (`hover:hover`), so a tap does not leave it turned; also on keyboard focus. Reduced motion: no transition. In the first embed of `Global | Custom Code`, so Resume and Opportunity Detail both get it. Checked on staging /submit-resume: 90deg on hover.

## 2026-11-12 — Spotlight Grid photo follows the mouse: built (owner)
Owner (Aniek): «Ja, bouwen» after prototype round 2. Built by Aniek Velthuizen with Claude. Both Spotlight Grid panels (Expertise: Home; Reviews: Home, Hire an expert, Clients).
- **What moves:** the cut-out person, **against** the mouse (cursor right → person left), at most **8 px** x and 4.8 px y; a faint mint light behind her (created by the script, `span.photo-parallax_glow`, under the content) moves with the cursor, 2× / 1.5× that. Easing **0.02 per frame** (about 3 s to settle). The whole section listens. Leaving the section or the panel leaving the view → glides back to the centre.
- **Photo 6 px lower** while it is on (mouse devices), so an upward move never shows a gap at the panel's bottom edge; the panel clips it. Touch, reduced motion and the Designer show the photo exactly as before.
- **Mechanism:** attributes on the Spotlight Grid definition: `data-photo-parallax` on `spotlight-grid_panel`, `data-photo-parallax-photo` on `spotlight-grid_visual`. Script + CSS in the ninth embed of `Global | Custom Code` (`9991f8f0-2c16-c586-f1b6-a72f248e63bf`), source `references/embeds/photo-parallax.html`. Moves with the CSS `translate` property, so the visual's own `transform` (centring) is untouched. `requestAnimationFrame` only while moving.
- **Tuning:** `M`, `EASE`, `DROP` at the top of the script. **Off:** remove `data-photo-parallax` from the panel (per component), or the embed (everywhere). Another photo panel: give it the same two attributes.
- **Check:** `node references/parallax-check.mjs [url] [outdir]` — on staging (1440): both panels right −7.7 px / light +15.5 px, left +7.4 / −14.8, back to 0 after leaving; reduced motion and touch not set up; console clean.

## 2026-11-12 — Cards 3D: Split header cards (owner)
Owner (Aniek), with a screenshot of the three tilted expert cards on Hire an Expert: «Kunnen we dit ook in een 3D model zetten dat het draait en dat ze ook één voor één inanimeren on page load?» An explicit exception to «calm»; only this visual. Built by Aniek Velthuizen with Claude.
- **In:** the three cards come in one by one, top to bottom: fade, rise 2.5rem, scale .94 → 1; 0.9 s, the hero ease `cubic-bezier(.22,1,.36,1)`, start 0.3 / 0.45 / 0.6 s. Replaces the visual's own `card` hero reveal (the visual itself no longer fades).
- **Turn:** the stack sways in 3D around one shared vertical axis (slightly leaned, `rotate: .12 1 0`), −14° ↔ 14°, 9 s each way, ease-in-out, endless; starts at 0°. Perspective 90rem on the visual. The top card sits 3rem in front of the axis, the bottom one 3rem behind (z in `transform-origin`), so the cards shift against each other as it turns. The Webflow tilt (`matrix(...)`) and the middle card's `translateX(-1rem)` stay untouched: the turn uses the separate `rotate` property.
- **Mechanism:** attribute `data-cards-3d` on `page-header_visual` in the Page Header definition (`864e1322-…ca626`); CSS in the Page Header's own embed (`…ca628`), source `references/embeds/page-header-style.html`. CSS only, no script. Only the Split variant shows the visual, so only Hire an Expert moves today.
- **Off:** reduced motion and the Designer show the still tilted stack; remove `data-cards-3d` to switch it off. Tuning: angle in `cards-3d-sway`, speed `9s`, depth the `±3rem`, order the `--cards-3d-delay` values.
- **Checked** on staging /hire-an-expert at 1024 and 375: cards hidden until their start, all in by ~1.5 s, angle moving, no sideways scroll at 375. Not checked: Safari, real devices.
