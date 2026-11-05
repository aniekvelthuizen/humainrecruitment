# Plan — Rest of the site (all remaining sections and pages) — 2026-11-05

Aniek Velthuizen with Claude. **Status: owner's go 2026-11-05; phase 1 running.**

## In short

Builds every section the Figma component page still needs (11 new or extended blocks, plus the Page Header, the CMS and card changes) and fills the 13 empty or partial pages plus the last two Home blocks, as orchestrated subagents in six phases. It reuses every block already approved; they are placed, not rebuilt. Agents build and check; only the main session publishes, does the Designer steps and touches `log.md` / `site.md`. Staging gets about five publishes in total, one Designer pass before the pages are composed, and reviewers at fixed moments.

Source: Figma `18m34a7vzkzopkwGoojmUx`, page `Visual design` (`2027:76`); read 2026-11-05 with `get_metadata`. Mobile frames exist only for Home, Opportunities and Opportunities / Detail; every other page reflows by the rules of the site.
Pages: see Page map.
Neighbours' system: Lumos Section build-up, Split Content, CTA Split, Spotlight Grid. Motion rule stays: calm, hero intro + hovers only (`decisions/motion.md`).

## What is true today (measured 2026-11-05)

- Staging: Home has 8 of 10 blocks. Project Delivery Experts has 2 blocks (Final score, Trust statement). Privacy has Rich Content without its header. The other 10 pages render only Nav, Footer and a placeholder.
- CMS: only `Experts`. No Opportunities collection, so no Opportunity detail template yet.
- `references/components.json` and `classes.txt` are from 2026-10-29: refresh in phase 0.
- Connectors: only the claude.ai Webflow connector (`mcp__846065a5-9856-4ca3-a702-f70371370f30__*`) reaches the site. The local `webflow` connector answers 404.
- Agent types (tested): `webflow-devkit:builder` only has the local connector, has no ToolSearch and answers 404 → **not usable here**. `webflow-devkit:reviewer` has the same tool list by definition (not separately tested) → not used either. `general-purpose` agents reach the site and can load the write tools → **all agents are general-purpose, their brief starts with "read and follow `tools/ctc-webflow-devkit/agents/builder.md`" (or `reviewer.md`)**, the fallback the review skill describes. Not filed as a kit issue (house rule); noted here and in `decisions/site.md` at the start.
- Browser: Claude in Chrome is connected to the main session (owner, 2026-11-05). A subagent saw "not connected" before that and was not re-tested: browser work stays in the main session.
- Figma: fully exported to `references/figma/rest-of-site/` on 2026-11-05 through the Plugin API (units, pages, 3 mobile frames, images, icons). Builders never call Figma. Pictures and originals are git-ignored (82 MB); text specs are committed. Agent rules: `references/plans/2026-11-05-agent-brief.md`.

## Page map

Confirmed against each instance's main component (`references/figma/rest-of-site/pages/*/index.txt`). ✓ = exists on the site.

| Page (Webflow) | Figma frame | Blocks, top to bottom (Nav, Footer on all) |
|---|---|---|
| Home | 1. Home B `2710:48615` | ✓ all, plus **Sticky Steps Plain** (`2710:57363`) and **3 UBRS** (`2710:57450`) |
| Hire an Expert | 2 `2234:4257` | **Header Hire**, ✓ Sticky Steps, **3 UBRS**, **Facts Row**, **Pricing Row**, ✓ Spotlight Reviews, ✓ CTA |
| Project Delivery Experts | 3 `2248:6373` | **Header**, ✓ Split Content, **Stage Slider**, **Sticky Steps glass, purple**, ✓ Final score, ✓ Trust, **Card Grid dark-large**, ✓ CTA |
| Consulting Services | 4 `2277:7348` | **Header Light**, **Sticky Steps glass**, **Card Grid light-small**, ✓ Split Content, ✓ CTA |
| Project Controls | 5 `2283:9754` | **Header**, ✓ Split Content, **Card Grid dark-small**, ✓ Split Content, **Team fan**, ✓ CTA |
| About Us | 6 `2292:8440` | **Header**, ✓ Split Content, **Team**, **Facts Row**, ✓ CTA |
| Clients | 7 `2292:8938` | **Header Vertical**, **Cases**, ✓ Spotlight Reviews, ✓ CTA |
| How It Works | 8 `2292:29086` | **Header Vertical**, **Sticky Steps Plain**, **Client journey** (`2292:33020`), ✓ Split Content, ✓ CTA |
| Rates | 9 `2304:33647` | **Header Vertical + Pricing Row**, **Fee List**, **FAQ**, ✓ CTA |
| Contact | 10 `2314:18290` | **Header**, **Contact form**, ✓ CTA |
| Analyse My Resume | 11 `2318:18686` | **Header**, **Resume form**, **Sticky Steps Plain** |
| Opportunities | 12 `2239:5586` | **Header Opportunities**, **Opportunity list**, ✓ CTA |
| Opportunities / Detail (new CMS template) | 13 `2318:21340` | **Header Opportunity**, **Opportunity content**, **Similar opportunities** |
| Careers | 14 `2318:19447` | **Header**, ✓ Split Content, **Internal vacancies**, ✓ CTA |
| Privacy & Cookies | 15 `2323:22238` | **Header**, ✓ Rich Content |

