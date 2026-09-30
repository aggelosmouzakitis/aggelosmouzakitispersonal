# EmailJS: what the site sends, and the dashboard settings it needs

Service `service_i4xq7vg` · public key `bfBcHLXj2nKaev_lT` · SDK
`@emailjs/browser@4` from jsDelivr, loaded on `/contact/`,
`/free-tools/burned-out/`, `/free-tools/quit-your-job/` and `/work-life-check/`.

Every form submits through one function, `window.submitLead`
(`lead-capture.jsx`), which runs three independent operations per lead. One
failing never stops the others:

1. **sheet**: one row, POSTed to the Apps Script web app (the "Leads" tab)
2. **owner**: the owner notification, always through `template_6mv5hou`
3. **reply**: only when a form sends the person something. Today that is only
   the Work & Life Check result, through `template_gcj2lrd`

## The templates

The table was worked out from the code, the commit history and delivered mail.
Display names were not used, because two of them are misleading: `wdsrbdo`
is called "Auto-Reply" only because of the preset it was created from.

| Template | Role now | Sent by | To |
|---|---|---|---|
| `template_6mv5hou` | **Owner notification for every form**: contact, both clarity tools, Work & Life Check | `lead-capture.jsx` | the owner inbox, set in the dashboard |
| `template_gcj2lrd` | **The Work & Life Check result, to the person** | `work-life-check.jsx`, as the lead's `reply` | `{{user_email}}` |
| `template_wdsrbdo` | retired: the clarity tools' old notification (subject hardcoded to the old burnout diagnostic; body ignores `{{message}}`) | nothing | — |
| `template_fdba9kr` | retired: the Focus Area's copy of `wdsrbdo`, with `gcj2lrd` as its Auto-Reply | nothing | — |

`6mv5hou` is the owner template because it is the only one whose body prints
`{{message}}`. Every form's complete notification therefore reads correctly
without any dashboard change, and it never carried the old Focus Area
auto-reply.

The result email is a **direct send** of `gcj2lrd`, not an Auto-Reply linked to
another template. The person's email and the owner's are separate operations,
so either one can fail without taking the other with it.

## Dashboard settings, in order

### 1. `template_6mv5hou`: owner notification (every lead)

| Field | Set to | Why |
|---|---|---|
| To Email | `aggelos.mouzakitis@gmail.com` | the address the live contact form publishes (`CONTACT_EMAIL`, `site-pages.jsx`). Never `{{user_email}}`. |
| Reply To | `{{reply_to}}` | the person's address, so pressing Reply answers the lead |
| Subject | `{{{subject}}}` | three braces: two would turn an `&` or `'` into `&amp;` / `&#39;` |
| From Name | e.g. `Website leads` | optional |
| Content | optional: `<div style="white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;line-height:1.5">{{message}}</div>` | the stock content already prints `{{message}}`. This version keeps its line breaks and alignment. |
| **Auto-Reply tab** | **none** | every lead now goes through this template, so an auto-reply here would reach everyone who submits anything |

Until the Subject is changed, notifications arrive as `Contact Us: [Website
contact] …`, the stock subject around `{{title}}`, with everything else intact.

### 2. `template_gcj2lrd`: the Work & Life Check result

| Field | Set to |
|---|---|
| Subject | `{{{email_subject}}}` |
| To Email | `{{user_email}}` (unchanged) |
| From Name | `Aggelos Mouzakitis` |
| Reply To | `aggelos.mouzakitis@gmail.com` (replaces `aggelos@growthsandwich.com`) |
| Content | everything below the comment in `content/emails/work-life-check-result.html`, pasted in the editor's code view (the `<>` button) |
| Auto-Reply tab | none |

**Do this with the deploy.** Until the new content is pasted, the result email
arrives in the old Focus Area layout with its sections empty. The result on
screen and the owner notification are unaffected.

### 3. `template_wdsrbdo` and `template_fdba9kr`

Nothing sends to them any more. On each one, set the Auto-Reply tab to none, so
nothing can ever send the old Focus Area email again. Both can then be kept or
deleted.

### 4. Account and service

- **Email Services → `service_i4xq7vg`**: check which mailbox it sends from. If
  it is the legacy `aggelos@growthsandwich.com` and that mailbox is being
  closed, reconnect the service to the current address first. The service ID
  stays the same.
- **Every template field** (To, Reply To, From Email, CC, BCC) still holding
  `aggelos@growthsandwich.com` → `aggelos.mouzakitis@gmail.com`.
- **Account → Security**: if a domain allow-list is on, it must include
  `aggelosmouzakitis.com`.
