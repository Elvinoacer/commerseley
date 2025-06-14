import prisma from "../lib/prisma";
import { NotificationType } from "@/generated/prisma";

interface LogAdminNotificationParams {
  type: NotificationType;
  details: object;
}

export const logAdminNotification = async ({ type, details }: LogAdminNotificationParams): Promise<void> => {
  try {
    // Fetch all admins
    const admins = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { id: true },
    });

    // Create notification for each admin
    await prisma.adminNotification.createMany({
      data: admins.map((admin) => ({
        adminId: admin.id,
        type,
        details: JSON.stringify(details),
      })),
    });
  } catch (error) {
    console.error("Error logging admin notification:", error);
  }
};
