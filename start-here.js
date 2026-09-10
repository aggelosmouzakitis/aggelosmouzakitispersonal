// start-here.jsx — "Start Here" orientation flow (English).
// Reuses the Starting Diagnostic's layout, answer cards, selection + Continue,
// Back control, transition timing and selected-state behaviour. All copy and
// destinations live in one FLOW/OUTCOMES config so they stay easy to edit.
//
// Mounted via window.LegacyShell (same page shell as the diagnostic).

var e = React.createElement;

// External + internal destinations (reuse the site's existing URLs).
var LINKEDIN = window.EXTERNAL && window.EXTERNAL.linkedin || 'https://linkedin.com/in/growth-product-manager/';
var ASK = 'https://aggelosmouzakitis.com/ask-me-anything/';

// ── One configuration object drives the whole flow ───────────────────────────
var Q1 = {
  eyebrow: 'START HERE',
  heading: 'What brought you here today?',
  support: 'There is no right answer. Choose whatever feels closest today.',
  options: [{
    text: 'I’m just looking around. I want to understand who you are and how you think.',
    to: 'looking'
  }, {
    text: 'Something is on my mind, but I’m not ready to speak to someone or explain it properly.',
    to: 'mind'
  }, {
    text: 'I might want help, but I don’t know what kind.',
    to: 'help'
  }, {
    text: 'I have a fairly clear idea of what I want help with.',
    to: 'q2'
  }]
};
var Q2 = {
  heading: 'What would you like to work on?',
  support: 'Choose the option that feels closest.',
  options: [{
    text: 'I want to turn my experience into a clear offer that people can understand and buy.',
    caption: 'Experience-to-Offer Audit',
    nav: '/career-strategy-consulting/',
    service: 'experience-to-offer'
  }, {
    text: 'I already run a solo business and want to understand what is really limiting its growth.',
    caption: 'Solo Business Growth Audit',
    nav: '/solopreneur-growth-consulting/',
    service: 'solo-business-growth'
  }, {
    text: 'I have a live problem or decision and would benefit from a strong thinking partner.',
    caption: 'Private Sparring',
    nav: '/psychotherapy-decision-coaching/',
    service: 'private-sparring'
  }, {
    text: 'I know I want help, but none of these feels quite right.',
    caption: 'Start with a free orientation chat',
    to: 'help',
    service: 'orientation'
  }]
};
var OUTCOMES = {
  looking: {
    path: 'looking-around',
    heading: 'Take your time.',
    body: ['You’re welcome to look around without doing anything else. Read about me, see what clients say, or connect with me and get a feel for how I think over time.'],
    primary: {
      label: 'JUST SAY HI ON LINKEDIN →',
      href: LINKEDIN,
      external: true,
      event: 'linkedin_opened'
    },
    secondary: [{
      label: 'ABOUT ME →',
      href: '/about/'
    }, {
      label: 'CLIENT STORIES →',
      href: '/reviews/'
    }],
    closing: 'Or simply enjoy your visit. Nothing else is expected of you.'
  },
  mind: {
    path: 'something-on-my-mind',
    heading: 'You can start with the unfinished version.',
    body: ['You do not have to turn it into a neat question. A sentence, a thought that keeps returning, or a few rough words are enough.'],
    primary: {
      label: 'ASK ANYTHING →',
      href: ASK,
      event: 'ask_anything_opened'
    },
    primaryMicro: 'You can include your name or ask anonymously.'
  },
  help: {
    path: 'might-want-help',
    heading: 'We can find the starting point together.',
    body: ['If talking would help, we can have a friendly 30-minute conversation. I’ll listen, ask a few useful questions, and help you understand what may be worth doing next.', 'You do not need to prepare or decide whether you want ongoing help. There is no pressure to turn the conversation into paid work.', 'The useful next step may be one of my services. It may also be a resource, another person, or simply giving it more time.'],
    primary: {
      label: 'SEE AVAILABLE TIMES →',
      href: '/book/',
      event: 'booking_page_opened'
    },
    primaryMicro: 'Free · 30 minutes · Online · Available when my schedule allows',
    secondary: [{
      label: 'I’D RATHER ASK ANYTHING →',
      href: ASK,
      event: 'ask_anything_opened',
      micro: 'You can include your name or ask anonymously.'
    }]
  }
};

