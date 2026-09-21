// clarity-tools.jsx — reusable engine for the five Clarity Tools diagnostics.
// The DATA (questions, options, scores, dimension copy, brackets, result
// templates) lives in clarity-data.js (window.CLARITY_DATA). This file holds the
// generic, assessment-agnostic machinery:
//   • normalised 0–100 scoring with N/A handling and per-question weighting
//   • standard problem / positive-fit severity brackets
//   • one-question-at-a-time UI (starting screen → questions → email → result)
//   • the shared result hierarchy (addendum §11)
//   • owner/admin notification (EmailJS + Google Apps Script) reused from the
//     existing diagnostic, and gtag analytics events tagged with the slug.
//
// Scoring model
// -------------
// Every scored question maps to one dimension. Each option carries `s`, its
// contribution to that dimension's headline meaning:
//   • problem dimensions: higher s = stronger evidence of a problem
//   • positive-fit dimensions: higher s = stronger supporting evidence
// A question's normalised value = s / maxS(question), so questions with
// different option counts stay comparable. A dimension's 0–100 score is the
// weighted mean of its answered (non-N/A) questions' normalised values × 100.
// N/A answers are excluded from that dimension (calculated from valid items
// only). Overall scores are NOT blind averages — each assessment supplies its
// own compute() so weighting and dependencies (documented in clarity-data.js)
// are respected.

// Notification + sheet go through the shared path in lead-capture.js. The
// EmailJS template is unchanged — the tools still render through template_wdsrbdo
// with every field it already received; lead-capture only adds the subject,
// the standard header block and the flat keys the sheet reads.
const CLARITY_EMAILJS_TEMPLATE = 'template_wdsrbdo';
if (window.emailjs) { try { emailjs.init({ publicKey: 'bfBcHLXj2nKaev_lT' }); } catch (e) {} }

// ── Brackets ─────────────────────────────────────────────────────────────────
// Five bands with identical boundaries for both problem and positive-fit scales:
// 0–24, 25–44, 45–64, 65–79, 80–100.
function clarityBracket(score) {
  if (score == null || isNaN(score)) return 0;
  if (score <= 24) return 0;
  if (score <= 44) return 1;
  if (score <= 64) return 2;
  if (score <= 79) return 3;
  return 4;
}
// Default short labels shown beside a dimension score. Assessments may override
// via data.labels; these are the fallbacks.
const CLARITY_LABELS = {
  problem: ['Reasonably healthy', 'Some weakness', 'Meaningful problem', 'Strong signal', 'Very strong signal'],
  fit: ['Little supporting evidence', 'Limited evidence', 'Moderate evidence', 'Strong evidence', 'Very strong evidence'],
};

// ── Scoring helpers ──────────────────────────────────────────────────────────
function cMax(arr) { return arr.length ? Math.max.apply(null, arr) : 0; }
function cMean(arr) { return arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : 0; }
// Top-weighted blend: a single genuine bottleneck lifts the headline (0.6×max)
// while breadth still matters (0.4×mean). Matches the addendum's worked example
// (dims 28,41,82,37,61,34 → 0.6×82 + 0.4×47.2 ≈ 68).
function cTopWeighted(arr) { return arr.length ? (0.6 * cMax(arr) + 0.4 * cMean(arr)) : 0; }
function cClamp(n) { return Math.max(0, Math.min(100, n)); }
function cRound(n) { return Math.round(n); }

// Compute one dimension's raw 0–100 score from the current answers.
// Returns { score, valid, count } where valid = answered non-N/A questions.
function computeDimension(data, dimKey, answers) {
  var vals = [];
  var count = 0;
  data.questions.forEach(function (q) {
    if (q.context || q.dim !== dimKey) return;
    count++;
    var a = answers[q.id];
    if (a == null || a === 'na') return; // unanswered or N/A → excluded
    var opt = q.options[a];
    if (!opt) return;
    var maxS = cMax(q.options.map(function (o) { return o.s; }));
    if (maxS <= 0) return;
    var norm = opt.s / maxS; // 0..1
    var w = q.w != null ? q.w : 1;
    vals.push({ v: norm, w: w });
  });
  if (!vals.length) return { score: null, valid: 0, count: count };
  var wsum = vals.reduce(function (a, b) { return a + b.w; }, 0);
  var acc = vals.reduce(function (a, b) { return a + b.v * b.w; }, 0);
  return { score: cRound(cClamp((acc / wsum) * 100)), valid: vals.length, count: count };
}

