// app/api/address/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const { id } = params;
    const { name, address, city, country, postalCode, phone, isDefault } = await req.json();

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found!",
        },
        { status: 404 }
      );
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({
      success: true,
      address: updatedAddress,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update address",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const { id } = params;

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found!",
        },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete address",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
