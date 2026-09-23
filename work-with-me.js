// work-with-me.jsx — /work-with-me/, the single service page.
// Plain React, compiled by babel like site-chrome.jsx / offer-pages.jsx.
// Loaded AFTER site-chrome.js (uses window.ChromeStyles / SiteHeader / SiteFooterX).
//
// Replaces the three retired offer pages (/psychotherapy-decision-coaching/,
// /career-strategy-consulting/, /solopreneur-growth-consulting/) and the
// /start-here/ orientation flow, all of which now 301 here.
//
// Route: /work-with-me/  →  renderWorkWithMe()

var e = React.createElement;

// Every CTA on the page lands on the contact form with the orientation-call
// interest preselected, which is the only 1:1 option the form now offers.
var ORIENTATION_URL = '/contact/?interest=orientation';

// ─── Content ─────────────────────────────────────────────────────────────────
// Six problem areas. Each is a heading plus the concrete things people actually
// arrive with, so the page's scope is readable as text rather than implied.
var GROUPS = [{
  label: 'Career & direction',
  ex: ['Stay or leave', 'Career change', 'Meaningful work', 'Difficult career decisions']
}, {
  label: 'Going independent',
  ex: ['Offer', 'Buyer', 'Positioning', 'First clients', 'Testing before quitting']
}, {
  label: 'Sales & visibility',
  ex: ['Outreach', 'Sales', 'Content', 'Leads', 'Rejection', 'Visibility']
}, {
  label: 'Business growth',
  ex: ['Leads', 'Conversion', 'Pricing', 'Positioning', 'Offer', 'Retention']
}, {
  label: 'Patterns & boundaries',
  ex: ['People pleasing', 'Difficult conversations', 'Negotiation', 'Boundaries', 'Leadership']
}, {
  label: 'Burnout & identity',
  ex: ['Burnout', 'Loss of meaning', 'Achievement and self-worth', 'Purpose', 'Work-life design']
}];

// The Jobs to be Done forces. Two push you towards the change, two hold you
// where you are; each is a question rather than a label so the diagram reads as
// text on its own (it is the page's main concept, so it must not be image-only).
var FORCES_FOR = [{
  label: 'Push',
  q: 'What is making the current situation harder to tolerate?'
}, {
  label: 'Pull',
  q: 'What do you want instead?'
}];
var FORCES_AGAINST = [{
  label: 'Habit',
  sub: '/ Protection',
  q: 'What do you still get from staying where you are?'
}, {
  label: 'Anxiety',
  sub: '',
  q: 'What feels risky, uncertain or costly about changing?'
}];
// Where the work lands once the map is filled in: the first three are practical,
// the last three are psychological. Colour carries that split visually; the
// `kind` field carries it for anyone reading the markup or listening to it.
var INTERVENTIONS = [{
  name: 'Strategy',
  kind: 'practical'
}, {
  name: 'Skill',
  kind: 'practical'
}, {
  name: 'Decision',
  kind: 'practical'
}, {
  name: 'Behaviour',
  kind: 'psychological'
}, {
  name: 'Fear',
  kind: 'psychological'
}, {
  name: 'Pattern',
  kind: 'psychological'
}];
var FIT_YES = ['You have a specific problem, decision or change you want to work on.', 'You want direct advice when direct advice is useful.', 'You are willing to look at both the situation and your own behaviour.'];
var FIT_NO = ['You mainly want reassurance.', 'You want someone else to make the decision for you.', 'You want a fixed programme with the same steps for everyone.'];
var FAQ = [{
  q: 'Is this therapy, consulting or coaching?',
  a: 'It depends on the problem. I am a business and career advisor and a BACP-registered psychotherapist. If the problem is commercial, we work on the business. If your behaviour or an underlying pattern is part of the problem, we can work there too.'
}, {
  q: 'What kinds of problems can I bring?',
  a: 'Anything within my areas of expertise where something needs to change. Leads, pricing, an offer, sales, a career decision, going independent, a conversation you keep avoiding, or the way you are working. Bring the actual problem.'
}, {
  q: 'Will you give me direct advice?',
  a: 'Yes. If I think you should change the offer, raise the price or have the conversation, I will tell you. I will also tell you when I think you are solving the wrong problem. The final decision stays with you.'
}, {
  q: 'Can one session be enough?',
  a: 'Yes. Sometimes the main problem is that you cannot get an accurate read on the situation. Other problems take longer, especially when the same pattern has been repeating for years.'
}, {
  q: 'What happens if there is more to work on?',
  a: 'If continuing would be useful, we decide what we are working towards and continue from there. There is no requirement to commit beyond the first session.'
}, {
  q: 'Is this confidential?',
  a: 'Yes. The work is private and covered by professional confidentiality. I explain the limits of confidentiality before we begin.'
}];
var PROOF = [['18+ years', ' in product and growth'], ['100+', ' technology companies advised'], ['MSc', ' Integrative Counselling & Psychotherapy'], ['BACP', ' registered psychotherapist']];

