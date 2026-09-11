// contact.jsx — Contact page (English).
// Reuses the production chrome (SiteHeader / SiteFooterX / ChromeStyles), the
// site's EmailJS delivery (same service/public key as Ask Me Anything), brand
// colours, icons and breakpoints. One white form card + one dark social card.
//
// Delivery note: the site's existing email infrastructure is EmailJS (client
// side). This form validates, sanitises, rate-limits and uses a honeypot in the
// browser, then sends via EmailJS. True server-side validation/rate-limiting
// would require a serverless function, which this static site does not have.

var e = React.createElement;

var EMAILJS_PUBLIC_KEY = 'bfBcHLXj2nKaev_lT';
var EMAILJS_SERVICE_ID = 'service_i4xq7vg';
var EMAILJS_TEMPLATE_ID = 'template_6mv5hou';
if (typeof window !== 'undefined' && window.emailjs) { try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (err) {} }

var CT_EXT = window.EXTERNAL || {};
var LINKEDIN = CT_EXT.linkedin || 'https://linkedin.com/in/growth-product-manager/';
var INSTAGRAM = CT_EXT.instagram || 'https://www.instagram.com/_aggelosmouzakitis_/';
var PRIVACY_HREF = (typeof window !== 'undefined' && window.cPath) ? window.cPath('confidentiality', 'en') + '#privacy' : '/confidentiality/#privacy';

var MAXLEN = 3000;
var COUNTER_FROM = 2600; // only show the character count as the limit approaches

// interest value → human label (also the dropdown option order)
var INTERESTS = [
  { value: 'orientation', label: 'Free 30-minute orientation chat' },
  { value: 'experience-to-offer', label: 'Experience-to-Offer Audit' },
  { value: 'solo-business-growth', label: 'Solo Business Growth Audit' },
  { value: 'private-sparring', label: 'Private Sparring' },
];
var VALID_INTEREST = INTERESTS.reduce(function (m, o) { m[o.value] = o.label; return m; }, {});

