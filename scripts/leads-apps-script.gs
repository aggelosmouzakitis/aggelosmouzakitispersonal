/**
 * leads-apps-script.gs — the "small database" behind every form on the site.
 *
 * Every submission (contact form, WTF Friday, the five clarity tools, the Free
 * Tools waitlist) is POSTed here by lead-capture.js and appended as one row.
 *
 * ── INSTALL: three steps, in this order ─────────────────────────────────────
 *
 * STEP 1 — paste this over Code.gs, then Save.
 *
 * STEP 2 — point it at a spreadsheet.
 *   In the function dropdown at the top pick `setupLeadsSheet`, press Run, and
 *   approve the permissions prompt. It creates a spreadsheet called
 *   "Website leads", remembers its id, and prints the URL in the Execution log.
 *   Open that URL and keep it — that is your database.
 *   (Already have a sheet you want to use? Put its id in SPREADSHEET_ID below
 *   — the long string in its URL between /d/ and /edit — and skip the Run.)
 *
 *   Then pick `testSubmission` and press Run. A row should appear in the sheet
 *   within a second. If it does, the database half is finished and working,
 *   independently of the website.
 *
 *   Re-pasting a later version is safe: if columns were added since, the header
 *   row is topped up on the next write and existing rows stay where they are.
 *
 * STEP 3 — publish it as a Web app and send Claude the URL.
 *   Deploy → New deployment → gear icon → select type: **Web app**
 *   (NOT Library — a Library has no /exec address, so the site cannot post to it)
 *     Execute as:      Me
 *     Who has access:  Anyone
 *   Deploy, then copy the **Web app URL**. It ends in /exec.
 *   Send that URL over and the site gets pointed at it.
 *
 * Why a new deployment rather than editing an old one: the deployments in this
 * project are a mix of archived ones and a Library, and the active Web app is
 * pinned to an old version of the code. One clean Web app deployment made from
 * the current code is less work than untangling them.
 *
 * ── UPDATING an existing install (keeps the same /exec URL) ─────────────────
 *   1. Paste this over Code.gs, Save.
 *   2. Pick `authorizeMail` in the function dropdown, press Run, and approve
 *      the new "Send email as you" permission. It sends you one test email.
 *   3. Deploy → Manage deployments → the Web app → pencil (Edit) →
 *      Version: **New version** → Deploy. The URL stays the same, so the site
 *      needs no change.
 *
 * ── THE BACKUP NOTIFICATION ─────────────────────────────────────────────────
 * The owner notification normally goes through EmailJS. When EmailJS refuses
 * it (e.g. "Gmail_API: Invalid grant" — the Gmail connection behind the
 * EmailJS service was revoked), lead-capture.js posts the same notification
 * here with notify_fallback = '1', and this script emails it to OWNER_EMAIL
 * from the account the script runs as (MailApp). The site only does this when
 * a normal lead post answered { notify: true }, i.e. when this version is live,
 * so an older deployment never receives a fallback post it would store as a row.
 *
 * ── RESENDING notifications that never arrived ──────────────────────────────
 * Set RESEND_FROM below to the first missed submission's time, Save, then run
 * `resendMissedNotifications`. Every row from that moment on is emailed to
 * OWNER_EMAIL, once (identical resubmissions are sent once).
 */

// Where lead notifications go: the same inboxes as the EmailJS templates.
// Comma-separated; every address gets every backup and resent notification.
var OWNER_EMAIL = 'aggelos.mouzakitis@gmail.com, aggelos@growthsandwich.com';

// resendMissedNotifications(): rows at or after this moment (ISO, UTC) are
// re-sent. The EmailJS Gmail connection broke on 2026-11-11.
var RESEND_FROM = '2026-11-11T00:00:00Z';
var RESEND_TO = ''; // optional upper bound, same format; empty = up to now

// Optional: paste an existing spreadsheet id here to use that sheet instead of
// letting setupLeadsSheet() create one. Leave empty to use the remembered one.
var SPREADSHEET_ID = '';

var SHEET_NAME = 'Leads';
var PROP_KEY = 'LEADS_SHEET_ID';

var COLUMNS = [
  'Timestamp',      // when the submission arrived
  'Source',         // contact | clarity-tool (older rows: retired forms)
  'Source detail',  // the specific thing: interest chosen, tool name, waitlist tool
  'Name',           // full name as given (one field, not split)
  'Email',
  'Notes',          // short human summary — message, question, or headline result
  'Page',           // the URL they submitted from
  'Subject',        // the exact subject line of the notification email
  'Newsletter',     // yes / no, only on forms that actually ask; blank otherwise
  'Detail extra'    // tool-specific data, e.g. the offer and audience for a roast
];

