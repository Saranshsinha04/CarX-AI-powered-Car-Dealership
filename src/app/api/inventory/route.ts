import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/lib/db";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const make = searchParams.get("make") || undefined;
    const bodyType = searchParams.get("bodyType") || undefined;
    const fuelType = searchParams.get("fuelType") || undefined;
    const transmission = searchParams.get("transmission") || undefined;
    const condition = searchParams.get("condition") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const seatingCapacity = searchParams.get("seatingCapacity") ? Number(searchParams.get("seatingCapacity")) : undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "recommended";
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 12;
    const isFeatured = searchParams.get("featured") === "true" ? true : undefined;

    const data = await getVehicles({
      dealershipId: DEMO_DEALERSHIP.id,
      make,
      bodyType,
      fuelType,
      transmission,
      condition,
      minPrice,
      maxPrice,
      seatingCapacity,
      search,
      sortBy,
      page,
      limit,
      isFeatured,
      status: "AVAILABLE",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle inventory." },
      { status: 500 }
    );
  }
}
