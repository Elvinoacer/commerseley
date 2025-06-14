"use client";
import { Building2, MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/additions/MapComponent"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(to bottom right, var(--gradient-from, #1f2937), var(--gradient-to, #111827))",
      }}
    >
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Loading Map...</h3>
        <div className="animate-pulse flex space-x-2 justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
        </div>
      </div>
    </div>
  ),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function AboutPage() {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const storeLocation = {
    lat: -1.286389,
    lng: 36.817223,
    address: "123 Fashion Avenue, Nairobi, Kenya",
  };

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading for demo; replace with actual data fetching if needed
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen  transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          ) : (
            <>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-white to-gray-300"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                Our Story
              </h1>
              <p
                className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Commersely is more than just a store - we're a community passionate about bringing you the best products
                with exceptional service.
              </p>
            </>
          )}
        </motion.div>

        {/* Who We Are & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <motion.div
            variants={itemVariants}
            className={`p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
            }`}
            whileHover={{ y: -4 }}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <Building2 className={`w-8 h-8 mr-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
                  <h2 className={`text-xl sm:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Who We Are
                  </h2>
                </div>
                <p className={`text-sm sm:text-base mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Founded in 2023, Commersely began with a simple mission: to create an online shopping experience
                  that's enjoyable, reliable, and human.
                </p>
                <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Our team of passionate individuals works tirelessly to curate products we truly believe in and deliver
                  them with care.
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
              theme === "dark"
                ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
            }`}
            whileHover={{ y: -4 }}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <Globe className={`w-8 h-8 mr-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
                  <h2 className={`text-xl sm:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Our Mission
                  </h2>
                </div>
                <p className={`text-sm sm:text-base mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  To redefine e-commerce by prioritizing quality over quantity, relationships over transactions, and
                  sustainability over short-term gains.
                </p>
                <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  We believe shopping should be an experience that leaves you excited, not exhausted.
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Visit Us Section */}
        <motion.div
          variants={itemVariants}
          className={`rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto border ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700/30" : "bg-white/80 border-gray-200/30"
          }`}
        >
          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mt-1"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h2
                  className={`text-2xl sm:text-3xl font-bold mb-8 text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Visit Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin
                        className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-base sm:text-lg mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Address
                        </h3>
                        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {storeLocation.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone
                        className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-base sm:text-lg mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Phone
                        </h3>
                        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          +254 700 123456
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail
                        className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-base sm:text-lg mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Email
                        </h3>
                        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          hello@commersely.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock
                        className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-base sm:text-lg mb-1 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Hours
                        </h3>
                        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Monday - Friday: 9AM - 6PM
                          <br />
                          Saturday: 10AM - 4PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Interactive Map */}
          <motion.div
            variants={itemVariants}
            className="relative h-64 sm:h-80 md:h-96 rounded-b-xl overflow-hidden z-0"
            whileHover={{ scale: 1.02 }}
            style={{
              borderColor: theme === "dark" ? "rgba(55, 65, 81, 0.3)" : "rgba(229, 231, 235, 0.3)",
            }}
          >
            {isMounted && (
              <div className="relative h-full w-full z-0">
                <MapWithNoSSR lat={storeLocation.lat} lng={storeLocation.lng} address={storeLocation.address} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
