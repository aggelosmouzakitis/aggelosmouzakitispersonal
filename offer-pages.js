// offer-pages.jsx — 1:1 offer landing pages (live, indexed).
// Plain React, compiled by babel like site-chrome.jsx / content-pages.jsx.
// Loaded AFTER site-chrome.js (uses window.ChromeStyles / SiteHeader / SiteFooterX).
//
// Three offer landing pages share one set of section components; each page is a
// data-only config (copy + colour variation). Rebuilt natively from the design
// references. Real header/footer/fonts come from the production chrome.
//
// Routes (linked from the header "Work with me" dropdown):
//   /psychotherapy-decision-coaching/  renderOfferPage('psychotherapy-decision-coaching')
//   /career-strategy-consulting/       renderOfferPage('career-strategy-consulting')
//   /solopreneur-growth-consulting/    renderOfferPage('solopreneur-growth-consulting')

var e = React.createElement;

// ─── CENTRAL CTA DESTINATION (one per page) ──────────────────────────────────
// Every main CTA (hero, audit panel, final band, sticky) on each page routes to
// the contact page, pre-selecting the matching enquiry interest.
var psychotherapyDecisionCoachingUrl = '/contact?interest=private-sparring';
var careerStrategyConsultingUrl = '/contact?interest=experience-to-offer';
var solopreneurGrowthConsultingUrl = '/contact?interest=solo-business-growth';

// ─── Shared content ──────────────────────────────────────────────────────────
// Each page's 4:5 hero portrait (full colour, intrinsic 1000×1250) is set per
// config as heroPhoto. Under every hero CTA sit the two softer routes: a
// contextually relevant free tool (per config) and the orientation flow.
var START_HERE_URL = '/start-here/'; // "Not sure where to start?" orientation
var STATS = [{
  num: '18 years',
  label: 'Product and growth'
}, {
  num: '7 years',
  label: 'Running my own consultancy'
}, {
  num: '100+',
  label: 'Technology companies'
}, {
  num: 'BACP-registered',
  label: 'Psychotherapist',
  small: true
}];
var LOGOS = ['IBM', 'Farfetch', 'GrowthMentor', 'University of Oxford', 'University of London', 'Glofox', 'Whereby', 'Moosend'];
var WORKING_CALL_NOTE = 'This is a working call, not a generic fit call. It should be useful even if we never work together.';

