// app/api/cart/remove/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { logAdminNotification } from "@/utils/logAdminNotification";
import { NotificationType } from "@/generated/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const { id } = params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      select: { productId: true, quantity: true, size: true, color: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found",
        },
        { status: 404 }
      );
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
      select: { name: true },
    });

    await prisma.cartItem.delete({
      where: {
        id,
        cart: { userId: user.id },
      },
    });

    // Log notification
    await logAdminNotification({
      type: NotificationType.CART_ITEM_REMOVED,
      details: {
        userId: user.id,
        userName: userDetails?.name,
        userEmail: userDetails?.email,
        productId: cartItem.productId,
        productName: product?.name,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item has been removed from cart",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to remove from cart!",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
