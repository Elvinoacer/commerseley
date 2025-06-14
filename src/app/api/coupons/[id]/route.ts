import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require super admin for coupon deletion
    await requireSuperAdmin(req);

    const { id } = params;

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon deleted successfully!",
        id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete coupon",
      },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
