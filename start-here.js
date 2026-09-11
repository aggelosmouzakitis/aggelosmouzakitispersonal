// start-here.jsx — "Start Here" orientation flow (English).
//
// A two-question decision flow that ends on a recommendation ("outcome")
// screen. Editorial card system (numbered 2×2 cards, arrow affordance, green
// selected state), auto-advance on selection, full browser-history state, and
// accessible screen changes. All copy, routing and destinations live in the
// Q1 / Q2 / OUTCOMES config below so they stay easy to edit.
//
// Mounted with the site's shared chrome (SiteHeader / SiteFooterX) on a beige
// canvas. Layout is driven by CSS media queries (no width probing in JS), so
// resize and rotation reflow without another interaction.

var e = React.createElement;

// ── Destinations (reuse the site's existing URLs) ────────────────────────────
var LINKEDIN = window.EXTERNAL && window.EXTERNAL.linkedin || 'https://www.linkedin.com/in/growth-product-manager/';
var ABOUT = '/about/';
var REVIEWS = '/reviews/';
var ASK = '/ask-me-anything/';
var ORIENTATION = '/contact?interest=orientation'; // orientation call → contact page

// ── Flow configuration ───────────────────────────────────────────────────────
var Q1 = {
  step: 'START HERE · STEP 1',
  heading: 'What brings you here?',
  instruction: 'Choose the closest option.',
  options: [{
    text: 'I’m just looking around. I want to understand who you are and how you think.',
    go: {
      outcome: 'looking'
    }
  }, {
    text: 'Something is on my mind, but I’m not ready to talk it through yet.',
    go: {
      outcome: 'ask'
    }
  }, {
    text: 'I want help, but I’m not sure where to start.',
    go: {
      outcome: 'orientation'
    }
  }, {
    text: 'I know what I want to work on.',
    go: {
      screen: 'q2'
    }
  }]
};
var Q2 = {
  step: 'ONE MORE QUESTION · STEP 2',
  heading: 'What would you like to work on?',
  instruction: 'Choose the closest option.',
  options: [{
    text: 'I want to turn my experience into a clear offer that people can understand and buy.',
    kicker: 'Experience-to-Offer Audit',
    nav: '/career-strategy-consulting/',
    service: 'experience-to-offer'
  }, {
    text: 'I already run a solo business and want to understand what is really limiting its growth.',
    kicker: 'Solo Business Growth Audit',
    nav: '/solopreneur-growth-consulting/',
    service: 'solo-business-growth'
  }, {
    text: 'I have a difficult problem or decision and want a sharp outside perspective.',
    kicker: 'Private Sparring',
    nav: '/psychotherapy-decision-coaching/',
    service: 'private-sparring'
  }, {
    text: 'I want help, but none of these feels quite right.',
    kicker: 'Start with an orientation call',
    go: {
      outcome: 'orientation'
    },
    service: 'orientation'
  }]
};
var OUTCOMES = {
  looking: {
    key: 'looking-around',
    heading: 'Take your time.',
    body: 'Look around, read about me and see what clients say. If you want, connect with me on LinkedIn and get a feel for how I think over time.',
    primary: {
      label: 'JUST SAY HI ON LINKEDIN →',
      href: LINKEDIN,
      external: true,
      event: 'linkedin_opened'
    },
    secondary: [{
      label: 'ABOUT ME →',
      href: ABOUT
    }, {
      label: 'REVIEWS →',
      href: REVIEWS
    }]
  },
  ask: {
    key: 'something-on-my-mind',
    heading: 'Start with the unfinished version.',
    body: 'You do not need a neat question. A few rough words are enough.',
    primary: {
      label: 'ASK ANYTHING →',
      href: ASK,
      event: 'ask_anything_opened'
    },
    micro: 'Your name is optional.'
  },
  orientation: {
    key: 'orientation',
    heading: 'We can find the starting point together.',
    body: 'We can have a 30-minute conversation to clarify what is happening and identify the most useful next step. You do not need to prepare or decide whether you want ongoing help.',
    primary: {
      label: 'REQUEST AN ORIENTATION CALL →',
      href: ORIENTATION,
      event: 'contact_page_opened'
    },
    details: 'Free · 30 minutes · Online',
    secondary: [{
      label: 'I’D RATHER ASK SOMETHING →',
      href: ASK,
      event: 'ask_anything_opened',
      micro: 'Your name is optional.'
    }]
  }
};
var INITIAL = {
  screen: 'q1',
  firstAnswer: null,
  secondAnswer: null,
  outcome: null
};
var SELECT_DELAY = 180; // ms of visible selected-state feedback before advancing

