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
 */

// Optional: paste an existing spreadsheet id here to use that sheet instead of
// letting setupLeadsSheet() create one. Leave empty to use the remembered one.
var SPREADSHEET_ID = '';

var SHEET_NAME = 'Leads';
var PROP_KEY = 'LEADS_SHEET_ID';

var COLUMNS = [
  'Timestamp',      // when the submission arrived
  'Source',         // contact | wtf-friday | clarity-tool | tool-waitlist
  'Source detail',  // the specific thing: interest chosen, tool name, waitlist tool
  'Name',           // full name as given (one field, not split)
  'Email',
  'Notes',          // short human summary — message, question, or headline result
  'Page',           // the URL they submitted from
  'Subject'         // the exact subject line of the notification email
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
    subject: '[TEST] Test row from the Apps Script editor — Test Person'
  };
  appendLead_(fake);
  Logger.log('Wrote a test row. Open the sheet and check the Leads tab.');
}

// ── What the website calls ───────────────────────────────────────────────────
function doPost(e) {
  try {
    appendLead_(parseBody_(e));
    return json_({ ok: true });
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
    data.subject || data.overall_grade || ''
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
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(3, 240);
    sheet.setColumnWidth(6, 320);
  }
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
