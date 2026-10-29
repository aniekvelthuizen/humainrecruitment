# Motion — a hover the owner picks by feel

## 1. Mechanism, in order

Webflow-native first, own code last — and for a **hover** the native option that survives real mouse use:

1. **Hover (in/out, any accent, label shift, line): Lumos trigger transitions** in Webflow styles (§3). The wrap's `data-trigger="hover focus"` flips `--_trigger---on/off`; the moving parts transform from those variables and transition per direction. Reverses from wherever it is, never sticks, plays on keyboard focus too, and needs no code.
2. **Webflow style transitions** for theme colours (background, text, border) on the wrap's `:hover` / `:focus-within` (structure.md §3).
3. **Webflow Interactions (IX3, GSAP)** for motion that is not a plain hover: scroll, click, load, sequences, staggers, timelines the owner should edit in the Interactions panel. A hover in IX3 only when in and out take **the same time** and a quick pass may show a jump (§4).
4. **A script** only for what Webflow cannot do (a letter roll), in `Global | Custom Code`, using the GSAP Webflow loads (Site settings › GSAP) — never a GSAP or plugin we load ourselves (§7).

## 2. Timing

- **Project first:** `decisions/motion.md` (motion guidelines from the design, if the project has them). Copy cubic-beziers literally as custom eases; do not round to a preset.
- **Hover: in is longer than out** (only safe with §3, not with IX3 §4). What users asked for in practice: in ~0.45 s, out ~0.25 s, with an ease-in-out in and a quicker ease out. A brand's standard 0.75 s for scale/position is for large movements, not hovers. Record the deviation in `decisions/motion.md`.
- **Kit defaults** when the project has none: 0.6 s, `cubic-bezier(.65, .05, .36, 1)` for line and letters; 0.2 s for weight/colour; letter stagger 14 ms.
- Colour transitions follow the same timing as the movement (in on `:hover`, out on the rest state), so colour and motion arrive together.
- `prefers-reduced-motion`: Webflow styles cannot target the media query and the Lumos starter does not neutralise transitions. A hover that moves a few pixels is acceptable as is; larger hover motion gets one rule in `Global | Custom Code` (`@media (prefers-reduced-motion: reduce) { [data-trigger] * { transition-duration: 0s !important } }`). IX3: `conditionalPlayback: [{type: "prefers-reduced-motion", behavior: "skip-to-end"}]`.
- The Designer canvas shows the rest state (the trigger can be previewed with `data-trigger="preview"` on the wrap; IX3 does not run there).

## 3. Hover with Lumos trigger transitions (no code)

Rest state and hover state in one rule per part, driven by the trigger variables (look up both ids with `query_variables`, `css_name: "--_trigger"`; names are inverted: at rest `on` = 1, `off` = 0, on hover/focus they swap):

| Part | `transform` | `transition` |
|---|---|---|
| accent (scales in from a corner) | `scale(calc(1 * @var_variable-<off id>))`, `transform-origin: 0% 0%` | below |
| label (makes room) | `translateX(calc(-0.375rem * @var_variable-<on id>))` | below |
| line (draws under the label) | `scaleX(calc(100% * @var_variable-<off id>))` | below |

Different speed and ease **per direction** in one value, because the variable flips the moment the hover starts or ends:

```
transition-property: transform
transition-duration: calc(250ms + 200ms * @var_variable-<off id>)          → in 450 ms, out 250 ms
transition-timing-function: cubic-bezier(calc(.5 + .25 * @var_variable-<off id>), 0, calc(.75 - .25 * @var_variable-<off id>), 1)
                                                                            → in (.75,0,.5,1), out (.5,0,.75,1)
```

All three are stored as written (one variable per `calc`, read back) and publish as valid CSS; Chrome honours `calc()` inside `cubic-bezier()`. Build the static layout in the **hover** position (accent at full size, label in place) and let the rest values pull it back, so the button's width never changes. The colours on the wrap use the same timings (structure.md §3). Remove any IX3 interaction on the same elements: the two fight over `transform`.

## 4. IX3 hover — only with equal in/out times

When the owner wants the hover in the Interactions panel, use the **role form**: one `wf:hover` trigger with `config: {control: "play", pluginConfig: {multiTimeline: true}}` and two timelines with `triggerMetadata.role` `mouseEnter` / `mouseLeave`, To-tweens (`[null, value]`) towards the class's rest values; component scope with `wf:inst` targets into the definition.

What goes wrong, measured:

