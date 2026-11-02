# Review — Spotlight Grid on Home, 2026-11-02

Fresh read-only review of Aniek Velthuizen's build (Cut the Code), done by a reviewer agent that did not build it. Nothing was changed on the site.

## Spotlight Grid — Home (https://humain-dev.webflow.io/)
Checked: API not reachable (404 for site `6ae35364…`) · published Mon 2026-11-02 18:51 UTC (after the build: the figcaption fix is live, name at y 463) · widths 1512, 1440, 1280, 1200, 1100, 992, 991, 768, 767, 479, 402, 375 + WebKit iPhone 15 · design `references/figma/home-expertise/homeb-1512.png`, `spec.md`, `tree.txt`

| Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|
| ✅ | ⚠️ | ✅ | 🧹 | ✅ | ? | ⚠️ |

### Findings (most important first)
1. ⚠️ Design · The quote breaks inside "go-to": line 1 ends "my go-", line 2 starts "to source" · Seen: line texts at 1512 `"HumAIn is my go-" / "to source to find " / "high-quality talent"`; same at 1280, 402 and WebKit iPhone 15 (`spotlight-1512.png`, `webkit-panel.png`); the quote uses a plain hyphen (0x2d), while decisions/spotlight-grid.md records the wrap as «go-to / source» · Fix: in the Home instance's Quote prop, type "go‑to" and "high‑quality" with a non-breaking hyphen (U+2011), the way the hero already writes "Pre‑Qualified". Then correct the record · By: API
2. ⚠️ Responsive · Below 992 the woman in the photo sits clearly left of the centred quote and name · Seen: in the photo file she stands at 34 % of the width (centroid of the cut-out); below 992 the image box is centred, so she sits 96 px left of the panel centre at 991 and 767, and 50 px at 402 (`spotlight-991.png`, `crop-402-photo.png`). At ≥ 992 `translateX(-35%)` keeps her centred (6 px off at 1512 and 992) · Fix: below 992 give `spotlight-grid_visual` `transform: translateX(16%)`; the empty right part of the cut-out is clipped by the panel · By: API
3. ⚠️ Responsive · From 992 to about 1150 px the two card columns are out of step: cards of different heights, columns starting at different heights · Seen: at 992 left cards 198/252/222 high, right 222/198/222, column tops at 219 vs 234; at 1100 tops at 237 vs 264 and heights 712 vs 658 (`spotlight-992.png`). At 1200 and above they are even · Fix: owner's choice. Either keep it (it is the agreed "columns shrink" reflow), or use the two-column layout up to 1279 (base breakpoint 2 columns, 1280+ 3 columns) · By: owner
4. 🧹 Lumos · The section is not on the Example Components page · Seen: `/example-components` has no `data-spotlight-grid` (it has no Stagger Cards, Split Content or CTA Split either; `/components` gives 404) · Fix: owner's choice. Either add the Home sections to a showcase, or record in `decisions/site.md` that sections are not showcased · By: owner

### Already decided (not findings)
- Cards 198 high, not 194, and card text wraps one word earlier than Figma. See decisions/components/spotlight-grid.md and cards.md, 2026-11-02 and 2026-10-30.
- Role line 21 high, not 18, so the company line sits 3 px lower (y 522 vs 519). See spotlight-grid.md, 2026-11-02.
- Card title colour is the theme `text` colour, not Figma's unbound `#1a1c1e`. See plan conflict 4 and cards.md.
- All six "View" links go to `/project-delivery-experts` (the page answers 200). See spotlight-grid.md, Cards.
- No tab variant; reflow below 992 with no mobile design. See spotlight-grid.md, 2026-11-02.
- Hidden Card Primary parts ("Day 1", "Assessed", "30 min", the second "View") are still in the HTML with `display: none`. See cards.md, "Still hidden … accepted".
- 4rem panel top padding is a literal, because no space step equals 64 (space/8 = 3rem). It is recorded in spotlight-grid.md.

### Content
- Testimonial person «Lisette, Chief Operations Officer, Ingeniva» and the photo: confirm they are real. The image alt is "Smiling businesswoman with curly hair looking up", which describes a stranger next to a named quote. Either "Lisette" or an empty alt (the name is already in the caption) reads better. This is the owner's call.

