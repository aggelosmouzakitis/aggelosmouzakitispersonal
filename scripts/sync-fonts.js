// sync-fonts.js — write the self-hosted font block (scripts/fonts.js) into
// the pages that are not generated from a shell: the three free tools,
// /ask-me-anything/el and 404.html. Replaces either an earlier block between
// <!-- fonts --> markers or the old Google Fonts links. Run after changing
// scripts/fonts.js:
//   node scripts/sync-fonts.js

const fs = require('fs');
const path = require('path');
const { FONT_HEAD, fontHead } = require('./fonts.js');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['work-life-check/index.html', 'free-tools/burned-out/index.html', 'free-tools/quit-your-job/index.html', 'ask-me-anything/el/index.html', '404.html'];
// /ask-me-anything/el opens in Greek: its body (Inter) and H1 (Inter Tight)
// need the greek subsets first; Archivo Black has no Greek glyphs.
const HEAD = { 'ask-me-anything/el/index.html': fontHead(['inter-v20-greek.woff2', 'inter-tight-v9-greek.woff2']) };
const MARKED = /<!-- fonts -->[\s\S]*?<!-- \/fonts -->/;
const GOOGLE = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*<link[^>]*fonts\.googleapis\.com\/css2[^>]*>(?:<noscript>[\s\S]*?<\/noscript>)?/;

for (const rel of PAGES) {
  const file = path.join(ROOT, rel);
  const html = fs.readFileSync(file, 'utf8');
  const re = MARKED.test(html) ? MARKED : GOOGLE;
  if (!re.test(html)) throw new Error(`sync-fonts: no font block or Google Fonts links in ${rel}`);
  const out = html.replace(re, HEAD[rel] || FONT_HEAD);
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(out)) throw new Error(`sync-fonts: Google Fonts still referenced in ${rel}`);
  fs.writeFileSync(file, out);
  console.log(`  ${out === html ? 'unchanged' : 'updated  '} ${rel}`);
}