- **In longer than out sticks.** Enter and leave timelines both keep running; when the hover ends before `in − out` ms, the enter tween finishes last and the button **stays in its hover state** (450/250 ms: stuck below ~200 ms). Use equal durations, or §3.
- **Quick pass jumps.** The leave timeline starts from the values it recorded on its first run, so a hover shorter than the in-duration flashes the accent to full size before it shrinks.
- The split form (two triggers with `eventMode` enter/leave) allows only `control: "play"` with more than one group, and a finished timeline does not play again: the hover works **once**. One timeline with enter → play and leave → reverse fails too (each trigger gets its own copy of the timeline); `togglePlayReverse` never receives the leave.
- `ease`: a preset index or `{ "type": "customEase", "bezierCurve": "x1,y1,x2,y2" }` (honoured). Durations are seconds. Reduced motion: `conditionalPlayback: [{type: "prefers-reduced-motion", behavior: "skip-to-end"}]`.

## 5. Offer, as a live demo

Describing motion in words gets a polite "maybe A?". Build a local page with the real colours, font and icons and the options side by side, open it in the user's Chrome (`open -a "Google Chrome" <file>`), and let them hover. Start from [scripts/motion-demo.html](scripts/motion-demo.html): fill in the theme colours, font and icon URLs, keep two or three options.

Options that suit content sites, each subtle and cheap on the compositor:

| Option | What moves | Mechanism |
|---|---|---|
| **Accent scale / label shift** | a small accent mark scales in from a corner, the label makes room | Lumos trigger transitions (§3) |
| **Growth line** | a 2 px accent line draws under the button left → right, retracts to the right on leave | Lumos trigger on `transform` (§3, §6) |
| **Letter roll** | each letter rolls up and comes back from below, staggered | small script + CSS in `Global | Custom Code` |
| **Icon roll** | the icon rolls up and a copy comes back from below (icon-only links) | Lumos trigger on `transform` — Webflow styles only, no code (§6b) |
| **Icon loop** | the icon exits in its own direction and re-enters from the opposite side | CSS keyframes in `Global | Custom Code`; direction per icon via the Icon Set variant attribute (`data-wf--icon-set--variant`) |
| Text nudge | label slides 4–8 px | Lumos trigger on `transform` |
| Weight | light → regular | `:hover` pseudo on the wrap |

Ask whether the hover also **recolours** the text/icon. A recolour from the design plus a coloured line can clash; the usual answer is one accent, on the line.

## 6. Growth line (no code, Lumos trigger)

Add `button_main_line` as the last child of `button_main_element` (a Lumos starter has this class already):

```
position: absolute; left: 0; right: 0; bottom: 0; height: 0.125rem; pointer-events: none;
background-color: <theme variable, e.g. button-line>;
transform: translateY(100%) scaleX(calc(100% * @var_variable-<--_trigger---off id>));
transform-origin: calc(100% * @var_variable-<--_trigger---on id>) 100%;
transition: transform 600ms cubic-bezier(.65, .05, .36, 1);
```

Lumos' trigger variables are inverted in name: at rest `--_trigger---on` = 1 and `--_trigger---off` = 0; on hover they swap. So `scaleX(off)` grows on hover, and the origin flips to the left while hovered, to the right on leave. Look up both variable ids with `query_variables` (`css_name: "--_trigger"`). Inset the line per variant to match the text (e.g. `left/right: 1rem` on a padded variant).

Line colour: an accent from the theme. When it must differ per theme (accent on light/dark, dark on a brand-coloured background), create a theme variable (`button-line`) with a value per mode rather than overrides per variant. 1 px under a thin border reads as the border fading — 2 px reads as a line.

## 6b. Icon roll (no code, Lumos trigger)

The icon version of the letter roll, for icon-only links (socials, small arrows) — Webflow styles and the Lumos trigger only:

```
link (data-trigger="hover focus")
└─ icon_clip    width/height = icon size (e.g. 1.75rem), overflow: hidden
   └─ icon_track  display: flex; flex-direction: column; width: 100%;
                  transform: translateY(calc(-50% * @var_variable-<--_trigger---off id>));
                  transition: transform 600ms cubic-bezier(.65, .05, .36, 1);
      ├─ Icon Set (variant X)
      └─ Icon Set (variant X)   ← the same icon again
```

On hover the track moves up half its height: the first icon leaves upwards, the copy arrives from below; on leave it rolls back. The transform is written with `property_value` and the `@var_variable-…` form (stored as is, read it back). The link carries the `aria-label`; both icons are decorative.

**Text links outside buttons** (legal row, footer lists): use `Button Main` instances with a size variant (`Text Small`: copy of Text, label Text Style mode set per variant and per breakpoint — webflow-mcp.md §9) so they share the line, roll and weight change. Remove any Lumos `hover-other` dimming (`data-trigger` on the list/items) when switching.

## 7. Custom code: `Global | Custom Code`

Only for what Lumos and Webflow (styles, IX3) cannot do. A script that animates uses the GSAP Webflow loads (enable it in Site settings › GSAP; await `window.gsap`), never a copy we load ([lumos-rules.md](${CLAUDE_PLUGIN_ROOT}/references/lumos-rules.md) §0): the letter-roll script, its keyframes, overrides of Webflow's own CSS. Never layout or sizing.

