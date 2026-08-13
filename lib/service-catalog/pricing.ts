import { z } from "zod";
import {
  CATALOG_VERSION,
  getFixedService,
  getInstallationService,
  PUBLIC_API_VERSION,
  serviceCatalog,
} from "./catalog";
import { checkServiceability } from "./serviceability";
import type {
  ConditionalAddOn,
  EstimateLineItem,
  EstimateResponse,
  EstimateStatus,
  RecurringSelection,
} from "./types";

export const incomingLineSizeSchema = z.enum(["0.75", "1.00", "1.25", "1.50", "2.00"]);

export const serviceabilityRequestSchema = z
  .object({
    postalCode: z.string().trim().regex(/^\d{5}$/, "postalCode must contain exactly five digits"),
  })
  .strict();

export const estimateRequestSchema = z
  .object({
    postalCode: z.string().trim().regex(/^\d{5}$/, "postalCode must contain exactly five digits"),
    incomingLineSize: incomingLineSizeSchema.optional(),
    propertyType: z.enum(["single_family_residential", "other", "unknown"]).optional(),
    incomingLineSizeVerified: z.boolean().optional(),
    domesticMainAccessible: z.boolean().optional(),
    standardPipework: z.boolean().optional(),
    nearbyPower: z.boolean().optional(),
    wifiAvailable: z.boolean().optional(),
    dualMain: z.boolean().optional(),
    electricalModificationRequired: z.boolean().optional(),
    correctiveRepairRequired: z.boolean().optional(),
    irrigationRequested: z.boolean().optional(),
    fireSprinklerPresent: z.boolean().optional(),
    fireSystemRoutingReviewed: z.boolean().optional(),
    sensorQuantity: z.number().int().min(0).max(20).optional().default(0),
    sensorCompatibilityConfirmed: z.boolean().optional(),
    batteryRequested: z.boolean().optional().default(false),
    batteryCompatibilityConfirmed: z.boolean().optional(),
    annualCareRequested: z.boolean().optional().default(false),
  })
  .strict();

export type EstimateRequest = z.input<typeof estimateRequestSchema>;

function lineItem(serviceId: string, quantity = 1): EstimateLineItem {
  const service = getFixedService(serviceId);
  return {
    serviceId: service.id,
    name: service.name,
    quantity,
    unitPrice: service.price.amount,
    total: service.price.amount * quantity,
  };
}

function addMissingIfUndefined(
  input: Record<string, unknown>,
  missingInputs: string[],
  field: string,
) {
  if (input[field] === undefined) missingInputs.push(field);
}

