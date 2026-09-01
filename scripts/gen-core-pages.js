// gen-core-pages.js — generate the 12 core page shells (6 EN + 6 EL).
// Each shell: bilingual <head> (canonical, reciprocal hreflang, OG, JSON-LD),
// an empty #root (filled later by scripts/seo/prerender.js), and a renderApp() mount.
// Run:  node scripts/gen-core-pages.js
// Then: npm run build && node scripts/seo/prerender.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://aggelosmouzakitis.com';
const GA = 'G-KV83RRF6ZM';
const SIDEBAR_V = 32, CONTENT_V = 35;
const CHROME_V = 6, V2_V = 8;

// Shared CSS (from the original index.html — design system preserved 1:1)
const CSS = `
:root{
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-heading: "Inter Tight", "Inter", system-ui, sans-serif;
  --font-display: "Archivo Black", "Inter Tight", "Inter", system-ui, sans-serif;
  --brand-green: #059669;
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: #1A1C1D; color: #FFFFFF; font-family: var(--font-body); font-size: 18px; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: clip; }
#root { display: block; }
a { color: inherit; text-decoration: none; }
::selection { background: #059669; color: #FFFFFF; }
img { max-width: 100%; }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 3px solid #059669; outline-offset: 2px; border-radius: 2px; }
@media (prefers-reduced-motion: reduce){ *{transition-duration:.001ms!important;animation-duration:.001ms!important} }
@media print { .site-hdr, .site-ftr, .cta-strip { display: none !important; } }
`;

// Person JSON-LD (verified facts only; per-language jobTitle per brief §48/§55)
function personLd(lang) {
  const en = {
    jobTitle: ['Business Advisor', 'Licensed Psychotherapist'],
    description: "Business advisor and licensed psychotherapist (BACP-registered) for people building something of their own. 18+ years in product and growth, having built companies and advised more than 500 of them. The work runs on two tracks at once: the business you're building and whatever in you affects how you build it.",
    knowsAbout: ['Business Advisory', 'Offer & Positioning', 'Pricing', 'Customer Acquisition', 'Sales', 'Founder Psychology', 'Solopreneur Advisory', 'Decision-Making', 'Product & Growth Strategy'],
  };
  const el = {
    jobTitle: ['Business Advisor', 'Ψυχοθεραπευτής'],
    description: 'Σύμβουλος επιχειρήσεων και ψυχοθεραπευτής για ανθρώπους που χτίζουν κάτι δικό τους. 18+ χρόνια σε product και growth, με εμπειρία ως founder και συμβουλευτική σε 500+ επιχειρήσεις.',
    knowsAbout: ['Συμβουλευτική Επιχειρήσεων', 'Positioning', 'Τιμολόγηση', 'Εύρεση Πελατών', 'Πωλήσεις', 'Ψυχολογία Founders', 'Λήψη Αποφάσεων'],
  };
  const c = lang === 'el' ? el : en;
  return {
    '@context': 'https://schema.org', '@type': 'Person', '@id': ORIGIN + '/#person',
    name: 'Aggelos Mouzakitis', url: ORIGIN + '/', image: ORIGIN + '/img/aggelos.jpg',
    jobTitle: c.jobTitle, description: c.description, knowsAbout: c.knowsAbout,
    sameAs: ['https://www.linkedin.com/in/growth-product-manager/', 'https://undisguised.io', 'https://headofgrowth.io', 'https://www.youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA'],
    address: { '@type': 'PostalAddress', addressCountry: 'IE' },
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Professional Accreditation', name: 'Registered Member, BACP', recognizedBy: { '@type': 'Organization', name: 'British Association for Counselling and Psychotherapy', alternateName: 'BACP', url: 'https://www.bacp.co.uk' } },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MSc Integrative Counselling & Psychotherapy', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Derby' } },
    ],
  };
}

