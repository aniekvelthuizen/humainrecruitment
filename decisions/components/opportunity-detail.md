# Opportunity Detail (`Opportunity Detail`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 14. Figma export: `references/figma/rest-of-site/opportunity-more/` (`Page content`); pages `13-opportunity-detail`, `m13-opportunity-detail`. Built by Aniek Velthuizen, via Claude. Not yet seen on staging: checked by API read-back and a local simulation.
Component **`d93a49d2-c282-7055-9cba-4f71faabe629`**. Instance `21da4c26-5412-6531-549d-e5f47f57b947` on the Opportunities template (`6aec7e040edff92198cfc345`), after Page Header `464b92cf-38e8-b512-cc40-c6a2d7130a62`.

## 2026-11-05 — Structure: plain section, like the neighbours
`section.opportunity-detail_wrap.u-theme-light` (`data-section="light"`, `data-opportunity-detail`) › `_contain.u-container` › `_layout` (grid `minmax(0,49.625rem) 27.5rem`, space-between) ›
- `_content` › 4 × `_section.u-text-trim-off` › h2 `_title.u-text-style-h3` · Rich Text `_rich.u-rich-text.u-text-style-large.u-text-trim-off`
- `_aside` › `_apply` (sticky, `top` = `nav/height-total`) › `_apply-header.u-text-trim-off` (h2 `_apply-title.u-text-style-h4` · p `_apply-text.u-text-style-main` › span + span `_apply-location`) · FormWrapper `_form-block` › form `_form`
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
9 of the 12 items have empty detail fields. The API cannot set "is set" conditions, and the brief rules out a custom-code route, so until the Designer pass an empty section still shows its heading. The condition goes on each `_section` in the definition, on the component's own Text prop.

## 2026-11-05 — Rich text
Owned in the embed under `[data-opportunity-detail]`, global `u-rich-text` untouched. Paragraph to list `space/4`. `ul` has the Icon Set check as a mask: 30 × 30 with 34 indent, list gap `space/2`. ≤ 767: Text Main (mode on the combo), 20 × 20, 24 indent, line height 1.25, list gap `space/4`.
Figma differs per block (title to text 10 or 16, Offer's list gap 8 on phones); one value is used for all four, so Requirements is 275 (Figma 281) and Offer 237 (Figma 231). The section total stays 1190.

## 2026-11-05 — Native form "Opportunity Application"
Form name **Opportunity Application**, id `wf-form-Opportunity-Application`. Lumos Form Input ×3 (submission names Full Name, Email, Phone), native upload (name `CV`), Button Main as submit (Button Type off, empty Link). All four are required, as the Resume form; Figma draws no marks. Never submitted.
Job title: a plain `input type="hidden"` with `name` and `data-name` = Job Title, `value` bound to the Job Title prop. The API allows this. For the Bullhorn hook: read it from the submission.
Upload and messages reuse Form Section's classes (`form-section_upload*`, `_success`, `_error`), so there is one look; those classes are not edited here. Form Section's embed is not on this page, so its upload and error rules are repeated, scoped. Also `margin-bottom: 0` on the upload: Webflow's `.w-file-upload` adds 10 px.

## 2026-11-05 — SEO
Page title `name`, description `intro`, written through `data_pages_tool` with `{{wf {"path":"…","type":"PlainText"\} }}` and read back. An item without `intro` has no description.

## 2026-11-05 — Measured (local simulation: published CSS + these rules, on the live template; nothing published yet)
| At 1512 | Figma | Built |
|---|---|---|
| Section | 1190 | 1190 |
| Text column | x 64, 794 wide | same |
| Sections | 115, 275, 281, 231 | 115, 275, 275, 237 |
| Apply card | x 1008, 440 wide, high 721 | same x and width, high 752 |
The card's extra height is mostly the labels: 76 here against 67. The published CSS still has the old label; unit 10b's shared field look is not in it. To re-measure after publishing. Upload 188 (Figma 186), as Form Section.
Sticky: the card stops at 80 from the top and ends 96 above the section bottom. No sideways scroll at 1512, 1100, 992, 800, 402, 320. With all four sections removed the section is 944 and the form stays on the right, with an empty left column.
At 402 the section is 2056 (Figma 1978), with labels and the upload text as the difference: "Drop your CV here or browse" takes two lines because the shared class keeps 32 padding (box 218, Figma 186).
A card taller than the window minus 80 shows its bottom only when the section ends.

## 2026-11-05 — Upload as Form Section; error rules global (Aniek Velthuizen, via Claude)
The three field `:user-invalid` rules left this embed: `Global | Custom Code` holds them. Added under `[data-opportunity-detail]`, the same as Form Section's embed: input fills the box (`width/height: 100%` `!important`), 2 px focus outline on the upload's `:has(label:focus-visible)`, ✕ 44 × 44, `min-height` 11.75rem stays once a file is chosen. The upload's own red border stays here. Not published yet.
