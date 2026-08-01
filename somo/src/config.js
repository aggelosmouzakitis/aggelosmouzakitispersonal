/*
 * SOMO — site configuration
 * ---------------------------------------------------------------------------
 * This is a standalone website. Every external destination is a configuration
 * value here. Replace the placeholders below with the real URLs before launch,
 * then rebuild ( node somo/src/build.js ). Nothing user-visible should read as
 * "insert link here" — the links resolve to the values in this file.
 *
 * You can also override any of these at build time with environment variables,
 * e.g.  LUMA_CIRCLES_URL="https://lu.ma/xxxx" node somo/src/build.js
 */

const env = process.env;

const config = {
  // --- Site identity -------------------------------------------------------
  // SITE_URL: the production origin (no trailing slash). Used for canonical
  // URLs, hreflang, Open Graph and the sitemap. Set this before launch.
  siteUrl: (env.SITE_URL || 'https://somo.example').replace(/\/$/, ''),
  siteName: 'SOMO',
  defaultLang: 'el', // Greek is the default language.

  // --- Analytics -----------------------------------------------------------
  // No analytics platform is installed by default. Leave ANALYTICS_ID empty to
  // ship without one. If you set a GA4 measurement id (G-XXXXXXXX), the gtag
  // loader is injected and the tracked events below flow to it. Either way,
  // every tracked interaction is pushed to window.dataLayer so a tag manager
  // (GTM etc.) can pick it up.
  analyticsId: env.ANALYTICS_ID || '',

  // --- Luma (events, waiting lists, applications) --------------------------
  luma: {
    // LUMA_ALL_EVENTS_URL — the main SOMO calendar. Used by every general
    // "upcoming experiences" CTA in the nav, hero and footer.
    allEvents: env.LUMA_ALL_EVENTS_URL || 'https://lu.ma/somo',
    // LUMA_CIRCLES_URL — upcoming Somo Circles.
    circles: env.LUMA_CIRCLES_URL || 'https://lu.ma/somo',
    // LUMA_FLOW_WAITLIST_URL — Somo Flow waiting list.
    flowWaitlist: env.LUMA_FLOW_WAITLIST_URL || 'https://lu.ma/somo',
    // LUMA_OUTDOORS_URL — where accepted members view and book Somo Outdoors.
    outdoors: env.LUMA_OUTDOORS_URL || 'https://lu.ma/somo',
  },

  // --- Forms ---------------------------------------------------------------
  // Both non-Luma forms POST to these endpoints (Formspree, Basin, a Netlify
  // function, a Google Apps Script, etc.). While empty, the forms validate and
  // show the confirmation UI but do not transmit — set a real endpoint before
  // launch. See somo/assets/somo.js (SOMO_FORMS) for the submit behaviour.
  outdoorsApplicationUrl: env.OUTDOORS_APPLICATION_URL || '',
  contactFormUrl: env.CONTACT_FORM_URL || '',

  // CONTACT_EMAIL — shown as a contact route and used as the mailto fallback
  // for the forms when no POST endpoint is configured. Leave empty to hide it.
  contactEmail: env.CONTACT_EMAIL || '',

  // --- Social (optional) ---------------------------------------------------
  // Add real profile URLs to surface footer social links. Empty = hidden.
  social: {
    instagram: env.SOMO_INSTAGRAM_URL || '',
    linkedin: env.SOMO_LINKEDIN_URL || '',
  },
};

/*
 * UTM helper — outbound Luma links are attributed to the page and placement
 * they were clicked from so registrations can be traced back. UTM parameters
 * are never shown to users; they only live inside the href.
 */
function withUtm(url, page, placement) {
  if (!url) return url;
  // Do not decorate on-page anchors or mailto links.
  if (url.startsWith('#') || url.startsWith('mailto:')) return url;
  const params = new URLSearchParams({
    utm_source: 'somo-website',
    utm_medium: 'referral',
    utm_campaign: page,
  });
  if (placement) params.set('utm_content', placement);
  const sep = url.includes('?') ? '&' : '?';
  return url + sep + params.toString();
}

module.exports = { config, withUtm };
