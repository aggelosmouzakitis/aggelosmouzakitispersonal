// gen-copy-doc.js — assemble the full bilingual website copy into one Markdown
// document. Marketing pages are extracted verbatim from the compiled bundle so
// the copy is exactly what ships. Run: node scripts/gen-copy-doc.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'site-unification', 'site-copy-en-el.md');

// ── Extract data objects from content-pages.js ───────────────────────────────
let code = fs.readFileSync(path.join(ROOT, 'content-pages.js'), 'utf8');
const sb = { console, fetch: () => Promise.resolve({ json: () => Promise.resolve([]) }),
  window: { innerWidth: 1200, addEventListener() {}, removeEventListener() {} },
  document: { getElementById: () => ({}), querySelector: () => null, createElement: () => ({}), body: { appendChild() {} } } };
sb.React = { createElement: () => ({}), useState: v => [v, () => {}], useEffect() {}, useRef: () => ({ current: null }), Fragment: 'F' };
sb.ReactDOM = { createRoot: () => ({ render() {} }) };
sb.globalThis = sb;
code += '\n;globalThis.__C__={HOME:HOME,ONE:ONE,ABOUT:ABOUT,REVIEWS:REVIEWS,RI:REVIEWS_ITEMS,BOOK:BOOK,UI:UI};';
vm.createContext(sb); vm.runInContext(code, sb, { timeout: 5000 });
const C = sb.__C__;

const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog/posts.json'), 'utf8'));