## Reuse

| Design section | Existing | Decision | Reason |
|---|---|---|---|
| Content block, Final score, Trust statement | Split Content | place | same block, owner-approved |
| Content / CTA | CTA Split | place | props exist; the three taller instances (744 / 804) use Space Top |
| Content / Testimonials | Spotlight Grid › Reviews, Card Testimonial | place | same block |
| Scrolly Glass cards (Home, Hire), Recruitment process (PDE, Consulting) | Sticky Steps + Card Primary Process | place; a variant only for the purple background on PDE | same glass cards |
| Scrolly Plain (How it works), Recruitment process (Home, Resume) | Sticky Steps | extend: variant Plain, new item Process Step | one pattern, seen on three pages: sticky intro, numbered steps |
| Content / 3 UBRS, Client journey | Stagger Cards | extend: 3 UBRS as is; 5-column variant on gradient for Client journey | centred header over stepped cards |
| Assessment process | Lumos Slider, Card Primary Stage | new section, reuses both | photo + stage cards + arrows |
| Grid of cards | Card Primary | new section, reuses the card | no grid section yet; dark-large also has the closing statement with the bar visual |
| Team, Cases | Card Profile Person / Role / Case | new sections from the CMS | lists the client fills |
| Pricing | Card Primary Pricing, Card Bullet | new section, reuses the card; also in the Rates header slot | same three cards |
| Rates, FAQ | Lumos Accordion for FAQ | new sections from the CMS | |
| Forms | Lumos Form components | new section, types Contact and Resume | |
| Opportunity list, Similar, Open roles, Internal vacancies | Card Opportunity | new sections from the CMS | |
| Headers | Logo Marquee, Card Expert Match in slots | new: one Page Header | no page header yet |
| Facts & Figures, Values | — | new | nothing alike |

**Owner, 2026-11-05: every component in Figma's `Components` section (`2234:4488`) and every page gets built.** So `Dynamic / Open roles` and `Content / Values` are built too, even though no page frame uses them; they sit on Example Components until a page needs them (exception to "no showcase", `decisions/site.md` 2026-11-02).
**Still not built:** the tabbed old-homepage parts, per the owner's specific call of 2026-11-02: `Content / Services` type=services and its tab states, `Content / Mobile` type=services, `Header / Home v01` type=home and variant-2. Told to the owner on 2026-11-05; reversible by one word from the owner.

## Units

Component name · class root are fixed here. Test page = where the block goes until phase 5.

