// qa-routes.js — status of every canonical and legacy route, against the
// migration table (implementation brief, Phases 1 and 5).
//
// Serves the repo through the Netlify emulator (scripts/seo/netlify-emulator.js),
// requests each URL with and without its trailing slash, follows redirects and
// checks: the status, the number of hops (a legacy URL must resolve in exactly
// one) and that every redirect lands on a 200. Prints a Markdown table.
//
//   node scripts/qa-routes.js            # table + exit code
//   node scripts/qa-routes.js --md FILE  # also write the table to FILE

const fs = require('fs');
const http = require('http');
const { serve } = require('./seo/netlify-emulator.js');

const PORT = 8124;

const { CANONICAL, LEGACY } = require('./seo/routes.js');

function get(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location }));
    }).on('error', () => resolve({ status: 0 }));
  });
}

async function trace(p) {
  const hops = [];
  let cur = p;
  for (let i = 0; i < 6; i++) {
    const r = await get(`http://localhost:${PORT}${cur}`);
    if (r.status >= 300 && r.status < 400 && r.location) {
      hops.push({ status: r.status, to: r.location });
      cur = r.location;
      continue;
    }
    return { first: hops.length ? hops[0].status : r.status, hops, final: cur, finalStatus: r.status };
  }
  return { first: hops[0].status, hops, final: cur, finalStatus: 0, loop: true };
}

(async () => {
  const server = serve();
  await new Promise((r) => server.listen(PORT, r));
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
  for (const [u, s, t, n] of LEGACY) {
    await check(u, s, t, n, 'legacy');
    const bare = u.replace(/\/$/, '');
    if (bare !== u && bare && !u.startsWith('/this-page')) {
      // A bare legacy URL must resolve in one hop too (no /x → /x/ → target).
      const expBare = s === 200 ? 301 : s;
      await check(bare, expBare, s === 200 ? u : t, (n ? n + '; ' : '') + 'bare form', 'legacy');
    }
  }
  server.close();

  const md = ['| Route | Expected | Actual | OK | Note |', '|---|---|---|---|---|']
    .concat(rows.map((r) => `| \`${r.url}\` | ${r.expected} | ${r.got} | ${r.ok ? '✓' : '✗'} | ${r.note} |`))
    .join('\n');
  console.log(md);
  const i = process.argv.indexOf('--md');
  if (i > 0 && process.argv[i + 1]) fs.writeFileSync(process.argv[i + 1], md + '\n');
  console.log(`\n${rows.length} requests, ${problems.length} problem(s)`);
  for (const p of problems) console.log('  ✗ ' + p);
  process.exit(problems.length ? 1 : 0);
})();
