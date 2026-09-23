// apply-metadata.js — write scripts/seo/site-meta.js into every page's <head>.
//
// Strips the tags it owns (title, description, canonical, robots, Open Graph,
// Twitter, hreflang, JSON-LD) and re-emits exactly one of each, so a page can
// never end up with two canonicals or stale metadata from a previous design.
//
// Run:  node scripts/seo/apply-metadata.js
// Then: node scripts/seo/build-sitemap.js && npm run build && prerender

const fs = require('fs');
const path = require('path');
const { ORIGIN, SITE_NAME, PAGES } = require('./site-meta.js');
const ROOT = path.resolve(__dirname, '..', '..');

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Tags this script owns. Anything matching these is removed before re-emitting.
const OWNED = [
  /[ \t]*<title>[\s\S]*?<\/title>\r?\n?/gi,
  /[ \t]*<meta\s+name=["']description["'][^>]*>\r?\n?/gi,
  /[ \t]*<meta\s+name=["']robots["'][^>]*>\r?\n?/gi,
  /[ \t]*<link\s+rel=["']canonical["'][^>]*>\r?\n?/gi,
  /[ \t]*<meta\s+property=["']og:[^"']*["'][^>]*>\r?\n?/gi,
  /[ \t]*<meta\s+name=["']twitter:[^"']*["'][^>]*>\r?\n?/gi,
  /[ \t]*<link\s+rel=["']alternate["'][^>]*hreflang=[^>]*>\r?\n?/gi,
  /[ \t]*<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>\r?\n?/gi,
];

function headBlock(p) {
  const url = ORIGIN + p.url;
  const ogImage = p.ogImage || ORIGIN + '/img/og/home.png';
  const L = [];
  L.push(`<title>${esc(p.title)}</title>`);
  L.push(`<meta name="description" content="${esc(p.description)}">`);
  // Explicitly indexable. max-image-preview:large keeps large thumbnails in
  // search and in AI answer surfaces that honour it.
  L.push(`<meta name="robots" content="${p.robots || 'index, follow, max-image-preview:large'}">`);
  L.push(`<link rel="canonical" href="${url}">`);
  L.push(`<meta property="og:type" content="${p.ogType || 'website'}">`);
  L.push(`<meta property="og:site_name" content="${SITE_NAME}">`);
  L.push(`<meta property="og:locale" content="en_IE">`);
  L.push(`<meta property="og:title" content="${esc(p.ogTitle || p.title)}">`);
  L.push(`<meta property="og:description" content="${esc(p.ogDescription || p.description)}">`);
  L.push(`<meta property="og:url" content="${url}">`);
  L.push(`<meta property="og:image" content="${ogImage}">`);
  L.push(`<meta property="og:image:type" content="image/png">`);
  L.push(`<meta property="og:image:width" content="1200">`);
  L.push(`<meta property="og:image:height" content="630">`);
  L.push(`<meta property="og:image:alt" content="${esc(p.ogImageAlt || p.ogTitle || p.title)}">`);
  L.push(`<meta name="twitter:card" content="summary_large_image">`);
  L.push(`<meta name="twitter:title" content="${esc(p.ogTitle || p.title)}">`);
  L.push(`<meta name="twitter:description" content="${esc(p.ogDescription || p.description)}">`);
  L.push(`<meta name="twitter:image" content="${ogImage}">`);
  L.push(`<meta name="twitter:image:alt" content="${esc(p.ogImageAlt || p.ogTitle || p.title)}">`);
  // The site is English-only since the Greek pages were retired, so every page
  // is its own en and x-default target.
  L.push(`<link rel="alternate" hreflang="en" href="${url}">`);
  L.push(`<link rel="alternate" hreflang="x-default" href="${url}">`);

  const graph = (p.schema || []).slice();
  if (p.faq && p.faq.length) {
    graph.push({
      '@type': 'FAQPage', '@id': url + '#faq',
      isPartOf: { '@id': url + '#webpage' },
      mainEntity: p.faq,
    });
  }
  if (graph.length) {
    L.push(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`);
  }
  return L.map((l) => l + '\n').join('');
}

let changed = 0;
const report = [];
for (const p of PAGES) {
  const file = path.join(ROOT, p.file);
  if (!fs.existsSync(file)) { report.push({ url: p.url, status: 'MISSING FILE' }); continue; }
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Only ever touch the <head>: the prerendered #root body can contain the same
  // strings (a JSON-LD snippet quoted in copy, say) and must be left alone.
  const hi = html.indexOf('<head>');
  const he = html.indexOf('</head>');
  if (hi < 0 || he < 0) { report.push({ url: p.url, status: 'NO HEAD' }); continue; }
  let head = html.slice(hi + 6, he);
  for (const re of OWNED) head = head.replace(re, '');
  head = head.replace(/\n{3,}/g, '\n\n').replace(/\s*$/, '\n');
  head += headBlock(p);

  html = html.slice(0, hi + 6) + head + html.slice(he);
  if (html !== before) { fs.writeFileSync(file, html); changed++; }
  report.push({ url: p.url, status: html !== before ? 'updated' : 'unchanged', title: p.title });
}

console.log(`apply-metadata: ${changed}/${PAGES.length} pages written\n`);
for (const r of report) console.log(`  ${r.status.padEnd(9)} ${r.url}`);
