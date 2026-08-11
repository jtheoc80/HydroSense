import { noStoreJson, publicSiteVisitRouteError } from "@/lib/site-visits/http";
import { getCustomerPortalData, requestCustomerReschedule } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await requestCustomerReschedule(token, await request.json());
    return noStoreJson({ ok: true, visit: await getCustomerPortalData(token) });
  } catch (error) {
    return publicSiteVisitRouteError(error);
  }
}
