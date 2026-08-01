/*
 * SOMO — page bodies. Language-agnostic: every string comes from ctx.t.
 * Each renderer returns the inner HTML of <main>. Layout/head live elsewhere.
 */
const C = require('./components');
const { config } = require('./config');

const e = C.e, attr = C.attr, arrow = C.arrow;

/* Small section helpers */
function S(inner, opts) {
  opts = opts || {};
  const cls = ['section', opts.class || '', opts.reveal === false ? '' : 'reveal'].filter(Boolean).join(' ');
  const id = opts.id ? ` id="${attr(opts.id)}"` : '';
  return `<section class="${cls}"${id}><div class="container">${inner}</div></section>`;
}
function rule() { return `<div class="container"><hr class="rule"></div>`; }
function bullets(items) { return `<ul>${items.map((i) => `<li>${e(i)}</li>`).join('')}</ul>`; }

/* ============================ HOME ======================================== */
function home(ctx) {
  const t = ctx.t.home;
  const P = ctx.paths;

  const hero = `<section class="hero"><div class="container"><div class="hero__inner reveal">
    <p class="eyebrow hero__eyebrow">${e(t.hero.eyebrow)}</p>
    <h1 class="wordmark"><span aria-hidden="true">SOMO<span class="dot">.</span></span><span class="visually-hidden">${e(t.hero.h1sr)}</span></h1>
    <p class="lead">${e(t.hero.lead)}</p>
    <p class="eyebrow hero__loc">${e(t.hero.loc)}</p>
    <div class="hero__actions">
      ${C.lumaLink(ctx, 'allEvents', { label: ctx.t.common.viewExperiences, class: 'btn btn-primary', placement: 'home_hero', analytics: 'luma_all_events_click' })}
      <a class="btn btn-secondary" href="#experiences">${e(t.hero.secondary)}</a>
    </div>
  </div></div>
  <div class="container"><div class="reveal">${C.metaGrid(t.hero.meta)}</div></div></section>`;

  const intro = S(`<div class="split split--wide-first">
    <div>
      <p class="eyebrow">${e(t.intro.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.intro.title)}</h2>
    </div>
    <div class="prose">
      ${t.intro.body.map((p) => `<p>${e(p)}</p>`).join('')}
      <ul>${t.intro.points.map((pt) => `<li><strong>${e(pt.name)}</strong> ${e(pt.text)}</li>`).join('')}</ul>
    </div>
  </div>`);

  const experiences = S(
    C.sectionHead({ eyebrow: t.experiences.eyebrow, title: t.experiences.title, text: t.experiences.text })
    + `<div class="grid grid-3">${C.PRODUCT_ORDER.map((k) => C.productCard(ctx, k)).join('')}</div>`,
    { id: 'experiences' });

  const events = S(
    C.sectionHead({ eyebrow: t.events.eyebrow, title: t.events.title, text: t.events.text })
    + C.eventsFallback(ctx, t.events.fallback),
    { id: 'events' });

  const howworks = S(
    C.sectionHead({ eyebrow: t.how.eyebrow, title: t.how.title, text: t.how.text })
    + C.numGrid(t.how.principles, 4));

  const referral = S(`<div class="split">
    <div>
      <p class="eyebrow">${e(t.referral.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.referral.title)}</h2>
      <div class="prose" style="margin-top:20px">${t.referral.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <div style="margin-top:26px">${C.ctaLink(P.organisations, ctx.t.common.hostSomo, { class: 'btn btn-primary', analytics: 'outdoors_event_click', placement: 'home_referral' })}</div>
    </div>
    <div class="stack">
      <div class="card"><div class="card__cat">Somo Circles</div><p class="card__desc" style="margin-top:10px">${e(t.referral.circles)}</p></div>
      <div class="card"><div class="card__cat">Somo Flow · ${e(ctx.t.common.soon)}</div><p class="card__desc" style="margin-top:10px">${e(t.referral.flow)}</p></div>
    </div>
  </div>`, { class: 'section--tight' });

  const outdoors = S(`<div class="split split--wide-first">
    <div>
      <p class="eyebrow">${e(t.outdoorsIntro.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.outdoorsIntro.title)}</h2>
    </div>
    <div>
      <div class="prose">${t.outdoorsIntro.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <ul class="prose" style="margin-top:8px">${t.outdoorsIntro.points.map((i) => `<li>${e(i)}</li>`).join('')}</ul>
      <div class="pagehero__actions">
        ${C.ctaLink(P.outdoors, ctx.t.common.applyOutdoors, { class: 'btn btn-primary', analytics: 'outdoors_application_start', placement: 'home_outdoors' })}
        ${C.lumaLink(ctx, 'outdoors', { label: ctx.t.common.seeNextEvent, class: 'textlink', placement: 'home_outdoors', analytics: 'outdoors_event_click' })}
      </div>
    </div>
  </div>`);

  const about = S(`<div class="founder">
    <div class="founder__photo"><img src="/assets/img/aggelos.jpg" width="600" height="750" alt="${attr(t.about.photoAlt)}" loading="lazy"></div>
    <div>
      <p class="eyebrow">${e(t.about.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.about.title)}</h2>
      <div class="prose" style="margin-top:20px">${t.about.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <div style="margin-top:26px">${C.ctaLink(P.about, t.about.cta, { class: 'textlink' })}</div>
    </div>
  </div>`, { class: 'section--tight' });

  const orgs = S(`<div class="split">
    <div>
      <p class="eyebrow">${e(t.orgs.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.orgs.title)}</h2>
    </div>
    <div>
      <div class="prose">${t.orgs.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <div style="margin-top:26px">${C.ctaLink(P.organisations, ctx.t.common.talkToUs, { class: 'btn btn-primary', analytics: 'organisation_form_start', placement: 'home_orgs' })}</div>
    </div>
  </div>`, { class: 'section--tight' });

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.lumaLink(ctx, 'allEvents', { label: ctx.t.common.viewExperiences, class: 'btn btn-orange', placement: 'home_final', analytics: 'luma_all_events_click' }));

  return hero + rule() + intro + rule() + experiences + events + rule() + howworks + referral + rule() + outdoors + about + orgs + finalCta;
}

