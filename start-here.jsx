// start-here.jsx — "Not sure where to start?" orientation flow (English).
//
// Free Tools now owns self-service discovery, so this page is no longer a
// directory of every way to interact with the site. It answers one question:
// "what are you actually trying to sort out?", asks at most one follow-up, and
// names a single starting direction.
//
// Flow: situation (4 choices) → optional follow-up → one recommended direction
// with SEE HOW THIS WORKS → into the relevant existing service page. Personal
// situations skip the follow-up: the second question would not change anything.
//
// Editorial card system (numbered cards, arrow affordance, green selected
// state), full browser-history state (Back / Start over), and accessible screen
// changes. All copy and routing live in the config below so they stay easy to
// edit. Layout is driven by CSS media queries (no width probing).

var e = React.createElement;

// ── Destinations (reuse the site's existing URLs) ────────────────────────────
var ASK = '/ask-me-anything/';        // Ask Me Anything — the human fallback
var FREE_TOOLS = '/free-tools/';      // the self-service collection

// The three live 1:1 services, keyed by the direction the flow recommends.
// `why` is the one-or-two-sentence explanation shown on the result screen, and
// `tool` is the free tool most likely to be useful on the way there.
var DIRECTIONS = {
  business: {
    name: 'Solo business growth consulting',
    href: '/solopreneur-growth-consulting/',
    note: 'Private 1:1 work on the business',
    tool: { name: "What's limiting your business?", href: '/free-tools/business-constraint/' },
  },
  career: {
    name: 'Career strategy consulting',
    href: '/career-strategy-consulting/',
    note: 'Private 1:1 work on what comes next',
    tool: { name: 'Do you want to become a solopreneur?', href: '/free-tools/become-a-solopreneur/' },
  },
  personal: {
    name: 'Psychotherapy / decision coaching',
    href: '/psychotherapy-decision-coaching/',
    note: 'Private 1:1 work on the decision or the pattern',
    tool: { name: 'Are you burned out?', href: '/free-tools/burned-out/' },
  },
};

// ── Step 1 — the situation ───────────────────────────────────────────────────
// A situation either routes straight to a direction (`direction`) or asks one
// follow-up first (`followUp`), where that question materially changes the answer.
var Q1 = {
  step: 'START HERE',
  heading: 'What are you actually trying to sort out?',
  instruction: "Pick the one that's closest. It doesn't need to fit perfectly.",
  cards: [
    { id: 'business', label: 'My business',
      text: "Something isn't growing, selling or working the way I think it should." },
    { id: 'career', label: 'My career',
      text: "I'm thinking about leaving, changing direction, going independent or figuring out what comes next." },
    { id: 'personal', label: 'Something more personal',
      text: 'I broadly know what I should do, but something keeps getting in the way.',
      direction: 'personal',
      why: "What you described is usually less about not knowing what to do and more about what happens when you try to do it. That's the work here: the decision you keep circling, and the reason you keep circling it." },
    { id: 'tangled', label: "It's all tangled together",
      text: "The business or career problem and the personal problem aren't really separable." },
  ],
  ask: 'Would rather just ask me something? Ask me anything →',
};

