"use client";
import { RefreshCw, Check, X, Calendar, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function ReturnsPage() {
  const { theme } = useTheme();

  const returnSteps = [
    {
      step: "1",
      title: "Initiate Return",
      description: "Contact us within 30 days of receiving your order to start the return process",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      step: "2",
      title: "Package Items",
      description: "Securely pack the items in their original packaging with all tags attached",
      icon: <Package className="w-5 h-5" />,
    },
    {
      step: "3",
      title: "Ship Back",
      description: "Send the package to our returns center using the provided shipping label",
      icon: <RefreshCw className="w-5 h-5" />,
    },
    {
      step: "4",
      title: "Receive Refund",
      description: "Once received and inspected, we'll process your refund within 5 business days",
      icon: <Check className="w-5 h-5" />,
    },
  ];

  const nonReturnableItems = [
    "Personalized or custom-made products",
    "Intimate apparel (swimwear, underwear)",
    "Products without original packaging",
    "Items marked as final sale",
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-white"
      }`}
    >
      {/* Radial gradient overlay */}
      <div
        className={`absolute inset-0 opacity-10 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"
            : "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent"
        }`}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${
              theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-100"
            }`}
          >
            <RefreshCw className={`w-8 h-8 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
          </div>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r ${
              theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"
            } bg-clip-text text-transparent`}
          >
            Returns & Exchanges
          </h1>
          <p className={`text-lg sm:text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Our hassle-free return policy
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className={`p-6 sm:p-8 rounded-xl shadow-sm transition-all duration-300 ${
              theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            } border mb-12`}
          >
            <div className="flex items-start mb-6">
              <Calendar
                className={`w-6 h-6 mt-1 mr-4 flex-shrink-0 ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                >
                  30-Day Return Policy
                </h2>
                <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  We want you to love what you've ordered. If you're not completely satisfied, you may return most items
                  within 30 days of delivery for a full refund or exchange. Some items may have different return
                  policies as noted on their product pages.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {returnSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all ${
                    theme === "dark" ? "bg-gray-700/30 hover:bg-gray-700/50" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold ${
                        theme === "dark" ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white"
                      }`}
                    >
                      {step.step}
                    </span>
                    <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className={`font-semibold text-lg mb-3 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Return Conditions
                </h3>
                <ul className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  <li className="flex items-start">
                    <Check
                      className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                        theme === "dark" ? "text-green-400" : "text-green-500"
                      }`}
                    />
                    <span>Items must be unused and in original condition</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                        theme === "dark" ? "text-green-400" : "text-green-500"
                      }`}
                    />
                    <span>Original tags and packaging must be attached</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                        theme === "dark" ? "text-green-400" : "text-green-500"
                      }`}
                    />
                    <span>Proof of purchase is required</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-lg mb-3 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  Non-Returnable Items
                </h3>
                <ul className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <X
                        className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                          theme === "dark" ? "text-red-400" : "text-red-500"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-xl shadow-sm transition-all duration-300 ${
              theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
            } border`}
          >
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Frequently Asked Questions
            </h2>
            <div className={`space-y-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  How long does it take to process my return?
                </h3>
                <p>
                  Once we receive your return, please allow 3-5 business days for processing. You'll receive an email
                  confirmation once your refund has been issued.
                </p>
              </div>
              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  Will I be refunded the shipping cost?
                </h3>
                <p>
                  Original shipping fees are non-refundable unless the return is due to our error (wrong item shipped,
                  defective item, etc.).
                </p>
              </div>
              <div>
                <h3 className={`font-semibold text-lg mb-2 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  Can I exchange an item instead of returning it?
                </h3>
                <p>
                  Yes! Please contact our customer service team to arrange an exchange. You may be responsible for any
                  price differences and additional shipping costs.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link
                  href="/contact"
                  className={`${
                    theme === "dark"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  Start a Return
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
