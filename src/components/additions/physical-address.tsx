"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getAddressFromCoords } from "./geocoding";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Loading Map...</h3>
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
        </div>
      </div>
    </div>
  ),
});

const StoreLocation = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [storeLocation, setStoreLocation] = useState({
    lat: -1.286389,
    lng: 36.817223,
    address: "123 Fashion Avenue, Nairobi, Kenya",
  });

  useEffect(() => {
    setIsMounted(true);
    function getLocation() {
      window.navigator.geolocation.getCurrentPosition(
        async (e) => {
          const response = await getAddressFromCoords(e.coords.latitude, e.coords.longitude);
          setStoreLocation({ address: response || "", lat: e.coords.latitude, lng: e.coords.longitude });
        },
        (e) => {
          console.log("Error getting your location");
        }
      );
    }
    getLocation();
  }, []);

  // Coordinates for Nairobi, Kenya

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/5 to-transparent rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] from-emerald-400/10 via-teal-400/5 to-transparent rounded-full" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mb-4"
          >
            Visit Our Store
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Experience our products in person at our flagship location
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Store Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-700/30"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-full bg-blue-500/10">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Our Location</h3>
                <p className="text-gray-300">Come see us in person</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Address</h4>
                  <p className="text-gray-300">
                    123 Fashion Avenue
                    <br />
                    Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Hours</h4>
                  <p className="text-gray-300">
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
                  <h4 className="text-lg font-semibold text-white">Contact</h4>
                  <p className="text-gray-300">
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block mt-8 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all text-center"
            >
              Get Directions
            </motion.a>
          </motion.div>

          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 lg:h-full rounded-3xl overflow-hidden shadow-2xl border border-gray-700/30"
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
