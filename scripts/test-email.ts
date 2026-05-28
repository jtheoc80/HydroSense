/**
 * Dev-only test script: send a confirmation email via Resend
 * Run: npx tsx scripts/test-email.ts your-actual-email@gmail.com
 */

import { sendLeadConfirmation } from "../lib/email";

async function main() {
  const email = process.argv[2] ?? "test@example.com";
  console.log(`\nSending confirmation email to ${email} ...\n`);

  await sendLeadConfirmation({
    id: "test-000",
    first_name: "Test",
    last_name: "Jimmy",
    email,
    zip: "77449",
    carrier: "State Farm",
    source: "test-script",
  } as any);

  console.log("done");
}

main().catch(console.error);
