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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
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
                  className={`relative group overflow-hidden rounded-2xl transition-all duration-300 touch-manipulation flex flex-col justify-between backdrop-blur-md ${
                    theme === "dark"
                      ? "bg-gray-800/60 border-indigo-500/30 hover:border-indigo-500/40"
                      : "bg-white/60 border-gray-200/30 hover:border-gray-300/40"
                  }`}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow:
                      theme === "dark" ? "0 10px 30px rgba(99, 102, 241, 0.4)" : "0 10px 30px rgba(29, 78, 216, 0.25)",
                  }}
                >
                  <div className="flex-grow">
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <motion.img
                        src={productItem.images[0]}
                        alt={productItem.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"`}
                      ></div>
                      <motion.div
                        className={`absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          theme === "dark" ? "bg-indigo-600/70 text-white" : "bg-blue-500/70 text-white"
                        }`}
                        whileHover={{ scale: 1.1, boxShadow: "0 0 12px rgba(59, 130, 246, 0.6)" }}
                        transition={{ duration: 0.3 }}
                      >
                        {productItem.category || "New"}
                      </motion.div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          className="text-lg font-bold line-clamp-2 transform transition-transform duration-300 group-hover:translate-y-0"
                          animate={{ y: 0, opacity: 1 }}
                        >
                          {productItem.name}
                        </motion.h3>
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          className="text-sm font-medium transform transition-transform duration-300 group-hover:translate-y-0"
                          animate={{ y: 0, opacity: 1 }}
                        >
                          KES {productItem.price.toLocaleString()}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-lg">
                    <motion.button
                      onClick={() => router.push(`/listing/${productItem.id}`)}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-bold overflow-hidden touch-manipulation transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-500/40"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/30"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <span className="relative z-10">View Details</span>
                    </motion.button>
                  </div>
                  <motion.div
                    className={`absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full transition-all duration-500 transform-gpu group-hover:scale-150 group-hover:opacity-100 opacity-0 animate-pulse ${
                      theme === "dark" ? "bg-purple-500/40" : "bg-blue-500/30"
                    }`}
                  ></motion.div>
                </motion.div>
              ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default FeaturedProducts;