All custom CSS/JS of the site lives in one component, **`Global | Custom Code`** (group Global): a `u-position-fixed` div with a style-only embed and a script embed (the Designer canvas skips any embed that contains a `<script>`, its CSS included), placed at the top of `page_wrap` on **every page** (next to Global Styles; `page_wrap` ids differ per page, look each up). Never an embed inside the button or on an element. CMS templates that are still empty get it when they are built — note that in `decisions/site.md`. If the component already exists, append to its embeds, keeping what is there verbatim.

Letter roll — targets an **attribute**, not a class: put `data-roll` on `button_main_text` in the button definition (`set_attributes` with `scope_component_id`, read back with `get_attributes`). Removing the attribute switches it off; `data-roll="off"` on a wrap switches off one instance.

```html
<style>
/* Button | letter roll. Splits [data-roll] labels into words > letters. Off: remove data-roll, or data-roll="off" on the button wrap */
[data-roll] .roll_word { display: inline-block; white-space: nowrap; }
/* Each word reserves its hover-weight width, unkerned like the split letters: a light -> regular hover moves no neighbour */
[data-roll] .roll_word::before { content: attr(data-word); display: block; height: 0; overflow: hidden; visibility: hidden;
  font-weight: var(--_typography---font--primary-regular, 400); font-kerning: none; font-variant-ligatures: none; }
[data-roll] .roll_char { display: inline-block; overflow: hidden; vertical-align: top; }
[data-roll] .roll_char_inner { display: inline-block; position: relative;
  transform: translateY(calc(-100% * var(--_trigger---off, 0)));
  transition: transform 0.6s cubic-bezier(.65, .05, .36, 1); transition-delay: calc(var(--i, 0) * 14ms); }
[data-roll] .roll_char_inner::after { content: attr(data-char); position: absolute; left: 0; top: 100%; }
@media (prefers-reduced-motion: reduce) { [data-roll] .roll_char_inner { transition: none !important; } }
</style>
<script>
(function () {
  function split(t) {
    if (t.querySelector('.roll_word') || t.closest('[data-roll="off"]')) return;
    var words = t.textContent.trim().split(/\s+/), i = 0;
    if (!words[0]) return;
    t.textContent = '';
    words.forEach(function (word, n) {
      if (n) t.appendChild(document.createTextNode(' '));
      var w = document.createElement('span'); w.className = 'roll_word'; w.setAttribute('data-word', word);
      Array.from(word).forEach(function (c) {
        var box = document.createElement('span'); box.className = 'roll_char';
        var e = document.createElement('span'); e.className = 'roll_char_inner';
        e.textContent = c; e.setAttribute('data-char', c); e.style.setProperty('--i', i++);
        box.appendChild(e); w.appendChild(box);
      });
      t.appendChild(w);
    });
  }
  function scan(root) {
    if (root.matches && root.matches('[data-roll]:not([data-roll="off"])')) split(root);
    if (root.querySelectorAll) root.querySelectorAll('[data-roll]:not([data-roll="off"])').forEach(split);
  }
  function run() {
    scan(document);
    /* Labels added or re-rendered after load (Designer preview after an edit, CMS lists, components swapped in) */
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        var label = m.target.nodeType === 1 ? m.target.closest('[data-roll]:not([data-roll="off"])') : null;
        if (label) split(label);
        m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
</script>
```

Why the reserve: a light → regular hover widens a label by 1–3 px, and in a right-anchored row (a nav) every link to its left moves. The hidden `::before` holds the word at the hover weight; kerning and ligatures are off because the split letters are separate boxes (no kerning) — with kerning on, the reserve is ~1 px short. Verify with the nav skill's `nav-check.mjs --hover` (shift < 0.5 px).

Underline gap: Lumos trims text boxes to cap height, so a line at the bottom of an inline (Text) button touches the letters; put it ~6 px lower on those variants (`bottom: -0.375rem`).

Why words > letters: one inline-flex row of letters cannot wrap, so a long label overflows on mobile; words keep normal wrapping, and clipping per letter keeps the roll inside each glyph's line box. The label must keep its text style's line height (structure.md §5), or descenders are clipped.

## 8. Verify and tune

- Before publishing: the kit fixture with the embed as `script`/`css` (code only; IX3 is tested on the published page).
- Published (with the user's OK): [scripts/hover-matrix.mjs](scripts/hover-matrix.mjs) over **every** button on the Styleguide group: per button rest → hover → leave, 3 hovers in a row, one hover cut off halfway, a move straight onto the next button; it flags any button whose rest state does not come back or whose colour does not change. `--trace <index>` samples one button every 50 ms (accent, label offset, background) to check durations and that colour and motion arrive together. [scripts/hover-check.mjs](scripts/hover-check.mjs) adds sizes, colours, the line and letter offsets, with screenshots at 2×.
- Read the published CSS of the wrap: a mangled `transition` (structure.md §6) means no fade at all.
- Tuning: one value per round, ~20–25 %, reply `Was | Now`.
