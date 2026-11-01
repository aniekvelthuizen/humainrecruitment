# Plan — split Card Primary by content — 2026-10-31

Written by Aniek Velthuizen (via Claude). **Status: owner OK (2026-10-31). Phase 0, 1 and 2 done (Card Arrow, Card Opportunity, Card Expert, Card Profile, Logo Tile), see `decisions/components/cards.md`. Phase 3 done (old cards converted). Phase 4 done (Card Primary = Service base + 6 variants, 23 props; Experience Icon prop waits for the Designer). Next: Phase 5 (review). Question 5: plain-text title not possible (Typography Heading only has rich text).**

## In short

Card Primary (`7941d471-12eb-22ce-6420-784e5a3b04f8`) has 16 variants and 37 props. Webflow cannot hide a prop per variant, and every card renders every part hidden with CSS, so a logo tile carries 41 divs and hidden job text. The split follows **content (data)**, not look. Cards that show the same kind of content stay variants of one component; a new component starts where the content changes.

| Component | Variants | Content | Instances now |
|---|---|---|---|
| **Card Primary** (Lumos original, stays) | Service (new base), Discipline, Glass, Step, Stage, Stat, Pricing | icon, badge, eyebrow, title, text, list, value, button | 10 stay |
| **Card Opportunity** (new) | Default, With Text | tags, title, meta rows, text, "View & apply" | 21 move |
| **Card Expert** (new) | Expert, Match, Match Glass | photo, name, subtitle, logo, match score, list | 3 move |
| **Card Profile** (new) | Role, Person, Case | large photo, title, subtitle, text, badge | 10 move |
| **Logo Tile** (new, not a card) | — | logo | 1 moves |
| Card Testimonial | unchanged | — | — |

This follows the proposal. There is one deviation, the classes (§2): **each new component gets its own classes** and does not reuse `card_primary_*`. Card Primary keeps `card_primary_*`. Parts that really are shared are shared as components (Card Arrow, Card Bullet, Typography, Button Main, Clickable), not as classes.

## 1. Inventory (read-only, 2026-10-31)

- `get_component`: 52 instances counted by Webflow. Found on pages: **45**, of which 44 are on Example Components (`6ae35365a38b2d71cab8c69d`) and 1 is on Home (Opportunity, own Title). The other 18 pages have 0. **The 7-instance gap must be explained before any variant is deleted** (Phase 0).
- The 44 on Example Components are **18 own showcase cards** plus **26 Lumos starter demo cards** (Opportunity without overrides, in Lumos grid/slider demos, some with `Role` off and `Wrapper Classes` `u-row-span-2` / `u-column-span-2`; Profile Person/Role, which were Lumos Cover/Stacked).
- Slot contents: Expert 3 Card Bullets, Stage 5, Pricing 3.
- Tree (component scope): wrap › group (`data-trigger="hover-if-clickable focus"`) › element › visual › image · content › top (icon + badge) · eyebrow · kicker (Card Opportunity Tags) · header (Typography Heading) · subtitle · logo · text · list (title + slot) · value (label + number + unit) · details (Card Opportunity Meta) · button (Button Main Tertiary, conditional) · action (Button Main Primary) — corner (Card Opportunity Arrow) — Clickable (conditional). There is no Theme Switcher instance in the wrap any more; card colours come from Theme variables plus variant mode settings.

| Card Primary variant | Instances | Goes to |
|---|---|---|
| Opportunity (base) | 12 Lumos demos without overrides + 3 Lumos grid (Role off, 1× column-span) + 4 Lumos grid with link (2× row-span) + 1 Home | Card Opportunity · Default |
| Opportunity Text | 1 | Card Opportunity · With Text |
| Expert / Expert Match / Expert Match Glass | 1 / 1 / 1 | Card Expert |
| Profile Role / Person / Case | 3 (2 Lumos grid) / 6 (5 Lumos) / 1 | Card Profile |
| Logo | 1 | Logo Tile |
| Service 2, Discipline 1, Glass 2, Step 2, Stage 1, Stat 1, Pricing 1 | 10 | stay in Card Primary |

## 2. Why own classes, not `card_primary_*` (deviation from the proposal)

