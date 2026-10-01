// site-pages.jsx — renders the 25 canonical pages from the canonical copy, and
// the articles (renderArticlePage, from article-<slug>.js; see "Articles").
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
// split, never reworded (scripts/copy/check-copy.py checks them in order). The
// one exception is the Work & Life Check call to action (WLC_PLACEMENTS and the
// featured entry on /free-tools/), whose wording belongs to that component.

(function () {
  const {
    useState,
    useEffect,
    useRef
  } = React;
  const e = React.createElement;
  const COPY = window.SITE_COPY && window.SITE_COPY.pages || {};
  const CONTACT_URL = window.CONTACT_URL || '/contact/';

  // ── Text helpers ───────────────────────────────────────────────────────────
  // Sentences of a paragraph (no lookbehind: older Safari cannot parse it).
  function sentences(text) {
    return text.replace(/([.!?…][”’]?)\s+(?=[“‘"(A-Z0-9])/g, '$1\u0000').split('\u0000').filter(Boolean);
  }
  const plain = t => t.replace(/\*\*/g, '');

  // **bold** → <strong>; on some pages a bold service name is also its link.
  const INLINE_LINKS = {
    faq: {
      'Individual Psychotherapy': '/individual-psychotherapy/',
      'Couples Therapy': '/couples-therapy/',
      'Professional Coaching': '/professional-coaching/',
      'Considering Therapy': '/considering-therapy/'
    }
  };
  function rich(text, ctx) {
    const links = ctx && INLINE_LINKS[ctx.id] || {};
    return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
      const m = part.match(/^\*\*([^*]+)\*\*$/);
      if (!m) return part;
      if (links[m[1]]) return e('a', {
        key: i,
        className: 'inl',
        href: links[m[1]]
      }, m[1]);
      return e('strong', {
        key: i
      }, m[1]);
    });
  }

  // The articles' inline Markdown: **bold**, *italic* and [text](href), as
  // scripts/articles/extract-articles.js leaves them in the strings.
  function inlineMd(text) {
    const out = [];
    let buf = '';
    let i = 0;
    const flush = () => {
      if (buf) {
        out.push(buf);
        buf = '';
      }
    };
    while (i < text.length) {
      const c = text[i];
      if (c === '*') {
        const strong = text[i + 1] === '*';
        const open = strong ? 2 : 1;
        const j = text.indexOf(strong ? '**' : '*', i + open);
        if (j > i + open) {
          flush();
          out.push(e(strong ? 'strong' : 'em', {
            key: out.length
          }, inlineMd(text.slice(i + open, j))));
          i = j + open;
          continue;
        }
      } else if (c === '[') {
        const mid = text.indexOf('](', i + 1);
        let j = mid + 2;
        for (let depth = 0; mid > i && j < text.length; j++) {
          if (text[j] === '(') depth++;else if (text[j] === ')') {
            if (!depth) break;
            depth--;
          }
        }
        if (mid > i && j < text.length) {
          flush();
          out.push(e('a', {
            key: out.length,
            className: 'art-a',
            href: text.slice(mid + 2, j)
          }, inlineMd(text.slice(i + 1, mid))));
          i = j + 1;
          continue;
        }
      }
      buf += c;
      i++;
    }
    flush();
    return out;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  const Arrow = () => e('span', {
    'aria-hidden': 'true'
  }, '→');
  const isExternal = href => /^https?:/.test(href);
  function TLink({
    item,
    className
  }) {
    const ext = isExternal(item.href) ? {
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {};
    return e('a', Object.assign({
      className: 'tlink' + (className ? ' ' + className : ''),
      href: item.href
    }, ext), e('span', null, item.label), e(Arrow));
  }
  function Btn({
    item
  }) {
    return e('a', {
      className: 'btn',
      href: item.href
    }, item.label, ' ', e(Arrow));
  }
  // Book a consultation is the primary action wherever it appears; everything
  // else is a secondary link. Links whose page is not published are left out.
  const isPrimary = it => it.href === CONTACT_URL;
  function Actions({
    items,
    className
  }) {
    const live = items.filter(it => it.href);
    if (!live.length) return null;
    return e('div', {
      className: className || 'actions'
    }, live.map(it => e(isPrimary(it) ? Btn : TLink, {
      key: it.label + it.href,
      item: it
    })));
  }
  const findCta = (blocks, label) => {
    for (const b of blocks) if (b.t === 'ctas') for (const it of b.items) if (it.label === label) return it;
    return null;
  };

  // ── The Work & Life Check: one call to action, placed page by page ────────
  // Three variants: feature (a panel with its own heading and the filled
  // button; exploratory pages), inline (a lead line and an outlined button;
  // problem pages) and compact (one line and a text link; service and audience
  // pages, where Book a consultation stays the primary action). Every link is
  // a plain <a href> to /work-life-check/?source=<page>-<variant>: the check
  // reads the source for its analytics (source_page), then drops it from the
  // address bar; the page's canonical is the bare URL. The wording is the
  // brief's, placement by placement. Not placed on Contact, Confidentiality,
  // FAQ, Reviews, About, Couples Therapy or the Greek-speaking page.
  const WLC_URL = '/work-life-check/';
  const wlcHref = source => WLC_URL + '?source=' + source;
  const WLC_DEFAULT = {
    eyebrow: 'Not sure what is actually going on?',
    headline: 'Take the Work & Life Check',
    body: 'Four minutes. Five areas. A clearer view of where work is currently costing you most.',
    button: 'Take the check'
  };
  const WLC_BUTTON = 'Take the Work & Life Check';
  // The homepage carries the check in its hero only (WLC_HERO), no panel.
  const WLC_PLACEMENTS = {
    'therapy-for-men-in-tech': {
      after: 'when-work-continues-after-hours',
      variant: 'inline',
      source: 'men-in-tech-inline',
      lead: 'Not sure which part of this is actually the problem?',
      body: 'The Work & Life Check looks at switching off, recovery, difficult decisions, relationships and the weight of performance.',
      button: WLC_BUTTON
    },
    'executive-burnout-therapy': {
      after: 'time-off-doesnt-always-fix-it',
      variant: 'inline',
      source: 'burnout-inline',
      lead: 'Not sure whether this is mainly burnout, the job itself or something broader?',
      button: WLC_BUTTON
    },
    'therapy-for-executives': {
      after: 'what-happens-at-home',
      variant: 'compact',
      source: 'executives-compact',
      body: 'See where the pressure is showing up most.',
      button: WLC_BUTTON
    },
    'therapy-for-founders': {
      after: 'after-growth-funding-or-exit',
      variant: 'compact',
      source: 'founders-compact',
      body: 'If the company is affecting more than the company, the Work & Life Check can help separate where the pressure is landing.',
      button: WLC_BUTTON
    },
    'career-transition-therapy': {
      after: 'more-analysis',
      variant: 'inline',
      source: 'career-inline',
      lead: 'If the decision has been open for months, check what else may be keeping it open.',
      button: WLC_BUTTON
    },
    'work-affecting-relationship': {
      after: 'when-work-follows-you-home',
      variant: 'inline',
      source: 'work-relationship-inline',
      lead: 'See whether the main pressure is work itself, difficulty switching off, recovery or what is happening at home.',
      button: WLC_BUTTON
    },
    'achievement-self-worth': {
      after: 'perfectionism',
      variant: 'compact',
      source: 'achievement-compact',
      body: 'See how much weight work and performance are carrying elsewhere in your life.',
      button: WLC_BUTTON
    },
    'anxiety-overthinking': {
      after: 'anxiety-that-looks-productive',
      variant: 'compact',
      source: 'anxiety-compact',
      body: 'See whether the loop is showing up mainly in work, recovery, decisions, relationships or performance.',
      button: WLC_BUTTON
    },
    'considering-therapy': {
      after: 'the-first-conversation',
      variant: 'feature',
      source: 'considering-therapy-feature',
      eyebrow: 'Still not sure what you would bring?',
      headline: 'Start with the situation, not a diagnosis.',
      body: 'The Work & Life Check gives you a structured look at five areas that often bring people here.',
      button: WLC_BUTTON
    },
    'work-with-me': {
      after: 'which-service-fits',
      variant: 'compact',
      source: 'work-with-me-compact',
      body: 'Not sure what kind of help fits yet?',
      button: 'Take the Work & Life Check first'
    },
    blog: {
      after: 'featured',
      variant: 'feature',
      source: 'blog-feature'
    }
  };
  // The homepage hero has exactly two actions: Book a consultation, then this.
  const WLC_HERO = {
    label: WLC_BUTTON,
    href: wlcHref('home-hero')
  };
  // The first and featured entry on /free-tools/.
  const WLC_TOOL = {
    label: 'Start here',
    title: 'The Work & Life Check',
    body: 'A 4-minute check for when work is going fine on paper but something around it is not. See where the friction is showing up: switching off, recovery, decisions, relationships or the weight of performance.',
    meta: 'About 4 minutes',
    button: WLC_BUTTON,
    source: 'free-tools-featured'
  };
  function WorkLifeCheckCTA({
    variant,
    source,
    eyebrow,
    headline,
    lead,
    body,
    button
  }) {
    const href = wlcHref(source);
    if (variant === 'feature') {
      const c = {
        eyebrow: eyebrow || WLC_DEFAULT.eyebrow,
        headline: headline || WLC_DEFAULT.headline,
        body: body || WLC_DEFAULT.body,
        button: button || WLC_DEFAULT.button
      };
      return e('section', {
        className: 'sec wlcta-sec',
        'aria-labelledby': 'wlcta-h'
      }, e('div', {
        className: 'read'
      }, e('div', {
        className: 'wlcta wlcta--feature'
      }, e('p', {
        className: 'eyebrow'
      }, c.eyebrow), e('h2', {
        className: 'wlcta__h',
        id: 'wlcta-h'
      }, c.headline), e('p', {
        className: 'p'
      }, c.body), e('div', {
        className: 'actions'
      }, e('a', {
        className: 'btn',
        href
      }, c.button, ' ', e(Arrow))))));
    }
    if (variant === 'inline') {
      return e('aside', {
        className: 'read wlcta wlcta--inline',
        'aria-label': 'The Work & Life Check'
      }, e('p', {
        className: 'wlcta__lead'
      }, lead), body ? e('p', {
        className: 'p'
      }, body) : null, e('a', {
        className: 'btn btn--ghost',
        href
      }, button || WLC_BUTTON, ' ', e(Arrow)));
    }
    return e('aside', {
      className: 'read wlcta wlcta--compact',
      'aria-label': 'The Work & Life Check'
    }, e('p', {
      className: 'wlcta__text'
    }, body), e(TLink, {
      item: {
        label: button || WLC_BUTTON,
        href
      }
    }));
  }
  const wlcAfter = (id, sectionId, key) => {
    const w = WLC_PLACEMENTS[id];
    return w && w.after === sectionId ? e(WorkLifeCheckCTA, Object.assign({
      key: key || 'wlc'
    }, w)) : null;
  };

  // ── Blocks ─────────────────────────────────────────────────────────────────
  // The default setting of every copy block. `roles` maps a paragraph index to
  // a text role: 'emph' (a short opening line), 'strong' (a closing line).
  function Blocks({
    blocks,
    ctx,
    roles,
    dark
  }) {
    let pIndex = -1;
    return blocks.map((b, i) => {
      const key = b.t + i;
      switch (b.t) {
        case 'p':
          {
            pIndex++;
            const role = roles && roles[pIndex];
            return e('p', {
              key,
              className: 'p' + (role ? ' p--' + role : '')
            }, rich(b.text, ctx));
          }
        case 'lines':
          return e('ul', {
            key,
            className: 'lines'
          }, b.lines.map(l => e('li', {
            key: l
          }, rich(l, ctx))));
        case 'list':
          return e('ul', {
            key,
            className: 'list'
          }, b.items.map(it => e('li', {
            key: it
          }, rich(it, ctx))));
        case 'ctas':
          return e(Actions, {
            key,
            items: b.items,
            className: 'links'
          });
        case 'related':
          return e('p', {
            key,
            className: 'related'
          }, 'Related: ', b.items.filter(it => it.href).map(it => e(TLink, {
            key: it.label,
            item: it
          })));
        case 'meta':
          return e('p', {
            key,
            className: 'meta'
          }, b.text);
        case 'pairs':
          return e('dl', {
            key,
            className: 'facts'
          }, b.items.map(it => e('div', {
            key: it.a
          }, e('dt', null, it.a), e('dd', null, it.b))));
        case 'quote':
          return e('figure', {
            key,
            className: 'quote'
          }, e('blockquote', null, e('p', null, b.text)), e('figcaption', null, b.cite));
        case 'sub':
          return e('div', {
            key,
            className: 'subsec'
          }, e('h3', {
            className: 'h3'
          }, b.h3), e('div', {
            className: 'flow'
          }, e(Blocks, {
            blocks: b.blocks,
            ctx,
            dark
          })));
        default:
          return null;
      }
    });
  }

  // A short, single-sentence opening paragraph becomes the section's emphasis
  // line — the same role on every page, so equivalent openings read alike.
  function defaultRoles(blocks) {
    const ps = blocks.filter(b => b.t === 'p');
    if (ps.length >= 2 && sentences(plain(ps[0].text)).length === 1 && plain(ps[0].text).length <= 90) return {
      0: 'emph'
    };
    return null;
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  // axis: 'wrap' | 'mid' keeps the reading width but starts the column on that
  // container's left edge (the site's 1240, or the 960 section axis) instead of
  // the page's centred reading axis.
  function ReadSection({
    s,
    ctx,
    roles,
    children,
    axis
  }) {
    const col = className => e('div', {
      className
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), children || e('div', {
      className: 'flow'
    }, e(Blocks, {
      blocks: s.blocks,
      ctx,
      roles: roles === undefined ? defaultRoles(s.blocks) : roles
    })));
    return e('section', {
      className: 'sec',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, axis ? e('div', {
      className: axis
    }, col('read-l')) : col('read'));
  }

  // Dark section: one reading column on the page's centred axis (the same as
  // every reading section). H2, then the opening sentence as the section lead
  // (sage) when it is short, then the rest. The dark band is the transition.
  function DarkSection({
    s,
    ctx
  }) {
    const blocks = s.blocks.slice();
    let statement = null;
    const first = blocks.findIndex(b => b.t === 'p');
    if (first === 0) {
      const ss = sentences(blocks[0].text);
      if (plain(ss[0]).length <= 90) {
        statement = ss[0];
        const rest = ss.slice(1).join(' ');
        if (rest) blocks[0] = {
          t: 'p',
          text: rest
        };else blocks.shift();
      }
    }
    return e('section', {
      className: 'band dark on-dark',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'read dark__in'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'flow'
    }, statement ? e('p', {
      className: 'p p--emph'
    }, rich(statement, ctx)) : null, e(Blocks, {
      blocks,
      ctx,
      dark: true
    }))));
  }

  // Burnout's dark section: the same single column. The opening sentence is
  // the lead; the closing line is the section's one (modest, ruled) pull quote.
  function DarkTopSection({
    s,
    ctx
  }) {
    const ps = s.blocks.filter(b => b.t === 'p');
    const ss = sentences(ps[0].text);
    const lead = ss[0];
    const more = ss.slice(1).join(' ');
    const rest = s.blocks.reduce((out, b) => b !== ps[0] ? out.concat(b) : more ? out.concat({
      t: 'p',
      text: more
    }) : out, []);
    const lastP = rest.filter(b => b.t === 'p').length - 1;
    return e('section', {
      className: 'band dark on-dark',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'read dark__in'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'flow'
    }, e('p', {
      className: 'p p--emph'
    }, rich(lead, ctx)), e(Blocks, {
      blocks: rest,
      ctx,
      dark: true,
      roles: {
        [lastP]: 'rule'
      }
    }))));
  }

  // Photo split: a full-bleed photograph beside the section's text, 1:1.
  function PhotoSplit({
    s,
    ctx,
    photo,
    dark
  }) {
    return e('section', {
      className: 'band split' + (dark ? ' split--dark on-dark' : ''),
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('figure', {
      className: 'split__fig'
    }, e('img', {
      src: photo.src,
      alt: photo.alt,
      loading: 'lazy',
      decoding: 'async',
      style: {
        objectPosition: photo.pos || '50% 30%'
      }
    })), e('div', {
      className: 'split__body'
    }, e('div', {
      className: 'split__text'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'flow'
    }, e(Blocks, {
      blocks: s.blocks,
      ctx,
      dark
    })))));
  }

  // Questions and answers: one accordion row each; the page's first is open.
  function FaqSection({
    s,
    ctx,
    openFirst
  }) {
    return e('section', {
      className: 'sec',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'read'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'faq'
    }, s.blocks.filter(b => b.t === 'sub').map((q, i) => e('details', {
      key: q.h3,
      open: openFirst && i === 0 ? true : undefined
    }, e('summary', null, e('h3', null, q.h3), e('span', {
      className: 'faq__sign',
      'aria-hidden': 'true'
    }, '+')), e('div', {
      className: 'faq__a flow'
    }, e(Blocks, {
      blocks: q.blocks,
      ctx
    })))))));
  }
  const isFaq = s => s.blocks.length > 0 && s.blocks.every(b => b.t === 'sub' && /\?$/.test(b.h3));

  // "Continue with": modest rows, the heading set as a label.
  function ContinueSection({
    s
  }) {
    const items = [].concat.apply([], s.blocks.filter(b => b.t === 'ctas').map(b => b.items)).filter(it => it.href);
    return e('nav', {
      className: 'continue read',
      'aria-labelledby': s.id + '-h'
    }, e('h2', {
      className: 'label continue__label',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'continue__list'
    }, items.map(it => e('a', {
      key: it.href,
      href: it.href
    }, it.label, e('span', {
      'aria-hidden': 'true'
    }, '→')))));
  }

  // The page's final "Contact" section as the dark close.
  function Close({
    s,
    ctx
  }) {
    const ps = s.blocks.filter(b => b.t === 'p');
    const items = [].concat.apply([], s.blocks.filter(b => b.t === 'ctas').map(b => b.items)).filter(it => it.href);
    const text = ps.map(p => plain(p.text)).join(' ');
    return e(window.CloseBand, {
      label: s.h2,
      text,
      actions: items.map(it => e(isPrimary(it) ? Btn : TLink, {
        key: it.href,
        item: it
      }))
    });
  }
  const isClose = (s, i, all) => i === all.length - 1 && (s.h2 === 'Contact' || s.h2 === 'How to start');

  // ── Heroes ─────────────────────────────────────────────────────────────────
  function HeroText({
    p,
    ctx,
    h1Class,
    extra,
    primaryOnly
  }) {
    const h = p.hero;
    const ps = h.blocks.filter(b => b.t === 'p');
    let ctas = [].concat.apply([], h.blocks.filter(b => b.t === 'ctas').map(b => b.items));
    // primaryOnly keeps just the page's primary action (Book a consultation);
    // `extra` joins as the second action, after it.
    if (primaryOnly) ctas = ctas.filter(isPrimary);
    if (extra) ctas = ctas.slice(0, 1).concat([extra], ctas.slice(1));
    return e(React.Fragment, null, e('p', {
      className: 'eyebrow'
    }, h.eyebrow), e('h1', {
      className: 'h1' + (h1Class ? ' ' + h1Class : '') + (plain(h.h1).length > 60 ? ' h1--long' : ''),
      id: 'page-title'
    }, h.h1), h.sub ? e('p', {
      className: 'sub'
    }, h.sub) : null, ps.map((b, i) => e('p', {
      key: i,
      className: 'lead'
    }, rich(b.text, ctx))), ctas.length ? e(Actions, {
      items: ctas
    }) : null);
  }
  function Frame({
    photo
  }) {
    return e('figure', {
      className: 'frame'
    }, e('div', {
      className: 'frame__img'
    }, e('img', {
      src: photo.src,
      alt: photo.alt,
      fetchPriority: 'high',
      style: {
        objectPosition: photo.pos || '50% 30%'
      }
    })));
  }
  function Hero({
    p,
    ctx
  }) {
    const photo = HERO_PHOTO[p.id];
    if (photo) {
      return e('header', {
        className: 'wrap hero-split'
      }, e('div', {
        style: {
          minWidth: 0
        }
      }, e(HeroText, {
        p,
        ctx
      })), e(Frame, {
        photo
      }));
    }
    return e('header', {
      className: 'read hero-read'
    }, e(HeroText, {
      p,
      ctx
    }));
  }

  // ── Layout decisions, page by page ─────────────────────────────────────────
  // Photography only where an existing photograph of Aggelos helps the page.
  // (The old offer-page portraits are not used: their graphic backgrounds
  // belong to the retired design.)
  const HERO_PHOTO = {
    'individual-psychotherapy': {
      src: '/img/aggelos-opinion.jpeg',
      alt: 'Aggelos Mouzakitis in conversation',
      pos: '52% 30%'
    },
    about: {
      src: '/img/aggelos-about.webp',
      alt: 'Aggelos Mouzakitis',
      pos: '50% 0%'
    }
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
    about: 'from-customer-research-to-clinical-work'
  };
  const DARK_TOP = {
    'executive-burnout-therapy': 'when-the-workload-is-the-problem'
  };
  const PHOTO_SPLIT = {
    'therapy-for-men-in-tech': {
      id: 'my-background',
      src: '/img/aggelos-homepage-1600.webp',
      alt: 'Aggelos Mouzakitis speaking on stage at a technology conference',
      pos: '44% 38%'
    },
    'therapy-for-founders': {
      id: 'my-background',
      src: '/img/wtf-friday-speaking.webp',
      alt: 'Aggelos Mouzakitis leading a workshop',
      pos: '28% 30%'
    },
    'therapy-for-executives': {
      id: 'my-background',
      src: '/img/aggelos-executives.webp',
      alt: 'Aggelos Mouzakitis',
      pos: '50% 0%'
    }
  };
  // Reading sections that stay on the axis of what comes before them instead of
  // the centred reading axis ('wrap' = the hero's left edge). About: Before
  // psychotherapy continues the hero's text axis; the dark section after it is
  // where the page moves to the centred long-form axis.
  const AXIS = {
    about: {
      'before-psychotherapy': 'wrap'
    }
  };
  // Text roles the reference designs set explicitly (paragraph index → role).
  const ROLES = {
    'executive-burnout-therapy': {
      'time-off-doesnt-always-fix-it': {
        2: 'strong'
      }
    }
  };

  // ── Individual Psychotherapy (reference design) ───────────────────────────
  function TriggersSection({
    s,
    ctx
  }) {
    const ps = s.blocks.filter(b => b.t === 'p');
    return e('section', {
      className: 'sec',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'read'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('p', {
      className: 'p p--emph'
    }, rich(ps[0].text, ctx)), e('ul', {
      className: 'recog2'
    }, sentences(ps[1].text).map(t => e('li', {
      key: t
    }, rich(t, ctx))))));
  }
  function StatementSection({
    s,
    ctx,
    where,
    axis
  }) {
    // where = 'first': the first paragraph's opening sentence is the statement;
    // 'last': the last paragraph's closing sentence is.
    const blocks = s.blocks.slice();
    const idx = where === 'first' ? blocks.findIndex(b => b.t === 'p') : blocks.map(b => b.t).lastIndexOf('p');
    const ss = sentences(blocks[idx].text);
    const stmt = where === 'first' ? ss[0] : ss[ss.length - 1];
    const rest = (where === 'first' ? ss.slice(1) : ss.slice(0, -1)).join(' ');
    const before = blocks.slice(0, idx);
    const after = blocks.slice(idx + 1);
    const restBlock = rest ? [{
      t: 'p',
      text: rest
    }] : [];
    const stmtEl = e('p', {
      className: where === 'first' ? 'p p--emph' : 'p p--strong',
      key: 'stmt'
    }, rich(stmt, ctx));
    return e(ReadSection, {
      s,
      ctx,
      axis
    }, e('div', {
      className: 'flow'
    }, where === 'first' ? [stmtEl, e(Blocks, {
      key: 'b',
      blocks: before.concat(restBlock, after),
      ctx
    })] : [e(Blocks, {
      key: 'a',
      blocks: before.concat(restBlock),
      ctx
    }), stmtEl, e(Blocks, {
      key: 'b',
      blocks: after,
      ctx
    })]));
  }
  // Two equal routes: each paragraph with its own link under its own label.
  function RoutesSection({
    s,
    ctx,
    routes
  }) {
    const ps = s.blocks.filter(b => b.t === 'p');
    return e('section', {
      className: 'sec sec--step',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'mid'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'routes'
    }, routes.map((r, i) => {
      const link = findCta(s.blocks, r.link);
      return e('div', {
        key: r.h3,
        className: 'route'
      }, e('h3', {
        className: 'h3'
      }, r.h3), e('p', {
        className: 'p'
      }, rich(ps[i].text, ctx)), link ? e('div', {
        className: 'links'
      }, e(TLink, {
        item: link
      })) : null);
    }))));
  }
  // Practical facts across the 960 axis shared with Work in psychotherapy and
  // Relationships, three equal columns; the explanatory prose keeps the
  // reading width on that same left edge. The FAQ after it returns to the
  // centred reading axis, after a clearer gap (.sec--pre-faq + .sec).
  function PracticalSection({
    s,
    ctx
  }) {
    const facts = s.blocks.filter(b => b.t === 'pairs');
    const rest = s.blocks.filter(b => b.t !== 'pairs');
    return e('section', {
      className: 'sec sec--pre-faq',
      id: s.id,
      'aria-labelledby': s.id + '-h'
    }, e('div', {
      className: 'mid'
    }, e('h2', {
      className: 'h2',
      id: s.id + '-h'
    }, s.h2), e(Blocks, {
      blocks: facts,
      ctx
    }), e('div', {
      className: 'read-l practical__rest flow'
    }, e(Blocks, {
      blocks: rest,
      ctx
    }))));
  }
  const INDIVIDUAL = {
    'what-brings-people-in': (s, ctx) => e(TriggersSection, {
      s,
      ctx
    }),
    'what-happens-in-sessions': (s, ctx) => e(StatementSection, {
      s,
      ctx,
      where: 'first'
    }),
    // Work in psychotherapy, Relationships and Practicalities share the 960 axis.
    'work-in-psychotherapy': (s, ctx) => e(StatementSection, {
      s,
      ctx,
      where: 'last',
      axis: 'mid'
    }),
    practicalities: (s, ctx) => e(PracticalSection, {
      s,
      ctx
    }),
    relationships: (s, ctx) => e(RoutesSection, {
      s,
      ctx,
      routes: [{
        h3: 'Individual psychotherapy',
        link: 'Relationship problems'
      }, {
        h3: 'Couples therapy',
        link: 'Couples therapy'
      }]
    })
  };
  const CUSTOM_SECTIONS = {
    'individual-psychotherapy': INDIVIDUAL
  };

  // ── Generic page: hero, then each section in its setting ──────────────────
  function sectionFor(p, s, i, all, ctx, state) {
    const custom = CUSTOM_SECTIONS[p.id] && CUSTOM_SECTIONS[p.id][s.id];
    if (custom) return custom(s, ctx);
    if (isClose(s, i, all)) return e(Close, {
      s,
      ctx
    });
    if (s.h2 === 'Continue with') return e(ContinueSection, {
      s
    });
    if (DARK[p.id] === s.id) return e(DarkSection, {
      s,
      ctx
    });
    if (DARK_TOP[p.id] === s.id) return e(DarkTopSection, {
      s,
      ctx
    });
    const photo = PHOTO_SPLIT[p.id];
    if (photo && photo.id === s.id) return e(PhotoSplit, {
      s,
      ctx,
      photo
    });
    if (isFaq(s)) {
      const openFirst = !state.opened;
      state.opened = true;
      return e(FaqSection, {
        s,
        ctx,
        openFirst
      });
    }
    const roles = ROLES[p.id] && ROLES[p.id][s.id];
    return e(ReadSection, {
      s,
      ctx,
      roles,
      axis: AXIS[p.id] && AXIS[p.id][s.id]
    });
  }
  function Sections({
    p,
    ctx,
    sections
  }) {
    const list = sections || p.sections;
    const state = {
      opened: false
    };
    return list.map((s, i) => e(React.Fragment, {
      key: s.id
    }, sectionFor(p, s, i, list, ctx, state), wlcAfter(p.id, s.id)));
  }
  function GenericPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), e(Sections, {
      p,
      ctx
    }));
  }

  // ── Homepage (reference design) ────────────────────────────────────────────
  const HOME_PHOTOS = {
    hero: {
      src: '/img/aggelos-home.webp',
      alt: 'Aggelos Mouzakitis'
    },
    context: {
      src: '/img/aggelos-homepage-1600.webp',
      alt: 'Aggelos Mouzakitis speaking on stage at a technology conference',
      pos: '44% 38%'
    },
    about: {
      src: '/img/wtf-friday-speaking.webp',
      alt: 'Aggelos Mouzakitis leading a workshop',
      pos: '28% 30%'
    }
  };
  function HomePage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    const S = {};
    p.sections.forEach(s => {
      S[s.id] = s;
    });
    const out = [];
    out.push(e('section', {
      key: 'hero',
      className: 'home-hero',
      'aria-labelledby': 'page-title'
    }, e('div', {
      className: 'home-hero__lines',
      'aria-hidden': 'true'
    }, e('span', {
      className: 'home-hero__axis'
    }), Array.from({
      length: 10
    }, (_, i) => e('span', {
      key: i,
      className: 'home-hero__field',
      style: {
        top: 22 + i * 7 + '%'
      }
    }))), e('div', {
      className: 'wrap home-hero__in'
    },
    // Two actions: Book a consultation, then the Work & Life Check. Individual
    // psychotherapy is reached from the Services menu and Ways to work with me.
    e('div', {
      className: 'home-hero__text'
    }, e(HeroText, {
      p,
      ctx,
      h1Class: 'h1--home',
      extra: WLC_HERO,
      primaryOnly: true
    })), e('figure', {
      className: 'home-fig'
    }, e('span', {
      className: 'home-fig__disc',
      'aria-hidden': 'true'
    }), e('span', {
      className: 'home-fig__cut',
      'aria-hidden': 'true'
    }), e('span', {
      className: 'home-fig__img'
    }, e('img', {
      src: HOME_PHOTOS.hero.src,
      alt: HOME_PHOTOS.hero.alt,
      fetchPriority: 'high'
    }))))));
    const creds = S['credential-strip'];
    if (creds) {
      const pairs = creds.blocks.find(b => b.t === 'pairs');
      out.push(e('section', {
        key: 'creds',
        className: 'creds',
        'aria-label': 'Background'
      }, e('ul', {
        className: 'wrap'
      }, pairs.items.map(it => e('li', {
        key: it.a
      }, e('span', {
        className: 'creds__a'
      }, it.a), e('span', {
        className: 'creds__b'
      }, it.b))))));
    }
    const brings = S['what-brings-people-here'];
    if (brings) {
      out.push(e('section', {
        key: 'brings',
        className: 'sec',
        id: brings.id,
        'aria-labelledby': 'brings-h'
      }, e('div', {
        className: 'wrap'
      }, e('h2', {
        className: 'h2',
        id: 'brings-h'
      }, brings.h2), e('div', {
        className: 'flow home-brings'
      }, e(Blocks, {
        blocks: brings.blocks,
        ctx
      })))));
    }
    const context = S['work-is-part-of-the-context'];
    if (context) out.push(e(PhotoSplit, {
      key: 'context',
      s: context,
      ctx,
      photo: HOME_PHOTOS.context,
      dark: true
    }));
    const how = S['how-i-work'];
    if (how) {
      const ps = how.blocks.filter(b => b.t === 'p');
      const s1 = sentences(ps[0].text);
      const s2 = sentences(ps[1].text);
      const link = how.blocks.find(b => b.t === 'ctas');
      // One reading column: H2, the opening sentence as the lead, then the
      // prose; the closing sentence is the only (body-size) emphasis. The
      // column keeps the reading width but starts on the site's left edge, the
      // same anchor as Ways to work with me below it.
      out.push(e('section', {
        key: 'how',
        className: 'sec',
        id: how.id,
        'aria-labelledby': 'how-h'
      }, e('div', {
        className: 'wrap'
      }, e('div', {
        className: 'read-l'
      }, e('h2', {
        className: 'h2',
        id: 'how-h'
      }, how.h2), e('div', {
        className: 'flow'
      }, e('p', {
        className: 'p p--emph'
      }, s1[0]), e('p', {
        className: 'p'
      }, s1.slice(1).join(' ')), s2.length > 1 ? e('p', {
        className: 'p'
      }, s2.slice(0, -1).join(' ')) : null, e('p', {
        className: 'p p--strong'
      }, s2[s2.length - 1]), link ? e(Actions, {
        items: link.items,
        className: 'links'
      }) : null)))));
    }
    const ways = S['ways-to-work-with-me'];
    if (ways) {
      const subs = ways.blocks.filter(b => b.t === 'sub');
      out.push(e('section', {
        key: 'ways',
        className: 'sec',
        id: ways.id,
        'aria-labelledby': 'ways-h'
      }, e('div', {
        className: 'wrap'
      }, e('h2', {
        className: 'h2',
        id: 'ways-h'
      }, ways.h2), e(ServiceRows, {
        rows: subs.map(sub => ({
          title: sub.h3,
          blocks: sub.blocks,
          tag: 'h3'
        })),
        ctx
      }))));
    }
    const read = S['if-you-want-to-read-first'];
    if (read) {
      const ps = read.blocks.filter(b => b.t === 'p');
      const links = [].concat.apply([], read.blocks.filter(b => b.t === 'ctas').map(b => b.items));
      out.push(e('section', {
        key: 'read',
        className: 'band sage',
        id: read.id,
        'aria-labelledby': 'read-h'
      }, e('div', {
        className: 'wrap sage__in'
      }, e('h2', {
        className: 'h2',
        id: 'read-h'
      }, read.h2), e('div', {
        className: 'cols3'
      }, ps.map((b, i) => {
        const m = b.text.match(/^\*\*([^*]+)\*\*/);
        return e('div', {
          key: i,
          className: 'col'
        }, m ? e('h3', {
          className: 'h3'
        }, m[1]) : null, e('p', {
          className: 'p'
        }, plain(b.text)), links[i] ? e('div', {
          className: 'links'
        }, e(TLink, {
          item: links[i]
        })) : null);
      })))));
    }
    const about = S['about-me'];
    if (about) out.push(e(PhotoSplit, {
      key: 'about',
      s: about,
      ctx,
      photo: HOME_PHOTOS.about
    }));
    const contact = S.contact;
    if (contact) out.push(e(Close, {
      key: 'close',
      s: contact,
      ctx
    }));
    return out;
  }

  // Service rows: number, title, then the description and its link.
  function ServiceRows({
    rows,
    ctx
  }) {
    return e('div', {
      className: 'rows'
    }, rows.map((r, i) => e('div', {
      key: r.title,
      className: 'row',
      id: r.id
    }, e('span', {
      className: 'row__num',
      'aria-hidden': 'true'
    }, String(i + 1).padStart(2, '0')), e(r.tag, {
      className: 'row__title',
      id: r.id ? r.id + '-h' : undefined
    }, r.title), e('div', {
      className: 'row__body flow'
    }, e(Blocks, {
      blocks: r.blocks,
      ctx
    })))));
  }

  // ── Work With Me: the three services as equal rows ─────────────────────────
  const SERVICE_SECTIONS = ['individual-psychotherapy', 'couples-therapy', 'professional-coaching'];
  function WorkWithMePage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    const svc = p.sections.filter(s => SERVICE_SECTIONS.includes(s.id));
    const rest = p.sections.filter(s => !SERVICE_SECTIONS.includes(s.id));
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), e('section', {
      className: 'sec',
      'aria-label': 'Services'
    }, e('div', {
      className: 'wrap'
    }, e(ServiceRows, {
      rows: svc.map(s => ({
        title: s.h2,
        blocks: s.blocks,
        tag: 'h2',
        id: s.id
      })),
      ctx
    }))), e(Sections, {
      p,
      ctx,
      sections: rest
    }));
  }

  // ── Therapy vs Coaching: one restrained comparison, then reading ──────────
  const COMPARISON = ['when-coaching-is-enough', 'when-psychotherapy-gives-us-more-room'];
  function TherapyVsCoachingPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    const pair = COMPARISON.map(id => p.sections.find(s => s.id === id)).filter(Boolean);
    const rest = p.sections.filter(s => !COMPARISON.includes(s.id));
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), pair.length === 2 ? e('div', {
      className: 'sec'
    }, e('div', {
      className: 'wide compare'
    }, pair.map(s => e('section', {
      key: s.id,
      id: s.id,
      className: 'compare__col',
      'aria-labelledby': s.id + '-h'
    }, e('h2', {
      className: 'compare__h',
      id: s.id + '-h'
    }, s.h2), e('div', {
      className: 'flow'
    }, e(Blocks, {
      blocks: s.blocks,
      ctx
    })))))) : null, e(Sections, {
      p,
      ctx,
      sections: pair.length === 2 ? rest : p.sections
    }));
  }

  // ── Reviews ────────────────────────────────────────────────────────────────
  function ReviewsPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), p.sections.map((s, i, all) => {
      if (isClose(s, i, all)) return e(Close, {
        key: s.id,
        s,
        ctx
      });
      if (s.blocks.some(b => b.t === 'quote')) {
        return e('section', {
          key: s.id,
          className: 'sec',
          id: s.id,
          'aria-labelledby': s.id + '-h'
        }, e('div', {
          className: 'read'
        }, e('h2', {
          className: 'h2',
          id: s.id + '-h'
        }, s.h2), e('div', {
          className: 'quotes'
        }, e(Blocks, {
          blocks: s.blocks,
          ctx
        }))));
      }
      return e(ReadSection, {
        key: s.id,
        s,
        ctx
      });
    }));
  }

  // ── Free Tools ─────────────────────────────────────────────────────────────
  // The Work & Life Check comes first, set as the featured entry (the broad
  // check that routes on); the narrower burnout and career tools follow.
  // The featured entry: its copy sits on the same reading axis as the tool
  // titles below it; only the card (background and top rule) reaches past
  // that axis on both sides.
  function FeaturedTool() {
    return e('section', {
      className: 'sec',
      id: 'the-work-and-life-check',
      'aria-labelledby': 'the-work-and-life-check-h'
    }, e('div', {
      className: 'read'
    }, e('div', {
      className: 'tool tool--featured'
    }, e('p', {
      className: 'eyebrow'
    }, WLC_TOOL.label), e('h2', {
      className: 'h2',
      id: 'the-work-and-life-check-h'
    }, WLC_TOOL.title), e('div', {
      className: 'flow'
    }, e('p', {
      className: 'p'
    }, WLC_TOOL.body)), e('div', {
      className: 'actions'
    }, e('a', {
      className: 'btn',
      href: wlcHref(WLC_TOOL.source)
    }, WLC_TOOL.button, ' ', e(Arrow)), e('span', {
      className: 'meta'
    }, WLC_TOOL.meta)))));
  }
  function ToolsPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), e(FeaturedTool), p.sections.map(s => {
      const tool = s.blocks.some(b => b.t === 'meta');
      if (!tool) {
        return e('section', {
          key: s.id,
          className: 'sec',
          id: s.id,
          'aria-labelledby': s.id + '-h'
        }, e('div', {
          className: 'read'
        }, e('h2', {
          className: 'h2',
          id: s.id + '-h'
        }, s.h2), e('div', {
          className: 'flow'
        }, e(Blocks, {
          blocks: s.blocks.filter(b => b.t !== 'ctas'),
          ctx
        })), e(Actions, {
          items: [].concat.apply([], s.blocks.filter(b => b.t === 'ctas').map(b => b.items))
        })));
      }
      const start = s.blocks.find(b => b.t === 'ctas');
      const meta = s.blocks.find(b => b.t === 'meta');
      const others = s.blocks.filter(b => b !== start && b !== meta);
      return e('section', {
        key: s.id,
        className: 'sec',
        id: s.id,
        'aria-labelledby': s.id + '-h'
      }, e('div', {
        className: 'read tool'
      }, e('h2', {
        className: 'h2',
        id: s.id + '-h'
      }, s.h2), e('div', {
        className: 'flow'
      }, e(Blocks, {
        blocks: others.filter(b => b.t === 'p'),
        ctx
      })), e('div', {
        className: 'actions'
      }, start.items.map(it => e('a', {
        key: it.href,
        className: 'btn',
        href: it.href
      }, it.label, ' ', e(Arrow))), meta ? e('span', {
        className: 'meta'
      }, meta.text) : null), e('div', {
        className: 'flow tool__related'
      }, e(Blocks, {
        blocks: others.filter(b => b.t !== 'p'),
        ctx
      }))));
    }));
  }

  // ── Writing ────────────────────────────────────────────────────────────────
  // The published articles (site-articles.js, newest first) open Featured:
  // they live at their own URLs but sit on the blog. The essays from the
  // canonical copy follow; their Read links stay withheld until they return.
  function ArticleEntry({
    a
  }) {
    return e('article', {
      className: 'essay essay--live'
    }, e(ArticleMeta, {
      meta: a,
      className: 'essay__meta'
    }), e('h3', {
      className: 'h3'
    }, e('a', {
      className: 'essay__link',
      href: a.url
    }, a.h1)), e('div', {
      className: 'flow'
    }, e('p', {
      className: 'p'
    }, inlineMd(a.deck)),
    // "Read" is the listing's own link wording; the title completes its
    // name for anyone moving from link to link.
    e('div', {
      className: 'links'
    }, e('a', {
      className: 'tlink',
      href: a.url
    }, e('span', null, 'Read', e('span', {
      className: 'sp-vh'
    }, ': ' + a.h1)), e(Arrow))), a.related ? e('p', {
      className: 'related'
    }, 'Related: ', e(TLink, {
      item: a.related
    })) : null));
  }
  function WritingPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    const live = window.SITE_ARTICLES || [];
    return e(React.Fragment, null, e(Hero, {
      p,
      ctx
    }), p.sections.map((s, i, all) => {
      if (isClose(s, i, all)) return e(Close, {
        key: s.id,
        s,
        ctx
      });
      const subs = s.blocks.filter(b => b.t === 'sub');
      if (s.id === 'featured') {
        return e(React.Fragment, {
          key: s.id
        }, e('section', {
          className: 'sec',
          id: s.id,
          'aria-labelledby': s.id + '-h'
        }, e('div', {
          className: 'read'
        }, e('h2', {
          className: 'h2',
          id: s.id + '-h'
        }, s.h2), e('div', {
          className: 'essays'
        }, live.map(a => e(ArticleEntry, {
          key: a.id,
          a
        })), subs.map(sub => e('article', {
          key: sub.h3,
          className: 'essay'
        }, e('h3', {
          className: 'h3'
        }, sub.h3), e('div', {
          className: 'flow'
        }, e(Blocks, {
          blocks: sub.blocks,
          ctx
        }))))))), wlcAfter(p.id, s.id));
      }
      if (subs.length && subs.length === s.blocks.length) {
        return e('section', {
          key: s.id,
          className: 'sec',
          id: s.id,
          'aria-labelledby': s.id + '-h'
        }, e('div', {
          className: 'mid'
        }, e('h2', {
          className: 'h2',
          id: s.id + '-h'
        }, s.h2), e('div', {
          className: 'cols3 cols2'
        }, subs.map(sub => e('div', {
          key: sub.h3,
          className: 'col'
        }, e('h3', {
          className: 'h3'
        }, sub.h3), e('div', {
          className: 'flow'
        }, e(Blocks, {
          blocks: sub.blocks,
          ctx
        })))))));
      }
      return e(ReadSection, {
        key: s.id,
        s,
        ctx
      });
    }));
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  // Delivery goes through window.submitLead (lead-capture.js), the same path as
  // the diagnostics' notifications: the EmailJS notification to Aggelos (the
  // canonical owner template, Reply-To the visitor) and a row in the leads
  // sheet, run independently. The success state appears only once EmailJS has
  // accepted the notification; otherwise the form comes back with everything
  // still filled in and the address to write to directly. One send in flight at
  // a time. Validation, the honeypot, the soft rate limit and the analytics
  // events are unchanged.
  const MAXLEN = 3000;
  const COUNTER_FROM = 2600;
  // Offered only if sending fails; the address the previous site published.
  const CONTACT_EMAIL = 'aggelos.mouzakitis@gmail.com';
  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    } catch (err) {/* analytics is optional */}
  }
  const sanitize = s => (s || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/ {2,}/g, ' ').trim();
  const sanitizeLong = s => (s || '').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ').trim();
  const validEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const slugOf = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const safeGet = k => {
    try {
      return window.localStorage.getItem(k);
    } catch (err) {
      return null;
    }
  };
  const safeSet = (k, v) => {
    try {
      window.localStorage.setItem(k, v);
    } catch (err) {/* private mode */}
  };
  function ContactForm({
    form
  }) {
    const fields = form.fields;
    const labelOf = i => fields[i] ? fields[i].label : '';
    // The four fields of the copy, in its order; Service is optional so nobody
    // has to decide on a service before getting in touch.
    const L = {
      name: labelOf(0),
      email: labelOf(1),
      location: labelOf(2),
      message: labelOf(3)
    };
    const service = fields.find(f => f.options) || {
      label: 'Service',
      options: []
    };
    const [v, setV] = useState({
      name: '',
      email: '',
      location: '',
      message: '',
      service: '',
      hp: ''
    });
    const [errors, setErrors] = useState({});
    const [formErr, setFormErr] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | sending | success
    const refs = {
      name: useRef(null),
      email: useRef(null),
      location: useRef(null),
      message: useRef(null)
    };
    const live = useRef(null);
    const successRef = useRef(null);
    const lastRef = useRef(0);
    const sendingRef = useRef(false); // true from submit until EmailJS answers: no second send

    useEffect(() => {
      track('contact_page_viewed', {
        source_page: document.referrer || 'direct'
      });
    }, []);
    useEffect(() => {
      if (status === 'success' && successRef.current) {
        try {
          successRef.current.focus();
        } catch (err) {/* focus is best-effort */}
        announce('Thanks. Your message has been sent.');
      }
    }, [status]);
    const announce = t => {
      if (live.current) live.current.textContent = t;
    };
    const set = k => ev => setV(Object.assign({}, v, {
      [k]: ev.target.value
    }));
    function validate() {
      const er = {};
      if (!sanitize(v.name)) er.name = 'Please add your name.';
      const em = sanitize(v.email);
      if (!em) er.email = 'Please add your email.';else if (!validEmail(em)) er.email = 'Please enter a valid email address.';
      if (!sanitize(v.location)) er.location = 'Please add where you are currently located.';
      if (!sanitizeLong(v.message)) er.message = 'Please add a few lines.';
      return er;
    }
    function onSubmit(ev) {
      ev.preventDefault();
      if (sendingRef.current) return; // a send is in flight: clicks and Enter do nothing
      const src = document.referrer || 'direct';
      track('form_submission_attempted', {
        interest: v.service || 'none',
        source_page: src
      });
      // Honeypot: bots only. Looks sent, sends nothing.
      if (v.hp) {
        track('form_submission_honeypot', {
          source_page: src
        });
        setStatus('success');
        return;
      }
      const er = validate();
      setErrors(er);
      const order = ['name', 'email', 'location', 'message'];
      const first = order.find(k => er[k]);
      if (first) {
        setFormErr(false);
        if (refs[first].current) refs[first].current.focus();
        announce('The form has errors. Please check the highlighted fields.');
        return;
      }
      const now = Date.now();
      const last = lastRef.current || Number(safeGet('ct_last') || 0);
      if (now - last < 15000) {
        setFormErr(true);
        announce('Please wait a few seconds before sending again.');
        return;
      }
      setFormErr(false);
      sendingRef.current = true;
      setStatus('sending');
      announce('Sending your message.');
      const when = new Date();
      const name = sanitize(v.name);
      const email = sanitize(v.email);
      const loc = sanitize(v.location).slice(0, 200);
      const msg = sanitizeLong(v.message).slice(0, MAXLEN);
      const svc = v.service; // optional: only in the email when chosen
      // The notification exactly as it arrives. Every visible field; the
      // optional one only when it has a value.
      const message = ['New enquiry from aggelosmouzakitis.com', '', 'Name:', name, '', 'Email:', email, '', L.location + ':', loc, ''].concat(svc ? ['Interest / reason for contact:', svc, ''] : [], ['Message:', msg, '', 'Page:', window.location.href, '', 'Submitted:', when.toISOString().slice(0, 16).replace('T', ' ') + ' UTC', '', 'Reply-to:', email]).join('\n');
      const ok = () => {
        sendingRef.current = false;
        lastRef.current = Date.now();
        safeSet('ct_last', String(lastRef.current));
        track('form_submission_succeeded', {
          interest: svc ? slugOf(svc) : 'none',
          source_page: src
        });
        setStatus('success');
      };
      const fail = err => {
        sendingRef.current = false;
        try {
          console.error('Contact send error:', err);
        } catch (e2) {/* noop */}
        track('form_submission_failed', {
          interest: svc ? slugOf(svc) : 'none',
          source_page: src
        });
        setStatus('idle');
        setFormErr(true);
        announce('Something went wrong and your message was not sent.');
      };
      if (typeof window.submitLead !== 'function') {
        fail(new Error('Lead capture unavailable'));
        return;
      }
      window.submitLead({
        source: 'contact',
        detail: svc ? slugOf(svc) : '',
        detailLabel: svc,
        name,
        email,
        notes: msg,
        message,
        when,
        sourcePage: src,
        detailExtra: 'location: ' + loc,
        params: {
          location: loc,
          service: svc
        }
      }, (recorded, res) => {
        // Sent means EmailJS accepted the notification. The sheet row is
        // written either way, but it is not what tells Aggelos.
        if (res && res.owner === 'ok') ok();else fail(new Error('Notification not sent: ' + JSON.stringify(res && res.detail)));
      });
    }
    const liveRegion = e('div', {
      ref: live,
      className: 'sp-vh',
      role: 'status',
      'aria-live': 'polite'
    });
    if (status === 'success') {
      return e('div', {
        className: 'ct-form ct-form--done'
      }, liveRegion, e('h2', {
        className: 'sp-form__done',
        tabIndex: -1,
        ref: successRef
      }, 'Thanks. Your message has been sent.'), e('p', {
        className: 'p'
      }, 'I’ll get back to you as soon as I can.'), e('div', {
        className: 'links'
      }, e(TLink, {
        item: {
          label: 'Back to the homepage',
          href: '/'
        }
      })));
    }
    const field = (key, label, input, help) => {
      const er = errors[key];
      const desc = [help ? key + '-help' : null, er ? key + '-err' : null].filter(Boolean).join(' ') || undefined;
      return e('div', {
        className: 'ct-field'
      }, e('label', {
        className: 'ct-label',
        htmlFor: 'ct-' + key
      }, label), e(input.tag, Object.assign({
        id: 'ct-' + key,
        ref: refs[key],
        required: true,
        'aria-required': 'true',
        'aria-invalid': er ? 'true' : 'false',
        'aria-describedby': desc,
        value: v[key],
        onChange: set(key)
      }, input.props)), er ? e('p', {
        id: key + '-err',
        className: 'sp-err'
      }, er) : null, help || null);
    };
    const count = v.message.length >= COUNTER_FROM ? e('p', {
      id: 'message-help',
      className: 'ct-help',
      'aria-live': 'polite'
    }, v.message.length + ' / ' + MAXLEN) : null;
    const sending = status === 'sending';
    return e('form', {
      className: 'ct-form',
      noValidate: true,
      onSubmit,
      'aria-labelledby': 'page-title'
    }, liveRegion, formErr ? e('div', {
      className: 'sp-formerr',
      role: 'alert'
    }, e('p', null, 'Something went wrong and your message was not sent.'), e('p', null, 'Please try again or email me directly at ', e('a', {
      href: 'mailto:' + CONTACT_EMAIL
    }, CONTACT_EMAIL), '.')) : null,
    // Honeypot: off-screen, out of the tab order and hidden from assistive
    // technology; people never fill it. Its label and id match no autofill
    // category: a hidden field called "Company" gets filled by browsers and
    // password managers along with the name and email, which would turn a
    // real enquiry into a silent fake success. Password managers are told to
    // skip it as well.
    e('div', {
      className: 'sp-hp',
      'aria-hidden': 'true'
    }, e('label', {
      htmlFor: 'ct-hp'
    }, 'Leave this field empty'), e('input', {
      id: 'ct-hp',
      type: 'text',
      tabIndex: -1,
      autoComplete: 'off',
      'data-lpignore': 'true',
      'data-1p-ignore': 'true',
      'data-form-type': 'other',
      value: v.hp,
      onChange: set('hp')
    })), e('div', {
      className: 'ct-pair'
    }, field('name', L.name, {
      tag: 'input',
      props: {
        className: 'ct-input',
        type: 'text',
        autoComplete: 'name'
      }
    }), field('email', L.email, {
      tag: 'input',
      props: {
        className: 'ct-input',
        type: 'email',
        autoComplete: 'email',
        inputMode: 'email'
      }
    })), field('location', L.location, {
      tag: 'input',
      props: {
        className: 'ct-input',
        type: 'text',
        autoComplete: 'country-name'
      }
    }), e('fieldset', {
      className: 'ct-field ct-service'
    }, e('legend', {
      className: 'ct-label'
    }, service.label), e('div', {
      className: 'ct-choices'
    }, service.options.map(opt => e('label', {
      key: opt,
      className: 'ct-choice'
    }, e('input', {
      type: 'radio',
      name: 'service',
      value: opt,
      checked: v.service === opt,
      onChange: () => {
        setV(Object.assign({}, v, {
          service: opt
        }));
        track('interest_selected_manually', {
          interest: slugOf(opt)
        });
      }
    }), e('span', null, opt))))), field('message', L.message, {
      tag: 'textarea',
      props: {
        className: 'ct-input ct-textarea',
        rows: 6,
        maxLength: MAXLEN
      }
    }, count), e('button', {
      className: 'btn ct-submit',
      type: 'submit',
      disabled: sending
    }, e('span', null, sending ? 'Sending…' : form.submit.label), sending ? null : e(Arrow)));
  }
  function ContactPage({
    p
  }) {
    const ctx = {
      id: p.id
    };
    const h = p.hero;
    const ps = h.blocks.filter(b => b.t === 'p');
    const next = p.sections.find(s => s.id === 'what-happens-next');
    const privacy = p.sections.find(s => s.id === 'privacy');
    const others = p.sections.filter(s => s !== next && s !== privacy);
    return e('div', {
      className: 'wrap contact'
    }, e('header', {
      className: 'contact__head'
    }, e('p', {
      className: 'eyebrow'
    }, h.eyebrow), e('h1', {
      className: 'h1',
      id: 'page-title'
    }, h.h1), ps.map((b, i) => e('p', {
      key: i,
      className: 'lead' + (i === ps.length - 1 && ps.length > 1 ? ' lead--strong' : '')
    }, rich(b.text, ctx)))), e('div', {
      className: 'contact__grid'
    }, e('div', {
      className: 'contact__form'
    }, e(ContactForm, {
      form: p.form
    })), e('aside', {
      className: 'contact__aside'
    }, next ? e('section', {
      className: 'contact__next',
      'aria-labelledby': 'next-h'
    }, e('h2', {
      className: 'contact__h',
      id: 'next-h'
    }, next.h2), e('div', {
      className: 'flow'
    }, e(Blocks, {
      blocks: next.blocks,
      ctx
    }))) : null, privacy ? e('section', {
      className: 'contact__privacy',
      'aria-labelledby': 'privacy-h'
    }, e('h2', {
      className: 'label contact__privacy-h',
      id: 'privacy-h'
    }, privacy.h2), e('div', {
      className: 'flow'
    }, e(Blocks, {
      blocks: privacy.blocks,
      ctx
    }))) : null, others.map(s => e(ReadSection, {
      key: s.id,
      s,
      ctx
    })))));
  }

  // ── Articles ───────────────────────────────────────────────────────────────
  // A long-form article (window.SITE_ARTICLE_PAGES[slug], generated from its
  // brief by scripts/articles/extract-articles.js) on the site's reading axis:
  // breadcrumb to Writing, metadata line, the one H1, the deck, the author
  // strip, the TOC, the introduction, then each section under the H2 id its
  // brief gives (the TOC targets). Words, links and emphasis come verbatim
  // from the data; this only sets them. The commercial close follows the
  // article, outside it, as the one booking action on the page.
  function ArticleMeta({
    meta,
    className
  }) {
    return e('p', {
      className: className || 'art-meta'
    }, e('span', {
      className: 'art-meta__cat'
    }, meta.category), ' · ', e('time', {
      dateTime: meta.published
    }, meta.publishedLabel), ' · ', meta.readTime, meta.modified ? e(React.Fragment, null, ' · Updated ', e('time', {
      dateTime: meta.modified
    }, meta.modifiedLabel)) : null);
  }

  // The header's wording for a link, so the breadcrumb says what the menu says.
  function navLabel(href, fallback) {
    const nav = window.SITE_NAV && window.SITE_NAV.nav || {
      items: []
    };
    for (const it of nav.items) for (const l of [it].concat(it.items || [])) if (l.href === href && l.label) return l.label;
    return fallback;
  }
  function AuthorStrip({
    a
  }) {
    return e('div', {
      className: 'art-author'
    }, e('span', {
      className: 'art-author__fig'
    }, e('img', {
      src: a.image,
      alt: a.alt,
      width: a.width,
      height: a.height,
      decoding: 'async'
    })), e('div', {
      className: 'art-author__text'
    }, e('p', {
      className: 'art-author__name'
    }, e('a', {
      href: a.href,
      rel: 'author'
    }, a.name)), e('p', {
      className: 'art-author__line'
    }, a.credential), e('p', {
      className: 'art-author__line art-author__line--bg'
    }, a.background)));
  }

  // In normal document flow; plain anchors, so it works before JavaScript and
  // scrolls as the reader's motion preference allows (base CSS).
  function ArticleToc({
    toc
  }) {
    return e('nav', {
      className: 'art-toc',
      'aria-labelledby': 'art-toc-label'
    }, e('p', {
      className: 'art-toc__label',
      id: 'art-toc-label'
    }, toc.label), e('ol', {
      className: 'art-toc__list'
    }, toc.items.map(it => e('li', {
      key: it.id
    }, e('a', {
      href: '#' + it.id
    }, it.label)))));
  }
  const plainMd = t => t.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');

  // A real table with header cells both ways. Below 640px the rows become
  // labelled groups: the explicit roles keep the table semantics that some
  // browsers drop once the display changes, and each cell shows its column
  // label (data-label, drawn by CSS and not read twice).
  function ArticleTable({
    t
  }) {
    return e('table', {
      className: 'art-table',
      role: 'table',
      'aria-describedby': t.describedBy
    }, e('caption', null, inlineMd(t.caption)), e('colgroup', null, t.head.map((h, i) => e('col', {
      key: i,
      className: i ? 'art-table__ev' : 'art-table__key'
    }))), e('thead', {
      role: 'rowgroup'
    }, e('tr', {
      role: 'row'
    }, t.head.map((h, i) => e('th', {
      key: i,
      scope: 'col',
      role: 'columnheader'
    }, inlineMd(h))))), e('tbody', {
      role: 'rowgroup'
    }, t.rows.map((r, i) => e('tr', {
      key: i,
      role: 'row'
    }, r.map((c, j) => j ? e('td', {
      key: j,
      role: 'cell',
      'data-label': plainMd(t.head[j])
    }, inlineMd(c)) : e('th', {
      key: j,
      scope: 'row',
      role: 'rowheader',
      'data-label': plainMd(t.head[0])
    }, inlineMd(c)))))));
  }
  function ArticleBlocks({
    blocks
  }) {
    return blocks.map((b, i) => {
      switch (b.t) {
        case 'p':
          if (b.role === 'callout') return e('div', {
            key: i,
            className: 'art-callout'
          }, e('p', {
            className: 'p'
          }, inlineMd(b.text)));
          return e('p', {
            key: i,
            className: 'p',
            id: b.id
          }, inlineMd(b.text));
        case 'ul':
          return e('ul', {
            key: i,
            className: 'art-list'
          }, b.items.map((it, j) => e('li', {
            key: j
          }, inlineMd(it))));
        case 'ol':
          return e('ol', {
            key: i,
            className: 'art-refs'
          }, b.items.map((it, j) => e('li', {
            key: j
          }, inlineMd(it))));
        case 'table':
          return e(ArticleTable, {
            key: i,
            t: b
          });
        case 'sub':
          return e('div', {
            key: i,
            className: 'art-sub'
          }, e('h3', {
            className: 'h3'
          }, b.h3), e('div', {
            className: 'flow'
          }, e(ArticleBlocks, {
            blocks: b.blocks
          })));
        default:
          return null;
      }
    });
  }
  function ArticlePage({
    a
  }) {
    return e(React.Fragment, null, e('article', {
      className: 'art',
      'aria-labelledby': 'page-title'
    }, e('header', {
      className: 'read art-head'
    }, e('nav', {
      className: 'art-crumbs',
      'aria-label': 'Breadcrumb'
    }, e('ol', null, e('li', null, e('a', {
      href: '/blog/'
    }, navLabel('/blog/', 'Writing'))))), e(ArticleMeta, {
      meta: a.meta
    }), e('h1', {
      className: 'h1 art-h1' + (a.h1.length > 60 ? ' h1--long' : ''),
      id: 'page-title'
    }, a.h1), e('p', {
      className: 'lead art-deck'
    }, inlineMd(a.deck)), e(AuthorStrip, {
      a: a.author
    }), e(ArticleToc, {
      toc: a.toc
    })), e('div', {
      className: 'read art-body'
    }, e('div', {
      className: 'flow'
    }, e(ArticleBlocks, {
      blocks: a.intro
    })), a.sections.map(s => e('section', {
      key: s.id,
      className: 'art-sec' + (s.kind ? ' art-sec--' + s.kind : '')
    }, e('h2', {
      className: 'h2',
      id: s.id
    }, s.h2), e('div', {
      className: 'flow'
    }, e(ArticleBlocks, {
      blocks: s.blocks
    })))))),
    // The site's close, carrying the article's own call to action.
    e('section', {
      className: 'band close on-dark art-cta',
      'aria-labelledby': a.cta.id
    }, e('div', {
      className: 'read close__in'
    }, e('p', {
      className: 'close__label'
    }, a.cta.eyebrow), e('h2', {
      className: 'close__text art-cta__h',
      id: a.cta.id
    }, a.cta.h2), e('p', {
      className: 'close__text close__text--long art-cta__p'
    }, a.cta.text), e('div', {
      className: 'close__actions'
    }, e(Btn, {
      item: a.cta.button
    })))));
  }
  function ArticleSite({
    id
  }) {
    const a = (window.SITE_ARTICLE_PAGES || {})[id];
    if (!a) return null;
    return e(React.Fragment, null, e(window.ChromeStyles), e('style', {
      dangerouslySetInnerHTML: {
        __html: CSS + ARTICLE_CSS
      }
    }),
    // An article sits on the blog: the header marks Writing as its section.
    e(window.SiteHeader, {
      section: '/blog/'
    }), e('main', {
      id: 'main',
      tabIndex: -1,
      className: 'pg fam-article pg--' + id
    }, e(ArticlePage, {
      a
    })), e(window.SiteFooterX));
  }
  function renderArticlePage(id) {
    ReactDOM.createRoot(document.getElementById('root')).render(e(ArticleSite, {
      id
    }));
  }

  // ── Router ─────────────────────────────────────────────────────────────────
  const PAGES = {
    home: HomePage,
    'work-with-me': WorkWithMePage,
    'therapy-vs-coaching': TherapyVsCoachingPage,
    reviews: ReviewsPage,
    'free-tools': ToolsPage,
    blog: WritingPage,
    contact: ContactPage
  };
  const FAMILY = {
    problem: 'fam-problem',
    audience: 'fam-audience',
    service: 'fam-service',
    resource: 'fam-resource'
  };
  function SitePage({
    id
  }) {
    const p = COPY[id];
    if (!p) return null;
    const Page = PAGES[id] || GenericPage;
    return e(React.Fragment, null, e(window.ChromeStyles), e('style', {
      dangerouslySetInnerHTML: {
        __html: CSS
      }
    }), e(window.SiteHeader), e('main', {
      id: 'main',
      tabIndex: -1,
      className: 'pg ' + (FAMILY[p.type] || 'fam-' + p.type) + ' pg--' + id
    }, e(Page, {
      p
    })), e(window.SiteFooterX));
  }
  function renderSitePage(id) {
    const root = document.getElementById('root');
    ReactDOM.createRoot(root).render(e(SitePage, {
      id
    }));
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
.h1{margin:0;max-width:17ch;font-family:var(--font-display);font-weight:400;font-size:clamp(34px,calc(22px + 2.9vw),60px);line-height:1.0;letter-spacing:-.04em;color:var(--heading);text-wrap:balance}
.hero-read .h1{max-width:none}
.h1--home{max-width:none;font-size:clamp(34px,calc(18.5px + 2.9vw),60px)}
.h1--long{max-width:none;font-size:clamp(34px,calc(20px + 1.95vw),48px);line-height:1.04}
.sub{margin:22px 0 0;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + .6vw),30px);font-weight:650;line-height:1.2;letter-spacing:-.02em;color:var(--green);text-wrap:balance}
.lead{margin:24px 0 0;max-width:32em;font-size:clamp(19px,calc(18.4px + .12vw),20px);line-height:1.55;color:var(--body);text-wrap:pretty}
.sub + .lead{margin-top:26px}
.lead + .lead{margin-top:16px}
.h2{margin:0 0 24px;font-family:var(--font-heading);font-size:clamp(30px,calc(26px + 1vw),40px);font-weight:800;line-height:1.08;letter-spacing:-.03em;color:var(--heading);text-wrap:balance}
.h3{margin:0 0 14px;font-family:var(--font-heading);font-size:clamp(22px,calc(20.5px + .3vw),24.5px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading);text-wrap:balance}
.p{margin:0;font-size:clamp(17px,calc(16px + .14vw),18px);line-height:1.7;color:var(--body);text-wrap:pretty}
.p strong{font-weight:600;color:var(--heading)}
.p--emph{font-size:clamp(19px,calc(18.4px + .14vw),20.5px);font-weight:550;line-height:1.45;color:var(--heading)}
.p--strong{font-weight:600;color:var(--heading)}
.inl{color:var(--green);font-weight:600;border-bottom:1.5px solid currentColor}
.inl:hover{color:var(--green-pressed)}
.meta{margin:0;font-size:15px;line-height:1.5;color:var(--meta)}
.related{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:0 10px;font-size:15px;color:var(--meta)}

