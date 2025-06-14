// app/api/cart/update/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const { id } = params;
    const { quantity } = await req.json();

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
        cart: { userId: user.id },
      },
      data: { quantity },
    });

    const product = await prisma.product.findUnique({
      where: { id: updatedItem.productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: updatedItem.id,
      productId: updatedItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      color: updatedItem.color,
      size: updatedItem.size,
      quantity: updatedItem.quantity,
    };

    return NextResponse.json({
      success: true,
      data: responseItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update cart item quantity",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
