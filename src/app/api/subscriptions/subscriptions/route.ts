import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { isSubscribed: true },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "An error occurred while fetching subscriptions" }, { status: 500 });
  }
}
