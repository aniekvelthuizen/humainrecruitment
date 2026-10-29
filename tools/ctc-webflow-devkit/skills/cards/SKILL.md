---
name: cards
description: Build, rebuild or extend card components on a Webflow Lumos site from a Figma design — the Lumos `Card Primary` itself adapted, the design's card types as its variants, texts as Lumos Typography components, props in tidy folders with visibility toggles, slots for repeated items. Use whenever a design shows a card, tile, teaser, team member, product, project, testimonial or any repeated boxed item; when the user asks for "the cards", a Cards overview page, a new card variant, an extra option on a card ("an image on this card"), or card props/folders; also when a build or componentize task reaches its first card. Requires a client repo (project.json); otherwise run the project skill first.
---

# Cards — reuse by look, Lumos base, Typography texts, tidy props

A site has a small family of cards that every section reuses. They live in the **Lumos `Card Primary` itself**: the component is adapted in place, its name stays, and the design's card types become its **variants**. That way it keeps everything Lumos wired into it and no twin of a Lumos component appears next to it. Every text in it is a **Lumos Typography component**; its panel reads top to bottom the way an editor fills it in. Owner rules from Forest3 (October 2026: blank components, then rebuilds, then re-props, then re-texts — doing it in this order saves all three rounds) and PMS (October 2026: "never a copy, adapt the existing Lumos component — buttons, cards, sliders, every component Lumos already has").

Read `project.json`, `decisions/site.md` and `decisions/components/cards.md` if it exists. Follow [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md), [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md), [componentize/mechanics.md](../componentize/mechanics.md) and [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Reuse by look first

When a design shows a card, the answer is almost always a card that already exists.

- Open the site's **Cards** page (or `query_components` group `Card`) and pick the card whose **overall look** is closest: theme (light/dark), border or frame, corner tab, grid size, image placement. Look decides, not the internals — a card with the same image + fade but a different frame is the wrong match.
- Extend it with a **prop and a visibility toggle** for what is missing (`Image` + `Image Visibility`), default **off**, so every existing use stays unchanged.
- Do **not** build a new card, add a variant or rename the existing card unless the user asks. A variant is for a look the editor picks, not for one extra element.

In the plan, list the 2–3 closest cards with a one-line look comparison and recommend the closest by look.

## 2. A new card design: adapt Card Primary, never copy it

The same rule holds for every component Lumos already ships (Button Main, Card Primary, Slider, Accordion, Tabs, forms): build the design **in the Lumos original**, keep its name, make the Figma types its variants. No `duplicate_component`, no "Card <Name>" next to it — unless the user explicitly asks for a separate component (then [base.md](base.md) § "A separate card on request"). Exception to propose yourself: a card with its own data and behaviour ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §10, PMS `Card Mineral`).

Before building, look up in Figma **where the card set is used** (instances of its variants across the design pages: which section, which sizes per breakpoint) and its **prototype reactions** (hover, mouse-enter while scrolling, click). Behaviour lives there, not in the card frame: on PMS the CTA card turned out to expand on mobile while scrolling past it (`cta-list`), and the Industry card lies horizontally only in one mobile list.

Recipe in [base.md](base.md). In short: inventory the existing instances and anything that selects the card's classes → map the Lumos variants onto the design's types (rename, keep the ids) → clear every old variant override → restyle the `card_primary_*` classes and rebuild the inner content → variants first, then props → Designer steps → read everything back and measure.

A variant is a look the **editor** picks. Two layouts at different widths are one responsive card; but when the same card must lie in one mobile list and stand in another, the section decides, so that is a variant — name it for what it does (`Industry Horizontal Mobile`), or it looks broken on desktop.

## 3. Texts are Typography components

Every text in a card is an instance: titles **Typography Heading**, body **Typography Paragraph**, short labels **Typography Plain**, kickers **Typography Tag**, buttons **Button Main**. Card classes only do layout. Recipe and the Designer steps it leaves: [typography.md](typography.md).

## 4. Props, folders, toggles, slots

Plan the props table before building, per card. Rules and API recipe: [props.md](props.md). In short:

- Folders in this order: **Variant** → **Content** → **Visual** → part folders (Meta, Button, Stat …) → **Link** → **Settings** (the Lumos props, untouched). Props inside in fill-in order. One kind per folder.
- Every part an editor may want to hide gets `<Thing> Visibility`, right after the thing.
- Repeated same-styled items (tags, topics, meta lines) are a **slot** of a small item component, not `Tag 1/2/3` props.
- Every text uses Webflow's native condition: filled = shown, empty = hidden (`<Text> is set`; with a toggle `toggle = true AND text is set`); a wrapper of optional parts hides when all are off. Designer-only.

## 5. States

- Hover follows the site's language even when Figma draws none (verify.md §2c). A clickable card hovers only when it has a link (`data-trigger="hover-if-clickable focus"` on the group).
- Hover animations in IX3 use the **role form** (one `wf:hover` trigger, `pluginConfig.multiTimeline: true`, timelines with `triggerMetadata.role` mouseEnter / mouseLeave), one interaction per variant group (`scope.variants`). The split form (two triggers with `eventMode`) plays only once. Hover-in is always longer than hover-out (PMS: 450 / 250 ms; read `decisions/motion.md`). Rest state = the hover layout with an offset in the class (marker `scale(0)` from top-left, title `translateX(-gap)`), so nothing shifts width; text that appears on hover: `height: 0` + `opacity: 0` on a card-owned wrapper, IX3 tweens `height` to `"auto"`.
- Behaviour on touch comes from Figma's mobile frames, not from hover: e.g. open-on-scroll with a `wf:scroll` trigger (`start "top 60%"`, `end "bottom 40%"`, toggles play / reverse / play / reverse) and `conditionalPlayback` breakpoints so hover and scroll never both run.
- Test every hover 3× in a row, once interrupted, on every variant and theme, on staging — never after one hover.
- **No outline after a mouse click.** No `:focus` / `:focus-within` outline on a card or its group; keyboard focus only through `:focus-visible` (the Lumos ring / `data-trigger` focus).

## 6. Verify and record

Measure each variant against Figma at desktop and 375 (verify.md §2b), again after props and Typography swaps — both re-render the card. Show every variant in one section on the page the owner names (Lumos sites already have Card Primary instances on **Example Components**; that page is a draft and `u-theme-dark` on its body — undraft it to measure on staging, and set the showcase Section's Theme to Light, or a light card measures dark). Record per card in `decisions/components/cards.md`: props table, variants, the Designer steps still open, deviations from Figma.
