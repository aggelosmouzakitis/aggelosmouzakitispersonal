// diagnostic.jsx — Starting Diagnostic (bilingual EN/EL).
// No user-facing score and no automated result. The user answers + submits
// name/email; Aggelos receives a structured internal email and reviews it himself.
// Internal averages + strongest signals are scanning aids only, never a diagnosis,
// and are never shown to the user.

const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby-gv3oCFT2q5KXvVnqRzS4PAzcMjPB8Gls5qodZJ3v4_9HKGqJHMdBCw7YYbEzIE2d/exec';
if (window.emailjs) {
  emailjs.init({
    publicKey: 'bfBcHLXj2nKaev_lT'
  });
}

// ── Content (bilingual) ──────────────────────────────────────────────────────
const DIAG = {
  en: {
    dir: 'Starting Diagnostic',
    intro: {
      h1: 'Starting Diagnostic',
      p: ["Give me ten minutes and I'll have a much better idea of what you're building, where it's getting stuck and what might actually be going on.", "This isn't a personality test and there isn't an automated score waiting at the end.", "Some questions are about the business. Some are about you. That's deliberate.", "Answer quickly rather than trying to get every answer exactly right. When you're done, I'll receive your responses and review them myself."],
      duration: 'About 8–10 minutes.',
      start: 'START →'
    },
    scale: {
      low: 'Not true at all',
      high: 'Very true'
    },
    nav: {
      back: 'Back',
      next: 'Continue',
      section: 'Section',
      of: 'of',
      progress: 'complete',
      required: 'Please add your name and a valid email so I can send this.'
    },
    s1: {
      label: 'What are you building?',
      stageQ: 'Which of these describe where you are right now? (pick any that apply)',
      stage: ['Employed and thinking seriously about building something', 'Building something alongside a job', 'Freelancer / independent professional', 'Consultant / advisor', 'Solopreneur', 'Founder / business owner', 'Something else'],
      timeQ: 'How long have you been actively working on it?',
      time: ['Not started yet', 'Less than 6 months', '6–12 months', '1–3 years', '3+ years'],
      revQ: 'Roughly where is the business today?',
      rev: ['No revenue yet', 'Some occasional revenue', 'Consistent revenue, but not enough', 'Healthy business that I want to grow substantially', 'Established business/team', 'Not applicable yet'],
      goalQ: 'What are you most trying to achieve over the next 12 months?',
      problemQ: 'What feels like the biggest problem right now?'
    },
    s2: {
      label: 'The business',
      statements: ['I have a clear offer that people understand quickly.', "I know who I'm trying to sell to.", 'I have a reasonably reliable way of getting in front of potential customers.', 'I talk to potential customers often enough.', 'My pricing makes commercial sense.', 'I know what the most important next move in the business is.', "I'm focused enough for my efforts to compound.", "I know what is working and what I'm mostly hoping will work."]
    },
    s3: {
      label: 'Getting yourself to do it',
      statements: ["I often know what the sensible business move is and still don't do it.", 'I spend too much time preparing, researching or improving things before putting them in front of people.', 'Selling or promoting myself feels more uncomfortable than it objectively needs to.', 'A rejection can affect me long after the situation itself is over.', 'I avoid asking for the amount of money I genuinely think my work is worth.', "I change direction before I've really tested the direction I'm already in.", "I keep reopening decisions I've already made.", 'I can explain some of my patterns very well without actually changing them.', 'When something matters a lot to me, I tend to make it more complicated.', 'I sometimes use productive-looking work to avoid the thing that actually matters.']
    },
    s4: {
      label: 'You inside the business',
      statements: ['How well the business is doing affects how I feel about myself.', 'I find it hard to slow down when there is still something I could be doing.', 'I feel uncomfortable when people see me uncertain, struggling or not in control.', 'Being the capable person who figures things out is an important part of my identity.', 'I take responsibility for things that other people could probably handle without me.', 'Letting go of control feels riskier than keeping too much of it.', "I sometimes wonder who I'd be if I stopped pushing so hard.", "I've reached things I used to want badly and felt surprisingly little when I got there.", "The business occupies my mind even when I'm technically not working.", 'Work pressure leaks into my mood, body or relationships.', "I sometimes struggle to tell whether I'm moving toward something I want or away from something I'm afraid of.", "I have thoughts or doubts about my work that I don't feel comfortable saying to the people around me."]
    },
    s5: {
      label: "What's happening now?",
      opens: ['If we worked together and it went really well, what would be different six months from now?', 'What have you already tried to solve this?', "What do you suspect might be getting in your way, even if you're not sure?", "Is there anything about the business, your work or yourself that you haven't said elsewhere in this diagnostic but think I should know? (optional)"],
      name: 'Name',
      email: 'Email',
      website: 'Website / LinkedIn (optional)',
      notice: "Your answers come straight to Aggelos. He reads them himself and replies personally — this isn't a clinical diagnostic or an automated assessment.",
      submit: 'SEND MY DIAGNOSTIC →',
      sending: 'Sending…'
    },
    done: {
      h1: 'Got it.',
      p: ['Your answers are with me.', "I read these myself. I'll come back to you by email once I've had a proper look.", 'If you already know you want to talk, you can also book a fit call below.'],
      book: 'BOOK A FIT CALL →'
    }
  },
  el: {
    dir: 'Starting Diagnostic',
    intro: {
      h1: 'Starting Diagnostic',
      p: ['Δώσε μου δέκα λεπτά και θα έχω πολύ καλύτερη εικόνα για το τι χτίζεις, πού έχει κολλήσει και τι μπορεί πραγματικά να συμβαίνει.', 'Δεν είναι personality test και δεν θα εμφανιστεί κάποιο αυτόματο score στο τέλος.', 'Κάποιες ερωτήσεις αφορούν το business. Κάποιες εσένα. Αυτό είναι σκόπιμο.', 'Απάντησε σχετικά γρήγορα, χωρίς να προσπαθήσεις να βρεις την «τέλεια» απάντηση. Όταν τελειώσεις, οι απαντήσεις θα έρθουν σε μένα και θα τις διαβάσω ο ίδιος.'],
      duration: 'Περίπου 8–10 λεπτά.',
      start: 'ΞΕΚΙΝΑ →'
    },
    scale: {
      low: 'Καθόλου',
      high: 'Πάρα πολύ'
    },
    nav: {
      back: 'Πίσω',
      next: 'Συνέχεια',
      section: 'Ενότητα',
      of: 'από',
      progress: 'ολοκληρώθηκε',
      required: 'Συμπλήρωσε όνομα και ένα έγκυρο email για να μπορέσω να το λάβω.'
    },
    s1: {
      label: 'Τι χτίζεις;',
      stageQ: 'Πού βρίσκεσαι αυτή τη στιγμή; (διάλεξε όσα ισχύουν)',
      stage: ['Μισθωτός και σκέφτομαι σοβαρά να χτίσω κάτι δικό μου', 'Χτίζω κάτι παράλληλα με τη δουλειά μου', 'Freelancer / ελεύθερος επαγγελματίας', 'Consultant / σύμβουλος', 'Solopreneur', 'Founder / ιδιοκτήτης επιχείρησης', 'Κάτι άλλο'],
      timeQ: 'Πόσο καιρό ασχολείσαι ενεργά με αυτό;',
      time: ['Δεν έχω ξεκινήσει ακόμα', 'Λιγότερο από 6 μήνες', '6–12 μήνες', '1–3 χρόνια', 'Πάνω από 3 χρόνια'],
      revQ: 'Πού βρίσκεται περίπου το business σήμερα;',
      rev: ['Δεν έχει έσοδα ακόμα', 'Έχει κάποια περιστασιακά έσοδα', 'Έχει σταθερά έσοδα, αλλά όχι όσα θέλω', 'Πηγαίνει καλά και θέλω να το μεγαλώσω σημαντικά', 'Είναι ήδη οργανωμένη επιχείρηση / ομάδα', 'Δεν έχει εφαρμογή ακόμα'],
      goalQ: 'Τι θέλεις περισσότερο να έχει αλλάξει μέσα στους επόμενους 12 μήνες;',
      problemQ: 'Αν έπρεπε να διαλέξεις ένα, ποιο είναι το μεγαλύτερο πρόβλημα αυτή τη στιγμή;'
    },
    s2: {
      label: 'Το business',
      statements: ['Το offer μου είναι ξεκάθαρο και ο κόσμος καταλαβαίνει εύκολα τι πουλάω.', 'Ξέρω σε ποιους ακριβώς προσπαθώ να πουλήσω.', 'Έχω έναν σχετικά σταθερό τρόπο να βρίσκω πιθανούς πελάτες.', 'Μιλάω με πιθανούς πελάτες αρκετά συχνά.', 'Οι τιμές μου βγάζουν εμπορικό νόημα.', 'Ξέρω ποια είναι η σημαντικότερη επόμενη κίνηση για το business.', 'Είμαι αρκετά συγκεντρωμένος σε μία κατεύθυνση ώστε η προσπάθεια να αρχίσει να συσσωρεύεται.', 'Ξέρω τι πραγματικά δουλεύει και τι απλώς ελπίζω ότι θα δουλέψει.']
    },
    s3: {
      label: 'Το να το κάνεις εσύ',
      statements: ["Συχνά ξέρω ποια είναι η λογική business κίνηση και παρ' όλα αυτά δεν την κάνω.", 'Περνάω υπερβολικό χρόνο προετοιμάζοντας, ψάχνοντας ή βελτιώνοντας κάτι πριν το βγάλω προς τα έξω.', "Το να πουλήσω ή να προωθήσω τον εαυτό μου με δυσκολεύει περισσότερο απ' όσο θα έπρεπε.", 'Μια απόρριψη μπορεί να με επηρεάζει πολύ αφού το ίδιο το γεγονός έχει τελειώσει.', 'Δυσκολεύομαι να ζητήσω τα χρήματα που πραγματικά πιστεύω ότι αξίζει η δουλειά μου.', 'Αλλάζω κατεύθυνση πριν δοκιμάσω πραγματικά αυτή που ήδη έχω.', 'Ξανανοίγω αποφάσεις που θεωρητικά έχω ήδη πάρει.', 'Μπορώ να εξηγήσω πολύ καλά κάποια μοτίβα μου χωρίς αυτό να σημαίνει ότι τα αλλάζω.', 'Όσο περισσότερο με νοιάζει κάτι, τόσο πιο περίπλοκο τείνω να το κάνω.', 'Μερικές φορές γεμίζω τη μέρα με χρήσιμη δουλειά για να αποφύγω αυτή που πραγματικά έχει σημασία.']
    },
    s4: {
      label: 'Εσύ μέσα στο business',
      statements: ['Το πόσο καλά πηγαίνει το business επηρεάζει το πώς νιώθω για τον εαυτό μου.', 'Δυσκολεύομαι να χαλαρώσω όταν ξέρω ότι υπάρχει κάτι ακόμα που θα μπορούσα να κάνω.', 'Με δυσκολεύει να με βλέπουν οι άλλοι να αμφιβάλλω, να δυσκολεύομαι ή να μην έχω τον έλεγχο.', 'Το να είμαι αυτός που «θα βρει τη λύση» είναι σημαντικό κομμάτι της ταυτότητάς μου.', 'Αναλαμβάνω πράγματα που πιθανότατα θα μπορούσαν να χειριστούν και άλλοι χωρίς εμένα.', 'Το να αφήσω λίγο το control μου φαίνεται πιο επικίνδυνο από το να κρατάω υπερβολικά πολύ.', 'Μερικές φορές αναρωτιέμαι ποιος θα ήμουν αν σταματούσα να πιέζω τόσο πολύ.', "Έχω πετύχει πράγματα που κάποτε ήθελα πάρα πολύ και όταν τα κατάφερα ένιωσα πολύ λιγότερα απ' όσα περίμενα.", 'Το business συνεχίζει να τρέχει στο μυαλό μου ακόμα κι όταν θεωρητικά δεν δουλεύω.', 'Η πίεση της δουλειάς περνάει στη διάθεσή μου, στο σώμα μου ή στις σχέσεις μου.', 'Μερικές φορές δυσκολεύομαι να καταλάβω αν κινούμαι προς κάτι που θέλω ή απλώς τρέχω μακριά από κάτι που φοβάμαι.', 'Υπάρχουν πράγματα που σκέφτομαι για τη δουλειά μου και δεν νιώθω ότι μπορώ να τα πω εύκολα στους ανθρώπους γύρω μου.']
    },
    s5: {
      label: 'Τι συμβαίνει τώρα;',
      opens: ['Αν δουλεύαμε μαζί και πήγαινε πραγματικά καλά, τι θα ήταν διαφορετικό σε έξι μήνες από σήμερα;', 'Τι έχεις ήδη δοκιμάσει για να λύσεις αυτό το πρόβλημα;', 'Τι υποψιάζεσαι ότι μπορεί να σε κρατάει πίσω, ακόμη κι αν δεν είσαι σίγουρος;', 'Υπάρχει κάτι για το business, τη δουλειά ή εσένα που δεν σε ρώτησα αλλά θεωρείς ότι θα έπρεπε να ξέρω; (προαιρετικό)'],
      name: 'Όνομα',
      email: 'Email',
      website: 'Website / LinkedIn (προαιρετικό)',
      notice: 'Οι απαντήσεις σου πάνε κατευθείαν στον Άγγελο. Τις διαβάζει ο ίδιος και απαντά προσωπικά — δεν είναι κλινική διάγνωση ή αυτοματοποιημένο τεστ.',
      submit: 'ΑΠΟΣΤΟΛΗ →',
      sending: 'Αποστολή…'
    },
    done: {
      h1: 'Το πήρα.',
      p: ['Οι απαντήσεις σου ήρθαν σε μένα.', 'Τις διαβάζω ο ίδιος και θα σου απαντήσω με email αφού τις δω κανονικά.', 'Αν ξέρεις ήδη ότι θέλεις να μιλήσουμε, μπορείς να κλείσεις και μια σύντομη γνωριμία.'],
      book: 'ΚΛΕΙΣΕ ΜΙΑ ΓΝΩΡΙΜΙΑ →'
    }
  }
};

