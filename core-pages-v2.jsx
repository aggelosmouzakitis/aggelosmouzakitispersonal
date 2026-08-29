// core-pages-v2.jsx — redesigned Home / Why me (About) / Reviews.
// Loaded after site-chrome.js, before content-pages.js.
//
// These components are PRESENTATIONAL ONLY. Every string is passed in from
// content-pages.jsx via the `copy` prop (HOME / ABOUT / REVIEWS / REVIEWS_ITEMS
// / tUI), so no production wording is duplicated, invented or edited here.
// Exposes on window: HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS.

const V2 = window.SITE;
const v2Ext = { target: '_blank', rel: 'noopener noreferrer' };
const arr = (x) => (Array.isArray(x) ? x : []);

const HERO_NAME = { en: 'Hi, I’m Aggelos.', el: 'Γεια, είμαι ο Άγγελος.' };

// ─── Page-section CSS ────────────────────────────────────────────────────────
const PAGE_V2_CSS = `
/* Home hero — two columns: copy left, horizontal photograph right */
.home-hero{background:${V2.paper};padding-block:72px}
.home-hero__grid{min-height:590px;display:grid;grid-template-columns:minmax(min-content,1fr) minmax(380px,520px);gap:clamp(48px,5vw,72px);align-items:center}
html[lang="el"] .home-hero__grid{grid-template-columns:minmax(min-content,1fr) minmax(300px,520px)}
.home-hero__copy{min-width:0;align-self:center}
.home-hero__title{margin:0;font-family:${V2.display};font-weight:800;line-height:0.92;letter-spacing:-0.055em;color:${V2.ink};white-space:nowrap}
html[lang="en"] .home-hero__title{font-size:clamp(76px,6.4vw,92px)}
html[lang="el"] .home-hero__title{font-size:clamp(68px,5.6vw,82px);letter-spacing:-0.054em}
.home-hero__roles{margin-top:32px;font-size:19px;font-weight:600;line-height:1.45;color:${V2.ink2}}
.home-hero__photo{position:relative;width:100%;max-width:520px;margin:0;padding-left:12px;padding-bottom:12px;align-self:center;justify-self:end}
.home-hero__photo img{position:relative;z-index:2;display:block;width:100%;height:auto;aspect-ratio:3 / 2;object-fit:cover;object-position:50% 50%;border-radius:0;filter:grayscale(100%) contrast(1.06)}
.home-hero__photo-vertical{position:absolute;z-index:1;left:0;top:28px;bottom:0;width:12px;background:${V2.green}}
.home-hero__photo-horizontal{position:absolute;z-index:1;left:0;right:0;bottom:0;height:12px;background:${V2.green}}
@media (max-width:1100px){
  .home-hero{padding-block:64px 72px}
  .home-hero__grid,html[lang="el"] .home-hero__grid{min-height:0;grid-template-columns:1fr;gap:48px;align-items:start}
  .home-hero__copy{width:100%}
  .home-hero__photo{width:min(100%,720px);max-width:none;justify-self:start}
  html[lang="en"] .home-hero__title{font-size:clamp(64px,8.5vw,84px)}
  html[lang="el"] .home-hero__title{font-size:clamp(58px,7.6vw,76px)}
}
@media (max-width:600px){
  .home-hero{padding-block:48px 64px}
  .home-hero__grid{gap:36px}
  html[lang="en"] .home-hero__title,html[lang="el"] .home-hero__title{font-size:clamp(44px,12vw,58px);line-height:0.95;letter-spacing:-0.05em;white-space:normal;text-wrap:balance;max-width:100%}
  .home-hero__roles{margin-top:24px;font-size:17px}
  .home-hero__photo{width:100%;padding-left:8px;padding-bottom:8px}
  .home-hero__photo-vertical{top:20px;width:8px}
  .home-hero__photo-horizontal{height:8px}
}

/* Home sections */
.sec{padding-block:clamp(64px,8vw,96px)}
.sec--tight{padding-top:0}
.sec__n{font-size:13px;font-weight:700;letter-spacing:0.12em;color:${V2.green}}
.sec__h{margin:16px 0 16px;max-width:19ch;font-family:${V2.display};font-size:clamp(44px,4.8vw,68px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#fff;text-wrap:balance}
.sec__sub{margin:0 0 48px;max-width:52ch;font-size:19px;line-height:1.6;color:${V2.onDark}}
.offer{background:${V2.ink};border-radius:12px;padding:clamp(32px,4.5vw,68px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,0.85fr);gap:clamp(40px,6vw,80px);align-items:start;margin-top:64px}
.offer__eyebrow{font-size:21px;font-weight:700;line-height:1.25;color:${V2.green};max-width:34ch}
.offer__h{margin:22px 0 0;font-family:${V2.display};font-size:clamp(44px,4.6vw,66px);font-weight:800;line-height:0.98;letter-spacing:-0.045em;color:#fff;max-width:16ch;text-wrap:pretty}
.offer p{margin:0;font-size:18px;line-height:1.55;color:#fff;max-width:48ch}
.offer p + p{margin-top:22px;font-weight:600}
.offer .pill--green{margin-top:32px}
.offer__micro{margin-top:20px!important;font-size:15px!important;font-weight:400!important;color:${V2.onDark}!important}
.panel-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.panel{border-radius:12px;padding:clamp(32px,4.5vw,56px);display:grid;align-content:start;gap:24px;min-width:0}
.panel h3{margin:0;font-family:${V2.display};font-size:clamp(30px,3vw,40px);font-weight:800;line-height:0.98;letter-spacing:-0.035em}
.panel ul{margin:0;padding-left:20px;display:grid;gap:12px}
.panel li{font-size:18px;line-height:1.55}
.panel--paper{background:${V2.paper};color:${V2.ink}}
.panel--black{background:${V2.black};color:#fff}
.sec__after{margin:32px 0 0;max-width:62ch;font-size:18px;line-height:1.65;color:#fff}
.recog{columns:2;column-gap:64px;color:#fff}
.recog p{break-inside:avoid;margin:0 0 20px;font-size:18px;line-height:1.6;max-width:44ch}
.paper-panel{background:${V2.paper};color:${V2.ink};border-radius:12px;padding:clamp(32px,5vw,72px);min-height:440px;display:flex;align-items:center}
.paper-panel__n{font-size:13px;font-weight:700;letter-spacing:0.12em;color:${V2.green}}
.paper-panel h2{margin:16px 0 0;max-width:20ch;font-family:${V2.display};font-size:clamp(40px,4.2vw,58px);font-weight:760;line-height:1.02;letter-spacing:-0.04em;color:${V2.ink}}
.paper-panel p{margin:24px 0 0;font-size:18px;line-height:1.55;color:${V2.ink2};max-width:52ch}
.paper-panel__cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:32px;margin-top:32px}
.paper-panel__lbl{font-size:13px;font-weight:700;letter-spacing:0.12em;color:${V2.green}}
.paper-panel__more{display:inline-flex;gap:8px;margin-top:28px;font-weight:700;color:${V2.ink};border-bottom:2px solid ${V2.green};padding-bottom:2px}
.rule-arrow{display:flex;align-items:center;gap:10px;width:min(320px,60%);margin:0 0 48px}
.rule-arrow div{flex:1;height:2px;background:${V2.green}}
.rule-arrow span{color:${V2.green};line-height:1}
.media{display:grid;grid-template-columns:7fr 5fr;grid-template-rows:repeat(2,minmax(0,1fr));min-height:520px;border-radius:12px;overflow:hidden}
.media__cell{padding:clamp(32px,3.5vw,56px);display:flex;flex-direction:column;justify-content:space-between;gap:32px;min-width:0;transition:background .18s,filter .18s}
.media__cell h3{margin:0;font-family:${V2.display};font-weight:800;line-height:0.9;letter-spacing:-0.045em}
.media__top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}
.media__arw{font-size:38px;line-height:1;transition:transform .18s}
.media__cell:hover .media__arw{transform:translate(5px,-5px)}
.media__kicker{font-size:14px;font-weight:700;letter-spacing:0.12em;margin-bottom:16px}
.media__cell p{margin:0;font-size:18px;line-height:1.55;max-width:36ch}
.media__read{grid-row:1 / span 2;background:${V2.green};color:#fff}
.media__read:hover{filter:brightness(0.9)}
.media__read h3{font-size:clamp(64px,6vw,92px)}
.media__watch{background:${V2.black};color:#fff}
.media__watch:hover{background:#0e0e0e}
.media__watch h3{font-size:clamp(44px,4vw,64px)}
.media__watch .media__arw{font-size:32px}
.media__follow{background:${V2.paper};color:${V2.ink}}
.media__follow h3{font-size:clamp(44px,4vw,64px)}
.icon-row{display:flex;align-items:center;gap:16px}
.icon-btn{width:48px;height:48px;border-radius:50%;background:${V2.ink};color:#fff;display:flex;align-items:center;justify-content:center;transition:background .18s,transform .18s}
.icon-btn:hover{background:${V2.green};transform:translateY(-3px)}
@media (max-width:1140px){.panel-2{grid-template-columns:1fr}}
@media (max-width:960px){
  .media{grid-template-columns:1fr;grid-template-rows:auto;min-height:0}
  .media__read{grid-row:auto}
  .media__cell{min-height:320px}
}
@media (max-width:900px){.offer{grid-template-columns:1fr;gap:36px}.offer__h{font-size:clamp(40px,11vw,54px);max-width:100%}}
@media (max-width:760px){.recog{columns:1}}

/* Why me */
.why-hero{background:${V2.paper};padding-block:96px 88px}
.why-hero__grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(360px,0.9fr);gap:80px;align-items:end}
.why-hero__over{font-size:13px;font-weight:700;letter-spacing:0.12em;color:${V2.green}}
.why-hero h1{margin:16px 0 0;max-width:13ch;font-family:${V2.display};font-size:clamp(58px,6vw,84px);font-weight:780;line-height:0.94;letter-spacing:-0.05em;color:${V2.ink}}
.why-hero__intro{margin:28px 0 0;max-width:56ch;font-size:19px;line-height:1.7;color:${V2.ink2}}
.why-hero__creds{margin-top:24px;font-size:15px;line-height:1.6;color:${V2.meta}}
.why-hero img{display:block;width:100%;height:auto;aspect-ratio:4 / 5;object-fit:cover;object-position:50% 40%;border-radius:12px}
.cred-row{display:grid;grid-template-columns:72px minmax(220px,0.7fr) 1.3fr;gap:32px;padding:32px 0;border-top:1px solid ${V2.rule};align-items:start}
.cred-row:last-of-type{border-bottom:1px solid ${V2.rule}}
.cred-row__n{font-family:${V2.display};font-size:20px;font-weight:800;color:${V2.green}}
.cred-row h3{margin:0;font-family:${V2.display};font-size:24px;font-weight:800;line-height:1.1;letter-spacing:-0.03em;color:${V2.ink}}
.cred-row p{margin:0;font-size:18px;line-height:1.6;color:${V2.ink2}}
@media (max-width:900px){.why-hero{padding-block:64px 56px}.why-hero__grid{grid-template-columns:1fr;gap:40px}}
@media (max-width:700px){.cred-row{grid-template-columns:1fr;gap:12px}}

/* Reviews */
.rev-hero{background:${V2.paper};padding-block:96px 72px}
.rev-hero__grid{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);gap:80px;align-items:start}
.rev-hero h1{margin:0;font-family:${V2.display};font-size:clamp(52px,5.6vw,80px);font-weight:780;line-height:0.94;letter-spacing:-0.05em;color:${V2.ink}}
.rev-hero__lead{margin:0 0 16px;font-size:20px;line-height:1.6;color:${V2.ink2};max-width:60ch}
.rev-hero__note{font-size:15px;line-height:1.6;color:${V2.meta}}
.rev-feature{max-width:24ch;margin:64px 0 0;padding-top:32px;border-top:4px solid ${V2.green};font-family:${V2.display};font-size:clamp(34px,4.2vw,54px);font-weight:750;line-height:1.1;letter-spacing:-0.035em;color:${V2.ink};text-wrap:pretty}
.rev-feature__who{margin-top:24px;font-family:${V2.body};font-size:14px;font-weight:400;letter-spacing:0;color:${V2.meta}}
.rev-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:64px}
.rev-item{border-top:1px solid ${V2.rule};padding:40px 0 56px;min-width:0}
.rev-item p{margin:0;font-size:20px;line-height:1.65;color:${V2.ink}}
.rev-item__who{margin-top:24px;font-size:14px;color:${V2.meta}}
.rev-item button{margin-top:16px;background:none;border:0;padding:0;cursor:pointer;font-family:inherit;font-size:14px;font-weight:600;color:${V2.green}}
.rev-item__orig{margin-top:16px!important;padding-top:16px;border-top:1px solid ${V2.rule};font-size:16px!important;line-height:1.7!important;color:${V2.meta}!important;font-style:italic}
@media (max-width:900px){.rev-hero{padding-block:64px 56px}.rev-hero__grid{grid-template-columns:1fr;gap:32px}}
@media (max-width:800px){.rev-grid{grid-template-columns:1fr}}
`;
function PageV2Styles() {
  return React.createElement('style', { dangerouslySetInnerHTML: { __html: PAGE_V2_CSS } });
}

