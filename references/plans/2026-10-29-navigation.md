# Plan — Navigation — 2026-10-29

Work by Aniek Velthuizen (with Claude). Kit `skills/navigation`. Figma read with the `aniekvelthuizen@gmail.com` account (the `aniek@cutthecode.com` Figma account only has view access to this file).

## In short

The design has **one bar on every page**, drawn over the hero, that **does not stick** and has **no scrolled state**. On desktop it has two rows (language + Contact/Careers above; main links, logo in the middle, button on the right) and **click-to-open dropdown cards**. On mobile it is a logo + hamburger that opens a **full-screen white panel** with rows, two of them expandable.
Desktop and mobile differ, so the Lumos split (desktop header + Webflow Navbar for mobile) stays. One `Menu` component keeps every link; its variants give the desktop list and the mobile list.

Screenshots: `references/figma/nav/` (desktop-default, desktop-for-business = all four dropdowns, mobile-open, page tops).

## 1. Inventory

Sources (page *Visual design* `2027:76`, *Mobile* `2365:38348`):

| Figma | Id | What it is |
|---|---|---|
| `Navbar - Light` | `2165:4654` | the desktop bar; variant `default` on all 15 desktop page frames (y = 0); variants `expertise`, `for-business`, `variant3` (About us), `for-candidates` = the same bar with that dropdown open |
| `Nav / Mobile` | `2353:28970` | mobile bar, `closed` (402×74) / `open` (402×1208 panel) |
| `Nav / Base` | `2353:28935` | the mobile bar's inner part (used inside `Nav / Mobile` only) |
| `Navbar mobile / For business`, `/ About us`, `/ Expertise` | `2353:29102`, `2353:29175`, `2708:45525` | expandable panel rows (closed 64 / open ~500) |
| `Navbar / Assets / Item`, `Sub menu / Assets / Item`, `Menu/Item` | `2028:2019`, `2028:1938`, `2165:4588` | bar link, top-row link, dropdown link |

### States

| State | Shows when | Notes |
|---|---|---|
| Desktop, rest | always (≥ link-row width) | transparent, over the hero; not fixed (`numberOfFixedChildren` 0 on every frame) |
| Desktop, dropdown open | **click** on Expertise / For business / About us / For candidates (`ON_CLICK → CHANGE_TO`, 300 ms ease-in-out) | white card, radius 8, soft shadow, padding 48; hover on links only changes their look |
| Mobile, closed | below the link-row width | logo left, 2-line hamburger right, bar 74 px |
| Mobile, open | click on the hamburger (`ON_CLICK → CHANGE_TO`, 300 ms ease-in-out) | white full-screen panel, dark logo, ✕ |
| Mobile row open | click on For business / About us | row expands with grouped links |

Bar text colour per page: **white** over dark heroes (13 pages), **dark** (`dark-900`) on *Hire an expert* and *Consulting services* (light heroes). Mobile frames: white.

### Content

Desktop, top row: `EN ▾` (left) · `Contact` · `Careers` (right).
Desktop, main row: `Expertise ▾` · `For business ▾` · `Clients` · `About us ▾` | **logo** | `For candidates ▾` · **Request a shortlist** (Secondary button).

| Dropdown | Groups → links |
|---|---|
| Expertise | ROLES: Project Director, Cost Controller, Change Manager, Project Controls Manager, Planner / Sheduler, Document Control · SECTORS: Oil & Gas, Data Centres, Energy |
| For business | SHORTLIST: Request a shortlist, How we select · HIRING: Hire project controls experts, Hire project delivery experts · SERVICES: Consulting & Services, Project controls |
| About us | ABOUT: Vision & Team · PRICING: Transparent rates · HOW DOES IT WORK?: From requirement to placement · CONTACT: Get in Touch |
| For candidates | Oppertunities, Analyse my CV |

Mobile panel: Hire an Expert · For business ▾ · About us ▾ (adds *Clients – Cases & references*) · Oppertunities · Contact · Careers · **Analyse my resume** (button) · EN ▾. No Expertise row in the drawn panel, although its expandable row exists as a component.

### Link targets (from the prototype)

| Link | Figma frame | Site page |
|---|---|---|
| logo | 1. Home B | `/` (exists) |
| Contact, Get in Touch, Request a shortlist | 10. About Us / Contact | missing |
| Careers | 14. Careers | missing |
| Clients | 7. About Us / Clients | missing |
| Hire project delivery experts, How we select, all Expertise *roles* | 3. For business / Hire Project Delivery Experts | missing |
| Hire project controls experts / Hire an Expert | 2. Hire an expert | missing |
| Consulting & Services, sector Oil & Gas | 4. Consulting services | missing |
| Project controls, sectors Data Centres, Energy | 5. Project controls | missing |
| Vision & Team | 6. About Us | missing |
| Transparent rates | 9. Rates | missing |
| From requirement to placement | 8. How it works | missing |
| Oppertunities | 12. Opportunities | missing |
| Analyse my CV / resume | 11. Analyse my resume | missing |

Roles and sectors all point to the same few pages: placeholders in the prototype.

### Sizes

Desktop: bar padding 32 / 64, top row 36, main row 80 (total 180), logo 180 × 29. Mobile: bar 74, logo 209 × 34, side padding 20. Link row needs about 1,280 px (left group 464 + logo 180 + right group 405 + gaps and padding).

## 2. Plan

| Topic | Choice |
|---|---|
| Component | Lumos `Nav` rebuilt in place; desktop header and mobile Navbar both stay (the design differs per width). `Nav Banner` stays hidden. |
| Desktop header | `nav_desktop_wrap`: new top row (EN, Contact, Careers) above the main row; main row grid `1fr auto 1fr` so the logo sits exactly in the middle. |
| Switch point | desktop header from 1280 px (`large`) up; below it the mobile bar and panel. |
| Links | Every link and toggle is a `Button Main` instance — new variant **Nav Link** (text only, nav text colour, small chevron for toggles); dropdown links a **Nav Dropdown Link** variant; panel rows a **Nav Row** variant (row with line under it). Same hover for the whole site. |
| Dropdowns | Lumos dropdowns in `Menu`, opening on click (as in Figma), white card radius 8 + shadow, group labels in the Label text style. Starter mega menu, search and demo links removed. |
| Menu | One `Menu`, variants `Bar` (desktop) and `Panel` (mobile, base). |
| Panel | full-screen white, rows with one line between them, For business / About us (and Expertise, see Q3) expand in place; Analyse my resume = Secondary button. |
| Colour | Bar text follows what is behind it (script measures the hero, kit default) — white over dark heroes, dark over light ones, no per-page setting. Panel open: always dark on white. |
| Sticky | not sticky, as in Figma (see Q1). |
| Motion | dropdown and panel 300 ms ease-in-out (Figma values); hamburger ↔ ✕; button hover from the button component. |
| Missing pages | 13 pages created as empty copies of *Standard Page*, slugs from the wireframes (see Q5). |
| Logo | SVG from Figma into the Lumos `Logo` (also changes the footer logo). |

## 3. Questions

See the chat message of 2026-10-29; answers go to `decisions/components/nav.md`.
