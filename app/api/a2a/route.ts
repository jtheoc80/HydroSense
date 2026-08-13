import {
  jsonRpcParseError,
  jsonRpcRequestTooLarge,
  processA2ARequest,
} from "@/lib/service-catalog/a2a";
import { PublicRequestError, readBoundedJson } from "@/lib/service-catalog/http";

function a2aResponse(outcome: ReturnType<typeof processA2ARequest>) {
  return new Response(JSON.stringify(outcome.body), {
    status: outcome.status,
    headers: {
      "A2A-Version": "1.0",
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  try {
    return a2aResponse(processA2ARequest(await readBoundedJson(request)));
  } catch (error) {
    if (error instanceof PublicRequestError) {
      return a2aResponse(
        error.status === 413 ? jsonRpcRequestTooLarge() : jsonRpcParseError(),
      );
    }
    return a2aResponse({
      status: 500,
      body: {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: "Internal error" },
      },
    });
  }
}
