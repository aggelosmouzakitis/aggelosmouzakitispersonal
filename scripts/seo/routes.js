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
  ['/founders/', 301, '/therapy-for-founders/'],
  ['/solopreneurs/', 301, '/professional-coaching/'],
  ['/getinterviewed/', 410, null],
  ['/wtf-friday/', 410, null],
  ['/ask-me-anything/', 410, null],
  ['/ask-me-anything/el', 410, null, 'printed QR code URL'],
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
  ['/imposter-syndrome-therapy/', 200, null, 'HOLD — unchanged'],
  // Not in the brief's tables; decided by analogy (see the report).
  ['/find-your-focus-area/', 301, '/free-tools/', 'not in brief'],
  ['/free-tools/find-your-focus-area/', 301, '/free-tools/', 'not in brief'],
  ['/free-tools/roast-my-offer/', 301, '/professional-coaching/', 'not in brief'],
  ['/schedule/', 301, '/contact/', 'was → /'],
  ['/faqs/', 301, '/faq/', 'was → /'],
  ['/clarity-tools/', 301, '/free-tools/'],
  // Old essays: not restored in this pass, so they land on the Writing hub.
  ['/blog/vacation-same-feeling/', 301, '/blog/', 'old essay'],
  ['/blog/the-high-cost-of-endless-pondering/', 301, '/blog/', 'old essay'],
  ['/archive/', 200, null, 'private, noindex'],
  ['/this-page-does-not-exist/', 404, null],
].map(([u, s, t, n]) => [u, s, t, n || '']);

module.exports = { CANONICAL, LEGACY };
