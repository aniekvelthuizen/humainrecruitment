(function(){
var d=document,h=d.documentElement;
if(window.cardIconMotion)return;window.cardIconMotion=1;
if(h.classList.contains('wf-design-mode')||!('IntersectionObserver' in window)||!window.fetch||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function tokens(d){const re=/([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g;const t=[];let m;while((m=re.exec(d)))t.push(m[1]||+m[2]);return t;}
function subpaths(d){
  const t=tokens(d);let i=0,cmd=null,x=0,y=0,sx=0,sy=0,px=0,py=0,lc=null;const subs=[];let cur=null;
  const num=()=>t[i++];
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
var inside=(pt,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi))c=!c}return c};
function parts(d){
  const s=subpaths(d);
  const parents=s.map((b,i)=>s.map((a,j)=>j!==i&&a.area>b.area&&inside(b.pts[Math.floor(b.pts.length/2)],a.pts)&&inside(b.pts[0],a.pts)?j:-1).filter(j=>j>=0));
  const depth=parents.map(p=>p.length);
  const out=[];const owner={};
  s.forEach((b,i)=>{if(depth[i]%2===0){owner[i]=out.length;out.push({d:b.d,box:b.box.slice(),holes:[]})}});
  s.forEach((b,i)=>{if(depth[i]%2===1){const par=parents[i].filter(j=>depth[j]===depth[i]-1).sort((a,b2)=>s[a].area-s[b2].area)[0];const o=out[owner[par]];o.d+=b.d;o.holes.push(i)}});
  return out.map(p=>({d:p.d,box:p.box.map(v=>Math.round(v*100)/100)}));
}

function build(parts, legacy) {
  const P = (v, i) => parts[v].parts[i].d;
  const outer = (d) => (d || '').split(/(?=M)/)[0];
  const F = (d, a = '') => `<path d="${d}" ${a}/>`;
  const S = 'fill="none" stroke="currentColor" stroke-width=".7"';
  const rest = (v, skip) => parts[v].parts.map((p, i) => skip.includes(i) ? '' : F(p.d)).join('');
  const k = (v) => `[data-icon="${v}"]`;
  const I = {};
  I['assignment'] = { svg: `<g data-a="board">${F(P('assignment', 0))}</g>${F(P('assignment', 3), 'data-a="l1"')}${F(P('assignment', 2), 'data-a="l2"')}${F(P('assignment', 1), 'data-a="l3"')}`,
    css: `${k('assignment')} [data-a="board"]{animation:as-hop 5s cubic-bezier(.3,0,.2,1) infinite both}
${k('assignment')} [data-a^="l"]{transform-origin:left center;animation:as-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('assignment')} [data-a="l2"]{animation-delay:.15s}${k('assignment')} [data-a="l3"]{animation-delay:.3s}
@keyframes as-hop{0%{translate:0 3px;opacity:0}9%{translate:0 -1.2px;opacity:1}15%{translate:0 .3px}19%{translate:0 0}86%{opacity:1;translate:0 0}94%,100%{opacity:0;translate:0 0}}
@keyframes as-line{0%,20%{scale:0 1;opacity:1}32%{scale:1 1}86%{opacity:1;scale:1 1}94%,100%{opacity:0;scale:1 1}}` };
  I['check-circle'] = { svg: F(P('check-circle', 1)) + F(P('check-circle', 0), 'data-a="tick"'),
    css: `${k('check-circle')} [data-a="tick"]{transform-origin:center;animation:cc-spin 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes cc-spin{0%,10%{rotate:0deg}40%,100%{rotate:360deg}}` };
  I['list-check'] = { clip: true, svg: rest('list-check', [2, 3, 4, 5, 6]) + F(P('list-check', 4), 'data-a="d1"') + F(P('list-check', 6), 'data-a="r1"') + F(P('list-check', 3), 'data-a="d2"') + F(P('list-check', 5), 'data-a="r2"') +
      `<g clip-path="url(#lc-clip)">${F(P('list-check', 2))}</g><clipPath id="lc-clip"><rect data-a="wipe" x="580" y="-340" width="300" height="220"/></clipPath>`,
    css: `${k('list-check')} [data-a^="d"]{transform-origin:center;animation:lc-pop 5s cubic-bezier(.3,1.4,.5,1) infinite both}
${k('list-check')} [data-a^="r"]{transform-origin:left center;animation:lc-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('list-check')} [data-a="r1"]{animation-delay:.3s}${k('list-check')} [data-a="d2"]{animation-delay:.75s}${k('list-check')} [data-a="r2"]{animation-delay:1.05s}
${k('list-check')} [data-a="wipe"]{transform-origin:left center;animation:lc-wipe 5s cubic-bezier(.45,0,.2,1) 1.6s infinite both}
@keyframes lc-pop{0%{scale:0;opacity:1}6%{scale:1}74%{opacity:1;scale:1}82%,100%{opacity:0;scale:1}}
@keyframes lc-line{0%{scale:0 1;opacity:1}8%{scale:1 1}74%{opacity:1;scale:1 1}82%,100%{opacity:0;scale:1 1}}
@keyframes lc-wipe{0%{scale:0 1;opacity:1}10%{scale:1 1}52%{opacity:1;scale:1 1}60%,100%{opacity:0;scale:1 1}}` };
  I['outbound'] = { svg: F(P('outbound', 1)) + `<clipPath id="ob-clip"><circle cx="480" cy="-480" r="318"/></clipPath><g clip-path="url(#ob-clip)">${F(P('outbound', 0), 'data-a="arrow"')}</g>`,
    css: `${k('outbound')} [data-a="arrow"]{animation:ob-fly 4s infinite}
@keyframes ob-fly{0%,30%{translate:0 0;animation-timing-function:cubic-bezier(.5,0,.9,.4)}46%{translate:360px -360px}46.01%{translate:-360px 360px;animation-timing-function:cubic-bezier(.1,.6,.3,1)}64%,100%{translate:0 0}}` };
  I['person-check'] = { svg: F(P('person-check', 2)) + F(P('person-check', 1), 'data-a="head"') + `<g clip-path="url(#pc-clip)">${F(P('person-check', 0))}</g><clipPath id="pc-clip"><rect data-a="wipe" x="12.4" y="-.2" width="8" height="5.8"/></clipPath>`,
    css: `${k('person-check')} [data-a="head"]{animation:pc-head 3.2s ease-in-out infinite}
${k('person-check')} [data-a="wipe"]{transform-origin:left center;animation:pc-wipe 3.2s cubic-bezier(.45,0,.2,1) infinite both}
@keyframes pc-head{0%,100%{translate:0 0;rotate:0deg}25%{translate:.25px -.45px;rotate:6deg}50%{translate:0 0;rotate:0deg}75%{translate:-.25px -.45px;rotate:-6deg}}
@keyframes pc-wipe{0%{scale:0 1;opacity:1}22%{scale:1 1}80%{opacity:1}94%,100%{opacity:0;scale:1 1}}` };
  I['person-shield'] = { svg: F(P('person-shield', 0)) + F(P('person-shield', 2)) + `<g data-a="shield">${F(P('person-shield', 1))}${F(outer(P('person-shield', 1)), 'data-a="fill"')}</g>`,
    css: `${k('person-shield')} [data-a="shield"]{transform-origin:center;animation:ps-breath 2.8s ease-in-out infinite}
${k('person-shield')} [data-a="fill"]{animation:ps-fill 5.6s ease-in-out infinite both}
@keyframes ps-breath{0%,100%{scale:1}50%{scale:1.12}}
@keyframes ps-fill{0%,15%{opacity:0}35%,65%{opacity:1}85%,100%{opacity:0}}` };
  I['action-key'] = { svg: F(P('action-key', 2), 'data-a="tl"') + F(P('action-key', 3), 'data-a="tr"') + F(P('action-key', 1), 'data-a="bl"') +
      `<g data-a="br" ${S}><circle cx="16.1" cy="16.1" r="2.8"/><path data-a="handle" d="M18.1 18.1L20.95 20.95"/></g>`,
    css: `${k('action-key')} [data-a="tl"]{--x:1.45px;--y:1.45px}${k('action-key')} [data-a="tr"]{--x:-1.45px;--y:1.45px}${k('action-key')} [data-a="bl"]{--x:1.45px;--y:-1.45px}${k('action-key')} [data-a="br"]{--x:-1.45px;--y:-1.45px}
${k('action-key')} [data-a="tl"],${k('action-key')} [data-a="tr"],${k('action-key')} [data-a="bl"],${k('action-key')} [data-a="br"]{animation:ak-gather 4s cubic-bezier(.65,0,.35,1) infinite}
${k('action-key')} [data-a="handle"]{transform-box:view-box;transform-origin:18.1px 18.1px;animation:ak-handle 1.2s ease-in-out infinite}
@keyframes ak-gather{0%,12%,88%,100%{translate:0 0}38%,62%{translate:var(--x) var(--y)}}
@keyframes ak-handle{0%,100%{rotate:0deg}25%{rotate:-14deg}75%{rotate:14deg}}` };
  I['analytics'] = { svg: F(P('analytics', 4)) + `<g data-a="v1">${F(P('analytics', 0), 'data-a="bar"')}${F(P('analytics', 2), 'data-a="bar"')}${F(P('analytics', 3), 'data-a="bar"')}${F(P('analytics', 1), 'data-a="bar"')}</g>` +
      `<g data-a="v2" ${S}><circle cx="12" cy="12" r="3.6"/><path d="M12 8.4V12L15.1 13.8"/></g>` +
      `<path data-a="v3" pathLength="1" ${S} stroke-linejoin="round" d="M7.6 15.4L10.2 11.6L13 13.6L16.4 8.6"/>`,
    css: `${k('analytics')} [data-a="bar"]{transform-origin:center bottom;animation:an-bars 9s cubic-bezier(.3,0,.2,1) infinite both}
${k('analytics')} [data-a="v1"]{animation:an-out 9s infinite both}
${k('analytics')} [data-a="v2"]{transform-origin:center;animation:an-pie 9s cubic-bezier(.3,0,.2,1) 3s infinite both}
${k('analytics')} [data-a="v3"]{stroke-dasharray:1.02 2;animation:an-line 9s cubic-bezier(.45,0,.2,1) 6s infinite both}
@keyframes an-bars{0%{scale:1 0}6%,100%{scale:1 1}}
@keyframes an-out{0%,29%{opacity:1}33%,100%{opacity:0}}
@keyframes an-pie{0%{opacity:0;scale:.5;rotate:-90deg}6%{opacity:1;scale:1;rotate:0deg}29%{opacity:1}33%,100%{opacity:0;scale:1}}
@keyframes an-line{0%{stroke-dashoffset:1.03;opacity:1}8%{stroke-dashoffset:0}29%{opacity:1}33%,100%{opacity:0;stroke-dashoffset:0}}` };
  I['chart'] = { svg: F(P('chart', 3)) + `<g data-a="v1">${F(P('chart', 0), 'data-a="bar"')}${F(P('chart', 1), 'data-a="bar"')}${F(P('chart', 2), 'data-a="bar"')}</g>` +
      `<g data-a="v2" ${S}><path data-a="hb" d="M7.6 9H16.4"/><path data-a="hb" d="M7.6 12H13.4"/><path data-a="hb" d="M7.6 15H11"/></g>` +
      `<circle data-a="v3" cx="12" cy="12" r="3.6" pathLength="1" ${S} stroke-dasharray=".34 .04 .26 .04 .28 .04"/>`,
    css: `${k('chart')} [data-a="bar"]{transform-origin:center bottom;animation:an-bars 9s cubic-bezier(.3,0,.2,1) infinite both}
${k('chart')} [data-a="v1"]{animation:an-out 9s infinite both}
${k('chart')} [data-a="v2"]{animation:an-out 9s 3s infinite both}
${k('chart')} [data-a="hb"]{transform-origin:left center;animation:ch-hbar 9s cubic-bezier(.3,0,.2,1) 3s infinite both}
${k('chart')} [data-a="v3"]{transform-origin:center;animation:an-pie 9s cubic-bezier(.3,0,.2,1) 6s infinite both}
@keyframes ch-hbar{0%{scale:0 1}6%,100%{scale:1 1}}` };
  const pat = (o) => [[0, 0], [3.15, 0], [5, 3.6], [8.85, -4.05], [10.85, 0], [14, 0]].map(([x, y]) => `${x + o} ${13 + y}`).join(' L');
  I['average-time'] = { svg: `<circle cx="12" cy="13" r="7.35" ${S}/><path d="M17.55 8L18.8 6.75" ${S}/>${F(P('average-time', 4), 'data-a="btn"')}` +
      `<clipPath id="at-clip"><circle cx="12" cy="13" r="7"/></clipPath><g clip-path="url(#at-clip)"><path data-a="pulse" ${S} stroke-linejoin="miter" d="M${pat(-9)} L${pat(5)} L${pat(19)}"/></g>`,
    css: `${k('average-time')} [data-a="pulse"]{animation:at-run 3s linear infinite}
${k('average-time')} [data-a="btn"]{animation:at-press 4s ease-in-out infinite}
@keyframes at-run{from{translate:0 0}to{translate:-14px 0}}
@keyframes at-press{0%,70%,82%,100%{translate:0 0}74%,78%{translate:0 .55px}}` };
  const nums = ['12', '24', '3', '18'];
  I['calendar'] = { svg: F(P('calendar', 0)) + `<clipPath id="cal-clip"><rect x="5" y="10.8" width="14" height="9.2"/></clipPath><g clip-path="url(#cal-clip)" fill="currentColor">${nums.map((n, i) => `<text data-a="n" style="animation-delay:${i * 2.5}s" x="12" y="15.55" text-anchor="middle" dominant-baseline="central" font-size="5.4" font-weight="300">${n}</text>`).join('')}</g>`,
    css: `${k('calendar')} [data-a="n"]{font-family:var(--icon-font,inherit);animation:cal-n 10s cubic-bezier(.3,0,.2,1) infinite both}
@keyframes cal-n{0%{opacity:0;translate:0 3px}5%{opacity:1;translate:0 0}22%{opacity:1;translate:0 0}27%,100%{opacity:0;translate:0 -3px}}` };
  I['call-log'] = { svg: F(P('call-log', 3), 'data-a="phone"') + F(P('call-log', 2), 'data-a="w1"') + F(P('call-log', 1), 'data-a="w2"') + F(P('call-log', 0), 'data-a="w3"'),
    css: `${k('call-log')} [data-a="phone"]{transform-origin:center;animation:cl-ring 3.2s ease-in-out infinite}
${k('call-log')} [data-a^="w"]{transform-origin:left center;animation:cl-line 3.2s cubic-bezier(.45,0,.2,1) infinite both}
${k('call-log')} [data-a="w2"]{animation-delay:.12s}${k('call-log')} [data-a="w3"]{animation-delay:.24s}
@keyframes cl-ring{0%,40%,100%{rotate:0deg}5%{rotate:-8deg}10%{rotate:7deg}15%{rotate:-6deg}20%{rotate:5deg}25%{rotate:-3deg}30%{rotate:0deg}}
@keyframes cl-line{0%{scale:0 1}14%,62%{scale:1 1;transform-origin:left center}63%{transform-origin:right center}76%,100%{scale:0 1;transform-origin:right center}}` };
  I['computer'] = { svg: F(P('computer', 1)) + F(P('computer', 0)) +
      `<rect data-a="w1" x="6.2" y="7.3" width="6.4" height="4.4" rx=".3" ${S}/><rect data-a="w2" x="10.6" y="9.9" width="6.8" height="4.6" rx=".3" fill="var(--icon-bg,#fff)" stroke="currentColor" stroke-width=".7"/>` +
      `<g data-a="cursor"><path data-a="click" fill="currentColor" d="M0 0V3.3L.85 2.5L1.5 3.9L2.05 3.65L1.4 2.25H2.55Z"/></g>`,
    css: `${k('computer')} [data-a^="w"]{transform-origin:center;animation:co-win 6s cubic-bezier(.3,1.3,.5,1) infinite both}
${k('computer')} [data-a="w2"]{animation-delay:.45s}
${k('computer')} [data-a="cursor"]{animation:co-move 6s cubic-bezier(.45,0,.2,1) infinite both}
${k('computer')} [data-a="click"]{transform-origin:0 0;animation:co-click 6s ease infinite both}
@keyframes co-win{0%{opacity:0;scale:.6}7%{opacity:1;scale:1}84%{opacity:1;scale:1}91%,100%{opacity:0;scale:1}}
@keyframes co-move{0%,20%{opacity:0;translate:17px 13.5px}25%{opacity:1;translate:17px 13.5px}42%{translate:13.6px 10.8px}84%{opacity:1;translate:13.6px 10.8px}91%,100%{opacity:0;translate:13.6px 10.8px}}
@keyframes co-click{0%,44%,50%,100%{scale:1}47%{scale:.8}}` };
  I['cv-submission'] = { svg: rest('cv-submission', [3, 4, 5]) + F(P('cv-submission', 3), 'data-a="r1"') + F(P('cv-submission', 4), 'data-a="r2"') + F(P('cv-submission', 5), 'data-a="r3"'),
    css: `${k('cv-submission')} [data-a^="r"]{transform-origin:left center;animation:cl-line 4s cubic-bezier(.45,0,.2,1) infinite both}
${k('cv-submission')} [data-a="r2"]{animation-delay:.15s}${k('cv-submission')} [data-a="r3"]{animation-delay:.3s}` };
  const tile = (name, x, y, w, h, grow, anchor) => {
    const sx = anchor === 'left' ? x + w - .7 : x;
    return `<g data-a="${name}" style="--s:${(w + grow) / w};--m:${anchor === 'left' ? grow : -grow}px">` +
      `<rect data-a="h" style="transform-origin:${anchor} center" x="${x}" y="${y}" width="${w}" height=".7"/><rect data-a="h" style="transform-origin:${anchor} center" x="${x}" y="${y + h - .7}" width="${w}" height=".7"/>` +
      `<rect x="${anchor === 'left' ? x : x + w - .7}" y="${y}" width=".7" height="${h}"/><rect data-a="v" x="${sx}" y="${y}" width=".7" height="${h}"/></g>`;
  };
  I['dashboard'] = { svg: `<g fill="currentColor">${tile('tl', 3.3, 5.3, 5.45, 5.45, 4, 'left')}${tile('tr', 11.25, 5.3, 9.45, 5.45, -4, 'right')}${tile('bl', 3.3, 13.25, 9.45, 5.45, -4, 'left')}${tile('br', 15.25, 13.25, 5.45, 5.45, 4, 'right')}</g>`,
    css: `${k('dashboard')} [data-a="h"]{animation:db-w 6s cubic-bezier(.65,0,.35,1) infinite}
${k('dashboard')} [data-a="v"]{animation:db-x 6s cubic-bezier(.65,0,.35,1) infinite}
@keyframes db-w{0%,15%,85%,100%{scale:1 1}35%,65%{scale:var(--s) 1}}
@keyframes db-x{0%,15%,85%,100%{translate:0 0}35%,65%{translate:var(--m) 0}}` };
  I['euro'] = { svg: F(P('euro', 0), 'data-a="euro"'),
    css: `${k('euro')} [data-a="euro"]{transform-origin:center;animation:eu-earn 3.6s ease-in-out infinite}
@keyframes eu-earn{0%,40%,100%{rotate:0deg;scale:1}8%{rotate:-10deg;scale:1.12}16%{rotate:8deg;scale:1.12}24%{rotate:-5deg;scale:1.06}32%{rotate:2deg;scale:1.02}}` };
  I['fact-check'] = { svg: F(P('fact-check', 0)) + F(P('fact-check', 4), 'data-a="r1"') + F(P('fact-check', 3), 'data-a="r2"') + F(P('fact-check', 1), 'data-a="r3"') +
      `<g data-a="tick"><g clip-path="url(#fc-clip)">${F(P('fact-check', 2))}</g></g><clipPath id="fc-clip"><rect data-a="wipe" x="12.5" y="9.4" width="6.4" height="4.9"/></clipPath>`,
    css: `${k('fact-check')} [data-a^="r"]{transform-origin:left center;animation:cl-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('fact-check')} [data-a="r2"]{animation-delay:.15s}${k('fact-check')} [data-a="r3"]{animation-delay:.3s}
${k('fact-check')} [data-a="wipe"]{transform-origin:left center;animation:tk-wipe 5s cubic-bezier(.45,0,.2,1) .6s infinite both}
${k('fact-check')} [data-a="tick"]{transform-origin:center;animation:tk-wobble 5s ease-in-out .6s infinite both}
@keyframes tk-wipe{0%{scale:0 1;opacity:1}12%{scale:1 1}62%{opacity:1;scale:1 1}70%,100%{opacity:0;scale:1 1}}
@keyframes tk-wobble{0%,14%,34%,100%{rotate:0deg;scale:1}19%{rotate:-10deg;scale:1.12}25%{rotate:7deg;scale:1.08}30%{rotate:-3deg;scale:1}}` };
  I['manage-accounts'] = { svg: F(P('manage-accounts', 0)) + F(P('manage-accounts', 1)) + F(P('manage-accounts', 2), 'data-a="gear"'),
    css: `${k('manage-accounts')} [data-a="gear"]{transform-origin:center;animation:ma-turn 8s linear infinite}
@keyframes ma-turn{to{rotate:360deg}}` };
  I['monitoring'] = { svg: [0, 1, 2, 3, 4].map((i) => F(P('monitoring', i), `data-a="bar" style="animation-delay:${i * .1}s"`)).join('') +
      `<g clip-path="url(#mo-clip)">${F(P('monitoring', 5))}</g><clipPath id="mo-clip"><rect data-a="wipe" x="3.4" y="4.3" width="17.4" height="10.4"/></clipPath>`,
    css: `${k('monitoring')} [data-a="bar"]{transform-origin:center bottom;animation:mo-bar 5.5s cubic-bezier(.3,0,.2,1) infinite both}
${k('monitoring')} [data-a="wipe"]{transform-origin:left center;animation:mo-wipe 5.5s cubic-bezier(.45,0,.2,1) .7s infinite both}
@keyframes mo-bar{0%{scale:1 0;opacity:1}9%{scale:1 1}80%{opacity:1;scale:1 1}88%,100%{opacity:0;scale:1 1}}
@keyframes mo-wipe{0%{scale:0 1;opacity:1}17%{scale:1 1}68%{opacity:1;scale:1 1}75%,100%{opacity:0;scale:1 1}}` };
  I['playlist-check'] = { svg: F(P('playlist-check', 4)) + F(P('playlist-check', 3), 'data-a="r1"') + F(P('playlist-check', 2), 'data-a="r2"') + F(P('playlist-check', 1), 'data-a="r3"') +
      `<g data-a="tick"><g clip-path="url(#pl-clip)">${F(P('playlist-check', 0))}</g></g><clipPath id="pl-clip"><rect data-a="wipe" x="11.9" y="12.7" width="6.4" height="5"/></clipPath>`,
    css: `${k('playlist-check')} [data-a^="r"]{transform-origin:left center;animation:cl-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('playlist-check')} [data-a="r2"]{animation-delay:.15s}${k('playlist-check')} [data-a="r3"]{animation-delay:.3s}
${k('playlist-check')} [data-a="wipe"]{transform-origin:left center;animation:tk-wipe 5s cubic-bezier(.45,0,.2,1) .6s infinite both}
${k('playlist-check')} [data-a="tick"]{transform-origin:center;animation:tk-wobble 5s ease-in-out .6s infinite both}` };
  I['schema'] = { svg: `<g ${S}><rect data-a="hub" x="5.5" y="10.5" width="4" height="3"/>` +
      `<path data-a="ln" pathLength="1" d="M7.5 10.15V5.85"/><path data-a="ln" pathLength="1" d="M7.5 13.85V18.15"/><path data-a="ln" pathLength="1" d="M9.85 12H15.15"/>` +
      `<rect data-a="box" style="animation-delay:.9s" x="5.5" y="2.5" width="4" height="3"/><rect data-a="box" style="animation-delay:1s" x="15.5" y="10.5" width="4" height="3"/><rect data-a="box" style="animation-delay:1.1s" x="5.5" y="18.5" width="4" height="3"/></g>`,
    css: `${k('schema')} [data-a="hub"],${k('schema')} [data-a="box"]{transform-origin:center;animation:sc-pop 5s cubic-bezier(.3,1.4,.5,1) infinite both}
${k('schema')} [data-a="ln"]{stroke-dasharray:1.02 2;animation:sc-line 5s cubic-bezier(.45,0,.2,1) .35s infinite both}
@keyframes sc-pop{0%{scale:0;opacity:1}8%{scale:1}82%{opacity:1;scale:1}90%,100%{opacity:0;scale:1}}
@keyframes sc-line{0%{stroke-dashoffset:1.03;opacity:1}10%{stroke-dashoffset:0}75%{opacity:1}83%,100%{opacity:0;stroke-dashoffset:0}}` };
  const sa = parts['shield-alert'].parts;
  I['shield-alert'] = { svg: `<g data-a="shield">${F(sa[2].d)}${F(outer(sa[2].d) + sa[0].d + sa[1].d, 'data-a="fill" fill-rule="evenodd"')}<g data-a="mark">${F(sa[0].d)}${F(sa[1].d)}</g></g>`,
    css: `${k('shield-alert')} [data-a="shield"]{transform-origin:center;animation:ps-breath 3s ease-in-out infinite}
${k('shield-alert')} [data-a="fill"]{animation:sa-fill 6s ease-in-out infinite both}
${k('shield-alert')} [data-a="mark"]{animation:sa-mark 6s ease-in-out infinite both}
@keyframes sa-fill{0%,40%{opacity:0}52%,88%{opacity:1}100%{opacity:0}}
@keyframes sa-mark{0%,40%{opacity:1}52%,88%{opacity:0}100%{opacity:1}}` };
  I['sync-check'] = { svg: `<g data-a="arrows">${F(P('sync-check', 0))}${F(P('sync-check', 2))}</g>${F(P('sync-check', 1))}`,
    css: `${k('sync-check')} [data-a="arrows"]{transform-box:view-box;transform-origin:12px 12px;animation:sy-turn 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes sy-turn{0%,15%{rotate:0deg}45%,100%{rotate:360deg}}` };
  const cells = [5, 3, 4, 1, 2].map((i, n) => F(outer((parts['table'].parts[0].d || '').split(/(?=M)/)[i]), `data-a="cell" style="animation-delay:${1 + n * .35}s"`)).join('');
  I['table'] = { svg: `${cells}<g ${S}><rect data-a="frame" pathLength="1" x="4.65" y="4.65" width="14.7" height="14.7" rx="1.15"/><path data-a="ln" pathLength="1" d="M5 8.35H19"/><path data-a="ln" pathLength="1" d="M5 13.875H19"/><path data-a="ln" pathLength="1" d="M12 8.7V19"/></g>`,
    css: `${k('table')} [data-a="frame"]{stroke-dasharray:1.02 2;animation:tb-draw 7s cubic-bezier(.45,0,.2,1) infinite both}
${k('table')} [data-a="ln"]{stroke-dasharray:1.02 2;animation:tb-draw 7s cubic-bezier(.45,0,.2,1) .5s infinite both}
${k('table')} [data-a="cell"]{fill:currentColor;animation:tb-cell 7s ease infinite both}
@keyframes tb-draw{0%{stroke-dashoffset:1.03;opacity:1}10%{stroke-dashoffset:0}86%{opacity:1}93%,100%{opacity:0;stroke-dashoffset:0}}
@keyframes tb-cell{0%{opacity:0}5%,60%{opacity:.25}68%,100%{opacity:0}}` };
  for (const v of ['handshake', 'person-search', 'project-controls', 'schedule-outline']) I[v] = { legacy: true, svg: legacy[v], css: '' };
  return I;
}

var LEGACY={"handshake":"<g data-icon-part=\"shake\" fill=\"currentColor\"><path transform=\"scale(.025) translate(0 960)\" d=\"M466-163q9 0 18.5-4t15.5-10l307-307q16-16 25-32t9-36q0-20-9-39t-25-35L663-770q-16-16-32-23.5t-36-7.5q-20 0-36.5 7.5T527-770l-42 42 74 74q11 11 16.5 25t5.5 28q0 28-18 46t-46 18q-14 0-27.5-4T465-556l-77-77-172 172q-7 7-10.5 16t-3.5 18q0 16 10 26t26 10q9 0 18.5-4t15.5-10l124-124 20 20-124 124q-7 7-10.5 16t-3.5 18q0 15 10.5 25.5T314-315q9 0 18.5-4t15.5-10l136-136 20 20-136 136q-6 6-10 15.5t-4 18.5q0 15 10.5 25.5T390-239q9 0 18-3.5t16-10.5l136-136 20 20-136 136q-7 7-10.5 17t-3.5 18q0 16 11 25.5t25 9.5Zm0 28q-29 0-49-22t-15-54q-34 2-56.5-18T326-287q-38 2-59-19t-17-57q-32 2-54-14.5T174-427q0-14 5.5-28.5T196-481l192-192 95 95q6 6 14.5 10t19.5 4q14 0 25-10t11-26q0-11-4-19.5T539-634L403-770q-16-16-32.5-23.5T334-801q-20 0-35.5 7.5T267-770L151-654q-14 14-22.5 33.5T120-580q0 14 3 26.5t9 23.5l-22 22q-8-14-13-33t-5-39q0-27 10-51.5t29-43.5l115-115q20-20 41.5-29.5T335-829q26 0 47 9.5t41 29.5l42 42 42-42q20-20 41-29.5t47-9.5q26 0 47.5 9.5T684-790l143 143q20 20 31 44.5t11 50.5q0 26-11 47t-31 41L520-157q-12 12-25.5 17t-28.5 5ZM329-623Z\"/></g>","person-search":"<g transform=\"translate(4.3 5.8)\" fill=\"currentColor\"><path d=\"M6.7 5.4C5.9575 5.4 5.32192 5.13567 4.79325 4.607C4.26442 4.07817 4 3.4425 4 2.7C4 1.9575 4.26442 1.32183 4.79325 .793C5.32192 .264333 5.9575 0 6.7 0C7.4425 0 8.07817 .264333 8.607 .793C9.13567 1.32183 9.4 1.9575 9.4 2.7C9.4 3.4425 9.13567 4.07817 8.607 4.607C8.07817 5.13567 7.4425 5.4 6.7 5.4ZM6.7 4.7C7.25 4.7 7.72083 4.50417 8.1125 4.1125C8.50417 3.72083 8.7 3.25 8.7 2.7C8.7 2.15 8.50417 1.67917 8.1125 1.2875C7.72083 .895833 7.25 .7 6.7 .7C6.15 .7 5.67917 .895833 5.2875 1.2875C4.89583 1.67917 4.7 2.15 4.7 2.7C4.7 3.25 4.89583 3.72083 5.2875 4.1125C5.67917 4.50417 6.15 4.7 6.7 4.7Z\"/><path d=\"M0 12.4V11.1C0 10.7167 .1125 10.3708 .3375 10.0625C.5625 9.75417 .866667 9.5 1.25 9.3C1.93333 8.96667 2.8625 8.64167 4.0375 8.325C5.2125 8.00833 6.475 7.91667 7.825 8.05C7.75833 8.18333 7.696 8.3015 7.638 8.4045C7.58017 8.50767 7.53417 8.6145 7.5 8.725C6.25 8.625 5.08333 8.72917 4 9.0375C2.91667 9.34583 2.11667 9.63333 1.6 9.9C1.31667 10.0333 1.09583 10.2056 .9375 10.4168C.779167 10.6278 .7 10.8555 .7 11.1V11.7H7.2C7.21667 11.8 7.24167 11.9125 7.275 12.0375C7.30833 12.1625 7.34167 12.2833 7.375 12.4H0Z\"/></g><g data-icon-part=\"loupe\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"><circle cx=\"16.5\" cy=\"16.5\" r=\"2.75\"/><path d=\"M18.44 18.44L21.2 21.2\"/></g>","project-controls":"<g transform=\"translate(4.3 3.3)\"><path data-icon-part=\"line\" pathLength=\"1\" d=\"M4.35 14.05A2 2 0 1 1 .35 14.05A2 2 0 1 1 4.35 14.05C5.6 14 6.5 13.6 7.1 12.95C7.65 12.4 7.95 11.6 7.95 10.7V7.075A4 4 0 0 1 11.95 3.075H14.85\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"/><path data-icon-part=\"arrow\" d=\"M12.075 .25L14.9 3.075L12.075 5.9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"/></g><g data-icon-part=\"cross\" style=\"--o:6.375px 6.375px;--cd:.35s\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"><path d=\"M4.55 4.55L8.2 8.2M8.2 4.55L4.55 8.2\"/></g><g data-icon-part=\"cross\" style=\"--o:17.625px 17.625px;--cd:1.25s\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"><path d=\"M15.8 15.8L19.45 19.45M19.45 15.8L15.8 19.45\"/></g>","schedule-outline":"<circle cx=\"12\" cy=\"12\" r=\"8.35\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"/><line data-icon-part=\"hour\" x1=\"12\" y1=\"12\" x2=\"16\" y2=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"/><line data-icon-part=\"minute\" x1=\"12\" y1=\"12.35\" x2=\"12\" y2=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".7\"/>"};
var KEEP=["handshake","person-search","project-controls","schedule-outline"];
var LEGACY_CSS="[data-icon-part=\"minute\"], [data-icon-part=\"hour\"] { transform-origin: 12px 12px; animation: stagger-spin 8s linear infinite; }\n[data-icon-part=\"hour\"] { animation-duration: 96s; }\n@keyframes stagger-spin { to { rotate: 360deg; } }\n\n[data-icon-part=\"line\"] { stroke-dasharray: 1.02 2; stroke-dashoffset: 0; transition: stroke-dashoffset 1s cubic-bezier(.45,0,.2,1) calc(var(--stagger-delay, 0s) + .3s); }\n[data-icon-part=\"arrow\"] { transition: opacity .3s ease calc(var(--stagger-delay, 0s) + 1.15s); animation: stagger-nudge 5s ease-in-out calc(var(--stagger-delay, 0s) + 2.4s) infinite; }\n[data-icon-part=\"cross\"] { transform-origin: var(--o); transition: scale .5s cubic-bezier(.22,1,.36,1) calc(var(--stagger-delay, 0s) + var(--cd)), opacity .3s ease calc(var(--stagger-delay, 0s) + var(--cd)); animation: stagger-turn 5s cubic-bezier(.65,0,.35,1) calc(var(--stagger-delay, 0s) + 2s + var(--cd)) infinite; }\n@keyframes stagger-turn { 0% { rotate: 0deg; } 14%, 100% { rotate: 180deg; } }\n@keyframes stagger-nudge { 0%, 16%, 100% { translate: 0 0; } 8% { translate: .9px 0; } }\n\n[data-icon-part=\"loupe\"] { transform-origin: 16.5px 16.5px; animation: stagger-search 3.6s ease-in-out infinite; }\n@keyframes stagger-search {\n  0%, 100% { transform: translate(0, 0) rotate(0deg); }\n  25% { transform: translate(-.9px, -.5px) rotate(-10deg); }\n  50% { transform: translate(0, -.9px) rotate(0deg); }\n  75% { transform: translate(.9px, -.5px) rotate(10deg); }\n}\n[data-icon-part=\"shield\"] { transform-origin: 17.6px 16.7px; animation: stagger-breath 2.8s ease-in-out infinite; }\n[data-icon-part=\"tick\"], [data-icon-part=\"row\"] { stroke-dasharray: 1.02 2; animation: stagger-draw 3.2s cubic-bezier(.45,0,.2,1) var(--rd, 0s) infinite backwards; }\n[data-icon-part=\"row\"] { animation-duration: 4s; }\n[data-icon-part=\"shake\"] { transform-origin: 12px 12px; animation: stagger-shake 3.6s ease-in-out infinite; }\n[data-icon-part=\"out\"] { animation: stagger-out 2.8s ease-in-out infinite; }\n@keyframes stagger-breath { 0%, 100% { scale: 1; } 50% { scale: 1.12; } }\n@keyframes stagger-draw { 0% { stroke-dashoffset: 1.03; opacity: 1; } 22% { stroke-dashoffset: 0; } 80% { stroke-dashoffset: 0; opacity: 1; } 94% { stroke-dashoffset: 0; opacity: 0; } 95%, 100% { stroke-dashoffset: 1.03; opacity: 0; } }\n@keyframes stagger-shake { 0%, 32%, 100% { rotate: 0deg; } 8% { rotate: -6deg; } 16% { rotate: 5deg; } 24% { rotate: -3deg; } }\n@keyframes stagger-out { 0%, 100% { translate: 0 0; } 50% { translate: .8px -.8px; } }\n";
var SEL='.card_primary_icon>.icon_set_wrap';
var cache={},n=0;
function load(url){return cache[url]||(cache[url]=fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
  var vb=(t.match(/viewBox="([^"]+)"/)||[])[1]||'0 0 24 24',tr=(t.match(/<g transform="([^"]+)"/)||[])[1]||'';
  var ds=[];t.replace(/<path[^>]*\sd="([^"]+)"/g,function(m,x){ds.push(x)});
  return {vb:vb,tr:tr,parts:[].concat.apply([],ds.map(parts))};
}))}
function urlOf(el){
  /* The Stagger Cards script may already have swapped this icon (data-icon-motion removes the mask): read the mask with it off for a moment. */
  var mo=el.getAttribute('data-icon-motion');if(mo!==null)el.removeAttribute('data-icon-motion');
  var cs=getComputedStyle(el),m=/url\(["']?([^"')]+\.svg)["']?\)/.exec(cs.webkitMaskImage||cs.maskImage||'');
  if(mo!==null)el.setAttribute('data-icon-motion',mo);return m&&m[1]}
