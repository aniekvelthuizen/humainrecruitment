import fs from 'node:fs';
import {build} from './motion-spec.mjs';
const PARTS=JSON.parse(fs.readFileSync(new URL('./parts.json', import.meta.url),'utf8'));
const [,, dataFile, styleFile, outFile] = process.argv;
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const staggerCss = fs.readFileSync(styleFile, 'utf8').match(/\/\* Icons: the masked[\s\S]*?(?=<\/style>)/)[0]
  .replace(/\[data-icon-motion\] \{[^}]*\}\n/, '').replace(/\[data-stagger-paused\][^\n]*\n/, '')
  .replace(/\[data-stagger-motion="ready"\][^\n]*\n/g, '');
const NAMES = { 'action-key':'Action Key','analytics':'Analytics','assignment':'Assignment','average-time':'Average Time','calendar':'Calendar','call-log':'Call Log','chart':'Chart','check-circle':'Check Circle','computer':'Computer','cv-submission':'CV Submission','dashboard':'Dashboard','euro':'Euro','fact-check':'Fact Check','handshake':'Handshake','list-check':'List Check','manage-accounts':'Manage Accounts','monitoring':'Monitoring','outbound':'Outbound','person-check':'Person Check','person-search':'Person Search','person-shield':'Person Shield','playlist-check':'Playlist Check','project-controls':'Project Controls','schedule-outline':'Schedule Outline','schema':'Schema','shield-alert':'Shield Alert','sync-check':'Sync Check','table':'Table' };
const NOW = {
  'schedule-outline':'Minutenwijzer draait rond in 8 s, uurwijzer in 96 s.',
  'project-controls':'Route tekent zich in, kruisjes landen; elke 5 s draaien de kruisjes en schuift de pijl iets op.',
  'person-search':'Loep zwaait heen en weer alsof hij zoekt (3,6 s).',
  'person-shield':'Schild ademt: wordt iets groter en weer kleiner (2,8 s).',
  'person-check':'Vinkje tekent, blijft staan, vervaagt en tekent opnieuw (3,2 s).',
  'check-circle':'Vinkje tekent, blijft staan, vervaagt en tekent opnieuw (3,2 s).',
  'list-check':'Vinkje tekent, blijft staan, vervaagt en tekent opnieuw (3,2 s).',
  'assignment':'De drie regels op het klembord schrijven zich na elkaar in (4 s).',
  'handshake':'Korte handdruk-schud elke 3,6 s.',
  'outbound':'Pijl beweegt naar de hoek en terug (2,8 s).'
};
const WISH = {
 'assignment':'Leeg klembord springt één keer omhoog, daarna komen de drie regels erbij.',
 'check-circle':'Het vinkje draait één rondje, in een loop.',
 'handshake':'Blijft zo.',
 'list-check':'Eerst bolletje met streep, dan het tweede, dan het vinkje.',
 'outbound':'Pijltje verdwijnt in de cirkel en vliegt aan de andere kant weer naar binnen.',
 'person-check':'Het hoofdje beweegt een beetje; het vinkje blijft intekenen.',
 'person-search':'Blijft zo.',
 'person-shield':'Schild kleurt in en weer uit; het ademen blijft.',
 'project-controls':'Blijft zo.',
 'schedule-outline':'Blijft zo.',
 'action-key':'Alle vier de rondjes bewegen naar elkaar toe en weer uit elkaar; alleen het steeltje van de loep wiebelt.',
 'analytics':'Wisselende data: staafjes, dan een taartdiagram, dan een lijngrafiek.',
 'average-time':'Een hartslaglijn loopt door de wijzerplaat; af en toe wordt de knop ingedrukt.',
 'calendar':'Om de paar seconden een nieuwe datum.',
 'call-log':'Het telefoontje wiebelt, de drie streepjes komen en gaan.',
 'chart':'Als Analytics, maar dan staafjes, liggende staafjes en een ringdiagram.',
 'computer':'Twee venstertjes verschijnen, de muis komt binnen en klikt.',
 'cv-submission':'Alleen de lijntjes komen en gaan.',
 'dashboard':'De blokjes ruilen van maat: vierkant wordt breed, breed wordt vierkant.',
 'euro':'Wiebelt en wordt even groter, alsof je het net verdiend hebt.',
 'fact-check':'Streepjes komen en gaan, het vinkje tekent in en wiebelt.',
 'manage-accounts':'Het tandwiel draait rond.',
 'monitoring':'Eerst komen de staafjes omhoog, dan tekent de zigzaglijn erboven.',
 'playlist-check':'Lijntjes komen en gaan, het vinkje tekent in en wiebelt.',
 'schema':'Bouwt op vanuit het midden: middelste vlakje, drie lijntjes, de andere drie vlakjes.',
 'shield-alert':'Schild wordt groter en kleiner, en is om de beurt gevuld en leeg.',
 'sync-check':'De pijlen draaien af en toe een rondje en stoppen dan.',
 'table':'De tabel bouwt zich op en de vakjes vullen zich één voor één.'
};
const PAGE = { '/':'Home','/hire-an-expert':'Hire an Expert','/project-delivery-experts':'Project Delivery Experts','/consulting-services':'Consulting Services','/project-controls':'Project Controls','/how-it-works':'How It Works' };
const clean = (svg) => svg.replace(/<\?xml[^>]*>/, '').replace(/\s(fill|width|height)="[^"]*"/g, '').replace('<svg', '<svg fill="currentColor" aria-hidden="true" focusable="false"');
const own = data.filter(d => d.own), still = data.filter(d => !d.own);
const SPEC = build(PARTS, Object.fromEntries(data.filter(d=>d.own).map(d=>[d.v,d.own])));
const KEEP=['handshake','person-search','project-controls','schedule-outline'];
let n = 0;
const card = (d) => {
  n++;
  const sp = SPEC[d.v], pv = PARTS[d.v];
  const art = sp.legacy ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${sp.svg}</svg>` : `<svg viewBox="${pv.vb}" fill="currentColor" aria-hidden="true" focusable="false"><g${pv.tr ? ` transform="${pv.tr}"` : ''}>${sp.svg}</g></svg>`;
  const keep = KEEP.includes(d.v);
  const where = Object.entries(d.use).map(([p, c]) => `${PAGE[p]}${c > 1 ? ` ×${c}` : ''}`).join(' · ');
  return `<article class="icon" id="${d.v}">
  <div class="icon-top"><span class="ref">#${String(n).padStart(2, '0')}</span><span class="chip ${keep ? 'chip-off' : 'chip-on'}">${keep ? 'Blijft zo' : 'Nieuw'}</span></div>
  <div class="art${sp.legacy ? ' legacy' : ''}" data-icon="${d.v}">${art}</div>
  <h3>${NAMES[d.v] || d.v}</h3>
  <p class="now">${WISH[d.v]}</p>
  <p class="where">${where}</p>
</article>`;
};
const html = `<title>Humain Icon Motion</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500&family=Vend+Sans:wght@500;600&display=swap">
<style>
/* Layout: a working sheet; one card per icon at site size, the ones that already move first. */
:root{
  --bg:#f4f2f8; --surface:#ffffff; --ink:#030b1b; --muted:#5b5670; --line:#dcd6e8;
  --brand:#250059; --accent:#00806b; --accent-soft:#e0f2ee; --still-soft:#ecebf0;
  --display:"Vend Sans",ui-sans-serif,system-ui,sans-serif; --body:"Onest",ui-sans-serif,system-ui,sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d0820;--surface:#18122e;--ink:#f1eef8;--muted:#a49dbb;--line:#2c2547;--brand:#cbb8f0;--accent:#3fd1b6;--accent-soft:#0f3a33;--still-soft:#241d3d;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0d0820;--surface:#18122e;--ink:#f1eef8;--muted:#a49dbb;--line:#2c2547;--brand:#cbb8f0;--accent:#3fd1b6;--accent-soft:#0f3a33;--still-soft:#241d3d;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:400 15px/1.55 var(--body)}
.wrap{max-width:1180px;margin:0 auto;padding-block:48px 72px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:40px}
header{display:grid;gap:12px;max-width:68ch}
.eyebrow{font:500 12px/1 var(--body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
h1{font:600 clamp(32px,5vw,48px)/1.05 var(--display);color:var(--brand);margin:0;text-wrap:balance}
h2{font:600 22px/1.2 var(--display);margin:0;text-wrap:balance}
header p{margin:0;color:var(--muted)}
section{display:grid;gap:16px}
.section-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 16px}
.section-head p{margin:0;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.icon{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px;display:grid;gap:10px;align-content:start;min-width:0}
.icon-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ref{font:500 12px/1 var(--body);color:var(--muted);font-variant-numeric:tabular-nums;letter-spacing:.04em}
.chip{font:500 11px/1 var(--body);letter-spacing:.08em;text-transform:uppercase;padding:6px 9px;border-radius:999px}
.chip-on{background:var(--accent-soft);color:var(--accent)}
.chip-off{background:var(--still-soft);color:var(--muted)}
.art{width:48px;height:48px;color:var(--ink);margin-block:8px 4px}
.art svg{display:block;width:100%;height:100%;overflow:visible}
.art svg *{transform-box:fill-box}
.legacy svg *{transform-box:view-box}
.art{--icon-bg:var(--surface)}
h3{font:600 17px/1.25 var(--display);margin:0}
.now{margin:0;font-size:14px}
.where{margin:0;font-size:13px;color:var(--muted)}
.how{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:20px;display:grid;gap:8px;max-width:72ch}
.how p{margin:0}
.how code{font-size:13px;background:var(--still-soft);padding:1px 5px;border-radius:4px}
${staggerCss}
${Object.values(SPEC).map(x=>x.css).join('\n')}
@media (prefers-reduced-motion:reduce){.art svg *{animation:none!important;transition:none!important}}
</style>
<div class="wrap">
<header>
  <span class="eyebrow">Humain · Card Primary icons</span>
  <h1>Beweging per icoon</h1>
  <p>Alle ${data.length} iconen die bovenaan een kaart staan, op de grootte van de site (48 px), met de beweging die je per nummer hebt gekozen. Elk icoon is opgeknipt in zijn eigen onderdelen, dus de lijnen blijven even dik als in het origineel. Dit is een voorvertoning: op de site staat dit nog niet.</p>
</header>
<div class="how">
  <h2>Zo bespreken we het</h2>
  <p>Noem het nummer en wat er anders moet, bijvoorbeeld: <code>#12 iets rustiger</code> of <code>#19 ook de onderste rij laten ruilen</code>. Als alles goed is, zet ik het op de site: elk icoon begint dan zodra het in beeld komt, en staat stil bij 'minder beweging'.</p>
</div>
<section>
  <div class="section-head"><h2>Trap-secties</h2><p>Deze bewogen al; vier blijven zoals ze zijn.</p></div>
  <div class="grid">${own.map(card).join('\n')}</div>
</section>
<section>
  <div class="section-head"><h2>Overige kaarten</h2><p>Deze stonden stil en krijgen nu hun eigen beweging.</p></div>
  <div class="grid">${still.map(card).join('\n')}</div>
</section>
</div>
`;
fs.writeFileSync(outFile, html);
console.log(html.length, own.length, still.length);
