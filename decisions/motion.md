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
- **Motion:** left arrow moves 0.75rem left and fades out; label and its underline slide left by icon + gap (1.5rem, `translate`); a second arrow (`.button_main_element::after`, same SVG as Icon Set's Arrow Right, `currentColor`) fades in from 0.75rem left to the right edge. In 450 ms, out 250 ms, `cubic-bezier(.65,.05,.36,1)` (the button icon timing in `button.md`). Driven by the Lumos trigger (`--_trigger---off`). In a clickable card the card's link layer (`clickable_wrap`, z-index 3) covers the button, and `card_primary_button` pins the trigger to 0, so the link never got its own hover (its underline never grew either). The embed therefore also sets the trigger to 1 on these links while their `[data-trigger]` card is hovered (`hover`, or `hover-if-clickable` with a visible Clickable) or has keyboard focus: hovering the whole card plays it. The button's own 0.25rem icon nudge is replaced for these links. Reduced motion: instant swap.
- **Where:** a second HTML embed in **`Global | Custom Code`** (`ab7c2a2d-c89b-c4a5-b14d-832caacbe802`), source `references/embeds/arrow-link-style.html`. A `::after` on a variant does not publish here (`site.md`), hence the embed. Styleguide and Example Components have no `Global | Custom Code`, so their examples stay static.
- The `::after` arrow uses the CDN URL of `icon-arrow-right.svg`; if that asset is replaced, update the URL in the embed.
