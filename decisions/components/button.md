# Button (`Button Main`, group Button)

Plan: `references/plans/2026-10-29-buttons.md`. Component id `824b76d0-0ddb-5ed5-8ae6-09771aaa568a`.

## 2026-10-29 — Looks from the page frames, not the style-guide set
Conflict: the Figma `Button` set has 5 types × rest/hover (`primary`, `secondary`, `secondary-white`, `tertiary`, `back-button`).
Choice: three variants — **Primary** (base, mint fill), **Secondary** (outline), **Tertiary** (text link + arrow + underline). `secondary-white` and `back-button` are Secondary and Tertiary on a dark/brand background → Theme modes, not variants.
Why: kit rule "a dark version that only swaps colours is the theme"; scan of every page frame (Visual design + Mobile) with `figma-buttons-scan.js`.

| Look | Used on | Background | Count (desktop / mobile) |
|---|---|---|---|
| Primary | heroes, CTA bands, glass cards, testimonials | light, image, brand-500 | 36 / 9 |
| Secondary | content blocks | light | 17 / 5 |
| Secondary on dark (`secondary-white`) | hero, CTA band | image / brand-500 | 35 / 4 |
| Tertiary | service cards ("View"), filters | light grey card | 6 / 1 |
| Tertiary on dark (`back-button`) | Opportunities detail header | dark gradient | 1 / 1 |

## 2026-10-29 — Default look
Choice: Primary (mint) is the base variant, although Secondary + its dark version are used more often (≈ 61 vs 45).
Why: Figma calls it primary and it is the main call to action on every page. Recommended in the plan; owner may still swap.

