// site-chrome.jsx — shared production chrome + universal content layout.
// Plain React, compiled by babel like the other .jsx bundles. Loaded on every
// page, before the page's own bundle. Exposes on window:
//   SITE, CHROME_PATHS, EXTERNAL, cPath, cT, BrandIcon, ChromeStyles, Motion,
//   SiteHeader, SiteFooterX, BlackCtaStrip, UniversalContentLayout, LegacyShell,
//   NAV, FOOTER_NAV, CONTACT_URL, FREE_TOOLS_URL, FREE_TOOL_LINKS, currentPath
//
// One green across the whole site: #047857.

// ── Editorial Japandi palette — the entire colour system (ten tokens) ──
// bone/bone-deep = light grounds; forest/forest-deep = dark grounds; green =
// accent on light; sage = accent on forest; ink/ink-2 = text on light;
// on-forest = body on dark; meta = muted on light. Any colour outside this set
// maps to the nearest token — no new values are introduced.
const SITE = {
  bone:         '#F3F0E8',  // primary page ground (retires page-white)
  boneDeep:     '#EDE8DB',  // second light band when two light sections adjoin
  forest:       '#16231E',  // dark sections / header / footer / dark cards
  forestDeep:   '#101A16',  // code blocks, inset panels, dropdown grounds
  green:        '#047857',  // buttons, eyebrows on light, 2px key rules (unchanged)
  greenPressed: '#03654A',  // explicit hover for every green surface
  sage:         '#8FBFA7',  // every accent that sits on forest
  inkText:      '#171919',  // text on light
  headingInk:   '#14201C',  // headings on light
  ink2:         '#3A403A',  // body copy on light
  onForest:     '#C0C9BF',  // body copy on dark
  metaLight:    '#6A6F67',  // meta on light (replaces #626764)

  // ── Back-compat aliases: existing key names → nearest Japandi token, so every
  //    file that already reads window.SITE keeps working after the recolour. ──
  ink:        '#16231E',  // "dark ground" role → forest
  heroInk:    '#14201C',  // heading ink on light
  paper:      '#F3F0E8',  // = bone
  black:      '#101A16',  // → forest-deep (nearest)
  white:      '#F3F0E8',  // page-white retired → bone (also light text on dark)
  onDark:     '#C0C9BF',  // = on-forest
  greyOnDark: '#C0C9BF',  // muted-on-dark → on-forest
  meta:       '#6A6F67',  // = meta on light
  rule:       'rgba(23,25,25,0.18)',    // 1px hairline on light
  ruleOnDark: 'rgba(243,240,232,0.16)', // 1px hairline on forest
  // Type roles map onto global CSS custom properties (defined in :root below and
  // in the core-shell <head>). display = heading face (Inter Tight); archivo =
  // display face (Archivo Black EN / Inter Tight 800 EL); body = Inter.
  display: 'var(--font-heading)',
  body: 'var(--font-body)',
  archivo: 'var(--font-display)',
};

// ─── Routes ──────────────────────────────────────────────────────────────────
// The site is English-only: the Greek (/el/) pages are retired and there is no
// language switch. cPath() keeps its (id, lang) signature so older callers keep
// working; lang is ignored.
const CHROME_PATHS = {
  'home':            { en: '/' },
  'about':           { en: '/about/' },
  'work-with-me':    { en: '/work-with-me/' },
  'reviews':         { en: '/reviews/' },
  'contact':         { en: '/contact/' },
  'confidentiality': { en: '/confidentiality/' },
  'blog':            { en: '/blog/' },
  'free-tools':      { en: '/free-tools/' },
  'faq':             { en: '/faq/' },
  'considering-therapy': { en: '/considering-therapy/' },
};
function cPath(id) {
  const p = CHROME_PATHS[id];
  return p ? p.en : '/';
}

const EXTERNAL = {
  undisguised: 'https://www.undisguised.io/',
  linkedin: 'https://linkedin.com/in/growth-product-manager/',
  youtube: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
  instagram: 'https://www.instagram.com/_aggelosmouzakitis_/',
  tiktok: 'https://www.tiktok.com/@aggelosmouz',
};
const ext = { target: '_blank', rel: 'noopener noreferrer' };

// Chrome strings. Labels come from the final editorial copy (its "Final
// navigation" and primary CTA); the rest are structural UI words.
const CHROME_T = {
  en: {
    home: 'Home',
    cta: 'Book a consultation',
    role: 'BACP-registered psychotherapist',
    follow: 'Follow',
    confidentiality: 'Confidentiality',
    menu: 'Menu', closeMenu: 'Close menu', rights: 'All rights reserved.',
  },
};
const cT = () => CHROME_T.en;

// The primary call to action everywhere on the site.
const CONTACT_URL = '/contact/';
const WORK_WITH_ME_URL = '/work-with-me/';
const FREE_TOOLS_URL = '/free-tools/';
// The two tools that stay public. The business tools, Find Your Focus Area and
// Roast My Offer are retired (redirected in netlify.toml).
const FREE_TOOL_LINKS = [
  { name: 'Are you burned out?', href: '/free-tools/burned-out/', id: 'burned-out' },
  { name: "What's making you want to quit your job?", href: '/free-tools/quit-your-job/', id: 'quit-your-job' },
];

// ─── Navigation model ────────────────────────────────────────────────────────
// Group and item labels are the editorial "Final navigation". Two deliberate
// readings of it: the editorial's single "Relationships & Separation" entry
// becomes its two pages, and Reviews stays out of the header — the editorial
// places Reviews, Contact and Confidentiality in the footer and in context.
// `overview` is the group's own hub page, shown as the panel's first link.
const NAV = [
  { id: 'work', label: 'Work with me', overview: { label: 'Work with me', href: '/work-with-me/' }, items: [
    { label: 'Individual Psychotherapy', href: '/individual-psychotherapy/' },
    { label: 'Couples Therapy', href: '/couples-therapy/' },
    { label: 'Professional Coaching', href: '/professional-coaching/' },
  ] },
  { id: 'who', label: 'Who I work with', items: [
    { label: 'Men in Tech & Demanding Careers', href: '/therapy-for-men-in-tech/' },
    { label: 'Founders & Business Owners', href: '/therapy-for-founders/' },
    { label: 'Executives & Leaders', href: '/therapy-for-executives/' },
    { label: 'Greek-speaking Psychotherapy', href: '/greek-speaking-psychotherapist/' },
  ] },
  // One grouped panel rather than seven top-level items: the relationship pages
  // in one column, everything else in the other.
  { id: 'problems', label: 'Common problems', columns: [
    [
      { label: 'Relationship Problems', href: '/relationship-problems-men/' },
      { label: 'Separation & Divorce', href: '/separation-divorce-men/' },
      { label: 'Work & Relationships', href: '/work-affecting-relationship/' },
    ],
    [
      { label: 'Burnout & Can’t Switch Off', href: '/executive-burnout-therapy/' },
      { label: 'Career Change & Decisions', href: '/career-transition-therapy/' },
      { label: 'Anxiety & Overthinking', href: '/anxiety-overthinking/' },
      { label: 'Achievement & Self-Worth', href: '/achievement-self-worth/' },
    ],
  ] },
  { id: 'about', label: 'About', href: '/about/' },
  { id: 'resources', label: 'Resources', items: [
    { label: 'Considering Therapy', href: '/considering-therapy/' },
    { label: 'Writing', href: '/blog/' },
    { label: 'Free Tools', href: '/free-tools/' },
    { label: 'FAQ', href: '/faq/' },
  ] },
];
const navLinks = (g) => (g.columns ? [].concat.apply([], g.columns) : (g.items || []));

