/*
 * SOMO — reusable components (server-side, build-time).
 * Each function returns an HTML string. Pages compose these; the dictionary
 * (i18n) supplies every piece of copy. Nothing here hardcodes user-facing text.
 */
const { config, withUtm } = require('./config');

/* ---- helpers ------------------------------------------------------------- */
const e = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (s) => e(s);
const arrow = '<span class="arrow" aria-hidden="true">→</span>';
const caret = '<svg class="caret" width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"><path d="M1 1l4.5 4L10 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// The product order and metadata shared across nav + cards.
const PRODUCT_ORDER = ['circles', 'flow', 'outdoors'];

/* A Luma (or config-driven) outbound link with UTM + analytics hooks. */
function lumaLink(ctx, lumaKey, opts) {
  opts = opts || {};
  const base = config.luma[lumaKey];
  const href = withUtm(base, ctx.page, opts.placement || lumaKey);
  const cls = opts.class || 'btn btn-primary';
  const analytics = opts.analytics || 'luma_all_events_click';
  const withArrow = opts.arrow === false ? '' : arrow;
  return `<a class="${cls}" href="${attr(href)}" target="_blank" rel="noopener"`
    + ` data-analytics="${attr(analytics)}" data-placement="${attr(opts.placement || lumaKey)}">`
    + `${e(opts.label)}${withArrow}</a>`;
}

/* A generic config-URL link (application, contact endpoints, anchors). */
function ctaLink(href, label, opts) {
  opts = opts || {};
  const cls = opts.class || 'btn btn-primary';
  const external = /^https?:/.test(href);
  const rel = external ? ' target="_blank" rel="noopener"' : '';
  const data = opts.analytics ? ` data-analytics="${attr(opts.analytics)}" data-placement="${attr(opts.placement || '')}"` : '';
  const withArrow = opts.arrow === false ? '' : arrow;
  const cls2 = opts.textlink ? 'textlink' : cls;
  return `<a class="${cls2}" href="${attr(href)}"${rel}${data}>${e(label)}${withArrow}</a>`;
}

/* ---- Announcement bar ---------------------------------------------------- */
function announce(ctx) {
  const t = ctx.t.announce;
  const link = lumaLink(ctx, 'allEvents', {
    label: t.link, class: 'announce__link', placement: 'announce', analytics: 'luma_all_events_click'
  });
  return `<div class="announce"><div class="container"><div class="announce__row">
    <span class="announce__msg"><span class="spark" aria-hidden="true">◆</span> ${e(t.msg)}</span>
    ${link}
  </div></div></div>`;
}

/* ---- Header / nav -------------------------------------------------------- */
function header(ctx) {
  const t = ctx.t.nav;
  const P = ctx.paths;
  const cur = (key) => ctx.page === key ? ' aria-current="page"' : '';
  const products = PRODUCT_ORDER.map((k) => {
    const pr = ctx.t.products[k];
    const soon = pr.soon ? ` <span class="chip chip--orange">${e(ctx.t.common.soon)}</span>` : '';
    return `<a class="dropdown__link" href="${attr(P[k])}" data-product="${attr(pr.name)}">
      <span class="dropdown__name">${e(pr.name)}${soon}</span>
      <span class="dropdown__desc">${e(pr.navdesc)}</span>
    </a>`;
  }).join('');

  const langA = `<a href="${attr(ctx.altUrl)}" data-lang-switch="${attr(ctx.altLang)}" hreflang="${attr(ctx.altLang)}" aria-label="${attr(t.langAria)}">${e(ctx.altLangLabel)}</a>`;

  const navCta = lumaLink(ctx, 'allEvents', { label: t.cta, class: 'btn btn-orange btn-sm', placement: 'nav_cta', analytics: 'luma_all_events_click' });

  return `<header class="header"><div class="container"><div class="header__row">
    <a class="brand" href="${attr(P.home)}" aria-label="SOMO — ${attr(t.homeAria)}">SOMO<span class="dot">.</span></a>
    <nav class="nav" aria-label="${attr(t.navAria)}">
      <div class="nav__desktop">
        <ul class="nav__list">
          <li><a class="nav__link" href="${attr(P.home)}"${cur('home')}>${e(t.home)}</a></li>
          <li class="nav__item">
            <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="exp-menu" aria-haspopup="true">${e(t.experiences)} ${caret}</button>
            <div class="dropdown" id="exp-menu" role="menu">${products}</div>
          </li>
          <li><a class="nav__link" href="${attr(P.organisations)}"${cur('organisations')}>${e(t.organisations)}</a></li>
          <li><a class="nav__link" href="${attr(P.about)}"${cur('about')}>${e(t.about)}</a></li>
          <li><a class="nav__link" href="${attr(P.safety)}"${cur('safety')}>${e(t.safety)}</a></li>
        </ul>
        <span class="langswitch">${langA}</span>
        <span class="nav__cta">${navCta}</span>
      </div>
      <button class="nav__burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${attr(t.menuAria)}"><span></span></button>
    </nav>
  </div></div>${mobilePanel(ctx, products)}`;
}

