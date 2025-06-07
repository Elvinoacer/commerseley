import { Truck, Clock, Globe, Check, X } from "lucide-react";

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "Free on orders over $50",
      time: "3-5 business days",
      icon: <Truck className="w-6 h-6 text-indigo-600" />,
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
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
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
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      features: [
        { text: "Tracking included", available: true },
        { text: "Signature required", available: true },
        { text: "International", available: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-6">
            <Truck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Shipping Policy
          </h1>
          <p className="text-xl text-gray-600">
            Fast, reliable delivery options to get your order to you quickly
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 rounded-full mr-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold">{option.name}</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">{option.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery Time</p>
                    <p className="font-medium">{option.time}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-gray-500 mb-2">Features</p>
                    <ul className="space-y-2">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          {feature.available ? (
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                          <span
                            className={
                              feature.available
                                ? "text-gray-700"
                                : "text-gray-400"
                            }
                          >
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

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p>
                All orders are processed within 1-2 business days (excluding
                weekends and holidays) after receiving your order confirmation
                email. You will receive another notification when your order has
                shipped.
              </p>

              <h3 className="font-semibold text-lg">Domestic Shipping</h3>
              <p>
                We offer free standard shipping on orders over $50. For orders
                under $50, a flat rate of $4.99 applies. Express shipping is
                available for $9.99.
              </p>

              <h3 className="font-semibold text-lg">International Shipping</h3>
              <p>
                We ship to most countries worldwide. Shipping costs vary by
                destination and are calculated at checkout. Please note that
                international orders may be subject to customs fees, import
                duties, and taxes which are the responsibility of the customer.
              </p>

              <h3 className="font-semibold text-lg">Order Tracking</h3>
              <p>
                Once your order ships, you'll receive a tracking number via
                email. You can use this to track your package through our
                carrier's website.
              </p>

              <h3 className="font-semibold text-lg">Shipping Restrictions</h3>
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
