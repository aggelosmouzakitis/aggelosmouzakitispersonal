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
//     on the selected answer, the same hover wash and the same ← Back button
//   • analytics go through gtag with the slug on every event and no answer text
//
// Result page: six separate slots, in order, so later stages can fill them
// without restructuring anything:
//   1 heading · 2 contextual interpretation · 3 core interpretation ·
//   4 secondary Focus Area · 5 score visualisation · 6 recommended resources

(function () {
  var e = React.createElement;
  var D = window.FOCUS_AREA_DATA;
  var SLUG = D.slug;
  var STORE_KEY = 'focus-area:v1';
  var ADVANCE_MS = 180;       // long enough to see the choice register
  var FREE_TOOLS_URL = window.FREE_TOOLS_URL || '/free-tools/';

  function faTrack(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ assessment: SLUG }, params || {})); } catch (err) { /* noop */ }
  }
  function safeGet() { try { var raw = window.sessionStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : null; } catch (err) { return null; } }
  function safeSet(v) { try { window.sessionStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (err) { /* noop */ } }
  function safeClear() { try { window.sessionStorage.removeItem(STORE_KEY); } catch (err) { /* noop */ } }

  // ── Flow ─────────────────────────────────────────────────────────────────
  // The step list is derived from the answers, so it is always accurate: the
  // "which one matters most" screen exists only when two or more problems are
  // selected, and the question count updates the moment that changes.
  function buildSteps(s) {
    var steps = [
      { key: 'persona', kind: 'persona', stage: 0 },
      { key: 'problems', kind: 'problems', stage: 0 },
    ];
    if ((s.selectedProblems || []).length > 1) steps.push({ key: 'primary', kind: 'primary', stage: 0 });
    for (var i = 0; i < 4; i++) steps.push({ key: 'ctx-' + (s.primaryProblem || 'pending') + '-' + i, kind: 'contextual', stage: 1, index: i });
    D.UNIVERSAL.forEach(function (item, i) { steps.push({ key: item.id, kind: 'universal', stage: 2, index: i, item: item }); });
    return steps;
  }

  function freshState() {
    return {
      screen: 'intro', step: 0, dir: 1,
      persona: null, selectedProblems: [], primaryProblem: null,
      contextualAnswers: {}, universalAnswers: {},
      result: null, completedAt: null,
    };
  }

  function answersOf(s) {
    return {
      persona: s.persona, selectedProblems: s.selectedProblems, primaryProblem: s.primaryProblem,
      contextualAnswers: s.contextualAnswers, universalAnswers: s.universalAnswers,
    };
  }

  function reducer(s, a) {
    var steps, n;
    switch (a.type) {
      case 'START':
        return Object.assign(freshState(), { screen: 'flow', step: 0, dir: 1 });
      case 'RESUME':
        steps = buildSteps(s);
        return Object.assign({}, s, { screen: 'flow', step: Math.min(s.step || 0, steps.length - 1), dir: 1 });
      case 'SHOW_RESULT':
        return s.result ? Object.assign({}, s, { screen: 'result', dir: 1 }) : s;
      case 'INTRO':
        return Object.assign({}, s, { screen: 'intro' });
      case 'SET_PERSONA':
        if (a.value === s.persona) return s;
        // Problems are persona-specific, so a different persona starts that
        // screen afresh. Contextual answers are keyed by question id and stay.
        return Object.assign({}, s, { persona: a.value, selectedProblems: [], primaryProblem: null });
      case 'TOGGLE_PROBLEM': {
        var sel = s.selectedProblems.slice();
        var at = sel.indexOf(a.value);
        if (at >= 0) sel.splice(at, 1);
        else if (sel.length < D.PROBLEMS_QUESTION.max) sel.push(a.value);
        else return s;
        var primary = s.primaryProblem;
        if (sel.length === 1) primary = sel[0];
        else if (sel.indexOf(primary) < 0) primary = null;
        return Object.assign({}, s, { selectedProblems: sel, primaryProblem: primary });
      }
      case 'SET_PRIMARY':
        return Object.assign({}, s, { primaryProblem: a.value });
      case 'SET_CONTEXTUAL': {
        var ca = Object.assign({}, s.contextualAnswers); ca[a.id] = a.value;
        return Object.assign({}, s, { contextualAnswers: ca });
      }
      case 'SET_UNIVERSAL': {
        var ua = Object.assign({}, s.universalAnswers); ua[a.id] = a.value;
        return Object.assign({}, s, { universalAnswers: ua });
      }
      case 'NEXT':
        steps = buildSteps(s);
        n = s.step + 1;
        if (n < steps.length) return Object.assign({}, s, { step: n, dir: 1 });
        if (!window.faIsComplete(answersOf(s))) return s;
        // Instant, client-side, deterministic.
        var result = window.faScore(Object.assign(answersOf(s), { completedAt: a.now }));
        return Object.assign({}, s, { screen: 'result', dir: 1, result: result, completedAt: a.now });
      case 'BACK':
        if (s.screen === 'result') {
          steps = buildSteps(s);
          return Object.assign({}, s, { screen: 'flow', step: steps.length - 1, dir: -1 });
        }
        if (s.step === 0) return Object.assign({}, s, { screen: 'intro', dir: -1 });
        return Object.assign({}, s, { step: s.step - 1, dir: -1 });
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
    s.selectedProblems = (saved.selectedProblems || []).filter(function (id) { return s.persona && D.problem(s.persona, id); }).slice(0, D.PROBLEMS_QUESTION.max);
    s.primaryProblem = s.selectedProblems.indexOf(saved.primaryProblem) >= 0 ? saved.primaryProblem : (s.selectedProblems.length === 1 ? s.selectedProblems[0] : null);
    s.contextualAnswers = saved.contextualAnswers || {};
    s.universalAnswers = saved.universalAnswers || {};
    s.step = saved.step || 0;
    if (saved.completedAt && window.faIsComplete(answersOf(s))) {
      s.completedAt = saved.completedAt;
      s.result = window.faScore(Object.assign(answersOf(s), { completedAt: saved.completedAt }));
    }
    return s;
  }
  function hasProgress(s) { return !!s.persona; }

  // ── Styles ───────────────────────────────────────────────────────────────
  var FA_CSS = [
    '.fa-page{max-width:720px;margin:0 auto;padding:40px 0 24px;color:var(--ink-2,#3A403A)}',
    '.fa-eyebrow{margin:0 0 16px;font-size:12px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--green,#047857)}',

    // intro
    '.fa-h1{margin:0 0 20px;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(38px,5.4vw,60px);font-weight:800;line-height:.98;letter-spacing:-.045em;color:var(--heading-ink,#14201C);text-wrap:balance}',
    '.fa-standfirst{margin:0 0 18px;max-width:34ch;font-size:clamp(20px,2.2vw,23px);font-weight:600;line-height:1.4;letter-spacing:-.01em;color:var(--ink,#171919);text-wrap:pretty}',
    '.fa-lead{margin:0 0 30px;max-width:60ch;font-size:18px;line-height:1.65;color:var(--ink-2,#3A403A);text-wrap:pretty}',
    '.fa-stages{list-style:none;margin:0 0 34px;padding:0;border-top:1px solid var(--rule,rgba(23,25,25,.18))}',
    '.fa-stages li{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:4px 12px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--rule,rgba(23,25,25,.18))}',
    '.fa-stages__n{font-family:var(--font-display);font-size:14px;line-height:1;color:var(--green-pressed,#03654A);font-variant-numeric:tabular-nums}',
    '.fa-stages__t{font-size:16.5px;font-weight:650;line-height:1.35;color:var(--ink,#171919)}',
    '.fa-stages__m{font-size:13.5px;line-height:1.35;color:var(--meta,#6A6F67);white-space:nowrap}',
    '.fa-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 22px}',
    '.fa-note{margin:16px 0 0;font-size:14px;line-height:1.6;color:var(--meta,#6A6F67)}',

    // buttons (the clarity tools\' green, radius, padding and type)
    '.fa-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 26px;background:var(--green,#047857);color:#F3F0E8;border:1.5px solid var(--green,#047857);border-radius:2px;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;line-height:1;cursor:pointer;text-decoration:none;transition:background var(--dur-hover,180ms),border-color var(--dur-hover,180ms),box-shadow var(--dur-hover,180ms),gap var(--dur-hover,180ms)}',
    '.fa-btn:hover{background:var(--green-pressed,#03654A);border-color:var(--green-pressed,#03654A);color:#F3F0E8;box-shadow:0 6px 18px rgba(4,120,87,.28);gap:12px}',
    '.fa-btn[disabled]{opacity:.45;cursor:default;box-shadow:none;gap:9px}',
    '.fa-btn[disabled]:hover{background:var(--green,#047857);border-color:var(--green,#047857)}',
    '.fa-btn--ghost{background:transparent;color:var(--ink-2,#3A403A);border-color:rgba(23,25,25,.35)}',
    '.fa-btn--ghost:hover{background:transparent;color:var(--green-pressed,#03654A);border-color:var(--green,#047857);box-shadow:none}',
    '.fa-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0;background:none;border:0;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--green-pressed,#03654A);cursor:pointer;text-decoration:none;transition:gap var(--dur-hover,180ms),color var(--dur-hover,180ms)}',
    '.fa-link:hover{gap:12px;color:var(--green,#047857)}',

    // progress
    '.fa-progress{margin:0 0 34px}',
    '.fa-progress__top{display:flex;justify-content:space-between;align-items:baseline;gap:6px 16px;margin-bottom:12px}',
    '.fa-progress__stage{min-width:0;margin:0;font-size:12px;font-weight:700;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--green-pressed,#03654A)}',
    '.fa-progress__stage span{color:var(--meta,#6A6F67)}',
    '.fa-progress__count{flex:none;margin:0;font-size:12px;font-weight:700;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}',
    '.fa-progress__bar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}',
    '.fa-progress__seg{position:relative;height:3px;background:rgba(23,25,25,.13);overflow:hidden}',
    '.fa-progress__fill{position:absolute;inset:0;background:var(--green,#047857);transform-origin:left center;transition:transform var(--dur-state,520ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',

    // question
    '.fa-step{animation-duration:340ms;animation-timing-function:var(--ease-settle,cubic-bezier(.22,1,.36,1));animation-fill-mode:both}',
    '.fa-step--fwd{animation-name:fa-in-fwd}',
    '.fa-step--back{animation-name:fa-in-back}',
    '@keyframes fa-in-fwd{from{opacity:0;transform:translate3d(16px,0,0)}to{opacity:1;transform:none}}',
    '@keyframes fa-in-back{from{opacity:0;transform:translate3d(-16px,0,0)}to{opacity:1;transform:none}}',
    '.fa-q__kicker{margin:0 0 12px;font-size:14.5px;font-weight:600;line-height:1.5;color:var(--meta,#6A6F67)}',
    '.fa-q__text{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(24px,3.1vw,31px);font-weight:750;line-height:1.2;letter-spacing:-.02em;color:var(--heading-ink,#14201C);text-wrap:balance;outline:none}',
    '.fa-q__helper{margin:12px 0 0;max-width:56ch;font-size:16px;line-height:1.55;color:var(--ink-2,#3A403A)}',
    '.fa-q__limit{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:18px 0 0;font-size:12.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}',
    '.fa-q__limit-rule{color:var(--green-pressed,#03654A)}',
    '.fa-q__limit-count{color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}',
    '.fa-q__limit-count.is-full{color:var(--green-pressed,#03654A)}',
    '.fa-options{margin:22px 0 0;border-top:1px solid rgba(23,25,25,.14)}',
    '.fa-opt{display:flex;align-items:flex-start;gap:14px;width:100%;margin:0;padding:15px 12px 15px 14px;text-align:left;background:transparent;border:0;border-bottom:1px solid rgba(23,25,25,.14);border-left:2px solid transparent;border-radius:0;font-family:inherit;font-size:17px;font-weight:400;line-height:1.45;color:var(--ink-2,#3A403A);cursor:pointer;transition:background-color var(--dur-hover,180ms),border-color var(--dur-hover,180ms),color var(--dur-hover,180ms)}',
    '.fa-opt:hover{background:rgba(4,120,87,.05)}',
    '.fa-opt[aria-pressed="true"]{border-left-color:var(--green,#047857);background:rgba(4,120,87,.07);color:var(--green-pressed,#03654A);font-weight:650}',
    '.fa-opt[aria-disabled="true"]{color:rgba(58,64,58,.5);cursor:not-allowed}',
    '.fa-opt[aria-disabled="true"]:hover{background:transparent}',
    '.fa-opt__mark{flex:none;position:relative;width:20px;height:20px;margin-top:2px;border:1.5px solid rgba(23,25,25,.42);border-radius:50%;background:transparent;transition:background-color var(--dur-hover,180ms),border-color var(--dur-hover,180ms)}',
    '.fa-opt__mark--check{border-radius:3px}',
    '.fa-opt[aria-pressed="true"] .fa-opt__mark{border-color:var(--green,#047857);background:var(--green,#047857)}',
    '.fa-opt[aria-pressed="true"] .fa-opt__mark::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#F3F0E8}',
    '.fa-opt[aria-pressed="true"] .fa-opt__mark--check::after{width:5px;height:10px;margin:-6.5px 0 0 -2.5px;border-radius:0;background:none;border:solid #F3F0E8;border-width:0 2px 2px 0;transform:rotate(45deg)}',
    '.fa-opt[aria-disabled="true"] .fa-opt__mark{border-color:rgba(23,25,25,.2)}',
    '.fa-opt__num{flex:none;min-width:14px;font-weight:700;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}',
    '.fa-opt[aria-pressed="true"] .fa-opt__num{color:inherit}',
    '.fa-opt__label{min-width:0}',
    '.fa-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:28px}',
    '.fa-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',

    // result
    '.fa-result{animation:fa-in-fwd 420ms var(--ease-settle,cubic-bezier(.22,1,.36,1)) both}',
    '.fa-slot + .fa-slot{margin-top:40px}',
    '.fa-slot[hidden]{display:none}',
    '.fa-result__area{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(46px,8vw,88px);font-weight:800;line-height:.95;letter-spacing:-.05em;color:var(--green,#047857);text-wrap:balance;outline:none}',
    '.fa-result__rule{width:96px;height:2px;margin:26px 0 0;background:var(--green,#047857)}',
    '.fa-result__situation{margin:22px 0 0}',
    '.fa-label{display:block;margin:0 0 6px;font-size:12px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--meta,#6A6F67)}',
    '.fa-result__situation p{margin:0;font-size:18px;font-weight:600;line-height:1.5;color:var(--ink,#171919)}',
    '.fa-placeholder{margin:0;padding:18px 20px;border-left:2px solid var(--rule,rgba(23,25,25,.18));background:rgba(23,25,25,.03);font-size:16px;line-height:1.6;color:var(--meta,#6A6F67)}',
    '.fa-secondary{padding-top:22px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}',
    '.fa-secondary__line{margin:0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(22px,2.6vw,28px);font-weight:750;line-height:1.25;letter-spacing:-.02em;color:var(--heading-ink,#14201C);text-wrap:balance}',
    '.fa-secondary__line span{color:var(--green-pressed,#03654A)}',

    // score visualisation — deliberately quieter than the result above it
    '.fa-scores{padding-top:22px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}',
    '.fa-scores__h{margin:0;font-size:13px;font-weight:700;line-height:1.5;letter-spacing:.08em;text-transform:uppercase;color:var(--green-pressed,#03654A)}',
    '.fa-scores__note{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--meta,#6A6F67)}',
    '.fa-scores__list{list-style:none;margin:20px 0 0;padding:0}',
    '.fa-bar{padding:10px 0}',
    '.fa-bar__top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:7px}',
    '.fa-bar__name{min-width:0;font-size:15px;font-weight:600;line-height:1.35;color:var(--ink-2,#3A403A)}',
    '.fa-bar__tag{margin-left:8px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--green-pressed,#03654A);white-space:nowrap}',
    '.fa-bar__val{flex:none;font-size:14px;font-weight:700;color:var(--meta,#6A6F67);font-variant-numeric:tabular-nums}',
    '.fa-bar__track{height:6px;background:rgba(23,25,25,.08)}',
    '.fa-bar__fill{height:100%;background:rgba(23,25,25,.3);transform-origin:left center;animation:fa-grow 640ms var(--ease-settle,cubic-bezier(.22,1,.36,1)) both}',
    '.fa-bar--primary .fa-bar__fill{background:var(--green,#047857)}',
    '.fa-bar--secondary .fa-bar__fill{background:#6FAE8F}',
    '.fa-bar--primary .fa-bar__name,.fa-bar--secondary .fa-bar__name{color:var(--ink,#171919)}',
    '@keyframes fa-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}',
    '.fa-scores__foot{margin:16px 0 0;font-size:13.5px;line-height:1.55;color:var(--meta,#6A6F67)}',
    '.fa-result__actions{margin-top:44px;padding-top:26px;border-top:1px solid var(--rule,rgba(23,25,25,.18))}',

    '@media (max-width:767px){',
    '.fa-page{padding:8px 0 8px}',
    '.fa-lead{font-size:17px}',
    '.fa-opt{font-size:16px;padding:14px 10px 14px 12px}',
    '.fa-stages li{grid-template-columns:34px minmax(0,1fr)}',
    '.fa-stages__m{grid-column:2;white-space:normal}',
    '.fa-row .fa-btn{width:100%}',
    '.fa-result__actions .fa-row{flex-direction:column;align-items:stretch}',
    '.fa-result__actions .fa-link{justify-content:center}',
    '}',
    '@media (prefers-reduced-motion:reduce){.fa-step,.fa-result,.fa-bar__fill{animation:none}.fa-progress__fill{transition:none}}',
  ].join('');

  function FocusAreaStyles() { return e('style', { dangerouslySetInnerHTML: { __html: FA_CSS } }); }

  // ── Pieces ───────────────────────────────────────────────────────────────
  function Progress(props) {
    var steps = props.steps, i = props.index;
    var step = steps[i];
    var stageTotals = [0, 0, 0], stageDone = [0, 0, 0];
    steps.forEach(function (s, k) {
      stageTotals[s.stage]++;
      if (k < i) stageDone[s.stage]++;
    });
    var stage = D.STAGES[step.stage];
    return e('div', { className: 'fa-progress' },
      e('div', { className: 'fa-progress__top' },
        e('p', { className: 'fa-progress__stage' },
          e('span', null, 'Stage ' + (step.stage + 1) + ' of 3 · '), stage.label),
        e('p', { className: 'fa-progress__count' }, 'Question ' + (i + 1) + ' of ' + steps.length)),
      e('div', {
        className: 'fa-progress__bar', role: 'progressbar',
        'aria-label': 'Assessment progress', 'aria-valuemin': 0, 'aria-valuemax': steps.length, 'aria-valuenow': i,
        'aria-valuetext': 'Question ' + (i + 1) + ' of ' + steps.length + ', stage ' + (step.stage + 1) + ' of 3: ' + stage.label,
      },
        [0, 1, 2].map(function (k) {
          var frac = stageTotals[k] ? stageDone[k] / stageTotals[k] : 0;
          return e('span', { key: k, className: 'fa-progress__seg' },
            e('span', { className: 'fa-progress__fill', style: { transform: 'scaleX(' + frac + ')' } }));
        })));
  }

  function Option(props) {
    var cls = 'fa-opt__mark' + (props.multi ? ' fa-opt__mark--check' : '');
    return e('button', {
      type: 'button', className: 'fa-opt',
      'aria-pressed': props.selected ? 'true' : 'false',
      'aria-disabled': props.disabled ? 'true' : undefined,
      onClick: props.onClick,
    },
      e('span', { className: cls, 'aria-hidden': 'true' }),
      props.num != null ? e('span', { className: 'fa-opt__num', 'aria-hidden': 'true' }, props.num) : null,
      e('span', { className: 'fa-opt__label' }, props.label));
  }

  function QuestionHead(props) {
    return e(React.Fragment, null,
      props.kicker ? e('p', { className: 'fa-q__kicker' }, props.kicker) : null,
      e('h1', { className: 'fa-q__text', id: props.id, tabIndex: -1, ref: props.headRef }, props.text),
      props.helper ? e('p', { className: 'fa-q__helper' }, props.helper) : null);
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  function Intro(props) {
    var s = props.state;
    var resumable = hasProgress(s) && !s.result;
    var primaryBtn;
    if (s.result) primaryBtn = e('button', { type: 'button', className: 'fa-btn', onClick: props.onShowResult }, 'See your result ', e('span', { 'aria-hidden': 'true' }, '→'));
    else if (resumable) primaryBtn = e('button', { type: 'button', className: 'fa-btn', onClick: props.onResume }, 'Continue where you left off ', e('span', { 'aria-hidden': 'true' }, '→'));
    else primaryBtn = e('button', { type: 'button', className: 'fa-btn', onClick: props.onStart }, 'START THE ASSESSMENT ', e('span', { 'aria-hidden': 'true' }, '→'));

    return e('div', { className: 'fa-page' },
      e('p', { className: 'fa-eyebrow' }, 'Free assessment'),
      e('h1', { className: 'fa-h1' }, D.title),
      e('p', { className: 'fa-standfirst' }, 'A 4-minute assessment to find what deserves your attention first.'),
      e('p', { className: 'fa-lead' }, "Most problems have more than one layer. This assessment looks at what you're dealing with, how the problem is working, and how you tend to respond to it. The goal is to identify where your attention is most useful right now."),
      e('ol', { className: 'fa-stages', 'aria-label': 'Three stages' },
        [['01', D.STAGES[0].label, '2 or 3 questions'], ['02', D.STAGES[1].label, '4 questions'], ['03', D.STAGES[2].label, '14 statements']].map(function (r) {
          return e('li', { key: r[0] },
            e('span', { className: 'fa-stages__n', 'aria-hidden': 'true' }, r[0]),
            e('span', { className: 'fa-stages__t' }, r[1]),
            e('span', { className: 'fa-stages__m' }, r[2]));
        })),
      e('div', { className: 'fa-row' },
        primaryBtn,
        (resumable || s.result) ? e('button', { type: 'button', className: 'fa-link', onClick: props.onStart }, 'Start again') : null),
      e('p', { className: 'fa-note' }, 'Free · About 4 minutes · Your result appears as soon as you finish'));
  }

  // ── Question screens ─────────────────────────────────────────────────────
  function StepView(props) {
    var s = props.state, step = props.step, act = props.act;
    var qid = 'fa-q-' + step.key;

    if (step.kind === 'persona') {
      return e('div', null,
        e(QuestionHead, { id: qid, text: D.PERSONA_QUESTION.text, helper: D.PERSONA_QUESTION.helper, headRef: props.headRef }),
        e('div', { className: 'fa-options', role: 'group', 'aria-labelledby': qid },
          D.PERSONAS.map(function (p) {
            return e(Option, { key: p.id, label: p.label, selected: s.persona === p.id, onClick: function () { act.choose({ type: 'SET_PERSONA', value: p.id }); } });
          })));
    }

    if (step.kind === 'problems') {
      var sel = s.selectedProblems, max = D.PROBLEMS_QUESTION.max, full = sel.length >= max;
      return e('div', null,
        e(QuestionHead, { id: qid, text: D.PROBLEMS_QUESTION.text, headRef: props.headRef }),
        e('p', { className: 'fa-q__limit', id: qid + '-limit' },
          e('span', { className: 'fa-q__limit-rule' }, D.PROBLEMS_QUESTION.helper),
          e('span', { className: 'fa-q__limit-count' + (full ? ' is-full' : ''), 'aria-hidden': 'true' }, sel.length + ' of ' + max + ' chosen')),
        e('div', { className: 'fa-options', role: 'group', 'aria-labelledby': qid, 'aria-describedby': qid + '-limit' },
          D.problems(s.persona).map(function (p) {
            var on = sel.indexOf(p.id) >= 0;
            var blocked = !on && full;
            return e(Option, {
              key: p.id, multi: true, label: p.label, selected: on, disabled: blocked,
              onClick: function () {
                if (blocked) { act.announce('You can choose up to ' + max + '. Deselect one to choose a different problem.'); return; }
                act.dispatch({ type: 'TOGGLE_PROBLEM', value: p.id });
                var count = on ? sel.length - 1 : sel.length + 1;
                act.announce(count + ' of ' + max + ' chosen.');
              },
            });
          })),
        e(Nav, { onBack: act.back },
          e('button', { type: 'button', className: 'fa-btn', disabled: !sel.length, onClick: act.next }, 'Continue ', e('span', { 'aria-hidden': 'true' }, '→'))));
    }

    if (step.kind === 'primary') {
      return e('div', null,
        e(QuestionHead, { id: qid, text: D.PRIMARY_QUESTION.text, headRef: props.headRef }),
        e('div', { className: 'fa-options', role: 'group', 'aria-labelledby': qid },
          s.selectedProblems.map(function (id) {
            var p = D.problem(s.persona, id);
            return e(Option, { key: id, label: p ? p.label : id, selected: s.primaryProblem === id, onClick: function () { act.choose({ type: 'SET_PRIMARY', value: id }); } });
          })));
    }

    if (step.kind === 'contextual') {
      var q = D.contextualQuestions(s.persona, s.primaryProblem)[step.index];
      if (!q) return null;
      return e('div', null,
        e(QuestionHead, { id: qid, text: q.text, headRef: props.headRef, kicker: step.index === 0 ? 'Next, four short questions about how this is working in practice.' : null }),
        e('div', { className: 'fa-options', role: 'group', 'aria-labelledby': qid },
          q.options.map(function (o) {
            return e(Option, { key: o.id, label: o.label, selected: s.contextualAnswers[q.id] === o.id, onClick: function () { act.choose({ type: 'SET_CONTEXTUAL', id: q.id, value: o.id }); } });
          })));
    }

    if (step.kind === 'universal') {
      var item = step.item;
      return e('div', null,
        e(QuestionHead, {
          id: qid, text: item.text, headRef: props.headRef,
          kicker: step.index === 0 ? 'Finally, 14 short statements. Answer based on how things are now. ' + D.UNIVERSAL_PROMPT : D.UNIVERSAL_PROMPT,
        }),
        e('div', { className: 'fa-options', role: 'group', 'aria-labelledby': qid },
          D.SCALE.map(function (pt) {
            return e(Option, { key: pt.value, num: pt.value, label: pt.label, selected: s.universalAnswers[item.id] === pt.value, onClick: function () { act.choose({ type: 'SET_UNIVERSAL', id: item.id, value: pt.value }); } });
          })));
    }
    return null;
  }

  function Nav(props) {
    return e('div', { className: 'fa-nav' },
      e('button', { type: 'button', className: 'fa-btn fa-btn--ghost', onClick: props.onBack }, e('span', { 'aria-hidden': 'true' }, '←'), ' Back'),
      props.children || null);
  }

  // ── Result page ──────────────────────────────────────────────────────────
  // Each slot is its own section so later stages can fill one without touching
  // the others. Empty slots stay in the DOM, hidden, marking their place.
  function Slot(props) {
    return e('section', {
      className: 'fa-slot fa-slot--' + props.name, 'data-slot': props.name,
      hidden: props.empty ? true : undefined, 'aria-label': props.label || undefined,
    }, props.children || null);
  }

  // 1. Focus Area heading
  function HeadingSlot(props) {
    var r = props.result;
    var persona = D.persona(r.persona), problem = D.problem(r.persona, r.primaryProblem);
    return e(Slot, { name: 'heading' },
      e('p', { className: 'fa-eyebrow' }, 'Your Focus Area'),
      e('h1', { className: 'fa-result__area', tabIndex: -1, ref: props.headRef }, D.focusArea(r.primaryFocusArea).label),
      e('div', { className: 'fa-result__rule', 'aria-hidden': 'true' }),
      e('div', { className: 'fa-result__situation' },
        e('span', { className: 'fa-label' }, 'Your situation'),
        e('p', null, (persona ? persona.label : r.persona) + ' · ' + (problem ? problem.label : r.primaryProblem))));
  }

  // 2. Contextual interpretation (persona + problem). Stage 1 placeholder.
  function ContextSlot() {
    return e(Slot, { name: 'context', label: 'Your interpretation' },
      e('p', { className: 'fa-placeholder' }, 'Your detailed interpretation will be added in the next stage.'));
  }

  // 3. Core Focus Area interpretation. Empty in Stage 1.
  function CoreSlot() { return e(Slot, { name: 'core', empty: true }); }

  // 4. Secondary Focus Area
  function SecondarySlot(props) {
    var r = props.result;
    var p = D.focusArea(r.primaryFocusArea).label, sLabel = D.focusArea(r.secondaryFocusArea).label;
    return e(Slot, { name: 'secondary' },
      e('div', { className: 'fa-secondary' },
        r.isCloseResult
          ? e('p', { className: 'fa-secondary__line' }, 'Two areas are showing up strongly: ', e('span', null, p + ' + ' + sLabel))
          : e('p', { className: 'fa-secondary__line' }, 'Also showing up: ', e('span', null, sLabel))));
  }

  // 5. All seven scores, highest first. Supporting information only.
  function ScoresSlot(props) {
    var r = props.result;
    return e(Slot, { name: 'scores' },
      e('div', { className: 'fa-scores' },
        e('h2', { className: 'fa-scores__h' }, 'Your Focus Areas'),
        e('p', { className: 'fa-scores__note' }, 'Higher scores mean a stronger indication that the area deserves attention right now.'),
        e('ul', { className: 'fa-scores__list' },
          r.ranking.map(function (id, i) {
            var score = r.focusAreaScores[id];
            var role = id === r.primaryFocusArea ? 'primary' : (id === r.secondaryFocusArea ? 'secondary' : '');
            var tag = role === 'primary' ? (r.isCloseResult ? 'Showing up strongly' : 'Your Focus Area') : (role === 'secondary' ? (r.isCloseResult ? 'Showing up strongly' : 'Also showing up') : null);
            return e('li', { key: id, className: 'fa-bar' + (role ? ' fa-bar--' + role : '') },
              e('div', { className: 'fa-bar__top' },
                e('span', { className: 'fa-bar__name' }, D.focusArea(id).label, tag ? e('span', { className: 'fa-bar__tag' }, tag) : null),
                e('span', { className: 'fa-bar__val' }, e('span', { className: 'fa-sr' }, 'Score '), score, e('span', { className: 'fa-sr' }, ' out of 100'))),
              e('div', { className: 'fa-bar__track', 'aria-hidden': 'true' },
                e('div', { className: 'fa-bar__fill', style: { width: score + '%', animationDelay: (i * 60) + 'ms' } })));
          })),
        e('p', { className: 'fa-scores__foot' }, 'Focus Areas describe where attention may be most useful in your current situation. They are not personality types.')));
  }

  // 6. Recommended resources. Structurally present, empty until a later stage.
  function ResourcesSlot() { return e(Slot, { name: 'resources', empty: true }); }

  function Result(props) {
    var r = props.result;
    return e('div', { className: 'fa-page fa-result' },
      e(HeadingSlot, { result: r, headRef: props.headRef }),
      e(ContextSlot, { result: r }),
      e(CoreSlot, { result: r }),
      e(SecondarySlot, { result: r }),
      e(ScoresSlot, { result: r }),
      e(ResourcesSlot, { result: r }),
      e('div', { className: 'fa-result__actions' },
        e('div', { className: 'fa-row' },
          e('button', { type: 'button', className: 'fa-btn fa-btn--ghost', onClick: props.onBack }, e('span', { 'aria-hidden': 'true' }, '←'), ' Change my answers'),
          e('button', { type: 'button', className: 'fa-btn fa-btn--ghost', onClick: props.onRestart }, 'Retake the assessment'),
          e('a', { className: 'fa-link', href: FREE_TOOLS_URL }, 'Explore all free tools ', e('span', { 'aria-hidden': 'true' }, '→')))));
  }

  // ── Root ─────────────────────────────────────────────────────────────────
  function FocusAreaAssessment() {
    var R = React;
    var pair = R.useReducer(reducer, null, initialState);
    var s = pair[0], dispatch = pair[1];
    var headRef = R.useRef(null);
    var rootRef = R.useRef(null);
    var liveRef = R.useRef(null);
    var lockRef = R.useRef(false);
    var timerRef = R.useRef(0);
    var firstRef = R.useRef(true);
    var steps = buildSteps(s);
    var step = steps[Math.min(s.step, steps.length - 1)];

    // Persist progress for this tab.
    R.useEffect(function () {
      safeSet({
        v: 1, persona: s.persona, selectedProblems: s.selectedProblems, primaryProblem: s.primaryProblem,
        contextualAnswers: s.contextualAnswers, universalAnswers: s.universalAnswers,
        step: s.step, completedAt: s.completedAt,
      });
    }, [s.persona, s.selectedProblems, s.primaryProblem, s.contextualAnswers, s.universalAnswers, s.step, s.completedAt]);

    // New screen: keep the question in view and move focus to it, so keyboard
    // and screen-reader users land on the question rather than the last button.
    var viewKey = s.screen + ':' + (s.screen === 'flow' ? step.key : '');
    R.useEffect(function () {
      lockRef.current = false;
      if (firstRef.current) { firstRef.current = false; return; }
      var root = rootRef.current;
      if (root) {
        var top = root.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) window.scrollTo(0, Math.max(0, window.pageYOffset + top - 24));
      }
      if (headRef.current) { try { headRef.current.focus({ preventScroll: true }); } catch (err) { headRef.current.focus(); } }
    }, [viewKey]);

    R.useEffect(function () { return function () { clearTimeout(timerRef.current); }; }, []);

    // Analytics on arrival at each question and at the result.
    R.useEffect(function () {
      if (s.screen === 'flow') faTrack('assessment_question_progress', { question: s.step + 1, total: steps.length, stage: step.stage + 1 });
      if (s.screen === 'result' && s.result) {
        faTrack('assessment_completed', {
          persona: s.result.persona, primary_focus_area: s.result.primaryFocusArea,
          secondary_focus_area: s.result.secondaryFocusArea, close_result: s.result.isCloseResult,
        });
      }
    }, [viewKey]);

    function announce(text) {
      var el = liveRef.current;
      if (!el) return;
      el.textContent = '';
      setTimeout(function () { el.textContent = text; }, 30);
    }

    var act = {
      dispatch: dispatch,
      announce: announce,
      next: function () { dispatch({ type: 'NEXT', now: new Date().toISOString() }); },
      back: function () { clearTimeout(timerRef.current); lockRef.current = false; dispatch({ type: 'BACK' }); },
      // Single-choice screens advance on their own, after a beat.
      choose: function (action) {
        if (lockRef.current) return;
        lockRef.current = true;
        dispatch(action);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(function () {
          dispatch({ type: 'NEXT', now: new Date().toISOString() });
          lockRef.current = false;
        }, ADVANCE_MS);
      },
    };

    var body;
    if (s.screen === 'result' && s.result) {
      body = e(Result, {
        result: s.result, headRef: headRef,
        onBack: act.back,
        onRestart: function () { faTrack('assessment_restarted'); safeClear(); dispatch({ type: 'START' }); },
      });
    } else if (s.screen === 'flow') {
      body = e('div', { className: 'fa-page' },
        e(Progress, { steps: steps, index: s.step }),
        e('div', { key: step.key, className: 'fa-step ' + (s.dir < 0 ? 'fa-step--back' : 'fa-step--fwd') },
          e(StepView, { state: s, step: step, act: act, headRef: headRef }),
          step.kind !== 'problems' ? e(Nav, { onBack: act.back }) : null));
    } else {
      body = e(Intro, {
        state: s,
        onStart: function () { faTrack('assessment_started'); safeClear(); dispatch({ type: 'START' }); },
        onResume: function () { faTrack('assessment_resumed'); dispatch({ type: 'RESUME' }); },
        onShowResult: function () { dispatch({ type: 'SHOW_RESULT' }); },
      });
    }

    return e('div', { ref: rootRef, className: 'fa-root' },
      e('div', { ref: liveRef, className: 'fa-sr', 'aria-live': 'polite', role: 'status' }),
      body);
  }

  function renderFocusArea() {
    function App() {
      return e(React.Fragment, null,
        e(FocusAreaStyles),
        e(window.LegacyShell, { page: SLUG, lang: 'en', form: true, cta: false },
          e(FocusAreaAssessment, null)));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(e(App, null));
  }

  Object.assign(window, {
    FocusAreaAssessment: FocusAreaAssessment,
    renderFocusArea: renderFocusArea,
    faBuildSteps: buildSteps,
  });
})();
