"use client";

import { useCategoryStore } from "@/store/useCategories";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "next-themes";

function CategoriesGrid() {
  const router = useRouter();
  const { theme } = useTheme();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        variants={staggerContainer(0.1, 0.1)}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            }`}
          >
            SHOP BY CATEGORY
          </h2>
          <p
            className={`text-xs sm:text-sm md:text-base max-w-lg mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover our wide range of products
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
        >
          {categories
            .filter((category) => category.products?.length > 0)
            .slice(0, 8)
            .map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className={`relative group overflow-hidden rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 touch-manipulation border ${
                  theme === "dark"
                    ? "border-indigo-500/20 hover:border-indigo-500/40"
                    : "border-gray-200/20 hover:border-gray-300/40"
                }`}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => router.push(`/listing?category=${category.id}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                viewport={{ once: true }}
              >
                {/* Image Container */}
                <div className="aspect-square relative">
                  <motion.img
                    src={category.products[0]?.images[0] || "/placeholder-product.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.05 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                  {/* Dynamic Gradient Overlay */}
                  <motion.div
                    className={`absolute inset-0 ${
                      theme === "dark"
                        ? "bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                        : "bg-gradient-to-t from-black/60 via-black/30 to-transparent"
                    }`}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Category Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3">
                  <motion.div
                    className={`p-2 sm:p-3 rounded-lg backdrop-blur-md ${
                      theme === "dark"
                        ? "bg-black/40 text-white border border-indigo-500/30"
                        : "bg-white/70 text-gray-900 border border-gray-200/30"
                    }`}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className={`text-xs sm:text-sm md:text-base font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {category.products?.length || 0} product{category.products?.length !== 1 ? "s" : ""}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CategoriesGrid;
