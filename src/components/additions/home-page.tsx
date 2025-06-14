"use client";

import BannerCarousel from "@/components/additions/home-carousel";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import { fadeIn, staggerContainer, textVariant } from "@/utils/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InfiniteMarquee } from "./infinite-marquee";
import CategoriesGrid from "./home-categories";
import StoreLocation from "./physical-address";
import { useFCM } from "@/hooks/useFCM";
import { getFCMToken } from "@/lib/firebase-client";
import { useSubscriptionStore } from "@/store/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { ArrowRight, Mail } from "lucide-react";
import { gridItems } from "./grid-items";
import WinterCollectionSection from "./wintercollection-section";
import FeaturedProducts from "./featured-products";

function HomePage() {
  useFCM();
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

      {/* marquee */}
      <div className="mt-10">
        <InfiniteMarquee />
      </div>

      {/* Grid Section */}
      <WinterCollectionSection />

      {/* Categories */}
      <CategoriesGrid />

      {/* Feature Products Section */}
      <FeaturedProducts featuredProducts={featuredProducts} />

      <StoreLocation />

      {/* CTA Section */}
      <section
        className={`py-24 transition-colors duration-300 ${
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
          className="container mx-auto px-4 text-center"
        >
          <motion.h2
            variants={fadeIn("up", "tween", 0.2, 1)}
            className={`text-4xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            JOIN OUR NEWSLETTER
          </motion.h2>
          <motion.p
            variants={fadeIn("up", "tween", 0.4, 1)}
            className={`max-w-2xl mx-auto mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Get 15% off your first order and be the first to know about new products and offers
          </motion.p>
          <motion.div
            variants={fadeIn("up", "tween", 0.6, 1)}
            className="flex flex-col items-center w-full max-w-xl mx-auto"
          >
            <div className="relative w-full flex flex-col sm:flex-row gap-4 items-center">
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
                  className={`w-full px-6 py-4 rounded-full border-2 transition-all duration-300 focus:outline-none focus:shadow-lg ${
                    theme === "dark"
                      ? "bg-gray-800/70 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                {!subscriptionEmail && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <Mail className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.div>

              {/* Subscribe Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className={`rounded-full font-semibold transition-all duration-300 shadow-lg ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  } ${!subscriptionEmail ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"}`}
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
                  <span className="px-6">Subscribe</span>
                  <motion.span
                    animate={subscriptionEmail ? { x: [0, 2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="ml-1"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
            </div>

            {/* Help text */}
            <motion.p
              className={`mt-3 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
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
