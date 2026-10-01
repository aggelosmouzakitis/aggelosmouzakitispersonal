// from-archive.js — bring an archived essay back as an article source.
//
// The essays retired in September 2026 are kept, frozen, in archive/blog/
// <slug>/index.html. This writes content/articles/<slug>.md in the shape the
// article pipeline reads (Part 1 page spec, Part 2 the essay, Part 3 notes),
// from that copy: the title, title tag, meta description, standfirst (the
// deck), first publication date and the article body, word for word. The
// essay returns at its original URL, /blog/<slug>/ (netlify.toml's rule for
// it steps aside once the page exists; remove the rule and its routes.js row).
//
//   node scripts/articles/from-archive.js <slug>
//   then add the printed entry to scripts/articles/articles.js
//
// The only changes are mechanical repairs of the old site's conversion
// debris, listed in the file it writes:
//   - a paragraph "_ *** * *" was a broken section break: it becomes "---",
//     like the essay's other breaks;
//   - a paragraph "_ **" is empty debris: it is dropped;
//   - "_ **## Heading" was a heading the old converter printed as text: it
//     becomes "## Heading".
// scripts/articles/check-articles.js proves the published essay carries the
// archived wording, word for word.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const WPM = 230;

const decode = (s) => s.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
// Straight double quotes become typographic, as everywhere else on the site
// (the archived bodies already use them; some titles did not).
const curly = (s) => s.replace(/"([^"]*)"/g, '“$1”');

function inline(html) {
  let s = html
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**')
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '*$2*')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
    .replace(/<br\s*\/?>/g, ' ');
  if (/<\w/.test(s)) throw new Error(`unexpected markup: ${s.slice(0, 80)}`);
  return curly(decode(s.replace(/\s+/g, ' ')).trim());
}

function convert(slug) {
  const file = path.join(ROOT, 'archive', 'blog', slug, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const one = (re, what) => { const m = html.match(re); if (!m) throw new Error(`${slug}: no ${what}`); return decode(m[1]).trim(); };
  const titleTag = one(/<title>([\s\S]*?)<\/title>/, 'title');
  const description = one(/<meta name="description" content="([^"]*)"/, 'meta description');
  const h1 = one(/<h1 class="article-title">([\s\S]*?)<\/h1>/, 'H1');
  const deck = one(/<p class="article-desc">([\s\S]*?)<\/p>/, 'standfirst');
  const date = one(/<time datetime="(\d{4}-\d{2}-\d{2})"/, 'date');
  const body = html.slice(html.indexOf('<article'), html.indexOf('</article>'));

  const blocks = [];
  const repairs = [];
  for (const m of body.matchAll(/<(h2|h3|p|blockquote|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/g)) {
    if (m[0].startsWith('<hr')) { blocks.push('---'); continue; }
    const [, tag, inner] = m;
    if (tag === 'ul' || tag === 'ol') {
      [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].forEach((li, i) => blocks.push((tag === 'ul' ? '- ' : `${i + 1}. `) + inline(li[1])));
      continue;
    }
    const text = inline(inner);
    if (tag === 'p' && text === '_ *** * *') { blocks.push('---'); repairs.push('a broken section break "_ *** * *" → "---"'); continue; }
    if (tag === 'p' && text === '_ **') { repairs.push('empty debris "_ **" dropped'); continue; }
    const heading = tag === 'p' && text.match(/^_ \*\*## (.+)$/);
    if (heading) { blocks.push('## ' + heading[1]); repairs.push(`"_ **## ${heading[1]}" → heading "${heading[1]}"`); continue; }
    if (/^_ \*|^\*\*\s*$|^#+ /.test(text)) throw new Error(`${slug}: unrecognised debris: ${text.slice(0, 60)}`);
    blocks.push({ h2: '## ', h3: '### ', p: '', blockquote: '> ' }[tag] + text);
  }
  // Grouped list items need no blank line between them.
  const md = blocks.reduce((out, b, i) => out + (i ? (/^(- |\d+\. )/.test(b) && /^(- |\d+\. )/.test(blocks[i - 1]) ? '\n' : '\n\n') : '') + b, '');
  const words = (h1 + ' ' + deck + ' ' + md).replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const minutes = Math.max(1, Math.round(words / WPM));

  const out = `## PART 1 — PAGE SPEC

URL: \`/blog/${slug}/\`
Title tag: \`${curly(titleTag)}\`
Meta description: \`${curly(description)}\`
H1: \`${curly(h1)}\`
Article type: Essay, republished.

## PART 2 — ARTICLE

# ${curly(h1)}

${curly(deck)}

${md}

## PART 3 — IMPLEMENTATION NOTES

### Article header

Category: \`Essay\`. Reading-time label: \`${minutes} min read\` (${words} words at ${WPM} a minute). First published on ${date}; the visible date and datePublished keep that date.

Source: \`archive/blog/${slug}/index.html\`, the frozen copy of the page as it was published. Part 2 is that essay word for word: its title, its standfirst (the deck, the paragraph beginning “${curly(deck).split(/[.?!]/)[0]}”) and its body. ${repairs.length ? 'The only changes repair the old site\'s conversion debris: ' + [...new Set(repairs)].join('; ') + '.' : 'Nothing was changed.'}

### Author block

The site's compact author strip, as on the guides:

- Image: \`[USE APPROVED AGGELOS AUTHOR IMAGE]\`
- Alt text: \`Aggelos Mouzakitis, psychotherapist and article author\`
- Exact name, linked to \`/about/\`: \`Aggelos Mouzakitis\`
- Credential line: \`BACP-registered Psychotherapist · MSc Integrative Counselling & Psychotherapy\`
- Background line: \`Background in product and growth · 100+ technology companies advised\`

### Close

No essay-specific call to action: the page ends with the Writing page's own close from the canonical copy (/blog/, "Contact").
`;
  const dest = path.join(ROOT, 'content', 'articles', slug + '.md');
  fs.writeFileSync(dest, out);
  return { dest, date, words, minutes, repairs };
}

if (require.main === module) {
  const slug = process.argv[2];
  if (!slug) { console.error('usage: node scripts/articles/from-archive.js <slug>'); process.exit(2); }
  const r = convert(slug);
  console.log(`wrote ${path.relative(ROOT, r.dest)}: ${r.words} words, ${r.minutes} min read, first published ${r.date}`);
  for (const x of new Set(r.repairs)) console.log('  repaired: ' + x);
}

module.exports = { convert };
