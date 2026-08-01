/*
 * SOMO — static site generator.
 * Builds the bilingual site into /somo (EL, the default) and /somo/en (EN).
 * Run:  node somo/src/build.js            (both languages)
 *       node somo/src/build.js el         (one language, for quick checks)
 */
const fs = require('fs');
const path = require('path');
const { config } = require('./config');
const C = require('./components');
const { render } = require('./pages');

const ROOT = path.resolve(__dirname, '..');          // .../somo
const REPO = path.resolve(__dirname, '../..');       // repo root
function loadDict(lang) { return require('./i18n/' + lang); }

// Page registry: key -> url slug (empty = home).
const PAGES = [
  { key: 'home', slug: '' },
  { key: 'circles', slug: 'somo-circles' },
  { key: 'flow', slug: 'somo-flow' },
  { key: 'outdoors', slug: 'somo-outdoors' },
  { key: 'organisations', slug: 'for-organisations' },
  { key: 'about', slug: 'about' },
  { key: 'safety', slug: 'safety-faq' },
  { key: 'privacy', slug: 'privacy' },
  { key: 'participation', slug: 'participation' },
];
const SLUG = Object.fromEntries(PAGES.map((p) => [p.key, p.slug]));

function pathFor(lang, key) {
  const base = lang === 'en' ? '/en' : '';
  const slug = SLUG[key];
  return (base + '/' + (slug ? slug + '/' : '')) || '/';
}
function pathsFor(lang) {
  const o = {};
  PAGES.forEach((p) => { o[p.key] = pathFor(lang, p.key); });
  return o;
}
function mkdirp(dir) { fs.mkdirSync(dir, { recursive: true }); }
function writeFile(rel, content) {
  const abs = path.join(ROOT, rel);
  mkdirp(path.dirname(abs));
  fs.writeFileSync(abs, content);
}

/* ---- JSON-LD ------------------------------------------------------------- */
function orgNode(siteUrl, t, lang) {
  const node = {
    '@type': 'Organization',
    '@id': siteUrl + '/#org',
    name: 'SOMO',
    url: siteUrl + (lang === 'en' ? '/en/' : '/'),
    description: t.meta.home.description,
    founder: {
      '@type': 'Person',
      name: lang === 'el' ? 'Άγγελος Μουζακίτης' : 'Aggelos Mouzakitis',
      jobTitle: lang === 'el'
        ? 'Ψυχοθεραπευτής ενσωματωτικής προσέγγισης, συντονιστής ομάδων'
        : 'Integrative psychotherapist and facilitator',
    },
  };
  const sameAs = Object.values(config.social).filter(Boolean);
  if (sameAs.length) node.sameAs = sameAs;
  return node;
}
function faqNode(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a.join(' ') },
    })),
  };
}
function breadcrumbNode(siteUrl, lang, key, t) {
  const homeName = t.nav.home;
  const items = [{ '@type': 'ListItem', position: 1, name: homeName, item: siteUrl + pathFor(lang, 'home') }];
  if (key !== 'home') {
    items.push({ '@type': 'ListItem', position: 2, name: t.meta[key].title.split(' · ')[0].split(' | ')[0], item: siteUrl + pathFor(lang, key) });
  }
  return { '@type': 'BreadcrumbList', itemListElement: items };
}
function jsonldFor(lang, key, t, siteUrl) {
  const graph = [];
  if (key === 'home') {
    graph.push({ '@type': 'WebSite', '@id': siteUrl + '/#website', name: 'SOMO', url: siteUrl + '/', inLanguage: lang === 'el' ? 'el' : 'en' });
    graph.push(orgNode(siteUrl, t, lang));
  }
  if (key === 'about') graph.push(orgNode(siteUrl, t, lang));
  if (t[key] && t[key].faq) graph.push(faqNode(t[key].faq));
  graph.push(breadcrumbNode(siteUrl, lang, key, t));
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}

/* ---- Assets -------------------------------------------------------------- */
function copyAssets() {
  const imgDir = path.join(ROOT, 'assets', 'img');
  mkdirp(imgDir);
  // Real founder photo (same person, self-contained copy).
  const src = path.join(REPO, 'img', 'aggelos.jpg');
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(imgDir, 'aggelos.jpg'));
  // Brand favicon (SVG). PNG variants are produced by scripts/og.js.
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="9" fill="#17130D"/><text x="24" y="34" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800" fill="#F2ECDF" text-anchor="middle">S</text><circle cx="37" cy="31" r="3.4" fill="#E7500E"/></svg>`;
  fs.writeFileSync(path.join(imgDir, 'favicon.svg'), favicon);
}

