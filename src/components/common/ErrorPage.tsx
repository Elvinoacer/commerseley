"use client";
import { motion } from "framer-motion";
import { FiAlertOctagon } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "next-themes";

export function ErrorPage({ error }: { error?: Error }) {
  const { theme } = useTheme();

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-red-50 via-orange-50 to-amber-50"
      }`}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(45deg, #4f46e5, #9333ea, #db2777, #4f46e5)"
              : "linear-gradient(45deg, #fecaca, #fed7aa, #fde68a, #fecaca)",
          backgroundSize: "300% 300%",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className={`absolute inset-0 opacity-5 ${
          theme === "dark"
            ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzNzNmNDYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]'
            : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWY1ZjkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]'
        }`}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center sm:px-8 sm:py-16 md:gap-8"
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
          className={`text-6xl ${theme === "dark" ? "text-red-400" : "text-red-500"}`}
        >
          <FiAlertOctagon />
        </motion.div>

        <motion.h1
          className={`text-3xl font-bold sm:text-4xl md:text-5xl ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Something Went Wrong
        </motion.h1>

        {error && (
          <motion.p
            className={`max-w-lg rounded-lg p-4 font-mono text-sm ${
              theme === "dark" ? "bg-gray-800/50 text-red-300" : "bg-red-100/50 text-red-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error.message}
          </motion.p>
        )}

        <motion.p
          className={`max-w-md ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
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
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={() => window.location.reload()}
            className={`rounded-lg px-6 py-3 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-600 to-orange-600 text-white focus:ring-red-500"
                : "bg-gradient-to-r from-red-500 to-orange-500 text-white focus:ring-red-400"
            }`}
          >
            Try Again
          </button>

          <Link
            href="/"
            className={`rounded-lg px-6 py-3 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gray-700 text-gray-100 focus:ring-gray-500"
                : "bg-white text-gray-800 focus:ring-gray-400"
            }`}
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
