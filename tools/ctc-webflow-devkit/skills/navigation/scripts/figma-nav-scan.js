// Read-only. Run through use_figma (load the figma-use guidance first), once per design page.
// Fill in PAGE_ID. Returns: the nav / menu component sets with their variant properties,
// which top-level page frame uses which nav state, and the prototype reactions on every nav variant
// (and its children) and on the open-menu frame(s) — the reactions carry the behaviour (inventory.md §2).

const PAGE_ID = '0:0';                                   // design page id from project.json figma.pages
const SET_NAME = /^(navbar|nav|navigation|header)$/i;    // the nav component set
const MENU_PARTS = /^(menu-option|menu-suboption|toggle-options|menu-toggle|menu-item)$/i; // row sets inside the menu
const MENU_FRAME = /(hamburger|menu|overlay)/i;          // top-level frame(s) with the open menu
const SKIP_FRAMES = /^\[figma-only\]/;

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);

const easing = (e) => !e ? null : e.type === 'CUSTOM_CUBIC_BEZIER'
  ? 'cubic-bezier(' + ['x1', 'y1', 'x2', 'y2'].map((k) => +e.easingFunctionCubicBezier[k].toFixed(2)).join(',') + ')' : e.type;
const reactionsOf = (node) => (node.reactions || []).map((r) => ({
  trigger: r.trigger && (r.trigger.type + (r.trigger.timeout ? ' ' + r.trigger.timeout + 's' : '') + (r.trigger.keyCodes ? ' key ' + r.trigger.keyCodes : '')),
  actions: (r.actions || []).map((a) => ({
    type: a.navigation || a.type, dest: a.destinationId || null,
    transition: a.transition ? { type: a.transition.type, direction: a.transition.direction || null, duration: a.transition.duration, easing: easing(a.transition.easing) } : null,
  })),
}));
const collect = async (root) => {
  const out = [];
  for (const n of [root, ...(root.findAll ? root.findAll(() => true) : [])]) {
    const rs = reactionsOf(n);
    if (rs.length) out.push({ node: n.name, id: n.id, reactions: rs });
  }
  return out;
};
const nameOf = async (id) => { if (!id) return null; const n = await figma.getNodeByIdAsync(id); return n ? n.name : id; };

// 1. sets
const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).filter((s) => SET_NAME.test(s.name) || MENU_PARTS.test(s.name));
const setInfo = [];
for (const s of sets) {
  const variants = [];
  for (const v of s.children) {
    const reactions = await collect(v);
    for (const r of reactions) for (const rr of r.reactions) for (const a of rr.actions) a.destName = await nameOf(a.dest);
    variants.push({ id: v.id, name: v.name, w: Math.round(v.width), h: Math.round(v.height), reactions });
  }
  setInfo.push({ id: s.id, name: s.name, props: Object.fromEntries(Object.entries(s.componentPropertyDefinitions).map(([k, d]) => [k, d.variantOptions || d.type])), variants });
}

// 2. which frame uses which nav state
const navSetIds = new Set(sets.filter((s) => SET_NAME.test(s.name)).map((s) => s.id));
const usage = {};
for (const frame of page.children) {
  if (SKIP_FRAMES.test(frame.name) || !('findAllWithCriteria' in frame)) continue;
  for (const inst of frame.findAllWithCriteria({ types: ['INSTANCE'] })) {
    const mc = await inst.getMainComponentAsync();
    if (!mc || !mc.parent || !navSetIds.has(mc.parent.id)) continue;
    const key = frame.name + ' → ' + mc.name;
    usage[key] = (usage[key] || 0) + 1;
  }
}

// 3. the open-menu frame(s)
const menus = [];
for (const frame of page.children) {
  if (!MENU_FRAME.test(frame.name) || SKIP_FRAMES.test(frame.name) || frame.type !== 'FRAME') continue;
  const videoFills = frame.findAll((n) => Array.isArray(n.fills) && n.fills.some((f) => f.type === 'VIDEO')).map((n) => n.name);
  menus.push({ id: frame.id, name: frame.name, w: Math.round(frame.width), h: Math.round(frame.height), videoFills, reactions: await collect(frame) });
}

return { page: page.name, sets: setInfo, usage, menus };
