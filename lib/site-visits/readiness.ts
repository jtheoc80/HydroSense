import type {
  PrevisitAnswers,
  ReadinessBlocker,
  ReadinessResult,
  SiteAssessment,
} from "./types";

const fixturePaths = [
  ["kitchen.sinkSupplyAndDrain", (a: SiteAssessment) => a.kitchen.sinkSupplyAndDrain],
  ["kitchen.dishwasher", (a: SiteAssessment) => a.kitchen.dishwasher],
  ["kitchen.refrigeratorIceMaker", (a: SiteAssessment) => a.kitchen.refrigeratorIceMaker],
  ["kitchen.visibleMoisture", (a: SiteAssessment) => a.kitchen.visibleMoisture],
  ["laundryUtility.washingMachine", (a: SiteAssessment) => a.laundryUtility.washingMachine],
  ["laundryUtility.waterHeater", (a: SiteAssessment) => a.laundryUtility.waterHeater],
  ["laundryUtility.utilitySink", (a: SiteAssessment) => a.laundryUtility.utilitySink],
  ["laundryUtility.waterSoftenerOrFilter", (a: SiteAssessment) => a.laundryUtility.waterSoftenerOrFilter],
  ["laundryUtility.visibleMoisture", (a: SiteAssessment) => a.laundryUtility.visibleMoisture],
] as const;

function blocker(
  code: string,
  title: string,
  detail: string,
  owner: ReadinessBlocker["owner"],
  severity: ReadinessBlocker["severity"] = "blocking"
): ReadinessBlocker {
  return { code, title, detail, owner, severity };
}

