const { useState, useRef } = React;

const EMAILJS_PUBLIC_KEY = 'bfBcHLXj2nKaev_lT';
const EMAILJS_SERVICE_ID = 'service_i4xq7vg';
const EMAILJS_TEMPLATE_ID = 'template_6mv5hou';

const URL_MAP = {
  'home': '/', 'diagnostic': '/burnout-diagnostic/', 'blog': '/blog/',
  'ask-me-anything': '/ask-me-anything/',
  'therapy-for-executives': '/therapy-for-executives/',
  'therapy-for-founders': '/therapy-for-founders/',
  'imposter-syndrome-therapy': '/imposter-syndrome-therapy/',
  'executive-burnout-therapy': '/executive-burnout-therapy/',
  'career-transition-therapy': '/career-transition-therapy/',
};

function navigate(id) {
  window.location.href = URL_MAP[id] || '/';
}

function AMAForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setStatus(null);

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: name.trim() || 'Anonymous',
        from_email: email.trim() || 'Not provided',
        message: message.trim(),
      },
      EMAILJS_PUBLIC_KEY
    ).then(() => {
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    }).catch(() => {
      setStatus('error');
    }).finally(() => {
      setSending(false);
    });
  }

  return (
    <form className="ama-form" onSubmit={handleSubmit} noValidate>
      <div className="ama-field">
        <label className="ama-label" htmlFor="ama-name">Name <span style={{color:'#bbb'}}>(optional)</span></label>
        <input
          id="ama-name"
          className="ama-input"
          type="text"
          placeholder="Or leave blank to stay anonymous"
          value={name}
          onChange={e => setName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="ama-field">
        <label className="ama-label" htmlFor="ama-email">Email <span style={{color:'#bbb'}}>(optional)</span></label>
        <input
          id="ama-email"
          className="ama-input"
          type="email"
          placeholder="Only if you want a direct reply"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="ama-field">
        <label className="ama-label" htmlFor="ama-message">Your question <span style={{color:'#c0392b'}}>*</span></label>
        <textarea
          id="ama-message"
          className="ama-textarea"
          placeholder="What's been on your mind?"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      <button className="ama-submit" type="submit" disabled={sending || !message.trim()}>
        {sending ? 'Sending…' : 'Send question →'}
      </button>
      {status === 'sent' && (
        <p className="ama-status success">Got it. I'll consider it for a future video.</p>
      )}
      {status === 'error' && (
        <p className="ama-status error">Something went wrong. Try again or email me directly.</p>
      )}
    </form>
  );
}

function AMAPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <React.Fragment>
      <div id="sidebar">
        <Sidebar page="ask-me-anything" setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>
      <div id="main-scroll">
        <div className="ama-page">
          <p className="ama-eyebrow">Ask anything</p>
          <h1 className="ama-title">Got a question?<br />I'll answer it on video. Anonymously!</h1>
          <p className="ama-intro">
            Something about burnout, performance identity, imposter syndrome, the cost of high achievement or basically anything that concerns you — ask it here.
            I go through submissions and turn the ones that resonate into videos. Your question might be the one that helps someone else finally put words to what they've been carrying.
          </p>
          <div className="ama-anon-note">
            All submissions are anonymous by default. Name and email are optional — you can ask without revealing who you are.
            If you include your email, I'll only use it to reply directly and nothing else.
          </div>

          <div className="ama-columns">
            <div>
              <p className="ama-col-label">Leave a voice message</p>
              <div className="ama-speakpipe-wrap">
                <iframe
                  src="https://www.speakpipe.com/widget/inline/zeofbff8ulskjge5zesmtgqxwqkmjvo3"
                  allow="microphone"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  title="Leave a voice message"
                />
              </div>
            </div>
            <div>
              <p className="ama-col-label">Send a written question</p>
              <AMAForm />
            </div>
          </div>

          <div className="ama-how">
            <p className="ama-how-title">How it works</p>
            <div className="ama-steps">
              <div className="ama-step">
                <span className="ama-step-num">01</span>
                <span>Ask anything — burnout, identity, performance anxiety, career crossroads, whatever's been stuck in your head. Voice or text, your choice.</span>
              </div>
              <div className="ama-step">
                <span className="ama-step-num">02</span>
                <span>I read and listen to every submission. The ones that hit something real become the basis for a video.</span>
              </div>
              <div className="ama-step">
                <span className="ama-step-num">03</span>
                <span>Answers go on <a href="https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA" target="_blank" rel="noopener" style={{color:'#00bf63',textUnderlineOffset:'3px',textDecorationThickness:'1px'}}>YouTube</a>. Subscribe if you don't want to miss them.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AMAPage />);
