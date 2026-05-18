const {
  useState,
  useEffect,
  useRef
} = React;
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
function navigate(id) {
  window.location.href = URL_MAP[id] || '/';
}
function BlogIndex() {
  const [posts, setPosts] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef(null);
  useEffect(() => {
    fetch('/blog/posts.json').then(r => r.json()).then(setPosts).catch(() => setPosts([]));
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "sidebar"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: "blog",
    setPage: navigate,
    open: sidebarOpen,
    setOpen: setSidebarOpen
  })), /*#__PURE__*/React.createElement("div", {
    id: "main-scroll",
    ref: mainRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "blog-page"
  }, /*#__PURE__*/React.createElement("p", {
    className: "section-label"
  }, "Recent posts"), posts === null && /*#__PURE__*/React.createElement("p", {
    className: "loading"
  }, "Loading\u2026"), posts !== null && posts.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "loading"
  }, "No posts yet."), posts && posts.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "post-list"
  }, posts.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.slug,
    className: "post-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "post-title"
  }, /*#__PURE__*/React.createElement("a", {
    href: `/blog/${p.slug}/`
  }, p.title)), p.description && /*#__PURE__*/React.createElement("p", {
    className: "post-desc"
  }, p.description), /*#__PURE__*/React.createElement("div", {
    className: "post-meta"
  }, /*#__PURE__*/React.createElement("span", null, p.date), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .4
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Aggelos Mouzakitis"))))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(BlogIndex, null));
