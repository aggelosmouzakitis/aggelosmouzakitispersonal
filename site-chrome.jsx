// site-chrome.jsx — the design tokens, header, footer and the shell for pages
// that render their own content (the two free tools, /ask-me-anything/el).
//
// Plain React in one closure (nothing leaks but the exports below), compiled
// by babel like the other .jsx bundles, loaded on every page after site-nav.js (the header and footer wording, generated from the
// canonical copy) and before the page's own bundle. Exposes on window:
//   ChromeStyles, SiteHeader, SiteFooterX, CloseBand, LegacyShell,
//   EXTERNAL, CONTACT_URL, currentPath
//
// Visual reference: "Direction v4" (one grid, one type scale, one of each
// component): site 1240px, reading column 760px, gutter clamp(22px, 4vw, 52px);
// Archivo Black for the page H1 only, Inter Tight for H2/H3 and the rare
// statement, Inter for everything else; one green, #047857.

(function () {
const { useState, useEffect, useRef } = React;
const ce = React.createElement;

const NAV_DATA = window.SITE_NAV || { nav: { items: [], cta: null }, footer: { groups: [], legal: [] } };

const CONTACT_URL = '/contact/';
const EXTERNAL = {
  undisguised: 'https://www.undisguised.io/',
  linkedin: 'https://linkedin.com/in/growth-product-manager/',
  instagram: 'https://www.instagram.com/_aggelosmouzakitis_/',
  tiktok: 'https://www.tiktok.com/@aggelosmouz',
};

// The three services open the Services menu; a rule separates them from the
// audience pages that follow.
const SERVICE_URLS = ['/individual-psychotherapy/', '/couples-therapy/', '/professional-coaching/'];

// Which page is current: the pathname, normalised to a trailing slash
// ("/about/index.html" and "/about" both read as "/about/").
function currentPath() {
  if (typeof window === 'undefined' || !window.location) return '';
  const p = (window.location.pathname || '/').replace(/index\.html$/, '');
  return p.endsWith('/') ? p : p + '/';
}

// ─── Tokens and shared components ───────────────────────────────────────────
// The first block also neutralises the sidebar-era rules the legacy shells
// (the tools, /ask-me-anything/el) still carry in their <head>:
// html,body,#root{height:100%}, #root{display:flex;overflow:hidden}.
const CHROME_CSS = `
:root{
  --bone:#F3F0E8;--bone-deep:#EDE8DB;--sage-bg:#DAE4D8;--forest:#16231E;
  --green:#047857;--green-pressed:#03654A;--sage:#8FBFA7;
  --heading:#14201C;--ink:#171919;--body:#2C312C;--ink-2:#3A403A;--meta:#6A6F67;
  --on-forest:#C8D1C8;--on-forest-2:#C0C9BF;
  --rule:rgba(23,25,25,0.18);--rule-2:rgba(23,25,25,0.22);--rule-forest:rgba(243,240,232,0.16);
  --font-body:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --font-heading:"Inter Tight","Inter",system-ui,sans-serif;
  --font-display:"Archivo Black","Inter Tight","Inter",system-ui,sans-serif;
  --site-max:1240px;--read-max:760px;
  --gutter:clamp(22px,4vw,52px);
  --sec:clamp(64px,6.7vw,96px);
}
html,body,#root{height:auto}
#root{display:block;overflow:visible}
body{margin:0;background:var(--bone);color:var(--ink);font-family:var(--font-body);font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
a{color:inherit;text-decoration:none}
.site-grain{opacity:0.06}
.wrap{width:min(var(--site-max),calc(100% - 2 * var(--gutter)));margin-inline:auto}
.read{width:min(var(--read-max),calc(100% - 2 * var(--gutter)));margin-inline:auto}
.skip-link{position:absolute;left:12px;top:-60px;z-index:200;padding:12px 18px;background:var(--bone);color:var(--heading);font:600 15px/1 var(--font-body);border:2px solid var(--green)}
.skip-link:focus{top:12px}
a:focus-visible,button:focus-visible,summary:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--green);outline-offset:2px}
.on-dark a:focus-visible,.on-dark button:focus-visible{outline-color:var(--sage)}

/* Primary action: green rectangle, 52px, 15px/700 caps. */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 24px;background:var(--green);color:var(--bone);border:0;border-radius:0;font:700 15px/1 var(--font-body);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:gap 180ms,background 180ms}
.btn:hover{background:var(--green-pressed);color:var(--bone);gap:13px}
/* Secondary action: 16px/600 green, underline + arrow. */
.tlink{display:inline-flex;align-items:center;gap:8px;min-height:44px;font-size:16px;font-weight:600;line-height:1.3;color:var(--green);transition:gap 180ms,color 180ms}
.tlink>span:first-child{border-bottom:1.5px solid currentColor;padding-bottom:2px}
.tlink:hover{color:var(--green-pressed);gap:12px}
.on-dark .tlink{color:var(--bone)}
.on-dark .tlink:hover{color:var(--sage)}

/* Header */
.hdr{position:relative;z-index:50;background:var(--forest);border-bottom:1px solid var(--rule-forest);font-family:var(--font-body)}
.hdr__in{min-height:74px;display:flex;align-items:center;gap:24px}
.hdr__brand{display:inline-flex;align-items:center;min-height:44px;gap:1px;color:var(--bone);font-family:var(--font-heading);font-size:25px;font-weight:750;line-height:1;letter-spacing:-0.035em;white-space:nowrap}
.hdr__brand span,.ftr__brand span{color:var(--green)}
.hdr__nav{margin-left:auto;display:flex;align-items:center;gap:30px}
.hdr__item{position:relative;display:flex;align-items:center}
.hdr__link,.hdr__btn{display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:0;background:none;border:0;border-bottom:2px solid transparent;color:var(--bone);font-family:inherit;font-size:13.5px;font-weight:650;line-height:1;letter-spacing:0.06em;text-transform:uppercase;opacity:.85;cursor:pointer}
.hdr__link:hover,.hdr__btn:hover,.hdr__btn[aria-expanded="true"],.hdr__link.is-current,.hdr__btn.is-current{opacity:1;color:var(--bone)}
.hdr__link.is-current,.hdr__btn.is-current{border-bottom-color:var(--green)}
.hdr__btn svg{transition:transform 200ms cubic-bezier(.22,1,.36,1)}
.hdr__btn[aria-expanded="true"] svg{transform:rotate(180deg)}
.hdr__panel{position:absolute;top:calc(100% + 15px);left:-20px;width:360px;background:var(--bone);border:1px solid rgba(23,25,25,0.14);box-shadow:0 20px 44px -20px rgba(0,0,0,0.4);padding:8px 0}
.hdr__panel[hidden],.mmenu[hidden],.mmenu__links[hidden]{display:none}
.hdr__panel a{display:block;padding:12px 20px;font-size:16px;font-weight:500;line-height:1.35;color:var(--heading)}
.hdr__panel a:hover{background:rgba(4,120,87,0.07);color:var(--green)}
.hdr__panel a[aria-current="page"]{color:var(--green);font-weight:600}
.hdr__sep{height:1px;margin:8px 20px;background:rgba(23,25,25,0.16)}
.hdr__cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;background:transparent;border:1px solid rgba(243,240,232,0.7);color:var(--bone);font-size:13.5px;font-weight:700;line-height:1;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;transition:background 180ms,color 180ms,border-color 180ms}
.hdr__cta:hover{background:var(--bone);color:var(--forest);border-color:var(--bone)}
.hdr__menu-btn{display:none;margin-left:auto;align-items:center;gap:12px;min-height:48px;padding:0 2px 0 12px;background:none;border:0;cursor:pointer;color:var(--bone);font-family:inherit;font-size:13.5px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}
.hdr__burger{display:flex;flex-direction:column;gap:5px;width:22px}
.hdr__burger span{height:2px;background:var(--bone)}
@media (max-width:1079px){.hdr__nav,.hdr__cta{display:none}.hdr__menu-btn{display:inline-flex}}
@media (min-width:1080px){.mmenu{display:none}}
.mmenu{background:var(--bone);border-bottom:1px solid rgba(23,25,25,0.14);box-shadow:0 20px 40px -24px rgba(0,0,0,0.35)}
.mmenu__in{width:calc(100% - 44px);margin-inline:auto;padding:8px 0 22px}
.mmenu__group{border-bottom:1px solid rgba(23,25,25,0.14)}
.mmenu__toggle{display:flex;width:100%;justify-content:space-between;align-items:center;min-height:56px;padding:0;background:none;border:0;cursor:pointer;color:var(--heading);font-family:inherit;font-size:14px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase}
.mmenu__sign{font-size:22px;font-weight:400;color:var(--green)}
.mmenu__links{padding:0 0 12px}
.mmenu__links a{display:flex;align-items:center;min-height:46px;font-size:17px;font-weight:500;color:var(--heading)}
.mmenu__links a[aria-current="page"]{color:var(--green);font-weight:600}
.mmenu__sep{height:1px;margin:6px 0;background:rgba(23,25,25,0.12)}
.mmenu__link{display:flex;align-items:center;min-height:56px;border-bottom:1px solid rgba(23,25,25,0.14);font-size:14px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--heading)}
.mmenu__cta{display:flex;align-items:center;justify-content:center;gap:9px;min-height:52px;margin-top:20px;background:var(--green);color:var(--bone);font-size:15px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase}

/* Close: a 13px label above one sentence and the primary action. */
.close{background:var(--forest);text-align:center}
.close__in{padding-block:var(--sec)}
.close__label{margin:0 0 18px;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:0.08em;text-transform:uppercase;color:var(--sage)}
.close__text{margin:0 auto;max-width:24ch;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + .7vw),32px);font-weight:650;line-height:1.18;letter-spacing:-0.02em;color:var(--bone);text-wrap:balance}
.close__text--long{max-width:56ch;font-family:var(--font-body);font-size:clamp(18px,calc(17px + .2vw),20px);font-weight:400;line-height:1.6;letter-spacing:0;color:var(--on-forest)}
.close__actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 28px;margin-top:32px}

/* Footer */
.ftr{background:var(--forest);color:var(--on-forest-2);border-top:2px solid var(--green);padding-block:clamp(48px,6vw,72px) 32px;font-family:var(--font-body)}
.ftr__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:40px;align-items:start}
.ftr__brand{display:inline-flex;align-items:center;min-height:44px;color:var(--bone);font-family:var(--font-heading);font-size:22px;font-weight:750;line-height:1;letter-spacing:-0.035em}
.ftr__tag{margin:18px 0 0;max-width:26ch;font-size:15px;line-height:1.5}
.ftr__social{display:flex;gap:14px;margin:20px 0 0;padding:0;list-style:none}
.ftr__social a{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid var(--rule-forest);color:var(--on-forest-2)}
.ftr__social a:hover{color:var(--bone);border-color:var(--sage)}
.ftr__col{display:flex;flex-direction:column;min-width:0}
.ftr__head{margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--sage)}
.ftr__col a{padding:7px 0;font-size:15px;line-height:1.4}
.ftr__col a:hover,.ftr__legal a:hover{color:var(--bone)}
.ftr__rule{height:1px;background:var(--rule-forest);margin-block:48px 24px}
.ftr__bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 32px;font-size:13px;line-height:1.5}
.ftr__legal{display:flex;flex-wrap:wrap;gap:4px 24px}
.ftr__legal a{display:inline-flex;align-items:center;min-height:44px}
@media (max-width:759px){.ftr__col a{display:flex;align-items:center;min-height:44px;padding:0}}

/* Legacy shell: the tools and /ask-me-anything/el render their own content. */
.u-main{padding-block:64px 96px}
.u-form{width:min(var(--read-max),calc(100% - 2 * var(--gutter)));margin-inline:auto}

@media print{.hdr,.ftr,.close,.site-grain{display:none!important}}
@media (prefers-reduced-motion:reduce){*{transition-duration:.001ms!important;animation-duration:.001ms!important}}
`;

function ChromeStyles() {
  return ce('style', { dangerouslySetInnerHTML: { __html: CHROME_CSS } });
}

function Caret() {
  return ce('svg', { width: 10, height: 6, viewBox: '0 0 10 6', 'aria-hidden': 'true' },
    ce('path', { d: 'M1 1l4 4 4-4', stroke: 'currentColor', strokeWidth: 1.5, fill: 'none' }));
}

const slugOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Group links with the rule after the services, when the group has one.
function withSeparators(items) {
  const out = [];
  items.forEach((it, i) => {
    out.push(it);
    const next = items[i + 1];
    if (next && SERVICE_URLS.includes(it.href) && !SERVICE_URLS.includes(next.href)) out.push({ sep: true });
  });
  return out;
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
// Desktop (≥1080px): Home · About · Services ▾ · Resources ▾ · FAQ and the
// outlined Book a consultation. Services and Resources are disclosure buttons
// (aria-expanded/aria-controls) over a bone panel; Escape closes and returns
// focus to the button, as do a click outside and focus leaving the nav.
// Below 1080px one Menu button opens a bone panel: Services and Resources as
// accordions, then Home, About, FAQ and the filled call to action.
function SiteHeader() {
  const nav = NAV_DATA.nav;
  const cur = currentPath();
  const [open, setOpen] = useState(null);
  const [menu, setMenu] = useState(false);
  const [macc, setMacc] = useState(null);
  const rootRef = useRef(null);
  const btns = useRef({});
  const menuBtn = useRef(null);

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key !== 'Escape') return;
      if (open) {
        const b = btns.current[open];
        setOpen(null);
        if (b) b.focus();
      } else if (menu) {
        setMenu(false);
        if (menuBtn.current) menuBtn.current.focus();
      }
    };
    const onDoc = (ev) => {
      if (open && rootRef.current && !rootRef.current.contains(ev.target)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDoc);
    };
  }, [open, menu]);

  const isCur = (href) => href === cur;
  const groupCur = (g) => (g.items || []).some((l) => isCur(l.href));
  const onNavBlur = (ev) => {
    if (open && !ev.currentTarget.contains(ev.relatedTarget)) setOpen(null);
  };

  const links = (items, prefix, onPick) => withSeparators(items).map((l, i) => (l.sep
    ? ce('div', { key: prefix + 'sep' + i, className: prefix === 'd' ? 'hdr__sep' : 'mmenu__sep', role: 'presentation' })
    : ce('a', { key: l.href, href: l.href, 'aria-current': isCur(l.href) ? 'page' : undefined, onClick: onPick }, l.label)));

  const desktop = ce('nav', { className: 'hdr__nav', 'aria-label': 'Primary', onBlur: onNavBlur },
    nav.items.map((it) => {
      if (!it.items) {
        return ce('div', { key: it.label, className: 'hdr__item' },
          ce('a', { href: it.href, className: 'hdr__link' + (isCur(it.href) ? ' is-current' : ''), 'aria-current': isCur(it.href) ? 'page' : undefined }, it.label));
      }
      const id = slugOf(it.label);
      const expanded = open === id;
      return ce('div', { key: it.label, className: 'hdr__item' },
        ce('button', {
          type: 'button', className: 'hdr__btn' + (groupCur(it) ? ' is-current' : ''),
          'aria-expanded': expanded ? 'true' : 'false', 'aria-controls': 'nav-' + id,
          ref: (el) => { btns.current[id] = el; },
          onClick: (ev) => { ev.stopPropagation(); setOpen(expanded ? null : id); },
        }, it.label, ce(Caret)),
        ce('div', { id: 'nav-' + id, className: 'hdr__panel', hidden: !expanded },
          links(it.items, 'd', () => setOpen(null))));
    }));

  // The mobile menu keeps the desktop order (Home, About, Services, Resources,
  // FAQ): links stay links, the two groups become accordions in place.
  const mobile = ce('nav', { id: 'site-menu', className: 'mmenu', 'aria-label': 'Primary', hidden: !menu },
    ce('div', { className: 'mmenu__in' },
      nav.items.map((it) => {
        if (!it.items) {
          return ce('a', { key: it.label, href: it.href, className: 'mmenu__link', 'aria-current': isCur(it.href) ? 'page' : undefined }, it.label);
        }
        const id = slugOf(it.label);
        const expanded = macc === id;
        return ce('div', { key: it.label, className: 'mmenu__group' },
          ce('button', { type: 'button', className: 'mmenu__toggle', 'aria-expanded': expanded ? 'true' : 'false', 'aria-controls': 'm-' + id,
            onClick: () => setMacc(expanded ? null : id) },
            it.label, ce('span', { className: 'mmenu__sign', 'aria-hidden': 'true' }, expanded ? '−' : '+')),
          ce('div', { id: 'm-' + id, className: 'mmenu__links', hidden: !expanded }, links(it.items, 'm')));
      }),
      nav.cta ? ce('a', { href: nav.cta.href, className: 'mmenu__cta' }, nav.cta.label, ce('span', { 'aria-hidden': 'true' }, '→')) : null));

  return ce('header', { className: 'hdr', ref: rootRef },
    ce('a', { className: 'skip-link', href: '#main' }, 'Skip to content'),
    ce('div', { className: 'wrap hdr__in' },
      ce('a', { href: '/', className: 'hdr__brand', 'aria-label': 'Aggelos Mouzakitis, home' }, 'Aggelos', ce('span', null, '.')),
      desktop,
      nav.cta ? ce('a', { href: nav.cta.href, className: 'hdr__cta' }, nav.cta.label, ce('span', { 'aria-hidden': 'true' }, '→')) : null,
      ce('button', { type: 'button', className: 'hdr__menu-btn', 'aria-expanded': menu ? 'true' : 'false', 'aria-controls': 'site-menu',
        ref: menuBtn, onClick: () => setMenu(!menu) },
        menu ? 'Close' : 'Menu',
        ce('span', { className: 'hdr__burger', 'aria-hidden': 'true' }, ce('span'), ce('span'), ce('span')))),
    mobile);
}

