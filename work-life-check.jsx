// work-life-check.jsx — The Work & Life Check, on the Clarity Tools engine.
//
// Loaded by /work-life-check/ after lead-capture.js and clarity-tools.js. It
// registers one more assessment in window.CLARITY_DATA, so the questions, the
// one-at-a-time UI, the 0–100 dimension scoring, the email screen before the
// result and answer persistence are the engine's (clarity-tools.jsx), and every
// submission goes through the site's one lead-capture layer (lead-capture.jsx).
// What is specific to this check lives here:
//   • the five areas and their public names (used on screen, in the email and
//     in analytics, always exactly as written in AREAS)
//   • the result logic: rank the five areas, primary = highest, secondary =
//     second; equal rounded scores = "Two areas stand out"; every area in the
//     engine's lowest band (0–24) = "Nothing clearly dominates"; the context
//     read from Q16 and Q17
//   • the submission behind the email screen: one lead — the sheet row, the
//     owner notification and the person's result email (template_gcj2lrd, the
//     diagnostics' existing result template; content/emails/…) — then the
//     result, whether or not that email went out
//   • the result screen
//   • analytics: work_life_check_* events carrying source_page, primary_result,
//     secondary_result and context_type. Nothing depends on analytics loading.
//
// There is no total score: the check measures five separate areas.

