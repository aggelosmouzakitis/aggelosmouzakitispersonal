const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const ROOT = '/home/user/aggelosmouzakitispersonal';
const reactJs = fs.readFileSync(ROOT + '/node_modules/react/umd/react.production.min.js', 'utf8');
const reactDomJs = fs.readFileSync(ROOT + '/node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');

// Every page the site serves: the 24 canonical pages (site-pages.js, from
// scripts/seo/site-meta.js), the two free tools, and the served pages that are
// deliberately outside the sitemap (EXTRA).
const EXTRA = [
  'ask-me-anything/el/index.html', // printed QR codes — noindex, see the page
];
const PAGES = require('./site-meta.js').PAGES.map((p) => p.file).concat(EXTRA);

function injectPrerender(html, inner) {
  // Replace #root (empty or already-populated) with the captured innerHTML.
  // Non-greedy up to the first </div> that is followed by <script (the real root close).
  const re = /<div id="root">[\s\S]*?<\/div>(\s*<script)/;
  if (!re.test(html)) throw new Error('root anchor not found');
  return html.replace(re, (m, g1) => '<div id="root">' + inner + '</div>' + g1);
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

  const report = [];

  for (const f of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e)));
    await page.goto('http://localhost:8099/' + f, { waitUntil: 'load' });
    // Wait for React to render real content
    try { await page.waitForFunction(() => {
      const r = document.getElementById('root');
      return r && r.innerText && r.innerText.trim().length > 200;
    }, { timeout: 8000 }); } catch (e) {}
    await page.waitForTimeout(350);

    // Settle every motion primitive before capturing. The snapshot is what a
    // crawler and a JS-disabled visitor get, so it has to be the finished page:
    // no half-drawn SVG, nothing still waiting on an IntersectionObserver that
    // will never fire because nothing ever scrolls here.
    await page.evaluate(() => {
      document.querySelectorAll('[stroke-dashoffset]').forEach((el) => el.setAttribute('stroke-dashoffset', '0'));
      document.querySelectorAll('[data-mo]').forEach((el) => el.classList.add('is-in'));
    });
    await page.waitForTimeout(60);

    // Capture pre-render HTML and write it back into the page's #root
    const inner = await page.evaluate(() => document.getElementById('root').innerHTML);
    const filePath = ROOT + '/' + f;
    fs.writeFileSync(filePath, injectPrerender(fs.readFileSync(filePath, 'utf8'), inner));

    report.push({ file: f, prerenderChars: inner.length, jsErrors: errs });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})();