/* ==================== Generic product page hero =========================== */
function productHero(ctx, t, actions, note) {
  return `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.eyebrow)}</p>
    <h1 class="display" style="margin-top:18px">${e(t.h1)}</h1>
    <p class="lead measure" style="margin-top:24px">${e(t.lead)}</p>
    ${note ? `<p class="pagehero__note">${e(note)}</p>` : ''}
    <div class="pagehero__actions">${actions}</div>
  </div></div></section>`;
}

/* ============================ SOMO CIRCLES ================================= */
function circles(ctx) {
  const t = ctx.t.circles;
  const P = ctx.paths;
  const actions =
    C.lumaLink(ctx, 'circles', { label: ctx.t.common.viewCircles, class: 'btn btn-primary', placement: 'circles_hero', analytics: 'circles_booking_click' })
    + `<a class="textlink" href="#session">${e(t.hero.secondary)} ${arrow}</a>`;

  const hero = productHero(ctx, t.hero, actions, t.hero.note);

  const definition = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.definition.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.definition.title)}</h2></div>
    <div class="prose">${t.definition.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
  </div>`);

  const shaking = S(`<div class="split">
    <div><p class="eyebrow">${e(t.shaking.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.shaking.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.shaking.body.map((p) => `<p>${e(p)}</p>`).join('')}</div></div>
    <div class="card"><p class="label">${e(t.shaking.listLabel)}</p><div class="prose" style="margin-top:14px">${bullets(t.shaking.points)}</div></div>
  </div>`, { class: 'section--tight' });

  const groupTherapy = S(`<div class="split">
    <div class="card"><p class="label">${e(t.group.listLabel)}</p><div class="prose" style="margin-top:14px">${bullets(t.group.points)}</div></div>
    <div><p class="eyebrow">${e(t.group.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.group.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.group.body.map((p) => `<p>${e(p)}</p>`).join('')}</div></div>
  </div>`, { class: 'section--tight' });

  const session = S(
    C.sectionHead({ eyebrow: t.session.eyebrow, title: t.session.title, text: t.session.text })
    + C.stepList(t.session.steps)
    + `<p class="muted" style="margin-top:18px;font-size:.95rem">${e(t.session.note)}</p>`,
    { id: 'session' });

  const suits = S(`<div class="split">
    <div><p class="eyebrow">${e(t.suits.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.suits.title)}</h2>
      <p class="subhead" style="margin-top:16px">${e(t.suits.text)}</p></div>
    <div class="prose">${bullets(t.suits.points)}</div>
  </div>`, { class: 'section--tight' });

  const notFor = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.notFor.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.notFor.title)}</h2></div>
    <div><ul class="notlist">${t.notFor.points.map((i) => `<li><span>${e(i)}</span></li>`).join('')}</ul></div>
  </div>`, { class: 'section--tight' });

  const control = S(`<div class="split">
    <div><p class="eyebrow">${e(t.control.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.control.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.control.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <div style="margin-top:22px">${C.ctaLink(P.safety, t.control.cta, { textlink: true })}</div>
    </div>
    <div class="card"><p class="label">${e(t.control.listLabel)}</p><div class="prose" style="margin-top:14px">${bullets(t.control.points)}</div></div>
  </div>`, { class: 'section--tight' });

  const format = S(
    C.sectionHead({ eyebrow: t.format.eyebrow, title: t.format.title })
    + C.metaGrid(t.format.meta));

  const explain = S(C.explainBox(ctx, t.explain), { class: 'section--tight' });

  const referral = S(`<div class="split">
    <div><p class="eyebrow">${e(t.referral.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.referral.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.referral.body.map((p) => `<p>${e(p)}</p>`).join('')}</div></div>
    <div><div class="pagehero__actions" style="margin-top:0">
      ${C.lumaLink(ctx, 'circles', { label: ctx.t.common.viewCircles, class: 'btn btn-primary', placement: 'circles_referral', analytics: 'circles_booking_click' })}
      ${C.ctaLink(P.organisations, t.referral.secondary, { textlink: true })}
    </div></div>
  </div>`, { class: 'section--tight' });

  const faqSec = S(
    C.sectionHead({ eyebrow: ctx.t.common.faqEyebrow, title: t.faqTitle })
    + C.faq(t.faq));

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.lumaLink(ctx, 'circles', { label: ctx.t.common.viewCircles, class: 'btn btn-orange', placement: 'circles_final', analytics: 'circles_booking_click' }));

  return hero + rule() + definition + shaking + groupTherapy + rule() + session + suits + notFor + control + rule() + format + explain + referral + faqSec + finalCta;
}