The proposal reasoned that the classes are global, so the look would not have to be duplicated. On this site that only holds for part of the look:

1. **Variant styles belong to Card Primary's variant ids** (`.card_primary_x:where(.w-variant-<id>)`). A new component has new variant ids, so Expert, Expert Match, Glass expert, the three Profiles, Logo and Opportunity Text bring **none** of their overrides along. They must be written again anyway.
2. **The base class styles are the Opportunity look** (notch mask, min-height 24 rem, padding, mint veil). Only one component can have that as its base. When Opportunity leaves, Card Primary needs a new base (Service), which changes the base class styles. If other components shared those classes, the change would break them.
3. Lumos naming: a class names its component (`_wrap` opens it). If `card_primary_*` ran through four components, any edit to a base class would ripple into all of them. The kit's own route for a separate card says the same ([base.md](../../tools/ctc-webflow-devkit/skills/cards/base.md) § "A separate card on request").

The cost is about the same either way, because the variant styles have to be written per variant in both cases. With own classes they are written once, flattened (base ⊕ variant), and never collide.

What **is** shared, as components rather than classes:
- **Card Arrow**: today's Card Opportunity Arrow, renamed. It is used by Card Primary Service, Card Opportunity and Card Expert. Classes `card_primary_arrow*` → `card_arrow*` (`rename_style`; only used inside that component).
- **Card Opportunity Tags / Meta**: stay as they are, used only by Card Opportunity from now on. Classes `card_primary_tag(s)` / `card_primary_meta*` → `card_opportunity_tag(s)` / `card_opportunity_meta*`.
- **Card Bullet**: slot item in Card Primary (Stage, Pricing) and Card Expert (Expert). Each slot's Allowed components = Card Bullet.
- Theme variables `card/*` (background, background-hover, glass, shadow-1…4, accent, logo-invert, photo-grayscale): stay as they are and are used by every card.

## 3. The components