// ── Confidentiality copy: pull sentence-like strings from the two components ──
const jsx = fs.readFileSync(path.join(ROOT, 'content-pages.jsx'), 'utf8');
function slice(name) { const i = jsx.indexOf('function ' + name); return i < 0 ? '' : jsx.slice(i, i + 9000); }
function sentences(txt) {
  const out = []; const re = /["'`]([^"'`]{22,}?)["'`]/g; let m;
  while ((m = re.exec(txt))) {
    const s = m[1];
    if (!/\s/.test(s)) continue;                                   // needs a space
    if (/\d+px|rgba|#[0-9a-f]{3}|solid |flex|grid|1fr|inherit|translate|:\s|\.\d+rem/i.test(s)) continue; // CSS noise
    if (/createElement|function|href|http/.test(s)) continue;
    out.push(s.replace(/\\u2019/g, '’').replace(/\s+/g, ' ').trim());
  }
  return [...new Set(out)];
}
const confEn = sentences(slice('ConfidentialityPage')).filter(s => !/Εμπιστ|Σε τι|Γιατί|Τίποτα|Τα όρια/.test(s));
const confEl = sentences(slice('ConfidentialityPageEl'));

// ── Build markdown ───────────────────────────────────────────────────────────
const L = [];
const H = (n, t) => L.push('\n' + '#'.repeat(n) + ' ' + t + '\n');
const P = (t) => L.push(t + '\n');
const bul = (arr) => arr.forEach(x => L.push('- ' + x));
function pageEN_EL(title, enBlocks, elBlocks) {
  H(2, title);
  H(3, '🇬🇧 English'); enBlocks();
  H(3, '🇬🇷 Ελληνικά'); elBlocks();
  L.push('\n---');
}
function homeBlocks(c) {
  P('**Role:** ' + (c === C.HOME.en ? 'Business Advisor + Therapist' : 'Σύμβουλος επιχειρήσεων & ψυχικής υγείας'));
  P('**Promise (H1):** ' + c.promise);
  P('**Tagline:** ' + c.tagline);
  P(c.introA); P(c.introB);
  H(4, c.recogLabel); P('_' + c.recogLead + '_'); bul(c.recog);
  H(4, c.ceLabel); P(c.ceLead); bul(c.ce.map(x => `**${x.cause}** → ${x.effect}`)); P('_' + c.ceFoot + '_');
  H(4, c.cpLabel); P(c.cpLead); bul(c.cp); P('**' + c.cpFoot + '**');
  H(4, c.ttLabel); bul(c.tt.map(x => `**${x.title}** — ${x.body}`)); P('**' + c.ttCore + '**'); P('_' + c.ttNote + '_');
  H(4, c.offerLabel); P(c.offerBody); P('→ ' + c.offerLink);
  H(4, c.faqLabel); c.faq.forEach(f => { P('**Q. ' + f.q + '**'); P(f.a); });
  H(4, 'Final CTA'); P('**' + c.finalHeading + '**'); P(c.finalSub);
}
function oneBlocks(c) {
  P('**H1:** ' + c.h1); P('**Lead:** ' + c.lead); P(c.intro);
  H(4, c.whoLabel); P(c.whoLead); bul(c.who);
  H(4, c.workLabel); bul(c.tracks.map(x => `**${x.title}** — ${x.body}`)); P('_' + c.workFoot + '_');
  H(4, c.howLabel); bul(c.steps.map(s => `**${s.n}. ${s.title}** (${s.tag}) — ${s.body}`)); P('_' + c.howNote + '_');
  H(4, c.expectLabel); bul(c.expect); P('_' + c.expectFoot + '_');
  H(4, c.faqLabel); c.faq.forEach(f => { P('**Q. ' + f.q + '**'); P(f.a); });
  H(4, 'CTA'); P('**' + c.ctaHeading + '**');
}
function aboutBlocks(c) {
  P('**H1:** ' + c.h1); P('**Role:** ' + c.role); P('**Credentials:** ' + c.creds); P('**Lead:** ' + c.lead);
  c.sections.forEach(s => { H(4, s.label); s.body.forEach(P); });
  H(4, 'CTA'); P('**' + c.ctaHeading + '**');
}
function bookBlocks(c) {
  P('**H1:** ' + c.h1); P('**Lead:** ' + c.lead); P(c.p1); P(c.p2);
  H(4, c.howLabel); P(`**${c.s1a}**${c.s1b}`); P(`**${c.s2a}**${c.s2b}`); P(`**${c.s3a}**${c.s3b}`);
  H(4, c.whoLabel); P(c.who);
}

// Header
L.push('# Aggelos Mouzakitis — Website Copy (English + Ελληνικά)');
L.push('\n_Generated from the live source (`content-pages.jsx`, `blog/posts.json`, and the Greek diagnostic). One brand, one offer (1:1), two languages._\n');

// Navigation + CTAs + footer labels
H(2, 'Navigation, CTAs & footer labels');
P('| | English | Ελληνικά |');
P('|---|---|---|');
P('| Role | Business Advisor + Therapist | Σύμβουλος επιχειρήσεων & ψυχικής υγείας |');
P('| Nav | Home · Work with me · About · Writing · Reviews | Αρχική · Συνεργασία · Σχετικά · Άρθρα · Κριτικές |');
P('| Sidebar CTA | Burnout Diagnostic — “' + C.UI.en.book + '” replaced by → Take the diagnostic | Burnout Diagnostic → Κάνε το τεστ |');
P('| Primary CTAs | ' + C.UI.en.seeOneToOne + ' · ' + C.UI.en.book + ' | ' + C.UI.el.seeOneToOne + ' · ' + C.UI.el.book + ' |');
P('| Footer | © Aggelos Mouzakitis · Business Advisor + Therapist | © Άγγελος Μουζακίτης · Σύμβουλος επιχειρήσεων & ψυχικής υγείας |');
L.push('\n---');

pageEN_EL('Homepage ( / and /el/ )', () => homeBlocks(C.HOME.en), () => homeBlocks(C.HOME.el));
pageEN_EL('Work with me — 1:1 ( /1-to-1/ and /el/1-to-1/ )', () => oneBlocks(C.ONE.en), () => oneBlocks(C.ONE.el));
pageEN_EL('About ( /about/ and /el/about/ )', () => aboutBlocks(C.ABOUT.en), () => aboutBlocks(C.ABOUT.el));

// Reviews
H(2, 'Reviews ( /reviews/ and /el/reviews/ )');
H(3, '🇬🇧 English'); P('**H1:** ' + C.REVIEWS.en.h1); P(C.REVIEWS.en.lead);
H(3, '🇬🇷 Ελληνικά'); P('**H1:** ' + C.REVIEWS.el.h1); P(C.REVIEWS.el.lead); if (C.REVIEWS.el.note) P('_' + C.REVIEWS.el.note + '_');
H(3, 'Testimonials (verbatim, shown in both languages)');
C.RI.forEach((t, i) => { P(`${i + 1}. “${t.q}” — _${t.w}_`); });
L.push('\n---');

pageEN_EL('Book a fit call ( /book/ and /el/book/ )', () => bookBlocks(C.BOOK.en), () => bookBlocks(C.BOOK.el));

// Confidentiality
H(2, 'Confidentiality ( /confidentiality/ and /el/confidentiality/ )');
H(3, '🇬🇧 English'); bul(confEn);
H(3, '🇬🇷 Ελληνικά'); bul(confEl);
L.push('\n---');

// Blog
H(2, 'Writing / Blog ( /blog/ )');
P('**Intro (EN):** Notes on building something of your own — and the business and psychological problems that show up while you do it.');
P('**Intro (EL):** Σημειώσεις για το χτίσιμο κάτι δικού σου — και τα επιχειρηματικά και ψυχολογικά προβλήματα που εμφανίζονται στην πορεία.');
P('\nPosts (' + posts.length + ', filterable All / English / Ελληνικά):\n');
posts.forEach(p => P(`- **${p.title}** _(${p.lang})_ — ${p.date}. ${p.description}`));
L.push('\n---');

fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log('wrote', path.relative(ROOT, OUT), '—', L.join('\n').length, 'chars');
console.log('confidentiality: EN', confEn.length, 'lines, EL', confEl.length, 'lines');
