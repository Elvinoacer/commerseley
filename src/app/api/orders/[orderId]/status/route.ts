import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await requireSuperAdmin(req);
    const { orderId } = params;
    const { status } = await req.json();

    await prisma.order.updateMany({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
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
