const { useState, useEffect, useRef } = React;

const URL_MAP = {
  'home': '/', 'diagnostic': '/burnout-diagnostic/', 'blog': '/blog/',
  'therapy-for-executives': '/therapy-for-executives/',
  'therapy-for-founders': '/therapy-for-founders/',
  'imposter-syndrome-therapy': '/imposter-syndrome-therapy/',
  'executive-burnout-therapy': '/executive-burnout-therapy/',
  'career-transition-therapy': '/career-transition-therapy/',
  'ask-me-anything': '/ask-me-anything/',
};

function navigate(id) {
  window.location.href = URL_MAP[id] || '/';
}

function BlogIndex() {
  const [posts, setPosts] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainRef = useRef(null);

  useEffect(() => {
    fetch('/blog/posts.json')
      .then(r => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  return (
    <React.Fragment>
      <div id="sidebar">
        <Sidebar page="blog" setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      <div id="main-scroll" ref={mainRef}>
        <div className="blog-page">
          <p className="section-label">Recent posts</p>
          {posts === null && <p className="loading">Loading…</p>}
          {posts !== null && posts.length === 0 && <p className="loading">No posts yet.</p>}
          {posts && posts.length > 0 && (
            <ul className="post-list">
              {posts.map(p => (
                <li key={p.slug} className="post-item">
                  <h2 className="post-title">
                    <a href={`/blog/${p.slug}/`}>{p.title}</a>
                  </h2>
                  {p.description && <p className="post-desc">{p.description}</p>}
                  <div className="post-meta">
                    <span>{p.date}</span>
                    <span style={{opacity: .4}}>·</span>
                    <span>Aggelos Mouzakitis</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BlogIndex />);
