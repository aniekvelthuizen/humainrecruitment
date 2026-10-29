# Fluid values

Typed into the Variables panel (the API refuses formulas). Viewport range from the Figma frames: 402 px → 1512 px, so `site/viewport-min` = 25.125 and `site/viewport-max` = 94.5.

Only the variables below. Everything else is static.

## Paste steps (Designer)

`site/viewport-min` 25.125 and `site/viewport-max` 94.5 are already set (API, 2026-10-29).

1. Designer › Variables panel (V).
2. Collection **default** › `site/margin` › click the value › paste the formula below › Enter. Same for `site/gutter`.
3. Collection **Typography** › `font-size/display`, `h1`, `h2`, `h3` › same.
4. Each value then shows as a formula; the panel preview at 1512 px wide must equal the desktop value.
5. Tell Claude; it re-dumps `variables.json` and runs `references/verify-foundations.py` (the "fluid still static" list must be empty).

| Variable | Mobile (402) | Desktop (1512) | Static value written by API |
|---|---|---|---|
| site/margin | 1.25rem (20 px) | 4rem (64 px) | 4rem |
| site/gutter | 1.25rem (20 px) | 2rem (32 px) | 2rem |

## site/margin

```
clamp(1.25 * 1rem, ((1.25 - ((4 - 1.25) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((4 - 1.25) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 4 * 1rem)
```

## site/gutter

```
clamp(1.25 * 1rem, ((1.25 - ((2 - 1.25) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((2 - 1.25) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 2 * 1rem)
```

## Heading sizes

Mobile sizes read from the mobile frames: the same title on desktop and mobile, and the style the designer picked for it on mobile (decisions/site.md, "Mobile heading sizes"). H4, H5, H6 and all body sizes are the same on both and stay static.

| Variable | Mobile (402) | Desktop (1512) | Static value written by API |
|---|---|---|---|
| font-size/display | 2.25rem (36 px) | 4.5rem (72 px) | 4.5rem |
| font-size/h1 | 2.25rem (36 px) | 3.75rem (60 px) | 3.75rem |
| font-size/h2 | 1.875rem (30 px) | 3rem (48 px) | 3rem |
| font-size/h3 | 1.875rem (30 px) | 2.25rem (36 px) | 2.25rem |

### font-size/display

```
clamp(2.25 * 1rem, ((2.25 - ((4.5 - 2.25) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((4.5 - 2.25) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 4.5 * 1rem)
```

### font-size/h1

```
clamp(2.25 * 1rem, ((2.25 - ((3.75 - 2.25) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((3.75 - 2.25) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 3.75 * 1rem)
```

### font-size/h2

```
clamp(1.875 * 1rem, ((1.875 - ((3 - 1.875) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((3 - 1.875) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 3 * 1rem)
```

### font-size/h3

```
clamp(1.875 * 1rem, ((1.875 - ((2.25 - 1.875) / (var(--site--viewport-max) - var(--site--viewport-min)) * var(--site--viewport-min))) * 1rem + ((2.25 - 1.875) / (var(--site--viewport-max) - var(--site--viewport-min))) * 100vw), 2.25 * 1rem)
```
