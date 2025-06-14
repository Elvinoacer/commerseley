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
      className={`py-16 md:py-24 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50"
      }`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer(0.1, 0.1)}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-300 to-purple-300"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            SHOP BY CATEGORY
          </h2>
          <p
            className={`text-sm md:text-base max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Discover our wide range of products
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
        >
          {categories
            .filter((category) => category.products?.length > 0)
            .slice(0, 8)
            .map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className="relative group overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -8 }}
                onClick={() => router.push(`/listing?category=${category.id}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
              >
                {/* Image Container */}
                <div className="aspect-square relative">
                  <motion.img
                    src={category.products[0]?.images[0] || "/placeholder-product.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 ${
                      theme === "dark"
                        ? "bg-gradient-to-t from-black/60 via-black/30 to-transparent"
                        : "bg-gradient-to-t from-black/50 via-black/20 to-transparent"
                    }`}
                  />
                </div>

                {/* Category Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                  <div
                    className={`p-3 sm:p-4 rounded-lg backdrop-blur-sm ${
                      theme === "dark" ? "bg-black/30 text-white" : "bg-white/80 text-gray-900"
                    }`}
                  >
                    <h3
                      className={`text-sm sm:text-base md:text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {category.products.length} product{category.products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CategoriesGrid;
