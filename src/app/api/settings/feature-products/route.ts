// app/api/settings/feature-products/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";

const MAX_BANNERS = 8;

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const { productIds } = await req.json();

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ success: false, message: "Invalid product Ids format" }, { status: 400 });
    }

    if (productIds.length > MAX_BANNERS) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot feature more than ${MAX_BANNERS} products`,
        },
        { status: 400 }
      );
    }

    // Reset all products to not featured
    await prisma.product.updateMany({
      data: { isFeatured: false },
    });

    // Set selected products as featured
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isFeatured: true },
    });

    return NextResponse.json({
      success: true,
      message: "Featured products updated successfully!",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update feature products",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });

    return NextResponse.json({
      success: true,
      featuredProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch feature products",
      },
      { status: 500 }
    );
  }
}