## 2026-10-29 — Not buttons
Choice: these use the Figma `Button` set but are not variants of this component:
- round 48 px outline arrow without label (testimonial cards) → own component later (`Button Icon`, or the starter's `Button Arrow`);
- `Button/Link/Default` (navbar and footer links, 84 uses) → nav / footer components;
- `Button group` (two buttons side by side) → Lumos `Button Wrapper`.

## 2026-10-29 — Structure
```
button_main_wrap  data-trigger="hover focus"   colours, radius, font-weight, hover/focus-within
├─ Clickable                                   link/button cover, screen-reader text = Text
└─ button_main_element  data-button            flex, padding 0 1rem, min-height button-size/medium, 0.125rem border (colour inherit)
   ├─ button_main_text + u-text-style-main     label, padding-inline 0.5rem; combo = Text Style mode Text Medium (Tertiary: base)
   ├─ button_main_icon                         1.5rem (Tertiary 1rem, order -1); visibility = Icon Visibility
   │  └─ Icon Set                              chevron right by default
   └─ button_main_line                         hidden; Tertiary only: underline that grows on hover
```
Props — **Button**: Text, Link, Visibility (+ Variant, Designer step) · **Icon**: Icon Visibility (+ Icon, Designer step) · **Settings**: Clickable Visibility, Button Type.
The starter's icon **slot** was removed (only one starter demo button on Example Components had an `Icon Arrow` in it); a fixed holder with the `Icon Set` replaces it.

## 2026-10-29 — Box sizes
- Height: `min-height: button-size/medium` (3rem = Figma 48) for Primary/Secondary, `button-size/small` (2rem = 32) for Tertiary. Lumos trims the label to cap height, so padding alone would give ~36 px.
- Horizontal: element `padding: 0 1rem` + label `padding-inline: 0.5rem` = Figma 16 + 8 around the label and 16 after the icon.
- Every look keeps a 0.125rem border in the colour of its own fill or outline, so all looks have the same box. Figma draws Secondary's hover stroke at 1 px on a fill of the same colour: no visible difference, and no 1 px jump on hover.
- Radius `radius/round` (Figma 9999). Width: auto (Figma HUG on every page instance).

## 2026-10-29 — Colours
Colours live on the wrap (the Clickable covers the element, so only the wrap gets `:hover`); the element and icon inherit (`border-color: inherit`, icon = `currentcolor`). Hover and keyboard focus (`:focus-within`) use the same colours.
| Look | Rest | Hover |
|---|---|---|
| Primary | `button-primary/background`, `/text`, `/border` | `…/background-hover`, `/text-hover`, `/border-hover` |
| Secondary | `button-secondary/background`, `/text`, `/border` | `…/background-hover`, `/text-hover`, `/border-hover` |
| Tertiary | `button-tertiary/background` (transparent), `/text` | `/text-hover`; underline = `currentcolor` (`accent` = `text` in every mode) |
Primary text uses `button-primary/text` (dark-900 `#030b1b`); Figma's rest label is an unbound `#050404`, invisible difference.

## 2026-10-29 — Hover and motion
No motion guidelines in the Figma file, so kit defaults: colours 200 ms ease (wrap `transition: all`); Tertiary underline grows from 0 to full width in 600 ms `cubic-bezier(.65,.05,.36,1)` via the Lumos trigger (`scaleX(calc(100% * --_trigger---off))`, origin flips with `--_trigger---on`), as Figma's `Line` default → variant-2. Tune by feel later (motion demo).

## 2026-10-29 — Primary shadow
Figma: 5 drop shadows at rest (0/4/8 10 %, 0/14/14 9 %, 0/32/19 5 %, 0/56/23 1 %, 0/88/25 0 %), half the offsets/blur on hover. The style API flattens a `box-shadow` with variable colours to one variable, so the shadow is a Designer step (designer-queue), with colours from the new theme variables `button-primary/shadow-1…4` (the 0 % layer is dropped). Secondary and Tertiary set `box-shadow: none`.

## 2026-10-29 — Icons per look
Primary and Secondary: Chevron Right after the label. Tertiary: Arrow Right before the label (`order: -1`); the back link: Arrow Left. Choosing the icon per button needs the **Icon** prop (Designer step); until then every button shows the chevron.

## 2026-10-29 — Primary hover made visible (deviation from Figma)
Conflict: Figma's Primary hover only swaps to an identical mint, a near-identical text colour and a smaller shadow (the shadow is not on the site yet: Designer step); the owner found the hover almost invisible.
Choice: Primary lifts 0.125rem (`button_main_wrap` `transform: translateY(calc(-0.125rem * --_trigger---off))`, wrap transition 200 ms) and on every look the icon nudges 0.25rem to the right (`button_main_icon` `translateX(calc(0.25rem * --_trigger---off))`, in 450 ms / out 250 ms, `cubic-bezier(.65,.05,.36,1)`). Owner, same day: every look lifts the same way (the Secondary/Tertiary `transform: none` overrides were removed).
Why: owner request; Lumos trigger transforms, no code, reverse cleanly, also on keyboard focus. If it is still too subtle, next step is a colour change (needs a new mint hover swatch).

## 2026-10-29 — Border on the wrap, not the element
Conflict: the outline (Secondary) showed in the Designer but not on the published site; the element's `border-color: inherit` from the wrap does not survive the site's global CSS (Designer runs no Global Styles).
Choice: the 0.125rem border, `min-height` and colours all sit on `button_main_wrap` (`display: inline-flex`); `button_main_element` has no border and `flex-grow: 1`. Tertiary: wrap border 0, `min-height: button-size/small`.
Why: colour and border on the same element need no inheritance; same box size (border-box).

## 2026-10-29 — Primary shadow is in
Choice: the 4-layer shadow (rest, `:hover`, `:focus-within`) is written with the style API on `button_main_wrap`. The API read-back shows only `button-primary/shadow-1`, but the published CSS keeps all four layers: the owner saw the shadow on staging.
Why: lesson for later — judge a multi-variable value by the published page, not by the read-back.

## 2026-10-30 — Nav CTA 4 px wider than Figma (owner, Aniek)
Conflict: in the desktop nav, "Request a shortlist" (Button Main, Secondary) is 235 px wide vs 231 in Figma, so it and "For candidates" sit 4 px further left (measured at 1512 in the nav review).
Choice: accepted as is. The difference comes from Button Main's own padding; narrowing it would change every button on the site.

## 2026-10-31 — Icon prop and folders (Aniek Velthuizen, via Claude in Chrome)
Done in the Designer (Button Main definition › Icon Set in `button_main_icon` › Variant's purple dot › **New Variant property**): new variant prop **Icon** (`b39c5421-a5df-f702-6598-aee1e9b283c0`, folder Icon, default **Chevron Right** = Icon Set base), so every existing button keeps its chevron. The component's own **Variant** prop moved into folder **Button**. Order: Button (Variant, Text, Link, Visibility) → Icon (Icon, Icon Visibility) → Settings (Clickable Visibility, Button Type, Attributes); read back with `get_component`.
Per the "Icons per look" choice above, the three Tertiary buttons on the Styleguide now use **Arrow Right** (Icon Set `b13d6db9-…`, set with the API); Tertiary already puts the icon before the label, so they read "→ Button Text" (16 px icon, 112 × 32 box).
Checked on staging, all 18 published pages: only those 3 icons changed (chevron-right → arrow-right); the other 129 Button Main icons and all 45 cards on Example Components unchanged (`card-check.mjs`, within 1 px, rest and hover).
Not changed (owner's call): the Tertiary "View" button inside Card Primary (Discipline) still shows the chevron; Figma draws an arrow there (see `cards.md`, Service/Discipline deviations). Setting the Icon on that nested instance in the Card Primary definition would make it an arrow everywhere the card uses it.
- **Update, same day (owner: "daar moet een pijl en geen chevron"):** the Tertiary button inside Card Primary (`card_primary_button` › Button Main) now has Icon = **Arrow Right**, set in the Card Primary definition, so every Card Primary card that shows its button reads "→ View" as in Figma (`Card / Service` type discipline, `2710:56919`, checked in Figma). Staging: only the Discipline showcase card changed (the other Card Primary cards have no Button Text); 45 cards same geometry.

## 2026-11-02 — Focus ring follows the section theme (owner: Aniek)
Conflict: the keyboard ring on `.clickable_link:focus-visible` is `currentColor` (set for the Glass expert card, `cards.md`). In a button that is the button's text colour, and on `:focus-within` the button takes its hover look, so the ring was navy on purple (~1.1:1) on Brand and Dark sections (CTA Split review).
Choice: new Clickable variant **Focus Ring Theme** (`95904e04-d761-f0a9-3656-e461d83acfa8`, a copy of Focus Ring Outside) with `clickable_link` and `clickable_btn` `:focus-visible` outline-color = Theme `text`; Button Main's nested Clickable uses it. Cards keep Focus Ring Outside (`currentColor`), so the Glass card is unchanged.
Measured on staging (real Tab presses): hero, Sticky Steps and CTA buttons white on purple; Split Content buttons dark on white; nav button white at the top over the hero, dark after scrolling over a light section; card rings unchanged.
Not covered: the hero's big Card Expert ring is still navy on the dark hero (card ring, `cards.md` route) — open for the owner.
