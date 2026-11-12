---
name: seo
description: Set up and check the SEO of a Webflow site — page titles, meta descriptions and Open Graph share images on every static page and CMS template, SEO fields per CMS collection with one share image per item, every locale, noindex on internal pages — and finish with a full SEO audit of the published site: landmark order, one h1 and no skipped headings, no headings in overview cards, robots.txt pagination rules, canonical and Open Graph tags, alt texts and video captions, descriptive and crawlable links, lazy loading and the hero image, fonts, layout shift, and schema.org structured data (Article, FAQPage, Organization, BreadcrumbList, JobPosting). Use when a page or CMS collection is added, when the user asks about SEO, meta titles or descriptions, share images, Open Graph, "what shows on LinkedIn/WhatsApp", noindex, sitemap, robots.txt, headings, alt texts, structured data or schema, Core Web Vitals, an SEO check or audit, before showing a site to the client, and before launch. Requires a client repo (project.json); otherwise run the project skill first.
---

# SEO — every page findable and shareable, checked on the published site

Every page a visitor can reach has its own title, description and share image, in every locale; every page a visitor should not find carries noindex. Editors steer SEO separately from the page copy. What counts is what the published HTML says, not what the settings panel shows, so this skill ends with a check on staging (§6) and the full SEO audit (§7).

Most of the SEO of a page is decided in its components: heading levels, lazy loading, crawlable links, JSON-LD (structure, alt and link names are accessibility rules first). Those rules apply while blocks are built ([seo-blocks.md](${CLAUDE_PLUGIN_ROOT}/references/seo-blocks.md), linked from build, componentize, cards, navigation and interactions); §7 checks that they held across the site.

This skill grows: what is not in it yet is listed in §9. Read first: `project.json`, `decisions/site.md` (the **SEO** entry), `decisions/cms.md`, `references/pages.json`, `references/cms.json`. API shapes and traps: [webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md). Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. The client's SEO settings

Differs per client, so it is asked once and written to `decisions/site.md` under **SEO**. Until the client says otherwise, the first version is:

| Setting | Default |
|---|---|
| Title | `<Page or item name> \| <Brand>`, at most 60 characters; when it does not fit, shorten the brand part (`\| Acme` instead of `\| Acme Mineral Services`) before the page part |
| Description | 120–160 characters, whole sentences, no copy of another page's description |
| Share image | 1200 × 630, **JPG or PNG** (social networks do not show AVIF or WebP), one per page and one per CMS item |
| Open Graph title / description | "Same as SEO" |
| Locales | every secondary locale gets its own title and description in its own language |
| Internal pages | noindex and out of the sitemap at launch (Styleguide, Components, Example Components, test pages, search results) |

Brand name, suffix and limits go into the entry; the check in §6 takes them as arguments.

## 2. Static pages

Per page and per locale (`data_pages_tool`: read with `get_page_metadata`, write with `update_page_settings`, secondary locales with `localeId`):

- **Title** and **meta description** following §1. Write them from the page's own copy (Figma copy or the copy document); never leave Lumos' "Place website meta description here" (Lumos ships it on Home) and never the site name alone.
- **Open Graph** title and description "Same as SEO".
- **Share image**: the page's top photo (or its hero visual) as JPG 1200 × 630, made with [scripts/make-og.mjs](scripts/make-og.mjs) (`--contain` with the page background for a cut-out object), uploaded as an asset and set as the page's Open Graph image. The script needs `sharp`, installed once in the client repo: `npm i --prefix .tmp/og sharp` (it resolves it from `.tmp/og` in the cwd; `.tmp/` is gitignored).
- A new page gets all three in the same task that creates it, not later.

## 3. CMS collections

**A collection with a template page that visitors reach** gets a field group **SEO**, separate from the content fields:

| Field (slug) | Type | Use |
|---|---|---|
| Page Title (`page-title`) | PlainText, **required** | `<title>` and Open Graph title of the template |
| Meta Description (`meta-description`) | PlainText, **required** | meta description and Open Graph description |
| Open Graph Image (`open-graph-image`) | Image, JPG/PNG | share image of this item, 1200 × 630 |

