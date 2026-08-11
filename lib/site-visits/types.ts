export type YesNoUnsure = "yes" | "no" | "unsure";

export type InspectionResult =
  | "clear"
  | "needs_attention"
  | "active_leak"
  | "not_present"
  | "not_accessible"
  | "not_tested";

export type AppointmentStatus =
  | "draft"
  | "awaiting_confirmation"
  | "confirmed"
  | "reschedule_requested"
  | "canceled"
  | "en_route"
  | "in_progress"
  | "completed"
  | "no_show"
  | "recheck_requested"
  | "recheck_scheduled"
  | "recheck_closed";

export type PrevisitStatus = "not_sent" | "pending" | "complete";

export type ReadinessStatus =
  | "unassessed"
  | "ready_for_proposal"
  | "site_prep_required"
  | "leak_repair_required"
  | "plumber_review_required";

export type ActionOwner =
  | "customer"
  | "hydrosense"
  | "plumber"
  | "electrician"
  | "internet_provider";

export interface PrevisitAnswers {
  bathroomCount: number;
  shutoffLocationKnown: YesNoUnsure;
  shutoffLocationNotes?: string;
  activeLeak: YesNoUnsure;
  previousLeak: YesNoUnsure;
  previousLeakRepaired?: YesNoUnsure;
  previousLeakRemediationNotes?: string;
  wifiAtInstallLocation: YesNoUnsure;
  powerWithin12Feet: YesNoUnsure;
  fireSprinklerSystem: YesNoUnsure;
  accessInstructions?: string;
  gateCode?: string;
  pets?: string;
  parkingNotes?: string;
  additionalNotes?: string;
}

export interface FixtureCheck {
  result: InspectionResult;
  notes?: string;
}

export interface BathroomAssessment {
  id: string;
  label: string;
  toilet: FixtureCheck;
  sinkSupplyAndDrain: FixtureCheck;
  tubOrShower: FixtureCheck;
  visibleMoisture: FixtureCheck;
}

export interface SiteAssessment {
  permissionToInspect: boolean | null;
  homeownerPresent: boolean | null;
  homeHasNoBathrooms: boolean;
  noBathroomsReason?: string;
  exterior: {
    meterAccessible: InspectionResult;
    mainShutoffAccessible: InspectionResult;
    mainValveCondition: InspectionResult;
    waterEntryRoute?: string;
    pipeMaterial?: string;
    approximatePipeDiameter?: string;
    staticPressurePsi?: number;
    unexplainedMeterMovement: YesNoUnsure;
    visibleExteriorLeak: InspectionResult;
    fireSprinklerBranchConcern: YesNoUnsure;
    sprinklerBypassRequired: YesNoUnsure;
    irrigationOrPoolBranchPresent: YesNoUnsure;
    proposedInstallLocationSuitable: YesNoUnsure;
    proposedDeviceLocation?: string;
    serviceClearanceAdequate: YesNoUnsure;
    weatherExposureNotes?: string;
    notes?: string;
  };
  kitchen: {
    sinkSupplyAndDrain: FixtureCheck;
    dishwasher: FixtureCheck;
    refrigeratorIceMaker: FixtureCheck;
    visibleMoisture: FixtureCheck;
  };
  bathrooms: BathroomAssessment[];
  laundryUtility: {
    washingMachine: FixtureCheck;
    waterHeater: FixtureCheck;
    utilitySink: FixtureCheck;
    waterSoftenerOrFilter: FixtureCheck;
    visibleMoisture: FixtureCheck;
  };
  otherWaterAreas: Array<{
    id: string;
    label: string;
    result: InspectionResult;
    notes?: string;
  }>;
  connectivity: {
    wifiVerified: YesNoUnsure;
    powerVerified: YesNoUnsure;
    outletDistanceFeet?: number;
    notes?: string;
  };
  finalNotes?: string;
  customerAcknowledgment?: {
    acknowledged: boolean;
    typedName?: string;
  };
}

export interface ReadinessBlocker {
  code: string;
  title: string;
  detail: string;
  owner: ActionOwner;
  severity: "blocking" | "conditional";
}

export interface CorrectiveAction {
  id: string;
  action: string;
  reason: string;
  owner: ActionOwner;
  severity: "blocking" | "conditional";
  status: "open" | "customer_reported_complete" | "verified_complete" | "not_applicable";
  targetDate?: string;
  customerCompletedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNote?: string;
}

export interface ReadinessResult {
  status: ReadinessStatus;
  blockers: ReadinessBlocker[];
  missingRequiredFields: string[];
}

export interface SiteVisit {
  id: string;
  lead_id: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  property_address: string;
  property_city: string | null;
  property_zip: string | null;
  scheduled_start: string;
  arrival_window_minutes: number;
  estimated_duration_minutes: number;
  timezone: string;
  schedule_version: number;
  assessment_version: number;
  assessment_revision: number;
  parent_site_visit_id: string | null;
  supersedes_site_visit_id: string | null;
  assigned_rep_name: string;
  assigned_rep_phone: string | null;
  source: string | null;
  internal_notes: string | null;
  customer_portal_token: string;
  appointment_status: AppointmentStatus;
  previsit_status: PrevisitStatus;
  readiness_status: ReadinessStatus;
  previsit_answers: Partial<PrevisitAnswers>;
  assessment: Partial<SiteAssessment>;
  blockers: ReadinessBlocker[];
  corrective_actions: CorrectiveAction[];
  reschedule_request: RescheduleRequest | null;
  customer_summary: CustomerSummary | null;
  confirmed_at: string | null;
  confirmation_sent_at: string | null;
  previsit_completed_at: string | null;
  reschedule_requested_at: string | null;
  canceled_at: string | null;
  en_route_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  summary_sent_at: string | null;
  customer_acknowledged_at: string | null;
  recheck_requested_at: string | null;
  recheck_closed_at: string | null;
  follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RescheduleRequest {
  option1: string;
  option2: string;
  option3?: string;
  note?: string;
  requestedAt: string;
}

export interface CustomerSummary {
  outcomeTitle: string;
  outcomeDetail: string;
  areasReviewed: string[];
  blockers: Array<{
    title: string;
    detail: string;
    owner: ActionOwner;
  }>;
  correctiveActions: CorrectiveAction[];
  hydrosenseNextStep: string;
  customerNextStep: string;
  followUpAt?: string;
}

export interface SiteVisitEvent {
  id: string;
  site_visit_id: string;
  event_type: string;
  actor_type: "system" | "admin" | "representative" | "customer";
  actor_label: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SiteVisitMessage {
  id: string;
  site_visit_id: string;
  message_key: string;
  channel: "sms" | "email";
  template: string;
  recipient: string;
  status: "pending" | "sending" | "sent" | "failed" | "skipped";
  attempt_count: number;
  provider_message_id: string | null;
  provider_status: "accepted" | null;
  last_error: string | null;
  claimed_at: string | null;
  claim_token: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}
