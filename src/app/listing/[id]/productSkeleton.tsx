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
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb Skeleton - Simplified for mobile */}
        <div className="flex items-center text-xs sm:text-sm mb-4 sm:mb-6 overflow-x-auto pb-2">
          <Skeleton className={`h-3 sm:h-4 w-12 sm:w-16 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
          <span className="mx-1 sm:mx-2">/</span>
          <Skeleton className={`h-3 sm:h-4 w-16 sm:w-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
          <span className="mx-1 sm:mx-2">/</span>
          <Skeleton className={`h-3 sm:h-4 w-20 sm:w-32 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
        </div>

        {/* Main Content Skeleton - Stacked on mobile */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:gap-10 xl:gap-12">
          {/* Product Images Skeleton - Full width on mobile */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnails Skeleton - Hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex flex-col gap-2 w-12 sm:w-16">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
              ))}
            </div>

            {/* Main Image Skeleton */}
            <div className="relative w-full aspect-square sm:aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden">
              <Skeleton className={`w-full h-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />

              {/* Mobile-only indicators */}
              <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows - Hidden on mobile */}
              <Skeleton
                className={`hidden sm:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
              <Skeleton
                className={`hidden sm:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />

              {/* Wishlist Button */}
              <Skeleton
                className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                  theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
              />

              {/* Badges - Smaller on mobile */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                <Skeleton
                  className={`w-16 h-5 sm:w-20 sm:h-6 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                />
                <Skeleton
                  className={`w-12 h-5 sm:w-16 sm:h-6 rounded-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                />
              </div>
            </div>
          </div>

          {/* Product Info Skeleton - Full width on mobile */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
            {/* Title and Rating - Adjusted for mobile */}
            <div className="space-y-2">
              <Skeleton className={`h-6 sm:h-8 w-3/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex items-center gap-2">
                <Skeleton className={`h-4 w-20 sm:w-24 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
                <Skeleton className={`h-3 w-12 sm:w-16 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>

            {/* Price and Stock - Smaller on mobile */}
            <div className="space-y-1 sm:space-y-2">
              <Skeleton className={`h-6 sm:h-8 w-1/3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <Skeleton className={`h-3 sm:h-4 w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>

            {/* Description - Shorter on mobile */}
            <div className="space-y-2">
              <Skeleton className={`h-4 w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <Skeleton className={`h-4 w-5/6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <Skeleton className={`h-4 w-2/3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            </div>

            {/* Color Selection - Compact on mobile */}
            <div className="space-y-2">
              <Skeleton className={`h-3 sm:h-4 w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection - Scrollable on mobile */}
            <div className="space-y-2">
              <Skeleton className={`h-3 sm:h-4 w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex-shrink-0 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selection - Stacked on mobile */}
            <div className="space-y-2">
              <Skeleton className={`h-3 sm:h-4 w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Skeleton
                  className={`w-24 sm:w-32 h-8 sm:h-10 rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
                <Skeleton className={`h-3 sm:h-4 w-20 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
              </div>
            </div>

            {/* Add to Cart Button - Full width */}
            <Skeleton
              className={`h-10 sm:h-12 w-full rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
            />

            {/* Shipping Info - Stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`h-8 sm:h-10 w-full rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Tabs Skeleton - Simplified for mobile */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className={`h-5 sm:h-6 w-24 sm:w-32 flex-shrink-0 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
              />
            ))}
          </div>
          <div className="mt-4 sm:mt-6">
            <Skeleton className={`h-6 sm:h-8 w-1/3 mb-3 sm:mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[...Array(2)].map((_, index) => (
                <Skeleton
                  key={index}
                  className={`h-32 sm:h-40 w-full rounded-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
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