// Footer groups (implementation brief, Phase 4). Shorter labels than the header.
const FOOTER_NAV = [
  { label: 'Work with me', items: [
    { label: 'Individual Psychotherapy', href: '/individual-psychotherapy/' },
    { label: 'Couples Therapy', href: '/couples-therapy/' },
    { label: 'Professional Coaching', href: '/professional-coaching/' },
  ] },
  { label: 'Who I work with', items: [
    { label: 'Men in Tech', href: '/therapy-for-men-in-tech/' },
    { label: 'Founders', href: '/therapy-for-founders/' },
    { label: 'Executives', href: '/therapy-for-executives/' },
    { label: 'Greek-speaking Psychotherapy', href: '/greek-speaking-psychotherapist/' },
  ] },
  { label: 'Problems', items: [
    { label: 'Relationships', href: '/relationship-problems-men/' },
    { label: 'Separation & Divorce', href: '/separation-divorce-men/' },
    { label: 'Work & Relationships', href: '/work-affecting-relationship/' },
    { label: 'Burnout', href: '/executive-burnout-therapy/' },
    { label: 'Career Change', href: '/career-transition-therapy/' },
    { label: 'Anxiety & Overthinking', href: '/anxiety-overthinking/' },
    { label: 'Achievement & Self-Worth', href: '/achievement-self-worth/' },
  ] },
  { label: 'Resources', items: [
    { label: 'Considering Therapy', href: '/considering-therapy/' },
    { label: 'Writing', href: '/blog/' },
    { label: 'Free Tools', href: '/free-tools/' },
    { label: 'FAQ', href: '/faq/' },
    { label: 'Reviews', href: '/reviews/' },
  ] },
  // Terms and Privacy links return here once that text exists; the anchors
  // they used to point at (#terms, #privacy) were never on the page.
  { label: 'About', items: [
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Confidentiality', href: '/confidentiality/' },
  ] },
];

// Which page is current: the pathname, normalised to a trailing slash
// ("/about/index.html" and "/about" both read as "/about/").
function currentPath() {
  if (typeof window === 'undefined' || !window.location) return '';
  const p = (window.location.pathname || '/').replace(/index\.html$/, '');
  return p.endsWith('/') ? p : p + '/';
}

