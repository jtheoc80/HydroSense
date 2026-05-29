// Jotform API — submit a pre-filled service agreement form when a quote is accepted.

interface JotformQuoteData {
  quote_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  carrier: string;
  total: number;
  line_items: { label: string; qty: number; unit_price: number; total: number }[];
}

interface JotformResult {
  ok: boolean;
  submissionId?: string;
  error?: string;
}

export async function submitJotformAgreement(
  data: JotformQuoteData
): Promise<JotformResult> {
  const apiKey = process.env.JOTFORM_API_KEY;
  const formId = process.env.JOTFORM_AGREEMENT_FORM_ID;

  if (!apiKey || !formId) {
    console.warn("Jotform env vars missing — skipping submission");
    return { ok: false, error: "JOTFORM_API_KEY or JOTFORM_AGREEMENT_FORM_ID not set" };
  }

  // Jotform composite fields use sub-keys:
  //   Full Name (QID 3)  → submission[3][first], submission[3][last]
  //   Address  (QID 4)   → submission[4][addr_line1], submission[4][city], submission[4][postal]
  //   Simple fields       → submission[QID]
  const params = new URLSearchParams();

  // QID 3 — Customer Full Name
  params.append("submission[3][first]", data.first_name);
  params.append("submission[3][last]", data.last_name);

  // QID 4 — Property/Service Address
  params.append("submission[4][addr_line1]", data.address);
  params.append("submission[4][city]", data.city);
  params.append("submission[4][postal]", data.zip);
  params.append("submission[4][state]", "TX");
  params.append("submission[4][country]", "United States");

  // QID 5 — Phone
  params.append("submission[5]", data.phone);

  // QID 6 — Email
  params.append("submission[6]", data.email);

  // QID 12 — Insurance Company Name
  params.append("submission[12]", data.carrier);

  // QID 19 — Total Job Price
  params.append("submission[19]", String(data.total));

  // QID 17 — Special Instructions (line item summary)
  const lineItemSummary = data.line_items
    .map((li) => `${li.label} (x${li.qty}) — $${li.total.toFixed(2)}`)
    .join("\n");
  params.append(
    "submission[17]",
    `Quote ${data.quote_number}\n${lineItemSummary}`
  );

  const url = `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Jotform submission failed:", res.status, text);
    return { ok: false, error: `Jotform API ${res.status}: ${text}` };
  }

  const json = await res.json();
  return { ok: true, submissionId: json?.content?.submissionID };
}
