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
import { title } from "process";

const gridItems = [
  {
    title: "WOMEN",
    subtitle: "From world's top designer",
    image: "https://i.pinimg.com/736x/52/33/37/523337b11e778a52550d0b945f05d36d.jpg",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
  },
  {
    title: "FALL LEGENDS",
    image: "https://i.pinimg.com/736x/23/0b/c5/230bc554c00a8314d066a883209f5855.jpg",
    subtitle: "Timeless cool weather",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "ACCESSORIES",
    image: "https://i.pinimg.com/736x/1e/25/b9/1e25b9f80987315de11ba1b2fe8912f9.jpg",
    subtitle: "Everything you need",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "HOLIDAY SPARKLE EDIT",
    subtitle: "Party season ready",
    image: "https://i.pinimg.com/736x/8f/0d/63/8f0d63ab6fc0c0e1f3e87e9e5ce99cba.jpg",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
];

function HomePage() {
  useFCM();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}

      <BannerCarousel gridItems={gridItems} setCurrentSlide={setCurrentSlide} currentSlide={currentSlide} />
      {/* marquee */}
      <div className="mt-10">
        <InfiniteMarquee />
      </div>

      {/* Grid Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer(0.1, 0.1)}
          className="container mx-auto px-4"
        >
          <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              THE WINTER EDIT
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Designed to keep your satisfaction and warmth</p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {gridItems.map((gridItem, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className="relative group overflow-hidden rounded-2xl shadow-2xl"
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
                    className={`absolute inset-0 bg-gradient-to-b ${gridItem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                </div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center text-white p-6 backdrop-blur-sm bg-black/30 rounded-xl m-4">
                    <h3 className="text-2xl font-bold mb-2">{gridItem.title}</h3>
                    <p className="text-gray-200 mb-4">{gridItem.subtitle}</p>
                    <motion.button
                      onClick={() => router.push("/listing")}
                      className="bg-white text-black hover:bg-gray-100 px-6 py-4 rounded-md"
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
      </section>
      {/* Categories */}
      <CategoriesGrid />

      {/* Feature Products Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer(0.1, 0.1)}
          className="container mx-auto px-4"
        >
          <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              OUR FEATURED PRODUCTS
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Shop our best arrivals from established brands</p>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((productItem, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "tween", index * 0.1, 0.5)}
                className="relative group overflow-hidden rounded-2xl shadow-2xl bg-gray-800"
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[3/4] relative">
                  <motion.img
                    src={productItem.images[0]}
                    alt={productItem.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{productItem.name}</h3>
                  <p className="text-gray-300">Kes {productItem.price}</p>
                </div>
                <motion.div
                  className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 pb-6"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={() => router.push(`/listing/${productItem.id}`)}
                    className="bg-white text-black hover:bg-gray-100 px-6 py-4 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    QUICK VIEW
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
      <StoreLocation />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer(0.1, 0.1)}
          className="container mx-auto px-4 text-center"
        >
          <motion.h2 variants={fadeIn("up", "tween", 0.2, 1)} className="text-4xl font-bold mb-6 text-white">
            JOIN OUR NEWSLETTER
          </motion.h2>
          <motion.p variants={fadeIn("up", "tween", 0.4, 1)} className="text-gray-300 max-w-2xl mx-auto mb-8">
            Get 15% off your first order and be the first to know about new products and offers
          </motion.p>
          <motion.div
            variants={fadeIn("up", "tween", 0.6, 1)}
            className="flex items-center flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={subscriptionEmail}
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full"
              disabled={!subscriptionEmail}
              onClick={async () => {
                try {
                  const token = await getFCMToken();
                  const response = await subscribe(subscriptionEmail, token || "");
                  console.log("Subscription:", response);
                  setSubscriptionEmail("");
                  if (response.success) {
                    toast({
                      title: "Thank you for subscribing with us!, we'll get in touch",
                    });
                  }
                } catch (error: any) {
                  toast({
                    title: "An Error occured: " + error.message,
                  });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SUBSCRIBE
            </Button>
            {/* {error && <p className="error">{error.message}</p>} */}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;
