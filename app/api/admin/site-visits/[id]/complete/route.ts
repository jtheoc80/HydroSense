import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { completeAssessment } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return noStoreJson({ ok: true, ...(await completeAssessment(id, body.assessment, body.revision)) });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
