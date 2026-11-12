# Site

## 2026-10-29 — Client repo lives in the wireframes repo
Conflict: the kit expects a separate `wf-<client>` repo.
Choice: the client setup lives in the root of `humainrecruitment`, next to `wireframes/` and `docs/`.
Why: owner's choice; everything for HumAIn in one place.

## 2026-10-29 — Not production yet
Choice: `"production": false` until launch; flip to `true` when the site goes live.
Why: nothing is live, so the guard does not need to ask before changes.

## 2026-10-29 — Figma themes onto Lumos modes
Conflict: Figma Theme modes are Base / Dark / Brand; Lumos ships a light base mode and Dark.
Choice: Base = Lumos' base mode, Dark = Dark, Brand = new mode `Brand`.
Why: same meaning, keeps Lumos' `u-theme-*` classes working.

## 2026-10-29 — Text styles win over Figma's Text Style variables
Conflict: Figma's text styles (H1–H5 125 %, letter-spacing 0) disagree with its Text Style variables (1 / 1.1, tight -0.03).
Choice: follow the text styles; new `line-height/heading` = 1.25, letter-spacing 0. Confirmed by the owner.
Why: the text styles are what is applied on the pages (1,000+ uses).

## 2026-10-29 — Mobile heading sizes
Conflict: Figma's Mobile mode keeps every font size equal to desktop; on the mobile frames the designer instead picked a smaller desktop style for the same title (a desktop H1 is styled H3 on mobile).
Choice: the semantic level stays (an H1 stays an H1); its mobile size is the size of the style used for that same title on mobile. Matched titles (Home, Opportunities, Opportunities / Detail):
- Display 72 → 36 ("Project delivery roles, ready for you.", "Project Controls Manager" → H3)
- H1 60 → 36 ("Similar opportunities" → H3; the home hero → H3)
- H2 48 → 30 ("No perfect match yet?…", "Looking for a senior project-controls expert?" → H4)
- H3 36 → 30 ("About the role", "Responsibilities"… → H4)
- H4, H5, H6 unchanged (same style on mobile)
Display, H1, H2 and H3 scale fluidly between 402 and 1512 px (`references/fluid-values.md`).
Why: owner rule — read the designer's mobile choice per title, keep the level.
No exceptions: every heading of a level gets that level's mobile size, even where a mobile frame drew it differently ("Trusted by the people who hire." is H4 30 on the mobile frame, gets H1 36). Owner: the mobile headings stay in one system; deviating from the design is fine there.

## 2026-10-29 — Only Onest and Vend Sans
Conflict: IBM Plex Mono appears in the Figma file.
Choice: no third font. It only occurs in the `[figma-only]` documentation frames (Text styles, Color variables), never in a page design.
Why: owner rule — the styleguide uses Vend Sans and Onest only; no other fonts.

## 2026-10-29 — Extra text styles
Choice: Text Medium, Label and Label Large become Text Style modes with their own `u-text-style-*` class. Display Large, Text X Large, Text XX Large do not (3–7 uses; sized per section).
Why: each of the three is used 100+ times. Confirmed by the owner.

