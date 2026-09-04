// site-chrome.jsx — shared production chrome + universal content layout.
// Plain React, compiled by babel like sidebar.jsx / content-pages.jsx.
// Loaded BEFORE content-pages.js. Exposes on window:
//   SITE, CHROME_PATHS, EXTERNAL, cPath, cT, BrandIcon, ChromeStyles,
//   SiteHeader, SiteFooterX, BlackCtaStrip, UniversalContentLayout, LegacyShell
//
// One green across the whole site: #059669.

const SITE = {
  green: '#059669',
  ink: '#1A1C1D',
  ink2: '#282726',
  heroInk: '#111315',
  paper: '#F3F0E8',
  black: '#050505',
  white: '#FFFFFF',
  onDark: '#C2C6CA',
  greyOnDark: '#9DA19E',
  meta: '#5E6264',
  rule: 'rgba(24,26,28,0.20)',
  ruleOnDark: 'rgba(255,255,255,0.16)',
  // Type roles map onto global CSS custom properties (defined in :root below and
  // in the core-shell <head>). display = heading face (Inter Tight); archivo =
  // display face (Archivo Black EN / Inter Tight 800 EL); body = Inter.
  display: 'var(--font-heading)',
  body: 'var(--font-body)',
  archivo: 'var(--font-display)',
};

// Bilingual route map — mirrors CORE_PATHS in content-pages.jsx.
const CHROME_PATHS = {
  'home':            { en: '/',                    el: '/el/' },
  'one-to-one':      { en: '/1-to-1/',             el: '/el/1-to-1/' },
  'about':           { en: '/about/',              el: '/el/about/' },
  'reviews':         { en: '/reviews/',            el: '/el/reviews/' },
  'book':            { en: '/book/',               el: '/el/book/' },
  'diagnostic':      { en: '/startingdiagnostic/', el: '/el/startingdiagnostic/' },
  'confidentiality': { en: '/confidentiality/',    el: '/el/confidentiality/' },
  'blog':            { en: '/blog/',               el: '/blog/' },
  'ask-me-anything': { en: '/ask-me-anything/',    el: '/ask-me-anything/el' },
};
function cPath(id, lang) {
  const p = CHROME_PATHS[id];
  if (!p) return lang === 'el' ? '/el/' : '/';
  return p[lang] || p.en;
}

const EXTERNAL = {
  undisguised: 'https://www.undisguised.io/',
  linkedin: 'https://linkedin.com/in/growth-product-manager/',
  youtube: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
  instagram: 'https://www.instagram.com/_aggelosmouzakitis_/',
  tiktok: 'https://www.tiktok.com/@aggelosmouz',
};
const ext = { target: '_blank', rel: 'noopener noreferrer' };

const CHROME_T = {
  en: {
    home: 'Home', why: 'About me', reviews: 'Reviews', apply: 'Apply',
    start: 'START HERE', other: 'ΕΛΛΗΝΙΚΑ',
    role1: 'Private business & career advisor', role2: 'BACP-registered psychotherapist',
    navigate: 'NAVIGATE', content: 'CONTENT', follow: 'FOLLOW', articles: 'Articles', askAnon: 'Ask anonymously',
    confidentiality: 'Confidentiality', terms: 'Terms', privacy: 'Privacy',
    ctaHeading: 'If working harder was going to fix this, it probably would have by now.',
    ctaBtn: 'Apply for a working session', menu: 'Menu', rights: 'All rights reserved.',
  },
  el: {
    home: 'Αρχική', why: 'Ποιος είμαι', reviews: 'Κριτικές', apply: 'Ζήτησε γνωριμία',
    start: 'ΞΕΚΙΝΑ ΕΔΩ', other: 'English',
    role1: 'Σύμβουλος επιχειρήσεων & καριέρας', role2: 'Ψυχοθεραπευτής',
    navigate: 'ΠΛΟΗΓΗΣΗ', content: 'ΠΕΡΙΕΧΟΜΕΝΟ', follow: 'ΑΚΟΛΟΥΘΗΣΕ', articles: 'Κείμενα', askAnon: 'Ρώτησε ανώνυμα',
    confidentiality: 'Εμπιστευτικότητα', terms: 'Όροι χρήσης', privacy: 'Πολιτική απορρήτου',
    ctaHeading: 'Αν λυνόταν με περισσότερη δουλειά, μάλλον θα είχε λυθεί ήδη.',
    ctaBtn: 'Ζήτησε μια πρώτη συνάντηση', menu: 'Μενού', rights: 'Με επιφύλαξη παντός δικαιώματος.',
  },
};
const cT = (lang) => CHROME_T[lang] || CHROME_T.en;

