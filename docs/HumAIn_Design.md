# HumAIn Recruitment: Website design

Opgeleverd visueel design (desktop + mobiel componenten), gemaakt in Figma.

**Figma:** [Humain, pagina "Visual design"](https://www.figma.com/design/fDSntIFhtIcXeZn4fExMTA/Humain?node-id=2027-76)

**Figma-pagina's**

| Pagina | Inhoud |
| --- | --- |
| Visual design | Definitieve pagina-ontwerpen, componenten, text styles en kleurvariabelen |
| Mobile | Mobiele uitwerking |
| Brand | Huisstijl |
| Designs | Eerdere ontwerpen |
| Presentation | Presentatie |

---

## Pagina-ontwerpen (desktop, 1512 px breed)

| # | Pagina | Wireframe |
| --- | --- | --- |
| 1 | Home A | `wireframes/index.html` |
| 2 | Hire an expert | `wireframes/hire-an-expert.html` |
| 4 | For business / Consulting services | `wireframes/consulting-services.html` |
| 6 | About us / About us | `wireframes/about.html` |
| 7 | About us / Clients | `wireframes/clients.html` |
| 8 | About us / How it works | `wireframes/how-it-works.html` |
| 9 | About us / Rates | `wireframes/pricing.html` |
| 10 | About us / Contact | `wireframes/contact.html` |
| 11 | Analyse my resume | `wireframes/submit-resume.html` |
| 12 | Opportunities | `wireframes/opportunities.html` |
| 13 | Opportunities / Detail | `wireframes/job-detail.html` |
| 14 | Careers | `wireframes/careers.html` |
| 15 | Privacy & Cookies | `wireframes/privacy-cookies.html` |

Nummers 3 en 5 ontbreken in de Figma-naamgeving. Controleer met Floyd of die pagina's nog volgen of zijn geschrapt.

---

## Huisstijl

### Kleuren (Figma variables)

| Token | Hex | Gebruik |
| --- | --- | --- |
| Brand/Purple blue | `#250059` | Primair merkkleur |
| Brand/Teal | `#0082a6` | Secundair |
| Brand/Green | `#00ffd5` | Accent |
| Brand/Old pink | `#e5bbb7` | Zacht accent |
| Brand/Grey | `#edf1f7` | Achtergrond / vlakken |
| Defaults/Body | `#030b1b` | Tekstkleur |
| Defaults/White | `#ffffff` | Wit |
| Semantic/Stars | `#ffbf66` | Sterrenbeoordeling (testimonials) |

Transparanties: Body 50% (`#030b1b80`), 25% (`#030b1b40`), 10% (`#030b1b1a`); White 50% (`#ffffff80`), 25% (`#ffffff40`).

### Typografie

- **Headings:** Vend Sans, Bold (7xl: SemiBold)
- **Body en labels:** Onest, Regular

| Schaal | Headings (px) | Body (px) |
| --- | --- | --- |
| 12xl t/m 8xl | 224, 192, 160, 128, 96 | idem |
| 7xl / 6xl / 5xl | 72, 60, 48 | idem |
| 4xl / 3xl / 2xl | 36, 30, 24 | idem |
| xl / lg / base | 20, 18, 16 | idem |
| sm / xs | 14, 12 | idem |

Regelhoogte: 1,25 voor grote headings (6xl en kleiner), 1,5 voor xl t/m base. Label: Onest 12 px met letter-spacing 10.

---

## Componentbibliotheek (Figma, sectie "Components")

- **Navigatie:** Navbar (light), subnav, mobiele navbar (For business / Expertise / About us, open en dicht)
- **Footer:** desktop en mobiel (For business / Company / For talent)
- **Headers:** Home, Hire an expert, Opportunities, default
- **Content:** Services (desktop + mobiel), CTA, Testimonials, Facts & Figures, Content block, Assessment process, Pricing, Scrollytelling, 3 UBRS, 4 UBRS, Grid of cards, Team, Values, WYSIWYG (voor juridische pagina's)
- **Dynamisch (CMS-gedreven):** Open roles, Internal vacancies, Opportunities, Cases, Rates, FAQ
- **Formulieren:** Contact form, inputs, zoeken (mobiel)
- **Basis:** Buttons (Primary, Secondary, Secondary white, Tertiary, Back; elk met hover), tabs, kaartvarianten, testimonialvarianten, bullets (14 t/m 20 px), icoonset (Google icons)

De dynamische componenten zijn de basis voor de Webflow CMS-collecties (vacatures, cases, rates, FAQ, team, testimonials) en de Bullhorn-sync.

---

## Webflow-bouw: aandachtspunten

- Componenten in Figma zijn al opgebouwd als herbruikbare onderdelen. Zet ze 1-op-1 om naar Webflow-components.
- Kleuren en text styles zijn Figma variables. Neem ze over als Webflow variables.
- Mobiele uitwerking staat op de Figma-pagina "Mobile". Op de pagina "Visual design" staan alleen losse mobiele componenten (navbar, footer, services, zoeken).
- Fonts: Vend Sans en Onest. Controleer de licenties en het gebruik in Webflow.
