// qa-crawl.js — static QA over the built site (no live deploy needed).
// Verifies: routes exist + have prerendered content; canonical/hreflang/lang;
// reciprocal hreflang for paired core pages; sitemap ↔ files; redirect coverage
// + no chains; internal links don't point at redirected legacy URLs.
// Run: node scripts/qa-crawl.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const O = 'https://aggelosmouzakitis.com';
let pass = 0, fail = 0;
const problems = [];
const ok = (m) => { pass++; };
const bad = (m) => { fail++; problems.push(m); };

const LEGACY = ['/founders/', '/solopreneurs/', '/how-i-work/', '/therapy-for-founders/', '/therapy-for-executives/', '/imposter-syndrome-therapy/', '/executive-burnout-therapy/', '/career-transition-therapy/'];
const CORE = ['/', '/1-to-1/', '/about/', '/reviews/', '/book/', '/confidentiality/'];

function urlToFile(u) {
  let p = u.replace(O, '');
  p = p.split('?')[0].split('#')[0];
  if (p.endsWith('/')) p += 'index.html';
  else if (!p.endsWith('.html') && !p.includes('.')) p += '/index.html';
  return path.join(ROOT, p.replace(/^\//, ''));
}
function read(u) { const f = urlToFile(u); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; }
function textLen(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
  const inner = m ? m[1] : html;
  return inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}
function attr(html, re) { const m = html.match(re); return m ? m[1] : null; }
function hreflangs(html) {
  const out = {};
  const re = /<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g; let m;
  while ((m = re.exec(html))) out[m[1]] = m[2];
  return out;
}

console.log('── Routes (200 + prerendered content) ──');
const allCore = [];
for (const p of CORE) { allCore.push(O + p); allCore.push(O + '/el' + p); }
for (const u of allCore) {
  const html = read(u);
  if (!html) { bad(`MISSING FILE: ${u}`); continue; }
  const tl = textLen(html);
  if (tl < 400) bad(`THIN PRERENDER (${tl} chars): ${u}`); else ok();
}

console.log('── Canonical + <html lang> ──');
for (const p of CORE) {
  for (const lang of ['en', 'el']) {
    const u = O + (lang === 'el' ? '/el' + p : p);
    const html = read(u); if (!html) continue;
    const can = attr(html, /rel="canonical" href="([^"]+)"/);
    if (can !== u) bad(`CANONICAL ${can} != ${u}`); else ok();
    const hl = attr(html, /<html lang="([^"]+)"/);
    if (hl !== lang) bad(`HTML LANG ${hl} != ${lang} on ${u}`); else ok();
  }
}

console.log('── Reciprocal hreflang (paired core) ──');
for (const p of CORE) {
  const en = read(O + p), el = read(O + '/el' + p);
  if (!en || !el) continue;
  const he = hreflangs(en), hl = hreflangs(el);
  const enUrl = O + p, elUrl = O + '/el' + p;
  if (he.en !== enUrl || he.el !== elUrl || he['x-default'] !== enUrl) bad(`EN hreflang wrong on ${enUrl}: ${JSON.stringify(he)}`); else ok();
  if (hl.en !== enUrl || hl.el !== elUrl || hl['x-default'] !== enUrl) bad(`EL hreflang wrong on ${elUrl}: ${JSON.stringify(hl)}`); else ok();
}

console.log('── Greek pages: no regulated title terms ──');
for (const p of CORE) {
  const el = read(O + '/el' + p); if (!el) continue;
  if (/Ψυχοθεραπευτ|Ψυχολόγο/.test(el)) bad(`REGULATED TERM on /el${p}`); else ok();
}

console.log('── Sitemap ↔ files, and no redirected URLs ──');
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const loc of locs) {
  if (LEGACY.some(l => loc.endsWith(l))) { bad(`SITEMAP has redirected URL: ${loc}`); continue; }
  if (!read(loc)) bad(`SITEMAP URL has no file: ${loc}`); else ok();
}

console.log('── Redirect coverage + no chains (netlify.toml) ──');
const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const froms = [...toml.matchAll(/from = "([^"]+)"/g)].map(m => m[1]);
const tos = [...toml.matchAll(/to = "([^"]+)"/g)].map(m => m[1]);
for (const l of LEGACY) {
  const base = l.replace(/\/$/, '');
  if (froms.includes(base) && froms.includes(base + '/*')) ok();
  else bad(`REDIRECT MISSING for ${l} (need "${base}" and "${base}/*")`);
}
// no chain: a redirect target must not itself be a redirect source
for (const t of tos) {
  const tp = t.replace(/\/$/, '');
  if (froms.includes(tp) || froms.includes(t)) bad(`REDIRECT CHAIN: target ${t} is also a source`); else ok();
}

console.log('── Internal links: no links to redirected legacy URLs (core + retained) ──');
const scan = [...allCore,
  O + '/blog/', O + '/getinterviewed/', O + '/ask-me-anything/', O + '/burnout-diagnostic/',
  O + '/greek-speaking-therapist-london/', O + '/greek-speaking-therapist-manchester/',
  O + '/greek-speaking-therapist-new-york/', O + '/greek-speaking-therapist-dublin/'];
for (const u of scan) {
  const html = read(u); if (!html) continue;
  // only look at real anchors in the prerendered body
  const hits = LEGACY.filter(l => new RegExp('href="' + l.replace(/[/]/g, '\\/') + '"').test(html));
  if (hits.length) bad(`LEGACY LINK on ${u}: ${hits.join(', ')}`); else ok();
}

console.log('\n────────────────────────────');
console.log(`PASS ${pass} · FAIL ${fail}`);
if (problems.length) { console.log('\nProblems:'); problems.forEach(p => console.log('  ✗ ' + p)); process.exitCode = 1; }
else console.log('All static QA checks passed.');
