import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { estimateTradeInValue } from "@/lib/tradeIn";
import { createTradeInRequest, trackAnalyticsEvent } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

const tradeInEstimateSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(2000).max(2025),
  mileageKm: z.number().min(0),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
  ownersCount: z.number().int().min(1).max(10).default(1),
  accidentHistory: z.boolean().default(false),
});

const tradeInSubmissionSchema = tradeInEstimateSchema.extend({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email(),
  targetVehicleId: z.string().optional(),
  estimatedValueMin: z.number().optional(),
  estimatedValueMax: z.number().optional(),
  fuelType: z.string().default("Petrol"),
  transmission: z.string().default("Manual"),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Instant estimation calculation
    if (body.action === "estimate") {
      const parsed = tradeInEstimateSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid valuation parameters", issues: parsed.error.issues }, { status: 400 });
      }
      const estimate = estimateTradeInValue(parsed.data);
      return NextResponse.json(estimate);
    }

    // Official submission
    const parsed = tradeInSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation error", issues: parsed.error.issues }, { status: 400 });
    }

    const { make, model, year, mileageKm, condition, ownersCount, accidentHistory } = parsed.data;
    const valuation = estimateTradeInValue({
      make,
      model,
      year,
      mileageKm,
      condition,
      ownersCount,
      accidentHistory,
    });

    const request = await createTradeInRequest({
      dealershipId: DEMO_DEALERSHIP.id,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerEmail: parsed.data.customerEmail,
      targetVehicleId: parsed.data.targetVehicleId,
      currentMake: make,
      currentModel: model,
      currentYear: year,
      mileageKm,
      fuelType: parsed.data.fuelType,
      transmission: parsed.data.transmission,
      condition,
      ownersCount,
      accidentHistory,
      estimatedValueMin: valuation.estimatedMin,
      estimatedValueMax: valuation.estimatedMax,
      notes: parsed.data.notes,
    });

    trackAnalyticsEvent(DEMO_DEALERSHIP.id, "TRADE_IN_STARTED", {
      estimatedMin: valuation.estimatedMin,
      estimatedMax: valuation.estimatedMax,
      make,
      model,
    });

    return NextResponse.json({ success: true, request, valuation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process trade-in valuation." }, { status: 500 });
  }
}
