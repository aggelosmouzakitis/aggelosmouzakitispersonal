// clarity-data.jsx — content + scoring configuration for the five Clarity Tools.
// The engine (clarity-tools.js) is generic; everything assessment-specific lives
// here: questions, closed options with score values, dimension mappings,
// reverse-scoring (baked into each option's `s`), N/A rules, minimum valid-answer
// requirements, overall-score formulas + dependencies, problem/fit bracket copy,
// mixed-result rules, secondary modifiers, and result templates.
//
// Scoring direction (see clarity-tools.js for the full model):
//   • problem dimension: option `s` runs 0 (healthiest) → high (worst)
//   • positive-fit dimension: option `s` runs 0 (least support) → high (most)
// Options are authored in that order, so reverse-scoring is handled by the `s`
// values themselves rather than a global flag.

window.CLARITY_DATA = window.CLARITY_DATA || {};

// Short labels shown next to a dimension score, by scale type.
var CD_PROBLEM_LABELS = ['Reasonably healthy', 'Some weakness', 'Meaningful problem', 'Strong signal', 'Very strong signal'];
var CD_CONSTRAINT_LABELS = ['Reasonably healthy', 'Some weakness', 'Meaningful weakness', 'Strong constraint', 'Severe constraint'];
var CD_FIT_LABELS = ['Little supporting evidence', 'Limited evidence', 'Moderate evidence', 'Strong evidence', 'Very strong evidence'];

// ── Shared interpretation helpers ─────────────────────────────────────────────
function cdBracket(s) { if (s == null) return 0; if (s <= 24) return 0; if (s <= 44) return 1; if (s <= 64) return 2; if (s <= 79) return 3; return 4; }
// Eligible, answered problem dimensions sorted strongest-first.
function cdSorted(dims, keys, minScore) {
  return keys.map(function (k) { return dims[k]; })
    .filter(function (d) { return d && d.score != null && (minScore == null || d.score >= minScore); })
    .sort(function (a, b) { return b.score - a.score; });
}
// "Label (72/100): dimension copy" driving/health lines.
function cdLine(d) { return d.label + ' (' + d.score + '/100): ' + d.copy; }
// True when the top two are close enough that picking one would be false precision.
function cdNearTie(a, b, band) { return a && b && (a.score - b.score) <= (band == null ? 8 : band); }

/* ─────────────────────────────────────────────────────────────────────────────
 * ASSESSMENT 1 — What's limiting your business?  (business-constraint)
 * Overall: "Business constraint score" (problem) = 0.6×max + 0.4×weighted-mean
 * over the eight core dimensions (visibility excluded — it sets confidence, not
 * the finding). Dependency: with very few qualified opportunities (acquisition
 * ≥ 65), conversion evidence is thin, so conversion is down-weighted in the
 * overall and cannot be named the primary constraint.
 * ────────────────────────────────────────────────────────────────────────────*/
var A1_CORE = ['demand', 'offer', 'acquisition', 'conversion', 'retention', 'economics', 'capacity', 'ownerDependency'];
var A1_PRIMARY_SENTENCE = {
  demand: 'Your strongest business constraint appears to be demand.',
  offer: 'Your strongest business constraint appears to be your offer and positioning.',
  acquisition: 'Your strongest business constraint appears to be acquisition.',
  conversion: 'Your strongest business constraint appears to be conversion.',
  retention: 'Your strongest business constraint appears to be retention.',
  economics: 'Your strongest business constraint appears to be the economics of the core offer.',
  capacity: 'Your strongest business constraint appears to be delivery capacity.',
  ownerDependency: 'Owner dependency appears to be the main thing restricting growth.',
};
var A1_ACTIONS = {
  demand: ['Talk to 10 people in your target market and ask what they already pay for or do to solve this problem. You are testing whether the problem is real to them, not pitching.', 'Find one place where money already moves for this problem. If you cannot, that is the finding.'],
  offer: ['Write your offer as one sentence: who it is for, what changes, and the outcome. Show it to five people and ask them to explain it back.', 'If you are selling several things, pick the one with the best evidence and pause the rest for 60 days.'],
  acquisition: ['Pick one repeatable channel and commit to a fixed weekly volume of qualified outreach or content for four weeks. Measure qualified opportunities, not activity.', 'Track where every qualified opportunity in the last 90 days actually came from. Double down on the one that is not referrals.'],
  conversion: ['Review your last 10 lost deals and label each reason: price, timing, trust, fit, or no decision. Fix the most common one first.', 'Add a simple two-touch follow-up for every serious prospect who does not buy within a week.'],
  retention: ['Ask three past customers why they did or did not continue. Look for a pattern in the reasons.', 'Design one reason for customers to come back or continue before chasing new ones.'],
  economics: ['Rebuild the unit economics of your core offer with your own time costed at a market rate. Decide whether the price, the scope, or the delivery has to change.', 'Model the offer at a 20% higher price and test it with the next two qualified prospects.'],
  capacity: ['Identify the one delivery task that eats the most time and decide whether it can be templated, removed, or delegated.', 'Before adding sales, define what would break first at double the volume and fix that constraint.'],
  ownerDependency: ['List the parts of delivery only you can do, then pick one to document or hand off in the next 30 days.', 'Test whether one client outcome can be delivered with you reviewing rather than doing.'],
};
var A1_CHALLENGE = {
  demand: 'You may be assuming the problem is obvious to buyers because it is obvious to you. The evidence for real, paid demand is the thing to pressure-test first.',
  offer: 'It is worth asking whether spreading across several offers is a response to weak demand rather than a strength. Focus usually beats optionality here.',
  acquisition: 'Check whether you are relying on referrals and calling it a strategy. A channel you do not control is a risk, not a system.',
  conversion: 'Before blaming your pitch, confirm the prospects reaching you are genuinely qualified. Low conversion is sometimes an acquisition-quality problem wearing a conversion mask.',
  retention: 'It is worth asking whether you are funding growth by constantly replacing customers you could have kept.',
  economics: 'The offer may look profitable only because your own time is unpriced. That is a common and expensive blind spot.',
  capacity: 'Be honest about whether "no time to grow" is a capacity limit or a reluctance to change how delivery works.',
  ownerDependency: 'Being the person who does everything can feel like control. Here it reads more like the ceiling on the business.',
};

