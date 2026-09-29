// site-meta.js — one source of truth for every indexable page's metadata.
//
// The 24 canonical pages take their title and meta description verbatim from
// the final editorial copy (site-copy.jsx, generated from the editorial
// document), so metadata cannot drift from the copy — except the two meta
// descriptions in DESCRIPTIONS, approved after the document. Open Graph reuses them;
// the OG image shows the page's eyebrow and H1 (scripts/seo/og.js).
// `scripts/seo/apply-metadata.js` writes all of this into each page's <head>;
// `scripts/seo/seo-check.js` verifies the result; `scripts/gen-sitemap.js`
// builds sitemap.xml from the same table.
//
// Conventions
//   - ORIGIN + path, always https, always a trailing slash, no query strings.
//   - og:url === canonical === the URL that returns 200.
//   - One Person entity for the whole site (PERSON_ID); pages reference it.
//   - Conservative structured data: only what a visitor can read on the page.
//     No price or priceRange, no reviews or aggregateRating, no address or
//     areaServed, no medical types, no FAQPage. The professional description
//     is "BACP-registered psychotherapist", the site's visible wording;
//     "licensed psychotherapist" is not used anywhere.

const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://aggelosmouzakitis.com';
const PERSON_ID = ORIGIN + '/#person';
const WEBSITE_ID = ORIGIN + '/#website';
const SITE_NAME = 'Aggelos Mouzakitis';
const OG_DEFAULT = ORIGIN + '/img/og/v2/home.png';

const abs = (p) => ORIGIN + p;

// The final editorial copy (plain JavaScript that sets window.SITE_COPY).
const COPY = (() => {
  const window = {};
  // eslint-disable-next-line no-eval
  eval(fs.readFileSync(path.join(__dirname, '..', '..', 'site-copy.jsx'), 'utf8'));
  return window.SITE_COPY.pages;
})();

// ─── The one Person node ─────────────────────────────────────────────────────
// Only facts the site states: BACP registration and the MSc (About, FAQ), the
// languages (Greek-speaking page, FAQ) and the areas each page covers.
const PERSON_FULL = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Aggelos Mouzakitis',
  url: ORIGIN + '/',
  image: abs('/img/aggelos.jpg'),
  jobTitle: 'BACP-registered psychotherapist',
  description: COPY.about.metaDescription,
  knowsLanguage: ['en', 'el'],
  knowsAbout: [
    'Psychotherapy', 'Couples therapy', 'Professional coaching', 'Relationship problems',
    'Separation and divorce', 'Burnout', 'Career change', 'Anxiety', 'Self-worth',
  ],
  sameAs: [
    'https://www.psychologytoday.com/profile/1662603',
    'https://www.linkedin.com/in/growth-product-manager/',
    'https://undisguised.io',
    'https://www.youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
    'https://www.instagram.com/_aggelosmouzakitis_/',
    'https://www.tiktok.com/@aggelosmouz',
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Professional Accreditation',
      name: 'Registered Member, BACP',
      recognizedBy: { '@type': 'Organization', name: 'British Association for Counselling and Psychotherapy', alternateName: 'BACP', url: 'https://www.bacp.co.uk' } },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree',
      name: 'MSc Integrative Counselling & Psychotherapy',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: 'University of Derby' } },
  ],
};
const PERSON_REF = { '@type': 'Person', '@id': PERSON_ID, name: 'Aggelos Mouzakitis', url: ORIGIN + '/' };

const WEBSITE = {
  '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE_NAME, url: ORIGIN + '/',
  inLanguage: 'en', publisher: { '@id': PERSON_ID },
};

// WebPage + BreadcrumbList for an internal page. `trail` is the breadcrumb
// between Home and the page itself, as [name, path] pairs.
function pageNodes(urlPath, name, crumb, type, trail) {
  const url = abs(urlPath);
  const nodes = [{
    '@type': type || 'WebPage', '@id': url + '#webpage', url, name,
    isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en', about: { '@id': PERSON_ID },
  }];
  if (crumb) {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' }];
    (trail || []).forEach(([n, p]) => items.push({ '@type': 'ListItem', position: items.length + 1, name: n, item: abs(p) }));
    items.push({ '@type': 'ListItem', position: items.length + 1, name: crumb, item: url });
    nodes.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items });
  }
  return nodes;
}

