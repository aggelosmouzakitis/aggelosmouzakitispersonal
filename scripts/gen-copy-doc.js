// gen-copy-doc.js — assemble the full bilingual website copy into one Markdown
// document, extracted verbatim from the compiled bundles so the copy is exactly
// what ships. Run: node scripts/gen-copy-doc.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'site-unification', 'site-copy-en-el.md');

function runExtract(file, exportStmt, extraStub) {
  let code = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const sb = {
    console,
    fetch: () => Promise.resolve({ json: () => Promise.resolve([]) }),
    window: { innerWidth: 1200, addEventListener() {}, removeEventListener() {}, location: { href: '' } },
    document: { getElementById: () => ({}), querySelector: () => null, createElement: () => ({}), body: { appendChild() {} } },
  };
  sb.React = { createElement: () => ({}), useState: v => [v, () => {}], useEffect() {}, useRef: () => ({ current: null }), Fragment: 'F' };
  sb.ReactDOM = { createRoot: () => ({ render() {} }) };
  Object.assign(sb, extraStub || {});
  sb.globalThis = sb;
  code += '\n;' + exportStmt;
  vm.createContext(sb);
  vm.runInContext(code, sb, { timeout: 5000 });
  return sb.__OUT__;
}

const C = runExtract('content-pages.js',
  'globalThis.__OUT__={HOME:HOME,ONE:ONE,ABOUT:ABOUT,REVIEWS:REVIEWS,RI:REVIEWS_ITEMS,BOOK:BOOK,UI:UI,CONF:CONF,FOOTER:FOOTER_COPYLINE};');
const DIAG = runExtract('diagnostic.js', 'globalThis.__OUT__=DIAG;');
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, 'blog/posts.json'), 'utf8'));

// ── Markdown helpers ─────────────────────────────────────────────────────────
const L = [];
const H = (n, t) => L.push('\n' + '#'.repeat(n) + ' ' + t + '\n');
const P = (t) => L.push(t + '\n');
const bul = (arr) => arr.forEach(x => L.push('- ' + x));
const rule = () => L.push('\n---');
function bilingual(title, enFn, elFn) {
  H(2, title);
  H(3, '🇬🇧 English'); enFn();
  H(3, '🇬🇷 Ελληνικά'); elFn();
  rule();
}

function home(c) {
  P('**Promise (H1):** ' + c.promise);
  P('**Tagline:** ' + c.tagline);
  P(c.introA); P(c.introB); P(c.introC);
  H(4, c.recogLabel); bul(c.recog);
  H(4, c.bvyHead); P('_' + c.bvySub + '_');
  P('**' + c.bizLabel + '**'); bul(c.bvyBusiness);
  P('**' + c.youLabel + '**'); bul(c.bvyYou);
  P(c.bvyUnder);
  H(4, c.oneRelHead);
  P('**' + c.bizLabel + ':** ' + c.oneRelBizList + ' — _' + c.oneRelBizQ + '_');
  P('**' + c.youLabel + ':** ' + c.oneRelYouList + ' — _' + c.oneRelYouQ + '_');
  P(c.oneRelNote1); P('**' + c.oneRelNote2 + '**');
  H(4, c.faqLabel); c.faq.forEach(f => { P('**Q. ' + f.q + '**'); P(f.a); });
  H(4, 'Final CTA'); P('**' + c.finalHeading + '**'); P(c.finalSub);
}
function one(c) {
  P('**H1:** ' + c.h1); P('**Lead:** ' + c.lead); c.intro.forEach(P);
  H(4, c.workLabel);
  P('**' + c.bizLabel + '** — ' + c.bizBody); P('_' + c.bizNote + '_');
  P('**' + c.youLabel + '** — ' + c.youBody); P('_' + c.youNote + '_');
  P(c.workUnder);
  H(4, c.lookLabel); P('**' + c.lookLead + '**'); bul(c.lookMaybes); P('**' + c.lookMid + '**'); c.lookClose.forEach(P);
  H(4, c.howLabel); c.steps.forEach(s => P(`**${s.n}. ${s.title}**${s.tag ? ' (' + s.tag + ')' : ''} — ${s.body}`));
  H(4, c.faqLabel); c.faq.forEach(f => { P('**Q. ' + f.q + '**'); P(f.a); });
  H(4, 'CTA'); P('**' + c.ctaHeading + '**'); P(c.ctaSub);
}
function about(c) {
  P('**H1:** ' + c.h1); P('**Role:** ' + c.role); P('**Credentials:** ' + c.creds);
  P('**Lead:** ' + c.lead); c.intro.forEach(P);
  c.sections.forEach(s => { H(4, s.label); s.body.forEach(P); });
  H(4, 'CTA'); P('**' + c.ctaHeading + '**'); P('→ ' + c.ctaLabel);
}
function book(c) {
  P('**H1:** ' + c.h1); c.intro.forEach(P);
  P('_[' + c.bookBelow + ' — calendar embed]_');
  P('**' + c.crossLead + '** ' + c.crossBody + ' → ' + c.crossBtn);
}
function conf(c) {
  P('**H1:** ' + c.h1); c.intro.forEach(P);
  c.sections.forEach(s => {
    H(4, s.label);
    s.body.forEach(P);
    if (s.list) bul(s.list);
    if (s.after) s.after.forEach(P);
  });
}
function diag(c) {
  P('**Intro (H1):** ' + c.intro.h1);
  c.intro.p.forEach(P); P('_' + c.intro.duration + '_'); P('CTA: ' + c.intro.start);
  H(4, 'Section 1 — ' + c.s1.label);
  P('**' + c.s1.stageQ + '**'); bul(c.s1.stage);
  P('**' + c.s1.timeQ + '**'); bul(c.s1.time);
  P('**' + c.s1.revQ + '**'); bul(c.s1.rev);
  P('**' + c.s1.goalQ + '** _(open answer)_');
  P('**' + c.s1.problemQ + '** _(open answer)_');
  const scored = (sec) => { H(4, 'Section — ' + sec.label + ' _(1 = ' + c.scale.low + ' → 5 = ' + c.scale.high + ')_'); sec.statements.forEach((s, i) => P((i + 1) + '. ' + s)); };
  scored(c.s2); scored(c.s3); scored(c.s4);
  H(4, 'Section 5 — ' + c.s5.label);
  c.s5.opens.forEach(o => P('- ' + o + ' _(open answer)_'));
  P('Fields: ' + c.s5.name + ' · ' + c.s5.email + ' · ' + c.s5.website);
  P('Consent: ' + (c.s5.notice || c.s5.consent));
  P('CTA: ' + c.s5.submit);
  H(4, 'After submission');
  P('**' + c.done.h1 + '**'); c.done.p.forEach(P); P('CTA: ' + c.done.book);
}

