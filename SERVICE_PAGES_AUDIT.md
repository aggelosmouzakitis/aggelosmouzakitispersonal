# Service pages audit: SEO and web development

25 October 2026. Pages: /individual-psychotherapy/, /couples-therapy/, /professional-coaching/, with /work-with-me/ as their hub. All measurements are taken from the build that is live on `main` (`51bbd37`).

## Summary

The technical side is in very good shape:
- Lighthouse: performance 96–100, accessibility 100, SEO 100.
- Clean HTML, one H1 per page, Service, FAQ and breadcrumb schema.
- Strong internal linking.

What holds the pages back is content: the words people search with, missing proof of who you are, and pages a little thinner than the competitors that rank. Fixing that means about 120–200 well-chosen words per page, not a rewrite. The blog can carry the long-form SEO; these pages need to answer "is this the right person for me, and how does it work?" in the language people search with.

## 1. What the search results look like

Searched 25 October 2026. My search tool is US-based, so treat this as indicative of Google UK and Ireland, not an exact ranking.

| Search | Who ranks | What it means for you |
|---|---|---|
| online psychotherapy UK / BACP online | BACP register profiles, Psychology Today, individual practitioners | Directory profiles compete directly. Your BACP register entry and your Psychology Today UK and Ireland profiles are ranking assets in their own right. |
| online couples counselling UK | Harley Therapy, Mindler, BetterHelp, Therapy Central, Relate, small practices | Page titles say "couples counselling", "relationship counselling" and "marriage counselling". Your couples page says "couples therapy" only. |
| online counselling Ireland | Psychology Today Ireland, the IACP directory | In Ireland "counselling" is the everyday word. Your Cork Psychology Today profile matters here. |
| career coaching for tech professionals UK | Marketplaces (MentorCruise, Leland, Upwork) and job-search coaches | Few serious pages cover career decisions for experienced tech people. This niche is open, but "professional coaching" is not what people type. They type "career coaching". |

Rankable practitioner pages usually run to 600–1,200 words, with an "about the therapist" block, fees, how online sessions work and an FAQ. Platforms (BetterHelp, Mindler) write 1,500+ words, but they are not your competition.

## 2. Page by page

| | Individual psychotherapy | Couples therapy | Professional coaching | Work With Me (hub) |
|---|---|---|---|---|
| Words in the page body | 560 | 538 | 439 | 344 |
| Average sentence | 14 words | 13 words | 17 words | 14 words |
| Flesch reading ease | ≈ 47 | ≈ 48 | ≈ 41 | ≈ 43 |
| Title | Online Individual Psychotherapy \| Aggelos Mouzakitis (52) | Online Couples Therapy \| Conflict, Distance & Work Pressure (59) | Professional Coaching for Tech & Career Decisions \| Aggelos Mouzakitis (**70, cut off in results**) | Psychotherapy, Couples Therapy & Coaching \| Aggelos Mouzakitis (62) |
| Meta description | 152 | 134 | 159 | **185, cut off** |
| H1 has the main term | Yes | Yes | Yes | No (fine for a hub) |
| Credentials in the body (BACP, MSc) | **No** | **No** | **No** | No |
| UK, Ireland or Europe in the body | **No** | **No** | **No** | No |
| "Counselling" anywhere | No | **No** | n/a | No |
| FAQ | 3 questions, FAQPage | 3 questions, FAQPage | **None** | None |
| Links in from other pages' text | 15 | 8 | 12 | 1 (plus menus) |
| Practicalities rows, fee, fees link | Yes | Yes | Yes | Fee, fees link |

Readability is good for the subject. Sentences average 13–17 words and the Flesch scores sit in the range normal for adult professional writing. Don't simplify the voice. The additions below keep the same register.

## 3. Web development findings

Lighthouse 13.5, local build served with Netlify's headers:

| Page | Mobile: perf / a11y / best practice / SEO | Desktop | Mobile LCP | Page weight |
|---|---|---|---|---|
| Individual psychotherapy | 96 / 100 / 96 / 100 | 100 / 100 / 96 / 100 | 2.4 s | 244 KiB |
| Couples therapy | 99 / 100 / 96 / 100 | 100 / 100 / 96 / 100 | 2.1 s | 221 KiB |
| Professional coaching | 99 / 100 / 96 / 100 | 100 / 100 / 96 / 100 | 2.1 s | 219 KiB |

