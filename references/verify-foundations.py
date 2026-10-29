"""Check references/variables.json against the foundations plan (2026-10-29-foundations.md).

Run: python3 -I references/verify-foundations.py references/variables.json
Prints one line per failed check and a summary; exit code 1 on any failure.
"""
import json
import re
import sys

data = json.load(open(sys.argv[1]))
cols = {c["name"]: c for c in data["collections"]}
by_id, col_of = {}, {}
for c in data["collections"]:
    for v in c["variables"]:
        by_id[v["id"]] = v
        col_of[v["id"]] = c["name"]
mode_ids = {c["name"]: {m["name"]: m["id"] for m in c["modes"]} for c in data["collections"]}
fails, passes = [], 0


def var(col, name):
    for v in cols[col]["variables"]:
        if v["name"] == name:
            return v
    raise KeyError(f"{col}::{name}")


def raw(v, mode="base"):
    for mv in v.get("modeValues", []):
        if mv["modeId"] == mode:
            return mv["value"]
    return v["value"]


def resolve(v, modes):
    """Follow aliases; `modes` maps collection name -> active mode id."""
    while True:
        val = raw(v, modes.get(col_of[v["id"]], "base"))
        if isinstance(val, dict) and "id" in val and len(val) == 1:
            v = by_id[val["id"]]
            continue
        return v, val


def fmt(val):
    if isinstance(val, dict) and "unit" in val:
        return f"{val['value']:g}{val['unit']}"
    if isinstance(val, dict) and val.get("type") == "custom":
        return val["value"]
    return str(val).lower() if isinstance(val, str) else f"{val:g}"


def check(label, got, want):
    global passes
    if got == want:
        passes += 1
    else:
        fails.append(f"FAIL {label}: got {got!r}, want {want!r}")


# 1. Swatches
sw = {"brand-100": "#d3ccde", "brand-200": "#a899bd", "brand-300": "#7c669b", "brand-400": "#51337a",
      "brand-500": "#250059", "brand-600": "#1e0047", "brand-700": "#160035", "brand-800": "#0f0024",
      "brand-900": "#070012", "brand-text": "#ffffff", "brand-text-o20": "#ffffff33",
      "brand-secondary-500": "#0082a6", "brand-accent-500": "#00ffd5", "brand-pink-500": "#e5bbb7",
      "light-100": "#ffffff", "light-100-o50": "#ffffff80", "light-100-o25": "#ffffff40",
      "light-100-o20": "#ffffff33", "light-200": "#edf1f7", "dark-800": "#1c2332", "dark-900": "#030b1b",
      "dark-900-o50": "#030b1b80", "dark-900-o25": "#030b1b40", "dark-900-o20": "#030b1b33",
      "dark-900-o10": "#030b1b1a", "stars": "#ffbf66", "transparent": "#ffffff00"}
for n, hexv in sw.items():
    check(f"swatch/{n}", fmt(resolve(var("default", "swatch/" + n), {})[1]), hexv)

# 2. Theme, every mode resolves to the Figma hex
S = lambda n: sw[n]
theme = {
    "background": ("light-200", "dark-900", "brand-500"), "background-2": ("light-100", "dark-800", "brand-400"),
    "background-skeleton": ("dark-900-o10", "light-100-o20", "light-100-o20"),
    "text": ("dark-900", "light-100", "brand-text"), "heading-accent": ("brand-600", "brand-500", "brand-text"),
    "border": ("dark-900-o20", "light-100-o20", "brand-text-o20"),
    "selection/background": ("brand-300",) * 3, "selection/text": ("brand-text",) * 3,
    "button-primary/background": ("brand-accent-500",) * 3, "button-primary/background-hover": ("brand-accent-500",) * 3,
    "button-primary/border": ("brand-accent-500",) * 3, "button-primary/border-hover": ("brand-accent-500",) * 3,
    "button-primary/text": ("dark-900",) * 3, "button-primary/text-hover": ("dark-900",) * 3,
    "button-primary/accent": ("dark-900",) * 3, "button-primary/accent-hover": ("dark-900",) * 3,
    "button-secondary/background": ("transparent",) * 3,
    "button-secondary/text-hover": ("light-100", "dark-900", "brand-500"),
    "button-secondary/accent-hover": ("light-100", "dark-900", "brand-500"),
    "button-secondary-white/background": ("transparent",) * 3,
    "button-secondary-white/text-hover": ("dark-900",) * 3, "button-secondary-white/accent-hover": ("dark-900",) * 3,
    "button-tertiary/text-hover": ("brand-500", "brand-accent-500", "brand-accent-500"),
    "button-tertiary/accent-hover": ("brand-500", "brand-accent-500", "brand-accent-500"),
    "button-back/text": ("light-100",) * 3, "button-back/accent": ("light-100",) * 3,
    "button-back/text-hover": ("brand-accent-500",) * 3, "button-back/accent-hover": ("brand-accent-500",) * 3,
    "text-link/text-hover": ("brand-500", "brand-accent-500", "brand-accent-500"),
    "text-link/border-hover": ("dark-900", "brand-500", "brand-text"),
    "nav/background": ("light-100", "dark-800", "brand-500"),
}
text = theme["text"]
for n in ["button-secondary/border", "button-secondary/text", "button-secondary/background-hover",
          "button-secondary/border-hover", "button-secondary/accent", "button-tertiary/text",
          "button-tertiary/accent", "text-link/text"]:
    theme[n] = text
