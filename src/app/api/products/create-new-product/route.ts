import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import cloudinary from "@/config/cloudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await requireSuperAdmin(req);
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const gender = formData.get("gender") as string;
    const sizes = formData.get("sizes") as string;
    const colors = formData.get("colors") as string;
    const skus = formData.get("skus") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const isFeatured = formData.get("isFeatured") as string;
    const isOnOffer = formData.get("isOnOffer") as string;
    const offerPrice = formData.get("offerPrice") as string;

    // Validate required fields
    if (!name || !brand || !categoryId || !gender || !sizes || !colors || !price || !stock) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    // Parse colors
    let parsedColors: { hex: string; name: string }[];
    try {
      parsedColors = JSON.parse(colors);
      if (!Array.isArray(parsedColors) || !parsedColors.every((c) => c.hex && c.name)) {
        throw new Error("Invalid colors format");
      }
    } catch (e) {
      return NextResponse.json({ error: "Invalid colors format" }, { status: 400 });
    }

    // Parse SKUs if provided
    let parsedSkus: { key: string; value: string }[] | undefined;
    if (skus) {
      try {
        parsedSkus = JSON.parse(skus);
        if (!Array.isArray(parsedSkus) || !parsedSkus.every((s) => s.key && s.value)) {
          throw new Error("Invalid SKUs format");
        }
      } catch (e) {
        return NextResponse.json({ error: "Invalid SKUs format" }, { status: 400 });
      }
    }

    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Handle file uploads
    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, { folder: "ecommerce" });
        return result.secure_url;
      });

      imageUrls.push(...(await Promise.all(uploadPromises)));
    }

    // Create product
    const newlyCreatedProduct = await prisma.product.create({
      data: {
        name,
        brand,
        description,
        categoryId,
        gender,
        sizes: sizes.split(",").map((s) => s.trim()),
        colors: JSON.stringify(parsedColors),
        skus: parsedSkus ? JSON.stringify(parsedSkus) : undefined,
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        isFeatured: isFeatured === "true",
        isOnOffer: isOnOffer === "true",
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: user.id,
        action: "ADDED_PRODUCT",
        details: {
          productId: newlyCreatedProduct.id,
          productName: newlyCreatedProduct.name,
          categoryName: category.name,
        },
      },
    });

    return NextResponse.json(newlyCreatedProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Product with this name already exists" }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Some error occurred!" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
