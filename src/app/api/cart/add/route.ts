// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { logAdminNotification } from "@/utils/logAdminNotification";
import { NotificationType } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { productId, quantity, size, color } = await req.json();

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || null,
          color: color || null,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    // Log notification
    await logAdminNotification({
      type: NotificationType.CART_ITEM_ADDED,
      details: {
        userId: user.id,
        userName: userDetails?.name,
        userEmail: userDetails?.email,
        productId,
        productName: product?.name,
        quantity,
        size,
        color,
      },
    });

    const responseItem = {
      id: cartItem.id,
      productId: cartItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      color: cartItem.color,
      size: cartItem.size,
      quantity: cartItem.quantity,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Some error occurred!",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
