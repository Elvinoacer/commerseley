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
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-red-50 to-amber-50"
      }`}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(45deg, #4b5e91, #9333ea, #db2777, #4b5e91)"
              : "linear-gradient(45deg, #fee2e2, #fef3c7, #fef3c7, #fee2e2)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className={`absolute inset-0 opacity-10 ${
          theme === "dark"
            ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDIwIDIwIE0gMCAyMCBMIDIwIDIwIiBzdHJva2U9IiMzNzNmNDYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")]'
            : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDIwIDIwIE0gMCAyMCBMIDIwIDIwIiBzdHJva2U9IiNhMWE1YTkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")]'
        }`}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex w-full max-w-[90%] sm:max-w-lg flex-col items-center justify-center gap-4 sm:gap-6 px-4 py-8 sm:px-6 sm:py-12 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className={`text-4xl sm:text-5xl ${theme === "dark" ? "text-red-400" : "text-red-500"}`}
        >
          <FiAlertOctagon aria-hidden="true" />
        </motion.div>

        <motion.h1
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-wrap break-words ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Something Went Wrong
        </motion.h1>

        {error && (
          <motion.p
            className={`max-w-full sm:max-w-md rounded-md p-3 sm:p-4 font-mono text-xs sm:text-sm text-wrap break-words ${
              theme === "dark" ? "bg-gray-800/60 text-red-300" : "bg-red-100/60 text-red-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            role="alert"
          >
            {error.message}
          </motion.p>
        )}

        <motion.p
          className={`max-w-full sm:max-w-sm text-xs sm:text-sm text-wrap break-words ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          We're sorry for the inconvenience. Please try again later.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col w-full sm:flex-row gap-2 sm:gap-3"
        >
          <button
            onClick={() => window.location.reload()}
            className={`w-full rounded-md px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white focus:ring-red-500"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white focus:ring-red-400"
            }`}
            aria-label="Reload the page"
          >
            Try Again
          </button>

          <Link
            href="/"
            className={`w-full rounded-md px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gray-700/80 text-gray-100 focus:ring-gray-500"
                : "bg-white/80 text-gray-800 focus:ring-gray-400"
            }`}
            aria-label="Return to homepage"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
