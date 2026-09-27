// build.js — writes /archive/: private, noindexed, frozen copies of every page
// the site has retired or hidden, taken from git history.
//
// Why a separate /archive/ tree instead of reviving the old URLs: a retired URL
// either 301s to its replacement (passing its search history on) or 404s.
// Serving the old page there again would undo that for Google and for anyone
// following an old link. Under /archive/ nothing Google already knows changes.
//
// Each page comes from the last commit at which it was actually served (see
// pages.json), together with the exact JS, CSS, images and data it loaded at
// that commit. Today's bundles have lost the components and CSS those pages
// need, so pointing old HTML at them would render the new design or nothing.
//
// Every archived page:
//   - carries <meta name="robots" content="noindex, nofollow, noarchive">, and
//     netlify.toml sends the same X-Robots-Tag header for all of /archive/;
//   - loses its canonical and hreflang links, which point at retired URLs;
//   - loses Google Analytics, and its forms no longer reach the lead sheet or
//     EmailJS (archive-shim answers those requests in the browser);
//   - links to its archived siblings instead of their retired URLs.
// Nothing on the live site links here, and sitemap.xml does not list it.
//
// To archive more pages: add them to pages.json (url + the last commit that
// served them) and re-run. The script owns /archive/ and rewrites it whole.
//
// Run: node scripts/archive/build.js   (needs full history: git fetch --unshallow)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'archive');
const ASSETS = '/archive/_assets/';
const OWN_ORIGIN = /^https?:\/\/(?:www\.)?aggelosmouzakitis\.com(?=\/|$)/i;
const { groups } = JSON.parse(fs.readFileSync(path.join(__dirname, 'pages.json'), 'utf8'));

// ─── git ─────────────────────────────────────────────────────────────────────
const git = (args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 1 << 28 });
const trees = new Map();
function tree(commit) {
  if (!trees.has(commit)) {
    let out;
    try { out = git(['ls-tree', '-r', '--name-only', '-z', commit]).toString('utf8'); } catch (e) {
      throw new Error(`commit ${commit} is not in this clone. Run: git fetch --unshallow`);
    }
    trees.set(commit, new Set(out.split('\0').filter(Boolean)));
  }
  return trees.get(commit);
}
const blob = (commit, file) => git(['show', `${commit}:${file}`]);

// ─── URLs ────────────────────────────────────────────────────────────────────
// '/blog/' → 'blog/index.html', '/el' → 'el/index.html', '/a/b.json' → 'a/b.json'
function fileFor(urlPath) {
  const p = urlPath.replace(/^\//, '');
  if (p === '' || p.endsWith('/')) return p + 'index.html';
  if (/\.[a-z0-9]+$/i.test(p)) return p;
  return p + '/index.html';
}

const PAGES = groups.flatMap((g) => g.pages);
// original file of every archived page → its URL under /archive/
const ARCHIVED = new Map(PAGES.map((p) => [fileFor(p.url), '/archive' + p.url]));

// ─── Output ──────────────────────────────────────────────────────────────────
const outputs = new Map(); // URL path under /archive/ → Buffer
function emit(urlPath, buf) { outputs.set(urlPath, Buffer.isBuffer(buf) ? buf : Buffer.from(buf)); }

const hash10 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);

// Copy a file from `commit` into /archive/_assets/ under a content-hashed name.
// JS and CSS are rewritten first, so a bundle's own references are frozen too.
const frozen = new Map(); // `${commit}:${file}` → URL (null while in progress)
function freeze(commit, file) {
  const key = `${commit}:${file}`;
  if (frozen.has(key)) return frozen.get(key);
  frozen.set(key, null);
  let buf = blob(commit, file);
  const ext = path.extname(file).toLowerCase();
  if (ext === '.js' || ext === '.mjs' || ext === '.jsx') buf = Buffer.from(rewriteJs(buf.toString('utf8'), commit));
  else if (ext === '.css') buf = Buffer.from(rewriteCss(buf.toString('utf8'), commit, '/' + file));
  const url = `${ASSETS}${path.basename(file, ext)}.${hash10(buf)}${ext}`;
  emit(url, buf);
  frozen.set(key, url);
  return url;
}

