// core-pages-v2.jsx — approved Home / Why Me (exact spec) + Reviews.
// Loaded after site-chrome.js, before content-pages.js. Presentational only.
//   Home + Why Me: implemented verbatim from the approved implementation brief
//   (HOME / WHY constants below), using the locked amx-* visual system.
//   Reviews: consented GrowthMentor mix, passed in via the `copy` prop by CoreApp.
// Exposes on window: HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS.

const V2 = window.SITE;
const v2Ext = {
  target: '_blank',
  rel: 'noopener noreferrer'
};
const arr = x => Array.isArray(x) ? x : [];

// One reusable numbered-section-label: renders "NN / DESCRIPTION" on one line,
// number + slash kept together, aligned to the heading grid (no gutter column).
const SecLabel = (num, desc) => React.createElement('div', {
  className: 'sec-label'
}, React.createElement('span', {
  className: 'sec-label__num'
}, num + ' /'), React.createElement('span', {
  className: 'sec-label__desc'
}, desc));

// ─── Homepage copy — restored approved values (Homepage.dc.html mockup object).
// The personal first-person intro is intentionally removed (offer-first hero).
const HOME_V2 = {
  en: {
    eyebrow: 'BUSINESS & CAREER ADVISOR · BACP-REGISTERED PSYCHOTHERAPIST',
    h1pre: 'Practical help for the business, the career and ',
    h1human: 'the person',
    h1post: ' behind them.',
    support: 'For founders, freelancers and experienced professionals whose business or career problem also has a personal side.',
    mLabel: 'THE WHOLE POINT',
    mMuted: 'You know the work.',
    mGreenPre: 'Now let’s build a career or business that ',
    mMark: 'works for you too.',
    splitIntro: 'You won’t have to choose between practical advice and psychological depth.',
    s01d: 'BUSINESS & PSYCHOLOGY',
    s02d: 'HONEST FEEDBACK',
    s03d: 'IF WE CONTINUE',
    s04d: 'MORE FROM ME',
    leftH: 'WHAT WE CHANGE',
    leftP: 'We can work on the offer, marketing, career move, client mix or the way the business runs.',
    rightH: 'WHAT GETS IN THE WAY',
    rightP: 'If fear, shame or other people’s approval is shaping your decisions, we work there too.',
    opinionL1: 'YOU WILL GET',
    opinionL2: 'AN OPINION.',
    opinionParas: ['I ask enough questions to understand the situation, then tell you what I think.', 'If I see a practical move, I suggest it. If your story does not add up, I say so.', 'Tell me the part you usually edit out. I will not think less of you or let you bullshit yourself.'],
    opinionQuote: '“I left with more than advice. I left understanding what the problem actually was.”',
    contH: 'We agree on one concrete outcome and how long we will work towards it.',
    contP: 'We meet weekly or every other week, and you have WhatsApp access between sessions.',
    mediaIntro: 'Want to see how I think?',
    readP: 'Essays about work, ambition, psychology and where they overlap.',
    watchP: 'Short videos, longer conversations and the occasional useful rant.',
    askSub: 'ANONYMOUSLY',
    askP: 'Send me a question without giving me your name, and I may answer it in an article or video.',
    finalH: 'IF WORKING HARDER WAS GOING TO FIX THIS, IT PROBABLY WOULD HAVE BY NOW.',
    contAlt: 'Aggelos Mouzakitis'
  },
  el: {
    eyebrow: 'ΣΥΜΒΟΥΛΟΣ ΕΠΙΧΕΙΡΗΣΕΩΝ & ΚΑΡΙΕΡΑΣ · ΣΥΜΒΟΥΛΟΣ ΨΥΧΙΚΗΣ ΥΓΕΙΑΣ',
    h1pre: 'Πρακτική βοήθεια για την επιχείρηση, την καριέρα και ',
    h1human: 'τον άνθρωπο',
    h1post: ' πίσω από όλα αυτά.',
    support: 'Για founders, freelancers και έμπειρους επαγγελματίες που αντιμετωπίζουν ένα πραγματικό πρόβλημα με προσωπικές προεκτάσεις.',
    mLabel: 'ΤΟ ΖΗΤΟΥΜΕΝΟ',
    mMuted: 'Ξέρεις καλά τη δουλειά σου.',
    mGreenPre: 'Πάμε τώρα να κάνουμε την καριέρα ή την επιχείρησή σου ',
    mMark: 'να δουλεύει και για σένα.',
    splitIntro: 'Δεν χρειάζεται να διαλέξεις αν το θέμα είναι επαγγελματικό ή προσωπικό.',
    s01d: 'ΕΠΙΧΕΙΡΗΣΗ & ΨΥΧΟΛΟΓΙΑ',
    s02d: 'ΕΙΛΙΚΡΙΝΗΣ ΓΝΩΜΗ',
    s03d: 'ΑΝ ΣΥΝΕΧΙΣΟΥΜΕ',
    s04d: 'ΠΕΡΙΣΣΟΤΕΡΑ ΑΠΟ ΜΕΝΑ',
    leftH: 'ΤΙ ΑΛΛΑΖΟΥΜΕ',
    leftP: 'Μπορούμε να δουλέψουμε το offer, το marketing, την επόμενη κίνηση στην καριέρα σου, τους πελάτες ή τον τρόπο που λειτουργεί η επιχείρησή σου.',
    rightH: 'ΤΙ ΜΠΑΙΝΕΙ ΣΤΗ ΜΕΣΗ',
    rightP: 'Αν ο φόβος, η ντροπή ή η ανάγκη να μη δυσαρεστήσεις κανέναν επηρεάζουν τις αποφάσεις σου, δουλεύουμε και εκεί.',
    opinionL1: 'ΘΑ ΣΟΥ ΠΩ',
    opinionL2: 'ΤΗ ΓΝΩΜΗ ΜΟΥ.',
    opinionParas: ['Θα κάνω όσες ερωτήσεις χρειαστούν για να καταλάβω τι συμβαίνει. Μετά θα σου πω πώς το βλέπω.', 'Αν βλέπω κάτι συγκεκριμένο που μπορείς να κάνεις, θα στο προτείνω. Αν αυτά που μου λες δεν στέκουν, θα σου το πω.', 'Πες μου και αυτό που συνήθως αφήνεις απ’ έξω. Δεν θα σε δω διαφορετικά, αλλά ούτε θα σε αφήσω να λες μαλακίες στον εαυτό σου.'],
    opinionQuote: '«Έφυγα με κάτι περισσότερο από συμβουλές. Έφυγα έχοντας καταλάβει ποιο ήταν πραγματικά το πρόβλημα.»',
    contH: 'Συμφωνούμε τι ακριβώς θέλεις να πετύχεις και για πόσο θα δουλέψουμε πάνω σε αυτό.',
    contP: 'Μιλάμε κάθε εβδομάδα και μπορείς να μου γράφεις στο WhatsApp ανάμεσα στις συναντήσεις.',
    mediaIntro: 'Θέλεις να δεις πώς σκέφτομαι;',
    readP: 'Κείμενα για τη δουλειά, τη φιλοδοξία, την ψυχολογία και εκεί που μπλέκονται.',
    watchP: 'Μικρά βίντεο, μεγαλύτερες συζητήσεις και πού και πού κάποιο χρήσιμο rant.',
    askSub: 'ΑΝΩΝΥΜΑ',
    askP: 'Στείλε μου μια ερώτηση χωρίς να δώσεις το όνομά σου και ίσως την απαντήσω σε κάποιο κείμενο ή βίντεο.',
    finalH: 'ΑΝ ΛΥΝΟΤΑΝ ΜΕ ΠΕΡΙΣΣΟΤΕΡΗ ΔΟΥΛΕΙΑ, ΜΑΛΛΟΝ ΘΑ ΕΙΧΕ ΛΥΘΕΙ ΗΔΗ.',
    contAlt: 'Άγγελος Μουζακίτης'
  }
};

