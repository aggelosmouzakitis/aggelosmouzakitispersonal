// sidebar.jsx — desktop sidebar + mobile bottom nav (bilingual, one offer)

const SB = {
  bg: '#F5F5F5',
  border: 'rgba(40,39,38,0.1)',
  muted: '#6e6e6e',
  text: 'rgba(40,39,38,0.65)',
  active: '#282726',
  accent: '#1a7f37',
  W: 300,
  WC: 68
};

// Self-contained bilingual path model (mirrors content-pages.jsx CORE_PATHS).
// Kept here too so the sidebar never depends on script load order.
const SB_CORE_PATHS = {
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
  'blog': {
    en: '/blog/',
    el: '/blog/?lang=el'
  }
};
const sbPath = (id, lang) => SB_CORE_PATHS[id] && SB_CORE_PATHS[id][lang] || SB_CORE_PATHS[id] && SB_CORE_PATHS[id].en || '/';
const SB_LABELS = {
  en: {
    role: 'Business Growth Advisor + Licensed Psychotherapist',
    home: 'Home',
    workWith: 'Work with me',
    oneToOne: '1:1',
    about: 'About',
    writing: 'Writing',
    reviews: 'Reviews',
    findMe: 'Find me',
    diagHead: 'Starting Diagnostic',
    diagSub: "10 minutes on the business, what's getting in the way, and where the two meet.",
    diagBtn: 'START →',
    diagShort: 'Diagnostic',
    book: 'Book a fit call →',
    bookShort: 'Book'
  },
  el: {
    role: 'Business Growth Advisor + Ψυχοθεραπευτής',
    home: 'Αρχική',
    workWith: 'Συνεργασία',
    oneToOne: '1:1',
    about: 'Σχετικά',
    writing: 'Άρθρα',
    reviews: 'Κριτικές',
    findMe: 'Βρες με',
    diagHead: 'Starting Diagnostic',
    diagSub: '10 λεπτά για το business σου: τι το φρενάρει και πού μπαίνεις εσύ στην εξίσωση.',
    diagBtn: 'ΞΕΚΙΝΑ →',
    diagShort: 'Τεστ',
    book: 'Κλείσε γνωριμία →',
    bookShort: 'Γνωριμία'
  }
};
const sbT = lang => SB_LABELS[lang] || SB_LABELS.en;
// Starting Diagnostic route is language-aware.
const diagPath = lang => lang === 'el' ? '/el/startingdiagnostic/' : '/startingdiagnostic/';
const ICONS = {
  OneToOne: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  })),
  User: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  Book: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
  })),
  Quote: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
  })),
  Globe: () => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "12",
    x2: "22",
    y2: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
  })),
  LinkedIn: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "9",
    width: "4",
    height: "12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "4",
    cy: "4",
    r: "2"
  })),
  YouTube: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "9.75 15.02 15.5 12 9.75 8.98 9.75 15.02",
    fill: "white"
  })),
  ExtLink: () => /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "7",
    y1: "17",
    x2: "17",
    y2: "7"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 7 17 7 17 17"
  })),
  Home: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 21 9 12 15 12 15 21"
  })),
  Pulse: () => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 12h-4l-3 9L9 3l-3 9H2"
  })),
  Instagram: () => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17.5",
    y1: "6.5",
    x2: "17.5",
    y2: "6.5"
  })),
  ChevLeft: () => /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  })),
  ChevRight: () => /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }))
};
const SOCIALS = [{
  id: 'li',
  label: 'LinkedIn',
  href: 'https://linkedin.com/in/growth-product-manager/',
  Icon: ICONS.LinkedIn
}, {
  id: 'yt',
  label: 'YouTube',
  href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA',
  Icon: ICONS.YouTube
}, {
  id: 'ig',
  label: 'Instagram',
  href: 'https://www.instagram.com/_aggelosmouzakitis_/',
  Icon: ICONS.Instagram
}];

// Primary nav: id -> {label(lang), href(lang), Icon}. All real <a href> for crawlers.
const NAV_ITEMS = [{
  id: 'home',
  key: 'home',
  Icon: ICONS.Home
}, {
  id: 'one-to-one',
  key: 'workWith',
  Icon: ICONS.OneToOne
}, {
  id: 'about',
  key: 'about',
  Icon: ICONS.User
}, {
  id: 'blog',
  key: 'writing',
  Icon: ICONS.Book
}, {
  id: 'reviews',
  key: 'reviews',
  Icon: ICONS.Quote
}];
// Which nav id is "active" for a given current page id.
const activeNav = page => page === 'blog' ? 'blog' : page;

