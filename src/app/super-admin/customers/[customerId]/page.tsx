"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { UserWithRelations } from "@/types";
import CustomerProfile from "@/components/super-admin/CustomerProfile";
import CustomerOrders from "@/components/super-admin/CustomerOrders";
import CustomerAddresses from "@/components/super-admin/CustomerAddresses";
import CustomerStats from "@/components/super-admin/CustomerStats";
import { useCustomersStore } from "@/store/useCustomerStore";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<UserWithRelations | null>(null);
  const { getCustomerById, isLoading, error } = useCustomersStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchCustomer = async () => {
      const data = await getCustomerById(customerId as string);

      if (!data) {
        toast({ title: "Customer not found" });
        return;
      }
      setCustomer(data.data);
    };

    fetchCustomer();
  }, [customerId, getCustomerById, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-400 text-red-700 dark:text-red-200 rounded-lg text-sm sm:text-base">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-8 sm:py-12 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        Customer not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-2 sm:p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
              Customer Details
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">
              Managing customer: {customer.name || customer.email}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
            {/* Tabs - Responsive with smaller text and padding on mobile */}
            <div className="border-b border-gray-200 dark:border-gray-600 overflow-x-auto">
              <nav className="flex -mb-px min-w-max">
                {["profile", "orders", "addresses", "stats"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-3 sm:py-4 sm:px-6 text-center border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                    aria-label={`View ${tab} tab`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content - Adjusted padding for mobile */}
            {customer && (
              <div className="p-3 sm:p-4 md:p-6">
                {activeTab === "profile" && <CustomerProfile customer={customer} />}
                {activeTab === "orders" && <CustomerOrders orders={customer.orders} />}
                {activeTab === "addresses" && <CustomerAddresses addresses={customer.addresses} />}
                {activeTab === "stats" && (
                  <CustomerStats customer={customer} orders={customer.orders} addresses={customer.addresses} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
