// content-pages.jsx — Home + all specialty pages

// Shared styles — light theme #FFFFFF bg, #282726 text
const C = {
  text: '#282726',
  muted: '#666',
  accent: '#1a7f37',
  border: 'rgba(40,39,38,0.12)',
  sepBorder: 'rgba(40,39,38,0.2)'
};
const pageStyle = {
  maxWidth: 740,
  margin: '0 auto',
  padding: '4rem 2rem 7rem',
  fontFamily: 'inherit',
  color: C.text
};
// Wider canvas for pages that carry visual blocks (cards, aligned tables) in the
// right-hand content column — gives the Section content room so nothing is squeezed.
const widePageStyle = {
  ...pageStyle,
  maxWidth: 940
};
const h1Style = {
  fontSize: '32px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: C.text,
  marginBottom: '2.5rem',
  letterSpacing: '-.02em'
};
const h2Style = {
  fontSize: '17px',
  fontWeight: 700,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  color: C.muted,
  paddingTop: '.25rem',
  lineHeight: 1.5,
  textWrap: 'balance'
};
const h3Style = {
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.7,
  color: C.text,
  marginBottom: '.6rem',
  borderBottom: `1px solid ${C.border}`,
  paddingBottom: '.4rem'
};
const sectionStyle = {
  display: 'grid',
  gridTemplateColumns: '184px 1fr',
  gap: '0 2.25rem',
  marginBottom: '3rem'
};
const pStyle = {
  marginBottom: '1.4rem',
  lineHeight: 1.75,
  fontSize: '18px',
  color: C.text
};
const leadStyle = {
  marginBottom: '1.4rem',
  lineHeight: 1.6,
  fontSize: '23px',
  fontWeight: 500,
  letterSpacing: '-.01em',
  color: C.text
};
const sepStyle = {
  border: 'none',
  borderTop: `1px solid ${C.sepBorder}`,
  margin: '2.5rem 0'
};
const ctaBtn = {
  fontFamily: 'inherit',
  fontSize: '12px',
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: '#FFFFFF',
  background: '#282726',
  border: '1px solid #282726',
  textDecoration: 'none',
  padding: '.8rem 1.5rem',
  display: 'inline-block',
  cursor: 'pointer',
  transition: 'background .15s, color .15s'
};
const footerStyle = {
  marginTop: '3rem',
  fontSize: '14px',
  color: C.muted
};
const sectionTitleStyle = {
  fontSize: '22px',
  fontWeight: 700,
  letterSpacing: '-.01em',
  color: C.accent,
  marginBottom: '1.2rem',
  lineHeight: 1.3
};
const homeStyle = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '4rem 2.5rem 7rem',
  fontFamily: 'inherit',
  color: C.text
};
const homeStyleMobile = {
  ...homeStyle,
  padding: '2rem 1.25rem 5rem'
};
const greenLink = {
  color: C.accent,
  textUnderlineOffset: '3px',
  textDecorationThickness: '1px'
};
const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0
};

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
function Strong({
  children
}) {
  return React.createElement('span', {
    style: {
      fontWeight: 400,
      color: '#282726',
      borderBottom: '1px solid rgba(40,39,38,.3)',
      paddingBottom: '1px'
    }
  }, children);
}
function A({
  href,
  children
}) {
  return React.createElement('a', {
    href,
    target: '_blank',
    rel: 'noopener',
    style: greenLink
  }, children);
}
function IA({
  href,
  children
}) {
  return React.createElement('a', {
    href,
    style: greenLink
  }, children);
}
function Section({
  label,
  children,
  mob
}) {
  const ss = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const hs = mob ? {
    ...h2Style,
    paddingBottom: '.5rem',
    display: 'block'
  } : h2Style;
  return React.createElement('section', {
    style: ss
  }, React.createElement('h2', {
    style: hs
  }, label), React.createElement('div', null, children));
}
function P({
  children,
  last
}) {
  return React.createElement('p', {
    style: {
      ...pStyle,
      marginBottom: last ? 0 : '1.2rem'
    }
  }, children);
}
function FaqItem({
  q,
  children
}) {
  return React.createElement('div', {
    style: {
      marginBottom: '2rem'
    }
  }, React.createElement('h3', {
    style: h3Style
  }, q), children);
}
function Testimonial({
  quote,
  who
}) {
  return React.createElement('blockquote', {
    style: {
      margin: '0 0 1.6rem',
      padding: '0 0 0 1rem',
      borderLeft: '2px solid rgba(26,127,55,0.35)'
    }
  }, React.createElement('p', {
    style: {
      fontSize: '15px',
      lineHeight: 1.8,
      color: '#282726',
      marginBottom: '.5rem'
    }
  }, '\u201C' + quote + '\u201D'), React.createElement('footer', {
    style: {
      fontSize: '10px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: '#767676'
    }
  }, who));
}
function Testimonials({
  items,
  mob,
  label
}) {
  return React.createElement(Section, {
    label: label || 'What clients say',
    mob
  }, items.map(function (t, i) {
    return React.createElement(Testimonial, {
      key: i,
      quote: t.q,
      who: t.w
    });
  }), React.createElement('p', {
    style: {
      marginBottom: 0,
      marginTop: '.4rem'
    }
  }, React.createElement('a', {
    href: '/reviews/',
    style: greenLink
  }, 'Read more client reflections \u2192')));
}

// \u2500\u2500\u2500 SITE FOOTER (shared across all pages) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// ─── BILINGUAL PATH MODEL (mirrors sidebar.jsx) ───────────────────────────────
// One offer, two languages. English core at root, Greek core under /el/.
const CORE_PATHS = {
  'home': {
    en: '/',
    el: '/el/'
  },
  'one-to-one': {
    en: '/1-to-1/',
    el: '/el/1-to-1/'
  },
  'about': {
    en: '/about/',
    el: '/el/about/'
  },
  'reviews': {
    en: '/reviews/',
    el: '/el/reviews/'
  },
  'book': {
    en: '/book/',
    el: '/el/book/'
  },
  'diagnostic': {
    en: '/startingdiagnostic/',
    el: '/el/startingdiagnostic/'
  },
  'confidentiality': {
    en: '/confidentiality/',
    el: '/el/confidentiality/'
  },
  // One blog for both languages (Greek enters it filtered — no second blog).
  'blog': {
    en: '/blog/',
    el: '/blog/?lang=el'
  }
};
const pathFor = (id, lang) => CORE_PATHS[id] && CORE_PATHS[id][lang] || CORE_PATHS[id] && CORE_PATHS[id].en || '/';
const isEl = lang => lang === 'el';
const FOOTER_COLS_BY_LANG = {
  en: [{
    label: 'Work with me',
    links: [{
      href: '/1-to-1/',
      label: '1:1'
    }, {
      href: '/book/',
      label: 'Book a fit call'
    }]
  }, {
    label: 'Site',
    links: [{
      href: '/',
      label: 'Home'
    }, {
      href: '/about/',
      label: 'About'
    }, {
      href: '/blog/',
      label: 'Writing'
    }, {
      href: '/reviews/',
      label: 'Reviews'
    }, {
      href: '/startingdiagnostic/',
      label: 'Starting Diagnostic'
    }, {
      href: '/confidentiality/',
      label: 'Confidentiality'
    }]
  }, {
    label: 'Elsewhere',
    links: [{
      href: 'https://linkedin.com/in/growth-product-manager/',
      label: 'LinkedIn',
      ext: true
    }, {
      href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
      label: 'YouTube',
      ext: true
    }]
  }],
  el: [{
    label: 'Συνεργασία',
    links: [{
      href: '/el/1-to-1/',
      label: '1:1'
    }, {
      href: '/el/book/',
      label: 'Κλείσε γνωριμία'
    }]
  }, {
    label: 'Χάρτης',
    links: [{
      href: '/el/',
      label: 'Αρχική'
    }, {
      href: '/el/about/',
      label: 'Σχετικά'
    }, {
      href: '/blog/?lang=el',
      label: 'Άρθρα'
    }, {
      href: '/el/reviews/',
      label: 'Κριτικές'
    }, {
      href: '/el/startingdiagnostic/',
      label: 'Starting Diagnostic'
    }, {
      href: '/el/confidentiality/',
      label: 'Εμπιστευτικότητα'
    }]
  }, {
    label: 'Αλλού',
    links: [{
      href: 'https://linkedin.com/in/growth-product-manager/',
      label: 'LinkedIn',
      ext: true
    }, {
      href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
      label: 'YouTube',
      ext: true
    }]
  }]
};
const FOOTER_COPYLINE = {
  en: '© Aggelos Mouzakitis · Business Advisor + Licensed Psychotherapist',
  el: '© Άγγελος Μουζακίτης · Business Advisor + Ψυχοθεραπευτής'
};
function SiteFooter({
  mob,
  lang = 'en'
}) {
  const FOOTER_COLS = FOOTER_COLS_BY_LANG[lang] || FOOTER_COLS_BY_LANG.en;
  const wrap = {
    marginTop: mob ? '3.5rem' : '5rem',
    paddingTop: mob ? '2.5rem' : '3.25rem',
    borderTop: `1px solid ${C.sepBorder}`
  };
  const cols = {
    display: mob ? 'block' : 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2.5rem'
  };
  const colLabel = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: C.accent,
    marginBottom: '1.1rem'
  };
  const linkStyle = {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '.35rem',
    fontSize: '15px',
    color: C.text,
    textDecoration: 'none',
    lineHeight: 1.4,
    transition: 'color .12s'
  };
  const mutedStyle = {
    fontSize: '15px',
    color: '#aaa',
    lineHeight: 1.4,
    cursor: 'default'
  };
  const row = {
    marginBottom: '.75rem'
  };
  function fLink(l) {
    if (l.muted) return React.createElement('div', {
      style: row,
      key: l.label
    }, React.createElement('span', {
      style: mutedStyle
    }, l.label));
    const extra = l.ext ? {
      target: '_blank',
      rel: 'noopener'
    } : {};
    return React.createElement('div', {
      style: row,
      key: l.label
    }, React.createElement('a', {
      href: l.href,
      ...extra,
      style: linkStyle,
      onMouseEnter: e => e.currentTarget.style.color = C.accent,
      onMouseLeave: e => e.currentTarget.style.color = C.text
    }, l.label, l.ext ? React.createElement('span', {
      style: {
        fontSize: '11px',
        opacity: .5
      }
    }, '\u2197') : null));
  }
  return React.createElement('footer', {
    style: wrap
  }, React.createElement('div', {
    style: cols
  }, FOOTER_COLS.map(function (col) {
    return React.createElement('div', {
      key: col.label,
      style: {
        marginBottom: mob ? '2rem' : 0
      }
    }, React.createElement('div', {
      style: colLabel
    }, col.label), col.links.map(fLink));
  })), React.createElement('div', {
    style: {
      marginTop: mob ? '1rem' : '2.5rem',
      paddingTop: '1.5rem',
      borderTop: `1px solid ${C.border}`,
      fontSize: '13px',
      color: C.muted
    }
  }, FOOTER_COPYLINE[lang] || FOOTER_COPYLINE.en));
}

// ─── START HERE ──────────────────────────────────────────────────────────────
const START_HERE_ITEMS = [{
  label: 'For founders →',
  href: '/founders/'
}, {
  label: 'For solopreneurs →',
  href: '/solopreneurs/'
}];
function StartHere({
  mob
}) {
  const rowStyle = first => ({
    display: 'flex',
    alignItems: 'baseline',
    gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none',
    color: C.text,
    transition: 'color .15s'
  });
  return React.createElement('div', {
    style: {
      marginTop: mob ? '2.5rem' : '3.5rem'
    }
  }, React.createElement('h2', {
    style: {
      ...sectionTitleStyle,
      fontSize: mob ? '19px' : '22px'
    }
  }, 'Start Here'), START_HERE_ITEMS.map(function (item, i) {
    return React.createElement('a', {
      key: item.href,
      href: item.href,
      className: 'hv-row',
      style: rowStyle(i === 0),
      onMouseEnter: e => e.currentTarget.style.color = C.accent,
      onMouseLeave: e => e.currentTarget.style.color = C.text
    }, React.createElement('span', {
      style: {
        fontSize: mob ? '16px' : '18px',
        fontWeight: 600
      }
    }, item.label));
  }));
}

// ─── LATEST WRITING ──────────────────────────────────────────────────────────
function LatestWriting({
  mob,
  lang = 'en'
}) {
  const [posts, setPosts] = React.useState(null);
  React.useEffect(() => {
    fetch('/blog/posts.json').then(r => r.json()).then(setPosts).catch(() => setPosts([]));
  }, []);
  const T = {
    en: {
      head: 'Latest writing',
      loading: 'Loading…',
      empty: 'No posts yet.',
      all: 'See all →'
    },
    el: {
      head: 'Πρόσφατα άρθρα',
      loading: 'Φόρτωση…',
      empty: 'Δεν υπάρχουν άρθρα ακόμη.',
      all: 'Δες όλα →'
    }
  }[lang] || null;
  const t = T || {
    head: 'Latest writing',
    loading: 'Loading…',
    empty: 'No posts yet.',
    all: 'See all →'
  };
  const items = posts ? posts.slice(0, 8) : [];
  const rowStyle = first => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '1.5rem',
    padding: mob ? '.55rem 0' : '.6rem 0',
    borderTop: first ? `1px solid ${C.border}` : 'none',
    borderBottom: `1px solid ${C.border}`,
    textDecoration: 'none',
    color: C.text,
    transition: 'color .15s'
  });
  return React.createElement('div', {
    style: {
      marginTop: mob ? '2.5rem' : '3.5rem'
    }
  }, React.createElement('h2', {
    style: {
      ...sectionTitleStyle,
      fontSize: mob ? '19px' : '22px'
    }
  }, t.head), posts === null && React.createElement('p', {
    style: {
      fontSize: '12px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: '#767676'
    }
  }, t.loading), posts && posts.length === 0 && React.createElement('p', {
    style: {
      fontSize: '12px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: '#767676'
    }
  }, t.empty), items.length > 0 && React.createElement(React.Fragment, null, items.map(function (p, i) {
    return React.createElement('a', {
      key: p.slug,
      href: `/blog/${p.slug}/`,
      className: 'hv-row',
      style: rowStyle(i === 0),
      onMouseEnter: e => e.currentTarget.style.color = C.accent,
      onMouseLeave: e => e.currentTarget.style.color = C.text
    }, React.createElement('span', {
      style: {
        fontSize: mob ? '16px' : '18px',
        fontWeight: 600
      }
    }, p.title), React.createElement('span', {
      style: {
        fontSize: '14px',
        color: '#767676',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, p.date));
  }), React.createElement('div', {
    style: {
      textAlign: 'right',
      marginTop: '1.2rem',
      fontSize: '14px'
    }
  }, React.createElement(IA, {
    href: pathFor('blog', lang)
  }, t.all))));
}

// ─── SHARED UI STRINGS + CTA HELPERS (bilingual) ─────────────────────────────
const UI = {
  en: {
    role: 'Business Advisor + Licensed Psychotherapist',
    seeOneToOne: 'See how 1:1 works',
    book: 'Book a fit call',
    readMore: 'Read more client reflections →',
    friendlier: 'Friendlier than I look',
    imgAlt: 'Aggelos Mouzakitis speaking on stage'
  },
  el: {
    role: 'Business Advisor + Ψυχοθεραπευτής',
    seeOneToOne: 'Δες την 1:1 συνεργασία',
    book: 'Κλείσε μια γνωριμία',
    readMore: 'Διάβασε κι άλλες σκέψεις πελατών →',
    friendlier: 'Πιο φιλικός απ’ ό,τι δείχνω',
    imgAlt: 'Ο Άγγελος Μουζακίτης σε ομιλία'
  }
};
const tUI = lang => UI[lang] || UI.en;

// Primary + secondary CTA row, language-aware targets.
function CtaRow({
  lang,
  mob,
  primaryTo = 'one-to-one',
  primaryLabel,
  secondaryTo = 'book',
  secondaryLabel
}) {
  const u = tUI(lang);
  const primary = {
    display: 'inline-block',
    textAlign: 'center',
    padding: '.85rem 1.6rem',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    background: C.accent,
    border: `1.5px solid ${C.accent}`,
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '2px',
    transition: 'background .15s, border-color .15s'
  };
  const secondary = {
    display: 'inline-block',
    textAlign: 'center',
    padding: '.85rem 1.6rem',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    background: 'transparent',
    border: `1.5px solid rgba(40,39,38,.35)`,
    color: C.text,
    textDecoration: 'none',
    borderRadius: '2px',
    transition: 'border-color .15s, color .15s'
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '.8rem',
      marginTop: '1.6rem'
    }
  }, React.createElement('a', {
    href: pathFor(primaryTo, lang),
    className: 'cta-btn',
    style: primary,
    onMouseEnter: e => {
      e.currentTarget.style.background = '#146b2e';
      e.currentTarget.style.borderColor = '#146b2e';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.accent;
      e.currentTarget.style.borderColor = C.accent;
    }
  }, (primaryLabel || u.seeOneToOne) + ' →'), React.createElement('a', {
    href: pathFor(secondaryTo, lang),
    style: secondary,
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = C.accent;
      e.currentTarget.style.color = C.accent;
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(40,39,38,.35)';
      e.currentTarget.style.color = C.text;
    }
  }, secondaryLabel || u.book));
}

// Accent-marked situation/bullet list.
function Bullets({
  items,
  mob
}) {
  return React.createElement('ul', {
    style: {
      listStyle: 'none',
      margin: '.2rem 0 0',
      padding: 0
    }
  }, items.map((it, i) => React.createElement('li', {
    key: i,
    style: {
      display: 'flex',
      gap: '.7rem',
      alignItems: 'baseline',
      padding: mob ? '.5rem 0' : '.45rem 0',
      fontSize: mob ? '16px' : '17px',
      lineHeight: 1.6,
      color: C.text,
      borderTop: i ? `1px solid ${C.border}` : 'none'
    }
  }, React.createElement('span', {
    style: {
      color: C.accent,
      fontWeight: 700,
      flexShrink: 0
    }
  }, '—'), React.createElement('span', null, it))));
}

// Emphatic final CTA block.
function FinalCta({
  lang,
  mob,
  heading,
  sub
}) {
  const u = tUI(lang);
  return React.createElement('div', {
    style: {
      marginTop: mob ? '3rem' : '4rem',
      padding: mob ? '1.6rem 1.4rem' : '2.4rem 2.6rem',
      border: `1.5px solid rgba(26,127,55,.4)`,
      background: 'rgba(26,127,55,.06)',
      borderRadius: '14px'
    }
  }, React.createElement('p', {
    style: {
      fontSize: mob ? '19px' : '23px',
      fontWeight: 500,
      letterSpacing: '-.01em',
      lineHeight: 1.5,
      color: C.text,
      margin: 0
    }
  }, heading), sub && React.createElement('p', {
    style: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: C.muted,
      margin: '.9rem 0 0'
    }
  }, sub), React.createElement('a', {
    href: pathFor('book', lang),
    className: 'cta-btn',
    style: {
      display: 'inline-block',
      marginTop: '1.4rem',
      padding: '.9rem 1.8rem',
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      background: C.accent,
      border: `1.5px solid ${C.accent}`,
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '2px'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#146b2e';
      e.currentTarget.style.borderColor = '#146b2e';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.accent;
      e.currentTarget.style.borderColor = C.accent;
    }
  }, u.book + ' →'));
}

// ─── FAQ ACCORDION (accessible; answers stay in the DOM for SEO) ─────────────
function FaqAccordion({
  items,
  mob
}) {
  const [open, setOpen] = React.useState(-1);
  return React.createElement('div', {
    style: {
      ...cardBase,
      overflow: 'hidden'
    }
  }, items.map(function (it, i) {
    const isOpen = open === i;
    return React.createElement('div', {
      key: i,
      style: {
        borderTop: i ? `1px solid ${C.border}` : 'none'
      }
    }, React.createElement('button', {
      onClick: () => setOpen(isOpen ? -1 : i),
      'aria-expanded': isOpen ? 'true' : 'false',
      className: 'hv-row',
      style: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'left',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        padding: mob ? '1rem 1.1rem' : '1.15rem 1.35rem',
        fontSize: mob ? '16px' : '17px',
        fontWeight: 600,
        color: C.text,
        lineHeight: 1.5
      }
    }, React.createElement('span', null, it.q), React.createElement('span', {
      'aria-hidden': 'true',
      style: {
        color: C.accent,
        fontWeight: 700,
        flexShrink: 0,
        transform: isOpen ? 'rotate(45deg)' : 'none',
        transition: 'transform .15s',
        fontSize: '22px',
        lineHeight: 1
      }
    }, '+')), React.createElement('div', {
      style: {
        display: isOpen ? 'block' : 'none',
        padding: mob ? '0 1.1rem 1.1rem' : '0 1.35rem 1.3rem',
        fontSize: '16px',
        lineHeight: 1.7,
        color: C.text
      }
    }, it.a));
  }));
}

