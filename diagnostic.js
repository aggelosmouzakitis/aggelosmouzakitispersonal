// diagnostic.jsx — Interactive burnout diagnostic with EmailJS + Google Sheets tracking

const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby-gv3oCFT2q5KXvVnqRzS4PAzcMjPB8Gls5qodZJ3v4_9HKGqJHMdBCw7YYbEzIE2d/exec';
if (window.emailjs) {
  emailjs.init({
    publicKey: 'bfBcHLXj2nKaev_lT'
  });
}
const DIAG_SECTIONS = [{
  id: 'self-worth',
  title: 'Self-worth through achievement',
  sheetKey: 'self_worth',
  questions: ['A bad period at work can mess with my confidence significantly.', 'When I am not doing well professionally, I tend to become harsher on myself.', 'It is easier to feel good about myself when things are going well professionally.']
}, {
  id: 'shame-guilt-pressure',
  title: 'Shame, guilt, and pressure',
  sheetKey: 'shame_guilt_pressure',
  questions: ['I find it hard to relax when there is still work to be done.', 'I can sit down to rest and still feel like I should be productive.', 'I tend to focus on what is still missing.']
}, {
  id: 'comparison',
  title: 'Comparison, shame, and not-enoughness',
  sheetKey: 'comparison',
  questions: ['Seeing other people do well makes me worry about my performance.', 'When someone in my close network is moving fast, I tend to think about where I am falling short.', 'I can have objectively good results and still feel behind my goals.']
}, {
  id: 'vulnerability',
  title: 'Fear of vulnerability',
  sheetKey: 'vulnerability',
  questions: ['I feel uneasy with the idea of people close to me seeing me weak.', 'If I am struggling, my instinct is usually to keep it to myself.', 'I would rather deal with something alone than let people see me unsure or messy.']
}, {
  id: 'grind',
  title: 'Pride in grind and pressure',
  sheetKey: 'grind',
  questions: ['I am used to carrying a lot without complaining about it.', 'Part of me takes pride in how much pressure I can handle.', 'Slowing down can feel uncomfortable, even when it seems like I need it.']
}, {
  id: 'identity',
  title: 'Identity and persona',
  sheetKey: 'identity',
  questions: ['People know me as someone who gets things done.', 'Being capable is a big part of how I see myself.', 'Letting people down hits me hard, especially when they expect a lot from me.', 'People often tell me I am too hard on myself or that I push myself too much.']
}, {
  id: 'relationships',
  title: 'Interpersonal relationships',
  sheetKey: 'relationships',
  questions: ['When work is heavy, I have less patience for people who do not get it.', 'When I am stressed, I can become harder to interact with.', 'There are times when I feel too loaded to really be present with other people.', 'My relationship with my partner has suffered because of how I carry stress.', 'There are times when I feel distant from my partner, or they feel unsupported by me.']
}, {
  id: 'drive-meaning',
  title: 'Loss of drive and meaning',
  sheetKey: 'drive_meaning',
  questions: ['I have started feeling resentful about parts of work I used to take pride in.', 'I miss the times when work felt easier to enjoy.']
}, {
  id: 'numbness',
  title: 'Emotional numbness and detachment',
  sheetKey: 'numbness',
  questions: ['I can get through a full day and still feel emotionally flat.', 'Things that used to matter to me do not land the same way now.', 'I can be productive and still feel disconnected from what I am doing.', 'I often feel less like myself and more like I am just operating.', 'There are moments when I wonder what all this effort is really for.']
}, {
  id: 'cynicism',
  title: 'Cynicism and depersonalisation',
  sheetKey: 'cynicism',
  questions: ['I have become more cynical about work than I used to be.', 'Some parts of work now feel mechanical, even when I do them well.', 'There are moments when I feel more detached than engaged.']
}, {
  id: 'nervous-system',
  title: 'Nervous-system overload',
  sheetKey: 'nervous_system',
  questions: ['I can be tired and still feel unable to fully settle.', 'Sleep does not always leave me feeling properly reset.', 'Stress has started showing up in my body through things like headaches, muscle tension, stomach issues, nausea, or similar symptoms.', 'My body can stay tense even when I am not actively working.']
}, {
  id: 'tech-activation',
  title: 'Tech-specific constant activation',
  sheetKey: 'tech_activation',
  questions: ['Even when I am off, part of me still feels on call.', 'I check work things in moments that should be personal time.', 'It is hard for me to feel fully off duty.', 'My mind stays connected to work more than I want.', 'I feel a pull to reply quickly even when I do not have to.', 'I often turn to AI, self-help content, or similar inputs to figure myself out, but it rarely leads to real change.', 'I consume advice about burnout, stress, or performance, but still find myself stuck in the same patterns.']
}];
const FLAT_QUESTIONS = [];
DIAG_SECTIONS.forEach(section => {
  section.questions.forEach((text, index) => {
    FLAT_QUESTIONS.push({
      key: section.id + '-' + index,
      sectionId: section.id,
      sectionTitle: section.title,
      text
    });
  });
});
const SCALE = [{
  value: 1,
  label: 'Strongly disagree'
}, {
  value: 2,
  label: 'Disagree'
}, {
  value: 3,
  label: 'Neither agree nor disagree'
}, {
  value: 4,
  label: 'Agree'
}, {
  value: 5,
  label: 'Strongly agree'
}, {
  value: 'na',
  label: 'N/A'
}];
function avg(vals) {
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function getGrade(score) {
  if (score === null) return 'Insufficient data';
  if (score <= 2.25) return 'Level 1 — Stable but stretched';
  if (score <= 2.9) return 'Level 2 — Performing at a cost';
  if (score <= 3.5) return 'Level 3 — High-functioning depletion';
  return 'Level 4 — Fulfilment breakdown';
}
function getDesc(score) {
  if (score === null) return 'There is not enough data to score this assessment yet.';
  if (score <= 2.25) return 'You are still functioning, but some parts of your operating system are starting to show strain. This is not crisis repair. It is prevention, self-awareness, and small adjustments before the cost grows.';
  if (score <= 2.9) return 'You are still delivering, but success is starting to cost you more than it gives back. You may notice emotional fatigue, slower recovery, more irritability, less fulfilment, or a stronger dependence on achievement to feel okay.';
  if (score <= 3.5) return 'You may still look capable from the outside, but internally your system is under significant load. This is where emotional flatness, avoidance, relationship strain, and nervous-system overload become harder to ignore.';
  return 'At this stage the issue is no longer only stress. The way you are operating may be disconnected from your wellbeing, values, body, relationships, and sense of self. The goal is not simply to rest more — it is to rebuild your relationship with ambition and success.';
}
function getSectionLabel(score) {
  if (score === null) return 'Insufficient data';
  if (score <= 2.5) return 'Low';
  if (score <= 3.2) return 'Elevated';
  return 'High';
}

// Colour + fill for the per-dimension level bar (display-only).
function getLevelVisual(score) {
  if (score === null) return {
    color: '#bbb',
    pct: 0
  };
  const pct = Math.max(0, Math.min(100, (score - 1) / 4 * 100));
  if (score <= 2.5) return {
    color: '#1a7f37',
    pct
  };
  if (score <= 3.2) return {
    color: '#d9a200',
    pct
  };
  return {
    color: '#c0392b',
    pct
  };
}
function fmt(score) {
  return score === null ? 'N/A' : score.toFixed(2);
}

// Display-only grouping: the 12 scored sections roll up into 7 dimensions for the
// on-screen result. The Sheet + EmailJS payloads still use the original 12 sections,
// so no automation changes are needed. Each dimension carries three copy variants
// (low / elevated / high) so the interpretation flexes with the person's score.
const DIMENSIONS = [{
  id: 'achievement-self-worth',
  title: 'Achievement & self-worth',
  sectionIds: ['self-worth', 'comparison'],
  base: 'How strongly your sense of worth is tied to achievement, progress, and external performance.',
  interps: {
    low: 'Your worth doesn’t seem to live or die by the last result. That’s a stable base most high performers don’t have.',
    elevated: 'Your sense of worth is leaning on achievement more than you might like. Good periods lift you; bad ones cut deeper than the facts justify.',
    high: 'Right now your worth is closely fused with performance. Wins reassure briefly, setbacks feel personal, and the bar keeps moving. This is the engine underneath a lot of the rest.'
  }
}, {
  id: 'pressure-internal-demand',
  title: 'Pressure & internal demand',
  sectionIds: ['shame-guilt-pressure', 'grind'],
  base: 'How much pressure you create internally, even when no one is directly demanding more from you.',
  interps: {
    low: 'You can ease off without guilt running the show. The pressure you carry looks mostly external, not self-generated.',
    elevated: 'A fair amount of your pressure is self-imposed. Rest comes with a tax, and "enough" keeps getting redefined upward.',
    high: 'Most of the pressure is coming from inside. Slowing down feels unsafe rather than restorative, and the demand rarely lets up even when the work does.'
  }
}, {
  id: 'identity-vulnerability',
  title: 'Identity & vulnerability',
  sectionIds: ['identity', 'vulnerability'],
  base: 'How much your professional identity depends on being capable, composed, and hard to disappoint.',
  interps: {
    low: 'You can be seen as unsure or struggling without it threatening who you are. That flexibility is protective.',
    elevated: 'Being the capable, composed one matters enough that showing strain feels risky. You likely carry more alone than you need to.',
    high: 'Your identity is heavily invested in being capable and hard to disappoint. Vulnerability feels dangerous, so the strain stays hidden — which is exactly what keeps it going.'
  }
}, {
  id: 'emotional-availability',
  title: 'Emotional availability & relationships',
  sectionIds: ['relationships'],
  base: 'Whether your current operating mode is reducing your emotional availability outside work.',
  interps: {
    low: 'Work pressure isn’t obviously bleeding into how present you are with the people close to you.',
    elevated: 'Some of the load is spilling into your relationships — less patience, less presence, a shorter fuse than you’d want.',
    high: 'Your operating mode is costing you outside work. The people closest to you are likely getting the depleted version, and that gap tends to compound.'
  }
}, {
  id: 'meaning-fulfilment',
  title: 'Meaning & fulfilment',
  sectionIds: ['drive-meaning', 'numbness', 'cynicism'],
  base: 'Whether success is still emotionally rewarding, or whether you are performing without enough meaning or satisfaction.',
  interps: {
    low: 'The work still gives something back. You’re not just performing on momentum — there’s real engagement here.',
    elevated: 'The reward is thinning out. You’re still delivering, but more of it feels like motion than meaning, and the satisfaction doesn’t land like it used to.',
    high: 'This is the one that matters most for fulfilment. Success isn’t paying you back emotionally right now — flatness, detachment, and "what is this all for?" are showing up underneath the output.'
  }
}, {
  id: 'nervous-system-load',
  title: 'Nervous-system load',
  sectionIds: ['nervous-system'],
  base: 'How much your body is carrying the pressure, even when your mind thinks you are managing.',
  interps: {
    low: 'Your body seems to be recovering reasonably well. The system isn’t stuck in a constant state of activation.',
    elevated: 'Your body is holding some of this — tension, uneven sleep, a hum that doesn’t fully switch off. Recovery isn’t quite keeping up.',
    high: 'Your nervous system is under real load. Tired-but-wired, poor recovery, physical symptoms — the body is signalling what the mind is overriding. This rarely resolves with willpower alone.'
  }
}, {
  id: 'tech-activation',
  title: 'Tech-specific activation',
  sectionIds: ['tech-activation'],
  base: 'How much your work environment keeps you mentally and physiologically activated, even off the clock.',
  interps: {
    low: 'You can get genuinely off-duty. Work isn’t keeping a permanent background process running in your head.',
    elevated: 'You’re rarely fully off. Part of you stays on call, checking, half-connected — which quietly blocks real recovery.',
    high: 'You’re almost always activated. Fully switching off feels out of reach, and the constant low-grade "on" state is one of the harder patterns to interrupt without a deliberate approach.'
  }
}];
function pickInterp(dim, score) {
  if (score === null) return dim.base;
  if (score <= 2.5) return dim.interps.low;
  if (score <= 3.2) return dim.interps.elevated;
  return dim.interps.high;
}

// Roll the 12 section results into the 7 display dimensions, scoring each dimension
// from the underlying question answers (not an average-of-averages).
function getDimensionResults(sections, answers) {
  return DIMENSIONS.map(dim => {
    const keys = [];
    dim.sectionIds.forEach(sid => {
      const section = DIAG_SECTIONS.find(s => s.id === sid);
      if (section) section.questions.forEach((_, i) => keys.push(sid + '-' + i));
    });
    const nums = keys.map(k => answers[k]).filter(v => typeof v === 'number');
    const answeredCount = keys.filter(k => answers[k] !== undefined).length;
    const threshold = Math.ceil(keys.length * 0.7);
    const score = answeredCount >= threshold ? avg(nums) : null;
    return {
      id: dim.id,
      title: dim.title,
      interp: pickInterp(dim, score),
      score,
      label: getSectionLabel(score)
    };
  });
}

// Per-level "what to do with this" beat, in fulfilment language (display-only).
function getNextStep(score) {
  if (score === null) return '';
  if (score <= 2.25) return 'The useful move here is prevention: notice which areas are starting to draw down, and adjust before the cost climbs.';
  if (score <= 2.9) return 'This is the stage where small structural and internal shifts pay off most — before "performing at a cost" hardens into something heavier.';
  if (score <= 3.5) return 'At this level, managing symptoms usually isn’t enough. The work is to address what’s driving the load underneath — identity, pressure, recovery — not just to rest harder.';
  return 'This isn’t a willpower problem and rest alone won’t resolve it. The work is to rebuild your relationship with ambition and success so it stops costing you this much.';
}

// Highest-load dimension, for the headline line on the result screen (display-only).
function getTopDimension(dimensions) {
  const scored = (dimensions || []).filter(d => typeof d.score === 'number');
  if (!scored.length) return null;
  return scored.reduce((top, d) => d.score > top.score ? d : top, scored[0]);
}
function DiagnosticPage() {
  const {
    useState,
    useRef
  } = React;
  const [screen, setScreen] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);
  const mainRef = useRef(null);
  const scrollTop = () => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };
  const totalQ = FLAT_QUESTIONS.length;
  const answered = Object.keys(answers).filter(k => answers[k] !== undefined).length;
  const progress = Math.round(answered / totalQ * 100);
  function getOverallScore() {
    const nums = Object.values(answers).filter(v => typeof v === 'number');
    return avg(nums);
  }
  function getSectionResults() {
    return DIAG_SECTIONS.map(section => {
      const keys = section.questions.map((_, i) => section.id + '-' + i);
      const nums = keys.map(k => answers[k]).filter(v => typeof v === 'number');
      const answeredCount = keys.filter(k => answers[k] !== undefined).length;
      const threshold = Math.ceil(keys.length * 0.7);
      const score = answeredCount >= threshold ? avg(nums) : null;
      return {
        id: section.id,
        title: section.title,
        sheetKey: section.sheetKey,
        score,
        label: getSectionLabel(score)
      };
    });
  }
  function buildSectionBreakdownText(sections) {
    return sections.map(section => {
      return section.title + ': ' + section.label + ' (' + fmt(section.score) + ' / 5.00)';
    }).join('\n');
  }
  function buildAnswersText() {
    return FLAT_QUESTIONS.map((question, index) => {
      const answer = answers[question.key];
      const answerLabel = answer === undefined ? 'No answer' : answer === 'na' ? 'N/A' : String(answer);
      return index + 1 + '. [' + question.sectionTitle + '] ' + question.text + ' => ' + answerLabel;
    }).join('\n');
  }
  function calculateResults() {
    const overall = getOverallScore();
    const sections = getSectionResults();
    const dimensions = getDimensionResults(sections, answers);
    // Sort by severity (highest load first); unscored dimensions sink to the bottom.
    const sortedDimensions = [...dimensions].sort((a, b) => {
      const av = typeof a.score === 'number' ? a.score : -1;
      const bv = typeof b.score === 'number' ? b.score : -1;
      return bv - av;
    });
    return {
      overall,
      grade: getGrade(overall),
      desc: getDesc(overall),
      nextStep: getNextStep(overall),
      sections,
      dimensions: sortedDimensions,
      topDimension: getTopDimension(dimensions)
    };
  }
  function sendResultsEmail(payload) {
    if (!window.emailjs) {
      return Promise.reject(new Error('EmailJS is not loaded'));
    }
    return emailjs.send('service_i4xq7vg', 'template_wdsrbdo', payload);
  }
  function sendResultsToSheet(calculated, trimmedEmail) {
    const sectionScores = {};
    calculated.sections.forEach(section => {
      sectionScores[section.sheetKey] = fmt(section.score);
    });
    return fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        email: trimmedEmail,
        overall_score: fmt(calculated.overall),
        overall_grade: calculated.grade,
        self_worth: sectionScores.self_worth || '',
        shame_guilt_pressure: sectionScores.shame_guilt_pressure || '',
        comparison: sectionScores.comparison || '',
        vulnerability: sectionScores.vulnerability || '',
        grind: sectionScores.grind || '',
        identity: sectionScores.identity || '',
        relationships: sectionScores.relationships || '',
        drive_meaning: sectionScores.drive_meaning || '',
        numbness: sectionScores.numbness || '',
        cynicism: sectionScores.cynicism || '',
        nervous_system: sectionScores.nervous_system || '',
        tech_activation: sectionScores.tech_activation || '',
        section_breakdown: buildSectionBreakdownText(calculated.sections),
        all_answers: buildAnswersText(),
        page_url: window.location.href
      })
    });
  }
  function handleShowResults() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    const calculated = calculateResults();
    setSending(true);
    sendResultsToSheet(calculated, trimmedEmail).catch(err => console.error('Sheet error:', err));
    sendResultsEmail({
      user_email: trimmedEmail,
      overall_score: fmt(calculated.overall),
      overall_grade: calculated.grade,
      section_breakdown: buildSectionBreakdownText(calculated.sections),
      all_answers: buildAnswersText(),
      page_url: window.location.href
    }).catch(err => console.error('Email error:', err));
    setResults(calculated);
    setScreen('results');
    setTimeout(scrollTop, 50);
    setSending(false);
  }
  const currentQ = FLAT_QUESTIONS[idx];
  const currentAnswer = answers[currentQ?.key];
  const C = {
    page: {
      maxWidth: 740,
      margin: '0 auto',
      padding: '4rem 2rem 7rem',
      color: '#282726',
      fontFamily: 'inherit'
    },
    eyebrow: {
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#666',
      lineHeight: 1.7
    },
    h1: {
      fontSize: '32px',
      fontWeight: 400,
      lineHeight: 1.35,
      color: '#282726',
      marginBottom: '1.5rem'
    },
    p: {
      marginBottom: '1.4rem',
      lineHeight: 1.75,
      fontSize: '18px',
      color: '#282726'
    },
    card: {
      border: '1px solid rgba(40,39,38,.15)',
      padding: '1rem'
    },
    note: {
      fontSize: '14px',
      color: '#777',
      lineHeight: 1.7
    },
    cta: {
      fontFamily: 'inherit',
      fontSize: '12px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      background: '#282726',
      border: '1px solid #282726',
      padding: '.8rem 1.2rem',
      display: 'inline-block',
      cursor: 'pointer'
    },
    ctaSec: {
      background: 'transparent',
      color: '#282726',
      borderColor: 'rgba(40,39,38,.3)'
    },
    optionBtn: selected => ({
      width: '100%',
      textAlign: 'left',
      border: selected ? '1px solid #1a7f37' : '1px solid rgba(40,39,38,.15)',
      padding: '1rem',
      borderRadius: '8px',
      background: selected ? '#1a7f37' : 'transparent',
      color: selected ? '#fff' : '#282726',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: 1.7,
      cursor: 'pointer',
      marginBottom: '.75rem'
    }),
    progressLine: {
      height: '1px',
      background: 'rgba(40,39,38,.12)',
      position: 'relative',
      marginTop: '.8rem'
    },
    progressFill: pct => ({
      height: '1px',
      background: '#1a7f37',
      width: pct + '%',
      transition: 'width .2s ease'
    }),
    sectionRow: {
      border: '1px solid rgba(40,39,38,.15)',
      padding: '1rem',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '1rem',
      marginBottom: '.75rem'
    },
    footer: {
      marginTop: '3rem',
      fontSize: '14px',
      color: '#777'
    }
  };
  if (screen === 'intro') return /*#__PURE__*/React.createElement("div", {
    style: C.page,
    ref: mainRef
  }, /*#__PURE__*/React.createElement("p", {
    style: C.eyebrow
  }, "Fulfilment diagnostic"), /*#__PURE__*/React.createElement("h1", {
    style: C.h1
  }, "The High-Performance Fulfilment Diagnostic"), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "This isn't designed to label you as burnt out. It's built to show how your current relationship with work, ambition, and pressure is affecting your fulfilment, nervous system, self-trust, relationships, and ability to recover."), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "It's for tech high performers who are still functioning, still ambitious, and still carrying responsibility \u2014 but suspect the way they're succeeding is starting to cost more than it gives back. It looks beyond generic burnout symptoms at the deeper patterns behind pressure, achievement, nervous-system load, emotional fatigue, overthinking, avoidance, and loss of fulfilment."), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "Around 8 minutes. At the end you'll see your operating pattern, a level, and a breakdown by section."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: '1rem',
      margin: '2rem 0'
    }
  }, [['Length', '45 questions'], ['Format', '1-5 scale + N/A'], ['Result', 'Level + section breakdown']].map(([label, value]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: C.card
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: '.5rem'
    }
  }, label), /*#__PURE__*/React.createElement("div", null, value)))), /*#__PURE__*/React.createElement("p", {
    style: C.note
  }, "This diagnostic is directional, not a clinical diagnosis."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: C.cta,
    onClick: () => {
      setScreen('question');
      setIdx(0);
      scrollTop();
    }
  }, "Start assessment")), /*#__PURE__*/React.createElement("footer", {
    style: C.footer
  }, "\xA9 Aggelos Mouzakitis"));
  if (screen === 'question') return /*#__PURE__*/React.createElement("div", {
    style: C.page,
    ref: mainRef
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '.8rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: C.eyebrow
  }, "Question ", idx + 1, " of ", totalQ), /*#__PURE__*/React.createElement("p", {
    style: C.eyebrow
  }, progress, "% complete")), /*#__PURE__*/React.createElement("div", {
    style: C.progressLine
  }, /*#__PURE__*/React.createElement("div", {
    style: C.progressFill(progress)
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '20px',
      lineHeight: 1.85,
      marginBottom: '1.8rem',
      fontWeight: 400,
      color: '#282726'
    }
  }, currentQ.text), SCALE.map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.value,
    style: C.optionBtn(currentAnswer === opt.value),
    onClick: () => setAnswers(a => ({
      ...a,
      [currentQ.key]: opt.value
    }))
  }, opt.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginTop: '2rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      ...C.ctaSec,
      opacity: idx === 0 ? 0.4 : 1
    },
    disabled: idx === 0,
    onClick: () => {
      setIdx(i => i - 1);
      scrollTop();
    }
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      opacity: currentAnswer === undefined ? 0.4 : 1
    },
    disabled: currentAnswer === undefined,
    onClick: () => {
      if (idx < totalQ - 1) {
        setIdx(i => i + 1);
        scrollTop();
      } else {
        setScreen('gate');
        scrollTop();
      }
    }
  }, idx === totalQ - 1 ? 'Continue' : 'Next')));
  if (screen === 'gate') return /*#__PURE__*/React.createElement("div", {
    style: C.page,
    ref: mainRef
  }, /*#__PURE__*/React.createElement("p", {
    style: C.eyebrow
  }, "One last step"), /*#__PURE__*/React.createElement("h1", {
    style: C.h1
  }, "Enter your email to view your result."), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "You'll see your level and section breakdown immediately after this."), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: '.6rem'
    }
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "you@example.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    style: {
      width: '100%',
      border: '1px solid rgba(40,39,38,.2)',
      padding: '1rem',
      borderRadius: '8px',
      background: 'transparent',
      color: '#282726',
      fontFamily: 'inherit',
      fontSize: '14px',
      lineHeight: 1.7,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginTop: '2rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      ...C.ctaSec
    },
    onClick: () => {
      setScreen('question');
      scrollTop();
    }
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      opacity: !email.trim() || sending ? 0.4 : 1
    },
    disabled: !email.trim() || sending,
    onClick: handleShowResults
  }, sending ? 'Sending...' : 'Show results')));
  if (screen === 'results' && results) return /*#__PURE__*/React.createElement("div", {
    style: C.page,
    ref: mainRef
  }, /*#__PURE__*/React.createElement("p", {
    style: C.eyebrow
  }, "Your result"), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...C.h1,
      marginBottom: '.5rem'
    }
  }, results.grade), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "Your score: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1a7f37'
    }
  }, fmt(results.overall)), " / 5.00"), results.topDimension && /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, "Your highest-load area right now is ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#282726',
      borderBottom: '1px solid rgba(40,39,38,.3)'
    }
  }, results.topDimension.title), "."), /*#__PURE__*/React.createElement("p", {
    style: C.p
  }, results.desc), results.nextStep && /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '2px solid #1a7f37',
      padding: '2px 0 2px 14px',
      margin: '1.6rem 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...C.eyebrow,
      marginBottom: '.5rem'
    }
  }, "What to do with this"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...C.p,
      marginBottom: 0
    }
  }, results.nextStep)), /*#__PURE__*/React.createElement("p", {
    style: C.note
  }, "This diagnostic is directional, not a clinical diagnosis."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...C.eyebrow,
      marginBottom: '1rem'
    }
  }, "Your operating pattern ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#bbb'
    }
  }, "\xB7 highest load first")), (results.dimensions || []).map((d, i) => {
    const vis = getLevelVisual(d.score);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        ...C.sectionRow,
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '.6rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem'
      }
    }, /*#__PURE__*/React.createElement("div", null, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: vis.color
      }
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '13px',
        color: '#888'
      }
    }, fmt(d.score), " / 5.00"))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '3px',
        background: 'rgba(40,39,38,.08)',
        borderRadius: '2px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '3px',
        width: vis.pct + '%',
        background: vis.color,
        borderRadius: '2px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '13px',
        color: '#777',
        lineHeight: 1.65
      }
    }, d.interp));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(26,127,55,0.3)',
      background: 'rgba(26,127,55,0.04)',
      padding: '1.4rem',
      marginTop: '2.5rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...C.eyebrow,
      marginBottom: '.6rem'
    }
  }, "Where this goes next"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...C.p,
      marginBottom: '1.2rem'
    }
  }, "A diagnostic shows the pattern. Changing it is the actual work. If any of this landed, the first session is free, 60 minutes, and no strings \u2014 we use it to figure out where you are and whether working together makes sense."), /*#__PURE__*/React.createElement("a", {
    href: "mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session",
    style: {
      ...C.cta,
      textDecoration: 'none'
    }
  }, "Book a free 60-minute session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      ...C.ctaSec
    },
    onClick: () => {
      setAnswers({});
      setIdx(0);
      setEmail('');
      setResults(null);
      setScreen('intro');
      scrollTop();
    }
  }, "Retake assessment"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...C.cta,
      ...C.ctaSec
    },
    onClick: () => window.print()
  }, "Print result")), /*#__PURE__*/React.createElement("footer", {
    style: C.footer
  }, "\xA9 Aggelos Mouzakitis"));
  return null;
}
Object.assign(window, {
  DiagnosticPage
});