// ─── Stylesheet ──────────────────────────────────────────────────────────────
// The legacy page shell (scripts/gen-core-pages.js) still ships the sidebar-era
// rules: html,body,#root{height:100%}, #root{display:flex}, #main-scroll{overflow-y:auto}
// and its old accent link colour. Rather than rewrite that generator's CSS,
// the first block below neutralises those rules with equal-or-higher specificity.
const CHROME_CSS = `
:root{
  --font-body:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-heading:"Inter Tight","Inter",system-ui,sans-serif;
  --font-display:"Archivo Black","Inter Tight","Inter",system-ui,sans-serif;
  --brand-green:${SITE.green};
}
html,body,#root{height:auto}
#root{display:block;overflow:visible}
#sidebar{display:none!important}
#main-scroll{overflow:visible;background:${SITE.ink};color:${SITE.white}}
#main-scroll::-webkit-scrollbar{width:0}
body{background:${SITE.ink};color:${SITE.white};font-family:${SITE.body};font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
::selection{background:${SITE.green};color:#fff}
#main-scroll a,a{color:inherit;text-decoration:none}
#main-scroll strong{border:0;padding:0;color:inherit;font-weight:600}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid ${SITE.green};outline-offset:2px;border-radius:2px}
img{max-width:100%}

.site-container{width:min(1320px,calc(100% - 2 * clamp(20px,5vw,68px)));margin-inline:auto}

.site-hdr{width:100%;min-height:76px;background:${SITE.ink};border-bottom:1px solid rgba(243,240,232,0.16)}
.site-hdr__in{width:min(100% - 64px,1280px);min-height:76px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:22px}
.site-hdr__brand{display:inline-flex;align-items:flex-end;gap:1px;color:${SITE.paper};font-family:${SITE.display};font-size:26px;font-weight:750;line-height:1;letter-spacing:-0.035em;white-space:nowrap}
.site-hdr__brand span{color:${SITE.green}}
.site-hdr__nav{display:flex;align-items:center;justify-content:center;gap:30px}
.site-hdr__nav a{color:${SITE.paper};font-size:15px;font-weight:650;line-height:1;text-transform:uppercase;letter-spacing:0.04em;opacity:.82;padding-bottom:2px;border-bottom:2px solid transparent;transition:opacity .18s}
.site-hdr__nav a:hover{opacity:1}
.site-hdr__nav a[aria-current]{opacity:1;border-bottom-color:${SITE.green}}
.site-hdr__end{display:flex;align-items:center;gap:14px}
.site-hdr__lang{color:${SITE.paper};font-size:13px;font-weight:700;line-height:1;text-transform:uppercase;letter-spacing:0.045em;opacity:.82;transition:opacity .18s}
.site-hdr__lang:hover{opacity:1}
.hdr-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;background:${SITE.green};color:#fff;font-size:14px;font-weight:750;line-height:1;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;border-radius:0;transition:filter .18s,gap .18s}
.hdr-cta:hover{filter:brightness(0.9);gap:11px}
.site-hdr__burger{display:none;width:44px;height:44px;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:none;border:0;cursor:pointer}
.site-hdr__burger span{display:block;width:24px;height:2px;background:${SITE.paper}}
.site-menu{background:${SITE.ink};border-bottom:1px solid rgba(243,240,232,0.16);padding-block:20px 28px}
.site-menu .site-container{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.site-menu a{color:${SITE.paper};font-size:16px;text-transform:uppercase;letter-spacing:0.03em}
.site-menu .hdr-cta{align-self:stretch;justify-content:center;min-height:48px;font-size:13px}

.pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;font-weight:700;white-space:nowrap;transition:gap .18s,filter .18s}
.pill--green{height:72px;padding-inline:44px;background:${SITE.green};color:#fff;font-size:16px}
.pill--green:hover{gap:12px;filter:brightness(0.9)}
.hero-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:55px;padding:0 24px;background:${SITE.green};color:#fff;font-size:16px;font-weight:600;letter-spacing:0.01em;white-space:nowrap;border-radius:0;transition:filter .18s,gap .18s}
.hero-cta:hover{filter:brightness(0.9);gap:13px}

.cta-strip{padding-block:clamp(86px,10.8vw,132px);text-align:center;background:${SITE.ink}}
.cta-strip__h{margin:0 auto;max-width:20ch;font-family:${SITE.display};font-synthesis:none;font-size:clamp(36px,4.4vw,60px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:#fff;text-wrap:balance}
.cta-strip .pill--green{margin-top:44px}
.cta-strip__sub{display:inline-flex;gap:8px;margin-top:24px;font-size:15px;color:${SITE.onDark};transition:gap .18s,color .18s}
.cta-strip__sub:hover{gap:12px;color:#fff}

.site-ftr{border-top:2px solid ${SITE.green};padding-block:64px 32px;background:${SITE.ink}}
.site-ftr__cols{display:grid;grid-template-columns:minmax(280px,1.4fr) repeat(3,minmax(130px,0.55fr));gap:48px;align-items:start}
.site-ftr__head{font-size:12px;font-weight:700;letter-spacing:0.12em;color:${SITE.green};margin-bottom:20px}
.site-ftr nav a{display:flex;align-items:center;gap:10px;font-size:15px;line-height:1.4;margin-bottom:12px;transition:color .18s}
.site-ftr nav a:hover{color:${SITE.onDark}}
.site-ftr__roles{margin-top:20px;font-size:15px;line-height:1.4;color:${SITE.onDark}}
.site-ftr__rule{height:1px;background:${SITE.ruleOnDark};margin-block:48px 24px}
.site-ftr__legal{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;font-size:13px;color:${SITE.onDark}}
.site-ftr__legal nav{display:flex;flex-wrap:wrap;gap:12px 24px}
.site-ftr__legal nav a{display:inline;margin:0}

.u-hero{background:${SITE.white};padding-block:106px 86px}
.u-hero h1{margin:0;max-width:15ch;font-family:${SITE.display};font-synthesis:none;font-size:clamp(52px,5.8vw,82px);font-weight:800;line-height:0.96;letter-spacing:-0.05em;color:${SITE.ink}}
.u-hero p{max-width:65ch;margin:32px 0 0;font-size:21px;line-height:1.55;color:${SITE.ink2}}
.u-main{background:${SITE.white};padding-block:0 115px;color:${SITE.ink}}

/* ── Shared inner-page shell: asymmetrical editorial grid (rail | reading column | gutter) ── */
.u-shell{max-width:1180px;margin-inline:auto;padding-inline:clamp(24px,5vw,72px);display:grid;grid-template-columns:minmax(120px,170px) minmax(0,760px) minmax(0,1fr);column-gap:clamp(28px,4vw,64px)}
.u-shell--wide{grid-template-columns:minmax(120px,170px) minmax(0,860px) minmax(0,1fr)}
.u-shell__rail{grid-column:1;min-width:0}
.u-shell__rail::before{content:"";display:block;width:100%;height:3px;background:var(--brand-green,${SITE.green})}
.u-shell__rail .u-eyebrow{display:block;margin-top:16px;font-family:${SITE.body};font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.10em;text-transform:uppercase;color:${SITE.green}}
.u-shell__body{grid-column:2;min-width:0}
.u-shell__gutter{grid-column:3}

.u-read,.u-shell__body{font-size:19px;line-height:1.72;color:${SITE.ink}}
.u-read{width:min(740px,calc(100% - 40px));margin-inline:auto}
.u-read h1,.u-shell__body h1{font-family:${SITE.display};font-synthesis:none;font-size:clamp(48px,5vw,64px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;margin:0 0 32px}
.u-read h2,.u-shell__body h2{margin:80px 0 24px;font-family:${SITE.display};font-synthesis:none;font-size:clamp(32px,3.6vw,46px);font-weight:800;line-height:1.04;letter-spacing:-0.04em}
.u-read h3,.u-shell__body h3{margin:48px 0 16px;font-family:${SITE.display};font-synthesis:none;font-size:clamp(24px,2.8vw,32px);font-weight:750;line-height:1.1;letter-spacing:-0.03em}
.u-read p + p,.u-shell__body p + p{margin-top:24px}
.u-read ul,.u-read ol,.u-shell__body ul,.u-shell__body ol{margin:24px 0;padding-left:24px}
.u-read li + li,.u-shell__body li + li{margin-top:12px}
#main-scroll .u-read a,.u-read a,.u-shell__body a{color:${SITE.green};text-decoration:underline;text-underline-offset:3px}
.u-read blockquote,.u-shell__body blockquote{margin:48px 0;padding-left:28px;border-left:4px solid ${SITE.green};font-family:${SITE.display};font-size:28px;line-height:1.3}
.u-read hr,.u-shell__body hr{border:0;border-top:1px solid ${SITE.green};opacity:.45;margin:64px 0}
.u-read img,.u-shell__body img{display:block;height:auto;margin:48px 0}
.u-form{width:min(760px,calc(100% - 40px));margin-inline:auto}

/* One shared branded callout for deeper pages (dark band, warm text, green rule) */
.u-callout{margin:40px 0;padding:26px 30px;background:${SITE.ink};color:${SITE.paper};border-left:3px solid ${SITE.green};border-radius:2px}
.u-callout :is(p,li){color:${SITE.paper}}
.u-callout > *:first-child{margin-top:0}
.u-callout > *:last-child{margin-bottom:0}

.u-faq details{border-top:1px solid ${SITE.rule};padding:20px 0}
.u-faq details:last-of-type{border-bottom:1px solid ${SITE.rule}}
.u-faq summary{display:flex;justify-content:space-between;align-items:baseline;gap:24px;cursor:pointer;list-style:none;font-weight:600;font-size:20px;line-height:1.4}
.u-faq summary::-webkit-details-marker{display:none}
.u-faq summary::after{content:"+";color:${SITE.green};font-size:26px;line-height:1;flex-shrink:0}
.u-faq details[open] summary::after{content:"\\2212"}
.u-faq details > *:not(summary){margin-top:16px}
.u-faq--dark details{border-color:${SITE.ruleOnDark}}
.u-faq--dark summary{color:#fff}
.u-faq--dark details > *:not(summary){color:${SITE.onDark}}

.u-related a{display:flex;justify-content:space-between;gap:24px;padding:20px 0;border-top:1px solid ${SITE.rule};color:${SITE.ink}}
.u-related a:last-child{border-bottom:1px solid ${SITE.rule}}
.u-related a:hover{color:${SITE.green}}

.u-notice{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;padding:24px 0;border-top:1px solid ${SITE.rule};border-bottom:1px solid ${SITE.rule};margin-bottom:56px}
.u-notice p{margin:0;font-size:19px;line-height:1.5;max-width:52ch}
.u-notice a{font-weight:700;font-size:14px;letter-spacing:0.06em;color:${SITE.green}}

@media (max-width:960px){.site-ftr__cols{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:680px){
  .site-hdr,.site-hdr__in{min-height:68px}
  .site-hdr__brand{font-size:23px}
  .site-hdr__nav,.site-hdr__lang,.site-hdr__end{display:none}
  .site-hdr__burger{display:flex}
}
@media (max-width:900px){
  .u-shell,.u-shell--wide{grid-template-columns:1fr;column-gap:0}
  .u-shell__rail{grid-column:1;margin-bottom:20px}
  .u-shell__rail::before{width:56px}
  .u-shell__rail .u-eyebrow{margin-top:12px}
  .u-shell__body{grid-column:1}
  .u-shell__gutter{display:none}
}
@media (max-width:640px){
  .site-ftr__cols{grid-template-columns:1fr;gap:40px}
  .site-ftr__legal{flex-direction:column;align-items:flex-start;gap:20px}
  .u-hero{padding-block:67px 58px}
  .u-read,.u-shell__body{font-size:18px}
  .u-read h2,.u-shell__body h2{margin-top:56px}
}
@media (max-width:680px){
  .pill--green{max-width:100%;padding-inline:clamp(22px,6.5vw,44px);font-size:clamp(15px,2.35vw,16px)}
}
@media (max-width:520px){
  .cta-strip__h{font-size:clamp(28px,6.9vw,36px)}
}
@media (max-width:420px){
  .hero-cta{padding-inline:16px}
}
@media (max-width:360px){
  .hero-cta{max-width:100%;padding-inline:16px;gap:8px}
  html[lang="el"] .hero-cta{font-size:14px}
}
@media (prefers-reduced-motion: reduce){*{transition-duration:.001ms!important;animation-duration:.001ms!important}}
@media print{#sidebar{display:none!important}.site-hdr,.site-ftr,.cta-strip{display:none!important}}
`;

