"use client";
import { Mail, Phone, MapPin, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useState, useEffect } from "react";
import { API_ROUTES } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

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

export default function ContactPage() {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading for demo; replace with actual data fetching if needed
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      title: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch(`${API_ROUTES.EMAILS}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Reset form and show success modal
      (e.target as HTMLFormElement).reset();
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen pt-16 transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <h1
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white to-gray-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Get In Touch
                </h1>
                <p
                  className={`text-sm sm:text-base md:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  Have questions? We're here to help!
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left column - contact info */}
            <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
              <motion.div
                className={`p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                    : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
                }`}
                whileHover={{ y: -4 }}
              >
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2
                      className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Contact Information
                    </h2>
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex items-start">
                        <Mail
                          className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-sm sm:text-base mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Email Us
                          </h3>
                          <a
                            href="mailto:support@commersely.com"
                            className={`text-xs sm:text-sm hover:underline ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            support@commersely.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone
                          className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-sm sm:text-base mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Call Us
                          </h3>
                          <a
                            href="tel:+25792156094"
                            className={`text-xs sm:text-sm hover:underline ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            +257 9215 6094
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin
                          className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-sm sm:text-base mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Visit Us
                          </h3>
                          <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            123 Commerce Street
                            <br />
                            Tech City, TC 10001
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div
                className={`p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                    : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
                }`}
                whileHover={{ y: -4 }}
              >
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2
                      className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Customer Support Hours
                    </h2>
                    <div className="space-y-2">
                      <p
                        className={`flex justify-between text-xs sm:text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </p>
                      <p
                        className={`flex justify-between text-xs sm:text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </p>
                      <p
                        className={`flex justify-between text-xs sm:text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>Sunday</span>
                        <span className="font-medium">Closed</span>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Right column - contact form */}
            <motion.div
              variants={itemVariants}
              className={`p-4 sm:p-6 rounded-lg shadow-lg backdrop-blur-sm border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                  : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
              }`}
              whileHover={{ y: -4 }}
            >
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <>
                  <h2
                    className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-xs sm:text-sm font-medium mb-1 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Name
                        </label>
                        <Input
                          required
                          name="name"
                          id="name"
                          placeholder="Your name"
                          className={`text-xs sm:text-sm touch-manipulation ${
                            theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-xs sm:text-sm font-medium mb-1 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Email
                        </label>
                        <Input
                          required
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          className={`text-xs sm:text-sm touch-manipulation ${
                            theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className={`block text-xs sm:text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Subject
                      </label>
                      <Input
                        required
                        name="subject"
                        id="subject"
                        placeholder="How can we help?"
                        className={`text-xs sm:text-sm touch-manipulation ${
                          theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className={`block text-xs sm:text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Message
                      </label>
                      <Textarea
                        required
                        name="message"
                        id="message"
                        rows={4}
                        placeholder="Your message..."
                        className={`text-xs sm:text-sm touch-manipulation ${
                          theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""
                        }`}
                      />
                    </div>
                    <Button
                      type="submit"
                      className={`w-full text-sm sm:text-base py-3 touch-manipulation ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 ${
                theme === "dark"
                  ? "bg-gray-900/80"
                  : "bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
              } backdrop-blur-sm`}
            ></div>

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative rounded-xl shadow-2xl max-w-sm w-full p-4 sm:p-6 z-50 border ${
                theme === "dark" ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-gray-100/30"
              }`}
            >
              <button
                onClick={() => setShowSuccess(false)}
                className={`absolute top-3 right-3 p-1 rounded-full transition-colors touch-manipulation ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-600"
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 sm:mb-6 ${
                    theme === "dark" ? "bg-green-900/50" : "bg-green-100"
                  }`}
                >
                  <svg
                    className={`h-6 w-6 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <h3
                  className={`text-lg sm:text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Message Sent!
                </h3>
                <p
                  className={`text-xs sm:text-sm mb-4 sm:mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  Thank you for contacting us. We'll get back to you soon.
                </p>

                <Button
                  onClick={() => setShowSuccess(false)}
                  className={`w-full text-sm sm:text-base py-3 touch-manipulation ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
