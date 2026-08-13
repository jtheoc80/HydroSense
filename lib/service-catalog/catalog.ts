import type {
  CatalogService,
  IncomingLineSize,
  InstallationService,
  ServiceCatalog,
} from "./types";

export const PUBLIC_API_VERSION = "v1" as const;
export const CATALOG_VERSION = "2026-08-12.1" as const;
export const CATALOG_EFFECTIVE_DATE = "2026-08-12" as const;

const catalogSeed = {
  catalogVersion: CATALOG_VERSION,
  effectiveDate: CATALOG_EFFECTIVE_DATE,
  currency: "USD",
  services: [
    {
      id: "HS-INSTALL-075-001",
      name: "3/4-inch smart shutoff installation",
      description: "One compatible smart shutoff device plus standard installation on a verified 3/4-inch domestic incoming water line.",
      category: "installation",
      active: true,
      price: { type: "fixed", amount: 999, unit: "project" },
      incomingLineSize: "0.75",
      deviceIncluded: true,
      commercialGradeDeviceIncluded: false,
    },
    {
      id: "HS-INSTALL-100-001",
      name: "1-inch smart shutoff installation",
      description: "One compatible smart shutoff device plus standard installation on a verified 1-inch domestic incoming water line.",
      category: "installation",
      active: true,
      price: { type: "fixed", amount: 1450, unit: "project" },
      incomingLineSize: "1.00",
      deviceIncluded: true,
      commercialGradeDeviceIncluded: false,
    },
    {
      id: "HS-INSTALL-125-001",
      name: "1 1/4-inch smart shutoff installation",
      description: "One compatible smart shutoff device plus standard installation on a verified 1 1/4-inch domestic incoming water line.",
      category: "installation",
      active: true,
      price: { type: "fixed", amount: 1875, unit: "project" },
      incomingLineSize: "1.25",
      deviceIncluded: true,
      commercialGradeDeviceIncluded: false,
    },
    {
      id: "HS-INSTALL-150-001",
      name: "1 1/2-inch smart shutoff installation",
      description: "One compatible smart shutoff device plus standard installation on a verified 1 1/2-inch domestic incoming water line.",
      category: "installation",
      active: true,
      price: { type: "fixed", amount: 2638, unit: "project" },
      incomingLineSize: "1.50",
      deviceIncluded: true,
      commercialGradeDeviceIncluded: false,
    },
    {
      id: "HS-INSTALL-200-001",
      name: "2-inch commercial-grade smart shutoff installation",
      description: "One compatible commercial-grade smart shutoff device plus standard installation on a verified 2-inch domestic incoming water line.",
      category: "installation",
      active: true,
      price: { type: "fixed", amount: 3425, unit: "project" },
      incomingLineSize: "2.00",
      deviceIncluded: true,
      commercialGradeDeviceIncluded: true,
    },
    {
      id: "HS-SENSOR-ADD-001",
      name: "Additional compatible sensor",
      description: "One additional sensor when quantity and compatibility are confirmed.",
      category: "add_on",
      active: true,
      price: { type: "fixed", amount: 75, unit: "each" },
    },
    {
      id: "HS-BATTERY-ADD-001",
      name: "Compatible battery backup",
      description: "One compatible battery backup when requested and system compatibility is confirmed.",
      category: "add_on",
      active: true,
      price: { type: "fixed", amount: 475, unit: "system" },
    },
    {
      id: "HS-CARE-ANNUAL-001",
      name: "Annual system care",
      description: "Optional annual physical inspection and system review. Manufacturer core monitoring and automatic shutoff do not require a HydroSense plan.",
      category: "care",
      active: true,
      price: { type: "fixed", amount: 99, unit: "year" },
    },
    {
      id: "HS-SITE-ASSESS-001",
      name: "Installation compatibility assessment",
      description: "A no-cost review of service area, domestic-line routing, access, power, Wi-Fi, and installation conditions.",
      category: "assessment",
      active: true,
      price: { type: "fixed", amount: 0, unit: "assessment" },
    },
    {
      id: "HS-IRRIGATION-ADD-001",
      name: "Irrigation shutoff scope",
      description: "Optional irrigation scope only when specifically requested, technically reviewed, and included in the written proposal.",
      category: "quote_required",
      active: true,
      price: { type: "quote_required" },
    },
    {
      id: "HS-CORRECTIVE-001",
      name: "Corrective plumbing",
      description: "Corrective or non-standard plumbing work identified during technical review and priced only in the written proposal.",
      category: "quote_required",
      active: true,
      price: { type: "quote_required" },
    },
  ],
  policies: {
    standardScope: "Domestic household water is the standard HydroSense installation scope.",
    fireSuppressionExclusion: "Fire-sprinkler and fire-suppression piping are always excluded from HydroSense installation, monitoring, and automatic shutoff scope.",
    finalWrittenProposalRequired: true,
    bookingAuthority: "assessment_only",
    unpublishedVariables: [
      "travel",
      "after_hours",
      "permit",
      "tax",
      "electrical_modification",
      "dual_main",
      "inaccessible_routing",
      "corrective_repair",
      "non_standard_pipework",
    ],
  },
} as const satisfies ServiceCatalog;

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
  }
  return value;
}

export const serviceCatalog = deepFreeze(catalogSeed);

const typedServices = serviceCatalog.services as readonly CatalogService[];

export const activeServices = typedServices.filter(
  (service): service is CatalogService => service.active,
);

export const installationServices = activeServices.filter(
  (service): service is InstallationService => service.category === "installation",
);

export function getServiceById(serviceId: string): CatalogService | undefined {
  return activeServices.find((service) => service.id === serviceId);
}

export function getInstallationService(
  incomingLineSize: IncomingLineSize,
): InstallationService {
  const service = installationServices.find(
    (candidate) => candidate.incomingLineSize === incomingLineSize,
  );
  if (!service) throw new Error(`Catalog invariant failed for line size ${incomingLineSize}`);
  return service;
}

export function getFixedService(serviceId: string): CatalogService & {
  readonly price: { readonly type: "fixed"; readonly amount: number; readonly unit: string };
} {
  const service = getServiceById(serviceId);
  if (!service || service.price.type !== "fixed") {
    throw new Error(`Catalog invariant failed for fixed service ${serviceId}`);
  }
  return service as CatalogService & {
    readonly price: { readonly type: "fixed"; readonly amount: number; readonly unit: string };
  };
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: serviceCatalog.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function publicCatalogProjection() {
  return {
    catalogVersion: serviceCatalog.catalogVersion,
    effectiveDate: serviceCatalog.effectiveDate,
    currency: serviceCatalog.currency,
    services: activeServices,
    scope: {
      standard: serviceCatalog.policies.standardScope,
      fireSuppressionExclusion: serviceCatalog.policies.fireSuppressionExclusion,
      finalWrittenProposalRequired: serviceCatalog.policies.finalWrittenProposalRequired,
      bookingAuthority: serviceCatalog.policies.bookingAuthority,
    },
  } as const;
}
