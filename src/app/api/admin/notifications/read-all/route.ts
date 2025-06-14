import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function PUT(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;

    await prisma.adminNotification.updateMany({
      where: {
        adminId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (error instanceof Error && error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Access denied. Admins only." }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to mark all notifications as read" }, { status: 500 });
  }
}
