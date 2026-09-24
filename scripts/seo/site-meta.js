// site-meta.js — one source of truth for every indexable page's metadata.
//
// Each entry is written by hand against that page's actual visible content, not
// generated from a template: title, description, canonical, Open Graph, Twitter
// and the JSON-LD that page should carry. `scripts/seo/apply-metadata.js` writes
// these into the page <head>s; `scripts/seo/seo-check.js` verifies the result.
//
// Conventions
//   - ORIGIN + path, always https, always a trailing slash, no query strings.
//   - og:url === canonical === the URL that returns 200.
//   - One Person entity for the whole site (PERSON_ID); pages reference it by
//     @id instead of redefining Aggelos as a separate entity each time.
//   - Professional description is "business and career advisor" plus
//     "BACP-registered psychotherapist" everywhere — the site's visible wording.
//     "Licensed psychotherapist" is deliberately not used anywhere.

const ORIGIN = 'https://aggelosmouzakitis.com';
const PERSON_ID = ORIGIN + '/#person';
const WEBSITE_ID = ORIGIN + '/#website';
const SITE_NAME = 'Aggelos Mouzakitis';
const OG_DEFAULT = ORIGIN + '/img/og/home.png';

const abs = (p) => ORIGIN + p;

// ─── The one Person node ─────────────────────────────────────────────────────
// Full definition lives on the homepage and /about/. Every other page carries
// the reference stub below so the @id resolves without duplicating claims.
const PERSON_FULL = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Aggelos Mouzakitis',
  url: ORIGIN + '/',
  image: abs('/img/aggelos.jpg'),
  jobTitle: ['Business & Career Advisor', 'BACP-registered Psychotherapist'],
  description:
    'Business and career advisor and BACP-registered psychotherapist. 18+ years in product and growth, seven of them running his own consultancy, with more than 100 technology companies advised.',
  // Each of these is a heading or a labelled item a visitor can read on
  // /work-with-me/ or /about/. Nothing here is inferred.
  knowsAbout: [
    'Career decisions', 'Going independent', 'Positioning', 'Pricing', 'Sales',
    'Business growth', 'Boundaries', 'Burnout',
    'Jobs to be Done', 'Consumer psychology', 'Psychotherapy',
  ],
  sameAs: [
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

// WebPage / BreadcrumbList for an internal page, both wired to the site entity.
function pageNodes(path, name, crumb, type) {
  const url = abs(path);
  const nodes = [{
    '@type': type || 'WebPage', '@id': url + '#webpage', url, name,
    isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en', about: { '@id': PERSON_ID },
  }];
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' }];
  if (crumb) items.push({ '@type': 'ListItem', position: 2, name: crumb, item: url });
  if (crumb) nodes.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items });
  return nodes;
}

// A free tool is a self-scored questionnaire, not a diagnosis and not a course.
// WebApplication is the only type that matches what the visitor can actually do
// on the page (answer questions in the browser and get a result), so that is
// what each tool declares — nothing about medical or educational outcomes.
function toolNodes(path, name, description) {
  const url = abs(path);
  return pageNodes(path, name, 'Free tools').concat([{
    '@type': 'WebApplication', '@id': url + '#tool', name, url, description,
    browserRequirements: 'Requires JavaScript.', isAccessibleForFree: true,
    author: { '@id': PERSON_ID },
    isPartOf: { '@id': abs('/free-tools/') + '#collection' },
  }]);
}

