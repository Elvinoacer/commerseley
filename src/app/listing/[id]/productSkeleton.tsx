"use client";

import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/utils";

function ProductDetailsSkeleton() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center text-sm mb-6">
          <Skeleton className={`h-4 w-16 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
          <span className="mx-2">/</span>
          <Skeleton className={`h-4 w-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
          <span className="mx-2">/</span>
          <Skeleton className={`h-4 w-32 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images Skeleton */}
          <div className="lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4 sm:gap-6">
            {/* Thumbnails Skeleton */}
            <div className="hidden lg:flex flex-col gap-3 w-16 sm:w-20">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
              ))}
            </div>
            {/* Main Image Skeleton */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
              <Skeleton className={`w-full h-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              {/* Navigation Arrows Skeleton */}
              <Skeleton
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
              <Skeleton
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
              {/* Wishlist Button Skeleton */}
              <Skeleton
                className={`absolute top-4 right-4 w-10 h-10 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
              {/* Badges Skeleton */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Skeleton className={`w-20 h-6 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`} />
                <Skeleton className={`w-16 h-6 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`} />
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="lg:w-1/2 space-y-6">
            {/* Title and Rating */}
            <div>
              <Skeleton className={`h-8 w-3/4 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex items-center gap-2">
                <Skeleton className={`h-5 w-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                <Skeleton className={`h-4 w-16 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>
            {/* Price and Stock */}
            <div>
              <Skeleton className={`h-8 w-1/3 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <Skeleton className={`h-4 w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>
            {/* Description */}
            <Skeleton className={`h-16 w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            {/* Color Selection */}
            <div>
              <Skeleton className={`h-4 w-1/4 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex gap-2 sm:gap-3">
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Size Selection */}
            <div>
              <Skeleton className={`h-4 w-1/4 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Quantity Selection */}
            <div>
              <Skeleton className={`h-4 w-1/4 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex items-center gap-4">
                <Skeleton className={`w-32 h-10 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                <Skeleton className={`h-4 w-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>
            {/* Add to Cart Button */}
            <Skeleton
              className={`h-12 sm:h-14 w-full rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
            />
            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`h-10 w-full rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="flex gap-4 sm:gap-6 border-b pb-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className={`h-6 w-32 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <Skeleton className={`h-8 w-1/3 mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(2)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`h-40 w-full rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetailsSkeleton;