window.CLARITY_DATA['business-constraint'] = {
  slug: 'business-constraint',
  page: 'business-constraint',
  title: "What's limiting your business?",
  emailName: 'Clarity tool — Business constraint',
  labels: { problem: CD_CONSTRAINT_LABELS, fit: CD_FIT_LABELS },
  intro: {
    eyebrow: 'Clarity tools',
    paras: [
      'Your business can be stuck for very different reasons.',
      'This assessment looks at demand, positioning, acquisition, sales conversion, economics, retention and delivery capacity to identify which part of the business is most likely restricting growth right now.',
      "You'll get a breakdown of the strongest constraint, any secondary problems, and the parts of the business that currently look healthy.",
    ],
    count: '20 questions',
    start: 'Start assessment →',
  },
  cta: { heading: 'Want another perspective?', sub: 'If you want a second read on which constraint to work on first, a working session goes through your specific numbers and situation in depth.', label: 'Apply for a working session →', href: '/start-here/' },
  questions: [
    { id: 'q1', context: true, dim: null, text: 'Which best describes the business today?', options: [
      { t: 'A side project or idea I have not really sold yet', s: 0 },
      { t: 'A new business with its first customers', s: 0 },
      { t: 'An established business I want to grow', s: 0 },
      { t: 'A business that has plateaued or is declining', s: 0 },
    ] },
    { id: 'q2', dim: 'demand', text: 'In the last 90 days, how many customers who did not already know you personally paid for your core offer?', options: [
      { t: '10 or more', s: 0 }, { t: '4 to 9', s: 1 }, { t: '1 to 3', s: 2 }, { t: 'None', s: 3 },
    ] },
    { id: 'q3', dim: 'demand', text: 'How strong is your evidence that your target customers already spend money, time, or effort solving the problem you address?', options: [
      { t: 'Strong: I can point to what they currently pay for or do', s: 0 },
      { t: 'Moderate: some signs they try to solve it', s: 1 },
      { t: 'Weak: mostly my own assumption', s: 2 },
      { t: 'I am not sure they treat it as a problem worth solving', s: 3 },
    ] },
    { id: 'q4', dim: 'demand', text: 'How often do prospects recognise the problem as important before you explain why it matters?', options: [
      { t: 'Usually: they already see it as important', s: 0 },
      { t: 'Often', s: 1 },
      { t: 'Sometimes, once I frame it', s: 2 },
      { t: 'Rarely: I mostly have to convince them it matters', s: 3 },
    ] },
    { id: 'q5', dim: 'offer', text: 'Could a qualified prospect quickly understand what you sell, who it is for, and the outcome it provides?', options: [
      { t: 'Yes, in a sentence or two', s: 0 },
      { t: 'Mostly, with a little explanation', s: 1 },
      { t: 'Only after a longer conversation', s: 2 },
      { t: 'Not really, even I find it hard to state simply', s: 3 },
    ] },
    { id: 'q6', dim: 'offer', text: 'How many materially different services or offers are you actively trying to sell?', options: [
      { t: 'One clear core offer', s: 0 },
      { t: 'Two related offers', s: 1 },
      { t: 'Three or four', s: 2 },
      { t: 'Five or more, or it changes often', s: 3 },
    ] },
    { id: 'q7', dim: 'offer', text: 'When prospects compare you with alternatives, how often can they clearly explain why they would choose you?', options: [
      { t: 'Usually', s: 0 }, { t: 'Often', s: 1 }, { t: 'Sometimes', s: 2 }, { t: 'Rarely: I look interchangeable with others', s: 3 },
    ] },
    { id: 'q8', dim: 'acquisition', text: 'Roughly how many genuinely qualified new sales opportunities do you generate in a normal month?', options: [
      { t: 'More than enough for my goals', s: 0 },
      { t: 'About enough', s: 1 },
      { t: 'Fewer than I need', s: 2 },
      { t: 'Very few or none I can rely on', s: 3 },
    ] },
    { id: 'q9', dim: 'acquisition', text: 'How predictable is your main source of new business?', options: [
      { t: 'Predictable: I know roughly what each month brings', s: 0 },
      { t: 'Fairly predictable', s: 1 },
      { t: 'Unpredictable', s: 2 },
      { t: 'It mostly appears by luck', s: 3 },
    ] },
    { id: 'q10', dim: 'acquisition', text: 'If referrals stopped tomorrow, what would happen to your new-business generation?', options: [
      { t: 'Little impact: I have other reliable channels', s: 0 },
      { t: 'Some impact, but I would manage', s: 1 },
      { t: 'Serious impact', s: 2 },
      { t: 'It would mostly stop', s: 3 },
    ] },
    { id: 'q11', dim: 'conversion', text: 'Of genuinely qualified prospects who reach a sales conversation or proposal, roughly what percentage buy?', options: [
      { t: '50% or more', s: 0 }, { t: '30 to 49%', s: 1 }, { t: '15 to 29%', s: 2 }, { t: 'Under 15%', s: 3 },
    ] },
    { id: 'q12', dim: 'conversion', text: 'How often do qualified prospects disappear or decide to do nothing rather than choose you or a competitor?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Most of the time', s: 3 },
    ] },
    { id: 'q13', dim: 'conversion', text: 'How consistently do you follow up with serious prospects who do not buy immediately?', options: [
      { t: 'I have a reliable follow-up process', s: 0 },
      { t: 'I follow up, but not systematically', s: 1 },
      { t: 'I follow up once or twice then stop', s: 2 },
      { t: 'I rarely follow up', s: 3 },
    ] },
    { id: 'q14', dim: 'retention', na: true, naText: 'My business does not really have repeat purchases', text: 'If your business allows repeat purchases, renewals, or retainers, how often do customers buy from you again or continue working with you?', options: [
      { t: 'Most continue or buy again', s: 0 },
      { t: 'Many do', s: 1 },
      { t: 'Some do', s: 2 },
      { t: 'Few or none do', s: 3 },
    ] },
    { id: 'q15', dim: 'economics', text: 'After including the realistic market cost of your own delivery time, how profitable is your core offer?', options: [
      { t: 'Clearly profitable', s: 0 },
      { t: 'Modestly profitable', s: 1 },
      { t: 'Roughly break-even', s: 2 },
      { t: 'It loses money once my time is costed properly', s: 3 },
    ] },
    { id: 'q16', dim: 'economics', text: 'If you had to pay somebody competent at market rates to deliver the work you currently do yourself, what would happen to the profitability of the offer?', options: [
      { t: 'It would stay clearly profitable', s: 0 },
      { t: 'Profit would shrink but survive', s: 1 },
      { t: 'It would barely break even', s: 2 },
      { t: 'It would not be viable', s: 3 },
    ] },
    { id: 'q17', dim: 'capacity', text: 'If sales doubled next month, could you fulfil the additional work without quality deteriorating or your working hours becoming unreasonable?', options: [
      { t: 'Yes, comfortably', s: 0 },
      { t: 'Probably, with some strain', s: 1 },
      { t: 'Only by overworking', s: 2 },
      { t: 'No, delivery would break down', s: 3 },
    ] },
    { id: 'q18', dim: 'capacity', text: 'What proportion of your working week is currently consumed by delivering existing client or customer work?', options: [
      { t: 'Less than 40%', s: 0 }, { t: '40 to 59%', s: 1 }, { t: '60 to 79%', s: 2 }, { t: '80% or more', s: 3 },
    ] },
    { id: 'q19', dim: 'ownerDependency', text: 'How much of the value customers pay for can currently be delivered without your direct involvement?', options: [
      { t: 'Most of it', s: 0 }, { t: 'A fair amount', s: 1 }, { t: 'A little', s: 2 }, { t: 'Almost none: it depends on me', s: 3 },
    ] },
    { id: 'q20', dim: 'visibility', text: 'How clearly can you currently see the numbers that determine the health of the business, including qualified leads, conversion, revenue, margin, retention where relevant, and delivery capacity?', options: [
      { t: 'Clearly: I track them', s: 0 },
      { t: 'Mostly', s: 1 },
      { t: 'Only roughly', s: 2 },
      { t: 'I mostly go on feel', s: 3 },
    ] },
  ],
  dimensions: [
    { key: 'demand', label: 'Demand', type: 'problem', copy: [
      'There are clear signs that people already want and pay to solve this problem.',
      'Demand looks broadly present, with a few gaps in the evidence.',
      'The evidence that people actively want this is mixed, which may be limiting everything downstream.',
      'There is limited evidence of real demand, and weak demand tends to make every other problem worse.',
      'Demand looks like the foundation issue. Without clearer evidence that people want and pay for this, other fixes will underperform.',
    ] },
    { key: 'offer', label: 'Offer and positioning', type: 'problem', copy: [
      'Your offer and positioning read as clear and easy to choose.',
      'The offer is mostly clear, with some room to sharpen focus or differentiation.',
      'Positioning is doing only part of its job. Prospects may not quickly grasp what you sell or why you.',
      'The offer appears unclear or unfocused, which makes acquisition and conversion harder than they need to be.',
      'Positioning looks like a core constraint. Too many offers, or an unclear one, are diluting everything else.',
    ] },
    { key: 'acquisition', label: 'Acquisition', type: 'problem', copy: [
      'You appear to have a reasonably functioning way of generating qualified opportunities.',
      'Lead generation has some weaknesses, but it does not currently look like the main restriction.',
      'The volume or predictability of qualified opportunities appears to be limiting growth.',
      'Acquisition is a strong constraint. The business appears too dependent on inconsistent or insufficient opportunity generation.',
      'Acquisition is one of the clearest bottlenecks here. Too few qualified opportunities are entering the business consistently.',
    ] },
    { key: 'conversion', label: 'Conversion', type: 'problem', copy: [
      'When qualified prospects reach a real conversation, you convert them at a healthy rate.',
      'Conversion is broadly sound, with some slippage in follow-up or close.',
      'A meaningful share of qualified conversations are not turning into customers.',
      'Conversion is a strong drag. Qualified interest is reaching you but not becoming revenue.',
      'Conversion is one of the clearest problems here. Serious prospects are consistently not buying.',
    ] },
    { key: 'retention', label: 'Retention', type: 'problem', minValid: 1, copy: [
      'Customers who buy tend to stay or come back, which is a strong base to build on.',
      'Repeat business is reasonable, with some room to improve.',
      'Retention is patchy enough to matter for the economics of growth.',
      'Customers are not returning often, which forces acquisition to carry too much.',
      'Retention is a strong problem. The business appears to be refilling a leaking bucket.',
    ] },
    { key: 'economics', label: 'Economics', type: 'problem', copy: [
      'The core offer holds up once your time is costed at market rates.',
      'The economics work, but margins are thinner than is comfortable.',
      "Once your own time is priced properly, the offer's profitability is questionable.",
      'The economics are a strong constraint. The offer struggles to pay for the work it requires.',
      'Economics is one of the clearest problems. On a proper cost basis, the core offer may not be viable as built.',
    ] },
    { key: 'capacity', label: 'Delivery capacity', type: 'problem', copy: [
      'You have room to take on more without delivery breaking down.',
      'Capacity is mostly fine, though growth would start to create strain.',
      'Delivery load is high enough to limit how much new work you can absorb.',
      'Capacity is a strong constraint. Delivering existing work is crowding out growth.',
      'Capacity is one of the clearest problems. There is little room to grow without delivery failing or hours becoming unreasonable.',
    ] },
    { key: 'ownerDependency', label: 'Owner dependency', type: 'problem', minValid: 1, copy: [
      'The business can deliver much of its value without you personally, which supports growth.',
      'There is some reliance on you, but it is not yet the main limit.',
      'The business leans on you enough that scaling would concentrate more work on you.',
      'Owner dependency is a strong constraint. Growth mostly means more of your personal time.',
      'Owner dependency is one of the clearest problems. Almost nothing of value happens without you.',
    ] },
    { key: 'visibility', label: 'Visibility of the numbers', type: 'problem', minValid: 1, copy: [
      'You can see the numbers that matter, so this diagnosis rests on solid ground.',
      'You track most key numbers, which keeps this read fairly reliable.',
      'Some key numbers are estimated, so treat the result as directional.',
      'Because you mostly go on feel, this result is a starting hypothesis rather than a measurement. Better tracking would sharpen it.',
      'With little visibility into the numbers, treat everything here as provisional until you can measure it.',
    ] },
  ],
  overall: {
    key: 'business_constraint', name: 'Business constraint score', unit: '/100', type: 'problem',
    meaning: 'How much evidence exists that a fundamental part of the business is currently restricting growth.',
    compute: function (ctx) {
      var d = ctx.dims;
      var eligibleScores = [];
      var wvals = [];
      A1_CORE.forEach(function (k) {
        var dim = d[k]; if (!dim || dim.score == null) return;
        var w = 1;
        if (k === 'conversion' && d.acquisition && d.acquisition.score != null && d.acquisition.score >= 65) w = 0.4; // thin conversion evidence when almost no opportunities
        if (k === 'retention') w = 0.7; // single, sometimes-N/A signal
        wvals.push({ v: dim.score, w: w });
        if (w >= 0.5) eligibleScores.push(dim.score); // only reliable dims can be the "driver"
      });
      if (!wvals.length) return 0;
      var wsum = wvals.reduce(function (a, b) { return a + b.w; }, 0);
      var wmean = wvals.reduce(function (a, b) { return a + b.v * b.w; }, 0) / wsum;
      var mx = eligibleScores.length ? Math.max.apply(null, eligibleScores) : wmean;
      return 0.6 * mx + 0.4 * wmean;
    },
    brackets: [
      { label: 'No major constraint is obvious', desc: 'Your answers do not show a severe weakness across the core areas measured here. There may still be optimisation opportunities, but this assessment does not identify an obvious structural bottleneck.' },
      { label: 'Some friction, but no dominant constraint', desc: 'Several parts of the business could be stronger, but no single area clearly explains the current growth problem.' },
      { label: 'A meaningful constraint is present', desc: 'At least one part of the business appears weak enough to materially restrict growth.' },
      { label: 'A strong business constraint is present', desc: 'The pattern points clearly toward one or more fundamental bottlenecks.' },
      { label: 'The business has a severe bottleneck', desc: 'One or more areas show very strong evidence of restricting growth.' },
    ],
  },
  interpret: function (ctx, H) {
    var d = ctx.dims;
    // Eligibility: exclude visibility; exclude conversion when opportunities are scarce.
    var candidates = A1_CORE.slice();
    if (d.acquisition && d.acquisition.score != null && d.acquisition.score >= 65) candidates = candidates.filter(function (k) { return k !== 'conversion'; });
    var ranked = cdSorted(d, candidates);
    var top = ranked[0], second = ranked[1];
    var strongCount = ranked.filter(function (x) { return x.score >= 65; }).length;
    var out = { primaryKey: top ? top.key : null };
    var visN = d.visibility;

    if (!top || top.score < 45) {
      var weakest = ranked[0];
      out.primary = weakest && weakest.score >= 25
        ? 'No single area stands out as a structural constraint in your answers. The weakest area is ' + weakest.label.toLowerCase() + ', but the evidence does not point to a dominant bottleneck right now.'
        : 'There is no obvious structural constraint in your answers. The core parts of the business measured here look broadly functional.';
      out.driving = ranked.filter(function (x) { return x.score >= 25; }).slice(0, 2).map(cdLine);
    } else if (strongCount >= 4) {
      out.primary = 'Several constraints are interacting across the business. No single area is carrying the problem alone, which usually means the fundamentals need attention before any one fix will show.';
      out.driving = ranked.slice(0, 3).map(cdLine);
      out.mixedNote = true;
    } else if (cdNearTie(top, second) && second.score >= 45) {
      out.primary = 'Two areas stand out at similar strength: ' + top.label.toLowerCase() + ' and ' + second.label.toLowerCase() + '. They appear to be interacting rather than one clearly dominating.';
      out.driving = [top, second].map(cdLine);
      out.mixedNote = true;
    } else {
      out.primary = A1_PRIMARY_SENTENCE[top.key] + ' ' + (top.bracket >= 4 ? 'It is the clearest signal in your answers.' : 'It stands out above the healthier areas.');
      out.driving = ranked.filter(function (x) { return x.score >= 45; }).slice(0, 3).map(cdLine);
      if (!out.driving.length) out.driving = [cdLine(top)];
    }
    // What looks healthy — genuine low-problem dimensions (credibility).
    var healthy = cdSorted(d, A1_CORE).filter(function (x) { return x.score <= 24; }).sort(function (a, b) { return a.score - b.score; });
    out.healthy = healthy.slice(0, 3).map(cdLine);
    if (!out.healthy.length) out.healthy = ['No area scored in the healthy range. That does not mean everything is broken, but it does mean there is no clearly strong part of the business to lean on yet.'];
    // What else matters — secondary constraint, cross-signal, visibility caveat.
    var elseBits = [];
    if (top && top.score >= 45 && second && second.score >= 45 && !out.mixedNote) elseBits.push('A secondary constraint is present in ' + second.label.toLowerCase() + ' (' + second.score + '/100). Fixing the main constraint will expose it, so keep it in view.');
    if (d.conversion && d.acquisition && d.conversion.score <= 24 && d.acquisition.score >= 45) elseBits.push('You convert well once qualified prospects reach a conversation, but too few of them enter the pipeline. The scarce resource is opportunities, not persuasion.');
    if (elseBits.length) out.elseMatters = elseBits;
    else out.elseMatters = 'No strong secondary pattern stands out. The main finding above is where the evidence concentrates.';
    // The part worth challenging.
    out.challenge = top ? A1_CHALLENGE[top.key] : A1_CHALLENGE.demand;
    // What to test next.
    out.testNext = top ? (A1_ACTIONS[top.key] || []).slice(0, 3) : [];
    // Important context, including the visibility caveat.
    var ctxNote = 'This assessment identifies where the evidence points, not the exact cause behind it. It cannot see your market, your pricing power, or your delivery quality directly.';
    if (visN && visN.score >= 45) ctxNote += ' You also reported limited visibility into your own numbers, so treat this as a hypothesis to measure rather than a verdict.';
    out.context = ctxNote;
    return out;
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ASSESSMENT 2 — Is it a strategy or execution problem?  (strategy-or-execution)
 * Overall: "Progress friction score" (problem) = 0.6×max + 0.4×mean across the
 * five dimensions. The primary finding applies the addendum's explicit
 * combination rules (strategy vs execution vs avoidance vs capacity vs
 * coordination) rather than blindly naming the top dimension, so overload is
 * never reported as lack of discipline and avoidance is never reported as
 * missing knowledge.
 * ────────────────────────────────────────────────────────────────────────────*/
var A2_DIMS = ['strategy', 'execution', 'avoidance', 'capacity', 'coordination'];
var A2_ACTIONS = {
  strategy: ['Write your goal as a single measurable outcome with a deadline, then the one mechanism you believe drives it. If you cannot, that gap is the work.', 'Find the smallest real-world test that would give you evidence for or against your current approach within two weeks.'],
  execution: ['Each week, pick the three actions that matter most and put them in your calendar with a time. Protect those slots first.', 'At the end of the week, count how many of your top three you completed. Track that number for a month; it is your execution baseline.'],
  avoidance: ['Name the one action you have been avoiding and do the smallest version of it in the next 48 hours.', 'When you catch yourself researching or planning, ask what action it is replacing, then do a 10-minute version of that action instead.'],
  capacity: ['List everything currently treated as a priority and cut it to two. Park the rest with a date to revisit.', 'Find three hours of protected, uncommitted time in your week before adding anything new.'],
  coordination: ['For each priority involving others, name one accountable person and the next handoff. If nobody owns it, you do until it is reassigned.', 'Identify the external dependency that blocks you most and build a fallback that does not need their input.'],
};
var A2_CHALLENGE = {
  strategy: 'It is worth checking whether frequent changes of direction are a response to evidence or to discomfort. Changing the plan can feel like progress while avoiding execution.',
  execution: 'Before concluding you need a better plan, test whether the current one simply has not been executed consistently for long enough to judge.',
  avoidance: 'The honest question is whether you are missing knowledge or avoiding a known action. More input will not fix an avoidance problem.',
  capacity: 'Be careful not to read overload as a personal failing. But also check whether "no capacity" is quietly protecting you from a specific action you would rather not take.',
  coordination: 'Check whether unclear ownership is a genuine external constraint or a way to keep decisions from landing on you.',
};

window.CLARITY_DATA['strategy-or-execution'] = {
  slug: 'strategy-or-execution',
  page: 'strategy-or-execution',
  title: 'Is it a strategy or execution problem?',
  emailName: 'Clarity tool — Strategy or execution',
  labels: { problem: CD_PROBLEM_LABELS, fit: CD_FIT_LABELS },
  intro: {
    eyebrow: 'Clarity tools',
    paras: [
      'Being stuck does not automatically mean you need a better plan.',
      'This assessment looks at the quality of your strategy, how consistently you execute it, whether you avoid difficult actions, and whether your workload or environment is making execution unrealistic.',
      'The result will show whether the main problem appears to be strategy, execution, avoidance, capacity, coordination, or a combination of them.',
    ],
    count: '17 questions',
    start: 'Start assessment →',
  },
  cta: { heading: 'Want another perspective?', sub: 'If the result points at more than one driver, a working session can help you decide what to change first without guessing.', label: 'Apply for a working session →', href: '/start-here/' },
  questions: [
    { id: 'q1', dim: 'strategy', text: 'How precisely can you state the result you are currently trying to achieve?', options: [
      { t: 'Very precisely, with a number and a date', s: 0 },
      { t: 'Fairly clearly', s: 1 },
      { t: 'Only in general terms', s: 2 },
      { t: 'I could not state it clearly right now', s: 3 },
    ] },
    { id: 'q2', dim: 'strategy', text: 'How clear are you about who or what must change for that result to happen?', options: [
      { t: 'Very clear', s: 0 }, { t: 'Fairly clear', s: 1 }, { t: 'Vague', s: 2 }, { t: 'I have not really worked this out', s: 3 },
    ] },
    { id: 'q3', dim: 'strategy', text: 'How much real-world evidence supports your current approach?', options: [
      { t: 'Strong evidence it works', s: 0 },
      { t: 'Some early evidence', s: 1 },
      { t: 'Mostly reasoning, little evidence', s: 2 },
      { t: 'None yet: it is untested', s: 3 },
    ] },
    { id: 'q4', dim: 'strategy', text: 'How often have you materially changed your strategy in the last six weeks without new evidence clearly requiring the change?', options: [
      { t: 'Not at all: I have held a consistent line', s: 0 },
      { t: 'Once', s: 1 },
      { t: 'A couple of times', s: 2 },
      { t: 'Repeatedly', s: 3 },
    ] },
    { id: 'q5', dim: 'execution', text: 'At the start of a normal week, how clear are the one to three actions that matter most?', options: [
      { t: 'Very clear', s: 0 }, { t: 'Fairly clear', s: 1 }, { t: 'Vague', s: 2 }, { t: 'I rarely start the week with clear priorities', s: 3 },
    ] },
    { id: 'q6', dim: 'execution', text: 'Of the highest-priority actions you commit to, how many normally get completed?', options: [
      { t: 'Almost all', s: 0 }, { t: 'Most', s: 1 }, { t: 'About half', s: 2 }, { t: 'Few', s: 3 },
    ] },
    { id: 'q7', dim: 'execution', text: 'How often do important actions have an actual date and time allocated to them rather than simply living on a list?', options: [
      { t: 'Usually', s: 0 }, { t: 'Often', s: 1 }, { t: 'Sometimes', s: 2 }, { t: 'Rarely', s: 3 },
    ] },
    { id: 'q8', dim: 'execution', text: 'After taking an important action, how reliably do you examine the outcome and use it to decide what happens next?', options: [
      { t: 'Reliably', s: 0 }, { t: 'Often', s: 1 }, { t: 'Sometimes', s: 2 }, { t: 'Rarely: I move on without reviewing', s: 3 },
    ] },
    { id: 'q9', dim: 'avoidance', text: 'When the next important action exposes you to rejection, judgment, failure, or conflict, what usually happens?', options: [
      { t: 'I do it anyway, promptly', s: 0 },
      { t: 'I do it, after some hesitation', s: 1 },
      { t: 'I delay it noticeably', s: 2 },
      { t: 'I usually avoid it or find something else to do', s: 3 },
    ] },
    { id: 'q10', dim: 'avoidance', text: 'How often do research, planning, courses, AI, or conversations replace an action you already know you need to take?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Very often: preparation stands in for action', s: 3 },
    ] },
    { id: 'q11', dim: 'avoidance', text: 'What tends to happen to uncomfortable conversations, asks, pricing discussions, or follow-ups?', options: [
      { t: 'I handle them promptly', s: 0 },
      { t: 'I handle them, a bit late', s: 1 },
      { t: 'They slip repeatedly', s: 2 },
      { t: 'They mostly do not happen', s: 3 },
    ] },
    { id: 'q12', dim: 'avoidance', text: 'How often do you delay decisions that would be relatively easy to reverse because you want more certainty first?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Very often', s: 3 },
    ] },
    { id: 'q13', dim: 'capacity', text: 'How many things are currently treated as genuine top priorities?', options: [
      { t: 'One or two', s: 0 }, { t: 'Three', s: 1 }, { t: 'Four or five', s: 2 }, { t: 'Six or more, or everything feels urgent', s: 3 },
    ] },
    { id: 'q14', dim: 'capacity', text: 'How much uncommitted time remains in an average working week after your existing obligations?', options: [
      { t: 'Plenty: I have room to take on important work', s: 0 },
      { t: 'Some', s: 1 },
      { t: 'Very little', s: 2 },
      { t: 'None: I am fully committed already', s: 3 },
    ] },
    { id: 'q15', dim: 'coordination', text: 'How often is progress blocked by people, approvals, responsibilities, or resources outside your control?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Most of the time', s: 3 },
    ] },
    { id: 'q16', dim: 'capacity', text: 'Even if you knew exactly what to do tomorrow, how realistic would it be to execute it consistently with your current workload and energy?', options: [
      { t: 'Very realistic', s: 0 }, { t: 'Fairly realistic', s: 1 }, { t: 'Difficult', s: 2 }, { t: 'Not realistic as things stand', s: 3 },
    ] },
    { id: 'q17', dim: 'coordination', na: true, naText: 'I work independently; priorities rarely involve other people', text: 'When a priority involves other people, how often is one person clearly accountable for making sure it gets completed?', options: [
      { t: 'Almost always', s: 0 }, { t: 'Often', s: 1 }, { t: 'Sometimes', s: 2 }, { t: 'Rarely: accountability is diffuse', s: 3 },
    ] },
  ],
  dimensions: [
    { key: 'strategy', label: 'Strategy', type: 'problem', copy: [
      'Your objective and approach look clear and evidence-based. The thinking is not the weak point.',
      'The strategy is mostly sound, with a few gaps in clarity or evidence.',
      'There are real questions about the plan itself: the goal, the mechanism, or the evidence behind it.',
      'Strategy is a strong problem. The plan may not be clear or tested enough to execute against.',
      'Strategy is one of the clearest issues. Before pushing harder, the goal and approach need to be defined and tested.',
    ] },
    { key: 'execution', label: 'Execution', type: 'problem', copy: [
      'You turn intentions into completed actions reliably. Execution is a strength.',
      'Execution is broadly working, with some slippage between commitment and completion.',
      'A meaningful share of priority actions are not getting done as intended.',
      'Execution is a strong problem. Good intentions are consistently not becoming completed work.',
      'Execution is one of the clearest issues. The gap between what you plan and what gets done is wide.',
    ] },
    { key: 'avoidance', label: 'Avoidance', type: 'problem', copy: [
      'You act on hard things without much delay. Avoidance is not driving this.',
      'There is a little avoidance, but it is not the main pattern.',
      'Avoidance of uncomfortable actions is showing up often enough to slow progress.',
      'Avoidance is a strong pattern. The actions that matter most are the ones being sidestepped.',
      'Avoidance is one of the clearest issues. You appear to know the next move and are routinely not taking it.',
    ] },
    { key: 'capacity', label: 'Capacity', type: 'problem', copy: [
      'You have the time and bandwidth to execute consistently.',
      'Capacity is mostly fine, though load is starting to compete with priorities.',
      'Workload or too many priorities are making consistent execution genuinely hard.',
      'Capacity is a strong constraint. There may simply not be room to do the important work well.',
      'Capacity is one of the clearest issues. This looks like overload, not lack of discipline.',
    ] },
    { key: 'coordination', label: 'Coordination', type: 'problem', minValid: 1, copy: [
      'Where others are involved, accountability and dependencies are handled cleanly.',
      'Coordination mostly works, with occasional hold-ups from others.',
      'Progress depends on people or approvals in ways that are creating real friction.',
      'Coordination is a strong problem. Too much depends on inputs you do not control or on unclear ownership.',
      'Coordination is one of the clearest issues. Diffuse accountability or external dependencies are blocking progress.',
    ] },
  ],
  overall: {
    key: 'progress_friction', name: 'Progress friction score', unit: '/100', type: 'problem',
    meaning: 'How much friction appears between your stated objective and consistent progress toward it.',
    compute: function (ctx) {
      var scores = A2_DIMS.map(function (k) { return ctx.dims[k] ? ctx.dims[k].score : null; }).filter(function (s) { return s != null; });
      return ctx.H.topWeighted(scores);
    },
    brackets: [
      { label: 'No major progress problem is obvious', desc: 'The basic strategy and execution system appears reasonably functional. Use the dimensions to identify smaller opportunities.' },
      { label: 'Some friction is slowing progress', desc: 'The system is working, but there are identifiable weaknesses.' },
      { label: 'Progress is being materially disrupted', desc: 'There is enough evidence that strategy, execution, avoidance, capacity or coordination is interfering with progress.' },
      { label: 'A strong blocker is present', desc: 'One or more dimensions are consistently preventing effective progress.' },
      { label: 'The current way of working is breaking down', desc: 'The answers show substantial friction across one or more dimensions. This is about the system, not personal discipline.' },
    ],
  },
  interpret: function (ctx, H) {
    var d = ctx.dims;
    var S = function (k) { return d[k] && d[k].score != null ? d[k].score : 0; };
    var ranked = cdSorted(d, A2_DIMS);
    var top = ranked[0], second = ranked[1];
    var strat = S('strategy'), exe = S('execution'), avoid = S('avoidance'), cap = S('capacity'), coord = S('coordination');
    var out = { primaryKey: top ? top.key : null };
    var strongCount = ranked.filter(function (x) { return x.score >= 65; }).length;

    if (!top || top.score < 45) {
      out.primary = top && top.score >= 25
        ? 'No single blocker dominates. The strategy-and-execution system looks broadly functional, with the most friction in ' + top.label.toLowerCase() + '.'
        : 'There is no obvious major strategy or execution problem in your answers. The way you are working looks broadly functional.';
    } else if (strat <= 24 && exe >= 45) {
      out.primary = 'The plan is probably good enough. Execution is the problem: the gap is between deciding what to do and consistently doing it.';
      out.primaryKey = 'execution';
    } else if (exe <= 24 && strat >= 45) {
      out.primary = 'Execution is not the main issue. The strategy needs work: the goal or the approach behind it is not yet clear or tested enough.';
      out.primaryKey = 'strategy';
    } else if (strat >= 45 && exe >= 45) {
      out.primary = 'Both the plan and the way it is being executed need attention. Fixing one without the other is unlikely to move things.';
      out.primaryKey = 'strategy';
    } else if (top.key === 'avoidance') {
      out.primary = 'You appear to know more than you are acting on. Avoidance looks like the main driver, not a weak plan.';
    } else if (top.key === 'capacity') {
      out.primary = 'The issue looks more like overload than lack of discipline. Capacity is the main thing getting in the way of consistent progress.';
    } else if (top.key === 'coordination') {
      out.primary = 'The main friction is coordination. Too much depends on other people or on unclear ownership.';
    } else if (top.key === 'strategy') {
      out.primary = 'The main issue looks like strategy. The plan needs to be clearer or better tested before effort will pay off.';
    } else {
      out.primary = 'The main issue looks like execution. Turning the plan into completed work is where progress is being lost.';
    }
    if (strongCount >= 4 || (strongCount >= 3 && !(strat >= 45 && exe >= 45))) { out.primary = 'Several kinds of friction are overlapping at once. No single driver fully explains it, so the way of working needs attention as a whole.'; out.mixedNote = true; if (!out.primaryKey && top) out.primaryKey = top.key; }

    out.driving = ranked.filter(function (x) { return x.score >= 45; }).slice(0, 3).map(cdLine);
    if (!out.driving.length && top && top.score >= 25) out.driving = [cdLine(top)];
    var healthy = cdSorted(d, A2_DIMS).filter(function (x) { return x.score <= 24; }).sort(function (a, b) { return a.score - b.score; });
    out.healthy = healthy.slice(0, 3).map(cdLine);
    if (!out.healthy.length) out.healthy = ['No dimension scored in the healthy range, so there is no obvious strength to lean on here yet.'];
    // secondary interaction note
    var elseBits = [];
    if (avoid >= 45 && strat <= 44 && exe <= 44) elseBits.push('Avoidance is worth watching even though it is not the headline: it tends to masquerade as needing more planning.');
    if (cap >= 45 && exe >= 45) elseBits.push('Capacity and execution are both stretched. Some of what looks like an execution gap may resolve if the workload is reduced first.');
    if (second && second.score >= 45 && !out.mixedNote) elseBits.push('A secondary driver is present in ' + second.label.toLowerCase() + ' (' + second.score + '/100).');
    out.elseMatters = elseBits.length ? elseBits : 'No strong secondary pattern stands out beyond the main finding above.';
    out.challenge = A2_CHALLENGE[out.primaryKey] || A2_CHALLENGE[top ? top.key : 'execution'];
    out.testNext = A2_ACTIONS[out.primaryKey] ? A2_ACTIONS[out.primaryKey].slice(0, 3) : (top ? A2_ACTIONS[top.key] : []);
    out.context = 'This assessment maps where friction sits between your goal and consistent progress. It cannot judge whether the goal itself is the right one, only how coherent and executable your current approach looks.';
    return out;
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ASSESSMENT 3 — What's making you want to quit your job?  (quit-your-job)
 * TWO headline scores:
 *   • "Change pressure score" (problem) = 0.6×max + 0.4×mean of the seven push
 *     dimensions. Never a probability of, or recommendation to, quitting.
 *   • "Alternative readiness score" (positive-fit) = mean of alternative clarity,
 *     evidence and practical readiness. Financial runway lives here, NOT in the
 *     push score, so financial safety never dampens measured dissatisfaction.
 * Cost of leaving, toward-vs-away and tried-changes are surfaced as modifiers.
 * ────────────────────────────────────────────────────────────────────────────*/
var A3_PUSH = ['managerEnv', 'roleFit', 'careerFit', 'valuesMeaning', 'psychSafety', 'workload', 'compensation'];
var A3_ALT = ['altClarity', 'altEvidence', 'practicalReadiness'];
var A3_PUSH_SENTENCE = {
  managerEnv: 'The environment and your manager look like the main source of pressure. The same work under a better setup appears noticeably more appealing.',
  roleFit: 'The role itself looks like the main source of pressure. The day-to-day work does not fit you well, even where the organisation is fine.',
  careerFit: 'Your broader career direction looks like the main source of pressure. The pull is away from this track, not only this job.',
  valuesMeaning: 'Meaning and values look like the main source of pressure. The work does not feel meaningful or aligned with what matters to you.',
  psychSafety: 'Psychological safety looks like the main source of pressure. It does not feel safe enough to disagree, make normal mistakes, or set boundaries.',
  workload: 'Workload and depletion look like the main source of pressure. Much of the desire to leave eases when the load lifts, which points more to depletion than to a structural mismatch.',
  compensation: 'Compensation and conditions look like a major factor. A material change in pay would noticeably change how you feel about staying.',
};
var A3_CHALLENGE = {
  managerEnv: 'It is worth separating this manager from the job. If a better manager would change everything, this may be a situation problem rather than a career problem.',
  roleFit: 'Check whether a genuinely different role in the same place has actually been explored, or only ruled out in your head.',
  careerFit: 'If the pull persists even in calm periods, it is unlikely to be fixed by small tweaks to this job.',
  valuesMeaning: 'Ask whether the lack of meaning is specific to this job or about what you currently expect work to provide.',
  psychSafety: 'A low-safety environment distorts everything else. Weigh how much of your other dissatisfaction traces back to not feeling safe.',
  workload: 'Because rest shifts how you feel, be careful about making a permanent decision from a temporary state of depletion. Re-test the question when genuinely rested.',
  compensation: 'If pay is the main lever, the real question is whether more money would change how you feel for long, or only briefly.',
};

window.CLARITY_DATA['quit-your-job'] = {
  slug: 'quit-your-job',
  page: 'quit-your-job',
  title: "What's making you want to quit your job?",
  emailName: 'Clarity tool — Quit your job',
  labels: { problem: CD_PROBLEM_LABELS, fit: CD_FIT_LABELS },
  intro: {
    eyebrow: 'Clarity tools',
    paras: [
      'Wanting to leave a job can mean very different things.',
      'This assessment separates problems with your manager, company, role, workload, compensation, values and broader career direction.',
      'It also looks at whether you are moving toward a realistic alternative or mainly trying to get away from your current situation.',
    ],
    count: '20 questions',
    start: 'Start assessment →',
  },
  cta: { heading: 'Want another perspective?', sub: 'A working session can help you separate what needs to change from whether you need to leave, without anyone telling you what to do.', label: 'Apply for a working session →', href: '/start-here/' },
  breakdownGroups: [
    { title: 'What is pushing you', note: 'Higher means more pressure to change in that area.', keys: A3_PUSH },
    { title: 'Your alternative', note: 'Higher means the alternative is more developed and evidenced.', keys: A3_ALT },
    { title: 'Signals to weigh', note: 'Context that shapes the decision. Read each label rather than the colour.', keys: ['towardAway', 'costLeaving', 'triedChanges'] },
  ],
  questions: [
    { id: 'q1', dim: 'managerEnv', text: 'Imagine doing essentially the same work for an excellent employer with a great manager. How appealing does that feel?', options: [
      { t: 'Very appealing: that would largely fix it', s: 3 },
      { t: 'Fairly appealing', s: 2 },
      { t: 'Only a little', s: 1 },
      { t: 'Not appealing: the work itself would still not be right', s: 0 },
    ] },
    { id: 'q2', dim: 'roleFit', text: 'Imagine staying at your current organisation but moving into a genuinely different role. How appealing does that feel?', options: [
      { t: 'Very appealing: a different role would largely fix it', s: 3 },
      { t: 'Fairly appealing', s: 2 },
      { t: 'Only a little', s: 1 },
      { t: 'Not appealing: changing role would not help', s: 0 },
    ] },
    { id: 'q3', dim: 'managerEnv', text: 'If you had an excellent manager starting Monday, how much would that change your desire to leave?', options: [
      { t: 'It would change a lot', s: 3 }, { t: 'A fair amount', s: 2 }, { t: 'A little', s: 1 }, { t: 'Almost no change', s: 0 },
    ] },
    { id: 'q4', dim: 'workload', text: 'If your workload dropped substantially without changing the nature of your responsibilities, how much would that change your desire to leave?', options: [
      { t: 'A lot', s: 3 }, { t: 'A fair amount', s: 2 }, { t: 'A little', s: 1 }, { t: 'Almost no change', s: 0 },
    ] },
    { id: 'q5', dim: 'compensation', text: 'If your compensation increased substantially, how much would that change your desire to leave?', options: [
      { t: 'A lot', s: 3 }, { t: 'A fair amount', s: 2 }, { t: 'A little', s: 1 }, { t: 'Almost no change', s: 0 },
    ] },
    { id: 'q6', dim: 'roleFit', text: 'How well do the actual day-to-day tasks of your role suit your strengths and interests?', options: [
      { t: 'Very well', s: 0 }, { t: 'Fairly well', s: 1 }, { t: 'Poorly in parts', s: 2 }, { t: 'Badly: the daily work does not suit me', s: 3 },
    ] },
    { id: 'q7', dim: 'valuesMeaning', text: 'How meaningful does the work itself feel to you?', options: [
      { t: 'Meaningful', s: 0 }, { t: 'Somewhat', s: 1 }, { t: 'Rarely', s: 2 }, { t: 'Not at all', s: 3 },
    ] },
    { id: 'q8', dim: 'valuesMeaning', text: "How compatible are the organisation's values, behaviours, and normal ways of working with what matters to you?", options: [
      { t: 'Very compatible', s: 0 }, { t: 'Mostly', s: 1 }, { t: 'Often at odds', s: 2 }, { t: 'Fundamentally incompatible', s: 3 },
    ] },
    { id: 'q9', dim: 'psychSafety', text: 'How safe do you feel disagreeing, raising problems, making reasonable mistakes, or setting boundaries in your current workplace?', options: [
      { t: 'Safe', s: 0 }, { t: 'Mostly safe', s: 1 }, { t: 'Often unsafe', s: 2 }, { t: 'Rarely safe', s: 3 },
    ] },
    { id: 'q10', dim: 'careerFit', text: 'How much realistic room is there for progression toward work you actually want?', options: [
      { t: 'Clear room', s: 0 }, { t: 'Some', s: 1 }, { t: 'Little', s: 2 }, { t: 'None: this track does not lead where I want', s: 3 },
    ] },
    { id: 'q11', dim: 'workload', text: 'After several genuinely lighter days or proper time off, what normally happens to your feelings about work?', options: [
      { t: 'They lift clearly: I feel differently about work', s: 3 },
      { t: 'They improve noticeably', s: 2 },
      { t: 'They improve a little', s: 1 },
      { t: 'Almost no change: rest does not shift it', s: 0 },
    ] },
    { id: 'q12', dim: 'careerFit', text: 'Has your wish to leave persisted during periods when work was relatively calm?', options: [
      { t: 'Yes, strongly: it stays even when things are calm', s: 3 },
      { t: 'Mostly yes', s: 2 },
      { t: 'Somewhat', s: 1 },
      { t: 'No: it mainly appears during hard periods', s: 0 },
    ] },
    { id: 'q13', dim: 'triedChanges', text: 'Have you already tried realistic changes that could materially improve your current situation?', options: [
      { t: 'Yes, several, and they did not resolve it', s: 3 },
      { t: 'Yes, a few', s: 2 },
      { t: 'One or two half-measures', s: 1 },
      { t: 'Not really', s: 0 },
    ] },
    { id: 'q14', dim: 'altClarity', text: 'How specific is the alternative you believe you want?', options: [
      { t: 'Very specific: I can describe it concretely', s: 3 },
      { t: 'Fairly specific', s: 2 },
      { t: 'A vague direction', s: 1 },
      { t: 'I only know I want out', s: 0 },
    ] },
    { id: 'q15', dim: 'altEvidence', text: 'How much real-world evidence have you gathered about that alternative?', options: [
      { t: 'Substantial: I have tested it in reality', s: 3 },
      { t: 'Some: a few real steps', s: 2 },
      { t: 'Mostly research and thinking', s: 1 },
      { t: 'None yet', s: 0 },
    ] },
    { id: 'q16', dim: 'altClarity', text: 'How well do you understand and accept the downsides and trade-offs involved in that alternative?', options: [
      { t: 'Clearly, and I accept them', s: 3 },
      { t: 'Fairly well', s: 2 },
      { t: 'Only partly', s: 1 },
      { t: 'I have not really looked at the downsides', s: 0 },
    ] },
    { id: 'q17', dim: 'practicalReadiness', text: 'If you left without another role immediately, how much financial runway would you have?', options: [
      { t: '12 months or more', s: 3 }, { t: '6 to 12 months', s: 2 }, { t: '3 to 6 months', s: 1 }, { t: 'Under 3 months', s: 0 },
    ] },
    { id: 'q18', dim: 'costLeaving', text: 'How much would leaving cost you in benefits, equity, immigration implications, pension, status, professional relationships, or other meaningful sacrifices?', options: [
      { t: 'Very little', s: 0 }, { t: 'Some', s: 1 }, { t: 'A lot', s: 2 }, { t: 'A great deal: leaving would sacrifice a lot', s: 3 },
    ] },
    { id: 'q19', dim: 'towardAway', text: 'How much of your current desire to leave is about moving toward something specific rather than simply getting away from your current situation?', options: [
      { t: 'Mostly toward something specific', s: 3 },
      { t: 'More toward than away', s: 2 },
      { t: 'More away than toward', s: 1 },
      { t: 'Almost entirely about getting away', s: 0 },
    ] },
    { id: 'q20', dim: 'practicalReadiness', text: 'Which best describes the main reason you are still in your current situation?', options: [
      { t: 'I am deliberately preparing an exit on a timeline', s: 3 },
      { t: 'I am weighing a real option carefully', s: 2 },
      { t: 'Mostly fear, comfort, or inertia', s: 1 },
      { t: 'I feel I have no viable alternative', s: 0 },
    ] },
  ],
  dimensions: [
    { key: 'managerEnv', label: 'Manager and environment', type: 'problem', copy: [
      'Your manager and immediate environment do not look like a real source of the pressure to leave.',
      'There is some friction with your manager or environment, but it is not the main driver.',
      'The manager or environment is a meaningful part of why you want to leave.',
      'Manager and environment are a strong driver. A better setup would likely change a lot.',
      'Manager and environment are one of the clearest drivers. Much of this may be a situation problem rather than a career one.',
    ] },
    { key: 'roleFit', label: 'Role fit', type: 'problem', copy: [
      'The role itself broadly suits you. The daily work is not the problem.',
      'The role fits reasonably, with some parts that do not suit you.',
      'The fit between you and the day-to-day role is a meaningful issue.',
      'Role fit is a strong driver. A genuinely different role would likely help a lot.',
      'Role fit is one of the clearest drivers. The daily work does not suit your strengths or interests.',
    ] },
    { key: 'careerFit', label: 'Broader career fit', type: 'problem', copy: [
      'This track still looks broadly aligned with where you want to go.',
      'There are some doubts about the direction, but not a clear mismatch.',
      'The broader career direction is a meaningful part of the pressure.',
      'Career direction is a strong driver. The pull persists even when work is calm.',
      'Career direction is one of the clearest drivers. This track does not lead where you want to go.',
    ] },
    { key: 'valuesMeaning', label: 'Meaning and values', type: 'problem', copy: [
      'The work feels meaningful enough and broadly aligned with your values.',
      'Meaning or values alignment is a little thin, but not a strong driver.',
      'A lack of meaning or a values mismatch is a meaningful part of the pressure.',
      'Meaning and values are a strong driver. The work feels hollow or at odds with what matters to you.',
      'Meaning and values are one of the clearest drivers. The work feels meaningless or fundamentally misaligned.',
    ] },
    { key: 'psychSafety', label: 'Psychological safety', type: 'problem', minValid: 1, copy: [
      'You feel able to speak up, err, and set boundaries. Safety is not a driver.',
      'Safety is mostly fine, with occasional caution.',
      'Not feeling safe to speak or err is a meaningful part of the pressure.',
      'Psychological safety is a strong driver. It often does not feel safe to be honest here.',
      'Psychological safety is one of the clearest drivers, and a low-safety environment distorts everything else.',
    ] },
    { key: 'workload', label: 'Workload and depletion', type: 'problem', copy: [
      'Workload and energy are not a major factor. This is not mainly depletion.',
      'There is some depletion, but it is not the main driver.',
      'Workload and depletion are a meaningful part of the pressure.',
      'Workload and depletion are a strong driver. How you feel eases considerably with rest.',
      'Workload and depletion are one of the clearest drivers. Rest changes how you feel, which points to depletion more than a structural mismatch.',
    ] },
    { key: 'compensation', label: 'Compensation and conditions', type: 'problem', minValid: 1, copy: [
      'Pay and conditions are not a real driver of the wish to leave.',
      'Pay is a minor factor, not central.',
      'Compensation or conditions are a meaningful factor in the decision.',
      'Compensation is a strong factor. A material change in pay would noticeably shift things.',
      'Compensation is one of the clearest factors. Pay or conditions weigh heavily on the decision.',
    ] },
    { key: 'altClarity', label: 'Alternative clarity', type: 'fit', copy: [
      'There is little clarity about the alternative yet. It is mostly "not this".',
      'The alternative is only loosely defined, and its downsides are largely unexamined.',
      'The alternative is taking shape, with a fair sense of what it involves.',
      'The alternative is clearly defined and its trade-offs are understood.',
      'The alternative is very clearly defined, downsides included. You know what you are choosing.',
    ] },
    { key: 'altEvidence', label: 'Alternative evidence', type: 'fit', copy: [
      'There is no real-world evidence behind the alternative yet.',
      'The alternative rests mostly on research and thinking, not tested experience.',
      'You have taken some real steps that give the alternative early evidence.',
      'You have meaningful real-world evidence that the alternative is viable.',
      'The alternative is backed by substantial real-world evidence, not just intention.',
    ] },
    { key: 'practicalReadiness', label: 'Practical readiness', type: 'fit', copy: [
      'Practical readiness to leave is very low right now: little runway and no concrete plan.',
      'There is limited practical readiness. Some pieces exist but not a workable exit.',
      'Practical readiness is developing: some runway and the start of a plan.',
      'Practical readiness is strong: a real timeline and enough runway to act.',
      'Practical readiness is very strong: a deliberate, funded plan on a timeline.',
    ] },
    { key: 'towardAway', label: 'Toward vs away', type: 'fit', show: true, copy: [
      'This reads almost entirely as getting away from the current situation, not moving toward something.',
      'The motivation leans more toward escape than toward a specific alternative.',
      'The motivation is a fairly even mix of moving toward something and getting away.',
      'The motivation is mostly about moving toward something specific.',
      'The motivation is clearly about moving toward a specific alternative, not just escaping.',
    ] },
    { key: 'costLeaving', label: 'Cost of leaving', type: 'problem', show: true, copy: [
      'Leaving would cost you very little in benefits, status, or relationships.',
      'There is some cost to leaving, but it is manageable.',
      'The cost of leaving is meaningful and worth weighing carefully.',
      'The cost of leaving is high and is materially affecting the decision.',
      'The cost of leaving is very high. Benefits, equity, or status are a major part of what is holding you.',
    ] },
    { key: 'triedChanges', label: 'Changes already tried', type: 'fit', show: true, copy: [
      'You have not yet tried realistic changes that might improve the current situation, which weakens the case for leaving before testing them.',
      'You have made only half-hearted attempts to change the situation so far.',
      'You have tried a few realistic changes already.',
      'You have tried several realistic changes without resolving it.',
      'You have genuinely tried to improve things and it has not worked, which strengthens the case that the problem is structural.',
    ] },
  ],
  overall: {
    key: 'change_pressure', name: 'Change pressure score', unit: '/100', type: 'problem',
    meaning: 'How strongly the current work situation appears to be pushing you toward meaningful change. This is not a probability of, or a recommendation to, quit.',
    compute: function (ctx) {
      var scores = A3_PUSH.map(function (k) { return ctx.dims[k] ? ctx.dims[k].score : null; }).filter(function (s) { return s != null; });
      return ctx.H.topWeighted(scores);
    },
    brackets: [
      { label: 'Low pressure for change', desc: 'The answers do not show strong dissatisfaction or structural mismatch. There may still be specific issues worth addressing.' },
      { label: 'Some reasons to reconsider the current setup', desc: 'Several aspects of the job are creating friction, but the case for major change is not yet broad or consistent.' },
      { label: 'Meaningful pressure for change', desc: 'The dissatisfaction appears substantial enough to deserve active attention.' },
      { label: 'Strong pressure for change', desc: 'Several answers consistently indicate that the current situation is not working well.' },
      { label: 'Very strong pressure for change', desc: 'The answers show broad or intense dissatisfaction across important dimensions.' },
    ],
  },
  overall2: {
    key: 'alternative_readiness', name: 'Alternative readiness', unit: '/100', type: 'fit',
    meaning: 'How developed and evidence-backed the alternative you are considering currently is.',
    compute: function (ctx) {
      var scores = A3_ALT.map(function (k) { return ctx.dims[k] ? ctx.dims[k].score : null; }).filter(function (s) { return s != null; });
      return ctx.H.mean(scores);
    },
    brackets: [
      { label: 'Alternative is mostly undefined', desc: 'There is little to show for an alternative yet: it is more a wish than a plan.' },
      { label: 'Early exploration', desc: 'You have started to explore an alternative, but it is early and thin on evidence.' },
      { label: 'Developing alternative', desc: 'The alternative is taking shape, though important unknowns remain.' },
      { label: 'Well-developed alternative', desc: 'The alternative is well developed and increasingly concrete.' },
      { label: 'Strongly evidence-backed alternative', desc: 'The alternative is backed by real-world evidence, not just intention.' },
    ],
  },
  interpret: function (ctx, H) {
    var d = ctx.dims;
    var S = function (k) { return d[k] && d[k].score != null ? d[k].score : 0; };
    var pressure = ctx.overall.score, ready = ctx.overall2.score;
    var pushRanked = cdSorted(d, A3_PUSH);
    var top = pushRanked[0], second = pushRanked[1];
    var strongCount = pushRanked.filter(function (x) { return x.score >= 65; }).length;
    var out = { primaryKey: top ? top.key : null };

    // Primary: what is pushing you.
    if (!top || top.score < 45) {
      out.primary = 'There is no strong structural mismatch in your answers. The pressure to change looks ' + (pressure < 25 ? 'low' : 'limited') + ', with the most friction in ' + (top ? top.label.toLowerCase() : 'no single area') + '.';
    } else if (strongCount >= 3 || (second && cdNearTie(top, second, 8) && second.score >= 45)) {
      out.primary = 'Several issues are interacting: ' + pushRanked.slice(0, 3).filter(function (x) { return x.score >= 45; }).map(function (x) { return x.label.toLowerCase(); }).join(', ') + '. No single one fully explains the pressure to leave.';
      out.mixedNote = true;
    } else {
      out.primary = A3_PUSH_SENTENCE[top.key];
    }

    // Secondary: how developed is the alternative (quadrant), plus toward/away.
    var hiP = pressure >= 45, hiR = ready >= 45;
    var quad;
    if (hiP && !hiR) quad = 'Your current situation appears to be creating meaningful pressure for change, but the alternative remains underdeveloped.';
    else if (hiP && hiR) quad = 'There is real dissatisfaction with the current situation and meaningful evidence behind the alternative you are considering.';
    else if (!hiP && hiR) quad = 'The current situation is not showing severe problems, but you have developed a credible alternative that may be attractive for positive reasons.';
    else quad = 'Neither the case for leaving nor the alternative is currently strongly developed.';
    if (S('towardAway') <= 24 && hiP) quad += ' Much of the pull looks like getting away from the current situation rather than moving toward something specific.';
    out.secondary = quad;

    // Driving = strongest push dimensions.
    out.driving = pushRanked.filter(function (x) { return x.score >= 45; }).slice(0, 3).map(cdLine);
    if (!out.driving.length && top && top.score >= 25) out.driving = [cdLine(top)];
    // Healthy = push areas that are genuinely fine (credibility) + strong alt dims.
    var healthyPush = cdSorted(d, A3_PUSH).filter(function (x) { return x.score <= 24; }).sort(function (a, b) { return a.score - b.score; });
    out.healthy = healthyPush.slice(0, 3).map(cdLine);
    if (!out.healthy.length) out.healthy = ['No part of the job scored in the healthy range, which is itself a signal that the dissatisfaction is broad.'];

    // What else matters = modifiers that refine the two headline scores.
    var mods = [];
    if (S('costLeaving') >= 45) mods.push('The cost of leaving is high and is materially affecting the decision, separate from how you feel about the work.');
    if (S('practicalReadiness') <= 24 && pressure >= 45) mods.push('Practical exit readiness is low right now, mainly runway and the absence of a concrete plan.');
    else if (S('practicalReadiness') >= 65) mods.push('Practical exit readiness is relatively strong: a real timeline and enough runway to act.');
    if (S('triedChanges') <= 24 && pressure >= 45) mods.push('You have not yet tried realistic changes that might improve the current role. Ruling those in or out would strengthen whatever you decide.');
    if (S('triedChanges') >= 65) mods.push('You have already tried realistic changes without resolving it, which supports the read that the problem is structural.');
    out.modifiers = mods;
    out.elseMatters = mods.length ? mods : 'The two scores above capture the main picture. No additional modifier stands out strongly.';

    // Challenge.
    if (S('towardAway') <= 24 && pressure >= 45) out.challenge = 'The honest question is whether you are moving toward something or just away from this. Leaving without a defined alternative often recreates the same problem elsewhere.';
    else out.challenge = A3_CHALLENGE[out.primaryKey] || A3_CHALLENGE[top ? top.key : 'roleFit'];

    // What to test next.
    out.testNext = [
      'Write the alternative you want in one concrete paragraph: the path, and why it fits you. Vagueness here is itself a finding.',
      'Take one small real-world step toward the alternative in the next two weeks — a conversation, a test, a piece of work — and see what you learn.',
      'List the realistic changes you have not yet tried in the current role, and decide deliberately whether to rule them in or out.',
    ];
    out.context = 'This assessment describes the structure of the decision. It does not tell you whether to stay or leave, and it cannot weigh your personal circumstances or risk tolerance for you.';
    return out;
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ASSESSMENT 4 — Do you want to become a solopreneur?  (become-a-solopreneur)
 * No problem score. TWO positive-fit headlines:
 *   • "Solopreneur fit" = mean(genuine pull, self-directed, uncertainty
 *     tolerance, 100−escape, 100−workplace reliance). Motivation + operating
 *     style. Financial readiness is deliberately NOT in fit (addendum §13).
 *   • "Solopreneur readiness" = mean(market evidence, commercial willingness,
 *     financial readiness). Practical evidence + commercial ability + finances.
 * Escape, workplace reliance, solo and company-builder orientation are modifiers.
 * ────────────────────────────────────────────────────────────────────────────*/
var A4_FIT = ['genuinePull', 'selfDirected', 'uncertaintyTolerance'];
var A4_READY = ['customerEvidence', 'commercialWillingness', 'financialReadiness'];

window.CLARITY_DATA['become-a-solopreneur'] = {
  slug: 'become-a-solopreneur',
  page: 'become-a-solopreneur',
  title: 'Do you want to become a solopreneur?',
  emailName: 'Clarity tool — Become a solopreneur',
  labels: { problem: CD_PROBLEM_LABELS, fit: CD_FIT_LABELS },
  intro: {
    eyebrow: 'Clarity tools',
    paras: [
      'Wanting more freedom is not the same as wanting to run your own business.',
      'This assessment looks at what is pulling you toward self-employment, how much market evidence you already have, your willingness to sell, your ability to work without external structure, your financial position and whether you actually want the work that comes with running a business.',
      'The result will distinguish between a strong fit for independent work, an untested idea, a desire for autonomy, an escape from employment, and other mixed patterns.',
    ],
    count: '20 questions',
    start: 'Start assessment →',
  },
  cta: { heading: 'Want another perspective?', sub: 'If fit and readiness are pointing in different directions, a working session can help you decide what to test before committing to anything.', label: 'Apply for a working session →', href: '/start-here/' },
  breakdownGroups: [
    { title: 'Fit — do you want the reality?', note: 'Higher means a better fit with how independent work actually feels.', keys: A4_FIT },
    { title: 'Readiness — can it work yet?', note: 'Higher means more practical evidence and preparation.', keys: A4_READY },
    { title: 'Signals to weigh', note: 'Context that shapes both scores. Read each label rather than the colour.', keys: ['escape', 'workplaceReliance', 'soloOrientation', 'builderOrientation'] },
  ],
  questions: [
    { id: 'q1', dim: 'genuinePull', text: 'If your current job became significantly better tomorrow, how interested would you still be in working for yourself?', options: [
      { t: 'Just as interested: this is not about escaping a bad job', s: 3 },
      { t: 'Still quite interested', s: 2 },
      { t: 'Somewhat less interested', s: 1 },
      { t: 'Much less interested: the job is most of it', s: 0 },
    ] },
    { id: 'q2', dim: 'genuinePull', text: 'If working for yourself paid less than employment for the first two years, how much would that change your interest?', options: [
      { t: 'Little: I would still want to do it', s: 3 },
      { t: 'Some, but I would likely proceed', s: 2 },
      { t: 'A lot: I would hesitate', s: 1 },
      { t: 'It would probably stop me', s: 0 },
    ] },
    { id: 'q3', dim: 'escape', text: 'What is the main thing that attracts you to working for yourself?', options: [
      { t: 'Building something of my own', s: 0 },
      { t: 'Doing work I care about at a higher standard', s: 1 },
      { t: 'More freedom and autonomy in how I spend my time', s: 2 },
      { t: 'Getting away from a job, boss, or environment I dislike', s: 3 },
    ] },
    { id: 'q4', dim: 'builderOrientation', text: 'When you imagine self-employment, which part feels most attractive?', options: [
      { t: 'Building something that grows beyond me', s: 3 },
      { t: 'Serving clients directly and being paid well for it', s: 2 },
      { t: "Doing the work I'm good at without interference", s: 1 },
      { t: 'Having full control over how I spend my time', s: 0 },
    ] },
    { id: 'q5', dim: 'customerEvidence', text: 'Has anyone ever paid you independently for the kind of expertise, service, or product you want to sell?', options: [
      { t: 'Yes, several times', s: 3 }, { t: 'Yes, once or twice', s: 2 }, { t: 'Only informally or for free', s: 1 }, { t: 'No', s: 0 },
    ] },
    { id: 'q6', dim: 'customerEvidence', text: 'How much evidence do you have that a clearly defined group of customers has the problem you want to solve?', options: [
      { t: 'Strong: I have direct evidence', s: 3 }, { t: 'Some', s: 2 }, { t: 'A little', s: 1 }, { t: 'None yet', s: 0 },
    ] },
    { id: 'q7', dim: 'customerEvidence', text: 'How easy would it be for you to identify twenty realistic prospective customers today?', options: [
      { t: 'Easy: I could list them now', s: 3 }, { t: 'Fairly easy', s: 2 }, { t: 'Hard', s: 1 }, { t: 'I would not know where to start', s: 0 },
    ] },
    { id: 'q8', dim: 'customerEvidence', text: 'How strong is your evidence that people are genuinely willing to pay for what you want to offer?', options: [
      { t: 'Strong: people already pay', s: 3 }, { t: 'Some signs', s: 2 }, { t: 'Mostly hope', s: 1 }, { t: 'None', s: 0 },
    ] },
    { id: 'q9', dim: 'commercialWillingness', text: 'How comfortable are you directly asking someone to pay for your work?', options: [
      { t: 'Very comfortable', s: 3 }, { t: 'Fairly comfortable', s: 2 }, { t: 'Uncomfortable, but I do it', s: 1 }, { t: 'I avoid it', s: 0 },
    ] },
    { id: 'q10', dim: 'commercialWillingness', text: 'Imagine contacting ten relevant potential customers and receiving eight rejections or no replies. How likely would you be to continue prospecting and adjusting your approach?', options: [
      { t: 'Very likely: that is normal', s: 3 }, { t: 'Likely', s: 2 }, { t: 'Unsure', s: 1 }, { t: 'I would probably stop', s: 0 },
    ] },
    { id: 'q11', dim: 'commercialWillingness', text: 'Would you willingly spend part of every week finding customers even when you were already busy delivering paid work?', options: [
      { t: 'Yes, consistently', s: 3 }, { t: 'Probably', s: 2 }, { t: 'Reluctantly', s: 1 }, { t: 'No: I want to focus on the work itself', s: 0 },
    ] },
    { id: 'q12', dim: 'selfDirected', text: 'How well have you historically worked without external deadlines, managers, or accountability?', options: [
      { t: 'Very well: I set my own structure', s: 3 }, { t: 'Fairly well', s: 2 }, { t: 'Inconsistently', s: 1 }, { t: 'Poorly: I need external structure', s: 0 },
    ] },
    { id: 'q13', dim: 'uncertaintyTolerance', text: 'How comfortable are you making consequential decisions with incomplete information?', options: [
      { t: 'Comfortable', s: 3 }, { t: 'Fairly comfortable', s: 2 }, { t: 'Uneasy', s: 1 }, { t: 'I find it very hard', s: 0 },
    ] },
    { id: 'q14', dim: 'selfDirected', text: 'How willing are you to handle invoicing, finances, contracts, administration, marketing, and other work unrelated to your core craft?', options: [
      { t: 'Willing: it comes with the territory', s: 3 }, { t: 'Mostly willing', s: 2 }, { t: 'Reluctant', s: 1 }, { t: 'I would strongly resist it', s: 0 },
    ] },
    { id: 'q15', dim: 'financialReadiness', text: 'How much personal financial runway could you realistically preserve while starting?', options: [
      { t: '12 months or more', s: 3 }, { t: '6 to 12 months', s: 2 }, { t: '3 to 6 months', s: 1 }, { t: 'Under 3 months', s: 0 },
    ] },
    { id: 'q16', dim: 'financialReadiness', text: 'How dependent are you on receiving roughly the same income every month?', options: [
      { t: 'Not very: I have flexibility', s: 3 }, { t: 'Somewhat', s: 2 }, { t: 'Quite dependent', s: 1 }, { t: 'Highly dependent', s: 0 },
    ] },
    { id: 'q17', dim: 'financialReadiness', text: 'How much of your current compensation comes from benefits or protections you would need to replace yourself, such as paid leave, pension contributions, healthcare, insurance, or bonuses?', options: [
      { t: 'Very little', s: 3 }, { t: 'Some', s: 2 }, { t: 'A fair amount', s: 1 }, { t: 'A great deal', s: 0 },
    ] },
    { id: 'q18', dim: 'workplaceReliance', text: 'How reliant are you on having a built-in team or regular workplace interaction for your daily energy and motivation?', options: [
      { t: 'Not reliant: I generate my own momentum', s: 0 }, { t: 'Somewhat', s: 1 }, { t: 'Quite reliant', s: 2 }, { t: 'Highly reliant: I need that environment', s: 3 },
    ] },
    { id: 'q19', dim: 'soloOrientation', text: 'Which sounds most appealing: remaining an independent expert, building a small team around your expertise, or eventually building a company that operates beyond you?', options: [
      { t: 'Remaining an independent expert', s: 3 },
      { t: 'A small team around my expertise', s: 1 },
      { t: 'A company that operates beyond me', s: 0 },
      { t: 'I am not sure yet', s: 1 },
    ] },
    { id: 'q20', dim: 'builderOrientation', text: 'If strong demand meant spending less time doing your core craft and more time on sales, systems, management, and people, how appealing would the business still be?', options: [
      { t: 'Still very appealing: I want to build that', s: 3 },
      { t: 'Fairly appealing', s: 2 },
      { t: 'Less appealing', s: 1 },
      { t: 'Not appealing: I want to do the craft', s: 0 },
    ] },
  ],
  dimensions: [
    { key: 'genuinePull', label: 'Genuine pull to independent work', type: 'fit', copy: [
      'There is little sign of a genuine pull toward independent work once employment improves.',
      'Some interest in working for yourself, but it fades when the job or the money improves.',
      'A real interest in independent work, though partly contingent on pay and conditions.',
      'A strong pull toward independent work that holds up even if the job improved.',
      'A very strong, durable pull toward independent work, largely independent of how good the job is.',
    ] },
    { key: 'selfDirected', label: 'Self-directed operating ability', type: 'fit', copy: [
      'You have historically needed external structure to perform, which independent work removes.',
      'Self-direction is inconsistent, and running the whole operation would test it.',
      'You can work self-directed in parts, with some reliance on external structure.',
      'You work well without external deadlines or managers and accept the non-craft work.',
      'You are strongly self-directed and comfortable owning everything a business requires.',
    ] },
    { key: 'uncertaintyTolerance', label: 'Tolerance for uncertainty', type: 'fit', minValid: 1, copy: [
      'Consequential decisions with incomplete information are very hard for you right now.',
      'You find decisions under uncertainty uncomfortable, which independent work would stress.',
      'You can tolerate some uncertainty, within limits.',
      'You are fairly comfortable acting on incomplete information.',
      'You are very comfortable making consequential decisions under uncertainty.',
    ] },
    { key: 'customerEvidence', label: 'Market evidence', type: 'fit', copy: [
      'There is essentially no market evidence yet. The idea is untested with real buyers.',
      'Market evidence is thin: mostly hope and a rough sense of who might buy.',
      'There is some early market evidence, with gaps around willingness to pay.',
      'There is meaningful market evidence, including people who have paid you.',
      'Market evidence is strong: a defined group, a clear problem, and people who pay.',
    ] },
    { key: 'commercialWillingness', label: 'Commercial willingness', type: 'fit', copy: [
      'You avoid selling and prospecting, which are unavoidable in independent work.',
      'Selling is uncomfortable enough that it may not happen consistently.',
      'You will sell, though not always consistently under rejection.',
      'You are willing to sell and keep prospecting through rejection.',
      'You are comfortable selling, resilient to rejection, and will prospect even while busy.',
    ] },
    { key: 'financialReadiness', label: 'Financial readiness', type: 'fit', copy: [
      'Financial readiness is very low: little runway and high dependence on steady income.',
      'Financial readiness is limited; the exposure would be significant.',
      'Financial readiness is developing, with some runway but real dependence remaining.',
      'Financial readiness is solid: meaningful runway and manageable dependence.',
      'Financial readiness is strong: long runway and low dependence on steady monthly income.',
    ] },
    { key: 'escape', label: 'Escape from employment', type: 'problem', minValid: 1, show: true, copy: [
      'The motivation is about moving toward independent work, not escaping a bad job.',
      'A little of the pull is escape, but it is mostly positive.',
      'A meaningful part of the motivation is about getting away from employment.',
      'Escape from employment is a strong part of the motivation, which can distort the choice.',
      'The desire looks largely driven by wanting to leave employment rather than a pull toward independence.',
    ] },
    { key: 'workplaceReliance', label: 'Dependence on workplace structure', type: 'problem', minValid: 1, show: true, copy: [
      'You generate your own momentum and do not rely on a workplace for energy.',
      'Some reliance on workplace interaction, but not limiting.',
      'You rely on a team or workplace for energy enough that solo work would feel different.',
      'You rely heavily on a built-in team or workplace, which independent work removes.',
      'You depend strongly on a workplace environment for daily energy and motivation.',
    ] },
    { key: 'soloOrientation', label: 'Solo-operator orientation', type: 'fit', minValid: 1, show: true, copy: [
      'Little pull toward staying a solo operator; you lean toward something larger.',
      'Only a mild preference for solo work.',
      'A moderate preference for operating as an independent expert.',
      'A clear preference for remaining an independent expert.',
      'A strong orientation toward independent, solo expert work rather than building an organisation.',
    ] },
    { key: 'builderOrientation', label: 'Company-builder orientation', type: 'fit', show: true, copy: [
      'Little appetite for the business-building side; you want to do the craft.',
      'Limited appetite for sales, systems, and management work.',
      'Some appetite for building beyond your own delivery.',
      'A clear orientation toward building something that operates beyond you.',
      'A strong orientation toward building a company, including the sales, systems, and people work.',
    ] },
  ],
  overall: {
    key: 'solopreneur_fit', name: 'Solopreneur fit', unit: '/100', type: 'fit',
    meaning: 'How strongly your motivations and preferred way of working align with independent work.',
    compute: function (ctx) {
      var d = ctx.dims; var H = ctx.H;
      var parts = [];
      A4_FIT.forEach(function (k) { if (d[k] && d[k].score != null) parts.push(d[k].score); });
      if (d.escape && d.escape.score != null) parts.push(100 - d.escape.score); // escape reduces fit quality
      if (d.workplaceReliance && d.workplaceReliance.score != null) parts.push(100 - d.workplaceReliance.score);
      return H.mean(parts);
    },
    brackets: [
      { label: 'Weak fit', desc: 'The answers show little evidence that the actual work of being a solopreneur matches what you want.' },
      { label: 'Limited fit', desc: 'Some aspects are attractive, but important parts of the reality appear misaligned.' },
      { label: 'Plausible fit', desc: 'There is meaningful alignment, but the picture remains mixed.' },
      { label: 'Strong fit', desc: 'The answers suggest that independent work aligns well with how you want to operate.' },
      { label: 'Very strong fit', desc: 'Your motivation and preferred working style are highly consistent with solopreneurship.' },
    ],
  },
  overall2: {
    key: 'solopreneur_readiness', name: 'Solopreneur readiness', unit: '/100', type: 'fit',
    meaning: 'How much practical evidence, commercial ability and financial preparation currently support making it work.',
    compute: function (ctx) {
      var scores = A4_READY.map(function (k) { return ctx.dims[k] ? ctx.dims[k].score : null; }).filter(function (s) { return s != null; });
      return ctx.H.mean(scores);
    },
    brackets: [
      { label: 'Very early', desc: 'The practical foundation is currently weak.' },
      { label: 'Early-stage readiness', desc: 'Some pieces exist, but significant validation or preparation is still missing.' },
      { label: 'Developing readiness', desc: 'There is meaningful progress, with several important unknowns remaining.' },
      { label: 'Strong readiness', desc: 'There is credible customer, commercial and practical evidence supporting the move.' },
      { label: 'Very strong readiness', desc: 'You have strong evidence across market, operating and financial dimensions.' },
    ],
  },
  interpret: function (ctx, H) {
    var d = ctx.dims;
    var S = function (k) { return d[k] && d[k].score != null ? d[k].score : 0; };
    var fit = ctx.overall.score, ready = ctx.overall2.score;
    var hiF = fit >= 65, loF = fit <= 44, hiR = ready >= 65, loR = ready <= 44;
    var out = { primaryKey: 'solopreneur_fit' };

    // Primary: the fit × readiness quadrant.
    if (hiF && hiR) out.primary = 'You appear to want the reality of independent work, not just the idea, and there is real evidence behind it.';
    else if (hiF && loR) out.primary = 'The motivation looks real, but the foundation is not ready yet. This is a fit-first, prepare-next picture.';
    else if (loF && hiR) out.primary = 'You may be capable of doing this without actually wanting the day-to-day reality of it. The readiness is ahead of the desire.';
    else if (loF && loR) out.primary = 'At the moment, neither preference nor preparation strongly supports the move.';
    else out.primary = 'There is a credible case for independent work, but not yet a clear one. Both fit and readiness are middling.';

    // Secondary: the most salient specific finding.
    var sec = null;
    if (S('escape') >= 65 && S('genuinePull') <= 44) sec = 'Right now the desire looks driven mainly by wanting to leave employment rather than a genuine pull toward independent work.';
    else if (S('commercialWillingness') <= 24) sec = 'The commercial side, selling and prospecting, looks like a significant mismatch, and it is unavoidable in independent work.';
    else if (S('customerEvidence') <= 24) sec = 'There is not yet enough market evidence to know whether this would work. The idea is still untested with real buyers.';
    else if (S('escape') >= 45 && S('builderOrientation') <= 44 && S('commercialWillingness') <= 44) sec = 'This reads more like a desire for autonomy than a desire to run a business. Those are different things and lead to different choices.';
    else if (S('soloOrientation') >= 65 && S('builderOrientation') <= 44) sec = 'Independent solo work fits you better than building a larger company.';
    else if (S('builderOrientation') >= 65 && S('soloOrientation') <= 44) sec = 'Building a company beyond yourself fits you better than remaining a solo operator.';
    out.secondary = sec;

    // Driving: strongest support and the biggest gap across fit + readiness components.
    var comp = cdSorted(d, A4_FIT.concat(A4_READY));
    var driving = [];
    if (comp.length) { driving.push(cdLine(comp[0])); if (comp.length > 1) driving.push(cdLine(comp[comp.length - 1])); }
    out.driving = driving;

    // What looks healthy = genuine strengths (fit components ≥65, low escape/reliance).
    var healthy = cdSorted(d, A4_FIT.concat(A4_READY)).filter(function (x) { return x.score >= 65; });
    out.healthy = healthy.slice(0, 3).map(cdLine);
    if (S('escape') <= 24) out.healthy.push('The motivation is about moving toward something, not escaping a bad job, which is a healthier basis for the decision.');
    if (!out.healthy.length) out.healthy = ['No dimension yet shows strong supporting evidence. That is a signal to gather more before committing, not a verdict against it.'];

    // Modifiers.
    var mods = [];
    if (S('customerEvidence') <= 44 && !(sec && sec.indexOf('market evidence') >= 0)) mods.push('Market evidence is still ' + (S('customerEvidence') <= 24 ? 'essentially absent' : 'thin') + '. Willingness to pay is the assumption to test first.');
    if (S('commercialWillingness') <= 44 && !(sec && sec.indexOf('commercial') >= 0)) mods.push('Commercial willingness is a soft spot. Independent income depends on consistent selling, not only good work.');
    if (S('financialReadiness') <= 24) mods.push('Financial exposure is high right now. Runway and income dependence make timing as important as desire.');
    if (S('workplaceReliance') >= 65) mods.push('You rely heavily on a workplace for daily energy, which independent work would remove. Worth planning for deliberately.');
    if (S('escape') >= 45 && !(sec && sec.indexOf('leave employment') >= 0) && !(sec && sec.indexOf('autonomy') >= 0)) mods.push('A meaningful part of the pull is escape from employment, which is worth separating from a genuine pull toward independence.');
    out.modifiers = mods;
    out.elseMatters = mods.length ? mods : 'Beyond the two scores above, no single modifier stands out strongly.';

    // Challenge.
    if (S('escape') >= 65) out.challenge = 'Be honest about whether you want to build something or just leave something. Escape tends to follow you into self-employment.';
    else if (S('commercialWillingness') <= 24) out.challenge = 'The part you are least drawn to, selling, is the part that decides whether independent work survives. That is worth sitting with before anything else.';
    else if (S('customerEvidence') <= 24) out.challenge = 'The riskiest assumption is that people will pay. Right now that is untested, and everything else depends on it.';
    else if (S('financialReadiness') <= 24) out.challenge = 'Enthusiasm is not runway. The financial exposure is high enough that timing matters as much as desire.';
    else out.challenge = 'The gap between wanting autonomy and wanting to run a business is where most of these decisions go wrong. Be clear which one you are actually choosing.';

    out.testNext = [
      'Try to get one person to pay for a small version of what you would offer, within 30 days. Real payment is the only evidence that counts.',
      'List twenty specific potential customers by name or type. If you cannot, that is your first project.',
      'Spend one week as if self-employed: put real time into prospecting and selling, and notice how it feels, not just how the craft feels.',
    ];
    out.context = 'This assessment separates whether you want independent work from whether you are ready for it. Financial readiness and reliance on a workplace are treated as modifiers, not as the deciding factor on whether you genuinely want this.';
    return out;
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * ASSESSMENT 5 — Are you burned out?  (burned-out)  Reference period: 6 weeks.
 * Overall: "Work strain score" (problem) = 0.6×max + 0.4×mean of the FIVE strain
 * dimensions ONLY (depletion, detachment, workload, control, cognitive strain).
 * Boredom, unused capability and loss of fit are deliberately EXCLUDED from the
 * strain score (addendum §13) — they are separate explanations, surfaced as
 * their own dimensions and used to interpret the strain score, never to inflate
 * it. Broader-life depletion and persistence are modifiers. Not a diagnosis.
 * ────────────────────────────────────────────────────────────────────────────*/
var A5_STRAIN = ['depletion', 'detachment', 'workload', 'control', 'cognitiveStrain'];

window.CLARITY_DATA['burned-out'] = {
  slug: 'burned-out',
  page: 'burned-out',
  title: 'Are you burned out?',
  emailName: 'Clarity tool — Burned out',
  labels: { problem: CD_PROBLEM_LABELS, fit: CD_FIT_LABELS },
  intro: {
    eyebrow: 'Clarity tools',
    paras: [
      'Low motivation at work does not always come from burnout.',
      'This assessment looks at exhaustion, cognitive strain, workload, control, boredom, lack of challenge, meaning and whether you still want the underlying work.',
      'The result will show whether your answers point more toward work-related depletion, under-stimulation, loss of fit with the work itself, or a combination of these.',
      'Answer for how things have been over the past six weeks.',
    ],
    note: 'This assessment is directional. It is not a clinical diagnosis.',
    count: '20 questions',
    start: 'Start assessment →',
  },
  cta: { heading: 'Want another perspective?', sub: 'If the result points to depletion, boredom, or a loss of fit, a working session can help you decide what to change. For clinical concerns, speak to a professional.', label: 'Apply for a working session →', href: '/start-here/' },
  breakdownGroups: [
    { title: 'Work strain', note: 'Higher means stronger evidence of work-related depletion in that area.', keys: A5_STRAIN },
    { title: 'Other explanations', note: 'Separate from strain. Higher means a stronger alternative explanation for low motivation.', keys: ['boredom', 'unusedCapability', 'lossOfFit'] },
    { title: 'Broader picture', note: 'Context that shapes how to read the result.', keys: ['broaderDepletion', 'persistence'] },
  ],
  questions: [
    { id: 'q1', dim: 'depletion', text: 'After an ordinary working day, how mentally depleted do you usually feel?', options: [
      { t: 'Not much: I recover quickly', s: 0 }, { t: 'A little', s: 1 }, { t: 'Quite depleted', s: 2 }, { t: 'Completely drained', s: 3 },
    ] },
    { id: 'q2', dim: 'depletion', text: 'How often do you feel tired merely thinking about another working day?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Most days', s: 3 },
    ] },
    { id: 'q3', dim: 'detachment', text: 'How emotionally distant have you become from your work?', options: [
      { t: 'Not distant: I feel engaged', s: 0 }, { t: 'Slightly', s: 1 }, { t: 'Noticeably', s: 2 }, { t: 'Very distant: I have checked out', s: 3 },
    ] },
    { id: 'q4', dim: 'detachment', text: 'Compared with the past, how cynical or irritable do you feel about work?', options: [
      { t: 'No more than before', s: 0 }, { t: 'A little more', s: 1 }, { t: 'Noticeably more', s: 2 }, { t: 'Much more', s: 3 },
    ] },
    { id: 'q5', dim: 'workload', text: 'How often do the demands of the job exceed the time, energy, or resources available to you?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Almost constantly', s: 3 },
    ] },
    { id: 'q6', dim: 'cognitiveStrain', text: 'How often do you struggle to concentrate, make routine decisions, remember things, or maintain focus at work compared with your normal level?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Most of the time', s: 3 },
    ] },
    { id: 'q7', dim: 'control', text: 'How much control do you feel you have over your workload, priorities, schedule, and how you do your work?', options: [
      { t: 'A lot of control', s: 0 }, { t: 'A fair amount', s: 1 }, { t: 'Little', s: 2 }, { t: 'Almost none', s: 3 },
    ] },
    { id: 'q8', dim: 'persistence', text: 'After several genuinely restful days, what normally happens to your energy and interest in work?', options: [
      { t: 'They return fully', s: 0 },
      { t: 'They improve noticeably', s: 1 },
      { t: 'They improve only a little', s: 2 },
      { t: 'Almost no change: rest does not shift it', s: 3 },
    ] },
    { id: 'q9', dim: 'depletion', text: 'Even during objectively manageable weeks, how drained does work leave you?', options: [
      { t: 'Not drained', s: 0 }, { t: 'A little', s: 1 }, { t: 'Quite drained', s: 2 }, { t: 'Very drained regardless', s: 3 },
    ] },
    { id: 'q10', dim: 'boredom', text: 'How intellectually challenging does your work currently feel?', options: [
      { t: 'Genuinely challenging', s: 0 }, { t: 'Fairly challenging', s: 1 }, { t: 'Rarely challenging', s: 2 }, { t: 'Not challenging at all', s: 3 },
    ] },
    { id: 'q11', dim: 'boredom', text: 'How repetitive does the work feel?', options: [
      { t: 'Varied', s: 0 }, { t: 'Somewhat repetitive', s: 1 }, { t: 'Quite repetitive', s: 2 }, { t: 'Highly repetitive', s: 3 },
    ] },
    { id: 'q12', dim: 'boredom', text: 'How often does time seem to move painfully slowly while you are working?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Most of the time', s: 3 },
    ] },
    { id: 'q13', dim: 'boredom', text: 'How often do you create distractions or side projects mainly because the actual work is not stimulating enough?', options: [
      { t: 'Rarely', s: 0 }, { t: 'Sometimes', s: 1 }, { t: 'Often', s: 2 }, { t: 'Very often', s: 3 },
    ] },
    { id: 'q14', dim: 'unusedCapability', text: 'How much more of your ability do you feel you could use than the role currently demands?', options: [
      { t: 'Little: the role stretches me', s: 0 }, { t: 'Some', s: 1 }, { t: 'A lot', s: 2 }, { t: 'Far more: I am well under-used', s: 3 },
    ] },
    { id: 'q15', dim: 'unusedCapability', text: 'If you were suddenly given substantially more challenging and interesting work without increasing your total workload, what do you think would happen to your motivation?', options: [
      { t: 'Little change: motivation is not the issue', s: 0 },
      { t: 'A small lift', s: 1 },
      { t: 'A clear lift', s: 2 },
      { t: 'It would jump: that is exactly what is missing', s: 3 },
    ] },
    { id: 'q16', dim: 'lossOfFit', text: 'How meaningful does the core work itself currently feel to you?', options: [
      { t: 'Meaningful', s: 0 }, { t: 'Somewhat', s: 1 }, { t: 'Rarely', s: 2 }, { t: 'Not at all', s: 3 },
    ] },
    { id: 'q17', dim: 'lossOfFit', text: 'Imagine doing the same profession with excellent management, good pay, reasonable hours, and sufficient autonomy. How appealing does it feel?', options: [
      { t: 'Very appealing: I would happily do it', s: 0 },
      { t: 'Fairly appealing', s: 1 },
      { t: 'Only a little', s: 2 },
      { t: 'Not appealing: the work itself is the problem', s: 3 },
    ] },
    { id: 'q18', dim: 'lossOfFit', text: 'Has your desire to do something fundamentally different remained during calmer, less stressful periods?', options: [
      { t: 'No: it fades when things calm down', s: 0 },
      { t: 'Somewhat', s: 1 },
      { t: 'Mostly yes', s: 2 },
      { t: 'Yes, strongly: it stays regardless', s: 3 },
    ] },
    { id: 'q19', dim: 'broaderDepletion', text: 'Outside work, how much interest do you currently have in people and activities you normally enjoy?', options: [
      { t: 'Normal interest', s: 0 }, { t: 'Slightly reduced', s: 1 }, { t: 'Noticeably reduced', s: 2 }, { t: 'Very little interest', s: 3 },
    ] },
    { id: 'q20', dim: 'broaderDepletion', text: 'How broadly depleted do you currently feel across the different areas of your life?', options: [
      { t: 'Not broadly depleted: it is mostly work', s: 0 },
      { t: 'A little beyond work', s: 1 },
      { t: 'Noticeably across several areas', s: 2 },
      { t: 'Broadly depleted across most of life', s: 3 },
    ] },
  ],
  dimensions: [
    { key: 'depletion', label: 'Work-related depletion', type: 'problem', copy: [
      'You generally recover after a working day. Work-related depletion is not a strong signal.',
      'Some tiredness, but within a normal range and it lifts with rest.',
      'Work is leaving you meaningfully depleted, including on manageable weeks.',
      'Depletion is a strong signal. Work is draining you well beyond normal tiredness.',
      'Depletion is one of the clearest signals. You appear consistently exhausted by work, even when the load eases.',
    ] },
    { key: 'detachment', label: 'Detachment and cynicism', type: 'problem', copy: [
      'You still feel engaged with your work. Cynicism and distance are not showing up.',
      'A little more distance or irritability than before, but not marked.',
      'Emotional distance or cynicism about work is a meaningful signal.',
      'Detachment is a strong signal. You have become noticeably cynical or disengaged.',
      'Detachment is one of the clearest signals. You feel markedly distant or cynical about the work.',
    ] },
    { key: 'workload', label: 'Workload', type: 'problem', minValid: 1, copy: [
      'Demands generally fit the time and energy available to you.',
      'Demands occasionally exceed capacity, but not chronically.',
      'Demands regularly exceed your time, energy, or resources.',
      'Workload is a strong pressure. Demands consistently outstrip what you have to meet them.',
      'Workload is one of the clearest pressures. Demands far exceed the resources available to you.',
    ] },
    { key: 'control', label: 'Lack of control', type: 'problem', minValid: 1, copy: [
      'You have meaningful control over how, when, and what you work on.',
      'Some limits on your control, but not a major factor.',
      'Limited control over workload or how you work is a meaningful strain.',
      'Low control is a strong strain. Much of how you work is dictated to you.',
      'Low control is one of the clearest strains. You have little say over workload, priorities, or method.',
    ] },
    { key: 'cognitiveStrain', label: 'Cognitive strain', type: 'problem', minValid: 1, copy: [
      'Concentration, memory, and decisions are working normally for you.',
      'Minor lapses in focus, within a normal range.',
      'Noticeable difficulty concentrating, deciding, or remembering compared with your norm.',
      'Cognitive strain is a strong signal. Focus and routine decisions are consistently harder than usual.',
      'Cognitive strain is one of the clearest signals. Concentration and memory are markedly worse than your normal level.',
    ] },
    { key: 'boredom', label: 'Boredom and under-stimulation', type: 'problem', copy: [
      'The work is stimulating enough. Boredom is not a factor.',
      'Some monotony, but not a strong pattern.',
      'The work is repetitive or under-stimulating enough to matter.',
      'Boredom and under-stimulation are a strong signal. The work is not engaging enough for you.',
      'Under-stimulation is one of the clearest signals. The work is far below what would hold your interest.',
    ] },
    { key: 'unusedCapability', label: 'Unused capability', type: 'problem', copy: [
      'The role uses your ability well. Little sense of wasted capacity.',
      'A little of your ability goes unused, but not markedly.',
      'A meaningful gap between what you can do and what the role asks of you.',
      'Unused capability is a strong signal. The role demands well below what you are capable of.',
      'Unused capability is one of the clearest signals. You are operating far below your capacity.',
    ] },
    { key: 'lossOfFit', label: 'Loss of fit and meaning', type: 'problem', copy: [
      'The work itself still feels meaningful and broadly right for you.',
      'Some drift in meaning, but the work still fits reasonably.',
      'A meaningful sense that the work itself may no longer fit you.',
      'Loss of fit is a strong signal. Even under good conditions, the work itself appeals less.',
      'Loss of fit is one of the clearest signals. The work itself, not just the conditions, seems no longer right for you.',
    ] },
    { key: 'broaderDepletion', label: 'Broader life depletion', type: 'problem', show: true, copy: [
      'Your energy and interest outside work look intact.',
      'Some dip in outside-work interest, but not marked.',
      'A meaningful loss of interest or energy beyond work as well.',
      'Broader depletion is a strong signal. The flatness extends well beyond work.',
      'Broader depletion is one of the clearest signals. Energy and interest are low across much of life, not only work.',
    ] },
    { key: 'persistence', label: 'Persistence despite rest', type: 'problem', minValid: 1, show: true, copy: [
      'How you feel shifts with rest and calmer periods, which points to something situational.',
      'Rest helps, though not completely.',
      'Feelings improve only partly with rest, suggesting more than a passing state.',
      'The pattern persists through calmer periods, which suggests it is not only about workload.',
      'The pattern barely shifts with rest or calm, which suggests something more structural than temporary depletion.',
    ] },
  ],
  overall: {
    key: 'work_strain', name: 'Work strain score', unit: '/100', type: 'problem',
    meaning: 'How strongly your answers show work-related exhaustion, detachment, cognitive strain and loss of sustainable capacity over the past six weeks.',
    followNote: 'This score is not a clinical diagnosis.',
    compute: function (ctx) {
      var scores = A5_STRAIN.map(function (k) { return ctx.dims[k] ? ctx.dims[k].score : null; }).filter(function (s) { return s != null; });
      return ctx.H.topWeighted(scores);
    },
    brackets: [
      { label: 'Low work-strain signal', desc: 'The answers do not show a strong pattern of work-related depletion.' },
      { label: 'Some signs of strain', desc: 'There are signs of pressure or depletion, but the pattern is not particularly strong.' },
      { label: 'Meaningful work strain', desc: 'Several answers suggest that work is having a material effect on energy, concentration or engagement.' },
      { label: 'Strong work-strain signal', desc: 'The pattern consistently points toward substantial work-related depletion.' },
      { label: 'Very strong work-strain signal', desc: 'The answers show a strong concentration of exhaustion, detachment or cognitive strain.' },
    ],
  },
  interpret: function (ctx, H) {
    var d = ctx.dims;
    var S = function (k) { return d[k] && d[k].score != null ? d[k].score : 0; };
    var strain = ctx.overall.score;
    var boredom = S('boredom'), unused = S('unusedCapability'), fitLoss = S('lossOfFit'), broader = S('broaderDepletion'), persist = S('persistence');
    var understim = Math.max(boredom, unused);
    var strainHi = strain >= 45, understimHi = understim >= 45, fitHi = fitLoss >= 45;
    var out = { primaryKey: 'work_strain' };

    if (!strainHi && !understimHi && !fitHi) {
      out.primary = 'There is no strong evidence of burnout, under-stimulation, or loss of fit in your answers. The pattern looks broadly sustainable right now.';
    } else if (strainHi && fitHi && understimHi) {
      out.primary = 'Several patterns overlap at once: work-related depletion, under-stimulation, and a possible loss of fit are all present.'; out.mixedNote = true;
    } else if (strainHi && fitHi) {
      out.primary = 'You may be both depleted and increasingly finished with the underlying work. This is depletion and a loss of fit together, not one or the other.'; out.mixedNote = true;
    } else if (strainHi && understimHi) {
      out.primary = 'The pattern is mixed. You appear depleted and also poorly stimulated by the work at the same time.'; out.mixedNote = true;
    } else if (strainHi) {
      out.primary = 'The strongest signal is work-related depletion. This looks more like burnout-type strain than boredom or a loss of fit.';
    } else if (understimHi && fitHi) {
      out.primary = 'This looks less like exhaustion and more like under-stimulation combined with a possible loss of fit with the work.';
    } else if (understimHi) {
      out.primary = 'The problem looks more like under-stimulation than exhaustion. This reads less like burnout and more like boredom and unused capability.';
    } else {
      out.primary = 'This looks less like burnout and more like the underlying work no longer fitting you, even without severe depletion.';
    }

    // Driving = strongest contributors across strain + other explanations.
    var contributors = cdSorted(d, A5_STRAIN.concat(['boredom', 'unusedCapability', 'lossOfFit']));
    out.driving = contributors.filter(function (x) { return x.score >= 45; }).slice(0, 3).map(cdLine);
    if (!out.driving.length && contributors[0] && contributors[0].score >= 25) out.driving = [cdLine(contributors[0])];

    // Healthy = genuinely low areas (credibility).
    var healthy = cdSorted(d, A5_STRAIN.concat(['boredom', 'unusedCapability', 'lossOfFit'])).filter(function (x) { return x.score <= 24; }).sort(function (a, b) { return a.score - b.score; });
    out.healthy = healthy.slice(0, 3).map(cdLine);
    if (!out.healthy.length) out.healthy = ['No area scored in the healthy range, which suggests the strain is broad rather than isolated.'];

    // What else matters — separates the explanations + broader/persistence modifiers.
    var mods = [];
    if (strainHi && understim <= 24 && fitLoss <= 24) mods.push('Boredom and loss of fit are low, so this is not being confused with under-stimulation. The signal really is depletion.');
    if (!strainHi && understimHi) mods.push('Because strain is low but under-stimulation is high, more rest is unlikely to help. More challenge is the likelier lever.');
    if (fitHi && persist >= 45) mods.push('Your wish for something different persists through calmer periods, which points to the work itself rather than a passing slump.');
    if (broader >= 45) mods.push('Your answers point to depletion beyond work as well. This assessment cannot establish why that is, and it is worth taking seriously.');
    out.modifiers = mods;
    out.elseMatters = mods.length ? mods : 'Beyond the main finding, no additional pattern stands out strongly.';

    // Challenge.
    if (understimHi && !strainHi) out.challenge = 'It is worth being honest that this may be boredom, not burnout. The two feel similar from the inside but need almost opposite responses.';
    else if (fitHi) out.challenge = 'The hard question is whether it is this job or this kind of work. Your answers lean toward the work itself, which a change of employer would not fix.';
    else if (strainHi && broader >= 45) out.challenge = 'Be careful about attributing all of this to work. Some of it may be broader, and this assessment cannot tell you which.';
    else if (strainHi) out.challenge = 'Check whether the depletion is being sustained by something you could change, such as load or control, before treating it as a fixed state.';
    else out.challenge = 'Low motivation is easy to mislabel. The useful move is to name which of depletion, boredom, or fit is actually driving it before acting.';

    out.testNext = [
      'Protect two genuinely restorative periods over the next fortnight and watch whether your energy and interest recover. Whether they do is itself diagnostic.',
      'Separate the work from the conditions: list what you would keep and what you would drop if you had full control. The split is informative.',
      broader >= 45 ? 'Because the flatness extends beyond work, consider speaking to a professional. This tool cannot assess that, and it matters.' : 'If the strongest signal is under-stimulation, test one genuinely challenging piece of work and see whether motivation returns.',
    ];
    out.context = 'This assessment is directional and looks only at your work state over the past six weeks. It is not a clinical diagnosis and cannot assess depression, physical health, or life circumstances. If you are concerned about your wellbeing, consider speaking to a qualified professional.';
    return out;
  },
};
