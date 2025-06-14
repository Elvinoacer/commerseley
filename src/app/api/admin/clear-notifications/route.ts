import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;

    await prisma.adminNotification.deleteMany({
      where: {
        adminId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing all notifications:", error);
    if (error instanceof Error && error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Access denied. Admins only." }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to clear all notifications" }, { status: 500 });
  }
}
