# Source: the Figma design system (site foundations)

Use when a Lumos site has to take over a Figma file's variables and text styles before any section is built: colours, themes, fonts, type scale, spacing, widths, radius, borders. Variables and a handful of `u-text-style-*` classes only; no elements. Webflow call shapes and refusals in [webflow-mcp.md §8](../../references/webflow-mcp.md#8-variables).

## 1. Read both sides

- **Figma:** one read-only `use_figma` script (load the `figma-use` skill first) that returns every local collection, its modes and every variable with resolved value or alias name, plus every text style (family, style, size, line-height, letter-spacing, case, bound variables). `get_variable_defs` only sees what one node uses; it is not a dump.
- **Usage:** a second script per page counting text-style uses (`getStyledTextSegments(['textStyleId'])`) and explicit mode overrides. A style used 6 times and a style used 3,000 times are not the same question.
- **Frame widths:** the desktop and mobile page frames give the fluid range (e.g. 1440 / 375).
- **Site:** `get_variable_collections` + `get_variables` with all modes into `references/variables.json`; `list_fonts`.

## 2. Map, then plan

One row per Figma variable: the Lumos variable it becomes (same name when the Figma file is Lumos-named), update or create, and the value — static, alias, or fluid (mobile → desktop). Extras the starter lacks (card/*, divider, text-secondary, extra font sizes, `space/9` …) are created under the Figma name. The plan's questions: fonts not on the site, text styles that should not become Lumos text styles (weight or link variants, subheadings, one-off fonts), modes Lumos has no equivalent for.

*(house)* Text-style variants that only change weight or underline are not text styles: the element's own class sets them. Every weight Figma's text styles use gets a `font/<family>-<weight>` variable and a `u-weight-<weight>` utility (Lumos ships regular/medium/bold), so "Text Main Semi Bold" = `u-text-style-main` + `u-weight-semibold`, never a literal `font-weight` on a class. Subheadings in the body font are a heading-size utility plus a family override on the element's class.

## 3. Write (API)

Order: swatches → Theme (every mode) → Typography → Spacing → new collections → Text Style modes → `u-text-style-*` classes for new modes → trims.

- Fluid values cannot be written through the API (§8). Write the **desktop** value as a static and put the min/max and the ready `clamp()` per variable in `references/fluid-values.md` (per mode where a collection has modes).
- New variables land at the bottom of their collection and cannot be reordered by API: create them in one call in the order they should read (light → dark, per group).
- `site/viewport-min` / `viewport-max` are plain numbers: set them to the design widths in rem (375 px = 23.4375) through the API.
- New `u-text-style-*` class: copy an existing one's properties (`font-family`, `font-size`, `line-height`, `font-weight`, `letter-spacing` as variables; `text-transform` and `text-wrap` as literal `var()`; `display: flow-root`), then `set_style_variable_mode` to the new mode.
- Trims per font from the font file, not guessed: [lumos/typography.md](../../references/lumos/typography.md#fonts). Each family gets its own `font/<family>-trim-top|bottom`; Text Style modes point to the right pair.

## 4. Fluid values (the agent, in the Designer)

Lumos keeps a fluid size as a `clamp()` formula **in the variable's own value** (a fresh starter still has it on `site/gutter`). Follow that: no Fluid Builder app, no `:root` block in custom code (the Variables panel would then show something the site does not do), no fixed values over Lumos' formulas without a formula to replace them.

The API refuses formulas, so the agent types each formula from `fluid-values.md` into the Variables panel in the user's Chrome and reads it back (steps: [webflow-mcp.md](../../references/webflow-mcp.md) §11). Lumos form, MIN/MAX in rem:

```
clamp(MIN * 1rem, ((MIN - ((MAX - MIN) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((MAX - MIN) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), MAX * 1rem)
```

Only the variables in `fluid-values.md`. Never max widths, radius, borders, focus, button sizes, trims, letter-spacing, line heights, or anything in the Text Style collection (those are links; a formula replaces the link). Without a browser route, hand the user the formulas to paste (Variables panel › value › paste › Enter); Fluid Builder only when the owner asks for it.

## 5. Verify (API)

Read every collection back and check by script, never by eye:

- each fluid variable's `clamp()` carries the plan's min and max and `var(--site--viewport-min)` / `var(--site--viewport-max)`; on the published page the value equals the desktop size at the max width and the mobile size at the min width, exactly;
- every Theme variable resolves, per mode, to the Figma hex;
- every Text Style mode resolves to the planned size, line-height, family, weight, margins, trims;
- Lumos' own custom formulas are intact (`max-width/full` 100 %, `site/column-width`, `nav/height-total`, `focus/offset-inner`). If one was overwritten, restore it in the Variables panel (§4); the API cannot.

Then the Styleguide page in the Designer for a visual pass, and `decisions/site.md` + `log.md`.