// ── Step 2 — one follow-up, only where it changes the routing ────────────────
var FOLLOW_UPS = {
  business: {
    heading: 'Where is the business right now?',
    instruction: 'Still the closest one.',
    options: [
      { text: "It's running, and I want it to grow without grinding myself down.", direction: 'business',
        why: 'The business exists and the ceiling is the thing to work on. We look at the offer, the client mix and the way the business runs, and at whatever in you is holding the shape of it in place.' },
      { text: "I'm building it on the side while I still have a job.", direction: 'career',
        why: "You're building the thing people pay for before you hand in your notice. That's a different problem from growing an existing business, and it's the one this work is built around." },
      { text: 'I keep not doing the things I already know would move it.', direction: 'personal',
        why: "When the plan is clear and it still doesn't happen, more strategy rarely helps. We work on what is actually stopping you, with the business context already understood." },
    ],
  },
  career: {
    heading: 'Which part of it?',
    instruction: 'Still the closest one.',
    options: [
      { text: 'I want to leave employment and build something of my own.', direction: 'career',
        why: 'The useful order is to build a paid offer first and leave second. That is exactly what this work does, while you still have the salary.' },
      { text: "I'm weighing a specific move and keep going back and forth.", direction: 'personal',
        why: "Going back and forth for months usually isn't an information problem. We work through the decision itself, and what keeps pulling it back open." },
      { text: 'I already work for myself and the real problem is the business.', direction: 'business',
        why: 'If the income is already yours to make, the career question is really a business question. We work on what is capping it.' },
    ],
  },
  tangled: {
    heading: 'Which side would you want to start from?',
    instruction: "Wherever you start, we don't split the two apart.",
    options: [
      { text: 'Start from the business.', direction: 'business',
        why: 'We work on the business itself — the offer, the clients, the way it runs — and on whatever in you keeps producing the same result. You do not have to leave the psychological part out.' },
      { text: 'Start from the career decision.', direction: 'career',
        why: 'We work on what you could actually sell and where this goes next, and on the fear or obligation shaping the decision. Both parts stay in the room.' },
      { text: 'Start from me.', direction: 'personal',
        why: 'We work on the pattern first, with the business and career context already understood. You will not spend months explaining how your work actually works.' },
    ],
  },
};

var INITIAL = { screen: 'q1', situation: null, choice: null };
var SELECT_DELAY = 180; // ms of visible selected-state feedback before advancing

