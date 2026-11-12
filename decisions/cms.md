# CMS

Collections on Humain (`6ae35364a38b2d71cab8c607`). Field list per collection: `references/cms.json`. Built 2026-11-05 by Aniek Velthuizen, via Claude (unit 2 of `references/plans/2026-11-05-rest-of-site.md`).

| Collection | Id | Slug | Template page |
|---|---|---|---|
| Opportunities | `6aec7e040edff92198cfc32a` | `opportunities` | `6aec7e040edff92198cfc345` |
| Cases | `6aec7e05025946a8d8301af4` | `cases` | `6aec7e07025946a8d8301ba5` |
| Rates | `6aec7e0776c2f357ba063c82` | `rates` | `6aec7e0776c2f357ba063cca` |
| FAQ | `6aec7e08d367294edf22387c` | `faq` | `6aec7e08d367294edf2238c5` |
| Team | `6aec7e093f98170046290894` | `team` | `6aec7e093f981700462908c0` |
| Client Logos | `6af611306da4efb79ce4a646` | `client-logos` | — |
| Experts (untouched) | `6ae719db261aa6a726507c82` | `experts` | `6ae719db261aa6a726507c88` |

## Field slugs

- **Opportunities:** `name`, `slug`, `job-type`, `discipline`, `sector`, `location`, `location-filter`, `experience`, `salary`, `intro`, `about`, `responsibilities`, `requirements`, `offer`, `internal`, `summary`, `featured`, `bullhorn-id`
- **Cases:** `name`, `slug`, `sector`, `text`, `image`, `image-alt`, `order`
- **Rates:** `name`, `slug`, `description`, `price`, `order`
- **FAQ:** `name` (shown as Question), `slug`, `answer`, `order`
- **Team:** `name`, `slug`, `role`, `bio`, `photo`, `photo-alt`, `group`, `order`

## Option ids

An option field stores the id, so a list filter and a script need these.

| Field | Value | Id |
|---|---|---|
| Opportunities `job-type` | Permanent | `369d66987200ab8acd265d9795cb9b8a` |
| | Secondment | `746b33b2bb7d40d34e868bcb9aae773e` |
| | Project basis | `62399e19e309526b0c9c1a5096ea7d64` |
| | Full-time | `876dfdab0490511323c2bbb3835b54d3` |
| Opportunities `discipline` | Cost Control | `e13b65cadfff58167af707f0530e3023` |
| | Planning & Scheduling | `a7b207c922b2dbcd05ea2437204f357d` |
| | Risk & Performance | `d4155f9041ccb1a9631a9009bcaf727a` |
| | Reporting & Dashboards | `86c30f74233a1db041c4fd861cabb385` |
| | Document Control | `f01a6d69a05dce8f1602360432f32210` |
| Opportunities `sector` | Energy | `9de03c8ff37c447af19d9d2484895056` |
| | Oil & Gas | `9ba2bc7094fa50d2de2f8f22bef0ad10` |
| | Infra | `2004920d477ea5c307b891e83caf4cd9` |
| | Renewables | `e1ebd906fb7f484cc59d7e96e6ce7a28` |
| | Recruitment | `af498dbb2b22bc09edaf0d377dcf7d1d` |
| | Delivery | `775e9c7556f4ca1cb48ec238c080adbd` |
| | Platform | `330d1ad64fa1e2eb5d20b30abb205abd` |
| Opportunities `location-filter` | The Netherlands | `5d21985db110c1195bb8fb5ea5cc7c95` |
| | International / remote-friendly | `6e16d987c7e0dfd26a76fcbb83cb791b` |
| Team `group` | Team | `1cc6216cb35565a8ca221250e5a4fcc2` |
| | Discipline | `db1632ef4b77f17c5e957826209c1ea6` |