// ── Run this once from the editor ────────────────────────────────────────────
function setupLeadsSheet() {
  var id = resolveSpreadsheetId_();
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
    Logger.log('Using the spreadsheet already linked to this script.');
  } else {
    ss = SpreadsheetApp.create('Website leads');
    PropertiesService.getScriptProperties().setProperty(PROP_KEY, ss.getId());
    Logger.log('Created a new spreadsheet and linked it to this script.');
  }
  getSheet_();
  Logger.log('Spreadsheet: ' + ss.getUrl());
  Logger.log('Sheet id:    ' + ss.getId());
  Logger.log('Next: run testSubmission, then deploy as a Web app.');
  return ss.getUrl();
}

// ── Run this to prove the sheet works, without involving the website ─────────
function testSubmission() {
  var fake = {
    submitted_at: new Date().toISOString(),
    source: 'test',
    source_label: 'Manual test',
    detail: 'test-row',
    detail_label: 'Test row from the Apps Script editor',
    name: 'Test Person',
    email: 'test@example.com',
    notes: 'If you can see this row, the database half is working.',
    page_url: 'https://aggelosmouzakitis.com/free-tools/',
    subject: '[TEST] Test row from the Apps Script editor — Test Person',
    newsletter: 'no',
    detail_extra: 'Any tool-specific fields land here.'
  };
  appendLead_(fake);
  Logger.log('Wrote a test row. Open the sheet and check the Leads tab.');
}

// ── What the website calls ───────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = parseBody_(e);
    if (String(data.notify_fallback || '') === '1') {
      // Not a lead: the notification EmailJS could not deliver. The lead's row
      // was already written by its own post. Never appended.
      sendFallbackNotification_(data);
      return json_({ ok: true, notified: true });
    }
    appendLead_(data);
    // notify: tells the site this deployment can send the backup notification.
    return json_({ ok: true, notify: true });
  } catch (err) {
    // Never throw: the site posts with mode:'no-cors' and cannot read the
    // response, so a thrown error would just be an invisible failure.
    logFailure_(e, err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Lead capture endpoint is live.' });
}

// ── Backup notifications (MailApp) ───────────────────────────────────────────

/** Run once from the editor after pasting: grants MailApp and sends a test. */
function authorizeMail() {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: '[Website leads] Backup notifications are on',
    body: 'This is the test from authorizeMail(). If EmailJS ever refuses a lead\'s ' +
      'notification, it will arrive from this account instead, its subject starting ' +
      'with "[backup]".\n\nMail quota left today: ' + MailApp.getRemainingDailyQuota(),
    name: 'Website leads'
  });
  Logger.log('Sent a test to ' + OWNER_EMAIL + '. Now deploy a new version (see the top of the file).');
}

var EMAIL_RE_ = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str_(v) { return v == null ? '' : String(v).trim(); }

function sendFallbackNotification_(data) {
  var subject = str_(data.subject) || ('Website lead — ' + (str_(data.name) || str_(data.email) || 'no name given'));
  var why = [];
  if (str_(data.owner_status) && str_(data.owner_status) !== 'ok') {
    why.push('EmailJS did not deliver this notification (' + str_(data.owner_detail).slice(0, 300) + '). This is the backup copy.');
  }
  if (str_(data.reply_status) === 'failed') {
    why.push('The email to the person (' + (str_(data.email) || 'their address') + ') did NOT send (' +
      str_(data.reply_detail).slice(0, 300) + '). They have not received it: follow up by hand.');
  }
  var body = (why.length ? why.join('\n') + '\n\n' : '') + (str_(data.message) || '(no message body)');
  var mail = {
    to: OWNER_EMAIL,
    subject: '[backup] ' + subject,
    body: body.slice(0, 20000),
    name: 'Website leads'
  };
  var replyTo = str_(data.reply_to) || str_(data.email);
  if (EMAIL_RE_.test(replyTo)) mail.replyTo = replyTo;
  MailApp.sendEmail(mail);
}

