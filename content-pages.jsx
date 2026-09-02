// content-pages.jsx — Home + all specialty pages

// Shared styles — light theme #FFFFFF bg, #282726 text
const C = {
  text: '#282726',
  muted: '#666',
  accent: '#059669',
  border: 'rgba(40,39,38,0.12)',
  sepBorder: 'rgba(40,39,38,0.2)',
};
// These content pages now render inside the shared inner-page shell (rail +
// reading column, in site-chrome.jsx). The shell supplies horizontal insets and
// the max reading width; `.u-main` supplies vertical padding. So the page wrapper
// only carries inherited type + colour — no max-width or centring of its own.
const pageStyle = { fontFamily: 'inherit', color: C.text };
const widePageStyle = { ...pageStyle };
// Inner-page H1 — expressive Inter Tight hierarchy (compact variant so long
// service-page headlines don't overflow the reading column). Never plain Inter.
const h1Style = { fontFamily: 'var(--font-heading)', fontSynthesis: 'none', fontSize: 'clamp(34px,4.2vw,50px)', fontWeight: 800, lineHeight: 1.02, color: C.text, marginBottom: '2.5rem', letterSpacing: '-.035em' };
const h2Style = { fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: C.accent, lineHeight: 1.4, textWrap: 'balance' };
const h3Style = { fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, lineHeight: 1.4, color: C.text, marginBottom: '.6rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '.4rem', letterSpacing: '-.01em' };
const sectionStyle = { marginTop: '3.5rem', paddingTop: '2rem', borderTop: `1px solid ${C.border}` };
const pStyle = { marginBottom: '1.4rem', lineHeight: 1.75, fontSize: '18px', color: C.text };
const leadStyle = { marginBottom: '1.4rem', lineHeight: 1.6, fontSize: '23px', fontWeight: 500, letterSpacing: '-.01em', color: C.text };
const sepStyle = { border: 'none', borderTop: `1px solid ${C.sepBorder}`, margin: '2.5rem 0' };
const ctaBtn = {
  fontFamily: 'inherit', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase',
  color: '#FFFFFF', background: '#282726', border: '1px solid #282726',
  textDecoration: 'none', padding: '.8rem 1.5rem', display: 'inline-block',
  cursor: 'pointer', transition: 'background .15s, color .15s',
};
const footerStyle = { marginTop: '3rem', fontSize: '14px', color: C.muted };
const sectionTitleStyle = { fontSize: '22px', fontWeight: 700, letterSpacing: '-.01em', color: C.accent, marginBottom: '1.2rem', lineHeight: 1.3 };
const homeStyle = { maxWidth: 1100, margin: '0 auto', padding: '4rem 2.5rem 7rem', fontFamily: 'inherit', color: C.text };
const homeStyleMobile = { ...homeStyle, padding: '2rem 1.25rem 5rem' };
const greenLink = { color: C.accent, textUnderlineOffset: '3px', textDecorationThickness: '1px' };
const srOnly = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 };


// Mobile-responsive hook — never touches desktop layout
function useIsMobile() {
  const [mob, setMob] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mob;
}
function Strong({ children }) {
  return React.createElement('span', {
    style: { fontWeight: 400, color: '#282726', borderBottom: '1px solid rgba(40,39,38,.3)', paddingBottom: '1px' }
  }, children);
}
function A({ href, children }) {
  return React.createElement('a', { href, target: '_blank', rel: 'noopener', style: greenLink }, children);
}
function IA({ href, children }) {
  return React.createElement('a', { href, style: greenLink }, children);
}
function Section({ label, children, mob }) {
  // Long-form rhythm: each section is a full-width block opened by a subtle top
  // divider and an Inter Tight kicker label (no left-column grid, no card).
  const ss = mob ? { marginTop: '2.4rem', paddingTop: '1.6rem', borderTop: `1px solid ${C.border}` } : sectionStyle;
  return React.createElement('section', { style: ss },
    React.createElement('h2', { style: { ...h2Style, margin: '0 0 1.15rem' } }, label),
    React.createElement('div', null, children)
  );
}
function P({ children, last }) {
  return React.createElement('p', { style: { ...pStyle, marginBottom: last ? 0 : '1.2rem' } }, children);
}
function FaqItem({ q, children }) {
  // Restyled to the shared service-page FAQ look (24px question). Service pages only.
  return React.createElement('div', { className: 'svc-faq__item' },
    React.createElement('h3', { className: 'svc-faq__q' }, q),
    React.createElement('div', { className: 'svc-faq__a' }, children)
  );
}

function Testimonial({ quote, who }) {
  // Restyled to the shared service-page quote look (17px). Service pages only.
  return React.createElement('blockquote', { className: 'svc-quote' },
    React.createElement('p', null, '“' + quote + '”'),
    React.createElement('cite', null, who)
  );
}
function Testimonials({ items, mob, label }) {
  // Renders as a visible-H2 service section with the shared quote styling.
  return React.createElement('section', { className: 'svc-section' },
    React.createElement('h2', { className: 'svc-h2' }, label || 'What clients say'),
    React.createElement('div', { className: 'svc-quotes' },
      items.map(function (t, i) { return React.createElement(Testimonial, { key: i, quote: t.q, who: t.w }); }),
      React.createElement('p', { className: 'svc-p', style: { marginTop: '4px' } },
        React.createElement('a', { href: '/reviews/', className: 'svc-morelink' }, 'Read more client reflections →'))
    )
  );
}

// ─── SITE FOOTER (shared across all pages) ───────────────────────────────────
// ─── BILINGUAL PATH MODEL (mirrors sidebar.jsx) ───────────────────────────────
// One offer, two languages. English core at root, Greek core under /el/.
const CORE_PATHS = {
  'home':            { en: '/',                 el: '/el/' },
  'one-to-one':      { en: '/1-to-1/',          el: '/el/1-to-1/' },
  'about':           { en: '/about/',           el: '/el/about/' },
  'reviews':         { en: '/reviews/',         el: '/el/reviews/' },
  'book':            { en: '/book/',            el: '/el/book/' },
  'diagnostic':      { en: '/startingdiagnostic/', el: '/el/startingdiagnostic/' },
  'confidentiality': { en: '/confidentiality/', el: '/el/confidentiality/' },
  // One blog for both languages (Greek enters it filtered — no second blog).
  'blog':            { en: '/blog/',            el: '/blog/?lang=el' },
};
const pathFor = (id, lang) => (CORE_PATHS[id] && CORE_PATHS[id][lang]) || (CORE_PATHS[id] && CORE_PATHS[id].en) || '/';
const isEl = (lang) => lang === 'el';

const FOOTER_COLS_BY_LANG = {
  en: [
    { label: 'Work with me', links: [
      { href: '/1-to-1/', label: '1:1' },
      { href: '/book/', label: 'Book a fit call' },
    ] },
    { label: 'Site', links: [
      { href: '/', label: 'Home' },
      { href: '/about/', label: 'About' },
      { href: '/blog/', label: 'Writing' },
      { href: '/reviews/', label: 'Reviews' },
      { href: '/startingdiagnostic/', label: 'Starting Diagnostic' },
      { href: '/confidentiality/', label: 'Confidentiality' },
    ] },
    { label: 'Elsewhere', links: [
      { href: 'https://linkedin.com/in/growth-product-manager/', label: 'LinkedIn', ext: true },
      { href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA', label: 'YouTube', ext: true },
    ] },
  ],
  el: [
    { label: 'Συνεργασία', links: [
      { href: '/el/1-to-1/', label: '1:1' },
      { href: '/el/book/', label: 'Κλείσε γνωριμία' },
    ] },
    { label: 'Χάρτης', links: [
      { href: '/el/', label: 'Αρχική' },
      { href: '/el/about/', label: 'Σχετικά' },
      { href: '/blog/?lang=el', label: 'Άρθρα' },
      { href: '/el/reviews/', label: 'Κριτικές' },
      { href: '/el/startingdiagnostic/', label: 'Starting Diagnostic' },
      { href: '/el/confidentiality/', label: 'Εμπιστευτικότητα' },
    ] },
    { label: 'Αλλού', links: [
      { href: 'https://linkedin.com/in/growth-product-manager/', label: 'LinkedIn', ext: true },
      { href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA', label: 'YouTube', ext: true },
    ] },
  ],
};
const FOOTER_COPYLINE = { en: '© Aggelos Mouzakitis · Business Growth Advisor + Licensed Psychotherapist', el: '© Άγγελος Μουζακίτης · Business Growth Advisor + Ψυχοθεραπευτής' };

function SiteFooter({ mob, lang = 'en' }) {
  // Legacy footer retired: the shared SiteFooterX (site-chrome) now renders the
  // single footer on every page via the universal shell. Rendering null here
  // removes the duplicate footer from every wrapped legacy component.
  return null;
  const FOOTER_COLS = FOOTER_COLS_BY_LANG[lang] || FOOTER_COLS_BY_LANG.en;
  const wrap = { marginTop: mob ? '3.5rem' : '5rem', paddingTop: mob ? '2.5rem' : '3.25rem', borderTop: `1px solid ${C.sepBorder}` };
  const cols = { display: mob ? 'block' : 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' };
  const colLabel = { fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.accent, marginBottom: '1.1rem' };
  const linkStyle = { display: 'inline-flex', alignItems: 'baseline', gap: '.35rem', fontSize: '15px', color: C.text, textDecoration: 'none', lineHeight: 1.4, transition: 'color .12s' };
  const mutedStyle = { fontSize: '15px', color: '#aaa', lineHeight: 1.4, cursor: 'default' };
  const row = { marginBottom: '.75rem' };
  function fLink(l) {
    if (l.muted) return React.createElement('div', { style: row, key: l.label }, React.createElement('span', { style: mutedStyle }, l.label));
    const extra = l.ext ? { target: '_blank', rel: 'noopener' } : {};
    return React.createElement('div', { style: row, key: l.label },
      React.createElement('a', {
        href: l.href, ...extra, style: linkStyle,
        onMouseEnter: e => e.currentTarget.style.color = C.accent,
        onMouseLeave: e => e.currentTarget.style.color = C.text,
      }, l.label, l.ext ? React.createElement('span', { style: { fontSize: '11px', opacity: .5 } }, '↗') : null)
    );
  }
  return React.createElement('footer', { style: wrap },
    React.createElement('div', { style: cols },
      FOOTER_COLS.map(function (col) {
        return React.createElement('div', { key: col.label, style: { marginBottom: mob ? '2rem' : 0 } },
          React.createElement('div', { style: colLabel }, col.label),
          col.links.map(fLink)
        );
      })
    ),
    React.createElement('div', { style: { marginTop: mob ? '1rem' : '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}`, fontSize: '13px', color: C.muted } },
      FOOTER_COPYLINE[lang] || FOOTER_COPYLINE.en
    )
  );
}

// ─── START HERE ──────────────────────────────────────────────────────────────
const START_HERE_ITEMS = [
  { label: 'For founders →', href: '/founders/' },
  { label: 'For solopreneurs →', href: '/solopreneurs/' },
];
function StartHere({ mob }) {
  const rowStyle = (first) => ({
    display: 'flex', alignItems: 'baseline', gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none', color: C.text, transition: 'color .15s',
  });
  return React.createElement('div', { style: { marginTop: mob ? '2.5rem' : '3.5rem' } },
    React.createElement('h2', { style: { ...sectionTitleStyle, fontSize: mob ? '19px' : '22px' } }, 'Start Here'),
    START_HERE_ITEMS.map(function (item, i) {
      return React.createElement('a', {
        key: item.href,
        href: item.href,
        className: 'hv-row',
        style: rowStyle(i === 0),
        onMouseEnter: e => e.currentTarget.style.color = C.accent,
        onMouseLeave: e => e.currentTarget.style.color = C.text,
      },
        React.createElement('span', { style: { fontSize: mob ? '16px' : '18px', fontWeight: 600 } }, item.label)
      );
    })
  );
}

// ─── LATEST WRITING ──────────────────────────────────────────────────────────
function LatestWriting({ mob, lang = 'en' }) {
  const [posts, setPosts] = React.useState(null);
  React.useEffect(() => {
    fetch('/blog/posts.json').then(r => r.json()).then(setPosts).catch(() => setPosts([]));
  }, []);
  const T = {
    en: { head: 'Latest writing', loading: 'Loading…', empty: 'No posts yet.', all: 'See all →' },
    el: { head: 'Πρόσφατα άρθρα', loading: 'Φόρτωση…', empty: 'Δεν υπάρχουν άρθρα ακόμη.', all: 'Δες όλα →' },
  }[lang] || null;
  const t = T || { head: 'Latest writing', loading: 'Loading…', empty: 'No posts yet.', all: 'See all →' };
  const items = posts ? posts.slice(0, 8) : [];
  const rowStyle = (first) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none', color: C.text, transition: 'color .15s',
  });
  return React.createElement('div', { style: { marginTop: mob ? '2.5rem' : '3.5rem' } },
    React.createElement('h2', { style: { ...sectionTitleStyle, fontSize: mob ? '19px' : '22px' } }, t.head),
    posts === null && React.createElement('p', { style: { fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, t.loading),
    posts && posts.length === 0 && React.createElement('p', { style: { fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, t.empty),
    items.length > 0 && React.createElement(React.Fragment, null,
      items.map(function (p, i) {
        return React.createElement('a', {
          key: p.slug,
          href: `/blog/${p.slug}/`,
          className: 'hv-row',
          style: rowStyle(i === 0),
          onMouseEnter: e => e.currentTarget.style.color = C.accent,
          onMouseLeave: e => e.currentTarget.style.color = C.text,
        },
          React.createElement('span', { style: { fontSize: mob ? '16px' : '18px', fontWeight: 600 } }, p.title),
          React.createElement('span', { style: { fontSize: '14px', color: '#767676', whiteSpace: 'nowrap', flexShrink: 0 } }, p.date)
        );
      }),
      React.createElement('div', { style: { textAlign: 'right', marginTop: '1.2rem', fontSize: '14px' } },
        React.createElement(IA, { href: pathFor('blog', lang) }, t.all)
      )
    )
  );
}

// ─── SHARED UI STRINGS + CTA HELPERS (bilingual) ─────────────────────────────
const UI = {
  en: {
    role: 'Business Growth Advisor + Licensed Psychotherapist',
    seeOneToOne: 'See how 1:1 works',
    book: 'Book a fit call',
    readMore: 'Read more client reflections →',
    friendlier: 'Friendlier than I look',
    imgAlt: 'Aggelos Mouzakitis speaking on stage',
  },
  el: {
    role: 'Business Growth Advisor + Ψυχοθεραπευτής',
    seeOneToOne: 'Δες την 1:1 συνεργασία',
    book: 'Κλείσε μια γνωριμία',
    readMore: 'Διάβασε κι άλλες σκέψεις πελατών →',
    friendlier: 'Πιο φιλικός απ’ ό,τι δείχνω',
    imgAlt: 'Ο Άγγελος Μουζακίτης σε ομιλία',
  },
};
const tUI = (lang) => UI[lang] || UI.en;

// Primary + secondary CTA row, language-aware targets.
function CtaRow({ lang, mob, primaryTo = 'one-to-one', primaryLabel, secondaryTo = 'book', secondaryLabel }) {
  // Restyled to the shared green pill CTA row (primary solid, secondary ghost).
  const u = tUI(lang);
  return React.createElement('div', { className: 'svc-ctarow' },
    React.createElement('a', { href: pathFor(primaryTo, lang), className: 'cta-btn svc-cta' }, (primaryLabel || u.seeOneToOne) + ' →'),
    React.createElement('a', { href: pathFor(secondaryTo, lang), className: 'cta-btn svc-cta svc-cta--ghost' }, secondaryLabel || u.book)
  );
}

// Accent-marked situation/bullet list.
function Bullets({ items, mob }) {
  // Restyled to the shared service-page bullet list (green tick marker, no em dash).
  return React.createElement('ul', { className: 'svc-bullets' },
    items.map((it, i) => React.createElement('li', { key: i }, it))
  );
}

// Emphatic final CTA block.
function FinalCta({ lang, mob, heading, sub }) {
  const u = tUI(lang);
  return React.createElement('div', {
    style: { marginTop: mob ? '3rem' : '4rem', padding: mob ? '1.6rem 1.4rem' : '2.4rem 2.6rem', border: `1.5px solid rgba(5,150,105,.4)`, background: 'rgba(5,150,105,.06)', borderRadius: '14px' },
  },
    React.createElement('p', { style: { fontSize: mob ? '19px' : '23px', fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1.5, color: C.text, margin: 0 } }, heading),
    sub && React.createElement('p', { style: { fontSize: '16px', lineHeight: 1.7, color: C.muted, margin: '.9rem 0 0' } }, sub),
    React.createElement('a', {
      href: pathFor('book', lang), className: 'cta-btn',
      style: { display: 'inline-block', marginTop: '1.4rem', padding: '.9rem 1.8rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', background: C.accent, border: `1.5px solid ${C.accent}`, color: '#fff', textDecoration: 'none', borderRadius: '2px' },
      onMouseEnter: e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.borderColor = '#059669'; },
      onMouseLeave: e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.borderColor = C.accent; },
    }, u.book + ' →')
  );
}

// ─── FAQ ACCORDION (accessible; answers stay in the DOM for SEO) ─────────────
function FaqAccordion({ items, mob }) {
  const [open, setOpen] = React.useState(-1);
  return React.createElement('div', { style: { ...cardBase, overflow: 'hidden' } },
    items.map(function (it, i) {
      const isOpen = open === i;
      return React.createElement('div', { key: i, style: { borderTop: i ? `1px solid ${C.border}` : 'none' } },
        React.createElement('button', {
          onClick: () => setOpen(isOpen ? -1 : i),
          'aria-expanded': isOpen ? 'true' : 'false',
          className: 'hv-row',
          style: { display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: mob ? '1rem 1.1rem' : '1.15rem 1.35rem', fontSize: mob ? '16px' : '17px', fontWeight: 600, color: C.text, lineHeight: 1.5 },
        },
          React.createElement('span', null, it.q),
          React.createElement('span', { 'aria-hidden': 'true', style: { color: C.accent, fontWeight: 700, flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .15s', fontSize: '22px', lineHeight: 1 } }, '+')
        ),
        React.createElement('div', { style: { display: isOpen ? 'block' : 'none', padding: mob ? '0 1.1rem 1.1rem' : '0 1.35rem 1.3rem', fontSize: '16px', lineHeight: 1.7, color: C.text } }, it.a)
      );
    })
  );
}

// ── Homepage building blocks ─────────────────────────────────────────────────
function TwoColBoard({ mob, leftLabel, leftItems, rightLabel, rightItems }) {
  const col = (label, items) => React.createElement('div', { style: { flex: 1, minWidth: 0 } },
    React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.accent, marginBottom: '1.1rem' } }, label),
    React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } },
      items.map((it, i) => React.createElement('li', { key: i, style: { display: 'flex', gap: '.7rem', alignItems: 'baseline', padding: '.55rem 0', fontSize: mob ? '15px' : '16px', lineHeight: 1.55, color: C.text, borderTop: i ? `1px solid ${C.border}` : 'none' } },
        React.createElement('span', { style: { color: C.accent, flexShrink: 0, fontWeight: 700 } }, '·'),
        React.createElement('span', null, it)))));
  return React.createElement('div', { style: { ...cardBase, display: 'flex', flexDirection: mob ? 'column' : 'row', gap: mob ? '1.75rem' : '3.5rem', padding: mob ? '1.6rem' : '2.5rem 3rem', background: '#fff', boxShadow: '0 10px 40px rgba(40,39,38,.06)' } },
    col(leftLabel, leftItems),
    !mob && React.createElement('div', { style: { width: 1, background: C.border, alignSelf: 'stretch' } }),
    col(rightLabel, rightItems)
  );
}
function QCard({ mob, label, body, q }) {
  return React.createElement('div', { className: 'hv-card', style: { ...cardBase, padding: mob ? '1.3rem' : '1.6rem', flex: 1 } },
    React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.accent, marginBottom: '.8rem' } }, label),
    React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.text, margin: '0 0 1rem' } }, body),
    React.createElement('p', { style: { fontSize: mob ? '15px' : '16px', fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.5 } }, q)
  );
}

// ─── MODERN SERVICE-PAGE SYSTEM (one shared component + typography for all 15 ──
// legacy service routes). Collapses the editorial rail shell into a clean
// centered reading column and drives every heading/body size from CSS media
// queries, so no route carries its own inline typography overrides. ───────────
const SVC_CSS = `
.u-shell:has(.svc-page){display:block;max-width:880px;margin-inline:auto;padding-inline:clamp(20px,5vw,40px)}
.u-shell:has(.svc-page) .u-shell__rail,.u-shell:has(.svc-page) .u-shell__gutter{display:none}
.u-shell:has(.svc-page) .u-shell__body{grid-column:auto;width:100%;min-width:0}

.svc-page{--svc-read:720px;color:#181A1C;font-family:var(--font-body)}
.svc-page *{box-sizing:border-box}
.svc-page .svc-h1{max-width:980px;margin:0 0 22px;font-family:var(--font-display);font-synthesis:none;font-size:clamp(48px,4.7vw,64px);font-weight:400;line-height:0.98;letter-spacing:-0.045em;color:#1A1C1D;text-wrap:balance}
html[lang^="el"] .svc-page .svc-h1{font-family:var(--font-heading);font-weight:800}
.svc-page .svc-lead{max-width:var(--svc-read);margin:0;font-family:var(--font-body);font-size:clamp(20px,1.65vw,23px);line-height:1.5;color:#282726}
.svc-section{margin-top:72px}
.svc-page .svc-h2{max-width:var(--svc-read);margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(36px,3.2vw,44px);line-height:1.05;letter-spacing:-0.035em;font-weight:800;color:#1A1C1D;text-wrap:balance}
.svc-page .svc-p{max-width:var(--svc-read);margin:0 0 20px;font-size:18px;line-height:1.65;color:#282726}
.svc-p:last-child{margin-bottom:0}
.svc-p a,.svc-lead a,.svc-faq__a a,.svc-note a{color:#059669;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.svc-p strong,.svc-faq__a strong{font-weight:700;color:#1A1C1D}
.svc-eyebrow{margin:0 0 12px;font-family:var(--font-body);font-size:13px;line-height:1.3;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#059669}
.svc-faq{max-width:var(--svc-read);border-top:1px solid rgba(24,26,28,0.14)}
.svc-faq__item{border-bottom:1px solid rgba(24,26,28,0.14);padding:22px 0}
.svc-page .svc-faq__q{margin:0 0 10px;font-family:var(--font-heading);font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:#1A1C1D}
.svc-page .svc-faq__a{margin:0;font-size:18px;line-height:1.65;color:#282726}
.svc-faq__a p{margin:0 0 12px}.svc-faq__a p:last-child{margin:0}
.svc-quotes{max-width:var(--svc-read)}
.svc-quote{margin:0 0 22px;padding:0 0 0 20px;border-left:3px solid rgba(5,150,105,0.4)}
.svc-quote p{margin:0 0 8px;font-size:17px;line-height:1.6;color:#282726}
.svc-quote cite{font-style:normal;font-size:13px;line-height:1.3;letter-spacing:0.08em;text-transform:uppercase;color:#767676}
.svc-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:56px;padding:0 30px;background:#059669;color:#fff;font-family:var(--font-body);font-size:16px;font-weight:700;line-height:1;letter-spacing:0.01em;border-radius:999px;text-decoration:none;transition:filter .18s,gap .18s;white-space:nowrap}
.svc-cta:hover{filter:brightness(0.92);gap:12px}
.svc-cta--ghost{background:transparent;color:#1A1C1D;border:1.5px solid rgba(24,26,28,0.28)}
.svc-cta--ghost:hover{border-color:#059669;color:#059669;filter:none}
.svc-ctarow{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}
.svc-note{max-width:var(--svc-read);margin:16px 0 0;font-size:15px;line-height:1.6;color:#666}
.svc-bullets{max-width:var(--svc-read);list-style:none;margin:4px 0 0;padding:0}
.svc-bullets li{position:relative;padding:8px 0 8px 22px;font-size:18px;line-height:1.6;color:#282726;border-top:1px solid rgba(24,26,28,0.1)}
.svc-bullets li:first-child{border-top:0}
.svc-bullets li::before{content:"";position:absolute;left:0;top:16px;width:10px;height:2px;background:#059669}
.svc-bullets li a{color:#059669;text-decoration:underline;text-underline-offset:3px}
@media (max-width:767px){.svc-bullets li{font-size:17px}}
.svc-cards{margin:4px 0 0}
.svc-rule{border:0;border-top:1px solid rgba(24,26,28,0.14);margin:0}
.svc-page .svc-related__h{margin:0 0 8px;font-family:var(--font-heading);font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:#1A1C1D}
.svc-related{list-style:none;max-width:var(--svc-read);margin:0;padding:0;border-top:1px solid rgba(24,26,28,0.14)}
.svc-related li{border-bottom:1px solid rgba(24,26,28,0.14)}
.svc-related a{display:flex;justify-content:space-between;gap:20px;padding:15px 0;font-family:var(--font-heading);font-size:17px;line-height:1.4;font-weight:600;color:#1A1C1D;text-decoration:none}
.svc-related a:hover{color:#059669}
@media (max-width:767px){
  .u-shell:has(.svc-page){padding-inline:20px}
  .svc-page .svc-h1{font-size:clamp(36px,10.5vw,44px)}
  .svc-page .svc-lead{font-size:19px}
  .svc-section{margin-top:52px}
  .svc-page .svc-h2{font-size:clamp(29px,8vw,34px);line-height:1.08}
  .svc-page .svc-p,.svc-page .svc-faq__a{font-size:17px;line-height:1.6}
  .svc-page .svc-faq__q,.svc-page .svc-h3{font-size:21px;line-height:1.25}
  .svc-cta{min-height:54px}
}
@media (max-width:420px){
  .svc-ctarow{flex-direction:column;align-items:stretch}
  .svc-cta{white-space:normal;text-align:center;padding-inline:18px;line-height:1.25}
}
`;
function SvcStyles() { return React.createElement('style', { dangerouslySetInnerHTML: { __html: SVC_CSS } }); }
function SvcPage({ children }) {
  return React.createElement('main', { className: 'svc-page' }, React.createElement(SvcStyles), children);
}
function SvcH1({ children }) { return React.createElement('h1', { className: 'svc-h1' }, children); }
function SvcLead({ children }) { return React.createElement('p', { className: 'svc-lead' }, children); }
function SvcSection({ title, id, children }) {
  return React.createElement('section', { className: 'svc-section' },
    React.createElement('h2', { className: 'svc-h2', id: id || undefined }, title),
    children);
}
function SvcP({ children }) { return React.createElement('p', { className: 'svc-p' }, children); }
function SvcCta({ href, children, ghost }) {
  return React.createElement('a', { href, className: 'cta-btn svc-cta' + (ghost ? ' svc-cta--ghost' : '') }, children);
}
function SvcNote({ children }) { return React.createElement('p', { className: 'svc-note' }, children); }
function SvcFaq({ items }) {
  return React.createElement('div', { className: 'svc-faq' },
    items.map((it, i) => React.createElement('div', { key: i, className: 'svc-faq__item' },
      React.createElement('h3', { className: 'svc-faq__q' }, it.q),
      React.createElement('div', { className: 'svc-faq__a' },
        (Array.isArray(it.a) ? it.a : [it.a]).map((para, j) =>
          React.createElement('p', { key: j }, ...(Array.isArray(para) ? para : [para]))))
    )));
}
function SvcQuotes({ items, more }) {
  return React.createElement('div', { className: 'svc-quotes' },
    items.map((t, i) => React.createElement('blockquote', { key: i, className: 'svc-quote' },
      React.createElement('p', null, '“' + t.q + '”'),
      React.createElement('cite', null, t.w))),
    more ? React.createElement('p', { className: 'svc-p', style: { marginTop: '4px' } }, React.createElement(IA, { href: '/reviews/' }, more)) : null);
}
function SvcRelated({ items, heading }) {
  return React.createElement('section', { className: 'svc-section' },
    React.createElement('h2', { className: 'svc-related__h' }, heading || 'Related'),
    React.createElement('ul', { className: 'svc-related' },
      items.map((it, i) => React.createElement('li', { key: i },
        React.createElement('a', { href: it.href },
          React.createElement('span', null, it.label.replace(/\s*→\s*$/, '')),
          React.createElement('span', { 'aria-hidden': 'true' }, '→')))))
  );
}

