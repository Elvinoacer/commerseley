"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useAdminActivityStore } from "@/store/useAdminActivityStore";
import { NotificationAction } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiBell, FiEdit, FiLayers, FiPackage, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";

const actionIcons = {
  ADDED_PRODUCT: <FiPackage className="text-green-500 dark:text-green-400" />,
  ADDED_COLLECTION: <FiLayers className="text-blue-500 dark:text-blue-400" />,
  REMOVED_CATEGORY: <FiTrash2 className="text-red-500 dark:text-red-400" />,
  UPDATED_CATEGORY: <FiEdit className="text-yellow-500 dark:text-yellow-400" />,
  DELETED_PRODUCTS: <FiTrash2 className="text-red-500 dark:text-red-400" />,
  OUT_OF_STOCK: <FiAlertCircle className="text-orange-500 dark:text-orange-400" />,
};

const actionMessages = {
  ADDED_PRODUCT: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{adminName}</span> added a new product:{" "}
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        {details?.productName || "Untitled Product"}
      </span>
    </>
  ),
  ADDED_COLLECTION: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{adminName}</span> created a new collection:{" "}
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        {details?.collectionName || "Untitled Collection"}
      </span>
    </>
  ),
  REMOVED_CATEGORY: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{adminName}</span> removed the category:{" "}
      <span className="font-semibold text-red-600 dark:text-red-400">
        {details?.categoryName || "Untitled Category"}
      </span>
    </>
  ),
  UPDATED_CATEGORY: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{adminName}</span> updated the category:{" "}
      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
        {details?.categoryName || "Untitled Category"}
      </span>
    </>
  ),
  DELETED_PRODUCTS: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{adminName}</span> deleted{" "}
      <span className="font-semibold text-red-600 dark:text-red-400">{details?.count || "several"} products</span>
    </>
  ),
  OUT_OF_STOCK: (adminName: string, details: any) => (
    <>
      <span className="font-semibold text-gray-900 dark:text-gray-100">{details?.productName || "A product"}</span> is
      now <span className="font-semibold text-orange-500 dark:text-orange-400">out of stock</span>
    </>
  ),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, x: 20 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: { opacity: 0, scale: 0.95 },
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
    sendNotifications,
  } = useAdminActivityStore();

  const { data } = useSession();
  const { user } = data || {};
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
      await sendNotifications(activity.action as NotificationAction);
      setSendStatus({
        success: true,
        message: "Notifications sent successfully!",
      });
      setTimeout(() => setIsNotifyModalOpen(false), 2000);
    } catch (error) {
      setSendStatus({
        success: false,
        message: "Failed to send notifications",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <motion.h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
              Recent Activities
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifyModalOpen(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md transition-all text-sm sm:text-base",
                "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white",
                "hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600"
              )}
              aria-label="Notify customers"
            >
              <FiBell className="text-sm sm:text-base" />
              <span>Notify</span>
            </motion.button>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500 dark:text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              className={cn(
                "block w-full pl-9 pr-3 py-2 rounded-lg shadow-sm focus:outline-none text-sm sm:text-base",
                "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              )}
              placeholder="Search activities..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              aria-label="Search activities"
            />
          </motion.div>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-800 dark:text-red-200 p-3 mb-4 rounded text-sm"
            >
              <p>{error}</p>
            </motion.div>
          )}

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -2 }}
                  className={cn(
                    "bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600",
                    "transition-all hover:shadow-md"
                  )}
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/50 dark:to-purple-900/50">
                        {actionIcons[activity.action]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                          {actionMessages[activity.action](
                            user?.id === activity.admin.id ? "You" : activity.admin.name || "Admin",
                            activity.details
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!isLoading && activities.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base"
              >
                {searchQuery ? "No activities match your search" : "No recent activities found"}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mt-6"
              >
                <nav className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-2 py-1 sm:px-3 sm:py-1 rounded-md border text-xs sm:text-sm",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                    )}
                    aria-label="Previous page"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm min-w-[1.75rem] sm:min-w-[2.5rem]",
                        currentPage === page
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                          : "border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                      )}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-2 py-1 sm:px-3 sm:py-1 rounded-md border text-xs sm:text-sm",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                    )}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </nav>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Notification Modal */}
        <AnimatePresence>
          {isNotifyModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
              >
                <div
                  className={cn(
                    "relative rounded-xl sm:rounded-2xl shadow-xl overflow-hidden",
                    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {/* Radial gradient decoration */}
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-900/20 rounded-full filter blur-3xl"></div>
                  <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-200/20 dark:bg-purple-900/20 rounded-full filter blur-3xl"></div>

                  <div className="relative z-10 p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Notify Customers
                      </h2>
                      <button
                        onClick={() => {
                          setIsNotifyModalOpen(false);
                          setSelectedActivity(null);
                          setSendStatus(null);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                      >
                        <FiX className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl" />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                      Select an activity to notify your subscribers about
                    </p>

                    <div className="mb-4 sm:mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                        Recent Activities
                      </label>
                      <div className="max-h-[50vh] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                        {activities.length === 0 ? (
                          <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                            No activities found
                          </div>
                        ) : (
                          activities.map((activity) => (
                            <motion.div
                              key={activity.id}
                              layout
                              onClick={() => setSelectedActivity(activity.id)}
                              className={cn(
                                "p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0 cursor-pointer transition-colors",
                                "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50",
                                selectedActivity === activity.id
                                  ? "bg-indigo-100/50 dark:bg-indigo-900/50 border-l-4 border-l-indigo-500 dark:border-l-indigo-400"
                                  : ""
                              )}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1 sm:p-2 rounded-lg bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/50 dark:to-purple-900/50">
                                  {actionIcons[activity.action]}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {actionMessages[activity.action](
                                      user?.id === activity.admin.id ? "You" : activity.admin.name || "Admin",
                                      activity.details
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>

                    {sendStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-2 sm:p-3 rounded-lg mb-3 text-xs sm:text-sm",
                          sendStatus.success
                            ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                        )}
                      >
                        {sendStatus.message}
                      </motion.div>
                    )}

                    <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setIsNotifyModalOpen(false);
                          setSelectedActivity(null);
                          setSendStatus(null);
                        }}
                        className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Cancel"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleNotifyCustomers}
                        disabled={!selectedActivity || isLoading}
                        className={cn(
                          "px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm text-white transition-colors",
                          !selectedActivity || isLoading
                            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600"
                        )}
                        aria-label="Send notifications"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-1 sm:gap-2">
                            <svg
                              className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white"
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
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
