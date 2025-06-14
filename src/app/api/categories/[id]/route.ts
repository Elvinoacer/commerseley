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

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category with associated products",
        },
        { status: 400 }
      );
    }

    await prisma.adminActivity.create({
      data: {
        adminId: userId,
        action: "REMOVED_CATEGORY",
        details: {
          categoryId: category.id,
          categoryName: category.name,
        },
      },
    });

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" }, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "Failed to delete category" }, { status: 500 });
  }
}
