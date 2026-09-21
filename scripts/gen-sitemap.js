// gen-sitemap.js — build sitemap.xml with only canonical, indexable 200 URLs.
// The site is English-only now (Greek /el/ retired → 301), so there are no
// hreflang alternates. Redirected / noindex / deactivated URLs are excluded.
// Run: node scripts/gen-sitemap.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const O = 'https://aggelosmouzakitis.com';
const TODAY = '2026-09-21';

// Core pages (English only).
const CORE = ['/about/', '/reviews/', '/confidentiality/'];
// Primary commercial 1:1 offers (linked from the "Work with me" dropdown).
const OFFERS = [
  '/psychotherapy-decision-coaching/',
  '/career-strategy-consulting/',
  '/solopreneur-growth-consulting/',
];
// Free Tools — the collection page plus the five live clarity-tool diagnostics
// that sit inside it. The old /clarity-tools/ URLs are 301s and stay out.
const FREE_TOOLS = [
  '/free-tools/business-constraint/',
  '/free-tools/strategy-or-execution/',
  '/free-tools/quit-your-job/',
  '/free-tools/become-a-solopreneur/',
  '/free-tools/burned-out/',
];
// English SEO landing pages (single search intent each, no EL equivalent).
const EN_SEO = [
  '/therapy-for-founders/',
  '/therapy-for-executives/',
  '/imposter-syndrome-therapy/',
  '/executive-burnout-therapy/',
];

function plainUrl(loc, priority, freq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq || 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const parts = [];
parts.push(plainUrl(O + '/', '1.0'));
for (const p of CORE) parts.push(plainUrl(O + p, '0.7'));
for (const p of OFFERS) parts.push(plainUrl(O + p, '0.8'));
// High-intent + free entry points. /free-tools/ is the site's primary discovery
// destination, so it carries the highest priority after the homepage.
parts.push(plainUrl(O + '/free-tools/', '0.9'));
for (const p of FREE_TOOLS) parts.push(plainUrl(O + p, '0.7'));
parts.push(plainUrl(O + '/start-here/', '0.8'));
parts.push(plainUrl(O + '/wtf-friday/', '0.7', 'weekly'));
parts.push(plainUrl(O + '/ask-me-anything/', '0.6'));
parts.push(plainUrl(O + '/contact/', '0.7'));
// English SEO landing pages
for (const p of EN_SEO) parts.push(plainUrl(O + p, '0.6'));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${parts.join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
const count = (xml.match(/<loc>/g) || []).length;
console.log(`sitemap.xml written — ${count} URLs (1 home, ${CORE.length} core, ${OFFERS.length} offers, 1 free-tools hub + ${FREE_TOOLS.length} tools, ${EN_SEO.length} en-seo, + start-here/wtf/ama/contact)`);
