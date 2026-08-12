import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { declineCustomerReschedule } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, visit: await declineCustomerReschedule(id, await request.json()) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
