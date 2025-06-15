"use client";

import { FileText, ClipboardList, CreditCard, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function TermsPage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading; replace with actual data fetching if needed
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* Subtle radial gradient overlay */}
      <div
        className={`absolute inset-0 opacity-10 pointer-events-none ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"
            : "bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-100/60 via-transparent to-transparent"
        }`}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <div
                  className={`inline-flex items-center justify-center p-2 sm:p-3 rounded-full mb-3 sm:mb-4 shadow-sm ${
                    theme === "dark" ? "bg-indigo-900/60" : "bg-indigo-50"
                  }`}
                >
                  <FileText
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
                  />
                </div>
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-300 to-purple-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Terms of Service
                </h1>
                <p
                  className={`text-xs sm:text-sm lg:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  Last updated: June 14, 2025
                </p>
              </>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`p-4 sm:p-6 rounded-lg shadow-sm backdrop-blur-sm border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800/60 border-gray-700/50 hover:shadow-indigo-500/10"
                : "bg-white/80 border-gray-200/50 hover:shadow-gray-300/20"
            }`}
            role="region"
            aria-labelledby="terms-heading"
          >
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8 prose max-w-none">
                <section className="mb-6 sm:mb-8">
                  <h2
                    id="general-terms"
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <ClipboardList
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      aria-hidden="true"
                    />
                    General Terms
                  </h2>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    By accessing and using the Commersely website, you accept and agree to be bound by these Terms of
                    Service. If you do not agree, you may not use our services.
                  </p>
                </section>

                <section className="mb-6 sm:mb-8">
                  <h2
                    id="purchases-payments"
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <CreditCard
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      aria-hidden="true"
                    />
                    Purchases & Payments
                  </h2>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words mb-2 sm:mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    All purchases are subject to availability. We reserve the right to limit quantities and to
                    discontinue products at any time without notice.
                  </p>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Prices are subject to change without notice. We are not responsible for typographical errors
                    regarding price or product information.
                  </p>
                </section>

                <section className="mb-6 sm:mb-8">
                  <h2
                    id="shipping-delivery"
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Truck
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      aria-hidden="true"
                    />
                    Shipping & Delivery
                  </h2>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words mb-2 sm:mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Shipping times are estimates and not guaranteed. We are not responsible for delays caused by
                    carriers or customs.
                  </p>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Risk of loss and title for items purchased pass to you upon our delivery to the carrier.
                  </p>
                </section>

                <section className="mb-6 sm:mb-8">
                  <h2
                    id="returns-refunds"
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <AlertCircle
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      aria-hidden="true"
                    />
                    Returns & Refunds
                  </h2>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words mb-2 sm:mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    We accept returns within 30 days of purchase for most items in original condition. Some items may be
                    final sale.
                  </p>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Refunds will be issued to the original payment method. Shipping costs are non-refundable.
                  </p>
                </section>

                <section>
                  <h2
                    id="changes-terms"
                    className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Changes to Terms
                  </h2>
                  <p
                    className={`text-xs sm:text-sm lg:text-base text-wrap break-words ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
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