/* ============================ SOMO FLOW =================================== */
function flow(ctx) {
  const t = ctx.t.flow;
  const P = ctx.paths;
  const actions =
    C.lumaLink(ctx, 'flowWaitlist', { label: ctx.t.common.joinWaitlist, class: 'btn btn-primary', placement: 'flow_hero', analytics: 'flow_waitlist_click' })
    + `<a class="textlink" href="#session">${e(t.hero.secondary)} ${arrow}</a>`;

  const hero = `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.hero.eyebrow)} <span class="chip chip--orange" style="margin-left:8px">${e(ctx.t.common.soon)}</span></p>
    <h1 class="display" style="margin-top:18px">${e(t.hero.h1)}</h1>
    <p class="lead measure" style="margin-top:24px">${e(t.hero.lead)}</p>
    <div class="pagehero__actions">${actions}</div>
  </div></div></section>`;

  const main = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.main.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.main.title)}</h2></div>
    <div class="prose">${t.main.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
  </div>`);

  const compare = S(
    C.sectionHead({ eyebrow: t.compare.eyebrow, title: t.compare.title, text: t.compare.text })
    + `<div class="compare">
      <div class="compare__col"><h3>${e(t.compare.flow.name)}</h3>${bullets(t.compare.flow.points)}</div>
      <div class="compare__col"><h3>${e(t.compare.circles.name)}</h3>${bullets(t.compare.circles.points)}</div>
    </div>
    <p class="muted" style="margin-top:18px;font-size:.95rem">${e(t.compare.note)}</p>`,
    { class: 'section--tight' });

  const session = S(
    C.sectionHead({ eyebrow: t.session.eyebrow, title: t.session.title })
    + C.stepList(t.session.steps),
    { id: 'session' });

  const suits = S(`<div class="split">
    <div><p class="eyebrow">${e(t.suits.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.suits.title)}</h2></div>
    <div class="prose">${bullets(t.suits.points)}</div>
  </div>`, { class: 'section--tight' });

  const format = S(
    C.sectionHead({ eyebrow: t.format.eyebrow, title: t.format.title })
    + C.metaGrid(t.format.meta));

  const explain = S(C.explainBox(ctx, t.explain), { class: 'section--tight' });

  const partner = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.partner.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.partner.title)}</h2></div>
    <div><div class="prose">${t.partner.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
      <div style="margin-top:24px">${C.ctaLink(P.organisations, t.partner.cta, { class: 'btn btn-secondary' })}</div></div>
  </div>`, { class: 'section--tight' });

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.lumaLink(ctx, 'flowWaitlist', { label: ctx.t.common.joinWaitlist, class: 'btn btn-orange', placement: 'flow_final', analytics: 'flow_waitlist_click' }));

  return hero + rule() + main + compare + rule() + session + suits + format + explain + partner + finalCta;
}

