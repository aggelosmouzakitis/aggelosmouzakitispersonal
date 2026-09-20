// start-here.jsx — "Start Here" routing flow (English).
//
// Step 1 asks what kind of starting point the visitor wants, then routes to one
// of four next-step screens:
//   offers      → the three paid offers (Flow A)
//   orientation → a free 30-minute orientation call (Flow B)
//   clarity     → the five Clarity Tools (Flow C)
//   wtf         → WTF Friday (Flow D)
// Low-pressure private contact (Ask Me Anything) is always one quiet link away.
//
// Editorial card system (numbered cards, arrow affordance, green selected
// state), full browser-history state (Back / Start over), and accessible screen
// changes. All copy, routing and destinations live in the config below so they
// stay easy to edit. Layout is driven by CSS media queries (no width probing).

var e = React.createElement;

// ── Destinations (reuse the site's existing URLs) ────────────────────────────
var ASK = '/ask-me-anything/'; // Ask Me Anything
var ORIENTATION = '/contact?interest=orientation'; // free orientation call → contact
var WTF = '/wtf-friday/'; // WTF Friday office hours

// Three paid offers (Flow A) — names, descriptions and routes match the site.
var OFFERS = [{
  name: 'Psychotherapy / decision coaching',
  desc: 'Think through the decision or pattern that keeps circling.',
  href: '/psychotherapy-decision-coaching/',
  service: 'psychotherapy-decision-coaching'
}, {
  name: 'Career strategy consulting',
  desc: 'Build a paid offer while you keep your job.',
  href: '/career-strategy-consulting/',
  service: 'career-strategy-consulting'
}, {
  name: 'Solo business growth consulting',
  desc: 'Grow the business without grinding yourself down.',
  href: '/solopreneur-growth-consulting/',
  service: 'solopreneur-growth-consulting'
}];

// Five Clarity Tools (Flow C) — canonical questionnaire routes already live.
var TOOLS = [{
  name: "What's limiting your business?",
  href: '/clarity-tools/business-constraint/'
}, {
  name: 'Is it a strategy or execution problem?',
  href: '/clarity-tools/strategy-or-execution/'
}, {
  name: "What's making you want to quit your job?",
  href: '/clarity-tools/quit-your-job/'
}, {
  name: 'Do you want to become a solopreneur?',
  href: '/clarity-tools/become-a-solopreneur/'
}, {
  name: 'Are you burned out?',
  href: '/clarity-tools/burned-out/'
}];