// ─── HOME PAGE (bilingual) ───────────────────────────────────────────────────
const HOME = {
  en: {
    promise: "Build something of your own. Or take what you've already built much further.",
    tagline: 'Figure out what the business needs. Work through what gets in the way. Business and psychology, together.',
    introA: 'I spent 18+ years in product and growth, building companies and advising more than 500 of them. I also trained as a psychotherapist.',
    introB: "Today I work 1:1 and with groups of people building something of their own. Sometimes the problem is clearly business. Sometimes it's more complicated and includes you.",
    introC: "Quite often, business and psychology collide to the point where it's hard to tell yourself where the problem actually is.",
    recogLabel: 'You may recognise some of this',
    recog: [{
      lead: "You've been meaning to start for a long time.",
      support: "You're still getting ready."
    }, {
      lead: 'You need more customers.',
      support: 'Everything except selling keeps making it onto the to-do list.'
    }, {
      lead: "You know you're undercharging.",
      support: "The number still hasn't changed.",
      big: true
    }, {
      lead: 'Your direction gets difficult,',
      support: 'and another one suddenly starts looking better.'
    }, {
      lead: 'The business depends on you.',
      support: 'Maybe more than it actually needs to.',
      big: true
    }, {
      lead: 'On paper, things are going well.',
      support: "You feel less and less connected to what you're building.",
      big: true
    }, {
      lead: 'You reached something you worked hard for.',
      support: "Now you're not sure you want the next level, or just think you should."
    }, {
      lead: 'You understand your patterns.',
      support: 'They keep happening anyway.',
      big: true
    }],
    sigHead: "Sometimes the work is tactical. Sometimes it's psychological.",
    sigHint: 'Choose a problem →',
    sigBiz: 'The business',
    sigYou: 'You',
    sigProblems: [{
      p: 'Not enough customers',
      business: 'Acquisition may simply not work.',
      you: 'You may be avoiding selling or visibility.'
    }, {
      p: 'Undercharging',
      business: 'Your pricing may genuinely be below the market.',
      you: 'Asking for more may feel like exposure.'
    }, {
      p: 'Everything depends on me',
      business: 'Roles or processes may genuinely be poor.',
      you: 'You may struggle to let go of control.'
    }, {
      p: 'I keep changing direction',
      business: 'The strategy may genuinely be wrong.',
      you: 'Commitment may get uncomfortable once the novelty disappears.'
    }, {
      p: "I can't make the decision",
      business: 'You may genuinely be missing information.',
      you: 'You may be avoiding what the decision forces you to face.'
    }, {
      p: "I've lost interest in what I built",
      business: 'The business may need its next version.',
      you: 'You may no longer want what your identity was organised around.'
    }, {
      p: 'I avoid being visible',
      business: 'The channel or the positioning may be wrong.',
      you: 'Being seen may feel more exposing than the business can afford.'
    }, {
      p: 'The business has stalled',
      business: 'The model may have hit a real ceiling.',
      you: 'You may be quietly protecting yourself from the next risk.'
    }],
    sigConcl1: 'Same visible problem. Very different things may need fixing.',
    sigConcl2: "The hard part is working out what you're actually dealing with.",
    teaserHead: 'One relationship. Both sides of the problem are welcome.',
    teaserBiz: 'Offer · pricing · customers · decisions',
    teaserYou: 'avoidance · identity · control · uncertainty',
    teaserNote: "You don't need to know which one you have before you come in.",
    faqLabel: 'Common questions',
    faq: [{
      q: 'Do I need to already have a business?',
      a: "No. You can be starting, freelancing, consulting, building alongside a job, or already running something established. The common bit is that you're seriously trying to build something of your own."
    }, {
      q: 'Is this therapy or business advisory?',
      a: "It can involve both. I'm a business advisor and a psychotherapist. If the problem is the business, we'll work on the business. If something in you is getting in the way, we can work there too."
    }, {
      q: "What if I don't know which one the problem is?",
      a: "Good. You don't need to diagnose yourself before we talk. Working that out is part of the job."
    }],
    finalHeading: 'Building something is hard enough without getting in your own way.',
    finalSub: "If you have something you're trying to start, fix or grow, tell me what's going on."
  },
  el: {
    promise: 'Χτίζεις κάτι δικό σου; Ας το πάμε παρακάτω.',
    tagline: 'Βρίσκουμε τι χρειάζεται η επιχείρηση και τι σε εμποδίζει να το πετύχεις. Business και ψυχολογία, μαζί.',
    introA: 'Πέρασα 18+ χρόνια στο product και το growth, χτίζοντας δικές μου εταιρείες και συμβουλεύοντας περισσότερες από 500. Παράλληλα εκπαιδεύτηκα ως ψυχοθεραπευτής.',
    introB: 'Σήμερα δουλεύω 1:1 και σε groups με ανθρώπους που χτίζουν κάτι δικό τους.',
    introC: 'Μερικές φορές το πρόβλημα είναι καθαρά business. Μερικές φορές είναι πιο περίπλοκο και περιλαμβάνει και εσένα. Και αρκετά συχνά, τα δύο μπλέκονται τόσο που δεν είναι καθόλου ξεκάθαρο πού ακριβώς βρίσκεται το πρόβλημα.',
    recogLabel: 'Μήπως σου θυμίζει κάτι;',
    recog: [{
      lead: 'Θέλεις καιρό να ξεκινήσεις.',
      support: 'Ακόμα ετοιμάζεσαι.'
    }, {
      lead: 'Χρειάζεσαι περισσότερους πελάτες.',
      support: 'Πάντα βρίσκεται κάτι πιο επείγον από το να πουλήσεις.'
    }, {
      lead: 'Ξέρεις ότι χρεώνεις λίγο.',
      support: 'Η τιμή, όμως, παραμένει ίδια.',
      big: true
    }, {
      lead: 'Η κατεύθυνσή σου δυσκολεύει,',
      support: 'και ξαφνικά μια άλλη μοιάζει καλύτερη.'
    }, {
      lead: 'Η επιχείρηση εξαρτάται από εσένα.',
      support: 'Ίσως περισσότερο απ’ όσο χρειάζεται.',
      big: true
    }, {
      lead: 'Στα χαρτιά, όλα πάνε καλά.',
      support: 'Εσύ νιώθεις όλο και λιγότερη σύνδεση με αυτό που χτίζεις.',
      big: true
    }, {
      lead: 'Έφτασες κάπου που ήθελες πολύ.',
      support: 'Τώρα δεν ξέρεις αν θες το επόμενο επίπεδο ή απλώς νομίζεις ότι πρέπει.'
    }, {
      lead: 'Καταλαβαίνεις τα μοτίβα σου.',
      support: 'Συνεχίζουν να επαναλαμβάνονται.',
      big: true
    }],
    sigHead: 'Κάποιες φορές η δουλειά είναι πρακτική. Κάποιες, ψυχολογική.',
    sigHint: 'Διάλεξε ένα πρόβλημα →',
    sigBiz: 'Το business',
    sigYou: 'Εσύ',
    sigProblems: [{
      p: 'Λίγοι πελάτες',
      business: 'Η απόκτηση πελατών μπορεί απλώς να μη λειτουργεί.',
      you: 'Μπορεί να αποφεύγεις τις πωλήσεις ή την έκθεση.'
    }, {
      p: 'Χρεώνεις λίγο',
      business: 'Οι τιμές σου μπορεί πραγματικά να είναι κάτω από την αγορά.',
      you: 'Το να ζητήσεις περισσότερα μοιάζει με έκθεση.'
    }, {
      p: 'Όλα περνούν από εσένα',
      business: 'Οι ρόλοι ή οι διαδικασίες μπορεί όντως να είναι κακοί.',
      you: 'Μπορεί να δυσκολεύεσαι να αφήσεις τον έλεγχο.'
    }, {
      p: 'Αλλάζεις συνέχεια κατεύθυνση',
      business: 'Η στρατηγική μπορεί όντως να είναι λάθος.',
      you: 'Η δέσμευση δυσκολεύει μόλις περάσει η νεωτερικότητα.'
    }, {
      p: 'Δεν παίρνεις την απόφαση',
      business: 'Μπορεί όντως να σου λείπει πληροφορία.',
      you: 'Μπορεί να αποφεύγεις αυτό που σε αναγκάζει να δεις η απόφαση.'
    }, {
      p: 'Έχασες το ενδιαφέρον σου',
      business: 'Το business μπορεί να χρειάζεται την επόμενη εκδοχή του.',
      you: 'Μπορεί να μη θες πια αυτό γύρω από το οποίο χτίστηκε η ταυτότητά σου.'
    }, {
      p: 'Αποφεύγεις την έκθεση',
      business: 'Το κανάλι ή το positioning μπορεί να είναι λάθος.',
      you: 'Το να σε βλέπουν μοιάζει πιο εκθετικό απ’ όσο αντέχει το business.'
    }, {
      p: 'Το business έχει κολλήσει',
      business: 'Το μοντέλο μπορεί να έχει πιάσει ταβάνι.',
      you: 'Μπορεί να προστατεύεις τον εαυτό σου από το επόμενο ρίσκο.'
    }],
    sigConcl1: 'Ίδιο ορατό πρόβλημα. Πολύ διαφορετικά πράγματα μπορεί να χρειάζονται δουλειά.',
    sigConcl2: 'Το δύσκολο είναι να καταλάβεις τι πραγματικά έχεις μπροστά σου.',
    teaserHead: 'Μία συνεργασία. Και οι δύο πλευρές του προβλήματος χωράνε.',
    teaserBiz: 'Offer · τιμές · πελάτες · αποφάσεις',
    teaserYou: 'αποφυγή · ταυτότητα · έλεγχος · αβεβαιότητα',
    teaserNote: 'Δεν χρειάζεται να ξέρεις ποιο από τα δύο έχεις πριν έρθεις.',
    faqLabel: 'Συχνές ερωτήσεις',
    faq: [{
      q: 'Πρέπει να έχω ήδη επιχείρηση;',
      a: 'Όχι. Μπορεί να ξεκινάς τώρα, να δουλεύεις ως freelancer ή consultant, να χτίζεις κάτι παράλληλα με τη δουλειά σου ή να έχεις ήδη μια κανονική επιχείρηση. Το κοινό είναι ότι προσπαθείς σοβαρά να χτίσεις κάτι δικό σου.'
    }, {
      q: 'Είναι ψυχοθεραπεία ή συμβουλευτική επιχειρήσεων;',
      a: 'Είναι και τα δύο παράλληλα. Είμαι business advisor και ψυχοθεραπευτής. Αν το πρόβλημα είναι το business, δουλεύουμε το business. Αν μπαίνει κάτι δικό σου στη μέση, μπορούμε να δουλέψουμε κι αυτό.'
    }, {
      q: 'Κι αν δεν ξέρω ποιο από τα δύο είναι;',
      a: 'Δεν χρειάζεται να έρθεις με διάγνωση. Το να ξεκαθαρίσουμε τι πραγματικά συμβαίνει είναι μέρος της δουλειάς.'
    }],
    finalHeading: 'Το να χτίσεις κάτι δικό σου είναι ήδη αρκετά δύσκολο.',
    finalSub: 'Αν προσπαθείς να ξεκινήσεις, να ξεκολλήσεις ή να αναπτύξεις κάτι παραπάνω, έλα να το συζητήσουμε.'
  }
};

// Homepage signature section — one problem active at a time; hover (desktop) or
// tap (mobile) reveals a business reading and a psychological reading of the
// same visible problem. The whole point: same symptom, very different work.
function ProblemSelector({
  c,
  mob
}) {
  const [active, setActive] = React.useState(0);
  const ACC = '#5cc98b'; // brand green, lightened for contrast on the dark band
  const dim = 'rgba(255,255,255,.55)';
  const p = c.sigProblems[active];
  const list = React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '.15rem'
    }
  }, React.createElement('div', {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: ACC,
      marginBottom: '1rem'
    }
  }, c.sigHint), c.sigProblems.map((it, i) => {
    const on = i === active;
    return React.createElement('button', {
      key: i,
      onClick: () => setActive(i),
      onMouseEnter: () => !mob && setActive(i),
      'aria-pressed': on ? 'true' : 'false',
      style: {
        textAlign: 'left',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        padding: '.5rem 0',
        display: 'flex',
        gap: '.7rem',
        alignItems: 'baseline',
        fontSize: mob ? '19px' : '22px',
        fontWeight: on ? 600 : 400,
        letterSpacing: '-.01em',
        lineHeight: 1.3,
        color: on ? '#fff' : dim,
        transition: 'color .15s'
      }
    }, React.createElement('span', {
      'aria-hidden': 'true',
      style: {
        color: ACC,
        opacity: on ? 1 : 0,
        transition: 'opacity .15s',
        flexShrink: 0
      }
    }, '—'), React.createElement('span', null, it.p));
  }));
  const explain = (label, text) => React.createElement('div', {
    style: {
      marginBottom: '1.6rem'
    }
  }, React.createElement('div', {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: ACC,
      marginBottom: '.5rem'
    }
  }, label), React.createElement('p', {
    style: {
      fontSize: mob ? '17px' : '19px',
      lineHeight: 1.55,
      color: 'rgba(255,255,255,.92)',
      margin: 0
    }
  }, text));
  const panel = React.createElement('div', {
    style: {
      borderLeft: mob ? 'none' : '1px solid rgba(255,255,255,.15)',
      paddingLeft: mob ? 0 : '2.5rem'
    }
  }, React.createElement('div', {
    style: {
      fontSize: mob ? '20px' : '23px',
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-.01em',
      margin: '0 0 1.4rem'
    }
  }, p.p), explain(c.sigBiz, p.business), explain(c.sigYou, p.you));
  return React.createElement('div', null, React.createElement('h2', {
    style: {
      fontSize: mob ? '25px' : '34px',
      fontWeight: 500,
      letterSpacing: '-.02em',
      lineHeight: 1.2,
      color: '#fff',
      margin: '0 0 2.5rem',
      maxWidth: '20ch'
    }
  }, c.sigHead), React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: mob ? '2rem' : '3rem',
      alignItems: 'start'
    }
  }, list, panel), React.createElement('div', {
    style: {
      marginTop: mob ? '2.5rem' : '3.5rem',
      paddingTop: '1.75rem',
      borderTop: '1px solid rgba(255,255,255,.15)'
    }
  }, React.createElement('p', {
    style: {
      fontSize: mob ? '18px' : '21px',
      fontWeight: 600,
      color: '#fff',
      letterSpacing: '-.01em',
      margin: '0 0 .4rem',
      lineHeight: 1.4
    }
  }, c.sigConcl1), React.createElement('p', {
    style: {
      fontSize: mob ? '16px' : '18px',
      color: 'rgba(255,255,255,.7)',
      margin: 0,
      lineHeight: 1.5
    }
  }, c.sigConcl2)));
}
function HomePage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = HOME[lang] || HOME.en;
  const u = tUI(lang);
  const pad = mob ? '0 1.25rem' : '0 2.5rem';
  const inner = (children, st) => React.createElement('div', {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: pad,
      ...(st || {})
    }
  }, children);
  const gap = mob ? '3.5rem' : '6rem';

  // ── Hero ──
  const heroText = React.createElement('div', {
    style: mob ? {
      width: '100%'
    } : {
      flex: '1 1 0',
      minWidth: 0,
      maxWidth: 560
    }
  }, React.createElement('div', {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: C.accent,
      marginBottom: '1.1rem'
    }
  }, u.role), React.createElement('h1', {
    style: {
      fontSize: mob ? '28px' : '38px',
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-.025em',
      color: C.text,
      margin: '0 0 1.1rem'
    }
  }, c.promise), React.createElement('p', {
    style: {
      fontSize: mob ? '17px' : '19px',
      fontWeight: 600,
      color: C.accent,
      margin: '0 0 1.5rem',
      lineHeight: 1.45
    }
  }, c.tagline), React.createElement(P, null, c.introA), React.createElement(P, null, c.introB), React.createElement(P, {
    last: true
  }, c.introC), React.createElement(CtaRow, {
    lang,
    mob
  }));
  const heroImg = React.createElement('div', {
    style: mob ? {
      width: '100%'
    } : {
      flex: '1.05 1 0',
      minWidth: 0
    }
  }, React.createElement('img', {
    src: 'https://aggelosmouzakitis.com/img/aggelos-homepage.webp',
    alt: u.imgAlt,
    loading: 'eager',
    fetchPriority: 'high',
    decoding: 'async',
    style: {
      width: '100%',
      aspectRatio: mob ? '16 / 10' : '4 / 5',
      objectFit: 'cover',
      borderRadius: '14px',
      display: 'block'
    }
  }), React.createElement('div', {
    style: {
      display: mob ? 'none' : 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: '8px',
      marginTop: '6px',
      paddingRight: '26px'
    }
  }, React.createElement('span', {
    style: {
      fontFamily: "'Segoe Script','Bradley Hand','Comic Sans MS',cursive",
      fontStyle: 'italic',
      fontSize: '16px',
      color: C.accent,
      transform: 'rotate(-3deg)',
      whiteSpace: 'nowrap',
      alignSelf: 'flex-end'
    }
  }, u.friendlier), React.createElement('svg', {
    width: 44,
    height: 40,
    viewBox: '0 0 44 40',
    fill: 'none',
    stroke: C.accent,
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: {
      marginBottom: '2px'
    }
  }, React.createElement('path', {
    d: 'M40 3 C 44 20, 33 30, 6 30'
  }), React.createElement('path', {
    d: 'M15 24 L5 30 L14 36'
  }))));

  // ── Recognition (editorial two-column; no cards) ──
  const recogItems = React.createElement('div', {
    style: {
      columnCount: mob ? 1 : 2,
      columnGap: mob ? 0 : '4rem',
      marginTop: mob ? '1.75rem' : '2.5rem'
    }
  }, c.recog.map((r, i) => React.createElement('div', {
    key: i,
    style: {
      breakInside: 'avoid',
      marginBottom: r.big ? mob ? '2rem' : '2.75rem' : mob ? '1.6rem' : '2.25rem'
    }
  }, React.createElement('p', {
    style: {
      fontSize: r.big ? mob ? '21px' : '25px' : mob ? '17px' : '19px',
      fontWeight: 600,
      letterSpacing: '-.01em',
      lineHeight: 1.25,
      color: C.text,
      margin: '0 0 .35rem'
    }
  }, r.lead), React.createElement('p', {
    style: {
      fontSize: r.big ? mob ? '16px' : '18px' : '16px',
      color: C.muted,
      lineHeight: 1.5,
      margin: 0
    }
  }, r.support))));

  // ── 1:1 teaser (typography as the visual object; no cards) ──
  const teaser = React.createElement('div', {
    style: {
      textAlign: mob ? 'left' : 'center',
      maxWidth: 820,
      margin: '0 auto'
    }
  }, React.createElement('h2', {
    style: {
      fontSize: mob ? '25px' : '34px',
      fontWeight: 500,
      letterSpacing: '-.02em',
      lineHeight: 1.2,
      color: C.text,
      margin: '0 0 1.8rem'
    }
  }, c.teaserHead), React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: mob ? 'column' : 'row',
      gap: mob ? '.5rem' : '1.5rem',
      justifyContent: 'center',
      alignItems: mob ? 'flex-start' : 'center',
      fontSize: mob ? '15px' : '17px',
      letterSpacing: '.01em',
      color: C.text
    }
  }, React.createElement('span', null, c.teaserBiz), React.createElement('span', {
    'aria-hidden': 'true',
    style: {
      color: C.accent,
      display: mob ? 'none' : 'inline'
    }
  }, '·'), React.createElement('span', {
    style: {
      color: C.muted
    }
  }, c.teaserYou)), React.createElement('p', {
    style: {
      fontSize: mob ? '18px' : '20px',
      fontWeight: 500,
      color: C.text,
      lineHeight: 1.5,
      margin: mob ? '1.6rem 0 0' : '2rem 0 0'
    }
  }, c.teaserNote), React.createElement('p', {
    style: {
      margin: '1.4rem 0 0'
    }
  }, React.createElement(IA, {
    href: pathFor('one-to-one', lang)
  }, u.seeOneToOne + ' →')));
  return React.createElement('main', {
    style: {
      width: '100%',
      color: C.text,
      fontFamily: 'inherit'
    }
  },
  // Hero
  React.createElement('section', {
    style: {
      paddingTop: mob ? '2rem' : '4rem'
    }
  }, inner(React.createElement('div', {
    style: mob ? {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem'
    } : {
      display: 'flex',
      gap: '4rem',
      alignItems: 'center'
    }
  }, heroText, heroImg))),
  // Recognition
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('h2', {
    style: {
      fontSize: mob ? '13px' : '14px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: C.muted,
      margin: 0
    }
  }, c.recogLabel), recogItems))),
  // Signature — full-width dark band
  React.createElement('section', {
    style: {
      marginTop: gap,
      background: '#1e2136',
      padding: mob ? '3rem 0' : '4.75rem 0'
    }
  }, inner(React.createElement(ProblemSelector, {
    c,
    mob
  }))),
  // 1:1 teaser
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(teaser)),
  // FAQ (quiet)
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('h2', {
    style: {
      fontSize: mob ? '24px' : '30px',
      fontWeight: 500,
      letterSpacing: '-.02em',
      lineHeight: 1.25,
      color: C.text,
      margin: '0 0 1.4rem'
    }
  }, c.faqLabel), React.createElement(FaqAccordion, {
    items: c.faq,
    mob
  })))),
  // Final CTA + footer
  React.createElement('section', {
    style: {
      paddingTop: mob ? '2.5rem' : '3.5rem',
      paddingBottom: mob ? '4rem' : '6rem'
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement(FinalCta, {
    lang,
    mob,
    heading: c.finalHeading,
    sub: c.finalSub
  }), React.createElement(SiteFooter, {
    mob,
    lang
  })))));
}

