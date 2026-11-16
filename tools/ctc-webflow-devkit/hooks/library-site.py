#!/usr/bin/env python3
"""PostToolUse reminder on sites that install a shared library (references/library-sites.md).

Every library Accept strips library classes from elements the installing site owns (page elements,
site-local components, CMS lists). Data attributes survive. When Claude sets classes or creates a
list, slot or page slot on such a site, this hook adds a note to Claude's context: what the class
is for must not depend on the class alone. Never blocks, never asks the user.

project.json:  "library": { "source": "<library site id>", "installers": ["<brand site id>", …] }
Without that field the hook does nothing.
"""
import json, sys

STYLE_KEYS = ("set_style", "style_names")
CREATE_TYPES = ("CMSCollection", "DynamoWrapper", "ComponentSlot", "PageSlot")


def walk(node, hits):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "set_style" and isinstance(v, dict) and v.get("style_names"):
                hits.add("class")
            elif k == "style_names" and v:
                hits.add("class")
            elif k == "type" and v in CREATE_TYPES:
                hits.add("container")
            walk(v, hits)
    elif isinstance(node, list):
        for v in node:
            walk(v, hits)


def main():
    try:
        payload = json.load(sys.stdin)
        with open("project.json") as f:
            lib = json.load(f).get("library") or {}
    except Exception:
        return
    installers = set(lib.get("installers") or [])
    tool_input = payload.get("tool_input") or {}
    if not installers or tool_input.get("siteId") not in installers:
        return
    hits = set()
    walk(tool_input.get("actions", tool_input), hits)
    if not hits:
        return
    note = (
        "Library site check (webflow-devkit, references/library-sites.md): this site installs a shared library, "
        "and every Accept strips library classes from elements this site owns (page elements, site-local "
        "components, CMS lists, slots). Data attributes survive. For each element you just touched: "
        "if a class only hides it or makes it display: contents, also set data-display=\"none\" or "
        "data-display=\"contents\" (set_attributes, scope_component_id inside a definition) and add the id to the "
        "project's data-display list. If a class carries real styling (type, spacing, layout), that element "
        "belongs inside a library component or needs a data-* rule in the library's CSS-only global embed; "
        "do not leave it to the class."
    )
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": note}}))


if __name__ == "__main__":
    main()