function ChromeStyles() {
  return React.createElement('style', { dangerouslySetInnerHTML: { __html: CHROME_CSS } });
}

// ─── Brand icons (monochrome, currentColor) ──────────────────────────────────
const BRAND_PATHS = {
  LinkedIn: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z',
  Instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 7.85a4.15 4.15 0 1 0 0 8.3 4.15 4.15 0 0 0 0-8.3zm0 6.85a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.28-7.01a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z',
  YouTube: 'M23.5 6.51a3.02 3.02 0 0 0-2.12-2.14C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.51C0 8.4 0 12 0 12s0 3.6.5 5.49a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.49zM9.55 15.57V8.43L15.82 12l-6.27 3.57z',
  TikTok: 'M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .8-5.05V9.7a5.7 5.7 0 0 0-.8-.06 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48z',
};
function BrandIcon({ name, size }) {
  const s = size || 16;
  return React.createElement('svg', {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true',
    style: { flexShrink: 0 },
  }, React.createElement('path', { d: BRAND_PATHS[name] }));
}

function Wordmark({ lang }) {
  return React.createElement('a', { className: 'site-hdr__brand', href: cPath('home', lang), 'aria-label': 'Aggelos Mouzakitis' },
    'Aggelos', React.createElement('span', null, '.')
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function SiteHeader({ page, lang = 'en' }) {
  const [open, setOpen] = React.useState(false);
  const t = cT(lang);
  const other = lang === 'el' ? 'en' : 'el';
  const items = [
    { id: 'home', label: t.home },
    { id: 'about', label: t.why },
    { id: 'reviews', label: t.reviews },
  ];
  const link = (it) => React.createElement('a', {
    key: it.id, href: cPath(it.id, lang),
    'aria-current': page === it.id ? 'page' : undefined,
  }, it.label);
  const langHref = CHROME_PATHS[page] ? cPath(page, other) : (other === 'el' ? '/el/' : '/');
  // Header CTA routes to "ask anonymously": the AMA page (EN) / the VideoAsk form (EL).
  const ctaHref = lang === 'el' ? 'https://www.videoask.com/fuv51iuq1' : 'https://aggelosmouzakitis.com/ask-me-anything/';
  // Greek label is intentionally plain uppercase (no accents on capitals).
  const ctaLabel = lang === 'el' ? 'ΡΩΤΑ ΑΝΩΝΥΜΑ' : 'Ask anonymously';
  const ctaExt = lang === 'el' ? ext : null;
  // Keep the header CTA hidden on the diagnostic page.
  const showCta = page !== 'diagnostic';

  return React.createElement(React.Fragment, null,
    React.createElement('header', { className: 'site-hdr' },
      React.createElement('div', { className: 'site-container site-hdr__in' },
        React.createElement(Wordmark, { lang }),
        React.createElement('nav', { className: 'site-hdr__nav' }, items.map(link)),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifySelf: 'end' } },
          React.createElement('div', { className: 'site-hdr__end' },
            React.createElement('a', { className: 'site-hdr__lang', href: langHref, hrefLang: other }, t.other),
            showCta && React.createElement('a', { className: 'hdr-cta', href: ctaHref, ...ctaExt },
              React.createElement('span', null, ctaLabel), React.createElement('span', null, '→'))
          ),
          React.createElement('button', {
            className: 'site-hdr__burger', type: 'button', 'aria-label': t.menu,
            'aria-expanded': open ? 'true' : 'false', onClick: () => setOpen(!open),
          }, React.createElement('span'), React.createElement('span'), React.createElement('span'))
        )
      )
    ),
    open && React.createElement('div', { className: 'site-menu' },
      React.createElement('div', { className: 'site-container' },
        items.map(link),
        React.createElement('a', { href: langHref, hrefLang: other, style: { color: SITE.onDark } }, t.other),
        showCta && React.createElement('a', {
          className: 'hdr-cta', href: ctaHref, ...ctaExt,
        }, React.createElement('span', null, ctaLabel), React.createElement('span', null, '→'))
      )
    )
  );
}