// ── Analytics (existing gtag; no-op if absent) ───────────────────────────────
function track(name, params) {
  try { if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (err) { /* noop */ }
}

// ── Scoped styles (baked into #root by the prerenderer) ──────────────────────
function StartHereStyles() {
  var css = [
    '.sh-root{display:flex;flex-direction:column;min-height:100vh;background:#F3F0E8}',
    '.sh-main{flex:1 0 auto;background:#F3F0E8;color:#3A403A}',
    '.sh-wrap{width:min(100% - 40px,1000px);margin-inline:auto;padding-block:clamp(40px,6vw,72px) clamp(48px,7vw,88px)}',
    '.sh-stage{min-height:clamp(440px,56vh,560px)}',
    '.sh-intro{max-width:820px}',
    '.sh-step{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#047857;margin:0 0 14px}',
    '.sh-h1{font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,4.4vw,46px);font-weight:800;line-height:1.04;letter-spacing:-.03em;color:#171919;margin:0 0 12px;outline:none}',
    '.sh-instr{font-size:16px;line-height:1.55;color:#3A403A;margin:0 0 30px;max-width:60ch}',
    // card grid (situation + follow-up)
    '.sh-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}',
    '.sh-card{position:relative;display:flex;flex-direction:column;min-height:176px;text-align:left;background:#F3F0E8;border:1.5px solid rgba(23,25,25,.16);border-radius:8px;padding:24px 28px 26px;cursor:pointer;font-family:inherit;color:#171919;box-shadow:5px 5px 0 rgba(4,120,87,.18);transition:transform .13s ease,box-shadow .13s ease,border-color .13s ease}',
    '.sh-card:hover{border-color:rgba(23,25,25,.30);transform:translate(-2px,-2px);box-shadow:7px 7px 0 rgba(4,120,87,.26)}',
    '.sh-card:focus-visible{outline:2px solid #047857;outline-offset:3px}',
    '.sh-card.is-sel{border-color:#047857;box-shadow:5px 5px 0 rgba(4,120,87,.34)}',
    '.sh-card.is-pressing{border-color:#047857;transform:translate(5px,5px);box-shadow:0 0 0 rgba(4,120,87,0)}',
    '.sh-card__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:clamp(20px,2.6vw,30px)}',
    '.sh-card__num{font-family:var(--font-heading);font-size:17px;font-weight:800;letter-spacing:.02em;color:#171919;font-variant-numeric:tabular-nums}',
    '.sh-card.is-sel .sh-card__num,.sh-card.is-pressing .sh-card__num{color:#047857}',
    '.sh-card__arrow{font-size:20px;line-height:1;color:#171919;transition:transform .15s,color .15s}',
    '.sh-card:hover .sh-card__arrow{transform:translateX(3px)}',
    '.sh-card.is-sel .sh-card__arrow,.sh-card.is-pressing .sh-card__arrow{color:#047857}',
    '.sh-card__label{display:block;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(19px,1.5vw,23px);font-weight:800;line-height:1.08;letter-spacing:.015em;text-transform:uppercase;color:#171919}',
    '.sh-card.is-sel .sh-card__label,.sh-card.is-pressing .sh-card__label{color:#047857}',
    '.sh-card__copy{display:block;margin-top:12px;font-size:16px;line-height:1.5;font-weight:400;letter-spacing:0;color:#3A403A;text-wrap:pretty}',
    '.sh-card--plain .sh-card__copy{margin-top:0;font-size:clamp(19px,1.5vw,23px);line-height:1.3;font-weight:500;letter-spacing:-.01em;color:#171919}',
    // outcome layout (result screen)
    '.sh-outcome{display:grid;grid-template-columns:7fr 5fr;gap:44px;align-items:start}',
    '.sh-outcome__lead{min-width:0}',
    '.sh-outcome__body{font-size:18px;line-height:1.6;color:#3A403A;margin:0;max-width:60ch}',
    '.sh-outcome__kind{font-size:14px;line-height:1.5;color:#6A6F67;margin:0 0 20px}',
    '.sh-panel{background:#F3F0E8;border:1.5px solid rgba(23,25,25,.20);border-radius:8px;padding:26px 24px}',
    '.sh-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:54px;padding:0 20px;background:#047857;color:#F3F0E8;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase;line-height:1.25;text-align:center;border:1.5px solid #047857;border-radius:0;text-decoration:none;cursor:pointer;transition:filter .16s}',
    '.sh-btn:hover{background:#03654A}',
    '.sh-btn:focus-visible{outline:2px solid #047857;outline-offset:3px}',
    '.sh-btn--ghost{background:transparent;color:#171919;border-color:rgba(23,25,25,.30)}',
    '.sh-btn--ghost:hover{filter:none;background:transparent;color:#171919;border-color:#171919}',
    '.sh-btn + .sh-btn{margin-top:12px}',
    '.sh-note{font-size:13px;line-height:1.5;color:#6A6F67;margin:10px 0 0}',
    '.sh-panel__group + .sh-panel__group{margin-top:16px;padding-top:16px;border-top:1px solid rgba(23,25,25,.12)}',
    // quiet text links (fallbacks, lower-emphasis options)
    '.sh-fallbacks{margin-top:30px;display:flex;flex-direction:column;gap:14px;align-items:flex-start}',
    '.sh-textlink{background:none;border:0;padding:2px 0;font-family:inherit;font-size:15px;line-height:1.5;color:#3A403A;cursor:pointer;text-align:left;text-decoration:none;transition:color .15s}',
    '.sh-textlink:hover{color:#047857}',
    '.sh-textlink:focus-visible{outline:2px solid #047857;outline-offset:3px}',
    '.sh-textlink--low{font-size:14px;color:#6A6F67}',
    // quiet controls
    '.sh-controls{display:flex;flex-wrap:wrap;gap:24px;align-items:center;margin-top:40px}',
    '.sh-quiet{background:none;border:0;padding:6px 0;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6A6F67;cursor:pointer;transition:color .15s}',
    '.sh-quiet:hover{color:#171919}',
    '.sh-quiet:focus-visible{outline:2px solid #047857;outline-offset:3px}',
    // responsive
    '@media (max-width:820px){.sh-outcome{grid-template-columns:1fr;gap:28px}}',
    '@media (max-width:680px){.sh-grid{grid-template-columns:1fr;gap:18px}.sh-card{min-height:0;padding:22px 24px 24px}.sh-card__top{margin-bottom:18px}.sh-stage{min-height:0}}',
    '@media (prefers-reduced-motion:reduce){.sh-card,.sh-card__arrow,.sh-btn,.sh-quiet{transition:none}.sh-card:hover,.sh-card.is-pressing{transform:none}}',
  ].join('');
  return e('style', { dangerouslySetInnerHTML: { __html: css } });
}

// ── Flow component ───────────────────────────────────────────────────────────
function StartHerePage() {
  var R = React;
  var stState = R.useState(INITIAL);
  var st = stState[0], setSt = stState[1];
  var stRef = R.useRef(INITIAL);
  var pendingState = R.useState(null); // card shown selected during the advance delay
  var pending = pendingState[0], setPending = pendingState[1];
  var lockRef = R.useRef(false);
  var timerRef = R.useRef(null);
  var headingRef = R.useRef(null);
  var liveRef = R.useRef(null);

  function commit(next, push) {
    try { window.history[push ? 'pushState' : 'replaceState'](next, ''); } catch (err) {}
    stRef.current = next;
    setSt(next);
  }

  // Record the selection onto the current history entry so browser Back
  // restores the screen with the chosen card still highlighted.
  function markChoice(i) {
    var upd = { screen: stRef.current.screen, situation: stRef.current.situation, choice: i };
    try { window.history.replaceState(upd, ''); } catch (err) {}
    stRef.current = upd;
  }

  // One shared select handler: shows the pressed state, then advances.
  function selectCard(i, next) {
    if (lockRef.current) return;
    lockRef.current = true;
    setPending(i);
    markChoice(i);
    timerRef.current = setTimeout(function () {
      lockRef.current = false;
      setPending(null);
      commit(next, true);
    }, SELECT_DELAY);
  }

  function chooseSituation(i) {
    var card = Q1.cards[i];
    track('start_here_situation', { situation: card.id });
    // Straight to the answer when a follow-up would not change it.
    var next = card.direction
      ? { screen: 'result', situation: card.id, choice: i, direction: card.direction, why: card.why }
      : { screen: 'q2', situation: card.id, choice: null };
    selectCard(i, next);
  }

  function chooseFollowUp(i) {
    var q = FOLLOW_UPS[stRef.current.situation];
    var opt = q.options[i];
    track('start_here_followup', { situation: stRef.current.situation, direction: opt.direction });
    selectCard(i, { screen: 'result', situation: stRef.current.situation, choice: i, direction: opt.direction, why: opt.why });
  }

  function goBack() { try { window.history.back(); } catch (err) {} }

  function startOver() {
    if (timerRef.current) clearTimeout(timerRef.current);
    lockRef.current = false;
    setPending(null);
    commit(INITIAL, false);
  }

  // History init + Back/Forward restoration.
  R.useEffect(function () {
    try { window.history.replaceState(INITIAL, ''); } catch (err) {}
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
  var screenKey = st.screen + ':' + (st.situation || '') + ':' + (st.direction || '');
  R.useEffect(function () {
    if (typeof window !== 'undefined' && window.scrollTo) { try { window.scrollTo(0, 0); } catch (err) {} }
    if (headingRef.current) { try { headingRef.current.focus(); } catch (err) {} }
    if (liveRef.current) {
      var text = headingRef.current ? headingRef.current.textContent : '';
      liveRef.current.textContent = st.screen === 'result' ? ("I'd start here: " + text) : text;
    }
  }, [screenKey]);

  var live = e('div', { ref: liveRef, 'aria-live': 'polite', role: 'status', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } });

  function controls(isFirst) {
    if (isFirst) return null;
    return e('div', { className: 'sh-controls' },
      e('button', { type: 'button', className: 'sh-quiet', onClick: goBack }, '← Back'),
      e('button', { type: 'button', className: 'sh-quiet', onClick: startOver }, 'Start over')
    );
  }

  // A quiet link out of the flow.
  function fallback(key, text, href, low) {
    return e('a', { key: key, className: 'sh-textlink' + (low ? ' sh-textlink--low' : ''), href: href,
      onClick: function () { track('start_here_exit', { to: key }); } }, text);
  }

  // A choice card. `label` is optional — the follow-up screens have none.
  function card(i, opts) {
    var pressing = pending === i;
    var selected = (pending === null || pending === undefined) && st.choice === i;
    var num = ('0' + (i + 1)).slice(-2);
    return e('button', {
      key: i, type: 'button',
      className: 'sh-card' + (opts.label ? '' : ' sh-card--plain') + (pressing ? ' is-pressing' : (selected ? ' is-sel' : '')),
      'aria-pressed': (pressing || selected) ? 'true' : 'false',
      onClick: opts.onClick,
    },
      e('div', { className: 'sh-card__top' },
        e('span', { className: 'sh-card__num' }, num),
        e('span', { className: 'sh-card__arrow', 'aria-hidden': 'true' }, '→')
      ),
      opts.label ? e('span', { className: 'sh-card__label' }, opts.label) : null,
      e('span', { className: 'sh-card__copy' }, opts.text)
    );
  }

  // ── Step 1 — the situation ──
  function situationScreen() {
    return e('div', { className: 'sh-stage' },
      live,
      e('div', { className: 'sh-intro' },
        e('p', { className: 'sh-step' }, Q1.step),
        e('h1', { className: 'sh-h1', tabIndex: -1, ref: headingRef }, Q1.heading),
        e('p', { className: 'sh-instr' }, Q1.instruction)
      ),
      e('div', { className: 'sh-grid', role: 'group', 'aria-label': Q1.heading },
        Q1.cards.map(function (o, i) {
          return card(i, { label: o.label, text: o.text, onClick: function () { chooseSituation(i); } });
        })
      ),
      e('div', { className: 'sh-fallbacks' }, fallback('ask', Q1.ask, ASK))
    );
  }

  // ── Step 2 — the one follow-up ──
  function followUpScreen() {
    var q = FOLLOW_UPS[st.situation];
    if (!q) return situationScreen();
    return e('div', { className: 'sh-stage' },
      live,
      e('div', { className: 'sh-intro' },
        e('p', { className: 'sh-step' }, 'START HERE · ONE MORE'),
        e('h1', { className: 'sh-h1', tabIndex: -1, ref: headingRef }, q.heading),
        e('p', { className: 'sh-instr' }, q.instruction)
      ),
      e('div', { className: 'sh-grid', role: 'group', 'aria-label': q.heading },
        q.options.map(function (o, i) {
          return card(i, { text: o.text, onClick: function () { chooseFollowUp(i); } });
        })
      ),
      e('div', { className: 'sh-fallbacks' },
        fallback('free-tools', 'Would rather work it out on your own first? Explore the free tools →', FREE_TOOLS)
      ),
      controls(false)
    );
  }

  // ── Result — one recommended direction ──
  function resultScreen() {
    var d = DIRECTIONS[st.direction];
    if (!d) return situationScreen();
    return e('div', { className: 'sh-stage' },
      live,
      e('div', { className: 'sh-outcome' },
        e('div', { className: 'sh-outcome__lead' },
          e('p', { className: 'sh-step' }, "I'D START HERE"),
          e('h1', { className: 'sh-h1', tabIndex: -1, ref: headingRef }, d.name),
          e('p', { className: 'sh-outcome__kind' }, d.note),
          e('p', { className: 'sh-outcome__body' }, st.why)
        ),
        e('div', { className: 'sh-panel' },
          e('div', { className: 'sh-panel__group' },
            e('a', { className: 'sh-btn', href: d.href,
              onClick: function () { track('start_here_direction', { direction: st.direction }); } }, 'SEE HOW THIS WORKS →'),
            e('p', { className: 'sh-note' }, 'What it is, how it runs and what it costs — before you decide anything.')
          ),
          e('div', { className: 'sh-panel__group' },
            e('a', { className: 'sh-btn sh-btn--ghost', href: d.tool.href,
              onClick: function () { track('start_here_tool', { tool: d.tool.href }); } }, 'TRY A FREE TOOL FIRST →'),
            e('p', { className: 'sh-note' }, d.tool.name),
            e('p', { className: 'sh-note' },
              fallback('ask', 'Rather just ask me something? Ask me anything →', ASK, true))
          )
        )
      ),
      controls(false)
    );
  }

  var body;
  if (st.screen === 'q2') body = followUpScreen();
  else if (st.screen === 'result') body = resultScreen();
  else body = situationScreen();

  return e(React.Fragment, null,
    e(StartHereStyles),
    e(window.ChromeStyles),
    e('div', { className: 'sh-root' },
      e(window.SiteHeader, { page: 'start-here', lang: 'en' }),
      e('main', { className: 'sh-main' },
        e('div', { className: 'sh-wrap' }, body)
      ),
      e(window.SiteFooterX, { lang: 'en' })
    )
  );
}

function renderStartHere() {
  ReactDOM.createRoot(document.getElementById('root')).render(e(StartHerePage, null));
}

Object.assign(window, { StartHerePage: StartHerePage, renderStartHere: renderStartHere });
