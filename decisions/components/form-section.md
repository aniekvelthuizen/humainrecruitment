# Form Section (`Form Section`, group Sections)

Plan: `references/plans/2026-11-05-rest-of-site.md`, unit 10. Figma export: `references/figma/rest-of-site/forms/` (`Static / Contact form`, `input`, `input-simple`, `Contact / Detail item`); pages `10-contact/section-03`, `11-resume/section-03`. Built by Aniek Velthuizen, via Claude.
Component **`1c5ca891-8edd-9615-09ff-aac5f2406f90`**. Not yet seen on staging: checked by API read-back and a local simulation.

## 2026-11-05 — Two types, two native forms
Variant **Contact** (base), **Resume** (`46888083-5718-1083-dfab-923de9169ce9`). The definition holds both forms; the variant only toggles `display` on `form-section_form-contact`, `_form-resume`, `_details`, `_map`, `_panel`.
Why: the fields differ, so each form needs its own name. A variant cannot change a visibility setting, and two extra booleans could disagree with the variant. Cost: the hidden form is in the page's HTML, and hidden, so it never submits or blocks.
Form names, for the Bullhorn hook: **Form Section Contact**, **Form Section Resume** (`data-name`; ids `wf-form-Form-Section-…`). Webflow's own handling, `method` get as Lumos Contact Form. Fields have a Submission Name: First Name, Last Name, Email, Phone, Contacting As, Message; First Name, Last Name, Email, Phone, Discipline, Availability, Notes, CV.
Lumos Contact Form itself is not used: it is a closed form with its own fields and name. Form Input, Form Select, Form Select Option, Form Textarea and Button Main are. No checkbox or fieldset in the design, so none here.

## 2026-11-05 — Structure
`section.form-section_wrap.u-theme-light` (`data-section="light"`, `data-form-section`, `data-space-top` = prop) › `_contain.u-container` › `_layout` (two `minmax(0,1fr)`, gap `space/7`; one column ≤ 991, row gap `space/8`) ›
- `_main.u-text-trim-off` › h2 `_title` · FormWrapper `_form-contact` / `_form-resume` › FormForm `_form` › `_row` (flex; column ≤ 479) with the Lumos fields · `_footer` › p `_note` + Button Main · `_success` · `_error`
- `_aside` › `_details` › 4 × `_detail` · `_map` › Visual Image (Cover) · `_panel` › h3 `_panel-title` + `_list` › 4 × Card Bullet Large
- HTML embed `u-embed-css`
Plain section with its own wrapper, as Split Content and CTA Split. Closed: field labels and options live in the definition (slot children are baked in), so the forms stay one set.

## 2026-11-05 — Fields: scoped CSS, not the global class
Rest: border `swatch/dark-900-o25`, white, placeholder `dark-900-o50`, radius and 48 height as `form_field`. Labels 12 semibold uppercase, no required star (Figma draws none; `required` stays on the field). Hover border `brand-500` (Figma state=hover). Focus border plus a 2 px inner outline in `brand-500` (Figma state=focus, stroke 2 inside). Textarea 182 high.
Written in the embed under `[data-form-section]`, because `form_field` is shared and not this unit's. **Other forms on the site do not get this look**; see the report.
Field text is 20 as Figma; ≤ 1199 it is 16, so `you@company.com` fits a half-width field.

## 2026-11-05 — Unit 10b: field look moved to the shared classes (Aniek Velthuizen, via Claude)
Replaces the entry above. Rest, hover, focus, placeholder, label, no star, select and textarea sizes now sit on `form_field`, `form_field.is-textarea`, new `form_field.is-select`, `form_label_text`, new `form_label_required` (on the star span in Form Label Text), so every Lumos Form field gets them: units 13 and 14, Example Components, Password. Fixed dark text on `form_field` and `form_select_wrap`: the field is always white, and on a dark section inherited text would be white on white.
Kept in the embed: 16 px at 992–1199 (no Webflow breakpoint there; ≤ 991 is on the class). The error state was here too, and moved to `Global | Custom Code` in unit 4a-3: `:user-invalid` is no class state in the API or the Designer. Literal: `outline-width` .125rem (= `focus/width`; the API refuses the variable).
Compared with the published /contact and /submit-resume in a local simulation at 1512, 1100, 800, 402: no differences.

## 2026-11-05 — Error state
Figma has no error state on `input`, only a hidden helper line (`Colors/Semantic/Error dark`, 14/21, icon, «Alert / Error message»). Built with `:user-invalid`, so nothing turns red before the visitor has touched the field: border and label in that colour, plus a line under the field. The browser's own validation bubble still explains on submit.
The colour is the literal `#b91c1c`: the site has no variable for it. The line's text «Please check this field» is a placeholder for the owner; no icon.

