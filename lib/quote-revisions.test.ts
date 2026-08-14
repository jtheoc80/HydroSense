import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQuoteRevisionInsert,
  isRevisionDraftFor,
  type QuoteRevisionSource,
} from "./quote-revisions";

const source: QuoteRevisionSource = {
  quote_number: "Q-2026-0004",
  lead_id: "lead-id",
  site_visit_id: "visit-id",
  customer_first_name: "Pat",
  customer_last_name: "Customer",
  customer_email: "pat@example.com",
  customer_phone: "+12815550100",
  property_address: "100 Main St",
  property_city: "Katy",
  property_zip: "77494",
  carrier: "USAA",
  carrier_premium_estimate: 4500,
  carrier_discount_pct: 10,
  carrier_water_portion_pct: 0.1,
  carrier_annual_estimate: 45,
  line_items: [{ sku: "HS-INSTALL", quantity: 1, unit_price: 925 }],
  subtotal: 925,
  total: 925,
  deposit_amount: 25000,
  balance_amount: 67500,
  has_commitment: false,
  commitment_months: 0,
  notes_internal: "Bring gate code.",
  notes_customer: "Installation scope.",
  status: "viewed",
};

test("creates an editable draft while preserving quote content", () => {
  const revision = buildQuoteRevisionInsert(
    source,
    "Q-2026-0005",
    "new-public-token",
    new Date("2026-08-14T19:30:00.000Z")
  );

  assert.equal(revision.quote_number, "Q-2026-0005");
  assert.equal(revision.public_token, "new-public-token");
  assert.equal(revision.status, "draft");
  assert.equal(revision.expires_at, null);
  assert.equal(revision.total, source.total);
  assert.deepEqual(revision.line_items, source.line_items);
  assert.match(revision.notes_internal, /Revision of Q-2026-0004/);
  assert.match(revision.notes_internal, /Bring gate code/);
  assert.equal("sent_at" in revision, false);
  assert.equal("viewed_at" in revision, false);
  assert.equal("stripe_checkout_session_id" in revision, false);
});

test("recognizes current and legacy revision markers", () => {
  assert.equal(isRevisionDraftFor("Revision of Q-2026-0004 created now.", "Q-2026-0004"), true);
  assert.equal(
    isRevisionDraftFor("Revision draft created from Q-2026-0004 on Aug 14.", "Q-2026-0004"),
    true
  );
  assert.equal(isRevisionDraftFor("Revision of Q-2026-0003", "Q-2026-0004"), false);
});

test("does not create a revision from an editable draft", () => {
  assert.throws(
    () => buildQuoteRevisionInsert({ ...source, status: "draft" }, "Q-2026-0005", "token"),
    /Draft quotes can be edited directly/
  );
});
