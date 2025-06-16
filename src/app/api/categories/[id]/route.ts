import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { id } = params;
    const { name, description } = await req.json();

    if (name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name },
      });
      if (existingCategory && existingCategory.id !== id) {
        return NextResponse.json({ success: false, message: "Category name already exists" }, { status: 400 });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    await prisma.adminActivity.create({
      data: {
        adminId: userId,
        action: "UPDATED_CATEGORY",
        details: {
          categoryId: category.id,
          categoryName: category.name,
        },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error("Error updating category:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, message: "Category name already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            CartItem: true,
            reviews: true,
            wishlist: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // First delete all cart items associated with these products
    await prisma.cartItem.deleteMany({
      where: {
        productId: {
          in: category.products.map((p) => p.id),
        },
      },
    });

    // Delete all reviews associated with these products
    await prisma.review.deleteMany({
      where: {
        productId: {
          in: category.products.map((p) => p.id),
        },
      },
    });

    // Delete all wishlist items associated with these products
    await prisma.wishlist.deleteMany({
      where: {
        productId: {
          in: category.products.map((p) => p.id),
        },
      },
    });

    // Create activity log
    await prisma.adminActivity.create({
      data: {
        adminId: userId,
        action: "REMOVED_CATEGORY",
        details: {
          categoryId: category.id,
          categoryName: category.name,
          deletedProductsCount: category.products.length,
        },
      },
    });

    // Now delete the category (which will delete products via cascade)
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Category and ${category.products.length} associated products deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete category",
        code: error.code,
      },
      { status: 500 }
    );
  }
}
