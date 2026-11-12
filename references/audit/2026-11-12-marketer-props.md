# Marketer audit: can every text be changed through props? (2026-11-12)

Aniek Velthuizen, via Claude. Kit 0.28.0. Every custom component definition read with `get_all_elements` (scoped) and scanned for literal `String` text, nested instances with literal content overrides, and slot content fixed inside a definition.

| Component | Found | Done |
|---|---|---|
| Hero Experts | title, both buttons, «250+» line, title above the logos | all props (see `decisions/components/hero-experts.md`) |
| Logo Marquee | 8 logos fixed in the definition | already moved to CMS › Client Logos the same day (other session) |
| Form Section | success/error messages, contact labels, field labels, select options, upload texts | messages + contact labels props; rest kept (see `form-section.md`) |
| Opportunity Detail | success/error messages, field labels, upload texts | messages props; rest kept |
| Opportunity List | empty state, button texts, filter labels/options, count line | empty state + load-more props; filter UI kept (script-bound) |
| Contact Form (Lumos) | fieldsets and fields fixed in slots | not used on a live page; left as Lumos ships it |
| `… Items` CMS lists | «No items found.» | left: only shows when a collection is empty |
| Card Testimonial | «Rated 5 out of 5» (screen-reader only) | left: belongs with the stars |
| Nav, Footer | content inside the definition | by design (kit: identical everywhere, edited centrally) |

All other sections and cards (Stagger Cards, Sticky Steps, Split Content, Spotlight Grid, CTA Split, Page Header, Card Grid, Stage Slider, Process Step, Values Grid, Pricing Row, Team Grid, Fee List, FAQ List, Team Fan, Cases Grid, Vacancy List, Opportunity Row, Facts Row, Rich Content, Score/Step parts, every Card) had no literal content: everything was already a prop, a slot or CMS-bound.
