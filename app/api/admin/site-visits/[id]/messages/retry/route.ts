import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { retryFailedMessage } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { messageId?: unknown; actorLabel?: unknown };
    if (typeof body.messageId !== "string") return noStoreJson({ ok: false, error: "Message ID is required" }, { status: 400 });
    return noStoreJson({
      ok: true,
      deliveries: await retryFailedMessage(id, body.messageId, typeof body.actorLabel === "string" ? body.actorLabel : undefined),
    });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
