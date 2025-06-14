import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import { AdminAction, Prisma } from "@/generated/prisma";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const searchQuery = (searchParams.get("search") || "").trim();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const searchConditions = searchQuery
      ? {
          OR: [
            {
              admin: {
                name: {
                  contains: searchQuery,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              details: {
                path: ["productName"],
                string_contains: searchQuery,
              },
            },
            {
              details: {
                path: ["collectionName"],
                string_contains: searchQuery,
              },
            },
            {
              details: {
                path: ["categoryName"],
                string_contains: searchQuery,
              },
            },
            ...Object.values(AdminAction)
              .filter((action) => action.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((action) => ({
                action: action,
              })),
          ],
        }
      : {};

    const whereClause = {
      ...(userId ? { adminId: userId } : {}),
      createdAt: {
        gte: oneWeekAgo,
      },
      ...searchConditions,
    };

    const [activities, totalCount] = await Promise.all([
      prisma.adminActivity.findMany({
        where: whereClause,
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          admin: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.adminActivity.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return NextResponse.json({
      success: true,
      activities: activities.map((activity) => ({
        ...activity,
        details: activity.details as Record<string, unknown>,
      })),
      currentPage: page,
      totalPages,
      totalItems: totalCount,
    });
  } catch (error: any) {
    console.error("Error fetching admin activities:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch activities",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