theme["text-link/border"] = theme["border"]
for n in ["background-hover", "border", "border-hover", "text", "accent"]:
    theme["button-secondary-white/" + n] = ("light-100",) * 3
# Buttons (2026-10-29-buttons.md): Dark/Brand of Secondary = secondary-white, of Tertiary = back-button
for n in ["border", "text", "background-hover", "border-hover", "accent"]:
    theme["button-secondary/" + n] = ("dark-900", "light-100", "light-100")
for n in ["text-hover", "accent-hover"]:
    theme["button-secondary/" + n] = ("light-100", "dark-900", "dark-900")
for n in ["text", "accent"]:
    theme["button-tertiary/" + n] = ("dark-900", "light-100", "light-100")
theme["button-tertiary/background"] = ("transparent",) * 3
sw.update({"shadow-1": "#0000001a", "shadow-2": "#00000017", "shadow-3": "#0000000d", "shadow-4": "#00000003"})
for i in range(1, 5):
    theme[f"button-primary/shadow-{i}"] = (f"shadow-{i}",) * 3
tm = mode_ids["Theme"]
modes = [("Base", "base"), ("Dark", tm["Dark mode"]), ("Brand", tm["Brand mode"])]
for n, want in theme.items():
    for (mn, mid), w in zip(modes, want):
        check(f"Theme {n} @{mn}", fmt(resolve(var("Theme", n), {"Theme": mid})[1]), S(w))
check("Theme variable count", len(cols["Theme"]["variables"]), len(theme))

# 3. Typography statics
typo = {"font/primary-family": "onest", "font/secondary-family": "vend sans",
        "font/primary-light": "300", "font/primary-regular": "400", "font/primary-medium": "500",
        "font/primary-semibold": "600", "font/primary-bold": "700",
        "font/secondary-semibold": "600", "font/secondary-bold": "700",
        "line-height/small": "1", "line-height/medium": "1.1", "line-height/large": "1.3",
        "line-height/huge": "1.5", "line-height/heading": "1.25",
        "letter-spacing/tight": "-0.03em", "letter-spacing/normal": "0em", "letter-spacing/wide": "0.1em",
        "font-size/text-small": "0.875rem", "font-size/text-main": "1rem", "font-size/text-medium": "1.125rem",
        "font-size/text-large": "1.25rem", "font-size/text-label": "0.75rem", "font-size/h6": "1.25rem",
        "font-size/h5": "1.5rem", "font-size/h4": "1.875rem",
        "font/primary-trim-top": "0.3745em", "font/primary-trim-bottom": "0.3325em",
        "font/secondary-trim-top": "0.35em", "font/secondary-trim-bottom": "0.35em"}
for n, w in typo.items():
    check(n, fmt(resolve(var("Typography", n), {})[1]), w)

# 4. Fluid: clamp() with the plan's min/max, else the static desktop value (pending the Variables panel)
fluid = {("default", "site/margin"): (1.25, 4), ("default", "site/gutter"): (1.25, 2),
         ("Typography", "font-size/display"): (2.25, 4.5), ("Typography", "font-size/h1"): (2.25, 3.75),
         ("Typography", "font-size/h2"): (1.875, 3), ("Typography", "font-size/h3"): (1.875, 2.25)}
pending = []
for (c, n), (lo, hi) in fluid.items():
    val = raw(var(c, n))
    if isinstance(val, dict) and val.get("type") == "custom":
        f = val["value"]
        ok = (f.startswith(f"clamp({lo:g} * 1rem") and f.endswith(f"{hi:g} * 1rem)")
              and "var(--site--viewport-min)" in f and "var(--site--viewport-max)" in f)
        check(f"fluid {n}", ok, True)
    else:
        check(f"fluid {n} static desktop", fmt(val), f"{hi:g}rem")
        pending.append(n)
check("site/viewport-min", fmt(raw(var("default", "site/viewport-min"))), "25.125")
check("site/viewport-max", fmt(raw(var("default", "site/viewport-max"))), "94.5")

