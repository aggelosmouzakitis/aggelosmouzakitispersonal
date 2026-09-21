/**
 * leads-apps-script.gs — the "small database" behind every form on the site.
 *
 * WHAT THIS IS
 * Every submission (contact form, WTF Friday, the five clarity tools, the Free
 * Tools waitlist) is POSTed here by lead-capture.js and appended as one row.
 *
 * HOW TO INSTALL
 *  1. Open the existing Apps Script project — the one already deployed at
 *     .../macros/s/AKfycby-gv3oCFT2q5KXvVnqRzS4PAzcMjPB8Gls5qodZJ3v4_9HKGqJHMdBCw7YYbEzIE2d/exec
 *     (Google Drive → the sheet the diagnostics already write to → Extensions →
 *     Apps Script). Keeping the same project means the URL in lead-capture.js
 *     stays valid and nothing on the site needs redeploying.
 *  2. Paste this file over the existing Code.gs.
 *  3. Deploy → Manage deployments → edit the existing deployment → Version:
 *     "New version" → Deploy. Do NOT create a new deployment; that would change
 *     the /exec URL and the site would keep posting to the old one.
 *     Execute as: Me.  Who has access: Anyone.
 *  4. Submit one test form on the site and check the Leads tab.
 *
 * WHY IT'S SAFE TO SWAP IN
 * The site keeps sending every field it used to send, so if you ever revert to
 * the old script it will still find what it expects. This script writes to its
 * own "Leads" tab and does not touch whatever tab the old one used, so the old
 * rows stay exactly where they are.
 */

var SHEET_NAME = 'Leads';

var COLUMNS = [
  'Timestamp',      // when the submission arrived
  'Source',         // contact | wtf-friday | clarity-tool | tool-waitlist
  'Source detail',  // the specific thing: interest chosen, tool slug, waitlist id
  'Name',           // full name as given (one field, not split)
  'Email',
  'Notes',          // short human summary — message, question, or headline result
  'Page',           // the URL they submitted from
  'Subject'         // the exact subject line of the notification email
];

function doPost(e) {
  try {
    var data = parseBody_(e);
    var sheet = getSheet_();
    sheet.appendRow([
      data.submitted_at || new Date().toISOString(),
      data.source || legacySource_(data),
      data.detail_label || data.detail || data.interest || '',
      data.name || data.user_name || data.from_name || '',
      data.email || data.user_email || data.from_email || '',
      data.notes || data.overall_score || data.section_breakdown || '',
      data.page_url || data.source_page || '',
      data.subject || data.overall_grade || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    // Never throw: the site posts with mode:'no-cors' and cannot read the
    // response anyway, so a thrown error would just be an invisible failure.
    logFailure_(e, err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Lead capture endpoint is live.' });
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

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** A submission that could not be parsed is still worth keeping. */
function logFailure_(e, err) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
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