- **Quota**: a lead sends one email (two for the Work & Life Check). When the
  monthly quota runs out, every send fails until it resets. Failures show up as
  `lead_capture_error` in GA4 and in EmailJS History.

## What the site sends

### To `template_6mv5hou` (every lead)

Always, when they have a value (an empty field is not sent at all):
- **The row:** `subject`, `title` (= subject), `time` (e.g. `2026-09-30 16:56
  UTC`), `message` (the full plain-text notification), `submitted_at`,
  `source`, `source_label`, `detail`, `detail_label`, `name`, `email`,
  `notes`, `page_url`, `newsletter`, `detail_extra`, `lead`.
- **The older names:** `from_name`, `from_email`, `reply_to`, `user_name`,
  `user_email`, `interest`, `source_page`.

Plus each form's own fields:

| Source | Subject | Extra fields |
|---|---|---|
| `contact` | `New website enquiry — <name>` | `location`, `service` (only when chosen) |
| `clarity-tool` (`burned-out`, `quit-your-job`) | `[TOOL] <tool title> — <name or email>` | `overall_grade`, `overall_score`, `section_breakdown`, `all_answers` |
| `work-life-check` | `[Work & Life Check] <primary result> — <email>` | `primary_result_title`, `secondary_result_title`, `switching_off_score`, `recovery_score`, `decision_score`, `relationship_score`, `performance_score`, `environment_change_answer` (Q16), `repeating_pattern_answer` (Q17), `context_type`, `timestamp` |

The contact notification (`message`) is exactly:

```
New enquiry from aggelosmouzakitis.com

Name:
<name>

Email:
<email>

Current location / country:
<location>

Interest / reason for contact:      (only when a service was chosen)
<service>

Message:
<full message>

Page:
<page URL>

Submitted:
<YYYY-MM-DD HH:MM UTC>

Reply-to:
<email>
```

The contact form shows "Thanks. Your message has been sent." only once EmailJS
has accepted this notification. If EmailJS refuses it or doesn't answer within
15 seconds, the form shows the failure message with the direct address and
keeps everything the person typed. The sheet row is written either way.

The Work & Life Check notification (`message`) opens with the following lines,
then the result exactly as emailed, then all 17 answers:
- Email, First name, Source, Result type
- Primary, Secondary
- the five scores
- Q16, Q17
- Context, Timestamp

For a tie, the primary reads `A + B`. For a low-signal result it reads
`Nothing clearly dominates`.

### To `template_gcj2lrd` (the Work & Life Check result)

The fields, and how a normal, tied and low-signal result fill them, are listed
at the top of `content/emails/work-life-check-result.html`.

Subjects:
- `Your Work & Life Check result: <title>`
- `Your Work & Life Check results` (tie)
- `Your Work & Life Check result` (low signal)

The email never subscribes anyone to anything. The address is used only for
this email and the owner notification.

## The sheet

Endpoint:
`https://script.google.com/macros/s/AKfycbyfbiW4nURPv6d2W9uErRFTt2vB27rs5kPyDW-C_Az5WiUMtWcxZMPjxt524ikuQN4m/exec`
(source: `scripts/leads-apps-script.gs`).

Every lead appends one row to the Leads tab: Timestamp, Source, Source detail,
Name, Email, Notes, Page, Subject, Newsletter, Detail extra. A GET on the
endpoint should answer `{"ok":true,"message":"Lead capture endpoint is live."}`.

## Checking production

- Add `?leaddebug=1` to any form page and submit. A panel at the bottom shows
  each operation's outcome and EmailJS's answer, e.g.
  `sheet ok · owner ok · reply ok`.
- The browser console logs one `[lead] …` line per submission.
- GA4 receives `lead_capture_error` (`source`, `stage`, `error_detail`)
  whenever an operation fails.
- EmailJS → History: one `template_6mv5hou` send per lead, plus one
  `template_gcj2lrd` per Work & Life Check.

### Answers that give each Work & Life Check result

- **Normal:** "Very true" for the three switching-off statements (1–3),
  "Mostly true" for the three recovery ones (4–6), "Not true" for the rest.
  Result: *Work is not switching off*, also showing up *Recovery is not
  restoring you*.
- **Tie:** "Somewhat true" for all 15 statements. Result: *Two areas stand
  out*, switching off and recovery.
- **Low signal:** "Not true" for all 15 statements. Result: *Nothing clearly
  dominates*, with no consultation block in the email.
- **Context:**
  - Q16 "Most" + Q17 "Never" → *The current environment may be carrying a lot
    of this*
  - Q16 "None" + Q17 "Often" → *The current job may not explain all of it*
  - Q16 "Most" + Q17 "Often" → *There may be two things happening at once*
  - anything else → *The context is mixed*
