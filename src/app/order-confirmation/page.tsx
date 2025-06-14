"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package, Truck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleViewOrders = () => {
    router.push("/account");
  };

  // Colors that adapt to theme
  const primaryColor = theme === "dark" ? "from-indigo-700 to-purple-700" : "from-indigo-600 to-purple-600";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const secondaryTextColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const timelineBg = theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const timelineIconColor = theme === "dark" ? "text-indigo-400" : "text-indigo-600";
  const timelineLineColor = theme === "dark" ? "bg-gray-600" : "bg-gray-200";
  const outlineButtonBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const pageBg =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-br from-gray-50 to-indigo-50";

  return (
    <div className={`min-h-screen ${pageBg} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto relative"
          >
            {/* Confirmation Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`${cardBg} rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 mx-2 sm:mx-0`}
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${primaryColor} p-6 sm:p-8 text-white`}>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">Order Confirmed!</h1>
                  <p className="mt-1 sm:mt-2 text-indigo-100/80 text-center text-sm sm:text-base">
                    Thank you for your purchase
                  </p>
                </motion.div>
              </div>

              {/* Order Details */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6 sm:mb-8"
                >
                  <h2 className={`text-base sm:text-lg font-semibold ${textColor} mb-3 sm:mb-4`}>Order Summary</h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className={secondaryTextColor}>Order Number</span>
                      <span className={`font-medium ${textColor}`}>#ORD-123456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={secondaryTextColor}>Date</span>
                      <span className={`font-medium ${textColor}`}>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={secondaryTextColor}>Total Amount</span>
                      <span className={`font-medium ${textColor}`}>Kes 12,345.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={secondaryTextColor}>Payment Method</span>
                      <span className={`font-medium ${textColor}`}>Pay Now</span>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6 sm:mb-8"
                >
                  <h2 className={`text-base sm:text-lg font-semibold ${textColor} mb-3 sm:mb-4`}>Delivery Status</h2>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className={`absolute left-4 top-0 h-full w-0.5 ${timelineLineColor}`}></div>

                    {/* Timeline items */}
                    <div className="space-y-4 sm:space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="relative flex items-start"
                      >
                        <div
                          className={`absolute left-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${timelineBg} ${timelineIconColor}`}
                        >
                          <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <div className="ml-9 sm:ml-12">
                          <h3 className={`font-medium ${textColor} text-sm sm:text-base`}>Order Processed</h3>
                          <p className={`text-xs sm:text-sm ${mutedTextColor} mt-1`}>We've received your order</p>
                          <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"} mt-1`}>
                            Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="relative flex items-start"
                      >
                        <div
                          className={`absolute left-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${timelineBg} ${timelineIconColor}`}
                        >
                          <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <div className="ml-9 sm:ml-12">
                          <h3 className={`font-medium ${textColor} text-sm sm:text-base`}>Order Shipped</h3>
                          <p className={`text-xs sm:text-sm ${mutedTextColor} mt-1`}>Your order is on the way</p>
                          <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"} mt-1`}>
                            Estimated: Tomorrow
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="relative flex items-start"
                      >
                        <div
                          className={`absolute left-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${timelineBg} ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                        <div className="ml-9 sm:ml-12">
                          <h3
                            className={`font-medium ${
                              theme === "dark" ? "text-gray-500" : "text-gray-400"
                            } text-sm sm:text-base`}
                          >
                            Order Delivered
                          </h3>
                          <p
                            className={`text-xs sm:text-sm ${
                              theme === "dark" ? "text-gray-500" : "text-gray-400"
                            } mt-1`}
                          >
                            Expected in 2-3 business days
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <Button
                    onClick={handleViewOrders}
                    className={`w-full bg-gradient-to-r ${primaryColor} hover:from-indigo-700 hover:to-purple-700 text-white py-4 sm:py-6 text-base sm:text-lg font-bold rounded-lg shadow-lg transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Orders
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full ${
                      theme === "dark" ? "border-gray-600" : "border-gray-300"
                    } ${outlineButtonBg} rounded-lg py-4 sm:py-6 text-base sm:text-lg transition-colors`}
                    onClick={() => router.push("/listing")}
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Confetti Effect - Fixed positioning */}
            <AnimatePresence>
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, Math.random() * 100 + 50],
                    x: Math.random() * 80 - 40, // Constrained to -40 to 40vw
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  className="absolute text-yellow-400 text-xl sm:text-2xl pointer-events-none"
                  style={{
                    left: `${50 + (Math.random() * 20 - 10)}%`, // Center with slight variation
                    top: "10%",
                  }}
                >
                  {["🎉", "✨", "🎊", "💫", "🌟"][i % 5]}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
