# Post-deploy checklist

Everything here was verified locally against the built `public/` through the
Netlify emulator (`npm run seo:check`, `npm run qa:routes`). These commands
re-verify it against production, where host-level behaviour (TLS, `www`, real
status codes, caching) actually lives. Run them once the deploy is live.

Set the host once:

```bash
SITE=https://aggelosmouzakitis.com
```

---

## 1. The deploy is this release

The homepage must load the bundles this commit stamped.

```bash
diff <(curl -s "$SITE/" | grep -o 'site-[a-z]*\.js?v=[0-9a-f]*' | sort) \
     <(grep -o 'site-[a-z]*\.js?v=[0-9a-f]*' index.html | sort) && echo "live = repo"
```

## 2. Every route, one command

The same table the local gate uses (`scripts/seo/routes.js`), requested from
production: the 25 canonical pages, 3 tools and the articles in
`scripts/articles/articles.js` (200, bare form one hop to the
slash), every legacy URL (301 in one hop to a 200, or 410), the 28 old essays,
`/ask-me-anything/el` (200), real 404s for URLs that never existed, and every
repository internal (404).

```bash
node scripts/qa-routes.js --live "$SITE"
```

Expect `0 problem(s)` on the last line.

## 3. Host and protocol

Each variant should be a single hop to the https apex URL.

```bash
for u in http://aggelosmouzakitis.com/ https://www.aggelosmouzakitis.com/ \
         http://www.aggelosmouzakitis.com/ ; do
  echo "== $u"; curl -sIL -o /dev/null -w '  hops=%{num_redirects} final=%{url_effective} code=%{http_code}\n' "$u"
done
```

## 4. robots.txt, sitemap, llms.txt

```bash
curl -s "$SITE/robots.txt" | grep -i '^sitemap'                 # the sitemap URL
curl -s "$SITE/sitemap.xml" | grep -c '<loc>'                    # expect 30 (28 + 2 articles)
curl -sI "$SITE/llms.txt" | head -1                              # 200

# every sitemap URL must be 200 and self-canonical
curl -s "$SITE/sitemap.xml" | grep -o '<loc>[^<]*' | cut -c6- | while read -r u; do
  code=$(curl -sI -o /dev/null -w '%{http_code}' "$u")
  can=$(curl -s "$u" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//;s/"//')
  [ "$code" = 200 ] && [ "$can" = "$u" ] && echo "ok   $u" || echo "FAIL $u code=$code canonical=$can"
done
```

## 5. Indexing headers

```bash
# canonical pages: no X-Robots-Tag
for p in / /individual-psychotherapy/ /therapy-vs-coaching/ /contact/; do
  printf '%-28s ' "$p"; curl -sI "$SITE$p" | grep -i 'x-robots-tag' || echo '(none — good)'
done
# printed QR codes: served, never indexed
curl -sI "$SITE/ask-me-anything/el" | grep -i 'x-robots-tag'     # noindex, follow
# the private archive
curl -sI "$SITE/archive/" | grep -i 'x-robots-tag'                # noindex, nofollow, noarchive
```

## 6. Raw HTML a crawler receives

Not the rendered DOM — the bytes. Every sitemap URL:

```bash
curl -s "$SITE/sitemap.xml" | grep -o '<loc>[^<]*' | cut -c6- | while read -r u; do
  h=$(curl -s "$u")
  n() { printf '%s' "$h" | grep -o "$1" | wc -l | tr -d ' '; }
  printf '%-62s h1=%s title=%s desc=%s canon=%s ld=%s\n' "$u" \
    "$(n '<h1')" "$(n '<title>')" "$(n 'name="description"')" "$(n 'rel="canonical"')" "$(n 'application/ld+json')"
done
```

Expect `h1=1 title=1 desc=1 canon=1` on every line and `ld` of at least 1.

## 7. Social images resolve

```bash
for p in / /individual-psychotherapy/ /therapy-vs-coaching/; do
  curl -s "$SITE$p" | grep -o 'og:image" content="[^"]*"' | sed 's/.*content="//;s/"//' \
    | xargs -I{} curl -sI -o /dev/null -w "$p og:image {} -> %{http_code}\n" {}
done
```

## 8. Leads: the forms, once each, by hand

The automated QA stubs EmailJS and the sheet, so delivery itself is only proven
in production. First make the EmailJS dashboard changes in
`content/emails/EMAILJS.md` (sections 1–4). The owner template's recipient and
the Work & Life Check result content live only there.

