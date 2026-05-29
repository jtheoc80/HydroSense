// Jotform field IDs for the service agreement form (form 261456543242152).
// Discovered via `npm run jotform:discover`.

export const JOTFORM_FIELD_MAP = {
  // customerFullName is a "full name" widget — Jotform expects sub-keys
  first_name: "3",    // Customer Full Name → first
  last_name: "3",     // Customer Full Name → last (same QID, different sub-key)
  email: "6",         // Customer Email
  phone: "5",         // Customer Phone Number
  address: "4",       // Property/Service Address
  city: "4",          // Property/Service Address → city sub-key
  zip: "4",           // Property/Service Address → postal sub-key
  carrier: "12",      // Insurance Company Name
  total: "19",        // Total Job Price ($)
  line_items: "17",   // Special Instructions or Notes (line item summary)
};
