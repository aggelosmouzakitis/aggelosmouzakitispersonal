// gen-sitemap.js — build sitemap.xml from scripts/seo/site-meta.js.
//
// The page table is the single source of truth, so a URL can only appear in the
// sitemap if it also has a canonical, a title and a description. Redirected,
// noindex and retired URLs are absent by construction: they are not in the table.
//
// lastmod comes from the file's own git history (the last commit that touched
// that page or the source that renders it), falling back to the file mtime, so
// the dates reflect real content changes rather than the date of the build.
//
// Run: node scripts/gen-sitemap.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ORIGIN, PAGES } = require('./seo/site-meta.js');
const ROOT = path.resolve(__dirname, '..');

// Page → the sources that actually change its content. A page's lastmod is the
// most recent commit date across its own file and those sources.
const SOURCES = {
  '/': ['core-pages-v2.jsx'],
  '/work-with-me/': ['work-with-me.jsx'],
  '/about/': ['core-pages-v2.jsx'],
  '/reviews/': ['core-pages-v2.jsx', 'content-pages.jsx'],
  '/free-tools/': ['free-tools.jsx'],
  '/find-your-focus-area/': ['focus-area-data.jsx', 'focus-area-scoring.jsx', 'focus-area-content.jsx', 'focus-area.jsx'],
  '/contact/': ['contact.jsx'],
  '/wtf-friday/': ['wtf-friday.jsx'],
  '/confidentiality/': ['content-pages.jsx'],
};
const TOOL_SOURCES = ['clarity-data.jsx', 'clarity-tools.jsx'];
const SPECIALTY_SOURCES = ['content-pages.jsx'];

function lastCommitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file],
      { cwd: ROOT, encoding: 'utf8' }).trim();
    return out || null;
  } catch (e) { return null; }
}

function lastmodFor(p) {
  const files = [p.file];
  if (SOURCES[p.url]) files.push(...SOURCES[p.url]);
  else if (p.url.startsWith('/free-tools/')) files.push(...TOOL_SOURCES);
  else files.push(...SPECIALTY_SOURCES);

  const dates = files
    .map((f) => (fs.existsSync(path.join(ROOT, f)) ? lastCommitDate(f) : null))
    .filter(Boolean);
  if (dates.length) return dates.sort().pop();
  // Uncommitted or brand-new file: fall back to its mtime.
  const st = fs.statSync(path.join(ROOT, p.file));
  return st.mtime.toISOString().slice(0, 10);
}

const rows = PAGES.map((p) => {
  const lastmod = lastmodFor(p);
  return `  <url>\n    <loc>${ORIGIN}${p.url}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
         `    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
});

const out = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  rows.join('\n') + '\n</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), out);
console.log(`sitemap.xml: ${PAGES.length} URLs`);
for (const p of PAGES) console.log(`  ${lastmodFor(p)}  ${ORIGIN}${p.url}`);
