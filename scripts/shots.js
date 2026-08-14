const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const OUT = '/tmp/shots';
fs.mkdirSync(OUT, { recursive: true });
const reactJs = fs.readFileSync('/home/user/aggelosmouzakitispersonal/node_modules/react/umd/react.production.min.js', 'utf8');
const reactDomJs = fs.readFileSync('/home/user/aggelosmouzakitispersonal/node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');
const shots = [
  { url: 'index.html', name: 'home-desktop', w: 1280, h: 1400 },
  { url: '1-to-1/index.html', name: '1to1-desktop', w: 1280, h: 1500 },
  { url: 'el/index.html', name: 'home-el-desktop', w: 1280, h: 1400 },
  { url: 'index.html', name: 'home-mobile', w: 390, h: 1600, mobile: true },
  { url: 'blog/index.html', name: 'blog-desktop', w: 1280, h: 900 },
  { url: 'reviews/index.html', name: 'reviews-desktop', w: 1280, h: 1100 },
  { url: 'el/burnout-diagnostic/index.html', name: 'el-diagnostic', w: 1280, h: 1000 },
  { url: 'el/index.html', name: 'home-el-mobile', w: 390, h: 1500, mobile: true },
];
(async () => {
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, ignoreHTTPSErrors: true, deviceScaleFactor: 1 });
    await ctx.route('**/*', (r) => {
      const u = r.request().url();
      if (/react-dom(\.production\.min)?\.js|react-dom@18/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: reactDomJs });
      if (/(^|\/)react(\.production\.min)?\.js|react@18/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: reactJs });
      if (/googletagmanager|emailjs|calendly/.test(u)) return r.fulfill({ contentType: 'application/javascript', body: 'window.Calendly={initInlineWidgets(){}};' });
      if (u.startsWith('http://localhost')) return r.continue();
      return r.abort();
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:8099/' + s.url, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: false });
    console.log('shot', s.name);
    await ctx.close();
  }
  await browser.close();
})();
