import type { SiteVisit } from "./types";
import { siteUrl } from "./format";

export async function sendSiteVisitAlert(
  visit: Pick<SiteVisit, "id" | "customer_first_name" | "customer_last_name" | "property_address">,
  title: string,
  detail: string,
  priority = 0
): Promise<void> {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;
  if (!userKey || !appToken) throw new Error("Pushover is not configured");

  const response = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: appToken,
      user: userKey,
      title,
      message: `${visit.customer_first_name} ${visit.customer_last_name} | ${visit.property_address}\n${detail}`,
      url: `${siteUrl()}/admin/site-visits/${visit.id}`,
      url_title: "Open site visit",
      priority,
    }),
  });
  if (!response.ok) throw new Error(`Pushover delivery failed (${response.status})`);
}
