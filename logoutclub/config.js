/* =============================================================================
   LOGOUT CLUB — site configuration
   -----------------------------------------------------------------------------
   This is the ONE place to plug in real URLs. Nothing else needs editing.
   Leave a value as "" (empty string) and the site degrades gracefully:
   the Luma calendar shows a designed placeholder, and unconfigured links
   are rendered as plain (non-linked) text instead of broken links.
   ========================================================================== */
window.LOGOUT_CLUB_CONFIG = {

  /* -- LUMA (single source of truth for dates, tickets, availability) --------
     1. Open your calendar on Luma → "..." menu → "Embed calendar".
     2. Copy ONLY the src URL from the <iframe> it gives you and paste it below.
        It looks like:  https://lu.ma/embed/calendar/cal-xxxxxxxxxxxxxxx/events
     Leaving this "" keeps the placeholder in the real layout.                 */
  lumaCalendarUrl: "",

  /* Public Luma calendar page (the human-facing URL, e.g. https://lu.ma/logoutclub).
     Used for the "View on Luma" fallback link and the footer.                 */
  lumaPageUrl: "",

  /* -- Social + contact ------------------------------------------------------ */
  instagramUrl: "",              // e.g. "https://www.instagram.com/logoutclub"
  contactEmail: "",              // e.g. "hello@logoutclub.gr"  (used for mailto: links)

  /* -- Primary / canonical host (no trailing slash) -------------------------
     Both logoutclub.gr and logoutclub.aggelosmouzakitis.com serve this site;
     this value is only used as the canonical + Open Graph host. Change it if
     you want the subdomain to be canonical instead.                           */
  primaryHost: "https://logoutclub.gr"
};
