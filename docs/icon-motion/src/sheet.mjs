import fs from 'node:fs';import {parts} from './split.mjs';
const data=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const res={};
let html='<style>body{font:12px sans-serif;display:flex;flex-wrap:wrap;gap:10px;background:#fff}.c{width:300px}svg{width:300px;height:300px;border:1px solid #ddd}</style>';
const col=i=>`hsl(${(i*67)%360} 80% 42%)`;
data.forEach((o,n)=>{
  const vb=o.svg.match(/viewBox="([^"]+)"/)[1];const tr=o.svg.match(/<g transform="([^"]+)"/)?.[1]||'';
  const ds=[...o.svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(m=>m[1]);
  const ps=ds.flatMap(parts);res[o.v]={vb,tr,parts:ps};
  const [vx,vy,vw]=vb.split(' ').map(Number);const fs2=vw/24*0.9;
  html+=`<div class="c"><b>${n+1} ${o.v}</b> (${ps.length})<svg viewBox="${vb}"><g transform="${tr}">${ps.map((p,i)=>`<path d="${p.d}" fill="${col(i)}"/><text x="${(p.box[0]+p.box[2])/2}" y="${(p.box[1]+p.box[3])/2}" font-size="${fs2}" fill="#000" stroke="#fff" stroke-width="${fs2/8}" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">${i}</text>`).join('')}</g></svg></div>`;
});
fs.writeFileSync(process.argv[3],html);fs.writeFileSync(process.argv[4],JSON.stringify(res));
console.log(Object.entries(res).map(([k,v])=>k+':'+v.parts.length).join(' '));
