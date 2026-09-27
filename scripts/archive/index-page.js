// index-page.js — renders /archive/index.html, the private map of the archive.
// Called by build.js. Standalone HTML with inline CSS and JS so it never
// depends on a site bundle that a future redesign might change.

const fs = require('fs');
const path = require('path');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (iso, withYear = true) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}${withYear ? ' ' + y : ''}`;
};
// A retired page was live from `since` until the deploy that retired it.
function liveRange(p) {
  const from = p.since;
  const to = p.retired.date;
  if (p.stillServed) return `Since ${day(from)}`;
  if (from === to) return day(from);
  return from.slice(0, 4) === to.slice(0, 4) ? `${day(from, false)} – ${day(to)}` : `${day(from)} – ${day(to)}`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', hellip: '…' };
const decode = (s) => s
  .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENTITIES ? ENTITIES[n.toLowerCase()] : m));
const cleanTitle = (t) => decode(t).replace(/\s+/g, ' ').trim()
  .replace(/\s*[|—–-]\s*(Aggelos Mouzakitis|Άγγελος Μουζακίτης)\s*$/i, '') || '(untitled)';

// What each original URL does on the live site today, from the current netlify.toml.
function todayStatus(ROOT, fileFor) {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  const rules = toml.split('[[redirects]]').slice(1).map((b) => {
    const block = b.split('[[headers]]')[0];
    const g = (k) => (block.match(new RegExp(`\\n\\s*${k}\\s*=\\s*"([^"]+)"`)) || [])[1];
    return { from: g('from'), to: g('to'), status: +((block.match(/status\s*=\s*(\d+)/) || [])[1] || 301),
      force: /force\s*=\s*true/.test(block) };
  }).filter((r) => r.from && r.from.startsWith('/'));
  return (url) => {
    const bare = url.replace(/\/$/, '');
    const rule = rules.find((r) => (r.from.endsWith('/*')
      ? bare === r.from.slice(0, -2) || url.startsWith(r.from.slice(0, -1))
      : r.from === bare || r.from === url));
    const file = path.join(ROOT, fileFor(url));
    const exists = fs.existsSync(file);
    if (rule && rule.status >= 300 && rule.status < 400 && (rule.force || !exists)) {
      return { cls: 'redirect', text: `→ ${rule.to}`, title: `${rule.status} redirect to ${rule.to}` };
    }
    if (exists) {
      const noindex = /<meta name="robots" content="[^"]*noindex/i.test(fs.readFileSync(file, 'utf8'));
      return noindex
        ? { cls: 'live', text: 'Live, noindex', title: 'Still served at this URL, kept out of search' }
        : { cls: 'live', text: 'Live', title: 'Still served at this URL' };
    }
    return { cls: 'gone', text: 'Gone (404)', title: 'This URL returns 404 on the live site' };
  };
}

