"use client";

import { useCategoryStore } from "@/store/useCategories";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CategoriesGrid() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.1)}
        className="container mx-auto px-4"
      >
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            SHOP BY CATEGORY
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover our wide range of products</p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
        >
          {categories
            .filter((category) => category.products && category.products.length > 0) // Filter categories with products
            .slice(0, 8) // Take first 8 categories with products
            .map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className="relative group overflow-hidden rounded-2xl shadow-2xl"
                whileHover={{ y: -10 }}
                onClick={() => router.push(`/listing?category=${category.id}`)}
              >
                <div className="aspect-square relative">
                  <motion.img
                    src={category?.products?.[0]?.images[0]}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
                </div>
                <div className="absolute inset-0 flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-200">
                      {category.products?.length} product{category.products?.length !== 1 ? "s" : ""}
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
