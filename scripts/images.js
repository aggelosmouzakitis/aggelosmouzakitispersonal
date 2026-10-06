// images.js — cut the responsive widths of every photograph the pages show.
//
// site-pages.jsx lists each photograph with the widths it is offered at
// (PHOTOS, between the PHOTOS markers) and draws it with srcset/sizes, so a
// phone downloads a width near the one it shows instead of the full-size
// original. This writes those widths: img/<name>-<width>.webp, where <name>
// is the original's (or the entry's `name`, for a photo cut to the part the
// page shows: `crop` is left, top, width, height in the original's pixels).
//
// Each width is already grey. Every photograph on the site is drawn through
// the CSS filter grayscale(1) contrast(1.12) brightness(.96) sepia(.14); its
// first step is applied here, with the same Rec. 709 weights on the same
// gamma-encoded values, so the filter's grayscale does nothing more and the
// page looks the same, while a grey file is 15-30% lighter than a colour one.
// The originals stay as they are (they are the `src` fallback, the structured
// data image and the source of these files).
//
// /img/* is cached immutably for a year (netlify.toml), so a file is written
// only when it does not exist yet; --force rewrites them all (rename the
// original instead if it ever changes, so returning visitors see the change).
//
// Needs sharp, which is not a project dependency (only this script uses it):
//   npm install --no-save sharp
//   node scripts/images.js [--force]     (npm run images)

const fs = require('fs');
const path = require('path');

let sharp;
try { sharp = require('sharp'); } catch (e) {
  console.error('images.js needs sharp: npm install --no-save sharp');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const QUALITY = 75;
// CSS grayscale(1): each channel becomes 0.2126 R + 0.7152 G + 0.0722 B.
const GREY = [0.2126, 0.7152, 0.0722];

// The PHOTOS block of site-pages.jsx: one object literal, read as data.
function photos() {
  const src = fs.readFileSync(path.join(ROOT, 'site-pages.jsx'), 'utf8');
  const block = (src.match(/PHOTOS:BEGIN\n(?:\s*\/\/.*\n)*\s*const PHOTOS = (\{[\s\S]*?\n\s*\});\n\s*\/\/ PHOTOS:END/) || [])[1];
  if (!block) throw new Error('images.js: PHOTOS block not found in site-pages.jsx');
  // eslint-disable-next-line no-new-func
  return new Function(`return (${block});`)();
}

// As site-pages.jsx names them: /img/aggelos-about.webp at 480 →
// img/aggelos-about-480.webp; with `name`, img/<name>-480.webp.
const variantOf = (src, p, w) => (p.name ? 'img/' + p.name : src.replace(/^\//, '').replace(/\.\w+$/, '')) + `-${w}.webp`;

async function main() {
  const force = process.argv.includes('--force');
  let written = 0;
  for (const [src, p] of Object.entries(photos())) {
    const original = path.join(ROOT, src);
    const meta = await sharp(original).metadata();
    const [left, top, width, height] = p.crop || [0, 0, meta.width, meta.height];
    if (left + width > meta.width || top + height > meta.height) throw new Error(`images.js: ${src} is ${meta.width}x${meta.height}, the crop does not fit`);
    for (const w of p.widths) {
      if (w > width) throw new Error(`images.js: ${src} is ${width}px wide (as cut), cannot make ${w}px`);
      const rel = variantOf(src, p, w);
      const out = path.join(ROOT, rel);
      if (fs.existsSync(out) && !force) continue;
      await sharp(original)
        .extract({ left, top, width, height })
        .resize({ width: w })
        .recomb([GREY, GREY, GREY])
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      written++;
      console.log(`  ${rel}  ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
    }
  }
  console.log(`images.js: ${written} file(s) written`);
}

main().catch((err) => { console.error(err); process.exit(1); });
