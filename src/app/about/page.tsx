"use client";
import { Building2, MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/additions/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center p-6 max-w-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Loading Map...</h3>
        <div className="animate-pulse flex space-x-2 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
          ))}
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
      staggerChildren: 0.15,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const cardHover = {
  hover: {
    y: -5,
    scale: 1.01,
    transition: {
      duration: 0.3,
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
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center mb-10 sm:mb-14 lg:mb-20">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 sm:h-12 w-64 sm:w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto"></div>
              <div className="h-6 w-3/4 sm:w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-300 to-indigo-400"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600"
                }`}
              >
                Our Story
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Commersely is more than just a store - we're a community passionate about bringing you the best products
                with exceptional service.
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Who We Are & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className={`p-6 sm:p-8 rounded-2xl shadow-md transition-all duration-300 border ${
              theme === "dark"
                ? "bg-gray-800/70 border-gray-700/50 hover:shadow-indigo-500/10"
                : "bg-white/90 border-gray-200/50 hover:shadow-indigo-200/30"
            }`}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <Building2
                    className={`w-10 h-10 mr-4 p-2 rounded-full ${
                      theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                    }`}
                  />
                  <h2 className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Who We Are
                  </h2>
                </div>
                <div className="space-y-4">
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Founded in 2023, Commersely began with a simple mission: to create an online shopping experience
                    that's enjoyable, reliable, and human.
                  </p>
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Our team of passionate individuals works tirelessly to curate products we truly believe in and
                    deliver them with care.
                  </p>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className={`p-6 sm:p-8 rounded-2xl shadow-md transition-all duration-300 border ${
              theme === "dark"
                ? "bg-gray-800/70 border-gray-700/50 hover:shadow-indigo-500/10"
                : "bg-white/90 border-gray-200/50 hover:shadow-indigo-200/30"
            }`}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <Globe
                    className={`w-10 h-10 mr-4 p-2 rounded-full ${
                      theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                    }`}
                  />
                  <h2 className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Our Mission
                  </h2>
                </div>
                <div className="space-y-4">
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    To redefine e-commerce by prioritizing quality over quantity, relationships over transactions, and
                    sustainability over short-term gains.
                  </p>
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    We believe shopping should be an experience that leaves you excited, not exhausted.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Visit Us Section */}
        <motion.div
          variants={itemVariants}
          className={`rounded-2xl shadow-lg overflow-hidden max-w-6xl mx-auto border transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-800/70 border-gray-700/50" : "bg-white/90 border-gray-200/50"
          }`}
        >
          <div className="p-6 sm:p-8 lg:p-10">
            {isLoading ? (
              <div className="animate-pulse space-y-8">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mt-1"></div>
                      <div className="space-y-3 flex-1">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`text-3xl sm:text-4xl font-bold mb-10 text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Visit Us
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <MapPin
                        className={`w-8 h-8 mt-1 mr-4 p-2 rounded-full flex-shrink-0 ${
                          theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          Address
                        </h3>
                        <p className={`text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {storeLocation.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone
                        className={`w-8 h-8 mt-1 mr-4 p-2 rounded-full flex-shrink-0 ${
                          theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          Phone
                        </h3>
                        <p className={`text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          +254 700 123456
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-start">
                      <Mail
                        className={`w-8 h-8 mt-1 mr-4 p-2 rounded-full flex-shrink-0 ${
                          theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          Email
                        </h3>
                        <p className={`text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          hello@commersely.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock
                        className={`w-8 h-8 mt-1 mr-4 p-2 rounded-full flex-shrink-0 ${
                          theme === "dark" ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold text-xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          Hours
                        </h3>
                        <p className={`text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
            className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-b-2xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {isMounted && (
              <div className="relative h-full w-full">
                <MapWithNoSSR lat={storeLocation.lat} lng={storeLocation.lng} address={storeLocation.address} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
