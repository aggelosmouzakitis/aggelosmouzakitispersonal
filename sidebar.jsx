// sidebar.jsx — desktop sidebar + mobile bottom nav with bottom sheet

const SB = {
  bg: '#1A1918',
  border: 'rgba(255,255,255,0.08)',
  muted: '#555',
  text: 'rgba(255,255,255,0.6)',
  active: '#ffffff',
  accent: '#00bf63',
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
  Briefcase: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
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
  ChevDown: ({ isOpen }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .18s', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const SPECIALTIES = [
  { id: 'therapy-for-executives', label: 'Therapy for Executives' },
  { id: 'therapy-for-founders', label: 'Therapy for Founders' },
  { id: 'imposter-syndrome-therapy', label: 'Imposter Syndrome Coaching' },
  { id: 'executive-burnout-therapy', label: 'Burnout Coaching' },
  { id: 'career-transition-therapy', label: 'Career Transition Coaching' },
];

const SOCIALS = [
  { id: 'li', label: 'LinkedIn', href: 'https://linkedin.com/in/growth-product-manager/', Icon: ICONS.LinkedIn },
  { id: 'yt', label: 'YouTube', href: 'https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA', Icon: ICONS.YouTube },
];

// ── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileNav({ page, setPage }) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const isSpecialty = SPECIALTIES.some(s => s.id === page);

  const tabStyle = (active) => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 4, padding: '8px 4px',
    background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#00bf63' : 'rgba(255,255,255,0.5)',
    fontFamily: 'inherit', fontSize: '9px', letterSpacing: '.1em',
    textTransform: 'uppercase', transition: 'color .15s',
  });

  return (
    <>
      {/* Bottom sheet backdrop */}
      {sheetOpen && (
        <div onClick={() => setSheetOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 90, backdropFilter: 'blur(2px)',
        }} />
      )}

      {/* Specialties bottom sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 64,
        background: '#1A1918',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px 16px 0 0',
        zIndex: 91, padding: '0 0 8px',
        transform: sheetOpen ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform .3s cubic-bezier(.32,.72,0,1)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Specialties</span>
          <button onClick={() => setSheetOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
            <ICONS.X />
          </button>
        </div>
        {/* Specialty items */}
        {SPECIALTIES.map(s => (
          <button key={s.id} onClick={() => { setPage(s.id); setSheetOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '14px 20px',
              background: page === s.id ? 'rgba(0,191,99,0.08)' : 'none',
              border: 'none', borderLeft: page === s.id ? '2px solid #00bf63' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '14px', letterSpacing: '.05em',
              color: page === s.id ? '#00bf63' : 'rgba(255,255,255,0.8)',
              textAlign: 'left',
            }}>
            {s.label}
          </button>
        ))}
        {/* Diagnostic CTA */}
        <div style={{ margin: '12px 20px 4px', padding: '14px', border: '1px solid rgba(0,191,99,0.25)', background: 'rgba(0,191,99,0.04)' }}>
          <div style={{ fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#00bf63', marginBottom: 8 }}>Free Burnout Diagnostic</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>45 questions. Score + section breakdown.</div>
          <button onClick={() => { setPage('diagnostic'); setSheetOpen(false); }}
            style={{ width: '100%', padding: '10px', fontFamily: 'inherit', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', background: 'transparent', border: '1px solid #00bf63', color: '#00bf63', cursor: 'pointer' }}>
            Start assessment →
          </button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, height: 64,
        background: '#1A1918', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'stretch', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <button style={tabStyle(page === 'home')} onClick={() => { setPage('home'); setSheetOpen(false); }}>
          <ICONS.Home /><span>Home</span>
        </button>
        <button style={tabStyle(page === 'blog')} onClick={() => { setPage('blog'); setSheetOpen(false); }}>
          <ICONS.Book /><span>Writing</span>
        </button>
        <button style={tabStyle(isSpecialty || sheetOpen)} onClick={() => setSheetOpen(v => !v)}>
          <ICONS.Briefcase /><span>Services</span>
        </button>
        {SOCIALS.map(({ id, label, href, Icon }) => (
          <a key={id} href={href} target="_blank" rel="noopener" style={{ ...tabStyle(false), textDecoration: 'none' }}>
            <Icon /><span>{label}</span>
          </a>
        ))}
        <button style={tabStyle(page === 'diagnostic')} onClick={() => { setPage('diagnostic'); setSheetOpen(false); }}>
          <ICONS.Clipboard /><span>Diagnostic</span>
        </button>
      </nav>
    </>
  );
}

// ── DESKTOP SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ page, setPage, open, setOpen }) {
  const [specialtiesOpen, setSpecialtiesOpen] = React.useState(true);
  const [hovered, setHovered] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  if (isMobile) return <MobileNav page={page} setPage={setPage} />;

  const isSpecialty = SPECIALTIES.some(s => s.id === page);

  const ToggleBtn = () => (
    <button onClick={() => setOpen(!open)} title={open ? 'Collapse' : 'Expand'}
      style={{
        position: 'absolute', left: open ? SB.W - 13 : SB.WC - 13, top: 32,
        width: 26, height: 26, borderRadius: '50%',
        background: '#ffffff', border: '1px solid rgba(200,200,200,0.3)',
        color: '#1A1918', cursor: 'pointer', zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.55)', padding: 0,
      }}>
      {open ? <ICONS.ChevLeft /> : <ICONS.ChevRight />}
    </button>
  );

  const iconBtn = (id, Icon, onClick, active, title) => (
    <button key={id} title={title} onClick={onClick}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        width: SB.WC, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(255,255,255,0.1)' : hovered === id ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: 'none', cursor: 'pointer',
        color: active ? SB.active : hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
        transition: 'background .12s, color .12s',
      }}>
      <Icon />
    </button>
  );

  const iconLink = ({ id, label, href, Icon }) => (
    <a key={id} href={href} target="_blank" rel="noopener" title={label}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        width: SB.WC, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered === id ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
        textDecoration: 'none', transition: 'background .12s, color .12s',
      }}>
      <Icon />
    </a>
  );

  const navBtn = (id, label, Icon, active, onClick, extra) => (
    <button key={id} onClick={onClick}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '9px 18px',
        background: active ? 'rgba(255,255,255,0.08)' : hovered === id ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: 'none', borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
        cursor: 'pointer', fontFamily: 'inherit',
        fontSize: '12.5px', letterSpacing: '.1em', textTransform: 'uppercase',
        color: active ? SB.active : hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
        transition: 'background .12s, color .12s',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'flex', flexShrink: 0 }}><Icon /></span>
        <span>{label}</span>
      </div>
      {extra}
    </button>
  );

  const subBtn = (id, label, active, onClick) => (
    <button key={id} onClick={onClick}
      onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
      style={{
        display: 'flex', alignItems: 'center',
        width: '100%', padding: '7px 18px 7px 50px',
        background: active ? 'rgba(255,255,255,0.06)' : hovered === id ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: 'none', borderLeft: active ? `2px solid ${SB.accent}` : '2px solid transparent',
        cursor: 'pointer', fontFamily: 'inherit',
        fontSize: '12px', letterSpacing: '.07em', textTransform: 'uppercase',
        color: active ? SB.accent : hovered === id ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)',
        transition: 'background .12s, color .12s',
      }}>
      {label}
    </button>
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
      <img src="https://aggelosmouzakitis.com/img/aggelos.jpg" alt="Aggelos Mouzakitis" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', margin: '22px 0 18px', display: 'block' }} />
      <div style={{ height: 1, background: SB.border, alignSelf: 'stretch', margin: '0 12px 4px' }} />
      {iconBtn('home', ICONS.Home, () => setPage('home'), page === 'home', 'Home')}
      {iconBtn('blog', ICONS.Book, () => setPage('blog'), page === 'blog', 'Writing')}
      {iconBtn('spec', ICONS.Briefcase, () => { setOpen(true); setSpecialtiesOpen(true); }, isSpecialty, 'Specialties')}
      {iconBtn('diag', ICONS.Clipboard, () => setPage('diagnostic'), page === 'diagnostic', 'Free Diagnostic')}
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
          <img src="https://aggelosmouzakitis.com/img/aggelos.jpg" alt="Aggelos Mouzakitis" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block' }} />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '12.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: SB.active, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Aggelos Mouzakitis</div>
            <div style={{ fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: SB.muted }}>Psychotherapist & Coach</div>
          </div>
        </div>

        {/* Home */}
        <div style={{ padding: '10px 0 0' }}>
          {navBtn('home', 'Home', ICONS.Home, page === 'home', () => setPage('home'))}
          {navBtn('blog', 'Writing', ICONS.Book, page === 'blog', () => setPage('blog'))}
        </div>

        {/* Specialties */}
        {navBtn('spec', 'Specialties', ICONS.Briefcase, isSpecialty, () => setSpecialtiesOpen(v => !v), <ICONS.ChevDown isOpen={specialtiesOpen} />)}
        {specialtiesOpen && (
          <div>{SPECIALTIES.map(s => subBtn(s.id, s.label, page === s.id, () => setPage(s.id)))}</div>
        )}

        {/* Find me */}
        {sectionLabel('Find me')}
        {SOCIALS.map(({ id, label, href, Icon }) => (
          <a key={id} href={href} target="_blank" rel="noopener"
            onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 18px', textDecoration: 'none',
              background: hovered === id ? 'rgba(255,255,255,0.04)' : 'transparent',
              color: hovered === id ? 'rgba(255,255,255,0.85)' : SB.text,
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
          <div style={{ border: `1px solid rgba(0,191,99,0.25)`, padding: '18px', background: 'rgba(0,191,99,0.04)' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: SB.accent, marginBottom: 8 }}>Free Burnout Diagnostic</div>
            <div style={{ fontSize: '12px', color: SB.muted, lineHeight: 1.75, marginBottom: 14 }}>45 questions. 8 minutes.<br />Score + section breakdown.</div>
            <button onClick={() => setPage('diagnostic')}
              onMouseEnter={e => { e.currentTarget.style.background = SB.accent; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SB.accent; }}
              style={{ width: '100%', padding: '10px 0', fontFamily: 'inherit', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${SB.accent}`, color: SB.accent, cursor: 'pointer', transition: 'background .15s, color .15s' }}>
              Start assessment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar });
