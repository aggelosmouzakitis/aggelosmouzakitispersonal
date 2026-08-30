// core-pages-v2.jsx — approved Home / Why Me (exact spec) + Reviews.
// Loaded after site-chrome.js, before content-pages.js. Presentational only.
//   Home + Why Me: implemented verbatim from the approved implementation brief
//   (HOME / WHY constants below), using the locked amx-* visual system.
//   Reviews: consented GrowthMentor mix, passed in via the `copy` prop by CoreApp.
// Exposes on window: HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS.

const V2 = window.SITE;
const v2Ext = { target: '_blank', rel: 'noopener noreferrer' };
const arr = (x) => (Array.isArray(x) ? x : []);

// ─── Homepage copy — verbatim from the approved implementation brief ───────────
const HOME_V2 = {
  en: {
    heroEyebrow: 'BUSINESS & CAREER ADVISER · BACP-REGISTERED PSYCHOTHERAPIST',
    heroH1: 'Business strategy. Personal psychology. Same conversation.',
    heroBody: 'Offers, marketing, clients and career moves — plus the fear, avoidance and relationships shaping them.',
    heroCta: 'Apply for a working session',
    heroAlt: 'Aggelos Mouzakitis speaking on stage',
    mLabel: 'THE WHOLE POINT',
    mMuted: 'You know your work.',
    mGreen: 'Now let’s make your career or business work for you.',
    s1h: 'A weak offer needs business advice. Avoiding a good one is a different problem.',
    s1deck: 'The same goes for the career move, the client you need to fire or the conversation you keep postponing.',
    s1leftH: 'Business & career',
    s1left: ['Offer, positioning & GTM', 'Pricing, sales & clients', 'Promotions & career moves'],
    s1rightH: 'Psychology & relationships',
    s1right: ['Fear, shame & avoidance', 'Self-criticism & procrastination', 'Boundaries at work & home'],
    s1centre: 'Aggelos',
    s2h: 'You will get an opinion.',
    s2p1: 'I ask enough questions to understand the situation, then I tell you what I think. If the offer is weak, we fix it. If the offer is fine and you are avoiding the sales work, we deal with the avoidance.',
    s2p2: 'You can say what you normally leave out. I will not judge you, and I will not pretend your explanation makes sense when it does not.',
    s2quote: '“I left with more than advice. I left understanding what the problem actually was.”',
    proof: [
      { v: '7 years', l: 'running a growth consultancy' },
      { v: '100+', l: 'technology companies' },
      { v: '100+', l: 'founder mentoring sessions' },
      { v: 'BACP', l: 'registered psychotherapist' },
    ],
    s3h: 'We agree on one outcome and a fixed timeframe.',
    s3body: 'You have access to me in the calls and on WhatsApp between them. The work is built around the outcome, not a pre-written programme.',
    s4h: 'Want to see how I think?',
    s4read: { t: 'Read', b: 'Essays about work, ambition and psychology.' },
    s4watch: { t: 'Watch', b: 'Videos, conversations and useful rants.' },
    s4follow: { t: 'Follow' },
    s4and: ' and ',
    finalH: 'If working harder was going to fix this, it probably would have by now.',
    finalCta: 'Apply for a working session',
    confidentiality: 'Confidentiality',
  },
  el: {
    heroEyebrow: 'ΣΥΜΒΟΥΛΟΣ BUSINESS & ΚΑΡΙΕΡΑΣ · BACP-REGISTERED ΨΥΧΟΘΕΡΑΠΕΥΤΗΣ',
    heroH1: 'Business και ψυχολογία. Στην ίδια συζήτηση.',
    heroBody: 'Offer, marketing, πελάτες και καριέρα, μαζί με τον φόβο, την αποφυγή και τις σχέσεις που επηρεάζουν τις αποφάσεις σου.',
    heroCta: 'Κάνε αίτηση για μία πρώτη συνάντηση',
    heroAlt: 'Ο Άγγελος Μουζακίτης σε ομιλία',
    mLabel: 'ΤΟ ΖΗΤΟΥΜΕΝΟ',
    mMuted: 'Ξέρεις τη δουλειά σου.',
    mGreen: 'Τώρα πάμε να κάνουμε την καριέρα ή την επιχείρησή σου να δουλεύει για σένα.',
    s1h: 'Ένα κακό offer θέλει καλύτερη στρατηγική. Το να αποφεύγεις ένα καλό offer είναι άλλο πρόβλημα.',
    s1deck: 'Το ίδιο ισχύει για την επόμενη κίνηση στην καριέρα, τον πελάτη που πρέπει να διώξεις ή τη συζήτηση που αναβάλλεις.',
    s1leftH: 'Business & καριέρα',
    s1left: ['Offer, positioning & GTM', 'Τιμολόγηση, πωλήσεις & πελάτες', 'Προαγωγές & επόμενες κινήσεις'],
    s1rightH: 'Ψυχολογία & σχέσεις',
    s1right: ['Φόβος, ντροπή & αποφυγή', 'Αυτοκριτική & αναβλητικότητα', 'Όρια στη δουλειά & στο σπίτι'],
    s1centre: 'Aggelos',
    s2h: 'Θα ακούσεις τη γνώμη μου.',
    s2p1: 'Κάνω όσες ερωτήσεις χρειάζονται και μετά σου λέω τι πιστεύω. Αν το offer είναι αδύναμο, το φτιάχνουμε. Αν είναι καλό και αποφεύγεις να το πουλήσεις, δουλεύουμε την αποφυγή.',
    s2p2: 'Μπορείς να πεις αυτά που συνήθως αφήνεις απ’ έξω. Δεν θα σε κρίνω και δεν θα κάνω πως η εξήγησή σου βγάζει νόημα, αν δεν βγάζει.',
    s2quote: '«Έφυγα με κάτι περισσότερο από συμβουλές. Κατάλαβα ποιο ήταν πραγματικά το πρόβλημα.»',
    proof: [
      { v: '7 χρόνια', l: 'με δική μου growth consultancy' },
      { v: '100+', l: 'εταιρείες τεχνολογίας' },
      { v: '100+', l: 'συνεδρίες mentoring με founders' },
      { v: 'BACP', l: 'registered ψυχοθεραπευτής' },
    ],
    s3h: 'Συμφωνούμε σε έναν συγκεκριμένο στόχο και σε συγκεκριμένο χρονικό πλαίσιο.',
    s3body: 'Έχεις πρόσβαση σε εμένα στις συναντήσεις και στο WhatsApp ενδιάμεσα. Η συνεργασία χτίζεται γύρω από τον στόχο σου, όχι γύρω από ένα έτοιμο πρόγραμμα.',
    s4h: 'Θέλεις να δεις πώς σκέφτομαι;',
    s4read: { t: 'Διάβασε', b: 'Κείμενα για δουλειά, φιλοδοξία και ψυχολογία.' },
    s4watch: { t: 'Δες', b: 'Βίντεο, συζητήσεις και χρήσιμα rants.' },
    s4follow: { t: 'Ακολούθησε' },
    s4and: ' και ',
    finalH: 'Αν λυνόταν με περισσότερη δουλειά, μάλλον θα είχε λυθεί ήδη.',
    finalCta: 'Κάνε αίτηση για μία πρώτη συνάντηση',
    confidentiality: 'Εμπιστευτικότητα',
  },
};

