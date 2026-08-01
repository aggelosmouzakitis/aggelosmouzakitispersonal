/*
 * SOMO — English copy.
 * Natural English, not a literal translation of the Greek. Product names stay
 * in English. Same writing rules: no em dashes, no exclamation marks, no
 * rhetorical triads, no AI clichés, careful claims.
 */
module.exports = {
  htmlLang: "en",

  common: {
    soon: "Coming soon",
    skip: "Skip to content",
    faqEyebrow: "FAQ",
    viewAllEvents: "View all events",
    viewExperiences: "View upcoming experiences",
    viewCircles: "View upcoming Somo Circles",
    joinWaitlist: "Join the waiting list",
    applyOutdoors: "Apply to Somo Outdoors",
    seeNextEvent: "See the next event",
    talkToUs: "Talk to us",
    hostSomo: "Host a SOMO experience",
    notFoundTitle: "Page not found",
    notFoundBody: "The page you are looking for does not exist or has moved.",
    notFoundCta: "Back to home",
  },

  announce: {
    msg: "Small group experiences built around the body and the group",
    link: "Upcoming experiences",
  },

  nav: {
    home: "Home",
    experiences: "Experiences",
    organisations: "For Organisations",
    about: "About",
    safety: "Safety & FAQ",
    cta: "Upcoming Experiences",
    homeAria: "Home page",
    navAria: "Primary navigation",
    menuAria: "Open menu",
    langAria: "Αλλαγή γλώσσας στα Ελληνικά",
  },

  products: {
    circles: {
      name: "Somo Circles",
      soon: false,
      kind: "Therapeutic",
      navdesc: "Somatic shaking and group therapy, in a small group.",
      oneLiner: "A small group therapy experience that combines controlled somatic shaking with facilitated conversation.",
    },
    flow: {
      name: "Somo Flow",
      soon: true,
      kind: "Movement",
      navdesc: "Accessible yoga and somatic shaking. Coming soon.",
      oneLiner: "A movement class that combines accessible yoga with somatic shaking, with the focus on the body.",
    },
    outdoors: {
      name: "Somo Outdoors",
      soon: false,
      kind: "Community",
      navdesc: "Small outdoor events for professionals, up to 12 people.",
      oneLiner: "Small outdoor events for founders and professionals, with real conversation and up to 12 people.",
    },
  },

  footer: {
    ctaTitle: "See the next SOMO experiences",
    blurb: "SOMO creates small group experiences that use the body, movement, the group and real human interaction.",
    experiencesTitle: "Experiences",
    moreTitle: "SOMO",
    contactTitle: "Contact",
    eventsLink: "Events on Luma",
  },

  meta: {
    home: {
      title: "SOMO · Small group experiences for the body and the group",
      description: "SOMO creates small group experiences that combine body-based practices, movement, group therapy and outdoor activity. See Somo Circles, Somo Flow and Somo Outdoors.",
      ogAlt: "SOMO — small group experiences for the body and the group.",
    },
    circles: {
      title: "Somo Circles · Somatic shaking and group therapy | SOMO",
      description: "Somo Circles is a small group therapy experience that combines controlled somatic shaking with facilitated conversation. See how it works and book a place.",
      ogAlt: "Somo Circles — somatic shaking and group therapy.",
    },
    flow: {
      title: "Somo Flow · Yoga and somatic shaking | SOMO",
      description: "Somo Flow combines accessible yoga with somatic shaking, focused on the body rather than a therapy group. Coming soon. Join the waiting list.",
      ogAlt: "Somo Flow — yoga and somatic shaking.",
    },
    outdoors: {
      title: "Somo Outdoors · Outdoor events for professionals | SOMO",
      description: "Somo Outdoors runs small outdoor events for founders and professionals, capped at 12 people, built around real conversation. Apply to the community.",
      ogAlt: "Somo Outdoors — small outdoor events for professionals.",
    },
    organisations: {
      title: "For Organisations · SOMO for teams, studios and communities",
      description: "We adapt SOMO group experiences for companies, yoga and Pilates studios, coworking spaces and communities. Talk to us.",
      ogAlt: "SOMO for organisations, teams, studios and communities.",
    },
    about: {
      title: "About SOMO · Aggelos Mouzakitis",
      description: "SOMO creates experiences where body awareness, movement, the group and conversation sit in the same room. Created by Aggelos Mouzakitis, an integrative psychotherapist and facilitator.",
      ogAlt: "About SOMO and Aggelos Mouzakitis.",
    },
    safety: {
      title: "Safety and FAQ · SOMO",
      description: "Practical information for taking part in SOMO experiences, the control you keep during the practice, boundaries and how it differs from individual psychotherapy.",
      ogAlt: "Safety and frequently asked questions for SOMO experiences.",
    },
    privacy: {
      title: "Privacy Policy · SOMO",
      description: "How SOMO handles the details you share through forms, applications and bookings on Luma.",
      ogAlt: "SOMO Privacy Policy.",
    },
    participation: {
      title: "Participation Conditions · SOMO",
      description: "The conditions for taking part in SOMO experiences, bookings through Luma, cancellations and what we ask of participants.",
      ogAlt: "Participation Conditions for SOMO experiences.",
    },
  },

  /* =========================== HOME ===================================== */
  home: {
    hero: {
      eyebrow: "SOMO · Small group experiences",
      h1sr: "SOMO. Small group experiences for the body and the group",
      lead: "SOMO creates small group experiences that use the body, movement, group therapy and outdoor activity, so you can notice more clearly what is happening inside you and connect more meaningfully with yourself and with other people.",
      loc: "Athens · In Greek and English",
      secondary: "See the experiences",
      meta: [
        { k: "Format", v: "Small groups" },
        { k: "Location", v: "Athens" },
        { k: "Language", v: "Greek and English" },
        { k: "Booking", v: "Through Luma" },
      ],
    },
    intro: {
      eyebrow: "What SOMO is",
      title: "Three experiences, different levels of participation",
      body: [
        "SOMO is not one thing. It is three different experiences, with different depth and different purpose. Some are therapeutic. Others focus on movement or on community.",
        "What connects them is simple. All three help you get closer to what is happening in your body and to your relationship with the people around you.",
      ],
      points: [
        { name: "Somo Circles", text: "combines somatic shaking with group therapy." },
        { name: "Somo Flow", text: "combines yoga with somatic shaking." },
        { name: "Somo Outdoors", text: "combines outdoor activity with mindful attention and real interaction." },
      ],
    },
    experiences: {
      eyebrow: "The experiences",
      title: "Choose what fits you",
      text: "The three experiences differ in how they work and what they are for. Here is what each one does, in a few lines.",
    },
    events: {
      eyebrow: "Upcoming events",
      title: "See when the next experience is",
      text: "Dates, prices and available places always live on Luma.",
      fallback: {
        eyebrow: "Schedule on Luma",
        title: "Upcoming experiences are published on Luma",
        body: "See the schedule, book a place or join a waiting list. Luma keeps the dates and availability up to date for every event.",
      },
    },
    how: {
      eyebrow: "How it works",
      title: "Four principles in every SOMO experience",
      text: "Whichever experience you choose, the work happens the same way.",
      principles: [
        { t: "Clear facilitation", d: "Every experience has a facilitator who explains the structure, gives clear instructions and holds the frame from start to finish." },
        { t: "Participant choice", d: "You take part at your own pace. You can adapt an exercise, lower the intensity, pause or stop." },
        { t: "Body awareness", d: "We start from what is happening in the body, not only from thinking or talking." },
        { t: "Real group interaction", d: "The experiences happen in small groups, where the presence of other people matters." },
      ],
    },
    referral: {
      eyebrow: "For professionals who refer",
      title: "Easy to explain to your own people",
      body: [
        "If you work with people as psychotherapists, counsellors, coaches or yoga and Pilates teachers, SOMO can suit those who want to work with their experience through both the body and a group.",
        "SOMO is not a medical service. Referring someone to an experience is not a medical recommendation, it is simply a suggestion for something that may be useful.",
      ],
      circles: "Suits people who want to connect verbal reflection with body awareness, inside a facilitated group.",
      flow: "Suits people who want a body-focused experience without joining a therapy group.",
    },
    outdoorsIntro: {
      eyebrow: "Somo Outdoors",
      title: "A small community of professionals, outdoors",
      body: [
        "Somo Outdoors brings together founders, solopreneurs, executives and independent professionals for small outdoor events with real interaction.",
      ],
      points: [
        "Groups are small, with up to 12 people.",
        "The focus is on genuine conversation, not networking.",
        "You apply once and then book individual events through Luma.",
      ],
    },
    about: {
      eyebrow: "Who is behind SOMO",
      title: "Created by Aggelos Mouzakitis",
      body: [
        "Aggelos Mouzakitis is an integrative psychotherapist and facilitator, with a professional background in product, technology and working with founders and professionals.",
        "SOMO grew from the view that body-based practices, conversation and the group work better when they share the same room.",
      ],
      cta: "Read more about SOMO",
      photoAlt: "Aggelos Mouzakitis, the founder of SOMO.",
    },
    orgs: {
      eyebrow: "For organisations",
      title: "Bring SOMO to your company or community",
      body: [
        "SOMO experiences can be adapted for teams, studios, professional communities and private groups.",
        "Tell us what you have in mind and we will find the format that fits your people and your space.",
      ],
    },
    finalCta: {
      eyebrow: "Upcoming experiences",
      title: "See when the next experience is",
      text: "The full schedule and bookings live on Luma.",
    },
  },

  /* =========================== SOMO CIRCLES ============================= */
  circles: {
    hero: {
      eyebrow: "Somo Circles · Therapeutic experience",
      h1: "Somo Circles",
      lead: "A small group therapy experience that combines controlled somatic shaking with facilitated conversation.",
      note: "No previous experience with body-based practices or groups is needed.",
      secondary: "See what happens in a session",
    },
    definition: {
      eyebrow: "What it is",
      title: "Two things in the same session",
      body: [
        "In Somo Circles you do simple body-based exercises that let a controlled shaking arise in the body. This is called somatic shaking.",
        "The physical practice is combined with facilitated group therapy. There you can notice what you observed and connect the bodily experience with thoughts, feelings, tension or situations in your life.",
      ],
    },
    shaking: {
      eyebrow: "Somatic shaking",
      title: "What it is in practice",
      body: [
        "Somatic shaking is a natural trembling that can appear when the body tires or relaxes after some effort. It is not mysterious and it does not take away your control.",
        "During the exercise you stay alert and you decide how far to go.",
      ],
      listLabel: "How it unfolds",
      points: [
        "You start from simple positions or movements.",
        "These positions may create muscular fatigue and let the shaking appear.",
        "You stay alert and in control throughout.",
        "You can adjust the intensity up or down.",
        "You can pause or stop whenever you want.",
        "There is no need to prove anything or force a particular reaction.",
      ],
    },
    group: {
      eyebrow: "The group therapy",
      title: "The conversation in the group",
      body: [
        "The group conversation can happen before or after the physical practice, depending on the format of the session. The facilitator holds the frame.",
        "Speaking is always an invitation and never a requirement. You share as much and whenever you want.",
      ],
      listLabel: "What can be talked about",
      points: [
        "What you noticed in your body.",
        "Emotions or memories that appeared.",
        "Patterns of tension that repeat.",
        "Your boundaries in the group.",
        "How it feels to be seen by other people.",
        "What the experience connects to in your current life.",
      ],
    },
    session: {
      eyebrow: "A session",
      title: "What happens in a Somo Circle",
      text: "A typical session moves through five stages.",
      steps: [
        { t: "Arrival and orientation", d: "The facilitator explains the structure, your options and how you can stop at any point." },
        { t: "Gentle physical preparation", d: "Simple movements that prepare the body, without demanding exercise." },
        { t: "Somatic shaking", d: "The positions that let the shaking appear, at your own pace and intensity." },
        { t: "Facilitated group therapy", d: "Space to notice and, if you want, to share your experience with the group." },
        { t: "Closing and integration", d: "Settling, returning to your usual rhythm and time to take in the session." },
      ],
      note: "The order can change depending on the format of the session and the group.",
    },
    suits: {
      eyebrow: "Who it may suit",
      title: "It may interest you if you",
      text: "Somo Circles can be useful for different people. A few examples:",
      points: [
        "Carry persistent tension in your body.",
        "Spend a lot of time thinking and analysing.",
        "Feel disconnected from bodily sensations.",
        "Find it difficult to slow down.",
        "Want to approach your emotions with more than conversation.",
        "Are interested in the experience of a therapeutic group.",
      ],
    },
    notFor: {
      eyebrow: "What it is not",
      title: "To avoid any confusion",
      points: [
        "It is not a fitness class.",
        "It is not a performance.",
        "It does not promise a particular emotional release.",
        "It does not replace medical care.",
        "It is not individual psychotherapy.",
        "It does not suit every person at every moment.",
      ],
    },
    control: {
      eyebrow: "Control and boundaries",
      title: "You decide how far to go",
      body: [
        "Control stays with you throughout. The facilitator gives clear instructions for how you can stop or rest.",
      ],
      cta: "See Safety and FAQ",
      listLabel: "In practice you can",
      points: [
        "Adapt the exercises.",
        "Lower the intensity of the shaking.",
        "Change position.",
        "Rest.",
        "Leave an exercise.",
        "Stay silent, if you prefer.",
      ],
    },
    format: {
      eyebrow: "Practical",
      title: "Format and duration",
      meta: [
        { k: "Size", v: "Small group" },
        { k: "Duration", v: "75-90 min" },
        { k: "Format", v: "In person" },
        { k: "Price", v: "Per event, on Luma" },
      ],
    },
    explain: {
      label: "How to explain it to someone else",
      text: "Somo Circles is a small group therapy session that combines controlled somatic shaking with facilitated conversation. Participants use simple body-based exercises, notice what comes up, and can explore the experience with the group if they want to.",
    },
    referral: {
      eyebrow: "For therapists and coaches",
      title: "If you are referring someone",
      body: [
        "Somo Circles may suit people who want to connect verbal reflection with body awareness, inside a facilitated group.",
        "The sessions are a group, experiential setting and do not replace the individual work someone may already be doing.",
      ],
      secondary: "Ask about hosting a Circle",
    },
    faqTitle: "Frequently asked questions about Somo Circles",
    faq: [
      { q: "Do I need previous experience?", a: ["No. The exercises are simple and the facilitator explains everything from the start."] },
      { q: "Do I have to talk?", a: ["No. Speaking is an invitation. You can take part in the physical practice and stay silent in the conversation."] },
      { q: "Can I stop the shaking?", a: ["Yes. You can lower the intensity, change position, rest or stop completely whenever you want."] },
      { q: "Is this the same as yoga?", a: ["No. There are simple body-based exercises, but the purpose is different. Somo Circles combines somatic shaking with group therapy."] },
      { q: "Is Somo Circles psychotherapy?", a: ["Somo Circles includes facilitated group therapy. It does not offer the same level of individual assessment and support as individual psychotherapy."] },
      { q: "Is this suitable alongside individual therapy?", a: ["For many people, yes. If you are already in individual therapy, it is a good idea to discuss it with your therapist."] },
      { q: "What should I wear?", a: ["Comfortable clothes you can move in. Nothing special is needed."] },
      { q: "How large is the group?", a: ["Groups are small, so there is room for each person. The exact number is shown on each event on Luma."] },
      { q: "Where do sessions take place?", a: ["In person. The venue and area are listed on each event on Luma."] },
      { q: "What should I do if I have a health concern?", a: ["If you have a health condition, injury, are pregnant or have had recent surgery, consult an appropriate health professional first. See the Safety and FAQ page as well."] },
    ],
    finalCta: {
      eyebrow: "Somo Circles",
      title: "Book a place in the next session",
      text: "Dates and available places live on Luma.",
    },
  },

  /* =========================== SOMO FLOW =============================== */
  flow: {
    hero: {
      eyebrow: "Somo Flow · Movement experience",
      h1: "Somo Flow",
      lead: "A movement class that combines accessible yoga with somatic shaking, with the focus on the body rather than conversation.",
      secondary: "See what happens in a class",
    },
    main: {
      eyebrow: "What it is",
      title: "Movement first, with awareness",
      body: [
        "In Somo Flow we use yoga and gentle movement to prepare the body, and then, or alongside it, we add somatic shaking.",
        "The purpose is to notice physical tension, move with more awareness and experience a different relationship with your body.",
        "It is mainly a body-based class. It has less conversation than Somo Circles and does not ask you to share personal experiences.",
      ],
    },
    compare: {
      eyebrow: "Difference",
      title: "Somo Flow and Somo Circles",
      text: "The two experiences share somatic shaking, but they have a different purpose.",
      note: "Neither one is higher or more advanced. They are simply different.",
      flow: {
        name: "Somo Flow",
        points: [
          "Led by movement.",
          "Includes little or no personal sharing.",
          "Is not group therapy.",
          "Suits people who want a body-focused experience.",
        ],
      },
      circles: {
        name: "Somo Circles",
        points: [
          "Combines somatic shaking with group therapy.",
          "Includes facilitated reflection.",
          "Allows deeper exploration of personal experience.",
        ],
      },
    },
    session: {
      eyebrow: "A class",
      title: "What happens in a Somo Flow",
      steps: [
        { t: "Arrival and grounding", d: "A quiet start to land in the space and in your body." },
        { t: "Accessible yoga and movement", d: "Gentle movements suited to beginners, with adaptations where needed." },
        { t: "Somatic shaking", d: "Positions that let the shaking appear, at your own pace." },
        { t: "Rest and awareness", d: "Time to notice how the body feels after moving." },
        { t: "Closing", d: "A calm return to the usual rhythm of the day." },
      ],
    },
    suits: {
      eyebrow: "Who it may suit",
      title: "It may interest you if you are looking for",
      points: [
        "More awareness of the body.",
        "Accessible movement, friendly to beginners.",
        "An alternative to a conventional yoga class.",
        "A way to try somatic shaking without joining a therapy group.",
        "A structured pause from a mentally demanding routine.",
      ],
    },
    format: {
      eyebrow: "Practical",
      title: "Format and duration",
      meta: [
        { k: "Size", v: "Group class" },
        { k: "Duration", v: "60-75 min" },
        { k: "Level", v: "Beginner friendly" },
        { k: "Launch", v: "Announced on Luma" },
      ],
    },
    explain: {
      label: "How to explain it to someone else",
      text: "Somo Flow is a movement class that combines accessible yoga with somatic shaking. It is designed for people who want to move, notice physical tension and become more aware of their body, without joining a therapy group.",
    },
    partner: {
      eyebrow: "For studios and organisers",
      title: "Host Somo Flow",
      body: [
        "Somo Flow suits studios, retreats, private groups and organisations that want a body-based class.",
      ],
      cta: "Ask about hosting Somo Flow",
    },
    finalCta: {
      eyebrow: "Somo Flow · Coming soon",
      title: "Be the first to know when it starts",
      text: "Join the waiting list through Luma and we will let you know about the first classes.",
    },
  },

  /* =========================== SOMO OUTDOORS ========================== */
  outdoors: {
    hero: {
      eyebrow: "Somo Outdoors · Community and activity",
      h1: "Somo Outdoors",
      lead: "Small outdoor events for founders and professionals, with up to 12 people and real conversation.",
      note: "You apply once for the community and then book individual events through Luma.",
    },
    model: {
      eyebrow: "How it works",
      title: "A simple, clear model",
      points: [
        "Up to 12 people at each event.",
        "About one event a month to begin with.",
        "One short application to join the community.",
        "Accepted members book future events through Luma.",
        "Places are first come, first served.",
        "Each event has its own fee.",
        "Transport, food, clothing and personal equipment are each participant's responsibility.",
        "The difficulty and requirements of each event are stated in advance.",
      ],
    },
    positioning: {
      eyebrow: "What it is and is not",
      title: "Activity and interaction, not networking",
      body: [
        "At Somo Outdoors you will often meet people with relevant professional experience, but the event is organised around the activity itself and real interaction.",
        "The application exists to protect the culture of the group. Direct selling, persistent self-promotion and using the event mainly for leads do not fit here.",
        "We do not choose people by their wealth, seniority or influence. We simply want people who come with genuine interest in others.",
      ],
    },
    activities: {
      eyebrow: "The events",
      title: "Where we start",
      text: "To begin with, we keep the events simple and repeatable.",
      hike: {
        tag: "Hike and Talk",
        name: "A hike and a conversation",
        text: "A beginner-friendly hike, with a clear meeting point, a short introduction, walking in changing pairs, a prompt for conversation and a quiet stretch. Optionally, coffee or food afterwards, paid individually.",
      },
      walk: {
        tag: "Walk and Reflect",
        name: "An accessible walk",
        text: "An accessible walk in a park, the city, along the coast or in the evening. It suits people who do not want a demanding hike.",
      },
      occasional: {
        tag: "Occasional",
        name: "Now and then",
        text: "From time to time we may add outdoor movement, mindfulness, sea swimming or simple group games, depending on the season and the group.",
      },
    },
    membership: {
      eyebrow: "The community",
      title: "How you become a member",
      steps: [
        { t: "Complete a short application", d: "Once, with a few questions. No preparation needed." },
        { t: "Receive confirmation", d: "If the community looks like a fit, we let you know the next steps." },
        { t: "Book individual events", d: "You see upcoming events and book a place through Luma." },
        { t: "Take part", d: "You come with the equipment and preparation described for each event." },
      ],
    },
    audience: {
      eyebrow: "Who it is for",
      title: "More about mindset than job title",
      text: "The community is not limited to one job title. People it suits include:",
      points: [
        "Founders and solopreneurs.",
        "Executives and managers.",
        "Independent professionals and creators.",
        "Senior specialists.",
        "People building demanding careers or businesses.",
      ],
    },
    culture: {
      eyebrow: "Culture",
      title: "What keeps the group healthy",
      text: "A few simple things we ask of everyone.",
      points: [
        { t: "Curiosity about others", d: "You come with genuine interest in the people next to you." },
        { t: "Respect for boundaries", d: "No one is pushed to share personal information." },
        { t: "No hard pitching", d: "The events are not a place for selling or persistent pitching." },
        { t: "Reliability and respect", d: "When you book, you show up, and you follow the instructions for the activity." },
      ],
    },
    explain: {
      label: "How to explain it to someone else",
      text: "Somo Outdoors organises small outdoor experiences for founders and professionals. Groups are capped at 12 people and combine walking or other accessible activities with thoughtful conversation, without turning the event into formal networking.",
    },
    faqTitle: "Frequently asked questions about Somo Outdoors",
    faq: [
      { q: "Why is there an application?", a: ["The application exists to protect the culture of the group and to keep the events small and meaningful. It is not a strict selection process."] },
      { q: "Do I have to be a founder?", a: ["No. The community includes founders, executives, independent professionals and others. Mindset matters more than job title."] },
      { q: "Is this a networking event?", a: ["Not in the usual sense. You will meet relevant people, but the event is organised around the activity and real interaction."] },
      { q: "How many people attend?", a: ["Up to 12 people at each event."] },
      { q: "How difficult are the activities?", a: ["Most are accessible. The difficulty and requirements of each event are stated in advance on Luma."] },
      { q: "Can I join alone?", a: ["Yes. Most people come on their own. The format helps people get to know each other."] },
      { q: "What happens if the weather changes?", a: ["An event may change or be postponed for weather or safety reasons. You will be told in good time."] },
      { q: "What does the participation fee include?", a: ["Each event has its own fee, shown on Luma. Transport, food and personal equipment are each participant's responsibility."] },
      { q: "Can I invite someone?", a: ["Let us know. The community is small, so we look at it case by case."] },
      { q: "How do cancellations work?", a: ["Each event on Luma shows its own booking and cancellation terms."] },
    ],
    finalCta: {
      eyebrow: "Somo Outdoors",
      title: "Apply to the community",
      text: "One short application and then you book events through Luma.",
    },
  },

  /* =========================== ORGANISATIONS ========================== */
  organisations: {
    hero: {
      eyebrow: "For Organisations",
      h1: "Bring SOMO to your company or community",
      lead: "We adapt SOMO group experiences for companies, studios, offsites, retreats, private groups and professional communities.",
    },
    adapt: {
      eyebrow: "What can be adapted",
      title: "Each session is shaped around you",
      points: [
        "The size of the group.",
        "The time available.",
        "The space and setting.",
        "The profile of the participants.",
        "The level of reflection you want.",
        "Whether it is a one-off introduction or a recurring format.",
      ],
    },
    teams: {
      eyebrow: "Companies and teams",
      title: "For the workplace",
      body: [
        "Company sessions can draw from Somo Circles while staying appropriate for a workplace setting.",
        "Employees are not required to disclose private, emotional experiences. A session like this is not group psychotherapy.",
      ],
      listLabel: "Possible elements",
      points: [
        "Accessible body-based exercises.",
        "Somatic shaking.",
        "Basic education about stress and body awareness.",
        "Individual reflection.",
        "Optional group discussion.",
      ],
    },
    studios: {
      eyebrow: "Studios and communities",
      title: "For spaces and communities",
      body: [
        "SOMO can run introductory or recurring sessions in a range of spaces.",
        "The exact format is designed together, according to the space and the audience.",
      ],
      listLabel: "Where it can happen",
      points: [
        "Yoga studios.",
        "Pilates studios.",
        "Therapy or wellbeing spaces.",
        "Coworking spaces.",
        "Retreats.",
        "Private communities.",
      ],
    },
    process: {
      eyebrow: "Process",
      title: "Four simple steps",
      steps: [
        { t: "Send a short enquiry", d: "A little information about your audience and your space." },
        { t: "Discuss the setting", d: "We talk about the people, the time and the aim of the session." },
        { t: "Agree on a format", d: "We choose a SOMO format that fits, together." },
        { t: "Confirm the details", d: "Date, venue and practical matters." },
      ],
    },
    finalCta: {
      eyebrow: "Let us talk",
      title: "Tell us what you have in mind",
      text: "Describe your team or space in a few lines and we will reply.",
      cta: "Tell us what you have in mind",
    },
  },

  /* =========================== ABOUT ================================== */
  about: {
    hero: {
      eyebrow: "About",
      h1: "Why SOMO exists",
      lead: "SOMO creates experiences where body awareness, movement, group facilitation and conversation can sit in the same room.",
    },
    origin: {
      eyebrow: "The starting point",
      title: "Where it began",
      body: [
        "Many people understand their experience very well at an intellectual level, while staying disconnected from what is happening in their body.",
        "SOMO was made to offer experiences where body awareness, movement, the group and conversation sit together, without setting one against the other.",
      ],
    },
    founder: {
      eyebrow: "The founder",
      name: "Aggelos Mouzakitis",
      photoAlt: "Aggelos Mouzakitis, the founder of SOMO.",
      body: [
        "Aggelos Mouzakitis is an integrative psychotherapist and facilitator, with a professional background in product, technology and working with founders and professionals.",
        "SOMO brings together his interest in psychotherapy, group processes, body-based practices and the psychological reality of demanding modern work.",
        "This is also why SOMO combines body-based practices with conversation and group connection. One supports the other.",
      ],
    },
    philosophy: {
      eyebrow: "The approach",
      title: "Four practical principles",
      points: [
        { t: "The body gives useful information", d: "What we feel physically tells us something worth noticing." },
        { t: "Control stays with you", d: "You decide how much to take part and you can stop whenever you want." },
        { t: "The group helps us see patterns", d: "Inside a group, the patterns in how we relate to others become more visible." },
        { t: "It should be understandable", d: "An experience should be clear before you decide to take part." },
      ],
    },
    finalCta: {
      eyebrow: "Experiences",
      title: "View upcoming experiences",
      text: "The schedule and bookings live on Luma.",
    },
  },

  /* =========================== SAFETY & FAQ =========================== */
  safety: {
    hero: {
      eyebrow: "Safety and FAQ",
      h1: "Safety and participation",
      lead: "Practical information so you can take part with awareness. This page is not medical advice.",
    },
    principles: {
      eyebrow: "General participation principles",
      blocks: [
        {
          title: "Before and during",
          points: [
            "You decide whether an activity is suitable for you.",
            "Every physical exercise can be reduced, adapted or stopped.",
            "Personal sharing is optional, unless a specific therapeutic group has a different agreement.",
            "Discomfort is not proof that an exercise is working.",
            "Tell the facilitator when you need support or a pause.",
            "Outdoor events have requirements that depend on the activity.",
            "SOMO does not replace medical care or individual mental health support.",
          ],
        },
        {
          title: "Health concerns",
          body: [
            "If you have a relevant health condition, injury, pregnancy, recent surgery or any uncertainty about taking part physically, consult an appropriate health professional first.",
          ],
        },
        {
          title: "Emotional safety",
          body: [
            "Body-based practices can sometimes bring up emotions, memories or unexpected reactions.",
            "You can pause, stop, rest or choose not to talk about what came up. The facilitator explains the structure and your options before the practice begins.",
          ],
        },
      ],
    },
    clarify: {
      eyebrow: "Notes for each experience",
      blocks: [
        {
          title: "Somo Circles",
          body: [
            "Somo Circles includes facilitated group therapy, but it does not offer the same level of individual assessment and ongoing support as individual psychotherapy.",
            "If you are in acute crisis or need immediate individual support, please turn to an appropriate individual service.",
          ],
        },
        {
          title: "Somo Flow",
          body: [
            "Somo Flow is a movement-based group class and not group psychotherapy.",
          ],
        },
        {
          title: "Somo Outdoors",
          body: [
            "For every outdoor event, review the route difficulty, the expected duration, the weather, clothing, water, transport and the safety notes in advance.",
            "Each event on Luma contains the final practical details.",
          ],
        },
      ],
    },
    faqTitle: "General questions",
    faq: [
      { q: "What is somatic shaking?", a: ["It is a natural trembling that can appear when the body tires or relaxes after a simple exercise. You stay alert and in control."] },
      { q: "Is shaking compulsory?", a: ["No. You set the intensity and you can stop whenever you want."] },
      { q: "Do I remain in control?", a: ["Yes. You can adapt, pause, rest or leave an exercise at any time."] },
      { q: "Do I need to be physically fit?", a: ["No. The exercises are adaptable. If you have a health concern, consult a health professional first."] },
      { q: "Are SOMO sessions psychotherapy?", a: ["Somo Circles includes facilitated group therapy. Somo Flow and Somo Outdoors are not therapy."] },
      { q: "Can SOMO replace individual therapy?", a: ["No. SOMO does not replace individual psychotherapy or medical care."] },
      { q: "What language are sessions delivered in?", a: ["Sessions run in Greek or English. The language of each event is shown on Luma."] },
      { q: "Are sessions available in English and Greek?", a: ["Yes. Some events run in English. Check the language on each event on Luma."] },
      { q: "Where do events take place?", a: ["In person. The venue and area are listed on each event on Luma."] },
      { q: "How do I register?", a: ["Registration is through Luma. Each event has its own link."] },
      { q: "How do I cancel?", a: ["Each event on Luma shows its own booking and cancellation terms."] },
      { q: "Can organisations host a private session?", a: ["Yes. See the For Organisations page and get in touch."] },
    ],
    finalCta: {
      eyebrow: "Experiences",
      title: "View upcoming experiences",
      text: "The practical details for each event live on Luma.",
    },
  },

  /* =========================== PRIVACY ================================ */
  privacy: {
    navlabel: "Privacy Policy",
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro: "How SOMO handles your personal details when you contact us or book a place at an event.",
    updated: "Last updated: 2026",
    toc: true,
    tocLabel: "Contents",
    sections: [
      { h: "Who we are", body: ["SOMO creates small group experiences. For questions about your data, contact us using the details at the end of this page."] },
      { h: "Contact forms", body: ["When you complete a contact form, we receive the details you give us so we can reply. We do not use them for anything unrelated to your request."] },
      { h: "Somo Outdoors applications", body: ["The Somo Outdoors application includes basic professional details, so we can understand whether the community is a fit. We do not ask for sensitive data."] },
      { h: "Waiting lists and updates", body: ["If you join a waiting list, we use your details only to keep you informed about that particular experience."] },
      { h: "Bookings through Luma", body: ["Bookings and waiting lists are handled through the Luma platform. Luma is an external provider with its own privacy policy, which we suggest you read."] },
      { h: "Analytics and cookies", body: ["The site may use basic analytics to understand how it is used. If cookies are enabled, there will be a notice about them."] },
      { h: "Your rights", body: ["You can request access to your data or its deletion. Contact us and we will respond."] },
      { h: "Contact", body: ["For anything related to privacy, contact us through the form or the email shown on the site."] },
    ],
  },

  /* =========================== PARTICIPATION ========================== */
  participation: {
    navlabel: "Participation Conditions",
    eyebrow: "Conditions",
    title: "Participation Conditions",
    intro: "What applies when you book and take part in a SOMO experience.",
    updated: "Last updated: 2026",
    toc: true,
    tocLabel: "Contents",
    sections: [
      { h: "Bookings", body: ["Bookings are made through Luma. Each event has its own link, its own places and its own fee."] },
      { h: "Payments", body: ["Where a payment applies, it is made through Luma, according to what is stated on the event."] },
      { h: "Cancellations", body: ["Cancellation terms are shown on each event on Luma. Review them before you book."] },
      { h: "Personal responsibility", body: ["You take part at your own responsibility and decide whether an activity is suitable for you. See the Safety and FAQ page as well."] },
      { h: "Respect for the group", body: ["We ask for respect towards other participants and the facilitator. Hard pitching or disruptive behaviour is not acceptable."] },
      { h: "Confidentiality in therapeutic groups", body: ["In therapeutic groups, what participants share stays within the group."] },
      { h: "The facilitator's role", body: ["The facilitator may stop someone's participation when this is necessary for the safety or wellbeing of the group."] },
      { h: "Outdoor events", body: ["Outdoor events may change or be postponed for weather or safety reasons."] },
      { h: "Photography", body: ["Photographs are taken only with the clear consent of participants."] },
      { h: "No guaranteed outcome", body: ["We do not promise specific therapeutic or wellbeing outcomes."] },
    ],
  },

  /* =========================== FORMS ================================== */
  forms: {
    invalid: "Please check the highlighted fields.",
    outdoors: {
      eyebrow: "Application",
      title: "Apply to Somo Outdoors",
      intro: [
        "One short application, once. If the community looks like a fit, we send you the next steps for booking events through Luma.",
      ],
      mailSubject: "Somo Outdoors application",
      submit: "Send application",
      note: "We do not ask for sensitive information and you do not need to prove your professional status.",
      fields: {
        name: "Full name",
        email: "Email",
        profile: "LinkedIn or professional profile",
        profileHint: "One link is enough.",
        role: "What you do at the moment",
        why: "Why you want to join",
        whyHint: "Two or three sentences are enough.",
        notSelling: "I understand that the events are not designed for direct selling or promotion.",
        privacyHtml: "I have read and accept the <a class=\"link\" href=\"%URL%\">Privacy Policy</a>.",
      },
      msg: { required: "This field is required.", email: "Enter a valid email." },
    },
    org: {
      eyebrow: "Contact",
      title: "Tell us what you have in mind",
      intro: [
        "Describe your team or space in a few lines. We will reply by email to find a format that fits.",
      ],
      mailSubject: "Organisation enquiry for SOMO",
      submit: "Send message",
      note: "You do not need to mention a budget at this stage.",
      fields: {
        name: "Full name",
        email: "Email",
        org: "Organisation",
        type: "Type of organisation",
        typePlaceholder: "Select",
        typeOptions: [
          "Company or team",
          "Yoga or Pilates studio",
          "Wellbeing or therapy space",
          "Coworking space",
          "Retreat or organiser",
          "Community or private group",
          "Other",
        ],
        size: "Roughly how many people",
        location: "Preferred location",
        about: "What you are considering",
        timing: "Timing (optional)",
        privacyHtml: "I have read and accept the <a class=\"link\" href=\"%URL%\">Privacy Policy</a>.",
      },
      msg: { required: "This field is required.", email: "Enter a valid email." },
    },
    confirm: {
      outdoorsTitle: "We have received your application",
      outdoorsBody: "We will look at it and get back to you by email. If the community looks like a fit, we will send you the next steps for booking events through Luma.",
      orgTitle: "We have received your message",
      orgBody: "We will reply by email to discuss what would suit your team or space.",
    },
  },
};
