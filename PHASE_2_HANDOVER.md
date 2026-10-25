# Phase 2 handover: aggelosmouzakitis.com

Prepared 25 October 2026. Branch `seo-phase-2`, started from `main` at `bdea0d0`. Nothing in this phase has been merged into `main` or deployed. The live site still runs Phase 1.

## 1. Status

### Completed

| Area | What was done |
|---|---|
| New pages | `/therapy-for-men/`, `/therapy-for-software-engineers/` and `/fees-and-practicalities/` from the supplied copy, word for word (section 2 below). |
| Navigation | Header audience group: "Therapy for Software Engineers" after men in tech, "Therapy for Men" before Greek-speaking. Footer "Who I work with": "Software Engineers" and "Therapy for Men". Footer "Practice": "Fees & Practicalities" beside FAQ. No new top-level header item and no homepage section. |
| Founders | Board answer replaced ("I do not provide reports to your board, investors or co-founder…"). "Achievement & self-worth →" after "After growth, funding or exit". Fees link after the fee answer. |
| Men in tech | "Software engineers →" in "Who tends to come". Employer answer replaced. "Therapy for men →" after the relationship links in "What happens at home". Fees link after the fee answer. |
| Executives | Discretion's first paragraph replaced ("…so you need somewhere you can speak privately."). Fees link after the fee answer. |
| /faq/ | Cost answer replaced with the standard-session wording, plus the fees link. The free-first-call answer is unchanged. |
| Couples therapy | "The fee for the longer couples session is agreed separately before booking." placed straight after the 50–60-minute fee sentence. |
| Fee scope | Work With Me now says "Standard sessions after that are €100 or £90 each." Considering Therapy, the Greek-speaking page and the service pages describe individual sessions or one service, so their amounts stand. llms.txt scopes the fee to standard sessions and says the longer couples fee is agreed separately. |
| Fees links | Added to Considering Therapy (The first conversation), Work With Me (How to start, beside the button), the Greek-speaking page (Practicalities) and /faq/. |
| Individual psychotherapy | "Therapy for men →" beside "Psychotherapy for men in tech →". |
| Guides | Can't switch off: "on-call work" in the on-call paragraph now links to the engineers page. Perfectionism at work: the existing "A senior engineer" link now points to the engineers page instead of men in tech. Both use the articles' `contextLinks`. |
| Structured data | Each change is listed below the table. |
| Sitemap, robots, llms.txt | Sitemap: the 3 new URLs added (46 URLs, valid XML). robots.txt is unchanged and blocks nothing. llms.txt: the new pages and the fee scope. |
| Share cards | `img/og/v2/therapy-for-men.png`, `therapy-for-software-engineers.png` and `fees-and-practicalities.png`, made by the existing generator. |

Structured data changes:
- The practice node `#practice` is now an `Organization`, because schema.org deprecates `ProfessionalService`. It keeps its id, name, URL, description, founder, languages and area served; `priceRange` is gone.
- The BACP credential is now categorised "Professional registration", still named "Registered Member, BACP".
- The two new audience pages have a Service node. All five audience Services now carry an `audience`.
- The languages sit on an online `ServiceChannel`, not on Service.
- Each offer is scoped to what it buys:
  - individual psychotherapy and the audience pages: "Per 50–60-minute individual psychotherapy session"
  - couples: "Per standard 50–60-minute couples session"
  - coaching: "Per professional coaching session"
- The longer couples session has no offer.
- The fees page has a WebPage and breadcrumb only.
- FAQPage on the two new pages comes from the visible answers, using the existing one-question-one-page rule.
- `seo-check` now fails on `ProfessionalService`.

### Preserved

- All Phase 1 work: metadata, the founders, men-in-tech and executives sections, fees and free-call wording, FAQ deduplication, the Ireland base answer, the five `sameAs` profiles, Phase 1 guide links (apart from the perfectionism retarget above).
- The three audience H1s, photos and Work & Life Check placements on existing pages.
- "BACP-registered psychotherapist" everywhere. No register number or URL was invented.
- robots.txt and the build, stamping and route checks.