// ─── Stylesheet ──────────────────────────────────────────────────────────────
// Section styles transcribed from the design references. The three JS
// breakpoints in the reference (mob<=680, stack<=900, sm<=560) become CSS media
// queries. Per-page colour variation rides on custom properties set on .dl.
var OFFER_CSS = `
/* The shared production header can push ~4px past the viewport in the 681–768px
   band (its desktop CTA before the burger kicks in). Clip it at the root on these
   offer pages so the body never scrolls horizontally, without touching chrome. */
html{overflow-x:clip}
.dl{background:#F3F0E8;color:#3A403A;font-family:var(--font-body)}
.dl-container{width:min(1240px,calc(100% - 2 * clamp(20px,4vw,64px)));margin-inline:auto}

/* shared type/atoms */
.dl-eyebrow{font-size:13px;font-weight:700;line-height:1.4;letter-spacing:0.11em;text-transform:uppercase;color:#047857;max-width:34ch}
.dl-kicker{font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:#047857}
.dl-h2{margin:16px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.5vw,52px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:#171919;text-wrap:balance}
.dl-col{min-width:0}
.dl-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:56px;padding:0 26px;background:#047857;color:#F3F0E8;font-size:16px;font-weight:600;letter-spacing:0.01em;transition:filter .18s,gap .18s}
.dl-btn:hover{background:#03654A;gap:13px}

/* section shells */
.dl-section{background:#F3F0E8;padding-block:clamp(56px,8vw,112px)}
.dl-section--flush{padding-top:0}

/* hero */
.dl-hero{background:#F3F0E8;padding-block:clamp(48px,6vw,80px) clamp(56px,7vw,96px)}
.dl-hero__grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);align-items:center;gap:clamp(40px,4.5vw,64px)}
.dl-hero__h1{margin:16px 0 24px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(42px,5vw,72px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#171919;text-wrap:pretty}
.dl-hero__h1 span{display:block}
.dl-hero__lead{margin:0;max-width:660px;font-size:19px;line-height:1.6;color:#3A403A;text-wrap:pretty}
.dl-hero__cta-row{margin-top:32px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.dl-hero__note{margin:20px 0 0;font-size:15px;line-height:1.5;color:#6A6F67}
.dl-hero__fallback{margin:14px 0 0;display:flex;flex-wrap:wrap;gap:8px 26px;font-size:15px;line-height:1.5;color:#6A6F67}
.dl-hero__soft{display:inline-flex;align-items:center;min-height:30px;color:#047857;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;transition:opacity .18s}
.dl-hero__soft:hover{opacity:.75}
.dl-hero__figure{position:relative;margin:0;justify-self:end;width:100%;max-width:460px}
.dl-hero__frame{position:relative;aspect-ratio:4 / 5;overflow:hidden;background:#16231E}
.dl-hero__frame img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;filter:none}
.dl-hero__border{position:absolute;inset:-14px;border:1px solid #047857;pointer-events:none}

/* stats bar */
.dl-stats{background:var(--tint);padding-block:clamp(40px,4.5vw,56px)}
.dl-stats__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,45%),1fr));gap:1px;background:rgba(23,25,25,0.16)}
.dl-stat{background:var(--tint);padding:8px clamp(16px,2vw,28px)}
.dl-stats__grid .dl-stat:first-child{padding-left:0}
.dl-stat__num-wrap{display:flex;align-items:flex-end;min-height:64px}
.dl-stat__num{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(38px,3.8vw,54px);font-weight:800;line-height:0.9;letter-spacing:-0.04em;color:#171919}
.dl-stat__num--sm{font-size:clamp(24px,2.2vw,32px);line-height:1;letter-spacing:-0.03em}
.dl-stat__label{margin-top:12px;font-size:14px;line-height:1.4;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;color:#6A6F67}
.dl-logos{margin-top:clamp(32px,3.6vw,44px);display:flex;flex-wrap:wrap;align-items:center;gap:16px clamp(24px,3vw,44px)}
.dl-logo{font-family:var(--font-heading);font-size:18px;font-weight:700;line-height:1.1;letter-spacing:-0.01em;color:#6A6F67;white-space:nowrap}

/* audit panel — first section after the proof band, so it owns both pads */
.dl-audit{background:#F3F0E8;padding-block:clamp(56px,8vw,112px)}
.dl-audit__panel{background:var(--tint);padding:clamp(28px,4vw,64px)}
.dl-audit__grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,4.5vw,56px);align-items:stretch}
.dl-audit__aside{display:flex;flex-direction:column;justify-content:space-between}
.dl-audit__h3{margin:20px 0 0;font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1.25;letter-spacing:-0.02em;color:#171919}
.dl-audit__p{margin:16px 0 0;max-width:52ch;font-size:18px;line-height:1.6;color:#3A403A;text-wrap:pretty}
.dl-audit__note{margin:20px 0 0;max-width:44ch;font-size:15px;line-height:1.5;color:#6A6F67;text-wrap:pretty}
.dl-audit__cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:clamp(16px,1.6vw,20px)}
.dl-audit__card{background:#F3F0E8;padding:clamp(24px,2.2vw,28px);display:flex;flex-direction:column;gap:14px;border-top:3px solid #047857}
.dl-audit__card-label{font-size:12px;font-weight:700;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#047857}
.dl-audit__card-p{margin:0;font-family:var(--font-heading);font-size:20px;font-weight:750;line-height:1.25;letter-spacing:-0.02em;color:#171919;text-wrap:pretty}
.dl-audit__closing{margin:clamp(24px,2.4vw,32px) 0 0;padding-top:clamp(20px,2vw,24px);border-top:1px solid rgba(23,25,25,0.20);font-family:var(--font-heading);font-size:19px;font-weight:700;line-height:1.4;letter-spacing:-0.015em;color:#171919;text-wrap:pretty}

/* fit lists */
.dl-fit{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:1px;background:rgba(23,25,25,0.20);border:1px solid rgba(23,25,25,0.20)}
.dl-fit__col{background:#F3F0E8;padding:clamp(24px,3vw,40px)}
.dl-fit__h{margin:0 0 clamp(20px,2vw,28px);font-size:13px;font-weight:700;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#171919}
.dl-fit__list{list-style:none;display:flex;flex-direction:column;gap:16px}
.dl-fit__item{display:flex;gap:14px;font-size:17px;line-height:1.55;color:#3A403A;text-wrap:pretty}
.dl-fit__mark{flex:0 0 auto;font-size:17px;font-weight:700;line-height:1.55}
.dl-fit__mark--yes{color:#047857}
.dl-fit__mark--no{color:#171919}

/* faq */
.dl-faq{max-width:820px}
.dl-faq__h{margin:0 0 clamp(24px,2.6vw,36px);font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.5vw,52px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:#171919}
.dl-faq details{border-top:1px solid rgba(23,25,25,0.20)}
.dl-faq details:last-of-type{border-bottom:1px solid rgba(23,25,25,0.20)}
.dl-faq summary{display:flex;justify-content:space-between;align-items:baseline;gap:24px;cursor:pointer;list-style:none;padding:22px 0;font-family:var(--font-heading);font-weight:700;font-size:20px;line-height:1.4;letter-spacing:-0.015em;color:#171919}
.dl-faq summary::-webkit-details-marker{display:none}
.dl-faq summary::after{content:"+";flex-shrink:0;color:#047857;font-size:26px;line-height:1;font-weight:400}
.dl-faq details[open] summary::after{content:"\\2212"}
.dl-faq__a{padding:0 0 26px}
.dl-faq__a p{margin:0;max-width:680px;font-size:17px;line-height:1.6;color:#3A403A;text-wrap:pretty}
.dl-faq details > .dl-faq__a{animation:dlFaqIn .22s ease-out}
@keyframes dlFaqIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}

/* final cta (page-specific colour band) */
.dl-final{background:var(--final-bg);padding-block:clamp(64px,8.5vw,120px)}
.dl-final__inner{max-width:820px}
.dl-final__eyebrow{font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:var(--final-eyebrow)}
.dl-final__h{margin:20px 0 0;max-width:20ch;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.8vw,56px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:#F3F0E8;text-wrap:balance}
.dl-final__p{margin:24px 0 0;max-width:640px;font-size:18px;line-height:1.6;color:var(--final-text);text-wrap:pretty}

/* sticky mobile cta */
.dl-sticky{display:none;position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 20px calc(12px + env(safe-area-inset-bottom));background:rgba(26,28,29,0.96);border-top:1px solid rgba(243,240,232,0.16)}
.dl-sticky a{display:flex;align-items:center;justify-content:center;gap:9px;min-height:48px;background:#047857;color:#F3F0E8;font-size:15px;font-weight:600}

/* ── responsive (mirrors the reference JS breakpoints) ── */
@media (max-width:900px){
  .dl-hero__grid{grid-template-columns:1fr;gap:clamp(32px,5vw,48px)}
  .dl-hero__figure{justify-self:start;max-width:360px}
  .dl-audit__grid{grid-template-columns:1fr;gap:clamp(32px,4vw,40px)}
}
@media (max-width:560px){
  .dl-hero__h1 span{display:inline}
}
@media (max-width:680px){
  .dl-sticky{display:block}
}
`;
function OfferStyles() {
  return e('style', {
    dangerouslySetInnerHTML: {
      __html: OFFER_CSS
    }
  });
}

