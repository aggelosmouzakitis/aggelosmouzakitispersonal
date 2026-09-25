// focus-area.jsx — the "Find Your Focus Area" assessment UI.
//
// Content comes from focus-area-data.js (window.FOCUS_AREA_DATA) and every
// scoring decision from focus-area-scoring.js (window.faScore). This file only
// decides what is on screen: the intro, one question per screen across three
// stages, and the result page.
//
// Borrowed from the existing tools rather than invented:
//   • the page frame is window.LegacyShell (form: true, cta: false), the shell
//     every free tool mounts into
//   • answer rows keep the clarity tools' look: hairline rows, a 2px green rule
//     on the selected answer, the same hover wash, and the same ← Back and
//     green Continue → pair on every question (nothing advances on its own)
//   • analytics go through gtag with the slug on every event and no answer text
//   • the result email goes through window.submitLead (lead-capture.js), the
//     one EmailJS + sheet path every form on the site uses, with its error
//     handling and 6s safety timeout
//
// Result page: six separate slots, in order, assembled from the stored result
// state and the copy in focus-area-content.js (window.FOCUS_AREA_CONTENT):
//   1 heading · 2 contextual interpretation · 3 core interpretation ·
//   4 secondary Focus Area · 5 score visualisation · 6 recommended resources
// then the orientation-call invitation. A close result names both areas in
// the heading and gives each its full core interpretation, the second
// visually subordinate.
//
// Email gate: the result is calculated and rendered as soon as the last
// answer is in, then shown blurred and inert behind an unlock panel. Entering
// an email makes the one EmailJS send; only a successful send unlocks it.

