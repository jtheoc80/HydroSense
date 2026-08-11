import { noStoreJson, publicSiteVisitRouteError } from "@/lib/site-visits/http";
import { cancelCustomerVisit, getCustomerPortalData } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await cancelCustomerVisit(token, await request.json());
    return noStoreJson({ ok: true, visit: await getCustomerPortalData(token) });
  } catch (error) {
    return publicSiteVisitRouteError(error);
  }
}
