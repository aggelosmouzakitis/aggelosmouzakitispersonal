// draft-landing.jsx — DEV-ONLY draft landing pages (noindex, nofollow).
// Plain React, compiled by babel like site-chrome.jsx / content-pages.jsx.
// Loaded AFTER site-chrome.js (uses window.ChromeStyles / SiteHeader / SiteFooterX).
//
// Three offer landing pages share one set of section components; each page is a
// data-only config (copy + colour variation). Rebuilt natively from the design
// references. Real header/footer/fonts come from the production chrome.
//
// Draft routes (not in nav, sitemap or metadata):
//   /draft/experience-to-offer/   renderDraft('experience-to-offer')
//   /draft/solo-business-growth/  renderDraft('solo-business-growth')
//   /draft/private-sparring/      renderDraft('private-sparring')

var e = React.createElement;

// ─── CENTRAL PLACEHOLDER CTA DESTINATIONS (one per page) ─────────────────────
// Swap these single values for the real application URLs when the pages ship.
var experienceAuditUrl = '#';
var soloGrowthAuditUrl = '#';
var privateSparringUrl = '#';

// ─── Shared content, identical across all three pages ────────────────────────
var PHOTO = '/img/aggelos-overlap.webp'; // same grayscale 4:5 portrait as the design reference
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
var DRAFT_CSS = `
/* The shared production header can push ~4px past the viewport in the 681–768px
   band (its desktop CTA before the burger kicks in). Clip it at the root on the
   draft pages so the body never scrolls horizontally, without touching chrome. */
html{overflow-x:clip}
.dl{background:#FFFFFF;color:#282726;font-family:var(--font-body)}
.dl-container{width:min(1240px,calc(100% - 2 * clamp(20px,4vw,64px)));margin-inline:auto}

/* shared type/atoms */
.dl-eyebrow{font-size:13px;font-weight:700;line-height:1.4;letter-spacing:0.11em;text-transform:uppercase;color:#059669;max-width:34ch}
.dl-kicker{font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:#059669}
.dl-h2{margin:16px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.5vw,52px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:#181A1C;text-wrap:balance}
.dl-lead{margin:0;max-width:660px;font-size:19px;line-height:1.6;color:#282726;text-wrap:pretty}
.dl-leadwrap p + p{margin-top:16px}
.dl-col{min-width:0}
.dl-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:56px;padding:0 26px;background:#059669;color:#FFFFFF;font-size:16px;font-weight:600;letter-spacing:0.01em;transition:filter .18s,gap .18s}
.dl-btn:hover{filter:brightness(0.9);gap:13px}
.dl-textlink{display:inline-flex;align-items:center;gap:8px;min-height:44px;font-size:15px;font-weight:700;letter-spacing:0.04em;color:#059669;transition:gap .18s}
.dl-textlink:hover{gap:12px;color:#059669}

/* section shells */
.dl-section{background:#FFFFFF;padding-block:clamp(56px,8vw,112px)}
.dl-section--flush{padding-top:0}
.dl-section--tint{background:var(--tint)}
.dl-split{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:clamp(40px,4.5vw,64px);align-items:start}

/* hero */
.dl-hero{background:#FFFFFF;padding-block:clamp(48px,6vw,80px) clamp(56px,7vw,96px)}
.dl-hero__grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);align-items:center;gap:clamp(40px,4.5vw,64px)}
.dl-hero__h1{margin:16px 0 24px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(42px,5vw,72px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#181A1C;text-wrap:pretty}
.dl-hero__h1 span{display:block}
.dl-hero__lead{margin:0;max-width:660px;font-size:19px;line-height:1.6;color:#282726;text-wrap:pretty}
.dl-hero__cta-row{margin-top:32px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.dl-hero__note{margin:20px 0 0;font-size:15px;line-height:1.5;color:#5E6264}
.dl-hero__figure{position:relative;margin:0;justify-self:end;width:100%;max-width:460px}
.dl-hero__frame{position:relative;aspect-ratio:4 / 5;overflow:hidden;background:#181A1C}
.dl-hero__frame img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 18%;filter:grayscale(100%)}
.dl-hero__border{position:absolute;inset:-14px;border:1px solid #059669;pointer-events:none}

/* stats bar */
.dl-stats{background:var(--tint);padding-block:clamp(40px,4.5vw,56px)}
.dl-stats__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,45%),1fr));gap:1px;background:rgba(24,26,28,0.16)}
.dl-stat{background:var(--tint);padding:8px clamp(16px,2vw,28px)}
.dl-stats__grid .dl-stat:first-child{padding-left:0}
.dl-stat__num-wrap{display:flex;align-items:flex-end;min-height:64px}
.dl-stat__num{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(38px,3.8vw,54px);font-weight:800;line-height:0.9;letter-spacing:-0.04em;color:#181A1C}
.dl-stat__num--sm{font-size:clamp(24px,2.2vw,32px);line-height:1;letter-spacing:-0.03em}
.dl-stat__label{margin-top:12px;font-size:14px;line-height:1.4;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;color:#5E6264}
.dl-logos{margin-top:clamp(32px,3.6vw,44px);display:flex;flex-wrap:wrap;align-items:center;gap:16px clamp(24px,3vw,44px)}
.dl-logo{font-family:var(--font-heading);font-size:18px;font-weight:700;line-height:1.1;letter-spacing:-0.01em;color:#5E6264;white-space:nowrap}

/* problem cards */
.dl-problem__lead{margin:0 0 clamp(28px,3vw,40px)}
.dl-cards4{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:1px;background:rgba(24,26,28,0.16);border:1px solid rgba(24,26,28,0.16)}
.dl-card{background:#FFFFFF;padding:clamp(24px,2.4vw,32px);display:flex;flex-direction:column;gap:12px}
.dl-card__num{font-family:var(--font-heading);font-size:14px;font-weight:800;line-height:1;letter-spacing:0.02em;color:#059669}
.dl-card__h{margin:0;font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1.2;letter-spacing:-0.02em;color:#181A1C}
.dl-card__p{margin:0;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}

/* path timeline */
.dl-path{margin-top:clamp(48px,6vw,80px);display:grid;grid-template-columns:repeat(5,minmax(0,1fr))}
.dl-path__step{position:relative;border-top:1px solid rgba(24,26,28,0.30);padding:22px clamp(12px,1.6vw,20px) 0 0}
.dl-path__step--last{border-top-color:#059669}
.dl-path__dot{position:absolute;left:0;top:0;width:9px;height:9px;border-radius:50%;background:#181A1C;transform:translate(-50%,-50%)}
.dl-path__step--last .dl-path__dot{width:13px;height:13px;background:#059669}
.dl-path__label{font-family:var(--font-heading);font-size:17px;font-weight:700;line-height:1.25;letter-spacing:-0.01em;color:#181A1C}
.dl-path__step--last .dl-path__label{font-weight:800;color:#059669}

/* problem closing statement */
.dl-statement{margin:clamp(40px,4.5vw,56px) 0 0;max-width:26ch;font-family:var(--font-heading);font-size:clamp(22px,2.2vw,28px);font-weight:750;line-height:1.25;letter-spacing:-0.025em;color:#181A1C;text-wrap:pretty}
.dl-statement__sub{margin:12px 0 0;max-width:660px;font-size:18px;line-height:1.6;color:#282726;text-wrap:pretty}

/* audit panel */
.dl-audit{background:#FFFFFF;padding-block:0 clamp(56px,8vw,112px)}
.dl-audit__panel{background:var(--tint);padding:clamp(28px,4vw,64px)}
.dl-audit__grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,4.5vw,56px);align-items:start}
.dl-audit__h3{margin:20px 0 0;font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1.25;letter-spacing:-0.02em;color:#181A1C}
.dl-audit__p{margin:16px 0 0;max-width:52ch;font-size:18px;line-height:1.6;color:#282726;text-wrap:pretty}
.dl-audit__note{margin:20px 0 0;max-width:44ch;font-size:15px;line-height:1.5;color:#5E6264;text-wrap:pretty}
.dl-audit__cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr));gap:clamp(16px,1.6vw,20px)}
.dl-audit__card{background:#FFFFFF;padding:clamp(24px,2.2vw,28px);display:flex;flex-direction:column;gap:14px;border-top:3px solid #059669}
.dl-audit__card-label{font-size:12px;font-weight:700;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#059669}
.dl-audit__card-p{margin:0;font-family:var(--font-heading);font-size:20px;font-weight:750;line-height:1.25;letter-spacing:-0.02em;color:#181A1C;text-wrap:pretty}
.dl-audit__closing{margin:clamp(24px,2.4vw,32px) 0 0;padding-top:clamp(20px,2vw,24px);border-top:1px solid rgba(24,26,28,0.20);font-family:var(--font-heading);font-size:19px;font-weight:700;line-height:1.4;letter-spacing:-0.015em;color:#181A1C;text-wrap:pretty}

/* process steps + panels */
.dl-steps{margin-top:clamp(40px,5vw,72px);border-top:1px solid rgba(24,26,28,0.20);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));column-gap:clamp(16px,2vw,24px)}
.dl-step{padding:clamp(20px,2.2vw,28px) clamp(16px,2vw,24px) clamp(24px,2.4vw,32px) 0}
.dl-step__num{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(44px,4.4vw,64px);font-weight:800;line-height:0.9;letter-spacing:-0.05em;color:#181A1C}
.dl-step__h{margin:16px 0 10px;font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1.2;letter-spacing:-0.02em;color:#181A1C}
.dl-step__p{margin:0;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}
.dl-panels{margin-top:clamp(32px,4vw,56px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:1px;background:rgba(24,26,28,0.20);border:1px solid rgba(24,26,28,0.20)}
.dl-panel{background:#FFFFFF;padding:clamp(24px,2.8vw,36px)}
.dl-panel__label{font-size:12px;font-weight:700;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#059669}
.dl-panel__p{margin:16px 0 0;font-family:var(--font-heading);font-size:20px;font-weight:700;line-height:1.35;letter-spacing:-0.02em;color:#181A1C;text-wrap:pretty}
.dl-process__close{margin-top:clamp(24px,2.4vw,32px)}
.dl-process__close p{margin:0;max-width:660px;font-size:18px;line-height:1.6;color:#282726;text-wrap:pretty}
.dl-process__close p + p{margin-top:16px}

/* why me */
.dl-why__cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:clamp(16px,1.8vw,24px)}
.dl-why__card{background:#FFFFFF;padding:clamp(24px,2.4vw,32px);display:flex;flex-direction:column;gap:14px}
.dl-why__head{display:flex;align-items:baseline;gap:8px}
.dl-why__num{font-family:var(--font-heading);font-size:22px;font-weight:800;line-height:1;letter-spacing:-0.03em;color:#059669}
.dl-why__tag{font-family:var(--font-heading);font-size:13px;font-weight:700;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:#059669}
.dl-why__rule{height:1px;background:rgba(24,26,28,0.24)}
.dl-why__p{margin:0;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}
.dl-why__close{margin:clamp(24px,2.4vw,32px) 0 0;max-width:660px;font-size:18px;line-height:1.6;color:#282726;text-wrap:pretty}

/* fit lists */
.dl-fit{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:1px;background:rgba(24,26,28,0.20);border:1px solid rgba(24,26,28,0.20)}
.dl-fit__col{background:#FFFFFF;padding:clamp(24px,3vw,40px)}
.dl-fit__h{margin:0 0 clamp(20px,2vw,28px);font-size:13px;font-weight:700;line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:#181A1C}
.dl-fit__list{list-style:none;display:flex;flex-direction:column;gap:16px}
.dl-fit__item{display:flex;gap:14px;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}
.dl-fit__mark{flex:0 0 auto;font-size:17px;font-weight:700;line-height:1.55}
.dl-fit__mark--yes{color:#059669}
.dl-fit__mark--no{color:#181A1C}

/* how it starts */
.dl-hows{margin-top:clamp(28px,3vw,40px);border-top:1px solid rgba(24,26,28,0.20);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));column-gap:clamp(20px,2.6vw,32px)}
.dl-how{padding:clamp(20px,2.2vw,28px) clamp(16px,2vw,24px) clamp(24px,2.4vw,32px) 0}
.dl-how__num{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(40px,4vw,56px);font-weight:800;line-height:0.9;letter-spacing:-0.05em;color:#181A1C}
.dl-how__h{margin:16px 0 10px;font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1.2;letter-spacing:-0.02em;color:#181A1C}
.dl-how__p{margin:0;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}

/* faq */
.dl-faq{max-width:820px}
.dl-faq__h{margin:0 0 clamp(24px,2.6vw,36px);font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.5vw,52px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:#181A1C}
.dl-faq details{border-top:1px solid rgba(24,26,28,0.20)}
.dl-faq details:last-of-type{border-bottom:1px solid rgba(24,26,28,0.20)}
.dl-faq summary{display:flex;justify-content:space-between;align-items:baseline;gap:24px;cursor:pointer;list-style:none;padding:22px 0;font-family:var(--font-heading);font-weight:700;font-size:20px;line-height:1.4;letter-spacing:-0.015em;color:#181A1C}
.dl-faq summary::-webkit-details-marker{display:none}
.dl-faq summary::after{content:"+";flex-shrink:0;color:#059669;font-size:26px;line-height:1;font-weight:400}
.dl-faq details[open] summary::after{content:"\\2212"}
.dl-faq__a{padding:0 0 26px}
.dl-faq__a p{margin:0;max-width:680px;font-size:17px;line-height:1.6;color:#282726;text-wrap:pretty}
.dl-faq details > .dl-faq__a{animation:dlFaqIn .22s ease-out}
@keyframes dlFaqIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}

/* final cta (page-specific colour band) */
.dl-final{background:var(--final-bg);padding-block:clamp(64px,8.5vw,120px)}
.dl-final__inner{max-width:820px}
.dl-final__eyebrow{font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:var(--final-eyebrow)}
.dl-final__h{margin:20px 0 0;max-width:20ch;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(32px,3.8vw,56px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:#FFFFFF;text-wrap:balance}
.dl-final__p{margin:24px 0 0;max-width:640px;font-size:18px;line-height:1.6;color:var(--final-text);text-wrap:pretty}

/* sticky mobile cta */
.dl-sticky{display:none;position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 20px calc(12px + env(safe-area-inset-bottom));background:rgba(26,28,29,0.96);border-top:1px solid rgba(243,240,232,0.16)}
.dl-sticky a{display:flex;align-items:center;justify-content:center;gap:9px;min-height:48px;background:#059669;color:#FFFFFF;font-size:15px;font-weight:600}

/* ── responsive (mirrors the reference JS breakpoints) ── */
@media (max-width:900px){
  .dl-hero__grid{grid-template-columns:1fr;gap:clamp(32px,5vw,48px)}
  .dl-hero__figure{justify-self:start;max-width:360px}
  .dl-split{grid-template-columns:1fr;gap:clamp(28px,4vw,40px)}
  .dl-audit__grid{grid-template-columns:1fr;gap:clamp(32px,4vw,40px)}
}
@media (max-width:560px){
  .dl-hero__h1 span{display:inline}
  .dl-path{grid-template-columns:1fr}
  .dl-path__step{border-top:0;border-left:1px solid rgba(24,26,28,0.30);padding:0 0 24px 22px}
  .dl-path__step--last{border-left-color:#059669}
  .dl-path__dot{top:10px}
}
@media (max-width:680px){
  .dl-sticky{display:block}
}
`;
function DraftStyles() {
  return e('style', {
    dangerouslySetInnerHTML: {
      __html: DRAFT_CSS
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
function TextLink(props) {
  return e('a', {
    className: 'dl-textlink',
    href: props.href
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
  }, h.note)), e('figure', {
    className: 'dl-hero__figure'
  }, e('div', {
    className: 'dl-hero__frame'
  }, e('img', {
    src: PHOTO,
    alt: 'Aggelos Mouzakitis',
    width: 250,
    height: 426,
    loading: 'eager',
    decoding: 'async'
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
function PathTimeline(props) {
  var steps = props.steps;
  return e('div', {
    className: 'dl-path'
  }, steps.map(function (s, i) {
    var last = i === steps.length - 1;
    return e('div', {
      className: 'dl-path__step' + (last ? ' dl-path__step--last' : ''),
      key: i
    }, e('span', {
      className: 'dl-path__dot',
      'aria-hidden': 'true'
    }), e('div', {
      className: 'dl-path__label'
    }, s));
  }));
}
function Problem(props) {
  var c = props.cfg,
    p = c.problem;
  return e('section', {
    className: 'dl-section'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-split'
  }, e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-kicker'
  }, p.kicker), e('h2', {
    className: 'dl-h2'
  }, p.h2)), e('div', {
    className: 'dl-col'
  }, e('p', {
    className: 'dl-lead dl-problem__lead'
  }, p.lead), e('div', {
    className: 'dl-cards4'
  }, p.cards.map(function (card, i) {
    return e('article', {
      className: 'dl-card',
      key: i
    }, e('div', {
      className: 'dl-card__num'
    }, card.n), e('h3', {
      className: 'dl-card__h'
    }, card.h), e('p', {
      className: 'dl-card__p'
    }, card.p));
  })))), e(PathTimeline, {
    steps: p.path
  }), e('p', {
    className: 'dl-statement'
  }, p.statement), e('p', {
    className: 'dl-statement__sub'
  }, p.statementSub)));
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
  }, 'START HERE'), e('h2', {
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
    className: 'dl-col'
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
function Process(props) {
  var c = props.cfg,
    pr = c.process;
  return e('section', {
    className: 'dl-section dl-section--flush'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-split'
  }, e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-kicker'
  }, pr.kicker), e('h2', {
    className: 'dl-h2'
  }, pr.h2)), e('div', {
    className: 'dl-col dl-leadwrap'
  }, pr.lead.map(function (t, i) {
    return e('p', {
      className: 'dl-lead',
      key: i
    }, t);
  }))), e('div', {
    className: 'dl-steps'
  }, pr.steps.map(function (s, i) {
    return e('div', {
      className: 'dl-step',
      key: i
    }, e('div', {
      className: 'dl-step__num'
    }, s.n), e('h3', {
      className: 'dl-step__h'
    }, s.h), e('p', {
      className: 'dl-step__p'
    }, s.p));
  })), e('div', {
    className: 'dl-panels'
  }, pr.panels.map(function (pn, i) {
    return e('div', {
      className: 'dl-panel',
      key: i
    }, e('div', {
      className: 'dl-panel__label'
    }, pn.label), e('p', {
      className: 'dl-panel__p'
    }, pn.p));
  })), e('div', {
    className: 'dl-process__close'
  }, pr.close.map(function (t, i) {
    return e('p', {
      key: i
    }, t);
  }))));
}
function WhyMe(props) {
  var c = props.cfg,
    w = c.why;
  return e('section', {
    className: 'dl-section dl-section--tint'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-split'
  }, e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-kicker'
  }, 'WHY ME'), e('h2', {
    className: 'dl-h2'
  }, w.h2)), e('div', {
    className: 'dl-col'
  }, e('div', {
    className: 'dl-why__cards'
  }, w.cards.map(function (card, i) {
    return e('article', {
      className: 'dl-why__card',
      key: i
    }, e('div', {
      className: 'dl-why__head'
    }, e('span', {
      className: 'dl-why__num'
    }, card.n + ' /'), e('span', {
      className: 'dl-why__tag'
    }, card.tag)), e('div', {
      className: 'dl-why__rule'
    }), e('p', {
      className: 'dl-why__p'
    }, card.p));
  })), e('p', {
    className: 'dl-why__close'
  }, w.close), e(TextLink, {
    href: '/about/',
    label: 'More about me'
  })))));
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
    className: 'dl-section'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-fit'
  }, column(f.yesHeading, f.yes, '✓'), column(f.noHeading, f.no, '✕'))));
}
function HowItStarts(props) {
  var c = props.cfg,
    h = c.how;
  return e('section', {
    className: 'dl-section dl-section--flush',
    id: 'how-it-starts'
  }, e('div', {
    className: 'dl-container'
  }, e('div', {
    className: 'dl-kicker'
  }, 'HOW IT STARTS'), e('div', {
    className: 'dl-hows'
  }, h.steps.map(function (s, i) {
    return e('div', {
      className: 'dl-how',
      key: i
    }, e('div', {
      className: 'dl-how__num'
    }, s.n), e('h3', {
      className: 'dl-how__h'
    }, s.h), e('p', {
      className: 'dl-how__p'
    }, s.p));
  })), e(CtaBtn, {
    href: c.ctaUrl,
    label: h.cta,
    style: {
      marginTop: 'clamp(28px,3vw,40px)'
    }
  })));
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
function DraftLandingPage(props) {
  var c = props.cfg,
    col = c.colors;
  return e(React.Fragment, null, e(window.ChromeStyles), e(DraftStyles), e(window.SiteHeader, {
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
  }), e(Problem, {
    cfg: c
  }), e(Audit, {
    cfg: c
  }), e(Process, {
    cfg: c
  }), e(WhyMe, {
    cfg: c
  }), e(FitLists, {
    cfg: c
  }), e(HowItStarts, {
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
  'experience-to-offer': {
    key: 'experience-to-offer',
    title: 'DRAFT — Experience to Offer Audit',
    ctaUrl: experienceAuditUrl,
    sticky: 'Apply for the audit',
    colors: {
      tint: '#F4F1EA',
      finalBg: '#181A1C',
      finalEyebrow: '#059669',
      finalText: '#C2C6CA'
    },
    hero: {
      eyebrow: 'For experienced professionals building something of their own',
      lines: ['Keep your job.', 'Turn your experience', 'into something people', 'will pay for.'],
      lead: 'Turn what you know into a clear consulting, fractional, coaching or service offer. Test it with real buyers and build a route to paid work before you make a career leap.',
      cta: 'Find out what you could sell',
      note: 'Apply for the Experience-to-Offer Audit.'
    },
    problem: {
      kicker: 'The problem',
      h2: 'You have experience. You do not have an offer yet.',
      lead: 'Inside a company, your title and reputation explain your value. Outside it, a buyer needs to understand what you solve and why it is worth paying for.',
      cards: [{
        n: '01',
        h: 'Too many directions',
        p: 'Consulting, fractional work, coaching, freelancing. Several plausible options, and the fear of choosing the wrong one keeps you circling.'
      }, {
        n: '02',
        h: 'Hard to explain',
        p: 'People who have worked with you know your value. Everyone else sees a broad career history.'
      }, {
        n: '03',
        h: 'Planning instead of testing',
        p: 'You keep refining the idea, website or qualifications, trying to remove the risk before putting it in front of buyers.'
      }, {
        n: '04',
        h: 'Too risky to leap',
        p: 'You want something of your own, but quitting before you know whether anyone will pay would be reckless.'
      }],
      path: ['Your experience', 'A valuable problem', 'A specific buyer', 'A testable offer', 'Paid work'],
      statement: 'You do not need to resign to create urgency.',
      statementSub: 'You need to build evidence while your salary still gives you options.'
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
    process: {
      kicker: 'If there is something worth building',
      h2: 'We turn it into a tested offer.',
      lead: ['If the audit uncovers a credible direction, we can continue privately. We agree on one outcome and a realistic timeframe.'],
      steps: [{
        n: '01',
        h: 'Position it',
        p: 'The buyer, the problem and why your experience matters outside your job title.'
      }, {
        n: '02',
        h: 'Package it',
        p: 'The outcome, scope, delivery, price and proof.'
      }, {
        n: '03',
        h: 'Test it',
        p: 'Real conversations and market tests with people who might buy.'
      }, {
        n: '04',
        h: 'Sell it',
        p: 'A practical route to the first client and then the next one.'
      }],
      panels: [{
        label: 'The business',
        p: 'Offer, positioning, pricing, customer research, sales and client acquisition.'
      }, {
        label: 'You',
        p: 'Visibility, rejection, perfectionism, approval, identity and the discomfort of being a beginner again.'
      }],
      close: ['Sometimes the offer is weak. Sometimes you are avoiding finding out. We work out which problem is actually in front of us.']
    },
    why: {
      h2: 'I did the work before I started selling advice.',
      cards: [{
        n: '01',
        tag: 'Business',
        p: 'Seven years running my own growth consultancy. Work with more than 100 technology companies. Two startups built. Neither went well.'
      }, {
        n: '02',
        tag: 'Career',
        p: 'Eighteen years in product and growth. A career built abroad. I still work at IBM while building my own practice.'
      }, {
        n: '03',
        tag: 'Psychology',
        p: 'MSc Integrative Counselling & Psychotherapy, Graduate Certificate in Psychology, supervised practice and BACP registration.'
      }],
      close: 'A weak offer needs commercial work. A credible offer you keep avoiding needs something else. You do not have to choose between the two.'
    },
    fit: {
      yesHeading: 'This is probably for you if',
      yes: ['You have real experience and can point to problems you have solved.', 'You want to build consulting, fractional, coaching, freelance or service income from that experience.', 'You want to test it before making a high-risk career move.', 'You are willing to speak to potential buyers and let the market challenge the idea.', 'You want direct feedback, not reassurance dressed up as coaching.'],
      noHeading: 'This is not for you if',
      no: ['You want passive income without selling or delivery.', 'You want someone else to do the customer conversations for you.', 'You plan to keep polishing until rejection is impossible.', 'You mainly want confirmation that the idea you already chose is brilliant.', 'You cannot make consistent time to execute alongside the calls.']
    },
    how: {
      steps: [{
        n: '1',
        h: 'Apply for the audit',
        p: 'Tell me what you have done, what people trust you for, what you are considering and what has stopped you so far. Polished answers are less useful than honest ones.'
      }, {
        n: '2',
        h: 'Get the audit',
        p: 'I come prepared. We identify the strongest direction, the missing evidence and the next market test.'
      }, {
        n: '3',
        h: 'Continue only if it makes sense',
        p: 'If there is a credible direction and I am the right person to help you build it, I will explain what ongoing 1:1 work could look like. There is no obligation to continue.'
      }],
      cta: 'Apply for the Experience-to-Offer Audit'
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
      q: 'What if I already have one or two clients?',
      a: 'That can still be a fit. A few introductions prove that somebody may buy. They do not automatically give you a clear offer or a repeatable way to find the next client.'
    }, {
      q: 'Is this career coaching?',
      a: 'Not in the conventional CV, interview and job-search sense. We are building independent paid work. Career questions may become part of it because the offer changes your options and can challenge how you see yourself professionally.'
    }, {
      q: 'Is this business coaching or therapy?',
      a: 'Neither cleanly. I will have an opinion on the offer, pricing and route to market. If fear, approval or identity is shaping the execution, we can work there too. The business remains part of the work.'
    }, {
      q: 'What if I know what to do but keep postponing it?',
      a: 'Then more information is probably not the answer. We work out whether the hesitation is useful caution, fear of exposure, a need to make the idea risk-free or evidence that you do not actually want this version of it. Those require different moves.'
    }, {
      q: 'How much time will this take alongside my job?',
      a: 'We set a realistic pace around your current role. But there is no honest version that requires no execution. If you cannot protect consistent time for conversations, testing and follow-through, this will remain an idea.'
    }, {
      q: 'Will you find clients for me?',
      a: 'No. I help you identify the buyer, package the offer, build the route to market and improve it using evidence. You still have to have the conversations, make the ask and deliver the work.'
    }, {
      q: 'Is the audit just a sales call?',
      a: 'No. It has a standalone outcome. You leave with a direction to test, the assumptions that need evidence and a concrete next move, even if we never work together. If continuing makes sense, we discuss it after the work is done.'
    }],
    final: {
      eyebrow: 'Before you build the website, build the case',
      h2: 'Find out what your experience could become.',
      p: 'Apply for the audit. I will review your situation before we meet. Then we will choose the direction worth testing and the first move that produces real evidence.',
      cta: 'Find out what I could sell'
    }
  },
  'solo-business-growth': {
    key: 'solo-business-growth',
    title: 'DRAFT — Solo Business Growth',
    ctaUrl: soloGrowthAuditUrl,
    sticky: 'Apply for the audit',
    colors: {
      tint: '#E7F2EC',
      finalBg: '#123A31',
      finalEyebrow: '#5FD1A3',
      finalText: '#D7E7E0'
    },
    hero: {
      eyebrow: 'For consultants, solopreneurs and freelancers',
      lines: ['Grow your', 'solo-business', 'without grinding', 'yourself down.'],
      lead: 'Private 1:1 work on the offer, pricing, clients and decisions that move the business forward, plus the patterns in you that keep getting in the way.',
      cta: 'Find out what to do next',
      note: 'Apply for the Solo-Business Growth Audit.'
    },
    problem: {
      kicker: 'The problem',
      h2: 'You do good work. The business around it is harder to run.',
      lead: 'When you work alone, commercial problems and personal patterns collide quickly. What looks like a marketing or growth problem may be weak positioning, avoidance, or both.',
      cards: [{
        n: '01',
        h: 'Scattered effort',
        p: 'Too many services, ideas and priorities compete for your attention. You stay busy without knowing what is actually moving the business.'
      }, {
        n: '02',
        h: 'Weak economics',
        p: 'You undercharge, accept the wrong clients or sell work that leaves too little margin and too much delivery.'
      }, {
        n: '03',
        h: 'Everything depends on you',
        p: 'Sales, delivery and every important decision come back to you. More growth currently means more pressure.'
      }, {
        n: '04',
        h: 'Thinking replaces action',
        p: 'You keep refining the plan. The difficult conversation, price increase or sales ask moves to next week.'
      }],
      path: ['The real problem', 'The right priority', 'Decisive action', 'Better economics', 'Sustainable growth'],
      statement: 'You do not need more activity.',
      statementSub: 'You need to find what is actually limiting the business and deal with it.'
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
    process: {
      kicker: 'If there is more to work on',
      h2: 'We work on the business and the person running it.',
      lead: ['If the audit surfaces a meaningful outcome and we are a good fit, we can continue privately. We agree on what needs to change and work on the commercial and personal parts together.'],
      steps: [{
        n: '01',
        h: 'Diagnose it',
        p: 'Find the actual constraint: offer, demand, pricing, client mix, delivery or decision-making.'
      }, {
        n: '02',
        h: 'Prioritise it',
        p: 'Choose the few moves that matter and cut the work that adds noise rather than growth.'
      }, {
        n: '03',
        h: 'Execute it',
        p: 'Make the decisions, have the conversations and run the experiments the business needs.'
      }, {
        n: '04',
        h: 'Make it hold',
        p: 'Build a business that can grow without every problem landing back on you.'
      }],
      panels: [{
        label: 'The business',
        p: 'Offer, positioning, pricing, acquisition, sales, client mix, priorities and delivery.'
      }, {
        label: 'You',
        p: 'Avoidance, rejection, control, approval, boundaries, money, uncertainty and overwork.'
      }],
      close: ['Fixing the inside while the pipeline dries up is useless. Pushing the business while the same pattern keeps undermining it is exhausting.', 'We work out which side the problem actually needs.']
    },
    why: {
      h2: 'I did the work before I started selling advice.',
      cards: [{
        n: '01',
        tag: 'Business',
        p: 'Seven years running my own growth consultancy. Work with more than 100 technology companies. Two startups built. Neither went well.'
      }, {
        n: '02',
        tag: 'Operator',
        p: 'Eighteen years in product and growth. A career built abroad. I still work at IBM while building my own practice.'
      }, {
        n: '03',
        tag: 'Psychology',
        p: 'MSc Integrative Counselling & Psychotherapy, Graduate Certificate in Psychology, supervised practice and BACP registration.'
      }],
      close: 'A growth problem needs commercial judgement. A pattern in the person running the business needs different depth. You get both.'
    },
    fit: {
      yesHeading: 'This is probably for you if:',
      yes: ['You already sell your expertise through consulting, freelancing or another solo service.', 'You want better growth, margins, clients or control of your time.', 'You are willing to look honestly at both the business and your own behaviour.', 'You want direct feedback and concrete action, not a generic framework.', 'You are ambitious and do not want to be told to lower your standards.'],
      noHeading: 'This is not for you if:',
      no: ['You want one tactic to solve the whole business.', 'You want a formula applied without examining your actual situation.', 'You want growth without changing your offer, pricing, clients or boundaries.', 'You mainly want reassurance that your current plan is right.', 'You are unwilling to make decisions and execute between calls.']
    },
    how: {
      steps: [{
        n: '1',
        h: 'Apply for the audit',
        p: 'Tell me how the business works, where you want it to go, what you have tried and what keeps getting stuck. Polished answers are less useful than honest ones.'
      }, {
        n: '2',
        h: 'Get the audit',
        p: 'I come prepared. We identify what is working, the real constraint and the next move that deserves your attention.'
      }, {
        n: '3',
        h: 'Continue only if it makes sense',
        p: 'If there is a meaningful outcome to work on and I am the right person to help, I will explain what ongoing 1:1 work could look like. There is no obligation to continue.'
      }],
      cta: 'Apply for the Solo-Business Growth Audit'
    },
    faq: [{
      q: 'Do I need an established business?',
      a: 'You should already be trading, with clients and enough real evidence to examine. The business does not need to be large or mature, but this is for improving something that already exists.'
    }, {
      q: 'What can we work on?',
      a: 'Offer, positioning, pricing, acquisition, sales, client mix, priorities, delivery and the decisions behind them. We focus on the constraint that matters now instead of trying to overhaul everything at once.'
    }, {
      q: 'Is this growth consulting?',
      a: 'Yes, but not only. The business outcome leads the work. When avoidance, approval, control or fear is interfering with execution, we work there too.'
    }, {
      q: 'Is this business coaching or therapy?',
      a: 'Neither cleanly. I will have an opinion on the offer, pricing, acquisition and priorities. If the same personal pattern keeps undoing good decisions, we can work at that depth without losing sight of the business.'
    }, {
      q: 'What if I already know what to do but I am not doing it?',
      a: 'Then more information is probably not the answer. We work out whether the blockage is fear of exposure, a need for approval, overthinking, exhaustion, or evidence that the plan itself is wrong. Those require different moves.'
    }, {
      q: 'Will you give me direct advice?',
      a: 'Yes. When the problem needs a tactical answer, I will give you one. When I think you are avoiding a decision, protecting a story or solving the wrong problem, I will say that too.'
    }, {
      q: 'What if the business is doing well but I am exhausted?',
      a: 'That is still a business problem. We look at what depends on you, which clients and work are worth keeping, and where control, boundaries or approval are making the model harder to sustain.'
    }, {
      q: 'Is the audit just a sales call?',
      a: 'No. It has a standalone outcome. You leave knowing what to keep, what to fix and what to do next, even if we never work together. If continuing makes sense, we discuss it after the work is done.'
    }, {
      q: 'What happens after the audit?',
      a: 'You can take the diagnosis and next move away. If the audit surfaces a meaningful outcome and we are a strong fit, I can also explain what ongoing 1:1 work could look like. Continuing is optional.'
    }],
    final: {
      eyebrow: 'The business does not need more of everything',
      h2: 'Find the move that matters now.',
      p: 'Apply for the audit. I will review your situation before we meet. Then we will decide what to keep, what to fix and what to do next.',
      cta: 'Find out what to do next'
    }
  },
  'private-sparring': {
    key: 'private-sparring',
    title: 'DRAFT — Private Sparring',
    ctaUrl: privateSparringUrl,
    sticky: 'Apply for the Sparring Session',
    colors: {
      tint: '#E8EEF0',
      finalBg: '#20363A',
      finalEyebrow: '#76D5B2',
      finalText: '#D9E4E5'
    },
    hero: {
      eyebrow: 'For founders, solopreneurs and experienced professionals',
      lines: ['Bring the problem', 'you cannot', 'think through', 'cleanly alone.'],
      lead: 'A private, direct place to work through the decision, pressure or pattern that keeps circling. Practical when the problem is practical. Deeper when it is not.',
      cta: 'Bring me the real problem',
      note: 'Apply for a private Sparring Session.'
    },
    problem: {
      kicker: 'When you are too close to it',
      h2: 'You cannot get a clean read anymore.',
      lead: 'When a problem touches your identity, reputation or future, intelligence stops guaranteeing clarity. You can build an excellent case for every option and remain exactly where you are.',
      cards: [{
        n: '01',
        h: 'The decision keeps circling',
        p: 'You revisit the same options without moving. Each carries a risk, a loss or someone you might disappoint, so none feels safe enough to choose.'
      }, {
        n: '02',
        h: 'The drive has disappeared',
        p: 'Things may still look successful from the outside, but you are going through the motions. You cannot tell whether to repair the path or leave it.'
      }, {
        n: '03',
        h: 'There is nowhere to put the pressure',
        p: 'Your team, clients, colleagues or family depend on you. You have people around you, but nobody you can tell the whole truth to.'
      }, {
        n: '04',
        h: 'The same pattern keeps returning',
        p: 'A new situation triggers an old response. Prove yourself. Keep everyone happy. Control everything. Avoid the risk. Work harder.'
      }],
      path: ['What happened', 'What is driving it', 'What you actually want', 'The honest decision', 'The next move'],
      statement: 'You may need advice. You may need deeper work.',
      statementSub: 'First, you need an accurate read.'
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
    process: {
      kicker: 'If there is more to work on',
      h2: 'We work at the level the problem needs.',
      lead: ['If the session exposes a larger transition or a pattern that will not shift through one decision, we can continue privately.', 'We agree on one concrete outcome and work on the practical situation and the person living through it.'],
      steps: [{
        n: '01',
        h: 'See it clearly',
        p: 'Separate what is happening now from the meaning, fear and history attached to it.'
      }, {
        n: '02',
        h: 'Find the pattern',
        p: 'Understand why this keeps returning, what the pattern protects and what it costs you.'
      }, {
        n: '03',
        h: 'Act on it',
        p: 'Make the decision, have the conversation, set the boundary or change direction.'
      }, {
        n: '04',
        h: 'Make the change hold',
        p: 'Build a different response that survives the next period of pressure, uncertainty or self-doubt.'
      }],
      panels: [{
        label: 'What is in front of you',
        p: 'A career move, business decision, conflict, loss of motivation, difficult conversation or change of direction.'
      }, {
        label: 'What is underneath it',
        p: 'Anxiety, self-criticism, imposter feelings, approval, control, avoidance or an identity built around performance.'
      }],
      close: ['Sometimes the answer is a practical move. Sometimes it needs proper therapeutic work.', 'Often both are tangled together, and the first job is telling them apart.']
    },
    why: {
      h2: 'You will not have to translate one world into the other.',
      cards: [{
        n: '01',
        tag: 'Business',
        p: 'Eighteen years in product and growth. Seven running my own consultancy and working with more than 100 technology companies. Two startups built. Neither went well.'
      }, {
        n: '02',
        tag: 'Career',
        p: 'I built my career abroad through roles in product and growth. I still work at IBM while building my own practice.'
      }, {
        n: '03',
        tag: 'Psychology',
        p: 'MSc Integrative Counselling & Psychotherapy, Graduate Certificate in Psychology, supervised practice and BACP registration.'
      }],
      close: 'I understand the professional context quickly. I do not turn every problem into psychology. You will get an opinion.'
    },
    fit: {
      yesHeading: 'This is probably for you if:',
      yes: ['You are carrying a real decision, dilemma or problem that matters now.', 'You are usually capable but cannot get a clean read on this one.', 'You need somewhere private where you do not have to perform certainty.', 'You want practical advice without leaving the psychological part outside.', 'You are willing to be honest and challenged.'],
      noHeading: 'This is not for you if:',
      no: ['You want someone else to make the decision for you.', 'You want automatic agreement or reassurance.', 'You want a generic framework applied to your life.', 'You only want to discuss the polished version of the problem.', 'You expect one conversation to erase a pattern built over years.']
    },
    how: {
      steps: [{
        n: '1',
        h: 'Complete the needs questionnaire',
        p: 'Tell me what is happening, why it matters now and what you have tried. Polished answers are less useful than honest ones.'
      }, {
        n: '2',
        h: 'Have the Sparring Session',
        p: 'You bring the problem as you see it. We find what is underneath it. You leave with a clearer read and one real move.'
      }, {
        n: '3',
        h: 'Continue only if it makes sense',
        p: 'If the session reveals a larger transition or recurring pattern, I will explain what ongoing 1:1 work could look like. Continuing is optional.'
      }],
      cta: 'Apply for the Sparring Session'
    },
    faq: [{
      q: 'What can I bring to the session?',
      a: 'A career decision, business dilemma, cofounder or client conflict, difficult conversation, loss of motivation, anxiety, imposter feelings or a general sense that something is no longer right. Bring the issue that is taking up the most space now.'
    }, {
      q: 'What if I cannot explain what the problem is?',
      a: 'You do not need a diagnosis or a perfectly framed question. “Something feels wrong and I cannot work out what” is enough to begin.'
    }, {
      q: 'Is this only for founders?',
      a: 'No. It is for founders, solopreneurs and experienced professionals dealing with problems where work, ambition and personal psychology overlap.'
    }, {
      q: 'Is this therapy or coaching?',
      a: 'Neither cleanly. I am more direct and action-oriented than a conventional therapist, and I do not use a coaching framework for every problem. We work at the level the situation actually requires.'
    }, {
      q: 'Will you tell me what to do?',
      a: 'I will tell you what I think and challenge the parts of your reasoning that do not hold up. I will not make the decision for you.'
    }, {
      q: 'Can we work on anxiety, imposter syndrome or lost motivation?',
      a: 'Yes. We do not stop at managing the symptom or trying to think more positively. We look at what keeps producing it and what needs to change.'
    }, {
      q: 'Can I bring something personal?',
      a: 'Yes. Relationships, identity, health and purpose do not remain separate from work simply because your calendar says they should. We follow the problem without losing sight of why you came.'
    }, {
      q: 'Is this confidential?',
      a: 'The work is private and governed by professional confidentiality. Any limits to confidentiality are explained clearly before we begin.'
    }, {
      q: 'Is the Sparring Session just a sales call?',
      a: 'No. It has a standalone outcome. You should leave with a clearer understanding of what is happening and what to do next, even if we never work together.'
    }, {
      q: 'What happens afterwards?',
      a: 'You can take the outcome away and act on it yourself. If deeper or ongoing work would be useful, we can discuss that after the session.'
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
function renderDraft(pageId) {
  var cfg = CONFIGS[pageId];
  if (!cfg) {
    return;
  }
  if (typeof document !== 'undefined') {
    document.title = cfg.title;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(e(DraftLandingPage, {
    cfg: cfg
  }));
}
Object.assign(window, {
  renderDraft: renderDraft,
  DRAFT_CONFIGS: CONFIGS
});
