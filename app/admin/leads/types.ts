export interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  zip: string;
  address: string | null;
  carrier: string | null;
  message: string | null;
  city: string | null;
  campaign: string | null;
  source: string;
  page_path: string | null;
  utm_source: string | null;
  lead_score: number | null;
  lead_tier: string | null;
  status: string;
  booked_at: string | null;
  meeting_url: string | null;
  notes: string | null;
}
