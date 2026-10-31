# Cards

Card family on the site (from the Figma + current Webflow build, 2026-10-29): job/opportunity cards (Opportunities list, Careers "Join the team", Opportunities/Detail "Similar opportunities"), full-bleed case/cover cards (About/Clients "Selected project work", team member photos), light service cards ("Six disciplines" on Home), testimonial cards (Home + About/Clients "Trusted by the people who hire"). Job/opportunity is the most reused, so it was built first by adapting Lumos `Card Primary` (`7941d471-12eb-22ce-6420-784e5a3b04f8`, group `Card`). Service and Discipline were added as Card Primary variants on 2026-10-30 (below); the rest of the family (Expert, Expert Match, Profile, Stat, Stage, Pricing, Logo, Opportunity Text) followed the same day as variants, Testimonial as its own component ("The remaining cards").

## 2026-10-29 — Card Primary base variant → Opportunity

Choice: the `base`/"Default" variant of Card Primary was renamed **Opportunity** and rebuilt as the job card: tags row (2 pills), title, 3 meta rows (location / experience / salary, each an icon + text), "View & apply" button. `Cover` and `Stacked` variants are untouched (still Lumos-starter placeholders) and will get their own pass for the Case/Cover and Testimonial families.

Structure added inside `card_primary_content`, before/after the existing `card_primary_header`:
- **Card Opportunity Tags** (new component, group Card, id `6f32a464-0520-ccef-d4b6-648b896c8d8f`): `card_primary_tags` > 2× `card_primary_tag` > Typography Plain. Own props `Tag 1 Text`, `Tag 2 Text` (textContent), forwarded from Card Primary.
- **Card Opportunity Meta** (new component, group Card, id `da3275c9-ad7d-fa60-485b-9d097b3dca32`): `card_primary_meta` > 3× `card_primary_meta_item` (`card_primary_meta_icon` > Icon Set instance, + Typography Plain). Own props `Location Text`, `Experience Text`, `Salary Text` (textContent), forwarded from Card Primary.
- Title: native `Heading` replaced with a **Typography Heading** instance (Variant H4, Max Width -1, Margin Bottom 0, Classes `card_primary_title`), per the cards skill's Typography rule. Card prop renamed `Heading` → `Title` (richText).
- Removed: the native `RichText` paragraph and its `Paragraph` prop (job card has no body text — replaced by the meta rows), and `Heading Tag` (level now lives in the rich text).
- Button Main's `Button Text` default changed to "View & apply" (was "Learn More").

### Props table (Card Primary, Opportunity-relevant)

| Folder | Prop | Type | Default |
|---|---|---|---|
| Content | Title | richText | "Project Controls Manager" |
| Tags | Tag 1 Text | textContent | "Permanent" |
| Tags | Tag 2 Text | textContent | "Energy" |
| Tags | Tags Visibility | boolean | true (wired 2026-10-30, see Designer-only below) |
| Meta | Location Text | textContent | "Rotterdam, NL (hybrid)" |
| Meta | Experience Text | textContent | "12+ years experience" |
| Meta | Salary Text | textContent | "€90k – 110k" |
| (existing) | Button Text, Screen Reader Text, Link, Image, Card Type, Visibility, Role, Wrapper Classes, Wrapper Style | — | unchanged except Button Text default |

Careers' internal-vacancy card (lavender bg, no tags, no salary) is the same Opportunity variant with `Tags Visibility` off and `Salary Text` emptied — not yet wired to any page instance; the two pages (`Opportunities`, `Careers`) still need the card actually placed (both are currently empty section shells in Webflow, built from Figma but with no content yet — out of scope for this pass).

## 2026-10-29 — `data_element_builder` / `data_whtml_builder` can't create elements inside a component definition

Conflict: both builder tools return "Parent element ... not found" for every `creation_position` (append/prepend/before/after) when `parent_element_id`/`scope_component_id` point inside a component's own tree, even though reading (`get_all_elements`, `query_elements`) and `insert_component_instance` / `transform_element_to_component` work fine there.
Choice: build new plain markup (divs) on a page first with `data_element_builder`, insert the needed component instances into it there (`insert_component_instance`, which does support component scope), then `transform_element_to_component` the built group into its own small component and `insert_component_instance` that into the target component. This is why the tags row and meta rows are separate components (`Card Opportunity Tags`, `Card Opportunity Meta`) instead of plain divs directly inside `Card Primary`.
Why: forced by the bug above; keep using this route for any further element-builder work inside a component this site's Webflow MCP server (`846065a5-9856-4ca3-a702-f70371370f30`).

## 2026-10-29 — `webflow-studijob` MCP connector is a different site, do not use for Humain

Conflict: two Webflow Data-API connectors are available in this session; `webflow-studijob` only has access to a site called "Studijob" (`studijob.nl`), not Humain.
Choice: always use the connector with tool-name prefix `mcp__846065a5-9856-4ca3-a702-f70371370f30__*` for Humain. Verify with `data_sites_tool > list_sites` if unsure which is which in a fresh session.

## 2026-10-30 — Designer-only finishing pass

Done in the Designer (`humain-d16f03.design.webflow.com`), signed in as `aniekvelthuizen@gmail.com` via Claude in Chrome:

- **Heading level**: Title's default rich text is now `H3` (Properties panel → Title → Edit Rich Text → select with a real mouse drag → H3 button). Per-instance titles on real pages still need the same manual step once content exists there.
- **Tags Visibility, actually wired**: added a `Visibility` boolean prop directly on `Card Opportunity Tags` (API), bound its root `card_primary_tags` div's native Visibility setting to that prop (Designer: Settings tab → Visibility's purple dot → Connect → Visibility), then bound the Tags instance's `Visibility` prop inside Card Primary to the existing `Tags Visibility` prop (API, same forwarding pattern as the text props). Confirmed in the Designer: the instance's Properties panel now shows `Visibility: Tags/Tags Visibility`. The earlier `set_visibility` API error ("Element does not support setVisibility") was specifically about instances of API-built components lacking a Visibility prop to begin with — adding the prop first and connecting it in the Designer is the fix; **this route also unblocks any further show/hide toggle on these two sub-components** (e.g. a future `Salary Visibility` on `Card Opportunity Meta`, same two-step pattern).
- **Icon colour fixed**: `card_primary_meta_icon`'s `color` was `swatch/light-200` (too faint against the white card — looked like blank dots). Changed to `swatch/dark-900-o50` (API); icons now render clearly in the Designer preview.
- Confirmed in the Designer's own live component preview (hover thumbnail + the dedicated component canvas) that the card renders correctly end to end: pills, bold H3 title, three icon rows with real icons, "View & apply" button.

**What the prop panel confusion from the last session actually was**: the new props (Title, Tags, Meta, Tags Visibility) were there all along — the Properties panel in Focused/instance mode just needed scrolling down past Button Text/Screen Reader Text/Link/Image/Card Type/Settings to reach them. Not a caching bug; no action needed.

## 2026-10-30 — Opportunity aligned with the Figma component `Card / Opportunity` (`2184:5177`)

Done by Aniek (via Claude). The first build (2026-10-29) was made from the card instances on the Opportunities page frames, not from the component set itself, and missed most of its look. Source now: Figma component set `Card / Opportunity`, variants `default` (`2070:5337`), `variant-2` = its hover (prototype ON_HOVER → `2184:5178`), `variant3`/`variant4` (body-text type + hover, see Open), `mobile` (`2382:36803`).

