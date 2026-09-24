// roast-my-offer.jsx — the "Roast my offer" free tool.
//
// Unlike the five clarity tools this is not a self-scoring diagnostic: it
// collects an offer, and the teardown is produced outside the site and emailed
// back. So it is a lead form wearing the tool-page shell.
//
// Everything here is borrowed rather than invented:
//   • the page frame is window.LegacyShell (form: true, cta: false), the exact
//     shell the five clarity tools mount into
//   • the type scale, eyebrow, page container and .cta-btn button come from the
//     clarity tool pages, so this reads as one of them
//   • the form mechanics are the contact form's: honeypot, client-side rate
//     limit, validate → focus first invalid → aria-invalid + aria-describedby,
//     inline errors, a polite live region, sending state, success state
//   • submission is window.submitLead (lead-capture.js) — the same EmailJS
//     notification and Google Sheet row every other form on the site produces
//
// The user's answers survive a failed submit: nothing is cleared until success.

var e = React.createElement;

var RO_SOURCE = 'roast-my-offer';
var RO_EMAILJS_TEMPLATE = 'template_wdsrbdo';
var RO_MAXLEN = 6000;         // pasted offer copy can be long
var RO_MAXLEN_SHORT = 300;
var RO_RATE_MS = 15000;       // same soft guard as the contact form
var PRIVACY_HREF = (typeof window !== 'undefined' && window.cPath) ? window.cPath('confidentiality', 'en') + '#privacy' : '/confidentiality/#privacy';

var STRUGGLES = [
  { value: 'positioning', label: 'Positioning' },
  { value: 'conversion', label: 'Conversion' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'differentiation', label: 'Differentiation' },
  { value: 'not-sure', label: "I'm not sure" },
];
var VALID_STRUGGLE = STRUGGLES.reduce(function (m, o) { m[o.value] = o.label; return m; }, {});

