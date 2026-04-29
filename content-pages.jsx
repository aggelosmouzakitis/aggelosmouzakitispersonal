// content-pages.jsx — Home + all specialty pages

// Shared styles — light theme #F4F2F0 bg, #282726 text
const C = {
  text: '#282726',
  muted: '#777',
  accent: '#00bf63',
  border: 'rgba(40,39,38,0.12)',
  sepBorder: 'rgba(40,39,38,0.2)',
};
const pageStyle = {
  maxWidth: 740, margin: '0 auto', padding: '4rem 2rem 7rem',
  fontFamily: 'inherit', color: C.text,
};
const h1Style = { fontSize: '28px', fontWeight: 400, lineHeight: 1.4, color: C.text, marginBottom: '2.5rem', letterSpacing: '-.02em' };
const h2Style = { fontSize: '11px', fontWeight: 400, letterSpacing: '.15em', textTransform: 'uppercase', color: C.muted, paddingTop: '.25rem', lineHeight: 1.7 };
const h3Style = { fontSize: '16px', fontWeight: 400, lineHeight: 1.7, color: C.text, marginBottom: '.6rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '.4rem' };
const sectionStyle = { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0 2.5rem', marginBottom: '3rem' };
const pStyle = { marginBottom: '1.4rem', lineHeight: 1.85, fontSize: '16px', color: C.text };
const sepStyle = { border: 'none', borderTop: `1px solid ${C.sepBorder}`, margin: '2.5rem 0' };
const ctaBtn = {
  fontFamily: 'inherit', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase',
  color: '#F4F2F0', background: '#282726', border: '1px solid #282726',
  textDecoration: 'none', padding: '.7rem 1.4rem', display: 'inline-block',
  cursor: 'pointer', transition: 'background .15s, color .15s',
};
const footerStyle = { marginTop: '3rem', fontSize: '13px', color: C.muted };
const greenLink = { color: C.accent, textUnderlineOffset: '3px', textDecorationThickness: '1px' };


// Mobile-responsive hook — never touches desktop layout
function useIsMobile() {
  const [mob, setMob] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mob;
}
function Strong({ children }) {
  return React.createElement('span', {
    style: { fontWeight: 400, color: '#282726', borderBottom: '1px solid rgba(40,39,38,.3)', paddingBottom: '1px' }
  }, children);
}
function A({ href, children }) {
  return React.createElement('a', { href, target: '_blank', rel: 'noopener', style: greenLink }, children);
}
function Section({ label, children, mob }) {
  const ss = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const hs = mob ? { ...h2Style, paddingBottom: '.5rem', display: 'block' } : h2Style;
  return React.createElement('section', { style: ss },
    React.createElement('h2', { style: hs }, label),
    React.createElement('div', null, children)
  );
}
function P({ children, last }) {
  return React.createElement('p', { style: { ...pStyle, marginBottom: last ? 0 : '1.2rem' } }, children);
}
function FaqItem({ q, children }) {
  return React.createElement('div', { style: { marginBottom: '2rem' } },
    React.createElement('h3', { style: h3Style }, q),
    children
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('header', { style: { marginBottom: mob ? '2rem' : '4rem', borderBottom: `1px solid ${C.border}`, paddingBottom: mob ? '1.5rem' : '3rem' } },
      React.createElement('p', { style: { fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: C.muted, marginBottom: '1.2rem' } }, 'Psychotherapist & Burnout Coach'),
      React.createElement('h1', { style: { ...h1Style, marginBottom: '1.5rem', fontSize: mob ? '20px' : '24px' } },
        "I\u2019m Aggelos Mouzakitis, a licensed psychotherapist and burnout coach for high-functioning people in tech. Based in Ireland, working globally."
      ),
      React.createElement('p', { style: { ...pStyle, marginBottom: 0, maxWidth: 560 } },
        "I spent 18+ years working in B2B SaaS before training as a therapist. That background shapes how I work with clients now."
      )
    ),

    React.createElement(Section, { label: 'What I do', mob },
      React.createElement(P, null, "I work with founders, executives, and senior tech professionals on performance dependence: the pattern where achievement has become the way you regulate your sense of worth, and any disruption to performance starts threatening more than just your career."),
      React.createElement(P, null, "High-functioning burnout usually runs deeper than overwork. For most of the people I work with, performance became identity and proof of worth a long time ago. That can drive success for years, but it also means that when things stop going well, motivation, relationships, and your sense of self all start to crack at the same time."),
      React.createElement(P, { last: true }, "I help people keep their drive while ending the dependency on it.")
    ),

    React.createElement(Section, { label: 'Who I work with', mob },
      React.createElement(P, null, "Senior tech professionals, founders, VPs, and executives who are doing well by every external measure but are starting to notice what it costs. The anxiety that doesn't match the accomplishments. The irritability that leaks into relationships. The sense that taking your foot off the gas, even slightly, would reveal something you're not ready to face."),
      React.createElement(P, null, "I also work with people navigating imposter syndrome, career transitions, leadership isolation, and the broader identity questions that come with operating at a high level for a long time."),
      React.createElement(P, { last: true },
        "I write about the psychology of ambition, identity, and performance at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), ". The writing names what most people in high-stakes careers feel but rarely say out loud. The private work is where we actually change it."
      )
    ),

    React.createElement(Section, { label: 'Product growth', mob },
      React.createElement(P, null, "I've spent 18+ years in growth strategy across companies at every stage, from early-stage startups to ", React.createElement(A, { href: 'https://www.ibm.com' }, 'IBM'), "'s enterprise portfolio, covering PLG, pricing, activation, and go-to-market. I've worked with 50+ companies, always embedded, always hands-on."),
      React.createElement(P, null, "I help product-led companies turn usage into revenue. I work as a fractional growth advisor for SaaS founders and growth leaders on the problems that frameworks don't reach: activation that doesn't stick, pricing that confuses, funnels that leak in ways nobody has noticed yet."),
      React.createElement(P, { last: true },
        React.createElement(A, { href: 'https://headofgrowth.io' }, 'How I work with founders and growth teams →')
      )
    ),

    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free, 60 minutes, and has no strings. We use it to figure out where you actually are and whether working together makes sense."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', {
          href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session',
          style: ctaBtn,
          onMouseEnter: e => e.currentTarget.style.borderColor = '#fff',
          onMouseLeave: e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)',
        }, 'Book a free 60-minute session')
      )
    ),

    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

