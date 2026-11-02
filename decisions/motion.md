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
- **Score Chart reveal** (once, when ≥ 35 % in view): bar segments grow left to right (`scaleX` 0 → 1, 0.7 s, 0.08 s apart), legend rows fade in and rise 8 px (0.6 s, start 0.15 s, 0.06 s apart), the values count up from 0 (0.8 s, ease-out). Done in about 1.4 s. Easing as the hero: `cubic-bezier(.22,1,.36,1)`.
- **Score Chart hover** (pointer devices only): pointing at a legend row or a bar segment keeps that pair in full colour and dims the others to 35 %, its dot grows 1.3×; 0.25 s. Off during the reveal.
- ~~Split Content glow rising in~~ — removed the same day, owner: «niet te zien met het blote oog en niet per se mooi». The glow is static again.
- **Mechanism:** a small script per component (its own script embed; the CSS sits in a separate style-only embed so the Designer still shows colours and layout) sets `data-score-motion` ready → in → done; the CSS transitions do the rest. Transitions only in the `in` state, so hiding is instant (first version faded *out* for 0.75 s first — fixed). No GSAP needed.
- **Off:** reduced motion, no IntersectionObserver, or no JavaScript → everything static and visible. The Designer shows the finished state. Sources: `references/embeds/`.