## 2026-11-05 — How the Figma card maps onto the fields
Conflict: the plan names the fields, not which card text goes where.
Choice (Aniek Velthuizen, via Claude):
- Card tag 1 = `job-type`, tag 2 = `sector`. Meta rows = `location`, `experience`, `salary`.
- Internal vacancy card: tag 2 (Recruitment, Delivery, Platform) is also `sector`, and its second meta row (Recruitment, Client delivery, Engineering) is `experience`. `discipline` and `salary` stay empty.
- Detail header: `intro` is the text; tags are `job-type`, `discipline`, `sector`.
- `location-filter` holds the wide value the filter matches (and the detail page can show): "The Netherlands". `location` holds the exact text on the card: "Rotterdam, NL (hybrid)".
- "rich text ×4" in the plan = `about`, `responsibilities`, `requirements`, `offer`. `intro` is plain text: it is one line in the header.
Why: the same card binds the same fields in both lists, and the internal tags stay out of the discipline filter on Opportunities, which does not list internal vacancies.

## 2026-11-05 — Option values
Choice (Aniek Velthuizen, via Claude): every value is copy from Figma.
- `job-type`: tags on the Opportunities and Careers cards.
- `sector`: tags on the cards (`Infra` as written there, not "Infrastructure"), plus `Renewables` from the Opportunities header text. No sample uses `Renewables` yet.
- `discipline`: `Cost Control` from the detail page tag; the others are the titles on Consulting Services (Planning & Scheduling, Risk & Performance, Reporting & Dashboards) and Home (Document Control). Figma never shows the open dropdown, so this list is a recommendation for the owner to confirm.
- `location-filter`: "The Netherlands" from the detail page, "International / remote-friendly" from the card.
Why: the header filters only show "All disciplines", "All locations" and "All types" in Figma, so the values had to come from the rest of the copy.

## 2026-11-05 — Other field choices
Choice (Aniek Velthuizen, via Claude):
- Cases `sector` is plain text, as the plan has no option there.
- Group Discipline in Team: `name` is the role title, `bio` the text, `role` empty.
- The Name field of FAQ is shown as "Question"; its slug stays `name`.
- Required: Job Type and Location (Opportunities); everything except `answer` (FAQ) and `role` (Team) in the other four. Opportunities stays loose because Bullhorn will fill it later.
- Each field has a short help text, in English (house rule), so the client can fill the CMS without us.
Why: owner, 2026-11-05: the client must be able to fill this easily; fields may change when Bullhorn comes.

## 2026-11-05 — Sample items to remove before go-live
No Name marks an item as a sample, so this list is the record. All are set to not-draft and publish with the site. None is published yet.

**Opportunities samples, 9 items.** Figma shows 3 different cards, 3 times each. They were all made, so the list and Load more can be tested.

| Name | Slugs | Id (same order) | Featured |
|---|---|---|---|
| Project Controls Manager | `project-controls-manager`, `-2`, `-3` | `6aec7f503c59bbed65adb6ca`, `…b6c4`, `…b6be` | first only |
| Senior Cost Engineer | `senior-cost-engineer`, `-2`, `-3` | `6aec7f503c59bbed65adb6c8`, `…b6c2`, `…b6bc` | first only |
| Planning / Scheduling Engineer | `planning-scheduling-engineer`, `-2`, `-3` | `6aec7f503c59bbed65adb6c6`, `…b6c0`, `…b6ba` | first only |

`discipline` on Senior Cost Engineer (Cost Control) and Planning / Scheduling Engineer (Planning & Scheduling) is chosen from the title; Figma only shows it on Project Controls Manager.

Created in reverse order, so "Created On, newest first" gives the Figma order: Manager, Cost Engineer, Planning, three times.

**Internal vacancies from Careers, 3 items** (`internal` on). Also Figma copy; the client decides if they are real.

| Name | Slug | Id |
|---|---|---|
| Recruitment Consultant — Project Controls | `recruitment-consultant-project-controls` | `6aec7f503c59bbed65adb6b8` |
| Account & Delivery Manager | `account-delivery-manager` | `6aec7f503c59bbed65adb6b6` |
| Data / AI Engineer — Talent Platform | `data-ai-engineer-talent-platform` | `6aec7f503c59bbed65adb6b4` |

