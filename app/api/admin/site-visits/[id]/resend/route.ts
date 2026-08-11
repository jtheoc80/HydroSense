import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { resendConfirmation } from "@/lib/site-visits/service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, deliveries: await resendConfirmation(id) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
