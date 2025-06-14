import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { updateProductRating } from "../utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const userId = user.id;
    const userRole = user.role;
    const { id } = params;
    const { rating, comment } = await req.json();

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== userId && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating || review.rating,
        comment: comment !== undefined ? comment : review.comment,
      },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });

    await updateProductRating(review.productId);

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    console.error("Error updating review:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    const userId = user.id;
    const userRole = user.role;
    const { id } = params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.userId !== userId && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });

    await updateProductRating(review.productId);

    return NextResponse.json({ success: true, message: "Review deleted successfully" }, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
