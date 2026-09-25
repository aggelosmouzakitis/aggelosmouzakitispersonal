// focus-area-data.jsx — the content of "Find Your Focus Area".
//
// Everything a visitor reads in the assessment lives here, as data: the seven
// Focus Areas, the three personas, the problems each persona can pick, the
// four contextual questions for every persona + problem, and the fourteen
// universal statements. No component reads display text as an identifier;
// every persona, problem, question, option and Focus Area has a stable id.
//
// How the pieces fit
//   Stage A  persona → problems (up to 3) → primaryProblem
//   Stage B  FA_CONTEXTUAL[persona][primaryProblem]: four questions
//   Stage C  FA_UNIVERSAL: the same fourteen statements for everyone
//
// Contextual scoring metadata
//   Every contextual option carries `points`: { focusAreaId: 1 | 2 | 3 }.
//     3 = strong sign this area deserves attention
//     2 = moderate sign
//     1 = weak sign
//   An option with {} points is evidence that the question's explanation does
//   not apply. What the points turn into is decided in focus-area-scoring.jsx,
//   which also holds every universal-statement mapping, the layer weights and
//   the normalisation rules. Tune the numbers there and here; no component
//   needs to change.
//
// Question formats
//   type: 'scale'  — a spectrum, options run from "not a problem" to "a problem"
//   type: 'choice' — forced choice between different explanations