// ─── Why Me copy — verbatim from the approved implementation brief ─────────────
const WHY_V2 = {
  en: {
    label: 'WHY ME',
    h1: 'I spent most of my adult life in consulting, growth and startups before I trained as a psychotherapist.',
    deck: 'Before the psychotherapy, there were seven years running a growth consultancy, work with more than 100 technology companies, corporate roles and two startups that failed.',
    fact: 'A founder or experienced professional does not have to explain how this world works to me.',
    originLabel: '01 / WHERE I STARTED',
    origin: [
      'My parents were public employees. Their advice was simple: find a stable job, keep your head down and hold onto it. There was no family money, business network or useful introduction waiting for me.',
      'I was anxious, had very few friends and communication was not a natural talent. I worked at it. From a studio in Piraeus, I built a consultancy, worked with some of the largest companies in the world and was paid to teach the work to rooms full of people.',
      'I also failed badly. Both startups failed. I do not talk to founders, freelancers or senior professionals as an observer. I know what the work feels like when your money, identity and relationships are involved.',
    ],
    hwNum: '02',
    hwH: 'Hard work took me far. It also kept me in the wrong places for too long.',
    hw: [
      'For years I used anxiety, shame and ambition as fuel. It produced results, so I kept doing it. I also chased goals I did not actually want, stayed with the wrong people and missed patterns that were damaging my work and my life.',
      'Business knowledge helped me make better commercial moves. It did not tell me why I kept forcing myself to succeed on terms I did not even want. I had to live that part, work through it and then train for it properly.',
    ],
    exNum: '03',
    exH: 'I know when you need a better business move — and when a good move is running into fear, shame or avoidance.',
    ex: [
      { l: 'If the offer is weak, I can help you fix the offer.', r: 'If the offer is good and you cannot bring yourself to sell it, I can work on that too.' },
      { l: 'If a client relationship needs better pricing or clearer boundaries, we handle both.', r: 'If the same nice-guy pattern appears with your partner, we do not pretend it is unrelated.' },
      { l: 'If you want a promotion, a side business or a different consultancy model, I can help you make the move.', r: 'We also notice when fear, shame or obligation is choosing for you.' },
    ],
    orNum: '04',
    orH: 'You do not have to translate one world into the other for me.',
    or: [
      'I ask questions, tell you what I see and challenge what does not add up. You do not have to explain the business to a therapist or hide the personal part from an adviser.',
      'You can tell me what you are embarrassed to say out loud. I will not think less of you. I will also tell you when you are avoiding the obvious or being unfair to yourself.',
    ],
    finalLabel: 'THIS IS THE WORK I NEEDED AND COULD NOT FIND.',
    finalH: 'Actionable help from someone who can work on the commercial problem and the personal one in the same conversation.',
    finalCta: 'Apply for a working session',
  },
  el: {
    label: 'ΓΙΑΤΙ ΕΜΕΝΑ',
    h1: 'Πριν εκπαιδευτώ ως ψυχοθεραπευτής, είχα περάσει το μεγαλύτερο μέρος της ενήλικης ζωής μου στο consulting, το growth και τα startups.',
    deck: 'Επτά χρόνια με δική μου growth consultancy, δουλειά με πάνω από 100 tech εταιρείες, εταιρικοί ρόλοι και δύο startups που απέτυχαν.',
    fact: 'Ένας founder ή ένας έμπειρος επαγγελματίας δεν χρειάζεται να μου εξηγήσει πώς λειτουργεί αυτός ο κόσμος.',
    originLabel: '01 / ΑΠΟ ΠΟΥ ΞΕΚΙΝΗΣΑ',
    origin: [
      'Οι γονείς μου ήταν δημόσιοι υπάλληλοι. Η συμβουλή τους ήταν απλή: βρες μια σταθερή δουλειά, κράτα το κεφάλι κάτω και πρόσεχε να μην τη χάσεις. Δεν υπήρχαν οικογενειακά λεφτά, επιχειρηματικές γνωριμίες ή άνθρωποι να μου ανοίξουν πόρτες.',
      'Ήμουν αγχώδης, είχα ελάχιστους φίλους και η επικοινωνία δεν ήταν φυσικό μου ταλέντο. Το δούλεψα. Από μια γκαρσονιέρα στον Πειραιά έφτιαξα τη δική μου consultancy, συνεργάστηκα με μερικές από τις μεγαλύτερες εταιρείες στον κόσμο και έφτασα να πληρώνομαι για να εκπαιδεύω κόσμο σε γεμάτες αίθουσες.',
      'Απέτυχα και άσχημα. Και τα δύο startups μου απέτυχαν. Δεν μιλάω σε founders, freelancers ή έμπειρα στελέχη ως παρατηρητής. Ξέρω πώς είναι όταν παίζονται τα λεφτά, η ταυτότητα και οι σχέσεις σου.',
    ],
    hwNum: '02',
    hwH: 'Η σκληρή δουλειά με πήγε μακριά. Με κράτησε όμως και για χρόνια στα λάθος μέρη.',
    hw: [
      'Για χρόνια χρησιμοποιούσα το άγχος, τη ντροπή και τη φιλοδοξία σαν καύσιμο. Έφερνε αποτελέσματα, οπότε συνέχιζα. Παράλληλα κυνηγούσα στόχους που δεν ήθελα πραγματικά, έμενα με τους λάθος ανθρώπους και δεν έβλεπα patterns που χαλούσαν και τη δουλειά και τη ζωή μου.',
      'Η γνώση του business με βοηθούσε να παίρνω καλύτερες επαγγελματικές αποφάσεις. Δεν μου εξηγούσε γιατί πίεζα τον εαυτό μου να πετύχει με όρους που δεν ήθελα καν. Αυτό χρειάστηκε να το ζήσω, να το δουλέψω και να εκπαιδευτώ σοβαρά πάνω του.',
    ],
    exNum: '03',
    exH: 'Ξέρω πότε χρειάζεται καλύτερη business κίνηση και πότε μια καλή κίνηση κολλάει πάνω σε φόβο, ντροπή ή αποφυγή.',
    ex: [
      { l: 'Αν το offer δεν στέκει, μπορώ να σε βοηθήσω να το φτιάξεις.', r: 'Αν είναι καλό και δεν μπορείς να βγεις να το πουλήσεις, μπορώ να δουλέψω και αυτό.' },
      { l: 'Αν μια σχέση με πελάτη χρειάζεται καλύτερη τιμολόγηση ή πιο καθαρά όρια, πιάνουμε και τα δύο.', r: 'Αν το ίδιο nice-guy pattern εμφανίζεται και με τον σύντροφό σου, δεν κάνουμε πως είναι άσχετο.' },
      { l: 'Αν θέλεις προαγωγή, side business ή διαφορετικό μοντέλο για την consultancy σου, δουλεύουμε την κίνηση.', r: 'Προσέχουμε επίσης πότε διαλέγει για εσένα ο φόβος, η ντροπή ή το «πρέπει».' },
    ],
    orNum: '04',
    orH: 'Δεν χρειάζεται να μου μεταφράζεις τον έναν κόσμο στον άλλον.',
    or: [
      'Κάνω ερωτήσεις, σου λέω τι βλέπω και αμφισβητώ όσα δεν βγάζουν νόημα. Δεν χρειάζεται να εξηγείς το business σε έναν ψυχοθεραπευτή ή να κρύβεις το προσωπικό κομμάτι από έναν σύμβουλο.',
      'Μπορείς να μου πεις αυτό που ντρέπεσαι να πεις δυνατά. Δεν θα σε δω διαφορετικά. Θα σου πω όμως όταν αποφεύγεις το προφανές ή όταν αδικείς τον εαυτό σου.',
    ],
    finalLabel: 'ΑΥΤΗ ΕΙΝΑΙ Η ΔΟΥΛΕΙΑ ΠΟΥ ΧΡΕΙΑΖΟΜΟΥΝ ΚΑΙ ΔΕΝ ΜΠΟΡΟΥΣΑ ΝΑ ΒΡΩ.',
    finalH: 'Actionable βοήθεια από κάποιον που μπορεί να δουλέψει το business και το προσωπικό πρόβλημα στην ίδια συζήτηση.',
    finalCta: 'Κάνε αίτηση για μία πρώτη συνάντηση',
  },
};

