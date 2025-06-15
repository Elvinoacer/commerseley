"use client";

import { ChevronDown, HelpCircle, Package, CreditCard, Truck, RefreshCw, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function FAQPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-aware colors
  const bgGradient = isDark ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const secondaryTextColor = isDark ? "text-gray-300" : "text-gray-600";
  const iconColor = isDark ? "text-indigo-400" : "text-indigo-600";
  const iconBg = isDark ? "bg-indigo-900/50" : "bg-indigo-100";
  const primaryGradient = isDark ? "from-indigo-500 to-purple-500" : "from-indigo-600 to-purple-600";
  const hoverGradient = isDark
    ? "hover:from-indigo-600 hover:to-purple-600"
    : "hover:from-indigo-700 hover:to-purple-700";

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or check out as a guest.",
      icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.",
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      question: "How long does shipping take?",
      answer:
        "Most orders ship within 1-2 business days. Domestic delivery typically takes 3-5 business days, while international shipping varies by destination.",
      icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! Once your order ships, you'll receive a tracking number via email that you can use to monitor your package's journey.",
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer 30-day returns for most items in their original condition. Some items may be final sale. Please see our Returns page for full details.",
      icon: <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and never store your payment information. Your privacy is our priority.",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8 sm:mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center justify-center ${iconBg} p-2 sm:p-3 rounded-full mb-3 sm:mb-4`}
          >
            <HelpCircle className={`w-6 h-6 sm:w-7 sm:h-7 ${iconColor}`} />
          </motion.div>
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
          >
            Frequently Asked Questions
          </h1>
          <p className={`text-base sm:text-lg ${secondaryTextColor}`}>
            Find answers to common questions about shopping with us
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className={`${cardBg} rounded-lg sm:rounded-xl shadow-sm overflow-hidden border ${cardBorder} transition-colors duration-300`}
                >
                  <AccordionTrigger
                    className={`px-4 sm:px-5 py-3 sm:py-4 hover:no-underline ${textColor} hover:${
                      isDark ? "bg-gray-700/50" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`p-1.5 sm:p-2 rounded-md ${iconBg} ${iconColor}`}>{faq.icon}</div>
                      <span className="text-sm sm:text-base font-medium text-left">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent
                    className={`px-4 sm:px-5 pb-3 sm:pb-4 pt-0 ${secondaryTextColor} text-xs sm:text-sm`}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <p className={`${secondaryTextColor} mb-4 sm:mb-5 text-sm sm:text-base`}>
              Still have questions? We're happy to help!
            </p>
            <Button asChild>
              <Link
                href="/contact"
                className={`bg-gradient-to-r ${primaryGradient} ${hoverGradient} text-white px-6 py-4 sm:px-8 sm:py-5 text-sm sm:text-base font-medium rounded-lg shadow-md transition-all duration-300`}
              >
                Contact Us
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