/* ============================ SOMO OUTDOORS =============================== */
function outdoors(ctx) {
  const t = ctx.t.outdoors;
  const P = ctx.paths;
  const actions =
    C.ctaLink('#apply', ctx.t.common.applyOutdoors, { class: 'btn btn-primary', analytics: 'outdoors_application_start', placement: 'outdoors_hero' })
    + C.lumaLink(ctx, 'outdoors', { label: ctx.t.common.seeNextEvent, class: 'textlink', placement: 'outdoors_hero', analytics: 'outdoors_event_click' });

  const hero = productHero(ctx, t.hero, actions, t.hero.note);

  const model = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.model.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.model.title)}</h2></div>
    <div class="prose">${bullets(t.model.points)}</div>
  </div>`);

  const positioning = S(`<div class="split">
    <div><p class="eyebrow">${e(t.positioning.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.positioning.title)}</h2></div>
    <div class="prose">${t.positioning.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
  </div>`, { class: 'section--tight' });

  const activities = S(
    C.sectionHead({ eyebrow: t.activities.eyebrow, title: t.activities.title, text: t.activities.text })
    + `<div class="grid grid-3">
      <div class="card"><div class="card__cat">${e(t.activities.hike.tag)}</div><h3 class="card__name" style="font-size:1.2rem">${e(t.activities.hike.name)}</h3><p class="card__desc">${e(t.activities.hike.text)}</p></div>
      <div class="card"><div class="card__cat">${e(t.activities.walk.tag)}</div><h3 class="card__name" style="font-size:1.2rem">${e(t.activities.walk.name)}</h3><p class="card__desc">${e(t.activities.walk.text)}</p></div>
      <div class="card"><div class="card__cat">${e(t.activities.occasional.tag)}</div><h3 class="card__name" style="font-size:1.2rem">${e(t.activities.occasional.name)}</h3><p class="card__desc">${e(t.activities.occasional.text)}</p></div>
    </div>`);

  const membership = S(
    C.sectionHead({ eyebrow: t.membership.eyebrow, title: t.membership.title })
    + C.stepList(t.membership.steps),
    { class: 'section--tight' });

  const audience = S(`<div class="split">
    <div><p class="eyebrow">${e(t.audience.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.audience.title)}</h2>
      <p class="subhead" style="margin-top:16px">${e(t.audience.text)}</p></div>
    <div class="prose">${bullets(t.audience.points)}</div>
  </div>`, { class: 'section--tight' });

  const culture = S(
    C.sectionHead({ eyebrow: t.culture.eyebrow, title: t.culture.title, text: t.culture.text })
    + C.numGrid(t.culture.points, 4));

  const explain = S(C.explainBox(ctx, t.explain), { class: 'section--tight' });

  // Application form
  const f = ctx.t.forms.outdoors;
  const endpoint = config.outdoorsApplicationUrl;
  const mailto = config.contactEmail;
  const applyForm = S(`<div class="split split--wide-first">
    <div>
      <p class="eyebrow">${e(f.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(f.title)}</h2>
      <div class="prose" style="margin-top:18px">${f.intro.map((p) => `<p>${e(p)}</p>`).join('')}</div>
    </div>
    <div>
      <form class="form" data-somo-form action="${attr(endpoint)}" method="POST"
        data-confirm="outdoors-confirm" data-mailto="${attr(mailto)}"
        data-mail-subject="${attr(f.mailSubject)}"
        data-event-start="outdoors_application_start" data-event-submit="outdoors_application_submit"
        data-msg-invalid="${attr(ctx.t.forms.invalid)}">
        <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
        <div class="form__row cols-2">
          ${C.field({ id: 'o-name', label: f.fields.name, required: true, autocomplete: 'name', messages: f.msg })}
          ${C.field({ id: 'o-email', label: f.fields.email, type: 'email', required: true, autocomplete: 'email', messages: f.msg })}
        </div>
        ${C.field({ id: 'o-profile', label: f.fields.profile, hint: f.fields.profileHint, required: true, messages: f.msg })}
        ${C.field({ id: 'o-role', label: f.fields.role, required: true, messages: f.msg })}
        ${C.field({ id: 'o-why', label: f.fields.why, control: 'textarea', required: true, hint: f.fields.whyHint, messages: f.msg })}
        ${C.checkField({ id: 'o-selling', name: 'understands_not_selling', label: f.fields.notSelling, messages: f.msg })}
        ${C.checkField({ id: 'o-privacy', name: 'privacy', labelHtml: f.fields.privacyHtml.replace('%URL%', attr(P.privacy)), messages: f.msg })}
        <div class="form__actions">
          <button class="btn btn-primary" type="submit">${e(f.submit)} ${arrow}</button>
          <span class="form__status" data-form-status role="status" aria-live="polite"></span>
        </div>
        <p class="form__note">${e(f.note)}</p>
      </form>
      <div class="confirm" id="outdoors-confirm" hidden>
        <h3 class="h3">${e(ctx.t.forms.confirm.outdoorsTitle)}</h3>
        <p>${e(ctx.t.forms.confirm.outdoorsBody)}</p>
      </div>
    </div>
  </div>`, { id: 'apply' });

  const faqSec = S(
    C.sectionHead({ eyebrow: ctx.t.common.faqEyebrow, title: t.faqTitle })
    + C.faq(t.faq));

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.ctaLink('#apply', ctx.t.common.applyOutdoors, { class: 'btn btn-orange', analytics: 'outdoors_application_start', placement: 'outdoors_final' }));

  return hero + rule() + model + positioning + rule() + activities + membership + audience + culture + explain + applyForm + faqSec + finalCta;
}

/* ============================ FOR ORGANISATIONS ========================== */
function organisations(ctx) {
  const t = ctx.t.organisations;
  const P = ctx.paths;
  const actions = C.ctaLink('#contact', ctx.t.common.talkToUs, { class: 'btn btn-primary', analytics: 'organisation_form_start', placement: 'orgs_hero' });

  const hero = `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.hero.eyebrow)}</p>
    <h1 class="display" style="margin-top:18px">${e(t.hero.h1)}</h1>
    <p class="lead measure" style="margin-top:24px">${e(t.hero.lead)}</p>
    <div class="pagehero__actions">${actions}</div>
  </div></div></section>`;

  const adapt = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.adapt.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.adapt.title)}</h2></div>
    <div class="prose">${bullets(t.adapt.points)}</div>
  </div>`);

  const teams = S(`<div class="split">
    <div><p class="eyebrow">${e(t.teams.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.teams.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.teams.body.map((p) => `<p>${e(p)}</p>`).join('')}</div></div>
    <div class="card"><p class="label">${e(t.teams.listLabel)}</p><div class="prose" style="margin-top:14px">${bullets(t.teams.points)}</div></div>
  </div>`, { class: 'section--tight' });

  const studios = S(`<div class="split">
    <div class="card"><p class="label">${e(t.studios.listLabel)}</p><div class="prose" style="margin-top:14px">${bullets(t.studios.points)}</div></div>
    <div><p class="eyebrow">${e(t.studios.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.studios.title)}</h2>
      <div class="prose" style="margin-top:18px">${t.studios.body.map((p) => `<p>${e(p)}</p>`).join('')}</div></div>
  </div>`, { class: 'section--tight' });

  const process = S(
    C.sectionHead({ eyebrow: t.process.eyebrow, title: t.process.title })
    + C.stepList(t.process.steps));

  // Contact form
  const f = ctx.t.forms.org;
  const endpoint = config.contactFormUrl;
  const mailto = config.contactEmail;
  const contactForm = S(`<div class="split split--wide-first">
    <div>
      <p class="eyebrow">${e(f.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(f.title)}</h2>
      <div class="prose" style="margin-top:18px">${f.intro.map((p) => `<p>${e(p)}</p>`).join('')}</div>
    </div>
    <div>
      <form class="form" data-somo-form action="${attr(endpoint)}" method="POST"
        data-confirm="org-confirm" data-mailto="${attr(mailto)}"
        data-mail-subject="${attr(f.mailSubject)}"
        data-event-start="organisation_form_start" data-event-submit="organisation_form_submit"
        data-msg-invalid="${attr(ctx.t.forms.invalid)}">
        <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
        <div class="form__row cols-2">
          ${C.field({ id: 'c-name', label: f.fields.name, required: true, autocomplete: 'name', messages: f.msg })}
          ${C.field({ id: 'c-email', label: f.fields.email, type: 'email', required: true, autocomplete: 'email', messages: f.msg })}
        </div>
        <div class="form__row cols-2">
          ${C.field({ id: 'c-org', label: f.fields.org, required: true, messages: f.msg })}
          ${C.field({ id: 'c-type', label: f.fields.type, control: 'select', required: true, placeholder: f.fields.typePlaceholder, options: f.fields.typeOptions, messages: f.msg })}
        </div>
        <div class="form__row cols-2">
          ${C.field({ id: 'c-size', label: f.fields.size, messages: f.msg })}
          ${C.field({ id: 'c-location', label: f.fields.location, messages: f.msg })}
        </div>
        ${C.field({ id: 'c-about', label: f.fields.about, control: 'textarea', required: true, messages: f.msg })}
        ${C.field({ id: 'c-timing', label: f.fields.timing, messages: f.msg })}
        ${C.checkField({ id: 'c-privacy', name: 'privacy', labelHtml: f.fields.privacyHtml.replace('%URL%', attr(P.privacy)), messages: f.msg })}
        <div class="form__actions">
          <button class="btn btn-primary" type="submit">${e(f.submit)} ${arrow}</button>
          <span class="form__status" data-form-status role="status" aria-live="polite"></span>
        </div>
        <p class="form__note">${e(f.note)}</p>
      </form>
      <div class="confirm" id="org-confirm" hidden>
        <h3 class="h3">${e(ctx.t.forms.confirm.orgTitle)}</h3>
        <p>${e(ctx.t.forms.confirm.orgBody)}</p>
      </div>
    </div>
  </div>`, { id: 'contact' });

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.ctaLink('#contact', t.finalCta.cta, { class: 'btn btn-orange', analytics: 'organisation_form_start', placement: 'orgs_final' }));

  return hero + rule() + adapt + teams + studios + rule() + process + contactForm + finalCta;
}

