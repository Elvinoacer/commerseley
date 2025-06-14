import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = (searchParams.get("search") || "").toLowerCase();
    const skip = (page - 1) * limit;

    if (search) {
      const notifications = await prisma.$queryRaw`
        SELECT * FROM "AdminNotification"
        WHERE 
          "adminId" = ${userId} AND
          (
            LOWER("type"::text) LIKE ${`%${search}%`} OR
            LOWER("details"::text) LIKE ${`%${search}%`}
          )
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      const totalCountResult: any = await prisma.$queryRaw`
        SELECT COUNT(*) FROM "AdminNotification"
        WHERE 
          "adminId" = ${userId} AND
          (
            LOWER("type"::text) LIKE ${`%${search}%`} OR
            LOWER("details"::text) LIKE ${`%${search}%`}
          )
      `;

      const totalItems = parseInt(totalCountResult[0].count);

      return NextResponse.json({
        success: true,
        data: notifications,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      });
    }

    const [notifications, totalItems] = await Promise.all([
      prisma.adminNotification.findMany({
        where: { adminId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          admin: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.adminNotification.count({
        where: { adminId: userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    if (error instanceof Error && error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Access denied. Admins only." }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
  }
}
