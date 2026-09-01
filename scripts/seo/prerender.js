const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const ROOT = '/home/user/aggelosmouzakitispersonal';
const reactJs = fs.readFileSync(ROOT + '/node_modules/react/umd/react.production.min.js', 'utf8');
const reactDomJs = fs.readFileSync(ROOT + '/node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');

// page key -> { file, url, faq: bool }
// Core pages (renderApp-based) — English at root, Greek under /el/.
// Legacy persona/service pages are 301-redirected and no longer prerendered.
const PAGES = [
  // Core — English
  { f: 'index.html', faq: false },
  { f: '1-to-1/index.html', faq: false },
  { f: 'about/index.html', faq: false },
  { f: 'reviews/index.html', faq: false },
  { f: 'book/index.html', faq: false },
  { f: 'confidentiality/index.html', faq: false },
  // Core — Greek (/el/) — same indexable prerender path as English (brief §57)
  { f: 'el/index.html', faq: false },
  { f: 'el/1-to-1/index.html', faq: false },
  { f: 'el/about/index.html', faq: false },
  { f: 'el/reviews/index.html', faq: false },
  { f: 'el/book/index.html', faq: false },
  { f: 'el/confidentiality/index.html', faq: false },
  // Retained (out of nav, still indexable via their own inline SpecialtyPage mount)
  { f: 'blog/index.html', faq: false },
  { f: 'ask-me-anything/index.html', faq: false },
  { f: 'ask-me-anything/el/index.html', faq: false },
  { f: 'startingdiagnostic/index.html', faq: false },
  { f: 'el/startingdiagnostic/index.html', faq: false },
  { f: 'greek-speaking-therapist-london/index.html', faq: true },
  { f: 'greek-speaking-therapist-manchester/index.html', faq: true },
  { f: 'greek-speaking-therapist-new-york/index.html', faq: true },
  { f: 'greek-speaking-therapist-dublin/index.html', faq: true },
  // Restored English SEO landing pages (persona mounts + specialty SpecialtyPage mounts)
  { f: 'founders/index.html', faq: false },
  { f: 'solopreneurs/index.html', faq: false },
  { f: 'therapy-for-founders/index.html', faq: true },
  { f: 'therapy-for-executives/index.html', faq: true },
  { f: 'imposter-syndrome-therapy/index.html', faq: true },
  { f: 'executive-burnout-therapy/index.html', faq: true },
  { f: 'career-transition-therapy/index.html', faq: true },
  // Greek SEO landing pages (/el/*) — renderApp('el-…','el'), same indexable path
  { f: 'el/executive-coaching/index.html', faq: false },
  { f: 'el/burnout/index.html', faq: false },
  { f: 'el/career-coaching/index.html', faq: false },
  { f: 'el/imposter-syndrome/index.html', faq: false },
];

// Individual blog posts don't use the #root App shell — they're static articles
// that mount only the Sidebar into #sidebar-mount. Without a prerendered snapshot,
// the sidebar (including the "Work With Me" CTA) is invisible until the unpkg
// React/ReactDOM CDN scripts load, which is why it could look "missing" or
// inconsistent versus every other page (all of which have a baked-in fallback).
const BLOG_POST_FILES = fs.readdirSync(ROOT + '/blog', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => `blog/${d.name}/index.html`)
  .filter(f => fs.existsSync(ROOT + '/' + f));

function injectPrerender(html, inner) {
  // Replace #root (empty or already-populated) with the captured innerHTML.
  // Non-greedy up to the first </div> that is followed by <script (the real root close).
  const re = /<div id="root">[\s\S]*?<\/div>(\s*<script)/;
  if (!re.test(html)) throw new Error('root anchor not found');
  return html.replace(re, (m, g1) => '<div id="root">' + inner + '</div>' + g1);
}

function injectSidebarPrerender(html, inner) {
  const re = /<div id="sidebar-mount">[\s\S]*?<\/div>(\s*<div id="content-area")/;
  if (!re.test(html)) throw new Error('sidebar-mount anchor not found');
  return html.replace(re, (m, g1) => '<div id="sidebar-mount">' + inner + '</div>' + g1);
}

(async () => {
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, ignoreHTTPSErrors: true });
  // Single comprehensive router (added last = highest priority). Serves React
  // locally, stubs analytics/booking, aborts other external hosts so prerender
  // is fast and never hangs on the network. Local (localhost) assets pass through.
  await ctx.route('**/*', (route) => {
    const url = route.request().url();
    if (/react-dom(\.production\.min)?\.js|react-dom@18/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: reactDomJs });
    if (/(^|\/)react(\.production\.min)?\.js|react@18/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: reactJs });
    if (/googletagmanager\.com|emailjs|calendly/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: 'window.emailjs={init(){},send(){return Promise.resolve()}};window.Calendly={initInlineWidgets(){},initBadgeWidget(){}};' });
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return route.continue();
    return route.abort(); // fonts, remote images, anything else external
  });

  const faqOut = {};
  const report = [];

  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto('http://localhost:8099/' + p.f, { waitUntil: 'load' });
    // Wait for React to render real content
    try { await page.waitForFunction(() => {
      const r = document.getElementById('root');
      return r && r.innerText && r.innerText.trim().length > 200;
    }, { timeout: 8000 }); } catch (e) {}
    if (p.f === 'blog/index.html') {
      try { await page.waitForSelector('.post-item', { timeout: 8000 }); } catch (e) {}
    }
    await page.waitForTimeout(350);

    // Capture pre-render HTML
    const inner = await page.evaluate(() => document.getElementById('root').innerHTML);

    // Extract FAQ pairs if applicable
    let faqs = [];
    if (p.faq) {
      faqs = await page.evaluate(() => {
        // Find the section whose h2 label mentions "question"
        const h2s = [...document.querySelectorAll('h2')];
        const label = h2s.find(h => /question/i.test(h.innerText));
        if (!label) return [];
        const section = label.closest('section') || label.parentElement;
        const out = [];
        // Each FaqItem = a div containing an h3 (question) + following content (answer)
        section.querySelectorAll('h3').forEach(h3 => {
          const q = h3.innerText.trim();
          // answer = text of the h3's parent minus the question
          const parent = h3.parentElement;
          let a = parent ? parent.innerText.replace(h3.innerText, '').trim() : '';
          if (q && a) out.push({ q, a });
        });
        return out;
      });
      faqOut[p.f] = faqs;
    }

    // Write pre-rendered HTML back to file
    const filePath = ROOT + '/' + p.f;
    let html = fs.readFileSync(filePath, 'utf8');
    html = injectPrerender(html, inner);
    fs.writeFileSync(filePath, html);

    report.push({ file: p.f, prerenderChars: inner.length, faqs: faqs.length, jsErrors: errs });
    await page.close();
  }

  for (const f of BLOG_POST_FILES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto('http://localhost:8099/' + f, { waitUntil: 'load' });
    try { await page.waitForFunction(() => {
      const m = document.getElementById('sidebar-mount');
      return m && m.innerText && m.innerText.trim().length > 20;
    }, { timeout: 8000 }); } catch (e) {}
    await page.waitForTimeout(500);

    const inner = await page.evaluate(() => document.getElementById('sidebar-mount').innerHTML);
    const filePath = ROOT + '/' + f;
    let html = fs.readFileSync(filePath, 'utf8');
    html = injectSidebarPrerender(html, inner);
    fs.writeFileSync(filePath, html);

    report.push({ file: f, prerenderChars: inner.length, jsErrors: errs });
    await page.close();
  }

  fs.writeFileSync('/tmp/faqs.json', JSON.stringify(faqOut, null, 2));
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})();
