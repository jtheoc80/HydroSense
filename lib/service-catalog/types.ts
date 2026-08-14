export type Currency = "USD";

export type IncomingLineSize = "0.75" | "1.00" | "1.25" | "1.50" | "2.00";

export type DeviceFamilyDesignation = "supported" | "designated";

export interface DeviceFamily {
  readonly slug: string;
  readonly name: string;
  readonly designation: DeviceFamilyDesignation;
}

export type ServiceCategory =
  | "installation"
  | "add_on"
  | "care"
  | "assessment"
  | "quote_required";

export type FixedPriceUnit = "project" | "each" | "system" | "year" | "assessment";

export interface FixedPrice {
  readonly type: "fixed";
  readonly amount: number;
  readonly unit: FixedPriceUnit;
}

export interface QuoteRequiredPrice {
  readonly type: "quote_required";
}

export interface CatalogServiceBase {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ServiceCategory;
  readonly active: true;
  readonly price: FixedPrice | QuoteRequiredPrice;
}

export interface InstallationService extends CatalogServiceBase {
  readonly category: "installation";
  readonly incomingLineSize: IncomingLineSize;
  readonly deviceIncluded: true;
  readonly commercialGradeDeviceIncluded: boolean;
  readonly deviceFamily?: DeviceFamily;
}

export interface StandardCatalogService extends CatalogServiceBase {
  readonly category: Exclude<ServiceCategory, "installation">;
}

export type CatalogService = InstallationService | StandardCatalogService;

export interface ServiceCatalog {
  readonly catalogVersion: "2026-08-14.1";
  readonly effectiveDate: "2026-08-14";
  readonly currency: Currency;
  readonly services: readonly CatalogService[];
  readonly policies: {
    readonly standardScope: string;
    readonly fireSuppressionExclusion: string;
    readonly finalWrittenProposalRequired: true;
    readonly bookingAuthority: "assessment_only";
    readonly unpublishedVariables: readonly string[];
  };
}

export type EstimateStatus =
  | "catalog_exact_standard_scope"
  | "conditional"
  | "review_required";

export interface ServiceabilityResult {
  readonly postalCode: string;
  readonly status: "serviceable" | "review_required";
  readonly markets: readonly { readonly slug: string; readonly name: string }[];
  readonly nextAction: "request_compatibility_assessment" | "manual_service_area_review";
}

export interface EstimateLineItem {
  readonly serviceId: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly total: number;
  readonly deviceFamily?: DeviceFamily;
}

export interface ConditionalAddOn {
  readonly serviceId: string;
  readonly name: string;
  readonly quantity: number;
  readonly possibleUnitPrice: number;
  readonly reason: string;
}

export interface RecurringSelection {
  readonly serviceId: "HS-CARE-ANNUAL-001";
  readonly name: string;
  readonly amount: number;
  readonly currency: Currency;
  readonly billingDuration: "P1Y";
}

export interface EstimateResponse {
  readonly apiVersion: "v1";
  readonly catalogVersion: ServiceCatalog["catalogVersion"];
  readonly currency: Currency;
  readonly serviceability: ServiceabilityResult;
  readonly baseService: EstimateLineItem | null;
  readonly confirmedFixedAddOns: readonly EstimateLineItem[];
  readonly conditionalAddOns: readonly ConditionalAddOn[];
  readonly oneTimeCatalogTotal: number | null;
  /**
   * Backward-compatible alias for oneTimeCatalogTotal.
   * Recurring selections are never included.
   */
  readonly publishedCatalogTotal: number | null;
  readonly recurringSelections: readonly RecurringSelection[];
  readonly estimateStatus: EstimateStatus;
  readonly missingInputs: readonly string[];
  readonly reviewReasons: readonly string[];
  readonly scope: {
    readonly included: readonly string[];
    readonly quoteRequired: readonly string[];
    readonly excluded: readonly string[];
  };
  readonly finalWrittenProposalRequired: true;
  readonly bookingAuthority: "assessment_only";
}
