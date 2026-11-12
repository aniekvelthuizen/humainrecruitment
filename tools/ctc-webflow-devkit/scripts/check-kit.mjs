#!/usr/bin/env node
// Kit check (CONTRIBUTING.md). Run from the repo root: node scripts/check-kit.mjs [--base <git ref>]
// Fails on: dead links, "file.md §N" references to a section that does not exist, kit files changed without a version bump.
// Warns on: client names in rule text, the same sentence in more than one file, growth of the kit's text.
import { readFileSync, readdirSync, lstatSync, existsSync } from 'node:fs';
import { join, dirname, normalize, relative, basename } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const baseArg = args.includes('--base') ? args[args.indexOf('--base') + 1] : null;
const config = JSON.parse(readFileSync(join(root, 'scripts/kit-check.json'), 'utf8'));
const errors = [], warnings = [];

const SKIP = new Set(['.git', 'node_modules', '.github']);
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) continue; // .agents/skills → skills (Codex)
    if (st.isDirectory()) walk(p, out); else if (name.endsWith('.md')) out.push(relative(root, p));
  }
  return out;
}
const files = walk(root).filter(f => !config.ignore.some(i => f.startsWith(i)));
const text = Object.fromEntries(files.map(f => [f, readFileSync(f, 'utf8')]));
const lineOf = (s, i) => s.slice(0, i).split('\n').length;
const resolve = (from, target) => target.includes('${CLAUDE_PLUGIN_ROOT}/')
  ? normalize(target.split('${CLAUDE_PLUGIN_ROOT}/')[1])
  : normalize(join(dirname(from), target));

// 1. Dead links and 2. section references
const sectionsOf = (f) => {
  const s = existsSync(f) ? readFileSync(f, 'utf8') : '';
  return new Set([...s.matchAll(/^#{1,4}\s+(?:§\s*)?(\d+[a-z]?)[.\s:)]/gm)].map(m => m[1]));
};
for (const [f, s] of Object.entries(text)) {
  const code = s.replace(/```[\s\S]*?```/g, m => m.replace(/[^\n]/g, ' '));
  for (const m of code.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)(\s*§\s*(\d+[a-z]?))?/g)) {
    const t = m[1];
    if (/^(https?:|mailto:)/.test(t)) continue;
    const p = resolve(f, t);
    if (!existsSync(p)) { errors.push(`${f}:${lineOf(s, m.index)} dead link → ${t}`); continue; }
    if (m[4] && p.endsWith('.md') && !sectionsOf(p).has(m[4]))
      errors.push(`${f}:${lineOf(s, m.index)} ${t} §${m[4]}: no such section in ${p}`);
  }
  // bare "name.md §N" (no link): resolve by unique basename
  for (const m of code.matchAll(/(?<![\](/\w])`?([\w-]+\.md)`?\s*§\s*(\d+[a-z]?)/g)) {
    const hits = files.filter(x => basename(x) === m[1]);
    if (hits.length !== 1) continue;
    if (!sectionsOf(hits[0]).has(m[2])) errors.push(`${f}:${lineOf(s, m.index)} ${m[1]} §${m[2]}: no such section`);
  }
}

// 3. Version bump
const git = (c) => execSync(`git ${c}`, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
let base = null;
try { base = baseArg || git('merge-base HEAD origin/main').trim(); } catch { warnings.push('git base not found: version and growth checks skipped'); }
if (base) {
  const changed = [...new Set((git(`diff --name-only ${base}`) + git('ls-files --others --exclude-standard')).split('\n').filter(Boolean))];
  const kitChanged = changed.filter(f => /^(skills|references|agents|hooks)\//.test(f));
  const v = (src) => JSON.parse(src).version;
  const now = v(readFileSync('.claude-plugin/plugin.json', 'utf8'));
  let before = null; try { before = v(git(`show ${base}:.claude-plugin/plugin.json`)); } catch {}
  if (kitChanged.length && before && now === before)
    errors.push(`${kitChanged.length} kit file(s) changed but .claude-plugin/plugin.json is still ${now}: bump the version`);
  // 6. Growth
  let was = 0;
  try { for (const f of git(`ls-tree -r --name-only ${base}`).split('\n')) if (f.endsWith('.md') && !config.ignore.some(i => f.startsWith(i)) && !f.startsWith('.github')) was += Buffer.byteLength(git(`show ${base}:${f}`)); } catch {}
  const is = Object.values(text).reduce((a, s) => a + Buffer.byteLength(s), 0);
  const pct = was ? ((is - was) / was) * 100 : 0;
  const line = `kit text: ${(was / 1024).toFixed(0)} KB → ${(is / 1024).toFixed(0)} KB (${pct >= 0 ? '+' : ''}${pct.toFixed(1)} %)`;
  (pct > config.maxGrowthPercent ? warnings : []).push(line + ` — more than ${config.maxGrowthPercent} %: could an existing rule absorb this?`);
  console.log(line);
}

// 4. Client names
const names = new RegExp(`\\b(${config.clientNames.join('|')})\\b`, 'g');
for (const [f, s] of Object.entries(text)) {
  if (config.clientNamesAllowedIn.some(a => f.startsWith(a))) continue;
  for (const m of s.matchAll(names)) warnings.push(`${f}:${lineOf(s, m.index)} client name "${m[1]}" in rule text`);
}

// 5. Same sentence in more than one file
const seen = new Map();
for (const [f, s] of Object.entries(text)) {
  for (const raw of s.replace(/```[\s\S]*?```/g, '').split(/(?<=[.!?])\s+|\n/)) {
    const n = raw.toLowerCase().replace(/[`*_\[\]()>#|]/g, '').replace(/\s+/g, ' ').trim();
    if (n.split(' ').length < config.duplicateMinWords) continue;
    if (!seen.has(n)) seen.set(n, new Set());
    seen.get(n).add(f);
  }
}
for (const [n, fs] of seen) if (fs.size > 1) warnings.push(`same sentence in ${[...fs].join(', ')}: "${n.slice(0, 90)}…"`);

for (const w of warnings) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