// A free tool is a self-scored questionnaire, not a diagnosis: WebApplication
// is the only type that matches what the visitor can do on the page.
function toolNodes(urlPath, name, description) {
  const url = abs(urlPath);
  return pageNodes(urlPath, name, name, 'WebPage', [['Free Tools', '/free-tools/']]).concat([{
    '@type': 'WebApplication', '@id': url + '#tool', name, url, description,
    browserRequirements: 'Requires JavaScript.', isAccessibleForFree: true,
    author: { '@id': PERSON_ID },
    isPartOf: { '@id': abs('/free-tools/') + '#collection' },
  }]);
}

// ─── The 24 canonical pages ──────────────────────────────────────────────────
// [id, sitemap priority, changefreq, breadcrumb label]. Order is sitemap order.
const CANONICAL = [
  ['home', '1.0', 'monthly', null],
  ['work-with-me', '0.9', 'monthly', 'Work with me'],
  ['individual-psychotherapy', '0.9', 'monthly', 'Individual Psychotherapy'],
  ['couples-therapy', '0.9', 'monthly', 'Couples Therapy'],
  ['professional-coaching', '0.8', 'monthly', 'Professional Coaching'],
  ['therapy-for-men-in-tech', '0.8', 'monthly', 'Men in Tech & Demanding Careers'],
  ['therapy-for-founders', '0.8', 'monthly', 'Founders & Business Owners'],
  ['therapy-for-executives', '0.8', 'monthly', 'Executives & Leaders'],
  ['greek-speaking-psychotherapist', '0.8', 'monthly', 'Greek-speaking Psychotherapy'],
  ['relationship-problems-men', '0.8', 'monthly', 'Relationship Problems'],
  ['separation-divorce-men', '0.8', 'monthly', 'Separation & Divorce'],
  ['work-affecting-relationship', '0.8', 'monthly', 'Work & Relationships'],
  ['executive-burnout-therapy', '0.8', 'monthly', 'Burnout & Can’t Switch Off'],
  ['career-transition-therapy', '0.8', 'monthly', 'Career Change & Decisions'],
  ['anxiety-overthinking', '0.8', 'monthly', 'Anxiety & Overthinking'],
  ['achievement-self-worth', '0.8', 'monthly', 'Achievement & Self-Worth'],
  ['about', '0.7', 'yearly', 'About'],
  ['considering-therapy', '0.7', 'monthly', 'Considering Therapy'],
  ['faq', '0.6', 'monthly', 'FAQ'],
  ['reviews', '0.6', 'monthly', 'Reviews'],
  ['free-tools', '0.5', 'monthly', 'Free Tools'],
  ['blog', '0.6', 'weekly', 'Writing'],
  ['contact', '0.7', 'yearly', 'Contact'],
  ['confidentiality', '0.4', 'yearly', 'Confidentiality'],
];

// The three services sit under Work With Me in the breadcrumb and carry a
// Service node: name, type, provider and the page's own description. Nothing
// about price, place or eligibility — the pages say those are agreed first.
const SERVICE_TYPE = {
  'individual-psychotherapy': 'Psychotherapy',
  'couples-therapy': 'Couples therapy',
  'professional-coaching': 'Professional coaching',
};
const PAGE_TYPE = { about: 'ProfilePage', contact: 'ContactPage', 'free-tools': 'CollectionPage' };

// The editorial document gives the homepage and Therapy for Men in Tech the same
// meta description. Each has its own, approved separately (Sep 2026); every
// other page uses the document's.
const DESCRIPTIONS = {
  home: 'Online psychotherapy primarily for men in tech, startups and demanding careers, with Aggelos Mouzakitis, BACP-registered psychotherapist.',
  'therapy-for-men-in-tech': 'Online psychotherapy for men in tech and demanding careers dealing with work pressure, overthinking, relationships, burnout and difficult decisions.',
};

