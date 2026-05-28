export async function sendInstantSms(lead: {
  first_name: string;
  phone?: string;
  zip: string;
}): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  if (!sid || !token || (!messagingServiceSid && !from)) {
    console.warn("Twilio credentials not configured, skipping SMS");
    return;
  }

  if (!lead.phone || lead.phone.trim().length < 10) {
    console.warn("No valid phone number, skipping SMS");
    return;
  }

  const phone = lead.phone.replace(/\D/g, "");
  const to = phone.startsWith("1") ? `+${phone}` : `+1${phone}`;

  const bookLine = bookingUrl
    ? ` Pick a 15-min slot here: ${bookingUrl}. I'll call you exactly then.`
    : " We'll call you within one business day.";

  const body =
    `Hi ${lead.first_name}, this is HydroSense Texas. Got your quote request for ${lead.zip}.${bookLine} Reply STOP to opt out.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

  const params = new URLSearchParams();
  params.set("To", to);
  if (messagingServiceSid) {
    params.set("MessagingServiceSid", messagingServiceSid);
  } else {
    params.set("From", from!);
  }
  params.set("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio SMS failed (${res.status}): ${text}`);
  }
}
