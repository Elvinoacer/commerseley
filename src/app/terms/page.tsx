"use client";

import { FileText, ClipboardList, CreditCard, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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

export default function TermsPage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

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
      className={`min-h-screen  transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <div
                  className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-full mb-4 sm:mb-6 ${
                    theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-100"
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
                  />
                </div>
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white to-gray-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Terms of Service
                </h1>
                <p
                  className={`text-base sm:text-lg md:text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  Last updated: June 14, 2025
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
          >
            {isLoading ? (
              <div className="animate-pulse space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose max-w-none">
                <section className="mb-8 sm:mb-10">
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <ClipboardList
                      className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    General Terms
                  </h2>
                  <p
                    className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    By accessing and using the Commersely website, you accept and agree to be bound by these Terms of
                    Service. If you do not agree, you may not use our services.
                  </p>
                </section>

                <section className="mb-8 sm:mb-10">
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    Purchases & Payments
                  </h2>
                  <p
                    className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    All purchases are subject to availability. We reserve the right to limit quantities and to
                    discontinue products at any time without notice.
                  </p>
                  <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Prices are subject to change without notice. We are not responsible for typographical errors
                    regarding price or product information.
                  </p>
                </section>

                <section className="mb-8 sm:mb-10">
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Truck
                      className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    Shipping & Delivery
                  </h2>
                  <p
                    className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Shipping times are estimates and not guaranteed. We are not responsible for delays caused by
                    carriers or customs.
                  </p>
                  <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Risk of loss and title for items purchased pass to you upon our delivery to the carrier.
                  </p>
                </section>

                <section className="mb-8 sm:mb-10">
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <AlertCircle
                      className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    Returns & Refunds
                  </h2>
                  <p
                    className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    We accept returns within 30 days of purchase for most items in original condition. Some items may be
                    final sale.
                  </p>
                  <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Refunds will be issued to the original payment method. Shipping costs are non-refundable.
                  </p>
                </section>

                <section>
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Changes to Terms
                  </h2>
                  <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    We reserve the right to update or modify these Terms at any time without prior notice. Your
                    continued use of the service constitutes acceptance of the updated Terms.
                  </p>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
