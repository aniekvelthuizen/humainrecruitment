# Kit issues

Not filed — owner (Aniek, 2026-10-31): improving the devkit is not part of this project.

## Unfiled — 2026-10-31

Not filed yet: `gh issue create` on Cut-the-Code-Agency/ctc-webflow-devkit was blocked by this session's permissions. File with the command below once the owner confirms (Aniek Velthuizen, via Claude).

```
gh issue create -R Cut-the-Code-Agency/ctc-webflow-devkit --label from-build \
  --title 'skills/cards/SKILL.md: "a card that looks like an existing one is a variant of Card Primary" needs a boundary' \
  --body-file <this section's body>
```

**Title:** `skills/cards/SKILL.md: "a card that looks like an existing one is a variant of Card Primary" needs a boundary`

**Body:**

Site: humain — Humain (from project.json). Filed by: <gh login> (work by Aniek Velthuizen, via Claude).

**What happened.** Following cards/SKILL.md §1–2 ("reuse by look", "a new card design: adapt Card Primary, never copy it") and base.md step 3, every card in the Figma file became a variant of Card Primary: 16 variants, 37 props (Opportunity, Opportunity Text, Expert, Expert Match, Expert Match Glass, Profile Role/Person/Case, Service, Discipline, Glass, Step, Stage, Stat, Pricing, Logo). Only Testimonial passed the lumos-rules §10 exception. Result:
- Webflow cannot hide a prop per variant: an editor on a Logo card sees Tags, Salary, Match score, List, Badge…
- Every card renders every part, hidden with CSS. A logo tile is 41 divs / ~4.7 kB; the HTML of Logo, Stat and Profile cards contains hidden job text ("Project Controls Manager", "Rotterdam, NL (hybrid)", "90k – 110k"). Native "is set" conditions do not help, because the props have default texts. Image props cannot be empty, so a hidden image still points at a placeholder.
- Every new part has to be hidden in 15 variants, and the base class styles are one variant's look, so the base can never change without rebasing all others.

**The rule that led there.** SKILL.md §1 "Look decides, not the internals" and §2 "build the design in the Lumos original … make the Figma types its variants … no "Card <Name>" next to it". The §10 test ("would it add props that do nothing in the other variants?") is applied per card, so each card adds a few such props and passes, while the component as a whole piles them up.

**Proposed boundary** (SKILL.md §1–2, mirrored in lumos-rules §10):
1. *Look* picks between cards that show the **same content**; *content* picks the component. Cards with the same data (title, text, icon, button) are variants of Card Primary; a card with its own data set (job meta, person + score, full-bleed photo, a logo only) is its own component, made as a duplicate of Card Primary with its own `card_<name>_*` classes.
2. Run the §10 test **cumulatively**: count the props and elements that render in fewer than half the variants. Above ~5, or above ~8 variants, split by content before adding the next variant.
3. A tile with one prop (a logo) is not a card.
4. Review checklist (review skill / verify.md): div count and bytes per card variant, and "no hidden text of another variant in the HTML".
5. base.md: the Lumos Cover/Stacked ids may leave Card Primary with the card type that needs them; record it in decisions.

**What the split showed (pilot Card Opportunity, 2026-10-31), useful for base.md § "A separate card":**
- `duplicate_component` copies every variant with new ids **and their variant styles**, keeps every prop id except the variant prop (name "Variant" kept), the wrap's conditional Wrapper Classes/Style bindings, the Clickable's conditional visibility and every native "is set" condition. A duplicate is the right start; only `set_style` to own classes drops the variant styles (re-set them per variant).
- `remove_prop` refuses variant props ("Variant props cannot be deleted"), so an unused Icon variant prop stays behind on the duplicate.
- `update_prop` `clear_default_value` on a rich-text prop sets "Default Rich Text Content"; set `rich_text_inner_text: ""` instead.
- The instance Properties panel no longer exposes `[data-automation-id="draggable-content_<Folder>"]` (folders are `atom-settings-folder-<Folder>`, not draggable), so props.md's scripted folder drag no longer works.
- `insert_component_instance` refuses an instance as anchor; `data_component_builder insert_in_slot` on the grid's slot works.
- Result: a job card went from 83 elements / 58 divs / 5.8 kB to 45–50 elements / 34–37 divs / 3.7–3.9 kB with identical geometry at 402 and 1512 px.

Plan in the client repo: `references/plans/2026-10-31-card-split.md`.

### Addendum 2026-10-31 (Designer pass, Aniek Velthuizen via Claude)
- Variant props (unused Icon / Experience Icon on duplicates) **can** be deleted in the Designer: component canvas › left Properties panel › hover the prop row › trash icon. The Property settings popover has no delete.
- The scripted folder drag in props.md works on the **component canvas** Properties panel (`draggable-content_<Folder>` exists there, not on the instance panel). The dragged folder takes the target's index (up = before, down = after). Folder order = order of each folder's first prop, so a folder drag can reshuffle props inside other folders and a prop drag can move its folder: read the props per folder after each drag and fix the folder order last.
- `update_prop` batches that land on the wrong prop can rename an **attributes** prop (not listed by `get_component`), which then shows up as a "hidden" name conflict ("Score Label 2").

## Unfiled — 2026-11-02: nested tag styles inside a `u-rich-text` element edit the global Lumos rule

Not filed (owner rule above). For `references/webflow-mcp.md` §11 "Styles panel" (Aniek Velthuizen, via Claude).

- Selecting an `h2`/`h3`/`p`/`ul`/`ol`/`li` inside a Rich Text whose class chain contains `u-rich-text` (here `rich-content_text u-rich-text u-text-style-large u-text-trim-off`) makes the Designer pick the **existing** nested rule `.u-rich-text <tag>`. The panel still shows "When nested inside of" with the element's full chain, so it looks scoped; edits (Text Style variable mode, margins) land on the global rule and change every rich text on the site.
- Only a tag Lumos does not style there yet (`a`: pick «All Links», then tick "Nest selector inside of") gets a new rule on the full chain.
- Tell-tale before editing: the count line. "1 on this page" = scoped; "… on other pages" = global.
- Route that worked: tag rules for that section in a `u-embed-css` embed; links as a Designer nested style. Restoring the global rule: Option+click the Text Style label (mode back to inherited), relink margins to the Text Style `margin-top` / `margin-bottom` variables.
- Side effect seen on that save: Webflow dropped all `<deleted|…>` variable references from the published CSS (460 on this site); check anything that read them (here only `.u-rich-text li`).
