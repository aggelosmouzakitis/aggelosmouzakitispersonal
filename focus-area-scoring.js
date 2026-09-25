// focus-area-scoring.jsx — how "Find Your Focus Area" turns answers into a result.
//
// Deterministic and transparent: no AI call, no randomness, no hidden state.
// FA_SCORING below is the single configuration for every weight, mapping and
// normalisation rule. The contextual option points live beside their options in
// focus-area-data.jsx (each answer option carries its own scoring metadata).
// Change the numbers in either place and the UI follows; no component needs to
// be rewritten.
//
// ── The model, step by step ─────────────────────────────────────────────────
// Every Focus Area ends up with a 0–100 constraint score: higher means a
// stronger indication that the area deserves attention right now.
//
// 1. Contextual layer (the four persona + problem questions)
//    For each area, over the questions actually answered:
//      earned   = points the chosen options gave the area
//      possible = for each question, the most points any of its options could
//                 have given the area, summed
//    A question with no option touching an area adds nothing to that area's
//    `possible`, so an area is never marked down for not being asked about.
//    Contextual score = (earned + K × PRIOR) / (possible + K)
//    This is earned/possible, pulled gently towards PRIOR when the evidence is
//    thin, so one isolated answer cannot produce an extreme score.
//
// 2. Universal layer (the fourteen statements, 1–5)
//    Each answer becomes a 0–1 constraint value:
//      positive statement ("I can…"):     (5 − answer) / 4   → "Not true" = 1
//      problem statement ("I tend to…"):  (answer − 1) / 4   → "True"     = 1
//    Universal score = weighted mean of the values mapped to the area, so an
//    area with two statements is on the same footing as one with four.
//
// 3. Combine the layers
//    score = (wC × contextual + wU × universal) / (wC + wU)
//      wU = 0.55 when the area has universal evidence, otherwise 0
//      wC = 0.45 × min(1, possible / FULL_EVIDENCE), otherwise 0
//    So with full evidence in both layers the split is 45% / 55%; an area with
//    only one layer (Strategy is contextual-only by design) uses that layer.
//
// 4. Repeated-pattern signal (u13)
//    p = 0 for "Not true" and "Rarely true", then 1/3, 2/3, 1 for "Sometimes",
//    "Mostly" and "True". When the same problems follow someone across jobs,
//    clients or projects, the environment explains less of it:
//      Environment × (1 − ENV_REDUCTION × p)
//    and the internal areas the contextual answers pointed to rise modestly:
//      + INTERNAL_BOOST × p × (area's contextual points / top internal area's)
//
// 5. Result
//    Round to whole numbers. Rank by the unrounded score (ties: stronger
//    contextual evidence, then the canonical Focus Area order). The top two
//    are primary and secondary. If their displayed scores are within
//    CLOSE_THRESHOLD points, the result is close.

var FA_SCORING = {
  version: 1,
  // Relative weight of the two diagnostic layers when both have evidence.
  layers: {
    contextual: 0.45,
    universal: 0.55
  },
  contextual: {
    prior: 0.25,
    // PRIOR: where a thinly evidenced area is pulled towards (0–1)
    priorWeight: 1.5,
    // K: how strongly, in points. Smaller = trust raw answers more
    fullEvidence: 4 // FULL_EVIDENCE: points of `possible` for the full 45% weight
  },
  universal: {
    scaleMin: 1,
    scaleMax: 5,
    // polarity 'positive': agreement is healthy, so "Not true" raises the score.
    // polarity 'problem':  agreement describes the problem, so "True" raises it.
    items: {
      u01: {
        polarity: 'positive',
        areas: {
          direction: 1
        }
      },
      u02: {
        polarity: 'positive',
        areas: {
          direction: 1
        }
      },
      u03: {
        polarity: 'positive',
        areas: {
          self_trust: 1
        }
      },
      u04: {
        polarity: 'problem',
        areas: {
          self_trust: 1
        }
      },
      u05: {
        polarity: 'positive',
        areas: {
          action: 1
        }
      },
      u06: {
        polarity: 'problem',
        areas: {
          action: 1
        }
      },
      // Discomfort / avoidance: shared, weighted slightly more towards Action.
      u07: {
        polarity: 'positive',
        areas: {
          action: 0.6,
          self_trust: 0.4
        }
      },
      u08: {
        polarity: 'problem',
        areas: {
          action: 0.6,
          self_trust: 0.4
        }
      },
      u09: {
        polarity: 'positive',
        areas: {
          relationships_boundaries: 1
        }
      },
      u10: {
        polarity: 'positive',
        areas: {
          relationships_boundaries: 1
        }
      },
      u11: {
        polarity: 'positive',
        areas: {
          capacity: 1
        }
      },
      u12: {
        polarity: 'positive',
        areas: {
          capacity: 1
        }
      },
      // Repeated-pattern signal: scores no area directly. See `pattern`.
      u13: {
        polarity: 'problem',
        areas: {}
      },
      u14: {
        polarity: 'problem',
        areas: {
          environment: 1
        }
      }
      // Strategy has no universal statement on purpose: a strategy only makes
      // sense relative to the actual problem, so the contextual layer decides it.
    }
  },
  pattern: {
    item: 'u13',
    noSignalAtOrBelow: 2,
    // "Rarely true" or less is not a repeated pattern
    environmentReduction: 0.35,
    // ENV_REDUCTION: at "True", Environment keeps 65%
    internalBoost: 8,
    // INTERNAL_BOOST: at "True", up to +8 points
    internalAreas: ['direction', 'action', 'self_trust', 'relationships_boundaries']
  },
  result: {
    closeThreshold: 5,
    // top two within this many points → isCloseResult
    lowSignalThreshold: 30 // primary below this → nothing stands out strongly
  }
};