function mobilePanel(ctx, productsHtml) {
  const t = ctx.t.nav;
  const P = ctx.paths;
  const subLinks = PRODUCT_ORDER.map((k) => {
    const pr = ctx.t.products[k];
    const soon = pr.soon ? ` <span class="chip chip--orange">${e(ctx.t.common.soon)}</span>` : '';
    return `<a href="${attr(P[k])}" data-product="${attr(pr.name)}"><span class="n">${e(pr.name)}${soon}</span><span class="d">${e(pr.navdesc)}</span></a>`;
  }).join('');
  const langA = `<a href="${attr(ctx.altUrl)}" data-lang-switch="${attr(ctx.altLang)}" hreflang="${attr(ctx.altLang)}">${e(ctx.altLangFull)}</a>`;
  const navCta = lumaLink(ctx, 'allEvents', { label: t.cta, class: 'btn btn-orange btn-block', placement: 'nav_cta_mobile', analytics: 'luma_all_events_click' });
  return `<div class="mobile-panel" id="mobile-menu" aria-hidden="true">
    <ul class="mobile-panel__list">
      <li><a href="${attr(P.home)}">${e(t.home)}</a></li>
      <li>
        <button class="mobile-panel__acc-btn" type="button" aria-expanded="false">${e(t.experiences)} ${caret}</button>
        <div class="mobile-panel__sub">${subLinks}</div>
      </li>
      <li><a href="${attr(P.organisations)}">${e(t.organisations)}</a></li>
      <li><a href="${attr(P.about)}">${e(t.about)}</a></li>
      <li><a href="${attr(P.safety)}">${e(t.safety)}</a></li>
    </ul>
    <div class="mobile-panel__foot">
      ${navCta}
      <div class="mobile-panel__lang"><span class="langswitch">${langA}</span></div>
    </div>
  </div>`;
}