// ─── Why Me copy — verbatim from the approved implementation brief ─────────────
const WHY_V2 = {
  en: {
    label: 'WHY ME',
    h1: 'I spent most of my adult life in consulting, growth and startups before I trained as a psychotherapist.',
    deck: 'I spent seven years running a growth consultancy, worked with more than 100 technology companies, held corporate roles and built two startups that failed, so you will not have to explain how this world works to me.',
    fact: 'A founder or experienced professional does not have to explain how this world works to me.',
    originNum: '01',
    originDesc: 'WHERE I STARTED',
    origin: ['I did not grow up around business or inherit money, a network or useful introductions. From a studio in Piraeus, I built a consultancy, worked with some of the world’s largest companies and was later paid to teach the work.', 'I also built two startups that failed, so I do not advise founders, freelancers or senior professionals as an observer. I know what the work feels like when money, identity and relationships are involved.'],
    hwNum: '02',
    hwDesc: 'WHAT DROVE ME',
    hwH: 'Hard work took me far. It also kept me in the wrong places for too long.',
    hw: ['For years, being useful, reasonable and easy to work with brought results, but it also made it easier to accept work I did not want, avoid conflict and stay too long in the wrong places.', 'Business knowledge could not explain why the need for approval and fear of disappointing people had so much influence over my decisions, which is part of why I trained as a psychotherapist.'],
    exNum: '03',
    exDesc: 'WHERE I HELP',
    exH: 'I know when the problem is the business move and when something personal is getting in the way.',
    ex: ['A weak offer needs fixing, while a good offer that you cannot bring yourself to sell points to a different problem.', 'The same applies when you know you should raise your prices, challenge a client or make a career move but keep avoiding the discomfort involved. If the same need to keep people happy appears at home, we do not pretend it is unrelated.'],
    orNum: '04',
    orDesc: 'ONE CONVERSATION',
    orH: 'You do not have to explain the business or hide the personal part.',
    or: ['I ask questions, tell you what I see and challenge what does not add up. You can say what you actually want, including the version that may disappoint someone.', 'I will not think less of you, but I will question the reasonable explanation if it is only there to keep everyone happy.'],
    finalLabel: 'THIS IS THE WORK I NEEDED AND COULD NOT FIND.',
    finalH: 'We can work on the commercial problem and the personal one in the same conversation.',
    finalCta: 'Apply for a working session'
  },
  el: {
    label: 'ΓΙΑΤΙ ΕΜΕΝΑ',
    h1: 'Πριν εκπαιδευτώ ως ψυχοθεραπευτής, είχα περάσει το μεγαλύτερο μέρος της ενήλικης ζωής μου στο consulting, το growth και τα startups.',
    deck: 'Για επτά χρόνια είχα τη δική μου growth consultancy, συνεργάστηκα με περισσότερες από 100 εταιρείες τεχνολογίας, πέρασα από εταιρικούς ρόλους και έστησα δύο startups που απέτυχαν. Οπότε δεν θα χρειαστεί να μου εξηγήσεις πώς λειτουργεί αυτός ο κόσμος.',
    fact: 'Ένας founder ή ένας έμπειρος επαγγελματίας δεν χρειάζεται να μου εξηγήσει πώς λειτουργεί αυτός ο κόσμος.',
    originNum: '01',
    originDesc: 'ΑΠΟ ΠΟΥ ΞΕΚΙΝΗΣΑ',
    origin: ['Δεν μεγάλωσα σε επιχειρηματικό περιβάλλον και δεν υπήρχαν οικογενειακά χρήματα, επιχειρηματικές γνωριμίες ή άνθρωποι να μου ανοίξουν πόρτες. Από μια γκαρσονιέρα στον Πειραιά έφτιαξα τη δική μου growth consultancy, συνεργάστηκα με μερικές από τις μεγαλύτερες εταιρείες στον κόσμο και αργότερα πληρωνόμουν για να εκπαιδεύω κόσμο πάνω σε αυτή τη δουλειά.', 'Έστησα επίσης δύο startups που απέτυχαν, οπότε δεν μιλάω σε founders, freelancers ή έμπειρα στελέχη ως παρατηρητής. Ξέρω πώς είναι όταν στη δουλειά μπλέκονται τα χρήματα, η «ταυτότητα» και οι σχέσεις σου.'],
    hwNum: '02',
    hwDesc: 'ΤΙ ΜΕ ΟΔΗΓΟΥΣΕ',
    hwH: 'Η σκληρή δουλειά με πήγε μακριά. Με κράτησε όμως και για χρόνια στα λάθος μέρη.',
    hw: ['Για χρόνια, το να είμαι χρήσιμος, λογικός και εύκολος στη συνεργασία έφερνε αποτελέσματα, αλλά με έκανε και να δέχομαι δουλειές που δεν ήθελα, να αποφεύγω τις απαραίτητες συγκρούσεις και να μένω περισσότερο απ’ όσο έπρεπε στα λάθος μέρη.', 'Η γνώση του business δεν μπορούσε να μου εξηγήσει γιατί η ανάγκη για αποδοχή και ο φόβος μήπως απογοητεύσω τους άλλους επηρέαζαν τόσο πολύ τις αποφάσεις μου, και αυτός είναι ένας από τους λόγους που εκπαιδεύτηκα ως ψυχοθεραπευτής.'],
    exNum: '03',
    exDesc: 'ΠΩΣ ΒΟΗΘΑΩ',
    exH: 'Ξέρω πότε το πρόβλημα είναι η ίδια η business κίνηση και πότε κάτι προσωπικό μπαίνει στη μέση.',
    ex: ['Ένα αδύναμο offer χρειάζεται να φτιαχτεί, ενώ ένα καλό offer που δεν μπορείς να βγεις να το πουλήσεις δείχνει ότι το πρόβλημα βρίσκεται αλλού.', 'Το ίδιο ισχύει όταν ξέρεις ότι πρέπει να ανεβάσεις τις τιμές σου, να βάλεις όρια απέναντι σε έναν πελάτη ή να κάνεις μια επαγγελματική κίνηση, αλλά συνεχίζεις να αποφεύγεις ό,τι δύσκολο συνεπάγεται. Αν η ίδια ανάγκη να μη δυσαρεστήσεις κανέναν εμφανίζεται και στο σπίτι, δεν κάνουμε πως είναι άσχετη.'],
    orNum: '04',
    orDesc: 'ΣΤΗΝ ΙΔΙΑ ΣΥΖΗΤΗΣΗ',
    orH: 'Δεν χρειάζεται να μου εξηγείς το business ή να κρύβεις το προσωπικό κομμάτι.',
    or: ['Κάνω ερωτήσεις, σου λέω τι βλέπω και αμφισβητώ όσα δεν στέκουν. Μπορείς να πεις τι θέλεις πραγματικά, ακόμη κι αν αυτό μπορεί να απογοητεύσει κάποιον.', 'Δεν θα σε δω διαφορετικά, αλλά θα σου πω αν η πολύ λογική εξήγηση που δίνεις υπάρχει μόνο για να μη δυσαρεστήσεις κανέναν.'],
    finalLabel: 'ΑΥΤΗ ΕΙΝΑΙ Η ΔΟΥΛΕΙΑ ΠΟΥ ΧΡΕΙΑΖΟΜΟΥΝ ΚΑΙ ΔΕΝ ΜΠΟΡΟΥΣΑ ΝΑ ΒΡΩ.',
    finalH: 'Μπορούμε να δουλέψουμε το επαγγελματικό και το προσωπικό κομμάτι στην ίδια συζήτηση.',
    finalCta: 'Κάνε αίτηση για μία πρώτη συνάντηση'
  }
};

