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
var R = React;

// Every CTA on the page lands on the contact form with the orientation-call
// interest preselected, which is the only 1:1 option the form now offers.
var ORIENTATION_URL = '/contact/?interest=orientation';

// ─── Content ─────────────────────────────────────────────────────────────────
// Six problem areas. Each is a heading plus the concrete things people actually
// arrive with, so the page's scope is readable as text rather than implied.
var GROUPS = [
  { label: 'Career & direction', ex: ['Stay or leave', 'Career change', 'Meaningful work', 'Difficult career decisions'] },
  { label: 'Going independent', ex: ['Offer', 'Buyer', 'Positioning', 'First clients', 'Testing before quitting'] },
  { label: 'Sales & visibility', ex: ['Outreach', 'Sales', 'Content', 'Leads', 'Rejection', 'Visibility'] },
  { label: 'Business growth', ex: ['Leads', 'Conversion', 'Pricing', 'Positioning', 'Offer', 'Retention'] },
  { label: 'Patterns & boundaries', ex: ['People pleasing', 'Difficult conversations', 'Negotiation', 'Boundaries', 'Leadership'] },
  { label: 'Burnout & identity', ex: ['Burnout', 'Loss of meaning', 'Achievement and self-worth', 'Purpose', 'Work-life design'] },
];

// The Jobs to be Done forces. Two push you towards the change, two hold you
// where you are; each is a question rather than a label so the diagram reads as
// text on its own (it is the page's main concept, so it must not be image-only).
var FORCES_FOR = [
  { label: 'Push', q: 'What is making the current situation harder to tolerate?' },
  { label: 'Pull', q: 'What do you want instead?' },
];
var FORCES_AGAINST = [
  { label: 'Habit', sub: '/ Protection', q: 'What do you still get from staying where you are?' },
  { label: 'Anxiety', sub: '', q: 'What feels risky, uncertain or costly about changing?' },
];
// Where the work lands once the map is filled in: the first three are practical,
// the last three are psychological. Colour carries that split visually; the
// `kind` field carries it for anyone reading the markup or listening to it.
var INTERVENTIONS = [
  { name: 'Strategy', kind: 'practical' },
  { name: 'Skill', kind: 'practical' },
  { name: 'Decision', kind: 'practical' },
  { name: 'Behaviour', kind: 'psychological' },
  { name: 'Fear', kind: 'psychological' },
  { name: 'Pattern', kind: 'psychological' },
];

var FIT_YES = [
  'You have a specific problem, decision or change you want to work on.',
  'You want direct advice when direct advice is useful.',
  'You are willing to look at both the situation and your own behaviour.',
];
var FIT_NO = [
  'You mainly want reassurance.',
  'You want someone else to make the decision for you.',
  'You want a fixed programme with the same steps for everyone.',
];

var FAQ = [
  { q: 'Is this therapy, consulting or coaching?',
    a: 'It depends on the problem. I am a business and career advisor and a BACP-registered psychotherapist. If the problem is commercial, we work on the business. If your behaviour or an underlying pattern is part of the problem, we can work there too.' },
  { q: 'What kinds of problems can I bring?',
    a: 'Anything within my areas of expertise where something needs to change. Leads, pricing, an offer, sales, a career decision, going independent, a conversation you keep avoiding, or the way you are working. Bring the actual problem.' },
  { q: 'Will you give me direct advice?',
    a: 'Yes. If I think you should change the offer, raise the price or have the conversation, I will tell you. I will also tell you when I think you are solving the wrong problem. The final decision stays with you.' },
  { q: 'Can one session be enough?',
    a: 'Yes. Sometimes the main problem is that you cannot get an accurate read on the situation. Other problems take longer, especially when the same pattern has been repeating for years.' },
  { q: 'What happens if there is more to work on?',
    a: 'If continuing would be useful, we decide what we are working towards and continue from there. There is no requirement to commit beyond the first session.' },
  { q: 'Is this confidential?',
    a: 'Yes. The work is private and covered by professional confidentiality. I explain the limits of confidentiality before we begin.' },
];

var PROOF = [
  ['18+ years', ' in product and growth'],
  ['100+', ' technology companies advised'],
  ['MSc', ' Integrative Counselling & Psychotherapy'],
  ['BACP', ' registered psychotherapist'],
];

