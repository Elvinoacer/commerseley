"use client";
// app/listing/page.tsx
import { LoadingPage } from "@/components/common/LoadingPage";
import ProductListingPage from "@/components/suspenses/product-listing-page";
import { Suspense } from "react";

export default function ListingPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ProductListingPage />
    </Suspense>
  );
}