(function () {
  var e = React.createElement;
  var D = window.FOCUS_AREA_DATA;
  var COPY = window.FOCUS_AREA_CONTENT;
  var SLUG = D.slug;
  var STORE_KEY = 'focus-area:v1';
  var FREE_TOOLS_URL = window.FREE_TOOLS_URL || '/free-tools/';
  // The site's orientation-call booking link (work-with-me.jsx ORIENTATION_URL;
  // /book redirects here too). contact.jsx preselects the call from ?interest=.
  var FA_CALL_URL = '/contact/?interest=orientation';
  function faTrack(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({
        assessment: SLUG
      }, params || {}));
    } catch (err) {/* noop */}
  }
  function safeGet() {
    try {
      var raw = window.sessionStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }
  function safeSet(v) {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify(v));
    } catch (err) {/* noop */}
  }
  function safeClear() {
    try {
      window.sessionStorage.removeItem(STORE_KEY);
    } catch (err) {/* noop */}
  }

  // ── Result email ─────────────────────────────────────────────────────────
  // Sent once per unlocked result, from the email gate. ONE EmailJS send does
  // both jobs:
  //   • Aggelos gets the complete report through the admin template, as before
  //   • the same send carries user_email and the result copy as flat
  //     variables. The user-facing template (template_gcj2lrd, To: {{user_email}})
  //     is linked in EmailJS as that template's Auto-Reply, so EmailJS sends
  //     the person their result. The frontend never calls it directly.
  // FA_EMAILJS_TEMPLATE is this assessment's own admin template, a copy of the
  // tools' template_wdsrbdo, and the only one with template_gcj2lrd linked as
  // its Auto-Reply. No other form may send through it, or the result email
  // would go to people who never took the assessment. (Keep the
  // 'find-your-focus-area' entry in lead-capture.jsx's LEAD_SOURCES in step.)
  var FA_LEAD_SOURCE = 'find-your-focus-area';
  var FA_EMAILJS_TEMPLATE = 'template_fdba9kr';
  function faAreaLabel(id) {
    var a = D.focusArea(id);
    return a ? a.label : id;
  }
  function faOption(q, id) {
    for (var i = 0; i < q.options.length; i++) if (q.options[i].id === id) return q.options[i];
    return null;
  }

  // Plain-text report, laid out to scan: PERSON / RESULT / CONTEXTUAL ANSWERS /
  // UNIVERSAL ANSWERS. `meta` prepends the source and timestamp, for templates
  // that print this report without lead-capture's header block.
  function faBuildReport(r, meta, email) {
    var L = [];
    var persona = D.persona(r.persona),
      problem = D.problem(r.persona, r.primaryProblem);
    var others = (r.selectedProblems || []).filter(function (id) {
      return id !== r.primaryProblem;
    }).map(function (id) {
      var p = D.problem(r.persona, id);
      return p ? p.label : id;
    });
    if (meta) {
      L.push('Source: ' + D.title);
      L.push('Timestamp: ' + (r.completedAt || new Date().toISOString()));
      L.push('');
    }
    L.push('PERSON');
    if (email) L.push('Email: ' + email);
    L.push('Persona: ' + (persona ? persona.label : r.persona));
    L.push('Primary problem: ' + (problem ? problem.label : r.primaryProblem));
    L.push('Other selected problems: ' + (others.length ? others.join('; ') : 'None'));
    L.push('');
    L.push('RESULT');
    L.push('Primary Focus Area: ' + faAreaLabel(r.primaryFocusArea));
    L.push('Secondary Focus Area: ' + faAreaLabel(r.secondaryFocusArea));
    L.push('Close result: ' + (r.isCloseResult ? 'Yes' : 'No'));
    D.FOCUS_AREAS.forEach(function (a) {
      L.push(a.label + ': ' + r.focusAreaScores[a.id] + '/100');
    });
    L.push('');
    L.push('CONTEXTUAL ANSWERS');
    D.contextualQuestions(r.persona, r.primaryProblem).forEach(function (q) {
      var o = faOption(q, (r.contextualAnswers || {})[q.id]);
      L.push(q.text + ' \u2192 ' + (o ? o.label : '(no answer)'));
    });
    L.push('');
    L.push('UNIVERSAL ANSWERS');
    D.UNIVERSAL.forEach(function (u) {
      var v = (r.universalAnswers || {})[u.id];
      L.push(u.text + ' \u2192 ' + (v != null ? v + ' - ' + D.scaleLabel(v) : '(no answer)'));
    });
    L.push('');
    L.push('Completed: ' + (r.completedAt || '(unknown)') + ' \u00b7 scoring version ' + r.version);
    return L.join('\n');
  }

  // Short, stable fingerprint of a completed answer set. An unlock is recorded
  // against it, so a refresh keeps the same result unlocked without another
  // send, while changed answers produce a new result that has to be unlocked.
  function faAnswerKey(r) {
    var str = JSON.stringify([r.persona, r.selectedProblems, r.primaryProblem, r.contextualAnswers, r.universalAnswers]);
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = (h << 5) + h + str.charCodeAt(i) | 0;
    return (h >>> 0).toString(36);
  }

  // One plain address, nothing else: no spaces, commas, semicolons or angle
  // brackets, so the value can only ever name a single recipient. (The HTML
  // spec's email pattern, with a dot required in the domain.)
  var FA_EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
  function faValidEmail(v) {
    return typeof v === 'string' && v.length <= 254 && FA_EMAIL_RE.test(v);
  }
  function faEsc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // The person's result as flat, email-safe variables for the Auto-Reply,
  // read from the same content config the page renders. Plain values use
  // line breaks only: paragraphs are separated by a blank line and each list
  // item carries its own bullet, so the text still reads cleanly if a mail
  // client runs the lines together. The *_html twins carry the same copy as
  // escaped markup, for a template that prefers {{{triple braces}}}.
  function faResultVars(r, email) {
    var c = COPY.resultContent[r.primaryFocusArea] || {};
    var sc = COPY.resultContent[r.secondaryFocusArea] || {};
    var persona = D.persona(r.persona),
      problem = D.problem(r.persona, r.primaryProblem);
    var score = function (id) {
      return String(r.focusAreaScores[id]);
    };
    var paras = function (list) {
      return (list || []).join('\n\n');
    };
    var parasHtml = function (list) {
      return (list || []).map(function (t) {
        return '<p>' + faEsc(t) + '</p>';
      }).join('');
    };
    var shows = c.howThisMayShowUp || [];
    return {
      user_email: email,
      primary_focus: areaLabel(r.primaryFocusArea),
      secondary_focus: areaLabel(r.secondaryFocusArea),
      persona_context: (c.personaContext || {})[r.persona] || '',
      what_this_means: paras(c.whatThisMeans),
      showing_up_items: shows.map(function (t) {
        return '\u2022 ' + t;
      }).join('\n'),
      what_deserves_attention: paras(c.whatDeservesAttentionFirst),
      what_to_keep_in_mind: paras(c.whatToKeepInMind),
      secondary_copy: sc.secondaryCopy || '',
      direction_score: score('direction'),
      strategy_score: score('strategy'),
      action_score: score('action'),
      self_trust_score: score('self_trust'),
      capacity_score: score('capacity'),
      relationships_score: score('relationships_boundaries'),
      environment_score: score('environment'),
      // Context the template can use.
      persona: persona ? persona.label : r.persona,
      primary_problem: problem ? problem.label : r.primaryProblem,
      is_close_result: r.isCloseResult ? 'Yes' : 'No',
      what_this_means_html: parasHtml(c.whatThisMeans),
      showing_up_items_html: '<ul>' + shows.map(function (t) {
        return '<li>' + faEsc(t) + '</li>';
      }).join('') + '</ul>',
      what_deserves_attention_html: parasHtml(c.whatDeservesAttentionFirst),
      what_to_keep_in_mind_html: parasHtml(c.whatToKeepInMind)
    };
  }

  // The single send behind an unlock. done(ok) always fires (lead-capture's
  // guarantee); only ok === true may unlock the result.
  function faNotify(r, email, done) {
    var finish = function (ok) {
      if (typeof done === 'function') done(ok === true);
    };
    if (!faValidEmail(email) || typeof window.submitLead !== 'function') {
      finish(false);
      return;
    }
    var p = faAreaLabel(r.primaryFocusArea),
      sec = faAreaLabel(r.secondaryFocusArea);
    var persona = D.persona(r.persona),
      problem = D.problem(r.persona, r.primaryProblem);
    var headline = r.isCloseResult ? p + ' + ' + sec + ' (close result)' : p;
    var resultBlock = ['Primary Focus Area: ' + p, 'Secondary Focus Area: ' + sec, 'Close result: ' + (r.isCloseResult ? 'Yes' : 'No')].concat(D.FOCUS_AREAS.map(function (a) {
      return a.label + ': ' + r.focusAreaScores[a.id] + '/100';
    })).join('\n');
    // The admin report exactly as before (the admin template renders these),
    // with the person's result variables alongside for the Auto-Reply.
    var params = faResultVars(r, email);
    params.overall_grade = D.title + ' \u2014 ' + headline;
    params.overall_score = p;
    params.section_breakdown = resultBlock;
    params.all_answers = faBuildReport(r, true, email);
    try {
      window.submitLead({
        source: FA_LEAD_SOURCE,
        detail: r.primaryFocusArea,
        detailLabel: D.title + ' \u00b7 ' + headline,
        name: '',
        email: email,
        notes: 'Primary: ' + p + ' \u00b7 Secondary: ' + sec + (r.isCloseResult ? ' (close)' : '') + ' \u00b7 ' + (persona ? persona.label : r.persona) + ' \u00b7 ' + (problem ? problem.label : r.primaryProblem),
        body: faBuildReport(r, false, email),
        // One cell for the sheet's last column.
        detailExtra: D.FOCUS_AREAS.map(function (a) {
          return a.label + ' ' + r.focusAreaScores[a.id];
        }).join(' \u00b7 ') + ' \u00b7 Problems: ' + (r.selectedProblems || []).join(', '),
        template: FA_EMAILJS_TEMPLATE,
        params: params
      }, function (ok) {
        faTrack('assessment_notification', {
          status: ok ? 'sent' : 'failed'
        });
        finish(ok);
      });
    } catch (err) {
      try {
        console.error('Focus Area notification error:', err);
      } catch (e2) {/* noop */}
      finish(false);
    }
  }

  // ── Flow ─────────────────────────────────────────────────────────────────
  // The step list is derived from the answers, so it is always accurate: the
  // "which one matters most" screen exists only when two or more problems are
  // selected, and the question count updates the moment that changes.
  function buildSteps(s) {
    var steps = [{
      key: 'persona',
      kind: 'persona',
      stage: 0
    }, {
      key: 'problems',
      kind: 'problems',
      stage: 0
    }];
    if ((s.selectedProblems || []).length > 1) steps.push({
      key: 'primary',
      kind: 'primary',
      stage: 0
    });
    for (var i = 0; i < 4; i++) steps.push({
      key: 'ctx-' + (s.primaryProblem || 'pending') + '-' + i,
      kind: 'contextual',
      stage: 1,
      index: i
    });
    D.UNIVERSAL.forEach(function (item, i) {
      steps.push({
        key: item.id,
        kind: 'universal',
        stage: 2,
        index: i,
        item: item
      });
    });
    return steps;
  }

  // Has this screen been answered? Continue stays disabled until it has.
  function stepAnswered(s, step) {
    if (!step) return false;
    switch (step.kind) {
      case 'persona':
        return !!s.persona;
      case 'problems':
        return s.selectedProblems.length > 0;
      case 'primary':
        return s.selectedProblems.indexOf(s.primaryProblem) >= 0;
      case 'contextual':
        {
          var q = D.contextualQuestions(s.persona, s.primaryProblem)[step.index];
          return !!(q && s.contextualAnswers[q.id]);
        }
      case 'universal':
        return s.universalAnswers[step.item.id] != null;
      default:
        return false;
    }
  }
  function freshState() {
    return {
      screen: 'intro',
      step: 0,
      dir: 1,
      persona: null,
      selectedProblems: [],
      primaryProblem: null,
      contextualAnswers: {},
      universalAnswers: {},
      result: null,
      completedAt: null,
      unlockedKey: null,
      // faAnswerKey of the result this person unlocked
      userEmail: '' // the address that unlocked it
    };
  }
  function answersOf(s) {
    return {
      persona: s.persona,
      selectedProblems: s.selectedProblems,
      primaryProblem: s.primaryProblem,
      contextualAnswers: s.contextualAnswers,
      universalAnswers: s.universalAnswers
    };
  }
  function reducer(s, a) {
    var steps, n;
    switch (a.type) {
      case 'START':
        // A retake is a new result, so it is locked again; the address stays
        // to prefill the gate.
        return Object.assign(freshState(), {
          screen: 'flow',
          step: 0,
          dir: 1,
          userEmail: s.userEmail
        });
      case 'RESUME':
        steps = buildSteps(s);
        return Object.assign({}, s, {
          screen: 'flow',
          step: Math.min(s.step || 0, steps.length - 1),
          dir: 1
        });
      case 'SHOW_RESULT':
        return s.result ? Object.assign({}, s, {
          screen: 'result',
          dir: 1
        }) : s;
      case 'INTRO':
        return Object.assign({}, s, {
          screen: 'intro'
        });
      case 'UNLOCK':
        // Records the unlock only. The result object is left exactly as it
        // was calculated: nothing is rescored.
        return Object.assign({}, s, {
          unlockedKey: a.key,
          userEmail: a.email
        });
      case 'SET_PERSONA':
        if (a.value === s.persona) return s;
        // Problems are persona-specific, so a different persona starts that
        // screen afresh. Contextual answers are keyed by question id and stay.
        return Object.assign({}, s, {
          persona: a.value,
          selectedProblems: [],
          primaryProblem: null
        });
      case 'TOGGLE_PROBLEM':
        {
          var sel = s.selectedProblems.slice();
          var at = sel.indexOf(a.value);
          if (at >= 0) sel.splice(at, 1);else if (sel.length < D.PROBLEMS_QUESTION.max) sel.push(a.value);else return s;
          var primary = s.primaryProblem;
          if (sel.length === 1) primary = sel[0];
          // Going from one problem to several: the lone problem was the primary
          // by default, not by choice, so "which matters most" starts unanswered
          // and its Continue waits for a real answer.
          else if (s.selectedProblems.length <= 1 || sel.indexOf(primary) < 0) primary = null;
          return Object.assign({}, s, {
            selectedProblems: sel,
            primaryProblem: primary
          });
        }
      case 'SET_PRIMARY':
        return Object.assign({}, s, {
          primaryProblem: a.value
        });
      case 'SET_CONTEXTUAL':
        {
          var ca = Object.assign({}, s.contextualAnswers);
          ca[a.id] = a.value;
          return Object.assign({}, s, {
            contextualAnswers: ca
          });
        }
      case 'SET_UNIVERSAL':
        {
          var ua = Object.assign({}, s.universalAnswers);
          ua[a.id] = a.value;
          return Object.assign({}, s, {
            universalAnswers: ua
          });
        }
      case 'NEXT':
        steps = buildSteps(s);
        if (!stepAnswered(s, steps[Math.min(s.step, steps.length - 1)])) return s;
        n = s.step + 1;
        if (n < steps.length) return Object.assign({}, s, {
          step: n,
          dir: 1
        });
        if (!window.faIsComplete(answersOf(s))) return s;
        // Instant, client-side, deterministic.
        var result = window.faScore(Object.assign(answersOf(s), {
          completedAt: a.now
        }));
        return Object.assign({}, s, {
          screen: 'result',
          dir: 1,
          result: result,
          completedAt: a.now
        });
      case 'BACK':
        if (s.screen === 'result') {
          steps = buildSteps(s);
          return Object.assign({}, s, {
            screen: 'flow',
            step: steps.length - 1,
            dir: -1
          });
        }
        if (s.step === 0) return Object.assign({}, s, {
          screen: 'intro',
          dir: -1
        });
        return Object.assign({}, s, {
          step: s.step - 1,
          dir: -1
        });
      default:
        return s;
    }
  }

  // Restore a saved session (an accidental refresh should not lose answers).
  function initialState() {
    var saved = safeGet();
    var s = freshState();
    if (!saved || saved.v !== 1) return s;
    s.persona = D.persona(saved.persona) ? saved.persona : null;
    s.selectedProblems = (saved.selectedProblems || []).filter(function (id) {
      return s.persona && D.problem(s.persona, id);
    }).slice(0, D.PROBLEMS_QUESTION.max);
    s.primaryProblem = s.selectedProblems.indexOf(saved.primaryProblem) >= 0 ? saved.primaryProblem : s.selectedProblems.length === 1 ? s.selectedProblems[0] : null;
    s.contextualAnswers = saved.contextualAnswers || {};
    s.universalAnswers = saved.universalAnswers || {};
    s.step = saved.step || 0;
    s.unlockedKey = typeof saved.unlockedKey === 'string' ? saved.unlockedKey : null;
    s.userEmail = faValidEmail(saved.userEmail) ? saved.userEmail : '';
    if (saved.completedAt && window.faIsComplete(answersOf(s))) {
      s.completedAt = saved.completedAt;
      s.result = window.faScore(Object.assign(answersOf(s), {
        completedAt: saved.completedAt
      }));
    }
    return s;
  }
  function hasProgress(s) {
    return !!s.persona;
  }

  // ── Styles ───────────────────────────────────────────────────────────────
  var FA_CSS = ['.fa-page{max-width:720px;margin:0 auto;padding:40px 0 24px;color:var(--ink-2,#3A403A)}', '.fa-eyebrow{margin:0 0 16px;font-size:12px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--green,#047857)}',
  // intro
  '.fa-h1{margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(38px,5.4vw,60px);font-weight:800;line-height:.98;letter-spacing:-.045em;color:var(--heading-ink,#14201C);text-wrap:balance}', '.fa-standfirst{margin:0 0 18px;max-width:34ch;font-size:clamp(20px,2.2vw,23px);font-weight:600;line-height:1.4;letter-spacing:-.01em;color:var(--ink,#171919);text-wrap:pretty}', '.fa-lead{margin:0 0 30px;max-width:60ch;font-size:18px;line-height:1.65;color:var(--ink-2,#3A403A);text-wrap:pretty}', '.fa-stages{list-style:none;margin:0 0 34px;padding:0;border-top:1px solid var(--rule,rgba(23,25,25,.18))}', '.fa-stages li{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:4px 12px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--rule,rgba(23,25,25,.18))}', '.fa-stages__n{font-family:var(--font-display);font-size:14px;line-height:1;color:var(--green-pressed,#03654A);font-variant-numeric:tabular-nums}', '.fa-stages__t{font-size:16.5px;font-weight:650;line-height:1.35;color:var(--ink,#171919)}', '.fa-stages__m{font-size:13.5px;line-height:1.35;color:var(--meta,#6A6F67);white-space:nowrap}', '.fa-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px}', '.fa-note{margin:16px 0 0;font-size:14px;line-height:1.6;color:var(--meta,#6A6F67)}', '.fa-note--privacy{margin-top:6px;max-width:62ch;font-size:13px}',
  // buttons (the clarity tools\' green, radius, padding and type)
  '.fa-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 26px;background:var(--green,#047857);color:#F3F0E8;border:1.5px solid var(--green,#047857);border-radius:2px;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;line-height:1;cursor:pointer;text-decoration:none;transition:background var(--dur-hover,180ms),border-color var(--dur-hover,180ms),box-shadow var(--dur-hover,180ms),gap var(--dur-hover,180ms)}', '.fa-btn:hover{background:var(--green-pressed,#03654A);border-color:var(--green-pressed,#03654A);color:#F3F0E8;box-shadow:0 6px 18px rgba(4,120,87,.28);gap:12px}', '.fa-btn[disabled]{opacity:.45;cursor:default;box-shadow:none;gap:9px}', '.fa-btn[disabled]:hover{background:var(--green,#047857);border-color:var(--green,#047857)}', '.fa-btn--ghost{background:transparent;color:var(--ink-2,#3A403A);border-color:rgba(23,25,25,.35)}', '.fa-btn--ghost:hover{background:transparent;color:var(--green-pressed,#03654A);border-color:var(--green,#047857);box-shadow:none}', '.fa-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0;background:none;border:0;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--green-pressed,#03654A);cursor:pointer;text-decoration:none;transition:gap var(--dur-hover,180ms),color var(--dur-hover,180ms)}', '.fa-link:hover{gap:12px;color:var(--green,#047857)}',
  // progress
  '.fa-progress{margin:0 0 34px}', '.fa-progress__top{display:flex;justify-content:space-between;align-items:baseline;gap:6px 16px;margin-bottom:12px}', '.fa-progress__stage{min-width:0;margin:0;font-size:12px;font-weight:700;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--green-pressed,#03654A)}', '.fa-progress__stage span{color:var(--meta,#6A6F67)}', '.fa-progress__count{flex:none;margin:0;font-size:12px;font-weight:700;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}', '.fa-progress__bar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}', '.fa-progress__seg{position:relative;height:3px;background:rgba(23,25,25,.13);overflow:hidden}', '.fa-progress__fill{position:absolute;inset:0;background:var(--green,#047857);transform-origin:left center;transition:transform var(--dur-state,520ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',
  // question
  '.fa-step{animation-duration:340ms;animation-timing-function:var(--ease-settle,cubic-bezier(.22,1,.36,1));animation-fill-mode:both}', '.fa-step--fwd{animation-name:fa-in-fwd}', '.fa-step--back{animation-name:fa-in-back}', '@keyframes fa-in-fwd{from{opacity:0;transform:translate3d(16px,0,0)}to{opacity:1;transform:none}}', '@keyframes fa-in-back{from{opacity:0;transform:translate3d(-16px,0,0)}to{opacity:1;transform:none}}', '.fa-q__kicker{margin:0 0 12px;font-size:14.5px;font-weight:600;line-height:1.5;color:var(--meta,#6A6F67)}', '.fa-q__text{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,3.1vw,31px);font-weight:750;line-height:1.2;letter-spacing:-.02em;color:var(--heading-ink,#14201C);text-wrap:balance;outline:none}', '.fa-q__helper{margin:12px 0 0;max-width:56ch;font-size:16px;line-height:1.55;color:var(--ink-2,#3A403A)}', '.fa-q__limit{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:18px 0 0;font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}', '.fa-q__limit-rule{color:var(--green-pressed,#03654A)}', '.fa-q__limit-count{color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}', '.fa-q__limit-count.is-full{color:var(--green-pressed,#03654A)}', '.fa-options{margin:22px 0 0;border-top:1px solid rgba(23,25,25,.14)}', '.fa-opt{display:flex;align-items:flex-start;gap:14px;width:100%;margin:0;padding:15px 12px 15px 14px;text-align:left;background:transparent;border:0;border-bottom:1px solid rgba(23,25,25,.14);border-left:2px solid transparent;border-radius:0;font-family:inherit;font-size:17px;font-weight:400;line-height:1.45;color:var(--ink-2,#3A403A);cursor:pointer;transition:background-color var(--dur-hover,180ms),border-color var(--dur-hover,180ms),color var(--dur-hover,180ms)}', '.fa-opt:hover{background:rgba(4,120,87,.05)}', '.fa-opt[aria-pressed="true"]{border-left-color:var(--green,#047857);background:rgba(4,120,87,.07);color:var(--green-pressed,#03654A);font-weight:650}', '.fa-opt[aria-disabled="true"]{color:rgba(58,64,58,.5);cursor:not-allowed}', '.fa-opt[aria-disabled="true"]:hover{background:transparent}', '.fa-opt__mark{flex:none;position:relative;width:20px;height:20px;margin-top:2px;border:1.5px solid rgba(23,25,25,.42);border-radius:50%;background:transparent;transition:background-color var(--dur-hover,180ms),border-color var(--dur-hover,180ms)}', '.fa-opt__mark--check{border-radius:3px}', '.fa-opt[aria-pressed="true"] .fa-opt__mark{border-color:var(--green,#047857);background:var(--green,#047857)}', '.fa-opt[aria-pressed="true"] .fa-opt__mark::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#F3F0E8}', '.fa-opt[aria-pressed="true"] .fa-opt__mark--check::after{width:5px;height:10px;margin:-6.5px 0 0 -2.5px;border-radius:0;background:none;border:solid #F3F0E8;border-width:0 2px 2px 0;transform:rotate(45deg)}', '.fa-opt[aria-disabled="true"] .fa-opt__mark{border-color:rgba(23,25,25,.2)}', '.fa-opt__num{flex:none;min-width:14px;font-weight:700;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}', '.fa-opt[aria-pressed="true"] .fa-opt__num{color:inherit}', '.fa-opt__label{min-width:0}', '.fa-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:28px}', '.fa-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
  // result
  '.fa-result{animation:fa-in-fwd 420ms var(--ease-settle,cubic-bezier(.22,1,.36,1)) both;transition:filter 520ms var(--ease-settle,cubic-bezier(.22,1,.36,1))}', '.fa-slot + .fa-slot{margin-top:40px}', '.fa-slot[hidden]{display:none}', '.fa-result__area{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(46px,8vw,88px);font-weight:800;line-height:.95;letter-spacing:-.05em;color:var(--green,#047857);text-wrap:balance;outline:none}', '.fa-result__area--pair{font-size:clamp(38px,6vw,68px);line-height:1}', '.fa-result__plus{color:var(--meta,#6A6F67);font-weight:700}', '.fa-result__lead{margin:0 0 12px;font-size:clamp(18px,1.9vw,21px);font-weight:600;line-height:1.4;color:var(--ink,#171919)}', '.fa-result__rule{width:96px;height:2px;margin:26px 0 0;background:var(--green,#047857)}', '.fa-result__situation{margin:22px 0 0}', '.fa-label{display:block;margin:0 0 6px;font-size:12px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--meta,#6A6F67)}', '.fa-result__situation p{margin:0;font-size:18px;font-weight:600;line-height:1.5;color:var(--ink,#171919)}',
  // 2 · contextual paragraph: the lead, read straight after the situation
  '.fa-context{margin:0;max-width:62ch;font-size:clamp(19px,1.9vw,21px);line-height:1.6;color:var(--ink,#171919);text-wrap:pretty}',
  // 3 · core interpretation: section labels in the tools\' small green caps
  '.fa-core{max-width:64ch}', '.fa-core__area{margin:0 0 6px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,3.6vw,40px);font-weight:800;line-height:1.05;letter-spacing:-.035em;color:var(--green,#047857)}', '.fa-sec{margin-top:34px}', '.fa-core__area + .fa-sec{margin-top:22px}', '.fa-sec__h{margin:0 0 12px;font-family:var(--font-body);font-size:13px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--green-pressed,#03654A)}', '.fa-sec p{margin:0;font-size:18px;line-height:1.7;color:var(--ink-2,#3A403A);text-wrap:pretty}', '.fa-sec p + p{margin-top:14px}', '.fa-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(23,25,25,.12)}', '.fa-list li{position:relative;padding:12px 0 12px 26px;border-bottom:1px solid rgba(23,25,25,.12);font-size:17px;line-height:1.55;color:var(--ink-2,#3A403A)}', '.fa-list li::before{content:"";position:absolute;left:2px;top:23px;width:12px;height:2px;background:var(--green,#047857)}',
  // the second interpretation of a close result: same structure, quieter
  '.fa-core--sub{padding-top:32px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}', '.fa-core--sub .fa-core__area{font-size:clamp(26px,3vw,32px);color:var(--green-pressed,#03654A)}', '.fa-core--sub .fa-sec{margin-top:28px}', '.fa-core--sub .fa-sec p{font-size:17px;line-height:1.68}', '.fa-core--sub .fa-list li{font-size:16px}',
  // 4 · also showing up
  '.fa-also{padding-top:26px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}', '.fa-also__area{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(26px,3vw,32px);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--green-pressed,#03654A)}', '.fa-also__copy{margin:12px 0 0;max-width:62ch;font-size:18px;line-height:1.7;color:var(--ink-2,#3A403A);text-wrap:pretty}',
  // score visualisation — deliberately quieter than the result above it
  '.fa-scores{padding-top:22px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}', '.fa-scores__h{margin:0;font-size:13px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--green-pressed,#03654A)}', '.fa-scores__note{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--meta,#6A6F67)}', '.fa-scores__list{list-style:none;margin:20px 0 0;padding:0}', '.fa-bar{padding:10px 0}', '.fa-bar__top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:7px}', '.fa-bar__name{min-width:0;font-size:15px;font-weight:600;line-height:1.35;color:var(--ink-2,#3A403A)}', '.fa-bar__tag{margin-left:8px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--green-pressed,#03654A);white-space:nowrap}', '.fa-bar__val{flex:none;font-size:14px;font-weight:700;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}', '.fa-bar__track{height:6px;background:rgba(23,25,25,.08)}', '.fa-bar__fill{height:100%;background:rgba(23,25,25,.3);transform-origin:left center;animation:fa-grow 640ms var(--ease-settle,cubic-bezier(.22,1,.36,1)) both}', '.fa-bar--primary .fa-bar__fill{background:var(--green,#047857)}', '.fa-bar--secondary .fa-bar__fill{background:#6FAE8F}', '.fa-bar--primary .fa-bar__name,.fa-bar--secondary .fa-bar__name{color:var(--ink,#171919)}', '@keyframes fa-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}', '.fa-scores__foot{margin:16px 0 0;font-size:13.5px;line-height:1.55;color:var(--meta,#6A6F67)}', '.fa-result__actions{margin-top:44px;padding-top:26px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}',
  // orientation-call invitation: after the result, a quieter band than it
  '.fa-call{padding:30px 30px 28px;background:var(--bone-deep,#EDE8DB)}', '.fa-call__h{margin:0 0 12px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,2.6vw,28px);font-weight:800;line-height:1.15;letter-spacing:-.025em;color:var(--heading-ink,#14201C);text-wrap:balance}', '.fa-call p{margin:0;max-width:60ch;font-size:17px;line-height:1.65;color:var(--ink-2,#3A403A);text-wrap:pretty}', '.fa-call p + p{margin-top:12px}', '.fa-call__btn{margin-top:22px}', '.fa-btn--outline{background:transparent;color:var(--green-pressed,#03654A);border-color:var(--green,#047857)}', '.fa-btn--outline:hover{background:var(--green,#047857);color:#F3F0E8;border-color:var(--green,#047857)}',
  // email gate: the finished result sits blurred and inert behind the panel
  '.fa-gatewrap{position:relative}', '.fa-gatewrap.is-locked .fa-result{filter:blur(9px);pointer-events:none;-webkit-user-select:none;user-select:none}',
  // the large area names get extra blur on top, or they stay legible
  '.fa-gatewrap.is-locked .fa-result__area{filter:blur(14px)}', '.fa-gatewrap.is-locked .fa-core__area,.fa-gatewrap.is-locked .fa-also__area{filter:blur(9px)}', '.fa-gate{position:absolute;top:0;right:0;bottom:0;left:0;z-index:5;background:linear-gradient(180deg,rgba(243,240,232,.1) 0,rgba(243,240,232,.45) 360px,rgba(243,240,232,.62) 100%)}',
  // viewport-tall and sticky, so the panel stays on screen while the blurred
  // result scrolls past underneath. It sits a little above centre (as if it
  // were 480px tall), which also keeps it whole at the very top of the page,
  // where the header pushes the result down.
  '.fa-gate__stick{position:sticky;top:0;display:flex;align-items:flex-start;justify-content:center;box-sizing:border-box;height:100vh;height:100dvh;padding:max(16px,calc(50vh - 240px)) 0 16px;padding-top:max(16px,calc(50dvh - 240px))}', '.fa-gate__panel{box-sizing:border-box;width:100%;max-width:440px;max-height:100%;overflow-y:auto;padding:30px 30px 26px;background:var(--bone,#F3F0E8);border:1px solid rgba(23,25,25,.14);border-top:3px solid var(--green,#047857);border-radius:2px;box-shadow:0 28px 64px -24px rgba(22,35,30,.42),0 2px 10px rgba(22,35,30,.08)}', '.fa-gate__title{margin:0 0 10px;font-family:var(--font-heading);font-synthesis:none;font-size:22px;font-weight:800;line-height:1.15;letter-spacing:.02em;color:var(--heading-ink,#14201C);outline:none}', '.fa-gate__text{margin:0 0 20px;font-size:16.5px;line-height:1.55;color:var(--ink-2,#3A403A);text-wrap:pretty}', '.fa-gate__input{display:block;box-sizing:border-box;width:100%;min-height:52px;margin:0;padding:14px 15px;border:1px solid rgba(23,25,25,.22);border-radius:10px;background:var(--bone,#F3F0E8);color:var(--ink-2,#3A403A);font-family:inherit;font-size:16px;line-height:1.5;outline:none;transition:border-color .16s,box-shadow .16s}', '.fa-gate__input::placeholder{color:var(--meta,#6A6F67);opacity:1}', '.fa-gate__input:focus{border-color:var(--green,#047857);box-shadow:0 0 0 3px rgba(4,120,87,.22)}', '.fa-gate__input[aria-invalid="true"]{border-color:#c0392b}', '.fa-gate__input[readonly]{color:var(--meta,#6A6F67)}', '.fa-gate__err{margin:8px 0 0;font-size:13.5px;font-weight:600;line-height:1.5;color:#c0392b}', '.fa-gate__btn{width:100%;margin-top:12px}', '.fa-gate__btn[disabled]{opacity:.72;cursor:progress}', '.fa-gate__help{margin:14px 0 0;font-size:13px;line-height:1.55;color:var(--meta,#6A6F67);text-wrap:pretty}', '@media (max-width:767px){', '.fa-page{padding:8px 0 8px}', '.fa-sec p,.fa-also__copy{font-size:17px}', '.fa-list li{font-size:16px}', '.fa-lead{font-size:17px}', '.fa-opt{font-size:16px;padding:14px 10px 14px 12px}', '.fa-stages li{grid-template-columns:34px minmax(0,1fr)}', '.fa-stages__m{grid-column:2;white-space:normal}', '.fa-row .fa-btn{width:100%}', '.fa-nav__next{flex:1 1 auto}', '.fa-result__actions .fa-row{flex-direction:column;align-items:stretch}', '.fa-result__actions .fa-link{justify-content:center}', '.fa-call{padding:24px 20px 22px}', '.fa-call p{font-size:16.5px}', '.fa-call__btn{width:100%;padding:12px 16px;line-height:1.3;text-align:center}', '.fa-gate__panel{padding:24px 20px 20px}', '.fa-gate__title{font-size:20px}', '.fa-gate__text{margin-bottom:16px;font-size:16px}', '}', '@media (prefers-reduced-motion:reduce){.fa-step,.fa-result,.fa-bar__fill{animation:none}.fa-progress__fill,.fa-result{transition:none}}'].join('');
  function FocusAreaStyles() {
    return e('style', {
      dangerouslySetInnerHTML: {
        __html: FA_CSS
      }
    });
  }

  // ── Pieces ───────────────────────────────────────────────────────────────
  function Progress(props) {
    var steps = props.steps,
      i = props.index;
    var step = steps[i];
    var stageTotals = [0, 0, 0],
      stageDone = [0, 0, 0];
    steps.forEach(function (s, k) {
      stageTotals[s.stage]++;
      if (k < i) stageDone[s.stage]++;
    });
    var stage = D.STAGES[step.stage];
    return e('div', {
      className: 'fa-progress'
    }, e('div', {
      className: 'fa-progress__top'
    }, e('p', {
      className: 'fa-progress__stage'
    }, e('span', null, 'Stage ' + (step.stage + 1) + ' of 3 · '), stage.label), e('p', {
      className: 'fa-progress__count'
    }, 'Question ' + (i + 1) + ' of ' + steps.length)), e('div', {
      className: 'fa-progress__bar',
      role: 'progressbar',
      'aria-label': 'Assessment progress',
      'aria-valuemin': 0,
      'aria-valuemax': steps.length,
      'aria-valuenow': i,
      'aria-valuetext': 'Question ' + (i + 1) + ' of ' + steps.length + ', stage ' + (step.stage + 1) + ' of 3: ' + stage.label
    }, [0, 1, 2].map(function (k) {
      var frac = stageTotals[k] ? stageDone[k] / stageTotals[k] : 0;
      return e('span', {
        key: k,
        className: 'fa-progress__seg'
      }, e('span', {
        className: 'fa-progress__fill',
        style: {
          transform: 'scaleX(' + frac + ')'
        }
      }));
    })));
  }
  function Option(props) {
    var cls = 'fa-opt__mark' + (props.multi ? ' fa-opt__mark--check' : '');
    return e('button', {
      type: 'button',
      className: 'fa-opt',
      'aria-pressed': props.selected ? 'true' : 'false',
      'aria-disabled': props.disabled ? 'true' : undefined,
      onClick: props.onClick
    }, e('span', {
      className: cls,
      'aria-hidden': 'true'
    }), props.num != null ? e('span', {
      className: 'fa-opt__num',
      'aria-hidden': 'true'
    }, props.num) : null, e('span', {
      className: 'fa-opt__label'
    }, props.label));
  }
  function QuestionHead(props) {
    return e(React.Fragment, null, props.kicker ? e('p', {
      className: 'fa-q__kicker'
    }, props.kicker) : null, e('h1', {
      className: 'fa-q__text',
      id: props.id,
      tabIndex: -1,
      ref: props.headRef
    }, props.text), props.helper ? e('p', {
      className: 'fa-q__helper'
    }, props.helper) : null);
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  function Intro(props) {
    var s = props.state;
    var resumable = hasProgress(s) && !s.result;
    var primaryBtn;
    if (s.result) primaryBtn = e('button', {
      type: 'button',
      className: 'fa-btn',
      onClick: props.onShowResult
    }, 'See your result ', e('span', {
      'aria-hidden': 'true'
    }, '→'));else if (resumable) primaryBtn = e('button', {
      type: 'button',
      className: 'fa-btn',
      onClick: props.onResume
    }, 'Continue where you left off ', e('span', {
      'aria-hidden': 'true'
    }, '→'));else primaryBtn = e('button', {
      type: 'button',
      className: 'fa-btn',
      onClick: props.onStart
    }, 'START THE ASSESSMENT ', e('span', {
      'aria-hidden': 'true'
    }, '→'));
    return e('div', {
      className: 'fa-page'
    }, e('p', {
      className: 'fa-eyebrow'
    }, 'Free assessment'), e('h1', {
      className: 'fa-h1'
    }, D.title), e('p', {
      className: 'fa-standfirst'
    }, 'A 4-minute assessment to find what deserves your attention first.'), e('p', {
      className: 'fa-lead'
    }, "Most problems have more than one layer. This assessment looks at what you're dealing with, how the problem is working, and how you tend to respond to it. The goal is to identify where your attention is most useful right now."), e('ol', {
      className: 'fa-stages',
      'aria-label': 'Three stages'
    }, [['01', D.STAGES[0].label, '2 or 3 questions'], ['02', D.STAGES[1].label, '4 questions'], ['03', D.STAGES[2].label, '14 statements']].map(function (r) {
      return e('li', {
        key: r[0]
      }, e('span', {
        className: 'fa-stages__n',
        'aria-hidden': 'true'
      }, r[0]), e('span', {
        className: 'fa-stages__t'
      }, r[1]), e('span', {
        className: 'fa-stages__m'
      }, r[2]));
    })), e('div', {
      className: 'fa-row'
    }, primaryBtn, resumable || s.result ? e('button', {
      type: 'button',
      className: 'fa-link',
      onClick: props.onStart
    }, 'Start again') : null), e('p', {
      className: 'fa-note'
    }, 'Free · About 4 minutes · Enter your email at the end to unlock your result'), e('p', {
      className: 'fa-note fa-note--privacy'
    }, 'Your individual answers are not sent to analytics. They go only to your result, the copy emailed to you and the private notification Aggelos receives.'));
  }

  // ── Question screens ─────────────────────────────────────────────────────
  function StepView(props) {
    var s = props.state,
      step = props.step,
      act = props.act;
    var qid = 'fa-q-' + step.key;
    if (step.kind === 'persona') {
      return e('div', null, e(QuestionHead, {
        id: qid,
        text: D.PERSONA_QUESTION.text,
        helper: D.PERSONA_QUESTION.helper,
        headRef: props.headRef
      }), e('div', {
        className: 'fa-options',
        role: 'group',
        'aria-labelledby': qid
      }, D.PERSONAS.map(function (p) {
        return e(Option, {
          key: p.id,
          label: p.label,
          selected: s.persona === p.id,
          onClick: function () {
            act.choose({
              type: 'SET_PERSONA',
              value: p.id
            });
          }
        });
      })));
    }
    if (step.kind === 'problems') {
      var sel = s.selectedProblems,
        max = D.PROBLEMS_QUESTION.max,
        full = sel.length >= max;
      return e('div', null, e(QuestionHead, {
        id: qid,
        text: D.PROBLEMS_QUESTION.text,
        headRef: props.headRef
      }), e('p', {
        className: 'fa-q__limit',
        id: qid + '-limit'
      }, e('span', {
        className: 'fa-q__limit-rule'
      }, D.PROBLEMS_QUESTION.helper), e('span', {
        className: 'fa-q__limit-count' + (full ? ' is-full' : ''),
        'aria-hidden': 'true'
      }, sel.length + ' of ' + max + ' chosen')), e('div', {
        className: 'fa-options',
        role: 'group',
        'aria-labelledby': qid,
        'aria-describedby': qid + '-limit'
      }, D.problems(s.persona).map(function (p) {
        var on = sel.indexOf(p.id) >= 0;
        var blocked = !on && full;
        return e(Option, {
          key: p.id,
          multi: true,
          label: p.label,
          selected: on,
          disabled: blocked,
          onClick: function () {
            if (blocked) {
              act.announce('You can choose up to ' + max + '. Deselect one to choose a different problem.');
              return;
            }
            act.choose({
              type: 'TOGGLE_PROBLEM',
              value: p.id
            });
            var count = on ? sel.length - 1 : sel.length + 1;
            act.announce(count + ' of ' + max + ' chosen.');
          }
        });
      })));
    }
    if (step.kind === 'primary') {
      return e('div', null, e(QuestionHead, {
        id: qid,
        text: D.PRIMARY_QUESTION.text,
        headRef: props.headRef
      }), e('div', {
        className: 'fa-options',
        role: 'group',
        'aria-labelledby': qid
      }, s.selectedProblems.map(function (id) {
        var p = D.problem(s.persona, id);
        return e(Option, {
          key: id,
          label: p ? p.label : id,
          selected: s.primaryProblem === id,
          onClick: function () {
            act.choose({
              type: 'SET_PRIMARY',
              value: id
            });
          }
        });
      })));
    }
    if (step.kind === 'contextual') {
      var q = D.contextualQuestions(s.persona, s.primaryProblem)[step.index];
      if (!q) return null;
      return e('div', null, e(QuestionHead, {
        id: qid,
        text: q.text,
        headRef: props.headRef,
        kicker: step.index === 0 ? 'Next, four short questions about how this is working in practice.' : null
      }), e('div', {
        className: 'fa-options',
        role: 'group',
        'aria-labelledby': qid
      }, q.options.map(function (o) {
        return e(Option, {
          key: o.id,
          label: o.label,
          selected: s.contextualAnswers[q.id] === o.id,
          onClick: function () {
            act.choose({
              type: 'SET_CONTEXTUAL',
              id: q.id,
              value: o.id
            });
          }
        });
      })));
    }
    if (step.kind === 'universal') {
      var item = step.item;
      return e('div', null, e(QuestionHead, {
        id: qid,
        text: item.text,
        headRef: props.headRef,
        kicker: step.index === 0 ? 'Finally, 14 short statements. Answer based on how things are now. ' + D.UNIVERSAL_PROMPT : D.UNIVERSAL_PROMPT
      }), e('div', {
        className: 'fa-options',
        role: 'group',
        'aria-labelledby': qid
      }, D.SCALE.map(function (pt) {
        return e(Option, {
          key: pt.value,
          num: pt.value,
          label: pt.label,
          selected: s.universalAnswers[item.id] === pt.value,
          onClick: function () {
            act.choose({
              type: 'SET_UNIVERSAL',
              id: item.id,
              value: pt.value
            });
          }
        });
      })));
    }
    return null;
  }

  // Back on the left, Continue on the right, on every question. Nothing moves
  // on by itself: Continue stays disabled until the screen is answered.
  function Nav(props) {
    return e('div', {
      className: 'fa-nav'
    }, e('button', {
      type: 'button',
      className: 'fa-btn fa-btn--ghost',
      onClick: props.onBack
    }, e('span', {
      'aria-hidden': 'true'
    }, '←'), ' Back'), e('button', {
      type: 'button',
      className: 'fa-btn fa-nav__next',
      disabled: !props.canNext,
      onClick: props.onNext
    }, 'Continue ', e('span', {
      'aria-hidden': 'true'
    }, '→')));
  }

  // ── Result page ──────────────────────────────────────────────────────────
  // Each slot is its own section so later stages can fill one without touching
  // the others. Empty slots stay in the DOM, hidden, marking their place.
  function Slot(props) {
    return e('section', {
      className: 'fa-slot fa-slot--' + props.name,
      'data-slot': props.name,
      hidden: props.empty ? true : undefined,
      'aria-label': props.label || undefined
    }, props.children || null);
  }
  function areaLabel(id) {
    return COPY.resultContent[id] && COPY.resultContent[id].title || D.focusArea(id).label;
  }
  function paras(list) {
    return list.map(function (t, i) {
      return e('p', {
        key: i
      }, t);
    });
  }

  // 1. Focus Area heading. A close result names both areas with equal weight.
  function HeadingSlot(props) {
    var r = props.result,
      L = COPY.labels;
    var persona = D.persona(r.persona),
      problem = D.problem(r.persona, r.primaryProblem);
    var title = r.isCloseResult ? e('h1', {
      className: 'fa-result__area fa-result__area--pair',
      tabIndex: -1,
      ref: props.headRef
    }, areaLabel(r.primaryFocusArea), e('span', {
      className: 'fa-result__plus'
    }, ' + '), areaLabel(r.secondaryFocusArea)) : e('h1', {
      className: 'fa-result__area',
      tabIndex: -1,
      ref: props.headRef
    }, areaLabel(r.primaryFocusArea));
    return e(Slot, {
      name: 'heading'
    }, e('p', {
      className: 'fa-eyebrow'
    }, r.isCloseResult ? L.focusAreas : L.focusArea), r.isCloseResult ? e('p', {
      className: 'fa-result__lead'
    }, L.closeLead) : null, title, e('div', {
      className: 'fa-result__rule',
      'aria-hidden': 'true'
    }), e('div', {
      className: 'fa-result__situation'
    }, e('span', {
      className: 'fa-label'
    }, L.situation), e('p', null, (persona ? persona.label : r.persona) + ' · ' + (problem ? problem.label : r.primaryProblem))));
  }

  // 2. Contextual interpretation: persona + primary Focus Area. In a close
  // result this is the highest-scoring area's paragraph.
  function ContextSlot(props) {
    var r = props.result;
    var c = COPY.resultContent[r.primaryFocusArea];
    var text = c && c.personaContext[r.persona];
    if (!text) return e(Slot, {
      name: 'context',
      empty: true
    });
    return e(Slot, {
      name: 'context',
      label: 'Your situation, interpreted'
    }, e('p', {
      className: 'fa-context'
    }, text));
  }

  // The four core sections for one Focus Area. `titled` adds the area name
  // above them, which a close result needs because it shows two.
  function CoreInterpretation(props) {
    var c = COPY.resultContent[props.area],
      L = COPY.labels;
    if (!c) return null;
    var H = props.titled ? 'h3' : 'h2';
    var sec = function (key, label, body) {
      return e('section', {
        className: 'fa-sec',
        key: key
      }, e(H, {
        className: 'fa-sec__h'
      }, label), body);
    };
    return e('div', {
      className: 'fa-core' + (props.subordinate ? ' fa-core--sub' : '')
    }, props.titled ? e('h2', {
      className: 'fa-core__area'
    }, c.title) : null, sec('means', L.whatThisMeans, paras(c.whatThisMeans)), sec('shows', L.howThisMayShowUp, e('ul', {
      className: 'fa-list'
    }, c.howThisMayShowUp.map(function (t, i) {
      return e('li', {
        key: i
      }, t);
    }))), sec('first', L.whatDeservesAttentionFirst, paras(c.whatDeservesAttentionFirst)), sec('mind', L.whatToKeepInMind, paras(c.whatToKeepInMind)));
  }

  // 3. Core Focus Area interpretation.
  function CoreSlot(props) {
    var r = props.result;
    return e(Slot, {
      name: 'core'
    }, e(CoreInterpretation, {
      area: r.primaryFocusArea,
      titled: r.isCloseResult
    }));
  }

  // 4. Secondary Focus Area: a short "also showing up" block, or, in a close
  // result, the second full interpretation, visually subordinate.
  function SecondarySlot(props) {
    var r = props.result,
      L = COPY.labels;
    var c = COPY.resultContent[r.secondaryFocusArea];
    if (r.isCloseResult) {
      return e(Slot, {
        name: 'secondary'
      }, e(CoreInterpretation, {
        area: r.secondaryFocusArea,
        titled: true,
        subordinate: true
      }));
    }
    return e(Slot, {
      name: 'secondary'
    }, e('div', {
      className: 'fa-also'
    }, e('p', {
      className: 'fa-eyebrow'
    }, L.alsoShowingUp), e('h2', {
      className: 'fa-also__area'
    }, c ? c.title : D.focusArea(r.secondaryFocusArea).label), c ? e('p', {
      className: 'fa-also__copy'
    }, c.secondaryCopy) : null));
  }

  // 5. All seven scores, highest first. Supporting information only.
  function ScoresSlot(props) {
    var r = props.result,
      L = COPY.labels;
    return e(Slot, {
      name: 'scores'
    }, e('div', {
      className: 'fa-scores'
    }, e('h2', {
      className: 'fa-scores__h'
    }, r.isCloseResult ? L.scoresClose : L.scores), e('p', {
      className: 'fa-scores__note'
    }, 'Higher scores mean a stronger indication that the area deserves attention right now.'), e('ul', {
      className: 'fa-scores__list'
    }, r.ranking.map(function (id, i) {
      var score = r.focusAreaScores[id];
      var role = id === r.primaryFocusArea ? 'primary' : id === r.secondaryFocusArea ? 'secondary' : '';
      var tag = role === 'primary' ? r.isCloseResult ? 'Showing up strongly' : 'Your Focus Area' : role === 'secondary' ? r.isCloseResult ? 'Showing up strongly' : 'Also showing up' : null;
      return e('li', {
        key: id,
        className: 'fa-bar' + (role ? ' fa-bar--' + role : '')
      }, e('div', {
        className: 'fa-bar__top'
      }, e('span', {
        className: 'fa-bar__name'
      }, areaLabel(id), tag ? e('span', {
        className: 'fa-bar__tag'
      }, tag) : null), e('span', {
        className: 'fa-bar__val'
      }, e('span', {
        className: 'fa-sr'
      }, 'Score '), score, e('span', {
        className: 'fa-sr'
      }, ' out of 100'))), e('div', {
        className: 'fa-bar__track',
        'aria-hidden': 'true'
      }, e('div', {
        className: 'fa-bar__fill',
        style: {
          width: score + '%',
          animationDelay: i * 60 + 'ms'
        }
      })));
    })), e('p', {
      className: 'fa-scores__foot'
    }, 'Focus Areas describe where attention may be most useful in your current situation. They are not personality types.')));
  }

  // 6. Recommended resources. Structurally present, empty until a later stage.
  function ResourcesSlot() {
    return e(Slot, {
      name: 'resources',
      empty: true
    });
  }

  // The orientation-call invitation, after everything the result has to say.
  function CallSlot() {
    var C = COPY.callCta;
    return e(Slot, {
      name: 'call'
    }, e('div', {
      className: 'fa-call'
    }, e('h2', {
      className: 'fa-call__h'
    }, C.title), paras(C.text), e('a', {
      className: 'fa-btn fa-btn--outline fa-call__btn',
      href: FA_CALL_URL,
      onClick: function () {
        faTrack('assessment_call_cta');
      }
    }, C.button + ' ', e('span', {
      'aria-hidden': 'true'
    }, '→'))));
  }
  function Result(props) {
    var r = props.result;
    return e('div', {
      className: 'fa-page fa-result' + (r.isCloseResult ? ' fa-result--close' : '')
    }, e(HeadingSlot, {
      result: r,
      headRef: props.headRef
    }), e(ContextSlot, {
      result: r
    }), e(CoreSlot, {
      result: r
    }), e(SecondarySlot, {
      result: r
    }), e(ScoresSlot, {
      result: r
    }), e(ResourcesSlot, {
      result: r
    }), e(CallSlot, null), e('div', {
      className: 'fa-result__actions'
    }, e('div', {
      className: 'fa-row'
    }, e('button', {
      type: 'button',
      className: 'fa-btn fa-btn--ghost',
      onClick: props.onBack
    }, e('span', {
      'aria-hidden': 'true'
    }, '←'), ' Change my answers'), e('button', {
      type: 'button',
      className: 'fa-btn fa-btn--ghost',
      onClick: props.onRestart
    }, 'Retake the assessment'), e('a', {
      className: 'fa-link',
      href: FREE_TOOLS_URL
    }, 'Explore all free tools ', e('span', {
      'aria-hidden': 'true'
    }, '→')))));
  }

  // ── Email gate ───────────────────────────────────────────────────────────
  // Sits over the finished, blurred result. It asks for an email and nothing
  // else, and hands the address to onSubmit, which makes the one send and
  // calls back with the outcome. Everything it knows lives in its own state,
  // so a failed send leaves the address in the field and the result as it was.
  function EmailGate(props) {
    var R = React,
      G = COPY.gate;
    var emailS = R.useState(props.initialEmail || ''),
      email = emailS[0],
      setEmail = emailS[1];
    var statusS = R.useState('idle'),
      status = statusS[0],
      setStatus = statusS[1]; // idle | invalid | sending | failed
    var inputRef = R.useRef(null),
      titleRef = R.useRef(null),
      panelRef = R.useRef(null);
    var busyRef = R.useRef(false),
      aliveRef = R.useRef(true);
    var sending = status === 'sending';

    // Scroll just enough to show the whole panel (short screens only).
    function fitPanel() {
      var p = panelRef.current;
      if (!p) return;
      var b = p.getBoundingClientRect();
      var over = b.bottom - (window.innerHeight - 12);
      if (over > 0) window.scrollBy(0, Math.min(over, Math.max(0, b.top - 12)));
    }
    R.useEffect(function () {
      aliveRef.current = true;
      // Once laid out: bring the whole panel on screen, then move focus into
      // it. The field on a desktop; the title on touch screens, where
      // focusing the field would throw the keyboard over the panel.
      var raf = window.requestAnimationFrame(function () {
        fitPanel();
        var fine = !window.matchMedia || window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        var t = fine ? inputRef.current : titleRef.current;
        if (t) {
          try {
            t.focus({
              preventScroll: true
            });
          } catch (err) {
            t.focus();
          }
        }
      });
      return function () {
        aliveRef.current = false;
        window.cancelAnimationFrame(raf);
      };
    }, []);

    // A message line makes the panel taller: keep it whole.
    R.useEffect(function () {
      if (status === 'invalid' || status === 'failed') fitPanel();
    }, [status]);
    function submit(ev) {
      if (ev) ev.preventDefault();
      if (busyRef.current) return; // one send at a time, however many clicks
      var em = email.trim();
      if (!faValidEmail(em)) {
        setStatus('invalid');
        if (inputRef.current) inputRef.current.focus();
        return;
      }
      busyRef.current = true;
      setEmail(em);
      setStatus('sending');
      props.onSubmit(em, function (ok) {
        busyRef.current = false;
        // Success unmounts the gate; only a failure has anything to show.
        if (!ok && aliveRef.current) setStatus('failed');
      });
    }
    var errText = status === 'invalid' ? G.invalid : status === 'failed' ? G.failed : '';
    return e('div', {
      className: 'fa-gate'
    }, e('div', {
      className: 'fa-gate__stick'
    }, e('div', {
      className: 'fa-gate__panel',
      ref: panelRef,
      role: 'dialog',
      'aria-labelledby': 'fa-gate-title',
      'aria-describedby': 'fa-gate-text'
    }, e('h2', {
      className: 'fa-gate__title',
      id: 'fa-gate-title',
      tabIndex: -1,
      ref: titleRef
    }, G.title), e('p', {
      className: 'fa-gate__text',
      id: 'fa-gate-text'
    }, G.text), e('form', {
      noValidate: true,
      onSubmit: submit
    }, e('label', {
      className: 'fa-sr',
      htmlFor: 'fa-gate-email'
    }, G.placeholder), e('input', {
      id: 'fa-gate-email',
      ref: inputRef,
      className: 'fa-gate__input',
      type: 'email',
      name: 'email',
      inputMode: 'email',
      autoComplete: 'email',
      autoCapitalize: 'off',
      autoCorrect: 'off',
      spellCheck: false,
      maxLength: 254,
      placeholder: G.placeholder,
      value: email,
      readOnly: sending,
      'aria-invalid': status === 'invalid' ? 'true' : 'false',
      'aria-describedby': errText ? 'fa-gate-err fa-gate-help' : 'fa-gate-help',
      onChange: function (ev) {
        setEmail(ev.target.value);
        if (status === 'invalid' || status === 'failed') setStatus('idle');
      }
    }), errText ? e('p', {
      className: 'fa-gate__err',
      id: 'fa-gate-err',
      role: 'alert'
    }, errText) : null, e('button', {
      type: 'submit',
      className: 'fa-btn fa-gate__btn',
      disabled: sending,
      'aria-disabled': sending ? 'true' : undefined
    }, sending ? G.sending : G.button + ' ', sending ? null : e('span', {
      'aria-hidden': 'true'
    }, '→'))), e('p', {
      className: 'fa-gate__help',
      id: 'fa-gate-help'
    }, G.helper))));
  }

  // ── Root ─────────────────────────────────────────────────────────────────
  function FocusAreaAssessment() {
    var R = React;
    var pair = R.useReducer(reducer, null, initialState);
    var s = pair[0],
      dispatch = pair[1];
    var headRef = R.useRef(null);
    var rootRef = R.useRef(null);
    var liveRef = R.useRef(null);
    var firstRef = R.useRef(true);
    var steps = buildSteps(s);
    var step = steps[Math.min(s.step, steps.length - 1)];
    // The result is locked until this exact answer set has been unlocked.
    var resultKey = R.useMemo(function () {
      return s.result ? faAnswerKey(s.result) : null;
    }, [s.result]);
    var locked = s.screen === 'result' && !!s.result && s.unlockedKey !== resultKey;
    var wasLockedRef = R.useRef(locked);

    // Persist progress for this tab.
    R.useEffect(function () {
      safeSet({
        v: 1,
        persona: s.persona,
        selectedProblems: s.selectedProblems,
        primaryProblem: s.primaryProblem,
        contextualAnswers: s.contextualAnswers,
        universalAnswers: s.universalAnswers,
        step: s.step,
        completedAt: s.completedAt,
        unlockedKey: s.unlockedKey,
        userEmail: s.userEmail
      });
    }, [s.persona, s.selectedProblems, s.primaryProblem, s.contextualAnswers, s.universalAnswers, s.step, s.completedAt, s.unlockedKey, s.userEmail]);
    function scrollRootIntoView() {
      var root = rootRef.current;
      if (!root) return;
      var top = root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) window.scrollTo(0, Math.max(0, window.pageYOffset + top - 24));
    }
    function focusHead() {
      if (headRef.current) {
        try {
          headRef.current.focus({
            preventScroll: true
          });
        } catch (err) {
          headRef.current.focus();
        }
      }
    }

    // New screen: keep the question in view and move focus to it, so keyboard
    // and screen-reader users land on the question rather than the last button.
    // A locked result is the exception: the gate takes focus itself.
    var viewKey = s.screen + ':' + (s.screen === 'flow' ? step.key : '');
    R.useEffect(function () {
      if (firstRef.current) {
        firstRef.current = false;
        return;
      }
      scrollRootIntoView();
      if (!locked) focusHead();
    }, [viewKey]);

    // Just unlocked: land on the result heading, as a fresh result would.
    R.useEffect(function () {
      if (wasLockedRef.current && !locked && s.screen === 'result') {
        scrollRootIntoView();
        focusHead();
      }
      wasLockedRef.current = locked;
    }, [locked]);

    // Analytics on arrival at each question and at the result.
    R.useEffect(function () {
      if (s.screen === 'flow') faTrack('assessment_question_progress', {
        question: s.step + 1,
        total: steps.length,
        stage: step.stage + 1
      });
      if (s.screen === 'result' && s.result) {
        faTrack('assessment_completed', {
          persona: s.result.persona,
          primary_focus_area: s.result.primaryFocusArea,
          secondary_focus_area: s.result.secondaryFocusArea,
          close_result: s.result.isCloseResult
        });
      }
    }, [viewKey]);
    function announce(text) {
      var el = liveRef.current;
      if (!el) return;
      el.textContent = '';
      setTimeout(function () {
        el.textContent = text;
      }, 30);
    }

    // After an answer on a short screen, bring Continue into view if it sits
    // below the fold, so the next step is always visible.
    function revealNext() {
      var btn = rootRef.current && rootRef.current.querySelector('.fa-nav__next');
      var over = btn ? btn.getBoundingClientRect().bottom - (window.innerHeight - 16) : 0;
      if (over <= 0) return;
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try {
        window.scrollBy({
          top: over,
          behavior: still ? 'auto' : 'smooth'
        });
      } catch (err) {
        window.scrollBy(0, over);
      }
    }
    var act = {
      dispatch: dispatch,
      announce: announce,
      next: function () {
        dispatch({
          type: 'NEXT',
          now: new Date().toISOString()
        });
      },
      back: function () {
        dispatch({
          type: 'BACK'
        });
      },
      // Choosing records the answer and nothing more; Continue moves on.
      choose: function (action) {
        dispatch(action);
        window.requestAnimationFrame(revealNext);
      }
    };

    // The gate's submit: the one send, then unlock on success only. The result
    // is the one already calculated and on screen; nothing is rescored.
    function unlock(email, done) {
      var r = s.result,
        key = resultKey;
      faTrack('assessment_unlock_submitted');
      faNotify(r, email, function (ok) {
        done(ok);
        if (ok) {
          faTrack('assessment_unlocked');
          dispatch({
            type: 'UNLOCK',
            key: key,
            email: email
          });
          announce('Your result is unlocked.');
        } else {
          faTrack('assessment_unlock_failed');
        }
      });
    }
    var body;
    if (s.screen === 'result' && s.result) {
      body = e('div', {
        className: 'fa-gatewrap' + (locked ? ' is-locked' : '')
      },
      // Rendered in full either way; while locked it is blurred, and inert
      // and hidden from assistive tech so nothing in it can be reached.
      e('div', {
        inert: locked ? '' : undefined,
        'aria-hidden': locked ? 'true' : undefined
      }, e(Result, {
        result: s.result,
        headRef: headRef,
        onBack: act.back,
        onRestart: function () {
          faTrack('assessment_restarted');
          safeClear();
          dispatch({
            type: 'START'
          });
        }
      })), locked ? e(EmailGate, {
        key: resultKey,
        initialEmail: s.userEmail,
        onSubmit: unlock
      }) : null);
    } else if (s.screen === 'flow') {
      body = e('div', {
        className: 'fa-page'
      }, e(Progress, {
        steps: steps,
        index: s.step
      }), e('div', {
        key: step.key,
        className: 'fa-step ' + (s.dir < 0 ? 'fa-step--back' : 'fa-step--fwd')
      }, e(StepView, {
        state: s,
        step: step,
        act: act,
        headRef: headRef
      }), e(Nav, {
        onBack: act.back,
        onNext: act.next,
        canNext: stepAnswered(s, step)
      })));
    } else {
      body = e(Intro, {
        state: s,
        onStart: function () {
          faTrack('assessment_started');
          safeClear();
          dispatch({
            type: 'START'
          });
        },
        onResume: function () {
          faTrack('assessment_resumed');
          dispatch({
            type: 'RESUME'
          });
        },
        onShowResult: function () {
          dispatch({
            type: 'SHOW_RESULT'
          });
        }
      });
    }
    return e('div', {
      ref: rootRef,
      className: 'fa-root'
    }, e('div', {
      ref: liveRef,
      className: 'fa-sr',
      'aria-live': 'polite',
      role: 'status'
    }), body);
  }
  function renderFocusArea() {
    function App() {
      return e(React.Fragment, null, e(FocusAreaStyles), e(window.LegacyShell, {
        page: SLUG,
        lang: 'en',
        form: true,
        cta: false
      }, e(FocusAreaAssessment, null)));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(e(App, null));
  }
  Object.assign(window, {
    FocusAreaAssessment: FocusAreaAssessment,
    FocusAreaResult: Result,
    faBuildReport: faBuildReport,
    faNotify: faNotify,
    faResultVars: faResultVars,
    faValidEmail: faValidEmail,
    FocusAreaStyles: FocusAreaStyles,
    renderFocusArea: renderFocusArea,
    faBuildSteps: buildSteps
  });
})();
