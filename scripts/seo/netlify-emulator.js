// netlify-emulator.js — serve the site the way Netlify serves it, closely
// enough to test redirects, status codes and headers before a deploy.
//
// Serves public/ — what netlify.toml [build] publishes, assembled by
// scripts/build-public.js — with the rules from the repo's netlify.toml.
//
// Emulates, from netlify.toml [[redirects]]:
//   - first matching rule wins, in file order;
//   - a rule matches its path with or without a trailing slash, and a
//     "/x/*" rule matches /x, /x/ and anything under it (:splat substituted);
//   - shadowing: a rule with force = false does not apply when a file exists
//     at the requested path;
//   - 3xx → Location; 200 → rewrite (serve `to`); 404/410 → serve `to` with
//     that status (the 410 body is the page named in `to`).
// From [[headers]]: every block whose `for` pattern matches the requested
// path adds its values (`*` matches anything, trailing slash optional).
// And from Netlify's static serving:
//   - /dir without a trailing slash, where dir/index.html exists → 301 /dir/;
//   - anything else missing → 404 with /404.html.
//
// Used by scripts/seo/seo-check.js and scripts/qa-routes.js.

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');

const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

// netlify.toml lives in the repository root, not in the publish directory.
function loadRedirects() {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  return toml.split('[[redirects]]').slice(1).map((b) => {
    const block = b.split(/\n\s*\[\[|\n\s*\[/)[0];
    const g = (k) => (block.match(new RegExp('\\n\\s*' + k + '\\s*=\\s*"([^"]+)"')) || [])[1];
    const n = (block.match(/\n\s*status\s*=\s*(\d+)/) || [])[1];
    const f = (block.match(/\n\s*force\s*=\s*(true|false)/) || [])[1];
    return { from: g('from'), to: g('to'), status: n ? +n : 301, force: f === 'true' };
  }).filter((r) => r.from && r.to);
}

function loadHeaders() {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  return toml.split('[[headers]]').slice(1).map((b) => {
    const block = b.split(/\n\s*\[\[/)[0];
    const values = {};
    const body = block.split('[headers.values]')[1] || '';
    for (const m of body.matchAll(/\n\s*([A-Za-z-]+)\s*=\s*"([^"]*)"/g)) values[m[1]] = m[2];
    const pattern = (block.match(/\n\s*for\s*=\s*"([^"]+)"/) || [])[1];
    return { for: pattern, values };
  }).filter((h) => h.for);
}

const strip = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

function headersFor(pathname, headerRules) {
  const out = {};
  for (const h of headerRules) {
    const re = new RegExp('^' + strip(h.for).split('*').map((x) => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    if (re.test(strip(pathname))) Object.assign(out, h.values);
  }
  return out;
}

function match(rule, pathname) {
  if (rule.from.endsWith('/*')) {
    const base = strip(rule.from.slice(0, -2));
    if (strip(pathname) === base) return { splat: '' };
    if (pathname.startsWith(base + '/')) return { splat: pathname.slice(base.length + 1) };
    return null;
  }
  return strip(pathname) === strip(rule.from) ? { splat: '' } : null;
}

// The file a path would be served from, if any (dir → dir/index.html).
function fileFor(root, pathname) {
  let file = path.join(root, decodeURIComponent(pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

// Pure resolution, no I/O beyond fs checks: what Netlify would answer.
//   { status, location?, file? }
function resolve(pathname, redirects, root = PUBLIC) {
  const existing = fileFor(root, pathname);
  for (const r of redirects) {
    if (/^https?:\/\//.test(r.from)) continue; // host-scoped: only for that host, never the main site
    const m = match(r, pathname);
    if (!m) continue;
    if (!r.force && existing) continue; // shadowed by a real file
    const to = r.to.replace(':splat', m.splat);
    if (r.status >= 300 && r.status < 400) return { status: r.status, location: to, rule: r };
    const target = fileFor(root, to.split('?')[0]);
    if (r.status === 200) return target ? { status: 200, file: target, rule: r } : { status: 404, file: fileFor(root, '/404.html'), rule: r };
    return { status: r.status, file: target || fileFor(root, '/404.html'), rule: r };
  }
  if (existing) {
    const dir = path.join(root, decodeURIComponent(pathname));
    if (!pathname.endsWith('/') && fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return { status: 301, location: pathname + '/' };
    }
    return { status: 200, file: existing };
  }
  return { status: 404, file: fileFor(root, '/404.html') };
}

function serve(root = PUBLIC) {
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    throw new Error(`${root} has no index.html — run node scripts/build-public.js first`);
  }
  const redirects = loadRedirects();
  const headerRules = loadHeaders();
  return http.createServer((req, res) => {
    const pathname = req.url.split('?')[0];
    const r = resolve(pathname, redirects, root);
    const headers = headersFor(pathname, headerRules);
    if (r.location) { res.writeHead(r.status, { ...headers, Location: r.location }); return res.end(); }
    const type = r.file ? (TYPES[path.extname(r.file)] || 'application/octet-stream') : 'text/plain';
    res.writeHead(r.status, { ...headers, 'Content-Type': type });
    return res.end(r.file ? fs.readFileSync(r.file) : 'Not found');
  });
}

module.exports = { ROOT, PUBLIC, TYPES, loadRedirects, loadHeaders, headersFor, match, resolve, serve };
