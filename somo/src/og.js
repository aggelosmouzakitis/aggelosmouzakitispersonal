/*
 * SOMO — Open Graph images + favicon PNGs, rendered with Playwright.
 * Produces /assets/img/og/somo-<page>-<lang>.png (1200x630) plus favicon.png
 * and apple-touch-icon.png, all in the site's own visual language.
 * Run after build:  node somo/src/og.js
 */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OGDIR = path.join(ROOT, 'assets', 'img', 'og');
fs.mkdirSync(OGDIR, { recursive: true });

const DICTS = { el: require('./i18n/el'), en: require('./i18n/en') };
const PAGES = ['home', 'circles', 'flow', 'outdoors', 'organisations', 'about', 'safety', 'privacy', 'participation'];
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ogContent(t, page) {
  switch (page) {
    case 'home': return { kicker: t.home.hero.eyebrow, title: t.htmlLang === 'el' ? 'Μικρές ομαδικές εμπειρίες με το σώμα και την ομάδα' : 'Small group experiences for the body and the group', sub: '' };
    case 'circles': return { kicker: t.products.circles.kind, title: 'Somo Circles', sub: t.products.circles.oneLiner };
    case 'flow': return { kicker: t.products.flow.kind + ' · ' + t.common.soon, title: 'Somo Flow', sub: t.products.flow.oneLiner };
    case 'outdoors': return { kicker: t.products.outdoors.kind, title: 'Somo Outdoors', sub: t.products.outdoors.oneLiner };
    case 'organisations': return { kicker: t.nav.organisations, title: t.organisations.hero.h1, sub: '' };
    case 'about': return { kicker: t.about.hero.eyebrow, title: t.about.hero.h1, sub: '' };
    case 'safety': return { kicker: t.safety.hero.eyebrow, title: t.safety.hero.h1, sub: '' };
    case 'privacy': return { kicker: t.privacy.eyebrow, title: t.privacy.title, sub: '' };
    case 'participation': return { kicker: t.participation.eyebrow, title: t.participation.title, sub: '' };
    default: return { kicker: 'SOMO', title: 'SOMO', sub: '' };
  }
}

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=Roboto+Mono:wght@400;500&display=swap';

function ogTemplate(c, langLabel) {
  const titleSize = c.title.length > 34 ? 78 : (c.title.length > 18 ? 96 : 132);
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{background:#F2ECDF;color:#17130D;font-family:'Inter',sans-serif;
  padding:76px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.top{display:flex;align-items:center;justify-content:space-between}
.brand{font-family:'Roboto Mono',monospace;font-weight:700;font-size:34px;letter-spacing:.02em}
.brand .dot{color:#E7500E}
.badge{font-family:'Roboto Mono',monospace;font-size:20px;letter-spacing:.16em;text-transform:uppercase;color:#6B6250}
.mid{max-width:1040px}
.kicker{font-family:'Roboto Mono',monospace;font-size:24px;letter-spacing:.16em;text-transform:uppercase;color:#E7500E;font-weight:500;margin-bottom:26px}
.title{font-weight:800;letter-spacing:-.03em;line-height:1.0;font-size:${titleSize}px}
.title .dot{color:#E7500E}
.sub{margin-top:26px;font-size:30px;line-height:1.35;color:#4A4335;max-width:900px;font-weight:400}
.foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid #CDBFA2;padding-top:26px}
.foot .l,.foot .r{font-family:'Roboto Mono',monospace;font-size:20px;letter-spacing:.1em;text-transform:uppercase;color:#6B6250}
</style></head><body>
<div class="top"><div class="brand">SOMO<span class="dot">.</span></div><div class="badge">${esc(langLabel)}</div></div>
<div class="mid">
  <div class="kicker">${esc(c.kicker)}</div>
  <div class="title">${esc(c.title)}</div>
  ${c.sub ? `<div class="sub">${esc(c.sub)}</div>` : ''}
</div>
<div class="foot"><div class="l">SOMO · Athens</div><div class="r">${esc(langLabel === 'EN' ? 'Greek and English' : 'Ελληνικά και Αγγλικά')}</div></div>
</body></html>`;
}

const faviconTemplate = (size) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>*{margin:0;padding:0}html,body{width:${size}px;height:${size}px}
body{background:#17130D;display:flex;align-items:center;justify-content:center;position:relative}
.s{font-family:'Inter',sans-serif;font-weight:800;font-size:${Math.round(size * 0.62)}px;color:#F2ECDF;line-height:1}
.d{position:absolute;right:${Math.round(size * 0.2)}px;bottom:${Math.round(size * 0.29)}px;width:${Math.round(size * 0.12)}px;height:${Math.round(size * 0.12)}px;border-radius:50%;background:#E7500E}
</style></head><body><span class="s">S</span><span class="d"></span></body></html>`;

const MODE = process.argv[2] || 'all'; // 'all' | 'og' | 'favicons'

(async () => {
  const browser = await chromium.launch({ args: ['--ignore-certificate-errors'] });

  // OG cards
  if (MODE !== 'favicons') for (const lang of ['el', 'en']) {
    const t = DICTS[lang];
    const langLabel = lang === 'en' ? 'EN' : 'ΕΛ';
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const page of PAGES) {
      const p = await ctx.newPage();
      await p.setContent(ogTemplate(ogContent(t, page), langLabel), { waitUntil: 'networkidle' });
      await p.waitForTimeout(300);
      await p.screenshot({ path: path.join(OGDIR, `somo-${page}-${lang}.png`), clip: { x: 0, y: 0, width: 1200, height: 630 } });
      await p.close();
    }
    await ctx.close();
  }

  // Favicons
  if (MODE !== 'og') for (const [name, size] of [['favicon.png', 48], ['apple-touch-icon.png', 180]]) {
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.setContent(faviconTemplate(size), { waitUntil: 'networkidle' });
    await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(ROOT, 'assets', 'img', name), clip: { x: 0, y: 0, width: size, height: size }, omitBackground: false });
    await p.close();
    await ctx.close();
  }

  await browser.close();
  console.log('OG images + favicons generated in somo/assets/img');
})();
