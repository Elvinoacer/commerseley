"use client";
import { Product } from "@/types";
import { motion } from "framer-motion";

interface ProductDetailsTabProps {
  product: Product;
  theme: string;
}

function ProductDetailsTab({ product, theme }: ProductDetailsTabProps) {
  // Parse JSON fields safely
  const colors = product.colors ? JSON.parse(product.colors) : [];
  const skus = product.skus ? JSON.parse(product.skus) : [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0 }}
      className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border ${
        theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        About this product
      </h3>

      {/* Improved product description with better wrapping */}
      <p
        className={`text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-relaxed sm:leading-normal ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {product.description}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5">
        {/* Product Specifications */}
        <div className={`p-3 sm:p-4 rounded-md ${theme === "dark" ? "bg-gray-800/60" : "bg-gray-50"}`}>
          <h4
            className={`font-medium mb-2 sm:mb-3 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Specifications
          </h4>
          <ul className={`space-y-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <li className="flex justify-between">
              <span className="font-medium">Brand:</span>
              <span className="text-right">{product.brand || "Not specified"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Category:</span>
              <span className="text-right">{product.category?.name || "Not specified"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span className="text-right capitalize">{product.gender || "Unisex"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Rating:</span>
              <span className="text-right">
                {product.rating || 0}/5 ({product.reviews?.length || 0} reviews)
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Stock:</span>
              <span className="text-right">{product.stock} available</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Sold:</span>
              <span className="text-right">{product.soldCount || 0} units</span>
            </li>
          </ul>
        </div>

        {/* Pricing & Availability */}
        <div className={`p-3 sm:p-4 rounded-md ${theme === "dark" ? "bg-gray-800/60" : "bg-gray-50"}`}>
          <h4
            className={`font-medium mb-2 sm:mb-3 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Pricing
          </h4>
          <ul className={`space-y-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <li className="flex justify-between">
              <span className="font-medium">Price:</span>
              <span className="text-right">Kes {product.price?.toFixed(2)}</span>
            </li>
            {product.isOnOffer && (
              <li className="flex justify-between">
                <span className="font-medium">Offer Price:</span>
                <span className="text-right text-green-500">Kes {product.offerPrice?.toFixed(2)}</span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={`text-right ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Featured:</span>
              <span className="text-right">{product.isFeatured ? "Yes" : "No"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">On Offer:</span>
              <span className="text-right">{product.isOnOffer ? "Yes" : "No"}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Updated:</span>
              <span className="text-right">{formatDate(product.updatedAt)}</span>
            </li>
          </ul>
        </div>

        {/* Sizes & Colors */}
        <div className={`p-3 sm:p-4 rounded-md ${theme === "dark" ? "bg-gray-800/60" : "bg-gray-50"}`}>
          <h4
            className={`font-medium mb-2 sm:mb-3 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Variants
          </h4>
          <div className="space-y-3">
            <div>
              <p className={`text-xs sm:text-sm mb-1 sm:mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Available Sizes:
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {product.sizes?.map((size, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                      theme === "dark" ? "bg-indigo-900/50 text-indigo-200" : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            {colors.length > 0 && (
              <div>
                <p
                  className={`text-xs sm:text-sm mb-1 sm:mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  Available Colors:
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {colors.map((color: any, index: number) => (
                    <span
                      key={index}
                      className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                        theme === "dark" ? "bg-purple-900/50 text-purple-200" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {color.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className={`p-3 sm:p-4 rounded-md ${theme === "dark" ? "bg-gray-800/60" : "bg-gray-50"}`}>
          <h4
            className={`font-medium mb-2 sm:mb-3 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Additional Info
          </h4>
          <ul className={`space-y-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            {skus.length > 0 && (
              <div>
                <p
                  className={`text-xs sm:text-sm mb-1 sm:mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  SKUs:
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {skus.map((sku: any, index: number) => (
                    <span
                      key={index}
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-mono ${
                        theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {sku.key}: {sku.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <li className="flex justify-between">
              <span className="font-medium">Product ID:</span>
              <span className="text-right font-mono text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[150px]">
                {product.id}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Created:</span>
              <span className="text-right">{formatDate(product.createdAt)}</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetailsTab;