### Deliberately omitted

| Omitted | Why |
|---|---|
| Second founder biography, founder situations list, another confidentiality section and repeated FAQ explanations | The founders page already covers them; the brief rejects the repetition. |
| Layoffs section on men in tech | The engineers page and the career material already lead there. |
| "When the pressure does not ease" on executives | It would restate the existing pressure and burnout material. |
| Geography sections on every audience page | The location FAQ and practicalities already say it. |
| Homepage audience grid, new header item for fees | Integration runs through the existing menus, footer and contextual links. |
| A photograph or dark band on the new pages | No existing photograph fits them, and the brief rules out new imagery. They use the plain audience and content templates. |
| Guessed cancellation, payment, hours, platform, insurance or company-invoicing sections | These are unknown (section 5). |

### Decisions to review

1. **"Therapy for men →" now goes to `/therapy-for-men/`.** The link appears on Relationship Problems, Work & Relationships, Burnout, Anxiety, Achievement and Individual Psychotherapy, and previously went to the men-in-tech page. With a page whose title and H1 are "therapy for men", those words should point to it. Otherwise the site sends Google mixed signals about which page answers "therapy for men". The wording is unchanged. If you'd rather keep a link to men in tech on the work-focused pages (Burnout, Work & Relationships, Achievement), the existing label "Psychotherapy for men in tech →" can replace it there.
2. **The perfectionism link was retargeted.** "A senior engineer" was a Phase 1 link to men in tech. The brief asks for that example to link to the engineers page, and one phrase can only carry one link.
3. **Header labels follow the menu's pattern.** The header says "Therapy for Software Engineers" and "Therapy for Men"; the footer and breadcrumb use "Software Engineers" and "Therapy for Men", as the brief gives them.
4. **Audience on the existing three Services.** All five audience pages describe who they are for in the same way. The wording comes from each page's meta description.
5. **Sitemap dates.** Phase 2 adds menu and footer links to every page, so every page file changed. The sitemap now dates a page by the last commit that changed its own content or metadata, ignoring the shared header, footer and bundle stamps.
   - 26 pages show 25 October: everything Phase 1 and Phase 2 actually changed.
   - The other 20 keep earlier dates. Some move from 14 October back to 6 October, because the 14 October release only changed their footer.
6. **Work & Life Check on the engineers page.** It uses the component's default wording ("Four minutes. Five areas. A clearer view of where work is currently costing you most.") with the source `engineers-compact`.
7. **"Professional coaching" in the engineers FAQ** is linked inline, with the site's existing contextual-link treatment.

### Still open

Only the owner-supplied details in section 5 and the BACP register URL.

## 2. The new pages: final copy and metadata

This is the copy as it renders, generated from the built copy data. "→" marks an arrow link.

### /therapy-for-men/

| Field | Value |
|---|---|
| Title tag | Online Therapy for Men \| Aggelos Mouzakitis (43 characters) |
| Meta description | Online psychotherapy for men dealing with relationship difficulties, responsibility, anxiety or decisions they keep putting off. In English or Greek. (149 characters) |
| Canonical | https://aggelosmouzakitis.com/therapy-for-men/ |
| Breadcrumb | Home → Therapy for Men |
| Share card | img/og/v2/therapy-for-men.png (eyebrow and H1) |

**Eyebrow:** THERAPY FOR MEN  
**H1:** Online therapy for men.

You may handle difficult conversations at work and still spend weeks putting one off with your partner. Each evening, there is another reason it can wait.

I am a BACP-registered psychotherapist with a previous career in product and growth. Sessions are online, in English or Greek.

→ [Book a consultation](/contact/)

#### Agreeing when you wanted to say no

Agreeing can end an uncomfortable conversation quickly. The cost may only become apparent later, when you are doing something you did not want to do and resenting the person who asked.

Sometimes the request is unreasonable or the other person is putting pressure on you. It may also be difficult to bear their disappointment, even when you think saying no would be fair. We can look at what has happened when you have refused before, and what you now expect from people when you disagree.

#### When conversations keep going wrong

