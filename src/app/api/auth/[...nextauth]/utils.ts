import prisma from "@/lib/prisma";
export async function notifyAdminsAboutNewUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) return;

    const admins = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { id: true },
    });

    await prisma.adminNotification.createMany({
      data: admins.map((admin) => ({
        adminId: admin.id,
        type: "NEW_USER_REGISTERED",
        details: {
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
        },
        isRead: false,
      })),
    });
  } catch (error) {
    console.error("Failed to send admin notifications:", error);
  }
}
