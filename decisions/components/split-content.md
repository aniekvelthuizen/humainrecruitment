# Split Content (`Split Content`, group Sections)

Plan: `references/plans/2026-11-01-content-block.md`. Figma: `Content / Content block` (set `2249:8012`, section `2323:33112`); Home B instances `2710:56547` («Selected by people…») and `2710:57507` («Working in project controls?»). Tree and pictures in `references/figma/content-block/`. Check: `node references/split-check.mjs [url] [outdir]`. Built by Aniek Velthuizen with Claude.
Component **`410b9fa3-b44c-ba67-bb25-ddee2f03adec`**.

## 2026-11-01 — Name describes the pattern
Choice: **Split Content** (`split-content_*`): a text column beside one photo. Figma calls it «Content block»; it is used 9× on 7 pages (Home B 2×, Careers, About Us, Consulting services, Project controls 2×, How it works, Hire project delivery experts).

## 2026-11-01 — Owner answers (Aniek)
- Both Home instances now; #2 sits at the end of `page_main` until the five sections above it on Home B exist (they go in above it).
- No mobile design: below 992 px one column, **text first, then the photo** (also for Image Left).
- Everything built now: Image Left, checklist (Card Bullet **Large**), Space Top large / main / none.
- Lorem quote («Aliquet vel mauris…», Floyd Latumeten) and the lorem body of #2 stay until copy arrives.

## 2026-11-01 — Structure
`section.split-content_wrap.u-theme-light` (`data-section="light"`, `data-split-content`, `data-space-top` = prop) › `split-content_contain.u-container` › `split-content_layout` (grid `minmax(0, 34.875rem) minmax(0, 42.25rem)`, space-between, gap `space/7`; one column below 992, row gap `space/8`) ›
- `split-content_content.u-text-trim-off` (flex column) › p `_eyebrow.u-text-style-label-large` · h2 `_title.u-text-style-h2` › span (Title) + br (Title Break) + span `_muted` (Title Muted) · p `_text.u-text-style-large` · figure `_quote.u-text-trim-off` › blockquote `_quote-text.u-text-style-large` + figcaption `_quote-name.u-text-style-main` · `_list` (`role="list"`, grid one column, corrected 2026-11-05) › slot **List** · `_actions` › Button Main Primary + Secondary
- `split-content_visual` › Visual Image (3 / 2)
- HTML embed (`u-embed-css`): the Space Top rules (case-insensitive) and hiding an empty muted span.
Plain section, not the Lumos `Section` wrapper: same route as Hero Experts / Stagger Cards / Sticky Steps.

## 2026-11-01 — Texts untrimmed, so Figma's gaps are literal
`u-text-trim-off` on `_content` (and again on `_quote`: it only reaches direct children). Text boxes then equal Figma's boxes, and every gap is Figma's number: eyebrow → title `space/4` (16), title → text `space/6` (24), text → quote/list `space/7` (32), → buttons `space/8` (48), quote rule padding `space/7`, quote gap `space/2`. Neighbouring sections trim and add the trims back; here that is not needed.

