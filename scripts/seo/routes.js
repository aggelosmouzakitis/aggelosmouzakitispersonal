// routes.js — the migration table: every canonical URL and every legacy URL
// with the response it must give (implementation brief, Phases 1 and 5, plus
// the retirements the brief did not list, marked "not in brief").
// Used by scripts/qa-routes.js (full status table) and scripts/seo/seo-check.js.

// [url, expected status of the first response, final target (301s), note]
const CANONICAL = [
  '/', '/about/', '/work-with-me/', '/individual-psychotherapy/', '/couples-therapy/',
  '/professional-coaching/', '/therapy-for-men-in-tech/', '/therapy-for-founders/',
  '/therapy-for-executives/', '/greek-speaking-psychotherapist/', '/relationship-problems-men/',
  '/separation-divorce-men/', '/work-affecting-relationship/', '/executive-burnout-therapy/',
  '/career-transition-therapy/', '/anxiety-overthinking/', '/achievement-self-worth/',
  '/considering-therapy/', '/faq/', '/reviews/', '/free-tools/', '/blog/', '/contact/',
  '/confidentiality/',
].map((u) => [u, 200, null, 'canonical']).concat([
  ['/free-tools/quit-your-job/', 200, null, 'tool (kept)'],
  ['/free-tools/burned-out/', 200, null, 'tool (kept)'],
]);

// The old essays, one explicit rule each in netlify.toml (force = false, so an
// essay published again at blog/<slug>/index.html is served at its original
// URL). 301 where a canonical page covers the essay's main subject; 410 where
// none does. Featured = listed under "Selected essays" on /blog/, the first
// candidates to be published again.
// [slug, target or null for 410, reason]
const ESSAYS = [
  ['high-functioning-burnout-pandemic', '/executive-burnout-therapy/', 'burnout in high performers who keep performing'],
  ['high-performance-as-a-way-to-get-accepted-by-your-family', '/achievement-self-worth/', 'achievement as the way to earn family approval'],
  ['is-it-post-holiday-anxiety-or-just-clarity', '/career-transition-therapy/', 'post-holiday dread as clarity about leaving the job'],
  ['sample-post', '/achievement-self-worth/', 'performance regulating self-worth; live two days in April 2026'],
  ['self-analysis-as-a-meta-way-to-maintain-control', '/considering-therapy/', 'insight that stops changing anything ("I already understand why I do it")'],
  ['shared-accountability-leading-without-authority', '/therapy-for-men-in-tech/', 'tech work culture: accountable without authority'],
  ['the-coaching-industrys-credibility-problem', null, 'coaching-industry commentary; no page covers it'],
  ['the-elaborate-performance-of-trying-to-change', '/considering-therapy/', 'therapy and coaching used to avoid change'],
  ['the-high-cost-of-endless-pondering', '/anxiety-overthinking/', 'endless analysis instead of deciding; featured'],
  ['the-loneliness-and-emotional-pressure-that-founders-experience', '/therapy-for-founders/', 'founder loneliness and pressure; featured'],
  ['the-parent-archetypes-creating-high-performers-with-chronic-self-doubt', '/achievement-self-worth/', 'family roots of achievement-based self-worth'],
  ['the-turtle-and-the-shell', '/career-transition-therapy/', 'staying in a role that no longer fits; identity without the title'],
  ['therapy-has-a-branding-problem', '/considering-therapy/', 'how therapy is seen; scepticism about starting'],
  ['vacation-same-feeling', '/executive-burnout-therapy/', 'time off no longer fixes it; featured'],
  ['we-ve-turned-adhd-diagnosis-into-a-trend', null, 'ADHD diagnosis commentary; no page covers it'],
  ['what-doubt-is-actually-protecting-you-from', '/anxiety-overthinking/', 'doubt dressed up as needing more information'],
  ['what-lost-purpose-actually-means-for-many-high-performers', '/achievement-self-worth/', '"lost purpose" in high performers'],
  ['what-went-wrong-ep01-productivity', '/executive-burnout-therapy/', 'neither working nor resting; unable to switch off'],
  ['what-went-wrong-ep02-happiness', '/achievement-self-worth/', 'happiness sold as the next achievement; comparison'],
  ['what-went-wrong-ep03-body-and-therapy', '/considering-therapy/', 'understanding without change; what therapy works on'],
  ['what-went-wrong-ep04-avoidance', '/anxiety-overthinking/', 'avoidance that looks productive; research instead of action'],
  ['when-founder-builds-a-company-around-his-life', '/therapy-for-founders/', 'the company and the founder’s life'],
  ['when-the-drive-to-succeed-is-really-just-the-fear-of-falling-behind', '/achievement-self-worth/', 'drive as fear of falling behind'],
  ['who-are-you-if-you-are-not-crushing-it', '/achievement-self-worth/', 'identity built on succeeding; featured'],
  ['why-do-high-performers-keep-winning-and-still-feel-stuck', '/achievement-self-worth/', 'winning and still feeling stuck'],
  ['why-hard-work-alone-doesnt-advance-you', '/therapy-for-executives/', 'passed over; the job changes with seniority'],
  ['you-re-creating-the-exact-problem-you-re-trying-to-avoid', '/career-transition-therapy/', 'checked out while waiting to leave'],
  ['you-re-just-trading-one-type-of-friction-for-another', '/career-transition-therapy/', 'changing jobs to escape friction'],
];

