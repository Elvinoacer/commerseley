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
    transition: {
      staggerChildren: 0.2,
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
          className={`w-10 h-10 p-0 ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
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
          className={`w-10 h-10 p-0 ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          className={`w-10 h-10 p-0 ${
            theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(totalPages)}
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
        className={`min-h-screen flex items-center justify-center  transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50/20 to-pink-50/20"
        }`}
      >
        <motion.div
          variants={itemVariants}
          className={`text-center max-w-md p-6 sm:p-8 rounded-xl shadow-lg border ${
            theme === "dark" ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-gray-100/30"
          }`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Sign In Required
          </h2>
          <p className={`text-sm sm:text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Please sign in to view your wishlist and save your favorite items.
          </p>
          <Link href="/auth/login">
            <Button
              className={`${
                theme === "dark" ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
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
        className={`min-h-screen flex items-center justify-center  transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50/20 to-pink-50/20"
        }`}
      >
        <Loader2 className={`h-12 w-12 animate-spin ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`min-h-screen flex items-center justify-center  transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50/20 to-pink-50/20"
        }`}
      >
        <motion.div
          variants={itemVariants}
          className={`text-center max-w-md p-6 sm:p-8 rounded-xl shadow-lg border ${
            theme === "dark" ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-gray-100/30"
          }`}
        >
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Error Loading Wishlist
          </h2>
          <p className={`text-sm sm:text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
          <Button
            onClick={() => getWishlist(currentPage, itemsPerPage)}
            className={`${
              theme === "dark" ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
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
      className={`min-h-screen  transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50/20 to-pink-50/20"
      }`}
    >
      {isMounted && (
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
              theme === "dark" ? "bg-purple-900" : "bg-purple-200"
            }`}
          ></div>
          <div
            className={`absolute top-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
              theme === "dark" ? "bg-indigo-900" : "bg-indigo-200"
            }`}
          ></div>
          <div
            className={`absolute bottom-1/4 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 ${
              theme === "dark" ? "bg-pink-900" : "bg-pink-200"
            }`}
          ></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12"
        >
          <div>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-gradient-to-r from-white to-gray-300"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
            >
              Your Wishlist
            </h1>
            {wishlistProducts.length > 0 && (
              <p className={`text-xs sm:text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Page {currentPage} of {totalPages} • {wishlistProducts.length} items
              </p>
            )}
          </div>
          {wishlistProducts.length > 0 && (
            <Button
              onClick={handleClearWishlist}
              variant="outline"
              className={`mt-4 md:mt-0 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-red-900/50 hover:text-red-400"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg p-6 sm:p-8 text-center border ${
              theme === "dark" ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-gray-100/30"
            }`}
          >
            <Heart
              className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 ${
                theme === "dark" ? "text-gray-500" : "text-gray-300"
              }`}
            />
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Your Wishlist is Empty
            </h2>
            <p className={`text-sm sm:text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Save your favorite items here to keep track of them.
            </p>
            <Link href="/listing">
              <Button
                className={`${
                  theme === "dark" ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
            >
              <AnimatePresence>
                {isLoading
                  ? [...Array(itemsPerPage)].map((_, i) => (
                      <motion.div
                        key={`skeleton-${i}`}
                        variants={itemVariants}
                        className={`rounded-xl shadow-md overflow-hidden animate-pulse border ${
                          theme === "dark" ? "bg-gray-800/50 border-gray-700/30" : "bg-white border-gray-100/30"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="flex justify-between">
                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  : wishlistProducts.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border ${
                          theme === "dark"
                            ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                            : "bg-white/90 border-gray-200/30 hover:shadow-gray-200"
                        }`}
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={item.images[0] || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-t-xl"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            priority={false}
                          />
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className={`absolute top-2 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg sm:rounded-full shadow-md transition-colors ${
                              theme === "dark"
                                ? "bg-gray-800/80 text-red-400 hover:bg-red-900/50"
                                : "bg-white text-red-500 hover:bg-red-50"
                            }`}
                            aria-label="Remove from wishlist"
                          >
                            <Heart className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                          </button>
                        </div>
                        <div className="p-2 sm:p-3">
                          <h3
                            className={`font-semibold text-sm sm:text-lg mb-0.5 sm:mb-1 line-clamp-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={`text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 ${
                              theme === "dark" ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-bold text-sm sm:text-lg ${
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
                              className={`${
                                theme === "dark"
                                  ? "bg-purple-500 hover:bg-purple-600"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              asChild
                            >
                              <Link href={`/listing/${item.id}`}>
                                <ShoppingBag className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
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
                className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mt-8"
              >
                <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Showing {wishlistProducts.length} of {wishlist.totalItems || 0} items • Page {currentPage} of{" "}
                  {totalPages}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700 disabled:bg-gray-800"
                        : "hover:bg-gray-100 disabled:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    Previous
                  </Button>
                  {getPaginationButtons()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${
                      theme === "dark"
                        ? "border-gray-600 hover:bg-gray-700 disabled:bg-gray-800"
                        : "hover:bg-gray-100 disabled:bg-gray-200"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1 sm:ml-2" />
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
            transform: translate(25px, -25px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.div>
  );
}