- **Best practice 96: the charset declaration.** The page's `<meta charset>` comes after the inline analytics script. Netlify also sends the charset in its response header, so live pages are probably unaffected, but the fix is one line in the page-shell generator. Low priority.
- **Individual psychotherapy LCP of 2.4 s on simulated mobile.** That is under the 2.5 s "good" threshold, but close. The hero photo is the largest element. It already has `fetchpriority="high"` and responsive sizes, so nothing urgent.
- **Unused and unminified CSS.** Every page inlines the whole site's CSS, so some of it goes unused on each page. The cost is a few KiB; not worth a refactor.
- **Clean:** no layout shift (CLS 0), one H1, sensible heading order, self-canonical, Open Graph complete, JSON-LD valid, no broken links. The accordion, menus and tables work by keyboard and at phone width.

## 4. Recommendations, in priority order

### P1. Titles and descriptions (search wording, small change, likely the biggest gain)

| Page | Proposed title | Proposed description |
|---|---|---|
| Individual psychotherapy | Online Therapy with a BACP-Registered Psychotherapist (53) | Online individual psychotherapy in English or Greek for relationships, burnout, anxiety and decisions that stay stuck. UK, Ireland and Europe. €100 / £90. (154) |
| Couples therapy | Online Couples Therapy & Counselling \| Aggelos Mouzakitis (57) | Online couples therapy and counselling for recurring conflict, distance and relationships strained by work, in English or Greek. UK, Ireland and Europe. (152) |
| Professional coaching | Career Coaching for Tech Professionals \| Aggelos Mouzakitis (59) | Career and leadership coaching for experienced people in tech, startups and business with a real decision to make: leaving, going independent or stepping up. (157) |
| Work With Me | unchanged | Individual psychotherapy, couples therapy and professional coaching with Aggelos Mouzakitis, online in English or Greek, for clients in the UK and Europe. (154) |

Why:
- **Individual psychotherapy.** "Online therapy" and "psychotherapist" are what people search; "individual psychotherapy" rarely is. BACP in the title is a trust signal in the results.
- **Couples.** UK and Irish searchers say "counselling".
- **Coaching.** Searchers say "career coaching", and the current title is cut off.

The H1s and the menu labels stay as they are.

### P2. A short "My background" section on each service page (trust and expertise)

The audience pages have one; the service pages, where people decide, don't. It is the strongest trust signal you can add, and it also puts "counselling" on the page naturally through your MSc title. Draft wording:

**Individual psychotherapy**, before Practicalities:
> ## My background
> I am a BACP-registered psychotherapist with an MSc in Integrative Counselling & Psychotherapy from the University of Derby. Before psychotherapy, I spent more than 18 years in product and growth.
>
> **About me →**

**Couples therapy**, the same, with a second sentence for couples:
> ## My background
> I am a BACP-registered psychotherapist with an MSc in Integrative Counselling & Psychotherapy from the University of Derby. I work with couples online, in English or Greek.
>
> **About me →**

**Professional coaching**, before Practicalities:
> ## My background
> My coaching draws on more than 18 years in product and growth, including seven years running a consultancy and work with more than 100 technology companies. I am also a BACP-registered psychotherapist. If a decision turns out to be tied up with something more personal, we can talk about whether psychotherapy would fit better.
>
> **About me →**

### P3. Say where you work, once, in each page's Practicalities

Before the existing location sentence on all three pages:
> I work with clients in the UK, Ireland, Greece and elsewhere in Europe.

This matches the location searches ("online therapy UK", "online counselling Ireland"), and the facts are already on /faq/ and the fees page.

### P4. FAQ: answer the searches the pages currently miss

