import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userId = user.id;

    if (!userId) {
      return NextResponse.json({ message: "User ID is undefined", success: false }, { status: 400 });
    }

    const wishlist = await prisma.wishlist.findFirst({
      where: { userId: userId },
    });

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist not found", success: false }, { status: 404 });
    }

    const clearedWishlist = await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        product: {
          set: [],
        },
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      wishlist: clearedWishlist,
      message: "Wishlist cleared",
      success: true,
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
