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
//   table       caption: the table's <caption> — a sentence moved from the end
//               of the paragraph before the table (captionFrom 'paragraph',
//               the default; visible once), or one Part 3 writes
//               (captionFrom 'brief'); captionHidden keeps it for assistive
//               technology only. Without a caption the table is named by its
//               section's H2. note: the start of the paragraph next to the
//               table (before or after it) that describes it
//               (aria-describedby). narrow: below 640px, 'stack' (labelled
//               row groups, the default), 'scroll' (the table scrolls in a
//               labelled, focusable region) or 'fit' (a narrow table that
//               stays a table and wraps). A "---:" delimiter right-aligns its
//               column (amounts).
//   callout     the one safety callout, if the brief asks for one: the final
//               paragraph of `section`, beginning with `startsWith`.
//   wordCount   what the brief counts: 'headline', 'deck', 'body' (the
//               introduction and every section, FAQ included), 'references'.
//               Never the breadcrumb, metadata line, author block, TOC or CTA.
//   url         the page's path when it is not /<slug>/ (an essay brought back
//               keeps its original /blog/<slug>/).
//   source      an essay brought back: the archived page its text comes from
//               (scripts/articles/from-archive.js); check-articles.js proves
//               the page carries that text word for word.
//   listing     an essay brought back: the title of the canonical Featured
//               entry on /blog/ it makes real (that entry's own wording stays;
//               it gains the date, the read time and its links).
//   close       'writing': no CTA of its own; the page ends with the Writing
//               page's close from the canonical copy.
//   labels      the metadata line's labels when the brief fixes them
//               ("Guide · <date> · …"); default: category, then type.
//   replaces    an article that substantively replaces an earlier one at
//               another URL: those former URLs, each a direct 301 here
//               (netlify.toml, scripts/seo/routes.js). `published` keeps the
//               first publication date as recorded, and `modified` is the day
//               the revision went live, both as dates where no verified time
//               exists (no time of day or offset invented).
//   schemaModified 'published' when the brief asks for dateModified to equal
//               the publication timestamp until a substantive update (no
//               visible "Updated").
//   relink      links in Part 2 to a page the site has since merged into
//               another: { from: to }, the target its netlify.toml 301 rule
//               already gives (the extractor checks it). The anchor text stays;
//               the link skips the redirect.
//   notice      the H2 of a section the brief keeps fully visible in the
//               restrained notice treatment (an urgent-help section): the
//               whole section, heading included, in the callout's style.
//   contextLinks internal links the site adds to the article's own wording,
//               beyond those its brief supplies: [exact phrase, href]. The
//               phrase must occur once and outside any link; it is wrapped,
//               never reworded. Used sparingly, to tie the guides together and
//               give each a path to its service page.
//   inLanguage  for BlogPosting (default en-GB, as the guides' briefs ask).
//   schemaImage 'none' when the brief rules out the author portrait as the
//               article's image; 'author' when the brief keeps it to the
//               author's image field (the BlogPosting's author, not the
//               article); default: the approved author image.
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
    contextLinks: [['Fear of being exposed as inadequate', '/imposter-syndrome-at-work/'], ['perfectionism develops around preventing criticism or embarrassment', '/perfectionism-at-work/']],
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
      // Article 3 is the editorial guide published with it in this release
      // (its brief names this guide and burnout-at-work as companion
      // Articles 1 and 2), not the quit-your-job tool or a career service page.
      'Article 3, deciding whether to quit your job, including health, finances and alternatives':
        '[the guide to deciding whether to quit your job](/my-job-gives-me-anxiety-should-i-quit/)',
    },
  },
  {
    slug: 'burnout-at-work',
    contextLinks: [['Therapy may help when repeated overcommitment or difficulty stopping is contributing', '/executive-burnout-therapy/']],
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
      // Article 5 is the high-functioning burnout guide ("still performing
      // but running on empty"), live at /high-functioning-burnout/.
      'Article 5, high-functioning exhaustion and maintaining performance while depleted': {
        pointer: 'The companion guide examines the situation where you are still delivering but have very little left afterwards. [INTERNAL LINK NEEDED: Article 5, high-functioning exhaustion and maintaining performance while depleted]',
        resolved: 'The [companion guide](/high-functioning-burnout/) examines the situation where you are still delivering but have very little left afterwards.',
      },
      'Article 10, stress versus burnout': {
        pointer: 'The full comparison considers the overlaps in more detail. [INTERNAL LINK NEEDED: Article 10, stress versus burnout]',
        // Article 10 is the stress / burnout / depression comparison guide.
        resolved: 'The [full comparison](/burnout-vs-stress-depression/) considers the overlaps in more detail.',
      },
      'comparison guide covering burnout, anxiety and depression': {
        pointer: 'The comparison guide examines these overlaps and the limits of self-assessment. [INTERNAL LINK NEEDED: comparison guide covering burnout, anxiety and depression]',
        resolved: null,
      },
    },
  },
  {
    slug: 'my-job-gives-me-anxiety-should-i-quit',
    brief: 'content/articles/my-job-gives-me-anxiety-should-i-quit.md',
    published: '2026-10-01T22:36:00+01:00',
    modified: null,
    // "Category label: `Career & Work`. Article type label: `Guide`."
    category: 'Career & Work',
    type: 'Guide',
    readTime: '11 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Career Change & Decisions', href: '/career-transition-therapy/' },
    // Part 3 writes the caption ("visually hidden if the template requires":
    // hidden, so the visible article stays Part 2) and asks for scrolling in
    // a labelled, keyboard-accessible wrapper on narrow screens, not cards.
    table: { caption: 'Changes to test before resigning and what to observe', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    // "may use the template's restrained safety-note treatment"
    callout: { section: 'Therapist, career coach or mentor?', startsWith: 'If you cannot keep yourself safe' },
    // "excluding navigation, the author strip, References and the commercial CTA"
    wordCount: ['headline', 'deck', 'body'],
    links: {},
  },
  {
    slug: 'cant-switch-off-from-work',
    contextLinks: [['Therapy can help when checking and rumination repeatedly affect sleep or relationships', '/executive-burnout-therapy/']],
    brief: 'content/articles/cant-switch-off-from-work.md',
    published: '2026-10-01T22:57:00+01:00',
    modified: null,
    // "Category: Career & Work. Article type label: Guide." and "Display a
    // restrained metadata line: `Guide · [actual publication month and year]
    // · 11 min read`": the line shows Guide; the category is articleSection.
    category: 'Career & Work',
    type: 'Guide',
    labels: ['Guide'],
    readTime: '11 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Burnout & Can’t Switch Off', href: '/executive-burnout-therapy/' },
    // "Preserve the inline GP and insomnia guidance … It does not require a
    // separate warning banner": no callout.
    callout: null,
    // The brief sets no scope: the editorial text, as for the other guides
    // whose briefs leave the references out.
    wordCount: ['headline', 'deck', 'body'],
    // "Do not invent an image URL or use an arbitrary portrait as a claimed
    // article illustration": no image in the BlogPosting.
    schemaImage: 'none',
    links: {},
  },
  {
    slug: 'high-functioning-burnout',
    contextLinks: [['Stress and burnout overlap', '/burnout-vs-stress-depression/'], ['Therapy can help with recurring patterns and distress', '/executive-burnout-therapy/']],
    brief: 'content/articles/high-functioning-burnout.md',
    // A substantive replacement of the essay published at
    // /blog/high-functioning-burnout-pandemic/ on 16 April 2026 (its archived
    // page records datePublished 2026-04-16, a date only). That date stays;
    // `modified` is the day this revision went live.
    replaces: ['/blog/high-functioning-burnout-pandemic/', '/archive/blog/high-functioning-burnout-pandemic/'],
    published: '2026-04-16',
    modified: '2026-10-01',
    category: 'Guide',
    readTime: '12 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Burnout & Can’t Switch Off', href: '/executive-burnout-therapy/' },
    // Part 3 writes the "Accessible caption" (hidden, so the visible article
    // stays Part 2) and asks that "any necessary scrolling must stay within an
    // accessible table wrapper": the table keeps its rows and columns.
    table: { caption: 'Patterns to examine during demanding work; this comparison is not a diagnostic test', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    // "no additional diagnostic or alarmist banner is required"
    callout: null,
    // "from the deployed editorial body, excluding site chrome": the body, FAQ
    // included, as for burnout-at-work's "editorial body".
    wordCount: ['body'],
    // "Use the approved author portrait only in the appropriate author-image
    // field; do not invent a separate editorial illustration."
    schemaImage: 'author',
    links: {},
  },
  {
    slug: 'career-change-anxiety',
    contextLinks: [['An adjacent move may preserve more experience than retraining for a completely different occupation', '/career-change-at-40/']],
    brief: 'content/articles/career-change-anxiety.md',
    published: '2026-10-01T23:20:00+01:00',
    modified: null,
    category: 'Guide',
    readTime: '14 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    // An informational guide beside the service page: related to it, never
    // redirected or canonicalised to it.
    related: { label: 'Career Change & Decisions', href: '/career-transition-therapy/' },
    // Part 3 writes the "Accessible caption" (hidden, so the visible article
    // stays Part 2); "any necessary horizontal scrolling belongs inside an
    // accessible wrapper".
    table: { caption: 'Questions to distinguish dissatisfaction with a role, an employer or a career', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    // "No … additional callout or clinical safety banner is required"
    callout: null,
    // "from the deployed editorial body, excluding site chrome, TOC and this
    // document's other parts"
    wordCount: ['body'],
    // "Reuse the established author identity and approved portrait in the
    // appropriate author-image field. Do not invent an editorial image."
    schemaImage: 'author',
    links: {},
  },
  {
    slug: 'career-change-at-40',
    brief: 'content/articles/career-change-at-40.md',
    published: '2026-10-01T23:36:00+01:00',
    modified: null,
    // "`dateModified`: the actual publication timestamp initially"
    schemaModified: 'published',
    category: 'Guide',
    readTime: '14 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    // Distinct from /career-change-anxiety/ and the service page it relates to.
    related: { label: 'Career Change & Decisions', href: '/career-transition-therapy/' },
    // "Accessible name: `Illustrative household transition budget`" (hidden:
    // the visible article stays Part 2); two columns that wrap, amounts
    // right-aligned.
    table: { caption: 'Illustrative household transition budget', captionFrom: 'brief', captionHidden: true, narrow: 'fit' },
    // "do not add an unrelated safety banner"
    callout: null,
    // "calculate from the published editorial content"
    wordCount: ['headline', 'deck', 'body'],
    // "`image`: … omit if there is no suitable existing article image. Do not
    // invent a hero image": the author portrait is not an article image.
    schemaImage: 'none',
    links: {},
  },
  {
    slug: 'imposter-syndrome-at-work',
    brief: 'content/articles/imposter-syndrome-at-work.md',
    published: '2026-10-01T23:48:00+01:00',
    modified: null,
    // "`dateModified`: the publication timestamp initially"
    schemaModified: 'published',
    category: 'Guide',
    readTime: '13 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Achievement & Self-Worth', href: '/achievement-self-worth/' },
    // "Accessible name: `…`" (hidden: the visible article stays Part 2); three
    // long columns scroll inside an accessibly named, focusable wrapper.
    table: { caption: 'Questions for assessing imposter feelings and development needs', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    callout: null,
    // "calculate from the public editorial content"
    wordCount: ['headline', 'deck', 'body'],
    // "`image`: only an approved image actually used on the page. Do not
    // invent a hero image": no article image.
    schemaImage: 'none',
    // The brief takes /imposter-syndrome-therapy/ for a live service page, but
    // it was merged into Achievement & Self-Worth (its 301 since the canonical
    // restructure): the anchor stays, the link goes straight there.
    relink: { '/imposter-syndrome-therapy/': '/achievement-self-worth/' },
    links: {
      // Article 9 is the perfectionism guide, live at /perfectionism-at-work/.
      // The brief authorises exactly this replacement: "Replace the
      // placeholder with the contextual linked phrase `the guide to
      // perfectionism at work`".
      'Article 9 guide to perfectionism at work': '[the guide to perfectionism at work](/perfectionism-at-work/)',
    },
  },
  {
    slug: 'perfectionism-at-work',
    contextLinks: [['keep delivering while feeling progressively more exhausted and resentful', '/high-functioning-burnout/']],
    brief: 'content/articles/perfectionism-at-work.md',
    published: '2026-10-02T06:53:00+01:00',
    modified: null,
    // "`dateModified`: initially the publication timestamp"
    schemaModified: 'published',
    category: 'Guide',
    readTime: '12 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Achievement & Self-Worth', href: '/achievement-self-worth/' },
    // "Accessible name: `…`" (hidden: the visible article stays Part 2);
    // three long columns scroll inside an accessibly named, focusable wrapper.
    table: { caption: 'Examples of task-specific quality requirements and stopping rules', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    callout: null,
    // "calculate from visible editorial content"
    wordCount: ['headline', 'deck', 'body'],
    // "`image`: an approved image actually used on the page. Do not invent a
    // hero image": the page has no article image.
    schemaImage: 'none',
    links: {},
  },
  {
    slug: 'burnout-vs-stress-depression',
    contextLinks: [['personal patterns that contribute to overwork', '/executive-burnout-therapy/']],
    brief: 'content/articles/burnout-vs-stress-depression.md',
    published: '2026-10-02T07:14:00+01:00',
    modified: null,
    // "`dateModified`: initially the publication timestamp"
    schemaModified: 'published',
    category: 'Guide',
    readTime: '11 min read',
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: { label: 'Burnout & Can’t Switch Off', href: '/executive-burnout-therapy/' },
    // "Accessible name: `…`" (hidden: the visible article stays Part 2); four
    // columns scroll inside an accessibly named, focusable wrapper.
    table: { caption: 'Broad tendencies in stress, occupational burnout and depression', captionFrom: 'brief', captionHidden: true, narrow: 'scroll' },
    callout: null,
    // "Keep `When to get urgent help` completely visible …, using the
    // established restrained notice treatment"
    notice: 'When to get urgent help',
    // "calculate from visible editorial content"
    wordCount: ['headline', 'deck', 'body'],
    // As for the other guides of this series: no article image to give.
    schemaImage: 'none',
    links: {},
  },
  // The four essays the canonical copy features on /blog/, brought back from
  // the archive at their original URLs (from-archive.js): text word for word,
  // first publication dates kept, the canonical entries made real.
  ...[
    ['vacation-same-feeling', 'You took the vacation. You came back feeling the same way.', '2026-04-24', '2 min read'],
    ['who-are-you-if-you-are-not-crushing-it', 'Who are you if you’re not “crushing” it?', '2026-01-27', '7 min read'],
    ['the-loneliness-and-emotional-pressure-that-founders-experience', 'The loneliness and emotional pressure that founders experience', '2026-02-09', '10 min read'],
    ['the-high-cost-of-endless-pondering', 'The high cost of endless pondering', '2025-12-02', '10 min read'],
  ].map(([slug, listing, published, readTime]) => ({
    slug,
    url: `/blog/${slug}/`,
    brief: `content/articles/${slug}.md`,
    source: `archive/blog/${slug}/index.html`,
    listing,
    published,
    modified: null,
    category: 'Essay',
    readTime,
    authorImage: '/img/aggelos-about.webp',
    authorImageSize: [840, 1050],
    related: null, // the canonical entry names its own
    close: 'writing',
    // written in mixed British and American spelling, before the guides
    inLanguage: 'en',
    wordCount: ['headline', 'deck', 'body'],
    links: {},
  })),
];

const ORIGIN = 'https://aggelosmouzakitis.com';

// The generated files for an article (the page loads its data bundle).
const urlOf = (a) => a.url || '/' + a.slug + '/';
const pageFile = (a) => urlOf(a).slice(1) + 'index.html';
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

module.exports = { ARTICLES, ORIGIN, urlOf, pageFile, dataSource, dataBundle, INDEX_SOURCE, INDEX_BUNDLE, loadArticle };