(function () {
  const e = React.createElement;
  const SLUG = 'work-life-check';
  const ORIGIN = 'https://aggelosmouzakitis.com';

  // ── The five areas (canonical order also breaks ties) ─────────────────────
  const AREAS = [
    {
      key: 'switching',
      label: 'Work is not switching off',
      lead: 'You can stop working without work actually stopping.',
      body: [
        'Your answers suggest that your attention stays attached to work after there is anything useful you can do about it.',
        'You may replay conversations, prepare for tomorrow, check for updates or keep working a problem in your head after the practical workday has ended.',
        'That is different from simply being busy.',
        'In demanding roles, this can look like responsibility because staying alert is often rewarded. Sometimes it genuinely is necessary. The more useful question is whether your mind still knows when the work is over.',
        'The cost often appears somewhere else first. Sleep becomes lighter. Time off feels less restorative. You are physically with other people and mentally somewhere else.',
        'Before making this psychological, the environment matters. Some roles genuinely demand too much attention. If the job requires constant monitoring, that is part of the problem.',
        'If the external demand does not fully explain it, the interesting question becomes what feels difficult about disengaging when nothing currently requires your attention.',
      ],
      next: [
        'Notice what happens in the first hour after work.',
        'Do you gradually disengage, or does your mind immediately find another work problem to hold?',
      ],
      pages: [{ title: 'Burnout & Can’t Switch Off', button: 'Read about switching off', href: '/executive-burnout-therapy/' }],
      secondary: [
        'Your second-highest area was **Work is not switching off**.',
        'That matters because mental carryover can keep other problems active. Recovery becomes harder when the mind never really leaves work, and relationship strain becomes easier to understand when part of your attention remains elsewhere.',
      ],
    },
    {
      key: 'recovery',
      label: 'Recovery is not restoring you',
      lead: 'You are still functioning. It is simply costing more.',
      body: [
        'Your answers suggest that you can still produce the output, but maintaining it requires more effort than it used to.',
        'Weekends help less. Time away wears off quickly. Work that used to absorb you may now require pushing yourself through it.',
        'That matters before performance collapses.',
        'A lot of people wait for burnout to become obvious enough that somebody else would notice. For capable people, that can take a long time. The calendar stays full and the work keeps getting done while the rest of life gradually absorbs the cost.',
        'Sometimes the explanation is straightforward. The workload is unreasonable, the team is understaffed or the role has quietly expanded beyond what one person can carry.',
        'Sometimes recovery is also being interrupted by what happens when you stop. Work remains mentally active. Rest creates guilt. Losing momentum feels unsafe. Without the structure of work, you are not quite sure where to put your attention.',
        'The useful question is no longer only whether you can keep doing this.',
        'It is what keeping it up currently costs.',
      ],
      next: [
        'Compare the last genuinely restorative break you remember with your most recent one.',
        'What changed?',
      ],
      pages: [{ title: 'Burnout & Can’t Switch Off', button: 'Read about burnout', href: '/executive-burnout-therapy/' }],
      secondary: [
        'Your second-highest area was **Recovery is not restoring you**.',
        'That suggests the issue is not limited to what happens during working hours. The amount of effort required to maintain your normal level may itself have become part of the problem.',
      ],
    },
    {
      key: 'decision',
      label: 'A decision is staying open',
      lead: 'You may not need more information.',
      body: [
        'Your answers suggest that an important decision has been taking up attention for some time without becoming substantially clearer.',
        'That does not mean you are indecisive.',
        'Some decisions are genuinely difficult. Leaving a well-paid role, stepping away from a company, changing direction or accepting a period of uncertainty can carry real financial and professional consequences.',
        'The important distinction is whether more analysis is still changing the decision.',
        'If you already know the salary, the market, the risks, the alternatives and the obvious trade-offs, another spreadsheet may not be the missing piece.',
        'What remains may be harder to quantify.',
        'Status. Security. Responsibility for other people. Fear of regret. Family expectations. The years already invested. What leaving would seem to say about you.',
        'People sometimes wait for circumstances to make a decision for them because that removes some of the burden of choosing.',
        'If that is happening, the problem is no longer a lack of information.',
      ],
      next: [
        'Ask yourself:',
        '“What information am I still genuinely waiting for?”',
        'If the answer is vague, ask:',
        '“What would I have to accept if I made the decision with the information I already have?”',
      ],
      pages: [
        { title: 'Career Change & Decisions', button: 'Read about difficult career decisions', href: '/career-transition-therapy/' },
        { title: 'Therapy vs Coaching', button: 'Is this therapy or coaching?', href: '/therapy-vs-coaching/' },
      ],
      secondary: [
        'Your second-highest area was **A decision is staying open**.',
        'That suggests some of the current strain may be connected to a choice that has not been resolved. An open decision consumes attention even on days when you are not actively thinking about it.',
      ],
    },
    {
      key: 'relationship',
      label: 'Work is entering your relationship',
      lead: 'The job may be taking up more space at home than either of you agreed to.',
      body: [
        'Your answers suggest that professional pressure is starting to shape what happens in your relationships.',
        'This does not necessarily mean you work extreme hours.',
        'Sometimes the more important issue is attention.',
        'You are home but still inside the meeting. A normal request feels like one more task. Your partner starts a conversation while part of you is preparing for tomorrow.',
        'From inside the job, this can feel like responsibility.',
        'From the other side of the table, it can feel like absence.',
        'The professional pressure may be completely real. A difficult quarter, unstable company, major launch or senior role can genuinely demand more for a period of time.',
        'The question is what happens when the temporary arrangement stops being temporary.',
        'Another thing is worth noticing: work gives many capable people something relationships do not. Problems are clearer. Progress is measurable. Competence is easier to feel.',
        'That becomes relevant if work repeatedly becomes more attractive at exactly the moment home becomes uncomfortable.',
      ],
      next: [
        'Think about the last three conflicts you had at home involving work.',
        'Were they actually about hours?',
        'Or were they about attention, availability, promises, resentment or what repeatedly came second?',
      ],
      pages: [{ title: 'When Work Is Affecting Your Relationship', button: 'Read about work and relationships', href: '/work-affecting-relationship/' }],
      secondary: [
        'Your second-highest area was **Work is entering your relationship**.',
        'That means some of the cost is no longer contained within your professional life. The people around you may already be experiencing the effects even if your work itself still looks fine.',
      ],
    },
    {
      key: 'performance',
      label: 'Performance is carrying too much weight',
      lead: 'Professional outcomes may be doing more than measuring your work.',
      body: [
        'Your answers suggest that performance has become closely connected to how you feel about yourself.',
        'A good result may bring relief more than satisfaction. A poor review can occupy the entire weekend. Somebody else moving faster can create a reaction much larger than the practical consequence.',
        'Ambition is not the problem.',
        'The question is what achievement has been asked to provide.',
        'For some people, work becomes the most reliable place to feel competent, useful or secure. That arrangement can work extremely well for years.',
        'It becomes more expensive when professional outcomes start regulating self-worth.',
        'Then slowing down is not simply inconvenient. Failure is not simply information. Comparison stops being useful benchmarking and starts feeling like evidence that you are falling behind.',
        'The goal is not to become less ambitious.',
        'It is to understand why the scoreboard has been given this much authority.',
      ],
      next: [
        'Think about your last significant professional disappointment.',
        'Separate the practical consequence from the meaning you attached to it.',
        'How different are those two things?',
      ],
      pages: [{ title: 'Achievement, Failure & Self-Worth', button: 'Read about achievement and self-worth', href: '/achievement-self-worth/' }],
      secondary: [
        'Your second-highest area was **Performance is carrying too much weight**.',
        'That suggests professional outcomes may be amplifying the main issue. When performance is closely tied to self-worth, setbacks, uncertainty and slowing down tend to become psychologically more expensive.',
      ],
    },
  ];
  const AREA = {};
  AREAS.forEach((a) => { AREA[a.key] = a; });

  // ── Context (Q16 × Q17) ────────────────────────────────────────────────────
  // Option indexes. Q16: None 0 · A little 1 · Some 2 · Most 3 · Almost all 4.
  // Q17: Never 0 · Once 1 · A few times 2 · Often 3 · Very clearly 4.
  //   A  Q16 Most/Almost all  and Q17 Never/Once
  //   B  Q17 Often/Very clearly and Q16 None/A little/Some
  //   C  Q16 Most/Almost all  and Q17 A few times/Often/Very clearly
  //   D  every other combination
  const CONTEXTS = {
    A: {
      key: 'current_environment',
      title: 'The current environment may be carrying a lot of this',
      body: [
        'Your answers suggest that a substantial change in the current job or company might improve much of what you are experiencing, and you do not report a strong history of the same pattern repeating elsewhere.',
        'That matters.',
        'A badly designed role, unstable company, unreasonable workload or difficult relationship with a manager does not need a deeper psychological explanation in order to be a real problem.',
        'The useful question is how much belongs to the environment, what can realistically change, and what you want to do if it cannot.',
      ],
    },
    B: {
      key: 'repeating_pattern',
      title: 'The current job may not explain all of it',
      body: [
        'You indicated that versions of this difficulty have appeared before.',
        'That does not make the current situation imaginary or unimportant. It suggests that changing the environment alone may not resolve the whole pattern.',
        'When the same kind of problem survives different jobs, managers, relationships or decisions, it becomes useful to look at what remains constant.',
      ],
    },
    C: {
      key: 'environment_and_pattern',
      title: 'There may be two things happening at once',
      body: [
        'Your current environment appears to be placing substantial pressure on you, and you also recognise versions of the same difficulty from elsewhere in your life.',
        'Those explanations do not compete.',
        'A demanding environment can activate an existing pattern, and an existing pattern can make a difficult environment more expensive to live inside.',
        'The useful work is separating the two closely enough that you do not blame yourself for the job or blame the job for everything.',
      ],
    },
    D: {
      key: 'mixed',
      title: 'The context is mixed',
      body: [
        'Your answers do not point cleanly to either the current environment or a repeating personal pattern.',
        'That is common.',
        'Most real situations contain both external constraints and something about how we respond to them. The distinction usually becomes clearer when we look at what changed, what happened next and whether similar situations have appeared before.',
      ],
    },
  };
  function contextCode(q16, q17) {
    if (q16 == null || q17 == null) return 'D';
    if (q16 >= 3 && q17 <= 1) return 'A';
    if (q16 >= 3 && q17 >= 2) return 'C';
    if (q17 >= 3 && q16 <= 2) return 'B';
    return 'D';
  }

  // ── Fixed result copy ──────────────────────────────────────────────────────
  const COPY = {
    eyebrow: 'Your result',
    h1: 'What stands out',
    h1Tie: 'Two areas stand out',
    intro: 'Your answers do not tell us what is “wrong” with you. They show where work appears to be creating the most friction right now.',
    primaryLabel: 'Strongest pattern',
    secondaryLabel: 'Also showing up',
    patternEyebrow: 'Your pattern',
    patternH2: 'Across the five areas',
    patternNote: 'These scores are useful for comparison with each other. They are not clinical severity scores.',
    contextEyebrow: 'Context',
    nextEyebrow: 'Next',
    nextH2: 'What to look at next',
    readingLabel: 'Relevant reading',
    considering: {
      label: 'Considering therapy',
      body: [
        'Not sure whether this is something you would bring to therapy?',
        'This page explains what sessions are like, how serious something needs to be and what usually happens in the first few sessions.',
      ],
      button: 'Considering therapy?',
      href: '/considering-therapy/',
    },
    // The email screen before the result (the engine's; only these two lines differ).
    gate: {
      text: 'Enter your email to see your result. A copy is emailed to you, and your answers also go privately to Aggelos, who reviews these himself.',
      note: 'Your individual answers are not sent to analytics. Your email is used to send you this result and is not added to any mailing list.',
    },
    delivery: {
      sent: 'A copy of your result is on its way to {email}.',
      failed: 'We couldn’t send your copy by email. Your result is available below.',
    },
    close: {
      h2: 'If this has been going on for a while',
      body: [
        'You can keep reading about the area that came up, or talk about the situation directly.',
        'You do not need to decide in advance whether the problem is “work”, “personal” or psychological. Start with what is actually happening.',
      ],
      primary: { label: 'Book a consultation', href: '/contact/' },
      secondary: 'Read the relevant page',
    },
    low: {
      h1: 'Nothing clearly dominates',
      lead: 'Your answers do not point strongly to one area.',
      body: [
        'That may mean the current difficulty is fairly contained, temporary or simply not captured particularly well by this check.',
        'It does not mean that nothing is wrong, and it does not mean that you need to find a problem.',
        'If something specific brought you here, start with that rather than trying to fit yourself into one of these categories.',
        'The most useful question may simply be:',
        '“What has changed recently that made me take this now?”',
      ],
      ctas: [
        { label: 'Explore the writing', href: '/blog/' },
        { label: 'Considering therapy?', href: '/considering-therapy/' },
      ],
    },
    restart: 'Start the check again',
  };

  // ── Questions ──────────────────────────────────────────────────────────────
  // Fifteen statements, three per area, on one five-point scale (s 0–4), then
  // the two context questions, which are not scored. A statement gets the
  // optional not-applicable answer only when its premise may not hold for
  // someone, and the wording names that premise; answering it drops the
  // statement from that area's score. Everywhere else "Not true" already
  // covers it:
  //   • decision 2 and 3 are about "that decision" / "the decision": for
  //     someone with no open decision they cannot apply. Decision 1 asks
  //     whether there is one, so "Not true" answers it.
  //   • relationship 1 and 3 are about tension and difficulty "at home", which
  //     presumes a shared home life. Relationship 2 ("people close to me")
  //     applies to anyone.
  //   • switching off, recovery, performance and the two context questions
  //     apply to anyone working.
  // Each area keeps at least one statement without the option.
  const TRUE_SCALE = ['Not true', 'Slightly true', 'Somewhat true', 'Mostly true', 'Very true'];
  const scale = (labels) => labels.map((t, s) => ({ t, s }));
  const q = (id, dim, text, na) => Object.assign({ id, dim, text, options: scale(TRUE_SCALE) }, na ? { na: true, naText: na } : {});
  const NO_DECISION = 'I am not facing a decision like this';
  const NO_HOME = 'This does not apply to my home life';
  const QUESTIONS = [
    q('wl_switching_1', 'switching', 'After the workday ends, I keep going over conversations, problems or tomorrow’s work in my head.'),
    q('wl_switching_2', 'switching', 'I check messages or updates outside working hours when nothing actually requires it.'),
    q('wl_switching_3', 'switching', 'When I am with other people, part of my attention is still on work.'),
    q('wl_recovery_1', 'recovery', 'Weekends and time off help less than they used to.'),
    q('wl_recovery_2', 'recovery', 'Keeping up my normal standard at work takes more effort than it used to.'),
    q('wl_recovery_3', 'recovery', 'Work that used to absorb me now takes pushing myself through.'),
    q('wl_decision_1', 'decision', 'An important decision about my work or career has stayed open for months.'),
    q('wl_decision_2', 'decision', 'More information or analysis no longer changes how I feel about that decision.', NO_DECISION),
    q('wl_decision_3', 'decision', 'Part of me is waiting for circumstances to make the decision for me.', NO_DECISION),
    q('wl_relationship_1', 'relationship', 'Work comes up in tension or arguments at home.', NO_HOME),
    q('wl_relationship_2', 'relationship', 'People close to me say, or show, that I am there but not really present.'),
    q('wl_relationship_3', 'relationship', 'When things at home feel difficult, work becomes the easier place to put my attention.', NO_HOME),
    q('wl_performance_1', 'performance', 'A setback at work affects how I feel about myself far more than its practical consequences.'),
    q('wl_performance_2', 'performance', 'A good result brings me relief more than satisfaction.'),
    q('wl_performance_3', 'performance', 'When someone in my field moves faster than me, it stays with me longer than I would like.'),
    {
      id: 'wl_q16', context: true,
      text: 'If your current job or company changed substantially tomorrow, how much of the problem do you think would improve?',
      options: scale(['None', 'A little', 'Some', 'Most', 'Almost all']),
    },
    {
      id: 'wl_q17', context: true,
      text: 'Have similar difficulties appeared in previous jobs, decisions or relationships?',
      options: scale(['Never', 'Once', 'A few times', 'Often', 'Very clearly']),
    },
  ];

  // ── Result logic ───────────────────────────────────────────────────────────
  // Low signal: every area in the engine's lowest band (clarityBracket 0,
  // scores 0–24). Tie: the top two areas have the same score at the engine's
  // precision (whole numbers 0–100).
  function interpret(ctx) {
    const dims = ctx.dims;
    const ranked = AREAS.map((a, i) => ({ area: a, order: i, score: dims[a.key].score == null ? 0 : dims[a.key].score }))
      .sort((x, y) => (y.score - x.score) || (x.order - y.order));
    const low = ranked.every((r) => window.clarityBracket(r.score) === 0);
    const tie = !low && ranked[0].score === ranked[1].score;
    const code = contextCode(ctx.answers.wl_q16, ctx.answers.wl_q17);
    const context = Object.assign({ code }, CONTEXTS[code]);
    const primary = ranked[0].area;
    const secondary = ranked[1].area;
    return {
      type: low ? 'low_signal' : tie ? 'tie' : 'normal',
      ranked,
      primary: low ? null : primary,
      secondary: low ? null : secondary,
      context,
      // for the engine's generic events and reports
      primaryKey: low ? 'low_signal' : primary.key,
    };
  }

  // What analytics and the notification call the outcome. Area names exactly
  // as displayed; the low-signal result by its heading.
  function outcome(r) {
    const i = r.interp;
    return {
      result_type: i.type,
      primary_result: i.primary ? i.primary.label : COPY.low.h1,
      secondary_result: i.secondary ? i.secondary.label : '',
      context_type: i.context.key,
    };
  }

  // ── Source attribution ─────────────────────────────────────────────────────
  // Links into the check carry ?source=<page>-<component>. The value is kept
  // for the session (so every event of this visit carries it), and the query
  // is taken out of the address bar once the page has loaded, leaving the
  // canonical URL. Without one: the referring page on this site, else
  // "external" or "direct".
  const SOURCE_KEY = 'wlc:source';
  const SOURCE = (function () {
    let src = null;
    try {
      const m = /[?&]source=([^&#]*)/.exec(window.location.search);
      if (m) src = decodeURIComponent(m[1]).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60) || null;
    } catch (err) { src = null; }
    if (src) {
      try { sessionStorage.setItem(SOURCE_KEY, src); } catch (err) { /* private mode */ }
      window.addEventListener('load', function () {
        try {
          const params = new URLSearchParams(window.location.search);
          params.delete('source');
          const rest = params.toString();
          window.history.replaceState(window.history.state, '', window.location.pathname + (rest ? '?' + rest : '') + window.location.hash);
        } catch (err) { /* leave the URL as it is */ }
      });
      return src;
    }
    try { src = sessionStorage.getItem(SOURCE_KEY); } catch (err) { src = null; }
    if (src) return src;
    try {
      if (!document.referrer) return 'direct';
      const ref = new URL(document.referrer);
      return ref.host === window.location.host ? 'page:' + ref.pathname : 'external';
    } catch (err) { return 'direct'; }
  })();

  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ source_page: SOURCE }, params || {}));
    } catch (err) { /* analytics is optional */ }
  }

  // The reading for a result: the primary area's pages; in a tie, both areas'
  // pages, each page once.
  function readingFor(i) {
    const list = i.type === 'tie' ? i.primary.pages.concat(i.secondary.pages) : i.primary.pages;
    return list.filter((p, n) => list.findIndex((x) => x.href === p.href) === n);
  }

  // ── The result as email fields ─────────────────────────────────────────────
  // One EmailJS template draws all three kinds of result (content/emails/
  // work-life-check-result.html). Every heading that differs between a normal,
  // a tied and a low-signal result travels as its own field, and a section a
  // result does not have travels empty, so the template needs no logic;
  // is_tie / is_low_signal are sent too, for a template that wants them.
  const plain = (t) => t.replace(/\*\*/g, '');
  const para = (list) => list.map(plain).join('\n\n');
  // The *_html twins: the same paragraphs as escaped markup, for the template's
  // {{{triple braces}}}, so paragraph breaks survive clients that ignore
  // white-space (Outlook on Windows). Only the check's own copy goes in them.
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const htmlText = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const paraHtml = (list) => list.map((t) => '<p style="margin:0 0 14px">' + htmlText(t) + '</p>').join('');
  const SCORE_FIELDS = [
    ['switching', 'switching_off_score'], ['recovery', 'recovery_score'], ['decision', 'decision_score'],
    ['relationship', 'relationship_score'], ['performance', 'performance_score'],
  ];
  const LOW_READING = [
    { title: 'Writing', href: '/blog/' },
    { title: 'Considering therapy', href: '/considering-therapy/' },
  ];
  const DISCLAIMER = 'This check is intended to give you a useful place to look, not a diagnosis or clinical score. It reflects how you answered today and should be read as context, not a label.';
  const SIGNATURE = 'Aggelos Mouzakitis\nBACP-Registered Integrative Psychotherapist\nPsychotherapy for men in tech, startups & demanding careers\n\naggelosmouzakitis.com';
  const Q16 = QUESTIONS.find((qq) => qq.id === 'wl_q16');
  const Q17 = QUESTIONS.find((qq) => qq.id === 'wl_q17');
  const answerText = (qq, a) => (a === 'na' ? 'N/A' : a == null ? '—' : (qq.options[a] ? qq.options[a].t : '—'));

  function emailVars(result, person) {
    const i = result.interp;
    const email = (person && person.email) || '';
    const first = ((person && person.name) || '').trim().split(/\s+/)[0] || '';
    const low = i.type === 'low_signal';
    const tie = i.type === 'tie';
    const pages = low ? LOW_READING : readingFor(i);
    const v = {
      user_email: email,
      to_email: email,
      greeting: first ? 'Hi ' + first + ',' : 'Hi,',
      email_subject: tie ? 'Your Work & Life Check results' : low ? 'Your Work & Life Check result' : 'Your Work & Life Check result: ' + i.primary.label,
      is_tie: tie ? 'true' : 'false',
      is_low_signal: low ? 'true' : 'false',
      intro_line: low ? '' : tie ? 'Two areas stand out equally in your answers:' : 'Your answers point most strongly towards:',
      pattern_label: low ? 'YOUR RESULT' : tie ? 'TWO AREAS STAND OUT' : 'YOUR STRONGEST PATTERN',
      primary_result_title: low ? COPY.low.h1 : tie ? '' : i.primary.label,
      tie_result_1: tie ? i.primary.label : '',
      tie_result_2: tie ? i.secondary.label : '',
      primary_lead: low ? COPY.low.lead : tie ? '' : i.primary.lead,
      what_label: low ? '' : 'WHAT THIS MAY MEAN',
      primary_interpretation: low ? para(COPY.low.body)
        : tie ? [i.primary, i.secondary].map((x) => x.label.toUpperCase() + '\n\n' + x.lead + '\n\n' + para(x.body)).join('\n\n\n')
          : para(i.primary.body),
      next_label: low ? '' : 'ONE THING TO LOOK AT NEXT',
      primary_next_question: low ? '' : para(i.primary.next),
      secondary_label: low || tie ? '' : 'ALSO SHOWING UP',
      secondary_result_title: low || tie ? '' : i.secondary.label,
      secondary_interpretation: low || tie ? '' : para(i.secondary.secondary),
      context_title: i.context.title,
      context_interpretation: para(i.context.body),
      related_page_title: pages[0].title,
      related_page_url: ORIGIN + pages[0].href,
      secondary_related_page_title: pages[1] ? pages[1].title : '',
      secondary_related_page_url: pages[1] ? ORIGIN + pages[1].href : '',
      consultation_intro: low ? '' : 'If you would rather talk about what is going on directly:',
      consultation_label: low ? '' : 'Book a consultation:',
      consultation_url: low ? '' : ORIGIN + COPY.close.primary.href,
      source_page: SOURCE,
    };
    SCORE_FIELDS.forEach(([key, field]) => {
      const r = i.ranked.find((x) => x.area.key === key);
      v[field] = (r ? r.score : 0) + '/100';
    });
    v.primary_interpretation_html = low ? paraHtml(COPY.low.body)
      : tie ? [i.primary, i.secondary].map((x) => '<p style="margin:0 0 8px;font-size:18px;font-weight:700;line-height:1.3;color:#14201C">' + esc(x.label) + '</p>' +
          '<p style="margin:0 0 14px;font-weight:600;color:#14201C">' + esc(x.lead) + '</p>' + paraHtml(x.body)).join('<p style="margin:0 0 14px">&nbsp;</p>')
        : paraHtml(i.primary.body);
    v.primary_next_question_html = low ? '' : paraHtml(i.primary.next);
    v.secondary_interpretation_html = low || tie ? '' : paraHtml(i.secondary.secondary);
    v.context_interpretation_html = paraHtml(i.context.body);
    v.result_text = resultText(v);
    return v;
  }

  // The same email as plain text, section by section, in the email's order:
  // what the person receives (result_text) and the body of the notification.
  function resultText(v) {
    const L = [];
    const block = (label, texts) => {
      const t = texts.filter(Boolean);
      if (!t.length) return;
      if (label) L.push(label);
      t.forEach((x) => L.push(x));
      L.push('');
    };
    L.push(v.greeting, '', 'Thanks for taking the Work & Life Check.', '');
    if (v.intro_line) L.push(v.intro_line, '');
    block(v.pattern_label, [v.primary_result_title, v.tie_result_1, v.tie_result_2, v.primary_lead]);
    block(v.what_label, [v.primary_interpretation]);
    block(v.next_label, [v.primary_next_question]);
    block(v.secondary_label, [v.secondary_result_title, v.secondary_interpretation]);
    block('YOUR FIVE-AREA PROFILE', [AREAS.map((x, n) => x.label + ':\n' + v[SCORE_FIELDS[n][1]]).join('\n\n')]);
    block('CONTEXT', [v.context_title, v.context_interpretation]);
    block('READ NEXT', [v.related_page_title + '\n' + v.related_page_url,
      v.secondary_related_page_title ? v.secondary_related_page_title + '\n' + v.secondary_related_page_url : '']);
    if (v.consultation_url) block('', [v.consultation_intro, v.consultation_label + '\n' + v.consultation_url]);
    L.push(DISCLAIMER, '', SIGNATURE);
    return L.join('\n');
  }

  function answersReport(answers) {
    return QUESTIONS.map((qq, n) => {
      const a = answers[qq.id];
      return (n + 1) + '. ' + qq.text + '\n   → ' + answerText(qq, a) +
        (qq.dim ? '  [' + AREA[qq.dim].label + (a != null && a !== 'na' ? ', ' + a + '/4' : '') + ']' : '  [context]');
    }).join('\n');
  }

  // ── The submission behind the email screen ─────────────────────────────────
  // One lead through window.submitLead (lead-capture.js), three independent
  // parts: the sheet row, the owner notification (the site's one owner
  // template) and the person's result email (WLC_RESULT_TEMPLATE,
  // To: {{user_email}}). The result is shown whatever happens to the email;
  // `delivery` tells the result screen whether the copy went out.
  const WLC_RESULT_TEMPLATE = 'template_gcj2lrd';
  const SHORT = { switching: 'Switching off', recovery: 'Recovery', decision: 'Decision', relationship: 'Relationship', performance: 'Performance' };

  function onSubmit(result, answers, person, reveal) {
    const i = result.interp;
    const o = outcome(result);
    const v = emailVars(result, person);
    const low = i.type === 'low_signal';
    const tie = i.type === 'tie';
    const title = low ? COPY.low.h1 : tie ? i.primary.label + ' + ' + i.secondary.label : i.primary.label;
    const secondary = low ? '—' : tie ? '— (tie: ' + i.secondary.label + ' shares the top score)' : i.secondary.label;
    const scores = SCORE_FIELDS.map(([key, field]) => SHORT[key] + ' ' + v[field].replace('/100', '')).join(' | ');
    const stamp = new Date().toISOString();
    const q16 = answerText(Q16, answers.wl_q16);
    const q17 = answerText(Q17, answers.wl_q17);
    const body = [
      'Email:          ' + person.email,
      'First name:     ' + (person.name || '—'),
      'Source:         ' + SOURCE,
      'Result type:    ' + i.type,
      'Primary:        ' + title,
      'Secondary:      ' + secondary,
      'Switching off:  ' + v.switching_off_score,
      'Recovery:       ' + v.recovery_score,
      'Decision:       ' + v.decision_score,
      'Relationship:   ' + v.relationship_score,
      'Performance:    ' + v.performance_score,
      'Q16:            ' + q16,
      'Q17:            ' + q17,
      'Context:        ' + i.context.key + ' — ' + i.context.title,
      'Timestamp:      ' + stamp,
      '',
      '── THE RESULT AS EMAILED TO THEM ──',
      v.result_text,
      '',
      '── ALL ANSWERS (verbatim) ──',
      answersReport(answers),
    ].join('\n');
    const finish = (recorded, res) => {
      const delivery = { email: person.email, reply: (res && res.reply) || 'failed', recorded: !!recorded };
      track('work_life_check_email', Object.assign({ email_delivery: delivery.reply }, o));
      reveal(delivery);
    };
    if (typeof window.submitLead !== 'function') { finish(false, null); return; }
    window.submitLead({
      source: 'work-life-check',
      detail: i.primaryKey,
      detailLabel: title,
      name: person.name || '',
      email: person.email,
      notes: 'Primary: ' + title + '\nSecondary: ' + secondary + '\nContext: ' + i.context.title + '\nScores: ' + scores,
      body,
      detailExtra: 'source=' + SOURCE + '; type=' + i.type + '; context=' + i.context.key + '; q16=' + q16 + '; q17=' + q17,
      params: {
        user_email: person.email, source_page: SOURCE,
        primary_result_title: title, secondary_result_title: secondary,
        switching_off_score: v.switching_off_score, recovery_score: v.recovery_score, decision_score: v.decision_score,
        relationship_score: v.relationship_score, performance_score: v.performance_score,
        environment_change_answer: q16, repeating_pattern_answer: q17,
        context_type: i.context.key, timestamp: stamp,
      },
      reply: { template: WLC_RESULT_TEMPLATE, params: v },
    }, finish);
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  const Arrow = () => e('span', { 'aria-hidden': 'true' }, '→');
  const rich = (t) => t.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, n) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    return m ? e('strong', { key: n }, m[1]) : part;
  });
  const quoted = (t) => /^“/.test(t);

  function Paras({ list, first }) {
    return list.map((t, n) => e('p', { key: n, className: (n === 0 && first) || quoted(t) ? 'wlc-emph' : 'wlc-p' }, rich(t)));
  }

  function TLink({ href, label, onClick, className }) {
    return e('a', { className: 'tlink' + (className ? ' ' + className : ''), href, onClick }, e('span', null, label), e(Arrow));
  }

  function Bars({ ranked, highlight }) {
    return e('ol', { className: 'wlc-bars' }, ranked.map((r) => {
      const on = highlight.indexOf(r.area.key) !== -1;
      return e('li', { key: r.area.key, className: 'wlc-bar' + (on ? ' is-on' : '') },
        e('div', { className: 'wlc-bar__row' },
          e('span', { className: 'wlc-bar__name' }, r.area.label),
          e('span', { className: 'wlc-bar__score' }, r.score + '/100')),
        e('div', { className: 'wlc-bar__track', 'aria-hidden': 'true' },
          e('span', { className: 'wlc-bar__fill', style: { width: Math.max(r.score, 1) + '%' } })));
    }));
  }

  // One context block, after the five-area profile (Q16 × Q17).
  function ContextBlock({ context }) {
    return e('section', { className: 'wlc-sec wlc-context', 'aria-labelledby': 'wlc-context-h' },
      e('p', { className: 'wlc-eyebrow' }, COPY.contextEyebrow),
      e('h2', { className: 'wlc-h2', id: 'wlc-context-h' }, context.title),
      e('div', { className: 'wlc-flow' }, e(Paras, { list: context.body })));
  }

  // Whether the emailed copy went out — one restrained line, never a blocker.
  function DeliveryNote({ delivery }) {
    if (!delivery) return null;
    return delivery.reply === 'ok'
      ? e('p', { className: 'wlc-delivery', role: 'status' }, COPY.delivery.sent.replace('{email}', delivery.email))
      : e('p', { className: 'wlc-delivery is-warn', role: 'status' }, COPY.delivery.failed);
  }

  function Result({ result, delivery, restart }) {
    const i = result.interp;
    const o = outcome(result);
    // Screen readers start at the result's heading, not wherever focus was.
    React.useEffect(() => {
      const h = document.getElementById('wlc-title');
      if (h) { try { h.focus({ preventScroll: true }); } catch (err) { /* older browsers */ } }
    }, []);
    const related = (href) => () => track('work_life_check_related_page_click', Object.assign({ link_url: href }, o));
    const consult = () => track('work_life_check_consultation_click', o);
    const style = e('style', { dangerouslySetInnerHTML: { __html: CSS } });
    const again = e('p', { className: 'wlc-again' },
      e('button', { type: 'button', className: 'wlc-again__btn', onClick: restart }, COPY.restart));

    if (i.type === 'low_signal') {
      return e('div', { className: 'wlc' }, style,
        e('header', { className: 'wlc-head' },
          e('p', { className: 'wlc-eyebrow' }, COPY.eyebrow),
          e('h1', { className: 'wlc-h1', id: 'wlc-title', tabIndex: -1 }, COPY.low.h1),
          e(DeliveryNote, { delivery })),
        e('div', { className: 'wlc-flow wlc-first' },
          e('p', { className: 'wlc-emph' }, COPY.low.lead),
          e(Paras, { list: COPY.low.body })),
        e('div', { className: 'wlc-actions' }, COPY.low.ctas.map((c) => e(TLink, { key: c.href, href: c.href, label: c.label, onClick: related(c.href) }))),
        e('section', { className: 'wlc-sec', 'aria-labelledby': 'wlc-pattern-h' },
          e('p', { className: 'wlc-eyebrow' }, COPY.patternEyebrow),
          e('h2', { className: 'wlc-h2', id: 'wlc-pattern-h' }, COPY.patternH2),
          e(Bars, { ranked: i.ranked, highlight: [] }),
          e('p', { className: 'wlc-note' }, COPY.patternNote)),
        e(ContextBlock, { context: i.context }),
        again);
    }

    const tie = i.type === 'tie';
    const main = i.primary;
    const pages = readingFor(i);
    const areaBlock = (a, idx, labelled) => e('section', { key: a.key, className: 'wlc-area' + (idx ? ' wlc-area--next' : ''), 'aria-labelledby': 'wlc-area-' + a.key },
      labelled ? e('p', { className: 'wlc-label' }, COPY.primaryLabel) : null,
      e('h2', { className: 'wlc-title', id: 'wlc-area-' + a.key }, a.label),
      !tie ? e('p', { className: 'wlc-also' },
        e('span', { className: 'wlc-label' }, COPY.secondaryLabel), ' ',
        e('span', { className: 'wlc-also__title' }, i.secondary.label)) : null,
      e('div', { className: 'wlc-flow wlc-area__text' },
        e('p', { className: 'wlc-emph' }, a.lead),
        e(Paras, { list: a.body })));

    return e('div', { className: 'wlc' }, style,
      // 1–2. What stands out
      e('header', { className: 'wlc-head' },
        e('p', { className: 'wlc-eyebrow' }, COPY.eyebrow),
        e('h1', { className: 'wlc-h1', id: 'wlc-title', tabIndex: -1 }, tie ? COPY.h1Tie : COPY.h1),
        e('p', { className: 'wlc-intro' }, COPY.intro),
        e(DeliveryNote, { delivery })),
      // 3–4. Primary pattern and its interpretation (both, equally, in a tie)
      e('div', { className: 'wlc-areas' + (tie ? ' wlc-areas--tie' : '') },
        tie ? [areaBlock(i.primary, 0, false), areaBlock(i.secondary, 1, false)] : areaBlock(main, 0, true)),
      // 5. Secondary, visibly smaller
      !tie ? e('section', { className: 'wlc-sec wlc-secondary', 'aria-label': COPY.secondaryLabel + ': ' + i.secondary.label },
        e('p', { className: 'wlc-eyebrow' }, COPY.secondaryLabel),
        e('div', { className: 'wlc-flow' }, e(Paras, { list: i.secondary.secondary }))) : null,
      // 6. Five-area profile
      e('section', { className: 'wlc-sec', 'aria-labelledby': 'wlc-pattern-h' },
        e('p', { className: 'wlc-eyebrow' }, COPY.patternEyebrow),
        e('h2', { className: 'wlc-h2', id: 'wlc-pattern-h' }, COPY.patternH2),
        e(Bars, { ranked: i.ranked, highlight: tie ? [i.primary.key, i.secondary.key] : [i.primary.key] }),
        e('p', { className: 'wlc-note' }, COPY.patternNote)),
      // 7. Context
      e(ContextBlock, { context: i.context }),
      // 8. What to look at next + relevant reading
      e('section', { className: 'wlc-sec', 'aria-labelledby': 'wlc-next-h' },
        e('p', { className: 'wlc-eyebrow' }, COPY.nextEyebrow),
        e('h2', { className: 'wlc-h2', id: 'wlc-next-h' }, COPY.nextH2),
        e('div', { className: 'wlc-flow wlc-question' }, e(Paras, { list: main.next })),
        e('div', { className: 'wlc-cards' },
          e('div', { className: 'wlc-card' },
            e('p', { className: 'wlc-label' }, COPY.readingLabel),
            pages.map((p) => e('div', { key: p.href, className: 'wlc-read' },
              e('h3', { className: 'wlc-h3' }, p.title),
              e('div', { className: 'wlc-card__links' }, e(TLink, { href: p.href, label: p.button, onClick: related(p.href) }))))),
          e('div', { className: 'wlc-card' },
            e('p', { className: 'wlc-label' }, COPY.considering.label),
            e('div', { className: 'wlc-flow' }, COPY.considering.body.map((t, n) => e('p', { key: n, className: 'wlc-p' }, t))),
            e('div', { className: 'wlc-card__links' }, e(TLink, { href: COPY.considering.href, label: COPY.considering.button, onClick: related(COPY.considering.href) }))))),
      // 9. Consultation
      e('section', { className: 'wlc-close on-dark', 'aria-labelledby': 'wlc-close-h' },
        e('h2', { className: 'wlc-h2', id: 'wlc-close-h' }, COPY.close.h2),
        e('div', { className: 'wlc-flow' }, COPY.close.body.map((t, n) => e('p', { key: n, className: 'wlc-p' }, t))),
        e('div', { className: 'wlc-actions' },
          e('a', { className: 'btn', href: COPY.close.primary.href, onClick: consult }, COPY.close.primary.label, ' ', e(Arrow)),
          e(TLink, { href: pages[0].href, label: COPY.close.secondary, onClick: related(pages[0].href) }))),
      again);
  }

  // ── Styles (the site's tokens from site-chrome.jsx; the site's type scale) ─
  const CSS = `
.wlc{color:var(--body);font-family:var(--font-body)}
.wlc-eyebrow{margin:0 0 14px;font-size:13px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
.wlc-label{margin:0;font-size:12.5px;font-weight:700;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--meta)}
.wlc-h1{margin:0;font-family:var(--font-display);font-weight:400;font-size:clamp(34px,calc(22px + 2.9vw),56px);line-height:1.0;letter-spacing:-.04em;color:var(--heading);text-wrap:balance;outline:none}
.wlc-intro{margin:22px 0 0;max-width:32em;font-size:clamp(18px,calc(17.4px + .15vw),19.5px);line-height:1.55;color:var(--body);text-wrap:pretty}
.wlc-h2{margin:0 0 20px;font-family:var(--font-heading);font-size:clamp(26px,calc(22px + 1vw),34px);font-weight:800;line-height:1.1;letter-spacing:-.03em;color:var(--heading);text-wrap:balance}
.wlc-h3{margin:0 0 12px;font-family:var(--font-heading);font-size:clamp(20px,calc(19px + .3vw),22.5px);font-weight:700;line-height:1.2;letter-spacing:-.018em;color:var(--heading);text-wrap:balance}
.wlc-p{margin:0;max-width:36em;font-size:clamp(17px,calc(16px + .14vw),18px);line-height:1.7;color:var(--body);text-wrap:pretty}
.wlc-p strong{font-weight:600;color:var(--heading)}
.wlc-emph{margin:0;max-width:32em;font-size:clamp(19px,calc(18.4px + .14vw),20.5px);font-weight:550;line-height:1.45;color:var(--heading);text-wrap:pretty}
.wlc-flow>*{margin-top:0;margin-bottom:0}
.wlc-flow>*+*{margin-top:18px}
.wlc-flow>.wlc-emph+*{margin-top:20px}
.wlc-first{margin-top:28px}
.wlc-sec{margin-top:clamp(56px,6vw,80px)}
.wlc-note{margin:18px 0 0;max-width:36em;font-size:15px;line-height:1.55;color:var(--meta)}
.wlc-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px 28px;margin-top:28px}

/* 3–4. The strongest pattern: the title at display weight, the reading below */
.wlc-areas{margin-top:clamp(36px,4vw,48px);border-top:3px solid var(--green)}
.wlc-area{padding-top:24px}
.wlc-area--next{margin-top:clamp(48px,5vw,64px);padding-top:24px;border-top:3px solid var(--green)}
.wlc-title{margin:8px 0 0;font-family:var(--font-heading);font-size:clamp(30px,calc(24px + 1.6vw),44px);font-weight:800;line-height:1.06;letter-spacing:-.035em;color:var(--heading);text-wrap:balance}
.wlc-areas--tie .wlc-title{margin-top:0}
.wlc-also{margin:16px 0 0;padding:14px 0;border-block:1px solid var(--rule-2);display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px}
.wlc-also__title{font-size:18px;font-weight:600;line-height:1.35;color:var(--ink-2)}
.wlc-area__text{margin-top:28px}

/* 5. Secondary: body size, set off, clearly second */
.wlc-secondary{padding:22px 24px 24px;background:var(--bone-deep);border-left:2px solid var(--sage)}
.wlc-secondary .wlc-eyebrow{color:var(--meta)}

/* 6. Five-area bars: one hue, the strongest area(s) marked */
.wlc-bars{list-style:none;margin:8px 0 0;padding:0}
.wlc-bar{padding:14px 0 16px;border-top:1px solid var(--rule)}
.wlc-bar:last-child{border-bottom:1px solid var(--rule)}
.wlc-bar__row{display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:10px}
.wlc-bar__name{font-size:16.5px;font-weight:500;line-height:1.35;color:var(--ink-2)}
.wlc-bar__score{flex:0 0 auto;font-size:14.5px;font-weight:600;color:var(--meta);font-variant-numeric:tabular-nums}
.wlc-bar__track{height:8px;background:rgba(23,25,25,.08);border-radius:999px;overflow:hidden}
.wlc-bar__fill{display:block;height:8px;background:var(--sage);border-radius:999px}
.wlc-bar.is-on .wlc-bar__name{font-weight:700;color:var(--heading)}
.wlc-bar.is-on .wlc-bar__score{color:var(--heading)}
.wlc-bar.is-on .wlc-bar__fill{background:var(--green)}

/* 8. Next */
.wlc-question{padding-left:18px;border-left:2px solid var(--green)}
.wlc-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:32px}
.wlc-card{min-width:0;padding:22px 22px 18px;border-top:1px solid rgba(23,25,25,.3);background:rgba(237,232,219,.55)}
.wlc-card .wlc-label{margin-bottom:12px}
.wlc-card .wlc-p{font-size:16.5px;line-height:1.6}
.wlc-card__links{display:flex;flex-direction:column;align-items:flex-start;gap:0;margin-top:10px}
.wlc-card .wlc-h3{margin-bottom:4px}
.wlc-read+.wlc-read{margin-top:18px;padding-top:16px;border-top:1px solid var(--rule)}
@media (max-width:659px){.wlc-cards{grid-template-columns:minmax(0,1fr)}}

/* The emailed copy: one restrained line under the intro */
.wlc-delivery{margin:18px 0 0;max-width:36em;font-size:15px;line-height:1.5;color:var(--meta)}
.wlc-delivery.is-warn{padding:12px 14px;border-left:3px solid #B7791F;background:rgba(183,121,31,.08);font-weight:600;color:var(--heading)}

/* 9. Consultation */
.wlc-close{margin-top:clamp(56px,6vw,80px);padding:clamp(28px,4vw,44px);background:var(--forest);color:var(--bone)}
.wlc-close .wlc-h2{color:var(--bone)}
.wlc-close .wlc-p{color:var(--on-forest)}
.wlc-again{margin:32px 0 0}
.wlc-again__btn{min-height:44px;padding:0;background:none;border:0;font:inherit;font-size:15px;font-weight:600;color:var(--meta);border-bottom:1px solid currentColor;cursor:pointer}
.wlc-again__btn:hover{color:var(--heading)}
@media (max-width:599px){.wlc .btn{white-space:normal;text-align:center}}
`;

  // ── Registration ───────────────────────────────────────────────────────────
  window.CLARITY_DATA = window.CLARITY_DATA || {};
  window.CLARITY_DATA[SLUG] = {
    slug: SLUG,
    title: 'What is work actually costing you?',
    emailName: 'The Work & Life Check',
    intro: {
      eyebrow: 'The Work & Life Check',
      paras: ['You may still be performing well. This short check looks at what happens outside the visible output: whether work stays in your head, recovery has changed, a decision will not close, or professional outcomes have started carrying more psychological weight than you want.'],
      note: 'This is a reflection tool, not a clinical assessment or diagnosis.',
      count: '17 questions',
      time: 'About 4 minutes',
      // emailNote: the engine's line, as on the other diagnostics — an email
      // is asked for at the end, before the result.
      start: 'Start the check →',
    },
    scaleHint: 'How true is this for you at the moment?',
    dimensions: AREAS.map((a) => ({ key: a.key, label: a.label, type: 'problem' })),
    questions: QUESTIONS,
    interpret,
    // Engine hooks (clarity-tools.jsx): scored as soon as the last answer is in;
    // the engine's email screen, then this check's own submission; the
    // unlocked result stays for the session; drawn by Result.
    gate: COPY.gate,
    onSubmit,
    keepResult: true,
    Result,
    onView: () => track('work_life_check_view'),
    onStart: () => track('work_life_check_start'),
    onComplete: (result) => track('work_life_check_complete', outcome(result)),
  };

  // For tests and QA only.
  window.WLC = { AREAS, CONTEXTS, COPY, QUESTIONS, contextCode, interpret, outcome, readingFor, emailVars, resultText, source: () => SOURCE, TEMPLATE: WLC_RESULT_TEMPLATE };
})();
