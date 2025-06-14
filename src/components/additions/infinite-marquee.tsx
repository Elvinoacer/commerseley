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
    <div
      className={`py-3 overflow-hidden ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Double the offers array to prevent visual gap during loop */}
      <div className="relative flex">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...offers, ...offers].map((offer, index) => (
            <div key={`${offer}-${index}`} className="inline-flex items-center px-4 sm:px-8">
              <span
                className={`text-xs sm:text-sm font-medium tracking-wider ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {offer}
              </span>
              {index < offers.length * 2 - 1 && (
                <span className={`mx-4 sm:mx-8 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>•</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
