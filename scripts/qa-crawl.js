// qa-crawl.js — static QA over the built site (no live deploy needed).
// Verifies: routes exist + have prerendered content; canonical/hreflang/lang;
// reciprocal hreflang for paired core pages; restored SEO pages are indexable
// 200s with self-canonical + no fake cross-language hreflang; sitemap ↔ files;
// redirect coverage for the pages that STAY redirected + no chains; no noindex,
// duplicate canonical, or .gr canonical anywhere; internal links resolve.
// Run: node scripts/qa-crawl.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const O = 'https://aggelosmouzakitis.com';
let pass = 0, fail = 0;
const problems = [];
const ok = () => { pass++; };
const bad = (m) => { fail++; problems.push(m); };

// Pages that REMAIN redirected (obsolete replacement pages — kept as 301s).
const REDIRECTED = ['/how-i-work/', '/el/how-i-work/', '/burnout-diagnostic/', '/el/burnout-diagnostic/'];
const CORE = ['/', '/1-to-1/', '/about/', '/reviews/', '/book/', '/startingdiagnostic/', '/confidentiality/'];
// Restored English SEO landing pages (200, self-canonical, in sitemap, prerendered).
const RESTORED_EN = ['/founders/', '/solopreneurs/', '/therapy-for-founders/', '/therapy-for-executives/', '/imposter-syndrome-therapy/', '/executive-burnout-therapy/', '/career-transition-therapy/'];
// New Greek SEO landing pages under /el/ (200, self-canonical, in sitemap, prerendered).
const RESTORED_EL = ['/el/executive-coaching/', '/el/burnout/', '/el/career-coaching/', '/el/imposter-syndrome/'];
const RETAINED = ['/greek-speaking-therapist-london/', '/greek-speaking-therapist-manchester/', '/greek-speaking-therapist-new-york/', '/greek-speaking-therapist-dublin/', '/getinterviewed/', '/ask-me-anything/'];

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
function allCanonicals(html) { return [...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map(m => m[1]); }
function hreflangs(html) {
  const out = {};
  const re = /<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g; let m;
  while ((m = re.exec(html))) out[m[1]] = m[2];
  return out;
}

console.log('── Routes (200 + prerendered content) ──');
const allCore = [];
for (const p of CORE) { allCore.push(O + p); allCore.push(O + '/el' + p); }
const allIndexable = [...allCore, ...RESTORED_EN.map(p => O + p), ...RESTORED_EL.map(p => O + p), ...RETAINED.map(p => O + p), O + '/blog/'];
for (const u of [...allCore, ...RESTORED_EN.map(p => O + p), ...RESTORED_EL.map(p => O + p)]) {
  const html = read(u);
  if (!html) { bad(`MISSING FILE: ${u}`); continue; }
  const tl = textLen(html);
  if (tl < 400) bad(`THIN PRERENDER (${tl} chars): ${u}`); else ok();
}

console.log('── Canonical (single + self) + <html lang> ──');
for (const p of CORE) {
  for (const lang of ['en', 'el']) {
    const u = O + (lang === 'el' ? '/el' + p : p);
    const html = read(u); if (!html) continue;
    const cans = allCanonicals(html);
    if (cans.length !== 1) bad(`DUPLICATE/MISSING CANONICAL (${cans.length}) on ${u}`); else ok();
    if (cans[0] !== u) bad(`CANONICAL ${cans[0]} != ${u}`); else ok();
    const hl = attr(html, /<html lang="([^"]+)"/);
    if (hl !== lang) bad(`HTML LANG ${hl} != ${lang} on ${u}`); else ok();
  }
}

console.log('── Restored SEO pages: single self-canonical + correct lang + NO fake alternate ──');
for (const p of RESTORED_EN) {
  const u = O + p; const html = read(u); if (!html) { bad(`MISSING ${u}`); continue; }
  const cans = allCanonicals(html);
  if (cans.length === 1 && cans[0] === u) ok(); else bad(`EN-SEO canonical wrong on ${u}: ${JSON.stringify(cans)}`);
  const hl = attr(html, /<html lang="([^"]+)"/);
  if (hl && hl.startsWith('en')) ok(); else bad(`EN-SEO lang ${hl} on ${u}`);
  const hf = hreflangs(html);
  if (hf.el) bad(`EN-SEO has fake Greek alternate on ${u}: ${hf.el}`); else ok();
}
for (const p of RESTORED_EL) {
  const u = O + p; const html = read(u); if (!html) { bad(`MISSING ${u}`); continue; }
  const cans = allCanonicals(html);
  if (cans.length === 1 && cans[0] === u) ok(); else bad(`EL-SEO canonical wrong on ${u}: ${JSON.stringify(cans)}`);
  const hl = attr(html, /<html lang="([^"]+)"/);
  if (hl === 'el') ok(); else bad(`EL-SEO lang ${hl} on ${u}`);
  const hf = hreflangs(html);
  if (hf.en) bad(`EL-SEO has fake English alternate on ${u}: ${hf.en}`); else ok();
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

