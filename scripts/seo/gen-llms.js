// gen-llms.js — write llms.txt from scripts/seo/site-meta.js.
//
// The page lists use each page's name from the canonical copy and its meta
// description, so they cannot drift from the site; the practice summary and
// the notes are fixed text below, stated in the site's own terms.
//
//   node scripts/seo/gen-llms.js

const fs = require('fs');
const path = require('path');
const { ORIGIN, PAGES, COPY, ARTICLE_PAGES } = require('./site-meta.js');

const ROOT = path.resolve(__dirname, '..', '..');

// [heading, page urls]
const GROUPS = [
  ['Work with me', ['/work-with-me/', '/individual-psychotherapy/', '/couples-therapy/', '/professional-coaching/', '/fees-and-practicalities/']],
  ['Who I work with', ['/therapy-for-men-in-tech/', '/therapy-for-software-engineers/', '/therapy-for-founders/', '/therapy-for-executives/',
    '/therapy-for-men/', '/greek-speaking-psychotherapist/']],
  ['Common problems', ['/relationship-problems-men/', '/separation-divorce-men/', '/work-affecting-relationship/',
    '/executive-burnout-therapy/', '/career-transition-therapy/', '/anxiety-overthinking/', '/achievement-self-worth/']],
  ['Resources', ['/considering-therapy/', '/therapy-vs-coaching/', '/undisguised/', '/faq/', '/blog/', '/free-tools/',
    '/work-life-check/', '/free-tools/burned-out/', '/free-tools/quit-your-job/', '/reviews/']],
  // The articles on the blog, newest first (their own URLs, listed on /blog/).
  ['Writing', ARTICLE_PAGES.slice().sort((x, y) => Date.parse(y.article.publishedTime) - Date.parse(x.article.publishedTime)).map((p) => p.url)],
  ['About and contact', ['/about/', '/contact/', '/confidentiality/']],
].filter(([, urls]) => urls.length);

// The tools are not in the canonical copy; their entries describe them plainly.
const TOOLS = {
  '/work-life-check/': ['The Work & Life Check', 'A free 4-minute reflection on where work may be costing you most, across five areas: switching off, recovery, an open decision, relationships and the weight of performance. Not a clinical assessment and not a diagnosis.'],
  '/free-tools/burned-out/': ['Are you burned out?', 'A short reflection tool on burnout. Not a clinical assessment and not a diagnosis.'],
  '/free-tools/quit-your-job/': ['What’s making you want to quit your job?', 'A short reflection tool on wanting to leave a job. Not a clinical assessment and not a diagnosis.'],
};

const byUrl = new Map(PAGES.map((p) => [p.url, p]));
const copyByUrl = new Map(Object.values(COPY).map((c) => [c.url, c]));

function entry(url) {
  if (TOOLS[url]) return `- [${TOOLS[url][0]}](${ORIGIN}${url}): ${TOOLS[url][1]}`;
  const p = byUrl.get(url);
  const c = copyByUrl.get(url);
  if (!p || !(c || p.name)) throw new Error(`gen-llms: no page for ${url}`);
  return `- [${c ? c.navLabel || c.name : p.name}](${ORIGIN}${url}): ${p.description}`;
}

const listed = new Set([].concat(...GROUPS.map((g) => g[1])));
const missing = PAGES.map((p) => p.url).filter((u) => u !== '/' && !listed.has(u));
if (missing.length) throw new Error(`gen-llms: pages not listed: ${missing.join(', ')}`);

const home = byUrl.get('/');
const out = `# Aggelos Mouzakitis

> ${home.description}

Aggelos Mouzakitis is a BACP-registered psychotherapist with an MSc in Integrative Counselling & Psychotherapy and more than 18 years across product, growth and technology.

Individual psychotherapy is the main part of the practice. Couples therapy is a
separate service for partners who want to work on the relationship together.
Professional coaching is a separate service for bounded professional decisions
and situations.

## Practicalities

- Individual psychotherapy sessions usually last 50–60 minutes, normally weekly
  for at least the first few months; frequency is reviewed together after that.
- Couples sessions are weekly (usually 50–60 minutes) or biweekly (can be 90
  minutes); the format is agreed before ongoing work begins.
- Based in Ireland. Work is primarily online by video, in Greek or English.
- Fees: €100 or £90 per standard session (individual psychotherapy, a standard
  50–60-minute couples session or professional coaching). The fee for the
  longer couples session is agreed separately before booking.
- The first conversation is a free 30-minute clarity call.
- Clients are across the UK and Europe, including Ireland and Greece, with the UK as the main focus.
- Professional rules depend on where both therapist and client are located;
  eligibility is confirmed before ongoing therapy begins.
- This is not a crisis or emergency service.

${GROUPS.map(([h, urls]) => `## ${h}\n\n${urls.map(entry).join('\n')}`).join('\n\n')}

## Notes

- Professional description: "BACP-registered psychotherapist". "Licensed
  psychotherapist" is not accurate wording for this practice and is not used.
- Directory listings (Psychology Today UK and Ireland, It's Complicated,
  HeadsUpGuys) may show a city, such as London or Cork, because the directory
  requires one, and may list the name as Angelos Mouzakitis. The practice is based in Ireland and works
  primarily online; where a listing differs from this site on location, fee or
  format, this site is current.
- Undisguised (${ORIGIN}/undisguised/) is Aggelos Mouzakitis's point of view on
  living deliberately: a manifesto, not a clinical model, treatment method,
  assessment or service. It names four familiar patterns (Ambition,
  Independence, Responsibility, Being liked) and four movements (See Clearly,
  Choose Deliberately, Act Courageously, Live Connected); the movements are
  something to return to, not a fixed sequence of steps. The Undisguised
  newsletter is at https://www.undisguised.io/.
- The previous business and career advisory site has been retired; its
  service, tool and Greek-language (/el/) URLs redirect to their closest
  current page or return 410 Gone.
- Canonical host is ${ORIGIN} with a trailing slash on every page URL.
`;

fs.writeFileSync(path.join(ROOT, 'llms.txt'), out);
console.log(`llms.txt: ${listed.size + 1} pages`);
