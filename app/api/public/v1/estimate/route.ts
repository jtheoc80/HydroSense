import { z } from "zod";
import {
  PublicRequestError,
  publicError,
  publicJson,
  readBoundedJson,
} from "@/lib/service-catalog/http";
import { calculateEstimate, estimateRequestSchema } from "@/lib/service-catalog/pricing";

export async function POST(request: Request) {
  try {
    const input = estimateRequestSchema.parse(await readBoundedJson(request));
    return publicJson(calculateEstimate(input), { cacheControl: "no-store" });
  } catch (error) {
    if (error instanceof PublicRequestError) {
      return publicError(error.status, error.code, error.message);
    }
    if (error instanceof z.ZodError) {
      return publicError(400, "invalid_request", "Request validation failed", error.flatten());
    }
    return publicError(500, "internal_error", "The request could not be processed");
  }
}