- Field names and help texts in English (help text says the length and "JPG or PNG, 1200 × 630, own image per item").
- The template's SEO settings bind **only** to these fields, never to content fields (a hero intro or a name). Binding the title and description goes through `data_pages_tool` with the binding string ([webflow-mcp.md](${CLAUDE_PLUGIN_ROOT}/references/webflow-mcp.md) §9, "CMS template SEO"); Open Graph title and description "Same as SEO". **The Open Graph image binding is refused by the API** (`imageUrl` must be an http URL): queue it for the Designer ([designer/README.md](${CLAUDE_PLUGIN_ROOT}/references/designer/README.md) "Queue, then one pass") and read it back on staging.
- **Every item gets its own values**: a title from its name following §1, a description written for this item (what it is, what it is for; derive it from the item's own fields, never copy one sentence into all items), and **its own share image** made from the item's main image with `make-og.mjs`. Add the fields optional, fill every item, then make Page Title and Meta Description required.
- **Secondary locales**: every item's title and description are written in that language too (`cmsLocaleId`). An untranslated locale shows the primary language in search results there.
- **A collection without a template visitors reach** (team members, certificates, steps that only feed lists) gets no SEO group. Its template must give 404 (or be noindex) and stay out of the sitemap: check it on staging and again on the production domain at launch.
- New collection with a template later: the same group in the same task, and a line in `decisions/cms.md`.

## 4. Internal pages

Pages for the team, not for visitors (Styleguide, Components, Example Components, test pages, search results): at launch each gets noindex (`<meta name="robots" content="noindex">` in its page head code) and is taken out of the sitemap (page settings; when the API does not offer the toggle, it is a Designer step), or is set to draft when nobody needs it live. Until launch, staging is not indexed anyway (`robots.txt` Disallow); list the pages in `decisions/site.md` so launch does not miss them.

## 5. Order of work

1. Inventory: `list_pages` (static, templates, folders, drafts), `get_collection_list` + fields, the locales. One table: page or collection, locale, title, description, share image, status.
2. Plan the gaps with the recommended values (§1); one OK. Writing copy for the client is part of the plan: show it.
3. Write through the API; queue the Designer steps (Open Graph image binding, sitemap toggle).
4. Publish once (where publishing is allowed) and run §6 and the final audit of §7.

## 6. Check on the published site

[scripts/seo-check.mjs](scripts/seo-check.mjs) reads the published HTML, no browser:

```
node seo-check.mjs --base https://<staging> --paths paths.txt --internal internal.txt \
  --locales /nl --brand "<Brand>" --max-title 60 --desc-min 120 --desc-max 160 [--json seo.json]
```

`paths.txt`: every static page, every CMS item (or at least three per template), each again with every locale prefix. `internal.txt`: the internal pages. It reports per path the rendered `<title>`, description, Open Graph tags, share image type, `lang` and robots, and flags: missing, too long or short, placeholders, the same text on two pages, the same text in two locales of one page (untranslated), a share image that is not JPG/PNG, an internal page without noindex, noindex on a public page. Exit code 1 on errors.

Then the things the HTML does not show: the Open Graph image binding in the Designer, and once at launch a real share preview (LinkedIn Post Inspector, a WhatsApp message to yourself) and the sitemap on the production domain.

Fresh reviewers check SEO as part of [review](../review/SKILL.md) (checks.md §1 and §1c) with this script and the audit of §7.

## 7. Final SEO audit — the whole checklist

The last step of every SEO round, of a page or a site before it goes to the client, and once more on the production domain on launch day. [seo-audit.mjs](${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs) loads every page in headless Chrome (`npm install` once in `references/fixture`), scrolls it like a visitor and reports per page and per area ok / warning / error, with the Webflow fix under each finding:

```
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs --sitemap https://<staging>/sitemap.xml --per-folder 3 \
  --overview "/blog,/news" --out references/audit/<date>-seo
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs --urls urls.txt --mobile --out …      (also at phone size)
```

Input: a sitemap (`--per-folder 3` keeps three CMS items per folder, `--limit` caps the total), a URL file, or `--base` + `--paths`. `--overview` names the overview pages (blog, news, stories; a trailing `*` matches a prefix), where cards must not carry headings. Exit code 1 on errors.

The nine checklist points (overview cards, landmark order, robots.txt pagination rules, headings, meta and canonical, alt and media, links and crawlable nav, performance, structured data), what the script flags per point and what to do in Webflow: [audit.md](audit.md).

Run §6 (`seo-check.mjs`, titles and descriptions against the client's settings, locales, internal pages) and §7 together: §6 knows the brand and the limits, §7 knows the rendered page. Report as one table: page × area, then the errors with their fix, then what the script cannot judge ([audit.md](audit.md), last section). Fix in the component or template, publish, rerun until there are no errors; warnings are fixed or written down in `decisions/site.md` › **SEO** with the reason (a focus page without a main menu, staging robots).

## 8. Record

- `decisions/site.md` › **SEO**: the client's settings (§1), the internal pages, the overview pages, what is still open (robots.txt and canonical at launch, structured data per template).
- `decisions/cms.md`: the SEO group per collection, how the start values were made, which templates carry which JSON-LD.
- `references/audit/<date>-seo/`: the audit's `seo-audit.md` and `.json`.
- `references/log.md`: one line per round, with both check results (errors / warnings).

## 9. Not in this skill yet

hreflang and canonicals across sites or domains, redirects after slug or folder changes, sitemap settings, AEO (answers for AI search, `data_aeo_tool`), Search Console and analytics checks, a Lighthouse run per template. Add them here when a project needs them.
