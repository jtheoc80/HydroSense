import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { scheduleLinkedRecheck } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return noStoreJson({ ok: true, ...(await scheduleLinkedRecheck(id, await request.json())) }, { status: 201 });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
