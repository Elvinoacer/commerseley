import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const userId = user.id;
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json({ success: false, message: "Category name already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    await prisma.adminActivity.create({
      data: {
        adminId: userId,
        action: "ADDED_COLLECTION",
        details: {
          categoryId: category.id,
          categoryName: category.name,
        },
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, message: "Category name already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Failed to create category" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    const whereClause = {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    };

    const [categories, totalItems] = await Promise.all([
      prisma.category.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
  }
}
