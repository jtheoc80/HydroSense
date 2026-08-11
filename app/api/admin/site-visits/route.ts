import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { scheduleSiteVisit } from "@/lib/site-visits/service";

export async function POST(request: Request) {
  try {
    const result = await scheduleSiteVisit(await request.json());
    return noStoreJson({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