An argument can keep returning to your tone while the original issue stays untouched. You stop talking to avoid another row, then find that the silence becomes the next argument.

If you are holding back something you expect your partner to reject, it can be hard to bring it up before you are already angry. Individual therapy can focus on how these exchanges develop, including what happens when you try to say what you want. The relationship itself may also have problems that saying things differently will not resolve.

→ [Relationship problems](/relationship-problems-men/)

#### A decision you keep putting off

You can make a convincing case for staying in a job and an equally convincing case for leaving. After another evening thinking it through, nothing has changed.

The financial risk may be substantial. Leaving might also mean admitting how unhappy you have been, or disappointing people who thought this was what you wanted. Those concerns can remain even after you have answered most of the practical questions.

→ [Career change and decisions](/career-transition-therapy/)  
→ [Men in tech and demanding careers](/therapy-for-men-in-tech/)

#### What sessions are like

We might spend time on the moment before you agreed to something you did not want, including the response you expected if you refused. I may notice that the same expectation has appeared in another situation and ask whether that connection fits.

Earlier experiences can become relevant when they help explain what is happening now. You do not need a polished account of your life before we can begin, and you decide what to do with what we discuss.

→ [How individual psychotherapy works](/individual-psychotherapy/)

#### Practicalities

| Label | Value |
|---|---|
| Format | Online by video |
| Sessions | Usually 50–60 minutes |
| Frequency | Normally weekly at first |
| Languages | English or Greek |
| Fee | €100 or £90 per session |
| Introductory call | Free, usually 30 minutes to an hour |

I confirm whether I can work with you based on your location and circumstances before ongoing therapy begins.

→ [Fees and practicalities](/fees-and-practicalities/)

#### Common questions

**Do I need to know exactly what is wrong?**  
No. You can tell me what made you look for a therapist, even if you are unsure what to call it.

**Do I need to work in tech to come?**  
No. I also work with men in other careers and with difficulties that have little to do with work.

**Can I come on my own about my relationship?**  
Yes. Individual psychotherapy can focus on a relationship. Couples therapy is a separate service for partners who want to attend together.

**Do you work exclusively with men?**  
I mainly work with men. I also work with other adults when we are a suitable fit.

#### Contact

Tell me briefly what has been happening and where you are currently located.

→ [Book a consultation](/contact/)

### /therapy-for-software-engineers/

| Field | Value |
|---|---|
| Title tag | Therapy for Software Engineers \| Aggelos Mouzakitis (51 characters) |
| Meta description | Online therapy for software engineers dealing with on-call pressure, difficult feedback, career decisions or work that follows them home. English or Greek. (155 characters) |
| Canonical | https://aggelosmouzakitis.com/therapy-for-software-engineers/ |
| Breadcrumb | Home → Software Engineers |
| Share card | img/og/v2/therapy-for-software-engineers.png (eyebrow and H1) |

**Eyebrow:** SOFTWARE ENGINEERS  
**H1:** Online therapy for software engineers.

The incident is resolved, but you keep the channel open. When your partner asks about the weekend, you realise you have missed most of the conversation.

I am a BACP-registered psychotherapist with a previous career in product and growth. I offer online therapy in English or Greek.

→ [Book a consultation](/contact/)

#### Checking after your shift ends

Sometimes the coverage is thin and the person on call will need help. It is also possible to keep monitoring after a capable colleague has taken over, and to feel unsettled until you have checked for yourself.

Before treating the checking as anxiety, I would want to know what happens when you do switch off. If you have been blamed for missed problems before, someone else taking over may do little to change what you expect. We need to understand which part of that responsibility still belongs to your current role.

→ [Can’t switch off from work](/cant-switch-off-from-work/)

#### When feedback stays with you

A reviewer asks for a change. You make it, then spend another hour checking code they did not comment on. The review may be finished while you are still trying to make sure nobody can find another reason to question your competence. Sometimes the feedback has been unfair or badly delivered. There can also be a cycle in which another check brings a little relief, so you repeat it the next time you doubt yourself. After a while, submitting work without that extra checking can feel like taking a risk.

