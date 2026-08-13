import { publicCatalogProjection } from "@/lib/service-catalog/catalog";
import { publicJson } from "@/lib/service-catalog/http";

export async function GET() {
  return publicJson(publicCatalogProjection());
}
