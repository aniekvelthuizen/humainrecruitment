# Opportunity Detail (`Opportunity Detail`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 14. Figma export: `references/figma/rest-of-site/opportunity-more/` (`Page content`); pages `13-opportunity-detail`, `m13-opportunity-detail`. Built by Aniek Velthuizen, via Claude. Seen on staging: audit `references/audit/2026-11-05-phase-4.md`, fixes below not published yet.
Component **`d93a49d2-c282-7055-9cba-4f71faabe629`**. Instance `21da4c26-5412-6531-549d-e5f47f57b947` on the Opportunities template (`6aec7e040edff92198cfc345`), after Page Header `464b92cf-38e8-b512-cc40-c6a2d7130a62`.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.opportunity-detail_wrap.u-theme-light` (`data-section="light"`, `data-opportunity-detail`) › `_contain.u-container` › `_layout` (grid `minmax(0,49.625rem) 27.5rem`, space-between) ›
- `_content` › 4 × `_section.u-text-trim-off` › h2 `_title.u-text-style-h3` · Rich Text `_rich.u-rich-text.u-text-style-large.u-text-trim-off`
- `_aside` › `_apply` (sticky, `top` 7.5rem, see "Fixes after the phase 4 audit") › `_apply-header.u-text-trim-off` (h2 `_apply-title.u-text-style-h4` · p `_apply-text.u-text-style-main` › span + span `_apply-location`) · FormWrapper `_form-block` › form `_form`
- HTML embed `u-embed-css`

`u-text-trim-off` only resets the element and its direct children, so it sits on the block that holds the texts. On the outer wrappers it made the title and the line under it overlap in the simulation.

## 2026-11-05 — Props and CMS binding
About / Responsibilities / Requirements / Offer: Title (Figma copy) and Text (rich text, default empty). Apply: Title, Job Title (string), Location, Button Text. Bound on the instance: the four Text props to the rich-text fields of the same name, Job Title to `name`, Location to `location-filter`.

## 2026-11-05 — Page Header on the template
Choice (recommended; on the owner's list):
- Title `name`, Text `intro`, tags `job-type`, `discipline`, `sector`, as `decisions/cms.md`.
- Row 1 (Location) = `location-filter`, as Figma's "The Netherlands". The cards show the exact `location`.
- Row 2 (prop Sector, school icon) = `experience`. Figma draws "Oil & Gas Sector" next to a tag "Energy", but the CMS has one `sector`, already the third tag; the same icon means experience on the card, and the header would otherwise not show it.
- Row 3 = `salary`.
- Row 4 (Language) is an empty override: no CMS field holds "NL & EN required", and the default must not show. Page Header's embed hides a row with empty text.

## 2026-11-05 — Empty sections are a Designer condition
9 of the 12 items have empty detail fields. The API cannot set "is set" conditions, and the brief rules out a custom-code route, so it went on each `_section` in the definition in the Designer pass, on the component's own Text prop. Staging: Senior Cost Engineer has none of the four in the DOM, Project Controls Manager all four, and `_content` is truly empty when none shows.

## 2026-11-05 — Rich text
Owned in the embed under `[data-opportunity-detail]`, global `u-rich-text` untouched. Paragraph to list `space/4`. `ul` has the Icon Set check as a mask: 30 × 30 with 34 indent, list gap `space/2`. ≤ 767: Text Main (mode on the combo), 20 × 20, 24 indent, line height 1.25, list gap `space/4`.
Figma differs per block (title to text 10 or 16, Offer's list gap 8 on phones); one value is used for all four, so Requirements is 275 (Figma 281) and Offer 237 (Figma 231). The section total stays 1190.

## 2026-11-05 — Native form "Opportunity Application"
Form name **Opportunity Application**, id `wf-form-Opportunity-Application`. Lumos Form Input ×3 (submission names Full Name, Email, Phone), native upload (`data-name` CV, the submission key; input id `CV-2`), Button Main as submit (Button Type off, empty Link). All four are required, as the Resume form; Figma draws no marks. Never submitted.
Job title: a plain `input type="hidden"` with `name` and `data-name` = Job Title, `value` bound to the Job Title prop. The API allows this. For the Bullhorn hook: read it from the submission.
Upload and messages reuse Form Section's classes (`form-section_upload*`, `_success`, `_error`), so there is one look; those classes are not edited here. Form Section's embed is not on this page, so its upload and error rules are repeated, scoped. Also `margin-bottom: 0` on the upload: Webflow's `.w-file-upload` adds 10 px.

## 2026-11-05 — SEO
Page title `name`, description `intro`, written through `data_pages_tool` with `{{wf {"path":"…","type":"PlainText"\} }}` and read back. An item without `intro` has no description.

## 2026-11-05 — Measured (staging, audit `references/audit/2026-11-05-phase-4.md`)
| At 1512 | Figma | Built |
|---|---|---|
| Section | 1190 | 1190 |
| Text column | x 64, 794 wide | same |
| Sections | 115, 275, 281, 231 | 115, 275, 275, 237 |
| Apply card | x 1008, 440 wide, high 721 | same x and width, high 725 |
Upload 188 (Figma 186), as Form Section. Once Turnstile's script has added its unclassed div to the form, that div takes the form's 32 gap and the card is 757 (measured 2026-11-05 in a local run: 756.5 with the div in flow, 724.5 with it absolute). Form Section's embed takes that div out of the flow; this embed does not. Open, on the owner's list.
Sticky on staging: stopped at 80 from the top and ended 96 above the section bottom; `top` is now 120, see below. No sideways scroll at 1512, 1280, 992, 768, 402, 320. Without detail text (Senior Cost Engineer) the section is 941 and the form stays on the right, with an empty left column of 794.
At 402 the section is 2029 (Figma 1978), with labels and the upload text as the difference: "Drop your CV here or browse" takes two lines because the shared class keeps 32 padding (box 218, Figma 186).
A card taller than the window minus 120 shows its bottom only when the section ends.

## 2026-11-05 — Upload as Form Section; error rules global (Aniek Velthuizen, via Claude)
The three field `:user-invalid` rules left this embed: `Global | Custom Code` holds them. Added under `[data-opportunity-detail]`, the same as Form Section's embed: input fills the box (`width/height: 100%` `!important`), 2 px focus outline on the upload's `:has(label:focus-visible)`, ✕ 44 × 44, `min-height` 11.75rem stays once a file is chosen. The upload's own red border stays here. Not published yet.

## 2026-11-05 — Fixes after the phase 4 audit (Aniek Velthuizen, via Claude)
Not published; checked by API read-back and a local simulation (published page + these rules).
- **Sticky card under the nav:** the nav is 118 at the bottom at 1280 and up, the card stopped at 80. `top` is the literal **7.5rem** (120 = `nav/height-total` 80 + 40): the API read `calc(var(--nav--height-total) + 2.5rem)` back as the bare variable, which would be the bug again, and nothing can be checked in published CSS now. It does not follow a later change of the nav height. Simulated at 1512 and 1280: card top 120, nav bottom 118.
- **Role without text, below 992:** `.opportunity-detail_content:empty { display: none }` in the embed, ≤ 991 only: on desktop the form would jump to the left column. Simulated on Senior Cost Engineer at 991, 768, 402, 320: form at 96 from the section top (was 128); at 1512 still at x 1008. The owner still has the 794 px blank column on desktop.
- **Upload label:** input id `CV-2`, as the published `for="CV-2"`; see `form-section.md`. Simulated: `label.control` is the input.
- **Full Name autocomplete:** not done, Designer step. `autocomplete` on Form Input is a conditional attribute driven by Input Type, which has First Name and Last Name but no full name, and the API can neither read nor write that condition. A script would be a custom-code workaround.