// Build the full dims map for an assessment.
function computeDims(data, answers) {
  var dims = {};
  data.dimensions.forEach(function (d) {
    var r = computeDimension(data, d.key, answers);
    var idx = clarityBracket(r.score);
    var labels = (data.labels && data.labels[d.type]) || CLARITY_LABELS[d.type] || CLARITY_LABELS.problem;
    dims[d.key] = {
      key: d.key, label: d.label, type: d.type, group: d.group || null,
      show: d.show !== false, minValid: d.minValid || 1,
      score: r.score, valid: r.valid, count: r.count,
      bracket: idx, labelShort: labels[idx],
      copy: d.copy ? d.copy[idx] : '',
      lowConfidence: r.score != null && r.valid < (d.minValid || 1),
      answered: r.score != null,
    };
  });
  return dims;
}

// Engine helpers exposed to each assessment's compute()/interpret() functions.
function clarityHelpers(dims) {
  return {
    b: clarityBracket,
    mean: cMean, max: cMax, topWeighted: cTopWeighted, clamp: cClamp, round: cRound,
    get: function (key) { return dims[key]; },
    score: function (key) { return dims[key] ? dims[key].score : null; },
    // dimension objects matching a filter, sorted by score descending
    sortedBy: function (filter) {
      return Object.keys(dims).map(function (k) { return dims[k]; })
        .filter(function (d) { return d.answered && (!filter || filter(d)); })
        .sort(function (a, b) { return b.score - a.score; });
    },
    labelShort: function (type, idx) { return (CLARITY_LABELS[type] || CLARITY_LABELS.problem)[idx]; },
  };
}

// Full scoring pass → everything the result page and owner email need.
function clarityScore(data, answers) {
  var dims = computeDims(data, answers);
  var H = clarityHelpers(dims);
  function headline(cfg) {
    if (!cfg) return null;
    var raw = cfg.compute ? cfg.compute({ dims: dims, answers: answers, H: H }) : 0;
    var score = cRound(cClamp(raw));
    var idx = clarityBracket(score);
    var br = cfg.brackets[idx] || { label: '', desc: '' };
    return {
      key: cfg.key, name: cfg.name, meaning: cfg.meaning, type: cfg.type || 'problem',
      unit: cfg.unit || '/100', score: score, bracket: idx,
      bracketLabel: br.label, bracketDesc: br.desc, followNote: cfg.followNote || null,
    };
  }
  var overall = headline(data.overall);
  var overall2 = headline(data.overall2);
  var ctx = { slug: data.slug, data: data, answers: answers, dims: dims, overall: overall, overall2: overall2, H: H };
  var out = data.interpret ? data.interpret(ctx, H) : {};
  return { dims: dims, overall: overall, overall2: overall2, interp: out, ctx: ctx };
}

// ── Analytics (gtag) — slug on every event; no answer text leaves the page ────
function clarityTrack(name, params) {
  try { if (window.gtag) window.gtag('event', name, params || {}); } catch (e) {}
}

