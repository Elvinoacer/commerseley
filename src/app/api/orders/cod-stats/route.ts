// File: /app/api/orders/cod-stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    // Require authentication and SUPER_ADMIN role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Fetch COD order statistics
    const [codOrders, totalOrders, avgCODOrderValue] = await Promise.all([
      prisma.order.count({
        where: { paymentMethod: "CASH_ON_DELIVERY" },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { paymentMethod: "CASH_ON_DELIVERY" },
        _avg: { total: true },
      }),
    ]);

    const codUsageRate = totalOrders > 0 ? (codOrders / totalOrders) * 100 : 0;
    const avgValue = avgCODOrderValue._avg.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCODOrders: codOrders,
        codUsageRate,
        avgCODOrderValue: avgValue,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch COD statistics" },
      { status: 500 }
    );
  }
}