/* ---- Footer -------------------------------------------------------------- */
function footer(ctx) {
  const t = ctx.t.footer;
  const P = ctx.paths;
  const nav = ctx.t.nav;
  const cta = lumaLink(ctx, 'allEvents', { label: nav.cta, class: 'btn btn-orange', placement: 'footer_cta', analytics: 'luma_all_events_click' });

  const social = [];
  if (config.social.instagram) social.push(`<a href="${attr(config.social.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>`);
  if (config.social.linkedin) social.push(`<a href="${attr(config.social.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>`);
  const socialHtml = social.length ? `<div class="footer__social">${social.join('')}</div>` : '';

  const emailLink = config.contactEmail
    ? `<li><a href="mailto:${attr(config.contactEmail)}" data-analytics="contact_click" data-placement="footer">${e(config.contactEmail)}</a></li>`
    : '';

  const langA = `<a href="${attr(ctx.altUrl)}" data-lang-switch="${attr(ctx.altLang)}" hreflang="${attr(ctx.altLang)}">${e(ctx.altLangFull)}</a>`;

  return `<footer class="footer"><div class="container">
    <div class="footer__cta">
      <p class="h3">${e(t.ctaTitle)}</p>
      ${cta}
    </div>
    <div class="footer__main">
      <div class="footer__brand">
        <a class="brand" href="${attr(P.home)}">SOMO<span class="dot">.</span></a>
        <p>${e(t.blurb)}</p>
        ${socialHtml}
      </div>
      <div class="footer__col">
        <h4>${e(t.experiencesTitle)}</h4>
        <ul>
          <li><a href="${attr(P.circles)}">Somo Circles</a></li>
          <li><a href="${attr(P.flow)}">Somo Flow</a></li>
          <li><a href="${attr(P.outdoors)}">Somo Outdoors</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>${e(t.moreTitle)}</h4>
        <ul>
          <li><a href="${attr(P.organisations)}">${e(ctx.t.nav.organisations)}</a></li>
          <li><a href="${attr(P.about)}">${e(ctx.t.nav.about)}</a></li>
          <li><a href="${attr(P.safety)}">${e(ctx.t.nav.safety)}</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h4>${e(t.contactTitle)}</h4>
        <ul>
          ${emailLink}
          <li>${lumaLink(ctx, 'allEvents', { label: t.eventsLink, class: 'link', placement: 'footer_links', analytics: 'luma_all_events_click', arrow: false })}</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">© ${new Date().getFullYear()} SOMO</span>
      <div class="footer__legal">
        <a href="${attr(P.privacy)}">${e(ctx.t.privacy.navlabel)}</a>
        <a href="${attr(P.participation)}">${e(ctx.t.participation.navlabel)}</a>
      </div>
      <span class="langswitch">${langA}</span>
    </div>
  </div></footer>`;
}

/* ---- Product card -------------------------------------------------------- */
function productCard(ctx, key) {
  const pr = ctx.t.products[key];
  const P = ctx.paths;
  const kindClass = key === 'flow' ? 'k-move' : (key === 'outdoors' ? 'k-community' : '');
  const soon = pr.soon ? `<span class="chip">${e(ctx.t.common.soon)}</span>` : '';
  // One appropriate action per card.
  let cta;
  if (key === 'circles') cta = lumaLink(ctx, 'circles', { label: ctx.t.common.viewCircles, class: 'textlink', placement: 'home_card', analytics: 'circles_booking_click' });
  else if (key === 'flow') cta = lumaLink(ctx, 'flowWaitlist', { label: ctx.t.common.joinWaitlist, class: 'textlink', placement: 'home_card', analytics: 'flow_waitlist_click' });
  else cta = ctaLink(P.outdoors + '#apply', ctx.t.common.applyOutdoors, { textlink: true, analytics: 'outdoors_application_start', placement: 'home_card' });

  return `<div class="card">
    <div class="card__top">
      <span class="kindtag ${kindClass}"><span class="dot"></span>${e(pr.kind)}</span>
      ${soon}
    </div>
    <h3 class="card__name"><a href="${attr(P[key])}" data-product="${attr(pr.name)}">${e(pr.name)}</a></h3>
    <p class="card__desc">${e(pr.oneLiner)}</p>
    <div class="card__foot">${cta}</div>
  </div>`;
}

/* ---- Explain box --------------------------------------------------------- */
function explainBox(ctx, data) {
  return `<div class="explain">
    <p class="eyebrow explain__label">${e(data.label)}</p>
    <p class="explain__q">${e(data.text)}</p>
  </div>`;
}

/* ---- Meta grid ----------------------------------------------------------- */
function metaGrid(cells) {
  return `<div class="metagrid">${cells.map((c) =>
    `<div class="metagrid__cell"><div class="metagrid__k">${e(c.k)}</div><div class="metagrid__v">${e(c.v)}</div></div>`
  ).join('')}</div>`;
}

/* ---- Numbered grid (principles) ----------------------------------------- */
function numGrid(items, cols) {
  const cls = cols === 4 ? 'numgrid cols-4' : 'numgrid';
  return `<div class="${cls}">${items.map((it, i) =>
    `<div class="numgrid__cell"><div class="numgrid__i">${String(i + 1).padStart(2, '0')}</div>`
    + `<div class="numgrid__t">${e(it.t)}</div><div class="numgrid__d">${e(it.d)}</div></div>`
  ).join('')}</div>`;
}

