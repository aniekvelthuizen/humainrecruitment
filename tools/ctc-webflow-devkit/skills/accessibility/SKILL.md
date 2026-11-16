---
name: accessibility
description: Make and check a Webflow site accessible to WCAG 2.2 AA — keyboard use and visible focus, focus order, menus and modals that open, close and hand focus back, skip link, landmarks, headings, lists, alt text and decorative elements, accessible names on icon buttons, contrast per theme and per brand, zoom, reflow and text spacing, target size, motion with a pause, forms and embedded iframes, status messages, captions and transcripts — and verify it on the published site with axe-core plus a keyboard walk. Use when the user mentions accessibility, toegankelijkheid, a11y, WCAG, screen readers, keyboard navigation, focus states, contrast, alt texts, aria, "skip to main", an accessibility checklist or audit; before showing a site to the client; before launch; and whenever a nav, menu, modal, slider, tabs, accordion, form or card grid is built. Requires a client repo (project.json); otherwise run the project skill first.
---

# Accessibility — usable with a keyboard, a screen reader and zoom, checked on the published site

The bar is **WCAG 2.2 level AA**. A site passes when every page works with the keyboard alone, says what it is to a screen reader, stays readable at 200 % zoom and on a 320 px screen, and has enough contrast in every theme and every brand. A tool finds about a third of the faults; the rest is the keyboard walk and the hand checks in this skill. So this skill ends on staging with both. Whether the law requires it (European Accessibility Act, public-sector rules) differs per client: criteria.md §9; the bar in this kit is 2.2 AA either way.

The rules per criterion, what they mean on Webflow and Lumos, and how to fix them: [criteria.md](criteria.md). It also lists the checklist advice that circulates and is wrong (`aria-hidden` to remove focus, `role="listitem"` on a link, "never px"). Read first: `project.json`, `decisions/site.md` (the **Accessibility** entry), the latest `references/audit/*-a11y.md`. Questions follow [asking.md](${CLAUDE_PLUGIN_ROOT}/references/asking.md).

## 1. While building (every unit)

Accessibility is part of a unit, like hover and focus states ([build](../build/SKILL.md)): a section is not done when its menu cannot be closed with Escape or its icon button has no name. Per unit, before calling it done:

- **Native first.** A link that goes somewhere is a link, an action is a `<button>`, a section is a `<section>`/`<nav>`/`<footer>`; Webflow's own Dropdown, Navbar, Tabs, Slider and Lumos' Modal (`<dialog>`) carry their keys and ARIA. ARIA only where no native element exists, and then the keys that go with the role (criteria.md §4).
- **Keyboard:** everything clickable is reachable with Tab, works with Enter (and Space on buttons), shows a focus ring via `:focus-visible` only, and is not hidden under the sticky nav when focused.
- **Hidden means unreachable:** a closed menu, modal, tab panel or off-screen slide takes no focus (`display: none`, `inert`, or Swiper's own a11y). Never `aria-hidden` on something that holds a link or button.
- **Names:** every image has alt text or is marked decorative; every icon-only control has a name; every link says where it goes without the text around it.
- **Structure:** one `h1`, headings in order, lists for repeated items, landmarks for the page regions.
- **Colours** only from Theme variables, so contrast is checked once per theme × brand (§3) instead of per element.

Component props cannot carry `aria-*` or `role` ([componentize/mechanics.md](../componentize/mechanics.md)): fixed attributes go in the definition, a name that differs per instance goes in a visually hidden text element bound to a text prop (criteria.md §3).

## 2. Check on the published site

[a11y-check.mjs](a11y-check.mjs), once per page type (home, every template, a page with a form, a page with a slider or tabs), on staging:

```
npm install --prefix ${CLAUDE_PLUGIN_ROOT}/references/fixture   # once
node ${CLAUDE_PLUGIN_ROOT}/skills/accessibility/a11y-check.mjs <url> [<url> …] --out <scratchpad>/a11y [--widths 1440,375]
```

Per page it writes `summary.md`: axe-core violations (WCAG 2.0–2.2 A/AA), the Tab order with a crop of every focus stop, focus on something invisible, a stop with no visible focus change, focus fully hidden under a sticky bar, a keyboard trap, the skip link and its target, targets under 24 × 24 px, toggles without `aria-expanded` or that do not close on Escape and hand focus back, vague link text, motion over 5 s, landmarks and headings, reflow at 320 px, text spacing, and text that does not grow with the browser's font size. Exit code 1 on failures.

Then **look at the focus crops** (`focus-<w>/`): every stop must show a ring you can see at a glance, in the order a reader expects. A missing crop or a stop on an element you cannot see is a finding.

## 3. Hand checks (the part no tool does)

Do these once per page type, and write the result as rows in the audit (§5):

1. **Keyboard only, mouse away**, at 1440 and 375: open and close every menu, dropdown, modal, accordion and tab with Enter/Space/Escape/arrows; fill a form; tab through a slider. Focus never disappears, never lands behind an overlay, comes back to the button that opened something.
2. **VoiceOver** (Safari, ⌘F5): the rotor (Ctrl-Option-U) lists headings, landmarks and links that make sense on their own; buttons say their state ("collapsed/expanded"); images say what they show or nothing; a form field says its label, required, and its error.
3. **Contrast per theme and per brand**: every Theme mode × every brand mode — body text, muted text, placeholder, links, button text on button, field borders and the focus ring against their background (criteria.md §5). axe only sees the colours the page shows right now.
4. **Zoom 200 % and 400 %** in the browser (⌘+): nothing cut off, no sideways scroll at 400 % (= 320 px), the sticky nav does not eat the screen.
5. **Reduced motion and pause**: with "reduce motion" on, nothing large moves; without it, every autoplay slider, marquee or video has a pause button.
6. **Media**: video has captions, audio (podcast) has a transcript.
7. **Embedded forms** (iframes): the iframe has a `title`; the form inside passes the same checks on its own page.

## 4. Fix

Follow the build skill's rules (one change, one read-back, the guard). Fix in the component definition, not per instance, so every page gets it. Order: Broken for a keyboard or screen-reader user first (cannot reach, cannot close, no name, trap), then contrast, then the rest. After a batch is published, rerun §2 on the pages it touched.

A fault that a builder made because the kit did not say otherwise: file it as a kit issue ([kit-issues.md](${CLAUDE_PLUGIN_ROOT}/references/kit-issues.md)) so the build skill catches it next time.

## 5. Record

- `references/audit/<yyyy-mm-dd>-a11y.md`: per page type the script result, the hand-check rows (✅/❌ per criterion), what was fixed and what is open.
- `decisions/site.md` › **Accessibility**: the bar (WCAG 2.2 AA unless the client says otherwise), deliberate exceptions with their reason (a client-owned embed, a third-party widget), the contrast table per theme × brand.
- `references/log.md`: one line per round with the result.

## 6. Not in this skill yet

An accessibility statement (toegankelijkheidsverklaring, required for Dutch public bodies, optional for others), automated checks on every publish, PDF accessibility, AAA criteria. Add them here when a project needs them.