// ─── Page-section CSS ────────────────────────────────────────────────────────
// Home + Why Me use the locked amx-* system (values from the approved brief,
// scoped under .amx-page so legacy routes never inherit them). Reviews keeps its
// own rev-* rules below.
const PAGE_V2_CSS = `
:root{
  --am-paper:#f3f0e8;
  --am-ink:#171919;
  --am-dark:#1b1d1d;
  --am-green:#059669;
  --am-grey:#a5aaa6;
  --am-container:1080px;
  --am-gutter:clamp(24px, 5vw, 56px);
  --am-section-space:clamp(58px, 8vw, 84px);
}
.amx-page{width:100%;overflow:clip;color:var(--am-ink);background:var(--am-paper);font-family:var(--font-body)}
.amx-page,.amx-page *{box-sizing:border-box}
.amx-container{width:min(100%, var(--am-container));margin-inline:auto;padding-inline:var(--am-gutter)}
.amx-paper{color:var(--am-ink);background:var(--am-paper)}
.amx-dark{color:var(--am-paper);background:var(--am-dark)}
.amx-green{color:var(--am-ink);background:var(--am-green)}
.amx-section{padding-block:var(--am-section-space)}
.amx-label{margin:0;color:var(--am-green);font:700 12px/1.3 var(--font-body);letter-spacing:0.07em;text-transform:uppercase}
.amx-display,.amx-heading,.amx-subheading{margin:0;color:inherit;font-synthesis:none}
.amx-display{font-family:var(--font-display);font-size:clamp(42px, 6.4vw, 64px);font-weight:400;line-height:0.98;letter-spacing:-0.045em}
html[lang^="el"] .amx-display{font-family:var(--font-heading);font-weight:800;line-height:1.04;letter-spacing:-0.035em}
.amx-heading{font-family:var(--font-heading);font-size:clamp(34px, 5vw, 52px);font-weight:800;line-height:1;letter-spacing:-0.045em}
html[lang^="el"] .amx-heading{line-height:1.04;letter-spacing:-0.035em}
.amx-subheading{font-family:var(--font-heading);font-size:24px;font-weight:800;line-height:1.08;letter-spacing:-0.025em}
html[lang^="el"] .amx-subheading{line-height:1.13;letter-spacing:-0.018em}
.amx-body{margin:0;color:inherit;font:400 17px/1.55 var(--font-body)}
html[lang^="el"] .amx-body{line-height:1.62}
.amx-button{min-height:48px;display:inline-flex;align-items:center;justify-content:center;padding-inline:21px;border:0;border-radius:0;color:#ffffff;background:var(--am-green);font:600 14px/1 var(--font-body);text-decoration:none}
.amx-button:focus-visible,.amx-content-link:focus-visible{outline:3px solid currentColor;outline-offset:4px}
.amx-section-head{display:grid;grid-template-columns:44px minmax(0, 1fr);gap:20px;align-items:start;margin-bottom:36px}
.amx-number{padding-top:4px;color:var(--am-green);font:800 16px/1 var(--font-heading);letter-spacing:-0.03em}

/* HOME HERO */
.amx-hero{display:grid;grid-template-columns:minmax(0, 1.25fr) minmax(240px, 0.75fr);gap:clamp(38px, 6vw, 72px);align-items:center;padding-block:clamp(58px, 8vw, 88px)}
.amx-hero-copy{min-width:0}
.amx-hero .amx-display{max-width:650px;margin-top:16px}
.amx-hero .amx-body{max-width:610px;margin:22px 0 26px}
.amx-hero-photo{position:relative;width:min(100%, 310px);aspect-ratio:1;justify-self:end}
.amx-hero-photo::before{content:"";position:absolute;inset:8% -4% -2% 10%;border-radius:50%;background:var(--am-green)}
.amx-hero-photo img{position:absolute;inset:0;z-index:1;width:100%;height:100%;display:block;border-radius:50%;object-fit:cover;object-position:50% 50%;filter:grayscale(1)}

/* THE WHOLE POINT */
.amx-manifesto .amx-container{padding-block:clamp(54px, 7vw, 74px)}
.amx-manifesto .amx-heading{max-width:880px;margin-top:16px}
.amx-manifesto-muted{color:var(--am-grey)}
.amx-manifesto-green{color:var(--am-green)}

/* HOME 01 */
.amx-lede{max-width:730px;margin:-14px 0 38px 64px}
.amx-duality{position:relative;width:min(100%, 860px);min-height:485px;margin-inline:auto}
.amx-circle{position:absolute;top:0;width:58%;aspect-ratio:1;display:flex;flex-direction:column;justify-content:center;border-radius:50%}
.amx-circle-left{left:0;padding:52px 150px 52px 60px;color:#ffffff;background:var(--am-dark)}
.amx-circle-right{right:0;align-items:flex-end;padding:52px 60px 52px 150px;color:var(--am-ink);background:var(--am-green);text-align:right}
.amx-circle .amx-subheading{max-width:240px}
.amx-circle-list{max-width:230px;margin:18px 0 0;padding:0;list-style:none;color:inherit;font:400 14px/1.65 var(--font-body)}
.amx-overlap-photo{position:absolute;z-index:3;top:50%;left:50%;width:138px;aspect-ratio:1;transform:translate(-50%, -50%);overflow:hidden;border:8px solid var(--am-paper);border-radius:50%;background:var(--am-dark)}
.amx-overlap-photo img{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 18%}
.amx-overlap-label{position:absolute;z-index:4;top:calc(50% + 84px);left:50%;min-width:126px;padding:8px 12px;transform:translateX(-50%);color:#ffffff;background:var(--am-dark);font:600 11px/1 var(--font-body);text-align:center;text-transform:uppercase}

/* HOME 02 */
.amx-opinion{display:grid;grid-template-columns:minmax(230px, 0.75fr) minmax(0, 1.25fr);margin-left:64px}
.amx-opinion-photo{min-height:390px;overflow:hidden;background:var(--am-dark)}
.amx-opinion-photo img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}
.amx-opinion-copy{padding:clamp(30px, 5vw, 48px);color:var(--am-ink);background:var(--am-paper)}
.amx-opinion-copy .amx-body + .amx-body{margin-top:18px}
.amx-quote{margin-top:28px;padding-top:24px;border-top:2px solid var(--am-green);color:var(--am-ink);font-family:var(--font-heading);font-size:26px;font-weight:800;line-height:1.1;letter-spacing:-0.025em}
.amx-proof{display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));margin-top:34px;border-top:1px solid rgb(243 240 232 / 18%);border-bottom:1px solid rgb(243 240 232 / 18%)}
.amx-proof-item{min-height:104px;display:flex;flex-direction:column;justify-content:center;padding:20px;border-right:1px solid rgb(243 240 232 / 18%)}
.amx-proof-item:last-child{border-right:0}
.amx-proof-value{color:var(--am-green);font:800 22px/1 var(--font-heading)}
.amx-proof-label{margin-top:8px;color:var(--am-paper);font:400 12px/1.35 var(--font-body)}

/* HOME 03 */
.amx-engagement-grid{display:grid;grid-template-columns:44px minmax(0, 720px);gap:20px}
.amx-engagement-copy .amx-body{max-width:680px;margin-top:24px}

/* HOME 04 */
.amx-content-links{display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));margin-left:64px;border-top:1px solid rgb(243 240 232 / 20%)}
.amx-content-link{min-height:190px;display:flex;flex-direction:column;justify-content:space-between;padding:26px 24px;color:var(--am-paper);border-right:1px solid rgb(243 240 232 / 20%);text-decoration:none}
.amx-content-link:last-child{border-right:0}
.amx-content-link .amx-body{color:var(--am-grey);font-size:15px}
.amx-content-link .amx-body a{color:var(--am-green);text-decoration:underline;text-underline-offset:3px}
.amx-content-arrow{color:var(--am-green);font-size:22px}

/* FINAL CTA */
.amx-final{text-align:center}
.amx-final .amx-heading{max-width:770px;margin-inline:auto}
.amx-final .amx-button{margin-top:28px}
.amx-final-link{display:block;margin-top:18px;color:#626764;font:400 13px/1.4 var(--font-body)}

/* WHY ME */
.amx-why-hero{padding-block:clamp(62px, 8vw, 88px)}
.amx-why-hero .amx-display{max-width:920px;margin-top:16px}
.amx-why-hero .amx-body{max-width:800px;margin-top:24px}
.amx-fact-bar{padding-block:24px}
.amx-fact-bar .amx-body{font-weight:600}
.amx-story-grid{display:grid;grid-template-columns:150px minmax(0, 700px);gap:36px;justify-content:center}
.amx-story-copy .amx-body + .amx-body{margin-top:22px}
.amx-reading-copy{max-width:750px;margin:28px 0 0 64px}
.amx-reading-copy .amx-body + .amx-body{margin-top:20px}
.amx-case-list{margin-left:64px;border-top:1px solid rgb(243 240 232 / 20%)}
.amx-case{display:grid;grid-template-columns:1fr 1fr;gap:34px;padding-block:26px;border-bottom:1px solid rgb(243 240 232 / 20%)}
.amx-case .amx-body:last-child{color:var(--am-green)}

@media (min-width: 721px) and (max-width: 840px){
  .amx-duality{min-height:410px}
  .amx-circle-left{padding:42px 110px 42px 42px}
  .amx-circle-right{padding:42px 42px 42px 110px}
  .amx-circle .amx-subheading{font-size:21px}
  .amx-circle-list{font-size:13px}
}
@media (max-width: 720px){
  .amx-hero{grid-template-columns:1fr}
  .amx-hero-photo{width:min(72%, 280px);justify-self:center}
  .amx-section-head,.amx-engagement-grid{grid-template-columns:1fr;gap:14px}
  .amx-lede,.amx-opinion,.amx-content-links,.amx-reading-copy,.amx-case-list{margin-left:0}
  .amx-opinion,.amx-proof,.amx-content-links,.amx-case{grid-template-columns:1fr}
  .amx-proof-item,.amx-content-link{border-right:0;border-bottom:1px solid rgb(243 240 232 / 18%)}
  .amx-proof-item:last-child,.amx-content-link:last-child{border-bottom:0}
  .amx-opinion-photo{min-height:320px}
  .amx-story-grid{grid-template-columns:1fr;gap:18px}
  .amx-duality{min-height:clamp(510px, 95vw, 650px)}
  .amx-circle{width:min(90%, 430px);left:50%;right:auto;transform:translateX(-50%)}
  .amx-circle-left{top:0;padding:46px 115px 110px 46px}
  .amx-circle-right{top:clamp(170px, 32vw, 235px);padding:115px 46px 46px 115px}
  .amx-overlap-photo{top:clamp(225px, 46vw, 331px)}
  .amx-overlap-label{top:clamp(307px, calc(46vw + 82px), 413px)}
}
@media (max-width: 470px){
  .amx-display{font-size:clamp(38px, 12vw, 48px)}
  .amx-heading{font-size:clamp(32px, 10vw, 42px)}
  .amx-circle .amx-subheading{font-size:20px}
  .amx-circle-list{font-size:12px}
  .amx-circle-left{padding-left:34px;padding-right:100px}
  .amx-circle-right{padding-right:34px;padding-left:100px}
}

/* ── Reviews (no giant opening testimonial) ── */
.rev-hero{background:${V2.paper};padding-block:80px 56px}
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
@media (max-width:900px){.rev-hero{padding-block:56px 48px}.rev-hero__grid{grid-template-columns:1fr;gap:28px}}
@media (max-width:800px){.rev-grid{grid-template-columns:1fr}.rev-lead p{font-size:22px}}
`;
function PageV2Styles() {
  return React.createElement('style', { dangerouslySetInnerHTML: { __html: PAGE_V2_CSS } });
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePageV2({ lang = 'en' }) {
  const c = HOME_V2[lang] || HOME_V2.en;
  const P = window.cPath;
  const diag = P('diagnostic', lang);
  const conf = P('confidentiality', lang);
  const E = window.EXTERNAL;
  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'home', lang }),
    React.createElement('main', { className: 'amx-page' },

      // Hero — off-white
      React.createElement('section', { className: 'amx-paper' },
        React.createElement('div', { className: 'amx-container amx-hero' },
          React.createElement('div', { className: 'amx-hero-copy' },
            React.createElement('p', { className: 'amx-label' }, c.heroEyebrow),
            React.createElement('h1', { className: 'amx-display' }, c.heroH1),
            React.createElement('p', { className: 'amx-body' }, c.heroBody),
            React.createElement('a', { className: 'amx-button', href: diag }, c.heroCta + ' →')
          ),
          React.createElement('div', { className: 'amx-hero-photo' },
            React.createElement('img', { src: '/img/aggelos-homepage.webp', alt: c.heroAlt, width: 620, height: 620, loading: 'eager', fetchpriority: 'high', decoding: 'async' })
          )
        )
      ),

      // The Whole Point — dark
      React.createElement('section', { className: 'amx-dark amx-manifesto' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('p', { className: 'amx-label' }, c.mLabel),
          React.createElement('h2', { className: 'amx-heading' },
            React.createElement('span', { className: 'amx-manifesto-muted' }, c.mMuted + ' '),
            React.createElement('span', { className: 'amx-manifesto-green' }, c.mGreen)
          )
        )
      ),

      // Section 01 — off-white, overlapping circles
      React.createElement('section', { className: 'amx-paper amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, '01'),
            React.createElement('h2', { className: 'amx-heading' }, c.s1h)
          ),
          React.createElement('p', { className: 'amx-body amx-lede' }, c.s1deck),
          React.createElement('div', { className: 'amx-duality' },
            React.createElement('div', { className: 'amx-circle amx-circle-left' },
              React.createElement('h3', { className: 'amx-subheading' }, c.s1leftH),
              React.createElement('ul', { className: 'amx-circle-list' }, c.s1left.map((x, i) => React.createElement('li', { key: i }, x)))
            ),
            React.createElement('div', { className: 'amx-circle amx-circle-right' },
              React.createElement('h3', { className: 'amx-subheading' }, c.s1rightH),
              React.createElement('ul', { className: 'amx-circle-list' }, c.s1right.map((x, i) => React.createElement('li', { key: i }, x)))
            ),
            // Overlap portrait: the supplied cutout, self-hosted; adjacent label
            // already names Aggelos, so alt is empty to avoid repetition.
            React.createElement('div', { className: 'amx-overlap-photo' },
              React.createElement('img', { src: '/img/aggelos-overlap.webp', alt: '', width: 138, height: 138, loading: 'lazy', decoding: 'async' })
            ),
            React.createElement('div', { className: 'amx-overlap-label' }, c.s1centre)
          )
        )
      ),

      // Section 02 — dark, opinion + proof strip
      React.createElement('section', { className: 'amx-dark amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, '02'),
            React.createElement('h2', { className: 'amx-heading' }, c.s2h)
          ),
          React.createElement('div', { className: 'amx-opinion' },
            React.createElement('div', { className: 'amx-opinion-photo' },
              React.createElement('img', { src: '/img/aggelos-continuation.jpeg', alt: '', width: 520, height: 650, loading: 'lazy', decoding: 'async' })
            ),
            React.createElement('div', { className: 'amx-opinion-copy' },
              React.createElement('p', { className: 'amx-body' }, c.s2p1),
              React.createElement('p', { className: 'amx-body' }, c.s2p2),
              React.createElement('blockquote', { className: 'amx-quote' }, c.s2quote)
            )
          ),
          React.createElement('div', { className: 'amx-proof' },
            c.proof.map((p, i) => React.createElement('div', { className: 'amx-proof-item', key: i },
              React.createElement('div', { className: 'amx-proof-value' }, p.v),
              React.createElement('div', { className: 'amx-proof-label' }, p.l)
            ))
          )
        )
      ),

      // Section 03 — off-white, engagement
      React.createElement('section', { className: 'amx-paper amx-section' },
        React.createElement('div', { className: 'amx-container amx-engagement-grid' },
          React.createElement('div', { className: 'amx-number' }, '03'),
          React.createElement('div', { className: 'amx-engagement-copy' },
            React.createElement('h2', { className: 'amx-heading' }, c.s3h),
            React.createElement('p', { className: 'amx-body' }, c.s3body)
          )
        )
      ),

      // Section 04 — dark, Read / Watch / Follow (three equal columns)
      React.createElement('section', { className: 'amx-dark amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, '04'),
            React.createElement('h2', { className: 'amx-heading' }, c.s4h)
          ),
          React.createElement('div', { className: 'amx-content-links' },
            React.createElement('a', { className: 'amx-content-link', href: E.undisguised, ...v2Ext },
              React.createElement('div', null,
                React.createElement('h3', { className: 'amx-subheading' }, c.s4read.t),
                React.createElement('p', { className: 'amx-body' }, c.s4read.b)),
              React.createElement('span', { className: 'amx-content-arrow' }, '↗')
            ),
            React.createElement('a', { className: 'amx-content-link', href: E.youtube, ...v2Ext },
              React.createElement('div', null,
                React.createElement('h3', { className: 'amx-subheading' }, c.s4watch.t),
                React.createElement('p', { className: 'amx-body' }, c.s4watch.b)),
              React.createElement('span', { className: 'amx-content-arrow' }, '↗')
            ),
            React.createElement('div', { className: 'amx-content-link' },
              React.createElement('div', null,
                React.createElement('h3', { className: 'amx-subheading' }, c.s4follow.t),
                React.createElement('p', { className: 'amx-body' },
                  React.createElement('a', { href: E.linkedin, ...v2Ext }, 'LinkedIn'), ', ',
                  React.createElement('a', { href: E.instagram, ...v2Ext }, 'Instagram'), c.s4and,
                  React.createElement('a', { href: E.tiktok, ...v2Ext }, 'TikTok'), '.'
                )
              )
            )
          )
        )
      ),

      // Final CTA — off-white
      React.createElement('section', { className: 'amx-paper amx-section amx-final' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('h2', { className: 'amx-heading' }, c.finalH),
          React.createElement('a', { className: 'amx-button', href: diag }, c.finalCta + ' →'),
          React.createElement('a', { className: 'amx-final-link', href: conf }, c.confidentiality + ' →')
        )
      )
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