// ── LANGUAGE SWITCHER ────────────────────────────────────────────────────────
// Links to the equivalent page in the other language (not always home).
function langHref(page, targetLang) {
  if (SB_CORE_PATHS[page]) return sbPath(page, targetLang);
  return targetLang === 'el' ? '/el/' : '/'; // fallback for unmapped pages
}
function LangSwitch({
  page,
  lang,
  compact,
  full
}) {
  const seg = (l, label) => {
    const active = l === lang;
    return /*#__PURE__*/React.createElement("a", {
      href: active ? undefined : langHref(page, l),
      "aria-current": active ? 'true' : undefined,
      hrefLang: l,
      title: l === 'en' ? 'English' : 'Ελληνικά',
      style: {
        padding: full ? '4px 12px' : compact ? '3px 8px' : '4px 10px',
        fontSize: full ? '12px' : compact ? '11px' : '12px',
        fontWeight: full ? 600 : 700,
        letterSpacing: full ? '.02em' : '.04em',
        textTransform: full ? 'none' : 'uppercase',
        textDecoration: 'none',
        borderRadius: '3px',
        color: active ? '#fff' : SB.text,
        background: active ? SB.accent : 'transparent',
        cursor: active ? 'default' : 'pointer',
        pointerEvents: active ? 'none' : 'auto'
      }
    }, label);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      border: `1px solid ${SB.border}`,
      borderRadius: '5px',
      padding: 2,
      background: '#fff'
    }
  }, seg('en', full ? 'English' : 'EN'), seg('el', full ? 'Ελληνικά' : 'ΕΛ'));
}

// ── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileNav({
  page,
  lang
}) {
  const t = sbT(lang);
  const tabStyle = active => ({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '8px 1px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? '#1a7f37' : 'rgba(40,39,38,0.55)',
    fontFamily: 'inherit',
    fontSize: '9px',
    letterSpacing: '.02em',
    textTransform: 'uppercase',
    transition: 'color .15s',
    textDecoration: 'none'
  });
  const act = activeNav(page);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 10,
      right: 10,
      zIndex: 120
    }
  }, /*#__PURE__*/React.createElement(LangSwitch, {
    page: page,
    lang: lang,
    compact: true
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      height: 64,
      background: '#F5F5F5',
      borderTop: '1px solid rgba(40,39,38,0.1)',
      display: 'flex',
      alignItems: 'stretch',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: tabStyle(act === 'home'),
    href: sbPath('home', lang)
  }, /*#__PURE__*/React.createElement(ICONS.Home, null), /*#__PURE__*/React.createElement("span", null, t.home)), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(act === 'one-to-one'),
    href: sbPath('one-to-one', lang)
  }, /*#__PURE__*/React.createElement(ICONS.OneToOne, null), /*#__PURE__*/React.createElement("span", null, t.oneToOne)), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(act === 'about'),
    href: sbPath('about', lang)
  }, /*#__PURE__*/React.createElement(ICONS.User, null), /*#__PURE__*/React.createElement("span", null, t.about)), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(act === 'blog'),
    href: sbPath('blog', lang)
  }, /*#__PURE__*/React.createElement(ICONS.Book, null), /*#__PURE__*/React.createElement("span", null, t.writing)), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(act === 'reviews'),
    href: sbPath('reviews', lang)
  }, /*#__PURE__*/React.createElement(ICONS.Quote, null), /*#__PURE__*/React.createElement("span", null, t.reviews)), /*#__PURE__*/React.createElement("a", {
    style: {
      ...tabStyle(act === 'diagnostic'),
      color: '#1a7f37',
      fontWeight: 700
    },
    href: diagPath(lang)
  }, /*#__PURE__*/React.createElement(ICONS.Pulse, null), /*#__PURE__*/React.createElement("span", null, t.diagShort))));
}

// ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({
  page,
  lang = 'en',
  open,
  setOpen
}) {
  const [hovered, setHovered] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const t = sbT(lang);
  const act = activeNav(page);
  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  if (isMobile) return /*#__PURE__*/React.createElement(MobileNav, {
    page: page,
    lang: lang
  });
  const homeHref = sbPath('home', lang);
  const ToggleBtn = () => /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    title: open ? 'Collapse' : 'Expand',
    style: {
      position: 'absolute',
      left: open ? SB.W - 13 : SB.WC - 13,
      top: 32,
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: '#ffffff',
      border: '1px solid rgba(200,200,200,0.3)',
      color: '#1A1918',
      cursor: 'pointer',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      padding: 0
    }
  }, open ? /*#__PURE__*/React.createElement(ICONS.ChevLeft, null) : /*#__PURE__*/React.createElement(ICONS.ChevRight, null));

  // High-contrast tooltip for the collapsed rail — appears immediately on
  // hover/focus (no native-title delay), positioned just right of the icon.
  const TIP = {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: 10,
    background: '#282726',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: 6,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '.02em',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(0,0,0,.28)',
    zIndex: 200,
    pointerEvents: 'none'
  };
  const iconNav = (id, Icon, href, active, title) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    "aria-label": title,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
    style: {
      position: 'relative',
      width: SB.WC,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? 'rgba(40,39,38,0.08)' : hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
      textDecoration: 'none',
      color: active ? SB.active : hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
      transition: 'background .12s, color .12s'
    }
  }, /*#__PURE__*/React.createElement(Icon, null), hovered === id && /*#__PURE__*/React.createElement("span", {
    style: TIP
  }, title));
  const iconLink = ({
    id,
    label,
    href,
    Icon
  }) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    target: "_blank",
    rel: "noopener",
    "aria-label": label,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
    style: {
      position: 'relative',
      width: SB.WC,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
      color: hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
      textDecoration: 'none',
      transition: 'background .12s, color .12s'
    }
  }, /*#__PURE__*/React.createElement(Icon, null), hovered === id && /*#__PURE__*/React.createElement("span", {
    style: TIP
  }, label));
  const navItemStyle = (id, active) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '11px 18px',
    background: active ? 'rgba(40,39,38,0.08)' : hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
    borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '.03em',
    textTransform: 'uppercase',
    color: active ? SB.active : hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
    transition: 'background .12s, color .12s'
  });
  const navLink = (id, label, Icon, active, href) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: navItemStyle(id, active)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("span", null, label)));
  const sectionLabel = text => /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: SB.muted,
      padding: '18px 18px 6px'
    }
  }, text);

  // ── COLLAPSED ──
  if (!open) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: SB.WC,
      minWidth: SB.WC,
      background: SB.bg,
      borderRight: `1px solid ${SB.border}`,
      height: '100vh',
      position: 'relative',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ToggleBtn, null), /*#__PURE__*/React.createElement("a", {
    href: homeHref
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos-96.webp?v=2",
    alt: "Aggelos Mouzakitis",
    width: 38,
    height: 38,
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      margin: '22px 0 8px',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("a", {
    href: langHref(page, lang === 'en' ? 'el' : 'en'),
    title: lang === 'en' ? 'Ελληνικά' : 'English',
    hrefLang: lang === 'en' ? 'el' : 'en',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      color: SB.text,
      textDecoration: 'none',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '.04em',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(ICONS.Globe, null), /*#__PURE__*/React.createElement("span", null, lang === 'en' ? 'ΕΛ' : 'EN')), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: SB.border,
      alignSelf: 'stretch',
      margin: '0 12px 4px'
    }
  }), NAV_ITEMS.map(it => iconNav(it.id, it.Icon, sbPath(it.id, lang), act === it.id, t[it.key])), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: SB.border,
      alignSelf: 'stretch',
      margin: '4px 12px'
    }
  }), iconNav('diagnostic', ICONS.Pulse, diagPath(lang), act === 'diagnostic', t.diagHead), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: SB.border,
      alignSelf: 'stretch',
      margin: '4px 12px'
    }
  }), SOCIALS.map(s => iconLink(s)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }));

  // ── EXPANDED ──
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: SB.W,
      minWidth: SB.W,
      background: SB.bg,
      borderRight: `1px solid ${SB.border}`,
      height: '100vh',
      position: 'relative',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement(ToggleBtn, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '22px 18px 20px',
      borderBottom: `1px solid ${SB.border}`,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: homeHref,
    style: {
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos-96.webp?v=2",
    alt: "Aggelos Mouzakitis",
    width: 38,
    height: 38,
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '15px',
      fontWeight: 700,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      color: SB.active,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Aggelos Mouzakitis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: SB.muted,
      marginTop: 3,
      lineHeight: 1.35
    }
  }, t.role))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 18px',
      borderBottom: `1px solid ${SB.border}`,
      display: 'flex',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(LangSwitch, {
    page: page,
    lang: lang,
    full: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0 0'
    }
  }, NAV_ITEMS.map(it => navLink(it.id, t[it.key], it.Icon, act === it.id, sbPath(it.id, lang)))), sectionLabel(t.findMe), SOCIALS.map(({
    id,
    label,
    href,
    Icon
  }) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    target: "_blank",
    rel: "noopener",
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 18px',
      textDecoration: 'none',
      background: hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
      color: hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
      fontSize: '13px',
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      transition: 'color .12s, background .12s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, /*#__PURE__*/React.createElement(ICONS.ExtLink, null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 22px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1.5px solid rgba(26,127,55,0.45)`,
      padding: '19px',
      background: 'rgba(26,127,55,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: SB.accent,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(ICONS.Pulse, null)), /*#__PURE__*/React.createElement("span", null, t.diagHead)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: 500,
      color: SB.active,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, t.diagSub), /*#__PURE__*/React.createElement("a", {
    href: diagPath(lang),
    onMouseEnter: e => {
      e.currentTarget.style.background = '#146b2e';
      e.currentTarget.style.borderColor = '#146b2e';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = SB.accent;
      e.currentTarget.style.borderColor = SB.accent;
    },
    style: {
      display: 'block',
      textAlign: 'center',
      width: '100%',
      padding: '13px 0',
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '13px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      background: SB.accent,
      border: `1.5px solid ${SB.accent}`,
      color: '#fff',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background .15s, border-color .15s'
    }
  }, t.diagBtn)))));
}
Object.assign(window, {
  Sidebar
});
