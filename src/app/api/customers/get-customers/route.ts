import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const totalItems = await prisma.user.count({
      where: { role: "USER" },
    });

    const customers = await prisma.user.findMany({
      where: { role: "USER" },
      skip,
      take: limit,
      omit: { password: true },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: "Failed to fetch customers" }, { status: 500 });
  }
}