// ── Header ───────────────────────────────────────────────────────────────────
L.push('# Aggelos Mouzakitis — Website Copy (English + Ελληνικά)');
L.push('\n_Generated from the live source. One brand, one core offer (1:1), two languages. Business Advisor + Licensed Psychotherapist._\n');

H(2, 'Navigation, CTAs & footer labels');
P('| | English | Ελληνικά |');
P('|---|---|---|');
P('| Role | ' + C.UI.en.role + ' | ' + C.UI.el.role + ' |');
P('| Nav | Home · Work with me · About · Writing · Reviews | Αρχική · Συνεργασία · Σχετικά · Άρθρα · Κριτικές |');
P('| Primary CTA | ' + C.UI.en.book + ' | ' + C.UI.el.book + ' |');
P('| Sidebar CTA | Starting Diagnostic · START → | Starting Diagnostic · ΞΕΚΙΝΑ → |');
P('| Footer | ' + C.FOOTER.en + ' | ' + C.FOOTER.el + ' |');
rule();

bilingual('Homepage ( / and /el/ )', () => home(C.HOME.en), () => home(C.HOME.el));
bilingual('Work with me — 1:1 ( /1-to-1/ and /el/1-to-1/ )', () => one(C.ONE.en), () => one(C.ONE.el));
bilingual('About ( /about/ and /el/about/ )', () => about(C.ABOUT.en), () => about(C.ABOUT.el));

// Reviews
H(2, 'Reviews ( /reviews/ and /el/reviews/ )');
H(3, '🇬🇧 English'); P('**H1:** ' + C.REVIEWS.en.h1); P(C.REVIEWS.en.lead); P('_' + C.REVIEWS.en.sub + '_');
H(3, '🇬🇷 Ελληνικά'); P('**H1:** ' + C.REVIEWS.el.h1); P(C.REVIEWS.el.lead); P('_' + C.REVIEWS.el.sub + '_');
P('_(Greek page shows the translation first, with a per-testimonial "' + C.REVIEWS.el.toggle + '" toggle revealing the original English.)_');
H(3, 'Testimonials (shown order; English original + Greek translation)');
C.RI.forEach((tt, i) => {
  P(`**${i + 1}. ${tt.w}**`);
  P('🇬🇧 “' + tt.q + '”');
  P('🇬🇷 “' + tt.qEl + '”');
});
rule();

bilingual('Book a fit call ( /book/ and /el/book/ )', () => book(C.BOOK.en), () => book(C.BOOK.el));
bilingual('Confidentiality ( /confidentiality/ and /el/confidentiality/ )', () => conf(C.CONF.en), () => conf(C.CONF.el));
bilingual('Starting Diagnostic ( /startingdiagnostic/ and /el/startingdiagnostic/ )', () => diag(DIAG.en), () => diag(DIAG.el));

// Blog
H(2, 'Writing / Blog ( /blog/ )');
P('**Intro (EN):** Notes on building something of your own: customers, pricing, decisions, avoidance, ambition, identity, and all the places where business and psychology start getting mixed together.');
P('**Intro (EL):** Για το πώς χτίζεις κάτι δικό σου: πελάτες, τιμές, αποφάσεις, φόβος έκθεσης, φιλοδοξία, ταυτότητα και όλα τα σημεία όπου business και ψυχολογία αρχίζουν να μπλέκονται.');
P('\nPosts (' + posts.length + ', filterable All / English / Ελληνικά):\n');
posts.forEach(p => P(`- **${p.title}** _(${p.lang})_ — ${p.date}. ${p.description}`));
rule();

fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log('wrote', path.relative(ROOT, OUT), '—', L.join('\n').length, 'chars');
