const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const ROOT = '/home/user/aggelosmouzakitispersonal';
const pages = JSON.parse(fs.readFileSync('/tmp/og_pages.json','utf8'));

const tpl = (label, title) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1200px; height:630px; }
body { background:#1A1918; font-family:'DejaVu Sans Mono',monospace; color:#F4F2F0;
  padding:80px; display:flex; flex-direction:column; justify-content:space-between;
  border-top:8px solid #059669; }
.label { font-size:22px; letter-spacing:.18em; text-transform:uppercase; color:#059669; }
.title { font-size:62px; line-height:1.25; letter-spacing:-.01em; max-width:1040px;
  color:#F4F2F0; font-weight:normal; }
.title.small { font-size:48px; }
.foot { display:flex; align-items:center; gap:20px; }
.foot img { width:64px; height:64px; border-radius:50%; }
.foot .dom { font-size:24px; letter-spacing:.1em; color:rgba(244,242,240,.55); }
</style></head><body>
<div class="label">${label}</div>
<div class="title ${title.length>60?'small':''}">${title}</div>
<div class="foot"><img src="https://aggelosmouzakitis.com/img/aggelos.jpg"/><div class="dom">aggelosmouzakitis.com</div></div>
</body></html>`;

// Serve the local profile photo for the foot avatar
const photo = fs.readFileSync(ROOT + '/img/aggelos.jpg');

(async () => {
  const browser = await chromium.launch({ args:['--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport:{width:1200,height:630}, deviceScaleFactor:1, ignoreHTTPSErrors:true });
  await ctx.route(/aggelosmouzakitis\.com\/img\/aggelos\.jpg/, r => r.fulfill({ contentType:'image/jpeg', body: photo }));
  let n=0;
  for (const p of pages) {
    const page = await ctx.newPage();
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    await page.setContent(tpl(esc(p.label), esc(p.title)), { waitUntil:'load' });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${ROOT}/img/og/${p.key}.png`, clip:{x:0,y:0,width:1200,height:630} });
    await page.close(); n++;
  }
  await browser.close();
  console.log(`generated ${n} OG images`);
})();
