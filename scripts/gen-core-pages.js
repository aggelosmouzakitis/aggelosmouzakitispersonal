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
const SIDEBAR_V = 31, CONTENT_V = 31;

// Shared CSS (from the original index.html — design system preserved 1:1)
const CSS = `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
  background: #F5F5F5;
  font-family: 'Libre Franklin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 16px; line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
::selection { background: #282726; color: #FFFFFF; }
#root { display: flex; overflow: hidden; }
#main-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  background: #FFFFFF; color: #282726;
}
#main-scroll a { color: #1a7f37; text-underline-offset: 3px; text-decoration-thickness: 1px; }
#main-scroll a:hover { color: #146b2e; text-decoration-thickness: 2px; }
#main-scroll a.cta-btn, #main-scroll a.cta-btn:hover { color: #fff; text-decoration: none; }
#main-scroll strong { font-weight: 400; color: #282726; border-bottom: 1px solid rgba(40,39,38,.3); padding-bottom: 1px; }
#main-scroll::-webkit-scrollbar { width: 4px; }
#main-scroll::-webkit-scrollbar-thumb { background: rgba(40,39,38,0.15); }
#sidebar { position: relative; flex-shrink: 0; }
@media (max-width: 767px) {
  #root { display: block; height: 100%; }
  #sidebar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 100; height: auto; width: 100% !important; }
  #main-scroll { height: 100%; padding-bottom: 80px; }
}
@media print { #sidebar { display: none !important; } #main-scroll { overflow: visible; } #root { display: block; } }
#main-scroll .hv-card{transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
#main-scroll .hv-card:hover{border-color:rgba(26,127,55,.5);box-shadow:0 8px 26px rgba(26,127,55,.10);transform:translateY(-3px)}
#main-scroll .hv-row{transition:background .15s ease,color .15s ease}
#main-scroll .hv-row:hover{background:rgba(26,127,55,.06)}
#main-scroll a.cta-btn:hover,#main-scroll button.cta-btn:hover{box-shadow:0 6px 18px rgba(26,127,55,.28)}
a:focus-visible,button:focus-visible { outline: 3px solid #1a7f37; outline-offset: 2px; border-radius: 2px; }
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
      desc: "Business advisor and licensed psychotherapist for people building something of their own. I work on the business you're building and on whatever in you affects how you build it." },
    el: { title: 'Άγγελος Μουζακίτης — Business Advisor + Ψυχοθεραπευτής', crumb: 'Αρχική',
      desc: 'Σύμβουλος επιχειρήσεων και ψυχοθεραπευτής για ανθρώπους που χτίζουν κάτι δικό τους. Δουλεύουμε την επιχείρηση και ό,τι μέσα σου επηρεάζει το χτίσιμό της.' },
  },
  {
    id: 'one-to-one', path: '/1-to-1/', dir: '1-to-1', schemaType: 'WebPage', og: 'one-to-one.png',
    en: { title: '1:1 — Business Advisory + Psychological Work | Aggelos Mouzakitis', crumb: '1:1',
      desc: "Private 1:1 work on what you're building and whatever is affecting your ability to build it — business advisory and psychological work in one engagement." },
    el: { title: '1:1 — Συμβουλευτική επιχειρήσεων & ψυχολογική δουλειά | Άγγελος Μουζακίτης', crumb: '1:1',
      desc: 'Ιδιωτική δουλειά 1:1 πάνω σε αυτό που χτίζεις και σε ό,τι επηρεάζει την ικανότητά σου να το χτίσεις — συμβουλευτική επιχειρήσεων και ψυχολογική δουλειά μαζί.' },
  },
  {
    id: 'about', path: '/about/', dir: 'about', schemaType: 'ProfilePage', og: 'about.png',
    en: { title: 'About — Aggelos Mouzakitis', crumb: 'About',
      desc: 'Business advisor and licensed psychotherapist (BACP-registered). 18+ years in product and growth, having advised 500+ companies, plus an MSc in Integrative Counselling & Psychotherapy.' },
    el: { title: 'Σχετικά — Άγγελος Μουζακίτης', crumb: 'Σχετικά',
      desc: 'Σύμβουλος επιχειρήσεων και ψυχοθεραπευτής. 18+ χρόνια σε product & growth, 500+ επιχειρήσεις, MSc Integrative Counselling & Psychotherapy, εγγεγραμμένος στο BACP.' },
  },
  {
    id: 'reviews', path: '/reviews/', dir: 'reviews', schemaType: 'WebPage', og: 'reviews.png',
    en: { title: 'Reviews — in their words | Aggelos Mouzakitis', crumb: 'Reviews',
      desc: "Anonymous reflections from founders, operators and independents I've worked with. Shared with permission; identifying details removed." },
    el: { title: 'Κριτικές — με τα λόγια τους | Άγγελος Μουζακίτης', crumb: 'Κριτικές',
      desc: 'Ανώνυμες σκέψεις από founders, στελέχη και ανεξάρτητους επαγγελματίες με τους οποίους έχω δουλέψει. Κοινοποιούνται με άδεια.' },
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
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" media="print" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap"></noscript>
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
<script src="/sidebar.js?v=${SIDEBAR_V}"></script>
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