const LEGACY = [
  ['/start-here/', 301, '/considering-therapy/'],
  ['/psychotherapy-decision-coaching/', 301, '/individual-psychotherapy/'],
  ['/career-strategy-consulting/', 301, '/professional-coaching/'],
  ['/solopreneur-growth-consulting/', 301, '/professional-coaching/'],
  ['/1-to-1/', 301, '/work-with-me/'],
  ['/how-i-work/', 301, '/work-with-me/'],
  ['/book/', 301, '/contact/'],
  ['/startingdiagnostic/', 301, '/considering-therapy/'],
  ['/burnout-diagnostic/', 301, '/free-tools/burned-out/'],
  ['/imposter-syndrome-therapy/', 301, '/achievement-self-worth/', 'HOLD ended: merged'],
  ['/founders/', 301, '/therapy-for-founders/'],
  ['/solopreneurs/', 301, '/professional-coaching/'],
  ['/getinterviewed/', 410, null],
  ['/wtf-friday/', 410, null],
  ['/ask-me-anything/', 410, null],
  ['/ask-me-anything/el', 200, null, 'printed QR codes: served at this URL, noindex'],
  ['/ask-me-anything/el/', 200, null, 'printed QR codes: same page'],
  ['/el/', 301, '/'],
  ['/el/about/', 301, '/about/'],
  ['/el/1-to-1/', 301, '/work-with-me/'],
  ['/el/reviews/', 301, '/reviews/'],
  ['/el/executive-coaching/', 301, '/professional-coaching/'],
  ['/el/career-coaching/', 301, '/professional-coaching/'],
  ['/el/burnout/', 301, '/executive-burnout-therapy/'],
  ['/el/imposter-syndrome/', 301, '/achievement-self-worth/'],
  ['/el/startingdiagnostic/', 301, '/considering-therapy/'],
  ['/el/confidentiality/', 301, '/confidentiality/'],
  ['/el/book/', 301, '/contact/'],
  ['/greek-speaking-therapist-london/', 301, '/greek-speaking-psychotherapist/'],
  ['/greek-speaking-therapist-dublin/', 301, '/greek-speaking-psychotherapist/'],
  ['/greek-speaking-therapist-manchester/', 301, '/greek-speaking-psychotherapist/'],
  ['/greek-speaking-therapist-new-york/', 410, null],
  ['/free-tools/business-constraint/', 301, '/professional-coaching/'],
  ['/free-tools/strategy-or-execution/', 301, '/professional-coaching/'],
  ['/free-tools/become-a-solopreneur/', 301, '/professional-coaching/'],
  ['/clarity-tools/business-constraint/', 301, '/professional-coaching/'],
  ['/clarity-tools/strategy-or-execution/', 301, '/professional-coaching/'],
  ['/clarity-tools/become-a-solopreneur/', 301, '/professional-coaching/'],
  ['/clarity-tools/quit-your-job/', 301, '/free-tools/quit-your-job/'],
  ['/clarity-tools/burned-out/', 301, '/free-tools/burned-out/'],
  ['/draft/experience-to-offer/', 410, null, 'brief: 404 or 410'],
  ['/draft/private-sparring/', 410, null, 'brief: 404 or 410'],
  ['/draft/solo-business-growth/', 410, null, 'brief: 404 or 410'],
  ['/logoutclub/', 410, null, 'brief: 404 or 410'],
  ['/logoutclub/el/', 410, null, 'brief: 404 or 410'],
  // Not in the brief's tables; decided by analogy (see the report).
  ['/find-your-focus-area/', 301, '/free-tools/', 'not in brief'],
  ['/free-tools/find-your-focus-area/', 301, '/free-tools/', 'not in brief'],
  ['/free-tools/roast-my-offer/', 301, '/professional-coaching/', 'not in brief'],
  ['/schedule/', 301, '/contact/', 'was → /'],
  ['/faqs/', 301, '/faq/', 'was → /'],
  ['/clarity-tools/', 301, '/free-tools/'],
].concat(ESSAYS.map(([slug, to, why]) => [`/blog/${slug}/`, to ? 301 : 410, to, 'essay: ' + why]), [
  ['/archive/', 200, null, 'private, noindex'],
  // URLs that never existed are plain 404s: no catch-all sends them anywhere.
  ['/this-page-does-not-exist/', 404, null],
  ['/el/unknown-page/', 404, null, 'never existed (no /el/* fallback)'],
  ['/blog/unknown-essay/', 404, null, 'never existed (no /blog/* fallback)'],
  ['/founders/unknown/', 404, null, 'never existed (no /x/* catch-alls)'],
  ['/ask-me-anything/unknown/', 404, null, 'never existed'],
  ['/clarity-tools/unknown/', 404, null, 'never existed'],
]).map(([u, s, t, n]) => [u, s, t, n || '']);

// Repository internals: Netlify publishes public/ only (netlify.toml [build],
// filled by scripts/build-public.js), so none of these may be reachable.
const INTERNAL = [
  '/SEO_AUDIT.md', '/SEO_POST_DEPLOY_CHECKLIST.md', '/netlify.toml', '/package.json',
  '/package-lock.json', '/.babelrc', '/.gitignore', '/.github/workflows/build.yml',
  '/scripts/', '/scripts/seo/seo-check.js', '/scripts/seo/routes.js', '/scripts/archive/pages.json',
  '/scripts/leads-apps-script.gs', '/site-unification/', '/site-unification/04-redirect-map.csv',
  '/site-pages.jsx', '/site-copy.jsx', '/site-chrome.jsx', '/lead-capture.jsx',
  '/node_modules/react/package.json', '/admin/', '/admin/config.yml', '/public/index.html',
];

module.exports = { CANONICAL, LEGACY, ESSAYS, INTERNAL };
