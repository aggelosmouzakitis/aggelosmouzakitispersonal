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
// self-referencing, single), robots (no accidental noindex), <html lang="en">,
// no /el/ alternates, exactly one H1, Open Graph completeness, og:url ===
// canonical, OG image resolves, JSON-LD parses and asserts nothing the page
// does not (no price, offers, reviews, ratings, address, areaServed, FAQPage,
// LocalBusiness or medical types), retired positioning wording, internal links
// that 404 or go through a redirect, retired URLs linked from anywhere, orphan
// pages, every legacy URL in routes.js (one 301 hop or a real 410), bundle
// cache-busting, sitemap integrity and the private archive's noindex.

const fs = require('fs');
const path = require('path');
const http = require('http');
const { ORIGIN, PAGES } = require('./site-meta.js');
const { hashOf, SRC_RE } = require('./stamp-assets.js');
const { serve: netlifyServe } = require('./netlify-emulator.js');
const { LEGACY } = require('./routes.js');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 8123;
const SHOW_WARN = process.argv.includes('--warn');

// URL prefixes that are retired (301 or 410 in netlify.toml): none may appear
// as an internal link or in the sitemap. /blog/ is live again as Writing.
const RETIRED = [
  '/psychotherapy-decision-coaching/', '/career-strategy-consulting/',
  '/solopreneur-growth-consulting/', '/start-here/', '/1-to-1/', '/how-i-work/',
  '/book/', '/schedule/', '/faqs/', '/startingdiagnostic/', '/burnout-diagnostic/',
  '/clarity-tools/', '/el/', '/founders/', '/solopreneurs/', '/getinterviewed/',
  '/wtf-friday/', '/ask-me-anything/', '/find-your-focus-area/',
  '/free-tools/business-constraint/', '/free-tools/strategy-or-execution/',
  '/free-tools/become-a-solopreneur/', '/free-tools/roast-my-offer/',
  '/free-tools/find-your-focus-area/', '/greek-speaking-therapist-', '/draft/', '/logoutclub/',
];
// Positioning and wording retired with the business-advisor site (brief,
// Phase 13), plus claims the practice does not make. Case-insensitive.
const RETIRED_LABELS = [
  /business\s*&\s*career advisor/i, /\bbusiness advisor\b/i, /private business & career advisor/i,
  /\bfree assessment\b/i, /find your focus area/i, /starting diagnostic/i,
  /strategy or execution/i, /\bbusiness constraint\b/i, /become a solopreneur/i,
  /wtf friday/i, /ask me something/i, /ask me anything/i, /licensed psychotherapist/i,
  /working globally/i, /\bworldwide\b/i,
  /psychotherapy \/ decision coaching/i, /career strategy consulting/i,
  /solo business growth consulting/i, /not sure where to start\?/i,
];
// Superseded numbers. The approved claim is "100+ technology companies"; the
// older "500+ companies" survived only in a two-versions-ago migration note,
// with nothing in the repo establishing it as a separate, accurate metric.
const SUPERSEDED_CLAIMS = [/\b500\+?\s*(?:compan|business|\u03b5\u03c0\u03b9\u03c7\u03b5\u03b9\u03c1)/i, /more than 500\s*(?:compan|business|of them)/i];

// The final editorial copy gives these pages the same meta description, and
// metadata is used exactly as written. Listed so the check still catches any
// new, accidental duplicate. (Pairs are sorted, space-separated.)
const DUPLICATE_OK = new Set(['/ /therapy-for-men-in-tech/']);

const errors = [];
const warnings = [];
const err = (url, msg) => errors.push(`${url} — ${msg}`);
const warn = (url, msg) => warnings.push(`${url} — ${msg}`);

