"use client";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-rose-50 to-amber-50"
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
              : "linear-gradient(45deg, #fecdd3, #fde68a, #fcd34d, #fecdd3)",
          backgroundSize: "300% 300%",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className={`absolute inset-0 opacity-10 ${
          theme === "dark"
            ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzNzNmNDYiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]'
            : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWY1ZjkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")]'
        }`}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center sm:px-8 sm:py-16 md:gap-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            delay: 0.2,
            rotate: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
          className={`flex items-center justify-center rounded-full p-6 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-800 to-gray-700"
              : "bg-gradient-to-br from-rose-100 to-amber-100"
          } shadow-lg`}
        >
          <FiAlertTriangle className={`text-5xl sm:text-6xl ${theme === "dark" ? "text-rose-400" : "text-rose-600"}`} />
        </motion.div>

        <motion.h1
          className={`text-4xl font-bold sm:text-5xl md:text-6xl ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          404 - Page Not Found
        </motion.h1>

        <motion.p
          className={`max-w-md text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className={`inline-flex items-center rounded-lg px-6 py-3 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white focus:ring-rose-500"
                : "bg-gradient-to-r from-rose-500 to-amber-500 text-white focus:ring-rose-400"
            }`}
          >
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={`inline-flex items-center rounded-lg px-6 py-3 font-medium shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gray-700 text-gray-100 focus:ring-gray-500"
                : "bg-white text-gray-800 focus:ring-gray-400"
            }`}
          >
            Go Back
          </button>
        </motion.div>

        {/* Optional decorative elements */}
        <motion.div
          className="mt-8 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 w-1 rounded-full ${theme === "dark" ? "bg-rose-400" : "bg-rose-500"}`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
