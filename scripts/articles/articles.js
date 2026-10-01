// articles.js — the articles the site publishes outside the canonical copy.
//
// An article lives at its own URL (/work-anxiety/, not /blog/<slug>/) and sits
// on the blog: it is listed under Featured on /blog/ (newest first), its
// breadcrumb is Home › Writing, and the header shows Writing as its section.
//
// Each entry names its editorial brief, content/articles/<slug>.md: Part 1 the
// page spec (URL, title tag, meta description, H1), Part 2 the article itself
// (the editorial source of truth), Part 3 the implementation notes (TOC labels
// and anchor IDs, author block, CTA) and Part 4 the QA list. Below are only the
// decisions a brief leaves to the implementation.
//
//   node scripts/articles/extract-articles.js   # brief → site-articles.jsx, article-<slug>.jsx
//   node scripts/articles/check-articles.js     # the published page against the brief
//
// scripts/seo/site-meta.js gives each article its metadata and BlogPosting,
// scripts/gen-site-pages.js its page shell.
//
// Fields
//   published   the genuine release, ISO 8601 with its offset (Europe/Dublin
//               and Europe/London are both +01:00 until 25 October 2026). The
//               visible "October 2026" and datePublished both come from here:
//               if the page goes live on another day, change it and re-run
//               the pipeline.
//   modified    only after a substantive revision: adds dateModified and a
//               visible "Updated <Month YYYY>". Never for a typo fix.
//   authorImage the brief's "[USE APPROVED AGGELOS AUTHOR IMAGE]": the approved
//               About portrait, already the image of the site's Person entity.
//   related     the canonical page the /blog/ listing names under "Related:".
//   table       caption: a sentence that ends the paragraph before the table
//               and becomes its <caption> (visible once); without one, the
//               table is named by its section's H2. note: the start of the
//               paragraph next to the table (before or after it) that
//               describes it (aria-describedby).
//   callout     the one safety callout, if the brief asks for one: the final
//               paragraph of `section`, beginning with `startsWith`.
//   wordCount   what the brief counts: 'headline', 'deck', 'body' (the
//               introduction and every section, FAQ included), 'references'.
//               Never the breadcrumb, metadata line, author block, TOC or CTA.
//   links       Part 2's [INTERNAL LINK NEEDED: …] placeholders, by their text.
//               While unresolved (null, or { pointer } without `resolved`),
//               the pointer stays out of the published page and
//               check-articles.js reports a PUBLICATION BLOCKER. The pointer is
//               the sentence holding the placeholder, or `pointer` (the exact
//               text, placeholder included) when the sentences before it only
//               lead to the link. To resolve one, once its page is live and
//               its canonical URL verified, set `resolved` to the Markdown
//               that replaces the pointer (or, for null entries, give that
//               Markdown as a string: it replaces the placeholder alone).
//               Never a guessed URL.

const ARTICLES = [
  {
    slug: 'work-anxiety',
    brief: 'content/articles/work-anxiety.md',
    published: '2026-10-01T22:04:00+01:00',
    modified: null,
    category: 'Guide',
    readTime: '20 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Anxiety & Overthinking', href: '/anxiety-overthinking/' },
    table: { caption: 'The columns can both describe the same person.', note: 'The table below offers' },
    callout: { section: 'When professional help makes sense', startsWith: 'Medical safety:' },
    // "excluding navigation, author credentials and CTA"
    wordCount: ['headline', 'deck', 'body', 'references'],
    links: {
      'guide to rumination and repeatedly replaying work conversations': null,
      'guide to workplace boundaries when saying no has consequences': null,
      // Must be the editorial article itself, not the quit-your-job tool or
      // a career service page.
      'Article 3, deciding whether to quit your job, including health, finances and alternatives': null,
    },
  },
  {
    slug: 'burnout-at-work',
    brief: 'content/articles/burnout-at-work.md',
    published: '2026-10-01T22:26:00+01:00',
    modified: null,
    category: 'Guide',
    readTime: '15 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    // A separate educational guide: related to the service page, never
    // redirected or canonicalised to it.
    related: { label: 'Burnout & Can’t Switch Off', href: '/executive-burnout-therapy/' },
    // No caption sentence: the table is named by its H2 ("Burnout vs stress")
    // and described by the sentence the brief keeps directly below it.
    table: { note: 'This is an orientation, not a diagnostic test.' },
    // The urgent-help paragraph stays normal text: no callout.
    callout: null,
    // "the implemented editorial body, including FAQ and excluding
    // navigation, references and commercial CTA"
    wordCount: ['body'],
    // Each placeholder follows a sentence that only leads to its guide; while
    // unresolved, both stay out of the page. Resolve with the brief's own
    // wording linked, e.g. '[The companion guide](/…/) examines the situation
    // where you are still delivering but have very little left afterwards.'
    links: {
      'Article 5, high-functioning exhaustion and maintaining performance while depleted': {
        pointer: 'The companion guide examines the situation where you are still delivering but have very little left afterwards. [INTERNAL LINK NEEDED: Article 5, high-functioning exhaustion and maintaining performance while depleted]',
        resolved: null,
      },
      'Article 10, stress versus burnout': {
        pointer: 'The full comparison considers the overlaps in more detail. [INTERNAL LINK NEEDED: Article 10, stress versus burnout]',
        resolved: null,
      },
      'comparison guide covering burnout, anxiety and depression': {
        pointer: 'The comparison guide examines these overlaps and the limits of self-assessment. [INTERNAL LINK NEEDED: comparison guide covering burnout, anxiety and depression]',
        resolved: null,
      },
    },
  },
];

const ORIGIN = 'https://aggelosmouzakitis.com';

// The generated files for an article (the page loads its data bundle).
const pageFile = (a) => a.slug + '/index.html';
const dataSource = (a) => 'article-' + a.slug + '.jsx';
const dataBundle = (a) => 'article-' + a.slug + '.js';
const INDEX_SOURCE = 'site-articles.jsx';
const INDEX_BUNDLE = 'site-articles.js';

// The generated article data (plain JavaScript that sets
// window.SITE_ARTICLE_PAGES[slug]), read in Node the way site-meta.js reads
// site-copy.jsx.
function loadArticle(a) {
  const fs = require('fs');
  const path = require('path');
  const window = {};
  // eslint-disable-next-line no-eval
  eval(fs.readFileSync(path.join(__dirname, '..', '..', dataSource(a)), 'utf8'));
  const page = window.SITE_ARTICLE_PAGES && window.SITE_ARTICLE_PAGES[a.slug];
  if (!page) throw new Error(`${dataSource(a)} does not define "${a.slug}": run node scripts/articles/extract-articles.js`);
  return page;
}

module.exports = { ARTICLES, ORIGIN, pageFile, dataSource, dataBundle, INDEX_SOURCE, INDEX_BUNDLE, loadArticle };
