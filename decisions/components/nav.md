# Nav (`Nav` + `Menu`, group Global)

Plan: `references/plans/2026-10-29-navigation.md`. Nav `43ba6c77-0f82-87dd-2627-66c30f96fd0b`, Menu `f898fa14-e9c4-646a-b332-c95900470afa`, Logo `15027333-0d6a-85d7-af87-d03add4a968b`.
Figma (read with aniekvelthuizen@gmail.com): desktop `Navbar - Light` `2165:4654`, mobile `Nav / Mobile` `2353:28970`.

## 2026-10-29 — Sticky with a compact scrolled state (deviation from Figma)
Conflict: in Figma the bar is not fixed and has one state; it scrolls away with the page.
Choice (owner, Aniek): the nav sticks to the top. At the top of the page it is as drawn (transparent, two rows). Scrolling **down**: the top row (language, Contact, Careers) folds away, the bar turns **white** and **more compact**, only the main row stays (links, logo, CTA). Scrolling **up** brings the top row back (wherever on the page); back at the very top it is transparent again.
Why: owner — nicest behaviour; Figma has no scroll prototype.

## 2026-10-29 — Dropdowns open on click (replaced, see "Hover on desktop, tap on mobile" below)
Choice: the four desktop dropdowns (Expertise, For business, About us, For candidates) open on click, as the Figma prototype (`ON_CLICK → CHANGE_TO`); hover only changes the link look.

## 2026-10-29 — Mobile has the same items as desktop (deviation from Figma)
Conflict: the drawn mobile panel has other items (Hire an Expert, no Expertise, no For candidates group, Analyse my resume as button).
Choice (owner): the mobile menu has the **same items and groups as desktop** — Expertise ▾, For business ▾, Clients, About us ▾, For candidates ▾, then Contact, Careers and the CTA Request a shortlist. Figma is followed only for the **look** of the mobile menu (white full-screen panel, rows with a line, expandable rows, button).
Why: one menu, nothing missing on mobile. One `Menu` component feeds both.

## 2026-10-29 — Language switch hidden
Choice (owner): `EN ▾` is not built for now (needs Webflow Localization, paid add-on). Add it when a second language comes.

## 2026-10-29 — Link targets
Choice (owner): the 13 missing target pages are created now as empty copies of *Standard Page*, slugs from the wireframes. Roles and sectors in the Expertise dropdown keep the prototype's placeholder targets for now — **to be decided** later.

## 2026-10-29 — Typos fixed
Choice (owner): "Oppertunities" → "Opportunities", "Planner / Sheduler" → "Planner / Scheduler".

## 2026-10-29 — Structure (built by Aniek Velthuizen with Claude)
Lumos `Nav` and `Menu` rebuilt in place; the desktop header / mobile Navbar split stays (desktop and mobile menus differ). Switch at the Nav prop **Breakpoint = 80** (em, 1280 px): below it the hamburger and panel, because the link row needs ~1,280 px.
```
nav_component  data-nav="component"   fixed (Position prop off), theme base; state CSS + script in two embeds at the end
├─ nav_desktop_wrap › nav_desktop_contain › nav_desktop_layout   grid: 1fr | auto | 1fr, rows: top row | main row
│  ├─ nav_desktop_logo (col 2, row 2, 11.25rem × nav/height) › Logo
│  └─ Menu (variant Desktop)          root display: contents, so its lists sit in the grid
└─ nav_mobile_wrap (Webflow Navbar) › nav_mobile_layout (4.625rem) › logo (13.0625rem) · nav_mobile_menu_wrap (white, 100dvh, Theme base) › Menu (variant Mobile) · hamburger
Menu = nav_links_component
├─ nav_links_wrap      Expertise ▾ · For business ▾ · Clients · About us ▾   (Desktop: grid col 1, row 2)
├─ nav_actions_wrap    For candidates ▾ · CTA Button Main Secondary "Request a shortlist" → /contact   (Desktop: col 3, row 2)
└─ nav_sub_wrap › nav_sub_list   Contact · Careers   (Desktop: row 1 across, right-aligned, folds on scroll)
```
Mobile: the three lists are `display: contents`, so every item is one row (64 px incl. a 1 px `dark-900-o25` line); the CTA item has `order: 1` and sits last. The four dropdowns are the starter's Lumos dropdowns, re-used (main, mega, locale and search were turned into Expertise, For business, About us, For candidates). Card: `nav_dropdown_main_scroll` (Desktop: white `nav/background`, radius small, padding 3rem, groups 2rem apart); Expertise card `is-row` with roles in `nav_dropdown_list.is-columns` (2 columns). Group = `nav_dropdown_group` › `nav_dropdown_label.u-text-style-label` (dark-900-o50) + `ul.nav_dropdown_list` › `li` › `a.nav_dropdown_link.u-text-style-text-medium`.
Text: bar links and dropdown links Text Medium (18), Contact/Careers Text Main (16) on desktop through the `is-sub` combo (Text Style base mode in the Desktop variant).

