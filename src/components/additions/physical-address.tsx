"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { getAddressFromCoords } from "./geocoding";

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

const StoreLocation = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storeLocation, setStoreLocation] = useState({
    lat: -1.286389,
    lng: 36.817223,
    address: "123 Fashion Avenue, Nairobi, Kenya",
  });

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(false); // Adjust based on actual data fetching
    const getLocation = async () => {
      try {
        if (window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
            async (position) => {
              const response = await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
              setStoreLocation({
                address: response || "123 Fashion Avenue, Nairobi, Kenya",
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setIsLoading(false);
            },
            (error) => {
              console.error("Error getting location:", error);
              setIsLoading(false);
            }
          );
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setIsLoading(false);
      }
    };
    getLocation();
  }, []);

  return (
    <section
      className={`relative pt-24 pb-16 sm:pt-28 sm:pb-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${
              theme === "dark"
                ? "from-blue-500/15 via-purple-500/10 to-transparent"
                : "from-blue-200/15 via-purple-200/10 to-transparent"
            } rounded-full`}
          />
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] ${
              theme === "dark"
                ? "from-emerald-400/15 via-teal-400/10 to-transparent"
                : "from-emerald-200/15 via-teal-200/10 to-transparent"
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
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-gray-300"
                : "bg-gradient-to-r from-gray-800 to-blue-600"
            } mb-4`}
          >
            Visit Our Store
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className={`text-base sm:text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Experience our premium products in person at our flagship location in Nairobi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Store Info Card */}
          {isLoading ? (
            <div
              className={`rounded-3xl p-8 sm:p-10 animate-pulse ${
                theme === "dark" ? "bg-gray-800/50" : "bg-gray-200/50"
              } backdrop-blur-sm shadow-2xl border ${theme === "dark" ? "border-gray-700/30" : "border-gray-200/30"}`}
            >
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-full bg-gray-300/50 dark:bg-gray-700/50 w-14 h-14"></div>
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                  <div className="h-4 w-60 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                </div>
              </div>
              <div className="space-y-6">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-2 h-2 mt-1 rounded-full bg-gray-300/50 dark:bg-gray-700/50"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                        <div className="h-4 w-48 bg-gray-300/50 dark:bg-gray-700/50 rounded"></div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-8 h-12 w-full sm:w-48 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border ${
                theme === "dark"
                  ? "from-gray-800/50 to-gray-900/80 border-gray-700/30 hover:shadow-white/10"
                  : "from-white/50 to-gray-100/80 border-gray-200/30 hover:shadow-gray-300/20"
              }`}
            >
              <div className="flex items-start gap-4 mb-8">
                <motion.div
                  className={`p-3 rounded-full ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-200/20"}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className={`w-8 h-8 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                </motion.div>
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-2`}
                  >
                    Our Location
                  </h3>
                  <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Visit us to explore our exclusive collections.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <h4
                      className={`text-base sm:text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Address
                    </h4>
                    <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {storeLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <h4
                      className={`text-base sm:text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Hours
                    </h4>
                    <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Monday - Friday: 9AM - 8PM
                      <br />
                      Saturday: 10AM - 7PM
                      <br />
                      Sunday: 11AM - 5PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                  </div>
                  <div>
                    <h4
                      className={`text-base sm:text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Contact
                    </h4>
                    <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Phone: +254 700 123456
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
                  scale: 1.03,
                  boxShadow: theme === "dark" ? "0 4px 12px rgba(255,255,255,0.2)" : "0 4px 12px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                className={`inline-block mt-8 w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium text-center transition-all ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white"
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
            className="relative h-80 sm:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border"
            whileHover={{ scale: 1.02 }}
            style={{ borderColor: theme === "dark" ? "rgba(55, 65, 81, 0.3)" : "rgba(229, 231, 235, 0.3)" }}
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