// ── Analytics (existing gtag; no-op if absent) ───────────────────────────────
function track(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (err) {/* noop */}
}

// ── Scoped styles (baked into #root by the prerenderer) ──────────────────────
function StartHereStyles() {
  var css = ['.sh-root{display:flex;flex-direction:column;min-height:100vh;background:#F4F1EA}', '.sh-main{flex:1 0 auto;background:#F4F1EA;color:#282726}', '.sh-wrap{width:min(100% - 40px,1000px);margin-inline:auto;padding-block:clamp(40px,6vw,72px) clamp(48px,7vw,88px)}', '.sh-stage{min-height:clamp(440px,56vh,560px)}', '.sh-intro{max-width:760px}', '.sh-step{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#047857;margin:0 0 14px}', '.sh-h1{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,4.4vw,46px);font-weight:800;line-height:1.04;letter-spacing:-.03em;color:#181A1C;margin:0 0 12px;outline:none}', '.sh-instr{font-size:16px;line-height:1.55;color:#282726;margin:0 0 30px}',
  // card grid
  '.sh-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}', '.sh-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:158px;text-align:left;background:#FFFFFF;border:1.5px solid rgba(24,26,28,.22);border-radius:8px;padding:26px 30px 28px;cursor:pointer;font-family:inherit;color:#181A1C;transition:border-color .15s,box-shadow .15s,transform .15s}', '.sh-card:hover{border-color:rgba(24,26,28,.5)}', '.sh-card:focus-visible{outline:2px solid #047857;outline-offset:3px}', '.sh-card.is-sel{border-color:#047857;box-shadow:6px 6px 0 rgba(4, 120, 87,.20);transform:translate(-1px,-1px)}', '.sh-card__top{display:flex;align-items:center;justify-content:space-between}', '.sh-card__num{font-family:var(--font-heading);font-size:17px;font-weight:800;letter-spacing:.02em;color:#181A1C;font-variant-numeric:tabular-nums}', '.sh-card.is-sel .sh-card__num{color:#047857}', '.sh-card__arrow{font-size:20px;line-height:1;color:#181A1C;transition:transform .15s,color .15s}', '.sh-card:hover .sh-card__arrow{transform:translateX(3px)}', '.sh-card.is-sel .sh-card__arrow{color:#047857}', '.sh-card__body{display:block}', '.sh-card__copy{font-size:clamp(20px,1.55vw,24px);line-height:1.28;font-weight:500;letter-spacing:-.01em;color:#181A1C}', '.sh-card__kicker{display:block;margin-top:16px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#047857}',
  // outcome
  '.sh-outcome{display:grid;grid-template-columns:7fr 5fr;gap:44px;align-items:start}', '.sh-outcome__lead{min-width:0}', '.sh-outcome__h{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,4.4vw,46px);font-weight:800;line-height:1.05;letter-spacing:-.03em;color:#181A1C;margin:0 0 18px;outline:none}', '.sh-outcome__body{font-size:18px;line-height:1.6;color:#282726;margin:0;max-width:60ch}', '.sh-panel{background:#FFFFFF;border:1.5px solid rgba(24,26,28,.20);border-radius:8px;padding:26px 24px}', '.sh-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:54px;padding:0 20px;background:#047857;color:#fff;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase;line-height:1.25;text-align:center;border:1.5px solid #047857;border-radius:0;text-decoration:none;cursor:pointer;transition:filter .16s}', '.sh-btn:hover{filter:brightness(.93)}', '.sh-btn--ghost{background:transparent;color:#181A1C;border-color:rgba(24,26,28,.30)}', '.sh-btn--ghost:hover{filter:none;border-color:#181A1C}', '.sh-btn + .sh-btn{margin-top:12px}', '.sh-note{font-size:13px;line-height:1.5;color:#5E6264;margin:10px 0 0}', '.sh-panel__group + .sh-panel__group{margin-top:16px;padding-top:16px;border-top:1px solid rgba(24,26,28,.12)}',
  // quiet controls
  '.sh-controls{display:flex;flex-wrap:wrap;gap:24px;align-items:center;margin-top:36px}', '.sh-quiet{background:none;border:0;padding:6px 0;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8A8A8A;cursor:pointer;transition:color .15s}', '.sh-quiet:hover{color:#181A1C}', '.sh-quiet:focus-visible{outline:2px solid #047857;outline-offset:3px}',
  // responsive
  '@media (max-width:820px){.sh-outcome{grid-template-columns:1fr;gap:28px}}', '@media (max-width:680px){.sh-grid{grid-template-columns:1fr;gap:16px}.sh-card{min-height:0;gap:22px;padding:24px 24px 26px}.sh-stage{min-height:0}}', '@media (prefers-reduced-motion:reduce){.sh-card,.sh-card__arrow,.sh-btn,.sh-quiet{transition:none}.sh-card.is-sel{transform:none}}'].join('');
  return e('style', {
    dangerouslySetInnerHTML: {
      __html: css
    }
  });
}