# 5. Sizes / spacing
sizes = {("default", "site/column-count"): "12", ("default", "max-width/small"): "50rem",
         ("default", "radius/none"): "0rem", ("default", "radius/small"): "0.5rem",
         ("default", "radius/medium"): "0.75rem", ("default", "radius/main"): "1rem",
         ("default", "border-width/main"): "0.0625rem", ("default", "border-width/thick"): "0.125rem",
         ("default", "nav/height"): "5rem", ("default", "button-size/small"): "2rem",
         ("default", "button-size/medium"): "3rem",
         ("Spacing", "section-space/none"): "0rem", ("Spacing", "section-space/small"): "3rem",
         ("Spacing", "section-space/main"): "6rem", ("Spacing", "section-space/large"): "12rem"}
for i, v in enumerate(["0", "0.25", "0.5", "0.625", "1", "1.25", "1.5", "2", "3"]):
    sizes[("Spacing", f"space/{i}")] = v + "rem"
for (c, n), w in sizes.items():
    check(n, fmt(raw(var(c, n))), w)

# 6. Lumos' own formulas intact
lumos = {"max-width/main": "calc(var(--site--viewport-max) * 1rem)", "max-width/full": "100%",
         "focus/offset-inner": "calc(var(--focus--width) * -1)",
         "nav/height-total": "calc(var(--nav--height) + var(--nav--spacing-outer-vertical))"}
for n, w in lumos.items():
    check(f"lumos {n}", fmt(raw(var("default", n))), w)
check("lumos site/column-width", fmt(raw(var("default", "site/column-width"))).startswith("calc((min(var(--max-width--main)"), True)
check("lumos radius/round", fmt(raw(var("default", "radius/round"))), "100vw")

# 7. Text Style modes
tsm = mode_ids["Text Style"]
H = ("line-height/heading", "0em", "vend sans", "700")
B = ("line-height/huge", "0em", "onest", "400")
spec = {"Display": ("display", "line-height/small", "0em", "vend sans", "600", "2rem", "1.5rem", "none"),
        "H1": ("h1",) + H + ("2rem", "1.25rem", "none"), "H2": ("h2",) + H + ("2rem", "1.25rem", "none"),
        "H3": ("h3",) + H + ("2rem", "1.25rem", "none"), "H4": ("h4",) + H + ("2rem", "1rem", "none"),
        "H5": ("h5",) + H + ("2rem", "1rem", "none"),
        "H6": ("h6", "line-height/huge", "0em", "vend sans", "700", "2rem", "1rem", "none"),
        "Text Large": ("text-large",) + B + ("1rem", "1rem", "none"),
        "Text Medium": ("text-medium",) + B + ("1rem", "1rem", "none"),
        "Base mode": ("text-main",) + B + ("1rem", "1rem", "none"),
        "Text Small": ("text-small",) + B + ("1rem", "1rem", "none"),
        "Label Large": ("text-main", "line-height/huge", "0.1em", "onest", "400", "1rem", "1rem", "uppercase"),
        "Label": ("text-label", "line-height/huge", "0.1em", "onest", "400", "1rem", "1rem", "uppercase")}
for m, s in spec.items():
    mid = tsm[m]
    ctx = {"Text Style": mid}
    r = lambda n: resolve(var("Text Style", n), ctx)
    check(f"TS {m} font-size", r("font-size")[0]["name"], "font-size/" + s[0])
    check(f"TS {m} line-height", r("line-height")[0]["name"], s[1])
    check(f"TS {m} letter-spacing", fmt(r("letter-spacing")[1]), s[2])
    check(f"TS {m} family", fmt(r("font-family")[1]), s[3])
    check(f"TS {m} weight", fmt(r("font-weight")[1]), s[4])
    check(f"TS {m} margin-top", fmt(r("margin-top")[1]), s[5])
    check(f"TS {m} margin-bottom", fmt(r("margin-bottom")[1]), s[6])
    check(f"TS {m} transform", r("text-transform")[0]["name"], "text-transform/" + s[7])
    fam = "secondary" if s[3] == "vend sans" else "primary"
    check(f"TS {m} trim-top", r("trim-top")[0]["name"], f"font/{fam}-trim-top")
    check(f"TS {m} trim-bottom", r("trim-bottom")[0]["name"], f"font/{fam}-trim-bottom")

# 8. No px anywhere, no font other than Onest / Vend Sans
for c in data["collections"]:
    for v in c["variables"]:
        for val in [v["value"]] + [mv["value"] for mv in v.get("modeValues", [])]:
            if isinstance(val, dict) and val.get("unit") == "px":
                fails.append(f"FAIL px unit: {c['name']}::{v['name']}")
            if isinstance(val, dict) and val.get("type") == "custom" and re.search(r"\d+px", val["value"]):
                fails.append(f"FAIL px in formula: {c['name']}::{v['name']}")
        if v["type"] == "FontFamily" and v["name"].startswith("font/"):
            if fmt(v["value"]) not in ("onest", "vend sans"):
                fails.append(f"FAIL font {v['name']} = {v['value']}")

print("\n".join(fails))
print(f"{passes} passed, {len(fails)} failed; fluid still static (Variables panel): {', '.join(pending) or 'none'}")
sys.exit(1 if fails else 0)
