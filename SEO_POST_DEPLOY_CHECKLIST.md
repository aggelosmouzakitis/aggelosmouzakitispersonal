# Post-deploy SEO checklist

Everything here was verified locally against the built output. These commands
re-verify it against production, where host-level behaviour (TLS, `www`, real
404 status codes, TTFB) actually lives. Run them once the deploy is live.

Set the host once:

```bash
SITE=https://aggelosmouzakitis.com
```

---

## 1. Host, protocol and trailing slash

One canonical host, one URL format. Each should be a single hop to the https
apex URL.

```bash
for u in http://aggelosmouzakitis.com/ https://www.aggelosmouzakitis.com/ \
         http://www.aggelosmouzakitis.com/ ; do
  echo "== $u"; curl -sIL -o /dev/null -w '  hops=%{num_redirects} final=%{url_effective} code=%{http_code}\n' "$u"
done

# trailing slash: /about should reach /about/ and 200
curl -sIL -o /dev/null -w '/about -> %{url_effective} %{http_code} (hops %{num_redirects})\n' "$SITE/about"
```

Expect: every variant ends on `https://aggelosmouzakitis.com/...` with `200`.

## 2. The four retired URLs — one hop, 301, to a 200

```bash
for p in /psychotherapy-decision-coaching/ /career-strategy-consulting/ \
         /solopreneur-growth-consulting/ /start-here/ \
         /1-to-1/ /how-i-work /startingdiagnostic \
         /greek-speaking-therapist-london /greek-speaking-therapist-dublin; do
  printf '%-40s ' "$p"
  curl -sI "$SITE$p" | awk 'BEGIN{ORS=""} /^HTTP/{print $2" "} /^[Ll]ocation:/{print $2}'
  curl -sIL -o /dev/null -w '  | hops=%{num_redirects} final=%{http_code}\n' "$SITE$p"
done
```

Expect: `301 /work-with-me/ | hops=1 final=200` on every line.

## 3. Nonexistent URLs return a real 404

```bash
curl -sI "$SITE/definitely-not-a-page-$(date +%s)/" | head -1
curl -sI "$SITE/work-with-me/nope/" | head -1
```

Expect `HTTP/2 404`, not `200`.

## 4. robots.txt and sitemap

```bash
curl -s "$SITE/robots.txt"
curl -s "$SITE/sitemap.xml" | grep -c '<loc>'                    # expect 19
curl -s "$SITE/sitemap.xml" | grep -E 'start-here|psychotherapy-decision|career-strategy|solopreneur-growth|1-to-1'   # expect no output
curl -s "$SITE/sitemap.xml" | grep -c 'work-with-me'             # expect 1

# every sitemap URL must be 200 and self-canonical
curl -s "$SITE/sitemap.xml" | grep -o '<loc>[^<]*' | cut -c6- | while read -r u; do
  code=$(curl -sI -o /dev/null -w '%{http_code}' "$u")
  can=$(curl -s "$u" | grep -o '<link rel="canonical" href="[^"]*"' | head -1 | sed 's/.*href="//;s/"//')
  [ "$code" = 200 ] && [ "$can" = "$u" ] && echo "ok   $u" || echo "FAIL $u code=$code canonical=$can"
done
```

## 5. No X-Robots-Tag or CDN-level noindex

```bash
for p in / /work-with-me/ /about/ /free-tools/ /contact/; do
  printf '%-18s ' "$p"; curl -sI "$SITE$p" | grep -i 'x-robots-tag' || echo '(none — good)'
done
```

## 6. Raw HTML a crawler receives

Not the rendered DOM — the bytes.

```bash
for p in / /work-with-me/ /about/ /free-tools/ /reviews/ /wtf-friday/ \
         /ask-me-anything/ /contact/ /confidentiality/ \
         /free-tools/business-constraint/ /free-tools/strategy-or-execution/ \
         /free-tools/quit-your-job/ /free-tools/become-a-solopreneur/ /free-tools/burned-out/ \
         /therapy-for-founders/ /therapy-for-executives/ /imposter-syndrome-therapy/ \
         /executive-burnout-therapy/ /career-transition-therapy/; do
  h=$(curl -s "$SITE$p")
  printf '%-38s code=%s h1=%s title=%s desc=%s canon=%s ld=%s\n' "$p" \
    "$(curl -sI -o /dev/null -w '%{http_code}' "$SITE$p")" \
    "$(printf '%s' "$h" | grep -c '<h1')" \
    "$(printf '%s' "$h" | grep -c '<title>')" \
    "$(printf '%s' "$h" | grep -c 'name="description"')" \
    "$(printf '%s' "$h" | grep -c 'rel="canonical"')" \
    "$(printf '%s' "$h" | grep -c 'application/ld+json')"
done
```

Expect `code=200 h1=1 title=1 desc=1 canon=1 ld=1` on every line.

```bash
# the Work with me FAQ must be in the HTML without clicking anything
curl -s "$SITE/work-with-me/" | grep -c 'covered by professional confidentiality'   # expect 1
# and the forces map must be text, not only a picture
curl -s "$SITE/work-with-me/" | grep -c 'What is making the current situation harder to tolerate'  # expect 1
```

## 7. Social images resolve

```bash
curl -s "$SITE/work-with-me/" | grep -o 'og:image" content="[^"]*"' | sed 's/.*content="//;s/"//' \
  | xargs -I{} curl -sI -o /dev/null -w 'og:image {} -> %{http_code}\n' {}
```

## 8. Submit to search engines

```bash
# Google Search Console — sitemap, then Live Test /work-with-me/
open "https://search.google.com/search-console"

# Bing Webmaster Tools — sitemap
open "https://www.bing.com/webmasters"

# IndexNow: confirm the key file is live BEFORE submitting
curl -s "$SITE/f4a06bec48967c20f68efb4d562c6b71.txt"   # must print the key, nothing else
npm run seo:indexnow                                    # all 19 canonical URLs

# tell IndexNow about the retired URLs too, so they get re-crawled and dropped
node scripts/seo/indexnow.js /psychotherapy-decision-coaching/ /career-strategy-consulting/ \
  /solopreneur-growth-consulting/ /start-here/
```

## 9. Validators (browser)

- Rich Results Test — <https://search.google.com/test/rich-results> — run `/`, `/work-with-me/`, `/about/`, `/free-tools/`, one tool page.
- Schema Markup Validator — <https://validator.schema.org/> — same URLs. Confirm one `Person` with `@id` ending `/#person` and no unresolved references.
- PageSpeed Insights — <https://pagespeed.web.dev/> — `/`, `/work-with-me/`, `/free-tools/` on **mobile**. Local CLS was 0.00 and LCP 64–136 ms; production TTFB is the number to watch.
- Facebook Sharing Debugger / LinkedIn Post Inspector — scrape `/work-with-me/` once so the new OG image is cached.

## 10. Watch for two weeks

- Search Console → Pages: the four retired URLs should move to **"Page with redirect"**, and `/work-with-me/` should be indexed.
- Search Console → Links: internal links to the retired URLs should fall to zero.
- Any `404` spike in Netlify analytics — check it is not a URL that should have been redirected.

---

## Re-running the local gate

Any future change should pass before deploying:

```bash
npm ci
npm run build
npm run seo:meta && npm run seo:sitemap
python3 -m http.server 8099 & node scripts/seo/prerender.js; kill %1
npm run seo:check
```
