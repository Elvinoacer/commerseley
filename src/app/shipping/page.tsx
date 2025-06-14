"use client";
import { Truck, Clock, Globe, Check, X } from "lucide-react";
import { useTheme } from "next-themes";

export default function ShippingPage() {
  const { theme } = useTheme();

  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "Free on orders over $50",
      time: "3-5 business days",
      icon: <Truck className="w-6 h-6" />,
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
      icon: <Clock className="w-6 h-6" />,
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
      icon: <Globe className="w-6 h-6" />,
      features: [
        { text: "Tracking included", available: true },
        { text: "Signature required", available: true },
        { text: "International", available: true },
      ],
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      {/* Radial gradient overlay */}
      <div className={`absolute inset-0 opacity-10 ${
        theme === 'dark'
          ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent'
          : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent'
      }`}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-6 ${
            theme === 'dark' 
              ? 'bg-indigo-900/30' 
              : 'bg-indigo-100'
          }`}>
            <Truck className={`w-8 h-8 ${
              theme === 'dark' 
                ? 'text-indigo-400' 
                : 'text-indigo-600'
            }`} />
          </div>
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-indigo-400 to-purple-400'
              : 'from-indigo-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            Shipping Policy
          </h1>
          <p className={`text-lg sm:text-xl ${
            theme === 'dark' 
              ? 'text-gray-300' 
              : 'text-gray-600'
          }`}>
            Fast, reliable delivery options to get your order to you quickly
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-sm transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:border-indigo-500'
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                } border hover:shadow-md`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full mr-4 ${
                    theme === 'dark' 
                      ? 'bg-indigo-900/40 text-indigo-400' 
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {option.icon}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${
                    theme === 'dark' 
                      ? 'text-white' 
                      : 'text-gray-800'
                  }`}>
                    {option.name}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                    }`}>
                      Price
                    </p>
                    <p className={`font-medium ${
                      theme === 'dark' 
                        ? 'text-white' 
                        : 'text-gray-900'
                    }`}>
                      {option.price}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                    }`}>
                      Delivery Time
                    </p>
                    <p className={`font-medium ${
                      theme === 'dark' 
                        ? 'text-white' 
                        : 'text-gray-900'
                    }`}>
                      {option.time}
                    </p>
                  </div>
                  <div className={`pt-2 ${
                    theme === 'dark' 
                      ? 'border-gray-700' 
                      : 'border-gray-200'
                  } border-t`}>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                    }`}>
                      Features
                    </p>
                    <ul className="space-y-2">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          {feature.available ? (
                            <Check className={`w-4 h-4 ${
                              theme === 'dark' 
                                ? 'text-green-400' 
                                : 'text-green-500'
                            } mr-2`} />
                          ) : (
                            <X className={`w-4 h-4 ${
                              theme === 'dark' 
                                ? 'text-gray-500' 
                                : 'text-gray-400'
                            } mr-2`} />
                          )}
                          <span className={
                            feature.available
                              ? theme === 'dark'
                                ? 'text-gray-200'
                                : 'text-gray-700'
                              : theme === 'dark'
                                ? 'text-gray-500'
                                : 'text-gray-400'
                          }>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-6 sm:p-8 rounded-xl shadow-sm transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          } border`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${
              theme === 'dark' 
                ? 'text-white' 
                : 'text-gray-800'
            }`}>
              Shipping Information
            </h2>
            <div className={`space-y-6 ${
              theme === 'dark' 
                ? 'text-gray-300' 
                : 'text-gray-700'
            }`}>
              <p>
                All orders are processed within 1-2 business days (excluding
                weekends and holidays) after receiving your order confirmation
                email. You will receive another notification when your order has
                shipped.
              </p>

              <h3 className={`font-semibold ${
                theme === 'dark' 
                  ? 'text-gray-100' 
                  : 'text-gray-900'
              }`}>
                Domestic Shipping
              </h3>
              <p>
                We offer free standard shipping on orders over $50. For orders
                under $50, a flat rate of $4.99 applies. Express shipping is
                available for $9.99.
              </p>

              <h3 className={`font-semibold ${
                theme === 'dark' 
                  ? 'text-gray-100' 
                  : 'text-gray-900'
              }`}>
                International Shipping
              </h3>
              <p>
                We ship to most countries worldwide. Shipping costs vary by
                destination and are calculated at checkout. Please note that
                international orders may be subject to customs fees, import
                duties, and taxes which are the responsibility of the customer.
              </p>

              <h3 className={`font-semibold ${
                theme === 'dark' 
                  ? 'text-gray-100' 
                  : 'text-gray-900'
              }`}>
                Order Tracking
              </h3>
              <p>
                Once your order ships, you'll receive a tracking number via
                email. You can use this to track your package through our
                carrier's website.
              </p>

              <h3 className={`font-semibold ${
                theme === 'dark' 
                  ? 'text-gray-100' 
                  : 'text-gray-900'
              }`}>
                Shipping Restrictions
              </h3>
              <p>
                Some items may require special shipping considerations. These
                will be noted on the product page. We currently cannot ship to
                PO boxes or military addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}