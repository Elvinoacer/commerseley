"use client";
import { RefreshCw, Check, X, Calendar, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: "1",
      title: "Initiate Return",
      description:
        "Contact us within 30 days of receiving your order to start the return process",
      icon: <Mail className="w-5 h-5 text-indigo-600" />,
    },
    {
      step: "2",
      title: "Package Items",
      description:
        "Securely pack the items in their original packaging with all tags attached",
      icon: <Package className="w-5 h-5 text-indigo-600" />,
    },
    {
      step: "3",
      title: "Ship Back",
      description:
        "Send the package to our returns center using the provided shipping label",
      icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
    },
    {
      step: "4",
      title: "Receive Refund",
      description:
        "Once received and inspected, we'll process your refund within 5 business days",
      icon: <Check className="w-5 h-5 text-indigo-600" />,
    },
  ];

  const nonReturnableItems = [
    "Personalized or custom-made products",
    "Intimate apparel (swimwear, underwear)",
    "Products without original packaging",
    "Items marked as final sale",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-6">
            <RefreshCw className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Returns & Exchanges
          </h1>
          <p className="text-xl text-gray-600">Our hassle-free return policy</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-12">
            <div className="flex items-start mb-6">
              <Calendar className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  30-Day Return Policy
                </h2>
                <p className="text-gray-700">
                  We want you to love what you&apos;ve ordered. If you&apos;re
                  not completely satisfied, you may return most items within 30
                  days of delivery for a full refund or exchange. Some items may
                  have different return policies as noted on their product
                  pages.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {returnSteps.map((step, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 font-bold">
                      {step.step}
                    </span>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3">
                  Return Conditions
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Items must be unused and in original condition</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Original tags and packaging must be attached</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Proof of purchase is required</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3">
                  Non-Returnable Items
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  How long does it take to process my return?
                </h3>
                <p className="text-gray-700">
                  Once we receive your return, please allow 3-5 business days
                  for processing. You&apos;ll receive an email confirmation once
                  your refund has been issued.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Will I be refunded the shipping cost?
                </h3>
                <p className="text-gray-700">
                  Original shipping fees are non-refundable unless the return is
                  due to our error (wrong item shipped, defective item, etc.).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Can I exchange an item instead of returning it?
                </h3>
                <p className="text-gray-700">
                  Yes! Please contact our customer service team to arrange an
                  exchange. You may be responsible for any price differences and
                  additional shipping costs.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
