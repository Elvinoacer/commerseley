"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { useReviewStore } from "@/store/useReviewStore";
import { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BadgePercent, Gem, PencilIcon, StarIcon, TrashIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";

const ReviewPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: productId } = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const { data } = useSession();
  const { user } = data || {};
  const { reviews, isLoading: isReviewLoading, fetchReviewsByProduct } = useReviewStore();
  const { getProductById } = useProductStore();

  const userReview = user ? reviews?.find((review) => review?.user?.id === user.id) : null;

  useEffect(() => {
    if (!productId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const product = await getProductById(productId);
        await fetchReviewsByProduct(productId);
        setProduct(product);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, getProductById, fetchReviewsByProduct]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const success = await useReviewStore.getState().deleteReview(reviewId);
      if (!success) {
        throw new Error("Failed to delete review");
      }
      fetchReviewsByProduct(productId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId);
    setShowReviewForm(true);
  };

  if (loading || isReviewLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 dark:border-purple-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-red-500 dark:text-red-400 mb-4">
            <XIcon className="h-10 w-10 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Error Loading Reviews</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const parseColors = (colors: string | { hex: string; name: string }[]) => {
    if (Array.isArray(colors)) return colors;
    try {
      const parsed = JSON.parse(colors);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      {/* Optimized animated background for mobile */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, i % 2 ? 50 : -50, 0],
              y: [0, i % 2 ? -30 : 60, 0],
              scale: [1, i % 2 ? 1.1 : 0.9, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
            className={`absolute ${
              i === 0
                ? "top-1/4 left-1/4 w-48 h-48 bg-blue-200 dark:bg-blue-900/30"
                : i === 1
                ? "top-1/3 right-1/4 w-56 h-56 bg-purple-200 dark:bg-purple-900/30"
                : "bottom-1/4 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-900/30"
            } rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10`}
          ></motion.div>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back button - optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 sm:mb-6"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back</span>
          </Button>
        </motion.div>

        {/* Header - responsive typography */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3"
          >
            Customer Reviews
          </motion.h1>

          {product && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center mb-1 sm:mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      "h-5 w-5 sm:h-6 sm:w-6",
                      product.rating && star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                ))}
                <span className="ml-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                  {product.rating ? product.rating.toFixed(1) : "No ratings"}
                  <span className="text-gray-500 dark:text-gray-400 ml-1">({reviews.length})</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Summary Card - full width on mobile */}
          {product && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full lg:w-1/4 lg:min-w-[280px]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden h-fit lg:sticky lg:top-6 border border-gray-200 dark:border-gray-700">
                <div className="relative aspect-square w-full">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  />
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">{product.brand}</p>

                  {/* Price display - responsive */}
                  <div className="mb-3 sm:mb-4">
                    {product?.isOnOffer ? (
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 dark:text-red-500">
                          Kes {product.offerPrice?.toFixed(2)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                          Kes {product.price.toFixed(2)}
                        </span>
                        <Badge variant="destructive" className="text-xs sm:text-sm">
                          <BadgePercent className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Sale
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        Kes {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Product attributes - responsive */}
                  <div className="space-y-2 sm:space-y-3">
                    {product.isFeatured && (
                      <Badge className="w-full justify-center text-xs sm:text-sm py-1 dark:bg-purple-900 dark:text-purple-100">
                        <Gem className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Featured
                      </Badge>
                    )}

                    {product.gender && (
                      <Badge
                        variant="outline"
                        className="w-full justify-center text-xs sm:text-sm py-1 dark:border-gray-600 dark:text-gray-300"
                      >
                        {product.gender}
                      </Badge>
                    )}

                    <div className="flex flex-wrap gap-1 items-center">
                      {parseColors(product.colors)
                        .slice(0, 3)
                        .map((color, i) => (
                          <div
                            key={i}
                            className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-xs"
                            style={{ backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}` }}
                            title={color.name}
                          />
                        ))}
                      {parseColors(product.colors).length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{parseColors(product.colors).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Section - full width on mobile */}
          <div className="w-full lg:w-3/4 space-y-4 sm:space-y-6">
            {/* Add Review Card - simplified for mobile */}
            {!userReview && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 dark:text-white">
                  Share Your Experience
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  {reviews.length === 0 ? "Be the first to review!" : "How would you rate this product?"}
                </p>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  size="sm"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
                >
                  Write a Review
                </Button>
              </motion.div>
            )}

            {/* Review Form - responsive */}
            {showReviewForm && (
              <ReviewForm
                productId={productId}
                existingReview={editingReviewId ? reviews.find((r) => r.id === editingReviewId) : null}
                onCancel={() => {
                  setShowReviewForm(false);
                  setEditingReviewId(null);
                }}
                onSubmit={(success) => {
                  if (success) {
                    setShowReviewForm(false);
                    setEditingReviewId(null);
                    fetchReviewsByProduct(productId);
                  }
                }}
              />
            )}

            {/* Reviews List - optimized for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">Customer Reviews</h3>

              {reviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md text-center border border-gray-100 dark:border-gray-700"
                >
                  <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 mb-3 sm:mb-4">
                    <StarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 dark:text-blue-500" />
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                    No Reviews Yet
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                    This product hasn't been reviewed yet.
                  </p>
                  {user && !userReview && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700"
                    >
                      Write First Review
                    </Button>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium sm:font-semibold text-base sm:text-lg dark:text-white">
                            {review.user.name}
                          </h4>
                          <div className="flex flex-wrap items-center mt-1 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={cn(
                                  "h-4 w-4 sm:h-5 sm:w-5",
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                )}
                              />
                            ))}
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {(user?.id === review?.user.id || user?.role === "SUPER_ADMIN") && (
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button
                              onClick={() => handleEditReview(review.id)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteReview(review.id)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {review.comment && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300"
                        >
                          {review.comment}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
