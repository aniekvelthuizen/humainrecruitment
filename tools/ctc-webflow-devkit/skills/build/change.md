# Source: a sentence and a screenshot

1. **Establish the frame.** Which page, which element, which canvas width, page view or component definition view. Ask when the screenshot does not say.
2. **Diagnose read-only.** `query_elements` on the element, `query_styles` with `include_properties` across breakpoints on its classes, `query_variables` on the resolved ids. No writes yet. When a reused component is involved, read its definition for bleeds and overrides first.
3. **Propose.** First one plain sentence: what you will change and why, as the user would say it. Then one table: element, class, property, was → proposed, whose class it is. A class outside `project.json`'s prefix belongs to the site: propose a combo or a new class instead of editing it. With an empty prefix (plain Lumos) "ours" is what `decisions/` and `references/log.md` say we built; Lumos' own classes (`u-*`, the starter's component classes) and everything else belong to the site. When the change touches more than ten classes, or contradicts `decisions/`, it is a plan and needs an OK.
4. **Then** one write per hypothesis, read back, snapshot, report.

Fixes that compensate (a negative margin, a nudge against a font metric) lose to fixes that remove the cause (source padding, a combo). After the user fixes something in the Designer themselves, read the classes back and name the assumption that was wrong.

**Optical alignment is the exception: there the nudge is the fix.** Geometrically centred and visually centred are not the same thing, and the eye is right.

- Vertical, a box beside a label: align to the **x-height** of lowercase text, not the cap height and not the line box. Most labels are read by their lowercase mass.
- Horizontal, a glyph inside a box: shapes with uneven weight — a checkmark, a play triangle, an arrow — read off-centre when they are measured centre. Shift them towards the heavy side.
- **An optical nudge is a constant, not a ratio.** Roughly the same ~1 px at every size; scaling it proportionally makes the large one look wrong once the small one is right. Fix each size separately and check both.
- Measure the **ink**, not the box — a screenshot at 4–8× with a pixel scan — and confirm which element and which axis the user means before writing any CSS.
