/**
 * Meta Pixel event helpers.
 *
 * Every function guards against SSR and missing fbq (ad-blockers, dev
 * environments without the env var, etc.).
 */

function canTrack(): boolean {
  return typeof window !== "undefined" && !!window.fbq;
}

/** Lead form submission (consultation request). */
export function trackLead(value = 400, currency = "USD") {
  if (canTrack()) window.fbq("track", "Lead", { value, currency });
}

/** Phone number click-to-call. */
export function trackContact() {
  if (canTrack()) window.fbq("track", "Contact");
}

/** Service or blog page view (beyond the automatic PageView). */
export function trackViewContent(contentName: string) {
  if (canTrack()) window.fbq("track", "ViewContent", { content_name: contentName });
}

/** Appointment booking (Cal.com / scheduling widget). */
export function trackSchedule(value = 999, currency = "USD") {
  if (canTrack()) window.fbq("trackCustom", "Schedule", { value, currency });
}
