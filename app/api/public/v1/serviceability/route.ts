import { z } from "zod";
import { CATALOG_VERSION, PUBLIC_API_VERSION } from "@/lib/service-catalog/catalog";
import {
  PublicRequestError,
  publicError,
  publicJson,
  readBoundedJson,
} from "@/lib/service-catalog/http";
import { serviceabilityRequestSchema } from "@/lib/service-catalog/pricing";
import { checkServiceability } from "@/lib/service-catalog/serviceability";

export async function POST(request: Request) {
  try {
    const input = serviceabilityRequestSchema.parse(await readBoundedJson(request));
    return publicJson(
      {
        apiVersion: PUBLIC_API_VERSION,
        catalogVersion: CATALOG_VERSION,
        serviceability: checkServiceability(input.postalCode),
      },
      { cacheControl: "no-store" },
    );
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
