import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    await requireSuperAdmin(req);
    const { customerId } = params;

    const user = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        wishlist: {
          include: { product: { select: { id: true, name: true } } },
        },
        orders: {
          include: {
            items: { select: { id: true, productId: true, quantity: true } },
            address: true,
            coupon: { select: { id: true, code: true } },
          },
        },
        addresses: true,
        cart: {
          include: {
            items: { select: { id: true, productId: true, quantity: true } },
          },
        },
      },
      omit: { password: true },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "Customer details fetched",
    });
  } catch (error: any) {
    console.error("Error fetching customer details:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    await requireSuperAdmin(req);
    const { customerId } = params;

    const user = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!user || user.role !== "USER") {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cart: { userId: customerId } } }),
      prisma.cart.deleteMany({ where: { userId: customerId } }),
      prisma.wishlist.deleteMany({ where: { userId: customerId } }),
      prisma.address.deleteMany({ where: { userId: customerId } }),
      prisma.review.deleteMany({ where: { userId: customerId } }),
      prisma.orderItem.deleteMany({ where: { order: { userId: customerId } } }),
      prisma.order.deleteMany({ where: { userId: customerId } }),
      prisma.subscription.deleteMany({ where: { email: user.email } }),
      prisma.user.delete({ where: { id: customerId } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete customer" },
      { status: 500 }
    );
  }
}
