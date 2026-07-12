// sidebar.jsx — desktop sidebar + mobile bottom nav

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
const ICONS = {
  Home: () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
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
  Clipboard: () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "8",
    height: "4",
    rx: "1"
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
  MessageCircle: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  })),
  Briefcase: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
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
  Compass: () => /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
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
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
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
}];

// Real URLs for every nav target, so navigation renders as crawlable <a href> links.
const NAV_URL = {
  'home': '/',
  'blog': '/blog/',
  'ask-me-anything': '/ask-me-anything/',
  'diagnostic': '/burnout-diagnostic/',
  'founders': '/founders/',
  'solopreneurs': '/solopreneurs/',
  'how-i-work': '/how-i-work/',
  'book': '/book/'
};
const hrefFor = id => NAV_URL[id] || '/';

// ── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileNav({
  page
}) {
  const tabStyle = active => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? '#1a7f37' : 'rgba(40,39,38,0.55)',
    fontFamily: 'inherit',
    fontSize: '10px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    transition: 'color .15s',
    textDecoration: 'none'
  });
  return /*#__PURE__*/React.createElement("nav", {
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
    style: tabStyle(page === 'home'),
    href: hrefFor('home')
  }, /*#__PURE__*/React.createElement(ICONS.Home, null), /*#__PURE__*/React.createElement("span", null, "Home")), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(page === 'founders'),
    href: hrefFor('founders')
  }, /*#__PURE__*/React.createElement(ICONS.Briefcase, null), /*#__PURE__*/React.createElement("span", null, "Founders")), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(page === 'solopreneurs'),
    href: hrefFor('solopreneurs')
  }, /*#__PURE__*/React.createElement(ICONS.User, null), /*#__PURE__*/React.createElement("span", null, "Solo")), /*#__PURE__*/React.createElement("a", {
    style: tabStyle(page === 'blog'),
    href: hrefFor('blog')
  }, /*#__PURE__*/React.createElement(ICONS.Book, null), /*#__PURE__*/React.createElement("span", null, "Writing")));
}

// ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({
  page,
  setPage,
  open,
  setOpen
}) {
  const [hovered, setHovered] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  if (isMobile) return /*#__PURE__*/React.createElement(MobileNav, {
    page: page
  });
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

  // Collapsed-rail icon as a real link (navigation)
  const iconNav = (id, Icon, href, active, title) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    title: title,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
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
  }, /*#__PURE__*/React.createElement(Icon, null));
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
    title: label,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
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
  }, /*#__PURE__*/React.createElement(Icon, null));

  // Collapsed-rail placeholder icon (not yet a link)
  const iconPlaceholder = (id, Icon, title) => /*#__PURE__*/React.createElement("div", {
    key: id,
    title: title,
    style: {
      width: SB.WC,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(40,39,38,0.3)',
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement(Icon, null));
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

  // Expanded nav row as a real link (navigation)
  const navLink = (id, label, Icon, active, href, extra) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
      ...navItemStyle(id, active),
      border: undefined
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
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("span", null, label)), extra);

  // Expanded nav placeholder row (not yet a link)
  const navPlaceholder = (id, label, Icon) => /*#__PURE__*/React.createElement("div", {
    key: id,
    title: "Coming soon",
    style: {
      ...navItemStyle(id, false),
      border: undefined,
      background: 'transparent',
      color: 'rgba(40,39,38,0.35)',
      cursor: 'default'
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
    href: hrefFor('home')
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos-96.webp",
    alt: "Aggelos Mouzakitis",
    width: 38,
    height: 38,
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      margin: '22px 0 18px',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: SB.border,
      alignSelf: 'stretch',
      margin: '0 12px 4px'
    }
  }), iconNav('home', ICONS.Home, hrefFor('home'), page === 'home', 'Home'), iconNav('founders', ICONS.Briefcase, hrefFor('founders'), page === 'founders', 'For founders'), iconNav('solopreneurs', ICONS.User, hrefFor('solopreneurs'), page === 'solopreneurs', 'For solopreneurs'), iconNav('how-i-work', ICONS.Compass, hrefFor('how-i-work'), page === 'how-i-work', 'How I work'), iconNav('blog', ICONS.Book, hrefFor('blog'), page === 'blog', 'Writing'), /*#__PURE__*/React.createElement("div", {
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
    href: hrefFor('home'),
    style: {
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos-96.webp",
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
      fontSize: '12px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: SB.muted,
      marginTop: 2
    }
  }, "Advisor \xB7 Psychotherapist"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0 0'
    }
  }, navLink('home', 'Home', ICONS.Home, page === 'home', hrefFor('home')), navLink('founders', 'For founders', ICONS.Briefcase, page === 'founders', hrefFor('founders')), navLink('solopreneurs', 'For solopreneurs', ICONS.User, page === 'solopreneurs', hrefFor('solopreneurs')), navLink('how-i-work', 'How I work', ICONS.Compass, page === 'how-i-work', hrefFor('how-i-work')), navLink('blog', 'Writing', ICONS.Book, page === 'blog', hrefFor('blog'))), sectionLabel('Find me'), SOCIALS.map(({
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
      fontSize: '13px',
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: SB.accent,
      marginBottom: 9
    }
  }, "Work With Me"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      fontWeight: 500,
      color: SB.active,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "A 15-minute fit call to see if it's a fit."), /*#__PURE__*/React.createElement("a", {
    href: "/book/",
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
  }, "Book a fit call \u2192")))));
}
Object.assign(window, {
  Sidebar
});
