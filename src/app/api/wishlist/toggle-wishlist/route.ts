import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { logAdminNotification } from "@/utils/logAdminNotification";
import { NotificationType } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userId = user.id;
    const { productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: "User ID or product ID is undefined", success: false }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found", success: false }, { status: 404 });
    }

    // Check if product is already in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Product removed from wishlist",
        isInWishlist: false,
      });
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });

      // Log admin notification
      await logAdminNotification({
        type: NotificationType.WISHLIST_ITEM_ADDED,
        details: {
          userId,
          userName: user.email, // or another existing property of user
          userEmail: user.email,
          productId,
          productName: product.name,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Product added to wishlist",
        isInWishlist: true,
      });
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