// ─── HOME PAGE (bilingual) ───────────────────────────────────────────────────
const HOME = {
  en: {
    promise: "Build something of your own. Or take what you've already built much further.",
    tagline: 'Figure out what the business needs. Work through what gets in the way. Business and psychology, together.',
    introA: 'I spent 18+ years in product and growth, building companies and advising more than 500 of them. I also trained as a psychotherapist.',
    introB: "Today I work 1:1 and with groups of people building something of their own. Sometimes the problem is clearly business. Sometimes it's more complicated and includes you.",
    introC: "Quite often, business and psychology collide to the point where it's hard to tell yourself where the problem actually is.",
    recogLabel: 'You may recognise some of this',
    recog: [
      "You've been meaning to start something for a long time. You're still getting ready.",
      'You need more customers. Somehow, everything except selling keeps making it onto the to-do list.',
      "You know you're undercharging. The number still hasn't changed.",
      "Every time the direction you've chosen gets difficult, another one suddenly starts looking better.",
      "The business depends on you for almost everything. You're not sure how much of that is actually necessary.",
      "On paper, things are going well. You feel less and less connected to what you're building.",
      "You got somewhere you worked hard to reach. Now you're not sure whether you want the next level, or just think you should.",
      'You understand your patterns extremely well. They keep happening anyway.',
    ],
    bizLabel: 'The business', youLabel: 'You',
    bvyHead: "Sometimes the work is tactical. Sometimes it's psychological.",
    bvySub: "The hard part is knowing which one you're actually dealing with.",
    bvyBusiness: [
      'Your offer is still weak.',
      "Your positioning isn't clear enough.",
      "You don't have a reliable way to find customers.",
      "Your pricing doesn't make sense.",
      "You're trying to move five things at once.",
      "You don't know which move actually matters most right now.",
    ],
    bvyYou: [
      'You know you need to sell. You keep avoiding it.',
      "A no lands much more personally than you'd like.",
      'Being visible feels strangely threatening, even though you know the business needs it.',
      "You keep changing direction before the previous one has had time to work.",
      'Your sense of worth is a little too tied to how well the business is doing.',
      "You can explain the pattern perfectly. That hasn't stopped you repeating it.",
    ],
    bvyUnder: "Sometimes the answer is a better business move. Sometimes it's deeper work. Quite often, we need to work on both before it's obvious which one was holding the other back.",
    oneRelHead: 'One relationship. Both sides of the problem are welcome.',
    oneRelBizList: 'Offer, positioning, pricing, customers, sales, priorities, decisions, execution.',
    oneRelBizQ: 'What does the business actually need now?',
    oneRelYouList: 'Avoidance, rejection, fear of visibility, perfectionism, money, self-doubt, control, identity, uncertainty, commitment.',
    oneRelYouQ: 'What makes getting there harder than it needs to be?',
    oneRelNote1: "Some weeks we'll barely talk psychology. Other weeks, the tactical problem can wait because something else needs attention first.",
    oneRelNote2: "You don't need to know which one you have before you come in.",
    faqLabel: 'Common questions',
    faq: [
      { q: 'Do I need to already have a business?', a: "No. You can be starting, freelancing, consulting, building alongside a job, or already running something established. The common bit is that you're seriously trying to build something of your own." },
      { q: 'Is this therapy or business advisory?', a: "It can involve both. I'm a business advisor and a psychotherapist. If the problem is the business, we'll work on the business. If something in you is getting in the way, we can work there too." },
      { q: "What if I don't know which one the problem is?", a: "Good. You don't need to diagnose yourself before we talk. Working that out is part of the job." },
    ],
    finalHeading: "Building something is hard enough without getting in your own way.",
    finalSub: "If you have something you're trying to start, fix or grow, tell me what's going on.",
  },
  el: {
    promise: 'Χτίζεις κάτι δικό σου; Ας το πάμε παρακάτω.',
    tagline: 'Ξεκαθαρίζουμε τι χρειάζεται το business και τι σε κρατάει πίσω. Business και ψυχολογία, μαζί.',
    introA: 'Πέρασα 18+ χρόνια στο product και το growth, χτίζοντας δικές μου εταιρείες και συμβουλεύοντας πάνω από 500 επιχειρήσεις. Παράλληλα εκπαιδεύτηκα ως ψυχοθεραπευτής.',
    introB: 'Σήμερα δουλεύω 1:1 και με ομάδες ανθρώπων που χτίζουν κάτι δικό τους.',
    introC: 'Μερικές φορές το πρόβλημα είναι καθαρά business. Μερικές φορές είναι πιο περίπλοκο και έχει να κάνει και με εσένα. Και αρκετά συχνά, τα δύο μπλέκονται τόσο που δεν είναι καθόλου ξεκάθαρο πού ακριβώς είναι το πρόβλημα.',
    recogLabel: 'Μήπως σου θυμίζει κάτι;',
    recog: [
      'Θέλεις καιρό να ξεκινήσεις κάτι. Ακόμα ετοιμάζεσαι.',
      "Χρειάζεσαι περισσότερους πελάτες. Κι όμως, πάντα βρίσκεται κάτι πιο επείγον από το να πουλήσεις.",
      'Ξέρεις ότι χρεώνεις λίγο. Η τιμή, όμως, παραμένει ίδια.',
      'Κάθε φορά που η κατεύθυνση που διάλεξες δυσκολεύει, εμφανίζεται μια καινούρια που ξαφνικά μοιάζει καλύτερη.',
      'Η επιχείρηση εξαρτάται από εσένα σχεδόν για τα πάντα. Δεν ξέρεις πόσο από αυτό είναι όντως απαραίτητο.',
      'Στα χαρτιά, τα πράγματα πάνε καλά. Εσύ, όμως, νιώθεις όλο και λιγότερο συνδεδεμένος με αυτό που χτίζεις.',
      'Έφτασες κάπου που ήθελες πολύ. Όμως τώρα δεν ξέρεις αν θέλεις πραγματικά να πας στο επόμενο επίπεδο ή απλώς πιστεύεις ότι θα έπρεπε να το θέλεις.',
      'Καταλαβαίνεις πολύ καλά τα μοτίβα σου. Παραδόξως, συνεχίζεις να τα επαναλαμβάνεις.',
    ],
    bizLabel: 'Το business', youLabel: 'Εσύ',
    bvyHead: 'Κάποιες φορές χρειάζεται business προσέγγιση. Άλλες, ψυχολογικό σκάψιμο.',
    bvySub: 'Πολλές φορές, είναι δύσκολο να ξεχωρίσεις τι από τα δύο έχεις πραγματικά μπροστά σου.',
    bvyBusiness: [
      'Το offer σου είναι ακόμα αδύναμο.',
      'Το positioning δεν είναι αρκετά ξεκάθαρο.',
      'Δεν έχεις σταθερό τρόπο να βρίσκεις πελάτες.',
      'Το pricing σου δεν βγάζει νόημα.',
      'Κυνηγάς πέντε πράγματα ταυτόχρονα.',
      'Δεν ξέρεις ποια κίνηση έχει πραγματικά σημασία τώρα.',
    ],
    bvyYou: [
      'Ξέρεις ότι πρέπει να πουλήσεις. Όμως, το αποφεύγεις.',
      "Ένα «όχι» σε χτυπάει πιο προσωπικά απ' όσο θα ήθελες.",
      'Ο φόβος έκθεσης σε κρατά πίσω, παρότι ξέρεις ότι χωρίς έκθεση δύσκολα έρχεται ζήτηση.',
      'Αλλάζεις κατεύθυνση πριν προλάβει να δουλέψει η προηγούμενη.',
      "Το πώς πάει το business επηρεάζει λίγο περισσότερο απ' όσο θα ήθελες το πώς βλέπεις τον εαυτό σου.",
      'Μπορείς να εξηγήσεις τέλεια πού είναι το πρόβλημα, αλλά δεν περνάς στη δράση.',
    ],
    bvyUnder: 'Κάποιες φορές η απάντηση είναι μια καλύτερη business προσέγγιση ή ένα διαφορετικό πρακτικό πλάνο. Άλλες φορές χρειάζεται να πάμε πιο βαθιά — και αρκετά συχνά πρέπει να δουλέψουμε και τα δύο μέχρι να ξεκαθαρίσει ποιο από τα δύο κρατάει πίσω το άλλο.',
    oneRelHead: 'Μία συνεργασία όπου δουλεύουμε και το business και ό,τι δικό σου μπαίνει στη μέση.',
    oneRelBizList: 'Offer, positioning, τιμές, πελάτες, πωλήσεις, προτεραιότητες, αποφάσεις, εκτέλεση.',
    oneRelBizQ: 'Τι χρειάζεται πραγματικά το business τώρα;',
    oneRelYouList: 'Αποφυγή, απόρριψη, φόβος έκθεσης, τελειομανία, χρήματα, αμφιβολία, ανάγκη για έλεγχο, ταυτότητα, αβεβαιότητα, δέσμευση.',
    oneRelYouQ: 'Τι σε δυσκολεύει να φτάσεις εκεί που θέλεις;',
    oneRelNote1: 'Κάποιες φορές θα μιλήσουμε σχεδόν μόνο για το business. Άλλες, το πρακτικό κομμάτι μπορεί να περιμένει λίγο γιατί υπάρχει κάτι πιο σημαντικό που πρέπει να δούμε πρώτα.',
    oneRelNote2: 'Δεν χρειάζεται να έχεις όλες τις απαντήσεις προκειμένου να μιλήσουμε.',
    faqLabel: 'Συχνές ερωτήσεις',
    faq: [
      { q: 'Πρέπει να έχω ήδη επιχείρηση;', a: 'Όχι. Μπορεί να ξεκινάς τώρα, να δουλεύεις ως freelancer ή consultant, να χτίζεις κάτι παράλληλα με τη δουλειά σου ή να τρέχεις ήδη τη δική σου επιχείρηση. Το κοινό είναι ότι προσπαθείς σοβαρά να χτίσεις κάτι δικό σου.' },
      { q: 'Είναι ψυχοθεραπεία ή συμβουλευτική επιχειρήσεων;', a: 'Είναι και τα δύο παράλληλα. Είμαι business growth advisor και ψυχοθεραπευτής. Αν το πρόβλημα είναι το business, δουλεύουμε το business. Αν μπαίνει κάτι δικό σου στη μέση, μπορούμε να δουλέψουμε κι αυτό.' },
      { q: 'Κι αν δεν ξέρω ποιο από τα δύο είναι;', a: 'Δεν χρειάζεται να έρθεις με διάγνωση. Το να ξεκαθαρίσουμε τι πραγματικά συμβαίνει είναι μέρος της δουλειάς.' },
    ],
    finalHeading: 'Το να χτίσεις κάτι δικό σου είναι ήδη αρκετά δύσκολο.',
    finalSub: 'Αν προσπαθείς να ξεκινήσεις, να ξεκολλήσεις ή να αναπτύξεις κάτι παραπάνω, έλα να το συζητήσουμε.',
  },
};

function HomePage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = HOME[lang] || HOME.en;
  const u = tUI(lang);
  const mainStyle = mob ? homeStyleMobile : homeStyle;
  const introRowStyle = mob ? { display: 'flex', flexDirection: 'column', gap: '1.75rem' } : { display: 'flex', gap: '4rem', alignItems: 'center' };
  const introTextStyle = mob ? { width: '100%' } : { flex: '1.15 1 0', minWidth: 0, maxWidth: 560 };
  const introImgWrapStyle = mob ? { width: '100%' } : { flex: '1 1 0', minWidth: 0 };
  const introImgStyle = { width: '100%', aspectRatio: mob ? '16 / 10' : '4 / 5', objectFit: 'cover', borderRadius: '14px', display: 'block' };
  const sectionGap = React.createElement('div', { style: { marginTop: mob ? '3.5rem' : '6rem' } });
  const headingStyle = { fontFamily: 'var(--font-heading)', fontSynthesis: 'none', fontSize: mob ? '22px' : '28px', fontWeight: 750, letterSpacing: '-.03em', lineHeight: 1.15, color: C.text, margin: '0 0 .6rem' };
  const subStyle = { fontSize: mob ? '17px' : '19px', color: C.muted, lineHeight: 1.5, margin: '0 0 1.8rem' };

  return React.createElement('main', { style: mainStyle },
    // ── Hero ──
    React.createElement('div', { style: introRowStyle },
      React.createElement('div', { style: introTextStyle },
        React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.accent, marginBottom: '1.1rem' } }, u.role),
        React.createElement('h1', { style: { ...h1Style, margin: '0 0 1.1rem' } }, c.promise),
        React.createElement('p', { style: { fontSize: mob ? '17px' : '19px', fontWeight: 600, color: C.accent, margin: '0 0 1.5rem', lineHeight: 1.45 } }, c.tagline),
        React.createElement(P, null, c.introA),
        React.createElement(P, null, c.introB),
        React.createElement(P, { last: true }, c.introC),
        React.createElement(CtaRow, { lang, mob })
      ),
      React.createElement('div', { style: introImgWrapStyle },
        React.createElement('img', { src: 'https://aggelosmouzakitis.com/img/aggelos-homepage.webp', alt: u.imgAlt, loading: 'eager', fetchPriority: 'high', decoding: 'async', style: introImgStyle }),
        React.createElement('div', { style: { display: mob ? 'none' : 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', paddingRight: '26px' } },
          React.createElement('span', { style: { fontFamily: "'Segoe Script','Bradley Hand','Comic Sans MS',cursive", fontStyle: 'italic', fontSize: '16px', color: C.accent, transform: 'rotate(-3deg)', whiteSpace: 'nowrap', alignSelf: 'flex-end' } }, u.friendlier),
          React.createElement('svg', { width: 44, height: 40, viewBox: '0 0 44 40', fill: 'none', stroke: C.accent, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', style: { marginBottom: '2px' } },
            React.createElement('path', { d: 'M40 3 C 44 20, 33 30, 6 30' }),
            React.createElement('path', { d: 'M15 24 L5 30 L14 36' })
          )
        )
      )
    ),

    sectionGap,

    // ── Recognition (two columns) ──
    React.createElement('h2', { style: headingStyle }, c.recogLabel),
    React.createElement('div', { style: { columnGap: mob ? 0 : '3rem', columnCount: mob ? 1 : 2, marginTop: '1.4rem' } },
      c.recog.map((it, i) => React.createElement('p', { key: i, style: { breakInside: 'avoid', fontSize: mob ? '16px' : '17px', lineHeight: 1.6, color: C.text, margin: '0 0 1.1rem' } }, it))
    ),

    sectionGap,

    // ── Business vs You — the main visual object ──
    React.createElement('h2', { style: headingStyle }, c.bvyHead),
    React.createElement('p', { style: subStyle }, c.bvySub),
    React.createElement(TwoColBoard, { mob, leftLabel: c.bizLabel, leftItems: c.bvyBusiness, rightLabel: c.youLabel, rightItems: c.bvyYou }),
    React.createElement('p', { style: { fontSize: mob ? '17px' : '18px', lineHeight: 1.65, color: C.text, margin: '1.8rem 0 0', maxWidth: '62ch' } }, c.bvyUnder),

    sectionGap,

    // ── Short 1:1 section ──
    React.createElement('h2', { style: headingStyle }, c.oneRelHead),
    React.createElement('div', { style: { display: 'flex', flexDirection: mob ? 'column' : 'row', gap: mob ? '1rem' : '1.25rem', marginTop: '1.4rem' } },
      React.createElement(QCard, { mob, label: c.bizLabel, body: c.oneRelBizList, q: c.oneRelBizQ }),
      React.createElement(QCard, { mob, label: c.youLabel, body: c.oneRelYouList, q: c.oneRelYouQ })
    ),
    React.createElement('p', { style: { fontSize: '16px', lineHeight: 1.7, color: C.muted, margin: '1.6rem 0 0' } }, c.oneRelNote1),
    React.createElement('p', { style: { fontSize: mob ? '17px' : '18px', fontWeight: 600, color: C.text, margin: '.6rem 0 0', lineHeight: 1.6 } }, c.oneRelNote2),
    React.createElement('p', { style: { margin: '1.3rem 0 0' } }, React.createElement(IA, { href: pathFor('one-to-one', lang) }, u.seeOneToOne + ' →')),

    sectionGap,

    // ── FAQ (max 3) ──
    React.createElement('h2', { style: headingStyle }, c.faqLabel),
    React.createElement('div', { style: { marginTop: '1.4rem' } }, React.createElement(FaqAccordion, { items: c.faq, mob })),

    // ── Final CTA ──
    React.createElement(FinalCta, { lang, mob, heading: c.finalHeading, sub: c.finalSub }),

    React.createElement(SiteFooter, { mob, lang })
  );
}

// ─── 1:1 OFFER PAGE (bilingual) ──────────────────────────────────────────────
const ONE = {
  en: {
    h1: 'Work with me, 1:1',
    lead: "Private work on the business you're building and whatever in you is getting tangled up with it.",
    intro: [
      "Some problems need a tactical answer. Others need deeper work. Often, it's not obvious which one you're dealing with until we get into it.",
      "The point of 1:1 is that we don't have to choose one lens in advance.",
    ],
    workLabel: 'What can we work on?',
    bizLabel: 'The business',
    bizBody: 'Offer, positioning, pricing, customer acquisition, sales, priorities, difficult decisions, execution.',
    bizNote: "Sometimes you need somebody to look at the business and say: this is the problem, this is noise, and this is what I'd do next.",
    youLabel: 'You',
    youBody: 'Avoidance, fear of visibility, rejection, self-doubt, perfectionism, control, identity, money, uncertainty, commitment.',
    youNote: 'Sometimes the strategy is already good enough. The difficult bit is getting yourself to actually execute it.',
    workUnder: "And sometimes both the tactical and the personal need to be worked together. That's usually where this gets interesting.",
    lookLabel: 'What does the work actually look like?',
    lookLead: 'You bring whatever is live.',
    lookMaybes: [
      "Maybe you don't know how to get the next ten customers.",
      "Maybe you know exactly what conversation you need to have and you've been avoiding it for three months.",
      'Maybe the company is growing but everything still has to go through you.',
      "Maybe something that used to matter enormously to you suddenly doesn't, and you're not sure what that means for the business.",
      "Maybe you've analysed the problem so thoroughly that analysis itself has become part of the problem.",
    ],
    lookMid: "We work with what's actually there.",
    lookClose: [
      "I may challenge the business decision. I may challenge the story you're telling yourself about it.",
      "Sometimes we'll make a plan. Sometimes we'll stay with something uncomfortable long enough to understand why it keeps showing up.",
      "The goal isn't to turn everything into psychology. It's to get a more accurate read on what is happening, then do something useful with it.",
    ],
    howLabel: 'How it starts',
    steps: [
      { n: '1', title: 'Fit call', tag: '~15 min · free', body: "We talk briefly about what you're building, what's going on and whether I seem like the right person for it. It's a fit check, not a free session." },
      { n: '2', title: 'First session', body: "We get properly into the problem. You don't need to arrive with the “right” version of it — bring it as you currently understand it. By the end, I want us to have a better read on what's actually going on and a concrete next move. Even if we decide not to continue, the session should be useful on its own." },
      { n: '3', title: 'If it makes sense, we continue', body: 'Private, ongoing 1:1 work.' },
    ],
    faqLabel: 'Common questions',
    faq: [
      { q: 'Is this therapy?', a: "Sometimes the work goes into territory you would absolutely recognise as psychotherapy. I'm a trained and registered psychotherapist, so we don't have to stop because the problem got personal. But this isn't a conventional therapy relationship where the business is merely context. The business itself is part of the work." },
      { q: 'Is this business coaching?', a: "Not really. I will give you an opinion on the business. We can work directly on your offer, pricing, positioning, customer acquisition or a decision in front of you. I don't have a framework that every client gets taken through." },
      { q: "What if I don't know whether the problem is business or psychological?", a: "You don't need to. Quite often, that's the first thing we need to work out." },
      { q: 'Do I need to already have a business?', a: "No. You can be trying to start, building alongside a job, freelancing, consulting or already running an established business. What matters is that you're genuinely trying to build something of your own." },
    ],
    ctaHeading: 'Bring me the problem as you currently understand it.',
    ctaSub: "We'll work out what it actually needs.",
  },
  el: {
    h1: '1:1 Συνεργασία',
    lead: 'Δουλεύουμε 1:1 πάνω στο business που χτίζεις και σε ό,τι δικό σου έχει μπλεχτεί μαζί του.',
    intro: [
      'Κάποια προβλήματα θέλουν μια πρακτική λύση στο business. Άλλα χρειάζονται πιο βαθιά δουλειά. Και αρκετά συχνά, δεν είναι ξεκάθαρο ποιο από τα δύο έχεις μπροστά σου μέχρι να μπούμε στο θέμα.',
      'Στο 1:1 δεν χρειάζεται να διαλέξουμε από πριν.',
    ],
    workLabel: 'Τι μπορούμε να δουλέψουμε',
    bizLabel: 'Το business',
    bizBody: 'Offer, positioning, τιμές, πελάτες, πωλήσεις, προτεραιότητες, δύσκολες αποφάσεις, εκτέλεση.',
    bizNote: 'Μερικές φορές χρειάζεσαι κάποιον να κοιτάξει το business και να σου πει: αυτό είναι το πρόβλημα, αυτό είναι θόρυβος και, στη θέση σου, από εδώ θα ξεκινούσα.',
    youLabel: 'Εσύ',
    youBody: 'Αποφυγή, φόβος έκθεσης, απόρριψη, αμφιβολία, τελειομανία, ανάγκη για έλεγχο, ταυτότητα, χρήματα, αβεβαιότητα, δέσμευση.',
    youNote: 'Μερικές φορές η στρατηγική είναι ήδη αρκετά καλή. Το δύσκολο πολλές φορές είναι να την εφαρμόσεις.',
    workUnder: 'Και κάποιες φορές συμβαίνουν και τα δύο μαζί. Εκεί συνήθως είναι που μπλέκει το πράγμα.',
    lookLabel: 'Πώς είναι στην πράξη;',
    lookLead: 'Φέρνεις αυτό που σε απασχολεί τώρα.',
    lookMaybes: [
      'Μπορεί να μην ξέρεις πώς θα βρεις τους επόμενους δέκα πελάτες.',
      'Μπορεί να ξέρεις ακριβώς ποια συζήτηση πρέπει να κάνεις και να την αποφεύγεις εδώ και τρεις μήνες.',
      'Μπορεί το business να μεγαλώνει αλλά όλα να πρέπει ακόμα να περνούν από εσένα.',
      'Μπορεί κάτι που κάποτε ήθελες πάρα πολύ να μη σε γεμίζει πια και να μην ξέρεις τι σημαίνει αυτό για όσα έχεις χτίσει.',
      'Ή μπορεί να έχεις αναλύσει το πρόβλημα τόσο πολύ, που η ίδια η ανάλυση έχει γίνει μέρος του προβλήματος.',
    ],
    lookMid: 'Δουλεύουμε αυτό που υπάρχει πραγματικά μπροστά μας.',
    lookClose: [
      'Μπορεί να αμφισβητήσω μια απόφαση που έχεις πάρει για το business. Μπορεί να αμφισβητήσω τον τρόπο που την έχεις εξηγήσει στον εαυτό σου.',
      'Κάποιες φορές θα δουλέψουμε πάνω σε ένα πλάνο. Άλλες θα χρειαστεί να μείνουμε λίγο περισσότερο σε κάτι άβολο, μέχρι να καταλάβουμε γιατί συνεχίζεις να το αποφεύγεις.',
      'Δεν ψάχνουμε ψυχολογική εξήγηση για τα πάντα. Προσπαθούμε να καταλάβουμε καλύτερα τι πραγματικά συμβαίνει και μετά να εξάγουμε κάτι χρήσιμο με αυτό.',
    ],
    howLabel: 'Πώς ξεκινάμε',
    steps: [
      { n: '1', title: 'Γνωριμία', tag: '~15 λεπτά · δωρεάν', body: 'Μου λες πολύ σύντομα τι χτίζεις και τι συμβαίνει. Βλέπουμε αν ταιριάζουμε και αν μπορώ πραγματικά να βοηθήσω. Είναι γνωριμία, όχι δωρεάν συνεδρία.' },
      { n: '2', title: 'Πρώτη συνεδρία', body: "Εδώ μπαίνουμε κανονικά στο θέμα. Δεν χρειάζεται να έχεις καταλάβει ακριβώς ποιο είναι το πρόβλημα — φέρ' το όπως το βλέπεις τώρα. Μέχρι το τέλος θέλω να έχουμε πιο καθαρή εικόνα για το τι πραγματικά συμβαίνει και ένα συγκεκριμένο επόμενο βήμα. Ακόμα κι αν δεν συνεχίσουμε μαζί, η πρώτη συνεδρία θα σου δώσει τεράστια αξία." },
      { n: '3', title: 'Αν έχει νόημα, συνεχίζουμε', body: 'Ιδιωτικά, 1:1.' },
    ],
    faqLabel: 'Συχνές ερωτήσεις',
    faq: [
      { q: 'Είναι ψυχοθεραπεία;', a: 'Κάποιες φορές η δουλειά μας θα μπει σε θέματα που είναι ξεκάθαρα ψυχοθεραπευτικά. Έχω MSc Integrative Counselling & Psychotherapy και είμαι εγγεγραμμένο μέλος του BACP, οπότε δεν χρειάζεται να σταματήσουμε επειδή το θέμα έγινε προσωπικό. Από την άλλη, εδώ το business δεν είναι απλώς το context. Είναι κι αυτό μέρος της δουλειάς.' },
      { q: 'Είναι business coaching;', a: 'Ναι αλλά όχι αποκλειστικά. Θα έχω άποψη για το business. Μπορούμε να δουλέψουμε κανονικά πάνω σε offer, positioning, τιμές, πελάτες ή μια δύσκολη απόφαση που έχεις μπροστά σου. Δεν έχω μια έτοιμη μέθοδο που εφαρμόζω σε όλους.' },
      { q: 'Κι αν δεν ξέρω αν το πρόβλημα είναι business ή ψυχολογικό;', a: 'Δεν χρειάζεται να ξέρεις. Αρκετές φορές, αυτό είναι το πρώτο πράγμα που πρέπει να ξεκαθαρίσουμε.' },
      { q: 'Πρέπει να έχω ήδη επιχείρηση;', a: 'Όχι. Μπορεί να ξεκινάς τώρα, να χτίζεις κάτι παράλληλα με τη δουλειά σου, να είσαι freelancer ή consultant, ή να τρέχεις ήδη τη δική σου επιχείρηση. Το σημαντικό είναι να προσπαθείς πραγματικά να χτίσεις κάτι δικό σου.' },
    ],
    ctaHeading: 'Φέρε το πρόβλημα όπως το βλέπεις τώρα.',
    ctaSub: 'Θα βρούμε τι χρειάζεται να γίνει.',
  },
};

