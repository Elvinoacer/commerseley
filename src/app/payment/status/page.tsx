// app/payment/status/page.tsx
"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // 'success' or 'failure'
  const message = searchParams.get("message") || "";

  const isSuccess = status === "success";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10,
      },
    },
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      {/* Radial gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full ${
            isSuccess
              ? "bg-emerald-500/10 dark:bg-emerald-400/5 animate-gradient-pulse"
              : "bg-rose-500/10 dark:bg-rose-400/5 animate-gradient-pulse"
          }`}
        ></div>
        <div
          className={`absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] rounded-full ${
            isSuccess
              ? "bg-indigo-500/10 dark:bg-indigo-400/5 animate-gradient-pulse delay-1000"
              : "bg-amber-500/10 dark:bg-amber-400/5 animate-gradient-pulse delay-1000"
          }`}
        ></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 text-center"
      >
        {/* Icon */}
        <motion.div variants={iconVariants} className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="relative">
              <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-500 dark:text-emerald-400" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute inset-0 rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 -z-10"
              />
            </div>
          ) : (
            <div className="relative">
              <XCircle className="w-20 h-20 sm:w-24 sm:h-24 text-rose-500 dark:text-rose-400" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute inset-0 rounded-full bg-rose-100/50 dark:bg-rose-900/20 -z-10"
              />
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className={`text-2xl sm:text-3xl font-bold mb-2 ${
            isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </motion.h1>

        {/* Message */}
        {message && (
          <motion.p
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            {message}
          </motion.p>
        )}

        <motion.p
          variants={itemVariants}
          className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base"
        >
          {isSuccess
            ? "Your transaction was completed successfully."
            : "We encountered an issue processing your payment. Please try again."}
        </motion.p>

        {/* Button */}
        <motion.div variants={itemVariants}>
          <Link
            href={isSuccess ? "/dashboard" : "/checkout"}
            className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 sm:px-6 sm:py-3 font-medium text-white shadow-sm transition-all ${
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-emerald-500/30"
                : "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 shadow-rose-500/30"
            } text-sm sm:text-base w-full sm:w-auto`}
          >
            {isSuccess ? "Go to Dashboard" : "Try Again"}
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">
              {isSuccess ? "→" : "↻"}
            </motion.span>
          </Link>
        </motion.div>

        {/* Additional info */}
        <motion.div
          variants={itemVariants}
          className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
        >
          {isSuccess ? (
            <p>An email receipt has been sent to your inbox.</p>
          ) : (
            <p>If the problem persists, please contact support.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
