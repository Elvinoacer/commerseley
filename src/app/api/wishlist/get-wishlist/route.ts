import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userId = user.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json({ message: "User ID required", success: false }, { status: 400 });
    }

    const wishlist = await prisma.wishlist.findFirst({
      where: { userId },
      include: { product: true },
    });

    const totalItems = wishlist ? wishlist.product.length : 0;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedProducts = wishlist ? wishlist.product.slice(skip, skip + limit) : [];

    return NextResponse.json({
      success: true,
      wishlist: { product: paginatedProducts },
      currentPage: page,
      totalPages,
      itemsPerPage: limit,
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
