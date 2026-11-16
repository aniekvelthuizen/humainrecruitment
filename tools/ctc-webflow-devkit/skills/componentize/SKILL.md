---
name: componentize
description: Turn built, verified sections into Webflow components with props, slots and variants — and reuse the ones that already exist instead of building new. Use when a section is finished and responsive, when the user asks to make blocks reusable or hand them to marketers, or when a design repeats an element that is already a component.
---

# Componentize — per finished section, bottom-up

A definition edit is live on every page instantly; a class edit is not. So structure is settled as plain elements first, and a section becomes a component once it is built, detailed, responsive and verified — **per section, as soon as it is done, not after the whole page.**

Read `project.json`, the plan and log of the build, and `decisions/components/`. API mechanics and traps: [mechanics.md](mechanics.md). Questions: [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 0. Reuse first

This is the kit's one reuse rule; build, cards and the plan's Reuse table point here. Before proposing any new component — and before a build plan names a section or element as new — search `references/components.json` and `query_components` for the pattern (card, button, badge, label, list row, quote, logo strip) and for an existing **section** component. Building a second component that looks like one already there is a defect, not a shortcut (owner rule, Oct 2026: "we reuse as much as possible, that's a rule").

- **Identical → place that component.** No rebuild, no same-looking twin.
- **Same content, different arrangement or look → a `Variant`** of the existing component. One extra variant beats a second component every time.
- **Only an element missing → a prop with a `<Thing> Visibility` toggle, default off**, so existing uses do not change. Not a variant, not a rename.
- **Genuinely different → new**, and the proposal says what the existing one could not carry.

**Match by look, not by internals.** The closest component is the one that *looks* closest (theme, frame, corner, size, image placement), even when another shares more inner parts. Show the 2–3 closest candidates with a one-line look comparison.

**A type Lumos already ships is built in the Lumos original itself** — card in `Card Primary`, button in `Button Main`, form in the Lumos form, video in `Visual Video`, also Slider, Accordion, Tabs: adapt it in place, keep its name, the design's types become its variants. Never a blank component, never a duplicate next to it unless the owner asks: the editor cannot tell the two apart, and every change has to be made twice (owner rule, Oct 2026). Only the original keeps the props the API cannot create (variant, heading tag, conditional wrappers, theme switcher, clickable wiring). Exception to propose yourself: something that only looks like a Lumos type but has its own data and behaviour ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §10). Cards: [cards](../cards/SKILL.md).

## 1. Propose

Per candidate block one row: name (the site's naming convention, from `references/components.json`), what varies per instance, how each variation is carried:

| Varies | Carrier |
|---|---|
| a text, an image, a link, a tag, visibility | prop |
| content with paragraphs, or content that differs in shape per instance | slot, with an item component |
| one axis of visual states the editor picks | the single `Variant` prop |
| a second axis | a nested component with its own variant |
| a look that stacks on another | a separate element with a boolean prop |
| a set of items that are, or could be, CMS records | the section's slot holds a list component: "Fill from the CMS" below |

Judge on the editor's experience (a marketer, the client, their own AI): one draggable thing, few named states, plain-language prop names, every text, link and image they will want to change exposed from the start. Component and prop names describe the pattern, not today's copy. Order bottom-up (card before section). Show it, get one OK.

**Break the section into its repeating parts first.** Card, list item, row, column, step, logo, quote: each its own small component, held by the section in a **slot**, so it is reusable and reorderable. One big component with thirty props is the thing to avoid.

### Props: the rules

A component without props is a component nobody can edit. Expose every text, image, link, icon, tag and show/hide that differs between instances.

- **Folders, in this order:** **Variant** → **Content** → **Visual** → one folder per part in DOM order (Meta, Badge, Button, Stat, Number …) → **Link** → **Settings** (Lumos props, last, untouched). Props inside a folder in the order an editor fills them in. A folder holds one kind of thing, never content and visual together. A flat list of fifteen props is as bad as none.
- **`<Thing> Visibility`** toggle for every part an editor may want to hide, in the thing's folder, right after it.
- **Repeated same-styled items** (tags, topics, meta lines, expertise lines) are a **slot** of a small item component, never `Tag 1/2/3` props.
- **Every text shows only when filled**: native condition `<Text> is set`; with a toggle `toggle = true AND <Text> is set`. A wrapper of optional parts shows only when **any** part is on, so no empty gap remains. Slot item texts too. Conditions are Designer-only ([cards/props.md](../cards/props.md), Designer-only).
- **Texts**: in a section, plain `Heading` / `Paragraph` with the Lumos text classes, bound to a prop; in a card or `Button Main`, a Lumos Typography instance ([cards/typography.md](../cards/typography.md)). The component's own classes do layout only.
- **Never content in a slot that is filled inside the definition**: the API cannot reach it afterwards ([lumos/components.md](${CLAUDE_PLUGIN_ROOT}/references/lumos/components.md), "Section build"). Slots are for what editors fill on the page.
- **A list of CMS records is picked in the component's panel, never through a filter on a category field** ("Fill from the CMS").
- **SEO lives in the definition** ([seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md)): only the page-heading component has an `h1`; a card used on overviews gets a `Title tag` setting (default `p`/`div`); a FAQ section gets a `FAQ schema` toggle on its JSON-LD embed.
- Keep every existing default value. API traps (creation order, name clashes, one `update_prop` per call, variants): [mechanics.md](mechanics.md).

**The exception: blocks meant to be identical everywhere and edited centrally** — home hero, nav, footer, a site-wide banner. Content in the definition, no content props (variants and visibility may apply). Say in the proposal which kind each component is; the default is props.

Before transforming anything interactive (tabs, sliders, reveals, anything a script or attribute drives), write down what drives it: the script, the selectors or `data-*` attributes it targets, the classes it toggles. Transform renumbers element ids, so scripts and IX3 target `data-*` attributes, never ids or classes ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §0).

### Fill from the CMS: think as the marketer *(house)*

Who fills this after launch, with the fewest clicks? That decides the build, not what was quickest for us.

- **Anything that repeats as records comes from a CMS collection**, even when the design shows it on one page only: FAQs (always: questions are reused across pages), stories, news, campaigns, vacancies, team, partners/logos, documents. No hand-typed items in a slot when a collection exists or obviously should; propose the collection if the client has none.
- **Section and list are two components.** The section (Content List, Feature Grid, Article Grid, FAQ Section …) keeps its props, variants and slot. The records come from a small **list component** holding only the Collection List and its card, dropped into the section's slot. Per collection two, in one component group "CMS lists": **`<Collection> · automatic`** (Dynamic: Filter, Sort, Show, Skip, card style) and **`<Collection> · picked`** (Selected: Items, card style), named in the client's language (e.g. `Stories · automatic` → `Verhalen · automatisch`). Not one big component wrapping section and list: it copies all section props (they drift from the library), works for one section type only and needs a copy per type. With a shared library the list components are site-local (libraries share no CMS); the sections stay library components.
- **Build the list component from a list that already works** (its card bindings, tags with conditions, link via URL Path or a file field). Rebuilding cards through the API loses those Designer-only parts.
- **Card style is a prop**: bind the card's Variant to a Variant prop ("Card"), so one list serves a grid, a horizontal list and a featured slot. A second card in the same list (e.g. internal page vs external link) binds to the same prop.
- **Dynamic and Selected cannot be combined in one list** (Items Dynamic/Selected has no binding dot) — hence two list components per collection. How the editor picks:
  - *Static page, hand-picked* (FAQs on a page, three featured stories): `· picked`, **Items: Selected** bound to a **Selected items** prop; items show in ticking order.
  - *Static page, "latest N" or "all of type X"*: `· automatic`, **Filter**, **Sort**, **Show** (limit) and **Skip** (offset) bound to props. Per instance: + › field › Equals › value (reference fields such as Theme, option fields such as Format), a sort field, a number. Two instances on one page keep their own choice; rendered server-side.
  - *CMS template, "the records of this item"*: `· automatic` with Filter per instance = **Current <Item>** (Webflow offers and pre-picks it on a template); works on a reference field (Foundation = Current Foundation) and a multi-reference field (Themes *contains* Current Theme). Proven live, Nov 2026.
  - *CMS template, hand-picked per item*: the item's **multi-reference field** is the source; a Selected items prop cannot bind to a field, so `· picked` does not work here.
- **Never add a field that only exists to place items on a page** (e.g. "Group = Churches" on FAQs): every new page would need a schema change and Designer work. Filtering on a field that describes the content (Theme, Format, Type) is the intent.
- **Slot restrictions (Allowed components) must let the list components in.** The API ignores restrictions, so we never notice while building; a slot that allows only the card blocks the marketer. On a shared library the section's slot is set on the library site and can only name library components, so every section slot that should hold a CMS list stays on **Allow all**; keep other slots strict. Without a library, name the card and the list components explicitly.
- **Slot tooltip** for every slot that takes cards or lists (Properties panel on the component canvas › the slot › Property settings › Tooltip; Designer only; **max 255 characters**, longer is dropped silently): name the fitting list components and what to search for, e.g. "Drop cards here, or a list from the group CMS lists: Stories, News or Campaigns. Each in two versions: '· automatic' (filter, sort, count) or '· picked' (tick items). Search e.g. 'Stories'." Use the client's word for each collection. Mention it in the section's description; start each list component's description with where it goes ("Drop into the Items slot of a Content List …"). The group "CMS lists" holds slot lists only; other CMS blocks (a hero, a banner) get their own group.
- **A new list component means a tooltip update** on every slot it fits (a library update when the sections live in a library). With several brands on one library, every brand names its list components the same way, or the tooltips are wrong for some.
- **Test as a marketer**: Designer with `&simulateRole=marketer`, select the slot, open the Components panel: the list components must show and drop there.
- **Not for:** archive/overview pages with a filter bar (Finsweet attributes on the cards), one-off cards drawn differently from the collection card, testimonials or quotes that are not records.
- Designer and API steps: [mechanics.md](mechanics.md) "CMS list components", "Selected items prop", "Filter, Sort and Show props".

## 2. Build, one component at a time

Chain first, values last: content of the exemplar to a file, empty it, transform, re-read the ids, props/slots/variants, a new instance beside the original, fill, compare, remove the original with the user's OK — [mechanics.md](mechanics.md) "Order of operations".

Done when:
- a fresh instance with default prop values renders the most common form of the block;
- the filled instance matches the original's snapshot;
- **the instance still matches the design frame**, compared again after the transform (verify.md §2d): defaults can replace content and slot children can land in another order;
- **it reads correctly on the Designer canvas**, which runs no scripts: first slide, active tab and revealed content visible from CSS alone; hide only under a class or attribute a script sets at runtime;
- **every interaction works on the instance**, checked in a browser on staging or a fixture with the same markup;
- **the SEO block check is clean on the instance** (`seo-audit.mjs <url> --block "<root>"`, [seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md)): a transform can drop a tag or a heading level.

## 3. Show it on the Components page *(house)*

Every new component goes on the site's **Components** page (`/components`) in the same task, so team and client see every block as it stands (owner rule, Oct 2026). Not done before it is there.

- **The page**: a copy of the site's standard page (Global Styles, Nav, `page_main`, Footer). `page_main` is a page slot, so the page is instances only: `Showcase Intro`, then per group a `Showcase Head`, then per component a `Showcase Label` and the instance itself, full width as on the site. Small parts (cards, icons, buttons) go in a `Showcase Grid`.
- **The four Showcase components** — flat, for this page only, deliberately unlike the site's section heads so a label is never taken for a block. Create them the first time, reuse them afterwards:

  | Component | Holds | Props |
  |---|---|---|
  | `Showcase Intro` | top of the page | Eyebrow, Title (H1), Text (one line of explanation) |
  | `Showcase Head` | start of a group | Number, Title (H2), Text (short), ID = `group-<name>` (prefixed: section ids such as `#products` may exist) |
  | `Showcase Label` | above each component | Name (as in the Designer), Note (where it is used, what cannot work here) |
  | `Showcase Grid` | small parts side by side | a slot `Items`; variants Cards / Row / Narrow (forms) |

  Recipe: build all four as plain elements with Lumos classes in `page_wrap` after `page_main` (small mono or tag text, a thin rule, neutral colours), transform each ([mechanics.md](mechanics.md) "Transform"), create the props and the Grid's slot and variants, group `Showcase`, then `move_element` each instance into `page_main` with `append`.
- **Groups** follow the site, e.g. Heroes · Story and text · Figures and maps · Products · CTAs · Forms and panels · Parts. Nav and Footer at top and bottom as on every page; parts that only live inside a section show inside it. Leave out Lumos building blocks (Section, Layout, Block, Typography, form fields, Global Styles) and throw-away test components.
- **Content as on its real page**: slots filled with the same items, prop overrides copied (fixed values; CMS-bound props on their default), page links as URLs (the API refuses `link_mode: page` on instances).
- **Scripts**: the page footer loads the same scripts at the same versions as the source pages; when a source page gets a new version, update it here too. Note in the Label what cannot work here (a filter that needs its own page's data).
- No reveal motion on the Showcase parts; the components keep their own. Before launch: draft or noindex, out of the sitemap.
- Record the page and its groups in `decisions/pages/components.md`.

## 4. Record

`decisions/components/<name>.md`: what the props mean, the defaults, what the API refused and is left for the Designer. `references/log.md`: one line per component.
