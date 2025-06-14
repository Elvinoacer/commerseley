import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryIds = (searchParams.get("categoryIds") || "").split(",").filter(Boolean);
    const brands = (searchParams.get("brands") || "").split(",").filter(Boolean);
    const sizes = (searchParams.get("sizes") || "").split(",").filter(Boolean);
    const colors = (searchParams.get("colors") || "").split(",").filter(Boolean);
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || String(Number.MAX_SAFE_INTEGER));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const skip = (page - 1) * limit;

    const where: Prisma.productWhereInput = {
      AND: [
        categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {},
        brands.length > 0 ? { brand: { in: brands, mode: "insensitive" } } : {},
        sizes.length > 0 ? { sizes: { hasSome: sizes } } : {},
        colors.length > 0
          ? {
              colors: {
                array_contains: colors.map((c) => ({ hex: c, name: c })),
              },
            }
          : {},
        {
          price: { gte: minPrice, lte: maxPrice },
        },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: { select: { id: true, name: true } },
          reviews: {
            select: { id: true, rating: true, comment: true, createdAt: true },
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Some error occurred!" }, { status: 500 });
  }
}
