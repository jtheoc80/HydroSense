import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { markNoShow } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, visit: await markNoShow(id, await request.json()) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
