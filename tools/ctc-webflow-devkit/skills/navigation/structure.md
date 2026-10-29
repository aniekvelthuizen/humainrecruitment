# Structure — one nav, one link source, the site's button

## 1. The tree (Lumos `Nav` rebuilt in place)

The Lumos starter ships `Nav` (group Global) with a desktop header (`nav_desktop_wrap`, shown above the `Breakpoint` prop) and a Webflow Navbar for mobile (`nav_mobile_wrap`, collapse "all"), plus `Menu` (two variants) and `Logo`. When the design opens the same menu at every width, keep the Navbar as the **only** bar and remove `nav_desktop_wrap` and `nav_dropdown_backdrop` (move the `Menu` instance out first). Keep the Lumos class names: the starter's CSS embed inside the Nav references them, and it keeps working (the Breakpoint prop then has nothing to switch).

```
nav_component                 data-nav="component"   sticky, z 1000; Variant: Page Top (base) | Minimised
├─ u-embed-css / skip link / Nav Banner (Lumos, unchanged)
├─ nav_mobile_wrap            Webflow Navbar, collapse "all"
│  └─ nav_mobile_contain      width 100%, max-width none
│     └─ nav_mobile_layout    data-nav="bar"   flex, height nav/height, position relative
│        ├─ nav_mobile_logo   (link, padding nav/spacing-outer-horizontal)
│        │  └─ nav_logo_clip  data-nav="logo"  overflow clip, width = full logo → mark on scroll
│        │     └─ Logo        Style prop: width <full>; max-width none
│        ├─ nav_bar_wrap      data-nav="links" absolute right 0, z 3, display none → grid from the link-row breakpoint
│        │  └─ Menu (Variant Bar)
│        ├─ nav_mobile_menu_wrap  Navbar menu, data-nav="panel"  (full-screen panel, §7)
│        │  └─ nav_mobile_menu_scroll › nav_menu_layout › [nav_menu_intro, nav_menu_main › [nav_menu_list › Menu (Panel), nav_contact_wrap › buttons]]
│        └─ nav_button_wrap   Navbar button, data-nav="menu-button", data-state="open", data-trigger="hover focus"
│           └─ nav_button_layout › nav_button_roll › nav_button_track (data-nav="menu-roll") › 2 × nav_button_row [text + icon]
│                              + nav_button_line (hover line)
└─ nav_menu_backdrop / u-embed-js (Lumos)
```

