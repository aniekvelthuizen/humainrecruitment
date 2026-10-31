# Footer (`Footer`, group Global)

Plan: `references/plans/2026-10-31-footer.md`. Figma spec: `references/figma/footer/spec.md`. Built by Aniek Velthuizen with Claude.
Footer `29394d2f-cd0c-8059-7e15-66f93814999f`, Footer Link `f5219fe8-69c7-b978-3e87-e9a133727619`, Footer Group `3763bb36-8635-2157-d0a6-9adad3740030` (not used, see below). Figma `device=desktop-compact` `2737:48338`, `device=mobile` `2382:37421`.

## 2026-10-31 — Lumos Footer adapted in place
Choice: the Lumos `Footer` keeps its id, name, `footer_*` classes and its Lumos parts (sr-only "Footer" h2, `footer_contain.u-container`, `footer_layout.u-grid-custom` with `data-medium-columns="1"`, `footer_bottom_*`, the `{{year}}` script). It is placed on every page that has the nav (17 pages, all made from *Standard Page*); Home and Styleguide have neither.
Why: kit rule — adapt the Lumos original, never a copy. The footer is identical on every page, so its content lives in the definition and it has **no props** (componentize exception for nav/footer).

## 2026-10-31 — Columns are plain elements, not Footer Group instances (deviation from Lumos)
Conflict: Lumos puts `Footer Group` instances in a `Grid` slot. The API cannot address anything inside a slot of a definition (no ids; props "not found"), so the 12 link texts and targets could not be set, and the Designer would have to set 24 props by hand.
Choice: each column is `footer_group_wrap` (section, `data-footer-group`) › `footer_group_title` h3 · `footer_group_toggle` button · `footer_group_drawer` › `footer_group_list` (role list) › `Footer Link` instances — the unlinked structure of `Footer Group`, directly in the Footer. The 3 columns sit in `footer_group_layout` (3 columns spanning 8 of Lumos' 12, Figma 440 + 3 × 283 exactly; 1 column below 768 px). The Lumos `Grid` instance was removed. `Footer Group` (now 0 instances) carries the same toggle/drawer structure for a future reuse.
Editing: double-click the Footer, change a Footer Link's Text/Link in its props; add a link by duplicating one.

## 2026-10-31 — Footer links are `Footer Link`, not `Button Main` (deviation from the kit)
Conflict: the kit makes text links `Button Main` instances; `button.md` had moved the Figma `Button/Link/Default` footer links to the footer.
Choice: all footer links (columns and the legal links in the bottom row) are the Lumos `Footer Link` (Text, Link props): `footer_link_text.u-text-style-main` (16 px). Hover and keyboard focus: a 1 px line in the text colour grows from left to right under the text (`background-size` 0 → 100 %, 600 ms `cubic-bezier(.65,.05,.36,1)`, 0.5rem below the trimmed text) — the same language as the nav dropdown links and Figma's `Footer / Assets / Item` hover. Lumos' "dim the others" hover (`data-trigger`, opacity) removed.
Why: same reasoning as the nav — no button look; one small component for every footer link. Link props take URLs only (`page` mode is refused), so targets are relative paths (`/about`); a page slug change needs a sweep here.

## 2026-10-31 — Colours
Footer root `footer_wrap.u-theme-brand` (Brand mode: text white, border `brand-text-o20` = Figma's divider). Gradient top → bottom from new Theme variables `footer/gradient-start` (→ brand-500), `footer/gradient-middle` (→ brand-secondary-500, at 70.19 %), `footer/gradient-end` (→ brand-pink-500 `#e5bbb7`; Figma's unbound `#e5b8b4` has no variable, invisible difference). The gradient is on `footer_wrap` itself (style API). The API read-back shows only `footer/gradient-start`, but the published CSS keeps the full three-stop gradient (same lesson as the button shadow); it was first put in the CSS embed and moved back after the re-check. Mobile row lines use the theme border too (Figma 25 % vs divider 20 %). "Recruitment" in the brand title: `footer_content_accent` opacity 0.5 (Figma `light-100-o50`).

## 2026-10-31 — Mobile: accordions (owner confirmed 2026-10-31)
- Below 768 px the 3 columns are accordion rows (Figma mobile), closed by default; tap opens/closes one row (rows are independent). The `footer_group_toggle` button lies over the title row (hidden ≥ 768 px, so desktop has no dead button); the script sets `aria-labelledby` (the title), `aria-controls`, `aria-expanded` and `data-footer-open` on the column. Open = `grid-template-rows` 0fr → 1fr + 1.25rem padding, 300 ms; closed links are `visibility: hidden` (not focusable). The line sits under the title row, so an open row's links appear under it, as in Figma.
- Open content: the same links in the same 16 px style as desktop, not Figma's copy of the nav dropdown (HIRING/SERVICES labels, 18 px).
- No logo: see "Owner decisions" below.
- 768–991 px: brand text on top, the 3 columns in a row under it, desktop bottom row.

## 2026-10-31 — Open targets
"Privacy settings" (no cookie banner yet) and "Disclaimer" (no page yet; text pages come later) link to `#`. Fill in when they exist. LinkedIn: see "Owner decisions" below. LinkedIn is a new `Icon Set` variant **LinkedIn** (asset `6ae5ce5939a6321ea2537202_icon-linkedin.svg`, exported from Figma `2081:4514`); the other Lumos social items were removed. Typo "Oppertunities" → "Opportunities" (as the nav).

## 2026-10-31 — Spacing (Figma → trimmed text)
| Where | Value |
|---|---|
| Footer top → brand title cap / mobile | 5.5rem / 1.75rem (`footer_contain` padding-top) |
| Title → text / title → first link | 1.9375rem / 1.875rem |
| Link → link (columns and bottom row wrap) | 2.043rem (pitch 44 as Figma) |
| Last link → divider / mobile last row → divider | 5.6875rem / 5rem (`footer_contain` padding-bottom) |
| Divider → bottom row / mobile | 1.9375rem (icon 24 centred on the text) / 2.375rem |
| Bottom row → footer end / mobile | 5.3125rem / 1.25rem |
| Bottom row gaps | 1.5rem; mobile 0.875rem (Figma 16 makes the 3 links 3 px too wide for 362 and wrap) |
| Mobile text → rows, row height | 2.5rem (`footer_layout` row gap), title padding 1.53125rem + 1 px line = 64 |
| Mobile columns → divider | `footer_contain.u-container` row gap 0 (Lumos' container gap would add 48 px) |
Measured with `references/footer-check.mjs` on staging: every position within 2 px of Figma at 1512 and 402.

## 2026-10-31 — Review fixes (Aniek Velthuizen, via Claude)
From `references/audit/2026-10-31-footer.md`.
- **Brand column shrinks its gap:** `footer_content` padding-right `clamp(0rem, (100vw - 62rem) * 0.1846, 6rem)` — 6rem (Figma 96) at 1512, 0 at 992, so the title stays on one line between 992 and 1100.
- **Tap areas below 768 px:** footer links 0.875rem block padding with the same negative margin (spacing unchanged; the hover line is moved back to 0.5rem under the text with `background-position: 0 calc(100% - 0.375rem)`); LinkedIn 44 × 44 (2.75rem, 0.625rem padding and negative margin, `max-width: none` against Webflow's `w-inline-block`).
- **Focus:** footer links use `focus/offset-outer`, as the nav.
- **Script contract:** `[data-footer-group]` › `[data-footer-title]`, `[data-footer-toggle]`, `[data-footer-list]`; the script sets `data-footer-open` on the group and `aria-labelledby`, `aria-controls`, `aria-expanded` on the toggle. The CSS embed styles the state with the attribute and the footer's own classes.
- **Logo outline** (logo removed later, see Owner decisions): the svg had `overflow: visible` (its paths touch the viewBox; a clipped stroke was half as thick on the outer edges).
- **Own classes** `footer_content_title`, `footer_content_text` on the brand texts; the phone row line uses `border-width/main`.
- **Owner (Aniek), 2026-10-31:** the white bottom row stays on the pink end of the gradient as Figma draws it, although it is below WCAG contrast (3.2:1 at 1512, 2:1 for LinkedIn at 375). On phones a column title stays heading + separate toggle button (announced twice); no button inside the h3.

## 2026-10-31 — Re-check round 2
- Phone links: block padding and negative margin 1rem (tap area 43 px at the 44 px pitch), hover line `calc(100% - 0.5rem)` = 0.5rem under the text.
- Gradient moved from the CSS embed to the `footer_wrap` class (see Colours); the embed now holds only the accordion state (the logo outline rules went with the logo).
- Accepted: at 992–993 px "Project Delivery Experts" wraps (column 180.6 px, text 181); from 994 px it fits. At 375 px "Disclaimer" drops to its own line under the other two legal links (normal reflow).

## 2026-10-31 — Owner decisions (Aniek Velthuizen, via Claude)
- **No logo in the footer.** The full-width logo in Figma's mobile footer is a design error; the logo shows at no width. Removed the `footer_logo_wrap` link with its `Logo` instance, the `footer_logo_wrap` class and the outline CSS in the embed. Mobile: last accordion row → divider 5rem (Figma's 80 between blocks); footer 628 px high at 402.
- **Accordion content:** the same links as desktop (confirmed).
- Contrast of the bottom row and the phone column title: see the owner line under "Review fixes".
- **LinkedIn** links to `https://www.linkedin.com/company/humain-recruitment/home/`, opens in a new tab; `aria-label` "HumAIn Recruitment on LinkedIn (opens in a new tab)".