/* ============================ ABOUT ====================================== */
function about(ctx) {
  const t = ctx.t.about;
  const P = ctx.paths;
  const hero = `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.hero.eyebrow)}</p>
    <h1 class="display" style="margin-top:18px">${e(t.hero.h1)}</h1>
    <p class="lead measure" style="margin-top:24px">${e(t.hero.lead)}</p>
  </div></div></section>`;

  const origin = S(`<div class="split split--wide-first">
    <div><p class="eyebrow">${e(t.origin.eyebrow)}</p><h2 class="h2" style="margin-top:16px">${e(t.origin.title)}</h2></div>
    <div class="prose">${t.origin.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
  </div>`);

  const founder = S(`<div class="founder">
    <div class="founder__photo"><img src="/assets/img/aggelos.jpg" width="600" height="750" alt="${attr(t.founder.photoAlt)}" loading="lazy"></div>
    <div>
      <p class="eyebrow">${e(t.founder.eyebrow)}</p>
      <h2 class="h2" style="margin-top:16px">${e(t.founder.name)}</h2>
      <div class="prose" style="margin-top:20px">${t.founder.body.map((p) => `<p>${e(p)}</p>`).join('')}</div>
    </div>
  </div>`, { class: 'section--tight' });

  const philosophy = S(
    C.sectionHead({ eyebrow: t.philosophy.eyebrow, title: t.philosophy.title })
    + C.numGrid(t.philosophy.points, 4));

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.lumaLink(ctx, 'allEvents', { label: ctx.t.common.viewExperiences, class: 'btn btn-orange', placement: 'about_final', analytics: 'luma_all_events_click' }));

  return hero + rule() + origin + founder + rule() + philosophy + finalCta;
}

