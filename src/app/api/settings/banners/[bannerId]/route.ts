// app/api/settings/banners/[bannerId]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import cloudinary from "@/config/cloudinary";
import fs from "fs";
import { deleteImageFromCloudinary } from "@/config/cloudinary";
import { saveFile, parseFormData } from "@/utils/upload";

export async function PUT(req: NextRequest, { params }: { params: { bannerId: string } }) {
  try {
    await requireSuperAdmin(req);

    const { bannerId } = params;
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Find the existing banner
    const existingBanner = await prisma.featureBanner.findUnique({
      where: { id: bannerId },
    });

    if (!existingBanner) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    const tempPath = await saveFile(file);
    try {
      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempPath, {
        folder: "ecommerce-feature-banners",
      });

      // Delete old image from Cloudinary if it exists
      if (existingBanner.cloudinaryId) {
        await deleteImageFromCloudinary(existingBanner.cloudinaryId);
      }

      // Update the banner in database
      const updatedBanner = await prisma.featureBanner.update({
        where: { id: bannerId },
        data: {
          imageUrl: uploadResult.secure_url,
          cloudinaryId: uploadResult.public_id,
        },
      });

      await fs.promises.unlink(tempPath);

      return NextResponse.json({ success: true, banner: updatedBanner });
    } catch (error) {
      await fs.promises.unlink(tempPath);
      throw error;
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update feature banner",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { bannerId: string } }) {
  try {
    await requireSuperAdmin(req);

    const { bannerId } = params;

    // Find the banner first to get Cloudinary ID
    const banner = await prisma.featureBanner.findUnique({
      where: { id: bannerId },
    });

    if (!banner) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    // Delete from Cloudinary if cloudinaryId exists
    if (banner.cloudinaryId) {
      await deleteImageFromCloudinary(banner.cloudinaryId);
    }

    // Delete from database
    await prisma.featureBanner.delete({
      where: { id: bannerId },
    });

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete feature banner",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
