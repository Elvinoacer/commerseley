// components/AdminActivityFeed.tsx
"use client";

import { useAdminActivityStore } from "@/store/useAdminActivityStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPackage, FiLayers, FiTrash2, FiEdit, FiAlertCircle, FiSearch } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import { useDebounce } from "@/hooks/useDebounce";

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
      <span className="font-semibold">{adminName}</span> removed the category:{" "}
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
  const { activities, isLoading, error, fetchActivities, currentPage, totalPages, searchQuery, setSearchQuery } =
    useAdminActivityStore();
  const { user } = useAuthStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    fetchActivities(1, debouncedSearch);
  }, [debouncedSearch, fetchActivities]);

  const handlePageChange = (page: number) => {
    fetchActivities(page, searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          Recent Activities
        </motion.h1>

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
    </div>
  );
}
