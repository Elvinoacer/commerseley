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
  // const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchCustomer = async () => {
      const data = await getCustomerById(customerId as string);

      console.log("Yiur ===", customer);
      if (!data) {
        toast({ title: "Customer not found" });
        return;
      }
      setCustomer(data!.data);
    };

    fetchCustomer();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-12">Customer not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Details</h1>
        <p className="text-gray-600 mt-2">Managing customer: {customer.name || customer.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["profile", "orders", "addresses", "stats"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {customer && (
          <div className="p-6">
            {activeTab === "profile" && <CustomerProfile customer={customer} />}
            {activeTab === "orders" && <CustomerOrders orders={customer.orders} />}
            {activeTab === "addresses" && <CustomerAddresses addresses={customer.addresses} />}
            {activeTab === "stats" && (
              <CustomerStats customer={customer} orders={customer.orders} addresses={customer.addresses} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