// ─── Page-section CSS ────────────────────────────────────────────────────────
// Home + Why Me use the locked amx-* system (values from the approved brief,
// scoped under .amx-page so legacy routes never inherit them). Reviews keeps its
// own rev-* rules below.
const PAGE_V2_CSS = `
/* ── One reusable numbered-section label: "NN / DESCRIPTION", one line, aligned to the heading ── */
.sec-label{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin:0 0 24px}
.sec-label__num{font-family:${V2.display};font-size:clamp(20px,2.2vw,26px);font-weight:800;line-height:1;letter-spacing:-0.03em;color:${V2.green};white-space:nowrap}
.sec-label__desc{font-family:${V2.display};font-size:13px;font-weight:700;line-height:1;letter-spacing:0.10em;text-transform:uppercase;color:${V2.green}}

/* ── Home hero — approved copy left, stage photograph right (scaled up) ── */
.home-hero{background:${V2.white};color:${V2.heroInk}}
.home-hero__grid{width:min(100% - 64px,1280px);min-height:600px;margin-inline:auto;display:grid;grid-template-columns:minmax(0,1.14fr) minmax(410px,0.86fr);align-items:center;gap:48px;padding-block:88px 112px}
.home-hero__copy{position:relative;z-index:2;min-width:0;max-width:720px;color:${V2.heroInk}}
.home-hero__eyebrow{max-width:520px;color:${V2.green};font-family:${V2.display};font-size:13px;font-weight:700;line-height:1.35;letter-spacing:0.055em;text-transform:uppercase}
.home-hero__title{max-width:720px;margin:14px 0 22px;font-family:${V2.archivo};font-synthesis:none;font-weight:400;line-height:0.9;letter-spacing:-0.055em;color:${V2.heroInk}}
html[lang="en"] .home-hero__title{font-size:clamp(62px,5.4vw,80px)}
html[lang="el"] .home-hero__title{font-size:clamp(46px,4.4vw,64px);font-family:${V2.display};font-weight:800;line-height:0.98;letter-spacing:-0.045em}
.home-hero__title .human{position:relative;z-index:0;white-space:nowrap}
.home-hero__title .human::after{content:"";position:absolute;z-index:-1;left:-0.03em;right:-0.03em;bottom:0.04em;height:0.14em;background:${V2.green}}
.home-hero__support{max-width:640px;margin:0 0 26px;color:${V2.heroInk};font-family:${V2.display};font-size:20px;font-weight:400;line-height:1.42}
.home-hero__photo{position:relative;z-index:1;width:clamp(420px,34vw,500px);max-width:100%;aspect-ratio:1;justify-self:end}
.home-hero__photo::before{content:"";position:absolute;inset:8% -3% -2% 9%;border-radius:50%;background:${V2.green}}
.home-hero__frame{position:absolute;inset:0;overflow:hidden;border-radius:50%}
.home-hero__frame img{width:100%;height:100%;object-fit:cover;object-position:56% 44%;transform:scale(1.58);filter:grayscale(1) contrast(1.08)}
@media (max-width:959px) and (min-width:521px){
  .home-hero__grid{grid-template-columns:minmax(0,1.08fr) minmax(280px,0.92fr);gap:24px;padding-inline:24px}
  html[lang="en"] .home-hero__title{font-size:clamp(46px,7vw,62px)}
  html[lang="el"] .home-hero__title{font-size:clamp(40px,6vw,54px)}
  .home-hero__photo{width:min(100%,390px)}
}
@media (max-width:520px){
  .home-hero__grid{grid-template-columns:1fr;gap:34px;padding:66px 20px 80px;min-height:0}
  html[lang="en"] .home-hero__title{font-size:clamp(46px,14vw,62px)}
  html[lang="el"] .home-hero__title{font-size:clamp(38px,11vw,52px)}
  .home-hero__photo{width:min(82%,310px);justify-self:center}
}

/* ── Manifesto — "The whole point" (full-width dark) ── */
.home-manifesto{width:100%;background:${V2.ink}}
.home-manifesto__inner{max-width:1280px;margin-inline:auto;padding:clamp(58px,6vw,82px) clamp(24px,5vw,72px)}
.home-manifesto__label{margin-bottom:17px;color:${V2.green};font-family:${V2.display};font-size:13px;font-weight:700;line-height:1;letter-spacing:0.10em;text-transform:uppercase}
.home-manifesto__copy{font-family:${V2.archivo};font-synthesis:none;font-size:clamp(36px,4.8vw,68px);font-weight:400;line-height:1.04;letter-spacing:-0.055em}
html[lang="el"] .home-manifesto__copy{font-family:${V2.display};font-weight:800;letter-spacing:-0.045em}
.home-manifesto__muted,.home-manifesto__green{display:block}
.home-manifesto__muted{color:${V2.greyOnDark}}
.home-manifesto__green{color:${V2.green}}
.home-manifesto__copy mark{padding:0 0.08em 0.02em;background:${V2.white};color:${V2.ink};box-decoration-break:clone;-webkit-box-decoration-break:clone}
@media (max-width:680px){.home-manifesto__inner{padding:48px 20px 55px}.home-manifesto__copy{font-size:clamp(34px,10vw,48px)}}

/* ── Section 01 — dual-field component (dark business / green psychology, portrait on the seam) ── */
.am-duality-section{overflow:hidden;padding:clamp(86px,9vw,130px) 24px clamp(101px,10.2vw,146px);background:${V2.white}}
.am-duality-section__inner{width:min(100%,1140px);margin-inline:auto}
.am-duality-section__heading{display:block;margin-bottom:clamp(62px,7vw,92px)}
.am-duality-section__title{max-width:880px;margin:0;font-family:${V2.display};font-synthesis:none;font-size:clamp(43px,4.25vw,61px);line-height:0.98;letter-spacing:-0.052em;font-weight:800;color:#181a1c}
.am-duality{--am-photo-width:clamp(224px,21.5vw,250px);--am-photo-height:clamp(382px,36.7vw,426px);position:relative;isolation:isolate;width:min(100%,1000px);min-height:360px;margin-inline:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.am-duality__side{min-width:0;min-height:360px;display:flex;align-items:center}
.am-duality__side--business{padding:52px 160px 52px 50px;background:#181a1c;color:#ffffff}
.am-duality__side--psychology{padding:52px 50px 52px 180px;background:#059669;color:#181a1c;text-align:right}
.am-duality__side--psychology .am-duality__copy{margin-left:auto}
.am-duality__copy{width:100%;max-width:270px}
.am-duality__label{margin:0 0 20px;font-family:${V2.body};font-size:13px;line-height:1;font-weight:800;letter-spacing:0.075em;text-transform:uppercase}
.am-duality__statement{margin:0;font-family:${V2.display};font-size:clamp(20px,1.8vw,24px);line-height:1.27;letter-spacing:-0.028em;font-weight:700}
.am-duality__portrait{position:absolute;z-index:3;left:50%;top:50%;width:var(--am-photo-width);height:var(--am-photo-height);margin:0;transform:translate(-50%,-50%);overflow:hidden;background:#181a1c}
.am-duality__portrait img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 20%;filter:grayscale(100%)}
@media (max-width:900px) and (min-width:701px){
  .am-duality{--am-photo-width:210px;--am-photo-height:360px}
  .am-duality__side--business{padding:48px 130px 48px 38px}
  .am-duality__side--psychology{padding:48px 38px 48px 145px}
  .am-duality__statement{font-size:19px}
}
@media (max-width:700px){
  .am-duality-section{padding-inline:20px}
  .am-duality-section__heading{margin-bottom:58px}
  .am-duality-section__title{font-size:clamp(39px,10.5vw,49px)}
  .am-duality{--am-mobile-top:270px;--am-mobile-bottom:300px;--am-photo-width:clamp(144px,39vw,160px);--am-photo-height:clamp(224px,60vw,242px);min-height:calc(var(--am-mobile-top) + var(--am-mobile-bottom));grid-template-columns:1fr;grid-template-rows:var(--am-mobile-top) var(--am-mobile-bottom)}
  .am-duality__side{min-height:0;justify-content:center;text-align:center}
  .am-duality__side--psychology{text-align:center}
  .am-duality__side--psychology .am-duality__copy{margin-left:0;margin-right:0}
  .am-duality__side--business{padding:38px 18px 112px}
  .am-duality__side--psychology{padding:178px 18px 34px}
  .am-duality__copy{max-width:330px}
  .am-duality__label{margin-bottom:17px;font-size:11px}
  .am-duality__statement{font-size:clamp(17px,4.7vw,20px);line-height:1.3}
  .am-duality__portrait{top:calc(var(--am-mobile-top) + 25px)}
}
@media (max-width:370px){
  .am-duality-section{padding-inline:16px}
  .am-duality__statement{font-size:16px}
}

/* ── Home dark canvas sections 02–04 ── */
.home-flow{display:flex;flex-direction:column;gap:clamp(64px,8vw,96px);padding-block:clamp(77px,9.6vw,115px)}
.sec__h{margin:0 0 48px;max-width:19ch;font-family:${V2.display};font-size:clamp(40px,4.25vw,58px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#fff;text-wrap:balance}
.sec__h2l{margin:0 0 48px;font-family:${V2.display};font-size:clamp(52px,5.5vw,76px);font-weight:800;line-height:0.94;letter-spacing:-0.045em;color:#fff}
.sec__h2l span{display:block}
.opinion{display:grid;grid-template-columns:0.85fr 1.15fr;background:${V2.white};border-radius:12px;overflow:hidden}
.opinion img{display:block;width:100%;height:100%;min-height:520px;object-fit:cover;object-position:42% 50%}
.opinion__body{padding:clamp(32px,4.5vw,56px);min-width:0;display:grid;align-content:start;gap:24px}
.opinion__body p{margin:0;font-size:18px;line-height:1.55;color:${V2.ink2};max-width:52ch;text-wrap:pretty}
.opinion__q{margin:8px 0 0;border-top:2px solid ${V2.green};padding-top:24px;font-family:${V2.display};font-weight:750;font-size:clamp(28px,2.5vw,38px);line-height:1.2;letter-spacing:-0.035em;color:${V2.ink};max-width:32ch;text-wrap:pretty}
.cont{min-height:440px;background:${V2.white};border-radius:12px;padding:clamp(32px,5vw,72px);display:flex;align-items:center}
.cont__in{max-width:760px}
.cont__h{margin:0;max-width:20ch;font-family:${V2.display};font-size:clamp(40px,4.2vw,58px);font-weight:760;line-height:1.02;letter-spacing:-0.04em;color:${V2.ink};text-wrap:pretty}
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
.media__watch p{font-size:18px;line-height:1.55;max-width:34ch}
.media__ask{background:${V2.white};color:${V2.ink}}
.media__ask h3{font-size:clamp(44px,4vw,64px)}
.media__ask .media__arw{color:${V2.green}}
.media__ask-sub{display:block;margin-top:6px;font-family:${V2.display};font-size:clamp(20px,1.9vw,26px);font-weight:800;line-height:1;letter-spacing:-0.02em;color:${V2.green}}
@media (max-width:960px){
  .media{grid-template-columns:1fr;grid-template-rows:auto;min-height:0}
  .media__read{grid-row:auto}.media__cell{min-height:320px}
  .opinion{grid-template-columns:1fr}.opinion img{min-height:320px}
}

:root{
  --am-paper:#f3f0e8;
  --am-surface:#ffffff;
  --am-ink:#171919;
  --am-dark:#1b1d1d;
  --am-green:#059669;
  --am-grey:#a5aaa6;
  --am-container:1080px;
  --am-gutter:clamp(24px, 5vw, 56px);
  --am-section-space:clamp(70px, 9.6vw, 101px);
}
.amx-page{width:100%;overflow:clip;color:var(--am-ink);background:var(--am-surface);font-family:var(--font-body)}
.amx-page,.amx-page *{box-sizing:border-box}
.amx-container{width:min(100%, var(--am-container));margin-inline:auto;padding-inline:var(--am-gutter)}
.amx-paper{color:var(--am-ink);background:var(--am-surface)}
.amx-dark{color:var(--am-paper);background:var(--am-dark)}
.amx-green{color:var(--am-ink);background:var(--am-green)}
.amx-section{padding-block:var(--am-section-space)}
.amx-label{margin:0;color:var(--am-green);font:700 13px/1.3 var(--font-body);letter-spacing:0.07em;text-transform:uppercase}
.amx-display,.amx-heading,.amx-subheading{margin:0;color:inherit;font-synthesis:none}
.amx-display{font-family:var(--font-display);font-size:clamp(42px, 6.4vw, 64px);font-weight:400;line-height:0.98;letter-spacing:-0.045em}
html[lang^="el"] .amx-display{font-family:var(--font-heading);font-weight:800;line-height:1.04;letter-spacing:-0.035em;overflow-wrap:break-word}
.amx-heading{margin:0;font-family:var(--font-heading);font-size:clamp(34px, 5vw, 52px);font-weight:800;line-height:1;letter-spacing:-0.045em;overflow-wrap:break-word}
html[lang^="el"] .amx-heading{line-height:1.04;letter-spacing:-0.035em}
.amx-subheading{font-family:var(--font-heading);font-size:24px;font-weight:800;line-height:1.08;letter-spacing:-0.025em}
html[lang^="el"] .amx-subheading{line-height:1.13;letter-spacing:-0.018em}
.amx-body{margin:0;color:inherit;font:400 18px/1.55 var(--font-body)}
html[lang^="el"] .amx-body{line-height:1.62}
.amx-button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding-inline:21px;border:0;border-radius:0;color:#ffffff;background:var(--am-green);font:600 16px/1 var(--font-body);text-decoration:none}
.amx-button:focus-visible,.amx-content-link:focus-visible{outline:3px solid currentColor;outline-offset:4px}
.amx-section-head{margin-bottom:36px}

/* FINAL CTA */
.amx-final{text-align:center}
.amx-final .amx-heading{max-width:770px;margin-inline:auto}
.amx-final .amx-button{margin-top:28px}
.amx-final-link{display:block;margin-top:18px;color:#626764;font:400 13px/1.4 var(--font-body)}

/* WHY ME */
.amx-why-hero{padding-block:clamp(74px, 9.6vw, 106px)}
.amx-why-hero .amx-display{max-width:920px;margin-top:16px}
.amx-why-hero .amx-body{max-width:800px;margin-top:24px}
.amx-fact-bar{padding-block:29px}
.amx-fact-bar .amx-body{font-weight:600}
.amx-story-copy{max-width:750px}
.amx-story-copy .amx-body + .amx-body{margin-top:22px}
.amx-reading-copy{max-width:750px;margin:28px 0 0}
.amx-reading-copy .amx-body + .amx-body{margin-top:20px}
@media (max-width: 470px){
  .amx-display{font-size:clamp(38px, 12vw, 48px)}
  .amx-heading{font-size:clamp(32px, 10vw, 42px)}
}

/* ── Reviews (no giant opening testimonial) ── */
.rev-hero{background:${V2.white};padding-block:96px 67px}
.rev-hero__grid{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);gap:64px;align-items:start}
.rev-hero h1{margin:0;font-family:${V2.display};font-size:clamp(44px,4.6vw,64px);font-weight:780;line-height:0.98;letter-spacing:-0.045em;color:${V2.ink}}
.rev-hero__lead{margin:0 0 14px;font-size:20px;line-height:1.6;color:${V2.ink2};max-width:60ch}
.rev-hero__note{font-size:15px;line-height:1.6;color:${V2.meta}}
.rev-lead{max-width:900px;margin:56px 0 0;padding-top:28px;border-top:4px solid ${V2.green}}
.rev-lead p{margin:0;font-family:${V2.display};font-size:clamp(21px,2.1vw,25px);font-weight:600;line-height:1.5;letter-spacing:-0.01em;color:${V2.ink};text-wrap:pretty}
.rev-lead button,.rev-item button{margin-top:16px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;color:${V2.green}}
.rev-lead .orig,.rev-item .orig{margin-top:16px;padding-top:16px;border-top:1px solid ${V2.rule};font-size:16px;line-height:1.7;color:${V2.meta};font-style:italic}
.rev-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:64px;align-items:start}
.rev-item{border-top:1px solid ${V2.rule};padding:36px 0 44px;min-width:0}
.rev-item p{margin:0;font-size:19px;line-height:1.72;color:${V2.ink}}
/* Reviewer credit: restrained grayscale avatar (self-hosted photo, else initials) + name */
.rev-cred{display:flex;align-items:center;gap:14px;margin-top:22px}
.rev-cred .who{margin:0;font-size:14px;color:${V2.meta}}
.rev-avatar{position:relative;flex:0 0 auto;width:60px;height:60px;border-radius:50%;overflow:hidden;background:${V2.ink};color:${V2.paper};display:flex;align-items:center;justify-content:center;font-family:${V2.display};font-size:17px;font-weight:700;line-height:1}
.rev-avatar__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.03)}
@media (max-width:900px){.rev-hero{padding-block:67px 58px}.rev-hero__grid{grid-template-columns:1fr;gap:28px}}
@media (max-width:800px){.rev-grid{grid-template-columns:1fr}.rev-lead p{font-size:22px}}
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
  // Hero — professional eyebrow, positioning H1, supporting line, CTA + stage photo
  React.createElement('section', {
    className: 'home-hero'
  }, React.createElement('div', {
    className: 'home-hero__grid'
  }, React.createElement('div', {
    className: 'home-hero__copy'
  }, React.createElement('div', {
    className: 'home-hero__eyebrow'
  }, c.eyebrow), React.createElement('h1', {
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
  }, c.mGreenPre, React.createElement('mark', null, c.mMark))))),
  // Section 01 — dual-field component (dark business / green psychology, portrait on the seam)
  React.createElement('section', {
    className: 'am-duality-section',
    'aria-labelledby': 'am-duality-title'
  }, React.createElement('div', {
    className: 'am-duality-section__inner'
  }, React.createElement('header', {
    className: 'am-duality-section__heading'
  }, SecLabel('01', c.s01d), React.createElement('h2', {
    className: 'am-duality-section__title',
    id: 'am-duality-title'
  }, c.splitIntro)), React.createElement('div', {
    className: 'am-duality'
  }, React.createElement('article', {
    className: 'am-duality__side am-duality__side--business'
  }, React.createElement('div', {
    className: 'am-duality__copy'
  }, React.createElement('p', {
    className: 'am-duality__label'
  }, c.leftH), React.createElement('p', {
    className: 'am-duality__statement'
  }, c.leftP))), React.createElement('article', {
    className: 'am-duality__side am-duality__side--psychology'
  }, React.createElement('div', {
    className: 'am-duality__copy'
  }, React.createElement('p', {
    className: 'am-duality__label'
  }, c.rightH), React.createElement('p', {
    className: 'am-duality__statement'
  }, c.rightP))), React.createElement('figure', {
    className: 'am-duality__portrait'
  }, React.createElement('img', {
    src: '/img/aggelos-overlap.webp',
    alt: 'Aggelos Mouzakitis',
    width: 250,
    height: 426,
    loading: 'lazy',
    decoding: 'async'
  }))))), React.createElement('div', {
    className: 'home-flow'
  },
  // 02 — you will get an opinion
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, SecLabel('02', c.s02d), React.createElement('h2', {
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
  }, SecLabel('03', c.s03d), React.createElement('h2', {
    className: 'cont__h'
  }, c.contH), React.createElement('p', null, c.contP))))),
  // 04 — media
  React.createElement('section', null, React.createElement('div', {
    className: 'site-container'
  }, SecLabel('04', c.s04d), React.createElement('h2', {
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
  }, 'YOUTUBE'), React.createElement('p', null, c.watchP))), React.createElement('a', {
    className: 'media__cell media__ask',
    href: window.cPath('ask-me-anything', lang)
  }, React.createElement('div', {
    className: 'media__top'
  }, React.createElement('h3', null, 'ASK', React.createElement('span', {
    className: 'media__ask-sub'
  }, c.askSub)), React.createElement('span', {
    className: 'media__arw',
    style: {
      fontSize: 32
    }
  }, '↗')), React.createElement('div', null, React.createElement('p', null, c.askP))))))), React.createElement(window.BlackCtaStrip, {
    lang,
    heading: c.finalH
  })), React.createElement(window.SiteFooterX, {
    lang
  }));
}

// ─── WHY ME (route stays /about/) ────────────────────────────────────────────
function AboutPageV2({
  lang = 'en'
}) {
  const c = WHY_V2[lang] || WHY_V2.en;
  const diag = window.cPath('diagnostic', lang);
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'about',
    lang
  }), React.createElement('main', {
    className: 'amx-page'
  },
  // Hero — off-white
  React.createElement('section', {
    className: 'amx-paper'
  }, React.createElement('div', {
    className: 'amx-container amx-why-hero'
  }, React.createElement('p', {
    className: 'amx-label'
  }, c.label), React.createElement('h1', {
    className: 'amx-display'
  }, c.h1), React.createElement('p', {
    className: 'amx-body'
  }, c.deck))),
  // Fact bar — green
  React.createElement('section', {
    className: 'amx-green amx-fact-bar'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('p', {
    className: 'amx-body'
  }, c.fact))),
  // Origin — dark
  React.createElement('section', {
    className: 'amx-dark amx-section'
  }, React.createElement('div', {
    className: 'amx-container amx-story-grid'
  }, SecLabel(c.originNum, c.originDesc), React.createElement('div', {
    className: 'amx-story-copy'
  }, c.origin.map((p, i) => React.createElement('p', {
    className: 'amx-body',
    key: i
  }, p))))),
  // Hard work — off-white
  React.createElement('section', {
    className: 'amx-paper amx-section'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('div', {
    className: 'amx-section-head'
  }, SecLabel(c.hwNum, c.hwDesc), React.createElement('h2', {
    className: 'amx-heading'
  }, c.hwH)), React.createElement('div', {
    className: 'amx-reading-copy'
  }, c.hw.map((p, i) => React.createElement('p', {
    className: 'amx-body',
    key: i
  }, p))))),
  // Examples — dark
  React.createElement('section', {
    className: 'amx-dark amx-section'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('div', {
    className: 'amx-section-head'
  }, SecLabel(c.exNum, c.exDesc), React.createElement('h2', {
    className: 'amx-heading'
  }, c.exH)), React.createElement('div', {
    className: 'amx-reading-copy'
  }, c.ex.map((p, i) => React.createElement('p', {
    className: 'amx-body',
    key: i
  }, p))))),
  // One room — off-white
  React.createElement('section', {
    className: 'amx-paper amx-section'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('div', {
    className: 'amx-section-head'
  }, SecLabel(c.orNum, c.orDesc), React.createElement('h2', {
    className: 'amx-heading'
  }, c.orH)), React.createElement('div', {
    className: 'amx-reading-copy'
  }, c.or.map((p, i) => React.createElement('p', {
    className: 'amx-body',
    key: i
  }, p))))),
  // Final CTA — dark
  React.createElement('section', {
    className: 'amx-dark amx-section amx-final'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('p', {
    className: 'amx-label'
  }, c.finalLabel), React.createElement('h2', {
    className: 'amx-heading',
    style: {
      marginTop: 16
    }
  }, c.finalH), React.createElement('a', {
    className: 'amx-button',
    href: diag
  }, c.finalCta + ' →')))), React.createElement(window.SiteFooterX, {
    lang
  }));
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
// Restrained reviewer avatar: self-hosted grayscale photo layered over initials.
// If the photo is missing or fails to load, the initials remain (never a fake face).
function RevAvatar({
  photo,
  name
}) {
  const [failed, setFailed] = React.useState(false);
  const initials = String(name || '').trim().split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase();
  return React.createElement('span', {
    className: 'rev-avatar',
    'aria-hidden': 'true'
  }, React.createElement('span', {
    className: 'rev-avatar__i'
  }, initials), photo && !failed ? React.createElement('img', {
    className: 'rev-avatar__img',
    src: photo,
    alt: '',
    loading: 'lazy',
    decoding: 'async',
    width: 120,
    height: 120,
    onError: () => setFailed(true)
  }) : null);
}
function RevQuote({
  t,
  lang,
  toggleLabel,
  cls
}) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  // Only offer the original-English toggle when a distinct Greek translation exists
  // (the named GrowthMentor reviews are English-only, so no toggle for those).
  const hasOrig = el && toggleLabel && t.qEl && t.qEl !== t.q;
  return React.createElement('div', {
    className: cls
  }, React.createElement('p', null, '“' + (el ? t.qEl : t.q) + '”'), React.createElement('div', {
    className: 'rev-cred'
  }, t.name ? React.createElement(RevAvatar, {
    photo: t.photo,
    name: t.name
  }) : null, React.createElement('div', {
    className: 'who'
  }, el ? t.wEl : t.w)), hasOrig ? React.createElement('button', {
    type: 'button',
    onClick: () => setOpen(!open),
    'aria-expanded': open ? 'true' : 'false'
  }, toggleLabel + ' ' + (open ? '↑' : '↓')) : null, hasOrig && open ? React.createElement('p', {
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
