#!/usr/bin/env python3
"""PreToolUse guard for Webflow mutations, on live sites only.

A site that is still being built ("production": false, the default for a new client repo) passes
untouched. At launch "production" flips to true and the guard is on: changing something that
already exists asks the user first, in plain Dutch, with what changes, where it shows, when
visitors see it and how to undo it:
- editing, renaming or removing a style; updating, renaming or deleting a variable;
- removing a prop or a variant, changing prop defaults, unregistering a component;
- removing elements; replacing site or page custom code or scripts.
Creating new styles, elements, variables, props and variants never asks.
The question is a confirmation of what Claude has just explained in the chat (references/guard.md),
not the explanation itself. Fails closed: when project.json cannot be read, the site counts as live.
"""
import json, sys

ASK = {
    "update_style", "rename_style", "remove_style",
    "update_color_variable", "update_size_variable", "update_number_variable",
    "update_percentage_variable", "update_font_family_variable",
    "rename_variable", "delete_variable",
    "remove_prop", "delete_variant",
    "set_site_freeform_code", "set_site_scripts", "clear_site_scripts", "delete_registered_script",
    "remove_element", "unregister_component",
    "update_prop",
    "set_page_freeform_code", "set_page_scripts", "clear_page_scripts",
}
TARGET_KEYS = ("style_name", "new_name", "variable_id", "component_id", "script_id", "page_id", "site_id", "id")

# CSS property -> plain word, first match wins.
GROUPS = (
    (("grid-", "position", "z-index", "top", "right", "bottom", "left", "inset", "display", "flex",
      "order", "align", "justify", "place-", "float", "overflow"), "plek en indeling"),
    (("margin", "padding", "gap", "row-gap", "column-gap"), "ruimte"),
    (("width", "height", "min-", "max-", "aspect-ratio"), "afmetingen"),
    (("font", "line-height", "letter-spacing", "text-", "white-space", "word-", "hyphens"), "tekst"),
    (("color",), "tekstkleur"),
    (("background",), "achtergrond"),
    (("border", "outline"), "rand"),
    (("box-shadow", "opacity", "filter", "backdrop", "transform", "transition", "animation", "mix-blend"), "effecten"),
    (("pointer-events", "cursor", "user-select"), "klikgedrag"),
)

project = {}


def load_project():
    global project
    try:
        with open("project.json") as f:
            project = json.load(f)
        return True
    except Exception:
        return False


def walk(node, found):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ASK and isinstance(v, dict):
                found.append((k, v))
            walk(v, found)
    elif isinstance(node, list):
        for v in node:
            walk(v, found)


def find_by_id(node, wanted):
    if isinstance(node, dict):
        if node.get("id") == wanted and node.get("name"):
            return node
        node = list(node.values())
    if isinstance(node, list):
        for v in node:
            hit = find_by_id(v, wanted)
            if hit:
                return hit
    return None


def lookup(kind, wanted):
    """Name (and instance count) from the client repo's dumps; the raw id when it is not there."""
    path = project.get("references", {}).get(kind)
    try:
        with open(path) as f:
            hit = find_by_id(json.load(f), wanted)
    except Exception:
        hit = None
    return hit or {"name": wanted}


def group(props):
    words = []
    for p in props:
        p = (p or "").lower()
        word = next((w for prefixes, w in GROUPS if any(p.startswith(x) for x in prefixes)), "overige opmaak")
        if word not in words:
            words.append(word)
    return ", ".join(words)


def target(v):
    return next((str(v[key]) for key in TARGET_KEYS if v.get(key)), "")