What changed (all on the base variant = Opportunity):
- **Surface:** `card_primary_element` background = Theme `background` (Figma binds the card to `background`, light-200), no border, padding `space/6` (24), radius `radius/small` on `card_primary_group`, `min-height: 24.0625rem` (Figma 385, fixed). Mobile (`small`): padding `space/5`, min-height auto.
- **Notch:** bottom-right cut-out 52 × 51 px with an 8 px concave corner (Figma `Subtract` = card minus a 60 × 60 r8 rectangle at 388/334). Built as a CSS `mask` on `card_primary_element` (two solid bands + one radial-gradient fillet tile), so the section background shows through. Cover and Stacked set `mask-image: none`.
- **Arrow in the notch:** new component **Card Opportunity Arrow** (`8eeda93a-039f-d99f-fe9d-75974e30d529`, group Card) inside `card_primary_group` after the element (outside the mask): `card_primary_arrow` (48 × 48, bottom-right, `aria-hidden`) › `card_primary_arrow_track` (200 % wide, starts at −100 %) › 2 × `card_primary_arrow_slot` › Icon Set `Arrow Thin`. On hover the track moves `translateX(calc(50% * --_trigger---off))`, so the arrow slides out right while the second one slides in (Figma: two arrows, the first moves out). Built on the page and transformed (builder bug above).
- **Hover:** Figma `variant-2` = linear gradient white → `#00ffd5` (= `swatch/brand-accent-500`) at ≈131°. `card_primary_visual` is now the hover veil: absolute, behind the content, `background-image: linear-gradient(131deg, #ffffff, #00ffd5)` (literal colours: gradient stops mangle `var()`), `opacity: var(--_trigger---off)`, 400 ms ease. `card_primary_image` is `display: none` in the base; Cover/Stacked set it back to `block` and the veil's gradient to `none` (Stacked also `position: relative`, opacity 1). Hover only fires when the card is clickable (Lumos `hover-if-clickable`), i.e. when Screen Reader Text is filled — since 2026-10-30 its default is empty (see "Review fixes").
- **Tags:** outlined pills — no fill, 1 px border Theme `border` (Figma `swatch/dark-900-o25`; `border` is o20 in Base and follows the theme), padding 0.125rem / `space/3`, gap `space/1`. Tag texts' Margin Bottom 0. **This replaces the 2026-10-30 pill-background choice below.**
- **Meta:** icons 2rem at full opacity in Theme `text`; rows min-height 2rem, gap `space/3`, no gap between rows; texts Typography Plain **Text Main** (was Text Small), Margin Bottom 0. Icons are the Figma ones (see `icon-set.md`): location, **school** (experience), euro. Salary default is now `90k – 110k` (the € is the icon).
- **Button:** Button Main → **Tertiary**, Icon Visibility off ("View & apply" as text, like Figma's `Button` frame with its arrow hidden). This replaced a conditional Variant binding from the Lumos starter, so Cover/Stacked now also show Tertiary.
- **Title:** stays Typography Heading H4 (30 px = Figma); Classes `card_primary_title u-text-trim-off` (Figma boxes are untrimmed); on `small` the class switches Text Style mode to **H6** (Figma mobile 20 px).
- **Spacing to Figma's text boxes:** the Tertiary button is 2rem high around an 11 px label, so the element's `padding-bottom` is 0.875rem (desktop) / `space/3` (mobile) and `card_primary_meta` has `margin-top: space/7` + `padding-bottom: 1.375rem` (mobile: `space/1` / 0 + `margin-bottom: -0.375rem`). Non-token values are deliberate: they put the label and rows on Figma's positions.

Measured on staging (card isolated at Figma width, light theme): desktop 440 × 385 — tags 27 high (Figma 26), meta rows y 205/237/269 (206/238/270), label y 349 (350), arrow 392/337 (392/337). Mobile 362 wide — height 261 (259), title 30 high at 20 px, rows y 113/145/177 (112/144/176), label y 229 (228). Hover checked by setting the trigger variable: gradient + arrow slide render as in Figma.

Deviations: the Tertiary underline also grows on card hover (Figma's hover has no underline) — keep or switch off is the owner's call. Hover gradient is fixed light, also on a dark section (Figma has no dark card). The arrow component also renders on Cover/Stacked (card variant styles do not reach a nested component; those variants are still Lumos placeholders).

## 2026-10-30 — Card surface per theme, hover without button underline

Conflict: the card used Theme `background`, which is also the section colour in every theme, so the card vanished on its section (owner screenshot: dark showcase, no card visible). Figma only places the card on white (`background-2`) sections and has no dark card.
Choice (Aniek, via Claude): two new Theme variables:
- `card/background` (`variable-2cbe1fab-61ac-e205-b2da-c31a3c789e98`): Base `swatch/light-200` (= Figma), Dark `swatch/dark-800`, Brand `swatch/brand-400` → on `card_primary_element`.
- `card/background-hover` (`variable-b8f2422c-b88a-904c-f013-e184982c69fa`): Base `swatch/brand-accent-500` (Figma mint), Dark `swatch/brand-400`, Brand `swatch/brand-300` → the veil (`card_primary_visual`) is now this colour with `mask-image: linear-gradient(131deg, transparent, #000)` instead of a literal white→mint gradient (gradient stops mangle `var()`; mint under white text is unreadable on dark).
- The card's hover no longer drives the Tertiary button's underline: `card_primary_content` sets the Trigger collection back to Base mode, so `--_trigger---off` stays 0 inside the content (the veil and the notch arrow sit outside it and still react). Owner asked for the underline to go.
Why: kit rule "a dark version is the theme"; owner wants the card visible in every theme.
Checked on staging (cards cloned into Light / Dark / Brand sections, rest + hover): Dark card `#1c2332` on `#030b1b`, Brand `#51337a` on `#250059`, white text; hover veils mint / brand-400 / brand-300; underline stays at scaleX 0.
Deviation: Base hover now fades from the card colour (light-200) instead of Figma's white at the top-left corner — barely visible. Solved the same day: Light sections are white now (`decisions/site.md` 2026-10-30 "Light sections are white"), so the light-200 card shows on them; checked on Example Components (light showcase section, white `#ffffff`, cards `#edf1f7`).

## 2026-10-30 — Card colours follow the section theme (meta icons, tag pills) — superseded above

Conflict: on a dark section (the "Card" carousel on Example Components is `u-theme-dark`) the card itself turns dark (`card_primary_element` uses `background-2`) and its text turns white, but the meta icons and tag pills had fixed swatches — icons nearly invisible, pill text white on a light pill.
Choice (Aniek, via Claude): both now use Theme variables, no fixed swatch.
- `card_primary_meta_icon`: `color` = `text` (`--_theme---text`) + `opacity: 0.6` (was `swatch/dark-900-o50`, before that `swatch/light-200`).
- `card_primary_tag`: `background-color` = `background` (`--_theme---background`; Base light-200, Dark dark-900, Brand brand-500), was the fixed `swatch/light-200`. **Not** `background-2`: that is the card's own colour, so the pill would vanish into the card.
Why: kit/site rule — a dark version is the theme, not a variant, and colours go through Theme variables (see `decisions/site.md`, "Buttons follow the theme"). In Base mode the pill is pixel-identical to before; it only changes where the card itself changes. The alternative (pill always light, text forced dark) was dropped: a light pill on a dark card is a fixed exception the theme can't reach. Figma was not re-checked for a job card on a dark section (no MCP access to the file); none of the card's known places (Opportunities, Careers, Similar opportunities) were noted as dark.
Checked on staging after publish: Dark — white on dark-900, contrast 19.7:1; Base — dark-900 on light-200, 17.4:1. Brand mode not checked (no Brand section on the page).

## 2026-10-30 — Service card = variants of Card Primary, not a new component

Done by Aniek (via Claude). Owner: "variant of the Opportunity card, then it becomes a general card — or a new component, your call."
Choice: two new variants on Card Primary — **Service** (`3b6e60b2-47c5-cd32-1a79-d647857cb88a`) and **Discipline** (`12b6b2e8-8886-3f97-ab63-4701a5d34841`). Card Primary is now the site's general card; Opportunity stays the base variant.
Why: the Figma `Card / Service` set (`2058:4302`) has the same look as Opportunity — light-200 surface, `radius/small`, the white → mint hover at the same angle, Typography texts, a Tertiary button. Kit rule: a card that looks like an existing one is a variant of Card Primary, never a copy. A separate component would duplicate the surface, hover, Clickable and Theme wiring.

Figma source and where it is used (Visual design page, `[figma-only]` frames skipped):
- `services` (`2058:4303`) + its hover `services-hover` (`2184:4813`) → **Service**: icon 48, title, muted text, hover = gradient + an arrow that slides in top-right. Used on the Components page "Content / Services" (desktop + mobile).
- `discipline` (`2710:56919`) + hover `Prop 1/Variant5` (`2710:56928`) → **Discipline**: no icon, 24 px padding, title, text, Tertiary "→ View". Used on **1. Home B** ("Content / Services desktop", 6 roles).
- `default` (`2041:11259`, glass `light-100-o25`) — Home B "4 UBRS" / "3 UBRS", Hire an expert, Values; pages override its fill per instance (glass on gradients, light-200 on white). **Not built** — see Open.
- `variant4` (`2292:33162`, step card: icon + "Day 1" pill + title + big value) — About / How it works. **Not built** — see Open.

Structure (all card-owned, so variant styles reach them; the element builder now works inside a component definition — the 2026-10-29 builder bug is gone):
```
card_primary_group
  card_primary_element
    card_primary_visual (hover veil, unchanged)
    card_primary_content
      card_primary_top    › card_primary_icon › Icon Set (Icon prop) + card_primary_badge › Typography Plain   (top row added with Step)
      card_primary_kicker › Card Opportunity Tags                    NEW wrapper, Service/Discipline: none
      card_primary_header › Typography Heading (Variant now Inherit)
      card_primary_text   › Typography Paragraph (Text Main, Max Width -1, MB 0, u-text-trim-off)   base display none
      card_primary_value  › Typography Paragraph (Value)              added with Step, base display none
      card_primary_details› Card Opportunity Meta                    NEW wrapper, Service/Discipline: none
      Button Main
  card_primary_corner (aria-hidden) › Card Opportunity Arrow         NEW wrapper, positions the arrow
  Clickable
```
- **Title size per variant:** Typography Heading → Variant **Inherit**; the Text Style mode moved to the card-owned `card_primary_header`: base H4 (small: H6, moved off `card_primary_title`), Service/Discipline H5 (24 px, also on small). One title, one prop.
- **Arrow:** `card_primary_arrow` is no longer absolute; `card_primary_corner` places it. Base: bottom-right as before. Service: `top space/7`, `right space/6`, `opacity` = Trigger `off` with a 400 ms fade (the existing track slide makes it slide in, as in Figma). Discipline, Cover, Stacked: `display: none` (closes the old "arrow on Cover/Stacked" item).
- **Service element:** `min-height auto`, padding `space/7` / `space/6` (also at small, where the base has its own values), `mask-image: none` (no notch). Content `justify-content: flex-start`; header `flex-grow 0`, `padding-top space/2` (Figma's 8 px above the title); text `flex-grow 1` so a button lands at the bottom in equal-height rows. **Discipline** = Service with padding `space/6` all round, icon and corner hidden.
- **Muted text:** `card_primary_text` `opacity: 0.5` on Theme `text` (= Figma `dark-900-o50` on Base, and follows the theme).
- **Icons:** six Figma Google icons added to Icon Set (see `icon-set.md`).

Props (Card Primary, added):

| Folder | Prop | Type | Default |
|---|---|---|---|
| Content | Text | richText | "Ready before you need them. Continuously identified, benchmarked, and assessed." |
| Visual | Icon | variant (Icon Set) | Timer — made in the Designer (purple dot › New Variant property), prop `1a7c898f-6a77-7f09-c10c-d0831732500c` |
| Visual | Icon Visibility | boolean | true (bound to `card_primary_icon` visibility) |
| Button | Button Icon Visibility | boolean | false (bound to Button Main's Icon Visibility; Opportunity keeps no icon, Discipline's "→ View" sets it true) |

The button hides itself when Button Text is empty (Lumos conditional) — a Service card without a button = empty Button Text.

Measured on staging (Example Components, new Light showcase section `c259fe8d-6316-de3e-1987-4e151741c3f9` with 3 cards; card forced to Figma's 440 px):
- Service desktop 440 × 230 (Figma 226): icon 24/32 48 × 48 (= Figma), title y 104 h 30 (Figma 104 h 26), text y 150 (146), arrow on hover 368/32 (= Figma). Hover checked: mint veil + arrow slides in.
- Discipline: title y 32 (= Figma), natural height 198 (Figma 194), "→ View" 61.6 × 32 (Figma 59 × 32).
- Mobile 402: Service 362 × 230–254, Discipline 362 × 198, padding as desktop, no horizontal scroll.
- Opportunity unchanged after the restructure: 440 × 385, tags 27, meta rows 205/237/269, arrow 392/337, title 30 px; mobile 362 × 261, title 20 px.

Deviations from Figma:
- Titles are 4 px taller per line: H5 uses the site's heading line-height 1.25, Figma's card title is 1.1 (site rule "text styles win", `site.md`).
- Discipline hover keeps the "View" button and its 24 px padding; Figma's hover frame drops the button and pads 32 (a layout jump on hover).
- The button icon is the Button Main default (chevron); Figma draws an arrow. Follows the open Button Main "Icon" prop item in `designer-queue.md`.
- During the Service arrow slide the outgoing arrow (the track's second slot) is briefly visible while the corner fades in.

## 2026-10-30 — Glass and Step: two more Card Primary variants

Done by Aniek (via Claude), on the owner's "ga door met de glass card en stap card".
Choice: **Glass** (`f468fc62-f377-72da-d066-559d6d1a8ba5`, copy of Service) and **Step** (`3be1dc22-578f-78f3-1b88-693087bd06ca`, copy of Glass). Card Primary now has Opportunity, Cover, Stacked, Service, Discipline, Glass, Step.
Why: both are types of the Figma `Card / Service` set with the same anatomy (icon, title, text) on a different surface; Step adds a pill and a large value.

Figma (instances on real pages, read for their overrides):
- `default` = glass: `swatch/light-100-o25` + background blur 40 + a faint 5-layer drop shadow, text full colour (not muted). Home B "One wrong hire costs…" (on a light gradient), About "Values" (dark, plus a white→transparent→white 1 px stroke). Home B "3 UBRS" and Hire an expert override the fill to light-200 — that is the **Service** look without a link; use Service there.
- `variant4` = step: on About / How it works every instance is glass on the dark gradient — white 20 %, the gradient stroke, blur, shadow, padding 24, white text, pill stroke white, value 36 px full white. 251 × 200.

Built:
- **Theme variables:** `card/glass` (Base `light-100-o25`, Dark/Brand `light-100-o20`), `card/shadow-1…4` (`#0000000d`, `#0000000a`, `#00000008`, `#00000003`, same in every mode).
- **Glass** element: `background-color card/glass`, `backdrop-filter: blur(20px)` (Figma blur radius 40 = CSS 20), `box-shadow` four layers on `card/shadow-1…4` (API read-back shows only the first variable; the published CSS has all four — same as the button shadow). Text opacity 1. Corner arrow hidden. `card_primary_visual` (the hover veil elsewhere) becomes the **gradient ring**: `linear-gradient(131deg, #fff, transparent 51%, #fff)`, padding 1 px, `mask-image` two solid layers with `mask-clip: content-box, border-box` + `mask-composite: exclude`, opacity 1, no transition. So Glass and Step have no hover (Figma has none).
- **Step** = Glass with padding `space/6` all round (also at small), pill and value on, body text off.
- **New parts** (all card-owned): `card_primary_top` (flex row, space-between, centred; base none, Service/Glass/Step flex) now holds `card_primary_icon` and `card_primary_badge` (pill: 26 px high, padding-x `space/3`, 1 px Theme `border`, `radius/round`; base none, Step flex) › Typography Plain (Text Small, MB 0). `card_primary_value` (after the text; base none, Step flex, grows, content at the bottom) › Typography Paragraph (Inherit, Max Width -1, MB 0, Classes `card_primary_number u-text-trim-off`). `card_primary_number` = `font-size 2.25rem`, `line-height 1` on the Onest body style — Figma's "Text X Large", which `site.md` keeps as a per-section size, not a Text Style mode. (The API refuses custom properties such as `--_text-style---font-size`; a later class beats the Lumos Inherit class.)
- **Props** (folder Step): `Badge Text` (textContent, "Day 1"), `Value` (richText, "30 min").
- **Icon Set:** +5 icons (`icon-set.md`).

Measured on staging (Example Components, Dark showcase `079f24e9-5e1c-0c3d-a08e-7797135af6fa`, 2 Glass + 2 Step):
- Glass 440 × 230 (Figma 226): icon 24/32, title y 104, text y 150 — as Service; bg `rgba(255,255,255,.2)` on Dark, blur 20 px, 4-layer shadow, ring mask `exclude`, text white.
- Step 251 × 202 (Figma 200): icon 24/24, pill 26 high at y 35 (= Figma), 57 / 77 wide (Figma 60 / 79), title y 96, value y 142 h 36 (Figma 138) in Onest 36/36.
- Mobile 402: Glass 362 × 230, Step 362 × 202, no horizontal scroll. Service, Discipline and Opportunity re-measured: unchanged.

Deviations:
- Pill border is Theme `border` (Base dark-900-o20, Dark white 20 %); Figma uses dark-900-o10 on white and solid white on dark.
- The ring shows on every Glass card; Figma's Home B glass has no stroke (on a light gradient the white ring is barely visible).
- Glass fill on Dark/Brand is white 20 % (How it works); Figma's Values card on dark keeps 25 %.
- Titles again 4 px taller per line (line-height 1.25 vs 1.1).

## 2026-10-30 — The remaining cards: nine more Card Primary variants, Card Bullet, Card Testimonial

Done by Aniek (via Claude). Owner: "kijk goed of je varianten kan maken op huidige cards; als dat niet kan, nieuw component maken."
Figma read through Claude in Chrome (Plugin API in the page; the Figma MCP View seat hit its call limit on the first call). Only frames without `[figma-only]` counted; the `Components` / `Design components` frames are library pages, the numbered frames are the real pages.

### Choice per Figma card

| Figma | Where on real pages | Webflow | Why |
|---|---|---|---|
| `Card / Opportunity` variant3/4 (body text) | 14. Careers (internal vacancy) | Card Primary **Opportunity Text** (`593e63f3-eb70-0fa5-9361-ced74b61a8ae`) | Same card as Opportunity; meta rows move up and a body text appears — a layout the editor picks. |
| `Card / Expert` (`2188:5829`) + hover | 1. Home B header | Card Primary **Expert** (`1aaef925-4e08-358f-77f8-023e87a986b7`) | Same surface, notch, arrow and mint hover as Opportunity. |
| `Card / Expert match` default (`2032:406`) | 2. Hire an expert (dark, 440 × 114) | Card Primary **Expert Match** (`f38e2c4b-dfef-de93-5f7f-2ceac5b25942`) | Horizontal photo card; uses Image, Title, Subtitle, Logo, Value — no props that only it would use. |
| `Card / Expert match` variant5 + hover variant6 | 1. Home B header (glass, 322 × 128) | Card Primary **Expert Match Glass** (`db14855c-5ff9-72f6-d763-5fa81cf9ca36`) | Glass look of the same card. variant-2/variant3 (80 high) and `mobile` only occur on the Components frame — not built. |
| `Card / Profile` role / person / case (`2292:8774`) | 5. Project-controls (role), 6. About Us team (person), 7. Clients "Selected project work" (case, 440 × 459) | Card Primary **Profile Role** (`51efa20c-…`, was Lumos *Cover*), **Profile Person** (`da648fa9-…`, was Lumos *Stacked*), **Profile Case** (`4f9f3e39-1bc1-9449-3a9f-0e6731f0b940`) | Full-bleed photo cards — what Lumos' Cover/Stacked were for, so their ids are reused (kit base.md step 3). The case card is the "cover/case card"; the team photos are Profile Person. |
| `Card / Stat` (`2236:4871`) | 2. Hire an expert, 6. About Us | Card Primary **Stat** (`1955d209-3754-0beb-0aff-0aa281947bd3`) | Title + text only; no new props. |
| `Card / Process stage` (`2256:11517`) | 3. Hire Project Delivery Experts (assessment + grid), 4. Consulting-services, 5. Project-controls | Card Primary **Stage** (`ac964b19-9c2a-86e8-bae8-4aa1fb724559`) | Step's anatomy (icon + pill + title + text) on white, plus a stage label and a checklist. Figma's booleans map onto Badge Visibility, Subtitle Visibility, List Visibility. |
| `Content / Pricing card` default (`2066:5015`) | 2. Hire an expert, 9. About Us / Rates | Card Primary **Pricing** (`e456e423-cfdc-f648-97ad-b114e2932acd`) | Glass surface + pill + value + checklist + button — all parts Card Primary has. variant-2 (wide row) only on Components/Design components — not built. |
| `Card - Logo` (`2041:5693`) | 1. Home B, 7. Clients, 8. How it works (logo marquee) | Card Primary **Logo** (`3e46987f-7db5-1e2f-ccf8-a2e7b7bcbfcf`) | Just the Image prop in a 100 px tile. The Figma "Arrow icon" in the tile is hidden. |
| `Testimonial 1` (`2063:4554`) | 1. Home B, 2. Hire an expert, 7. Clients ("Trusted by the people who hire") | **Card Testimonial** (new component `19e313dd-1063-d30b-cbb7-8f61fb4704e1`, group Card) | Own data (quote, rating, avatar, name, role, company): as a variant it would add six props that do nothing in every other variant — lumos-rules §10 exception. Built from Lumos parts (Typography, Icon Set, Clickable). |
| `quote` (`2710:56905`) | — | not a card | A blockquote with a left rule; belongs to rich text, not the card family. |

Card Primary now has 16 variants: Opportunity, Opportunity Text, Expert, Expert Match, Expert Match Glass, Profile Role, Profile Person, Profile Case, Service, Discipline, Glass, Step, Stage, Stat, Pricing, Logo.

### Structure added to Card Primary (all card-owned, so variant styles reach them)

```
card_primary_content
  card_primary_top › icon + card_primary_badge      (badge Typography Plain now Inherit; size = Text Style mode on the badge, base Text Small)
  card_primary_eyebrow › Typography Plain (Subtitle)  NEW — Stage: label above the title
  card_primary_kicker / card_primary_header
  card_primary_subtitle › Typography Plain (Subtitle) NEW — Expert, Expert Match, Profile Person: below the title
  card_primary_logo › Image (Logo, Logo Alt)          NEW
  card_primary_text › Typography Paragraph            Paragraph now Inherit; card_primary_text carries the mode (base = Text Main)
  card_primary_list                                   NEW — Stage, Expert, Pricing
    card_primary_list_title › Typography Plain (List Title)
    card_primary_items › slot "Items" (u-display-contents) for Card Bullet
  card_primary_value › card_primary_value_label (Value Label) + Paragraph (Value)
  card_primary_details › Card Opportunity Meta
  card_primary_button (display: contents) › Button Main Tertiary   NEW wrapper so a variant can hide it
  card_primary_action › Button Main (Primary)         NEW — Pricing
```
- **Value size moved to the wrapper:** `card_primary_number` is now `font-size/line-height/font-weight: inherit`, `width: auto`, `min-width: 0`; `card_primary_value` carries `2.25rem / 1` (Step unchanged) and each variant sets its own (Expert 1.5rem semibold green, Pricing 3rem Vend Sans bold via the H2 mode).
- **Trigger reset moved:** the Base Trigger mode that kept the Tertiary underline still on card hover now sits on `card_primary_button` and `card_primary_action` instead of `card_primary_content`, so content parts (the glass logo) can react to the card hover. Checked on staging: published CSS has the reset on the button wrapper.
- **New swatch** `swatch/brand-accent-700` = `#00806b` (Figma's raw green of the match score).
- Salary row: new prop `Salary Visibility` on Card Opportunity Meta (bound to the third row), forwarded from Card Primary (folder Meta).

### Props added to Card Primary

| Folder | Prop | Type | Default |
|---|---|---|---|
| Content | Subtitle | textContent | "Previously worked at" |
| Content | Subtitle Visibility | boolean | true (both subtitle wrappers) |
| Visual | Logo · Logo Alt | image · altText | – · "Google" |
| Badge | Badge Text (moved from Step) · Badge Visibility | text · boolean | "Day 1" · true |
| List | List Title · List Visibility | text · boolean | "Assessed" · true |
| Value | Value (moved from Step) · Value Label | richText · text | "30 min" · "Match score" |
| Meta | Salary Visibility | boolean | true |
| (slot) | Items | slot of Card Bullet | empty (Webflow has no default slot content) |

**Card Bullet** (`c362b655-eec3-8fb0-cab5-12d5426df53e`): `card_bullet` › `card_bullet_icon` (Icon Set Check, 19 px) + `card_bullet_text.u-text-trim-off` › Typography Plain (Text Small). Prop `Text` (Content). Built by filling a blank component with the element builder (`create_blank_component` + builder on the component root, then `set_style` on the root) — `transform_element_to_component` cannot reach elements inside a component.

**Card Testimonial** props: Content `Quote` (rich text) · Visual `Rating Visibility` · Person `Avatar`, `Avatar Alt`, `Name`, `Role`, `Company` · Link `Link`, `Screen Reader Text`. Hover: the arrow circle nudges 0.25 rem on the Lumos trigger (site button language); the whole card is the Clickable.

### Variant notes
- **Opportunity Text:** kicker/header `order -2`, details `order -1`, text visible at full colour with `margin-top -0.875rem` (meta keeps its own 22 px bottom padding). Salary row off per instance.
- **Expert:** white (`background-2`), notch/arrow/mint hover from the base, title H6, subtitle/value label Label, list gap 0. Button Text must be empty on instances (the Tertiary hides itself).
- **Expert Match:** Theme Dark on the element, surface `card/background`, row layout, `card_primary_visual` becomes the 78 × 98 photo with the small notch (same mask recipe as the base, 19 × 22 cut, r6), logo white by `filter`, title Text Medium. **Expert Match Glass:** Glass surface, 77 × 96 photo, padding 16; hover sits on `card_primary_group` (the Clickable is a sibling over the element, so `element:hover` never fires): group Theme Dark → Base on `:hover`, group background white under the glass, `color` re-declared on the group; logo `brightness(0) invert(var(--_trigger---on))`.
- **Profile Role/Person/Case:** Theme Dark, `min-height 28.6875rem` (459), padding on the content, which also carries the gradient (`180deg`, Figma transform = top→bottom): Role `#250059`, Person/Case `#000` (literal: gradient stops mangle `var()`). Image `object-fit: cover`; Lumos' hover zoom on the image kept. Case shows the pill (Label, white 20 % border).
- **Stat:** transparent, centred, title H2 in Theme `heading-accent`, text Text Large at 50 %.
- **Stage:** `background-2`, padding `space/5`, pill/eyebrow/list title Label, list with a 1 px Theme `border` top rule.
- **Pricing:** from Glass; pill becomes the filled "Most chosen" label (brand-500, white, r4) absolutely above the card; title H4; content gap `space/8`; value row H2 3rem + Text Small suffix; Tertiary hidden, Primary shown.
- **Logo:** element transparent, 6.25 rem high, image `contain`, content hidden.

### Measured on staging (Example Components, new Light section `2efec565-0c4a-c84e-d6e7-82643866a748` and Dark section `5afdc06c-6a19-ae87-718f-3d8b795beaf6`; 1512 wide, cards 440)
- Opportunity Text: meta rows y 190 / 222 (= Figma), text y 278 (= Figma), label y 350 (= Figma), height 385–388.
- Expert: title 24, subtitle 62, logo 96 (Figma 86), bullets 136 (126), value 215 (199); hover = mint veil + arrow slide (real mouse hover).
- Stage: top 20, pill 36 high (Figma 34), stage label y 84, title y 118 (= Figma), bullets 21 + 4 gap (Figma 19 + 4).
- Stat: title 48 px (mobile 30), caption 20 px at 50 %.
- Profile: text ends 32 above the bottom (= Figma), title H5 24 px, white on the gradient.
- Expert Match Glass: photo 77 × 96 at 16/16 (= Figma), height 128 at 402 (= Figma); hover → white, title `#030b1b`, logo `invert(0)`.
- Pricing: label "Most chosen" y −30, 145 × 44 (= Figma), title y 24 h 38 (= Figma), price y 110 (= Figma), suffix x 129 (Figma 130), button y 317 (Figma 297).
- Testimonial: quote mark 32/32 55 × 43, stars 339/62 69 × 13, text y 99 — all = Figma.
- 402: no horizontal scroll; widths 362; Expert Match 145, Glass 128, Logo 100, Stat 148.
- Unchanged: Opportunity 385 (tags 27, meta 205/237/269, label 349, arrow 337; mobile 261), Service 230 (mobile 254), Discipline 198, Glass 230, Step 202 (pill 57 × 26 at 35, value y 142).

### Deviations from Figma
- Text sizes the site has no style for: subtitle and "Match score" 10 px Light → Label 12 px uppercase; Expert/Expert Match name Onest SemiBold 16–20 → H6 (Vend Sans) on Expert, Text Medium (regular) on Expert Match. The heading weight comes from the Text Style mode, and the title class is shared by all variants.
- Profile Person job title is regular, not SemiBold (same reason).
- Stat colour is Theme `heading-accent` (`#1e0047`), Figma `brand-500` (`#250059`).
- Stage rule is Theme `border` (o20), Figma o10. Highlighted stage cards (mint or brand gradient on one card in a row) are not a variant — not built.
- Pricing price box is 48 high (Figma 34), so the list and button sit 14–20 px lower.
- Expert Match Glass has no gradient stroke (the ring lives on `card_primary_visual`, which is the photo here). Its hover is CSS `:hover` on the group, not Lumos "hover-if-clickable".
- Not built: Expert Match variant-2/variant3/`mobile`, Pricing variant-2 — they only appear on the Components frames.
- Lumos Example Components still has old Cover/Stacked instances; they now render as Profile Role/Person.

## 2026-10-30 — Review fixes (owner picked 1–16 and answered 17–24)

Done by Aniek (via Claude), after the four-reviewer pass (`references/audit/2026-10-30-cards.md`).

- **Clickable only when meant to be:** Card Primary `Screen Reader Text` default is now empty (tooltip: fill it with the Link to make the card clickable). Lumos hides the Clickable when it is empty, so link-less cards (Stage, Stat, Profile, Logo, Expert Match) get no pointer, no Tab stop and no "Learn More", and `hover-if-clickable` no longer fires. Showcase cards that are links in Figma got a real Link and a text that matches the card ("View & apply: …", "View expert profile: …").
- **Button per variant:** `card_primary_button` is `display: none` in Expert, Expert Match (+Glass), Profile ×3, Stat, Stage and Logo (no button in Figma). Opportunity, Opportunity Text, Service, Discipline, Glass, Step keep it (empty Button Text still hides it).
- **Logo:** new `Logo Visibility` (Visual, default off) on the logo wrapper. The image prop's fallback is a broken URL (`/webflow-prod-assets/…`, 403) that every card requested hidden; a hidden element is not rendered, so the request is gone. Expert cards: turn it on and pick the logo. Re-picking the prop default in the Designer was blocked by Webflow's bot check in Chrome.
- **Logo colour from the theme:** new Theme number `card/logo-invert` (Base 0, Dark/Brand 1); Expert Match and Glass logos use `brightness(0) invert(var)`. So the logo is white on dark and dark on white, also after a click or on keyboard focus.
- **Expert Match Glass:** hover **and** `:focus-within` on the group switch to Base + white; photo `grayscale(var(--_trigger---on))` — black-and-white at rest, colour on hover (owner: as Figma). Radius `radius/medium`.
- **Theme accent:** new Theme colour `card/accent` (Base `brand-accent-700` #00806b, Dark/Brand `brand-accent-500`) for the Expert match score.
- **Smaller unit:** new `card_primary_unit` › Typography Paragraph (Value Unit, rich text, folder Value, default "%"), shown only in Expert at 16 px (owner: as Figma). Expert Value is "85".
- **Subtitle default** "Job title" (owner); Expert and Expert Match instances fill "Previously worked at".
- **Layout:** Pricing group `margin-top 1.875rem` (room for the label when cards stack); Expert Match, Glass expert and Logo `card_primary_wrap` `height auto`, `align-self flex-start` (no stretching in a mixed row); Profile Person/Case lost the Lumos Stacked `radius 0` and got Theme `background` as surface.
- **Testimonial:** arrow `align-self: flex-end`, border width `border-width/thick`; role in its own `card_testimonial_role` (opacity .5, Text Small) instead of an inline style; screen-reader text "Rated 5 out of 5" (`u-sr-only`); `Avatar Alt` default empty (decorative, name is next to it).
- **Tidy:** bullet and Stage list gaps `space/1`, Pricing pill padding `space/3`, value label `space/1`, ring padding `border-width/main`; dead overrides removed (Stage ring, Logo header/text/kicker/details/icon, Person/Case subtitle weight); Pricing price size and weight now read the H2 text style variables (fluid). The ring's `#fff` stays literal for the same reason as the gradients (stops mangle `var()`).
- **Owner kept:** Lumos balanced wrapping on titles (17); Expert Match offsets from the 12 px labels (19); company not in capitals (20); testimonial name on two lines on a phone (21); Opportunity Text 3 px lower (23).
- **Image:** same fix as the logo — new `Image Visibility` (Visual, default off) on `card_primary_image`; Lumos' Image fallback (`placeholder.60f9b1840c.svg`) returns 403 and showed a broken-image icon on Profile cards without a photo. Turn it on for Profile, Expert Match and Logo cards and pick the image. After publish: 0 placeholders and 0 broken logo URLs in the page HTML, 6 intended images.
- **After the fresh re-check** (two reviewers, both confirmed every fixed item): Expert value row `align-items: baseline` so "85" and "%" share a baseline; "Match score" label `width: min-content` (was 2.625rem, the text spilled out; now 48 px box, 8 px to "85"); Glass expert photo uses Theme number `card/photo-grayscale` (Base 0, Dark/Brand 1) so it is colour whenever the card is white — also after a mouse click, which `--_trigger---on` missed; dead corner positioning removed from Expert Match, Glass expert, Pricing, Logo, Stage. Recorded, not changed: Expert subtitle `margin-top -0.5rem` (pulls the 8 px Figma gap out of the 16 px content gap) and value sizes 1.5rem / 1rem.
- **Not ours to fix:** the published CSS carries 472 placeholders for deleted trim variables (`--_text-style---trim-top\<deleted|…\>`). No style references them (API query); Webflow writes them itself. Harmless (invalid custom-property names).

Measured on staging after the fixes: Pricing label 20 px clear of the card above at 402; 0 requests to the broken logo URL (3 Google logos on the Expert cards); 11 clickable cards = the 11 with a link; no "View & apply" on the nine button-less variants; Person radius 8 px, Case surface `#030b1b`; heights unchanged (Opportunity 385, Service 230, Discipline 198, Glass 230, Step 202, Opportunity Text 388, Expert 275, Stage 420, Stat 170, Expert Match 145, Glass expert 322 × 128, Pricing 389, Logo 178 × 100, Profiles 459); Glass expert focus/after click: white, title `#030b1b`, logo `invert(0)`; Expert "85" 24 px + "%" 16 px, both `#00806b`; testimonial arrow bottom = company bottom (427).

## 2026-10-30 — No link, no arrow (owner)
Owner (Aniek): a card without a link must not show the arrow either — it looks clickable while it is not.
Choice (Aniek, via Claude, in the Designer): one rule for "clickable" everywhere, as native visibility conditions: **`Screen Reader Text is set AND Link is set`**. Lumos' own Clickable only checked Screen Reader Text; the arrow first checked only Link — so they could disagree. Now they cannot.
- Card Primary: Clickable, `card_primary_corner` (notch + arrow), and the Button Main in `card_primary_button` ("View & apply", also `Button Text is set`). `card_primary_button` is `display: contents`, so nothing is left behind. `card_primary_action` (Expert/Pricing CTA) untouched.
- Card Testimonial: Clickable (was always on, even with link `#`) and `card_testimonial_arrow`.
Checked on staging (Example Components): 15 Opportunity cards without link render no corner and no button; every linked card still does; Opportunity height unchanged (385). The API does not show conditions on a plain div (`visibility: true` in the read-back) — check the published HTML instead.

## 2026-10-30 — "Is set" conditions, Experience Icon, image defaults
Done by Aniek (via Claude, Designer in Chrome).
- **Is set:** Card Primary Subtitle / Logo / Badge = toggle `is true AND … is set`; List Title, Value Label = `… is set`. Card Testimonial quote (`card_testimonial_text`), avatar, name (on its Typography instance, so the role inside the name wrapper stays), role, company = `… is set`.
- **Experience Icon:** Card Opportunity Meta row 2 Icon Set → new variant prop **Experience Icon** (Meta, default School), forwarded as Card Primary **Meta › Experience Icon** (`de8b16e6-d1a2-dcf0-1d12-c90099a55035`). Opportunity Text showcase = CV Submission, as in Figma.
- **Image defaults:** Webflow image props cannot be empty, and Lumos' placeholder returns 403 on staging. New neutral placeholders in the site's assets: `placeholder-logo.svg` (`6ae4bc6bd93dc05bdfe57242`, 160 × 48) as Logo default, `placeholder-image.svg` (`6ae4bc6b1f1aec66ee2fc7a0`, 400 × 400) as Image default. With Logo Visibility on and no logo picked the card now shows a grey placeholder instead of a broken image.
Checked on staging: all 44 showcase cards render the same parts as before; Opportunity Text row 2 = `cv-submission`; placeholders 200. Not tested: a card with an empty text (the showcase has none).

## Open — still not done

- ~~**Opportunity Text second-row icon**~~ — done 2026-10-30 (Experience Icon prop), see above.
- **Stage icons:** real pages use 21 different Google icons on the stage cards (manage-accounts, analytics, schema, …); only those already in the Icon Set are available. Add per page when the pages are built (recipe in `icon-set.md`).
- ~~**"is set" conditions** for the new parts~~ — done 2026-10-30 in the Designer (Subtitle, Logo, List Title, Value Label, Badge; toggles combined with `AND … is set`), see designer-queue Done. Card Testimonial texts done the same day. Older texts (Title, Tags, Meta) and the Title H3 level done 2026-10-31, see "Props tidy-up".

- ~~**Icon per card**~~ — done 2026-10-30 in the Designer (Claude in Chrome): Icon Set Variant → new Card Primary prop **Icon** (Visual, default Timer); Icon Visibility moved after it via a temporary folder. Checked on staging: the Permanent showcase card renders `icon-person-shield.svg`.
- ~~**Glass and Step types**~~ — done 2026-10-30, see "Glass and Step" above.

- ~~**Body-text type**~~ — done 2026-10-30 as the variant Opportunity Text (see "The remaining cards"); only its second-row icon is still open.
- ~~**Arrow on Cover/Stacked**~~ — done 2026-10-30: `card_primary_corner` is `display: none` on Cover and Stacked.

- ~~**Variant prop rename**~~ — done 2026-10-31: Properties panel › click the prop › Property settings › Name (see "Props tidy-up").
- ~~**Prop folder order**~~ — done 2026-10-31 (see "Props tidy-up").
- ~~**Native "is set" conditions** on Title, Tag 1/2, Location/Experience/Salary~~ — done 2026-10-31 (see "Props tidy-up").
- **Showcase titles:** 17 of the 44 cards on Example Components have their own Title text, which the API stored as a paragraph; they stay `<p>` (same size and weight, the variant sets it). Real pages get the heading level per instance when their content goes in (Properties › Title › Edit Rich Text › H3).
- **Placing the cards:** the cards are only on Example Components. Opportunities and Careers are still empty sections; placing the cards there with real content is part of building those pages, not of the cards.

## 2026-10-31 — Props tidy-up (Aniek Velthuizen, via Claude)

Finishes the open Designer items on Card Primary and its two sub-components.

- **Folders (API, `update_prop`):** Link and Screen Reader Text → folder **Link**; Button Text → **Button** (Button Icon Visibility moved out and back so it follows); Image → **Visual** (Image Visibility out and back so it follows Image).
- **Folder order (Designer, `moveFolder`):** Variant → Content → Visual → Tags → Meta → List → Value → Badge → Button → Link → Settings. Slot **Items** moved into List (List Title, Items, List Visibility).
- **Names (Designer, Property settings › Name):** variant prop `Card Type` → **Variant**; the Clickable's attributes prop `Clickable Attributes` → **Link Attributes**, in Link after Screen Reader Text.
- **"is set" (Designer):** Card Opportunity Tags: each pill `Tag N Text is set` (the row keeps its Tags Visibility toggle; with both tags empty, turn the toggle off). Card Opportunity Meta: Location row `Location Text is set`, Experience row `Experience Text is set`, Salary row `Salary Visibility = true AND Salary Text is set`. Card Primary: `card_primary_header` `Title is set`.
- **Title level:** the Title default rich text is H3 again (it had become a paragraph after the Typography Heading swap). Instances without their own title render `<h3>`; 17 showcase cards with their own title stay `<p>` (see Open).

Read back: `get_component` (names, folders); Designer panel order; staging Example Components after publishing: 44 cards, 44 headers, 88 tags, 131 meta rows (the one card with Salary Visibility off), 27 `<h3>` titles; H3 and P titles have the same size per variant.

## 2026-10-31 — Split Card Primary by content (owner OK, pilot built)
Done by Aniek Velthuizen (via Claude). Plan: `references/plans/2026-10-31-card-split.md`. Nothing on the site has changed yet.
Conflict: kit rule "a card that looks like an existing one is a variant of Card Primary" against what 16 variants / 37 props did on this site. An editor sees every prop on every card (Webflow cannot hide a prop per variant). Every card renders every part hidden (Logo tile 41 divs, ~4.7 kB; hidden job text in the HTML of Logo, Stat and Profile cards). Every new part has to be hidden in 15 variants.
Choice (proposed): split by **content**, not look. **Card Primary** keeps the content cards (Service as new base, Discipline, Glass, Step, Stage, Stat, Pricing). New: **Card Opportunity** (Default, With Text), **Card Expert** (Expert, Match, Match Glass), **Card Profile** (Role, Person, Case) and **Logo Tile** (not a card). Card Testimonial is unchanged. Each new component gets its **own `card_<name>_*` classes**, because variant styles are bound to Card Primary's variant ids and the base class styles are the Opportunity look. Shared parts are shared as components: Card Opportunity Arrow → **Card Arrow**, Card Bullet, Typography, Button Main, Clickable.
Why: the owner agreed to split; it is cheapest now, while the cards only sit on Example Components (35 instances move, 10 stay; Opportunities and Careers are still empty).
Consequence: the Lumos Cover/Stacked variant ids (Profile Role/Person) leave Card Primary; base.md step 3 ("keep the ids") then no longer applies to this site.
Owner OK on 2026-10-31 ("Ja, begin met de proef"); the recommended answers apply unless the owner says otherwise: own classes, convert the Lumos demo cards 1:1, Logo Tile, Tag 1/Tag 2 as props. Plain-text H3 title: not possible, Lumos Typography Heading only has a rich-text Text prop, so titles stay rich text.

## 2026-10-31 — Pilot: Card Opportunity (Aniek Velthuizen, via Claude)
Built from the plan (`references/plans/2026-10-31-card-split.md`, Phase 0–1). Backup first: Webflow manual backup "Before Card Primary split (Aniek, 2026-10-31)".

- **Card Arrow:** Card Opportunity Arrow renamed **Card Arrow** (`8eeda93a-…`), classes `card_primary_arrow*` → `card_arrow`, `card_arrow_track`, `card_arrow_slot`. Card Opportunity Tags / Meta classes → `card_opportunity_tags`, `card_opportunity_tag`, `card_opportunity_meta`, `_meta_item`, `_meta_icon` (`rename_style`, styles and variant styles kept; no embed or script used the old names).
- **Card Opportunity** (`9e022a92-8dba-f049-6681-751c71576c94`, group Card): `duplicate_component` of Card Primary. A duplicate keeps every variant (new ids) with its variant styles, every prop id except the variant prop, the wrap's conditional Wrapper Classes/Style bindings, the Clickable condition and the "is set" conditions (checked: Designer Navigator shows the condition icon on wrap, header, corner, Clickable). Variants: **Default** (base) and **With Text** (`5d8d09ee-c33f-4278-df66-10cc3eff9b38`); the other 14 deleted. Removed parts: image, top (icon + badge), eyebrow, subtitle, logo, list, value, action; 16 props removed.
- **Own classes** `card_opportunity_wrap / _group / _element / _visual / _content / _kicker / _header / _title / _text / _details / _button / _corner`: base styles copied 1:1 from the `card_primary_*` base (= Opportunity) incl. the small breakpoint, Text Style modes on the header (H4, small H6), Base Text Style on the text, Trigger Base on the button wrapper. With Text = the old Opportunity Text overrides (text shown at full colour, margin-top −0.875 rem / small 0.5 rem; kicker and header order −2; details order −1, margin-top auto).
- **Props:** Content Title · Text (default now **empty**, tooltip "Only shown in the With Text variant"; Designer condition `Text is set` on `card_opportunity_text`) · Tags · Meta (Location Text, Experience Icon, Experience Text, Salary Text, Salary Visibility) · Button · Link · Settings. Title stays rich text (Typography Heading has no plain-text prop).
- **Showcase:** two Card Opportunity cards in the Light showcase grid on Example Components, after the old Opportunity Text card: With Text (`89dadd04-…`, same content as the old one) and Default (`ea28f453-…`, link /opportunities). The old Card Primary cards are untouched until the owner has seen the pilot.

Measured on staging (`references/card-check.mjs` + `card-diff.mjs`, before-run in `references/audit/2026-10-31-card-split/`):
- 402: old and new identical within 1 px (Opportunity Text 362 × 331, Default 362 × 261), same colours, mask, type; hover identical.
- 1512: every part identical except the bottom row, which moves by exactly the difference in grid-row height (old card stretched to 420 in a row with Expert/Stage, new 388); no style difference at rest or on hover.
- HTML: 83 → 45–50 elements, 58 → 34–37 divs, 5.8 → 3.7–3.9 kB per card; no hidden badge, subtitle, list, value or Service text; `card_opportunity_text` only rendered in With Text.
- No horizontal scroll at 402; no console errors.

Still open (Designer): remove the leftover **Icon** variant prop (API refuses variant props); folder order (Settings is before Button and Link) — the instance Properties panel no longer has draggable folders, route not found yet.

## 2026-10-31 — Card Expert, Card Profile, Logo Tile (Aniek Velthuizen, via Claude)
Owner: "ga door" after the pilot. Same route as Card Opportunity: `duplicate_component` of Card Primary, strip, own classes, then the variants as differences from the new base. Every base = Card Primary base ⊕ the old variant's overrides (read per class with `get_variant_styles`, main + small + group `:hover` / `:focus-within`, plus variable modes). Multi-layer values the API reads back as one variable (glass `box-shadow`, logo `filter: brightness(0) invert(…)`, photo `filter: grayscale(…)`) were taken from the published CSS and written with the `@var_variable-<id>` notation.

- **Card Expert** (`556be8db-5b29-ab90-a7ce-f47005d8a955`): variants **Expert** (base), **Match** (`2233ab62-aeec-e972-9021-96a1058c50e8`), **Match Glass** (`…50eb`). Classes `card_expert_wrap / _group / _element / _visual / _image / _content / _header / _title / _subtitle / _logo / _logo_image / _list / _items / _value / _value_label / _number / _unit / _corner`. Match: Theme Dark mode on the element, row layout, the visual is the 78 × 98 photo with the small notch. Match Glass: Theme Dark on the group, Base + white on `:hover` / `:focus-within`, 4-layer shadow, blur 20 px, greyscale photo via `card/photo-grayscale`. Props: Content Name · Subtitle · Subtitle Visibility — Visual Logo · Logo Alt · Logo Visibility · Photo · Photo Visibility — List Items (slot) · List Visibility — Score Label · Score · Unit — Link — Settings. The list title was never shown in any expert variant, so element and prop are gone. The score label is called **Label** in folder Score: the API reports a hidden "Score Label" in that folder (a batched rename landed on the wrong prop first; repaired one prop per call).
- **Card Profile** (`0eb4cd7e-80c2-6878-378e-46b45377d95c`): variants **Role** (base), **Person** (`4be18b62-0688-b93d-ef69-1e3a6cf39273`), **Case** (`…39274`). Classes `card_profile_wrap / _group / _element / _visual / _image / _content / _top / _badge / _header / _title / _subtitle / _text`. Theme Dark mode on the element, purple gradient on Role, black on Person/Case, Lumos image zoom kept. Props: Content Title · Text · Subtitle · Subtitle Visibility — Visual Image · Image Visibility (default now **on**) — Badge Text · Badge Visibility — Link — Settings. Subtitle and Badge Text default **empty**, so a Role card renders no hidden "Job title" or "Energy".
- **Logo Tile** (`02beedee-77ce-5dbb-e35a-b44e97950375`, group Visual): built fresh, `logo_tile_wrap` (6.25 rem high, radius small, clip) › image `logo_tile_image` (contain). Props Logo (default `placeholder-logo.svg`) · Logo Alt (default "Client logo"), bound with `set_settings` (assetId, altText).
- **Showcase:** new cards placed after the old ones: Light grid (`f4c6e8bf-…`): Expert, Profile Role, Profile Person; Dark grid (`884b0ed0-…`): Match, Match Glass, Logo Tile, Profile Case. Old cards untouched.

Measured on staging (`card-check.mjs` + pairing script, 1512 and 402, rest and hover): Expert Match 145, Match Glass 128, Profiles 459, Logo 100 high — every part and style within 1 px of the old card; Expert at 1512 only differs by the grid-row stretch (old row 420, new 388), at 402 identical. HTML per card: Logo 66 → 2 elements (4.7 kB → 0.2 kB), Profile 66 → 19 (5.1 → 1.2–1.6 kB), Expert Match 68 → 29, Match Glass 77 → 38, Expert 94 → 55. Remaining hidden text: "%" on Match and "Match score 85 %" on Match Glass (same family, real data). No horizontal scroll at 402, no console errors.

Still open (Designer): leftover variant props Icon and Experience Icon on Card Expert and Card Profile (API refuses); Card Expert Name default lost its H3 (set via API → paragraph); folder order on all three.

## 2026-10-31 — Phase 3: old cards converted (Aniek Velthuizen, via Claude)
Owner: "Ja, fase 3". All 34 Card Primary instances that belong to another component are replaced on Example Components; the 10 content cards (Service ×2, Discipline, Glass ×2, Step ×2, Stage, Stat, Pricing) stay on Card Primary.
- **Lumos demo cards, 1:1** (owner answer to question 2): 12 slider cards (two Lumos Sliders, Content slot) and 3 + 4 grid cards → Card Opportunity Default; 5 + 2 → Card Profile Person / Role. Carried over: Role off, Wrapper Classes `u-row-span-2` / `u-column-span-2`, Link + Screen Reader Text on the four linked cards. To keep them identical, the demo Profiles carry the old Card Primary defaults explicitly (Text "Ready before you need them…", Subtitle "Job title", Image Visibility off).
- **Showcase cards:** the new cards placed in phase 1–2 stay; the old Opportunity Text, Expert, Profile Role/Person/Case, Expert Match, Expert Match Glass and Logo are removed, plus the extra Default comparison card. The API cannot place an instance before another instance in a slot (`move_element` / `insert_component_instance` refuse an instance as anchor), so the order inside the Light grid (`f4c6e8bf-…`) and Dark grid (`884b0ed0-…`) changed: Light = Stage, Stat, Opportunity With Text, Expert, Role, Person; Dark = Pricing, Testimonial, Match, Match Glass, Logo, Case. Reordering is a Designer drag if wanted.
- **Home:** the Card Primary instance there sat directly in the body after `page_wrap` (below the footer, outside any section) — removed, not converted. Re-add from Card Opportunity if it was meant to be there.
- **Counts:** Card Primary 17 (10 on the page; the same 7 unexplained as before — not on any page or in any container definition), Card Opportunity 20, Card Profile 10, Card Expert 3, Logo Tile 1.

Measured on staging against this morning's baseline (`references/audit/2026-10-31-card-split/after-phase3-cards-*.json`, pairing by parts, text and size): **402: 44 of 45 cards identical within 1 px** (Logo Tile only lost its wrappers, logo box identical). **1512: 41 identical**; Logo Tile as above; Expert, a Profile Role and the Testimonial only differ in height because their grid row changed with the new order. Totals for the 45 cards: 3243 → 1792 elements, 2137 → 1226 divs, 225 → 131 kB. Hidden job text ("Rotterdam, NL (hybrid)" etc.) is now only in the 10 content cards that still sit on Card Primary — that goes in phase 4.

## 2026-10-31 — Phase 4: Card Primary slimmed down to the content card (Aniek Velthuizen, via Claude)
Plan `references/plans/2026-10-31-card-split.md` §3.1 / §6 phase 4. Backup first: Webflow manual backup "Before Card Primary phase 4 (Aniek, 2026-10-31)"; baseline of all 45 cards in `references/audit/2026-10-31-card-split/before-phase4/` (with the published CSS, HTML and a CSS model of every `card_primary_*` rule).

- **Rebase to Service.** The base classes were the Opportunity look. New base = old base ⊕ Service; per remaining variant the override = (old base ⊕ variant) minus the new base, computed by a script from the published CSS (cascade per breakpoint: variant small > base small > variant main > base main; `:where(.w-variant)` has the base's specificity) and written with the API. Base now: element padding `space/7 space/6` on every breakpoint, no min-height, no notch mask (the mask props and the small-breakpoint padding/min-height are removed, not set to `none`/`auto`); top and icon `flex`; header `padding-top space/2`, no `flex` (= initial), Text Style **H5** on all breakpoints (the small H6 mode is gone); text `flex` + `flex-grow 1`; content `justify-content flex-start`; corner top-right (`space/7` / `space/6`, opacity Trigger `off`, 400 ms) instead of bottom-right.
- **Variants now** (only what differs from Service): **Discipline** padding-y `space/6`, top/icon/corner none. **Glass** glass surface, ring on the visual, text opacity 1, corner none. **Step** = Glass + padding-y `space/6`, badge and value on, text off. **Stage** padding `space/5`, `background-2`, header `padding-top 0`, eyebrow/badge/list title Label, list with top rule, button none. **Stat** transparent, centred, H2 title, Text Large text, no top/corner/button. **Pricing** glass + ring, H4 title, label above the card, value row, list, action; header `padding-top 0`. The H5 title mode, the Service paddings, mask `none` and the copied corner settings were removed from every variant (now inherited). Stage and Pricing get `padding-top: 0` on the header, because Service's 8 px top padding did not apply to them before.
- **Removed elements:** `card_primary_image`, kicker (Card Opportunity Tags), subtitle, logo (+ image), unit, details (Card Opportunity Meta); their 7 classes deleted. Structure now: wrap › group › element › visual · content › top (icon + badge) · eyebrow · header · text · list (title + Items) · value (label + number) · button · action — corner › Card Arrow — Clickable.
- **Props:** 13 removed (Logo, Logo Alt, Logo Visibility, Image, Image Visibility, Tag 1/2 Text, Tags Visibility, Location/Experience/Salary Text, Salary Visibility, Value Unit). **Subtitle → Eyebrow** (`a11a4224-…`) and **Subtitle Visibility → Eyebrow Visibility** (`759193e6-…`), same ids, one prop per call, read back. Defaults **Eyebrow** and **Value Label** are now empty (were "Job title" / "Match score"; no visible card used them — Stage and Pricing fill their own), so no hidden expert/job label in the HTML. **Experience Icon** (variant prop, folder Meta) stays until the Designer removes it (API: "Variant props cannot be deleted") → designer-queue. Card Primary: 23 props now, 22 after that.
- **Variants:** Opportunity Text, Expert, Expert Match, Expert Match Glass, Profile Role, Profile Person, Profile Case, Logo deleted (0 instances on any page), then Service (`3b6e60b2-…`) after its 2 instances were switched to `base`. Base renamed **Service**; order Service, Discipline, Glass, Step, Stage, Stat, Pricing. This also ends the Lumos Cover/Stacked ids in Card Primary (risk 2 in the plan).
- **The 7 phantom instances:** Webflow still counts 17 Card Primary instances, 10 on Example Components; the other 7 are on no page and in no component definition (same as before phase 3). If they exist somewhere, they had one of the deleted variants and now fall back to the base (Service look, without the removed parts). Nothing to do unless they turn up.

Measured on staging (`card-check.mjs` + `card-diff.mjs` against the baseline taken just before, `after-phase4/`): **all 45 cards identical within 1 px at 1512 and 402, at rest and on hover**; the only difference is the text in the 10 content cards (hidden job/expert text gone). Elements for the 10 cards 754 → 399, divs 494 → 305, HTML 55.5 → 29.4 kB (Glass/Stat 65 → 29 elements, Service 74 → 38, Pricing 101 → 68). Page HTML: no "Rotterdam, NL (hybrid)", "90k – 110k", "12+ years", tags, meta, logo, image, "Job title" or "Match score" in any Card Primary card. No horizontal scroll at 402, no console errors. Published CSS: `card_primary_*` rules 203 → 92.

Still hidden in some variants, accepted (same content family, plan §3.1): the default Badge "Day 1", List Title "Assessed" and Value "30 min" where a variant hides that part.

Open:
- Designer: remove the **Experience Icon** variant prop (then folder Meta disappears) — queued.
- Dead CSS: `duplicate_component` left the variant styles of Card Opportunity With Text, Card Expert Match / Match Glass and Card Profile Person / Case on `card_primary_wrap` / `_group` / `_element` / … (77 rules, `w-variant-2233ab62…`, `4be18b62…`, `5d8d09ee…`). No element carries both, so nothing renders differently; clean up with `set_variant_styles` per variant id when convenient.
- Defaults Title "Project Controls Manager" and Button Text "View & apply" are still job text; every instance overrides them. Changing the Title default through the API turns it into a paragraph (loses H3), so leave it for a Designer pass or the owner.

## 2026-10-31 — Designer pass after the split (Aniek Velthuizen, via Claude in Chrome)
Open Designer items of the split, done on the component canvas (instance selected on Example Components › Edit component › left Properties panel).

- **Leftover variant props deleted:** Card Primary Experience Icon; Card Opportunity Icon; Card Expert Icon + Experience Icon; Card Profile Icon + Experience Icon. Route: hover the prop row in the Properties panel › trash icon (the Property settings popover has no delete). Folders that became empty (Meta, Visual on Card Opportunity) disappeared. Card Primary now has **22 props**.
- **Card Expert "Score Label" was the wrap's attributes prop:** the batched rename earlier today had renamed Card Expert's *Card Attributes* (attributes prop, connected to `card_expert_element`) to "Score Label" and moved it to Score. Renamed back to **Card Attributes** and moved to Settings, as on the other cards. This was the "hidden Score Label" the API reported (the API does not list attributes props).
- **Card Expert Name default** is H3 again (Property settings › Edit Rich Text › H3); staging renders `<h3>Willem Jan Velthuizen</h3>` on all 3 expert cards.
- **Folder order** (all four now Variant → Content → Visual → parts → Link → Settings, props inside each folder in convention order): Card Primary Content · Visual · Badge · List · Value · Button · Link · Settings; Card Opportunity Content · Tags · Meta · Button · Link · Settings; Card Expert Content · Visual · Score · List · Link · Settings; Card Profile Content · Visual · Badge · Link · Settings.

How the folder drag behaves (component canvas, `[data-automation-id="draggable-content_<Folder>"]`, scripted HTML5 drag): the dragged folder takes the target's position (dragging up lands before it, down after it). Folder order is the order of each folder's first prop, so a folder drag moves props globally and can reshuffle props inside the folders it passes, and moving a prop inside a folder can move that folder. Check the props per folder after every drag (DOM order inside each `draggable-content_*`), fix them with prop drags, then fix the folder order last.

Measured on staging after publishing: all 45 cards identical to the phase-4 measurement within 1 px at 1512 and 402, rest and hover.

## 2026-10-31 — Card Primary button arrow (owner)
Owner (Aniek): the Discipline "View" button gets the arrow, not the chevron. Card Primary's Tertiary Button Main instance now has Icon = Arrow Right (Button Main's new Icon prop, see `button.md`). This closes the 2026-10-30 deviation "the button icon is the Button Main default (chevron); Figma draws an arrow". Card Opportunity's button keeps its icon hidden; Card Primary's Pricing action (Primary) keeps the chevron. Checked on staging: Discipline card renders "→ View", all 45 cards same geometry.
