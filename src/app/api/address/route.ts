// app/api/address/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      address: addresses,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch addresses",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { name, address, city, country, postalCode, phone, isDefault } = await req.json();

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: {
          isDefault: false,
        },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create address",
      },
      { status: error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}
