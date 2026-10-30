# Icon Set (group SVG)

Component id `34be3826-fcbd-cc8d-b23a-ab6d5d256de6`, class `icon_set_wrap`.

## 2026-10-29 — One masked component
Choice: a div filled with `currentcolor` and masked by the icon SVG (`mask-image`, contain, centred, `aspect-ratio: 1/1`, width 100% of its holder), `aria-hidden="true"`. One variant per icon, each overriding only `mask-image`.
Why: the icon follows the text colour, theme and hover without extra classes; one instance carries one icon.

| Variant | Figma source | Asset |
|---|---|---|
| Chevron Right (base) | `chevron_right / Style=Filled` (`2028:1998`) | `6ae36cce21d63dedf557a370_icon-chevron-right.svg` |
| Arrow Right | `east / Style=Filled` (`2028:2097`) | `6ae36cceffdd1ab2d2dbee0b_icon-arrow-right.svg` |
| Arrow Left | `east`, mirrored (Figma's back button flips the group −180°) | `6ae36cceffdd1ab2d2dbee1d_icon-arrow-left.svg` |
| Location | Google Material Symbols `location_on`, Filled | `6ae394b8d9df4645cb6bf468_icon-location.svg` |
| Schedule | Google Material Symbols `schedule`, Filled | `6ae394b8087a62c21357a68d_icon-schedule.svg` |
| Euro | Google Material Symbols `euro_symbol`, Filled | `6ae394b860cac7ef69dd478a_icon-euro.svg` |

Exported with the Plugin API (`exportAsync SVG_STRING`, clean, 24 × 24), uploaded with `create_asset` + S3 POST (201).

## 2026-10-29 — Location/Schedule/Euro not from Figma
Conflict: the job-card meta rows in Figma (`12. Opportunities`) use a "Google icons" component whose `type` value is set per instance (e.g. `location`, `school`, `cost-control-forecasting`) from one large site-wide icon library; on the Opportunities cards several instances carry a mismatched value (row 1 shows `school` under "Rotterdam, NL (hybrid)", row 2 shows `cost-control-forecasting` under "12+ years experience") — leftover placeholder values from duplicating rows, not a real spec.
Choice: picked semantically-correct Google Material Symbols icons instead of copying the mismatched Figma value — `location_on` (location row), `schedule` (experience row), `euro_symbol` (salary row) — fetched directly from the Material Symbols source (`marella/material-symbols`, Filled/weight 400, same pipeline as the existing icons), not from this Figma file (no MCP access to it — see `decisions/site.md`).
Why: owner judgement call; the Figma value is visibly broken for those two rows, and Material Symbols is the same icon family the Figma file itself draws from.

## 2026-10-30 — Card icons now straight from the Figma component (previous entry was a misread)
Conflict: the entry above said the Figma meta icons were mismatched. They are not: in the component `Card / Opportunity` (`2184:5177`) the rows are `location`, `school` and `cost-control-forecasting` (€), in that order. The text layers are all *named* "Rotterdam, NL (hybrid)" while their content is "12+ years experience" / "90k – 110k" — the earlier pass read the layer names, not the text.
Choice (Aniek, via Claude): exported the Figma icons (Plugin API `exportAsync SVG_STRING`, fill set to #000 for the mask) and uploaded them. `Location` and `Euro` now point to the outline Figma versions; new variants **School** (`f7ff4d84-c9c7-68b2-e5e7-8b181bd1f52d`) and **Arrow Thin** (`a3cac204-c6f6-8dca-2493-52662757e6ae`, the 48 px `arrow_right_alt` wght 100 from the card notch). `Schedule` is no longer used by the card.

| Variant | Figma source | Asset |
|---|---|---|
| Location (replaced) | `Google icons / type=location` | `6ae44526abee85ba586c20db_icon-location-outline.svg` |
| Euro (replaced) | `Google icons / type=cost-control-forecasting` | `6ae445271fb7b95b7240d7f1_icon-euro-outline.svg` |
| School | `Google icons / type=school` | `6ae4452658b3d6d949585b6a_icon-school-outline.svg` |
| Arrow Thin | `arrow_right_alt_24dp…wght100` in `Card / Opportunity` | `6ae445277d1b8d55e11b0b15_icon-arrow-thin.svg` |

Adding an icon: export (Figma Plugin API) or fetch straight from Material Symbols (`raw.githubusercontent.com/marella/material-symbols/main/svg/400/<style>/<name>[-fill].svg`) → upload → `create_variant` → `set_variant_styles` mask-image → add a row here.

## 2026-10-30 — Service card icons
Done by Aniek (via Claude). The six Google icons used by `Card / Service` instances on real pages (Home B, Hire an expert) plus the set's default, exported from Figma (vector cut out with `download_assets`, re-placed at its offset in a 24 × 24 viewBox, fill `#000` for the mask), uploaded (S3 201).

| Variant | Figma source | Asset |
|---|---|---|
| Timer (`845bdc6b-3e2c-39ca-9c61-748ac5bd1eb3`) | `Google icons / type=timer…` (`2045:11308`), Card / Service default | `6ae44d9d9c5e45fc9739a6a3_icon-timer.svg` |
| Schedule Outline (`617c4729-3dad-90d1-3ddd-b1da77f73bc9`) | `type=schedule…` (`2710:56139`) — outline, unlike the older filled `Schedule` | `6ae44d9d58b3d6d9495a076b_icon-schedule-outline.svg` |
| Project Controls (`c1ebe063-5bdb-5c9c-76e2-5f5bb99105ea`) | `type=project-controls-strategy` (`2063:4454`) | `6ae44d9d091eb04f52a8b9ee_icon-project-controls.svg` |
| Person Search (`9454cfd3-2996-eadd-7125-e7a007c57d86`) | `type=person-search…` (`2045:11310`) | `6ae44d9d953315857d3fcaf8_icon-person-search.svg` |
| Person Shield (`a7cc4fcd-9915-73fa-2304-c8e73037e398`) | `type=person-shield` (`2236:4973`) | `6ae44d9d953315857d3fcb0a_icon-person-shield.svg` |
| Person Check (`7ae9dd7a-36c6-f6c7-1838-00f738fda3f3`) | `type=person-check` (`2063:4449`) | `6ae44d9dd24ed7bc928eaa56_icon-person-check.svg` |

Step-card icons, added the same day:

| Variant | Source | Asset |
|---|---|---|
| Assignment (`a94e5078-a1e6-deb7-fe22-0b467f820a11`) | Figma `type=assignment…` (`2292:33276`) | `6ae4577c3784203354968bc6_icon-assignment.svg` |
| Check Circle (`92e61da6-7aae-7d23-e5f6-2fbbcfebbeb9`) | Figma `type=check-circle…` (`2263:7147`) | `6ae4577c957d1e353652df12_icon-check-circle.svg` |
| List Check (`088f6a31-1655-ca0a-24d3-c97493db8494`) | Google Material Symbols `list_alt_check`, outlined wght 100 24 px | `6ae4577c639655423bf504e0_icon-list-check.svg` |
| Handshake (`e1df746a-9fd3-e026-f3c7-38353e82d183`) | Material Symbols `handshake`, outlined wght 100 24 px | `6ae4577c58b3d6d9495d17b8_icon-handshake.svg` |
| Outbound (`14304292-9851-5c57-bb80-fe5f3bcf4340`) | Material Symbols `outbound`, outlined wght 100 24 px | `6ae4577c2c6c9d592af07d2f_icon-outbound.svg` |

The last three came from `fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<name>/wght100/24px.svg` because the Figma MCP hit the View-seat call limit mid-export; the Figma layer names (`…fill0-wght100-grad0-opsz24`) say this is the same icon at the same settings.
Still not added (Components page only): `percent`, `shield`, `dashboards`, `planning-scheduling`.

## 2026-10-30 — Icons for the remaining cards
Done by Aniek (via Claude). Exported in Claude in Chrome with the Plugin API (`exportAsync SVG_STRING`) and sent to a local receiver, uploaded (S3 201).

| Variant | Figma source | Asset |
|---|---|---|
| Check (`56dbf3ed-ca56-7ea6-9487-d52580e5468c`) | `check_24dp…` in `Card / Expert` bullets (Card Bullet) | `6ae48f5017b14e2300f8e147_icon-check.svg` |
| Quote (`73e4a5ab-e0b3-74e2-7c39-e696924c7a24`) | the “ mark in `Testimonial 1` (55 × 43, not square: holder 3.4375 × 2.6875 rem) | `6ae48f5035be1598558a8993_icon-quote.svg` |
| Star (`a272a43c-73ee-a18b-61ec-a627df1801e1`) | one star of `Testimonial 1` (colour `swatch/stars` on the holder) | `6ae48f5035be1598558a89a5_icon-star.svg` |
| CV Submission (`cb979357-6cc2-4787-3ad8-17bf28e09d70`) | `Google icons / type=cv-submission` in `Card / Opportunity` variant3 | `6ae48f50343c721614605852_icon-cv-submission.svg` |

Stage cards on the real pages use 21 further Google icons (manage-accounts, handshake, published-with-changes, analytics, gpp-maybe, schema, planning-scheduling, computer, table, monitoring, action-key, fact-check, insert-chart, cv-submission, dashboard-2, call-log, cost-control-forecasting, playlist-add-check-circle, avg-time, …); add them when those pages are built.
