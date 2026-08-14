import AdminLeadsClient from "@/app/admin/leads/AdminLeadsClient";
import type { Lead } from "@/app/admin/leads/types";

const lead: Lead = {
  id: "11111111-1111-4111-8111-111111111111",
  created_at: "2026-08-14T12:00:00.000Z",
  first_name: "Test",
  last_name: "Homeowner",
  email: "lead-outcome@example.test",
  phone: "281-555-0100",
  zip: "77494",
  address: "100 Test Water Way",
  carrier: "Test carrier",
  message: null,
  city: "Katy",
  campaign: null,
  source: "hydrosensetx.com",
  page_path: "/",
  utm_source: null,
  lead_score: 3,
  lead_tier: "hot",
  status: "new",
  booked_at: null,
  meeting_url: null,
  notes: null,
  power_within_12ft: "yes",
  fire_sprinkler_system: "no",
  wifi_at_install_location: "yes",
  qualifying_flags: {
    install_ready: true,
    needs_electrician: false,
    fire_sprinkler_concern: false,
    wifi_extender_needed: false,
  },
};

export const dynamic = "force-dynamic";

export default function LeadOutcomeFixturePage() {
  return <AdminLeadsClient leads={[lead]} />;
}