// Resolve one reference found in a document from `commit` whose own URL is
// `base`. Returns its replacement, or null to leave it exactly as it is:
//   - a retired page we archive  → its /archive/ copy
//   - a file in that commit      → a frozen copy (cache-busting ?v= dropped)
//   - anything else (live pages, external URLs, anchors) → unchanged
function resolveRef(ref, commit, base, { ownOrigin = false } = {}) {
  if (!ref) return null;
  let r = ref;
  if (ownOrigin && OWN_ORIGIN.test(r)) r = r.replace(OWN_ORIGIN, '') || '/';
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(r)) return null;
  const [, p, q = '', h = ''] = r.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  if (p === '') return null;
  let abs;
  try { abs = new URL(p, 'https://archive.invalid' + base).pathname; } catch (e) { return null; }
  let decoded;
  try { decoded = decodeURIComponent(abs); } catch (e) { decoded = abs; }

  // Keep the reference's own shape ('/el' stays slash-less) so string
  // concatenation in page code ('/el' + '/about/') still lands on a real page.
  if (ARCHIVED.has(fileFor(decoded))) return '/archive' + abs + q + h;

  const file = decoded.replace(/^\//, '');
  if (file && !/\.html?$/i.test(file) && tree(commit).has(file)) {
    const url = freeze(commit, file);
    return url ? url + h : null;
  }
  return null;
}

