#!/usr/bin/env node
// Open Graph image: 1200 × 630 JPG (q82) from a source image (AVIF, WebP, PNG, JPG).
// Usage: node make-og.mjs <source> <out.jpg> [--contain] [--bg "#ffffff"] [--position centre|top|bottom|left|right]
//   default: cover-crop to 1200 × 630. --contain: the whole image centred on --bg (cut-out objects, logos).
// Needs sharp once: npm i --prefix .tmp/og sharp   (resolved from .tmp/og in the cwd).
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/.tmp/og/');
const sharp = require('sharp');

const argv = process.argv.slice(2), valued = new Set(['--bg', '--position']);
const [src, out] = argv.filter((a, i) => !a.startsWith('--') && !valued.has(argv[i - 1]));
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
if (!src || !out) { console.error('usage: node make-og.mjs <source> <out.jpg> [--contain] [--bg "#fff"] [--position centre]'); process.exit(2); }
const W = 1200, H = 630, bg = arg('bg', '#ffffff');

let img;
if (process.argv.includes('--contain')) {
  const fit = await sharp(src).resize({ width: Math.round(W * 0.86), height: Math.round(H * 0.86), fit: 'inside' }).png().toBuffer();
  img = sharp({ create: { width: W, height: H, channels: 3, background: bg } }).composite([{ input: fit, gravity: 'centre' }]);
} else {
  img = sharp(src).resize(W, H, { fit: 'cover', position: arg('position', 'centre') }).flatten({ background: bg });
}
const info = await img.jpeg({ quality: 82, mozjpeg: true }).toFile(out);
console.log(out, info.width, info.height, info.size);