console.log('── No noindex on indexable pages ──');
for (const u of [...allIndexable, ...RESTORED_EN.map(p => O + p), ...RESTORED_EL.map(p => O + p)]) {
  const html = read(u); if (!html) continue;
  if (/name="robots"[^>]*noindex/i.test(html)) bad(`NOINDEX on ${u}`); else ok();
}

console.log('── No .gr canonical anywhere ──');
for (const u of [...allIndexable, ...RESTORED_EN.map(p => O + p), ...RESTORED_EL.map(p => O + p)]) {
  const html = read(u); if (!html) continue;
  const cans = allCanonicals(html);
  if (cans.some(c => /aggelosmouzakitis\.gr/.test(c))) bad(`.gr CANONICAL on ${u}`); else ok();
}

// "Ψυχοθεραπευτής" is the client-approved Greek title (psychotherapy is
// unregulated in Greece). "Ψυχολόγος" remains a protected title we must not claim.
console.log('── Greek pages: no protected "psychologist" term ──');
for (const p of [...CORE.map(x => '/el' + x), ...RESTORED_EL]) {
  const el = read(O + p); if (!el) continue;
  if (/Ψυχολόγο/.test(el)) bad(`PROTECTED TERM (psychologist) on ${p}`); else ok();
}

console.log('── Sitemap ↔ files; restored pages present; no redirected URLs ──');
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const loc of locs) {
  if (REDIRECTED.some(l => loc.endsWith(l))) { bad(`SITEMAP has redirected URL: ${loc}`); continue; }
  if (!read(loc)) bad(`SITEMAP URL has no file: ${loc}`); else ok();
}
for (const p of [...RESTORED_EN, ...RESTORED_EL]) {
  if (locs.includes(O + p)) ok(); else bad(`SITEMAP MISSING restored page: ${O + p}`);
}

console.log('── Redirect coverage for still-redirected pages + no chains (netlify.toml) ──');
const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const froms = [...toml.matchAll(/from = "([^"]+)"/g)].map(m => m[1]);
const tos = [...toml.matchAll(/to = "([^"]+)"/g)].map(m => m[1]);
for (const l of REDIRECTED) {
  const base = l.replace(/\/$/, '');
  if (froms.includes(base) && froms.includes(base + '/*')) ok();
  else bad(`REDIRECT MISSING for ${l} (need "${base}" and "${base}/*")`);
}
// Restored pages must NOT be redirect sources anymore.
for (const p of [...RESTORED_EN, ...RESTORED_EL]) {
  const base = p.replace(/\/$/, '');
  if (froms.includes(base) || froms.includes(base + '/*') || froms.includes(p)) bad(`RESTORED page still redirected: ${p}`); else ok();
}
// no chain: a redirect target must not itself be a redirect source
for (const t of tos) {
  const tp = t.replace(/\/$/, '');
  if (froms.includes(tp) || froms.includes(t)) bad(`REDIRECT CHAIN: target ${t} is also a source`); else ok();
}

console.log('── Internal links: none point at a still-redirected URL (core + restored + retained) ──');
const scan = [...allCore, ...RESTORED_EN.map(p => O + p), ...RESTORED_EL.map(p => O + p),
  O + '/blog/', O + '/getinterviewed/', O + '/ask-me-anything/', O + '/startingdiagnostic/', O + '/el/startingdiagnostic/',
  O + '/greek-speaking-therapist-london/', O + '/greek-speaking-therapist-manchester/',
  O + '/greek-speaking-therapist-new-york/', O + '/greek-speaking-therapist-dublin/'];
for (const u of scan) {
  const html = read(u); if (!html) continue;
  const hits = REDIRECTED.filter(l => new RegExp('href="' + l.replace(/[/]/g, '\\/') + '"').test(html));
  if (hits.length) bad(`REDIRECTED LINK on ${u}: ${hits.join(', ')}`); else ok();
}

console.log('\n────────────────────────────');
console.log(`PASS ${pass} · FAIL ${fail}`);
if (problems.length) { console.log('\nProblems:'); problems.forEach(p => console.log('  ✗ ' + p)); process.exitCode = 1; }
else console.log('All static QA checks passed.');
