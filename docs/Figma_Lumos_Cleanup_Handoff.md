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
| 5 Componenten en modes | **nog te doen** |
| 6 Controle en eindrapport | nog te doen |

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
