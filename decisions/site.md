# Site

## 2026-10-29 — Client repo lives in the wireframes repo
Conflict: the kit expects a separate `wf-<client>` repo.
Choice: the client setup lives in the root of `humainrecruitment`, next to `wireframes/` and `docs/`.
Why: owner's choice; everything for HumAIn in one place.

## 2026-10-29 — Not production yet
Choice: `"production": false` until launch; flip to `true` when the site goes live.
Why: nothing is live, so the guard does not need to ask before changes.

## 2026-10-29 — Figma themes onto Lumos modes
Conflict: Figma Theme modes are Base / Dark / Brand; Lumos ships a light base mode and Dark.
Choice: Base = Lumos' base mode, Dark = Dark, Brand = new mode `Brand`.
Why: same meaning, keeps Lumos' `u-theme-*` classes working.

## 2026-10-29 — Text styles win over Figma's Text Style variables
Conflict: Figma's text styles (H1–H5 125 %, letter-spacing 0) disagree with its Text Style variables (1 / 1.1, tight -0.03).
Choice: follow the text styles; new `line-height/heading` = 1.25. (Recommended, pending owner confirmation — Q2.)
Why: the text styles are what is applied on the pages (1,000+ uses).
