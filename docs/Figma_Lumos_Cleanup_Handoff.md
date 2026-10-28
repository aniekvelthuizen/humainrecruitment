# Figma → Lumos cleanup: overdracht

Doel: het Humain-design in Figma geschikt maken voor de Webflow-build (Lumos Framework) met de plugin `figma-lumos-cleanup`.

**Duplicaat (hier wordt gewerkt):** https://www.figma.com/design/18m34a7vzkzopkwGoojmUx/Humain--Lumos-
fileKey `18m34a7vzkzopkwGoojmUx`. Het origineel (`fDSntIFhtIcXeZn4fExMTA`) is niet aangeraakt.
Plan: Figma Professional, Full seat. Pagina "Visual design" is groot (>40k nodes): altijd per sectie werken, een call mag niet langer dan ~60 s duren.

## Gedane fases
| Fase | Stand |
|---|---|
| 0 Intake | klaar |
| 1 Foundations | klaar |
| 2 Ruwe waarden koppelen | klaar, 13 paginaframes pixel-identiek aan baseline |
| 3 Structuur | klaar |
| 4 Naamgeving | klaar |
| 5 Componenten en modes | klaar (zie "Fase 5: uitgevoerd"), 2 punten open |
| 6 Controle en eindrapport | klaar (zie "Eindrapport fase 6") |

## Genomen beslissingen
- **Kleuren:** Purple blue `#250059` = `brand-500`. Grey `#edf1f7` = `light-200`, White = `light-100`, Body `#030b1b` = `dark-900`. Teal, Green, Old pink en Stars zijn extra swatches (`brand-secondary-500`, `brand-accent-500`, `brand-pink-500`, `stars`), niet in de Lumos-basis.
- **Typografie:** Onest = primair (body), Vend Sans = secundair (headings). Sora en Inter zijn naar Onest gezet.
- **Text styles:** Display, H1–H6, Text Large (20), Text Main (16), Text Small (14), Text Medium (18, extra), Label (12), Label Large (16).
- **Thema per sectie (akkoord):** lichte secties = Base, donkere paarse/navy secties (headers, CTA) = Brand, alleen nachtblauw/zwart = Dark.
- **Home B is de definitieve homepage.** Home A is `[figma-only]`.
- **Remote componenten** (`2:1 Fixed Aspect Ratio Spacer`, `Image`, `Logooos`, `Arrow icon`, `Button/Link/Default`…): niet vervangen, alleen rapporteren.
- **Remote variabelen met modes** (`Padding x`, `Height`, `copy/*`, `content/*`, `grid/gutter`, `columns/5 Col`): blijven voorlopig remote.
- **Drie losse text styles** (`Headings/9xl`, `Body regular/5xl`, `Body regular/4xl`, elk 1× gebruikt) staan nog onder hun oude naam. Uiterlijk mag niet te veel veranderen: dit bespreken we samen.

## Nog niet gedaan
- **Fase 5:** variantproperties met een andere betekenis (script 15, met screenshots en akkoord), hover-varianten binden aan `*-hover` (script 11), thema per sectie (12, 13, 14), Mobile-modes (Sizes = Mobile), remote componenten rapporteren.
- **Typfouten in bestaande namen** (nog te vragen/bevestigen): `Design comonents`, `Content / Assesment process`, `Dynamic / Oppertunities`, `Header / Oppertunities`, `Content / WYSIWIG`. Alleen in nieuwe laagnamen zijn ze al gecorrigeerd.
- **~220 placeholder-laagnamen** (`_group_wrap`, `_group`, `_spacer`) en 16 componenten met een generieke eigen naam (`Frame 608`, `Prop 1`, `Prop 2`, `Frame 429`…).
- **`Content / Team`** heeft ongelijke variantproperties (`Property 1=Experts, Property 2=Team` vs `Property 1=Team`); Figma weigert de set aan te passen. Ontwerpfout in Figma zelf.
- **Mobile-pagina:** geen baseline-screenshots; alleen kleuren/maten gekoppeld, teksten zonder style niet verwerkt.
- **Eindcontrole (fase 6):** scan 02 opnieuw, thema-smoketest, pixel-diff, fingerprint (script 19) tegen de oorspronkelijke versie, eindrapport.

## Design slips (niet aangepast, voor het gesprek)
- Zwarte tekst `#000000` (net buiten tolerantie van `text` `#030b1b`): "24 open roles", "We reply within one working day", WYSIWYG-teksten (~25 plekken). Knoptekst `#050404`.
- Placeholders/debug-kleuren: `#ff0000`, `#d9d9d9` (image-padding helpers).
- Radii zonder Lumos-variabele: 5, 4, 6, 100, 999, 16777200 (laatste twee = "rond").
- Padding 64 in componenten (alleen op frames buiten componenten is `site/margin` gebruikt), 128, 256, 12, 6.
- Teksten met afwijkende regelhoogte: Vend Sans Bold 24 en 30 px met 110% (style heeft 125%), Onest Medium 16/18 px (geen Medium-style), Onest 14 px 125% of 20 px.
- Zonder baseline gecontroleerd: pagina 3, pagina 5, 1. Home B en de zes losse componentsets (Nav / Base, Nav / Mobile, Navbar mobile …).

