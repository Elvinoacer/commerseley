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
  const { user } = data;
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
      fetchReviewsByProduct(productId); // Refresh reviews after deletion
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-red-500 mb-4">
            <XIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Reviews</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Helper function to parse colors
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        ></motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Product
          </Button>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
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
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      "h-7 w-7",
                      product.rating && star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {product.rating ? product.rating.toFixed(1) : "No ratings yet"}
                  <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product Summary Card */}
          {product && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-6">
                <div className="relative aspect-square w-full">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.brand}</p>

                  {/* Price display */}
                  <div className="mb-4">
                    {product?.isOnOffer ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-600">Kes {product.offerPrice?.toFixed(2)}</span>
                        <span className="text-gray-500 line-through">Kes {product.price.toFixed(2)}</span>
                        <Badge variant="destructive" className="ml-2">
                          <BadgePercent className="h-4 w-4 mr-1" /> Sale
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">Kes {product.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Product attributes */}
                  <div className="space-y-3">
                    {product.isFeatured && (
                      <Badge className="w-full justify-center">
                        <Gem className="h-4 w-4 mr-2" /> Featured Product
                      </Badge>
                    )}

                    {product.gender && (
                      <Badge variant="outline" className="w-full justify-center">
                        {product.gender}
                      </Badge>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {parseColors(product.colors)
                        .slice(0, 3)
                        .map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border border-gray-200 shadow-xs"
                            style={{ backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}` }}
                            title={color.name}
                          />
                        ))}
                      {parseColors(product.colors).length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{parseColors(product.colors).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Add Review Card */}
            {!userReview && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
                <p className="text-gray-600 mb-4">
                  {reviews.length === 0 ? "Be the first to review this product!" : "How would you rate this product?"}
                </p>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Write a Review
                </Button>
              </motion.div>
            )}

            {/* Review Form */}
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

            {/* Reviews List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-gray-800">Customer Reviews</h3>

              {reviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-white p-8 rounded-xl shadow-md text-center"
                >
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                    <StarIcon className="h-8 w-8 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                  <p className="text-gray-600 mb-4">
                    This product hasn't been reviewed yet. Be the first to share your thoughts!
                  </p>
                  {user && !userReview && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                      className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{review.user.name}</h4>
                          <div className="flex items-center mt-1 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={cn(
                                  "h-5 w-5",
                                  star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                )}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {(user?.id === review?.user.id || user?.role === "SUPER_ADMIN") && (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEditReview(review.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-600"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteReview(review.id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {review.comment && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 text-gray-700"
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
