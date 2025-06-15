"use client";

import { Shield, Lock, EyeOff, Server } from "lucide-react";
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

export default function PrivacyPage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading for demo; replace with actual data fetching if needed
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-8 w-48 sm:h-10 sm:w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-4 w-32 sm:h-6 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-full mb-3 sm:mb-4 ${
                    theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-100"
                  }`}
                >
                  <Shield
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
                  />
                </div>
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white to-gray-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Privacy Policy
                </h1>
                <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Last updated: June 14, 2025
                </p>
              </>
            )}
          </motion.div>

          {/* Content Card */}
          <motion.div
            variants={itemVariants}
            className={`p-5 sm:p-6 rounded-lg shadow-md backdrop-blur-sm border ${
              theme === "dark" ? "bg-gray-800/50 border-gray-700/30" : "bg-white/80 border-gray-200/30"
            }`}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-5 w-40 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {i === 1 && (
                      <div className="space-y-1.5 pl-5">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Introduction Section */}
                <section className="space-y-3 sm:space-y-4">
                  <h2
                    className={`text-lg sm:text-xl font-bold flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Lock
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    Introduction
                  </h2>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    At Commersely, we are committed to protecting your privacy. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when you visit our website or make a
                    purchase.
                  </p>
                </section>

                {/* Information Collection Section */}
                <section className="space-y-3 sm:space-y-4">
                  <h2
                    className={`text-lg sm:text-xl font-bold flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <EyeOff
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    Information We Collect
                  </h2>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul
                    className={`list-disc pl-5 space-y-1 text-xs sm:text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <li>Register an account</li>
                    <li>Make a purchase</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact customer support</li>
                  </ul>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    This information may include your name, email address, phone number, payment information, and
                    mailing address.
                  </p>
                </section>

                {/* Information Usage Section */}
                <section className="space-y-3 sm:space-y-4">
                  <h2
                    className={`text-lg sm:text-xl font-bold flex items-center ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Server
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    />
                    How We Use Your Information
                  </h2>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    We use the information we collect to:
                  </p>
                  <ul
                    className={`list-disc pl-5 space-y-1 text-xs sm:text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders</li>
                    <li>Improve our products and services</li>
                    <li>Prevent fraudulent transactions</li>
                    <li>Send promotional communications (if you opt-in)</li>
                  </ul>
                </section>

                {/* Data Security Section */}
                <section className="space-y-3 sm:space-y-4">
                  <h2 className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Data Security
                  </h2>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    We implement security measures designed to protect your information from unauthorized access,
                    alteration, or disclosure. All transactions are processed through a gateway provider and are not
                    stored or processed on our servers.
                  </p>
                </section>

                {/* Changes Section */}
                <section className="space-y-3 sm:space-y-4">
                  <h2 className={`text-lg sm:text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Changes to This Privacy Policy
                  </h2>
                  <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                    the new Privacy Policy on this page and updating the "Last updated" date.
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
