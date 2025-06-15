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
    <section
      className="relative h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden"
      aria-label="Promotional banner carousel"
    >
      <AnimatePresence mode="wait">
        {gridItems.map(
          (bannerItem, index) =>
            currentSlide === index && (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Blurred Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={bannerItem.image}
                    alt={`Background for ${bannerItem.title}`}
                    className="w-full h-full object-cover filter blur-sm sm:blur-md"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 100vw"
                  />
                  <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-white/40"}`} />
                </div>

                {/* Clear Foreground Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img
                    src={bannerItem.image}
                    alt={bannerItem.title}
                    className="w-full h-full object-contain max-w-[90%] max-h-[60%] sm:max-w-[80%] sm:max-h-[70%] md:max-h-[80%]"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    loading="lazy"
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 70vw"
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
                    className={`space-y-3 sm:space-y-4 max-w-lg sm:max-w-xl p-4 sm:p-6 rounded-lg ${
                      theme === "dark"
                        ? "bg-black/60 backdrop-blur-sm text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-900"
                    }`}
                  >
                    <motion.span
                      variants={textVariant(0.4)}
                      className={`text-xs sm:text-sm uppercase tracking-wider px-2 py-1 rounded-full inline-block ${
                        theme === "dark" ? "bg-white/20 text-white" : "bg-black/10 text-gray-800"
                      }`}
                    >
                      New Collection
                    </motion.span>
                    <motion.h1
                      variants={textVariant(0.6)}
                      className={`text-xl sm:text-2xl md:text-4xl font-bold leading-tight ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      BEST SELLING
                      <br />
                      E-COMMERCE WEBSITE
                    </motion.h1>
                    <motion.p
                      variants={textVariant(0.8)}
                      className={`text-xs sm:text-sm md:text-base ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      A Creative, Flexible, Clean, Easy to use and
                      <br className="hidden sm:inline" />
                      High Performance E-Commerce Theme
                    </motion.p>
                    <motion.div variants={textVariant(1)}>
                      <motion.button
                        onClick={() => router.push("/listing")}
                        className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-md touch-manipulation ${
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
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3"
        role="tablist"
      >
        {gridItems.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full touch-manipulation ${
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
              width: currentSlide === index ? 20 : 10,
              height: currentSlide === index ? 6 : 4,
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
