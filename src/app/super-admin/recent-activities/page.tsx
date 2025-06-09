// components/AdminActivityFeed.tsx
"use client";

import { useAdminActivityStore } from "@/store/useAdminActivityStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPackage, FiLayers, FiTrash2, FiEdit, FiAlertCircle, FiSearch, FiBell, FiX } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import { useDebounce } from "@/hooks/useDebounce";
import { NotificationAction } from "@/types";

const actionIcons = {
  ADDED_PRODUCT: <FiPackage className="text-green-500" />,
  ADDED_COLLECTION: <FiLayers className="text-blue-500" />,
  REMOVED_CATEGORY: <FiTrash2 className="text-red-500" />,
  UPDATED_CATEGORY: <FiEdit className="text-yellow-500" />,
  DELETED_PRODUCTS: <FiTrash2 className="text-red-500" />,
  OUT_OF_STOCK: <FiAlertCircle className="text-orange-500" />,
};

const actionMessages = {
  ADDED_PRODUCT: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{adminName}</span> added a new product:{" "}
      <span className="font-semibold">{details?.productName || "Untitled Product"}</span>
    </>
  ),
  ADDED_COLLECTION: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{adminName}</span> created a new collection:{" "}
      <span className="font-semibold">{details?.collectionName || "Untitled Collection"}</span>
    </>
  ),
  REMOVED_CATEGORY: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{adminName}</span> removed the category:
      <span className="font-semibold">{details?.categoryName || "Untitled Category"}</span>
    </>
  ),
  UPDATED_CATEGORY: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{adminName}</span> updated the category:{" "}
      <span className="font-semibold">{details?.categoryName || "Untitled Category"}</span>
    </>
  ),
  DELETED_PRODUCTS: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{adminName}</span> deleted{" "}
      <span className="font-semibold">{details?.count || "several"} products</span>
    </>
  ),
  OUT_OF_STOCK: (adminName: string, details: any) => (
    <>
      <span className="font-semibold">{details?.productName || "A product"}</span> is now{" "}
      <span className="font-semibold text-orange-500">out of stock</span>
    </>
  ),
};

export default function AdminActivityFeed() {
  const {
    activities,
    isLoading,
    error,
    fetchActivities,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    sendNotifications, // Added from store
  } = useAdminActivityStore();

  const { user } = useAuthStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchActivities(1, debouncedSearch);
  }, [debouncedSearch, fetchActivities]);

  const handlePageChange = (page: number) => {
    fetchActivities(page, searchQuery);
  };

  const handleNotifyCustomers = async () => {
    if (!selectedActivity) return;

    const activity = activities.find((a) => a.id === selectedActivity);
    if (!activity) return;

    try {
      // Use the sendNotifications function from the store
      await sendNotifications(activity.action as NotificationAction);

      setSendStatus({
        success: true,
        message: "Notifications sent successfully!",
      });

      // Close modal after 2 seconds if successful
      setTimeout(() => {
        setIsNotifyModalOpen(false);
      }, 2000);
    } catch (error) {
      setSendStatus({
        success: false,
        message: "Failed to send notifications",
      });
    }
  };

  const getActivityMessage = (activity: any) => {
    const messageParts = actionMessages[activity.action](
      user?.id === activity.admin.id ? "You" : activity.admin.name || "Admin",
      activity.details
    ).props.children;

    // Flatten the message parts into a single string
    return messageParts.map((part: any) => (typeof part === "string" ? part : "")).join("");
  };

  console.log(isLoading);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            Recent Activities
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotifyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <FiBell className="text-lg" />
            <span>Notify Customers</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Search activities..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                      {actionIcons[activity.action]}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-700">
                        {actionMessages[activity.action](
                          user?.id === activity.admin.id ? "You" : activity.admin.name || "Admin",
                          activity.details
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isLoading && activities.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-500">
              {searchQuery ? "No activities match your search" : "No recent activities found"}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {isNotifyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
                {/* Radial gradient decoration */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>

                <div className="relative z-10 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Notify Customers</h2>
                    <button
                      onClick={() => {
                        setIsNotifyModalOpen(false);
                        setSelectedActivity(null);
                        setSendStatus(null);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <FiX className="text-gray-500 text-xl" />
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6">Select an activity to notify your subscribers about</p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recent Activities</label>
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                      {activities.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No activities found</div>
                      ) : (
                        activities.map((activity) => (
                          <div
                            key={activity.id}
                            onClick={() => setSelectedActivity(activity.id)}
                            className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                              selectedActivity === activity.id
                                ? "bg-purple-50 border-l-4 border-l-purple-500"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
                                {actionIcons[activity.action]}
                              </div>
                              <div>
                                <div className="text-gray-700 line-clamp-1">
                                  {actionMessages[activity.action](
                                    user?.id === activity.admin.id ? "You" : activity.admin.name || "Admin",
                                    activity.details
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {sendStatus && (
                    <div
                      className={`p-3 rounded-lg mb-4 ${
                        sendStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sendStatus.message}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsNotifyModalOpen(false);
                        setSelectedActivity(null);
                        setSendStatus(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNotifyCustomers}
                      disabled={!selectedActivity || isLoading}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        !selectedActivity || isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send Notifications"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
