"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const InfiniteMarquee = () => {
  const { theme } = useTheme();
  const offers = [
    "FREE SHIPPING ON ORDERS OVER KES 5000",
    "20% OFF NEW COLLECTION - USE CODE: NEW20",
    "BUY 1 GET 1 FREE ON SELECTED ITEMS",
    "EXTENDED RETURNS UNTIL JANUARY 15TH",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`py-2 sm:py-3 overflow-hidden shadow-sm rounded-md ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="relative flex">
        <motion.div
          className="flex whitespace-nowrap min-w-[200%]" // Ensure enough width for duplicated content
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }} // Translate only half the width due to duplication
          transition={{
            duration: 30, // Slightly longer for smooth scrolling
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }} // Pause on hover (desktop only)
        >
          {[...offers, ...offers].map((offer, index) => (
            <div key={`${offer}-${index}`} className="inline-flex items-center px-2 sm:px-4 touch-manipulation">
              <motion.span
                className={`text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400"
                    : "text-gray-800 hover:text-yellow-600"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {offer}
              </motion.span>
              {index < offers.length * 2 - 1 && (
                <motion.span
                  className={`mx-2 sm:mx-4 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse", delay: index * 0.1 }}
                >
                  <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>
        {/* Fade edges for smooth transition */}
        <div
          className={`absolute inset-y-0 left-0 w-8 sm:w-16 pointer-events-none ${
            theme === "dark"
              ? "bg-gradient-to-r from-gray-900 to-transparent"
              : "bg-gradient-to-r from-gray-100 to-transparent"
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-8 sm:w-16 pointer-events-none ${
            theme === "dark"
              ? "bg-gradient-to-l from-gray-900 to-transparent"
              : "bg-gradient-to-l from-gray-100 to-transparent"
          }`}
        />
      </div>
    </motion.div>
  );
};