// ─── Rewriters ───────────────────────────────────────────────────────────────
// JS: string literals that start with a root-relative path — '/blog/',
// "/content-pages.js?v=39", `/blog/${slug}/`. Relative strings are left alone:
// in a script they resolve against the page, so they are not ours to guess.
const JS_PATH = /(['"`])(\/(?!\/)[\w.~%+\/-]*)((?:\?v=[\w.-]*)?)/g;
const CSS_URL = /url\(\s*(['"]?)([^'")\s]+)\1\s*\)/g;
function rewriteJs(src, commit) {
  return src
    .replace(JS_PATH, (m, quote, p, query) => {
      const to = resolveRef(p + query, commit, '/');
      return to ? quote + to : m;
    })
    .replace(CSS_URL, (m, quote, u) => {
      if (!u.startsWith('/')) return m;
      const to = resolveRef(u, commit, '/');
      return to ? `url(${quote}${to}${quote})` : m;
    });
}
// CSS: url(...) — relative ones resolve against the stylesheet's own URL.
function rewriteCss(src, commit, base) {
  return src.replace(CSS_URL, (m, quote, u) => {
    const to = resolveRef(u, commit, base);
    return to ? `url(${quote}${to}${quote})` : m;
  });
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] !== undefined ? m[2] : m[3]) : null;
};

// One page from its snapshot commit → the archived HTML.
function rewriteHtml(html, commit, pageUrl) {
  const REF_ATTRS = /(\s)(href|src|action|poster|data-src|srcset|style)(\s*=\s*)("([^"]*)"|'([^']*)')/gi;
  // A dropped tag takes its own line with it, and nothing else.
  const LINE = (tag) => new RegExp(`[ \\t]*${tag}[ \\t]*(?:\\r?\\n)?`, 'gi');
  const markup = (chunk) => chunk
    // SEO signals that point at retired URLs, and analytics.
    .replace(LINE('<link\\b[^>]*>'), (line) => {
      const tag = line.trim();
      const rel = (attr(tag, 'rel') || '').toLowerCase();
      if (rel === 'canonical') return '';
      if (rel === 'alternate' && attr(tag, 'hreflang') !== null) return '';
      if (/^(preconnect|dns-prefetch)$/.test(rel) && /googletagmanager|google-analytics/i.test(attr(tag, 'href') || '')) return '';
      return line;
    })
    .replace(LINE('<meta\\b[^>]*>'), (line) => (/^(robots|googlebot|bingbot)$/i.test(attr(line, 'name') || '') ? '' : line))
    // Every reference in every tag.
    .replace(/<[a-zA-Z][\w-]*\s[^<>]*>/g, (tag) => tag.replace(REF_ATTRS, (m, sp, name, eq, quoted, dq, sq) => {
      const val = dq !== undefined ? dq : sq;
      const q = dq !== undefined ? '"' : "'";
      const n = name.toLowerCase();
      let out = val;
      // Prerendered React writes quotes inside style="" as &quot;.
      if (n === 'style') out = rewriteCss(val.replace(/&quot;/g, '"'), commit, pageUrl).replace(/"/g, '&quot;');
      else if (n === 'srcset') {
        out = val.split(',').map((part) => {
          const [u, ...d] = part.trim().split(/\s+/);
          return [resolveRef(u, commit, pageUrl) || u, ...d].join(' ');
        }).join(', ');
      } else out = resolveRef(val, commit, pageUrl, { ownOrigin: n === 'href' }) || val;
      return out === val ? m : `${sp}${name}${eq}${q}${out}${q}`;
    }));

  // Walk scripts, styles and comments separately from the markup around them.
  const SEG = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>|<style\b([^>]*)>([\s\S]*?)<\/style\s*>|<!--[\s\S]*?-->/gi;
  let out = '';
  let last = 0;
  let dropped = false;
  const drop = () => { out = out.replace(/[ \t]*$/, ''); dropped = true; };
  for (const m of html.matchAll(SEG)) {
    let chunk = html.slice(last, m.index);
    if (dropped) chunk = chunk.replace(/^[ \t]*\r?\n/, '');
    dropped = false;
    out += markup(chunk);
    last = m.index + m[0].length;
    const [whole, sAttrs, sBody, stAttrs, stBody] = m;
    if (whole.startsWith('<!--')) {
      if (/google tag|gtag/i.test(whole)) drop();
      else out += whole;
    } else if (sAttrs !== undefined) {
      const src = attr(' ' + sAttrs, 'src');
      const type = (attr(' ' + sAttrs, 'type') || '').toLowerCase();
      if ((src && /googletagmanager\.com|google-analytics\.com/i.test(src)) ||
          (!src && /gtag\(\s*['"]config['"]/.test(sBody) && sBody.length < 800)) { drop(); continue; }
      const tag = markup(`<script${sAttrs}>`);
      const body = /json/.test(type) ? sBody : rewriteJs(sBody, commit);
      out += `${tag}${body}</script>`;
    } else {
      out += `${markup(`<style${stAttrs}>`)}${rewriteCss(stBody, commit, pageUrl)}</style>`;
    }
  }
  let tail = html.slice(last);
  if (dropped) tail = tail.replace(/^[ \t]*\r?\n/, '');
  return out + markup(tail);
}

// ─── The shim every archived page loads first ────────────────────────────────
const SHIM = `/* archive-shim.js — loaded first by every page under /archive/ (generated by
   scripts/archive/build.js). These are private copies of retired pages, so:
   analytics is a no-op, form endpoints are answered here instead of being sent,
   and a small dismissible label links back to the archive index. */
(function () {
  'use strict';
  var d = (document.currentScript && document.currentScript.dataset) || {};

  window.dataLayer = [];
  window.gtag = function () {};

  var BLOCKED = /(^|\\.)(script\\.google\\.com|script\\.googleusercontent\\.com|api\\.emailjs\\.com|formspree\\.io)$/i;
  function blocked(u) {
    try { return BLOCKED.test(new URL(String(u), location.href).hostname); } catch (e) { return false; }
  }
  var realFetch = window.fetch;
  if (realFetch) {
    window.fetch = function (input) {
      var u = input && typeof input === 'object' && 'url' in input ? input.url : input;
      if (blocked(u)) {
        return Promise.resolve(new Response('{"result":"success","archived":true}',
          { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return realFetch.apply(this, arguments);
    };
  }
  if (navigator.sendBeacon) {
    var realBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (u, data) { return blocked(u) ? true : realBeacon(u, data); };
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function day(iso) {
    var p = String(iso || '').split('-');
    return p.length === 3 ? +p[2] + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0] : '';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function label() {
    if (!document.body || document.getElementById('archive-label')) return;
    try { if (sessionStorage.getItem('archive-label-off') === '1') return; } catch (e) {}
    var host = document.createElement('div');
    host.id = 'archive-label';
    host.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483647;max-width:calc(100vw - 24px)';
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    var state = (d.state === 'noindex' ? 'noindexed ' : 'retired ') + day(d.retired);
    root.innerHTML =
      '<style>' +
      '.l{display:flex;align-items:center;gap:10px;background:#16231E;color:#F3F0E8;border:1px solid rgba(243,240,232,.16);' +
      'border-radius:999px;padding:7px 8px 7px 14px;font:500 12px/1.3 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.28);white-space:nowrap;overflow:hidden}' +
      '.t{overflow:hidden;text-overflow:ellipsis}.k{color:#8FBFA7;letter-spacing:.12em;text-transform:uppercase;font-size:10.5px;margin-right:6px}' +
      'a{color:#F3F0E8;text-decoration:underline;text-underline-offset:2px}a:hover{color:#8FBFA7}' +
      'button{all:unset;cursor:pointer;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#C0C9BF;font-size:15px;line-height:1}' +
      'button:hover{background:rgba(243,240,232,.12);color:#F3F0E8}@media print{.l{display:none}}' +
      '</style>' +
      '<div class="l" title="Private archive copy of ' + esc(d.url || location.pathname) +
      '. Not indexed by search engines. Analytics and form submissions are switched off.">' +
      '<span class="t"><span class="k">Archive</span>' + esc(state) + '</span>' +
      '<a href="/archive/">All pages</a><button type="button" aria-label="Hide archive label">\\u00d7</button></div>';
    root.querySelector('button').addEventListener('click', function () {
      host.remove();
      try { sessionStorage.setItem('archive-label-off', '1'); } catch (e) {}
    });
    document.body.appendChild(host);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', label);
  else label();
})();
`;
const SHIM_URL = `${ASSETS}archive-shim.${hash10(Buffer.from(SHIM))}.js`;

// ─── Build ───────────────────────────────────────────────────────────────────
function inject(html, p) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const tags = '\n<meta name="robots" content="noindex, nofollow, noarchive">\n' +
    `<script src="${SHIM_URL}" data-url="${esc(p.url)}" data-retired="${esc(p.retired.date)}"` +
    `${p.stillServed ? ' data-state="noindex"' : ''}></script>`;
  const charset = html.match(/<meta\s+charset=[^>]*>/i);
  if (charset) return html.slice(0, charset.index + charset[0].length) + tags + html.slice(charset.index + charset[0].length);
  const head = html.match(/<head\b[^>]*>/i);
  if (head) return html.slice(0, head.index + head[0].length) + tags + html.slice(head.index + head[0].length);
  throw new Error(`${p.url}: no <head> to put the robots meta in`);
}

const titles = new Map();
for (const p of PAGES) {
  const file = fileFor(p.url);
  if (!tree(p.commit).has(file)) throw new Error(`${p.url}: ${file} does not exist at ${p.commit.slice(0, 7)}`);
  const html = blob(p.commit, file).toString('utf8');
  titles.set(p.url, (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  emit('/archive' + p.url + (p.url.endsWith('/') ? 'index.html' : ''), inject(rewriteHtml(html, p.commit, p.url), p));
}
emit(SHIM_URL, SHIM);
emit('/archive/index.html', require('./index-page.js')({ groups, titles, ROOT, fileFor }));

// Replace /archive/ with exactly this build.
fs.rmSync(OUT, { recursive: true, force: true });
for (const [url, buf] of [...outputs].sort()) {
  const dest = path.join(ROOT, url.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

const assets = [...outputs.keys()].filter((u) => u.startsWith(ASSETS));
const bytes = [...outputs.values()].reduce((a, b) => a + b.length, 0);
console.log(`archive: ${PAGES.length} pages, ${assets.length} frozen assets, ${(bytes / 1048576).toFixed(1)} MB`);
