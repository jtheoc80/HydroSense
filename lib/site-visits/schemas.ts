import { z } from "zod";

const optionalText = z.string().trim().max(2000).optional().or(z.literal(""));
const contactEmail = z.string().trim().email().optional().or(z.literal(""));
const contactPhone = z.string().trim().min(10).max(32).optional().or(z.literal(""));
const yesNoUnsure = z.enum(["yes", "no", "unsure"]);
const inspectionResult = z.enum([
  "clear",
  "needs_attention",
  "active_leak",
  "not_present",
  "not_accessible",
  "not_tested",
]);

export const createSiteVisitSchema = z
  .object({
    leadId: z.string().uuid().nullable().optional(),
    customerFirstName: z.string().trim().min(1).max(100),
    customerLastName: z.string().trim().min(1).max(100),
    customerPhone: contactPhone,
    customerEmail: contactEmail,
    propertyAddress: z.string().trim().min(4).max(300),
    propertyCity: z.string().trim().max(100).optional().or(z.literal("")),
    propertyZip: z.string().trim().max(12).optional().or(z.literal("")),
    scheduledStart: z.string().datetime({ offset: true }),
    arrivalWindowMinutes: z.number().int().min(0).max(240).default(30),
    estimatedDurationMinutes: z.number().int().min(15).max(480).default(60),
    timezone: z.string().trim().default("America/Chicago"),
    assignedRepName: z.string().trim().min(1).max(150),
    assignedRepPhone: z.string().trim().max(32).optional().or(z.literal("")),
    internalNotes: optionalText,
    sendConfirmation: z.boolean().default(true),
  })
  .superRefine((value, context) => {
    if (!value.customerEmail && !value.customerPhone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one customer contact method is required",
        path: ["customerEmail"],
      });
    }
  });

export const rescheduleSiteVisitSchema = z.object({
  scheduledStart: z.string().datetime({ offset: true }),
  arrivalWindowMinutes: z.number().int().min(0).max(240).optional(),
  assignedRepName: z.string().trim().min(1).max(150).optional(),
  actorLabel: z.string().trim().max(150).optional(),
});

export const previsitAnswersSchema = z
  .object({
    bathroomCount: z.number().int().min(0).max(30),
    shutoffLocationKnown: yesNoUnsure,
    shutoffLocationNotes: optionalText,
    activeLeak: yesNoUnsure,
    previousLeak: yesNoUnsure,
    previousLeakRepaired: yesNoUnsure.optional(),
    previousLeakRemediationNotes: optionalText,
    wifiAtInstallLocation: yesNoUnsure,
    powerWithin12Feet: yesNoUnsure,
    fireSprinklerSystem: yesNoUnsure,
    accessInstructions: optionalText,
    gateCode: z.string().trim().max(100).optional().or(z.literal("")),
    pets: optionalText,
    parkingNotes: optionalText,
    additionalNotes: optionalText,
  })
  .superRefine((value, context) => {
    if (value.previousLeak === "yes" && !value.previousLeakRepaired) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["previousLeakRepaired"],
        message: "Tell us whether the previous leak was repaired",
      });
    }
  });

const fixtureCheckSchema = z.object({
  result: inspectionResult,
  notes: optionalText,
});

export const siteAssessmentSchema = z.object({
  permissionToInspect: z.boolean().nullable(),
  homeownerPresent: z.boolean().nullable(),
  exterior: z.object({
    meterAccessible: inspectionResult,
    mainShutoffAccessible: inspectionResult,
    mainValveCondition: inspectionResult,
    waterEntryRoute: optionalText,
    pipeMaterial: z.string().trim().max(100).optional().or(z.literal("")),
    approximatePipeDiameter: z.string().trim().max(50).optional().or(z.literal("")),
    staticPressurePsi: z.number().min(0).max(300).optional(),
    unexplainedMeterMovement: yesNoUnsure,
    visibleExteriorLeak: inspectionResult,
    fireSprinklerBranchConcern: yesNoUnsure,
    irrigationOrPoolBranchPresent: yesNoUnsure,
    proposedInstallLocationSuitable: yesNoUnsure,
    proposedDeviceLocation: optionalText,
    serviceClearanceAdequate: yesNoUnsure,
    weatherExposureNotes: optionalText,
    notes: optionalText,
  }),
  kitchen: z.object({
    sinkSupplyAndDrain: fixtureCheckSchema,
    dishwasher: fixtureCheckSchema,
    refrigeratorIceMaker: fixtureCheckSchema,
    visibleMoisture: fixtureCheckSchema,
  }),
  bathrooms: z.array(
    z.object({
      id: z.string().min(1).max(100),
      label: z.string().trim().min(1).max(100),
      toilet: fixtureCheckSchema,
      sinkSupplyAndDrain: fixtureCheckSchema,
      tubOrShower: fixtureCheckSchema,
      visibleMoisture: fixtureCheckSchema,
    })
  ).max(30),
  laundryUtility: z.object({
    washingMachine: fixtureCheckSchema,
    waterHeater: fixtureCheckSchema,
    utilitySink: fixtureCheckSchema,
    waterSoftenerOrFilter: fixtureCheckSchema,
    visibleMoisture: fixtureCheckSchema,
  }),
  otherWaterAreas: z.array(
    z.object({
      id: z.string().min(1).max(100),
      label: z.string().trim().min(1).max(100),
      result: inspectionResult,
      notes: optionalText,
    })
  ).max(40),
  connectivity: z.object({
    wifiVerified: yesNoUnsure,
    powerVerified: yesNoUnsure,
    outletDistanceFeet: z.number().min(0).max(1000).optional(),
    notes: optionalText,
  }),
  finalNotes: optionalText,
  customerAcknowledgment: z.object({
    acknowledged: z.boolean(),
    typedName: z.string().trim().max(150).optional().or(z.literal("")),
  }).optional(),
});

export const customerRescheduleSchema = z.object({
  option1: z.string().datetime({ offset: true }),
  option2: z.string().datetime({ offset: true }),
  option3: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  note: optionalText,
});

export const customerCancellationSchema = z.object({
  reason: z.string().trim().min(3).max(1000),
});

export const enRouteSchema = z.object({
  etaMinutes: z.number().int().min(0).max(240).optional(),
});
