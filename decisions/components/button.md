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
