import { googleBusinessProfilePlumbingStatement } from "./plumbing-license";

/**
 * Google Business Profile Help currently limits the description field to 750
 * characters and disallows URLs, HTML, promotions, prices, and sales language.
 * Verified 2026-08-15: https://support.google.com/business/answer/3039617
 */
export const GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT = 750;

export const recommendedGoogleBusinessProfileDescription = [
  "HydroSense Texas specializes in professional smart water shutoff installation across Greater Houston.",
  "We evaluate the incoming domestic water line, select a compatible system, coordinate plumbing installation, complete device setup, test automatic shutoff operation, and provide an installation record.",
  "HydroSense is listed in Phyn's Find a Phyn Pro Directory and supports FloLogic large-line applications.",
  googleBusinessProfilePlumbingStatement,
].join(" ");
