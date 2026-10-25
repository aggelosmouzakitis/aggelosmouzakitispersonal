// site-meta.js — one source of truth for every indexable page's metadata.
//
// The 25 canonical pages take their title and meta description verbatim from
// the canonical copy (site-copy.jsx, generated from content/canonical-copy.md),
// and each article from its brief (article-<slug>.jsx, generated from
// content/articles/<slug>.md), so metadata cannot drift from the copy. Open
// Graph reuses them; the OG image shows the page's eyebrow (an article's
// category) and H1 (scripts/seo/og.js).
// `scripts/seo/apply-metadata.js` writes all of this into each page's <head>;
// `scripts/seo/seo-check.js` verifies the result; `scripts/gen-sitemap.js`
// builds sitemap.xml from the same table.
//
// Conventions
//   - ORIGIN + path, always https, always a trailing slash, no query strings.
//   - og:url === canonical === the URL that returns 200.
//   - One Person entity for the whole site (PERSON_ID); pages reference it.
//   - Conservative structured data: only what the site states. The published
//     fee (€100 or £90 per session) and the area served (the UK and Europe:
//     the UK, Ireland, Greece) as /faq/ and the audience pages give them; no
//     reviews or aggregateRating, no address, city or geo, no medical types.
//     FAQPage only where the page shows those questions, with their visible
//     wording. The professional description is "BACP-registered
//     psychotherapist", the site's visible wording; "licensed psychotherapist"
//     is not used anywhere.

const fs = require('fs');
const path = require('path');
const ARTICLE_REGISTRY = require('../articles/articles.js');

const ORIGIN = 'https://aggelosmouzakitis.com';
const PERSON_ID = ORIGIN + '/#person';
const WEBSITE_ID = ORIGIN + '/#website';
const SITE_NAME = 'Aggelos Mouzakitis';
const OG_DEFAULT = ORIGIN + '/img/og/v2/home.png';

const abs = (p) => ORIGIN + p;

// The canonical copy (site-copy.jsx, generated from content/canonical-copy.md;
// plain JavaScript that sets window.SITE_COPY).
const COPY = (() => {
  const window = {};
  // eslint-disable-next-line no-eval
  eval(fs.readFileSync(path.join(__dirname, '..', '..', 'site-copy.jsx'), 'utf8'));
  return window.SITE_COPY.pages;
})();

// ─── The one Person node ─────────────────────────────────────────────────────
// Only facts the site states: BACP registration, the MSc, EMDR and somatic
// training and the universities (About, FAQ), the languages (Greek-speaking
// page, FAQ) and the areas each page covers. The image is the approved About
// portrait; the description is the About page's, without its "About …" framing.
const PERSON_FULL = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Aggelos Mouzakitis',
  // The spelling some directories use (It's Complicated, below).
  alternateName: ['Angelos Mouzakitis'],
  url: ORIGIN + '/',
  image: abs('/img/aggelos-about.webp'),
  jobTitle: 'BACP-registered psychotherapist',
  description: COPY.about.metaDescription.replace(/^About Aggelos Mouzakitis,\s*/, '').replace(/^./, (ch) => ch.toUpperCase()),
  knowsLanguage: ['en', 'el'],
  knowsAbout: [
    'Psychotherapy', 'Couples therapy', 'Professional coaching', 'Relationship problems',
    'Separation and divorce', 'Burnout', 'Career change', 'Anxiety', 'Self-worth',
  ],
  memberOf: { '@type': 'Organization', name: 'British Association for Counselling and Psychotherapy', alternateName: 'BACP', url: 'https://www.bacp.co.uk' },
  sameAs: [
    'https://www.psychologytoday.com/profile/1662603',
    'https://complicated.life/find-a-therapist/london/integrative-psychotherapist-angelos-mouzakitis',
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
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'EMDR Practitioner' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Somatic Shaking Practitioner' },
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Derby' },
    { '@type': 'CollegeOrUniversity', name: 'The American College of Greece' },
    { '@type': 'CollegeOrUniversity', name: 'University of Piraeus' },
  ],
};
const PERSON_REF = { '@type': 'Person', '@id': PERSON_ID, name: 'Aggelos Mouzakitis', url: ORIGIN + '/' };

// ─── The practice ────────────────────────────────────────────────────────────
// Online only: the area it serves, never an address, a city or geo (a
// validator's warning about the missing address is expected).
const AREA_SERVED = [
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'Ireland' },
  { '@type': 'Country', name: 'Greece' },
  { '@type': 'Continent', name: 'Europe' },
];
const PRACTICE = {
  '@type': 'ProfessionalService',
  '@id': ORIGIN + '/#practice',
  name: 'Aggelos Mouzakitis',
  url: ORIGIN + '/',
  description: 'Online psychotherapy, couples therapy and professional coaching in English or Greek, for clients across the UK and Europe.',
  founder: { '@id': PERSON_ID },
  priceRange: '€100 / £90 per session',
  knowsLanguage: ['en', 'el'],
  areaServed: AREA_SERVED,
};
// The published fee, the same for every service: one offer per currency.
const offers = (description) => [
  { '@type': 'Offer', price: 100, priceCurrency: 'EUR', description },
  { '@type': 'Offer', price: 90, priceCurrency: 'GBP', description },
];

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

