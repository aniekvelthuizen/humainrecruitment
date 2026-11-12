// Logo Marquee check (headless Chrome, Node 22+). node references/marquee-check.mjs [url]; env PATCH=1 swaps in references/embeds/logo-marquee.html, FREEZE=ms freezes the tab mid-load, W=width, RUNS=n.
// Prints per second: list count, first list x and width, and maxGap = largest gap or overlap between neighbouring lists (must be 0).
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const url=process.argv[2]||'https://humain-dev.webflow.io/how-it-works';
const port=9300+Math.floor(Math.random()*500);
const profile=fs.mkdtempSync(path.join(process.env.TMPDIR||'/tmp','mq-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--hide-scrollbars','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let tabs;
for(let i=0;i<60&&!tabs;i++){try{tabs=await(await fetch(`http://127.0.0.1:${port}/json`)).json()}catch{await sleep(250)}}
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pending={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending[m.id]){pending[m.id](m);delete pending[m.id]}};
const send=(method,params={})=>new Promise(r=>{const i=++id;pending[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
const ev=async e=>{const r=await send('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});return r.result?.result?.value??r.result};
await send('Page.enable');await send('Network.enable');
const R='/Users/aniek/Projecten/HumAIn Recruitment/references/embeds/';
const src=fs.readFileSync(R+'logo-marquee.html','utf8');const newCss=src.match(/<style>([\s\S]*?)<\/style>/)[1];
const newJs=src.match(/<script>([\s\S]*?)<\/script>/)[1];
let patched=0;
if(process.env.PATCH){await send('Fetch.enable',{patterns:[{urlPattern:url,requestStage:'Response'}]});
ws.addEventListener('message',async e=>{const m=JSON.parse(e.data);if(m.method!=='Fetch.requestPaused')return;
 const b=await send('Fetch.getResponseBody',{requestId:m.params.requestId});let h=b.result.base64Encoded?Buffer.from(b.result.body,'base64').toString():b.result.body;
 const before=h;
 h=h.replace(/<style>\s*@keyframes logo-marquee[\s\S]*?<\/style>/,'<style>'+newCss+'</style>');
 h=h.replace(/<script>\s*\(function\(\)\{\s*function sync[\s\S]*?<\/script>/,'<script>'+newJs+'</script>');
 patched=(h.match(/logo-marquee-belt/g)||[]).length;
 await send('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'text/html; charset=utf-8'}],body:Buffer.from(h).toString('base64')});});}
await send('Emulation.setDeviceMetricsOverride',{width:+(process.env.W||1512),height:900,deviceScaleFactor:1,mobile:false});
const snap=`(()=>{const t=document.querySelector('[data-logo-marquee-track]');if(!t)return 'no track';const L=[...t.querySelectorAll('[data-logo-marquee-list]')].map(l=>l.getBoundingClientRect());let gap=0;for(let i=1;i<L.length;i++)gap=Math.max(gap,Math.abs(L[i].left-L[i-1].right));return {n:L.length,x0:Math.round(L[0].left),w0:Math.round(L[0].width),maxGap:+gap.toFixed(1),belt:!!t.querySelector('[data-logo-marquee-belt]')}})()`;
const runs=+(process.env.RUNS||4);
for(let r=0;r<runs;r++){
  const mode=process.env.MODE||['none','slow','cpu','slow+cpu'][r%4];
  await send('Network.clearBrowserCache');
  await send('Network.emulateNetworkConditions',mode.includes('slow')?{offline:false,latency:300,downloadThroughput:200000,uploadThroughput:50000}:{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await send('Emulation.setCPUThrottlingRate',{rate:mode.includes('cpu')?6:1});
  send('Page.navigate',{url});
  if(process.env.FREEZE){await sleep(+process.env.FREEZE);await send('Page.setWebLifecycleState',{state:'frozen'});await sleep(4000);await send('Page.setWebLifecycleState',{state:'active'});}
  const log=[];
  for(let k=0;k<6;k++){await sleep(1000);try{log.push(await ev(snap))}catch(e){log.push('err')}}
  console.log('RUN',r,mode,'patched',patched);log.forEach((s,k)=>console.log(k+1+'s',JSON.stringify(s)));
}
chrome.kill();
