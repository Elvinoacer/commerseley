"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { getAddressFromCoords } from "./geocoding";

// Default store location (Nairobi coordinates)
const DEFAULT_STORE_LOCATION = {
  lat: -1.286389,
  lng: 36.817223,
  address: "123 Fashion Avenue, Nairobi, Kenya",
};

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: "linear-gradient(to bottom right, var(--gradient-from, #1f2937), var(--gradient-to, #111827))",
      }}
    >
      <div className="text-center p-4 sm:p-6">
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-blue-500/30 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-pulse" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Loading Map...</h3>
        <div className="animate-pulse flex space-x-1.5 sm:space-x-2 justify-center">
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-400"></div>
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-400"></div>
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-400"></div>
        </div>
      </div>
    </div>
  ),
});

const StoreLocation = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeLocation, setStoreLocation] = useState(DEFAULT_STORE_LOCATION);

  useEffect(() => {
    setIsMounted(true);

    // Try to get more accurate address from coordinates
    const fetchAddress = async () => {
      try {
        const address = await getAddressFromCoords(DEFAULT_STORE_LOCATION.lat, DEFAULT_STORE_LOCATION.lng);
        if (address) {
          setStoreLocation((prev) => ({
            ...prev,
            address,
          }));
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, []);

  // Rest of the component remains the same...
  return (
    <section
      className={`relative py-12 sm:py-16 md:py-20 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900"
          : "bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50"
      }`}
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${
              theme === "dark"
                ? "from-blue-600/20 via-purple-600/15 to-transparent"
                : "from-blue-300/30 via-purple-300/15 to-transparent"
            } rounded-full`}
          />
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_30%_var(--tw-gradient-stops))] ${
              theme === "dark"
                ? "from-emerald-500/20 via-teal-500/15 to-transparent"
                : "from-emerald-300/30 via-teal-300/15 to-transparent"
            } rounded-full`}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
            } mb-2 sm:mb-3`}
          >
            Visit Our Store
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-xs sm:text-sm md:text-base max-w-md sm:max-w-lg mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Experience our premium products in person at our flagship location in Nairobi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Store Info Card */}
          {isLoading ? (
            <div
              className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-pulse ${
                theme === "dark" ? "bg-gray-800/60" : "bg-gray-200/60"
              } backdrop-blur-md shadow-lg border ${theme === "dark" ? "border-indigo-500/30" : "border-gray-200/30"}`}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 rounded-full bg-gray-300/50 dark:bg-gray-700/50 w-10 h-10 sm:w-12 sm:h-12"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 sm:w-40 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                  <div className="h-3 w-48 sm:w-60 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 rounded-full bg-gray-300/50 dark:bg-gray-700/50"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 sm:w-24 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                        <div className="h-3 w-36 sm:w-48 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-6 sm:mt-8 h-10 w-full sm:w-40 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border transition-all duration-300 ${
                theme === "dark"
                  ? "from-gray-800/60 to-indigo-900/60 border-indigo-500/30 hover:border-indigo-500/50"
                  : "from-white/70 to-blue-50/70 border-gray-200/30 hover:border-gray-300/50"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <motion.div
                  className={`p-2 sm:p-3 rounded-full ${theme === "dark" ? "bg-blue-600/30" : "bg-blue-300/30"}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                </motion.div>
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-1 sm:mb-2`}
                  >
                    Our Location
                  </h3>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Visit us to explore our exclusive collections.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm sm:text-base font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Address
                    </h4>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {storeLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm sm:text-base font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Hours
                    </h4>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Monday - Friday: 9AM - 8PM
                      <br />
                      Saturday: 10AM - 7PM
                      <br />
                      Sunday: 11AM - 5PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h4
                      className={`text-sm sm:text-base font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Contact
                    </h4>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Phone: +254 792 156094
                      <br />
                      Email: hello@store.com
                    </p>
                  </div>
                </div>
              </div>

              <motion.a
                href={`https://www.google.com/maps/dir/?api=1&destination=${storeLocation.lat},${storeLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    theme === "dark" ? "0 6px 16px rgba(59, 130, 246, 0.4)" : "0 6px 16px rgba(29, 78, 216, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className={`inline-block mt-6 sm:mt-8 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-center transition-all touch-manipulation ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                }`}
              >
                Get Directions
              </motion.a>
            </motion.div>
          )}

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className={`relative h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border transition-all duration-300 ${
              theme === "dark"
                ? "border-indigo-500/30 hover:border-indigo-500/50"
                : "border-gray-200/30 hover:border-gray-300/50"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            {isMounted && (
              <MapWithNoSSR lat={storeLocation.lat} lng={storeLocation.lng} address={storeLocation.address} />
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default StoreLocation;