The other collections hold Figma copy too: Cases (3), Rates (5), FAQ (5), Team (9). They get final content from the client.

## 2026-11-05 — FAQ answers from hidden Figma layers (Aniek Velthuizen, via Claude)
Four answers came from hidden layers in Figma, so nobody has seen them on the design: replacement guarantee, upfront charge, secondment pricing, fixed project price. They commit the client to terms, so **they need the client's confirmation before go-live**.
Written and published as CMS items only, 2026-11-05. The FAQ list keeps its "answer is set" filter, so a later item without an answer stays off the page.

## 2026-11-05 — Getty-watermarked placeholder photos
Must be replaced before go-live (plan, conflict 4).

- **Cases, all 3:** `80m-epc-forecast-rebuilt-in-6-weeks`, `-2`, `-3`.
- **Team, Group Discipline, all 5:** `project-controls-manager`, `cost-engineer-controller`, `planning-scheduling-engineer`, `risk-performance-manager`, `reporting-dashboard-specialist`.
- **Assets holding the same pictures,** to delete at the same time: `case-sample-1`, `-2`, `-3`, `discipline-project-controls-manager`, `discipline-cost-engineer`, `discipline-risk-performance`, `discipline-reporting-dashboard`.
- `photo-profile.jpg` (`6ae48f502dcb1237cd790622`, from 2026-10-30) is byte for byte the Planning / Scheduling photo, so it was reused as the source. It has the watermark too, and other blocks may use it: check it before go-live.

Team, Group Team (`floyd`, `head-of-delivery`, `lead-recruiter-controls`, `head-of-platform`): no watermark visible on the photos, but they are Figma placeholders and need real portraits.

## 2026-11-05 — Images
Seen: Webflow copies an image into its own CMS file store when an item is saved. The item's `fileId` and URL differ from the asset's (`…/6ae719db261aa6a726507c70/…`), and the upload stays in Assets unused. The 11 assets `case-sample-*`, `discipline-*`, `team-*` can be deleted without touching the items.
Choice (Aniek Velthuizen, via Claude): team PNGs had no transparent pixels (alpha 255 throughout), so they are JPEG quality 80 at 630 wide (63–85 KB). The other photos are the Figma originals (509 × 339, 25–49 KB): smaller than 2× display width, so not converted or enlarged, and they will look soft at card size.
Why: agent brief, Images.

## 2026-11-05 — Template pages stay published
Conflict: the plan wants the templates without a design (Cases, Rates, FAQ, Team) as draft.
Seen: the API refuses. `update_page_settings` answers 400 "Collection template pages can't be drafted". `bulk_update_pages` answers success but changes nothing: `draft` reads back false on all four.
Result: each item in these collections gets an empty page on publish (`/cases/<slug>`, `/rates/<slug>`, `/faq/<slug>`, `/team/<slug>`). Opportunities keeps its template. Experts already works this way.
Open: for the owner, as this is not settled by the API alone; see the unit report.

## 2026-11-12 — Reviews collection
Collection Reviews (`6af5eab6b7bd7e385981a9f8`, slug `reviews`): name, slug, quote (RichText), role, company, avatar. Used by `Reviews · picked` (`decisions/components/reviews-picked.md`). Its template page `/reviews/<slug>` answered 404 on staging on 2026-11-12 (reviewer). Aniek Velthuizen, via Claude.

## 2026-11-12 — Client Logos collection
Collection Client Logos (`6af611306da4efb79ce4a646`, slug `client-logos`): name, slug, logo (Image), order (Number). Used by `Client Logos · all` in Logo Marquee (`decisions/components/hero-experts.md`). Field slugs: `name`, `slug`, `logo`, `order`. Aniek Velthuizen, via Claude.