/* Flow: paragraph → paragraph 18px, content → link 22px */
.flow>*{margin-top:0;margin-bottom:0}
.flow>*+*{margin-top:18px}
.flow>.links,.flow>.actions{margin-top:22px}
.flow>.facts+*{margin-top:32px}
.flow>.p--emph+*{margin-top:20px}
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

/* Dark section: one reading column on the 760 axis */
.dark{background:var(--forest);color:var(--bone)}
.dark__in{padding-block:var(--sec)}
.dark .h2{color:var(--bone)}
.dark .p{color:var(--on-forest)}
.dark .p strong{color:var(--bone)}
.dark .p--emph{color:var(--sage)}
.dark .p--rule{padding-left:18px;border-left:2px solid var(--sage);font-weight:600;color:var(--bone)}

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
.recog2{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:40px}
.recog2 li{padding:20px 0 24px;border-top:1px solid var(--rule);font-size:clamp(17px,calc(16px + .14vw),18px);line-height:1.6;color:var(--heading);text-wrap:pretty}
@media (max-width:759px){.routes,.recog2{grid-template-columns:minmax(0,1fr)}}
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
.home-fig__img img{position:absolute;left:-10%;top:0;width:120%;height:auto;max-width:none}
@media (max-width:899px){.home-hero__lines{display:none}.home-hero__in{grid-template-columns:minmax(0,1fr)}.home-fig{width:min(80%,320px);justify-self:center}}
.creds{border-block:1px solid rgba(23,25,25,.16)}
.creds ul{list-style:none;margin:0 auto;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.creds li{padding:22px 24px;border-left:1px solid rgba(23,25,25,.16)}
.creds li:first-child{padding-left:0;border-left:0}
.creds__a{display:block;font-size:16.5px;font-weight:650;line-height:1.3;color:var(--heading)}
.creds__b{display:block;margin-top:4px;font-size:14.5px;line-height:1.4;color:var(--ink-2)}
@media (max-width:759px){.creds ul{grid-template-columns:repeat(2,minmax(0,1fr))}.creds li{padding:18px 16px 18px 0;border-left:0}.creds li:nth-child(even){padding:18px 0 18px 16px;border-left:1px solid rgba(23,25,25,.16)}.creds li:nth-child(n+3){border-top:1px solid rgba(23,25,25,.16)}}
.home-brings>.p{max-width:36em}

/* Therapy vs Coaching */
.compare{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px clamp(40px,5.5vw,80px);align-items:start}
.compare__col{min-width:0;padding-top:22px;border-top:2px solid var(--heading)}
.compare__h{margin:0 0 18px;font-family:var(--font-heading);font-size:clamp(22px,calc(20.5px + .4vw),26px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading);text-wrap:balance}
@media (max-width:899px){.compare{grid-template-columns:minmax(0,1fr)}}

/* Free Tools, Writing */
.tool .actions{margin-top:26px}
.tool__related{margin-top:18px}
/* The card reaches --feat-bleed past the reading axis on each side (24px on
   desktop, less than the gutter on small screens); its copy stays on the axis. */
.tool--featured{--feat-bleed:min(24px,calc(var(--gutter) - 8px));margin-inline:calc(-1 * var(--feat-bleed));padding:clamp(28px,4vw,44px) var(--feat-bleed);background:var(--bone-deep);border-top:3px solid var(--green)}
.tool--featured .eyebrow{margin-bottom:14px}

/* The Work & Life Check call to action (WorkLifeCheckCTA) */
.wlcta--feature{padding:clamp(28px,4vw,44px);background:var(--bone-deep);border-top:3px solid var(--green)}
.wlcta--feature .eyebrow{margin-bottom:14px}
.wlcta__h{margin:0 0 16px;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + 1vw),34px);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--heading);text-wrap:balance}
.wlcta--feature .actions{margin-top:26px}
.wlcta--inline{margin-top:clamp(40px,4.5vw,56px);padding:26px 0 30px;border-top:2px solid var(--green);border-bottom:1px solid var(--rule)}
.wlcta__lead{margin:0;max-width:32em;font-family:var(--font-heading);font-size:clamp(21px,calc(19.5px + .4vw),24px);font-weight:700;line-height:1.3;letter-spacing:-.015em;color:var(--heading);text-wrap:balance}
.wlcta--inline .p{margin-top:12px}
.wlcta--inline .btn{margin-top:22px}
.btn--ghost{background:transparent;color:var(--green);box-shadow:inset 0 0 0 1.5px var(--green)}
.btn--ghost:hover{background:var(--green);color:var(--bone)}
.wlcta--compact{margin-top:clamp(36px,4vw,48px);padding:18px 0 12px;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
.wlcta__text{margin:0;max-width:36em;font-size:clamp(17px,calc(16px + .14vw),18px);font-weight:600;line-height:1.5;color:var(--heading);text-wrap:pretty}
.wlcta--compact .tlink{margin-top:2px}
.essays{border-bottom:1px solid var(--rule)}
.essay{padding:28px 0;border-top:1px solid var(--rule)}
.essay .h3{margin-bottom:10px}
.essay__meta{margin:0 0 10px;font-size:15px;line-height:1.5;color:var(--meta)}
.essay__meta .art-meta__cat{font-weight:700;color:var(--heading)}
.essay__link{color:var(--heading);text-decoration:underline;text-decoration-thickness:1.5px;text-decoration-color:transparent;text-underline-offset:.16em;transition:color 180ms,text-decoration-color 180ms}
.essay__link:hover{color:var(--green);text-decoration-color:currentColor}
.essay .flow>.links+.related{margin-top:4px}

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
.sp-formerr a{color:var(--green);font-weight:600;border-bottom:1.5px solid currentColor;overflow-wrap:anywhere}
.sp-formerr p{margin:0}
.sp-formerr p+p{margin-top:6px}
.ct-submit{width:100%;min-height:56px}
.ct-submit[disabled]{opacity:.7;cursor:progress}
.sp-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.sp-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sp-form__done{margin:0 0 14px;font-family:var(--font-heading);font-size:clamp(24px,calc(20px + .8vw),32px);font-weight:800;letter-spacing:-.03em;color:var(--heading);outline:none}

/* Composition axes: 760 reading (.read), 960 paired/practical (.mid), 1120 comparison (.wide), 1240 hero/photo/services (.wrap).
   Body measure inside the reading axis: 36em (≈ 72 characters); leads 32em (≈ 62). */
.mid{width:min(960px,calc(100% - 2 * var(--gutter)));margin-inline:auto}
.wide{width:min(1120px,calc(100% - 2 * var(--gutter)));margin-inline:auto}
.sec--step{padding-top:clamp(80px,8.4vw,120px)}
.read .p,.read-l .p,.col .p,.compare .p,.contact__aside .p{max-width:36em}
.read .p--emph,.read-l .p--emph{max-width:32em}
/* A reading column that starts on its container's left edge (.wrap or .mid)
   instead of the page's centred reading axis; same width as .read. */
.read-l{max-width:var(--read-max)}
.quote blockquote p{max-width:34em}
.practical__rest{margin-top:40px}
.sec--pre-faq + .sec{padding-top:clamp(88px,6.7vw,96px)}
.cols2{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:760px) and (max-width:1099px){
  .cols3:not(.cols2){grid-template-columns:minmax(0,1fr);row-gap:0}
  .cols3:not(.cols2) .col{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);column-gap:32px;align-content:start;padding-block:22px 30px}
  .cols3:not(.cols2) .col>*{grid-column:2}
  .cols3:not(.cols2) .col>.h3{grid-column:1;grid-row:1/span 3}
}
@media (max-width:759px){.cols2{grid-template-columns:minmax(0,1fr)}}

