# Fluid values

Typed into the Variables panel (the API refuses formulas). Viewport range from the Figma frames: 402 px → 1512 px, so `site/viewport-min` = 25.125 and `site/viewport-max` = 94.5.

Only the variables below. Everything else is static.

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

Font sizes are added here once Q3 (mobile heading sizes) is answered.
