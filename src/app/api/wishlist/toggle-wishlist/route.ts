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

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found", success: false }, { status: 404 });
    }

    let wishlist = await prisma.wishlist.findFirst({
      where: { userId: userId },
      include: { product: true },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: userId,
          product: {
            connect: { id: productId },
          },
        },
        include: {
          product: true,
        },
      });

      await logAdminNotification({
        type: NotificationType.WISHLIST_ITEM_ADDED,
        details: {
          userId,
          userName: userData?.name,
          userEmail: userData?.email,
          productId,
          productName: product.name,
        },
      });

      return NextResponse.json({
        wishlist,
        message: "Product added to wishlist",
        success: true,
      });
    }

    const isProductInWishlist = wishlist.product.some((p) => p.id === productId);

    if (isProductInWishlist) {
      wishlist = await prisma.wishlist.update({
        where: { id: wishlist.id },
        data: {
          product: {
            disconnect: { id: productId },
          },
        },
        include: {
          product: true,
        },
      });
      return NextResponse.json({
        wishlist,
        message: "Product removed from wishlist",
        success: true,
      });
    } else {
      wishlist = await prisma.wishlist.update({
        where: { id: wishlist.id },
        data: {
          product: {
            connect: { id: productId },
          },
        },
        include: {
          product: true,
        },
      });

      await logAdminNotification({
        type: NotificationType.WISHLIST_ITEM_ADDED,
        details: {
          userId,
          userName: userData?.name,
          userEmail: userData?.email,
          productId,
          productName: product.name,
        },
      });

      return NextResponse.json({
        wishlist,
        message: "Product added to wishlist",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
