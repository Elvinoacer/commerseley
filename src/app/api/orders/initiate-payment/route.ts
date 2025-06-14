import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import IntaSend from "intasend-node";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { email, amount, firstName, lastName, redirectUrl } = await req.json();

    // Validate the cart exists
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    // Initialize IntaSend
    const intasend = new IntaSend(process.env.INTASEND_PUBLIC_KEY!, process.env.INTASEND_SECRET_KEY!, false);

    const collection = intasend.collection();

    // Create payment link
    const response = await collection.charge({
      first_name: firstName,
      last_name: lastName,
      email: email,
      host: redirectUrl,
      amount: amount,
      currency: "KES",
      api_ref: user.id, // Using user ID as reference
      redirect_url: redirectUrl,
    });

    return NextResponse.json({
      success: true,
      paymentUrl: response.url,
    });
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to initiate payment",
      },
      { status: 500 }
    );
  }
}
