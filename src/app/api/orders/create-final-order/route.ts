import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { logAdminNotification } from "@/utils/logAdminNotification";
import { NotificationType } from "@/generated/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { items, addressId, couponId, total, paymentId, email, paymentMethod, paymentStatus } = await req.json();

    // Fetch the COD setting
    const setting = await prisma.setting.findUnique({
      where: { id: "global_settings" },
    });

    // If COD is disabled, enforce completed payment for non-COD methods
    if (!setting?.isCashOnDelivery && paymentMethod === "CASH_ON_DELIVERY") {
      return NextResponse.json(
        {
          success: false,
          message: "Cash on Delivery is currently disabled",
        },
        { status: 400 }
      );
    }

    // If COD is disabled, ensure payment is completed for other methods
    if (!setting?.isCashOnDelivery && paymentMethod !== "CASH_ON_DELIVERY" && paymentStatus !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment must be completed before placing the order",
        },
        { status: 400 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId: user.id,
          addressId,
          email,
          couponId,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : paymentStatus,
          paymentId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              orderImages: [item.image],
              productName: item.productName,
              productCategory: item.productCategory,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock and sold count
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { cart: { userId: user.id } },
      });

      await prisma.cart.delete({
        where: { userId: user.id },
      });

      // Update coupon usage
      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Log notification
      await logAdminNotification({
        type: NotificationType.NEW_ORDER_PLACED,
        details: {
          orderId: newOrder.id,
          userId: user.id,
          userName: userData?.name,
          userEmail: userData?.email,
          total,
          itemCount: items.length,
          paymentMethod,
        },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unexpected error occurred!",
      },
      { status: 500 }
    );
  }
}
