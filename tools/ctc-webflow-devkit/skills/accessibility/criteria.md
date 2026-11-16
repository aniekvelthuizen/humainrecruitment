# WCAG 2.2 AA on Webflow and Lumos

Per area: what the criterion asks (number in brackets), how it goes wrong on Webflow sites, and the fix. **Script** = found by `a11y-check.mjs`; **hand** = only a person sees it (SKILL.md §3).

## 0. Advice that circulates and is wrong

Popular checklists (also Webflow's own) mix rules with good practice and carry a few mistakes. Do not follow these:

| Advice | Why it is wrong | Do instead |
|---|---|---|
| "Remove focus from hidden elements with an aria attribute" | `aria-hidden` hides from screen readers only; the element stays in the Tab order. A focusable element under `aria-hidden` is itself a failure (axe `aria-hidden-focus`). | `display: none`, the `inert` attribute on the closed panel, or `tabindex="-1"` on its controls. A Lumos Modal `<dialog>` opened with `showModal()` does it by itself. |
| "Every link inside `role=list` gets `role=listitem`" | A role on `<a>` replaces the link role: the screen reader no longer says "link". | The item **wrapper** gets `role="listitem"`, the link sits inside it. |
| "Use `role=navigation`, `role=button`…" | The first rule of ARIA is a native element. A role adds no keyboard behaviour. | `<nav>`, `<button>`. A `div role="button"` also needs `tabindex="0"` and Enter + Space; `role="tab"` needs a tablist, `aria-selected` and arrow keys. |
| "All controls need none/hover/pressed/focused/visited styles" | WCAG requires a **visible focus** (2.4.7) with enough contrast (1.4.11). Hover, pressed and visited are good practice. | A designed `:focus-visible` on everything; hover in the site's own language (house rule, [verify.md](${CLAUDE_PLUGIN_ROOT}/references/verify.md) §2c). |
| "Never use px for lengths" | Browser zoom scales px. What breaks is **font sizes** that ignore the user's font size, and **fixed heights** on boxes with text. | Font sizes in rem (Lumos' fluid `clamp()` has a rem part), spacing from variables; a 1 px border is fine; no fixed height on a text box. |
| "aria-label on important icon buttons" | Every control needs a name (4.1.2), not only important ones. | See §3. |
| "aria-labelledby on repeated content" | Right for a few big blocks; on every section it turns the landmark list into noise. | Only on regions a reader wants to find or skip (nav panels, filters, footer). |

## 1. Keyboard and focus

- **All functionality by keyboard** (2.1.1), **no trap** (2.1.2). Script: Tab walk, trap. Hand: Enter/Space/Escape/arrows on every widget.
  - A Webflow `div` with a click interaction (IX3 click trigger on a Block) is not reachable: make the trigger a `<button>` or Link Block.
  - Swiper slides off screen hold focusable cards: Lumos Slider's a11y module must be on; focusing a card must slide it into view.
