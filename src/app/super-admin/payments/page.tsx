"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/store/useOrderStore";
import { FiCreditCard, FiTruck, FiDollarSign, FiCheck, FiX } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { formatCurrency } from "@/utils/format-currency";

const PaymentMethodsAdmin = () => {
  const {
    isCashOnDeliveryEnabled,
    fetchCashOnDeliverySetting,
    updateCashOnDeliverySetting,
    fetchCODStats,
    codStats,
    isLoading,
  } = useOrderStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    success: boolean;
  }>({ show: false, message: "", success: false });

  useEffect(() => {
    fetchCashOnDeliverySetting();
    fetchCODStats();
  }, [fetchCashOnDeliverySetting, fetchCODStats]);

  const toggleCashOnDelivery = async () => {
    setIsUpdating(true);
    try {
      const success = await updateCashOnDeliverySetting(!isCashOnDeliveryEnabled);
      if (success) {
        setNotification({
          show: true,
          message: `Cash on Delivery ${!isCashOnDeliveryEnabled ? "enabled" : "disabled"} successfully!`,
          success: true,
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error: any) {
      setNotification({
        show: true,
        message: error.response?.data?.message || "Failed to update payment method",
        success: false,
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setNotification({ show: false, message: "", success: false }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6"
        >
          <motion.h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent mb-6 md:mb-8">
            Payment Methods
          </motion.h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* Credit Card Payment Card */}
            <motion.div
              className="bg-white dark:bg-gray-700 rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border-l-4 border-blue-500 dark:border-blue-400"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 md:p-6 flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <FiCreditCard className="text-blue-600 dark:text-blue-400 text-xl md:text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                    Credit Card Payments
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
                    Always enabled for online transactions
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      <FiCheck className="mr-1" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cash on Delivery Card */}
            <motion.div
              className="bg-white dark:bg-gray-700 rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border-l-4 border-purple-500 dark:border-purple-400"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 md:p-6 flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <FaMoneyBillWave className="text-purple-600 dark:text-purple-400 text-xl md:text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                    Cash on Delivery
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
                    Pay when you receive your order
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center">
                    {isLoading || isUpdating ? (
                      <div className="animate-pulse flex items-center">
                        <div className="h-3 w-3 md:h-4 md:w-4 bg-gray-300 dark:bg-gray-500 rounded-full mr-2"></div>
                        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Updating...</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={toggleCashOnDelivery}
                          className={`relative inline-flex items-center h-5 md:h-6 rounded-full w-10 md:w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 ${
                            isCashOnDeliveryEnabled
                              ? "bg-purple-600 dark:bg-purple-500"
                              : "bg-gray-200 dark:bg-gray-600"
                          }`}
                          aria-label={`Toggle Cash on Delivery ${isCashOnDeliveryEnabled ? "off" : "on"}`}
                        >
                          <span
                            className={`inline-block w-3 h-3 md:w-4 md:h-4 transform transition-transform rounded-full bg-white ${
                              isCashOnDeliveryEnabled ? "translate-x-5 md:translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
                          {isCashOnDeliveryEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* M-Pesa Payment Card */}
            <motion.div
              className="bg-white dark:bg-gray-700 rounded-lg md:rounded-xl shadow-sm md:shadow-md overflow-hidden border-l-4 border-green-500 dark:border-green-400"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 md:p-6 flex items-start">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <FiDollarSign className="text-green-600 dark:text-green-400 text-xl md:text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                    M-Pesa Payments
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
                    Mobile money payments via M-Pesa
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      <FiCheck className="mr-1" /> Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">Total Orders (COD)</p>
                  <h3 className="text-xl md:text-2xl font-bold mt-1 md:mt-2 text-gray-900 dark:text-gray-100 truncate">
                    {isLoading || !codStats ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      codStats.totalCODOrders.toLocaleString()
                    )}
                  </h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 md:p-3 rounded-full ml-2">
                  <FiTruck className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">COD Usage Rate</p>
                  <h3 className="text-xl md:text-2xl font-bold mt-1 md:mt-2 text-gray-900 dark:text-gray-100 truncate">
                    {isLoading || !codStats ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${codStats.codUsageRate.toFixed(1)}%`
                    )}
                  </h3>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 md:p-3 rounded-full ml-2">
                  <FaMoneyBillWave className="text-purple-600 dark:text-purple-400 text-lg md:text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">Avg. COD Order Value</p>
                  <h3 className="text-xl md:text-2xl font-bold mt-1 md:mt-2 text-gray-900 dark:text-gray-100 truncate">
                    {isLoading || !codStats ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      `${formatCurrency(+codStats?.avgCODOrderValue?.toFixed(2) || 0, {
                        locale: "en-KE", // Kenyan English locale
                        currency: "KES", // Kenyan Shillings currency code
                      })}`
                    )}
                  </h3>
                </div>
                <div className="bg-green-100 dark:bg-green-900/50 p-2 md:p-3 rounded-full ml-2">
                  <FiDollarSign className="text-green-600 dark:text-green-400 text-lg md:text-xl" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notification */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-4 right-4 p-3 md:p-4 rounded-lg shadow-lg text-sm md:text-base ${
                  notification.success
                    ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                }`}
              >
                <div className="flex items-center">
                  {notification.success ? <FiCheck className="mr-2" /> : <FiX className="mr-2" />}
                  <span>{notification.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethodsAdmin;
