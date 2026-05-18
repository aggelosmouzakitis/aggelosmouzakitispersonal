// sidebar.jsx — desktop sidebar + mobile bottom nav with bottom sheet

const SB = {
  bg: '#1A1918',
  border: 'rgba(255,255,255,0.08)',
  muted: '#555',
  text: 'rgba(255,255,255,0.6)',
  active: '#ffffff',
  accent: '#00bf63',
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
  Briefcase: () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
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
    d: "M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
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
  })),
  ChevDown: ({
    isOpen
  }) => /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    style: {
      transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
      transition: 'transform .18s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  })),
  ChevUp: () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  })),
  X: () => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))
};
const SPECIALTIES = [{
  id: 'therapy-for-executives',
  label: 'Therapy for Executives'
}, {
  id: 'therapy-for-founders',
  label: 'Therapy for Founders'
}, {
  id: 'imposter-syndrome-therapy',
  label: 'Imposter Syndrome Coaching'
}, {
  id: 'executive-burnout-therapy',
  label: 'Burnout Coaching'
}, {
  id: 'career-transition-therapy',
  label: 'Career Transition Coaching'
}];
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

// ── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileNav({
  page,
  setPage
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const isSpecialty = SPECIALTIES.some(s => s.id === page);
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
    color: active ? '#00bf63' : 'rgba(255,255,255,0.5)',
    fontFamily: 'inherit',
    fontSize: '9px',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    transition: 'color .15s'
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, sheetOpen && /*#__PURE__*/React.createElement("div", {
    onClick: () => setSheetOpen(false),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 90,
      backdropFilter: 'blur(2px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 64,
      background: '#1A1918',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px 16px 0 0',
      zIndex: 91,
      padding: '0 0 8px',
      transform: sheetOpen ? 'translateY(0)' : 'translateY(110%)',
      transition: 'transform .3s cubic-bezier(.32,.72,0,1)',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '12px 0 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'rgba(255,255,255,0.2)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 20px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      letterSpacing: '.15em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.4)'
    }
  }, "Specialties"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSheetOpen(false),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.5)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(ICONS.X, null))), SPECIALTIES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => {
      setPage(s.id);
      setSheetOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '14px 20px',
      background: page === s.id ? 'rgba(0,191,99,0.08)' : 'none',
      border: 'none',
      borderLeft: page === s.id ? '2px solid #00bf63' : '2px solid transparent',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '14px',
      letterSpacing: '.05em',
      color: page === s.id ? '#00bf63' : 'rgba(255,255,255,0.8)',
      textAlign: 'left'
    }
  }, s.label)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPage('ask-me-anything');
      setSheetOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '14px 20px',
      background: page === 'ask-me-anything' ? 'rgba(0,191,99,0.08)' : 'none',
      border: 'none',
      borderLeft: page === 'ask-me-anything' ? '2px solid #00bf63' : '2px solid transparent',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '14px',
      letterSpacing: '.05em',
      color: page === 'ask-me-anything' ? '#00bf63' : 'rgba(255,255,255,0.8)',
      textAlign: 'left'
    }
  }, "Ask me anything"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '12px 20px 4px',
      padding: '14px',
      border: '1px solid rgba(0,191,99,0.25)',
      background: 'rgba(0,191,99,0.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      letterSpacing: '.15em',
      textTransform: 'uppercase',
      color: '#00bf63',
      marginBottom: 8
    }
  }, "Free Burnout Diagnostic"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.45)',
      marginBottom: 12
    }
  }, "45 questions. Score + section breakdown."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPage('diagnostic');
      setSheetOpen(false);
    },
    style: {
      width: '100%',
      padding: '10px',
      fontFamily: 'inherit',
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      background: 'transparent',
      border: '1px solid #00bf63',
      color: '#00bf63',
      cursor: 'pointer'
    }
  }, "Start assessment \u2192"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      height: 64,
      background: '#1A1918',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'stretch',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: tabStyle(page === 'home'),
    onClick: () => {
      setPage('home');
      setSheetOpen(false);
    }
  }, /*#__PURE__*/React.createElement(ICONS.Home, null), /*#__PURE__*/React.createElement("span", null, "Home")), /*#__PURE__*/React.createElement("button", {
    style: tabStyle(page === 'blog'),
    onClick: () => {
      setPage('blog');
      setSheetOpen(false);
    }
  }, /*#__PURE__*/React.createElement(ICONS.Book, null), /*#__PURE__*/React.createElement("span", null, "Writing")), /*#__PURE__*/React.createElement("button", {
    style: tabStyle(isSpecialty || sheetOpen),
    onClick: () => setSheetOpen(v => !v)
  }, /*#__PURE__*/React.createElement(ICONS.Briefcase, null), /*#__PURE__*/React.createElement("span", null, "Services")), SOCIALS.map(({
    id,
    label,
    href,
    Icon
  }) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: href,
    target: "_blank",
    rel: "noopener",
    style: {
      ...tabStyle(false),
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, null), /*#__PURE__*/React.createElement("span", null, label))), /*#__PURE__*/React.createElement("button", {
    style: tabStyle(page === 'diagnostic'),
    onClick: () => {
      setPage('diagnostic');
      setSheetOpen(false);
    }
  }, /*#__PURE__*/React.createElement(ICONS.Clipboard, null), /*#__PURE__*/React.createElement("span", null, "Diagnostic"))));
}

// ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({
  page,
  setPage,
  open,
  setOpen
}) {
  const [specialtiesOpen, setSpecialtiesOpen] = React.useState(true);
  const [hovered, setHovered] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  if (isMobile) return /*#__PURE__*/React.createElement(MobileNav, {
    page: page,
    setPage: setPage
  });
  const isSpecialty = SPECIALTIES.some(s => s.id === page);
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
      boxShadow: '0 2px 8px rgba(0,0,0,0.55)',
      padding: 0
    }
  }, open ? /*#__PURE__*/React.createElement(ICONS.ChevLeft, null) : /*#__PURE__*/React.createElement(ICONS.ChevRight, null));
  const iconBtn = (id, Icon, onClick, active, title) => /*#__PURE__*/React.createElement("button", {
    key: id,
    title: title,
    onClick: onClick,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
      width: SB.WC,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? 'rgba(255,255,255,0.1)' : hovered === id ? 'rgba(255,255,255,0.05)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: active ? SB.active : hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
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
      background: hovered === id ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
      textDecoration: 'none',
      transition: 'background .12s, color .12s'
    }
  }, /*#__PURE__*/React.createElement(Icon, null));
  const navBtn = (id, label, Icon, active, onClick, extra) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: onClick,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '9px 18px',
      background: active ? 'rgba(255,255,255,0.08)' : hovered === id ? 'rgba(255,255,255,0.04)' : 'transparent',
      border: 'none',
      borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '12.5px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: active ? SB.active : hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
      transition: 'background .12s, color .12s'
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
  const subBtn = (id, label, active, onClick) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: onClick,
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    style: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: '7px 18px 7px 50px',
      background: active ? 'rgba(255,255,255,0.06)' : hovered === id ? 'rgba(255,255,255,0.03)' : 'transparent',
      border: 'none',
      borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '12px',
      letterSpacing: '.07em',
      textTransform: 'uppercase',
      color: active ? SB.accent : hovered === id ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)',
      transition: 'background .12s, color .12s'
    }
  }, label);
  const sectionLabel = text => /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      letterSpacing: '.18em',
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
  }, /*#__PURE__*/React.createElement(ToggleBtn, null), /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos.jpg",
    alt: "Aggelos Mouzakitis",
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      margin: '22px 0 18px',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: SB.border,
      alignSelf: 'stretch',
      margin: '0 12px 4px'
    }
  }), iconBtn('home', ICONS.Home, () => setPage('home'), page === 'home', 'Home'), iconBtn('blog', ICONS.Book, () => setPage('blog'), page === 'blog', 'Writing'), iconBtn('ask-me-anything', ICONS.MessageCircle, () => setPage('ask-me-anything'), page === 'ask-me-anything', 'Ask me anything'), iconBtn('spec', ICONS.Briefcase, () => {
    setOpen(true);
    setSpecialtiesOpen(true);
  }, isSpecialty, 'Specialties'), iconBtn('diag', ICONS.Clipboard, () => setPage('diagnostic'), page === 'diagnostic', 'Free Diagnostic'), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://aggelosmouzakitis.com/img/aggelos.jpg",
    alt: "Aggelos Mouzakitis",
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12.5px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: SB.active,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Aggelos Mouzakitis"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: SB.muted
    }
  }, "Psychotherapist & Coach"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 0 0'
    }
  }, navBtn('home', 'Home', ICONS.Home, page === 'home', () => setPage('home')), navBtn('blog', 'Writing', ICONS.Book, page === 'blog', () => setPage('blog')), navBtn('ask-me-anything', 'Ask me anything', ICONS.MessageCircle, page === 'ask-me-anything', () => setPage('ask-me-anything'))), navBtn('spec', 'Specialties', ICONS.Briefcase, isSpecialty, () => setSpecialtiesOpen(v => !v), /*#__PURE__*/React.createElement(ICONS.ChevDown, {
    isOpen: specialtiesOpen
  })), specialtiesOpen && /*#__PURE__*/React.createElement("div", null, SPECIALTIES.map(s => subBtn(s.id, s.label, page === s.id, () => setPage(s.id)))), sectionLabel('Find me'), SOCIALS.map(({
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
      padding: '8px 18px',
      textDecoration: 'none',
      background: hovered === id ? 'rgba(255,255,255,0.04)' : 'transparent',
      color: hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
      fontSize: '12px',
      letterSpacing: '.1em',
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
      border: `1px solid rgba(0,191,99,0.25)`,
      padding: '18px',
      background: 'rgba(0,191,99,0.04)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: SB.accent,
      marginBottom: 8
    }
  }, "Free Burnout Diagnostic"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: SB.muted,
      lineHeight: 1.75,
      marginBottom: 14
    }
  }, "45 questions. 8 minutes.", /*#__PURE__*/React.createElement("br", null), "Score + section breakdown."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('diagnostic'),
    onMouseEnter: e => {
      e.currentTarget.style.background = SB.accent;
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = SB.accent;
    },
    style: {
      width: '100%',
      padding: '10px 0',
      fontFamily: 'inherit',
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      background: 'transparent',
      border: `1px solid ${SB.accent}`,
      color: SB.accent,
      cursor: 'pointer',
      transition: 'background .15s, color .15s'
    }
  }, "Start assessment \u2192")))));
}
Object.assign(window, {
  Sidebar
});
