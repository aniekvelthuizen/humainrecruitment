---
name: cards
description: Build, rebuild or extend card components on a Webflow Lumos site from a Figma design — the Lumos `Card Primary` itself adapted, the design's card types as its variants, texts as Lumos Typography components, props in tidy folders with visibility toggles, slots for repeated items. Use whenever a design shows a card, tile, teaser, team member, product, project, testimonial or any repeated boxed item; when the user asks for "the cards", a Cards overview page, a new card variant, an extra option on a card ("an image on this card"), or card props/folders; also when a build or componentize task reaches its first card. Requires a client repo (project.json); otherwise run the project skill first.
---

# Cards — reuse by look, Lumos base, Typography texts, tidy props

A site has a small family of cards that every section reuses. They live in the **Lumos `Card Primary` itself**, adapted in place, with the design's card types as its variants; every text is a Lumos Typography component. Getting base, props and texts right the first time saves three rebuild rounds (Oct 2026). The general rules — reuse, Lumos original, props — are in [componentize](../componentize/SKILL.md) §0 and §1; this skill adds what is specific to cards.

Read `project.json`, `decisions/site.md` and `decisions/components/cards.md` if it exists. Follow [lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md), [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md), [componentize/mechanics.md](../componentize/mechanics.md) and [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. Reuse by look first

The answer is almost always a card that already exists ([componentize](../componentize/SKILL.md) §0: match by look; a missing element is a prop with a visibility toggle, default off, e.g. `Image` + `Image Visibility`).

- Look on the site's **Components** page (`/components`, the card group) or `query_components` group `Card`. Compare theme (light/dark), border or frame, corner tab, grid size, image placement — a card with the same image + fade but a different frame is the wrong match.
- No new card, variant or rename of the existing card unless the user asks.
- In the plan: the 2–3 closest cards with a one-line look comparison, the closest by look recommended.

## 2. A new card design: adapt Card Primary

Build it **in Card Primary** ([componentize](../componentize/SKILL.md) §0, Lumos original): no `duplicate_component`, no "Card <Name>" next to it — unless the user explicitly asks ([base.md](base.md) § "A separate card on request"), or it is a card with its own data and behaviour ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §10).

Before building, look up in Figma **where the card set is used** (instances of its variants across the design pages: which section, which sizes per breakpoint) and its **prototype reactions** (hover, mouse-enter while scrolling, click). Behaviour lives there, not in the card frame: e.g. a CTA card that expands on mobile while scrolling past it, or a card that lies horizontally only in one mobile list.

Recipe in [base.md](base.md). In short: inventory the instances and anything that selects the card's classes → map the Lumos variants onto the design's types (rename, keep the ids) → clear every old variant override → restyle the `card_primary_*` classes and rebuild the inner content → variants first, then props → Designer steps → read back and measure.

A variant is a look the **editor** picks. Two layouts at different widths are one responsive card; but when the same card must lie in one mobile list and stand in another, the section decides, so that is a variant — named for what it does (`Industry Horizontal Mobile`), or it looks broken on desktop.

## 3. Texts are Typography components

Titles **Typography Heading**, body **Typography Paragraph**, short labels **Typography Plain**, kickers **Typography Tag**, buttons **Button Main**. Card classes only do layout. Recipe and Designer steps: [typography.md](typography.md).

## 3b. SEO on cards

A card title on an overview page is not a heading; a card also used where a heading fits gets a `Title tag` setting, default `p`/`div` ([seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md) rule 2). Alt, Decorative and the name of a cover link: [accessibility/criteria.md](../accessibility/criteria.md) §3. Before the card is done: `seo-audit.mjs <overview url> --block "<grid selector>" --overview-block`.

## 4. Props, folders, toggles, slots

Plan the props table per card before building. The rules (folder order, `<Thing> Visibility`, slots instead of `Tag 1/2/3`, "is set" conditions): [componentize](../componentize/SKILL.md) §1. The card's folders, the API recipe and the Designer steps: [props.md](props.md).

## 4b. Cards that show CMS records *(house)*

A card grid of stories, news, campaigns, vacancies or team is filled from the CMS through a `<Collection> · automatic` / `· picked` list component in the grid section's slot, never with hand-typed cards: [componentize](../componentize/SKILL.md) "Fill from the CMS: think as the marketer".

## 5. States

- Hover follows the site's language even when Figma draws none (verify.md §2c). A clickable card hovers only when it has a link (`data-trigger="hover-if-clickable"` on the group; not `focus`, [references/motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §3).
- **Hover = Lumos trigger transitions** in Webflow styles, like the button ([buttons/motion.md](../buttons/motion.md) §3), with the `hover` token: in slower than out (350 / 200 ms; image scale 1 → 1.04 with `hover-large`); read `decisions/motion.md` first. Rest state = the hover layout with an offset in the class (marker `scale(0)` from top-left, title `translateX(-gap)`), so nothing shifts width. **Not IX3 for hovers**: with in longer than out IX3 leaves the card stuck in its hover state after a quick pass ([buttons/motion.md](../buttons/motion.md) §4); only when the owner wants the hover in the Interactions panel, use the role form there with equal in/out times. Text that slides open on hover (`height: auto`): the small script on Webflow's GSAP ([interactions/patterns.md](../interactions/patterns.md), "Hover that slides open").
- Behaviour on touch comes from Figma's mobile frames, not from hover: e.g. open-on-scroll with a `wf:scroll` trigger (`start "top 60%"`, `end "bottom 40%"`, toggles play / reverse / play / reverse) and `conditionalPlayback` breakpoints so hover and scroll never both run.
- Test every hover 3× in a row, once interrupted, on every variant and theme, on staging.
- **No outline after a mouse click.** No `:focus` / `:focus-within` outline on a card or its group; keyboard focus only through `:focus-visible` (the Lumos ring).

## 6. Verify and record

Measure each variant against Figma at desktop and 375 (verify.md §2b), again after props and Typography swaps — both re-render the card. Show every variant on the Components page, group Parts, in a Showcase Grid ([componentize](../componentize/SKILL.md) §3). To measure, Lumos sites also have Card Primary instances on **Example Components**: a draft page with `u-theme-dark` on its body — undraft it to measure on staging, and set the showcase Section's Theme to Light, or a light card measures dark. Record per card in `decisions/components/cards.md`: props table, variants, Designer steps still open, deviations from Figma.
