import type { FixtureCheck, SiteAssessment } from "./types";

export const emptyFixture = (): FixtureCheck => ({ result: "not_tested", notes: "" });

export function createEmptyAssessment(bathroomCount = 1): SiteAssessment {
  const count = Math.max(0, Math.min(30, bathroomCount || 0));
  return {
    permissionToInspect: null,
    homeownerPresent: null,
    exterior: {
      meterAccessible: "not_tested",
      mainShutoffAccessible: "not_tested",
      mainValveCondition: "not_tested",
      waterEntryRoute: "",
      pipeMaterial: "",
      approximatePipeDiameter: "",
      unexplainedMeterMovement: "unsure",
      visibleExteriorLeak: "not_tested",
      fireSprinklerBranchConcern: "unsure",
      irrigationOrPoolBranchPresent: "unsure",
      proposedInstallLocationSuitable: "unsure",
      proposedDeviceLocation: "",
      serviceClearanceAdequate: "unsure",
      weatherExposureNotes: "",
      notes: "",
    },
    kitchen: {
      sinkSupplyAndDrain: emptyFixture(),
      dishwasher: emptyFixture(),
      refrigeratorIceMaker: emptyFixture(),
      visibleMoisture: emptyFixture(),
    },
    bathrooms: Array.from({ length: count }, (_, index) => ({
      id: `bath-${index + 1}`,
      label: `Bathroom ${index + 1}`,
      toilet: emptyFixture(),
      sinkSupplyAndDrain: emptyFixture(),
      tubOrShower: emptyFixture(),
      visibleMoisture: emptyFixture(),
    })),
    laundryUtility: {
      washingMachine: emptyFixture(),
      waterHeater: emptyFixture(),
      utilitySink: emptyFixture(),
      waterSoftenerOrFilter: emptyFixture(),
      visibleMoisture: emptyFixture(),
    },
    otherWaterAreas: [],
    connectivity: { wifiVerified: "unsure", powerVerified: "unsure", notes: "" },
    finalNotes: "",
    customerAcknowledgment: { acknowledged: false, typedName: "" },
  };
}

export function mergeAssessment(
  existing: Partial<SiteAssessment> | null | undefined,
  bathroomCount: number
): SiteAssessment {
  const base = createEmptyAssessment(bathroomCount);
  if (!existing || Object.keys(existing).length === 0) return base;
  return {
    ...base,
    ...existing,
    exterior: { ...base.exterior, ...(existing.exterior || {}) },
    kitchen: { ...base.kitchen, ...(existing.kitchen || {}) },
    bathrooms: existing.bathrooms?.length ? existing.bathrooms : base.bathrooms,
    laundryUtility: { ...base.laundryUtility, ...(existing.laundryUtility || {}) },
    otherWaterAreas: existing.otherWaterAreas || [],
    connectivity: { ...base.connectivity, ...(existing.connectivity || {}) },
    customerAcknowledgment: {
      acknowledged: existing.customerAcknowledgment?.acknowledged ?? false,
      typedName: existing.customerAcknowledgment?.typedName || "",
    },
  };
}
