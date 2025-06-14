import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentMethod } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Money payload", payload);

    const { invoice_id, state, provider } = payload;

    const providerToPaymentMethod: { [key: string]: PaymentMethod } = {
      pesalink: PaymentMethod.PESALINK,
      card: PaymentMethod.CREDIT_CARD,
      "apple-pay": PaymentMethod.APPLE_PAY,
      gpay: PaymentMethod.GPAY,
      cashapp: PaymentMethod.CASHAPP,
      mpesa: PaymentMethod.MPESA,
    };

    const paymentMethod = providerToPaymentMethod[provider.toLowerCase() as keyof typeof providerToPaymentMethod];

    switch (state) {
      case "PENDING":
        await prisma.order.updateMany({
          where: { paymentId: invoice_id },
          data: {
            paymentStatus: "PENDING",
            paymentMethod,
            paymentId: invoice_id,
          },
        });
        break;

      case "PROCESSING":
        await prisma.order.updateMany({
          where: { paymentId: invoice_id },
          data: { paymentStatus: "PENDING" },
        });
        break;

      case "COMPLETE":
        const user = await prisma.user.findUnique({
          where: { id: payload.api_ref },
          include: {
            cart: {
              include: {
                items: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        price: true,
                        offerPrice: true,
                        category: {
                          select: {
                            name: true,
                          },
                        },
                        images: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.cart || user.cart.items.length === 0) {
          return NextResponse.json({ message: "No user or cart found" }, { status: 400 });
        }

        const address = await prisma.address.findFirst({
          where: { userId: user.id, isDefault: true },
        });

        if (!address) {
          return NextResponse.json({ message: "No default address found" }, { status: 400 });
        }

        const orderItems = user.cart.items.map((item) => {
          const product = item.product;
          return {
            productId: item.productId,
            productName: product.name,
            productCategory: product.category.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: product.offerPrice ? product.offerPrice : product.price,
            orderImages: product.images || [],
          };
        });

        const order = await prisma.order.create({
          data: {
            userId: user.id,
            addressId: address.id,
            paymentId: invoice_id,
            paymentMethod: provider,
            paymentStatus: "COMPLETED",
            status: "PENDING",
            total: parseFloat(payload.net_amount),
            items: {
              create: orderItems,
            },
          },
        });

        await prisma.adminNotification.create({
          data: {
            adminId: user.id,
            type: "NEW_ORDER_PLACED",
            details: {
              orderId: order.id,
              amount: payload.net_amount,
              paymentMethod,
            },
          },
        });

        await prisma.cartItem.deleteMany({
          where: { cartId: user.cart.id },
        });

        await prisma.cart.update({
          where: { id: user.cart.id },
          data: { updatedAt: new Date() },
        });

        break;

      case "FAILED":
        await prisma.order.updateMany({
          where: { paymentId: invoice_id },
          data: {
            paymentStatus: "PENDING",
            status: "PENDING",
          },
        });
        break;

      default:
        return NextResponse.json({ message: "Invalid payment state" }, { status: 400 });
    }

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
