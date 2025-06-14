import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const notificationToken = searchParams.get("notificationToken");

    if (!email && !notificationToken) {
      return NextResponse.json({ error: "Either email or notification token is required" }, { status: 400 });
    }

    let subscription;

    if (email) {
      subscription = await prisma.subscription.findUnique({
        where: { email },
      });
    } else if (notificationToken) {
      subscription = await prisma.subscription.findFirst({
        where: { notificationToken },
      });
    }

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "An error occurred while fetching subscription" }, { status: 500 });
  }
}
