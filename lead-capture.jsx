// lead-capture.jsx — one submission path for every form on the site.
//
// Before this existed, four forms each rolled their own EmailJS call with their
// own field names, and only two of them told the spreadsheet anything. The
// result was inconsistent subject lines and a database with holes in it.
//
// Every form now calls window.submitLead(record). It does exactly two things:
//   1. sends the EmailJS notification with a consistent, scannable subject and
//      an identical header block at the top of the body
//   2. posts the same record to the Google Apps Script sheet, so every
//      submission lands in one place
//
// ── Deliberately NOT breaking what already works ────────────────────────────
// Each form keeps sending to the EmailJS template it already used, and every
// field those templates already received is still sent, spelled the same way.
// This module only ADDS: `subject`, `message`, and a set of flat, self-
// describing keys for the sheet. So:
//   • template_6mv5hou (contact, WTF Friday) already renders {{subject}} and
//     {{message}}, so those two get clean subjects with no dashboard change.
//   • template_wdsrbdo (clarity tools, waitlist) keeps rendering exactly what
//     it renders today. Setting its Subject field to {{subject}} in the EmailJS
//     dashboard is all it takes to get clean subjects there too — and until
//     that happens, nothing changes.
// The same applies to the sheet: the legacy keys the current Apps Script reads
// are still in the payload, so it keeps writing rows as it does today. The new
// keys are additive, for the replacement script in scripts/leads-apps-script.gs.

var leadE = typeof React !== 'undefined' ? React.createElement : null;

var LEAD_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyfbiW4nURPv6d2W9uErRFTt2vB27rs5kPyDW-C_Az5WiUMtWcxZMPjxt524ikuQN4m/exec';
var LEAD_EMAILJS_SERVICE = 'service_i4xq7vg';
var LEAD_EMAILJS_PUBLIC_KEY = 'bfBcHLXj2nKaev_lT';

// The four things that can produce a lead. `tag` is the bracketed prefix that
// makes the inbox sortable; `template` is the EmailJS template that form has
// always used — unchanged on purpose.
var LEAD_SOURCES = {
  'contact':       { tag: 'CONTACT',  label: 'Contact form',       template: 'template_6mv5hou' },
  'wtf-friday':    { tag: 'WTF',      label: 'WTF Friday',         template: 'template_6mv5hou' },
  'clarity-tool':  { tag: 'TOOL',     label: 'Clarity tool',       template: 'template_wdsrbdo' },
  'tool-waitlist': { tag: 'WAITLIST', label: 'Free tool waitlist', template: 'template_wdsrbdo' },
};

function leadSource(id) {
  return LEAD_SOURCES[id] || { tag: 'SITE', label: id || 'Website', template: 'template_6mv5hou' };
}

function leadStr(v) { return v == null ? '' : String(v).trim(); }

// "[TOOL] Are you burned out? — Maria Papadopoulou"
// Falls back to the email address when a form does not ask for a name.
function leadSubject(rec) {
  var src = leadSource(rec.source);
  var who = leadStr(rec.name) || leadStr(rec.email) || 'no name given';
  var what = leadStr(rec.detailLabel) || leadStr(rec.detail) || src.label;
  return '[' + src.tag + '] ' + what + ' — ' + who;
}

// The identical six lines at the top of every notification, whichever form and
// whichever template produced it.
function leadHeader(rec, when) {
  var src = leadSource(rec.source);
  var pad = function (k) { return (k + ':').padEnd(12, ' '); };
  return [
    '── SUBMISSION ──',
    pad('Source') + src.label,
    pad('Detail') + (leadStr(rec.detailLabel) || leadStr(rec.detail) || '—'),
    pad('Name') + (leadStr(rec.name) || '—'),
    pad('Email') + (leadStr(rec.email) || '—'),
    pad('Page') + (rec.pageUrl || '—'),
    pad('Submitted') + when.toISOString(),
    '',
    '',
  ].join('\n');
}

// Fire-and-forget POST to the sheet. mode:'no-cors' means we never see the
// response, so this can only ever be best-effort — it must not gate the UI.
function leadPostToSheet(payload) {
  try {
    fetch(LEAD_SHEET_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) }).catch(function () {});
  } catch (err) { /* noop */ }
}

// ── The one entry point ──────────────────────────────────────────────────────
// rec: {
//   source       'contact' | 'wtf-friday' | 'clarity-tool' | 'tool-waitlist'
//   detail       machine identifier — interest value, tool slug, waitlist id
//   detailLabel  human version of the above, used in the subject
//   name, email  as captured (one full-name field; no splitting)
//   notes        short summary for the sheet's Notes column
//   body         the form's own detailed body; the header block is prepended
//   params       extra EmailJS params this form's template already expects
// }
// done(ok) always fires — on success, on failure, or after 6s, so a person is
// never left staring at a spinner because a third party is slow.
function submitLead(rec, done) {
  rec = rec || {};
  var src = leadSource(rec.source);
  var when = new Date();
  var pageUrl = rec.pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
  rec.pageUrl = pageUrl;

  var subject = leadSubject(rec);
  var message = leadHeader(rec, when) + (leadStr(rec.body) || leadStr(rec.notes) || '');

  // Flat, self-describing row for the sheet + the legacy keys the current Apps
  // Script already reads, so it keeps working untouched.
  var payload = {
    lead: '1',
    submitted_at: when.toISOString(),
    source: rec.source || '',
    source_label: src.label,
    detail: leadStr(rec.detail),
    detail_label: leadStr(rec.detailLabel) || leadStr(rec.detail),
    name: leadStr(rec.name),
    email: leadStr(rec.email),
    notes: leadStr(rec.notes),
    subject: subject,
    message: message,
    page_url: pageUrl,
  };
  // Legacy EmailJS/sheet field names — unchanged spellings, still populated.
  var legacy = {
    from_name: leadStr(rec.name), from_email: leadStr(rec.email), reply_to: leadStr(rec.email),
    user_name: leadStr(rec.name), user_email: leadStr(rec.email), user_website: '',
    interest: leadStr(rec.detailLabel) || leadStr(rec.detail) || src.label,
    source_page: rec.sourcePage || pageUrl,
  };
  var params = {};
  var k;
  for (k in legacy) if (Object.prototype.hasOwnProperty.call(legacy, k)) params[k] = legacy[k];
  for (k in payload) if (Object.prototype.hasOwnProperty.call(payload, k)) params[k] = payload[k];
  if (rec.params) for (k in rec.params) if (Object.prototype.hasOwnProperty.call(rec.params, k)) params[k] = rec.params[k];

  leadPostToSheet(params);

  var settled = false;
  var finish = function (ok) { if (!settled) { settled = true; if (typeof done === 'function') done(ok); } };

  if (typeof window !== 'undefined' && window.emailjs) {
    try {
      emailjs.send(LEAD_EMAILJS_SERVICE, rec.template || src.template, params, LEAD_EMAILJS_PUBLIC_KEY)
        .then(function () { finish(true); })
        .catch(function (err) { try { console.error('Lead send error:', err); } catch (e2) {} finish(false); });
      setTimeout(function () { finish(true); }, 6000);
    } catch (err) { finish(false); }
  } else {
    finish(false);
  }
}

if (typeof window !== 'undefined') {
  window.submitLead = submitLead;
  window.LEAD_SOURCES = LEAD_SOURCES;
  window.leadSubject = leadSubject;
}