function track(name, params) {
  try { if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (err) {}
}
function sanitize(s) { return (s || '').replace(/[\u0000-\u001F\u007F]/g, '').trim(); }
function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

var CONTACT_CSS = `
html{overflow-x:clip}
.ct-main{background:#F4F1EA;color:#282726;font-family:var(--font-body)}
.ct-wrap{width:min(1120px,calc(100% - 2 * clamp(20px,4vw,48px)));margin-inline:auto;padding-block:clamp(40px,5vw,64px) clamp(56px,8vw,96px)}
.ct-head{max-width:720px;margin-bottom:clamp(28px,3.4vw,40px)}
.ct-eyebrow{font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:#047857}
.ct-h1{margin:14px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(34px,4.4vw,56px);font-weight:800;line-height:1.02;letter-spacing:-0.04em;color:#181A1C;text-wrap:balance}
.ct-intro{margin:16px 0 0;max-width:60ch;font-size:18px;line-height:1.6;color:#282726}
.ct-grid{display:grid;grid-template-columns:minmax(0,65fr) minmax(0,35fr);gap:32px;align-items:start}
.ct-card{background:#FFFFFF;border:1px solid rgba(24,26,28,0.12);border-radius:14px;padding:clamp(24px,3vw,40px)}
.ct-social{background:#181A1C;color:#FFFFFF;border-radius:14px;padding:clamp(24px,3vw,36px)}

.ct-field{margin-bottom:20px}
.ct-label{display:block;font-size:14px;font-weight:700;letter-spacing:0.02em;color:#181A1C;margin-bottom:8px}
.ct-req{color:#047857}
.ct-input,.ct-select,.ct-textarea{display:block;width:100%;min-height:52px;border:1px solid rgba(24,26,28,0.22);border-radius:10px;background:#FFFFFF;color:#282726;font-family:inherit;font-size:16px;line-height:1.5;padding:14px 15px;outline:none;transition:border-color .16s,box-shadow .16s}
.ct-textarea{min-height:160px;resize:vertical}
.ct-select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23282726' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;padding-right:40px}
.ct-input:focus,.ct-select:focus,.ct-textarea:focus{border-color:#047857;box-shadow:0 0 0 3px rgba(4, 120, 87,0.22)}
.ct-input[aria-invalid="true"],.ct-select[aria-invalid="true"],.ct-textarea[aria-invalid="true"]{border-color:#c0392b}
.ct-help{margin:7px 0 0;font-size:13px;line-height:1.5;color:#5E6264}
.ct-count{margin:7px 0 0;font-size:13px;color:#5E6264;text-align:right}
.ct-err{margin:7px 0 0;font-size:13px;line-height:1.5;color:#c0392b;font-weight:600}
.ct-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

.ct-submit{width:100%;min-height:56px;display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#047857;color:#FFFFFF;border:1.5px solid #047857;border-radius:2px;font-family:inherit;font-weight:700;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:filter .18s}
.ct-submit:hover{filter:brightness(0.92)}
.ct-submit:disabled{opacity:.55;cursor:not-allowed}
.ct-formerr{margin:0 0 16px;padding:14px 16px;border:1px solid rgba(192,57,43,.4);background:rgba(192,57,43,.06);border-radius:10px;font-size:15px;line-height:1.55;color:#c0392b}
.ct-formerr a{color:#c0392b;font-weight:700;text-decoration:underline;text-underline-offset:2px}
.ct-micro{margin:14px 0 0;font-size:14px;line-height:1.6;color:#5E6264}
.ct-privacy{margin:10px 0 0;font-size:13px;line-height:1.6;color:#8a8a8a}
.ct-privacy a{color:#047857;text-decoration:underline;text-underline-offset:2px}

.ct-success{display:flex;flex-direction:column;align-items:flex-start}
.ct-success h2{margin:0 0 12px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(26px,3vw,36px);font-weight:800;line-height:1.1;letter-spacing:-0.03em;color:#181A1C;outline:none}
.ct-success p{margin:0 0 24px;font-size:18px;line-height:1.6;color:#282726;max-width:52ch}
.ct-success__row{display:flex;flex-wrap:wrap;gap:12px}

.ct-social h2{margin:0 0 12px;font-family:var(--font-heading);font-size:clamp(22px,2.4vw,28px);font-weight:800;line-height:1.15;letter-spacing:-0.02em;color:#FFFFFF}
.ct-social p{margin:0 0 24px;font-size:16px;line-height:1.6;color:#C2C6CA}
.ct-social__btns{display:flex;flex-direction:column;gap:12px}
.ct-sbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;padding:0 12px;border:1.5px solid rgba(243,240,232,0.5);border-radius:2px;background:transparent;color:#FFFFFF;font-family:inherit;font-weight:700;font-size:12px;letter-spacing:0.02em;text-transform:uppercase;text-decoration:none;transition:background .18s,border-color .18s,color .18s}
.ct-sbtn:hover{background:#047857;border-color:#047857;color:#FFFFFF}
.ct-sbtn svg{flex-shrink:0}

.ct-btn2{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 22px;border-radius:2px;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;cursor:pointer}
.ct-btn2--green{background:#047857;color:#fff;border:1.5px solid #047857}
.ct-btn2--green:hover{filter:brightness(.92)}
.ct-btn2--outline{background:transparent;color:#282726;border:1.5px solid rgba(40,39,38,.35)}
.ct-btn2--outline:hover{border-color:#047857;color:#047857}

@media (max-width:860px){
  .ct-grid{grid-template-columns:1fr;gap:20px}
}
@media (max-width:480px){
  .ct-wrap{width:calc(100% - 40px)}
}
`;

function ContactStyles() { return e('style', { dangerouslySetInnerHTML: { __html: CONTACT_CSS } }); }

function SocialIcon(name) {
  return (window.BrandIcon) ? e(window.BrandIcon, { name: name, size: 18 }) : null;
}

function ContactForm() {
  var R = React;
  // initial interest from ?interest=
  var initialInterest = '';
  var preselected = false;
  try {
    var qp = new URLSearchParams(window.location.search).get('interest');
    if (qp && VALID_INTEREST[qp]) { initialInterest = qp; preselected = true; }
  } catch (err) {}

  var nameS = R.useState('');
  var emailS = R.useState('');
  var interestS = R.useState(initialInterest);
  var msgS = R.useState('');
  var hpS = R.useState(''); // honeypot
  var errorsS = R.useState({});        // field -> message
  var formErrS = R.useState(false);    // show the top-level submit error
  var statusS = R.useState('idle');    // idle | sending | success
  var name = nameS[0], email = emailS[0], interest = interestS[0], msg = msgS[0], hp = hpS[0];
  var errors = errorsS[0], formErr = formErrS[0], status = statusS[0];

  var refs = { name: R.useRef(null), email: R.useRef(null), interest: R.useRef(null), message: R.useRef(null) };
  var successRef = R.useRef(null);
  var liveRef = R.useRef(null);
  var lastSubmitRef = R.useRef(0);

  R.useEffect(function () {
    track('contact_page_viewed', { source_page: (typeof document !== 'undefined' && document.referrer) || 'direct' });
    if (preselected) track('interest_preselected', { interest: initialInterest });
  }, []);

  function announce(t) { if (liveRef.current) liveRef.current.textContent = t; }

  function validate() {
    var er = {};
    if (!sanitize(name)) er.name = 'Please add your name.';
    var em = sanitize(email);
    if (!em) er.email = 'Please add your email.';
    else if (!validEmail(em)) er.email = 'Please enter a valid email address.';
    if (!interest) er.interest = 'Please choose the closest option.';
    if (!sanitize(msg)) er.message = 'Please add a few lines.';
    return er;
  }

  function focusFirstInvalid(er) {
    var order = ['name', 'email', 'interest', 'message'];
    for (var i = 0; i < order.length; i++) { if (er[order[i]] && refs[order[i]].current) { refs[order[i]].current.focus(); return; } }
  }

  function onSubmit(ev) {
    ev.preventDefault();
    track('form_submission_attempted', { interest: interest || 'none', source_page: (typeof document !== 'undefined' && document.referrer) || 'direct' });
    // Honeypot: a filled hidden field means a bot — pretend success, send nothing.
    if (hp) { statusS[1]('success'); return; }
    var er = validate();
    errorsS[1](er);
    if (Object.keys(er).length) { setFormErr(false); focusFirstInvalid(er); announce('The form has errors. Please check the highlighted fields.'); return; }
    // Simple client-side rate limit (a soft guard; real rate limiting is server-side).
    var now = Date.now();
    var last = lastSubmitRef.current || Number(safeGet('ct_last') || 0);
    if (now - last < 15000) { setFormErr(true); announce('Please wait a few seconds before sending again.'); return; }

    setFormErr(false);
    statusS[1]('sending');
    announce('Sending your message.');

    var interestLabel = VALID_INTEREST[interest] || interest;
    var when = new Date();
    var source = (typeof document !== 'undefined' && document.referrer) || 'direct';
    var body = [
      'New website enquiry',
      '',
      'Full name: ' + sanitize(name),
      'Email: ' + sanitize(email),
      'Interested in: ' + interestLabel,
      '',
      'Message:',
      sanitize(msg).slice(0, MAXLEN),
      '',
      'Source page: ' + source,
      'Submitted: ' + when.toISOString() + ' (' + when.toString() + ')',
    ].join('\n');

    var payload = {
      from_name: sanitize(name),
      from_email: sanitize(email),
      reply_to: sanitize(email),
      subject: 'New website enquiry: ' + interestLabel + ' – ' + sanitize(name),
      interest: interestLabel,
      source_page: source,
      message: body,
    };

    function ok() {
      lastSubmitRef.current = Date.now(); safeSet('ct_last', String(lastSubmitRef.current));
      track('form_submission_succeeded', { interest: interest, source_page: source });
      statusS[1]('success');
    }
    function fail(e2) {
      try { console.error('Contact send error:', e2); } catch (e3) {}
      track('form_submission_failed', { interest: interest, source_page: source });
      statusS[1]('idle'); setFormErr(true); announce('Something went wrong and your message was not sent.');
    }

    if (typeof window !== 'undefined' && window.emailjs) {
      var settled = false;
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY)
        .then(function () { if (!settled) { settled = true; ok(); } })
        .catch(function (e2) { if (!settled) { settled = true; fail(e2); } });
    } else { fail(new Error('EmailJS unavailable')); }
  }

  function setFormErr(v) { formErrS[1](v); }
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  // Move focus to the success heading when we enter the success state.
  R.useEffect(function () {
    if (status === 'success' && successRef.current) { try { successRef.current.focus(); } catch (e) {} announce('Thank you. Your message has been sent.'); }
  }, [status]);

  var sending = status === 'sending';
  var liveRegion = e('div', { ref: liveRef, 'aria-live': 'assertive', role: 'status', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } });

  // ── SUCCESS STATE (replaces the form card contents) ──
  if (status === 'success') {
    return e('div', { className: 'ct-success' },
      liveRegion,
      e('h2', { tabIndex: -1, ref: successRef }, 'Thank you. I’ve got your message.'),
      e('p', null, 'I’ll read it myself and get back to you personally.'),
      e('div', { className: 'ct-success__row' },
        e('a', { className: 'ct-btn2 ct-btn2--green', href: '/' }, 'Back to the homepage →'),
        e('a', { className: 'ct-btn2 ct-btn2--outline', href: LINKEDIN, target: '_blank', rel: 'noopener noreferrer', onClick: function () { track('linkedin_cta_clicked', { context: 'contact-success' }); } }, 'Connect on LinkedIn →')
      )
    );
  }

  function field(key, label, opts) {
    opts = opts || {};
    var er = errors[key];
    var describedBy = [];
    if (opts.helpId) describedBy.push(opts.helpId);
    if (er) describedBy.push(key + '-err');
    var common = {
      id: key, ref: refs[key], 'aria-invalid': er ? 'true' : 'false',
      'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    };
    return common;
  }

  var showCount = msg.length >= COUNTER_FROM;

  return e('form', { className: 'ct-form', noValidate: true, onSubmit: onSubmit },
    liveRegion,
    formErr ? e('div', { className: 'ct-formerr', role: 'alert' },
      'Something went wrong and your message was not sent. Please try again, or send me a DM on ',
      e('a', { href: LINKEDIN, target: '_blank', rel: 'noopener noreferrer' }, 'LinkedIn'),
      ' or ',
      e('a', { href: INSTAGRAM, target: '_blank', rel: 'noopener noreferrer' }, 'Instagram'),
      '.'
    ) : null,

    // Honeypot (kept off-screen; bots fill it, humans don't)
    e('div', { className: 'ct-hp', 'aria-hidden': 'true' },
      e('label', { htmlFor: 'ct-company' }, 'Company'),
      e('input', { id: 'ct-company', type: 'text', tabIndex: -1, autoComplete: 'off', value: hp, onChange: function (ev) { hpS[1](ev.target.value); } })
    ),

    // Full name
    e('div', { className: 'ct-field' },
      e('label', { className: 'ct-label', htmlFor: 'name' }, 'Full name ', e('span', { className: 'ct-req' }, '*')),
      e('input', Object.assign(field('name'), { className: 'ct-input', type: 'text', placeholder: 'Your name', autoComplete: 'name', value: name, onChange: function (ev) { nameS[1](ev.target.value); } })),
      errors.name ? e('p', { id: 'name-err', className: 'ct-err' }, errors.name) : null
    ),
    // Email
    e('div', { className: 'ct-field' },
      e('label', { className: 'ct-label', htmlFor: 'email' }, 'Email ', e('span', { className: 'ct-req' }, '*')),
      e('input', Object.assign(field('email'), { className: 'ct-input', type: 'email', placeholder: 'you@email.com', autoComplete: 'email', value: email, onChange: function (ev) { emailS[1](ev.target.value); } })),
      errors.email ? e('p', { id: 'email-err', className: 'ct-err' }, errors.email) : null
    ),
    // Interest
    e('div', { className: 'ct-field' },
      e('label', { className: 'ct-label', htmlFor: 'interest' }, 'What are you interested in? ', e('span', { className: 'ct-req' }, '*')),
      e('select', Object.assign(field('interest', null, { helpId: 'interest-help' }), {
        className: 'ct-select', value: interest,
        onChange: function (ev) { interestS[1](ev.target.value); track('interest_selected_manually', { interest: ev.target.value }); },
      },),
        e('option', { value: '' }, 'Choose the closest option'),
        INTERESTS.map(function (o) { return e('option', { key: o.value, value: o.value }, o.label); })
      ),
      errors.interest ? e('p', { id: 'interest-err', className: 'ct-err' }, errors.interest) : null,
      e('p', { id: 'interest-help', className: 'ct-help' }, 'Choose the orientation chat if you are not sure where to begin.')
    ),
    // Message
    e('div', { className: 'ct-field' },
      e('label', { className: 'ct-label', htmlFor: 'message' }, 'What would you like me to know? ', e('span', { className: 'ct-req' }, '*')),
      e('textarea', Object.assign(field('message', null, { helpId: 'message-help' }), {
        className: 'ct-textarea', placeholder: 'What’s going on, and what would you like some help with?',
        maxLength: MAXLEN, value: msg, onChange: function (ev) { msgS[1](ev.target.value); },
      })),
      errors.message ? e('p', { id: 'message-err', className: 'ct-err' }, errors.message) : null,
      e('p', { id: 'message-help', className: 'ct-help' }, 'A few lines are enough.'),
      showCount ? e('p', { className: 'ct-count', 'aria-live': 'polite' }, msg.length + ' / ' + MAXLEN) : null
    ),

    e('button', { className: 'ct-submit', type: 'submit', disabled: sending }, sending ? 'Sending…' : 'Send my message →'),
    e('p', { className: 'ct-micro' }, 'I read every message myself. You’ll hear back from me personally.'),
    e('p', { className: 'ct-privacy' }, 'Your details will only be used to reply to this message. ',
      e('a', { href: PRIVACY_HREF }, 'Privacy policy'), '.')
  );
}

