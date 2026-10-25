// gen-sitemap.js — build sitemap.xml from scripts/seo/site-meta.js.
//
// The page table is the single source of truth, so a URL can only appear in the
// sitemap if it also has a canonical, a title and a description. Redirected,
// noindex and retired URLs are absent by construction: they are not in the table.
//
// lastmod comes from the page file's own git history: the last commit that
// changed what the page itself says (falling back to the file mtime), so the
// dates reflect real content changes rather than the date of the build. Every
// page is committed with its content prerendered (scripts/seo/prerender.js),
// so its file changes whenever what it shows does; the shared sources
// (site-copy.jsx holds all the canonical pages) would move every page's date
// when one of them changes. A commit that only changes what every page shares
// (the header and footer links, a bundle's ?v= stamp) moves no page's date.
//
// Run: node scripts/gen-sitemap.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ORIGIN, PAGES } = require('./seo/site-meta.js');
const ROOT = path.resolve(__dirname, '..');

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });

// What a page says, as opposed to what every page shares: its <head> metadata
// without the bundle stamps, and its <main>, the page between the site header
// and footer.
function substance(html) {
  const head = (html.match(/<head>[\s\S]*?<\/head>/) || [''])[0].replace(/\?v=[0-9a-f]+/g, '');
  const main = (html.match(/<main[\s\S]*<\/main>/) || [html])[0];
  return head + main;
}
function at(commit, file) {
  try { return substance(git(['show', `${commit}:${file}`])); } catch (e) { return null; }
}

function lastmodFor(p) {
  let log = [];
  try {
    log = git(['log', '--format=%H %cs', '--', p.file]).split('\n').filter(Boolean).map((l) => l.split(' '));
  } catch (e) { /* not a git checkout */ }
  // The newest commit whose version of the page differs from the one before.
  for (let i = 0; i < log.length; i++) {
    const now = at(log[i][0], p.file);
    if (i + 1 === log.length || now === null || now !== at(log[i + 1][0], p.file)) return log[i][1];
  }
  // Uncommitted or brand-new file: fall back to its mtime.
  const st = fs.statSync(path.join(ROOT, p.file));
  return st.mtime.toISOString().slice(0, 10);
}

const dates = new Map(PAGES.map((p) => [p, lastmodFor(p)]));
const rows = PAGES.map((p) => {
  const lastmod = dates.get(p);
  return `  <url>\n    <loc>${ORIGIN}${p.url}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
         `    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
});

const out = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  rows.join('\n') + '\n</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), out);
console.log(`sitemap.xml: ${PAGES.length} URLs`);
for (const p of PAGES) console.log(`  ${dates.get(p)}  ${ORIGIN}${p.url}`);
