import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { adminReschedule, getAdminVisitDetail } from "@/lib/site-visits/service";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, ...(await getAdminVisitDetail(id)) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, ...(await adminReschedule(id, await request.json())) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