// ─── WHY ME (route stays /about/) ────────────────────────────────────────────
function AboutPageV2({ lang = 'en' }) {
  const c = WHY_V2[lang] || WHY_V2.en;
  const diag = window.cPath('diagnostic', lang);
  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'about', lang }),
    React.createElement('main', { className: 'amx-page' },

      // Hero — off-white
      React.createElement('section', { className: 'amx-paper' },
        React.createElement('div', { className: 'amx-container amx-why-hero' },
          React.createElement('p', { className: 'amx-label' }, c.label),
          React.createElement('h1', { className: 'amx-display' }, c.h1),
          React.createElement('p', { className: 'amx-body' }, c.deck)
        )
      ),

      // Fact bar — green
      React.createElement('section', { className: 'amx-green amx-fact-bar' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('p', { className: 'amx-body' }, c.fact)
        )
      ),

      // Origin — dark
      React.createElement('section', { className: 'amx-dark amx-section' },
        React.createElement('div', { className: 'amx-container amx-story-grid' },
          React.createElement('p', { className: 'amx-label' }, c.originLabel),
          React.createElement('div', { className: 'amx-story-copy' },
            c.origin.map((p, i) => React.createElement('p', { className: 'amx-body', key: i }, p))
          )
        )
      ),

      // Hard work — off-white
      React.createElement('section', { className: 'amx-paper amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, c.hwNum),
            React.createElement('h2', { className: 'amx-heading' }, c.hwH)
          ),
          React.createElement('div', { className: 'amx-reading-copy' },
            c.hw.map((p, i) => React.createElement('p', { className: 'amx-body', key: i }, p))
          )
        )
      ),

      // Examples — dark
      React.createElement('section', { className: 'amx-dark amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, c.exNum),
            React.createElement('h2', { className: 'amx-heading' }, c.exH)
          ),
          React.createElement('div', { className: 'amx-case-list' },
            c.ex.map((row, i) => React.createElement('div', { className: 'amx-case', key: i },
              React.createElement('p', { className: 'amx-body' }, row.l),
              React.createElement('p', { className: 'amx-body' }, row.r)
            ))
          )
        )
      ),

      // One room — off-white
      React.createElement('section', { className: 'amx-paper amx-section' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('div', { className: 'amx-section-head' },
            React.createElement('div', { className: 'amx-number' }, c.orNum),
            React.createElement('h2', { className: 'amx-heading' }, c.orH)
          ),
          React.createElement('div', { className: 'amx-reading-copy' },
            c.or.map((p, i) => React.createElement('p', { className: 'amx-body', key: i }, p))
          )
        )
      ),

      // Final CTA — dark
      React.createElement('section', { className: 'amx-dark amx-section amx-final' },
        React.createElement('div', { className: 'amx-container' },
          React.createElement('p', { className: 'amx-label' }, c.finalLabel),
          React.createElement('h2', { className: 'amx-heading', style: { marginTop: 16 } }, c.finalH),
          React.createElement('a', { className: 'amx-button', href: diag }, c.finalCta + ' →')
        )
      )
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
// Restrained reviewer avatar: self-hosted grayscale photo layered over initials.
// If the photo is missing or fails to load, the initials remain (never a fake face).
function RevAvatar({ photo, name }) {
  const [failed, setFailed] = React.useState(false);
  const initials = String(name || '').trim().split(/\s+/).slice(0, 2).map((s) => s[0] || '').join('').toUpperCase();
  return React.createElement('span', { className: 'rev-avatar', 'aria-hidden': 'true' },
    React.createElement('span', { className: 'rev-avatar__i' }, initials),
    (photo && !failed) ? React.createElement('img', {
      className: 'rev-avatar__img', src: photo, alt: '', loading: 'lazy', decoding: 'async',
      width: 120, height: 120, onError: () => setFailed(true),
    }) : null
  );
}
function RevQuote({ t, lang, toggleLabel, cls }) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  // Only offer the original-English toggle when a distinct Greek translation exists
  // (the named GrowthMentor reviews are English-only, so no toggle for those).
  const hasOrig = el && toggleLabel && t.qEl && t.qEl !== t.q;
  return React.createElement('div', { className: cls },
    React.createElement('p', null, '“' + (el ? t.qEl : t.q) + '”'),
    React.createElement('div', { className: 'rev-cred' },
      t.name ? React.createElement(RevAvatar, { photo: t.photo, name: t.name }) : null,
      React.createElement('div', { className: 'who' }, el ? t.wEl : t.w)
    ),
    hasOrig ? React.createElement('button', {
      type: 'button', onClick: () => setOpen(!open), 'aria-expanded': open ? 'true' : 'false',
    }, toggleLabel + ' ' + (open ? '↑' : '↓')) : null,
    hasOrig && open ? React.createElement('p', { className: 'orig' }, '“' + t.q + '”') : null
  );
}
function ReviewsPageV2({ lang = 'en', copy }) {
  const c = (copy && copy.reviews) || {};
  const items = arr(copy && copy.reviewItems);
  const first = items[0];
  const rest = items.slice(1);
  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'reviews', lang }),
    React.createElement('main', null,
      React.createElement('section', { className: 'rev-hero' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'rev-hero__grid' },
            React.createElement('h1', null, c.h1),
            React.createElement('div', null,
              React.createElement('p', { className: 'rev-hero__lead' }, c.lead),
              React.createElement('div', { className: 'rev-hero__note' }, c.sub)
            )
          ),
          first ? React.createElement(RevQuote, { t: first, lang, toggleLabel: c.toggle, cls: 'rev-lead' }) : null
        )
      ),
      React.createElement('section', { className: 'u-main' },
        React.createElement('div', { className: 'site-container rev-grid' },
          rest.map((t, i) => React.createElement(RevQuote, { key: i, t, lang, toggleLabel: c.toggle, cls: 'rev-item' }))
        )
      ),
      React.createElement(window.BlackCtaStrip, { lang, heading: c.ctaHeading })
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

Object.assign(window, { HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS });
