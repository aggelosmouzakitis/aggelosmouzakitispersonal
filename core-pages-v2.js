// core-pages-v2.jsx — redesigned Home / Why me (About) / Reviews.
// Loaded after site-chrome.js, before content-pages.js. Presentational only.
//   Home copy: ported verbatim from the approved Homepage.dc.html mockup (HOME_V2).
//   About/Reviews copy: the real production ABOUT / REVIEWS / REVIEWS_ITEMS, passed
//   in via the `copy` prop by CoreApp — never placeholders.
// Exposes on window: HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS.

const V2 = window.SITE;
const v2Ext = {
  target: '_blank',
  rel: 'noopener noreferrer'
};
const arr = x => Array.isArray(x) ? x : [];

// ─── Homepage copy — verbatim from Homepage.dc.html (mockup content object) ────
const HOME_V2 = {
  en: {
    eyebrow: 'BUSINESS & CAREER ADVISOR · BACP-REGISTERED PSYCHOTHERAPIST',
    intro: 'Hi, I’m Aggelos.',
    h1pre: 'Practical help for the business, the career and ',
    h1human: 'the person',
    h1post: ' behind them.',
    support: 'For people who are good at what they do and have reached something that more work alone won’t fix.',
    mLabel: 'THE WHOLE POINT',
    mMuted: 'You know your work.',
    mGreenPre: 'Now let’s make your career or business ',
    mMark: 'work for you.',
    splitIntro: 'You won’t have to choose between practical advice and psychological depth.',
    leftH: 'WHAT WE CHANGE',
    leftP: 'We can work on the offer, marketing, career move, client mix or the way the business runs.',
    rightH: 'WHAT GETS IN THE WAY',
    rightP: 'If fear, shame, avoidance or pressure at home is shaping what you do, we work there too.',
    opinionL1: 'YOU WILL GET',
    opinionL2: 'AN OPINION.',
    opinionParas: ['I ask enough questions to understand the situation, then tell you what I think.', 'If I see a practical move, I suggest it. If your story does not add up, I say so.', 'You can tell me the part you normally edit out. I will not think less of you. I will not let you bullshit yourself either.'],
    opinionQuote: '“I left with more than advice. I left understanding what the problem actually was.”',
    contNum: '03',
    contLabel: '/ IF WE CONTINUE',
    contH: 'We agree on one concrete outcome and how long we will work towards it.',
    contP: 'We meet weekly or every other week, and you have WhatsApp access between sessions.',
    mediaIntro: 'Want to see how I think?',
    readP: 'Essays about work, ambition, psychology and where they overlap.',
    watchP: 'Short videos, longer conversations and the occasional useful rant.',
    finalH: 'IF WORKING HARDER WAS GOING TO FIX THIS, IT PROBABLY WOULD HAVE BY NOW.',
    contAlt: 'Aggelos Mouzakitis'
  },
  el: {
    eyebrow: 'ΣΥΜΒΟΥΛΟΣ ΕΠΙΧΕΙΡΗΣΕΩΝ & ΚΑΡΙΕΡΑΣ · ΣΥΜΒΟΥΛΟΣ ΨΥΧΙΚΗΣ ΥΓΕΙΑΣ',
    intro: 'Γεια, είμαι ο Άγγελος.',
    h1pre: 'Πρακτική βοήθεια για την επιχείρηση, την καριέρα και ',
    h1human: 'τον άνθρωπο',
    h1post: ' πίσω από όλα αυτά.',
    support: 'Για ανθρώπους που είναι καλοί σε αυτό που κάνουν και έχουν φτάσει σε κάτι που δεν λύνεται μόνο με περισσότερη δουλειά.',
    mLabel: 'ΤΟ ΖΗΤΟΥΜΕΝΟ',
    mMuted: 'Ξέρεις καλά τη δουλειά σου.',
    mGreenPre: 'Πάμε να κάνουμε την καριέρα ή την επιχείρησή σου ',
    mMark: 'να δουλεύει για σένα.',
    splitIntro: 'Δεν χρειάζεται να διαλέξεις αν το θέμα είναι επαγγελματικό ή προσωπικό.',
    leftH: 'ΤΙ ΑΛΛΑΖΟΥΜΕ',
    leftP: 'Μπορούμε να δουλέψουμε το offer, το marketing, την επόμενη κίνηση στην καριέρα σου, τους πελάτες ή τον τρόπο που λειτουργεί η επιχείρησή σου.',
    rightH: 'ΤΙ ΜΠΑΙΝΕΙ ΣΤΗ ΜΕΣΗ',
    rightP: 'Αν ο φόβος, η ντροπή, η αποφυγή ή η πίεση στο σπίτι επηρεάζουν τη δουλειά και τις αποφάσεις σου, πιάνουμε και αυτό το κομμάτι.',
    opinionL1: 'ΘΑ ΣΟΥ ΠΩ',
    opinionL2: 'ΤΗ ΓΝΩΜΗ ΜΟΥ.',
    opinionParas: ['Θα κάνω όσες ερωτήσεις χρειαστούν για να καταλάβω τι συμβαίνει. Μετά θα σου πω πώς το βλέπω.', 'Αν βλέπω κάτι συγκεκριμένο που μπορείς να κάνεις, θα στο προτείνω. Αν αυτά που μου λες δεν στέκουν, θα σου το πω.', 'Μπορείς να μου πεις και αυτό που συνήθως αφήνεις απ’ έξω. Δεν θα σε δω διαφορετικά. Δεν θα σε αφήσω όμως να λες μαλακίες στον εαυτό σου.'],
    opinionQuote: '«Έφυγα με κάτι περισσότερο από συμβουλές. Έφυγα έχοντας καταλάβει ποιο ήταν πραγματικά το πρόβλημα.»',
    contNum: '03',
    contLabel: '/ ΑΝ ΣΥΝΕΧΙΣΟΥΜΕ',
    contH: 'Συμφωνούμε τι ακριβώς θέλεις να πετύχεις και για πόσο θα δουλέψουμε πάνω σε αυτό.',
    contP: 'Μιλάμε κάθε εβδομάδα και μπορείς να μου γράφεις στο WhatsApp ανάμεσα στις συναντήσεις.',
    mediaIntro: 'Θέλεις να δεις πώς σκέφτομαι;',
    readP: 'Κείμενα για τη δουλειά, τη φιλοδοξία, την ψυχολογία και εκεί που μπλέκονται.',
    watchP: 'Μικρά βίντεο, μεγαλύτερες συζητήσεις και πού και πού κάποιο χρήσιμο rant.',
    finalH: 'ΑΝ ΛΥΝΟΤΑΝ ΜΕ ΠΕΡΙΣΣΟΤΕΡΗ ΔΟΥΛΕΙΑ, ΜΑΛΛΟΝ ΘΑ ΕΙΧΕ ΛΥΘΕΙ ΗΔΗ.',
    contAlt: 'Άγγελος Μουζακίτης'
  }
};