module.exports = function indexPage({ groups, titles, ROOT, fileFor }) {
  const status = todayStatus(ROOT, fileFor);
  const total = groups.reduce((a, g) => a + g.pages.length, 0);

  const nav = groups.map((g) =>
    `<a href="#${g.id}">${esc(g.title)} <span>${g.pages.length}</span></a>`).join('');

  const sections = groups.map((g) => {
    const rows = g.pages.map((p) => {
      const title = cleanTitle(titles.get(p.url) || '');
      const now = status(p.url);
      const note = p.note ? `<p class="note">${esc(p.note)}</p>` : '';
      return `
        <li class="row" data-q="${esc((title + ' ' + p.url).toLowerCase())}">
          <div class="main">
            <a class="title" href="/archive${esc(p.url)}">${esc(title)}</a>
            <code class="url">${esc(p.url)}</code>${note}
          </div>
          <div class="meta">
            <span class="live" title="Dates this URL was served">${esc(liveRange(p))}</span>
            <span class="now ${now.cls}" title="${esc(now.title)}">${esc(now.text)}</span>
          </div>
        </li>`;
    }).join('');
    return `
    <section class="group" id="${g.id}">
      <div class="group-head">
        <h2>${esc(g.title)} <span class="count">${g.pages.length}</span></h2>
        <p>${esc(g.blurb)}</p>
      </div>
      <ul class="rows">${rows}
      </ul>
    </section>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="referrer" content="no-referrer">
<title>Archive of retired pages | Aggelos Mouzakitis</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600..800&family=Inter:wght@400..600&display=swap">
<meta name="theme-color" content="#16231E">
<style>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bone: #F3F0E8; --bone-deep: #EDE8DB; --forest: #16231E; --green: #047857; --sage: #8FBFA7;
  --ink: #171919; --heading: #14201C; --ink-2: #3A403A; --meta: #6A6F67; --on-forest: #C0C9BF;
  --rule: rgba(23,25,25,.18); --rule-dark: rgba(243,240,232,.16); --coral-ink: #AA432F;
  --body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --heading-font: "Inter Tight", "Inter", system-ui, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
html { scroll-behavior: smooth; }
body { background: var(--bone); color: var(--ink); font: 400 15px/1.6 var(--body); -webkit-font-smoothing: antialiased; }
a { color: inherit; }
.wrap { width: min(1080px, calc(100% - 32px)); margin: 0 auto; }
header { background: var(--forest); color: var(--bone); padding: 56px 0 28px; }
.eyebrow { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--sage); margin-bottom: 14px; }
h1 { font: 800 clamp(34px, 5vw, 52px)/1.04 var(--heading-font); letter-spacing: -.035em; margin-bottom: 16px; }
.lead { color: var(--on-forest); max-width: 64ch; font-size: 16px; line-height: 1.7; }
.lead strong { color: var(--bone); font-weight: 600; }
.tools { display: flex; gap: 12px; align-items: center; margin-top: 28px; flex-wrap: wrap; }
.search { flex: 1 1 280px; max-width: 420px; background: rgba(243,240,232,.06); border: 1px solid var(--rule-dark);
  border-radius: 999px; color: var(--bone); font: inherit; padding: 10px 18px; outline: none; }
.search::placeholder { color: rgba(243,240,232,.5); }
.search:focus { border-color: var(--sage); }
.total { color: var(--on-forest); font-size: 13px; }
nav.groups { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
nav.groups a { font-size: 12.5px; text-decoration: none; color: var(--on-forest); border: 1px solid var(--rule-dark);
  border-radius: 999px; padding: 5px 12px; white-space: nowrap; }
nav.groups a:hover { color: var(--bone); border-color: var(--sage); }
nav.groups a span { color: var(--sage); margin-left: 4px; }
main { padding: 12px 0 72px; }
.group { padding-top: 44px; scroll-margin-top: 12px; }
.group-head { border-bottom: 2px solid var(--green); padding-bottom: 12px; margin-bottom: 4px; }
h2 { font: 700 22px/1.2 var(--heading-font); letter-spacing: -.02em; color: var(--heading); }
.count { font: 500 13px var(--body); color: var(--meta); margin-left: 6px; letter-spacing: 0; }
.group-head p { color: var(--ink-2); margin-top: 6px; max-width: 72ch; }
.rows { list-style: none; }
.row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 28px; align-items: start;
  padding: 14px 0; border-bottom: 1px solid var(--rule); }
.title { font-weight: 600; color: var(--heading); text-decoration: none; }
.title:hover { color: var(--green); text-decoration: underline; text-underline-offset: 3px; }
.url { display: block; font: 12.5px/1.5 var(--mono); color: var(--meta); margin-top: 2px; overflow-wrap: anywhere; }
.note { font-size: 13px; color: var(--ink-2); margin-top: 4px; }
.meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; text-align: right; font-size: 13px; white-space: nowrap; }
.live { color: var(--ink-2); }
.now { font: 12px/1.4 var(--mono); color: var(--meta); }
.now.gone { color: var(--coral-ink); }
.now.live { color: var(--green); }
.empty { display: none; padding: 48px 0; color: var(--meta); }
footer { border-top: 1px solid var(--rule); padding: 24px 0 48px; color: var(--meta); font-size: 13px; }
footer code { font-family: var(--mono); font-size: 12px; }
@media (max-width: 640px) {
  header { padding-top: 40px; }
  .row { grid-template-columns: 1fr; }
  .meta { flex-direction: row; flex-wrap: wrap; align-items: baseline; justify-content: flex-start; gap: 4px 14px; text-align: left; white-space: normal; }
}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <p class="eyebrow">Archive · Private</p>
    <h1>Retired pages</h1>
    <p class="lead">Every page the site has retired or hidden, frozen as it last looked, with the code and images it used at the time. <strong>Kept out of Google</strong>: noindex on every page, not in the sitemap, not linked from the site. Links between archived pages stay inside the archive. Analytics and form submissions are switched off.</p>
    <div class="tools">
      <input class="search" type="search" placeholder="Filter by title or URL" aria-label="Filter pages" autocomplete="off">
      <span class="total" aria-live="polite">${total} pages</span>
    </div>
    <nav class="groups" aria-label="Sections">${nav}</nav>
  </div>
</header>
<main>
  <div class="wrap">${sections}
    <p class="empty">No archived page matches that.</p>
  </div>
</main>
<footer>
  <div class="wrap">Built from git history by <code>scripts/archive/build.js</code>. To archive more pages, add them to <code>scripts/archive/pages.json</code> and run <code>npm run archive</code>.</div>
</footer>
<script>
(function () {
  var input = document.querySelector('.search');
  var total = document.querySelector('.total');
  var rows = [].slice.call(document.querySelectorAll('.row'));
  var groups = [].slice.call(document.querySelectorAll('.group'));
  var empty = document.querySelector('.empty');
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    rows.forEach(function (r) {
      var hit = !q || r.getAttribute('data-q').indexOf(q) !== -1;
      r.hidden = !hit;
      if (hit) shown++;
    });
    groups.forEach(function (g) { g.hidden = !g.querySelector('.row:not([hidden])'); });
    empty.style.display = shown ? 'none' : 'block';
    total.textContent = q ? shown + ' of ${total} pages' : '${total} pages';
  });
})();
</script>
</body>
</html>
`;
};