// ─── Stylesheet ──────────────────────────────────────────────────────────────
// Same editorial Japandi tokens as the rest of the site, plus one new accent
// (--wm-clay) for the forces that hold someone in place. Breakpoints mirror the
// offer pages they replace: 900px stacks the two-column blocks, 560px reflows
// the forces map from a horizontal axis to a vertical one.
var WM_CSS = `
.wm{background:#F3F0E8;color:#3A403A;font-family:var(--font-body);--wm-clay:#A34A38}
.wm-container{width:var(--page-canvas);margin-inline:auto}

/* shared atoms */
.wm-eyebrow{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin:0}
.wm-eyebrow__num{font-family:var(--font-display);font-synthesis:none;font-size:clamp(20px,2.2vw,26px);line-height:1;letter-spacing:-0.03em;color:#047857}
.wm-eyebrow__txt{font-family:var(--font-display);font-synthesis:none;font-size:13px;font-weight:400;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:#047857}
.wm-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding-inline:26px;background:#047857;color:#F3F0E8;font-size:15px;font-weight:750;line-height:1;text-transform:uppercase;letter-spacing:0.04em;transition:background .18s,gap .18s}
.wm-btn:hover{background:#03654A;color:#F3F0E8;gap:13px}

/* hero */
.wm-hero{position:relative;background:#F3F0E8;overflow:clip}
.wm-hero::before{content:"";position:absolute;top:-180px;right:-140px;width:460px;height:460px;border-radius:50%;background:rgba(4,120,87,0.07);pointer-events:none}
.wm-hero__in{position:relative;padding-block:clamp(56px,7vw,96px)}
.wm-hero__label{margin:0;font-family:var(--font-display);font-synthesis:none;font-size:13px;font-weight:400;line-height:1.3;letter-spacing:0.055em;text-transform:uppercase;color:#047857}
.wm-hero__h1{max-width:22ch;margin:20px 0 0;font-family:var(--font-display);font-synthesis:none;font-weight:400;font-size:clamp(32px,5vw,62px);line-height:0.96;letter-spacing:-0.05em;color:#14201C;text-wrap:balance}
.wm-hero__h1 em{font-style:normal;color:#047857}
.wm-hero__rule{width:110px;height:1px;background:#047857;margin:28px 0 0}
.wm-hero__lead{max-width:54ch;margin:24px 0 0;font-size:clamp(18px,1.7vw,21px);line-height:1.5;color:#3A403A;text-wrap:pretty}
.wm-hero__sub{max-width:54ch;margin:16px 0 0;font-size:clamp(16.5px,1.5vw,18px);line-height:1.55;color:#6A6F67;text-wrap:pretty}
.wm-hero__cta{margin-top:32px}

/* proof band */
.wm-proof{background:#16231E;border-block:1px solid rgba(243,240,232,0.14)}
.wm-proof__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px 40px;padding-block:26px}
.wm-proof__item{margin:0;font-size:15px;line-height:1.4;color:#C0C9BF}
.wm-proof__item strong{font-weight:600;color:#F3F0E8}

/* 01 — what we can work on */
.wm-scope{background:#EDE8DB;padding-block:clamp(48px,6vw,84px)}
.wm-scope__h2{margin:0 0 clamp(28px,3.4vw,40px)}
.wm-scope__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(330px,100%),1fr));gap:clamp(22px,2.8vw,40px)}
/* Hold the approved 3x2 arrangement on a wide canvas: auto-fit would pick up
   a fourth column past ~1440px and leave an orphan row of two. 1160px is where
   auto-fit used to reach three columns on the old narrower container, so the
   breakpoint itself is unchanged. */
@media (min-width:1160px){.wm-scope__grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.wm-group{min-width:0;padding-top:18px;border-top:1px solid rgba(23,25,25,0.24);display:flex;flex-direction:column;gap:16px}
.wm-group__h{margin:0;font-family:var(--font-display);font-synthesis:none;font-size:13px;font-weight:400;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:#047857}
.wm-group__list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px 16px}
.wm-group__item{padding-left:11px;border-left:2px solid rgba(4,120,87,0.5);font-size:17px;line-height:1.2;color:#14201C}

/* 02 — how I work (the forces map) */
.wm-how{background:#F3F0E8;padding-block:clamp(60px,8vw,112px)}
.wm-how__kicker{margin:18px 0 18px;font-size:13px;font-weight:700;line-height:1;letter-spacing:0.11em;text-transform:uppercase;color:#6A6F67}
.wm-how__h2{max-width:24ch;margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(28px,3.8vw,48px);font-weight:800;line-height:1.02;letter-spacing:-0.044em;color:#14201C;text-wrap:balance}
.wm-how__intro{max-width:62ch;margin:20px 0 0;font-size:17px;line-height:1.6;color:#3A403A;text-wrap:pretty}

.wm-map{margin-top:clamp(48px,6vw,84px)}
.wm-map__axis{display:flex;align-items:center;gap:clamp(12px,1.6vw,20px)}
.wm-map__axis-label{flex:0 0 auto;font-family:var(--font-display);font-synthesis:none;font-size:13px;font-weight:400;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:#047857}
.wm-map__axis-line{flex:1;min-width:16px;border-top:1px dashed rgba(4,120,87,0.6)}
.wm-map__axis-arrow{flex:0 0 auto;font-family:var(--font-display);font-size:14px;line-height:1;color:#047857}
.wm-map__axis--against .wm-map__axis-label,.wm-map__axis--against .wm-map__axis-arrow{color:var(--wm-clay)}
.wm-map__axis--against .wm-map__axis-line{border-top-color:rgba(163,74,56,0.6)}

.wm-forces{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(250px,100%),1fr));gap:clamp(24px,3.4vw,56px);padding-block:clamp(30px,3.6vw,48px) clamp(34px,4vw,56px);margin:0;list-style:none}
.wm-forces--against{padding-block:clamp(34px,4vw,56px) clamp(30px,3.6vw,48px)}
.wm-force{min-width:0}
.wm-force__label{font-family:var(--font-display);font-synthesis:none;font-size:clamp(36px,5.2vw,68px);line-height:0.92;letter-spacing:-0.055em;color:#047857;margin-bottom:16px}
.wm-forces--against .wm-force__label{color:var(--wm-clay);margin-bottom:0}
.wm-force__sub{margin-top:4px;font-family:var(--font-display);font-synthesis:none;font-size:clamp(18px,2.2vw,29px);line-height:1;letter-spacing:-0.045em;color:var(--wm-clay)}
.wm-forces--against .wm-force__q{margin-top:16px}
.wm-force__q{margin:0;max-width:26ch;font-size:clamp(16.5px,1.5vw,18px);line-height:1.5;color:#14201C;text-wrap:pretty}

.wm-journey{display:flex;align-items:center;gap:clamp(8px,1.4vw,18px);padding-block:clamp(24px,3vw,38px);border-block:1px solid rgba(23,25,25,0.2)}
.wm-journey__end{flex:0 0 auto;max-width:25%;font-size:clamp(11px,1vw,12.5px);font-weight:700;letter-spacing:0.11em;text-transform:uppercase;color:#6A6F67;line-height:1.35}
.wm-journey__end--to{text-align:right;color:#047857}
.wm-journey__line{flex:1;min-width:12px;height:1px;background:rgba(23,25,25,0.45)}
.wm-journey__line--to{height:2px;background:#047857}
.wm-journey__you{flex:0 0 auto;width:clamp(76px,10vw,128px);aspect-ratio:1;border-radius:50%;background:#047857;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-synthesis:none;font-size:clamp(12.5px,1.3vw,15px);line-height:1;letter-spacing:0.06em;text-transform:uppercase;color:#F3F0E8}

.wm-where{margin-top:clamp(48px,6vw,80px);padding-top:clamp(32px,4vw,44px);border-top:2px solid #047857;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:clamp(24px,3vw,48px);align-items:start}
.wm-where__h3{margin:0;max-width:14ch;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,2.8vw,36px);font-weight:800;line-height:1.06;letter-spacing:-0.036em;color:#14201C;text-wrap:balance}
.wm-where__chips{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(130px,100%),1fr));gap:10px}
/* Keep the practical row and the psychological row intact: three across, two
   rows. Without this a wide canvas reflows them to 5+1 and the colour
   grouping stops meaning anything. */
@media (min-width:900px){.wm-where__chips{grid-template-columns:repeat(3,minmax(0,1fr))}}
.wm-chip{padding:14px 16px;font-family:var(--font-heading);font-size:16px;font-weight:750;letter-spacing:-0.01em}
.wm-chip--practical{background:#D8F3E5;color:#043D2B}
.wm-chip--psychological{background:#F6E2DE;color:#7E2C20}
.wm-where__note{margin:18px 0 0;max-width:46ch;font-size:16.5px;line-height:1.55;color:#3A403A}

/* 03 — fit and questions */
.wm-fit{background:#EDE8DB;padding-block:clamp(56px,7vw,100px)}
.wm-fit__h2{margin:0 0 clamp(32px,4vw,44px)}
.wm-fit__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:clamp(32px,4vw,64px);margin-bottom:clamp(44px,5.4vw,68px)}
.wm-fit__h3{margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(21px,2.1vw,26px);font-weight:800;line-height:1.14;letter-spacing:-0.03em;color:#047857}
.wm-fit__h3--no{color:var(--wm-clay)}
.wm-fit__list{list-style:none;margin:0;padding:0}
.wm-fit__item{display:flex;gap:12px;padding:15px 0;border-top:1px solid rgba(23,25,25,0.18);font-size:17px;line-height:1.5;color:#3A403A;text-wrap:pretty}
/* The rules still span the full column on a wide canvas, but the sentence
   inside them stops at a readable measure instead of stretching to ~90ch. */
.wm-fit__item>span:last-child{max-width:52ch}
.wm-fit__mark{flex:0 0 auto;font-weight:700;color:#047857}
.wm-fit__mark--no{color:var(--wm-clay)}

.wm-faq__h3{margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,2.8vw,34px);font-weight:800;line-height:1.08;letter-spacing:-0.036em;color:#14201C}
.wm-faq{max-width:900px}
.wm-faq details{border-top:1px solid rgba(23,25,25,0.22)}
.wm-faq details:last-of-type{border-bottom:1px solid rgba(23,25,25,0.22)}
.wm-faq summary{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 0;cursor:pointer;list-style:none;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(17px,1.6vw,20px);font-weight:700;line-height:1.34;letter-spacing:-0.02em;color:#14201C;transition:color .18s}
.wm-faq summary:hover{color:#047857}
.wm-faq summary::-webkit-details-marker{display:none}
.wm-faq summary::after{content:"+";flex:0 0 auto;font-family:var(--font-body);font-size:22px;font-weight:400;line-height:1;color:#047857}
.wm-faq details[open] summary::after{content:"\\2212"}
.wm-faq__a{margin:0;padding:0 0 22px;max-width:68ch;font-size:16.5px;line-height:1.65;color:#3A403A;text-wrap:pretty}

/* final cta */
.wm-final{background:#16231E;padding-block:clamp(56px,7vw,92px);text-align:center;border-top:1px solid rgba(243,240,232,0.14)}
.wm-final__in{width:min(980px,calc(100% - 2 * clamp(16px,3.5vw,32px)));margin-inline:auto}
.wm-final__h2{max-width:18ch;margin:0 auto;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(28px,4vw,48px);font-weight:800;line-height:1.04;letter-spacing:-0.04em;color:#F3F0E8;text-wrap:balance}
.wm-final__p{max-width:48ch;margin:22px auto 0;font-size:17px;line-height:1.6;color:#C0C9BF;text-wrap:pretty}
.wm-final .wm-btn{margin-top:34px;min-height:62px;padding-inline:40px;border-radius:999px}

/* ── responsive ── */
@media (max-width:560px){
  /* The forces map's horizontal "where you are → where you want to get to" axis
     has no room at phone width, so it reflows to a vertical run with the You
     marker between the two ends, keeping every label on one readable line. */
  .wm-journey{flex-direction:column;align-items:flex-start;gap:14px;padding-block:28px}
  .wm-journey__end{max-width:none}
  .wm-journey__end--to{text-align:left}
  /* flex:1 from the row layout would collapse these to zero height in a column,
     so the connectors are re-fixed to an explicit size and centred under You. */
  .wm-journey__line{flex:0 0 auto;width:2px;min-width:0;height:26px;margin-left:calc(clamp(76px,10vw,128px) / 2 - 1px)}
  .wm-journey__line--to{width:2px;height:26px}
  .wm-map__axis-label{font-size:12px}
  .wm-force__label{margin-bottom:12px}
}
`;
function WorkWithMeStyles() {
  return e('style', {
    dangerouslySetInnerHTML: {
      __html: WM_CSS
    }
  });
}
function WmCta(props) {
  return e('a', {
    className: 'wm-btn',
    href: ORIENTATION_URL
  }, e('span', null, props.label || 'Free orientation call'), e('span', {
    'aria-hidden': 'true'
  }, '→'));
}

