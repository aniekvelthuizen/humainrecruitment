// Compare two cards measured by card-check.mjs (same or different runs).
//   node references/card-diff.mjs <cards-A.json> <indexA> <cards-B.json> <indexB> [tolerance px = 1]
// Parts are matched by normalised class + occurrence. Prints every box that moved more than the tolerance,
// every style that differs (rest and hover), and parts that exist on one side only. Exit code 1 on a difference.
import fs from 'node:fs';

const [fa, ia, fb, ib, tol = '1'] = process.argv.slice(2);
const A = JSON.parse(fs.readFileSync(fa)).cards[+ia];
const B = JSON.parse(fs.readFileSync(fb)).cards[+ib];
const t = +tol;
const keyed = (parts = []) => { const seen = {}; const m = new Map();
  for (const p of parts) { seen[p.k] = (seen[p.k] || 0) + 1; m.set(`${p.k}#${seen[p.k]}`, p); } return m; };
let diffs = 0;
const say = (s) => { diffs++; console.log(s); };
const cmp = (label, pa, pb) => {
  const a = keyed(pa), b = keyed(pb);
  for (const [k, x] of a) {
    const y = b.get(k);
    if (!y) { say(`${label} only in A: ${k} ${x.r}`); continue; }
    if (x.r.some((v, i) => Math.abs(v - y.r[i]) > t)) say(`${label} box ${k}: ${x.r} → ${y.r}`);
    for (const s of Object.keys(x.s)) if (x.s[s] !== y.s[s]) say(`${label} ${k} ${s}: ${x.s[s]} → ${y.s[s]}`);
  }
  for (const k of b.keys()) if (!a.has(k)) say(`${label} only in B: ${k} ${b.get(k).r}`);
};
console.log(`A: ${A.cls} ${A.r} els ${A.els} bytes ${A.bytes}\nB: ${B.cls} ${B.r} els ${B.els} bytes ${B.bytes}`);
if (Math.abs(A.r[2] - B.r[2]) > t || Math.abs(A.r[3] - B.r[3]) > t) say(`size ${A.r[2]}×${A.r[3]} → ${B.r[2]}×${B.r[3]}`);
if (A.text !== B.text) say(`text differs:\n  A ${A.text}\n  B ${B.text}`);
cmp('rest', A.parts, B.parts);
cmp('hover', A.hover, B.hover);
console.log(diffs ? `${diffs} difference(s)` : 'identical within tolerance');
process.exit(diffs ? 1 : 0);
