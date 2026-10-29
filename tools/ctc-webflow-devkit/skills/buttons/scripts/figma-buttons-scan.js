// Read-only. Run through use_figma (load the figma-use guidance first), once per design page.
// Fill in PAGE_ID and SETS. Returns one row per distinct look of the button sets on that page,
// with counts, examples, icons, geometry and the backgrounds the look sits on, so the looks can be sorted (inventory.md §3).
// Buttons nested inside another button instance are skipped; hidden instances are skipped.

const PAGE_ID = '0:0';                       // design page id from project.json figma.pages
const SETS = ['button', 'button-branded'];   // component set names to inventory
const SKIP_FRAMES = /^\[figma-only\]/;        // top-level frames to ignore

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);

const setName = async (inst) => {
  const mc = await inst.getMainComponentAsync();
  if (!mc) return null;
  return { mc, set: mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name };
};
const rgb = (p) => p.type === 'SOLID'
  ? [p.color.r, p.color.g, p.color.b].map((v) => Math.round(v * 255)).join(',') + (p.opacity !== 1 ? '@' + p.opacity : '')
  : p.type;

const groups = {};
for (const frame of page.children) {
  if (!('findAllWithCriteria' in frame) || SKIP_FRAMES.test(frame.name)) continue;
  for (const n of frame.findAllWithCriteria({ types: ['INSTANCE'] })) {
    const s = await setName(n);
    if (!s || !SETS.includes(s.set)) continue;
    let p = n.parent, visible = n.visible, nested = false, section = '';
    while (p && p !== frame) {
      if (!p.visible) visible = false;
      if (p.type === 'INSTANCE') { const ps = await setName(p); if (ps && SETS.includes(ps.set)) nested = true; }
      if (p.parent === frame) section = p.name;
      p = p.parent;
    }
    if (!visible || nested) continue;

    const texts = n.findAll((x) => x.type === 'TEXT' && x.visible).map((x) => x.characters);
    const icons = [];
    for (const c of n.findAll((x) => x.type === 'INSTANCE' && x.visible)) {
      const m = await c.getMainComponentAsync();
      if (m) icons.push(m.name.replace(/^type=/, ''));
    }
    // Background behind the instance: nearest ancestor with a visible, mostly opaque solid fill (+ its variable)
    let bg = '-';
    for (let a = n.parent; a && a.type !== 'PAGE'; a = a.parent) {
      const f = ('fills' in a && Array.isArray(a.fills)) ? a.fills.filter((x) => x.visible !== false && x.type === 'SOLID' && (x.opacity ?? 1) > 0.5).pop() : null;
      if (!f) continue;
      const vid = f.boundVariables && f.boundVariables.color && f.boundVariables.color.id;
      const v = vid ? await figma.variables.getVariableByIdAsync(vid) : null;
      bg = (v ? v.name + ' ' : '') + rgb(f);
      break;
    }
    const firstVisible = n.children.find((c) => c.visible);
    const fills = (n.fills || []).filter((f) => f.visible !== false).map(rgb).join('|') || '-';
    const strokes = (n.strokes || []).filter((f) => f.visible !== false).length
      ? `${n.strokeTopWeight}/${n.strokeRightWeight}/${n.strokeBottomWeight}/${n.strokeLeftWeight}` : '-';
    const textNode = n.findOne((x) => x.type === 'TEXT' && x.visible);
    let textStyle = '';
    if (textNode && typeof textNode.textStyleId === 'string' && textNode.textStyleId) {
      const st = await figma.getStyleByIdAsync(textNode.textStyleId); textStyle = st ? st.name : '';
    }
    const look = [
      s.set, s.mc.name,
      'r=' + (n.cornerRadius > 100 ? 'round' : n.cornerRadius),
      'pad=' + [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join('/'),
      'gap=' + n.itemSpacing, 'h=' + Math.round(n.height),
      'fill=' + fills, 'stroke=' + strokes,
      firstVisible && firstVisible.type === 'TEXT' ? 'text-first' : 'icon-first',
      textStyle,
    ].join(' | ');
    const g = groups[look] || (groups[look] = { count: 0, examples: [], icons: new Set(), backgrounds: new Set(), ids: [], sizing: n.layoutSizingHorizontal });
    g.count++;
    g.backgrounds.add(bg);
    if (g.examples.length < 5) g.examples.push(`${frame.name} / ${section}: "${texts.join(' ')}"`);
    icons.forEach((i) => g.icons.add(i));
    if (g.ids.length < 2) g.ids.push(n.id);
  }
}

return Object.entries(groups)
  .sort((a, b) => b[1].count - a[1].count)
  .map(([look, g]) => ({ look, count: g.count, sizing: g.sizing, icons: [...g.icons].join(', '), backgrounds: [...g.backgrounds].join(' · '), examples: g.examples, ids: g.ids }));
