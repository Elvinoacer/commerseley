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

  console.log("wishlist",wishlist)

  // Fetch product if not provided initially
  useEffect(() => {
    if (!initialProduct) {
      const fetchProduct = async () => {
        try {
          const [productRes, reviewsRes] = await Promise.all([
            axios.get(`${API_ROUTES.PRODUCTS}/${id}`),
            axios.get(`${API_ROUTES.REVIEWS}/product/${id}`),
          ]);
          console.log(productRes);
          setProduct(productRes.data);
          setReviews(reviewsRes.data || []);
        } catch (error) {
          console.error("Failed to fetch product:", error);
          toast({
            title: "Failed to load product",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, initialProduct, toast]);

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
  }, [user]); // Simplified dependencies

  // Warn on quantity exceeding stock
  useEffect(() => {
    if (product && quantity > product.stock) {
      toast({
        title: "Quantity exceeds available stock",
        variant: "destructive",
        className: theme === "dark" ? "bg-red-900 text-white" : "bg-red-100 text-red-800",
      });
    }
  }, [quantity, product?.stock]); // Only depend on quantity and stock

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

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: JSON.parse(product.colors)[selectedColor].name,
      size: selectedSize,
      quantity: quantity,
    });

    toast({
      title: "Added to cart successfully!",
      description: `${product.name} (${selectedSize}, ${JSON.parse(product.colors)[selectedColor].name})`,
      className: theme === "dark" ? "bg-green-900 text-white" : "bg-green-100 text-green-800",
    });
  }, [product, user, selectedColor, selectedSize, quantity, searchParams, toast, router, addToCart]);

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

          // Immediately update the wishlist state
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
          });
        }
      } catch (error) {
        console.error("Wishlist toggle error:", error);
        toast({
          title: "Error updating wishlist",
          variant: "destructive",
        });
      } finally {
        setIsWishlistToggling(false);
      }
    }, 300),
    [user, isWishlistedLocal, product?.name, theme, toast, toggleWishlist, getWishlist]
  );

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-sm mb-4">The product you're looking for doesn't exist.</p>
          <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (user && wishlistError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center p-6 rounded-xl shadow-lg max-w-md border">
          <h2 className="text-xl font-bold mb-2">Error Loading Wishlist</h2>
          <p className="text-sm mb-4">{wishlistError || "Failed to load wishlist."}</p>
          <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-4 py-2 rounded-md">
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
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-800 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <ProductBreadcrumb product={product} theme={theme} />
        <motion.div variants={staggerContainer} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
        </motion.div>
        <ProductTabs product={product} reviews={reviews} id={id} theme={theme} />
      </div>
    </motion.div>
  );
}

export default ProductDetailsContent;