## Lessen uit deze run (relevant voor het vervolg)
1. **Corner radii:** een binding op één hoek zet bij `radius 9999` de andere hoeken op 0. Altijd als groep binden (alle vier gelijk). Hersteld op 7 nodes.
2. **Leading trim:** een text style toepassen reset de verticale trim; die moet worden teruggezet (`leadingTrim`), anders groeit de tekst (33 px op Home en Hire).
3. Het script voor laagnamen koos soms een misleidend voorvoegsel; gebruik de volledige componentnaam. Generieke componentnamen (`Content`, `Dynamic`) krijgen de sectienaam als voorvoegsel.
4. Waar nodig `await figma.loadFontAsync` voor alle lettertypes van een tekst vóór schrijven (ook `Noto Sans Symbols2` bij H3).

## Variabelen en collecties (stand)
`Default` (27 swatches, scope verborgen), `Theme` (25, modes Base/Dark/Brand), `Sizes` (43, modes Desktop/Mobile; `site/margin` 64/20, `site/gutter` 32/20, `site/column-count` 12/5, `space/0–8` = 0, 4, 8, 10, 16, 20, 24, 32, 48), `Typography` (18), `Text Style` (8 velden, 10 modes; Pro-limiet = 10).
Extra's buiten Lumos-basis: `radius/none`, `radius/medium`, `border-width/thick`, `button-size/small`, `font-size/text-medium`, `font/secondary-semibold`, `font/primary-light`, de vier extra swatches.

## Werkwijze voor het vervolg
- Nieuwe sessie: eerst `whoami` (plan en seat), dan `create_session` voor de fileKey, dan `figma-use` laden.
- Pixel-diff werkt zolang `www.figma.com` in het netwerkbeleid van de omgeving is toegestaan. Baselines van de 13 paginaframes staan niet meer beschikbaar na een nieuwe sessie: opnieuw nemen vóór fase 5.
- Altijd dry run, dan echte run, daarna visuele controle. Vóór elke destructieve stap een named version laten opslaan.
- Plugin staat in `/root/.claude/uploads/.../9fef5e7d-figma-cleanup-lumos-main.zip` (alleen in deze sessie beschikbaar). Opnieuw uploaden in de nieuwe sessie.

## Fase 5: uitgevoerd (sessie 2026-10-28)
Werkwijze: named version vooraf, alleen namen/bindingen, controle met pixel-diff tegen baselines van de 15 paginaframes (na afloop ≤ 46 px verschil van miljoenen, max 4 kanaalwaarden).

**Variantproperties (alleen hernoemd, 215 Button-instances en alle andere instance-keuzes intact; 56 sets, 0 fouten, 0 dubbele namen)**
- `type` → `device=desktop|mobile`: Header / Oppertunities, content-cta, content-testimonials, content-pricing, dynamic-open-roles, dynamic-opportunities(-2), Glass cards, 4 UBRS, Page content, Content / Logo marquee.
- `Footer`: `device=desktop|desktop-compact|mobile` (default en variant3 zijn beide desktop).
- `state=rest|hover`: Sub menu / Assets / Item, Footer / Assets / Item.
- `state=closed|open`: Nav / Mobile, Search mobile, Content / Pricing row, Content / Fee row (laatste twee afgeleid uit hoogte: controleren).
- `style=plain|outline|filled`: Tab, Tab / Home. `style=glass|plain`: Content / Process step. `type=select|text`: input-simple. `type=role|person|case`: Card / Profile.
- **Button**: hover zat in `type` (`primary-hover`…). Nu `type=primary|secondary|secondary-white|tertiary|back-button` + `state=rest|hover`.
- Generieke namen vervangen: Frame 417 → Card / Expert, Frame 429 → Card / Expert match, Frame 608 → Card / Opportunity, Frame 690 → Card / Profile, Prop 1 → Card / Service, Frame 595 → Content / Pricing row, Testimonial 3 → Content / Pricing card, Step 4 → Content / Process step, Frame 614 → Tag / Contract type, Frame 609 → Tag / Location, Frame 654 → Card / Stat, Prop 2 → Card / Process stage, Content / Fee row, Content / Fee row compact, Frame 717 → Contact / Detail item.

