# Report shapes

Marks: ✅ fine · ⚠️ off (differs from the design or breaks a rule) · ❌ broken (a visitor notices, or it does not work) · 🧹 tidy (only the editor or the code sees it) · – not applicable · ? not checked.

## Reviewer return

What each reviewer agent hands back. Nothing else around it.

```
## <Component> — <page> (<url>)
Checked: API <time> · published <date> (<before|after> the build) · widths <list> · design <png files>
| Works | Responsive | Spacing | Lumos | Code | Props | Design |
| ✅ | ⚠️ | ✅ | ⚠️ | ✅ | 🧹 | ⚠️ |

### Findings
- ❌ Works · <what is wrong, in words the owner uses, ≤ 20 words> · Seen: <the number, value or screenshot that proves it> · Fix: <the change> · By: API | Designer | owner
- ⚠️ Spacing · ...

### Already decided (not findings)
- <deviation> — decisions/<file> <date>

### Content
- <placeholder or dummy content still on the page>

### Not checked
- <what, and why: not published, needs the Designer, needs a login …>
```

One line per finding: the part before `Seen:` at most 20 words, `Seen:` the one or two numbers that prove it, `Fix:` a few words. Detail beyond that goes in the evidence folder, not the line. The visible thing first ("the space under the title"), the class or prop only after `Seen:`. `By: owner` when the fix is a choice between the design and a rule, or the design is silent.

## To the user

Short, plain, scannable in under a minute. Follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md): answer first, no jargon, no padding.

```
**Review — <scope>, <date>.** <N> components: <a> fine, <b> need fixes, <c> broken.

| Component | Works | Responsive | Spacing | Lumos | Code | Props | Design |
|---|---|---|---|---|---|---|---|
| Stat Grid | ✅ | ✅ | ⚠️ | ✅ | ✅ | 🧹 | ⚠️ |

**Broken**
1. **Chart Rows** — shows every trial's results, not only this trial's. *Fix: add the "this trial" filter (Designer, I can do it).*

**Off**
2. **Stat Grid** — the space above the title is 48 px, design has 72. *Fix: section padding to large.*

**Tidy**
3. **Card Stat** — the Visual panel lists "Image Visibility" before "Image". *Fix: reorder.*

**Your call**
❓ **Q1** - **Testimonial title on phone**: 24 px in the build, 40 px in the design; 40 wraps to 4 lines. ➡️ Keep 24, note it as a deviation.

Reply **fix all**, or the numbers (**fix 1, 3**). Full report: `references/audit/<file>.md`.
```

- Numbers run on across groups, so "fix 2, 5" is unambiguous.
- One line per item; the fix in italics on the same line. Group the same fault on several components into one item ("Stat Grid, Tile Mosaic, Chart Rows — slot is called 'Slot'").
- Fine components appear only in the matrix.
- "Your call" items use the asking.md question shape and are never fixed before the answer.

## Saved report

`references/audit/<yyyy-mm-dd>-<scope>.md` in the client repo: the user's version on top, then every reviewer return in full, then where the evidence is (screenshots stay in the session scratchpad; they are not committed).
