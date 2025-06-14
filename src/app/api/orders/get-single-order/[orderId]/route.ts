import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const user = await requireAuth(req);
    const { orderId } = params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: true,
        address: true,
        coupon: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unexpected error occurred!",
      },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
