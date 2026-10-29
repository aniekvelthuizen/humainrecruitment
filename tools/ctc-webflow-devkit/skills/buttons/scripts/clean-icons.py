#!/usr/bin/env python3
"""Clean SVGs exported from a Figma component set so they work as CSS masks.

download_assets exports of a variant include the component set's background square
(<rect width=W height=H fill="#..."/> covering the whole viewBox) and its dashed purple
outline (stroke="#9747FF"). As a mask either one renders a solid square.

    python3 clean-icons.py <in_dir> <out_dir>

Removes: a first-level <rect> that covers the whole viewBox, any <rect> stroked #9747FF,
and id="" attributes. Leaves every other shape, including rects inside the icon.
Prints a line per file that still looks suspicious (non-square viewBox, leftover full rect).
"""
import os
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
problems = []
for name in sorted(os.listdir(src)):
    if not name.endswith('.svg'):
        continue
    s = open(os.path.join(src, name), encoding='utf-8').read()
    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', s)
    w, h = (vb.group(1), vb.group(2)) if vb else (None, None)
    if w and h:
        s = re.sub(r'\s*<rect width="%s" height="%s" fill="[^"]*"\s*/>' % (re.escape(w), re.escape(h)), '', s)
    s = re.sub(r'\s*<rect [^>]*stroke="#9747FF"[^>]*/>', '', s, flags=re.I)
    s = re.sub(r' id="[^"]*"', '', s)
    open(os.path.join(dst, name), 'w', encoding='utf-8').write(s)
    if w != h:
        problems.append(f'{name}: viewBox {w}x{h} (not square)')
    if w and re.search(r'<rect width="%s" height="%s"' % (re.escape(w), re.escape(h)), s):
        problems.append(f'{name}: full-size rect left')
print(f'cleaned {len([n for n in os.listdir(dst) if n.endswith(".svg")])} files')
for p in problems:
    print('check:', p)
