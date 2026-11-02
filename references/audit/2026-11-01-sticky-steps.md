# Review — Sticky Steps + Card Primary Process, 2026-11-01

Frisse reviewer (alleen lezen), in opdracht van Aniek Velthuizen. Bekeken: Webflow API (component, klassen, props, variant-CSS), de gepubliceerde staging-pagina (`webflow.shared.9718e2174.css`, gepubliceerd na de bouw), Figma-plaatjes in `references/figma/home-method/`, het plan en `decisions/components/sticky-steps.md` + `cards.md`.
Bewijs (screenshots, metingen) staat in de scratchpad: `/private/tmp/claude-501/-Users-aniek-Projecten-HumAIn-Recruitment/f9ce735c-7d05-4f29-b954-720a0f32067e/scratchpad/review/` (`steps/`, `steps2/`, `a11y/`, `cards/`).

| Component | Werkt | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Sticky Steps | ❌ | ⚠️ | ✅ | ✅ | 🧹 | 🧹 | ⚠️ |
| Card Primary Process | ✅ | ✅ | ✅ | ✅ | 🧹 | ✅ | ? (pil en checklist nergens te zien) |

## Bevindingen

1. **moet — Sticky Steps: de intro schuift weg voordat de stapel compleet is.** Waar: `sticky-steps_intro` / `sticky-steps_list` (≥ 992 px). De intro (~456 px hoog) en de kaartenlijst eindigen samen; de lijst eindigt maar ~200 px onder het moment dat kaart 3 aankomt. Daardoor laat de intro al los terwijl kaart 3 nog schuift: bij 1512 staat de titel op −76 px (onder de nav) terwijl kaart 3 nog op 140 px staat, en op het moment dat kaart 3 landt is de intro-top −157 (1440: −152, 1280: −115). De volledige stapel wordt ook nooit vastgehouden: zodra kaart 3 landt, schuift alles weg, en kaart 1/2 staan dan 27 px hoger dan kaart 3 (ring "2" half zichtbaar erboven). Bewijs: `steps/stack-1512.png`, `a11y/scroll-late-1512.png`, tijdlijn in `a11y-check`-uitvoer (intro los vanaf ~550 px scroll, kaart 3 pas op ~850 px). Fix: geef `sticky-steps_list` alleen ≥ 992 een `padding-bottom` (orde 16–20 rem, meten) zodat intro en complete stapel samen een stuk in beeld blijven; daarna opnieuw meten met `steps-check.mjs`.

2. **moet — Card Primary Process staat niet op Example Components.** Waar: pagina `/example-components` toont service, discipline, glass, step, stage, stat, pricing — geen process. Daardoor zijn de optionele delen (pil = Badge, checklist = List + Card Bullet) nergens gebouwd te zien en dus niet gecontroleerd; op Home staan ze uit. Fix: een Process-kaart (Brand/Dark sectie) met pil en checklist aan op Example Components zetten en die meten tegen Figma `2045:11371` (mobile frame 1. Home).

3. **kan — CSS-embed doet de `top` van de intro dubbel en via een klasse.** Waar: embed in `sticky-steps_wrap` regel `[data-sticky-steps] .sticky-steps_intro { top: … }`; de klasse `sticky-steps_intro` heeft zelf al `top: nav/height-total` (80 px), die door de embed overschreven wordt naar 112 px. De kit-regel: code richt zich op `data-*`, niet op klassen; en wat een klasse kan, hoort niet in code. Fix: in de Designer de klasse-`top` op `calc(nav/height-total + space/7)` zetten en die regel uit de embed halen (sticky + kanteling van de slotkaarten mogen in de embed blijven, zoals bij Stagger Cards besloten). Klein: de embed mist de `u-embed-css`-klasse die de Stagger Cards-embed wel heeft.

4. **kan — Inline `style="font-weight: inherit;"` in de gedeelde Card Primary.** Waar: Typography Plain in `card_primary_eyebrow` (definitie, dus in elke Card Primary; Stage-kaart is daardoor 30 bytes groter, verder identiek). Oorzaak: de Process-regel zet `font-weight: semibold` los, terwijl de Text Style-modus regular blijft. Staat wel in `cards.md`, maar de kit telt inline style via de API als onnodige code. Fix: de ring-dikte zonder inline style oplossen (bijv. de Typography Plain-variant laten erven of het gewicht via de Text Style-route zetten) — of de uitzondering expliciet als geaccepteerd noteren.

5. **kan — Tussen 992 en ~1150 px worden de kaarten smal.** Waar: `sticky-steps_layout` `grid-template-columns: 34.6875rem minmax(0, 1fr)`: de intro blijft 555 px, de kaartenkolom zakt bij 992 naar 318 px (kaarten 285 hoog, titels op 2 regels), smaller dan de intro. Bewijs: `steps2/steps-992.png`. Fix: kolommen die allebei meekrimpen (bijv. `minmax(0, 5fr) minmax(0, 7fr)` met max 555 voor de intro, of Lumos Layout-spans 5/7).

6. **kan — Spatie in de titel bestaat alleen in CSS.** Waar: `.sticky-steps_accent::before { content: " " }`. Zichtbaar en voorleesnaam zijn goed ("…found before…"), maar de tekst in de HTML is "The top 5% foundbefore you need them." (kopiëren, zoekmachine-snippets, scripts die `textContent` lezen). Fix: een vaste spatie als tekstknoop tussen de twee spans in de definitie (geen prop nodig).

