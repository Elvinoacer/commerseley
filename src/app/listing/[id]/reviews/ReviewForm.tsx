import { useReviewStore } from "@/store/useReviewStore";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment?: string;
  } | null;
  onCancel: () => void;
  onSubmit: (success: boolean) => void;
}

const ReviewForm = ({ productId, existingReview, onCancel, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { createReview, updateReview } = useReviewStore();
  const { data } = useSession();
  const { user } = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!user) {
      setError("You must be logged in to submit a review");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let success = false;

      if (existingReview) {
        success = await updateReview(existingReview.id, rating, comment || undefined);
      } else {
        const reviewId = await createReview(productId, rating, comment || undefined);
        success = !!reviewId;
      }

      if (!success) {
        throw new Error(`Failed to ${existingReview ? "update" : "create"} review`);
      }

      onSubmit(true);
    } catch (err: any) {
      setError(err.message || `Failed to ${existingReview ? "update" : "create"} review`);
      onSubmit(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      {error && (
        <div className="mb-3 p-2 sm:p-3 text-xs sm:text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 sm:mb-4">
          <label className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            Your Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
                <StarIcon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${
                    (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <label htmlFor="comment" className="block text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={3}
            placeholder="Share your thoughts about this product..."
            style={{
              minHeight: "100px",
              resize: "vertical",
            }}
          />
        </div>

        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-purple-600 dark:bg-purple-700 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
