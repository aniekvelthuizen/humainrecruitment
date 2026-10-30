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