→ [Achievement and self-worth](/achievement-self-worth/)

#### Where the career goes next

Moving from engineering into management can change what makes the work satisfying. More authority may come with less time doing the work you chose the profession for. A good salary can make a change difficult, even when the current role suits you badly. You may also be reluctant to discuss going back to an individual contributor role because you expect the move to be read as a failure.

→ [Career change and decisions](/career-transition-therapy/)

#### Therapy with me

Before psychotherapy, I spent more than 18 years in product and growth, including seven years running a consultancy and work with more than 100 technology companies.

If a review keeps replaying for days, we might return to the comment itself and what you took it to mean about you. Earlier experiences of criticism may become relevant, especially if you find yourself expecting a similar response from people outside work. Sessions can also begin with a relationship difficulty or another part of your life that needs attention.

→ [About me](/about/)

#### Practicalities

| Label | Value |
|---|---|
| Format | Online by video |
| Sessions | Usually 50–60 minutes |
| Frequency | Normally weekly at first |
| Languages | English or Greek |
| Fee | €100 or £90 per session |
| Introductory call | Free, usually 30 minutes to an hour |

I confirm whether I can work with you based on your location and circumstances before ongoing therapy begins.

→ [Fees and practicalities](/fees-and-practicalities/)

#### Common questions

**Which engineering roles is this page for?**  
Software developers, senior and staff engineers, SREs and engineering managers may recognise these situations. We discuss whether the issue you bring fits what I offer before starting.

**Do I need to be senior to work with you?**  
No. Seniority is not a requirement.

**Is this page only for male engineers?**  
No. Much of my practice is with men, but I also work with other adults when we are a suitable fit.

**What if I mainly want help with a career decision?**  
Professional coaching is a separate service for a question that can stay focused on professional options and action. If the decision is entangled with anxiety, self-worth or a recurring personal pattern, psychotherapy may give us more useful scope.

#### Contact

If work keeps occupying more of your life than you want it to, tell me what has been happening.

→ [Book a consultation](/contact/)

### /fees-and-practicalities/

| Field | Value |
|---|---|
| Title tag | Therapy Fees & Practicalities \| Aggelos Mouzakitis (50 characters) |
| Meta description | Online therapy costs €100 or £90 for a standard session. Session length, frequency, languages, the free introductory call and longer couples sessions. (150 characters) |
| Canonical | https://aggelosmouzakitis.com/fees-and-practicalities/ |
| Breadcrumb | Home → Fees & Practicalities |
| Share card | img/og/v2/fees-and-practicalities.png (eyebrow and H1) |

**Eyebrow:** FEES & PRACTICALITIES  
**H1:** Fees and practicalities.

Individual psychotherapy sessions cost €100 or £90 and usually last 50–60 minutes. The introductory call is free, usually between 30 minutes and an hour.

→ [Book a consultation](/contact/)

#### Fees

| Service | Session format | Fee |
|---|---|---|
| Individual psychotherapy | Usually 50–60 minutes | €100 or £90 per session |
| Couples therapy | Usually 50–60 minutes | €100 or £90 per session |
| Couples therapy, longer format | Up to 90 minutes, every two weeks | Fee agreed before booking |
| Professional coaching | Format agreed before starting | €100 or £90 per session |

I confirm the fee and currency before we agree to begin. The fee for the longer couples session is agreed separately.

#### How often we meet

For individual psychotherapy, I normally work weekly for at least the first few months. We can review frequency later. There is no fixed number of sessions you must complete, and you can stop whenever you choose.

Couples sessions are normally weekly, or every two weeks in the longer format. Coaching arrangements depend on the professional question we are working on.

→ [Individual psychotherapy](/individual-psychotherapy/)  
→ [Couples therapy](/couples-therapy/)  
→ [Professional coaching](/professional-coaching/)

#### Online sessions and location

Sessions take place online by video. You need a reliable connection and somewhere you can speak without being overheard.

I work with clients in the UK and elsewhere in Europe, including Ireland and Greece. Tell me where you are currently located when you get in touch. I confirm whether I can work with you before ongoing therapy begins.

