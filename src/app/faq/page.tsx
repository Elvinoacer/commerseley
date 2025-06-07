import {
  ChevronDown,
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or check out as a guest.",
      icon: <HelpCircle className="w-5 h-5 text-indigo-600" />,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.",
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
    },
    {
      question: "How long does shipping take?",
      answer:
        "Most orders ship within 1-2 business days. Domestic delivery typically takes 3-5 business days, while international shipping varies by destination.",
      icon: <Truck className="w-5 h-5 text-indigo-600" />,
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes! Once your order ships, you'll receive a tracking number via email that you can use to monitor your package's journey.",
      icon: <Package className="w-5 h-5 text-indigo-600" />,
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer 30-day returns for most items in their original condition. Some items may be final sale. Please see our Returns page for full details.",
      icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and never store your payment information. Your privacy is our priority.",
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about shopping with us
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center space-x-4">
                    {faq.icon}
                    <span className="text-lg font-medium text-left">
                      {faq.question}
                    </span>
                  </div>
                  {/* <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" /> */}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Still have questions? We're happy to help!
            </p>
            <Button asChild>
              <Link
                href="/contact"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
