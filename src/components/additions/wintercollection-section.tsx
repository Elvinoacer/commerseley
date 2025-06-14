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
      className={`py-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerContainer(0.1, 0.1)}
        className="container mx-auto px-4"
      >
        <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-gray-300"
                : "bg-gradient-to-r from-gray-800 to-gray-600"
            }`}
          >
            THE WINTER EDIT
          </h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Designed to keep your satisfaction and warmth
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {gridItems.map((gridItem, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", index * 0.1, 0.5)}
              className="relative group overflow-hidden rounded-2xl shadow-2xl mobile-hover"
              whileHover={{ y: -10 }}
            >
              <div className="aspect-[3/4] relative">
                <motion.img
                  src={gridItem.image}
                  alt={gridItem.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${
                    theme === "dark" ? gridItem.darkGradient : gridItem.lightGradient
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500 mobile-hover:opacity-100`}
                />
              </div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 mobile-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`text-center p-6 backdrop-blur-sm rounded-xl m-4 ${
                    theme === "dark" ? "bg-black/30 text-white" : "bg-white/80 text-gray-800"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{gridItem.title}</h3>
                  <p className={theme === "dark" ? "text-gray-200 mb-4" : "text-gray-600 mb-4"}>{gridItem.subtitle}</p>
                  <motion.button
                    onClick={() => router.push("/listing")}
                    className={`px-6 py-4 rounded-md ${
                      theme === "dark"
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    whileHover={{ scale: 1.05 }}
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
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-hover img {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
