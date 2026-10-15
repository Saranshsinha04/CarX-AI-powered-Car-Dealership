import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAppointments, createAppointment, trackAnalyticsEvent } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";
import { checkRateLimit } from "@/lib/rateLimit";

const createAppointmentSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle selection is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  customerEmail: z.string().email("Please enter a valid email"),
  scheduledAt: z.string().min(5, "Scheduled date/time is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const appointments = await getAppointments(DEMO_DEALERSHIP.id, status);
    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(`apt-${ip}`, 10, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many booking requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const appointment = await createAppointment({
      ...parsed.data,
      dealershipId: DEMO_DEALERSHIP.id,
    });

    trackAnalyticsEvent(DEMO_DEALERSHIP.id, "TEST_DRIVE_STARTED", {
      appointmentId: appointment.id,
      scheduledAt: appointment.scheduledAt,
    }, undefined, parsed.data.vehicleId);

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to book appointment." },
      { status: 500 }
    );
  }
}
