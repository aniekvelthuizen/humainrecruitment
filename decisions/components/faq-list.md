# FAQ List (`FAQ List`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 12. Figma export: `references/figma/rest-of-site/faq/` and `rates/` (`Content / Fee row` compact and expanded), instance `pages/09-rates/section-04`. Built by Aniek Velthuizen, via Claude.
Component **`a3077e3f-11d6-4c60-f99b-2f0ccd862b5f`**.

## 2026-11-05 — Structure
`section.faq-list_wrap` (`data-faq-list`, `data-space-top` = Space Top) › `faq-list_contain.u-container` › `faq-list_header.u-text-trim-off` (eyebrow, h2 at H1 size, text) · `faq-list_list` (max 57rem = Figma 912, centred) › **Accordion List**, variant Outline, Open By Default 1 · embed `u-embed-css` (Space Top only). Plain section, as Fee List. Figma 192 top and bottom on the component, 0 top on Rates: Space Top `none` there.

## 2026-11-05 — The Lumos Accordion itself, with a variant
Kit rule: a type Lumos ships is built in the original. The base stays as it is for Example Components, so both parts get a variant **Outline**, own styles only:
- Accordion List `580398cf-c535-c303-80aa-b257024ee85d`: no 1 px and negative margin at the top, gap `space/2`.
- Accordion Item `96f85b6e-e296-e3bc-c332-d7ccd33051a4`: border and radius on `accordion_component`, border `swatch/dark-900-o50` on hover (no hover in Figma; the brief asks for one), answer Text Large size at `swatch/dark-900-o50`.
Behaviour is Lumos' own: the script already takes a Collection List out of the slot, so `accordion_list` › `accordion_item` is a clean list once it has run. Enter, Space and focus come from the real `button`; `aria-expanded`, `aria-controls` from the script. Needs GSAP: on for the site.

## 2026-11-05 — Plus and minus are new elements in Accordion Item
Figma draws two 2 px lines in 32 × 32; Lumos has one arrow that a variant cannot swap. So `accordion_toggle_icon` holds a new `span.faq-list_plus` (`aria-hidden`, `display: none` in the base, shown in Outline) › `faq-list_line` + `faq-list_cross`. Outline hides the arrow with `visibility`, not `display`, because variant styles do not reach a nested instance. `faq-list_cross` is `rotate(calc(90deg * --_state---true))`: vertical at rest, flat on the line when open, 200 ms. `--_state---true` is 1 at rest on this starter. Line colour Theme `text`; Figma has a loose black.

## 2026-11-05 — Spacing of an open row
Figma: closed 98, open 174, 16 from question row to answer. The button's lower 32 would be 16 too many when open, and a state calc on padding is not safe through the API. So 16 under the button + 16 on `accordion_component` make the closed 32; open, the answer sits 16 under the row. The text is trimmed by Lumos, so `accordion_content_padding` has 0.5rem on top and 1.49rem under it, measured so the open row is exactly 174.

## 2026-11-05 — A question without an answer is not listed
Collection List on FAQ (`6aec7e08d367294edf22387c`), sort `order` ascending, filter `answer` is set, all in one write. Item: Accordion Item Outline, Heading = `name`, Paragraph = `answer`. List `faq-list_items`, empty state `faq-list_empty` (`display: none`).
Why the filter: a row that opens on nothing looks broken, and the kit warns that an empty bound source can show a nested default. Accordion Item's default is Lorem ipsum; changing that default touches its instances on Example Components. The filter needs no code and no Designer step, and a question appears the moment it gets an answer.
Consequence: a question shows once it has an answer. All five show on staging (audit `references/audit/2026-11-05-phase-4.md`).

## 2026-11-05 — Measured (staging, audit `references/audit/2026-11-05-phase-4.md`; the List and Icon rows only in the local simulation)
| Where | Figma | Built |
|---|---|---|
| List | 300, 197, 912 wide | same |
| Rows | 174, 98 × 4, gap 8 | same |
| Section | 987 | 987 |
| Icon | 1155, 32 × 32 | same |
On staging: all five questions with answers, only the first open at load; click opens one and closes the previous; second click closes; Enter and Space toggle; Tab shows a 2 px outline, no ring after a mouse click; plus and minus work, arrow hidden. No sideways scroll at 1512, 1280, 992, 768, 402, 320.

## 2026-11-05 — Known
- Lumos' first-paint rule `.accordion_item:nth-child(1)` matches every item while they still sit in their own `w-dyn-item`, so all answers can be open until `DOMContentLoaded`. Only in the first moments, and the block is far below the fold on Rates. Not changed: it is Lumos' own embed.
- Check on staging after publish: `w-variant-…` on `accordion_list`, the `faq-list_cross` transform in the published CSS, the filter and the rich-text binding. The simulation cannot prove these.