function OneToOnePage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = ONE[lang] || ONE.en;
  const u = tUI(lang);
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  const headingStyle = { fontFamily: 'var(--font-heading)', fontSynthesis: 'none', fontSize: mob ? '22px' : '28px', fontWeight: 750, letterSpacing: '-.03em', lineHeight: 1.15, color: C.text, margin: '0 0 1.3rem' };
  const gap = React.createElement('div', { style: { marginTop: mob ? '3.25rem' : '5rem' } });
  const primaryBtn = { display: 'inline-block', textAlign: 'center', padding: '.9rem 1.8rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', background: C.accent, border: `1.5px solid ${C.accent}`, color: '#fff', textDecoration: 'none', borderRadius: '2px' };

  const bizYouCard = (label, body, note) => React.createElement('div', { className: 'hv-card', style: { ...cardBase, padding: mob ? '1.3rem' : '1.7rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.85rem' } },
    React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.accent } }, label),
    React.createElement('p', { style: { fontSize: mob ? '15px' : '16px', lineHeight: 1.6, color: C.text, margin: 0 } }, body),
    React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.muted, fontStyle: 'italic', margin: 0 } }, note)
  );

  return React.createElement('main', { style: mobPage },
    // ── Hero (short) ──
    React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.accent, marginBottom: '1rem' } }, u.role),
    React.createElement('h1', { style: { ...h1Style, margin: '0 0 1.1rem' } }, c.h1),
    React.createElement('p', { style: { ...leadStyle, fontSize: mob ? '19px' : '22px', marginBottom: '1.5rem' } }, c.lead),
    c.intro.map((t, i) => React.createElement(P, { key: i, last: i === c.intro.length - 1 }, t)),
    React.createElement('div', { style: { marginTop: '1.6rem' } },
      React.createElement('a', {
        href: pathFor('book', lang), className: 'cta-btn', style: primaryBtn,
        onMouseEnter: e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.borderColor = '#059669'; },
        onMouseLeave: e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.borderColor = C.accent; },
      }, u.book + ' →')
    ),

    gap,
    // ── What can we work on? (Business / You — main visual anchor) ──
    React.createElement('h2', { style: headingStyle }, c.workLabel),
    React.createElement('div', { style: { display: 'flex', flexDirection: mob ? 'column' : 'row', gap: mob ? '1rem' : '1.25rem' } },
      bizYouCard(c.bizLabel, c.bizBody, c.bizNote),
      bizYouCard(c.youLabel, c.youBody, c.youNote)
    ),
    React.createElement('p', { style: { fontSize: mob ? '17px' : '18px', lineHeight: 1.65, color: C.text, margin: '1.6rem 0 0', maxWidth: '62ch' } }, c.workUnder),

    gap,
    // ── What does the work actually look like? (conversational) ──
    React.createElement('h2', { style: headingStyle }, c.lookLabel),
    React.createElement('p', { style: { fontSize: mob ? '18px' : '20px', fontWeight: 600, color: C.text, margin: '0 0 1.4rem', lineHeight: 1.5 } }, c.lookLead),
    React.createElement('div', { style: { borderLeft: `2px solid ${C.accent}`, paddingLeft: mob ? '1.1rem' : '1.5rem', margin: '0 0 1.6rem', display: 'flex', flexDirection: 'column', gap: '.9rem' } },
      c.lookMaybes.map((t, i) => React.createElement('p', { key: i, style: { fontSize: mob ? '16px' : '17px', lineHeight: 1.6, color: C.text, margin: 0 } }, t))
    ),
    React.createElement('p', { style: { fontSize: mob ? '17px' : '18px', fontWeight: 600, color: C.text, margin: '0 0 1.4rem' } }, c.lookMid),
    c.lookClose.map((t, i) => React.createElement('p', { key: i, style: { ...pStyle, fontSize: mob ? '16px' : '17px', marginBottom: '1.2rem' } }, t)),

    gap,
    // ── How it starts (compact numbered cards) ──
    React.createElement('h2', { style: headingStyle }, c.howLabel),
    React.createElement(StepCards, { mob, steps: c.steps }),

    gap,
    // ── Common questions ──
    React.createElement('h2', { style: headingStyle }, c.faqLabel),
    React.createElement('div', { style: { marginTop: '.2rem' } }, React.createElement(FaqAccordion, { items: c.faq, mob })),

    // ── Final CTA ──
    React.createElement(FinalCta, { lang, mob, heading: c.ctaHeading, sub: c.ctaSub }),
    React.createElement(SiteFooter, { mob, lang })
  );
}

// ─── ABOUT PAGE (bilingual) ──────────────────────────────────────────────────
const ABOUT = {
  en: {
    h1: 'About',
    role: 'Business Growth Advisor + Licensed Psychotherapist',
    creds: 'MSc Integrative Counselling & Psychotherapy (University of Derby) · BACP-registered · Based in Ireland, working globally',
    lead: 'Two careers that kept running into the same problem.',
    intro: [
      'I spent 18+ years in tech, mostly in product and growth. I built my own companies, worked inside startups and large organisations, and advised more than 500 businesses.',
      "So if we're talking about your offer, pricing, customer acquisition, a hire, a sale you're avoiding or a business decision you can't settle, you don't need to translate the commercial side for me.",
      'I know that world.',
    ],
    sections: [
      { label: "Then psychology started showing up in places it wasn't invited.", body: [
        "Again and again, I'd see a business problem that was only partly a business problem.",
        'Someone knew they needed to sell but wouldn’t.',
        'Someone kept changing a perfectly reasonable strategy.',
        'Someone had hired good people but struggled to let go of control.',
        'Someone had enough information to make a decision and kept looking for more.',
        "The strategy mattered. But it wasn't the whole story.",
        'So I trained as a psychotherapist: MSc Integrative Counselling & Psychotherapy at the University of Derby, and registration with the BACP.',
      ] },
      { label: 'Then the same thing happened from the other direction.', body: [
        "In psychological work, I'd meet ambitious people dealing with very real business problems.",
        "And sometimes a psychological explanation wasn't what they needed.",
        'Their offer was weak. Their pricing was wrong. They had no reliable way of finding customers. They were making a bad business decision.',
        "Psychotherapy isn't designed to tell you that.",
      ] },
      { label: 'Eventually, the two careers stopped looking random.', body: [
        'Sometimes the problem is clearly business.',
        "Sometimes it's personal.",
        "And quite often they collide so much that you can't tell where one ends and the other begins.",
        "That's the work I find most interesting.",
      ] },
      { label: "I'm not here to tell you to want less.", body: [
        "Ambition isn't a symptom.",
        "I don't want to convince you that wanting a bigger business, more money, more independence or more impact is secretly unhealthy.",
        'I want to help you build what you actually want without automatically assuming that either the business or you must be the problem.',
      ] },
    ],
    ctaHeading: 'Usually, we need to look before we know.',
    ctaLabel: 'See how 1:1 works',
  },
  el: {
    h1: 'Λίγα για μένα',
    role: 'Business Growth Advisor + Ψυχοθεραπευτής',
    creds: 'MSc Integrative Counselling & Psychotherapy (University of Derby) · Εγγεγραμμένος στο BACP · Έδρα στην Ιρλανδία, δουλεύω παγκόσμια',
    lead: 'Δύο καριέρες που όλο κατέληγαν στο ίδιο σημείο.',
    intro: [
      'Πέρασα 18+ χρόνια στην τεχνολογία, κυρίως στο product και το growth. Έχτισα δικές μου εταιρείες, δούλεψα σε startups και μεγάλους οργανισμούς και συμβούλεψα περισσότερες από 500 επιχειρήσεις.',
      'Οπότε αν μιλάμε για offer, pricing, πελάτες, μια πρόσληψη, μια συζήτηση πώλησης που αποφεύγεις ή μια απόφαση που δεν μπορείς να πάρεις, δεν χρειάζεται να μου εξηγήσεις όλο το context.',
      'Αυτόν τον κόσμο τον ξέρω.',
    ],
    sections: [
      { label: 'Κάπου εκεί άρχισε να εμφανίζεται η ψυχολογία χωρίς να την έχει καλέσει κανείς.', body: [
        'Ξανά και ξανά έβλεπα προβλήματα που έμοιαζαν business, αλλά μόνο μέχρι ένα σημείο.',
        'Κάποιος ήξερε ότι έπρεπε να πουλήσει και δεν το έκανε.',
        'Κάποιος άλλαζε συνέχεια στρατηγική, παρότι αυτή που είχε ήταν απολύτως λογική.',
        'Κάποιος είχε προσλάβει καλούς συνεργάτες αλλά δυσκολευόταν να αφήσει τον έλεγχο.',
        'Κάποιος είχε αρκετά δεδομένα για να πάρει μια απόφαση και συνέχιζε να ψάχνει κι άλλα.',
        'Το business είχε σημασία. Απλώς δεν ήταν όλη η ιστορία.',
        'Έτσι εκπαιδεύτηκα στην ψυχοθεραπεία. Έχω MSc Integrative Counselling & Psychotherapy από το University of Derby και είμαι εγγεγραμμένο μέλος του BACP.',
      ] },
      { label: 'Και μετά άρχισα να βλέπω το ίδιο πράγμα από την άλλη πλευρά.', body: [
        'Στην ψυχολογική δουλειά συναντούσα φιλόδοξους ανθρώπους με πραγματικά προβλήματα στο business.',
        'Και μερικές φορές αυτό που χρειάζονταν δεν ήταν μια ψυχολογική εξήγηση.',
        'Το offer ήταν αδύναμο. Οι τιμές λάθος. Δεν υπήρχε σταθερός τρόπος να έρθουν πελάτες. Ή απλώς η απόφαση ήταν κακή.',
        'Η ψυχοθεραπεία δεν είναι φτιαγμένη για να σε βοηθήσει με αυτό.',
      ] },
      { label: 'Κάπως έτσι, οι δύο καριέρες σταμάτησαν να μοιάζουν τόσο random.', body: [
        'Μερικές φορές το πρόβλημα είναι καθαρά business.',
        'Μερικές φορές είναι προσωπικό.',
        'Και αρκετά συχνά μπλέκονται τόσο, που δεν είναι καθόλου ξεκάθαρο πού τελειώνει το ένα και αρχίζει το άλλο.',
        'Αυτό είναι το σημείο που με ενδιαφέρει περισσότερο.',
      ] },
      { label: 'Δεν είμαι εδώ για να σου πω να θέλεις λιγότερα.', body: [
        'Η φιλοδοξία δεν είναι σύμπτωμα.',
        'Δεν θέλω να σε πείσω ότι το να θέλεις μεγαλύτερο business, περισσότερα χρήματα, περισσότερη ανεξαρτησία ή μεγαλύτερο impact είναι κατά βάθος ανθυγιεινό.',
        'Θέλω να σε βοηθήσω να χτίσεις αυτό που πραγματικά θέλεις, χωρίς να υποθέτουμε από πριν ότι το πρόβλημα πρέπει να είναι είτε το business είτε εσύ.',
      ] },
    ],
    ctaHeading: 'Πρώτα κοιτάμε. Μετά αποφασίζουμε.',
    ctaLabel: 'Δες την 1:1 συνεργασία',
  },
};
function AboutPage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = ABOUT[lang] || ABOUT.en;
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  const subhead = { fontSize: mob ? '20px' : '24px', fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1.3, color: C.text, margin: mob ? '2.5rem 0 1rem' : '3.25rem 0 1.1rem' };
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: '1.25rem' } }, c.h1),
    React.createElement('div', { style: { display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '2.25rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${C.border}` } },
      React.createElement('img', { src: 'https://aggelosmouzakitis.com/img/aggelos.webp', alt: 'Aggelos Mouzakitis', width: 64, height: 64, style: { width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block' } }),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', color: C.accent, fontWeight: 700 } }, c.role),
        React.createElement('div', { style: { fontSize: '12px', letterSpacing: '.04em', color: '#767676', marginTop: '5px', lineHeight: 1.5 } }, c.creds)
      )
    ),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '1.5rem' : '1.75rem' } }, c.lead),
    c.intro.map((p, i) => React.createElement(P, { key: i, last: i === c.intro.length - 1 }, p)),
    c.sections.map((s, i) => React.createElement(React.Fragment, { key: i },
      React.createElement('h2', { style: subhead }, s.label),
      s.body.map((p, j) => React.createElement(P, { key: j, last: j === s.body.length - 1 }, p))
    )),
    React.createElement('div', {
      style: { marginTop: mob ? '3rem' : '4rem', padding: mob ? '1.6rem 1.4rem' : '2.4rem 2.6rem', border: `1.5px solid rgba(5,150,105,.4)`, background: 'rgba(5,150,105,.06)', borderRadius: '14px' },
    },
      React.createElement('p', { style: { fontSize: mob ? '19px' : '23px', fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1.5, color: C.text, margin: 0 } }, c.ctaHeading),
      React.createElement('a', {
        href: pathFor('one-to-one', lang), className: 'cta-btn',
        style: { display: 'inline-block', marginTop: '1.4rem', padding: '.9rem 1.8rem', fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', background: C.accent, border: `1.5px solid ${C.accent}`, color: '#fff', textDecoration: 'none', borderRadius: '2px' },
        onMouseEnter: e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.borderColor = '#059669'; },
        onMouseLeave: e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.borderColor = C.accent; },
      }, c.ctaLabel + ' →')
    ),
    React.createElement(SiteFooter, { mob, lang })
  );
}