// ─── Page table ──────────────────────────────────────────────────────────────
// `file` is the on-disk page; `url` is the canonical path. Order is the order
// they appear in the sitemap.
const PAGES = [
  {
    file: 'index.html', url: '/', priority: '1.0', changefreq: 'monthly',
    title: 'Business & Career Advisor | Aggelos Mouzakitis',
    description: 'Practical help with business, career decisions and the patterns that get in the way. Business and career advisor and BACP-registered psychotherapist.',
    ogTitle: 'Business & Career Advisor | Aggelos Mouzakitis',
    ogDescription: 'Practical help with business, career decisions and the person behind both.',
    ogImage: abs('/img/og/home.png'),
    ogImageAlt: 'Aggelos Mouzakitis, business and career advisor and BACP-registered psychotherapist',
    schema: [PERSON_FULL, WEBSITE, {
      '@type': 'WebPage', '@id': abs('/') + '#webpage', url: ORIGIN + '/',
      name: 'Business & Career Advisor | Aggelos Mouzakitis',
      isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en', about: { '@id': PERSON_ID },
    }],
  },
  {
    file: 'work-with-me/index.html', url: '/work-with-me/', priority: '0.9', changefreq: 'monthly',
    title: 'Work With Me | Aggelos Mouzakitis',
    description: 'Work on a specific business, career or personal problem with direct advice, psychological depth and a Jobs to be Done-informed approach.',
    ogTitle: 'Work With Me | Aggelos Mouzakitis',
    ogDescription: 'Business, career and personal problems. One way of working: understand what is happening, what you want instead and what is getting in the way.',
    ogImage: abs('/img/og/work-with-me.png'),
    ogImageAlt: '1:1 work with Aggelos Mouzakitis on business, career and personal problems',
    schema: pageNodes('/work-with-me/', 'Work With Me | Aggelos Mouzakitis', 'Work with me').concat([
      PERSON_REF,
      {
        // Only what the page states: one 1:1 service, provided by Aggelos,
        // on business, career or personal problems. No price, no location, no
        // delivery channel and no languages, because the page names none.
        '@type': 'Service', '@id': abs('/work-with-me/') + '#service',
        name: 'Work with me',
        serviceType: 'Business and career advisory with psychotherapeutic work',
        url: abs('/work-with-me/'),
        description: '1:1 sessions on a specific business, career or personal problem. Direct advice where the problem is commercial, and psychotherapeutic work where behaviour or a recurring pattern is part of it.',
        provider: { '@id': PERSON_ID },
      },
    ]),
    // The six questions and answers are visible on the page and present in the
    // HTML whether or not the <details> are open, so FAQPage describes real
    // content. Copied from work-with-me.jsx; seo-check re-verifies the match.
    faq: [
      { '@type': 'Question', name: 'Is this therapy, consulting or coaching?',
        acceptedAnswer: { '@type': 'Answer', text: 'It depends on the problem. I am a business and career advisor and a BACP-registered psychotherapist. If the problem is commercial, we work on the business. If your behaviour or an underlying pattern is part of the problem, we can work there too.' } },
      { '@type': 'Question', name: 'What kinds of problems can I bring?',
        acceptedAnswer: { '@type': 'Answer', text: 'Anything within my areas of expertise where something needs to change. Leads, pricing, an offer, sales, a career decision, going independent, a conversation you keep avoiding, or the way you are working. Bring the actual problem.' } },
      { '@type': 'Question', name: 'Will you give me direct advice?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. If I think you should change the offer, raise the price or have the conversation, I will tell you. I will also tell you when I think you are solving the wrong problem. The final decision stays with you.' } },
      { '@type': 'Question', name: 'Can one session be enough?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Sometimes the main problem is that you cannot get an accurate read on the situation. Other problems take longer, especially when the same pattern has been repeating for years.' } },
      { '@type': 'Question', name: 'What happens if there is more to work on?',
        acceptedAnswer: { '@type': 'Answer', text: 'If continuing would be useful, we decide what we are working towards and continue from there. There is no requirement to commit beyond the first session.' } },
      { '@type': 'Question', name: 'Is this confidential?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. The work is private and covered by professional confidentiality. I explain the limits of confidentiality before we begin.' } },
    ],
  },
  {
    file: 'about/index.html', url: '/about/', priority: '0.8', changefreq: 'yearly',
    title: 'About Aggelos Mouzakitis | Business, Psychology & Product',
    description: 'Aggelos Mouzakitis is a business and career advisor and BACP-registered psychotherapist with 18+ years in product and growth and experience with 100+ technology companies.',
    ogTitle: 'About Aggelos Mouzakitis',
    ogDescription: '18+ years in product and growth, work with 100+ technology companies, and training in psychology and integrative psychotherapy.',
    ogImage: abs('/img/og/about.png'),
    ogImageAlt: 'Aggelos Mouzakitis',
    schema: [PERSON_FULL, {
      '@type': 'ProfilePage', '@id': abs('/about/') + '#webpage', url: abs('/about/'),
      name: 'About Aggelos Mouzakitis', isPartOf: { '@id': WEBSITE_ID }, inLanguage: 'en',
      mainEntity: { '@id': PERSON_ID },
    }, {
      '@type': 'BreadcrumbList', '@id': abs('/about/') + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' },
        { '@type': 'ListItem', position: 2, name: 'About me', item: abs('/about/') },
      ],
    }],
  },
  {
    file: 'reviews/index.html', url: '/reviews/', priority: '0.7', changefreq: 'monthly',
    title: 'Client Reviews | Aggelos Mouzakitis',
    description: 'Read feedback from people who have worked with Aggelos Mouzakitis on business, career decisions, behaviour and personal patterns.',
    ogTitle: 'Client Reviews | Aggelos Mouzakitis',
    ogDescription: 'What founders, freelancers and senior professionals say about working with Aggelos Mouzakitis.',
    ogImage: abs('/img/og/reviews.png'),
    ogImageAlt: 'Client reviews for Aggelos Mouzakitis',
    schema: pageNodes('/reviews/', 'Client Reviews | Aggelos Mouzakitis', 'Reviews').concat([PERSON_REF]),
  },
  {
    file: 'free-tools/index.html', url: '/free-tools/', priority: '0.9', changefreq: 'monthly',
    title: 'Free Business, Career & Psychology Tools | Aggelos Mouzakitis',
    description: 'Free practical tools and self-assessments for business, career decisions, burnout, going independent and problems that are difficult to think through alone.',
    ogTitle: 'Free Business, Career & Psychology Tools',
    ogDescription: 'Free tools for figuring out what is limiting your business, career or next decision.',
    ogImage: abs('/img/og/free-tools.png'),
    ogImageAlt: 'Free business, career and psychology tools by Aggelos Mouzakitis',
    schema: pageNodes('/free-tools/', 'Free Business, Career & Psychology Tools', 'Free tools', 'CollectionPage').concat([
      PERSON_REF,
      {
        '@type': 'ItemList', '@id': abs('/free-tools/') + '#collection',
        name: 'Free tools', numberOfItems: 5, itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: [
          ['/free-tools/roast-my-offer/', 'Roast my offer'],
          ['/free-tools/business-constraint/', "What's limiting your business?"],
          ['/free-tools/strategy-or-execution/', 'Is it a strategy or execution problem?'],
          ['/free-tools/quit-your-job/', "What's making you want to quit your job?"],
          ['/free-tools/become-a-solopreneur/', 'Do you want to become a solopreneur?'],
          ['/free-tools/burned-out/', 'Are you burned out?'],
        ].map(([p, n], i) => ({ '@type': 'ListItem', position: i + 1, name: n, url: abs(p) })),
      },
    ]),
  },
  {
    file: 'free-tools/roast-my-offer/index.html', url: '/free-tools/roast-my-offer/', priority: '0.7', changefreq: 'yearly',
    title: 'Roast My Offer | Free Offer Teardown',
    description: 'Send your offer — a link or pasted copy — and get a written teardown of the positioning, the pricing and why someone might not buy. Free, written by a person.',
    ogTitle: 'Roast My Offer | Free Offer Teardown',
    ogDescription: 'Send your offer and get a written teardown of what is weak in it.',
    ogImage: abs('/img/og/roast-my-offer.png'),
    ogImageAlt: 'Free offer teardown: roast my offer',
    schema: toolNodes('/free-tools/roast-my-offer/', 'Roast my offer',
      'Send an offer URL or pasted copy, say who it is for and roughly what it costs, and receive a written teardown of the positioning, pricing and likely objections.'),
  },
  {
    file: 'free-tools/business-constraint/index.html', url: '/free-tools/business-constraint/', priority: '0.7', changefreq: 'yearly',
    title: "What's Limiting Your Business? | Free Clarity Tool",
    description: 'Answer 20 questions to see whether the main constraint on your business is the offer, demand, pricing, conversion or execution. Free, no email needed to start.',
    ogTitle: "What's Limiting Your Business? | Free Clarity Tool",
    ogDescription: '20 questions that separate an offer problem from a demand, pricing or execution problem.',
    ogImage: abs('/img/og/clarity-business-constraint.png'),
    ogImageAlt: "Free clarity tool: what's limiting your business?",
    schema: toolNodes('/free-tools/business-constraint/', "What's limiting your business?",
      'A 20-question self-assessment that points to the constraint most likely holding the business back: the offer, demand, pricing, conversion or execution.'),
  },
  {
    file: 'free-tools/strategy-or-execution/index.html', url: '/free-tools/strategy-or-execution/', priority: '0.7', changefreq: 'yearly',
    title: 'Is It a Strategy or Execution Problem? | Free Clarity Tool',
    description: 'Answer 17 questions to tell whether the plan itself is wrong or whether the plan is fine and it is not being carried out. Free and directional.',
    ogTitle: 'Is It a Strategy or Execution Problem? | Free Clarity Tool',
    ogDescription: '17 questions that separate a wrong plan from a plan that is not being carried out.',
    ogImage: abs('/img/og/clarity-strategy-or-execution.png'),
    ogImageAlt: 'Free clarity tool: is it a strategy or execution problem?',
    schema: toolNodes('/free-tools/strategy-or-execution/', 'Is it a strategy or execution problem?',
      'A 17-question self-assessment that distinguishes a strategy problem from an execution problem.'),
  },
  {
    file: 'free-tools/quit-your-job/index.html', url: '/free-tools/quit-your-job/', priority: '0.7', changefreq: 'yearly',
    title: "What's Making You Want to Quit Your Job? | Free Career Clarity Tool",
    description: 'Directional, not a clinical assessment: 20 questions on whether it is the role, the manager, the company, the field or burnout driving the urge to leave.',
    ogTitle: "What's Making You Want to Quit Your Job? | Free Career Clarity Tool",
    ogDescription: '20 questions that separate the role, the manager, the company, the field and burnout.',
    ogImage: abs('/img/og/clarity-quit-your-job.png'),
    ogImageAlt: "Free career clarity tool: what's making you want to quit your job?",
    schema: toolNodes('/free-tools/quit-your-job/', "What's making you want to quit your job?",
      'A 20-question self-assessment that distinguishes the role, the manager, the company, the field and burnout as reasons for wanting to leave a job. Directional, not a clinical assessment.'),
  },
  {
    file: 'free-tools/become-a-solopreneur/index.html', url: '/free-tools/become-a-solopreneur/', priority: '0.7', changefreq: 'yearly',
    title: 'Do You Want to Become a Solopreneur? | Free Clarity Tool',
    description: 'Answer 20 questions to see how much of the pull towards working for yourself is genuine fit and how much is escape from the current job. Free and directional.',
    ogTitle: 'Do You Want to Become a Solopreneur? | Free Clarity Tool',
    ogDescription: '20 questions that separate genuine fit for working alone from wanting out of the current job.',
    ogImage: abs('/img/og/clarity-become-a-solopreneur.png'),
    ogImageAlt: 'Free clarity tool: do you want to become a solopreneur?',
    schema: toolNodes('/free-tools/become-a-solopreneur/', 'Do you want to become a solopreneur?',
      'A 20-question self-assessment that separates readiness and fit for working independently from the wish to escape a current job.'),
  },
  {
    file: 'free-tools/burned-out/index.html', url: '/free-tools/burned-out/', priority: '0.7', changefreq: 'yearly',
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
    file: 'wtf-friday/index.html', url: '/wtf-friday/', priority: '0.7', changefreq: 'weekly',
    title: 'WTF Friday | Free Weekly Group Office Hours',
    description: 'Free weekly group office hours for people working for themselves, or trying to. Bring one real problem, get a straight answer and a reality check from the room.',
    ogTitle: 'WTF Friday | Free Weekly Group Office Hours',
    ogDescription: 'Free weekly group office hours. Bring one real problem and get a straight answer.',
    ogImage: abs('/img/og/wtf-friday.png'),
    ogImageAlt: 'WTF Friday, free weekly group office hours with Aggelos Mouzakitis',
    schema: pageNodes('/wtf-friday/', 'WTF Friday | Free Weekly Group Office Hours', 'WTF Friday').concat([PERSON_REF]),
  },
  {
    file: 'ask-me-anything/index.html', url: '/ask-me-anything/', priority: '0.6', changefreq: 'monthly',
    title: 'Ask Me Anything | Aggelos Mouzakitis',
    description: 'Ask Aggelos Mouzakitis a question about business, career or psychology. You can submit it anonymously.',
    ogTitle: 'Ask Me Anything | Aggelos Mouzakitis',
    ogDescription: 'Send a question about business, career or psychology. Anonymously, if you prefer.',
    ogImage: abs('/img/og/ask-me-anything.png'),
    ogImageAlt: 'Ask Aggelos Mouzakitis a question, anonymously',
    schema: pageNodes('/ask-me-anything/', 'Ask Me Anything | Aggelos Mouzakitis', 'Ask me anything').concat([PERSON_REF]),
  },
  {
    file: 'contact/index.html', url: '/contact/', priority: '0.8', changefreq: 'yearly',
    title: 'Contact Aggelos Mouzakitis',
    description: 'Contact Aggelos Mouzakitis about working together, a free orientation call or another enquiry.',
    ogTitle: 'Contact Aggelos Mouzakitis',
    ogDescription: 'Get in touch about working together or a free orientation call.',
    ogImage: abs('/img/og/contact.png'),
    ogImageAlt: 'Contact Aggelos Mouzakitis',
    schema: pageNodes('/contact/', 'Contact Aggelos Mouzakitis', 'Contact', 'ContactPage').concat([PERSON_REF]),
  },
  {
    file: 'confidentiality/index.html', url: '/confidentiality/', priority: '0.4', changefreq: 'yearly',
    title: 'Confidentiality | Aggelos Mouzakitis',
    description: 'How session notes, personal data and enquiries are handled, when confidentiality can be broken, and the terms and privacy policy for this site.',
    ogTitle: 'Confidentiality | Aggelos Mouzakitis',
    ogDescription: 'How session notes and personal data are handled, and the limits of confidentiality.',
    ogImage: abs('/img/og/confidentiality.png'),
    ogImageAlt: 'Confidentiality, terms and privacy',
    schema: pageNodes('/confidentiality/', 'Confidentiality | Aggelos Mouzakitis', 'Confidentiality').concat([PERSON_REF]),
  },
  // ── Specialty pages. They stay because each answers a distinct search intent
  //    that /work-with-me/ does not target; they link into it rather than repeat it.
  {
    file: 'therapy-for-founders/index.html', url: '/therapy-for-founders/', priority: '0.6', changefreq: 'yearly',
    title: 'Therapy for Founders | Aggelos Mouzakitis',
    description: 'Psychotherapy for founders, with a therapist who has built companies and advised more than 100 of them. Online sessions across Europe and the US.',
    ogTitle: 'Therapy for Founders',
    ogDescription: 'Therapy with someone who understands what running a company actually costs.',
    ogImage: abs('/img/og/therapy-for-founders.png'),
    ogImageAlt: 'Therapy for founders with Aggelos Mouzakitis',
    schema: pageNodes('/therapy-for-founders/', 'Therapy for Founders', 'Therapy for founders').concat([PERSON_REF]),
  },
  {
    file: 'therapy-for-executives/index.html', url: '/therapy-for-executives/', priority: '0.6', changefreq: 'yearly',
    title: 'Therapy for Executives | Aggelos Mouzakitis',
    description: 'Psychotherapy for senior leaders who have done everything right and still feel that something is off. Online sessions with a BACP-registered psychotherapist.',
    ogTitle: 'Therapy for Executives',
    ogDescription: 'For senior leaders who have done everything right and still feel something is off.',
    ogImage: abs('/img/og/therapy-for-executives.png'),
    ogImageAlt: 'Therapy for executives with Aggelos Mouzakitis',
    schema: pageNodes('/therapy-for-executives/', 'Therapy for Executives', 'Therapy for executives').concat([PERSON_REF]),
  },
  {
    file: 'imposter-syndrome-therapy/index.html', url: '/imposter-syndrome-therapy/', priority: '0.6', changefreq: 'yearly',
    title: 'Imposter Syndrome Therapy for Executives | Aggelos Mouzakitis',
    description: 'For people who can see the evidence that they are good at their work but cannot feel it. Psychotherapy that works on what keeps producing the feeling.',
    ogTitle: 'Imposter Syndrome Therapy',
    ogDescription: 'You can see the evidence that you are good at this. You just cannot feel it.',
    ogImage: abs('/img/og/imposter-syndrome-therapy.png'),
    ogImageAlt: 'Imposter syndrome therapy with Aggelos Mouzakitis',
    schema: pageNodes('/imposter-syndrome-therapy/', 'Imposter Syndrome Therapy', 'Imposter syndrome therapy').concat([PERSON_REF]),
  },
  {
    file: 'executive-burnout-therapy/index.html', url: '/executive-burnout-therapy/', priority: '0.6', changefreq: 'yearly',
    title: 'Executive Burnout Therapy | Aggelos Mouzakitis',
    description: 'For senior professionals who took the break and came back feeling the same. Psychotherapy that looks at what keeps producing the exhaustion, not just the workload.',
    ogTitle: 'Executive Burnout Therapy',
    ogDescription: 'You took the vacation and came back feeling the same. The problem probably is not the workload.',
    ogImage: abs('/img/og/executive-burnout-therapy.png'),
    ogImageAlt: 'Executive burnout therapy with Aggelos Mouzakitis',
    schema: pageNodes('/executive-burnout-therapy/', 'Executive Burnout Therapy', 'Executive burnout therapy').concat([PERSON_REF]),
  },
  {
    file: 'career-transition-therapy/index.html', url: '/career-transition-therapy/', priority: '0.6', changefreq: 'yearly',
    title: 'Career Transition Therapy | Aggelos Mouzakitis',
    description: 'For senior professionals where the next role is the easy part and the identity question is the real work. Psychotherapy through a career transition, online.',
    ogTitle: 'Career Transition Therapy',
    ogDescription: 'The next role is not the hard part. Working out who you are without this one is.',
    ogImage: abs('/img/og/career-transition-therapy.png'),
    ogImageAlt: 'Career transition therapy with Aggelos Mouzakitis',
    schema: pageNodes('/career-transition-therapy/', 'Career Transition Therapy', 'Career transition therapy').concat([PERSON_REF]),
  },
];

module.exports = { ORIGIN, SITE_NAME, PERSON_ID, WEBSITE_ID, OG_DEFAULT, PAGES };
