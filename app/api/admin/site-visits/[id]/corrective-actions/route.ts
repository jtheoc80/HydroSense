import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { resolveCorrectiveAction } from "@/lib/site-visits/service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, visit: await resolveCorrectiveAction(id, await request.json()) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
