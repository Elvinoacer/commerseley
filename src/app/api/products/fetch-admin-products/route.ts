import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.productWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
    return NextResponse.json(
      { success: false, message: error.message || "Some error occurred!" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
