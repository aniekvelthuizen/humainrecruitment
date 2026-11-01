# Plan — «Content block» (text + photo with notch) — 2026-11-01

Work by Aniek Velthuizen (with Claude). Kit `skills/build` (+ `componentize`). Figma read in Claude in Chrome with the Plugin API (Figma MCP at its tool-call limit); tree and pictures in `references/figma/content-block/`. Webflow through the claude.ai Webflow connector (`846065a5-…`).

## In short

- Figma `Content / Content block` (set `2249:8012`, section `2323:33112`): text column left (eyebrow, H2 title — optionally two-tone —, text, optional quote **or** checklist, up to two buttons), photo right (676 × 451, 3:2) with a cut-out corner bottom right (86 × 86, rounded 16).
- Used **9×** on 7 pages: Home B (2×), Careers, About Us, Consulting services, Project controls (2×), How it works, Hire project…; always text left / photo right except once (Project controls, «How it works», photo left).
- New section component **Split Content** (`split-content_*`), group Sections. Same route as Hero Experts / Stagger Cards / Sticky Steps: plain `section` + `u-container`, own classes, white (`u-theme-light`, `data-section="light"`).
- Home now: Hero Experts · Stagger Cards · Sticky Steps · Footer. Instance 1 («Selected by people who did the job.») goes after Sticky Steps; instance 2 («Working in project controls?») belongs much lower (after 5 unbuilt sections) — see Q1.
- No mobile design exists for this block (the mobile Home frame skips it): stacked, text first, then the photo.

## The design (desktop 1512)

- Section: white (`background-2`), padding top 192 (Home #1) / 96 (most other pages) / 0 (Home #2, follows a white section), bottom 192 always; side `site/margin`. Columns space-between: text 558, photo 676 (gap 214 at 1512).
- Text column (gap 24 title-group → body; inside title group 16): eyebrow Label Large caps · title H2 48/125 Vend Sans Bold (two-tone: line 2 `dark-900-o50`, a line break before it) · body Text Large 20/150 · 32 · quote or checklist · 48 · buttons (gap 16).
- Quote (Home #1): left rule 2 px `brand-accent-500`, padding-left 32, quote Text Large 20, 8, name Text Main 16 `dark-900-o50`.
- Checklist (other pages): check 24 + 8 + Text Medium 18, items 16 apart, in two columns 32 apart.
- Buttons: Button Main Primary + Secondary, chevron right.
- Photo: top aligned with the eyebrow, 676 × 451, radius 16, notch bottom right 86 × 86 with rounded corners (Figma boolean, r16).
- Hidden «small» variants in the set: alternatives, not built.

## Reuse

| Design part | Resolves to | Decision |
|---|---|---|
| Section | — | **new** `Split Content`; no section on the site has text + one photo side by side |
| Eyebrow / two-tone title / body | plain texts with `u-text-style-*` | as Stagger Cards (`_muted` = opacity 0.5) |
| Buttons | `Button Main` Primary + Secondary, Chevron Right | place, each with Visibility |
| Checklist item | `Card Bullet` | **extend**: new variant **Large** (icon 24, Text Medium 18); base unchanged |
| Quote | — | new part inside the section (`split-content_quote`); not the hero quote (that has a quote mark) |
| Photo | `Visual Image` (3 / 2) | place inside `split-content_visual`, notch as a CSS mask (recipe of the card notch, `cards.md`) |

## Props (proposal)

Content: Eyebrow, Title, Title Muted (empty = one colour), Text · Quote: Visibility, Quote, Name · List: Visibility + slot (Card Bullet Large) · Buttons: Primary Visibility/Text/Link, Secondary Visibility/Text/Link · Image: Image, Alt · Layout: variant **Image Right** (base) / **Image Left** · Space Top: Large 192 / Main 96 / None (mechanism decided at build: variant or data attribute).

## Responsive

- ≥ 992: two columns as Figma (text max 558, photo max 676, space-between).
- < 992: one column, text then photo (also for Image Left), photo full width 3:2, notch kept; section padding top/bottom `section-space/main` (96) like Sticky Steps.
- Site H2 mobile size 30 (site.md rule). Checklist two columns down to 480, then one.

## Conflicts

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Home #2 | sits after 5 sections that are not built yet | place now at the end of `page_main`; later sections go in above it |
| 2 | Quote text | lorem («Aliquet vel mauris…»), name Floyd Latumeten | keep, as the hero quote |
| 3 | Mobile | no design | stack, text first |
| 4 | Home #2 body | lorem («Cursus eu et vestibulum…») | keep until copy arrives |
| 5 | Button links | Figma has none | More about us → /about · See what experts deliver → /project-delivery-experts · Analyse my CV → /submit-resume · View opportunities → /opportunities |

## Units

| # | Unit | Type | Creates | Touches |
|---|---|---|---|---|
| 1 | Card Bullet **Large** | variant | variant styles on `card_bullet*` | — |
| 2 | Split Content | section component | `split-content_wrap`, `_contain`, `_layout`, `_content`, `_header`, `_eyebrow`, `_title`, `_muted`, `_text`, `_quote`, `_quote-text`, `_quote-name`, `_list`, `_actions`, `_visual` | — |

Order 1 → 2, in this session. Photo: export from Figma (image hash `49fece82…` for #1), upload.

## Questions

(asked 2026-11-01)
Owner answers (2026-11-01, Aniek): Q1 both Home instances now (#2 at the end of `page_main` for now) · Q2 below 992 text first, then the photo · Q3 build everything now (Image Left, checklist, Space Top 192/96/0, Card Bullet Large) · Q4 lorem quote and lorem text stay.
