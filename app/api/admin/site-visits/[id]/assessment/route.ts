import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { saveAssessment } from "@/lib/site-visits/service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const visit = await saveAssessment(id, body.assessment, body.actorLabel);
    return noStoreJson({ ok: true, visit });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