/* ============================ SAFETY & FAQ =============================== */
function safety(ctx) {
  const t = ctx.t.safety;
  const P = ctx.paths;
  const hero = `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.hero.eyebrow)}</p>
    <h1 class="display" style="margin-top:18px">${e(t.hero.h1)}</h1>
    <p class="lead measure" style="margin-top:24px">${e(t.hero.lead)}</p>
  </div></div></section>`;

  function block(b) {
    return `<div class="split split--wide-first" style="margin-top:0">
      <div><h2 class="h2" style="font-size:clamp(1.4rem,2.6vw,2rem)">${e(b.title)}</h2></div>
      <div class="prose">${(b.body || []).map((p) => `<p>${e(p)}</p>`).join('')}${b.points ? bullets(b.points) : ''}</div>
    </div>`;
  }
  const principles = S(`<p class="eyebrow">${e(t.principles.eyebrow)}</p>
    <div style="display:grid;gap:40px;margin-top:30px">${t.principles.blocks.map(block).join('')}</div>`);

  const clarify = S(`<p class="eyebrow">${e(t.clarify.eyebrow)}</p>
    <div style="display:grid;gap:40px;margin-top:30px">${t.clarify.blocks.map(block).join('')}</div>`,
    { class: 'section--tight' });

  const faqSec = S(
    C.sectionHead({ eyebrow: ctx.t.common.faqEyebrow, title: t.faqTitle })
    + C.faq(t.faq));

  const finalCta = C.ctaBand(ctx, t.finalCta,
    C.lumaLink(ctx, 'allEvents', { label: ctx.t.common.viewExperiences, class: 'btn btn-orange', placement: 'safety_final', analytics: 'luma_all_events_click' }));

  return hero + rule() + principles + clarify + rule() + faqSec + finalCta;
}

