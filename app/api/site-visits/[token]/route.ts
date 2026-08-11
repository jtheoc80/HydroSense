import { noStoreJson, publicSiteVisitRouteError } from "@/lib/site-visits/http";
import { getCustomerPortalData } from "@/lib/site-visits/service";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    return noStoreJson({ ok: true, visit: await getCustomerPortalData(token) });
  } catch (error) {
    return publicSiteVisitRouteError(error);
  }
}