def explain(k, v):
    """One plain line per change, plus where it shows."""
    t = target(v)
    if k == "update_style":
        props = [p.get("property_name") for p in v.get("properties", []) if isinstance(p, dict)]
        rm = v.get("remove_properties", [])
        bp = v.get("breakpoint_id", "main")
        line = f"Opmaak van stijl '{v.get('style_name', t)}' aanpassen"
        if props:
            line += f": {group(props)}"
        if rm:
            line += f"; haalt weg: {group(rm)}"
        if bp != "main":
            line += f" (alleen op schermmaat {bp})"
        return line, "overal waar deze stijl gebruikt wordt"
    if k == "rename_style":
        return f"Stijl '{v.get('style_name', t)}' hernoemen naar '{v.get('new_name', '')}'", "overal waar deze stijl gebruikt wordt"
    if k == "remove_style":
        return f"Stijl '{v.get('style_name', t)}' verwijderen", "overal waar deze stijl gebruikt wordt"
    if k.endswith("_variable"):
        name = lookup("variables", v.get("variable_id", t))["name"]
        if k == "rename_variable":
            return f"Variabele '{name}' hernoemen naar '{v.get('new_name', v.get('name', ''))}'", "overal waar deze variabele gebruikt wordt"
        if k == "delete_variable":
            return f"Variabele '{name}' verwijderen", "overal waar deze variabele gebruikt wordt"
        return f"Variabele '{name}' krijgt een nieuwe waarde: {json.dumps(v.get('value'), ensure_ascii=False)}", "overal waar deze variabele gebruikt wordt"
    if k in ("remove_prop", "delete_variant", "unregister_component", "update_prop"):
        comp = lookup("components", v.get("component_id", t))
        count = comp.get("instanceCount")
        where = f"alle {count} plekken waar component '{comp['name']}' staat" if count else f"elke plek waar component '{comp['name']}' staat"
        what = {
            "remove_prop": "een instelling verwijderen",
            "delete_variant": "een variant verwijderen",
            "unregister_component": "het component opheffen (de plekken worden losse elementen)",
            "update_prop": "de standaardwaarde van een instelling wijzigen",
        }[k]
        return f"Component '{comp['name']}': {what}", where
    if k == "remove_element":
        page = lookup("pages", v["page_id"])["name"] if v.get("page_id") else ""
        return "Elementen verwijderen" + (f" op pagina '{page}'" if page else ""), (f"pagina '{page}'" if page else "de pagina of het component waar ze in staan")
    if "site" in k or k == "delete_registered_script":
        size = f" ({len(v.get('content', ''))} tekens)" if v.get("content") else ""
        return f"Eigen code of scripts van de hele site vervangen of weghalen{size}; het oude blok verdwijnt", "elke pagina van de site"
    page = lookup("pages", v["page_id"])["name"] if v.get("page_id") else "deze pagina"
    return f"Eigen code of scripts van pagina '{page}' vervangen of weghalen; het oude blok verdwijnt", f"pagina '{page}'"


def technical(k, v):
    detail = ""
    if k == "update_style":
        props = [p.get("property_name") for p in v.get("properties", []) if isinstance(p, dict)]
        rm = v.get("remove_properties", [])
        detail = f" @{v.get('breakpoint_id', 'main')} set {props}" + (f" remove {rm}" if rm else "")
    return f"{k} {target(v)}{detail}"


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return
    if load_project() and not project.get("production", True):
        return
    hits = []
    walk(payload.get("tool_input", {}), hits)
    if not hits:
        return
    whats, wheres = [], []
    for k, v in hits:
        what, where = explain(k, v)
        whats.append(what)
        if where not in wheres:
            wheres.append(where)
    reason = (
        "⚠️ Live site: Claude wil iets aanpassen dat al bestaat.\n\n"
        "Wat verandert:\n  • " + "\n  • ".join(whats) + "\n"
        "Waar je het ziet: " + "; ".join(wheres) + ".\n"
        "Wanneer: bezoekers zien het pas na Publish.\n"
        "Terugdraaien: opnieuw aanpassen, of een back-up terugzetten (Site settings › Backups).\n\n"
        "Claude hoort vlak hiervoor in de chat te hebben uitgelegd welke pagina's en onderdelen dit raakt. "
        "Zie je die uitleg niet, of snap je hem niet? Kies Deny en vraag het.\n\n"
        "Voor developers: " + " | ".join(technical(k, v) for k, v in hits)
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": reason,
        }
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