// ─── HOME ────────────────────────────────────────────────────────────────────
function HomePageV2({ lang = 'en', copy }) {
  const c = (copy && copy.home) || {};
  const u = (copy && copy.ui) || {};
  const t = window.cT(lang);
  const el = lang === 'el';
  const media = el
    ? { intro: 'Θέλεις να δεις πώς σκέφτομαι;',
        read: 'Κείμενα για τη δουλειά, τη φιλοδοξία, την ψυχολογία και εκεί που μπλέκονται.',
        watch: 'Βίντεο και συζητήσεις για την επιχείρηση, την καριέρα και το κομμάτι που γίνεται προσωπικό.' }
    : { intro: 'Want to see how I think?',
        read: 'Essays about work, ambition, psychology and where they overlap.',
        watch: 'Videos and conversations about business, career and the part that gets personal.' };

  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'home', lang }),
    React.createElement('main', null,

      React.createElement('section', { className: 'home-hero' },
        React.createElement('div', { className: 'site-container home-hero__grid' },
          React.createElement('div', { className: 'home-hero__copy' },
            React.createElement('h1', { className: 'home-hero__title' }, HERO_NAME[lang] || HERO_NAME.en),
            React.createElement('div', { className: 'home-hero__roles' },
              React.createElement('div', null, t.role1),
              React.createElement('div', null, t.role2)
            )
          ),
          React.createElement('figure', { className: 'home-hero__photo' },
            React.createElement('span', { className: 'home-hero__photo-vertical' }),
            React.createElement('span', { className: 'home-hero__photo-horizontal' }),
            React.createElement('img', {
              src: '/img/aggelos-homepage.webp', alt: u.imgAlt || 'Aggelos Mouzakitis',
              width: 1560, height: 1040, loading: 'eager', fetchpriority: 'high', decoding: 'async',
            })
          )
        )
      ),

      React.createElement('section', { style: { background: V2.paper, paddingBottom: 96 } },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'offer' },
            React.createElement('div', null,
              React.createElement('div', { className: 'offer__eyebrow' }, c.tagline),
              React.createElement('h2', { className: 'offer__h' }, c.promise)
            ),
            React.createElement('div', null,
              React.createElement('p', null, c.introA),
              React.createElement('p', null, c.introB),
              React.createElement('a', { className: 'pill pill--green', href: window.cPath('diagnostic', lang) },
                React.createElement('span', null, t.ctaBtn), React.createElement('span', null, '→')),
              React.createElement('p', { className: 'offer__micro' }, c.introC)
            )
          )
        )
      ),

      React.createElement('section', { className: 'sec' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'sec__n' }, '01'),
          React.createElement('h2', { className: 'sec__h' }, c.bvyHead),
          c.bvySub ? React.createElement('p', { className: 'sec__sub' }, c.bvySub) : null,
          React.createElement('div', { className: 'panel-2' },
            React.createElement('div', { className: 'panel panel--paper' },
              React.createElement('h3', null, c.bizLabel),
              React.createElement('ul', null, arr(c.bvyBusiness).map((x, i) => React.createElement('li', { key: i }, x)))
            ),
            React.createElement('div', { className: 'panel panel--black' },
              React.createElement('h3', null, c.youLabel),
              React.createElement('ul', null, arr(c.bvyYou).map((x, i) => React.createElement('li', { key: i }, x)))
            )
          ),
          React.createElement('p', { className: 'sec__after' }, c.bvyUnder)
        )
      ),

      React.createElement('section', { className: 'sec sec--tight' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'sec__n' }, '02'),
          React.createElement('h2', { className: 'sec__h', style: { marginBottom: 48 } }, c.recogLabel),
          React.createElement('div', { className: 'recog' },
            arr(c.recog).map((x, i) => React.createElement('p', { key: i }, x))
          )
        )
      ),

      React.createElement('section', { className: 'sec sec--tight' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'paper-panel' },
            React.createElement('div', null,
              React.createElement('div', { className: 'paper-panel__n' }, '03'),
              React.createElement('h2', null, c.oneRelHead),
              React.createElement('div', { className: 'paper-panel__cols' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'paper-panel__lbl' }, c.bizLabel),
                  React.createElement('p', null, c.oneRelBizList),
                  React.createElement('p', { style: { fontWeight: 600 } }, c.oneRelBizQ)
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'paper-panel__lbl' }, c.youLabel),
                  React.createElement('p', null, c.oneRelYouList),
                  React.createElement('p', { style: { fontWeight: 600 } }, c.oneRelYouQ)
                )
              ),
              React.createElement('p', null, c.oneRelNote1),
              React.createElement('p', { style: { fontWeight: 600 } }, c.oneRelNote2),
              React.createElement('a', { className: 'paper-panel__more', href: window.cPath('one-to-one', lang) },
                (u.seeOneToOne || '1:1') + ' →')
            )
          )
        )
      ),

      React.createElement('section', { className: 'sec sec--tight' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'sec__n' }, '04'),
          React.createElement('h2', { className: 'sec__h' }, media.intro),
          React.createElement('div', { className: 'rule-arrow' },
            React.createElement('div'), React.createElement('span', null, '→')),
          React.createElement('div', { className: 'media' },
            React.createElement('a', { className: 'media__cell media__read', href: window.EXTERNAL.undisguised, ...v2Ext },
              React.createElement('div', { className: 'media__top' },
                React.createElement('h3', null, 'READ'),
                React.createElement('span', { className: 'media__arw' }, '↗')),
              React.createElement('div', null,
                React.createElement('div', { className: 'media__kicker' }, 'UNDISGUISED'),
                React.createElement('p', null, media.read))
            ),
            React.createElement('a', { className: 'media__cell media__watch', href: window.EXTERNAL.youtube, ...v2Ext },
              React.createElement('div', { className: 'media__top' },
                React.createElement('h3', null, 'WATCH'),
                React.createElement('span', { className: 'media__arw' }, '↗')),
              React.createElement('div', null,
                React.createElement('div', { className: 'media__kicker' }, 'YOUTUBE'),
                React.createElement('p', null, media.watch))
            ),
            React.createElement('div', { className: 'media__cell media__follow' },
              React.createElement('h3', null, 'FOLLOW'),
              React.createElement('div', { className: 'icon-row' },
                React.createElement('a', { className: 'icon-btn', href: window.EXTERNAL.linkedin, 'aria-label': 'LinkedIn', ...v2Ext },
                  React.createElement(window.BrandIcon, { name: 'LinkedIn', size: 21 })),
                React.createElement('a', { className: 'icon-btn', href: window.EXTERNAL.instagram, 'aria-label': 'Instagram', ...v2Ext },
                  React.createElement(window.BrandIcon, { name: 'Instagram', size: 21 })),
                React.createElement('a', { className: 'icon-btn', href: window.EXTERNAL.tiktok, 'aria-label': 'TikTok', ...v2Ext },
                  React.createElement(window.BrandIcon, { name: 'TikTok', size: 20 }))
              )
            )
          )
        )
      ),

      arr(c.faq).length ? React.createElement('section', { className: 'sec sec--tight' },
        React.createElement('div', { className: 'site-container u-faq u-faq--dark', style: { maxWidth: 900 } },
          React.createElement('h2', { className: 'sec__h', style: { marginBottom: 24 } }, c.faqLabel),
          arr(c.faq).map((f, i) => React.createElement('details', { key: i },
            React.createElement('summary', null, f.q),
            React.createElement('p', null, f.a)
          ))
        )
      ) : null,

      React.createElement(window.BlackCtaStrip, { lang, heading: c.finalHeading })
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

