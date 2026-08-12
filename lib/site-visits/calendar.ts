import { customerPortalUrl } from "./format";
import type { SiteVisit } from "./types";

function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildSiteVisitCalendar(
  visit: Pick<SiteVisit,
    "id" | "scheduled_start" | "estimated_duration_minutes" | "schedule_version" | "updated_at" |
    "property_address" | "property_city" | "property_zip" | "assigned_rep_name" | "customer_portal_token"
  >,
  options: { now?: Date; phone?: string } = {}
): string {
  const start = new Date(visit.scheduled_start);
  const end = new Date(start.getTime() + visit.estimated_duration_minutes * 60_000);
  const portal = customerPortalUrl(visit.customer_portal_token);
  const phone = options.phone || process.env.NEXT_PUBLIC_HYDROSENSE_PHONE || "(281) 694-5754";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//HydroSense Texas//Site Visit//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:site-visit-${visit.id}@hydrosensetx.com`, `SEQUENCE:${visit.schedule_version}`,
    `LAST-MODIFIED:${icsDate(new Date(visit.updated_at))}`, `DTSTAMP:${icsDate(options.now ?? new Date())}`,
    `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, "SUMMARY:HydroSense home water assessment",
    `LOCATION:${icsEscape([visit.property_address, visit.property_city, visit.property_zip].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${icsEscape(`Representative: ${visit.assigned_rep_name}\nHydroSense: ${phone}\nAppointment details: ${portal}`)}`,
    `URL:${portal}`, "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}