// ── Engine ───────────────────────────────────────────────────────────────────
function faClamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function faRound3(n) {
  return n == null ? null : Math.round(n * 1000) / 1000;
}
function faOptionById(question, optionId) {
  for (var i = 0; i < question.options.length; i++) if (question.options[i].id === optionId) return question.options[i];
  return null;
}

// 0–1 constraint value for one universal answer.
function faUniversalValue(answer, polarity, cfg) {
  var span = cfg.scaleMax - cfg.scaleMin;
  var v = faClamp(Number(answer), cfg.scaleMin, cfg.scaleMax);
  return polarity === 'positive' ? (cfg.scaleMax - v) / span : (v - cfg.scaleMin) / span;
}
function faValidScaleAnswer(v, cfg) {
  return typeof v === 'number' && v >= cfg.scaleMin && v <= cfg.scaleMax && Math.round(v) === v;
}

// input: { persona, selectedProblems, primaryProblem, contextualAnswers,
//          universalAnswers, completedAt? }
// Returns the full result object. Pure: the same input always gives the same
// output, and nothing outside the arguments is read except the data + config.
function faScore(input, data, config) {
  var D = data || window.FOCUS_AREA_DATA;
  var S = config || FA_SCORING;
  var ids = D.FOCUS_AREAS.map(function (a) {
    return a.id;
  });
  var zero = function () {
    var m = {};
    ids.forEach(function (id) {
      m[id] = 0;
    });
    return m;
  };

  // 1. Contextual layer
  var questions = D.contextualQuestions(input.persona, input.primaryProblem);
  var earned = zero(),
    possible = zero();
  var contextualAnswers = {};
  questions.forEach(function (q) {
    var chosen = faOptionById(q, (input.contextualAnswers || {})[q.id]);
    if (!chosen) return;
    contextualAnswers[q.id] = chosen.id;
    ids.forEach(function (id) {
      var best = 0;
      q.options.forEach(function (o) {
        best = Math.max(best, o.points && o.points[id] || 0);
      });
      if (best <= 0) return;
      possible[id] += best;
      earned[id] += chosen.points && chosen.points[id] || 0;
    });
  });

  // 2. Universal layer
  var uSum = zero(),
    uWeight = zero();
  var universalAnswers = {};
  var patternP = 0;
  D.UNIVERSAL.forEach(function (item) {
    var v = (input.universalAnswers || {})[item.id];
    var cfg = S.universal.items[item.id];
    if (!cfg || !faValidScaleAnswer(v, S.universal)) return;
    universalAnswers[item.id] = v;
    var c = faUniversalValue(v, cfg.polarity, S.universal);
    if (item.id === S.pattern.item) {
      var floor = S.pattern.noSignalAtOrBelow;
      patternP = Math.max(0, v - floor) / (S.universal.scaleMax - floor);
    }
    Object.keys(cfg.areas).forEach(function (id) {
      uSum[id] += c * cfg.areas[id];
      uWeight[id] += cfg.areas[id];
    });
  });

  // 3. Combine
  var K = S.contextual.priorWeight,
    PRIOR = S.contextual.prior;
  var breakdown = {};
  ids.forEach(function (id) {
    var C = possible[id] > 0 ? (earned[id] + K * PRIOR) / (possible[id] + K) : null;
    var wC = C == null ? 0 : S.layers.contextual * Math.min(1, possible[id] / S.contextual.fullEvidence);
    var U = uWeight[id] > 0 ? uSum[id] / uWeight[id] : null;
    var wU = U == null ? 0 : S.layers.universal;
    var base = wC + wU > 0 ? (wC * (C || 0) + wU * (U || 0)) / (wC + wU) : 0;
    breakdown[id] = {
      contextualEarned: earned[id],
      contextualPossible: possible[id],
      contextual: C,
      contextualWeight: wC,
      universal: U,
      universalWeight: wU,
      base: base * 100,
      pattern: 0,
      score: 0
    };
  });

  // 4. Repeated-pattern signal
  if (patternP > 0) {
    var env = breakdown.environment;
    if (env) env.pattern = -env.base * S.pattern.environmentReduction * patternP;
    var topInternal = 0;
    S.pattern.internalAreas.forEach(function (id) {
      topInternal = Math.max(topInternal, earned[id] || 0);
    });
    if (topInternal > 0) {
      S.pattern.internalAreas.forEach(function (id) {
        if (breakdown[id]) breakdown[id].pattern = S.pattern.internalBoost * patternP * (earned[id] / topInternal);
      });
    }
  }

  // 5. Result
  var scores = {};
  ids.forEach(function (id) {
    var b = breakdown[id];
    b.score = faClamp(b.base + b.pattern, 0, 100);
    scores[id] = Math.round(b.score);
  });
  var evidenceRatio = function (id) {
    return possible[id] > 0 ? earned[id] / possible[id] : 0;
  };
  var ranking = ids.slice().sort(function (a, b) {
    var d = breakdown[b].score - breakdown[a].score;
    if (Math.abs(d) > 1e-9) return d;
    var e = evidenceRatio(b) - evidenceRatio(a);
    if (Math.abs(e) > 1e-9) return e;
    return ids.indexOf(a) - ids.indexOf(b);
  });
  var primary = ranking[0],
    secondary = ranking[1];

  // Round the breakdown for storage; the unrounded values have done their job.
  Object.keys(breakdown).forEach(function (id) {
    var b = breakdown[id];
    ['contextual', 'contextualWeight', 'universal', 'universalWeight', 'base', 'pattern', 'score'].forEach(function (k) {
      b[k] = faRound3(b[k]);
    });
  });
  return {
    assessment: D.slug,
    version: D.version + '.' + S.version,
    completedAt: input.completedAt || null,
    persona: input.persona,
    selectedProblems: (input.selectedProblems || []).slice(),
    primaryProblem: input.primaryProblem,
    contextualAnswers: contextualAnswers,
    universalAnswers: universalAnswers,
    focusAreaScores: scores,
    primaryFocusArea: primary,
    secondaryFocusArea: secondary,
    isCloseResult: scores[primary] - scores[secondary] <= S.result.closeThreshold,
    // Beyond the required fields: useful to later stages and to tuning.
    isLowSignal: scores[primary] < S.result.lowSignalThreshold,
    ranking: ranking,
    scoreBreakdown: breakdown
  };
}

// Everything answered? (The UI only calls faScore when this is true.)
function faIsComplete(input, data) {
  var D = data || window.FOCUS_AREA_DATA;
  if (!input || !D.persona(input.persona)) return false;
  var sel = input.selectedProblems || [];
  if (!sel.length || sel.length > D.PROBLEMS_QUESTION.max) return false;
  if (sel.indexOf(input.primaryProblem) < 0 || !D.problem(input.persona, input.primaryProblem)) return false;
  var qs = D.contextualQuestions(input.persona, input.primaryProblem);
  if (qs.length !== 4) return false;
  for (var i = 0; i < qs.length; i++) if (!faOptionById(qs[i], (input.contextualAnswers || {})[qs[i].id])) return false;
  for (var j = 0; j < D.UNIVERSAL.length; j++) {
    if (!faValidScaleAnswer((input.universalAnswers || {})[D.UNIVERSAL[j].id], FA_SCORING.universal)) return false;
  }
  return true;
}
if (typeof window !== 'undefined') {
  window.FA_SCORING = FA_SCORING;
  window.faScore = faScore;
  window.faIsComplete = faIsComplete;
}
