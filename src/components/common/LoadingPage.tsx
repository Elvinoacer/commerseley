"use client";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { useTheme } from "next-themes";

export function LoadingPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
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
              : "linear-gradient(45deg, #a5b4fc, #c7d2fe, #e9d5ff, #a5b4fc)",
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center sm:px-8 sm:py-16 md:gap-8"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 1.8,
              ease: "linear",
            },
            scale: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          className={`text-5xl sm:text-6xl ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
        >
          <FiLoader />
        </motion.div>

        <motion.h1
          className={`text-3xl font-bold sm:text-4xl md:text-5xl ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading<span className="animate-pulse">...</span>
        </motion.h1>

        <motion.p
          className={`max-w-md text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Preparing your experience<span className="animate-pulse">...</span>
        </motion.p>

        <motion.div
          className="mt-4 h-2.5 w-64 overflow-hidden rounded-full sm:w-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className={`h-full w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
            <motion.div
              className={`h-full ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                  : "bg-gradient-to-r from-indigo-400 to-purple-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.8,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Optional decorative dots */}
        <motion.div
          className="flex gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-3 w-3 rounded-full ${theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"}`}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