Then open each page with `?leaddebug=1`. The panel that appears after
submitting shows each operation's outcome.

1. `/contact/?leaddebug=1`: send one enquiry with Name `WEBSITE FORM TEST`,
   your own address, and Message `Automated final QA test. Safe to ignore.`
   Expect "Thanks. Your message has been sent." and
   `sheet ok · owner ok · reply skipped`, then:
   - a new row in the Leads tab
   - one `template_6mv5hou` send in EmailJS → History
   - the notification in the inbox, subject
     `New website enquiry — WEBSITE FORM TEST`, and Reply goes to the address
     you entered
2. `/work-life-check/?leaddebug=1`: complete the check with your own address.
   Expect `sheet ok · owner ok · reply ok`, the result on screen, and:
   - a row (Source `work-life-check`)
   - the notification `[Work & Life Check] <result> — <email>`
   - the result email `Your Work & Life Check result: <result>`: check the
     sender name, that Reply-To is `aggelos.mouzakitis@gmail.com`, and that
     the links open
   - repeat with the tie and low-signal answers listed in `EMAILJS.md`
3. `/free-tools/burned-out/?leaddebug=1` and `/free-tools/quit-your-job/`:
   one each. Expect a row and a `[TOOL] …` notification.

None of these subscribes the address to anything.

### GA4: register the Work & Life Check parameters

The check sends `work_life_check_view`, `_start`, `_complete`, `_email`,
`_consultation_click` and `_related_page_click` with `source_page`,
`primary_result`, `secondary_result`, `context_type` (and `result_type`,
`link_url`, and `email_delivery` on `_email`). Every form also sends
`lead_capture_error` (`source`, `stage`, `error_detail`) when a sheet write or
an email fails. GA4 only reports custom parameters once they are registered:
Admin → Custom definitions → Create custom dimension (scope: Event) for each.

## 9. Submit to search engines

```bash
# Google Search Console — resubmit the sitemap; Live Test / and /therapy-vs-coaching/
open "https://search.google.com/search-console"

# Bing Webmaster Tools — resubmit the sitemap
open "https://www.bing.com/webmasters"

# IndexNow: confirm the key file is live BEFORE submitting
curl -s "$SITE/f4a06bec48967c20f68efb4d562c6b71.txt"   # must print the key, nothing else
npm run seo:indexnow                                    # every sitemap URL (30)

# the retired URLs too, so they get re-crawled and dropped
node scripts/seo/indexnow.js $(node -e "const {LEGACY}=require('./scripts/seo/routes.js');console.log(LEGACY.filter((r)=>r[1]===301||r[1]===410).map((r)=>r[0]).join(' '))")
```

## 10. Validators (browser)

- Rich Results Test — <https://search.google.com/test/rich-results> — `/`,
  `/individual-psychotherapy/`, `/therapy-vs-coaching/`, `/about/`,
  `/free-tools/burned-out/`, `/work-life-check/`, and each article
  (`/work-anxiety/`, `/burnout-at-work/`): one valid `BlogPosting` with the visible date, no
  `FAQPage`.
- Schema Markup Validator — <https://validator.schema.org/> — same URLs. One
  `Person` with `@id` ending `/#person`; no `Service` on `/therapy-vs-coaching/`.
- PageSpeed Insights — <https://pagespeed.web.dev/> — `/`,
  `/individual-psychotherapy/`, `/contact/` on **mobile**.
- Facebook Sharing Debugger / LinkedIn Post Inspector — scrape `/` and
  `/therapy-vs-coaching/` so the new Open Graph images are cached.

## 11. Watch for two weeks

- Search Console → Pages: the retired URLs move to **"Page with redirect"** (or
  drop out, for the 410s); `/therapy-vs-coaching/` gets indexed.
- Search Console → Links: internal links to retired URLs stay at zero.
- Any `404` spike in Netlify analytics — check it is not a URL that should
  have been redirected (add it to `netlify.toml` and `scripts/seo/routes.js`).

---

## Re-running the local gate

The full pipeline and its order are in `scripts/seo/README.md`. Before any
deploy, at least:

```bash
npm run seo:check          # builds public/, then checks it
npm run qa:routes          # every route through the Netlify emulator
python3 scripts/copy/check-copy.py
```
