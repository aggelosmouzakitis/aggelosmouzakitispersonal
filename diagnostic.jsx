// diagnostic.jsx — Interactive burnout diagnostic with exact questions from the real site

const DIAG_SECTIONS = [
{ id: 'self-worth', title: 'Self-worth through achievement', questions: [
  'A bad period at work can mess with my confidence significantly.',
  'When I\u2019m not doing well professionally, I tend to become harsher on myself.',
  'It\u2019s easier to feel good about myself when things are going well professionally.']
},
{ id: 'shame-guilt-pressure', title: 'Shame, guilt, and pressure', questions: [
  'I find it hard to relax when there is still work to be done.',
  'I can sit down to rest and still feel like I should be productive.',
  'I tend to focus on what\u2019s still missing.']
},
{ id: 'comparison', title: 'Comparison, shame, and not-enoughness', questions: [
  'Seeing other people do well makes me worry about my performance.',
  'When someone in my close network is moving fast, I tend to think about where I\u2019m falling short.',
  'I can have objectively good results and still feel behind my goals.']
},
{ id: 'vulnerability', title: 'Fear of vulnerability', questions: [
  'I feel uneasy with the idea of people close to me seeing me weak.',
  'If I\u2019m struggling, my instinct is usually to keep it to myself.',
  'I\u2019d rather deal with something alone than let people see me unsure or messy.']
},
{ id: 'grind', title: 'Pride in grind and pressure', questions: [
  'I\u2019m used to carrying a lot without complaining about it.',
  'Part of me takes pride in how much pressure I can handle.',
  'Slowing down can feel uncomfortable, even when it seems like I need it.']
},
{ id: 'identity', title: 'Identity and persona', questions: [
  'People know me as someone who gets things done.',
  'Being capable is a big part of how I see myself.',
  'Letting people down hits me hard, especially when they expect a lot from me.',
  'People often tell me I am too hard on myself or that I push myself too much.']
},
{ id: 'relationships', title: 'Interpersonal relationships', questions: [
  'When work is heavy, I have less patience for people who do not get it.',
  'When I\u2019m stressed, I can become harder to interact with.',
  'There are times when I feel too loaded to really be present with other people.',
  'My relationship with my partner has suffered because of how I carry stress.',
  'There are times when I feel distant from my partner, or they feel unsupported by me.']
},
{ id: 'drive-meaning', title: 'Loss of drive and meaning', questions: [
  'I\u2019ve started feeling resentful about parts of work I used to take pride in.',
  'I miss the times when work felt easier to enjoy.']
},
{ id: 'numbness', title: 'Emotional numbness and detachment', questions: [
  'I can get through a full day and still feel emotionally flat.',
  'Things that used to matter to me don\u2019t land the same way now.',
  'I can be productive and still feel disconnected from what I\u2019m doing.',
  'I often feel less like myself and more like I\u2019m just operating.',
  'There are moments when I wonder what all this effort is really for.']
},
{ id: 'cynicism', title: 'Cynicism and depersonalisation', questions: [
  'I\u2019ve become more cynical about work than I used to be.',
  'Some parts of work now feel mechanical, even when I do them well.',
  'There are moments when I feel more detached than engaged.']
},
{ id: 'nervous-system', title: 'Nervous-system overload', questions: [
  'I can be tired and still feel unable to fully settle.',
  'Sleep does not always leave me feeling properly reset.',
  'Stress has started showing up in my body through things like headaches, muscle tension, stomach issues, nausea, or similar symptoms.',
  'My body can stay tense even when I\u2019m not actively working.']
},
{ id: 'tech-activation', title: 'Tech-specific constant activation', questions: [
  'Even when I\u2019m off, part of me still feels on call.',
  'I check work things in moments that should be personal time.',
  'It\u2019s hard for me to feel fully off duty.',
  'My mind stays connected to work more than I want.',
  'I feel a pull to reply quickly even when I don\u2019t have to.',
  'I often turn to AI, self-help content, or similar inputs to figure myself out, but it rarely leads to real change.',
  'I consume advice about burnout, stress, or performance, but still find myself stuck in the same patterns.']
}];


