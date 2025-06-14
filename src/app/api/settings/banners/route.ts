// app/api/settings/banners/route.ts
import cloudinary from "@/config/cloudinary";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import { saveFile } from "@/utils/upload";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

const MAX_BANNERS = 8;

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 });
    }

    // Check current banner count
    const currentCount = await prisma.featureBanner.count();
    if (currentCount + files.length > MAX_BANNERS) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot exceed ${MAX_BANNERS} banners. Currently have ${currentCount} banners.`,
        },
        { status: 400 }
      );
    }

    // Process files in parallel
    const uploadPromises = files.map(async (file) => {
      const tempPath = await saveFile(file);
      try {
        const uploadResult = await cloudinary.uploader.upload(tempPath, {
          folder: "ecommerce-feature-banners",
        });
        await fs.promises.unlink(tempPath);

        return prisma.featureBanner.create({
          data: {
            imageUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
          },
        });
      } catch (error) {
        await fs.promises.unlink(tempPath);
        throw error;
      }
    });

    const banners = await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, banners }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add feature banners" },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const banners = await prisma.featureBanner.findMany({
      orderBy: { createdAt: "desc" },
      take: MAX_BANNERS,
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch feature banners" }, { status: 500 });
  }
}
