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

// One credentials column for the About "Background" block: a green subsection
// label over an editorial list. Each item is a bold primary line with an
// optional quieter secondary line (institution or short descriptor).
const CredColumn = col => React.createElement('div', {
  className: 'amx-cred-col'
}, React.createElement('h3', {
  className: 'amx-cred-col__label'
}, col.label), React.createElement('ul', {
  className: 'amx-cred-list'
}, col.items.map((it, i) => React.createElement('li', {
  className: 'amx-cred',
  key: i
}, React.createElement('span', {
  className: 'amx-cred__title'
}, it.t), it.m ? React.createElement('span', {
  className: 'amx-cred__meta'
}, it.m) : null))));

// ─── Homepage copy — restored approved values (Homepage.dc.html mockup object).
// The personal first-person intro is intentionally removed (offer-first hero).
const HOME_V2 = {
  en: {
    eyebrow: 'BUSINESS & CAREER ADVISOR · BACP-REGISTERED PSYCHOTHERAPIST',
    titleL1: 'Practical help for your business, your career, and',
    titleHuman: 'the person',
    titleL2post: ' behind both.',
    titleOneLine: true,
    support: "Strategy is the easy half. I work on the decisions you keep not making, and the reasons you don't.",
    pointEyebrow: 'BEFORE YOU SCROLL',
    pointH: 'Anyone can put “advisor” in their bio.',
    points: [{
      label: '01 / BUSINESS',
      lead: 'I did the work before I started selling advice.',
      body: ['Eighteen years in product and growth. Seven of them running my own consultancy and working with 100+ tech companies. I also built two startups. Neither went well.'],
      close: 'I know business because I made the decisions and lived with the consequences.'
    }, {
      label: '02 / CAREER',
      lead: 'I built my own career before advising anyone on theirs.',
      body: ['I built it abroad, through roles in product and growth, and I still work at IBM.'],
      close: 'I did not leave a job, rebrand as a coach and start talking about a career I never had.'
    }, {
      label: '03 / TRAINING',
      lead: 'I am not just a guy with too much confidence.',
      body: ['My training includes an MSc in Integrative Counselling & Psychotherapy from the University of Derby, a Graduate Certificate in Psychology, supervised practice and five years of experience doing this work.'],
      close: 'I do not improvise the psychological part.'
    }, {
      label: '04 / REACH',
      lead: 'I am not a social media personality or an influencer.',
      body: ['A large audience proves you have found a way to earn attention.', 'Being good at the work and being good at attracting attention are two completely different skills.'],
      close: 'If you want a performer, there are better choices.'
    }, {
      label: '05 / BUSINESS → PSYCHOLOGY',
      lead: 'You do not have to leave the psychological part out.',
      body: ['If you come for business advisory, you also get the psychological work that often matters more than the strategy.']
    }, {
      label: '06 / PSYCHOLOGY → BUSINESS',
      lead: 'You do not have to leave the business context out.',
      body: ['If you come for psychotherapeutic work, we will not spend months getting me to understand how your business or career works.']
    }],
    logoLabel: 'WORK WITH 100+ TECHNOLOGY COMPANIES',
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
    eyebrow: 'ΣΥΜΒΟΥΛΟΣ ΕΠΙΧΕΙΡΗΣΕΩΝ & ΚΑΡΙΕΡΑΣ · ΨΥΧΟΘΕΡΑΠΕΥΤΗΣ',
    titleL1: 'Κάνε scale το business.',
    titleL2pre: 'Δούλεψε ό,τι σε ',
    titleHuman: 'κρατάει πίσω',
    titleL2post: '.',
    support: 'Business strategy και ψυχολογική δουλειά για founders, freelancers και ανεξάρτητους επαγγελματίες που θέλουν να χτίσουν κάτι μεγαλύτερο, χωρίς να τους φρενάρουν οι φόβοι, οι συνήθειες και τα ίδια επαναλαμβανόμενα μοτίβα.',
    pointEyebrow: 'ΠΡΙΝ ΠΡΟΧΩΡΗΣΕΙΣ',
    pointH: 'Ο καθένας μπορεί να γράψει «advisor» στο bio του.',
    points: [{
      label: '01 / BUSINESS',
      lead: 'Έκανα τη δουλειά πριν αρχίσω να πουλάω συμβουλές.',
      body: ['18 χρόνια σε product και growth. Επτά από αυτά με δική μου consultancy και συνεργασίες με 100+ εταιρείες τεχνολογίας. Έστησα επίσης δύο startups, που όμως δεν πήγαν καλά.'],
      close: 'Ξέρω το business επειδή πήρα αποφάσεις και έφαγα τις συνέπειές τους.'
    }, {
      label: '02 / ΚΑΡΙΕΡΑ',
      lead: 'Έχτισα τη δική μου καριέρα πριν αρχίσω να συμβουλεύω άλλους για τη δική τους.',
      body: ['Την έχτισα στο εξωτερικό, μέσα από ρόλους σε product και growth, και συνεχίζω να δουλεύω στην IBM.'],
      close: 'Δεν άφησα μια δουλειά, έκανα rebrand σε coach και άρχισα να μιλάω για μια καριέρα που δεν είχα ποτέ.'
    }, {
      label: '03 / ΕΚΠΑΙΔΕΥΣΗ',
      lead: 'Δεν είμαι απλά ένας τύπος με υπερβολική αυτοπεποίθηση.',
      body: ['Η εκπαίδευσή μου περιλαμβάνει MSc Integrative Counselling & Psychotherapy από το University of Derby, Graduate Certificate in Psychology, εποπτευόμενη πρακτική και ήδη πέντε χρόνια εμπειρίας σε αυτή τη δουλειά.'],
      close: 'Στο ψυχολογικό μέρος δεν αυτοσχεδιάζω.'
    }, {
      label: '04 / REACH',
      lead: 'Δεν είμαι social media personality ή influencer.',
      body: ['Το μεγάλο κοινό αποδεικνύει ότι έχεις βρει τρόπο να κερδίζεις την προσοχή.', 'Το να είσαι καλός στη δουλειά και το να ξέρεις να κερδίζεις την προσοχή είναι δύο τελείως διαφορετικά skills.'],
      close: 'Αν ψάχνεις performer, υπάρχουν καλύτερες επιλογές.'
    }, {
      label: '05 / BUSINESS → ΨΥΧΟΛΟΓΙΑ',
      lead: 'Δεν χρειάζεται να αφήσεις το ψυχολογικό κομμάτι απ’ έξω.',
      body: ['Αν έρχεσαι για business advisory, παίρνεις και το ψυχολογικό κομμάτι, που συχνά αποδεικνύεται πιο σημαντικό από τη στρατηγική.']
    }, {
      label: '06 / ΨΥΧΟΛΟΓΙΑ → BUSINESS',
      lead: 'Δεν χρειάζεται να αφήσεις το business κομμάτι απ’ έξω.',
      body: ['Αν έρχεσαι για ψυχοθεραπευτική δουλειά, δεν θα χρειαστούν αιώνες για να μου εξηγήσεις πώς λειτουργεί το business ή η καριέρα σου.']
    }],
    logoLabel: 'ΣΥΝΕΡΓΑΣΙΕΣ ΜΕ 100+ ΕΤΑΙΡΕΙΕΣ ΤΕΧΝΟΛΟΓΙΑΣ',
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

// ─── Homepage "Work with me" + "Start here for free" (EN homepage only) ───────
// Approved homepage sections (design: "Work with me + Start here for free").
// Copy is sentence-case per the design; the three offer routes and the five
// clarity-tool routes are the canonical ones already implemented in the site.
const HOME_OFFERS = [{
  name: 'Psychotherapy / decision coaching',
  kicker: '1:1 private work',
  desc: "For the decision you've already made three times and still haven't acted on.",
  href: '/psychotherapy-decision-coaching/'
}, {
  name: 'Career strategy consulting',
  kicker: '1:1 private work',
  desc: 'Build the thing people pay for before you hand in your notice.',
  href: '/career-strategy-consulting/'
}, {
  name: 'Solo business growth consulting',
  kicker: '1:1 private work',
  desc: 'For when the business only grows as far as your own stamina goes.',
  href: '/solopreneur-growth-consulting/'
}];
const HOME_TOOLS = [{
  name: "What's limiting your business?",
  href: '/clarity-tools/business-constraint/'
}, {
  name: 'Is it a strategy or execution problem?',
  href: '/clarity-tools/strategy-or-execution/'
}, {
  name: "What's making you want to quit your job?",
  href: '/clarity-tools/quit-your-job/'
}, {
  name: 'Do you want to become a solopreneur?',
  href: '/clarity-tools/become-a-solopreneur/'
}, {
  name: 'Are you burned out?',
  href: '/clarity-tools/burned-out/'
}];

// ─── Why Me copy — verbatim from the approved implementation brief ─────────────
const WHY_V2 = {
  en: {
    label: 'ABOUT ME',
    h1: 'I spent most of my adult life in consulting, growth and startups before I trained as a psychotherapist.',
    deck: 'I spent seven years running a growth consultancy, worked with more than 100 technology companies, held corporate roles and built two startups that failed, so you will not have to explain how this world works to me.',
    fact: 'A founder or experienced professional does not have to explain how this world works to me.',
    // Background / credentials — compact two-column proof that sits between the
    // hero and the 01–04 narrative. Bold primary line + quieter secondary line.
    background: {
      label: 'BACKGROUND',
      h: 'Business, behaviour and psychotherapy.',
      colA: {
        label: 'BUSINESS, PRODUCT & BEHAVIOUR',
        items: [{
          t: 'Growth Product Manager · IBM',
          m: 'Growth, PLG, product-led sales and GTM in enterprise SaaS'
        }, {
          t: '7+ years in growth and consulting'
        }, {
          t: 'Worked with 100+ technology companies'
        }, {
          t: 'Business Administration',
          m: 'University of Piraeus'
        }, {
          t: 'Designing AI Products',
          m: 'MIT'
        }, {
          t: 'Product Design',
          m: 'Ministry of Product'
        }, {
          t: 'UX Design',
          m: 'Google'
        }, {
          t: 'Jobs-to-be-Done & consumer psychology',
          m: 'Applied to SaaS product behaviour, adoption, purchasing decisions and growth'
        }, {
          t: 'Founder experience',
          m: 'Built two startups'
        }]
      },
      colB: {
        label: 'PSYCHOLOGY & THERAPY',
        items: [{
          t: 'MSc Integrative Counselling & Psychotherapy',
          m: 'University of Derby'
        }, {
          t: 'Graduate studies in Psychology',
          m: 'The American College of Greece'
        }, {
          t: 'EMDR Practitioner'
        }, {
          t: 'Somatic Shaking Practitioner',
          m: 'Body-based work with stress, emotional regulation and trauma'
        }, {
          t: 'Clinical placement · Psychiatric Clinic',
          m: 'Metaxa Cancer Hospital'
        }, {
          t: 'BACP Registered'
        }]
      }
    },
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
    label: 'ΠΟΙΟΣ ΕΙΜΑΙ',
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
/* On the dark (body-coloured) home-flow band, the small green label needs the
   lighter on-dark green to meet AA contrast (deep #047857 only passes on light). */
.home-flow .sec-label__desc{color:#10B981}
/* …except the "If we continue" block, whose label sits inside a white card —
   there the deep green is the one that passes. */
.home-flow .cont .sec-label__desc{color:#047857}

/* ── Home hero — approved copy left, stage photograph right (scaled up) ── */
.home-hero{background:${V2.white};color:${V2.heroInk}}
.home-hero__grid{width:min(100% - 64px,1280px);min-height:600px;margin-inline:auto;display:grid;grid-template-columns:minmax(0,1.22fr) minmax(380px,0.78fr);align-items:center;gap:48px;padding-block:88px 112px}
.home-hero__copy{position:relative;z-index:2;min-width:0;max-width:820px;color:${V2.heroInk}}
.home-hero__eyebrow{max-width:520px;color:${V2.green};font-family:${V2.display};font-size:13px;font-weight:700;line-height:1.35;letter-spacing:0.055em;text-transform:uppercase}
.home-hero__title{max-width:none;margin:14px 0 22px;font-family:${V2.archivo};font-synthesis:none;font-weight:400;line-height:0.9;letter-spacing:-0.055em;color:${V2.heroInk}}
.home-hero__title .home-hero__line{display:block}
html[lang="en"] .home-hero__title{font-size:clamp(46px,4.5vw,58px);text-wrap:balance}
html[lang="el"] .home-hero__title{font-size:clamp(40px,4.0vw,54px);font-family:${V2.display};font-weight:800;line-height:0.98;letter-spacing:-0.045em}
.home-hero__title .human{position:relative;z-index:0;white-space:nowrap}
.home-hero__title .human::after{content:"";position:absolute;z-index:-1;left:-0.03em;right:-0.03em;bottom:0.04em;height:0.14em;background:${V2.green}}
/* ── Rotating hero word — "business" ⇄ "career" ──────────────────────────────
   Only the final word of line 1 animates; "Scale the" and the trailing "."
   (and "Master the mind.") stay put. A hidden, in-flow sizer reserves the
   widest word's box so the baseline, line-height and width never change — the
   swap causes no layout shift. Two visible copies are absolutely stacked in
   that box and cross-fade with a subtle upward slide, looping indefinitely. */
.home-hero__rotate{position:relative;display:inline-block;vertical-align:baseline;text-align:left}
.home-hero__rotate-sizer{visibility:hidden}
.home-hero__rotate-word{position:absolute;left:0;top:0;white-space:nowrap;will-change:transform,opacity}
.home-hero__rotate-word--a{opacity:1;transform:translateY(0);animation:heroWordA 6s cubic-bezier(0.76,0,0.24,1) infinite}
.home-hero__rotate-word--b{opacity:0;transform:translateY(0.36em);animation:heroWordB 6s cubic-bezier(0.76,0,0.24,1) infinite}
.home-hero__rotate-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
@keyframes heroWordA{
  0%,40%{opacity:1;transform:translateY(0)}
  50%{opacity:0;transform:translateY(-0.36em)}
  50.01%{opacity:0;transform:translateY(0.36em)}
  90%{opacity:0;transform:translateY(0.36em)}
  100%{opacity:1;transform:translateY(0)}
}
@keyframes heroWordB{
  0%,40%{opacity:0;transform:translateY(0.36em)}
  50%{opacity:1;transform:translateY(0)}
  90%{opacity:1;transform:translateY(0)}
  100%{opacity:0;transform:translateY(-0.36em)}
}
@media (prefers-reduced-motion:reduce){
  .home-hero__rotate-word{animation:none}
  .home-hero__rotate-word--a{opacity:1;transform:none}
  .home-hero__rotate-word--b{opacity:0}
}
.home-hero__support{max-width:640px;margin:0 0 26px;color:${V2.heroInk};font-family:${V2.display};font-size:20px;font-weight:400;line-height:1.42}
.home-hero__photo{position:relative;z-index:1;width:clamp(420px,34vw,500px);max-width:100%;aspect-ratio:1;justify-self:end}
.home-hero__photo::before{content:"";position:absolute;inset:8% -3% -2% 9%;border-radius:50%;background:${V2.green}}
.home-hero__frame{position:absolute;inset:0;overflow:hidden;border-radius:50%}
.home-hero__frame img{width:100%;height:100%;object-fit:cover;object-position:56% 44%;transform:scale(1.58);filter:none}
@media (max-width:1151px) and (min-width:521px){
  .home-hero__grid{grid-template-columns:1fr;gap:30px;width:100%;max-width:none;padding:64px 40px 84px;min-height:0}
  html[lang="en"] .home-hero__title{font-size:clamp(40px,6.0vw,54px);text-wrap:balance}
  html[lang="el"] .home-hero__title{font-size:clamp(34px,4.6vw,44px);text-wrap:balance}
  .home-hero__support{max-width:620px}
  .home-hero__photo{width:min(58%,380px);justify-self:center}
}
@media (max-width:520px){
  .home-hero__grid{grid-template-columns:1fr;gap:34px;width:100%;max-width:none;padding:66px 20px 80px;min-height:0}
  html[lang="en"] .home-hero__title{font-size:clamp(34px,8.6vw,44px);text-wrap:balance}
  html[lang="el"] .home-hero__title{font-size:clamp(28px,6.6vw,34px);text-wrap:balance}
  .home-hero__support{font-size:18px;line-height:1.5}
  .home-hero__photo{width:min(82%,310px);justify-self:center}
}

/* ── Manifesto — "Anyone can put advisor in their bio" (full-width dark, card grid) ── */
.home-point{width:100%;background:${V2.ink}}
.home-point__inner{padding-block:clamp(64px,8vw,96px)}
.home-point__eyebrow{font-family:${V2.body};font-size:13px;font-weight:700;line-height:1;letter-spacing:0.12em;color:#10B981}
.home-point__h{margin:20px 0 clamp(44px,5vw,72px);max-width:24ch;font-family:${V2.display};font-synthesis:none;font-size:clamp(40px,4.4vw,60px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:${V2.white};text-wrap:balance}
.home-point__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:1fr;gap:22px;align-items:stretch}
.home-point__card{height:100%;padding:clamp(28px,2.6vw,36px);border-radius:10px;display:flex;flex-direction:column;color:#181a1c}
.home-point__label{font-family:${V2.body};font-size:13px;font-weight:700;line-height:1;letter-spacing:0.1em;text-transform:uppercase}
.home-point__rule{height:1px;margin:14px 0 22px;background:rgba(24,26,28,0.24)}
.home-point__lead{margin:0;font-family:${V2.display};font-synthesis:none;font-size:clamp(24px,1.8vw,27px);font-weight:750;line-height:1.14;letter-spacing:-0.03em;min-height:93px;text-wrap:pretty}
.home-point__text{margin-top:26px;display:flex;flex-direction:column;gap:14px}
.home-point__body{margin:0;font-size:17px;line-height:1.55;color:#282726;text-wrap:pretty}
.home-point__close{margin:0;font-size:17px;line-height:1.55;font-weight:600;color:#181a1c;text-wrap:pretty}
.home-point__card--1{background:#a7e9c9}
.home-point__card--2{background:#d8f3e5}
.home-point__card--3{background:#e9e7e2}
.home-point__card--4{background:#043d2b;color:${V2.white}}
.home-point__card--4 .home-point__rule{background:rgba(255,255,255,0.3)}
.home-point__card--4 .home-point__lead{color:${V2.white}}
.home-point__card--4 .home-point__body{color:#e6e8ea}
.home-point__card--4 .home-point__close{color:${V2.white}}
.home-point__card--5{background:#f1f9f4}
.home-point__card--6{background:#bfefda}
.home-point__logos{margin-top:clamp(56px,7vw,92px)}
.home-point__logos-label{font-family:${V2.body};font-size:13px;font-weight:700;line-height:1;letter-spacing:0.12em;color:#8b9298;text-transform:uppercase}
.home-point__logos-row{margin-top:34px;display:flex;flex-wrap:wrap;align-items:center;gap:24px 48px}
.home-point__logo{font-family:${V2.display};font-synthesis:none;font-size:20px;font-weight:700;line-height:1.1;letter-spacing:-0.01em;color:#9aa1a7;white-space:nowrap}
@media (max-width:1080px){.home-point__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:700px){.home-point__grid{grid-template-columns:1fr}.home-point__card{min-height:0}.home-point__lead{min-height:0}.home-point__logos-row{gap:20px 36px}.home-point__logo{font-size:18px}}

/* ── Section 01 — dual-field component (dark business / green psychology, portrait on the seam) ── */
.am-duality-section{overflow:hidden;padding:clamp(86px,9vw,130px) 24px clamp(101px,10.2vw,146px);background:${V2.white}}
.am-duality-section__inner{width:min(100%,1140px);margin-inline:auto}
.am-duality-section__heading{display:block;margin-bottom:clamp(62px,7vw,92px)}
.am-duality-section__title{max-width:880px;margin:0;font-family:${V2.display};font-synthesis:none;font-size:clamp(43px,4.25vw,61px);line-height:0.98;letter-spacing:-0.052em;font-weight:800;color:#181a1c}
.am-duality{--am-photo-width:clamp(224px,21.5vw,250px);--am-photo-height:clamp(382px,36.7vw,426px);position:relative;isolation:isolate;width:min(100%,1000px);min-height:360px;margin-inline:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.am-duality__side{min-width:0;min-height:360px;display:flex;align-items:center}
.am-duality__side--business{padding:52px 160px 52px 50px;background:#181a1c;color:#ffffff}
.am-duality__side--psychology{padding:52px 50px 52px 180px;background:#047857;color:#ffffff;text-align:right}
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
  .am-duality-section__title{font-size:clamp(36px,6.15vw,43px);text-wrap:balance}
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
@media (max-width:700px){
  .cont__h{font-size:clamp(32px,5.7vw,40px);text-wrap:balance}
}
@media (max-width:640px){
  .cont,.opinion__body,.media__cell{padding-inline:clamp(24px,5vw,32px)}
}

/* ── Hero CTA row — green button + quiet "Who I am" link ── */
.home-hero__ctarow{display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px}
.home-hero__who{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:${V2.ink2};border-bottom:2px solid rgba(24,26,28,0.22);padding-bottom:3px;transition:color .18s,border-color .18s}
.home-hero__who:hover{color:${V2.green};border-bottom-color:${V2.green}}

/* ── Proof strip — dark band of credentials under the hero ── */
.home-proof{background:${V2.ink};border-block:1px solid rgba(255,255,255,0.14)}
.home-proof__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px 40px;padding-block:24px}
.home-proof__item{margin:0;font-size:15px;line-height:1.4;color:${V2.onDark}}
.home-proof__item strong{font-weight:600;color:#FFFFFF}

/* ── 01 / Work with me — white section, three offers on hairlines ── */
.home-work{background:${V2.white};padding-block:clamp(64px,8vw,104px)}
.home-work__h{max-width:18ch;font-family:${V2.display};font-synthesis:none;font-size:clamp(34px,4.3vw,56px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:#181a1c;text-wrap:balance}
.home-work__grid{margin-top:clamp(40px,5vw,64px);display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:clamp(28px,3.4vw,48px)}
.home-work__item{display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding-top:24px;border-top:2px solid rgba(24,26,28,0.18);color:${V2.ink};transition:color .18s,border-color .18s}
.home-work__item:hover{color:${V2.green};border-top-color:${V2.green}}
.home-work__kicker{font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${V2.green}}
.home-work__name{font-family:${V2.display};font-synthesis:none;font-size:clamp(24px,2.2vw,29px);font-weight:750;line-height:1.1;letter-spacing:-0.032em;color:inherit;text-wrap:pretty}
.home-work__desc{max-width:30ch;font-size:17px;line-height:1.55;color:${V2.ink2};text-wrap:pretty}
.home-work__go{margin-top:6px;display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;letter-spacing:0.06em;color:${V2.green}}

/* ── 02 / Start here for free — dark section, in-page Clarity disclosure ── */
.home-free{background:${V2.ink};color:${V2.white};padding-block:clamp(64px,8vw,104px)}
.home-free .sec-label__num,.home-free .sec-label__desc{color:#10B981}
.home-free__h{max-width:22ch;font-family:${V2.display};font-synthesis:none;font-size:clamp(32px,3.7vw,46px);font-weight:800;line-height:1.04;letter-spacing:-0.042em;color:${V2.white};text-wrap:balance}
.home-free__grid{margin-top:clamp(40px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(28px,3.2vw,48px)}
.home-free__col{display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding-top:24px;border-top:2px solid rgba(255,255,255,0.18)}
a.home-free__col{color:${V2.white};transition:color .18s,border-color .18s}
a.home-free__col:hover{color:#10B981;border-top-color:#10B981}
.home-free__col--clarity{border-top-color:#10B981}
.home-free__titlerow{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.home-free__name{font-family:${V2.display};font-synthesis:none;font-size:clamp(24px,2.2vw,29px);font-weight:750;line-height:1.1;letter-spacing:-0.032em;color:inherit}
.home-free__badge{font-size:11.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#10B981}
.home-free__desc{max-width:36ch;font-size:17px;line-height:1.55;color:${V2.onDark};text-wrap:pretty}
.home-free__go{margin-top:6px;display:inline-flex;align-items:center;gap:8px;min-height:24px;font-size:14px;font-weight:700;letter-spacing:0.06em;color:#10B981}
.home-clarity__btn{margin-top:6px;display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:0;background:none;border:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;letter-spacing:0.06em;color:#10B981}
.home-clarity__caret{transition:transform .28s ease}
.home-clarity__btn[aria-expanded="true"] .home-clarity__caret{transform:rotate(180deg)}
.home-clarity-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .34s cubic-bezier(.2,.7,.2,1)}
.home-clarity-panel.is-open{grid-template-rows:1fr}
.home-clarity-panel__inner{overflow:hidden;min-height:0}
.home-clarity-panel__list{padding-top:clamp(32px,4vw,44px);opacity:0;transition:opacity .3s ease .04s;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));column-gap:clamp(28px,3.2vw,48px)}
.home-clarity-panel.is-open .home-clarity-panel__list{opacity:1}
.home-clarity__tool{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:19px 0;border-top:1px solid rgba(255,255,255,0.16);color:#F3F0E8;font-size:17px;line-height:1.35;transition:color .18s,border-color .18s}
.home-clarity__tool:hover{color:#FFFFFF;border-top-color:#10B981}
.home-clarity__tool-arw{color:#10B981;transition:transform .18s}
.home-clarity__tool:hover .home-clarity__tool-arw{transform:translateX(4px)}
@media (max-width:640px){
  .home-clarity__btn{width:100%;justify-content:space-between;min-height:52px;padding:0 16px;border:1px solid rgba(255,255,255,0.30)}
  .home-clarity-panel__list{padding-top:8px}
  .home-clarity__tool{min-height:56px;padding:14px 0}
}

:root{
  --am-paper:#f3f0e8;
  --am-surface:#ffffff;
  --am-ink:#171919;
  --am-dark:#1b1d1d;
  --am-green:#047857;
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
/* BACKGROUND — compact two-column credentials block (EN About). Reuses the amx
   type scale, Reviews' 2-col grid + hairline rule and the meta text colour, and
   is deliberately denser than the 01–04 narrative sections: it is proof, not a
   chapter. It sits on the same off-white as the hero, so its top padding is
   trimmed and the clean break is the dark 01 section that follows. */
.amx-cred-section{padding-block:clamp(30px, 3.6vw, 46px) clamp(60px, 7.8vw, 88px)}
.amx-cred-head{max-width:750px;margin-bottom:clamp(30px, 4vw, 42px)}
.amx-cred-head .amx-label + .amx-cred-h{margin-top:12px}
.amx-cred-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(40px, 5.2vw, 72px);align-items:start}
.amx-cred-col__label{margin:0 0 4px;color:var(--am-green);font:700 13px/1.3 var(--font-body);letter-spacing:0.09em;text-transform:uppercase}
.amx-cred-list{list-style:none;margin:0;padding:0}
.amx-cred{padding:14px 0}
.amx-cred + .amx-cred{border-top:1px solid ${V2.rule}}
.amx-cred__title{display:block;font:600 17px/1.32 var(--font-body);letter-spacing:-0.01em;color:var(--am-ink)}
.amx-cred__meta{display:block;margin-top:3px;font:400 15px/1.45 var(--font-body);color:${V2.meta}}
@media (max-width:800px){
  .amx-cred-grid{grid-template-columns:1fr;row-gap:clamp(30px, 6vw, 40px)}
}
@media (max-width: 600px){
  .amx-page--about .amx-display{font-size:clamp(34px, 7vw, 42px);text-wrap:balance}
  html[lang="el"] .amx-page--about .amx-display{font-size:clamp(32px, 7vw, 42px)}
  .amx-page--about .amx-heading{font-size:clamp(30px, 5.67vw, 34px);text-wrap:balance}
}
@media (max-width: 480px){
  .amx-page--about .amx-container{padding-inline:clamp(20px, 5vw, 24px)}
  .amx-page--about .amx-button{max-width:100%;padding-inline:18px;line-height:1.25;text-align:center}
  html[lang="el"] .amx-page--about .amx-button{font-size:14px}
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

/* ── About (design refresh) — beige top, white duality, dark close ── */
.ax-page{width:100%;overflow:clip;background:${V2.white};color:#171919;font-family:${V2.body}}
.ax-container{width:min(100%,1080px);margin-inline:auto;padding-inline:clamp(24px,5vw,56px)}
.ax-label{margin:0;color:${V2.green};font:700 13px/1.3 ${V2.body};letter-spacing:0.09em;text-transform:uppercase}
.ax-top{background:${V2.paper}}
.ax-hero{padding-block:clamp(64px,8vw,96px) 0}
.ax-hero__h{max-width:18ch;margin-top:20px;font-family:${V2.archivo};font-synthesis:none;font-size:clamp(36px,5.2vw,58px);font-weight:400;line-height:1.02;letter-spacing:-0.032em;color:#171919;text-wrap:balance}
.ax-hero__deck{max-width:68ch;margin-top:28px;font-size:19px;line-height:1.62;color:${V2.ink2};text-wrap:pretty}
.ax-cred{padding-block:clamp(40px,5vw,56px) clamp(64px,8vw,96px)}
.ax-cred__head{max-width:750px;padding-top:clamp(40px,5vw,56px);border-top:1px solid rgba(24,26,28,0.20)}
.ax-cred__h{margin-top:14px;font-family:${V2.display};font-synthesis:none;font-size:clamp(30px,3.8vw,42px);font-weight:750;line-height:1.04;letter-spacing:-0.032em;color:#171919}
.ax-cred__grid{margin-top:clamp(36px,4.4vw,48px);display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));column-gap:clamp(40px,5.2vw,72px);row-gap:40px;align-items:start}
.ax-cred__list{list-style:none;margin-top:12px}
.ax-cred__item{padding:16px 0}
.ax-cred__item + .ax-cred__item{border-top:1px solid rgba(24,26,28,0.20)}
.ax-cred__t{display:block;font-size:17px;font-weight:600;line-height:1.32;letter-spacing:-0.01em;color:#171919}
.ax-cred__m{display:block;margin-top:4px;font-size:15px;line-height:1.45;color:${V2.meta}}
.ax-duality{background:${V2.white};padding-block:clamp(64px,8vw,96px)}
.ax-duality__h{max-width:16ch;margin-top:14px;font-family:${V2.display};font-synthesis:none;font-size:clamp(32px,4.4vw,52px);font-weight:800;line-height:1;letter-spacing:-0.04em;color:#171919;text-wrap:balance}
.ax-duality__band{margin-top:clamp(40px,5vw,56px);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}
.ax-duality__side{padding:clamp(32px,3.6vw,48px);display:flex;flex-direction:column;justify-content:center;min-height:300px}
.ax-duality__side--business{background:#181a1c;color:#fff}
.ax-duality__side--psychology{background:${V2.green};color:#fff}
.ax-duality__k{margin:0;font-size:13px;font-weight:800;line-height:1;letter-spacing:0.075em;text-transform:uppercase}
.ax-duality__side--business .ax-duality__k{color:#10B981}
.ax-duality__s{margin:18px 0 0;font-family:${V2.display};font-size:clamp(20px,1.8vw,24px);font-weight:700;line-height:1.27;letter-spacing:-0.028em}
.ax-duality__img{display:block;width:100%;height:100%;min-height:300px;object-fit:cover;object-position:50% 20%;filter:grayscale(100%);background:#181a1c}
.ax-explain{margin-top:clamp(40px,5vw,56px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));column-gap:clamp(40px,5.2vw,72px);row-gap:24px;align-items:start}
.ax-explain__lead{margin:0;font-family:${V2.display};font-size:24px;font-weight:800;line-height:1.08;letter-spacing:-0.025em;color:#171919;text-wrap:pretty}
.ax-explain__body{display:flex;flex-direction:column;gap:20px;max-width:56ch}
.ax-explain__body p{margin:0;font-size:18px;line-height:1.62;color:${V2.ink2};text-wrap:pretty}
.ax-explain__body p.is-strong{font-weight:600;color:#171919}
.ax-why{background:${V2.ink};color:#F3F0E8;padding-block:clamp(64px,8vw,96px)}
.ax-why__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));column-gap:clamp(40px,5.2vw,72px);row-gap:32px;align-items:start}
.ax-why__rule{width:min(240px,60%);height:3px;background:#10B981}
.ax-why__h{max-width:14ch;margin-top:24px;font-family:${V2.display};font-synthesis:none;font-size:clamp(32px,4vw,46px);font-weight:800;line-height:1.02;letter-spacing:-0.04em;color:#fff;text-wrap:balance}
.ax-why__body{display:flex;flex-direction:column;gap:22px;max-width:60ch}
.ax-why__body p{margin:0;font-size:18px;line-height:1.66;color:#D7DAD8;text-wrap:pretty}
.ax-why__quote{margin:6px 0 0;padding-left:24px;border-left:3px solid #10B981;font-family:${V2.display};font-size:22px;font-weight:700;line-height:1.28;letter-spacing:-0.025em;color:#fff;text-wrap:pretty}
.ax-cta{background:${V2.ink};padding-block:clamp(56px,7vw,88px);text-align:center;border-top:1px solid rgba(243,240,232,0.16)}
.ax-cta__h{max-width:20ch;margin-inline:auto;font-family:${V2.display};font-synthesis:none;font-size:clamp(32px,4.2vw,52px);font-weight:800;line-height:1.02;letter-spacing:-0.04em;color:#fff;text-wrap:balance}
.ax-cta__btn{margin-top:36px;display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:64px;padding-inline:44px;background:${V2.green};color:#fff;font-size:16px;font-weight:700;border-radius:999px;transition:filter .18s,gap .18s}
.ax-cta__btn:hover{filter:brightness(0.9);gap:13px;color:#fff}
@media (max-width:720px){
  .ax-duality__band{grid-template-columns:1fr}
  .ax-duality__img{min-height:260px}
}
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
  // Rotating hero word (en only). The hidden sizer reserves the widest word so
  // the box, baseline and width never change — the swap causes no layout shift.
  const rotWords = c.titleRotateWords || null;
  const rotWide = rotWords ? rotWords.reduce((a, b) => b.length >= a.length ? b : a) : '';
  const titleLine1 = rotWords ? React.createElement('span', {
    className: 'home-hero__line'
  }, c.titleRotatePre, React.createElement('span', {
    className: 'home-hero__rotate',
    'aria-hidden': 'true'
  }, React.createElement('span', {
    className: 'home-hero__rotate-sizer'
  }, rotWide + c.titleRotatePost), React.createElement('span', {
    className: 'home-hero__rotate-word home-hero__rotate-word--a'
  }, rotWords[0] + c.titleRotatePost), React.createElement('span', {
    className: 'home-hero__rotate-word home-hero__rotate-word--b'
  }, rotWords[1] + c.titleRotatePost)), React.createElement('span', {
    className: 'home-hero__rotate-sr'
  }, rotWords[0] + c.titleRotatePost)) : React.createElement('span', {
    className: 'home-hero__line'
  }, c.titleL1);
  // EN positioning line flows as a single block (natural wrapping); other
  // locales keep the static line 1 + emphasised line 2 structure.
  const heroTitleChildren = c.titleOneLine ? [React.createElement('span', {
    className: 'home-hero__line',
    key: 'one'
  }, c.titleL1 + ' ', React.createElement('span', {
    className: 'human'
  }, c.titleHuman), c.titleL2post)] : [titleLine1, React.createElement('span', {
    className: 'home-hero__line',
    key: 'two'
  }, c.titleL2pre, React.createElement('span', {
    className: 'human'
  }, c.titleHuman), c.titleL2post)];

  // ── Approved homepage sections (EN only): 02 / Work with me and 05 / Start
  // here for free drop into the existing .home-flow band; the two explanatory
  // blocks renumber (02→03, 03→04) and "More from me" shrinks to a strip. ──
  const isEn = lang === 'en';
  const clarityState = React.useState(false);
  const clarityOpen = clarityState[0],
    setClarityOpen = clarityState[1];
  const clarityBtnRef = React.useRef(null);
  const clarityFirstRef = React.useRef(null);
  const clarityListRef = React.useRef(null);
  React.useEffect(function () {
    // Keep the collapsed panel out of the tab order / a11y tree while its links
    // stay in the DOM (so crawlers still find the five tools).
    if (clarityListRef.current) clarityListRef.current.inert = !clarityOpen;
    if (clarityOpen && clarityFirstRef.current) {
      try {
        clarityFirstRef.current.focus();
      } catch (e) {}
    }
  }, [clarityOpen]);
  React.useEffect(function () {
    function onKey(ev) {
      if (ev.key === 'Escape' && clarityOpen) {
        setClarityOpen(false);
        if (clarityBtnRef.current) {
          try {
            clarityBtnRef.current.focus();
          } catch (e) {}
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return function () {
      window.removeEventListener('keydown', onKey);
    };
  }, [clarityOpen]);
  const proofSection = isEn ? React.createElement('section', {
    className: 'home-proof',
    key: 'proof'
  }, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'home-proof__grid'
  }, [['18+ years', ' in product and growth'], ['100+', ' technology companies advised'], ['MSc', ' Integrative Counselling & Psychotherapy'], ['BACP', ' registered psychotherapist']].map(function (p, i) {
    return React.createElement('p', {
      className: 'home-proof__item',
      key: i
    }, React.createElement('strong', null, p[0]), p[1]);
  })))) : null;
  const workSection = isEn ? React.createElement('section', {
    className: 'home-work',
    key: 'work'
  }, React.createElement('div', {
    className: 'site-container'
  }, SecLabel('01', 'Work with me'), React.createElement('h2', {
    className: 'home-work__h'
  }, 'Three ways to work with me.'), React.createElement('div', {
    className: 'home-work__grid'
  }, HOME_OFFERS.map(function (o) {
    return React.createElement('a', {
      key: o.href,
      className: 'home-work__item',
      href: o.href,
      'aria-label': 'Explore ' + o.name
    }, o.kicker ? React.createElement('span', {
      className: 'home-work__kicker'
    }, o.kicker) : null, React.createElement('span', {
      className: 'home-work__name'
    }, o.name), React.createElement('span', {
      className: 'home-work__desc'
    }, o.desc), React.createElement('span', {
      className: 'home-work__go'
    }, 'Explore ', React.createElement('span', {
      'aria-hidden': 'true'
    }, '→')));
  })))) : null;
  const startSection = isEn ? React.createElement('section', {
    className: 'home-free',
    key: 'start'
  }, React.createElement('div', {
    className: 'site-container'
  }, SecLabel('02', 'Start here for free'), React.createElement('h2', {
    className: 'home-free__h'
  }, "You don't need to know what kind of help you need before you start."), React.createElement('div', {
    className: 'home-free__grid'
  }, React.createElement('div', {
    className: 'home-free__col home-free__col--clarity'
  }, React.createElement('div', {
    className: 'home-free__titlerow'
  }, React.createElement('span', {
    className: 'home-free__name'
  }, 'Clarity tools'), React.createElement('span', {
    className: 'home-free__badge'
  }, '5 tools')), React.createElement('span', {
    className: 'home-free__desc'
  }, 'Five short diagnostics that name the problem before you spend money solving the wrong one.'), React.createElement('button', {
    type: 'button',
    className: 'home-clarity__btn',
    ref: clarityBtnRef,
    'aria-expanded': clarityOpen ? 'true' : 'false',
    'aria-controls': 'home-clarity-panel',
    onClick: function () {
      setClarityOpen(function (v) {
        return !v;
      });
    }
  }, React.createElement('span', null, clarityOpen ? 'Hide tools' : 'Choose a tool'), React.createElement('svg', {
    className: 'home-clarity__caret',
    viewBox: '0 0 10 6',
    width: 11,
    height: 7,
    'aria-hidden': 'true'
  }, React.createElement('path', {
    d: 'M1 1l4 4 4-4',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  })))), React.createElement('a', {
    className: 'home-free__col home-free__col--wtf',
    href: '/wtf-friday/',
    'aria-label': 'Join WTF Friday'
  }, React.createElement('span', {
    className: 'home-free__name'
  }, 'WTF Friday'), React.createElement('span', {
    className: 'home-free__desc'
  }, 'Free weekly office hours. Bring one real problem, leave with a straight answer.'), React.createElement('span', {
    className: 'home-free__go'
  }, 'Join WTF Friday ', React.createElement('span', {
    'aria-hidden': 'true'
  }, '→'))), React.createElement('a', {
    className: 'home-free__col home-free__col--ask',
    href: window.cPath('ask-me-anything', lang),
    'aria-label': 'Ask me something'
  }, React.createElement('span', {
    className: 'home-free__name'
  }, 'Ask me something'), React.createElement('span', {
    className: 'home-free__desc'
  }, "Ask the thing you wouldn't put your name on. I answer selected ones publicly."), React.createElement('span', {
    className: 'home-free__go'
  }, 'Ask something ', React.createElement('span', {
    'aria-hidden': 'true'
  }, '→')))), React.createElement('div', {
    id: 'home-clarity-panel',
    className: 'home-clarity-panel' + (clarityOpen ? ' is-open' : '')
  }, React.createElement('div', {
    className: 'home-clarity-panel__inner'
  }, React.createElement('div', {
    className: 'home-clarity-panel__list',
    ref: clarityListRef
  }, HOME_TOOLS.map(function (tool, i) {
    return React.createElement('a', {
      key: tool.href,
      className: 'home-clarity__tool',
      href: tool.href,
      ref: i === 0 ? clarityFirstRef : null
    }, React.createElement('span', null, tool.name), React.createElement('span', {
      className: 'home-clarity__tool-arw',
      'aria-hidden': 'true'
    }, '→'));
  })))))) : null;
  const opinionSection = React.createElement('section', {
    key: 'opinion'
  }, React.createElement('div', {
    className: 'site-container'
  }, SecLabel(isEn ? '03' : '02', c.s02d), React.createElement('h2', {
    className: 'sec__h2l'
  }, React.createElement('span', null, c.opinionL1), React.createElement('span', null, c.opinionL2)), React.createElement('div', {
    className: 'opinion'
  }, React.createElement('img', {
    src: '/img/aggelos-continuation.webp',
    alt: c.contAlt,
    width: 900,
    height: 1125,
    loading: 'lazy',
    decoding: 'async'
  }), React.createElement('div', {
    className: 'opinion__body'
  }, c.opinionParas.map(function (p, i) {
    return React.createElement('p', {
      key: i
    }, p);
  }), React.createElement('blockquote', {
    className: 'opinion__q'
  }, c.opinionQuote)))));
  const contSection = React.createElement('section', {
    key: 'cont'
  }, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'cont'
  }, React.createElement('div', {
    className: 'cont__in'
  }, SecLabel(isEn ? '04' : '03', c.s03d), React.createElement('h2', {
    className: 'cont__h'
  }, c.contH), React.createElement('p', null, c.contP)))));
  const moreSection = isEn ? React.createElement('section', {
    key: 'more'
  }, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'home-more__label'
  }, 'More from me'), React.createElement('div', {
    className: 'home-more__links'
  }, React.createElement('a', {
    className: 'home-more__link',
    href: window.EXTERNAL.undisguised,
    ...v2Ext
  }, React.createElement('span', {
    className: 'home-more__link-main'
  }, React.createElement('span', {
    className: 'home-more__link-kicker'
  }, 'Undisguised'), React.createElement('span', {
    className: 'home-more__link-desc'
  }, c.readP)), React.createElement('span', {
    className: 'home-more__link-arw',
    'aria-hidden': 'true'
  }, '↗')), React.createElement('a', {
    className: 'home-more__link',
    href: window.EXTERNAL.youtube,
    ...v2Ext
  }, React.createElement('span', {
    className: 'home-more__link-main'
  }, React.createElement('span', {
    className: 'home-more__link-kicker'
  }, 'YouTube'), React.createElement('span', {
    className: 'home-more__link-desc'
  }, c.watchP)), React.createElement('span', {
    className: 'home-more__link-arw',
    'aria-hidden': 'true'
  }, '↗'))))) : React.createElement('section', {
    key: 'more'
  }, React.createElement('div', {
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
  }, 'YOUTUBE'), React.createElement('p', null, c.watchP))), React.createElement('a', lang === 'el' ? {
    className: 'media__cell media__ask',
    href: 'https://www.videoask.com/fuv51iuq1',
    ...v2Ext
  } : {
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
  }, '↗')), React.createElement('div', null, React.createElement('p', null, c.askP))))));
  const heroSection = React.createElement('section', {
    className: 'home-hero',
    key: 'hero'
  }, React.createElement('div', {
    className: 'home-hero__grid'
  }, React.createElement('div', {
    className: 'home-hero__copy'
  }, React.createElement('div', {
    className: 'home-hero__eyebrow'
  }, c.eyebrow), React.createElement('h1', {
    className: 'home-hero__title'
  }, heroTitleChildren), React.createElement('p', {
    className: 'home-hero__support'
  }, c.support), isEn ? React.createElement('div', {
    className: 'home-hero__ctarow'
  }, React.createElement('a', {
    className: 'hero-cta',
    href: '/start-here/'
  }, React.createElement('span', null, 'Start here'), React.createElement('span', null, '→')), React.createElement('a', {
    className: 'home-hero__who',
    href: '/about/'
  }, React.createElement('span', null, 'Who I am'), React.createElement('span', {
    'aria-hidden': 'true'
  }, '→'))) : React.createElement('a', {
    className: 'hero-cta',
    href: window.cPath('diagnostic', lang)
  }, React.createElement('span', null, t.ctaBtn), React.createElement('span', null, '→'))), React.createElement('figure', {
    className: 'home-hero__photo'
  }, React.createElement('div', {
    className: 'home-hero__frame'
  }, React.createElement('img', {
    src: '/img/aggelos-homepage.webp?v=2',
    alt: 'Aggelos Mouzakitis',
    width: 2048,
    height: 1365,
    loading: 'eager',
    fetchpriority: 'high',
    decoding: 'async'
  })))));

  // Sections that only remain on the Greek homepage (the English homepage is now
  // deliberately lean: hero → 01 Work with me → 02 Start here for free → footer).
  const homePointSection = React.createElement('section', {
    className: 'home-point',
    key: 'point'
  }, React.createElement('div', {
    className: 'site-container'
  }, React.createElement('div', {
    className: 'home-point__inner'
  }, React.createElement('div', {
    className: 'home-point__eyebrow'
  }, c.pointEyebrow), React.createElement('h2', {
    className: 'home-point__h'
  }, c.pointH), React.createElement('div', {
    className: 'home-point__grid'
  }, arr(c.points).map(function (pt, i) {
    return React.createElement('article', {
      className: 'home-point__card home-point__card--' + (i + 1),
      key: i
    }, React.createElement('div', {
      className: 'home-point__label'
    }, pt.label), React.createElement('div', {
      className: 'home-point__rule'
    }), React.createElement('p', {
      className: 'home-point__lead'
    }, pt.lead), React.createElement('div', {
      className: 'home-point__text'
    }, arr(pt.body).map(function (b, j) {
      return React.createElement('p', {
        className: 'home-point__body',
        key: j
      }, b);
    }), pt.close ? React.createElement('p', {
      className: 'home-point__close'
    }, pt.close) : null));
  })), React.createElement('div', {
    className: 'home-point__logos'
  }, React.createElement('div', {
    className: 'home-point__logos-label'
  }, c.logoLabel), React.createElement('div', {
    className: 'home-point__logos-row'
  }, ['IBM', 'Farfetch', 'GrowthMentor', 'Discover Greece', 'University of London', 'University of Oxford', 'Glofox', 'Whereby', 'Octopus Investments', 'Startupbootcamp', 'Advantage Austria', 'How to Web', 'Moosend'].map(function (name, i) {
    return React.createElement('span', {
      className: 'home-point__logo',
      key: i
    }, name);
  }))))));
  const amDualitySection = React.createElement('section', {
    className: 'am-duality-section',
    'aria-labelledby': 'am-duality-title',
    key: 'duality'
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
    src: '/img/aggelos-overlap.webp?v=2',
    alt: 'Aggelos Mouzakitis',
    width: 250,
    height: 426,
    loading: 'lazy',
    decoding: 'async'
  })))));
  const finalCta = React.createElement(window.BlackCtaStrip, {
    lang,
    heading: c.finalH
  });

  // English homepage: hero → proof strip → 01 Work with me → 02 Start here for
  // free → footer. Greek homepage keeps its full original flow until localised.
  const mainChildren = isEn ? [heroSection, proofSection, workSection, startSection] : [heroSection, homePointSection, amDualitySection, React.createElement('div', {
    className: 'home-flow',
    key: 'flow'
  }, opinionSection, contSection, moreSection), finalCta];
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'home',
    lang
  }), React.createElement('main', null, mainChildren), React.createElement(window.SiteFooterX, {
    lang
  }));
}

// ─── WHY ME (route stays /about/) ────────────────────────────────────────────
function AboutPageV2({
  lang = 'en'
}) {
  const c = WHY_V2[lang] || WHY_V2.en;
  const diag = window.cPath('diagnostic', lang);
  const isEn = lang === 'en';
  const heroSection = React.createElement('section', {
    className: 'amx-paper',
    key: 'hero'
  }, React.createElement('div', {
    className: 'amx-container amx-why-hero'
  }, React.createElement('p', {
    className: 'amx-label'
  }, c.label), React.createElement('h1', {
    className: 'amx-display'
  }, c.h1), React.createElement('p', {
    className: 'amx-body'
  }, c.deck)));

  // Short résumé / credentials (EN keeps the two-column proof; EL keeps the fact bar).
  const credOrFact = c.background ? React.createElement('section', {
    className: 'amx-paper amx-cred-section',
    key: 'cred'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('div', {
    className: 'amx-cred-head'
  }, React.createElement('p', {
    className: 'amx-label'
  }, c.background.label), React.createElement('h2', {
    className: 'amx-subheading amx-cred-h'
  }, c.background.h)), React.createElement('div', {
    className: 'amx-cred-grid'
  }, CredColumn(c.background.colA), CredColumn(c.background.colB)))) : React.createElement('section', {
    className: 'amx-green amx-fact-bar',
    key: 'fact'
  }, React.createElement('div', {
    className: 'amx-container'
  }, React.createElement('p', {
    className: 'amx-body'
  }, c.fact)));
  let aboutMainChildren;
  let aboutMainClass;
  if (isEn) {
    aboutMainClass = 'ax-page';
    const b = c.background;
    const credCol = function (col) {
      return React.createElement('div', {
        key: col.label
      }, React.createElement('p', {
        className: 'ax-label'
      }, col.label), React.createElement('ul', {
        className: 'ax-cred__list'
      }, col.items.map(function (it, i) {
        return React.createElement('li', {
          className: 'ax-cred__item',
          key: i
        }, React.createElement('span', {
          className: 'ax-cred__t'
        }, it.t), it.m ? React.createElement('span', {
          className: 'ax-cred__m'
        }, it.m) : null);
      })));
    };
    // Beige top: hero + short résumé / credentials.
    const topSection = React.createElement('section', {
      className: 'ax-top',
      key: 'top'
    }, React.createElement('div', {
      className: 'ax-container ax-hero'
    }, React.createElement('p', {
      className: 'ax-label'
    }, c.label), React.createElement('h1', {
      className: 'ax-hero__h'
    }, c.h1), React.createElement('p', {
      className: 'ax-hero__deck'
    }, c.deck)), React.createElement('div', {
      className: 'ax-container ax-cred'
    }, React.createElement('div', {
      className: 'ax-cred__head'
    }, React.createElement('p', {
      className: 'ax-label'
    }, b.label), React.createElement('h2', {
      className: 'ax-cred__h'
    }, b.h)), React.createElement('div', {
      className: 'ax-cred__grid'
    }, credCol(b.colA), credCol(b.colB))));
    // White: Business ← portrait → Psychology + why the two interact.
    const dualitySection = React.createElement('section', {
      className: 'ax-duality',
      'aria-labelledby': 'ax-duality-title',
      key: 'duality'
    }, React.createElement('div', {
      className: 'ax-container'
    }, React.createElement('p', {
      className: 'ax-label'
    }, 'Business + psychology'), React.createElement('h2', {
      className: 'ax-duality__h',
      id: 'ax-duality-title'
    }, 'Why I sit between two professional worlds.'), React.createElement('div', {
      className: 'ax-duality__band'
    }, React.createElement('div', {
      className: 'ax-duality__side ax-duality__side--business'
    }, React.createElement('p', {
      className: 'ax-duality__k'
    }, 'Business'), React.createElement('p', {
      className: 'ax-duality__s'
    }, 'I spent most of my career here.')), React.createElement('img', {
      className: 'ax-duality__img',
      src: '/img/aggelos-overlap.webp?v=2',
      alt: 'Aggelos Mouzakitis',
      width: 250,
      height: 426,
      loading: 'lazy',
      decoding: 'async'
    }), React.createElement('div', {
      className: 'ax-duality__side ax-duality__side--psychology'
    }, React.createElement('p', {
      className: 'ax-duality__k'
    }, 'Psychology'), React.createElement('p', {
      className: 'ax-duality__s'
    }, 'I trained here because business knowledge was not enough.'))), React.createElement('div', {
      className: 'ax-explain'
    }, React.createElement('p', {
      className: 'ax-explain__lead'
    }, 'Most problems I work on do not stay neatly on one side.'), React.createElement('div', {
      className: 'ax-explain__body'
    }, React.createElement('p', null, 'A pricing problem can involve fear of rejection. A career decision can be commercially rational and psychologically difficult. A business can have the right strategy and an owner who keeps avoiding it.'), React.createElement('p', {
      className: 'is-strong'
    }, 'That is why I work with both.')))));
    // Dark: why I ended up here.
    const whySection = React.createElement('section', {
      className: 'ax-why',
      key: 'why'
    }, React.createElement('div', {
      className: 'ax-container'
    }, React.createElement('div', {
      className: 'ax-why__grid'
    }, React.createElement('div', null, React.createElement('div', {
      className: 'ax-why__rule'
    }), React.createElement('h2', {
      className: 'ax-why__h'
    }, 'Why I ended up here')), React.createElement('div', {
      className: 'ax-why__body'
    }, React.createElement('p', null, 'I built a consultancy, worked with more than 100 technology companies and built two startups that failed. For years, being useful, reasonable and easy to work with helped me professionally. It also made it easier to avoid conflict, accept things I did not want and stay too long in the wrong places.'), React.createElement('p', null, "Knowing more about business did not explain why approval, fear or other people's reactions could still influence decisions that looked perfectly rational on paper. That gap is part of why I trained as a psychotherapist."), React.createElement('p', {
      className: 'ax-why__quote'
    }, 'Today I work with both sides of the problem when both sides matter.')))));
    // Dark closing CTA.
    const ctaSection = React.createElement('section', {
      className: 'ax-cta',
      key: 'cta'
    }, React.createElement('div', {
      className: 'ax-container'
    }, React.createElement('h2', {
      className: 'ax-cta__h'
    }, 'Not sure which conversation you need?'), React.createElement('a', {
      className: 'ax-cta__btn',
      href: '/start-here/'
    }, 'Start here →')));
    aboutMainChildren = [topSection, dualitySection, whySection, ctaSection];
  } else {
    aboutMainClass = 'amx-page amx-page--about';
    aboutMainChildren = [heroSection, credOrFact, React.createElement('section', {
      className: 'amx-dark amx-section',
      key: 'origin'
    }, React.createElement('div', {
      className: 'amx-container amx-story-grid'
    }, SecLabel(c.originNum, c.originDesc), React.createElement('div', {
      className: 'amx-story-copy'
    }, c.origin.map(function (p, i) {
      return React.createElement('p', {
        className: 'amx-body',
        key: i
      }, p);
    })))), React.createElement('section', {
      className: 'amx-paper amx-section',
      key: 'hw'
    }, React.createElement('div', {
      className: 'amx-container'
    }, React.createElement('div', {
      className: 'amx-section-head'
    }, SecLabel(c.hwNum, c.hwDesc), React.createElement('h2', {
      className: 'amx-heading'
    }, c.hwH)), React.createElement('div', {
      className: 'amx-reading-copy'
    }, c.hw.map(function (p, i) {
      return React.createElement('p', {
        className: 'amx-body',
        key: i
      }, p);
    })))), React.createElement('section', {
      className: 'amx-dark amx-section',
      key: 'ex'
    }, React.createElement('div', {
      className: 'amx-container'
    }, React.createElement('div', {
      className: 'amx-section-head'
    }, SecLabel(c.exNum, c.exDesc), React.createElement('h2', {
      className: 'amx-heading'
    }, c.exH)), React.createElement('div', {
      className: 'amx-reading-copy'
    }, c.ex.map(function (p, i) {
      return React.createElement('p', {
        className: 'amx-body',
        key: i
      }, p);
    })))), React.createElement('section', {
      className: 'amx-paper amx-section',
      key: 'or'
    }, React.createElement('div', {
      className: 'amx-container'
    }, React.createElement('div', {
      className: 'amx-section-head'
    }, SecLabel(c.orNum, c.orDesc), React.createElement('h2', {
      className: 'amx-heading'
    }, c.orH)), React.createElement('div', {
      className: 'amx-reading-copy'
    }, c.or.map(function (p, i) {
      return React.createElement('p', {
        className: 'amx-body',
        key: i
      }, p);
    })))), React.createElement('section', {
      className: 'amx-dark amx-section amx-final',
      key: 'cta'
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
    }, c.finalCta + ' →')))];
  }
  return React.createElement(React.Fragment, null, React.createElement(window.ChromeStyles), React.createElement(PageV2Styles), React.createElement(window.SiteHeader, {
    page: 'about',
    lang
  }), React.createElement('main', {
    className: aboutMainClass
  }, aboutMainChildren), React.createElement(window.SiteFooterX, {
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
