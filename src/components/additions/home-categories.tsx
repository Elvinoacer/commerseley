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
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories
            .filter((category) => category.products?.length > 0)
            .slice(0, 8)
            .map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className={`relative group overflow-hidden rounded-2xl transition-all duration-300 touch-manipulation cursor-pointer ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                onClick={() => router.push(`/listing?category=${category.id}`)}
              >
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
                  <motion.img
                    src={category.products[0]?.images[0] || "/placeholder-product.jpg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center p-4 text-white bg-black/40 transition-colors duration-300 group-hover:bg-black/60"`}
                  >
                    <h3 className="text-xl font-bold text-center">{category.name}</h3>
                  </div>
                </div>
                <div
                  className={`absolute bottom-4 right-4 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                    theme === "dark" ? "bg-gray-700/80 text-white" : "bg-gray-200/80 text-gray-800"
                  }`}
                >
                  {category.products?.length || 0} product{category.products?.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default CategoriesGrid;
