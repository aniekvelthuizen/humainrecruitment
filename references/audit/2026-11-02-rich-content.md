# Review — Rich Content, 2026-11-02

Reviewer: fresh reviewer agent (read-only), for Aniek Velthuizen. Page: https://humain-dev.webflow.io/privacy-cookies.

**Review — Rich Content, 2026-11-02.** 1 component: needs fixes, nothing broken. The page at 1512 matches Figma to the pixel. What's left: a title sits right on top of a list placed under it, the bottom space stays at 192 on phones, and the extra rules are in an embed when they could be Designer styles.

| Component | Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Rich Content | ✅ | ⚠️ | ⚠️ | 🧹 | ⚠️ | ? | ✅ |

**Off**
1. **A list right under a section title sits on the title** (2 px of space; text under a title gets 9–10). *Fix: Designer nested style "All List Items inside rich-content_text": margin 0.*
2. **On phones and tablets the space under the text stays 192 px**, while every Home section drops to 96 below 992. *Fix: `rich-content_wrap` padding-bottom `section-space/main` at the ≤ 991 breakpoint (API).*
3. **The title size, title gaps and link look are set in a CSS embed** instead of in Webflow styles. *Fix: move them to Designer nested styles, then delete the embed (route below).*

**Tidy**
4. **Not on Example Components.** No other section on the site is there either. *Fix: add one showcase instance when the site's sections get their showcase pass.*
5. **A new instance starts with one plain paragraph and no title.** I did not read this back myself. *Fix: Designer, Properties › Content: give the default H2 + paragraph ×2.*

