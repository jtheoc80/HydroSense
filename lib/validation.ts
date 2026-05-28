import { z } from "zod";

export const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(20).optional().default(""),
  zip: z
    .string()
    .min(5, "ZIP code is required")
    .max(10)
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  address: z.string().max(500).optional().default(""),
  carrier: z.string().max(100).optional().default(""),
  message: z.string().max(2000).optional().default(""),
  source: z.string().default("hydrosensetx.com"),
  page_path: z.string().optional().default(""),
  utm_source: z.string().optional().default(""),
  utm_medium: z.string().optional().default(""),
  utm_campaign: z.string().optional().default(""),
  utm_content: z.string().optional().default(""),
  utm_term: z.string().optional().default(""),
  referrer: z.string().optional().default(""),
  user_agent: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