/* ---- robots + sitemap ---------------------------------------------------- */
function writeRobots(siteUrl) {
  writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
function writeSitemap(siteUrl, langs) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];
  langs.forEach((lang) => {
    PAGES.forEach((p) => {
      const loc = siteUrl + pathFor(lang, p.key);
      const alts = ['el', 'en'].map((l) =>
        `<xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl + pathFor(l, p.key)}"/>`).join('')
        + `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl + pathFor('el', p.key)}"/>`;
      const priority = p.key === 'home' ? '1.0' : (['privacy', 'participation'].includes(p.key) ? '0.3' : '0.8');
      urls.push(`  <url><loc>${loc}</loc>${alts}<lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`);
    });
  });
  writeFile('sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
}

/* ---- Build --------------------------------------------------------------- */
function build(langs) {
  const siteUrl = config.siteUrl;
  copyAssets();
  writeRobots(siteUrl);
  writeSitemap(siteUrl, ['el', 'en']);

  let count = 0;
  langs.forEach((lang) => {
    const t = loadDict(lang);
    const paths = pathsFor(lang);
    const altLang = lang === 'el' ? 'en' : 'el';
    PAGES.forEach((p) => {
      const key = p.key;
      const meta = t.meta[key];
      const ctx = {
        lang, t, page: key, paths,
        altLang,
        altLangLabel: altLang === 'en' ? 'EN' : 'ΕΛ',
        altLangFull: altLang === 'en' ? 'English' : 'Ελληνικά',
        altUrl: pathFor(altLang, key),
        canonical: siteUrl + pathFor(lang, key),
        elUrl: siteUrl + pathFor('el', key),
        enUrl: siteUrl + pathFor('en', key),
        ogImage: siteUrl + `/assets/img/og/somo-${key}-${lang}.png`,
      };
      const head = {
        title: meta.title,
        description: meta.description,
        ogAlt: meta.ogAlt,
        jsonld: jsonldFor(lang, key, t, siteUrl),
      };
      const body = render(ctx);
      const html = C.layout(ctx, head, body);
      const rel = pathFor(lang, key).replace(/^\//, '') + 'index.html';
      writeFile(rel, html);
      count++;
    });
  });
  // 404 page (Greek default), in the same design system.
  if (langs.includes('el')) {
    const t = loadDict('el');
    const paths = pathsFor('el');
    const ctx = {
      lang: 'el', t, page: 'notfound', paths,
      altLang: 'en', altLangLabel: 'EN', altLangFull: 'English',
      altUrl: '/en/', canonical: siteUrl + '/404', elUrl: siteUrl + '/', enUrl: siteUrl + '/en/',
      ogImage: siteUrl + '/assets/img/og/somo-home-el.png',
    };
    const body = `<section class="section" style="min-height:60vh;display:flex;align-items:center"><div class="container">
      <p class="eyebrow">404</p>
      <h1 class="display" style="margin-top:18px">${C.e(t.common.notFoundTitle)}</h1>
      <p class="lead measure" style="margin-top:20px">${C.e(t.common.notFoundBody)}</p>
      <div class="pagehero__actions">
        <a class="btn btn-primary" href="/">${C.e(t.common.notFoundCta)} <span class="arrow" aria-hidden="true">→</span></a>
        ${C.lumaLink(ctx, 'allEvents', { label: t.common.viewExperiences, class: 'btn btn-secondary', placement: '404', analytics: 'luma_all_events_click' })}
      </div>
    </div></section>`;
    const head = { title: '404 · SOMO', description: t.common.notFoundBody, ogAlt: 'SOMO', jsonld: [] };
    writeFile('404.html', C.layout(ctx, head, body));
  }

  console.log(`SOMO build complete: ${count} pages (${langs.join(', ')}). Site URL: ${siteUrl}`);
  if (siteUrl.includes('somo.example')) console.log('NOTE: SITE_URL is a placeholder. Set SITE_URL before launch.');
  if (!config.luma.allEvents || config.luma.allEvents.includes('lu.ma/somo')) console.log('NOTE: Luma URLs are placeholders. Set LUMA_* before launch.');
}

const argLangs = process.argv.slice(2).filter((a) => a === 'el' || a === 'en');
build(argLangs.length ? argLangs : ['el', 'en']);