// Internal dimension map (scanning aids only). Global question numbers:
// Business Q1–8, Behaviour Q9–18, Identity Q19–30.
const DIMENSIONS = [{
  key: 'Business clarity',
  qs: [1, 2, 3, 4, 5, 6, 7, 8],
  positive: true
}, {
  key: 'Execution / avoidance',
  qs: [9, 10, 16, 18]
}, {
  key: 'Visibility / rejection',
  qs: [11, 12, 13]
}, {
  key: 'Decision / commitment',
  qs: [14, 15, 17, 29]
}, {
  key: 'Identity / self-worth',
  qs: [19, 22, 25, 26]
}, {
  key: 'Control',
  qs: [21, 23, 24]
}, {
  key: 'Pressure / disconnection',
  qs: [20, 27, 28, 30]
}];

// ── Presentational sub-components at module scope, so controlled inputs keep
// focus and scroll position across re-renders (defining them inside the page
// component made React remount the textarea on every keystroke). ─────────────
function DField({
  label,
  value,
  onChange,
  C,
  rows
}) {
  return React.createElement('div', {
    style: {
      marginBottom: '2.1rem'
    }
  }, React.createElement('p', {
    style: C.qLabel
  }, label), React.createElement('textarea', {
    rows: rows || 3,
    value: value || '',
    onChange: e => onChange(e.target.value),
    style: {
      ...C.field,
      resize: 'vertical'
    }
  }));
}
function DChoice({
  label,
  options,
  C,
  selected,
  onPick,
  multi
}) {
  return React.createElement('div', {
    style: {
      marginBottom: '2.1rem'
    }
  }, React.createElement('p', {
    style: C.qLabel
  }, label), options.map((o, i) => {
    const on = multi ? (selected || []).includes(i) : selected === i;
    const box = multi ? React.createElement('span', {
      'aria-hidden': 'true',
      style: {
        width: 18,
        height: 18,
        flexShrink: 0,
        borderRadius: 4,
        border: '1.5px solid ' + (on ? '#1a7f37' : 'rgba(40,39,38,.4)'),
        background: on ? '#1a7f37' : 'transparent',
        color: '#fff',
        fontSize: 12,
        lineHeight: '16px',
        textAlign: 'center',
        marginRight: '.7rem',
        display: 'inline-block'
      }
    }, on ? '✓' : '') : null;
    return React.createElement('button', {
      key: i,
      className: 'opt-btn',
      style: {
        ...C.choice(on),
        display: 'flex',
        alignItems: 'center'
      },
      onClick: () => onPick(i)
    }, box, React.createElement('span', null, o));
  }));
}
function DScale({
  text,
  value,
  onPick,
  C,
  low,
  high
}) {
  return React.createElement('div', {
    style: C.row
  }, React.createElement('p', {
    style: {
      ...C.qLabel,
      marginBottom: '.9rem',
      fontWeight: 500
    }
  }, text), React.createElement('div', {
    style: {
      display: 'flex',
      gap: '.5rem'
    }
  }, [1, 2, 3, 4, 5].map(v => React.createElement('button', {
    key: v,
    className: 'opt-btn',
    style: C.scaleBtn(value === v),
    onClick: () => onPick(v)
  }, v))), React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '.5rem'
    }
  }, React.createElement('span', {
    style: {
      fontSize: '12px',
      color: '#8a8a8a'
    }
  }, low), React.createElement('span', {
    style: {
      fontSize: '12px',
      color: '#8a8a8a'
    }
  }, high)));
}
function DProg({
  n,
  progress,
  C,
  t
}) {
  return React.createElement('div', {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem'
    }
  }, React.createElement('p', {
    style: C.eyebrow
  }, t.nav.section + ' ' + n + ' ' + t.nav.of + ' 5'), React.createElement('p', {
    style: C.eyebrow
  }, progress + '% ' + t.nav.progress)), React.createElement('div', {
    style: C.progLine
  }, React.createElement('div', {
    style: C.progFill(progress)
  })));
}
function DNav({
  onBack,
  onNext,
  nextLabel,
  C,
  t
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginTop: '2.5rem'
    }
  }, React.createElement('button', {
    className: 'cta-btn',
    style: {
      ...C.cta,
      ...C.ctaSec
    },
    onClick: onBack
  }, t.nav.back), React.createElement('button', {
    className: 'cta-btn',
    style: C.cta,
    onClick: onNext
  }, nextLabel || t.nav.next));
}
function DiagnosticPage({
  lang = 'en'
}) {
  const {
    useState,
    useEffect,
    useRef
  } = React;
  const t = DIAG[lang] || DIAG.en;
  const [screen, setScreen] = useState('intro'); // intro | 1 | 2 | 3 | 4 | 5 | done
  const [ans, setAns] = useState({}); // scored: b1..b8, x1..x10, i1..i12
  const [prof, setProf] = useState({
    stage: []
  }); // stage (multi) + time/rev + goal/problem
  const [opens, setOpens] = useState({}); // s5 open answers 0..3
  const [name, setName] = useState('');
  const [emailV, setEmailV] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const bookHref = lang === 'el' ? '/el/book/' : '/book/';
  const mob = typeof window !== 'undefined' && window.innerWidth < 768;

  // Scroll the real scrolling container (#main-scroll) — and the window as a
  // fallback — to the top whenever the screen changes.
  const scrollTop = () => {
    const s = typeof document !== 'undefined' && document.getElementById('main-scroll');
    if (s) s.scrollTop = 0;
    if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0);
  };
  useEffect(() => {
    scrollTop();
  }, [screen]);
  const go = s => {
    setScreen(s);
    scrollTop();
  };
  const SCORED = [{
    pfx: 'b',
    section: t.s2
  }, {
    pfx: 'x',
    section: t.s3
  }, {
    pfx: 'i',
    section: t.s4
  }];
  const totalScored = 30;
  const answeredScored = SCORED.reduce((n, s) => n + s.section.statements.filter((_, i) => ans[s.pfx + (i + 1)] !== undefined).length, 0);
  const progress = Math.round(answeredScored / totalScored * 100);
  function valByQ(q) {
    if (q <= 8) return ans['b' + q];
    if (q <= 18) return ans['x' + (q - 8)];
    return ans['i' + (q - 18)];
  }
  function avg(vals) {
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  function fmt(v) {
    return v === null ? '—' : v.toFixed(1);
  }
  function buildReport() {
    const L = [];
    const line = s => L.push(s);
    const enS = DIAG.en;
    line('STARTING DIAGNOSTIC — new submission');
    line('Language: ' + (lang === 'el' ? 'Greek (/el/)' : 'English'));
    line('Submitted: ' + new Date().toISOString());
    line('Page: ' + (typeof window !== 'undefined' ? window.location.href : ''));
    line('');
    line('── PERSON ──');
    line('Name: ' + (name || '—'));
    line('Email: ' + (emailV || '—'));
    line('Website / LinkedIn: ' + (website || '—'));
    line('');
    line('── WHERE THEY ARE ──');
    const stages = (prof.stage || []).map(i => enS.s1.stage[i]).filter(Boolean);
    line('Stage: ' + (stages.length ? stages.join('; ') : '—'));
    line('Time building: ' + (prof.time != null ? enS.s1.time[prof.time] : '—'));
    line('Revenue stage: ' + (prof.rev != null ? enS.s1.rev[prof.rev] : '—'));
    line('');
    line('── WHAT THEY WANT ──');
    line('12-month goal: ' + (prof.goal || '—'));
    line('Biggest problem now: ' + (prof.problem || '—'));
    line('');
    const dump = (title, pfx, statements, startNo) => {
      line('── ' + title + ' (1 = not true at all, 5 = very true) ──');
      statements.forEach((st, i) => {
        const v = ans[pfx + (i + 1)];
        line(startNo + i + '. ' + st + ' => ' + (v === undefined ? '—' : v));
      });
      line('');
    };
    dump('BUSINESS', 'b', enS.s2.statements, 1);
    dump('BEHAVIOUR / EXECUTION', 'x', enS.s3.statements, 9);
    dump('IDENTITY / PRESSURE', 'i', enS.s4.statements, 19);
    line('── OPEN ANSWERS (verbatim) ──');
    enS.s5.opens.forEach((label, i) => {
      line(label);
      line(opens[i] || '—');
      line('');
    });
    line('── INTERNAL SIGNALS (scanning aids only — NOT a diagnosis) ──');
    DIMENSIONS.forEach(d => {
      const vals = d.qs.map(valByQ).filter(v => typeof v === 'number');
      line(d.key + (d.positive ? ' (higher = stronger)' : '') + ': ' + fmt(avg(vals)) + ' / 5  (' + vals.length + '/' + d.qs.length + ' answered)');
    });
    line('');
    const psych = [];
    for (let q = 9; q <= 30; q++) {
      const v = valByQ(q);
      if (typeof v === 'number') {
        const st = q <= 18 ? enS.s3.statements[q - 9] : enS.s4.statements[q - 19];
        psych.push({
          q,
          v,
          st
        });
      }
    }
    psych.sort((a, b) => b.v - a.v);
    line('Five strongest signals (Q9–30, high = pattern present):');
    psych.slice(0, 5).forEach((p, i) => line(i + 1 + '. [' + p.v + '/5] Q' + p.q + ' — ' + p.st));
    return L.join('\n');
  }
  function submit() {
    const em = emailV.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!name.trim() || !validEmail) {
      setErr(t.nav.required);
      return;
    }
    setErr('');
    setSending(true);
    const report = buildReport();
    const payload = {
      user_email: em,
      user_name: name.trim(),
      user_website: website.trim(),
      overall_grade: 'Starting Diagnostic submission',
      overall_score: '—',
      section_breakdown: 'Starting Diagnostic — see full structured answers below.',
      all_answers: report,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    };
    const finish = () => {
      setSending(false);
      go('done');
    };
    let done = false;
    const done1 = () => {
      if (!done) {
        done = true;
        finish();
      }
    };
    try {
      fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {}
    if (window.emailjs) {
      emailjs.send('service_i4xq7vg', 'template_wdsrbdo', payload).then(done1).catch(e => {
        console.error('Email error:', e);
        done1();
      });
      setTimeout(done1, 6000);
    } else {
      done1();
    }
  }
  const ACC = '#1a7f37';
  const C = {
    page: {
      maxWidth: 820,
      margin: '0 auto',
      padding: mob ? '2rem 1.25rem 6rem' : '4rem 2.5rem 7rem',
      color: '#282726',
      fontFamily: 'inherit'
    },
    eyebrow: {
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#666',
      lineHeight: 1.6
    },
    h1: {
      fontSize: mob ? '27px' : '34px',
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-.02em',
      color: '#282726',
      margin: '0 0 1.25rem'
    },
    p: {
      margin: '0 0 1.2rem',
      lineHeight: 1.7,
      fontSize: mob ? '17px' : '18px',
      color: '#282726'
    },
    sectionH: {
      fontSize: mob ? '22px' : '27px',
      fontWeight: 500,
      letterSpacing: '-.02em',
      lineHeight: 1.25,
      color: '#282726',
      margin: '0 0 1.5rem'
    },
    qLabel: {
      fontSize: mob ? '16px' : '17px',
      fontWeight: 600,
      color: '#282726',
      margin: '0 0 .9rem',
      lineHeight: 1.5
    },
    note: {
      fontSize: '14px',
      color: '#777',
      lineHeight: 1.7
    },
    cta: {
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#fff',
      background: ACC,
      border: '1.5px solid ' + ACC,
      borderRadius: '2px',
      padding: '.9rem 1.7rem',
      display: 'inline-block',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    ctaSec: {
      background: 'transparent',
      color: '#282726',
      border: '1.5px solid rgba(40,39,38,.35)'
    },
    choice: sel => ({
      width: '100%',
      textAlign: 'left',
      border: sel ? '1.5px solid ' + ACC : '1px solid rgba(40,39,38,.18)',
      padding: mob ? '.8rem .9rem' : '.85rem 1rem',
      borderRadius: '10px',
      background: sel ? 'rgba(26,127,55,.08)' : '#fff',
      color: '#282726',
      fontFamily: 'inherit',
      fontSize: mob ? '15px' : '16px',
      lineHeight: 1.5,
      cursor: 'pointer',
      marginBottom: '.6rem',
      transition: 'border-color .12s, background .12s'
    }),
    field: {
      width: '100%',
      border: '1px solid rgba(40,39,38,.2)',
      padding: '.85rem 1rem',
      borderRadius: '10px',
      background: '#fff',
      color: '#282726',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: 1.6,
      outline: 'none'
    },
    scaleBtn: sel => ({
      flex: 1,
      minWidth: 0,
      padding: mob ? '.7rem 0' : '.75rem 0',
      border: sel ? '1.5px solid ' + ACC : '1px solid rgba(40,39,38,.18)',
      background: sel ? ACC : '#fff',
      color: sel ? '#fff' : '#282726',
      fontFamily: 'inherit',
      fontSize: '15px',
      fontWeight: 600,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'border-color .12s, background .12s'
    }),
    progLine: {
      height: '2px',
      background: 'rgba(40,39,38,.12)',
      borderRadius: '2px',
      marginTop: '.7rem'
    },
    progFill: pct => ({
      height: '2px',
      background: ACC,
      width: pct + '%',
      borderRadius: '2px',
      transition: 'width .25s ease'
    }),
    row: {
      border: '1px solid rgba(40,39,38,.14)',
      borderRadius: '12px',
      padding: mob ? '1.1rem' : '1.25rem 1.35rem',
      marginBottom: '.9rem',
      background: '#fff'
    }
  };
  const footer = () => typeof SiteFooter !== 'undefined' ? React.createElement(SiteFooter, {
    mob,
    lang
  }) : null;
  const toggleStage = i => setProf(p => {
    const cur = p.stage || [];
    return {
      ...p,
      stage: cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i]
    };
  });
  if (screen === 'intro') return React.createElement('div', {
    style: C.page
  }, React.createElement('div', {
    style: {
      ...C.eyebrow,
      color: ACC,
      marginBottom: '1rem'
    }
  }, t.dir), React.createElement('h1', {
    style: C.h1
  }, t.intro.h1), t.intro.p.map((x, i) => React.createElement('p', {
    key: i,
    style: C.p
  }, x)), React.createElement('p', {
    style: {
      ...C.note,
      marginBottom: '2rem'
    }
  }, t.intro.duration), React.createElement('button', {
    className: 'cta-btn',
    style: C.cta,
    onClick: () => go(1)
  }, t.intro.start), footer());
  if (screen === 1) return React.createElement('div', {
    style: C.page
  }, React.createElement(DProg, {
    n: 1,
    progress,
    C,
    t
  }), React.createElement('h2', {
    style: C.sectionH
  }, t.s1.label), React.createElement(DChoice, {
    label: t.s1.stageQ,
    options: t.s1.stage,
    C,
    selected: prof.stage,
    onPick: toggleStage,
    multi: true
  }), React.createElement(DChoice, {
    label: t.s1.timeQ,
    options: t.s1.time,
    C,
    selected: prof.time,
    onPick: i => setProf(p => ({
      ...p,
      time: i
    }))
  }), React.createElement(DChoice, {
    label: t.s1.revQ,
    options: t.s1.rev,
    C,
    selected: prof.rev,
    onPick: i => setProf(p => ({
      ...p,
      rev: i
    }))
  }), React.createElement(DField, {
    label: t.s1.goalQ,
    value: prof.goal,
    onChange: v => setProf(p => ({
      ...p,
      goal: v
    })),
    C
  }), React.createElement(DField, {
    label: t.s1.problemQ,
    value: prof.problem,
    onChange: v => setProf(p => ({
      ...p,
      problem: v
    })),
    C
  }), React.createElement(DNav, {
    onBack: () => go('intro'),
    onNext: () => go(2),
    C,
    t
  }));
  if (screen === 2 || screen === 3 || screen === 4) {
    const cfg = {
      2: t.s2,
      3: t.s3,
      4: t.s4
    }[screen];
    const pfx = {
      2: 'b',
      3: 'x',
      4: 'i'
    }[screen];
    return React.createElement('div', {
      style: C.page
    }, React.createElement(DProg, {
      n: screen,
      progress,
      C,
      t
    }), React.createElement('h2', {
      style: C.sectionH
    }, cfg.label), cfg.statements.map((st, i) => React.createElement(DScale, {
      key: i,
      text: st,
      value: ans[pfx + (i + 1)],
      onPick: v => setAns(a => ({
        ...a,
        [pfx + (i + 1)]: v
      })),
      C,
      low: t.scale.low,
      high: t.scale.high
    })), React.createElement(DNav, {
      onBack: () => go(screen - 1),
      onNext: () => go(screen + 1),
      C,
      t
    }));
  }
  if (screen === 5) return React.createElement('div', {
    style: C.page
  }, React.createElement(DProg, {
    n: 5,
    progress,
    C,
    t
  }), React.createElement('h2', {
    style: C.sectionH
  }, t.s5.label), t.s5.opens.map((q, i) => React.createElement(DField, {
    key: i,
    label: q,
    value: opens[i],
    onChange: v => setOpens(o => ({
      ...o,
      [i]: v
    })),
    C
  })), React.createElement('div', {
    style: {
      borderTop: '1px solid rgba(40,39,38,.14)',
      paddingTop: '2rem',
      marginTop: '.5rem'
    }
  }, React.createElement('div', {
    style: {
      marginBottom: '1.2rem'
    }
  }, React.createElement('label', {
    style: {
      ...C.eyebrow,
      display: 'block',
      marginBottom: '.5rem'
    }
  }, t.s5.name), React.createElement('input', {
    type: 'text',
    value: name,
    onChange: e => setName(e.target.value),
    style: C.field
  })), React.createElement('div', {
    style: {
      marginBottom: '1.2rem'
    }
  }, React.createElement('label', {
    style: {
      ...C.eyebrow,
      display: 'block',
      marginBottom: '.5rem'
    }
  }, t.s5.email), React.createElement('input', {
    type: 'email',
    value: emailV,
    onChange: e => setEmailV(e.target.value),
    placeholder: 'you@example.com',
    style: C.field
  })), React.createElement('div', {
    style: {
      marginBottom: '1.4rem'
    }
  }, React.createElement('label', {
    style: {
      ...C.eyebrow,
      display: 'block',
      marginBottom: '.5rem'
    }
  }, t.s5.website), React.createElement('input', {
    type: 'text',
    value: website,
    onChange: e => setWebsite(e.target.value),
    style: C.field
  })), React.createElement('p', {
    style: {
      fontSize: '14px',
      lineHeight: 1.65,
      color: '#666',
      margin: '0 0 1.5rem',
      paddingLeft: '.9rem',
      borderLeft: '2px solid ' + ACC
    }
  }, t.s5.notice), err && React.createElement('p', {
    style: {
      color: '#c0392b',
      fontSize: '14px',
      margin: '0 0 1rem'
    }
  }, err), React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem'
    }
  }, React.createElement('button', {
    className: 'cta-btn',
    style: {
      ...C.cta,
      ...C.ctaSec
    },
    onClick: () => go(4)
  }, t.nav.back), React.createElement('button', {
    className: 'cta-btn',
    style: {
      ...C.cta,
      opacity: sending ? 0.5 : 1
    },
    disabled: sending,
    onClick: submit
  }, sending ? t.s5.sending : t.s5.submit))));
  if (screen === 'done') return React.createElement('div', {
    style: C.page
  }, React.createElement('div', {
    style: {
      ...C.eyebrow,
      color: ACC,
      marginBottom: '1rem'
    }
  }, t.dir), React.createElement('h1', {
    style: C.h1
  }, t.done.h1), t.done.p.map((x, i) => React.createElement('p', {
    key: i,
    style: C.p
  }, x)), React.createElement('a', {
    href: bookHref,
    className: 'cta-btn',
    style: {
      ...C.cta,
      marginTop: '.8rem'
    }
  }, t.done.book), footer());
  return null;
}
Object.assign(window, {
  DiagnosticPage
});
