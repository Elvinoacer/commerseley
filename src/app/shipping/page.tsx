"use client";
import { Truck, Clock, Globe, Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/utils";

export default function ShippingPage() {
  const { theme } = useTheme();

  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "Free on orders over $50",
      time: "3-5 business days",
      icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />,
      features: [
        { text: "Tracking included", available: true },
        { text: "Signature required", available: false },
        { text: "International", available: false },
      ],
    },
    {
      name: "Express Shipping",
      price: "$9.99",
      time: "1-2 business days",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      features: [
        { text: "Tracking included", available: true },
        { text: "Signature required", available: true },
        { text: "International", available: false },
      ],
    },
    {
      name: "International Shipping",
      price: "From $14.99",
      time: "5-10 business days",
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
      features: [
        { text: "Tracking included", available: true },
        { text: "Signature required", available: true },
        { text: "International", available: true },
      ],
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* Radial gradient overlay */}
      <div
        className={`absolute inset-0 opacity-10 pointer-events-none ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"
            : "bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-indigo-100/60 via-transparent to-transparent"
        }`}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div
            className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-full mb-4 sm:mb-6 shadow-md ${
              theme === "dark" ? "bg-indigo-900/50" : "bg-indigo-50"
            }`}
          >
            <Truck className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          </div>
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${
              theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Shipping Policy
          </h1>
          <p
            className={`text-sm sm:text-base lg:text-lg text-wrap break-words ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Fast, reliable delivery options to get your order to you quickly and safely
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12"
          >
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`p-4 sm:p-5 rounded-lg shadow-sm transition-all duration-300 border ${
                  theme === "dark"
                    ? "bg-gray-800/60 border-gray-700 hover:border-indigo-500"
                    : "bg-white/80 border-gray-200 hover:border-indigo-300"
                } backdrop-blur-sm hover:shadow-md`}
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <div
                    className={`p-2 rounded-full mr-3 sm:mr-4 ${
                      theme === "dark" ? "bg-indigo-900/50 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-semibold truncate ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                    title={option.name}
                  >
                    {option.name}
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Price
                    </p>
                    <p
                      className={`text-sm sm:text-base font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {option.price}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Delivery Time
                    </p>
                    <p
                      className={`text-sm sm:text-base font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {option.time}
                    </p>
                  </div>
                  <div className={`pt-2 sm:pt-3 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <p className={`text-xs sm:text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      Features
                    </p>
                    <ul className="space-y-1 sm:space-y-2">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-xs sm:text-sm">
                          {feature.available ? (
                            <Check
                              className={`w-4 h-4 flex-shrink-0 ${
                                theme === "dark" ? "text-green-400" : "text-green-500"
                              } mr-2`}
                              aria-hidden="true"
                            />
                          ) : (
                            <X
                              className={`w-4 h-4 flex-shrink-0 ${
                                theme === "dark" ? "text-gray-500" : "text-gray-400"
                              } mr-2`}
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`text-wrap break-words ${
                              feature.available
                                ? theme === "dark"
                                  ? "text-gray-200"
                                  : "text-gray-700"
                                : theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeIn}
            className={`p-4 sm:p-6 rounded-lg shadow-sm transition-all duration-300 border ${
              theme === "dark" ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"
            } backdrop-blur-sm`}
            role="region"
            aria-labelledby="shipping-info-heading"
          >
            <h2
              id="shipping-info-heading"
              className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Shipping Information
            </h2>
            <div
              className={`space-y-4 sm:space-y-6 text-xs sm:text-sm lg:text-base text-wrap break-words ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <p>
                All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your
                order confirmation email. You will receive another notification when your order has shipped.
              </p>

              <div>
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  Domestic Shipping
                </h3>
                <p>
                  We offer free standard shipping on orders over $50. For orders under $50, a flat rate of $4.99
                  applies. Express shipping is available for $9.99.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  International Shipping
                </h3>
                <p>
                  We ship to most countries worldwide. Shipping costs vary by destination and are calculated at
                  checkout. Please note that international orders may be subject to customs fees, import duties, and
                  taxes, which are the responsibility of the customer.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  Order Tracking
                </h3>
                <p>
                  Once your order ships, you’ll receive a tracking number via email. You can use this to track your
                  package through our carrier’s website.
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  Shipping Restrictions
                </h3>
                <p>
                  Some items may require special shipping considerations. These will be noted on the product page. We
                  currently cannot ship to PO boxes or military addresses.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
