// Builds the site embed (references/embeds/icon-motion.html) from the same split + spec code as the preview page.
//   node docs/icon-motion/src/gen-embed.mjs
import fs from 'node:fs';
const here = (p) => new URL(p, import.meta.url);
const strip = (s) => s.replace(/^export /gm, '').replace(/^import [^\n]*\n/gm, '').replace(/^\s*\/\/[^\n]*\n/gm, '');
const split = strip(fs.readFileSync(here('./split.mjs'), 'utf8')).replace(/function flagsFix[\s\S]*?return d;}\n/, '').replace(/  const pts=\[\];\n/, '').replace(/  const test=[^\n]*\n/, '');
const spec = strip(fs.readFileSync(here('./motion-spec.mjs'), 'utf8')).replace(/  const views = [^\n]*\n/, '').replace(/    const side = [^\n]*\n/, '');
const stagger = fs.readFileSync(here('../../../references/embeds/stagger-cards-motion-script.html'), 'utf8').split('\n');
const KEEP = ['handshake', 'person-search', 'project-controls', 'schedule-outline'];
const S = ' fill="none" stroke="currentColor" stroke-width=".7"';
const ICONS = eval('(' + stagger.slice(9, 42).join('\n').replace(/^\s*var ICONS = /, '').replace(/;\s*$/, '') + ')');
const staggerStyle = fs.readFileSync(here('../../../references/embeds/stagger-cards-motion-style.html'), 'utf8');
const legacyCss = staggerStyle.match(/\/\* Clock:[\s\S]*?(?=<\/style>)/)[0].replace(/\[data-stagger-motion="ready"\][^\n]*\n/g, '').replace(/\/\*[^*]*\*\/\n?/g, '');
const out = `<style>
/* Card icon motion (decisions/motion.md, 2026-11-12): every Card Primary icon gets its own loop, agreed per icon with the owner.
   Runtime only: the Designer, reduced motion and a failed script show the plain mask icon. Source: docs/icon-motion/src/. */
[data-icon]{-webkit-mask:none!important;mask:none!important;background:none!important}
[data-icon]>svg{display:block;width:100%;height:100%;overflow:visible}
[data-icon] svg *{transform-box:fill-box}
[data-icon-legacy] svg *{transform-box:view-box}
[data-icon]:not([data-icon-run]) svg *{animation-play-state:paused!important}
</style>
<script>
(function(){
var d=document,h=d.documentElement;
if(window.cardIconMotion)return;window.cardIconMotion=1;
if(h.classList.contains('wf-design-mode')||!('IntersectionObserver' in window)||!window.fetch||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
${split.replace(/const inside=/, 'var inside=')}
${spec}
var LEGACY=${JSON.stringify(Object.fromEntries(KEEP.map((v) => [v, ICONS[v]])))};
var KEEP=${JSON.stringify(KEEP)};
var LEGACY_CSS=${JSON.stringify(legacyCss)};
var SEL='.card_primary_icon>.icon_set_wrap';
var cache={},n=0;
function load(url){return cache[url]||(cache[url]=fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
  var vb=(t.match(/viewBox="([^"]+)"/)||[])[1]||'0 0 24 24',tr=(t.match(/<g transform="([^"]+)"/)||[])[1]||'';
  var ds=[];t.replace(/<path[^>]*\\sd="([^"]+)"/g,function(m,x){ds.push(x)});
  return {vb:vb,tr:tr,parts:[].concat.apply([],ds.map(parts))};
}))}
function urlOf(el){
  /* The Stagger Cards script may already have swapped this icon (data-icon-motion removes the mask): read the mask with it off for a moment. */
  var mo=el.getAttribute('data-icon-motion');if(mo!==null)el.removeAttribute('data-icon-motion');
  var cs=getComputedStyle(el),m=/url\\(["']?([^"')]+\\.svg)["']?\\)/.exec(cs.webkitMaskImage||cs.maskImage||'');
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
    st.textContent=LEGACY_CSS+Object.keys(SPEC).map(function(k){return SPEC[k].css}).join('\\n');d.head.appendChild(st);
    els.forEach(function(el){
      var v=el.getAttribute('data-wf--icon-set--variant'),sp=SPEC[v],pv=PARTS[v];
      if(!sp||(!sp.legacy&&!pv))return;
      var id=++n,svg=sp.legacy?'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+sp.svg+'</svg>':
        '<svg viewBox="'+pv.vb+'" fill="currentColor" aria-hidden="true" focusable="false"><g'+(pv.tr?' transform="'+pv.tr+'"':'')+'>'+sp.svg+'</g></svg>';
      svg=svg.replace(/id="([^"]+)"/g,'id="$1-'+id+'"').replace(/url\\(#([^)]+)\\)/g,'url(#$1-'+id+')');
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
</script>
`;
const js = out.match(/<script>\n([\s\S]*?)<\/script>/)[1];
const css = out.match(/<style>[\s\S]*?<\/style>/)[0];
fs.writeFileSync(here('../../../references/embeds/icon-motion.js'), js);
const ref = process.argv[2], sri = ref && 'sha384-' + (await import('node:crypto')).createHash('sha384').update(js).digest('base64');
fs.writeFileSync(here('../../../references/embeds/icon-motion.html'), css + '\n' + (ref ? `<script defer src="https://cdn.jsdelivr.net/gh/aniekvelthuizen/humainrecruitment@${ref}/references/embeds/icon-motion.js" integrity="${sri}" crossorigin="anonymous"></script>\n` : '<!-- script: run gen-embed.mjs <commit> after committing icon-motion.js -->\n'));
console.log('js chars', js.length, ref ? 'ref ' + ref + ' ' + sri : '');
