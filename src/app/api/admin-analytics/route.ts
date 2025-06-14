import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "./utils";
import { requireSuperAdmin } from "@/lib/auth-helpers";

const analyticsService = new AnalyticsService();

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const analytics = await analyticsService.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to fetch analytics" }, { status: 500 });
  }
}