function SocialPanel() {
  return e('aside', { className: 'ct-social' },
    e('h2', null, 'Prefer a DM?'),
    e('p', null, 'You can also message me where you already spend time. Use whichever feels easier. I read those messages myself too.'),
    e('div', { className: 'ct-social__btns' },
      e('a', { className: 'ct-sbtn', href: LINKEDIN, target: '_blank', rel: 'noopener noreferrer', onClick: function () { track('linkedin_cta_clicked', { context: 'contact-panel' }); } },
        SocialIcon('LinkedIn'), e('span', null, 'Message me on LinkedIn →')),
      e('a', { className: 'ct-sbtn', href: INSTAGRAM, target: '_blank', rel: 'noopener noreferrer', onClick: function () { track('instagram_cta_clicked', { context: 'contact-panel' }); } },
        SocialIcon('Instagram'), e('span', null, 'Message me on Instagram →'))
    )
  );
}

function ContactPage() {
  return e(React.Fragment, null,
    e(window.ChromeStyles),
    e(ContactStyles),
    e(window.SiteHeader, { page: 'contact', lang: 'en' }),
    e('main', { className: 'ct-main' },
      e('div', { className: 'ct-wrap' },
        e('header', { className: 'ct-head' },
          e('div', { className: 'ct-eyebrow' }, 'CONTACT'),
          e('h1', { className: 'ct-h1' }, 'Tell me what’s going on.'),
          e('p', { className: 'ct-intro' }, 'You do not need to have it fully worked out or explain it perfectly. A few honest lines are enough for me to understand where to start.')
        ),
        e('div', { className: 'ct-grid' },
          e('div', { className: 'ct-card' }, e(ContactForm, null)),
          e(SocialPanel, null)
        )
      )
    ),
    e(window.SiteFooterX, { lang: 'en' })
  );
}

function renderContact() {
  ReactDOM.createRoot(document.getElementById('root')).render(e(ContactPage, null));
}

Object.assign(window, { ContactPage: ContactPage, renderContact: renderContact });