Folder order everywhere: Variant → Content → Visual → part folders → Link → Settings ([props.md](../../tools/ctc-webflow-devkit/skills/cards/props.md)). Every text gets "is set". Every new image prop gets an Alt prop (Card Primary's Image had none).

### 3.1 Card Primary (stays, slimmed down)

Variants: **Service** (base), Discipline, Glass, Step, Stage, Stat, Pricing.

Structure afterwards: wrap › group › element › visual (Service: mint veil; Glass/Step/Pricing: ring) › content › top (icon + badge) · eyebrow · header · text · list (title + Items) · value (label + number) · button · action — corner › Card Arrow — Clickable.
Removed: `card_primary_image`, kicker + Tags, subtitle, logo, unit, details + Meta.

| Folder | Props |
|---|---|
| Variant | Variant |
| Content | Eyebrow (= Subtitle renamed, same id) · Eyebrow Visibility (= Subtitle Visibility) · Title · Text |
| Visual | Icon · Icon Visibility |
| Badge | Badge Text · Badge Visibility |
| List | List Title · Items (slot) · List Visibility |
| Value | Value · Value Label |
| Button | Button Text · Button Icon Visibility |
| Link | Link · Screen Reader Text · Link Attributes |
| Settings | Visibility · Role · Wrapper Classes · Wrapper Style |

Removed (14): Logo, Logo Alt, Logo Visibility, Image, Image Visibility, Tag 1/2 Text, Tags Visibility, Location/Experience/Salary Text, Experience Icon, Salary Visibility, Value Unit. So 37 → 23 props.

**Rebase:** the base becomes the Service look. Method: snapshot every `card_primary_*` style (base and every remaining variant; breakpoints main/medium/small/tiny; pseudos hover/focus-within/focus-visible; variable modes). A script computes the new base (= base ⊕ Service) and, per remaining variant, the difference that gives the same end result. Apply it, read it back, measure. The two Service instances switch to `base`; then the Service variant is deleted.

What stays shared inside Card Primary: Stat still carries hidden list/badge/value elements. That is accepted, because they are the same content family. Defaults that read as job text are gone with the Opportunity parts.

### 3.2 Card Opportunity (new)

Variants: **Default** (= Opportunity), **With Text** (= Opportunity Text; meta above the text).
Parts: wrap › group › element (light-200 surface, notch mask) › visual (mint veil) › content › kicker › Card Opportunity Tags · header › Title · text (With Text only) · details › Card Opportunity Meta · button › Button Main Tertiary — corner › Card Arrow — Clickable.
Classes: `card_opportunity_wrap / _group / _element / _visual / _content / _kicker / _header / _title / _text / _details / _button / _corner`.

| Folder | Props |
|---|---|
| Content | Title · Text (tooltip: only in With Text) |
| Tags | Tag 1 Text · Tag 2 Text · Tags Visibility |
| Meta | Location Text · Experience Icon · Experience Text · Salary Text · Salary Visibility |
| Button | Button Text |
| Link | Link · Screen Reader Text · Link Attributes |
| Settings | Visibility · Role · Wrapper Classes · Wrapper Style |

### 3.3 Card Expert (new)

Variants: **Expert** (base: white, notch, mint hover, list, score with a small %), **Match** (row, Theme Dark, photo with small notch), **Match Glass** (glass, greyscale photo, white on hover/focus).
Parts: wrap › group › element › visual (Expert: veil) · photo › image (Match/Glass) · content › header › Name · subtitle · logo › image · list (title + Items) · score (label + number + unit) — corner › Card Arrow (Expert) — Clickable.
Classes: `card_expert_*` (`_photo` replaces the Match trick in which `card_primary_visual` was the photo).

| Folder | Props |
|---|---|
| Content | Name (= Title) · Subtitle |
| Visual | Photo · Photo Alt (new) · Logo · Logo Alt · Logo Visibility |
| Score | Score Label · Score · Unit |
| List | List Title · Items (slot) · List Visibility (tooltip: Expert only) |
| Link | Link · Screen Reader Text · Link Attributes |
| Settings | Visibility · Role · Wrapper Classes · Wrapper Style |

No Photo Visibility: the variant decides (Expert has no photo, Match/Glass always do). Default = `placeholder-image.svg`.

### 3.4 Card Profile (new)

Variants: **Role** (base, was Lumos Cover), **Person** (was Lumos Stacked), **Case**.
Parts: wrap › group › element (Theme Dark, min-height 28.6875 rem) › visual › image (cover, Lumos hover zoom) · content (gradient) › badge · header › Title · subtitle · text — Clickable (off unless a link is filled).
Classes: `card_profile_*`.

| Folder | Props |
|---|---|
| Content | Title · Subtitle · Text |
| Visual | Image · Image Alt (new) |
| Badge | Badge Text · Badge Visibility (tooltip: Case) |
| Link | Link · Screen Reader Text · Link Attributes |
| Settings | Visibility · Role · Wrapper Classes · Wrapper Style |

### 3.5 Logo Tile (new, group Visual)

Not a card: an item in the logo marquee. `logo_tile_wrap` (6.25 rem high, centred) › image `logo_tile_image` (contain). Props: Visual › Logo · Logo Alt. No Clickable, no hover (Figma has neither). Built fresh (`create_blank_component` + element builder), not as a duplicate. That is about 2 elements instead of 41.

## 4. Clickable, notch arrow, hover, Theme

| | Card Primary | Card Opportunity | Card Expert | Card Profile | Logo Tile |
|---|---|---|---|---|---|
| Clickable | yes | yes | yes | yes (default off) | no |
| Rule "clickable" | `Screen Reader Text is set AND Link is set` on Clickable, corner and button — comes along with the duplicate; Designer check per component | same | same | same | — |
| Notch (mask) | none (Service base) | base | Expert; Match: small photo notch | none | none |
| Card Arrow | Service (top right, fades in) | bottom right in the notch | Expert | — | — |
| Hover | Lumos `hover-if-clickable` on the group → veil (`card/background-hover`), arrow track; button wrappers reset Trigger to Base (no underline) | same | Expert same; Match Glass `:hover`/`:focus-within` on the group → Theme Base + white, photo `card/photo-grayscale` | image zoom (Lumos) | — |
| Theme | `card/*` Theme variables follow the section | same | Match: Theme Dark mode on the element (variant) | Theme Dark mode on the element | — |

Variable modes per variant (`set_style_variable_mode` with `variant_id`, also on pseudos) are copied per new class and read back. Hover is tested 3× in a row and once interrupted, per variant and theme (kit cards §5).

## 5. API or Designer

**API** (Webflow MCP `846065a5-…`): `duplicate_component`; create, rename and remove variants; create and rename classes (`create_style`, `rename_style`); `update_style` on every breakpoint and pseudo; `set_variant_styles`; variable modes; `set_style` on elements; remove elements; create, update and remove props; bind nested instance props to card props; `set_component_metadata`; place, fill and remove instances on pages (`insert_component_instance`, `set_component_instance_prop_values`, `insert_in_slot`, `remove_element`); publish to staging.

**Designer** (Claude in Chrome, one session, queue then one pass):
- Webflow backup before Phase 1 (Site settings › Backups).
- Per new component: check that the native conditions came along with the duplicate (Clickable, corner, button, every "is set"); recreate any that are missing. Variant prop named `Variant`; folder order; Link Attributes in Link.
- New image props (Photo, Image, Logo on Logo Tile): defaults = the site's own placeholders. Earlier this was blocked once by Webflow's bot check; fallback = a toggle, as before.
- Title heading level (see question 5).
- Slot Allowed components = Card Bullet.

## 6. Order and checkpoints

**Phase 0 — safety net (no site change except a backup)**
1. Webflow backup (Designer).
2. Snapshot to `references/audit/2026-10-31-card-primary-snapshot.json`: all props, every variant's styles and variable modes, all 45 instances with their values and slot contents. This is the rollback source.
3. Baseline on staging with a new `references/card-check.mjs` (same approach as `nav-check.mjs`): per card at 1512 and 402 px, rest and hover — box sizes and positions of card, title, texts, tags, meta rows, score, button, arrow, image; surface colour, mask, radius, shadow; div count and HTML bytes per card; texts in the HTML.
4. Explain 52 vs 45 instances. Check IX3 interactions and custom code for `card_primary_*` selectors.
5. **Duplicate test** on a throwaway (`Test | Card split`): does `duplicate_component` keep variants (with which ids?), variant styles, native conditions and the wrap bindings (Wrapper Classes/Style, Role tag)? Then unregister the test component (0 instances). The result decides between the duplicate route and the fresh route (fresh = `create_blank_component` + builder, wrap bindings and conditions all in the Designer).

**Phase 1 — pilot: Card Arrow + Card Opportunity**
Rename Card Arrow and its classes → build Card Opportunity (duplicate, strip to its parts, own classes, flattened styles, With Text as a variant, props) → place it next to the old cards in a temporary section "Split check" on Example Components → publish to staging → `card-check.mjs` old against new. **Checkpoint: show the owner before the rest.**

**Phase 2 — Card Expert, Card Profile, Logo Tile**
One component at a time (duplicates share prop ids), each with the same compare step.

**Phase 3 — convert the 35 instances** (§7), then remove the old ones.

**Phase 4 — slim down Card Primary**
Delete the 9 moved variants only after `query_elements` shows 0 instances per variant. Rebase to Service. Remove the 14 props and the unused elements; rename Subtitle → Eyebrow; Designer tidy-up.

**Phase 5 — finish**
Publish to staging, full `card-check.mjs` run, fresh reviewer agents (this time with props), records in `decisions/components/cards.md` and `references/log.md`, file the kit issue (§10).

## 7. Converting the 45 example cards

Webflow cannot swap the component of an instance. Per card: `insert_component_instance` **before** the old one (same parent, same place in the grid or slider) → set the values from the snapshot (`set_component_instance_prop_values`) → fill the slot (`insert_in_slot` Card Bullet + Text) → measure → `remove_element` on the old one.

| From | → To | Values to carry over |
|---|---|---|
| 12 Lumos Opportunity demos | Card Opportunity · Default | none |
| 3 Lumos grid Opportunity | Card Opportunity · Default | Role off, Wrapper Classes |
| 4 Lumos grid Opportunity with link | Card Opportunity · Default | Link, Screen Reader Text, Wrapper Classes |
| 1 Home Opportunity | Card Opportunity · Default | Title |
| Opportunity Text | Card Opportunity · With Text | Title, Text, Tag 1/2, Experience Text + Icon, Salary off, Link, Screen Reader Text |
| Expert | Card Expert · Expert | Name, Subtitle, Logo + on, Score 85, Link, Screen Reader Text, 3 bullets |
| Expert Match | Card Expert · Match | Name, Subtitle, Logo + on, Photo, Score 85% |
| Expert Match Glass | Card Expert · Match Glass | Name, Subtitle, Logo + on, Photo, Link, Screen Reader Text |
| 5 Lumos Profile Person | Card Profile · Person | none |
| 2 Lumos grid Profile Role | Card Profile · Role | Role off, Wrapper Classes |
| Profile Role / Person / Case (showcase) | Card Profile | Title, Text, Subtitle, Image, Badge |
| Logo | Logo Tile | Image → Logo |
| 10 content cards | stay | the 2 Service cards: Variant → base after the rebase |

35 cards move, 10 stay. Whether the 26 Lumos demo cards are converted or removed is question 2.

## 8. Checking it looks the same

- **Geometry:** `card-check.mjs` on staging at **1512** and **402** px. Per card, old against new: all boxes within 1 px, same colours, mask, radius, shadow, font size and weight. Known values from `cards.md` as a sanity check (Opportunity 440 × 385, meta 205/237/269, arrow 392/337; Service 230; Expert 275; Profiles 459; Logo 178 × 100; mobile Opportunity 362 × 261).
- **Hover and focus:** real mouse hover (Chrome DevTools `hover`), 3× in a row and once interrupted; keyboard focus on Match Glass; Light, Dark and Brand sections (Brand was never checked; add it to the showcase).
- **HTML:** div count and bytes per card (target: Logo Tile ≈ 2 elements, Profile no job text); no "Project Controls Manager", "Rotterdam, NL (hybrid)" or "90k – 110k" in the HTML of a card that does not show it; 0 requests to 403 assets; number of clickable cards = number of cards with a link; `<h3>` titles where the component fixes them.
- **Props:** `get_component` read-back per component (names, folders, order, defaults, bindings); a fresh reviewer agent that does have API access this time.
- Screenshots of old against new per card in the scratchpad, plus a short report in `references/audit/`.

## 9. Risks

1. **Variant ids cannot move.** An instance cannot be pointed at a variant of another component, so every moving card is re-created. Deleting a variant silently drops its remaining instances to the base look. → Delete only at 0 instances, per variant.
2. **Lumos Cover/Stacked ids** (`51efa20c…` Profile Role, `da648fa9…` Profile Person) leave Card Primary with the Profiles. Card Primary then has no image variant and loses `card_primary_image` and Lumos' hover zoom (Card Profile keeps the zoom). Kit base.md step 3 ("keep the ids") then no longer applies to this site → recorded in `decisions/`.
3. **The base cannot be deleted**, and the base is Opportunity. The rebase of Card Primary is the biggest risk: every content variant changes in its styles while it must look the same. → Snapshot, scripted diff, measure every content variant.
4. **Prop ids are lost per instance.** A duplicate keeps Card Primary's prop ids, but instance values do not come along; slot contents (11 Card Bullets) do not either. Rich-text titles set through the API become `<p>` (see question 5). Duplicates share prop ids → one component at a time.
5. **Native conditions and wrap bindings** (Wrapper Classes/Style, Role tag, "is set") cannot be written through the API. Whether a duplicate keeps them is tested in Phase 0; if not, it becomes Designer work per component.
6. **52 vs 45 instances**: 7 not found. Unexplained → no variant gets deleted.
7. **API read-back lies** about multi-layer `box-shadow`, `mask` and gradients with `var()` (seen on the button and the glass shadow) → check the published CSS, not the read-back.
8. **Sub-component classes renamed** (`card_primary_tag(s)`, `card_primary_meta*`, `card_primary_arrow*`): first check with `query_elements` that nothing outside those components uses them.
9. Webflow's **bot check** in the Designer (image defaults) can block a step → toggle fallback, as on 2026-10-30.
10. Scripts or IX3 that select `card_primary_*` → checked in Phase 0 (none known).

## 10. Kit issue (draft, file only after the owner's OK)

```
gh issue list -R Cut-the-Code-Agency/ctc-webflow-devkit --search "Card Primary variant boundary" --state all
gh issue create -R Cut-the-Code-Agency/ctc-webflow-devkit --label from-build --title "<title below>" --body "<body below>"
```

**Title:** `skills/cards/SKILL.md: "a card that looks like an existing one is a variant of Card Primary" needs a boundary`

**Body:**

> Site: humain — Humain (from project.json). Filed by: <gh login>.
>
> **What happened.** Following cards/SKILL.md §1–2 ("reuse by look", "a new card design: adapt Card Primary, never copy it") and base.md step 3, every card in the Figma file became a variant of Card Primary: 16 variants, 37 props (Opportunity, Opportunity Text, Expert, Expert Match, Expert Match Glass, Profile Role/Person/Case, Service, Discipline, Glass, Step, Stage, Stat, Pricing, Logo). Only Testimonial passed the lumos-rules §10 exception. Result:
> - Webflow cannot hide a prop per variant: an editor on a Logo card sees Tags, Salary, Match score, List, Badge…
> - Every card renders every part, hidden with CSS. A logo tile is 41 divs / ~4.7 kB, and the HTML of Logo, Stat and Profile cards contains hidden job text ("Project Controls Manager", "Rotterdam, NL (hybrid)", "90k – 110k"). Native "is set" conditions do not help, because the props have default texts. Image props cannot be empty, so a hidden image still points at a placeholder.
> - Every new part has to be hidden in 15 variants; the base class styles are one variant's look, so the base can never change without rebasing all others.
>
> **The rule that led there.** SKILL.md §1 "Look decides, not the internals" and §2 "build the design in the Lumos original … make the Figma types its variants … no "Card <Name>" next to it". The §10 test ("would it add props that do nothing in the other variants?") is applied per card, so each card adds only a few such props and passes, while the component as a whole accumulates them.
>
> **Proposed boundary** (one-file edit to SKILL.md §1–2, mirrored in lumos-rules §10):
> 1. *Look* picks between cards that show the **same content**; *content* picks the component. Cards with the same data (title, text, icon, button) are variants of Card Primary; a card with its own data set (job meta, person + score, full-bleed photo, a logo only) is its own component built from Lumos parts, as a duplicate of Card Primary with its own `card_<name>_*` classes.
> 2. Run the §10 test **cumulatively**: count the props and elements that render in fewer than half the variants. Above ~5, or above ~8 variants, split by content before adding the next variant.
> 3. A tile with one prop (logo) is not a card.
> 4. Review checklist (review skill / verify.md): div count and bytes per card variant, and "no hidden text of another variant in the HTML".
> 5. base.md: the Lumos Cover/Stacked ids may leave Card Primary with the card type that needs them; record it in decisions.
>
> HumAIn is splitting Card Primary into Card Primary / Card Opportunity / Card Expert / Card Profile / Logo Tile (plan in the client repo, `references/plans/2026-10-31-card-split.md`).

## 11. Questions for the owner

1. **Classes:** own classes per new component (recommended, §2), or reuse `card_primary_*` as proposed?
2. **26 Lumos demo cards** on Example Components (and the Opportunity card on Home): convert them 1:1 (recommended; keeps the Lumos grid and slider demos intact, no visible difference), or remove them and keep only the 18 own showcase cards?
3. **Logo:** own Logo Tile component (recommended), or just Lumos `Visual Image` in the marquee list?
4. **Tags on Card Opportunity:** keep Tag 1 / Tag 2 as text props (recommended: vacancies will probably come from the CMS, and a CMS field binds to a prop, not to slot items), or a slot per the kit rule?
5. **Title in the new components:** a plain-text Title with a fixed H3 (lumos-rules §3; converted cards then render `<h3>` without a Designer step), or rich text as in Card Primary today? Recommended: plain text, if Typography Heading allows a plain-text title on this site (checked in Phase 0).