- **Focus visible** (2.4.7) with **3:1** against its background (1.4.11). Lumos ring via `:focus-visible` (hover triggers are `hover`, not `focus`, which sticks after a click: [motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §3); never a `:focus` outline (it shows after a mouse click, house rule). On a photo or a dark theme the ring needs its own colour per Theme mode.
- **Focus order** follows reading order (2.4.3). Do not use `tabindex` above 0; reorder the DOM instead of moving things with `order` or absolute positioning.
- **Focus not obscured** (2.4.11, new in 2.2): a sticky nav may not cover the focused element entirely. Fix: `html { scroll-padding-top: var(nav height total) }` in Global Styles; the same for a sticky bottom bar (`scroll-padding-bottom`). Script flags full cover.
- **Hidden content takes no focus**: closed mega-menu, mobile menu at desktop, collapsed accordion, inactive tab panel, closed modal. Script: "focus on invisible element".
- **Toggles** (4.1.2): `aria-expanded` on the button, flipped when it opens; Escape closes and returns focus to the button. Webflow Dropdown and Navbar do this; a custom script must do it too. Script tests up to 8 toggles.
- **Content on hover or focus** (1.4.13): a dropdown or tooltip that opens on hover also opens on focus, stays while the pointer moves onto it, and closes with Escape.
- **Skip link** (2.4.1): first Tab stop, visible on focus, target exists (`#main` on `page_main` in Lumos). Script checks.
- **Dragging** (2.5.7, new): a slider that can be swiped also has arrows or dots. **Target size** (2.5.8, new): at least 24 × 24 px or enough space around it; house rule 44 px on phones. Script measures.

## 2. Structure

- **Landmarks** (1.3.1): one `main`; `nav` for menus, each with a distinct `aria-label` when there are several ("Hoofdmenu", "Footer"); `header`/`footer` for the page header and footer. A `<section>` is a landmark only with a name (`aria-labelledby` → its heading id): use that for a few big regions, not every block. Set tags in the element's Tag setting (Designer) or with the builder's `tag`.
- **Headings** (1.3.1, 2.4.6): one `h1`, no level skipped, headings describe their section. Text that looks like a heading is an H tag (except card titles on overview pages: [seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md) rule 2); an H tag used only for size is a paragraph with a text-style class. Script prints the outline.
- **Lists** (1.3.1): repeated items are a list. Collection Lists render `role="list"`/`role="listitem"` already. A list built in a slot: `role="list"` on the slot parent, `role="listitem"` on every item root (never on the link). `ul`/`ol` with `list-style: none` lose list semantics in Safari: add `role="list"`.
- **Page language** (3.1.1): Site settings › General › Language, and per locale with Localization. **Language of parts** (3.1.2): English text on a Dutch page (a quote, the "EN" switch) gets `lang="en"`; the language-switch link also `hreflang`.
- **Page title** (2.4.2): unique per page, follows the [seo](../seo/SKILL.md) skill.
- **Consistent navigation and help** (3.2.3, 3.2.6 new): menu, contact and help links in the same place and order on every page.

## 3. Names and text alternatives

- **Images** (1.1.1): informative images get alt text that says what the image tells (not "image of", not the file name); decorative images get the Webflow alt setting **Decorative** (renders `alt=""`), not `aria-hidden`. In a component, the image prop and its alt prop come together; CMS images bind alt from an alt field or the asset's alt text. Text inside an image is also in the page.
- **Decorative SVG and icons**: `aria-hidden="true"` on the wrapper (`Icon Set` carries it), also `focusable="false"` on inline SVG. Decorative: icons next to text that says the same, dividers, blobs, quote marks, chevrons in a button with text, repeated logos without information.
- **Icon-only controls** (4.1.2, 2.5.3): a name on the link or button. Fixed name (Zoeken, Sluiten, Menu): `aria-label` in the component definition. Name per instance (a social link, an arrow card): a visually hidden text element (`u-sr-only` or the site's screen-reader class; check `references/classes.json`) bound to a text prop. Where text is visible, the name starts with that text (**Label in Name**, 2.5.3).
- **Link purpose** (2.4.4): no bare "Lees meer", "Klik hier". Add the subject in hidden text bound to the card title ("Lees meer <span class=u-sr-only>over Martin</span>"), or make the whole card one link named by its title. Script flags vague texts.
- **New tab**: an external link with ↗ that opens a new tab says so in hidden text ("opent in nieuw tabblad"). Good practice, not AA.
- **Media** (1.2.x): pre-recorded video with sound has captions; audio-only (podcast) has a transcript on the page; a background video without sound has a pause control (Webflow Background Video has a built-in play/pause button: keep it on).

## 4. Widgets: native or complete ARIA

What the native and Lumos parts render was read from published pages in Nov 2026 (Lumos starter, Webflow Navbar/Dropdown/Forms). Re-check after a Lumos or Webflow update with `a11y-check.mjs`.

| Widget | Native / Lumos, and what it already does | When custom, it needs |
|---|---|---|
| Menu toggle | Webflow Navbar button: `role="button"`, `tabindex="0"`, `aria-label="menu"`, `aria-controls`, `aria-expanded` flips. It also sets `aria-haspopup="menu"`, which promises arrow-key menu behaviour a site menu does not have; harmless in practice, leave it. Translate the `aria-label` ("Menu") on a Dutch site. | `<button aria-expanded aria-controls>`, Escape closes, focus back |
| Dropdown | Webflow Dropdown: toggle with `aria-expanded`/`aria-controls`, list is a `<nav aria-labelledby>` | same as above |
| Modal | Lumos Modal: `<dialog>` opened with `showModal()` (focus moves in, background inert, Escape closes). The opener (e.g. the search link) carries `aria-haspopup="dialog"`, which needs no `aria-expanded`. | focus into the dialog, background `inert`, Escape, focus back to the opener, a labelled close button |
| Accordion / FAQ | Lumos Accordion: a `<button aria-expanded aria-controls>` inside the heading | `<button aria-expanded>` per header, panel hidden with `display:none`/`hidden`, or `visibility: hidden` when it animates ([motion.md](${CLAUDE_PLUGIN_ROOT}/references/motion.md) §4) |
| Tabs | Lumos Tabs: `role=tablist/tab/tabpanel`, `aria-selected`, roving `tabindex`, panels `aria-labelledby` | the same, plus arrow keys |
| Slider | Lumos Slider (Swiper a11y module on): slides `role="group"` `aria-label="1 / 7"`, wrapper `aria-live="polite"`, a live notification element | arrows as buttons with names, slide count announced, off-screen slides not focusable, pause on autoplay |
| Screen-reader text | Lumos `u-sr-only` | — |
| Decorative image | Webflow image setting or Assets panel: Alt text › **Decorative** (renders `alt=""`; set in the Assets panel it applies to every use of that asset). Through the API: alt `null`. | — |
| Background video | Webflow Background Video: "Include play/pause button" is on by default since June 2022; keep it on (without it, reduced-motion visitors cannot play the video either) | a visible pause button |
| Filters, sort, load more | Finsweet Attributes | result count in an `aria-live="polite"` element (4.1.3) |

## 5. Colour and contrast

- **Text contrast** (1.4.3): 4.5:1, large text (≥ 24 px, or ≥ 18.7 px bold) 3:1. **Non-text** (1.4.11): 3:1 for field borders, icons that carry meaning, the focus ring, the selected state of a tab or dot.
- On a Lumos site colours come from Theme variables, so check the **pairs** once per Theme mode × brand mode instead of per element: text/background, muted text/background, placeholder/field (Lumos ships the placeholder at 60 % text: often too light), link/background, button text/button background (primary and secondary, rest and hover), field border/background, focus ring/background. Write the table in `decisions/site.md` › Accessibility. A new brand mode or theme mode gets its row before it ships.
- **Text on photos**: an overlay or a text box so the worst part of the photo still passes; check the darkest and lightest crops at 375.
- **Not by colour alone** (1.4.1): links in running text are underlined (or 3:1 against the text plus a non-colour cue on hover and focus); errors say so in words, not only in red.

## 6. Zoom, reflow, text

- **Resize to 200 %** (1.4.4) and **reflow at 320 px** (1.4.10): no content lost, no sideways scroll (tables and maps excepted). Script checks 320 px.
- **Text spacing** (1.4.12): with line height 1.5, letter spacing 0.12 em, word spacing 0.16 em and paragraph spacing 2 em, nothing is cut off. Fixed heights and `overflow: hidden` on text boxes break this. A line clamp on a card teaser is acceptable when the full text is one click away. Script checks.
- **Font sizes in rem** so the browser's font-size setting works (good practice behind 1.4.4). Script lists text that stays under 20 px at a 200 % root size.
- **Orientation** (1.3.4): nothing locked to portrait or landscape.

## 7. Motion

- **Pause, stop, hide** (2.2.2): anything that moves on its own for more than 5 s next to other content (autoplay slider, marquee, logo ticker, background video) has a visible pause button, reachable by keyboard. `prefers-reduced-motion` alone does not meet this criterion, but do it as well ([interactions](../interactions/SKILL.md)).
- **No flashing** more than three times a second (2.3.1).
- Scroll reveals: content is readable without them and never stays invisible when the script fails (house rule).

## 8. Forms (also inside an iframe)

- **Labels** (1.3.1, 3.3.2): every field has a visible label tied to it (`for`/`id`); a placeholder is not a label. Groups (radio amounts, frequency) in a `fieldset` with a `legend`.
- **Input purpose** (1.3.5): `autocomplete` on fields about the user: `given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `address-level2` (city). An IBAN has no token; leave it off there.
- **Errors** (3.3.1, 3.3.3): the error says in words what is wrong and how to fix it, next to the field and tied with `aria-describedby`; focus moves to the first error or a summary.
- **Required**: shown in text or a marked asterisk explained once, and `required`/`aria-required`.
- **Status** (4.1.3): the success and error message after submit is announced. Webflow's native `w-form-done` / `w-form-fail` render as `role="region"` with `tabindex="-1"` and an `aria-label`, **not** as a live region (checked Nov 2026): add `role="status"` (or `aria-live="polite"`) to the message's inner text block and confirm with VoiceOver that it is read after submit. A custom message needs the same.
- **Redundant entry** (3.3.7, new): in a multi-step flow, do not ask again for what the user already entered (amount, name); carry it over or prefill it.
- **Accessible authentication** (3.3.8, new): no puzzle or memory test to log in; a bot check like Turnstile passes when it runs without a challenge.
- **Iframe**: `title` that names the form (4.1.2); the form inside meets this section on its own page; its height fits the content so there is no inner scroll.
- **Timing** (2.2.1): no session timeout on a form without a warning and a way to extend.

## 9. The law (state Nov 2026; not legal advice)

- **Standard**: the EU law points to EN 301 549. The edition cited in the Official Journal is still **v3.2.1 = WCAG 2.1 AA**. **v4.1.1** (published Sept 2026) moves to **WCAG 2.2 AA** but is not cited yet; citation is expected around late 2026 or 2027. Building to 2.2 AA now meets both.
- **Public bodies** (government, municipalities and most organisations they fund): the Web Accessibility Directive (in NL the Besluit digitale toegankelijkheid overheid) with a required accessibility statement.
- **Companies and organisations offering services to consumers**: the **European Accessibility Act**, in NL the Implementatiewet toegankelijkheidsvoorschriften producten en diensten, in force since **28 June 2025**. It covers e-commerce: services at a distance, through a website or app, at the consumer's request, *with a view to concluding a consumer contract* (webshops, ticket sales, paid sign-ups, bookings). The service must meet EN 301 549, and the provider must publish how it meets the requirements (Annex V; usually a page on the site). Supervision in NL is split over six bodies, among them ACM.
- **Exempt**: microenterprises (fewer than 10 people **and** at most €2 million turnover or balance) for services; B2B-only services.
- **Non-profits**: the legal form gives no exemption. A webshop, paid event or ticket sale of a foundation is in scope. Whether a **plain donation** is a "consumer contract" is not settled by any authority found (Nov 2026); treat donation flows as in scope, the risk is one-sided.
- For a client, write in `decisions/site.md` › Accessibility which regime applies and that the bar is WCAG 2.2 AA either way.

## 10. Tools

| Tool | Finds | Misses |
|---|---|---|
| `a11y-check.mjs` (axe-core + own checks) | missing names, alt, labels, contrast of what is shown, ARIA misuse, lang, focus order and visibility, hidden focus, targets, reflow, text spacing | whether names and alt are *good*, other themes and brands, screen-reader announcements, media, cognitive load |
| VoiceOver / NVDA | what a reader actually hears | — |
| Browser zoom, reduced motion setting | real zoom and motion behaviour | — |