/* ============================ LEGAL (privacy / participation) ============ */
function legal(ctx, key) {
  const t = ctx.t[key];
  // NOTE: The privacy and participation wording below is provisional and must be
  // reviewed by a qualified legal professional before launch. Legal-entity and
  // official contact details are supplied via the CONTACT_EMAIL configuration.
  const reviewComment = '<!-- Provisional legal copy: review by a qualified professional required before launch. -->';
  const hero = reviewComment + `<section class="pagehero section--tight"><div class="container"><div class="reveal">
    <p class="eyebrow">${e(t.eyebrow)}</p>
    <h1 class="h1" style="margin-top:18px">${e(t.title)}</h1>
    <p class="subhead measure" style="margin-top:20px">${e(t.intro)}</p>
    ${t.updated ? `<p class="label" style="margin-top:18px">${e(t.updated)}</p>` : ''}
  </div></div></section>`;

  const body = S(`<div class="split split--wide-first" style="align-items:start">
    <div>${t.toc ? `<nav aria-label="${attr(t.tocLabel || '')}"><p class="label">${e(t.tocLabel)}</p><ul style="margin-top:14px;display:grid;gap:10px">${t.sections.map((s, i) => `<li><a class="link" href="#s${i}">${e(s.h)}</a></li>`).join('')}</ul></nav>` : ''}</div>
    <div class="prose">
      ${t.sections.map((s, i) => `<div id="s${i}" style="margin-top:${i ? '2.4rem' : '0'}"><h2 class="h3" style="font-size:1.25rem">${e(s.h)}</h2>${s.body.map((p) => `<p>${e(p)}</p>`).join('')}${s.points ? bullets(s.points) : ''}</div>`).join('')}
    </div>
  </div>`);

  return hero + rule() + body;
}

/* ============================ dispatch ==================================== */
function render(ctx) {
  switch (ctx.page) {
    case 'home': return home(ctx);
    case 'circles': return circles(ctx);
    case 'flow': return flow(ctx);
    case 'outdoors': return outdoors(ctx);
    case 'organisations': return organisations(ctx);
    case 'about': return about(ctx);
    case 'safety': return safety(ctx);
    case 'privacy': return legal(ctx, 'privacy');
    case 'participation': return legal(ctx, 'participation');
    default: return '';
  }
}

module.exports = { render };
