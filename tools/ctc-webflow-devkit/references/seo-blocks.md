# SEO while building blocks

The SEO of a Webflow site is decided in its components: a heading level, a tag, a lazy setting or a JSON-LD embed is set once in the definition and every page follows. These rules hold for every section, card, nav and list a build creates or changes; the final check over the site is the [seo](../skills/seo/SKILL.md) skill §7.

Landmarks, one `h1` with no skipped level, alt text and Decorative, link names and captions are accessibility rules too and live in [accessibility/criteria.md](../skills/accessibility/criteria.md) §2–3; SEO follows them as written there. This file adds only what SEO needs on top. A site's `decisions/` overrides a rule here when the owner chose otherwise.

## The rules

| # | Rule | How in Webflow |
|---|---|---|
| 1 | **The page's only `h1` comes from the page-heading block** (hero or page head). No other component holds an `h1`; section titles are h2, item titles h3. | Level fixed in the definition (`set_heading_level`, [lumos-rules.md](lumos-rules.md) §3). A hero reused lower on a page as a teaser gets a variant without the `h1`. |
| 2 | **Cards on overview pages carry no heading.** On a blog, news, stories or campaign overview only the page title is a heading; the card title is text with the heading's look, so the page has one topic and a screen reader does not read 24 headings. A card also used where a heading fits gets a **`Title tag`** setting, default `p`/`div`, h2/h3 only on purpose. | Title as Paragraph with the heading text class, or the Typography Heading's Tag field (Designer; the API cannot set it). |
| 3 | **Page frame order:** nav, page heading, `main` with `section`s, footer. Sections are `section` elements. | The standard page (Global Styles, Nav, `page_main`, Footer) carries it; tags per [accessibility/criteria.md](../skills/accessibility/criteria.md) §2. |
| 4 | **Lazy, except the hero.** Every image loads lazy (Webflow's default) except the largest image above the fold (hero, page-heading photo, first slide): Eager, set in the hero component. Images keep their box while loading (`aspect-ratio` on the class). | Image settings › Load is Designer-only ([webflow-mcp.md](webflow-mcp.md) §7): queue it. |
| 5 | **Navigation is crawlable.** Every menu item is a real `<a href>` in the HTML Webflow serves; a script may open, move or hide the menu, never create its links. A dropdown that only opens a panel has its overview page as a link inside the panel. | Links as elements in the Nav/Menu component. |
| 6 | **FAQ sections offer FAQPage JSON-LD** from the same CMS items they show (a `FAQ schema` toggle on the embed), one FAQPage per page. **Article templates** (news, story, blog) carry Article JSON-LD with `headline`, `image`, `datePublished`, `author`; a vacancy template JobPosting, a breadcrumb BreadcrumbList, Home Organization once. | Embed with CMS field bindings, or the template's Page settings › Custom code before `</head>` (Designer). Escape quotes in bound text. |
| 7 | **No layout shift from late content.** CMS lists, iframes and anything a script fills reserve their height (`min-height`, `aspect-ratio`); load reveals animate `transform`/`opacity` only ([motion.md](motion.md)). | In the classes. |

## The check per block, before the block is done

On the published staging page, or with the pending markup patched in:

```
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs https://<staging>/<page> --block ".<name>_wrap" [--allow-h1] [--overview-block]
node ${CLAUDE_PLUGIN_ROOT}/references/fixture/seo-audit.mjs https://<staging>/<page> --block ".<name>_wrap" --inject pending.html --at "main" --position beforeend
```

`--allow-h1` only for the page-heading block; `--overview-block` for a card grid on an overview page. Block mode checks the root's tag, headings (no `h1`, no skipped level, no card headings on overviews), alt, lazy loading (and the LCP image when it sits in the block), link names, and FAQ markup without FAQPage JSON-LD. Errors block "done"; a warning is fixed or written in `decisions/components/<name>.md` with its reason.
