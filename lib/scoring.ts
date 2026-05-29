import { cities } from "./cities";

const serviceAreaZips = new Set<string>();
for (const city of Object.values(cities)) {
  for (const zip of city.zips) {
    if (/^\d{5}$/.test(zip)) {
      serviceAreaZips.add(zip);
    }
  }
}

export interface QualifyingFlags {
  install_ready: boolean;
  needs_electrician: boolean;
  fire_sprinkler_concern: boolean;
  wifi_extender_needed: boolean;
}

export interface LeadScore {
  score: number;
  tier: "hot" | "warm" | "cold";
  factors: string[];
  qualifying_flags: QualifyingFlags;
}

export function scoreLead(lead: {
  carrier?: string;
  zip?: string;
  address?: string;
  message?: string;
  power_within_12ft?: string;
  fire_sprinkler_system?: string;
  wifi_at_install_location?: string;
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

  const qualifying_flags: QualifyingFlags = {
    install_ready:
      lead.power_within_12ft === "yes" &&
      lead.fire_sprinkler_system === "no" &&
      lead.wifi_at_install_location === "yes",
    needs_electrician: lead.power_within_12ft === "no",
    fire_sprinkler_concern: lead.fire_sprinkler_system === "yes",
    wifi_extender_needed: lead.wifi_at_install_location === "no",
  };

  return { score, tier, factors, qualifying_flags };
}
