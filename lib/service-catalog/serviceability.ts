import { cities } from "@/lib/cities";
import type { ServiceabilityResult } from "./types";

const postalCodePattern = /^\d{5}$/;

export function normalizePostalCode(postalCode: string): string {
  return postalCode.trim();
}

export function checkServiceability(postalCodeInput: string): ServiceabilityResult {
  const postalCode = normalizePostalCode(postalCodeInput);
  const markets = postalCodePattern.test(postalCode)
    ? Object.values(cities)
        .filter((city) => city.zips.includes(postalCode))
        .map((city) => ({ slug: city.slug, name: city.name }))
        .sort((left, right) => left.name.localeCompare(right.name))
    : [];

  if (markets.length > 0) {
    return {
      postalCode,
      status: "serviceable",
      markets,
      nextAction: "request_compatibility_assessment",
    };
  }

  return {
    postalCode,
    status: "review_required",
    markets: [],
    nextAction: "manual_service_area_review",
  };
}