// ─── REVIEWS (verbatim testimonials — do not rewrite client words) ────────────
// Two sources, one published mix (see REVIEWS_ITEMS below):
//   • REVIEWS_ANON — anonymised reflections; English original + faithful Greek
//     translation with a per-testimonial toggle on the Greek page.
//   • REVIEWS_NAMED — named, consented GrowthMentor reviews (verbatim, English
//     only; shown in English on both languages as no translation was supplied).
const REVIEWS_ANON = [
  { w: 'Anonymous client, Founder', wEl: 'Ανώνυμος πελάτης, Founder',
    q: "I had worked with coaches before, and I had been in therapy before, but this felt different. Aggelos understands the emotional side without losing sight of the actual situation I am dealing with at work. We can talk about pressure, shame or something happening in my body, and five minutes later discuss a decision involving my team or business. I don’t have to translate one world into the other for him.",
    qEl: "Είχα δουλέψει με coaches στο παρελθόν, είχα κάνει και θεραπεία, αλλά αυτό ένιωσα ότι ήταν διαφορετικό. Ο Άγγελος καταλαβαίνει τη συναισθηματική πλευρά χωρίς να χάνει από τα μάτια του την πραγματική κατάσταση που αντιμετωπίζω στη δουλειά. Μπορούμε να μιλήσουμε για πίεση, ντροπή ή για κάτι που συμβαίνει στο σώμα μου, και πέντε λεπτά αργότερα να συζητάμε μια απόφαση που αφορά την ομάδα ή το business μου. Δεν χρειάζεται να του μεταφράζω τον έναν κόσμο στον άλλον." },
  { w: 'Anonymous client, Senior professional', wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας',
    q: "I came in expecting a fairly standard coaching conversation. Within the first session, Aggelos understood both the professional problem and the emotional mechanism underneath it. He was warm, but very straightforward, and gave me a way of looking at the situation that I had not considered before. I left with more than advice. I left with a more accurate problem.",
    qEl: "Ήρθα περιμένοντας μια αρκετά τυπική συζήτηση coaching. Μέσα στην πρώτη κιόλας συνεδρία, ο Άγγελος κατάλαβε και το επαγγελματικό πρόβλημα και τον συναισθηματικό μηχανισμό από κάτω του. Ήταν ζεστός, αλλά πολύ ευθύς, και μου έδωσε έναν τρόπο να δω την κατάσταση που δεν είχα σκεφτεί πριν. Έφυγα με κάτι παραπάνω από συμβουλές. Έφυγα με ένα πιο ακριβές πρόβλημα." },
  { w: 'Anonymous client, Business owner', wEl: 'Ανώνυμος πελάτης, Ιδιοκτήτης επιχείρησης',
    q: "I had been forcing a business situation to continue because stopping it felt like failure. After one of our exercises, I realised I was trying to manufacture reasons to keep going when I already knew the answer. I had the difficult conversation shortly afterwards. It was not that Aggelos gave me the decision. He helped me stop fighting what I already knew.",
    qEl: "Πίεζα μια επιχειρηματική κατάσταση να συνεχιστεί, επειδή το να τη σταματήσω έμοιαζε με αποτυχία. Μετά από μία από τις ασκήσεις μας, συνειδητοποίησα ότι προσπαθούσα να κατασκευάσω λόγους για να συνεχίσω, ενώ ήδη ήξερα την απάντηση. Έκανα τη δύσκολη συζήτηση λίγο αργότερα. Δεν ήταν ότι ο Άγγελος μου έδωσε την απόφαση. Με βοήθησε να σταματήσω να παλεύω με αυτό που ήδη ήξερα." },
  { w: 'Anonymous client, Founder', wEl: 'Ανώνυμος πελάτης, Founder',
    q: "There are no motivational speeches or generic frameworks pasted onto every situation. Aggelos pays attention to how I specifically operate. He remembers the contradictions, notices when I change the story and asks the question I was hoping we could avoid. Annoying at times, but usually accurate.",
    qEl: "Δεν υπάρχουν εμψυχωτικοί λόγοι ή γενικά frameworks κολλημένα πάνω σε κάθε κατάσταση. Ο Άγγελος προσέχει πώς λειτουργώ συγκεκριμένα εγώ. Θυμάται τις αντιφάσεις, αντιλαμβάνεται πότε αλλάζω την ιστορία και κάνει την ερώτηση που έλπιζα ότι θα μπορούσαμε να αποφύγουμε. Ενοχλητικό κάποιες φορές, αλλά συνήθως εύστοχο." },
  { w: 'Anonymous client, Founder', wEl: 'Ανώνυμος πελάτης, Founder',
    q: "We have been working together for a while now, and the sessions have gradually changed the way I make decisions. Aggelos doesn’t tell me what to do or try to make me dependent on his opinion. He helps me separate the real problem from the fear, ego and old patterns wrapped around it. I usually leave with less noise and a much clearer sense of what is mine to do.",
    qEl: "Δουλεύουμε μαζί εδώ και αρκετό καιρό, και οι συνεδρίες έχουν αλλάξει σταδιακά τον τρόπο που παίρνω αποφάσεις. Ο Άγγελος δεν μου λέει τι να κάνω ούτε προσπαθεί να με κάνει να εξαρτώμαι από τη γνώμη του. Με βοηθά να ξεχωρίσω το πραγματικό πρόβλημα από τον φόβο, το ego και τα παλιά μοτίβα που είναι τυλιγμένα γύρω του. Συνήθως φεύγω με λιγότερο θόρυβο και πολύ πιο καθαρή αίσθηση του τι είναι δικό μου να κάνω." },
  { w: 'Anonymous client, Senior tech professional', wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας τεχνολογίας',
    q: "The conversations go deeper than ordinary coaching, but I still leave with something usable. Sometimes that is a decision, sometimes a difficult conversation I need to have, and sometimes it is simply noticing the moment my body moves into threat before my mind creates a story around it. It is a rare combination of depth and practicality.",
    qEl: "Οι συζητήσεις πάνε πιο βαθιά από το συνηθισμένο coaching, αλλά και πάλι φεύγω με κάτι αξιοποιήσιμο. Κάποιες φορές είναι μια απόφαση, κάποιες μια δύσκολη συζήτηση που πρέπει να κάνω, και κάποιες φορές είναι απλώς το να παρατηρήσω τη στιγμή που το σώμα μου μπαίνει σε κατάσταση απειλής, πριν το μυαλό μου φτιάξει μια ιστορία γύρω από αυτό. Είναι ένας σπάνιος συνδυασμός βάθους και πρακτικότητας." },
  { w: 'Anonymous client, Senior tech professional', wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας τεχνολογίας',
    q: "Aggelos is direct. He will tell me when I am avoiding something or constructing a very intelligent explanation for why I cannot act. But I have never experienced his directness as judgement. There is enough trust between us that he can challenge me properly, which is exactly what I needed.",
    qEl: "Ο Άγγελος είναι ευθύς. Θα μου πει όταν αποφεύγω κάτι ή όταν κατασκευάζω μια πολύ έξυπνη εξήγηση για το γιατί δεν μπορώ να δράσω. Όμως ποτέ δεν βίωσα την ευθύτητά του ως κριτική. Υπάρχει αρκετή εμπιστοσύνη μεταξύ μας ώστε να μπορεί να με προκαλέσει σωστά, που είναι ακριβώς αυτό που χρειαζόμουν." },
  { w: 'Anonymous client, Founder and executive', wEl: 'Ανώνυμος πελάτης, Founder και στέλεχος',
    q: "I did not want somebody to tell me to work less, lower my standards or become less ambitious. Aggelos understood that immediately. Our work has been about keeping the part of me that wants to build and achieve, while becoming less dependent on winning, comparison and external approval to feel okay. That distinction has been very important to me.",
    qEl: "Δεν ήθελα κάποιον να μου πει να δουλεύω λιγότερο, να χαμηλώσω τον πήχη ή να γίνω λιγότερο φιλόδοξος. Ο Άγγελος το κατάλαβε αμέσως. Η δουλειά μας ήταν να κρατήσουμε το κομμάτι μου που θέλει να χτίζει και να πετυχαίνει, ενώ ταυτόχρονα γίνομαι λιγότερο εξαρτημένος από το να νικάω, τη σύγκριση και την εξωτερική επιβεβαίωση για να νιώθω καλά. Αυτή η διάκριση ήταν πολύ σημαντική για μένα." },
  { w: 'Anonymous client, Consultant and business owner', wEl: 'Ανώνυμος πελάτης, Σύμβουλος και ιδιοκτήτης επιχείρησης',
    q: "Before working together, a difficult email or a problem with a client could affect my entire day. I would immediately feel responsible for everything and start trying to control how I was perceived. We traced that response much further back than the immediate work situation. I still feel pressure, but I can recognise it earlier and I no longer believe every conclusion my nervous system produces.",
    qEl: "Πριν αρχίσουμε να δουλεύουμε μαζί, ένα δύσκολο email ή ένα πρόβλημα με έναν πελάτη μπορούσε να επηρεάσει ολόκληρη τη μέρα μου. Ένιωθα αμέσως υπεύθυνος για τα πάντα και άρχιζα να προσπαθώ να ελέγξω το πώς με έβλεπαν. Ανιχνεύσαμε αυτή την αντίδραση πολύ πιο πίσω από την άμεση κατάσταση στη δουλειά. Ακόμα νιώθω πίεση, αλλά μπορώ να την αναγνωρίσω νωρίτερα και δεν πιστεύω πια κάθε συμπέρασμα που παράγει το νευρικό μου σύστημα." },
  { w: 'Anonymous client, Technology leader', wEl: 'Ανώνυμος πελάτης, Ηγέτης στην τεχνολογία',
    q: "I already understood many of my patterns intellectually. That was partly the problem. I could explain myself very well and still repeat the same behaviour. Working with Aggelos helped me recognise what was happening physically, not just analyse it afterwards. That has made the work much more real and, slowly, changed how I respond under pressure.",
    qEl: "Καταλάβαινα ήδη πολλά από τα μοτίβα μου σε διανοητικό επίπεδο. Αυτό ήταν εν μέρει το πρόβλημα. Μπορούσα να εξηγήσω τον εαυτό μου πολύ καλά και παρ’ όλα αυτά να επαναλαμβάνω την ίδια συμπεριφορά. Η δουλειά με τον Άγγελο με βοήθησε να αναγνωρίζω τι συμβαίνει σε σωματικό επίπεδο, όχι απλώς να το αναλύω εκ των υστέρων. Αυτό έκανε τη δουλειά πολύ πιο πραγματική και, σιγά σιγά, άλλαξε τον τρόπο που αντιδρώ κάτω από πίεση." },
  { w: 'Anonymous client, Senior operator', wEl: 'Ανώνυμος πελάτης, Έμπειρο στέλεχος',
    q: "One of the most useful things is that Aggelos actually understands the environment I work in. I don’t need to explain corporate politics, startup pressure, targets, investors or why a career decision can feel more complicated than “follow your values.” He understands the game, but he also notices what the game is doing to me.",
    qEl: "Ένα από τα πιο χρήσιμα πράγματα είναι ότι ο Άγγελος πραγματικά καταλαβαίνει το περιβάλλον στο οποίο δουλεύω. Δεν χρειάζεται να του εξηγήσω τα εταιρικά παιχνίδια, την πίεση ενός startup, τα targets, τους επενδυτές ή γιατί μια απόφαση καριέρας μπορεί να είναι πιο περίπλοκη από το «ακολούθησε τις αξίες σου». Καταλαβαίνει το παιχνίδι, αλλά προσέχει και το τι μου κάνει αυτό το παιχνίδι." },
  { w: 'Anonymous client', wEl: 'Ανώνυμος πελάτης',
    q: "I was initially sceptical about somatic and trauma-informed work because I assumed it would be vague or a bit spiritual. It wasn’t. Aggelos explained what we were doing, paid attention to my limits and connected the experience back to patterns I could recognise in my work and relationships. It felt grounded, careful and surprisingly practical.",
    qEl: "Στην αρχή ήμουν επιφυλακτικός με τη σωματική και trauma-informed δουλειά, γιατί υπέθετα ότι θα ήταν ασαφής ή λίγο «πνευματική». Δεν ήταν. Ο Άγγελος εξήγησε τι κάναμε, έδωσε προσοχή στα όριά μου και σύνδεσε την εμπειρία με μοτίβα που μπορούσα να αναγνωρίσω στη δουλειά και στις σχέσεις μου. Ένιωσα ότι ήταν γειωμένο, προσεκτικό και απροσδόκητα πρακτικό." },
  { w: 'Anonymous client, Product leader', wEl: 'Ανώνυμος πελάτης, Product leader',
    q: "I trust Aggelos because he is not constantly trying to reassure me. He listens carefully, but he does not automatically agree with the version of events I bring into the session. Sometimes he points out something I would rather not see. Somehow that honesty has made the work feel safer, not less safe.",
    qEl: "Εμπιστεύομαι τον Άγγελο γιατί δεν προσπαθεί συνέχεια να με καθησυχάσει. Ακούει προσεκτικά, αλλά δεν συμφωνεί αυτόματα με την εκδοχή των γεγονότων που φέρνω στη συνεδρία. Κάποιες φορές επισημαίνει κάτι που θα προτιμούσα να μην δω. Κατά κάποιον τρόπο, αυτή η ειλικρίνεια έκανε τη δουλειά να μοιάζει πιο ασφαλής, όχι λιγότερο." },
  { w: 'Anonymous client, Technology executive', wEl: 'Ανώνυμος πελάτης, Στέλεχος τεχνολογίας',
    q: "I started working with Aggelos during a confusing period in my career. On paper, things were going well, but internally I was questioning almost everything. Over several sessions, he helped me understand which concerns were legitimate and which were being amplified by old fears around performance, failure and how other people saw me. I feel more grounded now, even though not everything has been resolved.",
    qEl: "Άρχισα να δουλεύω με τον Άγγελο σε μια μπερδεμένη περίοδο της καριέρας μου. Στα χαρτιά, τα πράγματα πήγαιναν καλά, αλλά μέσα μου αμφισβητούσα σχεδόν τα πάντα. Μέσα σε αρκετές συνεδρίες, με βοήθησε να καταλάβω ποιες ανησυχίες ήταν βάσιμες και ποιες μεγεθύνονταν από παλιούς φόβους γύρω από την απόδοση, την αποτυχία και το πώς με έβλεπαν οι άλλοι. Νιώθω πιο γειωμένος τώρα, παρότι δεν έχουν λυθεί όλα." },
  { w: 'Anonymous client, Tech executive', wEl: 'Ανώνυμος πελάτης, Στέλεχος τεχνολογίας',
    q: "From the outside, I was still functioning and performing at a high level, so it was difficult to explain why something felt wrong. Aggelos understood that the problem was not simply workload. We have worked on the way I connect achievement with safety, worth and relief. I am still ambitious, but success is beginning to feel less like narrowly escaping failure.",
    qEl: "Απ’ έξω, εξακολουθούσα να λειτουργώ και να αποδίδω σε υψηλό επίπεδο, οπότε ήταν δύσκολο να εξηγήσω γιατί κάτι ένιωθα ότι δεν πήγαινε καλά. Ο Άγγελος κατάλαβε ότι το πρόβλημα δεν ήταν απλώς ο φόρτος δουλειάς. Δουλέψαμε πάνω στον τρόπο που συνδέω το επίτευγμα με την ασφάλεια, την αξία και την ανακούφιση. Εξακολουθώ να είμαι φιλόδοξος, αλλά η επιτυχία αρχίζει να μοιάζει λιγότερο με οριακή διαφυγή από την αποτυχία." },
];
// Named, consented client reviews — verbatim from the approved GrowthMentor export.
// Photos are self-hosted by scripts/fetch-review-photos.js into /img/reviews/;
// until a photo exists the card shows a restrained initials avatar (never a fake face).
const REVIEWS_NAMED = [
  { name: "Greg Weinstein", w: "Greg Weinstein", wEl: "Greg Weinstein", photo: "/img/reviews/greg-weinstein.jpg", q: "My session with Aggelos was thoughtful and uniquely well rounded. He brought more than just strategic perspective. His background as a psychotherapist really stood out... in the way he listened, the questions he asked, and how he went deeper than the surface details. I'd strongly recommend a session with him for anyone looking for practical and perceptive insights.", qEl: "My session with Aggelos was thoughtful and uniquely well rounded. He brought more than just strategic perspective. His background as a psychotherapist really stood out... in the way he listened, the questions he asked, and how he went deeper than the surface details. I'd strongly recommend a session with him for anyone looking for practical and perceptive insights." },
  { name: "Marianna Tzaerli", w: "Marianna Tzaerli", wEl: "Marianna Tzaerli", photo: "/img/reviews/marianna-tzaerli.jpg", q: "Aggelos was the best person to have as a sounding board while I navigate a challenging time in my career. He listened, was empathetic and provided me with some actionable ideas to get myself \"unstuck\". Highly recommend!", qEl: "Aggelos was the best person to have as a sounding board while I navigate a challenging time in my career. He listened, was empathetic and provided me with some actionable ideas to get myself \"unstuck\". Highly recommend!" },
  { name: "Thomas Parkinson", w: "Thomas Parkinson", wEl: "Thomas Parkinson", photo: "/img/reviews/thomas-parkinson.jpg", q: "Just got off a call with Aggelos, and it was really good and insightful. He asked me lots of questions before the call and did his research about me, which I appreciated. At the start of the call, he gave a quick summary of what he learned about me, and I updated him with new info. We discussed product positioning, packaging, market fit, and pricing. I left with a clear four-step action plan to help me develop the right pricing model for my customers, and he told me exactly how to find the needed info. If you're thinking about getting advice, I highly recommend Aggelos", qEl: "Just got off a call with Aggelos, and it was really good and insightful. He asked me lots of questions before the call and did his research about me, which I appreciated. At the start of the call, he gave a quick summary of what he learned about me, and I updated him with new info. We discussed product positioning, packaging, market fit, and pricing. I left with a clear four-step action plan to help me develop the right pricing model for my customers, and he told me exactly how to find the needed info. If you're thinking about getting advice, I highly recommend Aggelos" },
  { name: "Amritha Mani", w: "Amritha Mani", wEl: "Amritha Mani", photo: "/img/reviews/amritha-mani.jpg", q: "Aggelos is an incredible mentor to connect with. I had been feeling stuck for a few weeks now, but his combination of direct, honest and compassionate feedback helped me to see my own blindspots. Aggelos will challenge you to think beyond where you are now and break through. Looking forward to another session - thank you Aggelos!", qEl: "Aggelos is an incredible mentor to connect with. I had been feeling stuck for a few weeks now, but his combination of direct, honest and compassionate feedback helped me to see my own blindspots. Aggelos will challenge you to think beyond where you are now and break through. Looking forward to another session - thank you Aggelos!" },
  { name: "Micah McGuire", w: "Micah McGuire", wEl: "Micah McGuire", photo: "/img/reviews/micah-mcguire.jpg", q: "Mind-blowing session. I went from \"I'm unsure of what we should test next with GTM\" to: \"I've got 5 different possible experiments and all I need to do is flesh them out and prioritize.\" Plus, got some GREAT insights on content ideas as a completely unexpected bonus. Highly recommend Aggelos if you need to get clarity on GTM!", qEl: "Mind-blowing session. I went from \"I'm unsure of what we should test next with GTM\" to: \"I've got 5 different possible experiments and all I need to do is flesh them out and prioritize.\" Plus, got some GREAT insights on content ideas as a completely unexpected bonus. Highly recommend Aggelos if you need to get clarity on GTM!" },
  { name: "Agnieszka Wojtkun", w: "Agnieszka Wojtkun", wEl: "Agnieszka Wojtkun", photo: "/img/reviews/agnieszka-wojtkun.jpg", q: "If you're REALLY looking for insightful feedback on your brand positioning and not just for compliments about your work that will lead you nowhere, Aggelos is the person for you. I came to him with a question about how as a newbie in consulting world should I sell my services and I got exactly what I needed - pointed out weaknesses followed up with clear directions and a structured approach on how to define my target clients and to create offers that would suit them. Phew, much work ahead of me but hey, that's what I wanted to hear and I know where to start now :) Thanks again, Aggelos! Next time we'll turn the roasting table. Be prepared! ;)", qEl: "If you're REALLY looking for insightful feedback on your brand positioning and not just for compliments about your work that will lead you nowhere, Aggelos is the person for you. I came to him with a question about how as a newbie in consulting world should I sell my services and I got exactly what I needed - pointed out weaknesses followed up with clear directions and a structured approach on how to define my target clients and to create offers that would suit them. Phew, much work ahead of me but hey, that's what I wanted to hear and I know where to start now :) Thanks again, Aggelos! Next time we'll turn the roasting table. Be prepared! ;)" },
  { name: "Tanuj", w: "Tanuj", wEl: "Tanuj", photo: "/img/reviews/tanuj.jpg", q: "It was a wonderful session and helped me to figure out why I do I have certain behaviour and how do I make it better. He also helped me with understanding myself better and the reason the why I follow those pattern's. Wonderful session and would recommend anyone who are working on improving themselves to be better", qEl: "It was a wonderful session and helped me to figure out why I do I have certain behaviour and how do I make it better. He also helped me with understanding myself better and the reason the why I follow those pattern's. Wonderful session and would recommend anyone who are working on improving themselves to be better" },
  { name: "Indie Ludbrook", w: "Indie Ludbrook", wEl: "Indie Ludbrook", photo: "/img/reviews/indie-ludbrook.jpg", q: "Where do I start?! I was given a strong recommendation to book a call with Aggelos, and it's safe to say, I wish I had met him sooner. Within moments of our call, his expertise shone through, delivering exceptional value and insights that would have taken significantly longer to figure out on our own. He came prepared and quickly pinpointed critical areas in our research strategy that needed addressing, proving fantastic resources and actionable advice on the best next steps. Arguably one of the best mentors I have come across. If you are looking for someone with serious customer research chops, I cannot recommend Aggelos enough. :-)", qEl: "Where do I start?! I was given a strong recommendation to book a call with Aggelos, and it's safe to say, I wish I had met him sooner. Within moments of our call, his expertise shone through, delivering exceptional value and insights that would have taken significantly longer to figure out on our own. He came prepared and quickly pinpointed critical areas in our research strategy that needed addressing, proving fantastic resources and actionable advice on the best next steps. Arguably one of the best mentors I have come across. If you are looking for someone with serious customer research chops, I cannot recommend Aggelos enough. :-)" },
  { name: "Spyros Tsoukalas", w: "Spyros Tsoukalas", wEl: "Spyros Tsoukalas", photo: "/img/reviews/spyros-tsoukalas.jpg", q: "Aggelos is amazing with pricing. In 30 minutes, he managed to save me a lot of time and money from my next steps, offering guidance for my company's pricing and positioning efforts. Highly recommended! Thanks you Aggelos!", qEl: "Aggelos is amazing with pricing. In 30 minutes, he managed to save me a lot of time and money from my next steps, offering guidance for my company's pricing and positioning efforts. Highly recommended! Thanks you Aggelos!" },
  { name: "Pierrick L'Ebraly", w: "Pierrick L'Ebraly", wEl: "Pierrick L'Ebraly", photo: "/img/reviews/pierrick-lebraly.jpg", q: "Aggelos is super cash and to the point, but very considerate about long term impact of his recommendations - definitely the man you need if in front of tricky choices!", qEl: "Aggelos is super cash and to the point, but very considerate about long term impact of his recommendations - definitely the man you need if in front of tricky choices!" },
];
// Published mix — strongest, most on-positioning reviews first; named and anonymous
// interleaved (never grouped). item[0] is the lead; the rest form the two-column grid.
// First six ≈ four named + two anonymous (psychological depth / the combined offer).
const REVIEWS_ITEMS = [
  REVIEWS_NAMED[0],   // Greg Weinstein — strategy + psychotherapist depth (lead)
  REVIEWS_ANON[0],    // combined offer: no need to translate one world into the other
  REVIEWS_NAMED[1],   // Marianna Tzaerli — career, unstuck, empathetic + actionable
  REVIEWS_NAMED[2],   // Thomas Parkinson — positioning/pricing, four-step action plan
  REVIEWS_ANON[1],    // professional problem + emotional mechanism → a more accurate problem
  REVIEWS_NAMED[3],   // Amritha Mani — blindspots, direct + compassionate challenge
  REVIEWS_NAMED[4],   // Micah McGuire — GTM clarity, tangible outcome
  REVIEWS_ANON[10],   // understands the game and what it does to me
  REVIEWS_NAMED[5],   // Agnieszka Wojtkun — no fluff, weaknesses, structure, offers
  REVIEWS_ANON[7],    // keep the ambition, less dependent on winning and approval
  REVIEWS_NAMED[6],   // Tanuj — patterns/behaviour, understanding myself better
  REVIEWS_ANON[2],    // stopped fighting what I already knew — a real decision
  REVIEWS_NAMED[7],   // Indie Ludbrook — expertise, rapid diagnosis, research strategy
  REVIEWS_ANON[14],   // achievement fused to safety and worth
  REVIEWS_NAMED[8],   // Spyros Tsoukalas — pricing + positioning, tangible
  REVIEWS_ANON[5],    // depth + practicality; noticing the body before the story
  REVIEWS_NAMED[9],   // Pierrick L'Ebraly — direct, considered, tricky choices
  REVIEWS_ANON[13],   // confusing career period: legitimate vs amplified fears
];
const REVIEWS = {
  en: {
    h1: 'What people say',
    lead: 'A few things people have said after working with me.',
    sub: 'Feedback from people I’ve worked with. Some chose to remain anonymous.',
    toggle: null,
    ctaHeading: 'It starts with a short, free fit call.',
  },
  el: {
    h1: 'Τι λένε άνθρωποι που έχουν δουλέψει μαζί μου',
    lead: 'Μερικά πράγματα που μου έχουν πει άνθρωποι αφού δουλέψαμε μαζί.',
    sub: 'Σχόλια από ανθρώπους με τους οποίους έχω δουλέψει. Κάποιοι επέλεξαν να παραμείνουν ανώνυμοι.',
    toggle: 'Αρχικό κείμενο στα αγγλικά',
    ctaHeading: 'Ξεκινά με μια σύντομη, δωρεάν γνωριμία.',
  },
};
function ReviewCard({ t, lang, toggleLabel }) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  const quote = el ? t.qEl : t.q;
  const who = el ? t.wEl : t.w;
  return React.createElement('blockquote', { style: { breakInside: 'avoid', margin: '0 0 1.9rem', padding: '0 0 0 1rem', borderLeft: '2px solid rgba(5,150,105,0.35)' } },
    React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.8, color: '#282726', margin: '0 0 .5rem' } }, '“' + quote + '”'),
    React.createElement('div', { style: { fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, who),
    el && React.createElement('button', {
      onClick: () => setOpen(!open),
      'aria-expanded': open ? 'true' : 'false',
      style: { marginTop: '.8rem', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, color: C.accent, letterSpacing: '.02em' },
    }, toggleLabel + ' ' + (open ? '↑' : '↓')),
    el && open && React.createElement('p', { style: { marginTop: '.7rem', paddingTop: '.7rem', borderTop: `1px solid ${C.border}`, fontSize: '14px', lineHeight: 1.75, color: C.muted, fontStyle: 'italic' } }, '“' + t.q + '”')
  );
}
function ReviewsPage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = REVIEWS[lang] || REVIEWS.en;
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: '1rem' } }, c.h1),
    React.createElement('p', { style: { ...leadStyle, marginBottom: '.8rem' } }, c.lead),
    React.createElement('p', { style: { fontSize: '15px', color: C.muted, lineHeight: 1.6, marginBottom: mob ? '2rem' : '2.75rem' } }, c.sub),
    React.createElement('div', { style: { columnGap: mob ? 0 : '2.5rem', columnCount: mob ? 1 : 2 } },
      REVIEWS_ITEMS.map((t, i) => React.createElement(ReviewCard, { key: i, t, lang, toggleLabel: c.toggle }))
    ),
    React.createElement(FinalCta, { lang, mob, heading: c.ctaHeading }),
    React.createElement(SiteFooter, { mob, lang })
  );
}

// ─── SPECIALTY PAGE TEMPLATE ─────────────────────────────────────────────────
function SpecialtyPage({ pageId }) {
  const pages = {
    'therapy-for-executives': ExecTherapyPage,
    'therapy-for-founders': FoundersTherapyPage,
    'imposter-syndrome-therapy': ImposterPage,
    'executive-burnout-therapy': BurnoutPage,
    'career-transition-therapy': CareerTransitionPage,
    'founders': ForFoundersPage,
    'solopreneurs': SolopreneursPage,
    'how-i-work': HowIWorkPage,
    'book': BookPage,
    'greek-therapist-london': LondonPage,
    'greek-therapist-manchester': ManchesterPage,
    'greek-therapist-new-york': NewYorkPage,
    'greek-therapist-dublin': DublinPage,
    'confidentiality': ConfidentialityPage,
  };
  const Component = pages[pageId];
  return Component ? React.createElement(Component) : null;
}

// ─── PERSONA PAGE SHARED BLOCKS (identical across /founders/, /solopreneurs/, ...) ──
function PersonaWorkSection() {
  const mob = useIsMobile();
  return React.createElement(SvcSection, { title: 'So what we actually do' },
    React.createElement(SvcP, null, "We talk it through openly. I usually get what's going on fairly quickly, not because I'm Freud, but because I've sat in your seat more than once and I know the terrain."),
    React.createElement(SvcP, null, "The work runs on two tracks at once:"),
    React.createElement('div', { className: 'svc-cards', style: { margin: '4px 0 20px' } },
      React.createElement(TrackCards, { mob, tracks: [
        { title: 'The inner track', body: "See the pattern, find where it comes from, then rewire it. Awareness is the start, not the finish, because you don't talk yourself out of something your history spent years building. Sometimes that's deeper trauma work, sometimes behavioural exercises that get you doing the thing you avoid." },
        { title: 'The business track', body: "The decision in front of you, the move you need to make, the plan for where you're going. Real, practical, strategic." },
      ] })
    ),
    React.createElement(SvcP, null, "One track without the other doesn't hold. Fixing the inside while the company drifts is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it.")
  );
}
function PersonaTherapyOrCoachingSection() {
  return React.createElement(SvcSection, { title: 'Is this therapy or coaching?' },
    React.createElement(SvcP, null, "Neither, cleanly. By the book it isn't therapy: I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is meant to keep. It stays therapy-informed, though. I'm a licensed psychotherapist, and that training is why I can see what's underneath."),
    React.createElement(SvcP, null, "It isn't coaching either. There's no framework I'll hand you, though we borrow coaching tools when we work on decisions."),
    React.createElement(SvcP, null, "The honest description is a trusted advisor who's sat in your seat and can help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. For a lot of founders it's the one place they can be themselves, not the version they perform for the team, the investors, the cofounder or the partner.")
  );
}
function PersonaHowWeStartSection() {
  const mob = useIsMobile();
  return React.createElement(SvcSection, { title: 'How we start' },
    React.createElement('div', { className: 'svc-cards' },
      React.createElement(StepCards, { mob, steps: [
        { n: '1', title: 'Fit call', tag: '~15 min · free', body: "Not a session. We see whether we click, or whether you can't stand me. Both fine." },
        { n: '2', title: 'Paid session', tag: 'one session', body: "You bring the problem as you see it. We find the one underneath. You leave with a clear read and one real move, worth it even if we stop there." },
        { n: '3', title: 'Ongoing', tag: "if it's worth it", body: "Private, one to one, for as long as it's genuinely useful. Not a session longer." },
      ] })
    ),
    React.createElement('div', { className: 'svc-ctarow' },
      React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
    ),
    React.createElement(SvcNote, null, "It's the same ongoing 1:1 work. ", React.createElement(IA, { href: '/1-to-1/' }, 'See how 1:1 works'), '.')
  );
}
function PatternList({ items }) {
  const mob = useIsMobile();
  return React.createElement('div', { style: { ...cardBase, overflow: 'hidden', margin: '.4rem 0 1.4rem' } },
    items.map(function (it, i) {
      if (mob) {
        return React.createElement('div', {
          key: i, className: 'hv-row',
          style: { padding: '.8rem 1rem', borderTop: i ? `1px solid ${C.border}` : 'none', fontSize: '15px', lineHeight: 1.55 }
        },
          React.createElement('div', { style: { fontWeight: 700, color: C.text, marginBottom: '.15rem' } }, it.cause),
          React.createElement('div', { style: { color: C.text } },
            React.createElement('span', { style: { color: C.accent, fontWeight: 700, marginRight: '.4rem' } }, '→'), it.effect
          )
        );
      }
      return React.createElement('div', {
        key: i, className: 'hv-row',
        style: { display: 'grid', gridTemplateColumns: '246px 26px 1fr', alignItems: 'baseline', padding: '.95rem 1.3rem', borderTop: i ? `1px solid ${C.border}` : 'none', fontSize: '15px', lineHeight: 1.55 }
      },
        React.createElement('span', { style: { fontWeight: 700, color: C.text } }, it.cause),
        React.createElement('span', { style: { color: C.accent, fontWeight: 700, textAlign: 'center' } }, '→'),
        React.createElement('span', { style: { color: C.text } }, it.effect)
      );
    })
  );
}