function breadcrumbLd(page, lang) {
  const t = lang === 'el' ? { home: 'Αρχική' } : { home: 'Home' };
  const base = ORIGIN + (lang === 'el' ? '/el/' : '/');
  const items = [{ '@type': 'ListItem', position: 1, name: t.home, item: base }];
  if (page.id !== 'home') items.push({ '@type': 'ListItem', position: 2, name: page[lang].crumb, item: canonical(page, lang) });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}

function canonical(page, lang) {
  return ORIGIN + (lang === 'el' ? '/el' + page.path : page.path);
}

// ── Core page config ─────────────────────────────────────────────────────────
const PAGES = [
  {
    id: 'home', path: '/', dir: '', schemaType: 'WebPage', og: 'home.png', preloadHero: true,
    en: { title: 'Aggelos Mouzakitis — Business Advisor + Licensed Psychotherapist', crumb: 'Home',
      desc: "Business advisor and licensed psychotherapist for people building something of their own — the business, and whatever in you affects how you build it." },
    el: { title: 'Άγγελος Μουζακίτης — Business Advisor + Ψυχοθεραπευτής', crumb: 'Αρχική',
      desc: 'Σύμβουλος επιχειρήσεων και ψυχοθεραπευτής για ανθρώπους που χτίζουν κάτι δικό τους. Δουλεύουμε την επιχείρηση και ό,τι μέσα σου επηρεάζει το χτίσιμό της.' },
  },
  {
    id: 'one-to-one', path: '/1-to-1/', dir: '1-to-1', schemaType: 'WebPage', og: 'one-to-one.png',
    en: { title: '1:1 — Business Advisory + Psychological Work | Aggelos Mouzakitis', crumb: '1:1',
      desc: "Private 1:1 work on what you're building and whatever is affecting your ability to build it — business advisory and psychological work in one engagement." },
    el: { title: '1:1 Συνεργασία — business & ψυχολογία | Άγγελος Μουζακίτης', crumb: '1:1',
      desc: 'Ιδιωτική δουλειά 1:1 πάνω σε αυτό που χτίζεις και σε ό,τι επηρεάζει την ικανότητά σου να το χτίσεις — συμβουλευτική επιχειρήσεων και ψυχολογική δουλειά μαζί.' },
  },
  {
    id: 'about', path: '/about/', dir: 'about', schemaType: 'ProfilePage', og: 'about.png',
    en: { title: 'About — Aggelos Mouzakitis', crumb: 'About',
      desc: 'Business advisor and licensed psychotherapist (BACP). 18+ years in product and growth, 500+ companies advised, MSc Integrative Counselling & Psychotherapy.' },
    el: { title: 'Σχετικά — Άγγελος Μουζακίτης', crumb: 'Σχετικά',
      desc: 'Σύμβουλος επιχειρήσεων και ψυχοθεραπευτής. 18+ χρόνια σε product & growth, 500+ επιχειρήσεις, MSc Integrative Counselling & Psychotherapy, εγγεγραμμένος στο BACP.' },
  },
  {
    id: 'reviews', path: '/reviews/', dir: 'reviews', schemaType: 'WebPage', og: 'reviews.png',
    en: { title: 'Reviews — in their words | Aggelos Mouzakitis', crumb: 'Reviews',
      desc: "Feedback from founders, operators and independents I've worked with. Some named, some anonymous — the words are theirs, shared with permission." },
    el: { title: 'Κριτικές — με τα λόγια τους | Άγγελος Μουζακίτης', crumb: 'Κριτικές',
      desc: 'Σχόλια από founders, στελέχη και ανεξάρτητους επαγγελματίες με τους οποίους έχω δουλέψει. Κάποιοι επώνυμα, κάποιοι ανώνυμα — τα λόγια είναι δικά τους.' },
  },
  {
    id: 'book', path: '/book/', dir: 'book', schemaType: 'WebPage', og: 'book.png',
    en: { title: 'Book a fit call — Aggelos Mouzakitis', crumb: 'Book a fit call',
      desc: 'A short, free fit call to see whether working together makes sense for what you’re trying to build.' },
    el: { title: 'Κλείσε μια γνωριμία — Άγγελος Μουζακίτης', crumb: 'Γνωριμία',
      desc: 'Μια σύντομη, δωρεάν γνωριμία για να δούμε αν η συνεργασία βγάζει νόημα για αυτό που προσπαθείς να χτίσεις.' },
  },
  {
    id: 'confidentiality', path: '/confidentiality/', dir: 'confidentiality', schemaType: 'WebPage', og: 'confidentiality.png',
    en: { title: 'Confidentiality — Aggelos Mouzakitis', crumb: 'Confidentiality',
      desc: 'How confidentiality works in this private, one-to-one work — what stays between us, what never goes back to the people involved, and where the honest limits are.' },
    el: { title: 'Εμπιστευτικότητα — Άγγελος Μουζακίτης', crumb: 'Εμπιστευτικότητα',
      desc: 'Πώς λειτουργεί η εμπιστευτικότητα σε αυτή την ιδιωτική, ατομική δουλειά — τι μένει μεταξύ μας και ποια είναι τα ειλικρινή όρια.' },
  },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(page, lang) {
  const c = page[lang];
  const canEn = canonical(page, 'en');
  const canEl = canonical(page, 'el');
  const self = canonical(page, lang);
  const ogUrl = `${ORIGIN}/img/og/${page.og}`;
  const ogLocale = lang === 'el' ? 'el_GR' : 'en_IE';
  const ogAltLocale = lang === 'el' ? 'en_IE' : 'el_GR';
  const htmlLang = lang === 'el' ? 'el' : 'en';
  const ld = [personLd(lang), breadcrumbLd(page, lang)];
  if (page.id === 'home') {
    ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': ORIGIN + '/#website', name: 'Aggelos Mouzakitis', url: ORIGIN + '/', inLanguage: ['en', 'el'], publisher: { '@id': ORIGIN + '/#person' } });
  }
  ld.push({ '@context': 'https://schema.org', '@type': page.schemaType, '@id': self + '#webpage', url: self, name: c.title, inLanguage: htmlLang, isPartOf: { '@id': ORIGIN + '/#website' }, about: { '@id': ORIGIN + '/#person' } });

  const preload = page.preloadHero ? `\n<link rel="preload" as="image" href="/img/aggelos-homepage.webp" fetchpriority="high">` : '';
  const ldTags = ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA}');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter+Tight:wght@600..900&family=Inter:wght@400..700&display=swap">
<meta name="robots" content="max-image-preview:large">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.desc)}">${preload}
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${canEn}">
<link rel="alternate" hreflang="el" href="${canEl}">
<link rel="alternate" hreflang="x-default" href="${canEn}">
<meta property="og:type" content="${page.id === 'about' ? 'profile' : 'website'}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${ogUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Aggelos Mouzakitis">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:locale:alternate" content="${ogAltLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.title)}">
<meta name="twitter:description" content="${esc(c.desc)}">
<meta name="twitter:image" content="${ogUrl}">
<meta name="theme-color" content="#F5F5F5">
<meta name="author" content="Aggelos Mouzakitis">
<link rel="manifest" href="/manifest.json">
${ldTags}
<style>${CSS}</style>
</head>
<body>
<div id="root"></div>
<script src="/react.production.min.js?v=18.3.1" crossorigin="anonymous"></script>
<script src="/react-dom.production.min.js?v=18.3.1" crossorigin="anonymous"></script>
<script src="/site-chrome.js?v=${CHROME_V}"></script>
<script src="/core-pages-v2.js?v=${V2_V}"></script>
<script src="/content-pages.js?v=${CONTENT_V}"></script>
<script>renderApp(${JSON.stringify(page.id)}, ${JSON.stringify(lang)});</script>
</body>
</html>
`;
}

let n = 0;
for (const page of PAGES) {
  for (const lang of ['en', 'el']) {
    const rel = (lang === 'el' ? 'el/' : '') + page.dir + (page.dir ? '/' : '');
    const outDir = path.join(ROOT, rel);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, render(page, lang));
    n++;
    console.log('wrote', path.relative(ROOT, outFile));
  }
}
console.log(`\n${n} core page shells generated.`);