## 2026-10-29 — Links are Lumos nav links, not Button Main (deviation from the kit)
Conflict: the kit's navigation rule makes every nav link a `Button Main` instance.
Choice: bar links, dropdown toggles and dropdown links use the Lumos Menu's own link elements (`nav_links_link`, `nav_dropdown_link`); only the CTA is `Button Main` (Secondary). Hover = opacity 0.6 in 200 ms.
Why: the design's nav links have no button look (no box, no underline); the Lumos dropdown toggles must stay Webflow dropdown toggles, and a button inside them would nest links.

## 2026-10-29 — States in a small script + CSS embed
Choice: `Nav` holds two embeds after Lumos' own: CSS (`u-embed-css`) and JS (`u-embed-js`). The script sets on `[data-nav="component"]`:
| Attribute | Value | Means |
|---|---|---|
| `data-nav-scrolled` | present when scrollY > 8 | white bar (`nav/background`), compact: padding 0.625rem, logo row 3.5rem |
| `data-nav-direction` | `down` / `up` | `down` + scrolled: top row folds (`grid-template-rows: 0fr`, 300 ms) |
| `data-nav-theme` | `dark` / `light` | what is under the middle of the bar: `[data-section="dark|light"]` wins, else the first background ≥ 50 % opaque (luminance < 0.18 = dark), a photo/video/background image = dark. Dark + transparent bar = white text and the Secondary CTA in its white look |
| `data-nav-ready` | set 50 ms after load | colour transitions only after the first measurement (no flash on dark heroes) |
Menu, dropdown and panel durations: 300 ms (Figma `CHANGE_TO` 0.3 s ease-in-out), set through Lumos' `--nav--*-duration` variables in the CSS embed.
Why: Webflow styles cannot react to scroll direction or to what lies under the bar; IX3 cannot follow scroll direction anywhere on the page. Code only sets attributes; the look is in the CSS embed next to it. No `requestAnimationFrame` (a hidden tab or webview never runs it).
Marking a section: give its wrap `data-section="dark"` (or `light`) when the automatic reading is wrong.

## 2026-10-29 — Hover on desktop, tap on mobile (owner review, replaces "click")
Conflict: the owner now wants all four desktop dropdowns to open on hover; two of the re-used starter dropdowns had hover on, two off. In the mobile panel hover broke switching rows: moving the mouse from Expertise to For business opened For business by hover and the click closed it again. The Menu is one component, so Webflow's per-dropdown "Open menu on hover" setting cannot differ between the bar and the panel, and the API does not expose it.
Choice: the nav script sets `data-hover="true"` on the dropdowns in `.nav_desktop_wrap` and `"false"` in `.nav_mobile_wrap`, synchronously, before webflow.js reads it at start-up (`config.hover = "true" === data-hover`). No Designer step needed.
Why: the only way to have hover in the bar and tap in the panel from one component.

