import { getSiteVisitByToken } from "@/lib/site-visits/repository";
import { buildSiteVisitCalendar } from "@/lib/site-visits/calendar";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) return new Response("Appointment unavailable", { status: 404 });
  const visit = await getSiteVisitByToken(token);
  if (!visit) return new Response("Appointment unavailable", { status: 404 });
  const calendar = buildSiteVisitCalendar(visit);
  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hydrosense-site-visit.ics"',
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
