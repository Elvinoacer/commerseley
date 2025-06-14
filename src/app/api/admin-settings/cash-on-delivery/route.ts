import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireSuperAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const setting = await prisma.setting.findUnique({
      where: { id: "global_settings" },
    });

    return NextResponse.json({
      success: true,
      data: setting || { id: "global_settings", isCashOnDelivery: true },
    });
  } catch (error) {
    console.error("Error fetching cash on delivery setting:", error);
    return NextResponse.json({ success: false, message: "Unexpected error occurred!" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { isCashOnDelivery } = await req.json();

    const setting = await prisma.setting.upsert({
      where: { id: "global_settings" },
      update: { isCashOnDelivery },
      create: {
        id: "global_settings",
        isCashOnDelivery,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cash on Delivery setting updated successfully",
      data: setting,
    });
  } catch (error: any) {
    console.error("Error updating cash on delivery setting:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Only super admins can update settings" }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Unexpected error occurred!" }, { status: 500 });
  }
}
