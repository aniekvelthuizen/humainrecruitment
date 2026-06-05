# HumAIn Recruitment

**Klant:** Floyd Latumeten — floyd@humainrecruitment.com

**Bedrijf:** HumAIn Recruitment (nieuw, nog niet live)

**Budget:** ~€10k voor het geheel

**Tijdlijn:** Zo snel mogelijk, kwaliteit boven snelheid. Beseft dat freelancers ernaast werken.

---

## Over het bedrijf

- Recruitment agency — werving & selectie (permanent), detachering, projectbasis
- Doelgroep: ervaren professionals (5-7jr, 8-12jr, 12+ ervaring), niet actief zoekend maar wél kijkend
- Positionering: "your extended network" — menselijk, transparant, snel
- USP's: transparante menukaart met prijzen, snelheid in kandidaten voorstellen, AI voor procesoptimalisatie (niet voor de relatie)
- Toekomst: ook zorgsector, database opbouwen met zorgpersoneel
- Kwaliteit boven kwantiteit — liever minder maar beter

---

## Wat hij zoekt

### 1. Huisstijl

Floyd heeft nog niets vastliggen. De naam "HumAIn" staat ook niet vast. Wat er wél vaststaat:

- Moet passen bij de menselijke, warme positionering
- Zachter en menselijker dan een typische corporate recruitment-look
- Moet kloppen als geheel: logo, kleuren, typografie, tone of voice
- Voorbeelden:
    - [https://www.baeken.com/](https://www.baeken.com/) (look & feel goed - opbouw niet)
    - [https://bybd.nl/](https://bybd.nl/) (opbouw goed - look & feel niet)
    - [https://www.colourfuljobs.nl/](https://www.colourfuljobs.nl/) (look & feel + opbouw)

**Wat er bij komt kijken:**

- Moodboard / stijlrichting op basis van zijn voorbeelden
- Logo-ontwerp (primair + varianten voor social, favicon, etc.)
- Kleurenpalet (primair, secundair, accent)
- Typografie (headings, body, eventueel display font)
- Beeldstijl / fotografie-richting
- Brand guidelines document (beknopt, bruikbaar)
- Tone of voice richtlijnen (past bij "menselijk, warm, transparant")

---

### 2. Webflow website (EN (basistaal) + NL)

Functioneel en professioneel. Floyd zegt expliciet: liever 80% af qua design maar 100% functioneel dan andersom. Moet klaar zijn om op te schalen.

**Pagina's en structuur:**

- Homepage met positionering en USP's
- Vacature-overzicht (gefilterd op type, sector, ervaring)
- Vacature-detailpagina met sollicitatieflow
- Over ons / het team
- Werkwijze met menukaart/prijzen (transparant)
- Voor werkgevers (diensten, aanpak, contact)
- Voor kandidaten (waarom via HumAIn, CV uploaden, poule)
- Contact
- Privacy policy & juridische pagina's (GDPR)
- Blog/insights (optioneel, toekomst)

**Wat er bij de bouw komt kijken:**

- Webflow site-structuur en CMS-collecties opzetten (vacatures, sectoren, testimonials, team)
- Responsive design voor desktop, tablet, mobiel
- Meertalig opzetten: NL + EN (Webflow Localization)
- SEO-basis: meta titles, descriptions, OG-tags, sitemap, schema markup
- Formulieren: contact, sollicitatie, CV-upload
- CMS-templates voor vacatures die automatisch gevuld worden vanuit Bullhorn
- Snelheid en performance optimalisatie
- Cookie-banner en GDPR-compliance
- Hosting en domein koppelen
- Favicon, social sharing images

---

### 3. Bullhorn ATS-koppeling

**Wat Bullhorn is en doet:**

- ATS (Applicant Tracking System) + CRM voor recruitment
- Beheert vacatures, kandidaten, sollicitaties, plaatsingen, facturatie
- Heeft een uitgebreide REST API + een Public API specifiek voor job boards
- Heeft een native LinkedIn-integratie (Recruiter System Connect)

**Kernkoppelingen die gebouwd moeten worden:**

**Bullhorn → Webflow (vacatures publiceren):**

- Nieuwe/gewijzigde vacatures in Bullhorn automatisch naar Webflow CMS pushen
- Velden mappen: titel, locatie, beschrijving, type (W&S/detachering/project), sector, salaris, etc.
- Status-sync: vacature sluiten in Bullhorn → offline halen op website
    - Dit SEO wise goed doen, geen 404, maar netjes doorsturen
- Gebruik: Bullhorn REST API of Public API → n8n workflow → Webflow CMS API

**Website → Bullhorn (sollicitaties):**

- Sollicitatieformulier op website stuurt data + CV naar Bullhorn
- Kandidaat wordt aangemaakt in Bullhorn
- Sollicitatie wordt gekoppeld aan de juiste vacature als Submission
- Gebruik: Webflow form webhook → n8n → Bullhorn REST API

**CV-upload / kandidatenpoule:**

- Pro-actieve ‘Open sollicitatie’ CV-upload pagina op de website (niet per se voor een specifieke vacature)
    - CV + basisgegevens → Bullhorn als nieuwe Lead
    - Bouwt de kandidatenpoule op die Floyd wil laten groeien

**Technische aanpak:**

Bullhorn biedt twee API's die we gaan gebruiken:

1. **Public API:** Specifiek voor career sites. Hiermee halen we gepubliceerde vacatures op en sturen we sollicitaties terug naar Bullhorn. Simpele koppeling, snel op te zetten.
2. **REST API:** Voor alles daaromheen: kandidaten beheren, CV-uploads verwerken, statusupdates, etc.

Beide API's zijn goed te koppelen met n8n (onze automatiseringstool). De koppeling is technisch gevalideerd en haalbaar.

**Wat Floyd moet regelen bij Bullhorn:**

- API-toegang aanvragen via Bullhorn Support (client ID + secret)
- Public API activering aanvragen (voor de website-integratie)

---

### 4. Automatiseringen (n8n)

Het principe: alles automatiseren waar geen menselijke tussenkomst nodig is. Het menselijke aspect in het recruitmentproces blijft.

**Vacature-lifecycle:**

- Bullhorn vacature gepubliceerd → automatisch naar Webflow + LinkedIn post
    - Automatisch gegenereerde SEO Title tags + Meta descriptions + Alt text
- Vacature gesloten in Bullhorn → automatisch offline op website
- Vacature gewijzigd → website automatisch bijgewerkt

**Sollicitatie-flow:**

- Sollicitatie via website → kandidaat + submission aanmaken in Bullhorn
- Bevestigingsmail naar kandidaat
- Notificatie naar recruiter

**Kandidatenpoule:**

- CV-upload via website → Candidate aanmaken in Bullhorn
- Bevestigingsmail naar kandidaat
- Fase 2 (buiten scope): periodieke mail naar poule met relevante nieuwe vacatures

**Social media:**

- Nieuwe vacature → automatisch post op LinkedIn company page
    - Afbeelding laten genereren met PlacId

---

## Sprints

### Sprint 0 — Validatie & voorbereiding (mei)

- [ ]  Bullhorn API + n8n koppeling technisch valideren (OAuth2 workaround testen)
- [x]  Floyd: Bullhorn-account aanmaken na go-ahead
- [x]  Floyd: 2-3 voorbeeldwebsites aanleveren
- [x]  Portfolio designer delen, designer briefen
- [ ]  Sitemap en pagina-structuur afstemmen
- [ ]  Wireframes maken (€400)

### Sprint 1 — Huisstijl (juni) €1.500

- [ ]  Moodboard op basis van Floyd's voorbeelden
- [ ]  Logo-ontwerp (2-3 concepten)
- [ ]  Kleurenpalet, typografie, beeldstijl
- [ ]  Feedback-rondes en definitieve huisstijl
- [ ]  Beknopt brand guidelines document

### Sprint 2 — Website design (juli) €2.200

- [ ]  Responsive design van alle pagina’s
- [ ]  Componenten library
- [ ]  Styleguide

### Sprint 2 — Website bouw (aug+sep) €3.000 (onder voorbehoud van design)

- [ ]  Webflow site-structuur en CMS-collecties
- [ ]  Bouw van alle pagina's (responsive)
- [ ]  Meertalig opzetten (NL + EN) met [Webflow Localization](https://webflow.com/feature/localization)
- [ ]  Formulieren (contact, sollicitatie, CV-upload)
- [ ]  SEO-basis, cookie-banner, GDPR-pagina's

### Sprint 3 — Bullhorn integratie (sep) €2.500 (onder voorbehoud van wensen)

- [ ]  n8n workflow: Bullhorn → Webflow vacature-sync
- [ ]  n8n workflow: sollicitatie website → Bullhorn
- [ ]  n8n workflow: CV-upload → Bullhorn kandidatenpoule
- [ ]  Testen van alle flows end-to-end

### Sprint 4 — Afronding (sep-okt) €400

- [ ]  Hosting, domein, go-live
- [ ]  Testen, bugfixes, oplevering
- [ ]  Training CMS

---

## Licentiekosten

| Tool | Kosten | Notitie |
| --- | --- | --- |
| Webflow (website, cms) | **$25** | per maand |
| Webflow Localization (meertaligheid) | **$12** | per maand, per extra taal |
| n8n (automatiseringen) | €24 | per maand |
| Resend (transactiemailings sturen)
(gaat dit via Bullhorn?) | €0 | gratis tot 3000 mails per maand, 100 mails per dag, daarna €20 per maand |
| Claude Anthropic | €1-2 | AI generatie van seo data (title tag, meta description, alt text) |
| **Totaal** | **€63** | per maand |