Build order inside a component definition: element builder with `scope_component_id`; instances with `insert_component_instance` (append to a parent — an instance is never an anchor); move instances with `move_element`. Plain divs take text through `set_settings` key `text` (`set_text` and the builder's `set_text` silently do nothing on a DivBlock).

## 2. Variables

| Variable | Value | Note |
|---|---|---|
| `nav/height` | desktop bar height (e.g. 4.5 rem) | fluid min = mobile bar height, `clamp()` in the variable |
| `nav/spacing-outer-horizontal` | desktop side padding (e.g. 1.5 rem) | fluid min = mobile padding; Lumos aliases it to `site/margin` — usually too wide for a nav. **Check first which classes read it**: in some Lumos versions it is the *width* of `nav_mobile_contain` / `nav_mobile_menu_wrap` and the side padding is `nav/spacing-inner-horizontal` (PMS: setting "outer" as padding gave a 28 px wide container) |
| `nav/spacing-outer-vertical` | 0 when the design's bar is flush with the top | Lumos floats the nav by default |
| `nav/scrolled` (new, Number, 0) | 0 → 1 when scrolled | only when something must change only above a breakpoint IX3 cannot target (motion.md §2); for a fold that reverses mid-way, registered properties (motion.md §2b) |
| `nav/hover` (new, Number, 0) | 0 → 1 while the bar is hovered | "links come back on hover" (motion.md §2b) |

Add the fluid ones to the client's `references/fluid-values.md` and set their `clamp()` in the Variables panel ([build/foundations.md](../build/foundations.md) §4). A nav height that must follow another fluid value (a frame line at `site/padding-small`) is written out as a `clamp()` on the class: `calc(… var())` is flattened by the API.

## 3. Logo

Paste the design's SVG (from `download_assets` / `get_design_context`) into the Lumos `Logo` embed: `width/height="100%"`, `viewBox` from the file, dark parts `fill="currentColor"`, ids removed. The Logo is also in the footer — it changes there too; say so.

**Multi-colour logos**: the embed carries `u-icon`, and Lumos Global Styles force
`.u-icon :is(path:not([stroke]), …) { fill: currentColor !important }` and `.u-icon path[stroke] { stroke: currentColor !important }`.
A coloured path needs an inline important fill and **no** stroke attribute: `style="fill: var(--_theme---accent-secondary) !important"`. (`fill="var(…)"` and `stroke="none"` both fail — the second draws a 1 px outline.)

**Mark-only state**: the design clips the full logo to the mark. `nav_logo_clip` (`overflow: clip`, width = full logo) and the Logo instance's Style prop `width: <full>; max-width: none` (Lumos `u-max-width-full` would otherwise scale it). Animating the clip's width to the mark's width reveals only the mark.

## 4. Links are the site's button

Every link is a `Button Main` instance (or the site's button) — one hover for the whole site. Variants the nav usually needs ([buttons structure](../buttons/structure.md)):

| Variant | Used for | From | Overrides |
|---|---|---|---|
| `Text` (exists) | bar links | — | icon hidden per instance |
| `Menu` | panel rows | Primary | no borders (the row draws them), min-height = row height minus lines, padding from the design, number shown, row text style |
| `Menu Child` | sub-pages as rows | Menu | number in `text-secondary`, label indented (e.g. 1.5 rem); same size as `Menu` |
| `Text Icon Left` | email / phone / page links with a leading icon | Text | `flex-direction: row-reverse; justify-content: flex-end` |

`Number` (textContent prop, group Button, default `01`) bound to a new `button_main_number` element (prepend in `button_main_element`, `display: none` in the base, shown only in the Menu variants, width e.g. 6.25 rem desktop / 2 rem small). Text style per variant via the Text Style mode on the combo (`set_style_variable_mode` with `variant_id`).

Link props: `set_component_instance_prop_values` accepts `link_mode` url / email / phone only — page links are URL paths (`/about-us`). Webflow marks the current page only on page links, and does not localize URL links: switching to page links is a Designer step (or per-locale overrides with the localization tool).

## 5. The bar

- **Links slide, never shrink.** The link row (`nav_bar_wrap`) is absolutely positioned at the right of the bar and keeps its full width; on scroll its content slides out and fades (motion.md). Folding a row's width (grid `1fr → 0fr`, width → 0) makes labels wrap mid-animation — the "jumpy" bar.
- **Above the Menu button**: `nav_bar_wrap` z-index above `nav_button_wrap`, so a hidden button never catches clicks meant for the links.
- **Menu button**: Webflow's navbar CSS `.w-nav[data-collapse="all"] .w-nav-button { display: block }` beats the class; to keep a grid, `[data-nav="component"] .w-nav [data-nav="menu-button"].w-nav-button { display: grid; }` in `Global | Custom Code`. Side padding on an inner element (`nav_button_roll`), not on the button, so a hidden button has no width.
- **Menu / Close**: one roll — two rows in `nav_button_track`, `transform: translateY(calc(-50% * @var_<--_state---false id>))`; Lumos sets the state when the Navbar button is open (`data-state="open"`). Icons from the Icon Set (hamburger, close), hidden at `small` if the mobile design shows text only.
- **Link-row breakpoint**: `nav_bar_wrap` `display: none` base, `grid` from the breakpoint where the links fit (often `large`, ≥ 1280). Below it the Menu button is always visible.
- **Minimised variant**: `nav_bar_wrap` `display: none` at the breakpoint; Menu button fully visible.

## 6. Menu — one source, two lists

The Lumos `Menu` keeps every link in one component; its variants pick the list. Rename the variants by place: Mobile → `Panel` (base), Desktop → `Bar`.

```
nav_links_component (nav, aria-label Main)   flex column; Bar: row, height 100%, width auto
├─ nav_links_wrap (role list)   Panel list: border-top 1 line; Bar: display none
│  └─ nav_links_item × n (role listitem)   border-bottom 1 line → one equal line between rows
│     └─ Button (Menu | Menu Child)
└─ nav_links_bar (role list)    base display none; Bar: flex, height 100%
   └─ nav_links_bar_item × n    flex, align center, padding = nav/spacing-outer-horizontal, nowrap
      └─ Button (Text, icon hidden)
```

Remove the starter's demo dropdowns, mega menu, search, locale dropdown and buttons first (check no other page uses `Menu`).

Rules that came from owner review:
- **One line between rows, all the same width.** A row that draws top and bottom lines doubles where two rows meet; a sub-row with its own thinner line makes three different weights.
- **Sub-pages are rows** (`02.1`, `02.2`) with the same size, height, line, arrow and hover as every row; the number and an indent show the hierarchy. Small grey sub-links under a row read as unclear, and a smaller size reads as a mistake.
- **The list sizes to its content** (`nav_links_component` `flex-grow: 0`), so it can be centred.

## 7. The panel

- Full screen: `nav_mobile_menu_wrap` width 100 %, max-width none, `height: 100dvh`, padding-top `nav/height`, background `background`. The bar stays above it (Lumos z-index), so the logo and Close show on top.
- Layout: `nav_menu_layout` grid `minmax(0,1fr) <list column>` on desktop, one column below `medium` (intro hidden, as most mobile designs).
- `nav_menu_list` flex column, `justify-content: center` on desktop, `flex-start` from `medium` down (owner preference: on tablet/mobile the list starts at the top).
- Contact row: border-top the same line as the rows; wraps on mobile.
- Intro (desktop): logo, display title, text; gap between logo and title ≥ `space/6` (owner found the design's gap too tight).
- Background images or videos from the design: an asset on the panel; videos must be delivered as files.

## 8. Attribute contract

| Attribute | On | Used by |
|---|---|---|
| `data-nav="component"` | `nav_component` | IX3 / CSS scope |
| `data-nav="bar"` | `nav_mobile_layout` | colour variables over dark sections |
| `data-nav="logo"` | `nav_logo_clip` | scroll fold |
| `data-nav="links"` | `nav_bar_wrap` | scroll fold |
| `data-nav="panel"` | Navbar menu | panel slide |
| `data-nav="menu-button"` | Navbar button | panel state, display fix |
| `data-nav="menu-roll"` | `nav_button_track` | reduced motion |
| `data-section="dark\|light"` | every page section | colour switch (sections without it count as light) |
| `data-roll="text"` | button labels | letter roll ([buttons motion](../buttons/motion.md)) |

Set with `set_attributes` (with `scope_component_id`), read back with `get_attributes`; record the contract in `decisions/`.

## 9. Language switch (when the design has one)

Needs Webflow Localization (a paid add-on) and the locales added in the Designer; the API cannot add locales or create the `Locales` list element (a Designer drag into the bar, left of the Menu button). Then style it (labels per the design, current = regular, others light `text-secondary`), show it only while the panel is open (CSS on `[data-nav="component"]:has([data-nav="menu-button"].w--open)`), translate the Menu's button props per locale with `data_localization_tool`, and override URL link props per locale (`/pt/…`). Draft translations in the client repo, marked for client review. Fonts without the script's glyphs (e.g. Thai) need a font decision.
