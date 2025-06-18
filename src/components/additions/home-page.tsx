"use client";

import BannerCarousel from "@/components/additions/home-carousel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getFCMToken } from "@/lib/firebase-client";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSubscriptionStore } from "@/store/useSubscription";
import { fadeIn, staggerContainer } from "@/utils/motion";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FeaturedProducts from "./featured-products";
import { gridItems } from "./grid-items";
import CategoriesGrid from "./home-categories";
import { InfiniteMarquee } from "./infinite-marquee";
import StoreLocation from "./physical-address";
import WinterCollectionSection from "./wintercollection-section";

function HomePage() {
  const { theme } = useTheme();
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const { subscribe } = useSubscriptionStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const { banners, featuredProducts, fetchFeaturedProducts, fetchBanners } = useSettingsStore();

  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
  }, [fetchBanners, fetchFeaturedProducts]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gridItems.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      {/* Hero Section */}
      <BannerCarousel gridItems={gridItems} setCurrentSlide={setCurrentSlide} currentSlide={currentSlide} />

      {/* Marquee */}
      <div className="mt-4 sm:mt-6 md:mt-8 px-2 sm:px-0">
        <InfiniteMarquee />
      </div>

      {/* Grid Section */}
      <WinterCollectionSection />

      {/* Categories */}
      <CategoriesGrid />

      {/* Featured Products Section */}
      <FeaturedProducts featuredProducts={featuredProducts} />

      <StoreLocation />

      {/* CTA Section */}
      <section
        className={`py-8 sm:py-12 md:py-16 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30"
            : "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100"
        }`}
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer(0.1, 0.1)}
          className="container mx-auto px-4 sm:px-6"
        >
          <motion.h2
            variants={fadeIn("up", "tween", 0.2, 1)}
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-5 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            JOIN OUR NEWSLETTER
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "tween", 0.4, 1)}
            className={`max-w-md mx-auto mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-center ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Get 15% off your first order and be the first to know about new products and offers
          </motion.p>
          <motion.div
            variants={fadeIn("up", "tween", 0.6, 1)}
            className="flex flex-col items-center w-full max-w-md mx-auto"
          >
            <div className="relative w-full flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
              {/* Email Input */}
              <motion.div
                className="relative w-full"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <input
                  type="email"
                  value={subscriptionEmail}
                  onChange={(e) => setSubscriptionEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-full border-2 transition-all duration-300 focus:outline-none focus:shadow-lg touch-manipulation ${
                    theme === "dark"
                      ? "bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                {!subscriptionEmail && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                )}
              </motion.div>

              {/* Subscribe Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className={`w-full sm:w-auto rounded-full font-medium text-xs sm:text-sm px-4 py-2 sm:py-3 transition-all duration-300 shadow-md touch-manipulation ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  } ${!subscriptionEmail ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"}`}
                  disabled={!subscriptionEmail}
                  onClick={async () => {
                    try {
                      const token = await getFCMToken();
                      const response = await subscribe(subscriptionEmail, token || "");
                      console.log("Subscription:", response);
                      setSubscriptionEmail("");
                      if (response.success) {
                        toast({
                          title: "Thank you for subscribing!",
                          description: "You'll receive exclusive offers and updates.",
                        });
                      }
                    } catch (error: any) {
                      toast({
                        title: "Subscription Failed",
                        description: error.message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <span className="px-2 sm:px-4">Subscribe</span>
                  <motion.span
                    animate={subscriptionEmail ? { x: [0, 2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="ml-1"
                  >
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.span>
                </Button>
              </motion.div>
            </div>

            {/* Help text */}
            <motion.p
              className={`mt-2 text-[10px] sm:text-xs text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We'll never share your email. Unsubscribe anytime.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;
