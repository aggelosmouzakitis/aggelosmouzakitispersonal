// seo-check.js — crawl the built site and fail on anything that would hurt search.
//
// Serves the repo over HTTP with the same redirect rules Netlify applies, then
// checks every URL in scripts/seo/site-meta.js plus every internal link it can
// reach. Exits non-zero if any ERROR-level problem is found, so it can gate a
// deploy.
//
//   node scripts/seo/seo-check.js          # report + exit code
//   node scripts/seo/seo-check.js --warn   # also print non-blocking warnings
//
// Checks: HTTP status, redirect hops, real 404s, title (present + unique),
// meta description (present + unique on priority pages), canonical (present,
// self-referencing, single), robots (no accidental noindex), exactly one H1,
// Open Graph completeness, og:url === canonical, OG image resolves, JSON-LD
// parses and its FAQ entries exist in the HTML, internal links that 404 or go
// through a redirect, retired URLs linked from anywhere, orphan pages, and
// sitemap integrity.

const fs = require('fs');
const path = require('path');
const http = require('http');
const { ORIGIN, PAGES } = require('./site-meta.js');
const { hashOf, SRC_RE } = require('./stamp-assets.js');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 8123;
const SHOW_WARN = process.argv.includes('--warn');

// URLs that must never appear as an internal link or in the sitemap again.
const RETIRED = [
  '/psychotherapy-decision-coaching/', '/career-strategy-consulting/',
  '/solopreneur-growth-consulting/', '/start-here/', '/1-to-1/',
  '/startingdiagnostic/', '/clarity-tools/', '/blog/', '/el/',
];
// Visible labels from the retired three-service architecture.
const RETIRED_LABELS = [
  'Psychotherapy / decision coaching', 'Career strategy consulting',
  'Solo business growth consulting', 'Not sure where to start?',
  'Licensed Psychotherapist', 'licensed psychotherapist',
];
// Superseded numbers. The approved claim is "100+ technology companies"; the
// older "500+ companies" survived only in a two-versions-ago migration note,
// with nothing in the repo establishing it as a separate, accurate metric.
const SUPERSEDED_CLAIMS = [/\b500\+?\s*(?:compan|business|\u03b5\u03c0\u03b9\u03c7\u03b5\u03b9\u03c1)/i, /more than 500\s*(?:compan|business|of them)/i];

const errors = [];
const warnings = [];
const err = (url, msg) => errors.push(`${url} — ${msg}`);
const warn = (url, msg) => warnings.push(`${url} — ${msg}`);

// ─── Netlify redirect emulation ──────────────────────────────────────────────
function loadRedirects() {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  return toml.split('[[redirects]]').slice(1).map((b) => {
    const g = (k) => (b.match(new RegExp(k + '\\s*=\\s*"([^"]+)"')) || [])[1];
    const n = (b.match(/status\s*=\s*(\d+)/) || [])[1];
    return { from: g('from'), to: g('to'), status: n ? +n : 301 };
  }).filter((r) => r.from && r.to);
}
const REDIRECTS = loadRedirects();

function matchRedirect(pathname) {
  for (const r of REDIRECTS) {
    if (r.from.endsWith('/*')) {
      const base = r.from.slice(0, -2);
      if (pathname === base || pathname.startsWith(base + '/')) return r;
    } else if (pathname === r.from || pathname === r.from + '/') return r;
  }
  return null;
}

// ─── Static server ───────────────────────────────────────────────────────────
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

function serve() {
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    const r = matchRedirect(pathname);
    if (r && r.status >= 300 && r.status < 400) {
      res.writeHead(r.status, { Location: r.to }); return res.end();
    }
    let file = path.join(ROOT, pathname);
    if (r && r.status === 200) file = path.join(ROOT, r.to.split('?')[0]);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const nf = path.join(ROOT, '404.html');
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  });
}

function get(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({
        status: res.statusCode, location: res.headers.location,
        headers: res.headers, body: Buffer.concat(chunks).toString('utf8'),
      }));
    }).on('error', () => resolve({ status: 0, body: '' }));
  });
}

