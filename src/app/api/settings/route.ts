import { NextRequest, NextResponse } from "next/server";
import { getDealershipSettings, updateDealershipSettings } from "@/lib/db";
import { getSessionUser, checkRole } from "@/lib/auth";
import { DEMO_DEALERSHIP } from "@/lib/data/seedData";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getDealershipSettings(DEMO_DEALERSHIP.id);
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !checkRole(user.role, ["DEALERSHIP_ADMIN", "SUPER_ADMIN"])) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateDealershipSettings(DEMO_DEALERSHIP.id, body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
