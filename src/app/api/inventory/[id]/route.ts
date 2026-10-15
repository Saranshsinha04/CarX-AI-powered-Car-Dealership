import { NextRequest, NextResponse } from "next/server";
import { getVehicleById, trackAnalyticsEvent } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
    }

    // Log vehicle view event
    trackAnalyticsEvent(DEMO_DEALERSHIP.id, "VEHICLE_VIEW", {
      name: `${vehicle.make} ${vehicle.model}`,
      price: vehicle.price,
    }, undefined, vehicle.id);

    return NextResponse.json({ vehicle });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve vehicle details." },
      { status: 500 }
    );
  }
}