export function calculateEstimate(rawInput: EstimateRequest): EstimateResponse {
  const input = estimateRequestSchema.parse(rawInput);
  const serviceability = checkServiceability(input.postalCode);
  const missingInputs: string[] = [];
  const reviewReasons: string[] = [];
  const confirmedFixedAddOns: EstimateLineItem[] = [];
  const conditionalAddOns: ConditionalAddOn[] = [];
  const recurringSelections: RecurringSelection[] = [];

  const requiredStandardFields = [
    "incomingLineSize",
    "propertyType",
    "incomingLineSizeVerified",
    "domesticMainAccessible",
    "standardPipework",
    "nearbyPower",
    "wifiAvailable",
    "dualMain",
    "electricalModificationRequired",
    "correctiveRepairRequired",
    "irrigationRequested",
    "fireSprinklerPresent",
  ];
  const inputRecord = input as Record<string, unknown>;
  for (const field of requiredStandardFields) {
    addMissingIfUndefined(inputRecord, missingInputs, field);
  }

  const baseService = input.incomingLineSize
    ? lineItem(getInstallationService(input.incomingLineSize).id)
    : null;

  if (serviceability.status === "review_required") {
    reviewReasons.push("manual_service_area_review");
  }
  if (input.propertyType !== undefined && input.propertyType !== "single_family_residential") {
    reviewReasons.push("non_standard_property_type");
  }
  if (input.incomingLineSizeVerified === false) reviewReasons.push("incoming_line_size_not_verified");
  if (input.domesticMainAccessible === false) reviewReasons.push("domestic_main_access_review_required");
  if (input.standardPipework === false) reviewReasons.push("non_standard_pipework_review_required");
  if (input.nearbyPower === false) reviewReasons.push("power_availability_review_required");
  if (input.wifiAvailable === false) reviewReasons.push("wifi_availability_review_required");
  if (input.dualMain === true) reviewReasons.push("dual_main_review_required");
  if (input.electricalModificationRequired === true) {
    reviewReasons.push("electrical_modification_review_required");
  }
  if (input.correctiveRepairRequired === true) {
    reviewReasons.push("corrective_repair_quote_required");
  }
  if (input.irrigationRequested === true) reviewReasons.push("irrigation_quote_required");
  if (input.fireSprinklerPresent === true && input.fireSystemRoutingReviewed !== true) {
    if (input.fireSystemRoutingReviewed === undefined) missingInputs.push("fireSystemRoutingReviewed");
    reviewReasons.push("fire_system_routing_review_required");
  }

  if (input.sensorQuantity > 0) {
    if (input.sensorCompatibilityConfirmed === true) {
      confirmedFixedAddOns.push(lineItem("HS-SENSOR-ADD-001", input.sensorQuantity));
    } else {
      const sensor = getFixedService("HS-SENSOR-ADD-001");
      conditionalAddOns.push({
        serviceId: sensor.id,
        name: sensor.name,
        quantity: input.sensorQuantity,
        possibleUnitPrice: sensor.price.amount,
        reason: "sensor_compatibility_confirmation_required",
      });
    }
  }

  if (input.batteryRequested) {
    if (input.batteryCompatibilityConfirmed === true) {
      confirmedFixedAddOns.push(lineItem("HS-BATTERY-ADD-001"));
    } else {
      const battery = getFixedService("HS-BATTERY-ADD-001");
      conditionalAddOns.push({
        serviceId: battery.id,
        name: battery.name,
        quantity: 1,
        possibleUnitPrice: battery.price.amount,
        reason: "battery_compatibility_confirmation_required",
      });
    }
  }

  if (input.annualCareRequested) {
    const annualCare = getFixedService("HS-CARE-ANNUAL-001");
    recurringSelections.push({
      serviceId: "HS-CARE-ANNUAL-001",
      name: annualCare.name,
      amount: annualCare.price.amount,
      currency: serviceCatalog.currency,
      billingDuration: "P1Y",
    });
  }

  let estimateStatus: EstimateStatus = "catalog_exact_standard_scope";
  if (missingInputs.length > 0 || reviewReasons.length > 0) {
    estimateStatus = "review_required";
  } else if (conditionalAddOns.length > 0) {
    estimateStatus = "conditional";
  }

  const oneTimeCatalogTotal = baseService
    ? [baseService, ...confirmedFixedAddOns].reduce((sum, item) => sum + item.total, 0)
    : null;
  const publishedCatalogTotal = oneTimeCatalogTotal;

  const quoteRequiredScope = [
    ...(input.irrigationRequested ? ["Irrigation scope requires technical review and a written quote."] : []),
    ...(input.correctiveRepairRequired ? ["Corrective plumbing requires a written quote."] : []),
  ];

  return {
    apiVersion: PUBLIC_API_VERSION,
    catalogVersion: CATALOG_VERSION,
    currency: serviceCatalog.currency,
    serviceability,
    baseService,
    confirmedFixedAddOns,
    conditionalAddOns,
    oneTimeCatalogTotal,
    publishedCatalogTotal,
    recurringSelections,
    estimateStatus,
    missingInputs: Array.from(new Set(missingInputs)),
    reviewReasons: Array.from(new Set(reviewReasons)),
    scope: {
      included: [
        serviceCatalog.policies.standardScope,
        "Every line-size installation price includes one compatible smart shutoff device and standard installation.",
      ],
      quoteRequired: quoteRequiredScope,
      excluded: [serviceCatalog.policies.fireSuppressionExclusion],
    },
    finalWrittenProposalRequired: serviceCatalog.policies.finalWrittenProposalRequired,
    bookingAuthority: serviceCatalog.policies.bookingAuthority,
  };
}