// ─── 1:1 OFFER PAGE (bilingual) ──────────────────────────────────────────────
const ONE = {
  en: {
    h1: 'Work with me, 1:1',
    lead: "Private work on the business you're building and whatever in you is getting tangled up with it.",
    intro: ["Some problems need a tactical answer. Others need deeper work. Often, it's not obvious which one you're dealing with until we get into it.", "The point of 1:1 is that we don't have to choose one lens in advance."],
    bizLabel: 'Business',
    youLabel: 'You',
    bothLabel: 'Both',
    diagLabel: 'How the work works',
    diagBring: "You bring what's happening.",
    diagWork: "We work out what we're actually dealing with.",
    diagBranches: [{
      k: 'Business',
      d: 'Something genuinely needs fixing in the business.'
    }, {
      k: 'Both',
      d: 'Business and psychology are tangled together.'
    }, {
      k: 'You',
      d: 'The strategy may be fine. Something personal is making it hard to act on.'
    }],
    diagOut: 'Work on what actually needs work.',
    scenLabel: 'What that looks like in practice',
    scenarios: [{
      n: '01',
      surface: 'You need more customers.',
      business: 'Acquisition may not work.',
      you: 'You may have avoided properly selling for six months.'
    }, {
      n: '02',
      surface: 'Everything still goes through you.',
      business: 'Roles or processes may genuinely be poor.',
      you: 'Letting go of control may feel much harder than it should.'
    }, {
      n: '03',
      surface: 'You keep changing direction.',
      business: 'The current strategy may actually be wrong.',
      you: 'Every strategy may start looking wrong once commitment becomes uncomfortable.'
    }, {
      n: '04',
      surface: 'You got what you wanted.',
      business: 'The next version of the company may need to change.',
      you: 'You may no longer want the thing your identity has been organised around wanting.'
    }],
    howLabel: 'How it starts',
    steps: [{
      n: '01',
      title: 'Fit call',
      tag: '~15 min · free',
      body: "We talk briefly about what you're building, what's going on and whether I seem like the right person for it. A fit check, not a free session."
    }, {
      n: '02',
      title: 'First session',
      body: "We get properly into the problem. You don't need the “right” version of it — bring it as you see it. You leave with a clearer read and a concrete next move."
    }, {
      n: '03',
      title: 'If it makes sense, we continue',
      body: 'Private, ongoing 1:1 work — for as long as it stays genuinely useful.'
    }],
    faqLabel: 'Common questions',
    faq: [{
      q: 'Is this therapy?',
      a: "Sometimes the work goes into territory you would absolutely recognise as psychotherapy. I'm a trained and registered psychotherapist, so we don't have to stop because the problem got personal. But this isn't a conventional therapy relationship where the business is merely context. The business itself is part of the work."
    }, {
      q: 'Is this business coaching?',
      a: "Not really. I will give you an opinion on the business. We can work directly on your offer, pricing, positioning, customer acquisition or a decision in front of you. I don't have a framework that every client gets taken through."
    }, {
      q: "What if I don't know whether the problem is business or psychological?",
      a: "You don't need to. Quite often, that's the first thing we need to work out."
    }, {
      q: 'Do I need to already have a business?',
      a: "No. You can be trying to start, building alongside a job, freelancing, consulting or already running an established business. What matters is that you're genuinely trying to build something of your own."
    }],
    ctaHeading: 'Bring me the problem as you currently understand it.',
    ctaSub: "We'll work out what it actually needs."
  },
  el: {
    h1: '1:1 Συνεργασία',
    lead: '1:1 συμβουλευτική προσανατολισμένη και στο business που χτίζεις αλλά και σε ό,τι φέρνεις εσύ στο τραπέζι σαν άνθρωπος που μπορεί να δημιουργεί εμπόδια.',
    intro: ['Κάποια προβλήματα θέλουν μια πρακτική business λύση. Άλλα χρειάζονται πιο βαθιά δουλειά. Και αρκετά συχνά, δεν είναι ξεκάθαρο ποιο από τα δύο έχεις μπροστά σου μέχρι να αρχίσουμε να το ξετυλίγουμε.', 'Στο 1:1 δεν χρειάζεται να διαλέξουμε από πριν.'],
    bizLabel: 'Business',
    youLabel: 'Εσύ',
    bothLabel: 'Και τα δύο',
    diagLabel: 'Πώς δουλεύουμε',
    diagBring: 'Φέρνεις αυτό που συμβαίνει.',
    diagWork: 'Βρίσκουμε τι πραγματικά έχουμε μπροστά μας.',
    diagBranches: [{
      k: 'Business',
      d: 'Κάτι όντως χρειάζεται δουλειά στο business.'
    }, {
      k: 'Και τα δύο',
      d: 'Business και ψυχολογία είναι μπλεγμένα μαζί.'
    }, {
      k: 'Εσύ',
      d: 'Η στρατηγική μπορεί να είναι μια χαρά. Κάτι προσωπικό κάνει δύσκολο το να δράσεις.'
    }],
    diagOut: 'Δουλεύουμε αυτό που πραγματικά χρειάζεται δουλειά.',
    scenLabel: 'Πώς φαίνεται στην πράξη',
    scenarios: [{
      n: '01',
      surface: 'Χρειάζεσαι περισσότερους πελάτες.',
      business: 'Η απόκτηση πελατών μπορεί να μη λειτουργεί.',
      you: 'Μπορεί να απέφυγες να πουλήσεις σοβαρά για έξι μήνες.'
    }, {
      n: '02',
      surface: 'Όλα περνούν ακόμα από εσένα.',
      business: 'Οι ρόλοι ή οι διαδικασίες μπορεί όντως να είναι κακοί.',
      you: 'Το να αφήσεις τον έλεγχο μπορεί να είναι πολύ πιο δύσκολο απ’ όσο θα έπρεπε.'
    }, {
      n: '03',
      surface: 'Αλλάζεις συνέχεια κατεύθυνση.',
      business: 'Η τρέχουσα στρατηγική μπορεί όντως να είναι λάθος.',
      you: 'Κάθε στρατηγική μοιάζει λάθος μόλις η δέσμευση γίνει άβολη.'
    }, {
      n: '04',
      surface: 'Πέτυχες αυτό που ήθελες.',
      business: 'Η επόμενη εκδοχή της εταιρείας μπορεί να χρειάζεται αλλαγή.',
      you: 'Μπορεί να μη θες πια αυτό γύρω από το οποίο έχει οργανωθεί η ταυτότητά σου.'
    }],
    howLabel: 'Πώς ξεκινάμε',
    steps: [{
      n: '01',
      title: 'Γνωριμία',
      tag: '~15 λεπτά · δωρεάν',
      body: 'Μου λες πολύ σύντομα τι χτίζεις και τι συμβαίνει. Βλέπουμε αν ταιριάζουμε. Είναι γνωριμία, όχι δωρεάν συνεδρία.'
    }, {
      n: '02',
      title: 'Πρώτη συνεδρία',
      body: "Μπαίνουμε κανονικά στο θέμα. Δεν χρειάζεται η «σωστή» εκδοχή — φέρ' το όπως το βλέπεις. Φεύγεις με πιο καθαρή εικόνα και ένα συγκεκριμένο επόμενο βήμα."
    }, {
      n: '03',
      title: 'Αν έχει νόημα, συνεχίζουμε',
      body: 'Ιδιωτικά, 1:1 — για όσο παραμένει πραγματικά χρήσιμο.'
    }],
    faqLabel: 'Συχνές ερωτήσεις',
    faq: [{
      q: 'Είναι ψυχοθεραπεία;',
      a: 'Κάποιες φορές η δουλειά μας θα μπει σε θέματα που είναι ξεκάθαρα ψυχοθεραπευτικά. Είμαι εκπαιδευμένος και εγγεγραμμένος ψυχοθεραπευτής, οπότε δεν χρειάζεται να σταματήσουμε επειδή το θέμα έγινε προσωπικό. Από την άλλη, εδώ το business δεν είναι απλώς το context. Είναι κι αυτό μέρος της δουλειάς.'
    }, {
      q: 'Είναι business coaching;',
      a: 'Ναι αλλά όχι αποκλειστικά. Θα έχω άποψη για το business. Μπορούμε να δουλέψουμε κανονικά offer, positioning, τιμές, πελάτες ή μια δύσκολη απόφαση που έχεις μπροστά σου. Δεν έχω μια έτοιμη μέθοδο από την οποία περνάω όλους τους πελάτες.'
    }, {
      q: 'Κι αν δεν ξέρω αν το πρόβλημα είναι business ή ψυχολογικό;',
      a: 'Δεν χρειάζεται να ξέρεις. Αρκετές φορές, αυτό είναι το πρώτο πράγμα που πρέπει να ξεκαθαρίσουμε.'
    }, {
      q: 'Πρέπει να έχω ήδη επιχείρηση;',
      a: 'Όχι. Μπορεί να ξεκινάς τώρα, να χτίζεις κάτι παράλληλα με τη δουλειά σου, να είσαι freelancer ή consultant, ή να τρέχεις ήδη μια κανονική επιχείρηση. Το σημαντικό είναι να προσπαθείς πραγματικά να χτίσεις κάτι δικό σου.'
    }],
    ctaHeading: 'Φέρε το πρόβλημα όπως το βλέπεις τώρα.',
    ctaSub: 'Θα βρούμε τι πραγματικά χρειάζεται.'
  }
};

