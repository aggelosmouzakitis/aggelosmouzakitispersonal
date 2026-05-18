const {
  useState,
  useEffect,
  useRef
} = React;
const SPECIALTY_IDS = ['therapy-for-executives', 'therapy-for-founders', 'imposter-syndrome-therapy', 'executive-burnout-therapy', 'career-transition-therapy'];
const URL_MAP = {
  'home': '/',
  'diagnostic': '/burnout-diagnostic/',
  'blog': '/blog/',
  'therapy-for-executives': '/therapy-for-executives/',
  'therapy-for-founders': '/therapy-for-founders/',
  'imposter-syndrome-therapy': '/imposter-syndrome-therapy/',
  'executive-burnout-therapy': '/executive-burnout-therapy/',
  'career-transition-therapy': '/career-transition-therapy/',
  'ask-me-anything': '/ask-me-anything/'
};
function App() {
  const [page, setPage] = useState(window.__INITIAL_PAGE__ || 'home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef(null);
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [page]);
  function navigate(id) {
    window.location.href = URL_MAP[id] || '/';
  }
  function renderPage() {
    if (page === 'home') return /*#__PURE__*/React.createElement(HomePage, {
      setPage: navigate
    });
    if (SPECIALTY_IDS.includes(page)) return /*#__PURE__*/React.createElement(SpecialtyPage, {
      pageId: page
    });
    if (page === 'diagnostic') return /*#__PURE__*/React.createElement(DiagnosticPage, null);
    return /*#__PURE__*/React.createElement(HomePage, {
      setPage: navigate
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "sidebar"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: page,
    setPage: navigate,
    open: sidebarOpen,
    setOpen: setSidebarOpen
  })), /*#__PURE__*/React.createElement("div", {
    id: "main-scroll",
    ref: mainRef
  }, renderPage()));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
