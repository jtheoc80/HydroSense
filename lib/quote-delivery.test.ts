import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  getQuoteCopyEmail,
  summarizeQuoteDelivery,
  type QuoteDeliveryResult,
} from "./quote-delivery";

const originalQuoteCopyEmail = process.env.QUOTE_COPY_EMAIL;
const originalLeadNotificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;

afterEach(() => {
  if (originalQuoteCopyEmail === undefined) delete process.env.QUOTE_COPY_EMAIL;
  else process.env.QUOTE_COPY_EMAIL = originalQuoteCopyEmail;

  if (originalLeadNotificationEmail === undefined) delete process.env.LEAD_NOTIFICATION_EMAIL;
  else process.env.LEAD_NOTIFICATION_EMAIL = originalLeadNotificationEmail;
});

test("quote copy defaults to the lead-notification inbox", () => {
  delete process.env.QUOTE_COPY_EMAIL;
  process.env.LEAD_NOTIFICATION_EMAIL = "owner@example.com";

  assert.equal(getQuoteCopyEmail("customer@example.com"), "owner@example.com");
});

test("QUOTE_COPY_EMAIL overrides the lead-notification inbox", () => {
  process.env.QUOTE_COPY_EMAIL = "quotes-owner@example.com";
  process.env.LEAD_NOTIFICATION_EMAIL = "leads@example.com";

  assert.equal(getQuoteCopyEmail("customer@example.com"), "quotes-owner@example.com");
});

test("owner copy is omitted when owner and customer addresses match", () => {
  process.env.QUOTE_COPY_EMAIL = "Owner@Example.com";

  assert.equal(getQuoteCopyEmail("owner@example.com"), null);
});

test("delivery summary only reports an owner copy for an accepted BCC email", () => {
  const results: QuoteDeliveryResult[] = [
    {
      channel: "email",
      provider: "resend",
      recipient: "customer@example.com",
      copyRecipient: "owner@example.com",
      status: "sent",
      providerMessageId: "email_123",
      providerStatus: "accepted",
      error: null,
    },
    {
      channel: "sms",
      provider: "twilio",
      recipient: "+12815550100",
      copyRecipient: null,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "not_configured",
      error: "Twilio is not configured",
    },
  ];

  assert.deepEqual(summarizeQuoteDelivery(results), {
    delivered: true,
    acceptedChannels: ["email"],
    ownerCopyIncluded: true,
  });
});

test("failed and skipped providers do not mark a quote delivered", () => {
  const results: QuoteDeliveryResult[] = [
    {
      channel: "email",
      provider: "resend",
      recipient: "customer@example.com",
      copyRecipient: "owner@example.com",
      status: "failed",
      providerMessageId: null,
      providerStatus: "rejected",
      error: "Rejected",
    },
    {
      channel: "sms",
      provider: "twilio",
      recipient: "",
      copyRecipient: null,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "invalid_recipient",
      error: "No valid phone number",
    },
  ];

  assert.deepEqual(summarizeQuoteDelivery(results), {
    delivered: false,
    acceptedChannels: [],
    ownerCopyIncluded: false,
  });
});
