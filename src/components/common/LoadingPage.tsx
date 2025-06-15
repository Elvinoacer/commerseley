"use client";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { useTheme } from "next-themes";

export function LoadingPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-indigo-50 to-blue-50"
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
              ? "linear-gradient(45deg, #4b5e91, #9333ea, #4b5e91)"
              : "linear-gradient(45deg, #a5b4fc, #e9d5ff, #a5b4fc)",
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
        className="relative z-10 flex w-full max-w-[90%] sm:max-w-md flex-col items-center justify-center gap-3 sm:gap-4 px-4 py-8 sm:px-6 sm:py-10 text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            },
            scale: {
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1,
              ease: "easeInOut",
            },
          }}
          className={`text-3xl sm:text-4xl ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
          aria-hidden="true"
        >
          <FiLoader />
        </motion.div>

        <motion.h1
          className={`text-xl sm:text-2xl lg:text-3xl font-bold text-wrap break-words ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Loading<span className="animate-pulse">...</span>
        </motion.h1>

        <motion.p
          className={`max-w-full sm:max-w-xs text-xs sm:text-sm text-wrap break-words ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Preparing your experience<span className="animate-pulse">...</span>
        </motion.p>

        <motion.div
          className="mt-3 h-1.5 w-48 sm:w-64 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          role="progressbar"
          aria-label="Loading progress"
        >
          <div className={`h-full w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
            <motion.div
              className={`h-full ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600"
                  : "bg-gradient-to-r from-indigo-400 to-indigo-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          className="flex gap-1.5 mt-4 sm:mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${
                theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
              }`}
              animate={{
                y: [0, -6, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
