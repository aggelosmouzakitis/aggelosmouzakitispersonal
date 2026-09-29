// qa-routes.js — status of every canonical and legacy route, against the
// migration table (implementation brief, Phases 1 and 5).
//
// Builds public/ (scripts/build-public.js) and serves it through the Netlify
// emulator (scripts/seo/netlify-emulator.js), requests each URL with and
// without its trailing slash, follows redirects and checks: the status, the
// number of hops (a legacy URL must resolve in exactly one) and that every
// redirect lands on a 200. Also checks that netlify.toml and the table agree
// rule for rule, and that no repository internal is served. Prints a Markdown
// table.
//
//   node scripts/qa-routes.js            # table + exit code
//   node scripts/qa-routes.js --md FILE  # also write the table to FILE
//   node scripts/qa-routes.js --live https://aggelosmouzakitis.com
//                                        # the same checks against a deployed
//                                        # site instead of the local build

const fs = require('fs');
const http = require('http');
const https = require('https');
const { serve, loadRedirects, PUBLIC } = require('./seo/netlify-emulator.js');
const { build } = require('./build-public.js');

const PORT = 8124;
const li = process.argv.indexOf('--live');
const LIVE = li > 0 ? String(process.argv[li + 1] || '').replace(/\/+$/, '') : null;
if (li > 0 && !/^https?:\/\/[^/]+$/.test(LIVE)) {
  console.error('usage: node scripts/qa-routes.js --live https://host');
  process.exit(2);
}
const BASE = LIVE || `http://localhost:${PORT}`;
const ORIGIN = new URL(BASE).origin;

const { CANONICAL, LEGACY, INTERNAL } = require('./seo/routes.js');

function get(url) {
  const mod = url.startsWith('https:') ? https : http;
  return new Promise((resolve) => {
    mod.get(url, { headers: { 'user-agent': 'qa-routes (aggelosmouzakitis.com)' } }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location }));
    }).on('error', () => resolve({ status: 0 }));
  });
}

async function trace(p) {
  const hops = [];
  let cur = p;
  for (let i = 0; i < 6; i++) {
    const r = await get(/^https?:/.test(cur) ? cur : BASE + cur);
    if (r.status >= 300 && r.status < 400 && r.location) {
      // A live host may answer with an absolute Location; same-origin
      // targets are compared as paths, anything else stays absolute (and
      // fails the target check).
      const loc = new URL(r.location, BASE + cur);
      cur = loc.origin === ORIGIN ? loc.pathname + loc.search : loc.href;
      hops.push({ status: r.status, to: cur });
      continue;
    }
    return { first: hops.length ? hops[0].status : r.status, hops, final: cur, finalStatus: r.status };
  }
  return { first: hops[0].status, hops, final: cur, finalStatus: 0, loop: true };
}

(async () => {
  let server = null;
  if (!LIVE) {
    build();
    server = serve(PUBLIC);
    await new Promise((r) => server.listen(PORT, r));
  }
  const rows = [];
  const problems = [];

  const check = async (url, expStatus, expTarget, note, kind) => {
    const t = await trace(url);
    const ok = [];
    if (t.first !== expStatus) ok.push(`first response ${t.first}, expected ${expStatus}`);
    if (expTarget && t.final !== expTarget) ok.push(`lands on ${t.final}, expected ${expTarget}`);
    if (expStatus === 301 && t.hops.length !== 1) ok.push(`${t.hops.length} hops`);
    if (expStatus === 301 && t.finalStatus !== 200) ok.push(`target returns ${t.finalStatus}`);
    if (t.loop) ok.push('redirect loop');
    const got = t.hops.length ? `${t.first} → ${t.final} (${t.finalStatus})` : String(t.finalStatus);
    rows.push({ kind, url, expected: expStatus + (expTarget ? ' → ' + expTarget : ''), got, ok: !ok.length, note });
    if (ok.length) problems.push(`${url}: ${ok.join('; ')}`);
    return t;
  };

  for (const [u, s, t, n] of CANONICAL) {
    await check(u, s, t, n, 'canonical');
    // the slash-less form: one hop to the canonical URL
    if (u !== '/') await check(u.replace(/\/$/, ''), 301, u, 'bare form', 'canonical');
  }
  const listed = new Set(LEGACY.map(([u]) => u));
  for (const [u, s, t, n] of LEGACY) {
    await check(u, s, t, n, 'legacy');
    const bare = u.replace(/\/$/, '');
    if (bare !== u && bare && !listed.has(bare) && !u.startsWith('/this-page')) {
      // A bare legacy URL must resolve in one hop too (no /x → /x/ → target).
      const expBare = s === 200 ? 301 : s;
      await check(bare, expBare, s === 200 ? u : t, (n ? n + '; ' : '') + 'bare form', 'legacy');
    }
  }
  for (const u of INTERNAL) await check(u, 404, null, 'repository internal, not published', 'internal');
  if (server) server.close();

  // netlify.toml and the table must agree: every rule is a row, and every
  // 3xx/410 row is a rule (Netlify matches with or without the slash).
  const norm = (u) => (u.length > 1 ? u.replace(/\/$/, '') : u);
  const rules = loadRedirects();
  const ruleFroms = new Set(rules.map((r) => norm(r.from)));
  const rowUrls = new Set(LEGACY.map(([u]) => norm(u)));
  for (const r of rules) {
    if (r.from.startsWith('/hot-seat-coworking-spaces')) continue; // utility PDF, not a migration
    if (!rowUrls.has(norm(r.from))) problems.push(`netlify.toml rule ${r.from} is not in scripts/seo/routes.js`);
  }
  for (const [u, s] of LEGACY) {
    if ((s === 301 || s === 410) && !ruleFroms.has(norm(u))) problems.push(`routes.js row ${u} (${s}) has no netlify.toml rule`);
  }

  const md = ['| Route | Expected | Actual | OK | Note |', '|---|---|---|---|---|']
    .concat(rows.map((r) => `| \`${r.url}\` | ${r.expected} | ${r.got} | ${r.ok ? '✓' : '✗'} | ${r.note} |`))
    .join('\n');
  console.log(md);
  const i = process.argv.indexOf('--md');
  if (i > 0 && process.argv[i + 1]) fs.writeFileSync(process.argv[i + 1], md + '\n');
  console.log(`\n${BASE}: ${rows.length} requests, ${problems.length} problem(s)`);
  for (const p of problems) console.log('  ✗ ' + p);
  process.exit(problems.length ? 1 : 0);
})();
