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
    hidden: { opacity: 0, y: 50, rotate: -2 },
    show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, backgroundPosition: "100% 0" },
    tap: { scale: 0.95 },
  };

  return (
    <section
      className={`py-16 md:py-24 transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.2, 0.2)}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-12 md:mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-gray-300"
                : "bg-gradient-to-r from-gray-800 to-blue-600"
            }`}
          >
            Our Featured Products
          </h2>
          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Discover our curated selection of top arrivals from premium brands, crafted for style and comfort.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl overflow-hidden animate-pulse ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))
            : featuredProducts.map((productItem, index) => (
                <motion.div
                  key={productItem.id}
                  variants={cardVariants}
                  className={`relative group overflow-hidden rounded-2xl shadow-lg border mobile-hover ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 hover:shadow-white/10"
                      : "bg-white border-gray-200 hover:shadow-gray-300/30"
                  }`}
                  whileHover={{
                    y: -8,
                    boxShadow: theme === "dark" ? "0 10px 20px rgba(255,255,255,0.1)" : "0 10px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <motion.img
                      src={productItem.images[0]}
                      alt={productItem.name}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        theme === "dark" ? "from-black/70 to-transparent" : "from-black/50 to-transparent"
                      } opacity-0 group-hover:opacity-100 mobile-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <motion.div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white"
                      whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {productItem.category || "New"}
                    </motion.div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3
                      className={`text-lg sm:text-xl font-semibold line-clamp-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {productItem.name}
                    </h3>
                    <p className={`text-sm sm:text-base mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      KES {productItem.price.toLocaleString()}
                    </p>
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 mobile-hover:opacity-100 pb-6"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={() => router.push(`/listing/${productItem.id}`)}
                      className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-md text-sm sm:text-base font-medium overflow-hidden ${
                        theme === "dark"
                          ? "bg-white text-black hover:bg-gray-100"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      style={{
                        backgroundSize: "200% 100%",
                        backgroundPosition: "0% 0",
                        transition: "background-position 0.3s ease",
                      }}
                    >
                      Quick View
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
        </motion.div>
      </motion.div>
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hover img {
            transform: scale(1.1);
          }
          .mobile-hover .group-hover\\:opacity-100 {
            opacity: 1;
          }
        }
        button {
          background-image: linear-gradient(
            to right,
            ${theme === "dark" ? "#ffffff 50%, #f3f4f6 50%" : "#2563eb 50%, #1d4ed8 50%"}
          );
        }
      `}</style>
    </section>
  );
}

export default FeaturedProducts;
