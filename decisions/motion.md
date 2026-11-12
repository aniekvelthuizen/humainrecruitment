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

## 2026-11-12 — Two-tone headings: grey part sweeps in (owner)
Owner (Aniek): the grey part of the black/grey titles starts black and turns grey with an animation, «zodat we daar een beetje diepte in krijgen». A third exception to «no scroll reveals», for these headings only. Done by Aniek Velthuizen with Claude.
- **What:** every `_muted` span that is a direct child of an h1–h4 (`page-header_muted`, `split-content_muted`, `stagger-cards_muted`, `spotlight-grid_muted`, `cta-split_muted`, `hero-experts_muted`, `card-grid_muted`, …) first shows in the heading's own colour. When it scrolls into view (bottom 15 % excluded) the grey sweeps over it from left to right with a soft edge, line by line in reading order. 1.4 s, `cubic-bezier(.45,0,.2,1)`, start 0.1 s; inside a hero (`[data-hero-reveal]`) start 0.6 s, so it follows the title's rise. Once only. A `_muted` span in a paragraph (Hero stat, Card Grid text) is left alone. Sticky Steps' mint `_accent` is not included (not grey).
- **Mechanism:** a gradient clipped to the text (`background-clip: text`) from the grey to the heading colour, moved by `background-position`. The script reads both colours from the live page (heading `color`; span `color` × `opacity`, since some `_muted` classes use opacity 0.5 and others a 50 % colour), so it works on light and dark sections and follows any later colour change. After the sweep the span gets `data-muted="done"` and is its own class again (no inline colour left).
- **No flash:** a gate (`html[data-muted-gate]`, set by the script before the headings are parsed) keeps the spans in the heading colour until the script has set them up; a 4 s guard removes the gate if the script never gets that far.
- **Off:** reduced motion, no IntersectionObserver, no JavaScript, and the Designer → plain grey as designed.
- **Where:** third embed in `Global | Custom Code` (`141a108e-8c89-7794-a75a-166d962024d9`), so it is on every page. Source: `references/embeds/muted-heading-sweep.html`.
- To exclude a heading later: give the span a class not ending in `_muted`, or add `:not(...)` to the selector in the embed.
