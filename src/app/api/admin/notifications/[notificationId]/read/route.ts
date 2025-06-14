import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function PUT(req: NextRequest, { params }: { params: { notificationId: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { notificationId } = params;

    const notification = await prisma.adminNotification.findUnique({
      where: {
        id: notificationId,
        adminId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    const updatedNotification = await prisma.adminNotification.update({
      where: {
        id: notificationId,
        adminId: userId,
      },
      data: {
        isRead: true,
      },
      include: {
        admin: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedNotification,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    if (error instanceof Error && error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Access denied. Admins only." }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to mark notification as read" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { notificationId: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { notificationId } = params;

    const notification = await prisma.adminNotification.findUnique({
      where: {
        id: notificationId,
        adminId: userId,
      },
    });

    if (!notification) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    await prisma.adminNotification.delete({
      where: {
        id: notificationId,
        adminId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    if (error instanceof Error && error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Access denied. Admins only." }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to delete notification" }, { status: 500 });
  }
}