**Your call**
❓ **Q1 - Sub-headings (H3) in the text**: an editor's H3 shows at the same size as the section titles (36 / 30 px), with 20 px under it where the titles have 10. ➡️ Show H3 one step smaller (H4 size) with 10 under it, so a subsection reads as one.
❓ **Q2 - Link underline**: at rest a link has the body colour plus a 20 % underline; it is easy to miss in a long legal text. ➡️ Keep it (it is the site's `text-link/*` theme), or use `text-link/border-hover` for the underline at rest.

Full return and evidence below.

---

## Rich Content — Privacy & Cookies (https://humain-dev.webflow.io/privacy-cookies)
Checked: API not reachable (local `webflow` connector → 404 on `get_site`); structure and CSS from the published HTML and `humain-dev.webflow.shared.9097088fc.css`; props from the main session's read-back (not re-read) · published 2026-11-02 (log: after the build; `lastPublished` not readable) · widths 1512, 1440, 1280, 1100, 1010, 992, 990, 900, 768, 767, 600, 479, 402, 375, 320 + WebKit iPhone 15 · design `references/figma/content-wysiwyg/component-1512.png`, `tree.txt`
| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ⚠️ | ⚠️ | 🧹 | ⚠️ | ? | ✅ |

### Findings
- ⚠️ Spacing · A list placed right under a section title sits on the title · Seen: patched DOM, h2 → first bullet has a 2 px glyph gap (h2 → paragraph 9) at 1440 and 375. Cause: `h2 + *` sets the ul's margin-top to 0, and `.u-rich-text li` still has margin-top −6.6 px from the deleted trim variables (`--_text-style---trim-top<deleted|…>`, still set by `u-text-style-large`) · Fix: nested "All List Items inside `rich-content_text`" margin-top/bottom 0 (the text is untrimmed, so the trim correction must go too). The site-wide repair of `.u-rich-text li` is debt, plan conflict 4 · By: Designer
- ⚠️ Responsive · Bottom space stays 192 px on phone and tablet; the site's sections drop to 96 below 992 · Seen: `rich-content_wrap` padding-bottom 192 at 990/767/402/375; Home at 402: sticky-steps, split-content, spotlight-grid and cta-split all 96 (192 at 1512); decisions split-content.md / sticky-steps.md "< 992 section-space/main" · Fix: `rich-content_wrap` medium breakpoint padding-bottom → `section-space/main` · By: API
- ⚠️ Code · Typography, spacing and link colours live in a per-section CSS embed · Seen: `.u-embed-css` in the wrap holds `.rich-content_text h2 {font-size/margins}`, `h2 + *`, `a`, `a:hover`. All of these are styling; lumos-rules §0 says "styling is never code; nested selectors are set in the Designer". The owner allows Designer work (CLAUDE.md 2026-10-29). The other section embeds hold things classes cannot do: nth-child steps and slot children (Stagger Cards), sticky stacking and the cover script (Sticky Steps), attribute switches (Split Content). This one does not · Fix: Designer nested styles inside `rich-content_text`: All H2 → Text Style H3 size, margin-top `space/7`, margin-bottom `space/3`; All Paragraphs and All Lists → margin-top 0, margin-bottom `space/4` (this removes the need for `h2 + *`: the 32 above a title still wins by collapse); All Links → `text-link/*` colours + underline, hover state; then delete the embed and update decisions/components/rich-content.md · By: Designer
- 🧹 Lumos · Not shown on Example Components · Seen: `/example-components` has 0 `rich-content_wrap` (also 0 for split-content, stagger-cards, sticky-steps, hero-experts, cta-split: a site-wide gap) · Fix: showcase instance in the sections' showcase pass · By: Designer
- 🧹 Props · A fresh instance's default is one lorem paragraph, no title · Seen: decisions/components/rich-content.md "Content prop and headings" + main session's read-back (not re-read: API 404) · Fix: Properties › Content › Edit Rich Text: H2 + paragraph ×2 · By: Designer

### Already decided (not findings)
- Section titles in the text are H2 shown at the H3 size (36 → 30) — decisions/components/rich-content.md 2026-11-02 (owner)
- Column 57rem literal (912, no variable) — rich-content.md 2026-11-02 "Structure"
- `u-text-trim-off`: untrimmed text so Figma's box gaps are literal — rich-content.md 2026-11-02
- No legal header / no h1 on the page yet; header is its own block — rich-content.md 2026-11-02 (owner)
- H3/H4 etc. keep Lumos rich-text defaults — rich-content.md (owner); its visible effect is raised as Q1

### Your call
- ❓ Q1 H3 inside the text: same size as the H2 titles (35.6 px at 1440, 30 at 375), with 20 px under it instead of 10 · Seen: patched DOM `measure/patched-clean-1440.png` · ➡️ H3 at the H4 size with `space/3` under it (Designer nested style); on phones H2/H3/H4 are all 30 by the site rule either way · By: owner
- ❓ Q2 Link at rest: body colour `rgb(3,11,27)` with an underline in `rgba(3,11,27,.2)` · Seen: `measure/link-rest.png`; hover goes to `#250059` + full-colour underline, keyboard focus a 2 px ring with offset 3, no ring after a mouse click · ➡️ keep (theme `text-link/*`) · By: owner

### Content
- Lorem ipsum in all four title/text pairs (owner: until the privacy text arrives).
- The placeholder Lumos hero above the section (out of scope).

### Not checked
- API read-back (component definition, prop tooltip, default value, class values, variables): every Webflow connector here answers 404 for `6ae35364a38b2d71cab8c607`. I checked classes through the published CSS. Props are `?`.
- `lastPublished` vs last page edit: not readable. The log says it was published after the build.
- Whether the embed CSS shows on the Designer canvas (needs the Designer).
- Page SEO and share image: page level, out of scope (the meta description is set; no og:image in the HTML).

### Checked and fine
- 1512: section 1204 (Figma 1204), column x 300 w 912, title 45 high, title → text 10, text 150, text → next title 32. Line breaks match `component-1512.png` exactly.
- Every width 320–1512: no sideways scroll, nothing past the edge, no clipped text. The column fills the container (`site/margin` sides) below ~1010, and is centred at 912 above it. The title scales fluidly 36 → 30 (two lines at ≤ 479). WebKit iPhone 15 is the same as Chrome (2404).
- Fonts: titles Vend Sans 700, `line-height/heading`; text Onest 20/30.
- Nav over this section turns dark (`data-nav-theme=light`, link colour rgb(3,11,27)) after real scrolling, at 1440 and 375.
- No console errors, no failed requests.
- Structure: `section.rich-content_wrap.u-theme-light › div.rich-content_contain.u-container › div.rich-content_text.u-rich-text.u-text-style-large.u-text-trim-off.w-richtext`, then the embed. Flat, 3 utilities, no px, spacing from `section-space/*` and `space/*`.

## Evidence
Session scratchpad (not committed): `/private/tmp/claude-501/-Users-aniek-Projecten-HumAIn-Recruitment/24339440-af04-4b34-a87b-0e95fead0892/scratchpad/review/rich-content/`
- `sweep/` (summary.md, full-page shots per width), `distances.md`
- `measure/report.json` (baseline per width, patched DOM with list / link / H3 / H4 / ol / blockquote, link states, WebKit), `base-*.png`, `patched-clean-1440.png`, `patched-clean-375.png`, `link-rest|hover|focus|after-click.png`, `nav-over-section-*.png`
- scripts: `rc-review.mjs`, `patch2.mjs`, `nav.mjs`, `home.mjs`