// ─── Netlify emulation (scripts/seo/netlify-emulator.js) ─────────────────────
const serve = () => netlifyServe(ROOT);

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
    const lang = one(html, /<html[^>]*\slang="([^"]*)"/);
    if (lang !== 'en') err(url, `<html lang="${lang}">, expected "en"`);
    for (const alt of all(h, /<link rel="alternate"[^>]*href="([^"]*)"/g)) {
      if (/\/el(\/|$)/.test(alt.replace(ORIGIN, ''))) err(url, `alternate/hreflang points at the retired Greek site: ${alt}`);
    }
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
      if (seenDescs.has(desc)) {
        const pair = [seenDescs.get(desc), url].sort().join(' ');
        if (DUPLICATE_OK.has(pair)) warn(url, `same description as ${seenDescs.get(desc)} (as written in the final editorial copy)`);
        else err(url, `duplicate description, also on ${seenDescs.get(desc)}`);
      }
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
      const FABRICATED = ['aggregateRating', 'review', 'reviewRating', 'award', 'awards', 'address',
        'areaServed', 'priceRange', 'price', 'offers', 'telephone', 'openingHours', 'openingHoursSpecification'];
      const MEDICAL = /^(MedicalBusiness|Physician|MedicalClinic|MedicalOrganization|MedicalTherapy|MedicalCondition|Dentist|Hospital)$/;
      const scan = (n) => {
        if (Array.isArray(n)) return n.forEach(scan);
        if (!n || typeof n !== 'object') return;
        for (const t of [].concat(n['@type'] || [])) {
          if (MEDICAL.test(t)) err(url, `medical schema type "${t}" — the page describes no clinical service`);
          if (/^(Review|AggregateRating|LocalBusiness|FAQPage)$/.test(t)) err(url, `schema type "${t}" — not published on this site`);
        }
        for (const k of Object.keys(n)) {
          if (FABRICATED.includes(k)) err(url, `schema asserts "${k}", which no visible copy supports`);
          scan(n[k]);
        }
      };
      scan(graph);
    }

    // retired wording
    for (const re of RETIRED_LABELS) {
      const mt = text.match(re);
      if (mt) err(url, `retired wording in visible copy: "${mt[0]}"`);
      const mh = decode(h).match(re);
      if (mh) err(url, `retired wording in metadata: "${mh[0]}"`);
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
    if (target === '/archive' || target.startsWith('/archive/')) err(from, `links to the private archive ${target}`);
  }

  // ── Orphans: an indexable page nothing links to is reachable only through
  //    the sitemap, which is not discovery. The homepage is the root, so it is
  //    exempt; everything else needs at least one crawlable <a href> to it.
  for (const p of PAGES) {
    if (p.url === '/') continue;
    const sources = linkTargets.get(p.url);
    if (!sources || sources.size === 0) {
      // A held page keeps its status quo until its review; say so, don't fail.
      if (p.hold) warn(p.url, 'HOLD page has no inbound internal links');
      else err(p.url, 'orphan — indexable and in the sitemap, but no page links to it');
    }
  }

  // ── Redirects: every legacy URL in the migration table (routes.js) — one
  //    301 hop straight to its final page, or a real 410 ────────────────────
  for (const [r, status, target] of LEGACY) {
    const t = await trace(r);
    const first = t.hops.length ? t.hops[0].status : t.status;
    if (first !== status) { err(r, `responds ${first}, expected ${status}`); continue; }
    if (status === 301) {
      if (t.hops.length > 1) err(r, `redirect chain: ${t.hops.map((h) => h.to).join(' → ')}`);
      if (t.final !== target) err(r, `redirects to ${t.final}, expected ${target}`);
      if (t.status !== 200) err(r, `redirect destination returns ${t.status}`);
    }
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
      if (l.includes('/archive/')) err('/sitemap.xml', `private archive URL listed: ${l}`);
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

  // ── Archive: private copies of retired pages must never be indexable ──────
  // scripts/archive/build.js writes /archive/. Every page there carries a
  // noindex meta and netlify.toml sends the same as X-Robots-Tag; the link and
  // sitemap checks above keep it undiscoverable from the live site.
  const archiveDir = path.join(ROOT, 'archive');
  if (fs.existsSync(archiveDir)) {
    const archived = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) walk(path.join(d, e.name));
        else if (e.name.endsWith('.html')) archived.push(path.join(d, e.name));
      }
    };
    walk(archiveDir);
    for (const f of archived) {
      const robots = one(fs.readFileSync(f, 'utf8'), /<meta name="robots" content="([^"]*)"/);
      if (!robots || !/noindex/i.test(robots)) err('/' + path.relative(ROOT, f), 'archived page is not noindex');
    }
    const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
    if (!/for = "\/archive\/\*"\s*\[headers\.values\]\s*X-Robots-Tag = "noindex/.test(toml)) {
      err('/archive/', 'netlify.toml does not send X-Robots-Tag: noindex for /archive/*');
    }
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