const FLAT_QUESTIONS = [];
DIAG_SECTIONS.forEach((section) => {
  section.questions.forEach((text, index) => {
    FLAT_QUESTIONS.push({ key: section.id + '-' + index, sectionId: section.id, sectionTitle: section.title, text });
  });
});

const SCALE = [
{ value: 1, label: 'Strongly disagree' },
{ value: 2, label: 'Disagree' },
{ value: 3, label: 'Neither agree nor disagree' },
{ value: 4, label: 'Agree' },
{ value: 5, label: 'Strongly agree' },
{ value: 'na', label: 'N/A' }];


function avg(vals) {
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
function getGrade(score) {
  if (score === null) return 'Insufficient data';
  if (score <= 2.5) return 'OK';
  if (score <= 3.2) return 'Signs of burnout';
  return 'Getting serious';
}
function getDesc(score) {
  if (score === null) return 'There is not enough data to score this assessment yet.';
  if (score <= 2.5) return 'Your answers do not currently suggest a strong burnout pattern. That does not mean there is no pressure in your life. It means the pattern is not dominating your energy, relationships, or sense of self in a major way right now.';
  if (score <= 3.2) return 'Your answers suggest noticeable signs of burnout. This is often the stage where people still function well on the outside, but the cost is already building underneath in ways that spill into motivation, mood, relationships, or recovery.';
  return 'Your answers suggest a serious pattern. This usually means the issue goes deeper than workload alone and is now affecting multiple parts of life at the same time.';
}
function getSectionLabel(score) {
  if (score === null) return 'Insufficient data';
  if (score <= 2.5) return 'OK';
  if (score <= 3.2) return 'Signs';
  return 'Serious';
}
function fmt(score) {return score === null ? 'N/A' : score.toFixed(2);}

function DiagnosticPage() {
  const { useState, useRef } = React;
  const [mob, setMob] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  const [screen, setScreen] = useState('intro'); // intro | question | gate | results
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null);
  const mainRef = useRef(null);

  const scrollTop = () => {if (mainRef.current) mainRef.current.scrollTop = 0;};

  const totalQ = FLAT_QUESTIONS.length;
  const answered = Object.keys(answers).filter((k) => answers[k] !== undefined).length;
  const progress = Math.round(answered / totalQ * 100);

  function getOverallScore() {
    const nums = Object.values(answers).filter((v) => typeof v === 'number');
    return avg(nums);
  }

  function getSectionResults() {
    return DIAG_SECTIONS.map((section) => {
      const keys = section.questions.map((_, i) => section.id + '-' + i);
      const nums = keys.map((k) => answers[k]).filter((v) => typeof v === 'number');
      const answeredCount = keys.filter((k) => answers[k] !== undefined).length;
      const threshold = Math.ceil(keys.length * 0.7);
      const score = answeredCount >= threshold ? avg(nums) : null;
      return { title: section.title, score, label: getSectionLabel(score) };
    });
  }

  function showResults() {
    const overall = getOverallScore();
    const sections = getSectionResults();
    setResults({ overall, grade: getGrade(overall), desc: getDesc(overall), sections });
    setScreen('results');
    setTimeout(scrollTop, 50);
  }

  const currentQ = FLAT_QUESTIONS[idx];
  const currentAnswer = answers[currentQ?.key];

  // Styles
  const C = {
    page: { maxWidth: 740, margin: '0 auto', padding: mob ? '1.5rem 1rem 5rem' : '4rem 2rem 7rem', color: '#282726', fontFamily: 'inherit' },
    eyebrow: { fontSize: '11px', fontWeight: 400, letterSpacing: '.15em', textTransform: 'uppercase', color: '#777', lineHeight: 1.7 },
    h1: { fontSize: mob ? '20px' : '28px', fontWeight: 400, lineHeight: 1.35, color: '#282726', marginBottom: '1.5rem' },
    h2: { fontSize: '20px', fontWeight: 400, lineHeight: 1.8, color: '#282726' },
    p: { marginBottom: '1.4rem', lineHeight: 1.85, fontSize: '16px', color: '#282726' },
    card: { border: '1px solid rgba(40,39,38,.15)', padding: '1rem' },
    note: { fontSize: '13px', color: '#777', lineHeight: 1.7 },
    cta: {
      fontFamily: 'inherit', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase',
      color: '#F4F2F0', background: '#282726', border: '1px solid #282726',
      padding: '.8rem 1.2rem', display: 'inline-block', cursor: 'pointer', transition: 'background .15s'
    },
    ctaSec: { background: 'transparent', color: '#282726', borderColor: 'rgba(40,39,38,.3)' },
    optionBtn: (selected) => ({
      width: '100%', textAlign: 'left', border: selected ? '1px solid #00bf63' : '1px solid rgba(40,39,38,.15)',
      padding: '1rem', borderRadius: '8px', background: selected ? '#00bf63' : 'transparent',
      color: selected ? '#fff' : '#282726', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.7,
      cursor: 'pointer', transition: 'background .15s, border-color .15s', marginBottom: '.75rem'
    }),
    progressLine: { height: '1px', background: 'rgba(40,39,38,.12)', position: 'relative', marginTop: '.8rem' },
    progressFill: (pct) => ({ height: '1px', background: '#00bf63', width: pct + '%', transition: 'width .2s ease' }),
    sectionRow: {
      border: '1px solid rgba(40,39,38,.15)', padding: '1rem', borderRadius: '8px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '.75rem'
    },
    footer: { marginTop: '3rem', fontSize: '12px', color: '#777' }
  };

  if (screen === 'intro') return (
    <div style={C.page} ref={mainRef}>
      <p style={C.eyebrow}>Burnout diagnostic</p>
      <h1 style={C.h1}>High-Functioning Burnout Diagnostic for People in Tech</h1>
      <div style={{ marginBottom: '1.2rem' }}>
        <p style={C.p}>This assessment is for high-functioning people in tech whose drive may be getting expensive.</p>
        <p style={C.p}>It looks beyond obvious overwork and measures patterns linked to performance, pressure, identity, nervous-system overload, emotional flattening, and constant activation.</p>
        <p style={{ ...C.p, marginBottom: 0 }}>It takes around 8 minutes. At the end, you'll get a burnout score, a grade, and a breakdown by section.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: '1rem', margin: '2rem 0' }}>
        {[['Length', '45 questions'], ['Format', '1–5 scale + N/A'], ['Result', 'Score + section breakdown']].map(([label, value]) =>
        <div key={label} style={C.card}>
            <div style={{ fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#888', marginBottom: '.5rem' }}>{label}</div>
            <div style={{ fontSize: '15px', lineHeight: 1.7 }}>{value}</div>
          </div>
        )}
      </div>
      <p style={C.note}>This diagnostic is directional, not a clinical diagnosis.</p>
      <div style={{ marginTop: '2rem' }}>
        <button style={C.cta} onClick={() => {setScreen('question');setIdx(0);scrollTop();}}>Start assessment</button>
      </div>
      <footer style={C.footer}>© Aggelos Mouzakitis</footer>
    </div>);


  if (screen === 'question') return (
    <div style={C.page} ref={mainRef}>
      {/* Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '.8rem' }}>
          <p style={C.eyebrow}>Question {idx + 1} of {totalQ}</p>
          <p style={C.eyebrow}>{progress}% complete</p>
        </div>
        <div style={C.progressLine}><div style={C.progressFill(progress)}></div></div>
      </div>

      {/* Question */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '20px', lineHeight: 1.85, marginBottom: '1.8rem', fontWeight: 400, fontFamily: 'inherit', color: "rgb(40, 39, 38)" }}>
          {currentQ.text}
        </h2>
        <div>
          {SCALE.map((opt) =>
          <button key={opt.value} style={C.optionBtn(currentAnswer === opt.value)}
          onClick={() => setAnswers((a) => ({ ...a, [currentQ.key]: opt.value }))}>
              {opt.label}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
        <button style={{ ...C.cta, ...C.ctaSec, opacity: idx === 0 ? 0.4 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer', color: '#282726' }}
        disabled={idx === 0}
        onClick={() => {setIdx((i) => i - 1);scrollTop();}}>Back</button>
        <button style={{ ...C.cta, opacity: currentAnswer === undefined ? 0.4 : 1, cursor: currentAnswer === undefined ? 'not-allowed' : 'pointer' }}
        disabled={currentAnswer === undefined}
        onClick={() => {
          if (idx < totalQ - 1) {setIdx((i) => i + 1);scrollTop();} else
          {setScreen('gate');scrollTop();}
        }}>
          {idx === totalQ - 1 ? 'Continue' : 'Next'}
        </button>
      </div>
    </div>);


  if (screen === 'gate') return (
    <div style={C.page} ref={mainRef}>
      <p style={C.eyebrow}>One last step</p>
      <h1 style={C.h1}>Enter your email to view your result.</h1>
      <div style={{ marginBottom: '1.2rem' }}>
        <p style={{ ...C.p, marginBottom: 0 }}>You'll see your burnout score and section breakdown immediately after this.</p>
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: '#888', marginBottom: '.6rem' }}>Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%', border: '1px solid rgba(40,39,38,.2)', padding: '1rem',
          borderRadius: '8px', background: 'transparent', color: '#282726',
          fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.7, outline: 'none'
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
        <button style={{ ...C.cta, ...C.ctaSec }} onClick={() => {setScreen('question');scrollTop();}}>Back</button>
        <button style={{ ...C.cta, opacity: !email.trim() || sending ? 0.4 : 1, cursor: !email.trim() || sending ? 'not-allowed' : 'pointer' }}
        disabled={!email.trim() || sending}
        onClick={() => {setSending(true);setTimeout(() => {showResults();setSending(false);}, 600);}}>
          {sending ? 'Loading...' : 'Show results'}
        </button>
      </div>
    </div>);


  if (screen === 'results' && results) return (
    <div style={C.page} ref={mainRef}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={C.eyebrow}>Your result</p>
        <h1 style={{ ...C.h1, marginBottom: '.5rem' }}>{results.grade}</h1>
        <p style={{ ...C.p, marginBottom: '.5rem' }}>Burnout score: <span style={{ color: '#00bf63' }}>{fmt(results.overall)}</span> / 5.00</p>
        <p style={C.p}>{results.desc}</p>
        <p style={C.note}>This diagnostic is directional, not a clinical diagnosis.</p>
      </div>

      <div>
        <p style={{ ...C.eyebrow, marginBottom: '1rem' }}>Section breakdown</p>
        {results.sections.map((s, i) =>
        <div key={i} style={C.sectionRow}>
            <div style={{ fontSize: '14px', lineHeight: 1.7 }}>{s.title}</div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '14px', lineHeight: 1.7 }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{fmt(s.score)} / 5.00</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button style={C.cta} onClick={() => {setAnswers({});setIdx(0);setEmail('');setResults(null);setScreen('intro');scrollTop();}}>
          Retake assessment
        </button>
        <button style={{ ...C.cta, ...C.ctaSec }} onClick={() => window.print()}>Print result</button>
      </div>

      <div style={{ marginTop: '2rem', ...C.note }}>
        Related:{' '}
        <a href="#" style={{ color: '#00bf63' }} onClick={(e) => {e.preventDefault();}}>Executive Burnout Therapy</a>,{' '}
        <a href="#" style={{ color: '#00bf63' }} onClick={(e) => {e.preventDefault();}}>Therapy for Executives</a>,{' '}
        <a href="#" style={{ color: '#00bf63' }} onClick={(e) => {e.preventDefault();}}>Imposter Syndrome Therapy</a>
      </div>
      <footer style={C.footer}>© Aggelos Mouzakitis</footer>
    </div>);


  return null;
}

Object.assign(window, { DiagnosticPage });