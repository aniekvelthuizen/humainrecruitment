// Headless check of the HumAIn footer on a published page (Node 22+, Chrome, no dependencies).
//   node references/footer-check.mjs <url> [outdir]
// Per width: positions relative to the footer top (text boxes are trimmed to cap height / baseline, so they compare
// with Figma's cap-top and baseline), the accordion on small screens (tap opens, tap closes, aria-expanded, links
// hidden while closed), the hover underline, horizontal overflow, console errors, and a screenshot of the footer.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const url = process.argv[2];
const out = process.argv[3] || './footer-out';
fs.mkdirSync(out, { recursive: true });
const chromePath = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'hfoot-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 60 && !tabs; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = {}; const errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result; };
const mouse = async (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
const click = async (x, y) => { await mouse(x, y); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }); };

await send('Runtime.enable'); await send('Page.enable');
const report = {};
const measure = `(() => {
  const f = document.querySelector('.footer_wrap'); const fb = f.getBoundingClientRect();
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y - fb.y), Math.round(b.width), Math.round(b.height)]; };
  const all = (sel) => [...f.querySelectorAll(sel)];
  const groups = all('.footer_group_wrap').map((g) => ({
    title: r(g.querySelector('.footer_group_title')),
    toggle: getComputedStyle(g.querySelector('.footer_group_toggle')).display,
    links: [...g.querySelectorAll('.footer_link_text')].map((t) => [t.textContent, ...r(t), t.closest('a').getAttribute('href')]),
    drawer: r(g.querySelector('.footer_group_drawer')),
    row: r(g),
  }));
  const cs = getComputedStyle(f);
  return {
    footer: [Math.round(fb.width), Math.round(fb.height)], bg: cs.backgroundImage.slice(0, 120), color: cs.color,
    contentTitle: r(f.querySelector('.footer_content .u-text-style-h6')), contentText: r(f.querySelector('.footer_content .u-text-style-large')),
    groups,
    lastRow: r([...f.querySelectorAll('.footer_group_wrap')].pop()),
    divider: r(f.querySelector('.footer_bottom_layout')), dividerColor: getComputedStyle(f.querySelector('.footer_bottom_layout')).borderTopColor,
    copyright: [f.querySelector('.footer_bottom_text').textContent, ...r(f.querySelector('.footer_bottom_text'))],
    bottomLinks: all('.footer_bottom_list .footer_link_text').map((t) => [t.textContent, ...r(t), t.closest('a').getAttribute('href')]),
    linkedin: [...r(f.querySelector('.footer_social_link')), ...['aria-label', 'href', 'target', 'rel'].map((a) => f.querySelector('.footer_social_link').getAttribute(a))],
    overflowX: document.documentElement.scrollWidth - innerWidth,
  };
})()`;

for (const w of [1512, 991, 767, 402]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: url + (url.includes('?') ? '&' : '?') + 'w=' + w + '&t=' + Date.now() });
  await sleep(3500);
  const m = await ev(measure);
  // Hover underline on the first column link (desktop only, the drawer is closed on small screens).
  if (w >= 768) {
    const c = await ev(`(() => { const a = document.querySelector('.footer_group_list .footer_link_wrap'); a.scrollIntoView({block:'center'}); const b = a.getBoundingClientRect(); return [b.x + 5, b.y + 4]; })()`);
    await sleep(300); await mouse(c[0], c[1]); await sleep(900);
    m.hoverLine = await ev(`getComputedStyle(document.querySelector('.footer_group_list .footer_link_wrap')).backgroundSize`);
    await mouse(1, 1); await sleep(900);
    m.restLine = await ev(`getComputedStyle(document.querySelector('.footer_group_list .footer_link_wrap')).backgroundSize`);
  } else {
    const t = await ev(`(() => { const b = document.querySelectorAll('.footer_group_toggle')[0]; b.scrollIntoView({block:'center'}); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`);
    await sleep(300);
    const state = `(() => { const g = document.querySelectorAll('.footer_group_wrap')[0]; const l = g.querySelector('.footer_group_list'); return { open: g.hasAttribute('data-footer-open'), expanded: g.querySelector('.footer_group_toggle').getAttribute('aria-expanded'), drawer: Math.round(g.querySelector('.footer_group_drawer').getBoundingClientRect().height), visibility: getComputedStyle(l).visibility, firstLinkFocusable: l.querySelector('a').getClientRects().length > 0 && getComputedStyle(l).visibility !== 'hidden', label: document.getElementById(g.querySelector('.footer_group_toggle').getAttribute('aria-labelledby'))?.textContent }; })()`;
    m.closed = await ev(state);
    await click(t[0], t[1]); await sleep(700);
    m.opened = await ev(state);
    m.openedLinks = await ev(`[...document.querySelectorAll('.footer_group_wrap')[0].querySelectorAll('.footer_link_text')].map((t) => { const b = t.getBoundingClientRect(); const g = document.querySelectorAll('.footer_group_wrap')[0].getBoundingClientRect(); return [t.textContent, Math.round(b.x), Math.round(b.y - g.y), Math.round(b.height)]; })`);
    await click(t[0], t[1]); await sleep(700);
    m.reclosed = await ev(state);
  }
  // Screenshot of the whole footer.
  const box = await ev(`(() => { const b = document.querySelector('.footer_wrap').getBoundingClientRect(); return [b.x + scrollX, b.y + scrollY, b.width, b.height]; })()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: box[0], y: box[1], width: box[2], height: box[3], scale: 1 } });
  fs.writeFileSync(path.join(out, `footer-${w}.png`), Buffer.from(shot.result.data, 'base64'));
  report[w] = m;
}
report.errors = errors;
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
