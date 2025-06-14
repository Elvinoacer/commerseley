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
      className="space-y-6 sm:space-y-8"
    >
      <div
        className={`p-4 sm:p-6 rounded-xl shadow-md border ${
          theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <h3 className={`text-lg sm:text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Customer Reviews
        </h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 sm:w-6 h-5 sm:h-6 ${
                  i < Math.floor(product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : theme === "dark"
                    ? "text-gray-600"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className={`text-base sm:text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
            {(product.rating || 0).toFixed(0)} out of {reviews.length} reviews
          </span>
        </div>
        <Button
          onClick={() => router.push(`/listing/${id}/reviews`)}
          className={`mt-4 sm:mt-6 text-sm sm:text-base ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          Write a Review
        </Button>
      </div>

      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`p-4 sm:p-6 rounded-xl shadow-md text-center border ${
            theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white border-gray-200"
          }`}
        >
          <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            No reviews yet. Be the first to review this product!
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0 }}
              className={`p-4 sm:p-6 rounded-xl shadow-md border ${
                theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-bold text-sm sm:text-base ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                    {review.user?.name || "Anonymous"}
                  </h4>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 sm:h-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : theme === "dark"
                            ? "text-gray-600"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className={`mt-4 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