// ─── BLACK CTA STRIP ─────────────────────────────────────────────────────────
function BlackCtaStrip({ lang = 'en', heading, label }) {
  const t = cT(lang);
  return React.createElement('section', { className: 'cta-strip' },
    React.createElement('div', { className: 'site-container' },
      React.createElement('h2', { className: 'cta-strip__h' }, heading || t.ctaHeading),
      React.createElement('div', null,
        React.createElement('a', { className: 'pill pill--green', href: cPath('diagnostic', lang) },
          React.createElement('span', null, label || t.ctaBtn), React.createElement('span', null, '→'))
      ),
      React.createElement('a', { className: 'cta-strip__sub', href: cPath('confidentiality', lang) },
        React.createElement('span', null, t.confidentiality), React.createElement('span', null, '→'))
    )
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function SiteFooterX({ lang = 'en' }) {
  const t = cT(lang);
  const year = new Date().getFullYear();
  const social = (name, href, label) => React.createElement('a', { href, key: name, ...ext },
    React.createElement(BrandIcon, { name }), React.createElement('span', null, label || name));
  return React.createElement('footer', { className: 'site-ftr' },
    React.createElement('div', { className: 'site-container' },
      React.createElement('div', { className: 'site-ftr__cols' },
        React.createElement('div', null,
          React.createElement('div', { className: 'site-hdr__brand', style: { fontSize: 20 } },
            'Aggelos', React.createElement('span', null, '.')
          ),
          React.createElement('div', { className: 'site-ftr__roles' },
            React.createElement('div', null, t.role1),
            React.createElement('div', { style: { marginTop: 8 } }, t.role2)
          )
        ),
        React.createElement('nav', null,
          React.createElement('div', { className: 'site-ftr__head' }, t.navigate),
          React.createElement('a', { href: cPath('home', lang) }, t.home),
          React.createElement('a', { href: cPath('about', lang) }, t.why),
          React.createElement('a', { href: cPath('reviews', lang) }, t.reviews),
          React.createElement('a', { href: cPath('diagnostic', lang) }, t.apply)
        ),
        React.createElement('nav', null,
          React.createElement('div', { className: 'site-ftr__head' }, t.content),
          React.createElement('a', { href: EXTERNAL.undisguised, ...ext }, t.articles + ' ↗'),
          React.createElement('a', { href: EXTERNAL.youtube, ...ext }, 'YouTube ↗'),
          React.createElement('a', lang === 'el'
            ? { href: 'https://www.videoask.com/fuv51iuq1', ...ext }
            : { href: cPath('ask-me-anything', lang) }, t.askAnon + ' ↗')
        ),
        React.createElement('nav', null,
          React.createElement('div', { className: 'site-ftr__head' }, t.follow),
          social('LinkedIn', EXTERNAL.linkedin),
          social('Instagram', EXTERNAL.instagram),
          social('TikTok', EXTERNAL.tiktok)
        )
      ),
      React.createElement('div', { className: 'site-ftr__rule' }),
      React.createElement('div', { className: 'site-ftr__legal' },
        React.createElement('div', null, '© ' + year + ' Aggelos Mouzakitis. ' + t.rights),
        React.createElement('nav', null,
          React.createElement('a', { href: cPath('confidentiality', lang) }, t.confidentiality),
          React.createElement('a', { href: cPath('confidentiality', lang) + '#terms' }, t.terms),
          React.createElement('a', { href: cPath('confidentiality', lang) + '#privacy' }, t.privacy)
        )
      )
    )
  );
}

// ─── UNIVERSAL CONTENT LAYOUT ────────────────────────────────────────────────
// For indexed long-form pages authored with this layout: supplies chrome, the
// light page hero and the reading column. Content passes through unchanged.
function UniversalContentLayout({ page, lang = 'en', title, standfirst, children, ctaHeading, ctaLabel, wide }) {
  return React.createElement(React.Fragment, null,
    React.createElement(ChromeStyles),
    React.createElement(SiteHeader, { page, lang }),
    React.createElement('main', null,
      React.createElement('section', { className: 'u-hero' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('h1', null, title),
          standfirst ? React.createElement('p', null, standfirst) : null
        )
      ),
      React.createElement('section', { className: 'u-main' },
        React.createElement('div', { className: wide ? 'site-container' : 'u-read' }, children)
      ),
      React.createElement(BlackCtaStrip, { lang, heading: ctaHeading, label: ctaLabel })
    ),
    React.createElement(SiteFooterX, { lang })
  );
}

// ─── LEGACY SHELL ────────────────────────────────────────────────────────────
// For existing indexed pages that already render their own h1 and body copy
// (specialty/SEO/form pages). Supplies chrome + reading typography only, so no
// heading, copy, slug, canonical or structured data changes.
// form=true swaps the reading column for the centred form container so third-
// party embeds keep their own internals untouched.
function InnerShell({ children, wide, eyebrow }) {
  return React.createElement('div', { className: wide ? 'u-shell u-shell--wide' : 'u-shell' },
    React.createElement('div', { className: 'u-shell__rail' },
      eyebrow ? React.createElement('span', { className: 'u-eyebrow' }, eyebrow) : null),
    React.createElement('div', { className: 'u-shell__body' }, children)
  );
}
function LegacyShell({ page, lang = 'en', children, form, wide, cta = true, eyebrow, bare }) {
  // form → centred form/embed container (no rail); bare → raw wide container;
  // otherwise → the shared inner-page shell (editorial rail + reading column).
  let inner;
  if (form) inner = React.createElement('div', { className: 'u-form' }, children);
  else if (bare) inner = React.createElement('div', { className: 'site-container' }, children);
  else inner = React.createElement(InnerShell, { wide, eyebrow }, children);
  return React.createElement(React.Fragment, null,
    React.createElement(ChromeStyles),
    React.createElement(SiteHeader, { page, lang }),
    React.createElement('main', null,
      React.createElement('section', { className: 'u-main', style: { paddingBlock: '64px 96px' } }, inner),
      cta ? React.createElement(BlackCtaStrip, { lang }) : null
    ),
    React.createElement(SiteFooterX, { lang })
  );
}

Object.assign(window, {
  SITE, CHROME_PATHS, EXTERNAL, cPath, cT, BrandIcon, Wordmark, ChromeStyles,
  SiteHeader, SiteFooterX, BlackCtaStrip, UniversalContentLayout, LegacyShell,
});
