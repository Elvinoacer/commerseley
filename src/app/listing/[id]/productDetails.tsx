"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductStore } from "@/store/useProductStore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { Star, Heart, ChevronRight, ChevronLeft, Truck, Shield, CreditCard, Zap } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useReviewStore } from "@/store/useReviewStore";
import { motion, AnimatePresence } from "framer-motion";

interface Wishlist {
  id: string;
  userId: string;
  product: Product[];
}

interface SingleWishlistResponse {
  wishlist: Wishlist;
  message?: string;
  success?: boolean;
}

type WishlistResponse = Wishlist | SingleWishlistResponse;

function isProductInWishlist(
  wishlist: WishlistResponse[] | SingleWishlistResponse | null = null,
  productIdToCheck: string
): boolean {
  if (!wishlist) return false;

  const wishlistArray: Wishlist[] = Array.isArray(wishlist)
    ? wishlist.map((item) => ("wishlist" in item ? item.wishlist : item))
    : "wishlist" in wishlist
    ? [wishlist.wishlist]
    : [];

  if (wishlistArray.length === 0) return false;

  const wishlistEntry = wishlistArray[0];
  return wishlistEntry?.product?.some((product) => product?.id === productIdToCheck) ?? false;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

function ProductDetailsContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);
  const { getProductById, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthStore();
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
    getWishlist,
    toggleWishlist,
  } = useWishlistStore();
  const { reviews, isLoading: reviewsLoading, error: reviewsError, fetchReviewsByProduct } = useReviewStore();
  const isWishlisted = isProductInWishlist(wishlist, id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productDetails = await getProductById(id);
        if (productDetails) {
          setProduct(productDetails);
        } else {
          router.push("/404");
        }
        await fetchReviewsByProduct(id);
        if (user) {
          await getWishlist(1, 8);
        }
      } catch (error) {
        console.error("Error fetching product, reviews, or wishlist:", error);
        router.push("/404");
      }
    };

    fetchData();
  }, [id, getProductById, fetchReviewsByProduct, getWishlist, user, router]);

  useEffect(() => {
    if (product && quantity > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        variant: "destructive",
      });
    }
  }, [quantity, product, toast]);

  const handleAddToCart = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (!user) {
      params.set("callback", `/listing/${product!.id}`);
      toast({ title: "Please login to continue shopping!" });
      router.push("/auth/login");
      return;
    }

    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: product.colors[selectedColor].name,
        size: selectedSize,
        quantity: quantity,
      });

      toast({
        title: "Added to cart successfully!",
        description: `${product.name} (${selectedSize}, ${product.colors[selectedColor].name})`,
      });
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("callback", `/listing/${id}`);
      toast({ title: "Please login to manage your wishlist!" });
      router.push("/auth/login");
      return;
    }

    if (isWishlistToggling) return;

    setIsWishlistToggling(true);
    try {
      const result = await toggleWishlist(productId);
      if (result.success) {
        await getWishlist(1, 8);
        toast({
          title: result.message,
          description: `Product ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
        });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to update wishlist", variant: "destructive" });
      console.error("Wishlist error:", error);
    } finally {
      setIsWishlistToggling(false);
    }
  };

  if (!product || isLoading || reviewsLoading || wishlistLoading) return <ProductDetailsSkeleton />;

  if (reviewsError || wishlistError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Error Loading Product</h2>
          <p className="text-gray-600 mb-4">{reviewsError || wishlistError}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <motion.div variants={slideUp} className="flex items-center text-sm text-gray-500 mb-6">
          <span className="hover:text-black cursor-pointer">Home</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-black cursor-pointer">{product.category.name}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-black font-medium">{product.name}</span>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <motion.div variants={staggerItem} className="lg:w-1/2 flex flex-col-reverse lg:flex-row gap-6">
            {/* Thumbnails */}
            <motion.div
              className="hidden lg:flex flex-col gap-3 w-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.images.map((image: string, index: number) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`relative overflow-hidden rounded-lg aspect-square transition-all ${
                    selectedImage === index ? "ring-2 ring-indigo-600 shadow-md" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* Main Image */}
            <motion.div
              className="relative w-full aspect-[3/4] bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </motion.button>
                </>
              )}

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleToggleWishlist(id)}
                className={`absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors ${
                  isWishlistToggling ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isWishlistToggling}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                />
              </motion.button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md"
                  >
                    <Zap className="w-3 h-3 mr-1" /> Featured
                  </motion.span>
                )}
                {product.stock === 0 && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
                  >
                    Sold Out
                  </motion.span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md"
                  >
                    Low Stock
                  </motion.span>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div variants={staggerItem} className="lg:w-1/2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
                  </div>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{product.stock} in stock</span>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">Kes {product.price.toFixed(2)}</span>
                {product.isOnOffer && product.offerPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">Kes {product.offerPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>
            </motion.div>

            {/* Color Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-lg font-medium mb-3 text-gray-800">
                Color: <span className="font-normal">{product.colors[selectedColor].name}</span>
              </h3>
              <div className="flex gap-3">
                {JSON.parse(product.colors).map((color: Color, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm ${
                      selectedColor === index ? "border-indigo-600 scale-110" : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(index)}
                    title={color.name}
                  />
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-12 w-12 text-base rounded-lg transition-all ${
                      selectedSize === size
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 text-xl hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 text-xl hover:bg-gray-100"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
                {product.stock < 10 && (
                  <span className="text-sm text-red-600">Only {product.stock} left in stock!</span>
                )}
              </div>
            </motion.div>

            {/* Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              {(quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0) && (
                <p className="text-red-600 mb-2">Select all fields in order to proceed</p>
              )}
              <Button
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg shadow-lg"
                onClick={handleAddToCart}
                disabled={quantity > product.stock || quantity <= 0 || !selectedSize || selectedColor < 0}
              >
                ADD TO CART
              </Button>
            </motion.div>

            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <Truck className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">2-year warranty</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">Secure payment</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent gap-6">
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent py-4 text-gray-700 hover:text-gray-900"
              >
                PRODUCT DETAILS
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent py-4 text-gray-700 hover:text-gray-900"
              >
                REVIEWS ({reviews.length})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent py-4 text-gray-700 hover:text-gray-900"
              >
                SHIPPING & RETURNS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="prose max-w-none bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">About this product</h3>
                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Features</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Slim fit design</li>
                      <li>Premium material</li>
                      <li>Stretch technology for comfort</li>
                      <li>Reinforced stitching</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Specifications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <span className="font-medium">Brand:</span> {product.brand}
                      </li>
                      <li>
                        <span className="font-medium">Category:</span> {product.category.name}
                      </li>
                      <li>
                        <span className="font-medium">Gender:</span> {product.gender}
                      </li>
                      <li>
                        <span className="font-medium">Material:</span> 98% Cotton, 2% Elastane
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-8"
              >
                <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Customer Reviews</h3>
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {(product.rating || 0).toFixed(1)} out of 5 ({reviews.length} reviews)
                    </span>
                  </div>
                  <Button
                    onClick={() => router.push(`/listing/${id}/reviews`)}
                    className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                  >
                    Write a Review
                  </Button>
                </div>

                {reviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white p-6 rounded-xl shadow-md text-center"
                  >
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
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
                        className="bg-white p-6 rounded-xl shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{review.user?.name || "Anonymous"}</h4>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {review.comment && <p className="mt-4 text-gray-700">{review.comment}</p>}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="prose max-w-none bg-white p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Delivery Options</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Truck className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
                        <span>Free standard shipping on all orders (3-5 business days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
                        <span>Express shipping available at checkout (1-2 business days)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Returns Policy</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
                        <span>30-day easy returns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CreditCard className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
                        <span>Full refund upon return</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ProductDetailsContent;
