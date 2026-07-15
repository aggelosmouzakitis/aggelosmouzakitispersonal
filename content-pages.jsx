// content-pages.jsx — Home + all specialty pages

// Shared styles — light theme #FFFFFF bg, #282726 text
const C = {
  text: '#282726',
  muted: '#666',
  accent: '#1a7f37',
  border: 'rgba(40,39,38,0.12)',
  sepBorder: 'rgba(40,39,38,0.2)',
};
const pageStyle = {
  maxWidth: 740, margin: '0 auto', padding: '4rem 2rem 7rem',
  fontFamily: 'inherit', color: C.text,
};
// Wider canvas for pages that carry visual blocks (cards, aligned tables) in the
// right-hand content column — gives the Section content room so nothing is squeezed.
const widePageStyle = { ...pageStyle, maxWidth: 940 };
const h1Style = { fontSize: '32px', fontWeight: 400, lineHeight: 1.4, color: C.text, marginBottom: '2.5rem', letterSpacing: '-.02em' };
const h2Style = { fontSize: '17px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted, paddingTop: '.25rem', lineHeight: 1.5, textWrap: 'balance' };
const h3Style = { fontSize: '18px', fontWeight: 400, lineHeight: 1.7, color: C.text, marginBottom: '.6rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '.4rem' };
const sectionStyle = { display: 'grid', gridTemplateColumns: '184px 1fr', gap: '0 2.25rem', marginBottom: '3rem' };
const pStyle = { marginBottom: '1.4rem', lineHeight: 1.75, fontSize: '18px', color: C.text };
const leadStyle = { marginBottom: '1.4rem', lineHeight: 1.6, fontSize: '23px', fontWeight: 500, letterSpacing: '-.01em', color: C.text };
const sepStyle = { border: 'none', borderTop: `1px solid ${C.sepBorder}`, margin: '2.5rem 0' };
const ctaBtn = {
  fontFamily: 'inherit', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase',
  color: '#FFFFFF', background: '#282726', border: '1px solid #282726',
  textDecoration: 'none', padding: '.8rem 1.5rem', display: 'inline-block',
  cursor: 'pointer', transition: 'background .15s, color .15s',
};
const footerStyle = { marginTop: '3rem', fontSize: '14px', color: C.muted };
const sectionTitleStyle = { fontSize: '22px', fontWeight: 700, letterSpacing: '-.01em', color: C.accent, marginBottom: '1.2rem', lineHeight: 1.3 };
const homeStyle = { maxWidth: 1100, margin: '0 auto', padding: '4rem 2.5rem 7rem', fontFamily: 'inherit', color: C.text };
const homeStyleMobile = { ...homeStyle, padding: '2rem 1.25rem 5rem' };
const greenLink = { color: C.accent, textUnderlineOffset: '3px', textDecorationThickness: '1px' };
const srOnly = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 };


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
function IA({ href, children }) {
  return React.createElement('a', { href, style: greenLink }, children);
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

function Testimonial({ quote, who }) {
  return React.createElement('blockquote', { style: { margin: '0 0 1.6rem', padding: '0 0 0 1rem', borderLeft: '2px solid rgba(26,127,55,0.35)' } },
    React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.8, color: '#282726', marginBottom: '.5rem' } }, '\u201C' + quote + '\u201D'),
    React.createElement('footer', { style: { fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, who)
  );
}
function Testimonials({ items, mob, label }) {
  return React.createElement(Section, { label: label || 'What clients say', mob },
    items.map(function (t, i) { return React.createElement(Testimonial, { key: i, quote: t.q, who: t.w }); }),
    React.createElement('p', { style: { marginBottom: 0, marginTop: '.4rem' } },
      React.createElement('a', { href: '/reviews/', style: greenLink }, 'Read more client reflections \u2192'))
  );
}

// \u2500\u2500\u2500 SITE FOOTER (shared across all pages) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const FOOTER_COLS = [
  { label: 'Work with me', links: [
    { href: '/founders/', label: 'For founders' },
    { href: '/solopreneurs/', label: 'For solopreneurs' },
    { href: '/how-i-work/', label: 'How I work' },
    { href: '/book/', label: 'Book a fit call' },
  ] },
  { label: 'Greek-speaking therapy', links: [
    { href: '/greek-speaking-therapist-london/', label: 'London' },
    { href: '/greek-speaking-therapist-manchester/', label: 'Manchester' },
    { href: '/greek-speaking-therapist-new-york/', label: 'New York' },
    { href: '/greek-speaking-therapist-dublin/', label: 'Dublin' },
  ] },
  { label: 'Site', links: [
    { href: '/', label: 'Home' },
    { href: '/blog/', label: 'Writing' },
    { href: '/ask-me-anything/', label: 'Ask me anything' },
    { href: '/confidentiality/', label: 'Confidentiality' },
    { href: '/getinterviewed/', label: 'Get interviewed' },
  ] },
  { label: 'Elsewhere', links: [
    { href: 'https://linkedin.com/in/growth-product-manager/', label: 'LinkedIn', ext: true },
    { href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA', label: 'YouTube', ext: true },
  ] },
];
function SiteFooter({ mob }) {
  const wrap = { marginTop: mob ? '3.5rem' : '5rem', paddingTop: mob ? '2.5rem' : '3.25rem', borderTop: `1px solid ${C.sepBorder}` };
  const cols = { display: mob ? 'block' : 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' };
  const colLabel = { fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.accent, marginBottom: '1.1rem' };
  const linkStyle = { display: 'inline-flex', alignItems: 'baseline', gap: '.35rem', fontSize: '15px', color: C.text, textDecoration: 'none', lineHeight: 1.4, transition: 'color .12s' };
  const mutedStyle = { fontSize: '15px', color: '#aaa', lineHeight: 1.4, cursor: 'default' };
  const row = { marginBottom: '.75rem' };
  function fLink(l) {
    if (l.muted) return React.createElement('div', { style: row, key: l.label }, React.createElement('span', { style: mutedStyle }, l.label));
    const extra = l.ext ? { target: '_blank', rel: 'noopener' } : {};
    return React.createElement('div', { style: row, key: l.label },
      React.createElement('a', {
        href: l.href, ...extra, style: linkStyle,
        onMouseEnter: e => e.currentTarget.style.color = C.accent,
        onMouseLeave: e => e.currentTarget.style.color = C.text,
      }, l.label, l.ext ? React.createElement('span', { style: { fontSize: '11px', opacity: .5 } }, '\u2197') : null)
    );
  }
  return React.createElement('footer', { style: wrap },
    React.createElement('div', { style: cols },
      FOOTER_COLS.map(function (col) {
        return React.createElement('div', { key: col.label, style: { marginBottom: mob ? '2rem' : 0 } },
          React.createElement('div', { style: colLabel }, col.label),
          col.links.map(fLink)
        );
      })
    ),
    React.createElement('div', { style: { marginTop: mob ? '1rem' : '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}`, fontSize: '13px', color: C.muted } },
      '\u00a9 Aggelos Mouzakitis \u00b7 Advisor \u00b7 Psychotherapist'
    )
  );
}

// ─── START HERE ──────────────────────────────────────────────────────────────
const START_HERE_ITEMS = [
  { label: 'For founders →', href: '/founders/' },
  { label: 'For solopreneurs →', href: '/solopreneurs/' },
];
function StartHere({ mob }) {
  const rowStyle = (first) => ({
    display: 'flex', alignItems: 'baseline', gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none', color: C.text, transition: 'color .15s',
  });
  return React.createElement('div', { style: { marginTop: mob ? '2.5rem' : '3.5rem' } },
    React.createElement('h2', { style: { ...sectionTitleStyle, fontSize: mob ? '19px' : '22px' } }, 'Start Here'),
    START_HERE_ITEMS.map(function (item, i) {
      return React.createElement('a', {
        key: item.href,
        href: item.href,
        className: 'hv-row',
        style: rowStyle(i === 0),
        onMouseEnter: e => e.currentTarget.style.color = C.accent,
        onMouseLeave: e => e.currentTarget.style.color = C.text,
      },
        React.createElement('span', { style: { fontSize: mob ? '16px' : '18px', fontWeight: 600 } }, item.label)
      );
    })
  );
}

// ─── LATEST WRITING ──────────────────────────────────────────────────────────
function LatestWriting({ mob }) {
  const [posts, setPosts] = React.useState(null);
  React.useEffect(() => {
    fetch('/blog/posts.json').then(r => r.json()).then(setPosts).catch(() => setPosts([]));
  }, []);
  const items = posts ? posts.slice(0, 9) : [];
  const rowStyle = (first) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none', color: C.text, transition: 'color .15s',
  });
  return React.createElement('div', { style: { marginTop: mob ? '2.5rem' : '3.5rem' } },
    React.createElement('h2', { style: { ...sectionTitleStyle, fontSize: mob ? '19px' : '22px' } }, 'Latest Writing'),
    posts === null && React.createElement('p', { style: { fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, 'Loading…'),
    posts && posts.length === 0 && React.createElement('p', { style: { fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' } }, 'No posts yet.'),
    items.length > 0 && React.createElement(React.Fragment, null,
      items.map(function (p, i) {
        return React.createElement('a', {
          key: p.slug,
          href: `/blog/${p.slug}/`,
          className: 'hv-row',
          style: rowStyle(i === 0),
          onMouseEnter: e => e.currentTarget.style.color = C.accent,
          onMouseLeave: e => e.currentTarget.style.color = C.text,
        },
          React.createElement('span', { style: { fontSize: mob ? '16px' : '18px', fontWeight: 600 } }, p.title),
          React.createElement('span', { style: { fontSize: '14px', color: '#767676', whiteSpace: 'nowrap', flexShrink: 0 } }, p.date)
        );
      }),
      React.createElement('div', { style: { textAlign: 'right', marginTop: '1.2rem', fontSize: '14px' } },
        React.createElement(IA, { href: '/blog/' }, 'See all →')
      )
    )
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const mob = useIsMobile();
  const mainStyle = mob ? homeStyleMobile : homeStyle;
  const introRowStyle = mob
    ? { display: 'flex', flexDirection: 'column', gap: '1.75rem' }
    : { display: 'flex', gap: '4rem', alignItems: 'center' };
  const introTextStyle = mob ? { width: '100%' } : { flex: '1.15 1 0', minWidth: 0, maxWidth: 520 };
  const introImgWrapStyle = mob ? { width: '100%' } : { flex: '1 1 0', minWidth: 0 };
  const introImgStyle = {
    width: '100%', aspectRatio: mob ? '16 / 10' : '4 / 5',
    objectFit: 'cover', borderRadius: '14px', display: 'block',
  };

  return React.createElement('main', { style: mainStyle },
    React.createElement('h1', { style: srOnly }, 'Aggelos Mouzakitis — Advisor & Licensed Psychotherapist for Tech Founders & Solopreneurs'),

    React.createElement('div', { style: introRowStyle },
      React.createElement('div', { style: introTextStyle },
        React.createElement('p', { style: leadStyle }, "Hey, I’m Aggelos. I’m a licensed psychotherapist and before this I spent 18 years (still counting) in tech, in product and growth, building companies and advising more than 500 of them."),
        React.createElement(P, null,
          "These days I work privately with a small number of tech ",
          React.createElement(IA, { href: '/founders/' }, 'founders'),
          " and ", React.createElement(IA, { href: '/solopreneurs/' }, 'solopreneurs'),
          ", and it’s usually about ",
          React.createElement(Strong, null, "a business that has its roots in something inside you"),
          ". It might be a decision you keep circling, or something you keep avoiding, or a kind of pressure that never really switches off. ",
          React.createElement(Strong, null, "But one way or another, it prevents you from reaching your ideal state.")
        ),
        React.createElement(P, null, "The reason people come to me specifically is that they don’t have to explain their world to a therapist who has never shipped anything, and they don’t have to leave the personal stuff at the door for a coach who only wants the business version. I understand both sides at once, which is the whole point."),
        React.createElement(P, { last: true },
          "I write about all of this — founder psychology, burnout, overthinking — on my ", React.createElement(IA, { href: '/blog/' }, 'blog'),
          " and talk about it on my ", React.createElement(A, { href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA' }, 'YouTube channel'),
          ". If any of this sounds like you, you can read ",
          React.createElement(IA, { href: '/how-i-work/' }, 'how I work'),
          ", or just ", React.createElement(IA, { href: 'mailto:aggelos.mouzakitis@gmail.com?subject=Getting%20in%20touch' }, 'get in touch'), "."
        )
      ),
      React.createElement('div', { style: introImgWrapStyle },
        React.createElement('img', {
          src: 'https://aggelosmouzakitis.com/img/aggelos-homepage.webp',
          alt: 'Aggelos Mouzakitis speaking on stage',
          loading: 'eager',
          fetchPriority: 'high',
          decoding: 'async',
          style: introImgStyle,
        }),
        React.createElement('div', { style: { display: mob ? 'none' : 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', paddingRight: '26px' } },
          React.createElement('span', { style: { fontFamily: "'Segoe Script','Bradley Hand','Comic Sans MS',cursive", fontStyle: 'italic', fontSize: '16px', color: C.accent, transform: 'rotate(-3deg)', whiteSpace: 'nowrap', alignSelf: 'flex-end' } }, 'Friendlier than I look'),
          React.createElement('svg', { width: 44, height: 40, viewBox: '0 0 44 40', fill: 'none', stroke: C.accent, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', style: { marginBottom: '2px' } },
            React.createElement('path', { d: 'M40 3 C 44 20, 33 30, 6 30' }),
            React.createElement('path', { d: 'M15 24 L5 30 L14 36' })
          )
        )
      )
    ),

    React.createElement(StartHere, { mob }),
    React.createElement(LatestWriting, { mob }),

    React.createElement(SiteFooter, { mob })
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
    'founders': ForFoundersPage,
    'solopreneurs': SolopreneursPage,
    'how-i-work': HowIWorkPage,
    'book': BookPage,
    'greek-therapist-london': LondonPage,
    'greek-therapist-manchester': ManchesterPage,
    'greek-therapist-new-york': NewYorkPage,
    'greek-therapist-dublin': DublinPage,
    'confidentiality': ConfidentialityPage,
  };
  const Component = pages[pageId];
  return Component ? React.createElement(Component) : null;
}

// ─── PERSONA PAGE SHARED BLOCKS (identical across /founders/, /solopreneurs/, ...) ──
function PersonaWorkSection({ mob }) {
  return React.createElement(Section, { label: 'So what we actually do', mob },
    React.createElement(P, null, "We talk it through openly. Most of the time I get what's going on fairly quickly, not because I'm Freud, but because I've sat in your seat more than once and I know the terrain."),
    React.createElement(P, null, "The work runs on two tracks at the same time:"),
    React.createElement('div', { style: { margin: '0 0 1.2rem' } },
      React.createElement(TrackCards, { mob, tracks: [
        { title: 'The inner track', body: "See the pattern and where it comes from, then rewire it. Awareness is the first step but not enough on its own, because you don't talk yourself out of something your history spent years building. That takes more than conversation. Sometimes deeper trauma techniques, sometimes behavioural exercises that get you doing the thing you avoid." },
        { title: 'The business track', body: "The decision in front of you, the move you need to make, the plan for where you're going. Real, practical and strategic." },
      ] })
    ),
    React.createElement(P, { last: true }, "One without the other doesn't hold. Fixing the inside while the company drifts is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it.")
  );
}
function PersonaTherapyOrCoachingSection({ mob }) {
  return React.createElement(Section, { label: 'Is this therapy or coaching?', mob },
    React.createElement(P, null, "Neither, cleanly."),
    React.createElement(P, null, "Therapy? Not by the protocol. I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is supposed to keep. But it's therapy-informed — I'm a licensed psychotherapist — and that training is why I can see what's underneath."),
    React.createElement(P, null, "Coaching? Not that either. No framework I'll hand you to follow. There are coaching elements in how we work on decisions, but the framework was never the point."),
    React.createElement(P, { last: true }, "The honest description: a trusted advisor who's sat in your seat and has the expertise to help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. For a lot of founders it's the one place they can be themselves, not the version they perform for the team, the investors, the cofounder or the partner.")
  );
}
function PersonaHowWeStartSection({ mob }) {
  return React.createElement(Section, { label: 'How we start', mob },
    React.createElement(StepCards, { mob, steps: [
      { n: '1', title: 'Fit call', tag: '~15 min · free', body: "Not a session, just to see if we click or if you can't stand me. Both fine." },
      { n: '2', title: 'Paid session', tag: 'one session', body: "You bring the problem as you see it. We find the one underneath. You leave with a clear read and one real move. Worth it even if we stop there." },
      { n: '3', title: 'Ongoing', tag: "if it's worth it", body: "Private, one to one, for as long as it's genuinely useful. Not a session longer." },
    ] }),
    React.createElement('div', { style: { marginTop: '1.4rem' } },
      React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
    )
  );
}
function PatternList({ items }) {
  const mob = useIsMobile();
  return React.createElement('div', { style: { ...cardBase, overflow: 'hidden', margin: '.4rem 0 1.4rem' } },
    items.map(function (it, i) {
      if (mob) {
        return React.createElement('div', {
          key: i, className: 'hv-row',
          style: { padding: '.8rem 1rem', borderTop: i ? `1px solid ${C.border}` : 'none', fontSize: '15px', lineHeight: 1.55 }
        },
          React.createElement('div', { style: { fontWeight: 700, color: C.text, marginBottom: '.15rem' } }, it.cause),
          React.createElement('div', { style: { color: C.text } },
            React.createElement('span', { style: { color: C.accent, fontWeight: 700, marginRight: '.4rem' } }, '→'), it.effect
          )
        );
      }
      return React.createElement('div', {
        key: i, className: 'hv-row',
        style: { display: 'grid', gridTemplateColumns: '246px 26px 1fr', alignItems: 'baseline', padding: '.95rem 1.3rem', borderTop: i ? `1px solid ${C.border}` : 'none', fontSize: '15px', lineHeight: 1.55 }
      },
        React.createElement('span', { style: { fontWeight: 700, color: C.text } }, it.cause),
        React.createElement('span', { style: { color: C.accent, fontWeight: 700, textAlign: 'center' } }, '→'),
        React.createElement('span', { style: { color: C.text } }, it.effect)
      );
    })
  );
}

// ─── FOR FOUNDERS ────────────────────────────────────────────────────────────
function ForFoundersPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } }, 'Founder advisory for business problems that trace back to you'),

    React.createElement(Section, { label: 'What you came here for', mob },
      React.createElement(P, null, "You came here about something either business-related that gives you stress, activates inner criticism or prevents you from reaching your goals."),
      React.createElement(P, { last: true }, "If you're reading this instead of booking another consultant, part of you already suspects it isn't necessarily a strategy problem. You'd give someone else in your position the right advice without blinking, and you still don't do it yourself. That gap is the tell, and there's usually a reason you're ready to ask for some help now, this month, and not before.")
    ),

    React.createElement(Section, { label: 'What it usually turns out to be', mob },
      React.createElement(P, null, "Most of the time it traces back to a pattern in you. Usually not the one you assume and definitely not the one ChatGPT suggested."),
      React.createElement(P, null,
        "Some founders name the wrong cause entirely, such as calling the procrastination laziness or the burnout overwork. Others have a sharp, honest read on it but still don't know how to get rid of it. Knowing the pattern and being free of it are different jobs. ",
        React.createElement(A, { href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/' }, "The same brain that built it can't reason its way out of it"),
        ", however smart you are."
      ),
      React.createElement(P, null, "And it doesn't stay only with you, of course, but gets spilled one way or another into your business:"),
      React.createElement(PatternList, { items: [
        { cause: 'You avoid discomfort', effect: 'sales, hiring, firing, pricing and fundraising all keep sliding' },
        { cause: 'You need control', effect: 'nothing scales past you' },
        { cause: 'You need to be liked', effect: 'the team stays pleasant and a little weak' },
        { cause: "You can't sit with uncertainty", effect: 'strategy turns slow, reactive, over-validated' },
        { cause: 'Your worth is fused to output', effect: "burnout becomes the company's normal speed" },
        { cause: "You're scared of being exposed", effect: 'metrics, feedback and bad news start to feel like threats' },
        { cause: 'You feel alone at the top', effect: React.createElement(A, { href: '/blog/the-loneliness-and-emotional-pressure-that-founders-experience/' }, "you lose your read on what's real") },
      ] }),
      React.createElement('div', { style: { marginTop: '1.2rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(PersonaWorkSection, { mob }),
    React.createElement(PersonaTherapyOrCoachingSection, { mob }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'A real example', mob },
      React.createElement(P, null, "A founder came in having lost his motivation. He'd built the company, stopped caring about it, and wanted the drive back. He felt like a failure, was quietly planning his escape, and his marriage was strained because the obsessiveness and the hours had been bleeding into home."),
      React.createElement(P, { last: true },
        "We didn't chase the motivation. We worked through the low period so he could think again, then got underneath it, to where the failure feeling came from and why the drive had drained out. Once that was clear, the business decisions stopped feeling impossible. We built a plan for the next chapter, including a clean exit, and he did the work at home. He didn't need more motivation. He needed to understand ",
        React.createElement(A, { href: '/blog/what-lost-purpose-actually-means-for-many-high-performers/' }, 'what had happened to it'), "."
      )
    ),

    React.createElement(Testimonials, { mob, label: 'What founders say', items: [
      { q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my team. I don't have to translate one world into the other.", w: 'Anonymous, founder' },
      { q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.", w: 'Anonymous, founder' },
      { q: "I didn't want someone telling me to work less or be less ambitious. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.", w: 'Anonymous, founder' },
    ] }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, null, "Startup and tech founders, ideally in Europe, the US or Canada, mostly for timezones."),
      React.createElement(P, { last: true }, "I work with a few people at a time and care more about fit than volume. Not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the company actually needs. It runs both ways, with rights and obligations on both sides.")
    ),

    React.createElement(PersonaHowWeStartSection, { mob }),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── FOR SOLOPRENEURS ────────────────────────────────────────────────────────
function SolopreneursPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '3rem', fontSize: mob ? '20px' : '28px' } }, 'Solopreneur advisory for business problems that trace back to you'),

    React.createElement(Section, { label: 'What you came here for', mob },
      React.createElement(P, null, "You came here about your one-person business. Typical things I've heard so far include things you avoid, things you are overthinking, things you are afraid of, lack of focus, procrastination and more. The common thread is that they start inside you but get spilled into your business."),
      React.createElement(P, { last: true },
        "If you're reading this instead of buying another course or joining another community, part of you already suspects you ",
        React.createElement(Strong, null, "might not need tactical advice only"),
        ". You'd tell someone else in your position exactly what to do without blinking, and you still don't do it. That tells it all. And there's usually a reason it came up now, this month, and not before."
      )
    ),

    React.createElement(Section, { label: 'What it usually turns out to be', mob },
      React.createElement(P, null, "In lots of cases it traces back to a pattern in you, and usually not the one you assume nor the one ChatGPT eloquently tells you."),
      React.createElement(P, null,
        "Some people name the wrong cause completely. Others have a sharp, honest read on it and still can't shift it. Knowing the pattern and being free of it are different jobs. ",
        React.createElement(A, { href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/' }, "The same brain that built it can't reason its way out"),
        ", however smart you are."
      ),
      React.createElement(P, null, "Unfortunately, when you work alone, such patterns run straight into the business:"),
      React.createElement(PatternList, { items: [
        { cause: 'You avoid being seen', effect: 'no content, no outbound, no clear opinion, weak demand' },
        { cause: "You're uncomfortable charging", effect: 'you undercharge, then resent the work' },
        { cause: 'You need to be liked', effect: 'bad clients get in, scope creeps, boundaries go' },
        { cause: "You don't trust your own read", effect: 'you keep switching niche, offer, direction' },
        { cause: "A 'no' feels personal", effect: 'so you keep postponing exposure' },
        { cause: "You're in your own head all day", effect: 'decisions go in circles and the drift builds up quietly' },
        { cause: 'You confuse thinking with doing', effect: React.createElement(A, { href: '/blog/the-high-cost-of-endless-pondering/' }, 'lots of refining, almost no selling') },
      ] }),
      React.createElement('div', { style: { marginTop: '1.2rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'So what we actually do', mob },
      React.createElement(P, null, "We talk it through openly. Most of the time I get what's going on fairly quickly, not because I'm Carl Jung, but because I've done the job-to-solo-and-back journey myself more than once, including building this practice right now, and I know the terrain. And in 2026, I am telling you, it's brutal, both practically and emotionally."),
      React.createElement(P, null, "The work runs on two tracks at the same time:"),
      React.createElement('div', { style: { margin: '0 0 1.2rem' } },
        React.createElement(TrackCards, { mob, tracks: [
          { title: 'The inner track', body: "See the pattern and where it comes from, then rewire it. Awareness is the first step but not enough on its own, because you don't talk yourself out of something your history spent years building. That takes more than conversation: sometimes deeper techniques, sometimes behavioural exercises that get you doing the thing you avoid, like actually sending the outreach or holding the price." },
          { title: 'The business track', body: "The decision in front of you, the offer, the pricing, the move you need to make, the plan for where you're going. Real, practical, strategic." },
        ] })
      ),
      React.createElement(P, { last: true }, "One without the other doesn't hold. Fixing the inside while the pipeline dries up is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it.")
    ),
    React.createElement(Section, { label: 'Is this therapy or coaching?', mob },
      React.createElement(P, null, "Neither, cleanly."),
      React.createElement(P, null, "Therapy? Not by the protocol. I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is supposed to keep. But it's therapy-informed — I'm a licensed psychotherapist — and that training is why I can see what's underneath."),
      React.createElement(P, null, "Coaching? Not that either. No framework I'll hand you to follow. There are coaching elements in how we work on decisions and pricing and positioning, but the framework was never the point."),
      React.createElement(P, { last: true }, "The honest description: a trusted advisor who's built his own thing and has the expertise to help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. When you work alone, this is often the one place you get an honest mirror, and the one place you can be yourself, not the version you perform for clients, your audience or your partner.")
    ),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'A real example', mob },
      React.createElement(P, null, "Someone came to me running his own consultancy. He was doing well, but it didn't feel that way to him. He asked how to grow the business, and underneath that he was worried he wasn't successful enough, stuck doing all the execution himself, running on fight or flight with clients and taking every bit of criticism badly."),
      React.createElement(P, null,
        "All that stress had piled into one conclusion: that he wasn't cut out to run a business at all. That was false, but it's a normal place to land when you spend long enough powering through your own resentment. Most of it traced back to ",
        React.createElement(A, { href: '/blog/the-parent-archetypes-creating-high-performers-with-chronic-self-doubt/' }, 'older family patterns that were still running'),
        ", the same ones showing up in his marriage. The business problems were almost a copy of what he was dealing with in himself."
      ),
      React.createElement(P, { last: true }, "Over about six months that turned around. He got his confidence back, started doing things he'd written off as not for him, and grew the business by focusing on the parts he liked and outsourcing the rest. He worked on those patterns everywhere they showed up, not just at work. He didn't need a growth tactic. He needed to stop treating an old story about himself as fact.")
    ),

    React.createElement(Testimonials, { mob, label: 'What clients say', items: [
      { q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my business. I don't have to translate one world into the other.", w: 'Anonymous, solopreneur' },
      { q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.", w: 'Anonymous, solopreneur' },
      { q: "I didn't want someone telling me to lower my standards or want less. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.", w: 'Anonymous, solopreneur' },
    ] }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, null, "Solopreneurs, independent consultants and freelancers in tech, ideally in Europe, the US or Canada, mostly for timezones."),
      React.createElement(P, { last: true }, "I work with a few people at a time and care more about fit than volume. I'm not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the business actually needs. It runs both ways, with rights and obligations on both sides.")
    ),

    React.createElement(PersonaHowWeStartSection, { mob }),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── HOW I WORK ──────────────────────────────────────────────────────────────
// ─── SHARED VISUAL BLOCKS (numbered step cards + two-track cards) ─────────────
const cardBase = { border: `1px solid ${C.border}`, borderRadius: '12px', background: '#FFFFFF' };
function Kicker({ children }) {
  return React.createElement('h2', {
    style: { fontSize: '17px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted, margin: '0 0 1.2rem', lineHeight: 1.5, textWrap: 'balance' }
  }, children);
}
function StepCards({ mob, steps }) {
  return React.createElement('div', { style: { display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)', gap: mob ? '.9rem' : '1rem', alignItems: 'stretch' } },
    steps.map(function (s, i) {
      return React.createElement('div', {
        key: i, className: 'hv-card',
        style: { ...cardBase, padding: mob ? '1.15rem 1.15rem 1.25rem' : '1.35rem 1.3rem 1.45rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '.65rem' } },
          React.createElement('span', { style: { width: '30px', height: '30px', flexShrink: 0, borderRadius: '50%', background: C.accent, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, lineHeight: 1 } }, s.n),
          React.createElement('span', { style: { fontSize: '17px', fontWeight: 700, color: C.text } }, s.title)
        ),
        s.tag && React.createElement('span', { style: { alignSelf: 'flex-start', fontSize: '11px', letterSpacing: '.05em', textTransform: 'uppercase', color: C.accent, background: 'rgba(26,127,55,0.08)', border: '1px solid rgba(26,127,55,0.25)', borderRadius: '999px', padding: '.2rem .65rem' } }, s.tag),
        React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.text, margin: 0 } }, s.body)
      );
    })
  );
}
function TrackCards({ mob, tracks }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: mob ? 'column' : 'row', gap: mob ? '.9rem' : '1rem', alignItems: 'stretch' } },
    tracks.map(function (t, i) {
      return React.createElement('div', { key: i, className: 'hv-card', style: { ...cardBase, padding: mob ? '1.15rem' : '1.35rem', flex: 1 } },
        React.createElement('h3', { style: { fontSize: '17px', fontWeight: 700, color: C.text, margin: '0 0 .5rem' } }, t.title),
        React.createElement('p', { style: { fontSize: '15px', lineHeight: 1.65, color: C.text, margin: 0 } }, t.body)
      );
    })
  );
}

function HowIWorkPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1.1rem 5rem' } : widePageStyle;

  const kicker = (txt) => React.createElement(Kicker, null, txt);
  const block = { marginBottom: mob ? '2.75rem' : '3.5rem' };
  const note = (children, last) => React.createElement('p', {
    style: { fontSize: '16px', lineHeight: 1.7, color: C.muted, margin: last ? '1.1rem 0 0' : '1.1rem 0 .3rem' }
  }, children);

  const cadenceRow = (phase, rhythm, desc, first) => React.createElement('tr', { className: 'hv-row' },
    React.createElement('td', { style: { width: mob ? '38%' : '32%', verticalAlign: 'top', padding: mob ? '.85rem .8rem' : '1rem 1.2rem', borderTop: first ? 'none' : `1px solid ${C.border}`, fontSize: '16px', fontWeight: 700, color: C.text } }, phase),
    React.createElement('td', { style: { verticalAlign: 'top', padding: mob ? '.85rem .8rem' : '1rem 1.2rem', borderTop: first ? 'none' : `1px solid ${C.border}`, fontSize: '15px', lineHeight: 1.6, color: C.text } },
      React.createElement('span', { style: { color: C.accent, fontWeight: 700 } }, rhythm + '. '), desc
    )
  );

  const notLine = (txt) => React.createElement('li', { style: { display: 'flex', gap: '.7rem', alignItems: 'baseline', padding: '.55rem 0', fontSize: '16px', lineHeight: 1.55, color: C.text } },
    React.createElement('span', { style: { color: '#c0392b', fontWeight: 700, flexShrink: 0, fontSize: '15px' } }, '✕'),
    React.createElement('span', null, txt)
  );

  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.5rem', fontSize: mob ? '26px' : '32px' } }, 'How I work'),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3.5rem' } }, "It's a private advisory relationship, one to one, and it runs in three steps."),

    React.createElement('section', { style: block },
      kicker('The three steps'),
      React.createElement(StepCards, { mob, steps: [
        { n: '1', title: 'Fit call', tag: '~15 min · free', body: "We see if we click, or if you can't stand me. Not a session. Just so neither of us wastes the other's time." },
        { n: '2', title: 'Paid session', tag: 'one session', body: "You bring the problem the way you see it. We find the one that's actually brewing underneath it. You leave with a clear read and one real move, documented in a handover. Worth it even if we stop here." },
        { n: '3', title: 'Ongoing', tag: "if it's worth it", body: "Private, one to one, for as long as it's genuinely useful. Not a session longer." },
      ] }),
      note("Most people start at the fit call, but if you already know you want to work and just want to get going, you can skip straight to the paid session.", true)
    ),

    React.createElement('section', { style: block },
      kicker('What the ongoing work looks like'),
      React.createElement('p', { style: { fontSize: '16px', lineHeight: 1.7, color: C.text, margin: '0 0 1.1rem' } }, "If we continue, it runs on two tracks at the same time."),
      React.createElement(TrackCards, { mob, tracks: [
        { title: 'The inner track', body: "We find the pattern that's actually driving the problem, then work to rewire it. Awareness first, then the real change, which usually takes more than talking." },
        { title: 'The business track', body: "The decision in front of you, the move you need to make, the plan for where you're going. Practical and strategic." },
      ] }),
      note("In between sessions, I study our calls, we might monitor your biomarkers together, and I set exercises, diagnostics and measurement techniques so we have a benchmark in place."),
      note("One without the other doesn't hold, so we don't split them.", true)
    ),

    React.createElement('section', { style: block },
      kicker('Cadence'),
      React.createElement('div', { style: { ...cardBase, overflow: 'hidden' } },
        React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
          React.createElement('tbody', null,
            cadenceRow('First few months', 'Weekly', 'Builds momentum and trust. The work compounds instead of resetting every session.', true),
            cadenceRow('After that', 'Flexible', "Once the rhythm is there, we can space it out. It stays as long as it's useful to you.")
          )
        )
      ),
      note("Between sessions you can reach me when something real comes up. Not a 24/7 line, but you're not on your own until the next slot either.", true)
    ),

    React.createElement('section', { style: block },
      kicker('What it costs'),
      React.createElement('div', { className: 'hv-card', style: { border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: '10px', background: 'rgba(26,127,55,0.04)', padding: mob ? '1.15rem' : '1.35rem 1.5rem', fontSize: '16px', lineHeight: 1.7, color: C.text } },
        "I keep the number of clients small, so I can go deep with each one. I'll give you the specifics on the fit call. What I'll say here is this is ",
        React.createElement('span', { style: { fontWeight: 700 } }, 'premium, ongoing, and priced as a monthly engagement'),
        ", not by the hour."
      )
    ),

    React.createElement('section', { style: block },
      kicker('What this is not'),
      React.createElement('ul', { style: { listStyle: 'none', margin: '0 0 1.4rem', padding: 0 } },
        notLine("Not therapy by the protocol, though it's therapy-informed."),
        notLine("Not coaching with a framework, though it has coaching in it."),
        notLine("Not a course, not a program, not a plan I hand you and disappear.")
      ),
      React.createElement('div', { className: 'hv-card', style: { border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.accent}`, borderRadius: '10px', background: 'rgba(26,127,55,0.04)', padding: mob ? '1.15rem' : '1.35rem 1.5rem', fontSize: '16px', lineHeight: 1.7, color: C.text } },
        "It's a trusted advisory relationship with someone who's sat where you're sitting, cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face."
      ),
      React.createElement('div', { style: { marginTop: '1.6rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── BOOK A FIT CALL ─────────────────────────────────────────────────────────
function BookPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
  React.useEffect(function () {
    if (document.querySelector('script[src*="assets.calendly.com/assets/external/widget.js"]')) {
      if (window.Calendly && window.Calendly.initInlineWidgets) window.Calendly.initInlineWidgets();
      return;
    }
    var sc = document.createElement('script');
    sc.src = 'https://assets.calendly.com/assets/external/widget.js';
    sc.async = true;
    document.body.appendChild(sc);
  }, []);
  return React.createElement('main', { style: mobPage },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.75rem', fontSize: mob ? '20px' : '28px' } }, 'Book a fit call'),
    React.createElement('p', { style: { ...leadStyle, marginBottom: '1.4rem' } }, "Just a short, friendly call to understand what's going on, what you're looking for, and whether working together would actually make sense."),
    React.createElement(P, null, "If it does, I'll tell you what the next step looks like."),
    React.createElement(P, { last: true }, "If it doesn't, I'll tell you that too. Politely. Probably."),
    React.createElement('div', { style: { marginTop: mob ? '2.5rem' : '3.5rem' } }),
    React.createElement(Section, { label: 'How it usually works', mob },
      React.createElement(P, null, React.createElement(Strong, null, "1. Fit call."), " A short call to see if there's a fit."),
      React.createElement(P, null, React.createElement(Strong, null, "2. Paid session."), " We get into the actual thing. You bring the problem as you see it. We find the more accurate one underneath."),
      React.createElement(P, { last: true }, React.createElement(Strong, null, "3. Ongoing work."), " If it's useful, we continue. Private, one to one, for as long as it genuinely helps. Not a session longer.")
    ),
    React.createElement('h2', { style: { ...h2Style, color: C.accent, marginBottom: '1.2rem' } }, 'Book below'),
    React.createElement('div', {
      className: 'calendly-inline-widget',
      'data-url': 'https://calendly.com/aggelosmouzakitis/one-to-one',
      style: { minWidth: '320px', height: '700px', marginBottom: '2rem' }
    }),
    React.createElement(P, null,
      "Can't find a slot? Or prefer email because Calendly feels weirdly intimate for a calendar tool? Email me at ",
      React.createElement(IA, { href: 'mailto:aggelos.mouzakitis@gmail.com' }, 'aggelos.mouzakitis@gmail.com'), "."
    ),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'One small note', mob },
      React.createElement(P, null,
        "If you have a question but you don't want to start a working relationship, use the ",
        React.createElement(IA, { href: '/ask-me-anything/' }, 'Ask me anything'),
        " page instead. That's the better place for one-off questions."
      ),
      React.createElement(P, { last: true }, "This page is for people who are at least wondering whether they need someone in the room with them for a while.")
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── THERAPY FOR EXECUTIVES ──────────────────────────────────────────────────
function ExecTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
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
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS. I've led growth strategy at startups and inside ", React.createElement(A, { href: 'https://www.ibm.com' }, 'IBM'), "'s enterprise portfolio, and I've ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised 500+ companies'), " on the kind of work my clients carry into sessions every week."),
      React.createElement(P, null, React.createElement(Strong, null, "That means I already understand the environment you're operating in."), " We don't have to spend time on context-setting, which lets us get to the real work faster."),
      React.createElement(P, null, "The work combines three things: high-trust advisory grounded in your real context, nervous system regulation so pressure stops running the show physically, and data from wearables that makes invisible stress patterns visible."),
      React.createElement(P, null, "A lot of it is what I call strategic detachment: learning to play the professional roles, handle pressure, and navigate business dynamics without turning every interaction into a referendum on your worth. The goal isn't less ambition. It's ambition that finally feels fulfilling."),
      React.createElement(P, { last: true }, "I write about the psychology of ambition and performance at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), " (5,000+ subscribers). The writing explores the patterns. The private work is where we actually address them.")
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, null, "Founders, VPs, directors, and senior ICs in tech. People who are doing well by any external measure and still feel like something isn't working. Some common threads:"),
      React.createElement(P, null, React.createElement(Strong, null, "Chronic self-doubt alongside strong performance."), " ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high' }, 'Achievement patterns tied to early approval-seeking'), " that were never examined. Decision paralysis that isn't really about the decision. Burnout that rest doesn't fix. ", React.createElement(A, { href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering' }, 'Overthinking that has become a default setting'), " rather than a useful tool."),
      React.createElement(P, { last: true }, "If you're used to solving problems through effort and analysis, and this particular one isn't responding to either, it might be worth a conversation.")
    ),

    React.createElement(Section, { label: 'How it works', mob },
      React.createElement(P, null, "All sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Most clients are across Europe and the US. Sessions run weekly or biweekly."),
      React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We use it to figure out what's actually going on and whether working together makes sense. If it doesn't, I'll say so."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
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

    React.createElement(Testimonials, { mob, items: [{q: "One of the most useful things is that Aggelos actually understands the environment I work in. I don\u2019t need to explain corporate politics, startup pressure, targets, investors or why a career decision can feel more complicated than \u201cfollow your values.\u201d He understands the game, but he also notices what the game is doing to me.", w: "Anonymous client, Senior operator"}, {q: "Aggelos is direct. He will tell me when I am avoiding something or constructing a very intelligent explanation for why I cannot act. But I have never experienced his directness as judgement. There is enough trust between us that he can challenge me properly, which is exactly what I needed.", w: "Anonymous client, Senior tech professional"}, {q: "I came in expecting a fairly standard coaching conversation. Within the first session, Aggelos understood both the professional problem and the emotional mechanism underneath it. He was warm, but very straightforward, and gave me a way of looking at the situation that I had not considered before. I left with more than advice. I left with a more accurate problem.", w: "Anonymous client, Senior professional"}] }),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We use it to figure out what's going on and whether working together makes sense."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── THERAPY FOR FOUNDERS ────────────────────────────────────────────────────
function FoundersTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
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
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including advising 500+ companies on growth. I've been on the other side of the table where you set targets, defend strategy, and absorb pressure from every direction."),
      React.createElement(P, null, "When a client comes in carrying the weight of a down round or a co-founder conflict, ", React.createElement(Strong, null, "I don't need them to explain the context"), ". I know what that room feels like. We skip the background and go straight to the work."),
      React.createElement(P, { last: true }, "That high-trust advisory is one part of how I work. The others are nervous system regulation — so the constant activation of founding stops living in your body — and data from wearables (sleep, HRV, recovery) that makes the real cost of crunch periods, travel, and conflict visible instead of guessed at.")
    ),

    React.createElement(Section, { label: 'How it works', mob },
      React.createElement(P, null, "Sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Nothing goes to your board, your investors, or your team. This isn't coaching attached to your company. It's a private therapeutic relationship."),
      React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We use it to figure out what's going on and whether I'm the right person for it."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
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

    React.createElement(Testimonials, { mob, items: [{q: "I had worked with coaches before, and I had been in therapy before, but this felt different. Aggelos understands the emotional side without losing sight of the actual situation I am dealing with at work. We can talk about pressure, shame or something happening in my body, and five minutes later discuss a decision involving my team or business. I don\u2019t have to translate one world into the other for him.", w: "Anonymous client, Founder"}, {q: "There are no motivational speeches or generic frameworks pasted onto every situation. Aggelos pays attention to how I specifically operate. He remembers the contradictions, notices when I change the story and asks the question I was hoping we could avoid. Annoying at times, but usually accurate.", w: "Anonymous client, Founder"}, {q: "I did not want somebody to tell me to work less, lower my standards or become less ambitious. Aggelos understood that immediately. Our work has been about keeping the part of me that wants to build and achieve, while becoming less dependent on winning, comparison and external approval to feel okay. That distinction has been very important to me.", w: "Anonymous client, Founder and executive"}] }),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We figure out what's going on and whether working together makes sense."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── IMPOSTER SYNDROME ───────────────────────────────────────────────────────
function ImposterPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
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
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 500+ companies on growth'), ". I know the environment that amplifies imposter syndrome in tech: the pace, the ambiguity, the constant comparison."),
      React.createElement(P, null, React.createElement(Strong, null, "We work with the root pattern rather than the symptoms."), " That means going beyond the current role to understand where the conditional sense of worth was established, why it persists, and what it would take to build a sense of self that doesn't depend entirely on the next result."),
      React.createElement(P, null, "Insight alone rarely shifts this — most high performers have already understood it intellectually. So the work also includes nervous system regulation, so safety stops depending on the next win, and, where it helps, data from wearables that shows the gap between what you think you can handle and what your body is already doing."),
      React.createElement(P, { last: true }, "I write about this at ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), ". The writing explores the patterns. The private work is where they actually move.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's driving the pattern and whether I'm the right person to work on it with you."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
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

    React.createElement(Testimonials, { mob, items: [{q: "From the outside, I was still functioning and performing at a high level, so it was difficult to explain why something felt wrong. Aggelos understood that the problem was not simply workload. We have worked on the way I connect achievement with safety, worth and relief. I am still ambitious, but success is beginning to feel less like narrowly escaping failure.", w: "Anonymous client, Tech executive"}, {q: "I trust Aggelos because he is not constantly trying to reassure me. He listens carefully, but he does not automatically agree with the version of events I bring into the session. Sometimes he points out something I would rather not see. Somehow that honesty has made the work feel safer, not less safe.", w: "Anonymous client, Product leader"}, {q: "I started working with Aggelos during a confusing period in my career. On paper, things were going well, but internally I was questioning almost everything. Over several sessions, he helped me understand which concerns were legitimate and which were being amplified by old fears around performance, failure and how other people saw me. I feel more grounded now, even though not everything has been resolved.", w: "Anonymous client, Technology executive"}] }),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes and no obligations. We use it to understand what's driving the doubt and whether this is the right approach for you."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── BURNOUT PAGE ────────────────────────────────────────────────────────────
function BurnoutPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
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
      React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advising 500+ companies on growth'), ". I understand the environment well: the always-on culture, the ambiguity, the pressure to appear certain when you're not."),
      React.createElement(P, { last: true }, "The goal isn't necessarily to make you work less (though that might happen). ", React.createElement(Strong, null, "The goal is a more fulfilling relationship with the work, so it costs less and means more."), " We do that through high-trust advisory, nervous system regulation so recovery actually lands, and data from wearables (sleep, HRV, stress) that shows what rest alone isn't fixing.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's underneath the exhaustion and whether therapy is the right approach."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
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

    React.createElement(Testimonials, { mob, items: [{q: "Before working together, a difficult email or a problem with a client could affect my entire day. I would immediately feel responsible for everything and start trying to control how I was perceived. We traced that response much further back than the immediate work situation. I still feel pressure, but I can recognise it earlier and I no longer believe every conclusion my nervous system produces.", w: "Anonymous client, Consultant and business owner"}, {q: "I already understood many of my patterns intellectually. That was partly the problem. I could explain myself very well and still repeat the same behaviour. Working with Aggelos helped me recognise what was happening physically, not just analyse it afterwards. That has made the work much more real and, slowly, changed how I respond under pressure.", w: "Anonymous client, Technology leader"}, {q: "The conversations go deeper than ordinary coaching, but I still leave with something usable. Sometimes that is a decision, sometimes a difficult conversation I need to have, and sometimes it is simply noticing the moment my body moves into threat before my mind creates a story around it. It is a rare combination of depth and practicality.", w: "Anonymous client, Senior tech professional"}] }),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We figure out what's going on and whether this is the right approach."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── CAREER TRANSITION ───────────────────────────────────────────────────────
function CareerTransitionPage() {
  const mob = useIsMobile();
  const mobPage = mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
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
      React.createElement(P, null, "I'm a licensed psychotherapist who made this kind of transition myself — from 18+ years in B2B SaaS and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'growth advisory'), " to clinical practice. I know what it's like to leave an identity that works, and I know the difference between doing that reactively and doing it with some clarity about what's actually driving the change."),
      React.createElement(P, { last: true }, "The work combines high-trust advisory, nervous system regulation, and — where useful — data from wearables that shows how the transition is actually landing on you. The aim isn't just the next role. It's a working life that feels genuinely fulfilling, not just impressive.")
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, React.createElement(Strong, null, "Senior professionals considering a major career change"), " but paralysed by the decision. Executives who were laid off and are dealing with more than just the job search. Leaders who made the move and feel more lost than free. People who ", React.createElement(Strong, null, "keep almost leaving but pull back every time"), ". Anyone at a senior level who suspects the career question is really a question about identity, worth, and what they want from the next phase of their working life.")
    ),

    React.createElement(Section, { label: 'Start here', mob },
      React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's actually driving the transition (or the resistance to it) and whether therapy is the right kind of support for this moment."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
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

    React.createElement(Testimonials, { mob, items: [{q: "We have been working together for a while now, and the sessions have gradually changed the way I make decisions. Aggelos doesn\u2019t tell me what to do or try to make me dependent on his opinion. He helps me separate the real problem from the fear, ego and old patterns wrapped around it. I usually leave with less noise and a much clearer sense of what is mine to do.", w: "Anonymous client, Founder"}, {q: "I had been forcing a business situation to continue because stopping it felt like failure. After one of our exercises, I realised I was trying to manufacture reasons to keep going when I already knew the answer. I had the difficult conversation shortly afterwards. It was not that Aggelos gave me the decision. He helped me stop fighting what I already knew.", w: "Anonymous client, Business owner"}, {q: "I was initially sceptical about somatic and trauma-informed work because I assumed it would be vague or a bit spiritual. It wasn\u2019t. Aggelos explained what we were doing, paid attention to my limits and connected the experience back to patterns I could recognise in my work and relationships. It felt grounded, careful and surprisingly practical.", w: "Anonymous client"}] }),
    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Next step', mob },
      React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We use it to understand where you actually are and what kind of support makes sense right now."),
      React.createElement('div', { style: { marginTop: '.5rem' } },
        React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, 'Book a fit call →')
      )
    ),
    React.createElement(SiteFooter, { mob })
  );
}

// ─── LOCATION PAGE SHARED BITS (structure only — copy stays distinct per city) ─
function locMobPage(mob) {
  return mob ? { ...pageStyle, padding: '1.5rem 1rem 5rem' } : widePageStyle;
}
function BookCta({ label }) {
  return React.createElement('div', { style: { marginTop: '1.4rem' } },
    React.createElement('a', { href: '/book/', className: 'cta-btn', style: ctaBtn }, label || 'Book a fit call →')
  );
}

// ─── GREEK-SPEAKING THERAPIST · LONDON ───────────────────────────────────────
function LondonPage() {
  const mob = useIsMobile();
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '2.5rem', fontSize: mob ? '22px' : '30px' } },
      'Greek-speaking therapist for tech professionals in London'
    ),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3rem' } },
      "If you work in London tech and you’d rather do this in Greek, with someone who also understands your industry, that’s the whole idea here. The work itself is the same one I do with every client. Speaking Greek just takes the translation out of it."
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, "Greek-speaking founders, engineers, product managers, designers, consultants and executives working in London tech — fintech, scale-ups, big tech, agencies, the consulting firms. Wherever in the city you ended up.")
    ),

    React.createElement(Section, { label: 'Why it helps that I speak Greek', mob },
      React.createElement(P, null, "Therapy works better in the language you actually think and feel in. The family expectations, the humour, the guilt, the particular context of building a life away from Greece — you don’t have to translate any of it or explain it from scratch."),
      React.createElement(P, { last: true }, "We start from a shared understanding instead of spending sessions building one. That’s the real reason to choose a Greek-speaking therapist over a perfectly good local one.")
    ),

    React.createElement(Section, { label: 'And I understand the industry', mob },
      React.createElement(P, { last: true }, "You also don’t have to explain your work. Before training as a psychotherapist I spent 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised more than 500 companies'), ", so runway, reorgs, shipping, the pressure of a senior role — I already follow all of it. It’s the same reason my ", React.createElement(IA, { href: '/founders/' }, 'founder'), " and ", React.createElement(IA, { href: '/solopreneurs/' }, 'solopreneur'), " clients come to me.")
    ),

    React.createElement(Section, { label: 'The work itself is the same', mob },
      React.createElement(P, { last: true }, "Nothing about the work changes because you’re in London or because we speak Greek. It’s the same private, one-to-one work I do with everyone — the personal pattern and the real decision in front of you, worked at the same time. How it runs, step by step, is on ", React.createElement(IA, { href: '/how-i-work/' }, 'how I work'), ".")
    ),

    React.createElement(Section, { label: 'Online sessions', mob },
      React.createElement(P, { last: true }, "Everything is online, one to one. I’m based in Ireland — same time zone as London — so an early slot before work or an evening one is easy to arrange. There’s no in-person room.")
    ),

    React.createElement(Section, { label: 'Confidentiality', mob },
      React.createElement(P, { last: true }, "Private and one to one. I don’t report to anyone and I don’t use identifiable client stories anywhere. Here’s ", React.createElement(IA, { href: '/confidentiality/' }, 'how confidentiality works'), " in detail.")
    ),

    React.createElement(BookCta, { label: 'Book a fit call \u2192' }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement(FaqItem, { q: 'Greek or English?' },
        React.createElement(P, { last: true }, "Either, and you can switch mid-sentence. Most people move between the two without thinking about it.")
      ),
      React.createElement(FaqItem, { q: 'Is the therapy itself any different because it’s in Greek?' },
        React.createElement(P, { last: true }, "No. Same work, same approach I take with everyone. The Greek, and a shared read on your world, just remove the friction of explaining and translating.")
      ),
      React.createElement(FaqItem, { q: 'Are you based in London?' },
        React.createElement(P, { last: true }, "No — I’m based in Ireland and work online. London is the same time zone, so scheduling is simple. There’s no in-person option.")
      ),
      React.createElement(FaqItem, { q: 'What do people usually bring?' },
        React.createElement(P, { last: true }, "The same things anyone brings — pressure that won’t switch off, a decision they keep circling, burnout, self-doubt, work that has quietly taken over. Nothing London-specific. You just get to talk about it in Greek, with someone who understands the context.")
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── GREEK-SPEAKING THERAPIST · MANCHESTER ───────────────────────────────────
function ManchesterPage() {
  const mob = useIsMobile();
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '2.5rem', fontSize: mob ? '22px' : '30px' } },
      'Greek-speaking therapist for tech professionals in Manchester'
    ),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3rem' } },
      "If you’re in tech in Manchester and you’d rather talk in Greek, with someone who also knows the industry, that’s what this is. The work is the same one I do with every client — working in your own language just takes the translation out of it."
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, "Greek-speaking engineers, developers, product and design people, consultants, agency owners and remote workers in and around Manchester and the wider North of England.")
    ),

    React.createElement(Section, { label: 'Why it helps that I speak Greek', mob },
      React.createElement(P, null, "It’s easier to do this in the language you grew up in. The family side, the humour, the expectations, the context of building a life away from Greece — none of it needs translating or explaining first."),
      React.createElement(P, { last: true }, "You get to be blunt, funny and unsure in your own idiom, and be understood the first time. That, more than anything, is why people look for a Greek-speaking therapist rather than a local one.")
    ),

    React.createElement(Section, { label: 'And I understand the industry', mob },
      React.createElement(P, { last: true }, "You also don’t have to explain the work — the pipeline that’s gone quiet, the pricing you avoid raising, the projects, the independence. I spent 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, 'advised more than 500 companies'), " before training as a psychotherapist, and I’ve done the job-to-independent route myself. It’s the same reason my ", React.createElement(IA, { href: '/solopreneurs/' }, 'solopreneur'), " and ", React.createElement(IA, { href: '/founders/' }, 'founder'), " clients come to me.")
    ),

    React.createElement(Section, { label: 'The work itself is the same', mob },
      React.createElement(P, { last: true }, "It’s the same private, one-to-one work I do with everyone, working the personal pattern and the practical decision together. If you work for yourself, that includes the business side — pricing, positioning, the outreach you keep putting off — alongside the pattern underneath it. The full shape of it is on ", React.createElement(IA, { href: '/how-i-work/' }, 'how I work'), ".")
    ),

    React.createElement(Section, { label: 'Online sessions', mob },
      React.createElement(P, { last: true }, "Everything is online, one to one. I’m based in Ireland, the same time zone as Manchester, so slots fit easily around work. If you’re remote-first anyway, a video session is just a Tuesday. There’s no in-person room.")
    ),

    React.createElement(Section, { label: 'Confidentiality', mob },
      React.createElement(P, { last: true }, "Private, one to one, and it stays that way. Nothing gets reported to anyone and I don’t use identifiable stories. Here’s ", React.createElement(IA, { href: '/confidentiality/' }, 'how confidentiality works'), ".")
    ),

    React.createElement(BookCta, { label: 'Book a fit call \u2192' }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement(FaqItem, { q: 'Do I need to be in Manchester itself?' },
        React.createElement(P, { last: true }, "No. Sessions are online, so anywhere in the UK works the same. Manchester and the North just happen to be where a lot of my Greek-speaking, remote and independent clients are.")
      ),
      React.createElement(FaqItem, { q: 'I work for myself. Can we cover the business too?' },
        React.createElement(P, { last: true }, "Yes. Pricing, positioning and the outreach you avoid sit alongside the pattern underneath them, because for solo and independent people the two are rarely separate. Same work I do with any solopreneur.")
      ),
      React.createElement(FaqItem, { q: 'Greek or English?' },
        React.createElement(P, { last: true }, "Either, or both in the same session. Working in your own language is the point.")
      ),
      React.createElement(FaqItem, { q: 'Is this a different service from the London or Dublin pages?' },
        React.createElement(P, { last: true }, "No — same person, same offer. The only real differences are who tends to be where and the practical logistics. The therapy itself doesn’t change.")
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── GREEK-SPEAKING THERAPIST · NEW YORK ─────────────────────────────────────
function NewYorkPage() {
  const mob = useIsMobile();
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '2.5rem', fontSize: mob ? '22px' : '30px' } },
      'Greek-speaking therapist for tech professionals in New York'
    ),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3rem' } },
      "If you’re Greek and working in New York tech, and you’d rather do this in Greek with someone who also understands the industry, that’s the idea. The work is the same one I do with every client — speaking Greek just takes the translation out of it."
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, "Greek-speaking engineers, founders, product leaders, designers and operators in New York tech — startups, larger platforms, and the finance-adjacent world the city runs on.")
    ),

    React.createElement(Section, { label: 'Why it helps that I speak Greek', mob },
      React.createElement(P, null, "The things that actually run you — family, expectation, the particular pride and guilt of the one who went to the States — tend to live in Greek. In English they stay at a slight, unhelpful distance."),
      React.createElement(P, { last: true }, "Working in your first language means none of that needs translating, and the cultural context is already understood. That’s the reason to choose this over a local option, not anything different about the therapy.")
    ),

    React.createElement(Section, { label: 'And I understand the industry', mob },
      React.createElement(P, { last: true }, "You also don’t have to explain equity, runway, a reorg, or why “just be confident” is useless advice. 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, '500+ companies advised'), " before I trained as a psychotherapist. It’s the same reason my ", React.createElement(IA, { href: '/founders/' }, 'founder'), " and senior ", React.createElement(IA, { href: '/therapy-for-executives/' }, 'executive'), " clients come to me.")
    ),

    React.createElement(Section, { label: 'The work itself is the same', mob },
      React.createElement(P, { last: true }, "Nothing about the work changes because you’re in New York. It’s the same one-to-one work I do with everyone, holding the personal pattern and the real situation at work in the same room. The steps are laid out on ", React.createElement(IA, { href: '/how-i-work/' }, 'how I work'), ".")
    ),

    React.createElement(Section, { label: 'Online, across the time difference', mob },
      React.createElement(P, { last: true }, "Sessions are online, one to one. I’m based in Ireland, which is about five hours ahead of New York, so in practice they land in your morning. We agree a recurring slot that works for both of us; if the time difference doesn’t fit your schedule, I’ll tell you on the fit call rather than force it.")
    ),

    React.createElement(Section, { label: 'Confidentiality', mob },
      React.createElement(P, { last: true }, "Private and one to one. I don’t report to your employer, investors or anyone else, and I don’t use identifiable stories publicly. The detail, including the honest limits, is on the ", React.createElement(IA, { href: '/confidentiality/' }, 'confidentiality page'), ".")
    ),

    React.createElement(BookCta, { label: 'Book a fit call \u2192' }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement(FaqItem, { q: 'You’re in Ireland — how does the time difference work?' },
        React.createElement(P, { last: true }, "Ireland is about five hours ahead of New York, so sessions usually sit in your morning. We set a fixed recurring slot. If your schedule can’t make the difference work, I’ll say so on the fit call instead of pretending it’s fine.")
      ),
      React.createElement(FaqItem, { q: 'Are you a licensed therapist in New York State?' },
        React.createElement(P, { last: true }, "I’m a licensed psychotherapist and a registered member of the BACP (British Association for Counselling and Psychotherapy). I’m not registered with a New York State board, and this is online work rather than a local clinical service. If you specifically need a New-York-licensed provider — for insurance, say — I’m happy to point you elsewhere on the fit call.")
      ),
      React.createElement(FaqItem, { q: 'Greek or English?' },
        React.createElement(P, { last: true }, "Either, or both in the same session. Working in your first language is the reason to choose this.")
      ),
      React.createElement(FaqItem, { q: 'Is it a different kind of therapy because it’s for Greek people abroad?' },
        React.createElement(P, { last: true }, "No. It’s the offer everyone gets. Being able to do it in Greek, with the context already understood, is the only part that’s specific to you.")
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── GREEK-SPEAKING THERAPIST · DUBLIN ───────────────────────────────────────
function DublinPage() {
  const mob = useIsMobile();
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.5rem' : '2.5rem', fontSize: mob ? '22px' : '30px' } },
      'Greek-speaking therapist for tech professionals in Dublin'
    ),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3rem' } },
      "If you’re Greek and working in Dublin tech, and you’d rather do this in Greek with someone who also knows the industry, that’s what this is. The work is the same one I do with every client — speaking Greek just removes the translation."
    ),

    React.createElement(Section, { label: 'Who this is for', mob },
      React.createElement(P, { last: true }, "Greek-speaking engineers, product managers, operations and consulting people working in Dublin’s multinationals, tech companies and startups.")
    ),

    React.createElement(Section, { label: 'Why it helps that I speak Greek', mob },
      React.createElement(P, null, "For people who’ve relocated, a lot of what matters is still tied to Greece — family, expectations, the pull home. It’s the part that’s hardest to explain to someone outside the culture, and the part that lands flat when you have to translate it."),
      React.createElement(P, { last: true }, "In Greek, with someone who already gets it, you can go straight to it. That’s the reason to choose a Greek-speaking therapist — not anything different about the work.")
    ),

    React.createElement(Section, { label: 'And I understand the industry', mob },
      React.createElement(P, { last: true }, "You also don’t have to explain corporate life — the big-org politics, the way a role can quietly take over. 18+ years in product and growth and ", React.createElement(A, { href: 'https://headofgrowth.io' }, '500+ companies advised'), " before I trained as a psychotherapist, including inside a large enterprise. I happen to be based in Ireland myself, which helps with the practicalities, but the real reason to come is that I hold both the work and the Greek context at once.")
    ),

    React.createElement(Section, { label: 'The work itself is the same', mob },
      React.createElement(P, { last: true }, "It’s the same private, one-to-one work I do with everyone — the personal pattern and the real decision together, whether that’s the job, the move, or whether to stay at all. How the work runs is on ", React.createElement(IA, { href: '/how-i-work/' }, 'how I work'), ".")
    ),

    React.createElement(Section, { label: 'Online sessions', mob },
      React.createElement(P, { last: true }, "Everything is online, one to one. I’m based in Ireland, so we share a time zone and there’s nothing to solve on scheduling — but sessions are by video, not in person. Same country, same working hours; that’s where the convenience begins and ends.")
    ),

    React.createElement(Section, { label: 'Confidentiality', mob },
      React.createElement(P, { last: true }, "Private and one to one. Nothing goes back to your employer or manager, and I don’t use identifiable stories publicly. The full detail is on the ", React.createElement(IA, { href: '/confidentiality/' }, 'confidentiality page'), ".")
    ),

    React.createElement(BookCta, { label: 'Book a fit call \u2192' }),

    React.createElement('hr', { style: sepStyle }),
    React.createElement(Section, { label: 'Common questions', mob },
      React.createElement(FaqItem, { q: 'You’re in Ireland too — can we meet in person?' },
        React.createElement(P, { last: true }, "No, the work is online, one to one, by video — same as for all my clients. Being in the same country and time zone makes scheduling effortless, but there isn’t an in-person room.")
      ),
      React.createElement(FaqItem, { q: 'A lot of what’s on my mind is family back in Greece. Is that the right thing to bring?' },
        React.createElement(P, { last: true }, "Yes. For people who’ve relocated, the tie home is usually central, not a side issue — and it’s the part hardest to explain to someone outside the culture. Working in Greek is exactly what makes it workable.")
      ),
      React.createElement(FaqItem, { q: 'Greek or English?' },
        React.createElement(P, { last: true }, "Either, or both in the same session. Your language, your call.")
      ),
      React.createElement(FaqItem, { q: 'Is this a different service because I’m Greek and abroad?' },
        React.createElement(P, { last: true }, "No. What you’re paying for isn’t a “Greek service” — it’s the ordinary work, minus the part where you’d have to explain your background before we could start.")
      )
    ),

    React.createElement(SiteFooter, { mob })
  );
}

// ─── CONFIDENTIALITY ─────────────────────────────────────────────────────────
function ConfidentialityPage() {
  const mob = useIsMobile();
  return React.createElement('main', { style: locMobPage(mob) },
    React.createElement('h1', { style: { ...h1Style, marginBottom: mob ? '1.25rem' : '1.75rem', fontSize: mob ? '24px' : '30px' } }, 'Confidentiality'),
    React.createElement('p', { style: { ...leadStyle, marginBottom: mob ? '2.5rem' : '3rem' } },
      "People bring me things they haven’t said to their cofounder, their board, their partner or anyone on their team. That only works if discretion is built in from the start, not bolted on afterwards. Here’s how I handle it, and where the honest limits are."
    ),

    React.createElement(Section, { label: 'Why this page exists', mob },
      React.createElement(P, null, "Most of my clients are ", React.createElement(IA, { href: '/founders/' }, 'founders'), ", ", React.createElement(IA, { href: '/solopreneurs/' }, 'solopreneurs'), " and senior people in tech. What comes up in the room isn’t only personal. It routinely touches cofounders, employees, leadership teams, investors, boards and customers — and revenue, fundraising, runway, pricing, intellectual property and product plans — alongside career decisions, employment matters, relationships, and health."),
      React.createElement(P, { last: true }, "In other words, information that could have real professional or reputational consequences in the wrong place. So confidentiality here is not a formality. It’s a condition of the work being possible at all.")
    ),

    React.createElement(Section, { label: 'What you can rely on', mob },
      React.createElement(P, null, "The plain version, before the nuance:"),
      React.createElement(PatternList, { items: [
        { cause: 'Sessions are confidential', effect: 'what you say in them is treated as private' },
        { cause: 'No reporting back', effect: 'nothing goes to your employer, investors, board, cofounder, team or partner' },
        { cause: 'Paying doesn’t buy access', effect: 'if someone else funds the work, they don’t get to hear what was said' },
        { cause: 'No identifiable stories', effect: 'I don’t use recognisable client material in public without explicit permission' },
        { cause: 'You can ask first', effect: 'any practical question about confidentiality is fair before you commit' },
      ] }),
      React.createElement(P, { last: true }, "None of that is conditional on you being a “good” client or saying comfortable things. Especially not that.")
    ),

    React.createElement(Section, { label: 'Nothing goes back to the people involved', mob },
      React.createElement(P, null, "This is the one founders ask about most, so it’s worth being explicit. You can bring, and work on, any of the following without it reaching the people concerned:"),
      React.createElement('ul', { style: { margin: '0 0 1.2rem', paddingLeft: '1.2rem', lineHeight: 1.9, fontSize: '17px', color: C.text } },
        React.createElement('li', null, "Doubts about the company, or whether you still believe in it"),
        React.createElement('li', null, "Frustration with a cofounder, or that the relationship is failing"),
        React.createElement('li', null, "Concerns about specific employees, or decisions you’re dreading"),
        React.createElement('li', null, "Investor or board pressure, and how you’re really handling it"),
        React.createElement('li', null, "Financial fear — runway, revenue, whether it survives the quarter"),
        React.createElement('li', null, "That you want to leave, sell, or stop"),
        React.createElement('li', null, "Lost motivation, and personal circumstances bleeding into the company")
      ),
      React.createElement(P, { last: true }, "I’m not connected to your cap table or your org chart. I don’t talk to your people. There’s no back channel, including to whoever referred you.")
    ),

    React.createElement(Section, { label: 'If someone else is paying', mob },
      React.createElement(P, { last: true }, "Sometimes a company or an investor funds the work. That arrangement covers the invoice and nothing else. The paying party doesn’t receive session content, notes, progress reports or a summary of what you’re working on. If anyone expects otherwise, we sort out those boundaries in writing before we begin, so there’s no ambiguity later.")
    ),

    React.createElement(Section, { label: 'How I use examples publicly', mob },
      React.createElement(P, null, "I write and speak about this work — on the ", React.createElement(IA, { href: '/blog/' }, 'blog'), ", on ", React.createElement(A, { href: 'https://undisguised.io' }, 'Undisguised'), " and elsewhere. I don’t use identifiable client stories to do it."),
      React.createElement(P, { last: true }, "Anything that appears publicly is fictional, materially altered, or a composite assembled from patterns across many people, and constructed so that no individual can be identified — not by a colleague, a cofounder, or the person themselves. If I ever wanted to use something closer to a real, recognisable case, I’d ask you first, explicitly, and a no is simply a no.")
    ),

    // TODO(confirm): name the actual tools used for video, scheduling, notes and file storage
    // (and their GDPR / data-processing posture), plus any formal privacy notice or data-retention
    // period, so this section can be specific rather than general. Kept deliberately vague until confirmed.
    React.createElement(Section, { label: 'Notes, data and scheduling', mob },
      React.createElement(P, { last: true }, "Sessions run over video, and scheduling, notes and communication use standard professional tools. I keep records to a considered minimum and handle them accordingly. I’m not going to invent impressive-sounding security claims here — if you want the specifics of what’s stored, where, and for how long, ask on the fit call and I’ll answer plainly.")
    ),

    React.createElement(Section, { label: 'An NDA, if you want one', mob },
      React.createElement(P, null, "If it makes the commercial side easier to trust, I’m glad to sign an NDA before we start. For a lot of founders it turns an abstract promise into something concrete, and that’s a reasonable thing to want."),
      React.createElement(P, { last: true }, "One honest caveat: an NDA reinforces the commercial confidentiality of our relationship, but it doesn’t override the legal, ethical and professional obligations below. No agreement can contract me out of those, and you should be wary of anyone who says theirs can.")
    ),

    React.createElement(Section, { label: 'The limits — stated plainly', mob },
      React.createElement(P, null, "I’m not going to promise absolute, unconditional secrecy, because that promise can’t be kept honestly, and a page like this is worth nothing if it overstates. Confidentiality is the strong default. In a narrow set of circumstances it can have limits:"),
      React.createElement('div', { style: { margin: '.4rem 0 1.2rem' } },
        React.createElement(TrackCards, { mob, tracks: [
          { title: 'Serious, imminent risk', body: "If there’s a real and immediate risk of serious harm to you or someone else, I may need to act on that — ideally with you, not around you." },
          { title: 'Legal and safeguarding', body: "In limited situations the law can require disclosure — for example a court order, or a safeguarding concern involving a child or a vulnerable adult." },
        ] })
      ),
      React.createElement(P, null, "As a psychotherapist I also work within a professional ethical framework (I’m a registered member of the BACP) and I use clinical supervision, which is standard and itself confidential. In supervision, material is discussed in a way that protects your identity."),
      React.createElement(P, { last: true }, "Where the work is advisory or coaching rather than psychotherapy, the professional frame differs, but the commitment to discretion — and the same narrow limits around serious risk and the law — still applies. If any of this is relevant to your situation, ask me directly and I’ll be specific.")
      // TODO(confirm): confirm the exact confidentiality-limit wording that matches your practice and
      // jurisdiction (Ireland-based, working with clients abroad) — specifically (1) the precise legal /
      // safeguarding grounds you are prepared to state, (2) whether clinical supervision applies to the
      // advisory/coaching work as well as the psychotherapy, and (3) whether you want to distinguish the
      // two modes more formally here. Kept general until confirmed; this is not legal advice.
    ),

    React.createElement(Section, { label: 'This isn’t the paperwork', mob },
      React.createElement(P, { last: true }, "This page explains how I think about confidentiality. It isn’t a substitute for a formal contract, a privacy notice, a consent form or an NDA. Where those apply, they’re handled separately and take precedence over anything summarised here.")
    ),

    React.createElement(Section, { label: 'Ask before you commit', mob },
      React.createElement(P, null, "If confidentiality is the thing standing between you and starting, that’s a good use of a fit call. Bring the specific worry — the cofounder who mustn’t know, the investor, the NDA — and I’ll tell you exactly how it works, including anything I can’t promise."),
      React.createElement(BookCta, { label: 'Book a fit call →' })
    ),

    React.createElement(SiteFooter, { mob })
  );
}

Object.assign(window, { HomePage, SpecialtyPage });