7. **kan — Props van Sticky Steps.** Slot **Steps** heeft geen map en geen tooltip ("Card Primary, variant Process, Role off" zou helpen); **Button Link** staat als URL `/how-it-works` in plaats van een paginalink (breekt stil als de slug verandert). Fix: slot in een map "Steps" met tooltip; standaardlink als pagina How It Works.

8. **kan — Onnodige markup in de drie kaarten op Home.** Icon Visibility staat aan (timer-icoon in de DOM, door Process verborgen) en de Value-standaard "30 min" staat in elke kaart in de DOM (verborgen door de basisstijl). Fix: Icon Visibility uit op de drie instances; Value-standaard leeg maken is een Card Primary-brede keuze (bestond al).

9. **kan — Focusring van de knop is donker op donker.** Waar: Button Main Primary in Theme Brand: 2 px ring `rgb(3, 11, 27)` op de blauwe gradient; goed zichtbaar tegen de mint knop, nauwelijks tegen de achtergrond. Bewijs: `a11y/focus-button-1512.png`. Sitebreed (hero heeft hetzelfde), niet van dit blok. Fix: focuskleur in Brand-modus licht maken (eigenaarskeuze).

## Bekend en geaccepteerd (geen bevinding)
Regelafbreking titel (text-wrap balance), sectie ~70 px lager dan Figma, mobiele titel 36 px, accentkleur via `swatch/brand-accent-500` (open eigenaarvraag `heading-accent`), plain section i.p.v. Lumos Section en sticky/kanteling in een sectie-embed (zelfde route als Hero Experts / Stagger Cards).

## Gecontroleerd en in orde
- **Werkt:** intro sticky op ≥ 992 (`sticky top 112px`), statisch op ≤ 991; kaarten sticky en gekanteld −2 / +2 / −2° op elke breedte (402, 767, 991, 992, 1100, 1280, 1440, 1512) en ze stapelen (latere kaart ligt bovenop); knop gaat naar `/how-it-works`; geen consolefouten.
- **Responsive:** geen zijwaartse scroll op alle gemeten breedtes; geen tekst buiten zijn kaart; op ≤ 991 eerst intro, dan kaarten over de volle breedte.
- **Spacing 1512 (± 1 px van Figma):** eyebrow-cap 198, titel 243, tekst 470, knop 600, eerste kaart 192, kaarten 176 uit elkaar (380 top-top), 687 breed, hoogtes 204/204/177; sectie-padding 192 boven/onder. In de kaart: padding 24, ring 48 met 2 px rand, ring → titel 16, titel → tekst 8, radius 8. **402:** padding 96, knop → eerste kaart 160, kaarten 176 uit elkaar, titel 36 px.
- **Lumos:** klassen `sticky-steps_*` volgens naamgeving, geen ongebruikte klassen (alle 11 in gebruik, geen `_item`), variabelen voor kleur, spacing (`space/7`, `section-space/large|main`), nav-hoogte en gradient; alleen rem (de `blur(20px)` en schaduw-px komen ongewijzigd uit Glass).
- **Toegankelijkheid:** één h1 (hero), sectietitel h2, kaarttitels h3; toegankelijkheidsboom: list met 3 listitems; knop bereikbaar met Tab, `:focus-visible` met ring, `aria-label` "See how we select".
- **Andere Card Primary-varianten ongewijzigd:** alle 10 Card Primary-kaarten op Example Components vergeleken met de meting van 2026-10-31 (`after-review`), op 1512 en 402, in rust en hover: identiek in maat en stijl. De Process-CSS is volledig per variant (`:where(.w-variant-602f31cd…)`); alleen Process is toegevoegd aan de gedeelde "icon/corner verborgen"-regels.
- **Vastlegging:** `decisions/components/sticky-steps.md`, `cards.md` (Process), `decisions/pages/home.md` en `references/log.md` beschrijven wat er staat.

## Niet gecontroleerd
- Pil en checklist van Process (staan nergens aan, zie 2).
- "Allowed components" van het slot (niet leesbaar via de API).

## Afgehandeld (2026-11-01, Aniek Velthuizen met Claude; eigenaar: "Aanbevolen punten")
- 1 opgelost: lege ruimte (16rem, < 992 8rem) ná de laatste kaart in de lijst; de complete stapel staat ~350 px scroll stil (telefoon ~200), intro staat nog op zijn plek als kaart 3 landt.
- 2 opgelost: Process met pil en checklist op Example Components (donkere showcase), gemeten; pil was 31 hoog → 26 (basis-hoogte terug).
- 3 opgelost: embed alleen nog kaarten, klasse `u-embed-css`; de intro-`top` staat op de klasse (gepubliceerd als `calc(nav/height-total + 2rem)`).
- 5 opgelost: kolommen `555fr / 797fr`, 992 → 358 + 515.
- 7 opgelost: Button Link standaard = pagina How It Works; slot heeft een tooltip.
- 8 opgelost: Icon Visibility uit op de drie kaarten op Home.
- 4, 6 geaccepteerd (zie `decisions/components/sticky-steps.md`); 9 eigenaarskeuze, niet gewijzigd.
