"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { isProductInWishlist } from "@/lib/utils";
import { debounce } from "lodash";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import { fadeIn, staggerContainer } from "@/lib/utils";
import { motion } from "framer-motion";
import { Product, Review } from "@/types";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";

interface ProductDetailsContentProps {
  id: string;
  initialProduct: Product | null;
  initialReviews: Review[];
}

function ProductDetailsContent({ id, initialProduct, initialReviews }: ProductDetailsContentProps) {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);
  const [isWishlistedLocal, setIsWishlistedLocal] = useState(false);
  const [wishlistHighlight, setWishlistHighlight] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useSession();
  const { user } = data || {};
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
    getWishlist,
    toggleWishlist,
  } = useWishlistStore();
  const isWishlisted = isProductInWishlist(wishlist, id);

  // Fetch product if not provided initially
  useEffect(() => {
    if (!initialProduct) {
      const fetchProduct = async () => {
        try {
          const [productRes, reviewsRes] = await Promise.all([
            axios.get(`${API_ROUTES.PRODUCTS}/${id}`),
            axios.get(`${API_ROUTES.REVIEWS}/product/${id}`),
          ]);
          setProduct(productRes.data);
          setReviews(reviewsRes.data || []);
        } catch (error) {
          console.error("Failed to fetch product:", error);
          toast({
            title: "Failed to load product",
            variant: "destructive",
            className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, initialProduct, toast, theme]);

  // Sync wishlist status
  useEffect(() => {
    setIsWishlistedLocal(isWishlisted);
  }, [isWishlisted]);

  // Fetch wishlist for authenticated users
  useEffect(() => {
    if (user && !wishlist && !wishlistLoading) {
      startTransition(() => {
        getWishlist(1, 8);
      });
    }
  }, [user, wishlist, wishlistLoading, getWishlist]);

  // Warn on quantity exceeding stock
  useEffect(() => {
    if (product && quantity > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        variant: "destructive",
        className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
      });
    }
  }, [quantity, product?.stock, toast, theme]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const params = new URLSearchParams(searchParams.toString());
    if (!user) {
      params.set("callback", `/listing/${product.id}`);
      toast({
        title: "Please login to continue shopping!",
        className: theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800",
      });
      router.push(`/auth/login?${params.toString()}`);
      return;
    }

    let parsedColors;
    try {
      parsedColors = JSON.parse(product.colors as unknown as string);
    } catch (error) {
      console.error("Failed to parse colors:", error);
      toast({
        title: "Error adding to cart",
        description: "Invalid product color data",
        variant: "destructive",
        className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.isOnOffer && product.offerPrice ? product.offerPrice : product.price,
      image: product.images[0] || "/placeholder.jpg",
      color: parsedColors[selectedColor]?.name || "Default",
      size: selectedSize || product.sizes[0] || "Default",
      quantity,
    });

    toast({
      title: "Added to cart successfully!",
      description: `${product.name} (${selectedSize || product.sizes[0] || "Default"}, ${
        parsedColors[selectedColor]?.name || "Default"
      })`,
      className: theme === "dark" ? "bg-green-900 text-white" : "bg-green-100 text-green-800",
    });
  }, [product, user, selectedColor, selectedSize, quantity, searchParams, toast, router, addToCart, theme]);

  const handleToggleWishlist = useCallback(
    debounce(async (productId: string) => {
      if (!user) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("callback", `/listing/${id}`);
        toast({
          title: "Please login to manage your wishlist!",
          className: theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800",
        });
        router.push(`/auth/login?${params.toString()}`);
        return;
      }
      setIsWishlistToggling(true);
      const newWishlistedState = !isWishlistedLocal;

      try {
        const result = await toggleWishlist(productId);
        if (result.success) {
          setIsWishlistedLocal(newWishlistedState);
          setWishlistHighlight(true);
          setTimeout(() => setWishlistHighlight(false), 1000);
          await getWishlist(1, 8);
          toast({
            title: newWishlistedState ? "Added to wishlist" : "Removed from wishlist",
            description: `"${product?.name}" ${newWishlistedState ? "was added to" : "was removed from"} your wishlist`,
            className: theme === "dark" ? "bg-blue-900 text-white" : "bg-blue-100 text-blue-800",
          });
        } else {
          toast({
            title: "Wishlist update failed",
            description: result.message || "Please try again",
            variant: "destructive",
            className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
          });
        }
      } catch (error) {
        console.error("Wishlist toggle error:", error);
        toast({
          title: "Error updating wishlist",
          variant: "destructive",
          className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
        });
      } finally {
        setIsWishlistToggling(false);
      }
    }, 300),
    [user, isWishlistedLocal, product?.name, theme, toast, toggleWishlist, getWishlist, id, searchParams, router]
  );

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center p-6 rounded-lg shadow-lg max-w-sm w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">Product Not Found</h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  if (user && wishlistError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center p-6 rounded-lg shadow-lg max-w-sm w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">Error Loading Wishlist</h2>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">{wishlistError || "Failed to load wishlist."}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductBreadcrumb product={product} theme={theme} />
        <motion.div variants={staggerContainer} className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6">
          <div className="w-full lg:w-1/2">
            <ProductImages
              product={product}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              isWishlistToggling={isWishlistToggling || isPending}
              isWishlistedLocal={isWishlistedLocal}
              wishlistHighlight={wishlistHighlight}
              handleToggleWishlist={handleToggleWishlist}
              theme={theme}
              id={id}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <ProductInfo
              product={product}
              reviews={reviews}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              theme={theme}
            />
            {/* Description Section */}
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className={`${isDescriptionExpanded ? "" : "line-clamp-3"} transition-all duration-300`}>
                  {product.description || "No description available."}
                </p>
                {product.description && product.description.length > 150 && (
                  <button
                    onClick={toggleDescription}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 inline-block hover:underline"
                    aria-expanded={isDescriptionExpanded}
                  >
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mt-8">
          <ProductTabs product={product} reviews={reviews} id={id} theme={theme} />
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetailsContent;