// ─── Atoms ───────────────────────────────────────────────────────────────────
function CtaBtn(props) {
  return e('a', {
    className: 'dl-btn',
    href: props.href,
    style: props.style
  }, e('span', null, props.label), e('span', null, '→'));
}

// ─── Sections (shared; content comes from the page config) ───────────────────
function Hero(props) {
  var c = props.cfg,
    h = c.hero;
  return e('section', {
    className: 'dl-hero'
  }, e('div', {
    className: 'dl-container dl-hero__grid'
  }, e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-eyebrow'
  }, h.eyebrow), e('h1', {
    className: 'dl-hero__h1'
  }, h.lines.map(function (l, i) {
    return e('span', {
      key: i
    }, l + ' ');
  })), e('p', {
    className: 'dl-hero__lead'
  }, h.lead), e('div', {
    className: 'dl-hero__cta-row'
  }, e(CtaBtn, {
    href: c.ctaUrl,
    label: h.cta
  })), e('p', {
    className: 'dl-hero__note'
  }, h.note), e('p', {
    className: 'dl-hero__fallback'
  }, c.freeTool ? e('a', {
    href: c.freeTool.href,
    className: 'dl-hero__soft'
  }, c.freeTool.label + ' →') : null, e('a', {
    href: START_HERE_URL,
    className: 'dl-hero__soft'
  }, 'Not sure where to start? →'))), e('figure', {
    className: 'dl-hero__figure'
  }, e('div', {
    className: 'dl-hero__frame'
  }, e('img', {
    src: c.heroPhoto,
    alt: 'Aggelos Mouzakitis',
    width: 1000,
    height: 1250,
    loading: 'eager',
    decoding: 'async',
    // Graceful fallback until the per-page hero art is uploaded to /img/.
    onError: function (ev) {
      var t = ev.target;
      if (!t.dataset.fb) {
        t.dataset.fb = '1';
        t.src = '/img/aggelos-overlap.webp';
      }
    }
  })), e('div', {
    className: 'dl-hero__border',
    'aria-hidden': 'true'
  }))));
}
function StatsBar() {
  return e('section', {
    className: 'dl-stats'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-stats__grid'
  }, STATS.map(function (s, i) {
    return e('div', {
      className: 'dl-stat',
      key: i
    }, e('div', {
      className: 'dl-stat__num-wrap'
    }, e('div', {
      className: 'dl-stat__num' + (s.small ? ' dl-stat__num--sm' : '')
    }, s.num)), e('div', {
      className: 'dl-stat__label'
    }, s.label));
  })), e('div', {
    className: 'dl-logos'
  }, LOGOS.map(function (l, i) {
    return e('span', {
      className: 'dl-logo',
      key: i
    }, l);
  }))));
}
function Audit(props) {
  var c = props.cfg,
    a = c.audit;
  return e('section', {
    className: 'dl-audit',
    id: 'audit'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-audit__panel'
  }, e('div', {
    className: 'dl-audit__grid'
  }, e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-kicker'
  }, 'THE FIRST STEP'), e('h2', {
    className: 'dl-h2'
  }, a.h2), e('h3', {
    className: 'dl-audit__h3'
  }, a.offerName), a.p.map(function (t, i) {
    return e('p', {
      className: 'dl-audit__p',
      key: i
    }, t);
  }), e(CtaBtn, {
    href: c.ctaUrl,
    label: a.cta,
    style: {
      marginTop: 32
    }
  }), e('p', {
    className: 'dl-audit__note'
  }, WORKING_CALL_NOTE)), e('div', {
    className: 'dl-col dl-audit__aside'
  }, e('div', {
    className: 'dl-audit__cards'
  }, a.cards.map(function (card, i) {
    return e('article', {
      className: 'dl-audit__card',
      key: i
    }, e('div', {
      className: 'dl-audit__card-label'
    }, card.label), e('p', {
      className: 'dl-audit__card-p'
    }, card.p));
  })), e('p', {
    className: 'dl-audit__closing'
  }, a.closing))))));
}
function FitLists(props) {
  var c = props.cfg,
    f = c.fit;
  function column(heading, items, mark) {
    return e('div', {
      className: 'dl-fit__col'
    }, e('h3', {
      className: 'dl-fit__h'
    }, heading), e('ul', {
      className: 'dl-fit__list'
    }, items.map(function (t, i) {
      return e('li', {
        className: 'dl-fit__item',
        key: i
      }, e('span', {
        className: 'dl-fit__mark dl-fit__mark--' + (mark === '✓' ? 'yes' : 'no'),
        'aria-hidden': 'true'
      }, mark), e('span', null, t));
    })));
  }
  return e('section', {
    className: 'dl-section dl-section--flush'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-fit'
  }, column(f.yesHeading, f.yes, '✓'), column(f.noHeading, f.no, '✕'))));
}
function Faq(props) {
  var c = props.cfg;
  return e('section', {
    className: 'dl-section dl-section--flush'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-faq'
  }, e('h2', {
    className: 'dl-faq__h'
  }, 'Common questions'), e('div', null, c.faq.map(function (item, i) {
    return e('details', {
      key: i
    }, e('summary', null, e('span', null, item.q)), e('div', {
      className: 'dl-faq__a'
    }, e('p', null, item.a)));
  })))));
}
function FinalCta(props) {
  var c = props.cfg,
    f = c.final;
  return e('section', {
    className: 'dl-final'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-final__inner'
  }, e('div', {
    className: 'dl-final__eyebrow'
  }, f.eyebrow), e('h2', {
    className: 'dl-final__h'
  }, f.h2), e('p', {
    className: 'dl-final__p'
  }, f.p), e(CtaBtn, {
    href: c.ctaUrl,
    label: f.cta,
    style: {
      marginTop: 36
    }
  }))));
}
function StickyCta(props) {
  var c = props.cfg;
  return e('div', {
    className: 'dl-sticky'
  }, e('a', {
    href: c.ctaUrl
  }, e('span', null, c.sticky), e('span', null, '→')));
}