// ── Owner/admin notification — reuses the existing EmailJS + Sheet pipeline ────
function clarityBuildReport(data, answers, result) {
  var L = [];
  var line = function (s) { L.push(s == null ? '' : s); };
  // Tool name, person, page and timestamp are supplied by the shared header
  // block in lead-capture.js, so the report starts at the result itself.
  line('── PRIMARY RESULT ──');
  line(result.interp.primary || '—');
  line('');
  var head = function (h) { if (!h) return; line(h.name + ': ' + h.score + h.unit + ' — ' + h.bracketLabel); };
  line('── HEADLINE SCORES ──');
  head(result.overall);
  head(result.overall2);
  line('');
  if (result.interp.secondary) { line('── SECONDARY RESULT ──'); line(result.interp.secondary); line(''); }
  if (result.interp.modifiers && result.interp.modifiers.length) {
    line('── MODIFIERS ──');
    result.interp.modifiers.forEach(function (m) { line('• ' + m); });
    line('');
  }
  line('── DIMENSION SCORES (0–100) ──');
  data.dimensions.forEach(function (d) {
    var dm = result.dims[d.key];
    if (!dm) return;
    var s = dm.score == null ? 'n/a (excluded)' : (dm.score + '/100 — ' + dm.labelShort);
    line(d.label + ': ' + s + '  (' + dm.valid + '/' + dm.count + ' answered' + (dm.lowConfidence ? ', low confidence' : '') + ')');
  });
  line('');
  line('── ALL ANSWERS (verbatim) ──');
  data.questions.forEach(function (q, i) {
    var a = answers[q.id];
    var ansTxt;
    if (a === 'na') ansTxt = 'N/A';
    else if (a == null) ansTxt = '—';
    else ansTxt = (q.options[a] ? q.options[a].t : '—');
    line((i + 1) + '. ' + q.text);
    line('   → ' + ansTxt + (q.dim ? '  [' + q.dim + (q.options[a] && a !== 'na' ? ', s=' + q.options[a].s : '') + ']' : '  [context]'));
  });
  return L.join('\n');
}

function claritySubmit(data, answers, result, person, done) {
  var report = clarityBuildReport(data, answers, result);
  var secondaryTxt = result.overall2 ? (result.overall2.name + ': ' + result.overall2.score + result.overall2.unit + ' — ' + result.overall2.bracketLabel) : (result.interp.secondary || '—');
  var gradeTxt = result.overall ? (result.overall.name + ': ' + result.overall.score + result.overall.unit + ' — ' + result.overall.bracketLabel) : (data.emailName + ' submission');
  var breakdown = data.dimensions.map(function (d) {
    var dm = result.dims[d.key];
    if (!dm) return null;
    return d.label + ': ' + (dm.score == null ? 'n/a' : dm.score + '/100 — ' + dm.labelShort);
  }).filter(Boolean).join('\n');
  if (typeof window !== 'undefined' && typeof window.submitLead === 'function') {
    window.submitLead({
      source: 'clarity-tool',
      detail: data.slug,
      detailLabel: data.title,
      name: person.name || '',
      email: person.email,
      notes: (result.interp.primary || gradeTxt),
      body: report,
      template: CLARITY_EMAILJS_TEMPLATE,
      // Everything template_wdsrbdo already rendered, spelled exactly as before.
      params: {
        overall_grade: gradeTxt,
        overall_score: (result.interp.primary || ''),
        section_breakdown: secondaryTxt + '\n\n' + breakdown,
        all_answers: report,
      },
    }, function () { done(); });
  } else { done(); }
}

// ── Visual tokens (mirrors the existing diagnostic's palette) ─────────────────
var CL_ACC = '#047857';
// Restrained severity colours for the breakdown bars. Problem scale runs
// green→red; the positive-fit scale is reversed so green always reads "good".
var CL_TONES = ['#047857', '#047857', '#B7791F', '#C05621', '#9B2C2C'];
function toneFor(type, bracketIdx) {
  var idx = type === 'fit' ? (4 - bracketIdx) : bracketIdx;
  return CL_TONES[idx];
}