// ── Flow component ───────────────────────────────────────────────────────────
function StartHerePage() {
  var R = React;
  var stState = R.useState(INITIAL);
  var st = stState[0],
    setSt = stState[1];
  var stRef = R.useRef(INITIAL);
  var pendingState = R.useState(null); // index shown selected during the advance delay
  var pending = pendingState[0],
    setPending = pendingState[1];
  var lockRef = R.useRef(false); // guards against double-advance
  var timerRef = R.useRef(null);
  var headingRef = R.useRef(null);
  var liveRef = R.useRef(null);
  function commit(next, push) {
    try {
      window.history[push ? 'pushState' : 'replaceState'](next, '');
    } catch (err) {}
    stRef.current = next;
    setSt(next);
  }

  // Record the selection onto the CURRENT history entry (so browser Back
  // restores this screen with the chosen card still highlighted).
  function markSelection(i) {
    var cur = stRef.current;
    var upd = cur.screen === 'q1' ? {
      screen: cur.screen,
      firstAnswer: i,
      secondAnswer: cur.secondAnswer,
      outcome: cur.outcome
    } : {
      screen: cur.screen,
      firstAnswer: cur.firstAnswer,
      secondAnswer: i,
      outcome: cur.outcome
    };
    try {
      window.history.replaceState(upd, '');
    } catch (err) {}
    stRef.current = upd;
  }
  function selectQ1(i) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPending(i);
    markSelection(i);
    var o = Q1.options[i];
    track('first_answer_selected', {
      path: o.go.outcome ? OUTCOMES[o.go.outcome].key : 'clear-idea'
    });
    timerRef.current = setTimeout(function () {
      lockRef.current = false;
      setPending(null);
      if (o.go.screen === 'q2') {
        commit({
          screen: 'q2',
          firstAnswer: i,
          secondAnswer: null,
          outcome: null
        }, true);
      } else {
        commit({
          screen: 'outcome',
          firstAnswer: i,
          secondAnswer: null,
          outcome: o.go.outcome
        }, true);
      }
    }, SELECT_DELAY);
  }
  function selectQ2(i) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPending(i);
    markSelection(i);
    var o = Q2.options[i];
    track('service_category_selected', {
      path: 'clear-idea',
      category: o.service
    });
    timerRef.current = setTimeout(function () {
      if (o.nav) {
        track('service_page_opened', {
          path: 'clear-idea',
          service: o.service
        });
        window.location.href = o.nav; // leave the flow
        return;
      }
      lockRef.current = false;
      setPending(null);
      commit({
        screen: 'outcome',
        firstAnswer: stRef.current.firstAnswer,
        secondAnswer: i,
        outcome: o.go.outcome
      }, true);
    }, SELECT_DELAY);
  }
  function goBack() {
    try {
      window.history.back();
    } catch (err) {}
  }
  function startOver() {
    if (timerRef.current) clearTimeout(timerRef.current);
    lockRef.current = false;
    setPending(null);
    commit(INITIAL, false); // replaceState → no duplicate flow step
  }

  // Init history + browser Back/Forward restoration.
  R.useEffect(function () {
    try {
      window.history.replaceState(INITIAL, '');
    } catch (err) {}
    stRef.current = INITIAL;
    track('start_here_viewed', {
      path: 'start'
    });
    function onPop(ev) {
      if (timerRef.current) clearTimeout(timerRef.current);
      lockRef.current = false;
      setPending(null);
      var s = ev.state && ev.state.screen ? ev.state : INITIAL;
      stRef.current = s;
      setSt(s);
    }
    window.addEventListener('popstate', onPop);
    return function () {
      window.removeEventListener('popstate', onPop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // On every screen change: scroll to top, focus the heading, announce.
  var screenKey = st.screen + ':' + (st.outcome || '');
  R.useEffect(function () {
    if (typeof window !== 'undefined' && window.scrollTo) {
      try {
        window.scrollTo(0, 0);
      } catch (err) {}
    }
    if (headingRef.current) {
      try {
        headingRef.current.focus();
      } catch (err) {}
    }
    if (liveRef.current) {
      var label = st.screen === 'outcome' ? 'Your next step: ' + (headingRef.current ? headingRef.current.textContent : '') : st.screen === 'q2' ? 'Step 2 of 2. ' + Q2.heading : 'Step 1. ' + Q1.heading;
      liveRef.current.textContent = label;
    }
  }, [screenKey]);
  var live = e('div', {
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
  function selectedIndex() {
    if (pending !== null && pending !== undefined) return pending;
    return st.screen === 'q1' ? st.firstAnswer : st.secondAnswer;
  }
  function questionScreen(cfg, onSelect, isFirst) {
    var sel = selectedIndex();
    return e('div', {
      className: 'sh-stage'
    }, live, e('div', {
      className: 'sh-intro'
    }, e('p', {
      className: 'sh-step'
    }, cfg.step), e('h1', {
      className: 'sh-h1',
      tabIndex: -1,
      ref: headingRef
    }, cfg.heading), e('p', {
      className: 'sh-instr'
    }, cfg.instruction)), e('div', {
      className: 'sh-grid',
      role: 'group',
      'aria-label': cfg.heading
    }, cfg.options.map(function (o, i) {
      var on = sel === i;
      var num = ('0' + (i + 1)).slice(-2);
      return e('button', {
        key: i,
        type: 'button',
        className: 'sh-card' + (on ? ' is-sel' : ''),
        'aria-pressed': on ? 'true' : 'false',
        onClick: function () {
          onSelect(i);
        }
      }, e('div', {
        className: 'sh-card__top'
      }, e('span', {
        className: 'sh-card__num'
      }, num), e('span', {
        className: 'sh-card__arrow',
        'aria-hidden': 'true'
      }, '→')), e('div', {
        className: 'sh-card__body'
      }, e('span', {
        className: 'sh-card__copy'
      }, o.text), o.kicker ? e('span', {
        className: 'sh-card__kicker'
      }, o.kicker) : null));
    })), controls(isFirst));
  }
  function controls(isFirst) {
    if (isFirst) return null;
    return e('div', {
      className: 'sh-controls'
    }, e('button', {
      type: 'button',
      className: 'sh-quiet',
      onClick: goBack
    }, '← Back'), e('button', {
      type: 'button',
      className: 'sh-quiet',
      onClick: startOver
    }, 'Start over'));
  }
  function actionLink(a, ghost) {
    return e('a', {
      key: a.label,
      href: a.href,
      className: 'sh-btn' + (ghost ? ' sh-btn--ghost' : ''),
      target: a.external ? '_blank' : undefined,
      rel: a.external ? 'noopener noreferrer' : undefined,
      onClick: function () {
        if (a.event) track(a.event, {
          path: 'start-here'
        });
      }
    }, a.label);
  }
  function outcomeScreen() {
    var o = OUTCOMES[st.outcome] || OUTCOMES.orientation;
    var primaryMicro = o.micro; // shown under the primary action (ask outcome)
    return e('div', {
      className: 'sh-stage'
    }, live, e('div', {
      className: 'sh-outcome'
    }, e('div', {
      className: 'sh-outcome__lead'
    }, e('p', {
      className: 'sh-step'
    }, 'YOUR NEXT STEP'), e('h1', {
      className: 'sh-outcome__h',
      tabIndex: -1,
      ref: headingRef
    }, o.heading), e('p', {
      className: 'sh-outcome__body'
    }, o.body)), e('div', {
      className: 'sh-panel'
    }, e('div', {
      className: 'sh-panel__group'
    }, actionLink(o.primary, false), o.details ? e('p', {
      className: 'sh-note'
    }, o.details) : null, primaryMicro ? e('p', {
      className: 'sh-note'
    }, primaryMicro) : null), o.secondary ? e('div', {
      className: 'sh-panel__group'
    }, o.secondary.map(function (s) {
      return actionLink(s, true);
    }), o.secondary.filter(function (s) {
      return s.micro;
    }).map(function (s, i) {
      return e('p', {
        key: 'm' + i,
        className: 'sh-note'
      }, s.micro);
    })) : null)), controls(false));
  }
  var body;
  if (st.screen === 'q1') body = questionScreen(Q1, selectQ1, true); // first screen: no Back / Start over
  else if (st.screen === 'q2') body = questionScreen(Q2, selectQ2, false);else body = outcomeScreen();
  return e(React.Fragment, null, e(StartHereStyles), e(window.ChromeStyles), e('div', {
    className: 'sh-root'
  }, e(window.SiteHeader, {
    page: 'start-here',
    lang: 'en'
  }), e('main', {
    className: 'sh-main'
  }, e('div', {
    className: 'sh-wrap'
  }, body)), e(window.SiteFooterX, {
    lang: 'en'
  })));
}
function renderStartHere() {
  ReactDOM.createRoot(document.getElementById('root')).render(e(StartHerePage, null));
}
Object.assign(window, {
  StartHerePage: StartHerePage,
  renderStartHere: renderStartHere
});
