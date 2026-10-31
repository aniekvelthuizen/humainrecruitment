# Cards

Card family on the site (from the Figma + current Webflow build, 2026-10-29): job/opportunity cards (Opportunities list, Careers "Join the team", Opportunities/Detail "Similar opportunities"), full-bleed case/cover cards (About/Clients "Selected project work", team member photos), light service cards ("Six disciplines" on Home), testimonial cards (Home + About/Clients "Trusted by the people who hire"). Job/opportunity is the most reused, so it was built first by adapting Lumos `Card Primary` (`7941d471-12eb-22ce-6420-784e5a3b04f8`, group `Card`). Cover, Service and Testimonial are not built yet.

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
| Tags | Tags Visibility | boolean | true (binding not yet wired — see Designer-only below) |
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
- **Hover:** Figma `variant-2` = linear gradient white → `#00ffd5` (= `swatch/brand-accent-500`) at ≈131°. `card_primary_visual` is now the hover veil: absolute, behind the content, `background-image: linear-gradient(131deg, #ffffff, #00ffd5)` (literal colours: gradient stops mangle `var()`), `opacity: var(--_trigger---off)`, 400 ms ease. `card_primary_image` is `display: none` in the base; Cover/Stacked set it back to `block` and the veil's gradient to `none` (Stacked also `position: relative`, opacity 1). Hover only fires when the card has a Link (Lumos `hover-if-clickable`).
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

## Open — still not done

- **Body-text type** (Figma `variant3`/`variant4`, Careers internal vacancy "Recruitment Consultant"): tags Full-time/Recruitment, 2 meta rows (location + `cv-submission` icon), a body paragraph, no salary. Needs a Text prop + Salary Visibility (and the `cv-submission` icon) on the Opportunity variant — not built yet.
- **Arrow on Cover/Stacked:** hide it there (an `Arrow Visibility` prop bound per variant, or rebuild those variants) when they get their own pass.

- **Variant prop rename**: "Card Type" should ideally be renamed `Variant` in the Designer (props.md convention). Tried: Properties-panel label click, hover, the "..." → Edit settings dialog (that's the *component's* Name/Group/Description, not the prop), and Open component → Settings tab (that's the *selected element's* settings, not the prop schema). Did not find where Webflow exposes a rename for the variant-type prop specifically — worth asking the owner or checking Webflow's own docs/support next time rather than guessing further. Not blocking (cosmetic only, instance panel still works fine with the label "Card Type").
- **Prop folder order**: Tags/Meta/Content currently sit *after* the pre-existing Button Text/Screen Reader Text/Link/Image/Card Type/Settings group in the Properties panel, not before as props.md's "Content → Visual → part folders → Link → Settings" order would suggest. Needs the HTML5-drag reorder pass (webflow-mcp.md §11) if the order matters enough to the owner to justify it — it's a nice-to-have, not broken.
- **Native "is set" conditions**: every text prop should show/hide by "is set" rather than always-visible (props.md rule 6) — not yet done for Title, Tag 1/2, Location/Experience/Salary. Lower priority: all fields are expected to always be filled for a real job posting, so this mainly matters once the Careers internal-card variant (no salary) is actually placed on a page.
- Not yet measured pixel-for-pixel against Figma at 1440/375, no hover states built, and not yet placed on any real page — **Opportunities and Careers are still empty, un-built sections in Webflow** (confirmed again this session: both pages are just Nav + one empty Section + Footer). Placing the card on those pages, wiring real job content, and building the surrounding page chrome (search/filter bar, grid, hero, CTA banner) is a separate, bigger task — not part of "build the cards."
