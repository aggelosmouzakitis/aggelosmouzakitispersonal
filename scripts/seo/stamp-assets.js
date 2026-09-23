// stamp-assets.js — rewrite every local <script src="/x.js?v=…"> to the file's
// content hash.
//
// netlify.toml serves /*.js with `max-age=31536000, immutable`, which is right
// only if the URL changes when the file does. The ?v= number used to be typed
// by hand, so it drifted: site-chrome.js shipped as ?v=65 on fifteen pages and
// ?v=66 on one, and a deploy that changed the bundle without touching the
// number left every returning visitor pinned to a year-old copy of the JS —
// fresh HTML, stale script, stale CSS (the CSS lives inside these bundles).
//
// Hashing the file removes the decision: the URL changes exactly when the
// bytes change, and never otherwise. seo-check.js fails if any page is stamped
// with anything but the current hash, so this cannot silently rot again.
//
// Run after `npm run build` (the hash must match the built file):
//   node scripts/seo/stamp-assets.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');
// Directories that hold no deployed HTML, or hold copies we do not stamp.
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'admin']);

function htmlFiles(dir, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (d.isDirectory()) {
      if (SKIP_DIRS.has(d.name)) continue;
      htmlFiles(path.join(dir, d.name), out);
    } else if (d.name.endsWith('.html')) {
      out.push(path.join(dir, d.name));
    }
  }
  return out;
}

const hashes = new Map();
function hashOf(asset) {
  if (hashes.has(asset)) return hashes.get(asset);
  const file = path.join(ROOT, asset);
  const h = fs.existsSync(file)
    ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
    : null;
  hashes.set(asset, h);
  return h;
}

// src="/name.js?v=anything" — local, root-level bundles only.
const SRC_RE = /src="(\/[A-Za-z0-9._-]+\.js)(\?v=[^"]*)?"/g;

function stamp(html) {
  const seen = new Set();
  const out = html.replace(SRC_RE, (m, asset) => {
    const h = hashOf(asset);
    if (!h) return m; // not a file we ship — leave it exactly as it is
    seen.add(asset);
    return `src="${asset}?v=${h}"`;
  });
  return { out, seen };
}

if (require.main === module) {
  let changed = 0;
  const files = htmlFiles(ROOT);
  const missing = new Set();
  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const { out, seen } = stamp(before);
    for (const a of seen) if (!hashOf(a)) missing.add(a);
    if (out !== before) { fs.writeFileSync(file, out); changed++; }
  }
  console.log(`stamp-assets: ${changed}/${files.length} pages rewritten`);
  for (const [asset, h] of [...hashes].sort()) {
    console.log(`  ${h || 'MISSING '.padEnd(10)}  ${asset}`);
  }
}

module.exports = { hashOf, stamp, SRC_RE };