export function evaluateReadiness(
  assessment: SiteAssessment,
  previsit: Partial<PrevisitAnswers> = {}
): ReadinessResult {
  const missingRequiredFields: string[] = [];
  const blockers: ReadinessBlocker[] = [];

  if (assessment.permissionToInspect === null) missingRequiredFields.push("permissionToInspect");
  if (assessment.homeownerPresent === null) missingRequiredFields.push("homeownerPresent");
  if (assessment.permissionToInspect === false) {
    blockers.push(blocker("permission-denied", "Permission not granted", "HydroSense cannot complete an assessment without the homeowner's permission.", "customer"));
  }

  const exteriorRequired = [
    ["exterior.meterAccessible", assessment.exterior.meterAccessible],
    ["exterior.mainShutoffAccessible", assessment.exterior.mainShutoffAccessible],
    ["exterior.mainValveCondition", assessment.exterior.mainValveCondition],
    ["exterior.visibleExteriorLeak", assessment.exterior.visibleExteriorLeak],
  ] as const;
  for (const [path, result] of exteriorRequired) {
    if (result === "not_tested") missingRequiredFields.push(path);
    if (result === "not_accessible" && !assessment.exterior.notes?.trim()) {
      missingRequiredFields.push(`${path}.notes`);
    }
  }
  if (!assessment.exterior.unexplainedMeterMovement || assessment.exterior.unexplainedMeterMovement === "unsure") missingRequiredFields.push("exterior.unexplainedMeterMovement");
  if (!assessment.exterior.fireSprinklerBranchConcern) missingRequiredFields.push("exterior.fireSprinklerBranchConcern");
  if (!assessment.exterior.proposedInstallLocationSuitable) missingRequiredFields.push("exterior.proposedInstallLocationSuitable");
  if (!assessment.exterior.serviceClearanceAdequate) missingRequiredFields.push("exterior.serviceClearanceAdequate");
  if (!assessment.connectivity.wifiVerified) missingRequiredFields.push("connectivity.wifiVerified");
  if (!assessment.connectivity.powerVerified) missingRequiredFields.push("connectivity.powerVerified");

  for (const [path, getFixture] of fixturePaths) {
    const fixture = getFixture(assessment);
    if (fixture.result === "not_tested") missingRequiredFields.push(path);
    if (fixture.result === "not_accessible" && !fixture.notes?.trim()) {
      missingRequiredFields.push(`${path}.notes`);
    }
  }
  assessment.bathrooms.forEach((bathroom, index) => {
    const checks = [
      ["toilet", bathroom.toilet],
      ["sinkSupplyAndDrain", bathroom.sinkSupplyAndDrain],
      ["tubOrShower", bathroom.tubOrShower],
      ["visibleMoisture", bathroom.visibleMoisture],
    ] as const;
    checks.forEach(([name, fixture]) => {
      if (fixture.result === "not_tested") missingRequiredFields.push(`bathrooms.${index}.${name}`);
      if (fixture.result === "not_accessible" && !fixture.notes?.trim()) {
        missingRequiredFields.push(`bathrooms.${index}.${name}.notes`);
      }
    });
  });

  if (previsit.activeLeak === "yes") {
    blockers.push(blocker("active-leak-reported", "Active leak reported", "An active leak must be repaired and reassessed before installation.", "plumber"));
  }
  if (previsit.previousLeak === "yes" && previsit.previousLeakRepaired !== "yes") {
    blockers.push(blocker("prior-leak-unresolved", "Previous leak is not confirmed remedied", "Repair and remediation must be confirmed before installation.", "customer"));
  }
  if (assessment.exterior.unexplainedMeterMovement === "yes") {
    blockers.push(blocker("meter-movement", "Unexplained meter movement", "Water movement was observed while fixtures were believed to be off and requires leak diagnosis.", "plumber"));
  }

  const allFixtures = [
    ...fixturePaths.map(([, getFixture]) => getFixture(assessment)),
    ...assessment.bathrooms.flatMap((bathroom) => [
      bathroom.toilet,
      bathroom.sinkSupplyAndDrain,
      bathroom.tubOrShower,
      bathroom.visibleMoisture,
    ]),
    ...assessment.otherWaterAreas.map((area) => ({ result: area.result, notes: area.notes })),
  ];
  if (assessment.exterior.visibleExteriorLeak === "active_leak") {
    blockers.push(blocker("exterior-active-leak", "Active exterior leak observed", "The observed exterior leak must be repaired before installation.", "plumber"));
  }
  if (assessment.exterior.mainValveCondition === "active_leak") {
    blockers.push(blocker("main-valve-active-leak", "Active leak at main valve", "The main valve leak must be repaired before installation.", "plumber"));
  }
  allFixtures.forEach((fixture, index) => {
    if (fixture.result === "active_leak") {
      blockers.push(blocker(`fixture-active-leak-${index}`, "Active fixture leak observed", fixture.notes?.trim() || "An active leak was observed during the room-by-room assessment.", "plumber"));
    }
  });

  if ([assessment.exterior.mainValveCondition, assessment.exterior.mainShutoffAccessible].includes("needs_attention")) {
    blockers.push(blocker("main-valve-concern", "Main valve requires review", "The main valve or shutoff condition requires a licensed plumber's review.", "plumber"));
  }
  if (assessment.exterior.mainShutoffAccessible === "not_accessible") {
    blockers.push(blocker("main-not-accessible", "Main water entry is not accessible", "Safe access to the main water entry must be established before installation.", "plumber"));
  }
  if (assessment.exterior.fireSprinklerBranchConcern !== "no") {
  if (assessment.exterior.meterAccessible === "not_accessible") {
    blockers.push(blocker("meter-not-accessible", "Water meter is not accessible", "Safe access to the water meter is required for installation planning.", "plumber"));
  }
    blockers.push(blocker("sprinkler-branch-concern", "Fire-sprinkler arrangement requires review", "The branch arrangement must be verified before a shutoff device is selected.", "plumber"));
  }
  if (assessment.exterior.proposedInstallLocationSuitable !== "yes") {
    blockers.push(blocker("location-unsuitable", "Proposed location is not yet suitable", "HydroSense or a licensed plumber must approve a safe alternative location.", "hydrosense"));
  }

  if (assessment.connectivity.wifiVerified !== "yes") {
    blockers.push(blocker("wifi-not-verified", "Wi-Fi coverage is not verified", "Reliable Wi-Fi coverage is needed near the monitoring location. Credentials are handled only during authorized setup.", "internet_provider", "conditional"));
  }
  if (assessment.connectivity.powerVerified !== "yes") {
    blockers.push(blocker("power-not-verified", "Nearby power is not verified", "A standard outlet is needed within the supported distance of the monitoring location.", "electrician", "conditional"));
  }
  if (assessment.exterior.serviceClearanceAdequate !== "yes") {
    blockers.push(blocker("clearance-insufficient", "Service clearance requires preparation", "Create adequate working clearance at the proposed installation location.", "customer", "conditional"));
  }

  if (missingRequiredFields.length > 0) {
    return { status: "unassessed", blockers, missingRequiredFields: Array.from(new Set(missingRequiredFields)) };
  }

  const codes = new Set(blockers.map((item) => item.code));
  const hasLeak = Array.from(codes).some((code) => code.includes("leak") || code === "meter-movement");
  const hasPlumber = blockers.some((item) =>
    ["main-valve-concern", "main-not-accessible", "sprinkler-branch-concern", "location-unsuitable"].includes(item.code)
  );
  const hasPrep = blockers.some((item) => item.severity === "conditional");

  const status = hasLeak
    ? "leak_repair_required"
    : hasPlumber
      ? "plumber_review_required"
      : hasPrep
        ? "site_prep_required"
        : blockers.length > 0
          ? "plumber_review_required"
          : "ready_for_proposal";

  return { status, blockers, missingRequiredFields: [] };
}