// ─── Page-section CSS ────────────────────────────────────────────────────────
const PAGE_V2_CSS = `
/* ── Home hero — copy left, circular photograph right (approved visual pass) ── */
.home-hero{background:${V2.paper};color:${V2.heroInk}}
.home-hero__grid{max-width:1280px;margin-inline:auto;min-height:444px;display:grid;grid-template-columns:minmax(0,1.14fr) minmax(260px,0.86fr);align-items:center;gap:clamp(34px,4vw,64px);padding:clamp(48px,5vw,72px) clamp(24px,5vw,72px)}
.home-hero__copy{min-width:0;color:${V2.heroInk}}
.home-hero__eyebrow{max-width:520px;color:${V2.green};font-family:${V2.display};font-size:12px;font-weight:700;line-height:1.35;letter-spacing:0.055em;text-transform:uppercase}
.home-hero__intro{margin:14px 0 15px;color:${V2.heroInk};font-family:${V2.display};font-size:16px;font-weight:400;line-height:1.3}
.home-hero__title{max-width:600px;margin:0 0 22px;font-family:"Archivo Black",${V2.display};font-weight:400;line-height:0.94;letter-spacing:-0.065em;color:${V2.heroInk}}
html[lang="en"] .home-hero__title{font-size:clamp(48px,5vw,72px)}
html[lang="el"] .home-hero__title{font-size:clamp(40px,4vw,58px)}
.home-hero__title .human{position:relative;z-index:0;white-space:nowrap}
.home-hero__title .human::after{content:"";position:absolute;z-index:-1;left:-0.03em;right:-0.03em;bottom:0.04em;height:0.16em;background:${V2.green}}
.home-hero__support{max-width:505px;margin:0 0 25px;color:${V2.heroInk};font-family:${V2.display};font-size:17px;font-weight:400;line-height:1.48}
.home-hero__photo{position:relative;width:min(100%,clamp(300px,30vw,430px));aspect-ratio:1;justify-self:center}
.home-hero__photo::before{content:"";position:absolute;inset:8% -3% -2% 9%;border-radius:50%;background:${V2.green}}
.home-hero__frame{position:absolute;inset:0;overflow:hidden;border-radius:50%}
.home-hero__frame img{width:100%;height:100%;object-fit:cover;object-position:56% 44%;transform:scale(1.58);filter:grayscale(1) contrast(1.08)}
@media (max-width:680px){
  .home-hero__grid{grid-template-columns:1fr;gap:34px;padding:38px 20px 44px;min-height:0}
  html[lang="en"] .home-hero__title{font-size:clamp(42px,12vw,58px)}
  html[lang="el"] .home-hero__title{font-size:clamp(36px,10vw,50px)}
  .home-hero__photo{width:min(78%,300px);justify-self:start}
}

/* ── Manifesto — "The whole point" (full-width dark) ── */
.home-manifesto{width:100%;background:${V2.ink}}
.home-manifesto__inner{max-width:1280px;margin-inline:auto;padding:clamp(48px,5vw,68px) clamp(24px,5vw,72px)}
.home-manifesto__label{margin-bottom:17px;color:${V2.green};font-family:${V2.display};font-size:12px;font-weight:700;line-height:1;letter-spacing:0.10em;text-transform:uppercase}
.home-manifesto__copy{font-family:"Archivo Black",${V2.display};font-size:clamp(36px,4.8vw,68px);font-weight:400;line-height:1.04;letter-spacing:-0.055em}
.home-manifesto__muted,.home-manifesto__green{display:block}
.home-manifesto__muted{color:${V2.greyOnDark}}
.home-manifesto__green{color:${V2.green}}
.home-manifesto__copy mark{padding:0 0.08em 0.02em;background:${V2.paper};color:${V2.ink};box-decoration-break:clone;-webkit-box-decoration-break:clone}
@media (max-width:680px){.home-manifesto__inner{padding:40px 20px 46px}.home-manifesto__copy{font-size:clamp(34px,10vw,48px)}}

/* ── Home dark canvas sections ── */
.home-flow{display:flex;flex-direction:column;gap:clamp(64px,8vw,96px);padding-block:clamp(64px,8vw,96px)}
.sec__n{font-family:${V2.display};font-size:clamp(21px,2.2vw,26px);font-weight:800;line-height:1;letter-spacing:-0.03em;color:${V2.green}}
.sec__h{margin:22px 0 48px;max-width:19ch;font-family:${V2.display};font-size:clamp(44px,4.8vw,68px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#fff;text-wrap:balance}
.sec__h2l{margin:22px 0 48px;font-family:${V2.display};font-size:clamp(58px,6.4vw,92px);font-weight:800;line-height:0.94;letter-spacing:-0.045em;color:#fff}
.sec__h2l span{display:block}
.cont-marker{display:flex;align-items:baseline;gap:10px}
.cont-marker .n{font-family:${V2.display};font-size:clamp(21px,2.2vw,26px);font-weight:800;line-height:1;letter-spacing:-0.03em;color:${V2.green}}
.cont-marker .lbl{font-family:${V2.display};font-size:12px;font-weight:700;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:${V2.green}}

.split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:1fr;gap:24px;align-items:stretch}
.split__cell{height:100%;min-height:360px;padding:clamp(32px,4.5vw,56px);border-radius:12px;display:grid;grid-template-rows:auto 1fr;align-content:start;gap:24px}
.split__cell h3{margin:0;font-family:${V2.display};font-weight:800;line-height:0.98;letter-spacing:-0.035em;text-wrap:balance;white-space:nowrap}
html[lang="en"] .split__cell h3{font-size:clamp(34px,3.2vw,44px)}
html[lang="el"] .split__cell h3{font-size:clamp(24px,2.4vw,34px)}
.split__cell p{margin:0;font-size:18px;line-height:1.55;max-width:40ch;text-wrap:pretty}
.split--paper{background:${V2.paper};color:${V2.ink}}
.split--black{background:${V2.black};color:#fff}

.opinion{display:grid;grid-template-columns:0.85fr 1.15fr;background:${V2.paper};border-radius:12px;overflow:hidden}
.opinion img{display:block;width:100%;height:100%;min-height:520px;object-fit:cover;object-position:42% 50%}
.opinion__body{padding:clamp(32px,4.5vw,56px);min-width:0;display:grid;align-content:start;gap:24px}
.opinion__body p{margin:0;font-size:18px;line-height:1.55;color:${V2.ink2};max-width:52ch;text-wrap:pretty}
.opinion__q{margin:8px 0 0;border-top:2px solid ${V2.green};padding-top:24px;font-family:${V2.display};font-weight:750;font-size:clamp(28px,2.5vw,38px);line-height:1.2;letter-spacing:-0.035em;color:${V2.ink};max-width:32ch;text-wrap:pretty}

.cont{min-height:440px;background:${V2.paper};border-radius:12px;padding:clamp(32px,5vw,72px);display:flex;align-items:center}
.cont__in{max-width:760px}
.cont__h{margin:16px 0 0;max-width:20ch;font-family:${V2.display};font-size:clamp(40px,4.2vw,58px);font-weight:760;line-height:1.02;letter-spacing:-0.04em;color:${V2.ink};text-wrap:pretty}
.cont p{margin:24px 0 0;font-size:18px;line-height:1.55;color:${V2.ink2};max-width:52ch;text-wrap:pretty}

.rule-arrow{display:flex;align-items:center;gap:10px;width:min(320px,60%);margin:0 0 48px}
.rule-arrow div{flex:1;height:2px;background:${V2.green}}
.rule-arrow span{color:${V2.green};line-height:1;font-size:18px}
.media{display:grid;grid-template-columns:7fr 5fr;grid-template-rows:repeat(2,minmax(0,1fr));min-height:520px;border-radius:12px;overflow:hidden}
.media__cell{padding:clamp(32px,3.5vw,56px);display:flex;flex-direction:column;justify-content:space-between;gap:32px;min-width:0;transition:background .18s,filter .18s}
.media__cell h3{margin:0;font-family:${V2.display};font-weight:800;line-height:0.9;letter-spacing:-0.045em}
.media__top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}
.media__arw{font-size:38px;line-height:1;transition:transform .18s}
.media__cell:hover .media__arw{transform:translate(5px,-5px)}
.media__kicker{font-size:14px;font-weight:700;letter-spacing:0.12em;margin-bottom:16px}
.media__cell p{margin:0;font-size:18px;line-height:1.55;max-width:36ch;text-wrap:pretty}
.media__read{grid-row:1 / span 2;background:${V2.green};color:#fff}
.media__read:hover{filter:brightness(0.9)}
.media__read h3{font-size:clamp(64px,6vw,92px)}
.media__watch{background:${V2.black};color:#fff}
.media__watch:hover{background:#0e0e0e}
.media__watch h3{font-size:clamp(44px,4vw,64px)}
.media__watch p{font-size:17px;line-height:1.5;max-width:34ch}
.media__follow{background:${V2.paper};color:${V2.ink}}
.media__follow h3{font-size:clamp(44px,4vw,64px)}
.icon-row{display:flex;align-items:center;gap:16px}
.icon-btn{width:48px;height:48px;border-radius:50%;background:${V2.ink};color:#fff;display:flex;align-items:center;justify-content:center;transition:background .18s,transform .18s}
.icon-btn:hover{background:${V2.green};transform:translateY(-3px)}
@media (max-width:960px){
  .media{grid-template-columns:1fr;grid-template-rows:auto;min-height:0}
  .media__read{grid-row:auto}.media__cell{min-height:320px}
  .opinion{grid-template-columns:1fr}.opinion img{min-height:320px}
}
@media (max-width:1140px){.split{grid-template-columns:1fr;grid-auto-rows:auto}.split__cell{min-height:0}}
@media (max-width:520px){.split__cell h3,html[lang="el"] .split__cell h3{white-space:normal}}

/* ── Why me ── */
.why-hero{background:${V2.paper};padding-block:80px 72px}
.why-hero__grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(360px,0.85fr);gap:64px;align-items:center}
.why-hero__over{font-size:13px;font-weight:700;letter-spacing:0.12em;color:${V2.green}}
.why-hero h1{margin:16px 0 0;max-width:15ch;font-family:${V2.display};font-size:clamp(44px,4.6vw,64px);font-weight:780;line-height:0.98;letter-spacing:-0.045em;color:${V2.ink};text-wrap:balance}
.why-hero__intro{margin:24px 0 0;max-width:56ch;font-size:19px;line-height:1.7;color:${V2.ink2}}
.why-hero__creds{margin-top:20px;font-size:15px;line-height:1.6;color:${V2.meta}}
.why-hero img{display:block;width:100%;height:auto;aspect-ratio:4 / 5;object-fit:cover;object-position:50% 38%;border-radius:12px}
.cred-row{display:grid;grid-template-columns:64px minmax(200px,0.7fr) 1.3fr;gap:32px;padding:28px 0;border-top:1px solid ${V2.rule};align-items:start}
.cred-row:last-of-type{border-bottom:1px solid ${V2.rule}}
.cred-row .n{font-family:${V2.display};font-size:19px;font-weight:800;color:${V2.green}}
.cred-row h3{margin:0;font-family:${V2.display};font-size:22px;font-weight:800;line-height:1.1;letter-spacing:-0.03em;color:${V2.ink}}
.cred-row p{margin:0;font-size:17px;line-height:1.6;color:${V2.ink2}}
@media (max-width:900px){.why-hero{padding-block:56px 48px}.why-hero__grid{grid-template-columns:1fr;gap:36px}}
@media (max-width:700px){.cred-row{grid-template-columns:1fr;gap:10px}.why-hero h1{font-size:clamp(40px,10vw,52px)}}

/* ── Reviews (no giant opening testimonial) ── */
.rev-hero{background:${V2.paper};padding-block:80px 56px}
.rev-hero__grid{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);gap:64px;align-items:start}
.rev-hero h1{margin:0;font-family:${V2.display};font-size:clamp(44px,4.6vw,64px);font-weight:780;line-height:0.98;letter-spacing:-0.045em;color:${V2.ink}}
.rev-hero__lead{margin:0 0 14px;font-size:20px;line-height:1.6;color:${V2.ink2};max-width:60ch}
.rev-hero__note{font-size:15px;line-height:1.6;color:${V2.meta}}
.rev-lead{max-width:900px;margin:56px 0 0;padding-top:28px;border-top:4px solid ${V2.green}}
.rev-lead p{margin:0;font-family:${V2.display};font-size:clamp(24px,2.3vw,28px);font-weight:600;line-height:1.46;letter-spacing:-0.01em;color:${V2.ink};text-wrap:pretty}
.rev-lead .who{margin-top:22px;font-size:14px;color:${V2.meta}}
.rev-lead button,.rev-item button{margin-top:16px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;color:${V2.green}}
.rev-lead .orig,.rev-item .orig{margin-top:16px;padding-top:16px;border-top:1px solid ${V2.rule};font-size:16px;line-height:1.7;color:${V2.meta};font-style:italic}
.rev-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:64px}
.rev-item{border-top:1px solid ${V2.rule};padding:36px 0 44px;min-width:0}
.rev-item p{margin:0;font-size:19px;line-height:1.72;color:${V2.ink}}
.rev-item .who{margin-top:22px;font-size:14px;color:${V2.meta}}
@media (max-width:900px){.rev-hero{padding-block:56px 48px}.rev-hero__grid{grid-template-columns:1fr;gap:28px}}
@media (max-width:800px){.rev-grid{grid-template-columns:1fr}.rev-lead p{font-size:24px}}
`;
function PageV2Styles() {
  return React.createElement('style', {
    dangerouslySetInnerHTML: {
      __html: PAGE_V2_CSS
    }
  });
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePageV2({
  lang = 'en'
}) {
  const c = HOME_V2[lang] || HOME_V2.en;
  const t = window.cT(lang);
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'home',
    lang
  }), React.createElement('main', null,
  // Hero — eyebrow, intro, positioning H1, supporting line, CTA + circular photo
  React.createElement('section', {
    className: 'home-hero'
  }, React.createElement('div', {
    className: 'home-hero__grid'
  }, React.createElement('div', {
    className: 'home-hero__copy'
  }, React.createElement('div', {
    className: 'home-hero__eyebrow'
  }, c.eyebrow), React.createElement('div', {
    className: 'home-hero__intro'
  }, c.intro), React.createElement('h1', {
    className: 'home-hero__title'
  }, c.h1pre, React.createElement('span', {
    className: 'human'
  }, c.h1human), c.h1post), React.createElement('p', {
    className: 'home-hero__support'
  }, c.support), React.createElement('a', {
    className: 'hero-cta',
    href: window.cPath('diagnostic', lang)
  }, React.createElement('span', null, t.ctaBtn), React.createElement('span', null, '→'))), React.createElement('figure', {
    className: 'home-hero__photo'
  }, React.createElement('div', {
    className: 'home-hero__frame'
  }, React.createElement('img', {
    src: '/img/aggelos-homepage.webp',
    alt: 'Aggelos Mouzakitis',
    width: 1560,
    height: 1040,
    loading: 'eager',
    fetchpriority: 'high',
    decoding: 'async'
  }))))),
  // Manifesto — "The whole point"
  React.createElement('section', {
    className: 'home-manifesto'
  }, React.createElement('div', {
    className: 'home-manifesto__inner'
  }, React.createElement('div', {
    className: 'home-manifesto__label'
  }, c.mLabel), React.createElement('div', {
    className: 'home-manifesto__copy'
  }, React.createElement('span', {
    className: 'home-manifesto__muted'
  }, c.mMuted), React.createElement('span', {
    className: 'home-manifesto__green'
  }, c.mGreenPre, React.createElement('mark', null, c.mMark))))), React.createElement('div', {
    className: 'home-flow'
  },
  // 01 — split
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'sec__n'
  }, '01'), React.createElement('h2', {
    className: 'sec__h'
  }, c.splitIntro), React.createElement('div', {
    className: 'split'
  }, React.createElement('div', {
    className: 'split__cell split--paper'
  }, React.createElement('h3', null, c.leftH), React.createElement('p', null, c.leftP)), React.createElement('div', {
    className: 'split__cell split--black'
  }, React.createElement('h3', null, c.rightH), React.createElement('p', null, c.rightP))))),
  // 02 — you will get an opinion
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'sec__n'
  }, '02'), React.createElement('h2', {
    className: 'sec__h2l'
  }, React.createElement('span', null, c.opinionL1), React.createElement('span', null, c.opinionL2)), React.createElement('div', {
    className: 'opinion'
  }, React.createElement('img', {
    src: '/img/aggelos-continuation.jpeg',
    alt: c.contAlt,
    width: 900,
    height: 1125,
    loading: 'lazy',
    decoding: 'async'
  }), React.createElement('div', {
    className: 'opinion__body'
  }, c.opinionParas.map((p, i) => React.createElement('p', {
    key: i
  }, p)), React.createElement('blockquote', {
    className: 'opinion__q'
  }, c.opinionQuote))))),
  // 03 — if we continue
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'cont'
  }, React.createElement('div', {
    className: 'cont__in'
  }, React.createElement('div', {
    className: 'cont-marker'
  }, React.createElement('span', {
    className: 'n'
  }, c.contNum), React.createElement('span', {
    className: 'lbl'
  }, c.contLabel)), React.createElement('h2', {
    className: 'cont__h'
  }, c.contH), React.createElement('p', null, c.contP))))),
  // 04 — media
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'sec__n'
  }, '04'), React.createElement('h2', {
    className: 'sec__h',
    style: {
      marginBottom: 24
    }
  }, c.mediaIntro), React.createElement('div', {
    className: 'rule-arrow'
  }, React.createElement('div'), React.createElement('span', null, '→')), React.createElement('div', {
    className: 'media'
  }, React.createElement('a', {
    className: 'media__cell media__read',
    href: window.EXTERNAL.undisguised,
    ...v2Ext
  }, React.createElement('div', {
    className: 'media__top'
  }, React.createElement('h3', null, 'READ'), React.createElement('span', {
    className: 'media__arw'
  }, '↗')), React.createElement('div', null, React.createElement('div', {
    className: 'media__kicker'
  }, 'UNDISGUISED'), React.createElement('p', null, c.readP))), React.createElement('a', {
    className: 'media__cell media__watch',
    href: window.EXTERNAL.youtube,
    ...v2Ext
  }, React.createElement('div', {
    className: 'media__top'
  }, React.createElement('h3', null, 'WATCH'), React.createElement('span', {
    className: 'media__arw',
    style: {
      fontSize: 32
    }
  }, '↗')), React.createElement('div', null, React.createElement('div', {
    className: 'media__kicker'
  }, 'YOUTUBE'), React.createElement('p', null, c.watchP))), React.createElement('div', {
    className: 'media__cell media__follow'
  }, React.createElement('h3', null, 'FOLLOW'), React.createElement('div', {
    className: 'icon-row'
  }, React.createElement('a', {
    className: 'icon-btn',
    href: window.EXTERNAL.linkedin,
    'aria-label': 'LinkedIn',
    ...v2Ext
  }, React.createElement(window.BrandIcon, {
    name: 'LinkedIn',
    size: 21
  })), React.createElement('a', {
    className: 'icon-btn',
    href: window.EXTERNAL.instagram,
    'aria-label': 'Instagram',
    ...v2Ext
  }, React.createElement(window.BrandIcon, {
    name: 'Instagram',
    size: 21
  })), React.createElement('a', {
    className: 'icon-btn',
    href: window.EXTERNAL.tiktok,
    'aria-label': 'TikTok',
    ...v2Ext
  }, React.createElement(window.BrandIcon, {
    name: 'TikTok',
    size: 20
  })))))))), React.createElement(window.BlackCtaStrip, {
    lang,
    heading: c.finalH
  })), React.createElement(window.SiteFooterX, {
    lang
  }));
}