**Individual psychotherapy**, added to Common questions:
> ### Is this counselling or psychotherapy?
> People in the UK and Ireland often use the two words for similar work. My training covers both, with an MSc in Integrative Counselling & Psychotherapy, and we start with whatever brought you in, whichever word you use.
>
> ### Do you work with clients in Ireland and Greece?
> Yes, online. The UK is the main focus of the practice, and I also work with clients in Ireland, Greece and elsewhere in Europe. I confirm that I can work with you based on where you are located before ongoing therapy begins.

**Couples therapy**, added to Common questions:
> ### Is couples therapy the same as couples counselling?
> Mostly, yes. In the UK and Ireland, couples counselling, relationship counselling and couples therapy are often used for the same kind of work. What matters more is that both of you can attend and talk honestly about the relationship.

**Professional coaching**, a new "Common questions" section before Contact (it has none):
> ### How is this different from psychotherapy?
> Coaching stays with a professional question: the options, the trade-offs and what to do next. If the decision is tied up with anxiety, self-worth, relationships or a pattern that keeps repeating, psychotherapy gives us more room. I will say so if I think that is the better fit.
>
> ### How many sessions will I need?
> It depends on the decision. We agree the format and frequency before starting.
>
> ### Do you only work with people in tech?
> The service is designed for experienced people in tech, startups and business. If your situation is elsewhere, describe it when you get in touch and I will tell you whether it fits.

### Effect on length

| Page | Now | After P2–P4 |
|---|---|---|
| Individual psychotherapy | 560 | ≈ 690 |
| Couples therapy | 538 | ≈ 640 |
| Professional coaching | 439 | ≈ 640 |

That is within the range of practitioner pages that rank, with every addition answering a real question. I would not go further on these pages. Deeper topics belong in the blog, which already links to them.

### P5. Optional technical fixes

1. Put `<meta charset>` first in the page shell (one line, every page re-rendered).
2. Photographs on couples and coaching, only if you have suitable real ones (the site rules out stock).
3. Leave the per-page CSS alone; the gain is a few KiB.

## 5. Off-site, for these searches

- **Your BACP register entry, when it's live.** BACP profiles rank for "online psychotherapy UK" and "online therapy for men UK". Fill it in with the same terms (online, English or Greek, UK and Europe, individual and couples) and link to the site.
- **Psychology Today UK and Ireland.** Keep the fee, "online", languages and website link consistent with the site. The Ireland profile is the main way into "online counselling Ireland" searches.

## 6. How to tell whether it worked

In Search Console → Performance, filter by each page URL. Compare impressions and click-through for "online therapy", "couples counselling" and "career coaching" queries over the four weeks before the change and the four to six weeks after. If the click-through rate rises while positions hold, the titles are working.

## Sources

- [BACP register search for online therapists](https://www.bacp.co.uk/search/therapists?q=online)
- [BACP: Julie Burg](https://www.bacp.co.uk/therapists/381865/julie-burg)
- [Psychology Today UK: Anna Russell](https://www.psychologytoday.com/gb/counselling/anna-russell-london/1534665)
- [Harley Therapy: online relationship counselling](https://www.harleytherapy.co.uk/online-relationship-counselling.htm)
- [Mindler: online couples therapy](https://mindlercare.com/uk/online-therapy/online-couples-therapy/)
- [Clarity Wellbeing: online couples counselling UK](https://claritywellbeingclinic.co.uk/online-therapy/online-couples-counselling)
- [UK Therapy Guide: online couples therapy and marriage counselling](https://uktherapyguide.com/session-type/couples-counselling-therapy)
- [BetterTalk: couples counselling](https://bettertalk.uk/couples-counselling)
- [Psychology Today Ireland: counselling listings](https://www.psychologytoday.com/ie/counselling/d24)
- [IACP directory](https://iacp.ie/index.php/page/cookiecontrol/1/cGFnZS90aGVyYXBpc3RzP3N1cGVydj0xJmNvPTc4)
- [MentorCruise UK mentors](https://mentorcruise.com/country/gb)
- [Leland: software engineering career coaching](https://www.joinleland.com/coach/mark-k-1/p/advance-your-software-engineering-career)
- [igotanoffer: career coaching London](https://igotanoffer.com/en/career-coaching/city/uk/london)
