"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/useCartStore";
import { useCategoryStore } from "@/store/useCategories";
import { useProductStore } from "@/store/useProductStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { sizes as predefinedSizes } from "@/utils/config";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, SlidersHorizontal, Star, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  categoryId: string;
  category: { id: string; name: string };
  gender: string;
  sizes: string[];
  colors: { hex: string; name: string }[];
  price: number;
  stock: number;
  soldCount: number;
  rating?: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  isOnOffer?: boolean;
  offerPrice?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user?: { id: string; name: string };
  }>;
}

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
  wishlistData: WishlistResponse[] | SingleWishlistResponse | undefined | null,
  productIdToCheck: string
): boolean {
  if (!wishlistData) return false;

  const wishlistArray: Wishlist[] = Array.isArray(wishlistData)
    ? wishlistData.map((item) => ("wishlist" in item ? item.wishlist : item))
    : "wishlist" in wishlistData
    ? [wishlistData.wishlist]
    : [wishlistData as Wishlist];

  if (wishlistArray.length === 0 || !wishlistArray[0]?.product) return false;

  return wishlistArray[0].product.some((product) => product?.id === productIdToCheck);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function ProductListingPage() {
  const { theme } = useTheme();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [togglingWishlist, setTogglingWishlist] = useState<{
    [key: string]: boolean;
  }>({});

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const { data } = useSession();
  const { user } = data || {};
  const { addToCart } = useCartStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
    getWishlist,
    toggleWishlist,
  } = useWishlistStore();
  const { products, currentPage, totalProducts, isLoading, error, fetchProductsForClient, hasMore } = useProductStore();

  useEffect(() => {
    fetchCategories();
    if (user) {
      getWishlist();
    }
  }, [fetchCategories, getWishlist, user]);

  const fetchProductsCallback = useCallback(
    async (isAppending = false) => {
      if (isFetchingRef.current || (isAppending && !hasMore)) return;

      isFetchingRef.current = true;
      try {
        await fetchProductsForClient({
          page: isAppending ? currentPage + 1 : 1,
          limit: 12,
          categories: selectedCategories,
          sizes: selectedSizes,
          colors: selectedColors,
          brands: selectedBrands,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
          sortOrder,
          append: isAppending,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({
          title: "Error fetching products",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        isFetchingRef.current = false;
      }
    },
    [
      fetchProductsForClient,
      selectedCategories,
      selectedSizes,
      selectedColors,
      selectedBrands,
      priceRange,
      sortBy,
      sortOrder,
      currentPage,
      hasMore,
      toast,
    ]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isFetchingRef.current && !isLoading) {
        fetchProductsCallback(true);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, options);

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchProductsCallback, hasMore, isLoading]);

  useLayoutEffect(() => {
    const syncHeight = () => {
      if (window.innerWidth >= 1024 && filterSectionRef.current && productGridRef.current) {
        const filterHeight = filterSectionRef.current.getBoundingClientRect().height;
        productGridRef.current.style.minHeight = `${filterHeight}px`;
      } else if (productGridRef.current) {
        productGridRef.current.style.minHeight = "auto";
      }
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [products]);

  useEffect(() => {
    fetchProductsCallback(false);
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedBrands,
    priceRange,
    sortBy,
    sortOrder,
    fetchProductsCallback,
  ]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const handleToggleFilter = (filterType: "categories" | "sizes" | "brands" | "colors", value: string) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };

    setterMap[filterType]((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleAddToCart = (product: Product) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!user) {
      params.set("callback", `/listing/${product.id}`);
      toast({ title: "Please login to continue shopping!" });
      router.push("/auth/login?" + params.toString());
      return;
    }

    if (product) {
      addToCart({
        productId: product.id,
        name: product.name || "Unknown Product",
        price: product.isOnOffer && product.offerPrice ? product.offerPrice : product.price || 0,
        image: product.images?.[0] || "/placeholder.jpg",
        color: product.colors?.[0]?.name || "Default",
        size: product.sizes?.[0] || "Default",
        quantity: 1,
      });

      toast({
        title: "Added to cart successfully!",
        description: `${product.name} added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("callback", `/listing`);
      toast({ title: "Please login to manage your wishlist!" });
      router.push("/auth/login?" + params.toString());
      return;
    }

    if (togglingWishlist[productId]) return;

    setTogglingWishlist((prev) => ({ ...prev, [productId]: true }));
    try {
      const result = await toggleWishlist(productId);
      if (result.success !== false) {
        await getWishlist();
        toast({
          title: result.message || "Wishlist updated!",
        });
      } else {
        toast({
          title: result.message || "Failed to update wishlist",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ title: "Failed to update wishlist", variant: "destructive" });
      console.error("Wishlist error:", error);
    } finally {
      setTogglingWishlist((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const FilterSection = () => {
    return (
      <motion.div
        ref={filterSectionRef}
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading && !categories.length ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg p-4"
                style={{
                  background: theme === "dark" ? "rgba(31, 41, 55, 0.5)" : "rgba(224, 231, 255, 0.5)",
                }}
              >
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"}`}>
              <h3 className={`mb-3 font-semibold ${theme === "dark" ? "text-white" : "text-indigo-700"}`}>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleToggleFilter("categories", category.id)}
                      id={`cat-${category.id}`}
                      className={theme === "dark" ? "border-gray-600" : ""}
                    />
                    <Label
                      htmlFor={`cat-${category.id}`}
                      className={`ml-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"}`}>
              <h3 className={`mb-3 font-semibold ${theme === "dark" ? "text-white" : "text-indigo-700"}`}>Size</h3>
              <div className="flex flex-wrap gap-2">
                {predefinedSizes.map((sizeItem) => (
                  <motion.button
                    key={sizeItem}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleFilter("sizes", sizeItem)}
                    className={`h-8 w-8 rounded-md text-sm font-medium transition-all ${
                      selectedSizes.includes(sizeItem)
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {sizeItem}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"}`}>
              <h3 className={`mb-3 font-semibold ${theme === "dark" ? "text-white" : "text-indigo-700"}`}>Colors</h3>
              <div className="flex flex-wrap gap-2">
                {products
                  .reduce((acc: string[], product) => {
                    (JSON.parse(product.colors) || []).forEach((color) => {
                      if (!acc.includes(color.hex)) acc.push(color.hex);
                    });
                    return acc;
                  }, [])
                  .slice(0, 12)
                  .map((colorHex) => (
                    <motion.button
                      key={colorHex}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-6 h-6 rounded-full shadow-sm transition-transform ${
                        selectedColors.includes(colorHex) ? "ring-2 ring-offset-2 ring-indigo-500" : ""
                      } ${theme === "dark" ? "border border-gray-600" : ""}`}
                      style={{ backgroundColor: colorHex }}
                      onClick={() => handleToggleFilter("colors", colorHex)}
                    />
                  ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"}`}>
              <h3 className={`mb-3 font-semibold ${theme === "dark" ? "text-white" : "text-indigo-700"}`}>
                Price Range
              </h3>
              <Slider
                defaultValue={[0, 100000]}
                max={100000}
                step={100}
                className="w-full"
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div
                className={`flex justify-between mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                <span>KES {priceRange[0].toLocaleString()}</span>
                <span>KES {priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen  ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Banner */}
      <motion.div
        className="relative h-64 sm:h-80 md:h-96 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="https://i.pinimg.com/736x/92/bb/a3/92bba38a680b10ef7110e94841c85208.jpg"
          alt="Listing Page Banner"
          className="w-full h-full object-cover absolute"
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-900/70 to-purple-900/70"
              : "bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
          }`}
        ></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Hot Collection</h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              Discover our latest curated collection of premium products.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className={`text-xl sm:text-2xl md:text-3xl font-semibold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-gray-300"
                : "bg-gradient-to-r from-indigo-600 to-purple-600"
            }`}
          >
            All Products ({totalProducts > 0 ? totalProducts.toLocaleString() : "Loading..."})
          </motion.h2>

          <motion.div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto" variants={itemVariants}>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`lg:hidden ${theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`w-[90vw] max-h-[80vh] overflow-y-auto max-w-md rounded-xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <DialogHeader>
                  <DialogTitle className={theme === "dark" ? "text-white" : "text-gray-900"}>Filters</DialogTitle>
                </DialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange} name="sort">
              <SelectTrigger
                className={`w-full sm:w-48 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-300" : ""}`}
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className={theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-300" : ""}>
                <SelectItem value="isFeatured-desc">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt-desc">Sort by: Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Sort by: Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters - Desktop */}
          <motion.div
            className="hidden lg:block w-full lg:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FilterSection />
          </motion.div>

          {/* Products Grid */}
          <motion.div
            ref={productGridRef}
            className="flex-1 min-h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 sm:p-4">
              {isLoading && products.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-4 animate-pulse ${theme === "dark" ? "bg-gray-800/50" : "bg-white/80"}`}
                    >
                      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error || wishlistError ? (
                <motion.div className="text-center py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div
                    className={`p-4 rounded-lg inline-block ${
                      theme === "dark" ? "bg-red-900/50 text-red-300" : "bg-red-50 text-red-600"
                    }`}
                  >
                    Error: {error || wishlistError}
                  </div>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div
                    className={`p-6 rounded-xl inline-block ${theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"}`}
                  >
                    <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      No products found matching your filters.
                    </p>
                    <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Try adjusting your filter criteria.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                    layout
                  >
                    <AnimatePresence>
                      {products.map((productItem) => {
                        const isWishlisted = isProductInWishlist(wishlist, productItem.id);
                        return (
                          <motion.div
                            key={productItem.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className={`group relative rounded-xl overflow-hidden shadow-md transition-all duration-300 flex flex-col ${
                              theme === "dark"
                                ? "bg-gray-800 border-gray-700 hover:shadow-white/10"
                                : "bg-white border-gray-100 hover:shadow-gray-300/30"
                            }`}
                            whileHover={{ y: -4 }}
                          >
                            {/* Product Image */}
                            <motion.div
                              onClick={() => router.push(`/listing/${productItem.id}`)}
                              className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <img
                                src={productItem.images?.[0] || "/placeholder.jpg"}
                                alt={productItem.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/listing/${productItem.id}`);
                                  }}
                                  className={`flex items-center gap-1 shadow-lg ${
                                    theme === "dark"
                                      ? "bg-gray-800 text-white hover:bg-gray-700"
                                      : "bg-white text-black hover:bg-gray-100"
                                  }`}
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4" /> Quick View
                                </Button>
                              </div>
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {productItem.isFeatured && (
                                  <motion.span
                                    className={`text-xs px-2 py-1 rounded-full flex items-center shadow-md ${
                                      theme === "dark"
                                        ? "bg-gradient-to-r from-purple-700 to-pink-600 text-white"
                                        : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                                    }`}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Zap className="w-3 h-3 mr-1" /> Featured
                                  </motion.span>
                                )}
                                {productItem.stock === 0 && (
                                  <motion.span
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    Sold Out
                                  </motion.span>
                                )}
                                {productItem.stock > 0 && productItem.stock <= 5 && (
                                  <motion.span
                                    className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    Low Stock
                                  </motion.span>
                                )}
                              </div>
                            </motion.div>

                            {/* Product Info */}
                            <div className="p-4 pt-2 flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-1">
                                <h3
                                  onClick={() => router.push(`/listing/${productItem.id}`)}
                                  className={`font-bold text-sm sm:text-md lg:text-lg transition-colors cursor-pointer line-clamp-2 ${
                                    theme === "dark"
                                      ? "text-white hover:text-indigo-400"
                                      : "text-gray-900 hover:text-indigo-600"
                                  }`}
                                  title={productItem.name}
                                >
                                  {productItem.name}
                                </h3>
                                <button
                                  onClick={() => handleToggleWishlist(productItem.id)}
                                  className={`transition-colors p-1 -mr-1 ${
                                    isWishlisted
                                      ? "text-red-500 hover:text-red-600"
                                      : theme === "dark"
                                      ? "text-gray-400 hover:text-red-500"
                                      : "text-gray-500 hover:text-red-500"
                                  }`}
                                  disabled={togglingWishlist[productItem.id]}
                                  aria-label="Toggle Wishlist"
                                >
                                  <Heart
                                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""} ${
                                      togglingWishlist[productItem.id] ? "opacity-50 animate-pulse" : ""
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(productItem.rating || 0)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : theme === "dark"
                                          ? "text-gray-600"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span
                                  className={`text-xs ml-1.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  ({productItem.reviews?.length || 0} reviews)
                                </span>
                              </div>

                              {/* Description */}
                              <p
                                className={`text-xs sm:text-sm line-clamp-2 mb-3 flex-grow min-h-[40px] ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {productItem.description || "No description available."}
                              </p>

                              {/* Price and Colors */}
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span
                                    className={`font-semibold text-base sm:text-lg ${
                                      theme === "dark" ? "text-indigo-400" : "text-indigo-700"
                                    }`}
                                  >
                                    KES{" "}
                                    {(productItem.isOnOffer && productItem.offerPrice
                                      ? productItem.offerPrice
                                      : productItem.price || 0
                                    ).toLocaleString()}
                                  </span>
                                  {productItem.isOnOffer && productItem.offerPrice && (
                                    <span
                                      className={`text-xs line-through ml-1 ${
                                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                                      }`}
                                    >
                                      KES {(productItem.price || 0).toLocaleString()}
                                    </span>
                                  )}
                                  {productItem.stock > 0 && (
                                    <span
                                      className={`text-xs ml-2 block sm:inline ${
                                        productItem.stock <= 5 ? "text-yellow-500" : "text-green-600"
                                      }`}
                                    >
                                      {productItem.stock} in stock
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {(JSON.parse(productItem.colors) || []).slice(0, 3).map((colorItem, index) => (
                                    <motion.div
                                      key={index}
                                      className={`w-4 h-4 rounded-full shadow-sm ${
                                        theme === "dark" ? "border border-gray-600" : "border border-gray-300"
                                      }`}
                                      style={{ backgroundColor: colorItem.hex }}
                                      title={colorItem.name}
                                      whileHover={{ scale: 1.2 }}
                                    />
                                  ))}
                                  {productItem.colors && productItem.colors.length > 3 && (
                                    <div
                                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
                                        theme === "dark"
                                          ? "bg-gray-600 border border-gray-500 text-gray-300"
                                          : "bg-gray-200 border border-gray-300 text-gray-600"
                                      }`}
                                    >
                                      +{productItem.colors.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              <Button
                                onClick={() => handleAddToCart(productItem)}
                                className={`w-full mt-auto text-sm sm:text-base ${
                                  productItem.stock === 0
                                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                                    : theme === "dark"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                }`}
                                disabled={productItem.stock === 0}
                              >
                                {productItem.stock === 0 ? (
                                  "Out of Stock"
                                ) : (
                                  <>
                                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                                  </>
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* Infinite Scroll Loader */}
                  <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
                    {isLoading && products.length > 0 && (
                      <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                          Loading more products...
                        </span>
                      </motion.div>
                    )}
                    {!hasMore && products.length > 0 && (
                      <motion.div className="text-center py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div
                          className={`p-4 rounded-lg inline-block ${
                            theme === "dark" ? "bg-gray-800/50" : "bg-indigo-50/50"
                          }`}
                        >
                          <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                            You've reached the end of the product list.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductListingPage;