export function buildCorrectiveActions(blockers: ReadinessBlocker[]) {
  return blockers.map((item) => ({
    id: item.code,
    action: actionForBlocker(item),
    reason: item.detail,
    owner: item.owner,
    severity: item.severity,
    completed: false,
  }));
}

function actionForBlocker(item: ReadinessBlocker): string {
  const actions: Record<string, string> = {
    "active-leak-reported": "Repair the active leak and request a HydroSense recheck.",
    "prior-leak-unresolved": "Confirm repair and remediation, then request a HydroSense recheck.",
    "meter-movement": "Have a licensed plumber diagnose and repair the unexplained water movement.",
    "exterior-active-leak": "Have a licensed plumber repair the exterior leak.",
    "main-valve-concern": "Have a licensed plumber inspect and correct the main valve condition.",
    "main-not-accessible": "Provide safe access to the main water entry and shutoff.",
    "sprinkler-branch-concern": "Have a licensed plumber verify the fire-sprinkler branch arrangement.",
    "location-unsuitable": "Coordinate an approved alternative monitoring location with HydroSense.",
    "wifi-not-verified": "Provide reliable Wi-Fi coverage near the proposed monitoring location.",
    "power-not-verified": "Provide a standard power outlet within the supported installation distance.",
    "clearance-insufficient": "Clear the required working space around the proposed installation location.",
  };
  if (item.code.startsWith("fixture-active-leak")) return "Have a licensed plumber repair the observed fixture leak.";
  return actions[item.code] || `Resolve: ${item.title}.`;
}

export function quoteEligibility(status: ReadinessResult["status"]): {
  allowed: boolean;
  conditional: boolean;
  reason?: string;
} {
  if (status === "ready_for_proposal") return { allowed: true, conditional: false };
  if (status === "site_prep_required") return { allowed: true, conditional: true };
  if (status === "leak_repair_required") {
    return { allowed: false, conditional: false, reason: "Leak repair and a HydroSense recheck are required before quoting." };
  }
  if (status === "plumber_review_required") {
    return { allowed: false, conditional: false, reason: "Licensed plumber review is required before quoting." };
  }
  return { allowed: false, conditional: false, reason: "Complete the site assessment before creating a quote." };
}
