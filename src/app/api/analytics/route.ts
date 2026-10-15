import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/db";
import { getSessionUser, checkRole } from "@/lib/auth";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || !checkRole(user.role, ["DEALERSHIP_ADMIN", "SALES_MANAGER", "SUPER_ADMIN", "SALES_AGENT"])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await getAnalyticsSummary(DEMO_DEALERSHIP.id);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics summary." }, { status: 500 });
  }
}