// ─── The 26 canonical pages ──────────────────────────────────────────────────
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
  ['therapy-vs-coaching', '0.7', 'monthly', 'Therapy vs Coaching'],
  ['undisguised', '0.6', 'monthly', 'Undisguised'],
  ['faq', '0.6', 'monthly', 'FAQ'],
  ['reviews', '0.6', 'monthly', 'Reviews'],
  ['free-tools', '0.5', 'monthly', 'Free Tools'],
  ['blog', '0.6', 'weekly', 'Writing'],
  ['contact', '0.7', 'yearly', 'Contact'],
  ['confidentiality', '0.4', 'yearly', 'Confidentiality'],
];

// The three services sit under Work With Me in the breadcrumb and carry a
// Service node: name, type, provider, the page's own description, the
// languages, the area served and the published fee. The three audience pages
// carry one too, named by their H1. Nothing about place or eligibility: the
// pages say location is confirmed first.
const SERVICE_TYPE = {
  'individual-psychotherapy': 'Psychotherapy',
  'couples-therapy': 'Couples therapy',
  'professional-coaching': 'Professional coaching',
};
const AUDIENCE_SERVICE = ['therapy-for-men-in-tech', 'therapy-for-founders', 'therapy-for-executives'];
// What one fee buys, where a page states the session length with it.
const OFFER_UNIT = { 'couples-therapy': 'Per 50–60 minute session' };
// The pages that show questions and answers (a section of nothing but
// questions, drawn as the FAQ accordion by site-pages.jsx). Their FAQPage
// holds every one of them, in the page's own words.
const FAQ_PAGES = [
  'individual-psychotherapy', 'couples-therapy', 'therapy-for-men-in-tech', 'therapy-for-founders',
  'therapy-for-executives', 'greek-speaking-psychotherapist', 'executive-burnout-therapy', 'faq',
];
const plain = (t) => t.replace(/\*\*/g, '');
// site-pages.jsx isFaq: every block a question (an H3 ending in "?").
const isFaq = (s) => s.blocks.length > 0 && s.blocks.every((b) => b.t === 'sub' && /\?$/.test(b.h3));
function faqOf(c) {
  const answer = (blocks) => blocks.map((b) => (b.t === 'p' ? b.text : b.t === 'lines' ? b.lines.join(' ')
    : b.t === 'list' ? b.items.join(' ') : null)).filter(Boolean).map(plain).join(' ');
  const questions = [].concat(...c.sections.filter(isFaq).map((s) => s.blocks)).map((q) => ({
    '@type': 'Question', name: plain(q.h3), acceptedAnswer: { '@type': 'Answer', text: answer(q.blocks) },
  }));
  if (!questions.length) throw new Error(`site-meta: ${c.url} is in FAQ_PAGES but shows no questions`);
  return questions;
}
const PAGE_TYPE = { about: 'ProfilePage', contact: 'ContactPage', 'free-tools': 'CollectionPage' };
// A page whose H1 changed after its share card was published gets a new card
// file: /img/* is served immutable, so the old URL keeps the old picture.
const OG_FILE = { 'free-tools': 'free-tools-2' };

// The free tools in the order /free-tools/ shows them (the Work & Life Check
// first, the entry point) — the ItemList and llms.txt use the same order.
const TOOL_LIST = [
  ['/work-life-check/', 'The Work & Life Check'],
  ['/free-tools/burned-out/', 'Are you burned out?'],
  ['/free-tools/quit-your-job/', 'What’s making you want to quit your job?'],
];

