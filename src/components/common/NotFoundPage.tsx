"use client";
// components/NotFoundPage.tsx
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-100/50 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center gap-6 text-center"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-amber-100 p-6"
        >
          <FiAlertTriangle className="text-6xl text-rose-600" />
        </motion.div>

        <motion.h1
          className="text-5xl font-bold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          404 - Page Not Found
        </motion.h1>

        <motion.p
          className="max-w-md text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