// ─── WHY ME (route stays /about/) ────────────────────────────────────────────
// Credential rows use only verified production facts (mirrors the About copy /
// Person JSON-LD): 18+ yrs product & growth, 500+ companies, MSc Derby, BACP.
const WHY_CREDS = {
  en: [{
    n: '01',
    h: 'Product and growth',
    p: '18+ years in tech, mostly in product and growth, inside startups and large organisations.'
  }, {
    n: '02',
    h: 'Companies advised',
    p: 'Built my own companies and advised more than 500 businesses.'
  }, {
    n: '03',
    h: 'Psychotherapy training',
    p: 'MSc Integrative Counselling & Psychotherapy, University of Derby.'
  }, {
    n: '04',
    h: 'Professional registration',
    p: 'Registered member of the BACP. Based in Ireland, working globally.'
  }],
  el: [{
    n: '01',
    h: 'Product και growth',
    p: '18+ χρόνια στην τεχνολογία, κυρίως στο product και το growth, σε startups και μεγάλους οργανισμούς.'
  }, {
    n: '02',
    h: 'Επιχειρήσεις',
    p: 'Έχτισα δικές μου εταιρείες και συμβούλεψα περισσότερες από 500 επιχειρήσεις.'
  }, {
    n: '03',
    h: 'Εκπαίδευση στην ψυχοθεραπεία',
    p: 'MSc Integrative Counselling & Psychotherapy, University of Derby.'
  }, {
    n: '04',
    h: 'Επαγγελματική εγγραφή',
    p: 'Εγγεγραμμένο μέλος του BACP. Έδρα στην Ιρλανδία, δουλεύω παγκόσμια.'
  }]
};
function AboutPageV2({
  lang = 'en',
  copy
}) {
  const c = copy && copy.about || {};
  const t = window.cT(lang);
  const intro = arr(c.intro);
  const creds = WHY_CREDS[lang] || WHY_CREDS.en;
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'about',
    lang
  }), React.createElement('main', null, React.createElement('section', {
    className: 'why-hero'
  }, React.createElement('div', {
    className: 'site-container why-hero__grid'
  }, React.createElement('div', null, React.createElement('div', {
    className: 'why-hero__over'
  }, String(t.why || '').toUpperCase()), React.createElement('h1', null, c.lead), intro[0] ? React.createElement('p', {
    className: 'why-hero__intro'
  }, intro[0]) : null, c.role ? React.createElement('div', {
    className: 'why-hero__creds'
  }, c.role) : null), React.createElement('img', {
    src: '/img/aggelos-opinion.jpeg',
    alt: 'Aggelos Mouzakitis',
    width: 900,
    height: 1125,
    loading: 'eager',
    decoding: 'async'
  }))), React.createElement('section', {
    className: 'u-main'
  }, React.createElement('div', {
    className: 'site-container'
  }, creds.map(r => React.createElement('div', {
    className: 'cred-row',
    key: r.n
  }, React.createElement('div', {
    className: 'n'
  }, r.n), React.createElement('h3', null, r.h), React.createElement('p', null, r.p)))), React.createElement('div', {
    className: 'u-read',
    style: {
      marginTop: 72
    }
  }, intro.slice(1).map((p, i) => React.createElement('p', {
    key: 'i' + i
  }, p)), arr(c.sections).map((s, i) => React.createElement(React.Fragment, {
    key: i
  }, i > 0 ? React.createElement('hr') : null, React.createElement('h2', null, s.label), arr(s.body).map((p, j) => React.createElement('p', {
    key: j
  }, p)))))), React.createElement(window.BlackCtaStrip, {
    lang,
    heading: c.ctaHeading
  })), React.createElement(window.SiteFooterX, {
    lang
  }));
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function RevQuote({
  t,
  lang,
  toggleLabel,
  cls
}) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  return React.createElement('div', {
    className: cls
  }, React.createElement('p', null, '“' + (el ? t.qEl : t.q) + '”'), React.createElement('div', {
    className: 'who'
  }, el ? t.wEl : t.w), el && toggleLabel ? React.createElement('button', {
    type: 'button',
    onClick: () => setOpen(!open),
    'aria-expanded': open ? 'true' : 'false'
  }, toggleLabel + ' ' + (open ? '↑' : '↓')) : null, el && open ? React.createElement('p', {
    className: 'orig'
  }, '“' + t.q + '”') : null);
}
function ReviewsPageV2({
  lang = 'en',
  copy
}) {
  const c = copy && copy.reviews || {};
  const items = arr(copy && copy.reviewItems);
  const first = items[0];
  const rest = items.slice(1);
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'reviews',
    lang
  }), React.createElement('main', null, React.createElement('section', {
    className: 'rev-hero'
  }, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'rev-hero__grid'
  }, React.createElement('h1', null, c.h1), React.createElement('div', null, React.createElement('p', {
    className: 'rev-hero__lead'
  }, c.lead), React.createElement('div', {
    className: 'rev-hero__note'
  }, c.sub))), first ? React.createElement(RevQuote, {
    t: first,
    lang,
    toggleLabel: c.toggle,
    cls: 'rev-lead'
  }) : null)), React.createElement('section', {
    className: 'u-main'
  }, React.createElement('div', {
    className: 'site-container rev-grid'
  }, rest.map((t, i) => React.createElement(RevQuote, {
    key: i,
    t,
    lang,
    toggleLabel: c.toggle,
    cls: 'rev-item'
  })))), React.createElement(window.BlackCtaStrip, {
    lang,
    heading: c.ctaHeading
  })), React.createElement(window.SiteFooterX, {
    lang
  }));
}
Object.assign(window, {
  HomePageV2,
  AboutPageV2,
  ReviewsPageV2,
  PAGE_V2_CSS
});
