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
      className="bg-white p-6 rounded-xl shadow-md overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-4">{existingReview ? "Edit Your Review" : "Write a Review"}</h3>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-8 w-8 ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="Share your thoughts about this product..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