function roTrack(name, params) {
  try { if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (err) { /* noop */ }
}
function roClean(s) { return (s || '').replace(/[\u0000-\u001F\u007F]/g, '').trim(); }
function roValidEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
// Deliberately forgiving: people paste "site.com/offer" as often as a full URL.
function roValidUrl(s) {
  var v = roClean(s);
  if (!v) return false;
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try { var u = new URL(v); return !!u.hostname && u.hostname.indexOf('.') > 0; } catch (err) { return false; }
}
function roNormaliseUrl(s) {
  var v = roClean(s);
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : 'https://' + v;
}

// ── Styles ───────────────────────────────────────────────────────────────────
// Field chrome (radius, focus ring, error red, help text) is transcribed from
// the contact form so the two feel like one system; the page rhythm, eyebrow
// and heading scale come from the clarity tool pages.
var ROAST_CSS = [
  '.ro-page{max-width:820px;margin:0 auto;padding:3.5rem 2.5rem 6rem;color:var(--ink-2,#3A403A);font-family:inherit}',
  '.ro-eyebrow{font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--green,#047857);line-height:1.6;margin:0 0 1rem}',
  '.ro-h1{font-family:var(--font-heading);font-synthesis:none;font-size:44px;font-weight:800;line-height:1.05;letter-spacing:-0.035em;color:var(--ink-2,#3A403A);margin:0 0 1.25rem}',
  '.ro-lead{margin:0 0 1.2rem;line-height:1.7;font-size:18px;color:var(--ink-2,#3A403A)}',
  '.ro-note{font-size:14px;color:var(--meta,#6A6F67);line-height:1.7;margin:0 0 2.2rem}',

  '.ro-form{margin:0}',
  '.ro-fieldset{border:0;padding:0;margin:0 0 26px}',
  '.ro-legend{display:block;padding:0;font-size:14px;font-weight:700;letter-spacing:0.02em;color:var(--ink,#171919);margin-bottom:8px}',
  '.ro-field{margin-bottom:26px}',
  '.ro-label{display:block;font-size:14px;font-weight:700;letter-spacing:0.02em;color:var(--ink,#171919);margin-bottom:8px}',
  '.ro-req{color:var(--green,#047857)}',
  '.ro-input,.ro-select,.ro-textarea{display:block;width:100%;min-height:52px;border:1px solid rgba(23,25,25,0.22);border-radius:10px;background:var(--bone,#F3F0E8);color:var(--ink-2,#3A403A);font-family:inherit;font-size:16px;line-height:1.5;padding:14px 15px;outline:none;transition:border-color .16s,box-shadow .16s}',
  '.ro-textarea{min-height:150px;resize:vertical}',
  '.ro-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23282726\' stroke-width=\'1.6\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px}',
  '.ro-input:focus,.ro-select:focus,.ro-textarea:focus{border-color:var(--green,#047857);box-shadow:0 0 0 3px rgba(4,120,87,0.22)}',
  '.ro-input[aria-invalid="true"],.ro-select[aria-invalid="true"],.ro-textarea[aria-invalid="true"]{border-color:#c0392b}',
  '.ro-help{margin:7px 0 0;font-size:13px;line-height:1.5;color:var(--meta,#6A6F67)}',
  '.ro-count{margin:7px 0 0;font-size:13px;color:var(--meta,#6A6F67);text-align:right}',
  '.ro-err{margin:7px 0 0;font-size:13px;line-height:1.5;color:#c0392b;font-weight:600}',
  '.ro-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
  '.ro-formerr{margin:0 0 20px;padding:14px 16px;border:1px solid rgba(192,57,43,.4);background:rgba(192,57,43,.06);border-radius:10px;font-size:15px;line-height:1.55;color:#c0392b}',

  // the two ways of giving an offer, held together as one requirement
  '.ro-or{display:flex;align-items:center;gap:14px;margin:14px 0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--meta,#6A6F67)}',
  '.ro-or::before,.ro-or::after{content:"";flex:1;height:1px;background:rgba(23,25,25,0.16)}',

  // consent — a real checkbox, comfortably tappable, never pre-ticked
  '.ro-consent{display:flex;align-items:flex-start;gap:12px;margin:0 0 10px;padding:16px;border:1px solid rgba(23,25,25,0.16);border-radius:10px;background:rgba(23,25,25,0.02)}',
  '.ro-consent input{flex:none;width:20px;height:20px;margin-top:2px;accent-color:var(--green,#047857);cursor:pointer}',
  '.ro-consent label{font-size:15px;line-height:1.55;color:var(--ink-2,#3A403A);cursor:pointer}',
  '.ro-consent__note{display:block;margin-top:4px;font-size:13px;line-height:1.5;color:var(--meta,#6A6F67)}',

  // The clarity tool pages build this button from an inline style object rather
  // than the .cta-btn class (which only carries the transitions), so the look is
  // transcribed here: same green, radius, padding and type as "Start assessment".
  '.ro-submit{display:inline-flex;align-items:center;justify-content:center;gap:9px;margin-top:6px;padding:.9rem 1.7rem;min-height:52px;background:var(--green,#047857);color:#F3F0E8;border:1.5px solid var(--green,#047857);border-radius:2px;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;line-height:1;cursor:pointer;transition:background .18s,border-color .18s,box-shadow .18s}',
  '.ro-submit:hover{background:var(--green-pressed,#03654A);border-color:var(--green-pressed,#03654A);color:#F3F0E8;box-shadow:0 6px 18px rgba(4,120,87,.28)}',
  '.ro-submit[disabled]{opacity:.55;cursor:default;box-shadow:none}',
  '.ro-submit[disabled]:hover{background:var(--green,#047857);border-color:var(--green,#047857)}',
  '.ro-micro{margin:16px 0 0;font-size:14px;line-height:1.6;color:var(--ink-2,#3A403A)}',
  '.ro-privacy{margin:8px 0 0;font-size:13px;line-height:1.6;color:var(--meta,#6A6F67)}',
  '.ro-privacy a{color:var(--green,#047857);text-decoration:underline;text-underline-offset:2px}',

  // success — same shape as the contact form's confirmation
  '.ro-success{display:flex;flex-direction:column;align-items:flex-start}',
  '.ro-success h2{margin:0 0 14px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(28px,3.4vw,40px);font-weight:800;line-height:1.08;letter-spacing:-0.03em;color:var(--ink,#171919);outline:none}',
  '.ro-success p{margin:0 0 24px;font-size:18px;line-height:1.65;color:var(--ink-2,#3A403A);max-width:54ch}',
  '.ro-success strong{font-weight:700;color:var(--ink,#171919)}',
  '.ro-success__row{display:flex;flex-wrap:wrap;gap:12px}',
  '.ro-btn2{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 22px;border-radius:2px;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;cursor:pointer}',
  '.ro-btn2--green{background:var(--green,#047857);color:#F3F0E8;border:1.5px solid var(--green,#047857)}',
  '.ro-btn2--green:hover{background:var(--green-pressed,#03654A);color:#F3F0E8}',
  '.ro-btn2--outline{background:transparent;color:var(--ink-2,#3A403A);border:1.5px solid rgba(23,25,25,.35)}',
  '.ro-btn2--outline:hover{border-color:var(--green,#047857);color:var(--green,#047857)}',

  '@media (max-width:767px){',
  '.ro-page{padding:1.75rem 1.25rem 5rem}',
  '.ro-h1{font-size:30px}',
  '.ro-lead{font-size:17px}',
  '.ro-success__row{width:100%}',
  '.ro-btn2{width:100%}',
  '.ro-submit{width:100%}',
  '}',
].join('');

function RoastStyles() { return e('style', { dangerouslySetInnerHTML: { __html: ROAST_CSS } }); }

// ── The form ─────────────────────────────────────────────────────────────────
function RoastMyOfferForm() {
  var R = React;
  var urlS = R.useState('');
  var pasteS = R.useState('');
  var audienceS = R.useState('');
  var priceS = R.useState('');
  var struggleS = R.useState('');
  var emailS = R.useState('');
  var consentS = R.useState(false);
  var hpS = R.useState('');            // honeypot
  var errorsS = R.useState({});
  var formErrS = R.useState(false);
  var statusS = R.useState('idle');    // idle | sending | success
  var sentToS = R.useState('');

  var url = urlS[0], paste = pasteS[0], audience = audienceS[0], price = priceS[0];
  var struggle = struggleS[0], email = emailS[0], consent = consentS[0], hp = hpS[0];
  var errors = errorsS[0], formErr = formErrS[0], status = statusS[0];

  var refs = {
    offer: R.useRef(null), audience: R.useRef(null),
    struggle: R.useRef(null), email: R.useRef(null),
  };
  var successRef = R.useRef(null);
  var liveRef = R.useRef(null);
  var lastSubmitRef = R.useRef(0);

  R.useEffect(function () { roTrack('roast_viewed', {}); }, []);
  R.useEffect(function () {
    if (status === 'success' && successRef.current) { try { successRef.current.focus(); } catch (err) {} }
  }, [status]);

  function announce(t) { if (liveRef.current) liveRef.current.textContent = t; }
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (err) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (err) {} }

  function validate() {
    var er = {};
    // The offer is one requirement satisfied by either input.
    if (!roClean(url) && !roClean(paste)) {
      er.offer = 'Add a link to your offer, or paste it below. Either one is fine.';
    } else if (roClean(url) && !roValidUrl(url)) {
      er.offer = "That link doesn't look right. Check it, or paste the offer instead.";
    }
    if (!roClean(audience)) er.audience = 'Tell me roughly who this is for.';
    if (!struggle) er.struggle = 'Pick the closest one.';
    var em = roClean(email);
    if (!em) er.email = 'I need an email to send the teardown to.';
    else if (!roValidEmail(em)) er.email = 'Please enter a valid email address.';
    return er;
  }

  // Clear a field's error the moment it is corrected, rather than making the
  // person submit again to find out they fixed it.
  function clearErr(key) {
    if (!errors[key]) return;
    var next = {};
    for (var k in errors) if (Object.prototype.hasOwnProperty.call(errors, k) && k !== key) next[k] = errors[k];
    errorsS[1](next);
  }

  function focusFirstInvalid(er) {
    var order = ['offer', 'audience', 'struggle', 'email'];
    for (var i = 0; i < order.length; i++) {
      if (er[order[i]] && refs[order[i]] && refs[order[i]].current) { refs[order[i]].current.focus(); return; }
    }
  }

  function onSubmit(ev) {
    ev.preventDefault();
    roTrack('roast_submit_attempted', {});
    // Honeypot: a filled hidden field means a bot — show success, send nothing.
    if (hp) { sentToS[1](roClean(email)); statusS[1]('success'); return; }

    var er = validate();
    errorsS[1](er);
    if (Object.keys(er).length) {
      formErrS[1](false);
      focusFirstInvalid(er);
      announce('The form has errors. Please check the highlighted fields.');
      return;
    }
    var now = Date.now();
    var last = lastSubmitRef.current || Number(safeGet('ro_last') || 0);
    if (now - last < RO_RATE_MS) {
      formErrS[1](true);
      announce('Please wait a few seconds before sending again.');
      return;
    }

    formErrS[1](false);
    statusS[1]('sending');
    announce('Sending your offer.');

    var offerUrl = roNormaliseUrl(url);
    var offerText = roClean(paste).slice(0, RO_MAXLEN);
    var audienceTxt = roClean(audience).slice(0, RO_MAXLEN_SHORT);
    var priceTxt = roClean(price).slice(0, RO_MAXLEN_SHORT);
    var struggleLabel = VALID_STRUGGLE[struggle] || struggle;
    var em = roClean(email);

    var body = [
      'Offer URL:',
      offerUrl || '(none given)',
      '',
      'Pasted offer:',
      offerText || '(none pasted)',
      '',
      'Who it is for:',
      audienceTxt,
      '',
      'Rough price / pricing model:',
      priceTxt || '(not given)',
      '',
      'Struggling most with:',
      struggleLabel,
      '',
      'Newsletter consent: ' + (consent ? 'yes' : 'no'),
    ].join('\n');

    // One line for the sheet's last column, so a row is readable without
    // opening the email.
    var extra = [
      offerUrl ? 'URL: ' + offerUrl : 'URL: —',
      'For: ' + audienceTxt,
      'Price: ' + (priceTxt || '—'),
      'Struggle: ' + struggleLabel,
      offerText ? 'Pasted offer: ' + offerText.slice(0, 500) + (offerText.length > 500 ? '…' : '') : 'Pasted offer: —',
    ].join(' · ');

    window.submitLead({
      source: RO_SOURCE,
      detail: struggle,
      detailLabel: struggleLabel,
      name: '',
      email: em,
      notes: 'For: ' + audienceTxt + (priceTxt ? ' · ' + priceTxt : '') + ' · Struggling with: ' + struggleLabel,
      body: body,
      newsletter: !!consent,
      detailExtra: extra,
      template: RO_EMAILJS_TEMPLATE,
      // Keep template_wdsrbdo's own fields populated so it renders as it always has.
      params: {
        overall_grade: 'Roast My Offer — ' + struggleLabel,
        overall_score: struggleLabel,
        section_breakdown: 'For: ' + audienceTxt + '\nPrice: ' + (priceTxt || '—') + '\nStruggling with: ' + struggleLabel,
        all_answers: body,
        offer_url: offerUrl,
        offer_text: offerText,
        target_audience: audienceTxt,
        offer_price: priceTxt,
        main_struggle: struggleLabel,
        newsletter_consent: consent ? 'yes' : 'no',
      },
    }, function (ok) {
      if (!ok) {
        // Nothing is cleared — everything they typed is still in the fields.
        statusS[1]('idle');
        formErrS[1](true);
        announce('Something went wrong and your offer was not sent. Please try again.');
        roTrack('roast_submit_failed', {});
        return;
      }
      lastSubmitRef.current = Date.now();
      safeSet('ro_last', String(lastSubmitRef.current));
      sentToS[1](em);
      statusS[1]('success');
      roTrack('roast_submit_succeeded', { struggle: struggle, newsletter: consent ? 'yes' : 'no' });
    });
  }

  var sending = status === 'sending';
  var liveRegion = e('div', {
    ref: liveRef, 'aria-live': 'assertive', role: 'status',
    style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' },
  });

  // ── Confirmation ──
  if (status === 'success') {
    return e('div', { className: 'ro-page' },
      e('div', { className: 'ro-success' },
        liveRegion,
        e('h2', { tabIndex: -1, ref: successRef }, "I'm roasting it."),
        e('p', null,
          "I've got your offer. I'll run it through my offer-analysis framework and send the teardown to ",
          e('strong', null, sentToS[0]),
          ' as soon as possible.'),
        e('div', { className: 'ro-success__row' },
          e('a', { className: 'ro-btn2 ro-btn2--green', href: '/free-tools/' }, 'Explore free tools →'),
          e('a', { className: 'ro-btn2 ro-btn2--outline', href: '/ask-me-anything/' }, 'Ask me something →')
        )
      )
    );
  }

  // `key` is the ref/error key, which is not always the input's own id.
  function wire(key, id, opts) {
    opts = opts || {};
    var er = errors[key];
    var describedBy = [];
    if (opts.helpId) describedBy.push(opts.helpId);
    if (er) describedBy.push(key + '-err');
    return {
      id: id, ref: opts.noRef ? undefined : (refs[key] || null),
      'aria-invalid': er ? 'true' : 'false',
      'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    };
  }

  var showCount = paste.length >= RO_MAXLEN - 600;

  return e('div', { className: 'ro-page' },
    e('p', { className: 'ro-eyebrow' }, 'Business · Roast'),
    e('h1', { className: 'ro-h1' }, 'Roast my offer'),
    e('p', { className: 'ro-lead' }, 'Get a proper teardown of your offer.'),
    e('p', { className: 'ro-lead' }, "Paste your offer or send me the page. Tell me who it's for and roughly what it costs. I'll run it through my offer-analysis framework and send you the teardown as soon as possible."),
    e('p', { className: 'ro-note' }, 'Free · No account needed · I read every one myself'),

    e('form', { className: 'ro-form', noValidate: true, onSubmit: onSubmit },
      liveRegion,

      formErr ? e('div', { className: 'ro-formerr', role: 'alert' },
        'Something went wrong and your offer was not sent. Nothing you typed has been lost — press ',
        e('strong', null, 'Roast my offer'),
        ' again in a moment.'
      ) : null,

      // Honeypot (off-screen; bots fill it, humans don't)
      e('div', { className: 'ro-hp', 'aria-hidden': 'true' },
        e('label', { htmlFor: 'ro-company' }, 'Company'),
        e('input', { id: 'ro-company', type: 'text', tabIndex: -1, autoComplete: 'off', value: hp, onChange: function (ev) { hpS[1](ev.target.value); } })
      ),

      // ── 1. The offer: either input satisfies the requirement ──
      e('fieldset', { className: 'ro-fieldset' },
        e('legend', { className: 'ro-legend' }, 'Your offer ', e('span', { className: 'ro-req' }, '*')),
        e('input', Object.assign(wire('offer', 'ro-url', { helpId: 'ro-offer-help' }), {
          className: 'ro-input', type: 'url', inputMode: 'url', placeholder: 'https://yourwebsite.com/offer',
          autoComplete: 'url', value: url,
          onChange: function (ev) { urlS[1](ev.target.value); clearErr('offer'); },
        })),
        e('div', { className: 'ro-or', 'aria-hidden': 'true' }, 'or'),
        e('textarea', Object.assign(wire('offer', 'ro-paste', { helpId: 'ro-offer-help', noRef: true }), {
          className: 'ro-textarea', placeholder: 'Paste the offer, landing-page copy or description here...',
          maxLength: RO_MAXLEN, value: paste,
          onChange: function (ev) { pasteS[1](ev.target.value); clearErr('offer'); },
        })),
        errors.offer ? e('p', { id: 'offer-err', className: 'ro-err' }, errors.offer) : null,
        e('p', { id: 'ro-offer-help', className: 'ro-help' }, 'One of the two is enough. Both is better.'),
        showCount ? e('p', { className: 'ro-count', 'aria-live': 'polite' }, paste.length + ' / ' + RO_MAXLEN) : null
      ),

      // ── 2. Audience ──
      e('div', { className: 'ro-field' },
        e('label', { className: 'ro-label', htmlFor: 'ro-audience' }, 'Who is it for? ', e('span', { className: 'ro-req' }, '*')),
        e('input', Object.assign(wire('audience', 'ro-audience'), {
          className: 'ro-input', type: 'text', maxLength: RO_MAXLEN_SHORT,
          placeholder: 'e.g. SaaS founders with 10–50 employees', value: audience,
          onChange: function (ev) { audienceS[1](ev.target.value); clearErr('audience'); },
        })),
        errors.audience ? e('p', { id: 'audience-err', className: 'ro-err' }, errors.audience) : null
      ),

      // ── 3. Price (optional) ──
      e('div', { className: 'ro-field' },
        e('label', { className: 'ro-label', htmlFor: 'ro-price' }, 'Rough price / pricing model'),
        e('input', {
          id: 'ro-price', className: 'ro-input', type: 'text', maxLength: RO_MAXLEN_SHORT,
          'aria-describedby': 'ro-price-help',
          placeholder: 'e.g. €2,000 project, €300/month, £150/session', value: price,
          onChange: function (ev) { priceS[1](ev.target.value); },
        }),
        e('p', { id: 'ro-price-help', className: 'ro-help' }, 'Optional, but the teardown is sharper with it.')
      ),

      // ── 4. Main struggle ──
      e('div', { className: 'ro-field' },
        e('label', { className: 'ro-label', htmlFor: 'ro-struggle' }, 'What are you struggling with most? ', e('span', { className: 'ro-req' }, '*')),
        e('select', Object.assign(wire('struggle', 'ro-struggle'), {
          className: 'ro-select', value: struggle,
          onChange: function (ev) { struggleS[1](ev.target.value); clearErr('struggle'); },
        }),
          e('option', { value: '' }, 'Choose the closest one'),
          STRUGGLES.map(function (o) { return e('option', { key: o.value, value: o.value }, o.label); })
        ),
        errors.struggle ? e('p', { id: 'struggle-err', className: 'ro-err' }, errors.struggle) : null
      ),

      // ── 5. Email ──
      e('div', { className: 'ro-field' },
        e('label', { className: 'ro-label', htmlFor: 'ro-email' }, 'Where should I send the teardown? ', e('span', { className: 'ro-req' }, '*')),
        e('input', Object.assign(wire('email', 'ro-email'), {
          className: 'ro-input', type: 'email', autoComplete: 'email',
          placeholder: 'you@example.com', value: email,
          onChange: function (ev) { emailS[1](ev.target.value); clearErr('email'); },
        })),
        errors.email ? e('p', { id: 'email-err', className: 'ro-err' }, errors.email) : null
      ),

      // ── 6. Newsletter consent — separate from receiving the teardown ──
      e('div', { className: 'ro-consent' },
        e('input', {
          id: 'ro-consent', type: 'checkbox', checked: consent,
          onChange: function (ev) { consentS[1](ev.target.checked); },
        }),
        e('label', { htmlFor: 'ro-consent' },
          'Also send me occasional emails about work, ambition and the psychology behind both.',
          e('span', { className: 'ro-consent__note' }, "Optional. You'll get your teardown either way, and you can unsubscribe at any time.")
        )
      ),

      e('button', { className: 'cta-btn ro-submit', type: 'submit', disabled: sending },
        sending ? 'Sending…' : 'ROAST MY OFFER →'),

      e('p', { className: 'ro-micro' }, 'I run every offer through the framework myself. No automated scoring.'),
      e('p', { className: 'ro-privacy' },
        'Your offer is used only to write your teardown. ',
        e('a', { href: PRIVACY_HREF }, 'Privacy policy'), '.')
    )
  );
}

function renderRoastMyOffer() {
  function App() {
    return e(React.Fragment, null,
      e(RoastStyles),
      e(window.LegacyShell, { page: 'roast-my-offer', lang: 'en', form: true, cta: false },
        e(RoastMyOfferForm, null))
    );
  }
  ReactDOM.createRoot(document.getElementById('root')).render(e(App, null));
}

Object.assign(window, {
  RoastMyOfferForm: RoastMyOfferForm,
  renderRoastMyOffer: renderRoastMyOffer,
});
