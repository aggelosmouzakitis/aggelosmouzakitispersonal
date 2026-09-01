# Reviewer photos

Self-hosted, grayscale reviewer photos for the named reviews on `/reviews/`
(see `REVIEWS_NAMED` in `content-pages.jsx`). Filenames match the `photo:`
paths there, e.g. `greg-weinstein.jpg`.

Consent for these specific photos was confirmed by the site owner. They are
**not** committed as hotlinks — download them once, locally, with:

    node scripts/fetch-review-photos.js
    npm run build && node scripts/seo/prerender.js

Until a photo exists here, the review card shows a restrained initials avatar
(never a generated face). Do not add photos for anyone who is not both
published in `REVIEWS_NAMED` and consented.
