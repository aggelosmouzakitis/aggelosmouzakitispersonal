// sidebar.jsx — desktop sidebar + mobile bottom nav

const SB = {
  bg: '#F5F5F4',
  border: 'rgba(40,39,38,0.1)',
  muted: '#888',
  text: 'rgba(40,39,38,0.65)',
  active: '#282726',
  accent: '#1a7f37',
  W: 300,
  WC: 68,
};

const ICONS = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <polyline points="9 21 9 12 15 12 15 21"/>
    </svg>
  ),
  Clipboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  ),
  Book: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  MessageCircle: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  ExtLink: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/>
      <polyline points="7 7 17 7 17 17"/>
    </svg>
  ),
  ChevLeft: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevRight: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

const SOCIALS = [
  { id: 'li', label: 'LinkedIn', href: 'https://linkedin.com/in/growth-product-manager/', Icon: ICONS.LinkedIn },
  { id: 'yt', label: 'YouTube', href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA', Icon: ICONS.YouTube },
];

// Real URLs for every nav target, so navigation renders as crawlable <a href> links.
const NAV_URL = {
  'home': '/', 'blog': '/blog/', 'ask-me-anything': '/ask-me-anything/',
  'diagnostic': '/burnout-diagnostic/',
};
const hrefFor = (id) => NAV_URL[id] || '/';

// ── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileNav({ page }) {
  const tabStyle = (active) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 4, padding: '8px 4px',
    background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#1a7f37' : 'rgba(40,39,38,0.55)',
    fontFamily: 'inherit', fontSize: '9px', letterSpacing: '.1em',
    textTransform: 'uppercase', transition: 'color .15s', textDecoration: 'none',
  });

  return (
    <nav style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, height: 64,
      background: '#F5F5F4', borderTop: '1px solid rgba(40,39,38,0.1)',
      display: 'flex', alignItems: 'stretch', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <a style={tabStyle(page === 'home')} href={hrefFor('home')}>
        <ICONS.Home /><span>Home</span>
      </a>
      <a style={tabStyle(page === 'blog')} href={hrefFor('blog')}>
        <ICONS.Book /><span>Writing</span>
      </a>
      <a style={tabStyle(page === 'ask-me-anything')} href={hrefFor('ask-me-anything')}>
        <ICONS.MessageCircle /><span>Ask</span>
      </a>
      {SOCIALS.map(({ id, label, href, Icon }) => (
        <a key={id} href={href} target="_blank" rel="noopener" style={{ ...tabStyle(false), textDecoration: 'none' }}>
          <Icon /><span>{label}</span>
        </a>
      ))}
      <a style={tabStyle(page === 'diagnostic')} href={hrefFor('diagnostic')}>
        <ICONS.Clipboard /><span>Diagnostic</span>
      </a>
    </nav>
  );
}

// ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ page, setPage, open, setOpen }) {
  const [hovered, setHovered] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  if (isMobile) return <MobileNav page={page} />;

  const ToggleBtn = () => (
    <button onClick={() => setOpen(!open)} title={open ? 'Collapse' : 'Expand'}
      style={{
        position: 'absolute', left: open ? SB.W - 13 : SB.WC - 13, top: 32,
        width: 26, height: 26, borderRadius: '50%',
        background: '#ffffff', border: '1px solid rgba(200,200,200,0.3)',
        color: '#1A1918', cursor: 'pointer', zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: 0,
      }}>
      {open ? <ICONS.ChevLeft /> : <ICONS.ChevRight />}
    </button>
  );

  // Collapsed-rail icon as a real link (navigation)
  const iconNav = (id, Icon, href, active, title) => (
    <a key={id} href={href} title={title}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        width: SB.WC, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(40,39,38,0.08)' : hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
        textDecoration: 'none',
        color: active ? SB.active : hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
        transition: 'background .12s, color .12s',
      }}>
      <Icon />
    </a>
  );

  const iconLink = ({ id, label, href, Icon }) => (
    <a key={id} href={href} target="_blank" rel="noopener" title={label}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        width: SB.WC, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
        color: hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
        textDecoration: 'none', transition: 'background .12s, color .12s',
      }}>
      <Icon />
    </a>
  );

  const navItemStyle = (id, active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '9px 18px',
    background: active ? 'rgba(40,39,38,0.08)' : hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
    borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
    cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none',
    fontSize: '12.5px', letterSpacing: '.1em', textTransform: 'uppercase',
    color: active ? SB.active : hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
    transition: 'background .12s, color .12s',
  });

  // Expanded nav row as a real link (navigation)
  const navLink = (id, label, Icon, active, href, extra) => (
    <a key={id} href={href}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{ ...navItemStyle(id, active), border: undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'flex', flexShrink: 0 }}><Icon /></span>
        <span>{label}</span>
      </div>
      {extra}
    </a>
  );

  const sectionLabel = (text) => (
    <div style={{ fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: SB.muted, padding: '18px 18px 6px' }}>
      {text}
    </div>
  );

  // ── COLLAPSED ──
  if (!open) return (
    <div style={{ width: SB.WC, minWidth: SB.WC, background: SB.bg, borderRight: `1px solid ${SB.border}`, height: '100vh', position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ToggleBtn />
      <a href={hrefFor('home')}><img src="https://aggelosmouzakitis.com/img/aggelos.jpg" alt="Aggelos Mouzakitis" width={38} height={38} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', margin: '22px 0 18px', display: 'block' }} /></a>
      <div style={{ height: 1, background: SB.border, alignSelf: 'stretch', margin: '0 12px 4px' }} />
      {iconNav('home', ICONS.Home, hrefFor('home'), page === 'home', 'Home')}
      {iconNav('blog', ICONS.Book, hrefFor('blog'), page === 'blog', 'Writing')}
      {iconNav('ask-me-anything', ICONS.MessageCircle, hrefFor('ask-me-anything'), page === 'ask-me-anything', 'Ask me anything')}
      {iconNav('diag', ICONS.Clipboard, hrefFor('diagnostic'), page === 'diagnostic', 'Free Diagnostic')}
      <div style={{ height: 1, background: SB.border, alignSelf: 'stretch', margin: '4px 12px' }} />
      {SOCIALS.map(s => iconLink(s))}
      <div style={{ flex: 1 }} />
    </div>
  );

  // ── EXPANDED ──
  return (
    <div style={{ width: SB.W, minWidth: SB.W, background: SB.bg, borderRight: `1px solid ${SB.border}`, height: '100vh', position: 'relative', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
      <ToggleBtn />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '22px 18px 20px', borderBottom: `1px solid ${SB.border}`, flexShrink: 0 }}>
          <a href={hrefFor('home')} style={{ display: 'flex', flexShrink: 0 }}><img src="https://aggelosmouzakitis.com/img/aggelos.jpg" alt="Aggelos Mouzakitis" width={38} height={38} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block' }} /></a>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '12.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: SB.active, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Aggelos Mouzakitis</div>
            <div style={{ fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: SB.muted }}>Coach & Therapist</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '10px 0 0' }}>
          {navLink('home', 'Home', ICONS.Home, page === 'home', hrefFor('home'))}
          {navLink('blog', 'Writing', ICONS.Book, page === 'blog', hrefFor('blog'))}
          {navLink('ask-me-anything', 'Ask me anything', ICONS.MessageCircle, page === 'ask-me-anything', hrefFor('ask-me-anything'))}
        </div>

        {/* Find me */}
        {sectionLabel('Find me')}
        {SOCIALS.map(({ id, label, href, Icon }) => (
          <a key={id} href={href} target="_blank" rel="noopener"
            onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 18px', textDecoration: 'none',
              background: hovered === id ? 'rgba(40,39,38,0.04)' : 'transparent',
              color: hovered === id ? 'rgba(40,39,38,0.85)' : SB.text,
              fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase',
              transition: 'color .12s, background .12s',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'flex', flexShrink: 0 }}><Icon /></span>
              <span>{label}</span>
            </div>
            <span style={{ opacity: .4 }}><ICONS.ExtLink /></span>
          </a>
        ))}

        <div style={{ flex: 1 }} />

        {/* Diagnostic CTA */}
        <div style={{ padding: '0 16px 22px', flexShrink: 0 }}>
          <div style={{ border: `1px solid rgba(26,127,55,0.25)`, padding: '18px', background: 'rgba(26,127,55,0.04)' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: SB.accent, marginBottom: 8 }}>Free Fulfilment Diagnostic</div>
            <div style={{ fontSize: '12px', color: SB.muted, lineHeight: 1.75, marginBottom: 14 }}>45 questions. 8 minutes.<br />Your operating pattern + breakdown.</div>
            <a href={hrefFor('diagnostic')}
              onMouseEnter={e => { e.currentTarget.style.background = SB.accent; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SB.accent; }}
              style={{ display: 'block', textAlign: 'center', width: '100%', padding: '10px 0', fontFamily: 'inherit', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${SB.accent}`, color: SB.accent, cursor: 'pointer', textDecoration: 'none', transition: 'background .15s, color .15s' }}>
              Start assessment →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar });
