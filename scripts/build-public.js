// build-public.js — assemble public/, the only directory Netlify serves.
//
// The repository holds more than the website: JSX sources, build and QA
// scripts, planning documents, the archive's build inputs, tooling. Netlify
// publishes public/ (netlify.toml [build] publish), and this script fills it
// from an allowlist, so nothing outside the lists below can be requested:
//   pages  every page in scripts/seo/site-meta.js (the 25 canonical pages,
//          the Work & Life Check and the two free tools), plus EXTRA_PAGES — served on purpose, but
//          outside the sitemap;
//   FILES  the root files browsers and crawlers ask for, and the bundles the
//          pages load;
//   DIRS   img/ (image files only) and archive/, copied whole, exactly as
//          scripts/archive/build.js writes it (private, noindex).
// Then every local src/href in the published pages must be a published file
// or a netlify.toml redirect: a page or asset missing from the lists fails
// the build instead of shipping a broken link. The archive is exempt: it is a
// frozen record of retired pages, broken references included.
//
// Node built-ins only, copying the committed, prebuilt output, so Netlify
// needs no compile step.
//   node scripts/build-public.js

const fs = require('fs');
const path = require('path');
const { PAGES } = require('./seo/site-meta.js');
const { loadRedirects, match } = require('./seo/netlify-emulator.js');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const EXTRA_PAGES = [
  '404.html', // also the body of every 410
  'ask-me-anything/el/index.html', // printed QR codes; noindex (see the page)
  'hot-seat-coworking-spaces/index.html', // utility PDF link; noindex
  'hot-seat-coworking-spaces/hot-seat-coworking.pdf',
];

const FILES = [
  'robots.txt', 'sitemap.xml', 'llms.txt', 'manifest.json',
  'favicon.ico', 'favicon.svg', 'favicon.png', 'apple-touch-icon.png',
  'f4a06bec48967c20f68efb4d562c6b71.txt', // IndexNow key (scripts/seo/indexnow.js)
  'react.production.min.js', 'react-dom.production.min.js',
  'site-nav.js', 'site-chrome.js', 'site-copy.js', 'site-pages.js', 'lead-capture.js',
  'clarity-data.js', 'clarity-tools.js', 'work-life-check.js',
];

// [directory, which files] — a README dropped into img/ is not an asset.
const DIRS = [
  ['img', (f) => /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(f)],
  ['fonts', (f) => /\.woff2$/i.test(f)], // self-hosted, see scripts/fonts.js
  ['archive', () => true],
];

// Plain recursive copy (fs.cpSync is only stable from Node 22.3).
function copyTree(from, to, keep) {
  if (fs.statSync(from).isDirectory()) {
    for (const name of fs.readdirSync(from)) copyTree(path.join(from, name), path.join(to, name), keep);
  } else if (keep(from)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

function copy(rel, keep = () => true) {
  const from = path.join(ROOT, rel);
  if (!fs.existsSync(from)) throw new Error(`build-public: ${rel} is listed but does not exist`);
  copyTree(from, path.join(PUBLIC, rel), keep);
}

function files(dir, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) files(p, out);
    else out.push(p);
  }
  return out;
}

// A local URL resolves if it names a published file (a directory by its
// index.html) or matches a redirect rule.
function resolves(url, redirects) {
  const p = decodeURIComponent(url.split(/[?#]/)[0]);
  const file = path.join(PUBLIC, p.endsWith('/') ? p + 'index.html' : p);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return true;
  if (fs.existsSync(path.join(file, 'index.html'))) return true;
  return redirects.some((r) => match(r, p));
}

function build() {
  fs.rmSync(PUBLIC, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC);
  const pages = PAGES.map((p) => p.file).concat(EXTRA_PAGES);
  for (const rel of pages.concat(FILES)) copy(rel);
  for (const [dir, keep] of DIRS) copy(dir, keep);

  // Every local reference in the published pages must resolve.
  const redirects = loadRedirects();
  const broken = [];
  const published = files(PUBLIC);
  const archive = path.join(PUBLIC, 'archive') + path.sep;
  for (const f of published.filter((x) => x.endsWith('.html') && !x.startsWith(archive))) {
    const html = fs.readFileSync(f, 'utf8');
    for (const m of html.matchAll(/\s(?:src|href)="(\/(?!\/)[^"]*)"/g)) {
      if (!resolves(m[1], redirects)) broken.push(`${path.relative(PUBLIC, f)} → ${m[1]}`);
    }
  }
  if (broken.length) {
    throw new Error(`build-public: ${broken.length} local reference(s) not published:\n  ` +
      [...new Set(broken)].join('\n  '));
  }
  return { pages: pages.length, files: published.length };
}

module.exports = { PUBLIC, build };

if (require.main === module) {
  const { pages, files: n } = build();
  console.log(`public/: ${pages} pages, ${n} files`);
}