// ─── WHY ME (route stays /about/) ────────────────────────────────────────────
// Credential rows are assembled from the production ABOUT copy only:
// `creds` is split on its existing "·" separators, so no new claims are added.
function AboutPageV2({ lang = 'en', copy }) {
  const c = (copy && copy.about) || {};
  const t = window.cT(lang);
  const rows = String(c.creds || '').split('·').map(s => s.trim()).filter(Boolean);
  const intro = arr(c.intro);
  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'about', lang }),
    React.createElement('main', null,
      React.createElement('section', { className: 'why-hero' },
        React.createElement('div', { className: 'site-container why-hero__grid' },
          React.createElement('div', null,
            React.createElement('div', { className: 'why-hero__over' }, String(t.why).toUpperCase()),
            React.createElement('h1', null, c.lead),
            intro[0] ? React.createElement('p', { className: 'why-hero__intro' }, intro[0]) : null,
            React.createElement('div', { className: 'why-hero__creds' }, c.role)
          ),
          React.createElement('img', {
            src: '/img/aggelos-opinion.jpeg', alt: 'Aggelos Mouzakitis',
            width: 900, height: 1125, loading: 'eager', decoding: 'async',
          })
        )
      ),
      React.createElement('section', { className: 'u-main' },
        rows.length ? React.createElement('div', { className: 'site-container' },
          rows.map((r, i) => React.createElement('div', { className: 'cred-row', key: i },
            React.createElement('div', { className: 'cred-row__n' }, '0' + (i + 1)),
            React.createElement('h3', null, r),
            React.createElement('p', null, '')
          ))
        ) : null,
        React.createElement('div', { className: 'u-read', style: { marginTop: rows.length ? 80 : 0 } },
          intro.slice(1).map((p, i) => React.createElement('p', { key: 'i' + i }, p)),
          arr(c.sections).map((s, i) => React.createElement(React.Fragment, { key: i },
            i > 0 ? React.createElement('hr') : null,
            React.createElement('h2', null, s.label),
            arr(s.body).map((p, j) => React.createElement('p', { key: j }, p))
          ))
        )
      ),
      React.createElement(window.BlackCtaStrip, { lang, heading: c.ctaHeading, label: c.ctaLabel })
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function ReviewItemV2({ t, lang, toggleLabel }) {
  const [open, setOpen] = React.useState(false);
  const el = lang === 'el';
  return React.createElement('div', { className: 'rev-item' },
    React.createElement('p', null, '“' + (el ? t.qEl : t.q) + '”'),
    React.createElement('div', { className: 'rev-item__who' }, el ? t.wEl : t.w),
    el && toggleLabel ? React.createElement('button', {
      type: 'button', onClick: () => setOpen(!open), 'aria-expanded': open ? 'true' : 'false',
    }, toggleLabel + ' ' + (open ? '↑' : '↓')) : null,
    el && open ? React.createElement('p', { className: 'rev-item__orig' }, '“' + t.q + '”') : null
  );
}
function ReviewsPageV2({ lang = 'en', copy }) {
  const c = (copy && copy.reviews) || {};
  const items = arr(copy && copy.reviewItems);
  const el = lang === 'el';
  const first = items[0];
  return React.createElement(React.Fragment, null,
    React.createElement(window.ChromeStyles), React.createElement(PageV2Styles),
    React.createElement(window.SiteHeader, { page: 'reviews', lang }),
    React.createElement('main', null,
      React.createElement('section', { className: 'rev-hero' },
        React.createElement('div', { className: 'site-container' },
          React.createElement('div', { className: 'rev-hero__grid' },
            React.createElement('h1', null, c.h1),
            React.createElement('div', null,
              React.createElement('p', { className: 'rev-hero__lead' }, c.lead),
              React.createElement('div', { className: 'rev-hero__note' }, c.sub)
            )
          ),
          first ? React.createElement('blockquote', { className: 'rev-feature' },
            '“' + (el ? first.qEl : first.q) + '”',
            React.createElement('div', { className: 'rev-feature__who' }, el ? first.wEl : first.w)
          ) : null
        )
      ),
      React.createElement('section', { className: 'u-main' },
        React.createElement('div', { className: 'site-container rev-grid' },
          items.slice(1).map((t, i) => React.createElement(ReviewItemV2, { key: i, t, lang, toggleLabel: c.toggle }))
        )
      ),
      React.createElement(window.BlackCtaStrip, { lang, heading: c.ctaHeading })
    ),
    React.createElement(window.SiteFooterX, { lang })
  );
}

Object.assign(window, { HomePageV2, AboutPageV2, ReviewsPageV2, PAGE_V2_CSS });
