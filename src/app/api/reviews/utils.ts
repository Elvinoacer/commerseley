import prisma from "@/lib/prisma";

export async function updateProductRating(productId: string): Promise<void> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { rating: null },
    });
    return;
  }

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await prisma.product.update({
    where: { id: productId },
    data: { rating: avgRating },
  });
}