// ── Step 1 ───────────────────────────────────────────────────────────────────
var Q1 = {
  step: 'START HERE · STEP 1',
  heading: 'What kind of starting point do you want?',
  instruction: 'Choose the closest option.',
  cards: [{
    text: 'I know what I want to work on.',
    screen: 'offers'
  }, {
    text: "I have a problem, but I'm not sure what kind of help I need.",
    screen: 'orientation'
  }, {
    text: 'I want to work something out on my own first.',
    screen: 'clarity'
  }, {
    text: 'I want to see how you work before I book anything.',
    screen: 'wtf'
  }],
  ask: 'Prefer to ask something privately? Ask me anything →'
};
var INITIAL = {
  screen: 'q1',
  firstAnswer: null
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
  var css = ['.sh-root{display:flex;flex-direction:column;min-height:100vh;background:#F3F0E8}', '.sh-main{flex:1 0 auto;background:#F3F0E8;color:#3A403A}', '.sh-wrap{width:min(100% - 40px,1000px);margin-inline:auto;padding-block:clamp(40px,6vw,72px) clamp(48px,7vw,88px)}', '.sh-stage{min-height:clamp(440px,56vh,560px)}', '.sh-intro{max-width:820px}', '.sh-step{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#047857;margin:0 0 14px}', '.sh-h1{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,4.4vw,46px);font-weight:800;line-height:1.04;letter-spacing:-.03em;color:#171919;margin:0 0 12px;outline:none}', '.sh-instr{font-size:16px;line-height:1.55;color:#3A403A;margin:0 0 30px;max-width:60ch}',
  // card grid (Step 1)
  '.sh-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}', '.sh-card{position:relative;display:flex;flex-direction:column;min-height:176px;text-align:left;background:#F3F0E8;border:1.5px solid rgba(24,26,28,.16);border-radius:8px;padding:24px 28px 26px;cursor:pointer;font-family:inherit;color:#171919;box-shadow:5px 5px 0 rgba(4,120,87,.18);transition:transform .13s ease,box-shadow .13s ease,border-color .13s ease}', '.sh-card:hover{border-color:rgba(24,26,28,.30);transform:translate(-2px,-2px);box-shadow:7px 7px 0 rgba(4,120,87,.26)}', '.sh-card:focus-visible{outline:2px solid #047857;outline-offset:3px}', '.sh-card.is-sel{border-color:#047857;box-shadow:5px 5px 0 rgba(4,120,87,.34)}', '.sh-card.is-pressing{border-color:#047857;transform:translate(5px,5px);box-shadow:0 0 0 rgba(4,120,87,0)}', '.sh-card__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:clamp(26px,3.2vw,40px)}', '.sh-card__num{font-family:var(--font-heading);font-size:17px;font-weight:800;letter-spacing:.02em;color:#171919;font-variant-numeric:tabular-nums}', '.sh-card.is-sel .sh-card__num,.sh-card.is-pressing .sh-card__num{color:#047857}', '.sh-card__arrow{font-size:20px;line-height:1;color:#171919;transition:transform .15s,color .15s}', '.sh-card:hover .sh-card__arrow{transform:translateX(3px)}', '.sh-card.is-sel .sh-card__arrow,.sh-card.is-pressing .sh-card__arrow{color:#047857}', '.sh-card__copy{font-size:clamp(20px,1.55vw,24px);line-height:1.28;font-weight:500;letter-spacing:-.01em;color:#171919}',
  // list rows (Flow A offers, Flow C tools)
  '.sh-list{display:flex;flex-direction:column;margin-top:4px}', '.sh-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 4px;border-top:1px solid rgba(24,26,28,.16);color:#171919;text-decoration:none;transition:color .15s,border-color .15s,padding-left .15s}', '.sh-row:last-child{border-bottom:1px solid rgba(24,26,28,.16)}', '.sh-row:hover{color:#047857;border-top-color:#047857;padding-left:12px}', '.sh-row:focus-visible{outline:2px solid #047857;outline-offset:3px}', '.sh-row__main{min-width:0;display:flex;flex-direction:column;gap:6px}', '.sh-row__title{font-family:var(--font-heading);font-size:clamp(20px,1.5vw,24px);font-weight:600;line-height:1.22;letter-spacing:-.01em;color:inherit}', '.sh-row__desc{font-size:15px;line-height:1.5;color:#6A6F67}', '.sh-row__go{flex:none;display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#047857;white-space:nowrap}', '.sh-row__arrow{flex:none;font-size:20px;line-height:1;color:#047857}',
  // outcome layout (Flow B orientation, Flow D wtf)
  '.sh-outcome{display:grid;grid-template-columns:7fr 5fr;gap:44px;align-items:start}', '.sh-outcome__lead{min-width:0}', '.sh-outcome__body{font-size:18px;line-height:1.6;color:#3A403A;margin:0;max-width:60ch}', '.sh-panel{background:#F3F0E8;border:1.5px solid rgba(24,26,28,.20);border-radius:8px;padding:26px 24px}', '.sh-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:54px;padding:0 20px;background:#047857;color:#F3F0E8;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase;line-height:1.25;text-align:center;border:1.5px solid #047857;border-radius:0;text-decoration:none;cursor:pointer;transition:filter .16s}', '.sh-btn:hover{background:#03654A}', '.sh-btn:focus-visible{outline:2px solid #047857;outline-offset:3px}', '.sh-btn--ghost{background:transparent;color:#171919;border-color:rgba(24,26,28,.30)}', '.sh-btn--ghost:hover{filter:none;border-color:#171919}', '.sh-btn + .sh-btn{margin-top:12px}', '.sh-note{font-size:13px;line-height:1.5;color:#6A6F67;margin:10px 0 0}', '.sh-panel__group + .sh-panel__group{margin-top:16px;padding-top:16px;border-top:1px solid rgba(24,26,28,.12)}',
  // quiet text links (fallbacks, lower-emphasis options, Step 1 ask route)
  '.sh-fallbacks{margin-top:30px;display:flex;flex-direction:column;gap:14px;align-items:flex-start}', '.sh-textlink{background:none;border:0;padding:2px 0;font-family:inherit;font-size:15px;line-height:1.5;color:#3A403A;cursor:pointer;text-align:left;text-decoration:none;transition:color .15s}', '.sh-textlink:hover{color:#047857}', '.sh-textlink:focus-visible{outline:2px solid #047857;outline-offset:3px}', '.sh-textlink--low{font-size:14px;color:#6A6F67}',
  // quiet controls
  '.sh-controls{display:flex;flex-wrap:wrap;gap:24px;align-items:center;margin-top:40px}', '.sh-quiet{background:none;border:0;padding:6px 0;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6A6F67;cursor:pointer;transition:color .15s}', '.sh-quiet:hover{color:#171919}', '.sh-quiet:focus-visible{outline:2px solid #047857;outline-offset:3px}',
  // responsive
  '@media (max-width:820px){.sh-outcome{grid-template-columns:1fr;gap:28px}}', '@media (max-width:680px){.sh-grid{grid-template-columns:1fr;gap:18px}.sh-card{min-height:0;padding:22px 24px 24px}.sh-card__top{margin-bottom:22px}.sh-stage{min-height:0}.sh-row{padding:20px 2px}}', '@media (prefers-reduced-motion:reduce){.sh-card,.sh-card__arrow,.sh-btn,.sh-quiet,.sh-row{transition:none}.sh-card:hover,.sh-card.is-pressing{transform:none}}'].join('');
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
  var pendingState = R.useState(null); // Step-1 card shown selected during the advance delay
  var pending = pendingState[0],
    setPending = pendingState[1];
  var lockRef = R.useRef(false);
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

  // Record the Step-1 selection onto the current history entry so browser Back
  // restores q1 with the chosen card still highlighted.
  function markFirst(i) {
    var upd = {
      screen: 'q1',
      firstAnswer: i
    };
    try {
      window.history.replaceState(upd, '');
    } catch (err) {}
    stRef.current = upd;
  }
  function selectCard(i) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPending(i);
    markFirst(i);
    var target = Q1.cards[i].screen;
    track('start_here_step1', {
      choice: target
    });
    timerRef.current = setTimeout(function () {
      lockRef.current = false;
      setPending(null);
      commit({
        screen: target,
        firstAnswer: i
      }, true);
    }, SELECT_DELAY);
  }

  // In-flow navigation to another next-step screen (e.g. orientation → clarity).
  function goScreen(name) {
    track('start_here_cross', {
      to: name
    });
    commit({
      screen: name,
      firstAnswer: stRef.current.firstAnswer
    }, true);
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
    commit(INITIAL, false);
  }

  // History init + Back/Forward restoration.
  R.useEffect(function () {
    try {
      window.history.replaceState(INITIAL, '');
    } catch (err) {}
    stRef.current = INITIAL;
    track('start_here_viewed', {});
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
  var screenKey = st.screen;
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
      var label = st.screen === 'q1' ? 'Step 1. ' + Q1.heading : 'Your next step: ' + (headingRef.current ? headingRef.current.textContent : '');
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

  // Quiet fallback link that either leaves the flow (href) or moves to another
  // in-flow screen (screen). `low` renders the lower-emphasis variant.
  function fallback(key, text, opts) {
    opts = opts || {};
    var cls = 'sh-textlink' + (opts.low ? ' sh-textlink--low' : '');
    if (opts.href) {
      return e('a', {
        key: key,
        className: cls,
        href: opts.href,
        onClick: function () {
          track('start_here_exit', {
            to: key
          });
        }
      }, text);
    }
    return e('button', {
      key: key,
      type: 'button',
      className: cls,
      onClick: function () {
        goScreen(opts.screen);
      }
    }, text);
  }

  // ── Step 1 ──
  function q1Screen() {
    return e('div', {
      className: 'sh-stage'
    }, live, e('div', {
      className: 'sh-intro'
    }, e('p', {
      className: 'sh-step'
    }, Q1.step), e('h1', {
      className: 'sh-h1',
      tabIndex: -1,
      ref: headingRef
    }, Q1.heading), e('p', {
      className: 'sh-instr'
    }, Q1.instruction)), e('div', {
      className: 'sh-grid',
      role: 'group',
      'aria-label': Q1.heading
    }, Q1.cards.map(function (o, i) {
      var pressing = pending === i;
      var selected = (pending === null || pending === undefined) && st.firstAnswer === i;
      var num = ('0' + (i + 1)).slice(-2);
      return e('button', {
        key: i,
        type: 'button',
        className: 'sh-card' + (pressing ? ' is-pressing' : selected ? ' is-sel' : ''),
        'aria-pressed': pressing || selected ? 'true' : 'false',
        onClick: function () {
          selectCard(i);
        }
      }, e('div', {
        className: 'sh-card__top'
      }, e('span', {
        className: 'sh-card__num'
      }, num), e('span', {
        className: 'sh-card__arrow',
        'aria-hidden': 'true'
      }, '→')), e('span', {
        className: 'sh-card__copy'
      }, o.text));
    })), e('div', {
      className: 'sh-fallbacks'
    }, fallback('ask', Q1.ask, {
      href: ASK
    })));
  }

  // Shared header for the next-step screens.
  function nextHead(heading, body) {
    return e('div', {
      className: 'sh-intro'
    }, e('p', {
      className: 'sh-step'
    }, 'YOUR NEXT STEP'), e('h1', {
      className: 'sh-h1',
      tabIndex: -1,
      ref: headingRef
    }, heading), body ? e('p', {
      className: 'sh-instr'
    }, body) : null);
  }

  // A row link (offers / tools).
  function row(item, go) {
    return e('a', {
      key: item.href,
      className: 'sh-row',
      href: item.href,
      onClick: function () {
        track('start_here_open', {
          href: item.href
        });
      }
    }, e('span', {
      className: 'sh-row__main'
    }, e('span', {
      className: 'sh-row__title'
    }, item.name), item.desc ? e('span', {
      className: 'sh-row__desc'
    }, item.desc) : null), go ? e('span', {
      className: 'sh-row__go'
    }, 'Explore ', e('span', {
      'aria-hidden': 'true'
    }, '→')) : e('span', {
      className: 'sh-row__arrow',
      'aria-hidden': 'true'
    }, '→'));
  }

  // ── Flow A — paid offers ──
  function offersScreen() {
    return e('div', {
      className: 'sh-stage'
    }, live, nextHead('Choose what you want help with.', null), e('div', {
      className: 'sh-list'
    }, OFFERS.map(function (o) {
      return row(o, true);
    })), e('div', {
      className: 'sh-fallbacks'
    }, fallback('orientation', 'Still not sure which one fits? Request an orientation call →', {
      href: ORIENTATION
    })), controls(false));
  }

  // ── Flow C — clarity tools ──
  function clarityScreen() {
    return e('div', {
      className: 'sh-stage'
    }, live, nextHead('Start with a Clarity Tool.', 'Answer a short set of questions and get an immediate breakdown of what seems to be going on.'), e('div', {
      className: 'sh-list'
    }, TOOLS.map(function (o) {
      return row(o, false);
    })), e('div', {
      className: 'sh-fallbacks'
    }, fallback('orientation', 'Rather talk it through? Request an orientation call →', {
      href: ORIENTATION
    }), fallback('ask', 'Have a question instead? Ask me anything →', {
      href: ASK,
      low: true
    })), controls(false));
  }

  // ── Flow B — orientation call ──
  function orientationScreen() {
    return e('div', {
      className: 'sh-stage'
    }, live, e('div', {
      className: 'sh-outcome'
    }, e('div', {
      className: 'sh-outcome__lead'
    }, e('p', {
      className: 'sh-step'
    }, 'YOUR NEXT STEP'), e('h1', {
      className: 'sh-h1',
      tabIndex: -1,
      ref: headingRef
    }, 'We can find the starting point together.'), e('p', {
      className: 'sh-outcome__body'
    }, 'We can have a 30-minute conversation to understand what is going on and decide which kind of help, if any, makes sense.')), e('div', {
      className: 'sh-panel'
    }, e('div', {
      className: 'sh-panel__group'
    }, e('a', {
      className: 'sh-btn',
      href: ORIENTATION,
      onClick: function () {
        track('start_here_exit', {
          to: 'orientation'
        });
      }
    }, 'REQUEST AN ORIENTATION CALL →'), e('p', {
      className: 'sh-note'
    }, 'Free · 30 minutes · Online')), e('div', {
      className: 'sh-panel__group'
    }, e('button', {
      type: 'button',
      className: 'sh-btn sh-btn--ghost',
      onClick: function () {
        goScreen('clarity');
      }
    }, "I'D RATHER FIGURE IT OUT MYSELF FIRST →"), e('p', {
      className: 'sh-note'
    }, fallback('ask', 'Not ready for a call? Ask me something anonymously →', {
      href: ASK,
      low: true
    }))))), controls(false));
  }

  // ── Flow D — WTF Friday ──
  function wtfScreen() {
    return e('div', {
      className: 'sh-stage'
    }, live, e('div', {
      className: 'sh-outcome'
    }, e('div', {
      className: 'sh-outcome__lead'
    }, e('p', {
      className: 'sh-step'
    }, 'YOUR NEXT STEP'), e('h1', {
      className: 'sh-h1',
      tabIndex: -1,
      ref: headingRef
    }, 'Bring something real.'), e('p', {
      className: 'sh-outcome__body'
    }, "WTF Friday is a free weekly office hour. Bring a business, career or personal problem and we'll work on it live.")), e('div', {
      className: 'sh-panel'
    }, e('div', {
      className: 'sh-panel__group'
    }, e('a', {
      className: 'sh-btn',
      href: WTF,
      onClick: function () {
        track('start_here_exit', {
          to: 'wtf'
        });
      }
    }, 'JOIN WTF FRIDAY →'), e('p', {
      className: 'sh-note'
    }, 'No pitch. No need to prepare a polished question.')), e('div', {
      className: 'sh-panel__group'
    }, e('button', {
      type: 'button',
      className: 'sh-btn sh-btn--ghost',
      onClick: function () {
        goScreen('clarity');
      }
    }, 'PREFER TO START PRIVATELY? EXPLORE THE CLARITY TOOLS →'), e('p', {
      className: 'sh-note'
    }, fallback('ask', 'Prefer not to bring it to a group? Ask me anything →', {
      href: ASK,
      low: true
    }))))), controls(false));
  }
  var body;
  if (st.screen === 'offers') body = offersScreen();else if (st.screen === 'orientation') body = orientationScreen();else if (st.screen === 'clarity') body = clarityScreen();else if (st.screen === 'wtf') body = wtfScreen();else body = q1Screen();
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