function clarityStyles(mob) {
  return {
    page: { maxWidth: 820, margin: '0 auto', padding: mob ? '1.75rem 1.25rem 5rem' : '3.5rem 2.5rem 6rem', color: '#3A403A', fontFamily: 'inherit' },
    eyebrow: { fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6A6F67', lineHeight: 1.6 },
    h1: { fontFamily: 'var(--font-heading)', fontSynthesis: 'none', fontSize: mob ? '30px' : '44px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-.035em', color: '#3A403A', margin: '0 0 1.25rem' },
    p: { margin: '0 0 1.2rem', lineHeight: 1.7, fontSize: mob ? '17px' : '18px', color: '#3A403A' },
    note: { fontSize: '14px', color: '#6A6F67', lineHeight: 1.7 },
    qText: { fontFamily: 'var(--font-heading)', fontSynthesis: 'none', fontSize: mob ? '23px' : '30px', fontWeight: 750, lineHeight: 1.2, letterSpacing: '-.02em', color: '#3A403A', margin: '0 0 1.6rem' },
    cta: { fontFamily: 'inherit', fontWeight: 700, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#F3F0E8', background: CL_ACC, border: '1.5px solid ' + CL_ACC, borderRadius: '2px', padding: '.9rem 1.7rem', display: 'inline-block', cursor: 'pointer', textDecoration: 'none' },
    ctaSec: { background: 'transparent', color: '#3A403A', border: '1.5px solid rgba(23,25,25,.35)' },
    choice: function (sel) { return { width: '100%', textAlign: 'left', border: '0', borderLeft: sel ? '2px solid ' + CL_ACC : '2px solid transparent', borderBottom: '1px solid rgba(23,25,25,.14)', padding: mob ? '.95rem .6rem .95rem 1rem' : '1rem .6rem 1rem 1.1rem', borderRadius: '0', background: 'transparent', color: sel ? CL_ACC : '#3A403A', fontWeight: sel ? 700 : 400, fontFamily: 'inherit', fontSize: mob ? '15.5px' : '16.5px', lineHeight: 1.5, cursor: 'pointer', marginBottom: '0', transition: 'border-color .12s, color .12s', display: 'block' }; },
    naChoice: function (sel) { return { width: '100%', textAlign: 'left', border: '0', borderLeft: sel ? '2px solid ' + CL_ACC : '2px solid transparent', borderTop: '1px solid rgba(23,25,25,.14)', padding: mob ? '.8rem .6rem .8rem 1rem' : '.85rem .6rem .85rem 1.1rem', borderRadius: '0', background: 'transparent', color: sel ? CL_ACC : '#6A6F67', fontWeight: sel ? 700 : 400, fontFamily: 'inherit', fontSize: '15px', lineHeight: 1.5, cursor: 'pointer', marginTop: '.5rem', transition: 'border-color .12s, color .12s', display: 'block' }; },
    field: { width: '100%', border: '0', borderBottom: '1px solid rgba(23,25,25,.28)', padding: '.85rem .2rem', borderRadius: '0', background: 'transparent', color: '#171919', fontFamily: 'inherit', fontSize: '16px', lineHeight: 1.6, outline: 'none' },
    progLine: { height: '1px', background: 'rgba(23,25,25,.18)', borderRadius: '0', marginTop: '.7rem' },
    progFill: function (pct) { return { height: '1px', background: CL_ACC, width: pct + '%', borderRadius: '0', transition: 'width .25s ease' }; },
  };
}

// ── UI: one question at a time ────────────────────────────────────────────────
function ClarityProgress({ i, total, C }) {
  var pct = Math.round(((i + 1) / total) * 100);
  return React.createElement('div', { style: { marginBottom: '2rem' } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '1rem' } },
      React.createElement('p', { style: C.eyebrow }, 'Question ' + (i + 1) + ' of ' + total),
      React.createElement('p', { style: C.eyebrow }, pct + '% complete')),
    React.createElement('div', { style: C.progLine }, React.createElement('div', { style: C.progFill(pct) })));
}

