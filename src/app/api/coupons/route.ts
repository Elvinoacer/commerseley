import { NextResponse } from "next/server";
import { requireAuth, requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Require authentication for all coupon access
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get total count of coupons
    const totalItems = await prisma.coupon.count();

    const couponList = await prisma.coupon.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "Coupons fetched successfully!",
      couponList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch coupon list",
      },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Require super admin for coupon creation
    await requireSuperAdmin(req);

    const { code, discountPercent, startDate, endDate, usageLimit } = await req.json();

    const newlyCreatedCoupon = await prisma.coupon.create({
      data: {
        code,
        discountPercent: parseInt(discountPercent),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: parseInt(usageLimit),
        usageCount: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully!",
        coupon: newlyCreatedCoupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create coupon",
      },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
