"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";
import { useTheme } from "next-themes";

// Framer Motion variants (unchanged from original)
const staggerContainer = (staggerChildren: any, delayChildren: any) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

const fadeIn = (direction: any, type: any, delay: any, duration: any) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

const textVariant = (delay: any) => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  },
});

interface BannerCarouselProps {
  gridItems: {
    title: string;
    subtitle: string;
    image: string;
    gradient?: string;
  }[];
  currentSlide: number;
  setCurrentSlide: (value: SetStateAction<number>) => void;
}

const BannerCarousel = ({ gridItems, currentSlide, setCurrentSlide }: BannerCarouselProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <section className="relative h-[90vh] sm:h-screen overflow-hidden" aria-label="Promotional banner carousel">
      <AnimatePresence mode="wait">
        {gridItems.map(
          (bannerItem, index) =>
            currentSlide === index && (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Blurred Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={bannerItem.image}
                    alt={`Background for ${bannerItem.title}`}
                    className="w-full h-full object-cover filter blur-sm md:blur-md"
                  />
                  <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/40" : "bg-white/30"}`} />
                </div>

                {/* Clear Foreground Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img
                    src={bannerItem.image}
                    alt={bannerItem.title}
                    className="w-full h-full object-contain max-w-[90%] max-h-[70%] sm:max-w-[80%] sm:max-h-[80%]"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>

                {/* Text Content */}
                <motion.div
                  variants={staggerContainer(0.1, 0.1)}
                  initial="hidden"
                  animate="show"
                  className="relative h-full container mx-auto px-4 sm:px-6 flex items-center"
                >
                  <motion.div
                    variants={fadeIn("right", "tween", 0.2, 1)}
                    className={`space-y-4 sm:space-y-6 max-w-2xl p-6 sm:p-8 rounded-lg ${
                      theme === "dark"
                        ? "bg-black/50 backdrop-blur-sm text-white"
                        : "bg-white/70 backdrop-blur-sm text-gray-900"
                    }`}
                  >
                    <motion.span
                      variants={textVariant(0.4)}
                      className={`text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
                        theme === "dark" ? "bg-white/20 text-white" : "bg-black/10 text-gray-800"
                      }`}
                    >
                      New Collection
                    </motion.span>
                    <motion.h1
                      variants={textVariant(0.6)}
                      className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      BEST SELLING
                      <br />
                      E-COMMERCE WEBSITE
                    </motion.h1>
                    <motion.p
                      variants={textVariant(0.8)}
                      className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                    >
                      A Creative, Flexible, Clean, Easy to use and
                      <br />
                      High Performance E-Commerce Theme
                    </motion.p>
                    <motion.div variants={textVariant(1)}>
                      <motion.button
                        onClick={() => router.push("/listing")}
                        className={`px-6 py-3 text-sm sm:text-base font-medium rounded-md shadow-lg ${
                          theme === "dark"
                            ? "bg-white text-gray-900 hover:bg-gray-100"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Shop now for new collection"
                      >
                        SHOP NOW
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Dots */}
      <div
        className="absolute bottom-6 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3"
        role="tablist"
      >
        {gridItems.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full ${
              currentSlide === index
                ? theme === "dark"
                  ? "bg-white"
                  : "bg-gray-900"
                : theme === "dark"
                ? "bg-white/50"
                : "bg-gray-900/50"
            }`}
            whileHover={{ scale: 1.2 }}
            animate={{
              width: currentSlide === index ? 24 : 12,
              height: currentSlide === index ? 8 : 6,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            aria-label={`Go to slide ${index + 1}`}
            role="tab"
            aria-selected={currentSlide === index}
          />
        ))}
      </div>
    </section>
  );
};

export default BannerCarousel;
