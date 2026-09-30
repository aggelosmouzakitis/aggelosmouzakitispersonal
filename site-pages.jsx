// site-pages.jsx — renders the 25 canonical pages from the canonical copy.
//
// Loaded after site-nav.js, site-chrome.js and site-copy.js. Each page shell
// calls renderSitePage("<id>"); scripts/seo/prerender.js snapshots the result
// into the page's #root so the copy is in the HTML before any JavaScript runs.
//
// One visual system for every page ("Direction v4"): the 1240px site grid and
// the centred 760px reading column, one type scale (Archivo Black for the H1
// only; Inter Tight for H2, H3 and the rare statement; Inter for the rest) and
// one of each component — primary button, secondary link, service row,
// resource column, credential cell, FAQ row, continue row, dark section, image
// frame and the close. The words come verbatim from site-copy.jsx; this file
// only decides how they are set. Where the design sets one paragraph as several
// elements (a lead line and rows, a statement and the rest), the sentences are
// split, never reworded (scripts/copy/check-copy.py checks them in order).

(function () {
  const { useState, useEffect, useRef } = React;
  const e = React.createElement;
  const COPY = (window.SITE_COPY && window.SITE_COPY.pages) || {};
  const CONTACT_URL = window.CONTACT_URL || '/contact/';

  // ── Text helpers ───────────────────────────────────────────────────────────
  // Sentences of a paragraph (no lookbehind: older Safari cannot parse it).
  function sentences(text) {
    return text.replace(/([.!?…][”’]?)\s+(?=[“‘"(A-Z0-9])/g, '$1\u0000').split('\u0000').filter(Boolean);
  }
  const plain = (t) => t.replace(/\*\*/g, '');

  // **bold** → <strong>; on some pages a bold service name is also its link.
  const INLINE_LINKS = {
    faq: {
      'Individual Psychotherapy': '/individual-psychotherapy/',
      'Couples Therapy': '/couples-therapy/',
      'Professional Coaching': '/professional-coaching/',
      'Considering Therapy': '/considering-therapy/',
    },
  };
  function rich(text, ctx) {
    const links = (ctx && INLINE_LINKS[ctx.id]) || {};
    return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
      const m = part.match(/^\*\*([^*]+)\*\*$/);
      if (!m) return part;
      if (links[m[1]]) return e('a', { key: i, className: 'inl', href: links[m[1]] }, m[1]);
      return e('strong', { key: i }, m[1]);
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  const Arrow = () => e('span', { 'aria-hidden': 'true' }, '→');
  const isExternal = (href) => /^https?:/.test(href);
  function TLink({ item, className }) {
    const ext = isExternal(item.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return e('a', Object.assign({ className: 'tlink' + (className ? ' ' + className : ''), href: item.href }, ext),
      e('span', null, item.label), e(Arrow));
  }
  function Btn({ item }) {
    return e('a', { className: 'btn', href: item.href }, item.label, ' ', e(Arrow));
  }
  // Book a consultation is the primary action wherever it appears; everything
  // else is a secondary link. Links whose page is not published are left out.
  const isPrimary = (it) => it.href === CONTACT_URL;
  function Actions({ items, className }) {
    const live = items.filter((it) => it.href);
    if (!live.length) return null;
    return e('div', { className: className || 'actions' },
      live.map((it) => e(isPrimary(it) ? Btn : TLink, { key: it.label + it.href, item: it })));
  }
  const findCta = (blocks, label) => {
    for (const b of blocks) if (b.t === 'ctas') for (const it of b.items) if (it.label === label) return it;
    return null;
  };

  // ── Blocks ─────────────────────────────────────────────────────────────────
  // The default setting of every copy block. `roles` maps a paragraph index to
  // a text role: 'emph' (a short opening line), 'strong' (a closing line).
  function Blocks({ blocks, ctx, roles, dark }) {
    let pIndex = -1;
    return blocks.map((b, i) => {
      const key = b.t + i;
      switch (b.t) {
        case 'p': {
          pIndex++;
          const role = roles && roles[pIndex];
          return e('p', { key, className: 'p' + (role ? ' p--' + role : '') }, rich(b.text, ctx));
        }
        case 'lines':
          return e('ul', { key, className: 'lines' }, b.lines.map((l) => e('li', { key: l }, rich(l, ctx))));
        case 'list':
          return e('ul', { key, className: 'list' }, b.items.map((it) => e('li', { key: it }, rich(it, ctx))));
        case 'ctas':
          return e(Actions, { key, items: b.items, className: 'links' });
        case 'related':
          return e('p', { key, className: 'related' }, 'Related: ', b.items.filter((it) => it.href).map((it) => e(TLink, { key: it.label, item: it })));
        case 'meta':
          return e('p', { key, className: 'meta' }, b.text);
        case 'pairs':
          return e('dl', { key, className: 'facts' }, b.items.map((it) => e('div', { key: it.a },
            e('dt', null, it.a), e('dd', null, it.b))));
        case 'quote':
          return e('figure', { key, className: 'quote' },
            e('blockquote', null, e('p', null, b.text)),
            e('figcaption', null, b.cite));
        case 'sub':
          return e('div', { key, className: 'subsec' },
            e('h3', { className: 'h3' }, b.h3),
            e('div', { className: 'flow' }, e(Blocks, { blocks: b.blocks, ctx, dark })));
        default:
          return null;
      }
    });
  }

  // A short, single-sentence opening paragraph becomes the section's emphasis
  // line — the same role on every page, so equivalent openings read alike.
  function defaultRoles(blocks) {
    const ps = blocks.filter((b) => b.t === 'p');
    if (ps.length >= 2 && sentences(plain(ps[0].text)).length === 1 && plain(ps[0].text).length <= 90) return { 0: 'emph' };
    return null;
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  function ReadSection({ s, ctx, roles, children }) {
    return e('section', { className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'read' },
        e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
        children || e('div', { className: 'flow' }, e(Blocks, { blocks: s.blocks, ctx, roles: roles === undefined ? defaultRoles(s.blocks) : roles }))));
  }

  // Dark section: H2 and a short statement on the left (5fr), the rest on the
  // right (7fr), top-aligned. The statement is the opening sentence, split off
  // the first paragraph when that sentence is short.
  function DarkSection({ s, ctx }) {
    const blocks = s.blocks.slice();
    let statement = null;
    const first = blocks.findIndex((b) => b.t === 'p');
    if (first === 0) {
      const ss = sentences(blocks[0].text);
      if (plain(ss[0]).length <= 90) {
        statement = ss[0];
        const rest = ss.slice(1).join(' ');
        if (rest) blocks[0] = { t: 'p', text: rest }; else blocks.shift();
      }
    }
    return e('section', { className: 'band dark on-dark', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'wrap dark__in' },
        e('div', { style: { minWidth: 0 } },
          e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
          statement ? e('p', { className: 'dark__statement' }, rich(statement, ctx)) : null),
        e('div', { className: 'dark__body flow' }, e(Blocks, { blocks, ctx, dark: true }))));
  }

  // Burnout's dark section: the H2 across the top, then 5/7 — the opening
  // sentence in sage on the left, the rest on the right with its last line
  // ruled.
  function DarkTopSection({ s, ctx }) {
    const ps = s.blocks.filter((b) => b.t === 'p');
    const ss = sentences(ps[0].text);
    const lead = ss[0];
    const more = ss.slice(1).join(' ');
    const rest = s.blocks.reduce((out, b) => (b !== ps[0] ? out.concat(b) : more ? out.concat({ t: 'p', text: more }) : out), []);
    const lastP = rest.filter((b) => b.t === 'p').length - 1;
    return e('section', { className: 'band dark on-dark', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'wrap dark__in dark__in--top' },
        e('h2', { className: 'h2 dark__h2-top', id: s.id + '-h' }, s.h2),
        e('p', { className: 'dark__lead' }, rich(lead, ctx)),
        e('div', { className: 'dark__body flow' }, e(Blocks, { blocks: rest, ctx, dark: true, roles: { [lastP]: 'rule' } }))));
  }

  // Photo split: a full-bleed photograph beside the section's text, 1:1.
  function PhotoSplit({ s, ctx, photo, dark }) {
    return e('section', { className: 'band split' + (dark ? ' split--dark on-dark' : ''), id: s.id, 'aria-labelledby': s.id + '-h' },
      e('figure', { className: 'split__fig' },
        e('img', { src: photo.src, alt: photo.alt, loading: 'lazy', decoding: 'async', style: { objectPosition: photo.pos || '50% 30%' } })),
      e('div', { className: 'split__body' },
        e('div', { className: 'split__text' },
          e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
          e('div', { className: 'flow' }, e(Blocks, { blocks: s.blocks, ctx, dark })))));
  }

  // Questions and answers: one accordion row each; the page's first is open.
  function FaqSection({ s, ctx, openFirst }) {
    return e('section', { className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'read' },
        e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
        e('div', { className: 'faq' },
          s.blocks.filter((b) => b.t === 'sub').map((q, i) => e('details', { key: q.h3, open: openFirst && i === 0 ? true : undefined },
            e('summary', null,
              e('h3', null, q.h3),
              e('span', { className: 'faq__sign', 'aria-hidden': 'true' }, '+')),
            e('div', { className: 'faq__a flow' }, e(Blocks, { blocks: q.blocks, ctx })))))));
  }
  const isFaq = (s) => s.blocks.length > 0 && s.blocks.every((b) => b.t === 'sub' && /\?$/.test(b.h3));

  // "Continue with": modest rows, the heading set as a label.
  function ContinueSection({ s }) {
    const items = [].concat.apply([], s.blocks.filter((b) => b.t === 'ctas').map((b) => b.items)).filter((it) => it.href);
    return e('nav', { className: 'continue read', 'aria-labelledby': s.id + '-h' },
      e('h2', { className: 'label continue__label', id: s.id + '-h' }, s.h2),
      e('div', { className: 'continue__list' },
        items.map((it) => e('a', { key: it.href, href: it.href }, it.label, e('span', { 'aria-hidden': 'true' }, '→')))));
  }

  // The page's final "Contact" section as the dark close.
  function Close({ s, ctx }) {
    const ps = s.blocks.filter((b) => b.t === 'p');
    const items = [].concat.apply([], s.blocks.filter((b) => b.t === 'ctas').map((b) => b.items)).filter((it) => it.href);
    const text = ps.map((p) => plain(p.text)).join(' ');
    return e(window.CloseBand, {
      label: s.h2,
      text,
      actions: items.map((it) => e(isPrimary(it) ? Btn : TLink, { key: it.href, item: it })),
    });
  }
  const isClose = (s, i, all) => i === all.length - 1 && (s.h2 === 'Contact' || s.h2 === 'How to start');

  // ── Heroes ─────────────────────────────────────────────────────────────────
  function HeroText({ p, ctx, h1Class }) {
    const h = p.hero;
    const ps = h.blocks.filter((b) => b.t === 'p');
    const ctas = [].concat.apply([], h.blocks.filter((b) => b.t === 'ctas').map((b) => b.items));
    return e(React.Fragment, null,
      e('p', { className: 'eyebrow' }, h.eyebrow),
      e('h1', { className: 'h1' + (h1Class ? ' ' + h1Class : ''), id: 'page-title' }, h.h1),
      h.sub ? e('p', { className: 'sub' }, h.sub) : null,
      ps.map((b, i) => e('p', { key: i, className: 'lead' }, rich(b.text, ctx))),
      ctas.length ? e(Actions, { items: ctas }) : null);
  }
  function Frame({ photo }) {
    return e('figure', { className: 'frame' },
      e('div', { className: 'frame__img' },
        e('img', { src: photo.src, alt: photo.alt, fetchPriority: 'high', style: { objectPosition: photo.pos || '50% 30%' } })));
  }
  function Hero({ p, ctx }) {
    const photo = HERO_PHOTO[p.id];
    if (photo) {
      return e('header', { className: 'wrap hero-split' },
        e('div', { style: { minWidth: 0 } }, e(HeroText, { p, ctx })),
        e(Frame, { photo }));
    }
    return e('header', { className: 'read hero-read' }, e(HeroText, { p, ctx }));
  }

  // ── Layout decisions, page by page ─────────────────────────────────────────
  // Photography only where an existing photograph of Aggelos helps the page.
  // (The old offer-page portraits are not used: their graphic backgrounds
  // belong to the retired design.)
  const HERO_PHOTO = {
    'individual-psychotherapy': { src: '/img/aggelos-opinion.jpeg', alt: 'Aggelos Mouzakitis in conversation', pos: '52% 30%' },
    about: { src: '/img/aggelos-continuation.webp', alt: 'Aggelos Mouzakitis', pos: '50% 22%' },
  };
  // At most one strong interruption per page: a dark section, or a photo split.
  const DARK = {
    'individual-psychotherapy': 'functioning-at-work',
    'couples-therapy': 'work-and-the-relationship',
    'professional-coaching': 'when-psychotherapy-fits-better',
    'greek-speaking-psychotherapist': 'living-abroad',
    'relationship-problems-men': 'resentment-and-avoidance',
    'separation-divorce-men': 'grief-after-a-relationship-ends',
    'work-affecting-relationship': 'work-security-and-the-relationship',
    'career-transition-therapy': 'career-identity',
    'anxiety-overthinking': 'anxiety-that-looks-productive',
    'achievement-self-worth': 'perfectionism',
    'considering-therapy': 'i-already-understand-why-i-do-it',
    about: 'from-customer-research-to-clinical-work',
  };
  const DARK_TOP = { 'executive-burnout-therapy': 'when-the-workload-is-the-problem' };
  const PHOTO_SPLIT = {
    'therapy-for-men-in-tech': { id: 'my-background', src: '/img/aggelos-homepage.webp', alt: 'Aggelos Mouzakitis speaking on stage at a technology conference', pos: '44% 38%' },
    'therapy-for-founders': { id: 'my-background', src: '/img/wtf-friday-speaking.webp', alt: 'Aggelos Mouzakitis leading a workshop', pos: '28% 30%' },
    'therapy-for-executives': { id: 'my-background', src: '/img/aggelos-opinion.jpeg', alt: 'Aggelos Mouzakitis in conversation', pos: '52% 30%' },
  };
  // Text roles the reference designs set explicitly (paragraph index → role).
  const ROLES = {
    'executive-burnout-therapy': { 'time-off-doesnt-always-fix-it': { 2: 'strong' } },
  };

  // ── Individual Psychotherapy (reference design) ───────────────────────────
  function TriggersSection({ s, ctx }) {
    const ps = s.blocks.filter((b) => b.t === 'p');
    return e('section', { className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'wrap' },
        e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
        e('p', { className: 'p p--lead500' }, rich(ps[0].text, ctx)),
        e('ul', { className: 'grid2' }, sentences(ps[1].text).map((t) => e('li', { key: t }, rich(t, ctx))))));
  }
  function StatementSection({ s, ctx, where }) {
    // where = 'first': the first paragraph's opening sentence is the statement;
    // 'last': the last paragraph's closing sentence is.
    const blocks = s.blocks.slice();
    const idx = where === 'first' ? blocks.findIndex((b) => b.t === 'p') : blocks.map((b) => b.t).lastIndexOf('p');
    const ss = sentences(blocks[idx].text);
    const stmt = where === 'first' ? ss[0] : ss[ss.length - 1];
    const rest = (where === 'first' ? ss.slice(1) : ss.slice(0, -1)).join(' ');
    const before = blocks.slice(0, idx);
    const after = blocks.slice(idx + 1);
    const restBlock = rest ? [{ t: 'p', text: rest }] : [];
    const stmtEl = e('p', { className: 'statement', key: 'stmt' }, rich(stmt, ctx));
    return e(ReadSection, { s, ctx },
      e('div', { className: 'flow' },
        where === 'first'
          ? [stmtEl, e(Blocks, { key: 'b', blocks: before.concat(restBlock, after), ctx })]
          : [e(Blocks, { key: 'a', blocks: before.concat(restBlock), ctx }), stmtEl, e(Blocks, { key: 'b', blocks: after, ctx })]));
  }
  // Two equal routes: each paragraph with its own link under its own label.
  function RoutesSection({ s, ctx, routes }) {
    const ps = s.blocks.filter((b) => b.t === 'p');
    return e('section', { className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
      e('div', { className: 'wrap' },
        e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
        e('div', { className: 'routes' },
          routes.map((r, i) => {
            const link = findCta(s.blocks, r.link);
            return e('div', { key: r.h3, className: 'route' },
              e('h3', { className: 'h3' }, r.h3),
              e('p', { className: 'p' }, rich(ps[i].text, ctx)),
              link ? e('div', { className: 'links' }, e(TLink, { item: link })) : null);
          }))));
  }
  const INDIVIDUAL = {
    'what-brings-people-in': (s, ctx) => e(TriggersSection, { s, ctx }),
    'what-happens-in-sessions': (s, ctx) => e(StatementSection, { s, ctx, where: 'first' }),
    'work-in-psychotherapy': (s, ctx) => e(StatementSection, { s, ctx, where: 'last' }),
    relationships: (s, ctx) => e(RoutesSection, { s, ctx, routes: [
      { h3: 'Individual psychotherapy', link: 'Relationship problems' },
      { h3: 'Couples therapy', link: 'Couples therapy' },
    ] }),
  };
  const CUSTOM_SECTIONS = { 'individual-psychotherapy': INDIVIDUAL };

  // ── Generic page: hero, then each section in its setting ──────────────────
  function sectionFor(p, s, i, all, ctx, state) {
    const custom = CUSTOM_SECTIONS[p.id] && CUSTOM_SECTIONS[p.id][s.id];
    if (custom) return custom(s, ctx);
    if (isClose(s, i, all)) return e(Close, { s, ctx });
    if (s.h2 === 'Continue with') return e(ContinueSection, { s });
    if (DARK[p.id] === s.id) return e(DarkSection, { s, ctx });
    if (DARK_TOP[p.id] === s.id) return e(DarkTopSection, { s, ctx });
    const photo = PHOTO_SPLIT[p.id];
    if (photo && photo.id === s.id) return e(PhotoSplit, { s, ctx, photo });
    if (isFaq(s)) {
      const openFirst = !state.opened;
      state.opened = true;
      return e(FaqSection, { s, ctx, openFirst });
    }
    const roles = ROLES[p.id] && ROLES[p.id][s.id];
    return e(ReadSection, { s, ctx, roles });
  }
  function Sections({ p, ctx, sections }) {
    const list = sections || p.sections;
    const state = { opened: false };
    return list.map((s, i) => e(React.Fragment, { key: s.id }, sectionFor(p, s, i, list, ctx, state)));
  }
  function GenericPage({ p }) {
    const ctx = { id: p.id };
    return e(React.Fragment, null, e(Hero, { p, ctx }), e(Sections, { p, ctx }));
  }

  // ── Homepage (reference design) ────────────────────────────────────────────
  const HOME_PHOTOS = {
    hero: { src: '/img/aggelos-continuation.webp', alt: 'Aggelos Mouzakitis' },
    context: { src: '/img/aggelos-homepage.webp', alt: 'Aggelos Mouzakitis speaking on stage at a technology conference', pos: '44% 38%' },
    about: { src: '/img/wtf-friday-speaking.webp', alt: 'Aggelos Mouzakitis leading a workshop', pos: '28% 30%' },
  };
  function HomePage({ p }) {
    const ctx = { id: p.id };
    const S = {};
    p.sections.forEach((s) => { S[s.id] = s; });
    const out = [];

    out.push(e('section', { key: 'hero', className: 'home-hero', 'aria-labelledby': 'page-title' },
      e('div', { className: 'home-hero__lines', 'aria-hidden': 'true' },
        e('span', { className: 'home-hero__axis' }),
        Array.from({ length: 10 }, (_, i) => e('span', { key: i, className: 'home-hero__field', style: { top: (22 + i * 7) + '%' } }))),
      e('div', { className: 'wrap home-hero__in' },
        e('div', { className: 'home-hero__text' }, e(HeroText, { p, ctx, h1Class: 'h1--home' })),
        e('figure', { className: 'home-fig' },
          e('span', { className: 'home-fig__disc', 'aria-hidden': 'true' }),
          e('span', { className: 'home-fig__cut', 'aria-hidden': 'true' }),
          e('span', { className: 'home-fig__img' }, e('img', { src: HOME_PHOTOS.hero.src, alt: HOME_PHOTOS.hero.alt, fetchPriority: 'high' }))))));

    const creds = S['credential-strip'];
    if (creds) {
      const pairs = creds.blocks.find((b) => b.t === 'pairs');
      out.push(e('section', { key: 'creds', className: 'creds', 'aria-label': 'Background' },
        e('ul', { className: 'wrap' }, pairs.items.map((it) => e('li', { key: it.a },
          e('span', { className: 'creds__a' }, it.a), e('span', { className: 'creds__b' }, it.b))))));
    }

    const brings = S['what-brings-people-here'];
    if (brings) {
      out.push(e('section', { key: 'brings', className: 'sec', id: brings.id, 'aria-labelledby': 'brings-h' },
        e('div', { className: 'wrap' },
          e('h2', { className: 'h2', id: 'brings-h' }, brings.h2),
          e('div', { className: 'flow home-brings' }, e(Blocks, { blocks: brings.blocks, ctx })))));
    }

    const context = S['work-is-part-of-the-context'];
    if (context) out.push(e(PhotoSplit, { key: 'context', s: context, ctx, photo: HOME_PHOTOS.context, dark: true }));

    const how = S['how-i-work'];
    if (how) {
      const ps = how.blocks.filter((b) => b.t === 'p');
      const s1 = sentences(ps[0].text);
      const s2 = sentences(ps[1].text);
      const link = how.blocks.find((b) => b.t === 'ctas');
      out.push(e('section', { key: 'how', className: 'sec', id: how.id, 'aria-labelledby': 'how-h' },
        e('div', { className: 'wrap' },
          e('h2', { className: 'h2', id: 'how-h' }, how.h2),
          e('p', { className: 'statement home-how__statement' }, s1[0]),
          e('div', { className: 'home-how' },
            e('p', { className: 'p' }, s1.slice(1).join(' ')),
            e('div', { style: { minWidth: 0 } },
              e('p', { className: 'p home-how__lines' }, s2.map((t, i) => e('span', {
                key: t,
                className: i === s2.length - 1 ? 'is-last' : i > 0 ? 'is-mid' : null,
              }, t, i < s2.length - 1 ? ' ' : null))),
              link ? e(Actions, { items: link.items, className: 'links' }) : null)))));
    }

    const ways = S['ways-to-work-with-me'];
    if (ways) {
      const subs = ways.blocks.filter((b) => b.t === 'sub');
      out.push(e('section', { key: 'ways', className: 'sec', id: ways.id, 'aria-labelledby': 'ways-h' },
        e('div', { className: 'wrap' },
          e('h2', { className: 'h2', id: 'ways-h' }, ways.h2),
          e(ServiceRows, { rows: subs.map((sub) => ({ title: sub.h3, blocks: sub.blocks, tag: 'h3' })), ctx }))));
    }

    const read = S['if-you-want-to-read-first'];
    if (read) {
      const ps = read.blocks.filter((b) => b.t === 'p');
      const links = [].concat.apply([], read.blocks.filter((b) => b.t === 'ctas').map((b) => b.items));
      out.push(e('section', { key: 'read', className: 'band sage', id: read.id, 'aria-labelledby': 'read-h' },
        e('div', { className: 'wrap sage__in' },
          e('h2', { className: 'h2', id: 'read-h' }, read.h2),
          e('div', { className: 'cols3' }, ps.map((b, i) => {
            const m = b.text.match(/^\*\*([^*]+)\*\*/);
            return e('div', { key: i, className: 'col' },
              m ? e('h3', { className: 'h3' }, m[1]) : null,
              e('p', { className: 'p' }, plain(b.text)),
              links[i] ? e('div', { className: 'links' }, e(TLink, { item: links[i] })) : null);
          })))));
    }

    const about = S['about-me'];
    if (about) out.push(e(PhotoSplit, { key: 'about', s: about, ctx, photo: HOME_PHOTOS.about }));

    const contact = S.contact;
    if (contact) out.push(e(Close, { key: 'close', s: contact, ctx }));
    return out;
  }

  // Service rows: number, title, then the description and its link.
  function ServiceRows({ rows, ctx }) {
    return e('div', { className: 'rows' }, rows.map((r, i) => e('div', { key: r.title, className: 'row', id: r.id },
      e('span', { className: 'row__num', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
      e(r.tag, { className: 'row__title', id: r.id ? r.id + '-h' : undefined }, r.title),
      e('div', { className: 'row__body flow' }, e(Blocks, { blocks: r.blocks, ctx })))));
  }

  // ── Work With Me: the three services as equal rows ─────────────────────────
  const SERVICE_SECTIONS = ['individual-psychotherapy', 'couples-therapy', 'professional-coaching'];
  function WorkWithMePage({ p }) {
    const ctx = { id: p.id };
    const svc = p.sections.filter((s) => SERVICE_SECTIONS.includes(s.id));
    const rest = p.sections.filter((s) => !SERVICE_SECTIONS.includes(s.id));
    return e(React.Fragment, null,
      e(Hero, { p, ctx }),
      e('section', { className: 'sec', 'aria-label': 'Services' },
        e('div', { className: 'wrap' },
          e(ServiceRows, { rows: svc.map((s) => ({ title: s.h2, blocks: s.blocks, tag: 'h2', id: s.id })), ctx }))),
      e(Sections, { p, ctx, sections: rest }));
  }

  // ── Therapy vs Coaching: one restrained comparison, then reading ──────────
  const COMPARISON = ['when-coaching-is-enough', 'when-psychotherapy-gives-us-more-room'];
  function TherapyVsCoachingPage({ p }) {
    const ctx = { id: p.id };
    const pair = COMPARISON.map((id) => p.sections.find((s) => s.id === id)).filter(Boolean);
    const rest = p.sections.filter((s) => !COMPARISON.includes(s.id));
    return e(React.Fragment, null,
      e(Hero, { p, ctx }),
      pair.length === 2 ? e('div', { className: 'sec' },
        e('div', { className: 'wrap compare' }, pair.map((s) => e('section', { key: s.id, id: s.id, className: 'compare__col', 'aria-labelledby': s.id + '-h' },
          e('h2', { className: 'compare__h', id: s.id + '-h' }, s.h2),
          e('div', { className: 'flow' }, e(Blocks, { blocks: s.blocks, ctx })))))) : null,
      e(Sections, { p, ctx, sections: pair.length === 2 ? rest : p.sections }));
  }

  // ── Reviews ────────────────────────────────────────────────────────────────
  function ReviewsPage({ p }) {
    const ctx = { id: p.id };
    return e(React.Fragment, null, e(Hero, { p, ctx }), p.sections.map((s, i, all) => {
      if (isClose(s, i, all)) return e(Close, { key: s.id, s, ctx });
      if (s.blocks.some((b) => b.t === 'quote')) {
        return e('section', { key: s.id, className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
          e('div', { className: 'read' },
            e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
            e('div', { className: 'quotes' }, e(Blocks, { blocks: s.blocks, ctx }))));
      }
      return e(ReadSection, { key: s.id, s, ctx });
    }));
  }

  // ── Free Tools ─────────────────────────────────────────────────────────────
  function ToolsPage({ p }) {
    const ctx = { id: p.id };
    return e(React.Fragment, null, e(Hero, { p, ctx }), p.sections.map((s) => {
      const tool = s.blocks.some((b) => b.t === 'meta');
      if (!tool) {
        return e('section', { key: s.id, className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
          e('div', { className: 'read' },
            e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
            e('div', { className: 'flow' }, e(Blocks, { blocks: s.blocks.filter((b) => b.t !== 'ctas'), ctx })),
            e(Actions, { items: [].concat.apply([], s.blocks.filter((b) => b.t === 'ctas').map((b) => b.items)) })));
      }
      const start = s.blocks.find((b) => b.t === 'ctas');
      const meta = s.blocks.find((b) => b.t === 'meta');
      const others = s.blocks.filter((b) => b !== start && b !== meta);
      return e('section', { key: s.id, className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
        e('div', { className: 'read tool' },
          e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
          e('div', { className: 'flow' }, e(Blocks, { blocks: others.filter((b) => b.t === 'p'), ctx })),
          e('div', { className: 'actions' },
            start.items.map((it) => e('a', { key: it.href, className: 'btn', href: it.href }, it.label, ' ', e(Arrow))),
            meta ? e('span', { className: 'meta' }, meta.text) : null),
          e('div', { className: 'flow tool__related' }, e(Blocks, { blocks: others.filter((b) => b.t !== 'p'), ctx }))));
    }));
  }

  // ── Writing ────────────────────────────────────────────────────────────────
  function WritingPage({ p }) {
    const ctx = { id: p.id };
    return e(React.Fragment, null, e(Hero, { p, ctx }), p.sections.map((s, i, all) => {
      if (isClose(s, i, all)) return e(Close, { key: s.id, s, ctx });
      const subs = s.blocks.filter((b) => b.t === 'sub');
      if (s.id === 'featured') {
        return e('section', { key: s.id, className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
          e('div', { className: 'read' },
            e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
            e('div', { className: 'essays' }, subs.map((sub) => e('article', { key: sub.h3, className: 'essay' },
              e('h3', { className: 'h3' }, sub.h3),
              e('div', { className: 'flow' }, e(Blocks, { blocks: sub.blocks, ctx })))))));
      }
      if (subs.length && subs.length === s.blocks.length) {
        return e('section', { key: s.id, className: 'sec', id: s.id, 'aria-labelledby': s.id + '-h' },
          e('div', { className: 'wrap' },
            e('h2', { className: 'h2', id: s.id + '-h' }, s.h2),
            e('div', { className: 'cols3' }, subs.map((sub) => e('div', { key: sub.h3, className: 'col' },
              e('h3', { className: 'h3' }, sub.h3),
              e('div', { className: 'flow' }, e(Blocks, { blocks: sub.blocks, ctx })))))));
      }
      return e(ReadSection, { key: s.id, s, ctx });
    }));
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  // Delivery goes through window.submitLead (lead-capture.js): the EmailJS
  // notification plus a row in the enquiries sheet, the same path the contact
  // form has always used. Validation, the honeypot, the soft rate limit and the
  // analytics events are unchanged.
  const MAXLEN = 3000;
  const COUNTER_FROM = 2600;
  const CONTACT_TEMPLATE = 'template_6mv5hou';
  // Offered only if sending fails; the address the previous site published.
  const CONTACT_EMAIL = 'aggelos.mouzakitis@gmail.com';
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
    const fields = form.fields;
    const labelOf = (i) => (fields[i] ? fields[i].label : '');
    // The four fields of the copy, in its order; Service is optional so nobody
    // has to decide on a service before getting in touch.
    const L = { name: labelOf(0), email: labelOf(1), location: labelOf(2), message: labelOf(3) };
    const service = fields.find((f) => f.options) || { label: 'Service', options: [] };

    const [v, setV] = useState({ name: '', email: '', location: '', message: '', service: '', company: '' });
    const [errors, setErrors] = useState({});
    const [formErr, setFormErr] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | sending | success
    const refs = { name: useRef(null), email: useRef(null), location: useRef(null), message: useRef(null) };
    const live = useRef(null);
    const successRef = useRef(null);
    const lastRef = useRef(0);

    useEffect(() => { track('contact_page_viewed', { source_page: document.referrer || 'direct' }); }, []);
    useEffect(() => {
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
      const body = ['Location: ' + loc, 'Service: ' + svc, '', 'Message:', msg, '', 'Referrer: ' + src].join('\n');
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
      return e('div', { className: 'ct-form ct-form--done' },
        liveRegion,
        e('h2', { className: 'sp-form__done', tabIndex: -1, ref: successRef }, 'Thank you. I’ve got your message.'),
        e('p', { className: 'p' }, 'I’ll read it myself and get back to you personally.'),
        e('div', { className: 'links' }, e(TLink, { item: { label: 'Back to the homepage', href: '/' } })));
    }

    const field = (key, label, input, help) => {
      const er = errors[key];
      const desc = [help ? key + '-help' : null, er ? key + '-err' : null].filter(Boolean).join(' ') || undefined;
      return e('div', { className: 'ct-field' },
        e('label', { className: 'ct-label', htmlFor: 'ct-' + key }, label),
        e(input.tag, Object.assign({
          id: 'ct-' + key, ref: refs[key], required: true, 'aria-required': 'true',
          'aria-invalid': er ? 'true' : 'false', 'aria-describedby': desc,
          value: v[key], onChange: set(key),
        }, input.props)),
        er ? e('p', { id: key + '-err', className: 'sp-err' }, er) : null,
        help || null);
    };
    const count = v.message.length >= COUNTER_FROM
      ? e('p', { id: 'message-help', className: 'ct-help', 'aria-live': 'polite' }, v.message.length + ' / ' + MAXLEN)
      : null;
    const sending = status === 'sending';

    return e('form', { className: 'ct-form', noValidate: true, onSubmit, 'aria-labelledby': 'page-title' },
      liveRegion,
      formErr ? e('div', { className: 'sp-formerr', role: 'alert' },
        'Something went wrong and your message was not sent. Please try again. If the form is not working, you can email me at ',
        e('a', { href: 'mailto:' + CONTACT_EMAIL }, CONTACT_EMAIL),
        '.') : null,
      // Honeypot: off-screen and out of the tab order; people never fill it.
      e('div', { className: 'sp-hp', 'aria-hidden': 'true' },
        e('label', { htmlFor: 'ct-company' }, 'Company'),
        e('input', { id: 'ct-company', type: 'text', tabIndex: -1, autoComplete: 'off', value: v.company, onChange: set('company') })),
      e('div', { className: 'ct-pair' },
        field('name', L.name, { tag: 'input', props: { className: 'ct-input', type: 'text', autoComplete: 'name' } }),
        field('email', L.email, { tag: 'input', props: { className: 'ct-input', type: 'email', autoComplete: 'email', inputMode: 'email' } })),
      field('location', L.location, { tag: 'input', props: { className: 'ct-input', type: 'text', autoComplete: 'country-name' } }),
      e('fieldset', { className: 'ct-field ct-service' },
        e('legend', { className: 'ct-label' }, service.label),
        e('div', { className: 'ct-choices' },
          service.options.map((opt) => e('label', { key: opt, className: 'ct-choice' },
            e('input', {
              type: 'radio', name: 'service', value: opt, checked: v.service === opt,
              onChange: () => { setV(Object.assign({}, v, { service: opt })); track('interest_selected_manually', { interest: slugOf(opt) }); },
            }),
            e('span', null, opt))))),
      field('message', L.message, { tag: 'textarea', props: { className: 'ct-input ct-textarea', rows: 6, maxLength: MAXLEN } }, count),
      e('button', { className: 'btn ct-submit', type: 'submit', disabled: sending },
        e('span', null, sending ? 'Sending…' : form.submit.label),
        sending ? null : e(Arrow)));
  }

  function ContactPage({ p }) {
    const ctx = { id: p.id };
    const h = p.hero;
    const ps = h.blocks.filter((b) => b.t === 'p');
    const next = p.sections.find((s) => s.id === 'what-happens-next');
    const privacy = p.sections.find((s) => s.id === 'privacy');
    const others = p.sections.filter((s) => s !== next && s !== privacy);
    return e('div', { className: 'wrap contact' },
      e('header', { className: 'contact__head' },
        e('p', { className: 'eyebrow' }, h.eyebrow),
        e('h1', { className: 'h1', id: 'page-title' }, h.h1),
        ps.map((b, i) => e('p', { key: i, className: 'lead' + (i === ps.length - 1 && ps.length > 1 ? ' lead--strong' : '') }, rich(b.text, ctx)))),
      e('div', { className: 'contact__grid' },
        e('div', { className: 'contact__form' }, e(ContactForm, { form: p.form })),
        e('aside', { className: 'contact__aside' },
          next ? e('section', { className: 'contact__next', 'aria-labelledby': 'next-h' },
            e('h2', { className: 'contact__h', id: 'next-h' }, next.h2),
            e('div', { className: 'flow' }, e(Blocks, { blocks: next.blocks, ctx }))) : null,
          privacy ? e('section', { className: 'contact__privacy', 'aria-labelledby': 'privacy-h' },
            e('h2', { className: 'label contact__privacy-h', id: 'privacy-h' }, privacy.h2),
            e('div', { className: 'flow' }, e(Blocks, { blocks: privacy.blocks, ctx }))) : null,
          others.map((s) => e(ReadSection, { key: s.id, s, ctx })))));
  }

  // ── Router ─────────────────────────────────────────────────────────────────
  const PAGES = {
    home: HomePage,
    'work-with-me': WorkWithMePage,
    'therapy-vs-coaching': TherapyVsCoachingPage,
    reviews: ReviewsPage,
    'free-tools': ToolsPage,
    blog: WritingPage,
    contact: ContactPage,
  };
  const FAMILY = { problem: 'fam-problem', audience: 'fam-audience', service: 'fam-service', resource: 'fam-resource' };

  function SitePage({ id }) {
    const p = COPY[id];
    if (!p) return null;
    const Page = PAGES[id] || GenericPage;
    return e(React.Fragment, null,
      e(window.ChromeStyles),
      e('style', { dangerouslySetInnerHTML: { __html: CSS } }),
      e(window.SiteHeader),
      e('main', { id: 'main', tabIndex: -1, className: 'pg ' + (FAMILY[p.type] || 'fam-' + p.type) + ' pg--' + id },
        e(Page, { p })),
      e(window.SiteFooterX));
  }

  function renderSitePage(id) {
    const root = document.getElementById('root');
    ReactDOM.createRoot(root).render(e(SitePage, { id }));
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  // Tokens (colours, fonts, --gutter, --sec) and the button, link, header,
  // footer and close styles live in site-chrome.jsx.
  const CSS = `
.pg{display:block;outline:none}
.pg img{filter:grayscale(1) contrast(1.12) brightness(.96) sepia(.14)}
.label{margin:0;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--meta)}

/* Type */
.eyebrow{margin:0 0 18px;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
.h1{margin:0;max-width:17ch;font-family:var(--font-display);font-weight:400;font-size:clamp(40px,calc(30px + 2.1vw),60px);line-height:1.0;letter-spacing:-.04em;color:var(--heading);text-wrap:balance}
.hero-read .h1{max-width:16ch}
.h1--home{max-width:15ch}
.sub{margin:22px 0 0;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + .6vw),30px);font-weight:650;line-height:1.2;letter-spacing:-.02em;color:var(--green);text-wrap:balance}
.lead{margin:24px 0 0;max-width:58ch;font-size:clamp(19px,calc(18.4px + .12vw),20px);line-height:1.55;color:var(--body);text-wrap:pretty}
.sub + .lead{margin-top:26px}
.lead + .lead{margin-top:16px}
.h2{margin:0 0 24px;font-family:var(--font-heading);font-size:clamp(30px,calc(26px + 1vw),40px);font-weight:800;line-height:1.08;letter-spacing:-.03em;color:var(--heading);text-wrap:balance}
.h3{margin:0 0 14px;font-family:var(--font-heading);font-size:clamp(22px,calc(20.5px + .3vw),24.5px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading);text-wrap:balance}
.p{margin:0;font-size:clamp(17px,calc(16px + .14vw),18px);line-height:1.7;color:var(--body);text-wrap:pretty}
.p strong{font-weight:600;color:var(--heading)}
.p--emph{font-size:clamp(19px,calc(18.4px + .14vw),20.5px);font-weight:550;line-height:1.45;color:var(--heading)}
.p--lead500{margin:0 0 32px;font-size:clamp(19px,calc(18.4px + .12vw),20px);font-weight:500;line-height:1.5;color:var(--ink-2)}
.p--strong{font-weight:600;color:var(--heading)}
.statement{margin:0;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + .7vw),32px);font-weight:650;line-height:1.18;letter-spacing:-.02em;color:var(--heading);text-wrap:balance}
.inl{color:var(--green);font-weight:600;border-bottom:1.5px solid currentColor}
.inl:hover{color:var(--green-pressed)}
.meta{margin:0;font-size:15px;line-height:1.5;color:var(--meta)}
.related{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:0 10px;font-size:15px;color:var(--meta)}

/* Flow: paragraph → paragraph 18px, content → link 22px */
.flow>*{margin-top:0;margin-bottom:0}
.flow>*+*{margin-top:18px}
.flow>.links,.flow>.actions{margin-top:22px}
.flow>.statement+*{margin-top:24px}
.flow>.facts+*{margin-top:32px}
.flow>*+.statement{margin-top:24px}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:32px}
.links{display:flex;flex-wrap:wrap;align-items:center;gap:4px 28px}
.subsec+.subsec{margin-top:40px}

/* Heroes */
.hero-split{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:48px clamp(40px,5vw,72px);align-items:center;padding-block:clamp(48px,5vw,72px) clamp(56px,6vw,88px)}
.hero-read{padding-top:clamp(56px,6vw,88px)}
.frame{position:relative;margin:12px;justify-self:end;width:min(calc(100% - 24px),420px)}
.frame::before{content:"";position:absolute;inset:-12px;border:1px solid rgba(4,120,87,.6);pointer-events:none}
.frame__img{aspect-ratio:4/5;overflow:hidden;background:var(--forest)}
.frame__img img{display:block;width:100%;height:100%;object-fit:cover}
@media (max-width:899px){.hero-split{grid-template-columns:minmax(0,1fr)}.frame{justify-self:start;width:min(calc(100% - 24px),320px)}}

/* Sections: 96px apart; reading sections on problem pages 88px */
.sec{padding-top:var(--sec)}
.fam-problem .sec+.sec{padding-top:clamp(64px,6.1vw,88px)}
.pg>:last-child:not(.band){padding-bottom:var(--sec)}
.band{margin-top:var(--sec)}
.band+.band{margin-top:0}
.pg>.band:first-child{margin-top:0}

/* Dark section: 5/7, top-aligned */
.dark{background:var(--forest);color:var(--bone)}
.dark__in{padding-block:var(--sec);display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:24px clamp(48px,6.5vw,96px);align-items:start}
.dark .h2{color:var(--bone)}
.dark .p{color:var(--on-forest)}
.dark .p strong{color:var(--bone)}
.dark__statement{margin:0;max-width:22ch;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + .6vw),30px);font-weight:650;line-height:1.2;letter-spacing:-.02em;color:var(--sage);text-wrap:balance}
.dark__body{min-width:0;max-width:620px}
.dark__in--top{row-gap:0}
.dark__h2-top{grid-column:1/-1;max-width:24ch;margin-bottom:clamp(28px,3vw,40px);font-size:clamp(30px,calc(26px + 1.1vw),42px)}
.dark__lead{margin:0;max-width:30ch;font-size:clamp(19px,calc(18px + .25vw),21.5px);font-weight:600;line-height:1.45;color:var(--sage);text-wrap:pretty}
.dark .p--rule{padding-left:18px;border-left:2px solid var(--sage);font-weight:600;color:var(--bone)}
@media (max-width:899px){.dark__in{grid-template-columns:minmax(0,1fr)}.dark__in--top{row-gap:24px}.dark__h2-top{margin-bottom:0}}

/* Photo split: 1:1, the photograph full-bleed */
.split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);container-type:inline-size}
.split--dark{background:var(--forest);color:var(--bone)}
.split--dark .h2{color:var(--bone)}
.split--dark .p{color:var(--on-forest)}
.split__fig{position:relative;margin:0;min-height:600px;overflow:hidden;background:var(--forest)}
.split__fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.split--dark .split__fig img{filter:grayscale(1) contrast(1.12) brightness(.9) sepia(.14)}
.split__body{min-width:0;display:flex;align-items:center;padding:var(--sec) calc((100vw - min(1240px, 100vw - 2 * var(--gutter))) / 2) var(--sec) clamp(48px,5.5vw,80px);padding-right:calc((100cqw - min(1240px, 100cqw - 2 * var(--gutter))) / 2)}
.split__text{max-width:560px}
@media (max-width:899px){.split{grid-template-columns:minmax(0,1fr)}.split__fig{min-height:280px}.split__body{padding:56px var(--gutter) 64px}}

/* FAQ rows */
.faq{border-top:1px solid var(--rule-2)}
.faq details{border-bottom:1px solid var(--rule-2)}
.faq summary{display:flex;justify-content:space-between;align-items:baseline;gap:24px;min-height:64px;padding:22px 0;cursor:pointer;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary h3{margin:0;font-family:var(--font-heading);font-size:clamp(19px,calc(18.5px + .1vw),20px);font-weight:650;line-height:1.35;color:var(--heading)}
.faq summary:hover h3{color:var(--green)}
.faq__sign{flex:0 0 auto;color:var(--green);font-size:24px;line-height:1;transition:transform 200ms cubic-bezier(.22,1,.36,1)}
.faq details[open] .faq__sign{transform:rotate(45deg)}
.faq__a{padding:0 0 24px}
.faq__a .p{font-size:clamp(17px,calc(16.4px + .1vw),17.5px);line-height:1.65}

/* Continue with */
.continue{padding-top:clamp(56px,5vw,72px)}
.continue__label{margin:0 0 14px;color:var(--meta)}
.continue__list{border-bottom:1px solid rgba(23,25,25,.2)}
.continue__list a{display:flex;justify-content:space-between;align-items:center;gap:20px;min-height:56px;border-top:1px solid rgba(23,25,25,.2);font-size:17px;font-weight:600;color:var(--heading)}
.continue__list a span{color:var(--green)}
.continue__list a:hover{color:var(--green)}

/* Service rows */
.rows{border-bottom:1px solid var(--rule)}
.row{display:grid;grid-template-columns:56px minmax(0,5fr) minmax(0,7fr);gap:8px 32px;padding:32px 0;border-top:1px solid var(--rule);align-items:start}
.row__num{font-size:14px;font-weight:700;line-height:1.9;letter-spacing:.04em;color:var(--meta)}
.row__title{margin:0;font-family:var(--font-heading);font-size:clamp(22px,calc(20.5px + .4vw),26px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading)}
.row__body{min-width:0}
.row__body .p{max-width:52ch;line-height:1.65}
.row__body .links{margin-top:12px}
@media (max-width:899px){.row{grid-template-columns:minmax(0,1fr)}}

/* Resource columns */
.cols3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:36px clamp(32px,4vw,56px)}
.col{min-width:0;padding-top:20px;border-top:1px solid rgba(23,25,25,.3)}
.col .h3{margin-bottom:12px}
.col .p{font-size:17px;line-height:1.62}
.col .links{margin-top:14px}
.col .flow>.links{margin-top:14px}
@media (max-width:899px){.cols3{grid-template-columns:minmax(0,1fr)}}
.sage{background:var(--sage-bg)}
.sage__in{padding-block:var(--sec)}

/* Routes, triggers, facts, lists, quotes */
.routes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px clamp(40px,5.5vw,80px);align-items:start}
.route{min-width:0;padding-top:22px;border-top:1px solid rgba(23,25,25,.24)}
.route .p{max-width:56ch}
.route .links{margin-top:22px}
.grid2{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(40px,5.5vw,80px);border-bottom:1px solid var(--rule)}
.grid2 li{padding:18px 0 16px;border-top:1px solid var(--rule);font-size:clamp(19px,calc(18px + .2vw),21px);font-weight:500;line-height:1.4;color:var(--heading)}
@media (max-width:759px){.routes,.grid2{grid-template-columns:minmax(0,1fr)}}
.facts{margin:0 0 14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid var(--rule-2)}
.facts div{padding:16px 16px 16px 0}
.facts dt{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--meta)}
.facts dd{margin:6px 0 0;font-size:17.5px;font-weight:600;color:var(--heading)}
@media (max-width:559px){.facts{grid-template-columns:minmax(0,1fr)}.facts div+div{border-top:1px solid var(--rule)}}
.list{list-style:none;margin:0;padding:0;border-bottom:1px solid var(--rule)}
.list li{padding:14px 0;border-top:1px solid var(--rule);font-size:clamp(17px,calc(16px + .14vw),18px);font-weight:500;line-height:1.5;color:var(--heading)}
.lines{list-style:none;margin:0;padding:0 0 0 18px;border-left:2px solid var(--green)}
.lines li{font-size:clamp(19px,calc(18.4px + .14vw),20.5px);font-weight:550;line-height:1.45;color:var(--heading)}
.lines li+li{margin-top:10px}
.quotes{border-top:1px solid var(--rule)}
.quote{margin:0;padding:28px 0;border-bottom:1px solid var(--rule)}
.quote blockquote{margin:0}
.quote blockquote p{margin:0;font-size:clamp(18px,calc(17px + .2vw),19.5px);line-height:1.6;color:var(--heading);text-wrap:pretty}
.quote figcaption{margin-top:14px;font-size:13px;font-weight:700;line-height:1.4;letter-spacing:.06em;text-transform:uppercase;color:var(--meta)}
.quotes>.flow{display:block}

/* Homepage */
.home-hero{position:relative;overflow:clip}
.home-hero__lines{position:absolute;inset:0;pointer-events:none}
.home-hero__axis{position:absolute;top:0;bottom:0;left:62%;width:1px;background:rgba(4,120,87,.4)}
.home-hero__field{position:absolute;left:42%;right:0;height:1px;background:linear-gradient(90deg,rgba(23,25,25,0),rgba(23,25,25,.08))}
.home-hero__in{position:relative;display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);align-items:center;gap:48px clamp(40px,5vw,72px);padding-block:clamp(48px,5vw,72px) clamp(56px,6vw,88px)}
.home-hero__text{position:relative;z-index:2;min-width:0}
.home-hero .lead{max-width:560px}
.home-fig{position:relative;z-index:1;width:clamp(320px,32vw,460px);aspect-ratio:1;justify-self:end;margin:0}
.home-fig__disc,.home-fig__cut{position:absolute;inset:6% -4% -2% 8%;border-radius:50%}
.home-fig__disc{background:var(--green)}
.home-fig__cut{background:linear-gradient(90deg,rgba(243,240,232,0) 58%,rgba(243,240,232,.92) 58%)}
.home-fig__img{position:absolute;inset:0;overflow:hidden;border-radius:50%;background:var(--forest)}
.home-fig__img img{position:absolute;left:-6%;top:5%;width:130%;height:130%;max-width:none;object-fit:cover;object-position:47% 0%}
@media (max-width:899px){.home-hero__lines{display:none}.home-hero__in{grid-template-columns:minmax(0,1fr)}.home-fig{width:min(80%,320px);justify-self:center}}
.creds{border-block:1px solid rgba(23,25,25,.16)}
.creds ul{list-style:none;margin:0 auto;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.creds li{padding:22px 24px;border-left:1px solid rgba(23,25,25,.16)}
.creds li:first-child{padding-left:0;border-left:0}
.creds__a{display:block;font-size:16.5px;font-weight:650;line-height:1.3;color:var(--heading)}
.creds__b{display:block;margin-top:4px;font-size:14.5px;line-height:1.4;color:var(--ink-2)}
@media (max-width:759px){.creds ul{grid-template-columns:repeat(2,minmax(0,1fr))}.creds li{padding:18px 16px 18px 0;border-left:0}.creds li:nth-child(even){padding:18px 0 18px 16px;border-left:1px solid rgba(23,25,25,.16)}.creds li:nth-child(n+3){border-top:1px solid rgba(23,25,25,.16)}}
.home-brings>.p{max-width:64ch}
.home-how__statement{margin:0 0 32px}
.home-how{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px clamp(40px,6vw,96px);align-items:start}
.home-how__lines span{display:block}
.home-how__lines .is-mid{margin-top:8px;font-weight:550;color:var(--heading)}
.home-how__lines span:first-child+.is-mid{margin-top:14px}
.home-how__lines .is-last{margin-top:14px;font-weight:650;color:var(--heading)}
.home-how .links{margin-top:22px}
@media (max-width:899px){.home-how{grid-template-columns:minmax(0,1fr)}}

/* Therapy vs Coaching */
.compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px clamp(40px,5.5vw,80px);align-items:start}
.compare__col{min-width:0;padding-top:22px;border-top:2px solid var(--heading)}
.compare__h{margin:0 0 18px;font-family:var(--font-heading);font-size:clamp(22px,calc(20.5px + .4vw),26px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading);text-wrap:balance}
@media (max-width:899px){.compare{grid-template-columns:minmax(0,1fr)}}

/* Free Tools, Writing */
.tool .actions{margin-top:26px}
.tool__related{margin-top:18px}
.essays{border-bottom:1px solid var(--rule)}
.essay{padding:28px 0;border-top:1px solid var(--rule)}
.essay .h3{margin-bottom:10px}

/* Contact */
.contact{padding-block:clamp(48px,6vw,88px) var(--sec)}
.contact__head{max-width:720px}
.contact__head .h1{max-width:16ch}
.lead--strong{margin-top:12px;font-weight:600;color:var(--heading)}
.contact__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:40px clamp(40px,6vw,96px);margin-top:clamp(36px,4vw,56px);align-items:start}
.contact__form{min-width:0;padding-top:28px;border-top:3px solid var(--green)}
.contact__aside{min-width:0;display:flex;flex-direction:column;gap:36px}
.contact__next{padding-top:28px;border-top:1px solid rgba(23,25,25,.26)}
.contact__h{margin:0 0 16px;font-family:var(--font-heading);font-size:clamp(22px,calc(19px + .5vw),27px);font-weight:800;letter-spacing:-.025em;color:var(--heading)}
.contact__next .p{font-size:17px;line-height:1.65}
.contact__privacy{padding:24px;background:var(--bone-deep)}
.contact__privacy-h{margin-bottom:12px;color:var(--green)}
.contact__privacy .p{font-size:17px;line-height:1.6}
.contact__privacy .links{margin-top:10px}
.ct-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:0 20px}
.ct-field{display:block;margin:0 0 22px;padding:0;border:0;min-width:0}
.ct-label{display:block;margin-bottom:8px;padding:0;font-size:14px;font-weight:700;color:var(--heading)}
.ct-input{display:block;width:100%;min-height:52px;padding:12px 14px;background:var(--bone);border:1px solid rgba(23,25,25,.3);border-radius:0;font:inherit;font-size:16px;line-height:1.4;color:var(--heading)}
.ct-input:focus{outline:3px solid var(--green);outline-offset:1px;border-color:var(--green)}
.ct-input[aria-invalid="true"]{border-color:#A3362A}
.ct-textarea{min-height:170px;padding:14px;line-height:1.55;resize:vertical}
.ct-choices{display:flex;flex-wrap:wrap;gap:8px}
.ct-choice{position:relative;display:inline-flex}
.ct-choice input{position:absolute;opacity:0;width:1px;height:1px}
.ct-choice span{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1px solid rgba(23,25,25,.3);font-size:15px;font-weight:600;color:var(--heading);cursor:pointer}
.ct-choice input:checked+span{background:var(--heading);border-color:var(--heading);color:var(--bone)}
.ct-choice input:focus-visible+span{outline:3px solid var(--green);outline-offset:2px}
.ct-help{margin:6px 0 0;font-size:14px;color:var(--meta)}
.sp-err{margin:6px 0 0;font-size:14px;font-weight:600;color:#A3362A}
.sp-formerr{margin:0 0 22px;padding:14px 16px;border-left:3px solid #A3362A;background:rgba(163,54,42,.06);font-size:16px;line-height:1.55;color:var(--heading)}
.sp-formerr a{color:var(--green);font-weight:600;border-bottom:1.5px solid currentColor}
.ct-submit{width:100%;min-height:56px}
.ct-submit[disabled]{opacity:.7;cursor:progress}
.sp-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.sp-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sp-form__done{margin:0 0 14px;font-family:var(--font-heading);font-size:clamp(24px,calc(20px + .8vw),32px);font-weight:800;letter-spacing:-.03em;color:var(--heading);outline:none}

@media (max-width:599px){.btn{white-space:normal;text-align:center}}
`;

  window.renderSitePage = renderSitePage;
  window.SitePage = SitePage;
})();
