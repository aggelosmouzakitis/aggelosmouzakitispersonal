// scripts/fetch-review-photos.js
// One-off: self-host the approved reviewer photos referenced by the published
// named reviews (content-pages.jsx REVIEWS_NAMED). Consent for these exact photos
// was confirmed by the site owner; this script fetches ONLY these approved URLs
// and never scrapes any other GrowthMentor user.
//
//   node scripts/fetch-review-photos.js
//
// It downloads each photo (with a timeout), verifies the response is actually an
// image, writes it to img/reviews/<slug>.jpg (collision-safe, matches the paths
// in REVIEWS_NAMED), and reports any URL that fails without aborting the rest.
// After a successful run, re-run `npm run build && node scripts/seo/prerender.js`
// so the review cards render the photos (until then they show initials).
//
// NOTE: some networks/proxies block growthmentor.com — run this where it is
// reachable. Failed photos degrade cleanly to an initials avatar (never a fake face).

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_DIR = path.resolve(__dirname, '..', 'img', 'reviews');
const TIMEOUT_MS = 20000;

// Approved reviewer -> source photo URL -> local filename (verbatim from the
// consented export; edit only to add a reviewer who is already published + consented).
const PHOTOS = [
  {
    "name": "Greg Weinstein",
    "file": "greg-weinstein.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdFVHIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1923ce306b9db0c1391f63dd3734bf5c9713dccc/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/Greg%20Weinstein%20headshot%20circle.png"
  },
  {
    "name": "Marianna Tzaerli",
    "file": "marianna-tzaerli.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbUtoIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--15cd90626632280f2f8daee034b8aa188275f41b/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/Untitled%20design%20(1).png"
  },
  {
    "name": "Thomas Parkinson",
    "file": "thomas-parkinson.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBamhQIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--f926cb2370bbb0b4b4b981dc50fd5d9cf0e16818/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/95329932_1318044355053124_8676650969548718080_n.jpg"
  },
  {
    "name": "Amritha Mani",
    "file": "amritha-mani.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdDlJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--b779ed4e336fa218ceba6ff50996481cd5bcb59f/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/AMRITHA%20MANI%20(1).png"
  },
  {
    "name": "Micah McGuire",
    "file": "micah-mcguire.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdnByIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--cfa6be71a147db1b1824147fd1d5867af3ea8b10/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hKeVpYTnBlbVZmZEc5ZlptbDBXd2RwQWl3QmFRSXNBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--3ca0817d0d0ff629c2bd603fa24c0a22461d2cb3/Small4608%20copy.jpeg"
  },
  {
    "name": "Agnieszka Wojtkun",
    "file": "agnieszka-wojtkun.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbEduIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7a8fe3253ba2b6a52b8794a861bc2949defff2e9/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/Portrait_light%20background_1546x1546.png"
  },
  {
    "name": "Tanuj",
    "file": "tanuj.jpg",
    "url": "https://lh3.googleusercontent.com/a/ACg8ocKjKkEkhWyqhPLjSx-_H9cQaybK5OVPKfuV6B-74W1kDkGkjg=s96-c"
  },
  {
    "name": "Indie Ludbrook",
    "file": "indie-ludbrook.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdWxNIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--58b200de30d6af83429c0d1c6557a7db47973f32/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/1581364840601.jpeg"
  },
  {
    "name": "Spyros Tsoukalas",
    "file": "spyros-tsoukalas.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbU5EIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--863fe90ae4dec6533e149c23c45ba26a855459c2/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtDTEFGcEFpd0IiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--515d12c2ff7c8bc983810019a15d14b75adb5bff/1.jpg"
  },
  {
    "name": "Pierrick L'Ebraly",
    "file": "pierrick-lebraly.jpg",
    "url": "https://www.growthmentor.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZ09UIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--b51008099bbf89e9341adb3b4ab94e66aa10b273/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2hKeVpYTnBlbVZmZEc5ZlptbDBXd2RwQWl3QmFRSXNBUT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--3ca0817d0d0ff629c2bd603fa24c0a22461d2cb3/1718317055658.jpeg"
  }
];

const IMG_MAGIC = [
  { ext: 'jpg', bytes: [0xFF, 0xD8, 0xFF] },
  { ext: 'png', bytes: [0x89, 0x50, 0x4E, 0x47] },
  { ext: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];
function sniff(buf) {
  return IMG_MAGIC.find((m) => m.bytes.every((b, i) => buf[i] === b)) || null;
}

function get(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      const { statusCode, headers } = res;
      if (statusCode >= 300 && statusCode < 400 && headers.location && redirectsLeft > 0) {
        res.resume();
        const next = new URL(headers.location, url).toString();
        return resolve(get(next, redirectsLeft - 1));
      }
      if (statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + statusCode));
      }
      const ct = String(headers['content-type'] || '');
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buf: Buffer.concat(chunks), contentType: ct }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout after ' + TIMEOUT_MS + 'ms')));
    req.on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const failed = [];
  let ok = 0;
  for (const p of PHOTOS) {
    process.stdout.write('  ' + p.name.padEnd(22) + ' ');
    try {
      const { buf, contentType } = await get(p.url);
      const kind = sniff(buf);
      if (!kind && !/^image\//.test(contentType)) throw new Error('not an image (' + (contentType || 'unknown') + ')');
      if (buf.length < 512) throw new Error('suspiciously small (' + buf.length + ' bytes)');
      fs.writeFileSync(path.join(OUT_DIR, p.file), buf);
      ok++;
      console.log('ok  ->  img/reviews/' + p.file + '  (' + buf.length + ' bytes)');
    } catch (e) {
      failed.push({ name: p.name, error: e.message });
      console.log('FAILED  (' + e.message + ')');
    }
  }
  console.log('\n' + ok + ' downloaded, ' + failed.length + ' failed.');
  if (failed.length) {
    console.log('Failed (these reviews will show an initials avatar):');
    failed.forEach((f) => console.log('  - ' + f.name + ': ' + f.error));
  }
  if (ok) console.log('\nNext: npm run build && node scripts/seo/prerender.js');
})();