// ─── FOR FOUNDERS ────────────────────────────────────────────────────────────
function ForFoundersPage() {
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Founder advisory for business problems that trace back to you'),
    React.createElement(SvcLead, null, "For tech founders whose stress, self-criticism or stalled goals trace back to a pattern in them, not a strategy problem. An advisor who's sat in your seat."),

    React.createElement(SvcSection, { title: 'What you came here for' },
      React.createElement(SvcP, null, "You came here about something in the business that gives you stress, feeds the self-criticism, or keeps a goal out of reach."),
      React.createElement(SvcP, null, "If you're reading this instead of booking another consultant, part of you already suspects it isn't only a strategy problem. You'd give someone else in your position the right advice without blinking, and still not take it yourself. That gap is the tell, and there's usually a reason you're ready to ask for help this month and not before.")
    ),

    React.createElement(SvcSection, { title: 'What it usually turns out to be' },
      React.createElement(SvcP, null, "Most of the time it traces back to a pattern in you, and usually not the one you assume or the one ChatGPT suggested."),
      React.createElement(SvcP, null,
        "Some founders name the wrong cause, calling the procrastination laziness or the burnout overwork. Others read it accurately and still can't shift it, because knowing the pattern and being free of it are different jobs. ",
        React.createElement(A, { href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/' }, "The same brain that built it can't reason its way out"),
        ", however smart you are."
      ),
      React.createElement(SvcP, null, "It doesn't stay with you, either. One way or another it spills into the business:"),
      React.createElement('div', { className: 'svc-cards' },
        React.createElement(PatternList, { items: [
          { cause: 'You avoid discomfort', effect: 'sales, hiring, firing, pricing and fundraising all keep sliding' },
          { cause: 'You need control', effect: 'nothing scales past you' },
          { cause: 'You need to be liked', effect: 'the team stays pleasant and a little weak' },
          { cause: "You can't sit with uncertainty", effect: 'strategy turns slow, reactive, over-validated' },
          { cause: 'Your worth is fused to output', effect: "burnout becomes the company's normal speed" },
          { cause: "You're scared of being exposed", effect: 'metrics, feedback and bad news start to feel like threats' },
          { cause: 'You feel alone at the top', effect: React.createElement(A, { href: '/blog/the-loneliness-and-emotional-pressure-that-founders-experience/' }, "you lose your read on what's real") },
        ] })
      ),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(PersonaWorkSection),
    React.createElement(PersonaTherapyOrCoachingSection),

    React.createElement(SvcSection, { title: 'A real example' },
      React.createElement(SvcP, null, "A founder came to me having lost his motivation. He'd built the company, stopped caring about it, and wanted the drive back. He felt like a failure, was quietly planning his escape, and his marriage was strained because the hours and the obsessiveness had bled into home."),
      React.createElement(SvcP, null,
        "We didn't chase the motivation. We worked through the low period so he could think again, then got underneath it, to where the failure feeling came from and why the drive had drained out. After that the business decisions stopped feeling impossible. We built a plan for the next chapter, including a clean exit, and he did the work at home too. He needed to understand ",
        React.createElement(A, { href: '/blog/what-lost-purpose-actually-means-for-many-high-performers/' }, 'what had happened to the drive'), ", not manufacture more of it."
      )
    ),

    React.createElement(SvcSection, { title: 'What founders say' },
      React.createElement(SvcQuotes, { more: 'Read more client reflections →', items: [
        { q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my team. I don't have to translate one world into the other.", w: 'Anonymous, founder' },
        { q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.", w: 'Anonymous, founder' },
        { q: "I didn't want someone telling me to work less or be less ambitious. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.", w: 'Anonymous, founder' },
      ] })
    ),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Startup and tech founders, ideally in Europe, the US or Canada, mostly for time zones."),
      React.createElement(SvcP, null, "I work with a few people at a time and care more about fit than volume. I'm not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the company actually needs. It runs both ways, with rights and obligations on each side.")
    ),

    React.createElement(PersonaHowWeStartSection)
  );
}

// ─── FOR SOLOPRENEURS ────────────────────────────────────────────────────────
function SolopreneursPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Solopreneur advisory for business problems that trace back to you'),
    React.createElement(SvcLead, null, "For solopreneurs, consultants and freelancers whose stuck offer, pricing or focus traces back to a pattern in them, not a missing tactic."),

    React.createElement(SvcSection, { title: 'What you came here for' },
      React.createElement(SvcP, null, "You came here about your one-person business. The specifics vary: things you avoid, things you overthink, things that scare you, lack of focus, procrastination. The common thread is they start inside you and end up in the business."),
      React.createElement(SvcP, null,
        "If you're reading this instead of buying another course or joining another community, part of you already suspects you ",
        React.createElement(Strong, null, "might not need tactical advice only"),
        ". You'd tell someone else in your position exactly what to do without blinking, and still not do it yourself. That's the tell, and there's usually a reason it surfaced now, this month, and not before."
      )
    ),

    React.createElement(SvcSection, { title: 'What it usually turns out to be' },
      React.createElement(SvcP, null, "In a lot of cases it traces back to a pattern in you, and usually not the one you assume or the one ChatGPT eloquently describes."),
      React.createElement(SvcP, null,
        "Some people name the wrong cause. Others read it accurately and still can't shift it, because knowing the pattern and being free of it are different jobs. ",
        React.createElement(A, { href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/' }, "The same brain that built it can't reason its way out"),
        ", however smart you are."
      ),
      React.createElement(SvcP, null, "When you work alone, those patterns run straight into the business:"),
      React.createElement('div', { className: 'svc-cards' },
        React.createElement(PatternList, { items: [
          { cause: 'You avoid being seen', effect: 'no content, no outbound, no clear opinion, weak demand' },
          { cause: "You're uncomfortable charging", effect: 'you undercharge, then resent the work' },
          { cause: 'You need to be liked', effect: 'bad clients get in, scope creeps, boundaries go' },
          { cause: "You don't trust your own read", effect: 'you keep switching niche, offer, direction' },
          { cause: "A 'no' feels personal", effect: 'so you keep postponing exposure' },
          { cause: "You're in your own head all day", effect: 'decisions go in circles and the drift builds up quietly' },
          { cause: 'You confuse thinking with doing', effect: React.createElement(A, { href: '/blog/the-high-cost-of-endless-pondering/' }, 'lots of refining, almost no selling') },
        ] })
      ),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'So what we actually do' },
      React.createElement(SvcP, null, "We talk it through openly. I usually get what's going on fairly quickly, not because I'm Carl Jung, but because I've done the job-to-solo-and-back trip myself more than once, including building this practice right now. In 2026 it's brutal, practically and emotionally, and I know the terrain."),
      React.createElement(SvcP, null, "The work runs on two tracks at once:"),
      React.createElement('div', { className: 'svc-cards', style: { margin: '4px 0 20px' } },
        React.createElement(TrackCards, { mob, tracks: [
          { title: 'The inner track', body: "See the pattern, find where it comes from, then rewire it. Awareness is the start, not the finish, because you don't talk yourself out of something your history spent years building. Sometimes that's deeper work, sometimes behavioural exercises that get you doing the thing you avoid, like sending the outreach or holding the price." },
          { title: 'The business track', body: "The offer, the pricing, the decision in front of you, the plan for where you're going. Real, practical, strategic." },
        ] })
      ),
      React.createElement(SvcP, null, "One track without the other doesn't hold. Fixing the inside while the pipeline dries up is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it.")
    ),
    React.createElement(SvcSection, { title: 'Is this therapy or coaching?' },
      React.createElement(SvcP, null, "Neither, cleanly. By the book it isn't therapy: I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is meant to keep. It stays therapy-informed, though. I'm a licensed psychotherapist, and that training is why I can see what's underneath."),
      React.createElement(SvcP, null, "It isn't coaching either. There's no framework I'll hand you, though we borrow coaching tools when we work on decisions, pricing and positioning."),
      React.createElement(SvcP, null, "The honest description is a trusted advisor who's built his own thing and can help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. When you work alone, this is often the one honest mirror you get, and the one place you can be yourself, not the version you perform for clients, your audience or your partner.")
    ),

    React.createElement(SvcSection, { title: 'A real example' },
      React.createElement(SvcP, null, "Someone came to me running his own consultancy. He was doing well, but it didn't feel that way to him. He asked how to grow, and underneath that he was worried he wasn't successful enough, stuck doing all the execution himself, running on fight or flight with clients and taking every bit of criticism badly."),
      React.createElement(SvcP, null,
        "All that stress had piled into one conclusion: that he wasn't cut out to run a business. That was false, but it's a normal place to land after long enough powering through your own resentment. Most of it traced back to ",
        React.createElement(A, { href: '/blog/the-parent-archetypes-creating-high-performers-with-chronic-self-doubt/' }, 'older family patterns still running'),
        ", the same ones showing up in his marriage. The business problems were almost a copy of what he was dealing with in himself."
      ),
      React.createElement(SvcP, null, "Over about six months it turned around. He got his confidence back, took on work he'd written off as not for him, and grew by focusing on the parts he liked and outsourcing the rest. He worked on those patterns everywhere they showed up, not just at work. He didn't need a growth tactic. He needed to stop treating an old story about himself as fact.")
    ),

    React.createElement(SvcSection, { title: 'What clients say' },
      React.createElement(SvcQuotes, { more: 'Read more client reflections →', items: [
        { q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my business. I don't have to translate one world into the other.", w: 'Anonymous, solopreneur' },
        { q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.", w: 'Anonymous, solopreneur' },
        { q: "I didn't want someone telling me to lower my standards or want less. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.", w: 'Anonymous, solopreneur' },
      ] })
    ),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Solopreneurs, independent consultants and freelancers in tech, ideally in Europe, the US or Canada, mostly for time zones."),
      React.createElement(SvcP, null, "I work with a few people at a time and care more about fit than volume. I'm not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the business actually needs. It runs both ways, with rights and obligations on each side.")
    ),

    React.createElement(PersonaHowWeStartSection)
  );
}

// ─── HOW I WORK ──────────────────────────────────────────────────────────────
// ─── SHARED VISUAL BLOCKS (numbered step cards + two-track cards) ─────────────
const cardBase = { border: `1px solid ${C.border}`, borderRadius: '12px', background: '#FFFFFF' };
function Kicker({ children }) {
  return React.createElement('h2', {
    style: { fontSize: '17px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted, margin: '0 0 1.2rem', lineHeight: 1.5, textWrap: 'balance' }
  }, children);
}
function StepCards({ mob, steps }) {
  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: mob ? '.9rem' : '1rem', alignItems: 'stretch' } },
    steps.map(function (s, i) {
      return React.createElement('div', {
        key: i, className: 'hv-card',
        style: { ...cardBase, padding: mob ? '1.15rem 1.15rem 1.25rem' : '1.35rem 1.3rem 1.45rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '.65rem' } },
          React.createElement('span', { style: { width: '30px', height: '30px', flexShrink: 0, borderRadius: '50%', background: C.accent, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, lineHeight: 1 } }, s.n),
          React.createElement('span', { style: { fontSize: '17px', fontWeight: 700, color: C.text } }, s.title)
        ),
        s.tag && React.createElement('span', { style: { alignSelf: 'flex-start', fontSize: '11px', letterSpacing: '.05em', textTransform: 'uppercase', color: C.accent, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: '999px', padding: '.2rem .65rem' } }, s.tag),
        React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.text, margin: 0 } }, s.body)
      );
    })
  );
}
function TrackCards({ mob, tracks }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: mob ? 'column' : 'row', gap: mob ? '.9rem' : '1rem', alignItems: 'stretch' } },
    tracks.map(function (t, i) {
      return React.createElement('div', { key: i, className: 'hv-card', style: { ...cardBase, padding: mob ? '1.15rem' : '1.35rem', flex: 1 } },
        React.createElement('h3', { style: { fontSize: '17px', fontWeight: 700, color: C.text, margin: '0 0 .5rem' } }, t.title),
        React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.text, margin: 0 } }, t.body)
      );
    })
  );
}

function HowIWorkPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle } : widePageStyle;

  const kicker = (txt) => React.createElement(Kicker, null, txt);
  const block = { marginBottom: mob ? '2.75rem' : '3.5rem' };
  const note = (children, last) => React.createElement('p', {
    style: { fontSize: '16px', lineHeight: 1.7, color: C.muted, margin: last ? '1.1rem 0 0' : '1.1rem 0 .3rem' }
  }, children);

  const cadenceRow = (phase, rhythm, desc, first) => React.createElement('tr', { className: 'hv-row' },
    React.createElement('td', { style: { width: mob ? '38%' : '32%', verticalAlign: 'top', padding: mob ? '.85rem .8rem' : '1rem 1.2rem', borderTop: first ? 'none' : `1px solid ${C.border}`, fontSize: '16px', fontWeight: 700, color: C.text } }, phase),
    React.createElement('td', { style: { verticalAlign: 'top', padding: mob ? '.85rem .8rem' : '1rem 1.2rem', borderTop: first ? 'none' : `1px solid ${C.border}`, fontSize: '15px', lineHeight: 1.6, color: C.text } },
      React.createElement('span', { style: { color: C.accent, fontWeight: 700 } }, rhythm + '. '), desc
    )
  );

  const notLine = (txt) => React.createElement('li', { style: { display: 'flex', gap: '.7rem', alignItems: 'baseline', padding: '.55rem 0', fontSize: '16px', lineHeight: 1.55, color: C.text } },
    React.createElement('span', { style: { color: '#c0392b', fontWeight: 700, flexShrink: 0, fontSize: '15px' } }, '✕'),
    React.createElement('span', null, txt)
  );

  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.5rem' } }, 'How I work'),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3.5rem' } }, "It's a private advisory relationship, one to one, and it runs in three steps."),

    React.createElement('section', { style: block },
      kicker('The three steps'),
      React.createElement(StepCards, { mob, steps: [
        { n: '1', title: 'Fit call', tag: '~15 min · free', body: "We see if we click, or if you can't stand me. Not a session. Just so neither of us wastes the other's time." },
        { n: '2', title: 'Paid session', tag: 'one session', body: "You bring the problem the way you see it. We find the one that's actually brewing underneath it. You leave with a clear read and one real move, documented in a handover. Worth it even if we stop here." },
        { n: '3', title: 'Ongoing', tag: "if it's worth it", body: "Private, one to one, for as long as it's genuinely useful. Not a session longer." },
      ] }),
      note("Most people start at the fit call, but if you already know you want to work and just want to get going, you can skip straight to the paid session.", true)
    ),

    React.createElement('section', { style: block },
      kicker('What the ongoing work looks like'),
      React.createElement('p', { style: { fontSize: '16px', lineHeight: 1.7, color: C.text, margin: '0 0 1.1rem' } }, "If we continue, it runs on two tracks at the same time."),
      React.createElement(TrackCards, { mob, tracks: [
        { title: 'The inner track', body: "We find the pattern that's actually driving the problem, then work to rewire it. Awareness first, then the real change, which usually takes more than talking." },
        { title: 'The business track', body: "The decision in front of you, the move you need to make, the plan for where you're going. Practical and strategic." },
      ] }),
      note("In between sessions, I study our calls, we might monitor your biomarkers together, and I set exercises, diagnostics and measurement techniques so we have a benchmark in place."),
      note("One without the other doesn't hold, so we don't split them.", true)
    ),

    React.createElement('section', { style: block },
      kicker('Cadence'),
      React.createElement('div', { style: { ...cardBase, overflow: 'hidden' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          React.createElement('tbody', null,
            cadenceRow('First few months', 'Weekly', 'Builds momentum and trust. The work compounds instead of resetting every session.', true),
            cadenceRow('After that', 'Flexible', "Once the rhythm is there, we can space it out. It stays as long as it's useful to you.")
          )
        )
      ),
      note("Between sessions you can reach me when something real comes up. Not a 24/7 line, but you're not on your own until the next slot either.", true)
    ),

    React.createElement('section', { style: block },
      kicker('What it costs'),
      React.createElement('div', { className: 'hv-card', style: { border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: '10px', background: 'rgba(5,150,105,0.04)', padding: mob ? '1.15rem' : '1.35rem 1.5rem', fontSize: '16px', lineHeight: 1.7, color: C.text } },
        "I keep the number of clients small, so I can go deep with each one. I'll give you the specifics on the fit call. What I'll say here is this is ",
        React.createElement('span', { style: { fontWeight: 700 } }, 'premium, ongoing, and priced as a monthly engagement'),
        ", not by the hour."
      )
    ),

    React.createElement('section', { style: block },
      kicker('What this is not'),
      React.createElement('ul', { style: { listStyle: 'none', margin: '0 0 1.4rem', padding: 0 } },
        notLine("Not therapy by the protocol, though it's therapy-informed."),
        notLine("Not coaching with a framework, though it has coaching in it."),
        notLine("Not a course, not a program, not a plan I hand you and disappear.")
      ),
      React.createElement('div', { className: 'hv-card', style: { border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: '10px', background: 'rgba(5,150,105,0.04)', padding: mob ? '1.15rem' : '1.35rem 1.5rem', fontSize: '16px', lineHeight: 1.7, color: C.text } },
        "It's a trusted advisory relationship with someone who's sat where you're sitting, cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face."
      ),
      React.createElement('div', { style: { marginTop: '1.6rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── BOOK A FIT CALL ─────────────────────────────────────────────────────────
const BOOK = {
  en: {
    h1: 'Book a fit call',
    intro: [
      "15 minutes to tell me what you're building, what's going on and whether it makes sense for us to work together.",
      "You don't need to prepare anything.",
      "This isn't a free session and I'm not going to squeeze a sales pitch into fifteen minutes.",
      "Tell me the real situation. I'll ask a few questions.",
      "If I think I can help, I'll tell you what the next step looks like.",
      "If I don't, I'll tell you that too. Politely. Probably.",
    ],
    bookBelow: 'Book below',
    emailPre: "Can't find a slot, or prefer email? Reach me at ",
    crossLead: 'Not sure whether to book?',
    crossBody: 'Take the Starting Diagnostic first and give me a little more context.',
    crossBtn: 'Take the Starting Diagnostic',
  },
  el: {
    h1: 'Κλείσε μια γνωριμία',
    intro: [
      '15 λεπτά για να μου πεις τι χτίζεις, τι συμβαίνει και αν έχει νόημα να δουλέψουμε μαζί.',
      'Δεν χρειάζεται να προετοιμάσεις τίποτα.',
      'Δεν είναι δωρεάν συνεδρία και δεν πρόκειται να στριμώξω sales pitch σε δεκαπέντε λεπτά.',
      'Πες μου την πραγματική κατάσταση. Θα σου κάνω μερικές ερωτήσεις.',
      'Αν πιστεύω ότι μπορώ να βοηθήσω, θα σου πω ποιο είναι το επόμενο βήμα.',
      'Αν όχι, θα σου το πω κι αυτό. Ευγενικά. Μάλλον.',
    ],
    bookBelow: 'Κλείσε ραντεβού παρακάτω',
    emailPre: 'Δεν βρίσκεις διαθέσιμη ώρα ή προτιμάς email; Βρες με στο ',
    crossLead: 'Δεν είσαι ακόμα σίγουρος αν θέλεις να κλείσεις;',
    crossBody: 'Κάνε πρώτα το Starting Diagnostic και δώσε μου λίγο περισσότερο context.',
    crossBtn: 'Starting Diagnostic',
  },
};
function BookPage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = BOOK[lang] || BOOK.en;
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  React.useEffect(function () {
    if (document.querySelector('script[src*="assets.calendly.com/assets/external/widget.js"]')) {
      if (window.Calendly && window.Calendly.initInlineWidgets) window.Calendly.initInlineWidgets();
      return;
    }
    var sc = document.createElement('script');
    sc.src = 'https://assets.calendly.com/assets/external/widget.js';
    sc.async = true;
    document.body.appendChild(sc);
  }, []);
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.5rem' } }, c.h1),
    c.intro.map((p, i) => React.createElement(P, { key: i, last: i === c.intro.length - 1 }, p)),
    React.createElement('h2', { style: { ...h2Style, color: C.accent, margin: mob ? '2.25rem 0 1.1rem' : '2.75rem 0 1.2rem' } }, c.bookBelow),
    React.createElement('div', {
      className: 'calendly-inline-widget',
      'data-url': 'https://calendly.com/aggelosmouzakitis/one-to-one',
      style: { minWidth: '320px', height: '700px', marginBottom: '1.5rem' }
    }),
    React.createElement(P, { last: true },
      c.emailPre,
      React.createElement(IA, { href: 'mailto:aggelos.mouzakitis@gmail.com' }, 'aggelos.mouzakitis@gmail.com'), "."
    ),
    React.createElement('div', {
      style: { marginTop: mob ? '2.5rem' : '3rem', padding: mob ? '1.5rem 1.4rem' : '1.8rem 2rem', border: `1px solid ${C.border}`, background: '#fff', borderRadius: '14px' },
    },
      React.createElement('p', { style: { fontSize: mob ? '17px' : '18px', fontWeight: 600, color: C.text, margin: '0 0 .5rem' } }, c.crossLead),
      React.createElement('p', { style: { fontSize: '16px', lineHeight: 1.65, color: C.muted, margin: '0 0 1.1rem' } }, c.crossBody),
      React.createElement(IA, { href: pathFor('diagnostic', lang) }, c.crossBtn + ' →')
    ),
    React.createElement(SiteFooter, { mob, lang })
  );
}

// ─── RELATED INTERNAL LINKS (SEO landing pages → 1:1 + siblings) ─────────────
function RelatedLinks({ mob, items, heading }) {
  // Restyled to the shared service-page related-links block. Service pages only.
  return React.createElement(SvcRelated, { items, heading });
}

// ─── THERAPY FOR EXECUTIVES ──────────────────────────────────────────────────
function ExecTherapyPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Therapy for executives who have done everything right and still feel like something is off'),
    React.createElement(SvcLead, null, "You're good at your job, and you know it. Somewhere along the way the cost of doing it well changed, and no amount of delegation, time off or strategy seems to touch it."),

    React.createElement(SvcSection, { title: 'The problem' },
      React.createElement(SvcP, null, "The work still gets done and the results are there, but something underneath has shifted. For some people it's the ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure' }, 'isolation that comes with seniority'), ". For others, an identity that's become inseparable from output, so slowing down feels dangerous. Or the constant sense of being one mistake from losing everything you've built, even though the evidence says otherwise."),
      React.createElement(SvcP, null, "Another offsite or framework won't touch these. They need a different kind of attention.")
    ),

    React.createElement(SvcSection, { title: 'What executive therapy is' },
      React.createElement(SvcP, null, "Psychotherapy for people in senior roles. It isn't coaching with a therapy label or a softer version of clinical work. It takes the professional context seriously instead of treating it as background noise, and goes past performance optimisation into the patterns that actually drive behaviour."),
      React.createElement(SvcP, null, "It looks at ", React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'why identity becomes inseparable from output'), ", why success doesn't settle the question it was supposed to answer, and why certain dynamics at work keep repeating. The difference from a general therapist is mostly context. If your therapist needs half the session to understand your week, that's time spent orienting rather than working.")
    ),

    React.createElement(SvcSection, { title: 'How I work' },
      React.createElement(SvcP, null, "I'm a business growth advisor and licensed psychotherapist with 18+ years in B2B SaaS. I've led growth strategy at startups and inside ", React.createElement(A, { href: 'https://www.ibm.com' }, 'IBM'), "'s enterprise portfolio, and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised 500+ companies'), " on the kind of work my clients carry into sessions. ", React.createElement(Strong, null, "So I already understand the environment you're operating in"), ", and we skip the context-setting."),
      React.createElement(SvcP, null, "The work runs on two tracks. Sometimes the problem is genuinely business, a decision or a team or a strategy call, and we work it as advisory. Sometimes it's the pattern underneath: why identity fused with output, why slowing down feels dangerous. Often it's both, and part of the job is telling which one you're dealing with."),
      React.createElement(SvcP, null, "A lot of it is strategic detachment: playing the professional roles and handling pressure without turning every interaction into a referendum on your worth. You keep the ambition. What changes is that it stops running on the fear of being found out."),
      React.createElement(SvcP, null, "I write about the psychology of ambition and performance at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), " (5,000+ subscribers). The writing explores the patterns; the private work is where we address them.")
    ),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Founders, VPs, directors and senior ICs in tech who are doing well by any external measure and still feel like something isn't working. Some common threads:"),
      React.createElement(SvcP, null, React.createElement(Strong, null, "Chronic self-doubt alongside strong performance."), " ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high' }, 'Achievement patterns tied to early approval-seeking'), " that were never examined. Decision paralysis that isn't really about the decision. Burnout that rest doesn't fix. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Overthinking that has become a default setting'), " rather than a tool."),
      React.createElement(SvcP, null, "If you solve problems through effort and analysis, and this one isn't responding to either, it might be worth a conversation.")
    ),

    React.createElement(SvcSection, { title: 'How it works' },
      React.createElement(SvcP, null, "All sessions are ", React.createElement(Strong, null, "remote, one-on-one and confidential"), ". Most clients are across Europe and the US, weekly or biweekly. It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes, to figure out what's going on and whether working together makes sense. If it doesn't, I'll say so."),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement(SvcFaq, { items: [
        { q: 'What is executive therapy, exactly?', a: "Psychotherapy for people in leadership and senior roles. It goes past performance optimisation into the patterns and internal dynamics that shape how you lead, decide and relate to others. It works best when the therapist understands the professional context, not just the clinical side." },
        { q: 'How is this different from executive coaching?', a: [["Coaching tends to focus on skills and strategy. Therapy works with what's underneath: why you're stuck, why patterns keep repeating, why approaches that used to work have stopped. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets called coaching'), " actually needs therapeutic depth to address properly."]] },
        { q: "I'm not sure if I need therapy or coaching. How do I decide?", a: [["If the challenge is situational and skill-based, coaching is usually enough. If the same patterns keep appearing across roles, relationships and decisions, and ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'you suspect the real obstacle is internal'), ", that's more likely therapy territory. Starting with therapy often makes later coaching more useful."]] },
        { q: 'Can analytical people benefit from therapy?', a: [[React.createElement(A, { href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain' }, 'Self-analysis can become a way to maintain control'), " rather than a path to change. Good therapy works with that pattern rather than being fooled by it."]] },
        { q: 'Is this available remotely?', a: "Yes. All sessions are online, and most clients prefer it for flexibility and privacy." },
      ] })
    ),

    React.createElement(Testimonials, { mob, items: [{q: "One of the most useful things is that Aggelos actually understands the environment I work in. I don’t need to explain corporate politics, startup pressure, targets, investors or why a career decision can feel more complicated than “follow your values.” He understands the game, but he also notices what the game is doing to me.", w: "Anonymous client, Senior operator"}, {q: "Aggelos is direct. He will tell me when I am avoiding something or constructing a very intelligent explanation for why I cannot act. But I have never experienced his directness as judgement. There is enough trust between us that he can challenge me properly, which is exactly what I needed.", w: "Anonymous client, Senior tech professional"}, {q: "I came in expecting a fairly standard coaching conversation. Within the first session, Aggelos understood both the professional problem and the emotional mechanism underneath it. He was warm, but very straightforward, and gave me a way of looking at the situation that I had not considered before. I left with more than advice. I left with a more accurate problem.", w: "Anonymous client, Senior professional"}] }),
    React.createElement(RelatedLinks, { mob, items: [
      { href: '/1-to-1/', label: 'Work with me, 1:1 →' },
      { href: '/executive-burnout-therapy/', label: 'Executive burnout →' },
      { href: '/imposter-syndrome-therapy/', label: 'Imposter syndrome →' },
    ] })
  );
}

// ─── THERAPY FOR FOUNDERS ────────────────────────────────────────────────────
function FoundersTherapyPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Therapy for founders who have no one to be honest with about what this actually costs'),
    React.createElement(SvcLead, null, "A private, confidential therapeutic relationship for founders carrying the weight of the role, from someone who has sat on both sides of the table."),

    React.createElement(SvcSection, { title: 'The founder problem' },
      React.createElement(SvcP, null, "There's a ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure' }, 'particular kind of isolation founders live with'), ", different from ordinary loneliness. You're surrounded by people who depend on you, and ", React.createElement(Strong, null, "precisely because they depend on you, none of them can be the person you're fully honest with"), " about what it costs to hold everything together."),
      React.createElement(SvcP, null, "So you perform. Certainty in board meetings, calm in all-hands, optimism for your co-founder. Over time the gap between what you project and what you feel becomes its own exhaustion, sometimes the biggest one."),
      React.createElement(SvcP, null, "Coaching and mental-fitness apps aren't built for this. It's a structural burden that comes with the role, and it usually needs proper therapeutic work.")
    ),

    React.createElement(SvcSection, { title: 'What I see in founders' },
      React.createElement(SvcP, null, "Having worked with founders as a ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'growth advisor'), " and as a therapist, the patterns are consistent. ", React.createElement(Strong, null, "Identity fuses with the company."), " When it's up you're up; when it's down you disappear into it. There's often no stable sense of self independent of the last metric you checked."),
      React.createElement(SvcP, null, "Decision fatigue turns chronic and stops being about the decisions themselves; it's the weight of being the one who has to make them. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Overthinking becomes a default mode'), " that feels productive but mostly produces exhaustion. Relationships suffer, not because you don't care, but because ", React.createElement(Strong, null, "there's nothing left after the company takes its share"), ".")
    ),

    React.createElement(SvcSection, { title: 'Why I understand this' },
      React.createElement(SvcP, null, "I'm a business growth advisor and licensed psychotherapist with 18+ years in B2B SaaS, including advising 500+ companies on growth. I've been on the other side of the table, setting targets, defending strategy and absorbing pressure from every direction."),
      React.createElement(SvcP, null, "When a client comes in carrying a down round or a co-founder conflict, ", React.createElement(Strong, null, "I don't need them to explain the context"), ". I know what that room feels like, so we skip the background and go straight to the work."),
      React.createElement(SvcP, null, "The work runs on two tracks. Sometimes what you bring is the business itself, a decision or a co-founder conflict or the strategy, and we work it directly. Sometimes it's the weight underneath: the identity fusion, the isolation, the pattern that keeps repeating. Usually it's both, tangled together, and part of the work is telling them apart.")
    ),

    React.createElement(SvcSection, { title: 'How it works' },
      React.createElement(SvcP, null, "Sessions are ", React.createElement(Strong, null, "remote, one-on-one and confidential"), ". Nothing goes to your board, your investors or your team. This is a private therapeutic relationship, not coaching attached to your company. It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes, to figure out what's going on and whether I'm the right person for it."),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Why do founders need a specific kind of therapy?' },
          React.createElement(P, { last: true }, "The psychological environment of founding is specific. The isolation is structural, the identity fusion is usually total, and pressure comes from several directions at once. A therapist who hasn't operated inside that environment tends to treat it as generic stress or miss what's going on underneath the performance.")
        ),
        React.createElement(FaqItem, { q: 'What do founders typically bring to therapy?' },
          React.createElement(P, { last: true }, "Isolation that gets worse as the company grows. Identity indistinguishable from the company's performance. Chronic decision fatigue. Relationship strain. ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, 'Self-defeating patterns'), " that keep producing the outcomes they're trying to avoid. Burnout that rest doesn't fix, because the source is emotional weight rather than hours worked.")
        ),
        React.createElement(FaqItem, { q: 'Can I do this while running a company?' },
          React.createElement(P, { last: true }, "Yes. Most founder clients do weekly or biweekly sessions remotely. The more useful question is whether the cost of not doing it, the reactive decisions and strained relationships and mounting pressure, is something your company can keep absorbing.")
        ),
        React.createElement(FaqItem, { q: 'Is this completely confidential?' },
          React.createElement(P, { last: true }, "Yes. It's a private therapeutic relationship governed by professional ethics. Nothing is shared with anyone.")
        )
      )
    ),

    React.createElement(Testimonials, { mob, items: [{q: "I had worked with coaches before, and I had been in therapy before, but this felt different. Aggelos understands the emotional side without losing sight of the actual situation I am dealing with at work. We can talk about pressure, shame or something happening in my body, and five minutes later discuss a decision involving my team or business. I don’t have to translate one world into the other for him.", w: "Anonymous client, Founder"}, {q: "There are no motivational speeches or generic frameworks pasted onto every situation. Aggelos pays attention to how I specifically operate. He remembers the contradictions, notices when I change the story and asks the question I was hoping we could avoid. Annoying at times, but usually accurate.", w: "Anonymous client, Founder"}, {q: "I did not want somebody to tell me to work less, lower my standards or become less ambitious. Aggelos understood that immediately. Our work has been about keeping the part of me that wants to build and achieve, while becoming less dependent on winning, comparison and external approval to feel okay. That distinction has been very important to me.", w: "Anonymous client, Founder and executive"}] }),
    React.createElement(RelatedLinks, { mob, items: [
      { href: '/1-to-1/', label: 'Work with me, 1:1 →' },
      { href: '/founders/', label: 'Founder advisory →' },
      { href: '/therapy-for-executives/', label: 'Therapy for executives →' },
    ] })
  );
}

// ─── IMPOSTER SYNDROME ───────────────────────────────────────────────────────
function ImposterPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'You can see the evidence that you’re good at this. You just can’t feel it.'),
    React.createElement(SvcLead, null, "Imposter syndrome therapy for senior professionals who have every proof of competence and still feel like a fraud."),

    React.createElement(SvcSection, { title: 'The pattern' },
      React.createElement(SvcP, null, "The promotions confirm it. The salary confirms it. You're not unaware of the evidence, but ", React.createElement(Strong, null, "there's a gap between knowing you're competent and feeling it"), ", and that gap fills with constant proof-seeking: another win, another round of validation that settles things for a day or two before the doubt comes back."),
      React.createElement(SvcP, null, React.createElement(A, { href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high' }, 'For a lot of high performers, this was wired early.'), " Achievement became the way to earn approval or safety, and a conditional sense of worth got established long before the career started. Because the next result always comes and always proves insufficient, the doubt doesn't resolve; it just gets more expensive to manage.")
    ),

    React.createElement(SvcSection, { title: 'Why it gets worse with seniority' },
      React.createElement(SvcP, null, "Imposter syndrome rarely improves as you advance. ", React.createElement(Strong, null, "The stakes get higher, visibility increases, and the margin for error feels thinner."), " At junior levels you can hide behind a team or a manager. At VP level and above, your decisions are visible and your failures have your name on them."),
      React.createElement(SvcP, null, React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'When identity is enmeshed with constant success'), ", even normal setbacks feel existential. A missed quarter stops being a missed quarter and starts feeling like evidence the fraud has finally been caught. The rational part of you knows this is distorted, but the emotional system doesn't care about evidence.")
    ),

    React.createElement(SvcSection, { title: 'What doesn’t work' },
      React.createElement(SvcP, null, "Affirmations, achievement logs and \"just remember how far you've come\" all treat imposter syndrome as a thinking problem. ", React.createElement(Strong, null, "It's a feeling problem, with roots that usually predate the career by decades."), " ", React.createElement(A, { href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain' }, 'For analytical people, self-analysis often becomes another way to maintain control'), " rather than a path to change."),
      React.createElement(SvcP, null, "The doubt is real; the story it tells you about what it means is not. Therapy works with that distinction at a level self-help and coaching rarely reach.")
    ),

    React.createElement(SvcSection, { title: 'How I work with this' },
      React.createElement(SvcP, null, "I'm a business growth advisor and licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 500+ companies on growth'), ". I know the environment that amplifies imposter syndrome in tech: the pace, the ambiguity, the constant comparison."),
      React.createElement(SvcP, null, React.createElement(Strong, null, "We work with the root pattern, not the symptoms."), " That means going past the current role to understand where the conditional worth was established, why it persists, and what it would take to build a sense of self that doesn't depend on the next result."),
      React.createElement(SvcP, null, "Insight alone rarely shifts this, because most high performers have already understood it intellectually. So we work at two levels: the professional situation in front of you, and the older pattern that keeps the doubt alive whatever the evidence says. Sometimes the answer is a concrete business move, sometimes the deeper work, often both."),
      React.createElement(SvcP, null, "I write about this at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), "; the private work is where the patterns actually move.")
    ),

    React.createElement(SvcSection, { title: 'Start here' },
      React.createElement(SvcP, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes, to figure out what's driving the pattern and whether I'm the right person to work on it with you."),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Is imposter syndrome a real diagnosis?' },
          React.createElement(P, { last: true }, "Not a DSM diagnosis, but a persistent pattern of doubting your accomplishments despite clear evidence of competence. In senior professionals it shows up as overwork, avoidance of visibility, difficulty delegating and a low-grade anxiety that erodes performance and wellbeing over time.")
        ),
        React.createElement(FaqItem, { q: 'Why is imposter syndrome so common in high achievers?' },
          React.createElement(P, { last: true }, "Often because achievement started as a strategy to earn approval or safety rather than an expression of genuine interest. ", React.createElement(A, { href: 'https://www.undisguised.io/p/high-performance-as-a-way-to-get' }, 'High performance becomes a way to get accepted'), " rather than a reflection of who you are.")
        ),
        React.createElement(FaqItem, { q: 'Can coaching with a therapist actually resolve this?' },
          React.createElement(P, { last: true }, "Yes, though not through reframing or positive self-talk. Effective therapy works with the relational pattern that set up the conditional worth in the first place. ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'Doubt tends to protect you from something'), " even when you can see the evidence clearly, and that function needs to be understood before it can change.")
        ),
        React.createElement(FaqItem, { q: "I know I'm good at my job. Why do I still feel like a fraud?" },
          React.createElement(P, { last: true }, "Because the feeling isn't really about your job. It's an older emotional system that learned your value is conditional. Your rational mind processes the evidence fine, but the part that drives the doubt runs on different logic.")
        ),
        React.createElement(FaqItem, { q: 'How is therapeutically-informed coaching different from regular coaching?' },
          React.createElement(P, { last: true }, "Regular coaching usually manages symptoms: reframing, confidence exercises, tracking achievements. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets labeled coaching'), " in this space actually needs therapeutic depth. Therapy goes to the source of the pattern rather than helping you cope with it.")
        )
      )
    ),

    React.createElement(Testimonials, { mob, items: [{q: "From the outside, I was still functioning and performing at a high level, so it was difficult to explain why something felt wrong. Aggelos understood that the problem was not simply workload. We have worked on the way I connect achievement with safety, worth and relief. I am still ambitious, but success is beginning to feel less like narrowly escaping failure.", w: "Anonymous client, Tech executive"}, {q: "I trust Aggelos because he is not constantly trying to reassure me. He listens carefully, but he does not automatically agree with the version of events I bring into the session. Sometimes he points out something I would rather not see. Somehow that honesty has made the work feel safer, not less safe.", w: "Anonymous client, Product leader"}, {q: "I started working with Aggelos during a confusing period in my career. On paper, things were going well, but internally I was questioning almost everything. Over several sessions, he helped me understand which concerns were legitimate and which were being amplified by old fears around performance, failure and how other people saw me. I feel more grounded now, even though not everything has been resolved.", w: "Anonymous client, Technology executive"}] }),
    React.createElement(RelatedLinks, { mob, items: [
      { href: '/1-to-1/', label: 'Work with me, 1:1 →' },
      { href: '/therapy-for-executives/', label: 'Therapy for executives →' },
      { href: '/executive-burnout-therapy/', label: 'Executive burnout →' },
    ] })
  );
}

// ─── BURNOUT PAGE ────────────────────────────────────────────────────────────
function BurnoutPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'You took the vacation. You came back feeling the same way. The problem probably isn’t the workload.'),
    React.createElement(SvcLead, null, "Executive burnout therapy for leaders who rested, came back the same, and suspect the hours were never the real problem."),

    React.createElement(SvcSection, { title: 'Executive burnout' },
      React.createElement(SvcP, null, "The usual advice is to rest more, delegate more, set better boundaries. You've probably tried most of it, maybe even taken real time off. Within a couple of weeks of returning, ", React.createElement(Strong, null, "the same weight came back"), ", as if it had been waiting for you."),
      React.createElement(SvcP, null, "Executive burnout often has little to do with hours. Its real cost is emotional: carrying chronic responsibility without enough support, maintaining a version of yourself that takes constant effort, and an identity so tied to output that stopping feels like disappearing."),
      React.createElement(SvcP, null, "Rest doesn't fix that. ", React.createElement(A, { href: 'https://www.undisguised.io/p/is-it-post-holiday-anxiety-or-just' }, 'Sometimes what feels like post-holiday anxiety is a moment of clarity'), " about how unsustainable the arrangement has become.")
    ),

    React.createElement(SvcSection, { title: "What's actually happening" },
      React.createElement(SvcP, null, "Executive burnout usually sits on top of older patterns: an inability to stop because ", React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'identity is enmeshed with constant output'), ", a relationship with work where ", React.createElement(Strong, null, "your value as a person depends on the next deliverable"), ", and chronic overfunction that started well before this role."),
      React.createElement(SvcP, null, "The cynicism, the emotional flatness, the loss of interest in things you used to care about are signals that the internal cost of the current setup has passed what you can sustain, not character flaws."),
      React.createElement(SvcP, null, React.createElement(A, { href: 'https://www.undisguised.io/p/the-elaborate-performance-of-trying' }, 'A lot of people build elaborate systems of "trying to change"'), " that look productive but function as avoidance. If that sounds familiar, the block is rarely willpower; the pattern is serving a function nobody has named yet.")
    ),

    React.createElement(SvcSection, { title: 'How I work with this' },
      React.createElement(SvcP, null, React.createElement(Strong, null, "This work goes to the level of the pattern, not the symptoms."), " We look at what drives the overwork: what it would mean to stop, what you're avoiding by staying in motion, why doing less feels threatening rather than freeing."),
      React.createElement(SvcP, null, "I'm a business growth advisor and licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 500+ companies on growth'), ". I understand the environment: the always-on culture, the ambiguity, the pressure to appear certain when you're not."),
      React.createElement(SvcP, null, "Working less may follow, though the real aim is ", React.createElement(Strong, null, "a relationship with the work that costs less and means more"), ". We run two tracks at once: the practical situation (the role, the load, the decisions you keep postponing) and the pattern underneath that keeps you overfunctioning. Sometimes the fix is a business change, sometimes the deeper work, usually both.")
    ),

    React.createElement(SvcSection, { title: 'Start here' },
      React.createElement(SvcP, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes, to figure out what's underneath the exhaustion and whether therapy is the right approach."),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: "Why doesn't rest fix my burnout?" },
          React.createElement(P, { last: true }, "Usually because the exhaustion comes from the emotional weight of the work rather than the hours: chronic responsibility, identity tied to performance, and the difficulty of stopping without feeling like you're failing. Rest eases the symptom; therapy addresses the structure underneath.")
        ),
        React.createElement(FaqItem, { q: 'Is burnout a mental health condition?' },
          React.createElement(P, { last: true }, "The WHO classifies it as an occupational phenomenon rather than a medical diagnosis. In practice it often coexists with anxiety and depression, and at senior levels it tends to reveal longer-running patterns around identity, control and self-worth that therapy is well suited to address.")
        ),
        React.createElement(FaqItem, { q: "How do I know if I'm burned out or just tired?" },
          React.createElement(P, { last: true }, "Tiredness resolves with rest; burnout doesn't. If you've taken time off and come back feeling the same, the exhaustion is probably structural. Other signals: cynicism about work you used to care about, emotional flatness, difficulty engaging with anything that isn't urgent.")
        ),
        React.createElement(FaqItem, { q: 'Can I do this while still in the job?' },
          React.createElement(P, { last: true }, "Yes, and that's usually what happens. The point isn't to quit but to understand ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, "what's creating the problem"), " and change your relationship to the work so the cost comes down.")
        ),
        React.createElement(FaqItem, { q: "I've tried coaching, meditation and boundary-setting. Why didn't they work?" },
          React.createElement(P, { last: true }, "Because they operate at the surface. If the burnout is driven by a deeper pattern, like identity fusion with output or ", React.createElement(A, { href: 'https://www.undisguised.io/p/why-hard-work-alone-doesnt-advance' }, 'the belief that hard work should be enough on its own'), ", managing symptoms doesn't change the source.")
        )
      )
    ),

    React.createElement(Testimonials, { mob, items: [{q: "Before working together, a difficult email or a problem with a client could affect my entire day. I would immediately feel responsible for everything and start trying to control how I was perceived. We traced that response much further back than the immediate work situation. I still feel pressure, but I can recognise it earlier and I no longer believe every conclusion my nervous system produces.", w: "Anonymous client, Consultant and business owner"}, {q: "I already understood many of my patterns intellectually. That was partly the problem. I could explain myself very well and still repeat the same behaviour. Working with Aggelos helped me recognise what was happening physically, not just analyse it afterwards. That has made the work much more real and, slowly, changed how I respond under pressure.", w: "Anonymous client, Technology leader"}, {q: "The conversations go deeper than ordinary coaching, but I still leave with something usable. Sometimes that is a decision, sometimes a difficult conversation I need to have, and sometimes it is simply noticing the moment my body moves into threat before my mind creates a story around it. It is a rare combination of depth and practicality.", w: "Anonymous client, Senior tech professional"}] }),
    React.createElement(RelatedLinks, { mob, items: [
      { href: '/1-to-1/', label: 'Work with me, 1:1 →' },
      { href: '/therapy-for-executives/', label: 'Therapy for executives →' },
      { href: '/career-transition-therapy/', label: 'Career transition →' },
    ] })
  );
}

// ─── CAREER TRANSITION ───────────────────────────────────────────────────────
function CareerTransitionPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'The next role isn’t the hard part. Figuring out who you are without this one is.'),
    React.createElement(SvcLead, null, "Career transition therapy for senior professionals, where the strategy is the easy part and identity is the real work."),

    React.createElement(SvcSection, { title: 'The real transition' },
      React.createElement(SvcP, null, "You've spent years building a career that defines how people see you and, more to the point, how you see yourself. Now something is shifting. Maybe you're thinking about leaving, maybe you were pushed out, maybe you already made the move and ", React.createElement(Strong, null, "expected relief but got disorientation instead"), "."),
      React.createElement(SvcP, null, "The strategic questions (industry, role, compensation) are usually the easier part. The harder one is the one most people around you can't help with: ", React.createElement(Strong, null, "who are you when the title, the team and the daily structure that organised your sense of self are gone?")),
      React.createElement(SvcP, null, React.createElement(A, { href: 'https://www.undisguised.io/p/youre-just-trading-one-type-of-friction' }, 'A lot of people assume the grass is greener across the corporate/startup divide.'), " They trade one set of difficulties for another and wonder why the relief didn't last. Usually the problem was the relationship to work itself, and that comes with you.")
    ),

    React.createElement(SvcSection, { title: 'What makes this hard' },
      React.createElement(SvcP, null, "At senior levels your career is ", React.createElement(Strong, null, "the structure that holds a lot of your identity together"), ". Your social world, your daily rhythm, your sense of competence are all built around the role. When that structure changes, everything it was quietly holding in place starts to shift."),
      React.createElement(SvcP, null, "If you were laid off, the grief often surprises you, because it's about the version of yourself that lived inside the role, not only the job. If you're choosing to leave, the paralysis rarely comes from the options. ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'The doubt is protecting you from something'), ", usually the fear of what you'll find on the other side."),
      React.createElement(SvcP, null, "And feeling lost rather than free after the move is the predictable result of removing a structure without understanding what it was compensating for, not a failure.")
    ),

    React.createElement(SvcSection, { title: 'Why a therapist, not a career coach' },
      React.createElement(SvcP, null, "Career coaching helps you figure out what to do next. ", React.createElement(Strong, null, "Therapeutically-informed coaching helps you understand why you're stuck"), ", what the transition is really about, and what needs to shift internally for any external change to hold. Without that, people recreate the same patterns in new settings and ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, 'build the same problem in a different context'), "."),
      React.createElement(SvcP, null, "I'm a business growth advisor and licensed psychotherapist who made this kind of transition myself, from 18+ years in B2B SaaS and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'growth advisory'), " to clinical practice. I know what it's like to leave an identity that works, and the difference between doing it reactively and doing it with some clarity about what's driving the change."),
      React.createElement(SvcP, null, "The work runs on two tracks: the practical side of the move (options, risk, the actual plan) and what makes it hard underneath, the identity and worth questions the strategy can't touch. Sometimes you mostly need the plan, sometimes the deeper work, often both. The aim is a working life that feels genuinely fulfilling, not just impressive.")
    ),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, React.createElement(Strong, null, "Senior professionals weighing a major career change"), " but paralysed by it. Executives who were laid off and are dealing with more than the job search. Leaders who made the move and feel more lost than free. People who ", React.createElement(Strong, null, "keep almost leaving but pull back every time"), ". Anyone senior who suspects the career question is really about identity, worth and what they want from the next phase of working life.")
    ),

    React.createElement(SvcSection, { title: 'Start here' },
      React.createElement(SvcP, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes, to figure out what's driving the transition, or the resistance to it, and whether therapy is the right support for this moment."),
      React.createElement('div', { className: 'svc-ctarow' },
        React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')
      )
    ),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Why would I need a therapist for career transition coaching?' },
          React.createElement(P, { last: true }, "Because at senior levels a career change disrupts your identity, your social world and your sense of competence, not just your job. The strategic part is rarely the real difficulty. The harder part is figuring out who you are when the structure that organised your life is gone.")
        ),
        React.createElement(FaqItem, { q: "I can't decide whether to leave. Can therapy help with that?" },
          React.createElement(P, { last: true }, "Usually, yes. The indecision almost never comes from lack of information. It comes from what the decision represents: loss of identity, fear of regret, the distance between what you want and what you think you should want. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Endless deliberation has its own cost'), ", and therapy works with the internal conflict that makes the decision feel impossible.")
        ),
        React.createElement(FaqItem, { q: 'How is this different from career coaching?' },
          React.createElement(P, { last: true }, "Regular career coaching works on what to do next. Therapeutically-informed coaching works on why you're stuck and what needs to shift internally for any external change to hold. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets called career coaching'), " actually needs therapeutic depth to address properly.")
        ),
        React.createElement(FaqItem, { q: 'I was laid off and I feel lost. Is that normal?' },
          React.createElement(P, { last: true }, "Very. Involuntary exits at senior levels produce genuine grief, not just about the job but about the identity and daily structure it provided. Most people around you won’t fully understand, because they see it as “just a job.” Therapy gives you space to process the loss before rushing into whatever comes next.")
        ),
        React.createElement(FaqItem, { q: 'I already made the move and feel worse. What happened?' },
          React.createElement(P, { last: true }, "You probably removed the structure without fully understanding what it was compensating for. The old role quietly held things in place: your sense of purpose, your daily identity, your social connections. Without it, those gaps become visible. That points to deeper work to do, not to a wrong choice, and now you have the space for it.")
        )
      )
    ),

    React.createElement(Testimonials, { mob, items: [{q: "We have been working together for a while now, and the sessions have gradually changed the way I make decisions. Aggelos doesn’t tell me what to do or try to make me dependent on his opinion. He helps me separate the real problem from the fear, ego and old patterns wrapped around it. I usually leave with less noise and a much clearer sense of what is mine to do.", w: "Anonymous client, Founder"}, {q: "I had been forcing a business situation to continue because stopping it felt like failure. After one of our exercises, I realised I was trying to manufacture reasons to keep going when I already knew the answer. I had the difficult conversation shortly afterwards. It was not that Aggelos gave me the decision. He helped me stop fighting what I already knew.", w: "Anonymous client, Business owner"}, {q: "I was initially sceptical about somatic and trauma-informed work because I assumed it would be vague or a bit spiritual. It wasn’t. Aggelos explained what we were doing, paid attention to my limits and connected the experience back to patterns I could recognise in my work and relationships. It felt grounded, careful and surprisingly practical.", w: "Anonymous client"}] }),
    React.createElement(RelatedLinks, { mob, items: [
      { href: '/1-to-1/', label: 'Work with me, 1:1 →' },
      { href: '/therapy-for-executives/', label: 'Therapy for executives →' },
      { href: '/executive-burnout-therapy/', label: 'Executive burnout →' },
    ] })
  );
}

// ─── SHARED PAGE HELPERS ─────────────────────────────────────────────────────
function locMobPage(mob) {
  return mob ? { ...pageStyle } : widePageStyle;
}
function BookCta({ label, lang = 'en' }) {
  return React.createElement('div', { style: { marginTop: '1.4rem' } },
    React.createElement('a', { href: pathFor('book', lang), className: 'cta-btn', style: ctaBtn }, label || (tUI(lang).book + ' →'))
  );
}

// ─── GREEK-SPEAKING THERAPIST · LONDON ───────────────────────────────────────
function LondonPage() {
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Greek-speaking therapist for tech professionals in London'),
    React.createElement(SvcLead, null, "If you work in London tech and you’d rather do this in Greek, with someone who also understands your industry, that’s the idea. The work is the same one I do with every client; speaking Greek just takes the translation out of it."),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Greek-speaking founders, engineers, product managers, designers, consultants and executives working in London tech: fintech, scale-ups, big tech, agencies, the consulting firms. Wherever in the city you ended up.")
    ),

    React.createElement(SvcSection, { title: 'Why it helps that I speak Greek' },
      React.createElement(SvcP, null, "Therapy works better in the language you actually think and feel in. The family expectations, the humour, the guilt, the particular context of building a life away from Greece, none of it needs translating or explaining from scratch."),
      React.createElement(SvcP, null, "We start from a shared understanding instead of spending sessions building one. That's the real reason to choose a Greek-speaking therapist over a perfectly good local one.")
    ),

    React.createElement(SvcSection, { title: 'And I understand the industry' },
      React.createElement(SvcP, null, "You also don't have to explain your work. Before training as a psychotherapist I spent 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised more than 500 companies'), ", so runway, reorgs, shipping and the pressure of a senior role are things I already follow. It's the same reason my ", React.createElement(IA, { href: '/1-to-1/' }, 'founder'), " and ", React.createElement(IA, { href: '/1-to-1/' }, 'solopreneur'), " clients come to me.")
    ),

    React.createElement(SvcSection, { title: 'The work itself is the same' },
      React.createElement(SvcP, null, "Nothing about the work changes because you're in London or because we speak Greek. It's the same private, one-to-one work I do with everyone, the personal pattern and the real decision in front of you, worked at the same time. How it runs, step by step, is on ", React.createElement(IA, { href: '/1-to-1/' }, 'how I work'), ".")
    ),

    React.createElement(SvcSection, { title: 'Online sessions' },
      React.createElement(SvcP, null, "Everything is online, one to one. I'm based in Ireland, the same time zone as London, so an early slot before work or an evening one is easy to arrange. There's no in-person room.")
    ),

    React.createElement(SvcSection, { title: 'Confidentiality' },
      React.createElement(SvcP, null, "Private and one to one. I don't report to anyone and I don't use identifiable client stories anywhere. Here's ", React.createElement(IA, { href: '/confidentiality/' }, 'how confidentiality works'), " in detail.")
    ),

    React.createElement('div', { className: 'svc-ctarow' }, React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Greek or English?' },
          React.createElement(P, { last: true }, "Either, and you can switch mid-sentence. Most people move between the two without thinking about it.")
        ),
        React.createElement(FaqItem, { q: 'Is the therapy itself any different because it’s in Greek?' },
          React.createElement(P, { last: true }, "No. Same work, same approach I take with everyone. The Greek, and a shared read on your world, just remove the friction of explaining and translating.")
        ),
        React.createElement(FaqItem, { q: 'Are you based in London?' },
          React.createElement(P, { last: true }, "No, I'm based in Ireland and work online. London is the same time zone, so scheduling is simple. There's no in-person option.")
        ),
        React.createElement(FaqItem, { q: 'What do people usually bring?' },
          React.createElement(P, { last: true }, "The same things anyone brings: pressure that won't switch off, a decision they keep circling, burnout, self-doubt, work that has quietly taken over. Nothing London-specific. You just get to talk about it in Greek, with someone who understands the context.")
        )
      )
    )
  );
}

// ─── GREEK-SPEAKING THERAPIST · MANCHESTER ───────────────────────────────────
function ManchesterPage() {
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Greek-speaking therapist for tech professionals in Manchester'),
    React.createElement(SvcLead, null, "If you're in tech in Manchester and you'd rather talk in Greek, with someone who also knows the industry, that's what this is. The work is the same one I do with every client; your own language just takes the translation out of it."),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Greek-speaking engineers, developers, product and design people, consultants, agency owners and remote workers in and around Manchester and the wider North of England.")
    ),

    React.createElement(SvcSection, { title: 'Why it helps that I speak Greek' },
      React.createElement(SvcP, null, "It's easier to do this in the language you grew up in. The family side, the humour, the expectations, the context of building a life away from Greece, none of it needs translating or explaining first."),
      React.createElement(SvcP, null, "You get to be blunt, funny and unsure in your own idiom, and be understood the first time. That, more than anything, is why people look for a Greek-speaking therapist rather than a local one.")
    ),

    React.createElement(SvcSection, { title: 'And I understand the industry' },
      React.createElement(SvcP, null, "You also don't have to explain the work: the pipeline that's gone quiet, the pricing you avoid raising, the projects, the independence. I spent 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised more than 500 companies'), " before training as a psychotherapist, and I've done the job-to-independent route myself. It's the same reason my ", React.createElement(IA, { href: '/1-to-1/' }, 'solopreneur'), " and ", React.createElement(IA, { href: '/1-to-1/' }, 'founder'), " clients come to me.")
    ),

    React.createElement(SvcSection, { title: 'The work itself is the same' },
      React.createElement(SvcP, null, "It's the same private, one-to-one work I do with everyone, working the personal pattern and the practical decision together. If you work for yourself, that includes the business side (pricing, positioning, the outreach you keep putting off) alongside the pattern underneath it. The full shape of it is on ", React.createElement(IA, { href: '/1-to-1/' }, 'how I work'), ".")
    ),

    React.createElement(SvcSection, { title: 'Online sessions' },
      React.createElement(SvcP, null, "Everything is online, one to one. I'm based in Ireland, the same time zone as Manchester, so slots fit easily around work. If you're remote-first anyway, a video session is just a Tuesday. There's no in-person room.")
    ),

    React.createElement(SvcSection, { title: 'Confidentiality' },
      React.createElement(SvcP, null, "Private, one to one, and it stays that way. Nothing gets reported to anyone and I don't use identifiable stories. Here's ", React.createElement(IA, { href: '/confidentiality/' }, 'how confidentiality works'), ".")
    ),

    React.createElement('div', { className: 'svc-ctarow' }, React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Do I need to be in Manchester itself?' },
          React.createElement(P, { last: true }, "No. Sessions are online, so anywhere in the UK works the same. Manchester and the North just happen to be where a lot of my Greek-speaking, remote and independent clients are.")
        ),
        React.createElement(FaqItem, { q: 'I work for myself. Can we cover the business too?' },
          React.createElement(P, { last: true }, "Yes. Pricing, positioning and the outreach you avoid sit alongside the pattern underneath them, because for solo and independent people the two are rarely separate. Same work I do with any solopreneur.")
        ),
        React.createElement(FaqItem, { q: 'Greek or English?' },
          React.createElement(P, { last: true }, "Either, or both in the same session. Working in your own language is the point.")
        ),
        React.createElement(FaqItem, { q: 'Is this a different service from the London or Dublin pages?' },
          React.createElement(P, { last: true }, "No, same person, same offer. The only real differences are who tends to be where and the practical logistics. The therapy itself doesn't change.")
        )
      )
    )
  );
}

// ─── GREEK-SPEAKING THERAPIST · NEW YORK ─────────────────────────────────────
function NewYorkPage() {
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Greek-speaking therapist for tech professionals in New York'),
    React.createElement(SvcLead, null, "If you're Greek and working in New York tech, and you'd rather do this in Greek with someone who also understands the industry, that's the idea. The work is the same one I do with every client; speaking Greek just takes the translation out of it."),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Greek-speaking engineers, founders, product leaders, designers and operators in New York tech: startups, larger platforms and the finance-adjacent world the city runs on.")
    ),

    React.createElement(SvcSection, { title: 'Why it helps that I speak Greek' },
      React.createElement(SvcP, null, "The things that actually run you (family, expectation, the particular pride and guilt of the one who went to the States) tend to live in Greek. In English they stay at a slight, unhelpful distance."),
      React.createElement(SvcP, null, "Working in your first language means none of that needs translating, and the cultural context is already understood. That's the reason to choose this over a local option, not anything different about the therapy.")
    ),

    React.createElement(SvcSection, { title: 'And I understand the industry' },
      React.createElement(SvcP, null, "You also don't have to explain equity, runway, a reorg, or why “just be confident” is useless advice. 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, '500+ companies advised'), " before I trained as a psychotherapist. It's the same reason my ", React.createElement(IA, { href: '/1-to-1/' }, 'founder'), " and senior ", React.createElement(IA, { href: '/1-to-1/' }, 'executive'), " clients come to me.")
    ),

    React.createElement(SvcSection, { title: 'The work itself is the same' },
      React.createElement(SvcP, null, "Nothing about the work changes because you're in New York. It's the same one-to-one work I do with everyone, holding the personal pattern and the real situation at work in the same room. The steps are laid out on ", React.createElement(IA, { href: '/1-to-1/' }, 'how I work'), ".")
    ),

    React.createElement(SvcSection, { title: 'Online, across the time difference' },
      React.createElement(SvcP, null, "Sessions are online, one to one. I'm based in Ireland, about five hours ahead of New York, so in practice they land in your morning. We agree a recurring slot that works for both of us; if the time difference doesn't fit your schedule, I'll tell you on the fit call rather than force it.")
    ),

    React.createElement(SvcSection, { title: 'Confidentiality' },
      React.createElement(SvcP, null, "Private and one to one. I don't report to your employer, investors or anyone else, and I don't use identifiable stories publicly. The detail, including the honest limits, is on the ", React.createElement(IA, { href: '/confidentiality/' }, 'confidentiality page'), ".")
    ),

    React.createElement('div', { className: 'svc-ctarow' }, React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: "You're in Ireland, so how does the time difference work?" },
          React.createElement(P, { last: true }, "Ireland is about five hours ahead of New York, so sessions usually sit in your morning. We set a fixed recurring slot. If your schedule can't make the difference work, I'll say so on the fit call instead of pretending it's fine.")
        ),
        React.createElement(FaqItem, { q: 'Are you a licensed therapist in New York State?' },
          React.createElement(P, { last: true }, "I'm a licensed psychotherapist and a registered member of the BACP (British Association for Counselling and Psychotherapy). I'm not registered with a New York State board, and this is online work rather than a local clinical service. If you specifically need a New-York-licensed provider (for insurance, say) I'm happy to point you elsewhere on the fit call.")
        ),
        React.createElement(FaqItem, { q: 'Greek or English?' },
          React.createElement(P, { last: true }, "Either, or both in the same session. Working in your first language is the reason to choose this.")
        ),
        React.createElement(FaqItem, { q: 'Is it a different kind of therapy because it’s for Greek people abroad?' },
          React.createElement(P, { last: true }, "No. It's the offer everyone gets. Being able to do it in Greek, with the context already understood, is the only part that's specific to you.")
        )
      )
    )
  );
}

// ─── GREEK-SPEAKING THERAPIST · DUBLIN ───────────────────────────────────────
function DublinPage() {
  return React.createElement(SvcPage, null,
    React.createElement(SvcH1, null, 'Greek-speaking therapist for tech professionals in Dublin'),
    React.createElement(SvcLead, null, "If you're Greek and working in Dublin tech, and you'd rather do this in Greek with someone who also knows the industry, that's what this is. The work is the same one I do with every client; speaking Greek just removes the translation."),

    React.createElement(SvcSection, { title: 'Who this is for' },
      React.createElement(SvcP, null, "Greek-speaking engineers, product managers, operations and consulting people working in Dublin's multinationals, tech companies and startups.")
    ),

    React.createElement(SvcSection, { title: 'Why it helps that I speak Greek' },
      React.createElement(SvcP, null, "For people who've relocated, a lot of what matters is still tied to Greece: family, expectations, the pull home. It's the part hardest to explain to someone outside the culture, and the part that lands flat when you have to translate it."),
      React.createElement(SvcP, null, "In Greek, with someone who already gets it, you can go straight to it. That's the reason to choose a Greek-speaking therapist, not anything different about the work.")
    ),

    React.createElement(SvcSection, { title: 'And I understand the industry' },
      React.createElement(SvcP, null, "You also don't have to explain corporate life: the big-org politics, the way a role can quietly take over. 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, '500+ companies advised'), " before I trained as a psychotherapist, including inside a large enterprise. I happen to be based in Ireland myself, which helps with the practicalities, but the real reason to come is that I hold both the work and the Greek context at once.")
    ),

    React.createElement(SvcSection, { title: 'The work itself is the same' },
      React.createElement(SvcP, null, "It's the same private, one-to-one work I do with everyone, the personal pattern and the real decision together, whether that's the job, the move, or whether to stay at all. How the work runs is on ", React.createElement(IA, { href: '/1-to-1/' }, 'how I work'), ".")
    ),

    React.createElement(SvcSection, { title: 'Online sessions' },
      React.createElement(SvcP, null, "Everything is online, one to one. I'm based in Ireland, so we share a time zone and there's nothing to solve on scheduling, though sessions are by video, not in person. Same country, same working hours; that's where the convenience begins and ends.")
    ),

    React.createElement(SvcSection, { title: 'Confidentiality' },
      React.createElement(SvcP, null, "Private and one to one. Nothing goes back to your employer or manager, and I don't use identifiable stories publicly. The full detail is on the ", React.createElement(IA, { href: '/confidentiality/' }, 'confidentiality page'), ".")
    ),

    React.createElement('div', { className: 'svc-ctarow' }, React.createElement(SvcCta, { href: '/book/' }, 'Book a fit call →')),

    React.createElement(SvcSection, { title: 'Common questions' },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: "You're in Ireland too, so can we meet in person?" },
          React.createElement(P, { last: true }, "No, the work is online, one to one, by video, the same as for all my clients. Being in the same country and time zone makes scheduling effortless, but there isn't an in-person room.")
        ),
        React.createElement(FaqItem, { q: 'A lot of what’s on my mind is family back in Greece. Is that the right thing to bring?' },
          React.createElement(P, { last: true }, "Yes. For people who've relocated, the tie home is usually central rather than a side issue, and it's the part hardest to explain to someone outside the culture. Working in Greek is exactly what makes it workable.")
        ),
        React.createElement(FaqItem, { q: 'Greek or English?' },
          React.createElement(P, { last: true }, "Either, or both in the same session. Your language, your call.")
        ),
        React.createElement(FaqItem, { q: 'Is this a different service because I’m Greek and abroad?' },
          React.createElement(P, { last: true }, "No. It's the ordinary work, with the difference that you don't have to explain your background before we can start.")
        )
      )
    )
  );
}

// ─── CONFIDENTIALITY (bilingual, plain-language trust page) ───────────────────
const CONF = {
  en: {
    h1: 'Confidentiality',
    intro: [
      "People bring me things they haven't said to a cofounder, investor, employee, partner or sometimes anyone else.",
      "That only works if privacy isn't vague.",
      "Here's what you can expect.",
    ],
    sections: [
      { label: 'What you say stays private', body: [
        "I don't send session content to your employer, investors, board, cofounder, team, partner or whoever referred you.",
        'That remains true if somebody else is paying for the work.',
        "Paying the invoice doesn't buy access to the conversation.",
        'The limits to confidentiality are explained below.',
      ] },
      { label: 'You can talk about the actual thing', body: ['That includes things like:'],
        list: [
          'doubts about the company or whether you still want it',
          'problems with a cofounder',
          "employees you're worried about or decisions you're avoiding",
          'investor or board pressure',
          'runway, revenue and financial fear',
          'wanting to leave, sell or stop',
          'things happening in your personal life that are affecting the work',
        ],
        after: ["I don't have a back channel to the people involved."] },
      { label: 'If somebody else pays', body: [
        'Sometimes a company, investor or another party funds the work.',
        'They pay the invoice.',
        "They do not receive session content, notes, progress reports or a summary of what we're working on.",
        'If they expect something different, we establish that before the work starts.',
      ] },
      { label: 'Stories and content', body: [
        'I write and speak publicly about the kinds of problems I work with.',
        "I don't publish identifiable client material without explicit permission.",
        "Anything based on client work is fictionalised, materially altered or combined from patterns across different people so that an individual can't reasonably be identified.",
        "If I ever wanted to use something recognisably close to your real situation, I'd ask first.",
        'A no is a no.',
      ] },
      { label: 'Notes and data', body: [
        'I keep records to a considered minimum and use standard professional tools for scheduling, communication and sessions.',
        "If you want to know exactly what I store, where and for how long, ask me. I'll answer plainly.",
      ] },
      { label: 'NDA', body: [
        "If an NDA makes the commercial side easier to trust, I'm happy to discuss signing one before we start.",
      ] },
      { label: 'The limits', body: [
        "I won't promise absolute secrecy because that wouldn't be an honest promise.",
        'Confidentiality is the default, but there are narrow circumstances where it can have limits, including serious and immediate risk of harm and situations where disclosure is legally required.',
        'As a BACP-registered psychotherapist, I also use clinical supervision. This is itself confidential, and material is discussed in a way intended to protect client identity.',
        "If any of these limits are particularly relevant to your situation, ask me before we start and I'll be specific.",
      ] },
      { label: "This page isn't the contract", body: [
        'This is a plain-language explanation of how I approach confidentiality.',
        "It doesn't replace the actual agreement, privacy information, consent documentation or an NDA where one applies.",
        "If confidentiality is the thing stopping you from starting, ask me about the exact thing you're worried about.",
      ] },
    ],
  },
  el: {
    h1: 'Εμπιστευτικότητα',
    intro: [
      'Οι άνθρωποι που δουλεύουν μαζί μου λένε πράγματα που μπορεί να μην έχουν πει σε cofounder, επενδυτή, συνεργάτη, σύντροφο ή καμιά φορά σε κανέναν.',
      'Αυτό λειτουργεί μόνο αν είναι ξεκάθαρο τι μένει μεταξύ μας.',
      'Οπότε, χωρίς νομικίστικα:',
    ],
    sections: [
      { label: 'Όσα λες μένουν μεταξύ μας', body: [
        'Δεν στέλνω το περιεχόμενο των συζητήσεών μας σε εργοδότη, επενδυτές, board, cofounder, ομάδα, σύντροφο ή σε αυτόν που σε παρέπεμψε σε μένα.',
        'Το ίδιο ισχύει και αν κάποιος άλλος πληρώνει για τη συνεργασία.',
        'Το ότι κάποιος πληρώνει τον λογαριασμό δεν του δίνει πρόσβαση στη συζήτηση.',
        'Τα όρια της εμπιστευτικότητας εξηγούνται πιο κάτω.',
      ] },
      { label: 'Μπορείς να μιλήσεις για το πραγματικό θέμα', body: ['Για παράδειγμα:'],
        list: [
          'αμφιβολίες για το business ή για το αν το θέλεις ακόμα',
          'προβλήματα με cofounder',
          'εργαζομένους που σε προβληματίζουν ή αποφάσεις που αποφεύγεις',
          'πίεση από επενδυτές ή board',
          'runway, έσοδα και οικονομικό φόβο',
          'σκέψεις να φύγεις, να πουλήσεις ή να σταματήσεις',
          'προσωπικά πράγματα που έχουν αρχίσει να επηρεάζουν τη δουλειά',
        ],
        after: ['Δεν υπάρχει κάποια δεύτερη γραμμή επικοινωνίας με τους ανθρώπους που αφορούν αυτά.'] },
      { label: 'Αν πληρώνει κάποιος άλλος', body: [
        'Μερικές φορές τη συνεργασία πληρώνει μια εταιρεία, ένας επενδυτής ή κάποιος άλλος.',
        'Αυτός πληρώνει το invoice.',
        'Δεν παίρνει το περιεχόμενο των συνεδριών, σημειώσεις, progress report ή περίληψη του τι δουλεύουμε.',
        'Αν περιμένει κάτι διαφορετικό, το ξεκαθαρίζουμε πριν ξεκινήσουμε.',
      ] },
      { label: 'Ιστορίες και περιεχόμενο', body: [
        'Γράφω και μιλάω δημόσια για θέματα που συναντώ στη δουλειά μου.',
        'Δεν χρησιμοποιώ αναγνωρίσιμο υλικό πελατών χωρίς ξεκάθαρη άδεια.',
        'Όταν κάτι βασίζεται σε δουλειά με πελάτες, είναι φανταστικό, αρκετά αλλαγμένο ή συνδυασμός μοτίβων από διαφορετικούς ανθρώπους, ώστε να μην μπορεί να ταυτοποιηθεί κάποιος συγκεκριμένος.',
        'Αν ποτέ ήθελα να χρησιμοποιήσω κάτι που μοιάζει αναγνωρίσιμα με τη δική σου πραγματική ιστορία, θα σε ρωτούσα πρώτα.',
        'Το όχι είναι όχι.',
      ] },
      { label: 'Σημειώσεις και δεδομένα', body: [
        'Κρατάω τα αρχεία που χρειάζονται στο ελάχιστο που θεωρώ απαραίτητο και χρησιμοποιώ επαγγελματικά εργαλεία για συνεδρίες, επικοινωνία και scheduling.',
        'Αν θέλεις να ξέρεις ακριβώς τι κρατάω, πού και για πόσο, ρώτησέ με. Θα σου απαντήσω συγκεκριμένα.',
      ] },
      { label: 'NDA', body: [
        'Αν ένα NDA σε βοηθά να νιώσεις πιο ασφαλής για το business κομμάτι, μπορούμε να το συζητήσουμε πριν ξεκινήσουμε.',
      ] },
      { label: 'Τα όρια', body: [
        'Δεν πρόκειται να υποσχεθώ απόλυτη μυστικότητα, γιατί δεν θα ήταν ειλικρινής υπόσχεση.',
        'Η εμπιστευτικότητα είναι ο κανόνας. Υπάρχουν όμως περιορισμένες περιπτώσεις όπου μπορεί να έχει όρια, όπως άμεσος και σοβαρός κίνδυνος βλάβης ή περιπτώσεις όπου η γνωστοποίηση απαιτείται από τον νόμο.',
        'Ως ψυχοθεραπευτής εγγεγραμμένος στο BACP χρησιμοποιώ επίσης κλινική εποπτεία. Η εποπτεία είναι και η ίδια εμπιστευτική και το υλικό συζητείται με τρόπο που προστατεύει την ταυτότητα του πελάτη.',
        'Αν κάποιος από αυτούς τους περιορισμούς έχει ιδιαίτερη σημασία για τη δική σου περίπτωση, ρώτησέ με πριν ξεκινήσουμε.',
      ] },
      { label: 'Αυτή η σελίδα δεν είναι το συμβόλαιο', body: [
        'Είναι μια απλή εξήγηση του τρόπου με τον οποίο χειρίζομαι την εμπιστευτικότητα.',
        'Δεν αντικαθιστά τη συμφωνία συνεργασίας, την ενημέρωση για τα προσωπικά δεδομένα, τα έγγραφα συναίνεσης ή ένα NDA όπου χρειάζεται.',
        'Αν η εμπιστευτικότητα είναι αυτό που σε κάνει να διστάζεις, πες μου ακριβώς τι σε ανησυχεί.',
      ] },
    ],
  },
};
function ConfidentialityPage({ lang = 'en' }) {
  const mob = useIsMobile();
  const c = CONF[lang] || CONF.en;
  const bodyP = { fontSize: mob ? '17px' : '18px', lineHeight: 1.7, color: C.text, margin: '0 0 .8rem' };
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.5rem' } }, c.h1),
    c.intro.map((t, i) => i === 0
      ? React.createElement('p', { key: i, style: { ...leadStyle, marginBottom: '.7rem' } }, t)
      : React.createElement('p', { key: i, style: bodyP }, t)),
    React.createElement('div', { style: { marginBottom: mob ? '2rem' : '2.75rem' } }),
    c.sections.map((s, i) => React.createElement(Section, { key: i, label: s.label, mob },
      s.body.map((p, j) => React.createElement(P, { key: 'b' + j, last: !s.list && !s.after && j === s.body.length - 1 }, p)),
      s.list && React.createElement('ul', { style: { margin: '0 0 1.1rem', paddingLeft: '1.2rem', lineHeight: 1.9, fontSize: mob ? '16px' : '17px', color: C.text } },
        s.list.map((li, k) => React.createElement('li', { key: 'l' + k, style: { marginBottom: '.35rem' } }, li))),
      s.after && s.after.map((p, j) => React.createElement(P, { key: 'a' + j, last: j === s.after.length - 1 }, p))
    )),
    React.createElement(BookCta, { lang }),
    React.createElement(SiteFooter, { mob, lang })
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GREEK SEO LANDING PAGES (/el/*) — mined from the retired .gr site, re-authored
// to the current positioning (Business Growth Advisor + Ψυχοθεραπευτής; business,
// psychology, or both). Each keeps its own search intent; none duplicates /el/1-to-1/.
// ═══════════════════════════════════════════════════════════════════════════
const EL_ROLE = 'Business Growth Advisor + Ψυχοθεραπευτής';
function ElRoleEyebrow() {
  return React.createElement('div', { className: 'svc-eyebrow' }, EL_ROLE);
}
function ElH1({ mob, children }) {
  return React.createElement('h1', { className: 'svc-h1' }, children);
}

// ─── /el/executive-coaching/ ─────────────────────────────────────────────────
function ElExecutiveCoachingPage() {
  const mob = useIsMobile();
  return React.createElement(SvcPage, null,
    React.createElement(ElRoleEyebrow, null),
    React.createElement(ElH1, { mob }, 'Executive Coaching για στελέχη που συνεχίζουν να αποδίδουν με όλο και μεγαλύτερο προσωπικό κόστος'),

    React.createElement(SvcSection, { title: 'Το ζήτημα' },
      React.createElement(SvcP, null, 'Είσαι καλός στη δουλειά σου, οι άλλοι το βλέπουν και τα αποτελέσματα το επιβεβαιώνουν. Κάπου στην πορεία, όμως, το κόστος του να συνεχίζεις έτσι μεγάλωσε, και δεν διορθώνεται με καλύτερο delegation, λίγες μέρες άδεια ή άλλο ένα productivity hack.'),
      React.createElement(SvcP, null, 'Για κάποιους είναι η απομόνωση που συνοδεύει έναν senior ρόλο. Για άλλους, η ταυτότητα έχει δεθεί τόσο με την απόδοση ώστε η επιβράδυνση ή η αμφιβολία να μοιάζουν απειλητικές. Ή υπάρχει η αίσθηση ότι μία λάθος απόφαση αρκεί για να θέσει σε κίνδυνο όσα έχτισες.'),
      React.createElement(SvcP, null, 'Αυτά συνήθως δεν λύνονται με άλλο ένα leadership framework, αλλά με έναν διαφορετικό χώρο και ένα διαφορετικό είδος συζήτησης.')
    ),

    React.createElement(SvcSection, { title: 'Τι δουλεύουμε' },
      React.createElement(SvcP, null, 'Μπορεί να έρχεσαι με μια συγκεκριμένη απόφαση που δεν μπορείς να συζητήσεις ανοιχτά με την ομάδα, το board ή τους επενδυτές. Ή να βλέπεις ότι τα ίδια προβλήματα επιστρέφουν:'),
      React.createElement(Bullets, { mob, items: [
        'δυσκολεύεσαι να εμπιστευτείς ή να αναθέσεις',
        'αναλαμβάνεις περισσότερα από όσα σου αναλογούν',
        'αποφεύγεις μια απόφαση παρότι ξέρεις ότι δεν περιμένει',
        'αντιδράς με τον ίδιο τρόπο σε διαφορετικές ομάδες και συνεργασίες',
        'συνεχίζεις να αποδίδεις, αλλά νιώθεις ότι πλησιάζεις τα όριά σου',
      ] }),
      React.createElement(SvcP, null, 'Σε υψηλά επίπεδα ευθύνης η απομόνωση είναι συχνά δομική: πολλοί εξαρτώνται από εσένα, αλλά ελάχιστοι είναι εκείνοι μπροστά στους οποίους μπορείς να μιλήσεις χωρίς να διαχειρίζεσαι ταυτόχρονα την εικόνα σου.')
    ),

    React.createElement(SvcSection, { title: 'Γιατί μπορώ να καταλάβω το περιβάλλον σου' },
      React.createElement(SvcP, null, 'Πριν εκπαιδευτώ στην ψυχοθεραπεία, πέρασα 18+ χρόνια στην τεχνολογία, το product και το growth. Έχω υπάρξει founder, έχω δουλέψει σε startups και μεγάλους οργανισμούς και έχω συμβουλέψει πάνω από 500 επιχειρήσεις. Δεν χρειάζεται να μου μεταφράσεις τον επαγγελματικό σου κόσμο.'),
      React.createElement(SvcP, null, React.createElement(Strong, null, 'Δεν ψυχολογικοποιούμε κάθε επαγγελματική δυσκολία.'), ' Προσπαθούμε να ξεχωρίσουμε πότε το πρόβλημα είναι πρακτικό business, πότε είναι ψυχολογικό και πότε, όπως συμβαίνει συχνά, είναι και τα δύο.')
    ),

    React.createElement(SvcSection, { title: 'Με ποιους δουλεύω' },
      React.createElement(SvcP, null, 'Founders, C-level, VPs, directors και senior professionals, κυρίως στην τεχνολογία αλλά όχι μόνο. Το σημείο εκκίνησης μπορεί να είναι:'),
      React.createElement(Bullets, { mob, items: [
        React.createElement(IA, { href: '/el/burnout/' }, 'burnout'),
        React.createElement(IA, { href: '/el/imposter-syndrome/' }, 'imposter syndrome'),
        'μια δύσκολη απόφαση που αναβάλλεται',
        'απομόνωση στον ρόλο',
        'σύγκρουση με συνεργάτες ή επενδυτές',
        'η αίσθηση ότι δεν θέλεις πια τη ζωή που συνοδεύει την επιτυχία σου',
      ] })
    ),

    React.createElement(SvcSection, { title: 'Πώς ξεκινάμε' },
      React.createElement(SvcP, null, 'Οι συνεδρίες γίνονται online, ατομικά και με πλήρη εμπιστευτικότητα. Ξεκινάμε με μια σύντομη, δωρεάν γνωριμία ~15 λεπτών, για να δούμε τι πραγματικά συμβαίνει και αν ταιριάζουμε.'),
      React.createElement(CtaRow, { lang: 'el', mob })
    ),

    React.createElement(SvcSection, { title: 'Συχνές ερωτήσεις' },
      React.createElement(SvcFaq, { items: [
        { q: 'Σε τι διαφέρει από το κλασικό coaching στελεχών;', a: 'Το κλασικό coaching συνήθως εστιάζει σε leadership skills, στόχους, στρατηγική και performance. Αυτά μπορεί να είναι μέρος της δουλειάς, αλλά εξετάζουμε και γιατί, παρά τις γνώσεις και την εμπειρία σου, το ίδιο πρόβλημα επιστρέφει, ή γιατί ξέρεις τι πρέπει να κάνεις αλλά δεν το κάνεις.' },
        { q: 'Χρειάζομαι coaching ή κάτι πιο ψυχολογικό;', a: 'Δεν χρειάζεται να το αποφασίσεις εσύ από πριν. Αν το θέμα είναι κυρίως μια απόφαση ή ένας στόχος, δουλεύεται σε επίπεδο coaching. Αν τα ίδια μοτίβα επιστρέφουν σε διαφορετικούς ρόλους και σχέσεις, πάμε βαθύτερα. Συχνά δουλεύουμε και στα δύο.' },
        { q: 'Είναι εμπιστευτικό;', a: React.createElement(React.Fragment, null, 'Ναι. Δεν ενημερώνεται η ομάδα σου, το HR, ο εργοδότης, το board ή οι επενδυτές. Περισσότερα στη σελίδα ', React.createElement(IA, { href: '/el/confidentiality/' }, 'Εμπιστευτικότητα'), '.') },
      ] })
    ),
    React.createElement(RelatedLinks, { mob, heading: 'Σχετικά θέματα', items: [
      { href: '/el/1-to-1/', label: '1:1 Συνεργασία →' },
      { href: '/el/burnout/', label: 'Burnout →' },
      { href: '/el/imposter-syndrome/', label: 'Imposter Syndrome →' },
    ] })
  );
}

// ─── /el/burnout/ ────────────────────────────────────────────────────────────
function ElBurnoutPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  return React.createElement(SvcPage, null,
    React.createElement(ElRoleEyebrow, null),
    React.createElement(ElH1, { mob }, 'Πήρες άδεια, ξεκουράστηκες και γύρισες νιώθοντας ακριβώς το ίδιο'),
    React.createElement(SvcLead, null, 'Ίσως το πρόβλημα να μην είναι ο φόρτος.'),

    React.createElement(SvcSection, { title: 'Τι είναι το burnout' },
      React.createElement(SvcP, null, 'Η συνηθισμένη συμβουλή είναι να ξεκουραστείς περισσότερο, να βάλεις όρια και να διαχειριστείς το άγχος σου. Μερικές φορές αρκεί. Άλλες, παίρνεις άδεια, κοιμάσαι περισσότερο, απομακρύνεσαι για λίγο και επιστρέφεις στο ίδιο βάρος.'),
      React.createElement(SvcP, null, 'Το burnout, η επαγγελματική εξουθένωση, συνδέεται με παρατεταμένη εργασιακή πίεση που δεν έχει αντιμετωπιστεί ουσιαστικά. Εμφανίζεται ως μόνιμη εξάντληση, αποστασιοποίηση από τη δουλειά, ευερεθιστότητα, δυσκολία συγκέντρωσης ή η αίσθηση ότι δεν έχεις πια τίποτα να δώσεις.'),
      React.createElement(SvcP, null, 'Είναι μια κατάσταση όπου η πίεση έχει γίνει ο κανονικοποιημένος τρόπος λειτουργίας σου, πέρα από μια απλή δύσκολη περίοδο.')
    ),

    React.createElement(SvcSection, { title: 'Τι το συντηρεί' },
      React.createElement(SvcP, null, 'Το burnout σπάνια οφείλεται σε έναν μόνο παράγοντα. Μπορεί να υπάρχει υπερβολικός φόρτος, αβεβαιότητα, έλλειψη ελέγχου ή μια δουλειά που απαιτεί περισσότερα από όσα μπορείς πλέον να δώσεις. Συχνά, όμως, υπάρχει και κάτι βαθύτερο:'),
      React.createElement(Bullets, { mob, items: [
        'η ανάγκη να αποδεικνύεις συνεχώς την αξία σου',
        'η δυσκολία να απογοητεύσεις τους άλλους',
        'η αίσθηση ότι όλα εξαρτώνται από εσένα',
        'η αδυναμία να σταματήσεις χωρίς ενοχές',
        'η ταύτιση της αξίας σου με την απόδοση',
      ] }),
      React.createElement(SvcP, null, 'Όταν αυτά συνδυάζονται με πραγματική επαγγελματική πίεση, η ξεκούραση ανακουφίζει προσωρινά αλλά δεν αλλάζει αυτό που σε επιστρέφει στην ίδια κατάσταση.')
    ),

    React.createElement(SvcSection, { title: 'Πώς δουλεύουμε' },
      React.createElement(SvcP, null, 'Ξεκινάμε από την πραγματική συνθήκη της δουλειάς σου: τι άλλαξε, πότε άρχισε να γίνεται επίπονο, τι απαιτεί αντικειμενικά ο ρόλος, ποια κομμάτια της πίεσης προέρχονται από το περιβάλλον και ποια συνδέονται με τον τρόπο που έχεις μάθει να λειτουργείς.'),
      React.createElement(SvcP, null, React.createElement(Strong, null, 'Κάποιες φορές το ζητούμενο είναι μια business αλλαγή· άλλες, μια πιο βαθιά δουλειά· συχνά, και τα δύο.'), ' Στόχος είναι να λειτουργείς με λιγότερο προσωπικό κόστος και να δεις καθαρά τι χρειάζεται πραγματικά να αλλάξει, αντί να προσπαθείς να αντέξεις περισσότερο μια κατάσταση που σου κάνει κακό.')
    ),

    React.createElement(SvcSection, { title: 'Δες πού βρίσκεσαι' },
      React.createElement(SvcP, null, React.createElement(React.Fragment, null,
        'Δεν είναι πάντα εύκολο να ξεχωρίσεις αν αυτό που περνάς είναι burnout, προσωρινή εξάντληση ή ένδειξη ότι η δουλειά σου δεν σου ταιριάζει πια. Το ',
        React.createElement(IA, { href: '/el/startingdiagnostic/' }, 'Starting Diagnostic'),
        ' είναι ένα σύντομο, δωρεάν εργαλείο αυτοαξιολόγησης που θα σε βοηθήσει να δεις πιο καθαρά τι συμβαίνει.')),
      React.createElement(CtaRow, { lang: 'el', mob, primaryTo: 'diagnostic', primaryLabel: 'Ξεκίνα το Starting Diagnostic', secondaryTo: 'book' })
    ),

    React.createElement(SvcSection, { title: 'Συχνές ερωτήσεις' },
      React.createElement(SvcFaq, { items: [
        { q: 'Πώς ξεχωρίζει το burnout από την απλή κούραση;', a: 'Η κούραση υποχωρεί όταν ξεκουραστείς πραγματικά. Στο burnout, η ξεκούραση βοηθά προσωρινά αλλά το βάρος επιστρέφει σχεδόν αμέσως, μαζί με αποστασιοποίηση και απώλεια νοήματος.' },
        { q: 'Γιατί η άδεια ή οι διακοπές δεν αρκούν;', a: 'Επειδή η ξεκούραση αντιμετωπίζει την εξάντληση, όχι ό,τι τη δημιουργεί. Αν επιστρέψεις στον ίδιο φόρτο, στην ίδια αίσθηση ευθύνης και στον ίδιο τρόπο λειτουργίας, είναι πιθανό να επιστρέψει και το burnout.' },
        { q: 'Πότε αξίζει να ζητήσω υποστήριξη;', a: 'Όταν η εξάντληση επιμένει και επηρεάζει τον ύπνο, τις σχέσεις ή τη συγκέντρωσή σου, ή όταν έχεις ήδη δοκιμάσει ξεκούραση και όρια αλλά επιστρέφεις σταθερά στην ίδια κατάσταση. Δεν χρειάζεται να περιμένεις μέχρι να μη μπορείς πλέον να δουλέψεις.' },
      ] })
    ),
    React.createElement(RelatedLinks, { mob, heading: 'Σχετικά θέματα', items: [
      { href: '/el/1-to-1/', label: '1:1 Συνεργασία →' },
      { href: '/el/executive-coaching/', label: 'Executive Coaching →' },
      { href: '/el/career-coaching/', label: 'Career Coaching →' },
    ] })
  );
}

// ─── /el/career-coaching/ ────────────────────────────────────────────────────
function ElCareerCoachingPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  return React.createElement(SvcPage, null,
    React.createElement(ElRoleEyebrow, null),
    React.createElement(ElH1, { mob }, 'Το επόμενο επαγγελματικό βήμα μπορεί να είναι το εύκολο. Το δύσκολο είναι να προσπεράσεις τους φόβους της αλλαγής'),

    React.createElement(SvcSection, { title: 'Η πραγματική μετάβαση' },
      React.createElement(SvcP, null, 'Μπορεί να έχεις περάσει χρόνια χτίζοντας μια καριέρα που σήμερα δεν σε εκφράζει πια. Ίσως σκέφτεσαι να φύγεις, να αλλάξεις κλάδο, να επιστρέψεις στην Ελλάδα, να μετακομίσεις στο εξωτερικό ή να αρχίσεις να δουλεύεις για τον εαυτό σου.'),
      React.createElement(SvcP, null, 'Συχνά το πρακτικό μέρος είναι το πιο απλό: ποιες επιλογές υπάρχουν, πόσα χρήματα χρειάζεσαι, τι δεξιότητες έχεις, ποιο είναι το ρίσκο, ποια βήματα πρέπει να γίνουν.'),
      React.createElement(SvcP, null, 'Το δύσκολο είναι να καταλάβεις τι πραγματικά θέλεις και γιατί, παρότι σκέφτεσαι την αλλαγή εδώ και καιρό, παραμένεις στο ίδιο σημείο.')
    ),

    React.createElement(SvcSection, { title: 'Γιατί είναι τόσο δύσκολη' },
      React.createElement(SvcP, null, 'Η καριέρα σου συχνά συνδέεται με τον τρόπο που βλέπεις τον εαυτό σου και σε βλέπουν οι άλλοι. Μπορεί να αντιπροσωπεύει ασφάλεια, κύρος, οικονομική ανεξαρτησία, αναγνώριση ή χρόνια προσπάθειας που δεν θέλεις να θεωρήσεις χαμένα.'),
      React.createElement(SvcP, null, 'Γι’ αυτό μια αλλαγή αγγίζει πολύ περισσότερα από την επόμενη δουλειά. Ακόμη και όταν είναι σωστή, μπορεί να συνοδεύεται από φόβο, αμφιβολία και πραγματικό πένθος για ό,τι τελειώνει.')
    ),

    React.createElement(SvcSection, { title: 'Πώς δουλεύουμε' },
      React.createElement(SvcP, null, 'Δεν ξεκινάμε με την υπόθεση ότι πρέπει οπωσδήποτε να αλλάξεις καριέρα. Ξεκινάμε εξετάζοντας τι δεν λειτουργεί σήμερα, τι έχεις ήδη δοκιμάσει, τι φοβάσαι ότι θα χάσεις, τι θέλεις πραγματικά να αλλάξει και ποιο κόστος είσαι διατεθειμένος να αναλάβεις.'),
      React.createElement(SvcP, null, React.createElement(Strong, null, 'Δουλεύουμε και το πρακτικό μέρος της απόφασης και ό,τι την κάνει δύσκολη ψυχολογικά.'), ' Στόχος είναι να πάρεις μια απόφαση που καταλαβαίνεις, αντέχεις και μπορείς να υποστηρίξεις στην πράξη, όχι να σε πείσω να φύγεις ή να μείνεις.')
    ),

    React.createElement(SvcSection, { title: 'Γιατί μπορώ να καταλάβω αυτή τη μετάβαση' },
      React.createElement(SvcP, null, 'Έχω περάσει 18+ χρόνια στην τεχνολογία, το product και το growth. Έχτισα δικές μου εταιρείες, δούλεψα σε startups και μεγάλους οργανισμούς και βρέθηκα ο ίδιος μπροστά σε αποφάσεις που ξεπερνούσαν το καθαρά επαγγελματικό.'),
      React.createElement(SvcP, null, 'Παράλληλα είμαι ψυχοθεραπευτής, με MSc Integrative Counselling & Psychotherapy και εγγραφή στο BACP. Δεν χρειάζεται να διαλέξουμε ανάμεσα σε στρατηγική και αυτογνωσία: μια σοβαρή αλλαγή καριέρας χρειάζεται συνήθως και τα δύο.')
    ),

    React.createElement(SvcSection, { title: 'Δεν ξέρεις αν φταίει η καριέρα ή το burnout;' },
      React.createElement(SvcP, null, React.createElement(React.Fragment, null,
        'Μερικές φορές η επιθυμία να φύγεις σημαίνει ότι η καριέρα σου δεν σου ταιριάζει πια. Άλλες, ότι έχεις εξαντληθεί τόσο ώστε τίποτα να μη φαίνεται βιώσιμο. Το ',
        React.createElement(IA, { href: '/el/startingdiagnostic/' }, 'Starting Diagnostic'),
        ' μπορεί να σε βοηθήσει να ξεχωρίσεις τι από τα δύο συμβαίνει.')),
      React.createElement(CtaRow, { lang: 'el', mob })
    ),

    React.createElement(SvcSection, { title: 'Συχνές ερωτήσεις' },
      React.createElement(SvcFaq, { items: [
        { q: 'Σκέφτομαι να αλλάξω καριέρα αλλά δεν μπορώ να αποφασίσω. Μπορείς να βοηθήσεις;', a: 'Ναι. Δεν χρειάζεται να έχεις ήδη αποφασίσει ότι θα φύγεις. Δουλεύουμε να καταλάβουμε τι ακριβώς δεν λειτουργεί, τι περιμένεις από μια αλλαγή και ποιο μέρος της αμφιβολίας σου είναι χρήσιμη προσοχή και ποιο φόβος που σε κρατά ακίνητο.' },
        { q: 'Σε τι διαφέρει από έναν κλασικό σύμβουλο καριέρας;', a: 'Ένας κλασικός σύμβουλος καριέρας εστιάζει στις δεξιότητες, το βιογραφικό και την αγορά εργασίας. Δουλεύουμε κι αυτά όταν χρειάζεται, αλλά το κέντρο είναι η ίδια η απόφαση: γιατί δεν μπορείς να δεσμευτείς, τι φοβάσαι ότι θα χάσεις και τι θα χρειαστεί για να στηρίξεις μια αλλαγή στην πράξη.' },
        { q: 'Απολύθηκα και νιώθω χαμένος. Είναι φυσιολογικό;', a: 'Ναι. Μια απόλυση, ειδικά ύστερα από χρόνια σε έναν ρόλο, επηρεάζει την αυτοπεποίθηση, την ταυτότητα και την καθημερινή δομή, πέρα από το εισόδημα. Πριν πιεστείς να βρεις αμέσως «το επόμενο», μπορεί να χρειάζεται να καταλάβεις τι ακριβώς τελείωσε και τι δεν θέλεις να επαναλάβεις.' },
      ] })
    ),
    React.createElement(RelatedLinks, { mob, heading: 'Σχετικά θέματα', items: [
      { href: '/el/1-to-1/', label: '1:1 Συνεργασία →' },
      { href: '/el/burnout/', label: 'Burnout →' },
      { href: '/el/executive-coaching/', label: 'Executive Coaching →' },
    ] })
  );
}

// ─── /el/imposter-syndrome/ ──────────────────────────────────────────────────
function ElImposterPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle } : widePageStyle;
  return React.createElement(SvcPage, null,
    React.createElement(ElRoleEyebrow, null),
    React.createElement(ElH1, { mob }, 'Imposter Syndrome: βλέπεις ότι τα καταφέρνεις. Απλώς δεν το πιστεύεις πραγματικά'),
    React.createElement(SvcLead, null, 'Η εμπειρία, οι ικανότητες και οι επιτυχίες σου είναι πραγματικές. Το ίδιο πραγματική είναι και η επίμονη αίσθηση ότι δεν αξίζεις τη θέση σου.'),

    React.createElement(SvcSection, { title: 'Το μοτίβο' },
      React.createElement(SvcP, null, 'Οι αποδείξεις υπάρχουν: αποτελέσματα, εμπειρία, θετικό feedback, άνθρωποι που σε εμπιστεύονται. Παρ’ όλα αυτά, η αμφιβολία δεν υποχωρεί. Κάθε επιτυχία προσφέρει προσωρινή ανακούφιση και πολύ γρήγορα ο πήχης ανεβαίνει ξανά.'),
      React.createElement(SvcP, null, 'Αντί να χτίζει σταδιακά την αυτοπεποίθησή σου, η επιτυχία μετατρέπεται σε άλλη μία απόδειξη που πρέπει να επαναλάβεις. Οι αποδείξεις υπάρχουν· απλώς καμία δεν μένει απόδειξη για πολύ.')
    ),

    React.createElement(SvcSection, { title: 'Συνηθισμένα σημάδια' },
      React.createElement(Bullets, { mob, items: [
        'φόβος ότι κάποια στιγμή θα «αποκαλυφθείς»',
        'δυσκολία να αναγνωρίσεις πραγματικά την επιτυχία σου',
        'απόδοση των επιτυχιών στην τύχη ή στη βοήθεια άλλων',
        'υπερπροετοιμασία για να μην αφήσεις περιθώριο λάθους',
        'τελειομανία και σύγκριση με ανθρώπους που θεωρείς πιο ικανούς',
        'έντονη αμφιβολία μετά από μια προαγωγή ή μεγαλύτερη ευθύνη',
      ] }),
      React.createElement(SvcP, null, 'Η αμφιβολία μπορεί να είναι αληθινή ως συναίσθημα. Δεν σημαίνει ότι είναι ακριβής ως αξιολόγηση της ικανότητάς σου.')
    ),

    React.createElement(SvcSection, { title: 'Πώς το δουλεύουμε' },
      React.createElement(SvcP, null, 'Δεν προσπαθώ να σε πείσω ότι είσαι αρκετά καλός, και πιθανότατα το έχεις ακούσει πολλές φορές. Η διαβεβαίωση ανακουφίζει προσωρινά, χωρίς να αλλάζει τον μηχανισμό που παράγει ξανά την αμφιβολία.'),
      React.createElement(SvcP, null, React.createElement(Strong, null, 'Το δουλεύουμε μέσα στο πραγματικό επαγγελματικό πλαίσιο, όχι αποκομμένο από τη δουλειά και την καριέρα σου.'), ' Εξετάζουμε πότε εμφανίζεται πιο έντονα, τι σημαίνει για εσένα ένα λάθος, γιατί η αξία σου εξαρτάται τόσο από την απόδοση και τι σε αναγκάζει να αποδεικνύεις ξανά κάτι που έχει ήδη αποδειχθεί. Στόχος είναι να μη χρειάζεται να κερδίζεις διαρκώς το δικαίωμα να βρίσκεσαι εκεί που ήδη είσαι, όχι να εξαφανιστεί κάθε αμφιβολία.')
    ),

    React.createElement(SvcSection, { title: 'Πού συνδέεται' },
      React.createElement(SvcP, null, React.createElement(React.Fragment, null,
        'Το Imposter Syndrome σπάνια λειτουργεί μόνο του. Συχνά συνδέεται με το ',
        React.createElement(IA, { href: '/el/executive-coaching/' }, 'Executive Coaching'),
        ', όταν εντείνεται ύστερα από προαγωγή· με το ',
        React.createElement(IA, { href: '/el/burnout/' }, 'burnout'),
        ', όταν η ανάγκη να μην αποτύχεις οδηγεί σε υπερβολική δουλειά· και με το ',
        React.createElement(IA, { href: '/el/career-coaching/' }, 'Career Coaching'),
        ', όταν η αμφιβολία σε εμποδίζει να διεκδικήσεις ή να αλλάξεις κατεύθυνση.')),
      React.createElement(CtaRow, { lang: 'el', mob })
    ),

    React.createElement(SvcSection, { title: 'Συχνές ερωτήσεις' },
      React.createElement(SvcFaq, { items: [
        { q: 'Είναι το Imposter Syndrome πραγματική διάγνωση;', a: 'Όχι. Ο όρος περιγράφει ένα επαναλαμβανόμενο μοτίβο αμφιβολίας, όχι μια κλινική διάγνωση: έχεις αντικειμενικές αποδείξεις ικανότητας, αλλά δυσκολεύεσαι να τις εσωτερικεύσεις. Παρότι δεν είναι διάγνωση, επηρεάζει ουσιαστικά τον τρόπο που εργάζεσαι και αποφασίζεις.' },
        { q: 'Γιατί εμφανίζεται συχνά σε ανθρώπους με υψηλές επιδόσεις;', a: 'Επειδή για πολλούς η επίδοση έχει γίνει ο τρόπος με τον οποίο κερδίζουν ασφάλεια και αποδοχή. Όταν η αξία σου έχει δεθεί με το να τα καταφέρνεις, κάθε επιτυχία δημιουργεί και την υποχρέωση να το αποδείξεις ξανά.' },
        { q: 'Ξέρω λογικά ότι είμαι καλός. Γιατί νιώθω ακόμα απατεώνας;', a: 'Επειδή η λογική αναγνώριση και η συναισθηματική πεποίθηση δεν είναι το ίδιο. Τα κομπλιμέντα και οι αποδείξεις απαντούν στη λογική αμφιβολία, όχι στον μηχανισμό που τη δημιουργεί.' },
      ] })
    ),
    React.createElement(RelatedLinks, { mob, heading: 'Σχετικά θέματα', items: [
      { href: '/el/1-to-1/', label: '1:1 Συνεργασία →' },
      { href: '/el/executive-coaching/', label: 'Executive Coaching →' },
      { href: '/el/burnout/', label: 'Burnout →' },
    ] })
  );
}

// ─── APP MOUNT (bilingual, central) ──────────────────────────────────────────
// Every core index.html calls renderApp(pageId, lang). Legacy/SEO pages still
// use SpecialtyPage via their own inline scripts.
const CORE_PAGES = {
  'home': HomePage,
  'one-to-one': OneToOnePage,
  'about': AboutPage,
  'reviews': ReviewsPage,
  'book': BookPage,
  'confidentiality': ConfidentialityPage,
};
// Greek-only SEO landing pages — mounted via renderApp('el-…', 'el') so they get
// the current Greek sidebar/footer. Unpaired (no English equivalent, no hreflang).
const EL_SEO_PAGES = {
  'el-executive-coaching': ElExecutiveCoachingPage,
  'el-burnout': ElBurnoutPage,
  'el-career-coaching': ElCareerCoachingPage,
  'el-imposter-syndrome': ElImposterPage,
};
function CoreApp({ pageId, lang }) {
  // Redesigned pages (core-pages-v2.js) receive the production copy as props so
  // no wording is duplicated outside this file.
  const V2 = {
    home: window.HomePageV2,
    about: window.AboutPageV2,
    reviews: window.ReviewsPageV2,
  }[pageId];
  if (V2) {
    return React.createElement(V2, {
      lang: lang,
      copy: {
        home: HOME[lang] || HOME.en,
        about: ABOUT[lang] || ABOUT.en,
        reviews: REVIEWS[lang] || REVIEWS.en,
        reviewItems: REVIEWS_ITEMS,
        ui: tUI(lang),
      },
    });
  }
  // Every other indexed route keeps its existing content and gets the shared
  // chrome + universal reading typography. Form/embed pages use the centred
  // form container so third-party internals are untouched.
  const Page = CORE_PAGES[pageId] || EL_SEO_PAGES[pageId] || HomePage;
  const FORM_PAGES = ['book', 'diagnostic', 'startingdiagnostic'];
  return React.createElement(window.LegacyShell, {
    page: pageId, lang: lang, form: FORM_PAGES.indexOf(pageId) !== -1,
  }, React.createElement(Page, { lang: lang }));
}
function renderApp(pageId, lang) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(CoreApp, { pageId: pageId, lang: lang || 'en' })
  );
}

Object.assign(window, { HomePage, OneToOnePage, AboutPage, ReviewsPage, BookPage, ConfidentialityPage, SpecialtyPage, CoreApp, renderApp, SiteFooter });
