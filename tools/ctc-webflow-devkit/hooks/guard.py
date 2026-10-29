#!/usr/bin/env python3
"""PreToolUse guard for Webflow mutations, on production sites only.

- Changing something that already exists and reaches the whole site asks the user first,
  with the change shown: editing, renaming or removing a style; updating, renaming or deleting a
  variable; removing a prop or a variant; replacing site-level custom code or scripts.
- Removing elements, unregistering components, changing prop defaults (they reach every instance)
  and replacing page-level custom code ask too.
A site that is not live yet ("production": false) passes untouched; flipping it to true at launch
turns the guard back on. Creating new styles, elements, variables, props and variants never asks.
Fails closed: when project.json cannot be read, the site counts as production.
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


def walk(node, found):
    if isinstance(node, dict):
        for k, v in node.items():
            if k in ASK and isinstance(v, dict):
                found.append((k, v))
            walk(v, found)
    elif isinstance(node, list):
        for v in node:
            walk(v, found)


def production():
    try:
        with open("project.json") as f:
            return bool(json.load(f).get("production", True))
    except Exception:
        return True


def describe(k, v):
    target = next((str(v[key]) for key in TARGET_KEYS if v.get(key)), "")
    detail = ""
    if k == "update_style":
        props = [p.get("property_name") for p in v.get("properties", []) if isinstance(p, dict)]
        rm = v.get("remove_properties", [])
        bp = v.get("breakpoint_id", "main")
        detail = f" @{bp} set {props}" + (f" remove {rm}" if rm else "")
    elif k.startswith("update_") and k.endswith("_variable"):
        detail = f" -> {json.dumps(v.get('value'))}"
    elif k == "update_prop":
        detail = f" props {[p.get('prop_id') for p in v.get('props', []) if isinstance(p, dict)]}"
    elif k in ("set_site_freeform_code", "set_page_freeform_code"):
        detail = f" {v.get('location', '')} ({len(v.get('content', ''))} chars, replaces the whole block)"
    return f"{k} {target}{detail}"


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return
    if not production():
        return
    hits = []
    walk(payload.get("tool_input", {}), hits)
    if not hits:
        return
    lines = [describe(k, v) for k, v in hits]
    reason = ("webflow-devkit guard — this call changes something that already exists"
              " on a PRODUCTION site:\n  " + "\n  ".join(lines))
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": reason,
        }
    }))


if __name__ == "__main__":
    main()
