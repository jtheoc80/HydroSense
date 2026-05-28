import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Cal.com sends booking confirmation webhooks to this endpoint.
// Configure in Cal.com: Settings > Developer > Webhooks > Add
// Event trigger: BOOKING_CREATED
// Subscriber URL: https://hydrosensetx.com/api/booking-webhook

interface CalBookingPayload {
  triggerEvent: string;
  payload: {
    bookingId: number;
    startTime: string;
    endTime: string;
    attendees: { email: string; name: string }[];
    metadata?: {
      leadId?: string;
    };
    meetingUrl?: string;
    responses?: {
      email?: { value: string };
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CalBookingPayload;

    if (!body.payload) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const { payload } = body;

    // Try to match the booking to a lead by email
    const attendeeEmail =
      payload.responses?.email?.value ||
      payload.attendees?.[0]?.email ||
      "";

    if (!attendeeEmail) {
      console.warn("Booking webhook: no attendee email found");
      return NextResponse.json({ ok: true, matched: false });
    }

    // Find the most recent lead with this email
    const { data: lead, error: findError } = await supabase
      .from("leads")
      .select("id, status")
      .eq("email", attendeeEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError || !lead) {
      console.warn(
        `Booking webhook: no lead found for ${attendeeEmail}`
      );
      return NextResponse.json({ ok: true, matched: false });
    }

    // Update lead status to booked
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: "booked",
        booked_at: payload.startTime,
        meeting_url: payload.meetingUrl || null,
        notes: `Cal.com booking #${payload.bookingId} | ${payload.startTime}`,
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Booking webhook update error:", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update lead" },
        { status: 500 }
      );
    }

    console.log(
      `Lead ${lead.id} updated to booked (Cal.com #${payload.bookingId})`
    );

    return NextResponse.json({ ok: true, matched: true, leadId: lead.id });
  } catch (err) {
    console.error("Booking webhook error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
