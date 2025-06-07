"use client";

import { motion } from "framer-motion";

// Add this new component above your HomePage component
export const InfiniteMarquee = () => {
  const offers = [
    "FREE SHIPPING ON ORDERS OVER KES 5000",
    "20% OFF NEW COLLECTION - USE CODE: NEW20",
    "BUY 1 GET 1 FREE ON SELECTED ITEMS",
    "EXTENDED RETURNS UNTIL JANUARY 15TH",
  ];

  return (
    <div className=" text-white py-3 overflow-hidden">
      <div className="relative flex">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...offers, ...offers].map((offer, index) => (
            <div key={index} className="inline-flex items-center mx-8">
              <span className="text-sm font-medium tracking-wider">{offer}</span>
              {index < offers.length * 2 - 1 && <span className="mx-8 text-yellow-400">•</span>}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
