const {
  useState,
  useRef
} = React;
const EMAILJS_PUBLIC_KEY = 'bfBcHLXj2nKaev_lT';
const EMAILJS_SERVICE_ID = 'service_i4xq7vg';
const EMAILJS_TEMPLATE_ID = 'template_6mv5hou';
const URL_MAP = {
  'home': '/',
  'diagnostic': '/burnout-diagnostic/',
  'blog': '/blog/',
  'ask-me-anything': '/ask-me-anything/',
  'therapy-for-executives': '/therapy-for-executives/',
  'therapy-for-founders': '/therapy-for-founders/',
  'imposter-syndrome-therapy': '/imposter-syndrome-therapy/',
  'executive-burnout-therapy': '/executive-burnout-therapy/',
  'career-transition-therapy': '/career-transition-therapy/'
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
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: name.trim() || 'Anonymous',
      from_email: email.trim() || 'Not provided',
      message: message.trim()
    }, EMAILJS_PUBLIC_KEY).then(() => {
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
  return /*#__PURE__*/React.createElement("form", {
    className: "ama-form",
    onSubmit: handleSubmit,
    noValidate: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "ama-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ama-label",
    htmlFor: "ama-name"
  }, "Name ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#bbb'
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("input", {
    id: "ama-name",
    className: "ama-input",
    type: "text",
    placeholder: "Or leave blank to stay anonymous",
    value: name,
    onChange: e => setName(e.target.value),
    autoComplete: "off"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ama-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ama-label",
    htmlFor: "ama-email"
  }, "Email ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#bbb'
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("input", {
    id: "ama-email",
    className: "ama-input",
    type: "email",
    placeholder: "Only if you want a direct reply",
    value: email,
    onChange: e => setEmail(e.target.value),
    autoComplete: "off"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ama-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "ama-label",
    htmlFor: "ama-message"
  }, "Your question ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#c0392b'
    }
  }, "*")), /*#__PURE__*/React.createElement("textarea", {
    id: "ama-message",
    className: "ama-textarea",
    placeholder: "What's been on your mind?",
    value: message,
    onChange: e => setMessage(e.target.value),
    required: true
  })), /*#__PURE__*/React.createElement("button", {
    className: "ama-submit",
    type: "submit",
    disabled: sending || !message.trim()
  }, sending ? 'Sending…' : 'Send question →'), status === 'sent' && /*#__PURE__*/React.createElement("p", {
    className: "ama-status success"
  }, "Got it. I'll consider it for a future video."), status === 'error' && /*#__PURE__*/React.createElement("p", {
    className: "ama-status error"
  }, "Something went wrong. Try again or email me directly."));
}
function AMAPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "sidebar"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    page: "ask-me-anything",
    setPage: navigate,
    open: sidebarOpen,
    setOpen: setSidebarOpen
  })), /*#__PURE__*/React.createElement("div", {
    id: "main-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ama-page"
  }, /*#__PURE__*/React.createElement("p", {
    className: "ama-eyebrow"
  }, "Ask anything"), /*#__PURE__*/React.createElement("h1", {
    className: "ama-title"
  }, "Got a question?", /*#__PURE__*/React.createElement("br", null), "I'll answer it on video. Anonymously!"), /*#__PURE__*/React.createElement("p", {
    className: "ama-intro"
  }, "Something about burnout, performance identity, imposter syndrome, the cost of high achievement or basically anything that concerns you \u2014 ask it here. I go through submissions and turn the ones that resonate into videos. Your question might be the one that helps someone else finally put words to what they've been carrying."), /*#__PURE__*/React.createElement("div", {
    className: "ama-anon-note"
  }, "All submissions are anonymous by default. Name and email are optional \u2014 you can ask without revealing who you are. If you include your email, I'll only use it to reply directly and nothing else."), /*#__PURE__*/React.createElement("div", {
    className: "ama-columns"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "ama-col-label"
  }, "Leave a voice message"), /*#__PURE__*/React.createElement("div", {
    className: "ama-speakpipe-wrap"
  }, /*#__PURE__*/React.createElement("iframe", {
    src: "https://www.speakpipe.com/widget/inline/zeofbff8ulskjge5zesmtgqxwqkmjvo3",
    allow: "microphone",
    width: "100%",
    height: "200",
    frameBorder: "0",
    title: "Leave a voice message"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "ama-col-label"
  }, "Send a written question"), /*#__PURE__*/React.createElement(AMAForm, null))), /*#__PURE__*/React.createElement("div", {
    className: "ama-how"
  }, /*#__PURE__*/React.createElement("p", {
    className: "ama-how-title"
  }, "How it works"), /*#__PURE__*/React.createElement("div", {
    className: "ama-steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ama-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ama-step-num"
  }, "01"), /*#__PURE__*/React.createElement("span", null, "Ask anything \u2014 burnout, identity, performance anxiety, career crossroads, whatever's been stuck in your head. Voice or text, your choice.")), /*#__PURE__*/React.createElement("div", {
    className: "ama-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ama-step-num"
  }, "02"), /*#__PURE__*/React.createElement("span", null, "I read and listen to every submission. The ones that hit something real become the basis for a video.")), /*#__PURE__*/React.createElement("div", {
    className: "ama-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ama-step-num"
  }, "03"), /*#__PURE__*/React.createElement("span", null, "Answers go on ", /*#__PURE__*/React.createElement("a", {
    href: "https://youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA",
    target: "_blank",
    rel: "noopener",
    style: {
      color: '#00bf63',
      textUnderlineOffset: '3px',
      textDecorationThickness: '1px'
    }
  }, "YouTube"), ". Subscribe if you don't want to miss them.")))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AMAPage, null));