// ─── Stylesheet ──────────────────────────────────────────────────────────────
// The legacy page shell (scripts/gen-core-pages.js) still ships the sidebar-era
// rules: html,body,#root{height:100%}, #root{display:flex}, #main-scroll{overflow-y:auto}
// and its old accent link colour. Rather than rewrite that generator's CSS,
// the first block below neutralises those rules with equal-or-higher specificity.
const CHROME_CSS = `
:root{
  --font-body:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-heading:"Inter Tight","Inter",system-ui,sans-serif;
  --font-display:"Archivo Black","Inter Tight","Inter",system-ui,sans-serif;
  --brand-green:${SITE.green};
  /* Editorial Japandi palette (ten tokens) */
  --bone:${SITE.bone};--bone-deep:${SITE.boneDeep};--forest:${SITE.forest};--forest-deep:${SITE.forestDeep};
  --green:${SITE.green};--green-pressed:${SITE.greenPressed};--sage:${SITE.sage};
  --ink:${SITE.inkText};--heading-ink:${SITE.headingInk};--ink-2:${SITE.ink2};--on-forest:${SITE.onForest};--meta:${SITE.metaLight};
  --rule:${SITE.rule};--rule-on-forest:${SITE.ruleOnDark};
  /* Coral — resistance, anxiety, friction, blocked movement. Green stays
     progress, forest depth, bone the editorial canvas. Four values because one
     coral cannot carry small text on bone, large graphics and text on forest at
     once: --coral is graphics and large emphasis, --coral-ink is small coral
     text on light ground (5.2:1 on bone, where --coral manages only 3.6:1),
     --coral-on-forest is coral on the dark ground, --coral-tint the chip wash.
     Supersedes the page-scoped --wm-clay. */
  --coral:#CF5A3D;
  --coral-ink:#AA432F;
  --coral-on-forest:#E4896C;
  --coral-tint:#F6E2DE;
  /* Motion. Two easings: settle for things arriving and coming to rest, travel
     for things crossing distance. No bounce, no spring anywhere. */
  --ease-settle:cubic-bezier(.22,1,.36,1);
  --ease-travel:cubic-bezier(.65,0,.35,1);
  --dur-hover:180ms;
  --dur-nudge:220ms;
  --dur-rule:260ms;
  --dur-draw:360ms;
  --dur-text:480ms;
  --dur-state:520ms;
  --stagger-line:40ms;
  --stagger-item:60ms;
  --stagger-row:80ms;
  --rise:12px;
  /* The one page canvas: header, hero, every section container and the footer
     resolve against it, so the whole page shares a single grid instead of the
     three it used to have (1320 / 1280 / 1280, each with its own gutter).
     Fluid to the viewport minus a gutter, capped so the eye still has an edge
     to work against on very large screens.
       - up to ~1040px the 5vw ramp binds and matches the old container exactly,
         so phones and tablets are pixel-identical;
       - through the laptop band the 52px gutter holds proportions close to what
         they were (header and hero sat on a flat 32px gutter, the sections on
         5vw — this lands between the two and finally aligns them);
       - past ~1664px the cap takes over at 1560 instead of 1280/1320.
     Individual text blocks keep their own smaller measures on top of this. */
  --page-max:1560px;
  --page-gutter:clamp(20px,5vw,52px);
  --page-canvas:min(var(--page-max),calc(100% - 2 * var(--page-gutter)));
}
html,body,#root{height:auto}
/* Every page except /work-with-me/ carries a star-selector margin reset in its
   own static preamble; that page was authored later and never got one, so the UA's
   8px body margin survived and inset the whole page — full-bleed header and
   section backgrounds included — by 8px, which also made the page canvas
   resolve 16px narrower there than everywhere else. Zero it here so the chrome
   guarantees it on every page instead of each page having to remember. */
*,*::before,*::after{box-sizing:border-box}
body{margin:0}
#root{display:block;overflow:visible}
#sidebar{display:none!important}
#main-scroll{overflow:visible;background:${SITE.bone};color:${SITE.inkText}}
#main-scroll::-webkit-scrollbar{width:0}
body{background:${SITE.bone};color:${SITE.inkText};font-family:${SITE.body};font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
::selection{background:${SITE.green};color:${SITE.bone}}
#main-scroll a,a{color:inherit;text-decoration:none}
#main-scroll strong{border:0;padding:0;color:inherit;font-weight:600}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid ${SITE.green};outline-offset:2px;border-radius:2px}
/* Global photographic duotone — no full-colour photography anywhere (avatars, OG, portraits) */
img{max-width:100%;filter:grayscale(1) contrast(1.12) brightness(0.96) sepia(0.14)}
/* Single page-level film grain: one overlay per page, above content, below modals */
.site-grain{position:fixed;inset:0;pointer-events:none;z-index:90;opacity:0.40;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='160'%3E%3Cfilter%20id='g'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23g)'/%3E%3C/svg%3E");background-size:160px 160px}
@media print{.site-grain{display:none}}

.site-container{width:var(--page-canvas);margin-inline:auto}

/* Skip link: first focusable element on every page, visible only on focus. */
.skip-link{position:absolute;left:12px;top:-80px;z-index:300;padding:12px 18px;background:${SITE.bone};color:${SITE.inkText};font-size:15px;font-weight:700;box-shadow:0 0 0 3px ${SITE.green};transition:top .15s}
.skip-link:focus{top:12px}
.site-hdr{position:relative;z-index:200;width:100%;min-height:76px;background:${SITE.ink};border-bottom:1px solid rgba(243,240,232,0.16)}
/* Logo hard-left; nav and the Book a consultation CTA grouped hard-right. */
.site-hdr__in{width:var(--page-canvas);min-height:76px;display:flex;align-items:center;gap:22px}
.site-hdr__in>*{min-width:0}
.site-hdr__brand{display:inline-flex;align-items:flex-end;gap:1px;color:${SITE.paper};font-family:${SITE.display};font-size:26px;font-weight:750;line-height:1;letter-spacing:-0.035em;white-space:nowrap}
.site-hdr__brand span{color:${SITE.green}}
.site-hdr__nav{margin-left:auto}
.site-hdr__list{display:flex;align-items:center;gap:6px;margin:0;padding:0;list-style:none}
.site-hdr__item{position:relative}
/* Top-level entries: links and panel toggles share one look. */
.site-hdr__top{display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:0 10px;background:none;border:0;border-radius:0;cursor:pointer;font:inherit;color:${SITE.paper};font-size:14px;font-weight:650;line-height:1;text-transform:uppercase;letter-spacing:0.04em;opacity:.84;transition:opacity .18s;white-space:nowrap}
.site-hdr__top:hover,.site-hdr__top[aria-expanded="true"]{opacity:1}
.site-hdr__top>span:first-child{padding-block:4px 2px;border-bottom:2px solid transparent}
.site-hdr__top[aria-current] >span:first-child,.site-hdr__top.is-current>span:first-child{border-bottom-color:${SITE.green}}
.site-hdr__top[aria-current],.site-hdr__top.is-current{opacity:1}
.site-hdr__chev{width:9px;height:9px;flex-shrink:0;transition:transform var(--dur-hover) var(--ease-settle)}
.site-hdr__top[aria-expanded="true"] .site-hdr__chev{transform:rotate(180deg)}
/* Dropdown panels: forest-deep, a 2px green top rule like the footer. */
.site-hdr__panel{position:absolute;top:calc(100% + 16px);left:0;min-width:300px;padding:18px 0 14px;background:${SITE.forestDeep};border:1px solid ${SITE.ruleOnDark};border-top:2px solid ${SITE.green};box-shadow:0 18px 40px rgba(16,26,22,0.28)}
.site-hdr__panel[hidden]{display:none}
.site-hdr__item--end .site-hdr__panel{left:auto;right:0}
.site-hdr__panel--wide{display:grid;grid-template-columns:repeat(2,minmax(250px,1fr));min-width:560px}
.site-hdr__panel ul{margin:0;padding:0;list-style:none}
.site-hdr__panel a{display:block;padding:10px 22px;color:${SITE.onForest};font-size:15px;line-height:1.35;text-transform:none;letter-spacing:0;transition:color .18s,background .18s}
.site-hdr__panel a:hover{color:${SITE.bone};background:rgba(143,191,167,0.08)}
.site-hdr__panel a[aria-current]{color:${SITE.bone};box-shadow:inset 3px 0 0 ${SITE.green}}
.site-hdr__panel .site-hdr__over{display:flex;align-items:center;gap:8px;margin-bottom:6px;padding-bottom:12px;border-bottom:1px solid ${SITE.ruleOnDark};color:${SITE.sage};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
.site-hdr__panel .site-hdr__over:hover{color:${SITE.bone}}
.site-hdr__end{display:flex;align-items:center;gap:14px}
.hdr-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 20px;background:${SITE.green};color:${SITE.bone};font-size:14px;font-weight:750;line-height:1;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;border-radius:0;transition:filter .18s,gap .18s}
.hdr-cta:hover{background:${SITE.greenPressed};gap:11px}
.site-hdr__burger{display:none;width:44px;height:44px;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:none;border:0;cursor:pointer}
.site-hdr__burger span{display:block;width:24px;height:2px;background:${SITE.paper};transition:transform var(--dur-hover) var(--ease-settle),opacity var(--dur-hover)}
.site-hdr__burger[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.site-hdr__burger[aria-expanded="true"] span:nth-child(2){opacity:0}
.site-hdr__burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
/* Mobile / tablet menu: the same hierarchy as the desktop panels, as
   accordions, so twenty-odd links never arrive as one flat list. */
.site-menu{position:relative;z-index:210;background:${SITE.ink};border-bottom:1px solid rgba(243,240,232,0.16);padding-block:8px 28px}
.site-menu[hidden]{display:none}
.site-menu__list{margin:0;padding:0;list-style:none}
.site-menu__group{border-bottom:1px solid ${SITE.ruleOnDark}}
.site-menu__top{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;min-height:56px;padding:0;background:none;border:0;cursor:pointer;font:inherit;color:${SITE.paper};font-size:16px;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;text-align:left}
.site-menu__top[aria-current]{color:${SITE.sage}}
.site-menu__top .site-hdr__chev{width:11px;height:11px}
.site-menu__top[aria-expanded="true"] .site-hdr__chev{transform:rotate(180deg)}
.site-menu__sub{margin:0;padding:0 0 14px;list-style:none}
.site-menu__sub[hidden]{display:none}
.site-menu__sub a{display:block;padding:9px 0 9px 16px;border-left:1px solid ${SITE.ruleOnDark};color:${SITE.onForest};font-size:16px;line-height:1.35}
.site-menu__sub a[aria-current]{color:${SITE.bone};border-left:2px solid ${SITE.green};padding-left:15px}
.site-menu .hdr-cta{display:flex;width:100%;margin-top:24px;min-height:52px;font-size:13px}

.pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;font-weight:700;white-space:nowrap;transition:gap .18s,filter .18s}
.pill--green{height:72px;padding-inline:44px;background:${SITE.green};color:${SITE.bone};font-size:16px}
.pill--green:hover{gap:12px;background:${SITE.greenPressed}}
.hero-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:55px;padding:0 24px;background:${SITE.green};color:${SITE.bone};font-size:16px;font-weight:600;letter-spacing:0.01em;white-space:nowrap;border-radius:0;transition:filter .18s,gap .18s}
.hero-cta:hover{background:${SITE.greenPressed};gap:13px}

.cta-strip{padding-block:clamp(86px,10.8vw,132px);text-align:center;background:${SITE.ink}}
.cta-strip__h{margin:0 auto;max-width:20ch;font-family:${SITE.display};font-synthesis:none;font-size:clamp(36px,4.4vw,60px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:${SITE.bone};text-wrap:balance}
.cta-strip .pill--green{margin-top:44px}
.cta-strip__soft{display:inline-flex;align-items:center;gap:9px;margin-top:26px;font-size:14px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:${SITE.sage};transition:gap .18s,color .18s}
.cta-strip__soft:hover{gap:13px;color:${SITE.bone}}
.cta-strip__softrow{display:flex;flex-wrap:wrap;justify-content:center;column-gap:36px}
.cta-strip__sub{display:inline-flex;gap:8px;margin-top:24px;font-size:15px;color:${SITE.onDark};transition:gap .18s,color .18s}
.cta-strip__sub:hover{gap:12px;color:${SITE.bone}}

.site-ftr{border-top:2px solid ${SITE.green};padding-block:64px 32px;background:${SITE.ink};color:${SITE.onForest}}
.site-ftr__cols{display:grid;grid-template-columns:minmax(200px,1.15fr) repeat(5,minmax(0,1fr));gap:36px;align-items:start}
.site-ftr__head{margin:0 0 18px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${SITE.sage}}
.site-ftr__col ul{margin:0;padding:0;list-style:none}
.site-ftr__col li{margin-bottom:11px}
.site-ftr a{color:${SITE.onForest};transition:color .18s}
.site-ftr a:hover{color:${SITE.bone}}
.site-ftr__col a{font-size:15px;line-height:1.4}
.site-ftr__role{margin:18px 0 0;font-size:15px;line-height:1.4;color:${SITE.onDark}}
.site-ftr__social{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}
.site-ftr__social a{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid ${SITE.ruleOnDark}}
.site-ftr__social a:hover{border-color:${SITE.sage}}
.site-ftr__rule{height:1px;background:${SITE.ruleOnDark};margin-block:48px 24px}
.site-ftr__legal{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;font-size:13px;color:${SITE.onDark}}

.u-hero{background:${SITE.bone};padding-block:106px 86px}
.u-hero h1{margin:0;max-width:15ch;font-family:${SITE.display};font-synthesis:none;font-size:clamp(52px,5.8vw,82px);font-weight:800;line-height:0.96;letter-spacing:-0.05em;color:${SITE.headingInk}}
.u-hero p{max-width:65ch;margin:32px 0 0;font-size:21px;line-height:1.55;color:${SITE.ink2}}
.u-main{background:${SITE.bone};padding-block:0 115px;color:${SITE.inkText}}

/* ── Shared inner-page shell: asymmetrical editorial grid (rail | reading column | gutter) ── */
.u-shell{max-width:1180px;margin-inline:auto;padding-inline:clamp(24px,5vw,72px);display:grid;grid-template-columns:minmax(120px,170px) minmax(0,760px) minmax(0,1fr);column-gap:clamp(28px,4vw,64px)}
.u-shell--wide{grid-template-columns:minmax(120px,170px) minmax(0,860px) minmax(0,1fr)}
.u-shell__rail{grid-column:1;min-width:0}
.u-shell__rail::before{content:"";display:block;width:100%;height:3px;background:var(--brand-green,${SITE.green})}
.u-shell__rail .u-eyebrow{display:block;margin-top:16px;font-family:${SITE.body};font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.10em;text-transform:uppercase;color:${SITE.green}}
.u-shell__body{grid-column:2;min-width:0}
.u-shell__gutter{grid-column:3}

.u-read,.u-shell__body{font-size:19px;line-height:1.72;color:${SITE.inkText}}
.u-read{width:min(740px,calc(100% - 40px));margin-inline:auto}
.u-read h1,.u-shell__body h1{font-family:${SITE.display};font-synthesis:none;font-size:clamp(48px,5vw,64px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;margin:0 0 32px}
.u-read h2,.u-shell__body h2{margin:80px 0 24px;font-family:${SITE.display};font-synthesis:none;font-size:clamp(32px,3.6vw,46px);font-weight:800;line-height:1.04;letter-spacing:-0.04em}
.u-read h3,.u-shell__body h3{margin:48px 0 16px;font-family:${SITE.display};font-synthesis:none;font-size:clamp(24px,2.8vw,32px);font-weight:750;line-height:1.1;letter-spacing:-0.03em}
.u-read p + p,.u-shell__body p + p{margin-top:24px}
.u-read ul,.u-read ol,.u-shell__body ul,.u-shell__body ol{margin:24px 0;padding-left:24px}
.u-read li + li,.u-shell__body li + li{margin-top:12px}
#main-scroll .u-read a,.u-read a,.u-shell__body a{color:${SITE.green};text-decoration:underline;text-underline-offset:3px}
.u-read blockquote,.u-shell__body blockquote{margin:48px 0;padding-left:28px;border-left:4px solid ${SITE.green};font-family:${SITE.display};font-size:28px;line-height:1.3}
.u-read hr,.u-shell__body hr{border:0;border-top:1px solid ${SITE.rule};margin:64px 0}
.u-read img,.u-shell__body img{display:block;height:auto;margin:48px 0}
.u-form{width:min(760px,calc(100% - 40px));margin-inline:auto}

/* One shared branded callout for deeper pages (dark band, warm text, green rule) */
.u-callout{margin:40px 0;padding:26px 30px;background:${SITE.forest};color:${SITE.bone};border-left:3px solid ${SITE.sage};border-radius:0}
.u-callout :is(p,li){color:${SITE.onForest}}
.u-callout > *:first-child{margin-top:0}
.u-callout > *:last-child{margin-bottom:0}

.u-faq details{border-top:1px solid ${SITE.rule};padding:20px 0}
.u-faq details:last-of-type{border-bottom:1px solid ${SITE.rule}}
.u-faq summary{display:flex;justify-content:space-between;align-items:baseline;gap:24px;cursor:pointer;list-style:none;font-weight:600;font-size:20px;line-height:1.4}
.u-faq summary::-webkit-details-marker{display:none}
.u-faq summary::after{content:"+";color:${SITE.green};font-size:26px;line-height:1;flex-shrink:0}
.u-faq details[open] summary::after{content:"\\2212"}
.u-faq details > *:not(summary){margin-top:16px}
.u-faq--dark details{border-color:${SITE.ruleOnDark}}
.u-faq--dark summary{color:${SITE.bone}}
.u-faq--dark summary::after{color:${SITE.sage}}
.u-faq--dark details > *:not(summary){color:${SITE.onDark}}

.u-related a{display:flex;justify-content:space-between;gap:24px;padding:20px 0;border-top:1px solid ${SITE.rule};color:${SITE.inkText}}
.u-related a:last-child{border-bottom:1px solid ${SITE.rule}}
.u-related a:hover{color:${SITE.green}}

.u-notice{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;padding:24px 0;border-top:1px solid ${SITE.rule};border-bottom:1px solid ${SITE.rule};margin-bottom:56px}
.u-notice p{margin:0;font-size:19px;line-height:1.5;max-width:52ch}
.u-notice a{font-weight:700;font-size:14px;letter-spacing:0.06em;color:${SITE.green}}

/* Footer: six columns on wide screens, then three, then two, then one. */
@media (max-width:1180px){.site-ftr__cols{grid-template-columns:repeat(3,minmax(0,1fr));gap:40px 32px}.site-ftr__brand{grid-column:1 / -1}}
@media (max-width:640px){.site-ftr__cols{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:400px){.site-ftr__cols{grid-template-columns:1fr}}
/* Header: five nav entries plus the CTA need ~1180px. Below that the entries
   move into the menu; the CTA stays in the bar down to phone widths. */
@media (max-width:1199px){
  .site-hdr__nav{display:none}
  .site-hdr__end{margin-left:auto}
  .site-hdr__burger{display:flex;margin-left:6px}
  .site-menu .hdr-cta{display:none}
}
@media (min-width:1200px){.site-menu{display:none!important}}
@media (max-width:680px){
  .site-hdr,.site-hdr__in{min-height:68px}
  .site-hdr__brand{font-size:23px}
  .site-hdr__end .hdr-cta{display:none}
  .site-menu .hdr-cta{display:flex}
}
@media (max-width:900px){
  .u-shell,.u-shell--wide{grid-template-columns:1fr;column-gap:0}
  .u-shell__rail{grid-column:1;margin-bottom:20px}
  .u-shell__rail::before{width:56px}
  .u-shell__rail .u-eyebrow{margin-top:12px}
  .u-shell__body{grid-column:1}
  .u-shell__gutter{display:none}
}
@media (max-width:640px){
  .site-ftr__legal{flex-direction:column;align-items:flex-start;gap:20px}
  .u-hero{padding-block:67px 58px}
  .u-read,.u-shell__body{font-size:18px}
  .u-read h2,.u-shell__body h2{margin-top:56px}
}
@media (max-width:680px){
  .pill--green{max-width:100%;padding-inline:clamp(22px,6.5vw,44px);font-size:clamp(15px,2.35vw,16px)}
}
@media (max-width:520px){
  .cta-strip__h{font-size:clamp(28px,6.9vw,36px)}
}
@media (max-width:420px){
  .hero-cta{padding-inline:16px}
}
@media (max-width:360px){
  .hero-cta{max-width:100%;padding-inline:16px;gap:8px}
}
/* ── Shared motion primitives ────────────────────────────────────────────────
   Every rule here is gated on .mo, which window.Motion puts on <html> at
   runtime and only when motion is allowed. Nothing is hidden by a stylesheet,
   so the prerendered page is complete and readable with JS disabled, and a
   reduced-motion visitor never gets .mo and therefore lands on the final state
   with no transition to sit through. Motion also refuses to arm anything that
   is already on screen when it initialises, so arming can never blank or move
   content the visitor is looking at. */
.mo [data-mo]{opacity:0}
.mo [data-mo="rise"]{transform:translate3d(0,var(--rise),0)}
.mo [data-mo="rise-sm"]{transform:translate3d(0,calc(var(--rise) / 2),0)}
.mo [data-mo].is-in{opacity:1;transform:none;
  transition:opacity var(--dur-text) var(--ease-settle) var(--mo-delay,0ms),transform var(--dur-text) var(--ease-settle) var(--mo-delay,0ms)}
/* Rules that grow from an origin rather than fading in. */
.mo [data-mo="rule-l"],.mo [data-mo="rule-r"]{opacity:1;transform:scaleX(0)}
.mo [data-mo="rule-l"]{transform-origin:left center}
.mo [data-mo="rule-r"]{transform-origin:right center}
.mo [data-mo^="rule-"].is-in{transform:scaleX(1);
  transition:transform var(--dur-rule) var(--ease-settle) var(--mo-delay,0ms)}
/* SVG line drawing. Motion.draw() sets pathLength="1" so one dash length
   covers any geometry and the offset is a plain 0–1 number. */
.mo [data-mo-draw]{stroke-dasharray:1;stroke-dashoffset:1}
.mo [data-mo-draw].is-in{stroke-dashoffset:0;
  transition:stroke-dashoffset var(--dur-draw) var(--ease-travel) var(--mo-delay,0ms)}
@media (prefers-reduced-motion: reduce){*{transition-duration:.001ms!important;animation-duration:.001ms!important}}
@media print{#sidebar{display:none!important}.site-hdr,.site-ftr,.cta-strip{display:none!important}}
`;

