import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateEmi } from "@/lib/finance";
import { createFinancingRequest, trackAnalyticsEvent } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

const financeApplicationSchema = z.object({
  vehicleId: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email(),
  vehiclePrice: z.number().positive(),
  downPayment: z.number().min(0),
  loanAmount: z.number().positive(),
  interestRate: z.number().positive(),
  tenureMonths: z.number().int().positive(),
  calculatedEmi: z.number().positive(),
  employmentType: z.string().optional(),
  annualIncome: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is an EMI calculation request or loan application submission
    if (body.action === "calculate") {
      const { vehiclePrice, downPayment, interestRate, tenureMonths } = body;
      const res = calculateEmi({
        vehiclePrice: Number(vehiclePrice) || 0,
        downPayment: Number(downPayment) || 0,
        interestRateAnnual: Number(interestRate) || 8.99,
        tenureMonths: Number(tenureMonths) || 60,
      });
      return NextResponse.json(res);
    }

    // Otherwise, submit application
    const parsed = financeApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const application = await createFinancingRequest({
      ...parsed.data,
      dealershipId: DEMO_DEALERSHIP.id,
    });

    trackAnalyticsEvent(DEMO_DEALERSHIP.id, "FINANCING_STARTED", {
      loanAmount: parsed.data.loanAmount,
      calculatedEmi: parsed.data.calculatedEmi,
    }, undefined, parsed.data.vehicleId);

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process financing request." },
      { status: 500 }
    );
  }
}
