const { useState, useEffect, useRef } = React;
const SPECIALTY_IDS = ['therapy-for-executives','therapy-for-founders','imposter-syndrome-therapy','executive-burnout-therapy','career-transition-therapy'];
const URL_MAP = {
  'home': '/', 'diagnostic': '/burnout-diagnostic/', 'blog': '/blog/',
  'therapy-for-executives': '/therapy-for-executives/',
  'therapy-for-founders': '/therapy-for-founders/',
  'imposter-syndrome-therapy': '/imposter-syndrome-therapy/',
  'executive-burnout-therapy': '/executive-burnout-therapy/',
  'career-transition-therapy': '/career-transition-therapy/',
  'ask-me-anything': '/ask-me-anything/',
};

function App() {
  const [page, setPage] = useState(window.__INITIAL_PAGE__ || 'home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef(null);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [page]);

  function navigate(id) { window.location.href = URL_MAP[id] || '/'; }

  function renderPage() {
    if (page === 'home') return <HomePage setPage={navigate} />;
    if (SPECIALTY_IDS.includes(page)) return <SpecialtyPage pageId={page} />;
    if (page === 'diagnostic') return <DiagnosticPage />;
    return <HomePage setPage={navigate} />;
  }

  return (
    <React.Fragment>
      <div id="sidebar">
        <Sidebar page={page} setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      <div id="main-scroll" ref={mainRef}>{renderPage()}</div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