// A restrained horizontal bar for a scored dimension in the breakdown.
function ClarityBar({ dim, C }) {
  if (dim.score == null) {
    return React.createElement('div', { style: { marginBottom: '1.4rem' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '.35rem' } },
        React.createElement('span', { style: { fontSize: '15px', fontWeight: 600, color: '#3A403A' } }, dim.label),
        React.createElement('span', { style: { fontSize: '13px', color: '#6A6F67' } }, 'Not enough answers')),
      React.createElement('p', { style: { fontSize: '14px', color: '#6A6F67', lineHeight: 1.55, margin: '.15rem 0 0' } }, 'You marked this area as not applicable, so it is excluded from the result.'));
  }
  var tone = toneFor(dim.type, dim.bracket);
  return React.createElement('div', { style: { marginBottom: '1.5rem' } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '.4rem' } },
      React.createElement('span', { style: { fontSize: '15.5px', fontWeight: 600, color: '#3A403A' } }, dim.label),
      React.createElement('span', { style: { fontSize: '14px', fontWeight: 700, color: tone, whiteSpace: 'nowrap' } }, dim.score + '/100 · ' + dim.labelShort)),
    React.createElement('div', { style: { height: '8px', background: 'rgba(23,25,25,.09)', borderRadius: '999px', overflow: 'hidden' } },
      React.createElement('div', { style: { height: '8px', width: dim.score + '%', background: tone, borderRadius: '999px', transition: 'width .4s ease' } })),
    dim.copy ? React.createElement('p', { style: { fontSize: '14.5px', color: '#3A403A', lineHeight: 1.55, margin: '.5rem 0 0' } }, dim.copy) : null,
    dim.lowConfidence ? React.createElement('p', { style: { fontSize: '13px', color: '#6A6F67', lineHeight: 1.5, margin: '.3rem 0 0', fontStyle: 'italic' } }, 'Based on few answers, so read this as a weaker signal.') : null);
}

// A headline score block (overall, or a paired headline like fit / readiness).
function ClarityHeadline({ head, C, compact }) {
  if (!head) return null;
  var tone = toneFor(head.type, head.bracket);
  return React.createElement('div', { style: { border: '1px solid rgba(23,25,25,.14)', borderLeft: '3px solid ' + tone, borderRadius: '10px', padding: compact ? '1.1rem 1.2rem' : '1.4rem 1.5rem', background: '#F3F0E8', marginBottom: compact ? 0 : '1rem', flex: compact ? 1 : 'none', minWidth: 0 } },
    React.createElement('div', { style: { fontSize: '12px', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: '#6A6F67', marginBottom: '.5rem' } }, head.name),
    React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '.5rem', flexWrap: 'wrap' } },
      React.createElement('span', { style: { fontFamily: 'var(--font-heading)', fontSize: compact ? '34px' : '44px', fontWeight: 800, letterSpacing: '-.03em', color: '#3A403A', lineHeight: 1 } }, head.score),
      React.createElement('span', { style: { fontSize: '16px', color: '#6A6F67', fontWeight: 600 } }, head.unit)),
    React.createElement('div', { style: { fontSize: '15px', fontWeight: 700, color: tone, margin: '.5rem 0 .15rem' } }, head.bracketLabel),
    head.meaning ? React.createElement('p', { style: { fontSize: '13px', color: '#6A6F67', lineHeight: 1.5, margin: '.3rem 0 0' } }, head.meaning) : null,
    (!compact && head.bracketDesc) ? React.createElement('p', { style: { fontSize: '15px', color: '#3A403A', lineHeight: 1.6, margin: '.6rem 0 0' } }, head.bracketDesc) : null,
    head.followNote ? React.createElement('p', { style: { fontSize: '13.5px', color: '#9B2C2C', lineHeight: 1.5, margin: '.6rem 0 0', fontWeight: 600 } }, head.followNote) : null);
}