/** Re-sends the notification of every row from RESEND_FROM on. Run by hand. */
function resendMissedNotifications() {
  var from = new Date(RESEND_FROM);
  var to = RESEND_TO ? new Date(RESEND_TO) : new Date();
  if (isNaN(from.getTime())) throw new Error('RESEND_FROM is not a date: ' + RESEND_FROM);
  var values = getSheet_().getDataRange().getValues();
  var head = values[0];
  var col = function (name) { return head.indexOf(name); };
  var seen = {};
  var sent = 0, skipped = 0;
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    var get = function (name) { var c = col(name); return c === -1 ? '' : str_(r[c] instanceof Date ? r[c].toISOString() : r[c]); };
    var when = new Date(get('Timestamp'));
    if (isNaN(when.getTime()) || when < from || when > to) continue;
    // The same person sending the same thing twice (a retry) is one lead.
    var key = [get('Source'), get('Email').toLowerCase(), get('Notes')].join('\u0001');
    if (seen[key]) { skipped++; continue; }
    seen[key] = true;
    var message = [
      'Re-sent: this notification did not arrive when the form was submitted.',
      '',
      '── SUBMISSION ──',
      'Source:     ' + get('Source'),
      'Detail:     ' + (get('Source detail') || '—'),
      'Name:       ' + (get('Name') || '—'),
      'Email:      ' + (get('Email') || '—'),
      'Page:       ' + (get('Page') || '—'),
      'Submitted:  ' + when.toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
      get('Detail extra') ? 'Extra:      ' + get('Detail extra') : null,
      '',
      'Message / notes:',
      get('Notes') || '—'
    ].filter(function (l) { return l !== null; }).join('\n');
    var mail = {
      to: OWNER_EMAIL,
      subject: '[resent] ' + (get('Subject') || ('Website lead — ' + (get('Name') || get('Email')))),
      body: message,
      name: 'Website leads'
    };
    if (EMAIL_RE_.test(get('Email'))) mail.replyTo = get('Email');
    MailApp.sendEmail(mail);
    sent++;
    Logger.log('Sent: ' + mail.subject + ' (' + when.toISOString() + ')');
  }
  Logger.log('Done. Sent ' + sent + ', skipped ' + skipped + ' duplicate(s).');
}

// ── Internals ────────────────────────────────────────────────────────────────

function appendLead_(data) {
  getSheet_().appendRow([
    data.submitted_at || new Date().toISOString(),
    data.source || legacySource_(data),
    data.detail_label || data.detail || data.interest || '',
    data.name || data.user_name || data.from_name || '',
    data.email || data.user_email || data.from_email || '',
    data.notes || data.overall_score || data.section_breakdown || '',
    data.page_url || data.source_page || '',
    data.subject || data.overall_grade || '',
    data.newsletter || '',
    data.detail_extra || ''
  ]);
}

/** Accepts the JSON body the site sends, or a normal form post as a fallback. */
function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) { /* fall through */ }
  }
  return (e && e.parameter) ? e.parameter : {};
}

/** Older payloads had no `source`; infer one so nothing lands uncategorised. */
function legacySource_(data) {
  if (data.all_answers || data.overall_grade) return 'clarity-tool';
  if (data.interest) return 'contact';
  return 'unknown';
}

/**
 * The spreadsheet, in order of preference: the constant above, the id
 * remembered by setupLeadsSheet, or the container if this script happens to be
 * bound to a sheet. A standalone script has no "active" spreadsheet, which is
 * why relying on getActiveSpreadsheet() alone is not enough.
 */
function resolveSpreadsheetId_() {
  if (SPREADSHEET_ID) return SPREADSHEET_ID;
  var stored = PropertiesService.getScriptProperties().getProperty(PROP_KEY);
  if (stored) return stored;
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active.getId();
  } catch (err) { /* standalone script — expected */ }
  return '';
}

function getSpreadsheet_() {
  var id = resolveSpreadsheetId_();
  if (!id) {
    throw new Error('No spreadsheet linked yet. Run setupLeadsSheet() once from the editor.');
  }
  return SpreadsheetApp.openById(id);
}

function getSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(3, 240);
    sheet.setColumnWidth(6, 320);
  } else if (sheet.getLastColumn() < COLUMNS.length) {
    // A later version added columns. Fill in the new headings rather than
    // leaving data sitting under blank ones; existing rows are untouched.
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  return sheet;
}

/** A submission that could not be parsed is still worth keeping. */
function logFailure_(e, err) {
  try {
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName('Leads — errors') || ss.insertSheet('Leads — errors');
    sheet.appendRow([
      new Date().toISOString(),
      String(err),
      (e && e.postData && e.postData.contents) ? e.postData.contents.slice(0, 5000) : ''
    ]);
  } catch (ignored) { /* nothing else we can do */ }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