// One reusable numbered section label. `as` lets a section use it as its own
// heading where no display heading follows it.
function WmEyebrow(props) {
  return e(props.as || 'div', {
    className: 'wm-eyebrow' + (props.className ? ' ' + props.className : '')
  }, e('span', {
    className: 'wm-eyebrow__num'
  }, props.num + ' /'), e('span', {
    className: 'wm-eyebrow__txt'
  }, props.text));
}

// ─── Sections ────────────────────────────────────────────────────────────────
function WmHero() {
  return e('section', {
    className: 'wm-hero'
  }, e('div', {
    className: 'wm-container wm-hero__in'
  }, e('p', {
    className: 'wm-hero__label'
  }, 'Work with me'), e('h1', {
    className: 'wm-hero__h1'
  }, 'Where you are. Where you want to get to. ', e('em', null, 'What’s happening in between.')), e('div', {
    className: 'wm-hero__rule',
    'aria-hidden': 'true'
  }), e('p', {
    className: 'wm-hero__lead'
  }, 'We look at how you got here, what you are trying to change and what is making that difficult. Then we work on the part that actually needs work.'), e('p', {
    className: 'wm-hero__sub'
  }, 'That might be your offer, sales, pricing, career decision, behaviour, fear, or a pattern you keep repeating.'), e('div', {
    className: 'wm-hero__cta'
  }, e(WmCta))));
}
function WmProof() {
  return e('section', {
    className: 'wm-proof',
    'aria-label': 'Background and credentials'
  }, e('div', {
    className: 'wm-container'
  }, e('div', {
    className: 'wm-proof__grid'
  }, PROOF.map(function (p, i) {
    return e('p', {
      className: 'wm-proof__item',
      key: i
    }, e('strong', null, p[0]), p[1]);
  }))));
}
function WmScope() {
  return e('section', {
    className: 'wm-scope',
    'aria-labelledby': 'wm-scope-h'
  }, e('div', {
    className: 'wm-container'
  }, e(WmEyebrow, {
    as: 'h2',
    num: '01',
    text: 'What we can work on',
    className: 'wm-scope__h2'
  }), e('div', {
    className: 'wm-scope__grid'
  }, GROUPS.map(function (g) {
    return e('div', {
      className: 'wm-group',
      key: g.label
    }, e('h3', {
      className: 'wm-group__h'
    }, g.label), e('ul', {
      className: 'wm-group__list'
    }, g.ex.map(function (x) {
      return e('li', {
        className: 'wm-group__item',
        key: x
      }, x);
    })));
  }))));
}

