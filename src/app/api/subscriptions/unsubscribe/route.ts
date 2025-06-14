import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, notificationToken } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let subscription;

    if (email) {
      subscription = await prisma.subscription.update({
        where: { email },
        data: { isSubscribed: false },
      });
    } else if (notificationToken) {
      subscription = await prisma.subscription.updateMany({
        where: { notificationToken },
        data: { isSubscribed: false },
      });
    }

    return NextResponse.json({
      message: "Unsubscription successful",
      subscription,
    });
  } catch (error) {
    console.error("Unsubscription error:", error);
    return NextResponse.json({ error: "An error occurred while processing unsubscription" }, { status: 500 });
  }
}
