// Split each icon's filled outline path into parts: an outer contour plus the holes inside it.
import fs from 'node:fs';
export function tokens(d){const re=/([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g;const t=[];let m;while((m=re.exec(d)))t.push(m[1]||+m[2]);return t;}
function flagsFix(d){ // arc flags may be written together: "0 01" etc. — expand inside arc segments
  return d;}
export function subpaths(d){
  const t=tokens(d);let i=0,cmd=null,x=0,y=0,sx=0,sy=0,px=0,py=0,lc=null;const subs=[];let cur=null;
  const num=()=>t[i++];
  const pts=[];
  const push=(s)=>cur.d.push(s);
  while(i<t.length){
    if(typeof t[i]==='string'){cmd=t[i++];}
    const c=cmd, rel=c===c.toLowerCase(), C=c.toUpperCase();
    if(C==='Z'){push('Z');x=sx;y=sy;cur.pts.push([x,y]);lc='Z';cmd=null;continue;}
    if(C==='M'){let nx=num(),ny=num();if(rel){nx+=x;ny+=y}x=sx=nx;y=sy=ny;cur={d:[`M${x} ${y}`],pts:[[x,y]]};subs.push(cur);cmd=rel?'l':'L';lc='M';continue;}
    if(C==='L'){let nx=num(),ny=num();if(rel){nx+=x;ny+=y}x=nx;y=ny;push(`L${x} ${y}`);cur.pts.push([x,y]);lc='L';continue;}
    if(C==='H'){let nx=num();if(rel)nx+=x;x=nx;push(`L${x} ${y}`);cur.pts.push([x,y]);lc='L';continue;}
    if(C==='V'){let ny=num();if(rel)ny+=y;y=ny;push(`L${x} ${y}`);cur.pts.push([x,y]);lc='L';continue;}
    const bez=(x1,y1,x2,y2,ex,ey)=>{for(let k=1;k<=8;k++){const s=k/8,u=1-s;cur.pts.push([u*u*u*x+3*u*u*s*x1+3*u*s*s*x2+s*s*s*ex,u*u*u*y+3*u*u*s*y1+3*u*s*s*y2+s*s*s*ey])}};
    if(C==='C'||C==='S'){let x1,y1;if(C==='C'){x1=num();y1=num();if(rel){x1+=x;y1+=y}}else{x1=(lc==='C')?2*x-px:x;y1=(lc==='C')?2*y-py:y}let x2=num(),y2=num(),ex=num(),ey=num();if(rel){x2+=x;y2+=y;ex+=x;ey+=y}push(`C${x1} ${y1} ${x2} ${y2} ${ex} ${ey}`);bez(x1,y1,x2,y2,ex,ey);px=x2;py=y2;x=ex;y=ey;lc='C';continue;}
    if(C==='Q'||C==='T'){let x1,y1;if(C==='Q'){x1=num();y1=num();if(rel){x1+=x;y1+=y}}else{x1=(lc==='Q')?2*x-px:x;y1=(lc==='Q')?2*y-py:y}let ex=num(),ey=num();if(rel){ex+=x;ey+=y}push(`Q${x1} ${y1} ${ex} ${ey}`);for(let k=1;k<=6;k++){const s=k/6,u=1-s;cur.pts.push([u*u*x+2*u*s*x1+s*s*ex,u*u*y+2*u*s*y1+s*s*ey])}px=x1;py=y1;x=ex;y=ey;lc='Q';continue;}
    if(C==='A'){const rx=num(),ry=num(),rot=num();let fa=num(),fs=num();let ex=num(),ey=num();if(rel){ex+=x;ey+=y}push(`A${rx} ${ry} ${rot} ${fa} ${fs} ${ex} ${ey}`);cur.pts.push([(x+ex)/2,(y+ey)/2],[ex,ey]);x=ex;y=ey;lc='A';continue;}
    throw new Error('cmd '+c);
  }
  return subs.map(s=>{const xs=s.pts.map(p=>p[0]),ys=s.pts.map(p=>p[1]);let a=0;for(let k=0;k<s.pts.length;k++){const[p,q]=[s.pts[k],s.pts[(k+1)%s.pts.length]];a+=p[0]*q[1]-q[0]*p[1]}
    return {d:s.d.join(''),pts:s.pts,box:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],area:Math.abs(a/2)}});
}
const inside=(pt,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi))c=!c}return c};
export function parts(d){
  const s=subpaths(d);
  const test=(b)=>{const p=b.pts;return [p[0][0]+(p[1]?.[0]-p[0][0])*1e-3,p[0][1]+(p[1]?.[1]-p[0][1])*1e-3]};
  const parents=s.map((b,i)=>s.map((a,j)=>j!==i&&a.area>b.area&&inside(b.pts[Math.floor(b.pts.length/2)],a.pts)&&inside(b.pts[0],a.pts)?j:-1).filter(j=>j>=0));
  const depth=parents.map(p=>p.length);
  const out=[];const owner={};
  s.forEach((b,i)=>{if(depth[i]%2===0){owner[i]=out.length;out.push({d:b.d,box:b.box.slice(),holes:[]})}});
  s.forEach((b,i)=>{if(depth[i]%2===1){const par=parents[i].filter(j=>depth[j]===depth[i]-1).sort((a,b2)=>s[a].area-s[b2].area)[0];const o=out[owner[par]];o.d+=b.d;o.holes.push(i)}});
  return out.map(p=>({d:p.d,box:p.box.map(v=>Math.round(v*100)/100)}));
}