### Checked and fine
- **1512 vs Figma:** section 1190, padding 0 / 192, header 1144 × 184, eyebrow 24, title y 34 h 150, layout 64,232 1384 × 766, panel 536,232 440 × 766, quote 392 × 135 at 560,296, name y 463, photo 547,599 598 × 399. Every row is within 2 px or decided (table in the evidence folder).
- **Type and colour at 1512:** eyebrow Onest 16/24 uppercase; title Vend Sans 60/75 700, with "One standard." at opacity 0.5; quote Vend Sans 36/45 white; name Onest 20/30; role 14/21 at opacity 0.5; company 14 uppercase. The panel gradient uses `gradient/brand-start | brand-middle 70.19 % | brand-end`. The end swatch `brand-pink-500` is #e5bbb7 against Figma's #e5b8b4. That is a 3/255 difference, site-wide, and nobody will see it.
- **Responsive:** no sideways scroll at any of the 12 widths or in WebKit iPhone 15 (scrollWidth = viewport). No text leaves its card, panel or header. Reflow is as decided: 3 columns ≥ 992; 2 lists side by side at 768–991 with the panel full width; 1 column below 768 with 6 cards and then the panel. Title is 36 on mobile, quote about 30.
- **Spacing:** gaps are logical and the same at every width (header → layout 48, cards 32, last card → panel 32, panel padding 64 / 24). Section padding below 992 is 0 / 96, matching the neighbours. The eyebrow → title box gap is 10 = Figma.
- **Semantics** (Chrome accessibility tree): one `h1` on the page; title is an `h2` read as "Six disciplines. One standard."; six card titles are `h3`. Two `list`s each own 3 `listitem`s; the hidden `card_primary_items` lists are `display: none` and not exposed. `figure` holds `blockquote` + `figcaption` (name, role, company). The image has alt text. The six links have the names "View <role> experts" and the visible "View" is `aria-hidden`.
- **Keyboard and hover:** Tab goes left column then right column, then on to the next section. Every card link shows a 2 px ring at 3 px offset, only on `:focus-visible`. Hover shows the card's gradient hover (`hover-1512-crop.png`, `focus-0-crop.png`).
- **Lumos:** flat `spotlight-grid_wrap.u-theme-light` › `_contain.u-container` › own classes + `u-text-style-*`. All sizes are in rem; there are no px. Spacing, radius and colours come from variables / theme (`u-theme-brand` on the panel). Columns are `minmax(0,1fr)`. `data-section="light"` and `data-spotlight-grid` are set. Default blockquote and figcaption margin and border are reset (computed 0).
- **Code:** no embed, `<style>`, `<script>` or inline `style` in the section. Nothing outside the section refers to it. No console errors.
- **Photo:** WebP, 84 KB, loads, not stretched (598 × 399 at 1512). `sizes="100vw"` makes desktop at 1× fetch the 1200 px file for a 598 px slot. That is Webflow's automatic attribute and only a few KB, so it is not worth a change.

### Could not check
- **Props:** names, folders, defaults (Image default, Image Alt), tooltips, the slots' Allowed components, and whether the Title / Quote props are bound as the decision says. The Webflow API answers 404 for site `6ae35364a38b2d71cab8c607` on the connector this reviewer has. This needs the claude.ai connector (`846065a5-…`) or a Designer look.
- **Component definition vs instance:** whether any content is fixed inside the definition instead of a prop. This also needs the API.
- **Hover after a tap on a real phone:** only WebKit emulation was used, without a tap test.

Evidence (session scratchpad, not committed): `/private/tmp/claude-501/-Users-aniek-Projecten-HumAIn-Recruitment/b73ecf60-2394-467c-90b0-ed611bc57f51/scratchpad/spot/` holds `report.json`, `spotlight-<width>.png`, `distances.md`, `crop-991-photo.png`, `crop-402-photo.png`, `webkit-iphone15.png`, `webkit-panel.png` and `interact/` (rest, hover and focus shots). Extra widths are in `…/scratchpad/spot2/report.json`.
