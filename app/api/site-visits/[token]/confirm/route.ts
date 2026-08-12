import { noStoreJson, publicSiteVisitRouteError } from "@/lib/site-visits/http";
import { confirmCustomerVisit, getCustomerPortalData } from "@/lib/site-visits/service";

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await confirmCustomerVisit(token);
    return noStoreJson({ ok: true, visit: await getCustomerPortalData(token) });
  } catch (error) {
    return publicSiteVisitRouteError(error);
  }
}
