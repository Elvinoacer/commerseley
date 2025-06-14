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
      className={`min-h-screen pt-20 transition-colors duration-300 relative z-0 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ) : (
              <>
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-white to-gray-300"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  }`}
                >
                  Get In Touch
                </h1>
                <p
                  className={`text-base sm:text-lg md:text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  Have questions? We're here to help!
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left column - contact info */}
            <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
              <motion.div
                className={`p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                    : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
                }`}
                whileHover={{ y: -4 }}
              >
                {isLoading ? (
                  <div className="animate-pulse space-y-6">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mt-1"></div>
                        <div className="space-y-2">
                          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2
                      className={`text-xl sm:text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Contact Information
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <Mail
                          className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-base sm:text-lg mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Email Us
                          </h3>
                          <a
                            href="mailto:support@commersely.com"
                            className={`text-sm sm:text-base hover:underline ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            support@commersely.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone
                          className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-base sm:text-lg mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Call Us
                          </h3>
                          <a
                            href="tel:+25792156094"
                            className={`text-sm sm:text-base hover:underline ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            +257 9215 6094
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin
                          className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        />
                        <div>
                          <h3
                            className={`font-semibold text-base sm:text-lg mb-1 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Visit Us
                          </h3>
                          <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
                className={`p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                    : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
                }`}
                whileHover={{ y: -4 }}
              >
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2
                      className={`text-xl sm:text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Customer Support Hours
                    </h2>
                    <div className="space-y-2">
                      <p
                        className={`flex justify-between text-sm sm:text-base ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </p>
                      <p
                        className={`flex justify-between text-sm sm:text-base ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </p>
                      <p
                        className={`flex justify-between text-sm sm:text-base ${
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
              className={`p-6 sm:p-8 rounded-xl shadow-lg backdrop-blur-sm border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/30 hover:shadow-white/10"
                  : "bg-white/80 border-gray-200/30 hover:shadow-gray-300/20"
              }`}
              whileHover={{ y: -4 }}
            >
              {isLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <>
                  <h2
                    className={`text-xl sm:text-2xl font-bold mb-6 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-sm font-medium mb-1 ${
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
                          className={theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-sm font-medium mb-1 ${
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
                          className={theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className={`block text-sm font-medium mb-1 ${
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
                        className={theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Message
                      </label>
                      <Textarea
                        required
                        name="message"
                        id="message"
                        rows={5}
                        placeholder="Your message..."
                        className={theme === "dark" ? "bg-gray-700 text-gray-300 border-gray-600" : ""}
                      />
                    </div>
                    <Button
                      type="submit"
                      className={`w-full ${
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
            className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80"
                  : "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"
              }`}
            >
              <div
                className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${
                  theme === "dark"
                    ? "from-gray-700/20 via-transparent to-gray-600/20"
                    : "from-indigo-600/20 via-transparent to-purple-600/20"
                }`}
              ></div>
            </div>

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 z-50 border ${
                theme === "dark" ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-gray-100/30"
              }`}
            >
              <button
                onClick={() => setShowSuccess(false)}
                className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                  theme === "dark"
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-600"
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${
                    theme === "dark" ? "bg-green-900/50" : "bg-green-100"
                  }`}
                >
                  <svg
                    className={`h-10 w-10 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
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
                  className={`text-xl sm:text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Message Sent!
                </h3>
                <p className={`text-sm sm:text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Thank you for contacting us. We'll get back to you soon.
                </p>

                <Button
                  onClick={() => setShowSuccess(false)}
                  className={`${
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
