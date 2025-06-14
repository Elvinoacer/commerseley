import cloudinary from "@/config/cloudinary";
import { requireAuth, requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Optional auth - only require if you want to track who views products
    try {
      await requireAuth(req);
    } catch {
      // Allow unauthenticated access to product details
    }

    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Some error occurred!" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const { id } = params;
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
    const removeImageUrls = formData.get("removeImageUrls") as string;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
    }

    // Parse colors if provided
    let parsedColors: { hex: string; name: string }[] | undefined;
    if (colors) {
      try {
        parsedColors = JSON.parse(colors);
        if (!Array.isArray(parsedColors) || !parsedColors.every((c) => c.hex && c.name)) {
          throw new Error("Invalid colors format");
        }
      } catch (e) {
        return NextResponse.json({ error: "Invalid colors format" }, { status: 400 });
      }
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

    // Handle file uploads
    const files = formData.getAll("images") as File[];
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, { folder: "ecommerce" });
        return result.secure_url;
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    // Handle image removal
    let updatedImages = existingProduct.images;
    if (removeImageUrls) {
      const removeUrls = JSON.parse(removeImageUrls) as string[];
      if (Array.isArray(removeUrls)) {
        updatedImages = updatedImages.filter((url) => !removeUrls.includes(url));
        const deletePromises = removeUrls.map((url: string) =>
          cloudinary.uploader.destroy(url.split("/").pop()?.split(".")[0] || "")
        );
        await Promise.all(deletePromises);
      }
    }

    updatedImages = [...updatedImages, ...imageUrls];

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        brand: brand || existingProduct.brand,
        description: description || existingProduct.description,
        categoryId: categoryId || existingProduct.categoryId,
        gender: gender || existingProduct.gender,
        colors: parsedColors
          ? JSON.stringify(parsedColors)
          : existingProduct.colors !== null && existingProduct.colors !== undefined
          ? existingProduct.colors
          : undefined,
        skus: parsedSkus
          ? JSON.stringify(parsedSkus)
          : existingProduct.skus !== null && existingProduct.skus !== undefined
          ? existingProduct.skus
          : undefined,
        price: price ? parseFloat(price) : existingProduct.price,
        stock: stock ? parseInt(stock) : existingProduct.stock,
        images: updatedImages.length > 0 ? updatedImages : existingProduct.images,
        isFeatured: isFeatured !== undefined ? isFeatured === "true" : existingProduct.isFeatured,
        isOnOffer: isOnOffer !== undefined ? isOnOffer === "true" : existingProduct.isOnOffer,
        offerPrice: offerPrice ? parseFloat(offerPrice) : existingProduct.offerPrice,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    // Log stock change if needed
    if (stock && parseInt(stock) === 0 && existingProduct.stock > 0) {
      await prisma.adminActivity.create({
        data: {
          adminId: user.id,
          action: "OUT_OF_STOCK",
          details: {
            productId: product.id,
            productName: product.name,
            categoryName: product.category.name,
          },
        },
      });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Some error occurred!" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireSuperAdmin(req);
    const { id } = params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: user.id,
        action: "DELETED_PRODUCTS",
        details: {
          productId: product.id,
          productName: product.name,
          categoryId: product.categoryId,
        },
      },
    });

    // Delete images from Cloudinary
    const deletePromises = product.images.map((url) => {
      const publicId = url.split("/").pop()?.split(".")[0] || "";
      return cloudinary.uploader.destroy(publicId);
    });
    await Promise.all(deletePromises);

    // Delete product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, message: error.message || "Some error occurred!" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