## 2026-10-29 — Site linked
Choice: Webflow site "Humain" (`6ae35364a38b2d71cab8c607`), staging `humain-d16f03.webflow.io` (from the site's short name; `get_site` returns no staging field). The Theme collection already had a `Brand mode`; that is the Figma Brand theme (no new mode created).

## 2026-10-29 — Label letter-spacing as a variable
Conflict: the plan gives Label / Label Large 0.1em letter-spacing but no variable for it.
Choice: new `letter-spacing/wide` = 0.1em in Typography; both Label modes link to it.
Why: Text Style values stay links, never literals.

## 2026-10-29 — Trims on a starter without trim variables
Conflict: this Lumos starter has no trim variables and no trim on the `u-text-style-*` classes (the Global Styles embed is not readable through the API).
Choice: `font/primary-trim-top|bottom` (Onest 0.3745 / 0.3325 em) and `font/secondary-trim-top|bottom` (Vend Sans 0.35 / 0.35 em), computed from the Google Fonts files (hhea ascent/descent, OS/2 cap height, typography.md formula). Text Style gets `trim-top` / `trim-bottom`: body modes link the Onest pair, Display and H1–H6 the Vend Sans pair. Whether the Global Styles embed reads `--_text-style---trim-*` is a Designer check (designer-queue).

## 2026-10-29 — Lumos formulas kept
Choice: `max-width/main` keeps Lumos' `calc(var(--site--viewport-max) * 1rem)` (= 94.5rem with viewport-max 94.5) instead of a static 94.5rem; `max-width/full`, `site/column-width`, `nav/height-total`, `focus/offset-inner`, `radius/round` untouched. `section-space/page-top` (not in Figma) keeps its Lumos clamp.
Why: same value, and the formulas keep the system linked.

## 2026-10-29 — New text-style classes
Choice: `u-text-style-text-medium`, `u-text-style-label-large`, `u-text-style-label` (names as in the plan), copied from `u-text-style-main` (which in this starter has no `display: flow-root`, so neither do the copies), each set to its Text Style mode. `u-weight-semibold` added (Onest + `font/primary-semibold`).

## 2026-10-29 — Fonts self-hosted, not Google Fonts
Choice: Onest and Vend Sans as uploaded custom fonts, one variable woff2 per family (wght axis: Onest 100–900, Vend Sans 300–700), Latin subset from Fontsource (OFL-1.1), ~35 KB each. No italics (not in the design).
Why: owner — Google Fonts is slow. Latin covers Dutch and English; Webflow takes no unicode-range, so latin-ext is left out.

## 2026-10-29 — Buttons follow the theme
Conflict: Figma has separate `button-secondary-white/*` and `button-back/*` colours for buttons on dark backgrounds; the foundations copied every button colour 1:1 into all three Theme modes.
Choice: Dark and Brand modes of `button-secondary/*` link to `button-secondary-white/*`, of `button-tertiary/text|accent|text-hover|accent-hover` to `button-back/*`. The `-white` and `back` variables stay (unused by classes) as the Figma mapping. `verify-foundations.py` checks the new values.
Why: a button on a dark section must swap colours by itself (kit rule: dark version = theme, not variant).

## 2026-10-29 — Site-only theme variables for buttons
Choice: `button-primary/shadow-1…4` (#0000001a, #00000017, #0000000d, #00000003, same in every mode) for Primary's drop shadow, and `button-tertiary/background` (→ `swatch/transparent`).
Why: colours only through Theme variables; Figma has no variable for the shadow colours or a tertiary background.

## 2026-10-29 — Section attribute for the nav colour
Choice: a page section may carry `data-section="dark"` or `data-section="light"` on its wrap; the nav script reads it to decide the bar's text colour over that section. Without it the script reads the background colour (photo or video = dark). Mark a section only when the automatic reading is wrong. Contract and the other `data-nav-*` attributes: `decisions/components/nav.md`.

## 2026-10-30 — Light sections are white (Base `background` → light-100)
Conflict: in Figma all 15 page frames and 36 of ~50 top-level sections are `background-2` (white); only 7 sections use `background` (light-200), the rest are gradients. Lumos paints a Light section, `u-theme-light`, `u-section` and `body` with Theme `background`, which the foundations had set to light-200 (1:1 with the Figma variable name). Light-200 cards vanished on every default Light section.
Choice (Aniek, via Claude; owner: "kies jij maar"): Theme `background` in **Base mode** now points to `swatch/light-100` (white). Dark (`dark-900`) and Brand (`brand-500`) are unchanged. Cards keep Figma's light-200 through their own `card/background` variable (`decisions/components/cards.md`).
Why: one variable, the Lumos way; the site's light sections now match the Figma pages, and the card shows as designed.
Consequences: the Figma variable `background` (light-200) no longer equals the site's Base `background` — `verify-foundations.py` will report this one mismatch; it is intended. Figma's 7 light-200 sections need their own route when those pages are built (e.g. a fourth Theme mode "Light Grey" with `background` = light-200) — not made yet. Anything else that painted Base `background` (body, `nav_skip_wrap`, `form_range_thumb_element`, `u-background-1`, the Cover card placeholder) is white now too.
Example Components: the 4-card showcase Section (`3057630f-9ab6-4cc6-3104-ef64eb67c98a`) is set to Theme **Light** as the light card example; the rest of the page stays dark (body `u-theme-dark`).

## 2026-10-30 — Figma MCP has access now
Owner gave the Figma MCP account (`aniek@cutthecode.com`) edit access to `18m34a7vzkzopkwGoojmUx`. Use the MCP first; Claude in Chrome signed in as `aniekvelthuizen@gmail.com` (Plugin API `window.figma` works there) stays the fallback. The entry below is history.

## 2026-10-29 — Figma MCP has no access to this file; use the browser instead
Conflict: the Figma MCP server's own connected account cannot open `18m34a7vzkzopkwGoojmUx` ("Looks like you don't have edit access to this file").
Choice: view the Figma file through the built-in/Claude-in-Chrome browser instead, signed in as `aniekvelthuizen@gmail.com` (saved to memory). Reading structure (layer names, component props, icon names) this way works; nothing that needs the Figma MCP's own read/write calls (`get_design_context`, `download_assets`, …) is available until the MCP connector itself is re-shared.
Why: unblocks Figma inspection without waiting on a re-share; also means icon/asset exports that normally go through the MCP Plugin API are done another way (see `decisions/components/icon-set.md`).

## 2026-10-29 — DevKit in the repo
Choice: the Cut the Code Webflow DevKit is committed as-is in `tools/ctc-webflow-devkit/` (from `ctc-webflow-devkit-main.zip`, md5 `04ef0a7a809e1c6e792c3b425de0a0a8`). A new kit version replaces the folder in one commit.
Why: owner — every session has the kit without uploading the zip, and the repo records which kit version built the site. Its hooks are not active from there (they only run as an installed plugin).

## 2026-10-31 — One brand gradient for footer and hero
Choice (Aniek, via Claude): the Theme variables `footer/gradient-start | -middle | -end` are renamed **`gradient/brand-start | brand-middle | brand-end`** (same ids; the footer's CSS follows the rename). Used by `footer_wrap` and `hero-experts_wrap`. Details: `decisions/components/hero-experts.md`.
Why: Figma's footer and Home header use the same three-stop gradient; one set of variables, named for what it is.

## 2026-11-02 — Staging moved to humain-dev.webflow.io
Owner (Aniek): the site's Webflow subdomain is now **humain-dev.webflow.io**; humain-d16f03.webflow.io answers 404 on every page. `project.json` and `CLAUDE.md` updated. Older notes, scripts and audits still name the old domain; pass the new URL to the check scripts.
Also seen (2026-11-02): the claude.ai Webflow connector used for this site now only lists Buitencampus and answers 404 for site `6ae35364a38b2d71cab8c607` — API work needs that connector re-pointed to the Humain workspace.

## 2026-11-02 — No Webflow connector reaches the site (CTA session)
Seen by Aniek's CTA session: the local `webflow` connector lists Core / THDV / Wayfinder, the claude.ai Webflow connector Buitencampus, `webflow-studijob` Studijob; all three answer 404 for `6ae35364a38b2d71cab8c607`. API work on Humain needs one of them re-authorised on the workspace that holds the site.

## 2026-11-02 — Section CSS lives in an embed inside the section component
Choice (Aniek, via Claude; follows Split Content): a section component's own small CSS (Space Top switches, hiding an empty optional span) sits in an HTML embed with `u-embed-css` inside the component, selected by the section's `data-*` attribute and its own classes. Section components get no showcase on Example Components for now (none of them have one).
Why: the CSS travels with the component to every page; the API cannot write attribute selectors or `:empty` on classes. Recorded after the CTA Split review asked for it.
Update (same day): after the owner re-pointed it, the **claude.ai Webflow connector** reaches Humain again (CTA Split was built with it); the local `webflow` connector still does not.

## 2026-11-02 — Duplicating a variant copies unrelated variant-scoped CSS
Seen (CTA session, re-check reviewer): `duplicate_variant` on Clickable (Focus Ring Outside → Focus Ring Theme `95904e04-…`) published ~80 `:where(.w-variant-95904e04…)` rules on 59 classes of other components (cta-split, footer, hero-experts, sticky-steps, split-content …), some already stale. Only `clickable_link` / `clickable_btn` carry that class, so nothing renders differently. Left in place; clear them in the Designer if the stylesheet size ever matters. Next time create the variant with `create_variant` and set only its own styles.

## 2026-11-05 — Rest of the site as orchestrated subagents
Owner (Aniek), via Claude: build all remaining components and pages in one run. Plan: `references/plans/2026-11-05-rest-of-site.md`; agent rules: `references/plans/2026-11-05-agent-brief.md`.
Seen: `webflow-devkit:builder` only gets the local `webflow` connector, which answers 404 here, and has no ToolSearch. `general-purpose` agents do reach the site through the claude.ai connector and can load the write tools. So every agent is general-purpose and reads `agents/builder.md` or `agents/reviewer.md` itself.
Choice: agents build and check; only the main session publishes, opens the Designer and edits `log.md` and this file.

## 2026-11-05 — Scope calls (owner)
- All components in Figma's `Components` section and all pages get built, also `Dynamic / Open roles` and `Content / Values`, which no page uses (they wait on Example Components).
- The tabbed parts of the old homepage stay out (owner, 2026-11-02). The large footer (`device=desktop`) stays out: the client did not want it.
- CMS: Opportunities, Cases, Rates, FAQ, Team, so the client can fill them; fields may change when Bullhorn comes.
- Motion stays a separate pass over finished pages.


## 2026-11-05 — Card titles are plain text with a fixed H3 (Aniek Velthuizen, via Claude)
Seen: Card Profile, Card Opportunity and Card Primary titles were rich text. A CMS plain-text field cannot bind to rich text, so every CMS card showed the default title; and static titles set through the API render `<p>`, which needed 64 per-instance H3 clicks in the Designer.
Choice: Title is a plain-text prop on a native H3 on all three, as Card Expert already has plain text. Text is plain too on Card Profile and Card Opportunity; Card Primary's Text stays rich text.
Why: the client fills the fields without formatting steps, CMS binding works, and every new card is an H3 without a Designer step. A title cannot carry a break or a span any more.

## 2026-11-05 — Form error state is global (Aniek Velthuizen, via Claude)
`:user-invalid` is not a class state in Webflow, so the three rules live in `Global | Custom Code`, where every form gets them. Text «Please check this field» and `#b91c1c` are still placeholders.

## 2026-11-05 — Embeds may hold JS (Aniek Velthuizen, via Claude)
Section embeds hold CSS, and a small script when the block needs one to work (Stage Slider, Opportunity List). Variant-scoped `::before`/`::after` publish on this site as `.x:after:where()`, which matches nothing: use the section's embed for those.

## 2026-11-12 — Favicon and webclip from one 256 px source (Aniek Velthuizen, via Claude)
- Owner supplied `favicon.png` (24 × 24) and `webclip.png` (227 × 227). Webflow's Site settings › Icons now takes **one** square upload and generates every size (favicon light/dark 32, 48, apple-touch 180, 192, 512).
- Uploaded `references/assets/icons/webclip-256.png` (the webclip scaled to 256) for all three slots; the 24 px favicon is kept as source only (`favicon-source-24.png`, `favicon-32.png`), since Webflow's downscale of the larger file is sharper than an upscaled 24.
- 512 is upscaled from 256. For a crisper PWA/large icon, ask the owner for a ≥ 512 px original and re-upload in the same place.
- Not settable through the Data API: done in the dashboard (Claude in Chrome).
- 2026-11-12, owner round: the first icon's navy top blended into dark browser tab bars. Owner supplied a lighter version for dark mode; `webclip-dark-256.png` (from `webclip-dark-source-227.png`) is on **Favicon — dark only** (Light and Webclip unticked in the upload dialog). Light favicon and webclip keep the original.

## SEO (2026-11-12, Aniek Velthuizen, via Claude)
- Settings (kit default, owner not asked separately): title `<Page> | HumAIn` ≤ 60, description 120–160 whole sentences in English, Open Graph title/description "Same as SEO", share image 1200 × 630 JPG/PNG. No secondary locales.
- The 14 public static pages have their own title and description, written from each page's own copy (`references/seo-static-pages.json`). Home's Lumos placeholders («Website Name», «Place website meta description here») are gone. Provisional copy: the owner/client may rewrite.
- Internal pages for launch (noindex + out of sitemap, or draft): Styleguide, Example Components, Search Results, Standard Page (already draft), and the CMS templates without visitor use (Team, FAQ, Rates, Cases, Experts — see owner list).
- Open: share images on every page (none yet; `make-og.mjs`); Opportunities template SEO is bound to content fields (`name`, `intro`) → title without «| HumAIn», empty description when Intro is empty, three items share one title. Needs the SEO field group from the seo skill §3 (CMS change).

## 2026-11-12 — Email field has its own error line (Aniek Velthuizen, via Claude)
Owner: «Please check this field» was too general under the email field. One rule added in the first embed of `Global | Custom Code`: `.form_label_wrap:has(.form_field[type="email"]:user-invalid)::after` says «Please enter a valid email address», for an empty and for a malformed address alike. Other fields keep «Please check this field». Every form gets it (Contact, Resume, Opportunity Detail).