function canonicalPage([id, priority, changefreq, crumb]) {
  const c = COPY[id];
  if (!c) throw new Error(`site-copy.jsx has no page "${id}"`);
  const url = c.url;
  const file = url === '/' ? 'index.html' : url.slice(1) + 'index.html';
  const description = c.metaDescription;
  const entry = {
    file, url, priority, changefreq,
    title: c.seoTitle,
    description,
    ogTitle: c.seoTitle,
    ogDescription: description,
    ogImage: abs('/img/og/v2/' + (OG_FILE[id] || id) + '.png'),
    ogImageAlt: c.hero.h1,
    og: { key: OG_FILE[id] || id, label: id === 'home' ? 'Aggelos Mouzakitis' : c.hero.eyebrow, title: c.hero.h1 },
  };
  if (id === 'home') {
    entry.schema = [PERSON_FULL, PRACTICE, WEBSITE, {
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
    entry.schema = [PERSON_FULL, PRACTICE].concat(nodes);
    return entry;
  }
  if (SERVICE_TYPE[id] || AUDIENCE_SERVICE.includes(id)) {
    nodes.push({
      '@type': 'Service', '@id': abs(url) + '#service',
      name: SERVICE_TYPE[id] ? crumb : c.hero.h1.replace(/\.$/, ''),
      serviceType: SERVICE_TYPE[id] || 'Psychotherapy',
      url: abs(url), description, provider: { '@id': PERSON_ID },
      availableLanguage: ['en', 'el'], areaServed: AREA_SERVED,
      offers: offers(OFFER_UNIT[id] || 'Per session'),
    });
  }
  if (FAQ_PAGES.includes(id)) entry.faq = faqOf(c);
  if (id === 'free-tools') {
    nodes.push({
      '@type': 'ItemList', '@id': abs('/free-tools/') + '#collection',
      name: 'Free Tools', numberOfItems: TOOL_LIST.length, itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: TOOL_LIST.map(([p, n], i) => ({ '@type': 'ListItem', position: i + 1, name: n, url: abs(p) })),
    });
  }
  entry.schema = nodes.concat([PERSON_REF]);
  return entry;
}

// ─── Articles ────────────────────────────────────────────────────────────────
// Each article in scripts/articles/articles.js, at its own URL, with the title
// tag, meta description and H1 of its brief (article-<slug>.jsx, generated
// from it). Structured data: one BlogPosting with only what the page shows —
// headline, description, the author (the site's one Person, here with the
// URL of the author page the byline links to, /about/), the same Person as
// publisher, the release date, en-GB, its section, the approved author image
// it shows and its word count — plus the breadcrumb the page shows
// (Home › Writing › the article). No FAQPage: the FAQ stays visible only.
function articlePage(a) {
  const art = ARTICLE_REGISTRY.loadArticle(a);
  const url = abs(art.url);
  const posting = {
    '@type': 'BlogPosting', '@id': url + '#article', url, mainEntityOfPage: url,
    headline: art.h1, description: art.description,
    author: { '@type': 'Person', '@id': PERSON_ID, name: art.author.name, url: abs(art.author.href) },
    publisher: { '@id': PERSON_ID },
    datePublished: art.meta.published,
  };
  if (art.meta.modified) posting.dateModified = art.meta.modified;
  // A brief that asks for dateModified to start as the publication timestamp.
  else if (a.schemaModified === 'published') posting.dateModified = art.meta.published;
  Object.assign(posting, { inLanguage: a.inLanguage || 'en-GB', articleSection: art.meta.category });
  // The approved author image the page shows: the article's image, or the
  // author's where the brief keeps the portrait to that field ('author'), or
  // none where it rules a portrait out ('none'): never an invented one.
  if (a.schemaImage === 'author') posting.author.image = abs(art.author.image);
  else if (a.schemaImage !== 'none') posting.image = abs(art.author.image);
  posting.wordCount = art.wordCount;
  const labels = art.meta.labels || [art.meta.category, art.meta.type].filter(Boolean);
  const breadcrumb = {
    '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: COPY.blog.navLabel, item: abs(COPY.blog.url) },
      { '@type': 'ListItem', position: 3, name: art.h1, item: url },
    ],
  };
  return {
    file: ARTICLE_REGISTRY.pageFile(a), url: art.url, priority: '0.7', changefreq: 'monthly',
    name: art.h1,
    title: art.title,
    description: art.description,
    ogType: 'article',
    article: { publishedTime: art.meta.published, modifiedTime: art.meta.modified || null, section: art.meta.category },
    ogTitle: art.title,
    ogDescription: art.description,
    ogImage: abs('/img/og/v2/' + a.slug + '.png'),
    ogImageAlt: art.h1,
    og: { key: a.slug, label: labels[0], title: art.h1 },
    bundles: [ARTICLE_REGISTRY.dataBundle(a)],
    schema: [posting, breadcrumb],
  };
}
const ARTICLE_PAGES = ARTICLE_REGISTRY.ARTICLES.map(articlePage);

const WLC_DESCRIPTION = 'A free 4-minute reflection for people whose work is affecting recovery, decisions, relationships or how they feel about themselves.';

const PAGES = CANONICAL.map(canonicalPage).concat([
  // ── The Work & Life Check: the main entry tool (work-life-check.jsx on the
  //    clarity engine). Its results are drawn in the page and never get a URL
  //    of their own, so only the landing page exists to be indexed.
  {
    file: 'work-life-check/index.html', url: '/work-life-check/', priority: '0.6', changefreq: 'monthly',
    title: 'The Work & Life Check | Aggelos Mouzakitis',
    description: WLC_DESCRIPTION,
    ogTitle: 'The Work & Life Check | Aggelos Mouzakitis',
    ogDescription: WLC_DESCRIPTION,
    ogImage: abs('/img/og/v2/work-life-check.png'),
    ogImageAlt: 'The Work & Life Check: What is work actually costing you?',
    og: { key: 'work-life-check', label: 'The Work & Life Check', title: 'What is work actually costing you?' },
    schema: toolNodes('/work-life-check/', 'The Work & Life Check',
      'A 17-question reflection on five areas where work can cost more than it shows: switching off, recovery, an open decision, relationships and the weight of performance. A reflection tool, not a clinical assessment or diagnosis.'),
  },
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
]).concat(ARTICLE_PAGES);

module.exports = { ORIGIN, SITE_NAME, PERSON_ID, WEBSITE_ID, OG_DEFAULT, PAGES, COPY, TOOL_LIST, ARTICLE_PAGES };
