"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getFCMToken } from "@/lib/firebase-client";
import { useSubscriptionStore } from "@/store/useSubscription";
import { useTheme } from "next-themes";

export const NotificationPermissionModal = () => {
  const { subscribe } = useSubscriptionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    // Check if notifications are supported and permission hasn't been granted yet
    const checkNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = Notification.permission;
        if (permission === "default") {
          // Wait a bit before showing to avoid interrupting initial page load
          setTimeout(() => setIsOpen(true), 3000);
        }
      }
    };

    checkNotificationPermission();
  }, []);

  const handleAllow = async () => {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getFCMToken();
        if (token) {
          await subscribe(undefined, token);
        }
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleDeny = () => {
    setIsOpen(false);
    // Optionally store in localStorage that user denied to prevent asking again
    localStorage.setItem("notificationPermissionDenied", "true");
  };

  // Theme-aware styles
  const modalBackground =
    currentTheme === "dark"
      ? "linear-gradient(to bottom right, hsl(240, 5%, 15%), hsl(240, 5%, 20%))"
      : "linear-gradient(to bottom right, hsl(240, 10%, 96%), hsl(0, 0%, 100%))";

  const textColor = currentTheme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryTextColor = currentTheme === "dark" ? "text-gray-300" : "text-gray-600";
  const closeButtonHover = currentTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const denyButtonStyles =
    currentTheme === "dark"
      ? "border-gray-600 text-gray-200 hover:bg-gray-800"
      : "border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={handleDeny}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl p-6 pointer-events-auto"
            style={{
              background: modalBackground,
              boxShadow:
                currentTheme === "dark"
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                  : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDeny}
              className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${closeButtonHover}`}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-md" />
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white">
                  <Bell className="w-6 h-6" />
                </div>
              </div>

              <h3 className={`text-lg font-bold ${textColor} mb-1`}>Stay Updated!</h3>
              <p className={`text-sm ${secondaryTextColor} mb-6`}>
                Enable notifications to get the latest updates, exclusive offers, and important announcements.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDeny}
                  disabled={isLoading}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors ${denyButtonStyles}`}
                >
                  Not Now
                </button>
                <button
                  onClick={handleAllow}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-700 transition-all relative overflow-hidden"
                >
                  {isLoading ? (
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    </motion.span>
                  ) : (
                    <motion.span
                      className="flex items-center justify-center gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Check className="w-4 h-4" />
                      Allow
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