function ChromeStyles() {
  return React.createElement('style', { dangerouslySetInnerHTML: { __html: CHROME_CSS } });
}

// ─── Brand icons (monochrome, currentColor) ──────────────────────────────────
const BRAND_PATHS = {
  LinkedIn: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z',
  Instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 7.85a4.15 4.15 0 1 0 0 8.3 4.15 4.15 0 0 0 0-8.3zm0 6.85a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.28-7.01a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z',
  YouTube: 'M23.5 6.51a3.02 3.02 0 0 0-2.12-2.14C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.51C0 8.4 0 12 0 12s0 3.6.5 5.49a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.49zM9.55 15.57V8.43L15.82 12l-6.27 3.57z',
  TikTok: 'M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .8-5.05V9.7a5.7 5.7 0 0 0-.8-.06 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48z',
};
function BrandIcon({ name, size }) {
  const s = size || 16;
  return React.createElement('svg', {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true',
    style: { flexShrink: 0 },
  }, React.createElement('path', { d: BRAND_PATHS[name] }));
}

function Wordmark() {
  return React.createElement('a', { className: 'site-hdr__brand', href: '/', 'aria-label': 'Aggelos Mouzakitis, home' },
    'Aggelos', React.createElement('span', null, '.')
  );
}

function Chevron() {
  return React.createElement('svg', { className: 'site-hdr__chev', viewBox: '0 0 10 10', 'aria-hidden': 'true', focusable: 'false' },
    React.createElement('path', { d: 'M1.5 3.5 5 7l3.5-3.5', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
// Disclosure navigation (WAI-ARIA APG "disclosure navigation menu"): each group
// is a button that shows or hides a list of ordinary links. Not role="menu" —
// these are page links, and screen-reader users should hear them as links.
// One panel open at a time; Escape, a click outside or focus leaving the nav
// closes it. Panels are in the DOM when closed (hidden), so the prerendered
// HTML carries every link for crawlers.
function SiteHeader({ path }) {
  const t = cT();
  const here = path || currentPath();
  const [openId, setOpenId] = React.useState(null);   // desktop panel
  const [menuOpen, setMenuOpen] = React.useState(false); // mobile menu
  const [subOpen, setSubOpen] = React.useState({});    // mobile accordions
  const navRef = React.useRef(null);
  const btnRefs = React.useRef({});
  const burgerRef = React.useRef(null);

  const isHere = (href) => href === here;
  const groupHasHere = (g) => (g.href ? isHere(g.href) : (g.overview && isHere(g.overview.href)) || navLinks(g).some((l) => isHere(l.href)));

  React.useEffect(() => {
    if (!openId && !menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (openId) {
        const b = btnRefs.current[openId];
        setOpenId(null);
        if (b) b.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        if (burgerRef.current) burgerRef.current.focus();
      }
    };
    const onDown = (e) => {
      if (openId && navRef.current && !navRef.current.contains(e.target)) setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [openId, menuOpen]);

  const onNavBlur = (e) => {
    if (navRef.current && e.relatedTarget && !navRef.current.contains(e.relatedTarget)) setOpenId(null);
  };

  const link = (l, cls) => React.createElement('a', {
    className: cls, href: l.href, 'aria-current': isHere(l.href) ? 'page' : undefined,
  }, l.label);

  const listOf = (links) => React.createElement('ul', null,
    links.map((l) => React.createElement('li', { key: l.href }, link(l))));

  const panelBody = (g) => {
    if (g.columns) return g.columns.map((col, i) => React.createElement('div', { key: i }, listOf(col)));
    return [
      g.overview ? React.createElement('a', {
        key: 'over', className: 'site-hdr__over', href: g.overview.href,
        'aria-current': isHere(g.overview.href) ? 'page' : undefined,
      }, React.createElement('span', null, g.overview.label), React.createElement('span', { 'aria-hidden': 'true' }, '→')) : null,
      React.createElement(React.Fragment, { key: 'list' }, listOf(g.items)),
    ];
  };

  // ── Desktop ──
  const desktopItems = NAV.map((g, i) => {
    const cls = 'site-hdr__item' + (i === NAV.length - 1 ? ' site-hdr__item--end' : '');
    if (g.href) {
      return React.createElement('li', { key: g.id, className: cls },
        React.createElement('a', { className: 'site-hdr__top', href: g.href, 'aria-current': isHere(g.href) ? 'page' : undefined },
          React.createElement('span', null, g.label)));
    }
    const open = openId === g.id;
    const panelId = 'nav-panel-' + g.id;
    return React.createElement('li', { key: g.id, className: cls },
      React.createElement('button', {
        type: 'button', className: 'site-hdr__top' + (groupHasHere(g) ? ' is-current' : ''),
        'aria-expanded': open ? 'true' : 'false', 'aria-controls': panelId,
        ref: (el) => { btnRefs.current[g.id] = el; },
        onClick: () => setOpenId(open ? null : g.id),
      }, React.createElement('span', null, g.label), React.createElement(Chevron)),
      React.createElement('div', {
        id: panelId, className: 'site-hdr__panel' + (g.columns ? ' site-hdr__panel--wide' : ''), hidden: !open,
      }, panelBody(g)));
  });

  // ── Mobile / tablet ──
  const menuItems = NAV.map((g) => {
    if (g.href) {
      return React.createElement('li', { key: g.id, className: 'site-menu__group' },
        React.createElement('a', { className: 'site-menu__top', href: g.href, 'aria-current': isHere(g.href) ? 'page' : undefined }, g.label));
    }
    const open = !!subOpen[g.id];
    const subId = 'menu-sub-' + g.id;
    const links = (g.overview ? [g.overview] : []).concat(navLinks(g));
    return React.createElement('li', { key: g.id, className: 'site-menu__group' },
      React.createElement('button', {
        type: 'button', className: 'site-menu__top', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': subId,
        onClick: () => setSubOpen(Object.assign({}, subOpen, { [g.id]: !open })),
      }, React.createElement('span', null, g.label), React.createElement(Chevron)),
      React.createElement('ul', { id: subId, className: 'site-menu__sub', hidden: !open },
        links.map((l) => React.createElement('li', { key: l.href }, link(l)))));
  });

  const cta = () => React.createElement('a', { className: 'hdr-cta', href: CONTACT_URL, 'aria-current': isHere(CONTACT_URL) ? 'page' : undefined },
    React.createElement('span', null, t.cta), React.createElement('span', { 'aria-hidden': 'true' }, '→'));

  return React.createElement(React.Fragment, null,
    React.createElement('a', { className: 'skip-link', href: '#main' }, 'Skip to content'),
    React.createElement('header', { className: 'site-hdr' },
      React.createElement('div', { className: 'site-container site-hdr__in' },
        React.createElement(Wordmark),
        React.createElement('nav', { className: 'site-hdr__nav', 'aria-label': 'Main', ref: navRef, onBlur: onNavBlur },
          React.createElement('ul', { className: 'site-hdr__list' }, desktopItems)),
        React.createElement('div', { className: 'site-hdr__end' }, cta()),
        React.createElement('button', {
          ref: burgerRef, className: 'site-hdr__burger', type: 'button',
          'aria-label': menuOpen ? t.closeMenu : t.menu, 'aria-expanded': menuOpen ? 'true' : 'false', 'aria-controls': 'site-menu',
          onClick: () => setMenuOpen(!menuOpen),
        }, React.createElement('span'), React.createElement('span'), React.createElement('span'))
      )
    ),
    React.createElement('nav', { id: 'site-menu', className: 'site-menu', 'aria-label': 'Main', hidden: !menuOpen },
      React.createElement('div', { className: 'site-container' },
        React.createElement('ul', { className: 'site-menu__list' }, menuItems),
        cta()))
  );
}

// ─── CLOSING CTA STRIP ───────────────────────────────────────────────────────
// Used by LegacyShell pages (the two tools set cta:false; the held imposter-
// syndrome page shows it). No slogan of its own: an optional heading, the
// primary call to action and the confidentiality link.
function BlackCtaStrip({ heading }) {
  const t = cT();
  return React.createElement('section', { className: 'cta-strip' },
    React.createElement('div', { className: 'site-container' },
      heading ? React.createElement('h2', { className: 'cta-strip__h' }, heading) : null,
      React.createElement('div', null,
        React.createElement('a', { className: 'pill pill--green', href: CONTACT_URL },
          React.createElement('span', null, t.cta), React.createElement('span', { 'aria-hidden': 'true' }, '→'))
      ),
      React.createElement('a', { className: 'cta-strip__sub', href: cPath('confidentiality') },
        React.createElement('span', null, t.confidentiality), React.createElement('span', { 'aria-hidden': 'true' }, '→'))
    )
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function SiteFooterX() {
  const t = cT();
  const year = new Date().getFullYear();
  const social = (name, href) => React.createElement('li', { key: name },
    React.createElement('a', Object.assign({ href, 'aria-label': name }, ext), React.createElement(BrandIcon, { name, size: 18 })));
  return React.createElement('footer', { className: 'site-ftr' },
    React.createElement('div', { className: 'site-container' },
      React.createElement('div', { className: 'site-ftr__cols' },
        React.createElement('div', { className: 'site-ftr__brand' },
          React.createElement('a', { className: 'site-hdr__brand', href: '/', style: { fontSize: 20 }, 'aria-label': 'Aggelos Mouzakitis, home' },
            'Aggelos', React.createElement('span', null, '.')),
          React.createElement('p', { className: 'site-ftr__role' }, t.role),
          React.createElement('ul', { className: 'site-ftr__social', 'aria-label': t.follow },
            social('LinkedIn', EXTERNAL.linkedin),
            social('Instagram', EXTERNAL.instagram),
            social('YouTube', EXTERNAL.youtube),
            social('TikTok', EXTERNAL.tiktok))
        ),
        FOOTER_NAV.map((g) => React.createElement('nav', { key: g.label, className: 'site-ftr__col', 'aria-label': g.label },
          React.createElement('p', { className: 'site-ftr__head' }, g.label),
          React.createElement('ul', null, g.items.map((l) => React.createElement('li', { key: l.href },
            React.createElement('a', { href: l.href }, l.label))))))
      ),
      React.createElement('div', { className: 'site-ftr__rule' }),
      React.createElement('div', { className: 'site-ftr__legal' },
        React.createElement('p', { style: { margin: 0 } }, '© ' + year + ' Aggelos Mouzakitis. ' + t.rights))
    )
  );
}

// ─── UNIVERSAL CONTENT LAYOUT ────────────────────────────────────────────────
// For indexed long-form pages authored with this layout: supplies chrome, the
// light page hero and the reading column. Content passes through unchanged.
function UniversalContentLayout({ title, standfirst, children, ctaHeading, wide }) {
  return React.createElement(React.Fragment, null,
    React.createElement(ChromeStyles),
    React.createElement(SiteHeader, null),
    React.createElement('main', { id: 'main', tabIndex: -1 },
      React.createElement('section', { className: 'u-hero' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('h1', null, title),
          standfirst ? React.createElement('p', null, standfirst) : null
        )
      ),
      React.createElement('section', { className: 'u-main' },
        React.createElement('div', { className: wide ? 'site-container' : 'u-read' }, children)
      ),
      React.createElement(BlackCtaStrip, { heading: ctaHeading })
    ),
    React.createElement(SiteFooterX, null)
  );
}

// ─── LEGACY SHELL ────────────────────────────────────────────────────────────
// For existing indexed pages that already render their own h1 and body copy
// (specialty/SEO/form pages). Supplies chrome + reading typography only, so no
// heading, copy, slug, canonical or structured data changes.
// form=true swaps the reading column for the centred form container so third-
// party embeds keep their own internals untouched.
function InnerShell({ children, wide, eyebrow }) {
  return React.createElement('div', { className: wide ? 'u-shell u-shell--wide' : 'u-shell' },
    React.createElement('div', { className: 'u-shell__rail' },
      eyebrow ? React.createElement('span', { className: 'u-eyebrow' }, eyebrow) : null),
    React.createElement('div', { className: 'u-shell__body' }, children)
  );
}
function LegacyShell({ children, form, wide, cta = true, eyebrow, bare }) {
  // form → centred form/embed container (no rail); bare → raw wide container;
  // otherwise → the shared inner-page shell (editorial rail + reading column).
  let inner;
  if (form) inner = React.createElement('div', { className: 'u-form' }, children);
  else if (bare) inner = React.createElement('div', { className: 'site-container' }, children);
  else inner = React.createElement(InnerShell, { wide, eyebrow }, children);
  return React.createElement(React.Fragment, null,
    React.createElement(ChromeStyles),
    React.createElement(SiteHeader, null),
    React.createElement('main', { id: 'main', tabIndex: -1, style: { outline: 'none' } },
      React.createElement('section', { className: 'u-main', style: { paddingBlock: '64px 96px' } }, inner),
      cta ? React.createElement(BlackCtaStrip, null) : null
    ),
    React.createElement(SiteFooterX, null)
  );
}

// ─── Shared motion utility ───────────────────────────────────────────────────
// One observer for entrances, one observer for scroll-linked visibility, one
// rAF loop for all scroll progress on the page. Components declare what they
// want and never touch IntersectionObserver, rAF or matchMedia themselves.
//
//   Motion.onView(el, fn, {threshold, margin, delay})  entrance, runs once
//   Motion.reveal(root, {sel, stagger, delay})         staggered entrance group
//   Motion.draw(root, {sel, stagger, delay})           SVG line drawing
//   Motion.track(el, {prop, from, to, onProgress, once}) 0–1 scroll progress
//   Motion.release(el)                                 detach
//
// Reduced motion is not a variant of the animation, it is the absence of one:
// .mo never lands on <html>, so every primitive above is inert and the page is
// already in its final state. onView/reveal/draw still fire their callbacks so
// components that need to set up state can, but with {instant:true}.
const Motion = (function () {
  const RM = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  let reduced = !!(RM && RM.matches);

  // Scrubbing needs the easing curves as functions, because a scroll-linked
  // value is sampled rather than transitioned — CSS easing only applies to a
  // transition the browser is running. Same two curves as the tokens.
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) {
        const v = sx(t);
        if (Math.abs(v - x) < 1e-5) break;
        if (v < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return sy(t);
    };
  }
  const settle = bezier(0.22, 1, 0.36, 1);
  const travel = bezier(0.65, 0, 0.35, 1);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  // One sub-window of a 0–1 scrub: starts at `start`, runs for `len`, eased.
  const win = (p, start, len, ease) => (ease || settle)(clamp01((p - start) / len));
  // Interpolate two [r,g,b] triples to a css colour.
  const mix = (a, b, k) => {
    const t = clamp01(k);
    return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
  };

  const api = {
    get reduced() { return reduced; },
    onView, reveal, draw, track, release,
    settle, travel, clamp01, win, mix, bezier,
  };
  if (typeof document === 'undefined') return api;

  const root = document.documentElement;
  const arm = () => { if (!reduced) root.classList.add('mo'); else root.classList.remove('mo'); };
  arm();
  // A visitor can flip the OS setting mid-session. Turning motion off must take
  // effect at once; turning it on again only affects what has not run yet.
  if (RM && RM.addEventListener) RM.addEventListener('change', (e) => {
    reduced = e.matches;
    arm();
    if (reduced) { for (const el of tracked) el.style.removeProperty('--mo-p'); tracked.clear(); stopLoop(); }
  });

  // ── Entrances ──────────────────────────────────────────────────────────────
  // Trigger on where the element is, not on how much of itself is showing.
  // A ratio threshold is size-dependent: a section taller than the phone has to
  // fill most of the screen before 35% of *it* is visible, so its entrance only
  // started once it was halfway up — and a 2s sequence then finished after the
  // thing had scrolled past. A zero threshold against a root shortened by 15%
  // fires the moment the top edge crosses 85% of the viewport, which is the
  // same cue for a card and for a full-height map.
  const DEF_THRESHOLD = 0;
  const DEF_MARGIN = '0px 0px -15% 0px';
  const entries = new WeakMap(); // el -> [{fn, io}, …]  (a node may arm and run on different thresholds)
  const observers = new Map();   // "threshold|margin" -> IntersectionObserver

  function observerFor(threshold, margin) {
    const key = threshold + '|' + margin;
    let io = observers.get(key);
    if (!io) {
      io = new IntersectionObserver((list) => {
        for (const e of list) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);          // entrances run exactly once
          const recs = entries.get(e.target) || [];
          const mine = recs.filter((r) => r.io === io);
          entries.set(e.target, recs.filter((r) => r.io !== io));
          for (const r of mine) r.fn(e.target, { instant: false });
        }
      }, { threshold, rootMargin: margin });
      observers.set(key, io);
    }
    return io;
  }

  // Already on screen when we initialise? Then there is no entrance to play —
  // running one would move content the visitor is already reading.
  function onScreen(el) {
    const r = el.getBoundingClientRect();
    const vh = innerHeight || root.clientHeight;
    return r.top < vh * 0.9 && r.bottom > 0;
  }

  function onView(el, fn, opts) {
    if (!el || typeof fn !== 'function') return;
    const o = opts || {};
    if (o.delay) el.style.setProperty('--mo-delay', o.delay + 'ms');
    if (reduced || typeof IntersectionObserver !== 'function' || onScreen(el)) {
      fn(el, { instant: true });
      return;
    }
    const io = observerFor(o.threshold != null ? o.threshold : DEF_THRESHOLD, o.margin || DEF_MARGIN);
    entries.set(el, (entries.get(el) || []).concat([{ fn, io }]));
    io.observe(el);
  }

  // Mark a group in, one stagger step apart. The delay rides on a custom
  // property so the transition itself stays in CSS.
  function stagger(nodes, step, base) {
    nodes.forEach((n, i) => {
      n.style.setProperty('--mo-delay', (base + i * step) + 'ms');
      n.classList.add('is-in');
    });
  }

  function reveal(el, opts) {
    const o = opts || {};
    const pick = () => (o.sel ? Array.prototype.slice.call(el.querySelectorAll(o.sel)) : [el]);
    onView(el, (_, s) => {
      const nodes = pick();
      if (s.instant) { nodes.forEach((n) => n.classList.add('is-in')); return; }
      stagger(nodes, o.stagger != null ? o.stagger : 60, o.delay || 0);
    }, o);
  }

  // pathLength="1" normalises every path to a single dash unit, so one CSS rule
  // draws a 40px tick and a 900px axis at the same rate without per-path JS.
  function draw(el, opts) {
    const o = opts || {};
    const paths = Array.prototype.slice.call(el.querySelectorAll(o.sel || '[data-mo-draw]'));
    paths.forEach((p) => { if (!p.hasAttribute('pathLength')) p.setAttribute('pathLength', '1'); });
    onView(el, (_, s) => {
      if (s.instant) { paths.forEach((p) => p.classList.add('is-in')); return; }
      stagger(paths, o.stagger != null ? o.stagger : 40, o.delay || 0);
    }, o);
  }

  // ── Scroll progress ────────────────────────────────────────────────────────
  // One rAF loop for the whole page, running only while a tracked element is
  // actually on screen. Reads are batched ahead of writes so a frame never
  // interleaves getBoundingClientRect with a style write.
  const cfg = new WeakMap();   // el -> {prop, from, to, onProgress}
  const tracked = new Set();   // currently on screen
  let loop = 0;
  let vis = null;

  function visObserver() {
    if (vis) return vis;
    vis = new IntersectionObserver((list) => {
      for (const e of list) {
        if (e.isIntersecting) tracked.add(e.target);
        else tracked.delete(e.target);
      }
      if (tracked.size && !loop && !reduced) loop = requestAnimationFrame(frame);
      else if (!tracked.size) stopLoop();
    }, { threshold: 0 });
    return vis;
  }

  function stopLoop() { if (loop) { cancelAnimationFrame(loop); loop = 0; } }

  // p = 0 when the element's top edge sits at `from` × viewport height, and
  // p = 1 when its bottom edge reaches `to` × viewport height. Measuring the
  // end against the bottom edge makes the scrub length scale with the section,
  // so a tall field and a short one both finish as they are read rather than
  // one racing ahead. `distance` switches to raw page scroll instead, for the
  // handful of things anchored to the top of the document.
  function progressOf(c, r, vh) {
    if (c.distance) return Math.min(1, Math.max(0, (pageYOffset || 0) / c.distance));
    // Scroll-linked motion is meant to scale with its section: that is what
    // keeps the progress field's four markers tied to the four rows you are
    // reading. An entrance is not — it should land in a bounded amount of
    // scrolling however tall the section is, or on a phone the last rows only
    // arrive after they have gone off the top. So `once` caps the height term.
    const h = c.once ? Math.min(r.height, vh * 0.8) : r.height;
    const span = (c.from - c.to) * vh + h;
    if (span <= 0) return 1;
    return Math.min(1, Math.max(0, (c.from * vh - r.top) / span));
  }

  function frame() {
    loop = 0;
    const vh = innerHeight || root.clientHeight;
    const reads = [];
    const done = [];
    for (const el of tracked) reads.push([el, el.getBoundingClientRect()]); // read pass
    for (const [el, r] of reads) {                                          // write pass
      const c = cfg.get(el);
      if (!c) continue;
      let p = progressOf(c, r, vh);
      // An entrance only ever goes forwards. `once` ratchets progress so
      // scrolling back up cannot rewind a reveal, and retires the element
      // altogether at 1 so it stops costing a frame.
      if (c.once) { p = c.peak = Math.max(c.peak, p); }
      // Settled sections write nothing: most frames in a long scroll touch no
      // style at all, which is what keeps four tracked fields affordable.
      if (c.last !== null && Math.abs(p - c.last) < 0.0005) {
        if (c.once && p >= 1) done.push(el);
        continue;
      }
      c.last = p;
      if (c.prop) el.style.setProperty(c.prop, p.toFixed(4));
      if (c.onProgress) c.onProgress(p, el);
      if (c.once && p >= 1) done.push(el);
    }
    for (const el of done) release(el);
    if (tracked.size) loop = requestAnimationFrame(frame);
  }

  function track(el, opts) {
    if (!el) return;
    const o = opts || {};
    const c = {
      prop: o.prop || '--mo-p',
      from: o.from != null ? o.from : 0.85,
      to: o.to != null ? o.to : 0.55,
      distance: o.distance || 0,
      onProgress: o.onProgress || null,
      once: !!o.once,
      peak: 0,
      last: null,
    };
    if (reduced || typeof IntersectionObserver !== 'function') {
      // No scrubbing: hand the element its completed state once.
      if (c.prop) el.style.setProperty(c.prop, '1');
      if (c.onProgress) c.onProgress(1, el);
      return;
    }
    cfg.set(el, c);
    visObserver().observe(el);
  }

  function release(el) {
    if (!el) return;
    const recs = entries.get(el);
    if (recs) { recs.forEach((r) => r.io.unobserve(el)); entries.delete(el); }
    if (cfg.has(el)) { cfg.delete(el); tracked.delete(el); if (vis) vis.unobserve(el); }
    if (!tracked.size) stopLoop();
  }

  return api;
})();

Object.assign(window, {
  Motion,
  SITE, CHROME_PATHS, EXTERNAL, cPath, cT, BrandIcon, Wordmark, ChromeStyles,
  SiteHeader, SiteFooterX, BlackCtaStrip, UniversalContentLayout, LegacyShell,
  NAV, FOOTER_NAV, CONTACT_URL, FREE_TOOLS_URL, FREE_TOOL_LINKS, currentPath,
});