// Vertical "how the work works" diagram, built from type — readable in seconds.
function ServiceDiagram({
  c,
  mob
}) {
  const chev = React.createElement('div', {
    'aria-hidden': 'true',
    style: {
      color: C.accent,
      fontSize: '22px',
      lineHeight: 1,
      margin: '.9rem 0'
    }
  }, '↓');
  const stage = (txt, big) => React.createElement('p', {
    style: {
      fontSize: big ? mob ? '20px' : '24px' : mob ? '17px' : '19px',
      fontWeight: 600,
      letterSpacing: '-.01em',
      color: big ? C.accent : C.text,
      margin: 0,
      lineHeight: 1.35,
      maxWidth: '30ch'
    }
  }, txt);
  const branches = React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
      gap: mob ? '1.1rem' : '0',
      width: '100%',
      maxWidth: 760,
      border: `1px solid ${C.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
      background: '#fff'
    }
  }, c.diagBranches.map((br, i) => React.createElement('div', {
    key: i,
    style: {
      padding: mob ? '1.1rem 1.2rem' : '1.4rem 1.5rem',
      borderLeft: !mob && i ? `1px solid ${C.border}` : 'none',
      borderTop: mob && i ? `1px solid ${C.border}` : 'none'
    }
  }, React.createElement('div', {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: C.accent,
      marginBottom: '.5rem'
    }
  }, br.k), React.createElement('p', {
    style: {
      fontSize: '15px',
      lineHeight: 1.55,
      color: C.text,
      margin: 0
    }
  }, br.d))));
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, stage(c.diagBring), chev, stage(c.diagWork), chev, branches, chev, stage(c.diagOut, true));
}
function OneToOnePage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = ONE[lang] || ONE.en;
  const u = tUI(lang);
  const pad = mob ? '0 1.1rem' : '0 2.5rem';
  const inner = (children, st) => React.createElement('div', {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: pad,
      ...(st || {})
    }
  }, children);
  const gap = mob ? '3.25rem' : '5.5rem';
  const H2 = {
    fontSize: mob ? '24px' : '30px',
    fontWeight: 500,
    letterSpacing: '-.02em',
    lineHeight: 1.25,
    color: C.text,
    margin: '0 0 1.6rem'
  };
  const primaryBtn = {
    display: 'inline-block',
    textAlign: 'center',
    padding: '.9rem 1.8rem',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    background: C.accent,
    border: `1.5px solid ${C.accent}`,
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '2px'
  };

  // ── Hero — copy + editorial portrait (different photo from homepage) ──
  const heroText = React.createElement('div', {
    style: mob ? {
      width: '100%'
    } : {
      flex: '1.2 1 0',
      minWidth: 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: C.accent,
      marginBottom: '1rem'
    }
  }, u.role), React.createElement('h1', {
    style: {
      fontSize: mob ? '28px' : '38px',
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-.025em',
      color: C.text,
      margin: '0 0 1.1rem'
    }
  }, c.h1), React.createElement('p', {
    style: {
      ...leadStyle,
      fontSize: mob ? '19px' : '22px',
      marginBottom: '1.4rem'
    }
  }, c.lead), c.intro.map((t, i) => React.createElement(P, {
    key: i,
    last: i === c.intro.length - 1
  }, t)), React.createElement('div', {
    style: {
      marginTop: '1.6rem'
    }
  }, React.createElement('a', {
    href: pathFor('book', lang),
    className: 'cta-btn',
    style: primaryBtn,
    onMouseEnter: e => {
      e.currentTarget.style.background = '#146b2e';
      e.currentTarget.style.borderColor = '#146b2e';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.accent;
      e.currentTarget.style.borderColor = C.accent;
    }
  }, u.book + ' →')));
  const heroImg = React.createElement('div', {
    style: mob ? {
      width: '100%'
    } : {
      flex: '1 1 0',
      minWidth: 0
    }
  }, React.createElement('img', {
    src: 'https://aggelosmouzakitis.com/img/aggelos.webp',
    alt: u.imgAlt,
    loading: 'eager',
    fetchPriority: 'high',
    decoding: 'async',
    style: {
      width: '100%',
      aspectRatio: mob ? '4 / 3' : '4 / 5',
      objectFit: 'cover',
      borderRadius: '14px',
      display: 'block'
    }
  }));

  // ── Four scenarios — alternating alignment/width, no card grid ──
  const scenario = (s, i) => {
    const rightAlign = i % 2 === 1;
    return React.createElement('div', {
      key: i,
      style: {
        maxWidth: mob ? '100%' : '68%',
        marginLeft: !mob && rightAlign ? 'auto' : '0',
        marginTop: i ? mob ? '2.5rem' : '3.25rem' : 0,
        paddingTop: i ? '2rem' : 0,
        borderTop: i ? `1px solid ${C.border}` : 'none',
        textAlign: !mob && rightAlign ? 'right' : 'left'
      }
    }, React.createElement('div', {
      style: {
        fontSize: mob ? '13px' : '14px',
        fontWeight: 700,
        letterSpacing: '.14em',
        color: C.accent,
        marginBottom: '.6rem'
      }
    }, s.n), React.createElement('p', {
      style: {
        fontSize: mob ? '20px' : '25px',
        fontWeight: 600,
        letterSpacing: '-.01em',
        lineHeight: 1.25,
        color: C.text,
        margin: '0 0 1rem'
      }
    }, s.surface), React.createElement('p', {
      style: {
        fontSize: mob ? '15px' : '16px',
        lineHeight: 1.6,
        color: C.text,
        margin: '0 0 .4rem'
      }
    }, React.createElement('span', {
      style: {
        fontWeight: 700,
        color: C.accent,
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '.08em',
        marginRight: '.5rem'
      }
    }, c.bizLabel), s.business), React.createElement('p', {
      style: {
        fontSize: mob ? '15px' : '16px',
        lineHeight: 1.6,
        color: C.muted,
        margin: 0
      }
    }, React.createElement('span', {
      style: {
        fontWeight: 700,
        color: C.accent,
        textTransform: 'uppercase',
        fontSize: '12px',
        letterSpacing: '.08em',
        marginRight: '.5rem'
      }
    }, c.youLabel), s.you));
  };

  // ── How it starts — numbered sequence, not cards ──
  const seq = React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
      gap: mob ? '2rem' : '2.5rem',
      marginTop: '2rem'
    }
  }, c.steps.map((s, i) => React.createElement('div', {
    key: i,
    style: {
      borderTop: `2px solid ${C.accent}`,
      paddingTop: '1rem'
    }
  }, React.createElement('div', {
    style: {
      fontSize: mob ? '30px' : '38px',
      fontWeight: 600,
      letterSpacing: '-.02em',
      color: C.accent,
      lineHeight: 1,
      marginBottom: '.8rem'
    }
  }, s.n), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '.6rem',
      flexWrap: 'wrap',
      marginBottom: '.5rem'
    }
  }, React.createElement('span', {
    style: {
      fontSize: '17px',
      fontWeight: 700,
      color: C.text
    }
  }, s.title), s.tag && React.createElement('span', {
    style: {
      fontSize: '11px',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: C.accent
    }
  }, s.tag)), React.createElement('p', {
    style: {
      fontSize: '15px',
      lineHeight: 1.65,
      color: C.muted,
      margin: 0
    }
  }, s.body))));
  return React.createElement('main', {
    style: {
      width: '100%',
      color: C.text,
      fontFamily: 'inherit'
    }
  },
  // Hero
  React.createElement('section', {
    style: {
      paddingTop: mob ? '2rem' : '4rem'
    }
  }, inner(React.createElement('div', {
    style: mob ? {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem'
    } : {
      display: 'flex',
      gap: '3.5rem',
      alignItems: 'center'
    }
  }, heroText, heroImg))),
  // Service diagram
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('div', {
    style: {
      fontSize: mob ? '13px' : '14px',
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: C.muted,
      textAlign: 'center',
      marginBottom: '2rem'
    }
  }, c.diagLabel), React.createElement(ServiceDiagram, {
    c,
    mob
  })))),
  // Four scenarios
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('h2', {
    style: H2
  }, c.scenLabel), React.createElement('div', {
    style: {
      marginTop: '1.5rem'
    }
  }, c.scenarios.map((s, i) => scenario(s, i)))))),
  // Full-width photography pause (no text)
  React.createElement('section', {
    style: {
      marginTop: gap
    }
  }, React.createElement('img', {
    src: 'https://aggelosmouzakitis.com/img/aggelos-homepage.webp',
    alt: '',
    'aria-hidden': 'true',
    loading: 'lazy',
    decoding: 'async',
    style: {
      width: '100%',
      height: mob ? '220px' : '400px',
      objectFit: 'cover',
      objectPosition: 'center 30%',
      display: 'block'
    }
  })),
  // How it starts
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('h2', {
    style: H2
  }, c.howLabel), seq))),
  // FAQ
  React.createElement('section', {
    style: {
      paddingTop: gap
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement('h2', {
    style: H2
  }, c.faqLabel), React.createElement(FaqAccordion, {
    items: c.faq,
    mob
  })))),
  // Final CTA + footer
  React.createElement('section', {
    style: {
      paddingTop: mob ? '2.5rem' : '3.5rem',
      paddingBottom: mob ? '4rem' : '6rem'
    }
  }, inner(React.createElement(React.Fragment, null, React.createElement(FinalCta, {
    lang,
    mob,
    heading: c.ctaHeading,
    sub: c.ctaSub
  }), React.createElement(SiteFooter, {
    mob,
    lang
  })))));
}

// ─── ABOUT PAGE (bilingual) ──────────────────────────────────────────────────
const ABOUT = {
  en: {
    h1: 'About',
    role: 'Business Advisor + Licensed Psychotherapist',
    creds: 'MSc Integrative Counselling & Psychotherapy (University of Derby) · BACP-registered · Based in Ireland, working globally',
    lead: 'Two careers that kept running into the same problem.',
    intro: ['I spent 18+ years in tech, mostly in product and growth. I built my own companies, worked inside startups and large organisations, and advised more than 500 businesses.', "So if we're talking about your offer, pricing, customer acquisition, a hire, a sale you're avoiding or a business decision you can't settle, you don't need to translate the commercial side for me.", 'I know that world.'],
    sections: [{
      label: "Then psychology started showing up in places it wasn't invited.",
      body: ["Again and again, I'd see a business problem that was only partly a business problem.", 'Someone knew they needed to sell but wouldn’t.', 'Someone kept changing a perfectly reasonable strategy.', 'Someone had hired good people but struggled to let go of control.', 'Someone had enough information to make a decision and kept looking for more.', "The strategy mattered. But it wasn't the whole story.", 'So I trained as a psychotherapist: MSc Integrative Counselling & Psychotherapy at the University of Derby, and registration with the BACP.']
    }, {
      label: 'Then the same thing happened from the other direction.',
      body: ["In psychological work, I'd meet ambitious people dealing with very real business problems.", "And sometimes a psychological explanation wasn't what they needed.", 'Their offer was weak. Their pricing was wrong. They had no reliable way of finding customers. They were making a bad business decision.', "Psychotherapy isn't designed to tell you that."]
    }, {
      label: 'Eventually, the two careers stopped looking random.',
      body: ['Sometimes the problem is clearly business.', "Sometimes it's personal.", "And quite often they collide so much that you can't tell where one ends and the other begins.", "That's the work I find most interesting."]
    }, {
      label: "I'm not here to tell you to want less.",
      body: ["Ambition isn't a symptom.", "I don't want to convince you that wanting a bigger business, more money, more independence or more impact is secretly unhealthy.", 'I want to help you build what you actually want without automatically assuming that either the business or you must be the problem.']
    }],
    ctaHeading: 'Usually, we need to look before we know.',
    ctaLabel: 'See how 1:1 works'
  },
  el: {
    h1: 'Λίγα για μένα',
    role: 'Business Advisor + Ψυχοθεραπευτής',
    creds: 'MSc Integrative Counselling & Psychotherapy (University of Derby) · Εγγεγραμμένος στο BACP · Έδρα στην Ιρλανδία, δουλεύω παγκόσμια',
    lead: 'Δύο καριέρες που κατέληγαν να συναντιούνται συνέχεια.',
    intro: ['Πέρασα 18+ χρόνια στην τεχνολογία, κυρίως στο product και το growth. Έχτισα δικές μου εταιρείες, δούλεψα σε startups και μεγάλους οργανισμούς και συμβούλεψα περισσότερες από 500 επιχειρήσεις.', 'Οπότε αν μιλάμε για offer, pricing, πελάτες, μια πρόσληψη, μια πώληση που αποφεύγεις ή μια business απόφαση που δεν μπορείς να κλείσεις, δεν χρειάζεται να μου εξηγήσεις όλο το context.', 'Αυτόν τον κόσμο τον ξέρω.'],
    sections: [{
      label: 'Κάπου εκεί άρχισε να εμφανίζεται η ψυχολογία εκεί που κανείς δεν την είχε καλέσει.',
      body: ['Ξανά και ξανά έβλεπα business προβλήματα που ήταν μόνο εν μέρει business προβλήματα.', 'Κάποιος ήξερε ότι έπρεπε να πουλήσει και δεν το έκανε.', 'Κάποιος άλλαζε συνέχεια μια απολύτως λογική στρατηγική.', 'Κάποιος είχε προσλάβει καλούς συνεργάτες αλλά δυσκολευόταν να αποδεσμευτεί από το control.', 'Κάποιος είχε αρκετή πληροφορία για να πάρει μια απόφαση και συνέχιζε να ψάχνει κι άλλη.', 'Το business είχε σημασία. Απλώς δεν ήταν όλη η ιστορία.', 'Έτσι εκπαιδεύτηκα ως ψυχοθεραπευτής.']
    }, {
      label: 'Και μετά άρχισα να βλέπω το ίδιο πράγμα από την άλλη πλευρά.',
      body: ['Στην ψυχολογική δουλειά συναντούσα φιλόδοξους ανθρώπους με απολύτως πραγματικά business προβλήματα.', 'Και μερικές φορές αυτό που χρειάζονταν δεν ήταν μια ψυχολογική εξήγηση.', 'Το offer ήταν αδύναμο. Οι τιμές λάθος. Δεν υπήρχε σταθερός τρόπος να έρθουν πελάτες. Ή απλώς η business απόφαση ήταν κακή.', 'Η ψυχοθεραπεία δεν είναι φτιαγμένη για να σε βοηθήσει με αυτό.']
    }, {
      label: 'Κάπως έτσι, οι δύο καριέρες σταμάτησαν να μοιάζουν τόσο random.',
      body: ['Μερικές φορές το πρόβλημα είναι καθαρά business.', 'Μερικές φορές είναι προσωπικό.', 'Και αρκετά συχνά μπλέκονται τόσο, που δεν είναι καθόλου ξεκάθαρο πού τελειώνει το ένα και αρχίζει το άλλο.', 'Αυτό είναι το σημείο που με ενδιαφέρει περισσότερο.']
    }, {
      label: 'Δεν είμαι εδώ για να σου πω να θέλεις λιγότερα.',
      body: ['Η φιλοδοξία δεν είναι σύμπτωμα.', 'Δεν θέλω να σε πείσω ότι το να θέλεις μεγαλύτερο business, περισσότερα χρήματα, περισσότερη ανεξαρτησία ή μεγαλύτερο impact είναι κατά βάθος ανθυγιεινό.', 'Θέλω να σε βοηθήσω να χτίσεις αυτό που πραγματικά θέλεις, χωρίς να υποθέτουμε από πριν ότι το πρόβλημα πρέπει να είναι είτε το business είτε εσύ.']
    }],
    ctaHeading: 'Πρώτα κοιτάμε. Μετά αποφασίζουμε.',
    ctaLabel: 'Δες την 1:1 συνεργασία'
  }
};
function AboutPage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = ABOUT[lang] || ABOUT.en;
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1.1rem 5rem'
  } : widePageStyle;
  const subhead = {
    fontSize: mob ? '20px' : '24px',
    fontWeight: 500,
    letterSpacing: '-.01em',
    lineHeight: 1.3,
    color: C.text,
    margin: mob ? '2.5rem 0 1rem' : '3.25rem 0 1.1rem'
  };
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: '1.25rem',
      fontSize: mob ? '26px' : '32px'
    }
  }, c.h1), React.createElement('div', {
    style: {
      display: 'flex',
      gap: '1.2rem',
      alignItems: 'center',
      marginBottom: '2.25rem',
      paddingBottom: '1.75rem',
      borderBottom: `1px solid ${C.border}`
    }
  }, React.createElement('img', {
    src: 'https://aggelosmouzakitis.com/img/aggelos.webp',
    alt: 'Aggelos Mouzakitis',
    width: 64,
    height: 64,
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
      display: 'block'
    }
  }), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: '12px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: C.accent,
      fontWeight: 700
    }
  }, c.role), React.createElement('div', {
    style: {
      fontSize: '12px',
      letterSpacing: '.04em',
      color: '#767676',
      marginTop: '5px',
      lineHeight: 1.5
    }
  }, c.creds))), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '1.5rem' : '1.75rem'
    }
  }, c.lead), c.intro.map((p, i) => React.createElement(P, {
    key: i,
    last: i === c.intro.length - 1
  }, p)), c.sections.map((s, i) => React.createElement(React.Fragment, {
    key: i
  }, React.createElement('h2', {
    style: subhead
  }, s.label), s.body.map((p, j) => React.createElement(P, {
    key: j,
    last: j === s.body.length - 1
  }, p)))), React.createElement('div', {
    style: {
      marginTop: mob ? '3rem' : '4rem',
      padding: mob ? '1.6rem 1.4rem' : '2.4rem 2.6rem',
      border: `1.5px solid rgba(26,127,55,.4)`,
      background: 'rgba(26,127,55,.06)',
      borderRadius: '14px'
    }
  }, React.createElement('p', {
    style: {
      fontSize: mob ? '19px' : '23px',
      fontWeight: 500,
      letterSpacing: '-.01em',
      lineHeight: 1.5,
      color: C.text,
      margin: 0
    }
  }, c.ctaHeading), React.createElement('a', {
    href: pathFor('one-to-one', lang),
    className: 'cta-btn',
    style: {
      display: 'inline-block',
      marginTop: '1.4rem',
      padding: '.9rem 1.8rem',
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      background: C.accent,
      border: `1.5px solid ${C.accent}`,
      color: '#fff',
      textDecoration: 'none',
      borderRadius: '2px'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#146b2e';
      e.currentTarget.style.borderColor = '#146b2e';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = C.accent;
      e.currentTarget.style.borderColor = C.accent;
    }
  }, c.ctaLabel + ' →')), React.createElement(SiteFooter, {
    mob,
    lang
  }));
}

// ─── REVIEWS (verbatim testimonials — do not rewrite client words) ────────────
// English is the original, spoken language of every testimonial. On the Greek
// page a faithful Greek translation shows first, with the original English
// available via a per-testimonial toggle. Order follows the approved spec.
const REVIEWS_ITEMS = [{
  w: 'Anonymous client, Founder',
  wEl: 'Ανώνυμος πελάτης, Founder',
  q: "I had worked with coaches before, and I had been in therapy before, but this felt different. Aggelos understands the emotional side without losing sight of the actual situation I am dealing with at work. We can talk about pressure, shame or something happening in my body, and five minutes later discuss a decision involving my team or business. I don’t have to translate one world into the other for him.",
  qEl: "Είχα δουλέψει με coaches στο παρελθόν, είχα κάνει και θεραπεία, αλλά αυτό ένιωσα ότι ήταν διαφορετικό. Ο Άγγελος καταλαβαίνει τη συναισθηματική πλευρά χωρίς να χάνει από τα μάτια του την πραγματική κατάσταση που αντιμετωπίζω στη δουλειά. Μπορούμε να μιλήσουμε για πίεση, ντροπή ή για κάτι που συμβαίνει στο σώμα μου, και πέντε λεπτά αργότερα να συζητάμε μια απόφαση που αφορά την ομάδα ή το business μου. Δεν χρειάζεται να του μεταφράζω τον έναν κόσμο στον άλλον."
}, {
  w: 'Anonymous client, Senior professional',
  wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας',
  q: "I came in expecting a fairly standard coaching conversation. Within the first session, Aggelos understood both the professional problem and the emotional mechanism underneath it. He was warm, but very straightforward, and gave me a way of looking at the situation that I had not considered before. I left with more than advice. I left with a more accurate problem.",
  qEl: "Ήρθα περιμένοντας μια αρκετά τυπική συζήτηση coaching. Μέσα στην πρώτη κιόλας συνεδρία, ο Άγγελος κατάλαβε και το επαγγελματικό πρόβλημα και τον συναισθηματικό μηχανισμό από κάτω του. Ήταν ζεστός, αλλά πολύ ευθύς, και μου έδωσε έναν τρόπο να δω την κατάσταση που δεν είχα σκεφτεί πριν. Έφυγα με κάτι παραπάνω από συμβουλές. Έφυγα με ένα πιο ακριβές πρόβλημα."
}, {
  w: 'Anonymous client, Business owner',
  wEl: 'Ανώνυμος πελάτης, Ιδιοκτήτης επιχείρησης',
  q: "I had been forcing a business situation to continue because stopping it felt like failure. After one of our exercises, I realised I was trying to manufacture reasons to keep going when I already knew the answer. I had the difficult conversation shortly afterwards. It was not that Aggelos gave me the decision. He helped me stop fighting what I already knew.",
  qEl: "Πίεζα μια επιχειρηματική κατάσταση να συνεχιστεί, επειδή το να τη σταματήσω έμοιαζε με αποτυχία. Μετά από μία από τις ασκήσεις μας, συνειδητοποίησα ότι προσπαθούσα να κατασκευάσω λόγους για να συνεχίσω, ενώ ήδη ήξερα την απάντηση. Έκανα τη δύσκολη συζήτηση λίγο αργότερα. Δεν ήταν ότι ο Άγγελος μου έδωσε την απόφαση. Με βοήθησε να σταματήσω να παλεύω με αυτό που ήδη ήξερα."
}, {
  w: 'Anonymous client, Founder',
  wEl: 'Ανώνυμος πελάτης, Founder',
  q: "There are no motivational speeches or generic frameworks pasted onto every situation. Aggelos pays attention to how I specifically operate. He remembers the contradictions, notices when I change the story and asks the question I was hoping we could avoid. Annoying at times, but usually accurate.",
  qEl: "Δεν υπάρχουν εμψυχωτικοί λόγοι ή γενικά frameworks κολλημένα πάνω σε κάθε κατάσταση. Ο Άγγελος προσέχει πώς λειτουργώ συγκεκριμένα εγώ. Θυμάται τις αντιφάσεις, αντιλαμβάνεται πότε αλλάζω την ιστορία και κάνει την ερώτηση που έλπιζα ότι θα μπορούσαμε να αποφύγουμε. Ενοχλητικό κάποιες φορές, αλλά συνήθως εύστοχο."
}, {
  w: 'Anonymous client, Founder',
  wEl: 'Ανώνυμος πελάτης, Founder',
  q: "We have been working together for a while now, and the sessions have gradually changed the way I make decisions. Aggelos doesn’t tell me what to do or try to make me dependent on his opinion. He helps me separate the real problem from the fear, ego and old patterns wrapped around it. I usually leave with less noise and a much clearer sense of what is mine to do.",
  qEl: "Δουλεύουμε μαζί εδώ και αρκετό καιρό, και οι συνεδρίες έχουν αλλάξει σταδιακά τον τρόπο που παίρνω αποφάσεις. Ο Άγγελος δεν μου λέει τι να κάνω ούτε προσπαθεί να με κάνει να εξαρτώμαι από τη γνώμη του. Με βοηθά να ξεχωρίσω το πραγματικό πρόβλημα από τον φόβο, το ego και τα παλιά μοτίβα που είναι τυλιγμένα γύρω του. Συνήθως φεύγω με λιγότερο θόρυβο και πολύ πιο καθαρή αίσθηση του τι είναι δικό μου να κάνω."
}, {
  w: 'Anonymous client, Senior tech professional',
  wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας τεχνολογίας',
  q: "The conversations go deeper than ordinary coaching, but I still leave with something usable. Sometimes that is a decision, sometimes a difficult conversation I need to have, and sometimes it is simply noticing the moment my body moves into threat before my mind creates a story around it. It is a rare combination of depth and practicality.",
  qEl: "Οι συζητήσεις πάνε πιο βαθιά από το συνηθισμένο coaching, αλλά και πάλι φεύγω με κάτι αξιοποιήσιμο. Κάποιες φορές είναι μια απόφαση, κάποιες μια δύσκολη συζήτηση που πρέπει να κάνω, και κάποιες φορές είναι απλώς το να παρατηρήσω τη στιγμή που το σώμα μου μπαίνει σε κατάσταση απειλής, πριν το μυαλό μου φτιάξει μια ιστορία γύρω από αυτό. Είναι ένας σπάνιος συνδυασμός βάθους και πρακτικότητας."
}, {
  w: 'Anonymous client, Senior tech professional',
  wEl: 'Ανώνυμος πελάτης, Έμπειρος επαγγελματίας τεχνολογίας',
  q: "Aggelos is direct. He will tell me when I am avoiding something or constructing a very intelligent explanation for why I cannot act. But I have never experienced his directness as judgement. There is enough trust between us that he can challenge me properly, which is exactly what I needed.",
  qEl: "Ο Άγγελος είναι ευθύς. Θα μου πει όταν αποφεύγω κάτι ή όταν κατασκευάζω μια πολύ έξυπνη εξήγηση για το γιατί δεν μπορώ να δράσω. Όμως ποτέ δεν βίωσα την ευθύτητά του ως κριτική. Υπάρχει αρκετή εμπιστοσύνη μεταξύ μας ώστε να μπορεί να με προκαλέσει σωστά, που είναι ακριβώς αυτό που χρειαζόμουν."
}, {
  w: 'Anonymous client, Founder and executive',
  wEl: 'Ανώνυμος πελάτης, Founder και στέλεχος',
  q: "I did not want somebody to tell me to work less, lower my standards or become less ambitious. Aggelos understood that immediately. Our work has been about keeping the part of me that wants to build and achieve, while becoming less dependent on winning, comparison and external approval to feel okay. That distinction has been very important to me.",
  qEl: "Δεν ήθελα κάποιον να μου πει να δουλεύω λιγότερο, να χαμηλώσω τον πήχη ή να γίνω λιγότερο φιλόδοξος. Ο Άγγελος το κατάλαβε αμέσως. Η δουλειά μας ήταν να κρατήσουμε το κομμάτι μου που θέλει να χτίζει και να πετυχαίνει, ενώ ταυτόχρονα γίνομαι λιγότερο εξαρτημένος από το να νικάω, τη σύγκριση και την εξωτερική επιβεβαίωση για να νιώθω καλά. Αυτή η διάκριση ήταν πολύ σημαντική για μένα."
}, {
  w: 'Anonymous client, Consultant and business owner',
  wEl: 'Ανώνυμος πελάτης, Σύμβουλος και ιδιοκτήτης επιχείρησης',
  q: "Before working together, a difficult email or a problem with a client could affect my entire day. I would immediately feel responsible for everything and start trying to control how I was perceived. We traced that response much further back than the immediate work situation. I still feel pressure, but I can recognise it earlier and I no longer believe every conclusion my nervous system produces.",
  qEl: "Πριν αρχίσουμε να δουλεύουμε μαζί, ένα δύσκολο email ή ένα πρόβλημα με έναν πελάτη μπορούσε να επηρεάσει ολόκληρη τη μέρα μου. Ένιωθα αμέσως υπεύθυνος για τα πάντα και άρχιζα να προσπαθώ να ελέγξω το πώς με έβλεπαν. Ανιχνεύσαμε αυτή την αντίδραση πολύ πιο πίσω από την άμεση κατάσταση στη δουλειά. Ακόμα νιώθω πίεση, αλλά μπορώ να την αναγνωρίσω νωρίτερα και δεν πιστεύω πια κάθε συμπέρασμα που παράγει το νευρικό μου σύστημα."
}, {
  w: 'Anonymous client, Technology leader',
  wEl: 'Ανώνυμος πελάτης, Ηγέτης στην τεχνολογία',
  q: "I already understood many of my patterns intellectually. That was partly the problem. I could explain myself very well and still repeat the same behaviour. Working with Aggelos helped me recognise what was happening physically, not just analyse it afterwards. That has made the work much more real and, slowly, changed how I respond under pressure.",
  qEl: "Καταλάβαινα ήδη πολλά από τα μοτίβα μου σε διανοητικό επίπεδο. Αυτό ήταν εν μέρει το πρόβλημα. Μπορούσα να εξηγήσω τον εαυτό μου πολύ καλά και παρ’ όλα αυτά να επαναλαμβάνω την ίδια συμπεριφορά. Η δουλειά με τον Άγγελο με βοήθησε να αναγνωρίζω τι συμβαίνει σε σωματικό επίπεδο, όχι απλώς να το αναλύω εκ των υστέρων. Αυτό έκανε τη δουλειά πολύ πιο πραγματική και, σιγά σιγά, άλλαξε τον τρόπο που αντιδρώ κάτω από πίεση."
}, {
  w: 'Anonymous client, Senior operator',
  wEl: 'Ανώνυμος πελάτης, Έμπειρο στέλεχος',
  q: "One of the most useful things is that Aggelos actually understands the environment I work in. I don’t need to explain corporate politics, startup pressure, targets, investors or why a career decision can feel more complicated than “follow your values.” He understands the game, but he also notices what the game is doing to me.",
  qEl: "Ένα από τα πιο χρήσιμα πράγματα είναι ότι ο Άγγελος πραγματικά καταλαβαίνει το περιβάλλον στο οποίο δουλεύω. Δεν χρειάζεται να του εξηγήσω τα εταιρικά παιχνίδια, την πίεση ενός startup, τα targets, τους επενδυτές ή γιατί μια απόφαση καριέρας μπορεί να είναι πιο περίπλοκη από το «ακολούθησε τις αξίες σου». Καταλαβαίνει το παιχνίδι, αλλά προσέχει και το τι μου κάνει αυτό το παιχνίδι."
}, {
  w: 'Anonymous client',
  wEl: 'Ανώνυμος πελάτης',
  q: "I was initially sceptical about somatic and trauma-informed work because I assumed it would be vague or a bit spiritual. It wasn’t. Aggelos explained what we were doing, paid attention to my limits and connected the experience back to patterns I could recognise in my work and relationships. It felt grounded, careful and surprisingly practical.",
  qEl: "Στην αρχή ήμουν επιφυλακτικός με τη σωματική και trauma-informed δουλειά, γιατί υπέθετα ότι θα ήταν ασαφής ή λίγο «πνευματική». Δεν ήταν. Ο Άγγελος εξήγησε τι κάναμε, έδωσε προσοχή στα όριά μου και σύνδεσε την εμπειρία με μοτίβα που μπορούσα να αναγνωρίσω στη δουλειά και στις σχέσεις μου. Ένιωσα ότι ήταν γειωμένο, προσεκτικό και απροσδόκητα πρακτικό."
}, {
  w: 'Anonymous client, Product leader',
  wEl: 'Ανώνυμος πελάτης, Product leader',
  q: "I trust Aggelos because he is not constantly trying to reassure me. He listens carefully, but he does not automatically agree with the version of events I bring into the session. Sometimes he points out something I would rather not see. Somehow that honesty has made the work feel safer, not less safe.",
  qEl: "Εμπιστεύομαι τον Άγγελο γιατί δεν προσπαθεί συνέχεια να με καθησυχάσει. Ακούει προσεκτικά, αλλά δεν συμφωνεί αυτόματα με την εκδοχή των γεγονότων που φέρνω στη συνεδρία. Κάποιες φορές επισημαίνει κάτι που θα προτιμούσα να μην δω. Κατά κάποιον τρόπο, αυτή η ειλικρίνεια έκανε τη δουλειά να νιώθεται πιο ασφαλής, όχι λιγότερο."
}, {
  w: 'Anonymous client, Technology executive',
  wEl: 'Ανώνυμος πελάτης, Στέλεχος τεχνολογίας',
  q: "I started working with Aggelos during a confusing period in my career. On paper, things were going well, but internally I was questioning almost everything. Over several sessions, he helped me understand which concerns were legitimate and which were being amplified by old fears around performance, failure and how other people saw me. I feel more grounded now, even though not everything has been resolved.",
  qEl: "Άρχισα να δουλεύω με τον Άγγελο σε μια μπερδεμένη περίοδο της καριέρας μου. Στα χαρτιά, τα πράγματα πήγαιναν καλά, αλλά μέσα μου αμφισβητούσα σχεδόν τα πάντα. Μέσα σε αρκετές συνεδρίες, με βοήθησε να καταλάβω ποιες ανησυχίες ήταν βάσιμες και ποιες μεγεθύνονταν από παλιούς φόβους γύρω από την απόδοση, την αποτυχία και το πώς με έβλεπαν οι άλλοι. Νιώθω πιο γειωμένος τώρα, παρότι δεν έχουν λυθεί όλα."
}, {
  w: 'Anonymous client, Tech executive',
  wEl: 'Ανώνυμος πελάτης, Στέλεχος τεχνολογίας',
  q: "From the outside, I was still functioning and performing at a high level, so it was difficult to explain why something felt wrong. Aggelos understood that the problem was not simply workload. We have worked on the way I connect achievement with safety, worth and relief. I am still ambitious, but success is beginning to feel less like narrowly escaping failure.",
  qEl: "Απ’ έξω, εξακολουθούσα να λειτουργώ και να αποδίδω σε υψηλό επίπεδο, οπότε ήταν δύσκολο να εξηγήσω γιατί κάτι ένιωθα ότι δεν πήγαινε καλά. Ο Άγγελος κατάλαβε ότι το πρόβλημα δεν ήταν απλώς ο φόρτος δουλειάς. Δουλέψαμε πάνω στον τρόπο που συνδέω το επίτευγμα με την ασφάλεια, την αξία και την ανακούφιση. Εξακολουθώ να είμαι φιλόδοξος, αλλά η επιτυχία αρχίζει να νιώθεται λιγότερο σαν οριακή διαφυγή από την αποτυχία."
}];
const REVIEWS = {
  en: {
    h1: 'What people say',
    lead: 'A few things people have said after working with me.',
    sub: 'Names and identifying details are removed. The words are theirs.',
    toggle: null,
    ctaHeading: 'It starts with a short, free fit call.'
  },
  el: {
    h1: 'Τι λένε άνθρωποι που έχουν δουλέψει μαζί μου',
    lead: 'Μερικά πράγματα που έχουν πει άνθρωποι μετά τη δουλειά μας.',
    sub: 'Τα ονόματα και τα στοιχεία που θα μπορούσαν να τους ταυτοποιήσουν έχουν αφαιρεθεί. Τα λόγια είναι δικά τους.',
    toggle: 'Αρχικό κείμενο στα αγγλικά',
    ctaHeading: 'Ξεκινά με μια σύντομη, δωρεάν γνωριμία.'
  }
};
function ReviewCard({
  t,
  lang,
  toggleLabel
}) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  const quote = el ? t.qEl : t.q;
  const who = el ? t.wEl : t.w;
  return React.createElement('blockquote', {
    style: {
      breakInside: 'avoid',
      margin: '0 0 1.9rem',
      padding: '0 0 0 1rem',
      borderLeft: '2px solid rgba(26,127,55,0.35)'
    }
  }, React.createElement('p', {
    style: {
      fontSize: '15px',
      lineHeight: 1.8,
      color: '#282726',
      margin: '0 0 .5rem'
    }
  }, '“' + quote + '”'), React.createElement('footer', {
    style: {
      fontSize: '10px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: '#767676'
    }
  }, who), el && React.createElement('button', {
    onClick: () => setOpen(!open),
    'aria-expanded': open ? 'true' : 'false',
    style: {
      marginTop: '.8rem',
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '12px',
      fontWeight: 600,
      color: C.accent,
      letterSpacing: '.02em'
    }
  }, toggleLabel + ' ' + (open ? '↑' : '↓')), el && open && React.createElement('p', {
    style: {
      marginTop: '.7rem',
      paddingTop: '.7rem',
      borderTop: `1px solid ${C.border}`,
      fontSize: '14px',
      lineHeight: 1.75,
      color: C.muted,
      fontStyle: 'italic'
    }
  }, '“' + t.q + '”'));
}
function ReviewsPage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = REVIEWS[lang] || REVIEWS.en;
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1.1rem 5rem'
  } : widePageStyle;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: '1rem',
      fontSize: mob ? '26px' : '32px'
    }
  }, c.h1), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: '.8rem'
    }
  }, c.lead), React.createElement('p', {
    style: {
      fontSize: '15px',
      color: C.muted,
      lineHeight: 1.6,
      marginBottom: mob ? '2rem' : '2.75rem'
    }
  }, c.sub), React.createElement('div', {
    style: {
      columnGap: mob ? 0 : '2.5rem',
      columnCount: mob ? 1 : 2
    }
  }, REVIEWS_ITEMS.map((t, i) => React.createElement(ReviewCard, {
    key: i,
    t,
    lang,
    toggleLabel: c.toggle
  }))), React.createElement(FinalCta, {
    lang,
    mob,
    heading: c.ctaHeading
  }), React.createElement(SiteFooter, {
    mob,
    lang
  }));
}

// ─── SPECIALTY PAGE TEMPLATE ─────────────────────────────────────────────────
function SpecialtyPage({
  pageId
}) {
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
    'confidentiality': ConfidentialityPage
  };
  const Component = pages[pageId];
  return Component ? React.createElement(Component) : null;
}

// ─── PERSONA PAGE SHARED BLOCKS (identical across /founders/, /solopreneurs/, ...) ──
function PersonaWorkSection({
  mob
}) {
  return React.createElement(Section, {
    label: 'So what we actually do',
    mob
  }, React.createElement(P, null, "We talk it through openly. Most of the time I get what's going on fairly quickly, not because I'm Freud, but because I've sat in your seat more than once and I know the terrain."), React.createElement(P, null, "The work runs on two tracks at the same time:"), React.createElement('div', {
    style: {
      margin: '0 0 1.2rem'
    }
  }, React.createElement(TrackCards, {
    mob,
    tracks: [{
      title: 'The inner track',
      body: "See the pattern and where it comes from, then rewire it. Awareness is the first step but not enough on its own, because you don't talk yourself out of something your history spent years building. That takes more than conversation. Sometimes deeper trauma techniques, sometimes behavioural exercises that get you doing the thing you avoid."
    }, {
      title: 'The business track',
      body: "The decision in front of you, the move you need to make, the plan for where you're going. Real, practical and strategic."
    }]
  })), React.createElement(P, {
    last: true
  }, "One without the other doesn't hold. Fixing the inside while the company drifts is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it."));
}
function PersonaTherapyOrCoachingSection({
  mob
}) {
  return React.createElement(Section, {
    label: 'Is this therapy or coaching?',
    mob
  }, React.createElement(P, null, "Neither, cleanly."), React.createElement(P, null, "Therapy? Not by the protocol. I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is supposed to keep. But it's therapy-informed — I'm a licensed psychotherapist — and that training is why I can see what's underneath."), React.createElement(P, null, "Coaching? Not that either. No framework I'll hand you to follow. There are coaching elements in how we work on decisions, but the framework was never the point."), React.createElement(P, {
    last: true
  }, "The honest description: a trusted advisor who's sat in your seat and has the expertise to help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. For a lot of founders it's the one place they can be themselves, not the version they perform for the team, the investors, the cofounder or the partner."));
}
function PersonaHowWeStartSection({
  mob
}) {
  return React.createElement(Section, {
    label: 'How we start',
    mob
  }, React.createElement(StepCards, {
    mob,
    steps: [{
      n: '1',
      title: 'Fit call',
      tag: '~15 min · free',
      body: "Not a session, just to see if we click or if you can't stand me. Both fine."
    }, {
      n: '2',
      title: 'Paid session',
      tag: 'one session',
      body: "You bring the problem as you see it. We find the one underneath. You leave with a clear read and one real move. Worth it even if we stop there."
    }, {
      n: '3',
      title: 'Ongoing',
      tag: "if it's worth it",
      body: "Private, one to one, for as long as it's genuinely useful. Not a session longer."
    }]
  }), React.createElement('div', {
    style: {
      marginTop: '1.4rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →')));
}
function PatternList({
  items
}) {
  const mob = useIsMobile();
  return React.createElement('div', {
    style: {
      ...cardBase,
      overflow: 'hidden',
      margin: '.4rem 0 1.4rem'
    }
  }, items.map(function (it, i) {
    if (mob) {
      return React.createElement('div', {
        key: i,
        className: 'hv-row',
        style: {
          padding: '.8rem 1rem',
          borderTop: i ? `1px solid ${C.border}` : 'none',
          fontSize: '15px',
          lineHeight: 1.55
        }
      }, React.createElement('div', {
        style: {
          fontWeight: 700,
          color: C.text,
          marginBottom: '.15rem'
        }
      }, it.cause), React.createElement('div', {
        style: {
          color: C.text
        }
      }, React.createElement('span', {
        style: {
          color: C.accent,
          fontWeight: 700,
          marginRight: '.4rem'
        }
      }, '→'), it.effect));
    }
    return React.createElement('div', {
      key: i,
      className: 'hv-row',
      style: {
        display: 'grid',
        gridTemplateColumns: '246px 26px 1fr',
        alignItems: 'baseline',
        padding: '.95rem 1.3rem',
        borderTop: i ? `1px solid ${C.border}` : 'none',
        fontSize: '15px',
        lineHeight: 1.55
      }
    }, React.createElement('span', {
      style: {
        fontWeight: 700,
        color: C.text
      }
    }, it.cause), React.createElement('span', {
      style: {
        color: C.accent,
        fontWeight: 700,
        textAlign: 'center'
      }
    }, '→'), React.createElement('span', {
      style: {
        color: C.text
      }
    }, it.effect));
  }));
}

// ─── FOR FOUNDERS ────────────────────────────────────────────────────────────
function ForFoundersPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'Founder advisory for business problems that trace back to you'), React.createElement(Section, {
    label: 'What you came here for',
    mob
  }, React.createElement(P, null, "You came here about something either business-related that gives you stress, activates inner criticism or prevents you from reaching your goals."), React.createElement(P, {
    last: true
  }, "If you're reading this instead of booking another consultant, part of you already suspects it isn't necessarily a strategy problem. You'd give someone else in your position the right advice without blinking, and you still don't do it yourself. That gap is the tell, and there's usually a reason you're ready to ask for some help now, this month, and not before.")), React.createElement(Section, {
    label: 'What it usually turns out to be',
    mob
  }, React.createElement(P, null, "Most of the time it traces back to a pattern in you. Usually not the one you assume and definitely not the one ChatGPT suggested."), React.createElement(P, null, "Some founders name the wrong cause entirely, such as calling the procrastination laziness or the burnout overwork. Others have a sharp, honest read on it but still don't know how to get rid of it. Knowing the pattern and being free of it are different jobs. ", React.createElement(A, {
    href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/'
  }, "The same brain that built it can't reason its way out of it"), ", however smart you are."), React.createElement(P, null, "And it doesn't stay only with you, of course, but gets spilled one way or another into your business:"), React.createElement(PatternList, {
    items: [{
      cause: 'You avoid discomfort',
      effect: 'sales, hiring, firing, pricing and fundraising all keep sliding'
    }, {
      cause: 'You need control',
      effect: 'nothing scales past you'
    }, {
      cause: 'You need to be liked',
      effect: 'the team stays pleasant and a little weak'
    }, {
      cause: "You can't sit with uncertainty",
      effect: 'strategy turns slow, reactive, over-validated'
    }, {
      cause: 'Your worth is fused to output',
      effect: "burnout becomes the company's normal speed"
    }, {
      cause: "You're scared of being exposed",
      effect: 'metrics, feedback and bad news start to feel like threats'
    }, {
      cause: 'You feel alone at the top',
      effect: React.createElement(A, {
        href: '/blog/the-loneliness-and-emotional-pressure-that-founders-experience/'
      }, "you lose your read on what's real")
    }]
  }), React.createElement('div', {
    style: {
      marginTop: '1.2rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(PersonaWorkSection, {
    mob
  }), React.createElement(PersonaTherapyOrCoachingSection, {
    mob
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'A real example',
    mob
  }, React.createElement(P, null, "A founder came in having lost his motivation. He'd built the company, stopped caring about it, and wanted the drive back. He felt like a failure, was quietly planning his escape, and his marriage was strained because the obsessiveness and the hours had been bleeding into home."), React.createElement(P, {
    last: true
  }, "We didn't chase the motivation. We worked through the low period so he could think again, then got underneath it, to where the failure feeling came from and why the drive had drained out. Once that was clear, the business decisions stopped feeling impossible. We built a plan for the next chapter, including a clean exit, and he did the work at home. He didn't need more motivation. He needed to understand ", React.createElement(A, {
    href: '/blog/what-lost-purpose-actually-means-for-many-high-performers/'
  }, 'what had happened to it'), ".")), React.createElement(Testimonials, {
    mob,
    label: 'What founders say',
    items: [{
      q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my team. I don't have to translate one world into the other.",
      w: 'Anonymous, founder'
    }, {
      q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.",
      w: 'Anonymous, founder'
    }, {
      q: "I didn't want someone telling me to work less or be less ambitious. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.",
      w: 'Anonymous, founder'
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, null, "Startup and tech founders, ideally in Europe, the US or Canada, mostly for timezones."), React.createElement(P, {
    last: true
  }, "I work with a few people at a time and care more about fit than volume. Not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the company actually needs. It runs both ways, with rights and obligations on both sides.")), React.createElement(PersonaHowWeStartSection, {
    mob
  }), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── FOR SOLOPRENEURS ────────────────────────────────────────────────────────
function SolopreneursPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'Solopreneur advisory for business problems that trace back to you'), React.createElement(Section, {
    label: 'What you came here for',
    mob
  }, React.createElement(P, null, "You came here about your one-person business. Typical things I've heard so far include things you avoid, things you are overthinking, things you are afraid of, lack of focus, procrastination and more. The common thread is that they start inside you but get spilled into your business."), React.createElement(P, {
    last: true
  }, "If you're reading this instead of buying another course or joining another community, part of you already suspects you ", React.createElement(Strong, null, "might not need tactical advice only"), ". You'd tell someone else in your position exactly what to do without blinking, and you still don't do it. That tells it all. And there's usually a reason it came up now, this month, and not before.")), React.createElement(Section, {
    label: 'What it usually turns out to be',
    mob
  }, React.createElement(P, null, "In lots of cases it traces back to a pattern in you, and usually not the one you assume nor the one ChatGPT eloquently tells you."), React.createElement(P, null, "Some people name the wrong cause completely. Others have a sharp, honest read on it and still can't shift it. Knowing the pattern and being free of it are different jobs. ", React.createElement(A, {
    href: '/blog/self-analysis-as-a-meta-way-to-maintain-control/'
  }, "The same brain that built it can't reason its way out"), ", however smart you are."), React.createElement(P, null, "Unfortunately, when you work alone, such patterns run straight into the business:"), React.createElement(PatternList, {
    items: [{
      cause: 'You avoid being seen',
      effect: 'no content, no outbound, no clear opinion, weak demand'
    }, {
      cause: "You're uncomfortable charging",
      effect: 'you undercharge, then resent the work'
    }, {
      cause: 'You need to be liked',
      effect: 'bad clients get in, scope creeps, boundaries go'
    }, {
      cause: "You don't trust your own read",
      effect: 'you keep switching niche, offer, direction'
    }, {
      cause: "A 'no' feels personal",
      effect: 'so you keep postponing exposure'
    }, {
      cause: "You're in your own head all day",
      effect: 'decisions go in circles and the drift builds up quietly'
    }, {
      cause: 'You confuse thinking with doing',
      effect: React.createElement(A, {
        href: '/blog/the-high-cost-of-endless-pondering/'
      }, 'lots of refining, almost no selling')
    }]
  }), React.createElement('div', {
    style: {
      marginTop: '1.2rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'So what we actually do',
    mob
  }, React.createElement(P, null, "We talk it through openly. Most of the time I get what's going on fairly quickly, not because I'm Carl Jung, but because I've done the job-to-solo-and-back journey myself more than once, including building this practice right now, and I know the terrain. And in 2026, I am telling you, it's brutal, both practically and emotionally."), React.createElement(P, null, "The work runs on two tracks at the same time:"), React.createElement('div', {
    style: {
      margin: '0 0 1.2rem'
    }
  }, React.createElement(TrackCards, {
    mob,
    tracks: [{
      title: 'The inner track',
      body: "See the pattern and where it comes from, then rewire it. Awareness is the first step but not enough on its own, because you don't talk yourself out of something your history spent years building. That takes more than conversation: sometimes deeper techniques, sometimes behavioural exercises that get you doing the thing you avoid, like actually sending the outreach or holding the price."
    }, {
      title: 'The business track',
      body: "The decision in front of you, the offer, the pricing, the move you need to make, the plan for where you're going. Real, practical, strategic."
    }]
  })), React.createElement(P, {
    last: true
  }, "One without the other doesn't hold. Fixing the inside while the pipeline dries up is useless. Pushing the business while the same pattern sabotages you is exhausting, and you already know that, because you've tried it.")), React.createElement(Section, {
    label: 'Is this therapy or coaching?',
    mob
  }, React.createElement(P, null, "Neither, cleanly."), React.createElement(P, null, "Therapy? Not by the protocol. I'm more direct and action-oriented, I make suggestions early, and I break a lot of the etiquette a therapist is supposed to keep. But it's therapy-informed — I'm a licensed psychotherapist — and that training is why I can see what's underneath."), React.createElement(P, null, "Coaching? Not that either. No framework I'll hand you to follow. There are coaching elements in how we work on decisions and pricing and positioning, but the framework was never the point."), React.createElement(P, {
    last: true
  }, "The honest description: a trusted advisor who's built his own thing and has the expertise to help you sort yourself out and hit your goals. Someone who cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face. When you work alone, this is often the one place you get an honest mirror, and the one place you can be yourself, not the version you perform for clients, your audience or your partner.")), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'A real example',
    mob
  }, React.createElement(P, null, "Someone came to me running his own consultancy. He was doing well, but it didn't feel that way to him. He asked how to grow the business, and underneath that he was worried he wasn't successful enough, stuck doing all the execution himself, running on fight or flight with clients and taking every bit of criticism badly."), React.createElement(P, null, "All that stress had piled into one conclusion: that he wasn't cut out to run a business at all. That was false, but it's a normal place to land when you spend long enough powering through your own resentment. Most of it traced back to ", React.createElement(A, {
    href: '/blog/the-parent-archetypes-creating-high-performers-with-chronic-self-doubt/'
  }, 'older family patterns that were still running'), ", the same ones showing up in his marriage. The business problems were almost a copy of what he was dealing with in himself."), React.createElement(P, {
    last: true
  }, "Over about six months that turned around. He got his confidence back, started doing things he'd written off as not for him, and grew the business by focusing on the parts he liked and outsourcing the rest. He worked on those patterns everywhere they showed up, not just at work. He didn't need a growth tactic. He needed to stop treating an old story about himself as fact.")), React.createElement(Testimonials, {
    mob,
    label: 'What clients say',
    items: [{
      q: "I had worked with coaches before, and I'd been in therapy before, but this felt different. He understands the emotional side without losing sight of the actual situation at work. We can talk about pressure or shame, and five minutes later a decision involving my business. I don't have to translate one world into the other.",
      w: 'Anonymous, solopreneur'
    }, {
      q: "No motivational speeches or generic frameworks pasted onto every situation. He pays attention to how I specifically operate, notices when I change the story, and asks the question I was hoping we'd avoid. Annoying at times, usually accurate.",
      w: 'Anonymous, solopreneur'
    }, {
      q: "I didn't want someone telling me to lower my standards or want less. The work has been about keeping the part of me that wants to build, while becoming less dependent on winning and approval to feel okay.",
      w: 'Anonymous, solopreneur'
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, null, "Solopreneurs, independent consultants and freelancers in tech, ideally in Europe, the US or Canada, mostly for timezones."), React.createElement(P, {
    last: true
  }, "I work with a few people at a time and care more about fit than volume. I'm not here to manage egos or hand you a silver-bullet plan, because nobody has one. I'm here to be your advisor, closer to a friend with real expertise, who helps you become the version of yourself the business actually needs. It runs both ways, with rights and obligations on both sides.")), React.createElement(PersonaHowWeStartSection, {
    mob
  }), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── HOW I WORK ──────────────────────────────────────────────────────────────
// ─── SHARED VISUAL BLOCKS (numbered step cards + two-track cards) ─────────────
const cardBase = {
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
  background: '#FFFFFF'
};
function Kicker({
  children
}) {
  return React.createElement('h2', {
    style: {
      fontSize: '17px',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: C.muted,
      margin: '0 0 1.2rem',
      lineHeight: 1.5,
      textWrap: 'balance'
    }
  }, children);
}
function StepCards({
  mob,
  steps
}) {
  return React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
      gap: mob ? '.9rem' : '1rem',
      alignItems: 'stretch'
    }
  }, steps.map(function (s, i) {
    return React.createElement('div', {
      key: i,
      className: 'hv-card',
      style: {
        ...cardBase,
        padding: mob ? '1.15rem 1.15rem 1.25rem' : '1.35rem 1.3rem 1.45rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '.7rem'
      }
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '.65rem'
      }
    }, React.createElement('span', {
      style: {
        width: '30px',
        height: '30px',
        flexShrink: 0,
        borderRadius: '50%',
        background: C.accent,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        fontWeight: 700,
        lineHeight: 1
      }
    }, s.n), React.createElement('span', {
      style: {
        fontSize: '17px',
        fontWeight: 700,
        color: C.text
      }
    }, s.title)), s.tag && React.createElement('span', {
      style: {
        alignSelf: 'flex-start',
        fontSize: '11px',
        letterSpacing: '.05em',
        textTransform: 'uppercase',
        color: C.accent,
        background: 'rgba(26,127,55,0.08)',
        border: '1px solid rgba(26,127,55,0.25)',
        borderRadius: '999px',
        padding: '.2rem .65rem'
      }
    }, s.tag), React.createElement('p', {
      style: {
        fontSize: '15px',
        lineHeight: 1.65,
        color: C.text,
        margin: 0
      }
    }, s.body));
  }));
}
function TrackCards({
  mob,
  tracks
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: mob ? 'column' : 'row',
      gap: mob ? '.9rem' : '1rem',
      alignItems: 'stretch'
    }
  }, tracks.map(function (t, i) {
    return React.createElement('div', {
      key: i,
      className: 'hv-card',
      style: {
        ...cardBase,
        padding: mob ? '1.15rem' : '1.35rem',
        flex: 1
      }
    }, React.createElement('h3', {
      style: {
        fontSize: '17px',
        fontWeight: 700,
        color: C.text,
        margin: '0 0 .5rem'
      }
    }, t.title), React.createElement('p', {
      style: {
        fontSize: '15px',
        lineHeight: 1.65,
        color: C.text,
        margin: 0
      }
    }, t.body));
  }));
}
function HowIWorkPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1.1rem 5rem'
  } : widePageStyle;
  const kicker = txt => React.createElement(Kicker, null, txt);
  const block = {
    marginBottom: mob ? '2.75rem' : '3.5rem'
  };
  const note = (children, last) => React.createElement('p', {
    style: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: C.muted,
      margin: last ? '1.1rem 0 0' : '1.1rem 0 .3rem'
    }
  }, children);
  const cadenceRow = (phase, rhythm, desc, first) => React.createElement('tr', {
    className: 'hv-row'
  }, React.createElement('td', {
    style: {
      width: mob ? '38%' : '32%',
      verticalAlign: 'top',
      padding: mob ? '.85rem .8rem' : '1rem 1.2rem',
      borderTop: first ? 'none' : `1px solid ${C.border}`,
      fontSize: '16px',
      fontWeight: 700,
      color: C.text
    }
  }, phase), React.createElement('td', {
    style: {
      verticalAlign: 'top',
      padding: mob ? '.85rem .8rem' : '1rem 1.2rem',
      borderTop: first ? 'none' : `1px solid ${C.border}`,
      fontSize: '15px',
      lineHeight: 1.6,
      color: C.text
    }
  }, React.createElement('span', {
    style: {
      color: C.accent,
      fontWeight: 700
    }
  }, rhythm + '. '), desc));
  const notLine = txt => React.createElement('li', {
    style: {
      display: 'flex',
      gap: '.7rem',
      alignItems: 'baseline',
      padding: '.55rem 0',
      fontSize: '16px',
      lineHeight: 1.55,
      color: C.text
    }
  }, React.createElement('span', {
    style: {
      color: '#c0392b',
      fontWeight: 700,
      flexShrink: 0,
      fontSize: '15px'
    }
  }, '✕'), React.createElement('span', null, txt));
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.25rem' : '1.5rem',
      fontSize: mob ? '26px' : '32px'
    }
  }, 'How I work'), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '2.5rem' : '3.5rem'
    }
  }, "It's a private advisory relationship, one to one, and it runs in three steps."), React.createElement('section', {
    style: block
  }, kicker('The three steps'), React.createElement(StepCards, {
    mob,
    steps: [{
      n: '1',
      title: 'Fit call',
      tag: '~15 min · free',
      body: "We see if we click, or if you can't stand me. Not a session. Just so neither of us wastes the other's time."
    }, {
      n: '2',
      title: 'Paid session',
      tag: 'one session',
      body: "You bring the problem the way you see it. We find the one that's actually brewing underneath it. You leave with a clear read and one real move, documented in a handover. Worth it even if we stop here."
    }, {
      n: '3',
      title: 'Ongoing',
      tag: "if it's worth it",
      body: "Private, one to one, for as long as it's genuinely useful. Not a session longer."
    }]
  }), note("Most people start at the fit call, but if you already know you want to work and just want to get going, you can skip straight to the paid session.", true)), React.createElement('section', {
    style: block
  }, kicker('What the ongoing work looks like'), React.createElement('p', {
    style: {
      fontSize: '16px',
      lineHeight: 1.7,
      color: C.text,
      margin: '0 0 1.1rem'
    }
  }, "If we continue, it runs on two tracks at the same time."), React.createElement(TrackCards, {
    mob,
    tracks: [{
      title: 'The inner track',
      body: "We find the pattern that's actually driving the problem, then work to rewire it. Awareness first, then the real change, which usually takes more than talking."
    }, {
      title: 'The business track',
      body: "The decision in front of you, the move you need to make, the plan for where you're going. Practical and strategic."
    }]
  }), note("In between sessions, I study our calls, we might monitor your biomarkers together, and I set exercises, diagnostics and measurement techniques so we have a benchmark in place."), note("One without the other doesn't hold, so we don't split them.", true)), React.createElement('section', {
    style: block
  }, kicker('Cadence'), React.createElement('div', {
    style: {
      ...cardBase,
      overflow: 'hidden'
    }
  }, React.createElement('table', {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, React.createElement('tbody', null, cadenceRow('First few months', 'Weekly', 'Builds momentum and trust. The work compounds instead of resetting every session.', true), cadenceRow('After that', 'Flexible', "Once the rhythm is there, we can space it out. It stays as long as it's useful to you.")))), note("Between sessions you can reach me when something real comes up. Not a 24/7 line, but you're not on your own until the next slot either.", true)), React.createElement('section', {
    style: block
  }, kicker('What it costs'), React.createElement('div', {
    className: 'hv-card',
    style: {
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.accent}`,
      borderRadius: '10px',
      background: 'rgba(26,127,55,0.04)',
      padding: mob ? '1.15rem' : '1.35rem 1.5rem',
      fontSize: '16px',
      lineHeight: 1.7,
      color: C.text
    }
  }, "I keep the number of clients small, so I can go deep with each one. I'll give you the specifics on the fit call. What I'll say here is this is ", React.createElement('span', {
    style: {
      fontWeight: 700
    }
  }, 'premium, ongoing, and priced as a monthly engagement'), ", not by the hour.")), React.createElement('section', {
    style: block
  }, kicker('What this is not'), React.createElement('ul', {
    style: {
      listStyle: 'none',
      margin: '0 0 1.4rem',
      padding: 0
    }
  }, notLine("Not therapy by the protocol, though it's therapy-informed."), notLine("Not coaching with a framework, though it has coaching in it."), notLine("Not a course, not a program, not a plan I hand you and disappear.")), React.createElement('div', {
    className: 'hv-card',
    style: {
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.accent}`,
      borderRadius: '10px',
      background: 'rgba(26,127,55,0.04)',
      padding: mob ? '1.15rem' : '1.35rem 1.5rem',
      fontSize: '16px',
      lineHeight: 1.7,
      color: C.text
    }
  }, "It's a trusted advisory relationship with someone who's sat where you're sitting, cares how this goes, won't reject you for anything you say, and will still tell you the hard thing to your face."), React.createElement('div', {
    style: {
      marginTop: '1.6rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── BOOK A FIT CALL ─────────────────────────────────────────────────────────
const BOOK = {
  en: {
    h1: 'Book a fit call',
    intro: ["15 minutes to tell me what you're building, what's going on and whether it makes sense for us to work together.", "You don't need to prepare anything.", "This isn't a free session and I'm not going to squeeze a sales pitch into fifteen minutes.", "Tell me the real situation. I'll ask a few questions.", "If I think I can help, I'll tell you what the next step looks like.", "If I don't, I'll tell you that too. Politely. Probably."],
    bookBelow: 'Book below',
    emailPre: "Can't find a slot, or prefer email? Reach me at ",
    crossLead: 'Not sure whether to book?',
    crossBody: 'Take the Starting Diagnostic first and give me a little more context.',
    crossBtn: 'Take the Starting Diagnostic'
  },
  el: {
    h1: 'Κλείσε μια γνωριμία',
    intro: ['15 λεπτά για να μου πεις τι χτίζεις, τι συμβαίνει και αν έχει νόημα να δουλέψουμε μαζί.', 'Δεν χρειάζεται να προετοιμάσεις τίποτα.', 'Δεν είναι δωρεάν συνεδρία και δεν πρόκειται να στριμώξω sales pitch σε δεκαπέντε λεπτά.', 'Πες μου την πραγματική κατάσταση. Θα σου κάνω μερικές ερωτήσεις.', 'Αν πιστεύω ότι μπορώ να βοηθήσω, θα σου πω ποιο είναι το επόμενο βήμα.', 'Αν όχι, θα σου το πω κι αυτό. Ευγενικά. Μάλλον.'],
    bookBelow: 'Κλείσε ραντεβού παρακάτω',
    emailPre: 'Δεν βρίσκεις διαθέσιμη ώρα ή προτιμάς email; Βρες με στο ',
    crossLead: 'Δεν είσαι ακόμα σίγουρος αν θέλεις να κλείσεις;',
    crossBody: 'Κάνε πρώτα το Starting Diagnostic και δώσε μου λίγο περισσότερο context.',
    crossBtn: 'Starting Diagnostic'
  }
};
function BookPage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = BOOK[lang] || BOOK.en;
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
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
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.25rem' : '1.5rem',
      fontSize: mob ? '24px' : '30px'
    }
  }, c.h1), c.intro.map((p, i) => React.createElement(P, {
    key: i,
    last: i === c.intro.length - 1
  }, p)), React.createElement('h2', {
    style: {
      ...h2Style,
      color: C.accent,
      margin: mob ? '2.25rem 0 1.1rem' : '2.75rem 0 1.2rem'
    }
  }, c.bookBelow), React.createElement('div', {
    className: 'calendly-inline-widget',
    'data-url': 'https://calendly.com/aggelosmouzakitis/one-to-one',
    style: {
      minWidth: '320px',
      height: '700px',
      marginBottom: '1.5rem'
    }
  }), React.createElement(P, {
    last: true
  }, c.emailPre, React.createElement(IA, {
    href: 'mailto:aggelos.mouzakitis@gmail.com'
  }, 'aggelos.mouzakitis@gmail.com'), "."), React.createElement('div', {
    style: {
      marginTop: mob ? '2.5rem' : '3rem',
      padding: mob ? '1.5rem 1.4rem' : '1.8rem 2rem',
      border: `1px solid ${C.border}`,
      background: '#fff',
      borderRadius: '14px'
    }
  }, React.createElement('p', {
    style: {
      fontSize: mob ? '17px' : '18px',
      fontWeight: 600,
      color: C.text,
      margin: '0 0 .5rem'
    }
  }, c.crossLead), React.createElement('p', {
    style: {
      fontSize: '16px',
      lineHeight: 1.65,
      color: C.muted,
      margin: '0 0 1.1rem'
    }
  }, c.crossBody), React.createElement(IA, {
    href: pathFor('diagnostic', lang)
  }, c.crossBtn + ' →')), React.createElement(SiteFooter, {
    mob,
    lang
  }));
}

// ─── THERAPY FOR EXECUTIVES ──────────────────────────────────────────────────
function ExecTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  const mobSection = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const mobH2 = mob ? {
    ...h2Style,
    paddingBottom: '.4rem',
    display: 'block'
  } : h2Style;
  const mobH1 = mob ? {
    ...h1Style,
    fontSize: '20px'
  } : h1Style;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'Therapy for executives who have done everything right and still feel like something is off'), React.createElement(Section, {
    label: 'The problem',
    mob
  }, React.createElement(P, null, "You're good at your job. You know that. But somewhere along the way the cost of doing it well started to change, and ", React.createElement(Strong, null, "no amount of delegation, time off, or strategy adjustment seems to touch it"), ". The work gets done, the results are there, but something underneath has shifted."), React.createElement(P, null, "For some people it's the ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure'
  }, 'isolation that comes with seniority'), ". For others it's an identity that has slowly become inseparable from output, to the point where slowing down feels dangerous. Or it's the persistent feeling of being one mistake away from losing everything you've built, even though the evidence says otherwise."), React.createElement(P, {
    last: true
  }, "These aren't problems that another offsite or another framework will solve. They tend to need a different kind of attention.")), React.createElement(Section, {
    label: 'What executive therapy is',
    mob
  }, React.createElement(P, null, "Executive therapy is psychotherapy for people in senior professional roles. ", React.createElement(Strong, null, "Not coaching with a different label, and not a softer version of clinical work."), " It takes the professional context seriously rather than treating it as background noise, and it goes deeper than performance optimization into the patterns that actually drive behaviour."), React.createElement(P, null, "It looks at things like ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing'
  }, 'why identity becomes inseparable from output'), ", why success doesn't settle the internal question it was supposed to answer, and why certain interpersonal dynamics at work keep repeating."), React.createElement(P, {
    last: true
  }, "The difference between an executive therapist and a general therapist is mostly context. If your therapist needs half the session just to understand what happened in your week, that's time spent on orientation rather than the actual work.")), React.createElement(Section, {
    label: 'How I work',
    mob
  }, React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS. I've led growth strategy at startups and inside ", React.createElement(A, {
    href: 'https://www.ibm.com'
  }, 'IBM'), "'s enterprise portfolio, and I've ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'advised 500+ companies'), " on the kind of work my clients carry into sessions every week."), React.createElement(P, null, React.createElement(Strong, null, "That means I already understand the environment you're operating in."), " We don't have to spend time on context-setting, which lets us get to the real work faster."), React.createElement(P, null, "The work combines three things: high-trust advisory grounded in your real context, nervous system regulation so pressure stops running the show physically, and data from wearables that makes invisible stress patterns visible."), React.createElement(P, null, "A lot of it is what I call strategic detachment: learning to play the professional roles, handle pressure, and navigate business dynamics without turning every interaction into a referendum on your worth. The goal isn't less ambition. It's ambition that finally feels fulfilling."), React.createElement(P, {
    last: true
  }, "I write about the psychology of ambition and performance at ", React.createElement(A, {
    href: 'https://undisguised.io'
  }, 'Undisguised'), " (5,000+ subscribers). The writing explores the patterns. The private work is where we actually address them.")), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, null, "Founders, VPs, directors, and senior ICs in tech. People who are doing well by any external measure and still feel like something isn't working. Some common threads:"), React.createElement(P, null, React.createElement(Strong, null, "Chronic self-doubt alongside strong performance."), " ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high'
  }, 'Achievement patterns tied to early approval-seeking'), " that were never examined. Decision paralysis that isn't really about the decision. Burnout that rest doesn't fix. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering'
  }, 'Overthinking that has become a default setting'), " rather than a useful tool."), React.createElement(P, {
    last: true
  }, "If you're used to solving problems through effort and analysis, and this particular one isn't responding to either, it might be worth a conversation.")), React.createElement(Section, {
    label: 'How it works',
    mob
  }, React.createElement(P, null, "All sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Most clients are across Europe and the US. Sessions run weekly or biweekly."), React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We use it to figure out what's actually going on and whether working together makes sense. If it doesn't, I'll say so."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement('div', null, React.createElement(FaqItem, {
    q: 'What is executive therapy, exactly?'
  }, React.createElement(P, {
    last: true
  }, "Psychotherapy for people in leadership and senior roles. It goes beyond performance optimization into the patterns and internal dynamics that shape how you lead, make decisions, and relate to others. It works best when the therapist understands the professional context, not just the clinical side.")), React.createElement(FaqItem, {
    q: 'How is this different from executive coaching?'
  }, React.createElement(P, {
    last: true
  }, "Coaching tends to focus on skills and strategy. Therapy works with what's underneath: why you're stuck, why certain patterns keep repeating, why approaches that used to work have stopped working. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility'
  }, 'A lot of what gets called coaching'), " actually needs therapeutic depth to address properly.")), React.createElement(FaqItem, {
    q: "I'm not sure if I need therapy or coaching. How do I decide?"
  }, React.createElement(P, {
    last: true
  }, "If the challenge is situational and skill-based, coaching is usually enough. If the same patterns keep appearing across different roles, relationships, and decisions, and ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting'
  }, 'you suspect the real obstacle is internal'), ", that's more likely therapy territory. Starting with therapy often makes later coaching more useful.")), React.createElement(FaqItem, {
    q: 'Can analytical people benefit from therapy?'
  }, React.createElement(P, {
    last: true
  }, React.createElement(A, {
    href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain'
  }, 'Self-analysis can become a way to maintain control'), " rather than a path to change. Good therapy works with that pattern rather than being fooled by it.")), React.createElement(FaqItem, {
    q: 'Is this available remotely?'
  }, React.createElement(P, {
    last: true
  }, "Yes. All sessions are online. Most clients prefer it for flexibility and privacy.")))), React.createElement(Testimonials, {
    mob,
    items: [{
      q: "One of the most useful things is that Aggelos actually understands the environment I work in. I don\u2019t need to explain corporate politics, startup pressure, targets, investors or why a career decision can feel more complicated than \u201cfollow your values.\u201d He understands the game, but he also notices what the game is doing to me.",
      w: "Anonymous client, Senior operator"
    }, {
      q: "Aggelos is direct. He will tell me when I am avoiding something or constructing a very intelligent explanation for why I cannot act. But I have never experienced his directness as judgement. There is enough trust between us that he can challenge me properly, which is exactly what I needed.",
      w: "Anonymous client, Senior tech professional"
    }, {
      q: "I came in expecting a fairly standard coaching conversation. Within the first session, Aggelos understood both the professional problem and the emotional mechanism underneath it. He was warm, but very straightforward, and gave me a way of looking at the situation that I had not considered before. I left with more than advice. I left with a more accurate problem.",
      w: "Anonymous client, Senior professional"
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Next step',
    mob
  }, React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We use it to figure out what's going on and whether working together makes sense."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── THERAPY FOR FOUNDERS ────────────────────────────────────────────────────
function FoundersTherapyPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  const mobSection = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const mobH2 = mob ? {
    ...h2Style,
    paddingBottom: '.4rem',
    display: 'block'
  } : h2Style;
  const mobH1 = mob ? {
    ...h1Style,
    fontSize: '20px'
  } : h1Style;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'Therapy for founders who have no one to be honest with about what this actually costs'), React.createElement(Section, {
    label: 'The founder problem',
    mob
  }, React.createElement(P, null, "There's a ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-loneliness-and-emotional-pressure'
  }, 'particular kind of isolation that founders experience'), " that's different from ordinary loneliness. You're surrounded by people who depend on you, and ", React.createElement(Strong, null, "precisely because they depend on you, none of them can be the person you're fully honest with"), " about what it costs to hold everything together."), React.createElement(P, null, "So you perform. Certainty in board meetings, calm in all-hands, optimism for your co-founder. Over time the gap between what you project and what you actually feel becomes its own source of exhaustion, sometimes the biggest one."), React.createElement(P, {
    last: true
  }, "This isn\u2019t something coaching or \u201cmental fitness\u201d apps are designed to address. It\u2019s a structural psychological burden that comes with the role, and it usually needs proper therapeutic work.")), React.createElement(Section, {
    label: 'What I see in founders',
    mob
  }, React.createElement(P, null, "Having worked with founders both as a ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'growth advisor'), " and as a therapist, the patterns are fairly consistent. ", React.createElement(Strong, null, "Identity tends to fuse completely with the company"), " — when it's up you're up, when it's down you disappear into it. There's often no stable sense of self that exists independently of the last metric you checked."), React.createElement(P, {
    last: true
  }, "Decision fatigue becomes chronic, and it stops being about the decisions themselves. It's about the weight of being the person who has to make them. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering'
  }, 'Overthinking becomes a default mode'), " that feels productive but mostly produces exhaustion. Relationships suffer, not because you don't care, but because ", React.createElement(Strong, null, "there's nothing left after the company takes its share"), ".")), React.createElement(Section, {
    label: 'Why I understand this',
    mob
  }, React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including advising 500+ companies on growth. I've been on the other side of the table where you set targets, defend strategy, and absorb pressure from every direction."), React.createElement(P, null, "When a client comes in carrying the weight of a down round or a co-founder conflict, ", React.createElement(Strong, null, "I don't need them to explain the context"), ". I know what that room feels like. We skip the background and go straight to the work."), React.createElement(P, {
    last: true
  }, "That high-trust advisory is one part of how I work. The others are nervous system regulation — so the constant activation of founding stops living in your body — and data from wearables (sleep, HRV, recovery) that makes the real cost of crunch periods, travel, and conflict visible instead of guessed at.")), React.createElement(Section, {
    label: 'How it works',
    mob
  }, React.createElement(P, null, "Sessions are ", React.createElement(Strong, null, "remote, one-on-one, and confidential"), ". Nothing goes to your board, your investors, or your team. This isn't coaching attached to your company. It's a private therapeutic relationship."), React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We use it to figure out what's going on and whether I'm the right person for it."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement('div', null, React.createElement(FaqItem, {
    q: 'Why do founders need a specific kind of therapy?'
  }, React.createElement(P, {
    last: true
  }, "Because the psychological environment of founding is quite specific. The isolation is structural, the identity fusion is usually total, and the pressure comes from multiple directions at once. A therapist who hasn't operated inside that environment will likely either treat it as generic stress or miss what's actually going on underneath the performance.")), React.createElement(FaqItem, {
    q: 'What do founders typically bring to therapy?'
  }, React.createElement(P, {
    last: true
  }, "Isolation that gets worse as the company grows. Identity that's become indistinguishable from the company's performance. Chronic decision fatigue. Relationship strain. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem'
  }, 'Self-defeating patterns'), " that keep producing the outcomes they're trying to avoid. Burnout that doesn't respond to rest because the source is emotional weight rather than hours worked.")), React.createElement(FaqItem, {
    q: 'Can I do this while running a company?'
  }, React.createElement(P, {
    last: true
  }, "Yes. Most founder clients do weekly or biweekly sessions remotely. The more relevant question is usually whether the cost of not doing it — the reactive decisions, the strained relationships, the mounting internal pressure — is something your company can keep absorbing.")), React.createElement(FaqItem, {
    q: 'Is this completely confidential?'
  }, React.createElement(P, {
    last: true
  }, "Yes. It's a private therapeutic relationship governed by professional ethics. Nothing is shared with anyone.")))), React.createElement(Testimonials, {
    mob,
    items: [{
      q: "I had worked with coaches before, and I had been in therapy before, but this felt different. Aggelos understands the emotional side without losing sight of the actual situation I am dealing with at work. We can talk about pressure, shame or something happening in my body, and five minutes later discuss a decision involving my team or business. I don\u2019t have to translate one world into the other for him.",
      w: "Anonymous client, Founder"
    }, {
      q: "There are no motivational speeches or generic frameworks pasted onto every situation. Aggelos pays attention to how I specifically operate. He remembers the contradictions, notices when I change the story and asks the question I was hoping we could avoid. Annoying at times, but usually accurate.",
      w: "Anonymous client, Founder"
    }, {
      q: "I did not want somebody to tell me to work less, lower my standards or become less ambitious. Aggelos understood that immediately. Our work has been about keeping the part of me that wants to build and achieve, while becoming less dependent on winning, comparison and external approval to feel okay. That distinction has been very important to me.",
      w: "Anonymous client, Founder and executive"
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Next step',
    mob
  }, React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We figure out what's going on and whether working together makes sense."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── IMPOSTER SYNDROME ───────────────────────────────────────────────────────
function ImposterPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  const mobSection = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const mobH2 = mob ? {
    ...h2Style,
    paddingBottom: '.4rem',
    display: 'block'
  } : h2Style;
  const mobH1 = mob ? {
    ...h1Style,
    fontSize: '20px'
  } : h1Style;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'You can see the evidence that you\u2019re good at this. You just can\u2019t feel it.'), React.createElement(Section, {
    label: 'The pattern',
    mob
  }, React.createElement(P, null, "The promotions confirm it. The salary confirms it. You're not unaware of the evidence. But ", React.createElement(Strong, null, "there's a gap between knowing you're competent and actually feeling it"), ", and that gap tends to fill with constant proof-seeking: another win, another round of validation that settles things for a day or two before the doubt comes back."), React.createElement(P, {
    last: true
  }, React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-parent-archetypes-creating-high'
  }, 'For a lot of high performers, this pattern was wired early.'), " Achievement became the way to earn approval or safety, and a conditional sense of self-worth got established long before the career started. Because the next result always comes and always proves insufficient, the doubt doesn't resolve. It just gets more expensive to manage over time.")), React.createElement(Section, {
    label: 'Why it gets worse with seniority',
    mob
  }, React.createElement(P, null, "Imposter syndrome doesn't tend to improve as you advance. ", React.createElement(Strong, null, "The stakes get higher, the visibility increases, and the margin for error feels thinner."), " At junior levels you can hide behind a team or a manager. At VP level and above, your decisions are visible and your failures have your name on them."), React.createElement(P, {
    last: true
  }, React.createElement(A, {
    href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing'
  }, 'When identity is enmeshed with constant success'), ", even normal professional setbacks start to feel existential. A missed quarter isn't just a missed quarter. It feels like evidence that the fraud has finally been caught. The rational part of you knows this is distorted, but the emotional system doesn't care about evidence.")), React.createElement(Section, {
    label: 'What doesn\u2019t work',
    mob
  }, React.createElement(P, null, "Affirmations. Achievement logs. \"Just remember how far you've come.\" These approaches treat imposter syndrome as a thinking problem, but ", React.createElement(Strong, null, "it's a feeling problem with roots that usually predate the career by decades"), ". ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/self-analysis-as-a-meta-way-to-maintain'
  }, 'For analytical people, self-analysis often becomes another way to maintain control'), " rather than a genuine path to change."), React.createElement(P, {
    last: true
  }, "The doubt is real. The story it tells you about what it means is not. Therapy works with that distinction at a level that self-help and coaching don't typically reach.")), React.createElement(Section, {
    label: 'How I work with this',
    mob
  }, React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'advising 500+ companies on growth'), ". I know the environment that amplifies imposter syndrome in tech: the pace, the ambiguity, the constant comparison."), React.createElement(P, null, React.createElement(Strong, null, "We work with the root pattern rather than the symptoms."), " That means going beyond the current role to understand where the conditional sense of worth was established, why it persists, and what it would take to build a sense of self that doesn't depend entirely on the next result."), React.createElement(P, null, "Insight alone rarely shifts this — most high performers have already understood it intellectually. So the work also includes nervous system regulation, so safety stops depending on the next win, and, where it helps, data from wearables that shows the gap between what you think you can handle and what your body is already doing."), React.createElement(P, {
    last: true
  }, "I write about this at ", React.createElement(A, {
    href: 'https://undisguised.io'
  }, 'Undisguised'), ". The writing explores the patterns. The private work is where they actually move.")), React.createElement(Section, {
    label: 'Start here',
    mob
  }, React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's driving the pattern and whether I'm the right person to work on it with you."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement('div', null, React.createElement(FaqItem, {
    q: 'Is imposter syndrome a real diagnosis?'
  }, React.createElement(P, {
    last: true
  }, "It's not a clinical diagnosis in the DSM. It's a persistent pattern of doubting your accomplishments despite clear evidence of competence. In senior professionals, it tends to show up as overwork, avoidance of visibility, difficulty delegating, and a low-grade anxiety that erodes both performance and wellbeing over time.")), React.createElement(FaqItem, {
    q: 'Why is imposter syndrome so common in high achievers?'
  }, React.createElement(P, {
    last: true
  }, "Often because achievement started as a strategy to earn approval or safety rather than an expression of genuine interest. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/high-performance-as-a-way-to-get'
  }, 'High performance becomes a way to get accepted'), " rather than a reflection of who you actually are.")), React.createElement(FaqItem, {
    q: 'Can coaching with a therapist actually resolve this?'
  }, React.createElement(P, {
    last: true
  }, "Yes, though not through reframing or positive self-talk. Effective therapy works with the relational pattern that established the conditional worth in the first place. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting'
  }, 'Doubt tends to protect you from something'), " even when you can see the evidence clearly, and that protective function needs to be understood before it can change.")), React.createElement(FaqItem, {
    q: "I know I'm good at my job. Why do I still feel like a fraud?"
  }, React.createElement(P, {
    last: true
  }, "Because the feeling isn't really about your job. It's about an older emotional system that learned your value is conditional. Your rational mind can process the evidence just fine, but the part of you that drives the doubt operates on different logic.")), React.createElement(FaqItem, {
    q: 'How is therapeutically-informed coaching different from regular coaching?'
  }, React.createElement(P, {
    last: true
  }, "Regular coaching usually focuses on managing symptoms: reframing, confidence exercises, tracking achievements. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility'
  }, 'A lot of what gets labeled coaching'), " in this space actually requires therapeutic depth. Therapy goes to the source of the pattern rather than helping you cope with it.")))), React.createElement(Testimonials, {
    mob,
    items: [{
      q: "From the outside, I was still functioning and performing at a high level, so it was difficult to explain why something felt wrong. Aggelos understood that the problem was not simply workload. We have worked on the way I connect achievement with safety, worth and relief. I am still ambitious, but success is beginning to feel less like narrowly escaping failure.",
      w: "Anonymous client, Tech executive"
    }, {
      q: "I trust Aggelos because he is not constantly trying to reassure me. He listens carefully, but he does not automatically agree with the version of events I bring into the session. Sometimes he points out something I would rather not see. Somehow that honesty has made the work feel safer, not less safe.",
      w: "Anonymous client, Product leader"
    }, {
      q: "I started working with Aggelos during a confusing period in my career. On paper, things were going well, but internally I was questioning almost everything. Over several sessions, he helped me understand which concerns were legitimate and which were being amplified by old fears around performance, failure and how other people saw me. I feel more grounded now, even though not everything has been resolved.",
      w: "Anonymous client, Technology executive"
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Next step',
    mob
  }, React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes and no obligations. We use it to understand what's driving the doubt and whether this is the right approach for you."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── BURNOUT PAGE ────────────────────────────────────────────────────────────
function BurnoutPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  const mobSection = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const mobH2 = mob ? {
    ...h2Style,
    paddingBottom: '.4rem',
    display: 'block'
  } : h2Style;
  const mobH1 = mob ? {
    ...h1Style,
    fontSize: '20px'
  } : h1Style;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'You took the vacation. You came back feeling the same way. The problem probably isn\u2019t the workload.'), React.createElement(Section, {
    label: 'Executive burnout',
    mob
  }, React.createElement(P, null, "The usual advice is to rest more, delegate more, set better boundaries. You've probably tried most of it. Maybe you even took real time off. And within a couple of weeks of returning, ", React.createElement(Strong, null, "the same weight came back"), ", as if it had been waiting for you."), React.createElement(P, null, "That's because burnout in executives often isn't about working too many hours. It's about the emotional cost of the work: carrying chronic responsibility without adequate support, maintaining a version of yourself that takes constant effort, and having an identity so tied to output that stopping feels like disappearing."), React.createElement(P, {
    last: true
  }, "Rest doesn't fix that. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/is-it-post-holiday-anxiety-or-just'
  }, 'Sometimes what feels like post-holiday anxiety is actually a moment of clarity'), " about how unsustainable the current arrangement has become.")), React.createElement(Section, {
    label: "What's actually happening"
  }, React.createElement(P, null, "Executive burnout usually sits on top of older patterns. An inability to stop because ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/who-are-you-if-you-are-not-crushing'
  }, 'identity has become enmeshed with constant output'), ". A relationship with work where ", React.createElement(Strong, null, "your sense of value as a person depends on the next deliverable"), ". Chronic overfunction that started well before this particular role."), React.createElement(P, null, "The cynicism, the emotional flatness, the inability to care about things you used to care about: these aren't character flaws. They're signals that the internal cost of how things are currently set up has exceeded what you can sustain."), React.createElement(P, {
    last: true
  }, React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-elaborate-performance-of-trying'
  }, 'A lot of people build elaborate systems of "trying to change"'), " that look productive but function as avoidance. If that sounds familiar, the issue probably isn't willpower. It's that the pattern is serving a function that hasn't been identified.")), React.createElement(Section, {
    label: 'How I work with this',
    mob
  }, React.createElement(P, null, React.createElement(Strong, null, "This work goes to the level of the pattern, not the symptoms."), " We look at what's driving the overwork: what it would mean to stop, what you're avoiding by staying in motion, why the idea of doing less feels threatening rather than freeing."), React.createElement(P, null, "I'm a licensed psychotherapist with 18+ years in B2B SaaS, including ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'advising 500+ companies on growth'), ". I understand the environment well: the always-on culture, the ambiguity, the pressure to appear certain when you're not."), React.createElement(P, {
    last: true
  }, "The goal isn't necessarily to make you work less (though that might happen). ", React.createElement(Strong, null, "The goal is a more fulfilling relationship with the work, so it costs less and means more."), " We do that through high-trust advisory, nervous system regulation so recovery actually lands, and data from wearables (sleep, HRV, stress) that shows what rest alone isn't fixing.")), React.createElement(Section, {
    label: 'Start here',
    mob
  }, React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's underneath the exhaustion and whether therapy is the right approach."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement('div', null, React.createElement(FaqItem, {
    q: "Why doesn't rest fix my burnout?"
  }, React.createElement(P, {
    last: true
  }, "Usually because the exhaustion isn't caused by hours worked. It's caused by the emotional weight of the work: chronic responsibility, identity tied to performance, and the difficulty of stopping without feeling like you're failing. Rest addresses the symptom. Therapy addresses the structure underneath.")), React.createElement(FaqItem, {
    q: 'Is burnout a mental health condition?'
  }, React.createElement(P, {
    last: true
  }, "The WHO classifies it as an occupational phenomenon rather than a medical diagnosis. In practice, it often coexists with anxiety and depression. At senior levels, it tends to reveal longer-running patterns around identity, control, and self-worth that therapy is well suited to address.")), React.createElement(FaqItem, {
    q: "How do I know if I'm burned out or just tired?"
  }, React.createElement(P, {
    last: true
  }, "Tiredness resolves with rest. Burnout doesn't. If you've taken time off and come back feeling the same way, the exhaustion is probably structural. Other signals: cynicism about work you used to care about, emotional flatness, difficulty engaging with decisions that aren't urgent.")), React.createElement(FaqItem, {
    q: 'Can I do this while still in the job?'
  }, React.createElement(P, {
    last: true
  }, "Yes, and that's usually what happens. The point isn't to quit. It's to understand ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem'
  }, "what's creating the problem"), " and change your relationship to the work so the cost comes down.")), React.createElement(FaqItem, {
    q: "I've tried regular coaching, meditation, and boundary-setting. Why didn't they work?"
  }, React.createElement(P, {
    last: true
  }, "Because they operate at the surface. If the burnout is driven by a deeper pattern, like identity fusion with output or ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/why-hard-work-alone-doesnt-advance'
  }, 'the belief that hard work should be enough on its own'), ", managing symptoms doesn't change the source.")))), React.createElement(Testimonials, {
    mob,
    items: [{
      q: "Before working together, a difficult email or a problem with a client could affect my entire day. I would immediately feel responsible for everything and start trying to control how I was perceived. We traced that response much further back than the immediate work situation. I still feel pressure, but I can recognise it earlier and I no longer believe every conclusion my nervous system produces.",
      w: "Anonymous client, Consultant and business owner"
    }, {
      q: "I already understood many of my patterns intellectually. That was partly the problem. I could explain myself very well and still repeat the same behaviour. Working with Aggelos helped me recognise what was happening physically, not just analyse it afterwards. That has made the work much more real and, slowly, changed how I respond under pressure.",
      w: "Anonymous client, Technology leader"
    }, {
      q: "The conversations go deeper than ordinary coaching, but I still leave with something usable. Sometimes that is a decision, sometimes a difficult conversation I need to have, and sometimes it is simply noticing the moment my body moves into threat before my mind creates a story around it. It is a rare combination of depth and practicality.",
      w: "Anonymous client, Senior tech professional"
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Next step',
    mob
  }, React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We figure out what's going on and whether this is the right approach."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── CAREER TRANSITION ───────────────────────────────────────────────────────
function CareerTransitionPage() {
  const mob = useIsMobile();
  const mobPage = mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
  const mobSection = mob ? {
    display: 'block',
    marginBottom: '2rem'
  } : sectionStyle;
  const mobH2 = mob ? {
    ...h2Style,
    paddingBottom: '.4rem',
    display: 'block'
  } : h2Style;
  const mobH1 = mob ? {
    ...h1Style,
    fontSize: '20px'
  } : h1Style;
  return React.createElement('main', {
    style: mobPage
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '3rem',
      fontSize: mob ? '20px' : '28px'
    }
  }, 'The next role isn\u2019t the hard part. Figuring out who you are without this one is.'), React.createElement(Section, {
    label: 'The real transition',
    mob
  }, React.createElement(P, null, "You've spent years building a career that defines how people see you and, more importantly, how you see yourself. Now something is shifting. Maybe you're thinking about leaving. Maybe you were pushed out. Maybe you already made the move and ", React.createElement(Strong, null, "expected relief but got disorientation instead"), "."), React.createElement(P, null, "The strategic questions — what industry, what role, what compensation — are usually the easier part. The harder question is the one most people around you aren't equipped to help with: ", React.createElement(Strong, null, "who are you when the title, the team, and the daily structure that organised your sense of self are gone?")), React.createElement(P, {
    last: true
  }, React.createElement(A, {
    href: 'https://www.undisguised.io/p/youre-just-trading-one-type-of-friction'
  }, 'A lot of people assume the grass is greener on the other side of the corporate/startup divide.'), " They trade one set of difficulties for another and wonder why the relief didn't last. Usually the problem wasn't the specific job. It was the relationship to work itself, and that comes with you.")), React.createElement(Section, {
    label: 'What makes this hard',
    mob
  }, React.createElement(P, null, "At senior levels, your career isn't just what you do. ", React.createElement(Strong, null, "It's the structure that holds a lot of your identity together."), " Your social world, your daily rhythm, your sense of competence — these are all built around the role. When that structure changes, everything it was quietly holding in place starts to shift too."), React.createElement(P, null, "If you were laid off, the experience often produces a grief response you didn't expect, because it's not just about the job. It's about the version of yourself that existed inside it. If you're choosing to leave, the paralysis usually isn't about the options. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/what-doubt-is-actually-protecting'
  }, 'The doubt is protecting you from something'), ", usually the fear of what you'll find on the other side."), React.createElement(P, {
    last: true
  }, "And if you already made the move and feel lost rather than free, that's not a failure. It's the predictable result of removing a structure without understanding what it was compensating for.")), React.createElement(Section, {
    label: 'Why a therapist, not a career coach',
    mob
  }, React.createElement(P, null, "Career coaching helps you figure out what to do next. ", React.createElement(Strong, null, "Therapeutically-informed coaching helps you understand why you're stuck"), ", what the transition is actually about at a deeper level, and what needs to shift internally for any external change to hold."), React.createElement(P, null, "Without that internal work, people tend to recreate the same patterns in new settings. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/youre-creating-the-exact-problem'
  }, 'They end up building the same problem in a different context.'), ""), React.createElement(P, null, "I'm a licensed psychotherapist who made this kind of transition myself — from 18+ years in B2B SaaS and ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'growth advisory'), " to clinical practice. I know what it's like to leave an identity that works, and I know the difference between doing that reactively and doing it with some clarity about what's actually driving the change."), React.createElement(P, {
    last: true
  }, "The work combines high-trust advisory, nervous system regulation, and — where useful — data from wearables that shows how the transition is actually landing on you. The aim isn't just the next role. It's a working life that feels genuinely fulfilling, not just impressive.")), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, {
    last: true
  }, React.createElement(Strong, null, "Senior professionals considering a major career change"), " but paralysed by the decision. Executives who were laid off and are dealing with more than just the job search. Leaders who made the move and feel more lost than free. People who ", React.createElement(Strong, null, "keep almost leaving but pull back every time"), ". Anyone at a senior level who suspects the career question is really a question about identity, worth, and what they want from the next phase of their working life.")), React.createElement(Section, {
    label: 'Start here',
    mob
  }, React.createElement(P, null, "It starts with ", React.createElement(Strong, null, "a short, free fit call"), ", about 15 minutes. We figure out what's actually driving the transition (or the resistance to it) and whether therapy is the right kind of support for this moment."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement('div', null, React.createElement(FaqItem, {
    q: 'Why would I need a therapist for career transition coaching?'
  }, React.createElement(P, {
    last: true
  }, "Because at senior levels, a career change disrupts your identity, your social world, and your sense of competence — not just your job. The strategic part is rarely the real difficulty. The harder part is figuring out who you are when the structure that organised your life is gone.")), React.createElement(FaqItem, {
    q: "I can't decide whether to leave. Can therapy help with that?"
  }, React.createElement(P, {
    last: true
  }, "Usually, yes. The indecision almost never comes from lack of information. The block tends to come from what the decision represents: loss of identity, fear of regret, the distance between what you actually want and what you think you should want. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-high-cost-of-endless-pondering'
  }, 'Endless deliberation has its own cost'), ", and therapy works with the internal conflict that's making the decision feel impossible.")), React.createElement(FaqItem, {
    q: 'How is this different from career coaching?'
  }, React.createElement(P, {
    last: true
  }, "Regular career coaching works on what to do next. Therapeutically-informed coaching works on why you're stuck and what needs to shift internally for any external change to actually hold. ", React.createElement(A, {
    href: 'https://www.undisguised.io/p/the-coaching-industrys-credibility'
  }, 'A lot of what gets called career coaching'), " actually needs therapeutic depth to address properly.")), React.createElement(FaqItem, {
    q: 'I was laid off and I feel lost. Is that normal?'
  }, React.createElement(P, {
    last: true
  }, "Very. Involuntary exits at senior levels produce genuine grief, not just about the job but about the identity and daily structure it provided. Most people around you won\u2019t fully understand that because they see it as \u201cjust a job.\u201d Therapy gives you a space to process the loss before rushing into whatever comes next.")), React.createElement(FaqItem, {
    q: 'I already made the move and feel worse. What happened?'
  }, React.createElement(P, {
    last: true
  }, "You probably removed the structure without fully understanding what it was compensating for. The old role was quietly holding things in place: your sense of purpose, your daily identity, your social connections. Without it, those gaps become visible. That's not a sign you made the wrong choice. It's a sign there's deeper work to do — and now you have the space for it.")))), React.createElement(Testimonials, {
    mob,
    items: [{
      q: "We have been working together for a while now, and the sessions have gradually changed the way I make decisions. Aggelos doesn\u2019t tell me what to do or try to make me dependent on his opinion. He helps me separate the real problem from the fear, ego and old patterns wrapped around it. I usually leave with less noise and a much clearer sense of what is mine to do.",
      w: "Anonymous client, Founder"
    }, {
      q: "I had been forcing a business situation to continue because stopping it felt like failure. After one of our exercises, I realised I was trying to manufacture reasons to keep going when I already knew the answer. I had the difficult conversation shortly afterwards. It was not that Aggelos gave me the decision. He helped me stop fighting what I already knew.",
      w: "Anonymous client, Business owner"
    }, {
      q: "I was initially sceptical about somatic and trauma-informed work because I assumed it would be vague or a bit spiritual. It wasn\u2019t. Aggelos explained what we were doing, paid attention to my limits and connected the experience back to patterns I could recognise in my work and relationships. It felt grounded, careful and surprisingly practical.",
      w: "Anonymous client"
    }]
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Next step',
    mob
  }, React.createElement(P, null, "It starts with a short, free fit call, about 15 minutes, no obligations. We use it to understand where you actually are and what kind of support makes sense right now."), React.createElement('div', {
    style: {
      marginTop: '.5rem'
    }
  }, React.createElement('a', {
    href: '/book/',
    className: 'cta-btn',
    style: ctaBtn
  }, 'Book a fit call →'))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── SHARED PAGE HELPERS ─────────────────────────────────────────────────────
function locMobPage(mob) {
  return mob ? {
    ...pageStyle,
    padding: '1.5rem 1rem 5rem'
  } : widePageStyle;
}
function BookCta({
  label,
  lang = 'en'
}) {
  return React.createElement('div', {
    style: {
      marginTop: '1.4rem'
    }
  }, React.createElement('a', {
    href: pathFor('book', lang),
    className: 'cta-btn',
    style: ctaBtn
  }, label || tUI(lang).book + ' →'));
}

// ─── GREEK-SPEAKING THERAPIST · LONDON ───────────────────────────────────────
function LondonPage() {
  const mob = useIsMobile();
  return React.createElement('main', {
    style: locMobPage(mob)
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '2.5rem',
      fontSize: mob ? '22px' : '30px'
    }
  }, 'Greek-speaking therapist for tech professionals in London'), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '2.5rem' : '3rem'
    }
  }, "If you work in London tech and you’d rather do this in Greek, with someone who also understands your industry, that’s the whole idea here. The work itself is the same one I do with every client. Speaking Greek just takes the translation out of it."), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, {
    last: true
  }, "Greek-speaking founders, engineers, product managers, designers, consultants and executives working in London tech — fintech, scale-ups, big tech, agencies, the consulting firms. Wherever in the city you ended up.")), React.createElement(Section, {
    label: 'Why it helps that I speak Greek',
    mob
  }, React.createElement(P, null, "Therapy works better in the language you actually think and feel in. The family expectations, the humour, the guilt, the particular context of building a life away from Greece — you don’t have to translate any of it or explain it from scratch."), React.createElement(P, {
    last: true
  }, "We start from a shared understanding instead of spending sessions building one. That’s the real reason to choose a Greek-speaking therapist over a perfectly good local one.")), React.createElement(Section, {
    label: 'And I understand the industry',
    mob
  }, React.createElement(P, {
    last: true
  }, "You also don’t have to explain your work. Before training as a psychotherapist I spent 18+ years in product and growth and ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'advised more than 500 companies'), ", so runway, reorgs, shipping, the pressure of a senior role — I already follow all of it. It’s the same reason my ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'founder'), " and ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'solopreneur'), " clients come to me.")), React.createElement(Section, {
    label: 'The work itself is the same',
    mob
  }, React.createElement(P, {
    last: true
  }, "Nothing about the work changes because you’re in London or because we speak Greek. It’s the same private, one-to-one work I do with everyone — the personal pattern and the real decision in front of you, worked at the same time. How it runs, step by step, is on ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'how I work'), ".")), React.createElement(Section, {
    label: 'Online sessions',
    mob
  }, React.createElement(P, {
    last: true
  }, "Everything is online, one to one. I’m based in Ireland — same time zone as London — so an early slot before work or an evening one is easy to arrange. There’s no in-person room.")), React.createElement(Section, {
    label: 'Confidentiality',
    mob
  }, React.createElement(P, {
    last: true
  }, "Private and one to one. I don’t report to anyone and I don’t use identifiable client stories anywhere. Here’s ", React.createElement(IA, {
    href: '/confidentiality/'
  }, 'how confidentiality works'), " in detail.")), React.createElement(BookCta, {
    label: 'Book a fit call \u2192'
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement(FaqItem, {
    q: 'Greek or English?'
  }, React.createElement(P, {
    last: true
  }, "Either, and you can switch mid-sentence. Most people move between the two without thinking about it.")), React.createElement(FaqItem, {
    q: 'Is the therapy itself any different because it’s in Greek?'
  }, React.createElement(P, {
    last: true
  }, "No. Same work, same approach I take with everyone. The Greek, and a shared read on your world, just remove the friction of explaining and translating.")), React.createElement(FaqItem, {
    q: 'Are you based in London?'
  }, React.createElement(P, {
    last: true
  }, "No — I’m based in Ireland and work online. London is the same time zone, so scheduling is simple. There’s no in-person option.")), React.createElement(FaqItem, {
    q: 'What do people usually bring?'
  }, React.createElement(P, {
    last: true
  }, "The same things anyone brings — pressure that won’t switch off, a decision they keep circling, burnout, self-doubt, work that has quietly taken over. Nothing London-specific. You just get to talk about it in Greek, with someone who understands the context."))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── GREEK-SPEAKING THERAPIST · MANCHESTER ───────────────────────────────────
function ManchesterPage() {
  const mob = useIsMobile();
  return React.createElement('main', {
    style: locMobPage(mob)
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '2.5rem',
      fontSize: mob ? '22px' : '30px'
    }
  }, 'Greek-speaking therapist for tech professionals in Manchester'), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '2.5rem' : '3rem'
    }
  }, "If you’re in tech in Manchester and you’d rather talk in Greek, with someone who also knows the industry, that’s what this is. The work is the same one I do with every client — working in your own language just takes the translation out of it."), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, {
    last: true
  }, "Greek-speaking engineers, developers, product and design people, consultants, agency owners and remote workers in and around Manchester and the wider North of England.")), React.createElement(Section, {
    label: 'Why it helps that I speak Greek',
    mob
  }, React.createElement(P, null, "It’s easier to do this in the language you grew up in. The family side, the humour, the expectations, the context of building a life away from Greece — none of it needs translating or explaining first."), React.createElement(P, {
    last: true
  }, "You get to be blunt, funny and unsure in your own idiom, and be understood the first time. That, more than anything, is why people look for a Greek-speaking therapist rather than a local one.")), React.createElement(Section, {
    label: 'And I understand the industry',
    mob
  }, React.createElement(P, {
    last: true
  }, "You also don’t have to explain the work — the pipeline that’s gone quiet, the pricing you avoid raising, the projects, the independence. I spent 18+ years in product and growth and ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, 'advised more than 500 companies'), " before training as a psychotherapist, and I’ve done the job-to-independent route myself. It’s the same reason my ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'solopreneur'), " and ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'founder'), " clients come to me.")), React.createElement(Section, {
    label: 'The work itself is the same',
    mob
  }, React.createElement(P, {
    last: true
  }, "It’s the same private, one-to-one work I do with everyone, working the personal pattern and the practical decision together. If you work for yourself, that includes the business side — pricing, positioning, the outreach you keep putting off — alongside the pattern underneath it. The full shape of it is on ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'how I work'), ".")), React.createElement(Section, {
    label: 'Online sessions',
    mob
  }, React.createElement(P, {
    last: true
  }, "Everything is online, one to one. I’m based in Ireland, the same time zone as Manchester, so slots fit easily around work. If you’re remote-first anyway, a video session is just a Tuesday. There’s no in-person room.")), React.createElement(Section, {
    label: 'Confidentiality',
    mob
  }, React.createElement(P, {
    last: true
  }, "Private, one to one, and it stays that way. Nothing gets reported to anyone and I don’t use identifiable stories. Here’s ", React.createElement(IA, {
    href: '/confidentiality/'
  }, 'how confidentiality works'), ".")), React.createElement(BookCta, {
    label: 'Book a fit call \u2192'
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement(FaqItem, {
    q: 'Do I need to be in Manchester itself?'
  }, React.createElement(P, {
    last: true
  }, "No. Sessions are online, so anywhere in the UK works the same. Manchester and the North just happen to be where a lot of my Greek-speaking, remote and independent clients are.")), React.createElement(FaqItem, {
    q: 'I work for myself. Can we cover the business too?'
  }, React.createElement(P, {
    last: true
  }, "Yes. Pricing, positioning and the outreach you avoid sit alongside the pattern underneath them, because for solo and independent people the two are rarely separate. Same work I do with any solopreneur.")), React.createElement(FaqItem, {
    q: 'Greek or English?'
  }, React.createElement(P, {
    last: true
  }, "Either, or both in the same session. Working in your own language is the point.")), React.createElement(FaqItem, {
    q: 'Is this a different service from the London or Dublin pages?'
  }, React.createElement(P, {
    last: true
  }, "No — same person, same offer. The only real differences are who tends to be where and the practical logistics. The therapy itself doesn’t change."))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── GREEK-SPEAKING THERAPIST · NEW YORK ─────────────────────────────────────
function NewYorkPage() {
  const mob = useIsMobile();
  return React.createElement('main', {
    style: locMobPage(mob)
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '2.5rem',
      fontSize: mob ? '22px' : '30px'
    }
  }, 'Greek-speaking therapist for tech professionals in New York'), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '2.5rem' : '3rem'
    }
  }, "If you’re Greek and working in New York tech, and you’d rather do this in Greek with someone who also understands the industry, that’s the idea. The work is the same one I do with every client — speaking Greek just takes the translation out of it."), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, {
    last: true
  }, "Greek-speaking engineers, founders, product leaders, designers and operators in New York tech — startups, larger platforms, and the finance-adjacent world the city runs on.")), React.createElement(Section, {
    label: 'Why it helps that I speak Greek',
    mob
  }, React.createElement(P, null, "The things that actually run you — family, expectation, the particular pride and guilt of the one who went to the States — tend to live in Greek. In English they stay at a slight, unhelpful distance."), React.createElement(P, {
    last: true
  }, "Working in your first language means none of that needs translating, and the cultural context is already understood. That’s the reason to choose this over a local option, not anything different about the therapy.")), React.createElement(Section, {
    label: 'And I understand the industry',
    mob
  }, React.createElement(P, {
    last: true
  }, "You also don’t have to explain equity, runway, a reorg, or why “just be confident” is useless advice. 18+ years in product and growth and ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, '500+ companies advised'), " before I trained as a psychotherapist. It’s the same reason my ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'founder'), " and senior ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'executive'), " clients come to me.")), React.createElement(Section, {
    label: 'The work itself is the same',
    mob
  }, React.createElement(P, {
    last: true
  }, "Nothing about the work changes because you’re in New York. It’s the same one-to-one work I do with everyone, holding the personal pattern and the real situation at work in the same room. The steps are laid out on ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'how I work'), ".")), React.createElement(Section, {
    label: 'Online, across the time difference',
    mob
  }, React.createElement(P, {
    last: true
  }, "Sessions are online, one to one. I’m based in Ireland, which is about five hours ahead of New York, so in practice they land in your morning. We agree a recurring slot that works for both of us; if the time difference doesn’t fit your schedule, I’ll tell you on the fit call rather than force it.")), React.createElement(Section, {
    label: 'Confidentiality',
    mob
  }, React.createElement(P, {
    last: true
  }, "Private and one to one. I don’t report to your employer, investors or anyone else, and I don’t use identifiable stories publicly. The detail, including the honest limits, is on the ", React.createElement(IA, {
    href: '/confidentiality/'
  }, 'confidentiality page'), ".")), React.createElement(BookCta, {
    label: 'Book a fit call \u2192'
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement(FaqItem, {
    q: 'You’re in Ireland — how does the time difference work?'
  }, React.createElement(P, {
    last: true
  }, "Ireland is about five hours ahead of New York, so sessions usually sit in your morning. We set a fixed recurring slot. If your schedule can’t make the difference work, I’ll say so on the fit call instead of pretending it’s fine.")), React.createElement(FaqItem, {
    q: 'Are you a licensed therapist in New York State?'
  }, React.createElement(P, {
    last: true
  }, "I’m a licensed psychotherapist and a registered member of the BACP (British Association for Counselling and Psychotherapy). I’m not registered with a New York State board, and this is online work rather than a local clinical service. If you specifically need a New-York-licensed provider — for insurance, say — I’m happy to point you elsewhere on the fit call.")), React.createElement(FaqItem, {
    q: 'Greek or English?'
  }, React.createElement(P, {
    last: true
  }, "Either, or both in the same session. Working in your first language is the reason to choose this.")), React.createElement(FaqItem, {
    q: 'Is it a different kind of therapy because it’s for Greek people abroad?'
  }, React.createElement(P, {
    last: true
  }, "No. It’s the offer everyone gets. Being able to do it in Greek, with the context already understood, is the only part that’s specific to you."))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── GREEK-SPEAKING THERAPIST · DUBLIN ───────────────────────────────────────
function DublinPage() {
  const mob = useIsMobile();
  return React.createElement('main', {
    style: locMobPage(mob)
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.5rem' : '2.5rem',
      fontSize: mob ? '22px' : '30px'
    }
  }, 'Greek-speaking therapist for tech professionals in Dublin'), React.createElement('p', {
    style: {
      ...leadStyle,
      marginBottom: mob ? '2.5rem' : '3rem'
    }
  }, "If you’re Greek and working in Dublin tech, and you’d rather do this in Greek with someone who also knows the industry, that’s what this is. The work is the same one I do with every client — speaking Greek just removes the translation."), React.createElement(Section, {
    label: 'Who this is for',
    mob
  }, React.createElement(P, {
    last: true
  }, "Greek-speaking engineers, product managers, operations and consulting people working in Dublin’s multinationals, tech companies and startups.")), React.createElement(Section, {
    label: 'Why it helps that I speak Greek',
    mob
  }, React.createElement(P, null, "For people who’ve relocated, a lot of what matters is still tied to Greece — family, expectations, the pull home. It’s the part that’s hardest to explain to someone outside the culture, and the part that lands flat when you have to translate it."), React.createElement(P, {
    last: true
  }, "In Greek, with someone who already gets it, you can go straight to it. That’s the reason to choose a Greek-speaking therapist — not anything different about the work.")), React.createElement(Section, {
    label: 'And I understand the industry',
    mob
  }, React.createElement(P, {
    last: true
  }, "You also don’t have to explain corporate life — the big-org politics, the way a role can quietly take over. 18+ years in product and growth and ", React.createElement(A, {
    href: 'https://headofgrowth.io'
  }, '500+ companies advised'), " before I trained as a psychotherapist, including inside a large enterprise. I happen to be based in Ireland myself, which helps with the practicalities, but the real reason to come is that I hold both the work and the Greek context at once.")), React.createElement(Section, {
    label: 'The work itself is the same',
    mob
  }, React.createElement(P, {
    last: true
  }, "It’s the same private, one-to-one work I do with everyone — the personal pattern and the real decision together, whether that’s the job, the move, or whether to stay at all. How the work runs is on ", React.createElement(IA, {
    href: '/1-to-1/'
  }, 'how I work'), ".")), React.createElement(Section, {
    label: 'Online sessions',
    mob
  }, React.createElement(P, {
    last: true
  }, "Everything is online, one to one. I’m based in Ireland, so we share a time zone and there’s nothing to solve on scheduling — but sessions are by video, not in person. Same country, same working hours; that’s where the convenience begins and ends.")), React.createElement(Section, {
    label: 'Confidentiality',
    mob
  }, React.createElement(P, {
    last: true
  }, "Private and one to one. Nothing goes back to your employer or manager, and I don’t use identifiable stories publicly. The full detail is on the ", React.createElement(IA, {
    href: '/confidentiality/'
  }, 'confidentiality page'), ".")), React.createElement(BookCta, {
    label: 'Book a fit call \u2192'
  }), React.createElement('hr', {
    style: sepStyle
  }), React.createElement(Section, {
    label: 'Common questions',
    mob
  }, React.createElement(FaqItem, {
    q: 'You’re in Ireland too — can we meet in person?'
  }, React.createElement(P, {
    last: true
  }, "No, the work is online, one to one, by video — same as for all my clients. Being in the same country and time zone makes scheduling effortless, but there isn’t an in-person room.")), React.createElement(FaqItem, {
    q: 'A lot of what’s on my mind is family back in Greece. Is that the right thing to bring?'
  }, React.createElement(P, {
    last: true
  }, "Yes. For people who’ve relocated, the tie home is usually central, not a side issue — and it’s the part hardest to explain to someone outside the culture. Working in Greek is exactly what makes it workable.")), React.createElement(FaqItem, {
    q: 'Greek or English?'
  }, React.createElement(P, {
    last: true
  }, "Either, or both in the same session. Your language, your call.")), React.createElement(FaqItem, {
    q: 'Is this a different service because I’m Greek and abroad?'
  }, React.createElement(P, {
    last: true
  }, "No. What you’re paying for isn’t a “Greek service” — it’s the ordinary work, minus the part where you’d have to explain your background before we could start."))), React.createElement(SiteFooter, {
    mob
  }));
}

// ─── CONFIDENTIALITY (bilingual, plain-language trust page) ───────────────────
const CONF = {
  en: {
    h1: 'Confidentiality',
    intro: ["People bring me things they haven't said to a cofounder, investor, employee, partner or sometimes anyone else.", "That only works if privacy isn't vague.", "Here's what you can expect."],
    sections: [{
      label: 'What you say stays private',
      body: ["I don't send session content to your employer, investors, board, cofounder, team, partner or whoever referred you.", 'That remains true if somebody else is paying for the work.', "Paying the invoice doesn't buy access to the conversation.", 'The limits to confidentiality are explained below.']
    }, {
      label: 'You can talk about the actual thing',
      body: ['That includes things like:'],
      list: ['doubts about the company or whether you still want it', 'problems with a cofounder', "employees you're worried about or decisions you're avoiding", 'investor or board pressure', 'runway, revenue and financial fear', 'wanting to leave, sell or stop', 'things happening in your personal life that are affecting the work'],
      after: ["I don't have a back channel to the people involved."]
    }, {
      label: 'If somebody else pays',
      body: ['Sometimes a company, investor or another party funds the work.', 'They pay the invoice.', "They do not receive session content, notes, progress reports or a summary of what we're working on.", 'If they expect something different, we establish that before the work starts.']
    }, {
      label: 'Stories and content',
      body: ['I write and speak publicly about the kinds of problems I work with.', "I don't publish identifiable client material without explicit permission.", "Anything based on client work is fictionalised, materially altered or combined from patterns across different people so that an individual can't reasonably be identified.", "If I ever wanted to use something recognisably close to your real situation, I'd ask first.", 'A no is a no.']
    }, {
      label: 'Notes and data',
      body: ['I keep records to a considered minimum and use standard professional tools for scheduling, communication and sessions.', "If you want to know exactly what I store, where and for how long, ask me. I'll answer plainly."]
    }, {
      label: 'NDA',
      body: ["If an NDA makes the commercial side easier to trust, I'm happy to discuss signing one before we start."]
    }, {
      label: 'The limits',
      body: ["I won't promise absolute secrecy because that wouldn't be an honest promise.", 'Confidentiality is the default, but there are narrow circumstances where it can have limits, including serious and immediate risk of harm and situations where disclosure is legally required.', 'As a BACP-registered psychotherapist, I also use clinical supervision. This is itself confidential, and material is discussed in a way intended to protect client identity.', "If any of these limits are particularly relevant to your situation, ask me before we start and I'll be specific."]
    }, {
      label: "This page isn't the contract",
      body: ['This is a plain-language explanation of how I approach confidentiality.', "It doesn't replace the actual agreement, privacy information, consent documentation or an NDA where one applies.", "If confidentiality is the thing stopping you from starting, ask me about the exact thing you're worried about."]
    }]
  },
  el: {
    h1: 'Εμπιστευτικότητα',
    intro: ['Οι άνθρωποι που δουλεύουν μαζί μου λένε πράγματα που μπορεί να μην έχουν πει σε cofounder, επενδυτή, συνεργάτη, σύντροφο ή καμιά φορά σε κανέναν.', 'Αυτό λειτουργεί μόνο αν είναι ξεκάθαρο τι μένει μεταξύ μας.', 'Οπότε, χωρίς νομικίστικα:'],
    sections: [{
      label: 'Όσα λες μένουν μεταξύ μας',
      body: ['Δεν στέλνω το περιεχόμενο των συζητήσεών μας σε εργοδότη, επενδυτές, board, cofounder, ομάδα, σύντροφο ή σε αυτόν που σε παρέπεμψε σε μένα.', 'Το ίδιο ισχύει και αν κάποιος άλλος πληρώνει για τη συνεργασία.', 'Το ότι κάποιος πληρώνει τον λογαριασμό δεν του δίνει πρόσβαση στη συζήτηση.', 'Τα όρια της εμπιστευτικότητας εξηγούνται πιο κάτω.']
    }, {
      label: 'Μπορείς να μιλήσεις για το πραγματικό θέμα',
      body: ['Για παράδειγμα:'],
      list: ['αμφιβολίες για το business ή για το αν το θέλεις ακόμα', 'προβλήματα με cofounder', 'εργαζομένους που σε προβληματίζουν ή αποφάσεις που αποφεύγεις', 'πίεση από επενδυτές ή board', 'runway, έσοδα και οικονομικό φόβο', 'σκέψεις να φύγεις, να πουλήσεις ή να σταματήσεις', 'προσωπικά πράγματα που έχουν αρχίσει να επηρεάζουν τη δουλειά'],
      after: ['Δεν υπάρχει κάποια δεύτερη γραμμή επικοινωνίας με τους ανθρώπους που αφορούν αυτά.']
    }, {
      label: 'Αν πληρώνει κάποιος άλλος',
      body: ['Μερικές φορές τη συνεργασία πληρώνει μια εταιρεία, ένας επενδυτής ή κάποιος άλλος.', 'Αυτός πληρώνει το invoice.', 'Δεν παίρνει το περιεχόμενο των συνεδριών, σημειώσεις, progress report ή περίληψη του τι δουλεύουμε.', 'Αν περιμένει κάτι διαφορετικό, το ξεκαθαρίζουμε πριν ξεκινήσουμε.']
    }, {
      label: 'Ιστορίες και περιεχόμενο',
      body: ['Γράφω και μιλάω δημόσια για θέματα που συναντώ στη δουλειά μου.', 'Δεν χρησιμοποιώ αναγνωρίσιμο υλικό πελατών χωρίς ξεκάθαρη άδεια.', 'Όταν κάτι βασίζεται σε δουλειά με πελάτες, είναι φανταστικό, αρκετά αλλαγμένο ή συνδυασμός μοτίβων από διαφορετικούς ανθρώπους, ώστε να μην μπορεί να ταυτοποιηθεί κάποιος συγκεκριμένος.', 'Αν ποτέ ήθελα να χρησιμοποιήσω κάτι που μοιάζει αναγνωρίσιμα με τη δική σου πραγματική ιστορία, θα σε ρωτούσα πρώτα.', 'Το όχι είναι όχι.']
    }, {
      label: 'Σημειώσεις και δεδομένα',
      body: ['Κρατάω τα αρχεία που χρειάζονται στο ελάχιστο που θεωρώ απαραίτητο και χρησιμοποιώ επαγγελματικά εργαλεία για συνεδρίες, επικοινωνία και scheduling.', 'Αν θέλεις να ξέρεις ακριβώς τι κρατάω, πού και για πόσο, ρώτησέ με. Θα σου απαντήσω συγκεκριμένα.']
    }, {
      label: 'NDA',
      body: ['Αν ένα NDA σε βοηθά να νιώσεις πιο ασφαλής για το business κομμάτι, μπορούμε να το συζητήσουμε πριν ξεκινήσουμε.']
    }, {
      label: 'Τα όρια',
      body: ['Δεν πρόκειται να υποσχεθώ απόλυτη μυστικότητα, γιατί δεν θα ήταν ειλικρινής υπόσχεση.', 'Η εμπιστευτικότητα είναι ο κανόνας. Υπάρχουν όμως περιορισμένες περιπτώσεις όπου μπορεί να έχει όρια, όπως άμεσος και σοβαρός κίνδυνος βλάβης ή περιπτώσεις όπου η γνωστοποίηση απαιτείται από τον νόμο.', 'Ως ψυχοθεραπευτής εγγεγραμμένος στο BACP χρησιμοποιώ επίσης κλινική εποπτεία. Η εποπτεία είναι και η ίδια εμπιστευτική και το υλικό συζητείται με τρόπο που προστατεύει την ταυτότητα του πελάτη.', 'Αν κάποιος από αυτούς τους περιορισμούς έχει ιδιαίτερη σημασία για τη δική σου περίπτωση, ρώτησέ με πριν ξεκινήσουμε.']
    }, {
      label: 'Αυτή η σελίδα δεν είναι το συμβόλαιο',
      body: ['Είναι μια απλή εξήγηση του τρόπου με τον οποίο χειρίζομαι την εμπιστευτικότητα.', 'Δεν αντικαθιστά τη συμφωνία συνεργασίας, την ενημέρωση για τα προσωπικά δεδομένα, τα έγγραφα συναίνεσης ή ένα NDA όπου χρειάζεται.', 'Αν η εμπιστευτικότητα είναι αυτό που σε κάνει να διστάζεις, πες μου ακριβώς τι σε ανησυχεί.']
    }]
  }
};
function ConfidentialityPage({
  lang = 'en'
}) {
  const mob = useIsMobile();
  const c = CONF[lang] || CONF.en;
  const bodyP = {
    fontSize: mob ? '17px' : '18px',
    lineHeight: 1.7,
    color: C.text,
    margin: '0 0 .8rem'
  };
  return React.createElement('main', {
    style: locMobPage(mob)
  }, React.createElement('h1', {
    style: {
      ...h1Style,
      marginBottom: mob ? '1.25rem' : '1.5rem',
      fontSize: mob ? '24px' : '30px'
    }
  }, c.h1), c.intro.map((t, i) => i === 0 ? React.createElement('p', {
    key: i,
    style: {
      ...leadStyle,
      marginBottom: '.7rem'
    }
  }, t) : React.createElement('p', {
    key: i,
    style: bodyP
  }, t)), React.createElement('div', {
    style: {
      marginBottom: mob ? '2rem' : '2.75rem'
    }
  }), c.sections.map((s, i) => React.createElement(Section, {
    key: i,
    label: s.label,
    mob
  }, s.body.map((p, j) => React.createElement(P, {
    key: 'b' + j,
    last: !s.list && !s.after && j === s.body.length - 1
  }, p)), s.list && React.createElement('ul', {
    style: {
      margin: '0 0 1.1rem',
      paddingLeft: '1.2rem',
      lineHeight: 1.9,
      fontSize: mob ? '16px' : '17px',
      color: C.text
    }
  }, s.list.map((li, k) => React.createElement('li', {
    key: 'l' + k,
    style: {
      marginBottom: '.35rem'
    }
  }, li))), s.after && s.after.map((p, j) => React.createElement(P, {
    key: 'a' + j,
    last: j === s.after.length - 1
  }, p)))), React.createElement(BookCta, {
    lang
  }), React.createElement(SiteFooter, {
    mob,
    lang
  }));
}

// ─── APP MOUNT (bilingual, central) ──────────────────────────────────────────
// Every core index.html calls renderApp(pageId, lang). Legacy/SEO pages still
// use SpecialtyPage via their own inline scripts.
const CORE_PAGES = {
  'home': HomePage,
  'one-to-one': OneToOnePage,
  'about': AboutPage,
  'reviews': ReviewsPage,
  'book': BookPage,
  'confidentiality': ConfidentialityPage
};
function CoreApp({
  pageId,
  lang
}) {
  const [open, setOpen] = React.useState(true);
  const mainRef = React.useRef(null);
  React.useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [pageId]);
  const Page = CORE_PAGES[pageId] || HomePage;
  return React.createElement(React.Fragment, null, React.createElement('div', {
    id: 'sidebar'
  }, React.createElement(Sidebar, {
    page: pageId,
    lang: lang,
    open: open,
    setOpen: setOpen
  })), React.createElement('div', {
    id: 'main-scroll',
    ref: mainRef
  }, React.createElement(Page, {
    lang: lang
  })));
}
function renderApp(pageId, lang) {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(CoreApp, {
    pageId: pageId,
    lang: lang || 'en'
  }));
}
Object.assign(window, {
  HomePage,
  OneToOnePage,
  AboutPage,
  ReviewsPage,
  BookPage,
  ConfidentialityPage,
  SpecialtyPage,
  CoreApp,
  renderApp,
  SiteFooter
});