function canonicalPage([id, priority, changefreq, crumb]) {
  const c = COPY[id];
  if (!c) throw new Error(`site-copy.jsx has no page "${id}"`);
  const url = c.url;
  const file = url === '/' ? 'index.html' : url.slice(1) + 'index.html';
  const description = DESCRIPTIONS[id] || c.metaDescription;
  const entry = {
    file, url, priority, changefreq,
    title: c.seoTitle,
    description,
    ogTitle: c.seoTitle,
    ogDescription: description,
    ogImage: abs('/img/og/v2/' + id + '.png'),
    ogImageAlt: c.hero.h1,
    og: { key: id, label: id === 'home' ? 'Aggelos Mouzakitis' : c.hero.eyebrow, title: c.hero.h1 },
  };
  if (id === 'home') {
    entry.schema = [PERSON_FULL, WEBSITE, {
      '@type': 'WebPage', '@id': abs('/') + '#webpage', url: ORIGIN + '/', name: c.seoTitle,
      isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en', about: { '@id': PERSON_ID },
    }];
    return entry;
  }
  const trail = SERVICE_TYPE[id] ? [['Work with me', '/work-with-me/']] : [];
  const nodes = pageNodes(url, c.seoTitle, crumb, PAGE_TYPE[id], trail);
  if (id === 'about') {
    nodes[0].mainEntity = { '@id': PERSON_ID };
    delete nodes[0].about;
    entry.schema = [PERSON_FULL].concat(nodes);
    return entry;
  }
  if (SERVICE_TYPE[id]) {
    nodes.push({
      '@type': 'Service', '@id': abs(url) + '#service', name: crumb, serviceType: SERVICE_TYPE[id],
      url: abs(url), description, provider: { '@id': PERSON_ID },
    });
  }
  if (id === 'free-tools') {
    nodes.push({
      '@type': 'ItemList', '@id': abs('/free-tools/') + '#collection',
      name: 'Free Tools', numberOfItems: 2, itemListOrder: 'https://schema.org/ItemListUnordered',
      itemListElement: [
        ['/free-tools/burned-out/', 'Are you burned out?'],
        ['/free-tools/quit-your-job/', 'What’s making you want to quit your job?'],
      ].map(([p, n], i) => ({ '@type': 'ListItem', position: i + 1, name: n, url: abs(p) })),
    });
  }
  entry.schema = nodes.concat([PERSON_REF]);
  return entry;
}

const PAGES = CANONICAL.map(canonicalPage).concat([
  // ── The two free tools that stay public. Their pages are the tools
  //    themselves; titles and descriptions are unchanged.
  {
    file: 'free-tools/burned-out/index.html', url: '/free-tools/burned-out/', priority: '0.5', changefreq: 'yearly',
    title: 'Are You Burned Out? | Free Burnout Clarity Tool',
    description: 'Directional, not a clinical diagnosis: 20 questions on whether this points to work-related depletion, under-stimulation or loss of fit with the work itself.',
    ogTitle: 'Are You Burned Out? | Free Burnout Clarity Tool',
    ogDescription: 'Directional, not a clinical diagnosis: 20 questions on exhaustion, control, meaning and fit.',
    ogImage: abs('/img/og/clarity-burned-out.png'),
    ogImageAlt: 'Free burnout clarity tool: are you burned out?',
    schema: toolNodes('/free-tools/burned-out/', 'Are you burned out?',
      'A 20-question self-assessment covering exhaustion, cognitive strain, workload, control, boredom, meaning and fit with the work. Directional, not a clinical diagnosis.'),
  },
  {
    file: 'free-tools/quit-your-job/index.html', url: '/free-tools/quit-your-job/', priority: '0.5', changefreq: 'yearly',
    title: "What's Making You Want to Quit Your Job? | Free Career Clarity Tool",
    description: 'Directional, not a clinical assessment: 20 questions on whether it is the role, the manager, the company, the field or burnout driving the urge to leave.',
    ogTitle: "What's Making You Want to Quit Your Job? | Free Career Clarity Tool",
    ogDescription: '20 questions that separate the role, the manager, the company, the field and burnout.',
    ogImage: abs('/img/og/clarity-quit-your-job.png'),
    ogImageAlt: "Free career clarity tool: what's making you want to quit your job?",
    schema: toolNodes('/free-tools/quit-your-job/', "What's making you want to quit your job?",
      'A 20-question self-assessment that distinguishes the role, the manager, the company, the field and burnout as reasons for wanting to leave a job. Directional, not a clinical assessment.'),
  },
]);

module.exports = { ORIGIN, SITE_NAME, PERSON_ID, WEBSITE_ID, OG_DEFAULT, PAGES, COPY };