@media (max-width:599px){.btn{white-space:normal;text-align:center}}
`;

  // Articles only (ArticleSite adds it after CSS): the long-form reading
  // column on the 760 axis, body measure 36em.
  const ARTICLE_CSS = `
.art-head{padding-top:clamp(48px,5.5vw,80px)}
.art-crumbs ol{display:flex;flex-wrap:wrap;margin:0;padding:0;list-style:none}
.art-crumbs a{display:inline-flex;align-items:center;min-height:44px;margin-block:-12px;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
.art-crumbs a:hover{color:var(--green-pressed);text-decoration:underline;text-underline-offset:4px}
.art-meta{margin:10px 0 0;font-size:15px;line-height:1.5;color:var(--meta)}
.art-meta__cat{font-weight:700;color:var(--heading)}
.art-h1{margin-top:20px}
.art-deck{max-width:34em}

/* Author strip: compact, one line of image and three of text */
.art-author{display:flex;align-items:center;gap:16px;margin-top:32px;padding-block:16px;border-block:1px solid var(--rule)}
.art-author__fig{position:relative;flex:0 0 auto;width:60px;height:60px;border-radius:50%;overflow:hidden;background:var(--forest)}
.art-author__fig img{position:absolute;left:50%;top:0;width:160%;max-width:none;height:auto;transform:translate(-48%,-9%)}
.art-author__text{min-width:0}
.art-author p{margin:0}
.art-author__name{font-size:16.5px;font-weight:650;line-height:1.35;color:var(--heading)}
.art-author__name a{border-bottom:1.5px solid rgba(4,120,87,.45);transition:color 180ms,border-color 180ms}
.art-author__name a:hover{color:var(--green);border-bottom-color:currentColor}
.art-author__line{margin-top:3px;font-size:14.5px;line-height:1.45;color:var(--ink-2)}
.art-author__line--bg{color:var(--meta)}
@media (max-width:559px){.art-author{align-items:flex-start}}

/* On this page: in the flow, numbered like the site's rows */
.art-toc{margin-top:40px}
.art-toc__label{margin:0 0 12px;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--meta)}
.art-toc__list{margin:0;padding:0;list-style:none;border-top:1px solid var(--rule-2);counter-reset:toc}
.art-toc__list li{counter-increment:toc;border-bottom:1px solid var(--rule)}
.art-toc__list a{display:flex;align-items:baseline;gap:14px;min-height:44px;padding:10px 0;font-size:16.5px;font-weight:550;line-height:1.4;color:var(--heading);transition:color 180ms}
.art-toc__list a::before{content:counter(toc,decimal-leading-zero);content:counter(toc,decimal-leading-zero) / "";flex:0 0 26px;font-size:13px;font-weight:700;letter-spacing:.04em;color:var(--green);font-variant-numeric:tabular-nums}
.art-toc__list a:hover{color:var(--green)}