## 2026-11-05 — CV upload is native
The API accepts `FormFileUploadWrapper` and sets the input's name (`CV`), id and required. Restyled with own classes, so the drop area follows the design: dashed border, Icon Set **CV Submission**, «Drop your CV here or **browse**», «PDF or Word · max 10MB».
Native upload has no drag area, so `_upload-input` covers the whole box: the browser accepts a dropped file on a file input, and a click opens the picker. No script.
Own classes never set `display` on the upload's state wrappers: webflow.js toggles them with inline `display` (`w-hidden` stays on them, corrected 2026-11-05).
Allowed file types have no API setting: Designer step in the report. Box 188 high (Figma 186): Figma's stroke is inside.
**Correction:** the published field name is not CV. It publishes `name="file" data-name="File"` until the Name is retyped in the Designer; only the API and the Forms list say CV. Map the Bullhorn hook to what a test submission shows.

## 2026-11-05 — Unit 4a-3: review fixes (Aniek Velthuizen, via Claude; not published, measured as a local simulation on the published pages)
Error state: the three `:user-invalid` field rules moved to `Global | Custom Code` (`decisions/site.md`), so this embed no longer holds them; the upload's own red border stays here.
Upload, in the embed: webflow.js forces the input to 1 px wide, so `width/height: 100% !important`; it now covers 674 × 186, so a drop lands in the field and every edge opens the picker. `margin-bottom` 0 (Webflow's `.w-file-upload` adds 10): upload to first label 42 → 32. Keyboard focus: 2 px inner outline, `focus/width` and `focus/offset-inner`, as the fields. ✕ is 44 × 44 with negative margins, so the file row keeps its height. Box stays 188 once a file is chosen, content centred. The selector is `_upload-default[style*="none"]`, because webflow.js sets inline `display` and leaves `w-hidden` on: no class changes to key on. Upload input id back to `file` (wrong, corrected below: the label points at `CV-2`).
Under submit: Webflow appends an unclassed Turnstile div that took the form's 32 gap; `[data-form-section] form > div:not([class])` is `position: absolute`. Contact at 1512 is 926, as Figma.
Placeholders on First and Last name: Figma's text is empty, so they are blank. Custom Placeholder holds one space: with no override, Form Input publishes its own «First Name». To check in the published HTML.

## 2026-11-05 — Submit buttons
Button Main with Button Type off and Link set to an empty URL: Clickable renders `<button type="submit">` only when the URL is empty. `type: null` only reset it to the default `#`, which would render a link that does not submit. Check the published HTML.

## 2026-11-05 — Details, map, panel
Details grid `repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr))`: two columns at 1512, one when the email no longer fits. Values wrap anywhere on narrow phones. Plain text as Figma, no `mailto:` or `tel:`.
Map asset `6aec90c88eaaba525302ea52`: the Figma image is a screenshot of a map tool with its panels, and the frame crops it. Cropped to the same part (1968 × 1007 from 870, 680, then 1352 wide), JPEG 183 KB. Figma's 13 px strip of the tool's panel at the left edge is left out. Height 346, 256 ≤ 767.
Panel 676 wide; Figma's is 708, past the page margin.

## 2026-11-05 — Spacing
Top `site/margin` (64) as Figma, not the neighbours' section-space; bottom `section-space/large`, `main` ≤ 991. Prop **Space Top**: default `margin`, or `large` / `main` / `none` as on Split Content.

## 2026-11-05 — Props
Variant · Content: Title, Note, Button Text · Contact Details: Email, Phone, Office, Hours, Map Image, Map Alt · Resume Panel: Panel Title, Bullet 1–4 · Layout: Space Top. Note and Button Text feed both forms.

## 2026-11-05 — Copy not in Figma
Select options come from `wireframes/contact.html` and `wireframes/submit-resume.html`; Discipline uses the list in `decisions/cms.md` so form and filters agree. Figma shows «A company looking to hire» under Discipline: a copy slip, not used. Success and error messages are Webflow's defaults. Required: everything except Contact's Phone and Resume's «(optional)» field; selects always have a value.

## 2026-11-05 — CV name and allowed types set (Aniek Velthuizen, via Claude)
Name retyped in the Designer, allowed types Custom `.pdf, .doc, .docx`, on this form and on Opportunity Detail's. Retyping rewrites the input's ID; it was set back (`file` here, `cv` there), which broke the label, corrected below. `accept` and `data-name="CV"` are confirmed in the published HTML.

## 2026-11-05 — Upload input id is `CV-2` (Aniek Velthuizen, via Claude)
Correction: `label for` did not resolve. Published: `label for="CV-2"`, `name="CV-2"`, `data-name="CV"`, with input `id="file"` here and `id="cv"` on Opportunity Detail, so `label.control` was null (audit `references/audit/2026-11-05-phase-4.md`). Visitors did not notice: mouse, Enter and Space go through `webflow.js`, which clicks the input itself, not by id.
Now `domId` = `CV-2` on both inputs, set by API, case kept, read back. Nothing depends on the old ids: no `#file` or `#cv` in this embed, Opportunity Detail's or any published page; the upload rules select by class. `data-name` CV is the submission key, the published `name` differs. To check after publishing: `for` and `id` still match in the HTML of /contact, /submit-resume and a detail page, because the Designer can rewrite the id when the Name is retyped. The owner's one real test submission should show CV in the Forms tab.
