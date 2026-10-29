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

## 2026-10-29 — Variables
`nav/spacing-outer-vertical` → space/0 (bar flush with the top), `nav/spacing-inner-horizontal` → site/margin (Figma 64 / 20 px), `nav/radius` → radius/none, `nav/background` → swatch/light-100 in every Theme mode, `nav/hamburger-gap` → 0.875rem (lines 16 px apart, Figma 32 × 16). `nav/height` stays 5rem (Figma main row 80).

## 2026-10-29 — Off-scale values (literal rem)
Mobile bar 4.625rem (74), mobile logo 13.0625rem (209), desktop logo 11.25rem (180), mobile row 3.9375rem + 1 px line (64), chevron box 1.5rem with 0.375rem side padding (icon 12 px), card shadow `0 0.25rem 1rem rgba(3,11,27,.1)` (the style API flattens variable colours in shadows).
