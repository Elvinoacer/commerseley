import { motion } from "framer-motion";
import { Truck, Zap, Shield, CreditCard } from "lucide-react";

interface ProductShippingTabProps {
  theme: string;
}

function ProductShippingTab({ theme }: ProductShippingTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0 }}
      className={`p-4 sm:p-6 rounded-xl shadow-md border ${
        theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white border-gray-200"
      }`}
    >
      <h3 className={`text-lg sm:text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        Shipping Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <h4 className={`font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            Delivery Options
          </h4>
          <ul className={`space-y-3 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <li className="flex items-start gap-2">
              <Truck
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              />
              <span>Free standard shipping on all orders (3-5 business days)</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              />
              <span>Express shipping available at checkout (1-2 business days)</span>
            </li>
          </ul>
        </div>
        <div className={`p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <h4 className={`font-medium mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>Returns Policy</h4>
          <ul className={`space-y-3 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <li className="flex items-start gap-2">
              <Shield
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              />
              <span>30-day easy returns</span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              />
              <span>Full refund upon return</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductShippingTab;