window.FOCUS_AREA_DATA = function () {
  // ── Focus Areas (canonical order) ──────────────────────────────────────────
  // These describe where attention may be most useful right now. They are not
  // personality types, and nothing in the assessment presents them as such.
  var FOCUS_AREAS = [{
    id: 'direction',
    label: 'Direction'
  }, {
    id: 'strategy',
    label: 'Strategy'
  }, {
    id: 'action',
    label: 'Action'
  }, {
    id: 'self_trust',
    label: 'Self-trust'
  }, {
    id: 'capacity',
    label: 'Capacity'
  }, {
    id: 'relationships_boundaries',
    label: 'Relationships & Boundaries'
  }, {
    id: 'environment',
    label: 'Environment'
  }];

  // ── Stage A · Question 1 ───────────────────────────────────────────────────
  var PERSONA_QUESTION = {
    id: 'persona',
    text: 'Which best describes you right now?',
    helper: 'If more than one applies, choose the one that best describes your current situation.'
  };
  var PERSONAS = [{
    id: 'founder',
    label: 'Founder / business owner'
  }, {
    id: 'freelancer',
    label: 'Freelancer / consultant'
  }, {
    id: 'professional',
    label: 'Employed professional'
  }];

  // ── Stage A · Question 2 ───────────────────────────────────────────────────
  var PROBLEMS_QUESTION = {
    id: 'selected_problems',
    text: 'What are you dealing with right now?',
    helper: 'Choose up to 3',
    max: 3
  };
  var PROBLEMS = {
    founder: [{
      id: 'founder_more_customers',
      label: 'I need more customers or revenue'
    }, {
      id: 'founder_offer_positioning',
      label: "My offer or positioning isn't working"
    }, {
      id: 'founder_avoiding_sales',
      label: 'I keep avoiding sales or visibility'
    }, {
      id: 'founder_unsure_focus',
      label: "I'm unsure what to focus on next"
    }, {
      id: 'founder_depends_on_me',
      label: 'The business depends too much on me'
    }, {
      id: 'founder_difficult_decision',
      label: 'I have a difficult decision to make'
    }, {
      id: 'founder_exhausted',
      label: "I'm exhausted or losing motivation"
    }, {
      id: 'founder_people_struggle',
      label: "I'm struggling with someone I work with"
    }, {
      id: 'founder_still_want',
      label: "I'm not sure I still want what I'm building"
    }],
    freelancer: [{
      id: 'freelancer_more_clients',
      label: 'I need more clients'
    }, {
      id: 'freelancer_offer_positioning',
      label: "My offer or positioning isn't clear"
    }, {
      id: 'freelancer_charge_more',
      label: 'I need to charge more'
    }, {
      id: 'freelancer_avoiding_sales',
      label: 'I keep avoiding sales or visibility'
    }, {
      id: 'freelancer_unsure_focus',
      label: "I don't know what to focus on next"
    }, {
      id: 'freelancer_clients_take_too_much',
      label: 'My clients take too much from me'
    }, {
      id: 'freelancer_grow_or_stay_small',
      label: "I'm unsure whether to grow or stay small"
    }, {
      id: 'freelancer_exhausted',
      label: "I'm exhausted or losing motivation"
    }, {
      id: 'freelancer_still_want',
      label: "I'm questioning whether I still want this"
    }],
    professional: [{
      id: 'professional_leave_job',
      label: 'I want to leave my job'
    }, {
      id: 'professional_different_career',
      label: 'I think I want a different career'
    }, {
      id: 'professional_dont_know_next',
      label: "I don't know what I want next"
    }, {
      id: 'professional_not_progressing',
      label: "I'm not progressing"
    }, {
      id: 'professional_difficult_decision',
      label: 'I have a difficult decision to make'
    }, {
      id: 'professional_manager_colleagues',
      label: "I'm struggling with my manager or colleagues"
    }, {
      id: 'professional_boundaries',
      label: 'I find it difficult to set boundaries'
    }, {
      id: 'professional_exhausted',
      label: "I'm exhausted or losing motivation"
    }, {
      id: 'professional_not_meaningful',
      label: "My work doesn't feel meaningful anymore"
    }]
  };

  // ── Stage A · Question 3 (only when more than one problem is selected) ─────
  var PRIMARY_QUESTION = {
    id: 'primary_problem',
    text: 'Which one would make the biggest difference if it improved?'
  };

  // ── Stage B · Contextual questions ─────────────────────────────────────────
  // Short builders keep the bank readable. Question ids are the problem id plus
  // q1–q4; option ids are unique within their question.
  function o(id, label, points) {
    return {
      id: id,
      label: label,
      points: points || {}
    };
  }
  function q(problemId, n, type, text, options) {
    return {
      id: problemId + '_q' + n,
      type: type,
      text: text,
      options: options
    };
  }

  // Sets that repeat across personas are built once and given each persona's
  // own problem id, so every question id stays unique and stable.
  function reachSet(pid, who) {
    // "I need more customers / clients". Separates visibility, message and
    // conversion (strategy) from inconsistent effort (action), no room to do it
    // (capacity) and a market that is pulling back (environment).
    var buyer = who === 'clients' ? 'clients' : 'customers';
    return [q(pid, 1, 'scale', 'Are enough of the right people seeing what you offer?', [o('plenty', 'Yes, plenty of them'), o('some', 'Some, but not enough', {
      strategy: 1
    }), o('few', 'Very few', {
      strategy: 2
    }), o('unsure_who', "I'm not sure who the right people are", {
      strategy: 2,
      direction: 1
    })]), q(pid, 2, 'scale', "When people see your offer, do they quickly understand why it's useful to them?", [o('clicks', 'Yes, it clicks quickly'), o('after_explaining', 'Usually, once I explain it', {
      strategy: 1
    }), o('often_not', 'Often not', {
      strategy: 3
    }), o('dont_know', "I don't really know how they react", {
      strategy: 2
    })]), q(pid, 3, 'choice', 'Are you consistently doing the things that should bring ' + buyer + ' in?', [o('consistent', 'Yes, every week'), o('bursts', 'In bursts, then it stops', {
      action: 2
    }), o('putting_off', 'Not really. I keep putting it off.', {
      action: 3
    }), o('no_time', who === 'clients' ? 'Not really. Client work takes all my time.' : 'Not really. The day-to-day work takes all my time.', {
      capacity: 3
    })]), q(pid, 4, 'choice', who === 'clients' ? 'When qualified people talk to you, do enough of them buy?' : 'When interested people talk to you, do enough of them buy?', [o('most_buy', 'Yes, most of them buy'), o('hesitate', 'Not enough. Many hesitate or go quiet.', {
      strategy: 2
    }), o('hard_to_ask', who === 'clients' ? 'Not enough. I find it hard to ask for the work.' : 'Not enough. I find it hard to ask for the sale.', {
      action: 2,
      self_trust: 1
    }), o('market', who === 'clients' ? 'Not enough. Budgets in my market are tight right now.' : 'Not enough. Buyers in my market are holding back right now.', {
      environment: 3
    })])];
  }
  function avoidingSalesSet(pid, freelancer) {
    // Knowing what to do but not doing it (action) against not knowing what
    // would work (strategy), and what makes showing up costly.
    return [q(pid, 1, 'scale', 'Do you know what you should be doing for sales or visibility each week?', [o('exactly', 'Yes, exactly', {
      action: 2
    }), o('roughly', 'Roughly', {
      action: 1,
      strategy: 1
    }), o('vaguely', 'Only vaguely', {
      strategy: 2
    }), o('no_idea', "No. I don't know what would work.", {
      strategy: 3
    })]), q(pid, 2, 'choice', 'When you think about reaching out or posting, what feels hardest?', [o('rejection', 'Being ignored or turned down', {
      action: 2,
      self_trust: 1
    }), o('pushy', 'Seeming pushy or bothering people', {
      relationships_boundaries: 3
    }), o('good_enough', 'Not being sure my work is good enough', {
      self_trust: 3
    }), o('time_energy', freelancer ? 'Finding the time and energy after client work' : 'Finding the time and energy', {
      capacity: 3
    })]), freelancer ? q(pid, 3, 'scale', 'How much of your work comes from referrals?', [o('little', 'Not much. I have other ways to find work.'), o('some', 'Some of it', {
      strategy: 1
    }), o('almost_all', 'Almost all of it', {
      strategy: 2,
      environment: 1
    }), o('slowed', 'Almost all of it, and referrals have slowed down', {
      strategy: 2,
      environment: 2
    })]) : q(pid, 3, 'scale', "How much do you believe in what you're selling?", [o('completely', 'Completely'), o('mostly', 'Mostly', {
      direction: 1
    }), o('doubts', 'I have some doubts about it', {
      direction: 1,
      strategy: 1
    }), o('not_sure', "I'm not sure it's what I want to sell", {
      direction: 3
    })]), q(pid, 4, 'choice', 'When you have reached out or posted before, what happened?', [o('worked', 'It usually worked reasonably well', {
      action: 2
    }), o('mixed', 'Results were mixed, so it was hard to keep going', {
      strategy: 2
    }), o('not_enough', "I haven't done it enough to know", {
      action: 3
    }), o('knocked', 'Nothing happened, and it knocked my confidence', {
      self_trust: 2,
      strategy: 1
    })])];
  }
  function focusNextSet(pid, freelancer) {
    // An unclear destination (direction) against missing evidence (strategy),
    // a choice already made but not trusted (self-trust), no room to think
    // (capacity) and a market that is moving (environment).
    return [q(pid, 1, 'scale', freelancer ? 'Do you know what you want your working life to look like in two years?' : 'Do you know what you want the business to look like in two years?', [o('clearly', 'Yes, clearly'), o('roughly', 'Roughly', {
      direction: 1
    }), o('several', 'I have a few different pictures', {
      direction: 2
    }), o('not_really', 'Not really', {
      direction: 3
    })]), q(pid, 2, 'scale', 'Do you have real evidence about which option would make the biggest difference?', [o('clear', 'Yes, the evidence points one way', {
      self_trust: 1,
      action: 1
    }), o('mixed', "Some, but it's mixed", {
      strategy: 1
    }), o('gut', 'Mostly gut feel', {
      strategy: 2
    }), o('guessing', "No, I'm guessing", {
      strategy: 3
    })]), q(pid, 3, 'choice', 'If you had to choose today, would you know what to pick?', [o('not_committed', "Yes. I just haven't committed to it.", {
      self_trust: 2,
      action: 1
    }), o('second_guess', 'Probably, but I keep second-guessing it', {
      self_trust: 3
    }), o('equal', 'No. The options all look equally good.', {
      strategy: 1,
      direction: 1
    }), o('stretched', freelancer ? 'No. Client work leaves no room to think it through.' : "No. I'm too stretched to think it through.", {
      capacity: 3
    })]), q(pid, 4, 'scale', freelancer ? 'How much is your market changing right now?' : 'How much is changing around your business right now?', [o('stable', 'Very little. Things are fairly stable.'), o('some', 'Some things are shifting', {
      environment: 1
    }), o('a_lot', freelancer ? 'A lot. Clients want different things now.' : 'A lot. My market or customers are changing.', {
      environment: 2
    }), o('hard_to_plan', "So much that it's hard to plan at all", {
      environment: 3
    })])];
  }
  function decisionSet(pid) {
    return [q(pid, 1, 'scale', "If nobody else's opinion mattered, would you know what to choose?", [o('straight_away', 'Yes, straight away', {
      relationships_boundaries: 2,
      self_trust: 1
    }), o('probably', 'Probably', {
      relationships_boundaries: 1,
      self_trust: 1
    }), o('still_unsure', "No, I'd still be unsure", {
      strategy: 1,
      direction: 1
    }), o('dont_know_want', "No. I'm not sure what I want.", {
      direction: 3
    })]), q(pid, 2, 'choice', 'Do you have the information you need to decide?', [o('enough', 'Yes, I have enough', {
      self_trust: 2
    }), o('mostly', 'Mostly', {
      self_trust: 1
    }), o('missing', 'Some important facts are missing', {
      strategy: 2
    }), o('unknowable', 'It depends on things nobody can know yet', {
      environment: 2
    })]), q(pid, 3, 'scale', 'How long has this decision been open?', [o('days', 'A few days'), o('weeks', 'A few weeks', {
      action: 1
    }), o('months', 'A few months', {
      action: 2,
      self_trust: 1
    }), o('too_long', 'Much longer than it should have been', {
      action: 3,
      self_trust: 1
    })]), q(pid, 4, 'choice', 'What makes the decision hardest?', [o('what_i_want', 'Not knowing what I actually want', {
      direction: 3
    }), o('choosing_wrong', 'Being afraid of choosing wrong', {
      self_trust: 3
    }), o('other_people', 'How it will affect other people', {
      relationships_boundaries: 3
    }), o('facts', 'Not having the facts to judge it', {
      strategy: 3
    }), o('too_much', 'Having too much else going on', {
      capacity: 3
    })])];
  }
  function restQuestion(pid, n, professional) {
    // Whether rest restores, fades or does nothing separates a load problem
    // (capacity, environment) from deeper depletion.
    return q(pid, n, 'choice', 'When you take real time off, how do you feel when you come back?', [o('restored', 'Restored for a good while', {
      environment: 1
    }), o('fades', 'Better, but it fades within days', professional ? {
      environment: 2,
      capacity: 1
    } : {
      capacity: 1,
      environment: 1
    }), o('same', 'About the same', {
      capacity: 2
    }), o('cant', "I can't really take time off", {
      environment: 2,
      capacity: 1
    })]);
  }
  function restedDoubtQuestion(pid, n) {
    return q(pid, n, 'scale', 'If you felt fully rested, would the doubt still be there?', [o('mostly_go', 'No, it would mostly go', {
      capacity: 3
    }), o('some_go', 'Some of it would go', {
      capacity: 1,
      direction: 1
    }), o('stay', 'Yes, most of it would stay', {
      direction: 2
    }), o('dont_know', "I don't know", {
      direction: 1,
      capacity: 1
    })]);
  }
  function insteadQuestion(pid, n) {
    return q(pid, n, 'scale', 'Do you know what you would want instead?', [o('clearly', 'Yes, fairly clearly', {
      self_trust: 2,
      action: 1
    }), o('ideas', 'I have some ideas', {
      direction: 1
    }), o('different', 'Only that I want something different', {
      direction: 2
    }), o('no_idea', 'No idea at all', {
      direction: 3
    })]);
  }
  var CONTEXTUAL = {
    // ════════════════════════════════════════════════════════════════════════
    // FOUNDER / BUSINESS OWNER
    // ════════════════════════════════════════════════════════════════════════
    founder: {
      founder_more_customers: reachSet('founder_more_customers', 'customers'),
      founder_offer_positioning: [q('founder_offer_positioning', 1, 'choice', 'Can you say who your offer is for in one sentence?', [o('easily', 'Yes, easily'), o('keeps_changing', 'Yes, but the answer keeps changing', {
        direction: 1,
        self_trust: 1
      }), o('broad', 'Only in broad terms', {
        strategy: 2
      }), o('anyone', 'Not really. It could be for almost anyone.', {
        strategy: 2,
        direction: 1
      })]), q('founder_offer_positioning', 2, 'choice', 'When people compare you with other options, what usually happens?', [o('see_difference', "They can see why I'm different"), o('struggle', 'They struggle to see the difference', {
        strategy: 3
      }), o('crowded', 'The market is crowded, so everyone looks similar', {
        environment: 2,
        strategy: 1
      }), o('dont_know', "I don't know what they compare me with", {
        strategy: 2
      })]), q('founder_offer_positioning', 3, 'choice', 'Have you tested your positioning with real buyers?', [o('tested', 'Yes, in real sales conversations'), o('friends_only', 'Only with friends, peers or colleagues', {
        strategy: 2
      }), o('refining', 'Not yet. I keep refining it first.', {
        action: 3
      }), o('conflicting', 'Yes, but the feedback pulls me in different directions', {
        self_trust: 3
      })]), q('founder_offer_positioning', 4, 'scale', 'How clear are you on what you want the business to be known for?', [o('very', 'Very clear'), o('fairly', 'Fairly clear', {
        direction: 1
      }), o('competing', 'I have a few competing ideas', {
        direction: 2
      }), o('not_clear', 'Not clear at all', {
        direction: 3
      })])],
      founder_avoiding_sales: avoidingSalesSet('founder_avoiding_sales', false),
      founder_unsure_focus: focusNextSet('founder_unsure_focus', false),
      founder_depends_on_me: [q('founder_depends_on_me', 1, 'choice', 'Could someone else do most of your weekly tasks with good instructions?', [o('most', 'Yes, most of them', {
        action: 2
      }), o('some', 'Some of them', {
        action: 1,
        strategy: 1
      }), o('few', 'Very few', {
        strategy: 2
      }), o('expertise', 'No. Clients are paying for my personal expertise.', {
        environment: 2,
        strategy: 1
      })]), q('founder_depends_on_me', 2, 'choice', 'What usually stops you from handing work over?', [o('quality', 'Nobody else would do it well enough', {
        action: 2,
        strategy: 1
      }), o('nobody', "There's nobody to hand it to, or no budget", {
        strategy: 2,
        environment: 1
      }), o('clients_expect', 'Clients expect to deal with me', {
        relationships_boundaries: 2,
        environment: 1
      }), o('no_time', "I don't have time to train anyone", {
        capacity: 3
      })]), q('founder_depends_on_me', 3, 'scale', 'Do you know what role you want to have in the business?', [o('clearly', 'Yes, clearly'), o('roughly', 'Roughly', {
        direction: 1
      }), o('not_really', 'Not really', {
        direction: 2
      }), o('stay_at_all', "I'm not sure I want to stay in it at all", {
        direction: 3
      })]), q('founder_depends_on_me', 4, 'scale', 'Does your pricing leave room to pay for help?', [o('comfortably', 'Yes, comfortably', {
        action: 1
      }), o('just', 'Just about', {
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('only_me', 'No. The numbers only work if I do it myself.', {
        strategy: 3
      })])],
      founder_difficult_decision: decisionSet('founder_difficult_decision'),
      founder_exhausted: [q('founder_exhausted', 1, 'choice', 'What is draining you most?', [o('amount', "The amount of work. There's simply too much.", {
        capacity: 2,
        environment: 1
      }), o('work_itself', "The work itself. It doesn't interest me like it used to.", {
        direction: 3
      }), o('people', 'The people I deal with', {
        relationships_boundaries: 3
      }), o('no_results', 'Putting in effort without seeing results', {
        strategy: 3
      })]), restQuestion('founder_exhausted', 2, false), q('founder_exhausted', 3, 'scale', 'If the business ran on half the effort, would you still want to run it?', [o('definitely', 'Yes, definitely', {
        capacity: 1
      }), o('probably', 'Probably', {
        direction: 1
      }), o('not_sure', "I'm not sure", {
        direction: 2
      }), o('lost_interest', "No. I think I've lost interest in it.", {
        direction: 3
      })]), q('founder_exhausted', 4, 'scale', 'How many hours do you work in a typical week?', [o('under_40', 'Under 40'), o('h40_50', '40 to 50', {
        capacity: 1
      }), o('h50_60', '50 to 60', {
        capacity: 2,
        environment: 1
      }), o('over_60', 'More than 60', {
        capacity: 3,
        environment: 1
      })])],
      founder_people_struggle: [q('founder_people_struggle', 1, 'choice', 'Have you told them clearly what the problem is?', [o('directly', 'Yes, directly', {
        environment: 1
      }), o('hinted', "I've hinted at it", {
        relationships_boundaries: 2
      }), o('putting_off', 'Not yet. I keep putting it off.', {
        relationships_boundaries: 2,
        action: 1
      }), o('how', "I'm not sure how to raise it well", {
        strategy: 2,
        self_trust: 1
      })]), q('founder_people_struggle', 2, 'scale', 'Are your roles and responsibilities clearly agreed?', [o('clearly', 'Yes, clearly'), o('mostly', 'Mostly', {
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2,
        environment: 1
      }), o('friction', 'No, and that causes a lot of the friction', {
        strategy: 2,
        environment: 2
      })]), q('founder_people_struggle', 3, 'choice', 'Do you and this person want the same things for the business?', [o('aligned', "Yes, we're aligned"), o('mostly', 'Mostly', {
        environment: 1
      }), o('different', 'No. We want quite different things.', {
        environment: 2,
        relationships_boundaries: 1
      }), o('unsure_me', "I'm not sure what I want anymore either", {
        direction: 3
      })]), q('founder_people_struggle', 4, 'choice', 'When you picture raising the issue, what worries you most?', [o('reaction', 'Their reaction', {
        relationships_boundaries: 3
      }), o('being_wrong', 'Being wrong about it', {
        self_trust: 3
      }), o('damage', 'The damage it could do to the business', {
        environment: 2,
        relationships_boundaries: 1
      }), o('nothing_changed', "I've raised it already and nothing changed", {
        environment: 3
      })])],
      founder_still_want: [q('founder_still_want', 1, 'choice', 'When did the doubt start?', [o('overwork', 'After a long stretch of overwork', {
        capacity: 3
      }), o('business_changed', 'When the business changed into something different', {
        environment: 2,
        direction: 1
      }), o('slowly', 'It has grown slowly over a long time', {
        direction: 3
      }), o('results_stopped', 'When results stopped coming', {
        strategy: 2
      })]), restedDoubtQuestion('founder_still_want', 2), q('founder_still_want', 3, 'choice', 'What keeps you going with it right now?', [o('believe', 'I still believe in it'), o('counting_on_me', 'Other people are counting on me', {
        relationships_boundaries: 3
      }), o('money_fear', 'Money, or fear of what would come next', {
        self_trust: 2,
        direction: 1
      }), o('invested', "I've invested too much to stop", {
        self_trust: 1,
        direction: 1
      })]), insteadQuestion('founder_still_want', 4)]
    },
    // ════════════════════════════════════════════════════════════════════════
    // FREELANCER / CONSULTANT
    // ════════════════════════════════════════════════════════════════════════
    freelancer: {
      freelancer_more_clients: reachSet('freelancer_more_clients', 'clients'),
      freelancer_offer_positioning: [q('freelancer_offer_positioning', 1, 'choice', 'Can you say who you help and what changes for them, in one sentence?', [o('easily', 'Yes, easily'), o('keeps_changing', 'Yes, but the answer keeps changing', {
        direction: 1,
        self_trust: 1
      }), o('general', 'Only in general terms', {
        strategy: 2
      }), o('anything', 'Not really. I help lots of people with lots of things.', {
        strategy: 2,
        direction: 1
      })]), q('freelancer_offer_positioning', 2, 'choice', 'When people compare you with other freelancers, what usually happens?', [o('see_difference', "They can see why I'm different"), o('struggle', 'They struggle to see the difference', {
        strategy: 3
      }), o('crowded', 'The market is crowded, so everyone looks similar', {
        environment: 2,
        strategy: 1
      }), o('dont_know', "I don't know what they compare me with", {
        strategy: 2
      })]), q('freelancer_offer_positioning', 3, 'choice', 'What happens when you think about narrowing what you offer?', [o('fine', "I'd be fine with it. I just haven't done it.", {
        action: 3
      }), o('lose_work', "I worry I'd lose work", {
        self_trust: 2
      }), o('which_way', "I'm not sure which way to narrow it", {
        direction: 3
      }), o('already', "I've already narrowed it, and it still isn't landing", {
        strategy: 3
      })]), q('freelancer_offer_positioning', 4, 'choice', 'Where does most of your work come from?', [o('specific', 'People who find me for a specific thing'), o('referrals', 'Referrals from people who know me', {
        strategy: 1
      }), o('whatever', 'Whatever comes along', {
        strategy: 2,
        direction: 1
      }), o('one_two', 'One or two big clients', {
        environment: 2,
        strategy: 1
      })])],
      freelancer_charge_more: [q('freelancer_charge_more', 1, 'scale', 'Do you know what you should be charging?', [o('know', 'Yes, I know the number', {
        action: 2
      }), o('roughly', 'Roughly', {
        action: 1,
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('keep_changing', 'I keep changing my mind', {
        self_trust: 3
      })]), q('freelancer_charge_more', 2, 'choice', 'When you imagine telling a client your new price, what happens?', [o('fine', "I'd be fine. I just haven't done it.", {
        action: 3
      }), o('disappoint', "I worry they'll be disappointed or leave", {
        relationships_boundaries: 3
      }), o('worth', "I start doubting whether I'm worth it", {
        self_trust: 3
      }), o('pushed_back', "I've tried, and clients pushed back", {
        environment: 2,
        strategy: 1
      })]), q('freelancer_charge_more', 3, 'choice', 'How do your prices compare with others in your market?', [o('lower', 'Clearly lower than others', {
        self_trust: 1,
        action: 1
      }), o('same', 'About the same', {
        strategy: 2
      }), o('higher', 'Already higher than most', {
        environment: 2,
        strategy: 1
      }), o('dont_know', "I don't know what others charge", {
        strategy: 2
      })]), q('freelancer_charge_more', 4, 'choice', 'What do your clients mainly buy from you?', [o('result', 'A clear result they can measure'), o('hard_to_measure', "Something they value but can't easily measure", {
        strategy: 1
      }), o('hours', 'Hours or tasks', {
        strategy: 2
      }), o('cheapest', 'The cheapest option they could find', {
        environment: 3
      })])],
      freelancer_avoiding_sales: avoidingSalesSet('freelancer_avoiding_sales', true),
      freelancer_unsure_focus: focusNextSet('freelancer_unsure_focus', true),
      freelancer_clients_take_too_much: [q('freelancer_clients_take_too_much', 1, 'scale', 'Are your scope and boundaries agreed in writing with clients?', [o('clearly', 'Yes, clearly', {
        relationships_boundaries: 2
      }), o('partly', 'Partly', {
        strategy: 1,
        relationships_boundaries: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('as_we_go', 'No. Things get agreed as we go.', {
        strategy: 3
      })]), q('freelancer_clients_take_too_much', 2, 'choice', 'When a client asks for more than you agreed, what usually happens?', [o('charge', "I point out it's extra and charge for it"), o('resentful', 'I do it and feel resentful afterwards', {
        relationships_boundaries: 3
      }), o('lose_them', "I do it because I'm worried about losing them", {
        relationships_boundaries: 2,
        environment: 1
      }), o('dont_notice', "I don't notice until I'm already doing it", {
        strategy: 2
      })]), q('freelancer_clients_take_too_much', 3, 'choice', 'How many of your clients are like this?', [o('one_two', 'One or two', {
        environment: 2
      }), o('half', 'About half', {
        relationships_boundaries: 1,
        strategy: 1
      }), o('most', 'Most of them', {
        relationships_boundaries: 2
      }), o('industry', "It's normal in my industry", {
        environment: 3
      })]), q('freelancer_clients_take_too_much', 4, 'scale', 'Could you afford to lose your most demanding client?', [o('easily', 'Yes, easily', {
        relationships_boundaries: 2
      }), o('manage', "It would hurt, but I'd manage", {
        relationships_boundaries: 1
      }), o('not_really', 'Not really', {
        environment: 1,
        strategy: 1
      }), o('most_income', "No. They're most of my income.", {
        environment: 2,
        strategy: 1
      })])],
      freelancer_grow_or_stay_small: [q('freelancer_grow_or_stay_small', 1, 'scale', 'Do you know what you want an ordinary work week to look like?', [o('clearly', 'Yes, clearly'), o('roughly', 'Roughly', {
        direction: 1
      }), o('not_really', 'Not really', {
        direction: 2
      }), o('changes', 'It changes depending on the day', {
        direction: 2,
        self_trust: 1
      })]), q('freelancer_grow_or_stay_small', 2, 'scale', 'Have you worked out what each option would mean for your income and time?', [o('detail', 'Yes, in detail', {
        self_trust: 1
      }), o('roughly', 'Roughly', {
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('avoiding', "No. I've been avoiding the numbers.", {
        action: 2,
        strategy: 1
      })]), q('freelancer_grow_or_stay_small', 3, 'choice', 'Whose opinion is shaping this decision most?', [o('mine', 'Mine'), o('should_grow', 'People who think I should grow', {
        relationships_boundaries: 2,
        self_trust: 1
      }), o('compare', 'People I compare myself with', {
        self_trust: 2,
        direction: 1
      }), o('family', 'My partner or family', {
        relationships_boundaries: 2
      })]), q('freelancer_grow_or_stay_small', 4, 'scale', 'Is there enough demand to support growing?', [o('turn_away', 'Yes. I already turn work away.'), o('probably', 'Probably', {
        strategy: 1
      }), o('not_sure', "I'm not sure", {
        strategy: 2
      }), o('struggle', 'No. I struggle to stay busy.', {
        strategy: 2,
        environment: 1
      })])],
      freelancer_exhausted: [q('freelancer_exhausted', 1, 'choice', 'What is draining you most?', [o('amount', "The amount of work. There's simply too much.", {
        capacity: 2,
        environment: 1
      }), o('work_itself', "The work itself. It doesn't interest me like it used to.", {
        direction: 3
      }), o('clients', 'The clients I deal with', {
        relationships_boundaries: 2,
        environment: 1
      }), o('no_results', 'Putting in effort without seeing results', {
        strategy: 3
      })]), restQuestion('freelancer_exhausted', 2, false), q('freelancer_exhausted', 3, 'scale', 'Do your prices let you earn enough without overworking?', [o('yes', 'Yes'), o('just', 'Just about', {
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('flat_out', 'No. I have to work flat out to earn enough.', {
        strategy: 3,
        capacity: 1
      })]), q('freelancer_exhausted', 4, 'scale', 'If the work felt lighter, would you still want to do it?', [o('definitely', 'Yes, definitely', {
        capacity: 1
      }), o('probably', 'Probably', {
        direction: 1
      }), o('not_sure', "I'm not sure", {
        direction: 2
      }), o('lost_interest', "No. I think I've lost interest in it.", {
        direction: 3
      })])],
      freelancer_still_want: [q('freelancer_still_want', 1, 'choice', 'When did the doubt start?', [o('overwork', 'After a long stretch of overwork', {
        capacity: 3
      }), o('difficult_clients', 'After a run of difficult clients', {
        environment: 2,
        relationships_boundaries: 1
      }), o('slowly', 'It has grown slowly over a long time', {
        direction: 3
      }), o('harder_to_find', 'When work became harder to find', {
        strategy: 2,
        environment: 1
      })]), restedDoubtQuestion('freelancer_still_want', 2), q('freelancer_still_want', 3, 'choice', 'Which part would you most like to leave behind?', [o('selling', 'Chasing work and selling myself', {
        environment: 2,
        strategy: 1
      }), o('income', "Not knowing what I'll earn each month", {
        strategy: 1,
        environment: 1
      }), o('alone', 'Working on my own', {
        environment: 2
      }), o('work_itself', 'The work itself', {
        direction: 3
      })]), insteadQuestion('freelancer_still_want', 4)]
    },
    // ════════════════════════════════════════════════════════════════════════
    // EMPLOYED PROFESSIONAL
    // ════════════════════════════════════════════════════════════════════════
    professional: {
      professional_leave_job: [q('professional_leave_job', 1, 'choice', 'If your manager changed tomorrow, would you still want to leave?', [o('would_stay', "No, I'd probably stay", {
        environment: 3
      }), o('depends', 'Maybe. It would depend on who replaced them.', {
        environment: 2
      }), o('less_urgently', 'Yes, but less urgently', {
        environment: 1,
        direction: 1
      }), o('not_manager', "Yes. It isn't really about my manager.", {
        direction: 1
      })]), q('professional_leave_job', 2, 'choice', 'If your salary increased significantly, would you still want to leave?', [o('would_solve', 'No. That would largely solve it.', {
        environment: 2
      }), o('briefly', 'It would help, but not for long', {
        environment: 1,
        direction: 1
      }), o('not_pay', "Yes. Pay isn't really the issue.", {
        direction: 2
      }), o('not_sure', "I'm not sure", {
        direction: 1
      })]), q('professional_leave_job', 3, 'scale', 'Have you felt essentially the same way in previous jobs?', [o('new', 'No, this is new', {
        environment: 2
      }), o('once_twice', 'Once or twice before', {
        direction: 1
      }), o('most_jobs', 'Yes, in most of my jobs', {
        direction: 2
      }), o('every_job', "Yes, in every job I've had", {
        direction: 3
      })]), q('professional_leave_job', 4, 'choice', 'Have you tested what you think you want instead?', [o('know_route', 'Yes. I know what I want and how to get there.', {
        action: 2,
        self_trust: 1
      }), o('no_route', "Yes, but I can't see a realistic way to get there", {
        strategy: 3
      }), o('meaning_to', 'Not yet. I keep meaning to.', {
        action: 3
      }), o('dont_know', "I don't know what I want instead", {
        direction: 3
      })])],
      professional_different_career: [q('professional_different_career', 1, 'scale', "How clear is the career you're drawn to?", [o('very', 'Very clear. I know the field and the role.'), o('field_only', 'I know the field, but not the role', {
        direction: 1,
        strategy: 1
      }), o('possibilities', 'I have a few possibilities', {
        direction: 2
      }), o('not_this', "I only know it isn't this one", {
        direction: 3
      })]), q('professional_different_career', 2, 'choice', 'Have you spoken to people who do that work now?', [o('several', 'Yes, several'), o('one_two', 'One or two', {
        strategy: 1
      }), o('meaning_to', 'Not yet. I keep meaning to.', {
        action: 3
      }), o('what_to_ask', "Not yet. I'm not sure what to ask them.", {
        strategy: 2
      })]), q('professional_different_career', 3, 'choice', 'What is stopping you from moving towards it?', [o('money', "Money. I can't afford to start again.", {
        strategy: 2,
        environment: 1
      }), o('how', 'Not knowing how to make the switch', {
        strategy: 3
      }), o('people_think', 'Worrying what people will think', {
        relationships_boundaries: 2,
        self_trust: 1
      }), o('good_at_it', "Doubting whether I'd be good at it", {
        self_trust: 3
      })]), q('professional_different_career', 4, 'choice', 'Is it the career you want to leave, or the place you work?', [o('career', 'The career itself'), o('mostly_career', 'Mostly the career, partly this company', {
        environment: 1
      }), o('hard_to_separate', "It's hard to separate the two", {
        environment: 1,
        direction: 1
      }), o('company', "Maybe it's mostly this company", {
        environment: 3
      })])],
      professional_dont_know_next: [q('professional_dont_know_next', 1, 'scale', "Can you describe what you'd want more of in an ordinary work week?", [o('specific', 'Yes, quite specifically'), o('few_things', 'A few things', {
        direction: 1
      }), o('vaguely', 'Only vaguely', {
        direction: 2
      }), o('dont_want', "No. I mostly know what I don't want.", {
        direction: 3
      })]), q('professional_dont_know_next', 2, 'choice', 'How do you usually try to work it out?', [o('try_things', 'I try small things and learn from them'), o('research', "I read and research, but it doesn't settle anything", {
        direction: 1,
        action: 1
      }), o('ask_people', 'I ask lots of people for their opinion', {
        self_trust: 3
      }), o('no_energy', "I don't have the energy to think about it", {
        capacity: 3
      })]), q('professional_dont_know_next', 3, 'choice', 'When an idea excites you, what usually happens next?', [o('explore', 'I look into it properly'), o('lose_interest', 'I lose interest after a while', {
        direction: 2
      }), o('drop_it', 'Someone points out a problem and I drop it', {
        self_trust: 2,
        relationships_boundaries: 1
      }), o('talk_out', 'I talk myself out of it', {
        self_trust: 2,
        action: 1
      })]), q('professional_dont_know_next', 4, 'choice', 'What gets in the way of exploring your options?', [o('not_started', "Nothing much. I just haven't started.", {
        action: 3
      }), o('realistic', "I don't know which options are realistic", {
        strategy: 3
      }), o('job', 'My job leaves no time or energy', {
        capacity: 2,
        environment: 1
      }), o('looking_for', "I'm not sure what I'm looking for", {
        direction: 3
      })])],
      professional_not_progressing: [q('professional_not_progressing', 1, 'scale', "Do you know what you'd need to do to reach the next step?", [o('defined', "Yes, it's clearly defined", {
        action: 1
      }), o('roughly', 'Roughly', {
        strategy: 1
      }), o('not_really', 'Not really', {
        strategy: 2
      }), o('never_clear', 'Nobody has ever made it clear', {
        environment: 2,
        strategy: 1
      })]), q('professional_not_progressing', 2, 'choice', 'Have you told your manager clearly what you want?', [o('directly', 'Yes, directly', {
        environment: 1
      }), o('hinted', "I've hinted at it", {
        relationships_boundaries: 2
      }), o('not_yet', 'Not yet', {
        relationships_boundaries: 1,
        action: 1
      }), o('unsure_want', "I'm not sure what I want", {
        direction: 3
      })]), q('professional_not_progressing', 3, 'choice', 'Are people in similar roles progressing where you work?', [o('regularly', 'Yes, regularly', {
        strategy: 2
      }), o('some', 'Some are', {
        strategy: 1
      }), o('rarely', 'Rarely', {
        environment: 2
      }), o('nowhere', "No. There's nowhere to progress to.", {
        environment: 3
      })]), q('professional_not_progressing', 4, 'choice', 'When an opportunity comes up, what do you usually do?', [o('go_for_it', 'I go for it'), o('wait', 'I wait to be asked', {
        self_trust: 2,
        action: 1
      }), o('talk_out', 'I talk myself out of it', {
        self_trust: 3
      }), o('stretched', "I'm too stretched to take on more", {
        capacity: 3
      })])],
      professional_difficult_decision: decisionSet('professional_difficult_decision'),
      professional_manager_colleagues: [q('professional_manager_colleagues', 1, 'choice', "Have you told them clearly what isn't working for you?", [o('directly', 'Yes, directly', {
        environment: 1
      }), o('hinted', "I've hinted at it", {
        relationships_boundaries: 2
      }), o('putting_off', 'Not yet. I keep putting it off.', {
        relationships_boundaries: 2,
        action: 1
      }), o('how', "I'm not sure how to raise it well", {
        strategy: 2,
        self_trust: 1
      })]), q('professional_manager_colleagues', 2, 'choice', 'Do other people have the same problem with them?', [o('widely_known', "Yes, it's widely known", {
        environment: 3
      }), o('a_few', 'A few people do', {
        environment: 2
      }), o('dont_think', "I don't think so", {
        relationships_boundaries: 1,
        self_trust: 1
      }), o('dont_know', "I don't know")]), q('professional_manager_colleagues', 3, 'scale', 'Have you had similar problems with managers or colleagues before?', [o('new', 'No, this is new', {
        environment: 2
      }), o('once', 'Once before', {
        relationships_boundaries: 1
      }), o('few_times', 'A few times', {
        relationships_boundaries: 2
      }), o('most_jobs', 'It happens in most jobs', {
        relationships_boundaries: 3
      })]), q('professional_manager_colleagues', 4, 'choice', 'When you picture raising the issue, what worries you most?', [o('reaction', 'Their reaction', {
        relationships_boundaries: 3
      }), o('being_wrong', 'Being wrong about it', {
        self_trust: 3
      }), o('career', 'Damaging my position or my career', {
        environment: 2,
        relationships_boundaries: 1
      }), o('nothing_changed', "I've raised it already and nothing changed", {
        environment: 3
      })])],
      professional_boundaries: [q('professional_boundaries', 1, 'choice', "When someone asks for something you don't want to do, what usually happens?", [o('say_no', 'I say no if I need to'), o('regret', 'I say yes and regret it later', {
        relationships_boundaries: 3
      }), o('risky', 'I say yes because saying no feels risky here', {
        environment: 2,
        relationships_boundaries: 1
      }), o('delay', "I put off answering until it's too late", {
        action: 2,
        relationships_boundaries: 1
      })]), q('professional_boundaries', 2, 'choice', 'Who do you find it hardest to say no to?', [o('one_two', 'One or two particular people', {
        environment: 2
      }), o('authority', 'People with authority over me', {
        relationships_boundaries: 1,
        environment: 1
      }), o('most', 'Most people at work', {
        relationships_boundaries: 2
      }), o('everyone', 'Almost everyone, at work and outside it', {
        relationships_boundaries: 3
      })]), q('professional_boundaries', 3, 'scale', "Would your workload be realistic if you only did what's expected of you?", [o('yes', 'Yes', {
        relationships_boundaries: 2
      }), o('mostly', 'Mostly', {
        relationships_boundaries: 1
      }), o('not_really', 'Not really', {
        environment: 1,
        capacity: 1
      }), o('too_big', 'No. The role is too big for one person.', {
        environment: 3
      })]), q('professional_boundaries', 4, 'choice', 'Do you know which requests really matter and which could wait?', [o('clearly', 'Yes, clearly', {
        relationships_boundaries: 1
      }), o('mostly', 'Mostly'), o('not_really', 'Not really', {
        strategy: 2
      }), o('all_urgent', 'Everything is treated as urgent here', {
        environment: 2,
        strategy: 1
      })])],
      professional_exhausted: [q('professional_exhausted', 1, 'choice', 'What is draining you most?', [o('amount', "The amount of work. There's simply too much.", {
        capacity: 2,
        environment: 1
      }), o('work_itself', "The work itself. It doesn't interest me anymore.", {
        direction: 3
      }), o('culture', 'The people or the culture', {
        environment: 2,
        relationships_boundaries: 1
      }), o('nowhere', "Putting in effort that doesn't seem to lead anywhere", {
        environment: 2,
        strategy: 2
      })]), restQuestion('professional_exhausted', 2, true), q('professional_exhausted', 3, 'choice', 'Would the same job at a different company feel better?', [o('much_better', 'Yes, much better', {
        environment: 3
      }), o('a_little', 'Maybe a little', {
        environment: 1
      }), o('anywhere', "No. I'd feel the same anywhere in this field.", {
        direction: 3
      }), o('too_tired', "I'm too tired to tell", {
        capacity: 2
      })]), q('professional_exhausted', 4, 'scale', "How often do you take on extra work you don't have room for?", [o('rarely', 'Rarely'), o('sometimes', 'Sometimes', {
        relationships_boundaries: 1
      }), o('often', 'Often', {
        relationships_boundaries: 2
      }), o('almost_always', 'Almost always', {
        relationships_boundaries: 3
      })])],
      professional_not_meaningful: [q('professional_not_meaningful', 1, 'choice', 'When did the work stop feeling meaningful?', [o('changed_at_work', 'When something changed at work', {
        environment: 3
      }), o('gradually', 'Gradually, over several years', {
        direction: 2
      }), o('never', 'It never really did', {
        direction: 3
      }), o('exhausted', 'When I became exhausted', {
        capacity: 3
      })]), q('professional_not_meaningful', 2, 'choice', 'If you did similar work somewhere else, would it feel different?', [o('probably', 'Yes, probably', {
        environment: 3
      }), o('maybe', 'Maybe', {
        environment: 1,
        direction: 1
      }), o('work_itself', "No. It's the work itself.", {
        direction: 3
      }), o('dont_know', "I don't know", {
        direction: 1
      })]), q('professional_not_meaningful', 3, 'scale', 'Do you know what would feel meaningful to you?', [o('clearly', 'Yes, quite clearly', {
        action: 2,
        self_trust: 1
      }), o('ideas', 'I have some ideas', {
        direction: 1
      }), o('vaguely', 'Only vaguely', {
        direction: 2
      }), o('no', 'No', {
        direction: 3
      })]), q('professional_not_meaningful', 4, 'choice', 'What stops you from moving towards more meaningful work?', [o('money', 'Money or financial commitments', {
        strategy: 2,
        environment: 1
      }), o('how', 'Not knowing how to make the change', {
        strategy: 3
      }), o('people_think', 'What other people would think', {
        relationships_boundaries: 2,
        self_trust: 1
      }), o('doubt_better', "Doubting I'd find anything better", {
        self_trust: 2,
        direction: 1
      })])]
    }
  };

  // ── Stage C · Universal statements ─────────────────────────────────────────
  // Exact wording, fixed order. `group` is the section each statement belongs to
  // (for reports only; the visitor never sees it). How each statement scores
  // lives in focus-area-scoring.jsx.
  var UNIVERSAL_PROMPT = 'How true is this for you?';
  var UNIVERSAL = [{
    id: 'u01',
    group: 'Direction',
    text: "I know what I want, even if I don't yet know how to get there."
  }, {
    id: 'u02',
    group: 'Direction',
    text: 'I can tell the difference between what I want and what I think I should want.'
  }, {
    id: 'u03',
    group: 'Self-trust',
    text: 'I trust my own judgment when the stakes are high.'
  }, {
    id: 'u04',
    group: 'Self-trust',
    text: "Other people's opinions can easily make me question what I already know."
  }, {
    id: 'u05',
    group: 'Action',
    text: 'When I know what needs to be done, I usually do it.'
  }, {
    id: 'u06',
    group: 'Action',
    text: 'I often wait for more certainty before taking the next step.'
  }, {
    id: 'u07',
    group: 'Discomfort / avoidance',
    text: 'I can do something important even when rejection, conflict or failure are possible.'
  }, {
    id: 'u08',
    group: 'Discomfort / avoidance',
    text: 'When something makes me uncomfortable, I tend to delay it or work around it.'
  }, {
    id: 'u09',
    group: 'Relationships & Boundaries',
    text: 'I can say what I want even when someone may not like it.'
  }, {
    id: 'u10',
    group: 'Relationships & Boundaries',
    text: 'I can say no without feeling I need a long explanation.'
  }, {
    id: 'u11',
    group: 'Capacity',
    text: 'I have enough energy and mental space for the things that matter most.'
  }, {
    id: 'u12',
    group: 'Capacity',
    text: 'When I rest, I usually feel restored afterwards.'
  }, {
    id: 'u13',
    group: 'Pattern / environment',
    text: 'The same kinds of problems tend to follow me across different jobs, clients or projects.'
  }, {
    id: 'u14',
    group: 'Pattern / environment',
    text: 'When my environment changes, my problems usually change with it.'
  }];
  // The value is the stable id of each point on the scale.
  var SCALE = [{
    value: 1,
    label: 'Not true'
  }, {
    value: 2,
    label: 'Rarely true'
  }, {
    value: 3,
    label: 'Sometimes true'
  }, {
    value: 4,
    label: 'Mostly true'
  }, {
    value: 5,
    label: 'True'
  }];

  // Stage names as the visitor sees them in the progress indicator.
  var STAGES = [{
    id: 'situation',
    label: 'Your situation'
  }, {
    id: 'context',
    label: 'How the problem is working'
  }, {
    id: 'response',
    label: 'How you tend to respond'
  }];

  // ── Lookups ────────────────────────────────────────────────────────────────
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function focusArea(id) {
    return byId(FOCUS_AREAS, id);
  }
  function persona(id) {
    return byId(PERSONAS, id);
  }
  function problems(personaId) {
    return PROBLEMS[personaId] || [];
  }
  function problem(personaId, problemId) {
    return byId(problems(personaId), problemId);
  }
  function contextualQuestions(personaId, problemId) {
    return CONTEXTUAL[personaId] && CONTEXTUAL[personaId][problemId] || [];
  }
  function scaleLabel(value) {
    for (var i = 0; i < SCALE.length; i++) if (SCALE[i].value === value) return SCALE[i].label;
    return '';
  }
  return {
    version: 1,
    slug: 'find-your-focus-area',
    title: 'Find Your Focus Area',
    FOCUS_AREAS: FOCUS_AREAS,
    PERSONA_QUESTION: PERSONA_QUESTION,
    PERSONAS: PERSONAS,
    PROBLEMS_QUESTION: PROBLEMS_QUESTION,
    PROBLEMS: PROBLEMS,
    PRIMARY_QUESTION: PRIMARY_QUESTION,
    CONTEXTUAL: CONTEXTUAL,
    UNIVERSAL_PROMPT: UNIVERSAL_PROMPT,
    UNIVERSAL: UNIVERSAL,
    SCALE: SCALE,
    STAGES: STAGES,
    focusArea: focusArea,
    persona: persona,
    problems: problems,
    problem: problem,
    contextualQuestions: contextualQuestions,
    scaleLabel: scaleLabel
  };
}();
