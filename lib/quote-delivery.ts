export type QuoteDeliveryChannel = "email" | "sms";
export type QuoteDeliveryProvider = "resend" | "twilio";
export type QuoteDeliveryStatus = "pending" | "sent" | "failed" | "skipped";

export interface QuoteDeliveryResult {
  channel: QuoteDeliveryChannel;
  provider: QuoteDeliveryProvider;
  recipient: string;
  copyRecipient: string | null;
  status: Exclude<QuoteDeliveryStatus, "pending">;
  providerMessageId: string | null;
  providerStatus: string | null;
  error: string | null;
}

export interface QuoteDeliveryEvent {
  id: string;
  quote_id: string;
  attempt_id: string;
  channel: QuoteDeliveryChannel;
  provider: QuoteDeliveryProvider;
  recipient: string;
  copy_recipient: string | null;
  status: QuoteDeliveryStatus;
  provider_message_id: string | null;
  provider_status: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

function configuredCopyEmail(): string | null {
  const configured =
    process.env.QUOTE_COPY_EMAIL?.trim() ||
    process.env.LEAD_NOTIFICATION_EMAIL?.trim() ||
    "";

  return configured.includes("@") ? configured : null;
}

/**
 * Returns the private BCC recipient for a customer quote.
 * QUOTE_COPY_EMAIL is an optional override; the existing lead-notification
 * inbox is the default owner copy destination.
 */
export function getQuoteCopyEmail(customerEmail?: string | null): string | null {
  const copyEmail = configuredCopyEmail();
  if (!copyEmail) return null;

  if (
    customerEmail &&
    copyEmail.toLocaleLowerCase() === customerEmail.trim().toLocaleLowerCase()
  ) {
    return null;
  }

  return copyEmail;
}

export function safeQuoteDeliveryError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || "Delivery failed");
  return message.slice(0, 500);
}

export function summarizeQuoteDelivery(results: QuoteDeliveryResult[]) {
  const acceptedChannels = results
    .filter((result) => result.status === "sent")
    .map((result) => result.channel);

  return {
    delivered: acceptedChannels.length > 0,
    acceptedChannels,
    ownerCopyIncluded: results.some(
      (result) =>
        result.channel === "email" &&
        result.status === "sent" &&
        Boolean(result.copyRecipient)
    ),
  };
}