**Button-variabelen (Theme)**: `button-primary/*` (mintgroen `brand-accent-500`, tekst `dark-900`), `button-secondary/*`, nieuw `button-secondary-white/*`, `button-tertiary/*`, `button-back/*`, elk met `-hover`; gebonden in alle 10 Button-varianten. Button-set is pixel-identiek (0 px verschil).

**Thema per sectie**: effen achtergronden gebonden aan `background` / `background-2` met expliciete mode (Base voor wit/grijs, Brand voor `#250059`), 21 + 17 secties/mains. Gradient-secties (headers, footer, Glass cards, pricing, recruitment process): stops gebonden aan `brand-500` en `brand-secondary-500`, mode Brand waar dat geen Theme-binding van kleur laat veranderen. Dark komt niet voor in het ontwerp als sectieachtergrond.

**Mobile-modes**: `Sizes=Mobile` expliciet op de 3 paginaframes van de Mobile-pagina en 36 mobiele componentvarianten (alleen layoutgrids waren aan `site/margin|gutter` gebonden, dus geen layoutwijziging).

## Open na fase 5
- **Header / Home v01 `home` en `variant3`**: geen Brand-mode, want 19 Theme-bindingen binnenin zouden van kleur veranderen. Eerst die bindingen naar swatches of juist naar Theme-variabelen met dezelfde waarde in Brand brengen.
- **Derde gradientstop `#e5b8b4`** is niet aan `swatch/brand-pink-500` (`#e5bbb7`) gebonden omdat het 3 eenheden afwijkt. Besluit: swatch aanpassen of stop laten staan.
- **Onbepaalde ambiguë sets (alleen gerapporteerd)**: Header / Home v01 (`home` en `variant-2` zijn gelijk, `variant3` anders), Content / Services desktop vs Content / Mobile (apart set per device), Header default (6 mixed varianten), Frame 417/Card / Expert (`default`/`variant-2` identiek), Card / Opportunity (`default`/`variant-2` en `variant3`/`variant4` identieke inhoud, waarschijnlijk hover), Card / Service (`services-hover` zit in `type`), Line (`default`/`variant-2`), Nav / Base (`mobile`/`variant-2` leeg), Navbar - Light (5 types, geen hover/focus).
- **Content / Team**: `Property 1/2` ongelijk, Figma weigert aanpassing.
- **Remote componenten (niet vervangen)**: `2:1 Fixed Aspect Ratio Spacer` (11748×), `Image` (178), `fixed_aspect_ratio` (252), `Logooos` (8 logo's, ~20×), `Arrow icon` (161), `material_icons` (161), `Line` (317), `Button/Link/Default` (185), `Button group` (13), `Icon / LinkedIn` (19), Material-iconen (`chevron_right` 205, `expand_more` 123, `east` 25, `expand_less` 10, `keyboard_arrow_down` 23, `search`, `lock`, `error_outline`), `Divider` (4).
- **Remote variabelen in knoppen** (laten staan): `Defaults/Body`, `Defaults/Body light`, `Defaults/Dark Grey`, `Brand/Dark purple` (pijl-iconen en hover-tekst van primary).
- **Design slips**: knoptekst primary `#050404` en hover `#232323` (`Defaults/Dark Grey`) blijven raw; een tweede ongewijzigde bevinding naast de lijst hierboven.
- **Ontbrekende interactiestaten**: geen hover/focus voor Navbar - Light items, tertiary/back-button (hover = rest), Tab, links, inputvelden (`input/border-focus`).
- **Mobile-pagina**: geen baseline-screenshots, dus geen pixel-diff voor Sizes=Mobile.

## Eindrapport fase 6 (sessie 2026-10-28)

### Controle tegen het onaangeroerde origineel (`fDSntIFhtIcXeZn4fExMTA`)
Fingerprint (script 19, tekst, lettergrootte en maat per frame, sectie en variant; 413 rijen Visual design + 27 Mobile) en pixel-diff per paginaframe. Elk verschil is ingedeeld als afgesproken, regressie of ongewijzigd origineel.

**Twee regressies gevonden en hersteld** (beide veroorzaakt doordat een binding op een hoofdcomponent de overrides op de instances wiste):
1. **Formulierlabels** (51 teksten, Onest SemiBold) waren 14 px in plaats van 12 px. Zichtbaar in Search, Contact, Resume en Opportunities (hoogtes +3 tot +12 px). Teruggezet op 12 px.
2. **About Us, sectie Team** (`2444:34733`): override `paddingTop=0` en breedte 1512 waren verdwenen (+192 px hoog). Hersteld.

**Daarna**: alle 26 eerder afwijkende rijen zijn identiek aan het origineel en de Mobile-pagina is fingerprint-identiek. Pixel-diff tegen het origineel: About, Contact, Opportunities en Opportunity Detail ≤ 24 px verschil (max 3). Home, Hire en Clients hebben lokale verschillen (≤ 1407 px, max 13) in de grijze functietitels in de reviewkaarten: die gebruiken nu `text` met laagdekking (script 13, afgesproken tolerantie). Resume 56 px subpixelverschuiving door de schaalfactor.

### Wat er in fase 5 en 6 is veranderd (tellingen)
- **Variantproperties**: 24 sets aangepast (zie "Fase 5: uitgevoerd"), 15 generieke setnamen vervangen, Button gesplitst in `type` + `state`. 56 sets, 0 fouten, 0 dubbele namen, 0 verweesde instances.
- **Theme-variabelen**: 20 nieuwe `button-*` variabelen, alle 10 Button-varianten gebonden, Button pixel-identiek.
- **Thema per sectie**: 38 secties/mains met effen achtergrond kregen een Theme-binding en expliciete mode (Base/Brand); 14 gradient-secties kregen gebonden stops en Brand. Mobile: `Sizes=Mobile` op 39 plekken.
- **Kleuren via Theme (script 13, aangepast)**: 261 knooppunten van swatch naar Theme (`text`, `background`, `background-2`, `button-primary/text`, 2 muted teksten met laagdekking). Het script is aangepast zodat ook bindingen op knooppuntniveau worden meegenomen, maar alleen als alle paints van dat knooppunt omgezet kunnen worden, en met een scope-controle (tekst alleen aan tekstvariabelen).
- **Thema-smoketest**: een Base-sectie tijdelijk op Dark: achtergrond, koppen, alinea's, kaarten en knoppen schakelen mee. Alleen ongebonden `#000000`/raw tekst (namen en bedrijfsnamen in de reviewkaarten, "See all clients") blijft donker: bekende design slips.
- **Scan 02** (per sectie, de pagina is >40k nodes): 0 verouderde modes, 0 remote text styles, 0 ontbrekende hoofdcomponenten. Pagina's zelf: 0 ruwe kleuren en 0 teksten zonder style. In de componenten blijven 174 ruwe vullingen, 38 ruwe randen en 135 teksten zonder style over.

### Open beslispunten
- Header / Home v01 `home` en `variant3`: geen Brand-mode (19 Theme-bindingen zouden van kleur veranderen). Besluit: laten staan, de build behandelt deze header als Brand.
- Roze eindstop `#e5b8b4` is niet aan `swatch/brand-pink-500` (`#e5bbb7`) gebonden. Besluit: laten staan (design slip).
- Onbepaalde sets: Card / Opportunity, Card / Service (`services-hover`), Card / Expert, Line, Nav / Base, Header default, Content / Services desktop vs Content / Mobile. Alleen gerapporteerd.
- `closed|open` op Content / Pricing row en Content / Fee row is afgeleid uit hoogte; controleren.
- Het lege sjabloonframe `iPhone 17 - 2` (402×874) op de Mobile-pagina bestaat alleen in het origineel; het is in een eerdere fase uit het duplicaat gehaald. Terugzetten kan door het te kopiëren uit het origineel.
- Typfouten in bestaande namen (`Design comonents`, `Oppertunities`, `Assesment`, `WYSIWIG`) en ~220 placeholder-laagnamen (`_group_wrap`, `Frame 434`…): niet gedaan, buiten fase 5 en 6.
- Drie losse text styles (`Headings/9xl`, `Body regular/5xl`, `Body regular/4xl`): nog niet besproken.

### Wat de Webflow-build moet weten
- **Primaire knop** = `Button type=primary` (mint `brand-accent-500`, tekst `dark-900`), hover zit in `state=hover`. Secondary en secondary-white hebben een omlijnde rest en gevulde hover. `button-secondary-white/*`, `button-tertiary/*`, `button-back/*` zijn nieuw (niet in de Lumos-basis).
- **Device-sets**: `device=desktop|mobile` (Footer ook `desktop-compact`). Content / Services desktop en Content / Mobile zijn aparte sets.
- **Slide- of hoversets**: Sub menu Item en Footer Item (`state=hover`) zijn echte hover. Tab en Tab / Home zijn `style=plain|outline|filled`. Content / Process step is `style=glass|plain`.
- **Nog aan swatches/raw gebonden** (themewisseling werkt daar niet): witte tekst in Base-componenten, alle vlakken met 10–50% dekking, `stars`-iconen, gradient-eindstop, `#000000` tekst (~25 plekken), `#050404` knoptekst, remote `Defaults/*`-variabelen in pijl-iconen.
- **Remote componenten** (niet vervangen): zie "Open na fase 5".
- **Ontbrekende interactiestaten**: hover/focus voor Navbar items, links, Tab en inputvelden.
- **Placeholder**: `[Date]` in Privacy & Cookies, `€XX` in tarieven.