// Follow redirects, counting hops, so chains are visible.
async function trace(pathname) {
  const hops = [];
  let cur = pathname;
  for (let i = 0; i < 6; i++) {
    const r = await get(`http://localhost:${PORT}${cur}`);
    if (r.status >= 300 && r.status < 400 && r.location) {
      hops.push({ from: cur, to: r.location, status: r.status });
      cur = r.location.replace(ORIGIN, '');
      continue;
    }
    return { hops, final: cur, status: r.status, body: r.body };
  }
  return { hops, final: cur, status: 0, body: '', loop: true };
}

// ─── HTML helpers ────────────────────────────────────────────────────────────
const one = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1].trim());
const head = (html) => html.slice(html.indexOf('<head>'), html.indexOf('</head>'));
const decode = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function main() {
  const server = serve();
  await new Promise((r) => server.listen(PORT, r));

  const seenTitles = new Map();
  const seenDescs = new Map();
  const linkTargets = new Map(); // path -> Set(pages that link to it)

  // ── Every page in the metadata table ──────────────────────────────────────
  for (const p of PAGES) {
    const url = p.url;
    const t = await trace(url);
    if (t.status !== 200) { err(url, `expected 200, got ${t.status}`); continue; }
    if (t.hops.length) err(url, `indexable URL redirects (${t.hops.length} hop(s))`);

    const html = t.body;
    const h = head(html);
    const body = html.includes('<div id="root">') ? html.split('<div id="root">')[1] : html;

    // title
    const title = decode(one(h, /<title>([\s\S]*?)<\/title>/) || '');
    if (!title) err(url, 'missing <title>');
    else {
      if (seenTitles.has(title)) err(url, `duplicate title, also on ${seenTitles.get(title)}`);
      seenTitles.set(title, url);
      if (title !== p.title) err(url, `title does not match site-meta ("${title}")`);
    }

    // description
    const desc = decode(one(h, /<meta name="description" content="([\s\S]*?)">/) || '');
    if (!desc) err(url, 'missing meta description');
    else {
      if (seenDescs.has(desc)) err(url, `duplicate description, also on ${seenDescs.get(desc)}`);
      seenDescs.set(desc, url);
    }

    // canonical — exactly one, self-referencing, https, trailing slash
    const canons = all(h, /<link rel="canonical" href="([^"]*)"/g);
    if (canons.length === 0) err(url, 'missing canonical');
    else if (canons.length > 1) err(url, `${canons.length} canonical tags`);
    else if (canons[0] !== ORIGIN + url) err(url, `canonical is ${canons[0]}, expected ${ORIGIN + url}`);

    // robots — indexable unless deliberately excluded
    const robots = one(h, /<meta name="robots" content="([^"]*)"/);
    if (robots && /noindex/i.test(robots)) err(url, `noindex on an indexable page ("${robots}")`);
    if (!robots) warn(url, 'no explicit robots meta');

    // exactly one H1, in the crawlable HTML
    const h1s = all(body, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
    if (h1s.length === 0) err(url, 'no H1 in the served HTML');
    else if (h1s.length > 1) err(url, `${h1s.length} H1s`);

    // the page must have real copy before JavaScript runs
    const text = body.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ').trim();
    if (text.length < 500) err(url, `only ${text.length} chars of text in the raw HTML`);

    // Open Graph
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name',
      'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']) {
      if (!h.includes(`property="${prop}"`)) err(url, `missing ${prop}`);
    }
    const ogUrl = one(h, /<meta property="og:url" content="([^"]*)"/);
    if (ogUrl && canons[0] && ogUrl !== canons[0]) err(url, 'og:url does not match canonical');
    const ogImg = one(h, /<meta property="og:image" content="([^"]*)"/);
    if (ogImg) {
      if (!ogImg.startsWith('https://')) err(url, 'og:image is not an absolute https URL');
      const r = await get(`http://localhost:${PORT}${ogImg.replace(ORIGIN, '')}`);
      if (r.status !== 200) err(url, `og:image returns ${r.status} (${ogImg})`);
    }
    if (!h.includes('name="twitter:card"')) err(url, 'missing twitter:card');

    // JSON-LD
    const blocks = all(h, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    if (!blocks.length) err(url, 'no JSON-LD');
    for (const b of blocks) {
      let data;
      try { data = JSON.parse(b); } catch (e) { err(url, 'JSON-LD does not parse'); continue; }
      const graph = data['@graph'] || [data];
      // Every FAQ answer in the schema must exist in the page text.
      for (const node of graph) {
        if (node['@type'] !== 'FAQPage') continue;
        for (const q of node.mainEntity || []) {
          if (!text.includes(q.name)) err(url, `FAQ schema question not in page text: "${q.name.slice(0, 50)}"`);
        }
      }
      // Claims this site's visible copy never makes. Ratings, reviews, awards,
      // prices, addresses, service areas and medical typing were all either
      // present before or easy to reintroduce, and none of them are supported
      // by anything a visitor can read. Fail rather than let them drift back.
      const FABRICATED = ['aggregateRating', 'review', 'award', 'awards', 'address',
        'areaServed', 'priceRange', 'telephone', 'openingHours', 'openingHoursSpecification'];
      const MEDICAL = /^(MedicalBusiness|Physician|MedicalClinic|MedicalOrganization|MedicalTherapy|MedicalCondition|Dentist|Hospital)$/;
      const scan = (n) => {
        if (Array.isArray(n)) return n.forEach(scan);
        if (!n || typeof n !== 'object') return;
        for (const t of [].concat(n['@type'] || [])) {
          if (MEDICAL.test(t)) err(url, `medical schema type "${t}" — the page describes no clinical service`);
        }
        for (const k of Object.keys(n)) {
          if (FABRICATED.includes(k)) err(url, `schema asserts "${k}", which no visible copy supports`);
          scan(n[k]);
        }
      };
      scan(graph);
    }

    // retired wording
    for (const label of RETIRED_LABELS) {
      if (text.includes(label)) err(url, `retired wording in visible copy: "${label}"`);
      if (h.includes(label)) err(url, `retired wording in metadata: "${label}"`);
    }
    for (const re of SUPERSEDED_CLAIMS) {
      if (re.test(text)) err(url, 'visible copy claims 500+ companies; the approved figure is 100+ technology companies');
      if (re.test(h)) err(url, 'metadata claims 500+ companies; the approved figure is 100+ technology companies');
    }

    // collect internal links
    for (const raw of all(body, /href="(\/[^"#]*)"/g)) {
      const href = raw.split('?')[0];
      if (!linkTargets.has(href)) linkTargets.set(href, new Set());
      linkTargets.get(href).add(url);
    }
  }

  // ── Internal links: no 404s, no links through a redirect ──────────────────
  for (const [target, sources] of linkTargets) {
    if (/\.(png|jpg|jpeg|webp|svg|ico|json|xml|txt|pdf|js|css)$/.test(target)) continue;
    const t = await trace(target);
    const from = [...sources].join(', ');
    if (t.status === 404) err(from, `broken internal link → ${target}`);
    else if (t.hops.length) err(from, `internal link goes through a ${t.hops[0].status} → ${target} → ${t.final}`);
    for (const r of RETIRED) {
      if (target === r || target.startsWith(r)) err(from, `links to retired URL ${target}`);
    }
  }

  // ── Orphans: an indexable page nothing links to is reachable only through
  //    the sitemap, which is not discovery. The homepage is the root, so it is
  //    exempt; everything else needs at least one crawlable <a href> to it.
  for (const p of PAGES) {
    if (p.url === '/') continue;
    const sources = linkTargets.get(p.url);
    if (!sources || sources.size === 0) {
      err(p.url, 'orphan — indexable and in the sitemap, but no page links to it');
    }
  }

  // ── Redirects: each retired URL, one hop, to a 200 ────────────────────────
  for (const r of ['/psychotherapy-decision-coaching/', '/career-strategy-consulting/',
    '/solopreneur-growth-consulting/', '/start-here/']) {
    const t = await trace(r);
    if (!t.hops.length) err(r, 'retired URL does not redirect');
    else if (t.hops.length > 1) err(r, `redirect chain: ${t.hops.map((h) => h.to).join(' → ')}`);
    else if (t.hops[0].status !== 301) err(r, `redirect is ${t.hops[0].status}, expected 301`);
    else if (t.final !== '/work-with-me/') err(r, `redirects to ${t.final}, expected /work-with-me/`);
    if (t.status !== 200) err(r, `redirect destination returns ${t.status}`);
  }

  // ── Cache busting: every bundle URL must carry its current content hash ───
  // netlify.toml serves /*.js as immutable for a year, so a page that points at
  // a stale ?v= pins returning visitors to old JS — and the site's CSS lives
  // inside those bundles, so a stale pin silently reverts the design.
  for (const p of PAGES) {
    const t = await trace(p.url);
    if (t.status !== 200) continue;
    for (const m of t.body.matchAll(SRC_RE)) {
      const [, asset, query] = m;
      const want = hashOf(asset);
      if (!want) continue; // not a bundle we ship
      if (query !== `?v=${want}`) {
        err(p.url, `${asset} is stamped ${query || '(no ?v=)'}, current content hash is ?v=${want} — run scripts/seo/stamp-assets.js`);
      }
    }
  }

  // ── A URL that does not exist must 404, not 200 ───────────────────────────
  const ghost = await trace('/this-page-does-not-exist-' + Date.now() + '/');
  if (ghost.status !== 404) err('/does-not-exist/', `nonexistent URL returns ${ghost.status}, expected 404`);

  // ── Sitemap ───────────────────────────────────────────────────────────────
  const sm = await get(`http://localhost:${PORT}/sitemap.xml`);
  if (sm.status !== 200) err('/sitemap.xml', `returns ${sm.status}`);
  else {
    const locs = all(sm.body, /<loc>([^<]*)<\/loc>/g);
    const wanted = PAGES.map((p) => ORIGIN + p.url);
    for (const l of locs) {
      if (l.includes('?')) err('/sitemap.xml', `query-string URL: ${l}`);
      for (const r of RETIRED) if (l.includes(r)) err('/sitemap.xml', `retired URL listed: ${l}`);
      const t = await trace(l.replace(ORIGIN, ''));
      if (t.status !== 200) err('/sitemap.xml', `${l} returns ${t.status}`);
      if (t.hops.length) err('/sitemap.xml', `${l} redirects`);
      const c = one(head(t.body), /<link rel="canonical" href="([^"]*)"/);
      if (c && c !== l) err('/sitemap.xml', `${l} canonicalises to ${c}`);
    }
    for (const w of wanted) if (!locs.includes(w)) err('/sitemap.xml', `missing ${w}`);
    if (!locs.includes(ORIGIN + '/work-with-me/')) err('/sitemap.xml', 'missing /work-with-me/');
  }

  // ── robots.txt ────────────────────────────────────────────────────────────
  const rb = await get(`http://localhost:${PORT}/robots.txt`);
  if (rb.status !== 200) err('/robots.txt', `returns ${rb.status}`);
  else {
    if (!rb.body.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) err('/robots.txt', 'no sitemap line');
    if (/^\s*Disallow:\s*\/\s*$/m.test(rb.body)) err('/robots.txt', 'Disallow: / blocks the whole site');
  }

  server.close();

  console.log(`\nseo-check — ${PAGES.length} pages, ${linkTargets.size} internal link targets\n`);
  if (warnings.length && SHOW_WARN) {
    console.log(`${warnings.length} warning(s):`);
    for (const w of warnings) console.log('  ~ ' + w);
    console.log('');
  }
  if (errors.length) {
    console.log(`${errors.length} error(s):`);
    for (const e of errors) console.log('  ✗ ' + e);
    console.log('');
    process.exit(1);
  }
  console.log('✓ no errors' + (warnings.length ? `  (${warnings.length} warning(s); run with --warn to see them)` : ''));
}

main().catch((e) => { console.error(e); process.exit(1); });
