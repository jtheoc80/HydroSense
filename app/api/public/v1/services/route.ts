import { activeServices, CATALOG_VERSION, PUBLIC_API_VERSION } from "@/lib/service-catalog/catalog";
import { publicJson } from "@/lib/service-catalog/http";

export async function GET() {
  return publicJson({
    apiVersion: PUBLIC_API_VERSION,
    catalogVersion: CATALOG_VERSION,
    services: activeServices,
  });
}