// The forces map. Everything in it is real text: the two forces pushing towards
// the change, the two holding it back, and the six places the work can land.
// A crawler (or a screen reader) gets the whole model without the diagram.
function WmHow() {
  return e('section', {
    className: 'wm-how',
    'aria-labelledby': 'wm-how-h'
  }, e('div', {
    className: 'wm-container'
  }, e(WmEyebrow, {
    num: '02',
    text: 'How I work'
  }), e('p', {
    className: 'wm-how__kicker'
  }, 'Influenced by Jobs to be Done'), e('h2', {
    className: 'wm-how__h2',
    id: 'wm-how-h'
  }, 'What is pushing you to change, and what is keeping you where you are?'), e('p', {
    className: 'wm-how__intro'
  }, 'Four forces decide whether a change actually happens. Two push you towards it: the situation becoming harder to tolerate, and something better you want instead. Two hold you in place: what the current situation still does for you, and what feels risky about changing. We map all four before deciding what to work on.'), e('div', {
    className: 'wm-map'
  }, e('div', {
    className: 'wm-map__axis'
  }, e('span', {
    className: 'wm-map__axis-label'
  }, 'Pushing you to change'), e('span', {
    className: 'wm-map__axis-line',
    'aria-hidden': 'true'
  }), e('span', {
    className: 'wm-map__axis-arrow',
    'aria-hidden': 'true'
  }, '→')), e('ul', {
    className: 'wm-forces'
  }, FORCES_FOR.map(function (f) {
    return e('li', {
      className: 'wm-force',
      key: f.label
    }, e('div', {
      className: 'wm-force__label'
    }, f.label), e('p', {
      className: 'wm-force__q'
    }, f.q));
  })), e('div', {
    className: 'wm-journey'
  }, e('div', {
    className: 'wm-journey__end'
  }, 'Where', e('br'), 'you are'), e('div', {
    className: 'wm-journey__line',
    'aria-hidden': 'true'
  }), e('div', {
    className: 'wm-journey__you'
  }, 'You'), e('div', {
    className: 'wm-journey__line wm-journey__line--to',
    'aria-hidden': 'true'
  }), e('div', {
    className: 'wm-journey__end wm-journey__end--to'
  }, 'Where you', e('br'), 'want to get to')), e('ul', {
    className: 'wm-forces wm-forces--against'
  }, FORCES_AGAINST.map(function (f) {
    return e('li', {
      className: 'wm-force',
      key: f.label
    }, e('div', {
      className: 'wm-force__label'
    }, f.label), f.sub ? e('div', {
      className: 'wm-force__sub'
    }, f.sub) : null, e('p', {
      className: 'wm-force__q'
    }, f.q));
  })), e('div', {
    className: 'wm-map__axis wm-map__axis--against'
  }, e('span', {
    className: 'wm-map__axis-arrow',
    'aria-hidden': 'true'
  }, '←'), e('span', {
    className: 'wm-map__axis-line',
    'aria-hidden': 'true'
  }), e('span', {
    className: 'wm-map__axis-label'
  }, 'Keeping you where you are'))), e('div', {
    className: 'wm-where'
  }, e('h3', {
    className: 'wm-where__h3'
  }, 'Where do we need to work?'), e('div', null, e('ul', {
    className: 'wm-where__chips'
  }, INTERVENTIONS.map(function (iv) {
    return e('li', {
      className: 'wm-chip wm-chip--' + iv.kind,
      key: iv.name
    }, iv.name);
  })), e('p', {
    className: 'wm-where__note'
  }, 'The map helps us decide what deserves attention first.')))));
}
function WmFit() {
  function column(heading, items, mark, no) {
    return e('div', null, e('h3', {
      className: 'wm-fit__h3' + (no ? ' wm-fit__h3--no' : '')
    }, heading), e('ul', {
      className: 'wm-fit__list'
    }, items.map(function (t, i) {
      return e('li', {
        className: 'wm-fit__item',
        key: i
      }, e('span', {
        className: 'wm-fit__mark' + (no ? ' wm-fit__mark--no' : ''),
        'aria-hidden': 'true'
      }, mark), e('span', null, t));
    })));
  }
  return e('section', {
    className: 'wm-fit',
    'aria-labelledby': 'wm-fit-h'
  }, e('div', {
    className: 'wm-container'
  }, e(WmEyebrow, {
    as: 'h2',
    num: '03',
    text: 'Fit and questions',
    className: 'wm-fit__h2'
  }), e('div', {
    className: 'wm-fit__grid'
  }, column('Good fit', FIT_YES, '✓', false), column('Probably not', FIT_NO, '✕', true)),
  // <details> rather than a JS accordion: the answers stay in the HTML for
  // crawlers and for anyone without JavaScript, and still collapse visually.
  e('h3', {
    className: 'wm-faq__h3'
  }, 'Common questions'), e('div', {
    className: 'wm-faq'
  }, FAQ.map(function (item, i) {
    return e('details', {
      key: i
    }, e('summary', null, e('span', null, item.q)), e('p', {
      className: 'wm-faq__a'
    }, item.a));
  }))));
}
function WmFinal() {
  return e('section', {
    className: 'wm-final'
  }, e('div', {
    className: 'wm-final__in'
  }, e('h2', {
    className: 'wm-final__h2'
  }, 'Tell me what you’re working on.'), e('p', {
    className: 'wm-final__p'
  }, 'Send me a short description before we meet. I read it myself and use it to decide whether I can be useful.'), e(WmCta)));
}

// ─── Page shell ──────────────────────────────────────────────────────────────
function WorkWithMePage() {
  return e(React.Fragment, null, e(window.ChromeStyles), e(WorkWithMeStyles), e(window.SiteHeader, {
    page: 'work-with-me',
    lang: 'en'
  }), e('main', {
    className: 'wm'
  }, e(WmHero), e(WmProof), e(WmScope), e(WmHow), e(WmFit), e(WmFinal)), e(window.SiteFooterX, {
    lang: 'en'
  }));
}

// ─── Mount ───────────────────────────────────────────────────────────────────
// The static <title> in the page's <head> is authoritative for SEO, so this
// does not touch document.title.
function renderWorkWithMe() {
  var root = document.getElementById('root');
  if (!root) {
    return;
  }
  ReactDOM.createRoot(root).render(e(WorkWithMePage));
}
Object.assign(window, {
  renderWorkWithMe: renderWorkWithMe,
  WorkWithMePage: WorkWithMePage,
  WM_FAQ: FAQ
});
