const fs = require("fs");
const path = require("path");

const postsDir = "blog/posts";
const blogDir = "blog";

if (!fs.existsSync(postsDir)) process.exit(0);

function getField(content, field) {
  const match = content.match(new RegExp("^" + field + ":\\s*[\"']?(.+?)[\"']?\\s*$", "m"));
  return match ? match[1] : "";
}

const posts = fs.readdirSync(postsDir)
  .filter(file => file.endsWith(".md"))
  .map(file => {
    const slug = file.replace(".md", "");
    const content = fs.readFileSync(path.join(postsDir, file), "utf8");

    const title = getField(content, "title") || slug;
    const date = getField(content, "date");
    const description = getField(content, "description");

    const postDir = path.join(blogDir, slug);
    fs.mkdirSync(postDir, { recursive: true });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | Aggelos Mouzakitis</title>
  <meta name="description" content="${description}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="https://aggelosmouzakitis.com/blog/${slug}/">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    body { background:#F4F2F0; color:#282726; font-family:monospace; line-height:1.8; margin:0; }
    main { max-width:740px; margin:0 auto; padding:4rem 2rem; }
    a { color:#00bf63; }
    .eyebrow { font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:#777; }
  </style>
</head>
<body>
  <main>
    <p><a href="/blog/">Back to blog</a></p>
    <article id="post">Loading post...</article>
  </main>

  <script>
    const markdown = ${JSON.stringify(content)};

    function parseFrontmatter(text) {
      const match = text.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
      if (!match) return { body: text };
      return { body: match[2] };
    }

    const parsed = parseFrontmatter(markdown);

    document.getElementById("post").innerHTML =
      '<p class="eyebrow">${date ? new Date(date).toLocaleDateString() : ""}</p>' +
      '<h1>${title}</h1>' +
      '<p>${description}</p>' +
      '<hr>' +
      marked.parse(parsed.body);
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join(postDir, "index.html"), html);

    return { slug, title, date, description };
  });

posts.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(path.join(blogDir, "posts.json"), JSON.stringify(posts, null, 2));
