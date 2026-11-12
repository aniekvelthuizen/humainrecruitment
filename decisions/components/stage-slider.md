# Stage Slider (`Stage Slider`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 5. Figma: `Content / Assessment process` (`2323:33114`), export `references/figma/rest-of-site/assessment/`; copy `pages/03-project-delivery-experts/section-04.txt`. Built by Aniek Velthuizen, via Claude.
Component **`8c873c28-68f3-0248-17ff-82a6cc6be9cb`**. Test instance: Project Delivery Experts `b5a83965-ba57-0fe1-7495-2064b1a453f1`.

## 2026-11-05 — Structure
`section.stage-slider_wrap.u-theme-brand` (`data-section="dark"`, `data-stage-slider`, `data-space-top` = prop) › `stage-slider_contain.u-container` ›
- `stage-slider_header` › `stage-slider_content.u-text-trim-off` (p `_eyebrow` Label Large · h2 `_title` H1 style › span Title, span space, wbr, br Title Break, span `_muted` · p `_text` Text Large) + `stage-slider_arrows` › 2 × button `stage-slider_arrow` › `_icon-prev` / `_icon-next` › Icon Set Chevron Right
- `stage-slider_row` › slot **Slider**
- style embed (`u-embed-css`), script embed (`u-embed-js`)
Plain section, not the Lumos Section (`page-header.md`, same route and reason). Texts untrimmed, so Figma's gaps are literal: `space/3`; header → row 3.1875rem (Figma 51).

## 2026-11-05 — The Slider sits in a slot, on the page
Hero Experts has its Slider inside the definition because a CMS list fills it. Here cards are placed per page, and the API cannot reach a nested Slider's slot through a section instance. So the definition has slot **Slider**, and each page instance holds: Lumos Slider (`Classes` = `u-gap-7`, `Controls` off) › slot Content › Visual Image + Card Primary cards › slot Items › Card Bullet.
A new instance therefore starts empty and needs that Slider placed first. Only Project Delivery Experts uses the block.

## 2026-11-05 — Slides
Fixed width through the embed, as Hero Experts: 22.125rem including the 2rem gap, so cards are 322 as Figma. Overflow Visible; the section clips (`overflow: clip`), so the row runs to the screen edge, as in Figma.
Phones: `calc(100% - 3rem)` with a 1rem gap, one slide plus a peek. The photo is the first slide there too.
Below 768 the arrows stay, under the text. Lumos' swipe, drag and arrow keys are unchanged. No loop: stages run 1 to 9.

## 2026-11-05 — Own arrows
Lumos' controls sit below the slider, Figma draws them in the header. Real `<button>`s as in Hero Experts, with the same chevron nudge on hover and focus; the script finds the Lumos Swiper and calls `slidePrev` / `slideNext`. At either end the arrow gets `aria-disabled` (stays focusable) and 40 % opacity. Reduced motion: slide speed 0.

## 2026-11-05 — Photo tile
Figma draws a cut-out PNG over a gradient (`#250059` → `#0082a6` 70 % → `#e5b8b4`). Visual Image has no class prop and sits straight in the slider, so the gradient is baked in: `stage-slider-photo.jpg` (`6aec88a26fa33b4998ba213e`, 644 × 976, 93 KB). Crop fitted against Figma's section picture. Variant Tall 2 / 3, Corners off (= `radius/main`); the embed removes the ratio and swaps the slide's padding for margin, so the tile fills the row height.

## 2026-11-05 — Props
Content: Eyebrow, Title, Title Break (default on), Title Muted, Text · Layout: Space Top (`large` default, `main`, `none`; below 992 `large` is 96) · slot Slider. Stage labels and pills keep Figma's lower-case text; the Label style sets the capitals.

## 2026-11-05 — Checked in a local simulation, not on staging
Published page plus injected classes, embed CSS and script; nothing is published yet. At 1512: eyebrow 192, title 226, text 386, arrows 1336 and 1400 at y 398, row 497, tile x 64, first card x 418: all as Figma. Row 498 high (Figma 488), section 1187 (1177): Card Bullet is 21 + 4 (Figma 19 + 4), already recorded in `cards.md`. Next and previous, arrow keys and mouse drag move the slider; arrows disable at both ends; last card ends at 1448. No sideways scroll at 1920, 1512, 1100, 800, 402; no text out of a slide.
Staging (review 2026-11-05, `references/audit/2026-11-05-phase-2.md`): the real page and touch swipe pass. Arrows, keyboard, drag and reduced motion work at 1512 and 402.

## 2026-11-05 — Review fixes (Aniek Velthuizen, via Claude)
- **Phone slides capped:** below 768 a slide is `min(100% - 3rem, 22.125rem)`, the tile that minus the gap, in the embed. Before, slides doubled from 322 to 650 at 767 and the photo became a cropped close-up. Supersedes `calc(100% - 3rem)` under Slides. Simulated on the published page: 768 tile 322 × 498; 767, 600 and 480 tile 338 × 498; 402 tile 314 × 503; 320 tile 232 × 650. No sideways scroll, no text out of a card, arrows reach both ends. Not yet seen published.
- **Arrow radius:** `stage-slider_arrow` bound to `radius/round` (same 100vw).
- **Script stays in the embed:** the arrows need it per section instance (`document.currentScript`, then that section's Swiper), and it runs only where the block is used. `decisions/site.md` names only CSS for embeds, so this is the recorded exception; adding JS to that note is for whoever edits `site.md`.

## 2026-11-12 — Photo tile follows the mouse (Aniek Velthuizen, via Claude)
Owner asked for the same mouse motion as the Spotlight Grid photos. The global photo-parallax embed handles it (img scaled 1.06, moves ≤ 8 px against the mouse, mint light on top). Details: `decisions/motion.md` › Stage Slider photo tile.