// ─── Page shell ──────────────────────────────────────────────────────────────
// hero → proof band → the audit → fit / not-fit → FAQ → final CTA. The audit
// owns both of its pads because it opens the page ground; everything after it
// sits on that same ground and runs flush, so one section pad separates them.
function OfferPage(props) {
  var c = props.cfg,
    col = c.colors;
  return e(React.Fragment, null, e(window.ChromeStyles), e(OfferStyles), e(window.SiteHeader, {
    page: c.key,
    lang: 'en'
  }), e('main', {
    className: 'dl',
    style: {
      '--tint': col.tint,
      '--final-bg': col.finalBg,
      '--final-eyebrow': col.finalEyebrow,
      '--final-text': col.finalText
    }
  }, e(Hero, {
    cfg: c
  }), e(StatsBar, {
    cfg: c
  }), e(Audit, {
    cfg: c
  }), e(FitLists, {
    cfg: c
  }), e(Faq, {
    cfg: c
  }),
  // FinalCta stays inside <main> so it inherits the --final-* custom
  // properties set above; its colour band is page-specific.
  e(FinalCta, {
    cfg: c
  })), e(window.SiteFooterX, {
    lang: 'en'
  }), e(StickyCta, {
    cfg: c
  }));
}

// ─── Page configs (content + colour variation) ───────────────────────────────
var CONFIGS = {
  'career-strategy-consulting': {
    key: 'career-strategy-consulting',
    serviceName: 'Career Strategy Consulting',
    freeTool: {
      label: 'Do you want to become a solopreneur?',
      href: '/free-tools/become-a-solopreneur/'
    },
    ctaUrl: careerStrategyConsultingUrl,
    heroPhoto: '/img/experience-to-offer-hero.webp',
    sticky: 'Apply for the audit',
    colors: {
      tint: '#F3F0E8',
      finalBg: '#171919',
      finalEyebrow: '#047857',
      finalText: '#C0C9BF'
    },
    hero: {
      eyebrow: 'For experienced professionals building something of their own',
      lines: ['Keep your job.', 'Turn your experience', 'into something people', 'will pay for.'],
      lead: 'Turn what you know into a clear consulting, fractional, coaching or service offer. Test it with real buyers and build a route to paid work before you make a career leap.',
      cta: 'Find out what you could sell',
      note: 'Apply for the Experience-to-Offer Audit.'
    },
    audit: {
      h2: 'What could someone pay you for?',
      offerName: 'The Experience-to-Offer Audit',
      p: ['Apply with enough context for me to understand your experience, the problems people trust you to solve and the directions you are considering.', 'If it looks like I can help, I review your situation before we meet. During the audit, we identify the most credible offer direction, what still needs evidence and the first real-world test.'],
      cta: 'Apply for the audit',
      cards: [{
        label: 'One direction',
        p: 'The offer worth testing first'
      }, {
        label: 'One buyer',
        p: 'Who it is for and what they need'
      }, {
        label: 'One next move',
        p: 'The action that will give you evidence'
      }],
      closing: 'If the idea does not hold up, I will tell you that too.'
    },
    fit: {
      yesHeading: 'This is probably for you if',
      yes: ['You have real experience and can point to problems you have solved.', 'You want to build consulting, fractional, coaching, freelance or service income from that experience.', 'You want to test it before making a high-risk career move.', 'You are willing to speak to potential buyers and let the market challenge the idea.', 'You want direct feedback, not reassurance dressed up as coaching.'],
      noHeading: 'This is not for you if',
      no: ['You want passive income without selling or delivery.', 'You want someone else to do the customer conversations for you.', 'You plan to keep polishing until rejection is impossible.', 'You mainly want confirmation that the idea you already chose is brilliant.', 'You cannot make consistent time to execute alongside the calls.']
    },
    faq: [{
      q: 'Do I need to arrive with a business idea?',
      a: 'No. You can arrive with no idea, one vague direction or several competing ones. We start with the experience and evidence you already have, then decide what deserves testing.'
    }, {
      q: 'Is the aim to quit my job?',
      a: 'No. The aim is to create options. You keep your job while you test whether people will pay for the work. If you later choose to leave, you do it with evidence rather than hope. A smaller independent income stream may also be enough.'
    }, {
      q: 'What kinds of work can we build?',
      a: 'Usually consulting, fractional leadership, coaching, freelancing or a defined service. The label matters less than the buyer, the problem and a delivery model that fits your experience.'
    }, {
      q: 'How much time will this take alongside my job?',
      a: 'We set a realistic pace around your current role. But there is no honest version that requires no execution. If you cannot protect consistent time for conversations, testing and follow-through, this will remain an idea.'
    }],
    final: {
      eyebrow: 'Before you build the website, build the case',
      h2: 'Find out what your experience could become.',
      p: 'Apply for the audit. I will review your situation before we meet. Then we will choose the direction worth testing and the first move that produces real evidence.',
      cta: 'Find out what I could sell'
    }
  },
  'solopreneur-growth-consulting': {
    key: 'solopreneur-growth-consulting',
    serviceName: 'Solo Business Growth Consulting',
    freeTool: {
      label: "What's limiting your business?",
      href: '/free-tools/business-constraint/'
    },
    ctaUrl: solopreneurGrowthConsultingUrl,
    heroPhoto: '/img/solo-business-growth-hero.webp',
    sticky: 'Apply for the audit',
    colors: {
      tint: '#EDE8DB',
      finalBg: '#16231E',
      finalEyebrow: '#8FBFA7',
      finalText: '#EDE8DB'
    },
    hero: {
      eyebrow: 'For freelancers and independent consultants',
      lines: ['Grow your', 'solo-business', 'without grinding', 'yourself down.'],
      lead: 'Private 1:1 work on the offer, pricing, clients and decisions that move the business forward, plus the patterns in you that keep getting in the way.',
      cta: 'Find out what to do next',
      note: 'Apply for the Solo-Business Growth Audit.'
    },
    audit: {
      h2: 'What is working, what is costing you, and what should you do next?',
      offerName: 'The Solo-Business Growth Audit',
      p: ['Apply with enough context for me to understand how the business works, where you want it to go, what you have tried and what keeps getting stuck.', 'If it looks like I can help, I review your situation before we meet. During the audit, we separate the real constraint from the noise and identify the next move that matters.'],
      cta: 'Apply for the audit',
      cards: [{
        label: 'Keep',
        p: 'What is already working and deserves more attention.'
      }, {
        label: 'Fix',
        p: 'What is costing you growth, time or headroom.'
      }, {
        label: 'Do next',
        p: 'The highest-leverage decision or action in front of you.'
      }],
      closing: 'If the problem is not what you think it is, I will tell you that too.'
    },
    fit: {
      yesHeading: 'This is probably for you if:',
      yes: ['You already sell your expertise through consulting, freelancing or another solo service.', 'You want better growth, margins, clients or control of your time.', 'You are willing to look honestly at both the business and your own behaviour.', 'You want direct feedback and concrete action, not a generic framework.', 'You are ambitious and do not want to be told to lower your standards.'],
      noHeading: 'This is not for you if:',
      no: ['You want one tactic to solve the whole business.', 'You want a formula applied without examining your actual situation.', 'You want growth without changing your offer, pricing, clients or boundaries.', 'You mainly want reassurance that your current plan is right.', 'You are unwilling to make decisions and execute between calls.']
    },
    faq: [{
      q: 'Do I need an established business?',
      a: 'You should already be trading, with clients and enough real evidence to examine. The business does not need to be large or mature, but this is for improving something that already exists.'
    }, {
      q: 'What can we work on?',
      a: 'Offer, positioning, pricing, acquisition, sales, client mix, priorities, delivery and the decisions behind them. We focus on the constraint that matters now instead of trying to overhaul everything at once.'
    }, {
      q: 'Will you give me direct advice?',
      a: 'Yes. When the problem needs a tactical answer, I will give you one. When I think you are avoiding a decision, protecting a story or solving the wrong problem, I will say that too.'
    }, {
      q: 'Is the audit just a sales call?',
      a: 'No. It has a standalone outcome. You leave knowing what to keep, what to fix and what to do next, even if we never work together. If continuing makes sense, we discuss it after the work is done.'
    }],
    final: {
      eyebrow: 'The business does not need more of everything',
      h2: 'Find the move that matters now.',
      p: 'Apply for the audit. I will review your situation before we meet. Then we will decide what to keep, what to fix and what to do next.',
      cta: 'Find out what to do next'
    }
  },
  'psychotherapy-decision-coaching': {
    key: 'psychotherapy-decision-coaching',
    serviceName: 'Psychotherapy / Decision Coaching',
    freeTool: {
      label: 'Are you burned out?',
      href: '/free-tools/burned-out/'
    },
    ctaUrl: psychotherapyDecisionCoachingUrl,
    heroPhoto: '/img/private-sparring-hero.webp',
    sticky: 'Apply for the Sparring Session',
    colors: {
      tint: '#EDE8DB',
      finalBg: '#16231E',
      finalEyebrow: '#8FBFA7',
      finalText: '#EDE8DB'
    },
    hero: {
      eyebrow: 'For founders, freelancers and experienced professionals',
      lines: ['Bring the problem', 'you cannot', 'think through', 'cleanly alone.'],
      lead: 'A private, direct place to work through the decision, pressure or pattern that keeps circling. Practical when the problem is practical. Deeper when it is not.',
      cta: 'Bring me the real problem',
      note: 'Apply for a private Sparring Session.'
    },
    audit: {
      h2: 'Bring one live problem. Leave with a clearer read and one real move.',
      offerName: 'The Sparring Session',
      p: ['Apply with enough context for me to understand what is happening, why it matters now and why you have not resolved it already.', 'If it looks like I can help, I review your situation before we meet. You bring the problem as you currently see it. Together, we find the one underneath and decide what deserves your attention next.'],
      cta: 'Apply for the Sparring Session',
      cards: [{
        label: 'Name it',
        p: 'What the problem actually is.'
      }, {
        label: 'Untangle it',
        p: 'What is fact, fear, obligation or an old pattern.'
      }, {
        label: 'Move it',
        p: 'The decision, conversation or action that comes next.'
      }],
      closing: 'If your story does not add up, I will say so.'
    },
    fit: {
      yesHeading: 'This is probably for you if:',
      yes: ['You are carrying a real decision, dilemma or problem that matters now.', 'You are usually capable but cannot get a clean read on this one.', 'You need somewhere private where you do not have to perform certainty.', 'You want practical advice without leaving the psychological part outside.', 'You are willing to be honest and challenged.'],
      noHeading: 'This is not for you if:',
      no: ['You want someone else to make the decision for you.', 'You want automatic agreement or reassurance.', 'You want a generic framework applied to your life.', 'You only want to discuss the polished version of the problem.', 'You expect one conversation to erase a pattern built over years.']
    },
    faq: [{
      q: 'Is this therapy or coaching?',
      a: 'Neither cleanly. I am more direct and action-oriented than a conventional therapist, and I do not use a coaching framework for every problem. We work at the level the situation actually requires.'
    }, {
      q: 'Will you tell me what to do?',
      a: 'I will tell you what I think and challenge the parts of your reasoning that do not hold up. I will not make the decision for you.'
    }, {
      q: 'Can I bring something personal?',
      a: 'Yes. Relationships, identity, health and purpose do not remain separate from work simply because your calendar says they should. We follow the problem without losing sight of why you came.'
    }, {
      q: 'Is this confidential?',
      a: 'The work is private and governed by professional confidentiality. Any limits to confidentiality are explained clearly before we begin.'
    }],
    final: {
      eyebrow: 'If working harder was going to fix this, it probably would have by now',
      h2: 'Bring me the real problem.',
      p: 'Apply for a private Sparring Session. I will review your situation before we meet. Together, we will work out what is actually happening and the next move that belongs to you.',
      cta: 'Apply for the Sparring Session'
    }
  }
};

// ─── Mount ───────────────────────────────────────────────────────────────────
// The static <title> in each page's <head> is authoritative for SEO, so this
// does not touch document.title.
function renderOfferPage(pageId) {
  var cfg = CONFIGS[pageId];
  if (!cfg) {
    return;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(e(OfferPage, {
    cfg: cfg
  }));
}
Object.assign(window, {
  renderOfferPage: renderOfferPage,
  OFFER_CONFIGS: CONFIGS
});