/* ---- Step list ----------------------------------------------------------- */
function stepList(items) {
  return `<div class="steps">${items.map((it, i) =>
    `<div class="step"><div class="step__n">${String(i + 1).padStart(2, '0')}</div>`
    + `<div><div class="step__t">${e(it.t)}</div><div class="step__d">${e(it.d)}</div></div></div>`
  ).join('')}</div>`;
}

/* ---- FAQ ----------------------------------------------------------------- */
function faq(items) {
  return `<div class="faq">${items.map((it) =>
    `<details><summary>${e(it.q)}</summary><div class="faq__body">${it.a.map((p) => `<p>${e(p)}</p>`).join('')}</div></details>`
  ).join('')}</div>`;
}

/* ---- Events fallback (Luma is the source of truth) ----------------------- */
function eventsFallback(ctx, data) {
  const P = ctx.paths;
  const quick = [
    lumaLink(ctx, 'circles', { label: ctx.t.common.viewCircles, class: 'btn btn-secondary btn-sm', placement: 'events_quick', analytics: 'circles_booking_click' }),
    lumaLink(ctx, 'flowWaitlist', { label: ctx.t.common.joinWaitlist, class: 'btn btn-secondary btn-sm', placement: 'events_quick', analytics: 'flow_waitlist_click' }),
  ].join('');
  return `<div class="events-empty">
    <p class="eyebrow eyebrow--muted">${e(data.eyebrow)}</p>
    <p class="lead" style="max-width:32ch">${e(data.title)}</p>
    <p class="muted measure" style="text-align:center">${e(data.body)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:6px">
      ${lumaLink(ctx, 'allEvents', { label: ctx.t.common.viewAllEvents, class: 'btn btn-primary', placement: 'events_main', analytics: 'luma_all_events_click' })}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">${quick}</div>
  </div>`;
}

/* ---- CTA band ------------------------------------------------------------ */
function ctaBand(ctx, data, ctaHtml) {
  return `<section class="section ctaband section--dark"><div class="container"><div class="ctaband__inner">
    <div class="ctaband__text">
      <p class="eyebrow">${e(data.eyebrow)}</p>
      <p class="h2" style="margin-top:16px">${e(data.title)}</p>
      ${data.text ? `<p class="subhead" style="margin-top:14px;color:var(--footer-muted)">${e(data.text)}</p>` : ''}
    </div>
    <div>${ctaHtml}</div>
  </div></div></section>`;
}

/* ---- Form field helpers -------------------------------------------------- */
function field(f) {
  const id = f.id;
  const req = f.required ? ' <span class="req" aria-hidden="true">*</span>' : '';
  const validate = [f.required ? 'required' : '', f.type === 'email' ? 'email' : ''].filter(Boolean).join(' ');
  const msg = attr(JSON.stringify(f.messages || {}));
  const dv = validate ? ` data-validate="${validate}" data-msg="${msg}"` : '';
  const hint = f.hint ? `<span class="hint">${e(f.hint)}</span>` : '';
  const reqAttr = f.required ? ' required aria-required="true"' : '';
  let control;
  if (f.control === 'textarea') {
    control = `<textarea class="textarea" id="${id}" name="${attr(f.name || id)}"${dv}${reqAttr} rows="5"${f.placeholder ? ` placeholder="${attr(f.placeholder)}"` : ''}></textarea>`;
  } else if (f.control === 'select') {
    const opts = (f.options || []).map((o, i) => `<option value="${attr(o.value != null ? o.value : o)}"${i === 0 && f.placeholder ? ' disabled selected' : ''}>${e(o.label != null ? o.label : o)}</option>`).join('');
    const ph = f.placeholder ? `<option value="" disabled selected>${e(f.placeholder)}</option>` : '';
    control = `<select class="select" id="${id}" name="${attr(f.name || id)}"${dv}${reqAttr}>${ph}${opts}</select>`;
  } else {
    control = `<input class="input" type="${f.type || 'text'}" id="${id}" name="${attr(f.name || id)}"${dv}${reqAttr}${f.autocomplete ? ` autocomplete="${attr(f.autocomplete)}"` : ''}${f.placeholder ? ` placeholder="${attr(f.placeholder)}"` : ''}>`;
  }
  return `<div class="field"><label for="${id}">${e(f.label)}${req}</label>${hint}${control}<span class="field__err" data-err aria-live="polite"></span></div>`;
}

