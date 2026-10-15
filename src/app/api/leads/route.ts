import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLeads, createLead, updateLeadStatus, trackAnalyticsEvent } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";
import { checkRateLimit } from "@/lib/rateLimit";

const createLeadSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  customerEmail: z.string().email("Please enter a valid email"),
  vehicleId: z.string().optional(),
  source: z.string().default("WEBSITE"),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  preferredTimeline: z.string().optional(),
  notesSummary: z.string().optional(),
  aiSummary: z.string().optional(),
  intentScore: z.number().optional(),
});

export const dynamic = "force-dynamic";

// GET /api/leads - Admin CRM
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage") || undefined;

    const leads = await getLeads(DEMO_DEALERSHIP.id, stage);
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads." }, { status: 500 });
  }
}

// POST /api/leads - Create lead
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkRateLimit(`lead-${ip}`, 15, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const lead = await createLead({
      ...parsed.data,
      dealershipId: DEMO_DEALERSHIP.id,
    });

    trackAnalyticsEvent(DEMO_DEALERSHIP.id, "LEAD_CREATED", {
      source: lead.source,
      vehicleId: lead.vehicleId,
    }, undefined, lead.vehicleId || undefined);

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}

// PUT /api/leads - Update lead stage & notes (Staff only)
export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { leadId, status, note } = body;

    if (!leadId || !status) {
      return NextResponse.json(
        { error: "leadId and status are required." },
        { status: 400 }
      );
    }

    const updated = await updateLeadStatus(leadId, status, note);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
  }
}
