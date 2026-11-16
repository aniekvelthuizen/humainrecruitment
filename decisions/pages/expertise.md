# Expertise pages (6 roles, 3 sectors)

## 2026-11-16 — Nine static pages for the Expertise menu (Aniek Velthuizen, via Claude)
Conflict: the Expertise dropdown's roles and sectors pointed at placeholder pages (`/project-delivery-experts`, `/consulting-services`, `/project-controls`; nav.md 2026-10-29 "to be decided"). No Figma design and no client copy for them.
Choice (owner, Aniek): **nine static pages**, not a CMS collection, with the site's existing sections and **draft copy**.
- Slugs at the root: `/project-director`, `/cost-controller`, `/change-manager`, `/project-controls-manager`, `/planner-scheduler`, `/document-control`, `/oil-gas`, `/data-centres`, `/energy`. No folder (would need the Designer; root keeps the nav links simple).
- Each page is a duplicate of **Project Controls** (`6ae37d600e3ebd4e1ff84b86`, the closest page kind): Page Header · Split Content (Glow, 3 Card Bullets) · Card Grid (6 Card Primary, the duplicate's last three removed) · Split Content Image Left («How it works», unchanged) · Team Fan (unchanged) · CTA Split (title per page, text and buttons unchanged).
- Changed per page: Page Header eyebrow («Expertise · Roles» / «Expertise · Sectors»), title, muted title, text; Split 1 eyebrow, title, muted, text, 3 bullets; Card Grid eyebrow, title, text, 6 card titles and texts; CTA title + muted. Photos, icons, buttons and links stay as on Project Controls.
- Copy source: `references/copy/expertise-pages.json` (placeholder, English, no claims or numbers; owner/client may rewrite). SEO title and description per page set from that file; Open Graph copies them.
- Nav: the nine `nav_dropdown_link`s in `Menu` (`f898fa14-…`) are URL links to these slugs (same as the other nav links).
Why: owner's choice; nine pages can differ later, layout changes need nine edits.
Open: Card Primary icons are Project Controls' first six (dashboard, EVM, schedule, risk, forecast, reporting) and do not match every card's text; Team Fan and the second Split are the same on all nine; no share images (as the rest of the site).