// ─── CLOSE ───────────────────────────────────────────────────────────────────
// The dark, centred close of a page: its "Contact" heading set as a label,
// one sentence, the primary action (and any secondary links, on dark).
function CloseBand({ label, text, actions }) {
  const long = text && text.length > 110;
  return ce('section', { className: 'band close on-dark', 'aria-labelledby': label ? 'close-h' : undefined, 'aria-label': label ? undefined : 'Book a consultation' },
    ce('div', { className: 'read close__in' },
      label ? ce('h2', { id: 'close-h', className: 'close__label' }, label) : null,
      text ? ce('p', { className: 'close__text' + (long ? ' close__text--long' : '') }, text) : null,
      ce('div', { className: 'close__actions', style: text || label ? null : { marginTop: 0 } }, actions)));
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const ICONS = {
  LinkedIn: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z',
  Instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 7.85a4.15 4.15 0 1 0 0 8.3 4.15 4.15 0 0 0 0-8.3zm0 6.85a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.28-7.01a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z',
  TikTok: 'M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .8-5.05V9.7a5.7 5.7 0 0 0-.8-.06 5.68 5.68 0 1 0 5.68 5.68V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48z',
};
const SOCIAL = [['LinkedIn', EXTERNAL.linkedin], ['Instagram', EXTERNAL.instagram], ['TikTok', EXTERNAL.tiktok]];

function SiteFooterX() {
  const f = NAV_DATA.footer;
  const year = String(new Date().getFullYear());
  const brand = (f.brand || 'Aggelos.').replace(/\.$/, '');
  return ce('footer', { className: 'ftr' },
    ce('div', { className: 'wrap' },
      ce('div', { className: 'ftr__grid' },
        ce('div', { style: { minWidth: 0 } },
          ce('a', { href: '/', className: 'ftr__brand', 'aria-label': 'Aggelos Mouzakitis, home' }, brand, ce('span', null, '.')),
          f.tagline ? ce('p', { className: 'ftr__tag' }, f.tagline) : null,
          ce('ul', { className: 'ftr__social', 'aria-label': 'Social media' },
            SOCIAL.map(([name, href]) => ce('li', { key: name },
              ce('a', { href, 'aria-label': name, target: '_blank', rel: 'noopener noreferrer' },
                ce('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, ce('path', { d: ICONS[name] }))))))),
        f.groups.map((g) => ce('nav', { key: g.label, className: 'ftr__col', 'aria-label': g.label },
          ce('p', { className: 'ftr__head' }, g.label),
          g.items.map((l) => ce('a', { key: l.label, href: l.href }, l.label))))),
      ce('div', { className: 'ftr__rule', role: 'presentation' }),
      ce('div', { className: 'ftr__bottom' },
        ce('p', { style: { margin: 0 } }, (f.rights || '').replace(/\d{4}/, year)),
        f.legal && f.legal.length ? ce('nav', { className: 'ftr__legal', 'aria-label': 'Legal' },
          f.legal.map((l) => ce('a', { key: l.label, href: l.href }, l.label))) : null)));
}

// ─── LEGACY SHELL ────────────────────────────────────────────────────────────
// For pages that render their own content: the two free tools (form: the
// centred reading container, no close) and /ask-me-anything/el (wide).
function LegacyShell({ children, form, cta = true }) {
  const cta0 = NAV_DATA.nav.cta || { label: 'Book a consultation', href: CONTACT_URL };
  return ce(React.Fragment, null,
    ce(ChromeStyles),
    ce(SiteHeader),
    ce('main', { id: 'main', tabIndex: -1, style: { outline: 'none' } },
      ce('section', { className: 'u-main' }, ce('div', { className: form ? 'u-form' : 'wrap' }, children)),
      cta ? ce(CloseBand, { actions: ce('a', { className: 'btn', href: cta0.href }, cta0.label, ce('span', { 'aria-hidden': 'true' }, '→')) }) : null),
    ce(SiteFooterX));
}

Object.assign(window, {
  ChromeStyles, SiteHeader, SiteFooterX, CloseBand, LegacyShell,
  EXTERNAL, CONTACT_URL, currentPath,
});
})();