/* Body. The site header is not sticky: a target heading only needs air. */
.art-body{padding-top:clamp(48px,5vw,64px)}
.art h2[id],.art-cta h2[id]{scroll-margin-top:24px}
.art-sec{padding-top:clamp(56px,6vw,80px)}
.art .h2{margin-bottom:22px;font-size:clamp(28px,calc(24px + 1vw),36px)}
.art .p{font-size:clamp(17px,calc(16px + .2vw),18.5px);line-height:1.72}
.art .p strong{font-weight:650}
.flow>.art-sub{margin-top:clamp(36px,4vw,48px)}
.art-a{color:var(--green);text-decoration:underline;text-decoration-thickness:1px;text-decoration-color:rgba(4,120,87,.55);text-underline-offset:.2em;transition:color 180ms,text-decoration-color 180ms}
.art-a:hover{color:var(--green-pressed);text-decoration-color:currentColor;text-decoration-thickness:2px}
.art-list{margin:0;padding-left:1.25em}
.art-list li{padding-left:.35em;font-size:clamp(17px,calc(16px + .2vw),18.5px);line-height:1.68;color:var(--body);text-wrap:pretty}
.art-list li+li{margin-top:12px}
.art-list li::marker{color:var(--green)}
.art-list strong{font-weight:650;color:var(--heading)}
.flow>.art-list,.flow>.art-table,.flow>.art-callout{margin-top:24px}
.flow>.art-list+*,.flow>.art-table+*,.flow>.art-callout+*{margin-top:24px}

