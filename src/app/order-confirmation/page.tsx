"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Package, Truck, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleViewOrders = () => {
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Confirmation Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-white">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 className="h-16 w-16 mb-4" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-center">Order Confirmed!</h1>
                  <p className="mt-2 text-indigo-100 text-center">Thank you for your purchase</p>
                </motion.div>
              </div>

              {/* Order Details */}
              <div className="p-6 sm:p-8">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number</span>
                      <span className="font-medium">#ORD-123456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">Kes 12,345.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">Pay Now</span>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Status</h2>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                    {/* Timeline items */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="relative flex items-start"
                      >
                        <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                          <Package className="h-4 w-4" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-medium text-gray-800">Order Processed</h3>
                          <p className="text-sm text-gray-500 mt-1">We've received your order</p>
                          <p className="text-xs text-gray-400 mt-1">
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
                        <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-medium text-gray-800">Order Shipped</h3>
                          <p className="text-sm text-gray-500 mt-1">Your order is on the way</p>
                          <p className="text-xs text-gray-400 mt-1">Estimated: Tomorrow</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="relative flex items-start"
                      >
                        <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="ml-12">
                          <h3 className="font-medium text-gray-400">Order Delivered</h3>
                          <p className="text-sm text-gray-400 mt-1">Expected in 2-3 business days</p>
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
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    onClick={handleViewOrders}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-bold rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 rounded-lg py-6 text-lg"
                    onClick={() => router.push("/listing")}
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Confetti Effect */}
            <AnimatePresence>
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20, x: Math.random() * 100 - 50 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, Math.random() * 100 + 50],
                    x: Math.random() * 100 - 50,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  className="absolute text-yellow-400 text-2xl"
                  style={{
                    left: `${Math.random() * 100}%`,
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
