// Webflow Designer recipes — installs window.wfd in the Designer tab.
// Usage (chrome-devtools): pass this whole file as the `function` of evaluate_script once per
// Designer load; then one evaluate_script per queue item, e.g.
//   async () => { await wfd.ready(); return await wfd.bindProp('Text', 'Title'); }
// Every helper returns a short string or object to read back; none takes a snapshot.
// Status per helper: "proven" = the selectors and event sequence worked on PMS (Oct 2026, evidence in
// README.md); "untested" = built from the same selectors but never run as one call. This file itself is a
// clean rewrite of those snippets: until README.md lists a test run, treat every helper as to-be-confirmed.
// A recipe that fails twice: do the item by hand, then fix it here.
() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const rightX = () => innerWidth - 350; // right panel; hard-coded x thresholds broke between window widths
  const frame = () => document.querySelector('iframe#site-iframe-next');
  const doc = () => frame()?.contentDocument;

  // proven — the pointer + mouse sequence the Designer listens to (plain .click() opens nothing on most controls)
  const fire = (el, extra = {}) => {
    const r = el.getBoundingClientRect();
    const o = { bubbles: true, cancelable: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, view: window, pointerId: 1, isPrimary: true, ...extra };
    for (const n of ['pointerover', 'pointerenter', 'mouseover', 'pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
      el.dispatchEvent(new (n.startsWith('pointer') ? PointerEvent : MouseEvent)(n, o));
  };

  // proven — visible leaf nodes with exactly this text; side 'right' (panels), 'left' (Navigator), 'any'
  const leaves = (text, side = 'right') => [...document.querySelectorAll('*')].filter((e) => {
    if (e.childElementCount !== 0 || e.textContent.trim() !== text || !vis(e)) return false;
    const x = e.getBoundingClientRect().x;
    return side === 'any' || (side === 'right' ? x > rightX() : x < 280);
  });

  // proven — native value setter; type_text appends to the old value ("ph2h2")
  const setInput = async (inp, val) => {
    const proto = inp instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    inp.focus();
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(inp, val);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    inp.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    inp.blur();
    await sleep(700);
  };

  const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
  // breadcrumb as 'Body › page_wrap › CTA Banner' (the first *breadcrumb* match can be an empty edit-mode node)
  const crumb = () => [...document.querySelectorAll('[data-automation-id^="breadcrumbs-node-label-"]')].map((e) => e.textContent.trim()).join(' › ')
    || document.querySelector('[data-automation-id="breadcrumbs-nodes"]')?.textContent || '';
  const button = (aria) => [...document.querySelectorAll('button')].find((b) => (b.getAttribute('aria-label') || '').startsWith(aria));

  const wfd = {
    version: '1.2.0',
    sleep, fire, leaves, setInput, esc, crumb,

    // proven — wait for the Designer instead of a fixed 15 s sleep
    async ready(timeout = 45000) {
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) {
        if (button('Components') && doc()?.body?.childElementCount) return 'ready ' + (Date.now() - t0) + 'ms';
        await sleep(500);
      }
      return 'timeout';
    },

    // proven — where am I: breadcrumb, page/component in the top bar, pageId
    state() {
      const top = [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.y < 70 && r.x > 300 && r.x < innerWidth - 400 && vis(b); }).map((b) => b.getAttribute('aria-label') || b.textContent.trim()).filter(Boolean);
      return { crumb: crumb(), top, pageId: new URL(location.href).searchParams.get('pageId'), panZoom: !!button('Exit pan') };
    },

    // proven — left panels by aria-label prefix: Navigator, Components, Variables, Style selectors, Assets,
    // Pages, Add Elements, Interactions, Properties (component canvas only). Never click a Components or
    // Add Elements row: a single click inserts an instance (Undo: wfd.undo()).
    // The buttons toggle and aria-pressed does not change, so a known panel is checked before clicking.
    async panel(name) {
      const open = { Navigator: () => document.querySelector('[data-navigator-label]'), Components: () => document.querySelector('[data-automation-id="symbol-panel-icon-cube"]') }[name];
      if (open && open()) return 'open:' + name;
      const b = button(name); if (!b) return 'nopanel:' + name;
      b.click(); await sleep(600);
      if (open && !open()) { b.click(); await sleep(600); } // a first click sometimes did not open it
      return (open ? (open() ? 'open:' : 'closed?:') : 'toggled:') + b.getAttribute('aria-label');
    },
    // proven — right-panel tabs: Style, Settings, Interactions
    async tab(name) {
      const t = leaves(name).find((e) => e.getBoundingClientRect().y < 120); if (!t) return 'notab:' + name;
      fire(t); await sleep(500); return 'ok';
    },
    async exitPanZoom() { const b = button('Exit pan'); if (!b) return 'not in pan & zoom'; b.click(); await sleep(800); return 'exited'; },
    async undo() { const b = button('Undo'); if (!b) return 'noundo'; fire(b); await sleep(500); return 'undone'; },

    // proven — select on the canvas by CSS selector (or element) in the canvas iframe. On a page the first
    // click selects the outermost instance: enter it with editComponent(). Zero-size elements
    // (u-display-contents, w-condition-invisible, empty lists) cannot be hit: use navSelect().
    async select(target, { dx, dy, dbl = false, nth = 0 } = {}) {
      const d = doc(); if (!d) return 'nocanvas';
      const el = typeof target === 'string' ? d.querySelectorAll(target)[nth] : target; if (!el) return 'nosel:' + target;
      // taller than the canvas: centring puts its top off screen, so align its start instead
      el.scrollIntoView({ block: el.getBoundingClientRect().height > frame().clientHeight * 0.8 ? 'start' : 'center' }); await sleep(400);
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return 'zero-size: use navSelect';
      const x = r.x + (dx ?? Math.min(20, r.width / 2)), y = r.y + (dy ?? Math.min(10, r.height / 2));
      const t = d.elementFromPoint(x, y); if (!t) return 'nohit';
      const shoot = (detail) => { const o = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: frame().contentWindow, detail };
        for (const n of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) t.dispatchEvent(new (n.startsWith('pointer') ? PointerEvent : MouseEvent)(n, o)); };
      shoot(1);
      if (dbl) { await sleep(300); shoot(2); t.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: x, clientY: y, view: frame().contentWindow, detail: 2 })); }
      await sleep(900);
      return { crumb: crumb(), hit: t.className?.toString?.().slice(0, 80) || t.tagName };
    },

    // proven — Navigator rows: find by label (nth when the name repeats), expanding collapsed parents.
    // Carets carry no expanded state: click one, and if the row count drops it was open, so click it back.
    navRows(label) { return [...document.querySelectorAll('[data-navigator-label]')].filter((e) => e.textContent.trim() === label && vis(e)); },
    async navFind(label, nth = 0) {
      await wfd.panel('Navigator');
      const count = () => document.querySelectorAll('[data-navigator-label]').length;
      for (let i = 0; i < 60 && !wfd.navRows(label)[nth]; i++) {
        const carets = [...document.querySelectorAll('[data-automation-id="navigator-expand-collapse-caret-button"]')].filter(vis);
        const c = carets[i]; if (!c) break;
        const before = count(); c.click(); await sleep(250);
        if (count() < before) { c.click(); await sleep(250); }
      }
      return wfd.navRows(label)[nth] || null;
    },
    async navSelect(label, nth = 0) {
      const row = await wfd.navFind(label, nth); if (!row) return 'nonav:' + label;
      row.scrollIntoView({ block: 'center' }); await sleep(200);
      row.click(); await sleep(800); return { crumb: crumb(), matches: wfd.navRows(label).length };
    },
    // proven by hand (pms-b6, 16 Oct: CMS list into a slot) — pointer drag in small steps from one Navigator
    // row onto another (a slot row); chrome-devtools drag, HTML5 drag and cut/paste did nothing.
    async navDrag(srcLabel, dstLabel, { srcNth = 0, dstNth = 0, steps = 20 } = {}) {
      const s = await wfd.navFind(srcLabel, srcNth), t = await wfd.navFind(dstLabel, dstNth); if (!s || !t) return 'nonav';
      const sr = s.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const o = (x, y, extra = {}) => ({ bubbles: true, cancelable: true, clientX: x, clientY: y, view: window, pointerId: 1, isPrimary: true, buttons: 1, ...extra });
      const sx = sr.x + 20, sy = sr.y + sr.height / 2, tx = tr.x + 30, ty = tr.y + tr.height / 2;
      s.dispatchEvent(new PointerEvent('pointerdown', o(sx, sy))); s.dispatchEvent(new MouseEvent('mousedown', o(sx, sy)));
      for (let i = 1; i <= steps; i++) {
        const x = sx + ((tx - sx) * i) / steps, y = sy + ((ty - sy) * i) / steps, el = document.elementFromPoint(x, y) || t;
        el.dispatchEvent(new PointerEvent('pointermove', o(x, y))); el.dispatchEvent(new MouseEvent('mousemove', o(x, y))); await sleep(30);
      }
      const end = document.elementFromPoint(tx, ty) || t;
      end.dispatchEvent(new PointerEvent('pointerup', o(tx, ty, { buttons: 0 }))); end.dispatchEvent(new MouseEvent('mouseup', o(tx, ty, { buttons: 0 })));
      await sleep(900); return 'dropped on ' + dstLabel + ' — read back in the Navigator or through the API';
    },

    // proven — enter the selected instance's definition; exit back to the page
    async editComponent() {
      const b = document.querySelector('[data-automation-id="componentInstanceProperties-EditComponentButton"]'); if (!b) return 'noedit: select an instance first';
      fire(b); await sleep(1800); return wfd.state();
    },
    async exitAll() {
      for (let i = 0; i < 10; i++) { const b = button('Return to previous instance'); if (!b) break; b.click(); await sleep(700); }
      return wfd.state();
    },

    // proven — bind the selected element's setting to an existing prop: the purple dot
    // [data-automation-id="binding-button_<Setting>"], then the prop by name (last match: a prop can share a
    // field label, e.g. "Text"). Settings seen: Text, Link, Visibility, Tag, Classes, Screen Reader Text.
    dots() { return [...document.querySelectorAll('[data-automation-id^="binding-button_"]')].map((b) => b.getAttribute('data-automation-id').slice(15)); },
    async bindProp(setting, prop) {
      const b = document.querySelector(`[data-automation-id="binding-button_${setting}"]`); if (!b) return 'nodot:' + setting + ' have:' + wfd.dots().join(',');
      fire(b); await sleep(800);
      const c = leaves(prop, 'any'); if (!c.length) { esc(); return 'noprop:' + prop; }
      const el = c[c.length - 1];
      fire(el.closest('[role="treeitem"],[role="option"],[role="menuitem"],li,button') || el.parentElement); await sleep(800);
      return 'bound:' + setting + '→' + prop;
    },

    // proven — native "is set" condition on the selected element's visibility, on one field (prop or CMS field)
    async visibleWhenSet(field) {
      const b = document.querySelector('[data-automation-id="binding-button_Visibility"]'); if (!b) return 'nodot:Visibility';
      fire(b); await sleep(800);
      const cc = [...document.querySelectorAll('*')].filter((e) => e.textContent.trim() === 'Create conditional' && vis(e));
      if (!cc.length) { esc(); return 'nocreate'; }
      fire(cc[cc.length - 1]); await sleep(900);
      const pick = leaves(field, 'any').sort((a, z) => a.getBoundingClientRect().x - z.getBoundingClientRect().x)[0]; // dialog opens left of the panel
      if (!pick) { esc(); return 'nofield:' + field; }
      fire(pick.parentElement); await sleep(800); esc(); await sleep(400);
      const summary = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && /^If .* is set$/.test(e.textContent.trim()));
      return summary ? summary.textContent.trim() : 'check: no "If … is set" summary';
    },

    // proven — Lumos Classes props (chips). The value replaces the whole set; pass the full class string.
    async setClasses(value, label = 'Classes') {
      const wrap = document.querySelector(`[data-automation-id="ExpressionEditor-fieldWrapper-${label}"]`);
      const inp = wrap?.querySelector('input[type=text]'); if (!inp) return 'nofield:' + label;
      await setInput(inp, value);
      return [...wrap.querySelectorAll('.lumos_style_tag')].map((e) => e.textContent.trim());
    },

    // proven — the Tag field of the selected element (find it by its current value, e.g. 'h2' or 'div')
    async setTag(value, current) {
      const inp = [...document.querySelectorAll('input')].find((i) => vis(i) && i.getBoundingClientRect().x > rightX() && (i.value === current || (!current && i.placeholder === 'div')));
      if (!inp) return 'notag:' + current;
      await setInput(inp, value); return 'tag:' + inp.value;
    },

    // proven — heading level of a rich-text prop: select the instance first; level 2–6
    async richTextHeading(level) {
      const ed = [...document.querySelectorAll('button')].find((b) => /Edit Rich Text/.test(b.textContent)); if (!ed) return 'noeditor';
      ed.click(); await sleep(900);
      const eds = [...document.querySelectorAll('[contenteditable=true]')]; const e = eds[eds.length - 1]; if (!e) return 'nocontent';
      e.focus(); const rg = document.createRange(); rg.selectNodeContents(e); const s = getSelection(); s.removeAllRanges(); s.addRange(rg);
      e.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); document.dispatchEvent(new Event('selectionchange')); await sleep(400);
      const bar = document.querySelector(`[data-automation-id="rte-h${level}-bar-button"]`); if (!bar) return 'nobar:h' + level;
      fire(bar); await sleep(600);
      const html = e.innerHTML.slice(0, 120);
      const close = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Close' && b.getBoundingClientRect().y > 300); if (close) close.click();
      return html;
    },

    // proven — HTML5 drag (prop folders: [data-automation-id="draggable-content_<Folder>"]; props: the
    // draggable under the label). Drop after = near the target's bottom edge.
    async html5drag(src, dst, after = true) {
      if (!src || !dst) return 'nodrag';
      const dt = new DataTransfer(); const sr = src.getBoundingClientRect(), tr = dst.getBoundingClientRect();
      const ev = (el, n, x, y) => el.dispatchEvent(new DragEvent(n, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: dt }));
      const sx = sr.x + sr.width / 2, sy = sr.y + sr.height / 2, tx = tr.x + tr.width / 2, ty = after ? tr.bottom - 3 : tr.y + 3;
      ev(src, 'dragstart', sx, sy); ev(src, 'drag', sx, sy); ev(dst, 'dragenter', tx, ty);
      for (let i = 0; i < 4; i++) { ev(dst, 'dragover', tx, ty); await sleep(50); }
      ev(dst, 'drop', tx, ty); ev(src, 'dragend', tx, ty); await sleep(600);
      return 'dropped';
    },
    // tested (PMS, 16 Oct) — a prop row onto another prop row in the Properties panel (component canvas):
    // it lands after the target, in the target's folder. Also moves slot props, which the API cannot regroup.
    async moveProp(prop, afterProp) {
      const q = (n) => document.querySelector(`[data-automation-id="PropertyListItem-${n}"]`);
      if (!q(prop) || !q(afterProp)) return 'noprop: open the Properties panel on the component canvas';
      await wfd.html5drag(q(prop), q(afterProp), true);
      return [...document.querySelectorAll('[data-automation-id^="PropertyListItem"], [data-automation-id^="draggable-content_"]')]
        .map((r) => r.getAttribute('data-automation-id').replace('PropertyListItem-', '').replace('draggable-content_', '['));
    },
    async moveFolder(folder, afterFolder) {
      const q = (n) => document.querySelector(`[data-automation-id="draggable-content_${n}"]`);
      return wfd.html5drag(q(folder), q(afterFolder), true);
    },

    // untested as one call (proven by hand: two clicks on the value cell open the editor, Meta+A types "a").
    // Opens Variables, the collection and the group, then sets the value of the named variable.
    async setVariable(collection, group, name, value) {
      const b = button('Variables'); if (!b) return 'nopanel'; b.click(); await sleep(600);
      if (!leaves(collection, 'any').length) { b.click(); await sleep(600); } // a first click sometimes did not open it
      const col = leaves(collection, 'any')[0]; if (!col) return 'nocollection:' + collection;
      col.click(); await sleep(700);
      if (group) { const g = leaves(group, 'any')[0]; if (g) { fire(g); await sleep(500); } }
      const nameEl = [...document.querySelectorAll('input, [role=textbox], *')].find((e) => (e.value === name || (e.childElementCount === 0 && e.textContent.trim() === name)) && vis(e));
      if (!nameEl) return 'novariable:' + name;
      const row = nameEl.closest('[role=row]') || nameEl.parentElement?.parentElement;
      const cells = row ? [...row.querySelectorAll('*')].filter((e) => e.childElementCount === 0 && vis(e) && e !== nameEl && e.textContent.trim()) : [];
      const cell = cells[cells.length - 1]; if (!cell) return 'nocell';
      fire(cell); await sleep(400); fire(cell); await sleep(600);
      const inp = row.querySelector('input:not([readonly])') || document.activeElement; if (!inp || !('value' in inp)) return 'noinput';
      await setInput(inp, value);
      return 'value:' + (cells[cells.length - 1].textContent.trim().slice(0, 60));
    },

    // proven — site custom code on https://webflow.com/dashboard/sites/<site>/custom-code (not the Designer):
    // index 0 = Head, 1 = Footer. Click the first Save afterwards and reload to read back.
    siteCode(index, text) {
      const v = document.querySelectorAll('.cm-editor .cm-content')[index]?.cmTile?.view; if (!v) return 'noeditor';
      if (text != null) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: text } });
      return v.state.doc.length + ' chars';
    },
  };

  window.wfd = wfd;
  return 'wfd ' + wfd.version + ' installed: ' + Object.keys(wfd).filter((k) => typeof wfd[k] === 'function').join(', ');
}