/* Comparison table: the first column narrower than the two evidence columns */
.art-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:15.5px;line-height:1.55;color:var(--body)}
.art-table caption{caption-side:top;margin:0 0 14px;text-align:left;font-size:17px;font-weight:600;line-height:1.45;color:var(--heading)}
.art-table__key{width:24%}
.art-table thead th{padding:0 16px 12px 0;border-bottom:2px solid var(--heading);text-align:left;vertical-align:bottom;font-family:var(--font-heading);font-size:15px;font-weight:700;line-height:1.3;color:var(--heading)}
.art-table tbody th,.art-table td{padding:14px 18px 16px 0;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}
.art-table tbody th{font-weight:650;line-height:1.4;color:var(--heading)}
.art-table tr>:last-child{padding-right:0}
@media (max-width:640px){
  .art-table,.art-table tbody,.art-table tr,.art-table th,.art-table td{display:block;width:auto}
  .art-table caption{display:block}
  .art-table colgroup{display:none}
  .art-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .art-table tbody tr{padding:16px 0 20px;border-top:2px solid var(--heading)}
  .art-table tbody th,.art-table td{padding:0;border:0}
  .art-table tbody th{font-family:var(--font-heading);font-size:18px;font-weight:700}
  .art-table td{margin-top:14px}
  .art-table [data-label]::before{content:attr(data-label);content:attr(data-label) / "";display:block;margin-bottom:4px;font-family:var(--font-body);font-size:12px;font-weight:700;line-height:1.35;letter-spacing:.06em;text-transform:uppercase;color:var(--meta)}
}

