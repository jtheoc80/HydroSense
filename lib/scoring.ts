import { cities } from "./cities";

const serviceAreaZips = new Set<string>();
for (const city of Object.values(cities)) {
  for (const zip of city.zips) {
    if (/^\d{5}$/.test(zip)) {
      serviceAreaZips.add(zip);
    }
  }
}

export interface LeadScore {
  score: number;
  tier: "hot" | "warm" | "cold";
  factors: string[];
}

export function scoreLead(lead: {
  carrier?: string;
  zip?: string;
  address?: string;
  message?: string;
}): LeadScore {
  let score = 0;
  const factors: string[] = [];

  if (lead.carrier && lead.carrier !== "Not sure" && lead.carrier !== "") {
    score += 1;
    factors.push("carrier_listed");
  }

  const zipClean = (lead.zip || "").replace(/-\d{4}$/, "");
  if (serviceAreaZips.has(zipClean)) {
    score += 1;
    factors.push("zip_in_service_area");
  }

  if (lead.address && lead.address.trim().length > 5) {
    score += 1;
    factors.push("address_provided");
  }

  if (lead.message && lead.message.trim().length > 0) {
    score += 1;
    factors.push("message_provided");
  }

  const tier = score >= 3 ? "hot" : score >= 2 ? "warm" : "cold";

  return { score, tier, factors };
}