| # | Unit | Component · root | Figma folder | Test page | Phase | Parallel |
|---|---|---|---|---|---|---|
| 1 | Page Header: variants Default, Light, Vertical, Opportunity, Search (Opportunities), Split (Hire); slots for the row under the text and the visual; `data-hero-reveal`; `Global \| Custom Code` per `decisions/motion.md` | Page Header · `page-header_` | `page-header` | Privacy & Cookies (above Rich Content) | 1 | no, first |
| 2 | CMS collections and sample items (below); templates without a design set to draft if the API allows | — | `pages/*` | — | 1 | no |
| 3 | Card changes the designs ask for, compared one card at a time: Card Primary (Journey for Client journey, framework cards, grey 3 UBRS, glass Pricing), Card Profile, Card Opportunity (internal vacancy with text) | existing | `card-grid`, `pricing`, `stagger-extended`, `team`, `opportunity-more`, `assessment` | Example Components | 1 | no: shared prop ids |
| 4 | Sticky Steps Plain + Process Step; check PDE and Consulting against glass | Sticky Steps · `sticky-steps_`; Process Step · `process-step_` | `sticky-steps`, `process` | How It Works | 2 | yes |
| 5 | Stage Slider | Stage Slider · `stage-slider_` | `assessment` | Project Delivery Experts | 2 | yes |
| 6 | Card Grid: dark-large, dark-small, light-small | Card Grid · `card-grid_` | `card-grid` | Project Controls | 2 | yes |
| 7 | Facts Row + Values Grid | Facts Row · `facts-row_`; Values Grid · `values-grid_` | `facts-values` | About Us | 2 | yes |
| 8 | Pricing Row | Pricing Row · `pricing-row_` | `pricing` | Hire an Expert | 2 | yes |
| 9 | Stagger Cards: 3 UBRS, Client journey | Stagger Cards · `stagger-cards_` | `stagger-extended` | Home | 2 | yes |
| 10 | Forms: Contact (details, map), Resume (upload, steps) | Form Section · `form-section_` | `forms` | Contact | 2 | yes |
| 11 | Team Grid, Team Fan, Cases Grid from the CMS | Team Grid · `team-grid_`; Team Fan · `team-fan_`; Cases Grid · `cases-grid_` | `team`, `cases` | About Us, Project Controls, Clients | 3 | yes |
| 12 | Fee List, FAQ List from the CMS | Fee List · `fee-list_`; FAQ List · `faq-list_` | `rates`, `faq` | Rates | 3 | yes |
| 13 | Opportunity list: count, sort newest, search + 3 filters from the header (small script), load more, empty state | Opportunity List · `opportunity-list_` | `opportunity-list` | Opportunities | 3 | yes |
| 14 | Detail template with apply form, Similar + Open Roles, Internal Vacancies | Opportunity Detail · `opportunity-detail_`; Opportunity Row · `opportunity-row_`; Vacancy List · `vacancy-list_` | `opportunity-more` | template, Careers, Example Components | 3 | after 13 |
| 15–18 | Compose: For business (Hire, PDE, Consulting, Project Controls); About (About, Clients, How It Works, Rates); Conversion (Contact, Resume, Opportunities, Careers); Home, Privacy, Nav and Footer links, final copy check | — | `pages/*` | real order | 5 | yes, own pages only |

Each section unit: Lumos Section build-up, container, responsive from the first call, hovers and focus, working interaction, componentized with props and slots, `decisions/components/<name>.md`.

## CMS (unit 2)

The client fills these; fields may change when Bullhorn comes (owner). Option values come from the Figma copy.

| Collection | Fields |
|---|---|
| Opportunities | Name, Slug, Job Type (option), Discipline (option), Sector (option), Location, Location Filter (option), Experience, Salary, Intro, About, Responsibilities, Requirements, Offer (rich text ×4), Internal (switch: Careers instead of Opportunities), Summary (internal card), Featured (switch: Open Roles), Bullhorn ID (empty for now) |
| Cases | Name, Sector, Text, Image, Image Alt, Order |
| Rates | Name, Description, Price, Order |
| FAQ | Question (Name), Answer (rich text), Order |
| Team | Name, Role, Bio, Photo, Photo Alt, Group (option: Team, Discipline), Order |

Pricing cards and testimonials stay component instances: few, shared, and the Home testimonials are approved.

## How the run works

One Workflow per phase; the main session stays in between to publish, answer stops and read the results.

**Phase 0 — Preparation. Done 2026-11-05.** Figma exported, indexes refreshed (`components.json`, `classes.txt` from the published CSS, `pages.json`; variables and fonts are read live), names and CMS fixed, branch `aniek/rest-of-site` from `main`. Webflow's changelog is checked at the start of phase 1.

**Phase 1 — Foundation, one after another.** Units 1, 2, 3. Publish 1×. Fresh reviewer on the Page Header **now**, because it goes on every page. Fix. This also proves the builder brief on this site; result goes in `decisions/site.md`.

**Phase 2 — Static sections, max 4 at a time.** Units 4–10, in the queue order of the table. Each agent places its block on its own test page. Publish 1× after the last. One fresh reviewer per unit, max 4 at a time. Fixes per component, before anything is copied onto pages.

**Phase 3 — CMS sections.** Units 11, 12, 13 together, then 14. Lists are built and bound on their page; a Collection List can only become a component in the Designer (`decisions/components/hero-experts.md`), so that waits for phase 4.

**Phase 4 — Designer pass, main session, one step.** Before the pages, because the CMS lists must be components first. Starts only when no agent is writing. Everything agents queued in `references/designer-queue.md`: lists to components and into their sections, current-item filters, slot Allowed components, "is set" conditions, heading levels, folder order. Plus the two open queue items that matter for this work. Then publish 1× and a reviewer per CMS unit, fixes.