// ─── SPECIALTY PAGE TEMPLATE ─────────────────────────────────────────────────
function SpecialtyPage({ pageId }) {
  const pages = {
    'therapy-for-executives': ExecTherapyPage,
    'therapy-for-founders': FoundersTherapyPage,
    'imposter-syndrome-therapy': ImposterPage,
    'executive-burnout-therapy': BurnoutPage,
    'career-transition-therapy': CareerTransitionPage,
  };
  const Component = pages[pageId];
  return Component ? React.createElement(Component) : null;
}

// ─── THERAPY FOR EXECUTIVES ──────────────────────────────────────────────────
function ExecTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } },
      'Therapy for executives who have done everything right and still feel like something is off'
    ),

    React.createElement(Section, { label: 'The problem', mob },
      React.createElement(P, null, "You're good at your job. You know that. But somewhere along the way the cost of doing it well started to change, and ", React.createElement(Strong, null, "no amount of delegation, time off, or strategy adjustment seems to touch it"), ". The work gets done, the results are there, but something underneath has shifted."),
      React.createElement(P, null, "For some people it's the ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure' }, 'isolation that comes with seniority'), ". For others it's an identity that has slowly become inseparable from output, to the point where slowing down feels dangerous. Or it's the persistent feeling of being one mistake away from losing everything you've built, even though the evidence says otherwise."),
      React.createElement(P, { last: true }, "These aren't problems that another offsite or another framework will solve. They tend to need a different kind of attention.")
    ),

    React.createElement(Section, { label: 'What executive therapy is', mob },
      React.createElement(P, null, "Executive therapy is psychotherapy for people in senior professional roles. ", React.createElement(Strong, null, "Not coaching with a different label, and not a softer version of clinical work."), " It takes the professional context seriously rather than treating it as background noise, and it goes deeper than performance optimization into the patterns that actually drive behaviour."),
      React.createElement(P, null, "It looks at things like ", React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'why identity becomes inseparable from output'), ", why success doesn't settle the internal question it was supposed to answer, and why certain interpersonal dynamics at work keep repeating."),
      React.createElement(P, { last: true }, "The difference between an executive therapist and a general therapist is mostly context. If your therapist needs half the session just to understand what happened in your week, that's time spent on orientation rather than the actual work.")
    ),

    React.createElement(Section, { label: 'How I work', mob },
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS. I've led growth strategy at startups and inside ", React.createElement(A, { href: 'https://www.ibm.com' }, 'IBM'), "'s enterprise portfolio, and I've ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised 50+ companies'), " on the kind of work my clients carry into sessions every week."),
      React.createElement(P, null, React.createElement(Strong, null, "That means I already understand the environment you're operating in."), " We don't have to spend time on context-setting, which lets us get to the real work faster."),
      React.createElement(P, { last: true }, "I write about the psychology of ambition and performance at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), " (5,000+ subscribers). The writing explores the patterns. The private work is where we actually address them.")
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, null, "Founders, VPs, directors, and senior ICs in tech. People who are doing well by any external measure and still feel like something isn't working. Some common threads:"),
      React.createElement(P, null, React.createElement(Strong, null, "Chronic self-doubt alongside strong performance."), " ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high' }, 'Achievement patterns tied to early approval-seeking'), " that were never examined. Decision paralysis that isn't really about the decision. Burnout that rest doesn't fix. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Overthinking that has become a default setting'), " rather than a useful tool."),
      React.createElement(P, { last: true }, "If you're used to solving problems through effort and analysis, and this particular one isn't responding to either, it might be worth a conversation.")
    ),

    React.createElement(Section, { label: 'How it works', mob },
      React.createElement(P, null, "All sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Most clients are across Europe and the US. Sessions run weekly or biweekly."),
      React.createElement(P, null, "The first session is ", React.createElement(Strong, null, "60 minutes and free"), ". We use it to figure out what's actually going on and whether working together makes sense. If it doesn't, I'll say so."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),

    React.createElement('hr', { style: sepStyle }),

    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'What is executive therapy, exactly?' },
          React.createElement(P, { last: true }, "Psychotherapy for people in leadership and senior roles. It goes beyond performance optimization into the patterns and internal dynamics that shape how you lead, make decisions, and relate to others. It works best when the therapist understands the professional context, not just the clinical side.")
        ),
        React.createElement(FaqItem, { q: 'How is this different from executive coaching?' },
          React.createElement(P, { last: true }, "Coaching tends to focus on skills and strategy. Therapy works with what's underneath: why you're stuck, why certain patterns keep repeating, why approaches that used to work have stopped working. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets called coaching'), " actually needs therapeutic depth to address properly.")
        ),
        React.createElement(FaqItem, { q: "I'm not sure if I need therapy or coaching. How do I decide?" },
          React.createElement(P, { last: true }, "If the challenge is situational and skill-based, coaching is usually enough. If the same patterns keep appearing across different roles, relationships, and decisions, and ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'you suspect the real obstacle is internal'), ", that's more likely therapy territory. Starting with therapy often makes later coaching more useful.")
        ),
        React.createElement(FaqItem, { q: 'Can analytical people benefit from therapy?' },
          React.createElement(P, { last: true }, React.createElement(A, { href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain' }, 'Self-analysis can become a way to maintain control'), " rather than a path to change. Good therapy works with that pattern rather than being fooled by it.")
        ),
        React.createElement(FaqItem, { q: 'Is this available remotely?' },
          React.createElement(P, { last: true }, "Yes. All sessions are online. Most clients prefer it for flexibility and privacy.")
        )
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free, 60 minutes, no obligations. We use it to figure out what's going on and whether working together makes sense."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),
    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

// ─── THERAPY FOR FOUNDERS ────────────────────────────────────────────────────
function FoundersTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } },
      'Therapy for founders who have no one to be honest with about what this actually costs'
    ),

    React.createElement(Section, { label: 'The founder problem', mob },
      React.createElement(P, null, "There's a ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure' }, 'particular kind of isolation that founders experience'), " that's different from ordinary loneliness. You're surrounded by people who depend on you, and ", React.createElement(Strong, null, "precisely because they depend on you, none of them can be the person you're fully honest with"), " about what it costs to hold everything together."),
      React.createElement(P, null, "So you perform. Certainty in board meetings, calm in all-hands, optimism for your co-founder. Over time the gap between what you project and what you actually feel becomes its own source of exhaustion, sometimes the biggest one."),
      React.createElement(P, { last: true }, "This isn\u2019t something coaching or \u201cmental fitness\u201d apps are designed to address. It\u2019s a structural psychological burden that comes with the role, and it usually needs proper therapeutic work.")
    ),

    React.createElement(Section, { label: 'What I see in founders', mob },
      React.createElement(P, null, "Having worked with founders both as a ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'growth advisor'), " and as a therapist, the patterns are fairly consistent. ", React.createElement(Strong, null, "Identity tends to fuse completely with the company"), " — when it's up you're up, when it's down you disappear into it. There's often no stable sense of self that exists independently of the last metric you checked."),
      React.createElement(P, { last: true }, "Decision fatigue becomes chronic, and it stops being about the decisions themselves. It's about the weight of being the person who has to make them. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Overthinking becomes a default mode'), " that feels productive but mostly produces exhaustion. Relationships suffer, not because you don't care, but because ", React.createElement(Strong, null, "there's nothing left after the company takes its share"), ".")
    ),

    React.createElement(Section, { label: 'Why I understand this', mob },
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including advising 50+ companies on growth. I've been on the other side of the table where you set targets, defend strategy, and absorb pressure from every direction."),
      React.createElement(P, { last: true }, "When a client comes in carrying the weight of a down round or a co-founder conflict, ", React.createElement(Strong, null, "I don't need them to explain the context"), ". I know what that room feels like. We skip the background and go straight to the work.")
    ),

    React.createElement(Section, { label: 'How it works', mob },
      React.createElement(P, null, "Sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Nothing goes to your board, your investors, or your team. This isn't coaching attached to your company. It's a private therapeutic relationship."),
      React.createElement(P, null, "The first session is ", React.createElement(Strong, null, "60 minutes and free"), ". We use it to figure out what's going on and whether I'm the right person for it."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),

    React.createElement('hr', { style: sepStyle }),

    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Why do founders need a specific kind of therapy?' },
          React.createElement(P, { last: true }, "Because the psychological environment of founding is quite specific. The isolation is structural, the identity fusion is usually total, and the pressure comes from multiple directions at once. A therapist who hasn't operated inside that environment will likely either treat it as generic stress or miss what's actually going on underneath the performance.")
        ),
        React.createElement(FaqItem, { q: 'What do founders typically bring to therapy?' },
          React.createElement(P, { last: true }, "Isolation that gets worse as the company grows. Identity that's become indistinguishable from the company's performance. Chronic decision fatigue. Relationship strain. ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, 'Self-defeating patterns'), " that keep producing the outcomes they're trying to avoid. Burnout that doesn't respond to rest because the source is emotional weight rather than hours worked.")
        ),
        React.createElement(FaqItem, { q: 'Can I do this while running a company?' },
          React.createElement(P, { last: true }, "Yes. Most founder clients do weekly or biweekly sessions remotely. The more relevant question is usually whether the cost of not doing it — the reactive decisions, the strained relationships, the mounting internal pressure — is something your company can keep absorbing.")
        ),
        React.createElement(FaqItem, { q: 'Is this completely confidential?' },
          React.createElement(P, { last: true }, "Yes. It's a private therapeutic relationship governed by professional ethics. Nothing is shared with anyone.")
        )
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free, 60 minutes, no obligations. We figure out what's going on and whether working together makes sense."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),
    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

// ─── IMPOSTER SYNDROME ───────────────────────────────────────────────────────
function ImposterPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } },
      'You can see the evidence that you\u2019re good at this. You just can\u2019t feel it.'
    ),

    React.createElement(Section, { label: 'The pattern', mob },
      React.createElement(P, null, "The promotions confirm it. The salary confirms it. You're not unaware of the evidence. But ", React.createElement(Strong, null, "there's a gap between knowing you're competent and actually feeling it"), ", and that gap tends to fill with constant proof-seeking: another win, another round of validation that settles things for a day or two before the doubt comes back."),
      React.createElement(P, { last: true }, React.createElement(A, { href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high' }, 'For a lot of high performers, this pattern was wired early.'), " Achievement became the way to earn approval or safety, and a conditional sense of self-worth got established long before the career started. Because the next result always comes and always proves insufficient, the doubt doesn't resolve. It just gets more expensive to manage over time.")
    ),

    React.createElement(Section, { label: 'Why it gets worse with seniority', mob },
      React.createElement(P, null, "Imposter syndrome doesn't tend to improve as you advance. ", React.createElement(Strong, null, "The stakes get higher, the visibility increases, and the margin for error feels thinner."), " At junior levels you can hide behind a team or a manager. At VP level and above, your decisions are visible and your failures have your name on them."),
      React.createElement(P, { last: true }, React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'When identity is enmeshed with constant success'), ", even normal professional setbacks start to feel existential. A missed quarter isn't just a missed quarter. It feels like evidence that the fraud has finally been caught. The rational part of you knows this is distorted, but the emotional system doesn't care about evidence.")
    ),

    React.createElement(Section, { label: 'What doesn\u2019t work', mob },
      React.createElement(P, null, "Affirmations. Achievement logs. \"Just remember how far you've come.\" These approaches treat imposter syndrome as a thinking problem, but ", React.createElement(Strong, null, "it's a feeling problem with roots that usually predate the career by decades"), ". ", React.createElement(A, { href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain' }, 'For analytical people, self-analysis often becomes another way to maintain control'), " rather than a genuine path to change."),
      React.createElement(P, { last: true }, "The doubt is real. The story it tells you about what it means is not. Therapy works with that distinction at a level that self-help and coaching don't typically reach.")
    ),

    React.createElement(Section, { label: 'How I work with this', mob },
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 50+ companies on growth'), ". I know the environment that amplifies imposter syndrome in tech: the pace, the ambiguity, the constant comparison."),
      React.createElement(P, null, React.createElement(Strong, null, "We work with the root pattern rather than the symptoms."), " That means going beyond the current role to understand where the conditional sense of worth was established, why it persists, and what it would take to build a sense of self that doesn't depend entirely on the next result."),
      React.createElement(P, { last: true }, "I write about this at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), ". The writing explores the patterns. The private work is where they actually move.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "The first session is ", React.createElement(Strong, null, "60 minutes, free, and exploratory"), ". We figure out what's driving the pattern and whether I'm the right person to work on it with you."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),

    React.createElement('hr', { style: sepStyle }),

    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Is imposter syndrome a real diagnosis?' },
          React.createElement(P, { last: true }, "It's not a clinical diagnosis in the DSM. It's a persistent pattern of doubting your accomplishments despite clear evidence of competence. In senior professionals, it tends to show up as overwork, avoidance of visibility, difficulty delegating, and a low-grade anxiety that erodes both performance and wellbeing over time.")
        ),
        React.createElement(FaqItem, { q: 'Why is imposter syndrome so common in high achievers?' },
          React.createElement(P, { last: true }, "Often because achievement started as a strategy to earn approval or safety rather than an expression of genuine interest. ", React.createElement(A, { href: 'https://www.undisguised.io/p/high-performance-as-a-way-to-get' }, 'High performance becomes a way to get accepted'), " rather than a reflection of who you actually are.")
        ),
        React.createElement(FaqItem, { q: 'Can coaching with a therapist actually resolve this?' },
          React.createElement(P, { last: true }, "Yes, though not through reframing or positive self-talk. Effective therapy works with the relational pattern that established the conditional worth in the first place. ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'Doubt tends to protect you from something'), " even when you can see the evidence clearly, and that protective function needs to be understood before it can change.")
        ),
        React.createElement(FaqItem, { q: "I know I'm good at my job. Why do I still feel like a fraud?" },
          React.createElement(P, { last: true }, "Because the feeling isn't really about your job. It's about an older emotional system that learned your value is conditional. Your rational mind can process the evidence just fine, but the part of you that drives the doubt operates on different logic.")
        ),
        React.createElement(FaqItem, { q: 'How is therapeutically-informed coaching different from regular coaching?' },
          React.createElement(P, { last: true }, "Regular coaching usually focuses on managing symptoms: reframing, confidence exercises, tracking achievements. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets labeled coaching'), " in this space actually requires therapeutic depth. Therapy goes to the source of the pattern rather than helping you cope with it.")
        )
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free and has no obligations. We use it to understand what's driving the doubt and whether this is the right approach for you."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),
    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

// ─── BURNOUT PAGE ────────────────────────────────────────────────────────────
function BurnoutPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } },
      'You took the vacation. You came back feeling the same way. The problem probably isn\u2019t the workload.'
    ),

    React.createElement(Section, { label: 'Executive burnout', mob },
      React.createElement(P, null, "The usual advice is to rest more, delegate more, set better boundaries. You've probably tried most of it. Maybe you even took real time off. And within a couple of weeks of returning, ", React.createElement(Strong, null, "the same weight came back"), ", as if it had been waiting for you."),
      React.createElement(P, null, "That's because burnout in executives often isn't about working too many hours. It's about the emotional cost of the work: carrying chronic responsibility without adequate support, maintaining a version of yourself that takes constant effort, and having an identity so tied to output that stopping feels like disappearing."),
      React.createElement(P, { last: true }, "Rest doesn't fix that. ", React.createElement(A, { href: 'https://www.undisguised.io/p/is-it-post-holiday-anxiety-or-just' }, 'Sometimes what feels like post-holiday anxiety is actually a moment of clarity'), " about how unsustainable the current arrangement has become.")
    ),

    React.createElement(Section, { label: "What's actually happening" },
      React.createElement(P, null, "Executive burnout usually sits on top of older patterns. An inability to stop because ", React.createElement(A, { href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing' }, 'identity has become enmeshed with constant output'), ". A relationship with work where ", React.createElement(Strong, null, "your sense of value as a person depends on the next deliverable"), ". Chronic overfunction that started well before this particular role."),
      React.createElement(P, null, "The cynicism, the emotional flatness, the inability to care about things you used to care about: these aren't character flaws. They're signals that the internal cost of how things are currently set up has exceeded what you can sustain."),
      React.createElement(P, { last: true }, React.createElement(A, { href: 'https://www.undisguised.io/p/the-elaborate-performance-of-trying' }, 'A lot of people build elaborate systems of "trying to change"'), " that look productive but function as avoidance. If that sounds familiar, the issue probably isn't willpower. It's that the pattern is serving a function that hasn't been identified.")
    ),

    React.createElement(Section, { label: 'How I work with this', mob },
      React.createElement(P, null, React.createElement(Strong, null, "This work goes to the level of the pattern, not the symptoms."), " We look at what's driving the overwork: what it would mean to stop, what you're avoiding by staying in motion, why the idea of doing less feels threatening rather than freeing."),
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 50+ companies on growth'), ". I understand the environment well: the always-on culture, the ambiguity, the pressure to appear certain when you're not."),
      React.createElement(P, { last: true }, "The goal isn't necessarily to make you work less (though that might happen). ", React.createElement(Strong, null, "The goal is to change your relationship to the work so it costs less."), " Sometimes that means structural changes. Sometimes something shifts internally and the same role becomes sustainable. The work helps clarify which.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "The first session is ", React.createElement(Strong, null, "60 minutes, free, and exploratory"), ". We figure out what's underneath the exhaustion and whether therapy is the right approach."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),

    React.createElement('hr', { style: sepStyle }),

    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: "Why doesn't rest fix my burnout?" },
          React.createElement(P, { last: true }, "Usually because the exhaustion isn't caused by hours worked. It's caused by the emotional weight of the work: chronic responsibility, identity tied to performance, and the difficulty of stopping without feeling like you're failing. Rest addresses the symptom. Therapy addresses the structure underneath.")
        ),
        React.createElement(FaqItem, { q: 'Is burnout a mental health condition?' },
          React.createElement(P, { last: true }, "The WHO classifies it as an occupational phenomenon rather than a medical diagnosis. In practice, it often coexists with anxiety and depression. At senior levels, it tends to reveal longer-running patterns around identity, control, and self-worth that therapy is well suited to address.")
        ),
        React.createElement(FaqItem, { q: "How do I know if I'm burned out or just tired?" },
          React.createElement(P, { last: true }, "Tiredness resolves with rest. Burnout doesn't. If you've taken time off and come back feeling the same way, the exhaustion is probably structural. Other signals: cynicism about work you used to care about, emotional flatness, difficulty engaging with decisions that aren't urgent.")
        ),
        React.createElement(FaqItem, { q: 'Can I do this while still in the job?' },
          React.createElement(P, { last: true }, "Yes, and that's usually what happens. The point isn't to quit. It's to understand ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, "what's creating the problem"), " and change your relationship to the work so the cost comes down.")
        ),
        React.createElement(FaqItem, { q: "I've tried regular coaching, meditation, and boundary-setting. Why didn't they work?" },
          React.createElement(P, { last: true }, "Because they operate at the surface. If the burnout is driven by a deeper pattern, like identity fusion with output or ", React.createElement(A, { href: 'https://www.undisguised.io/p/why-hard-work-alone-doesnt-advance' }, 'the belief that hard work should be enough on its own'), ", managing symptoms doesn't change the source.")
        )
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free, 60 minutes, no obligations. We figure out what's going on and whether this is the right approach."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),
    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

// ─── CAREER TRANSITION ───────────────────────────────────────────────────────
function CareerTransitionPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : pageStyle;
  const mobSection = mob ? { display: 'block', marginBottom: '2rem' } : sectionStyle;
  const mobH2 = mob ? { ...h2Style, paddingBottom: '.4rem', display: 'block' } : h2Style;
  const mobH1 = mob ? { ...h1Style, fontSize: '20px' } : h1Style;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } },
      'The next role isn\u2019t the hard part. Figuring out who you are without this one is.'
    ),

    React.createElement(Section, { label: 'The real transition', mob },
      React.createElement(P, null, "You've spent years building a career that defines how people see you and, more importantly, how you see yourself. Now something is shifting. Maybe you're thinking about leaving. Maybe you were pushed out. Maybe you already made the move and ", React.createElement(Strong, null, "expected relief but got disorientation instead"), "."),
      React.createElement(P, null, "The strategic questions — what industry, what role, what compensation — are usually the easier part. The harder question is the one most people around you aren't equipped to help with: ", React.createElement(Strong, null, "who are you when the title, the team, and the daily structure that organised your sense of self are gone?")),
      React.createElement(P, { last: true }, React.createElement(A, { href: 'https://www.undisguised.io/p/youre-just-trading-one-type-of-friction' }, 'A lot of people assume the grass is greener on the other side of the corporate/startup divide.'), " They trade one set of difficulties for another and wonder why the relief didn't last. Usually the problem wasn't the specific job. It was the relationship to work itself, and that comes with you.")
    ),

    React.createElement(Section, { label: 'What makes this hard', mob },
      React.createElement(P, null, "At senior levels, your career isn't just what you do. ", React.createElement(Strong, null, "It's the structure that holds a lot of your identity together."), " Your social world, your daily rhythm, your sense of competence — these are all built around the role. When that structure changes, everything it was quietly holding in place starts to shift too."),
      React.createElement(P, null, "If you were laid off, the experience often produces a grief response you didn't expect, because it's not just about the job. It's about the version of yourself that existed inside it. If you're choosing to leave, the paralysis usually isn't about the options. ", React.createElement(A, { href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting' }, 'The doubt is protecting you from something'), ", usually the fear of what you'll find on the other side."),
      React.createElement(P, { last: true }, "And if you already made the move and feel lost rather than free, that's not a failure. It's the predictable result of removing a structure without understanding what it was compensating for.")
    ),

    React.createElement(Section, { label: 'Why a therapist, not a career coach', mob },
      React.createElement(P, null, "Career coaching helps you figure out what to do next. ", React.createElement(Strong, null, "Therapeutically-informed coaching helps you understand why you're stuck"), ", what the transition is actually about at a deeper level, and what needs to shift internally for any external change to hold."),
      React.createElement(P, null, "Without that internal work, people tend to recreate the same patterns in new settings. ", React.createElement(A, { href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem' }, 'They end up building the same problem in a different context.'), ""),
      React.createElement(P, { last: true }, "I'm a licensed psychotherapist who made this kind of transition myself — from 18+ years in B2B SaaS and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'growth advisory'), " to clinical practice. I know what it's like to leave an identity that works, and I know the difference between doing that reactively and doing it with some clarity about what's actually driving the change.")
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, React.createElement(Strong, null, "Senior professionals considering a major career change"), " but paralysed by the decision. Executives who were laid off and are dealing with more than just the job search. Leaders who made the move and feel more lost than free. People who ", React.createElement(Strong, null, "keep almost leaving but pull back every time"), ". Anyone at a senior level who suspects the career question is really a question about identity, worth, and what they want from the next phase of their working life.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "The first session is ", React.createElement(Strong, null, "60 minutes, free, and open"), ". We figure out what's actually driving the transition (or the resistance to it) and whether therapy is the right kind of support for this moment."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),

    React.createElement('hr', { style: sepStyle }),

    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement('div', null,
        React.createElement(FaqItem, { q: 'Why would I need a therapist for career transition coaching?' },
          React.createElement(P, { last: true }, "Because at senior levels, a career change disrupts your identity, your social world, and your sense of competence — not just your job. The strategic part is rarely the real difficulty. The harder part is figuring out who you are when the structure that organised your life is gone.")
        ),
        React.createElement(FaqItem, { q: "I can't decide whether to leave. Can therapy help with that?" },
          React.createElement(P, { last: true }, "Usually, yes. The indecision almost never comes from lack of information. The block tends to come from what the decision represents: loss of identity, fear of regret, the distance between what you actually want and what you think you should want. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Endless deliberation has its own cost'), ", and therapy works with the internal conflict that's making the decision feel impossible.")
        ),
        React.createElement(FaqItem, { q: 'How is this different from career coaching?' },
          React.createElement(P, { last: true }, "Regular career coaching works on what to do next. Therapeutically-informed coaching works on why you're stuck and what needs to shift internally for any external change to actually hold. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility' }, 'A lot of what gets called career coaching'), " actually needs therapeutic depth to address properly.")
        ),
        React.createElement(FaqItem, { q: 'I was laid off and I feel lost. Is that normal?' },
          React.createElement(P, { last: true }, "Very. Involuntary exits at senior levels produce genuine grief, not just about the job but about the identity and daily structure it provided. Most people around you won\u2019t fully understand that because they see it as \u201cjust a job.\u201d Therapy gives you a space to process the loss before rushing into whatever comes next.")
        ),
        React.createElement(FaqItem, { q: 'I already made the move and feel worse. What happened?' },
          React.createElement(P, { last: true }, "You probably removed the structure without fully understanding what it was compensating for. The old role was quietly holding things in place: your sense of purpose, your daily identity, your social connections. Without it, those gaps become visible. That's not a sign you made the wrong choice. It's a sign there's deeper work to do — and now you have the space for it.")
        )
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "The first session is free, 60 minutes, no obligations. We use it to understand where you actually are and what kind of support makes sense right now."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Free%2060-minute%20session', style: ctaBtn }, 'Get in touch for a free session')
      )
    ),
    React.createElement('footer', { style: footerStyle }, '© Aggelos Mouzakitis')
  );
}

Object.assign(window, { HomePage, SpecialtyPage });
