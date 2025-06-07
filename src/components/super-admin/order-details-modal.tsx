"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const paymentStatusColors = {
    PENDING: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const orderStatusColors = {
    PENDING: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-cyan-100 text-cyan-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 border-b pb-6">
                <motion.h2
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </motion.h2>
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-500"
                >
                  Placed on {formatDate(order.createdAt)}
                </motion.p>
              </div>

              {/* Grid Layout */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Customer Info */}
                  <div className="rounded-xl bg-gray-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium text-gray-600">Name:</span>{" "}
                        {order.user?.name || order.name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>{" "}
                        {order.email}
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>{" "}
                        {order.address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="rounded-xl bg-gray-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      Shipping Address
                    </h3>
                    <div className="space-y-3">
                      <p>{order.address?.address}</p>
                      <p>
                        {order.address?.city}, {order.address?.postalCode}
                      </p>
                      <p>{order.address?.country}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {/* Order Summary */}
                  <div className="rounded-xl border p-5">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      Order Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            orderStatusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            paymentStatusColors[order.paymentStatus]
                          }`}
                        >
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${order.total?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between border-t pt-3 font-medium">
                        <span>Total:</span>
                        <span className="text-lg">
                          ${order.total?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="rounded-xl border p-5">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">
                      Order Items ({order.items?.length})
                    </h3>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-4"
                        >
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <img
                              src={
                                item.orderImages[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="font-medium">
                            Kes {item.price?.toFixed(2)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-end gap-3"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-3"
                >
                  Close
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white hover:from-indigo-700 hover:to-purple-700"
                >
                  Print Receipt
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
