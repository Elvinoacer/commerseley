import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateEmail } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, notificationToken } = await req.json();

    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!email && !notificationToken) {
      return NextResponse.json({ error: "Either email or notification token is required" }, { status: 400 });
    }

    let subscription;

    if (email) {
      const existing = await prisma.subscription.findUnique({
        where: { email },
      });

      if (existing) {
        subscription = await prisma.subscription.update({
          where: { email },
          data: {
            isSubscribed: true,
            notificationToken: notificationToken || existing.notificationToken,
          },
        });
      } else {
        subscription = await prisma.subscription.create({
          data: {
            email,
            notificationToken,
            isSubscribed: true,
          },
        });
      }
    } else if (notificationToken) {
      const existing = await prisma.subscription.findFirst({
        where: { notificationToken },
      });

      if (existing) {
        subscription = existing;
      } else {
        subscription = await prisma.subscription.create({
          data: {
            notificationToken,
            isSubscribed: true,
          },
        });
      }
    }

    return NextResponse.json({
      message: "Subscription successful",
      subscription,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "An error occurred while processing subscription" }, { status: 500 });
  }
}
