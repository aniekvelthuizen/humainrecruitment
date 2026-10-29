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

Exported with the Plugin API (`exportAsync SVG_STRING`, clean, 24 × 24), uploaded with `create_asset` + S3 POST (201).

Adding an icon: export → upload → `create_variant` → `set_variant_styles` mask-image → add a row here.
