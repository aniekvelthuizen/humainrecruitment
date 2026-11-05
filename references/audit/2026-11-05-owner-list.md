# Owner list — rest of site (2026-11-05)

Aniek Velthuizen with Claude. What the build could not settle. Nothing here blocks staging.

## Before go-live
- Replace the Getty-watermarked photos: 3 Cases, 5 Discipline, `photo-profile.jpg`, the Values photo. The assets to remove are listed in `decisions/cms.md`.
- One real test submission with a PDF on Analyse My Resume and on a vacancy page. Upload may need a paid site plan; if it fails, the CV field is `required` and the form cannot be sent. Also confirms the real Finder drag.
- Real copy: Privacy «[date]» and lorem, phone number, €XX prices, Team «Name» ×3, lorem on Home, Contact and Resume.
- 9 of 12 Opportunities and all 3 internal vacancies have no detail text. The page then shows only the form, centred.
- Confirm the 4 FAQ answers taken from hidden Figma layers, and the error text «Please check this field».

## Decide
- Team Fan copy says «seven disciplines», the design shows 5 cards.
- Client journey says «Four things» above 5 cards. How It Works: 3 or 4 bullets per step.
- Resume header carries Contact's text. Consulting Card Grid text equals PDE's. 3 Cases share the same text.
- «Request a shortlist» goes to /hire-an-expert in the Home hero and CTA, and to /contact in the nav. Nav «How we select» goes to /project-delivery-experts, Home's «See how we select» to /how-it-works.
- «See all clients» on Clients links to its own page, as do its testimonial cards. How It Works: both CTA buttons go to /contact.
- Nav role and sector links are placeholders: no such pages exist. Footer «Privacy settings» and «Disclaimer» go to #.
- Stagger Gradient: below 1440 the section ends in blue-teal for contrast (4.6:1), from 1440 it is the design (2.56:1), so it visibly jumps at 1440.
- Consulting «The model»: buttons on two rows, block 1006 against 942, because the labels are 17 px too long for the column.
- Careers checklist text, Team Fan with 7 or 9 cards overlaps, Hire header cards on phones half tilted.
- Similar roles shows the 3 newest other public roles, not the same discipline: Discipline is an option field and Webflow offers no «current» on it. A reference field would solve it (CMS change), and that list cannot become a component while it excludes the current item.
- Vacancy pages: «Back to opportunities», «Recruitment» twice in the header, no language row (needs a CMS field). Fee price all bold (a Unit field would fix it).
- Discipline options are derived, confirm them; Job type «Full-time» and 3 disciplines return 0 public roles now. «Oil & Gas» vs Energy on Project Controls Manager.
- Empty template pages exist per collection (`/team/floyd` and so on). No draft option; the switch «Publish this Collection Template page» can go off, or noindex/redirect. Your call before go-live.
- /401 Password submit is unstyled (Webflow blue): restyle was out of scope.
- 11 unused CMS uploads and asset `6aec8cf40720a6a00ccff1e6` can be deleted, on your word.

## Later
- Motion pass: 380 px gap on PDE is a candidate.
- Forms tab shows both forms per page; the Bullhorn hook must filter on form name. File field publishes `name="CV-2"`, `data-name="CV"`, which is the submission key.
- Full Name autocomplete: `references/designer-queue.md`.
- Scripts: `hero-check.mjs` looks for `.button_arrow_wrap` (now `hero-experts_arrow`); `steps-check.mjs` and `stagger-check.mjs` read only the first block; `steps-check.mjs` stops on How It Works.