#### Languages

Sessions can be in English, in Greek or move between the two.

→ [Greek-speaking psychotherapy](/greek-speaking-psychotherapist/)

#### The first conversation

Send a short note about what brings you here and where you are located. I read it myself. If the situation fits what I offer, we arrange an introductory call.

The call gives us both a chance to consider whether working together makes sense before ongoing sessions are agreed.

→ [Considering therapy](/considering-therapy/)

#### Confidentiality

Psychotherapy is confidential within the professional and legal limits that apply. I explain those limits before ongoing work begins.

→ [Confidentiality](/confidentiality/)

#### Urgent help

I do not provide emergency psychiatric or crisis-response services. If you or somebody else is in immediate danger, contact the appropriate emergency service where you are located.

#### Contact

If you have a practical question that is specific to your situation, include it in your message.

→ [Book a consultation](/contact/)


### Preview locally

```
git fetch origin seo-phase-2
git checkout seo-phase-2
node scripts/build-public.js          # assembles public/, exactly what Netlify publishes
python3 -m http.server -d public 8080
```

Then open http://localhost:8080/therapy-for-men/, /therapy-for-software-engineers/ and /fees-and-practicalities/. `npm run seo:check` serves the same build with Netlify's redirect and header rules and checks it.

## 3. What changed

Commits on `seo-phase-2`, after `bdea0d0`:

| Commit | Purpose |
|---|---|
| `4f00220` | The three pages, navigation, edits to existing pages, guide links, structured data, llms.txt, share cards |
| `f7601f5` | Sitemap with the three new pages |
| `bce7d31` | Sitemap dates follow each page's own content |
| (this file) | This handover |

Source files, by purpose:

| Purpose | Files |
|---|---|
| Copy, navigation, metadata index | `content/canonical-copy.md` (pages 27–29, header and footer, edits to existing pages) |
| Copy pipeline | `scripts/copy/extract-canonical.py`: new URLs, link and navigation labels, a Markdown table block, page count no longer hard-coded. `scripts/copy/check-copy.py`: checks table cells. |
| Rendering | `site-pages.jsx`: table block via the articles' `ArticleTable`, named by its section heading; table styles shared from the article styles (`TABLE_CSS`) and loaded only on a page with a table; engineers Work & Life Check placement; the coaching contextual link. |
| Metadata and schema | `scripts/seo/site-meta.js` (page table, breadcrumbs, schema), `scripts/seo/seo-check.js` (bans `ProfessionalService`), `scripts/seo/routes.js` (route list) |
| Guides | `scripts/articles/articles.js` (two `contextLinks`) |
| Sitemap and llms.txt | `scripts/gen-sitemap.js`, `scripts/seo/gen-llms.js` |
| Comments only | `scripts/build-public.js`, `scripts/seo/prerender.js`, `scripts/seo/README.md` (no fixed page count) |

Generated files:
- `site-copy.jsx/.js`, `site-nav.jsx/.js`, `site-pages.js`
- two `article-*.jsx/.js` files
- 47 prerendered `index.html` files: the three new pages, plus the new menu and footer entries on every other page
- `/ask-me-anything/el`: menu entries and the `site-nav.js` stamp only. The Chromium serialisation difference on its iframe style was put back.
- `sitemap.xml`, `llms.txt`, three share cards

## 4. Verification

Run locally on the final state of the branch:

