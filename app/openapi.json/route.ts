import { publicJson } from "@/lib/service-catalog/http";
import { buildOpenApiDocument } from "@/lib/service-catalog/openapi";

export async function GET() {
  return publicJson(buildOpenApiDocument());
}
