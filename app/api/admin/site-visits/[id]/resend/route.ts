import { noStoreJson, siteVisitRouteError } from "@/lib/site-visits/http";
import { resendConfirmation } from "@/lib/site-visits/service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({})) as { idempotencyKey?: unknown };
    if (typeof body.idempotencyKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.idempotencyKey)) {
      return noStoreJson({ ok: false, error: "A valid idempotency key is required" }, { status: 400 });
    }
    return noStoreJson({
      ok: true,
      deliveries: await resendConfirmation(id, body.idempotencyKey),
    });
  } catch (error) {
    return siteVisitRouteError(error);
  }
}