| Check | Result |
|---|---|
| Pipeline | copy → articles → page shells → metadata → JSX build → prerender → stamps → share cards → llms.txt → sitemap, in the README's order |
| Prerender | 47 pages, 0 JavaScript errors |
| `npm run seo:check` (the repo's test) | 46 pages, 0 errors. Covers: status codes; one H1; titles and descriptions unique; self-canonicals; Open Graph; JSON-LD parses with no banned types; FAQ questions and answers present on the page and marked up once; offers at the published fee; no broken or redirected internal links; no orphans; sitemap and robots; stamps; an unknown URL returns 404 |
| `npm run qa:routes` | 312 requests, 0 problems. The three new URLs return 200, and their slash-less forms are one 301 hop. |
| `python3 scripts/copy/check-copy.py` | 1,660 items, 0 differences (every sentence of the document on its page, in order; table cells included) |
| `npm run articles:check` | 14 articles match their briefs. The three unresolved internal-link placeholders predate this phase and stay hidden from the pages. |
| JSON-LD | 46 blocks parse; no `ProfessionalService` or `priceRange` anywhere |
| Sitemap | Valid XML, 46 URLs, served as `application/xml` |
| Placeholders | No TODO, `[CONFIRM]` or implementation directions in the pages, metadata, llms.txt or share cards |

Desktop (1280px) and mobile (375px), with Playwright on the three new pages, /work-with-me/ and /therapy-for-men-in-tech/:
- No horizontal overflow; one H1 per page.
- Paragraphs keep the site's measure (641px desktop).
- The fees table reads as a table on desktop and stacks into labelled rows on mobile.
- The practicalities rows are three columns on desktop and one on mobile.
- The FAQ accordion opens from the keyboard (focus, then Enter); the first question opens on load, as elsewhere.
- The header Services menu shows the two new audience links on desktop and in the mobile menu.
- The Work & Life Check sits after "Therapy with me" on the engineers page. Existing placements and photos are unchanged.

Not done in this phase:
- Production deployment: `main` is untouched.
- External validators (Schema.org validator, PageSpeed) and a live fetch: this session cannot reach the live domain.
- The brief's statement that Google retired FAQ rich results was not independently checked. FAQPage is kept only as vocabulary, derived from the visible answers.

## 5. Details only you can supply

None of these appear on the site as placeholders.

- Appointment hours and time zone
- The video platform, if you want it published
- Payment timing and method
- Cancellation terms
- Whether a client's company can pay, and what the invoice shows
- The fee for the longer (up to 90-minute) couples session
- The BACP public register URL, for `sameAs`, once it's available

## 6. Off-site consistency checklist

For you, on each profile:
- Psychology Today UK (1662603)
- Psychology Today Ireland (1667120)
- It's Complicated
- HeadsUpGuys
- MentorCruise (a mentoring profile, so only the name, background and link apply)

I couldn't open them from here, so check each against the site rather than against this list.

- [ ] **Name.** The site uses "Aggelos Mouzakitis". "Angelos" on It's Complicated is covered by the site's `alternateName`. Leave the account names as they are.
- [ ] **Registration.** "BACP-registered" (registered member), never "accredited".
- [ ] **Qualification.** MSc Integrative Counselling & Psychotherapy, University of Derby, matching the About page.
- [ ] **Fee.** €100 or £90 per standard session, with a free introductory call of 30 minutes to an hour. A listing showing a range (€100–120) is the one real factual difference.
- [ ] **Delivery.** Online by video, in English or Greek. Tick "online" or "teletherapy" wherever the directory offers it, so the city a directory requires isn't read as an in-person office.
- [ ] **Website link.** Every listing links to https://aggelosmouzakitis.com/. That link is what ties the listings to the site.
- [ ] **Google Business Profile.** No profile. Google's eligibility rules exclude businesses that serve customers only online, so don't create one at a directory city, a clinic or a virtual address. (This corrects my earlier suggestion of a service-area profile.)

## 7. Measuring whether the pages work

Use what is already installed: Google Analytics and Search Console. No new analytics.

- **Indexing.** Search Console, Pages: whether the three URLs are indexed after you resubmit the sitemap, and that none of them shows "Crawled, currently not indexed".
- **Queries.** Search Console, Performance, filtered to each page: impressions, clicks and the queries that reach them. The fees page should collect fee and price questions; the men and engineers pages broader and role-specific queries. Compare four weeks after indexing with the four weeks before.
- **Consultation clicks.** In GA4, page paths that precede a /contact/ visit; on the engineers page, the Work & Life Check source `engineers-compact`.
- **Enquiries.** Note which page an enquiry mentions or came through. A handful of qualified enquiries from these pages matters more than page views. More pages is not evidence of demand.
