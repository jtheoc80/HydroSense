import { notFound } from "next/navigation";
import AssessmentClient from "@/app/admin/site-visits/[id]/assessment/AssessmentClient";
import SiteVisitDetail from "@/app/admin/site-visits/[id]/SiteVisitDetail";
import SiteVisitsDashboard from "@/app/admin/site-visits/SiteVisitsDashboard";
import CustomerPortal from "@/app/site-visit/[token]/CustomerPortal";
import { cleanAssessment, cleanPrevisit } from "@/lib/site-visits/test-fixtures";
import type { CorrectiveAction, CustomerSummary, ReadinessBlocker, SiteVisit } from "@/lib/site-visits/types";

export const dynamic = "force-dynamic";

const TOKEN = "a".repeat(64);
const FUTURE = "2026-10-15T15:00:00.000Z";
const CREATED = "2026-08-11T12:00:00.000Z";

function visitFixture(overrides: Partial<SiteVisit> = {}): SiteVisit {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    lead_id: null,
    customer_first_name: "Playwright",
    customer_last_name: "Homeowner",
    customer_phone: "+12815550100",
    customer_email: "playwright@example.test",
    property_address: "100 Test Water Way",
    property_city: "Houston",
    property_zip: "77002",
    scheduled_start: FUTURE,
    arrival_window_minutes: 30,
    estimated_duration_minutes: 60,
    timezone: "America/Chicago",
    schedule_version: 1,
    assessment_version: 1,
    assessment_revision: 0,
    parent_site_visit_id: null,
    supersedes_site_visit_id: null,
    assigned_rep_name: "Test Representative",
    assigned_rep_phone: "+12815550199",
    source: "playwright",
    internal_notes: "Synthetic browser-test record",
    customer_portal_token: TOKEN,
    appointment_status: "awaiting_confirmation",
    previsit_status: "pending",
    readiness_status: "unassessed",
    previsit_answers: {},
    assessment: {},
    blockers: [],
    corrective_actions: [],
    reschedule_request: null,
    customer_summary: null,
    confirmed_at: null,
    confirmation_sent_at: CREATED,
    previsit_completed_at: null,
    reschedule_requested_at: null,
    canceled_at: null,
    en_route_at: null,
    started_at: null,
    completed_at: null,
    summary_sent_at: null,
    customer_acknowledged_at: null,
    recheck_requested_at: null,
    recheck_closed_at: null,
    follow_up_at: null,
    created_at: CREATED,
    updated_at: CREATED,
    ...overrides,
  };
}

const leakBlocker: ReadinessBlocker = {
  code: "active-leak",
  title: "Active leak requires repair",
  detail: "Repair the observed supply leak before installation.",
  owner: "plumber",
  severity: "blocking",
};

const correctiveAction: CorrectiveAction = {
  id: "action-active-leak",
  action: "Repair the observed supply leak",
  reason: leakBlocker.detail,
  owner: "plumber",
  severity: "blocking",
  status: "open",
};

function summaryFixture(ready: boolean): CustomerSummary {
  return {
    outcomeTitle: ready ? "Your home is ready for a HydroSense proposal" : "Repair is required before installation",
    outcomeDetail: ready
      ? "The recheck verified the required conditions for proposal handoff."
      : "The assessment found a visible condition that must be corrected and verified.",
    areasReviewed: ["Exterior water entry", "Kitchen", "Bathroom", "Laundry / utility"],
    blockers: ready ? [] : [{ title: leakBlocker.title, detail: leakBlocker.detail, owner: leakBlocker.owner }],
    correctiveActions: ready ? [] : [correctiveAction],
    hydrosenseNextStep: ready ? "Prepare the proposal." : "Review the completion report and arrange a recheck.",
    customerNextStep: ready ? "Review the proposal when it arrives." : "Complete the listed repair, then request a recheck.",
  };
}

function portalVisit(visit: SiteVisit, priorResults: Array<{ assessmentVersion: number; readinessStatus: string; completedAt: string | null; blockers: ReadinessBlocker[] }> = []) {
  return {
    id: visit.id,
    customerFirstName: visit.customer_first_name,
    propertyAddress: visit.property_address,
    propertyCity: visit.property_city,
    propertyZip: visit.property_zip,
    scheduledStart: visit.scheduled_start,
    arrivalWindowMinutes: visit.arrival_window_minutes,
    estimatedDurationMinutes: visit.estimated_duration_minutes,
    timezone: visit.timezone,
    assignedRepName: visit.assigned_rep_name,
    assignedRepPhone: visit.assigned_rep_phone,
    appointmentStatus: visit.appointment_status,
    previsitStatus: visit.previsit_status,
    readinessStatus: visit.readiness_status,
    confirmedAt: visit.confirmed_at,
    previsitAnswers: visit.previsit_answers,
    customerSummary: visit.customer_summary,
    completedAt: visit.completed_at,
    canceledAt: visit.canceled_at,
    recheckRequestedAt: visit.recheck_requested_at,
    correctiveActions: visit.corrective_actions,
    assessmentVersion: visit.assessment_version,
    priorResults,
    quoteUrl: visit.readiness_status === "ready_for_proposal" ? "/quote/playwright" : null,
  };
}

function detail(visit: SiteVisit) {
  return <SiteVisitDetail
    visit={visit}
    events={[]}
    messages={[]}
    quote={null}
    portalUrl={`/site-visit/${TOKEN}`}
    initialDeliveryFailure={false}
  />;
}

export default async function SiteVisitE2EPage({ params }: { params: Promise<{ scenario: string }> }) {
  if (process.env.PLAYWRIGHT_TEST_MODE !== "1") notFound();
  const { scenario } = await params;
  const confirmed = visitFixture({
    appointment_status: "confirmed",
    confirmed_at: CREATED,
    previsit_status: "complete",
    previsit_answers: cleanPrevisit(),
    previsit_completed_at: CREATED,
  });

  if (scenario === "portal-pending") return <CustomerPortal token={TOKEN} initialVisit={portalVisit(visitFixture())} />;
  if (scenario === "portal-confirmed") return <CustomerPortal token={TOKEN} initialVisit={portalVisit(confirmed)} />;

  if (scenario === "portal-blocked") {
    const blocked = visitFixture({
      ...confirmed,
      appointment_status: "completed",
      readiness_status: "leak_repair_required",
      assessment: cleanAssessment(),
      blockers: [leakBlocker],
      corrective_actions: [correctiveAction],
      customer_summary: summaryFixture(false),
      completed_at: CREATED,
    });
    return <CustomerPortal token={TOKEN} initialVisit={portalVisit(blocked)} />;
  }

  if (scenario === "portal-recheck-ready") {
    const ready = visitFixture({
      ...confirmed,
      id: "22222222-2222-4222-8222-222222222222",
      appointment_status: "completed",
      readiness_status: "ready_for_proposal",
      assessment: cleanAssessment(),
      assessment_version: 2,
      parent_site_visit_id: "11111111-1111-4111-8111-111111111111",
      supersedes_site_visit_id: "11111111-1111-4111-8111-111111111111",
      customer_summary: summaryFixture(true),
      completed_at: CREATED,
    });
    return <CustomerPortal token={TOKEN} initialVisit={portalVisit(ready, [{
      assessmentVersion: 1,
      readinessStatus: "leak_repair_required",
      completedAt: "2026-08-01T12:00:00.000Z",
      blockers: [leakBlocker],
    }])} />;
  }

  if (scenario === "admin-reschedule") return detail(visitFixture({
    ...confirmed,
    appointment_status: "reschedule_requested",
    reschedule_requested_at: CREATED,
    reschedule_request: {
      option1: "2026-10-20T15:00:00.000Z",
      option2: "2026-10-21T17:00:00.000Z",
      note: "Morning is easier for access.",
      requestedAt: CREATED,
    },
  }));

  if (scenario === "admin-completed") return detail(visitFixture({
    ...confirmed,
    appointment_status: "completed",
    readiness_status: "ready_for_proposal",
    assessment: cleanAssessment(),
    customer_summary: summaryFixture(true),
    completed_at: CREATED,
  }));

  if (scenario === "admin-blocked") return detail(visitFixture({
    ...confirmed,
    appointment_status: "recheck_requested",
    readiness_status: "leak_repair_required",
    blockers: [leakBlocker],
    corrective_actions: [{ ...correctiveAction, status: "customer_reported_complete", customerCompletedAt: CREATED }],
    customer_summary: summaryFixture(false),
    completed_at: CREATED,
    recheck_requested_at: CREATED,
  }));

  if (scenario === "assessment-clean") return <AssessmentClient visit={confirmed} initialAssessment={cleanAssessment()} />;
  if (scenario === "admin-overdue") return detail(visitFixture({
    ...confirmed,
    scheduled_start: "2026-01-15T15:00:00.000Z",
  }));

  if (scenario === "dashboard") {
    const dashboardVisits = [
      { ...confirmed, risk: { level: "low" as const, reasons: [], nextAction: "No action required" }, hasCommunicationFailure: false, hasQuote: false },
      { ...visitFixture({ id: "33333333-3333-4333-8333-333333333333", appointment_status: "reschedule_requested" }), risk: { level: "high" as const, reasons: ["Customer requested another time"], nextAction: "Resolve reschedule" }, hasCommunicationFailure: false, hasQuote: false },
      { ...visitFixture({ id: "44444444-4444-4444-8444-444444444444", scheduled_start: "2026-01-15T15:00:00.000Z", appointment_status: "confirmed", confirmed_at: CREATED }), risk: { level: "high" as const, reasons: ["Visit is overdue"], nextAction: "Mark no-show or start visit" }, hasCommunicationFailure: true, hasQuote: false },
    ];
    return <SiteVisitsDashboard visits={dashboardVisits} />;
  }

  notFound();
}
