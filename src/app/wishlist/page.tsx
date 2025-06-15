"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWishlistStore } from "@/store/useWishlistStore";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Loader2, ShoppingBag, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function WishlistPage() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { data } = useSession();
  const { user } = data || {};
  const {
    wishlist,
    isLoading,
    error,
    getWishlist,
    toggleWishlist,
    clearWishlist,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
  } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      getWishlist(currentPage, itemsPerPage);
    }
  }, [user, currentPage, itemsPerPage, getWishlist]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await toggleWishlist(productId);
      toast({
        title: result.message || "Item removed from wishlist",
        variant: result.success ? "default" : "destructive",
      });
    } catch (err) {
      toast({
        title: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      const result = await clearWishlist();
      toast({
        title: result.message || "Wishlist cleared",
        variant: result.success ? "success" : "destructive",
      });
      setCurrentPage(1);
    } catch (err) {
      toast({
        title: "Failed to clear wishlist",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const wishlistProducts = wishlist?.product || [];

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          className={`w-8 h-8 p-0 text-xs sm:w-9 sm:h-9 sm:text-sm ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(1)}
          aria-label="Go to page 1"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span
            key="start-ellipsis"
            className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={`w-8 h-8 p-0 text-xs sm:w-9 sm:h-9 sm:text-sm ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span
            key="end-ellipsis"
            className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          className={`w-8 h-8 p-0 text-xs sm:w-9 sm:h-9 sm:text-sm ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  if (!user) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-indigo-50/20 to-white"
        }`}
      >
        <motion.div
          variants={itemVariants}
          className={`text-center max-w-xs sm:max-w-sm p-4 sm:p-6 rounded-lg shadow-md border backdrop-blur-sm ${
            theme === "dark" ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
          }`}
        >
          <h2 className={`text-lg sm:text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Sign In Required
          </h2>
          <p className={`text-xs sm:text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Please sign in to view your wishlist and save your favorite items.
          </p>
          <Link href="/auth/login">
            <Button
              className={`w-full text-xs sm:text-sm ${
                theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              Sign In
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-indigo-50/20 to-white"
        }`}
      >
        <Loader2
          className={`h-8 w-8 sm:h-10 sm:w-10 animate-spin ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-indigo-50/20 to-white"
        }`}
      >
        <motion.div
          variants={itemVariants}
          className={`text-center max-w-xs sm:max-w-sm p-4 sm:p-6 rounded-lg shadow-md border backdrop-blur-sm ${
            theme === "dark" ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
          }`}
        >
          <h2 className={`text-lg sm:text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Error Loading Wishlist
          </h2>
          <p className={`text-xs sm:text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
          <Button
            onClick={() => getWishlist(currentPage, itemsPerPage)}
            className={`w-full text-xs sm:text-sm ${
              theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-indigo-50/20 to-white"
      }`}
    >
      {isMounted && (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            className={`absolute top-1/3 left-1/3 w-48 h-48 sm:w-64 sm:h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob ${
              theme === "dark" ? "bg-purple-900" : "bg-purple-200"
            }`}
          ></div>
          <div
            className={`absolute top-1/2 right-1/4 w-56 h-56 sm:w-72 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 ${
              theme === "dark" ? "bg-indigo-900" : "bg-indigo-200"
            }`}
          ></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div variants={itemVariants} className="flex flex-col justify-between items-start mb-6 sm:mb-8">
          <div>
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-300 to-purple-300"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
            >
              Your Wishlist
            </h1>
            {wishlistProducts.length > 0 && (
              <p className={`text-xs sm:text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          {wishlistProducts.length > 0 && (
            <Button
              onClick={handleClearWishlist}
              variant="outline"
              className={`mt-3 w-full sm:w-auto text-xs sm:text-sm ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-red-900/50 hover:text-red-400"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <X className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
              Clear All
            </Button>
          )}
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className={`rounded-lg shadow-md p-4 sm:p-6 text-center border backdrop-blur-sm ${
              theme === "dark" ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-200/50"
            }`}
          >
            <Heart
              className={`w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-300"
              }`}
            />
            <h2
              className={`text-lg sm:text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Your Wishlist is Empty
            </h2>
            <p className={`text-xs sm:text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Save your favorite items here to keep track of them.
            </p>
            <Link href="/listing">
              <Button
                className={`w-full text-xs sm:text-sm ${
                  theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <AnimatePresence>
                {isLoading
                  ? [...Array(itemsPerPage)].map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        variants={itemVariants}
                        className={`rounded-lg shadow-sm overflow-hidden animate-pulse border ${
                          theme === "dark" ? "bg-gray-800/60 border-gray-700/50" : "bg-white/80 border-gray-200/50"
                        }`}
                      >
                        <div className="relative aspect-[3/2] bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-3 sm:p-4 space-y-2">
                          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="flex justify-between">
                            <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  : wishlistProducts.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border backdrop-blur-sm ${
                          theme === "dark"
                            ? "bg-gray-800/60 border-gray-700/50 hover:shadow-indigo-500/10"
                            : "bg-white/80 border-gray-200/50 hover:shadow-gray-300/20"
                        }`}
                      >
                        <div className="relative aspect-[3/2]">
                          <Image
                            src={item.images[0] || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-t-lg"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={false}
                          />
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-colors ${
                              theme === "dark"
                                ? "bg-gray-800/80 text-red-400 hover:bg-red-900/60"
                                : "bg-white/80 text-red-500 hover:bg-red-50"
                            }`}
                            aria-label={`Remove ${item.name} from wishlist`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3
                            className={`font-semibold text-xs sm:text-sm mb-1 line-clamp-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={`text-xs mb-2 line-clamp-2 ${
                              theme === "dark" ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-bold text-xs sm:text-sm ${
                                theme === "dark" ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {item.price.toLocaleString("en-KE", {
                                style: "currency",
                                currency: "KES",
                              })}
                            </span>
                            <Button
                              size="sm"
                              className={`text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ${
                                theme === "dark"
                                  ? "bg-purple-600 hover:bg-purple-700"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              asChild
                            >
                              <Link href={`/listing/${item.id}`}>
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8"
                role="navigation"
                aria-label="Wishlist pagination"
              >
                <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700 disabled:bg-gray-800/50"
                        : "hover:bg-gray-100 disabled:bg-gray-200/50"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Prev
                  </Button>
                  {getPaginationButtons()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8 ${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700 disabled:bg-gray-800/50"
                        : "hover:bg-gray-100 disabled:bg-gray-200/50"
                    }`}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(15px, -15px) scale(1.05);
          }
          66% {
            transform: translate(-10px, 10px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </motion.div>
  );
}