function checkField(f) {
  const id = f.id;
  const msg = attr(JSON.stringify(f.messages || {}));
  return `<div class="checkfield" ><input type="checkbox" id="${id}" name="${attr(f.name || id)}" data-validate="required" data-msg="${msg}" required aria-required="true"><label for="${id}">${f.labelHtml || e(f.label)}<span class="field__err" data-err aria-live="polite" style="display:block"></span></label></div>`;
}

/* ---- Section scaffolds --------------------------------------------------- */
function sectionHead(data, opts) {
  opts = opts || {};
  const cls = opts.split ? 'section-head section-head--split' : 'section-head';
  const text = `<div class="section-head__text">
    ${data.eyebrow ? `<p class="eyebrow">${e(data.eyebrow)}</p>` : ''}
    ${data.title ? `<h2 class="h2">${e(data.title)}</h2>` : ''}
    ${data.text ? `<p class="subhead">${e(data.text)}</p>` : ''}
  </div>`;
  return `<div class="${cls}">${text}${opts.aside || ''}</div>`;
}

/* ---- Document layout ----------------------------------------------------- */
function layout(ctx, head, bodyHtml) {
  const lang = ctx.lang;
  const analyticsSnippet = config.analyticsId
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${attr(config.analyticsId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${attr(config.analyticsId)}');</script>`
    : '';

  const jsonld = (head.jsonld || []).map((obj) =>
    `<script type="application/ld+json">${JSON.stringify(obj)}</script>`).join('\n');

  const ogLocale = lang === 'el' ? 'el_GR' : 'en_GB';
  const ogLocaleAlt = lang === 'el' ? 'en_GB' : 'el_GR';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className+=' js';</script>
${analyticsSnippet}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="/assets/somo.css">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon.png" sizes="48x48">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta name="theme-color" content="#F2ECDF">
<title>${e(head.title)}</title>
<meta name="description" content="${attr(head.description)}">
<link rel="canonical" href="${attr(ctx.canonical)}">
<link rel="alternate" hreflang="el" href="${attr(ctx.elUrl)}">
<link rel="alternate" hreflang="en" href="${attr(ctx.enUrl)}">
<link rel="alternate" hreflang="x-default" href="${attr(ctx.elUrl)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SOMO">
<meta property="og:title" content="${attr(head.ogTitle || head.title)}">
<meta property="og:description" content="${attr(head.description)}">
<meta property="og:url" content="${attr(ctx.canonical)}">
<meta property="og:image" content="${attr(ctx.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(head.ogAlt || head.title)}">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:locale:alternate" content="${ogLocaleAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(head.ogTitle || head.title)}">
<meta name="twitter:description" content="${attr(head.description)}">
<meta name="twitter:image" content="${attr(ctx.ogImage)}">
<meta name="robots" content="index,follow,max-image-preview:large">
${jsonld}
</head>
<body>
<a class="skip-link" href="#main">${e(ctx.t.common.skip)}</a>
${announce(ctx)}
${header(ctx)}
<main id="main">
${bodyHtml}
</main>
${footer(ctx)}
<script src="/assets/somo.js" defer></script>
</body>
</html>`;
}

module.exports = {
  e, attr, arrow, caret, PRODUCT_ORDER,
  lumaLink, ctaLink, announce, header, footer, productCard, explainBox,
  metaGrid, numGrid, stepList, faq, eventsFallback, ctaBand, field, checkField,
  sectionHead, layout,
};