/* The one safety callout: restrained, the paragraph and its links intact */
.art-callout{padding:20px 22px;background:var(--bone-deep);border-left:3px solid var(--heading)}

/* Questions, answered in full: no accordion */
.art-sec--faq .flow>.art-sub{margin-top:0;padding:24px 0 26px;border-top:1px solid var(--rule)}
.art-sec--faq .flow>.art-sub:last-child{border-bottom:1px solid var(--rule)}
.art-sec--faq .h3{margin-bottom:10px;font-size:clamp(19px,calc(18px + .25vw),21px)}

/* References: the editorial list, smaller, hanging numbers */
.art-refs{margin:0;padding-left:1.7em;font-size:15.5px;line-height:1.6;color:var(--ink-2)}
.art-refs li{padding-left:.4em;overflow-wrap:break-word}
.art-refs li+li{margin-top:10px}
.art-refs li::marker{font-weight:600;color:var(--meta);font-variant-numeric:tabular-nums}

/* The close: the site's dark band, the article's CTA in it */
.art-cta .art-cta__h{margin:0 auto}
.art-cta .art-cta__p{margin:18px auto 0}
`;
  window.renderSitePage = renderSitePage;
  window.SitePage = SitePage;
  window.renderArticlePage = renderArticlePage;
})();
