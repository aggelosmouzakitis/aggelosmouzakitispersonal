// indexnow.js — tell Bing/Copilot (and the other IndexNow participants) which
// URLs changed, instead of waiting for them to re-crawl.
//
// How the key works: IndexNow keys are self-chosen and public. The key file
// `<key>.txt` sits at the site root and contains only the key. Bing fetches
// https://aggelosmouzakitis.com/<key>.txt to confirm the submitter controls the
// domain, so the file must stay deployed for as long as the key is in use.
//
//   node scripts/seo/indexnow.js                    # submit every sitemap URL
//   node scripts/seo/indexnow.js /work-with-me/ /   # submit specific URLs
//   node scripts/seo/indexnow.js --dry-run          # print the payload only
//
// Run it after a deploy, for created, changed or deleted URLs. Deleted URLs are
// worth submitting too: it is how a retired page gets re-crawled and dropped.

const fs = require('fs');
const path = require('path');
const https = require('https');
const { ORIGIN, PAGES } = require('./site-meta.js');

const ROOT = path.resolve(__dirname, '..', '..');
const HOST = new URL(ORIGIN).host;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

// The key is whatever <32-hex>.txt is sitting at the repo root.
function findKey() {
  const f = fs.readdirSync(ROOT).find((n) => /^[0-9a-f]{8,128}\.txt$/.test(n));
  if (!f) throw new Error('No IndexNow key file at the repo root. Create one with:\n' +
    "  KEY=$(node -e \"console.log(require('crypto').randomBytes(16).toString('hex'))\"); echo $KEY > $KEY.txt");
  const key = fs.readFileSync(path.join(ROOT, f), 'utf8').trim();
  if (key !== path.basename(f, '.txt')) {
    throw new Error(`${f} must contain exactly its own key (found "${key}")`);
  }
  return key;
}

const args = process.argv.slice(2).filter((a) => a !== '--dry-run');
const dryRun = process.argv.includes('--dry-run');
const key = findKey();
const urlList = (args.length ? args : PAGES.map((p) => p.url))
  .map((u) => (u.startsWith('http') ? u : ORIGIN + u));

const payload = JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList });

console.log(`IndexNow → ${HOST}  (key ${key}, ${urlList.length} URL(s))`);
for (const u of urlList) console.log('  ' + u);

if (dryRun) { console.log('\n--dry-run: nothing submitted'); process.exit(0); }

const req = https.request(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
}, (res) => {
  let body = '';
  res.on('data', (c) => { body += c; });
  res.on('end', () => {
    // 200 accepted, 202 accepted but key still being validated.
    const ok = res.statusCode === 200 || res.statusCode === 202;
    console.log(`\n${ok ? 'submitted' : 'FAILED'} — HTTP ${res.statusCode}${body ? ' ' + body.trim() : ''}`);
    process.exit(ok ? 0 : 1);
  });
});
req.on('error', (e) => { console.error('\nFAILED —', e.message); process.exit(1); });
req.end(payload);