// ── Analytics (existing gtag). Every event carries the selected path. ─────────
function track(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (err) {/* noop */}
}
function StartHerePage() {
  var R = React;
  var mob = typeof window !== 'undefined' && window.innerWidth < 768;
  var ACC = '#059669';

  // Screen stack (current = last). Kept in a ref too so popstate/handlers read
  // the latest without stale closures.
  var stackState = R.useState(['q1']);
  var stack = stackState[0],
    setStack = stackState[1];
  var stackRef = R.useRef(['q1']);
  var screen = stack[stack.length - 1];
  var q1Sel = R.useState(null); // preserved across Back
  var q2Sel = R.useState(null);
  var headingRef = R.useRef(null);
  var liveRef = R.useRef(null);
  function sync(next) {
    stackRef.current = next;
    setStack(next);
  }
  function goTo(s) {
    var next = stackRef.current.concat([s]);
    sync(next);
    try {
      window.history.pushState({
        sh: s,
        depth: next.length
      }, '');
    } catch (err) {}
  }
  function back() {
    try {
      window.history.back();
    } catch (err) {
      popOne();
    }
  }
  function popOne() {
    var cur = stackRef.current;
    if (cur.length > 1) sync(cur.slice(0, -1));
  }
  function startAgain() {
    q1Sel[1](null);
    q2Sel[1](null);
    sync(['q1']);
    try {
      window.history.pushState({
        sh: 'q1',
        depth: 1
      }, '');
    } catch (err) {}
  }

  // Browser Back / Forward → keep the in-app stack in sync.
  R.useEffect(function () {
    function onPop() {
      popOne();
    }
    window.addEventListener('popstate', onPop);
    try {
      window.history.replaceState({
        sh: 'q1',
        depth: 1
      }, '');
    } catch (err) {}
    track('start_here_viewed', {
      path: 'start'
    });
    return function () {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  // After each screen change: scroll to top, move focus to the heading, announce.
  R.useEffect(function () {
    var s = typeof document !== 'undefined' && document.getElementById('main-scroll');
    if (s) s.scrollTop = 0;
    if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0);
    if (headingRef.current) {
      try {
        headingRef.current.focus();
      } catch (err) {}
    }
    if (liveRef.current) liveRef.current.textContent = headingRef.current ? headingRef.current.textContent : '';
  }, [screen]);

  // ── styles (mirror the Starting Diagnostic; headings use brand #181A1C) ──
  var C = {
    page: {
      maxWidth: 840,
      margin: '0 auto',
      padding: mob ? '1.5rem 0 3rem' : '2.5rem 0 4rem',
      color: '#282726',
      fontFamily: 'inherit'
    },
    eyebrow: {
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: ACC,
      lineHeight: 1.6,
      margin: '0 0 1rem'
    },
    h1: {
      fontFamily: 'var(--font-heading)',
      fontSynthesis: 'none',
      fontSize: mob ? '30px' : '44px',
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: '-.035em',
      color: '#181A1C',
      margin: '0 0 1rem',
      outline: 'none'
    },
    support: {
      margin: '0 0 2rem',
      lineHeight: 1.6,
      fontSize: mob ? '17px' : '18px',
      color: '#282726'
    },
    body: {
      margin: '0 0 1.2rem',
      lineHeight: 1.7,
      fontSize: mob ? '17px' : '18px',
      color: '#282726',
      maxWidth: '64ch'
    },
    choice: function (sel) {
      return {
        width: '100%',
        textAlign: 'left',
        border: sel ? '1.5px solid ' + ACC : '1px solid rgba(40,39,38,.18)',
        padding: mob ? '1rem 1.05rem' : '1.15rem 1.25rem',
        borderRadius: '10px',
        background: sel ? 'rgba(5,150,105,.08)' : '#fff',
        color: '#282726',
        fontFamily: 'inherit',
        fontSize: mob ? '16px' : '17px',
        lineHeight: 1.5,
        cursor: 'pointer',
        marginBottom: '.75rem',
        minHeight: 44,
        transition: 'border-color .12s, background .12s',
        display: 'block'
      };
    },
    caption: {
      display: 'block',
      marginTop: '.4rem',
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '.04em',
      color: ACC
    },
    ctaPrimary: {
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#fff',
      background: ACC,
      border: '1.5px solid ' + ACC,
      borderRadius: '2px',
      padding: '1rem 1.7rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      cursor: 'pointer',
      textDecoration: 'none'
    },
    ctaOutline: {
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#282726',
      background: 'transparent',
      border: '1.5px solid rgba(40,39,38,.35)',
      borderRadius: '2px',
      padding: '1rem 1.7rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      cursor: 'pointer',
      textDecoration: 'none'
    },
    micro: {
      fontSize: '14px',
      color: '#666',
      lineHeight: 1.6,
      margin: '.7rem 0 0'
    },
    back: {
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: '#282726',
      background: 'transparent',
      border: '1.5px solid rgba(40,39,38,.35)',
      borderRadius: '2px',
      padding: '.9rem 1.5rem',
      minHeight: 44,
      cursor: 'pointer'
    },
    continue: function (on) {
      return {
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
        minHeight: 44,
        cursor: on ? 'pointer' : 'not-allowed',
        opacity: on ? 1 : 0.45
      };
    },
    startAgain: {
      display: 'inline-block',
      marginTop: '2.5rem',
      fontFamily: 'inherit',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: '#8a8a8a',
      background: 'none',
      border: 0,
      padding: '.5rem 0',
      cursor: 'pointer'
    }
  };
  var liveRegion = e('div', {
    ref: liveRef,
    'aria-live': 'polite',
    role: 'status',
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap'
    }
  });

  // Full-width CTAs and stacked buttons on mobile.
  var rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: mob ? '.75rem' : '1rem',
    flexDirection: mob ? 'column' : 'row',
    alignItems: mob ? 'stretch' : 'center'
  };
  function heading(text) {
    return e('h1', {
      style: C.h1,
      tabIndex: -1,
      ref: headingRef
    }, text);
  }

  // ── Question screen (q1 / q2) ──
  function renderQuestion(cfg, selPair, isFirst) {
    var sel = selPair[0],
      setSel = selPair[1];
    var canContinue = sel !== null && sel !== undefined;
    return e('div', {
      style: C.page
    }, liveRegion, cfg.eyebrow ? e('div', {
      style: C.eyebrow
    }, cfg.eyebrow) : null, heading(cfg.heading), e('p', {
      style: C.support
    }, cfg.support), e('div', {
      role: 'group',
      'aria-label': cfg.heading
    }, cfg.options.map(function (o, i) {
      var on = sel === i;
      return e('button', {
        key: i,
        type: 'button',
        className: 'opt-btn',
        style: C.choice(on),
        'aria-pressed': on ? 'true' : 'false',
        onClick: function () {
          setSel(i);
        }
      }, e('span', null, o.text), o.caption ? e('span', {
        style: C.caption
      }, o.caption) : null);
    })), e('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        marginTop: '2rem',
        flexDirection: mob ? 'column-reverse' : 'row'
      }
    }, isFirst ? e('span', null) : e('button', {
      type: 'button',
      className: 'cta-btn',
      style: C.back,
      onClick: back
    }, 'Back'), e('button', {
      type: 'button',
      className: 'cta-btn',
      style: C.continue(canContinue),
      disabled: !canContinue,
      onClick: function () {
        if (canContinue) onContinue(cfg, sel);
      }
    }, 'Continue')));
  }
  function onContinue(cfg, sel) {
    var o = cfg.options[sel];
    if (cfg === Q1) {
      track('first_answer_selected', {
        path: o.to === 'q2' ? 'clear-idea' : OUTCOMES[o.to] ? OUTCOMES[o.to].path : o.to
      });
      goTo(o.to);
    } else {
      // Q2
      track('service_category_selected', {
        path: 'clear-idea',
        category: o.service
      });
      if (o.nav) {
        track('service_page_opened', {
          path: 'clear-idea',
          service: o.service
        });
        window.location.href = o.nav;
      } else {
        goTo(o.to);
      }
    }
  }

  // ── Outcome screen ──
  function renderOutcome(key) {
    var o = OUTCOMES[key];
    function onCta(cta) {
      return function () {
        if (cta.event) track(cta.event, {
          path: o.path
        });
      };
    }
    return e('div', {
      style: C.page
    }, liveRegion, e('div', {
      style: C.eyebrow
    }, 'START HERE'), heading(o.heading), o.body.map(function (b, i) {
      return e('p', {
        key: i,
        style: C.body
      }, b);
    }),
    // Primary CTA (one green button) + its microcopy
    e('div', {
      style: {
        marginTop: '1.6rem'
      }
    }, e('a', {
      href: o.primary.href,
      className: 'cta-btn',
      style: Object.assign({}, C.ctaPrimary, mob ? {
        width: '100%'
      } : null),
      target: o.primary.external ? '_blank' : undefined,
      rel: o.primary.external ? 'noopener noreferrer' : undefined,
      onClick: onCta(o.primary)
    }, o.primary.label), o.primaryMicro ? e('p', {
      style: C.micro
    }, o.primaryMicro) : null),
    // Secondary CTAs (outline buttons / text links)
    o.secondary ? e('div', {
      style: {
        marginTop: '1.4rem'
      }
    }, e('div', {
      style: rowStyle
    }, o.secondary.map(function (s, i) {
      return e('a', {
        key: i,
        href: s.href,
        className: 'cta-btn',
        style: Object.assign({}, C.ctaOutline, mob ? {
          width: '100%'
        } : null),
        target: s.external ? '_blank' : undefined,
        rel: s.external ? 'noopener noreferrer' : undefined,
        onClick: onCta(s)
      }, s.label);
    })),
    // per-secondary microcopy (e.g. Ask Anything note under the secondary CTA)
    o.secondary.filter(function (s) {
      return s.micro;
    }).map(function (s, i) {
      return e('p', {
        key: i,
        style: C.micro
      }, s.micro);
    })) : null, o.closing ? e('p', {
      style: Object.assign({}, C.body, {
        marginTop: '1.6rem',
        color: '#666'
      })
    }, o.closing) : null,
    // Nav: Back + Start again
    e('div', {
      style: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '.25rem'
      }
    }, e('button', {
      type: 'button',
      className: 'cta-btn',
      style: C.back,
      onClick: back
    }, 'Back'), e('button', {
      type: 'button',
      style: C.startAgain,
      onClick: startAgain
    }, 'Start again')));
  }
  if (screen === 'q1') return renderQuestion(Q1, q1Sel, true);
  if (screen === 'q2') return renderQuestion(Q2, q2Sel, false);
  return renderOutcome(screen);
}
function renderStartHere() {
  ReactDOM.createRoot(document.getElementById('root')).render(e(window.LegacyShell, {
    page: 'start-here',
    lang: 'en',
    bare: true,
    cta: false
  }, e(StartHerePage, null)));
}
Object.assign(window, {
  StartHerePage: StartHerePage,
  renderStartHere: renderStartHere
});
