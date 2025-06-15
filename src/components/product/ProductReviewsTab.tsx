import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, Review } from "@/types";

interface ProductReviewsTabProps {
  product: Product;
  reviews: Review[];
  id: string;
  theme: string;
}

function ProductReviewsTab({ product, reviews, id, theme }: ProductReviewsTabProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0 }}
      className="space-y-4 md:space-y-6 lg:space-y-8"
    >
      {/* Review Summary Card */}
      <motion.div
        className={`p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border ${
          theme === "dark" ? "bg-gray-800/90 border-gray-600" : "bg-white border-gray-200"
        }`}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <h3
          className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
        >
          Customer Reviews
        </h3>

        <div className="flex flex-col items-center gap-2 mb-4 md:flex-row md:justify-center md:gap-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 md:w-6 md:h-6 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : theme === "dark"
                    ? "text-gray-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className={`text-base md:text-lg font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-700"}`}>
            {(product.rating || 0).toFixed(1)} out of 5 • {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        <Button
          onClick={() => router.push(`/listing/${id}/reviews`)}
          size="sm"
          className={`w-full md:w-auto text-sm md:text-base px-4 py-2 md:px-6 md:py-3 ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          Write a Review
        </Button>
      </motion.div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`p-4 md:p-5 rounded-lg md:rounded-xl shadow-sm md:shadow-md text-center border ${
            theme === "dark" ? "bg-gray-800/90 border-gray-600" : "bg-white border-gray-200"
          }`}
        >
          <p className={`text-sm md:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            No reviews yet. Be the first to review this product!
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={`p-4 md:p-5 rounded-lg md:rounded-xl shadow-sm md:shadow-md border ${
                theme === "dark" ? "bg-gray-800/90 border-gray-600" : "bg-white border-gray-200"
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-start">
                <div className="flex-1">
                  <h4 className={`font-bold text-sm md:text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                    {review.user?.name || "Anonymous"}
                  </h4>
                  <div className="flex items-center mt-1 space-x-1">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : theme === "dark"
                            ? "text-gray-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className={`ml-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {review.comment && (
                <p
                  className={`mt-3 text-sm md:text-base leading-relaxed ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {review.comment}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default ProductReviewsTab;
