"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useCategoryStore } from "@/store/useCategories";
import { useProductStore } from "@/store/useProductStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { sizes as predefinedSizes } from "@/utils/config";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Eye,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return wishlistArray[0].product.some(
    (product) => product?.id === productIdToCheck
  );
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
    },
  },
};

function ProductListingPage() {
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
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
    getWishlist,
    toggleWishlist,
  } = useWishlistStore();
  const {
    products,
    currentPage,
    totalProducts,
    isLoading,
    error,
    fetchProductsForClient,
    hasMore,
  } = useProductStore();

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

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isFetchingRef.current &&
        !isLoading
      ) {
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

  // Sync product grid height with filter section on large screens
  useLayoutEffect(() => {
    const syncHeight = () => {
      if (
        window.innerWidth >= 1024 &&
        filterSectionRef.current &&
        productGridRef.current
      ) {
        const filterHeight =
          filterSectionRef.current.getBoundingClientRect().height;
        productGridRef.current.style.height = `${filterHeight}px`;
      } else if (productGridRef.current) {
        productGridRef.current.style.height = "auto";
      }
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

  // Initial load and filter changes
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

  const handleToggleFilter = (
    filterType: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };

    setterMap[filterType]((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
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
        price: product.price || 0,
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
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
          <h3 className="mb-3 font-semibold text-indigo-700">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() =>
                    handleToggleFilter("categories", category.id)
                  }
                  id={`cat-${category.id}`}
                />
                <Label
                  htmlFor={`cat-${category.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
          <h3 className="mb-3 font-semibold text-indigo-700">Size</h3>
          <div className="flex flex-wrap gap-2">
            {predefinedSizes.map((sizeItem) => (
              <motion.button
                key={sizeItem}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToggleFilter("sizes", sizeItem)}
                className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
                  selectedSizes.includes(sizeItem)
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {sizeItem}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
          <h3 className="mb-3 font-semibold text-indigo-700">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {products
              .reduce((acc: string[], product) => {
                JSON.parse(product.colors)?.forEach((color) => {
                  if (!acc.includes(color.hex)) {
                    acc.push(color.hex);
                  }
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
                    selectedColors.includes(colorHex)
                      ? "ring-2 ring-offset-2 ring-indigo-500"
                      : ""
                  }`}
                  style={{ backgroundColor: colorHex }}
                  onClick={() => handleToggleFilter("colors", colorHex)}
                />
              ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
          <h3 className="mb-3 font-semibold text-indigo-700">Price range</h3>
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={100}
            className="w-full"
            value={priceRange}
            onValueChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-700">
            <span>Kes {priceRange[0]}</span>
            <span>Kes {priceRange[1]}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50/20 via-purple-50/20 to-pink-50/20"
    >
      {/* Hero Banner */}
      <motion.div
        className="relative h-[300px] overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Listing Page Banner"
          className="w-full object-cover h-full absolute"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-purple-900/40"></div>
        <div className="relative z-20 h-full flex items-center justify-center">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              HOT COLLECTION
            </h1>
            <p className="text-lg md:text-xl">Discover our latest collection</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            All Products ({totalProducts > 0 ? totalProducts : "Loading..."})
          </motion.h2>

          <motion.div
            className="flex items-center gap-4"
            variants={itemVariants}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-h-[80vh] overflow-y-auto max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
              name="sort"
            >
              <SelectTrigger className="w-auto sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isFeatured-desc">
                  Sort by: Featured
                </SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt-desc">
                  Sort by: Newest First
                </SelectItem>
                <SelectItem value="createdAt-asc">
                  Sort by: Oldest First
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
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
            className="flex-1 overflow-y-auto lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 min-h-[500px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4">
              {isLoading && products.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/80 rounded-lg p-4 animate-pulse"
                    >
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error || wishlistError ? (
                <motion.div
                  className="text-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    Error: {error || wishlistError}
                  </div>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl inline-block">
                    <p className="text-lg text-gray-700">
                      No products found matching your filters.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Try adjusting your filter criteria.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    layout
                  >
                    <AnimatePresence>
                      {products.map((productItem) => {
                        const isWishlisted = isProductInWishlist(
                          wishlist,
                          productItem.id
                        );
                        return (
                          <motion.div
                            key={productItem.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                          >
                            {/* Product Image */}
                            <motion.div
                              onClick={() =>
                                router.push(`/listing/${productItem.id}`)
                              }
                              className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                            >
                              <img
                                src={
                                  productItem.images?.[0] || "/placeholder.jpg"
                                }
                                alt={productItem.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/listing/${productItem.id}`);
                                  }}
                                  className="bg-white text-black hover:bg-gray-100 flex items-center gap-1 shadow-lg"
                                  size="sm"
                                >
                                  <Eye className="w-4 h-4" /> Quick View
                                </Button>
                              </div>
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {productItem.isFeatured && (
                                  <motion.span
                                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
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
                                  >
                                    Sold Out
                                  </motion.span>
                                )}
                                {productItem.stock > 0 &&
                                  productItem.stock <= 5 && (
                                    <motion.span
                                      className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md"
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.4 }}
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
                                  onClick={() =>
                                    router.push(`/listing/${productItem.id}`)
                                  }
                                  className="font-bold text-md lg:text-lg hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                                  title={productItem.name}
                                >
                                  {productItem.name}
                                </h3>
                                <button
                                  onClick={() =>
                                    handleToggleWishlist(productItem.id)
                                  }
                                  className={`transition-colors p-1 -mr-1 ${
                                    isWishlisted
                                      ? "text-red-500 hover:text-red-600"
                                      : "text-gray-400 hover:text-red-500"
                                  }`}
                                  disabled={togglingWishlist[productItem.id]}
                                  aria-label="Toggle Wishlist"
                                >
                                  <Heart
                                    className={`w-5 h-5 ${
                                      isWishlisted ? "fill-red-500" : ""
                                    } ${
                                      togglingWishlist[productItem.id]
                                        ? "opacity-50 animate-pulse"
                                        : ""
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
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1.5">
                                  ({productItem.reviews?.length || 0} reviews)
                                </span>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow min-h-[40px]">
                                {productItem.description ||
                                  "No description available."}
                              </p>

                              {/* Price and Colors */}
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className="font-semibold text-lg text-indigo-700">
                                    Kes {(productItem.price || 0).toFixed(2)}
                                  </span>
                                  {productItem.isOnOffer &&
                                    productItem.offerPrice && (
                                      <span className="text-xs text-gray-500 line-through ml-1">
                                        Kes {productItem.offerPrice.toFixed(2)}
                                      </span>
                                    )}
                                  {productItem.stock > 0 && (
                                    <span className="text-xs text-green-600 ml-2 block sm:inline">
                                      {productItem.stock} in stock
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  {JSON.parse(productItem.colors)
                                    ?.slice(0, 3)
                                    .map((colorItem, index) => (
                                      <motion.div
                                        key={index}
                                        className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                        style={{
                                          backgroundColor: colorItem.hex,
                                        }}
                                        title={colorItem.name}
                                        whileHover={{ scale: 1.2 }}
                                      />
                                    ))}
                                  {productItem.colors &&
                                    productItem.colors.length > 3 && (
                                      <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                        +{productItem.colors.length - 3}
                                      </div>
                                    )}
                                </div>
                              </div>

                              {/* Add to Cart Button */}
                              <Button
                                onClick={() => handleAddToCart(productItem)}
                                className={`w-full mt-auto ${
                                  productItem.stock === 0
                                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                }`}
                                disabled={productItem.stock === 0}
                              >
                                {productItem.stock === 0 ? (
                                  "Out of Stock"
                                ) : (
                                  <>
                                    <ShoppingBag className="w-4 h-4 mr-2" /> Add
                                    to Cart
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
                  <div
                    ref={loadMoreRef}
                    className="h-16 flex items-center justify-center"
                  >
                    {isLoading && products.length > 0 && (
                      <motion.div
                        className="flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
                        <span className="text-gray-600">
                          Loading more products...
                        </span>
                      </motion.div>
                    )}
                    {!hasMore && products.length > 0 && (
                      <motion.div
                        className="text-center py-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg inline-block">
                          <p className="text-gray-600">
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
