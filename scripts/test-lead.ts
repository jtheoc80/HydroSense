/**
 * Dev-only test script: POST a fake lead to localhost /api/lead
 * Run: npx tsx scripts/test-lead.ts
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";

const fakeLead = {
  first_name: "Test",
  last_name: "Lead",
  email: "test@example.com",
  phone: "2815550100",
  zip: "77449",
  address: "123 Test St, Katy, TX",
  carrier: "State Farm",
  message: "This is a test lead from scripts/test-lead.ts",
  city: "Katy",
  source: "test-script",
  page_path: "/",
  utm_source: "test",
  utm_medium: "script",
  utm_campaign: "dev-test",
  utm_content: "",
  utm_term: "",
  referrer: "",
  user_agent: "test-lead-script/1.0",
};

async function main() {
  console.log(`\nPOSTing test lead to ${BASE}/api/lead ...\n`);

  const res = await fetch(`${BASE}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fakeLead),
  });

  const json = await res.json();

  console.log(`Status: ${res.status}`);
  console.log(`Response:`, JSON.stringify(json, null, 2));

  if (res.ok) {
    console.log(`\n✓ Lead created: id=${json.id}, score=${json.lead_score}`);
    console.log(`\nIntegrations that fired (check server logs for warnings about skipped ones):`);
    console.log(`  - Supabase insert: ✓ (lead exists)`);
    console.log(`  - SMS (Twilio): check server logs`);
    console.log(`  - Confirmation email (Resend): check server logs`);
    console.log(`  - Notification email (Resend): check server logs`);
    console.log(`  - Push notification (Pushover): check server logs`);
    console.log(`  - Webhook: check server logs`);
  } else {
    console.error(`\n✗ Failed:`, json);
  }
}

main().catch(console.error);