**Phase 5 — Compose pages.** Units 15–18: place components, final Figma copy, images, remove placeholders, hero intro (`Global | Custom Code`, `data-hero-reveal`), Nav and Footer links. A Designer step that still turns up here is queued for a short second pass, only if needed.

**Phase 6 — Publish, page review, close.** Publish 1×. One reviewer per page group (max 4) checks composition only: order, spacing between blocks, copy, overflow, links; a component reviewed in phase 1–4 is not reviewed again. One unit Site code. Existing check scripts (`spotlight-check`, `split-check`, `cta-check`, …) as regression on what was approved. Main session merges findings and re-checks each ❌. Fix, publish 1×, fresh re-check on fixed items only. Max 2 rounds. Log, audit file, merge to `main`, report.

**Motion (owner, 2026-11-05):** scroll or block animations come later as a separate pass over finished pages. Now only what a block needs to work (accordion, filters, sliders, sticky steps) and the hero intro.

### Rules for the agents

- Nobody publishes or opens the Designer; nobody edits `log.md`, `site.md`, `CLAUDE.md`, `project.json`. Each writes only its own `decisions/components/<name>.md` and appends to the queue through its report; the main session commits (one commit per phase, one push per phase).
- A unit edits only the components it names. Units sharing prop ids never run at once (cards are done in unit 3, before the fan-out). No `duplicate_variant` (`decisions/site.md` 2026-11-02). No edits to global `u-rich-text` rules.
- A decision or name the plan does not give: stop and report. A deviation from the design: not decided by the agent, goes on the owner's list.
- 429: wait it out. Two failed fixes on one thing: stop and report.
- Each agent: its own `agent_id`, webflow guide once, brief names the claude.ai connector.

### Stops for the owner during the run

Only for: deleting or recreating something already approved, a change to many existing instances, a deviation from the design that blocks a unit. Everything else: recommended answer, recorded in `decisions/`, in the final list. Publishing goes to staging only (standing OK, `CLAUDE.md`); no custom domain.

## Size

About 35–40 agents: 14 builders, 4 page composers, about 18 reviewers, fixers and re-checks. Above the session's default guideline of 10 per workflow in total, but per phase it stays near it. A bare connectivity test agent already cost about 95,000 tokens, so this is a large run.

## Conflicts and slips

| # | Where | What | Recommended |
|---|---|---|---|
| 1 | Figma | Light-200 sections have no Theme route yet (`decisions/site.md` 2026-10-30) | Same as Reviews: own background on the section, no fourth Theme mode unless phase 0 finds more than a few |
| 2 | Pages without mobile frame | No mobile design | Mobile headings per site rule, reflow per build skill; list what was decided |
| 3 | Photos | Originals up to 3 MB; `sips` here cannot write WebP | JPEG quality 80 at 2× display width, PNG only for transparency; existing assets untouched |
| 4 | Team Fan, others | Figma photos carry a Getty watermark | Used on staging as placeholders; **must be replaced before go-live**. Goes on the owner's final list |
| 5 | Footer | `device=desktop` (852 high) is on no page; all use the compact one, which is built | Not built: owner, 2026-11-05, the client did not want it |
| 6 | Copy | Typos («oppertunities», «quilify»), lorem, «€XX», «Name» | Typos fixed and listed; placeholders kept as in Figma and listed |
| 7 | CMS templates | Webflow makes a template page per collection; only Opportunities has a design | Set the others to draft if the API allows, otherwise queue |

## Missing

- Real Opportunities data (Bullhorn, later): sample items from Figma, marked as samples.
- Final copy beyond Figma; real privacy text (already open).

## Out of scope

Bullhorn / n8n, NL translation, SEO fill, cookie banner, schema markup, go-live, 404 / Search / Password restyle, and the mismatch notes in the older audits. Home's title still reads "Website Name": goes with the SEO job.

## Questions

Owner's answers, 2026-11-05:
1. Chrome: connected (read back: one browser connected).
2. CMS: owner left it to Claude; the client must be able to fill things easily, and open roles, internal vacancies, cases, rates, FAQ and team belong in a collection. Fields can be adjusted later. Testimonials stay in the approved Home block for now.
3. Forms: agreed. Webflow's own form handling, no real test submissions; CV field if the plan allows, otherwise queued. Bullhorn later.
4. All components and all pages get built (see Reuse). Out of scope above stands.
