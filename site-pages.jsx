// site-pages.jsx — renders the 24 canonical pages from site-copy.js.
//
// Loaded after site-chrome.js (tokens, header, footer, Motion) and site-copy.js
// (window.SITE_COPY, the final editorial copy). Each page shell calls
// renderSitePage('<id>'); scripts/seo/prerender.js snapshots the result into
// the page's #root so the copy is in the HTML before any JavaScript runs.
//
// Copy is never written here. This file decides only how blocks look:
//   PAGE_TYPES     one shell per kind of page (home, service, audience, problem,
//                  resource, faq, reviews, tools, writing, contact, legal, about, hub)
//   INLINE_LINKS   service names in body copy that link to their page
//   RELATED        "Related" rows that complete the internal-link graph where
//                  the editorial CTAs leave a required link out
// A CTA whose destination does not exist yet has href: null in the copy data
// (see scripts/copy/extract-editorial.py) and is left out, never re-pointed.
//
// Everything is scoped in one IIFE so nothing collides with the other bundles'
// top-level names. Exposes window.renderSitePage and window.SitePage.
(function () {
  const e = React.createElement;
  const S = window.SITE;
  const COPY = (window.SITE_COPY && window.SITE_COPY.pages) || {};

  // ── Contextual links ───────────────────────────────────────────────────────
  // Only words already in the copy become links, and only the first time they
  // appear on a page. Page id → [phrase, href].
  const INLINE_LINKS = {
    faq: [
      ['Individual Psychotherapy', '/individual-psychotherapy/'],
      ['Couples Therapy', '/couples-therapy/'],
      ['Professional Coaching', '/professional-coaching/'],
    ],
    'therapy-for-executives': [['Professional Coaching', '/professional-coaching/']],
  };

  // The implementation brief's link graph (Phase 11) where the editorial CTAs
  // do not already carry the link: audience pages → Individual Psychotherapy,
  // problem pages → a service + an audience page + an adjacent problem,
  // Considering Therapy → Individual Psychotherapy / FAQ / Reviews, About →
  // Reviews, Reviews → About. Labels are the navigation's own page names.
  const L = {
    ip: { label: 'Individual Psychotherapy', href: '/individual-psychotherapy/' },
    tech: { label: 'Men in Tech & Demanding Careers', href: '/therapy-for-men-in-tech/' },
    execs: { label: 'Executives & Leaders', href: '/therapy-for-executives/' },
    rel: { label: 'Relationship Problems', href: '/relationship-problems-men/' },
    ach: { label: 'Achievement & Self-Worth', href: '/achievement-self-worth/' },
    faq: { label: 'FAQ', href: '/faq/' },
    reviews: { label: 'Reviews', href: '/reviews/' },
    about: { label: 'About', href: '/about/' },
  };
  const RELATED = {
    'therapy-for-men-in-tech': [L.ip],
    'therapy-for-executives': [L.ip],
    'greek-speaking-psychotherapist': [L.ip],
    'relationship-problems-men': [L.tech],
    'separation-divorce-men': [L.ip, L.rel, L.tech],
    'executive-burnout-therapy': [L.ip, L.tech],
    'career-transition-therapy': [L.ip, L.execs],
    'anxiety-overthinking': [L.ip, L.tech, L.ach],
    'achievement-self-worth': [L.ip, L.tech],
    'considering-therapy': [L.ip, L.faq, L.reviews],
    about: [L.reviews],
    reviews: [L.about],
  };

  // ── Rich text ──────────────────────────────────────────────────────────────
  // "**bold**" marks the source's bold runs. Configured phrases become links.
  function linkify(text, ctx, keyBase) {
    const phrases = ctx.links || [];
    for (let i = 0; i < phrases.length; i++) {
      const [phrase, href] = phrases[i];
      if (ctx.used[phrase]) continue;
      const at = text.indexOf(phrase);
      if (at < 0) continue;
      ctx.used[phrase] = true;
      return [].concat(
        at ? linkify(text.slice(0, at), ctx, keyBase + 'a') : [],
        [e('a', { key: keyBase + 'l', href }, phrase)],
        linkify(text.slice(at + phrase.length), ctx, keyBase + 'b'));
    }
    return text ? [text] : [];
  }
  function rich(text, ctx) {
    const c = ctx || { links: [], used: {} };
    return String(text).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return e('strong', { key: i }, linkify(part.slice(2, -2), c, 's' + i));
      }
      return e(React.Fragment, { key: i }, linkify(part, c, 't' + i));
    });
  }
  const plain = (text) => String(text).replace(/\*\*/g, '');

  // ── Calls to action ────────────────────────────────────────────────────────
  // The consultation route is the one filled button; every other CTA is a
  // quieter arrow link. A CTA without a destination (href: null in the copy
  // data: essays not yet restored, Terms/Privacy not yet written) is left out
  // rather than pointed somewhere it does not mean.
  const isPrimary = (it) => it.href === window.CONTACT_URL;
  const isExternal = (href) => /^https?:/.test(href);
  function Cta({ item, tone }) {
    if (!item.href) return null;
    const arrow = item.arrow ? e('span', { 'aria-hidden': 'true' }, '→') : null;
    const extra = isExternal(item.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    if (isPrimary(item)) {
      return e('a', Object.assign({ className: 'sp-btn', href: item.href }, extra), e('span', null, item.label), arrow);
    }
    return e('a', Object.assign({ className: 'sp-link' + (tone === 'dark' ? ' sp-link--dark' : ''), href: item.href }, extra),
      e('span', null, item.label), arrow);
  }
  function CtaRow({ items, tone }) {
    const live = items.filter((it) => it.href);
    if (!live.length) return null;
    return e('div', { className: 'sp-ctas' }, live.map((it, i) => e(Cta, { key: i, item: it, tone })));
  }
  function RelatedRow({ items, tone }) {
    if (!items || !items.length) return null;
    return e('p', { className: 'sp-related' + (tone === 'dark' ? ' sp-related--dark' : '') },
      e('span', { className: 'sp-related__k' }, 'Related:'),
      items.map((it, i) => e(Cta, { key: i, item: Object.assign({ arrow: true }, it), tone })));
  }

  // ── Blocks ─────────────────────────────────────────────────────────────────
  const isQuotedLine = (t) => /^“[\s\S]*”\.?$/.test(t);
  function Block({ b, ctx, tone }) {
    switch (b.t) {
      case 'p':
        return e('p', { className: isQuotedLine(b.text) ? 'sp-p sp-p--said' : 'sp-p' }, rich(b.text, ctx));
      case 'list':
        return e('ul', { className: 'sp-list' }, b.items.map((it, i) => e('li', { key: i }, rich(it, ctx))));
      case 'ctas':
        return e(CtaRow, { items: b.items, tone });
      case 'related':
        return e(RelatedRow, { items: [b], tone });
      case 'meta':
        return e('p', { className: 'sp-meta' }, b.text);
      case 'quote':
        return e('figure', { className: 'sp-quote' },
          e('blockquote', null, e('p', null, b.text)),
          b.cite ? e('figcaption', null, b.cite) : null);
      case 'sub':
        return e('div', { className: 'sp-sub' },
          e('h3', { className: 'sp-h3' }, b.h3),
          e(Blocks, { blocks: b.blocks, ctx, tone }));
      default:
        return null;
    }
  }
  function Blocks({ blocks, ctx, tone }) {
    return e(React.Fragment, null, blocks.map((b, i) => e(Block, { key: i, b, ctx, tone })));
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  // A section is a <section> labelled by its h2. `variant` picks the layout.
  function Section({ s, ctx, variant, num, children }) {
    const hid = 'h-' + s.id;
    const head = [
      e('span', { key: 'r', className: 'sp-rule', 'data-mo': 'rule-l', 'aria-hidden': 'true' }),
      num ? e('span', { key: 'n', className: 'sp-num', 'aria-hidden': 'true' }, (num < 10 ? '0' : '') + num + ' /') : null,
      e('h2', { key: 'h', className: 'sp-h2', id: hid }, s.h2),
    ];
    const body = children || e(Blocks, { blocks: s.blocks, ctx });
    if (variant === 'rail') {
      return e('section', { className: 'sp-sec sp-sec--rail', id: s.id, 'aria-labelledby': hid },
        e('div', { className: 'sp-sec__rail' }, head),
        e('div', { className: 'sp-sec__body' }, body));
    }
    return e('section', { className: 'sp-sec' + (variant ? ' sp-sec--' + variant : ''), id: s.id, 'aria-labelledby': hid },
      head, body);
  }

  // The editorial "Contact" section that ends most pages: a forest band.
  function Closing({ s, related }) {
    const hid = 'h-' + s.id;
    return e('section', { className: 'sp-close', id: s.id, 'aria-labelledby': hid },
      e('div', { className: 'sp-close__in' },
        e('h2', { className: 'sp-close__h', id: hid }, s.h2),
        e(Blocks, { blocks: s.blocks, ctx: { links: [], used: {} }, tone: 'dark' }),
        related ? e(RelatedRow, { items: related, tone: 'dark' }) : null));
  }

  // ── Hero (inner pages) ─────────────────────────────────────────────────────
  function Hero({ p, ctx, aside }) {
    const blocks = p.hero.blocks;
    return e('section', { className: 'sp-hero sp-hero--' + p.type + (aside ? ' sp-hero--aside' : '') },
      e('div', { className: 'sp-hero__in' },
        e('div', { className: 'sp-hero__copy' },
          p.hero.eyebrow ? e('p', { className: 'sp-eyebrow' }, p.hero.eyebrow) : null,
          e('h1', { className: 'sp-h1', id: 'page-title' }, p.hero.h1),
          e('div', { className: 'sp-hero__lead' },
            blocks.map((b, i) => (b.t === 'p'
              ? e('p', { key: i, className: 'sp-lead' }, rich(b.text, ctx))
              : e(Block, { key: i, b, ctx }))))),
        aside || null));
  }

  function Portrait({ src, w, h, className, eager }) {
    return e('figure', { className: 'sp-portrait ' + (className || '') },
      e('img', {
        src, alt: 'Aggelos Mouzakitis', width: w, height: h, decoding: 'async',
        loading: eager ? 'eager' : 'lazy',
      }));
  }

  // ── Page frame ─────────────────────────────────────────────────────────────
  function Frame({ p, children }) {
    return e(React.Fragment, null,
      e(window.ChromeStyles),
      e(SitePageStyles),
      e(window.SiteHeader, { path: p.url }),
      e('main', { id: 'main', className: 'sp sp--' + p.type, tabIndex: -1 }, children),
      e(window.SiteFooterX, null));
  }

  // Splits the trailing editorial "Contact" section off the body.
  function splitClosing(sections) {
    const last = sections[sections.length - 1];
    if (last && last.id === 'contact') return [sections.slice(0, -1), last];
    return [sections, null];
  }

  const newCtx = (p) => ({ links: INLINE_LINKS[p.id] || [], used: {} });

  // ── Generic page: service, audience, problem, resource, faq, legal, hub, about
  const SECTION_VARIANT = {
    audience: () => 'rail',
    faq: () => 'rail',
    problem: () => null,
    service: (s) => (s.id === 'practicalities' ? 'panel' : null),
    hub: (s) => (['individual-psychotherapy', 'couples-therapy', 'professional-coaching'].indexOf(s.id) >= 0 ? 'card' : null),
  };
  const NUMBERED = { problem: true };

  function GenericPage({ p }) {
    const ctx = newCtx(p);
    const [sections, closing] = splitClosing(p.sections);
    // The Terms and privacy section is only two links, and no Terms or Privacy
    // text exists on the site yet: it stays hidden until those pages exist.
    const visible = sections.filter((s) => !(s.id === 'terms-and-privacy' && s.blocks.every((b) => b.t === 'ctas' && b.items.every((it) => !it.href))));
    const related = RELATED[p.id];
    const pick = SECTION_VARIANT[p.type];
    const aside = p.type === 'about'
      ? e(Portrait, { src: '/img/aggelos-continuation.webp', w: 2048, h: 1536, className: 'sp-portrait--hero', eager: true })
      : null;

    // Work With Me: its three service sections sit side by side as cards.
    const cards = p.type === 'hub' ? visible.filter((s) => pick(s) === 'card') : [];
    let n = 0;
    const renderSec = (s) => {
      const variant = pick ? pick(s) : null;
      if (variant === 'card') return null;
      n += 1;
      const isFaq = /questions$/.test(s.id) || p.type === 'faq';
      return e(Section, {
        key: s.id, s, ctx, variant: isFaq && variant !== 'rail' ? 'faq' : variant,
        num: NUMBERED[p.type] ? n : null,
      });
    };
    const body = [];
    visible.forEach((s) => {
      if (p.type === 'hub' && cards.length && s === cards[0]) {
        body.push(e('div', { key: 'cards', className: 'sp-cards sp-cards--3' },
          cards.map((c) => e(Section, { key: c.id, s: c, ctx, variant: 'card' }))));
      }
      body.push(renderSec(s));
    });

    return e(Frame, { p },
      e(Hero, { p, ctx, aside }),
      e('div', { className: 'sp-body sp-body--' + p.type }, body,
        !closing ? e(RelatedRow, { items: related }) : null),
      closing ? e(Closing, { s: closing, related }) : null);
  }

  // ── Homepage ───────────────────────────────────────────────────────────────
  const PT_SEAL = {
    profile: 'https://www.psychologytoday.com/profile/1662603',
    src: 'https://member.psychologytoday.com/verified-seal.js',
    badge: '13',
    id: '1662603',
    code: 'aHR0cHM6Ly93d3cucHN5Y2hvbG9neXRvZGF5LmNvbS9hcGkvdmVyaWZpZWQtc2VhbC9zZWFscy8xMy9wcm9maWxlLzE2NjI2MDM/Y2FsbGJhY2s9c3hjYWxsYmFjaw==',
  };
  // Psychology Today's verification seal. Their embed is an empty
  // <a class="sx-verified-seal"> plus a script that fills it; the script is
  // added only after React has committed the anchor (a static tag would fill
  // the prerendered copy, which createRoot then replaces).
  function VerifiedSeal() {
    React.useEffect(function () {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = PT_SEAL.src;
      s.setAttribute('data-badge', PT_SEAL.badge);
      s.setAttribute('data-id', PT_SEAL.id);
      s.setAttribute('data-code', PT_SEAL.code);
      document.body.appendChild(s);
      return function () { s.remove(); };
    }, []);
    return e('div', { className: 'home-hero__seal' },
      e('a', { href: PT_SEAL.profile, className: 'sx-verified-seal', 'aria-label': 'Verified by Psychology Today' }));
  }

  // Hairlines behind the hero with one green square that travels the lowest
  // line over the first ~320px of scroll. Scroll-linked, never on load; inert
  // under reduced motion (Motion.track hands it its final state once).
  function HeroField() {
    const svg = React.useRef(null);
    const n = React.useRef({});
    React.useEffect(function () {
      const M = window.Motion;
      const el = svg.current;
      if (!el || !M) return undefined;
      const mq = window.matchMedia('(max-width: 900px)');
      function apply(p) {
        const mobile = mq.matches;
        const set = function (k, a, v) { if (n.current[k]) n.current[k].setAttribute(a, v); };
        if (n.current.field) n.current.field.setAttribute('transform', 'translate(0 ' + (mobile ? -8 * p : -12 * p).toFixed(2) + ')');
        if (mobile) {
          const mx = 60 + 64 * M.travel(M.clamp01(p / 0.8));
          set('trailM', 'x2', mx.toFixed(2));
          set('sqM', 'x', (mx - 4).toFixed(2));
          return;
        }
        const ox = 700 + 244 * M.travel(M.clamp01(p / 0.7));
        set('trail', 'x2', ox.toFixed(2));
        set('sq', 'x', (ox - 5).toFixed(2));
        const dp = M.travel(M.clamp01((p - 0.62) / 0.38));
        set('drop', 'y2', (604 + 60 * dp).toFixed(2));
      }
      M.track(el, { distance: 320, onProgress: apply });
      return function () { M.release(el); };
    }, []);
    const ref = function (k) { return function (el) { n.current[k] = el; }; };
    const lines = [];
    for (let y = 128; y <= 576; y += 28) lines.push(y);
    const linesM = [];
    for (let y = 60; y <= 372; y += 24) linesM.push(y);
    return e('svg', {
      className: 'home-hero__field', ref: svg, viewBox: '0 0 1440 661',
      preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false',
    },
      e('defs', null,
        e('linearGradient', { id: 'hfFade', gradientUnits: 'userSpaceOnUse', x1: 520, y1: 0, x2: 980, y2: 0 },
          e('stop', { offset: '0', stopColor: '#171919', stopOpacity: '0' }),
          e('stop', { offset: '1', stopColor: '#171919', stopOpacity: '0.11' })),
        e('linearGradient', { id: 'hfFadeM', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 390, y2: 0 },
          e('stop', { offset: '0', stopColor: '#171919', stopOpacity: '0' }),
          e('stop', { offset: '0.35', stopColor: '#171919', stopOpacity: '0.08' }),
          e('stop', { offset: '1', stopColor: '#171919', stopOpacity: '0.08' }))),
      e('g', { ref: ref('field') },
        e('g', { className: 'home-hero__field-d' },
          lines.map(function (y) { return e('line', { key: 'l' + y, x1: 520, y1: y, x2: 1440, y2: y, stroke: 'url(#hfFade)', strokeWidth: 1 }); }),
          e('line', { x1: 520, y1: 604, x2: 1440, y2: 604, stroke: 'url(#hfFade)', strokeWidth: 1 }),
          e('line', { ref: ref('trail'), x1: 700, y1: 604, x2: 700, y2: 604, stroke: '#047857', strokeWidth: 1.25, opacity: 0.7 }),
          e('line', { ref: ref('drop'), x1: 950.4, y1: 604, x2: 950.4, y2: 604, stroke: '#047857', strokeWidth: 1.5 }),
          e('rect', { ref: ref('sq'), x: 695, y: 599, width: 10, height: 10, fill: '#047857' })),
        e('g', { className: 'home-hero__field-m' },
          linesM.map(function (y) { return e('line', { key: 'm' + y, x1: 0, y1: y, x2: 390, y2: y, stroke: 'url(#hfFadeM)', strokeWidth: 1 }); }),
          e('line', { ref: ref('trailM'), x1: 60, y1: 372, x2: 60, y2: 372, stroke: '#047857', strokeWidth: 1.25, opacity: 0.7 }),
          e('rect', { ref: ref('sqM'), x: 56, y: 368, width: 8, height: 8, fill: '#047857' }))));
  }

  function HomePage({ p }) {
    const ctx = newCtx(p);
    const byId = {};
    p.sections.forEach((s) => { byId[s.id] = s; });
    const heroParas = p.hero.blocks.filter((b) => b.t === 'p');
    const heroCtas = (p.hero.blocks.find((b) => b.t === 'ctas') || { items: [] }).items;
    const primary = heroCtas.filter(isPrimary);
    const soft = heroCtas.filter((it) => !isPrimary(it));

    const hero = e('section', { className: 'home-hero', key: 'hero' },
      e(HeroField, null),
      e('div', { className: 'home-hero__grid' },
        e('div', { className: 'home-hero__copy' },
          e('p', { className: 'home-hero__eyebrow' }, p.hero.eyebrow),
          e('h1', { className: 'home-hero__title', id: 'page-title' }, e('span', { className: 'home-hero__line' }, p.hero.h1)),
          heroParas.map((b, i) => e('p', { key: i, className: 'home-hero__support' }, rich(b.text, ctx))),
          e('div', { className: 'home-hero__ctarow' },
            primary.map((it, i) => e('a', { key: 'p' + i, className: 'hero-cta hero-cta--caps', href: it.href },
              e('span', null, it.label), e('span', { 'aria-hidden': 'true' }, '→'))),
            soft.map((it, i) => e('a', { key: 's' + i, className: 'home-hero__soft', href: it.href },
              e('span', null, it.label), e('span', { 'aria-hidden': 'true' }, '→')))),
          e(VerifiedSeal, null)),
        e('figure', { className: 'home-hero__photo' },
          e('div', { className: 'home-hero__frame' },
            e('img', {
              src: '/img/aggelos-homepage.webp?v=2', alt: 'Aggelos Mouzakitis',
              width: 2048, height: 1365, loading: 'eager', fetchpriority: 'high', decoding: 'async',
            })))));

    const band = (id, cls, inner) => {
      const s = byId[id];
      if (!s) return null;
      const hid = 'h-' + s.id;
      return e('section', { key: id, id: s.id, className: 'hm-band ' + cls, 'aria-labelledby': hid },
        e('div', { className: 'hm-band__in' },
          e('span', { className: 'sp-rule', 'data-mo': 'rule-l', 'aria-hidden': 'true' }),
          e('h2', { className: 'sp-h2', id: hid }, s.h2),
          inner ? inner(s) : e(Blocks, { blocks: s.blocks, ctx, tone: /hm-band--dark/.test(cls) ? 'dark' : null })));
    };

    // "Ways to work with me": one card per service.
    const ways = (s) => e('div', { className: 'sp-cards sp-cards--3' },
      s.blocks.filter((b) => b.t === 'sub').map((b, i) => e('div', { key: i, className: 'hm-card' },
        e('span', { className: 'hm-card__n', 'aria-hidden': 'true' }, '0' + (i + 1)),
        e('h3', { className: 'sp-h3' }, b.h3),
        e(Blocks, { blocks: b.blocks, ctx }))));

    // "If you want to read first": each resource paragraph beside its own link,
    // in the editorial's order.
    const readFirst = (s) => {
      const paras = s.blocks.filter((b) => b.t === 'p');
      const links = (s.blocks.find((b) => b.t === 'ctas') || { items: [] }).items;
      return e('div', { className: 'sp-cards sp-cards--3' },
        paras.map((b, i) => e('div', { key: i, className: 'hm-read' },
          e('p', { className: 'sp-p' }, rich(b.text, ctx)),
          links[i] ? e(CtaRow, { items: [links[i]] }) : null)));
    };

    // "About me": the speaking photograph beside the training paragraph.
    const aboutMe = (s) => e('div', { className: 'hm-about' },
      e(Portrait, { src: '/img/aggelos-opinion.jpeg', w: 800, h: 800, className: 'hm-about__img' }),
      e('div', null, e(Blocks, { blocks: s.blocks, ctx })));

    const closing = byId.contact;
    return e(Frame, { p },
      hero,
      band('what-brings-people-here', 'hm-band--deep'),
      band('work-is-part-of-the-context', 'hm-band--dark'),
      band('how-i-work', ''),
      band('ways-to-work-with-me', 'hm-band--deep', ways),
      band('if-you-want-to-read-first', '', readFirst),
      band('about-me', 'hm-band--deep', aboutMe),
      closing ? e(Closing, { s: closing }) : null);
  }

  // ── Reviews ────────────────────────────────────────────────────────────────
  // Two contexts, kept apart and labelled by the copy's own headings:
  // anonymous psychotherapy feedback and attributed GrowthMentor sessions.
  // No stars, no ratings, no aggregate.
  function ReviewsPage({ p }) {
    const ctx = newCtx(p);
    const [sections, closing] = splitClosing(p.sections);
    return e(Frame, { p },
      e(Hero, { p, ctx }),
      e('div', { className: 'sp-body sp-body--reviews' },
        sections.map((s) => {
          const quotes = s.blocks.filter((b) => b.t === 'quote');
          if (!quotes.length) return e(Section, { key: s.id, s, ctx, variant: 'note' });
          return e(Section, { key: s.id, s, ctx, variant: 'wide' },
            e('div', { className: 'sp-quotes' }, quotes.map((b, i) => e(Block, { key: i, b, ctx }))));
        })),
      closing ? e(Closing, { s: closing, related: RELATED[p.id] }) : null);
  }

  // ── Free Tools ─────────────────────────────────────────────────────────────
  function ToolsPage({ p }) {
    const ctx = newCtx(p);
    const tools = p.sections.filter((s) => s.blocks.some((b) => b.t === 'ctas' && b.items.some((it) => /^\/free-tools\//.test(it.href || ''))));
    const rest = p.sections.filter((s) => tools.indexOf(s) < 0);
    return e(Frame, { p },
      e(Hero, { p, ctx }),
      e('div', { className: 'sp-body sp-body--tools' },
        e('div', { className: 'sp-cards sp-cards--2' },
          tools.map((s) => e(Section, { key: s.id, s, ctx, variant: 'card' }))),
        rest.map((s) => e(Section, { key: s.id, s, ctx }))));
  }

  // ── Writing ────────────────────────────────────────────────────────────────
  function WritingPage({ p }) {
    const ctx = newCtx(p);
    const [sections, closing] = splitClosing(p.sections);
    return e(Frame, { p },
      e(Hero, { p, ctx }),
      e('div', { className: 'sp-body sp-body--writing' },
        sections.map((s) => {
          if (s.id === 'featured') {
            return e(Section, { key: s.id, s, ctx, variant: 'wide' },
              e('ol', { className: 'wr-featured' }, s.blocks.filter((b) => b.t === 'sub').map((b, i) => e('li', { key: i },
                e('h3', { className: 'sp-h3' }, b.h3),
                e(Blocks, { blocks: b.blocks, ctx })))));
          }
          if (s.id === 'browse-by-subject') {
            return e(Section, { key: s.id, s, ctx, variant: 'wide' },
              e('div', { className: 'sp-cards sp-cards--3' }, s.blocks.filter((b) => b.t === 'sub').map((b, i) => e('div', { key: i, className: 'wr-subject' },
                e('h3', { className: 'sp-h3' }, b.h3),
                e(Blocks, { blocks: b.blocks, ctx })))));
          }
          return e(Section, { key: s.id, s, ctx, variant: s.id === 'undisguised' ? 'panel' : null });
        })),
      closing ? e(Closing, { s: closing }) : null);
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  // Delivery goes through window.submitLead (lead-capture.js): the EmailJS
  // notification plus a row in the enquiries sheet, the same path the contact
  // form has always used. Validation, the honeypot and the soft rate limit are
  // carried over from the previous form.
  const MAXLEN = 3000;
  const COUNTER_FROM = 2600;
  const CONTACT_TEMPLATE = 'template_6mv5hou';
  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (err) { /* analytics is optional */ }
  }
  const sanitize = (s) => (s || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/ {2,}/g, ' ').trim();
  const sanitizeLong = (s) => (s || '').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ').trim();
  const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const slugOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const safeGet = (k) => { try { return window.localStorage.getItem(k); } catch (err) { return null; } };
  const safeSet = (k, v) => { try { window.localStorage.setItem(k, v); } catch (err) { /* private mode */ } };

  function ContactForm({ form }) {
    const R = React;
    const fields = form.fields;
    const labelOf = (i) => (fields[i] ? fields[i].label : '');
    // The four fields of the editorial spec, in its order; Service is optional
    // so nobody has to decide on a service before getting in touch.
    const L = { name: labelOf(0), email: labelOf(1), location: labelOf(2), message: labelOf(3) };
    const service = fields.find((f) => f.options) || { label: 'Service', options: [] };

    const [v, setV] = R.useState({ name: '', email: '', location: '', message: '', service: '', company: '' });
    const [errors, setErrors] = R.useState({});
    const [formErr, setFormErr] = R.useState(false);
    const [status, setStatus] = R.useState('idle'); // idle | sending | success
    const refs = { name: R.useRef(null), email: R.useRef(null), location: R.useRef(null), message: R.useRef(null) };
    const live = R.useRef(null);
    const successRef = R.useRef(null);
    const lastRef = R.useRef(0);

    R.useEffect(() => { track('contact_page_viewed', { source_page: document.referrer || 'direct' }); }, []);
    R.useEffect(() => {
      if (status === 'success' && successRef.current) {
        try { successRef.current.focus(); } catch (err) { /* focus is best-effort */ }
        announce('Thank you. Your message has been sent.');
      }
    }, [status]);

    const announce = (t) => { if (live.current) live.current.textContent = t; };
    const set = (k) => (ev) => setV(Object.assign({}, v, { [k]: ev.target.value }));

    function validate() {
      const er = {};
      if (!sanitize(v.name)) er.name = 'Please add your name.';
      const em = sanitize(v.email);
      if (!em) er.email = 'Please add your email.';
      else if (!validEmail(em)) er.email = 'Please enter a valid email address.';
      if (!sanitize(v.location)) er.location = 'Please add where you are currently located.';
      if (!sanitizeLong(v.message)) er.message = 'Please add a few lines.';
      return er;
    }

    function onSubmit(ev) {
      ev.preventDefault();
      const src = document.referrer || 'direct';
      track('form_submission_attempted', { interest: v.service || 'none', source_page: src });
      if (v.company) { setStatus('success'); return; } // honeypot: bots only
      const er = validate();
      setErrors(er);
      const order = ['name', 'email', 'location', 'message'];
      const first = order.find((k) => er[k]);
      if (first) {
        setFormErr(false);
        if (refs[first].current) refs[first].current.focus();
        announce('The form has errors. Please check the highlighted fields.');
        return;
      }
      const now = Date.now();
      const last = lastRef.current || Number(safeGet('ct_last') || 0);
      if (now - last < 15000) { setFormErr(true); announce('Please wait a few seconds before sending again.'); return; }

      setFormErr(false);
      setStatus('sending');
      announce('Sending your message.');
      const svc = v.service || 'Not specified';
      const msg = sanitizeLong(v.message).slice(0, MAXLEN);
      const loc = sanitize(v.location).slice(0, 200);
      const body = [
        'Location: ' + loc,
        'Service: ' + svc,
        '',
        'Message:',
        msg,
        '',
        'Referrer: ' + src,
      ].join('\n');
      const ok = () => {
        lastRef.current = Date.now(); safeSet('ct_last', String(lastRef.current));
        track('form_submission_succeeded', { interest: v.service ? slugOf(v.service) : 'none', source_page: src });
        setStatus('success');
      };
      const fail = (err) => {
        try { console.error('Contact send error:', err); } catch (e2) { /* noop */ }
        track('form_submission_failed', { interest: v.service ? slugOf(v.service) : 'none', source_page: src });
        setStatus('idle'); setFormErr(true); announce('Something went wrong and your message was not sent.');
      };
      if (typeof window.submitLead !== 'function') { fail(new Error('Lead capture unavailable')); return; }
      window.submitLead({
        source: 'contact',
        detail: v.service ? slugOf(v.service) : 'not-specified',
        detailLabel: svc,
        name: sanitize(v.name),
        email: sanitize(v.email),
        notes: msg,
        body,
        sourcePage: src,
        detailExtra: 'location: ' + loc,
        template: CONTACT_TEMPLATE,
      }, (sent) => { if (sent) ok(); else fail(new Error('Lead send failed')); });
    }

    const liveRegion = e('div', { ref: live, className: 'sp-vh', role: 'status', 'aria-live': 'polite' });

    if (status === 'success') {
      return e('div', { className: 'sp-form sp-form--done' },
        liveRegion,
        e('h2', { className: 'sp-form__done', tabIndex: -1, ref: successRef }, 'Thank you. I’ve got your message.'),
        e('p', { className: 'sp-p' }, 'I’ll read it myself and get back to you personally.'),
        e('div', { className: 'sp-ctas' },
          e('a', { className: 'sp-link', href: '/' }, e('span', null, 'Back to the homepage'), e('span', { 'aria-hidden': 'true' }, '→'))));
    }

    const field = (key, label, input, help) => {
      const er = errors[key];
      const desc = [help ? key + '-help' : null, er ? key + '-err' : null].filter(Boolean).join(' ') || undefined;
      return e('div', { className: 'sp-field' },
        e('label', { className: 'sp-label', htmlFor: 'ct-' + key }, label, ' ', e('span', { className: 'sp-req', 'aria-hidden': 'true' }, '*')),
        e(input.tag, Object.assign({
          id: 'ct-' + key, ref: refs[key], required: true, 'aria-required': 'true',
          'aria-invalid': er ? 'true' : 'false', 'aria-describedby': desc,
          value: v[key], onChange: set(key),
        }, input.props)),
        er ? e('p', { id: key + '-err', className: 'sp-err' }, er) : null,
        help || null);
    };
    const count = v.message.length >= COUNTER_FROM
      ? e('p', { id: 'message-help', className: 'sp-help', 'aria-live': 'polite' }, v.message.length + ' / ' + MAXLEN)
      : null;
    const sending = status === 'sending';

    return e('form', { className: 'sp-form', noValidate: true, onSubmit, 'aria-labelledby': 'page-title' },
      liveRegion,
      formErr ? e('div', { className: 'sp-formerr', role: 'alert' },
        'Something went wrong and your message was not sent. Please try again, or send me a DM on ',
        e('a', { href: window.EXTERNAL.linkedin, target: '_blank', rel: 'noopener noreferrer' }, 'LinkedIn'),
        ' or ',
        e('a', { href: window.EXTERNAL.instagram, target: '_blank', rel: 'noopener noreferrer' }, 'Instagram'),
        '.') : null,
      // Honeypot: off-screen and out of the tab order; people never fill it.
      e('div', { className: 'sp-hp', 'aria-hidden': 'true' },
        e('label', { htmlFor: 'ct-company' }, 'Company'),
        e('input', { id: 'ct-company', type: 'text', tabIndex: -1, autoComplete: 'off', value: v.company, onChange: set('company') })),
      field('name', L.name, { tag: 'input', props: { className: 'sp-input', type: 'text', autoComplete: 'name' } }),
      field('email', L.email, { tag: 'input', props: { className: 'sp-input', type: 'email', autoComplete: 'email', inputMode: 'email' } }),
      field('location', L.location, { tag: 'input', props: { className: 'sp-input', type: 'text', autoComplete: 'country-name' } }),
      field('message', L.message, { tag: 'textarea', props: { className: 'sp-input sp-textarea', rows: 6, maxLength: MAXLEN } }, count),
      e('fieldset', { className: 'sp-field' },
        e('legend', { className: 'sp-label' }, service.label),
        e('div', { className: 'sp-choices' },
          service.options.map((opt) => e('label', { key: opt, className: 'sp-choice' },
            e('input', {
              type: 'radio', name: 'service', value: opt, checked: v.service === opt,
              onChange: () => { setV(Object.assign({}, v, { service: opt })); track('interest_selected_manually', { interest: slugOf(opt) }); },
            }),
            e('span', null, opt))))),
      e('button', { className: 'sp-btn sp-btn--submit', type: 'submit', disabled: sending },
        e('span', null, sending ? 'Sending…' : form.submit.label),
        sending || !form.submit.arrow ? null : e('span', { 'aria-hidden': 'true' }, '→')));
  }

  function ContactPage({ p }) {
    const ctx = newCtx(p);
    return e(Frame, { p },
      e(Hero, { p, ctx }),
      e('div', { className: 'sp-body sp-body--contact' },
        e('div', { className: 'ct2-grid' },
          e('div', { className: 'ct2-form' }, e(ContactForm, { form: p.form })),
          e('div', { className: 'ct2-aside' }, p.sections.map((s) => e(Section, { key: s.id, s, ctx, variant: 'aside' }))))));
  }

  // ── Router ─────────────────────────────────────────────────────────────────
  const PAGE_TYPES = {
    home: HomePage,
    reviews: ReviewsPage,
    tools: ToolsPage,
    writing: WritingPage,
    contact: ContactPage,
  };
  function SitePage({ id }) {
    // Decorative rules draw in as they arrive (never text; see Motion).
    React.useEffect(() => {
      const M = window.Motion;
      if (!M) return;
      document.querySelectorAll('.sp-rule[data-mo]').forEach((el) => M.onView(el, (n) => n.classList.add('is-in')));
    }, [id]);
    const p = COPY[id];
    if (!p) return null;
    const Page = PAGE_TYPES[p.type] || GenericPage;
    return e(Page, { p });
  }

  function renderSitePage(id) {
    ReactDOM.createRoot(document.getElementById('root')).render(e(SitePage, { id }));
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  // Same tokens, type roles and components as the rest of the site (see
  // site-chrome.jsx): bone grounds, forest bands, one green, Archivo Black for
  // display headings, Inter Tight for section headings, Inter for reading.
  const CSS = `
.sp{--sp-max:var(--page-max);background:${S.bone};color:${S.inkText};outline:none}
/* Container per page type: reading pages sit in one centred column like the
   previous service pages; rail and card pages use more of the canvas. */
.sp--service,.sp--problem,.sp--resource,.sp--legal{--sp-max:880px}
.sp--audience,.sp--faq,.sp--about{--sp-max:1180px}
.sp-vh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
:where(.sp) p{margin:0}

/* Hero */
.sp-hero{position:relative;background:${S.bone};border-bottom:1px solid ${S.rule}}
.sp-hero__in{width:min(var(--page-canvas),var(--sp-max));margin-inline:auto;padding-block:clamp(56px,7vw,104px) clamp(48px,6vw,84px)}
.sp-hero--aside .sp-hero__in{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,0.75fr);gap:clamp(32px,5vw,72px);align-items:center}
.sp-hero__copy{max-width:900px}
.sp-eyebrow{margin:0 0 18px;font-family:${S.archivo};font-synthesis:none;font-size:13px;line-height:1.35;letter-spacing:0.07em;text-transform:uppercase;color:${S.green}}
.sp-h1{margin:0;max-width:21ch;font-family:${S.archivo};font-synthesis:none;font-size:clamp(38px,4.6vw,64px);font-weight:400;line-height:1;letter-spacing:-0.045em;color:${S.headingInk};text-wrap:balance}
.sp-h1::after{content:"";display:block;width:96px;height:1px;background:${S.green};margin-top:26px}
.sp-hero__lead{margin-top:26px;max-width:680px}
.sp-lead{font-size:clamp(19px,1.6vw,21px);line-height:1.55;color:#2C312C}
.sp-lead + .sp-lead{margin-top:16px}
.sp-hero .sp-ctas{margin-top:30px}

/* Body and sections */
.sp-body{width:min(var(--page-canvas),var(--sp-max));margin-inline:auto;padding-block:clamp(16px,3vw,40px) clamp(72px,9vw,120px)}
.sp-sec{max-width:760px;padding-top:clamp(52px,6vw,76px)}
.sp-sec--wide,.sp-sec--note{max-width:none}
.sp-sec--note{max-width:760px}
.sp-rule{display:block;width:56px;height:2px;margin-bottom:22px;background:${S.green};transform-origin:left center}
.sp-num{display:block;margin:0 0 10px;font-family:${S.archivo};font-size:clamp(18px,1.9vw,22px);line-height:1;letter-spacing:-0.03em;color:${S.green}}
.sp-h2{margin:0 0 20px;font-family:${S.display};font-synthesis:none;font-size:clamp(28px,3vw,40px);font-weight:800;line-height:1.06;letter-spacing:-0.035em;color:${S.headingInk};text-wrap:balance}
.sp-h3{margin:0 0 10px;font-family:${S.display};font-synthesis:none;font-size:clamp(20px,1.8vw,23px);font-weight:750;line-height:1.2;letter-spacing:-0.02em;color:${S.headingInk}}
.sp-p{max-width:68ch;font-size:18px;line-height:1.68;color:${S.ink2}}
.sp-p + .sp-p,.sp-p + .sp-list,.sp-list + .sp-p{margin-top:18px}
.sp-p strong,.sp-list strong{font-weight:700;color:${S.inkText}}
.sp-p a,.sp-list a,.sp-lead a{color:${S.green};text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.sp-p a:hover,.sp-list a:hover{text-decoration-thickness:2px}
.sp-p--said{font-family:${S.display};font-size:clamp(20px,1.9vw,24px);font-weight:700;line-height:1.3;letter-spacing:-0.015em;color:${S.headingInk};padding-left:20px;border-left:3px solid ${S.green}}
.sp-p--said + .sp-p--said{margin-top:14px}
.sp-list{max-width:68ch;margin:0;padding:0;list-style:none}
.sp-list li{position:relative;padding:12px 0 12px 26px;border-top:1px solid ${S.rule};font-size:18px;line-height:1.55;color:${S.ink2}}
.sp-list li:last-child{border-bottom:1px solid ${S.rule}}
.sp-list li::before{content:"";position:absolute;left:0;top:24px;width:12px;height:2px;background:${S.green}}
.sp-meta{margin-top:14px;font-size:14px;line-height:1.5;color:${S.metaLight};font-style:italic}

/* Calls to action */
.sp-ctas{display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px;margin-top:26px}
.sp-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:55px;padding:0 24px;background:${S.green};color:${S.bone};border:0;border-radius:0;font-family:${S.body};font-size:15px;font-weight:750;line-height:1.2;letter-spacing:0.045em;text-transform:uppercase;text-align:center;cursor:pointer;transition:background var(--dur-hover),gap var(--dur-hover)}
.sp-btn:hover{background:${S.greenPressed};gap:13px}
.sp-btn[disabled]{opacity:.6;cursor:progress}
.sp-link{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding-bottom:4px;border-bottom:1px solid rgba(23,25,25,0.3);font-size:13.5px;font-weight:700;line-height:1.3;letter-spacing:0.06em;text-transform:uppercase;color:#2C312C;transition:color var(--dur-hover),border-color var(--dur-hover),gap var(--dur-hover)}
.sp-link:hover{color:${S.green};border-bottom-color:${S.green};gap:12px}
.sp-link--dark{color:${S.sage};border-bottom-color:rgba(143,191,167,0.45)}
.sp-link--dark:hover{color:${S.bone};border-bottom-color:${S.bone}}
.sp-related{display:flex;flex-wrap:wrap;align-items:center;gap:10px 24px;max-width:760px;margin-top:clamp(40px,5vw,56px)}
.sp-related__k{font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${S.metaLight}}
.sp-related--dark .sp-related__k{color:${S.onForest}}
.sp-sec .sp-related,.sp-sub .sp-related{margin-top:16px}

/* Section variants */
.sp-sec--panel{max-width:820px;margin-top:clamp(52px,6vw,76px);padding:clamp(28px,4vw,44px);background:${S.boneDeep};border-left:3px solid ${S.green}}
.sp-sec--panel .sp-rule{display:none}
.sp-sec--rail{display:grid;grid-template-columns:minmax(200px,300px) minmax(0,760px);gap:clamp(28px,4vw,64px);max-width:none;align-items:start}
.sp-sec__rail{position:sticky;top:24px}
.sp-sec__rail .sp-h2{font-size:clamp(24px,2.4vw,32px)}
.sp-sec--faq .sp-sub,.sp-sec--rail .sp-sub{padding:22px 0;border-top:1px solid ${S.rule}}
.sp-sec--faq .sp-sub:last-child,.sp-sec--rail .sp-sub:last-child{border-bottom:1px solid ${S.rule}}
.sp-sec--faq .sp-sub .sp-p + .sp-p,.sp-sec--rail .sp-sub .sp-p + .sp-p{margin-top:12px}
.sp-sec--rail .sp-sec__body > .sp-sub:first-child{border-top:0;padding-top:0}
.sp-sec--aside{max-width:none;padding-top:0}
.sp-sec--aside + .sp-sec--aside{margin-top:44px}
.sp-sec--aside .sp-h2{font-size:clamp(24px,2.3vw,30px)}

/* Cards (Work With Me, Free Tools, homepage, Writing subjects) */
.sp-cards{display:grid;gap:clamp(18px,2.2vw,28px);margin-top:clamp(52px,6vw,76px)}
.sp-cards--3{grid-template-columns:repeat(3,minmax(0,1fr))}
.sp-sec .sp-cards{margin-top:8px}
.sp-cards--2{grid-template-columns:repeat(2,minmax(0,1fr))}
.sp-sec--card{display:flex;flex-direction:column;max-width:none;padding:clamp(26px,3vw,38px);background:${S.boneDeep};border-top:2px solid ${S.green}}
.sp-sec--card .sp-rule{display:none}
.sp-sec--card .sp-h2{font-size:clamp(24px,2.3vw,30px)}
.sp-sec--card .sp-ctas{margin-top:auto;padding-top:24px}
.sp-sec--card .sp-meta{margin-top:12px}

/* Reviews: quotes in a grid, no ratings */
.sp-quotes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(18px,2.2vw,28px)}
.sp-quote{display:flex;flex-direction:column;justify-content:space-between;gap:22px;margin:0;padding:clamp(24px,3vw,34px);background:${S.boneDeep};border-left:3px solid ${S.green}}
.sp-quote blockquote{margin:0}
.sp-quote blockquote p{font-size:18px;line-height:1.62;color:${S.inkText}}
.sp-quote figcaption{font-size:13px;font-weight:700;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:${S.metaLight}}

/* Writing */
.wr-featured{margin:0;padding:0;list-style:none;border-top:1px solid ${S.rule}}
.wr-featured li{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px 40px;padding:26px 0;border-bottom:1px solid ${S.rule}}
.wr-featured li .sp-h3{grid-row:span 2;margin:0}
.wr-featured li .sp-related{margin-top:10px}
.wr-subject{padding:clamp(22px,2.6vw,30px);background:${S.boneDeep}}
.wr-subject .sp-ctas{margin-top:20px}

/* Closing band — the editorial "Contact" section */
.sp-close{background:${S.forest};color:${S.onForest};border-top:2px solid ${S.green}}
.sp-close__in{width:min(var(--page-canvas),var(--sp-max));margin-inline:auto;padding-block:clamp(64px,8vw,112px)}
.sp-close__h{margin:0 0 18px;font-family:${S.archivo};font-synthesis:none;font-size:clamp(36px,4.4vw,60px);font-weight:400;line-height:1;letter-spacing:-0.045em;color:${S.bone}}
.sp-close .sp-p{max-width:52ch;font-size:clamp(19px,1.6vw,21px);line-height:1.55;color:${S.onForest}}
.sp-close .sp-ctas{margin-top:34px}
.sp-close .sp-related{margin-top:34px}

/* Homepage bands */
.hm-band{background:${S.bone}}
.hm-band--deep{background:${S.boneDeep}}
.hm-band--dark{background:${S.forest};color:${S.onForest}}
.hm-band--dark .sp-h2{color:${S.bone}}
.hm-band--dark .sp-p{color:${S.onForest}}
.hm-band--dark .sp-rule{background:${S.sage}}
.hm-band__in{width:var(--page-canvas);margin-inline:auto;padding-block:clamp(64px,8vw,108px)}
.hm-band__in > .sp-p{max-width:62ch}
.hm-band__in > .sp-h2{max-width:22ch}
.hm-band .sp-cards{margin-top:28px}
.hm-card{display:flex;flex-direction:column;padding:clamp(24px,2.8vw,34px);background:${S.bone};border-top:2px solid ${S.green}}
.hm-card__n{margin-bottom:14px;font-family:${S.archivo};font-size:20px;line-height:1;color:${S.green}}
.hm-card .sp-ctas{margin-top:auto;padding-top:22px}
.hm-read{display:flex;flex-direction:column;padding-top:18px;border-top:1px solid ${S.rule}}
.hm-read .sp-ctas{margin-top:auto;padding-top:18px}
.hm-about{display:grid;grid-template-columns:minmax(180px,300px) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:center;margin-top:8px}
.hm-about .sp-p{max-width:62ch}

/* Portraits share the site's duotone */
.sp-portrait{margin:0}
.sp-portrait img{display:block;width:100%;height:auto;filter:grayscale(1) contrast(1.12) brightness(0.96) sepia(0.14)}
.sp-portrait--hero img{aspect-ratio:4/5;object-fit:cover;object-position:50% 30%}
.hm-about__img img{aspect-ratio:1;object-fit:cover}

/* Contact */
.ct2-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(32px,5vw,72px);align-items:start;margin-top:clamp(44px,5vw,64px)}
.sp-form{padding:clamp(24px,3vw,40px);background:${S.boneDeep};border-top:2px solid ${S.green}}
.sp-field{margin:0 0 22px;padding:0;border:0}
.sp-label{display:block;margin-bottom:8px;padding:0;font-size:15px;font-weight:700;letter-spacing:0.01em;color:${S.inkText}}
.sp-req{color:${S.green}}
.sp-input{display:block;width:100%;min-height:52px;padding:13px 15px;border:1px solid rgba(23,25,25,0.28);border-radius:0;background:${S.bone};color:${S.inkText};font:inherit;font-size:16px;line-height:1.5;outline:none;transition:border-color .16s,box-shadow .16s}
.sp-textarea{min-height:170px;resize:vertical}
.sp-input:focus{border-color:${S.green};box-shadow:0 0 0 3px rgba(4,120,87,0.22)}
.sp-input[aria-invalid="true"]{border-color:#B42318}
.sp-err{margin-top:8px;font-size:14px;font-weight:600;line-height:1.45;color:#B42318}
.sp-help{margin-top:8px;font-size:13px;color:${S.metaLight};text-align:right}
.sp-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.sp-choice{display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 14px;border:1px solid rgba(23,25,25,0.22);background:${S.bone};font-size:16px;line-height:1.3;color:${S.inkText};cursor:pointer}
.sp-choice input{width:18px;height:18px;margin:0;accent-color:${S.green};flex-shrink:0}
.sp-choice:has(input:checked){border-color:${S.green};box-shadow:inset 3px 0 0 ${S.green}}
.sp-choice:has(input:focus-visible){outline:3px solid ${S.green};outline-offset:2px}
.sp-btn--submit{width:100%;margin-top:8px}
.sp-formerr{margin:0 0 20px;padding:14px 16px;border:1px solid rgba(180,35,24,.45);background:rgba(180,35,24,.06);font-size:15px;line-height:1.55;color:#B42318}
.sp-formerr a{color:#B42318;font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sp-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.sp-form--done{display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.sp-form__done{margin:0;font-family:${S.display};font-size:clamp(26px,3vw,34px);font-weight:800;line-height:1.1;letter-spacing:-0.03em;color:${S.headingInk};outline:none}

/* Responsive */
@media (max-width:1100px){
  .sp-cards--3{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:960px){
  .sp-hero--aside .sp-hero__in{grid-template-columns:1fr}
  .sp-portrait--hero{max-width:420px}
  .sp-sec--rail{grid-template-columns:1fr;gap:0}
  .sp-sec__rail{position:static}
  .ct2-grid{grid-template-columns:1fr}
  .wr-featured li{grid-template-columns:1fr}
  .wr-featured li .sp-h3{grid-row:auto}
}
@media (max-width:760px){
  .sp-cards--3,.sp-cards--2,.sp-quotes{grid-template-columns:1fr}
  .hm-about{grid-template-columns:1fr}
  .hm-about__img{max-width:260px}
  .sp-p,.sp-list li,.sp-quote blockquote p{font-size:17px}
  .sp-choices{grid-template-columns:1fr}
}
@media (max-width:420px){
  .sp-ctas .sp-btn{width:100%}
}

/* Homepage hero (unchanged from the previous homepage) */
.home-hero{position:relative;overflow:clip;background:${S.bone};color:${S.heroInk}}
.home-hero::before{content:"";position:absolute;top:0;bottom:0;left:66%;width:1px;background:rgba(4,120,87,0.55);pointer-events:none}
.home-hero__field{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.home-hero__field-m{display:none}
@media (max-width:900px){
  .home-hero__field-d{display:none}
  .home-hero__field-m{display:block}
  .home-hero::before{display:none}
}
.home-hero__grid{width:var(--page-canvas);min-height:600px;margin-inline:auto;display:grid;grid-template-columns:minmax(0,1.22fr) minmax(380px,0.78fr);align-items:center;gap:48px;padding-block:88px 112px}
.home-hero__copy{position:relative;z-index:2;min-width:0;max-width:820px;color:${S.heroInk}}
.home-hero__eyebrow{max-width:560px;margin:0;color:${S.green};font-family:${S.archivo};font-synthesis:none;font-size:13px;font-weight:400;line-height:1.35;letter-spacing:0.055em;text-transform:uppercase}
.home-hero__title{max-width:none;margin:16px 0 0;font-family:${S.archivo};font-synthesis:none;font-weight:400;font-size:clamp(40px,4.4vw,58px);line-height:0.98;letter-spacing:-0.05em;color:${S.heroInk};text-wrap:balance}
.home-hero__title::after{content:"";display:block;width:96px;height:1px;background:${S.green};margin:22px 0 22px}
.home-hero__title .home-hero__line{display:block}
.home-hero__support{max-width:640px;margin:0 0 18px;color:#2C312C;font-family:${S.body};font-size:20px;font-weight:400;line-height:1.5}
.home-hero__support:last-of-type{margin-bottom:30px}
.home-hero__photo{position:relative;z-index:1;width:clamp(380px,32vw,560px);max-width:100%;aspect-ratio:1;justify-self:end;margin:0}
.home-hero__photo::before{content:"";position:absolute;z-index:0;inset:6% -4% -2% 8%;border-radius:50%;background:${S.green}}
.home-hero__photo::after{content:"";position:absolute;z-index:0;inset:6% -4% -2% 8%;border-radius:50%;background:linear-gradient(90deg,rgba(243,240,232,0) 58%,rgba(243,240,232,0.92) 58%);pointer-events:none}
.home-hero__frame{position:absolute;z-index:1;inset:0;overflow:hidden;border-radius:50%}
.home-hero__frame img{width:100%;height:100%;object-fit:cover;object-position:56% 44%;transform:scale(1.58);filter:grayscale(1) contrast(1.12) brightness(0.96) sepia(0.14)}
.home-hero__ctarow{display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px}
.hero-cta--caps{font-size:15px;font-weight:750;letter-spacing:0.045em;text-transform:uppercase}
.home-hero__soft{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#2C312C;border-bottom:1px solid rgba(23,25,25,0.3);padding-bottom:4px;min-height:32px;transition:color .18s,border-color .18s,gap .18s}
.home-hero__soft:hover{color:${S.green};border-bottom-color:${S.green};gap:12px}
.home-hero__seal{display:flex;align-items:center;min-height:48px;margin-top:20px}
.home-hero__seal .sx-verified-seal{display:inline-flex;align-items:center;line-height:0}
.home-hero__seal img,.home-hero__seal svg{max-width:160px;max-height:48px;width:auto;height:auto;object-fit:contain;filter:none}
@media (max-width:1151px) and (min-width:521px){
  .home-hero__grid{grid-template-columns:1fr;gap:30px;width:100%;max-width:none;padding:64px 40px 84px;min-height:0}
  .home-hero__title{font-size:clamp(40px,6.0vw,54px)}
  .home-hero__support{max-width:620px}
  .home-hero__photo{width:min(58%,380px);justify-self:center}
}
@media (max-width:520px){
  .home-hero__grid{grid-template-columns:1fr;gap:34px;width:100%;max-width:none;padding:66px 20px 80px;min-height:0}
  .home-hero__title{font-size:clamp(34px,8.6vw,44px)}
  .home-hero__support{font-size:18px;line-height:1.5}
  .home-hero__photo{width:min(82%,310px);justify-self:center}
}
`;
  function SitePageStyles() {
    return e('style', { dangerouslySetInnerHTML: { __html: CSS } });
  }

  window.renderSitePage = renderSitePage;
  window.SitePage = SitePage;
})();
