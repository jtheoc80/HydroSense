import { createHash } from "node:crypto";
import { createAgentCard } from "@/lib/service-catalog/a2a";
import { PUBLIC_GET_CACHE_CONTROL } from "@/lib/service-catalog/http";

const agentCardBody = JSON.stringify(createAgentCard());
const etag = `"${createHash("sha256").update(agentCardBody).digest("hex")}"`;

export async function GET(request: Request) {
  const headers = {
    "Cache-Control": PUBLIC_GET_CACHE_CONTROL,
    "Content-Type": "application/json; charset=utf-8",
    ETag: etag,
    "X-Content-Type-Options": "nosniff",
  };

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(agentCardBody, { headers });
}
