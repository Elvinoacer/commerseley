"use client";
import { Suspense } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetails";
import { API_ROUTES } from "@/utils/api";

async function fetchProductData(id: string) {
  try {
    const [productRes, reviewsRes] = await Promise.all([
      fetch(`${API_ROUTES.PRODUCTS}/${id}`),
      fetch(`${API_ROUTES.REVIEWS}/product/${id}`),
    ]);

    if (!productRes.ok || !reviewsRes.ok) {
      throw new Error("Failed to fetch product data");
    }

    const product = await productRes.json();
    const reviews = await reviewsRes.json();

    return {
      initialProduct: product.product || null,
      initialReviews: reviews.reviews || [],
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      initialProduct: null,
      initialReviews: [],
    };
  }
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} initialProduct={null} initialReviews={[]} />
    </Suspense>
  );
}