// ─── Stylesheet ──────────────────────────────────────────────────────────────
// Same editorial Japandi tokens as the rest of the site. The forces that hold
// someone in place now use the shared coral system from site-chrome instead of
// the page-scoped --wm-clay, which is gone: --coral for graphics and large
// emphasis, --coral-ink wherever the text is small enough to need 4.5:1 on
// bone (--coral reaches only 3.56:1 there, --coral-ink 5.19:1, which is what
// clay used to give). Breakpoints mirror the offer pages they replace: 900px
// stacks the two-column blocks, 560px reflows the forces map from a horizontal
// axis to a vertical one.
var WM_CSS = `
.wm{background:#F3F0E8;color:#3A403A;font-family:var(--font-body)}
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

/* Forces Map. One spatial system: a journey axis with YOU on it, two green
   forces pushing toward the desired state and two coral ones pulling back to
   the current one. The SVG is aria-hidden; every force's label and question is
   a real button, so the concept survives with no SVG, no JS and no pointer.
   Sized in container-query units so the whole composition scales with the page
   canvas instead of freezing at the prototype's 1336px. Browsers without cqw
   keep the px fallback declared immediately above each one. */
.fm{margin-top:clamp(48px,6vw,84px)}
.fm__ends{display:flex;justify-content:space-between;gap:16px;--fm-from:#6A6F67}
.fm__end{font-size:clamp(10.5px,1vw,12.5px);font-weight:700;letter-spacing:0.11em;text-transform:uppercase;line-height:1.35;color:var(--fm-from);transition:color var(--dur-state) var(--ease-settle)}
.fm__end--to{text-align:right;color:#047857}
.fm__stage{position:relative;container-type:inline-size;aspect-ratio:1336 / 640;margin-top:10px}
.fm__svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.fm__youlabel{font-family:var(--font-display);font-synthesis:none;font-size:15px;letter-spacing:0.9px}
.fm-force{position:absolute;display:block;margin:0;padding:0;background:none;border:0;font:inherit;color:inherit;cursor:pointer;--fm-label-o:1;--fm-q:#14201C}
.fm-force--tl{left:0;top:4.6875%;text-align:left}
.fm-force--tr{right:0;top:4.6875%;text-align:right}
.fm-force--bl{left:0;top:70.625%;text-align:left}
.fm-force--br{right:0;top:70.625%;text-align:right}
.fm-force__label{display:block;font-family:var(--font-display);font-synthesis:none;font-size:68px;font-size:5.09cqw;font-weight:400;line-height:0.92;letter-spacing:-0.055em;opacity:var(--fm-label-o);transition:opacity var(--dur-state) var(--ease-settle)}
.fm-force--push .fm-force__label,.fm-force--pull .fm-force__label{color:#047857}
.fm-force--habit .fm-force__label,.fm-force--anxiety .fm-force__label,.fm-force__sub{color:var(--coral)}
.fm-force__sub{display:block;margin-top:4px;font-family:var(--font-display);font-synthesis:none;font-size:29px;font-size:2.17cqw;line-height:1;letter-spacing:-0.045em;opacity:var(--fm-label-o);transition:opacity var(--dur-state) var(--ease-settle)}
.fm-force__q{display:block;margin-top:16px;max-width:26ch;font-size:18px;font-size:1.35cqw;line-height:1.5;color:var(--fm-q);transition:color var(--dur-state) var(--ease-settle)}
.fm-force--tr .fm-force__q,.fm-force--br .fm-force__q{margin-left:auto}
/* The list is the mobile control surface; on desktop the quadrant buttons are
   the controls and the list would only repeat them. */
.fm__list{display:none}
.fm__row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;align-items:baseline;width:100%;margin:0;padding:14px 0 16px;
  background:none;border:0;border-top:1px solid rgba(23,25,25,0.18);font:inherit;color:inherit;text-align:left;cursor:pointer;--fm-q:#14201C;
  transition:border-color var(--dur-state) var(--ease-settle)}
.fm__rowlabel{font-family:var(--font-display);font-synthesis:none;font-size:19px;line-height:1;letter-spacing:-0.04em}
.fm__row--push .fm__rowlabel,.fm__row--pull .fm__rowlabel{color:#047857}
.fm__row--habit .fm__rowlabel,.fm__row--anxiety .fm__rowlabel{color:var(--coral)}
.fm__rowq{font-size:16px;line-height:1.45;color:var(--fm-q);transition:color var(--dur-state) var(--ease-settle)}
/* Mobile: the diagram keeps its horizontal geometry at 350x330 and only the
   force labels; the questions move into the list, which is where touch
   interaction happens. */
@media (max-width:900px){
  .fm__stage{aspect-ratio:350 / 330}
  .fm-force{pointer-events:none}
  .fm-force--tl,.fm-force--tr{top:7.9%}
  .fm-force--bl,.fm-force--br{top:79.4%}
  .fm-force__label{font-size:30px;font-size:8.57cqw;letter-spacing:-0.05em}
  .fm-force__sub{margin-top:3px;font-size:15px;font-size:4.28cqw;letter-spacing:-0.04em}
  .fm-force__q{display:none}
  .fm__list{display:block;margin-top:22px}
}
@media (max-width:900px){
  .wm-where__chips{gap:8px}
  .wm-chip{padding:12px 10px;font-size:14.5px}
}
@media (max-width:420px){
  .wm-chip{padding:10px 8px;font-size:13px}
  .fm__row{grid-template-columns:72px minmax(0,1fr);gap:10px}
  .fm__rowlabel{font-size:17px}
  .fm__rowq{font-size:15px}
}
.wm-where{margin-top:clamp(48px,6vw,80px);padding-top:clamp(32px,4vw,44px);border-top:2px solid #047857;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:clamp(24px,3vw,48px);align-items:start}
.wm-where__h3{margin:0;max-width:14ch;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,2.8vw,36px);font-weight:800;line-height:1.06;letter-spacing:-0.036em;color:#14201C;text-wrap:balance}
/* Always three across. The first row is the practical interventions and the
   second the psychological ones, so any other column count destroys the split
   the colours encode. */
.wm-where__chips{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.wm-chip{padding:14px 16px;font-family:var(--font-heading);font-size:16px;font-weight:750;letter-spacing:-0.01em}
.wm-chip--practical{background:#D8F3E5;color:#043D2B}
.wm-chip--psychological{background:var(--coral-tint);color:#7E2C20}
.wm-where__note{margin:18px 0 0;max-width:46ch;font-size:16.5px;line-height:1.55;color:#3A403A}

/* 03 — fit and questions */
/* Handoff H3, light to light: the ground interpolates bone -> bone-deep across
   the seam rather than switching, then the two column rules grow outward from
   their own side and the rows rise 12px on a 70ms stagger. Runs once. */
.wm-fit{--fit-bg:#EDE8DB;--fit-col:1;background:var(--fit-bg);padding-block:clamp(56px,7vw,100px)}
.wm-fit__rule{display:block;height:2px;margin:0 0 20px;background:#047857;transform:scaleX(var(--fit-col));transform-origin:left center}
.wm-fit__rule--no{background:var(--coral);transform-origin:right center}
.wm-fit__item{--fit-r:1;opacity:var(--fit-r);transform:translate3d(0,calc((1 - var(--fit-r)) * 12px),0)}
.wm-fit__h2{margin:0 0 clamp(32px,4vw,44px)}
.wm-fit__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:clamp(32px,4vw,64px);margin-bottom:clamp(44px,5.4vw,68px)}
.wm-fit__h3{margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(21px,2.1vw,26px);font-weight:800;line-height:1.14;letter-spacing:-0.03em;color:#047857}
.wm-fit__h3--no{color:var(--coral)}
.wm-fit__list{list-style:none;margin:0;padding:0}
.wm-fit__item{display:flex;gap:12px;padding:15px 0;border-top:1px solid rgba(23,25,25,0.18);font-size:17px;line-height:1.5;color:#3A403A;text-wrap:pretty}
/* The rules still span the full column on a wide canvas, but the sentence
   inside them stops at a readable measure instead of stretching to ~90ch. */
.wm-fit__item>span:last-child{max-width:52ch}
.wm-fit__mark{flex:0 0 auto;font-weight:700;color:#047857}
.wm-fit__mark--no{color:var(--coral-ink)}

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
  return e('style', { dangerouslySetInnerHTML: { __html: WM_CSS } });
}

function WmCta(props) {
  return e('a', { className: 'wm-btn', href: ORIENTATION_URL },
    e('span', null, props.label || 'Free orientation call'), e('span', { 'aria-hidden': 'true' }, '→'));
}

// One reusable numbered section label. `as` lets a section use it as its own
// heading where no display heading follows it.
function WmEyebrow(props) {
  return e(props.as || 'div', { className: 'wm-eyebrow' + (props.className ? ' ' + props.className : '') },
    e('span', { className: 'wm-eyebrow__num' }, props.num + ' /'),
    e('span', { className: 'wm-eyebrow__txt' }, props.text));
}

// ─── Sections ────────────────────────────────────────────────────────────────
function WmHero() {
  return e('section', { className: 'wm-hero' },
    e('div', { className: 'wm-container wm-hero__in' },
      e('p', { className: 'wm-hero__label' }, 'Work with me'),
      e('h1', { className: 'wm-hero__h1' },
        'Where you are. Where you want to get to. ',
        e('em', null, 'What’s happening in between.')),
      e('div', { className: 'wm-hero__rule', 'aria-hidden': 'true' }),
      e('p', { className: 'wm-hero__lead' },
        'We look at how you got here, what you are trying to change and what is making that difficult. Then we work on the part that actually needs work.'),
      e('p', { className: 'wm-hero__sub' },
        'That might be your offer, sales, pricing, career decision, behaviour, fear, or a pattern you keep repeating.'),
      e('div', { className: 'wm-hero__cta' }, e(WmCta))
    )
  );
}

function WmProof() {
  return e('section', { className: 'wm-proof', 'aria-label': 'Background and credentials' },
    e('div', { className: 'wm-container' },
      e('div', { className: 'wm-proof__grid' },
        PROOF.map(function (p, i) {
          return e('p', { className: 'wm-proof__item', key: i }, e('strong', null, p[0]), p[1]);
        })
      )
    )
  );
}

function WmScope() {
  return e('section', { className: 'wm-scope', 'aria-labelledby': 'wm-scope-h' },
    e('div', { className: 'wm-container' },
      e(WmEyebrow, { as: 'h2', num: '01', text: 'What we can work on', className: 'wm-scope__h2' }),
      e('div', { className: 'wm-scope__grid' },
        GROUPS.map(function (g) {
          return e('div', { className: 'wm-group', key: g.label },
            e('h3', { className: 'wm-group__h' }, g.label),
            e('ul', { className: 'wm-group__list' },
              g.ex.map(function (x) { return e('li', { className: 'wm-group__item', key: x }, x); })
            )
          );
        })
      )
    )
  );
}

// The forces map. Everything in it is real text: the two forces pushing towards
// the change, the two holding it back, and the six places the work can land.
// A crawler (or a screen reader) gets the whole model without the diagram.
// ─── Forces Map ──────────────────────────────────────────────────────────────
// The page's signature interaction, from Forces Map.dc.html. One spatial
// system: a journey axis with YOU on it, two green forces pushing right toward
// the desired state and two coral forces pulling left toward the current one.
//
// The SVG is aria-hidden throughout. Every force's label and question lives in
// a real <button>, so the concept is fully readable — and operable — with no
// SVG, no JS and no pointer.
//
// The prototype cycles through states to demonstrate itself. Production does
// not: the entrance plays once, settles at DEFAULT, and only hover, focus or
// tap changes state after that.
var FM_GREEN = '#047857', FM_CORAL = '#CF5A3D';
var FM_ENTRANCE = 2060;
// Geometry, verbatim from the prototype. d = desktop viewBox 1336x640,
// m = mobile 350x330. R 64 is the 128px disc; sF/sN are the bundle's far and
// near line spacing; ext is how far an active vector extends.
var FM_G = {
  d: { w: 1336, h: 640, y0: 320, cx0: 668, R: 64, farL: 200, farR: 1136, gap: 28,
       yFU: 244, yNU: 266, yFD: 396, yND: 374, sF: 20, sN: 9, ext: 48,
       axL: 150, axR: 1186, blk: 220, head: [10, 6.5], arcPad: 10, dash: '5 6',
       shift: { push: 36, pull: 56, anxiety: -28, habit: -44 }, trailN: 12, ghostN: 20 },
  m: { w: 350, h: 330, y0: 165, cx0: 175, R: 30, farL: 14, farR: 336, gap: 12,
       yFU: 112, yNU: 134, yFD: 218, yND: 196, sF: 11, sN: 5, ext: 12,
       axL: 0, axR: 350, blk: 86, head: [7, 4.5], arcPad: 6, dash: '4 5',
       shift: { push: 14, pull: 22, anxiety: -12, habit: -18 }, trailN: 5, ghostN: 8 },
};
var FM_KEYS = ['push', 'pull', 'anxiety', 'habit'];
var FM_LIST_ORDER = ['push', 'pull', 'habit', 'anxiety'];
var FM_TEXT = {
  push: { label: 'Push', q: FORCES_FOR[0].q, c: FM_GREEN },
  pull: { label: 'Pull', q: FORCES_FOR[1].q, c: FM_GREEN },
  habit: { label: 'Habit', sub: '/ Protection', q: FORCES_AGAINST[0].q, c: FM_CORAL },
  anxiety: { label: 'Anxiety', q: FORCES_AGAINST[1].q, c: FM_CORAL },
};
// Draw order: axis, then the two green forward forces, then the two coral
// opposing ones, then YOU, then the intervention chips. 2060ms end to end.
var FM_DRAW = { push: 350, pull: 420, anxiety: 800, habit: 870 };
var FM_LABEL_IN = { push: 450, pull: 530, anxiety: 900, habit: 980 };

function fmTarget(state, g) {
  var v = { sx: 0, push: 0.5, pull: 0.5, anxiety: 0.5, habit: 0.5 };
  if (FM_KEYS.indexOf(state) >= 0) {
    FM_KEYS.forEach(function (k) { v[k] = k === state ? 1 : 0.2; });
    v.sx = g.shift[state];
  }
  return v;
}

function WmForcesMap() {
  var wrap = R.useRef(null);
  var svg = R.useRef(null);
  var nodes = R.useRef({});
  var stateRef = R.useRef({ active: 'default', v: null, e: 1, sticky: false, raf: 0, vraf: 0 });
  var listRow = R.useRef([]);
  var btn = R.useRef({});
  var mobileRef = R.useRef(false);
  var pressed = R.useState('default');
  var active = pressed[0], setActive = pressed[1];

  R.useEffect(function () {
    var M = window.Motion;
    var el = wrap.current;
    if (!el || !M) return;
    var mq = window.matchMedia('(max-width: 900px)');
    var S = stateRef.current;

    function g() { return mobileRef.current ? FM_G.m : FM_G.d; }
    var f = function (n) { return n.toFixed(2); };
    var seg = function (ms, a, d, ease) { return M.win(ms, a, d, ease); };
    var amt = function (v, k) { return M.clamp01((v[k] - 0.5) * 2); };

    // One imperative pass over the diagram. Attributes only — no React render
    // per frame, and nothing here reads layout.
    function paint() {
      var G = g(), v = S.v || fmTarget('default', G), ms = S.e * FM_ENTRANCE;
      var n = nodes.current;
      var cx = G.cx0 + v.sx;
      var set = function (node, k, val) { if (node) node.setAttribute(k, val); };

      FM_KEYS.forEach(function (key) {
        var i = v[key], a = amt(v, key), c = FM_TEXT[key].c;
        [-2, -1, 0, 1, 2].forEach(function (k) {
          var core = Math.abs(k) <= 1, j = k + 1;
          var dp = core ? seg(ms, FM_DRAW[key] + j * 60, 360) : 1;
          var up = key === 'push' || key === 'pull';
          var yF = (up ? G.yFU : G.yFD) + k * G.sF, yN = (up ? G.yNU : G.yND) + k * G.sN;
          var nearL = cx - G.R - G.gap, nearR = cx + G.R + G.gap;
          var farL = Math.max(0, G.farL - G.ext * a), farR = Math.min(G.axR, G.farR + G.ext * a);
          var x1, y1, x2, y2;
          if (key === 'push') { x1 = farL; y1 = yF; x2 = nearL; y2 = yN; }
          if (key === 'pull') { x1 = nearR; y1 = yN; x2 = farR; y2 = yF; }
          if (key === 'habit') { x1 = nearL; y1 = yN; x2 = farL; y2 = yF; }
          if (key === 'anxiety') { x1 = farR; y1 = yF; x2 = nearR; y2 = yN; }
          var len = Math.hypot(x2 - x1, y2 - y1);
          // Default 0.59, active 1.0, stood-down 0.34. Outer pair exists only
          // while the force is active, taking the bundle from three to five.
          var op = core ? 0.18 + 0.82 * i : a * 0.7;
          var sw = core ? 1 + 0.8 * i + (k === 0 ? 0.4 : 0) : 1;
          var ln = n['l_' + key + '_' + k];
          if (ln) {
            set(ln, 'x1', f(x1)); set(ln, 'y1', f(y1)); set(ln, 'x2', f(x2)); set(ln, 'y2', f(y2));
            set(ln, 'stroke', c); set(ln, 'stroke-width', f(sw)); set(ln, 'opacity', op.toFixed(3));
            set(ln, 'stroke-dasharray', f(len + 2)); set(ln, 'stroke-dashoffset', f((len + 2) * (1 - dp)));
          }
          if (k === 0) {
            var ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
            var hl = G.head[0], hw = G.head[1];
            var pts = [[x2 - hl * ux + hw * nx, y2 - hl * uy + hw * ny], [x2, y2],
                       [x2 - hl * ux - hw * nx, y2 - hl * uy - hw * ny]]
              .map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ');
            var hd = n['h_' + key];
            if (hd) {
              set(hd, 'points', pts); set(hd, 'stroke', c); set(hd, 'stroke-width', f(sw));
              set(hd, 'opacity', (op * M.clamp01((dp - 0.85) / 0.15)).toFixed(3));
            }
          }
        });
      });

      // Journey axis. Left of the disc is the path already walked; right of it
      // is the path ahead, which PULL thickens and ANXIETY obstructs.
      var eL = seg(ms, 0, 320), eR = seg(ms, 150, 320);
      var l1 = G.axL, l2 = cx - G.R, r1 = cx + G.R, r2 = G.axR;
      var b2 = Math.min(G.axR, r1 + G.blk);
      var ldLen = Math.abs(l2 - l1) + 2, rdLen = Math.abs(r2 - r1) + 2;
      // Every horizontal element sits on the journey axis, and y0 moves with
      // the breakpoint, so y is written here rather than baked into the JSX.
      ['ax_l', 'ax_lhab', 'ax_r', 'ax_mask', 'ax_block', 'you_trail'].forEach(function (id) {
        set(n[id], 'y1', G.y0); set(n[id], 'y2', G.y0);
      });
      var tick = mobileRef.current ? 8 : 12;
      set(n.ax_stop, 'y1', G.y0 - tick); set(n.ax_stop, 'y2', G.y0 + tick);
      set(n.ax_block, 'stroke-dasharray', G.dash);
      set(n.you_ghost, 'cx', G.cx0); set(n.you_ghost, 'cy', G.y0); set(n.you_ghost, 'r', G.R);
      set(n.you_c, 'cy', G.y0); set(n.you_c, 'r', G.R);
      set(n.you_t, 'y', G.y0 + (mobileRef.current ? 4 : 5.5));
      ['arc_push', 'arc_habit', 'arc_pull', 'arc_anx'].forEach(function (id) {
        set(n[id], 'stroke-width', mobileRef.current ? 2 : 2.5);
      });
      [['ax_l', l1, l2], ['ax_lhab', l1, l2]].forEach(function (p) {
        set(n[p[0]], 'x1', f(p[1])); set(n[p[0]], 'x2', f(p[2]));
      });
      set(n.ax_l, 'stroke-dasharray', f(ldLen)); set(n.ax_l, 'stroke-dashoffset', f(ldLen * (1 - eL)));
      set(n.ax_lhab, 'opacity', amt(v, 'habit').toFixed(3));
      set(n.ax_r, 'x1', f(r1)); set(n.ax_r, 'x2', f(r2));
      set(n.ax_r, 'stroke-width', f(2 + 1.5 * amt(v, 'pull')));
      set(n.ax_r, 'stroke-dasharray', f(rdLen)); set(n.ax_r, 'stroke-dashoffset', f(rdLen * (1 - eR)));
      [['ax_mask', r1, b2], ['ax_block', r1, b2]].forEach(function (p) {
        set(n[p[0]], 'x1', f(p[1])); set(n[p[0]], 'x2', f(p[2]));
        set(n[p[0]], 'opacity', amt(v, 'anxiety').toFixed(3));
      });
      set(n.ax_stop, 'x1', f(b2)); set(n.ax_stop, 'x2', f(b2));
      set(n.ax_stop, 'opacity', amt(v, 'anxiety').toFixed(3));

      // Pressure: a 60° arc just outside the disc, on the side acting on it.
      var arcR = G.R + G.arcPad;
      var arc = function (a1, a2) {
        var r1a = (a1 * Math.PI) / 180, r2a = (a2 * Math.PI) / 180;
        return 'M' + f(cx + arcR * Math.cos(r1a)) + ' ' + f(G.y0 + arcR * Math.sin(r1a)) +
          ' A' + arcR + ' ' + arcR + ' 0 0 1 ' + f(cx + arcR * Math.cos(r2a)) + ' ' + f(G.y0 + arcR * Math.sin(r2a));
      };
      var left = arc(150, 210), right = arc(-30, 30);
      set(n.arc_push, 'd', left); set(n.arc_push, 'opacity', amt(v, 'push').toFixed(3));
      set(n.arc_habit, 'd', left); set(n.arc_habit, 'opacity', amt(v, 'habit').toFixed(3));
      set(n.arc_pull, 'd', right); set(n.arc_pull, 'opacity', amt(v, 'pull').toFixed(3));
      set(n.arc_anx, 'd', right); set(n.arc_anx, 'opacity', amt(v, 'anxiety').toFixed(3));

      // YOU: the disc travels, a dashed ghost stays at the origin and the gap
      // between them fills with the colour of whatever moved it.
      var youIn = seg(ms, 1250, 350), sc = 0.6 + 0.4 * youIn;
      set(n.you_trail, 'x1', f(Math.min(G.cx0, cx))); set(n.you_trail, 'x2', f(Math.max(G.cx0, cx)));
      set(n.you_trail, 'stroke', v.sx >= 0 ? FM_GREEN : FM_CORAL);
      set(n.you_trail, 'opacity', M.clamp01(Math.abs(v.sx) / G.trailN).toFixed(3));
      set(n.you_ghost, 'opacity', M.clamp01(Math.abs(v.sx) / G.ghostN).toFixed(3));
      set(n.you_g, 'opacity', youIn.toFixed(3));
      set(n.you_g, 'transform', 'translate(' + f(cx) + ' ' + G.y0 + ') scale(' + sc.toFixed(3) +
        ') translate(' + f(-cx) + ' ' + -G.y0 + ')');
      set(n.you_c, 'cx', f(cx));
      set(n.you_t, 'x', f(cx)); set(n.you_t, 'opacity', seg(ms, 1400, 200).toFixed(3));

      // Labels, questions and the intervention chips.
      FM_KEYS.forEach(function (key) {
        var i = v[key], into = seg(ms, FM_LABEL_IN[key], 400);
        var dim = M.clamp01((0.5 - i) / 0.3);
        var b = btn.current[key];
        if (!b) return;
        b.style.opacity = into.toFixed(3);
        b.style.transform = 'translate3d(0,' + ((1 - into) * 12).toFixed(2) + 'px,0)';
        b.style.setProperty('--fm-label-o', (1 - 0.62 * dim).toFixed(3));
        b.style.setProperty('--fm-q', dim > 0.5 ? '#6A6F67' : '#14201C');
      });
      if (n.ends) {
        n.ends.style.opacity = seg(ms, 150, 300).toFixed(3);
        n.ends.style.setProperty('--fm-from', amt(v, 'habit') > 0.5 ? '#AA432F' : '#6A6F67');
      }
      if (n.where) {
        var whereIn = seg(ms, 1550, 300);
        n.where.style.opacity = whereIn.toFixed(3);
        (n.chips || []).forEach(function (ch, idx) {
          if (!ch) return;
          var ci = seg(ms, 1560 + idx * 50, 240);
          ch.style.opacity = ci.toFixed(3);
          ch.style.transform = 'translate3d(0,' + ((1 - ci) * 8).toFixed(2) + 'px,0)';
        });
      }
      listRow.current.forEach(function (row, idx) {
        if (!row) return;
        var key = FM_LIST_ORDER[idx], on = S.active === key;
        var dimmed = FM_KEYS.indexOf(S.active) >= 0 && !on;
        row.style.borderTopColor = on ? FM_TEXT[key].c : 'rgba(23,25,25,0.18)';
        row.style.borderTopWidth = on ? '2px' : '1px';
        row.style.setProperty('--fm-q', dimmed ? '#6A6F67' : '#14201C');
      });
    }

    // 520ms travel between states, the same curve as --ease-travel.
    function goTo(next, instant) {
      var G = g(), to = fmTarget(next, G);
      cancelAnimationFrame(S.vraf);
      S.active = next;
      setActive(next);
      if (instant || !S.v || M.reduced) { S.v = to; paint(); return; }
      var from = Object.assign({}, S.v), t0 = performance.now();
      var step = function (now) {
        var k = M.clamp01((now - t0) / 520), ek = M.travel(k), v = {};
        Object.keys(to).forEach(function (key) { v[key] = from[key] + (to[key] - from[key]) * ek; });
        S.v = v; paint();
        if (k < 1) S.vraf = requestAnimationFrame(step);
      };
      S.vraf = requestAnimationFrame(step);
    }

    function sizeCheck() {
      var m = mq.matches;
      if (m !== mobileRef.current) {
        mobileRef.current = m;
        if (svg.current) svg.current.setAttribute('viewBox', '0 0 ' + g().w + ' ' + g().h);
        S.v = fmTarget(S.active, g());
        paint();
      }
    }
    mobileRef.current = mq.matches;
    if (svg.current) svg.current.setAttribute('viewBox', '0 0 ' + g().w + ' ' + g().h);
    S.v = fmTarget('default', g());

    // Entrance: once, at ~35% visibility, then settle at DEFAULT and wait for
    // the visitor. No cycling — that belongs to the prototype, not the page.
    S.e = 1;
    paint();
    // This entrance is 2060ms — by far the longest on the site — so it starts a
    // little before the map reaches the fold. Any later and the sequence is
    // still resolving once the map is already high on screen, which reads as
    // lag rather than as motion.
    M.onView(el, function (_, info) {
      if (info.instant) { S.e = 1; paint(); return; }
      S.e = 0; paint();
      var t0 = performance.now() + 250;
      var step = function (now) {
        S.e = M.clamp01((now - t0) / FM_ENTRANCE);
        paint();
        if (S.e < 1) S.raf = requestAnimationFrame(step);
      };
      S.raf = requestAnimationFrame(step);
    }, { margin: '0px 0px 20% 0px' });

    // Hover is transient; focus and tap are sticky until dismissed.
    el.__fmSet = function (key, sticky) { S.sticky = !!sticky; goTo(key); };
    el.__fmLeave = function () { if (!S.sticky) goTo('default'); };
    el.__fmBlur = function () { if (S.sticky) { S.sticky = false; goTo('default'); } };
    el.__fmToggle = function (key) {
      if (S.active === key && S.sticky) { S.sticky = false; goTo('default'); }
      else { S.sticky = true; goTo(key); }
    };
    if (mq.addEventListener) mq.addEventListener('change', sizeCheck);
    return function () {
      cancelAnimationFrame(S.raf); cancelAnimationFrame(S.vraf);
      if (mq.removeEventListener) mq.removeEventListener('change', sizeCheck);
      M.release(el);
    };
  }, []);

  var call = function (fn, arg) {
    return function () { var el = wrap.current; if (el && el[fn]) el[fn](arg); };
  };

  function forceButton(key, cls) {
    var t = FM_TEXT[key];
    return e('button', {
      type: 'button', className: 'fm-force fm-force--' + key + (cls ? ' ' + cls : ''),
      'aria-pressed': active === key ? 'true' : 'false',
      ref: function (n) { btn.current[key] = n; },
      onMouseEnter: call('__fmSet', key), onFocus: call('__fmSet', key),
      onClick: call('__fmToggle', key),
    },
      e('span', { className: 'fm-force__label' }, t.label),
      t.sub ? e('span', { className: 'fm-force__sub' }, t.sub) : null,
      e('span', { className: 'fm-force__q' }, t.q));
  }

  var line = function (id, extra) {
    return e('line', Object.assign({ key: id, ref: function (n) { nodes.current[id] = n; } }, extra));
  };

  return e('div', {
    className: 'fm', ref: wrap,
    onMouseLeave: call('__fmLeave'), onBlur: call('__fmBlur'),
  },
    e('div', { className: 'fm__ends', ref: function (n) { nodes.current.ends = n; } },
      e('span', { className: 'fm__end fm__end--from' }, 'Where', e('br'), 'you are'),
      e('span', { className: 'fm__end fm__end--to' }, 'Where you', e('br'), 'want to get to')),
    e('div', { className: 'fm__stage' },
      e('svg', {
        className: 'fm__svg', ref: svg, viewBox: '0 0 1336 640',
        preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true', focusable: 'false',
      },
        line('ax_l', { stroke: 'rgba(23,25,25,0.45)', strokeWidth: 1 }),
        line('ax_lhab', { stroke: FM_CORAL, strokeWidth: 2, opacity: 0 }),
        line('ax_r', { stroke: FM_GREEN, strokeWidth: 2 }),
        line('ax_mask', { stroke: '#F3F0E8', strokeWidth: 4, opacity: 0 }),
        line('ax_block', { stroke: FM_CORAL, strokeWidth: 2, strokeDasharray: '5 6', opacity: 0 }),
        line('ax_stop', { stroke: FM_CORAL, strokeWidth: 2, opacity: 0 }),
        FM_KEYS.map(function (key) {
          return [-2, -1, 0, 1, 2].map(function (k) {
            return line('l_' + key + '_' + k, { stroke: FM_TEXT[key].c, strokeWidth: 1, opacity: 0 });
          });
        }),
        FM_KEYS.map(function (key) {
          return e('polyline', {
            key: 'h_' + key, ref: function (n) { nodes.current['h_' + key] = n; },
            fill: 'none', stroke: FM_TEXT[key].c, strokeWidth: 1.4, opacity: 0, strokeLinejoin: 'miter',
          });
        }),
        line('you_trail', { stroke: FM_GREEN, strokeWidth: 3, opacity: 0 }),
        e('circle', {
          ref: function (n) { nodes.current.you_ghost = n; },
          cx: 668, cy: 320, r: 64, fill: 'none', stroke: 'rgba(23,25,25,0.34)',
          strokeWidth: 1, strokeDasharray: '3 5', opacity: 0,
        }),
        ['push', 'habit', 'pull', 'anx'].map(function (k) {
          return e('path', {
            key: 'arc_' + k, ref: function (n) { nodes.current['arc_' + k] = n; },
            fill: 'none', stroke: (k === 'push' || k === 'pull') ? FM_GREEN : FM_CORAL,
            strokeWidth: 2.5, opacity: 0,
          });
        }),
        e('g', { ref: function (n) { nodes.current.you_g = n; } },
          e('circle', { ref: function (n) { nodes.current.you_c = n; }, cx: 668, cy: 320, r: 64, fill: FM_GREEN }),
          e('text', {
            ref: function (n) { nodes.current.you_t = n; }, x: 668, y: 325.5,
            textAnchor: 'middle', fill: '#F3F0E8', className: 'fm__youlabel',
          }, 'YOU'))
      ),
      forceButton('push', 'fm-force--tl'),
      forceButton('pull', 'fm-force--tr'),
      forceButton('habit', 'fm-force--bl'),
      forceButton('anxiety', 'fm-force--br')
    ),
    // Mobile: the diagram keeps only the labels, and the questions move into
    // this list, which is where touch interaction happens.
    e('div', { className: 'fm__list' },
      FM_LIST_ORDER.map(function (key, idx) {
        var t = FM_TEXT[key];
        return e('button', {
          type: 'button', className: 'fm__row fm__row--' + key, key: key,
          'aria-pressed': active === key ? 'true' : 'false',
          ref: function (n) { listRow.current[idx] = n; },
          onClick: call('__fmToggle', key),
        },
          e('span', { className: 'fm__rowlabel' }, key === 'habit' ? 'Habit /' : t.label),
          e('span', { className: 'fm__rowq' }, t.q));
      })
    ),
    e('div', { className: 'wm-where', ref: function (n) { nodes.current.where = n; } },
      e('h3', { className: 'wm-where__h3' }, 'Where do we need to work?'),
      e('div', null,
        e('ul', { className: 'wm-where__chips' },
          INTERVENTIONS.map(function (iv, idx) {
            return e('li', {
              className: 'wm-chip wm-chip--' + iv.kind, key: iv.name,
              ref: function (n) { (nodes.current.chips = nodes.current.chips || [])[idx] = n; },
            }, iv.name);
          })
        ),
        e('p', { className: 'wm-where__note' }, 'The map helps us decide what deserves attention first.')
      )
    )
  );
}

function WmHow() {
  return e('section', { className: 'wm-how', 'aria-labelledby': 'wm-how-h' },
    e('div', { className: 'wm-container' },
      e(WmEyebrow, { num: '02', text: 'How I work' }),
      e('p', { className: 'wm-how__kicker' }, 'Influenced by Jobs to be Done'),
      e('h2', { className: 'wm-how__h2', id: 'wm-how-h' },
        'What is pushing you to change, and what is keeping you where you are?'),
      e('p', { className: 'wm-how__intro' },
        'Four forces decide whether a change actually happens. Two push you towards it: the situation becoming harder to tolerate, and something better you want instead. Two hold you in place: what the current situation still does for you, and what feels risky about changing. We map all four before deciding what to work on.'),

      e(WmForcesMap, null)
    )
  );
}


function WmFit() {
  var root = R.useRef(null);
  R.useEffect(function () {
    var M = window.Motion, el = root.current;
    if (!el || !M) return;
    var BONE = [243, 240, 232], BONE_DEEP = [237, 232, 219];
    var rows = el.querySelectorAll('.wm-fit__item');
    // Handoff H3 is an entrance, not a scrub: once it has run it stays run.
    M.track(el, {
      once: true,
      from: 0.95, to: 0.62,
      onProgress: function (p) {
        el.style.setProperty('--fit-bg', M.mix(BONE, BONE_DEEP, M.win(p, 0.2, 0.5)));
        el.style.setProperty('--fit-col', M.win(p, 0.42, 0.3).toFixed(3));
        rows.forEach(function (row, i) {
          row.style.setProperty('--fit-r', M.win(p, 0.52 + (i % 3) * 0.07, 0.28).toFixed(3));
        });
      },
    });
    return function () { M.release(el); };
  }, []);

  function column(heading, items, mark, no) {
    return e('div', null,
      e('h3', { className: 'wm-fit__h3' + (no ? ' wm-fit__h3--no' : '') }, heading),
      e('span', { className: 'wm-fit__rule' + (no ? ' wm-fit__rule--no' : ''), 'aria-hidden': 'true' }),
      e('ul', { className: 'wm-fit__list' },
        items.map(function (t, i) {
          return e('li', { className: 'wm-fit__item', key: i },
            e('span', { className: 'wm-fit__mark' + (no ? ' wm-fit__mark--no' : ''), 'aria-hidden': 'true' }, mark),
            e('span', null, t));
        })
      )
    );
  }
  return e('section', { className: 'wm-fit', 'aria-labelledby': 'wm-fit-h', ref: root },
    e('div', { className: 'wm-container' },
      e(WmEyebrow, { as: 'h2', num: '03', text: 'Fit and questions', className: 'wm-fit__h2' }),
      e('div', { className: 'wm-fit__grid' },
        column('Good fit', FIT_YES, '✓', false),
        column('Probably not', FIT_NO, '✕', true)
      ),
      // <details> rather than a JS accordion: the answers stay in the HTML for
      // crawlers and for anyone without JavaScript, and still collapse visually.
      e('h3', { className: 'wm-faq__h3' }, 'Common questions'),
      e('div', { className: 'wm-faq' },
        FAQ.map(function (item, i) {
          return e('details', { key: i },
            e('summary', null, e('span', null, item.q)),
            e('p', { className: 'wm-faq__a' }, item.a));
        })
      )
    )
  );
}

function WmFinal() {
  return e('section', { className: 'wm-final' },
    e('div', { className: 'wm-final__in' },
      e('h2', { className: 'wm-final__h2' }, 'Tell me what you’re working on.'),
      e('p', { className: 'wm-final__p' },
        'Send me a short description before we meet. I read it myself and use it to decide whether I can be useful.'),
      e(WmCta)
    )
  );
}

// ─── Page shell ──────────────────────────────────────────────────────────────
function WorkWithMePage() {
  return e(React.Fragment, null,
    e(window.ChromeStyles),
    e(WorkWithMeStyles),
    e(window.SiteHeader, { page: 'work-with-me', lang: 'en' }),
    e('main', { className: 'wm' },
      e(WmHero),
      e(WmProof),
      e(WmScope),
      e(WmHow),
      e(WmFit),
      e(WmFinal)
    ),
    e(window.SiteFooterX, { lang: 'en' })
  );
}

// ─── Mount ───────────────────────────────────────────────────────────────────
// The static <title> in the page's <head> is authoritative for SEO, so this
// does not touch document.title.
function renderWorkWithMe() {
  var root = document.getElementById('root');
  if (!root) { return; }
  ReactDOM.createRoot(root).render(e(WorkWithMePage));
}

Object.assign(window, { renderWorkWithMe: renderWorkWithMe, WorkWithMePage: WorkWithMePage, WM_FAQ: FAQ });