var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.toggleAttribute('data-icon-run',e.isIntersecting)})},{rootMargin:'0px 0px -8% 0px'});
var tries=0;
function init(){
  /* Wait until the Stagger Cards script has set up its sections (it runs on DOMContentLoaded), at most 2 s. */
  if(tries++<40&&(d.readyState==='loading'||[].some.call(d.querySelectorAll('[data-stagger-cards]'),function(s){return s.querySelector('.stagger-cards_list > * > *')&&!s.hasAttribute('data-stagger-motion')}))){setTimeout(init,50);return}
  var els=[].filter.call(d.querySelectorAll(SEL),function(el){var v=el.getAttribute('data-wf--icon-set--variant');
    /* The four icons the owner kept as they are stay with the Stagger Cards script inside its sections. */
    return v&&!(el.hasAttribute('data-icon-motion')&&KEEP.indexOf(v)>-1)});
  if(!els.length)return;
  var PARTS={},jobs=[];
  els.forEach(function(el){var v=el.getAttribute('data-wf--icon-set--variant'),u=urlOf(el);
    if(u&&!PARTS[v])jobs.push(load(u).then(function(p){PARTS[v]=p}).catch(function(){}))});
  Promise.all(jobs).then(function(){
    var none={vb:'0 0 24 24',tr:'',parts:[]};
    var P=new Proxy(PARTS,{get:function(o,k){var x=o[k]||none;return {vb:x.vb,tr:x.tr,parts:new Proxy(x.parts,{get:function(a,i){return i in a?a[i]:(i==='length'?a.length:(typeof a[i]==='function'?a[i].bind(a):{d:'',box:[0,0,0,0]}))}})}}});
    var SPEC=build(P,LEGACY),st=d.createElement('style');
    st.textContent=LEGACY_CSS+Object.keys(SPEC).map(function(k){return SPEC[k].css}).join('\n');d.head.appendChild(st);
    els.forEach(function(el){
      var v=el.getAttribute('data-wf--icon-set--variant'),sp=SPEC[v],pv=PARTS[v];
      if(!sp||(!sp.legacy&&!pv))return;
      var id=++n,svg=sp.legacy?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+sp.svg+'</svg>':
        '<svg viewBox="'+pv.vb+'" fill="currentColor" aria-hidden="true" focusable="false"><g'+(pv.tr?' transform="'+pv.tr+'"':'')+'>'+sp.svg+'</g></svg>';
      svg=svg.replace(/id="([^"]+)"/g,'id="$1-'+id+'"').replace(/url\(#([^)]+)\)/g,'url(#$1-'+id+')');
      el.removeAttribute('data-icon-motion');el.innerHTML=svg;el.setAttribute('data-icon',v);
      if(sp.legacy)el.setAttribute('data-icon-legacy','');
      io.observe(el);
    });
  });
}
/* One tick after DOMContentLoaded, so the Stagger Cards script has set up its icons first. */
var start=function(){setTimeout(init,0)};
d.readyState==='loading'?d.addEventListener('DOMContentLoaded',start):start();
})();
