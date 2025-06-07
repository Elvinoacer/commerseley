"use client";
// components/ErrorPage.tsx
import { motion } from "framer-motion";
import { FiAlertOctagon } from "react-icons/fi";
import Link from "next/link";

export function ErrorPage({ error }: { error?: Error }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-100/50 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center justify-center gap-6 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="text-6xl text-red-500"
        >
          <FiAlertOctagon />
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Something Went Wrong
        </motion.h1>

        {error && (
          <motion.p
            className="max-w-lg rounded-lg bg-red-100/50 p-4 font-mono text-sm text-red-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error.message}
          </motion.p>
        )}

        <motion.p
          className="max-w-md text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          We're sorry for the inconvenience. Please try again later.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4"
        >
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg bg-white px-6 py-3 font-medium text-gray-800 shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
