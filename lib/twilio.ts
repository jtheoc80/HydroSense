export interface SmsMessage {
  to: string;
  body: string;
}

export async function sendSms(message: SmsMessage): Promise<string> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || (!messagingServiceSid && !from)) throw new Error("Twilio is not configured");
  const digits = message.to.replace(/\D/g, "");
  if (digits.length < 10) throw new Error("SMS recipient is invalid");
  const to = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
  const params = new URLSearchParams({ To: to, Body: message.body });
  if (messagingServiceSid) params.set("MessagingServiceSid", messagingServiceSid);
  else params.set("From", from!);
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!response.ok) throw new Error(`Twilio SMS failed (${response.status})`);
  const payload = (await response.json()) as { sid?: string };
  if (!payload.sid) throw new Error("Twilio did not return a message ID");
  return payload.sid;
}

export async function sendInstantSms(lead: {
  first_name: string;
  phone?: string;
  zip: string;
}): Promise<void> {
  const configured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    && (process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_FROM_NUMBER);
  if (!configured) {
    console.warn("Twilio credentials not configured, skipping SMS");
    return;
  }
  if (!lead.phone || lead.phone.trim().length < 10) {
    console.warn("No valid phone number, skipping SMS");
    return;
  }
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const bookLine = bookingUrl
    ? ` Pick a 15-min slot here: ${bookingUrl}. I'll call you exactly then.`
    : " We'll call you within one business day.";
  await sendSms({
    to: lead.phone,
    body: `Hi ${lead.first_name}, this is HydroSense Texas. Got your quote request for ${lead.zip}.${bookLine} Reply STOP to opt out.`,
  });
}
