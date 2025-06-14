// app/api/cart/clear/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    await prisma.cartItem.deleteMany({
      where: {
        cart: { userId: user.id },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to clear cart!",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
