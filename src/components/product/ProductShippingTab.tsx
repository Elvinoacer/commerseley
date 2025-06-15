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
      className={`p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border ${
        theme === "dark" ? "bg-gray-800/90 border-gray-600" : "bg-white border-gray-200"
      }`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        Shipping & Returns
      </h3>

      <div className="grid grid-cols-1 gap-3 md:gap-4 lg:gap-5 md:grid-cols-2">
        {/* Delivery Options Card */}
        <motion.div
          className={`p-3 md:p-4 rounded-lg shadow-xs md:shadow-sm ${
            theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Truck
              className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h4 className={`font-medium text-base md:text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Delivery Options
            </h4>
          </div>
          <ul
            className={`space-y-2 md:space-y-3 text-sm md:text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <li className="flex items-start gap-2">
              <span className="inline-block w-1 h-1 mt-2 rounded-full bg-current opacity-70 flex-shrink-0"></span>
              <span>Free standard shipping (3-5 business days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-1 h-1 mt-2 rounded-full bg-current opacity-70 flex-shrink-0"></span>
              <span>Express shipping available (1-2 business days)</span>
            </li>
          </ul>
        </motion.div>

        {/* Returns Policy Card */}
        <motion.div
          className={`p-3 md:p-4 rounded-lg shadow-xs md:shadow-sm ${
            theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Shield
              className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h4 className={`font-medium text-base md:text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Returns Policy
            </h4>
          </div>
          <ul
            className={`space-y-2 md:space-y-3 text-sm md:text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <li className="flex items-start gap-2">
              <span className="inline-block w-1 h-1 mt-2 rounded-full bg-current opacity-70 flex-shrink-0"></span>
              <span>30-day easy returns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-1 h-1 mt-2 rounded-full bg-current opacity-70 flex-shrink-0"></span>
              <span>Full refund upon return</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Additional Mobile-Optimized Features */}
      <div
        className={`mt-4 md:mt-5 p-3 rounded-lg text-sm md:text-base ${
          theme === "dark" ? "bg-gray-700/30 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}
      >
        <p className="flex items-center gap-2">
          <Zap className={`w-4 h-4 ${theme === "dark" ? "text-yellow-400" : "text-yellow-500"}`} />
          <span>Orders placed before 3PM EST ship same day</span>
        </p>
      </div>
    </motion.div>
  );
}

export default ProductShippingTab;
