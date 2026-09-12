// gen-sitemap.js — build sitemap.xml with only canonical 200 URLs.
// Paired core pages carry reciprocal hreflang alternates. Redirected/removed
// URLs are excluded. Run: node scripts/gen-sitemap.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const O = 'https://aggelosmouzakitis.com';
const TODAY = '2026-08-15';

// Paired core pages (English + Greek) — get hreflang alternates.
// /1-to-1/ and /book/ (and their /el/ pairs) were unpublished — removed here.
const CORE = ['/', '/about/', '/reviews/', '/startingdiagnostic/', '/confidentiality/'];
// New 1:1 offer landing pages (English only, linked from the "Work with me"
// dropdown). Single search intent each; no genuine EL equivalent → no hreflang.
const OFFERS = [
  '/psychotherapy-decision-coaching/',
  '/career-strategy-consulting/',
  '/solopreneur-growth-consulting/',
];
// Single blog (English chrome canonical) — one entry, no fake /el alternate
const BLOG_INDEX = '/blog/';
// Retained single-language SEO pages (English) — no cross-language hreflang
const RETAINED = [
  '/greek-speaking-therapist-london/',
  '/greek-speaking-therapist-manchester/',
  '/greek-speaking-therapist-new-york/',
  '/greek-speaking-therapist-dublin/',
  '/ask-me-anything/',
];
// Restored English SEO landing pages (persona + specialty). Single search intent
// each; no genuine EL equivalent, so no cross-language hreflang.
// /founders/, /solopreneurs/ and /career-transition-therapy/ were unpublished.
const EN_SEO = [
  '/therapy-for-founders/',
  '/therapy-for-executives/',
  '/imposter-syndrome-therapy/',
  '/executive-burnout-therapy/',
];
// Greek SEO landing pages under /el/ (mined from the retired .gr site). Single
// search intent each; no genuine EN equivalent, so no cross-language hreflang.
// /el/career-coaching/ was unpublished.
const EL_SEO = [
  '/el/executive-coaching/',
  '/el/burnout/',
  '/el/imposter-syndrome/',
];

const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog/posts.json'), 'utf8'));

function pairedUrl(p, priority) {
  const en = O + p;
  const el = O + '/el' + p;
  const alts =
    `\n    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>` +
    `\n    <xhtml:link rel="alternate" hreflang="el" href="${el}"/>` +
    `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`;
  const one = (loc) => `  <url>\n    <loc>${loc}</loc>${alts}\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  return [one(en), one(el)].join('\n');
}
function plainUrl(loc, priority, freq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq || 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const parts = [];
// Home first (priority 1.0), then the rest of the core
parts.push(pairedUrl('/', '1.0'));
for (const p of CORE.slice(1)) parts.push(pairedUrl(p, '0.7'));
// New 1:1 offer landing pages (primary commercial pages)
for (const p of OFFERS) parts.push(plainUrl(O + p, '0.8'));
// Orientation + contact entry points
parts.push(plainUrl(O + '/start-here/', '0.8'));
parts.push(plainUrl(O + '/contact/', '0.7'));
// WTF Friday — free weekly office hours (English only; recurring → weekly)
parts.push(plainUrl(O + '/wtf-friday/', '0.7', 'weekly'));
// Blog index (single canonical, weekly)
parts.push(plainUrl(O + BLOG_INDEX, '0.9', 'weekly'));
// Retained SEO pages
for (const p of RETAINED) parts.push(plainUrl(O + p, '0.6'));
// Restored English SEO landing pages
for (const p of EN_SEO) parts.push(plainUrl(O + p, '0.6'));
// Greek SEO landing pages
for (const p of EL_SEO) parts.push(plainUrl(O + p, '0.6'));
// Blog posts
for (const post of posts) parts.push(plainUrl(O + '/blog/' + post.slug + '/', '0.7'));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${parts.join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
const count = (xml.match(/<loc>/g) || []).length;
console.log(`sitemap.xml written — ${count} URLs (${CORE.length * 2} core, 1 blog index, ${RETAINED.length} retained, ${EN_SEO.length} en-seo, ${EL_SEO.length} el-seo, ${posts.length} posts)`);
