"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SetStateAction } from "react";

// Framer Motion variants
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
    gradient: string;
  }[];
  currentSlide: number;
  setCurrentSlide: (value: SetStateAction<number>) => void;
}

const BannerCarousel = ({ gridItems, currentSlide, setCurrentSlide }: BannerCarouselProps) => {
  const router = useRouter();

  return (
    <section className="relative h-screen overflow-hidden" aria-label="Promotional banner carousel">
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
                    className="w-full h-full object-cover filter blur-md"
                  />
                  <div className="absolute inset-0 bg-black/20" /> {/* Slight overlay for contrast */}
                </div>
                {/* Clear Foreground Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.img
                    src={bannerItem.image}
                    alt={bannerItem.title}
                    className="w-full h-full object-contain max-w-[90%] max-h-[90%] md:max-w-[80%] md:max-h-[80%]"
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
                  className="relative h-full container mx-auto px-4 flex items-center"
                >
                  <motion.div
                    variants={fadeIn("right", "tween", 0.2, 1)}
                    className="text-white space-y-6 max-w-2xl bg-black/50 backdrop-blur-sm p-6 rounded-lg"
                  >
                    <motion.span
                      variants={textVariant(0.4)}
                      className="text-sm uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block"
                    >
                      New Collection
                    </motion.span>
                    <motion.h1
                      variants={textVariant(0.6)}
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                    >
                      BEST SELLING
                      <br />
                      E-COMMERCE WEBSITE
                    </motion.h1>
                    <motion.p variants={textVariant(0.8)} className="text-base sm:text-lg text-gray-100">
                      A Creative, Flexible, Clean, Easy to use and
                      <br />
                      High Performance E-Commerce Theme
                    </motion.p>
                    <motion.div variants={textVariant(1)}>
                      <motion.button
                        onClick={() => router.push("/listing")}
                        className="bg-white text-black hover:bg-gray-100 px-6 py-3 text-base sm:text-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
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
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2" role="tablist">
        {gridItems.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-white" : "bg-white/50 hover:bg-white/75"
            } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black`}
            whileHover={{ scale: 1.2 }}
            animate={{
              width: currentSlide === index ? 24 : 12,
              opacity: currentSlide === index ? 1 : 0.7,
            }}
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
