// Per-icon motion for the Humain card icons. Each entry builds the inner SVG (in the icon's own viewBox) and its CSS,
// scoped to [data-icon="<variant>"]. Parts come from the original filled icon, cut into separate shapes, so every line keeps
// its original thickness; four icons that are one connected shape are redrawn as .7 strokes on the same grid.
export function build(parts, legacy) {
  const P = (v, i) => parts[v].parts[i].d;
  const outer = (d) => d.split(/(?=M)/)[0];
  const F = (d, a = '') => `<path d="${d}" ${a}/>`;
  const S = 'fill="none" stroke="currentColor" stroke-width=".7"';
  const rest = (v, skip) => parts[v].parts.map((p, i) => skip.includes(i) ? '' : F(p.d)).join('');
  const k = (v) => `[data-icon="${v}"]`;
  const I = {};

  // 01 Assignment: the empty clipboard hops up from below, then the three lines write in. 5 s.
  I['assignment'] = { svg: `<g data-a="board">${F(P('assignment', 0))}</g>${F(P('assignment', 3), 'data-a="l1"')}${F(P('assignment', 2), 'data-a="l2"')}${F(P('assignment', 1), 'data-a="l3"')}`,
    css: `${k('assignment')} [data-a="board"]{animation:as-hop 5s cubic-bezier(.3,0,.2,1) infinite both}
${k('assignment')} [data-a^="l"]{transform-origin:left center;animation:as-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('assignment')} [data-a="l2"]{animation-delay:.15s}${k('assignment')} [data-a="l3"]{animation-delay:.3s}
@keyframes as-hop{0%{translate:0 3px;opacity:0}9%{translate:0 -1.2px;opacity:1}15%{translate:0 .3px}19%{translate:0 0}86%{opacity:1;translate:0 0}94%,100%{opacity:0;translate:0 0}}
@keyframes as-line{0%,20%{scale:0 1;opacity:1}32%{scale:1 1}86%{opacity:1;scale:1 1}94%,100%{opacity:0;scale:1 1}}` };

  // 02 Check Circle: the tick turns one full circle, then rests. 4 s.
  I['check-circle'] = { svg: F(P('check-circle', 1)) + F(P('check-circle', 0), 'data-a="tick"'),
    css: `${k('check-circle')} [data-a="tick"]{transform-origin:center;animation:cc-spin 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes cc-spin{0%,10%{rotate:0deg}40%,100%{rotate:360deg}}` };

  // 04 List Check: dot + line, dot + line, then the tick draws; holds, clears, rebuilds. 5 s.
  I['list-check'] = { clip: true, svg: rest('list-check', [2, 3, 4, 5, 6]) + F(P('list-check', 4), 'data-a="d1"') + F(P('list-check', 6), 'data-a="r1"') + F(P('list-check', 3), 'data-a="d2"') + F(P('list-check', 5), 'data-a="r2"') +
      `<g clip-path="url(#lc-clip)">${F(P('list-check', 2))}</g><clipPath id="lc-clip"><rect data-a="wipe" x="580" y="-340" width="300" height="220"/></clipPath>`,
    css: `${k('list-check')} [data-a^="d"]{transform-origin:center;animation:lc-pop 5s cubic-bezier(.3,1.4,.5,1) infinite both}
${k('list-check')} [data-a^="r"]{transform-origin:left center;animation:lc-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('list-check')} [data-a="r1"]{animation-delay:.3s}${k('list-check')} [data-a="d2"]{animation-delay:.75s}${k('list-check')} [data-a="r2"]{animation-delay:1.05s}
${k('list-check')} [data-a="wipe"]{transform-origin:left center;animation:lc-wipe 5s cubic-bezier(.45,0,.2,1) 1.6s infinite both}
@keyframes lc-pop{0%{scale:0;opacity:1}6%{scale:1}74%{opacity:1;scale:1}82%,100%{opacity:0;scale:1}}
@keyframes lc-line{0%{scale:0 1;opacity:1}8%{scale:1 1}74%{opacity:1;scale:1 1}82%,100%{opacity:0;scale:1 1}}
@keyframes lc-wipe{0%{scale:0 1;opacity:1}10%{scale:1 1}52%{opacity:1;scale:1 1}60%,100%{opacity:0;scale:1 1}}` };

  // 05 Outbound: the arrow flies out through the circle and comes back in from the other side. 4 s.
  I['outbound'] = { svg: F(P('outbound', 1)) + `<clipPath id="ob-clip"><circle cx="480" cy="-480" r="318"/></clipPath><g clip-path="url(#ob-clip)">${F(P('outbound', 0), 'data-a="arrow"')}</g>`,
    css: `${k('outbound')} [data-a="arrow"]{animation:ob-fly 4s infinite}
@keyframes ob-fly{0%,30%{translate:0 0;animation-timing-function:cubic-bezier(.5,0,.9,.4)}46%{translate:360px -360px}46.01%{translate:-360px 360px;animation-timing-function:cubic-bezier(.1,.6,.3,1)}64%,100%{translate:0 0}}` };

  // 06 Person Check: the head bobs gently; the tick draws, holds, fades and redraws. 3.2 s.
  I['person-check'] = { svg: F(P('person-check', 2)) + F(P('person-check', 1), 'data-a="head"') + `<g clip-path="url(#pc-clip)">${F(P('person-check', 0))}</g><clipPath id="pc-clip"><rect data-a="wipe" x="12.4" y="-.2" width="8" height="5.8"/></clipPath>`,
    css: `${k('person-check')} [data-a="head"]{animation:pc-head 3.2s ease-in-out infinite}
${k('person-check')} [data-a="wipe"]{transform-origin:left center;animation:pc-wipe 3.2s cubic-bezier(.45,0,.2,1) infinite both}
@keyframes pc-head{0%,100%{translate:0 0;rotate:0deg}25%{translate:.25px -.45px;rotate:6deg}50%{translate:0 0;rotate:0deg}75%{translate:-.25px -.45px;rotate:-6deg}}
@keyframes pc-wipe{0%{scale:0 1;opacity:1}22%{scale:1 1}80%{opacity:1}94%,100%{opacity:0;scale:1 1}}` };

  // 08 Person Shield: the shield breathes and fills in, then empties again. 5.6 s.
  I['person-shield'] = { svg: F(P('person-shield', 0)) + F(P('person-shield', 2)) + `<g data-a="shield">${F(P('person-shield', 1))}${F(outer(P('person-shield', 1)), 'data-a="fill"')}</g>`,
    css: `${k('person-shield')} [data-a="shield"]{transform-origin:center;animation:ps-breath 2.8s ease-in-out infinite}
${k('person-shield')} [data-a="fill"]{animation:ps-fill 5.6s ease-in-out infinite both}
@keyframes ps-breath{0%,100%{scale:1}50%{scale:1.12}}
@keyframes ps-fill{0%,15%{opacity:0}35%,65%{opacity:1}85%,100%{opacity:0}}` };

  // 11 Action Key: the three circles move together and back; the loupe sways as if it is searching. 4 s / 3.6 s.
  I['action-key'] = { svg: F(P('action-key', 2), 'data-a="tl"') + F(P('action-key', 3), 'data-a="tr"') + F(P('action-key', 1), 'data-a="bl"') + F(P('action-key', 0), 'data-a="loupe"'),
    css: `${k('action-key')} [data-a="tl"]{--x:1.1px;--y:1.1px}${k('action-key')} [data-a="tr"]{--x:-2.2px;--y:1.1px}${k('action-key')} [data-a="bl"]{--x:1.1px;--y:-2.2px}
${k('action-key')} [data-a="tl"],${k('action-key')} [data-a="tr"],${k('action-key')} [data-a="bl"]{animation:ak-gather 4s cubic-bezier(.65,0,.35,1) infinite}
${k('action-key')} [data-a="loupe"]{transform-origin:38% 38%;animation:ak-search 3.6s ease-in-out infinite}
@keyframes ak-gather{0%,12%,88%,100%{translate:0 0}38%,62%{translate:var(--x) var(--y)}}
@keyframes ak-search{0%,100%{translate:0 0;rotate:0deg}25%{translate:-.5px -.3px;rotate:-9deg}50%{translate:0 -.5px;rotate:0deg}75%{translate:.5px -.3px;rotate:9deg}}` };

  // 12 Analytics: three views of data take turns inside the frame: bars, a pie, a line graph. 9 s.
  const views = (v, a, b, c) => `${a}${b}${c}`;
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

  // 16 Chart: same idea as Analytics, with bars, horizontal bars and a ring chart. 9 s.
  I['chart'] = { svg: F(P('chart', 3)) + `<g data-a="v1">${F(P('chart', 0), 'data-a="bar"')}${F(P('chart', 1), 'data-a="bar"')}${F(P('chart', 2), 'data-a="bar"')}</g>` +
      `<g data-a="v2" ${S}><path data-a="hb" d="M7.6 9H16.4"/><path data-a="hb" d="M7.6 12H13.4"/><path data-a="hb" d="M7.6 15H11"/></g>` +
      `<circle data-a="v3" cx="12" cy="12" r="3.6" pathLength="1" ${S} stroke-dasharray=".34 .04 .26 .04 .28 .04"/>`,
    css: `${k('chart')} [data-a="bar"]{transform-origin:center bottom;animation:an-bars 9s cubic-bezier(.3,0,.2,1) infinite both}
${k('chart')} [data-a="v1"]{animation:an-out 9s infinite both}
${k('chart')} [data-a="v2"]{animation:an-out 9s 3s infinite both}
${k('chart')} [data-a="hb"]{transform-origin:left center;animation:ch-hbar 9s cubic-bezier(.3,0,.2,1) 3s infinite both}
${k('chart')} [data-a="v3"]{transform-origin:center;animation:an-pie 9s cubic-bezier(.3,0,.2,1) 6s infinite both}
@keyframes ch-hbar{0%{scale:0 1}6%,100%{scale:1 1}}` };

  // 13 Average Time: a pulse line runs through the dial; now and then the button on top is pressed. 3 s / 4 s.
  const pat = (o) => [[0, 0], [3.15, 0], [5, 3.6], [8.85, -4.05], [10.85, 0], [14, 0]].map(([x, y]) => `${x + o} ${13 + y}`).join(' L');
  I['average-time'] = { svg: `<circle cx="12" cy="13" r="7.35" ${S}/><path d="M17.55 8L18.8 6.75" ${S}/>${F(P('average-time', 4), 'data-a="btn"')}` +
      `<clipPath id="at-clip"><circle cx="12" cy="13" r="7"/></clipPath><g clip-path="url(#at-clip)"><path data-a="pulse" ${S} stroke-linejoin="miter" d="M${pat(-9)} L${pat(5)} L${pat(19)}"/></g>`,
    css: `${k('average-time')} [data-a="pulse"]{animation:at-run 3s linear infinite}
${k('average-time')} [data-a="btn"]{animation:at-press 4s ease-in-out infinite}
@keyframes at-run{from{translate:0 0}to{translate:-14px 0}}
@keyframes at-press{0%,70%,82%,100%{translate:0 0}74%,78%{translate:0 .55px}}` };

  // 14 Calendar: a new date slides into the calendar every 2.5 s. 10 s.
  const nums = ['12', '24', '3', '18'];
  I['calendar'] = { svg: F(P('calendar', 0)) + `<clipPath id="cal-clip"><rect x="5" y="10.8" width="14" height="9.2"/></clipPath><g clip-path="url(#cal-clip)" fill="currentColor">${nums.map((n, i) => `<text data-a="n" style="animation-delay:${i * 2.5}s" x="12" y="15.55" text-anchor="middle" dominant-baseline="central" font-size="5.4" font-weight="300">${n}</text>`).join('')}</g>`,
    css: `${k('calendar')} [data-a="n"]{font-family:var(--icon-font,inherit);animation:cal-n 10s cubic-bezier(.3,0,.2,1) infinite both}
@keyframes cal-n{0%{opacity:0;translate:0 3px}5%{opacity:1;translate:0 0}22%{opacity:1;translate:0 0}27%,100%{opacity:0;translate:0 -3px}}` };

  // 15 Call Log: the phone rings (a short wobble), the three lines come and go. 3.2 s.
  I['call-log'] = { svg: F(P('call-log', 3), 'data-a="phone"') + F(P('call-log', 2), 'data-a="w1"') + F(P('call-log', 1), 'data-a="w2"') + F(P('call-log', 0), 'data-a="w3"'),
    css: `${k('call-log')} [data-a="phone"]{transform-origin:center;animation:cl-ring 3.2s ease-in-out infinite}
${k('call-log')} [data-a^="w"]{transform-origin:left center;animation:cl-line 3.2s cubic-bezier(.45,0,.2,1) infinite both}
${k('call-log')} [data-a="w2"]{animation-delay:.12s}${k('call-log')} [data-a="w3"]{animation-delay:.24s}
@keyframes cl-ring{0%,40%,100%{rotate:0deg}5%{rotate:-8deg}10%{rotate:7deg}15%{rotate:-6deg}20%{rotate:5deg}25%{rotate:-3deg}30%{rotate:0deg}}
@keyframes cl-line{0%{scale:0 1}14%,62%{scale:1 1;transform-origin:left center}63%{transform-origin:right center}76%,100%{scale:0 1;transform-origin:right center}}` };

  // 17 Computer: two windows open on the screen, the mouse comes in and clicks. 6 s.
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

  // 18 CV Submission: only the three lines come and go. 4 s.
  I['cv-submission'] = { svg: rest('cv-submission', [3, 4, 5]) + F(P('cv-submission', 3), 'data-a="r1"') + F(P('cv-submission', 4), 'data-a="r2"') + F(P('cv-submission', 5), 'data-a="r3"'),
    css: `${k('cv-submission')} [data-a^="r"]{transform-origin:left center;animation:cl-line 4s cubic-bezier(.45,0,.2,1) infinite both}
${k('cv-submission')} [data-a="r2"]{animation-delay:.15s}${k('cv-submission')} [data-a="r3"]{animation-delay:.3s}` };

  // 19 Dashboard: the tiles trade sizes — the square becomes the wide one and back. 6 s. Each tile is drawn as four bars,
  // so a tile can change width while its lines stay .7 thick.
  const tile = (name, x, y, w, h, grow, anchor) => {
    const side = anchor === 'left' ? 'right' : 'left';
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

  // 20 Euro: a little wobble and swell, as if it was just earned. 3.6 s.
  I['euro'] = { svg: F(P('euro', 0), 'data-a="euro"'),
    css: `${k('euro')} [data-a="euro"]{transform-origin:center;animation:eu-earn 3.6s ease-in-out infinite}
@keyframes eu-earn{0%,40%,100%{rotate:0deg;scale:1}8%{rotate:-10deg;scale:1.12}16%{rotate:8deg;scale:1.12}24%{rotate:-5deg;scale:1.06}32%{rotate:2deg;scale:1.02}}` };

  // 21 Fact Check: the lines come and go, the tick draws and gives a small wobble. 5 s.
  I['fact-check'] = { svg: F(P('fact-check', 0)) + F(P('fact-check', 4), 'data-a="r1"') + F(P('fact-check', 3), 'data-a="r2"') + F(P('fact-check', 1), 'data-a="r3"') +
      `<g data-a="tick"><g clip-path="url(#fc-clip)">${F(P('fact-check', 2))}</g></g><clipPath id="fc-clip"><rect data-a="wipe" x="12.5" y="9.4" width="6.4" height="4.9"/></clipPath>`,
    css: `${k('fact-check')} [data-a^="r"]{transform-origin:left center;animation:cl-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('fact-check')} [data-a="r2"]{animation-delay:.15s}${k('fact-check')} [data-a="r3"]{animation-delay:.3s}
${k('fact-check')} [data-a="wipe"]{transform-origin:left center;animation:tk-wipe 5s cubic-bezier(.45,0,.2,1) .6s infinite both}
${k('fact-check')} [data-a="tick"]{transform-origin:center;animation:tk-wobble 5s ease-in-out .6s infinite both}
@keyframes tk-wipe{0%{scale:0 1;opacity:1}12%{scale:1 1}62%{opacity:1;scale:1 1}70%,100%{opacity:0;scale:1 1}}
@keyframes tk-wobble{0%,14%,34%,100%{rotate:0deg;scale:1}19%{rotate:-10deg;scale:1.12}25%{rotate:7deg;scale:1.08}30%{rotate:-3deg;scale:1}}` };

  // 22 Manage Accounts: the gear turns slowly. 8 s per turn.
  I['manage-accounts'] = { svg: F(P('manage-accounts', 0)) + F(P('manage-accounts', 1)) + F(P('manage-accounts', 2), 'data-a="gear"'),
    css: `${k('manage-accounts')} [data-a="gear"]{transform-origin:center;animation:ma-turn 8s linear infinite}
@keyframes ma-turn{to{rotate:360deg}}` };

  // 23 Monitoring: the bars rise one by one, then the zigzag line draws over them. 5.5 s.
  I['monitoring'] = { svg: [0, 1, 2, 3, 4].map((i) => F(P('monitoring', i), `data-a="bar" style="animation-delay:${i * .1}s"`)).join('') +
      `<g clip-path="url(#mo-clip)">${F(P('monitoring', 5))}</g><clipPath id="mo-clip"><rect data-a="wipe" x="3.4" y="4.3" width="17.4" height="10.4"/></clipPath>`,
    css: `${k('monitoring')} [data-a="bar"]{transform-origin:center bottom;animation:mo-bar 5.5s cubic-bezier(.3,0,.2,1) infinite both}
${k('monitoring')} [data-a="wipe"]{transform-origin:left center;animation:mo-wipe 5.5s cubic-bezier(.45,0,.2,1) .7s infinite both}
@keyframes mo-bar{0%{scale:1 0;opacity:1}9%{scale:1 1}80%{opacity:1;scale:1 1}88%,100%{opacity:0;scale:1 1}}
@keyframes mo-wipe{0%{scale:0 1;opacity:1}17%{scale:1 1}68%{opacity:1;scale:1 1}75%,100%{opacity:0;scale:1 1}}` };

  // 24 Playlist Check: lines come and go, the tick draws and wobbles. 5 s.
  I['playlist-check'] = { svg: F(P('playlist-check', 4)) + F(P('playlist-check', 3), 'data-a="r1"') + F(P('playlist-check', 2), 'data-a="r2"') + F(P('playlist-check', 1), 'data-a="r3"') +
      `<g data-a="tick"><g clip-path="url(#pl-clip)">${F(P('playlist-check', 0))}</g></g><clipPath id="pl-clip"><rect data-a="wipe" x="11.9" y="12.7" width="6.4" height="5"/></clipPath>`,
    css: `${k('playlist-check')} [data-a^="r"]{transform-origin:left center;animation:cl-line 5s cubic-bezier(.45,0,.2,1) infinite both}
${k('playlist-check')} [data-a="r2"]{animation-delay:.15s}${k('playlist-check')} [data-a="r3"]{animation-delay:.3s}
${k('playlist-check')} [data-a="wipe"]{transform-origin:left center;animation:tk-wipe 5s cubic-bezier(.45,0,.2,1) .6s infinite both}
${k('playlist-check')} [data-a="tick"]{transform-origin:center;animation:tk-wobble 5s ease-in-out .6s infinite both}` };

  // 25 Schema: builds from the middle — the centre box, then the three lines, then the other three boxes. 5 s.
  I['schema'] = { svg: `<g ${S}><rect data-a="hub" x="5.5" y="10.5" width="4" height="3"/>` +
      `<path data-a="ln" pathLength="1" d="M7.5 10.15V5.85"/><path data-a="ln" pathLength="1" d="M7.5 13.85V18.15"/><path data-a="ln" pathLength="1" d="M9.85 12H15.15"/>` +
      `<rect data-a="box" style="animation-delay:.9s" x="5.5" y="2.5" width="4" height="3"/><rect data-a="box" style="animation-delay:1s" x="15.5" y="10.5" width="4" height="3"/><rect data-a="box" style="animation-delay:1.1s" x="5.5" y="18.5" width="4" height="3"/></g>`,
    css: `${k('schema')} [data-a="hub"],${k('schema')} [data-a="box"]{transform-origin:center;animation:sc-pop 5s cubic-bezier(.3,1.4,.5,1) infinite both}
${k('schema')} [data-a="ln"]{stroke-dasharray:1.02 2;animation:sc-line 5s cubic-bezier(.45,0,.2,1) .35s infinite both}
@keyframes sc-pop{0%{scale:0;opacity:1}8%{scale:1}82%{opacity:1;scale:1}90%,100%{opacity:0;scale:1}}
@keyframes sc-line{0%{stroke-dashoffset:1.03;opacity:1}10%{stroke-dashoffset:0}75%{opacity:1}83%,100%{opacity:0;stroke-dashoffset:0}}` };

  // 26 Shield Alert: the shield swells and shrinks; every other breath it is filled. 6 s.
  const sa = parts['shield-alert'].parts;
  I['shield-alert'] = { svg: `<g data-a="shield">${F(sa[2].d)}${F(outer(sa[2].d) + sa[0].d + sa[1].d, 'data-a="fill" fill-rule="evenodd"')}<g data-a="mark">${F(sa[0].d)}${F(sa[1].d)}</g></g>`,
    css: `${k('shield-alert')} [data-a="shield"]{transform-origin:center;animation:ps-breath 3s ease-in-out infinite}
${k('shield-alert')} [data-a="fill"]{animation:sa-fill 6s ease-in-out infinite both}
${k('shield-alert')} [data-a="mark"]{animation:sa-mark 6s ease-in-out infinite both}
@keyframes sa-fill{0%,40%{opacity:0}52%,88%{opacity:1}100%{opacity:0}}
@keyframes sa-mark{0%,40%{opacity:1}52%,88%{opacity:0}100%{opacity:1}}` };

  // 27 Sync Check: the arrows turn once, then rest. 4 s.
  I['sync-check'] = { svg: `<g data-a="arrows">${F(P('sync-check', 0))}${F(P('sync-check', 2))}</g>${F(P('sync-check', 1))}`,
    css: `${k('sync-check')} [data-a="arrows"]{transform-box:view-box;transform-origin:12px 12px;animation:sy-turn 4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes sy-turn{0%,15%{rotate:0deg}45%,100%{rotate:360deg}}` };

  // 28 Table: the frame and its lines draw, the cells fill one by one, then it clears and rebuilds. 7 s.
  const cells = [5, 3, 4, 1, 2].map((i, n) => F(outer(parts['table'].parts[0].d.split(/(?=M)/)[i]), `data-a="cell" style="animation-delay:${1 + n * .35}s"`)).join('');
  I['table'] = { svg: `${cells}<g ${S}><rect data-a="frame" pathLength="1" x="4.65" y="4.65" width="14.7" height="14.7" rx="1.15"/><path data-a="ln" pathLength="1" d="M5 8.35H19"/><path data-a="ln" pathLength="1" d="M5 13.875H19"/><path data-a="ln" pathLength="1" d="M12 8.7V19"/></g>`,
    css: `${k('table')} [data-a="frame"]{stroke-dasharray:1.02 2;animation:tb-draw 7s cubic-bezier(.45,0,.2,1) infinite both}
${k('table')} [data-a="ln"]{stroke-dasharray:1.02 2;animation:tb-draw 7s cubic-bezier(.45,0,.2,1) .5s infinite both}
${k('table')} [data-a="cell"]{fill:currentColor;animation:tb-cell 7s ease infinite both}
@keyframes tb-draw{0%{stroke-dashoffset:1.03;opacity:1}10%{stroke-dashoffset:0}86%{opacity:1}93%,100%{opacity:0;stroke-dashoffset:0}}
@keyframes tb-cell{0%{opacity:0}5%,60%{opacity:.25}68%,100%{opacity:0}}` };

  // 03 Handshake, 07 Person Search, 09 Project Controls, 10 Schedule Outline: owner approved, kept as on the site.
  for (const v of ['handshake', 'person-search', 'project-controls', 'schedule-outline']) I[v] = { legacy: true, svg: legacy[v], css: '' };
  return I;
}
