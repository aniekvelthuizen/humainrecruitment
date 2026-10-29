# {{client}} — Webflow

Client repo for the webflow-devkit plugin. Read `project.json` first: it says which site, whether it is production, and where every reference lives.

- Site: {{siteName}} ({{siteId}}){{productionLine}}
- CSS system: {{cssSystem}}, new classes use the `{{prefix}}` prefix
- Before touching a page or component, read its file in `decisions/` if one exists.
- Every lasting choice (naming, structure, a Figma-vs-site conflict resolved) goes into `decisions/`, never only in chat.