function ClaritySection({ title, children, C }) {
  return React.createElement('div', { style: { marginTop: '2.6rem' } },
    React.createElement('h3', { style: { fontFamily: 'var(--font-heading)', fontSize: '13px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: CL_ACC, margin: '0 0 .9rem' } }, title),
    children);
}

function clarityList(items, C) {
  return React.createElement('ul', { style: { margin: 0, paddingLeft: '1.1rem' } },
    items.map(function (it, i) { return React.createElement('li', { key: i, style: { fontSize: '16px', color: '#3A403A', lineHeight: 1.65, marginBottom: '.5rem' } }, it); }));
}

// ── Result page ───────────────────────────────────────────────────────────────
function ClarityResult({ data, result, C, mob }) {
  var interp = result.interp;
  var shown = data.dimensions.filter(function (d) { return d.show !== false; }).map(function (d) { return result.dims[d.key]; }).filter(Boolean);
  var twoHead = result.overall && result.overall2;
  return React.createElement('div', null,
    React.createElement('div', { style: { ...C.eyebrow, color: CL_ACC, marginBottom: '.8rem' } }, data.intro.eyebrow),
    // 1. Your result
    React.createElement('h1', { style: C.h1 }, 'Your result'),
    React.createElement('p', { style: { ...C.p, fontSize: mob ? '19px' : '21px', fontWeight: 600, color: '#171919' } }, interp.primary),
    interp.secondary ? React.createElement('p', { style: { ...C.p, color: '#3A403A' } }, interp.secondary) : null,
    // 2. Overall score(s)
    twoHead
      ? React.createElement('div', { style: { display: 'flex', gap: '1rem', flexDirection: mob ? 'column' : 'row', margin: '1.6rem 0 .4rem' } },
          React.createElement(ClarityHeadline, { head: result.overall, C: C, compact: true }),
          React.createElement(ClarityHeadline, { head: result.overall2, C: C, compact: true }))
      : React.createElement('div', { style: { margin: '1.6rem 0 .4rem' } }, React.createElement(ClarityHeadline, { head: result.overall, C: C })),
    twoHead && result.overall.bracketDesc ? React.createElement('p', { style: { fontSize: '15px', color: '#3A403A', lineHeight: 1.6, margin: '1rem 0 0' } }, result.overall.bracketDesc) : null,
    twoHead && result.overall2 && result.overall2.bracketDesc ? React.createElement('p', { style: { fontSize: '15px', color: '#3A403A', lineHeight: 1.6, margin: '.5rem 0 0' } }, result.overall2.bracketDesc) : null,
    // 3. What is driving the score
    (interp.driving && interp.driving.length) ? React.createElement(ClaritySection, { title: 'What is driving the score', C: C }, clarityList(interp.driving, C)) : null,
    // 4. Your breakdown — grouped when the assessment defines groups, else flat.
    React.createElement(ClaritySection, { title: 'Your breakdown', C: C },
      (data.breakdownGroups && data.breakdownGroups.length)
        ? data.breakdownGroups.map(function (g, gi) {
            return React.createElement('div', { key: gi, style: { marginBottom: '1.6rem' } },
              React.createElement('h4', { style: { fontSize: '14px', fontWeight: 700, color: '#3A403A', margin: '0 0 .2rem' } }, g.title),
              g.note ? React.createElement('p', { style: { fontSize: '13px', color: '#6A6F67', lineHeight: 1.5, margin: '0 0 .9rem' } }, g.note) : null,
              g.keys.map(function (k) { return result.dims[k] ? React.createElement(ClarityBar, { key: k, dim: result.dims[k], C: C }) : null; }));
          })
        : React.createElement('div', null,
            React.createElement('p', { style: { fontSize: '13.5px', color: '#6A6F67', lineHeight: 1.5, margin: '-.3rem 0 1.1rem' } }, data.breakdownNote || (result.overall && result.overall.type === 'fit' ? 'Higher scores mean more supporting evidence.' : 'Higher scores mean stronger evidence of a problem in that area.')),
            shown.map(function (dm) { return React.createElement(ClarityBar, { key: dm.key, dim: dm, C: C }); }))),
    // 5. What looks healthy
    (interp.healthy && interp.healthy.length) ? React.createElement(ClaritySection, { title: 'What looks healthy', C: C }, clarityList(interp.healthy, C)) : null,
    // 6. What else matters
    interp.elseMatters ? React.createElement(ClaritySection, { title: 'What else matters', C: C },
      Array.isArray(interp.elseMatters) ? clarityList(interp.elseMatters, C) : React.createElement('p', { style: { fontSize: '16px', color: '#3A403A', lineHeight: 1.65, margin: 0 } }, interp.elseMatters)) : null,
    // 7. The part worth challenging
    interp.challenge ? React.createElement(ClaritySection, { title: 'The part worth challenging', C: C },
      React.createElement('p', { style: { fontSize: '16px', color: '#3A403A', lineHeight: 1.65, margin: 0, paddingLeft: '.9rem', borderLeft: '2px solid ' + CL_ACC } }, interp.challenge)) : null,
    // 8. What to test next
    (interp.testNext && interp.testNext.length) ? React.createElement(ClaritySection, { title: 'What to test next', C: C }, clarityList(interp.testNext, C)) : null,
    // 9. Important context
    interp.context ? React.createElement(ClaritySection, { title: 'Important context', C: C },
      React.createElement('p', { style: { fontSize: '15px', color: '#3A403A', lineHeight: 1.65, margin: 0 } }, interp.context)) : null,
    // 10. Want another perspective?
    React.createElement('div', { style: { marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(23,25,25,.14)' } },
      React.createElement('h3', { style: { fontFamily: 'var(--font-heading)', fontSize: mob ? '22px' : '26px', fontWeight: 800, letterSpacing: '-.02em', color: '#3A403A', margin: '0 0 .6rem' } }, data.cta.heading),
      React.createElement('p', { style: { ...C.p, marginBottom: '1.3rem' } }, data.cta.sub),
      React.createElement('a', { href: data.cta.href, className: 'cta-btn', style: C.cta }, data.cta.label)));
}

// ── Root component ────────────────────────────────────────────────────────────
function ClarityTool({ slug }) {
  var React_ = React;
  var useState = React_.useState, useEffect = React_.useEffect, useRef = React_.useRef;
  var data = (window.CLARITY_DATA || {})[slug];
  var mob = typeof window !== 'undefined' && window.innerWidth < 768;
  var C = clarityStyles(mob);
  var total = data ? data.questions.length : 0;

  var storeKey = 'clarity:' + slug;
  var load = function () {
    try { var raw = sessionStorage.getItem(storeKey); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
  };
  var initial = load();
  var [screen, setScreen] = useState('intro'); // 'intro' | qIndex | 'email' | 'result'
  var [answers, setAnswers] = useState(initial.answers || {});
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [sending, setSending] = useState(false);
  var [err, setErr] = useState('');
  var [result, setResult] = useState(null);

  var scrollTop = function () {
    var s = typeof document !== 'undefined' && document.getElementById('main-scroll');
    if (s) s.scrollTop = 0;
    if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0);
  };
  useEffect(function () { scrollTop(); }, [screen]);
  // Persist answers as the user progresses (survives an accidental refresh).
  useEffect(function () {
    try { sessionStorage.setItem(storeKey, JSON.stringify({ answers: answers })); } catch (e) {}
  }, [answers]);

  if (!data) return React.createElement('div', { style: C.page }, React.createElement('p', null, 'Assessment not found.'));

  var go = function (s) { setScreen(s); scrollTop(); };

  var start = function () { clarityTrack('assessment_started', { assessment: slug }); go(0); };

  var choose = function (q, i, optIndex) {
    setAnswers(function (a) { var n = Object.assign({}, a); n[q.id] = optIndex; return n; });
    clarityTrack('assessment_question_progress', { assessment: slug, question: i + 1, total: total });
    // Advance: next question, or the email gate after the last one.
    if (i + 1 < total) { go(i + 1); }
    else { clarityTrack('assessment_completed', { assessment: slug }); go('email'); }
  };

  var back = function (i) { if (i === 0) go('intro'); else go(i - 1); };

  var submit = function () {
    var em = (email || '').trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!valid) { setErr('Please enter a valid email so we can send your result.'); return; }
    setErr('');
    setSending(true);
    clarityTrack('email_submitted', { assessment: slug });
    var res = clarityScore(data, answers);
    var person = { name: (name || '').trim(), email: em };
    claritySubmit(data, answers, res, person, function () {
      setSending(false);
      setResult(res);
      clarityTrack('result_generated', { assessment: slug, overall_bracket: res.overall ? res.overall.bracket : null, primary: res.interp.primaryKey || null });
      try { sessionStorage.removeItem(storeKey); } catch (e) {}
      go('result');
    });
  };

  // ---- Intro / starting screen ----
  if (screen === 'intro') {
    return React.createElement('div', { style: C.page },
      React.createElement('div', { style: { ...C.eyebrow, color: CL_ACC, marginBottom: '1rem' } }, data.intro.eyebrow),
      React.createElement('h1', { style: C.h1 }, data.title),
      data.intro.paras.map(function (p, i) { return React.createElement('p', { key: i, style: C.p }, p); }),
      data.intro.note ? React.createElement('p', { style: { fontSize: '15px', color: '#3A403A', lineHeight: 1.6, margin: '0 0 1.4rem', paddingLeft: '.9rem', borderLeft: '2px solid ' + CL_ACC, fontWeight: 600 } }, data.intro.note) : null,
      React.createElement('p', { style: { ...C.note, marginBottom: '.4rem' } }, data.intro.count + (data.intro.time ? ' · ' + data.intro.time : '')),
      React.createElement('p', { style: { ...C.note, marginBottom: '2rem' } }, 'No email is needed to begin. You will be asked for one at the end to receive your result.'),
      React.createElement('button', { className: 'cta-btn', style: C.cta, onClick: start }, data.intro.start));
  }

  // ---- Question screens ----
  if (typeof screen === 'number') {
    var i = screen;
    var q = data.questions[i];
    var sel = answers[q.id];
    return React.createElement('div', { style: C.page },
      React.createElement(ClarityProgress, { i: i, total: total, C: C }),
      React.createElement('p', { style: C.qText }, q.text),
      q.options.map(function (o, oi) {
        var on = sel === oi;
        return React.createElement('button', { key: oi, className: 'opt-btn', style: C.choice(on), onClick: function () { choose(q, i, oi); } }, o.t);
      }),
      q.na ? React.createElement('button', { className: 'opt-btn', style: C.naChoice(sel === 'na'), onClick: function () { choose(q, i, 'na'); } }, q.naText || 'Not applicable to me') : null,
      React.createElement('div', { style: { marginTop: '1.8rem' } },
        React.createElement('button', { className: 'cta-btn', style: { ...C.cta, ...C.ctaSec }, onClick: function () { back(i); } }, '← Back')));
  }

  // ---- Email capture ----
  if (screen === 'email') {
    return React.createElement('div', { style: C.page },
      React.createElement(ClarityProgress, { i: total - 1, total: total, C: C }),
      React.createElement('h2', { style: { ...C.h1, fontSize: mob ? '26px' : '34px' } }, 'Your answers are ready'),
      React.createElement('p', { style: C.p }, 'Enter your email to see your result. A copy of your breakdown is also sent to Aggelos, who reviews these himself.'),
      React.createElement('div', { style: { marginBottom: '1.1rem' } },
        React.createElement('label', { style: { ...C.eyebrow, display: 'block', marginBottom: '.5rem' } }, 'First name (optional)'),
        React.createElement('input', { type: 'text', value: name, onChange: function (e) { setName(e.target.value); }, style: C.field })),
      React.createElement('div', { style: { marginBottom: '1.3rem' } },
        React.createElement('label', { style: { ...C.eyebrow, display: 'block', marginBottom: '.5rem' } }, 'Email'),
        React.createElement('input', { type: 'email', value: email, onChange: function (e) { setEmail(e.target.value); }, placeholder: 'you@example.com', style: C.field, onKeyDown: function (e) { if (e.key === 'Enter') submit(); } })),
      err ? React.createElement('p', { style: { color: '#c0392b', fontSize: '14px', margin: '0 0 1rem' } }, err) : null,
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '1rem' } },
        React.createElement('button', { className: 'cta-btn', style: { ...C.cta, ...C.ctaSec }, onClick: function () { go(total - 1); } }, '← Back'),
        React.createElement('button', { className: 'cta-btn', style: { ...C.cta, opacity: sending ? 0.5 : 1 }, disabled: sending, onClick: submit }, sending ? 'Working…' : 'See my result →')),
      React.createElement('p', { style: { fontSize: '13px', color: '#6A6F67', lineHeight: 1.6, marginTop: '1.4rem' } }, 'Your individual answers are not sent to analytics. They go only to the result you see and to the private notification Aggelos receives.'));
  }

  // ---- Result ----
  if (screen === 'result' && result) {
    return React.createElement('div', { style: C.page }, React.createElement(ClarityResult, { data: data, result: result, C: C, mob: mob }));
  }
  return null;
}

Object.assign(window, {
  ClarityTool: ClarityTool,
  clarityScore: clarityScore,
  clarityBracket: clarityBracket,
  computeDims: computeDims,
});