## 2026-10-29 — Owner review round 1
- **Top row:** moved up 6 px so the space above Contact/Careers equals the space between them and the button (36.3 / 36.3 px at 1512): `nav_desktop_layout` padding-top 1.625rem, `nav_sub_list` (Desktop) padding-bottom 0.625rem; the main row did not move.
- **Folded top row** is also hidden (`opacity: 0; visibility: hidden`), not only folded; the fold's negative margin follows the new padding (-0.625rem).
- **Scrolled bar** is white at 80 % with a 1rem backdrop blur, so a white dropdown card stands out against it (owner's proposal). While the mobile menu is open the bar is solid white.
- **Dropdown link hover:** a 1 px line in the text colour grows from left to right (`background-size` 0 → 100 %, 600 ms `cubic-bezier(.65,.05,.36,1)`, as the Tertiary button line) and shrinks back to the left on leave; also on keyboard focus. The line sits 0.5rem under the trimmed text (padding-bottom 0.5rem, margin-bottom -0.5rem so spacing is unchanged). Replaces the opacity hover on dropdown links.
- **Expertise roles:** two `ul.nav_dropdown_list` in a wrapping `nav_dropdown_columns` (gap 1rem / 2rem) instead of a two-column grid: two columns in the desktop card and on wide panels, one column on phones. `is-columns` removed.
- **Mobile row content:** `nav_dropdown_main_scroll` base padding-top 0 (space above the first item ≈ space below the last: 25 / 28 px).
- **Hamburger:** lines 2 px (`nav/hamburger-thickness` → border-width/thick), gap 0.75rem, still 32 × 16.

## 2026-10-29 — Dropdown card distance (owner review round 2)
Conflict: the For candidates card almost touched the CTA button above it (2 px); moving all cards 8 px lower fixed that at the top of the page, but in the compact sticky bar the card then lay over the bar's bottom edge (the bar has only 0.625rem padding there).
Choice: the card hangs a fixed distance below the nearest thing above it. Top of page: `nav_dropdown_main_scroll` (Desktop) margin-top 1.125rem = 10 px below the button. Sticky bar: margin-top 1.875rem in the state CSS = 8 px below the bar's bottom edge. The gap is margin inside the dropdown list, so moving the mouse from the toggle into the card keeps it open (measured).
Why: one value cannot fit both bar heights; tying the card to the bar edge when sticky keeps the same breathing room in both states.

## 2026-10-29 — Variables
`nav/spacing-outer-vertical` → space/0 (bar flush with the top), `nav/spacing-inner-horizontal` → site/margin (Figma 64 / 20 px), `nav/radius` → radius/none, `nav/background` → swatch/light-100 in every Theme mode, `nav/hamburger-gap` → space/2 (0.5rem; corrected 2026-10-30 — this line said 0.875rem, round 1 said 0.75rem; the built gap between the two 2 px lines is 12 px, box 32 × 16 as Figma). `nav/height` stays 5rem (Figma main row 80).

## 2026-10-29 — Off-scale values (literal rem)
Mobile bar 4.625rem (74), mobile logo 13.0625rem (209), desktop logo 11.25rem (180), mobile row 3.9375rem + 1 px line (64), card shadow `0 0.25rem 1rem rgba(3,11,27,.1)` (the style API flattens variable colours in shadows). Added 2026-10-30: hamburger hit area (see below), mobile dropdown link padding 0.875rem. The chevron box is now 1.5rem without side padding (24 px masked icon, see below).

## 2026-10-30 — Review fixes (Aniek Velthuizen, via Claude)
From `references/audit/2026-10-30-nav.md`, owner said "fix all" (items 1–18).
- **Top row fold only on desktop.** The scroll-down fold of Contact/Careers is scoped to `.nav_desktop_wrap`; in the mobile panel they always show (they vanished when the menu was opened after scrolling down).
- **Hover then click keeps the card open.** webflow.js toggles on `mouseup`; the nav script stops that mouseup (capture on the desktop bar) when the toggle is already open and Webflow's own dropdown state says hover is on. Keyboard (Enter/Space) and touch still toggle.
- **Keyboard.** A desktop card closes when focus leaves it (`w-close.w-dropdown` on focusout). In the open mobile menu Tab/Shift+Tab cycle through the hamburger and the visible items, sorted by their position on screen. That also gives the visual order (… For candidates, Contact, Careers, Request a shortlist) instead of the DOM order. Why not move the DOM: the CTA sits in the same wrapper as For candidates (desktop grid column 3), so Contact/Careers cannot go between them without rebuilding the desktop grid.
- **Mobile menu colours while closing.** The script sets `data-nav-menu-open` at once and removes it 300 ms after the close; the light-on-dark rule and the solid white scrolled bar use that attribute instead of `:has(.w--open)`, so logo and hamburger stay dark until the panel is gone.
- **Card text follows the theme.** `nav_dropdown_main_scroll` (Desktop) has Theme mode Base and colour `text` instead of `swatch/dark-900`, so the dark-bar override no longer leaks into the white card (focus ring was white on white).
- **Focus ring outside the text.** `nav_links_link` and `nav_dropdown_link` outline-offset → `focus/offset-outer` (was `focus/offset-inner`, the ring touched the letters).
- **Hamburger hit area 44 × 44.** `nav_button_wrap` width 2.75rem, padding 0.875rem / 0.375rem, negative margin of the same size; the lines do not move.
- **Mobile dropdown links.** Inline-block at full width with 0.875rem padding top and bottom and the same negative margin: 41 px tap areas at the unchanged 40 px rhythm. Desktop variant keeps width auto, padding-bottom space/2 / margin-bottom -0.5rem (hover line 0.5rem under the text).
- **Desktop card spacing.** Desktop variant of `nav_dropdown_list` and `nav_dropdown_group` row gap space/6: link to link 48 (design ~47), label to first link 37 (~36). Measured from the PNG at ±1.6 px; the Figma MCP View seat had reached its limit.
- **Mobile panel top.** `nav_mobile_menu_scroll` padding-top space/5: logo top → first divider 138 (design 137).
- **Chevrons.** Icon Set variant **Chevron Down** (the Figma `chevron_right` rotated 90°, `6ae4cb40b5e689b963686b7f_icon-chevron-down.svg`) replaces Lumos Icon Arrow in the four toggles; `nav_links_svg` side padding 0 so the 24 px icon draws a 12 px chevron as in Figma.
- **Landmarks.** Webflow renders a Dropdown List as `<nav>` and the tag cannot be changed (API and Designer); the four lists have `role="none"` so screen readers see one "Main" navigation.
- **Leftovers.** Hidden Nav Banner instance and its sessionStorage script removed. Open: the banner and `[data-open-on-mobile]` rules in the Lumos CSS embed stay for now. The Designer does not save custom code on a site without a site plan, and the API cannot write that embed without losing its Breakpoint bindings. Remove them when the site has a plan.
- **Reduced motion** also shortens the panel's open/close animation; **scrolled bar** colour is `color-mix()` on `nav/background` at 80 %.
- Menu component moved to group Global. Example Components `page_main` got id `main` (skip link).
- After the fresh re-check: gap between groups in a desktop card 2.25rem (literal; last link → next label 56, design 55.3–56.9; cards 481 / 430 vs ~482 / ~431); mobile row content `nav_dropdown_main_scroll` (base) padding-top 0.125rem so the first label is not clipped by the content's overflow; the mobile Nav Menu (`nav_mobile_menu_wrap`, which Webflow renders with `role="navigation"`) has `role="none"` too.

## 2026-10-30 — Owner answers to the review questions (Aniek)
- **Q1 Home without nav:** left as is. The homepage is built soon; the Nav goes on it then, and the loose Opportunity card under `<body>` (cause of the sideways scroll on `/`) goes with the old content.
- **Q2 Expertise card column gap:** 4rem (64 px, design ~64) on the Desktop variant of `nav_dropdown_main_scroll` (column-gap only matters in the `is-row` card). Literal: no 4rem step in the space scale. Card 663 wide (design ~660), still inside the screen at 1280.
- **Q4 Code finds parts by class:** accepted as an exception to the kit's `data-*` rule for the nav. The CSS and script target Lumos' own nav classes (`nav_desktop_wrap`, `nav_mobile_wrap`, `nav_sub_wrap`, `nav_dropdown_main_scroll` …) and Webflow's runtime classes (`.w-dropdown`, `.w-nav-button`, `.w--open`), which a Webflow navbar and dropdown always have. Only the component root is found by `[data-nav="component"]`, and the states the script sets are attributes.
- **Q5 Active page:** the design is silent; owner wants it styled. Choice: a 1 px underline 0.5rem under the text, in the text colour (white over a dark top, dark on the white bar and in the menu), on Webflow's native **Current** state of `nav_links_link` and `nav_dropdown_link` (+ `u-text-style-text-medium`), base variant so desktop and mobile share it. Same language as the hover line on the dropdown links; on hover in a card the two lines coincide. Set in the Designer (the style API has no Current state). Dropdown toggles of a group that holds the current page are not marked.

## 2026-11-01 — Nav as wide as the content (owner request; Aniek Velthuizen, via Claude)
Conflict: above 1512 px the nav content stayed 1384 px wide (x 268 at 1920) while the hero, the footer and every `u-container` section are 1512 px (x 204). Lumos' `nav_desktop_contain` takes `nav/max-width-outer` (= `max-width/main`, 94.5rem) as its outer size *including* its side padding (`nav/spacing-inner-horizontal` = `site/margin`, 64 px); `u-container` has the same 1512 without padding.
Choice: `nav/max-width-outer` → **`max-width/full`** (100 %). The side padding stays on `nav_desktop_contain`, the 1512 cap is the one `nav_desktop_layout` already had (`nav/max-width-inner` = `max-width/main`). Result = the `u-container` rule: content `min(1512, 100 % − 2 × site/margin)`, centred.
Why not `calc(max-width/main + 2 × padding)`: the API refuses `custom_value` on variables (internal error, tried twice); an alias to an existing variable works and needs no formula.
Side effect: `nav_mobile_contain` reads the same variable, but the mobile bar only shows below 1280, where 100 % was already narrower than 1512 — nothing changes there. The white scrolled bar is painted by the full-width `nav_desktop_wrap`, so its look is unchanged.
Measured on staging (Home): nav content = hero = footer at 2560 (524–2036), 1920 (204–1716), 1512 (64–1448), 1280 (55–1225); same in the scrolled state; 991 / 375 unchanged (logo at x 20 = hero at 375); no sideways scroll.

## 2026-11-02 — Smaller bar on phones (owner request; Aniek Velthuizen, via Claude)
Conflict: Figma draws the mobile bar at 74 px with a 209 px logo and a 32 × 16 hamburger; the owner finds that too big on a phone.
Choice: on the **small** breakpoint (≤ 767 px) only — tablet (768–1279) keeps the Figma sizes:
- `nav_mobile_layout` height 4rem (64, was 74); `nav_mobile_menu_wrap` padding-top 4rem to match, so the panel rows move up with the bar (first row 84, was 94).
- `nav_mobile_logo` width 7.9375rem (127 × 21, was 209 × 34). First 11rem (176 × 29); owner round 2: 8 px less tall.
- Hamburger 28 × 14 (was 32 × 16, lines still 2 px): `nav_button_wrap` padding 0.9375rem / 0.5rem with the same negative margin, so the tap area stays 44 × 44; the gap is `--nav--hamburger-gap: 0.625rem` in a `@media (max-width: 767px)` rule in the Nav state CSS embed, because the style API refuses custom properties and the ✕ transform reads the same variable (lines meet exactly when open).
Why: owner — logo and burger a little smaller on mobile, and the whole bar with them. Literal rem values: no matching step in the scales.
Measured on staging (Home): 402 and 767 bar 64, logo 127 × 20.7 (round 2), burger 28 × 14 in a 44 × 44 button, ✕ centred; 768 and 991 unchanged (74 / 209 / 32 × 16); no sideways scroll, no console errors.
