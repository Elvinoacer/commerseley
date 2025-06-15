"use client";

import { fadeIn, staggerContainer } from "@/lib/motion";
import { FeaturedProduct } from "@/store/useSettingsStore";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function FeaturedProducts({ featuredProducts }: { featuredProducts: FeaturedProduct[] }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state (replace with actual data fetching logic if needed)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotate: -1 },
    show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, x: 2 },
    tap: { scale: 0.95 },
  };

  return (
    <section
      className={`py-12 sm:py-16 md:py-20 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900"
          : "bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50"
      }`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer(0.2, 0.2)}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            }`}
          >
            Our Featured Products
          </h2>
          <p
            className={`text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover our curated selection of top arrivals from premium brands, crafted for style and comfort.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-lg sm:rounded-xl overflow-hidden animate-pulse ${
                      theme === "dark" ? "bg-gray-800/60" : "bg-gray-200/60"
                    } backdrop-blur-md border ${theme === "dark" ? "border-indigo-500/30" : "border-gray-200/30"}`}
                  >
                    <div className="aspect-[3/4] bg-gray-300/50 dark:bg-gray-700/50"></div>
                    <div className="p-4 sm:p-6 space-y-2">
                      <div className="h-4 sm:h-5 w-3/4 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                      <div className="h-3 sm:h-4 w-1/2 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                    </div>
                  </div>
                ))
            : featuredProducts.map((productItem, index) => (
                <motion.div
                  key={productItem.id}
                  variants={cardVariants}
                  className={`relative group overflow-hidden rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl border transition-all duration-300 touch-manipulation ${
                    theme === "dark"
                      ? "bg-gray-800/80 border-indigo-500/20 hover:border-indigo-500/40"
                      : "bg-white/90 border-gray-200/20 hover:border-gray-300/40"
                  }`}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    boxShadow:
                      theme === "dark" ? "0 8px 24px rgba(99, 102, 241, 0.3)" : "0 8px 24px rgba(29, 78, 216, 0.2)",
                  }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <motion.img
                      src={productItem.images[0]}
                      alt={productItem.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.05 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        theme === "dark"
                          ? "from-black/70 via-black/30 to-transparent"
                          : "from-black/60 via-black/20 to-transparent"
                      } opacity-0 group-hover:opacity-80 sm:group-hover:opacity-100 transition-opacity duration-300`}
                      whileHover={{ opacity: 0.9 }}
                    />
                    <motion.div
                      className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        theme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-500 text-white"
                      }`}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 12px rgba(59, 130, 246, 0.6)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {productItem.category || "New"}
                    </motion.div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3
                      className={`text-base sm:text-lg md:text-xl font-semibold line-clamp-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {productItem.name}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm md:text-base mt-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      KES {productItem.price.toLocaleString()}
                    </p>
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-end justify-center pb-4 sm:pb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={() => router.push(`/listing/${productItem.id}`)}
                      className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-md text-xs sm:text-sm md:text-base font-medium overflow-hidden touch-manipulation ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span className="relative z-10">Quick View</span>
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default FeaturedProducts;