## 2026-11-01 — Spacing and sizes (measured at 1512 after publish)
| Where | Figma | Built |
|---|---|---|
| Section #1 (Space Top large) | 938 high | 938 |
| Section #2 (Space Top none) | 643 high | 643 |
| Eyebrow / title / text / quote / buttons (#1) | y 192 / 232 / 376 / 558 / 698 | same |
| Photo | 772, 192, 676 × 451 | same |
| Section top / bottom | 192 / 192 (#2 0 / 192) | `section-space/large`; < 992 `section-space/main` (96) |
Space Top: prop **Space Top** (text) → `data-space-top`: `large` (default, 192), `main` (96, most other pages), `none` (0, Home #2 after a white section). Below 992 `large` becomes 96 like the bottom.

## 2026-11-01 — Photo notch
Figma `Subtract` = 676 × 451 minus an 86 × 86 square bottom right, all corners rounded 16 (also the two at the notch and the inner one). Built as a 7-layer CSS `mask` on `split-content_visual` (two bands, each with its own rounded end, plus the inner fillet), outer corners by `border-radius: radius/main` + `overflow: clip`. Notch size fixed at 5.375rem at every width. Same idea as the card notch (`cards.md`), but with rounded convex corners.

## 2026-11-01 — Title in two parts
Title + optional **Title Muted** (`swatch/dark-900-o50`, as Figma). The space between them is a real text node (a DOM span holding " " between the two spans; prop text loses its trailing space), so copied and crawled text reads "…people who…" also without the break. An empty Title Muted hides its span. **Title Break** (boolean, off by default) shows a `<br>` before the muted part — Figma breaks there on Home #1 and Consulting services, the other titles run on.
Site H2: 48 → 30 fluid; H2 uses the site's balanced wrapping, so «Working in project controls?» breaks after «in» (Figma after «project»). Left as the site rule.

## 2026-11-01 — Props
Content: Eyebrow, Title, Title Break, Title Muted, Text · Quote: Quote Visibility (default on), Quote, Quote Name · List: List Visibility (default off), slot **List** (Card Bullet, variant Large) · Buttons: Primary/Secondary Visibility, Text, Link · Image: Image, Image Alt · Layout: Space Top · variant **Image Right** (base) / **Image Left** (`60a878d8-c287-2b13-3899-ef1dca2aeeaf`).
Home: #1 Title Break on, quote on, buttons More about us → /about, See what experts deliver → /project-delivery-experts (Figma has no targets; recommended answers). #2 Title Muted empty, quote off, Analyse my CV → /submit-resume, View opportunities → /opportunities, Space Top none.

## 2026-11-01 — Image Left differs by 30 px
Figma's image-left variant uses a 528 text column (text at x 920); the component keeps one text width (558), so the text starts at 890. Only on Project controls («Tell us where you need help.»). Revisit when that page is built.

## 2026-11-01 — Checklist slot needs the Designer
The API cannot put Card Bullets into the List slot (not in the definition, not in an empty slot on a page). Fill it in the Designer when a page with a checklist is built: select the slot › add Card Bullet › variant **Large**. The list is one column, as every frame draws it.

## 2026-11-01 — Review fixes (owner: "verwerk ze")
- Lists: Card Bullet root `role="listitem"`; `card_primary_items` and `card_expert_items` got `role="list"` (Split Content's `_list` already had it). The Hero Experts script still strips every role inside its stage at runtime (existing hero choice).
- Embed: the quote-margin rule removed (Webflow's base CSS already gives 0); Space Top selectors case-insensitive (`"Main"` works too).
- Title: real space between the parts (see "Title in two parts").
- Photo `sizes` stays `100vw` (the desktop loads the 1352 px file for a 676 px slot): Webflow refuses `sizes` as a custom attribute ("reserved attribute name") and Visual Image has no setting for it. A Sizes prop was tried on Visual Image and removed again.
- Not changed (your-call items, no answer yet): body text full width on tablets (~95 characters per line at 990); Space Top as free text.
- Owner (Aniek), 2026-11-01: photo `sizes` stays as it is — no script to set it (the reviewer showed one would make desktop load the 800 px file).

## 2026-11-02 — Done (owner)
Owner (Aniek) tested on staging (humain-dev.webflow.io): "getest en ziet er goed uit", block closed. Re-measured on the new staging domain: unchanged (938 / 643 at 1512, no sideways scroll, no console errors).

## 2026-11-02 — Visual slot (Aniek, via Claude)
Conflict: Figma `Content / Final score` and `Content / Trust statement` (Project Delivery Experts) use Split Content's grid with a chart or a numbered list where the photo goes.
Choice: new slot **Visual** in `split-content_slot` (after `split-content_visual`; Image Left: `order: -1`, back to 0 below 992 — same as the photo). No extra toggle: when the slot holds a component the photo hides itself, an empty slot hides itself (`:has()` rules in the embed). For the slot: **Score Chart** (`decisions/components/score-chart.md`) or **Step List** (`decisions/components/step-list.md`).
Why: owner chose «a variant of Split Content with the chart / steps in a slot instead of the image». Automatic beats an Image Visibility toggle that editors have to remember (a forgotten toggle would put three items in the two-column grid).

## 2026-11-02 — Glow
New prop **Glow** (boolean, Layout, default off) → `data-glow` on the wrap. On: the Stagger Cards mint glow (`glow/mint`, same gradient numbers — Figma's Trust statement uses the exact same fill), ≤ 767 the Stagger Cards mobile gradient. Rule in the embed. Home instances unchanged (off).

## 2026-11-02 — Empty button row hidden
With both buttons off the empty `split-content_actions` still added its 48 px top margin. Embed: `.split-content_actions:empty { display: none; }`. Home (buttons on) unchanged.

## 2026-11-02 — Project Delivery Experts: Final score and Trust statement
Owner-agreed deviations: Trust statement keeps Split Content's Image Left widths (steps 676 / text 558; Figma 558 / 676), titles stay H2 48 (Figma's Final score uses H1 60), gaps eyebrow → title → text stay 16 / 24 (Final score's ad-hoc frame uses 10 / 10).
- Final score: Eyebrow «The weighting», Title «How the final score» + Title Break + Muted «is calculated», Figma text, quote and buttons off, Score Chart with 7 Score Items.
- Trust statement: variant Image Left, Glow on, Eyebrow «Trust Statement», Title «Why This Matters», three paragraphs (blank lines in the multiline Text → `<br><br>`, as Figma), quote and buttons off, Step List with 4 Step Items.
Both sit at the end of `page_main`, after the template's placeholder Section; the Figma sections above them are not built yet.

## 2026-11-02 — Glow motion (owner request)
With Glow on, the glow rises in once when the block scrolls into view (`decisions/motion.md`, exception entry). The glow moved to a `::before` (`isolation: isolate`, `z-index: -1`) only while the script runs; without the script it stays the static background. Second embed (script) added after the style embed, so the canvas keeps the style rules. Source: `references/embeds/split-content-style.html`, `split-content-script.html`.

## 2026-11-02 — Glow motion removed (owner)
Owner (Aniek): the rising glow was hardly visible and not an improvement → removed: the script embed is gone and the style embed is back to the static glow rules. Split Content has one embed again (`references/embeds/split-content-style.html`).

## 2026-11-05 — Last fix round (Aniek Velthuizen, via Claude; not published, local simulation at 1512, 1280, 992, 402)
- **Checklist one column in the base**, as every frame; the old "2 columns" line above was wrong. Block at 1512 against frame: PDE 780/780, Consulting 942/942, Controls 797/797, About 739/739, How It Works 803/863 (title 2 lines against 3, known), Careers 750/780 (text 3 lines against 4 in the 528 column, known). Home has no checklist on either instance.
- **`_actions` keeps wrapping: no-wrap not applied**, the condition failed. At 992 the column is 437 and the rows need 456–575, so labels break in two inside the 48 px button on all five instances with buttons (Home ×2, Consulting, Controls, How It Works). Consulting needs 575 against 558, so its labels break at 1512 too.
- **Image Transparent** (boolean, Image, default off) → `data-image-transparent` on the wrap, rule in the embed, as Glow: Visual Image's grey panel off for a transparent PNG. On for PDE The bar only.
