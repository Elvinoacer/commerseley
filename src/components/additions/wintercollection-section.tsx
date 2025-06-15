"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { gridItems } from "./grid-items";
import { fadeIn, staggerContainer } from "@/lib/motion";

export default function WinterCollectionSection() {
  const { theme } = useTheme();
  const router = useRouter();

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
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            }`}
          >
            THE WINTER EDIT
          </h2>
          <p
            className={`text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Designed to keep your satisfaction and warmth
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {gridItems.map((gridItem, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", index * 0.1, 0.5)}
              className={`relative group overflow-hidden rounded-lg sm:rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 touch-manipulation border ${
                theme === "dark"
                  ? "border-indigo-500/20 hover:border-indigo-500/40"
                  : "border-gray-200/20 hover:border-gray-300/40"
              }`}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="aspect-[3/4] relative">
                <motion.img
                  src={gridItem.image}
                  alt={gridItem.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.05 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-b ${
                    theme === "dark" ? gridItem.darkGradient : gridItem.lightGradient
                  } opacity-0 group-hover:opacity-80 transition-opacity duration-300 sm:group-hover:opacity-100`}
                  whileHover={{ opacity: 0.9 }}
                />
              </div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`text-center p-4 sm:p-6 backdrop-blur-md rounded-lg m-3 sm:m-4 ${
                    theme === "dark"
                      ? "bg-black/40 text-white border border-indigo-500/30"
                      : "bg-white/70 text-gray-800 border border-gray-200/30"
                  }`}
                >
                  <h3
                    className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {gridItem.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {gridItem.subtitle}
                  </p>
                  <motion.button
                    onClick={() => router.push("/listing")}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-sm sm:text-base transition-all touch-manipulation ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    }`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        theme === "dark" ? "0 4px 12px rgba(59, 130, 246, 0.4)" : "0 4px 12px rgba(29, 78, 216, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    SHOP NOW
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
