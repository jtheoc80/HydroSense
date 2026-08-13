import { CATALOG_VERSION, getServiceById, PUBLIC_API_VERSION } from "@/lib/service-catalog/catalog";
import { publicError, publicJson } from "@/lib/service-catalog/http";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const { serviceId } = await params;
  const service = getServiceById(serviceId);

  if (!service) {
    return publicError(404, "service_not_found", "No active public service matches that service ID");
  }

  return publicJson({
    apiVersion: PUBLIC_API_VERSION,
    catalogVersion: CATALOG_VERSION,
    service,
  });
}
