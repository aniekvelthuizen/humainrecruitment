import fs from 'node:fs';
const src=fs.readFileSync('references/embeds/stagger-cards-motion-script.html','utf8').split('\n');
const S=' fill="none" stroke="currentColor" stroke-width=".7"';
const ICONS=eval('('+src.slice(9,42).join('\n').replace(/^\s*var ICONS = /,'').replace(/;\s*$/,'')+')');
const base='https://humain-dev.webflow.io';
const pages=['/','/hire-an-expert','/project-delivery-experts','/consulting-services','/project-controls','/how-it-works'];
const use={};
for(const p of pages){const h=await (await fetch(base+p)).text();
 for(const m of h.matchAll(/class="card_primary_icon[^"]*"[^>]*>\s*<div[^>]*data-wf--icon-set--variant="([^"]+)"/g)){(use[m[1]]??={})[p]=(use[m[1]][p]||0)+1;}
 // section context
}
const css=await (await fetch(base+'/')).text();
const cssUrl=[...css.matchAll(/href="([^"]+\.css)"/g)].map(m=>m[1]).find(u=>u.includes('website-files'));
const sheet=await (await fetch(cssUrl)).text();
const out=[];
for(const v of Object.keys(use).sort()){
  const re=new RegExp('w-variant-[0-9a-f-]+[^{]*\\{[^}]*?','g');
  out.push({v,use:use[v]});
}
// map variant -> svg url via data attribute & class: find the variant id in HTML
const any=await Promise.all(pages.map(async p=>(await fetch(base+p)).text()));
for(const o of out){
  let cls=null;for(const h of any){const m=h.match(new RegExp('class="icon_set_wrap ([^"]+)"[^>]*data-wf--icon-set--variant="'+o.v+'"'))||h.match(new RegExp('data-wf--icon-set--variant="'+o.v+'"[^>]*class="icon_set_wrap ([^"]+)"'));if(m){cls=m[1].trim();break}}
  o.cls=cls;
  const urls=[...new Set([...sheet.matchAll(/url\("?(https:[^")]+\.svg)"?\)/g)].map(m=>m[1]))];
  o.url=urls.find(u=>u.endsWith('_icon-'+o.v+'.svg'))||urls.find(u=>u.endsWith('_icon-'+o.v+'-outline.svg'))||null;
  o.svg=o.url?await (await fetch(o.url)).text():null;
  o.own=ICONS[o.v]||null;
}
fs.writeFileSync(process.argv[2],JSON.stringify(out));
console.log(out.map(o=>o.v+' '+(o.url?'svg':'NOSVG')+' '+(o.own?'OWN':'')+' '+JSON.stringify(o.use)).join('\n'));
