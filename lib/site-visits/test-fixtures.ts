import type { PrevisitAnswers, SiteAssessment } from "./types";

const clearFixture = () => ({ result: "clear" as const, notes: "Checked" });

export function cleanPrevisit(): PrevisitAnswers {
  return {
    bathroomCount: 1,
    shutoffLocationKnown: "yes",
    activeLeak: "no",
    previousLeak: "no",
    wifiAtInstallLocation: "yes",
    powerWithin12Feet: "yes",
    fireSprinklerSystem: "no",
  };
}

export function cleanAssessment(): SiteAssessment {
  return {
    permissionToInspect: true,
    homeownerPresent: true,
    exterior: {
      meterAccessible: "clear",
      mainShutoffAccessible: "clear",
      mainValveCondition: "clear",
      waterEntryRoute: "Front exterior wall",
      pipeMaterial: "Copper",
      approximatePipeDiameter: "1 inch",
      unexplainedMeterMovement: "no",
      visibleExteriorLeak: "clear",
      fireSprinklerBranchConcern: "no",
      irrigationOrPoolBranchPresent: "no",
      proposedInstallLocationSuitable: "yes",
      proposedDeviceLocation: "Garage main entry",
      serviceClearanceAdequate: "yes",
    },
    kitchen: {
      sinkSupplyAndDrain: clearFixture(),
      dishwasher: clearFixture(),
      refrigeratorIceMaker: clearFixture(),
      visibleMoisture: clearFixture(),
    },
    bathrooms: [{
      id: "bath-1", label: "Primary bathroom", toilet: clearFixture(),
      sinkSupplyAndDrain: clearFixture(), tubOrShower: clearFixture(), visibleMoisture: clearFixture(),
    }],
    laundryUtility: {
      washingMachine: clearFixture(), waterHeater: clearFixture(),
      utilitySink: { result: "not_present", notes: "No utility sink" },
      waterSoftenerOrFilter: { result: "not_present", notes: "Not present" },
      visibleMoisture: clearFixture(),
    },
    otherWaterAreas: [],
    connectivity: { wifiVerified: "yes", powerVerified: "yes", outletDistanceFeet: 8 },
    customerAcknowledgment: { acknowledged: true, typedName: "Test Homeowner" },
  };
}
