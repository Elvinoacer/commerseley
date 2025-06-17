import { requireAuth } from "@/lib/auth-helpers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Get wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId },
    });

    // Get paginated products in the wishlist
    const products = await prisma.product.findMany({
      where: {
        wishlist: {
          some: {
            userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Get total count of products in wishlist
    const totalItems = await prisma.product.count({
      where: {
        wishlist: {
          some: {
            userId,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      wishlist: wishlist ? { ...wishlist, product: products } : { product: [] }, // Ensure consistent structure
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
