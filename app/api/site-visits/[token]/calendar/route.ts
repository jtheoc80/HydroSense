import { getSiteVisitByToken } from "@/lib/site-visits/repository";
import { customerPortalUrl } from "@/lib/site-visits/format";

function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) return new Response("Appointment unavailable", { status: 404 });
  const visit = await getSiteVisitByToken(token);
  if (!visit) return new Response("Appointment unavailable", { status: 404 });
  const start = new Date(visit.scheduled_start);
  const end = new Date(start.getTime() + visit.estimated_duration_minutes * 60_000);
  const portal = customerPortalUrl(visit.customer_portal_token);
  const phone = process.env.NEXT_PUBLIC_HYDROSENSE_PHONE || "(281) 694-5754";
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//HydroSense Texas//Site Visit//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:site-visit-${visit.id}-v${visit.schedule_version}@hydrosensetx.com`,
    `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`,
    "SUMMARY:HydroSense home water assessment", `LOCATION:${icsEscape([visit.property_address, visit.property_city, visit.property_zip].filter(Boolean).join(", "))}`,
    `DESCRIPTION:${icsEscape(`Representative: ${visit.assigned_rep_name}\nHydroSense: ${phone}\nAppointment details: ${portal}`)}`,
    `URL:${portal}`, "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hydrosense-site-visit.ics"',
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
